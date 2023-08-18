import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SelectionDialogComponent } from './selection-dialog/selection-dialog.component';
import {
  SelectionDialogConfig,
  SelectionDailogRef
} from './selection-dialog.model';
import { SelectionDialogWithApplyBtnComponent } from './selection-dialog-with-apply-btn/selection-dialog-with-apply-btn.component';

@Injectable()
export class SelectionDialogService {
  constructor(private dialog: MatDialog) {}

  open(config: SelectionDialogConfig): Observable<any> {
    const dialogRef = this.dialog.open(SelectionDialogComponent, {
      autoFocus: false,
      width: '300px',
      data: config
    });
    return dialogRef.afterClosed();
  }

  openWithInifinityScroll(config: SelectionDialogConfig): SelectionDailogRef {
    const dialogRef = this.dialog.open(SelectionDialogComponent, {
      autoFocus: false,
      width: '300px',
      data: config
    });
    return {
      close: dialogRef.afterClosed(),
      loadNext: dialogRef.componentInstance.loadNext.asObservable(),
      search: dialogRef.componentInstance.search.asObservable()
    };
  }

  openWithApplyBtn(config: SelectionDialogConfig): Observable<any> {
    const dialogRef = this.dialog.open(SelectionDialogWithApplyBtnComponent, {
      autoFocus: false,
      width: '300px',
      data: config
    });
    return dialogRef.afterClosed();
  }
}
