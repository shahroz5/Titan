import {
  Component,
  OnInit,
  Input,
  Inject,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import {
  GrnRequestApprovalListResponse,
  GrnRequestApprovalRowData,
  SaveGrnRequestApproval,
  grnRequestEnum,
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum
} from '@poss-web/shared/models';

import {
  EditItemComponent,
  CheckboxGridCellComponent,
  CheckboxCellComponent
} from '@poss-web/shared/components/ui-ag-grid';
import { POSS_WEB_CURRENCY_CODE } from '@poss-web/shared/util-config';
import { TranslateService } from '@ngx-translate/core';
import {
  DateFormatterService,
  CurrencyFormatterService,
  WeightFormatterService
} from '@poss-web/shared/components/ui-formatters';
import { MatDialog } from '@angular/material/dialog';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { GridReadyEvent, GridApi } from 'ag-grid-community';
import { FormGroup, FormControl } from '@angular/forms';
import { RemarkDialogComponent } from '@poss-web/shared/ro-request-approvals/ui-ro-request-approvals-status';

@Component({
  selector: 'poss-web-grn-request-list-items',
  templateUrl: './grn-request-list-items.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GrnRequestListItemsComponent
  implements OnInit, OnDestroy, OnChanges {
  @Input() grnRequestList: GrnRequestApprovalListResponse[];
  @Input() disableButton: boolean;
  @Input() pageIndex: number;
  @Input() status;
  @Input() type: string;
  @Output() paginator = new EventEmitter<any>();
  @Output() saveStatus = new EventEmitter<SaveGrnRequestApproval>();
  @Output() onselected = new EventEmitter<string>();

  destroy$ = new Subject();
  columnDefs = [];
  domLayout = 'autoHeight';
  rowHeight = '35';
  animateRows = true;
  rowSelection = 'multiple';
  gridApi: GridApi;
  disable: boolean;
  rowData: GrnRequestApprovalRowData[] = [];

  hasRemarks: boolean;

  pageSize = 10;
  minPageSize;
  totalElements: number;
  totalPages: number;
  rejectValidationLabel: string;
  remarksValidationLabel: string;
  grnRequestListItemsComponent: GrnRequestListItemsComponent = this;
  grnRequestEnum = grnRequestEnum;

  isFocusing = false;
  focusedHeaderName: string;
  currentRowIndex: number;
  currentRowField: string;
  currentRowInfo: string;

  constructor(
    @Inject(POSS_WEB_CURRENCY_CODE) public defaultCurrencyCode,
    private translate: TranslateService,
    private cdr: ChangeDetectorRef,
    private dateFormatterService: DateFormatterService,
    private weightFormatterServicce: WeightFormatterService,
    private currencyFormatterService: CurrencyFormatterService,
    private alertPopupService: AlertPopupServiceAbstraction,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.addRowData();
    this.translate
      .get([
        'pw.grnRequestApproval.rejectValidationLabel',
        'pw.grnRequestApproval.remarksValidationLabel'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.rejectValidationLabel =
          translatedMessages['pw.grnRequestApproval.rejectValidationLabel'];
        this.remarksValidationLabel =
          translatedMessages['pw.grnRequestApproval.remarksValidationLabel'];
      });
    if (this.type === grnRequestEnum.HISTORY) {
      if (this.status === grnRequestEnum.APPROVED) {
        this.approvedRequestColumn();
      } else if (this.status === grnRequestEnum.REJECTED) {
        this.rejectedRequestColumn();
      }
    } else {
      this.pendingRequestColumn();
    }
  }

  pendingRequestColumn() {
    this.translate
      .get([
        'pw.grnRequestApproval.srcLocationCode',
        'pw.grnRequestApproval.destLocationCode',
        'pw.grnRequestApproval.variantCode',
        'pw.grnRequestApproval.lotNumber',
        'pw.grnRequestApproval.fiscalYear',
        'pw.grnRequestApproval.cmDocNumber',
        'pw.grnRequestApproval.withCmGoldRate',
        'pw.grnRequestApproval.currentGoldRate',
        'pw.grnRequestApproval.grnComments',
        'pw.grnRequestApproval.grnReasons',
        'pw.grnRequestApproval.approvedBy',
        'pw.grnRequestApproval.approvalCode',
        'pw.grnRequestApproval.approvalMailDated',
        'pw.grnRequestApproval.requestedDateLabel',
        'pw.grnRequestApproval.returnedQty',
        'pw.grnRequestApproval.itemWeight',
        'pw.grnRequestApproval.pricePerUnit',
        'pw.grnRequestApproval.grnTotalPrice',
        'pw.grnRequestApproval.remarks'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.columnDefs = [
          {
            minWidth: 5,
            width: 5,
            pinned: 'left',
            lockPinned: true,
            cellStyle: params => {
              if (params.data.cancelType === grnRequestEnum.MFG_DEFECT) {
                return { backgroundColor: '#D8000C', padding: '0px' };
              }
            }
          },
          {
            headerCheckboxSelection: true,
            checkboxSelection: true,
            width: 50,
            suppressMovable: true
          },
          {
            headerName:
              translatedMessages['pw.grnRequestApproval.srcLocationCode'],
            field: 'srcBoutiqueCode',
            width: 100,
            minWidth: 80,

            suppressMovable: true,
            resizable: true
          },
          {
            headerName:
              translatedMessages['pw.grnRequestApproval.destLocationCode'],
            field: 'destBoutiqueCode',
            width: 100,
            minWidth: 80,
            suppressMovable: true,
            resizable: true
          },
          {
            headerName: translatedMessages['pw.grnRequestApproval.variantCode'],
            field: 'variantCode',
            suppressMovable: true,
            resizable: true,
            width: 100,
            minWidth: 80,
            suppressSizeToFit: true
          },
          {
            headerName: translatedMessages['pw.grnRequestApproval.lotNumber'],
            field: 'lotNumber',
            resizable: true,
            width: 100,
            minWidth: 80,
            suppressMovable: true
          },
          {
            headerName: translatedMessages['pw.grnRequestApproval.fiscalYear'],
            field: 'fiscalYear',
            resizable: true,
            width: 100,
            minWidth: 80,
            suppressMovable: true
          },
          {
            headerName: translatedMessages['pw.grnRequestApproval.cmDocNumber'],
            field: 'cmDocNumber',
            resizable: true,
            width: 100,
            minWidth: 80,
            suppressMovable: true
          },
          {
            headerName:
              translatedMessages['pw.grnRequestApproval.withCmGoldRate'],
            field: 'withCmGoldRate',
            resizable: true,
            width: 100,
            minWidth: 80,
            suppressMovable: true,
            cellRendererFramework: CheckboxGridCellComponent
          },
          {
            headerName:
              translatedMessages['pw.grnRequestApproval.currentGoldRate'],
            field: 'currentGoldRate',
            resizable: true,
            width: 100,
            minWidth: 80,
            suppressMovable: true,
            cellRendererFramework: CheckboxGridCellComponent
          },
          {
            headerName: 'Uploaded Documents',
            cellRenderer: () => `<a class="pw-anchor-underline">View</a>`
          },
          {
            headerName: translatedMessages['pw.grnRequestApproval.grnComments'],
            field: 'grnComments',
            resizable: true,
            width: 100,
            minWidth: 80,
            suppressMovable: true
          },
          {
            headerName: translatedMessages['pw.grnRequestApproval.grnReasons'],
            field: 'grnReasons',
            resizable: true,
            width: 100,
            minWidth: 80,
            suppressMovable: true
          },
          {
            headerName: translatedMessages['pw.grnRequestApproval.approvedBy'],
            field: 'approvedBy',
            resizable: true,
            width: 100,
            minWidth: 80,
            suppressMovable: true
          },
          {
            headerName:
              translatedMessages['pw.grnRequestApproval.approvalCode'],
            field: 'approvalCode',
            resizable: true,
            width: 100,
            minWidth: 80,
            suppressMovable: true
          },
          {
            headerName:
              translatedMessages['pw.grnRequestApproval.approvalMailDated'],
            field: 'approvalMailDated',
            resizable: true,
            valueFormatter: params => {
              if (params && params.value !== '') {
                return this.dateFormatterService.format(params.value);
              } else {
                return params.value;
              }
            },
            width: 100,
            minWidth: 80,
            suppressMovable: true
          },
          {
            headerName:
              translatedMessages['pw.grnRequestApproval.requestedDateLabel'],
            field: 'requestedDate',
            resizable: true,
            valueFormatter: params => {
              if (params && params.value !== '') {
                return this.dateFormatterService.format(params.value);
              } else {
                return params.value;
              }
            },
            width: 100,
            minWidth: 80,
            suppressMovable: true
          },
          {
            headerName: translatedMessages['pw.grnRequestApproval.returnedQty'],
            field: 'returnedQty',
            resizable: true,
            width: 100,
            minWidth: 80,
            suppressMovable: true
          },
          {
            headerName: translatedMessages['pw.grnRequestApproval.itemWeight'],
            field: 'itemWeight',
            resizable: true,
            width: 100,
            minWidth: 80,
            suppressMovable: true,
            valueFormatter: params => {
              return this.weightFormatterServicce.format(params.value);
            }
          },
          {
            headerName:
              translatedMessages['pw.grnRequestApproval.pricePerUnit'],
            field: 'pricePerUnit',
            resizable: true,
            type: 'numericColumn',
            cellClass: 'pw-justify-content-end',
            valueFormatter: params => {
              return this.currencyFormatterService.format(
                params.value,
                this.defaultCurrencyCode,
                false
              );
            },
            width: 100,
            minWidth: 80,
            suppressMovable: true
          },
          {
            headerName:
              translatedMessages['pw.grnRequestApproval.grnTotalPrice'],
            field: 'grnTotalPrice',
            type: 'numericColumn',
            cellClass: 'pw-justify-content-end',
            valueFormatter: params => {
              return this.currencyFormatterService.format(
                params.value,
                this.defaultCurrencyCode,
                false
              );
            },
            resizable: true,
            width: 100,
            minWidth: 80,
            suppressMovable: true
          },
          {
            field: 'remarks',
            suppressMovable: true,
            resizable: true,
            headerName: translatedMessages['pw.grnRequestApproval.remarks'],
            cellRendererFramework: EditItemComponent,
            onCellClicked: this.openRemarksPopup.bind(this),
            width: 100,
            minWidth: 80,
            valueFormatter: params => {
              return params.value;
            }
          }
        ];
      });
    this.gridApi?.setColumnDefs(this.columnDefs);
  }
  rejectedRequestColumn() {
    this.translate
      .get([
        'pw.grnRequestApproval.srcLocationCode',
        'pw.grnRequestApproval.destLocationCode',
        'pw.grnRequestApproval.variantCode',
        'pw.grnRequestApproval.lotNumber',
        'pw.grnRequestApproval.fiscalYear',
        'pw.grnRequestApproval.cmDocNumber',
        'pw.grnRequestApproval.withCmGoldRate',
        'pw.grnRequestApproval.currentGoldRate',
        'pw.grnRequestApproval.grnComments',
        'pw.grnRequestApproval.grnReasons',
        'pw.grnRequestApproval.rejectedBy',
        'pw.grnRequestApproval.approvalCode',
        'pw.grnRequestApproval.approvalMailDated',
        'pw.grnRequestApproval.requestedDateLabel',
        'pw.grnRequestApproval.returnedQty',
        'pw.grnRequestApproval.itemWeight',
        'pw.grnRequestApproval.pricePerUnit',
        'pw.grnRequestApproval.grnTotalPrice',
        'pw.grnRequestApproval.remarks'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.columnDefs = [
          {
            minWidth: 5,
            width: 5,
            pinned: 'left',
            lockPinned: true,
            cellStyle: params => {
              if (params.data.cancelType === grnRequestEnum.MFG_DEFECT) {
                return { backgroundColor: '#D8000C', padding: '0px' };
              }
            }
          },

          {
            headerName:
              translatedMessages['pw.grnRequestApproval.srcLocationCode'],
            field: 'srcBoutiqueCode',
            cellStyle: { 'white-space': 'normal' },
            width: 100,
            minWidth: 80,
            suppressMovable: true,
            resizable: true
          },
          {
            headerName:
              translatedMessages['pw.grnRequestApproval.destLocationCode'],
            field: 'destBoutiqueCode',

            width: 100,
            minWidth: 80,
            suppressMovable: true,
            resizable: true
          },
          {
            headerName: translatedMessages['pw.grnRequestApproval.variantCode'],
            field: 'variantCode',
            suppressMovable: true,
            resizable: true,
            width: 100,
            minWidth: 80,
            suppressSizeToFit: true
          },
          {
            headerName: translatedMessages['pw.grnRequestApproval.lotNumber'],
            field: 'lotNumber',
            resizable: true,
            width: 100,
            minWidth: 80,
            suppressMovable: true
          },
          {
            headerName: translatedMessages['pw.grnRequestApproval.fiscalYear'],
            field: 'fiscalYear',
            resizable: true,
            width: 100,
            minWidth: 80,
            suppressMovable: true
          },
          {
            headerName: translatedMessages['pw.grnRequestApproval.cmDocNumber'],
            field: 'cmDocNumber',
            resizable: true,
            width: 100,
            minWidth: 80,
            suppressMovable: true
          },
          {
            headerName:
              translatedMessages['pw.grnRequestApproval.withCmGoldRate'],
            field: 'withCmGoldRate',
            resizable: true,
            width: 100,
            minWidth: 80,
            suppressMovable: true,
            editable: false,
            cellRendererFramework: CheckboxCellComponent
          },
          {
            headerName:
              translatedMessages['pw.grnRequestApproval.currentGoldRate'],
            field: 'currentGoldRate',
            resizable: true,
            width: 100,
            minWidth: 80,
            suppressMovable: true,
            editable: false,
            cellRendererFramework: CheckboxCellComponent
          },
          {
            headerName: 'Uploaded Documents',
            cellRenderer: () => `<a class="pw-anchor-underline">View</a>`
          },
          {
            headerName: translatedMessages['pw.grnRequestApproval.grnComments'],
            field: 'grnComments',
            resizable: true,
            width: 100,
            minWidth: 80,
            suppressMovable: true
          },
          {
            headerName: translatedMessages['pw.grnRequestApproval.grnReasons'],
            field: 'grnReasons',
            resizable: true,
            width: 100,
            minWidth: 80,
            suppressMovable: true
          },
          {
            headerName: translatedMessages['pw.grnRequestApproval.rejectedBy'],
            field: 'approvedBy',
            resizable: true,
            width: 100,
            minWidth: 80,
            suppressMovable: true
          },
          {
            headerName:
              translatedMessages['pw.grnRequestApproval.approvalCode'],
            field: 'approvalCode',
            resizable: true,
            width: 100,
            minWidth: 80,
            suppressMovable: true
          },
          {
            headerName:
              translatedMessages['pw.grnRequestApproval.approvalMailDated'],
            field: 'approvalMailDated',
            resizable: true,
            valueFormatter: params => {
              if (params.value !== '') {
                return this.dateFormatterService.format(params.value);
              } else {
                return params.value;
              }
            },
            width: 100,
            minWidth: 80,
            suppressMovable: true
          },
          {
            headerName:
              translatedMessages['pw.grnRequestApproval.requestedDateLabel'],
            field: 'requestedDate',
            resizable: true,
            valueFormatter: params => {
              if (params.value !== '') {
                return this.dateFormatterService.format(params.value);
              } else {
                return params.value;
              }
            },
            width: 100,
            minWidth: 80,
            suppressMovable: true
          },
          {
            headerName: translatedMessages['pw.grnRequestApproval.returnedQty'],
            field: 'returnedQty',
            resizable: true,
            width: 100,
            minWidth: 80,
            suppressMovable: true
          },
          {
            headerName: translatedMessages['pw.grnRequestApproval.itemWeight'],
            field: 'itemWeight',
            resizable: true,
            width: 100,
            minWidth: 80,
            suppressMovable: true,
            valueFormatter: params => {
              return this.weightFormatterServicce.format(params.value);
            }
          },
          {
            headerName:
              translatedMessages['pw.grnRequestApproval.pricePerUnit'],
            field: 'pricePerUnit',
            resizable: true,
            type: 'numericColumn',
            cellClass: 'pw-justify-content-end',
            valueFormatter: params => {
              return this.currencyFormatterService.format(
                params.value,
                this.defaultCurrencyCode,
                false
              );
            },
            width: 100,
            minWidth: 80,
            suppressMovable: true
          },
          {
            headerName:
              translatedMessages['pw.grnRequestApproval.grnTotalPrice'],
            field: 'grnTotalPrice',
            type: 'numericColumn',
            cellClass: 'pw-justify-content-end',
            valueFormatter: params => {
              return this.currencyFormatterService.format(
                params.value,
                this.defaultCurrencyCode,
                false
              );
            },
            resizable: true,
            width: 100,
            minWidth: 80,
            suppressMovable: true
          },
          {
            field: 'remarks',
            suppressMovable: true,
            resizable: true,
            headerName: translatedMessages['pw.grnRequestApproval.remarks'],

            width: 100,
            minWidth: 80,

            onCellClicked: this.openRemarksPopup.bind(this),
            cellStyle: params => {
              return { color: '#b0a16e' };
            },
            cellRenderer: params => {
              return `<h5>...</5>`;
            }
          }
        ];
      });

    this.gridApi?.setColumnDefs(this.columnDefs);
    this.cdr.markForCheck();
  }
  approvedRequestColumn() {
    this.translate
      .get([
        'pw.grnRequestApproval.srcLocationCode',
        'pw.grnRequestApproval.destLocationCode',
        'pw.grnRequestApproval.variantCode',
        'pw.grnRequestApproval.lotNumber',
        'pw.grnRequestApproval.fiscalYear',
        'pw.grnRequestApproval.cmDocNumber',
        'pw.grnRequestApproval.withCmGoldRate',
        'pw.grnRequestApproval.currentGoldRate',
        'pw.grnRequestApproval.grnComments',
        'pw.grnRequestApproval.grnReasons',
        'pw.grnRequestApproval.approvedBy',
        'pw.grnRequestApproval.approvalCode',
        'pw.grnRequestApproval.approvalMailDated',
        'pw.grnRequestApproval.requestedDateLabel',
        'pw.grnRequestApproval.returnedQty',
        'pw.grnRequestApproval.itemWeight',
        'pw.grnRequestApproval.pricePerUnit',
        'pw.grnRequestApproval.grnTotalPrice',
        'pw.grnRequestApproval.remarks'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.columnDefs = [
          {
            minWidth: 5,
            width: 5,
            pinned: 'left',
            lockPinned: true,
            cellStyle: params => {
              if (params.data.cancelType === grnRequestEnum.MFG_DEFECT) {
                return { backgroundColor: '#D8000C', padding: '0px' };
              }
            }
          },

          {
            headerName:
              translatedMessages['pw.grnRequestApproval.srcLocationCode'],
            field: 'srcBoutiqueCode',
            width: 100,
            minWidth: 80,
            suppressMovable: true,
            resizable: true
          },
          {
            headerName:
              translatedMessages['pw.grnRequestApproval.destLocationCode'],
            field: 'destBoutiqueCode',

            width: 100,
            minWidth: 80,
            suppressMovable: true,
            resizable: true
          },
          {
            headerName: translatedMessages['pw.grnRequestApproval.variantCode'],
            field: 'variantCode',
            suppressMovable: true,
            resizable: true,
            width: 100,
            minWidth: 80,
            suppressSizeToFit: true
          },
          {
            headerName: translatedMessages['pw.grnRequestApproval.lotNumber'],
            field: 'lotNumber',
            resizable: true,
            width: 100,
            minWidth: 80,
            suppressMovable: true
          },
          {
            headerName: translatedMessages['pw.grnRequestApproval.fiscalYear'],
            field: 'fiscalYear',
            resizable: true,
            width: 100,
            minWidth: 80,
            suppressMovable: true
          },
          {
            headerName: translatedMessages['pw.grnRequestApproval.cmDocNumber'],
            field: 'cmDocNumber',
            resizable: true,
            width: 100,
            minWidth: 80,
            suppressMovable: true
          },
          {
            headerName:
              translatedMessages['pw.grnRequestApproval.withCmGoldRate'],
            field: 'withCmGoldRate',
            resizable: true,
            width: 100,
            minWidth: 80,
            suppressMovable: true,
            editable: false,
            cellRendererFramework: CheckboxCellComponent
          },
          {
            headerName:
              translatedMessages['pw.grnRequestApproval.currentGoldRate'],
            field: 'currentGoldRate',
            resizable: true,
            width: 100,
            minWidth: 80,
            editable: false,
            suppressMovable: true,
            cellRendererFramework: CheckboxCellComponent
          },
          {
            headerName: 'Uploaded Documents',
            cellRenderer: () => `<a class="pw-anchor-underline">View</a>`
          },
          {
            headerName: translatedMessages['pw.grnRequestApproval.grnComments'],
            field: 'grnComments',
            resizable: true,
            width: 100,
            minWidth: 80,
            suppressMovable: true
          },
          {
            headerName: translatedMessages['pw.grnRequestApproval.grnReasons'],
            field: 'grnReasons',
            resizable: true,
            width: 100,
            minWidth: 80,
            suppressMovable: true
          },
          {
            headerName: translatedMessages['pw.grnRequestApproval.approvedBy'],
            field: 'approvedBy',
            resizable: true,
            width: 100,
            minWidth: 80,
            suppressMovable: true
          },
          {
            headerName:
              translatedMessages['pw.grnRequestApproval.approvalCode'],
            field: 'approvalCode',
            resizable: true,
            width: 100,
            minWidth: 80,
            suppressMovable: true
          },
          {
            headerName:
              translatedMessages['pw.grnRequestApproval.approvalMailDated'],
            field: 'approvalMailDated',
            resizable: true,
            valueFormatter: params => {
              if (params.value !== '') {
                return this.dateFormatterService.format(params.value);
              } else {
                return params.value;
              }
            },
            width: 100,
            minWidth: 80,
            suppressMovable: true
          },
          {
            headerName:
              translatedMessages['pw.grnRequestApproval.requestedDateLabel'],
            field: 'requestedDate',
            resizable: true,
            valueFormatter: params => {
              if (params.value !== '') {
                return this.dateFormatterService.format(params.value);
              } else {
                return params.value;
              }
            },
            width: 100,
            minWidth: 80,
            suppressMovable: true
          },
          {
            headerName: translatedMessages['pw.grnRequestApproval.returnedQty'],
            field: 'returnedQty',
            resizable: true,
            width: 100,
            minWidth: 80,
            suppressMovable: true
          },
          {
            headerName: translatedMessages['pw.grnRequestApproval.itemWeight'],
            field: 'itemWeight',
            resizable: true,
            width: 100,
            minWidth: 80,
            suppressMovable: true,
            valueFormatter: params => {
              return this.weightFormatterServicce.format(params.value);
            }
          },
          {
            headerName:
              translatedMessages['pw.grnRequestApproval.pricePerUnit'],
            field: 'pricePerUnit',
            resizable: true,
            type: 'numericColumn',
            cellClass: 'pw-justify-content-end',
            valueFormatter: params => {
              return this.currencyFormatterService.format(
                params.value,
                this.defaultCurrencyCode,
                false
              );
            },
            width: 100,
            minWidth: 80,
            suppressMovable: true
          },
          {
            headerName:
              translatedMessages['pw.grnRequestApproval.grnTotalPrice'],
            field: 'grnTotalPrice',
            type: 'numericColumn',
            cellClass: 'pw-justify-content-end',
            valueFormatter: params => {
              return this.currencyFormatterService.format(
                params.value,
                this.defaultCurrencyCode,
                false
              );
            },
            resizable: true,
            width: 100,
            minWidth: 80,
            suppressMovable: true
          },
          {
            field: 'remarks',
            suppressMovable: true,
            resizable: true,
            headerName: translatedMessages['pw.grnRequestApproval.remarks'],

            width: 100,
            minWidth: 100,

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

    this.gridApi?.setColumnDefs(this.columnDefs);
    this.cdr.markForCheck();
  }
  addRowData() {
    let i = 0;

    if (this.grnRequestList.length) {
      if (this.type !== this.grnRequestEnum.HISTORY) {
        for (const data of this.grnRequestList) {
          this.rowData.push({
            srcBoutiqueCode: data.srcBoutiqueCode,
            destBoutiqueCode: data.destBoutiqueCode,
            formGroup: new FormGroup({
              withCmGoldRate: new FormControl(
                data.isCmGoldRate ? data.isCmGoldRate : false
              ),
              currentGoldRate: new FormControl(data.isCmGoldRate ? false : true)
            }),
            fiscalYear: data.fiscalYear,
            cmDocNumber: data.cmDocNumber,
            rowKey: i++,
            grnComments: data.grnComments,
            grnReasons: data.grnReasons,
            approvedBy: data.approvedBy,
            approvalCode: data.approvalCode,
            approvalMailDated: data.approvalMailDated,
            requestedDate: data.requestedDate,
            returnedQty: data.returnedQty,
            taskId: data.taskId,
            processId: data.processId,
            id: data.id,
            refId: data.refId,
            taskName: data.taskName,
            grnTotalPrice: data.grnTotalPrice,
            remarks: data.remarks,
            cancelType: data.cancelType,
            variantCode: data.variantCode,
            lotNumber: data.lotNumber,
            itemWeight: data.itemWeight,
            pricePerUnit: data.pricePerUnit
          });
        }
      } else if (this.type === this.grnRequestEnum.HISTORY) {
        for (const data of this.grnRequestList) {
          this.rowData.push({
            srcBoutiqueCode: data.srcBoutiqueCode,
            destBoutiqueCode: data.destBoutiqueCode,
            withCmGoldRate: data.isCmGoldRate ? data.isCmGoldRate : false,
            currentGoldRate: data.isCmGoldRate ? false : true,
            fiscalYear: data.fiscalYear,
            cmDocNumber: data.cmDocNumber,
            rowKey: i++,
            grnComments: data.grnComments,
            grnReasons: data.grnReasons,
            approvedBy: data.approvedBy,
            approvalCode: data.approvalCode,
            approvalMailDated: data.approvalMailDated,
            requestedDate: data.requestedDate,
            returnedQty: data.returnedQty,
            taskId: data.taskId,
            processId: data.processId,
            id: data.id,
            refId: data.refId,
            taskName: data.taskName,
            grnTotalPrice: data.grnTotalPrice,
            remarks: data.remarks,
            cancelType: data.cancelType,
            variantCode: data.variantCode,
            lotNumber: data.lotNumber,
            itemWeight: data.itemWeight,
            pricePerUnit: data.pricePerUnit
          });
        }
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
  selectionChange(checked, rowkey, field) {
    const rowNode = this.gridApi.getDisplayedRowAtIndex(rowkey);
    if (field === 'withCmGoldRate') {
      rowNode.data.formGroup = new FormGroup({
        withCmGoldRate: new FormControl(checked ? checked : false),
        currentGoldRate: new FormControl(checked ? false : !checked)
      });
    }
    if (field === 'currentGoldRate') {
      rowNode.data.formGroup = new FormGroup({
        withCmGoldRate: new FormControl(checked ? false : !checked),
        currentGoldRate: new FormControl(checked ? checked : false)
      });
    }

    const res1 = this.gridApi.applyTransaction({
      update: [rowNode.data]
    });
    this.gridApi.redrawRows({
      rowNodes: res1.update
    });
  }

  getContext() {
    return {
      componentParent: this.grnRequestListItemsComponent
    };
  }
  getHistoryContext() {
    return {
      componentParent: this.grnRequestListItemsComponent,
      disableCheckBox: true
    };
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.totalPages = this.grnRequestList[0]?.totalElements / this.pageSize;

    this.cdr.markForCheck();

    this.rowData = [];
    if (this.type === grnRequestEnum.HISTORY) {
      if (this.status === grnRequestEnum.APPROVED) {
        this.approvedRequestColumn();
      } else if (this.status === grnRequestEnum.REJECTED) {
        this.rejectedRequestColumn();
      }
    } else {
      this.pendingRequestColumn();
    }
    this.disable = this.disableButton;
    if (changes['grnRequestList']) {
      this.rowData = [];
      this.addRowData();

      if (this.gridApi) {
        this.gridApi.setRowData(this.rowData);
      }
    }
  }

  reject() {
    if (this.gridApi.getSelectedNodes().length > 1) {
      this.openPopUp(this.rejectValidationLabel);
    } else {
      this.checkRemarksValidation();
      if (this.hasRemarks) {
        this.saveStatus.emit(this.prepareResponse(false));
      } else {
        this.openPopUp(this.remarksValidationLabel);
      }
    }
  }
  openPopUp(errorMessage) {
    this.alertPopupService.open({
      type: AlertPopupTypeEnum.ERROR,
      message: errorMessage
    });
  }
  prepareResponse(approved) {
    let saveRoRequestApproval: SaveGrnRequestApproval;
    const bulkApproverRequestObjectDto = [];
    this.gridApi.getSelectedNodes().forEach(rowData => {
      bulkApproverRequestObjectDto.push({
        approverRemarks: rowData?.data?.remarks,

        approvedData: {
          data: {
            isCMGoldRate: rowData?.data?.formGroup.get('withCmGoldRate').value
          }
        },
        taskId: rowData?.data?.taskId,
        processId: rowData?.data?.processId,
        taskName: rowData?.data?.taskName,
        type: grnRequestEnum.WORK_FLOW_TYPE,
        approved: approved
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

  decreasePageIndex() {
    if (this.pageIndex > 0) {
      this.pageIndex = this.pageIndex - 1;
      this.paginate();
    }
  }

  increasePageIndex() {
    if (this.pageIndex < this.totalPages - 1) {
      this.pageIndex = this.pageIndex + 1;
      this.paginate();
    }
  }

  paginate() {
    this.paginator.emit({
      pageIndex: this.pageIndex
    });
  }
  onSelectionChanged(event) {
    if (this.gridApi.getSelectedNodes().length) {
      this.disable = false;
    } else {
      this.disable = true;
    }
  }

  openRemarksPopup(params) {
    const dialog = this.dialog.open(RemarkDialogComponent, {
      data: {
        value: params.value,
        readOnly: this.type === grnRequestEnum.HISTORY ? true : false
      },
      disableClose: true,
      width: '500px'
    });
    if (this.type !== grnRequestEnum.HISTORY) {
      dialog
        .afterClosed()
        .pipe(takeUntil(this.destroy$))
        .subscribe(res => {
          if (params.rowIndex !== null) {
            const rowNode = this.gridApi.getRowNode(params.rowIndex);

            rowNode.data.remarks = res.data;
            const res1 = this.gridApi.applyTransaction({
              update: [rowNode.data]
            });
            this.gridApi.redrawRows({
              rowNodes: res1.update
            });
          }
        });
    }
  }

  onCellClicked(clickEvent) {
    if (clickEvent.colDef.headerName === 'Uploaded Documents') {
      this.onselected.emit(clickEvent.data);
    }
  }

  cancel() {
    this.gridApi.deselectAll();
  }

  onCellFocused(event) {
    if (event.column) {
      this.isFocusing = true;
    }

    this.focusedHeaderName = event.column.colDef.headerName;
    this.currentRowIndex = Number(event.rowIndex);
    this.currentRowField = event.column.colDef.field;
    if (
      this.currentRowField === 'currentGoldRate' ||
      this.currentRowField === 'withCmGoldRate'
    ) {
      this.currentRowInfo = this.rowData[
        this.currentRowIndex
      ].formGroup.controls[this.currentRowField].value;
    } else {
      this.currentRowInfo = this.rowData[this.currentRowIndex][
        this.currentRowField
      ];
    }
    if (
      this.currentRowField === 'approvalMailDated' ||
      this.currentRowField === 'requestedDate'
    )
      this.currentRowInfo = this.dateFormatterService.format(
        this.currentRowInfo
      );
    if (
      this.currentRowField === 'pricePerUnit' ||
      this.currentRowField === 'grnTotalPrice'
    )
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
