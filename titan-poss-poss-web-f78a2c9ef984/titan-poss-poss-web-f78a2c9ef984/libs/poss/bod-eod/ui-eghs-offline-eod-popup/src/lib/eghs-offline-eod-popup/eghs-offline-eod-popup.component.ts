import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnDestroy
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { Subject } from 'rxjs';

@Component({
  selector: 'poss-web-eghs-offline-eod-popup',
  templateUrl: './eghs-offline-eod-popup.component.html',
  styleUrls: ['./eghs-offline-eod-popup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EghsOfflineEodPopupComponent implements OnDestroy {
  private destroy$ = new Subject();
  eghsOfflineEodFormGroup: FormGroup;
  show = false;
  validatePassword = new EventEmitter();

  constructor(
    public dialogRef: MatDialogRef<EghsOfflineEodPopupComponent>,
    public translate: TranslateService,
    private fieldValidatorsService: FieldValidatorsService
  ) {
    this.eghsOfflineEodFormGroup = new FormGroup({
      cashAmount: new FormControl('', [
        this.fieldValidatorsService.requiredField('Cash Amount'),
        this.fieldValidatorsService.amountField('Cash Amount')
      ]),
      cashReversal: new FormControl('', [
        this.fieldValidatorsService.requiredField('Cash Reversal'),
        this.fieldValidatorsService.amountField('Cash Reversal')
      ]),
      ddAmount: new FormControl('', [
        this.fieldValidatorsService.requiredField('DD Amount'),
        this.fieldValidatorsService.amountField('DD Amount')
      ]),
      ddReversal: new FormControl('', [
        this.fieldValidatorsService.requiredField('DD Reversal'),
        this.fieldValidatorsService.amountField('DD Reversal')
      ]),
      chequeAmount: new FormControl('', [
        this.fieldValidatorsService.requiredField('Cheque Amount'),
        this.fieldValidatorsService.amountField('Cheque Amount')
      ]),
      chequeReversal: new FormControl('', [
        this.fieldValidatorsService.requiredField('Cheque Reversal'),
        this.fieldValidatorsService.amountField('Cheque Reversal')
      ]),
      ccRevenue: new FormControl('', [
        this.fieldValidatorsService.requiredField('CC Revenue'),
        this.fieldValidatorsService.amountField('CC Revenue')
      ]),
      ccReversal: new FormControl('', [
        this.fieldValidatorsService.requiredField('CC Reversal'),
        this.fieldValidatorsService.amountField('CC Reversal')
      ]),
      ccCommision: new FormControl('', [
        this.fieldValidatorsService.requiredField('CC Commision'),
        this.fieldValidatorsService.amountField('CC Commision')
      ]),
      cashRefund: new FormControl('', [
        this.fieldValidatorsService.requiredField('Cash Refund'),
        this.fieldValidatorsService.amountField('Cash Refund')
      ]),
      achAmount: new FormControl('', [
        this.fieldValidatorsService.requiredField('ACH Amount'),
        this.fieldValidatorsService.amountField('ACH Amount')
      ]),
      achReversal: new FormControl('', [
        this.fieldValidatorsService.requiredField('ACH Reversal'),
        this.fieldValidatorsService.amountField('ACH Reversal')
      ]),

      empSalaryDeductionAmount: new FormControl('', [
        this.fieldValidatorsService.requiredField(
          'Emp. Salary Deduction Amount'
        ),
        this.fieldValidatorsService.amountField('Emp. Salary Deduction Amount')
      ]),
      reversalEmpSalaryDedutionAmount: new FormControl('', [
        this.fieldValidatorsService.requiredField(
          'Reversal Emp. Salary Dedution Amount'
        ),
        this.fieldValidatorsService.amountField(
          'Reversal Emp. Salary Dedution Amount'
        )
      ]),
      netAmount: new FormControl('', [
        this.fieldValidatorsService.requiredField('Net Amount'),
        this.fieldValidatorsService.amountField('Net Amount')
      ]),
      roRefund: new FormControl('', [
        this.fieldValidatorsService.requiredField('RO Refund'),
        this.fieldValidatorsService.amountField('RO Refund')
      ]),
      airpay: new FormControl('', [
        this.fieldValidatorsService.requiredField('Airpay'),
        this.fieldValidatorsService.amountField('Airpay')
      ]),
      airpayReversal: new FormControl('', [
        this.fieldValidatorsService.requiredField('Airpay Reversal'),
        this.fieldValidatorsService.amountField('Airpay Reversal')
      ]),
      paytm: new FormControl('', [
        this.fieldValidatorsService.requiredField('PayTM'),
        this.fieldValidatorsService.amountField('PayTM')
      ]),
      paytmReversal: new FormControl('', [
        this.fieldValidatorsService.requiredField('PayTM Reversal'),
        this.fieldValidatorsService.amountField('PayTM Reversal')
      ]),
      enterPassword: new FormControl('', [
        this.fieldValidatorsService.requiredField('Enter Password'),
        this.fieldValidatorsService.requiredField('Enter Password')
      ])
    });
  }

  closeDialog() {
    this.dialogRef.close(null);
  }

  validateGhsPassword() {
    console.log('eghsOfflineEodFormGroup', this.eghsOfflineEodFormGroup);
    if (this.eghsOfflineEodFormGroup.valid) {
      this.validatePassword.emit(this.eghsOfflineEodFormGroup.value);
    }
  }

  showPassword() {
    this.show = !this.show;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
