import {
  Component,
  OnInit,
  OnDestroy,
  Inject,
  ChangeDetectionStrategy
} from '@angular/core';
import { Subject } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ErrorEnums } from '@poss-web/shared/util-error';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-out-of-stock-popup',
  templateUrl: './out-of-stock-popup.component.html',
  styleUrls: ['./out-of-stock-popup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OutOfStockPopupComponent implements OnInit, OnDestroy {
  destroy$: Subject<null> = new Subject<null>();
  notificationMsg = '';
  label1 = '';
  label2 = '';
  label3 = '';
  label4 = '';
  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA)
    public data: any,
    public dialog: MatDialog,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    if (this.data.code === ErrorEnums.ERR_INV_017) {
      this.notificationMsg =
        ' Following Items have measured quantity more than available quantity';
      this.label1 = 'Variant Code';
      this.label2 = 'Lot No';
      this.label3 = 'Available Qty';
      this.label4 = 'Measured Qty';
    } else if (this.data.code === 'ERR-INV-037') {
      this.notificationMsg = 'Invalid BinGroups for Issue';
      this.label1 = 'Variant Code';
      this.label2 = 'Lot No';
      this.label3 = 'Current Bin Group';
      this.label4 = 'Previous Bin Group';
    }
  }
  translateMsg(msg: string) {
    this.translate
      .get(msg)
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMsg: string) => {
        this.notificationMsg = translatedMsg;
      });
  }

  onClose(): void {
    this.dialogRef.close();
  }

  removeProducts() {
    this.dialogRef.close(true);
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
