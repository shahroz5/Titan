import { Component, Input, OnChanges, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import { Subject, fromEvent, Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import {
  debounceTime,
  map,
  distinctUntilChanged,
  startWith,
  tap,
  takeUntil
} from 'rxjs/operators';
import { GridApi, ColumnApi, GridReadyEvent } from 'ag-grid-community';

import {
  CurrencySymbolService,
  CurrencyFormatterService,
  DateFormatterService
} from '@poss-web/shared/components/ui-formatters';
import * as moment from 'moment';
import {
  PaymentModeEnum,
  GiftCardPaymentDetailsEnum,
  PaymentDetails
} from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-gift-cards-cm-payment-details',
  templateUrl: './gift-cards-cm-payment-details.component.html',
  styleUrls: []
})
export class GiftCardsCmPaymentDetailsComponent
  implements OnChanges, OnInit, OnDestroy {
  api: GridApi;
  columnApi: ColumnApi;
  currentColumnName = null;
  currentRowIndex: number;
  formGroup: FormGroup = new FormGroup({});
  isDeleteShown = false;
  parentForm: FormArray = new FormArray([]);
  _resize$: any;
  domLayout = 'autoHeight';
  animateRows = true;
  rowHeight = 35;
  rowData = [];
  paymentDetailList = [];
  totalAmount: number;

  columnDefs = [];

  destroy$: Subject<null> = new Subject<null>();

  @Input() paymentDetails: PaymentDetails[];
  @Input() clearAllPaymentDetails: Observable<boolean>;

  constructor(
    private translate: TranslateService,
    private currencySymbolService: CurrencySymbolService,
    private currencyFormatterService: CurrencyFormatterService,
    private dateFormatterService: DateFormatterService
  ) {}

  ngOnInit() {
    const paymentMethod = 'pw.giftCards.paymentMethod';
    const instrumentNo = 'pw.giftCards.instrumentNo';
    const instrumentType = 'pw.giftCards.instrumentType';
    const date = 'pw.giftCards.date';
    const bankName = 'pw.giftCards.bankName';
    const amount = 'pw.giftCards.amount';
    const totalCashCollected = 'pw.giftCards.totalCashCollected';
    this.translate
      .get([
        paymentMethod,
        instrumentNo,
        instrumentType,
        date,
        bankName,
        amount,
        totalCashCollected
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: string) => {
        this.columnDefs = [
          {
            field: GiftCardPaymentDetailsEnum.PAYMENTCODE,
            headerName: translatedMessages[paymentMethod]
          },
          {
            field: GiftCardPaymentDetailsEnum.INSTRUMENTNO,
            headerName: translatedMessages[instrumentNo]
          },
          {
            field: GiftCardPaymentDetailsEnum.INSTRUMENTTYPE,
            headerName: translatedMessages[instrumentType]
          },
          {
            field: GiftCardPaymentDetailsEnum.INSTRUMENTDATE,
            headerName: translatedMessages[date],
            valueFormatter: params => {
              return this.dateFormatterService.format(params.value);
            }
          },
          {
            field: GiftCardPaymentDetailsEnum.PAYERBANKNAME,
            headerName: translatedMessages[bankName]
          },
          {
            field: GiftCardPaymentDetailsEnum.AMOUNT,
            headerName:
              `${translatedMessages[amount]} (` +
              this.currencySymbolService.get('INR') +
              ')',
            type: GiftCardPaymentDetailsEnum.NUMERICCOLUMN,
            cellClass: 'pw-justify-content-end',
            valueFormatter: params => {
              return this.currencyFormatterService.format(
                params.value,
                'INR',
                false
              );
            }
          },
          {
            field: GiftCardPaymentDetailsEnum.TOTALCASHCOLLECTED,
            headerName:
              `${translatedMessages[totalCashCollected]} (` +
              this.currencySymbolService.get('INR') +
              ')',
            cellClass: 'pw-justify-content-end',
            type: GiftCardPaymentDetailsEnum.NUMERICCOLUMN,
            valueGetter: params => {
              if (this.checkForCash(params.data.paymentCode)) {
                const amt =
                  typeof params.data.amount === 'object'
                    ? params.data.amount.value
                    : params.data.amount;

                if (isNaN(amt)) {
                  return '';
                }
                return this.currencyFormatterService.format(amt, 'INR', false);
              } else {
                return '';
              }
            }
          }
        ];
      });
    this.clearAllPaymentDetails
      .pipe(takeUntil(this.destroy$))
      .subscribe((clearAllPaymentDetails: boolean) => {
        if (clearAllPaymentDetails) {
          this.rowData = [];
        }
      });
  }

  ngOnChanges() {
    if (this.paymentDetails) {
      this.rowData = [];
      const cancellationPaymentRowData = [];
      this.paymentDetailList = [...this.paymentDetails];
      this.paymentDetails.forEach(paymentDetail => {
        if (paymentDetail && paymentDetail.instrumentDate) {
          const tempObj = { ...paymentDetail };
          tempObj['instrumentDate'] = moment(paymentDetail.instrumentDate);
          cancellationPaymentRowData.push(tempObj);
        }
      });
      this.rowData = cancellationPaymentRowData;
      // setTimeout(() => { this.api.sizeColumnsToFit() }, 50);
    }
  }

  checkForCash(paymentMode: PaymentModeEnum): boolean {
    return paymentMode === PaymentModeEnum.CASH;
  }

  gridReady(params: GridReadyEvent) {
    this.api = params.api;
    this.columnApi = params.columnApi;
    if (this.rowData.length === 0) {
      this.api.showNoRowsOverlay();
    }
    this.api.sizeColumnsToFit();
    // Create observable from the window event
    this._resize$ = fromEvent(window, 'resize').pipe(
      debounceTime(200),
      map(() => window.innerWidth), //Don't use mapTo!
      distinctUntilChanged(),
      startWith(window.innerWidth),
      tap(width => {
        // this.widthCalculator(width);
        this.api.sizeColumnsToFit();
      })
    );
    this._resize$.subscribe();
  }

  getRowNodeId(data) {
    return data.cmNumber;
  }

  onGridSizeChanged() {
    if (window.innerWidth >= 991) {
      this.api.sizeColumnsToFit();
    }

    // this.api.sizeColumnsToFit();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
