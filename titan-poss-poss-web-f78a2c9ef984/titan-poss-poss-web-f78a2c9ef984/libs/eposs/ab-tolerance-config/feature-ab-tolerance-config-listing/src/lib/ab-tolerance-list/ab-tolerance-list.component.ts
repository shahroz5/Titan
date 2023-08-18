import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { fromEvent, Subject, Observable } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { fieldValidation } from '@poss-web/shared/util-field-validators';
import { AbToleranceConfigFacade } from '@poss-web/eposs/ab-tolerance-config/data-access-ab-tolerance-config';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import {
  OverlayNotificationServiceAbstraction,
  CustomErrors,
  OverlayNotificationType,
  ConfigurationsMenuKeyEnum,
  AbToleranceConfigResponse,
  SelectDropDownOption,
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  ListingActiveDeactiveStatus,
  ConfigTypeEnum
} from '@poss-web/shared/models';
import {
  getConfigurationHomeRouteUrl,
  getAdavanceBookingToleranceConfigDetailsRouteUrl,
  getAdavanceBookingToleranceConfigListRouteUrl
} from '@poss-web/shared/util-site-routes';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'poss-web-ab-tolerance-list',
  templateUrl: './ab-tolerance-list.component.html'
})
export class AbToleranceListComponent
  implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('searchBox', { static: true })
  searchBox: ElementRef;
  searchForm = new FormGroup({
    searchValue: new FormControl()
  });
  searchErrorCode: string;
  invalidSearch: boolean;
  searchData = '';

  totalElements$: Observable<number>;
  error$: Observable<CustomErrors>;
  isLoading$: Observable<boolean>;
  initialPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };
  configPageEvent: PageEvent = this.initialPageEvent;
  pageSizeOptions: number[];
  abToleranceConfigList$: Observable<any[]>;
  noDataFoundMessage;
  destroy$ = new Subject<null>();
  orderType: string;
  orderTypeFormControl = new FormControl('frozen');
  orderTypesArray: SelectDropDownOption[];
  configurationUpdateMessage: string;
  toggleStatus = ListingActiveDeactiveStatus.NORMAL;

  constructor(
    private abToleranceConfigFacade: AbToleranceConfigFacade,
    private appSettingFacade: AppsettingFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private translate: TranslateService,
    private router: Router,
    private alertPopupService: AlertPopupServiceAbstraction
  ) {
    this.translate
      .get(['pw.entity.configurationEntity'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((entity: any) => {
        this.translate
          .get(['pw.global.noDataFoundMessage'], {
            entityName: entity['pw.entity.configurationEntity']
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe((translatedMsg: any) => {
            this.noDataFoundMessage =
              translatedMsg['pw.global.noDataFoundMessage'];
          });
      });
    this.translate
      .get([
        'pw.abWeightTolerance.frozenOrder',
        'pw.abWeightTolerance.nonFrozenOrder',
        'pw.abWeightTolerance.configurationUpdateMessage',
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.configurationUpdateMessage = translatedMessages['pw.abWeightTolerance.configurationUpdateMessage'];
        this.orderTypesArray = [
        {
          value: 'frozen',
          description: translatedMessages['pw.abWeightTolerance.frozenOrder']
        },
        {
          value: 'non-frozen',
          description: translatedMessages['pw.abWeightTolerance.nonFrozenOrder']
        }
      ];
      });
  }

  ngAfterViewInit(): void {
    fromEvent(this.searchBox.nativeElement, 'input')
      .pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe(event => {
        const searchValue = this.searchForm.value.searchValue;
        if (searchValue) {
          this.searchData = searchValue;
          this.search();
        } else {
          this.clearSearch();
        }
      });
  }

  ngOnInit(): void {
    this.orderType = this.orderTypeFormControl.value;
    this.abToleranceConfigFacade.loadReset();
    this.isLoading$ = this.abToleranceConfigFacade.getIsloading();
    this.error$ = this.abToleranceConfigFacade.getError();
    this.appSettingFacade
      .getPageSizeOptions()
      .pipe(takeUntil(this.destroy$))
      .subscribe(pageSizeOptions => (this.pageSizeOptions = pageSizeOptions));

    this.appSettingFacade
      .getPageSize()
      .pipe(takeUntil(this.destroy$))
      .subscribe(pageSize => {
        this.configPageEvent.pageSize = pageSize;
        this.loadAbToleranceConfigList();
        this.abToleranceConfigList$ = this.abToleranceConfigFacade.getAbToleranceConfigList();
        this.totalElements$ = this.abToleranceConfigFacade.getTotalElements();
      });

    this.abToleranceConfigFacade
      .getHasUpdated()
      .pipe(takeUntil(this.destroy$))
      .subscribe(hasUpdated => {
        if (hasUpdated === true) {
          this.clearSearch();
          if (this.toggleStatus === ListingActiveDeactiveStatus.NORMAL) {
            this.showSuccessMessageNotification(
              this.configurationUpdateMessage
            );
          }
          if (this.toggleStatus === ListingActiveDeactiveStatus.ACTIVE) {
            this.showSuccessMessageNotification('pw.global.listActivated');
          }
          if (this.toggleStatus === ListingActiveDeactiveStatus.DEACTIVE) {
            this.showSuccessMessageNotification('pw.global.listDeactivated');
          }
          this.toggleStatus = ListingActiveDeactiveStatus.NORMAL;

          this.loadAbToleranceConfigList();
        } else this.overlayNotification.close();
      });

    this.abToleranceConfigFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        if (error) {
          this.errorHandler(error);
        }
      });
  }

  search() {
    if (fieldValidation.descriptionField.pattern.test(this.searchData)) {
      this.invalidSearch = false;
      this.configPageEvent.pageIndex = 0;
      this.loadAbToleranceConfigList();
    } else {
      this.invalidSearch = true;
    }
  }

  clearSearch() {
    this.invalidSearch = false;
    this.searchForm.reset();
    this.searchData='';
    this.configPageEvent.pageIndex = 0;
    this.loadAbToleranceConfigList();
  }

  updateToggle(payload: AbToleranceConfigResponse) {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.CONFIRM,
        message: 'pw.alertPopup.saveConfirmation'
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) {
          this.toggleStatus = payload.isActive
            ? ListingActiveDeactiveStatus.ACTIVE
            : ListingActiveDeactiveStatus.DEACTIVE;
          this.abToleranceConfigFacade.updateConfigIsActive(payload);
        } else this.loadAbToleranceConfigList();
      });
  }

  loadDetailPage(configId: string) {
    this.router.navigate([
      getAdavanceBookingToleranceConfigDetailsRouteUrl(this.orderType, configId)
    ]);
  }

  loadAbToleranceConfigList() {
    this.abToleranceConfigFacade.loadAbToleranceConfigList({
      description: this.searchData,
      orderType:
        this.orderType === 'frozen'
          ? ConfigTypeEnum.ORDER_AB_FROZEN_TOLERANCE
          : ConfigTypeEnum.ORDER_AB_NON_FROZEN_TOLERANCE,
      pageIndex: this.configPageEvent.pageIndex,
      pageSize: this.configPageEvent.pageSize
    });
  }

  loadPaginateData(pageEvent) {
    this.configPageEvent = pageEvent;
    this.loadAbToleranceConfigList();
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

  back() {
    this.abToleranceConfigFacade.loadReset();
    this.router.navigate([getConfigurationHomeRouteUrl()], {
      queryParams: {
        menu: ConfigurationsMenuKeyEnum.ADVANCE_BOOKING_TRANSACTION_MENU_KEY
      }
    });
  }

  errorHandler(error: CustomErrors) {
    if (error.code === this.searchErrorCode) {
      return;
    }
    this.overlayNotification.show({
      type: OverlayNotificationType.ERROR,
      hasClose: true,
      error: error
    });
  }

  onOrderTypeChanged(event) {
    if (this.orderType !== this.orderTypeFormControl.value) {
      this.orderType = this.orderTypeFormControl.value;
      this.configPageEvent = this.initialPageEvent;
      this.clearSearch();
      this.router.navigate([
        getAdavanceBookingToleranceConfigListRouteUrl(this.orderType)
      ]);
      this.abToleranceConfigFacade.loadReset();
      this.loadAbToleranceConfigList();
    }
  }

  openViewPage(configId) {
    this.router.navigate(
      [
        getAdavanceBookingToleranceConfigDetailsRouteUrl(
          this.orderType,
          configId
        )
      ],
      {
        queryParams: { showViewOnly: 'true' },
        queryParamsHandling: 'merge'
      }
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
