import { Component, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-payment-unipay-loader',
  templateUrl: './payment-unipay-loader.component.html',
  styleUrls: ['./payment-unipay-loader.component.scss']
})
export class PaymentUnipayLoaderComponent {
  constructor(
    public dialogRef: MatDialogRef<PaymentUnipayLoaderComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
}
