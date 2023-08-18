import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  OnDestroy
} from '@angular/core';
import { Subscription, Subject, Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { take, takeUntil, distinctUntilChanged } from 'rxjs/operators';

import {
  RoleDetail,
  RoleCountRequest,
  OverlayNotificationServiceAbstraction
} from '@poss-web/shared/models';
import {
  OverlayNotificationType,
  OverlayNotificationEventType
} from '@poss-web/shared/models';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ElementPermissionService } from '@poss-web/shared/permission/util-element-permissions';

@Component({
  selector: 'poss-web-role-config-list',
  templateUrl: './role-config-list.component.html',
  styleUrls: ['./role-config-list.component.scss']
})
export class RoleConfigListComponent implements OnChanges, OnDestroy {
  @Input() rolesList: RoleDetail[] = [];
  @Input() isBTQUser;
  @Input() permissions$?: Observable<any[]>;

  @Output() rolesRequested = new EventEmitter<any>();

  overlayNotificationSub: Subscription;
  totalRolesRequested = 0;
  rolesData: Map<string, number> = new Map<string, number>();
  roleForm: FormGroup;
  regExp: RegExp = new RegExp(`^[0-9]*$`, 'i');
  destroy$: Subject<null> = new Subject<null>();

  ROLELIMIT_TOTAL_EMPLOYEES_REQUESTED_TEXT =
    'Uam Role Limit - Total Employees Requested';
  ROLELIMIT_DEFAULT_EMPLOYEE_LIMIT = 'Uam Role Limit - Default Employee Limit';
  ROLELIMIT_EXISTING_EMPLOYEE_LIMIT =
    'Uam Role Limit - Existing Employee Limit';
  ROLELIMIT_REQUESTED_EMPLOYEE_LIMIT =
    'Uam Role Limit - Requested Employee Limit';
  ROLELIMIT_ASSIGNED_EMPLOYEE_LIMIT =
    'Uam Role Limit - Assigned Employee Limit';

  constructor(
    private formbuilder: FormBuilder,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private translate: TranslateService,
    private router: Router,
    private elementPermission: ElementPermissionService
  ) {
    this.roleForm = formbuilder.group({});
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['rolesList'] && changes['rolesList'].currentValue) {
      this.rolesList.forEach(role => {
        this.roleForm.addControl(
          role.roleCode,
          new FormControl(role.userLimit)
        );

        this.roleForm
          .get(role.roleCode)
          .setValidators((control: FormControl) =>
            this.isBTQUser && control.value < role.userLimit
              ? { minLength: true }
              : null
          );

        this.roleForm
          .get(role.roleCode)
          .valueChanges.pipe(
            takeUntil(this.destroy$),
            distinctUntilChanged((a, b) => a === b)
          )
          .subscribe(value => {
            if (this.rolesData.get(role.roleCode)) {
              this.totalRolesRequested -=
                this.rolesData.get(role.roleCode) - role.userLimit;
            }
            this.totalRolesRequested += value - role.userLimit;
            this.rolesData.set(role.roleCode, value);
            if (
              (this.isBTQUser && value <= role.userLimit) ||
              (!this.isBTQUser && value === role.userLimit)
            ) {
              this.totalRolesRequested -=
                this.rolesData.get(role.roleCode) - role.userLimit;
              this.rolesData.delete(role.roleCode);
            }
            if (
              this.rolesData.size > 0 &&
              this.rolesData.get(role.roleCode) > 0
            ) {
              if (
                !this.overlayNotificationSub ||
                this.overlayNotificationSub.closed
              ) {
                this.showConfirmNotification();
              }
            } else if (!!this.overlayNotificationSub) {
              this.overlayNotificationSub.unsubscribe();
              this.overlayNotification.close();
            }
          });
      });
      this.overlayNotification.close();
    }
  }

  loadPermission = (element: string) =>
    this.elementPermission.loadPermission(element, this.permissions$);

  showConfirmNotification() {
    const msgKey = this.isBTQUser
      ? 'pw.roleCountFormNotificationMessages.roleCountRequestConfirmationMessage'
      : this.router.url.includes('customize')
      ? 'pw.roleCountFormNotificationMessages.locationcodeRoleCountChangeConfirmationMessage'
      : 'pw.roleCountFormNotificationMessages.locationformatRoleCountChangeConfirmationMessage';
    const buttonKey = this.isBTQUser
      ? 'pw.roleCountFormNotificationMessages.sentRequestConfirmButtontext'
      : 'pw.roleCountFormNotificationMessages.saveConfirmButtontext';
    this.translate
      .get([msgKey, buttonKey])
      .pipe(take(1))
      .subscribe(messages => {
        this.overlayNotificationSub = this.overlayNotification
          .show({
            type: OverlayNotificationType.ACTION,
            message: messages[msgKey],
            buttonText: messages[buttonKey],
            hasRemarks: this.isBTQUser,
            isRemarksMandatory: this.isBTQUser
          })
          .events.subscribe(overlayEvent => {
            if (overlayEvent.eventType === OverlayNotificationEventType.TRUE) {
              const rolesRequested: RoleCountRequest[] = [];
              this.rolesData.forEach((value, key) =>
                rolesRequested.push({ reqValue: value, roleCode: key })
              );
              this.rolesRequested.emit({
                rolesCount: rolesRequested,
                remarks: overlayEvent.data
              });
              this.overlayNotificationSub.unsubscribe();
            }
          });
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
