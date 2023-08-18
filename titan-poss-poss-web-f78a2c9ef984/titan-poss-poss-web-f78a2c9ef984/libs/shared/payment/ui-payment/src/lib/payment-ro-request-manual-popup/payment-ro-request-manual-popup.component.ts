import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { FormGroup, FormControl } from '@angular/forms';
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Inject,
  OnDestroy
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  PaymentGroupEnum,
  ROManualPayment,
  PaymentModeEnum,
  StoreUser,
  SelectDropDownOption
} from '@poss-web/shared/models';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'poss-web-payment-ro-request-manual-popup',
  templateUrl: './payment-ro-request-manual-popup.component.html',
  styleUrls: ['./payment-ro-request-manual-popup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentRoRequestManualPopupComponent implements OnInit, OnDestroy {
  roRequestForm: FormGroup;
  amountLabel: string;
  reasonLabel: string;
  approvedByLabel: string;
  destroy$: Subject<null> = new Subject<null>();
  rsoOptions: SelectDropDownOption[] = [];

  constructor(
    public dialogRef: MatDialogRef<PaymentRoRequestManualPopupComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      rsoList: StoreUser[];
      totalAmountDue: number;
      currencyCode: string;
      paymentGroup: PaymentGroupEnum;
      customerID: string;
      businessDate: string;
    },
    private fieldValidatorsService: FieldValidatorsService,
    private translateService: TranslateService
  ) {
    this.translateService
      .get([
        'pw.roPaymentManual.amountLable',
        'pw.roPaymentManual.reasonLable',
        'pw.roPaymentManual.approvedByLable'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedLabels: any) => {
        this.amountLabel = translatedLabels['pw.roPaymentManual.amountLable'];
        this.reasonLabel = translatedLabels['pw.roPaymentManual.reasonLable'];
        this.approvedByLabel =
          translatedLabels['pw.roPaymentManual.approvedByLable'];
      });

    if (data.rsoList?.length > 0) {
      this.rsoOptions = data.rsoList.map(rso => ({
        value: rso.employeeCode,
        description: rso.employeeCode
      }));
    }
  }

  ngOnInit() {
    this.roRequestForm = new FormGroup({
      amount: new FormControl(null, [
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
      ]),
      reason: new FormControl(null, [
        this.fieldValidatorsService.reasonField(this.reasonLabel),
        this.fieldValidatorsService.requiredField(this.reasonLabel)
      ]),
      approvedBy: new FormControl('', [
        this.fieldValidatorsService.requiredField(this.approvedByLabel)
      ])
    });
  }
  close() {
    this.dialogRef.close(null);
  }

  addPayment() {
    if (this.roRequestForm.valid) {
      console.log(this.data.businessDate);
      this.dialogRef.close(
        new ROManualPayment(this.data.paymentGroup, {
          amount: this.roRequestForm.get('amount').value,
          customerId: this.data.customerID,
          paymentCode: PaymentModeEnum.RO_PAYMENT,
          requestedReason: this.roRequestForm.get('reason').value,
          approvedBy: this.roRequestForm.get('approvedBy').value,
          instrumentDate: this.data.businessDate
        })
      );
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
