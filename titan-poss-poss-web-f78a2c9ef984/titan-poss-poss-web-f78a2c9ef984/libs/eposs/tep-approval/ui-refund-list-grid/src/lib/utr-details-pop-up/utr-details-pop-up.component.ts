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
  selector: 'poss-web-utr-details-pop-up',
  templateUrl: './utr-details-pop-up.component.html'
})
export class UtrDetailsPopUpComponent implements OnInit {
  utrDetailsFormGroup: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<UtrDetailsPopUpComponent>,
    public translate: TranslateService,
    private fieldValidatorsService: FieldValidatorsService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      index: number;
      utrNumber: any;
    }
  ) {
    this.utrDetailsFormGroup = new FormGroup({
      utrNumber: new FormControl('', [
        this.fieldValidatorsService.requiredField('UTR Number'),
        this.fieldValidatorsService.utrNumberField('UTR Number')
      ])
    });
  }

  ngOnInit(): void {
    this.utrDetailsFormGroup.get('utrNumber').setValue(this.data.utrNumber);
    this.utrDetailsFormGroup.get('utrNumber').updateValueAndValidity();
  }

  onClear() {
    this.utrDetailsFormGroup.get('utrNumber').setValue('');
    this.utrDetailsFormGroup.get('utrNumber').updateValueAndValidity();
  }

  closeDialog() {
    this.dialogRef.close(null);
  }

  onOkClick() {
    const utrNumberValue = this.utrDetailsFormGroup.get('utrNumber').value;
    this.dialogRef.close(utrNumberValue);
  }
}
