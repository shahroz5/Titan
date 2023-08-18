import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  Input,
  OnChanges,
  ChangeDetectorRef
} from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { GridApi, ColumnApi, GridReadyEvent } from 'ag-grid-community';
import { DiscountsList } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-discounts-selection-grid',
  templateUrl: './discounts-selection-grid.component.html',
  styleUrls: ['./discounts-selection-grid.component.scss']
})
export class DiscountsSelectionGridComponent
  implements OnInit, OnChanges, OnDestroy {
  animateRows = true;
  count;
  pageSizeOptions: number[];
  minPageSize = 0;
  pageSize = 10;
  api: GridApi;
  columnApi: ColumnApi;
  currentColumnName = null;
  currentRowIndex: number;
  domLayout = 'autoHeight';
  formGroup: FormGroup = new FormGroup({});
  isDeleteShown = false;
  parentForm: FormArray = new FormArray([]);
  rowSelection = 'single';
  rowData = [];
  rowHeight = 35;
  totalAmount: number;

  defaultColDef = {
    enableCellTextSelection: true,
    suppressMovable: true,
    resizable: true
    // filter: true
    // floatingFilter: true
  };
  columnDefs = [];
  load = new Subject<any>();
  destroy$: Subject<null> = new Subject<null>();

  isFocusing = false;
  focusedHeaderName: string;
  currentRowField: string;
  currentRowInfo: string;

  @Input() discountsList: DiscountsList[];
  @Output() selectedDiscount: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private translate: TranslateService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const discountTypeLabel = 'pw.discountSelection.discountTypeLabel';
    const discountCodeLabel = 'pw.discountSelection.discountCodeLabel';
    const oneKtDiscountValueLabel =
      'pw.discountSelection.oneKtDiscountValueLabel';
    const twoKtDiscountValueLabel =
      'pw.discountSelection.twoKtDiscountValueLabel';
    const discountValueLabel = 'pw.discountSelection.discountValueLabel';

    this.translate
      .get([
        discountTypeLabel,
        discountCodeLabel,
        oneKtDiscountValueLabel,
        twoKtDiscountValueLabel,
        discountValueLabel
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: string) => {
        this.columnDefs = [
          {
            checkboxSelection: true,
            minWidth: 30,
            width: 30,
            pinned: 'left',
            lockPinned: true,
            suppressFilter: true
          },
          {
            headerName: translatedMessages[discountTypeLabel],
            field: 'discountType',
            width: 283
          },
          {
            headerName: translatedMessages[discountCodeLabel],
            field: 'discountCode',
            width: 150
          },
          {
            headerName: translatedMessages[oneKtDiscountValueLabel],
            field: 'oneKTDiscountValue',
            width: 150
          },
          {
            headerName: translatedMessages[twoKtDiscountValueLabel],
            field: 'twoKTDiscountValue',
            width: 150
          },
          {
            headerName: translatedMessages[discountValueLabel],
            field: 'discountValue',
            width: 150
          }
        ];
      });
  }

  ngOnChanges() {
    this.rowData = [];
    const rowData = [...this.discountsList];
    rowData.forEach((rowItem: DiscountsList) => {
      this.rowData.push({
        discountType: rowItem.discountType,
        discountCode: rowItem.discountCode,
        discountValue: rowItem?.discountValue ? rowItem.discountValue : '-',
        oneKTDiscountValue: rowItem?.oneKTDiscountValue
          ? rowItem.oneKTDiscountValue
          : '-',
        twoKTDiscountValue: rowItem?.twoKTDiscountValue
          ? rowItem.twoKTDiscountValue
          : '-'
      });
    });
    console.log('ROW DATA :', this.rowData);
  }

  getContext(): any {
    return {
      formGroup: this.parentForm.controls,
      componentParent: this
    };
  }

  gridReady(params: GridReadyEvent): void {
    this.api = params.api;
    this.columnApi = params.columnApi;
    if (this.rowData.length === 0) {
      this.api.showNoRowsOverlay();
    }
    // this.api.sizeColumnsToFit();
  }

  onRowSelected(event) {
    if (event && event.node && event.node.selected) {
      this.selectedDiscount.emit(event.data);
    } else if (this.api.getSelectedNodes().length === 0) {
      this.selectedDiscount.emit(null);
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
