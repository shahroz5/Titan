import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AdvanceBookingFacade } from '@poss-web/poss/advance-booking/data-access-advance-booking';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { SharedBodEodFacade } from '@poss-web/shared/bod-eod/data-access-bod-eod';
import { LocationSettingsFacade } from '@poss-web/shared/location-settings/data-access-location-settings';
import {
  ABSearchActionType,
  AdvanceBookingDetailsResponse,
  AdvanceBookingSearchPayload,
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  CustomErrors,
  LocationSettingAttributesEnum,
  OverlayNotificationEventRef,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  SubTransactionTypeEnum,
  ToolbarConfig,
  TransactionTypeEnum
} from '@poss-web/shared/models';
import { ToolbarFacade } from '@poss-web/shared/toolbar/data-access-toolbar';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { getViewAdvanceBookingUrl } from '@poss-web/shared/util-site-routes';
import * as moment from 'moment';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { CommonFacade } from '@poss-web/shared/common/data-access-common';

@Component({
  selector: 'poss-web-search-advance-booking',
  templateUrl: './search-advance-booking.component.html'
})
export class SearchAdvanceBookingComponent implements OnInit, OnDestroy {
  ABFunction: FormControl;
  type = 'view';
  searchABForm: FormGroup;
  pageSize = 4;
  LoadedOnce = true;
  status: string;
  statusColor: string;
  initalPageSize = 8;
  advanceBookingList: AdvanceBookingDetailsResponse[] = [];
  advanceBookingListCount$: Observable<number>;

  currentYear = moment().year();
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

  data: any;
  dropDownvalues = [
    {
      value: 'Cancel_AB',
      description: 'Cancel AB',
      isActive: true
    },
    {
      value: 'Freeze_AB',
      description: 'Freeze AB',
      isActive: true
    },

    {
      value: 'Activate_AB',
      description: 'Activate AB',
      isActive: true
    },
    {
      value: 'add_Payments',
      description: 'Add Payment',
      isActive: true
    },
    {
      value: 'All',
      description: 'View All',
      isActive: true
    }
  ];
  advanceBookingSearchPayload: AdvanceBookingSearchPayload;
  toolbarData: ToolbarConfig = {
    txnType: TransactionTypeEnum.AB,
    subTxnType: SubTransactionTypeEnum.NEW_AB,
    loadMetalPrices: true,
    loadHoldPopup: false,
    loadOpenOrdersPopup: false
  };
  clearFilter: boolean;
  currentFiscalYear: string;
  alertMsgForCancel: string;
  alertMsgForActivate: string;
  alertMsgForFreeze: string;
  alertMsgForAddPayment: string;
  alertMsgForViewAB: string;

  constructor(
    private toolbarFacade: ToolbarFacade,
    private translate: TranslateService,
    private advanceBookingFacade: AdvanceBookingFacade,
    private fieldValidatorsService: FieldValidatorsService,
    private appSettingFacade: AppsettingFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private locationSettingsFacade: LocationSettingsFacade,
    private router: Router,
    private bodeodFacade: SharedBodEodFacade,
    private alertPopupService: AlertPopupServiceAbstraction,
    private commonFacade: CommonFacade
  ) {
    if (history.state && history.state.clearFilter === false) {
      this.clearFilter = false;
    } else {
      this.clearFilter = true;
      this.advanceBookingFacade.setSearchValue({
        doNo: null,
        fiscalYear: null,
        function: null,
        phNo: null
      });
    }

    this.alertMsgForCancel = 'pw.advanceBooking.alertMsgForCancel';
    this.alertMsgForActivate = 'pw.advanceBooking.alertMsgForActivate';
    this.alertMsgForFreeze = 'pw.advanceBooking.alertMsgForFreeze';
    this.alertMsgForAddPayment = 'pw.advanceBooking.alertMsgForAddPayment';
    this.alertMsgForViewAB = 'pw.advanceBooking.alertMsgForViewAB';
  }

  ngOnInit(): void {
    this.bodeodFacade.loadLatestBusinessDay();
    this.overlayNotification.close();
    this.commonFacade.setFileUploadVisible(false);
    this.advanceBookingFacade.resetSearchABDetails();

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
        LocationSettingAttributesEnum.AB_CANCELLATION_ALLOWED_FOR_AB
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (!!data) {
          this.dropDownvalues[0].isActive = JSON.parse(data);
        }
      });

    this.advanceBookingFacade
      .getSearchValues()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.data = data;
        this.searchABForm = new FormGroup({
          ABFunction: new FormControl(data.function, [
            this.fieldValidatorsService.requiredField('AB Function')
          ]),
          fiscalYear: new FormControl(data.fiscalYear ? data.fiscalYear : ''),

          docNumber: new FormControl(data.doNo, [
            this.fieldValidatorsService.requestNumberField('Doc No.')
          ]),
          mobileNumber: new FormControl(data.phNo, [
            this.fieldValidatorsService.mobileField('mobileNumber')
          ])
        });
      });
    this.bodeodFacade
      .getFiscalYear()
      .pipe(takeUntil(this.destroy$))
      .subscribe((fiscalYear: number) => {
        if (fiscalYear) {
          this.currentFiscalYear = fiscalYear.toString();
        }
      });

    this.componentInit();

    if (this.searchABForm.get('ABFunction').value) {
      this.SearchAB(false);
    }
  }
  componentInit() {
    this.isLoading$ = this.advanceBookingFacade.getIsLoading();
    this.toolbarFacade.setToolbarConfig(this.toolbarData);
    this.advanceBookingFacade
      .getHasError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });

    this.advanceBookingFacade
      .getSearchABResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (advanceBookingDetailsResponse: AdvanceBookingDetailsResponse[]) => {
          if (advanceBookingDetailsResponse) {
            this.advanceBookingList = advanceBookingDetailsResponse;
          }
        }
      );

    this.advanceBookingFacade
      .getSearchABDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe(searchABDetails => {
        if (searchABDetails) {
          if (
            searchABDetails.isABSearchDone &&
            searchABDetails.searchABResponseCount === 0 &&
            this.searchABForm.get('docNumber').value
          ) {
            this.checkABFunctionAndSendMsg(
              this.searchABForm.get('ABFunction').value
            );
            this.advanceBookingFacade.resetSearchABDetails();
          }
        }
      });
    this.advanceBookingListCount$ = this.advanceBookingFacade.getSearchABCount();
  }

  SearchAB(value) {
    if (value) {
      this.advanceBookingFacade.setSearchValue({
        doNo: this.searchABForm.get('docNumber').value,
        fiscalYear: this.searchABForm.get('fiscalYear').value,
        function: this.searchABForm.get('ABFunction').value,
        phNo: this.searchABForm.get('mobileNumber').value
      });
    }

    let abSearchType = '';
    let subtxnType = null;
    if (this.searchABForm.get('ABFunction').value === 'Cancel_AB') {
      subtxnType = SubTransactionTypeEnum.NEW_AB;
      abSearchType = ABSearchActionType.CANCEL;
    } else if (this.searchABForm.get('ABFunction').value === 'Activate_AB') {
      subtxnType = SubTransactionTypeEnum.NEW_AB;
      abSearchType = ABSearchActionType.ACTIVATE;
    } else if (this.searchABForm.get('ABFunction').value === 'All') {
      subtxnType = SubTransactionTypeEnum.NEW_AB;
      abSearchType = ABSearchActionType.VIEW_ORDERS;
    } else if (this.searchABForm.get('ABFunction').value === 'Freeze_AB') {
      abSearchType = ABSearchActionType.FREEZE;
    } else if (this.searchABForm.get('ABFunction').value === 'add_Payments') {
      abSearchType = ABSearchActionType.ADD_PAYMENTS;
    }

    this.advanceBookingFacade.searchAB({
      status: abSearchType ? abSearchType : null,
      docNo: this.searchABForm.get('docNumber').value
        ? this.searchABForm.get('docNumber').value
        : null,

      fiscalYear: this.searchABForm.get('fiscalYear').value
        ? this.searchABForm.get('fiscalYear').value
        : null,
      mobileNumber: this.searchABForm.get('mobileNumber').value
        ? this.searchABForm.get('mobileNumber').value
        : null,
      txnType: TransactionTypeEnum.AB,
      subTxnType: subtxnType,
      page: 0,
      size: this.configPageEvent.pageSize
    });
  }

  onSelected(event) {
    this.navigationCheck();
    let subTxnType = 'new-ab';
    if (event.subTxnType !== 'NEW_AB') {
      subTxnType = 'manual-ab';
    }
    this.router.navigate(
      [getViewAdvanceBookingUrl(event.id, this.type, subTxnType)],
      {
        state: { subTxnType: event.subTxnType }
      }
    );
  }

  navigationCheck() {
    if (this.searchABForm.get('ABFunction').value === 'Cancel_AB') {
      this.type = 'cancel-request';
    } else if (this.searchABForm.get('ABFunction').value === 'Activate_AB') {
      this.type = 'activate-request';
    } else if (this.searchABForm.get('ABFunction').value === 'Freeze_AB') {
      this.type = 'freeze';
    } else if (this.searchABForm.get('ABFunction').value === 'add_Payments') {
      this.type = 'add-payment';
    }
  }

  errorHandler(error: CustomErrors) {
    this.overlayNotification
      .show({
        type: OverlayNotificationType.ERROR,
        hasClose: true,
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
          .subscribe((event: OverlayNotificationEventRef) => {});
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

  valueChanged(value) {
    this.advanceBookingFacade.ResetSearchValue();
  }
  dateFormat(date) {
    return moment(date);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.toolbarFacade.setToolbarConfig({
      loadMetalPrices: true,
      loadHoldPopup: false,
      loadOpenOrdersPopup: false
    });
    this.commonFacade.setFileUploadVisible(false);
    this.advanceBookingFacade.resetSearchABDetails();
  }

  paginate(pageEvent: PageEvent) {
    let abSearchType = '';
    let subtxnType = null;
    if (this.searchABForm.get('ABFunction').value === 'Cancel_AB') {
      subtxnType = SubTransactionTypeEnum.NEW_AB;
      abSearchType = ABSearchActionType.CANCEL;
    } else if (this.searchABForm.get('ABFunction').value === 'Activate_AB') {
      subtxnType = SubTransactionTypeEnum.NEW_AB;
      abSearchType = ABSearchActionType.ACTIVATE;
    } else if (this.searchABForm.get('ABFunction').value === 'All') {
      subtxnType = SubTransactionTypeEnum.NEW_AB;
      abSearchType = ABSearchActionType.VIEW_ORDERS;
    } else if (this.searchABForm.get('ABFunction').value === 'Freeze_AB') {
      abSearchType = ABSearchActionType.FREEZE;
    } else if (this.searchABForm.get('ABFunction').value === 'add_Payments') {
      abSearchType = ABSearchActionType.ADD_PAYMENTS;
    }

    this.configPageEvent = pageEvent;

    this.advanceBookingFacade.searchAB({
      docNo: this.searchABForm.get('docNumber').value,
      status: abSearchType ? abSearchType : null,

      fiscalYear: this.searchABForm.get('fiscalYear').value
        ? this.searchABForm.get('fiscalYear').value
        : null,
      mobileNumber: this.searchABForm.get('mobileNumber').value
        ? this.searchABForm.get('mobileNumber').value
        : null,
      txnType: TransactionTypeEnum.AB,
      subTxnType: subtxnType,
      page: this.configPageEvent.pageIndex,
      size: this.configPageEvent.pageSize
    });
  }

  showAlertPopUp(message: string) {
    this.alertPopupService.open({
      type: AlertPopupTypeEnum.INFO,
      message
    });
  }

  checkABFunctionAndSendMsg(ABFunction) {
    if (ABFunction === 'Cancel_AB') {
      this.showAlertPopUp(this.alertMsgForCancel);
    } else if (ABFunction === 'Activate_AB') {
      this.showAlertPopUp(this.alertMsgForActivate);
    } else if (ABFunction === 'All') {
      this.showAlertPopUp(this.alertMsgForViewAB);
    } else if (ABFunction === 'Freeze_AB') {
      this.showAlertPopUp(this.alertMsgForFreeze);
    } else if (ABFunction === 'add_Payments') {
      this.showAlertPopUp(this.alertMsgForAddPayment);
    }
  }
  
}
