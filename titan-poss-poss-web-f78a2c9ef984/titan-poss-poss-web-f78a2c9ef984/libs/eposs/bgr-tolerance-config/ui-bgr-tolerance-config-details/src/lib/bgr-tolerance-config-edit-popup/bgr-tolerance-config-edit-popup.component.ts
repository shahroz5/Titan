import {
  Component,
  Inject,
  ChangeDetectionStrategy
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'poss-web-bgr-tolerance-config-edit-popup',
  templateUrl: './bgr-tolerance-config-edit-popup.component.html',
  styleUrls: ['./bgr-tolerance-config-edit-popup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BgrToleranceConfigEditPopupComponent{
  dialogData: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public dialogRef: MatDialogRef<BgrToleranceConfigEditPopupComponent>
  ) {
    this.dialogData = data;
  }

  okButton() {
    this.dialogRef.close({ data: this.dialogData });
  }
  closePopUp() {
    this.dialogRef.close({ data: this.dialogData });
  }
}
