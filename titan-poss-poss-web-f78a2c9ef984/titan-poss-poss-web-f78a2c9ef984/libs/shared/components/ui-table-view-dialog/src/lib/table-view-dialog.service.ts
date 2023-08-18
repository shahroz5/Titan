import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { TableViewDialogComponent } from './table-view-dialog.component';
import { TableViewDialogConfig } from './table-view-dialog.model';

@Injectable()
export class TableViewDialogService {
  constructor(private dialog: MatDialog) {}

  open(config: TableViewDialogConfig): Observable<any> {
    const dialogRef = this.dialog.open(TableViewDialogComponent, {
      autoFocus: false,
      width: 'auto',
      data: config
    });
    return dialogRef.afterClosed();
  }
}
