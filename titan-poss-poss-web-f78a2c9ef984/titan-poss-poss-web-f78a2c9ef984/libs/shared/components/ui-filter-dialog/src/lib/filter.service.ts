import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, throwError } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

import { FilterDialogComponent } from './filter-dialog.component';
import { Filter } from './models/filter-dialog.model';
import { FilterActions } from './models/filter-actions.enum';

@Injectable()
export class FilterService {
  private _DataSource: {
    [key: string]: Filter[];
  };
  private _sortDataSource: (a: Filter, b: Filter) => number;
  private _isSortedDataSource = false;
  private dialogObj;

  constructor(
    private dialog: MatDialog,
    public translateService: TranslateService
  ) {}

  set sortDataSource(sortfunc: (a: Filter, b: Filter) => number) {
    this._sortDataSource = sortfunc;
  }

  set isSortedDataSource(value: boolean) {
    this._isSortedDataSource = value;
  }

  set DataSource(data: { [key: string]: Filter[] }) {
    this._DataSource = this._isSortedDataSource ? data : this.sortData(data);

    this.dialogObj = {
      selected: {},
      filterlimit: 5,
      listlimit: 200,
      filterdata: { ...data }
    };
  }

  sortData(data: { [key: string]: Filter[] }): { [key: string]: Filter[] } {
    Object.keys(data).forEach(key =>
      data[key].sort(
        !!this._sortDataSource
          ? this._sortDataSource
          : (a, b) =>
              a.description && b.description
                ? a.description.localeCompare(b.description)
                : 0
      )
    );
    return data;
  }

  openDialog(
    filterlimit: number,
    selected: { [key: string]: Filter[] },
    listlimit?: number,
    showSearch = true
  ): Observable<{ data: { [key: string]: Filter[] }; actionfrom: string }> {
    if (!(this._DataSource && Object.keys(this._DataSource).length > 0)) {
      return this.translateService
        .get('pw.filterPopup.filterdatasourceunavailableErrorMessage')
        .pipe(switchMap(msg => throwError(msg)));
    }

    if (!this.checkDataSize(listlimit)) {
      return this.translateService
        .get('pw.filterPopup.filterdatasourceoutoflimitErrorMessage', {
          limit: this.dialogObj.listlimit
        })
        .pipe(switchMap(msg => throwError(msg)));
    }

    if (filterlimit > 0) {
      this.dialogObj = { ...this.dialogObj, filterlimit };
    }
    this.dialogObj = { ...this.dialogObj, showSearch };
    this.convertArrayToMap(selected);

    const dialogref = this.dialog.open(FilterDialogComponent, {
      width: '715px',
      height: '530px',
      data: this.dialogObj
    });

    return dialogref
      .afterClosed()
      .pipe(
        map(filterList =>
          !!filterList && filterList !== FilterActions.CLOSE
            ? { data: filterList, actionfrom: FilterActions.APPLY }
            : { data: selected, actionfrom: FilterActions.CLOSE }
        )
      );
  }

  private convertArrayToMap(selected: { [key: string]: Filter[] }) {
    if (selected && Object.keys(selected).length > 0) {
      Object.keys(selected).forEach(
        filter =>
          (this.dialogObj.selected[filter] = new Map(
            selected[filter].map(item => [item.id, item])
          ))
      );
    } else {
      Object.keys(this._DataSource).forEach(
        title =>
          (this.dialogObj.selected[title] = new Map<string | number, Filter>())
      );
    }
  }

  private checkDataSize(listlimit?: number): boolean {
    let dataCheck = true;
    if (listlimit) {
      this.dialogObj = { ...this.dialogObj, listlimit };
    }

    Object.keys(this._DataSource).forEach(type => {
      if (this._DataSource[type].length > this.dialogObj.listlimit) {
        dataCheck = false;
      }
    });
    return dataCheck;
  }
}
