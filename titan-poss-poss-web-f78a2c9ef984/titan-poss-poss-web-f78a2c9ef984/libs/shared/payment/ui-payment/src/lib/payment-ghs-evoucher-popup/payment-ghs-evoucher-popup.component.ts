import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Inject,
  OnDestroy,
  EventEmitter,
  Output,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  GHSeVoucher,
  PaymentGroupEnum,
  PaymentModeEnum,
  PaymentType
} from '@poss-web/shared/models';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-payment-ghs-evoucher-popup',
  templateUrl: './payment-ghs-evoucher-popup.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentGhsEvoucherPopupComponent implements OnInit, OnDestroy {
  @Output() add = new EventEmitter<PaymentType>();
  @Output() getGHSeVoucherBalance = new EventEmitter<string>();
  @Output() resetGHSeVoucher = new EventEmitter();
  @Output() getQCGCBalance = new EventEmitter<string>();
  destroy$ = new Subject();
  voucherDetails: any;
  amountFormControl: FormControl;
  cardNumber = '';
  otp: FormControl;
  clearCardNumberField: boolean;
  remainingAmount: number;
  redeemedAmt: number;
  valid = true;
  constructor(
    public dialogRef: MatDialogRef<PaymentGhsEvoucherPopupComponent>,
    private fieldValidatorsService: FieldValidatorsService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      EGHSVoucherData$: Subject<any>;
      paymentGroup: PaymentGroupEnum;
      currencyCode: string;
      paymentMode: PaymentModeEnum;
      totalAmountDue;
      businessDate: string;
    }
  ) {
    this.data.EGHSVoucherData$.pipe(takeUntil(this.destroy$)).subscribe(x => {
      this.voucherDetails = x;
      if (this.voucherDetails) {
        this.otp.enable();
        this.amountFormControl = new FormControl(
          this.voucherDetails.cardBalance,
          this.createValidators()
        );

        if (!this.voucherDetails.partialRedemption) {
          this.amountFormControl.disable();
        }
        // this.remainingAmount =
        //   this.remainingAmount - this.amountFormControl.value;
        this.redeemedAmt = this.voucherDetails.cardBalance;
        this.amountFormControl.valueChanges.subscribe(value => {
          this.redeemedAmt = value;
          if (this.redeemedAmt <= this.remainingAmount) {
            this.remainingAmount = this.data.totalAmountDue - this.redeemedAmt;
            console.log(
              this.redeemedAmt,
              this.remainingAmount,
              '  this.remainingAmount'
            );
            this.valid = true;
          } else this.valid = false;
        });
      }
    });
    this.otp = new FormControl('', [
      this.fieldValidatorsService.numbersField('OTP'),
      this.fieldValidatorsService.minLength(6, 'OTP'),
      this.fieldValidatorsService.maxLength(6, 'OTP'),
      this.fieldValidatorsService.requiredField('OTP')
    ]);
  }

  ngOnInit() {
    this.otp.disable();
  }

  createValidators() {
    const validators = [
      this.fieldValidatorsService.requiredField('Amount'),
      this.fieldValidatorsService.minAmount(
        1,
        'Amount',
        this.data.currencyCode
      ),
      this.fieldValidatorsService.maxAmount(
        Number(this.voucherDetails.cardBalance),
        'Amount',
        this.data.currencyCode
      )
    ];

    return validators;
  }

  addPayment() {
    if (this.otp.value && this.voucherDetails) {
      this.dialogRef.close(
        new GHSeVoucher(this.data.paymentGroup, {
          amount: this.amountFormControl.value,
          instrumentNo: this.voucherDetails.cardNumber,
          instrumentType: this.data.paymentMode,
          reference1: this.otp.value,
          bankName: this.voucherDetails.paymentCategoryName,
          remarks: this.voucherDetails.cardProgramGroupName,
          instrumentDate: this.data.businessDate
        })
      );

      this.otp.reset();
    } else {
      this.otp.markAllAsTouched();
    }
  }
  onGetBalance() {
    if (this.cardNumber.length > 0) {
      this.getGHSeVoucherBalance.emit(this.cardNumber);
      this.clearCardNumberField = false;
      this.remainingAmount = this.data.totalAmountDue;
    }
  }
  onGenerateOtp() {
    this.otp.enable();
    if (this.cardNumber.length > 0) {
      this.getQCGCBalance.emit(this.cardNumber);
    }
  }
  getCardNumber(value: any): void {
    if (!value.error) {
      this.cardNumber = value.cardNumber;
    }
  }
  addButtonEnabled() {
    if (
      this.otp.invalid ||
      !this.voucherDetails ||
      this.amountFormControl.invalid ||
      !this.valid
    ) {
      return true;
    } else {
      return false;
    }
  }
  getBalanceButtonEnabled() {
    if (!this.otp.value || this.otp.invalid) {
      return true;
    } else {
      return false;
    }
  }
  reset() {
    this.resetGHSeVoucher.emit();
    this.clearCardNumberField = true;
    this.cardNumber = '';
    this.otp.reset();
    this.otp.disable();
    this.remainingAmount = this.data.totalAmountDue;
  }

  close() {
    this.dialogRef.close(null);
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
