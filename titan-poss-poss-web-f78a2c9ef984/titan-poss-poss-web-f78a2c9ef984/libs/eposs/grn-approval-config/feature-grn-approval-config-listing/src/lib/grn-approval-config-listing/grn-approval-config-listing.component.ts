import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { GrnApprovalConfigFacade } from '@poss-web/eposs/grn-approval-config/data-access-grn-approval-config';
import {
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  ConfigurationsMenuKeyEnum,
  CustomErrors,
  GrnApprovalConfig,
  ListingActiveDeactiveStatus,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType
} from '@poss-web/shared/models';
import { Observable, Subject } from 'rxjs';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { fieldValidation } from '@poss-web/shared/util-field-validators';
import {
  getConfigurationHomeRouteUrl,
  getGrnApprovalConfigDetailRouteUrl,
  getGrnApprovalConfigViewDetailRouteUrl
} from '@poss-web/shared/util-site-routes';
import { ElementPermissionService } from '@poss-web/shared/permission/util-element-permissions';
import { PermissionFacade } from '@poss-web/shared/permission/data-access-permission';

@Component({
  selector: 'poss-web-grn-approval-config-listing',
  templateUrl: './grn-approval-config-listing.component.html'
})
export class GrnApprovalConfigListingComponent implements OnInit, OnDestroy {
  grnApprovalConfigList$: Observable<GrnApprovalConfig[]>;
  totalElements$: Observable<number>;
  error$: Observable<CustomErrors>;
  isLoading$: Observable<boolean>;
  initialPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };
  destroy$ = new Subject<null>();
  pageSizeOptions: number[];
  invalidSearch = false;
  searchData = '';
  noDataFoundMessage: string;
  permissions$: Observable<any[]>;
  ADD_EDIT_PERMISSION = 'grnConfigurations_GrnApprovalAccess_addEditPermission';
  VIEW_PERMISSION = 'grnConfigurations_GrnApprovalAccess_viewPermission';

  toggleStatus = ListingActiveDeactiveStatus.NORMAL;

  constructor(
    public router: Router,
    public grnApprovalConfigFacade: GrnApprovalConfigFacade,
    public appSettingFacade: AppsettingFacade,
    private translate: TranslateService,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private alertPopupService: AlertPopupServiceAbstraction,
    private elementPermission: ElementPermissionService,
    private permissionfacade: PermissionFacade
  ) {
    this.permissions$ = this.permissionfacade.getPermissionforURL();

    this.translate
      .get(['pw.entity.grnApprovalAccessConfigurationEntity'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((entity: any) => {
        this.translate
          .get(['pw.global.noDataFoundMessage'], {
            entityName: entity['pw.entity.grnApprovalAccessConfigurationEntity']
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe((translatedMsg: any) => {
            this.noDataFoundMessage =
              translatedMsg['pw.global.noDataFoundMessage'];
          });
      });
  }

  search(searchValue: string) {
    if (fieldValidation.nameWithSpaceField.pattern.test(searchValue)) {
      this.searchData = searchValue.toUpperCase();
      this.invalidSearch = false;
      this.initialPageEvent.pageIndex = 0;
      this.loadGrnApprovalConfigList();
    } else {
      this.invalidSearch = true;
    }
  }
  clearSearch(value?) {
    this.invalidSearch = false;
    this.searchData = '';
    this.initialPageEvent.pageIndex = 0;
    this.loadGrnApprovalConfigList();
  }
  ngOnInit() {
    this.grnApprovalConfigFacade.loadReset();
    this.isLoading$ = this.grnApprovalConfigFacade.getIsloading();

    this.appSettingFacade
      .getPageSizeOptions()
      .pipe(takeUntil(this.destroy$))
      .subscribe(pageSizeOptions => (this.pageSizeOptions = pageSizeOptions));

    this.appSettingFacade
      .getPageSize()
      .pipe(takeUntil(this.destroy$))
      .subscribe(pageSize => {
        this.initialPageEvent.pageSize = pageSize;
        this.loadGrnApprovalConfigList();
        this.grnApprovalConfigList$ = this.grnApprovalConfigFacade.getGrnApprovalConfigList();
        this.totalElements$ = this.grnApprovalConfigFacade.getTotalElement();
      });
    this.grnApprovalConfigFacade
      .getHasUpdated()
      .pipe(takeUntil(this.destroy$))
      .subscribe(hasUpdated => {
        if (hasUpdated) {
          this.loadGrnApprovalConfigList();
          if (this.toggleStatus === ListingActiveDeactiveStatus.NORMAL) {
            this.showSuccessMessageNotification(
              'pw.grnApprovalConfig.updatedMsg'
            );
          }
          if (this.toggleStatus === ListingActiveDeactiveStatus.ACTIVE) {
            this.showSuccessMessageNotification('pw.global.listActivated');
          }
          if (this.toggleStatus === ListingActiveDeactiveStatus.DEACTIVE) {
            this.showSuccessMessageNotification('pw.global.listDeactivated');
          }
          this.toggleStatus = ListingActiveDeactiveStatus.NORMAL;
        } else this.overlayNotification.close();
      });
    this.grnApprovalConfigFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        if (error) {
          this.errorHandler(error);
        }
      });
  }

  loadGrnApprovalConfigList() {
    this.grnApprovalConfigFacade.loadGrnApprovalConfigList({
      description: this.searchData,
      pageIndex: this.initialPageEvent.pageIndex,
      pageSize: this.initialPageEvent.pageSize,
      length: this.initialPageEvent.length
    });
  }
  loadPaginateData(pageEvent) {
    this.initialPageEvent = pageEvent;
    this.loadGrnApprovalConfigList();
  }
  loadDetailPage(event) {
    if (event.isActive === true) {
      this.router.navigate([
        getGrnApprovalConfigDetailRouteUrl(event.ruleId, event.ruleType)
      ]);
    } else {
      this.router.navigate([
        getGrnApprovalConfigViewDetailRouteUrl(event.ruleId, event.ruleType)
      ]);
    }
  }

  loadViewPage(event) {
    this.router.navigate([
      getGrnApprovalConfigViewDetailRouteUrl(event.ruleId, event.ruleType)
    ]);
  }

  loadDetailPageValue(ruleId) {
    const ruleType = 'new';
    this.router.navigate([
      getGrnApprovalConfigDetailRouteUrl(ruleId, ruleType)
    ]);
  }

  updateToggle(updateGrnApprovalConfig: GrnApprovalConfig) {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.CONFIRM,
        message: 'pw.alertPopup.saveConfirmation'
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) {
          this.toggleStatus = updateGrnApprovalConfig.isActive
            ? ListingActiveDeactiveStatus.ACTIVE
            : ListingActiveDeactiveStatus.DEACTIVE;

          this.grnApprovalConfigFacade.updateGrnApprovalConfig(
            updateGrnApprovalConfig
          );
        } else this.loadGrnApprovalConfigList();
      });
  }
  back() {
    this.router.navigate([getConfigurationHomeRouteUrl()], {
      queryParams: {
        menu: ConfigurationsMenuKeyEnum.GRN_CONFIGURATION_MENU_KEY
      }
    });
  }
  showSuccessMessageNotification(key: any) {
    this.translate
      .get(key)
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMsg: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SIMPLE,
            hasClose: true,
            message: translatedMsg,
            hasBackdrop: true
          })
          .events.pipe(takeUntil(this.destroy$))
          .subscribe();
      });
  }
  errorHandler(error: CustomErrors) {
    this.overlayNotification.show({
      type: OverlayNotificationType.ERROR,
      hasClose: true,
      error: error
    });
  }

  loadPermission = (element: string) =>
    this.elementPermission.loadPermission(element, this.permissions$);

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
