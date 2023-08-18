import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Inject,
  OnDestroy
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import {
  EncirclePointsPayment,
  PaymentGroupEnum
} from '@poss-web/shared/models';
import {
  FieldValidatorsService
} from '@poss-web/shared/util-field-validators';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-payment-encircle-points-popup',
  templateUrl: './payment-encircle-points-popup.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentEncirclePointsPopupComponent implements OnInit, OnDestroy {
  hasError = false;
  amountFormControl: FormControl;

  destroy$ = new Subject();
  amountLabel: string;

  constructor(
    public dialogRef: MatDialogRef<PaymentEncirclePointsPopupComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      encirclePoints: number;
      ulpID: string;
      paymentGroup: PaymentGroupEnum;
      currencyCode: string;
      totalAmountDue: number;
      businessDate: string;
    },
    private fieldValidatorsService: FieldValidatorsService,
    private translate: TranslateService
  ) {
    this.translate
      .get('pw.paymentEncircle.amountLabel')
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessage: any) => {
        this.amountLabel = translatedMessage;
      });
  }

  ngOnInit() {
    this.amountFormControl = new FormControl(null, [
      this.fieldValidatorsService.requiredField(this.amountLabel),
      this.fieldValidatorsService.minAmount(
        1,
        this.amountLabel,
        this.data.currencyCode
      ),
      this.fieldValidatorsService.maxAmount(
        Math.floor(
          this.data.totalAmountDue < this.data.encirclePoints
            ? this.data.totalAmountDue
            : this.data.encirclePoints
        ),
        this.amountLabel,
        this.data.currencyCode
      )
    ]);
  }
  close() {
    this.dialogRef.close(null);
  }

  addPayment() {
    if (this.amountFormControl.valid && this.amountFormControl.value) {
      this.dialogRef.close(
        new EncirclePointsPayment(this.data.paymentGroup, {
          amount: this.amountFormControl.value,
          instrumentDate: this.data.businessDate,
          instrumentNo: this.data.ulpID
        })
      );
    } else {
      this.amountFormControl.markAllAsTouched();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
