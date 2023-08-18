import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl
} from '@angular/forms';

import { MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
@Component({
  selector: 'poss-web-update-password',
  templateUrl: './update-password.component.html'
})
export class UpdatePasswordComponent implements OnInit {
  form: FormGroup;
  newPasswordLabel: any;
  currentPasswordLabel: string;
  confirmPasswordLabel: string;
  MAX_CONSECUTIVE_ALLOWED = 2;
  MAX_FREQ_ALLOWED = 3;
  invalid = false;
  constructor(
    private formbuilder: FormBuilder,
    private changePasswordDialog: MatDialogRef<UpdatePasswordComponent>,
    private translateService: TranslateService,
    private fieldValidatorsService: FieldValidatorsService
  ) {
    this.translateService
      .get([
        'pw.userProfile.newPasswordPlaceholderText',
        'pw.userProfile.currentPasswordPlaceholderText',
        'pw.userProfile.confirmPasswordPlaceholderText'
      ])
      .subscribe((translatedLabels: any) => {
        this.currentPasswordLabel =
          translatedLabels['pw.userProfile.currentPasswordPlaceholderText'];
        this.newPasswordLabel =
          translatedLabels['pw.userProfile.newPasswordPlaceholderText'];
        this.confirmPasswordLabel =
          translatedLabels['pw.userProfile.confirmPasswordPlaceholderText'];
      });
  }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.form = this.formbuilder.group({
      oldPassword: [
        '',
        this.fieldValidatorsService.requiredField(this.currentPasswordLabel)
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
      this.fieldValidatorsService.requiredField(this.confirmPasswordLabel)
    ]);
    this.form.controls['newPassword'].setValidators([
      this.fieldValidatorsService.requiredField(this.newPasswordLabel),
      this.fieldValidatorsService.passwordField(this.newPasswordLabel),
      this.fieldValidatorsService.minLength(8, this.newPasswordLabel),
      this.fieldValidatorsService.maxLength(32, this.newPasswordLabel),

      (password: FormControl) => {
        const str = password.value;

        if (this.form.controls['oldPassword'].value === password.value) {
          return { sameAsOld: true };
        }

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
    this.changePasswordDialog.close({
      oldPassword: formvalue.oldPassword,
      newPassword: formvalue.newPassword
    });
  }
}
