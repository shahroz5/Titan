import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog
} from '@angular/material/dialog';
import { GridApi, GridReadyEvent } from 'ag-grid-community';

@Component({
  selector: 'app-coe-popup',
  templateUrl: './coe-popup.component.html',
  styleUrls: ['./coe-popup.component.scss']
})
export class CoePopupComponent implements OnInit {
  @Output() printCOE = new EventEmitter<string[]>();
  api: GridApi;
  defaultColDef = {
    resizable: false,
    suppressMovable: true,
    // suppressSizeToFit: true
  };
  variantCodes = [];
  columnDefs = [];
  domLayout = 'autoHeight';
  rowSelection = 'multiple';
  constructor(
    public dialogRef: MatDialogRef<CoePopupComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      items: string[];
      itemCodes: {[key: string]: string};
    }
  ) {
    this.data?.items?.forEach(element => {
      this.variantCodes.push({ id: element });
    });

    this.columnDefs = [
      {
        headerCheckboxSelection: true,
        checkboxSelection: true,
        minWidth: 40,
        width: 40,
        pinned: 'left',
        lockPinned: true
      },
      {
        headerName: 'Variant Code',
        field: 'id',
        valueFormatter: params => {
          return data.itemCodes[params.value]
        }
      }
    ];
  }

  ngOnInit() {}
  gridReady(params: GridReadyEvent) {
    this.api = params.api;
    this.api.sizeColumnsToFit();
  }

  print() {
    if (this.api.getSelectedNodes().length > 0) {
      let finalVariantCodes = [];
      this.api.getSelectedNodes().forEach(element => {
        finalVariantCodes.push(element.data.id);
      });

      this.printCOE.emit(finalVariantCodes);
    }
    this.dialogRef.close();
  }
  onClose() {
    this.dialogRef.close();
  }
  resetData() {
    if (this.api) {
      this.api.deselectAll();
    }
  }
}
