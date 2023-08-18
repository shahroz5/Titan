import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog
} from '@angular/material/dialog';
import { DocumentListResponse } from '@poss-web/shared/models';
import { GridApi, GridReadyEvent } from 'ag-grid-community';

@Component({
  selector: 'app-file-download-popup',
  templateUrl: './file-download-popup.component.html',
  styleUrls: ['./file-download-popup.component.scss']
})
export class FileDownloadPopupComponent implements OnInit {
  @Output() downloadFile = new EventEmitter<DocumentListResponse>();
  api: GridApi;
  defaultColDef = {
    resizable: false,
    suppressMovable: true,
    suppressSizeToFit: true
  };
  files = [];
  columnDefs = [];
  domLayout = 'autoHeight';
  rowHeight = 35;
  constructor(
    public dialogRef: MatDialogRef<FileDownloadPopupComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      files: DocumentListResponse[];
    }
  ) {
    this.columnDefs = [
      {
        headerName: 'File Name',
        flex: 1,
        field: 'name'
      },
      {
        headerName: '',
        flex: 1,
        field: 'id',
        cellRenderer: () => `<a class="pw-anchor-underline">View</a>`
      }
    ];
  }

  ngOnInit() {}

  onCellClicked(clickEvent) {
    if (clickEvent.colDef.field === 'id') {
      this.downloadFile.emit(clickEvent.data);
    }
  }
  onClose() {
    this.dialogRef.close();
  }
}
