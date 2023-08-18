import {
  Component,
  Inject,
  ChangeDetectionStrategy
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UnipayTransationStatusEnum } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-payment-unipay-card-retry-popup',
  templateUrl: './payment-unipay-card-retry-popup.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentUnipayCardRetryPopupComponent  {
  hasError = false;
  constructor(
    public dialogRef: MatDialogRef<PaymentUnipayCardRetryPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}


  close() {
    this.dialogRef.close(UnipayTransationStatusEnum.DELETE);
  }

  retry() {
    this.dialogRef.close(UnipayTransationStatusEnum.RETRY);
  }
}
