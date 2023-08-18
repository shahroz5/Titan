import {
  Component,
  OnInit,
  Inject,
  OnDestroy,
  ChangeDetectionStrategy
} from '@angular/core';
import { GridApi, ColumnApi, GridReadyEvent } from 'ag-grid-community';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { ItemStones } from '@poss-web/shared/models';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'poss-web-ui-view-stones-popup',
  templateUrl: './ui-view-stones-popup.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UiViewStonesPopupComponent implements OnInit, OnDestroy {
  stoneData: ItemStones[];

  api: GridApi;
  columnApi: ColumnApi;
  columnDefs = [];
  defaultColDef = { flex: 1, minWidth: 100 };
  animateRows = true;
  domLayout = 'autoHeight';
  rowHeight = 35;
  rowData = [];
  context = this;
  destroy$: Subject<null> = new Subject<null>();

  stonCodeHeaderName;
  quantityHeaderName;
  stonCodeFieldName;
  quantityFieldName;

  constructor(
    private translate: TranslateService,
    public dialogRef: MatDialogRef<UiViewStonesPopupComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: any
  ) {
    this.translate
      .get([
        'pw.itemMaster.itemStoneCodeheader',
        'pw.itemMaster.itemStoneQuantityheader',
        'pw.itemMaster.itemStoneCodefield',
        'pw.itemMaster.itemStoneQuantityfield'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.stonCodeHeaderName =
          translatedMessages['pw.itemMaster.itemStoneCodeheader'];
        this.quantityHeaderName =
          translatedMessages['pw.itemMaster.itemStoneQuantityheader'];
        this.stonCodeFieldName =
          translatedMessages['pw.itemMaster.itemStoneCodefield'];
        this.quantityFieldName =
          translatedMessages['pw.itemMaster.itemStoneQuantityfield'];
      });
  }

  ngOnInit() {
    this.loadColumns();
    this.loadRowData(this.data.stones);
  }
  loadRowData(stonDdata) {
    const response = [];
    stonDdata.forEach(row => {
      const output = {};
      output['stoneCode'] = row.stoneCode;
      output['noOfStones'] = row.noOfStones;

      response.push(output);
    });
    this.rowData = response;
  }
  loadColumns() {
    this.columnDefs = [
      {
        headerName: this.stonCodeHeaderName,
        field: this.stonCodeFieldName
      },
      {
        headerName: this.quantityHeaderName,
        field: this.quantityFieldName
      }
    ];
  }
  gridReady(params: GridReadyEvent) {
    this.api = params.api;
    this.columnApi = params.columnApi;
    // this.api.showNoRowsOverlay();
  }

  onGridSizeChanged() {
    if (window.innerWidth >= 991) {
      this.api.sizeColumnsToFit();
    }

    // this.api.sizeColumnsToFit();
  }
  close() {
    this.dialogRef.close();
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
