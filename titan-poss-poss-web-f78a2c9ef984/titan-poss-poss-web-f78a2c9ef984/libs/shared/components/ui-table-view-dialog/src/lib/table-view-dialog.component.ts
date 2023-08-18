import {
  ChangeDetectionStrategy,
  Component,
  Inject,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TableViewDialogConfig } from './table-view-dialog.model';

@Component({
  selector: 'poss-web-table-view-dialog',
  templateUrl: './table-view-dialog.component.html',
  styleUrls: ['./table-view-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableViewDialogComponent  {
  constructor(
    public dialogRef: MatDialogRef<TableViewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TableViewDialogConfig
  ) {}



  close() {
    this.dialogRef.close(null);
  }
}
