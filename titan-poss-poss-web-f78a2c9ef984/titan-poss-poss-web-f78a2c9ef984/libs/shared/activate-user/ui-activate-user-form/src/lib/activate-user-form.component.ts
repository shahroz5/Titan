import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl
} from '@angular/forms';

import { OTPTypes, OtpDetails } from '@poss-web/shared/models';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'poss-web-activate-user-form',
  templateUrl: './activate-user-form.component.html',
  styleUrls: ['./activate-user-form.component.scss']
})
export class ActivateUserFormComponent implements OnInit {
  @Output() validateOtp = new EventEmitter<OtpDetails>();

  @Input() otpVerified: boolean;

  form: FormGroup;
  logintype = 'NEW_USER';
  empCodeLabel: string;
  otpLabel: string;
  newPasswordLabel: string;
  retypePasswordLabel: string;
  MAX_CONSECUTIVE_ALLOWED = 2;
  MAX_FREQ_ALLOWED = 3;
  invalid = false;

  constructor(
    private formbuilder: FormBuilder,
    private translateService: TranslateService,
    private fieldValidatorsService: FieldValidatorsService
  ) {
    this.translateService
      .get([
        'pw.login.loginIDLabel',
        'pw.login.otpLabel',
        'pw.login.newPasswordLabel',
        'pw.login.retypepasswordPlaceholderText'
      ])
      .subscribe((translatedLabels: any) => {
        this.empCodeLabel = translatedLabels['pw.login.loginIDLabel'];
        this.otpLabel = translatedLabels['pw.login.otpLabel'];
        this.newPasswordLabel = translatedLabels['pw.login.newPasswordLabel'];
        this.retypePasswordLabel =
          translatedLabels['pw.login.retypepasswordPlaceholderText'];
      });
  }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.form = this.formbuilder.group({
      empCode: [
        '',
        [
          this.fieldValidatorsService.requiredField(this.empCodeLabel),
          this.fieldValidatorsService.employeeCodeField(this.empCodeLabel),
          this.fieldValidatorsService.maxLength(15, this.empCodeLabel)
        ]
      ],
      otp: [
        '',
        [
          this.fieldValidatorsService.requiredField(this.otpLabel),
          this.fieldValidatorsService.maxLength(6, this.otpLabel),
          this.fieldValidatorsService.minLength(6, this.otpLabel)
        ]
      ],
      newPassword: [''],
      retypepassword: ['']
    });

    this.form.controls['retypepassword'].setValidators([
      (fieldControl: FormControl) =>
        !this.form.get('newPassword').invalid
          ? fieldControl.value === this.form.get('newPassword').value
            ? null
            : { retype: true }
          : { parent: true },
      this.fieldValidatorsService.requiredField(this.retypePasswordLabel)
    ]);

    this.form.controls['newPassword'].setValidators([
      this.fieldValidatorsService.requiredField(this.newPasswordLabel),
      this.fieldValidatorsService.passwordField(this.newPasswordLabel),
      this.fieldValidatorsService.minLength(8, this.newPasswordLabel),
      this.fieldValidatorsService.maxLength(32, this.newPasswordLabel),

      (password: FormControl) => {
        const str = password.value;

        if (str === null || str.length < this.MAX_FREQ_ALLOWED) {
          this.invalid = false;
        }
        const result = {};

        for (const s of str) {
          // console.log(result[s]);
          result[s] = result.hasOwnProperty(s) ? result[s] + 1 : 1;
        }
        // console.log(result);
        const array = Object.keys(result).map(k => result[k]);
        // console.log(array);
        for (const num of array) {
          if (Number(num) > this.MAX_FREQ_ALLOWED) {
            // console.log(Number(num) > this.MAX_FREQ_ALLOWED);

            this.invalid = true;
            break;
          }
        }

        let isDuplicate = false;
        for (
          let i = 0;
          i < str.length - this.MAX_CONSECUTIVE_ALLOWED + 1;
          i++
        ) {
          isDuplicate = this.allCharactersSame(
            str.substring(i, i + this.MAX_CONSECUTIVE_ALLOWED)
          );
          if (isDuplicate) {
            this.invalid = true;
            break;
          }
        }
        return !this.invalid ? null : { duplicate: true };
      }
    ]);
  }

  allCharactersSame(str: String): boolean {
    const n = str.length;
    for (let i = 1; i < n; i++)
      if (str.charAt(i) !== str.charAt(0)) return false;
    return true;
  }

  submitform() {
    const formvalue = this.form.value;
    this.validateOtp.emit({
      otp: formvalue.otp,
      newPassword: formvalue.newPassword,
      empCode: formvalue.empCode,
      otpType:
        this.logintype === 'NEW_USER'
          ? OTPTypes.Invited
          : OTPTypes.Login_Activate
    });
  }
}
