import {
  Component,
  Inject,
  OnDestroy,
  ChangeDetectionStrategy
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { GridApi, GridReadyEvent } from 'ag-grid-community';

export interface ErrorItemListModel {
  title: string;
  subTitle?: string;
  columnDefs: {
    field: string;
    headerName: string;
  }[];
  rowData: any[];
  buttonText?: string;
}

@Component({
  selector: 'poss-web-error-item-list',
  templateUrl: './error-item-list.component.html',
  styleUrls: ['./error-item-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrorItemListComponent implements OnDestroy {
  destroy$ = new Subject();
  itemSize = 30; //in Px
  minBufferPx = 4 * this.itemSize; // buffer of min
  maxBufferPx = 8 * this.itemSize; // buffer of max
  defaultColDef = {
    resizable: true,
    suppressMovable: true
  };
  api: GridApi;

  constructor(
    public dialogRef: MatDialogRef<ErrorItemListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ErrorItemListModel
  ) {}

  gridReady(params: GridReadyEvent) {
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
