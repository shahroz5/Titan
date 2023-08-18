import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { take, filter, takeUntil, map } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

import {
  RoleDetail,
  CustomErrors,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType
} from '@poss-web/shared/models';
import { RoleConfigFacade } from '@poss-web/shared/role-config/data-access-role-config';
import {
  SelectionDailogOption,
  SelectionDialogService
} from '@poss-web/shared/components/ui-selection-dialog';
import { PermissionFacade } from '@poss-web/shared/permission/data-access-permission';
import { ElementPermissionService } from '@poss-web/shared/permission/util-element-permissions';

@Component({
  templateUrl: './custom-role-config-listing.component.html',
  styleUrls: ['./custom-role-config-listing.component.scss']
})
export class CustomRoleConfigListingComponent implements OnInit, OnDestroy {
  rolesList$: Observable<RoleDetail[]>;
  isLoading$: Observable<boolean>;
  selectedLocation: string;
  locations: SelectionDailogOption[] = [];
  destroy$: Subject<null> = new Subject<null>();
  locationSelectorMessages = [];
  permissions$: Observable<any[]>;
  ROLELIMIT_CUSTOMIZE_SELECT_LOCATION_CODE =
    'Uam Role Limit - Select Location Code';

  constructor(
    private roleConfigFacade: RoleConfigFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private translate: TranslateService,
    private selectionDialog: SelectionDialogService,
    private permissionfacade: PermissionFacade,
    private elementPermission: ElementPermissionService
  ) {
    roleConfigFacade.resetRoleCountRequestList();
    roleConfigFacade
      .getError()
      .pipe(
        takeUntil(this.destroy$),
        filter(errorVal => !!errorVal)
      )
      .subscribe(errorVal => {
        this.showNotification(errorVal);
      });

    this.translate
      .get([
        'pw.roleCountForm.locationSelectorButtonText',
        'pw.roleCountForm.locationSelectorPlaceHolderText'
      ])
      .pipe(take(1))
      .subscribe(messages => (this.locationSelectorMessages = messages));
  }

  ngOnInit() {
    this.permissions$ = this.permissionfacade.getPermissionforURL();
    this.isLoading$ = this.roleConfigFacade.isLoading();
    this.rolesList$ = this.roleConfigFacade.getRolesList();
    this.roleConfigFacade.loadlocations();
    this.roleConfigFacade
      .fetchLocations()
      .pipe(
        takeUntil(this.destroy$),
        filter(locations => locations && locations.length > 0),
        map(locations =>
          locations.map(location => ({
            id: location.locationCode,
            description: location.locationCode + ' - ' + location.description
          }))
        )
      )
      .subscribe(locations => (this.locations = locations));
  }

  loadPermission = (element: string) =>
    this.elementPermission.loadPermission(element, this.permissions$);

  loadRoles = (locationCode?: string, locationFormat?: string) =>
    this.roleConfigFacade.loadRolesforCount(
      false,
      undefined,
      locationCode,
      locationFormat
    );

  roleCountChange(event: any) {
    this.roleConfigFacade.requestRoleCountChange(
      event.rolesCount,
      event.remarks,
      undefined,
      this.selectedLocation.split('-')[0]
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
            'pw.roleCountFormNotificationMessages.locationcodeRoleCountChangeSuccessfullMessage'
          )
          .pipe(take(1))
          .subscribe(message => this.showNotification(undefined, message))
      );
  }

  openLocationSelectionPopup() {
    this.selectionDialog
      .open({
        title: this.locationSelectorMessages[
          'pw.roleCountForm.locationSelectorButtonText'
        ],
        placeholder: this.locationSelectorMessages[
          'pw.roleCountForm.locationSelectorPlaceHolderText'
        ],
        options: this.locations
      })
      .pipe(
        take(1),
        filter(selectedOption => !!selectedOption)
      )
      .subscribe((selectedOption: SelectionDailogOption) => {
        this.selectedLocation = selectedOption.description;
        this.loadRoles(selectedOption.id);
      });
  }

  clearLocationSelection() {
    this.selectedLocation = '';
    this.roleConfigFacade.resetRoleCountRequestList();
    this.overlayNotification.close();
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
          this.selectedLocation = '';
          this.roleConfigFacade.resetRoleCountRequestList();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
