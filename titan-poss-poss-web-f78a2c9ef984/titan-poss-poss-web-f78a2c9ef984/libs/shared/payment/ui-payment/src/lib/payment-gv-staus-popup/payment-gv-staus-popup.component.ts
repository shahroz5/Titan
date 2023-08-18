import { Component, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  PaymentPayload,
} from '@poss-web/shared/models';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-payment-gv-staus-popup',
  templateUrl: './payment-gv-staus-popup.component.html',
  styleUrls: ['./payment-gv-staus-popup.component.css']
})
export class PaymentGvStausPopupComponent implements OnDestroy {
  hasError = false;
  failedPayment: PaymentPayload[];
  GVs: any[];
  destroy$ = new Subject();
  constructor(
    public dialogRef: MatDialogRef<PaymentGvStausPopupComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      failedGV$: Subject<any>;

      currencyCode: string;
    }
  ) {
    this.data.failedGV$.pipe(takeUntil(this.destroy$)).subscribe(gvs => {

      this.failedPayment = gvs ? gvs : [];
    });
  }


  close() {
    this.dialogRef.close(false);
  }

  retry() {
    this.dialogRef.close(this.failedPayment);
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.failedPayment = [];
  }
}
