import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
  Inject,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy
} from '@angular/core';
import { Observable, Subject, Subscription, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GridApi, ColumnApi, GridReadyEvent } from 'ag-grid-community';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import {
  ItemDetailPopupserviceAbstraction,
  DiscountDetailsPopupServiceAbstraction,
  ItemDetailsPopupTabType,
  CashMemoItemValidate,
  ProductDetailsInGrid,
  ProductGridFieldsEnum,
  MetalTypeEnum,
  AvailableLotNumber,
  ProductTypesEnum,
  StatusTypesEnum,
  ShortcutServiceAbstraction,
  Command,
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  TransactionTypeEnum,
  SubTransactionTypeEnum,
  DiscountTypeEnum,
  PaymentDetails
} from '@poss-web/shared/models';
import {
  ActualWeightPopupComponent,
  DeleteRowComponent,
  ItemDetailsComponent,
  DiscountDetailsComponent,
  DeleteAllRowsComponent,
  EditItemComponent,
  InputValidatorComponent,
  LotNumberAndQuantityComponent,
  TooltipComponent,
  CheckboxCellComponent
} from '@poss-web/shared/components/ui-ag-grid';
import { MatDialog } from '@angular/material/dialog';
import {
  WeightFormatterService,
  CurrencyFormatterService,
  CurrencySymbolService
} from '@poss-web/shared/components/ui-formatters';
import { TranslateService } from '@ngx-translate/core';
import { POSS_WEB_CURRENCY_CODE } from '@poss-web/shared/util-config';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { ItemPreviewPopupComponent } from '@poss-web/shared/components/ui-item-preview-popup';
import {
  SelectionDailogOption,
  SelectionDialogService
} from '@poss-web/shared/components/ui-selection-dialog';
import { ResetTcsPopupComponent } from '@poss-web/poss/shared/view-tcs/ui-view-tcs';
import { LotAndQuantityChangePopupComponent } from '../lot-and-quantity-change-popup/lot-and-quantity-change-popup.component';
import { of } from 'rxjs';

const focusShortcutKey = 'ProductGridComponent.FOCUS';
const pinLeft = 'left';
const pinRight = 'right';
const reserveBinCode = 'RESERVEBIN';

@Component({
  selector: 'poss-web-product-grid',
  templateUrl: './product-grid.component.html',
  styleUrls: ['./product-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductGridComponent implements OnInit, OnDestroy, OnChanges {
  api: GridApi;
  columnApi: ColumnApi;
  formGroup: FormGroup = new FormGroup({});
  parentForm: FormArray = new FormArray([]);
  currentRowIndex: number;
  silverCoinCode = '82';
  domLayout = 'autoHeight';
  weightCode = 'gms';
  sampleDiscountData = [];
  sampleOccasion;
  objCategoryMappings = {};
  columnDefs = [];
  defaultColumnDefs = {
    suppressMovable: true,
    resizable: true
  };
  animateRows = true;
  rowSelection = 'multiple';
  suppressRowClickSelection = true;
  rowHeight = 80;
  errorData = false;
  currentColumnName = null;
  lotNumber = null;
  productGridFieldsEnumRef = ProductGridFieldsEnum;
  productGridComponent: any = this;
  RSONameHeaderText: string;
  status: string;
  messageTxt: string;
  onHoldMessage: string;
  minQuantity = 1;
  maxQuantity: number;
  qtyMsg: string;

  @Input() productData: ProductDetailsInGrid | ProductDetailsInGrid[] = null;
  @Input() validEvent: Observable<any>;
  @Input() clearAllEvent: Observable<null>;
  @Input() rsoDetailsEvent: Observable<{ code: string; name: string }[]>;
  @Input() reasonsEvent: Observable<string[]>;
  @Input() pgDescEvent: Observable<{}>;
  @Input() errorDataEvent: Observable<boolean>;
  @Input() enableProductGridUpdate = true;
  @Input() imageUrlData$: Observable<any>;
  @Input() removeAllFOCItemsEvent: Observable<null>;
  @Input() deleteSuccessResponse$: Observable<ProductDetailsInGrid>;
  @Input() isErrorinPriceUpdate = false;
  @Input() resetLotNumber$: Observable<any>;
  @Input() updateDiscountDetails = [];
  @Input() selectedAutoDiscounts = [];
  @Input() paymentDetails: PaymentDetails[] = [];
  @Input() tcsToBeCollectedAtCM: number = 0;
  @Input() transactionType: TransactionTypeEnum;

  @Output() selectedLotNumber = new EventEmitter<any>();
  @Output() actualWeightEmit = new EventEmitter<any>();
  @Output() selectedRso = new EventEmitter<any>();
  @Output() deleteEmit = new EventEmitter<ProductDetailsInGrid>();
  @Output() validate = new EventEmitter<CashMemoItemValidate>();
  @Output() validateClear = new EventEmitter<null>();
  @Output() updateError = new EventEmitter<any>();
  @Output() loadImageUrl = new EventEmitter<any>();
  @Output() selection = new EventEmitter<any>();
  @Output() discountPopupOpened = new EventEmitter<null>();
  @Output() discountPopupClosed = new EventEmitter<{
    reason: string;
    data: ProductDetailsInGrid;
    rowIndex: number;
    discountsReload: boolean;
  }>();
  @Output() totalItemsInProductGrid = new EventEmitter<number>();
  @Output() resetTcs = new EventEmitter<null>();

  destroy$: Subject<null> = new Subject<null>();

  // Product Grid Data
  @Input() isWeightEditConfig: boolean;
  rsoNames: { code: string; name: string }[] = [];

  private subscription: Subscription;
  private timer: Observable<any>;
  selectedProduct: any;
  pgDescription = null;
  productTypesEnumRef = ProductTypesEnum;
  selectRSONameLabel: string;
  searchByRSOCodeLabel: string;
  tooltipShowDelay = 1;
  selectRSO = 'Select RSO';

  constructor(
    private shortcutService: ShortcutServiceAbstraction,
    private itemDetailPopupservice: ItemDetailPopupserviceAbstraction,
    private discountDetailsPopupService: DiscountDetailsPopupServiceAbstraction,
    private dialog: MatDialog,
    private weightFormatterService: WeightFormatterService,
    private currencyFormatterService: CurrencyFormatterService,
    private translate: TranslateService,
    @Inject(POSS_WEB_CURRENCY_CODE) public defaultCurrencyCode,
    private fieldValidatorService: FieldValidatorsService,
    private currencySymbolService: CurrencySymbolService,
    private alertPopupService: AlertPopupServiceAbstraction,
    private selectionDialog: SelectionDialogService
  ) {}

  ngOnInit() {
    this.translate
      .get([
        'pw.productGrid.variantCodeHeaderText',
        'pw.productGrid.lotNumberHeaderText',
        'pw.productGrid.unitWeightHeaderText',
        'pw.productGrid.actualWeightHeaderText',
        'pw.productGrid.RSONameHeaderText',
        'pw.productGrid.pricePerUnitHeaderText',
        'pw.productGrid.discountHeaderText',
        'pw.productGrid.finalPriceHeaderText',
        'pw.productGrid.messageHeaderText',
        'pw.productGrid.onHoldMessage',
        'pw.productGrid.quantityFieldMsg',
        'pw.productGrid.selectRSONameLabel',
        'pw.productGrid.searchByRSOCodeLabel',
        'pw.productGrid.isHallmarkingHeaderText',
        'pw.productGrid.isHMQuantityHeaderText',
        'pw.productGrid.ageOfBilling',
        'pw.productGrid.isFOCforHallmarkingHeaderText',
        'pw.productGrid.deleteLabel',
        'pw.productGrid.selectUnselectLabel'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.columnDefs = [
          {
            headerCheckboxSelection: true,
            checkboxSelection: true,
            colId: ProductGridFieldsEnum.SELECT,
            headerTooltip:
              translatedMessages['pw.productGrid.selectUnselectLabel'],
            width: 30,
            minWidth: 30,
            pinned: pinLeft
          },
          {
            headerName:
              translatedMessages['pw.productGrid.variantCodeHeaderText'],
            field: ProductGridFieldsEnum.ITEMCODE,
            headerTooltip:
              translatedMessages['pw.productGrid.variantCodeHeaderText'],
            cellRenderer: 'itemDetailsRenderer',
            width: 130,
            minWidth: 120
          },
          {
            headerName:
              translatedMessages['pw.productGrid.lotNumberHeaderText'],
            field: ProductGridFieldsEnum.SELECTEDLOTNUMBER,
            headerTooltip:
              translatedMessages['pw.productGrid.lotNumberHeaderText'],
            cellEditorSelector: params => {
              if (params.data?.productType === ProductTypesEnum.REGULAR) {
                return this.lotNumberEditor(params);
              } else if (params.data?.productType === ProductTypesEnum.COINS) {
                return this.quantityEditor();
              }
              return null;
            },
            valueFormatter: params => this.lotNumberFormatter(params),
            editable: params =>
              this.tcsToBeCollectedAtCM === 0 &&
              this.enableProductGridUpdate &&
              (params.data?.productType === ProductTypesEnum.REGULAR &&
              params.data?.productGroup === this.silverCoinCode
                ? false
                : true) &&
              ((params.data?.productType === ProductTypesEnum.COINS &&
              params.data?.productDetails?.totalQuantity > 1
                ? true
                : false) ||
                (params.data?.productType === ProductTypesEnum.REGULAR &&
                params.data?.availableLotNumbers.length === 1
                  ? false
                  : true)) &&
              !(params.data?.refSubTxnType === TransactionTypeEnum.AB) &&
              params.data?.discount === 0,
            cellRendererSelector: params => {
              if (params.data?.productType === ProductTypesEnum.FOC) {
                return { component: 'lotNumberAndQuantityRenderer' };
              } else if (
                this.enableProductGridUpdate &&
                params.data?.productType === ProductTypesEnum.REGULAR &&
                params.data?.productGroup === this.silverCoinCode &&
                params.data?.discount === 0 &&
                (params.data?.productDetails?.totalQuantity > 1 ||
                  params.data?.availableLotNumbers.length > 1)
              ) {
                return { component: 'lotNumberAndQuantityRenderer' };
              } else if (
                this.enableProductGridUpdate &&
                ((params.data?.productType === ProductTypesEnum.COINS &&
                params.data?.productDetails?.totalQuantity > 1
                  ? true
                  : false) ||
                  (params.data?.productType === ProductTypesEnum.REGULAR &&
                  params.data?.availableLotNumbers.length === 1
                    ? false
                    : true)) &&
                !(params.data?.refSubTxnType === TransactionTypeEnum.AB) &&
                params.data?.discount === 0
              ) {
                return { component: 'editItemRenderer' };
              }
              return null;
            },
            cellClass: params =>
              this.enableProductGridUpdate &&
              ((params.data?.productType === ProductTypesEnum.COINS &&
              params.data?.productDetails?.totalQuantity > 1
                ? true
                : false) ||
                (params.data?.productType === ProductTypesEnum.REGULAR &&
                params.data?.availableLotNumbers.length === 1
                  ? false
                  : true)) &&
              !(params.data?.refSubTxnType === TransactionTypeEnum.AB) &&
              params.data?.discount === 0
                ? 'pw-fourth-color'
                : null,
            singleClickEdit: true,
            width: 100,
            minWidth: 100
          },
          {
            headerName:
              translatedMessages['pw.productGrid.unitWeightHeaderText'] +
              `(${this.weightCode})`,
            field: ProductGridFieldsEnum.UNITWEIGHT,
            headerTooltip:
              translatedMessages['pw.productGrid.unitWeightHeaderText'] +
              `(${this.weightCode})`,
            valueFormatter: params =>
              this.weightFormatterService.format(params.value),
            sortable: true,
            width: 80,
            minWidth: 80,
            cellClass: 'pw-justify-content-end',
            type: 'numericColumn'
          },
          {
            headerName:
              translatedMessages['pw.productGrid.actualWeightHeaderText'] +
              `(${this.weightCode})`,
            field: ProductGridFieldsEnum.ACTUALWEIGHT,
            headerTooltip:
              translatedMessages['pw.productGrid.actualWeightHeaderText'] +
              `(${this.weightCode})`,
            valueFormatter: params =>
              this.weightFormatterService.format(params.value),
            cellEditor: 'actualWeightEditor',
            cellRendererSelector: params => {
              if (
                this.enableProductGridUpdate &&
                params.data?.productType === ProductTypesEnum.REGULAR &&
                !params.data?.priceDetails?.isUcp &&
                (params.data?.subTxnType === SubTransactionTypeEnum.NEW_CM ||
                params.data?.subTxnType === SubTransactionTypeEnum.MANUAL_CM
                  ? params.data?.productType === ProductTypesEnum.REGULAR
                    ? params.data?.unitWeight === params.data?.stdWeight
                      ? true
                      : this.isWeightEditConfig
                      ? true
                      : false
                    : false
                  : false)
              ) {
                return {
                  component: 'editItemRenderer'
                };
              }
              return null;
            },
            sortable: true,
            editable: params =>
              this.enableProductGridUpdate &&
              this.tcsToBeCollectedAtCM === 0 &&
              params.data?.productType === ProductTypesEnum.REGULAR &&
              !params.data?.priceDetails?.isUcp &&
              (params.data?.subTxnType === SubTransactionTypeEnum.NEW_CM ||
              params.data?.subTxnType === SubTransactionTypeEnum.MANUAL_CM
                ? params.data?.productType === ProductTypesEnum.REGULAR
                  ? params.data?.unitWeight === params.data?.stdWeight
                    ? true
                    : this.isWeightEditConfig
                    ? true
                    : false
                  : false
                : false),
            cellClass: params =>
              this.enableProductGridUpdate &&
              params.data?.productType === ProductTypesEnum.REGULAR &&
              !params.data?.priceDetails?.isUcp &&
              (params.data?.subTxnType === SubTransactionTypeEnum.NEW_CM ||
              params.data?.subTxnType === SubTransactionTypeEnum.MANUAL_CM
                ? params.data?.productType === ProductTypesEnum.REGULAR
                  ? params.data?.unitWeight === params.data?.stdWeight
                    ? true
                    : this.isWeightEditConfig
                    ? true
                    : false
                  : false
                : false)
                ? 'pw-fourth-color pw-justify-content-end'
                : 'pw-justify-content-end',
            singleClickEdit: true,
            width: 90,
            minWidth: 90,
            type: 'numericColumn'
          },
          {
            headerName: translatedMessages['pw.productGrid.RSONameHeaderText'],
            field: ProductGridFieldsEnum.SELECTEDRSO,
            headerTooltip:
              translatedMessages['pw.productGrid.RSONameHeaderText'],
            tooltipField: ProductGridFieldsEnum.SELECTEDRSO,
            tooltipComponentSelector: params => {
              if (params.location === 'cell') {
                return { component: 'tooltipRenderer' };
              }
              return null;
            },
            // cellEditorSelector: () => this.rsoNameEditor(),
            valueFormatter: params =>
              this.getRsoNameFromCode(params.data?.selectedRso),
            cellRendererSelector: params => {
              if (
                // this.enableProductGridUpdate &&
                params.data?.productType !== ProductTypesEnum.FOC
              ) {
                return {
                  component: 'editItemRenderer'
                };
              }
              return null;
            },
            cellClass: params =>
              // this.enableProductGridUpdate &&
              params.data?.productType !== ProductTypesEnum.FOC
                ? 'pw-fourth-color pw-cell-wrap-text'
                : null,
            // editable: params =>
            //   this.enableProductGridUpdate &&
            //   params.data?.productType !== ProductTypesEnum.FOC,
            singleClickEdit: true,
            sortable: true,
            width: 100,
            minWidth: 100
          },
          {
            headerName:
              translatedMessages['pw.productGrid.pricePerUnitHeaderText'] +
              `(${this.currencySymbolService.get(this.defaultCurrencyCode)})`,
            field: ProductGridFieldsEnum.PRICEPERUNIT,
            headerTooltip:
              translatedMessages['pw.productGrid.pricePerUnitHeaderText'] +
              `(${this.currencySymbolService.get(this.defaultCurrencyCode)})`,
            valueFormatter: params =>
              this.currencyFormatterService.format(
                params.value,
                this.defaultCurrencyCode,
                false
              ),
            cellClass: 'pw-justify-content-end',
            type: 'numericColumn',
            sortable: true,
            filter: 'agNumberColumnFilter',
            filterParams: {
              applyButton: true,
              resetButton: true,
              suppressAndOrCondition: true,
              closeOnApply: true
            },
            width: 110,
            minWidth: 90
          },
          {
            headerName:
              translatedMessages['pw.productGrid.discountHeaderText'] +
              `(${this.currencySymbolService.get(this.defaultCurrencyCode)})`,
            field: ProductGridFieldsEnum.DISCOUNT,
            headerTooltip:
              translatedMessages['pw.productGrid.discountHeaderText'] +
              `(${this.currencySymbolService.get(this.defaultCurrencyCode)})`,
            cellRenderer: 'discountDetailsRenderer',
            width: 100,
            minWidth: 100
          },
          {
            headerName:
              translatedMessages['pw.productGrid.finalPriceHeaderText'] +
              `(${this.currencySymbolService.get(this.defaultCurrencyCode)})`,
            field: ProductGridFieldsEnum.FINALPRICE,
            headerTooltip:
              translatedMessages['pw.productGrid.finalPriceHeaderText'] +
              `(${this.currencySymbolService.get(this.defaultCurrencyCode)})`,
            cellRenderer: params => {
              if (params.data?.productType === ProductTypesEnum.FOC)
                return `${this.currencyFormatterService.format(
                  params.value,
                  this.defaultCurrencyCode,
                  false
                )}`;
              else if (
                params.data?.productType === ProductTypesEnum.REGULAR ||
                params.data?.productType === ProductTypesEnum.COINS
              )
                return `<a class="pw-anchor-underline">${this.currencyFormatterService.format(
                  params.value,
                  this.defaultCurrencyCode,
                  false
                )}</a>`;
              return null;
            },
            cellClass: 'pw-justify-content-end',
            type: 'numericColumn',
            sortable: true,
            filter: 'agNumberColumnFilter',
            filterParams: {
              applyButton: true,
              resetButton: true,
              closeOnApply: true
            },
            width: 110,
            minWidth: 100
          },
          {
            headerName:
              translatedMessages['pw.productGrid.isHallmarkingHeaderText'],
            field: ProductGridFieldsEnum.ISHM,
            headerTooltip:
              translatedMessages['pw.productGrid.isHallmarkingHeaderText'],
            cellRenderer: 'checkboxCellRenderer',
            width: 80,
            minWidth: 80
          },
          {
            headerName:
              translatedMessages['pw.productGrid.isHMQuantityHeaderText'],
            field: ProductGridFieldsEnum.HMQUANTITY,
            headerTooltip:
              translatedMessages['pw.productGrid.isHMQuantityHeaderText'],
            width: 80,
            minWidth: 80
          },
          {
            headerName:
              translatedMessages[
                'pw.productGrid.isFOCforHallmarkingHeaderText'
              ],
            field: ProductGridFieldsEnum.FOCFORHM,
            headerTooltip:
              translatedMessages[
                'pw.productGrid.isFOCforHallmarkingHeaderText'
              ],
            cellRenderer: 'checkboxCellRenderer',
            width: 80,
            minWidth: 80
          },
          {
            headerName: translatedMessages['pw.productGrid.ageOfBilling'],
            field: ProductGridFieldsEnum.AGE,
            headerTooltip: translatedMessages['pw.productGrid.ageOfBilling'],
            width: 60,
            minWidth: 60,
            hide: !(
              this.transactionType === TransactionTypeEnum.CM ||
              this.transactionType === TransactionTypeEnum.NEW_CM
            )
          },
          {
            headerComponent: 'deleteAllRowsRenderer',
            cellRenderer: 'deleteRowRenderer',
            field: ProductGridFieldsEnum.DELETE,
            headerTooltip: translatedMessages['pw.productGrid.deleteLabel'],
            width: 21,
            minWidth: 21,
            maxWidth: 21,
            cellClass: 'pw-delete-icon-width',
            headerClass: 'pw-delete-icon-width',
            pinned: pinRight
          },
          {
            field: ProductGridFieldsEnum.ROWID,
            hide: true
          }
        ];
        this.RSONameHeaderText =
          translatedMessages['pw.productGrid.RSONameHeaderText'];
        this.messageTxt =
          translatedMessages['pw.productGrid.messageHeaderText'];
        this.onHoldMessage = translatedMessages['pw.productGrid.onHoldMessage'];
        this.qtyMsg = translatedMessages['pw.productGrid.quantityFieldMsg'];
        this.selectRSONameLabel =
          translatedMessages['pw.productGrid.selectRSONameLabel'];
        this.searchByRSOCodeLabel =
          translatedMessages['pw.productGrid.searchByRSOCodeLabel'];
      });

    this.shortcutService.commands
      .pipe(takeUntil(this.destroy$))
      .subscribe((command: Command) => {
        this.shortcutEventHandler(command);
      });

    this.clearAllEvent?.pipe(takeUntil(this.destroy$)).subscribe(data => {
      this.clearAllData();
    });

    this.rsoDetailsEvent?.pipe(takeUntil(this.destroy$)).subscribe(data => {
      if (data.length !== 0) {
        this.rsoNames = data;
        this.api.redrawRows();
      }
    });

    this.pgDescEvent?.pipe(takeUntil(this.destroy$)).subscribe(data => {
      if (data) this.pgDescription = data;
    });

    this.errorDataEvent
      ?.pipe(takeUntil(this.destroy$))
      .subscribe((data: boolean) => {
        this.errorData = data;
        this.setTimer();
      });

    this.removeAllFOCItemsEvent
      ?.pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.deleteFocItems(data);
      });

    this.imageUrlData$?.pipe(takeUntil(this.destroy$)).subscribe(data => {
      if (data !== null) {
        this.openPopup(data);
      }
    });

    this.deleteSuccessResponse$
      ?.pipe(takeUntil(this.destroy$))
      .subscribe((data: ProductDetailsInGrid) => {
        if (data !== null) {
          this.deleteFormControls(data.inventoryId);
          this.api.applyTransaction({ remove: [data] });
          this.totalItemsInProductGrid.emit(this.getRegularProductsCount());
          this.columnApi.getColumn(ProductGridFieldsEnum.ROWID).setSort('asc');
        }
      });

    this.resetLotNumber$?.pipe(takeUntil(this.destroy$)).subscribe(data => {
      if (data) {
        const changeEvent = data;
        changeEvent.data.selectedLotNumber = data.oldValue;
        this.onUpdateRow(changeEvent.data);
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['productData']) {
      console.log('productData', this.productData);
      if (this.api && this.productData && this.productData !== null) {
        if (Array.isArray(this.productData)) {
          // array
          if (this.productData.length !== 0) {
            this.productData.forEach(element =>
              this.createFormControls(element)
            );
            this.onAddMultipleRows(this.productData);
          }
        } else {
          // object
          this.status = this.productData.status;
          if (this.productData.isAdd === true) this.onAddRow(this.productData);
          else this.onUpdateRow(this.productData);
        }
      }
    }
    if (changes['enableProductGridUpdate']) {
      console.log('enableProductGridUpdate', this.enableProductGridUpdate);
      if (this.api && this.columnApi) {
        if (this.enableProductGridUpdate) {
          this.columnApi.setColumnVisible(ProductGridFieldsEnum.DELETE, true);
        } else {
          this.columnApi.setColumnVisible(ProductGridFieldsEnum.DELETE, false);
        }
        this.onGridSizeChanged();
        this.api.redrawRows();
      }
    }
  }

  gridReady(params: GridReadyEvent) {
    this.api = params.api;
    this.columnApi = params.columnApi;
    this.api.showNoRowsOverlay();
  }

  onGridSizeChanged() {
    this.api.sizeColumnsToFit();
  }

  onSelectionChanged(event) {
    if (event.api.getSelectedRows().length) {
      this.selectedProduct = event.api.getSelectedRows()[0];
    } else {
      this.selectedProduct = null;
    }
    this.selection.emit(this.selectedProduct);
  }

  formatLotNumberValueDisplay(params) {
    this.objCategoryMap(params);
    return this.lookupValue(this.objCategoryMappings, params.selectedLotNumber);
  }

  objCategoryMap(params) {
    params.availableLotNumbers.forEach((element: AvailableLotNumber) => {
      this.objCategoryMappings[
        `${element.inventoryId}`
      ] = `${element.lotNumber}`;
    });
  }

  // takes key values
  extractValues(mappings) {
    return Object.keys(mappings);
  }

  // takes value of key
  lookupValue(mappings, key) {
    return mappings[key];
  }

  onAddRow(newItem: ProductDetailsInGrid) {
    this.resetSort();
    this.createFormControls(newItem);
    const res = this.api.applyTransaction({ add: [newItem] });
    this.totalItemsInProductGrid.emit(this.getRegularProductsCount());
    this.api.setFocusedCell(
      res.add[0].rowIndex,
      ProductGridFieldsEnum.ITEMCODE
    );
    this.columnApi.getColumn(ProductGridFieldsEnum.ROWID).setSort('asc');
  }

  onAddMultipleRows(newItem: ProductDetailsInGrid[]) {
    this.resetSort();
    this.api.applyTransaction({ add: newItem });
    this.totalItemsInProductGrid.emit(this.getRegularProductsCount());
    this.api.setFocusedCell(0, ProductGridFieldsEnum.ITEMCODE);
    this.columnApi.getColumn(ProductGridFieldsEnum.ROWID).setSort('asc');
  }

  onUpdateRow(newItem: ProductDetailsInGrid) {
    const res = this.api.applyTransaction({ update: [newItem] });
    this.api.redrawRows({ rowNodes: res.update });
    this.refreshFormControls(res.update[0]);
  }

  onRemoveRows() {
    const selectedData = this.api.getSelectedRows();
    selectedData.forEach(element => {
      this.deleteEmit.emit(element);
    });
  }

  onRemoveSelectedRow(newItem) {
    this.deleteEmit.emit(newItem);
  }

  createFormControls(rowNode) {
    const rowNodeData = rowNode;
    this.formGroup = new FormGroup({});
    this.formGroup = new FormGroup({
      itemCode: new FormControl(rowNodeData.itemCode),
      description: new FormControl(rowNodeData.description),
      binCode: new FormControl(rowNodeData.binCode),
      selectedLotNumber: new FormControl(rowNodeData.selectedLotNumber),
      availableLotNumbers: new FormControl(rowNodeData.availableLotNumbers),
      unitWeight: new FormControl(rowNodeData.unitWeight),
      availableReasons: new FormControl(rowNodeData.availableReasons),
      actualWeightGroup: new FormGroup({
        actualWeight: new FormControl(rowNodeData.actualWeight),
        reason: new FormControl(rowNodeData.selectedReason),
        remarks: new FormControl(rowNodeData.remarks)
      }),
      selectedRso: new FormControl(
        rowNodeData.selectedRso,
        this.fieldValidatorService.requiredField(this.RSONameHeaderText)
      ),
      availableRso: new FormControl(rowNodeData.availableRso),
      pricePerUnit: new FormControl(rowNodeData.pricePerUnit),
      discount: new FormControl(rowNodeData.discount),
      finalPrice: new FormControl(rowNodeData.finalPrice),
      priceBreakUp: new FormControl(rowNodeData.priceBreakUp),
      productDetails: new FormControl(rowNodeData.productDetails),
      inventoryId: new FormControl(rowNodeData.inventoryId),
      itemId: new FormControl(rowNodeData.itemId),
      productType: new FormControl(rowNodeData.productType),
      isAdd: new FormControl(rowNodeData.isAdd),
      priceDetails: new FormControl(rowNodeData.priceDetails),
      quantity: new FormControl(rowNodeData.quantity),
      taxDetails: new FormControl(rowNodeData.taxDetails),
      stdWeight: new FormControl(rowNodeData.stdWeight),
      karatage: new FormControl(rowNodeData.karatage),
      productCatergory: new FormControl(rowNodeData.productCatergory),
      productGroup: new FormControl(rowNodeData.productGroup),
      status: new FormControl(rowNodeData.status),
      totalQuantity: new FormControl(rowNodeData.totalQuantity),
      subTxnType: new FormControl(rowNodeData.subTxnType),
      selectedDiscounts: new FormControl(rowNodeData.selectedDiscounts),
      refSubTxnType: new FormControl(rowNodeData.refSubTxnType),
      hmQuantity: new FormControl(rowNodeData.hmQuantity),
      isFOCForHallmarkingCharges: new FormControl(
        rowNodeData.isFOCForHallmarkingCharges
      ),
      isHallmarked: new FormControl(rowNodeData.isHallmarked),
      rowId: new FormControl(rowNodeData.rowId),
      isManualFOC: new FormControl(rowNodeData.isManualFOC),
      age: new FormControl(rowNodeData.age)
    });
    this.parentForm.push(this.formGroup);
    this.sortForm();
  }

  refreshFormControls(rowNode) {
    const updateArray = this.parentForm.controls[rowNode.rowIndex];
    const rowNodeData = rowNode.data;
    updateArray.patchValue({
      itemCode: rowNodeData.itemCode,
      description: rowNodeData.description,
      binCode: rowNodeData.binCode,
      selectedLotNumber: rowNodeData.selectedLotNumber,
      availableLotNumbers: rowNodeData.availableLotNumbers,
      unitWeight: rowNodeData.unitWeight,
      actualWeightGroup: {
        actualWeight: rowNodeData.actualWeight,
        reason: rowNodeData.selectedReason,
        remarks: rowNodeData.remarks
      },
      selectedRso: rowNodeData.selectedRso,
      availableRso: rowNodeData.availableRso,
      pricePerUnit: rowNodeData.pricePerUnit,
      discount: rowNodeData.discount,
      finalPrice: rowNodeData.finalPrice,
      priceBreakUp: rowNodeData.priceBreakUp,
      productDetails: rowNodeData.productDetails,
      inventoryId: rowNodeData.inventoryId,
      itemId: rowNodeData.itemId,
      productType: rowNodeData.productType,
      isAdd: rowNodeData.isAdd,
      priceDetails: rowNodeData.priceDetails,
      quantity: rowNodeData.quantity,
      taxDetails: rowNodeData.taxDetails,
      stdWeight: rowNodeData.stdWeight,
      karatage: rowNodeData.karatage,
      productCatergory: rowNodeData.productCatergory,
      productGroup: rowNodeData.productGroup,
      status: rowNodeData.status,
      totalQuantity: rowNodeData.totalQuantity,
      subTxnType: rowNodeData.subTxnType,
      selectedDiscounts: rowNodeData.selectedDiscounts,
      refSubTxnType: rowNodeData.refSubTxnType,
      hmQuantity: rowNodeData.hmQuantity,
      isFOCForHallmarkingCharges: rowNodeData.isFOCForHallmarkingCharges,
      isHallmarked: rowNodeData.isHallmarked,
      rowId: rowNodeData.rowId,
      isManualFOC: rowNodeData.isManualFOC
    });
    this.api.setFocusedCell(rowNode.rowIndex, ProductGridFieldsEnum.ITEMCODE);
  }

  deleteFormControls(rowNode) {
    this.parentForm.removeAt(
      this.parentForm.controls.findIndex(
        formGroup => formGroup.get('inventoryId').value === rowNode
      )
    );
    this.sortForm();
  }

  // custom components used in ag grid
  getComponents() {
    return {
      itemDetailsRenderer: ItemDetailsComponent,
      actualWeightEditor: ActualWeightPopupComponent,
      deleteRowRenderer: DeleteRowComponent,
      discountDetailsRenderer: DiscountDetailsComponent,
      deleteAllRowsRenderer: DeleteAllRowsComponent,
      editItemRenderer: EditItemComponent,
      inputValidatorEditor: InputValidatorComponent,
      lotNumberAndQuantityRenderer: LotNumberAndQuantityComponent,
      tooltipRenderer: TooltipComponent,
      checkboxCellRenderer: CheckboxCellComponent
    };
  }

  getContext() {
    return {
      formGroup: this.parentForm.controls,
      componentParent: this.productGridComponent,
      validators: {
        selectedLotNumber: [
          this.fieldValidatorService.requiredField(this.qtyMsg),
          this.fieldValidatorService.min(this.minQuantity, this.qtyMsg),
          this.fieldValidatorService.max(this.maxQuantity, this.qtyMsg)
        ]
      },
      disableCheckBox: true
    };
  }

  onCellKeyPress(pressEvent) {
    const keyPressed = pressEvent.event.key;
    if (keyPressed === 'Enter') {
      if (pressEvent.colDef.checkboxSelection === true) {
        pressEvent.node.setSelected(!pressEvent.node.selected);
      } else if (pressEvent.colDef.field === ProductGridFieldsEnum.FINALPRICE) {
        if (pressEvent.data?.productType !== ProductTypesEnum.FOC)
          this.openItemDetails(pressEvent.data);
      } else if (pressEvent.colDef.field === ProductGridFieldsEnum.DISCOUNT) {
        if (pressEvent.data?.productType !== ProductTypesEnum.FOC)
          this.openDiscountDetails(pressEvent.data, pressEvent);
      } else if (pressEvent.colDef.field === ProductGridFieldsEnum.DELETE) {
        this.openConfirmDialogForDelete(pressEvent.data);
      } else if (
        pressEvent.colDef.field === ProductGridFieldsEnum.SELECTEDRSO
      ) {
        if (
          // this.enableProductGridUpdate &&
          pressEvent.data?.productType !== ProductTypesEnum.FOC
        )
          this.openRSOSelectionPopup(pressEvent);
      } else if (
        pressEvent.colDef.field === ProductGridFieldsEnum.ACTUALWEIGHT
      ) {
        const tcsPayment = this.paymentDetails.find(
          value => value.isTcsPayment === true
        );

        if (
          this.transactionType === TransactionTypeEnum.CM &&
          this.tcsToBeCollectedAtCM !== 0 &&
          tcsPayment
        ) {
          this.deleteTcsAmountPopup();
        } else if (
          this.transactionType === TransactionTypeEnum.CM &&
          this.tcsToBeCollectedAtCM !== 0 &&
          !tcsPayment
        ) {
          this.resetTcsAmountPopup();
        }
      } else if (
        pressEvent.colDef.field === ProductGridFieldsEnum.SELECTEDLOTNUMBER
      ) {
        const tcsPayment = this.paymentDetails.find(
          value => value.isTcsPayment === true
        );

        if (
          this.transactionType === TransactionTypeEnum.CM &&
          this.tcsToBeCollectedAtCM !== 0 &&
          tcsPayment
        ) {
          this.deleteTcsAmountPopup();
        } else if (
          this.transactionType === TransactionTypeEnum.CM &&
          this.tcsToBeCollectedAtCM !== 0 &&
          !tcsPayment
        ) {
          this.resetTcsAmountPopup();
        } else {
          if (
            this.enableProductGridUpdate &&
            pressEvent.data?.productType === ProductTypesEnum.REGULAR &&
            pressEvent.data?.productGroup === this.silverCoinCode &&
            pressEvent.data?.discount === 0 &&
            (pressEvent.data?.productDetails?.totalQuantity > 1 ||
              pressEvent.data?.availableLotNumbers.length > 1)
          ) {
            const dataForPopup = {
              lotNumberList: pressEvent.data?.availableLotNumbers,
              selectedLotNumber: pressEvent.data?.selectedLotNumber,
              selectedQty: pressEvent.data?.quantity,
              totalQty: pressEvent.data?.totalQuantity
            };

            this.openLotAndQtyChangePopup(pressEvent, dataForPopup);
          }
        }
      }
    }
  }

  onCellValueChanged(changeEvent) {
    switch (changeEvent.colDef.field) {
      case ProductGridFieldsEnum.SELECTEDLOTNUMBER: {
        if (changeEvent.data.productType === ProductTypesEnum.REGULAR) {
          const array = changeEvent.context.formGroup;

          if (
            array.filter(c => c.value.inventoryId === changeEvent.value)
              .length === 1
          ) {
            changeEvent.data.selectedLotNumber = changeEvent.oldValue;
            this.onUpdateRow(changeEvent.data);
            this.errorData = true;
            this.setTimer();
          } else {
            this.errorData = false;
            if (changeEvent.data?.responseData?.itemDetails?.orderItemId) {
              this.lotNumberChangePopup(changeEvent);
            } else {
              this.selectedLotNumber.emit({ data: changeEvent });
            }
          }
        } else {
          if (
            changeEvent.data.totalQuantity >= changeEvent.value.value &&
            changeEvent.value.value > 0
          ) {
            this.selectedLotNumber.emit({ data: changeEvent });
          } else {
            changeEvent.data.selectedLotNumber = changeEvent.oldValue;
            this.onUpdateRow(changeEvent.data);
            this.selectedLotNumber.emit({ data: changeEvent });
          }
        }
      }
    }
  }

  onCellClicked(clickEvent) {
    if (clickEvent.colDef.checkboxSelection === true) {
      clickEvent.node.setSelected(!clickEvent.node.selected);
    }
    switch (clickEvent.colDef.field) {
      case ProductGridFieldsEnum.FINALPRICE: {
        if (clickEvent.data?.productType !== ProductTypesEnum.FOC)
          this.openItemDetails(clickEvent.data);
        break;
      }
      case ProductGridFieldsEnum.DISCOUNT: {
        if (clickEvent.data?.productType !== ProductTypesEnum.FOC)
          this.openDiscountDetails(clickEvent.data, clickEvent);
        break;
      }
      case ProductGridFieldsEnum.SELECTEDRSO: {
        if (
          // this.enableProductGridUpdate &&
          clickEvent.data?.productType !== ProductTypesEnum.FOC
        )
          this.openRSOSelectionPopup(clickEvent);
        // if (!this.enableProductGridUpdate) this.updateError.emit();

        break;
      }
      case ProductGridFieldsEnum.ACTUALWEIGHT: {
        // if (!this.enableProductGridUpdate) {
        //   this.updateError.emit();
        // }
        const tcsPayment = this.paymentDetails.find(
          value => value.isTcsPayment === true
        );

        if (
          this.transactionType === TransactionTypeEnum.CM &&
          this.tcsToBeCollectedAtCM !== 0 &&
          tcsPayment
        ) {
          this.deleteTcsAmountPopup();
        } else if (
          this.transactionType === TransactionTypeEnum.CM &&
          this.tcsToBeCollectedAtCM !== 0 &&
          !tcsPayment
        ) {
          this.resetTcsAmountPopup();
        }

        break;
      }

      case ProductGridFieldsEnum.SELECTEDLOTNUMBER: {
        // if (!this.enableProductGridUpdate) {
        //   this.updateError.emit();
        // }
        const tcsPayment = this.paymentDetails.find(
          value => value.isTcsPayment === true
        );

        if (
          this.transactionType === TransactionTypeEnum.CM &&
          this.tcsToBeCollectedAtCM !== 0 &&
          tcsPayment
        ) {
          this.deleteTcsAmountPopup();
        } else if (
          this.transactionType === TransactionTypeEnum.CM &&
          this.tcsToBeCollectedAtCM !== 0 &&
          !tcsPayment
        ) {
          this.resetTcsAmountPopup();
        } else {
          if (
            this.enableProductGridUpdate &&
            clickEvent.data?.productType === ProductTypesEnum.REGULAR &&
            clickEvent.data?.productGroup === this.silverCoinCode &&
            clickEvent.data?.discount === 0 &&
            (clickEvent.data?.productDetails?.totalQuantity > 1 ||
              clickEvent.data?.availableLotNumbers.length > 1)
          ) {
            const dataForPopup = {
              lotNumberList: clickEvent.data?.availableLotNumbers,
              selectedLotNumber: clickEvent.data?.selectedLotNumber,
              selectedQty: clickEvent.data?.quantity,
              totalQty: clickEvent.data?.totalQuantity
            };

            this.openLotAndQtyChangePopup(clickEvent, dataForPopup);
          }
        }

        break;
      }

      // case ProductGridFieldsEnum.DELETE:
      //   this.openConfirmDialogForDelete(clickEvent.data);
      //   break;
    }
  }

  openLotAndQtyChangePopup(clickEvent, dataForPopup) {
    const dataForPopupObs$ = of(dataForPopup);
    this.dialog.closeAll();
    const dialogRef = this.dialog.open(LotAndQuantityChangePopupComponent, {
      width: '400px',
      height: 'auto',
      data: dataForPopupObs$,
      disableClose: true
    });

    dialogRef.componentInstance.lotNumChange
      .pipe(takeUntil(this.destroy$))
      .subscribe(selectedLot => {
        clickEvent.data.selectedLotNumber = selectedLot;
        this.onUpdateRow(clickEvent.data);
        this.selectedLotNumber.emit({ data: clickEvent });
      });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result) {
          clickEvent.data.selectedLotNumber = result.selectedLot;
          clickEvent.data.quantity = Number(result.selectedQty);
          this.onUpdateRow(clickEvent.data);
          this.selectedLotNumber.emit({ data: clickEvent });
        }
      });
  }

  onCellFocused(focusEvent) {
    let focusedRowIndex = -1;
    let focusedRowData = this.getAllRowsAfterFilterAndSort()[
      focusEvent.rowIndex
    ];

    if (this.parentForm.value.length && focusedRowData?.rowId) {
      focusedRowIndex = this.parentForm.value.findIndex(
        x => x.rowId === focusedRowData?.rowId
      );
    }

    this.maxQuantity = this.parentForm.value[focusedRowIndex]?.totalQuantity;
    this.getDiscountValues(
      this.parentForm.value[focusedRowIndex]?.selectedDiscounts
    );
    if (
      this.parentForm.value[focusedRowIndex]?.productType ===
      ProductTypesEnum.REGULAR
    ) {
      if (focusEvent.column !== null) {
        this.currentColumnName = null;
        this.currentRowIndex = -1;
        if (focusEvent.column.colDef.field) {
          this.currentColumnName = focusEvent.column.colDef.field;
          this.currentRowIndex = focusedRowIndex;
          this.lotNumber = this.formatLotNumberValueDisplay(
            this.parentForm.controls[this.currentRowIndex].value
          );
        } else if (focusEvent.column.colId === ProductGridFieldsEnum.SELECT) {
          this.currentColumnName = ProductGridFieldsEnum.SELECT;
        }
      }
    } else {
      if (focusEvent.column !== null) {
        this.currentColumnName = null;
        this.currentRowIndex = -1;
        if (focusEvent.column.colDef.field) {
          this.currentColumnName = focusEvent.column.colDef.field;
          this.currentRowIndex = focusedRowIndex;
          this.lotNumber = this.parentForm.controls[
            this.currentRowIndex
          ]?.value.selectedLotNumber;
        } else if (focusEvent.column.colId === ProductGridFieldsEnum.SELECT) {
          this.currentColumnName = ProductGridFieldsEnum.SELECT;
        }
      }
    }
  }

  stopEditing(actualWeightData, rowIndex: number, item) {
    this.api.stopEditing();
    this.api.setFocusedCell(rowIndex, ProductGridFieldsEnum.ACTUALWEIGHT);
    this.actualWeightEmit.emit({
      data: actualWeightData,
      item: item,
      rowIndex: rowIndex
    });
  }

  closePopup(rowIndex: number) {
    this.api.stopEditing();
    this.api.setFocusedCell(rowIndex, ProductGridFieldsEnum.ACTUALWEIGHT);
    this.validateClear.emit();
  }

  /**
   * method to handle shortcut commands
   * @param command: shortcut command
   */
  shortcutEventHandler(command: Command) {
    if (command.name === focusShortcutKey) {
      this.api.setFocusedCell(0, ProductGridFieldsEnum.ITEMCODE);
    }
  }

  openItemDetails(dataToBeLoaded: ProductDetailsInGrid) {
    let goldRate;
    let platinumRate;
    let silverRate;
    const dataArray =
      dataToBeLoaded?.priceDetails?.metalPriceDetails?.metalPrices;
    dataArray?.forEach(element => {
      if (element.metalTypeCode === MetalTypeEnum.GOLD) {
        goldRate = {
          karat: element.karat,
          price: element.ratePerUnit
        };
      }

      if (element.metalTypeCode === MetalTypeEnum.PLATINUM) {
        platinumRate = {
          purity: element.purity,
          price: element.ratePerUnit
        };
      }

      if (element.metalTypeCode === MetalTypeEnum.SILVER) {
        silverRate = {
          purity: element.purity,
          price: element.ratePerUnit
        };
      }
    });
    this.itemDetailPopupservice.open({
      tabs: [
        ItemDetailsPopupTabType.PRICE_DETAILS,
        ItemDetailsPopupTabType.STONE_DETAILS
      ],
      currencyCode: this.defaultCurrencyCode,
      weightUnit: this.weightCode,
      headerDetails: {
        showTitle: true,
        itemCode: dataToBeLoaded.itemCode,
        lotNumber:
          dataToBeLoaded.productType === ProductTypesEnum.REGULAR
            ? dataToBeLoaded.productDetails.lotNumber
            : dataToBeLoaded.selectedLotNumber,
        productCategory: dataToBeLoaded?.productCatergory,
        productGroup: dataToBeLoaded?.productGroup,
        grossWeight: dataToBeLoaded.actualWeight,
        materialWeight:
        dataToBeLoaded.priceDetails.materialDetails.materialWeight,
        netWeight: dataToBeLoaded?.priceDetails?.isUcp
          ? dataToBeLoaded.actualWeight
          : dataToBeLoaded?.priceBreakUp?.totalMetalWeight,
        goldRate: goldRate,
        platinumRate: platinumRate,
        silverRate: silverRate
      },
      priceBreakup: dataToBeLoaded.priceBreakUp
    });
  }

  openDiscountDetails(dataToBeLoaded: ProductDetailsInGrid, event) {
    this.discountPopupOpened.emit();
    let goldRate;
    let platinumRate;
    let silverRate;
    const dataArray =
      dataToBeLoaded?.priceDetails?.metalPriceDetails?.metalPrices;
    dataArray?.forEach(element => {
      if (element.metalTypeCode === MetalTypeEnum.GOLD) {
        goldRate = {
          karat: element.karat,
          price: element.ratePerUnit
        };
      }

      if (element.metalTypeCode === MetalTypeEnum.PLATINUM) {
        platinumRate = {
          purity: element.purity,
          price: element.ratePerUnit
        };
      }

      if (element.metalTypeCode === MetalTypeEnum.SILVER) {
        silverRate = {
          purity: element.purity,
          price: element.ratePerUnit
        };
      }
    });

    const allrowsValue = this.getAllRows();
    let otherThanSelectedRow = [];
    if (allrowsValue.length > 0) {
      otherThanSelectedRow = allrowsValue.filter(
        eachRow => eachRow.itemId !== dataToBeLoaded.itemId
      );
    }

    this.discountDetailsPopupService
      .open({
        readOnly: this.isErrorinPriceUpdate,
        itemData: {
          currencyCode: this.defaultCurrencyCode,
          weightUnit: this.weightCode,
          headerDetails: {
            showTitle: true,
            itemCode: dataToBeLoaded.itemCode,
            lotNumber:
              dataToBeLoaded.productType === ProductTypesEnum.REGULAR
                ? dataToBeLoaded.productDetails.lotNumber
                : dataToBeLoaded.selectedLotNumber,
            productCategory: dataToBeLoaded?.productCatergory,
            productGroup: dataToBeLoaded?.productGroup,
            grossWeight: dataToBeLoaded.actualWeight,
            netWeight: dataToBeLoaded?.priceDetails?.isUcp
              ? dataToBeLoaded.actualWeight
              : dataToBeLoaded?.priceBreakUp?.totalMetalWeight,
            goldRate: goldRate,
            platinumRate: platinumRate,
            silverRate: silverRate,
            selectedAutoDiscounts: this.selectedAutoDiscounts
          },
          itemData: dataToBeLoaded.responseData,
          otherThanSelectedRow: otherThanSelectedRow
        }
      })
      .subscribe(data => {
        // console.log('closed', data);
        if (data.type === 'APPLY' || data.type === 'EDIT') {
          if (data.data.reason !== null) {
            this.discountPopupClosed.emit({
              reason: data.data.reason,
              data: dataToBeLoaded,
              rowIndex: event.rowIndex,
              discountsReload: data.data.discountsReload
            });
          } else {
            this.discountPopupClosed.emit({
              reason: null,
              data: dataToBeLoaded,
              rowIndex: event.rowIndex,
              discountsReload: data.data.discountsReload
            });
          }
        }

        // if (data.length !== 0) {
        // this.sampleDiscountData = data;
        // dataToBeLoaded.discount = this.sampleDiscountData;
        // this.onUpdateRow(dataToBeLoaded);
        // } else {
        // dataToBeLoaded.discount = data.length;
        // this.onUpdateRow(dataToBeLoaded);
        // }
      });
  }

  /**
   * Unique identifier for each row
   * @param data : data of each row
   */
  getRowNodeId(data: any) {
    return data.itemId;
  }

  clearAllData() {
    this.api.setRowData([]);
    this.parentForm.clear();
    this.currentColumnName = null;
    this.currentRowIndex = -1;
  }

  openConfirmDialogForDelete(data: ProductDetailsInGrid) {
    const tcsPayment = this.paymentDetails.find(
      value => value.isTcsPayment === true
    );

    if (
      this.transactionType === TransactionTypeEnum.CM &&
      this.tcsToBeCollectedAtCM !== 0 &&
      tcsPayment
    ) {
      this.deleteTcsAmountPopup();
    } else if (
      this.transactionType === TransactionTypeEnum.CM &&
      this.tcsToBeCollectedAtCM !== 0 &&
      !tcsPayment
    ) {
      this.resetTcsAmountPopup();
    } else {
      if (data.responseData.refTxnType === TransactionTypeEnum.AB) {
        if (
          this.api.getDisplayedRowCount() === 1 &&
          this.status === StatusTypesEnum.HOLD
        ) {
          this.openOnHoldItemPopup();
        } else {
          if (this.enableProductGridUpdate) {
            this.alertPopupService
              .open({
                type: AlertPopupTypeEnum.CONFIRM,
                message: 'pw.productGrid.deleteConfirmMessage'
              })
              .pipe(takeUntil(this.destroy$))
              .subscribe((res: boolean) => {
                if (res === true) {
                  if (data.binCode === reserveBinCode) {
                    this.alertPopupService
                      .open({
                        type: AlertPopupTypeEnum.CONFIRM,
                        message: 'pw.productGrid.deleteABItemConfirmMessage'
                      })
                      .pipe(takeUntil(this.destroy$))
                      .subscribe((res1: boolean) => {
                        this.onRemoveSelectedRow({
                          data: data,
                          res: res1,
                          removeFromOrder: true
                        });
                      });
                  } else {
                    this.onRemoveSelectedRow(data);
                  }
                }
              });
          } else {
            this.updateError.emit();
          }
        }
      } else {
        if (
          this.api.getDisplayedRowCount() === 1 &&
          this.status === StatusTypesEnum.HOLD
        ) {
          this.openOnHoldItemPopup();
        } else {
          if (this.enableProductGridUpdate) {
            this.alertPopupService
              .open({
                type: AlertPopupTypeEnum.CONFIRM,
                message: 'pw.productGrid.deleteConfirmMessage'
              })
              .pipe(takeUntil(this.destroy$))
              .subscribe((res: boolean) => {
                if (res === true) {
                  this.onRemoveSelectedRow(data);
                }
              });
          } else {
            this.updateError.emit();
          }
        }
      }
    }
  }

  openConfirmDialogForDeleteAll() {
    const tcsPayment = this.paymentDetails.find(
      value => value.isTcsPayment === true
    );

    if (
      this.transactionType === TransactionTypeEnum.CM &&
      this.tcsToBeCollectedAtCM !== 0 &&
      tcsPayment
    ) {
      this.deleteTcsAmountPopup();
    } else if (
      this.transactionType === TransactionTypeEnum.CM &&
      this.tcsToBeCollectedAtCM !== 0 &&
      !tcsPayment
    ) {
      this.resetTcsAmountPopup();
    } else {
      if (this.validateBinCode()) {
        if (
          this.api.getDisplayedRowCount() === 1 &&
          this.status === StatusTypesEnum.HOLD
        ) {
          this.openOnHoldItemPopup();
        } else {
          if (this.api.getDisplayedRowCount()) {
            if (this.enableProductGridUpdate) {
              this.alertPopupService
                .open({
                  type: AlertPopupTypeEnum.CONFIRM,
                  message: 'pw.productGrid.deleteAllConfirmMessage'
                })
                .pipe(takeUntil(this.destroy$))
                .subscribe((res: boolean) => {
                  if (res === true) {
                    this.onRemoveRows();
                  }
                });
            } else {
              this.updateError.emit();
            }
          }
        }
      } else {
        this.openBinCodeErrorPopup();
      }
    }
  }

  deleteFocItems(isManualFoc: boolean) {
    let focItems = [];
    if (isManualFoc) {
      focItems = this.parentForm.value.filter(
        x => x.description === '(FOC)' && x.isManualFOC
      );
    } else {
      focItems = this.parentForm.value.filter(
        x => x.description === '(FOC)' && !x.isManualFOC
      );
    }

    this.api.applyTransaction({ remove: focItems });
    this.totalItemsInProductGrid.emit(this.getRegularProductsCount());
    focItems.forEach(element => {
      this.deleteFormControls(element.inventoryId);
    });
    this.currentRowIndex = 0;
    this.api.setFocusedCell(0, ProductGridFieldsEnum.ITEMCODE);
    this.columnApi.getColumn(ProductGridFieldsEnum.ROWID).setSort('asc');
  }

  setTimer() {
    this.timer = timer(5000); //  5 seconds
    this.subscription = this.timer.subscribe(() => {
      this.errorData = false;
    });
  }

  openPopup(data) {
    this.dialog.open(ItemPreviewPopupComponent, {
      height: '525px',
      width: '700px',
      autoFocus: false,
      data: {
        imageUrl: data.imageUrl,
        itemCode: data.itemCode
      }
    });
  }

  openOnHoldItemPopup() {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.INFO,
        message: 'pw.productGrid.onHoldMessage'
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  openBinCodeErrorPopup() {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.INFO,
        message: 'pw.productGrid.deleteReserveBinErrorMsg'
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  rsoNameEditor() {
    return {
      component: 'agSelectCellEditor',
      params: {
        values: this.rsoNames
        // params.data.availableRso
        // params.data.availableRso.length !== 0
        //   ? params.data.availableRso
        //   : this.rso
      }
    };
  }

  lotNumberEditor(params) {
    this.objCategoryMappings = {};
    this.objCategoryMap(params.data);
    return {
      component: 'agSelectCellEditor',
      params: {
        values: this.extractValues(this.objCategoryMappings)
      }
    };
  }

  quantityEditor() {
    return {
      component: 'inputValidatorEditor'
    };
  }

  lotNumberFormatter(params) {
    if (params.data !== null) {
      if (params.data?.productType === ProductTypesEnum.REGULAR) {
        this.objCategoryMappings[
          `${params.data?.productDetails?.inventoryId}`
        ] = `${params.data?.productDetails?.lotNumber}`;
      } else if (params.data?.productType === ProductTypesEnum.COINS)
        return params.value.value;
    }
    return this.lookupValue(this.objCategoryMappings, params.value);
  }

  getAllRows() {
    const rowData = [];
    this.api.forEachNode(node => rowData.push(node.data));
    return rowData;
  }

  getAllRowsAfterFilterAndSort() {
    const rowData = [];
    this.api.forEachNodeAfterFilterAndSort(node => rowData.push(node.data));
    return rowData;
  }

  validateBinCode() {
    if (
      this.getAllRows().filter(c => c.binCode === reserveBinCode).length === 1
    ) {
      return false;
    } else {
      return true;
    }
  }

  resetSort() {
    this.columnApi.getColumn(ProductGridFieldsEnum.UNITWEIGHT).setSort(null);
    this.columnApi.getColumn(ProductGridFieldsEnum.ACTUALWEIGHT).setSort(null);
    this.columnApi.getColumn(ProductGridFieldsEnum.SELECTEDRSO).setSort(null);
    this.columnApi.getColumn(ProductGridFieldsEnum.PRICEPERUNIT).setSort(null);
    this.columnApi.getColumn(ProductGridFieldsEnum.FINALPRICE).setSort(null);
  }

  getDiscountValues(discountData) {
    // console.log('discountData', discountData);
    this.sampleDiscountData = [];
    // this.sampleOccasion = '';
    let tempDiscountData = [];
    if (discountData && discountData.length !== 0) {
      discountData.forEach(element => {
        // console.log('DISCOUNT DATA 123 :', element);
        if (
          element.discountType !== DiscountTypeEnum.BILL_LEVEL_DISCOUNT &&
          element.discountType !== DiscountTypeEnum.EXCHANGE_OFFER_DISCOUNT &&
          element.discountType !== DiscountTypeEnum.COIN_OFFER_DISCOUNT &&
          element.discountType !==
            DiscountTypeEnum.SYSTEM_DISCOUNT_GEP_PURITY &&
          element.discountType !== DiscountTypeEnum.SYSTEM_DISCOUNT_DV &&
          element.discountType !== DiscountTypeEnum.SYSTEM_DISCOUNT_GHS_BONUS
        ) {
          let data;
          if (element.discountValueDetails) {
            data = element.discountValueDetails.data.discountValueDetails
              ? element.discountValueDetails.data.discountValueDetails
              : element.discountValueDetails.data;
          }
          if (data && data.length !== 0) {
            tempDiscountData = [];
            for (const ele of data) {
              if (ele.discountValue !== 0) {
                tempDiscountData.push({
                  occasion: element.discountAttributes.occasion,
                  component: ele.component,
                  isPercent: ele.discountPercent !== null ? true : false,
                  percent: ele.discountPercent,
                  value: ele.discountValue
                });
              }
            }
          }

          if (tempDiscountData.length !== 0) {
            if (tempDiscountData.length === 1) {
              this.sampleDiscountData.push({
                isSingle: false,
                occasion: tempDiscountData[0].occasion,
                component: tempDiscountData[0].component,
                percent: tempDiscountData[0].percent,
                isPercent: tempDiscountData[0].isPercent,
                value: tempDiscountData[0].value
              });
            } else {
              this.sampleDiscountData.push({
                isSingle: true,
                occasion: element.discountAttributes.occasion,
                component: null,
                percent: null
              });
            }
          } else {
            this.sampleDiscountData.push({
              isSingle: true,
              occasion: element.discountAttributes.occasion,
              component: null,
              percent: null
            });
          }

          // if (this.sampleDiscountData.length !== 1) {
          //   this.sampleOccasion =
          //     this.sampleOccasion +
          //     (this.sampleOccasion !== '' ? ' | ' : '') +
          //     element.discountAttributes.occasion;
          // }
          // console.log('this.sampleDiscountData:', this.sampleDiscountData);
        } else {
          // this.sampleOccasion =
          //   this.sampleOccasion +
          //   (this.sampleOccasion !== '' ? ' | ' : '') +
          //   element.discountAttributes.occasion;
          this.sampleDiscountData.push({
            isSingle: true,
            occasion: element.discountAttributes.occasion,
            component: null,
            percent: null
          });
        }

        // console.log(
        //   'discountData',
        //   this.sampleDiscountData,
        //   element.discountAttributes.occasion,
        //   this.sampleOccasion
        // );
      });
    }
  }

  openRSOSelectionPopup(eventData) {
    this.dialog.closeAll();
    const rsoNamesForSelection = this.rsoNames.map(rso => ({
      id: rso.code,
      description: rso.name + ' - ' + rso.code
    }));
    this.selectionDialog
      .open({
        title: this.selectRSONameLabel,
        placeholder: this.searchByRSOCodeLabel,
        options: rsoNamesForSelection
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((selectedOption: SelectionDailogOption) => {
        if (selectedOption) {
          eventData.data.selectedRso = selectedOption.id;
          this.selectedRso.emit(eventData);
        }
      });
  }

  getRegularProductsCount() {
    const regularProducts = [];
    this.api.forEachNode(node => {
      if (node.data.productType !== ProductTypesEnum.FOC)
        regularProducts.push(node.data);
    });
    return regularProducts.length;
  }

  getRsoNameFromCode(code: string) {
    if (this.rsoNames.length !== 0) {
      for (const rso of this.rsoNames) {
        if (rso.code === code) return rso.name;
        else if (code === this.selectRSO) return this.selectRSO;
      }
    }
    return code;
  }

  sortForm() {
    let array = this.parentForm.value;
    // sorting in ascending order
    array.sort((a, b) => a.rowId - b.rowId);
    this.parentForm.patchValue(array);
  }

  // showing this popup when we change lot number after invoking AB in CM
  lotNumberChangePopup(changeEvent) {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.CONFIRM,
        message: 'pw.productGrid.lotNumberChangeMsg'
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res === true) {
          this.selectedLotNumber.emit({
            data: changeEvent,
            removeFromOrder: true
          });
        } else {
          this.selectedLotNumber.emit({
            data: changeEvent,
            removeFromOrder: false
          });
        }
      });
  }

  resetTcsAmountPopup() {
    this.dialog
      .open(ResetTcsPopupComponent, {
        width: '500px',
        height: 'auto'
      })
      .afterClosed()
      .subscribe(res => {
        if (res) {
          this.resetTcs.emit();
        }
      });
  }

  deleteTcsAmountPopup() {
    this.alertPopupService.open({
      type: AlertPopupTypeEnum.INFO,
      message: 'pw.payment.deleteTcsPaymentLabel'
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.subscription && this.subscription instanceof Subscription) {
      this.subscription.unsubscribe();
    }
  }
}
