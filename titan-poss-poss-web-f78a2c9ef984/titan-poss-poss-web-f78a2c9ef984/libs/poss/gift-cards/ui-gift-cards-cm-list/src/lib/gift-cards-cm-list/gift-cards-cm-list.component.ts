import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  Input,
  OnChanges,
  ChangeDetectionStrategy
} from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { GridApi, ColumnApi, GridReadyEvent } from 'ag-grid-community';
import { CancellableCashMemoData } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-gift-cards-cm-list',
  templateUrl: './gift-cards-cm-list.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GiftCardsCmListComponent implements OnChanges, OnInit, OnDestroy {
  animateRows = true;
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
    flex: 1
    // filter: true
    // floatingFilter: true
  };

  columnDefs = [];

  destroy$: Subject<null> = new Subject<null>();

  @Input() cashMemoList: CancellableCashMemoData[];
  @Output() selectedCM: EventEmitter<
    CancellableCashMemoData
  > = new EventEmitter<CancellableCashMemoData>();

  constructor(private translate: TranslateService) {}

  ngOnInit() {
    const cmNumber = 'pw.giftCards.cmNumber';
    const customerName = 'pw.giftCards.customerName';
    const aging = 'pw.giftCards.aging';

    this.translate
      .get([cmNumber, customerName, aging])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: string) => {
        this.columnDefs = [
          // {
          //   checkboxSelection: true,
          //   minWidth: 30,
          //   width: 30,
          //   pinned: 'left',
          //   lockPinned: true,
          //   suppressFilter: true
          // },
          {
            headerName: translatedMessages[cmNumber],
            field: 'refDocNo',
            // filter: 'agTextColumnFilter',
            // filterParams: {
            //   filterOptions: ['contains', 'notContains'],
            //   debounceMs: 0,
            //   suppressAndOrCondition: true
            // },
            cellClass: 'pw-fourth-color',
            cellStyle: { cursor: 'pointer' }
          },
          {
            headerName: translatedMessages[customerName],
            field: 'customerName'
            // filter: 'agTextColumnFilter',
            // filterParams: {
            //   filterOptions: ['contains', 'notContains'],
            //   debounceMs: 1000,
            //   suppressAndOrCondition: true
            // }
          },
          {
            headerName: translatedMessages[aging],
            field: 'refTxnTime'
            // filter: 'agTextColumnFilter',
            // suppressFilter: true
          }
        ];
      });
  }

  ngOnChanges() {
    if (this.cashMemoList) {
      this.rowData = this.cashMemoList;
    }
  }

  gridReady(params: GridReadyEvent): void {
    this.api = params.api;
    this.columnApi = params.columnApi;
    if (this.rowData.length === 0) {
      this.api.showNoRowsOverlay();
    }
    // this.api.sizeColumnsToFit();
  }

  getRowNodeId(data) {
    return data.cmNumber;
  }

  onRowSelected(event) {
    if (event && event.node && event.node.selected) {
      this.selectedCM.emit(event.data);
    } else if (
      !event ||
      (event && !event.node) ||
      (event && event.node && !event.node.selected)
    ) {
      this.selectedCM.emit(null);
    }
  }

  onGridSizeChanged() {
    if (window.innerWidth >= 991) {
      this.api.sizeColumnsToFit();
    }

    // this.api.sizeColumnsToFit();
  }

  onRowClicked(event) {
    if (event && event.data) {
      this.selectedCM.emit(event.data);
    } else if (!event || (event && !event.data)) {
      this.selectedCM.emit(null);
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
