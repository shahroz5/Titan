import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import {
  LotNumberSelectionEnum,
  ProductDetails
} from '@poss-web/shared/models';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-lot-number-selection-popup',
  templateUrl: './lot-number-selection-popup.component.html',
  styleUrls: ['./lot-number-selection-popup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LotNumberSelectionPopupComponent implements OnInit, OnDestroy {
  destroy$: Subject<null> = new Subject<null>();
  domLayout = 'autoHeight';
  rowSelection = 'single';
  rowHeight = 30;
  animateRows = true;
  api: GridApi;
  columnDefs = [];
  rowData = [];
  itemCode = null;
  productDetails: ProductDetails[];

  constructor(
    public dialogRef: MatDialogRef<LotNumberSelectionPopupComponent>,
    private translate: TranslateService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      availableLotNumbers: [];
      productDetails: ProductDetails[];
    }
  ) {
    this.rowData = data.availableLotNumbers;
    this.itemCode = data.productDetails.length
      ? data.productDetails[0].itemCode
      : null;
    this.productDetails = data.productDetails;
  }

  ngOnInit(): void {
    this.translate
      .get(['pw.productGrid.lotNumberSelectLabel'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.columnDefs = [
          {
            checkboxSelection: params => !params.data.isAdded,
            width: 10,
            minWidth: 10
          },
          {
            headerName:
              translatedMessages['pw.productGrid.lotNumberSelectLabel'],
            field: LotNumberSelectionEnum.LOTNUMBER,
            width: 50,
            minWidth: 50
          }
        ];
      });
  }

  closeDialog() {
    let specificItem = null;
    if (this.api.getSelectedRows().length) {
      specificItem = this.productDetails.filter(
        x =>
          x.inventoryId === this.api.getSelectedRows()[0].inventoryId &&
          !this.api.getSelectedRows()[0].isAdded
      );
    }
    this.dialogRef.close({ data: specificItem });
  }

  gridReady(params: GridReadyEvent) {
    this.api = params.api;
  }

  onGridSizeChanged() {
    this.api.sizeColumnsToFit();
  }

  onCellKeyPress(pressEvent) {
    const keyPressed = pressEvent.event.key;
    if (keyPressed === 'Enter') {
      if (!pressEvent.data.isAdded === true) {
        pressEvent.node.setSelected(!pressEvent.node.selected);
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
