import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { TranslateService } from '@ngx-translate/core';
import {
  CustomErrors,
  QCGCGetBalancePayload,
  PaymentModeEnum,
  OverlayNotificationEventType,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationEventRef,
  GiftCardTypeValueEnum,
  CustomerInfo,
  GiftCardTxnEnum,
  ToolbarConfig,
  TransactionTypeEnum,
  SubTransactionTypeEnum,
  LocationSettingAttributesEnum
} from '@poss-web/shared/models';
import { CustomerFacade } from '@poss-web/shared/customer/data-access-customer';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { PaymentFacade } from '@poss-web/shared/payment/data-access-payment';
import * as moment from 'moment';
import { OverlayNotificationType } from '@poss-web/shared/models';
import { LocationSettingsFacade } from '@poss-web/shared/location-settings/data-access-location-settings';
import { CurrencySymbolService } from '@poss-web/shared/components/ui-formatters';
import { ToolbarFacade } from '@poss-web/shared/toolbar/data-access-toolbar';

@Component({
  selector: 'poss-web-gift-cards-balance-inquiry',
  templateUrl: './gift-cards-balance-inquiry.component.html',
  styleUrls: ['./gift-cards-balance-inquiry.component.scss']
})
export class GiftCardsBalanceInquiryComponent implements OnInit, OnDestroy {
  currencyCode: string;
  customerId: string;
  cardBalanceAmount: number | '';
  cardExpiryDate: any;
  cpgGroupDescription: string;
  clearCardNumberField: boolean;
  giftCardBalanceInquiryFormGroup: FormGroup;
  giftCardTypeValueEnum = GiftCardTypeValueEnum;
  hasError$: Observable<CustomErrors>;
  isGcLoading$: Observable<boolean>;
  isPaymentLoading$: Observable<boolean>;
  isScan = false;
  selectCustomerAlertMessage: string;
  selectedCustomerDetail$: Observable<CustomerInfo>;
  cardNumber: string;

  destroy$: Subject<null> = new Subject<null>();

  constructor(
    public currencySymbolService: CurrencySymbolService,
    public dialog: MatDialog,
    public locationSettingsFacade: LocationSettingsFacade,
    public translate: TranslateService,
    private fieldValidatorsService: FieldValidatorsService,
    private customerFacade: CustomerFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private paymentFacade: PaymentFacade,
    private toolbarFacade: ToolbarFacade
  ) {
    this.giftCardBalanceInquiryFormGroup = new FormGroup({
      selectRadioButton: new FormControl(
        GiftCardTypeValueEnum.QUIKCILVER,
        this.fieldValidatorsService.requiredField('Select Radio Button')
      ),
      cardNumber: new FormControl(
        '',
        this.fieldValidatorsService.requiredField('Card Number')
      ),
      cardPin: new FormControl('', [
        this.fieldValidatorsService.numbersField('Card Pin')
        // this.fieldValidatorsService.requiredField('Card Pin')
      ]),
      amount: new FormControl('')
    });
  }

  ngOnInit() {
    const toolbarData: ToolbarConfig = {
      txnType: TransactionTypeEnum.CM,
      subTxnType: SubTransactionTypeEnum.GIFT_SALE,
      loadMetalPrices: true,
      loadHoldPopup: false,
      loadOpenOrdersPopup: false
    };
    this.toolbarFacade.setToolbarConfig(toolbarData);
    this.overlayNotification.close();
    this.paymentFacade.resetQCGC();
    this.getTranslatedAlertMessages();
    this.customerFacade.clearSelectedCustomer();
    this.locationSettingsFacade
      .getLocationSetting(
        LocationSettingAttributesEnum.BASECURRENCY_CURRENCY_CODE
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((currencyCode: string) => {
        this.currencyCode = currencyCode;
      });
    this.customerFacade
      .getSelectSelectedCustomer()
      .pipe(takeUntil(this.destroy$))
      .subscribe((selectedCustomer: CustomerInfo) => {
        if (selectedCustomer) {
          this.customerId = selectedCustomer.customerId;
        }
      });
    this.isPaymentLoading$ = this.paymentFacade.getIsLoading();
    this.paymentFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });
    this.paymentFacade
      .getQCGCBalanceDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe(cardBalanceDetails => {
        if (cardBalanceDetails) {
          this.clearFields();
          this.cardBalanceAmount = Number(cardBalanceDetails.amount)
            ? Number(cardBalanceDetails.amount)
            : 0;
          this.cardExpiryDate = cardBalanceDetails.cardExpiryDate
            ? moment(cardBalanceDetails.cardExpiryDate)
            : '';
          // moment(cardBalanceDetails.cardExpiryDate, 'DD-MM-YYYY')
          this.cpgGroupDescription = cardBalanceDetails.paymentCategoryName
            ? cardBalanceDetails.paymentCategoryName
            : '';
          this.cardNumber = cardBalanceDetails.cardNumber
            ? cardBalanceDetails.cardNumber
            : '';
          console.log('cardBalanceDetails :', cardBalanceDetails);
          console.log('cardBalanceAmount :', this.cardBalanceAmount);
          console.log('cardExpiryDate :', this.cardExpiryDate);
          console.log('cpgGroupDescription :', this.cpgGroupDescription);
        }
      });
    // this.selectedCustomerDetail$ = this.customerFacade.getSelectSelectedCustomer();
  }

  clearFields() {
    this.clearCardNumberField = true;
    this.giftCardBalanceInquiryFormGroup.get('cardPin').reset();
    this.giftCardBalanceInquiryFormGroup
      .get('cardPin')
      .updateValueAndValidity();
  }

  errorHandler(error: CustomErrors) {
    this.overlayNotification
      .show({
        type: OverlayNotificationType.ERROR,
        hasClose: true,
        error: error,
        hasBackdrop: true
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: OverlayNotificationEventRef) => {
        if (event && event.eventType === OverlayNotificationEventType.CLOSE) {
          this.clearFields();
          this.cpgGroupDescription = null;
        }
      });
  }

  showAlertNotification(message: string): void {
    this.overlayNotification
      .show({
        type: OverlayNotificationType.SIMPLE,
        hasClose: true,
        message
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  getTranslatedAlertMessages() {
    const selectCustomerAlertMessage = 'pw.giftCards.selectCustomerAlert';
    this.translate
      .get([selectCustomerAlertMessage])
      .pipe(takeUntil(this.destroy$))
      .subscribe(translatedMessages => {
        this.selectCustomerAlertMessage =
          translatedMessages[selectCustomerAlertMessage];
      });
  }

  getQCGCBalance(cardNumber: string) {
    // if (!this.customerId) {
    //   this.showAlertNotification(this.selectCustomerAlertMessage);
    // } else {
    this.clearCardNumberField = false;
    this.cardBalanceAmount = null;
    this.cardExpiryDate = null;
    this.cpgGroupDescription = null;
    const QCGCPaylaod: QCGCGetBalancePayload = {
      cardType: GiftCardTxnEnum.QC_VENDOR_CODE,
      cardNumber
    };
    this.paymentFacade.getQCGCBalance(QCGCPaylaod);
    // }
  }

  getCardNumber(
    event:
      | { cardNumber: string; trackdata: string }
      | { cardNumber: string; error: boolean }
  ): void {
    this.giftCardBalanceInquiryFormGroup
      .get('cardNumber')
      .setValue(event.cardNumber);
    this.giftCardBalanceInquiryFormGroup.updateValueAndValidity();
  }

  setScan(isScan: boolean) {
    this.isScan = isScan;
  }

  ngOnDestroy() {
    this.customerFacade.clearSelectedCustomer();
    this.paymentFacade.resetPayment();
    this.destroy$.next();
    this.destroy$.complete();
    this.toolbarFacade.resetValues();
    this.toolbarFacade.setToolbarConfig({
      loadMetalPrices: true,
      loadHoldPopup: false,
      loadOpenOrdersPopup: false
    });
  }
}
