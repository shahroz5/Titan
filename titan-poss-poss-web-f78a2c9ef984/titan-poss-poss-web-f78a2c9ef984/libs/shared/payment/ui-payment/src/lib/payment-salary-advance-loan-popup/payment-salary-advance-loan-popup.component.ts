import {
  Component,
  ChangeDetectionStrategy,
  Inject
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'poss-web-payment-salary-advance-loan-popup',
  templateUrl: './payment-salary-advance-loan-popup.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentSalaryAdvanceLoanPopupComponent  {
  constructor(
    public dialogRef: MatDialogRef<PaymentSalaryAdvanceLoanPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}


  close() {
    this.dialogRef.close(null);
  }
}
