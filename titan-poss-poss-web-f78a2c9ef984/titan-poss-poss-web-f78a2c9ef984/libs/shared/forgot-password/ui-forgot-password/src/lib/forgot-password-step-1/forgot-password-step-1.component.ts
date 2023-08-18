import { Component, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'poss-web-forgot-password-step-1',
  templateUrl: './forgot-password-step-1.component.html'
})
export class ForgotPasswordStep1Component {
  @Output() generateOtp = new EventEmitter<string>();
  empidLabel: string;
  name=new FormControl('',[]);

  constructor(private fieldValidatorsService: FieldValidatorsService, private translationService: TranslateService) {

    this.empidLabel = this.translationService.instant(
      'pw.login.loginidPlaceholderText'
    );
    this.name = new FormControl('', [
      fieldValidatorsService.requiredField(this.empidLabel),
      fieldValidatorsService.employeeCodeField(this.empidLabel),
      fieldValidatorsService.maxLength(15, this.empidLabel)

    ]);
  }
}
