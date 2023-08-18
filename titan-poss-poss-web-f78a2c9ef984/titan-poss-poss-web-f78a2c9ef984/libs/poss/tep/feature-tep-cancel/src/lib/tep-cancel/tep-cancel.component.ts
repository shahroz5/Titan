import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { TEPRequestFacade } from '@poss-web/poss/tep/data-access-tep';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { SharedBodEodFacade } from '@poss-web/shared/bod-eod/data-access-bod-eod';
import { LocationSettingsFacade } from '@poss-web/shared/location-settings/data-access-location-settings';
import {
  AdvanceBookingSearchPayload,
  CustomErrors,
  LocationSettingAttributesEnum,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  SubTransactionTypeEnum,
  TEPList,
  ToolbarConfig,
  TransactionTypeEnum
} from '@poss-web/shared/models';
import { ToolbarFacade } from '@poss-web/shared/toolbar/data-access-toolbar';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { getCancelTepUrl } from '@poss-web/shared/util-site-routes';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-tep-cancel',
  templateUrl: './tep-cancel.component.html'
})
export class TepCancelComponent implements OnInit, OnDestroy {
  tepStatus: FormControl;
  SearchTepForm: FormGroup;
  pageSize: number;
  LoadedOnce = true;
  status: string;
  statusColor: string;
  TEPList: TEPList[] = [];
  currencyCode: string;
  TEPListCount$: Observable<number>;
  currentFiscalYear: string;
  clearFilter: boolean;
  data: any;
  destroy$: Subject<null> = new Subject<null>();
  isLoading$: Observable<boolean>;
  action: string;
  pageSizeOptions: number[] = [];
  minPageSize = 0;
  configPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };
  pageEvent: PageEvent;
  toolbarData: ToolbarConfig = {
    txnType: TransactionTypeEnum.TEP,
    subTxnType: SubTransactionTypeEnum.NEW_TEP,
    loadMetalPrices: true,
    loadHoldPopup: false,
    loadOpenOrdersPopup: false
  };

  constructor(
    private toolbarFacade: ToolbarFacade,
    private translate: TranslateService,
    private tepFacade: TEPRequestFacade,
    private fieldValidatorsService: FieldValidatorsService,
    private appSettingFacade: AppsettingFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private locationSettingsFacade: LocationSettingsFacade,
    private router: Router,
    private bodeodFacade: SharedBodEodFacade
  ) {
    if (history.state && history.state.clearFilter === false) {
      this.clearFilter = false;
    } else {
      this.clearFilter = true;
      this.tepFacade.setSearchValue({
        doNo: null,
        fiscalYear: null,
        function: null,
        phNo: null
      });
    }
  }

  ngOnInit(): void {
    this.bodeodFacade.loadLatestBusinessDay();
    this.bodeodFacade
      .getFiscalYear()
      .pipe(takeUntil(this.destroy$))
      .subscribe((fiscalYear: number) => {
        if (fiscalYear) {
          this.currentFiscalYear = fiscalYear.toString();
        }
      });
    this.overlayNotification.close();

    this.appSettingFacade
      .getPageSize()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.configPageEvent.pageSize = data;
        this.pageSize = data;
      });
    this.appSettingFacade
      .getPageSizeOptions()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.pageSizeOptions = data;
        this.minPageSize = this.pageSizeOptions.reduce((a: number, b: number) =>
          a < b ? a : b
        );
      });
    this.locationSettingsFacade
      .getLocationSetting(
        LocationSettingAttributesEnum.BASECURRENCY_CURRENCY_CODE
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(currencyCode => {
        this.currencyCode = currencyCode;
      });

    this.tepFacade
      .getSearchValues()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.data = data;
        this.SearchTepForm = new FormGroup({
          tepStatus: new FormControl(data.function),

          fiscalYear: new FormControl(data.fiscalYear ? data.fiscalYear : '', [
            this.fieldValidatorsService.fiscalYearField('Fiscal Year'),
            this.fieldValidatorsService.requiredField('Fiscal Year')
          ]),
          docNumber: new FormControl(data.doNo, [
            this.fieldValidatorsService.requestNumberField('Doc No.')
          ]),
          mobileNumber: new FormControl(data.phNo, [
            this.fieldValidatorsService.mobileField('mobileNumber')
          ])
        });
      });

    this.componentInit();

    if (this.SearchTepForm.get('tepStatus').value) {
      this.SearchTEP(false);
    }
  }
  componentInit() {
    this.isLoading$ = this.tepFacade.getIsLoading();
    this.toolbarFacade.setToolbarConfig(this.toolbarData);
    this.tepFacade
      .getHasError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });
    this.tepFacade
      .getTEPSearchResposne()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: TEPList[]) => {
        if (data) {
          this.TEPList = data;
        }
      });
    this.TEPListCount$ = this.tepFacade.getSearchTEPCount();
  }

  SearchTEP(value: boolean) {
    if (value) {
      this.tepFacade.setSearchValue({
        doNo: this.SearchTepForm.get('docNumber').value,
        fiscalYear: this.SearchTepForm.get('fiscalYear').value,
        function: 'CONFIRMED',
        phNo: this.SearchTepForm.get('mobileNumber').value
      });
    }

    const TEPSearchPayload: AdvanceBookingSearchPayload = {
      status: null,
      docNo: this.SearchTepForm.get('docNumber').value
        ? this.SearchTepForm.get('docNumber').value
        : null,

      fiscalYear: this.SearchTepForm.get('fiscalYear').value
        ? this.SearchTepForm.get('fiscalYear').value
        : null,
      mobileNumber: this.SearchTepForm.get('mobileNumber').value
        ? this.SearchTepForm.get('mobileNumber').value
        : null,
      txnType: SubTransactionTypeEnum.TEP_CAN,
      subTxnType: TransactionTypeEnum.TEP,

      page: this.configPageEvent.pageIndex,
      size: this.configPageEvent.pageSize
    };

    this.tepFacade.searchTEP(TEPSearchPayload, null);
  }

  onSelected(event) {
    this.router.navigate([
      getCancelTepUrl(event.refTxnId, 'cancel', event.subTxnType.toLowerCase())
    ]);
  }

  errorHandler(error: CustomErrors) {
    this.overlayNotification
      .show({
        type: OverlayNotificationType.ERROR,
        hasClose: true, // optional
        error: error
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  expireNotifications(errorKey: string) {
    const key = errorKey;
    this.translate
      .get(key)
      .pipe(take(1))
      .subscribe((translatedMessage: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SIMPLE,
            message: translatedMessage,
            hasClose: true,
            hasBackdrop: true
          })
          .events.pipe(takeUntil(this.destroy$))
          .subscribe();
      });
  }

  errorNotifications(errorKey: string) {
    const key = errorKey;
    this.translate
      .get(key)
      .pipe(take(1))
      .subscribe((translatedMessage: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SIMPLE,
            message: translatedMessage,
            hasClose: true,
            hasBackdrop: true
          })
          .events.pipe(takeUntil(this.destroy$))
          .subscribe();
      });
  }

  ngOnDestroy() {
    this.toolbarFacade.setToolbarConfig({
      loadMetalPrices: true,
      loadHoldPopup: false,
      loadOpenOrdersPopup: false
    });

    this.tepFacade.clearSearchList();
    this.destroy$.next();
    this.destroy$.complete();
  }

  paginate(pageEvent: PageEvent) {
    this.configPageEvent = pageEvent;

    this.tepFacade.searchTEP({
      status: null,
      docNo: this.SearchTepForm.get('docNumber').value
        ? this.SearchTepForm.get('docNumber').value
        : null,

      fiscalYear: this.SearchTepForm.get('fiscalYear').value
        ? this.SearchTepForm.get('fiscalYear').value
        : null,
      mobileNumber: this.SearchTepForm.get('mobileNumber').value
        ? this.SearchTepForm.get('mobileNumber').value
        : null,
      txnType: SubTransactionTypeEnum.TEP_CAN,
      subTxnType: TransactionTypeEnum.TEP,

      page: this.configPageEvent.pageIndex,
      size: this.configPageEvent.pageSize
    });
  }
}
