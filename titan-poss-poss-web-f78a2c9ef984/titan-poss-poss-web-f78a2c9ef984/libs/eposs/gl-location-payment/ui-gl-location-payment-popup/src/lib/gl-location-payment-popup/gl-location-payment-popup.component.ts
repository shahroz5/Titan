import {
  Component,
  OnInit,
  Inject,
  ChangeDetectionStrategy
} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';

@Component({
  selector: 'poss-web-gl-location-payment-popup',
  templateUrl: './gl-location-payment-popup.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GlLocationPaymentPopupComponent implements OnInit {
  editformGroup: FormGroup;
  paymentCodes: any;

  constructor(
    public dialogRef: MatDialogRef<GlLocationPaymentPopupComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: any,
    private fieldValidatorsService: FieldValidatorsService
  ) {
    console.log(data, 'chec data');

    this.editformGroup = new FormGroup({
      paymentCode: new FormControl(
        data.popupData ? data.popupData.paymentCode : ''
      ),
      glCode: new FormControl(
        data.popupData ? data.popupData.glCode : '',
        this.fieldValidatorsService.fitGlCodeField('GL Code')
      )
    });
  }

  ngOnInit() {
    this.paymentCodes = this.data.paymentCodes;
  }
  close() {
    this.dialogRef.close();
  }
  apply() {
    const values = this.editformGroup.getRawValue();
    this.dialogRef.close({
      paymentCode: values.paymentCode,
      glCode: values.glCode
    });
  }
}
