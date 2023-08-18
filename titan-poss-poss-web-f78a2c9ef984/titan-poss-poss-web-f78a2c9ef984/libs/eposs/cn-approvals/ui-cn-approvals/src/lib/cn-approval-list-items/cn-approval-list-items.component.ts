import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { EditItemComponent } from '@poss-web/shared/components/ui-ag-grid';
import {
  CurrencyFormatterService,
  DateFormatterService
} from '@poss-web/shared/components/ui-formatters';
import {
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  CnApprovalListResponse,
  cnApprovalsEnum,
  CnRequestApprovalRowData,
  SaveCnApproval
} from '@poss-web/shared/models';
import { RemarkDialogComponent } from '@poss-web/shared/ro-request-approvals/ui-ro-request-approvals-status';
import { POSS_WEB_CURRENCY_CODE } from '@poss-web/shared/util-config';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-cn-approval-list-items',
  templateUrl: './cn-approval-list-items.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CnApprovalListItemsComponent
  implements OnInit, OnDestroy, OnChanges {
  @Input() cnRequestList: CnApprovalListResponse[];
  @Input() disableButton: boolean;
  @Input() pageEvent: number;
  @Input() pageSizeOptions: number[];
  @Input() requestType: string;

  @Output() paginator = new EventEmitter<any>();
  @Output() saveStatus = new EventEmitter<SaveCnApproval>();

  destroy$ = new Subject();
  columnDefs = [];
  domLayout = 'autoHeight';
  rowHeight = '35';
  animateRows = true;
  rowSelection = 'multiple';
  gridApi: GridApi;
  disable: boolean;
  rowData: CnRequestApprovalRowData[] = [];

  hasRemarks: boolean;

  minPageSize;
  totalElements: number;
  totalPages: number;
  rejectValidationLabel: string;
  remarksValidationLabel: string;
  cnApprovalListItemsComponent: CnApprovalListItemsComponent = this;

  isFocusing = false;
  focusedHeaderName: string;
  currentRowIndex: number;
  currentRowField: string;
  currentRowInfo: string;

  constructor(
    private translate: TranslateService,
    private cdr: ChangeDetectorRef,
    private dateFormatterService: DateFormatterService,
    private dialog: MatDialog,
    private currencyFormatterService: CurrencyFormatterService,
    private alertPopupService: AlertPopupServiceAbstraction,
    @Inject(POSS_WEB_CURRENCY_CODE) public defaultCurrencyCode
  ) {}

  ngOnInit(): void {
    const pageSizeOptions = this.pageSizeOptions;
    this.minPageSize = pageSizeOptions.reduce((a: number, b: number) =>
      a < b ? a : b
    );
    this.addRowData();
    this.translate
      .get([
        'pw.cnRequestApproval.rejectValidationLabel',
        'pw.cnRequestApproval.remarksValidationLabel'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        (this.rejectValidationLabel =
          translatedMessages['pw.cnRequestApproval.rejectValidationLabel'])
          (this.remarksValidationLabel =
            translatedMessages['pw.cnRequestApproval.remarksValidationLabel']);
      });
  }

  cnActiivateRequestColumn() {
    this.translate
      .get([
        'pw.cnRequestApproval.locationCode',
        'pw.cnRequestApproval.cnNumber',
        'pw.cnRequestApproval.fiscalYear',
        'pw.cnRequestApproval.cnType',
        'pw.cnRequestApproval.cnDate',
        'pw.cnRequestApproval.customerName',
        'pw.cnRequestApproval.customerMobileNumber',
        'pw.cnRequestApproval.amount',
        'pw.cnRequestApproval.requestedBy',
        'pw.cnRequestApproval.requestedType',
        'pw.cnRequestApproval.suspendedDate',
        'pw.cnRequestApproval.requestorRemarks',
        'pw.cnRequestApproval.remarks'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.columnDefs = [
          {
            headerCheckboxSelection: true,
            checkboxSelection: true,
            width: 40,
            suppressMovable: true
          },
          {
            headerName: translatedMessages['pw.cnRequestApproval.locationCode'],
            headerComponentParams: '<a>CLICK HERE</a>',
            field: 'locationCode',
            width: 100,
            minWidth: 80,
            suppressMovable: true,
            resizable: true
          },

          {
            headerName: translatedMessages['pw.cnRequestApproval.cnNumber'],
            field: 'cnNumber',
            suppressMovable: true,
            resizable: true,
            width: 80,
            minWidth: 80,
            suppressSizeToFit: true
          },
          {
            headerName: translatedMessages['pw.cnRequestApproval.fiscalYear'],
            field: 'fiscalYear',
            resizable: true,
            width: 80,
            minWidth: 60,
            suppressMovable: true
          },
          {
            headerName: translatedMessages['pw.cnRequestApproval.cnType'],
            field: 'cnType',
            resizable: true,
            width: 100,
            minWidth: 80,
            suppressMovable: true
          },

          {
            headerName: translatedMessages['pw.cnRequestApproval.cnDate'],
            field: 'cnDate',
            resizable: true,
            valueFormatter: params => {
              return this.dateFormatterService.format(params.value);
            },
            width: 100,
            minWidth: 80,
            suppressMovable: true
          },
          {
            headerName: translatedMessages['pw.cnRequestApproval.customerName'],
            field: 'customerName',
            resizable: true,
            width: 100,
            minWidth: 80,
            suppressMovable: true
          },
          {
            headerName:
              translatedMessages['pw.cnRequestApproval.customerMobileNumber'],
            field: 'customerMobileNumber',
            resizable: true,
            width: 100,
            minWidth: 80,
            suppressMovable: true
          },
          {
            headerName: translatedMessages['pw.cnRequestApproval.amount'],
            field: 'amount',
            resizable: true,
            width: 80,
            minWidth: 80,
            valueFormatter: params => {
              return this.currencyFormatterService.format(
                params.value,
                this.defaultCurrencyCode,
                false
              );
            },
            suppressMovable: true
          },
          {
            headerName: translatedMessages['pw.cnRequestApproval.requestedBy'],
            field: 'requestedBy',
            resizable: true,
            width: 100,
            minWidth: 80,
            suppressMovable: true
          },

          {
            headerName:
              translatedMessages['pw.cnRequestApproval.requestedType'],
            field: 'requestedType',
            resizable: true,

            width: 100,
            minWidth: 80,
            suppressMovable: true
          },
          {
            headerName:
              translatedMessages['pw.cnRequestApproval.suspendedDate'],
            field: 'suspendedDate',
            resizable: true,
            width: 100,
            minWidth: 80,
            valueFormatter: params => {
              return this.dateFormatterService.format(params.value);
            },
            suppressMovable: true
          },
          {
            headerName:
              translatedMessages['pw.cnRequestApproval.requestorRemarks'],
            field: 'requestorRemarks',
            resizable: true,
            width: 100,
            minWidth: 80,
            suppressMovable: true
          },
          {
            headerName: translatedMessages['pw.cnRequestApproval.remarks'],
            field: 'remarks',
            resizable: true,
            cellRendererFramework: EditItemComponent,
            onCellClicked: this.openRemarksPopup.bind(this),
            width: 100,
            minWidth: 80,
            suppressMovable: true
          }
        ];
      });
    this.gridApi?.setColumnDefs(this.columnDefs);
  }
  cnCancelAndGoldRateRemovalColunns() {
    this.translate
      .get([
        'pw.cnRequestApproval.locationCode',
        'pw.cnRequestApproval.cnNumber',
        'pw.cnRequestApproval.fiscalYear',
        'pw.cnRequestApproval.cnType',
        'pw.cnRequestApproval.cnDate',
        'pw.cnRequestApproval.customerName',
        'pw.cnRequestApproval.customerMobileNumber',
        'pw.cnRequestApproval.amount',
        'pw.cnRequestApproval.requestedBy',
        'pw.cnRequestApproval.requestedType',
        'pw.cnRequestApproval.requestorRemarks',
        'pw.cnRequestApproval.remarks'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.columnDefs = [
          {
            headerCheckboxSelection: true,
            checkboxSelection: true,
            width: 40,
            suppressMovable: true
          },
          {
            headerName: translatedMessages['pw.cnRequestApproval.locationCode'],
            field: 'locationCode',
            width: 100,
            minWidth: 80,
            suppressMovable: true,
            resizable: true
          },

          {
            headerName: translatedMessages['pw.cnRequestApproval.cnNumber'],
            field: 'cnNumber',
            suppressMovable: true,
            resizable: true,
            width: 100,
            minWidth: 80,
            suppressSizeToFit: true
          },
          {
            headerName: translatedMessages['pw.cnRequestApproval.fiscalYear'],
            field: 'fiscalYear',
            resizable: true,
            width: 80,
            minWidth: 80,
            suppressMovable: true
          },
          {
            headerName: translatedMessages['pw.cnRequestApproval.cnType'],
            field: 'cnType',
            resizable: true,
            width: 100,
            minWidth: 80,
            suppressMovable: true
          },

          {
            headerName: translatedMessages['pw.cnRequestApproval.cnDate'],
            field: 'cnDate',
            resizable: true,
            valueFormatter: params => {
              return this.dateFormatterService.format(params.value);
            },
            width: 100,
            minWidth: 80,
            suppressMovable: true
          },
          {
            headerName: translatedMessages['pw.cnRequestApproval.customerName'],
            field: 'customerName',
            resizable: true,
            width: 100,
            minWidth: 80,
            suppressMovable: true
          },
          {
            headerName:
              translatedMessages['pw.cnRequestApproval.customerMobileNumber'],
            field: 'customerMobileNumber',
            resizable: true,
            width: 100,
            minWidth: 80,
            suppressMovable: true
          },
          {
            headerName: translatedMessages['pw.cnRequestApproval.amount'],
            field: 'amount',
            resizable: true,
            width: 100,
            minWidth: 80,
            suppressMovable: true
          },
          {
            headerName: translatedMessages['pw.cnRequestApproval.requestedBy'],
            field: 'requestedBy',
            resizable: true,
            width: 100,
            minWidth: 80,
            suppressMovable: true
          },

          {
            headerName:
              translatedMessages['pw.cnRequestApproval.requestedType'],
            field: 'requestedType',
            resizable: true,

            width: 100,
            minWidth: 80,
            suppressMovable: true
          },
          {
            headerName:
              translatedMessages['pw.cnRequestApproval.requestorRemarks'],
            field: 'requestorRemarks',
            resizable: true,
            width: 100,
            minWidth: 80,
            suppressMovable: true
          },
          {
            headerName: translatedMessages['pw.cnRequestApproval.remarks'],
            field: 'remarks',
            resizable: true,
            width: 100,
            minWidth: 80,
            cellRendererFramework: EditItemComponent,
            onCellClicked: this.openRemarksPopup.bind(this),
            suppressMovable: true
          }
        ];
      });
    this.gridApi?.setColumnDefs(this.columnDefs);
  }
  addRowData() {
    if (this.cnRequestList.length) {
      for (const data of this.cnRequestList) {
        this.rowData.push({
          locationCode: data.locationCode,
          cnNumber: data.cnNumber,
          fiscalYear: data.fiscalYear,

          cnType: data.cnType,
          cnDate: data.cnDate,
          customerName: data.customerName,
          customerMobileNumber: data.customerMobileNumber,
          amount: data.amount,
          requestedBy: data.requestedBy,
          requestedType: data.requestedType,
          suspendedDate: data.suspendedDate,
          requestorRemarks: data.requestorRemarks,
          remarks: data.remarks,
          taskId: data.taskId,
          taskName: data.taskName,
          processId: data.processId
        });
      }
    } else {
      this.rowData = [];
    }
  }
  openRemarksPopup(params) {
    const dialog = this.dialog.open(RemarkDialogComponent, {
      data: {
        value: params.value,
        readOnly: false
      },
      disableClose: true,
      width: '500px'
    });
    dialog
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (params.rowIndex !== null) {
          const rowNode = this.gridApi.getRowNode(params.rowIndex);

          rowNode.data.remarks = res.data ? res.data : '';
          const res1 = this.gridApi.applyTransaction({
            update: [rowNode.data]
          });
          this.gridApi.redrawRows({
            rowNodes: res1.update
          });
        }
        this.gridApi?.setFocusedCell(
          this.currentRowIndex,
          this.currentRowField
        );
      });
  }
  gridReady(gridRedayEvent: GridReadyEvent) {
    this.gridApi = gridRedayEvent.api;
    this.gridApi.setColumnDefs(this.columnDefs);

    this.gridApi.setRowData(this.rowData);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.cdr.markForCheck();
    this.rowData = [];

    if (this.requestType === cnApprovalsEnum.CREDIT_NOTE_ACTIVATE) {
      this.cnActiivateRequestColumn();
    } else {
      this.cnCancelAndGoldRateRemovalColunns();
    }
    this.disable = this.disableButton;
    if (changes['cnRequestList']) {
      this.rowData = [];
      this.addRowData();

      if (this.gridApi) {
        this.gridApi.setRowData(this.rowData);
      }
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
    let saveCnApproval: SaveCnApproval;
    const bulkApproverRequestObjectDto = [];
    this.gridApi.getSelectedNodes().forEach(rowData => {
      bulkApproverRequestObjectDto.push({
        approverRemarks: rowData?.data?.remarks,
        taskName: rowData?.data?.taskName,
        processId: rowData?.data?.processId,
        taskId: rowData?.data?.taskId,
        approved: approved
      });
    });
    saveCnApproval = {
      bulkApproverRequestObjectDto: bulkApproverRequestObjectDto
    };

    return saveCnApproval;
  }
  accept() {
    this.saveStatus.emit(this.prepareResponse(true));
  }

  checkRemarksValidation() {
    if (
      this.gridApi
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

  paginate(event) {
    this.paginator.emit(event);
  }
  onSelectionChanged(event) {
    if (this.gridApi.getSelectedNodes().length) {
      this.disable = false;
    } else {
      this.disable = true;
    }
  }

  cancel() {
    this.gridApi.deselectAll();
  }

  onCellFocused(event) {
    if (event.column) {
      this.isFocusing = true;
      this.focusedHeaderName = event.column.colDef.headerName;
      this.currentRowIndex = Number(event.rowIndex);
      this.currentRowField = event.column.colDef.field;

      this.currentRowInfo = this.rowData[this.currentRowIndex][
        this.currentRowField
      ];
      if (
        this.currentRowField === 'cnDate' ||
        this.currentRowField === 'suspendedDate'
      )
        this.currentRowInfo = this.dateFormatterService.format(
          this.currentRowInfo
        );
      if (this.currentRowField === 'amount')
        this.currentRowInfo = this.currencyFormatterService.format(
          this.currentRowInfo,
          this.defaultCurrencyCode,
          false
        );
    }
  }

  focusOut(event) {
    this.isFocusing = false;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
