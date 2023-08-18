import {
  Component,
  OnInit,
  Inject,
  EventEmitter,
  Output,
  OnDestroy,
  ViewChild
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup } from '@angular/forms';
import {
  PaymentGroupEnum,
  DigiGetBalancePayload,
  DigiGoldDetails,
  GenerateOtpDigiGoldPayload,
  PaymentModeEnum,
  DigiGoldNonTanshiqPayment,
  DigiGoldCombinedPaymentPayload,
  DigiGoldTanshiqPayment
} from '@poss-web/shared/models';
import { combineLatest, Observable, Subject } from 'rxjs';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import {
  CurrencyFormatterService,
  DigiGoldWeightFormatterService
} from '@poss-web/shared/components/ui-formatters';
import { MatTabGroup } from '@angular/material/tabs';

@Component({
  selector: 'poss-web-payment-digi-gold-popup',
  templateUrl: './payment-digi-gold-popup.component.html',
  styleUrls: ['./payment-digi-gold-popup.component.scss']
})
export class PaymentDigiGoldPopupComponent implements OnInit, OnDestroy {
  @Output() addDigi = new EventEmitter<DigiGoldCombinedPaymentPayload>();
  @Output() getDigiBalance = new EventEmitter<DigiGetBalancePayload>();
  @Output() sendOtp = new EventEmitter<GenerateOtpDigiGoldPayload>();
  @Output() resetDigi = new EventEmitter();

  cardNumber = '';
  productList: string[];
  sellingPrice = 0;

  public activeTab = 0;

  destroy$ = new Subject();
  cardDetails: DigiGoldDetails;
  amountLabel: string;
  weightLabel: string;

  OTPFiledFormControl: FormControl;
  mobileNumber: FormControl;
  tanshiqForm: FormGroup;
  nonTanshiqform: FormGroup;
  isOtpGeneratedForDigi = false;
  disable = false;
  tabIndex = 0;
  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;
  constructor(
    public dialogRef: MatDialogRef<PaymentDigiGoldPopupComponent>,
    private fieldValidatorsService: FieldValidatorsService,
    private currencyFormatterService: CurrencyFormatterService,
    private weightFormatterService: DigiGoldWeightFormatterService,
    private translate: TranslateService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      digiBalance: Subject<any>;
      paymentGroup: PaymentGroupEnum;
      currencyCode: string;
      digiPrice: Subject<any>;
      isOtpGeneratedForDigi$: Observable<boolean>;
      isDigiPaymentComplete$: Observable<any>;
      mobileNo: string;
      businessDate: string;
      isCustomerMandatoryForDigiGold: boolean;
      tab1: string;
      tab2: string;
    }
  ) {
    this.translate
      .get(['pw.paymentModeDigi.amountLabel', 'pw.paymentModeDigi.weightLabel'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.amountLabel = translatedMessages['pw.paymentModeDigi.amountLabel'];
        this.weightLabel = translatedMessages['pw.paymentModeDigi.weightLabel'];
      });
    this.data.digiBalance.pipe(takeUntil(this.destroy$)).subscribe(x => {
      this.cardDetails = x.currentValue;
      if (this.cardDetails?.tanishqGoldBalanceInGrams > 0) {
        this.tanshiqForm.enable();
        this.tanshiqForm
          .get('amount')
          .setValidators(
            this.createAmountValidators(
              this.cardDetails.tanishqGoldBalanceInGrams
            )
          );
        this.tanshiqForm
          .get('weight')
          .setValidators(
            this.createweightValidators(
              this.cardDetails.tanishqGoldBalanceInGrams
            )
          );
      }
      if (this.cardDetails?.nonTanishqGoldBalanceInGrams > 0) {
        this.nonTanshiqform.enable();
        this.nonTanshiqform
          .get('amount')
          .setValidators(
            this.createAmountValidators(
              this.cardDetails.nonTanishqGoldBalanceInGrams
            )
          );
        this.nonTanshiqform
          .get('weight')
          .setValidators(
            this.createweightValidators(
              this.cardDetails.nonTanishqGoldBalanceInGrams
            )
          );
      }
    });

    this.data.digiPrice.pipe(takeUntil(this.destroy$)).subscribe(price => {
      this.sellingPrice = price.currentValue;
    });
  }

  changeWeightNonTanshiq(weight) {
    if (this.nonTanshiqform.get('amount').valid) {
      this.nonTanshiqform.get('weight').markAsTouched();
      this.nonTanshiqform
        .get('weight')
        .patchValue(
          this.weightFormatterService.format(
            Number(weight.target.value) / this.sellingPrice
          )
        );
    }
  }
  changeWeightTanshiq(weight) {
    if (this.tanshiqForm.get('amount').valid) {
      this.tanshiqForm.get('weight').markAsTouched();
      this.tanshiqForm
        .get('weight')
        .patchValue(
          this.weightFormatterService.format(
            Number(weight.target.value) / this.sellingPrice
          )
        );
    }
  }
  changePriceNonTanshiq(selectedValue) {
    if (this.nonTanshiqform.get('weight').valid) {
      this.nonTanshiqform
        .get('amount')
        .patchValue(
          Math.round(this.sellingPrice * Number(selectedValue.target.value))
        );
    }
  }

  changePriceTanshiq(selectedValue) {
    if (this.tanshiqForm.get('weight').valid) {
      this.tanshiqForm
        .get('amount')
        .patchValue(
          Math.round(this.sellingPrice * Number(selectedValue.target.value))
        );
    }
  }

  ngOnInit() {
    this.mobileNumber = new FormControl(this.data.mobileNo, [
      this.fieldValidatorsService.numbersField('Mobile No')
    ]);
    this.data.isOtpGeneratedForDigi$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isOptGenerate => {
        this.isOtpGeneratedForDigi = isOptGenerate;
        if (isOptGenerate) {
          this.OTPFiledFormControl.enable();
        }
      });

    this.data.isDigiPaymentComplete$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isComplete => {
        if (isComplete) {
          this.dialogRef.close();
        }
      });

    if (this.data.isCustomerMandatoryForDigiGold) {
      this.mobileNumber.disable();
    }

    this.OTPFiledFormControl = new FormControl('', [
      this.fieldValidatorsService.requiredField('OTP'),
      this.fieldValidatorsService.numbersField('OTP')
    ]);

    this.tanshiqForm = new FormGroup({
      amount: new FormControl(null, this.createAmountValidators(0)),
      weight: new FormControl(null, this.createweightValidators(0))
    });

    this.nonTanshiqform = new FormGroup({
      amount: new FormControl(null, this.createAmountValidators(0)),
      weight: new FormControl(null, this.createweightValidators(0))
    });

    this.tanshiqForm.disable();
    this.nonTanshiqform.disable();
    this.OTPFiledFormControl.disable();
    if (this.data.tab1 === 'Not Added' && this.data.tab2 === 'Not Added') {
      this.onTabChanged(0);
    } else if (this.data.tab1 === 'Not Added') {
      this.onTabChanged(0);
    } else if (this.data.tab2 === 'Not Added') {
      this.onTabChanged(1);
    }

    combineLatest([
      this.tanshiqForm
        .get('weight')
        .valueChanges.pipe(takeUntil(this.destroy$)),
      this.tanshiqForm.get('amount').valueChanges.pipe(takeUntil(this.destroy$))
    ]).subscribe(([weight, amount]) => {
      this.disableGenerateOTP();
    });

    combineLatest([
      this.nonTanshiqform
        .get('weight')
        .valueChanges.pipe(takeUntil(this.destroy$)),
      this.nonTanshiqform
        .get('amount')
        .valueChanges.pipe(takeUntil(this.destroy$))
    ]).subscribe(([weight, amount]) => {
      this.disableGenerateOTP();
    });
  }

  onTabChanged(event) {
    this.tabIndex = event;
    this.disableGenerateOTP();
  }

  disableGenerateOTP() {
    if (this.tabIndex === 0) {
      if (
        this.tanshiqForm.get('amount').invalid ||
        this.tanshiqForm.get('amount').disabled ||
        this.tanshiqForm.get('weight').invalid ||
        this.tanshiqForm.get('weight').disabled
      ) {
        this.disable = true;
      } else {
        this.disable = false;
      }
    } else if (this.tabIndex === 1) {
      if (
        this.nonTanshiqform.get('amount').invalid ||
        this.nonTanshiqform.get('amount').disabled ||
        this.nonTanshiqform.get('weight').invalid ||
        this.nonTanshiqform.get('weight').disabled
      ) {
        this.disable = true;
      } else {
        this.disable = false;
      }
    }
  }

  createweightValidators(weight) {
    const validators = [
      this.fieldValidatorsService.requiredField(this.weightLabel),
      //   this.fieldValidatorsService.weightField(this.weightLabel),
      this.fieldValidatorsService.max(weight, this.weightLabel),
      this.fieldValidatorsService.min(0.0001, this.weightLabel)
    ];

    return validators;
  }

  createAmountValidators(weight) {
    const validators = [
      this.fieldValidatorsService.requiredField(this.amountLabel),
      this.fieldValidatorsService.minAmount(
        1,
        this.amountLabel,
        this.data.currencyCode
      ),
      this.fieldValidatorsService.maxAmount(
        Math.round(weight * this.sellingPrice),
        this.amountLabel,
        this.data.currencyCode
      )
    ];

    return validators;
  }

  addPayment() {
    const paymentPayload: DigiGoldCombinedPaymentPayload = {
      nonTanshiq:
        this.nonTanshiqform.get('amount').value > 0
          ? new DigiGoldNonTanshiqPayment(this.data.paymentGroup, {
              amount: this.nonTanshiqform.get('amount').value,
              reference1: this.OTPFiledFormControl.value,
              instrumentDate: this.data.businessDate,

              otherDetails: {
                type: PaymentModeEnum.DIGI_GOLD_NON_TANISHQ,
                data: {
                  mobileNo: this.mobileNumber.value,
                  sellingPrice: this.sellingPrice,
                  totalGrams: Number(
                    (
                      Number(this.tanshiqForm.get('weight').value) +
                      Number(this.nonTanshiqform.get('weight').value)
                    ).toFixed(4)
                  ),

                  nonTanishqGoldGrams: Number(
                    this.nonTanshiqform.get('weight').value
                  )
                }
              }
            })
          : null,
      tanshiq:
        this.tanshiqForm.get('amount').value > 0
          ? new DigiGoldTanshiqPayment(this.data.paymentGroup, {
              amount: this.tanshiqForm.get('amount').value,
              reference1: this.OTPFiledFormControl.value,
              instrumentDate: this.data.businessDate,

              otherDetails: {
                type: PaymentModeEnum.DIGI_GOLD_TANISHQ,
                data: {
                  mobileNo: this.mobileNumber.value,
                  sellingPrice: this.sellingPrice,
                  totalGrams: Number(
                    (
                      Number(this.tanshiqForm.get('weight').value) +
                      Number(this.nonTanshiqform.get('weight').value)
                    ).toFixed(4)
                  ),

                  tanishqGoldrams: Number(this.tanshiqForm.get('weight').value)
                }
              }
            })
          : null
    };

    this.addDigi.emit(paymentPayload);
  }
  onGetBalance() {
    this.tanshiqForm.reset();
    this.nonTanshiqform.reset();
    this.OTPFiledFormControl.reset();
    this.OTPFiledFormControl.disable();

    this.getDigiBalance.emit({
      mobileNo: this.mobileNumber.value
    });
  }
  close() {
    this.dialogRef.close(null);
  }

  generateOTP() {
    this.sendOtp.emit({
      mobileNo: this.mobileNumber.value,
      referenceId: this.cardDetails.referenceId,
      nonTanishqGoldGrams: this.nonTanshiqform.valid
        ? this.nonTanshiqform.get('weight').value
        : null,
      tanishqGoldGrams: this.tanshiqForm.valid
        ? this.tanshiqForm.get('weight').value
        : null
    });
    // this.tanshiqForm.disable();
    // this.nonTanshiqform.disable();
  }

  ngOnDestroy() {
    this.resetDigi.emit();
    this.destroy$.next();
    this.destroy$.complete();
  }

  delete() {
    this.tanshiqForm.reset();
    this.nonTanshiqform.reset();
    this.OTPFiledFormControl.reset();
    this.tanshiqForm.disable();
    this.nonTanshiqform.disable();
    this.OTPFiledFormControl.disable();
    this.resetDigi.emit();
  }
  // checkotpButton() {
  //   // console.log(this.nonTanshiqform.invalid, this.nonTanshiqform.invalid);
  //   if (
  //     (this.tanshiqForm.enabled &&
  //       this.tanshiqForm.get('weight').value &&
  //       this.tanshiqForm.get('amount').value &&
  //       this.tanshiqForm.valid) ||
  //     (this.nonTanshiqform.enabled &&
  //       this.nonTanshiqform.get('weight').value &&
  //       this.nonTanshiqform.get('amount').value &&
  //       this.nonTanshiqform.valid)
  //   ) {
  //     return false;
  //   } else {
  //     return true;
  //   }
  // }
}
