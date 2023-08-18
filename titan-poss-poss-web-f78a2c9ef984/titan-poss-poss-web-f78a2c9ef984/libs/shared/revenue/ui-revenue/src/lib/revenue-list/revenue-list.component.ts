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
import { PageEvent } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';
import { RevenuePaymentModeWiseResponse } from '@poss-web/shared/models';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-revenue-list',
  templateUrl: './revenue-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RevenueListComponent implements OnInit, OnChanges, OnDestroy {
  @Input() dayWiseRevenueList;
  @Input() count = 0;
  @Input() pageSizeOptions: number[];
  @Input() minPageSize = 0;
  @Input() pageEvent: PageEvent;
  @Input() pageSize = 10;
  @Input() dateFormat;
  @Output() paginator = new EventEmitter<PageEvent>();
  @Output() sort = new EventEmitter<any>();

  api: GridApi;
  private gridColumnApi;
  rowData = [];
  columnDefs = [];
  context = this;

  domLayout = 'autoHeight';
  rowHeight = '35';
  animateRows = true;
  defaultColDef = {
    // flex: 1,
    suppressMovable: true
  };

  destroy$: Subject<null> = new Subject<null>();

  totalSummation: any = [];

  isFocusing = false;
  focusedHeaderName: string;
  currentRowIndex: number;
  currentRowField: string;
  currentRowInfo: string;

  constructor(private translate: TranslateService) {}

  ngOnInit(): void {
    this.loadColumns();
    // this.getRowdata();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dayWiseRevenueList']) {
      this.rowData = [];

      if (this.dayWiseRevenueList && this.dayWiseRevenueList.revenues) {
        this.dayWiseRevenueList.revenues.forEach(data => {
          if (data.revenues.length > 0) {
            this.rowData.push({
              date: moment(data.date).format(this.dateFormat),
              cashAmount: data.revenues[0].cashPayment,
              ccAmount: data.revenues[0].cardPayment,
              chequeAmount: data.revenues[0].chequePayment,
              ddAmount: data.revenues[0].ddPayment,
              airpayAmount: data.revenues[0].airpayPayment,
              rtgsAmount: data.revenues[0].rtgsPayment,
              walletAmount: data.revenues[0].walletPayment,
              employeeLoanAmount: data.revenues[0].employeeLoanPayment,
              salaryAdvanceAmount: data.revenues[0].salaryAdvancePayment,
              roPaymentAmount: data.revenues[0].roPayment,
              razorPayAmount: data.revenues[0].razorPayPayment,
              upiAmount: data.revenues[0].upiPayment,
              netAmount: this.getNetRevenue(data.revenues[0])
            });
          }
        });
      }
      this.totalSummation = [];
      this.getTotalaRevenues();

      if (this.rowData.length > 0) {
        this.rowData.push({
          date: 'Total',
          cashAmount: this.totalSummation[0].cashAmount,
          ccAmount: this.totalSummation[0].ccAmount,
          chequeAmount: this.totalSummation[0].chequeAmount,
          ddAmount: this.totalSummation[0].ddAmount,
          airpayAmount: this.totalSummation[0].airpayAmount,
          rtgsAmount: this.totalSummation[0].rtgsAmount,
          walletAmount: this.totalSummation[0].walletAmount,
          employeeLoanAmount: this.totalSummation[0].employeeLoanAmount,
          salaryAdvanceAmount: this.totalSummation[0].salaryAdvanceAmount,
          roPaymentAmount: this.totalSummation[0].roPaymentAmount,
          razorPayAmount: this.totalSummation[0].razorPayAmount,
          upiAmount: this.totalSummation[0].upiAmount,
          netAmount: this.totalSummation[0].netAmount
        });
      }
    }
  }

  getTotalaRevenues() {
    for (let i = 0; i < this.rowData.length; i++) {
      if (i === 0) {
        this.totalSummation.push({
          date: 'Total',
          cashAmount: this.rowData[i].cashAmount,
          ccAmount: this.rowData[i].ccAmount,
          chequeAmount: this.rowData[i].chequeAmount,
          ddAmount: this.rowData[i].ddAmount,
          airpayAmount: this.rowData[i].airpayAmount,
          rtgsAmount: this.rowData[i].rtgsAmount,
          walletAmount: this.rowData[i].walletAmount,
          employeeLoanAmount: this.rowData[i].employeeLoanAmount,
          salaryAdvanceAmount: this.rowData[i].salaryAdvanceAmount,
          roPaymentAmount: this.rowData[i].roPaymentAmount,
          razorPayAmount: this.rowData[i].razorPayAmount,
          upiAmount: this.rowData[i].upiAmount,
          netAmount: this.rowData[i].netAmount
        });
      } else {
        this.totalSummation = this.totalSummation.map(eachSummation => ({
          ...this.totalSummation,
          cashAmount: eachSummation.cashAmount + this.rowData[i].cashAmount,
          ccAmount: eachSummation.ccAmount + this.rowData[i].ccAmount,
          chequeAmount:
            eachSummation.chequeAmount + this.rowData[i].chequeAmount,
          ddAmount: eachSummation.ddAmount + this.rowData[i].ddAmount,
          airpayAmount:
            eachSummation.airpayAmount + this.rowData[i].airpayAmount,
          rtgsAmount: eachSummation.rtgsAmount + this.rowData[i].rtgsAmount,
          walletAmount:
            eachSummation.walletAmount + this.rowData[i].walletAmount,
          employeeLoanAmount:
            eachSummation.employeeLoanAmount +
            this.rowData[i].employeeLoanAmount,
          salaryAdvanceAmount:
            eachSummation.salaryAdvanceAmount +
            this.rowData[i].salaryAdvanceAmount,
          roPaymentAmount:
            eachSummation.roPaymentAmount + 
            this.rowData[i].roPaymentAmount,
          razorPayAmount:
            eachSummation.razorPayAmount +
            this.rowData[i].razorPayAmount,
          upiAmount:
            eachSummation.upiAmount +
            this.rowData[i].upiAmount,
          netAmount: eachSummation.netAmount + this.rowData[i].netAmount
        }));
      }
    }
  }

  loadColumns() {
    this.translate
      .get([
        'pw.revenue.dateFieldText',
        'pw.revenue.dateFieldHeaderText',
        'pw.revenue.cashFieldText',
        'pw.revenue.cashFieldHeaderText',
        'pw.revenue.ccFieldText',
        'pw.revenue.ccFieldHeaderText',
        'pw.revenue.chequeFieldText',
        'pw.revenue.chequeFieldHeaderText',
        'pw.revenue.ddFieldText',
        'pw.revenue.ddFieldHeaderText',
        'pw.revenue.airpayFieldText',
        'pw.revenue.airpayFieldHeaderText',
        'pw.revenue.rtgsFieldText',
        'pw.revenue.rtgsFieldHeaderText',
        'pw.revenue.walletFieldText',
        'pw.revenue.walletFieldHeaderText',
        'pw.revenue.employeeLoanFieldText',
        'pw.revenue.employeeLoanFieldHeaderText',
        'pw.revenue.salaryAdvanceFieldText',
        'pw.revenue.salaryAdvanceFieldHeaderText',
        'pw.revenue.roPaymentFieldText',
        'pw.revenue.roPaymentFieldHeaderText',
        'pw.revenue.razorPayFieldText',
        'pw.revenue.razorPayFieldHeaderText',
        'pw.revenue.upiFieldText',
        'pw.revenue.upiFieldHeaderText',
        'pw.revenue.netAmountFieldText',
        'pw.revenue.netAmountFieldHeaderText',
        'pw.revenue.totalLabel'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.columnDefs = [
          {
            field: translatedMessages['pw.revenue.dateFieldText'],
            headerName: translatedMessages['pw.revenue.dateFieldHeaderText'],
            width: 208,
            minWidth: 80,
            pinned: 'left'
          },
          {
            field: translatedMessages['pw.revenue.cashFieldText'],
            headerName: translatedMessages['pw.revenue.cashFieldHeaderText'],
            width: 208,
            minWidth: 80
          },
          {
            field: translatedMessages['pw.revenue.ccFieldText'],
            headerName: translatedMessages['pw.revenue.ccFieldHeaderText'],
            width: 208,
            minWidth: 80
          },
          {
            field: translatedMessages['pw.revenue.chequeFieldText'],
            headerName: translatedMessages['pw.revenue.chequeFieldHeaderText'],
            width: 220,
            minWidth: 80
          },
          {
            field: translatedMessages['pw.revenue.ddFieldText'],
            headerName: translatedMessages['pw.revenue.ddFieldHeaderText'],
            width: 220,
            minWidth: 80
          },
          {
            field: translatedMessages['pw.revenue.airpayFieldText'],
            headerName: translatedMessages['pw.revenue.airpayFieldHeaderText'],
            width: 220,
            minWidth: 80
          },
          {
            field: translatedMessages['pw.revenue.rtgsFieldText'],
            headerName: translatedMessages['pw.revenue.rtgsFieldHeaderText'],
            width: 220,
            minWidth: 80
          },
          {
            field: translatedMessages['pw.revenue.walletFieldText'],
            headerName: translatedMessages['pw.revenue.walletFieldHeaderText'],
            width: 220,
            minWidth: 80
          },
          {
            field: translatedMessages['pw.revenue.employeeLoanFieldText'],
            headerName:
              translatedMessages['pw.revenue.employeeLoanFieldHeaderText'],
            width: 200,
            minWidth: 100
          },
          {
            field: translatedMessages['pw.revenue.salaryAdvanceFieldText'],
            headerName:
              translatedMessages['pw.revenue.salaryAdvanceFieldHeaderText'],
            width: 210,
            minWidth: 110
          },
          {
            field: translatedMessages['pw.revenue.roPaymentFieldText'],
            headerName:
              translatedMessages['pw.revenue.roPaymentFieldHeaderText'],
            width: 200,
            minWidth: 100
          },
          {
            field: translatedMessages['pw.revenue.razorPayFieldText'],
            headerName:
              translatedMessages['pw.revenue.razorPayFieldHeaderText'],
            width: 200,
            minWidth: 100
          },
          {
            field: translatedMessages['pw.revenue.upiFieldText'],
            headerName:
              translatedMessages['pw.revenue.upiHeaderText'],
            width: 200,
            minWidth: 100
          },
          {
            field: translatedMessages['pw.revenue.netAmountFieldText'],
            headerName:
              translatedMessages['pw.revenue.netAmountFieldHeaderText'],
            width: 230,
            minWidth: 110
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

  getNetRevenue(revenueList: RevenuePaymentModeWiseResponse) {
    const netRevenue =
      revenueList.cashPayment +
      revenueList.cardPayment +
      revenueList.chequePayment +
      revenueList.ddPayment +
      revenueList.airpayPayment +
      revenueList.employeeLoanPayment +
      revenueList.roPayment +
      revenueList.razorPayPayment +
      revenueList.rtgsPayment +
      revenueList.salaryAdvancePayment +
      revenueList.walletPayment +
      revenueList.upiPayment;
    return netRevenue;
  }

  onCellFocused(event) {
    this.isFocusing = true;
    this.focusedHeaderName = event.column.colDef.headerName;
    this.currentRowIndex = Number(event.rowIndex);
    this.currentRowField = event.column.colDef.field;
    var node = this.api.getDisplayedRowAtIndex(this.currentRowIndex);
    this.currentRowInfo = this.api.getValue(this.currentRowField, node);
  }

  focusOut(event) {
    this.isFocusing = false;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
