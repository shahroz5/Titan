import { Component, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'poss-web-validate-mobile-change-otp',
  templateUrl: './validate-mobile-change-otp.component.html'
})
export class ValidateMobileChangeOTPComponent {
  otpLable: string;
  otp: FormControl;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fieldValidatorsService: FieldValidatorsService,
    private translateService: TranslateService,
    public verifyOTPDialog: MatDialogRef<ValidateMobileChangeOTPComponent>
  ) {
    data = data.replace(/.(?=.{4,}$)/g, 'X');

    this.translateService
      .get(['pw.login.verifyotpPlaceholderText'])
      .subscribe((translatedLabels: any) => {
        this.otpLable = translatedLabels['pw.login.verifyotpPlaceholderText'];
      });

    this.otp = new FormControl('', [
      this.fieldValidatorsService.requiredField(this.otpLable),
      this.fieldValidatorsService.minLength(6, this.otpLable),
      this.fieldValidatorsService.maxLength(6, this.otpLable)
    ]);
  }
}
