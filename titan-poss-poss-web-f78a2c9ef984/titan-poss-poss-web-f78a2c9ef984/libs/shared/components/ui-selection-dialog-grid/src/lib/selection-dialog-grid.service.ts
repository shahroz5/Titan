import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SelectionDialogGridComponent } from './selection-dialog-grid.component';
import { SelectionDialoGridConfig } from './selection-dialog-grid.model';

@Injectable()
export class SelectionDialogGridService {
  constructor(private dialog: MatDialog) {}

  open(config: SelectionDialoGridConfig): Observable<any> {
    const dialogRef = this.dialog.open(SelectionDialogGridComponent, {
      autoFocus: false,
      width: config.width + 'px',
      data: config
    });
    return dialogRef.afterClosed();
  }
}
