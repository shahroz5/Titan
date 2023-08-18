import {
  Component,
  Inject,
  OnDestroy,
  ChangeDetectionStrategy
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-product-out-of-stock-popup',
  templateUrl: './product-out-of-stock-popup.component.html',
  styleUrls: ['./product-out-of-stock-popup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductOutOfStockPopupComponent implements  OnDestroy {
  displayedColumns: string[] = ['itemCode', 'lotNumber', 'binCode'];
  dataSource = [];
  destroy$: Subject<null> = new Subject<null>();
  notAvailableText: string;
  infoMsg: string;

  constructor(
    public dialogRef: MatDialogRef<ProductOutOfStockPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private translate: TranslateService
  ) {
    this.dataSource = data.data;
    this.infoMsg = data.infoMsg;
    this.translate
      .get(['pw.productGrid.notAvailableText'])
      .pipe(takeUntil(this.destroy$))
      .subscribe(translatedMsg => {
        this.notAvailableText =
          translatedMsg['pw.productGrid.notAvailableText'];
      });
  }



  closeDialog(res: boolean) {
    this.dialogRef.close({ data: this.dataSource, res: res });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
