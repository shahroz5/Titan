import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import {
  AirpayManualPayment,
  PaymentGroupEnum,
  PaymentModeEnum,
  RazorPayManualPayment
} from '@poss-web/shared/models';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-payment-non-integrated-razorpay',
  templateUrl: './payment-non-integrated-razorpay.component.html'
})
export class PaymentNonIntegratedRazorpayComponent
  implements OnInit, OnDestroy {
  dateText = '';
  amountText = '';
  referenceText1 = '';
  referenceText2 = '';
  referenceText3 = '';

  isReference1Mandatory = false;
  isReference2Mandatory = false;
  isReference3Mandatory = false;

  razorpayDetailsFormGroup: FormGroup;

  destroy$ = new Subject();

  constructor(
    private fieldValidatorsService: FieldValidatorsService,
    private translate: TranslateService,
    public dialogRef: MatDialogRef<PaymentNonIntegratedRazorpayComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      paymentGroup: PaymentGroupEnum;
      currencyCode: string;
      totalAmountDue: number;
      fieldDetails: any;
      customerID: string;
      businessDate: string;
    }
  ) {
    this.translate
      .get([
        'pw.paymentModeAirpay.amount',
        'pw.paymentModeAirpay.date',
        'pw.paymentModeAirpay.reference1',
        'pw.paymentModeAirpay.reference2',
        'pw.paymentModeAirpay.reference3'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.amountText = translatedMessages['pw.paymentModeAirpay.amount'];
        this.dateText = translatedMessages['pw.paymentModeAirpay.date'];
        this.referenceText1 =
          translatedMessages['pw.paymentModeAirpay.reference1'];
        this.referenceText2 =
          translatedMessages['pw.paymentModeAirpay.reference2'];
        this.referenceText3 =
          translatedMessages['pw.paymentModeAirpay.reference3'];
      });

    this.razorpayDetailsFormGroup = new FormGroup({
      amount: new FormControl('', [
        this.fieldValidatorsService.requiredField(this.amountText),
        this.fieldValidatorsService.minAmount(
          1,
          this.amountText,
          this.data.currencyCode
        ),
        this.fieldValidatorsService.maxAmount(
          this.data.totalAmountDue,
          this.amountText,
          this.data.currencyCode
        )
      ]),

      date: new FormControl(
        this.data.businessDate,
        this.fieldValidatorsService.requiredField(this.dateText)
      ),
      reference1: new FormControl(null, [
        this.fieldValidatorsService.transactionIdField(this.referenceText1),
        this.fieldValidatorsService.requiredField(this.referenceText1)
      ]),
      reference2: new FormControl(
        null,
        this.fieldValidatorsService.transactionIdField(this.referenceText2)
      ),
      reference3: new FormControl(
        null,
        this.fieldValidatorsService.transactionIdField(this.referenceText3)
      )
    });
  }
  ngOnInit() {
    this.data.fieldDetails.forEach(item => {
      if (item.code === PaymentModeEnum.RAZOR_PAY) {
        this.isReference1Mandatory = item.fields[0]?.isMandatory
          ? item.fields[0]?.isMandatory
          : false;
        this.isReference2Mandatory = item.fields[1]?.isMandatory
          ? item.fields[1]?.isMandatory
          : false;
        this.isReference3Mandatory = item.fields[2]?.isMandatory
          ? item.fields[2]?.isMandatory
          : false;

        // this.referenceText1 = item.fields[0]?.fieldName
        //   ? item.fields[0].fieldName
        //   : this.referenceText1;
        // this.referenceText2 = item.fields[1]?.fieldName
        //   ? item.fields[1].fieldName
        //   : this.referenceText2;
        // this.referenceText3 = item.fields[2]?.fieldName
        //   ? item.fields[2].fieldName
        //   : this.referenceText3;
        this.setValidation();
      }
    });
  }
  setValidation() {
    const ref1Ctrl = this.razorpayDetailsFormGroup.get('reference1');
    const ref2Ctrl = this.razorpayDetailsFormGroup.get('reference2');
    const ref3Ctrl = this.razorpayDetailsFormGroup.get('reference3');
    if (this.isReference1Mandatory) {
      ref1Ctrl.setValidators([
        this.fieldValidatorsService.transactionIdField(this.referenceText1),
        this.fieldValidatorsService.requiredField(this.referenceText1)
      ]);
    } else {
      ref1Ctrl.setValidators([
        this.fieldValidatorsService.transactionIdField(this.referenceText1)
      ]);
    }
    if (this.isReference2Mandatory) {
      ref2Ctrl.setValidators([
        this.fieldValidatorsService.requiredField(this.referenceText2),
        this.fieldValidatorsService.transactionIdField(this.referenceText2)
      ]);
    } else {
      ref2Ctrl.setValidators([
        this.fieldValidatorsService.transactionIdField(this.referenceText2)
      ]);
    }
    if (this.isReference3Mandatory) {
      ref3Ctrl.setValidators([
        this.fieldValidatorsService.requiredField(this.referenceText3),
        this.fieldValidatorsService.transactionIdField(this.referenceText3)
      ]);
    } else {
      ref3Ctrl.setValidators([
        this.fieldValidatorsService.transactionIdField(this.referenceText3)
      ]);
    }
    ref1Ctrl.updateValueAndValidity();
    ref2Ctrl.updateValueAndValidity();
    ref3Ctrl.updateValueAndValidity();
  }
  addPayment() {
    const payment = new RazorPayManualPayment(this.data.paymentGroup, {
      amount: this.razorpayDetailsFormGroup.get('amount').value,
      customerId: this.data.customerID,
      paymentCode: PaymentModeEnum.RAZOR_PAY,
      reference1: !!this.razorpayDetailsFormGroup.get('reference1').value
        ? this.razorpayDetailsFormGroup.get('reference1').value
        : null,

      reference2: !!this.razorpayDetailsFormGroup.get('reference2').value
        ? this.razorpayDetailsFormGroup.get('reference2').value
        : null,
      reference3: !!this.razorpayDetailsFormGroup.get('reference3').value
        ? this.razorpayDetailsFormGroup.get('reference3').value
        : null,
      instrumentDate: this.razorpayDetailsFormGroup.get('date').value
    });
    this.dialogRef.close(payment);
  }
  close() {
    this.dialogRef.close(null);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
