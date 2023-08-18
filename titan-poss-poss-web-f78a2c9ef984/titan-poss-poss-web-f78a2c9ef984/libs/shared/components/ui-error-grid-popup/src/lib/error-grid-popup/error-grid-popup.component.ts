import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { Subject } from 'rxjs';
export interface ErrorModel {
  title: string;
  subTitle?: string;
  subTitle1?: string;
  columnDefs: {
    field: string;
    headerName: string;
  }[];
  rowData: any[];
  rowData1?: any[];
  buttonText?: string;
}
@Component({
  selector: 'poss-web-error-grid-popup',
  templateUrl: './error-grid-popup.component.html',
  styleUrls: ['./error-grid-popup.component.scss']
})
export class ErrorGridPopupComponent implements OnInit, OnDestroy {
  destroy$ = new Subject();
  itemSize = 30; //in Px
  minBufferPx = 4 * this.itemSize; // buffer of min
  maxBufferPx = 8 * this.itemSize; // buffer of max
  defaultColDef = {
    resizable: true,
    suppressMovable: true
  };
  rowHeight = 35;
  api: GridApi;

  constructor(
    public dialogRef: MatDialogRef<ErrorGridPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ErrorModel
  ) {}
  ngOnInit() {
    console.log('col', this.data.columnDefs, this.data.rowData);
  }

  gridReady(params: GridReadyEvent) {
    this.api = params.api;
    params.api.sizeColumnsToFit();
  }

  close() {
    this.dialogRef.close();
  }

  buttonClick() {
    this.dialogRef.close(true);
  }

  onGridSizeChanged() {
    if (window.innerWidth >= 991) {
      this.api.sizeColumnsToFit();
    }

    // this.api.sizeColumnsToFit();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
