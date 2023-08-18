import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Inject,
  OnDestroy
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  FormGroup,
  FormControl,
  AbstractControl,
  ValidatorFn
} from '@angular/forms';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import {
  PaymentModeEnum,
  DDPayment,
  ChequePayment,
  PaymentGroupEnum
} from '@poss-web/shared/models';
import { Observable, Subject } from 'rxjs';
import { startWith, map, takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';

@Component({
  selector: 'poss-web-payment-cheque-dd-popup',
  templateUrl: './payment-cheque-dd-popup.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentChequeDDPopupComponent implements OnInit, OnDestroy {
  filteredOptions: Observable<any[]>;
  selectedDateCtrl;
  minDate;
  maxDate;

  typeLabel: string;
  paymentDetailForm: FormGroup;

  bankNameLabel: string;
  chequeNumberLabel: string;
  ddNumberLabel: string;
  chequeDateLabel: string;
  ddDateLabel: string;
  amountLabel: string;
  destroy$: Subject<null> = new Subject<null>();
  fieldTypeLabel: string;
  constructor(
    public dialogRef: MatDialogRef<PaymentChequeDDPopupComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      paymentMode: PaymentModeEnum;
      payerBanks: string[];
      validityDays: number;
      paymentGroup: PaymentGroupEnum;
      currencyCode: string;
      totalAmountDue: number;
      businessDate: string;
    },
    private translateService: TranslateService,
    private fieldValidatorsService: FieldValidatorsService
  ) {
    this.translateService
      .get([
        'pw.paymentModeChequeDD.bankName',
        'pw.paymentModeChequeDD.chequeNumber',
        'pw.paymentModeChequeDD.ddNumber',
        'pw.paymentModeChequeDD.chequedate',
        'pw.paymentModeChequeDD.ddDate',
        'pw.paymentModeChequeDD.amount'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedLabels: any) => {
        this.bankNameLabel =
          translatedLabels['pw.paymentModeChequeDD.bankName'];
        this.chequeNumberLabel =
          translatedLabels['pw.paymentModeChequeDD.chequeNumber'];
        this.ddNumberLabel =
          translatedLabels['pw.paymentModeChequeDD.ddNumber'];
        this.chequeDateLabel =
          translatedLabels['pw.paymentModeChequeDD.chequedate'];
        this.ddDateLabel = translatedLabels['pw.paymentModeChequeDD.ddDate'];
        this.amountLabel = translatedLabels['pw.paymentModeChequeDD.amount'];
      });

    this.paymentDetailForm = new FormGroup({
      bankName: new FormControl('', [
        this.fieldValidatorsService.bankNameField(this.bankNameLabel),
        this.fieldValidatorsService.requiredField(this.bankNameLabel),
        this.autocompleteStringValidator(this.data.payerBanks)
      ]),
      number: new FormControl('', [
        this.data.paymentMode === PaymentModeEnum.CHEQUE
          ? this.fieldValidatorsService.chequeDDNoField(this.chequeNumberLabel)
          : this.fieldValidatorsService.chequeDDNoField(this.ddNumberLabel),
        this.data.paymentMode === PaymentModeEnum.CHEQUE
          ? this.fieldValidatorsService.min(1, this.chequeNumberLabel)
          : this.fieldValidatorsService.min(1, this.ddNumberLabel),
        this.data.paymentMode === PaymentModeEnum.CHEQUE
          ? this.fieldValidatorsService.requiredField(this.chequeNumberLabel)
          : this.fieldValidatorsService.requiredField(this.ddNumberLabel)
      ]),
      date: new FormControl(this.data.businessDate, [
        this.data.paymentMode === PaymentModeEnum.CHEQUE
          ? this.fieldValidatorsService.requiredField(this.chequeDateLabel)
          : this.fieldValidatorsService.requiredField(this.ddDateLabel)
      ]),
      amount: new FormControl('', [
        this.fieldValidatorsService.minAmount(
          1,
          this.amountLabel,
          this.data.currencyCode
        ),
        this.fieldValidatorsService.requiredField(this.amountLabel),
        this.fieldValidatorsService.maxAmount(
          this.data.totalAmountDue,
          this.amountLabel,
          this.data.currencyCode
        )
      ])
    });
  }

  ngOnInit() {
    this.typeLabel =
      this.data.paymentMode === PaymentModeEnum.DD ? 'Demand Draft' : 'Cheque';
    this.fieldTypeLabel =
      this.data.paymentMode === PaymentModeEnum.DD ? 'DD' : 'Cheque';
    this.filteredOptions = this.paymentDetailForm
      .get('bankName')
      .valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.data.payerBanks.filter(
      bank => bank.toLowerCase().indexOf(filterValue) === 0
    );
  }

  addPayment() {
    if (this.data.paymentMode === PaymentModeEnum.DD) {
      const payment = new DDPayment(this.data.paymentGroup, {
        bankName: this.paymentDetailForm.get('bankName').value,
        instrumentNo: this.paymentDetailForm.get('number').value,
        instrumentDate: this.paymentDetailForm.get('date').value,
        amount: this.paymentDetailForm.get('amount').value
      });
      this.dialogRef.close(payment);
    } else {
      const payment = new ChequePayment(this.data.paymentGroup, {
        bankName: this.paymentDetailForm.get('bankName').value,
        instrumentNo: this.paymentDetailForm.get('number').value,
        instrumentDate: this.paymentDetailForm.get('date').value,
        amount: this.paymentDetailForm.get('amount').value
      });
      this.dialogRef.close(payment);
    }
  }
  maxValidation() {
    this.maxDate = moment(this.data.businessDate).add(
      this.data.validityDays,
      'days'
    );
    return moment(this.maxDate);
  }
  minValidation() {
    this.minDate = moment(this.data.businessDate).subtract(
      this.data.validityDays,
      'days'
    );
    return moment(this.minDate);
  }
  close() {
    this.dialogRef.close(null);
  }

  autocompleteStringValidator(validOptions: any[]): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (this.data.payerBanks.length !== 0) {
        const validaState = this.data.payerBanks.find(val =>
          val !== null ? val === control.value : null
        );
        if (validaState) {
          return null; /* valid option selected */
        }
        return { invalidAutocompleteString: { value: control.value } };
      }
    };
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
