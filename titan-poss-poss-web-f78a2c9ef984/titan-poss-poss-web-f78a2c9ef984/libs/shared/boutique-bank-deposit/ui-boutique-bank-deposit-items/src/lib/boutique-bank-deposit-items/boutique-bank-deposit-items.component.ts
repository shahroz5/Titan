import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';
import { InputValidatorComponent } from '@poss-web/shared/components/ui-ag-grid';
import { CurrencyFormatterService } from '@poss-web/shared/components/ui-formatters';
import {
  AlertPopupServiceAbstraction,
  BankDepositDetails,
  BoutiqueBankDepositEnum,
  CashDetails,
  AlertPopupTypeEnum,
  OverlayNotificationEventRef,
  OverlayNotificationEventType,
  OverlayNotificationType,
  OverlayNotificationServiceAbstraction
} from '@poss-web/shared/models';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BoutiqueBankDepositPopupComponent } from '../boutique-bank-deposit-popup/boutique-bank-deposit-popup.component';

@Component({
  selector: 'poss-web-boutique-bank-deposit-items',
  templateUrl: './boutique-bank-deposit-items.component.html',
  styleUrls: ['./boutique-bank-deposit-items.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoutiqueBankDepositItemsComponent
  implements OnInit, OnDestroy, OnChanges {
  @Input() bankDepositDetails: BankDepositDetails[];
  @Input() cashDetails: CashDetails;
  @Input() depositedAmount: number;
  @Input() pifNoResponse = null;
  @Output() emitBankDepositDetails = new EventEmitter<{
    data: any;
    selectedRows: any;
  }>();
  @Output() emitSelectedRowsId = new EventEmitter<string[]>();
  @Output() cashDenominationDetails = new EventEmitter<{
    depositDetails: any;
    ids: any;
  }>();
  @Output() emitPifNo = new EventEmitter<string[]>();

  @Input() showPopup: boolean;
  @Input() disableCashDenomitionButton: boolean;
  @Input() transactionId: string;
  @Input() disableButton;
  @Input() enableCheckBox;
  defaultColDef = {
    suppressMovable: true
  };
  @Input() bussinessDay;
  @Output() emitPrintChequeDepsoit = new EventEmitter<boolean>();
  @Output() emitPrintCashDepsoit = new EventEmitter<boolean>();
  @Input() isPasswordMandatory;
  @Input() cashDepositVariationLimit: number;
  @Input() isChequePrintEnabled: string;
  @Input() isCashPrintEnabled: string;
  @Output() emitChequePrintIds = new EventEmitter<any>();
  @Input() saveResponse: BankDepositDetails[];
  @Input() dateFormat: string;
  @Input() totalCount = 0;
  @Input() pageSizeOptions: number[] = [];
  @Input() pageEvent;
  @Input() pageSize = 10;
  @Input() minPageSize = 0;

  @Output() paginator = new EventEmitter<PageEvent>();

  checkboxes: string[];
  changeEvent = null;
  animateRows = true;
  balanceAmt = 0;
  api: GridApi;
  domLayout = 'autoHeight';
  rowSelectsion = 'multiple';
  rowHeight = '35';
  isValid = false;
  destroy$ = new Subject<null>();
  columnDefs = [];
  editable = true;
  fb: FormBuilder;
  objCategoryMappings = {};
  rowSelection = 'multiple';
  amount = 0;
  disableSaveButton = true;
  password: any = null;
  cashDenomitionFormGroup: FormGroup;
  currentDate = moment();
  totalCashAmountForCoins: number;
  selection = true;
  totalCollectedCash = 0;
  oldVlaue = 0;
  newValue = 0;
  id: string;
  amountMisMatch = false;
  rowIndex = null;
  disablePrintButton = true;
  chequePrintIds = [];
  enablePrintButton1 = true;

  constructor(
    private translate: TranslateService,
    private currencyFormatterService: CurrencyFormatterService,
    private fieldValidatorsService: FieldValidatorsService,
    private dialog: MatDialog,
    private alertPopupService: AlertPopupServiceAbstraction,
    private overlayNotification: OverlayNotificationServiceAbstraction
  ) {
    this.translate
      .get([
        'pw.boutiqueBankDeposit.collectionDateLabel',
        'pw.boutiqueBankDeposit.paymentTypeLabel',
        'pw.boutiqueBankDeposit.bankNameLabel',
        'pw.boutiqueBankDeposit.chequeNumberLabel',
        'pw.boutiqueBankDeposit.chequeDateLabel',
        'pw.boutiqueBankDeposit.amtCollectedLabel',
        'pw.boutiqueBankDeposit.openingBalanceLabel',
        'pw.boutiqueBankDeposit.depositedAmtLabel',
        'pw.boutiqueBankDeposit.payeeBankLabel',
        'pw.boutiqueBankDeposit.PIFNoLabel',
        'pw.boutiqueBankDeposit.MIDCodeLabel',
        'pw.boutiqueBankDeposit.depositedSlipDateLabel'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.columnDefs = [
          {
            headerCheckboxSelection: true,
            checkboxSelection: true,
            width: 30,
            minWidth: 30,
            pinned: 'left',
            lockPinned: true,
            cellRenderer: param => {
              this.amountMisMatch = null;
              param.node.setSelected(param.data.isSelected);
            }
          },
          {
            headerName:
              translatedMessages['pw.boutiqueBankDeposit.collectionDateLabel'],
            field: 'collectionDate',
            resizable: true,
            suppressSizeToFit: true,
            width: 100,
            minWidth: 100
          },

          {
            headerName:
              translatedMessages['pw.boutiqueBankDeposit.paymentTypeLabel'],
            field: 'paymentCode',
            resizable: true,
            suppressSizeToFit: true,
            width: 100,
            minWidth: 100
          },
          {
            headerName:
              translatedMessages['pw.boutiqueBankDeposit.bankNameLabel'],
            field: 'payerBankName',
            resizable: true,
            suppressSizeToFit: true,
            width: 80,
            minWidth: 80
          },
          {
            headerName:
              translatedMessages['pw.boutiqueBankDeposit.chequeNumberLabel'],
            field: 'instrumentNo',
            resizable: true,
            suppressSizeToFit: true,
            width: 80,
            minWidth: 80
          },
          {
            headerName:
              translatedMessages['pw.boutiqueBankDeposit.chequeDateLabel'],
            field: 'instrumentDate',
            resizable: true,
            suppressSizeToFit: true,
            width: 90,
            minWidth: 90
          },

          {
            headerName:
              translatedMessages['pw.boutiqueBankDeposit.amtCollectedLabel'],
            field: 'amount',
            resizable: true,
            suppressSizeToFit: true,
            width: 120,
            minWidth: 120,
            singleClickEdit: true,
            isAmount: true,
            valueFormatter: param => {
              if (typeof param.value === 'object' && param.value) {
                if (param.value.value) {
                  return this.currencyFormatterService.format(
                    param.value.value,
                    'INR',
                    false
                  );
                } else {
                  return '';
                }
              } else {
                return this.currencyFormatterService.format(
                  param.value ? param.value : 0,
                  'INR',
                  false
                );
              }
            }
          },
          {
            headerName:
              translatedMessages['pw.boutiqueBankDeposit.openingBalanceLabel'],
            field: 'openingBalance',
            resizable: true,
            suppressSizeToFit: true,
            width: 120,
            minWidth: 120,
            valueFormatter: param => {
              if (typeof param.value === 'object' && param.value) {
                if (param.value.value) {
                  return this.currencyFormatterService.format(
                    param.value.value,
                    'INR',
                    false
                  );
                } else {
                  return '';
                }
              } else {
                return this.currencyFormatterService.format(
                  param.value ? param.value : 0,
                  'INR',
                  false
                );
              }
            }
          },
          {
            headerName:
              translatedMessages['pw.boutiqueBankDeposit.depositedAmtLabel'],
            field: 'depositAmount',
            cellEditor: 'inputValidator',
            resizable: true,
            suppressSizeToFit: true,
            singleClickEdit: true,
            isAmount: true,
            width: 100,
            minWidth: 100,

            editable: param => {
              return (
                param.data.paymentCode.toUpperCase() === 'CASH' &&
                param.data.depositDate === null
              );
            },
            valueFormatter: data => {
              if (typeof data.value === 'object' && data.value) {
                if (data.value.value) {
                  return this.currencyFormatterService.format(
                    data.value.value,
                    'INR',
                    false
                  );
                } else {
                  return '';
                }
              } else {
                return this.currencyFormatterService.format(
                  data.value ? data.value : 0,
                  'INR',
                  false
                );
              }
            }
          },
          {
            headerName:
              translatedMessages['pw.boutiqueBankDeposit.payeeBankLabel'],
            field: 'payeeBankName',
            resizable: true,
            editable: true,
            singleClickEdit: true,
            suppressSizeToFit: true,
            cellEditorSelector: rowData => {
              return {
                component: 'agSelectCellEditor',
                params: {
                  values: rowData.data.payeeBankName
                }
              };
            },
            width: 110,
            minWidth: 110
          },
          {
            headerName: translatedMessages['pw.boutiqueBankDeposit.PIFNoLabel'],
            field: 'pifNo',
            resizable: true,
            suppressSizeToFit: true,
            width: 80,
            minWidth: 80
          },
          {
            headerName:
              translatedMessages['pw.boutiqueBankDeposit.MIDCodeLabel'],
            field: 'midCode',
            resizable: true,
            suppressSizeToFit: true,
            width: 70,
            minWidth: 70
          },
          {
            headerName:
              translatedMessages[
                'pw.boutiqueBankDeposit.depositedSlipDateLabel'
              ],
            field: 'depositDate',
            resizable: true,
            suppressSizeToFit: true,
            width: 120,
            minWidth: 120
          }
        ];
      });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['cashDetails'] ||
      changes['depositedAmount'] ||
      changes['showPopup'] ||
      changes['disableButton'] ||
      changes['disableCashDenomitionButton'] ||
      changes['bankDepositDetails'] ||
      changes['pifNoResponse']
    ) {
      if (
        this.disableButton === true ||
        (this.pifNoResponse && this.pifNoResponse !== null)
      ) {
        this.depositedAmount = this.pifNoResponse?.depositAmount
          ? this.pifNoResponse?.depositAmount
          : this.depositedAmount;
        this.totalCollectedCash = this.depositedAmount;
        this.balanceAmt = this.depositedAmount;
        if (this.pifNoResponse.denominationDetails) {
          this.cashDenomitionFormGroup
            .get('twoThousand')
            .setValue(
              this.pifNoResponse.denominationDetails.noOfTwoThousandNotes
            );
          this.cashDenomitionFormGroup
            .get('fiveHundred')
            .setValue(
              this.pifNoResponse.denominationDetails.noOFiveHundredNotes
            );
          this.cashDenomitionFormGroup
            .get('twoHundred')
            .setValue(
              this.pifNoResponse.denominationDetails.noOfTwoHundredNotes
            );
          this.cashDenomitionFormGroup
            .get('hundred')
            .setValue(this.pifNoResponse.denominationDetails.noOfHundredNotes);
          this.cashDenomitionFormGroup
            .get('fifty')
            .setValue(this.pifNoResponse.denominationDetails.noOfFiftyNotes);
          this.cashDenomitionFormGroup
            .get('twenty')
            .setValue(this.pifNoResponse.denominationDetails.noOfTwentyNotes);
          this.cashDenomitionFormGroup
            .get('ten')
            .setValue(this.pifNoResponse.denominationDetails.noOfTenNotes);
          this.cashDenomitionFormGroup
            .get('five')
            .setValue(this.pifNoResponse.denominationDetails.noOfFiveNotes);
          this.cashDenomitionFormGroup
            .get('two')
            .setValue(this.pifNoResponse.denominationDetails.noOfTwoNotes);
          this.cashDenomitionFormGroup
            .get('one')
            .setValue(this.pifNoResponse.denominationDetails.noOfOneNotes);
          this.cashDenomitionFormGroup
            .get('totalCashAmountCoins')
            .setValue(this.pifNoResponse.denominationDetails.totalCoinsAmount);
          this.enablePrintButton1 = false;
        }

        this.dialog.closeAll();
      } else if (
        this.disableCashDenomitionButton === true &&
        this.isCashPrintEnabled == 'false'
      ) {
        this.cashDenomitionFormGroup.reset({
          emitEvent: false
        });
        this.balanceAmt = 0;
        this.totalCollectedCash = 0;
      }
      if (this.showPopup) {
        this.openPopup();
      }
      const cashPaymentMode = this.api
        .getSelectedNodes()
        .filter(data => data.data.paymentCode.toUpperCase() === 'CASH');
      if (cashPaymentMode.length === this.api.getSelectedNodes().length) {
        this.cashDenomitionFormGroup.enable();
      }
      if (changes['bankDepositDetails']) {
        this.changeEvent = false;
        this.amountMisMatch = null;
        this.rowIndex = null;
        const rowSelected = this.bankDepositDetails.filter(
          data => data.isSelected === true
        );
        if (rowSelected.length <= 0) {
          this.resetCashDenomition();
        }
      }
    }

    if (changes['enableCheckBox']) {
      if (!this.enableCheckBox) {
        this.balanceAmt = 0;
        this.depositedAmount = 0;
        this.totalCollectedCash = 0;
      }
    }

    if (changes['saveResponse']) {
      if (this.saveResponse?.length > 0) {
        this.saveResponse.forEach(response => {
          this.api.forEachNode(node => {
            if (node.data.id === response.id) {
              node.setDataValue(
                'depositDate',
                moment(response.depositDate).format(this.dateFormat)
              );
              node.setDataValue('pifNo', response.pifNo);
              const cashPaymentMode = this.saveResponse.filter(
                data => data.paymentCode.toUpperCase() === 'CASH'
              );
              const cardPaymentMode = this.saveResponse.filter(
                data => data.paymentCode.toUpperCase() === 'CARD'
              );
              if (cashPaymentMode.length > 0 || cardPaymentMode.length > 0) {
                this.disableSaveButton = true;
                this.disablePrintButton = true;
              } else {
                this.disableSaveButton = true;
                this.disablePrintButton = false;
              }
            }
          });
        });
      }
    }
  }

  ngOnInit(): void {
    this.minPageSize = this.pageSizeOptions.reduce((a: number, b: number) =>
      a < b ? a : b
    );

    this.createForm();
    this.cashDenomitionFormGroup.valueChanges.subscribe(val => {
      if (val) {
        this.amount = 0;
        this.totalCashAmountForCoins = 0;
        this.amount =
          this.cashDenomitionFormGroup.get('twoThousand').value * 2000 +
          this.cashDenomitionFormGroup.get('fiveHundred').value * 500 +
          this.cashDenomitionFormGroup.get('twoHundred').value * 200 +
          this.cashDenomitionFormGroup.get('hundred').value * 100 +
          this.cashDenomitionFormGroup.get('fifty').value * 50 +
          this.cashDenomitionFormGroup.get('twenty').value * 20 +
          this.cashDenomitionFormGroup.get('ten').value * 10 +
          this.cashDenomitionFormGroup.get('five').value * 5 +
          this.cashDenomitionFormGroup.get('two').value * 2 +
          this.cashDenomitionFormGroup.get('one').value * 1;

        this.totalCashAmountForCoins = this.cashDenomitionFormGroup.get(
          'totalCashAmountCoins'
        ).value;
        this.balanceAmt =
          this.depositedAmount - this.amount - this.totalCashAmountForCoins;
      }
    });
  }

  paginate(event) {
    this.paginator.emit(event);
    this.resetCashDenomition();
  }
  printCheckDeposit() {
    this.emitPrintChequeDepsoit.emit();
  }
  printCashDeposit() {
    this.emitPrintCashDepsoit.emit();
    this.cashDenomitionFormGroup.reset({
      emitEvent: false
    });
    this.balanceAmt = 0;
    this.totalCollectedCash = 0;
  }

  createForm() {
    this.cashDenomitionFormGroup = new FormGroup({
      twoThousand: new FormControl(
        this.pifNoResponse?.denominationDetails?.noOfTwoThousandNotes
          ? this.pifNoResponse.denominationDetails.noOfTwoThousandNotes
          : '',
        this.fieldValidatorsService.numbersField('Number')
      ),

      fiveHundred: new FormControl(
        '',
        this.fieldValidatorsService.numbersField('Number')
      ),
      twoHundred: new FormControl(
        '',
        this.fieldValidatorsService.numbersField('Number')
      ),
      hundred: new FormControl(
        '',
        this.fieldValidatorsService.numbersField('Number')
      ),
      fifty: new FormControl(
        '',
        this.fieldValidatorsService.numbersField('Number')
      ),
      twenty: new FormControl(
        '',
        this.fieldValidatorsService.numbersField('Number')
      ),
      ten: new FormControl(
        '',
        this.fieldValidatorsService.numbersField('Number')
      ),
      five: new FormControl(
        '',
        this.fieldValidatorsService.numbersField('Number')
      ),
      two: new FormControl(
        '',
        this.fieldValidatorsService.numbersField('Number')
      ),
      one: new FormControl(
        '',
        this.fieldValidatorsService.numbersField('Number')
      ),
      totalCashAmountCoins: new FormControl(
        this.pifNoResponse?.denominationDetails?.totalCoinsAmount
          ? this.pifNoResponse.denominationDetails.totalCoinsAmount
          : '',
        this.fieldValidatorsService.numbersField('Total Cash Amount(Coins)')
      )
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getContext() {
    return {
      validators: {
        depositAmount: [
          this.fieldValidatorsService.numbersField('DepositAmount'),
          this.fieldValidatorsService.maxLength(10, 'DepositAmount')
        ]
      }
    };
  }

  getComponents() {
    return {
      inputValidator: InputValidatorComponent
    };
  }
  gridReady(param: GridReadyEvent) {
    this.api = param.api;
  }
  onCellValueChanged(changeEvent) {
    if (
      changeEvent.newValue.value !== '' &&
      changeEvent.newValue.value &&
      changeEvent.newValue.isValid &&
      this.amountMisMatch === null
    ) {
      this.amountMisMatch = false;
      this.id = changeEvent.data.id;
      this.rowIndex = changeEvent.rowIndex;
      this.changeEvent = changeEvent;
    } else if (
      changeEvent.newValue.value !== '' &&
      changeEvent.newValue.value &&
      changeEvent.newValue.isValid &&
      this.amountMisMatch === false
    ) {
      this.isValid = changeEvent.newValue.isValid;
      this.id = changeEvent.data.id;
      if (changeEvent.colDef.field === 'depositAmount') {
        const amount = Number(changeEvent.data.amount);
        const maximumDepositAmount = amount + this.cashDepositVariationLimit;

        const minimumDepositAmount = amount - this.cashDepositVariationLimit;

        if (
          Number(changeEvent.value.value) > maximumDepositAmount ||
          Number(changeEvent.value.value) < minimumDepositAmount
        ) {
          this.changeEvent = changeEvent;
          this.amountMisMatch = true;
          this.rowIndex = changeEvent.rowIndex;
          this.api.setFocusedCell(this.rowIndex, 'depositAmount');
          this.openPopup();
        } else {
          this.amountMisMatch = false;
        }
      }
    }
  }
  openPopup() {
    if (this.isPasswordMandatory === 'true') {
      this.dialog.closeAll();
      const dialogRef = this.dialog.open(BoutiqueBankDepositPopupComponent, {
        width: '420px',
        disableClose: true,
        data: { errorLabel: this.showPopup ? true : false }
      });
      dialogRef
        .afterClosed()
        .pipe(takeUntil(this.destroy$))
        .subscribe(data => {
          if (data !== undefined && data) {
            if (data.type === 'close') {
              this.password = data.password;
              if (this.password !== undefined) {
                this.saveDepositDetails();
              } else {
                const rowNode = this.api.getRowNode(this.rowIndex);
                rowNode.setDataValue(
                  'depositAmount',
                  this.changeEvent?.data?.actualDepositAmount
                );
                this.amountMisMatch = false;
              }
            }
          }
        });
    }
  }
  onRowSelected(event) {
    this.disableCashDenomitionButton = false;
    this.api.stopEditing();
    this.showPopup = false;
    if (
      this.amountMisMatch &&
      event.rowIndex !== this.rowIndex &&
      this.changeEvent?.rowIndex === this.rowIndex &&
      this.isPasswordMandatory === 'true'
    ) {
      this.api.setFocusedCell(this.rowIndex, 'depositAmount');
      event.node.setSelected(false);
      this.changeEvent.node.setSelected(true);
      this.openPopup();
    }
    if (this.api.getSelectedNodes().length > 0) {
      // this.balanceAmt = 0;
      // this.totalCollectedCash = 0;
      const depositedAmountRecords = this.api
        .getSelectedNodes()
        .filter(node => node.data.depositDate !== null);

      const nonDepositedRecords = this.api
        .getSelectedNodes()
        .filter(node => node.data.depositDate === null);

      const cashPaymentMode = depositedAmountRecords.filter(
        node => node.data.paymentCode.toUpperCase() === 'CASH'
      );
      const cardPaymentMode = depositedAmountRecords.filter(
        node => node.data.paymentCode.toUpperCase() === 'CARD'
      );
      for (const node of this.api.getSelectedNodes()) {
        if (node.data.paymentCode.toUpperCase() !== 'CASH') {
          this.balanceAmt = 0;
          this.totalCollectedCash = 0;
          this.depositedAmount = 0;
          break;
        } else if (node.data.depositDate === null) {
          break;
        } else if (node.data.depositDate) {
          // this.totalCollectedCash =
          //   Number(this.balanceAmt) + Number(node.data.depositAmount?.value ? node.data.depositAmount.value : node.data.depositAmount);
          // this.balanceAmt = this.totalCollectedCash;
          // this.depositedAmount = this.totalCollectedCash;
        }
      }
      if (
        nonDepositedRecords.length === 0 &&
        cashPaymentMode.length === this.api.getSelectedNodes().length
      ) {
        const pifNo = this.api.getSelectedNodes().map(node => node.data.pifNo);
        const allEqual = pifNo.every(val => val === pifNo[0]);
        if (allEqual) {
          if (this.pifNoResponse === undefined || this.pifNoResponse === null) {
            this.emitPifNo.emit(pifNo);
            this.cashDenomitionFormGroup.enable();
          }
        } else {
          this.showAlertNotification("Can't select combined PIF No.");
          this.resetCashDenomition();
        }
      } else {
        this.resetCashDenomition();
      }
      if (
        depositedAmountRecords.length === this.api.getSelectedNodes().length &&
        cashPaymentMode.length === 0 &&
        cardPaymentMode.length === 0
      ) {
        this.disableSaveButton = true;
        this.disablePrintButton = false;
        const ids = this.api.getSelectedNodes().map(node => node.data.id);
        this.emitChequePrintIds.emit(ids);
      } else if (
        nonDepositedRecords.length === this.api.getSelectedNodes().length
      ) {
        this.disableSaveButton = false;
        this.disablePrintButton = true;
      } else {
        this.disableSaveButton = true;
        this.disablePrintButton = true;
      }
    } else {
      this.resetCashDenomition();
    }
  }

  resetCashDenomition() {
    this.cashDenomitionFormGroup.disable();
    this.pifNoResponse = null;
    this.balanceAmt = 0;
    this.totalCollectedCash = 0;
    this.depositedAmount = 0;
    this.disableSaveButton = true;
    this.disablePrintButton = true;
    this.cashDenomitionFormGroup.reset();
    this.disableCashDenomitionButton = false;
    this.enablePrintButton1 = true;
  }

  saveCashDenomition() {
    this.api.stopEditing();
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.CONFIRM,
        message: 'pw.alertPopup.saveConfirmation'
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result) {
          let depositDetails;

          depositDetails = {
            data: {
              noOfTwoThousandNotes: this.cashDenomitionFormGroup.get(
                'twoThousand'
              ).value,

              noOFiveHundredNotes: this.cashDenomitionFormGroup.get(
                'fiveHundred'
              ).value,
              noOfTwoHundredNotes: this.cashDenomitionFormGroup.get(
                'twoHundred'
              ).value,
              noOfHundredNotes: this.cashDenomitionFormGroup.get('hundred')
                .value,
              noOfFiftyNotes: this.cashDenomitionFormGroup.get('fifty').value,
              noOfTwentyNotes: this.cashDenomitionFormGroup.get('twenty').value,
              noOfTenNotes: this.cashDenomitionFormGroup.get('ten').value,
              noOfFiveNotes: this.cashDenomitionFormGroup.get('five').value,
              noOfTwoNotes: this.cashDenomitionFormGroup.get('two').value,
              noOfOneNotes: this.cashDenomitionFormGroup.get('one').value,
              totalCoinsAmount: this.cashDenomitionFormGroup.get(
                'totalCashAmountCoins'
              ).value
            },
            type: 'deposit'
          };

          // const depositedRecords = this.api
          //   .getSelectedNodes()
          //   .filter(node => node.data.depositDate !== null);
          // const ids = depositedRecords.map(node => node.data.id);
          this.cashDenominationDetails.emit({
            depositDetails: depositDetails,
            ids: this.pifNoResponse.transactionIds
          });
        }
      });
  }
  saveDepositDetails() {
    this.checkboxes = [];
    this.api.stopEditing();
    let isOpenPopup = false;
    this.api.getSelectedNodes().forEach(node => {
      if (
        node.data.paymentCode.toUpperCase() === BoutiqueBankDepositEnum.CASH
      ) {
        let depositAmount;
        if (typeof node.data.depositAmount === 'object') {
          depositAmount = node.data.depositAmount.value;
        } else {
          depositAmount = node.data.depositAmount;
        }

        const amount = Number(node.data.amount);
        const maximumDepositAmount = amount + this.cashDepositVariationLimit;

        const minimumDepositAmount = amount - this.cashDepositVariationLimit;

        if (
          (Number(depositAmount) > maximumDepositAmount ||
            Number(depositAmount) < minimumDepositAmount) &&
          this.isPasswordMandatory === 'true' &&
          (this.password === null ||
            this.password === undefined ||
            this.password === '')
        ) {
          isOpenPopup = true;
          this.openPopup();
        }
      }
    });
    if (this.api.getSelectedRows().length > 0 && !isOpenPopup) {
      let depositDetails;
      const bankDeposit = [];
      this.api.getSelectedNodes().forEach(node => {
        bankDeposit.push({
          amount: node.data.amount,
          approvalDetails:
            this.password !== null || this.password !== undefined
              ? {
                  data: { password: this.password },
                  type: 'Approval'
                }
              : null,
          bankName: node.data.payeeBankName,
          businessDate: moment(this.bussinessDay).valueOf().toString(),
          collectionDate: moment(node.data.collectionDate).valueOf().toString(),
          depositAmount:
            typeof node.data.depositAmount === 'object'
              ? Number(node.data.depositAmount.value)
              : Number(node.data.depositAmount),
          depositDate: moment(this.bussinessDay).valueOf().toString(),
          id: node.data.id
        });
        this.checkboxes = [...this.checkboxes, node.data.id];
      });
      depositDetails = {
        bankDeposit: bankDeposit
      };
      this.emitBankDepositDetails.emit({
        data: depositDetails,
        selectedRows: this.api.getSelectedNodes()
      });
      this.emitSelectedRowsId.emit(this.checkboxes);
      this.password = null;
    }
  }
  showAlertNotification(key: string): void {
    this.overlayNotification.close();
    this.translate
      .get(key)
      .pipe(takeUntil(this.destroy$))
      .subscribe(translatedMsg => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SIMPLE,
            hasBackdrop: true,
            message: translatedMsg,
            hasClose: true
          })
          .events.pipe(takeUntil(this.destroy$))
          .subscribe((event: OverlayNotificationEventRef) => {});
      });
  }
}
