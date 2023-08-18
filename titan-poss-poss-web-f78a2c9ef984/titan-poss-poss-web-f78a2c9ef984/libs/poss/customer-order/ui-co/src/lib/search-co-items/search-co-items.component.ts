import { ChangeDetectionStrategy, Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  CurrencyFormatterService,
  CurrencySymbolService,
  DateFormatterService
} from '@poss-web/shared/components/ui-formatters';
import { CODetailsViewGridFieldsEnum, COMOrders } from '@poss-web/shared/models';
import { POSS_WEB_CURRENCY_CODE } from '@poss-web/shared/util-config';
import { ColumnApi, GridApi, GridReadyEvent } from 'ag-grid-community';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-search-co-items',
  templateUrl: './search-co-items.component.html',
  styleUrls: ['./search-co-items.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchCoItemsComponent implements OnInit, OnDestroy {
  @Input() searchedCOItems: COMOrders[] = [];
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
  rowHeight = 35;
  isFocusing = false;
  focusedHeaderName: string;
  currentRowIndex: number;
  currentRowField: string;
  currentRowInfo: string;
  destroy$: Subject<null> = new Subject<null>();

  constructor(
    private translate: TranslateService,
    private dateFormatterService: DateFormatterService,
    private currencySymbolService: CurrencySymbolService,
    @Inject(POSS_WEB_CURRENCY_CODE) public defaultCurrencyCode,
    private currencyFormatterService: CurrencyFormatterService
  ) {}

  ngOnInit(): void {
    this.translate
      .get([
        'pw.searchCustomerOrder.docNumberHeaderTxt',
        'pw.searchCustomerOrder.customerNameHeaderTxt',
        'pw.searchCustomerOrder.docDateHeaderTxt',
        'pw.searchCustomerOrder.locationCodeHeaderTxt',
        'pw.searchCustomerOrder.statusHeaderTxt',
        'pw.searchCustomerOrder.netAmountHeaderTxt',
        'pw.searchCustomerOrder.subTxnTypeHeaderTxt'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.columnDefs = [
          {
            field: CODetailsViewGridFieldsEnum.DOC_NO,
            headerName:
              translatedMessages['pw.searchCustomerOrder.docNumberHeaderTxt'],
            cellRenderer: headerName =>
              `<a class="pw-anchor-underline">${headerName.value}</a>`
          },
          {
            field: CODetailsViewGridFieldsEnum.CUSTOMER_NAME,
            headerName:
              translatedMessages['pw.searchCustomerOrder.customerNameHeaderTxt']
          },
          {
            field: CODetailsViewGridFieldsEnum.DOC_DATE,
            headerName:
              translatedMessages['pw.searchCustomerOrder.docDateHeaderTxt'],
            valueFormatter: params =>
              params.value
                ? this.dateFormatterService.format(params.value)
                : 'NA'
          },
          {
            field: CODetailsViewGridFieldsEnum.LOCATION_CODE,
            headerName:
              translatedMessages['pw.searchCustomerOrder.locationCodeHeaderTxt']
          },
          {
            field: CODetailsViewGridFieldsEnum.STATUS,
            headerName:
              translatedMessages['pw.searchCustomerOrder.statusHeaderTxt']
          },
          {
            field: CODetailsViewGridFieldsEnum.NET_AMOUNT,
            headerName:
              translatedMessages['pw.searchCustomerOrder.netAmountHeaderTxt'] +
              ` (${this.currencySymbolService.get(this.defaultCurrencyCode)})`,
            valueFormatter: params =>
              this.currencyFormatterService.format(
                params.value,
                this.defaultCurrencyCode,
                false
              ),
            type: 'numericColumn',
            cellClass: 'pw-justify-content-end'
          },
          {
            field: CODetailsViewGridFieldsEnum.SUB_TXN_TYPE,
            headerName:
              translatedMessages['pw.searchCustomerOrder.subTxnTypeHeaderTxt']
          }
        ];
      });
  }

  gridReady(params: GridReadyEvent) {
    this.api = params.api;
    this.columnApi = params.columnApi;
  }

  onGridSizeChanged() {
    this.api.sizeColumnsToFit();
  }

   // custom components used in ag grid
   getComponents() {
    return {
      // tooltipRenderer: TooltipComponent
    };
  }

  getContext() {
    // return {
    // formGroup: this.parentForm.controls,
    // componentParent: this.productGridComponent,
    // validators: {
    //   selectedLotNumber: [
    //     this.fieldValidatorService.requiredField(this.qtyMsg),
    //     this.fieldValidatorService.min(this.minQuantity, this.qtyMsg),
    //     this.fieldValidatorService.max(this.maxQuantity, this.qtyMsg)
    //   ]
    // },
    // disableCheckBox: true
    // };
  }


  onCellFocused(event) {
    this.isFocusing = true;
    this.focusedHeaderName = event.column.colDef.headerName;
    this.currentRowIndex = Number(event.rowIndex);
    this.currentRowField = event.column.colDef.field;
    this.currentRowInfo = this.api.getValue(
      this.currentRowField,
      this.api.getDisplayedRowAtIndex(this.currentRowIndex)
    );
    if (
      this.currentRowField === CODetailsViewGridFieldsEnum.DOC_DATE
    )
      this.currentRowInfo = this.dateFormatterService.format(
        moment(this.currentRowInfo)
      );
  }

  focusOut(event) {
    this.isFocusing = false;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
