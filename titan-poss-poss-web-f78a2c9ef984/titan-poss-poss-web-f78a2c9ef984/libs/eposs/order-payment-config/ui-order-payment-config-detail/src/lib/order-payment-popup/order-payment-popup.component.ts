import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { TranslateService } from '@ngx-translate/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { FormGroup, FormControl } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'poss-web-order-payment-popup',
  templateUrl: './order-payment-popup.component.html'
})
export class OrderPaymentPopupComponent implements OnInit, OnDestroy {
  destroy$ = new Subject<null>();

  formData: FormGroup;
  frozenMetalRate: string;
  nonFrozenMetalRate: string;
  bestRate: string;

  constructor(
    public dialogRef: MatDialogRef<OrderPaymentPopupComponent>,
    private fieldValidatorsService: FieldValidatorsService,
    private translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.translate
      .get([
        'pw.abOrderPaymentConfig.frozenMetalRate',
        'pw.abOrderPaymentConfig.nonFrozenMetalRate',
        'pw.abOrderPaymentConfig.bestRate'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.frozenMetalRate = translatedMessages['pw.abOrderPaymentConfig.frozenMetalRate'],
        this.nonFrozenMetalRate = translatedMessages['pw.abOrderPaymentConfig.nonFrozenMetalRate'],
        this.bestRate = translatedMessages['pw.abOrderPaymentConfig.bestRate']
      });
    this.formData = new FormGroup({
      frozenRate: new FormControl(
        this.data?.selectedDetails?.metalRateFrozenPercent
          ? this.data?.selectedDetails?.metalRateFrozenPercent
          : '',
        [
          this.fieldValidatorsService.requiredField(
            this.frozenMetalRate
          ),
          this.fieldValidatorsService.percentageField(
            this.frozenMetalRate
          )
        ]
      ),
      nonFrozenRate: new FormControl(
        this.data?.selectedDetails?.metalRateNonFrozenPercent
          ? this.data?.selectedDetails?.metalRateNonFrozenPercent
          : '',
        [
          this.fieldValidatorsService.requiredField(
            this.nonFrozenMetalRate
          ),
          this.fieldValidatorsService.percentageField(
            this.nonFrozenMetalRate
          )
        ]
      ),
      bestRate: new FormControl(
        this.data?.selectedDetails?.bestRatePercent
          ? this.data?.selectedDetails?.bestRatePercent
          : '',
        [
          this.fieldValidatorsService.requiredField(this.bestRate),
          this.fieldValidatorsService.percentageField(this.bestRate)
        ]
      )
    });
  }

  save() {
    this.dialogRef.close({
      type: 'save',
      data: {
        metalRateFrozenPercent: this.formData.get('frozenRate').value,
        metalRateNonFrozenPercent: this.formData.get('nonFrozenRate').value,
        bestRatePercent: this.formData.get('bestRate').value
      }
    });
  }
  close() {
    this.dialogRef.close();
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
