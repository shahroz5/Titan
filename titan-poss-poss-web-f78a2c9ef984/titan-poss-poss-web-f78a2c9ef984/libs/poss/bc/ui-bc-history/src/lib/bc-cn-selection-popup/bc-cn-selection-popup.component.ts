import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GridApi, GridReadyEvent } from 'ag-grid-community';

@Component({
  selector: 'poss-web-bc-cn-selection-popup',
  templateUrl: './bc-cn-selection-popup.component.html',
  styleUrls: ['./bc-cn-selection-popup.component.scss']
})
export class BcCnSelectionPopupComponent implements OnInit {
  @Output() printCN = new EventEmitter<string[]>();
  api: GridApi;
  defaultColDef = {
    resizable: false,
    suppressMovable: true
    // suppressSizeToFit: true
  };
  cnNumber = [];
  columnDefs = [];
  domLayout = 'autoHeight';
  rowSelection = 'multiple';
  constructor(
    public dialogRef: MatDialogRef<BcCnSelectionPopupComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      items: { [key: string]: string };
    }
  ) {
    for (let item in data?.items) {
      if (item) {
        this.cnNumber.push({ id: item });
      }
    }
    // this.data?.items?.forEach(element => {
    //   this.cnNumber.push({ id: element });
    // });

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
        headerName: 'CN Number',
        field: 'id',
        valueFormatter: params => {
          return data.items[params.value];
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

      this.printCN.emit(finalVariantCodes);
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
