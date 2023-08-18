import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'poss-web-file-preview',
  templateUrl: './file-preview.component.html',
  styleUrls: ['./file-preview.component.scss']
})
export class FilePreviewComponent {
  
  @ViewChild('image', { static: true }) image: ElementRef;
  
  defaultImageUrl: string;
  imageUrl: string;
  previewHeader: string;
  type: string;
  imageScale = 1.0;

  constructor(
    private dialogRef: MatDialogRef<FilePreviewComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    console.log('DATA IN FILE PREVIEW :', data);
    this.imageUrl = data.imageUrl;
    this.previewHeader = data.previewHeader;
    this.type = data.type;
    console.log('TYPE :', this.type);
  }



  closePopup() {
    this.dialogRef.close(true);
  }

  defaultImage() {
    this.imageUrl = this.defaultImageUrl;
  }

  zoomPlus() {
    this.imageScale = this.imageScale + 0.1;
    this.image.nativeElement.style.transform = 'scale(' + this.imageScale + ')';
  }

  zoomMinus() {
    this.imageScale = this.imageScale - 0.1;
    this.image.nativeElement.style.transform = 'scale(' + this.imageScale + ')';
  }
}
