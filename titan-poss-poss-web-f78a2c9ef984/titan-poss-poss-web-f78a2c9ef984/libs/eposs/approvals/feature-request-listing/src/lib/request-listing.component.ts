import { getApprovalsHomeRouteUrl } from '@poss-web/shared/util-site-routes';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import {
  takeUntil,
  filter,
  take,
  distinctUntilChanged,
  debounceTime
} from 'rxjs/operators';

import {
  RoleCountRequestList,
  CustomErrors,
  OverlayNotificationServiceAbstraction,
  LocationMappingServiceAbstraction,
  ApprovalsMenuKeyEnum,
  OverlayNotificationType
} from '@poss-web/shared/models';
import { RoleConfigFacade } from '@poss-web/shared/role-config/data-access-role-config';
import { FormControl } from '@angular/forms';
import { PermissionFacade } from '@poss-web/shared/permission/data-access-permission';
import { ElementPermissionService } from '@poss-web/shared/permission/util-element-permissions';
import { MatDialog } from '@angular/material/dialog';
import {
  SelectionDailogOption,
  SelectionDialogService
} from '@poss-web/shared/components/ui-selection-dialog';
import { TranslateService } from '@ngx-translate/core';
import { LocationMappingFacade } from '@poss-web/shared/location-mapping/data-access-location-mapping';
import { Router } from '@angular/router';

@Component({
  templateUrl: './request-listing.component.html',
  styleUrls: ['./request-listing.component.scss']
})
export class RequestListingComponent implements OnInit, OnDestroy {
  roleCountRequestList$: Observable<RoleCountRequestList[]>;
  roleCountRequestListLength$: Observable<number>;
  isLoading$: Observable<boolean>;
  destroy$: Subject<null> = new Subject<null>();
  isBTQUser = false;
  selectedLocation: SelectionDailogOption;
  searchFormControl = new FormControl();
  permissions$: Observable<any[]>;
  locationCode: string[] = [];
  selectLocationLableText: string;
  searchLocationPlaceHolder: string;
  locationForSelection: SelectionDailogOption[] = [];
  locationFilter = {
    brands: null,
    regions: null,
    levels: null,
    countries: null,
    states: null,
    towns: null
  };

  constructor(
    private roleMgmntfacade: RoleConfigFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private locationMappingService: LocationMappingServiceAbstraction,
    private permissionfacade: PermissionFacade,
    private elementPermission: ElementPermissionService,
    public translate: TranslateService,
    private dialog: MatDialog,
    private selectionDialog: SelectionDialogService,
    private locationMappingFacade: LocationMappingFacade,
    private router: Router
  ) {
    this.loadRoleCountRequestList();

    roleMgmntfacade
      .getError()
      .pipe(
        takeUntil(this.destroy$),
        filter(errorVal => !!errorVal)
      )
      .subscribe(errorVal => this.showNotification(errorVal));

    this.locationMappingFacade
      .getError()
      .pipe(
        takeUntil(this.destroy$),
        filter(errorVal => !!errorVal)
      )
      .subscribe(errorVal => this.showNotification(errorVal));

    this.translate
      .get([
        'pw.approvals.searchByLocationCode',
        'pw.approvals.selectLocationCode'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.selectLocationLableText =
          translatedMessages['pw.approvals.selectLocationCode'];
        this.searchLocationPlaceHolder =
          translatedMessages['pw.approvals.searchByLocationCode'];
      });
  }

  ngOnInit() {
    this.isLoading$ = this.roleMgmntfacade.isLoading();
    this.roleMgmntfacade.resetRoleCountRequestList();
    this.roleCountRequestList$ = this.roleMgmntfacade.fetchRoleCountRequestList();
    this.roleCountRequestListLength$ = this.roleMgmntfacade.fetchRoleCountRequestListLength();
    this.permissions$ = this.permissionfacade.getPermissionforURL();

    this.searchFormControl.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        distinctUntilChanged((a, b) => a === b),
        debounceTime(1000)
      )
      .subscribe((event: any) => this.loadRoleCountRequestList());

    this.locationMappingFacade.searchLocations(this.locationFilter);
    this.componentInit();
  }

  componentInit() {

    this.locationMappingFacade
      .getLocations()
      .pipe(takeUntil(this.destroy$))
      .subscribe((locations: any) => {
        if (locations) {
          this.locationForSelection = locations.map(location => ({
            id: location.locationCode,
            description: location.locationCode + ' - ' + location.description
          }));
        }
      });
  }

  loadRoleCountRequestList = (pageNumber: number = 0, pageSize: number = 8) =>
    this.roleMgmntfacade.roleCountRequestList({
      pageNumber,
      pageSize,
      isBTQUser: this.isBTQUser,
      locationCodes: this.locationCode,
      requestSearch: this.searchFormControl.value
    });

  openLocationPopup() {
    this.dialog.closeAll();
    this.selectionDialog
      .open({
        title: this.selectLocationLableText,
        placeholder: this.searchLocationPlaceHolder,
        options: this.locationForSelection
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((selectedOption: SelectionDailogOption) => {
        if (selectedOption) {
          this.selectedLocation = selectedOption;
          this.locationCode = [selectedOption.id];
          this.loadRoleCountRequestList();
        }
      });
  }

  clearPopup() {
    this.locationCode = [];
    this.selectedLocation = null;
    this.loadRoleCountRequestList();
  }

  showNotification(error?: CustomErrors) {
    this.overlayNotification
      .show({
        type: OverlayNotificationType.ERROR,
        error: error,
        hasClose: !!error
      })
      .events.pipe(take(1))
      .subscribe();
  }

  loadPermission(element: string) {
    return this.elementPermission.loadPermission(element, this.permissions$);
  }

  back() {
    this.router.navigate([getApprovalsHomeRouteUrl()], {
      queryParams: { menu: ApprovalsMenuKeyEnum.UAM_MENU_KEY }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
