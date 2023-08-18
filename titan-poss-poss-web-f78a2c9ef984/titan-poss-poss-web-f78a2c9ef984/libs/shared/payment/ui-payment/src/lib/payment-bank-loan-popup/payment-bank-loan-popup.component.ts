import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Inject,
  OnDestroy
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { takeUntil } from 'rxjs/operators';
import { FormGroup, FormControl } from '@angular/forms';
import { PaymentGroupEnum, BankLoanPayment } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-payment-bank-loan-popup',
  templateUrl: './payment-bank-loan-popup.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentBankLoanPopupComponent implements OnInit, OnDestroy {
  destroy$: Subject<null> = new Subject<null>();

  bankLoanForm: FormGroup;

  subLoanLabel: string;
  amountLabel: string;
  reference1Label: string;
  reference2Label: string;
  reference3Label: string;
  reference1Text = '';
  reference2Text = '';
  reference3Text = '';
  dropDown: any;
  dateText = '';
  constructor(
    public dialogRef: MatDialogRef<PaymentBankLoanPopupComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      subBankLoans: string[];
      paymentGroup: PaymentGroupEnum;
      currencyCode: string;
      totalAmountDue: number;
      fieldDetails: any;
      businessDate: string;
    },
    private translateService: TranslateService,
    private fieldValidatorsService: FieldValidatorsService
  ) {
    this.translateService
      .get([
        'pw.paymentModeBankLoan.subLoan',
        'pw.paymentModeBankLoan.amount',
        'pw.paymentModeBankLoan.date',
        'pw.paymentModeBankLoan.reference1',
        'pw.paymentModeBankLoan.reference2',
        'pw.paymentModeBankLoan.reference3'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedLabels: any) => {
        this.subLoanLabel = translatedLabels['pw.paymentModeBankLoan.subLoan'];
        this.amountLabel = translatedLabels['pw.paymentModeBankLoan.amount'];
        this.dateText = translatedLabels['pw.paymentModeBankLoan.date'];
        this.reference1Text =
          translatedLabels['pw.paymentModeBankLoan.reference1'];
        this.reference2Text =
          translatedLabels['pw.paymentModeBankLoan.reference2'];
        this.reference3Text =
          translatedLabels['pw.paymentModeBankLoan.reference3'];
      });
    this.reference1Label = this.reference1Text;
    this.reference2Label = this.reference2Text;
    this.reference3Label = this.reference3Text;
    this.bankLoanForm = new FormGroup({
      subLoan: new FormControl(
        '',
        this.fieldValidatorsService.requiredField(this.subLoanLabel)
      ),
      amount: new FormControl('', [
        this.fieldValidatorsService.requiredField(this.amountLabel),
        this.fieldValidatorsService.minAmount(
          1,
          this.amountLabel,
          this.data.currencyCode
        ),
        this.fieldValidatorsService.maxAmount(
          this.data.totalAmountDue,
          this.amountLabel,
          this.data.currencyCode
        )
      ]),
      date: new FormControl(
        this.data.businessDate,
        this.fieldValidatorsService.requiredField(this.dateText)
      ),
      reference1: new FormControl(null, [
        this.fieldValidatorsService.transactionIdField(this.reference1Label),
        this.fieldValidatorsService.requiredField(this.reference1Label)
      ]),
      reference2: new FormControl(null, [
        this.fieldValidatorsService.transactionIdField(this.reference2Label)
      ]),
      reference3: new FormControl(null, [
        this.fieldValidatorsService.transactionIdField(this.reference3Label)
      ])
    });
  }

  ngOnInit() {
    console.log(this.data.subBankLoans, 'check');
    this.dropDown = [];
    this.data.subBankLoans.forEach(subBank => {
      const subLoan = {};
      subLoan['value'] = subBank;
      subLoan['description'] = subBank;
      this.dropDown.push(subLoan);
    });
    this.bankLoanForm
      .get('subLoan')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(type => {
        this.bankLoanForm.patchValue(
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
            this.reference1Label = item.fields[0]?.fieldName
              ? item.fields[0].fieldName
              : this.reference1Text;
            this.reference2Label = item.fields[1]?.fieldName
              ? item.fields[1].fieldName
              : this.reference2Text;
            this.reference3Label = item.fields[2]?.fieldName
              ? item.fields[2].fieldName
              : this.reference3Text;
          }
        });
        this.setValidation();
      });
  }
  setValidation() {
    const ref1Ctrl = this.bankLoanForm.get('reference1');
    const ref2Ctrl = this.bankLoanForm.get('reference2');
    const ref3Ctrl = this.bankLoanForm.get('reference3');
    ref1Ctrl.setValidators([
      this.fieldValidatorsService.transactionIdField(this.reference1Label),
      this.fieldValidatorsService.requiredField(this.reference1Label)
    ]);
    ref2Ctrl.setValidators([
      this.fieldValidatorsService.transactionIdField(this.reference2Label)
    ]);
    ref3Ctrl.setValidators([
      this.fieldValidatorsService.transactionIdField(this.reference3Label)
    ]);
    ref1Ctrl.updateValueAndValidity();
    ref2Ctrl.updateValueAndValidity();
    ref3Ctrl.updateValueAndValidity();
  }
  addPayment() {
    const payment = new BankLoanPayment(this.data.paymentGroup, {
      instrumentNo: this.bankLoanForm.get('subLoan').value,
      instrumentType: this.bankLoanForm.get('subLoan').value,
      instrumentDate: this.bankLoanForm.get('date').value,
      amount: this.bankLoanForm.get('amount').value,

      reference1: this.bankLoanForm.get('reference1').value
        ? this.bankLoanForm.get('reference1').value
        : null,
      reference2: this.bankLoanForm.get('reference2').value
        ? this.bankLoanForm.get('reference2').value
        : null,
      reference3: this.bankLoanForm.get('reference3').value
        ? this.bankLoanForm.get('reference3').value
        : null
    });
    this.dialogRef.close(payment);
  }
  close() {
    this.dialogRef.close(null);
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
