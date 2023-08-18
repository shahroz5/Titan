import { Component, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { VENDOR_CODE_ENUMS } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-aws-s3',
  templateUrl: './aws-s3.component.html',
  styleUrls: ['./aws-s3.component.scss']
})
export class AwsS3Component  {
  dialogData: any;
  VENDOR_CODE_ENUMS = VENDOR_CODE_ENUMS;

  constructor(
    public dialogRef: MatDialogRef<AwsS3Component>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    fb: FormBuilder
  ) {
    this.dialogData = data;
  }



  onClose() {
    this.dialogRef.close();
  }
}
