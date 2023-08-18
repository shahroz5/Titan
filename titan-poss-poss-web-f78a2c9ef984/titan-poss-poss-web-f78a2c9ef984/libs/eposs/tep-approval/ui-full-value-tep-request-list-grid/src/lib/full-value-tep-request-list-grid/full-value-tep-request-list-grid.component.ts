import {
  Component,
  OnInit,
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
  AlertPopupServiceAbstraction,
  GiftCardsGridEnum,
  OverlayNotificationType,
  OverlayNotificationEventRef,
  OverlayNotificationServiceAbstraction,
  FullValueApprovalListItem,
  FvtAcceptOrRejectRequestPayload,
  DocumentListResponse
} from '@poss-web/shared/models';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { POSS_WEB_CURRENCY_CODE } from '@poss-web/shared/util-config';
import { TranslateService } from '@ngx-translate/core';
import {
  DateFormatterService,
  CurrencyFormatterService
} from '@poss-web/shared/components/ui-formatters';
import { MatDialog } from '@angular/material/dialog';
import { take, takeUntil } from 'rxjs/operators';
import {
  EditItemComponent,
  InputValidatorComponent
} from '@poss-web/shared/components/ui-ag-grid';
import { PageEvent } from '@angular/material/paginator';
import * as moment from 'moment';
import { FormArray, FormGroup } from '@angular/forms';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';

@Component({
  selector: 'poss-web-full-value-tep-request-list-grid',
  templateUrl: './full-value-tep-request-list-grid.component.html'
})
export class FullValueTepRequestListGridComponent implements OnInit, OnChanges {
  @Input() tepRequestList: FullValueApprovalListItem[];
  @Input() pageIndex: number;
  @Input() count = 0;
  @Input() pageSizeOptions: number[];
  @Input() minPageSize = 0;
  @Input() pageEvent: PageEvent;
  @Input() pageSize = 10;

  @Output() paginator = new EventEmitter<PageEvent>();
  @Output() emitApprovedData = new EventEmitter<{
    type: string;
    data: FvtAcceptOrRejectRequestPayload;
    processId: string;
    taskId: string;
    taskName: string;
  }>();
  @Output() onselected = new EventEmitter<{
    filesList: DocumentListResponse[];
    locationCode: string;
  }>();

  destroy$ = new Subject();
  columnDefs = [];
  domLayout = 'autoHeight';
  rowHeight = 65;
  animateRows = true;
  rowSelection = 'single';
  gridApi: GridApi;
  formGroup: FormGroup = new FormGroup({});
  parentForm: FormArray = new FormArray([]);
  disable = true;
  rowData: any[] = [];
  defaultColDef = {
    suppressMovable: true,
    resizable: true
  };

  totalElements: number;
  totalPages: number;

  ftepLocationCode: string;
  ftepLocationType: string;
  cmLocationCode: string;
  cmNumber: string;
  cmDate: string;
  reqNumber: string;
  reqDate: string;
  reqTime: string;
  approvalDate: string;
  noOfDaysFromCm: string;
  customerName: string;
  customerMobileNo: string;
  variantCode: string;
  lotNumber: string;
  qty: string;
  billedWeight: string;
  measuredWeight: string;
  totalActualNumberOfStones: string;
  totalNumberOfStonesReturned: string;
  stoneValue: string;
  metalValue: string;
  makingCharges: string;
  reasonForFtep: string;
  approvedBy: string;
  approverCode: string;
  idProofCopy: string;
  cmCopy: string;
  tepPaymentMode: string;
  paymentValue: string;
  overridingValue: string;
  fullOrProportionedValue: string;
  remarks: string;
  selectedRowId: number;
  selectedRowData: any;

  fullValueTepRequestListGridComponent: any = this;

  isFocusing = false;
  focusedHeaderName: string;
  currentRowIndex: number;
  currentRowField: string;
  currentRowInfo: string;

  constructor(
    private translate: TranslateService,
    private cdr: ChangeDetectorRef,
    private dateFormatterService: DateFormatterService,
    private fieldValidatorsService: FieldValidatorsService,
    private overlayNotificationServiceAbstraction: OverlayNotificationServiceAbstraction,
    @Inject(POSS_WEB_CURRENCY_CODE) public defaultCurrencyCode
  ) {
    this.translate
      .get([
        'pw.regularTepApproval.ftepLocationCode',
        'pw.regularTepApproval.ftepLocationType',
        'pw.regularTepApproval.cmLocationCode',
        'pw.regularTepApproval.cmNumber',
        'pw.regularTepApproval.cmDate',
        'pw.regularTepApproval.reqNumber',
        'pw.regularTepApproval.reqDate',
        'pw.regularTepApproval.reqTime',
        'pw.regularTepApproval.approvalDate',
        'pw.regularTepApproval.noOfDaysFromCm',
        'pw.regularTepApproval.customerName',
        'pw.regularTepApproval.customerMobileNo',
        'pw.regularTepApproval.variantCode',
        'pw.regularTepApproval.lotNumber',
        'pw.regularTepApproval.qty',
        'pw.regularTepApproval.billedWeight',
        'pw.regularTepApproval.measuredWeight',
        'pw.regularTepApproval.totalActualNumberOfStones',
        'pw.regularTepApproval.totalNumberOfStonesReturned',
        'pw.regularTepApproval.stoneValue',
        'pw.regularTepApproval.metalValue',
        'pw.regularTepApproval.makingCharges',
        'pw.regularTepApproval.reasonForFtep',
        'pw.regularTepApproval.approvedBy',
        'pw.regularTepApproval.approverCode',
        'pw.regularTepApproval.idProofCopy',
        'pw.regularTepApproval.cmCopy',
        'pw.regularTepApproval.tepPaymentMode',
        'pw.regularTepApproval.paymentValue',
        'pw.regularTepApproval.overridingValue',
        'pw.regularTepApproval.fullOrProportionedValue',
        'pw.regularTepApproval.remarks'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.ftepLocationCode =
          translatedMessages['pw.regularTepApproval.ftepLocationCode'];
        this.ftepLocationType =
          translatedMessages['pw.regularTepApproval.ftepLocationType'];
        this.cmLocationCode =
          translatedMessages['pw.regularTepApproval.cmLocationCode'];
        this.cmNumber = translatedMessages['pw.regularTepApproval.cmNumber'];
        this.cmDate = translatedMessages['pw.regularTepApproval.cmDate'];
        this.reqNumber = translatedMessages['pw.regularTepApproval.reqNumber'];
        this.reqDate = translatedMessages['pw.regularTepApproval.reqDate'];
        this.reqTime = translatedMessages['pw.regularTepApproval.reqTime'];
        (this.approvalDate =
          translatedMessages['pw.regularTepApproval.approvalDate']),
          (this.noOfDaysFromCm =
            translatedMessages['pw.regularTepApproval.noOfDaysFromCm']);
        this.customerName =
          translatedMessages['pw.regularTepApproval.customerName'];
        this.customerMobileNo =
          translatedMessages['pw.regularTepApproval.customerMobileNo'];
        this.variantCode =
          translatedMessages['pw.regularTepApproval.variantCode'];
        this.lotNumber = translatedMessages['pw.regularTepApproval.lotNumber'];
        this.qty = translatedMessages['pw.regularTepApproval.qty'];
        this.billedWeight =
          translatedMessages['pw.regularTepApproval.billedWeight'];
        this.measuredWeight =
          translatedMessages['pw.regularTepApproval.measuredWeight'];
        this.totalActualNumberOfStones =
          translatedMessages['pw.regularTepApproval.totalActualNumberOfStones'];
        this.totalNumberOfStonesReturned =
          translatedMessages[
            'pw.regularTepApproval.totalNumberOfStonesReturned'
          ];
        this.stoneValue =
          translatedMessages['pw.regularTepApproval.stoneValue'];
        this.metalValue =
          translatedMessages['pw.regularTepApproval.metalValue'];
        this.makingCharges =
          translatedMessages['pw.regularTepApproval.makingCharges'];
        this.reasonForFtep =
          translatedMessages['pw.regularTepApproval.reasonForFtep'];
        this.approvedBy =
          translatedMessages['pw.regularTepApproval.approvedBy'];
        this.approverCode =
          translatedMessages['pw.regularTepApproval.approverCode'];
        this.idProofCopy =
          translatedMessages['pw.regularTepApproval.idProofCopy'];
        this.cmCopy = translatedMessages['pw.regularTepApproval.cmCopy'];
        this.tepPaymentMode =
          translatedMessages['pw.regularTepApproval.tepPaymentMode'];
        this.overridingValue =
          translatedMessages['pw.regularTepApproval.overridingValue'];
        this.fullOrProportionedValue =
          translatedMessages['pw.regularTepApproval.fullOrProportionedValue'];
        this.remarks = translatedMessages['pw.regularTepApproval.remarks'];
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
        headerName: this.ftepLocationCode,
        field: 'ftepLocationCode'
      },
      {
        headerName: this.ftepLocationType,
        field: 'ftepLocationType'
      },
      {
        headerName: this.cmLocationCode,
        field: 'cmLocationCode'
      },
      {
        headerName: this.cmNumber,
        field: 'cmNumber'
      },
      {
        headerName: this.cmDate,
        field: 'cmDate',
        valueFormatter: params => {
          return this.dateFormatterService.format(moment(params.value));
        }
      },
      {
        headerName: this.reqNumber,
        field: 'reqNumber'
      },
      {
        headerName: this.reqDate,
        field: 'reqDate',
        valueFormatter: params => {
          return this.dateFormatterService.format(moment(params.value));
        }
      },
      {
        headerName: this.reqTime,
        field: 'reqTime'
      },
      {
        headerName: this.noOfDaysFromCm,
        field: 'noOfDaysFromCm'
      },
      {
        headerName: this.customerName,
        field: 'customerName'
      },
      {
        headerName: this.customerMobileNo,
        field: 'customerMobileNo'
      },
      {
        headerName: this.variantCode,
        field: 'variantCode'
      },
      {
        headerName: this.lotNumber,
        field: 'lotNumber'
      },
      {
        headerName: this.qty,
        field: 'qty'
      },
      {
        headerName: this.billedWeight,
        field: 'billedWeight'
      },
      {
        headerName: this.measuredWeight,
        field: 'measuredWeight'
      },
      {
        headerName: this.totalActualNumberOfStones,
        field: 'totalActualNumberOfStones'
      },
      {
        headerName: this.totalNumberOfStonesReturned,
        field: 'totalNumberOfStonesReturned'
      },
      {
        headerName: this.stoneValue,
        field: 'stoneValue'
      },
      {
        headerName: this.metalValue,
        field: 'metalValue'
      },
      {
        headerName: this.makingCharges,
        field: 'makingCharges'
      },
      {
        headerName: this.reasonForFtep,
        field: 'reasonForFtep'
      },
      {
        headerName: this.approvedBy,
        field: 'approvedBy'
      },
      {
        headerName: this.approverCode,
        field: 'approverCode'
      },
      {
        headerName: this.approvalDate,
        field: 'approvalDate',
        valueFormatter: params => {
          return this.dateFormatterService.format(moment(params.value));
        }
      },
      {
        headerName: 'Uploaded Documents',
        cellRenderer: () => `<a class="pw-anchor-underline">View</a>`
      },
      {
        headerName: this.tepPaymentMode,
        field: 'tepPaymentMode'
      },
      {
        headerName: this.paymentValue,
        field: 'paymentValue',
        cellEditorSelector: params => this.paymentValueEditor(),
        cellRendererSelector: () => {
          return this.editItemRenderer(true);
        },
        cellClass: 'pw-fourth-color',
        editable: true,
        singleClickEdit: true,
        valueFormatter: params => {
          if (
            params &&
            params.data &&
            params.data.paymentValue &&
            params.data.paymentValue !== 'Overriding Value' &&
            params.data.paymentValue !== '' &&
            params.data.overridingValue &&
            params.data.overridingValue.value
          ) {
            this.rowData[params.node.rowIndex].overridingValue = '';
            this.rowData = [...this.rowData];
          } else if (
            params.data &&
            params.data.paymentValue === 'Overriding Value' &&
            params.data.fullOrProportionedValue
          ) {
            this.rowData[params.node.rowIndex].fullOrProportionedValue = '';
            this.rowData = [...this.rowData];
          }
        }
      },
      {
        headerName: this.overridingValue,
        field: 'overridingValue',
        editable: params => {
          return params.data && params.data.paymentValue === 'Overriding Value'
            ? true
            : false;
        },
        isAmount: true,
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
              return ' ';
            }
          } else if (params.value && typeof params.value !== 'object') {
            return params.value;
          } else {
            return '';
          }
        },
        cellClass: 'pw-fourth-color',
        cellClassRules: {
          'pw-gray-border': params => {
            return (
              params.value &&
              params.value.isValid === true &&
              params.value.value !== ''
            );
          },
          'pw-error-border': params => {
            return (
              (params.value && params.value.isValid === false) ||
              (params.value && params.value.value === '')
            );
          }
        }
      },
      {
        headerName: this.fullOrProportionedValue,
        field: 'fullOrProportionedValue',
        cellEditorSelector: params =>
          this.fullOrProportionedValueEditor(params),
        cellRendererSelector: () => {
          return this.editItemRenderer(true);
        },
        cellClass: 'pw-fourth-color',
        editable: params => {
          return params.data && params.data.paymentValue !== 'Overriding Value'
            ? true
            : false;
        },
        singleClickEdit: true,
        valueFormatter: params => {
          if (params && params.data && params.data.paymentValue) {
          }
        }
      },
      {
        headerName: this.remarks,
        field: 'remarks',
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
              return ' ';
            }
          } else if (params.value && typeof params.value !== 'object') {
            return params.value;
          } else {
            return '';
          }
        },
        cellClass: 'pw-fourth-color',
        cellClassRules: {
          'pw-gray-border': params => {
            return (
              params.value &&
              params.value.isValid === true &&
              params.value.value !== ''
            );
          },
          'pw-error-border': params => {
            return (
              (params.value && params.value.isValid === false) ||
              (params.value && params.value.value === '')
            );
          }
        }
      }
    ];
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.cdr.markForCheck();
    if (changes['tepRequestList']) {
      this.rowData = [];
      this.addRowData();
      this.disable = true;
    } else {
      this.rowData = [];
    }
  }

  onPaymentValueChange(params) {
    if (params && params.node) {
      const rowList = [...this.rowData];
      if (
        params.data.paymentValue &&
        params.data.paymentValue !== 'Overriding Value'
      ) {
        rowList[params.node.rowIndex].overridingValue = '';
        rowList[params.node.rowIndex].paymentTypeSelected = 'others';
      } else {
        rowList[params.node.rowIndex].paymentTypeSelected = 'overriding';
      }
      this.rowData = [...rowList];
    }
  }

  updateRemarks(remarksValue: string) {
    console.log();
  }

  fullOrProportionedValueEditor(params: any) {
    const fullOrProportionedValueList = ['FULL VALUE', 'PROPORTIONED VALUE'];
    return {
      component: 'agSelectCellEditor',
      params: {
        values: fullOrProportionedValueList
      }
    };
  }

  paymentValueEditor() {
    const paymentValuesList = [
      'Current Value',
      'Overriding Value',
      'Invoice Value'
    ];
    return {
      component: 'agSelectCellEditor',
      params: {
        values: paymentValuesList
      }
    };
  }

  editItemRenderer(isEditable: boolean) {
    if (isEditable) {
      return { component: 'editItemRenderer' };
    } else {
      return null;
    }
  }

  addRowData() {
    if (this.tepRequestList && this.tepRequestList.length > 0) {
      for (const data of this.tepRequestList) {
        this.rowData.push({
          filesList:
            data.headerData.data?.approvalDetails?.data?.fileList?.results,
          ftepLocationCode: data.headerData.data.fvtLocationCode,
          ftepLocationType: data.headerData.data.fvtLocationType,
          cmLocationCode: data.headerData.data.cmLocationCode,
          cmNumber: data.headerData.data.cmDocNo,
          cmDate: data.headerData.data.cmDocDate,
          reqNumber: data.docNo,
          reqDate: data.requestedDate,
          reqTime: moment(data.requestedDate).format('hh:mm A'),
          noOfDaysFromCm: data.headerData.data.noOfDaysFromCm,
          customerName: data.headerData.data.customerName,
          customerMobileNo: data.headerData.data.customerMobileNo,
          variantCode: data.headerData.data.itemCode,
          lotNumber: data.headerData.data.lotNumber,
          qty: data.headerData.data.totalQuantity,
          billedWeight: data.headerData.data.billedWeight,
          measuredWeight: data.headerData.data.measuredWeight,
          totalActualNumberOfStones: data.headerData.data.totalNoOfStones,
          totalNumberOfStonesReturned: data.headerData.data.measuredNoOfStones,
          stoneValue: data.headerData.data.stoneValue,
          metalValue: data.headerData.data.metalValue,
          makingCharges:
            data.headerData.data.priceDetails.makingChargeDetails
              .preDiscountValue,
          reasonForFtep: data.headerData.data.reasonForFullValueTep,
          approvedBy: data.headerData.data?.approvalDetails?.data?.approvedBy,
          approverCode:
            data.headerData.data?.approvalDetails?.data?.approvalCode,
          approvalDate:
            data.headerData.data?.approvalDetails?.data?.approvalDate,
          locationCode: data.locationCode,
          idProofCopy: '',
          cmCopy: '',
          tepPaymentMode: data.headerData.data.paymentMode,
          paymentValue: '',
          overridingValue: '',
          fullOrProportionedValue: '',
          remarks: '',
          paymentTypeSelected: ''
        });
      }
    } else {
      this.rowData = [];
    }
  }

  getContext() {
    return {
      formGroup: this.parentForm.controls,
      componentParent: this.fullValueTepRequestListGridComponent,
      validators: {
        remarks: [this.fieldValidatorsService.remarkField('Remarks')]
      },
      gridApi: this.gridApi
    };
  }

  viewAnchorRenderer(params) {
    return `<a class="pw-anchor-underline">View</a>`;
  }

  onCellClicked(event) {
    if (event.column.getColId() === 'idProofCopy') {
      if (event && event.data && event.data.tepNo) {
        const eventObj = this.tepRequestList.filter(
          (tepItem: FullValueApprovalListItem) => {
            return tepItem.docNo === event.data.tepNo;
          }
        );
      }
    } else if (event.colDef.headerName === 'Uploaded Documents') {
      this.onselected.emit({
        filesList: event.data.filesList,
        locationCode: event.data.locationCode
      });
    }
  }

  getComponents() {
    return {
      inputValidator: InputValidatorComponent,
      editItemComponent: EditItemComponent
    };
  }

  gridReady(gridRedayEvent: GridReadyEvent) {
    this.gridApi = gridRedayEvent.api;
    this.gridApi.setColumnDefs(this.columnDefs);

    this.gridApi.setRowData(this.rowData);
  }

  onSelectionChanged(event: any) {
    if (this.gridApi.getSelectedNodes().length) {
      this.disable = false;
    } else {
      this.disable = true;
    }
    this.selectedRowId = this.rowData.indexOf(
      this.gridApi.getSelectedRows()[0]
    );
    if (this.gridApi.getSelectedRows().length > 0) {
      this.selectedRowData = this.gridApi.getSelectedRows()[0];
    } else {
      this.selectedRowData = null;
    }
  }

  showNotifications(key: string) {
    this.translate
      .get(key)
      .pipe(take(1))
      .subscribe((translatedMsg: string) => {
        this.overlayNotificationServiceAbstraction
          .show({
            type: OverlayNotificationType.SIMPLE,
            message: translatedMsg,
            hasClose: true,
            hasBackdrop: true
          })
          .events.pipe(take(1))
          .subscribe((event: OverlayNotificationEventRef) => {
            // Action based event
          });
      });
  }

  approve() {
    this.sendApprovalForRequest('APPROVE');
  }

  reject() {
    this.sendApprovalForRequest('REJECT');
  }

  sendApprovalForRequest(type: string) {
    if (!this.selectedRowData.paymentValue) {
      this.showNotifications('Please select payment value in selected row.');
    } else if (
      this.selectedRowData.paymentValue !== 'Overriding Value' &&
      !this.selectedRowData.fullOrProportionedValue
    ) {
      this.showNotifications(
        'Please select full or proportioned value in selected row.'
      );
    } else if (
      type === 'REJECT' &&
      (!this.selectedRowData.remarks ||
        this.selectedRowData.remarks === ' ' ||
        (typeof this.selectedRowData.remarks === 'object' &&
          !this.selectedRowData.remarks.value))
    ) {
      this.showNotifications('Please enter remarks in selected row.');
    } else if (
      this.selectedRowData.paymentValue === 'Overriding Value' &&
      (!this.selectedRowData.overridingValue ||
        (typeof this.selectedRowData.overridingValue === 'object' &&
          !this.selectedRowData.overridingValue.value))
    ) {
      this.showNotifications('Please enter Overriding value in selected row.');
    } else {
      const fvtAcceptOrRejectRequestPayload: FvtAcceptOrRejectRequestPayload = {
        approvedData: {
          type: 'FULL_VALUE_TEP_DETAILS',
          data: {
            tepValue: [this.rowData[this.selectedRowId].paymentValue],
            approverRemarks:
              typeof this.selectedRowData.remarks === 'object'
                ? this.selectedRowData.remarks.value
                : this.selectedRowData.remarks,
            paymentValue: [
              this.rowData[this.selectedRowId].fullOrProportionedValue
            ]
          }
        },
        approverRemarks:
          typeof this.selectedRowData.remarks === 'object'
            ? this.selectedRowData.remarks.value
            : this.selectedRowData.remarks
      };
      if (
        this.selectedRowData &&
        this.selectedRowData.paymentValue === 'Overriding Value'
      ) {
        fvtAcceptOrRejectRequestPayload.approvedData.data.overrideValue =
          typeof this.selectedRowData.overridingValue === 'object' &&
          this.selectedRowData.overridingValue !== ''
            ? Number(this.selectedRowData.overridingValue.value)
            : 0;
      }
      this.emitApprovedData.emit({
        data: fvtAcceptOrRejectRequestPayload,
        type,
        processId: this.tepRequestList[this.selectedRowId].processId,
        taskId: this.tepRequestList[this.selectedRowId].taskId,
        taskName: this.tepRequestList[this.selectedRowId].taskName
      });
    }
  }

  onCellEditingStarted(event) {
    this.mapTopPanelValue(event);
  }
  onCellFocused(event) {
    this.mapTopPanelValue(event);
  }
  mapTopPanelValue(event) {
    this.isFocusing = true;
    this.focusedHeaderName = event.column.colDef.headerName;
    this.currentRowIndex = Number(event.rowIndex);
    this.currentRowField = event.column.colDef.field;
    var node = this.gridApi.getDisplayedRowAtIndex(this.currentRowIndex);
    var data = this.gridApi.getValue(this.currentRowField, node);
    this.currentRowInfo = typeof data === 'object' && data ? data.value : data;
    if (this.currentRowField === 'cmDate' || this.currentRowField === 'reqDate')
      this.currentRowInfo = this.dateFormatterService.format(
        moment(this.currentRowInfo)
      );
  }
  focusOut(event) {
    this.isFocusing = false;
  }
}
