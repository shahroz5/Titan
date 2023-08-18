import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DeleteRowComponent } from '@poss-web/shared/components/ui-ag-grid';
import {
  CurrencyFormatterService,
  CurrencySymbolService,
  DateFormatterService,
  WeightFormatterService
} from '@poss-web/shared/components/ui-formatters';
import {
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  CreditNote
} from '@poss-web/shared/models';
import { POSS_WEB_CURRENCY_CODE } from '@poss-web/shared/util-config';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-merge-grf-list',
  templateUrl: './merge-grf-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MergeGrfListComponent implements OnDestroy, OnChanges {
  @Input() grfCNs: CreditNote[];
  @Output() deleteGRFCN = new EventEmitter<string>();
  @Output() mergeGRFCNs = new EventEmitter<CreditNote[]>();
  api: GridApi;
  context = this;
  rowSelection = 'multiple';
  domLayout = 'autoHeight';
  animateRows = true;
  rowData = [];
  rowHeight = 35;
  destroy$ = new Subject();
  defaultColDef = {
    suppressMovable: true
  };
  @ViewChild('fileInput') fileInput;
  columnDefs = [];
  component: any = this;
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['grfCNs']) {
      this.mergeGRFCNs.emit(this.grfCNs);
    }
  }

  constructor(
    private translateService: TranslateService,
    private currencyFormatterService: CurrencyFormatterService,
    private weightFormatterService: WeightFormatterService,
    private dateFormatterService: DateFormatterService,
    private currencySymbolService: CurrencySymbolService,
    private alertPopupService: AlertPopupServiceAbstraction,
    @Inject(POSS_WEB_CURRENCY_CODE) public defaultCurrencyCode
  ) {
    this.translateService
      .get([
        'pw.grf.grfNumberLabel',
        'pw.grf.fiscalYearLabel',
        'pw.grf.customerNameLabel',
        'pw.grf.goldWtLabel',
        'pw.grf.goldRateLabel',
        'pw.grf.statusLabel',
        'pw.grf.utilisedAmount',
        'pw.grf.cnDateLabel',
        'pw.grf.amountLabel',
        'pw.grf.cashCollected'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMsg: any) => {
        this.columnDefs = [
          {
            headerName: translatedMsg['pw.grf.grfNumberLabel'],
            field: 'docNo',
            minWidth: 70,
            width: 70,
            resizable: true,
            suppressSizeToFit: true
          },
          {
            headerName: translatedMsg['pw.grf.fiscalYearLabel'],
            field: 'fiscalYear',
            minWidth: 100,
            width: 100,
            resizable: true,
            suppressSizeToFit: true
          },
          {
            headerName: translatedMsg['pw.grf.customerNameLabel'],
            field: 'customerName',
            minWidth: 120,
            width: 120,
            resizable: true,
            suppressSizeToFit: true
          },
          {
            headerName: translatedMsg['pw.grf.cnDateLabel'],
            field: 'docDate',
            minWidth: 100,
            width: 100,
            resizable: true,
            suppressSizeToFit: true,
            valueFormatter: params => {
              return this.dateFormatterService.format(params.value);
            }
          },
          {
            headerName: translatedMsg['pw.grf.statusLabel'],
            field: 'status',
            minWidth: 70,
            width: 70,
            suppressSizeToFit: true,
            resizable: true
          },
          {
            headerName: translatedMsg['pw.grf.goldWtLabel'],
            field: 'weight',
            minWidth: 100,
            width: 100,
            suppressSizeToFit: true,
            resizable: true,
            valueFormatter: params => {
              return this.weightFormatterService.format(params.value);
            }
          },
          {
            headerName:
              translatedMsg['pw.grf.goldRateLabel'] +
              `(${this.currencySymbolService.get(this.defaultCurrencyCode)})`,
            field: 'ratePerUnit',
            minWidth: 100,
            suppressSizeToFit: true,
            width: 100,
            resizable: true,
            valueFormatter: params => {
              return this.currencyFormatterService.format(
                params.value,
                null,
                false
              );
            }
          },
          {
            headerName:
              translatedMsg['pw.grf.amountLabel'] +
              `(${this.currencySymbolService.get(this.defaultCurrencyCode)})`,
            field: 'amount',
            minWidth: 100,
            suppressSizeToFit: true,
            width: 100,
            resizable: true,
            valueFormatter: params => {
              return this.currencyFormatterService.format(
                params.value,
                null,
                false
              );
            }
          },
          {
            headerName:
              translatedMsg['pw.grf.utilisedAmount'] +
              `(${this.currencySymbolService.get(this.defaultCurrencyCode)})`,
            field: 'utilisedAmount',
            minWidth: 105,
            suppressSizeToFit: true,
            width: 105,
            resizable: true,
            valueFormatter: params => {
              return this.currencyFormatterService.format(
                params.value,
                null,
                false
              );
            }
          },
          {
            headerName:
              translatedMsg['pw.grf.cashCollected'] +
              `(${this.currencySymbolService.get(this.defaultCurrencyCode)})`,
            field: 'cashCollected',
            minWidth: 100,
            width: 100,
            suppressSizeToFit: true,
            resizable: true,
            valueFormatter: params => {
              return this.currencyFormatterService.format(
                params.value,
                null,
                false
              );
            }
          },
          {
            headerName: '',
            field: 'id',
            cellRenderer: 'deleteRowRenderer',
            width: 21,
            minWidth: 21,
            maxWidth: 21,
            suppressSizeToFit: true,
            cellClass: 'pw-delete-icon-width',
            headerClass: 'pw-delete-icon-width'
          }
        ];
        // this.columnDefs = [
        //   {
        //     headerName: translatedMsg['pw.grf.grfNumberLabel'],
        //     field: 'docNo',
        //     flex: 1,
        //     resizable: true,
        //     suppressSizeToFit: true
        //   },
        //   {
        //     headerName: translatedMsg['pw.grf.fiscalYearLabel'],
        //     field: 'fiscalYear',
        //     flex: 1,
        //     resizable: true,
        //     suppressSizeToFit: true
        //   },
        //   {
        //     headerName: translatedMsg['pw.grf.customerNameLabel'],
        //     field: 'customerName',
        //     flex: 1,
        //     resizable: true,
        //     suppressSizeToFit: true
        //   },
        //   {
        //     headerName: translatedMsg['pw.grf.cnDateLabel'],
        //     field: 'docDate',
        //     flex: 1,
        //     resizable: true,
        //     suppressSizeToFit: true,
        //     valueFormatter: params => {
        //       return this.dateFormatterService.format(params.value);
        //     }
        //   },
        //   {
        //     headerName: translatedMsg['pw.grf.statusLabel'],
        //     field: 'status',
        //     flex: 1,
        //     suppressSizeToFit: true,
        //     resizable: true
        //   },
        //   {
        //     headerName: translatedMsg['pw.grf.goldWtLabel'],
        //     field: 'weight',
        //     flex: 1,
        //     suppressSizeToFit: true,
        //     resizable: true,
        //     valueFormatter: params => {
        //       return this.weightFormatterService.format(params.value);
        //     }
        //   },
        //   {
        //     headerName:
        //       translatedMsg['pw.grf.goldRateLabel'] +
        //       `(${this.currencySymbolService.get(this.defaultCurrencyCode)})`,
        //     field: 'ratePerUnit',
        //     suppressSizeToFit: true,
        //     flex: 1,
        //     resizable: true,
        //     valueFormatter: params => {
        //       return this.currencyFormatterService.format(
        //         params.value,
        //         null,
        //         false
        //       );
        //     }
        //   },
        //   {
        //     headerName:
        //       translatedMsg['pw.grf.amountLabel'] +
        //       `(${this.currencySymbolService.get(this.defaultCurrencyCode)})`,
        //     field: 'amount',
        //     suppressSizeToFit: true,
        //     flex: 1,
        //     resizable: true,
        //     valueFormatter: params => {
        //       return this.currencyFormatterService.format(
        //         params.value,
        //         null,
        //         false
        //       );
        //     }
        //   },
        //   {
        //     headerName:
        //       translatedMsg['pw.grf.utilisedAmount'] +
        //       `(${this.currencySymbolService.get(this.defaultCurrencyCode)})`,
        //     field: 'utilisedAmount',
        //     suppressSizeToFit: true,
        //     flex: 1,
        //     resizable: true,
        //     valueFormatter: params => {
        //       return this.currencyFormatterService.format(
        //         params.value,
        //         null,
        //         false
        //       );
        //     }
        //   },
        //   {
        //     headerName:
        //       translatedMsg['pw.grf.cashCollected'] +
        //       `(${this.currencySymbolService.get(this.defaultCurrencyCode)})`,
        //     field: 'cashCollected',
        //     flex: 1,
        //     suppressSizeToFit: true,
        //     resizable: true,
        //     valueFormatter: params => {
        //       return this.currencyFormatterService.format(
        //         params.value,
        //         null,
        //         false
        //       );
        //     }
        //   },
        //   {
        //     headerName: '',
        //     field: 'id',
        //     cellRenderer: 'deleteRowRenderer',
        //     width: 21,
        //     minWidth: 21,
        //     maxWidth: 21,
        //     suppressSizeToFit: true,
        //     cellClass: 'pw-delete-icon-width',
        //     headerClass: 'pw-delete-icon-width'
        //   }
        // ];
      });
  }

  getComponents() {
    return {
      deleteRowRenderer: DeleteRowComponent
    };
  }

  openConfirmDialogForDelete(data: any) {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.CONFIRM,
        message: 'pw.discountProductGroupMapping.deleteConfirmMessage'
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res === true) {
          console.log('data', data);
          this.deleteGRFCN.emit(data.id);
          this.api.applyTransaction({ remove: [data] });
        }
      });
  }
  getContext() {
    return {
      componentParent: this.component
    };
  }
  gridReady(params: GridReadyEvent) {
    this.api = params.api;
  }
  onGridSizeChanged() {
    if (window.innerWidth >= 991) {
      this.api.sizeColumnsToFit();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
