import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'poss-web-shortcut-info-popup',
  templateUrl: './shortcut-info-popup.component.html',
  styleUrls: ['./shortcut-info-popup.component.scss']
})
export class ShortcutInfoPopupComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public config: any,
    private dialogRef: MatDialogRef<ShortcutInfoPopupComponent>
  ) {
    console.log('popup list', config);
  }


  close() {
    this.dialogRef.close({ type: 'close' });
  }
}
