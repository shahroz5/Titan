import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { FilterService } from '@poss-web/shared/components/ui-filter-dialog';
import {
  CustomErrors,
  Filter,
  FilterActions,
  OverlayNotificationEventType,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  RoleDetail,
  RoleTypesData
} from '@poss-web/shared/models';
import { PermissionFacade } from '@poss-web/shared/permission/data-access-permission';
import { RoleManagementFacade } from '@poss-web/shared/role-mgmt/data-access-role-mgmt';
import { NewRoleFormComponent } from '@poss-web/shared/role-mgmt/ui-role-create-form';
import { EditRoleFormComponent } from '@poss-web/shared/role-mgmt/ui-role-edit-form';
import { ViewRoleFormComponent } from '@poss-web/shared/role-mgmt/ui-role-view-form';

import { combineLatest, forkJoin, Observable, Subject } from 'rxjs';
import { filter, skip, take, takeUntil } from 'rxjs/operators';

@Component({
  templateUrl: './role-listing.component.html',
  styleUrls: ['./role-listing.component.scss']
})
export class RoleListingComponent implements OnInit, OnDestroy {
  rolesList$: Observable<RoleDetail[]>;
  isLoading$: Observable<boolean>;
  locationFormats: Map<string, string> = null;
  locationFormat$: Observable<any>;
  roleTypes$: Observable<any>;
  roleTypes: RoleTypesData[] = [];
  hasNotification = false;
  pageSizeOptions: number[] = [];
  roleListSize$: Observable<number>;
  destroy$: Subject<null> = new Subject<null>();

  message = null;
  filterList: { [key: string]: Filter[] };
  searchRoleCode: string;
  rolesPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };
  permissions$: Observable<any[]>;
  updaterolesuccessfullMessage =
    'pw.rolemanagementlistNotificationMessages.updaterolesuccessfullMessage';
  addrolesuccessfullMessage =
    'pw.rolemanagementlistNotificationMessages.addrolesuccessfullMessage';
  activaterolewarningMessage =
    'pw.rolemanagementlistNotificationMessages.activaterolewarningMessage';
  deactivaterolewarningMessage =
    'pw.rolemanagementlistNotificationMessages.deactivaterolewarningMessage';
  activaterolesuccessfullMessage =
    'pw.rolemanagementlistNotificationMessages.activaterolesuccessfullMessage';
  deactivaterolesuccessfullMessage =
    'pw.rolemanagementlistNotificationMessages.deactivaterolesuccessfullMessage';
  activateButton = 'pw.rolemanagementlist.btnText-Activate';
  deactivateButton = 'pw.rolemanagementlist.btnText-Deactivate';

  constructor(
    private roleMgmntfacade: RoleManagementFacade,
    private dialog: MatDialog,
    private appsettingFacade: AppsettingFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private translate: TranslateService,
    private filterService: FilterService,
    private permissionfacade: PermissionFacade
  ) {
    this.filterList = { 'Role Types': [], 'Location Formats': [] };

    forkJoin([
      appsettingFacade.getPageSize().pipe(take(1)),
      appsettingFacade.getPageSizeOptions().pipe(take(1))
    ]).subscribe(val => {
      this.rolesPageEvent.pageSize = val[0];
      this.pageSizeOptions = val[1];
      roleMgmntfacade.loadRoleTypes();
      roleMgmntfacade.loadlocationformats();
    });

    this.locationFormat$ = roleMgmntfacade.fetchLocationFormats();
    this.roleTypes$ = roleMgmntfacade.getRoleTypesList();

    const combineLocationRoleType = combineLatest([
      this.locationFormat$,
      this.roleTypes$
    ]);

    combineLocationRoleType
      .pipe(takeUntil(this.destroy$))
      .subscribe(([formats, roleTypes]) => {
        this.locationFormats = formats;

        this.roleTypes = roleTypes;
        const formatTypes = [];
        formats.forEach((value, key) => {
          formatTypes.push({
            id: key,
            description: value,
            selected: false
          });
        });
        this.filterService.DataSource = {
          'Role Types': roleTypes.map(item => {
            return {
              id: item.code,
              description: item.value,
              selected: false
            };
          }),
          'Location Formats': formatTypes
        };
      });
    this.loadRoles();
  }

  ngOnInit() {
    this.permissions$ = this.permissionfacade.getPermissionforURL();

    this.isLoading$ = this.roleMgmntfacade.isLoading();

    this.rolesList$ = this.roleMgmntfacade.getRolesList();
    this.roleListSize$ = this.roleMgmntfacade.getTotalRoles();

    this.roleMgmntfacade
      .getError()
      .pipe(
        takeUntil(this.destroy$),
        filter(errorVal => !!errorVal)
      )
      .subscribe(errorVal => this.showNotification(errorVal));

    this.roleMgmntfacade
      .getAddUpdateRoleStatus()
      .pipe(
        takeUntil(this.destroy$),
        filter(updated => !!updated)
      )
      .subscribe(role => {
        this.showNotification(undefined, this.message);
        this.loadRoles();
      });
  }

  openFilterDialog = () =>
    this.filterService
      .openDialog(1, this.filterList)
      .pipe(
        filter(response => response.actionfrom === FilterActions.APPLY),
        take(1)
      )
      .subscribe(responseData => {
        this.filterList = { ...this.filterList, ...responseData.data };
        this.rolesPageEvent.pageIndex = 0;
        this.loadRoles();
      });

  editAddRole(roleCode: string) {
    if (roleCode) {
      this.roleMgmntfacade.fetchRole(roleCode);
      this.roleMgmntfacade
        .fetchRoleDetails()
        .pipe(skip(1), take(1))
        .subscribe(roledetails =>
          this.opendialog(this.locationFormats, this.roleTypes, roledetails)
        );
    } else {
      this.opendialog(this.locationFormats, this.roleTypes);
    }
  }

  viewRole(roleCode: string) {
    if (roleCode) {
      this.roleMgmntfacade.fetchRole(roleCode);
      this.roleMgmntfacade
        .fetchRoleDetails()
        .pipe(skip(1), take(1))
        .subscribe(roledetails =>
          this.openViewDialog(this.locationFormats, this.roleTypes, roledetails)
        );
    }
  }

  opendialog(
    locationFormats: Map<string, string>,
    roleTypes?: RoleTypesData[],
    roleDetails?: RoleDetail
  ) {
    const dialogref = !!roleDetails
      ? this.dialog.open(EditRoleFormComponent, {
          width: '500px',
          data: {
            roleDetails,
            locationFormats,
            roleTypes
          },
          disableClose: true
        })
      : this.dialog.open(NewRoleFormComponent, {
          width: '500px',
          data: {
            locationFormats,
            roleTypes
          },
          disableClose: true
        });

    dialogref
      .afterClosed()
      .pipe(
        filter(roleFormValue => !!roleFormValue && roleFormValue !== 'close'),
        take(1)
      )
      .subscribe(roleFormValue => {
        this.translate
          .get(
            !!roleDetails
              ? this.updaterolesuccessfullMessage
              : this.addrolesuccessfullMessage,
            { rolename: roleFormValue.roleName }
          )
          .pipe(take(1))
          .subscribe(msg => (this.message = msg));

        !!roleDetails
          ? this.roleMgmntfacade.updateRole(roleFormValue.roleCode, {
              roleName: roleFormValue.roleName,
              description: roleFormValue.description,
              isLocationFormatUpdate: roleFormValue.isLocationFormatUpdate,
              ...(roleFormValue.isLocationFormatUpdate && {
                addRoleToLocationFormats: roleFormValue.addRoleToLocationFormats
              })
            })
          : this.roleMgmntfacade.addRole(roleFormValue);
      });
  }

  openViewDialog(
    locationFormats: Map<string, string>,
    roleTypes?: RoleTypesData[],
    roleDetails?: RoleDetail
    ) {
      const dialogref = this.dialog.open(ViewRoleFormComponent, {
          width: '500px',
          data: {
            roleDetails,
            locationFormats,
            roleTypes
          },
          disableClose: true
        })
  }

  toggleRole(event: any) {
    this.overlayConfirmation(
      event.roleName,
      event.roleCode,
      event.checked,
      event.checked
        ? this.activaterolewarningMessage
        : this.deactivaterolewarningMessage
    );
    this.translate
      .get(
        event.checked
          ? this.activaterolesuccessfullMessage
          : this.deactivaterolesuccessfullMessage,
        { rolename: event.roleName }
      )
      .pipe(take(1))
      .subscribe(msg => (this.message = msg));
  }

  overlayConfirmation(
    roleName: string,
    roleCode: string,
    isActive: boolean,
    alertMessage: string
  ) {
    this.hasNotification = true;
    const key = alertMessage;
    const buttonKey = isActive ? this.activateButton : this.deactivateButton;
    this.translate
      .get([key, buttonKey], {
        rolename: roleName
      })
      .pipe(take(1))
      .subscribe(msg =>
        this.overlayNotification
          .show({
            type: OverlayNotificationType.ACTION,
            message: msg[key],
            hasBackdrop: true,
            buttonText: msg[buttonKey],
            hasClose: true
          })
          .events.subscribe(overlayEvent => {
            this.hasNotification = false;
            if (overlayEvent.eventType === OverlayNotificationEventType.TRUE) {
              this.roleMgmntfacade.updateRole(roleCode, {
                isActive: isActive
              });

              this.roleMgmntfacade
                .getError()
                .pipe(
                  filter(errorVal => !!errorVal),
                  take(1)
                )
                .subscribe(errorVal => this.loadRoles());
            } else {
              this.loadRoles();
            }
          })
      );
  }

  searchRole(event: string) {
    this.searchRoleCode = event;
    this.rolesPageEvent.pageIndex = 0;

    this.loadRoles();
  }

  clearRoles() {
    this.roleMgmntfacade.clearRole();
  }

  loadInitialRoles() {
    this.searchRoleCode = '';
    this.loadRoles();
  }

  paginateRolesList(event: PageEvent) {
    this.rolesPageEvent = event;
    this.loadRoles();
  }

  loadRoles = () =>
    this.roleMgmntfacade.loadRoles({
      pageNumber: this.rolesPageEvent.pageIndex,
      pageSize: this.rolesPageEvent.pageSize,
      roleCode: this.searchRoleCode,
      roleType: this.filterList['Role Types'].map(item => item.id as string)[0],
      locationFormat: this.filterList['Location Formats'].map(
        item => item.id as string
      )[0]
    });

  showNotification(error?: CustomErrors, message?: string) {
    this.hasNotification = true;
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
      .subscribe(() => (this.hasNotification = false));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
