import {
  Component,
  Inject,
  ChangeDetectionStrategy
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'poss-web-ab-tolerance-config-edit-popup',
  templateUrl: './ab-tolerance-config-edit-popup.component.html',
  styleUrls: ['./ab-tolerance-config-edit-popup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AbToleranceConfigEditPopupComponent{
  dialogData: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public dialogRef: MatDialogRef<AbToleranceConfigEditPopupComponent>
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
