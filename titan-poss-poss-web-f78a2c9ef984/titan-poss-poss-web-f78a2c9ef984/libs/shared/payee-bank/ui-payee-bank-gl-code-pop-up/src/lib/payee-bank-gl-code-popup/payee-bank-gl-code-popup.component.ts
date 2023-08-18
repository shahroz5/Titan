import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';

@Component({
  selector: 'poss-web-payee-bank-gl-code-popup',
  templateUrl: './payee-bank-gl-code-popup.component.html',
  styleUrls: ['./payee-bank-gl-code-popup.component.scss']
})
export class PayeeBankGlCodePopupComponent implements OnInit {
  glCodePopupForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<PayeeBankGlCodePopupComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: any,
    private fieldValidatorsService: FieldValidatorsService
  ) {}

  ngOnInit() {
    this.glCodePopupForm = new FormGroup({
      glCode: new FormControl(
        this.data ? this.data.glCode : '',
        this.fieldValidatorsService.fitGlCodeField('GL Code')
      ),
      isDefault: new FormControl(this.data ? this.data.isDefault : false)
    });
  }

  apply() {
    const values = this.glCodePopupForm.getRawValue();
    this.dialogRef.close(values);
  }

  close() {
    this.dialogRef.close(null);
  }
}
