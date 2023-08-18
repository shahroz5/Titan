import { Component, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'poss-web-gold-price-change-confirmation-pop-up',
  templateUrl: './gold-price-change-confirmation-pop-up.component.html',
  styleUrls: ['./gold-price-change-confirmation-pop-up.component.scss']
})
export class GoldPriceChangeConfirmationPopUpComponent implements OnDestroy {

  destroy$: Subject<null> = new Subject<null>();  
  constructor(
    public dialogRef: MatDialogRef<GoldPriceChangeConfirmationPopUpComponent>,
    public translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  onConfirmClicked() {
    this.dialogRef.close('confirm');
  }

  onCancelClicked() {
    this.dialogRef.close('cancel');
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
