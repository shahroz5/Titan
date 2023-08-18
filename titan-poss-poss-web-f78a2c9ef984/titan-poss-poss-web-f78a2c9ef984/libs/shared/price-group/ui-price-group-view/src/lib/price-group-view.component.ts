import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogDataPriceGroup } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-price-group-view',
  templateUrl: './price-group-view.component.html',
  styleUrls: ['./price-group-view.component.scss']
})
export class PriceGroupViewComponent  {
  constructor(
    public dialogRef: MatDialogRef<PriceGroupViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.dialogData = data;
  }
  dialogData: DialogDataPriceGroup;



  onClose() {
    this.dialogRef.close();
  }
}
