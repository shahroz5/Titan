import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { take } from 'rxjs/operators';
import { MatCheckboxChange } from '@angular/material/checkbox';

import {
  RoleCountRequestStatusColorsEnum,
  RoleCountRequestList,
  RequestedRole,
  RoleCountRequest,
  RoleCountRequestEnum,
  OverlayNotificationServiceAbstraction
} from '@poss-web/shared/models';
import {
  OverlayNotificationType,
  OverlayNotificationEventRef
} from '@poss-web/shared/models';
import { PermissionService } from '@poss-web/shared/permission/ui-permission';
import { ElementPermissionService } from '@poss-web/shared/permission/util-element-permissions';
import { Observable } from 'rxjs';

@Component({
  selector: 'poss-web-request-detail',
  templateUrl: './request-detail.component.html'
})
export class RequestDetailComponent implements OnChanges {
  @Input() item: RoleCountRequestList;
  @Input() requestedRoles: RequestedRole[];
  @Input() isBTQuser = false;
  @Input() approvalTransactionCodes?: string[];
  @Input() permissions$?: Observable<any[]>;

  @Output() rolesAllocated = new EventEmitter<any>();

  rolesRequest: Map<string, RoleCountRequest> = new Map<
    string,
    RoleCountRequest
  >();
  hasApprovePermission;
  ROLELIMIT_REQUEST_NUMBER_LABEL_TEXT =
    'Uam Role Limit - Request Number Label Text in Details';
  ROLELIMIT_LOCATION_CODE_LABEL_TEXT =
    'Uam Role Limit - Location Code Text in Details';

  constructor(
    private translate: TranslateService,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private permissionService: PermissionService,
    private elementPermission: ElementPermissionService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (
      (changes['item'] && changes['item'].currentValue) ||
      this.approvalTransactionCodes
    ) {
      if (
        (this.item && this.item.status) === RoleCountRequestEnum.PENDING &&
        !!this.approvalTransactionCodes
      ) {
        this.hasApprovePermission = this.approvalTransactionCodes.find(key =>
          this.permissionService.hasPermission(key)
        );

        if (this.hasApprovePermission) {
          this.showConfirmNotification();
        }

        this.requestedRoles.forEach(role =>
          this.rolesRequest.set(role.roleCode, {
            reqValue: role.reqValue,
            roleCode: role.roleCode
          })
        );
      }
    }
  }

  loadPermission = (element: string) =>
    this.elementPermission.loadPermission(element, this.permissions$);

  getStatusColor = (status: string): string =>
    RoleCountRequestStatusColorsEnum[status.toUpperCase()];

  showConfirmNotification() {
    const key =
      'pw.roleCountDetailNotificationMessages.roleCountRequestApprovalConfirmationMessage';
    const buttonKey1 = 'pw.roleCountRequestDetail.rejectButtonText';
    const buttonKey2 = 'pw.roleCountRequestDetail.acceptButtonText';
    this.translate
      .get([key, buttonKey1, buttonKey2])
      .pipe(take(1))
      .subscribe(translatedMessages => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.MULTI_ACTION,
            message: translatedMessages[key],
            buttons: [
              {
                id: 1,
                text: translatedMessages[buttonKey1],
                css: 'pw-primary-btn',
                hasRemarksValidation: true
              },
              {
                id: 2,
                text: translatedMessages[buttonKey2],
                css: 'pw-accent-btn',
                hasRemarksValidation: true
              }
            ],
            hasRemarks: !this.isBTQuser,
            isRemarksMandatory: !this.isBTQuser
          })
          .events.subscribe((overlayEvent: OverlayNotificationEventRef) => {
            if (overlayEvent.selectedId === 2) {
              const rolesRequested: RoleCountRequest[] = [];
              for (const request of this.rolesRequest.values()) {
                rolesRequested.push(request);
              }
              this.rolesAllocated.emit({
                approvalRemarks: overlayEvent.data,
                roles: rolesRequested,
                status:
                  rolesRequested.length === this.requestedRoles.length
                    ? RoleCountRequestEnum.APPROVED
                    : RoleCountRequestEnum.PARTIAL_APPROVED
              });
            } else {
              this.rolesAllocated.emit({
                approvalRemarks: overlayEvent.data,
                status: RoleCountRequestEnum.REJECTED
              });
            }
          });
      });
  }

  updateRolesRequest(event: MatCheckboxChange, reqValue: number) {
    event.checked
      ? this.rolesRequest.set(event.source.id, {
          reqValue: reqValue,
          roleCode: event.source.id
        })
      : this.rolesRequest.delete(event.source.id);
  }

  checkStatus = (): boolean =>
    this.item.status === RoleCountRequestEnum.PENDING;
}
