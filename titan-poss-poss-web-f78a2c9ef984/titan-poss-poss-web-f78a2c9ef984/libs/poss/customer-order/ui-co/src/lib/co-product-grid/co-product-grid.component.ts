import {
  ChangeDetectionStrategy,
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
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import {
  CheckboxCellComponent,
  DeleteAllRowsComponent,
  DeleteRowComponent,
  DiscountDetailsComponent,
  EditItemComponent,
  ItemDetailsComponent,
  LotNumberAndQuantityComponent
} from '@poss-web/shared/components/ui-ag-grid';
import {
  CurrencyFormatterService,
  CurrencySymbolService,
  WeightFormatterService
} from '@poss-web/shared/components/ui-formatters';
import {
  SelectionDailogOption,
  SelectionDialogService
} from '@poss-web/shared/components/ui-selection-dialog';
import {
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  COItemDetails,
  COItemDetailsResponse,
  COProductGridFieldsEnum,
  DiscountDetailsPopupServiceAbstraction,
  ItemDetailPopupserviceAbstraction,
  ItemDetailsPopupTabType,
  MetalTypeEnum,
  RequestTypeEnum,
  StatusTypesEnum
} from '@poss-web/shared/models';
import { POSS_WEB_CURRENCY_CODE } from '@poss-web/shared/util-config';
import { ColumnApi, GridApi, GridReadyEvent } from 'ag-grid-community';
import { Moment } from 'moment';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CoDetailsPopupComponent } from '../co-details-popup/co-details-popup.component';

const pinLeft = 'left';
const pinRight = 'right';
const selectRSO = 'Select RSO';

@Component({
  selector: 'poss-web-co-product-grid',
  templateUrl: './co-product-grid.component.html',
  styleUrls: ['./co-product-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoProductGridComponent implements OnInit, OnDestroy, OnChanges {
  @Input() coProducts: COItemDetailsResponse;
  @Input() rsoNames = [];
  @Input() rsoDetailsEvent: Observable<{ code: string; name: string }[]>;
  @Input() businessDate: Moment;
  @Input() clearAllEvent: Observable<null>;
  @Input() deleteSuccessResponse$: Observable<COItemDetails>;

  @Output() selectedRso = new EventEmitter<any>();
  @Output() deleteEmit = new EventEmitter<COItemDetails>();
  columnDefs = [];
  defaultColumnDefs = {
    suppressMovable: true,
    resizable: true
  };
  api: GridApi;
  columnApi: ColumnApi;
  animateRows = true;
  suppressRowClickSelection = true;
  domLayout = 'autoHeight';
  rowHeight = 70;
  selectRSONameLabel: string;
  searchByRSOCodeLabel: string;
  viewLabel: string;
  currentColumnName = null;
  currentRowIndex = -1;
  tooltipShowDelay = 1;
  weightCode = 'gms';
  CoProductGridComponent: any = this;
  status: StatusTypesEnum;
  parentForm: FormArray = new FormArray([]);
  formGroup: FormGroup = new FormGroup({});
  COProductGridFieldsEnumRef = COProductGridFieldsEnum;
  naLabel = 'N/A';
  requestTypeEnumRef = RequestTypeEnum;

  destroy$: Subject<null> = new Subject<null>();

  constructor(
    private translate: TranslateService,
    @Inject(POSS_WEB_CURRENCY_CODE) public defaultCurrencyCode,
    private currencySymbolService: CurrencySymbolService,
    private weightFormatterService: WeightFormatterService,
    private currencyFormatterService: CurrencyFormatterService,
    private dialog: MatDialog,
    private selectionDialog: SelectionDialogService,
    private itemDetailPopupservice: ItemDetailPopupserviceAbstraction,
    private discountDetailsPopupService: DiscountDetailsPopupServiceAbstraction,
    private alertPopupService: AlertPopupServiceAbstraction
  ) {}

  ngOnInit(): void {
    this.translate
      .get([
        'pw.newCustomerOrder.variantCodeHeaderTxt',
        'pw.newCustomerOrder.lotNumberHeaderTxt',
        'pw.newCustomerOrder.requestTypeHeaderTxt',
        'pw.newCustomerOrder.orderTypeHeaderTxt',
        'pw.newCustomerOrder.isAutoApprovalHeaderTxt',
        'pw.newCustomerOrder.esceleteOrderHeaderTxt',
        'pw.newCustomerOrder.isSizingHeaderTxt',
        'pw.newCustomerOrder.weightPerUnitHeaderTxt',
        'pw.newCustomerOrder.grossWeightHeaderTxt',
        'pw.newCustomerOrder.RSONameHeaderText',
        'pw.newCustomerOrder.pricePerUnitHeaderTxt',
        'pw.newCustomerOrder.discountHeaderText',
        'pw.newCustomerOrder.totalValueHeaderTxt',
        'pw.newCustomerOrder.viewCODetailsLabel',
        'pw.newCustomerOrder.selectRSONameLabel',
        'pw.newCustomerOrder.searchByRSOCodeLabel',
        'pw.newCustomerOrder.viewLabel'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.viewLabel = translatedMessages['pw.newCustomerOrder.viewLabel'];
        this.columnDefs = [
          {
            headerCheckboxSelection: true,
            checkboxSelection: true,
            colId: COProductGridFieldsEnum.SELECT,
            width: 30,
            minWidth: 30,
            pinned: pinLeft
          },
          {
            headerName:
              translatedMessages['pw.newCustomerOrder.variantCodeHeaderTxt'],
            headerTooltip:
              translatedMessages['pw.newCustomerOrder.variantCodeHeaderTxt'],
            field: COProductGridFieldsEnum.VARIANT_CODE,
            cellRenderer: 'itemDetailsRenderer',
            width: 130,
            minWidth: 130
          },
          {
            headerName:
              translatedMessages['pw.newCustomerOrder.lotNumberHeaderTxt'],
            headerTooltip:
              translatedMessages['pw.newCustomerOrder.lotNumberHeaderTxt'],
            field: COProductGridFieldsEnum.LOT_NUMBER,
            cellRenderer: 'lotNumberAndQuantityRenderer',
            width: 80,
            minWidth: 80
          },
          {
            headerName:
              translatedMessages['pw.newCustomerOrder.requestTypeHeaderTxt'],
            headerTooltip:
              translatedMessages['pw.newCustomerOrder.requestTypeHeaderTxt'],
            field: COProductGridFieldsEnum.REQUEST_TYPE,
            width: 50,
            minWidth: 50
          },
          {
            headerName:
              translatedMessages['pw.newCustomerOrder.orderTypeHeaderTxt'],
            headerTooltip:
              translatedMessages['pw.newCustomerOrder.orderTypeHeaderTxt'],
            field: COProductGridFieldsEnum.ORDER_TYPE,
            valueFormatter: params =>
              params.value ? params.value : this.naLabel,
            cellClass: params => (params.value ? null : 'pw-error-color'),
            width: 50,
            minWidth: 50
          },
          {
            headerName:
              translatedMessages['pw.newCustomerOrder.isAutoApprovalHeaderTxt'],
            headerTooltip:
              translatedMessages['pw.newCustomerOrder.isAutoApprovalHeaderTxt'],
            field: COProductGridFieldsEnum.IS_AUTO_APPROVAL,
            valueFormatter: params =>
              params.value !== null ? params.value : this.naLabel,
            cellRendererSelector: params =>
              params.value !== null
                ? {
                    component: 'checkboxCellRenderer'
                  }
                : null,
            cellClass: params =>
              params.value !== null ? null : 'pw-error-color',
            width: 50,
            minWidth: 50
          },
          {
            headerName:
              translatedMessages['pw.newCustomerOrder.esceleteOrderHeaderTxt'],
            headerTooltip:
              translatedMessages['pw.newCustomerOrder.esceleteOrderHeaderTxt'],
            field: COProductGridFieldsEnum.IS_ESCELETE_ORDER,
            valueFormatter: params =>
              params.value !== null ? params.value : this.naLabel,
            cellRendererSelector: params =>
              params.value !== null
                ? {
                    component: 'checkboxCellRenderer'
                  }
                : null,
            cellClass: params =>
              params.value !== null ? null : 'pw-error-color',
            width: 50,
            minWidth: 50
          },
          {
            headerName:
              translatedMessages['pw.newCustomerOrder.isSizingHeaderTxt'],
            headerTooltip:
              translatedMessages['pw.newCustomerOrder.isSizingHeaderTxt'],
            field: COProductGridFieldsEnum.IS_SIZING,
            valueFormatter: params =>
              params.value !== null ? params.value : this.naLabel,
            cellRendererSelector: params =>
              params.value !== null
                ? {
                    component: 'checkboxCellRenderer'
                  }
                : null,
            cellClass: params =>
              params.value !== null ? null : 'pw-error-color',
            width: 50,
            minWidth: 50
          },
          {
            headerName:
              translatedMessages['pw.newCustomerOrder.weightPerUnitHeaderTxt'] +
              `(${this.weightCode})`,
            headerTooltip:
              translatedMessages['pw.newCustomerOrder.weightPerUnitHeaderTxt'] +
              `(${this.weightCode})`,
            field: COProductGridFieldsEnum.WEIGHT_PER_UNIT,
            valueFormatter: params =>
              params.value
                ? this.weightFormatterService.format(params.value)
                : this.naLabel,
            cellClass: params => (params.value ? null : 'pw-error-color'),
            width: 60,
            minWidth: 60
          },
          {
            headerName:
              translatedMessages['pw.newCustomerOrder.grossWeightHeaderTxt'] +
              `(${this.weightCode})`,
            headerTooltip:
              translatedMessages['pw.newCustomerOrder.grossWeightHeaderTxt'] +
              `(${this.weightCode})`,
            field: COProductGridFieldsEnum.GROSS_WEIGHT,
            valueFormatter: params =>
              params.value
                ? this.weightFormatterService.format(params.value)
                : this.naLabel,
            width: 60,
            minWidth: 60
          },
          {
            headerName:
              translatedMessages['pw.newCustomerOrder.RSONameHeaderText'],
            headerTooltip:
              translatedMessages['pw.newCustomerOrder.RSONameHeaderText'],
            field: COProductGridFieldsEnum.RSO_NAME,
            valueFormatter: params =>
              params.value ? this.getRsoNameFromCode(params.value) : selectRSO,
            cellRenderer: 'editItemRenderer',
            cellClass: 'pw-fourth-color pw-cell-wrap-text',
            singleClickEdit: true,
            width: 80,
            minWidth: 80
          },
          {
            headerName:
              translatedMessages['pw.newCustomerOrder.pricePerUnitHeaderTxt'] +
              `(${this.currencySymbolService.get(this.defaultCurrencyCode)})`,
            headerTooltip:
              translatedMessages['pw.newCustomerOrder.pricePerUnitHeaderTxt'] +
              `(${this.currencySymbolService.get(this.defaultCurrencyCode)})`,
            field: COProductGridFieldsEnum.PRICE_PER_UNIT,
            valueFormatter: params =>
              params.value
                ? this.currencyFormatterService.format(
                    params.value,
                    this.defaultCurrencyCode,
                    false
                  )
                : this.naLabel,
            cellClass: params =>
              params.value
                ? 'pw-justify-content-end'
                : 'pw-error-color pw-justify-content-end',
            width: 80,
            minWidth: 80
          },
          {
            headerName:
              translatedMessages['pw.newCustomerOrder.discountHeaderText'] +
              `(${this.currencySymbolService.get(this.defaultCurrencyCode)})`,
            headerTooltip:
              translatedMessages['pw.newCustomerOrder.discountHeaderText'] +
              `(${this.currencySymbolService.get(this.defaultCurrencyCode)})`,
            field: COProductGridFieldsEnum.DISCOUNT,
            valueFormatter: params =>
              params.value
                ? this.currencyFormatterService.format(
                    params.value,
                    this.defaultCurrencyCode,
                    false
                  )
                : this.naLabel,
            cellClass: params =>
              params.value
                ? 'pw-justify-content-end'
                : 'pw-error-color pw-justify-content-end',
            // cellRenderer: 'discountDetailsRenderer',
            width: 80,
            minWidth: 80
          },
          {
            headerName:
              translatedMessages['pw.newCustomerOrder.totalValueHeaderTxt'] +
              `(${this.currencySymbolService.get(this.defaultCurrencyCode)})`,
            headerTooltip:
              translatedMessages['pw.newCustomerOrder.totalValueHeaderTxt'] +
              `(${this.currencySymbolService.get(this.defaultCurrencyCode)})`,
            field: COProductGridFieldsEnum.TOTAL_VALUE,
            valueFormatter: params =>
              params.value
                ? this.currencyFormatterService.format(
                    params.value,
                    this.defaultCurrencyCode,
                    false
                  )
                : this.naLabel,
            cellClass: params =>
              params.value
                ? 'pw-justify-content-end'
                : 'pw-error-color pw-justify-content-end',
            cellRenderer: params => {
              return params.value
                ? `<a class="pw-anchor-underline">${this.currencyFormatterService.format(
                    params.value,
                    this.defaultCurrencyCode,
                    false
                  )}</a>`
                : this.naLabel;
            },
            width: 80,
            minWidth: 80
          },
          {
            headerName:
              translatedMessages['pw.newCustomerOrder.viewCODetailsLabel'],
            headerTooltip:
              translatedMessages['pw.newCustomerOrder.viewCODetailsLabel'],
            field: COProductGridFieldsEnum.VIEW_CO,
            cellRenderer: params =>
              `<a class="pw-anchor-underline">${this.viewLabel}</a>`,
            width: 50,
            minWidth: 50
          },
          {
            headerComponent: 'deleteAllRowsRenderer',
            cellRenderer: 'deleteRowRenderer',
            field: COProductGridFieldsEnum.DELETE,
            width: 21,
            minWidth: 21,
            maxWidth: 21,
            cellClass: 'pw-delete-icon-width',
            headerClass: 'pw-delete-icon-width',
            pinned: pinRight
          },
          {
            field: COProductGridFieldsEnum.ROWID,
            hide: true
          }
        ];
        this.selectRSONameLabel =
          translatedMessages['pw.newCustomerOrder.selectRSONameLabel'];
        this.searchByRSOCodeLabel =
          translatedMessages['pw.newCustomerOrder.searchByRSOCodeLabel'];
      });
    this.componentInit();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['coProducts']) {
      if (this.coProducts) {
        let itemDetails = this.coProducts?.itemDetails;
        this.status = this.coProducts.status;
        if (itemDetails.isAdd) {
          this.onAddRow(itemDetails);
        } else {
          this.onUpdateRow(itemDetails);
        }
      }
    }
  }

  onAddRow(newItem: COItemDetails) {
    this.createFormControls(newItem);
    const res = this.api.applyTransaction({ add: [newItem] });
    this.api.setFocusedCell(
      res.add[0].rowIndex,
      COProductGridFieldsEnum.VARIANT_CODE
    );
  }

  onUpdateRow(newItem: COItemDetails) {
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

  componentInit() {
    this.rsoDetailsEvent?.pipe(takeUntil(this.destroy$)).subscribe(data => {
      if (data.length) {
        this.rsoNames = data;
      }
    });

    this.clearAllEvent?.pipe(takeUntil(this.destroy$)).subscribe(data => {
      this.clearAllData();
    });

    this.deleteSuccessResponse$
      ?.pipe(takeUntil(this.destroy$))
      .subscribe((data: COItemDetails) => {
        if (data) {
          this.deleteFormControls(data.itemId);
          this.api.applyTransaction({ remove: [data] });
        }
      });
  }

  gridReady(params: GridReadyEvent) {
    this.api = params.api;
    this.columnApi = params.columnApi;
    this.api.showNoRowsOverlay();
  }

  onGridSizeChanged() {
    if (this.api) {
      this.api.sizeColumnsToFit();
      this.api.redrawRows();
    }
  }

  /**
   * Unique identifier for each row
   * @param data : data of each row
   */
  getRowNodeId(data: any) {
    return data?.itemId;
  }

  getComponents() {
    return {
      deleteRowRenderer: DeleteRowComponent,
      discountDetailsRenderer: DiscountDetailsComponent,
      deleteAllRowsRenderer: DeleteAllRowsComponent,
      editItemRenderer: EditItemComponent,
      checkboxCellRenderer: CheckboxCellComponent,
      lotNumberAndQuantityRenderer: LotNumberAndQuantityComponent,
      itemDetailsRenderer: ItemDetailsComponent
    };
  }

  getContext() {
    return {
      disableCheckBox: true,
      componentParent: this.CoProductGridComponent
    };
  }

  onCellClicked(clickEvent) {
    if (clickEvent.colDef.field === COProductGridFieldsEnum.VIEW_CO) {
      this.openCODetails(clickEvent.data);
    } else if (clickEvent.colDef.field === COProductGridFieldsEnum.RSO_NAME) {
      this.openRSOSelectionPopup(clickEvent.data);
    } else if (
      clickEvent.colDef.field === COProductGridFieldsEnum.TOTAL_VALUE
    ) {
      this.openItemDetails(clickEvent.data);
    } else if (clickEvent.colDef.field === COProductGridFieldsEnum.DISCOUNT) {
      // this.openDiscountDetails(clickEvent.data);
    }
  }

  onCellKeyPress(pressEvent) {
    const keyPressed = pressEvent.event.key;
    if (keyPressed === 'Enter') {
      if (pressEvent.colDef.field === COProductGridFieldsEnum.VIEW_CO) {
        this.openCODetails(pressEvent.data);
      } else if (pressEvent.colDef.field === COProductGridFieldsEnum.RSO_NAME) {
        this.openRSOSelectionPopup(pressEvent.data);
      } else if (
        pressEvent.colDef.field === COProductGridFieldsEnum.TOTAL_VALUE
      ) {
        this.openItemDetails(pressEvent.data);
      } else if (pressEvent.colDef.field === COProductGridFieldsEnum.DISCOUNT) {
        // this.openDiscountDetails(pressEvent.data);
      } else if (pressEvent.colDef.field === COProductGridFieldsEnum.DELETE) {
        this.openConfirmDialogForDelete(pressEvent.data);
      }
    }
  }

  openCODetails(dataToBeLoaded) {
    const dialogRef = this.dialog.open(CoDetailsPopupComponent, {
      width: '60vw',
      data: { dataToBeLoaded, businessDate: this.businessDate }
    });

    dialogRef.afterClosed().subscribe(result => {});
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
          this.selectedRso.emit({
            oldData: eventData,
            selectedData: selectedOption.id
          });
        }
      });
  }

  openItemDetails(dataToBeLoaded) {
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
          dataToBeLoaded.lotNumber && dataToBeLoaded.lotNumber !== '#'
            ? dataToBeLoaded.lotNumber
            : null,
        productCategory: dataToBeLoaded?.productCategoryCode,
        productGroup: dataToBeLoaded?.productGroupCode,
        grossWeight: dataToBeLoaded.grossWeight,
        netWeight: dataToBeLoaded?.priceDetails?.isUcp
          ? dataToBeLoaded.grossWeight
          : dataToBeLoaded?.priceBreakUp?.totalMetalWeight,
        goldRate: goldRate,
        platinumRate: platinumRate,
        silverRate: silverRate,
        isCOMOrder: true
      },
      priceBreakup: dataToBeLoaded.priceBreakUp
    });
  }

  openDiscountDetails(dataToBeLoaded) {
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
    this.discountDetailsPopupService
      .open({
        readOnly: false,
        itemData: {
          currencyCode: this.defaultCurrencyCode,
          weightUnit: this.weightCode,
          headerDetails: {
            showTitle: true,
            itemCode: dataToBeLoaded.itemCode,
            lotNumber:
              dataToBeLoaded.lotNumber && dataToBeLoaded.lotNumber !== '#'
                ? dataToBeLoaded.lotNumber
                : null,
            productCategory: dataToBeLoaded?.productCatergory,
            productGroup: dataToBeLoaded?.productGroup,
            grossWeight: dataToBeLoaded.actualWeight,
            netWeight: dataToBeLoaded?.priceDetails?.isUcp
              ? dataToBeLoaded.actualWeight
              : dataToBeLoaded?.priceBreakUp?.totalMetalWeight,
            goldRate: goldRate,
            platinumRate: platinumRate,
            silverRate: silverRate,
            selectedAutoDiscounts: []
          },
          itemData: dataToBeLoaded.responseData
        }
      })
      .subscribe(data => {
        if (data.type === 'APPLY' || data.type === 'EDIT') {
          if (data.data.reason !== null) {
            // this.discountPopupClosed.emit({
            //   reason: data.data.reason,
            //   data: dataToBeLoaded,
            //   rowIndex: event.rowIndex,
            //   discountsReload: data.data.discountsReload
            // });
          } else {
            // this.discountPopupClosed.emit({
            //   reason: null,
            //   data: dataToBeLoaded,
            //   rowIndex: event.rowIndex,
            //   discountsReload: data.data.discountsReload
            // });
          }
        }
      });
  }

  clearAllData() {
    this.api.setRowData([]);
    this.currentColumnName = null;
    this.currentRowIndex = -1;
    this.api.redrawRows();
  }

  onCellFocused(focusEvent) {
    let focusedRowIndex = -1;
    let focusedRowData = this.getAllRows()[focusEvent.rowIndex];

    if (this.parentForm.value.length) {
      focusedRowIndex = this.parentForm.value.findIndex(
        x => x.itemId === focusedRowData?.itemId
      );
    }

    // this.getDiscountValues(
    //   this.parentForm.value[focusedRowIndex]?.selectedDiscounts
    // );
    if (focusEvent.column !== null) {
      this.currentColumnName = null;
      this.currentRowIndex = -1;
      if (focusEvent.column.colDef.field) {
        this.currentColumnName = focusEvent.column.colDef.field;
        this.currentRowIndex = focusedRowIndex;
      } else if (focusEvent.column.colId === COProductGridFieldsEnum.SELECT) {
        this.currentColumnName = COProductGridFieldsEnum.SELECT;
      }
    }
  }

  getAllRows() {
    const rowData = [];
    this.api.forEachNode(node => rowData.push(node.data));
    return rowData;
  }

  openConfirmDialogForDelete(data) {
    if (
      this.api.getDisplayedRowCount() === 1 &&
      this.status === StatusTypesEnum.HOLD
    ) {
      this.openOnHoldItemPopup();
    } else {
      this.alertPopupService
        .open({
          type: AlertPopupTypeEnum.CONFIRM,
          message: 'pw.productGrid.deleteConfirmMessage'
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe((res: boolean) => {
          if (res) {
            this.onRemoveSelectedRow(data);
          }
        });
    }
  }

  openConfirmDialogForDeleteAll() {
    if (
      this.api.getDisplayedRowCount() === 1 &&
      this.status === StatusTypesEnum.HOLD
    ) {
      this.openOnHoldItemPopup();
    } else {
      if (this.api.getDisplayedRowCount()) {
        this.alertPopupService
          .open({
            type: AlertPopupTypeEnum.CONFIRM,
            message: 'pw.productGrid.deleteAllConfirmMessage'
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe((res: boolean) => {
            if (res) {
              this.onRemoveRows();
            }
          });
      }
    }
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

  createFormControls(rowNode) {
    const rowNodeData = rowNode;
    this.formGroup = new FormGroup({});
    this.formGroup = new FormGroup({
      itemCode: new FormControl(rowNodeData.itemCode),
      productGroupCode: new FormControl(rowNodeData.productGroupCode),
      lotNumber: new FormControl(rowNodeData.lotNumber),
      totalQuantity: new FormControl(rowNodeData.totalQuantity),
      requestType: new FormControl(rowNodeData.requestType),
      subType: new FormControl(rowNodeData.subType),
      isAutoStn: new FormControl(rowNodeData.isAutoStn),
      ecelesteFlag: new FormControl(rowNodeData.ecelesteFlag),
      isSizing: new FormControl(rowNodeData.isSizing),
      grossWeight: new FormControl(rowNodeData.grossWeight),
      wtPerUnit: new FormControl(rowNodeData.wtPerUnit),
      employeeCode: new FormControl(rowNodeData.employeeCode),
      totalValue: new FormControl(rowNodeData.totalValue),
      totalDiscount: new FormControl(rowNodeData.totalDiscount),
      finalValue: new FormControl(rowNodeData.finalValue),
      itemId: new FormControl(rowNodeData.itemId),
      rowData: new FormControl(rowNodeData)
    });
    this.parentForm.push(this.formGroup);
  }

  refreshFormControls(rowNode) {
    const updateArray = this.parentForm.controls[rowNode.rowIndex];
    const rowNodeData = rowNode.data;
    updateArray.patchValue({
      itemCode: rowNodeData.itemCode,
      productGroupCode: rowNodeData.productGroupCode,
      lotNumber: rowNodeData.lotNumber,
      totalQuantity: rowNodeData.totalQuantity,
      requestType: rowNodeData.requestType,
      subType: rowNodeData.subType,
      isAutoStn: rowNodeData.isAutoStn,
      ecelesteFlag: rowNodeData.ecelesteFlag,
      isSizing: rowNodeData.isSizing,
      grossWeight: rowNodeData.grossWeight,
      wtPerUnit: rowNodeData.wtPerUnit,
      employeeCode: rowNodeData.employeeCode,
      totalValue: rowNodeData.totalValue,
      totalDiscount: rowNodeData.totalDiscount,
      finalValue: rowNodeData.finalValue,
      itemId: rowNodeData.itemId,
      rowData: rowNodeData.rowData
    });
    this.api.setFocusedCell(
      rowNode.rowIndex,
      COProductGridFieldsEnum.VARIANT_CODE
    );
  }

  deleteFormControls(rowNode) {
    this.parentForm.removeAt(
      this.parentForm.controls.findIndex(
        formGroup => formGroup.get('itemId').value === rowNode
      )
    );
  }

  getRsoNameFromCode(code: string) {
    if (this.rsoNames.length !== 0) {
      for (const rso of this.rsoNames) {
        if (rso.code === code) return rso.name;
        else if (code === null) return selectRSO;
      }
    }
    return code;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
