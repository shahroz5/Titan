import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';

@Component({
  selector: 'poss-web-discount-system-dv-popup',
  templateUrl: './discount-system-dv-popup.component.html'
})
export class DiscountSystemDvPopupComponent implements OnInit {
  formData: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<DiscountSystemDvPopupComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: any,
    private translationService: TranslateService,
    private fieldValidatorsService: FieldValidatorsService
  ) {}

  ngOnInit(): void {
    this.formData = new FormGroup({
      accountNo: new FormControl('', [
        this.fieldValidatorsService.requiredField('Account Number'),
        this.fieldValidatorsService.numbersField('Account Number')
      ]),
      vendorCode: new FormControl('GHS'),
      voucherCode: new FormControl('', [
        this.fieldValidatorsService.requiredField('Voucher Number'),
        this.fieldValidatorsService.numbersField('Voucher Number')
      ])
    });
  }
  apply() {
    this.dialogRef.close(this.formData.value);
  }
  close() {
    this.dialogRef.close(null);
  }
}
