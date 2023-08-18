import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

import { SortDialogComponent } from './sort-dialog.component';
import { Column } from './models/sort-dialog.model';
import { SortActions } from './models/sort-actions.enum';

@Injectable()
export class SortDialogService {
  private dialogObj = {
    data: [],
    selected: [],
    limit: 1,
    description: ['Low to High', 'High to Low']
  };

  set DataSource(columnList: Column[]) {
    this.dialogObj.data = columnList;
  }

  constructor(private dialog: MatDialog) {}

  openDialog(
    limit: number,
    selected: Column[]
  ): Observable<{ data: Column[]; actionfrom: string }> {
    if (this.dialogObj.data && this.dialogObj.data.length > 0) {
      if (limit > 0) {
        this.dialogObj = { ...this.dialogObj, limit };
      }
      this.dialogObj.selected = [...selected];

      const dialogref = this.dialog.open(SortDialogComponent, {
        width: '715px',
        height: '500px',
        data: this.dialogObj
      });

      return dialogref
        .afterClosed()
        .pipe(
          map(sortList =>
            !!sortList && sortList !== SortActions.CLOSE
              ? { data: sortList, actionfrom: SortActions.APPLY }
              : { data: selected, actionfrom: SortActions.CLOSE }
          )
        );
    } else {
      return throwError('DataSource Not available');
    }
  }
}
