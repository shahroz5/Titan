import { Component, Inject } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog
} from '@angular/material/dialog';
import {
  ProductCategoryDetails,
} from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-product-category-view',
  templateUrl: './product-category-view.component.html',
  styleUrls: ['./product-category-view.component.scss']
})
export class ProductCategoryViewComponent  {
  constructor(
    public dialogRef: MatDialogRef<ProductCategoryViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog
  ) {
    this.dialogData = data;
  }
  dialogData: ProductCategoryDetails;



  onClose() {
    this.dialogRef.close();
  }
}
