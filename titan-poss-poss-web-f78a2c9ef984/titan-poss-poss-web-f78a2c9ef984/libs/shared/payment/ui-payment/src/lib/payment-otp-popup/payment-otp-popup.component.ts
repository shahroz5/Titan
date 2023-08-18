import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-payment-otp-popup',
  templateUrl: './payment-otp-popup.component.html',
  styleUrls: ['./payment-otp-popup.component.css']
})
export class PaymentOtpPopupComponent implements OnInit,OnDestroy {
  hasError = false;
  otpFormControl: FormControl;

  destroy$ = new Subject();
  otpLabel: string;
  constructor(
    public dialogRef: MatDialogRef<PaymentOtpPopupComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {},
    private fieldValidatorsService: FieldValidatorsService,
    private translate: TranslateService
  ) {
    this.translate
      .get('pw.paymentEncircle.otpLabel')
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessage: any) => {
        this.otpLabel = translatedMessage;
      });
  }

  ngOnInit() {
    this.otpFormControl = new FormControl(null, [
      this.fieldValidatorsService.requiredField(this.otpLabel),
      this.fieldValidatorsService.numbersField(this.otpLabel),
      this.fieldValidatorsService.maxLength(6, this.otpLabel)
    ]);
  }

  close() {
    this.dialogRef.close(null);
  }

  addOTP() {
    if (this.otpFormControl.valid && this.otpFormControl.value) {
      this.dialogRef.close(this.otpFormControl.value);
    } else {
      this.otpFormControl.markAllAsTouched();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
