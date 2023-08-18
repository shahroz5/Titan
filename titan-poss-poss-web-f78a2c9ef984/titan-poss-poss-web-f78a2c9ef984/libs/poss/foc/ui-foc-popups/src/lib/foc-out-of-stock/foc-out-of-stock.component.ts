import {
  ChangeDetectionStrategy,
  Component,
  Inject,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'poss-web-foc-out-of-stock',
  templateUrl: './foc-out-of-stock.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FocOutOfStockComponent {
  constructor(
    public dialogRef: MatDialogRef<FocOutOfStockComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      isManualFoc: boolean;
    }
  ) {}

  close(): void {
    this.dialogRef.close(null);
  }
  keepPending() {
    this.dialogRef.close(true);
  }
}
