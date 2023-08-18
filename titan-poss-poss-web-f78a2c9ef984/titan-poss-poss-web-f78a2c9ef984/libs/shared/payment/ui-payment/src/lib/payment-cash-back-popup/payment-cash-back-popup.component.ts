import {
  Component,
  ChangeDetectionStrategy,
  Inject,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import {
  CashBackBankDetail,
  CashBackConfigDetail,
  CashBackPayment,
  PaymentGroupEnum,
  ValidateCashBackPayload
} from '@poss-web/shared/models';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-payment-cash-back-popup',
  templateUrl: './payment-cash-back-popup.component.html',
  styleUrls: []
})
export class PaymentCashBackPopupComponent implements OnInit, OnDestroy {
  cashBackOfferForm: FormGroup;
  destroy$ = new Subject();
  cashBackOfferConfigDetails: CashBackConfigDetail;
  cashBackBankDetails: CashBackBankDetail[] = [];
  tranlatedMsg: any;
  isCashBackValidated;
  invoiceAmount = 0;
  paymentCollected = 0;
  remainingAmnt = 0;
  @Output() getCashBackConfigDetails = new EventEmitter<string>();
  @Output() validateCashBackCard = new EventEmitter<ValidateCashBackPayload>();
  @Output() resetCashBackPayment = new EventEmitter();
  constructor(
    public dialogRef: MatDialogRef<PaymentCashBackPopupComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      cashBackOfferBankDetails$: Observable<CashBackBankDetail[]>;
      totalAmountDue: number;
      paymentGroup: PaymentGroupEnum;
      currencyCode: string;
      cashBackOfferConfigDetails$: Observable<CashBackConfigDetail>;
      isCashBackCardValidated$: Observable<any>;
      transactionTotalAmount: number;
    },
    private fieldValidatorsService: FieldValidatorsService,
    private translate: TranslateService
  ) {
    this.translate
      .get([
        'pw.paymentCashBackOffer.cardNumberLabel',
        'pw.paymentCashBackOffer.swipeAmntLabel'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.tranlatedMsg = translatedMessages;
      });
  }

  ngOnInit(): void {
    if (this.data && this.data.cashBackOfferBankDetails$) {
      this.data.cashBackOfferBankDetails$
        .pipe(takeUntil(this.destroy$))
        .subscribe(cashBackBankDetails => {
          if (cashBackBankDetails) {
            this.cashBackBankDetails = cashBackBankDetails;
          }
        });
    }

    this.cashBackOfferForm = new FormGroup({
      bankName: new FormControl(''),
      cardNumber: new FormControl('', [
        this.fieldValidatorsService.numbersField(
          this.tranlatedMsg['pw.paymentCashBackOffer.cardNumberLabel']
        ),
        this.fieldValidatorsService.maxLength(
          20,
          this.tranlatedMsg['pw.paymentCashBackOffer.cardNumberLabel']
        ),
        this.fieldValidatorsService.requiredField(
          this.tranlatedMsg['pw.paymentCashBackOffer.cardNumberLabel']
        )
      ]),
      swipeAmnt: new FormControl('', [
        this.fieldValidatorsService.requiredField(
          this.tranlatedMsg['pw.paymentCashBackOffer.swipeAmntLabel']
        )
      ])
    });

    if (this.data && this.data.cashBackOfferConfigDetails$) {
      this.data.cashBackOfferConfigDetails$
        .pipe(takeUntil(this.destroy$))
        .subscribe(cashBackOfferConfigDetails => {
          if (cashBackOfferConfigDetails) {
            this.cashBackOfferConfigDetails = cashBackOfferConfigDetails;
            this.invoiceAmount = this.data.transactionTotalAmount;
            this.remainingAmnt = this.data.totalAmountDue;
            this.paymentCollected = this.invoiceAmount - this.remainingAmnt;
            this.cashBackOfferForm
              .get('swipeAmnt')
              .setValidators([
                this.fieldValidatorsService.requiredField(
                  this.tranlatedMsg['pw.paymentCashBackOffer.cardNumberLabel']
                ),
                this.fieldValidatorsService.minAmount(
                  this.cashBackOfferConfigDetails.minSwipeAmt,
                  this.tranlatedMsg['pw.paymentCashBackOffer.swipeAmntLabel'],
                  this.data.currencyCode
                ),
                this.fieldValidatorsService.maxAmount(
                  this.cashBackOfferConfigDetails.maxSwipeAmt,
                  this.tranlatedMsg['pw.paymentCashBackOffer.swipeAmntLabel'],
                  this.data.currencyCode
                ),
                this.fieldValidatorsService.maxAmount(
                  this.remainingAmnt,
                  this.tranlatedMsg['pw.paymentCashBackOffer.swipeAmntLabel'],
                  this.data.currencyCode
                )
              ]);
            this.cashBackOfferForm.get('swipeAmnt').updateValueAndValidity();
          } else {
            this.cashBackOfferConfigDetails = null;
            this.cashBackOfferForm.get('cardNumber').setValue('');
            this.cashBackOfferForm.get('swipeAmnt').setValue('');
            this.resetCashBackPayment.emit();
          }
        });
    }

    this.data.isCashBackCardValidated$
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (res) {
          this.isCashBackValidated = res;
        } else {
          this.isCashBackValidated = null;
        }
      });

    this.cashBackOfferForm.get('swipeAmnt').valueChanges.subscribe(value => {
      if (value && this.cashBackOfferForm.get('swipeAmnt').valid) {
        this.remainingAmnt =
          this.remainingAmnt -
          Number(this.cashBackOfferForm.get('swipeAmnt').value);
        this.paymentCollected =
          this.paymentCollected +
          Number(this.cashBackOfferForm.get('swipeAmnt').value);
      } else {
        this.invoiceAmount = this.data.transactionTotalAmount;
        this.remainingAmnt = this.data.totalAmountDue;
        this.paymentCollected = this.invoiceAmount - this.remainingAmnt;
      }
    });
  }
  close() {
    this.dialogRef.close(null);
  }

  validateCard() {
    if (this.cashBackOfferForm.valid) {
      const bankName = this.cashBackBankDetails.find(
        bank => bank.value === this.cashBackOfferForm.get('bankName').value
      );
      const validateRequestData: ValidateCashBackPayload = {
        bankName: bankName.description,
        cardNumber: this.cashBackOfferForm.get('cardNumber').value,
        invoiceAmount: this.invoiceAmount,
        swipeAmount: this.cashBackOfferForm.get('swipeAmnt').value,
        offerId: this.cashBackOfferForm.get('bankName').value
      };

      this.validateCashBackCard.emit(validateRequestData);
    }
  }

  addPayment() {
    const bankName = this.cashBackBankDetails.find(
      bank => bank.value === this.cashBackOfferForm.get('bankName').value
    );
    const payment = new CashBackPayment(this.data.paymentGroup, {
      amount: this.isCashBackValidated.discountValue,
      instrumentNo: this.cashBackOfferForm.get('cardNumber').value,
      reference1: this.cashBackOfferForm.get('bankName').value,
      bankName: bankName.description,
      reference2: this.cashBackOfferForm.get('swipeAmnt').value
    });
    this.dialogRef.close(payment);
  }

  selectBankName() {
    if (this.cashBackOfferForm.get('bankName').value) {
      this.getCashBackConfigDetails.emit(
        this.cashBackOfferForm.get('bankName').value
      );
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
