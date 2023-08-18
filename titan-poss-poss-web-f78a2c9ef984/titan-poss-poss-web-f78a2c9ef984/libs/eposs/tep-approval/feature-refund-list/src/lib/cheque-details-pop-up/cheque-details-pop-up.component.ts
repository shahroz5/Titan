import {
  Component,
  Inject,
  OnInit
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';

@Component({
  selector: 'poss-web-cheque-details-pop-up',
  templateUrl: './cheque-details-pop-up.component.html'
})
export class ChequeDetailsPopUpComponent implements OnInit {
  chequeDetailsFormGroup: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<ChequeDetailsPopUpComponent>,
    public translate: TranslateService,
    private fieldValidatorsService: FieldValidatorsService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      index: number;
      chequeNumber: any;
      payeeName: string;
      bankName: string;
      micrCode: string;
    }
  ) {
    this.chequeDetailsFormGroup = new FormGroup({
      chequeNumber: new FormControl('', [
        this.fieldValidatorsService.requiredField('Cheque Number')
      ]),
      payeeName: new FormControl('', [
        this.fieldValidatorsService.requiredField('Payee Name')
      ]),
      bankName: new FormControl('', [
        this.fieldValidatorsService.requiredField('Bank Name')
      ]),
      micrCode: new FormControl('', [
        this.fieldValidatorsService.requiredField('MICR Code')
      ])
    });
  }

  ngOnInit(): void {
    this.chequeDetailsFormGroup
      .get('chequeNumber')
      .setValue(this.data.chequeNumber);
    this.chequeDetailsFormGroup.get('chequeNumber').updateValueAndValidity();
    this.chequeDetailsFormGroup.get('payeeName').setValue(this.data.payeeName);
    this.chequeDetailsFormGroup.get('payeeName').updateValueAndValidity();
    this.chequeDetailsFormGroup.get('bankName').setValue(this.data.bankName);
    this.chequeDetailsFormGroup.get('bankName').updateValueAndValidity();
    this.chequeDetailsFormGroup.get('micrCode').setValue(this.data.micrCode);
    this.chequeDetailsFormGroup.get('micrCode').updateValueAndValidity();
  }

  onClear() {
    this.chequeDetailsFormGroup.get('chequeNumber').setValue('');
    this.chequeDetailsFormGroup.get('chequeNumber').updateValueAndValidity();
    this.chequeDetailsFormGroup.get('payeeName').setValue('');
    this.chequeDetailsFormGroup.get('payeeName').updateValueAndValidity();
    this.chequeDetailsFormGroup.get('bankName').setValue('');
    this.chequeDetailsFormGroup.get('bankName').updateValueAndValidity();
    this.chequeDetailsFormGroup.get('micrCode').setValue('');
    this.chequeDetailsFormGroup.get('micrCode').updateValueAndValidity();
  }

  closeDialog() {
    this.dialogRef.close(null);
  }

  onOkClick() {
    const chequeDetailsObject = {
      chequeNumber: this.chequeDetailsFormGroup.get('chequeNumber').value,
      payeeName: this.chequeDetailsFormGroup.get('payeeName').value,
      bankName: this.chequeDetailsFormGroup.get('bankName').value,
      micrCode: this.chequeDetailsFormGroup.get('micrCode').value
    };
    this.dialogRef.close(chequeDetailsObject);
  }
}
