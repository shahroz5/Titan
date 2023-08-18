import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';

@Component({
  selector: 'poss-web-ulp-id-popup',
  templateUrl: './ulp-id-popup.component.html',
  styleUrls: ['./ulp-id-popup.component.css']
})
export class UlpIdPopupComponent implements OnInit {
  ulpIdForm: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<UlpIdPopupComponent>,
    private fieldValidatorsService: FieldValidatorsService
  ) {}

  ngOnInit(): void {
    this.ulpIdForm = new FormGroup({
      ulpId: new FormControl(null, [
        this.fieldValidatorsService.requiredField('ULP Id'),
        this.fieldValidatorsService.ulpIdField('ULP Id')
      ])
    });
  }

  submit() {
    if (this.ulpIdForm.valid) {
      this.dialogRef.close(this.ulpIdForm.get('ulpId').value);
    }
  }

  onClose() {
    this.dialogRef.close();
  }
}
