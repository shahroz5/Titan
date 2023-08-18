import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PaginatedSelectionDialogComponent } from './paginated-selection-dialog.component';
import {
  PaginatedSelectionDialogConfig,
  PaginatedSelectionDialogRef
} from './paginated-selection-dialog.model';

@Injectable()
export class PaginatedSelectionDialogService {
  constructor(private dialog: MatDialog) {}

  open(config: PaginatedSelectionDialogConfig): PaginatedSelectionDialogRef {
    const dialogRef = this.dialog.open(PaginatedSelectionDialogComponent, {
      autoFocus: false,
      width: '300px',
      data: config
    });
    return {
      close: dialogRef.afterClosed(),
      load: dialogRef.componentInstance.load.asObservable()
    };
  }
}
