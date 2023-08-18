import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { FilterService } from '@poss-web/shared/components/ui-filter-dialog';
import {
  CustomErrors,
  Filter,
  FilterActions,
  LocationMappingServiceAbstraction,
  LocationMappingServiceResponse,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  UserDetail
} from '@poss-web/shared/models';
import { PermissionFacade } from '@poss-web/shared/permission/data-access-permission';
import { PermissionService } from '@poss-web/shared/permission/ui-permission';
import { ElementPermissionService } from '@poss-web/shared/permission/util-element-permissions';
import { ProfileDataFacade } from '@poss-web/shared/profile/data-access-profile';
import { UserManagementFacade } from '@poss-web/shared/user-mgmt/data-access-user';
import { getUamHomeRouteUrl } from '@poss-web/shared/util-site-routes';
import { Observable, Subject } from 'rxjs';
import { filter, take, takeUntil, withLatestFrom } from 'rxjs/operators';

@Component({
  templateUrl: './user-listing.component.html'
})
export class UserListingComponent implements OnInit, OnDestroy {
  isBTQUser = false;
  employeeCode = '';
  error = '';
  usersList$: Observable<UserDetail[]>;
  isLoading$: Observable<boolean>;
  permissions$: Observable<any[]>;
  userListSize$: Observable<number>;
  hasNotification = false;
  pageSizeOptions: number[] = [];
  minPageSize = 0;
  destroy$: Subject<null> = new Subject<null>();
  filterRolelist: { [key: string]: Filter[] };
  maxFilterLimit = 0;
  message = '';
  selectedLocations: { id: string; description: string }[] = [];

  usersPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };
  UAM_USERLIST_VIEWUSERS = 'Uam User List - User List Container';
  activateUserLoginsuccessMessage =
    'pw.usermanagementlistNotification.activateUserLoginsuccessMessage';
  deactivateUserLoginsuccessMessage =
    'pw.usermanagementlistNotification.deactivateUserLoginsuccessMessage';

  constructor(
    private userManagementFacade: UserManagementFacade,
    private appsettingFacade: AppsettingFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private filterService: FilterService,
    private locationMappingService: LocationMappingServiceAbstraction,
    private translate: TranslateService,
    private profileData: ProfileDataFacade,
    private permissionfacade: PermissionFacade,
    private elementPermission: ElementPermissionService,
    private permissionService: PermissionService
  ) {
    this.permissions$ = this.permissionfacade.getPermissionforURL();

    this.filterRolelist = { Roles: [] };
    this.profileData
      .getBoutiqueType()
      .pipe(
        filter((val: string) => !!val),
        withLatestFrom(
          this.profileData.isBTQUser(),
          appsettingFacade.getPageSize(),
          appsettingFacade.getPageSizeOptions(),
          appsettingFacade.getMaxFilterLimit()
        ),
        take(1)
      )
      .subscribe(([val, val1, val2, val3, val4]) => {
        this.isBTQUser = val1;
        this.usersPageEvent.pageSize = val2;
        this.minPageSize = +val2;
        userManagementFacade.loadFilterRoles(this.isBTQUser);
        this.pageSizeOptions = val3;
        this.maxFilterLimit = val4;

        this.elementPermission
          .loadPermission(this.UAM_USERLIST_VIEWUSERS, this.permissions$)
          .pipe(
            filter(data => !!data.transactionCodes),
            takeUntil(this.destroy$)
          )
          .subscribe(data => {
            const hasRequestPermission = data.transactionCodes.find(key =>
              this.permissionService.hasPermission(key)
            );
            if (hasRequestPermission) {
              this.loadUsers();
            }
          });
      });
  }

  ngOnInit() {
    this.usersList$ = this.userManagementFacade.getUsersList();
    this.userListSize$ = this.userManagementFacade.getTotalUsers();
    this.isLoading$ = this.userManagementFacade.isLoading();

    this.userManagementFacade
      .getError()
      .pipe(
        takeUntil(this.destroy$),
        filter(errorVal => !!errorVal)
      )
      .subscribe(errorVal => {
        this.showNotification(errorVal);
        this.error = errorVal.message;
      });

    this.userManagementFacade
      .getRolesList()
      .pipe(
        filter(list => !!list),
        take(1)
      )
      .subscribe((list: Map<string, string>) => {
        const rolesData = [];
        list.forEach((value, key) => {
          rolesData.push({
            id: key,
            description: value,
            selected: false
          });
        });
        this.filterService.DataSource = {
          Roles: rolesData
        };
      });
  }

  searchUser(event: string) {
    this.employeeCode = event;
    this.usersPageEvent.pageIndex = 0;
    this.loadUsers();
  }

  getUamHomeNavigationUrl() {
    return getUamHomeRouteUrl();
  }

  openFilterDialog = () =>
    this.filterService
      .openDialog(this.maxFilterLimit, this.filterRolelist)
      .pipe(
        filter(response => response.actionfrom === FilterActions.APPLY),
        take(1)
      )
      .subscribe(responseData => {
        this.filterRolelist['Roles'] = responseData.data['Roles'];
        this.usersPageEvent.pageIndex = 0;
        this.loadUsers();
      });

  openLocationSelection = () =>
    this.locationMappingService
      .open({
        selectedLocations: this.selectedLocations
      })
      .pipe(
        filter(response => response.type === 'apply'),
        take(1)
      )
      .subscribe((res: LocationMappingServiceResponse) => {
        this.selectedLocations = res.data.selectedLocations;
        this.usersPageEvent.pageIndex = 0;
        this.loadUsers();
      });

  loadUsers() {
    this.userManagementFacade.loadUsers({
      isBTQUser: this.isBTQUser,
      employeeCode: this.employeeCode,
      pageNumber: this.usersPageEvent.pageIndex,
      pageSize: this.usersPageEvent.pageSize,
      roleCodes: this.filterRolelist['Roles'].map(item => item.id as string),
      locationCodes: this.selectedLocations.map(location => location.id)
    });
  }

  loadInitialUser() {
    this.employeeCode = '';
    this.loadUsers();
  }

  clearUsers = () => this.userManagementFacade.clearSearchedUsers();

  paginateUsersList(event: PageEvent) {
    this.usersPageEvent = event;
    this.loadUsers();
  }

  toggleUserLock(event: any) {
    this.userManagementFacade.updateUser(this.isBTQUser, event.id, {
      isLoginActive: event.value
    });

    this.translate
      .get(
        event.value
          ? this.activateUserLoginsuccessMessage
          : this.deactivateUserLoginsuccessMessage,
        {
          username: event.id
        }
      )
      .pipe(take(1))
      .subscribe(msg => (this.message = msg));

    this.userManagementFacade
      .userUpdated()
      .pipe(
        filter(updated => updated),
        take(1)
      )
      .subscribe(_ => this.showNotification(undefined, this.message));

    this.userManagementFacade
      .getError()
      .pipe(
        filter(errorVal => !!errorVal),
        take(1)
      )
      .subscribe(errorVal => this.loadUsers());
  }

  showNotification(error?: CustomErrors, message?: string) {
    this.hasNotification = true;
    this.overlayNotification
      .show({
        type: !!error
          ? OverlayNotificationType.ERROR
          : OverlayNotificationType.SIMPLE,
        error: error,
        message: message,
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
