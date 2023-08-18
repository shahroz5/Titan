import {
  Component,
  Inject,
} from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog
} from '@angular/material/dialog';

@Component({
  selector: 'poss-web-state-view',
  templateUrl: './state-view.component.html',
  styleUrls: ['./state-view.component.scss']
})
export class StateViewComponent  {
  constructor(
    public dialogRef: MatDialogRef<StateViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog
  ) {
    this.dialogData = data;
  }
  dialogData: any;


  onClose() {
    this.dialogRef.close();
  }
}
