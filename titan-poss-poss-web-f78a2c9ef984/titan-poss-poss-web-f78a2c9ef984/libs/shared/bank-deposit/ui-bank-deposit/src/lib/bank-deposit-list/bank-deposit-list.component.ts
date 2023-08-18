import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';
import { BankDepositPaymentModeWiseResponse } from '@poss-web/shared/models';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-bank-deposit-list',
  templateUrl: './bank-deposit-list.component.html'
})
export class BankDepositListComponent implements OnInit, OnDestroy, OnChanges {
  @Input() bankDepositList;
  @Input() count = 0;
  @Input() pageSizeOptions: number[];
  @Input() minPageSize = 0;
  @Input() pageEvent: PageEvent;
  @Input() pageSize = 10;
  @Input() dateFormat;
  @Output() paginator = new EventEmitter<PageEvent>();
  @Output() sort = new EventEmitter<any>();
  @Output() emitTransactionId = new EventEmitter<any>();

  api: GridApi;
  private gridColumnApi;
  rowData = [];
  columnDefs = [];
  context = this;

  domLayout = 'autoHeight';
  rowHeight = '35';
  animateRows = true;
  rowSelection = 'single';
  hasSelectedRow = false;
  selectedConfig = null;
  defaultColDef = {
    suppressMovable: true
  };

  destroy$: Subject<null> = new Subject<null>();

  dateField: string;
  dateFieldHeader: string;
  cashField: string;
  cashFieldHeader: string;
  ccField: string;
  ccFieldHeader: string;
  ddField: string;
  ddFieldHeader: string;
  netAmountField: string;
  netAmountFieldHeader: string;

  constructor(private translate: TranslateService) {}

  ngOnInit(): void {
    this.loadColumns();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['bankDepositList']) {
      this.hasSelectedRow = false;
      this.selectedConfig = null;
      this.rowData = [];

      if (this.bankDepositList && this.bankDepositList.results) {
        this.bankDepositList.results.forEach(data => {
          if (data.deposits.length > 0) {
            this.rowData.push({
              date: moment(data.date).format(this.dateFormat),
              cashAmount: data.deposits[0].cashPayment,
              ccAmount: data.deposits[0].cardPayment,
              ddAmount: data.deposits[0].ddPayment,
              netAmount: this.getNetBankDeposit(data.deposits[0]),
              transactionId: data.deposits[0].transactionId
            });
          }
        });
      }
    }
  }

  selectionChanged(grid) {
    if (grid.api.getSelectedRows().length) {
      this.hasSelectedRow = true;
      this.selectedConfig = grid.api.getSelectedRows()[0];
      this.emitTransactionId.emit(this.selectedConfig);
    } else {
      this.hasSelectedRow = false;
      this.selectedConfig = null;
      this.emitTransactionId.emit(null);
    }
  }

  loadColumns() {
    this.translate
      .get([
        'pw.viewBankDeposit.dateFieldText',
        'pw.viewBankDeposit.dateFieldHeaderText',
        'pw.viewBankDeposit.cashFieldText',
        'pw.viewBankDeposit.cashFieldHeaderText',
        'pw.viewBankDeposit.ccFieldText',
        'pw.viewBankDeposit.ccFieldHeaderText',
        'pw.viewBankDeposit.ddFieldText',
        'pw.viewBankDeposit.ddFieldHeaderText',
        'pw.viewBankDeposit.airpayFieldText',
        'pw.viewBankDeposit.netAmountFieldText',
        'pw.viewBankDeposit.netAmountFieldHeaderText'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.columnDefs = [
          {
            checkboxSelection: true,
            minWidth: 35,
            width: 40,
            pinned: 'left',
            lockPinned: true
          },
          {
            field: translatedMessages['pw.viewBankDeposit.dateFieldText'],
            headerName:
              translatedMessages['pw.viewBankDeposit.dateFieldHeaderText'],
            width: 150,
            minWidth: 80
          },
          {
            field: translatedMessages['pw.viewBankDeposit.cashFieldText'],
            headerName:
              translatedMessages['pw.viewBankDeposit.cashFieldHeaderText'],
            width: 150,
            minWidth: 80
          },
          {
            field: translatedMessages['pw.viewBankDeposit.ccFieldText'],
            headerName:
              translatedMessages['pw.viewBankDeposit.ccFieldHeaderText'],
            width: 200,
            minWidth: 80
          },

          {
            field: translatedMessages['pw.viewBankDeposit.ddFieldText'],
            headerName:
              translatedMessages['pw.viewBankDeposit.ddFieldHeaderText'],
            width: 200,
            minWidth: 80
          },
          {
            field: translatedMessages['pw.viewBankDeposit.netAmountFieldText'],
            headerName:
              translatedMessages['pw.viewBankDeposit.netAmountFieldHeaderText'],
            width: 200,
            minWidth: 80
          }
        ];
      });
  }
  gridReady(params: GridReadyEvent) {
    this.api = params.api;
    this.gridColumnApi = params.columnApi;
  }

  onGridSizeChanged() {
    if (window.innerWidth >= 991) {
      this.api.sizeColumnsToFit();
    }
  }

  getNetBankDeposit(depositList: BankDepositPaymentModeWiseResponse) {
    const netDeposit =
      depositList.cashPayment + depositList.cardPayment + depositList.ddPayment;
    return netDeposit;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
