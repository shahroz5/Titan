import {
  Component,
  ChangeDetectionStrategy,
  Inject,
  OnDestroy,
  OnInit
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  PaymentGroupEnum,
  PaymentModeEnum,
  SelectDropDownOption,
  WalletPayment
} from '@poss-web/shared/models';
import { FormGroup, FormControl } from '@angular/forms';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
@Component({
  selector: 'poss-web-payment-wallet-popup',
  templateUrl: './payment-wallet-popup.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentWalletPopupComponent implements OnInit, OnDestroy {
  subWalletText = '';
  dateText = '';
  amountText = '';
  referenceText1 = '';
  referenceText2 = '';
  referenceText3 = '';
  reference1Label: string;
  reference2Label: string;
  reference3Label: string;

  isReference1Mandatory = false;
  isReference2Mandatory = false;
  isReference3Mandatory = false;

  walletDetailsFormGroup: FormGroup;

  destroy$ = new Subject();

  walletTypesArray: SelectDropDownOption[] = [];

  constructor(
    private fieldValidatorsService: FieldValidatorsService,
    private translate: TranslateService,
    public dialogRef: MatDialogRef<PaymentWalletPopupComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      wallets: string[];
      paymentGroup: PaymentGroupEnum;
      currencyCode: string;
      totalAmountDue: number;
      fieldDetails: any;
      businessDate: string;
    }
  ) {
    this.translate
      .get([
        'pw.paymentModeWallet.subWallet',
        'pw.paymentModeWallet.amount',
        'pw.paymentModeWallet.reference',
        'pw.paymentModeWallet.reference1',
        'pw.paymentModeWallet.reference2',
        'pw.paymentModeWallet.reference3',
        'pw.paymentModeWallet.date'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.subWalletText =
          translatedMessages['pw.paymentModeWallet.subWallet'];
        this.amountText = translatedMessages['pw.paymentModeWallet.amount'];

        this.referenceText1 =
          translatedMessages['pw.paymentModeWallet.reference1'];
        this.referenceText2 =
          translatedMessages['pw.paymentModeWallet.reference2'];
        this.referenceText3 =
          translatedMessages['pw.paymentModeWallet.reference3'];
        this.dateText = translatedMessages['pw.paymentModeWallet.date'];
      });
    this.reference1Label = this.referenceText1;
    this.reference2Label = this.referenceText2;
    this.reference3Label = this.referenceText3;
    this.walletDetailsFormGroup = new FormGroup({
      subWallet: new FormControl(
        '',
        this.fieldValidatorsService.requiredField(this.subWalletText)
      ),
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
      reference1: new FormControl('', [
        this.fieldValidatorsService.transactionIdField('test'),
        this.fieldValidatorsService.requiredField(this.reference1Label)
      ]),
      reference2: new FormControl('', [
        this.fieldValidatorsService.transactionIdField(this.reference2Label)
      ]),
      reference3: new FormControl('', [
        this.fieldValidatorsService.transactionIdField(this.reference3Label)
      ]),
      date: new FormControl(
        this.data.businessDate,
        this.fieldValidatorsService.requiredField(this.dateText)
      )
    });
  }
  ngOnInit() {
    for (const subWallet of this.data.wallets) {
      this.walletTypesArray.push({
        value: subWallet,
        description: subWallet
      });
    }
    this.walletDetailsFormGroup
      .get('subWallet')
      .valueChanges.subscribe(type => {
        this.walletDetailsFormGroup.patchValue(
          {
            date: this.data.businessDate,
            reference1: '',
            reference2: '',
            reference3: '',
            amount: ''
          },
          { emitEvent: false }
        );
        this.data.fieldDetails.forEach(item => {
          if (item.code === type) {
            this.isReference1Mandatory = item.fields[0]?.isMandatory
              ? item.fields[0]?.isMandatory
              : false;
            this.isReference2Mandatory = item.fields[1]?.isMandatory
              ? item.fields[1]?.isMandatory
              : false;
            this.isReference3Mandatory = item.fields[2]?.isMandatory
              ? item.fields[2]?.isMandatory
              : false;

            this.reference1Label = item.fields[0]?.fieldName
              ? item.fields[0].fieldName
              : this.referenceText1;
            this.reference2Label = item.fields[1]?.fieldName
              ? item.fields[1].fieldName
              : this.referenceText2;
            this.reference3Label = item.fields[2]?.fieldName
              ? item.fields[2].fieldName
              : this.referenceText3;
          }
        });
        this.setValidation();
      });
  }
  setValidation() {
    const ref1Ctrl = this.walletDetailsFormGroup.get('reference1');
    const ref2Ctrl = this.walletDetailsFormGroup.get('reference2');
    const ref3Ctrl = this.walletDetailsFormGroup.get('reference3');
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
  addPayment() {
    const payment = new WalletPayment(this.data.paymentGroup, {
      amount: this.walletDetailsFormGroup.get('amount').value,
      instrumentDate: this.walletDetailsFormGroup.get('date').value,
      instrumentNo: this.walletDetailsFormGroup.get('subWallet').value,
      instrumentType: PaymentModeEnum.WALLET,
      reference1: !!this.walletDetailsFormGroup.get('reference1').value
        ? this.walletDetailsFormGroup.get('reference1').value
        : null,
      reference2: !!this.walletDetailsFormGroup.get('reference2').value
        ? this.walletDetailsFormGroup.get('reference2').value
        : null,
      reference3: !!this.walletDetailsFormGroup.get('reference3').value
        ? this.walletDetailsFormGroup.get('reference3').value
        : null
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
