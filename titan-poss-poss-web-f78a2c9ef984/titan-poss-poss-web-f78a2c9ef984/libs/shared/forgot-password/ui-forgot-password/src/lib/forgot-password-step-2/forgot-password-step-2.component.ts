import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import {
  FormControl,
  Validators,
  FormGroup,
  FormBuilder
} from '@angular/forms';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { OTPTypes, OtpDetails } from '@poss-web/shared/models';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'poss-web-forgot-password-step-2',
  templateUrl: './forgot-password-step-2.component.html',
  styleUrls: ['./forgot-password-step-2.component.scss']
})
export class ForgotPasswordStep2Component implements OnInit {
  @Input() userName: string;
  @Input() otpVerified: boolean;

  @Output() validateOtp = new EventEmitter<OtpDetails>();
  @Output() generateOtp = new EventEmitter<string>();

  form: FormGroup;
  passwordLabel: any;
  MAX_CONSECUTIVE_ALLOWED = 2;
  MAX_FREQ_ALLOWED = 3;
  invalid = false;

  constructor(
    private formbuilder: FormBuilder,
    private translationService: TranslateService,
    private fieldValidatorsService: FieldValidatorsService
  ) {
    this.passwordLabel = this.translationService.instant(
      'pw.login.newpasswordPlaceholderText'
    );
  }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.form = this.formbuilder.group({
      otp: [
        '',
        [Validators.required, Validators.minLength(6), Validators.maxLength(6)]
      ],
      newPassword: [''],
      retypepassword: ['']
    });
    this.form.controls['newPassword'].setValidators([
      this.fieldValidatorsService.requiredField(this.passwordLabel),
      this.fieldValidatorsService.passwordField(this.passwordLabel),
      this.fieldValidatorsService.minLength(8, this.passwordLabel),
      this.fieldValidatorsService.maxLength(32, this.passwordLabel),

      (password: FormControl) => {
        const str = password.value;

        if (str === null || str.length < this.MAX_FREQ_ALLOWED) {
          this.invalid = false;
        }
        const result = {};

        for (const s of str) {
          result[s] = result.hasOwnProperty(s) ? result[s] + 1 : 1;
        }
        const array = Object.keys(result).map(k => result[k]);
        this.invalid = array.some(x => x > this.MAX_FREQ_ALLOWED)


        let isDuplicate = false;
        for (
          let i = 0;
          i < str.length - this.MAX_CONSECUTIVE_ALLOWED + 1;
          i++
        ) {
          isDuplicate = this.allCharactersSame(
            str.substring(i, i + this.MAX_CONSECUTIVE_ALLOWED +1)
          );
          if (isDuplicate) {
            this.invalid = true;
            break;
          }
        }
        return !this.invalid ? null : { duplicate: true };
      }
    ]);
    this.form.controls['retypepassword'].setValidators([
      (fieldControl: FormControl) =>
        !this.form.get('newPassword').invalid
          ? fieldControl.value === this.form.get('newPassword').value
            ? null
            : { retype: true }
          : { parent: true },
      Validators.required
    ]);
  }

  allCharactersSame(str: String): boolean {
    const n = str.length;
    let count = 1;
    for (let i = 1; i < n; i++) {
      if (str.charAt(i) === str.charAt(0)) count++;
    }
    return count > this.MAX_CONSECUTIVE_ALLOWED;
  }
  submitform() {
    const formvalue = this.form.value;
    this.validateOtp.emit({
      otp: formvalue.otp,
      newPassword: formvalue.newPassword,
      empCode: this.userName,
      otpType: OTPTypes.Forgot_Password
    });
  }
}
