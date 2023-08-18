import {
  Component,
  ChangeDetectionStrategy,
  Inject,
  OnDestroy
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PaymentGroupEnum, PaymentModeEnum ,RtgsPayment} from '@poss-web/shared/models';
import { TranslateService } from '@ngx-translate/core';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'poss-web-payment-rtgs-popup',
  templateUrl: './payment-rtgs-popup.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentRTGSPopupComponent implements OnDestroy {
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
  rtgsFormGroup: FormGroup;

  destroy$ = new Subject();

  constructor(
    private fieldValidatorsService: FieldValidatorsService,
    private translate: TranslateService,
    public dialogRef: MatDialogRef<PaymentRTGSPopupComponent>,
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
        'pw.paymentModeRTGS.amount',
        'pw.paymentModeRTGS.reference',
        'pw.paymentModeRTGS.reference1',
        'pw.paymentModeRTGS.reference2',
        'pw.paymentModeRTGS.reference3',
        'pw.paymentModeRTGS.date',
        'pw.paymentModeRTGS.addButtonText'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.amountText = translatedMessages['pw.paymentModeRTGS.amount'];
        this.referenceText = translatedMessages['pw.paymentModeRTGS.reference'];
        this.dateText = translatedMessages['pw.paymentModeRTGS.date'];
        this.addButtonText = translate['pw.paymentModeRTGS.addButtonText'];
        this.referenceText1 =
          translatedMessages['pw.paymentModeRTGS.reference1'];
        this.referenceText2 =
          translatedMessages['pw.paymentModeRTGS.reference2'];
        this.referenceText3 =
          translatedMessages['pw.paymentModeRTGS.reference3'];
      });

    this.rtgsFormGroup = new FormGroup({
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
      if (item.code === PaymentModeEnum.RTGS) {
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
    const payment = new RtgsPayment(this.data.paymentGroup, {
      amount: this.rtgsFormGroup.get('amount').value,
      reference1: !!this.rtgsFormGroup.get('reference1').value
        ? this.rtgsFormGroup.get('reference1').value
        : null,
      reference2: !!this.rtgsFormGroup.get('reference2').value
        ? this.rtgsFormGroup.get('reference2').value
        : null,
      reference3: !!this.rtgsFormGroup.get('reference3').value
        ? this.rtgsFormGroup.get('reference3').value
        : null,
      instrumentDate: this.rtgsFormGroup.get('date').value
    });
    this.dialogRef.close(payment);
  }
  setValidation() {
    const ref1Ctrl = this.rtgsFormGroup.get('reference1');
    const ref2Ctrl = this.rtgsFormGroup.get('reference2');
    const ref3Ctrl = this.rtgsFormGroup.get('reference3');
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
