import { Component, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'poss-web-co-tolerance-config-edit-popup',
  templateUrl: './co-tolerance-config-edit-popup.component.html',
  styleUrls: ['./co-tolerance-config-edit-popup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoToleranceConfigEditPopupComponent {
  dialogData: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public dialogRef: MatDialogRef<CoToleranceConfigEditPopupComponent>
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
