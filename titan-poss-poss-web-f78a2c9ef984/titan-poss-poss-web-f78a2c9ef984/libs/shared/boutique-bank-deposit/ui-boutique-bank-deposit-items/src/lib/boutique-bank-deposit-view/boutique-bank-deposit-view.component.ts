import {
  ChangeDetectionStrategy,
  Component,
  Input,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CurrencyFormatterService } from '@poss-web/shared/components/ui-formatters';
import { BankDepositDetails } from '@poss-web/shared/models';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-boutique-bank-deposit-view',
  templateUrl: './boutique-bank-deposit-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoutiqueBankDepositViewComponent  {
  @Input() bankDepositDetails: BankDepositDetails[];
  domLayout = 'autoHeight';
  destroy$ = new Subject<null>();
  columnDefs = [];
  api: GridApi;
  rowHeight = '35';
  animateRows = true;
  defaultColDef = {
    suppressMovable: true
  };
  isFocusing = false;
  focusedHeaderName: string;
  currentRowIndex: number;
  currentRowField: string;
  currentRowInfo: string;

  constructor(
    private translate: TranslateService,
    private currencyFormatterService: CurrencyFormatterService
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
            width: 50,
            minWidth: 50
          },
          {
            headerName:
              translatedMessages['pw.boutiqueBankDeposit.bankNameLabel'],
            field: 'payerBankName',
            resizable: true,
            suppressSizeToFit: true,
            width: 100,
            minWidth: 100
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
            width: 100,
            minWidth: 100
          },

          {
            headerName:
              translatedMessages['pw.boutiqueBankDeposit.amtCollectedLabel'],
            field: 'amount',
            resizable: true,
            suppressSizeToFit: true,
            width: 80,
            minWidth: 80,
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
            width: 80,
            minWidth: 80,
            valueFormatter: params => {
              if (typeof params.value === 'object' && params.value) {
                if (params.value.value) {
                  return this.currencyFormatterService.format(
                    params.value.value,
                    'INR',
                    false
                  );
                } else {
                  return '';
                }
              } else {
                return this.currencyFormatterService.format(
                  params.value ? params.value : 0,
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
            width: 80,
            minWidth: 80
          },
          {
            headerName: translatedMessages['pw.boutiqueBankDeposit.PIFNoLabel'],
            field: 'pifNo',
            resizable: true,
            suppressSizeToFit: true,
            width: 50,
            minWidth: 50
          },
          {
            headerName:
              translatedMessages['pw.boutiqueBankDeposit.MIDCodeLabel'],
            field: 'midCode',
            resizable: true,
            suppressSizeToFit: true,
            width: 54,
            minWidth: 54
          },
          {
            headerName:
              translatedMessages[
                'pw.boutiqueBankDeposit.depositedSlipDateLabel'
              ],
            field: 'depositDate',
            resizable: true,
            suppressSizeToFit: true,
            width: 100,
            minWidth: 100
          }
        ];
      });
  }

  gridReady(param: GridReadyEvent) {
    this.api = param.api;
  }

  onCellFocused(event) {
    this.isFocusing = true;
    this.focusedHeaderName = event.column.colDef.headerName;
    this.currentRowIndex = Number(event.rowIndex);
    this.currentRowField = event.column.colDef.field;
    var node = this.api.getDisplayedRowAtIndex(this.currentRowIndex);
    this.currentRowInfo = this.api.getValue(this.currentRowField, node);
    if (this.currentRowField === 'amount' || this.currentRowField === 'openingBalance' || this.currentRowField === 'depositAmount')
      this.currentRowInfo = this.currencyFormatterService.format(this.currentRowInfo, 'INR', false)
  }

  focusOut(event) {
    this.isFocusing = false;
  }
}
