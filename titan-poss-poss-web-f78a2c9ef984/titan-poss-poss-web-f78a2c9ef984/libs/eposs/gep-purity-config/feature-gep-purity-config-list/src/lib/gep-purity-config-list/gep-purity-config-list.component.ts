import {
  Component, OnDestroy, OnInit
} from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { GEPPurityConfigFacade } from '@poss-web/eposs/gep-purity-config/data-access-gep-purity-config';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import {
  AlertPopupServiceAbstraction, AlertPopupTypeEnum, ConfigurationsMenuKeyEnum, CustomErrors, GEPPurityConfig, GepPurityConfigEnums, ListingActiveDeactiveStatus, OverlayNotificationEventType, OverlayNotificationServiceAbstraction,
  OverlayNotificationType
} from '@poss-web/shared/models';
import { fieldValidation } from '@poss-web/shared/util-field-validators';
import {
  getConfigurationHomeRouteUrl, getGepPurityConfigurationDetailsTabRouteUrl, getGepPurityConfigViewUrl
} from '@poss-web/shared/util-site-routes';
import * as moment from 'moment';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
@Component({
  selector: 'poss-web-gep-purity-config-list',
  templateUrl: './gep-purity-config-list.component.html'
})
export class GepPurityConfigListComponent implements OnInit, OnDestroy {
  isLoading$: Observable<boolean>;
  invalidSearch = false;
  initialPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };
  gepPurityConfigurationList$: Observable<GEPPurityConfig[]>;
  totalElements$: Observable<number>;
  pageSizeOptions: number[];
  destroy$ = new Subject<null>();
  hasSearched$: Observable<boolean>;
  gepPurityDetails: GEPPurityConfig[] = [];
  dateFormat: string;
  noDataFoundMessage: string;
  toggleStatus = ListingActiveDeactiveStatus.NORMAL;
  searchData = '';

  constructor(
    private gepPurityConfigFacade: GEPPurityConfigFacade,
    private appSettingFacade: AppsettingFacade,
    private router: Router,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private translate: TranslateService,
    private alertPopupService: AlertPopupServiceAbstraction
  ) {
    this.translate
      .get(['pw.global.noDataFoundMessage'], {
        entityName: 'GEP-Purity-Configuration'
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.noDataFoundMessage =
          translatedMessages['pw.global.noDataFoundMessage'];
      });
  }

  ngOnInit() {
    this.gepPurityConfigFacade.resetGepPurityConfiguration();
    this.appSettingFacade
      .getPageSize()
      .pipe(takeUntil(this.destroy$))
      .subscribe(pageSize => {
        this.initialPageEvent.pageSize = pageSize;
        this.loadGepPurityConfiguration();
      });
    this.appSettingFacade
      .getDateFormat()
      .pipe(takeUntil(this.destroy$))
      .subscribe((dateFormat: string) => {
        this.dateFormat = dateFormat;
      });
    this.gepPurityConfigFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });
    this.appSettingFacade
      .getPageSizeOptions()
      .pipe(takeUntil(this.destroy$))
      .subscribe(pageSizeOptions => (this.pageSizeOptions = pageSizeOptions));

    this.isLoading$ = this.gepPurityConfigFacade.getIsLoading();
    this.totalElements$ = this.gepPurityConfigFacade.getTotalCount();
    this.gepPurityConfigurationList$ = this.gepPurityConfigFacade.getGepPurityConfigList();
    this.hasSearched$ = this.gepPurityConfigFacade.getHasSearched();
    this.gepPurityConfigFacade
      .getGepPurityConfigList()
      .pipe(takeUntil(this.destroy$))
      .subscribe((gepPurityDetails: GEPPurityConfig[]) => {
        if (gepPurityDetails) {
          this.gepPurityDetails = [];
          gepPurityDetails.forEach((configDetails: GEPPurityConfig) => {
            this.gepPurityDetails.push({
              description: configDetails.description,
              isActive: configDetails.isActive,
              configId: configDetails.configId,
              createdDate: moment(configDetails.createdDate).format(
                this.dateFormat
              )
            });
          });
        }
      });

    this.gepPurityConfigFacade
      .getHasToggleButton()
      .pipe(takeUntil(this.destroy$))
      .subscribe((hasUpdated: boolean) => {
        if (hasUpdated) {
          if (this.toggleStatus === ListingActiveDeactiveStatus.NORMAL) {
            this.showNotifications('pw.gePurityConfiguration.saveMsg');
          }
          if (this.toggleStatus === ListingActiveDeactiveStatus.ACTIVE) {
            this.showNotifications('pw.global.listActivated');
          }
          if (this.toggleStatus === ListingActiveDeactiveStatus.DEACTIVE) {
            this.showNotifications('pw.global.listDeactivated');
          }
          this.toggleStatus = ListingActiveDeactiveStatus.NORMAL;

          this.loadGepPurityConfiguration();
        }
      });
  }
  showNotifications(key) {
    this.translate
      .get(key)
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessage: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SIMPLE,
            message: translatedMessage,
            hasBackdrop: true,
            hasClose: true
          })
          .events.subscribe((eventType: OverlayNotificationEventType) => {
            this.gepPurityConfigFacade.resetGepPurityConfiguration();
          });
      });
  }

  loadGepPurityConfiguration() {
    this.gepPurityConfigFacade.loadGepPurityConfigList({
      description: this.searchData,
      pageIndex: this.initialPageEvent.pageIndex,
      pageSize: this.initialPageEvent.pageSize,
      type: GepPurityConfigEnums.GEP_ITEM
    });
  }
  loadPaginateData(pageEvent) {
    this.initialPageEvent = pageEvent;
    this.loadGepPurityConfiguration();
  }

  updateToggle($event) {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.CONFIRM,
        message: 'pw.alertPopup.saveConfirmation'
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) {
          this.toggleStatus = $event.isActive
            ? ListingActiveDeactiveStatus.ACTIVE
            : ListingActiveDeactiveStatus.DEACTIVE;

          this.gepPurityConfigFacade.updateToggleButton({
            configId: $event.configId,
            isActive: $event.isActive
          });
        } else this.loadGepPurityConfiguration();
      });
  }
  search(searchValue) {
    if (fieldValidation.nameWithSpaceField.pattern.test(searchValue)) {
      this.searchData = searchValue.toUpperCase();
      this.initialPageEvent.pageIndex = 0;
      this.invalidSearch = false;
      this.loadGepPurityConfiguration();
    } else this.invalidSearch = true;
  }
  clearSearch() {
    this.invalidSearch = false;
    this.searchData = '';
    this.initialPageEvent.pageIndex = 0;
    this.loadGepPurityConfiguration();
  }
  loadDetailPage(configName: string) {
    this.router.navigate([
      getGepPurityConfigurationDetailsTabRouteUrl(configName, 'puritydetails')
    ]);
  }
  back() {
    this.router.navigate([getConfigurationHomeRouteUrl()], {
      queryParams: {
        menu: ConfigurationsMenuKeyEnum.GEP_CONFIGURATIONS_MENU_KEY
      }
    });
  }
  // openViewPage(configName) {
  //   this.router.navigate(
  //     [
  //       getGepPurityConfigurationDetailsTabRouteUrl(
  //         configName,
  //         'gepPurityDetails'
  //       )
  //     ],
  //     {
  //       queryParams: { showViewOnly: 'true' },
  //       queryParamsHandling: 'merge'
  //     }
  //   );
  // }

  loadDetailViewPage(configId: string) {
    this.router.navigate([getGepPurityConfigViewUrl(configId)]);
  }
  errorHandler(error: CustomErrors) {
    this.overlayNotification
      .show({
        type: OverlayNotificationType.ERROR,
        hasBackdrop: true,
        hasClose: true,
        error: error
      })
      .events.pipe(take(1))
      .subscribe();
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
