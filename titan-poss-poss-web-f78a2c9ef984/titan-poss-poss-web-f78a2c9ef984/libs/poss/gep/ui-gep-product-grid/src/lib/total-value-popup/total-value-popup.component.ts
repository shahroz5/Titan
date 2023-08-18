import { Component, OnDestroy, Inject, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog
} from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-total-value-popup',
  templateUrl: './total-value-popup.component.html',
  styleUrls: []
})
export class TotalValuePopupComponent implements OnInit, OnDestroy {
  destroy$: Subject<null> = new Subject<null>();

  constructor(
    public dialogRef: MatDialogRef<TotalValuePopupComponent>,
    private translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    if (!this.data || this.data === '{}') {
      console.log(this.data);
      this.data.rateForPurity = 0;
      this.data.deductionPercentage = 0;
      this.data.deductionValue = 0;
      this.data.netValue = 0;
      this.data.finalValue = 0;
    }
    //console.log("Sarikaa",Object?.keys(this.data)?.includes('SGST'));

    this.translate
      .get([
        "pw.gep.totalValueBreakupLbl",
        "pw.gep.rateForPurityLbl",
        "pw.gep.deductionLbl",
        "pw.gep.valueForActualWtLbl",
        "pw.gep.exchangeValueLbl",
        "pw.gep.sgstLbl",
        "pw.gep.cgstLbl",
        "pw.gep.igstLbl",
        "pw.gep.utgstLbl",
        "pw.gep.totalTaxLbl",
        "pw.gep.finalExchangeValueLbl"
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  close(): void {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  checkTaxExist(tax: any){
    if(Object?.keys(this.data)?.includes(tax)){
      //console.log('true')
      return true;
    }
    return false;
  }
}
