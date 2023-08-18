import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import {
  ConversionConfig,
  CustomErrors,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  OverlayNotificationEventType,
  ConfigurationsMenuKeyEnum,
  AlertPopupTypeEnum,
  AlertPopupServiceAbstraction,
  ListingActiveDeactiveStatus
} from '@poss-web/shared/models';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { takeUntil, take } from 'rxjs/operators';
import { ConversionConfigFacade } from '@poss-web/eposs/conversion-config/data-access-conversion-config';
import {
  getConversionConfigurationDetailsRouteUrl,
  getConfigurationHomeRouteUrl
} from '@poss-web/shared/util-site-routes';
import { fieldValidation } from '@poss-web/shared/util-field-validators';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'poss-web-conversion-config-list',
  templateUrl: './conversion-config-list.component.html'
})
export class ConversionConfigListComponent implements OnInit, OnDestroy {
  conversionConfigList$: Observable<ConversionConfig[]>;
  totalElements$: Observable<number>;
  error$: Observable<CustomErrors>;
  isLoading$: Observable<boolean>;
  hasSearched$: Observable<boolean>;
  invalidSearch = false;
  initialPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };
  dialogRef: any;
  destroy$ = new Subject<null>();
  pageSizeOptions: number[];
  noDataFoundMessage: string;
  toggleStatus = ListingActiveDeactiveStatus.NORMAL;
  constructor(
    public router: Router,
    private conversionConfigFacade: ConversionConfigFacade,
    private appSettingFacade: AppsettingFacade,
    public dialog: MatDialog,
    private translate: TranslateService,
    private alertPopupService: AlertPopupServiceAbstraction,
    private overlayNotification: OverlayNotificationServiceAbstraction
  ) {
    this.translate
      .get(['pw.entity.conversionConfigurationEntity'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((entity: any) => {
        this.translate
          .get(['pw.global.noDataFoundMessage'], {
            entityName: entity['pw.entity.conversionConfigurationEntity']
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe((translatedMsg: any) => {
            this.noDataFoundMessage =
              translatedMsg['pw.global.noDataFoundMessage'];
          });
      });
  }

  ngOnInit() {
    this.conversionConfigFacade.resetConversionConfig();
    this.appSettingFacade
      .getPageSizeOptions()
      .pipe(takeUntil(this.destroy$))
      .subscribe(pageSizeOptions => (this.pageSizeOptions = pageSizeOptions));
    this.appSettingFacade
      .getPageSize()
      .pipe(takeUntil(this.destroy$))
      .subscribe(pageSize => {
        this.initialPageEvent.pageSize = pageSize;
        this.loadConversionConfigList();
      });
    this.conversionConfigList$ = this.conversionConfigFacade.getConversionConfigList();
    this.totalElements$ = this.conversionConfigFacade.getTotalElements();
    this.componentInit();
  }
  componentInit() {
    this.conversionConfigFacade
      .getHasUpdated()
      .pipe(takeUntil(this.destroy$))
      .subscribe((hasUpted: boolean) => {
        if (hasUpted) {
          if (this.toggleStatus === ListingActiveDeactiveStatus.NORMAL) {
            this.updateNotifications(
              'pw.conversionConfig.updateSuccessMessage'
            );
          }
          if (this.toggleStatus === ListingActiveDeactiveStatus.ACTIVE) {
            this.updateNotifications('pw.global.listActivated');
          }
          if (this.toggleStatus === ListingActiveDeactiveStatus.DEACTIVE) {
            this.updateNotifications('pw.global.listDeactivated');
          }
          this.toggleStatus = ListingActiveDeactiveStatus.NORMAL;

          this.loadConversionConfigList();
        }
      });
    this.conversionConfigFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });
    this.hasSearched$ = this.conversionConfigFacade.getHasSearched();
    this.isLoading$ = this.conversionConfigFacade.getIsLoading();
  }

  updateNotifications(key) {
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
            this.conversionConfigFacade.resetConversionConfig();
          });
      });
  }
  clearSearch() {
    this.invalidSearch = false;
    this.loadConversionConfigList();
  }

  search(searchValue) {
    console.log('abcdef');
    if (fieldValidation.nameWithSpaceField.pattern.test(searchValue)) {
      this.invalidSearch = false;
      this.conversionConfigFacade.searchByConfigName(searchValue);
    } else {
      this.invalidSearch = true;
    }
  }
  loadDetailPageView(configId: string) {
    this.router.navigate(
      [getConversionConfigurationDetailsRouteUrl(configId)],
      {
        queryParams: {
          showViewOnly: 'true'
        },
        queryParamsHandling: 'merge'
      }
    );
  }
  loadDetailPage(configId: string) {
    this.router.navigate([getConversionConfigurationDetailsRouteUrl(configId)]);
  }
  loadPaginateData(pageEvent) {
    this.initialPageEvent = pageEvent;
    this.loadConversionConfigList();
  }
  loadConversionConfigList() {
    this.conversionConfigFacade.loadConversionConfigList(this.initialPageEvent);
  }
  back() {
    this.conversionConfigFacade.resetConversionConfig();
    this.router.navigate([getConfigurationHomeRouteUrl()], {
      queryParams: {
        menu: ConfigurationsMenuKeyEnum.INVENTORY_CONFIGURATION_MENU_KEY
      }
    });
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

          this.conversionConfigFacade.updateToggleButton({
            id: $event.ruleId,
            toggleButton: {
              isActive: $event.isActive,
              ruleDetails: {}
            }
          });
        } else this.loadConversionConfigList();
      });
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
