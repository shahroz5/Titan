import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy
} from '@angular/core';
import { GridApi, ColumnApi, GridReadyEvent } from 'ag-grid-community';
import { Subject } from 'rxjs';
import * as moment from 'moment';
import { FormGroup } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import {
  CurrencyFormatterService,
  DateFormatterService
} from '@poss-web/shared/components/ui-formatters';
import { MatDialog } from '@angular/material/dialog';
import { UiAbPopupComponent } from '../ui-ab-requests-popup/ui-ab-popup.component';
const pinLeft = 'left';
@Component({
  selector: 'poss-web-ui-ab-request',
  templateUrl: './ui-ab-request.component.html'
})
export class UiAbRequestComponent implements OnInit, OnDestroy {
  @Input() productGrid;
  @Input() count;
  @Input() minPageSize;
  @Input() pageSizeOptions;
  @Input() pageSize;
  rowSelection = 'multiple';
  rowHeight = '35';
  colDef = [];
  animateRows = true;

  defaultColDef = {
    flex: 1,

    resizable: true
  };
  domLayout = 'autoHeight';
  api: GridApi;
  columnApi: ColumnApi;
  destroy$: Subject<null> = new Subject<null>();
  billCancellationForm: FormGroup;
  enable = false;
  @Output() paginateEmit = new EventEmitter<any>();
  @Output() approveIdEmit = new EventEmitter<any>();
  @Output() onselected = new EventEmitter<string>();

  isFocusing = false;
  focusedHeaderName: string;
  currentRowIndex: number;
  currentRowField: string;
  currentRowInfo: string;

  constructor(
    private dateFormatterService: DateFormatterService,
    private currencyFormatterService: CurrencyFormatterService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    console.log(this.productGrid, 'product');

    this.colDef = [
      {
        headerCheckboxSelection: true,
        checkboxSelection: params => {
          return params.data?.taskId;
        },
        suppressMovable: true,
        width: 30,
        minWidth: 30,
        pinned: pinLeft
      },
      {
        field: 'locationCode',
        headerName: 'Loc. Code',
        suppressMovable: true,
        sortable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          applyButton: true,
          resetButton: true
        },

        enableCellChangeFlash: true
      },
      {
        field: 'docNo',
        headerName: 'Req. No',

        suppressMovable: true,

        filter: 'agNumberColumnFilter',
        filterParams: {
          applyButton: true,
          resetButton: true
        },

        enableCellChangeFlash: true
      },
      {
        field: 'abDocNo',
        headerName: 'AB No.',
        suppressMovable: true,

        sortable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          applyButton: true,
          resetButton: true
        },
        minWidth: 140,
        enableCellChangeFlash: true
      },
      {
        field: 'headerData.data.docDate',
        headerName: 'AB Doc Date',
        suppressMovable: true,

        sortable: true,
        valueFormatter: params => {
          return this.dateFormatterService.format(moment(params.value));
        },
        enableCellChangeFlash: true
      },

      {
        field: 'customerName',
        headerName: 'Customer Name',

        sortable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          applyButton: true,
          resetButton: true
        },
        enableCellChangeFlash: true
      },
      {
        field: 'mobileNumber',
        headerName: 'Customer Mobile No.',
        sortable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          applyButton: true,
          resetButton: true
        },
        enableCellChangeFlash: true,

        suppressMovable: true
      },
      {
        field: 'totalAmount',
        headerName: 'Amount',
        suppressMovable: true,
        valueFormatter: params => {
          if (params.value) {
            return this.currencyFormatterService.format(
              params.value,
              'INR',
              false
            );
          } else {
            return null;
          }
        },

        sortable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          applyButton: true,
          resetButton: true
        },

        enableCellChangeFlash: true
      },
      {
        field: 'headerData.data.requestedDate',
        headerName: 'AB Request Date',
        suppressMovable: true,

        sortable: true,
        valueFormatter: params => {
          return this.dateFormatterService.format(moment(params.value));
        },
        enableCellChangeFlash: true
      },
      {
        field: 'requestorRemarks',
        headerName: 'Request Reason',
        sortable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          applyButton: true,
          resetButton: true
        },
        enableCellChangeFlash: true
      },
      {
        headerName: 'Uploaded Documents',
        cellRenderer: () => `<a class="pw-anchor-underline">View</a>`
      }
    ];
  }

  change(event: any) {
    this.api.paginationSetPageSize(event.pageSize);
    this.api.paginationGoToPage(event.pageIndex);
    this.paginateEmit.emit({
      page: event.pageIndex,
      size: event.pageSize
    });
  }

  gridReady(params: GridReadyEvent) {
    console.log('grid');
    this.api = params.api;
    this.api.setRowData(this.productGrid);

    params.api.sizeColumnsToFit();
    console.log(params);
  }
  remarks(approve: boolean) {
    console.log(
      this.api.getSelectedNodes().length,
      this.api.getSelectedNodes().map(node => node.data.taskId)
    );
    const dialogRef = this.dialog.open(UiAbPopupComponent, {
      width: '400px'
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          if (this.api.getSelectedNodes().length > 1) {
            let statusUpdate = [];
            this.api.getSelectedNodes().forEach(element => {
              statusUpdate = [
                ...statusUpdate,
                {
                  approved: approve,
                  approverRemarks: data.remarks,
                  taskId: element.data.taskId,
                  processId: element.data.processId,
                  taskName: 'REQUEST_APPROVER_L1',
                  reqNo: element.data.docNo
                }
              ];
            });
            this.approveIdEmit.emit({ result: statusUpdate, type: 'bulk' });
          } else if (this.api.getSelectedNodes().length === 1) {
            this.api.getSelectedNodes().forEach(element => {
              this.approveIdEmit.emit({
                result: {
                  approved: approve,
                  approverRemarks: data.remarks,
                  taskId: element.data.taskId,
                  processId: element.data.processId,
                  taskName: 'REQUEST_APPROVER_L1',
                  reqNo: element.data.docNo
                },
                type: 'single'
              });
            });
          }
        }
      });
  }
  onCellClicked(clickEvent) {
    if (clickEvent.colDef.headerName === 'Uploaded Documents') {
      this.onselected.emit(clickEvent.data.headerData?.data);
    }
  }
  onRowSelected($event) {
    if (this.api.getSelectedNodes().length > 0) {
      this.enable = true;
    } else {
      this.enable = false;
    }
  }

  ngOnDestroy() {
    console.log('ss', this.productGrid);
  }
  onGridSizeChanged() {
    this.api.sizeColumnsToFit();
  }

  onCellFocused(event) {
    this.isFocusing = true;
    this.focusedHeaderName = event.column.colDef.headerName;
    this.currentRowIndex = Number(event.rowIndex);
    this.currentRowField = event.column.colDef.field;
    var node = this.api.getDisplayedRowAtIndex(this.currentRowIndex);
    this.currentRowInfo = this.api.getValue(this.currentRowField, node);
    if (
      this.currentRowField === 'headerData.data.docDate' ||
      this.currentRowField === 'headerData.data.requestedDate'
    )
      this.currentRowInfo = this.dateFormatterService.format(
        moment(this.currentRowInfo)
      );
    if (this.currentRowField === 'totalAmount')
      this.currentRowInfo = this.currencyFormatterService.format(
        this.currentRowInfo,
        'INR',
        false
      );
  }

  focusOut(event) {
    this.isFocusing = false;
  }
}
