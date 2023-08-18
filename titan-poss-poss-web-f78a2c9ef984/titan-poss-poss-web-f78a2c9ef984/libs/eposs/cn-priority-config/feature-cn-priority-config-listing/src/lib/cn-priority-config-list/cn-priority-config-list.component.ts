import {
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CnPriorityConfigFacade } from '@poss-web/eposs/cn-priority-config/data-access-cn-priority-config';
import {
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  CnPriorityConfig,
  ConfigurationsMenuKeyEnum,
  CustomErrors,
  ListingActiveDeactiveStatus,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType
} from '@poss-web/shared/models';
import { Observable, Subject } from 'rxjs';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { takeUntil } from 'rxjs/operators';
import { fieldValidation } from '@poss-web/shared/util-field-validators';
import {
  getConfigurationHomeRouteUrl,
  getCreditNotePriorityDetailRouteUrl,
  getCreditNotePriorityViewDetailRouteUrl
} from '@poss-web/shared/util-site-routes';
import { ElementPermissionService } from '@poss-web/shared/permission/util-element-permissions';
import { PermissionFacade } from '@poss-web/shared/permission/data-access-permission';

@Component({
  selector: 'poss-web-cn-priority-config-list',
  templateUrl: './cn-priority-config-list.component.html'
})
export class CnPriorityConfigListComponent implements OnInit, OnDestroy {
  cnPriorityConfigList$: Observable<CnPriorityConfig[]>;
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
  invalidSearch: boolean;
  noDataFoundMessage: string;
  permissions$: Observable<any[]>;
  ADD_EDIT_PERMISSION = 'CNConfigurations_CreditNotePriority_addEditPermission';
  toggleStatus = ListingActiveDeactiveStatus.NORMAL;

  constructor(
    public router: Router,
    public cnPriorityConfigFacade: CnPriorityConfigFacade,
    public appSettingFacade: AppsettingFacade,
    private translate: TranslateService,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private alertPopupService: AlertPopupServiceAbstraction,
    private elementPermission: ElementPermissionService,
    private permissionfacade: PermissionFacade
  ) {
    this.permissions$ = this.permissionfacade.getPermissionforURL();
    this.translate
      .get(['pw.entity.cnPriorityConfigurationEntity'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((entity: any) => {
        this.translate
          .get(['pw.global.noDataFoundMessage'], {
            entityName: entity['pw.entity.cnPriorityConfigurationEntity']
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
      this.cnPriorityConfigFacade.searchConfig(searchValue.toUpperCase());
      this.invalidSearch = false;
    } else {
      this.invalidSearch = true;
    }
  }
  clearSearch(value?) {
    this.invalidSearch = false;
    this.loadCnPriorityConfigList();
  }
  ngOnInit() {
    this.cnPriorityConfigFacade.loadReset();
    this.isLoading$ = this.cnPriorityConfigFacade.getIsloading();

    this.appSettingFacade
      .getPageSizeOptions()
      .pipe(takeUntil(this.destroy$))
      .subscribe(pageSizeOptions => (this.pageSizeOptions = pageSizeOptions));

    this.appSettingFacade
      .getPageSize()
      .pipe(takeUntil(this.destroy$))
      .subscribe(pageSize => {
        this.initialPageEvent.pageSize = pageSize;
        this.loadCnPriorityConfigList();
        this.cnPriorityConfigList$ = this.cnPriorityConfigFacade.getCnPriorityConfigList();
        this.totalElements$ = this.cnPriorityConfigFacade.getTotalElement();
      });
    this.cnPriorityConfigFacade
      .getHasUpdated()
      .pipe(takeUntil(this.destroy$))
      .subscribe(hasUpdated => {
        if (hasUpdated) {
          this.loadCnPriorityConfigList();
          if (this.toggleStatus === ListingActiveDeactiveStatus.NORMAL) {
            this.showSuccessMessageNotification(
              'pw.cnPriorityConfig.updatedMsg'
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
    this.cnPriorityConfigFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        if (error) {
          this.errorHandler(error);
        }
      });
  }

  loadCnPriorityConfigList() {
    this.cnPriorityConfigFacade.loadCnPriorityConfigList(this.initialPageEvent);
  }
  loadPaginateData(pageEvent) {
    this.initialPageEvent = pageEvent;
    this.loadCnPriorityConfigList();
  }
  loadDetailPage(event) {
    if (event.isActive === true) {
      this.router.navigate([
        getCreditNotePriorityDetailRouteUrl(event.configId)
      ]);
    } else {
      this.router.navigate([
        getCreditNotePriorityViewDetailRouteUrl(event.configId)
      ]);
    }
  }

  loadViewPage(event) {
    this.router.navigate([
      getCreditNotePriorityViewDetailRouteUrl(event.configId)
    ]);
  }
  loadDetailPageValue(ruleId) {
    this.router.navigate([getCreditNotePriorityDetailRouteUrl(ruleId)]);
  }

  updateToggle(updateCnPriorityConfig: CnPriorityConfig) {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.CONFIRM,
        message: 'pw.alertPopup.saveConfirmation'
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) {
          this.toggleStatus = updateCnPriorityConfig.isActive
            ? ListingActiveDeactiveStatus.ACTIVE
            : ListingActiveDeactiveStatus.DEACTIVE;
          this.cnPriorityConfigFacade.updateCnPriorityConfig(
            updateCnPriorityConfig
          );
          this.clearSearch();
        } else this.loadCnPriorityConfigList();
      });
  }
  back() {
    this.router.navigate([getConfigurationHomeRouteUrl()], {
      queryParams: {
        menu: ConfigurationsMenuKeyEnum.CREDIT_NOTE_CONFIGURATION_MENU_KEY
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
