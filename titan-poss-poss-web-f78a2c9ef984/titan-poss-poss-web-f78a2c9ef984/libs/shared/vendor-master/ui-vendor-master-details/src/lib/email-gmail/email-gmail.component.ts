import { Component, Inject } from '@angular/core';
import { VENDOR_CODE_ENUMS } from '@poss-web/shared/models';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'poss-web-email-gmail',
  templateUrl: './email-gmail.component.html'
})
export class EmailGmailComponent  {
  dialogData: any;
  VENDOR_CODE_ENUMS = VENDOR_CODE_ENUMS;
  mailSmptpStartTlsEnable = false;
  constructor(
    public dialogRef: MatDialogRef<EmailGmailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    fb: FormBuilder
  ) {
    this.dialogData = data;

    this.mailSmptpStartTlsEnable = this.dialogData.vendorDetail.properties[
      'mail.smtp.starttls.enable'
    ];
  }



  onClose() {
    this.dialogRef.close();
  }
}
