import {
  Component,
  Output,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy,
  OnChanges,
  SimpleChanges,
  Inject
} from '@angular/core';
import {
  DateFormatterService,
  CurrencySymbolService,
  CurrencyFormatterService
} from '@poss-web/shared/components/ui-formatters';

import { Subject } from 'rxjs';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { PageEvent } from '@angular/material/paginator';
import { EditItemComponent } from '@poss-web/shared/components/ui-ag-grid';
import {
  SaveRoRequestApproval,
  RoRequestApprovalListResponse,
  roRequestEnum,
  AlertPopupTypeEnum,
  AlertPopupServiceAbstraction
} from '@poss-web/shared/models';

import { MatDialog } from '@angular/material/dialog';

import { POSS_WEB_CURRENCY_CODE } from '@poss-web/shared/util-config';
import { RemarkDialogComponent } from '../remark-dialog/remark-dialog.component';

@Component({
  selector: 'poss-web-ro-request-list',
  templateUrl: './ro-request-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoRequestListComponent implements OnDestroy, OnInit, OnChanges {
  reqGridApi: GridApi;
  histroyGridApi: GridApi;

  @Input() requestsListPoss: RoRequestApprovalListResponse[];
  @Input() pendingRequests: any;
  @Input() disableButton;

  @Input() approvedRequests: RoRequestApprovalListResponse[];
  @Input() rejectedRequests: RoRequestApprovalListResponse[];
  @Input() closedRequests: RoRequestApprovalListResponse[];
  @Input() count: number;
  @Input() pageSizeOptions: number[] = [];
  @Input() pageEvent: PageEvent;

  @Input() isHistory;
  @Input() isApproved: boolean;
  @Input() isEposs: boolean;

  @Output() paginator = new EventEmitter<any>();
  @Output() sort = new EventEmitter<any>();
  @Output() saveStatus = new EventEmitter<SaveRoRequestApproval>();

  rowData = [];
  remarksValidationLabel: string;
  hasRemarks: boolean;
  domLayout = 'autoHeight';
  rowHeight = '35';
  animateRows = true;
  rowSelection = 'multiple';
  disable;
  reqColumnDefs = [];
  histroyColumnDefs = [];

  destroy$: Subject<null> = new Subject<null>();
  defaultColDef = {
    flex: 1,
    suppressMovable: true,

    resizable: false
  };
  minPageSize: number;
  isFocusing = false;
  focusedHeaderName: string;
  currentRowIndex: number;
  currentRowField: string;
  currentRowInfo: string;

  constructor(
    private translate: TranslateService,
    private dateFormatterService: DateFormatterService,
    private currencySymbolService: CurrencySymbolService,
    private currencyFormatterService: CurrencyFormatterService,
    @Inject(POSS_WEB_CURRENCY_CODE) public defaultCurrencyCode,
    private alertPopupService: AlertPopupServiceAbstraction,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const pageSizeOptions = this.pageSizeOptions;
    if (pageSizeOptions.length) {
      this.minPageSize = pageSizeOptions?.reduce((a: number, b: number) =>
        a < b ? a : b
      );
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.disable = this.disableButton;
    this.createHistoryTable();
    this.createRequestTable();
  }
  createRequestTable() {
    if (this.isEposs) {
      this.translate
        .get([
          'pw.roRequestApproval.locationCodeCol',
          'pw.roRequestApproval.requestNumberCol',
          'pw.roRequestApproval.fiscalYearCol',
          'pw.roRequestApproval.customerNameCol',
          'pw.roRequestApproval.requestDateCol',
          'pw.roRequestApproval.requestTimeCol',
          'pw.roRequestApproval.cashierNameCol',
          'pw.roRequestApproval.customerMobileNumberCol',
          'pw.roRequestApproval.amountCol',
          'pw.roRequestApproval.requestReasonCol',
          'pw.roRequestApproval.remarksCol',
          'pw.grnRequestApproval.remarksValidationLabel'
        ])
        .pipe(takeUntil(this.destroy$))
        .subscribe((translatedMessages: any) => {
          this.rowData = this.pendingRequests;
          this.remarksValidationLabel =
            translatedMessages['pw.grnRequestApproval.remarksValidationLabel'];
          this.reqColumnDefs = [
            {
              headerCheckboxSelection: true,
              checkboxSelection: true,
              minWidth: 40,
              width: 40,
              pinned: 'left',
              lockPinned: true
            },
            {
              field: 'locationCode',
              suppressMovable: true,
              resizable: true,
              width: 100,
              minWidth: 100,
              headerName:
                translatedMessages['pw.roRequestApproval.locationCodeCol']
            },
            {
              field: 'reqNo',
              suppressMovable: true,
              resizable: true,
              width: 100,
              minWidth: 100,
              headerName:
                translatedMessages['pw.roRequestApproval.requestNumberCol'],
              type: 'numericColumn',
              cellClass: 'pw-justify-content-end'
            },
            {
              field: 'fiscalYear',
              suppressMovable: true,
              resizable: true,
              width: 100,
              minWidth: 100,
              headerName:
                translatedMessages['pw.roRequestApproval.fiscalYearCol'],
              type: 'numericColumn',
              cellClass: 'pw-justify-content-end'
            },
            {
              field: 'customerName',
              suppressMovable: true,
              resizable: true,
              width: 100,
              minWidth: 100,
              headerName:
                translatedMessages['pw.roRequestApproval.customerNameCol']
            },
            {
              field: 'customerMobileNumber',
              cellStyle: { 'white-space': 'normal' },
              suppressMovable: true,
              resizable: true,
              width: 100,
              minWidth: 100,
              headerName:
                translatedMessages[
                  'pw.roRequestApproval.customerMobileNumberCol'
                ]
            },
            {
              field: 'requestedDate',
              suppressMovable: true,
              width: 100,
              minWidth: 100,
              resizable: true,
              headerName:
                translatedMessages['pw.roRequestApproval.requestDateCol'],
              valueFormatter: params => {
                return this.dateFormatterService.format(params.value);
              }
            },
            {
              field: 'requestTime',
              suppressMovable: true,
              resizable: true,
              width: 100,
              minWidth: 100,
              headerName:
                translatedMessages['pw.roRequestApproval.requestTimeCol']
            },
            {
              field: 'cashierId',
              suppressMovable: true,
              resizable: true,
              width: 100,
              minWidth: 100,
              headerName:
                translatedMessages['pw.roRequestApproval.cashierNameCol']
            },

            {
              field: 'amount',
              isAmount: true,
              suppressMovable: true,
              width: 100,
              minWidth: 100,
              resizable: true,
              headerName:
                translatedMessages['pw.roRequestApproval.amountCol'] +
                ' (' +
                this.currencySymbolService.get(this.defaultCurrencyCode) +
                ')',
              type: 'numericColumn',
              cellClass: 'pw-justify-content-end',
              valueFormatter: params => {
                return this.currencyFormatterService.format(
                  params.value,
                  this.defaultCurrencyCode,
                  false
                );
              }
            },
            {
              field: 'requestorReason',
              suppressMovable: true,
              resizable: true,
              width: 100,
              minWidth: 100,
              headerName:
                translatedMessages['pw.roRequestApproval.requestReasonCol']
            },
            {
              field: 'remarks',
              suppressMovable: true,
              resizable: true,
              headerName: translatedMessages['pw.roRequestApproval.remarksCol'],

              cellRendererFramework: EditItemComponent,
              onCellClicked: this.openRemarksPopup.bind(this),
              width: 300,
              valueFormatter: params => {
                return params.value;
              }
            }
          ];
        });
    } else if (!this.isEposs) {
      this.translate
        .get([
          'pw.roRequestApproval.requestNumberCol',
          'pw.roRequestApproval.fiscalYearCol',
          'pw.roRequestApproval.customerNameCol',
          'pw.roRequestApproval.customerMobileNumberCol',
          'pw.roRequestApproval.requestDateCol',
          'pw.roRequestApproval.requestTimeCol',
          'pw.roRequestApproval.cashierNameCol',
          'pw.roRequestApproval.amountCol',
          'pw.roRequestApproval.requestReasonCol',
          'pw.roRequestApproval.remarks',
          'pw.roRequestApproval.status',
          'pw.roRequestApproval.approvedBy'
        ])
        .pipe(takeUntil(this.destroy$))
        .subscribe((translatedMessages: any) => {
          this.rowData = this.requestsListPoss;
          this.reqColumnDefs = [
            {
              field: 'reqNo',
              suppressMovable: true,
              resizable: true,
              width: 100,
              minWidth: 100,
              headerName:
                translatedMessages['pw.roRequestApproval.requestNumberCol'],
              type: 'numericColumn',
              cellClass: 'pw-justify-content-end'
            },
            {
              field: 'fiscalYear',
              suppressMovable: true,
              resizable: true,
              width: 100,
              minWidth: 100,
              headerName:
                translatedMessages['pw.roRequestApproval.fiscalYearCol'],
              type: 'numericColumn',
              cellClass: 'pw-justify-content-end'
            },
            {
              field: 'customerName',
              suppressMovable: true,
              resizable: true,
              width: 100,
              minWidth: 100,
              headerName:
                translatedMessages['pw.roRequestApproval.customerNameCol']
            },
            {
              field: 'customerMobileNumber',
              cellStyle: { 'white-space': 'normal' },
              suppressMovable: true,
              width: 100,
              minWidth: 100,
              resizable: true,
              headerName:
                translatedMessages[
                  'pw.roRequestApproval.customerMobileNumberCol'
                ]
            },
            {
              field: 'requestedDate',
              suppressMovable: true,
              width: 100,
              minWidth: 100,
              resizable: true,
              headerName:
                translatedMessages['pw.roRequestApproval.requestDateCol'],
              valueFormatter: params => {
                return this.dateFormatterService.format(params.value);
              }
            },
            {
              field: 'requestTime',
              suppressMovable: true,
              resizable: true,
              width: 100,
              minWidth: 100,
              headerName:
                translatedMessages['pw.roRequestApproval.requestTimeCol']
            },
            {
              field: 'cashierName',
              suppressMovable: true,
              width: 100,
              minWidth: 100,
              resizable: true,
              headerName:
                translatedMessages['pw.roRequestApproval.cashierNameCol']
            },

            {
              field: 'amount',
              isAmount: true,
              suppressMovable: true,
              width: 100,
              minWidth: 100,
              resizable: true,
              headerName:
                translatedMessages['pw.roRequestApproval.amountCol'] +
                ' (' +
                this.currencySymbolService.get(this.defaultCurrencyCode) +
                ')',
              type: 'numericColumn',
              cellClass: 'pw-justify-content-end',
              valueFormatter: params => {
                return this.currencyFormatterService.format(
                  params.value,
                  this.defaultCurrencyCode,
                  false
                );
              }
            },
            {
              field: 'requestorReason',
              suppressMovable: true,
              width: 100,
              minWidth: 100,
              resizable: true,
              headerName:
                translatedMessages['pw.roRequestApproval.requestReasonCol']
            },

            {
              field: 'status',
              suppressMovable: true,
              minWidth: 100,
              resizable: true,
              headerName: translatedMessages['pw.roRequestApproval.status'],
              cellStyle: params => {
                if (
                  params.data.status === roRequestEnum.approved ||
                  params.data.status === roRequestEnum.closed
                ) {
                  return { color: 'green' };
                }
                if (params.data.status === roRequestEnum.pending) {
                  return { color: 'orange' };
                }
                if (params.data.status === roRequestEnum.rejected) {
                  return { color: 'red' };
                }
              },
              editable: false,
              singleClickEdit: true,
              width: 300,
              valueFormatter: params => {
                return params.value;
              }
            }
          ];
        });
    }
  }

  createHistoryTable() {
    if (this.isHistory && this.isApproved) {
      this.translate
        .get([
          'pw.roRequestApproval.locationCodeCol',
          'pw.roRequestApproval.requestNumberCol',
          'pw.roRequestApproval.fiscalYearCol',
          'pw.roRequestApproval.customerNameCol',
          'pw.roRequestApproval.requestDateCol',
          'pw.roRequestApproval.approvedDate',
          'pw.roRequestApproval.cashierNameCol',
          'pw.roRequestApproval.amountCol',
          'pw.roRequestApproval.requestReasonCol',
          'pw.roRequestApproval.approvedBy',
          'pw.roRequestApproval.approvedReason',
          'pw.roRequestApproval.status'
        ])
        .pipe(takeUntil(this.destroy$))
        .subscribe((translatedMessages: any) => {
          this.histroyColumnDefs = [
            {
              field: 'locationCode',
              suppressMovable: true,
              resizable: true,
              headerName:
                translatedMessages['pw.roRequestApproval.locationCodeCol']
            },
            {
              field: 'reqNo',
              suppressMovable: true,
              resizable: true,
              headerName:
                translatedMessages['pw.roRequestApproval.requestNumberCol'],
              type: 'numericColumn',
              cellClass: 'pw-justify-content-end'
            },
            {
              field: 'fiscalYear',
              suppressMovable: true,
              resizable: true,
              headerName:
                translatedMessages['pw.roRequestApproval.fiscalYearCol'],
              type: 'numericColumn',
              cellClass: 'pw-justify-content-end'
            },
            {
              field: 'customerName',
              suppressMovable: true,
              resizable: true,
              headerName:
                translatedMessages['pw.roRequestApproval.customerNameCol']
            },
            {
              field: 'customerMobileNumber',
              suppressMovable: true,
              resizable: true,
              headerName:
                translatedMessages[
                  'pw.roRequestApproval.customerMobileNumberCol'
                ]
            },
            {
              field: 'requestedDate',
              suppressMovable: true,
              resizable: true,
              headerName:
                translatedMessages['pw.roRequestApproval.requestDateCol'],
              valueFormatter: params => {
                return this.dateFormatterService.format(params.value);
              }
            },
            {
              field: 'approvedDate',
              suppressMovable: true,
              resizable: true,
              headerName:
                translatedMessages['pw.roRequestApproval.approvedDate'],
              valueFormatter: params => {
                return this.dateFormatterService.format(params.value);
              }
            },
            {
              field: 'cashierName',
              suppressMovable: true,
              resizable: true,
              headerName:
                translatedMessages['pw.roRequestApproval.cashierNameCol']
            },

            {
              field: 'amount',
              isAmount: true,
              suppressMovable: true,
              resizable: true,
              headerName:
                translatedMessages['pw.roRequestApproval.amountCol'] +
                ' (' +
                this.currencySymbolService.get(this.defaultCurrencyCode) +
                ')',
              type: 'numericColumn',
              cellClass: 'pw-justify-content-end',

              valueFormatter: params => {
                return this.currencyFormatterService.format(
                  params.value,
                  this.defaultCurrencyCode,
                  false
                );
              }
            },
            {
              field: 'requestorReason',
              suppressMovable: true,
              resizable: true,
              headerName:
                translatedMessages['pw.roRequestApproval.requestReasonCol']
            },
            {
              field: 'approvedBy',
              suppressMovable: true,
              resizable: true,
              headerName: translatedMessages['pw.roRequestApproval.approvedBy'],
              width: 300
            },

            {
              field: 'approvalStatus',
              suppressMovable: true,
              resizable: true,
              headerName: translatedMessages['pw.roRequestApproval.status'],
              cellStyle: params => {
                if (params.data.approvalStatus === roRequestEnum.approved) {
                  return { color: 'green' };
                }

                if (params.data.approvalStatus === roRequestEnum.rejected) {
                  return { color: 'red' };
                }
              },
              editable: false,
              singleClickEdit: true,
              width: 300,
              valueFormatter: params => {
                return params.value;
              }
            },
            {
              field: 'remarks',
              suppressMovable: true,
              resizable: true,
              headerName:
                translatedMessages['pw.roRequestApproval.approvedReason'],
              width: 300,

              cellStyle: params => {
                return { color: '#b0a16e' };
              },
              cellRenderer: params => {
                return `<h5>...</5>`;
              },

              onCellClicked: this.openRemarksPopup.bind(this)
            }
          ];
        });
    } else {
      this.translate
        .get([
          'pw.roRequestApproval.locationCodeCol',
          'pw.roRequestApproval.requestNumberCol',
          'pw.roRequestApproval.fiscalYearCol',
          'pw.roRequestApproval.customerNameCol',
          'pw.roRequestApproval.requestDateCol',
          'pw.roRequestApproval.rejectedDate',
          'pw.roRequestApproval.cashierNameCol',
          'pw.roRequestApproval.customerMobileNumberCol',
          'pw.roRequestApproval.amountCol',
          'pw.roRequestApproval.requestReasonCol',
          'pw.roRequestApproval.rejectedBy',
          'pw.roRequestApproval.rejectedReason',
          'pw.rqRequestApproval.status',
          'pw.roRequestApproval.approvedBy',
          'pw.roRequestApproval.approvedReason'
        ])
        .pipe(takeUntil(this.destroy$))
        .subscribe((translatedMessages: any) => {
          this.histroyColumnDefs = [
            {
              field: 'locationCode',
              suppressMovable: true,
              resizable: true,
              headerName:
                translatedMessages['pw.roRequestApproval.locationCodeCol']
            },
            {
              field: 'reqNo',
              suppressMovable: true,
              resizable: true,
              headerName:
                translatedMessages['pw.roRequestApproval.requestNumberCol'],
              type: 'numericColumn',
              cellClass: 'pw-justify-content-end'
            },
            {
              field: 'fiscalYear',
              suppressMovable: true,
              resizable: true,
              headerName:
                translatedMessages['pw.roRequestApproval.fiscalYearCol'],
              type: 'numericColumn',
              cellClass: 'pw-justify-content-end'
            },
            {
              field: 'customerName',
              suppressMovable: true,
              resizable: true,
              headerName:
                translatedMessages['pw.roRequestApproval.customerNameCol']
            },
            {
              field: 'customerMobileNumber',
              suppressMovable: true,
              resizable: true,
              headerName:
                translatedMessages[
                  'pw.roRequestApproval.customerMobileNumberCol'
                ]
            },
            {
              field: 'requestedDate',
              suppressMovable: true,
              resizable: true,
              headerName:
                translatedMessages['pw.roRequestApproval.requestDateCol'],
              valueFormatter: params => {
                return this.dateFormatterService.format(params.value);
              }
            },
            {
              field: 'approvedDate',
              suppressMovable: true,
              resizable: true,
              headerName:
                this.closedRequests?.length > 0
                  ? 'Utilised Date'
                  : translatedMessages['pw.roRequestApproval.rejectedDate'],
              valueFormatter: params => {
                return this.dateFormatterService.format(params.value);
              }
            },
            {
              field: 'cashierName',
              suppressMovable: true,
              resizable: true,
              headerName:
                translatedMessages['pw.roRequestApproval.cashierNameCol']
            },

            {
              field: 'amount',
              isAmount: true,
              suppressMovable: true,
              resizable: true,
              headerName:
                translatedMessages['pw.roRequestApproval.amountCol'] +
                ' (' +
                this.currencySymbolService.get(this.defaultCurrencyCode) +
                ')',
              type: 'numericColumn',
              cellClass: 'pw-justify-content-end',

              valueFormatter: params => {
                return this.currencyFormatterService.format(
                  params.value,
                  this.defaultCurrencyCode,
                  false
                );
              }
            },
            {
              field: 'requestorReason',
              suppressMovable: true,
              resizable: true,
              headerName:
                translatedMessages['pw.roRequestApproval.requestReasonCol']
            },
            {
              field: 'approvedBy',
              suppressMovable: true,
              resizable: true,
              headerName:
                this.closedRequests?.length > 0
                  ? translatedMessages['pw.roRequestApproval.approvedBy']
                  : translatedMessages['pw.roRequestApproval.rejectedBy'],

              width: 300
            },

            {
              field: 'approvalStatus',
              suppressMovable: true,
              resizable: true,
              headerName: translatedMessages['pw.roRequestApproval.status'],
              cellStyle: params => {
                if (
                  params.data.approvalStatus === roRequestEnum.approved ||
                  params.data.approvalStatus === roRequestEnum.closed
                ) {
                  return { color: 'green' };
                }

                if (params.data.approvalStatus === roRequestEnum.rejected) {
                  return { color: 'red' };
                }
              },
              editable: false,
              singleClickEdit: true,
              width: 300,
              valueFormatter: params => {
                return params.value;
              }
            },
            {
              field: 'remarks',
              suppressMovable: true,
              resizable: true,
              headerName:
                this.closedRequests?.length > 0
                  ? translatedMessages['pw.roRequestApproval.approvedReason']
                  : translatedMessages['pw.roRequestApproval.rejectedReason'],

              width: 300,

              cellStyle: params => {
                return { color: '#b0a16e' };
              },
              cellRenderer: params => {
                return `<h5>...</5>`;
              },

              onCellClicked: this.openRemarksPopup.bind(this)
            }
          ];
        });
    }
  }

  reject() {
    this.checkRemarksValidation();
    if (this.hasRemarks) {
      this.saveStatus.emit(this.prepareResponse(false));
    } else {
      this.openPopUp(this.remarksValidationLabel);
    }
  }
  openPopUp(errorMessage) {
    this.alertPopupService.open({
      type: AlertPopupTypeEnum.ERROR,
      message: errorMessage
    });
  }
  prepareResponse(approved) {
    let saveRoRequestApproval: SaveRoRequestApproval;
    const bulkApproverRequestObjectDto = [];
    this.reqGridApi.getSelectedNodes().forEach(rowData => {
      bulkApproverRequestObjectDto.push({
        approverRemarks: rowData?.data?.remarks,
        approved: approved,
        taskId: rowData?.data?.taskId,
        processId: rowData?.data.processId,
        taskName: rowData?.data?.taskName
      });
    });
    saveRoRequestApproval = {
      bulkApproverRequestObjectDto: bulkApproverRequestObjectDto
    };
    return saveRoRequestApproval;
  }
  accept() {
    this.saveStatus.emit(this.prepareResponse(true));
  }

  checkRemarksValidation() {
    if (
      this.reqGridApi
        .getSelectedNodes()
        .filter(
          rowNode =>
            rowNode?.data?.remarks === '' ||
            rowNode?.data?.remarks === null ||
            rowNode?.data?.remarks === undefined
        ).length
    ) {
      this.hasRemarks = false;
    } else {
      this.hasRemarks = true;
    }
  }
  getMinPageSize(): number {
    return this.pageSizeOptions.reduce(
      (a: number, b: number) => (a < b ? a : b),
      Number.MAX_SAFE_INTEGER
    );
  }

  requestGridReady(params: GridReadyEvent) {
    this.reqGridApi = params.api;
    this.histroyGridApi = params.api;
  }

  onGridSizeChanged() {
    if (window.innerWidth >= 991) {
      this.reqGridApi.sizeColumnsToFit();
    }
  }

  sortChanged(params) {
    const sortState = this.reqGridApi.getSortModel();
    if (sortState.length === 0) {
      this.sort.emit();
    } else {
      for (let i = 0; i < sortState.length; i++) {
        const item = sortState[i];
        item.sort = item.sort[0].toUpperCase() + item.sort.slice(1);
        this.sort.emit(item);
      }
    }
  }

  openRemarksPopup(params) {
    const dialog = this.dialog.open(RemarkDialogComponent, {
      data: {
        value: params.value,
        readOnly:
          this.isEposs === true && this.isHistory === true ? true : false
      },
      disableClose: true,
      width: '500px'
    });
    if (this.isEposs === true && this.isHistory === false) {
      dialog
        .afterClosed()
        .pipe(takeUntil(this.destroy$))
        .subscribe(res => {
          if (params.rowIndex !== null) {
            const rowNode = this.reqGridApi.getRowNode(params.rowIndex);

            rowNode.data.remarks = res.data;
            const res1 = this.reqGridApi.applyTransaction({
              update: [rowNode.data]
            });
            this.reqGridApi.redrawRows({
              rowNodes: res1.update
            });
          }
        });
    }
  }
  // paginate() {
  //   this.paginator.emit({
  //     pageIndex: this.pageIndex
  //   });
  // }
  onSelectionChanged(event) {
    if (this.reqGridApi.getSelectedNodes().length) {
      this.disable = false;
    } else {
      this.disable = true;
    }
  }

  // cancel() {
  //   this.reqGridApi.deselectAll();
  // }

  onCellFocused(event) {
    if (event.column) {
      this.isFocusing = true;
      this.focusedHeaderName = event.column.colDef.headerName;
      this.currentRowIndex = Number(event.rowIndex);
      this.currentRowField = event.column.colDef.field;
      const node = this.reqGridApi.getDisplayedRowAtIndex(this.currentRowIndex);
      this.currentRowInfo = this.reqGridApi.getValue(
        this.currentRowField,
        node
      );
      if (this.currentRowField === 'amount')
        this.currentRowInfo = this.currencyFormatterService.format(
          this.currentRowInfo,
          this.defaultCurrencyCode,
          false
        );
      if (this.currentRowField === 'requestedDate')
        this.currentRowInfo = this.dateFormatterService.format(
          this.currentRowInfo
        );
    } else {
      this.isFocusing = false;
    }
  }

  focusOut(event) {
    this.isFocusing = false;
  }

  ngOnDestroy() {
    this.isFocusing = false;
    this.destroy$.next();
    this.destroy$.complete();
  }
}
