import {
  Component,
  Inject
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'poss-web-customer-not-selected-popup',
  templateUrl: './customer-not-selected-popup.component.html'
})
export class CustomerNotSelectedPopupComponent  {
  isExpired = false;
  constructor(
    public dialogRef: MatDialogRef<CustomerNotSelectedPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any
  ) {
    if (dialogData === 'expired') this.isExpired = true;
  }



  dialogResponse(response: boolean) {
    this.dialogRef.close(response);
  }
}
