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
  OnChanges
} from '@angular/core';
import { Subject } from 'rxjs';
import {
  SaveCnApproval,
  tepApprovalListResponse,
  AlertPopupTypeEnum,
  AlertPopupServiceAbstraction,
  GiftCardsGridEnum,
  OverlayNotificationType,
  OverlayNotificationServiceAbstraction
} from '@poss-web/shared/models';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { POSS_WEB_CURRENCY_CODE } from '@poss-web/shared/util-config';
import { TranslateService } from '@ngx-translate/core';
import { TepExceptionRemarkPopUpComponent } from '../tep-exception-remark-pop-up/tep-exception-remark-pop-up.component';
import {
  DateFormatterService,
  CurrencyFormatterService
} from '@poss-web/shared/components/ui-formatters';
import { MatDialog } from '@angular/material/dialog';
import { takeUntil } from 'rxjs/operators';
import { PageEvent } from '@angular/material/paginator';
import * as moment from 'moment';
import {
  EditItemComponent,
  InputValidatorComponent
} from '@poss-web/shared/components/ui-ag-grid';

@Component({
  selector: 'poss-web-tep-exception-list-items',
  templateUrl: './tep-exception-list-items.component.html',
  styleUrls: ['./tep-exception-list-items.component.scss']
})
export class TepExceptionListItemsComponent
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
  deductionValue: number;
  flatExchangeValue: number;
  totalPages: number;
  rejectValidationLabel: string;
  isFocusing = false;
  focusedHeaderName: string;
  currentRowIndex: number;
  currentRowField: string;
  currentRowInfo: string;
  translatedMessages: any;

  constructor(
    private translate: TranslateService,
    private cdr: ChangeDetectorRef,
    private dateFormatterService: DateFormatterService,
    private dialog: MatDialog,
    private overlayNotificationServiceAbstraction: OverlayNotificationServiceAbstraction,
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
        'pw.regularTepApproval.flatExchangeValueFieldName',
        'pw.regularTepApproval.flatExchangeValueHeaderName',
        'pw.regularTepApproval.deductionPercentFieldName',
        'pw.regularTepApproval.deductionPercentHeaderName',
        'pw.regularTepApproval.approvedByFieldName',
        'pw.regularTepApproval.approvedByHeaderName',
        'pw.regularTepApproval.customerMobileNoFieldName',
        'pw.regularTepApproval.customerMobileNoHeaderName',
        'pw.regularTepApproval.variantCodeFieldName',
        'pw.regularTepApproval.variantCodeHeaderName',
        'pw.regularTepApproval.standardWeightFieldName',
        'pw.regularTepApproval.standardWeightHeaderName',
        'pw.regularTepApproval.grossWeigthFieldName',
        'pw.regularTepApproval.grossWeightHeaderName',
        'pw.regularTepApproval.totalExchnageValueFieldName',
        'pw.regularTepApproval.totalExchageValueHeaderName',
        // 'pw.regularTepApproval.viewCMFieldName',
        // 'pw.regularTepApproval.viewCMHeaderName',
        //'pw.regularTepApproval.addStoneDetailsFieldName',
        'pw.regularTepApproval.editDetailsHeaderName'
        //'pw.stone.addStoneDeatilsAlert'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.translatedMessages = translatedMessages;
        // this.columnDefs = [
        //   {
        //     checkboxSelection: true,
        //     minWidth: 40,
        //     width: 40,
        //     pinned: 'left',
        //     lockPinned: true
        //   },
        //   {
        //     headerName:
        //       translatedMessages[
        //         'pw.regularTepApproval.LocationCodeHeaderName'
        //       ],
        //     field:
        //       translatedMessages['pw.regularTepApproval.LocationCodeFieldName']
        //   },

        //   {
        //     headerName:
        //       translatedMessages['pw.regularTepApproval.requestNoHeaderName'],
        //     field:
        //       translatedMessages['pw.regularTepApproval.requestNoFieldName'],
        //     suppressMovable: true
        //   },
        //   {
        //     headerName:
        //       translatedMessages['pw.regularTepApproval.requestDateHeaderName'],
        //     field:
        //       translatedMessages['pw.regularTepApproval.requestDateFieldName'],
        //     resizable: true,
        //     valueFormatter: params => {
        //       return this.dateFormatterService.format(moment(params.value));
        //     }
        //   },
        //   {
        //     headerName:
        //       translatedMessages[
        //         'pw.regularTepApproval.customerNameHeaderName'
        //       ],
        //     field:
        //       translatedMessages['pw.regularTepApproval.customerNameFieldName']
        //   },
        //    {
        //     headerName:
        //       translatedMessages['pw.regularTepApproval.customerMobileNoHeaderName'],
        //     field:
        //       translatedMessages['pw.regularTepApproval.customerMobileNoFieldName']
        //   },
        //   // {
        //   //   headerName:
        //   //     translatedMessages['pw.regularTepApproval.fiscalYearHeaderName'],
        //   //   field:
        //   //     translatedMessages['pw.regularTepApproval.fiscalYearFieldName']
        //   // },

        //   {
        //     headerName:
        //       translatedMessages['pw.regularTepApproval.variantCodeHeaderName'],
        //     field:
        //       translatedMessages['pw.regularTepApproval.variantCodeFieldName']
        //   },
        //   {
        //     headerName:
        //       translatedMessages[
        //         'pw.regularTepApproval.standardWeightHeaderName'
        //       ],
        //     field:
        //       translatedMessages[
        //         'pw.regularTepApproval.standardWeightFieldName'
        //       ]
        //   },
        //   {
        //     headerName:
        //       translatedMessages[
        //         'pw.regularTepApproval.flatExchangeValueHeaderName'
        //       ],
        //     field:
        //       translatedMessages[
        //         'pw.regularTepApproval.flatExchangeValueFieldName'
        //       ],
        //       editable: () => true,
        //       cellEditor: GiftCardsGridEnum.INPUT_VALIDATOR,
        //       singleClickEdit: true,
        //       cellRendererSelector: params => {
        //         return {
        //           component: GiftCardsGridEnum.EDIT_ITEM_COMPONENT
        //         };
        //       }
        //   },
        //   {
        //     headerName:
        //       translatedMessages[
        //         'pw.regularTepApproval.deductionPercentHeaderName'
        //       ],
        //     field:
        //       translatedMessages[
        //         'pw.regularTepApproval.deductionPercentFieldName'
        //       ]
        //   },
        //   {
        //     headerName:
        //       translatedMessages[
        //         'pw.regularTepApproval.approvedByHeaderName'
        //       ],
        //     field:
        //       translatedMessages[
        //         'pw.regularTepApproval.approvedByFieldName'
        //       ]
        //   },
        //   {
        //     headerName:
        //       translatedMessages[
        //         'pw.regularTepApproval.totalExchageValueHeaderName'
        //       ],
        //     field:
        //       translatedMessages[
        //         'pw.regularTepApproval.totalExchnageValueFieldName'
        //       ],

        //     valueFormatter: params => {
        //       return this.currencyFormatterService.format(
        //         params.value,
        //         this.defaultCurrencyCode,
        //         false
        //       );
        //     }
        //   },
        //   // {
        //   //   headerName:
        //   //     translatedMessages['pw.regularTepApproval.viewCMHeaderName'],
        //   //   field: translatedMessages['pw.regularTepApproval.viewCMFieldName'],
        //   //   cellRenderer: params => `<a class="pw-anchor-underline">View</a>`
        //   // },

        //   // {
        //   //   headerName:
        //   //     translatedMessages[
        //   //       'pw.regularTepApproval.editDetailsHeaderName'
        //   //     ],
        //   //   field:
        //   //     translatedMessages[
        //   //       'pw.regularTepApproval.editDetailsHeaderName'
        //   //     ],
        //   //   autoHeight: true,
        //   //   cellRenderer: params =>
        //   //     `<div class="col-auto"><button class="pw-btn pw-primary-btn">EDIT</button></div>`

        //   // }
        // ];
      });
  }

  ngOnInit(): void {
    this.columnDefs = [
      {
        checkboxSelection: true,
        minWidth: 40,
        width: 40,
        pinned: 'left',
        lockPinned: true
      },
      {
        headerName: this.translatedMessages[
          'pw.regularTepApproval.LocationCodeHeaderName'
        ],
        field: this.translatedMessages[
          'pw.regularTepApproval.LocationCodeFieldName'
        ]
      },

      {
        headerName: this.translatedMessages[
          'pw.regularTepApproval.requestNoHeaderName'
        ],
        field: this.translatedMessages[
          'pw.regularTepApproval.requestNoFieldName'
        ],
        suppressMovable: true
      },
      {
        headerName: this.translatedMessages[
          'pw.regularTepApproval.requestDateHeaderName'
        ],
        field: this.translatedMessages[
          'pw.regularTepApproval.requestDateFieldName'
        ],
        resizable: true,
        valueFormatter: params => {
          return this.dateFormatterService.format(moment(params.value));
        }
      },
      {
        headerName: this.translatedMessages[
          'pw.regularTepApproval.customerNameHeaderName'
        ],
        field: this.translatedMessages[
          'pw.regularTepApproval.customerNameFieldName'
        ]
      },
      {
        headerName: this.translatedMessages[
          'pw.regularTepApproval.customerMobileNoHeaderName'
        ],
        field: this.translatedMessages[
          'pw.regularTepApproval.customerMobileNoFieldName'
        ]
      },
      // {
      //   headerName:
      //     translatedMessages['pw.regularTepApproval.fiscalYearHeaderName'],
      //   field:
      //     translatedMessages['pw.regularTepApproval.fiscalYearFieldName']
      // },

      {
        headerName: this.translatedMessages[
          'pw.regularTepApproval.variantCodeHeaderName'
        ],
        field: this.translatedMessages[
          'pw.regularTepApproval.variantCodeFieldName'
        ]
      },
      {
        headerName: this.translatedMessages[
          'pw.regularTepApproval.standardWeightHeaderName'
        ],
        field: this.translatedMessages[
          'pw.regularTepApproval.standardWeightFieldName'
        ]
      },
      {
        headerName: this.translatedMessages[
          'pw.regularTepApproval.flatExchangeValueHeaderName'
        ],
        field: 'flatExchangeValue',
        editable: () => true,
        cellEditor: GiftCardsGridEnum.INPUT_VALIDATOR,
        singleClickEdit: true,
        cellRendererSelector: params => {
          return {
            component: GiftCardsGridEnum.EDIT_ITEM_COMPONENT
          };
        },
        valueFormatter: params => {
          if (params && params.value && params.value.isValid) {
            if (params && params.value && params.value.value) {
              return params.value.value;
            } else {
              return '';
            }
          } else {
            return '';
          }
        },
        cellClass: 'pw-fourth-color'
      },
      {
        headerName: this.translatedMessages[
          'pw.regularTepApproval.deductionPercentHeaderName'
        ],
        field: 'deductionPercent',
        editable: () => true,
        cellEditor: GiftCardsGridEnum.INPUT_VALIDATOR,
        singleClickEdit: true,
        cellRendererSelector: params => {
          return {
            component: GiftCardsGridEnum.EDIT_ITEM_COMPONENT
          };
        },
        valueFormatter: params => {
          if (params && params.value && params.value.isValid) {
            if (params && params.value && params.value.value) {
              return params.value.value;
            } else {
              return '';
            }
          } else {
            return '';
          }
        },
        cellClass: 'pw-fourth-color'
      },
      {
        headerName: this.translatedMessages[
          'pw.regularTepApproval.approvedByHeaderName'
        ],
        field: this.translatedMessages[
          'pw.regularTepApproval.approvedByFieldName'
        ]
      },
      {
        headerName: this.translatedMessages[
          'pw.regularTepApproval.totalExchageValueHeaderName'
        ],
        field: this.translatedMessages[
          'pw.regularTepApproval.totalExchnageValueFieldName'
        ],

        valueFormatter: params => {
          return this.currencyFormatterService.format(
            params.value,
            this.defaultCurrencyCode,
            false
          );
        }
      }
      // {
      //   headerName:
      //     translatedMessages['pw.regularTepApproval.viewCMHeaderName'],
      //   field: translatedMessages['pw.regularTepApproval.viewCMFieldName'],
      //   cellRenderer: params => `<a class="pw-anchor-underline">View</a>`
      // },

      // {
      //   headerName:
      //     translatedMessages[
      //       'pw.regularTepApproval.editDetailsHeaderName'
      //     ],
      //   field:
      //     translatedMessages[
      //       'pw.regularTepApproval.editDetailsHeaderName'
      //     ],
      //   autoHeight: true,
      //   cellRenderer: params =>
      //     `<div class="col-auto"><button class="pw-btn pw-primary-btn">EDIT</button></div>`

      // }
    ];
    this.totalPages = 1;
  }
  getComponents() {
    return {
      inputValidator: InputValidatorComponent,
      editItemComponent: EditItemComponent
    };
  }
  getContext() {
    return {
      validators: {},
      gridApi: this.gridApi
    };
  }

  addRowData() {
    if (this.tepRequestList.length) {
      for (const data of this.tepRequestList) {
        this.rowData.push({
          locationCode: data.locationCode,
          cnNumber: data.cnNumber,
          fiscalYear: data.fiscalYear,
          approvedData: data.tepExceptionDetails
            ? data.tepExceptionDetails
            : null,
          requestNo: data.requestNo,
          requestDate: data.requestDate,
          customerName: data.customerName,
          variantCode: data.variantCode,
          standardWt: data.standardWt,
          grossWt: data.grossWt,
          amount: data.amount,

          taskId: data.taskId,
          taskName: data.taskName,
          processId: data.processId,
          customerMobileNo: data.customerMobileNo,
          flatExchangeValue: data.tepExceptionDetails.data.flatExchangeValue,
          deductionPercent: data.tepExceptionDetails.data.deductionPercent,
          approvedBy: data.tepExceptionDetails.data.approvedBy,
          itemCode: data.tepExceptionDetails.data.itemCode,
          customerId: data.tepExceptionDetails.data.itemCode
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

  showAlertNotification(message: string): void {
    this.overlayNotificationServiceAbstraction
      .show({
        type: OverlayNotificationType.SIMPLE,
        hasClose: true,
        hasBackdrop: true,
        message
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe();
  }
  prepareResponse(approved, remarks) {
    let saveCnApproval: SaveCnApproval;
    const bulkApproverRequestObjectDto = [];
    this.gridApi.getSelectedNodes().forEach(rowData => {
      if (rowData?.data?.deductionPercent.value === '') {
        this.deductionValue = 0;
      } else if (rowData?.data?.deductionPercent.value) {
        this.deductionValue = Number(rowData?.data?.deductionPercent.value);
      }
      if (rowData?.data?.flatExchangeValue.value === '') {
        this.flatExchangeValue = 0;
      } else if (rowData?.data?.flatExchangeValue.value) {
        this.flatExchangeValue = Number(rowData?.data?.flatExchangeValue.value);
      }
      if (
        rowData?.data?.deductionPercent.value === '' &&
        rowData?.data?.flatExchangeValue.value === ''
      ) {
        this.showAlertNotification(
          'Please enter Flat Exchange or Deduction values'
        );
      } else {
        bulkApproverRequestObjectDto.push({
          approverRemarks: remarks,
          taskName: rowData?.data?.taskName,
          processId: rowData?.data?.processId,
          taskId: rowData?.data?.taskId,
          approved: approved,
          approvedData: {
            type: 'TEP_EXCEPTION_APPROVAL_WORKFLOW_DETAILS',
            data: {
              deductionPercent: this.deductionValue
                ? this.deductionValue
                : Number(rowData?.data?.deductionPercent)
                ? Number(rowData?.data?.deductionPercent)
                : 0,
              flatExchangeValue: this.flatExchangeValue
                ? this.flatExchangeValue
                : Number(rowData?.data?.flatExchangeValue)
                ? Number(rowData?.data?.flatExchangeValue)
                : 0,
              customerId: rowData?.data?.customerId,
              itemCode: rowData?.data?.itemCode,
              approvedBy: rowData?.data?.approvedBy
            }
          }
        });
      }
    });

    saveCnApproval = {
      bulkApproverRequestObjectDto: bulkApproverRequestObjectDto
    };

    return saveCnApproval;
  }
  remarks(value: boolean) {
    const dialogRef = this.dialog.open(TepExceptionRemarkPopUpComponent, {
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
    if (clickEvent.colDef.headerName === 'Edit') {
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
    var data = this.gridApi.getValue(this.currentRowField, node);
    this.currentRowInfo = typeof data === 'object' && data ? data.value : data;
    if (this.currentRowField === 'requestDate')
      this.currentRowInfo = this.dateFormatterService.format(
        moment(this.currentRowInfo)
      );
    if (this.currentRowInfo === 'amount')
      this.currentRowInfo = this.currencyFormatterService.format(
        this.currentRowInfo,
        this.defaultCurrencyCode,
        false
      );
  }

  focusOut(event) {
    this.isFocusing = false;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
