import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
  Inject,
  ChangeDetectorRef,
  SimpleChanges,
  OnChanges,
} from '@angular/core';
import { Subject } from 'rxjs';
import {
  SaveCnApproval,
  tepApprovalListResponse,
  AlertPopupTypeEnum,
  AlertPopupServiceAbstraction
} from '@poss-web/shared/models';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { POSS_WEB_CURRENCY_CODE } from '@poss-web/shared/util-config';
import { TranslateService } from '@ngx-translate/core';
import { TepRemarksPopupComponent } from '../tep-remarks-popup/tep-remarks-popup.component';
import {
  DateFormatterService,
  CurrencyFormatterService
} from '@poss-web/shared/components/ui-formatters';
import { MatDialog } from '@angular/material/dialog';
import { takeUntil } from 'rxjs/operators';
import { PageEvent } from '@angular/material/paginator';
import * as moment from 'moment';
@Component({
  selector: 'poss-web-tep-approval-list-items',
  templateUrl: './tep-approval-list-items.component.html',
  styleUrls: ['./tep-approval-list-items.component.scss']
})
export class TepApprovalListItemsComponent
  implements OnInit, OnDestroy, OnChanges {
  @Input() tepRequestList: tepApprovalListResponse[];
  @Input() disableButton: boolean;
  @Input() pageIndex: number;
  @Input() requestType: string;

  @Input() count = 0;

  @Input() pageSizeOptions: number[];
  @Input() minPageSize = 0;
  @Input() pageEvent: PageEvent;
  @Input() pageSize = 10;
  @Output() cellClicked = new EventEmitter<tepApprovalListResponse>();
  @Output() paginator = new EventEmitter<PageEvent>();
  @Output() saveStatus = new EventEmitter<SaveCnApproval>();

  destroy$ = new Subject();
  columnDefs = [];
  domLayout = 'autoHeight';
  rowHeight = '100';
  animateRows = true;
  rowSelection = 'single';
  gridApi: GridApi;
  disable = true;
  rowData: any[] = [];
  defaultColDef = {
    flex: 1,

    suppressMovable: true,
    resizable: true
  };
  hasRemarks: boolean;
  editErrorLabelText: string;
  totalElements: number;
  totalPages: number;
  rejectValidationLabel: string;
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
  ) {
    this.translate
      .get([
        'pw.regularTepApproval.LocationCodeFieldName',
        'pw.regularTepApproval.LocationCodeHeaderName',
        'pw.regularTepApproval.requestNoFieldName',
        'pw.regularTepApproval.requestNoHeaderName',
        'pw.regularTepApproval.requestDateFieldName',
        'pw.regularTepApproval.requestDateHeaderName',
        'pw.regularTepApproval.customerNameFieldName',
        'pw.regularTepApproval.customerNameHeaderName',
        'pw.regularTepApproval.fiscalYearFieldName',
        'pw.regularTepApproval.fiscalYearHeaderName',
        'pw.regularTepApproval.variantCodeFieldName',
        'pw.regularTepApproval.variantCodeHeaderName',
        'pw.regularTepApproval.standardWeightFieldName',
        'pw.regularTepApproval.standardWeightHeaderName',
        'pw.regularTepApproval.grossWeigthFieldName',
        'pw.regularTepApproval.grossWeightHeaderName',
        'pw.regularTepApproval.totalExchnageValueFieldName',
        'pw.regularTepApproval.totalExchageValueHeaderName',
        'pw.regularTepApproval.viewCMFieldName',
        'pw.regularTepApproval.viewCMHeaderName',
        'pw.regularTepApproval.addStoneDetailsFieldName',
        'pw.regularTepApproval.addStoneDetailsHeaderName',
        'pw.stone.addStoneDeatilsAlert'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.columnDefs = [
          {
            checkboxSelection: true,
            minWidth: 40,
            width: 40,
            pinned: 'left',
            lockPinned: true
          },
          {
            headerName:
              translatedMessages[
                'pw.regularTepApproval.LocationCodeHeaderName'
              ],
            field:
              translatedMessages['pw.regularTepApproval.LocationCodeFieldName']
          },

          {
            headerName:
              translatedMessages['pw.regularTepApproval.requestNoHeaderName'],
            field:
              translatedMessages['pw.regularTepApproval.requestNoFieldName'],
            suppressMovable: true
          },
          {
            headerName:
              translatedMessages['pw.regularTepApproval.requestDateHeaderName'],
            field:
              translatedMessages['pw.regularTepApproval.requestDateFieldName'],
            resizable: true,
            valueFormatter: params => {
              return this.dateFormatterService.format(moment(params.value));
            }
          },
          {
            headerName:
              translatedMessages[
                'pw.regularTepApproval.customerNameHeaderName'
              ],
            field:
              translatedMessages['pw.regularTepApproval.customerNameFieldName']
          },
          {
            headerName:
              translatedMessages['pw.regularTepApproval.fiscalYearHeaderName'],
            field:
              translatedMessages['pw.regularTepApproval.fiscalYearFieldName']
          },

          {
            headerName:
              translatedMessages['pw.regularTepApproval.variantCodeHeaderName'],
            field:
              translatedMessages['pw.regularTepApproval.variantCodeFieldName']
          },
          {
            headerName:
              translatedMessages[
                'pw.regularTepApproval.standardWeightHeaderName'
              ],
            field:
              translatedMessages[
                'pw.regularTepApproval.standardWeightFieldName'
              ]
          },
          {
            headerName:
              translatedMessages[
                'pw.regularTepApproval.totalExchageValueHeaderName'
              ],
            field:
              translatedMessages[
                'pw.regularTepApproval.totalExchnageValueFieldName'
              ],

            valueFormatter: params => {
              return this.currencyFormatterService.format(
                params.value,
                this.defaultCurrencyCode,
                false
              );
            }
          },
          {
            headerName:
              translatedMessages['pw.regularTepApproval.viewCMHeaderName'],
            field: translatedMessages['pw.regularTepApproval.viewCMFieldName'],
            cellRenderer: params => `<a class="pw-anchor-underline">View</a>`
          },

          {
            headerName:
              translatedMessages[
                'pw.regularTepApproval.LocationCodeHeaderName'
              ],
            field:
              translatedMessages['pw.regularTepApproval.LocationCodeFieldName']
          },

          {
            headerName:
              translatedMessages[
                'pw.regularTepApproval.addStoneDetailsFieldName'
              ],
            field:
              translatedMessages[
                'pw.regularTepApproval.addStoneDetailsHeaderName'
              ],
            autoHeight: true,
            cellRenderer: params =>
              `<div class="col-auto"><button class="pw-btn pw-primary-btn">EDIT</button></div>`


          }
        ];
      });
  }

  ngOnInit(): void {
    this.totalPages = 1;

  }

  addRowData() {
    if (this.tepRequestList.length) {
      for (const data of this.tepRequestList) {
        this.rowData.push({
          locationCode: data.locationCode,
          cnNumber: data.cnNumber,
          fiscalYear: data.fiscalYear,
          approvedData: data.approvedData ? data.approvedData : null,

          requestNo: data.requestNo,
          requestDate: data.requestDate,
          customerName: data.customerName,
          variantCode: data.variantCode,
          standardWt: data.standardWt,
          grossWt: data.grossWt,
          amount: data.amount,

          taskId: data.taskId,
          taskName: data.taskName,
          processId: data.processId
        });
      }
    } else {
      this.rowData = [];
    }
  }
  gridReady(gridRedayEvent: GridReadyEvent) {
    this.gridApi = gridRedayEvent.api;
    this.gridApi.setColumnDefs(this.columnDefs);

    this.gridApi.setRowData(this.rowData);
  }

  onSelectionChanged(event) {
    if (this.gridApi.getSelectedNodes().length) {
      this.disable = false;
    } else {
      this.disable = true;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.cdr.markForCheck();

    if (changes['tepRequestList']) {
      this.rowData = [];
      this.addRowData();
      this.disable = true;

    }
  }

  openPopUp(errorMessage) {
    this.alertPopupService.open({
      type: AlertPopupTypeEnum.ERROR,
      message: errorMessage
    });

  }
  prepareResponse(approved, remarks) {
    let saveCnApproval: SaveCnApproval;
    const bulkApproverRequestObjectDto = [];
    this.gridApi.getSelectedNodes().forEach(rowData => {
      bulkApproverRequestObjectDto.push({
        approverRemarks: remarks,
        taskName: rowData?.data?.taskName,
        processId: rowData?.data?.processId,
        taskId: rowData?.data?.taskId,
        approved: approved,
        approvedData: rowData?.data?.approvedData
      });
    });
    saveCnApproval = {
      bulkApproverRequestObjectDto: bulkApproverRequestObjectDto
    };

    return saveCnApproval;
  }
  remarks(value: boolean) {
    const dialogRef = this.dialog.open(TepRemarksPopupComponent, {
      width: '400px',
      data: value
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.saveStatus.emit(this.prepareResponse(!value, data.remarks));
        }
      });
  }

  onCellClicked(clickEvent) {
    if (clickEvent.colDef.headerName === 'Add Stone Details') {
      this.cellClicked.emit(clickEvent.data);
    }
  }

  cancel() {
    this.gridApi.deselectAll();
  }

  onCellFocused(event) {
    this.isFocusing = true;
    this.focusedHeaderName = event.column.colDef.headerName;
    this.currentRowIndex = Number(event.rowIndex);
    this.currentRowField = event.column.colDef.field;
    var node = this.gridApi.getDisplayedRowAtIndex(this.currentRowIndex);
    this.currentRowInfo = this.gridApi.getValue(this.currentRowField, node);
    if (this.currentRowInfo === 'requestDate')
      this.currentRowInfo = this.dateFormatterService.format(moment(this.currentRowInfo));
    if (this.currentRowInfo === 'amount')
      this.currentRowInfo = this.currencyFormatterService.format(this.currentRowInfo, this.defaultCurrencyCode, false)
  }

  focusOut(event) {
    this.isFocusing = false;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
