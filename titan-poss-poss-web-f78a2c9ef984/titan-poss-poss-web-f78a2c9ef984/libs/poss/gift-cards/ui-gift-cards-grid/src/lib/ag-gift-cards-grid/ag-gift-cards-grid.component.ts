import {
  Component,
  Input,
  OnChanges,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy,
  ChangeDetectionStrategy
} from '@angular/core';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subject, fromEvent } from 'rxjs';
import {
  debounceTime,
  map,
  distinctUntilChanged,
  startWith,
  tap,
  takeUntil,
  take
} from 'rxjs/operators';
import { GridApi, ColumnApi, GridReadyEvent } from 'ag-grid-community';
import { MatDialog } from '@angular/material/dialog';
import {
  GiftCardsTypesEnum,
  GiftCardsGridEnum,
  AmountSpecification,
  AlertPopupTypeEnum,
  AlertPopupServiceAbstraction
} from '@poss-web/shared/models';
import {
  InputValidatorComponent,
  DeleteGcRowComponent,
  DeleteAllGcRowsComponent,
  EditItemComponent
} from '@poss-web/shared/components/ui-ag-grid';
import {
  CurrencySymbolService,
  CurrencyFormatterService
} from '@poss-web/shared/components/ui-formatters';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';

@Component({
  selector: 'poss-web-ag-gift-cards-grid',
  templateUrl: './ag-gift-cards-grid.component.html',
  styleUrls: ['./ag-gift-cards-grid.component.scss']
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class AgGiftCardsGridComponent implements OnChanges, OnInit, OnDestroy {
  api: GridApi;
  columnApi: ColumnApi;
  formGroup: FormGroup = new FormGroup({});
  parentForm: FormArray = new FormArray([]);
  rowSelection = GiftCardsGridEnum.SINGLE;
  _resize$: Observable<any>;
  domLayout = GiftCardsGridEnum.AUTO_HEIGHT;
  animateRows = true;
  rowHeight = 35;
  currentColumnName = null;
  currentRowIndex: number;
  totalAmount: number;
  defaultColDef = {
    enableCellTextSelection: true,
    suppressMovable: true
  };
  columnDefs = [];

  @Input() currencyCode: string;
  @Input() deleteId: string;
  @Input() maxAmount: number;
  @Input() minAmount: number;
  @Input() updateAmountSuccessInput: any;
  @Input() operationType: GiftCardsTypesEnum;
  @Input() giftCardEvent: Observable<any>;
  @Input() clearAllEvent: Observable<any>;
  @Output() updateAmount = new EventEmitter<any>();
  @Output() deleteEmit = new EventEmitter<any>();
  @Output() totalCardValues = new EventEmitter<any>();

  destroy$: Subject<null> = new Subject<null>();

  constructor(
    public dialog: MatDialog,
    private currencySymbolService: CurrencySymbolService,
    private translate: TranslateService,
    private fieldValidatorsService: FieldValidatorsService,
    private currencyFormatterService: CurrencyFormatterService,
    private alertPopupService: AlertPopupServiceAbstraction
  ) {}

  ngOnInit() {
    const cardNumberHeader = 'pw.giftCards.cardNo';
    const binHeader = 'pw.giftCards.bin';
    const amountHeader = 'pw.giftCards.amount';
    const taxHeader = 'pw.giftCards.tax';
    const finalPriceHeader = 'pw.giftCards.finalPrice';

    this.translate
      .get([
        cardNumberHeader,
        binHeader,
        amountHeader,
        taxHeader,
        finalPriceHeader
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: string) => {
        this.columnDefs = [
          {
            // headerCheckboxSelection: true,
            checkboxSelection: true,
            minWidth: 30,
            width: 30,
            pinned: GiftCardsGridEnum.LEFT,
            lockPinned: true
          },
          {
            headerName: translatedMessages[cardNumberHeader] + '.',
            field: GiftCardsGridEnum.CARD_NO,
            pinned: GiftCardsGridEnum.LEFT,
            lockPinned: false
          },
          {
            headerName: translatedMessages[binHeader],
            field: GiftCardsGridEnum.BIN,
            sortable: true
          },
          {
            headerName: `${
              translatedMessages[amountHeader]
            } (${this.currencySymbolService.get(this.currencyCode)})`,
            field: GiftCardsGridEnum.AMOUNT,
            editable: () => {
              const isEditable =
                this.operationType === GiftCardsTypesEnum.GIFTCARD_CANCELLATION
                  ? false
                  : true;
              return isEditable;
            },
            cellEditor: GiftCardsGridEnum.INPUT_VALIDATOR,
            isAmount: true,
            singleClickEdit: true,
            cellRendererSelector: params => {
              if (
                this.operationType === GiftCardsTypesEnum.GIFTCARD_CANCELLATION
              ) {
                return null;
              } else {
                return {
                  component: GiftCardsGridEnum.EDIT_ITEM_COMPONENT
                };
              }
            },
            valueFormatter: params => {
              if (params.value && params.value.isValid) {
                this.getAmountData(params.value.value, params.node.rowIndex);

                // if (params.value.value > this.maxAmount || params.value.value < this.minAmount) {
                //   const amountSpecification = {
                //     minAmount: this.minAmount,
                //     maxAmount: this.maxAmount
                //   };
                //   this.openGcInvalidAmountPopUp(amountSpecification);
                // } else {
                //   this.getAmountData(params.value.value, params.node.rowIndex);
                // }
              }
              if (params && params.value && typeof params.value === 'object') {
                if (params.value.value) {
                  return this.currencyFormatterService.format(
                    params.value.value,
                    this.currencyCode,
                    false
                  );
                  // return params.value.value;
                } else {
                  return '';
                }
              } else {
                return this.currencyFormatterService.format(
                  params.value,
                  this.currencyCode,
                  false
                );
                // return params.value;
              }
            },
            cellClass: 'pw-fourth-color',
            cellClassRules: {
              'pw-gray-border': params => {
                // && !(params.value.value > this.maxAmount) && !(params.value.value < this.minAmount)
                return (
                  params.value &&
                  params.value.isValid === true &&
                  params.value.value !== ''
                );
              },
              'pw-error-border': params => {
                // || params.value.value > this.maxAmount || params.value.value < this.minAmount
                return (
                  params.value.isValid === false ||
                  (params.value && params.value.value === '')
                );
              }
            }
          },
          {
            headerName: `${
              translatedMessages[taxHeader]
            } (${this.currencySymbolService.get(this.currencyCode)})`,
            field: GiftCardsGridEnum.TAX,
            valueFormatter: params => {
              return this.currencyFormatterService.format(
                params.value,
                this.currencyCode,
                false
              );
            }
          },
          {
            headerName: `${
              translatedMessages[finalPriceHeader]
            } (${this.currencySymbolService.get(this.currencyCode)})`,
            field: GiftCardsGridEnum.FINAL_PRICE,
            pinned: GiftCardsGridEnum.RIGHT,
            lockPinned: false,
            valueFormatter: params => {
              return this.currencyFormatterService.format(
                params.value,
                this.currencyCode,
                false
              );
            }
          },
          {
            cellRenderer: GiftCardsGridEnum.DELETE_ROW_RENDERER,
            // field: 'delete',
            pinned: GiftCardsGridEnum.RIGHT,
            width: 21,
            minWidth: 21,
            maxWidth: 21,
            cellClass: 'pw-delete-icon-width',
            headerClass: 'pw-delete-icon-width',
            lockPinned: true
            // headerComponent: 'deleteAllRowsRenderer'
          }
        ];
      });
  }

  ngOnChanges() {
    if (this.giftCardEvent) {
      this.giftCardEvent.pipe(takeUntil(this.destroy$)).subscribe(data => {
        if (data) {
          setTimeout(() => {
            data.forEach(gridRowContent => {
              if (gridRowContent) {
                const gridRowData = { ...gridRowContent };
                this.onAddRow(gridRowData);
              }
            });
          }, 200);
        }
      });
    }
    if (this.deleteId) {
      this.deleteGridRow(this.deleteId);
    }
    if (this.updateAmountSuccessInput) {
      this.onUpdateAmountSuccess(this.updateAmountSuccessInput);
    }
    this.clearAllEvent.pipe(takeUntil(this.destroy$)).subscribe(data => {
      if (data) {
        this.clearAllData();
      }
    });
  }

  getComponents() {
    return {
      deleteRowRenderer: DeleteGcRowComponent,
      deleteAllRowsRenderer: DeleteAllGcRowsComponent,
      inputValidator: InputValidatorComponent,
      editItemComponent: EditItemComponent
    };
  }

  clearAllData() {
    if (this.api) {
      this.api.setRowData([]);
      this.parentForm.clear();
      this.currentColumnName = null;
      this.currentRowIndex = -1;
    }
  }

  onGridSizeChanged() {
    if (window.innerWidth >= 991) {
      this.api.sizeColumnsToFit();
    }

    // this.api.sizeColumnsToFit();
  }

  onAddRow(newItem) {
    const res = this.api.applyTransaction({ add: [newItem] });
    this.api.setFocusedCell(0, 'cardNo');
    this.createFormControls(res.add[0]);
  }

  getAllRowData(): any[] {
    let items = [];
    this.api.forEachNode(node => {
      items.push(node.data);
    });
    return items;
  }

  onUpdateRow(newItem) {
    const res = this.api.applyTransaction({ update: [newItem] });
    this.api.redrawRows({ rowNodes: res.update });
    this.refreshFormControls(res.update[0]);
  }

  createFormControls(rowNode) {
    const data = rowNode.data;
    this.formGroup = new FormGroup({});
    this.formGroup = new FormGroup({
      cardNo: new FormControl(data.cardNo),
      bin: new FormControl(data.bin),
      amount: new FormControl(data.amount),
      tax: new FormControl(data.tax),
      finalPrice: new FormControl(data.finalPrice),
      itemId: new FormControl(data.itemId),
      delete: new FormControl(null)
    });

    this.api.setFocusedCell(0, 'cardNo');
    this.parentForm.push(this.formGroup);
    this.calculateTotalValue();
  }

  calculateTotalValue() {
    this.totalAmount = 0;
    this.parentForm.value.forEach(element => {
      this.totalAmount += Number(element.amount);
    });
    this.totalCardValues.emit({
      cardsTotalQty: this.api.getDisplayedRowCount(),
      cardsTotalAmount: this.totalAmount,
      rowData: this.getAllRowData()
    });
  }

  refreshFormControls(rowNode) {
    const updateArray = this.parentForm.controls[rowNode.rowIndex];
    updateArray.patchValue({
      cardNo: rowNode.data['cardNo'],
      bin: rowNode.data['bin'],
      amount: rowNode.data['amount'],
      tax: rowNode.data['tax'],
      finalPrice: rowNode.data['finalPrice'],
      itemId: rowNode.data['itemId'],
      delete: null
    });
    this.api.setFocusedCell(0, 'cardNo');
  }

  gridReady(params: GridReadyEvent) {
    this.api = params.api;
    this.columnApi = params.columnApi;
    this.api.showNoRowsOverlay();
    this.api.sizeColumnsToFit();
    this.widthCalculator();
  }

  widthCalculator() {
    if (this.columnDefs.length !== 0 && this.columnApi !== null) {
      const cardNoColDef = this.columnApi.getColumn('cardNo').getColDef();
      const finalPriceColDef = this.columnApi
        .getColumn('finalPrice')
        .getColDef();

      this.columnApi.setColumnPinned('cardNo', null);
      this.columnApi.setColumnPinned('finalPrice', null);
      if (this.operationType === GiftCardsTypesEnum.GIFTCARD_CANCELLATION) {
        cardNoColDef.lockPinned = true;
        finalPriceColDef.lockPinned = true;
      } else {
        cardNoColDef.lockPinned = false;
        finalPriceColDef.lockPinned = false;
      }

      if (this.operationType === GiftCardsTypesEnum.GIFTCARD_CANCELLATION) {
        this.columnApi.setColumnVisible(
          this.columnApi.getAllColumns()[6],
          false
        );
        this.columnApi.setColumnVisible(
          this.columnApi.getAllColumns()[0],
          false
        );
      } else {
        this.columnApi.setColumnVisible(
          this.columnApi.getAllColumns()[6],
          true
        );
        this.columnApi.setColumnVisible(
          this.columnApi.getAllColumns()[0],
          true
        );
      }
      this.api.sizeColumnsToFit();
    }
  }

  getAmountData(amountChanges: number, rowIndex: number) {
    this.parentForm.controls[rowIndex].get('amount').setValue(amountChanges);
    this.setFinalPrice(amountChanges, rowIndex);
    this.updateAmount.emit(this.parentForm.controls[rowIndex].value);
    this.calculateTotalValue();
  }

  setFinalPrice(amountChanges, rowIndex) {
    this.parentForm.controls[rowIndex]
      .get('finalPrice')
      .setValue(amountChanges);
  }

  onUpdateAmountSuccess(updateAmountSuccessObj: any) {
    const index = this.parentForm.controls.findIndex(formGroupObject => {
      return (
        formGroupObject.get('itemId').value === updateAmountSuccessObj.itemId
      );
    });
    if (index !== -1) {
      this.parentForm.controls[index]
        .get('amount')
        .setValue(updateAmountSuccessObj.amount);
      this.setFinalPrice(updateAmountSuccessObj.amount, index);
      this.api.setRowData(this.parentForm.value);
    }
  }

  onRemoveSelectedRow(newItem) {
    this.deleteEmit.emit(newItem);
  }

  deleteGridRow(deleteId: string) {
    const index = this.parentForm.controls.findIndex(
      formGroup => formGroup.get('itemId').value === deleteId
    );
    if (index !== -1) {
      this.api.applyTransaction({
        remove: [this.parentForm.controls[index].value]
      });
      this.parentForm.removeAt(index);
      this.calculateTotalValue();
    }
  }

  getContext() {
    return {
      formGroup: this.parentForm.controls,
      componentParent: this,
      validators: {
        amount: [
          this.fieldValidatorsService.amountField(
            'amount',
            this.maxAmount,
            this.minAmount
          )
        ]
      },
      gridApi: this.api
    };
  }

  getRowNodeId(data: any) {
    return data.cardNo;
  }

  openConfirmDialogForDelete(data) {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.CONFIRM,
        message: 'pw.giftCards.deleteConfirmMessage'
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res === true) {
          this.onRemoveSelectedRow(data);
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
