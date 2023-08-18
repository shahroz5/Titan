import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { take, filter, takeUntil, withLatestFrom } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { MatSelectChange } from '@angular/material/select';
import { getRoleLimitRequestsRouteUrl } from '@poss-web/shared/util-site-routes';
import {
  RoleDetail,
  CustomErrors,
  OverlayNotificationServiceAbstraction,
  SelectDropDownOption,
  OverlayNotificationType
} from '@poss-web/shared/models';
import { RoleConfigFacade } from '@poss-web/shared/role-config/data-access-role-config';
import { ProfileDataFacade } from '@poss-web/shared/profile/data-access-profile';
import { PermissionFacade } from '@poss-web/shared/permission/data-access-permission';
import { ElementPermissionService } from '@poss-web/shared/permission/util-element-permissions';

@Component({
  templateUrl: './role-config-listing.component.html',
  styleUrls: ['./role-config-listing.component.scss']
})
export class RoleConfigListingComponent implements OnInit, OnDestroy {
  rolesList$: Observable<RoleDetail[]>;
  isLoading$: Observable<boolean>;
  selectedLocationFormat: string;
  locationformats: SelectDropDownOption[] = [];
  isBTQUser: boolean;
  destroy$: Subject<null> = new Subject<null>();
  permissions$: Observable<any[]>;
  ROLELIMIT_SELECT_LOCATION_FORMAT = 'Uam Role Limit - Select Location Format';
  SEND_REQUEST_FOR_EMPLOYEE_LIMIT =
    'Uam Role Mgmt - Send Request For Employee Limit Tab';

  constructor(
    public router: Router,
    private roleConfigFacade: RoleConfigFacade,
    private profileData: ProfileDataFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private translate: TranslateService,
    private permissionfacade: PermissionFacade,
    private elementPermission: ElementPermissionService
  ) {
    roleConfigFacade.resetRoleCountRequestList();

    profileData
      .getBoutiqueType()
      .pipe(withLatestFrom(profileData.isBTQUser()), take(1))
      .subscribe(([val, val1]) => {
        this.isBTQUser = val1;

        if (!this.isBTQUser) {
          this.roleConfigFacade.loadlocationformats();
          this.roleConfigFacade
            .fetchLocationFormats()
            .pipe(
              filter(list => !!list),
              takeUntil(this.destroy$)
            )
            .subscribe(locationformats => {
              this.locationformats = [];
              locationformats.forEach(locationformat => {
                this.locationformats.push({
                  value: locationformat.code,
                  description: locationformat.value
                });
              });
            });
        } else {
          this.loadRoles();
        }
      });

    roleConfigFacade
      .getError()
      .pipe(
        takeUntil(this.destroy$),
        filter(errorVal => !!errorVal)
      )
      .subscribe(errorVal => {
        this.showNotification(errorVal);
      });
  }

  ngOnInit() {
    this.permissions$ = this.permissionfacade.getPermissionforURL();
    this.isLoading$ = this.roleConfigFacade.isLoading();
    this.rolesList$ = this.roleConfigFacade.getRolesList();
  }

  loadPermission = (element: string) =>
    this.elementPermission.loadPermission(element, this.permissions$);

  loadRoles = (locationCode?: string, locationFormat?: string) =>
    this.roleConfigFacade.loadRolesforCount(
      this.isBTQUser,
      undefined,
      locationCode,
      locationFormat
    );

  roleCountChange(event: any) {
    this.roleConfigFacade.requestRoleCountChange(
      event.rolesCount,
      event.remarks,
      undefined,
      this.selectedLocationFormat
    );

    this.roleConfigFacade
      .isRoleCountChanged()
      .pipe(
        filter(status => status),
        take(1)
      )
      .subscribe(status =>
        this.translate
          .get(
            this.isBTQUser
              ? 'pw.roleCountFormNotificationMessages.roleCountRequestSuccessfullMessage'
              : 'pw.roleCountFormNotificationMessages.locationformatRoleCountChangeSuccessfullMessage',
            { roleCount: event.rolesCount.length }
          )
          .pipe(take(1))
          .subscribe(message => this.showNotification(undefined, message))
      );
  }

  locationFormatChange(event: MatSelectChange) {
    this.roleConfigFacade.resetRoleCountRequestList();
    if (event.value) {
      this.loadRoles(undefined, event.value);
      this.selectedLocationFormat = event.value;
    } else {
      this.selectedLocationFormat = '';
      this.overlayNotification.close();
    }
  }

  showNotification(error?: CustomErrors, message?: string) {
    this.overlayNotification
      .show({
        type: !!error
          ? OverlayNotificationType.ERROR
          : OverlayNotificationType.SIMPLE,
        message: message,
        error: error,
        hasBackdrop: !!message,
        hasClose: true
      })
      .events.pipe(take(1))
      .subscribe(() => {
        if (message) {
          if (this.isBTQUser) {
            this.router.navigate([getRoleLimitRequestsRouteUrl()]);
          }
          this.selectedLocationFormat = '';
          this.roleConfigFacade.resetRoleCountRequestList();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
