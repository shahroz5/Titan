import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  Inject,
  EventEmitter,
  Output,
  SimpleChanges,
  ChangeDetectionStrategy
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';
import { CheckboxCellComponent } from '@poss-web/shared/components/ui-ag-grid';
import {
  CurrencyFormatterService,
  CurrencySymbolService,
  DateFormatterService,
  WeightFormatterService
} from '@poss-web/shared/components/ui-formatters';
import {
  COMOrders,
  FetchCOGridFieldsEnum,
  RequestTypeEnum
} from '@poss-web/shared/models';
import { POSS_WEB_CURRENCY_CODE } from '@poss-web/shared/util-config';
import { ColumnApi, GridApi, GridReadyEvent } from 'ag-grid-community';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

const pinLeft = 'left';
const pinRight = 'right';
const naLabel = 'N/A';

@Component({
  selector: 'poss-web-fetch-co-items',
  templateUrl: './fetch-co-items.component.html',
  styleUrls: ['./fetch-co-items.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FetchCoItemsComponent implements OnInit, OnDestroy {
  @Input() fetchedCOItems: COMOrders[] = [];
  @Input() pageSizeOptions: number[] = [];
  @Input() initialPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };
  @Input() orderType = RequestTypeEnum.EA;
  @Output() selectedOrders = new EventEmitter<COMOrders[]>();
  columnDefs = [];
  defaultColumnDefs = {
    suppressMovable: true,
    resizable: true
  };
  api: GridApi;
  columnApi: ColumnApi;
  animateRows = true;
  rowSelection = 'multiple';
  suppressRowClickSelection = true;
  domLayout = 'autoHeight';
  rowHeight = 35;
  pagination = true;
  pageSizeControl = new FormControl();
  tooltipShowDelay = 1;
  isFocusing = false;
  focusedHeaderName: string;
  currentRowIndex: number;
  currentRowField: string;
  currentRowInfo: string;
  weightCode = 'gms';
  destroy$: Subject<null> = new Subject<null>();
  selectedProduct: COMOrders;

  constructor(
    private translate: TranslateService,
    private currencySymbolService: CurrencySymbolService,
    private weightFormatterService: WeightFormatterService,
    private currencyFormatterService: CurrencyFormatterService,
    private dateFormatterService: DateFormatterService,
    @Inject(POSS_WEB_CURRENCY_CODE) public defaultCurrencyCode
  ) {}

  ngOnInit(): void {
    this.pageSizeControl.patchValue(this.initialPageEvent.pageSize);
    this.translate
      .get([
        'pw.fetchCustomerOrder.customerMobileNoHeaderTxt',
        'pw.fetchCustomerOrder.customerNameHeaderTxt',
        'pw.fetchCustomerOrder.COMOrderNumberHeaderTxt',
        'pw.fetchCustomerOrder.COMOrderDateHeaderTxt',
        'pw.fetchCustomerOrder.itemCodeHeaderTxt',
        'pw.fetchCustomerOrder.grossWeightHeaderTxt',
        'pw.fetchCustomerOrder.quantityHeaderTxt',
        'pw.fetchCustomerOrder.requestTypeHeaderTxt',
        'pw.fetchCustomerOrder.autoSTNHeaderTxt',
        'pw.fetchCustomerOrder.expectedDeliveryDateHeaderTxt',
        'pw.fetchCustomerOrder.orderValueHeaderTxt'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.columnDefs = [
          {
            headerCheckboxSelection: params => {
              if (
                this.orderType === RequestTypeEnum.EA &&
                this.fetchedCOItems.length
              ) {
                return this.fetchedCOItems.every(
                  element =>
                    element.mobileNumber ===
                      this.fetchedCOItems[0].mobileNumber &&
                    this.requestTypeMerge(
                      element.requestType,
                      this.fetchedCOItems[0].requestType
                    )
                );
              }
              return false;
            },
            checkboxSelection: params => {
              if (
                this.orderType === RequestTypeEnum.EA &&
                this.selectedProduct
              ) {
                return (
                  params.data.mobileNumber ===
                    this.selectedProduct.mobileNumber &&
                  this.requestTypeMerge(
                    params.data.requestType,
                    this.selectedProduct.requestType
                  )
                );
              }
              return true;
            },
            colId: FetchCOGridFieldsEnum.SELECT,
            width: 30,
            minWidth: 30,
            pinned: pinLeft
          },
          {
            headerName:
              translatedMessages[
                'pw.fetchCustomerOrder.customerMobileNoHeaderTxt'
              ],
            headerTooltip:
              translatedMessages[
                'pw.fetchCustomerOrder.customerMobileNoHeaderTxt'
              ],
            field: FetchCOGridFieldsEnum.CUSTOMER_MOBILE_NO,
            width: 120,
            minWidth: 120
          },
          {
            headerName:
              translatedMessages['pw.fetchCustomerOrder.customerNameHeaderTxt'],
            headerTooltip:
              translatedMessages['pw.fetchCustomerOrder.customerNameHeaderTxt'],
            field: FetchCOGridFieldsEnum.CUSTOMER_NAME,
            width: 100,
            minWidth: 100
          },
          {
            headerName:
              translatedMessages[
                'pw.fetchCustomerOrder.COMOrderNumberHeaderTxt'
              ],
            headerTooltip:
              translatedMessages[
                'pw.fetchCustomerOrder.COMOrderNumberHeaderTxt'
              ],
            field: FetchCOGridFieldsEnum.COM_ORDER_NO,
            width: 120,
            minWidth: 120
          },
          {
            headerName:
              translatedMessages['pw.fetchCustomerOrder.COMOrderDateHeaderTxt'],
            headerTooltip:
              translatedMessages['pw.fetchCustomerOrder.COMOrderDateHeaderTxt'],
            field: FetchCOGridFieldsEnum.COM_ORDER_DATE,
            valueFormatter: params =>
              params.value
                ? this.dateFormatterService.format(params.value)
                : naLabel,
            width: 90,
            minWidth: 90
          },
          {
            headerName:
              translatedMessages['pw.fetchCustomerOrder.itemCodeHeaderTxt'],
            headerTooltip:
              translatedMessages['pw.fetchCustomerOrder.itemCodeHeaderTxt'],
            field: FetchCOGridFieldsEnum.ITEM_CODE,
            valueFormatter: params => (params.value ? params.value : naLabel),
            width: 100,
            minWidth: 100,
            cellClass: params => (params.value ? null : 'pw-error-color')
          },
          {
            headerName:
              translatedMessages['pw.fetchCustomerOrder.grossWeightHeaderTxt'] +
              `(${this.weightCode})`,
            headerTooltip:
              translatedMessages['pw.fetchCustomerOrder.grossWeightHeaderTxt'] +
              `(${this.weightCode})`,
            field: FetchCOGridFieldsEnum.GROSS_WEIGHT,
            valueFormatter: params =>
              this.weightFormatterService.format(params.value),
            width: 50,
            minWidth: 50,
            cellClass: 'pw-justify-content-end',
            type: 'numericColumn'
          },
          {
            headerName:
              translatedMessages['pw.fetchCustomerOrder.quantityHeaderTxt'],
            headerTooltip:
              translatedMessages['pw.fetchCustomerOrder.quantityHeaderTxt'],
            field: FetchCOGridFieldsEnum.QUANTITY,
            width: 40,
            minWidth: 40
          },
          {
            headerName:
              translatedMessages['pw.fetchCustomerOrder.requestTypeHeaderTxt'],
            headerTooltip:
              translatedMessages['pw.fetchCustomerOrder.requestTypeHeaderTxt'],
            field: FetchCOGridFieldsEnum.REQUEST_TYPE,
            width: 50,
            minWidth: 50
          },
          {
            headerName:
              translatedMessages['pw.fetchCustomerOrder.autoSTNHeaderTxt'],
            headerTooltip:
              translatedMessages['pw.fetchCustomerOrder.autoSTNHeaderTxt'],
            field: FetchCOGridFieldsEnum.AUTO_STN,
            valueFormatter: params =>
              params.value !== null ? params.value : naLabel,
            cellRendererSelector: params =>
              params.value !== null
                ? {
                    component: 'checkboxCellRenderer'
                  }
                : null,
            cellClass: params =>
              params.value !== null
                ? null
                : 'pw-error-color pw-justify-content-center',
            width: 50,
            minWidth: 50
          },
          {
            headerName:
              translatedMessages[
                'pw.fetchCustomerOrder.expectedDeliveryDateHeaderTxt'
              ],
            headerTooltip:
              translatedMessages[
                'pw.fetchCustomerOrder.expectedDeliveryDateHeaderTxt'
              ],
            field: FetchCOGridFieldsEnum.EXPECTED_DELIVERY_DATE,
            valueFormatter: params =>
              params.value
                ? this.dateFormatterService.format(params.value)
                : naLabel,
            cellClass: params => (params.value ? null : 'pw-error-color'),
            width: 90,
            minWidth: 90
          },
          {
            headerName:
              translatedMessages['pw.fetchCustomerOrder.orderValueHeaderTxt'] +
              `(${this.currencySymbolService.get(this.defaultCurrencyCode)})`,
            headerTooltip:
              translatedMessages['pw.fetchCustomerOrder.orderValueHeaderTxt'] +
              `(${this.currencySymbolService.get(this.defaultCurrencyCode)})`,
            field: FetchCOGridFieldsEnum.ORDER_VALUE,
            valueFormatter: params =>
              params.value
                ? this.currencyFormatterService.format(
                    params.value,
                    this.defaultCurrencyCode,
                    false
                  )
                : naLabel,
            cellClass: params =>
              params.value
                ? 'pw-justify-content-end'
                : 'pw-error-color pw-justify-content-end',
            width: 100,
            minWidth: 100,
            type: 'numericColumn',
            pinned: pinRight
          },
          {
            field: FetchCOGridFieldsEnum.ROWID,
            hide: true
          }
        ];
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['fetchedCOItems']) {
      // if (this.api && this.columnApi) {
      //   if (this.orderType === RequestTypeEnum.COM) {
      //     this.columnApi.setColumnVisible(
      //       FetchCOGridFieldsEnum.ITEM_CODE,
      //       false
      //     );
      //     this.columnApi.setColumnVisible(
      //       FetchCOGridFieldsEnum.AUTO_STN,
      //       false
      //     );
      //   } else {
      //     this.columnApi.setColumnVisible(
      //       FetchCOGridFieldsEnum.ITEM_CODE,
      //       true
      //     );
      //     this.columnApi.setColumnVisible(FetchCOGridFieldsEnum.AUTO_STN, true);
      //   }
      //   this.onGridSizeChanged();
      //   this.refreshHeaderAndRows();
      // }
      if (this.orderType === RequestTypeEnum.COM) {
        this.rowSelection = 'single';
      } else {
        this.rowSelection = 'multiple';
      }
      this.selectedProduct = null;
    }
  }

  gridReady(params: GridReadyEvent) {
    this.api = params.api;
    this.columnApi = params.columnApi;
    this.api.paginationSetPageSize(this.initialPageEvent.pageSize);
  }

  onGridSizeChanged() {
    this.api.sizeColumnsToFit();
    this.refreshHeader();
  }

  onSelectionChanged(event) {
    if (event.api.getSelectedRows().length) {
      this.selectedProduct = event.api.getSelectedRows()[0];
    } else {
      this.selectedProduct = null;
    }
    this.refreshHeaderAndRows();
  }

  // custom components used in ag grid
  getComponents() {
    return {
      checkboxCellRenderer: CheckboxCellComponent
    };
  }

  getContext() {
    return {
      disableCheckBox: true
    };
  }

  /**
   * Unique identifier for each row
   * @param data : data of each row
   */
  getRowNodeId(data: COMOrders) {
    return data.comOrderNumber;
  }

  onPageSizeChanged(event) {
    this.api.paginationSetPageSize(event.value);
  }

  onCellFocused(event) {
    this.isFocusing = true;
    this.focusedHeaderName = event.column.colDef.headerName;
    this.currentRowIndex = Number(event.rowIndex);
    this.currentRowField = event.column.colDef.field;
    this.currentRowInfo = this.api.getValue(
      this.currentRowField,
      this.api.getDisplayedRowAtIndex(this.currentRowIndex)
    )
      ? this.api.getValue(
          this.currentRowField,
          this.api.getDisplayedRowAtIndex(this.currentRowIndex)
        )
      : naLabel;
    if (this.currentRowField === FetchCOGridFieldsEnum.AUTO_STN) {
      this.currentRowInfo =
        this.api.getValue(
          this.currentRowField,
          this.api.getDisplayedRowAtIndex(this.currentRowIndex)
        ) !== null
          ? this.api.getValue(
              this.currentRowField,
              this.api.getDisplayedRowAtIndex(this.currentRowIndex)
            )
          : naLabel;
    } else if (
      this.currentRowField === FetchCOGridFieldsEnum.COM_ORDER_DATE ||
      this.currentRowField === FetchCOGridFieldsEnum.EXPECTED_DELIVERY_DATE
    ) {
      this.currentRowInfo = this.currentRowInfo
        ? this.dateFormatterService.format(this.currentRowInfo)
        : naLabel;
    } else if (this.currentRowField === FetchCOGridFieldsEnum.GROSS_WEIGHT) {
      this.currentRowInfo = this.currentRowInfo
        ? this.weightFormatterService.format(this.currentRowInfo)
        : naLabel;
    } else if (this.currentRowField === FetchCOGridFieldsEnum.ORDER_VALUE) {
      this.currentRowInfo = this.currentRowInfo
        ? this.currencyFormatterService.format(
            this.currentRowInfo,
            this.defaultCurrencyCode,
            false
          )
        : naLabel;
    }
  }

  focusOut(event) {
    this.isFocusing = false;
  }

  createCO() {
    console.log('selected orders in ui', this.api.getSelectedRows());
    this.selectedOrders.emit(this.api.getSelectedRows());
  }

  clearSelection() {
    this.api.deselectAll();
  }

  requestTypeMerge(reqType, selectedProductRequestType) {
    if (
      selectedProductRequestType === RequestTypeEnum.IBT &&
      (reqType === RequestTypeEnum.IBT || reqType === RequestTypeEnum.MTR)
    ) {
      return true;
    } else if (
      selectedProductRequestType === RequestTypeEnum.MTR &&
      (reqType === RequestTypeEnum.IBT || reqType === RequestTypeEnum.MTR)
    ) {
      return true;
    } else if (
      selectedProductRequestType === RequestTypeEnum.PROD &&
      reqType === RequestTypeEnum.PROD
    ) {
      return true;
    } else if (
      selectedProductRequestType === RequestTypeEnum.COM &&
      reqType === RequestTypeEnum.COM
    ) {
      return true;
    } else {
      return false;
    }
  }

  refreshHeaderAndRows() {
    this.api.refreshHeader();
    this.api.redrawRows();
  }

  refreshHeader() {
    this.api.refreshHeader();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
