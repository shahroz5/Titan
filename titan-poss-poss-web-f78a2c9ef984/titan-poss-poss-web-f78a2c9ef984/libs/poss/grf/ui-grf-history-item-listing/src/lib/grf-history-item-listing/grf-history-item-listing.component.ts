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
import { FormGroup, FormArray, FormControl } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { GridApi, ColumnApi, GridReadyEvent } from 'ag-grid-community';
import { AdvanceHistoryItem } from '@poss-web/shared/models';
import * as moment from 'moment';
import { DateFormatterService } from '@poss-web/shared/components/ui-formatters';

@Component({
  selector: 'poss-web-grf-history-item-listing',
  templateUrl: './grf-history-item-listing.component.html'
})
export class GrfHistoryItemListingComponent
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

  isFocusing = false;
  focusedHeaderName: string;
  currentRowField: string;
  currentRowInfo: string;

  defaultColDef = {
    enableCellTextSelection: true,
    suppressMovable: true,
    flex: 1
    // filter: true
    // floatingFilter: true
  };
  columnDefs = [];
  load = new Subject<any>();
  destroy$: Subject<null> = new Subject<null>();
  @Input() grfHistoryItemList: AdvanceHistoryItem[];
  @Input() itemTotalCount: any;
  @Input() grfHistoryObservable: Observable<any>;
  @Output() selectedHistoryItem: EventEmitter<
    AdvanceHistoryItem
  > = new EventEmitter<AdvanceHistoryItem>();
  @Output() paginationEmit: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private translate: TranslateService,
    private dateFormatterService: DateFormatterService,
    private cd: ChangeDetectorRef
  ) {
    this.pageSize = 10;
    this.minPageSize = 10;
    this.pageSizeOptions = [10, 20, 50];
    this.count = 100;
  }

  ngOnInit() {
    this.count = this.itemTotalCount;
    const documentNumberLabel = 'pw.acceptAdvance.documentNumber';
    const documentDate = 'pw.grf.documentDate';
    const fiscalYearLabel = 'pw.acceptAdvance.fiscalYear';
    const customerNameLabel = 'pw.acceptAdvance.customerName';
    const creditNoteNumberLabel = 'pw.acceptAdvance.creditNoteNumber';
    const netAmountLabel = 'pw.acceptAdvance.netAmount';
    const goldWeightFrozenLabel = 'pw.grf.goldWeightFrozen';
    const createdByLabel = 'pw.acceptAdvance.createdBy';

    this.translate
      .get([
        documentNumberLabel,
        documentDate,
        fiscalYearLabel,
        customerNameLabel,
        creditNoteNumberLabel,
        netAmountLabel,
        goldWeightFrozenLabel,
        createdByLabel
      ])
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
            headerName: translatedMessages[documentNumberLabel],
            field: 'docNo',
            // filter: 'agTextColumnFilter',
            // filterParams: {
            //   filterOptions: ['contains', 'notContains'],
            //   debounceMs: 0,
            //   suppressAndOrCondition: true
            // },
            cellRenderer: params => this.viewAnchorRenderer(params),
            cellClass: 'pw-fourth-color',
            cellStyle: { cursor: 'pointer' }
          },
          {
            headerName: translatedMessages[documentDate],
            field: 'docDate',
            valueFormatter: param => {
              if (param.value && param.value !== '') {
                return this.dateFormatterService.format(moment(param.value));
                // return moment(param.value).format('DD/MM/YYYY');
              } else {
                return null;
              }
            }
          },
          {
            headerName: translatedMessages[fiscalYearLabel],
            field: 'fiscalYear'
            // filter: 'agTextColumnFilter',
            // filterParams: {
            //   filterOptions: ['contains', 'notContains'],
            //   debounceMs: 1000,
            //   suppressAndOrCondition: true
            // }
          },
          {
            headerName: translatedMessages[customerNameLabel],
            field: 'customerName'
            // filter: 'agTextColumnFilter',
            // suppressFilter: true
          },
          {
            headerName: translatedMessages[creditNoteNumberLabel],
            field: 'cnDocNo'
            // filter: 'agTextColumnFilter',
            // suppressFilter: true
          },
          {
            headerName: translatedMessages[netAmountLabel],
            field: 'netAmount'
            // filter: 'agTextColumnFilter',
            // suppressFilter: true
          },
          {
            headerName: translatedMessages[goldWeightFrozenLabel],
            field: 'frozenGoldWeight',
            valueFormatter: param => {
              if (param.value) {
                const frozenGoldWeightObj = JSON.parse(param.value);
                return frozenGoldWeightObj &&
                  frozenGoldWeightObj.data &&
                  frozenGoldWeightObj.data.weight
                  ? frozenGoldWeightObj.data.weight
                  : '-';
              } else {
                return null;
              }
            }
            // cellRendererFramework: CheckboxGridCellComponent
            // filter: 'agTextColumnFilter',
            // suppressFilter: true
          },
          {
            headerName: translatedMessages[createdByLabel],
            field: 'createdBy'
            // filter: 'agTextColumnFilter',
            // suppressFilter: true
          }
        ];
      });
  }

  ngOnChanges() {
    // if (this.advanceHistoryObservable) {
    //   this.advanceHistoryObservable
    //     .pipe(takeUntil(this.destroy$))
    //     .subscribe(advanceHistory => {
    //       console.log('Advance HISTORY123 :', advanceHistory);
    //       if (advanceHistory && advanceHistory.length > 0) {
    //         this.rowData = [];
    //         const rowData = [...advanceHistory];
    //         this.rowData = rowData.map(rowItem => {
    //           return {
    //             ...rowItem,
    //             formGroup: new FormGroup({
    //               eghsPayment: new FormControl({
    //                 value: rowItem.eghsPayment,
    //                 disabled: true
    //               })
    //             })
    //           };
    //         });
    //         console.log('ROW DATA :', this.rowData);
    //         this.cd.markForCheck();
    //       }
    //     });
    // }
    this.count = this.itemTotalCount;
    this.rowData = [];
    if (this.grfHistoryItemList) {
      const rowData = [...this.grfHistoryItemList];
      this.rowData = rowData.map(rowItem => {
        return {
          ...rowItem,
          formGroup: new FormGroup({
            eghsPayment: new FormControl({
              value: rowItem.eghsPayment,
              disabled: true
            })
          })
        };
      });
    }
  }

  viewAnchorRenderer(params) {
    return `<a class="pw-anchor-underline pw-fourth-color">${params.value}</a>`;
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

  getRowNodeId(data) {
    return data.cmNumber;
  }

  onRowSelected(event) {
    if (event && event.node && event.node.selected) {
      this.selectedHistoryItem.emit(event.data);
    } else if (
      !event ||
      (event && !event.node) ||
      (event && event.node && !event.node.selected)
    ) {
      this.selectedHistoryItem.emit(null);
    }
  }

  onGridSizeChanged() {
    if (window.innerWidth >= 991) {
      this.api.sizeColumnsToFit();
    }

    // this.api.sizeColumnsToFit();
  }

  onCellClicked(event) {
    if (event && event.column && event.column.getColId() === 'docNo') {
      if (event && event.data) {
        this.selectedHistoryItem.emit(event.data);
      } else if (!event || (event && !event.data)) {
        this.selectedHistoryItem.emit(null);
      }
    }
  }

  change(event: any) {
    this.api.paginationSetPageSize(event.pageSize);
    this.api.paginationGoToPage(event.pageIndex);

    // this.load.next({
    //   size: event.pageSize,
    //   page: event.pageIndex
    // });
    this.paginationEmit.emit({
      size: event.pageSize,
      page: event.pageIndex
    });
  }

  onCellFocused(event) {
    this.isFocusing = true;
    this.focusedHeaderName = event.column.colDef.headerName;
    this.currentRowIndex = Number(event.rowIndex);
    this.currentRowField = event.column.colDef.field;
    var node = this.api.getDisplayedRowAtIndex(this.currentRowIndex);
    this.currentRowInfo = this.api.getValue(this.currentRowField, node);
    if (this.currentRowField === 'docDate')
      this.currentRowInfo = this.dateFormatterService.format(
        moment(this.currentRowInfo)
      );
    if (this.currentRowField === 'frozenGoldWeight')
      this.currentRowInfo = JSON.parse(this.currentRowInfo).data.weight
        ? JSON.parse(this.currentRowInfo).data.weight
        : '-';
  }

  focusOut(event) {
    this.isFocusing = false;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
