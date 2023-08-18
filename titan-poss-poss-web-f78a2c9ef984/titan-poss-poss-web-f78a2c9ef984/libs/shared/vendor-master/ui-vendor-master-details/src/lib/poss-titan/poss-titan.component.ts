import { Component, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { VENDOR_CODE_ENUMS } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-poss-titan',
  templateUrl: './poss-titan.component.html',
  styleUrls: ['./poss-titan.component.scss']
})
export class PossTitanComponent  {
  dialogData: any;
  VENDOR_CODE_ENUMS = VENDOR_CODE_ENUMS;

  constructor(
    public dialogRef: MatDialogRef<PossTitanComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    fb: FormBuilder
  ) {
    this.dialogData = data;
  }



  onClose() {
    this.dialogRef.close();
  }
}
