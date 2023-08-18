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
  RefundOptionTypes,
  RefundListItem,
  GiftCardsGridEnum,
  EditRefundItemPayload,
  OverlayNotificationType,
  OverlayNotificationEventRef,
  OverlayNotificationServiceAbstraction,
  RefundStatusEnum,
  RefundStatusDescriptionEnum
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
import { AddUtrDetailsButtonComponent } from '@poss-web/shared/components/ui-ag-grid';
import { AddChequeDetailsButtonComponent } from '@poss-web/shared/components/ui-ag-grid';
import { UtrDetailsPopUpComponent } from '../utr-details-pop-up/utr-details-pop-up.component';
import { FormArray, FormGroup } from '@angular/forms';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { ChequeDetailsPopUpComponent } from '../cheque-details-pop-up/cheque-details-pop-up.component';
import {
  SelectionDailogOption,
  SelectionDialogService
} from '@poss-web/shared/components/ui-selection-dialog';

@Component({
  selector: 'poss-web-refund-list-grid',
  templateUrl: './refund-list-grid.component.html'
})
export class RefundListGridComponent implements OnInit, OnChanges {
  @Input() tepRefundList: RefundListItem[];
  // @Input() disableButton: boolean;
  @Input() pageIndex: number;
  @Input() refundType: string;

  @Input() count = 0;

  @Input() pageSizeOptions: number[];
  @Input() minPageSize = 0;
  @Input() pageEvent: PageEvent;
  // @Input() pageSize = 10;

  // @Output() cellClicked = new EventEmitter<tepApprovalListResponse>();
  @Output() paginator = new EventEmitter<PageEvent>();
  // @Output() saveStatus = new EventEmitter<SaveCnApproval>();
  @Output() viewIdProofCopy = new EventEmitter<any>();
  @Output() emitEditedRefundItem = new EventEmitter<any>();
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

  locationCodeLabel: string;
  tepNoLabel: string;
  tepDateLabel: string;
  customerNameLabel: string;
  netRefundValueLabel: string;
  accountHolderNameLabel: string;
  bankNameLabel: string;
  accountNoLabel: string;
  branchLabel: string;
  ifscCodeLabel: string;
  addUtrDetailsButtonLabel: string;
  nameAsPerBankLabel: string;
  idProofLabel: string;
  editChequeDetailsButtonLabel: string;
  addUtrDetailsHeadingLabel: string;
  utrNumberPlaceholderLabel: string;
  clear: string;
  ok: string;
  addChequeDetailsHeadingLabel: string;
  chequeNumberPlaceholderLabel: string;
  payeeNamePlaceholderLabel: string;
  bankNamePlaceholderLabel: string;
  micrCodePlaceholderLabel: string;
  selectedRowId: any;

  refundListGridComponent: any = this;

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
    private fieldValidatorsService: FieldValidatorsService,
    private overlayNotificationServiceAbstraction: OverlayNotificationServiceAbstraction,
    private selectionDialog: SelectionDialogService,
    @Inject(POSS_WEB_CURRENCY_CODE) public defaultCurrencyCode
  ) {
    this.translate
      .get([
        'pw.regularTepApproval.locationCodeLabel',
        'pw.regularTepApproval.tepNoLabel',
        'pw.regularTepApproval.tepDateLabel',
        'pw.regularTepApproval.customerNameLabel',
        'pw.regularTepApproval.netRefundValueLabel',
        'pw.regularTepApproval.accountHolderNameLabel',
        'pw.regularTepApproval.bankNameLabel',
        'pw.regularTepApproval.accountNoLabel',
        'pw.regularTepApproval.branchLabel',
        'pw.regularTepApproval.ifscCodeLabel',
        'pw.regularTepApproval.addUtrDetailsButtonLabel',
        'pw.regularTepApproval.nameAsPerBankLabel',
        'pw.regularTepApproval.idProofLabel',
        'pw.regularTepApproval.editChequeDetailsButtonLabel',
        'pw.regularTepApproval.addUtrDetailsHeadingLabel',
        'pw.regularTepApproval.utrNumberPlaceholderLabel',
        'pw.regularTepApproval.clear',
        'pw.regularTepApproval.ok',
        'pw.regularTepApproval.addChequeDetailsHeadingLabel',
        'pw.regularTepApproval.chequeNumberPlaceholderLabel',
        'pw.regularTepApproval.payeeNamePlaceholderLabel',
        'pw.regularTepApproval.bankNamePlaceholderLabel',
        'pw.stone.micrCodePlaceholderLabel'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.locationCodeLabel =
          translatedMessages['pw.regularTepApproval.locationCodeLabel'];
        this.tepNoLabel =
          translatedMessages['pw.regularTepApproval.tepNoLabel'];
        this.tepDateLabel =
          translatedMessages['pw.regularTepApproval.tepDateLabel'];
        this.customerNameLabel =
          translatedMessages['pw.regularTepApproval.customerNameLabel'];
        this.netRefundValueLabel =
          translatedMessages['pw.regularTepApproval.netRefundValueLabel'];
        this.accountHolderNameLabel =
          translatedMessages['pw.regularTepApproval.accountHolderNameLabel'];
        this.bankNameLabel =
          translatedMessages['pw.regularTepApproval.bankNameLabel'];
        this.accountNoLabel =
          translatedMessages['pw.regularTepApproval.accountNoLabel'];
        this.branchLabel =
          translatedMessages['pw.regularTepApproval.branchLabel'];
        this.ifscCodeLabel =
          translatedMessages['pw.regularTepApproval.ifscCodeLabel'];
        this.addUtrDetailsButtonLabel =
          translatedMessages['pw.regularTepApproval.addUtrDetailsButtonLabel'];
        this.nameAsPerBankLabel =
          translatedMessages['pw.regularTepApproval.nameAsPerBankLabel'];
        this.idProofLabel =
          translatedMessages['pw.regularTepApproval.idProofLabel'];
        this.editChequeDetailsButtonLabel =
          translatedMessages[
            'pw.regularTepApproval.editChequeDetailsButtonLabel'
          ];
        this.addUtrDetailsHeadingLabel =
          translatedMessages['pw.regularTepApproval.addUtrDetailsHeadingLabel'];
        this.utrNumberPlaceholderLabel =
          translatedMessages['pw.regularTepApproval.utrNumberPlaceholderLabel'];
        this.clear = translatedMessages['pw.regularTepApproval.clear'];
        this.ok = translatedMessages['pw.regularTepApproval.ok'];
        this.addChequeDetailsHeadingLabel =
          translatedMessages[
            'pw.regularTepApproval.addChequeDetailsHeadingLabel'
          ];
        this.chequeNumberPlaceholderLabel =
          translatedMessages[
            'pw.regularTepApproval.chequeNumberPlaceholderLabel'
          ];
        this.payeeNamePlaceholderLabel =
          translatedMessages['pw.regularTepApproval.payeeNamePlaceholderLabel'];
        this.bankNamePlaceholderLabel =
          translatedMessages['pw.regularTepApproval.bankNamePlaceholderLabel'];
        this.micrCodePlaceholderLabel =
          translatedMessages['pw.regularTepApproval.micrCodePlaceholderLabel'];
      });
  }

  ngOnInit(): void {
    if (this.refundType === RefundOptionTypes.CHEQUE) {
      this.columnDefs = [
        {
          checkboxSelection: true,
          minWidth: 40,
          width: 40,
          pinned: 'left',
          lockPinned: true
        },
        {
          headerName: this.locationCodeLabel,
          field: 'locationCode'
        },
        {
          headerName: this.tepNoLabel,
          field: 'tepNo'
        },
        {
          headerName: this.tepDateLabel,
          field: 'tepDate',
          valueFormatter: params => {
            return this.dateFormatterService.format(moment(params.value));
          }
        },
        {
          headerName: this.customerNameLabel,
          field: 'customerName'
        },
        {
          headerName: this.netRefundValueLabel,
          field: 'netRefundValue'
        },
        {
          headerName: this.nameAsPerBankLabel,
          field: 'nameAsPerBank',
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
                this.updateAccountHolderNameData();
                return params.value.value;
              } else {
                return '';
              }
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
          headerName: this.idProofLabel,
          field: 'idProof',
          cellRenderer: params => this.viewAnchorRenderer(params)
        },
        {
          headerName: 'Status',
          field: 'status',
          cellRendererSelector: () => {
            return this.editItemRenderer(true);
          },
          cellClass: 'pw-fourth-color',
          editable: () => true,
          singleClickEdit: true
        },
        {
          headerName: '',
          field: 'chequeDetails',
          cellRendererSelector: params => {
            return {
              component: 'addChequeDetailsButtonRenderer'
            };
          },
          cellClass: 'justify-content-center'
        }
      ];
    } else if (this.refundType === RefundOptionTypes.RTGS) {
      this.columnDefs = [
        {
          checkboxSelection: true,
          minWidth: 40,
          width: 40,
          pinned: 'left',
          lockPinned: true
        },
        {
          headerName: this.locationCodeLabel,
          field: 'locationCode'
        },
        {
          headerName: this.tepNoLabel,
          field: 'tepNo'
        },
        {
          headerName: this.tepDateLabel,
          field: 'tepDate',
          valueFormatter: params => {
            return this.dateFormatterService.format(moment(params.value));
          }
        },
        {
          headerName: this.customerNameLabel,
          field: 'customerName'
        },
        {
          headerName: this.netRefundValueLabel,
          field: 'netRefundValue'
        },
        {
          headerName: this.accountHolderNameLabel,
          field: 'accountHolderName',
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
          headerName: this.bankNameLabel,
          field: 'bankName',
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
          headerName: this.accountNoLabel,
          field: 'accountNo',
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
          headerName: this.branchLabel,
          field: 'branch',
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
          headerName: this.ifscCodeLabel,
          field: 'ifscCode',
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
          headerName: 'Status',
          field: 'status',
          cellRendererSelector: () => {
            return this.editItemRenderer(true);
          },
          cellClass: 'pw-fourth-color',
          editable: () => true,
          singleClickEdit: true
        },
        {
          headerName: '',
          field: 'utrDetails',
          cellRendererSelector: params => {
            return {
              component: 'addUtrDetailsButtonRenderer'
            };
          },
          cellClass: 'justify-content-center'
        }
      ];
    }
    this.totalPages = 1;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.cdr.markForCheck();
    console.log('PAGE EVENT :', this.pageEvent);
    if (changes['tepRefundList']) {
      console.log('TEP REFUND LIST :', this.tepRefundList);
      this.rowData = [];
      this.addRowData();
      this.disable = true;
    } else {
      this.rowData = [];
    }
  }

  statusEditor(params: any) {
    let possibleStatusValues = [];
    if (
      params &&
      (params.rowIndex || params.rowIndex === 0) &&
      this.tepRefundList[params.rowIndex].status ===
        RefundStatusEnum.PENDING_FROM_RO
    ) {
      possibleStatusValues = [
        RefundStatusDescriptionEnum.PENDING_FROM_RO,
        RefundStatusDescriptionEnum.REFUNDED,
        RefundStatusDescriptionEnum.REJECTED
      ];
    } else if (
      params &&
      (params.rowIndex || params.rowIndex === 0) &&
      this.tepRefundList[params.rowIndex].status === RefundStatusEnum.REJECTED
    ) {
      possibleStatusValues = [
        RefundStatusDescriptionEnum.REJECTED,
        RefundStatusDescriptionEnum.CANCELLED
      ];
    } else if (
      params &&
      (params.rowIndex || params.rowIndex === 0) &&
      this.tepRefundList[params.rowIndex].status === RefundStatusEnum.REFUNDED
    ) {
      possibleStatusValues = [
        RefundStatusDescriptionEnum.REFUNDED,
        RefundStatusDescriptionEnum.ALLOWED_TO_CANCEL
      ];
    } else if (
      params &&
      (params.rowIndex || params.rowIndex === 0) &&
      this.tepRefundList[params.rowIndex].status ===
        RefundStatusEnum.ALLOWED_TO_CANCEL
    ) {
      possibleStatusValues = [
        RefundStatusDescriptionEnum.ALLOWED_TO_CANCEL,
        RefundStatusDescriptionEnum.CANCELLED
      ];
    } else if (
      params &&
      (params.rowIndex || params.rowIndex === 0) &&
      this.tepRefundList[params.rowIndex].status ===
        RefundStatusEnum.APPROVAL_PENDING
    ) {
      possibleStatusValues = [RefundStatusDescriptionEnum.APPROVAL_PENDING];
    } else if (
      params &&
      (params.rowIndex || params.rowIndex === 0) &&
      this.tepRefundList[params.rowIndex].status === RefundStatusEnum.CANCELLED
    ) {
      possibleStatusValues = [RefundStatusDescriptionEnum.CANCELLED];
    }
    return {
      component: 'agSelectCellEditor',
      params: {
        values: possibleStatusValues
      }
    };
  }

  getPossibleStatus(params: any) {
    console.log('PARAMS :', params);
    let possibleStatusValues = [];
    if (
      params &&
      (params.rowIndex || params.rowIndex === 0) &&
      this.tepRefundList[params.rowIndex].status ===
        RefundStatusEnum.PENDING_FROM_RO
    ) {
      possibleStatusValues = [
        RefundStatusDescriptionEnum.PENDING_FROM_RO,
        RefundStatusDescriptionEnum.REFUNDED,
        RefundStatusDescriptionEnum.REJECTED
      ];
    } else if (
      params &&
      (params.rowIndex || params.rowIndex === 0) &&
      this.tepRefundList[params.rowIndex].status === RefundStatusEnum.REJECTED
    ) {
      possibleStatusValues = [
        RefundStatusDescriptionEnum.REJECTED,
        RefundStatusDescriptionEnum.CANCELLED
      ];
    } else if (
      params &&
      (params.rowIndex || params.rowIndex === 0) &&
      this.tepRefundList[params.rowIndex].status === RefundStatusEnum.REFUNDED
    ) {
      possibleStatusValues = [
        RefundStatusDescriptionEnum.REFUNDED,
        RefundStatusDescriptionEnum.ALLOWED_TO_CANCEL
      ];
    } else if (
      params &&
      (params.rowIndex || params.rowIndex === 0) &&
      this.tepRefundList[params.rowIndex].status ===
        RefundStatusEnum.ALLOWED_TO_CANCEL
    ) {
      possibleStatusValues = [
        RefundStatusDescriptionEnum.ALLOWED_TO_CANCEL,
        RefundStatusDescriptionEnum.CANCELLED
      ];
    } else if (
      params &&
      (params.rowIndex || params.rowIndex === 0) &&
      this.tepRefundList[params.rowIndex].status ===
        RefundStatusEnum.APPROVAL_PENDING
    ) {
      possibleStatusValues = [RefundStatusDescriptionEnum.APPROVAL_PENDING];
    } else if (
      params &&
      (params.rowIndex || params.rowIndex === 0) &&
      this.tepRefundList[params.rowIndex].status === RefundStatusEnum.CANCELLED
    ) {
      possibleStatusValues = [RefundStatusDescriptionEnum.CANCELLED];
    }

    return possibleStatusValues;
  }

  editItemRenderer(isEditable: boolean) {
    if (isEditable) {
      return { component: 'editItemRenderer' };
    } else {
      return null;
    }
  }

  updateAccountHolderNameData() {
    const rowData = [];
    this.gridApi.forEachNode(node => {
      const nodeObject = {
        ...node.data,
        accountHolderName:
          node.data.accountHolderName && node.data.accountHolderName.value
            ? node.data.accountHolderName.value
            : node.data.accountHolderName && !node.data.accountHolderName.value
            ? node.data.accountHolderName
            : 0
      };
      rowData.push(nodeObject);
    });
  }

  getContext() {
    return {
      formGroup: this.parentForm.controls,
      componentParent: this.refundListGridComponent,
      validators: {
        accountHolderName: [
          this.fieldValidatorsService.requiredField('Account Holder Name')
        ],
        bankName: [this.fieldValidatorsService.requiredField('Bank Name')],
        accountNo: [this.fieldValidatorsService.requiredField('Account No')],
        branch: [this.fieldValidatorsService.requiredField('Branch')],
        ifscCode: [this.fieldValidatorsService.requiredField('IFSC Code')]
      }
    };
  }

  viewAnchorRenderer(params) {
    return `<a class="pw-anchor-underline">View</a>`;
  }

  onCellClicked(event) {
    if (event.column.getColId() === 'idProof') {
      if (event && event.data && event.data.tepNo) {
        const eventObj = this.tepRefundList.filter(
          (tepItem: RefundListItem) => {
            return tepItem.docNo === event.data.tepNo;
          }
        );
        this.viewIdProofCopy.emit(eventObj[0]);
      }
    } else if (event.column.getColId() === 'status') {
      this.openStatusSelectionPopUp(event);
    }
  }

  openStatusSelectionPopUp(eventData) {
    console.log('EVENTDATA :', eventData);
    this.dialog.closeAll();
    const possibleStatusList = this.getPossibleStatus(eventData);
    const statusForSelection = possibleStatusList.map(status => ({
      id: status,
      description: status
    }));
    this.selectionDialog
      .open({
        title: 'Status',
        placeholder: 'Select Status',
        options: statusForSelection
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((selectedOption: SelectionDailogOption) => {
        if (selectedOption) {
          eventData.data.status = selectedOption.id;
          console.log('EVENT DATA 123 :', eventData.data.status);
          console.log('rowDetails :', this.rowData);
          const rowDetails = [];
          this.gridApi.forEachNode((node, index) => {
            const nodeObject = {
              ...node.data,
              status:
                eventData.rowIndex === index
                  ? eventData.data.status
                  : node.data.status
            };
            rowDetails.push(nodeObject);
          });
          this.rowData = [...rowDetails];
          console.log('Row Data :', this.rowData);
        }
      });
  }

  getComponents() {
    return {
      addUtrDetailsButtonRenderer: AddUtrDetailsButtonComponent,
      addChequeDetailsButtonRenderer: AddChequeDetailsButtonComponent,
      inputValidator: InputValidatorComponent,
      editItemComponent: EditItemComponent
    };
  }

  addRowData() {
    if (this.tepRefundList && this.tepRefundList.length > 0) {
      for (const data of this.tepRefundList) {
        if (this.refundType === RefundOptionTypes.CHEQUE) {
          this.rowData.push({
            locationCode: data.locationCode,
            tepNo: data.docNo,
            tepDate: data.docDate,
            customerName: data.headerData.data.customerName,
            netRefundValue: data.headerData.data.totalRefundAmount
              ? data.headerData.data.totalRefundAmount
              : data.headerData.data.totalValue,
            nameAsPerBank: data.approvedData.data.customerName,
            chequeNumber: data.approvedData.data.chequeNumber
              ? data.approvedData.data.chequeNumber
              : null,
            payeeName: data.approvedData.data.customerName
              ? data.approvedData.data.customerName
              : null,
            bankName: data.approvedData.data.bankName
              ? data.approvedData.data.bankName
              : null,
            micrCode: data.approvedData.data.micrCode
              ? data.approvedData.data.micrCode
              : null,
            status: this.getStatusLabel(data.status)
          });
        } else if (this.refundType === RefundOptionTypes.RTGS) {
          this.rowData.push({
            locationCode: data.locationCode,
            tepNo: data.docNo,
            tepDate: data.docDate,
            customerName: data.headerData.data.customerName,
            netRefundValue: data.headerData.data.totalRefundAmount
              ? data.headerData.data.totalRefundAmount
              : data.headerData.data.totalValue,
            accountHolderName: data.approvedData.data.customerName,
            bankName: data.approvedData.data.bankName,
            branch: data.approvedData.data.branchName,
            accountNo: data.approvedData.data.bankAccountNo,
            ifscCode: data.approvedData.data.ifscCode,
            utrDetails: data.approvedData.data.utrNumber
              ? data.approvedData.data.utrNumber
              : null,
            status: this.getStatusLabel(data.status)
          });
        }
      }
    } else {
      this.rowData = [];
    }
  }

  getStatusLabel(status: string): string {
    let statusLabel = null;
    if (status) {
      switch (status) {
        case RefundStatusEnum.APPROVAL_PENDING:
          statusLabel = RefundStatusDescriptionEnum.APPROVAL_PENDING;
          break;
        case RefundStatusEnum.CANCELLED:
          statusLabel = RefundStatusDescriptionEnum.CANCELLED;
          break;
        case RefundStatusEnum.PENDING_FROM_RO:
          statusLabel = RefundStatusDescriptionEnum.PENDING_FROM_RO;
          break;
        case RefundStatusEnum.REFUNDED:
          statusLabel = RefundStatusDescriptionEnum.REFUNDED;
          break;
        case RefundStatusEnum.REJECTED:
          statusLabel = RefundStatusDescriptionEnum.REJECTED;
          break;
        case RefundStatusEnum.ALLOWED_TO_CANCEL:
          statusLabel = RefundStatusDescriptionEnum.ALLOWED_TO_CANCEL;
          break;
      }
    }
    return statusLabel;
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
  }

  showUtrDetailsPopUp(index: number) {
    this.openUtrDetailsPopUp(index);
  }

  showChequeDetailsPopUp(index: number) {
    this.openChequeDetailsPopUp(index);
  }

  openChequeDetailsPopUp(index: number) {
    const dialogRef = this.dialog.open(ChequeDetailsPopUpComponent, {
      autoFocus: false,
      data: {
        index: index,
        chequeNumber: this.rowData[index].chequeNumber,
        payeeName: this.rowData[index].payeeName,
        bankName: this.rowData[index].bankName,
        micrCode: this.rowData[index].micrCode
      },
      width: '300px'
    });

    dialogRef.afterClosed().subscribe((chequeDetails: any) => {
      if (chequeDetails) {
        this.rowData[index].chequeNumber = chequeDetails.chequeNumber;
        this.rowData[index].payeeName = chequeDetails.payeeName;
        this.rowData[index].bankName = chequeDetails.bankName;
        this.rowData[index].micrCode = chequeDetails.micrCode;
      }
    });
  }

  openUtrDetailsPopUp(index: number) {
    const dialogRef = this.dialog.open(UtrDetailsPopUpComponent, {
      autoFocus: false,
      data: {
        index: index,
        utrNumber: this.rowData[index].utrDetails
      },
      width: '300px'
    });

    dialogRef.afterClosed().subscribe((utrNumber: number) => {
      if (utrNumber) {
        this.rowData[index].utrDetails = utrNumber;
      }
    });
  }

  send() {
    let selectedData = this.gridApi.getSelectedRows()[0];
    if (this.refundType === RefundOptionTypes.RTGS) {
      selectedData = {
        ...selectedData,
        accountHolderName:
          selectedData.accountHolderName && selectedData.accountHolderName.value
            ? selectedData.accountHolderName.value
            : selectedData.accountHolderName
            ? selectedData.accountHolderName
            : null,
        bankName:
          selectedData.bankName && selectedData.bankName.value
            ? selectedData.bankName.value
            : selectedData.bankName
            ? selectedData.bankName
            : null,
        accountNo:
          selectedData.accountNo && selectedData.accountNo.value
            ? selectedData.accountNo.value
            : selectedData.accountNo
            ? selectedData.accountNo
            : null,
        branch:
          selectedData.branch && selectedData.branch.value
            ? selectedData.branch.value
            : selectedData.branch
            ? selectedData.branch
            : null,
        ifscCode:
          selectedData.ifscCode && selectedData.ifscCode.value
            ? selectedData.ifscCode.value
            : selectedData.ifscCode
            ? selectedData.ifscCode
            : null
      };
    } else if (this.refundType === RefundOptionTypes.CHEQUE) {
      selectedData = {
        ...selectedData,
        nameAsPerBank:
          selectedData.nameAsPerBank && selectedData.nameAsPerBank.value
            ? selectedData.nameAsPerBank.value
            : selectedData.nameAsPerBank
            ? selectedData.nameAsPerBank
            : null
      };
    }
    if (this.refundType === RefundOptionTypes.RTGS) {
      const editRefundData: EditRefundItemPayload = {
        approvedData: {
          type: 'TEP_REFUND_DETAILS',
          data: {
            refundMode: this.refundType,
            utrNumber: selectedData.utrDetails,
            customerName: selectedData.accountHolderName,
            bankName: selectedData.bankName,
            bankAccountNo: selectedData.accountNo,
            branchName: selectedData.branch,
            ifscCode: selectedData.ifscCode
          }
        }
      };
      if (
        this.rowData[this.selectedRowId].status === RefundStatusEnum.REFUNDED &&
        !editRefundData.approvedData.data.utrNumber
      ) {
        console.log('editRefundData :', editRefundData);
        console.log(this.rowData[this.selectedRowId].status);
        this.showNotifications(
          'Please add UTR details for selected refund item.'
        );
      } else {
        this.emitEditedRefundItem.emit({
          data: editRefundData,
          status: this.rowData[this.selectedRowId].status
            ? this.rowData[this.selectedRowId].status.replaceAll(' ', '_')
            : null,
          index: this.selectedRowId
        });
      }
    } else if (this.refundType === RefundOptionTypes.CHEQUE) {
      const editRefundData: EditRefundItemPayload = {
        approvedData: {
          type: 'TEP_REFUND_DETAILS',
          data: {
            refundMode: this.refundType,
            chequeNumber: selectedData.chequeNumber,
            customerName: selectedData.payeeName,
            bankName: selectedData.bankName,
            micrCode: selectedData.micrCode
          }
        }
      };
      if (
        !editRefundData.approvedData.data.chequeNumber &&
        this.rowData[this.selectedRowId].status !== RefundStatusEnum.REJECTED
      ) {
        this.showNotifications(
          'Please add cheque details for selected refund item.'
        );
      } else {
        this.emitEditedRefundItem.emit({
          data: editRefundData,
          status: this.rowData[this.selectedRowId].status
            ? this.rowData[this.selectedRowId].status.replaceAll(' ', '_')
            : null,
          index: this.selectedRowId
        });
      }
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
    if (this.currentRowField === 'tepDate')
      this.currentRowInfo = this.dateFormatterService.format(
        moment(this.currentRowInfo)
      );
  }
  focusOut(event) {
    this.isFocusing = false;
  }
}
