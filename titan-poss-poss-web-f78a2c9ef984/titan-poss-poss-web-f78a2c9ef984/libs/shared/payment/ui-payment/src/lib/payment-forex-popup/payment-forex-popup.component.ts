import {
  Component,
  ChangeDetectionStrategy,
  Inject
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'poss-web-payment-forex-popup',
  templateUrl: './payment-forex-popup.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentForexPopupComponent  {
  constructor(
    public dialogRef: MatDialogRef<PaymentForexPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}


  close() {
    this.dialogRef.close(null);
  }
}
