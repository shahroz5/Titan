import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  ErrorItemListComponent,
  ErrorItemListModel
} from './error-item-list.component';

@Injectable()
export class ErrorItemListService {
  constructor(private dialog: MatDialog) {}

  open(data: ErrorItemListModel): Observable<any> {
    const dialogRef = this.dialog.open(ErrorItemListComponent, {
      autoFocus: false,
      width: '700px',
      data: data
    });
    return dialogRef.afterClosed();
  }
}
