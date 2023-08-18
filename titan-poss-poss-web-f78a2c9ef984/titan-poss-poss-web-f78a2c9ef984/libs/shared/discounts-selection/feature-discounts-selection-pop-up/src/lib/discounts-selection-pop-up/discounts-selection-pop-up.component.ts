import { Component, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { DiscountsList } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-discounts-selection-pop-up',
  templateUrl: './discounts-selection-pop-up.component.html',
  styleUrls: ['./discounts-selection-pop-up.component.scss']
})
export class DiscountsSelectionPopUpComponent implements OnDestroy {
  selectedDiscount: DiscountsList;
  destroy$ = new Subject();

  constructor(
    public dialogRef: MatDialogRef<DiscountsSelectionPopUpComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DiscountsList[]
  ) {}



  close(response: boolean) {
    this.dialogRef.close(response);
  }

  getSelectedDiscount(event: any) {
    this.selectedDiscount = event;
  }

  confirm() {
    this.dialogRef.close(this.selectedDiscount);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
