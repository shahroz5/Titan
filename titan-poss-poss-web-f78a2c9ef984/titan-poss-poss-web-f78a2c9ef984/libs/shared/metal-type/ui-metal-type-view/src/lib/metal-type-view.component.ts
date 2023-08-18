import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  DialogDataMaterialType
} from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-metal-type-view',
  templateUrl: './metal-type-view.component.html',
  styleUrls: ['./metal-type-view.component.scss']
})
export class MetalTypeViewComponent  {
  constructor(
    public dialogRef: MatDialogRef<MetalTypeViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.dialogData = data;
  }
  dialogData: DialogDataMaterialType;



  onClose() {
    this.dialogRef.close();
  }
}
