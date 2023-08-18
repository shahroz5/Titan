import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  ElementRef
} from '@angular/core';
import {
  CashbackOffer,
  CustomErrors,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  UpdateBankDetailsPayload,
  ConfigurationsMenuKeyEnum,
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  ListingActiveDeactiveStatus
} from '@poss-web/shared/models';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { CashBackOfferConfigurationFacade } from '@poss-web/eposs/cashback-offer-config/data-access-cashback-offer-config';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { FormGroup, FormControl } from '@angular/forms';
import {
  getConfigurationHomeRouteUrl,
  getCashBackOfferConfigDetailRouteUrl
} from '@poss-web/shared/util-site-routes';

import { TranslateService } from '@ngx-translate/core';
import { Observable, Subject, fromEvent } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
@Component({
  selector: 'poss-web-cashback-offer-config-list',
  templateUrl: './cashback-offer-config-list.component.html'
})
export class CashbackOfferConfigListComponent
  implements OnInit, OnDestroy, AfterViewInit {
  cashBackOfferList$: Observable<CashbackOffer[]>;
  totalElements$: Observable<number>;
  error$: Observable<CustomErrors>;
  isLoading$: Observable<boolean>;
  initialPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };
  searchPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };
  destroy$ = new Subject<null>();
  pageSizeOptions: number[];
  invalidSearch: boolean;
  isSearch: boolean;
  searchValue: string;
  noDataFoundMessage: string;
  toggleStatus = ListingActiveDeactiveStatus.NORMAL;

  constructor(
    public router: Router,
    public cashBackOfferConfigurationFacade: CashBackOfferConfigurationFacade,
    public appSettingFacade: AppsettingFacade,
    private translate: TranslateService,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private alertPopupService: AlertPopupServiceAbstraction
  ) {}
  @ViewChild('searchBox', { static: true })
  searchBox: ElementRef;
  searchForm = new FormGroup({
    searchValue: new FormControl()
  });
  ngAfterViewInit(): void {
    fromEvent(this.searchBox.nativeElement, 'input')
      .pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe(event => {
        const searchValue = this.searchForm.value.searchValue;
        if (searchValue) {
          this.search(searchValue);
        } else {
          this.clearSearch();
        }
      });
  }
  search(searchValue: string) {
    this.isSearch = true;
    this.initialPageEvent = this.searchPageEvent;
    this.searchValue = searchValue.toUpperCase();

    this.loadCashBackOfferConfigurationList();
  }
  clearSearch() {
    this.invalidSearch = false;
    this.isSearch = false;
    this.searchForm.reset();
    this.searchValue = '';
    this.initialPageEvent = this.searchPageEvent;
    this.loadCashBackOfferConfigurationList();
  }
  ngOnInit() {
    this.cashBackOfferConfigurationFacade.loadReset();
    this.isLoading$ = this.cashBackOfferConfigurationFacade.getIsloading();

    this.appSettingFacade
      .getPageSizeOptions()
      .pipe(takeUntil(this.destroy$))
      .subscribe(pageSizeOptions => (this.pageSizeOptions = pageSizeOptions));

    this.appSettingFacade
      .getPageSize()
      .pipe(takeUntil(this.destroy$))
      .subscribe(pageSize => {
        this.initialPageEvent.pageSize = pageSize;
        this.searchPageEvent.pageSize = pageSize;
        this.loadCashBackOfferConfigurationList();
        this.cashBackOfferList$ = this.cashBackOfferConfigurationFacade.getCashBackOfferList();
        this.totalElements$ = this.cashBackOfferConfigurationFacade.getTotalElements();
      });
    this.cashBackOfferConfigurationFacade
      .getHasUpdated()
      .pipe(takeUntil(this.destroy$))
      .subscribe(hasUpdated => {
        if (hasUpdated) {
          this.loadCashBackOfferConfigurationList();
          if (this.toggleStatus === ListingActiveDeactiveStatus.NORMAL) {
            this.showSuccessMessageNotification('pw.cashbackConfig.updatedMsg');
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
    this.cashBackOfferConfigurationFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        if (error) {
          this.errorHandler(error);
        }
      });

    this.translate
      .get(['pw.entity.cashbackOfferEntity'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((entity: any) => {
        this.translate
          .get(['pw.global.noDataFoundMessage'], {
            entityName: entity['pw.entity.cashbackOfferEntity']
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe((translatedMsg: any) => {
            this.noDataFoundMessage =
              translatedMsg['pw.global.noDataFoundMessage'];
          });
      });
  }

  loadDetailPage(configId: string) {
    this.router.navigate([getCashBackOfferConfigDetailRouteUrl(configId)]);
  }
  openViewPage(configId: string) {
    this.router.navigate([getCashBackOfferConfigDetailRouteUrl(configId)], {
      queryParams: {
        showViewOnly: 'true'
      },
      queryParamsHandling: 'merge'
    });
  }

  loadCashBackOfferConfigurationList() {
    if (this.searchValue) {
      this.cashBackOfferConfigurationFacade.loadCashBackList(
        this.initialPageEvent,
        this.searchValue
      );
    } else {
      this.cashBackOfferConfigurationFacade.loadCashBackList(
        this.initialPageEvent
      );
    }
  }
  loadPaginateData(pageEvent) {
    this.initialPageEvent = pageEvent;
    this.loadCashBackOfferConfigurationList();
  }

  updateToggle(updateBankDetailsPayload: UpdateBankDetailsPayload) {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.CONFIRM,
        message: 'pw.alertPopup.saveConfirmation'
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) {
          this.toggleStatus = updateBankDetailsPayload.data.isActive
            ? ListingActiveDeactiveStatus.ACTIVE
            : ListingActiveDeactiveStatus.DEACTIVE;

          this.cashBackOfferConfigurationFacade.updateBankDetails(
            updateBankDetailsPayload
          );
        } else {
          this.loadCashBackOfferConfigurationList();
        }
      });
  }
  back() {
    this.router.navigate([getConfigurationHomeRouteUrl()], {
      queryParams: {
        menu: ConfigurationsMenuKeyEnum.PAYMENT_CONFIGURATIONS_MENU_KEY
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
            message: translatedMsg,
            hasClose: true,
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
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
