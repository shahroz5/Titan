import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'poss-web-item-preview-popup',
  templateUrl: './item-preview-popup.component.html',
  styleUrls: []
})
export class ItemPreviewPopupComponent  {
  defaultImageUrl = 'assets/img/product-default-image.svg';
  imageSrc: any;
  itemCode: string;
  constructor(
    private dialogRef: MatDialogRef<ItemPreviewPopupComponent>,
    private sanitizer: DomSanitizer,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.imageSrc = data.imageUrl;
    // let toReturnImage = data.imageUrl;
    // this.imageSrc = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' 
    //              + toReturnImage);
    this.itemCode = data.itemCode;
  }



  defaultImage() {
    this.imageSrc = this.defaultImageUrl;
  }
}
