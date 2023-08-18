import {
  DeleteRowComponent,
  InputValidatorComponent,
  EditItemComponent
} from '@poss-web/shared/components/ui-ag-grid';
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import {
  PaymentDetails,
  PaymentModeEnum,
  UnipayTransationStatusEnum,
  EditCashDetails,
  PaymentGroupEnum,
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  PaymentStatusEnum
} from '@poss-web/shared/models';
import { takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import {
  CurrencySymbolService,
  CurrencyFormatterService,
  DateFormatterService
} from '@poss-web/shared/components/ui-formatters';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'poss-web-payment-details',
  templateUrl: './payment-details.component.html',
  styleUrls: ['./payment-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentDetailsComponent implements OnInit, OnDestroy, OnChanges {
  @Input() paymentDetails: PaymentDetails[] = [];

  @Input() minValue = 0;
  @Input() totalPaidAmount = 0;
  @Input() enableEditCashPayment = false;
  @Input() cashPaymentGroup: PaymentGroupEnum;
  @Input() currencyCode: string;
  // TODO max cash limit check
  @Input() maxCashLimit: number;
  @Input() totalAmountDue = 0;
  @Input() tcsToBeCollected: number;

  get maxLimit() {
    if (this.maxCashLimit == null) {
      return this.totalAmountDue;
    }
    return this.maxCashLimit < this.totalAmountDue
      ? this.maxCashLimit
      : this.totalAmountDue;
  }

  @Output() delete = new EventEmitter<PaymentDetails>();
  @Output() editCash = new EventEmitter<EditCashDetails>();
  @Output() editCashError = new EventEmitter<{
    paymentId: string;
    maxLimit: number;
    type?: string;
  }>();

  rowData = [];
  gridApi: GridReadyEvent;
  api: GridApi;
  destroy$ = new Subject();

  columnDefs: any[] = [];
  defaultColDef = {
    resizable: false,
    suppressMovable: true
  };
  domLayout = 'autoHeight';
  amountLabel: string;
  tooltipShowDelay = 0;
  component: any = this;
  constructor(
    private dialog: MatDialog,
    private currencySymbolService: CurrencySymbolService,
    private currencyFormatterService: CurrencyFormatterService,
    private dateFormatterService: DateFormatterService,
    private fieldValidatorsService: FieldValidatorsService,
    private translate: TranslateService,
    private alertPopupService: AlertPopupServiceAbstraction
  ) {}

  ngOnInit() {
    const paymenMethodColHeader = 'pw.paymentDetails.paymenMethodColHeader';
    const instrumentNoColHeader = 'pw.paymentDetails.instrumentNoColHeader';
    const instrumentTypeColHeader = 'pw.paymentDetails.instrumentTypeColHeader';
    const dateColHeader = 'pw.paymentDetails.dateColHeader';
    const bankNameColHeader = 'pw.paymentDetails.bankNameColHeader';
    const amountColHeader = 'pw.paymentDetails.amountColHeader';
    const totalCashCollectedColHeader =
      'pw.paymentDetails.totalCashCollectedColHeader';
    const amountLabelkey = 'pw.paymentDetails.amountLabel';

    this.translate
      .get([
        paymenMethodColHeader,
        instrumentNoColHeader,
        instrumentTypeColHeader,
        dateColHeader,
        bankNameColHeader,
        amountColHeader,
        totalCashCollectedColHeader,
        amountLabelkey
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: string) => {
        this.amountLabel = translatedMessages[amountLabelkey];
        this.columnDefs = [
          {
            minWidth: 23,
            width: 23,
            cellClass: 'pw-delete-icon-width',
            headerClass: 'pw-delete-icon-width',
            cellRenderer: params => {
              switch (params.data.status) {
                case PaymentStatusEnum.COMPLETED: {
                  return `<span class="pw-i-24 pw-arrow-circle-green-icon-24 alignCenter"></span>`;
                }
                case PaymentStatusEnum.FAILED: {
                  return `<span class="pw-i-24 pw-error-circle-icon-24 alignCenter"></span>`;
                }
                case PaymentStatusEnum.OPEN: {
                  return `<span class="pw-i-24 pw-warning-circle-icon-24 alignCenter"></span>`;
                }
                case PaymentStatusEnum.INPROGRESS: {
                  return `<span class="pw-i-24 pw-warning-circle-icon-24 alignCenter"></span>`;
                }
                default: {
                  break;
                }
              }
              // if (params.data.status === PaymentStatusEnum.COMPLETED) {
              //   if (params.data.status)
              //     return { backgroundColor: '#1eb496', padding: '0px' };
              // }
            }
          },
          {
            field: 'paymentCode',
            headerName: translatedMessages[paymenMethodColHeader],
            width: 150
          },
          {
            field: 'instrumentNo',
            headerName: translatedMessages[instrumentNoColHeader],
            width: 150
          },
          {
            field: 'instrumentType',
            headerName: translatedMessages[instrumentTypeColHeader],
            width: 150
          },
          {
            field: 'instrumentDate',
            headerName: translatedMessages[dateColHeader],
            valueFormatter: params => {
              return this.dateFormatterService.format(params.value);
            },
            width: 150
          },
          {
            field: 'bankName',
            headerName: translatedMessages[bankNameColHeader],
            width: 150,
            tooltipField: 'bankName'
          },

          {
            field: 'amount',
            isAmount: true,
            allowDecimal: false,
            headerName:
              translatedMessages[amountColHeader] +
              ' (' +
              this.currencySymbolService.get(this.currencyCode) +
              ')',
            type: 'numericColumn',
            cellClass: 'pw-justify-content-end',
            singleClickEdit: true,
            width: 150,
            cellRendererSelector: params => {
              if (
                params.data.paymentCode === PaymentModeEnum.CASH &&
                this.enableEditCashPayment &&
                !!params.data.isEditable
              )
                return {
                  component: 'editItemComponent'
                };
              else {
                return null;
              }
            },
            editable: params => {
              return (
                params.data.paymentCode === PaymentModeEnum.CASH &&
                this.enableEditCashPayment &&
                !!params.data.isEditable
              );
            },
            cellEditorFramework: InputValidatorComponent,
            cellClassRules: {
              'pw-gray-border': params => {
                return params.data.amount.isValid === true;
              },
              'pw-error-border': params => {
                return params.data.amount.isValid === false;
              }
            },
            valueGetter: params => {
              const amount =
                typeof params.data.amount === 'object'
                  ? params.data.amount.value
                  : params.data.amount;

              if (amount === '' || isNaN(amount)) {
                return 0;
              }
              return amount;
            },
            valueFormatter: params => {
              const amount =
                typeof params.data.amount === 'object'
                  ? params.data.amount.value
                  : params.data.amount;

              if (amount === '' || isNaN(amount)) {
                return amount;
              }
              return this.currencyFormatterService.format(
                amount,
                this.currencyCode,
                false
              );
            }
          },
          {
            headerName:
              translatedMessages[totalCashCollectedColHeader] +
              ' (' +
              this.currencySymbolService.get(this.currencyCode) +
              ')',
            cellClass: 'pw-justify-content-end',
            type: 'numericColumn',
            width: 150,
            valueGetter: params => {
              // if (this.checkForCash(params.data.paymentCode)) {
              //  const amount =
              // typeof params.data.cashCollected === 'object'
              //   ? params.data.cashCollected.value
              // :data.cashCollected;

              const amount = params.data.cashCollected;

              if (isNaN(amount) || amount === 0) {
                return '';
              }
              return this.currencyFormatterService.format(
                amount,
                this.currencyCode,
                false
              );
              // } else {
              //   return '';
              // }
            }
          },

          {
            celId: 'delete',
            width: 21,
            minWidth: 21,
            maxWidth: 21,
            cellClass: 'pw-delete-icon-width',
            headerClass: 'pw-delete-icon-width',
            cellRendererSelector: params => {
              if (!!params.data.isDeletable)
                return {
                  component: 'deleteRowComponent'
                };
              else {
                return null;
              }
            }
          }
        ];
      });

    this.checkPaymentDetails();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['paymentDetails']) {
      this.checkPaymentDetails();
    }

    if (changes['enableEditCashPayment'] && this.gridApi) {
      this.gridApi.api.refreshCells({
        force: true
      });
      this.gridApi.api.redrawRows();
    }
  }
  getComponents() {
    return {
      editItemComponent: EditItemComponent,
      deleteRowComponent: DeleteRowComponent
    };
  }

  onCellValueChanged(changeEvent) {
    const oldValue = Number(changeEvent.data.amount.oldValue);
    const newValue = Number(changeEvent.data.amount.value);

    if (
      (changeEvent.data.amount.isValid && newValue !== oldValue) ||
      newValue === 0
    ) {
      this.editCashPayment(changeEvent.data.id, newValue, oldValue);
    }
  }

  getContext() {
    return {
      componentParent: this.component,
      validators: {
        amount: [
          this.fieldValidatorsService.requiredField(this.amountLabel),
          this.fieldValidatorsService.minAmount(
            1,
            this.amountLabel,
            this.currencyCode
          )
        ]
      },
      gridApi: this.api
    };
  }

  checkPaymentDetails() {
    // TODO : check the delete flow for in progress payment
    this.paymentDetails
      .filter(x => {
        if (
          x.paymentCode === PaymentModeEnum.UNIPAY &&
          (x.status === UnipayTransationStatusEnum.IN_PROGRESS ||
            x.status === UnipayTransationStatusEnum.OPEN)
        ) {
          return x;
        }
      })
      .forEach((x: PaymentDetails) => {
        this.delete.emit(x);
      });
    this.rowData = [];
    this.paymentDetails.forEach(payment => {
      this.rowData.push({ ...payment });
    });
  }

  openConfirmDialogForDelete(payment: PaymentDetails) {
    if (payment.isDeletable) {
      this.alertPopupService
        .open({
          type: AlertPopupTypeEnum.CONFIRM,
          message: 'pw.paymentDetails.deleteConfirmationMessage'
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe((res: boolean) => {
          if (res) {
            this.delete.emit(payment);
          }
        });
    }
  }

  checkForCash(paymentMode: PaymentModeEnum): boolean {
    return paymentMode === PaymentModeEnum.CASH;
  }

  getTotalCashCollected(): number {
    return (
      this.paymentDetails
        // .filter(payment => this.checkForCash(payment.paymentCode))

        .map(payment => payment.cashCollected)
        .filter(amount => !isNaN(amount))
        .reduce((amount1, amount2) => amount1 + amount2, 0)
    );
  }

  gridReady(params: GridReadyEvent) {
    params.api.sizeColumnsToFit();
    this.gridApi = params;
    this.api = params.api;
  }

  onGridSizeChanged(params: GridReadyEvent) {
    if (window.innerWidth >= 991) {
      params.api.sizeColumnsToFit();
    }

    // this.api.sizeColumnsToFit();
  }

  onCellKeyPress(event) {
    const keyPressed = event.event.key;
    if (keyPressed === 'Enter' && event.colDef.celId === 'delete') {
      if (event.data.isDeletable) {
        this.openConfirmDialogForDelete(event.data);
      }
    }
  }
  onCellClicked(event) {
    // if (event.colDef.celId === 'delete') {
    //   if (event.data.isDeletable) {
    //     this.openConfirmDialogForDelete(event.data);
    //   }
    // }
  }

  editCashPayment(paymentId: string, newAmount: number, oldAmount: number) {
    const newLimt = this.maxLimit + oldAmount;
    if (newAmount === 0) {
      this.editCashError.emit({
        paymentId: paymentId,
        maxLimit: Math.floor(newLimt),
        type: 'Minimum'
      });
    } else if (newAmount <= newLimt) {
      this.editCash.emit({
        paymentId: paymentId,
        paymentGroup: this.cashPaymentGroup,
        details: { amount: newAmount }
      });
    } else {
      this.editCashError.emit({
        paymentId: paymentId,
        maxLimit: Math.floor(newLimt),
        type: 'Others'
      });
    }
  }

  advanceBookingBalance() {
    if (this.minValue - this.totalPaidAmount > 0) {
      return this.minValue - this.totalPaidAmount;
    } else {
      return 0;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
