import {
  Component,
  Inject,
  ChangeDetectionStrategy
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'poss-web-error-pop-up',
  templateUrl: './error-pop-up.component.html',
  styleUrls: ['./error-pop-up.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrorPopUpComponent {
  dialogData: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public dialogRef: MatDialogRef<ErrorPopUpComponent>
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
