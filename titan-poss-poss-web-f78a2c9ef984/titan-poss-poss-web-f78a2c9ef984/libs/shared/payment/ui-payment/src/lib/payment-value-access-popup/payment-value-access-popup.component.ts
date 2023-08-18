import {
  Component,

  ChangeDetectionStrategy,
  Inject
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'poss-web-payment-value-access-popup',
  templateUrl: './payment-value-access-popup.component.html',
  styleUrls: ['./payment-value-access-popup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentValueAccessPopupComponent {
  constructor(
    public dialogRef: MatDialogRef<PaymentValueAccessPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}


  close() {
    this.dialogRef.close(null);
  }
}
