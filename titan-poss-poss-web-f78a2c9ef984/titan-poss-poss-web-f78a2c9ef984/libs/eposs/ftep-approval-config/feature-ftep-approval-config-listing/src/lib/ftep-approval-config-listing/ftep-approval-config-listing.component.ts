import {
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { FtepApprovalConfigFacade } from '@poss-web/eposs/ftep-approval-config/data-access-ftep-approval-config';
import {
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  ConfigurationsMenuKeyEnum,
  CustomErrors,
  FtepApprovalConfig,
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
  getFtepApprovalConfigDetailRouteUrl
} from '@poss-web/shared/util-site-routes';

@Component({
  selector: 'poss-web-ftep-approval-config-listing',
  templateUrl: './ftep-approval-config-listing.component.html'
})
export class FtepApprovalConfigListingComponent implements OnInit, OnDestroy {
  ftepApprovalConfigList$: Observable<FtepApprovalConfig[]>;
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
  toggleStatus = ListingActiveDeactiveStatus.NORMAL;

  constructor(
    public router: Router,
    public ftepApprovalConfigFacade: FtepApprovalConfigFacade,
    public appSettingFacade: AppsettingFacade,
    private translate: TranslateService,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private alertPopupService: AlertPopupServiceAbstraction
  ) {}

  search(searchValue: string) {
    if (fieldValidation.nameWithSpaceField.pattern.test(searchValue)) {
      this.ftepApprovalConfigFacade.searchFtepType(searchValue.toUpperCase());
      this.invalidSearch = false;
    } else {
      this.invalidSearch = true;
    }
  }
  clearSearch(value?) {
    this.invalidSearch = false;
    this.loadFtepApprovalConfigList();
  }
  ngOnInit() {
    this.ftepApprovalConfigFacade.loadReset();
    this.isLoading$ = this.ftepApprovalConfigFacade.getIsloading();

    this.appSettingFacade
      .getPageSizeOptions()
      .pipe(takeUntil(this.destroy$))
      .subscribe(pageSizeOptions => (this.pageSizeOptions = pageSizeOptions));

    this.appSettingFacade
      .getPageSize()
      .pipe(takeUntil(this.destroy$))
      .subscribe(pageSize => {
        this.initialPageEvent.pageSize = pageSize;
        this.loadFtepApprovalConfigList();
        this.ftepApprovalConfigList$ = this.ftepApprovalConfigFacade.getFtepApprovalConfigList();
        this.totalElements$ = this.ftepApprovalConfigFacade.getTotalElement();
      });
    this.ftepApprovalConfigFacade
      .getHasUpdated()
      .pipe(takeUntil(this.destroy$))
      .subscribe(hasUpdated => {
        if (hasUpdated) {
          this.loadFtepApprovalConfigList();

          if (this.toggleStatus === ListingActiveDeactiveStatus.NORMAL) {
            this.showSuccessMessageNotification(
              'pw.ftepApprovalConfig.updatedMsg'
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
    this.ftepApprovalConfigFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        if (error) {
          this.errorHandler(error);
        }
      });
  }

  loadFtepApprovalConfigList() {
    this.ftepApprovalConfigFacade.loadFtepApprovalConfigList(
      this.initialPageEvent
    );
  }
  loadPaginateData(pageEvent) {
    this.initialPageEvent = pageEvent;
    this.loadFtepApprovalConfigList();
  }
  loadDetailPage(event) {
    if (event.isActive === true) {
      this.router.navigate([
        getFtepApprovalConfigDetailRouteUrl(event.ruleId, event.ruleType)
      ]);
    }

  }

  loadDetailPageValue(ruleId) {
    const ruleType = 'new';
    this.router.navigate([
      getFtepApprovalConfigDetailRouteUrl(ruleId, ruleType)
    ]);
  }

  updateToggle(updateFtepApprovalConfig: FtepApprovalConfig) {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.CONFIRM,
        message: 'pw.alertPopup.saveConfirmation'
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) {
          this.toggleStatus = updateFtepApprovalConfig.isActive
            ? ListingActiveDeactiveStatus.ACTIVE
            : ListingActiveDeactiveStatus.DEACTIVE;
          this.ftepApprovalConfigFacade.updateFtepApprovalConfig(
            updateFtepApprovalConfig
          );
        } else this.loadFtepApprovalConfigList();
      });
  }
  back() {
    this.router.navigate([getConfigurationHomeRouteUrl()], {
      queryParams: {
        menu: ConfigurationsMenuKeyEnum.CUSTOMER_TRANSACTION_MENU_KEY
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
  viewDetailsPage($event) {
    this.router.navigate(
      [getFtepApprovalConfigDetailRouteUrl($event.ruleId, $event.ruleType)],
      {
        queryParams: {
          showViewOnly: 'true'
        }
      }
    );

  }
  errorHandler(error: CustomErrors) {
    this.overlayNotification.show({
      type: OverlayNotificationType.ERROR,
      hasClose: true,
      error: error
    });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
