import { ChangeDetectionStrategy, Component, Inject, OnDestroy } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { PaymentGroupEnum, PaymentModeEnum, UPIPayment } from '@poss-web/shared/models';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-payment-upi-popup',
  templateUrl: './payment-upi-popup.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentUPIPopupComponent implements OnDestroy {
  dateText = '';
  amountText = '';
  referenceText = '';
  referenceText1 = '';
  referenceText2 = '';
  referenceText3 = '';

  isReference1Mandatory = false;
  isReference2Mandatory = false;
  isReference3Mandatory = false;

  addButtonText = '';
  upiFormGroup: FormGroup;

  destroy$ = new Subject();

  constructor(
    private fieldValidatorsService: FieldValidatorsService,
    private translate: TranslateService,
    public dialogRef: MatDialogRef<PaymentUPIPopupComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      paymentGroup: PaymentGroupEnum;
      currencyCode: string;
      totalAmountDue: number;
      fieldDetails: any;
      businessDate: string;
    }
  ) {
    this.translate
      .get([
        'pw.paymentModeUPI.amount',
        'pw.paymentModeUPI.reference',
        'pw.paymentModeUPI.reference1',
        'pw.paymentModeUPI.reference2',
        'pw.paymentModeUPI.reference3',
        'pw.paymentModeUPI.date',
        'pw.paymentModeUPI.addButtonText'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.amountText = translatedMessages['pw.paymentModeUPI.amount'];
        this.referenceText = translatedMessages['pw.paymentModeUPI.reference'];
        this.dateText = translatedMessages['pw.paymentModeUPI.date'];
        this.addButtonText = translate['pw.paymentModeUPI.addButtonText'];
        this.referenceText1 =
          translatedMessages['pw.paymentModeUPI.reference1'];
        this.referenceText2 =
          translatedMessages['pw.paymentModeUPI.reference2'];
        this.referenceText3 =
          translatedMessages['pw.paymentModeUPI.reference3'];
      });

    this.upiFormGroup = new FormGroup({
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
      reference1: new FormControl(null, [
        this.fieldValidatorsService.transactionIdField(this.referenceText1),
        this.fieldValidatorsService.requiredField(this.referenceText1)
      ]),
      reference2: new FormControl(null, [
        this.fieldValidatorsService.transactionIdField(this.referenceText2)
      ]),
      reference3: new FormControl(null, [
        this.fieldValidatorsService.transactionIdField(this.referenceText3)
      ]),
      date: new FormControl(
        this.data.businessDate,
        this.fieldValidatorsService.requiredField(this.dateText)
      )
    });
  }
  ngOnInit() {
    this.data.fieldDetails.forEach(item => {
      if (item.code === PaymentModeEnum.UPI) {
        this.isReference1Mandatory = item.fields[0]?.isMandatory
          ? item.fields[0]?.isMandatory
          : false;
        this.isReference2Mandatory = item.fields[1]?.isMandatory
          ? item.fields[1]?.isMandatory
          : false;
        this.isReference3Mandatory = item.fields[2]?.isMandatory
          ? item.fields[2]?.isMandatory
          : false;

        this.referenceText1 = item.fields[0]?.fieldName
          ? item.fields[0].fieldName
          : this.referenceText1;
        this.referenceText2 = item.fields[1]?.fieldName
          ? item.fields[1].fieldName
          : this.referenceText2;
        this.referenceText3 = item.fields[2]?.fieldName
          ? item.fields[2].fieldName
          : this.referenceText3;
        this.setValidation();
      }
    });
  }
  addPayment() {
    const payment = new UPIPayment(this.data.paymentGroup, {
      amount: this.upiFormGroup.get('amount').value,
      reference1: !!this.upiFormGroup.get('reference1').value
        ? this.upiFormGroup.get('reference1').value
        : null,
      reference2: !!this.upiFormGroup.get('reference2').value
        ? this.upiFormGroup.get('reference2').value
        : null,
      reference3: !!this.upiFormGroup.get('reference3').value
        ? this.upiFormGroup.get('reference3').value
        : null,
      instrumentDate: this.upiFormGroup.get('date').value
    });
    this.dialogRef.close(payment);
  }
  setValidation() {
    const ref1Ctrl = this.upiFormGroup.get('reference1');
    const ref2Ctrl = this.upiFormGroup.get('reference2');
    const ref3Ctrl = this.upiFormGroup.get('reference3');
    if (this.isReference1Mandatory) {
      ref1Ctrl.setValidators([
        this.fieldValidatorsService.transactionIdField(this.referenceText1),
        this.fieldValidatorsService.requiredField(this.referenceText1)
      ]);
    } else {
      ref1Ctrl.setValidators([
        this.fieldValidatorsService.requiredField(this.referenceText1)
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
  close() {
    this.dialogRef.close(null);
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
