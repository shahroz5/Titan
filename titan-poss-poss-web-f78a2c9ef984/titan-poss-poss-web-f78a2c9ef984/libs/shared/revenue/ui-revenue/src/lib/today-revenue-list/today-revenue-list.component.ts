import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { RevenuePaymentModeWiseResponse } from '@poss-web/shared/models';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-today-revenue-list',
  templateUrl: './today-revenue-list.component.html',
  styleUrls: ['./today-revenue-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodayRevenueListComponent implements OnInit, OnDestroy, OnChanges {
  @Input() todayRevenueList;
  @Input() ghsRevenueList;
  @Input() serviceRevenueList;

  api: GridApi;
  columnDefs = [];
  rowData = [];
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

  constructor(private translate: TranslateService) {}

  ngOnInit(): void {
    this.loadColumns();
    this.rowData = [];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['todayRevenueList'] || changes['ghsRevenueList'] || changes['serviceRevenueList']) {
      this.rowData = [];
      if (this.todayRevenueList && this.todayRevenueList.results) {
        this.todayRevenueList.results.forEach(data => {
          if (data.revenues.length > 0) {
            this.rowData.push({
              revenueType: data.revenueType,
              cashAmount:
                data.revenues[0].cashPayment !== null
                  ? data.revenues[0].cashPayment
                  : 0,
              ccAmount:
                data.revenues[0].cardPayment !== null
                  ? data.revenues[0].cardPayment
                  : 0,
              chequeAmount:
                data.revenues[0].chequePayment !== null
                  ? data.revenues[0].chequePayment
                  : 0,
              ddAmount:
                data.revenues[0].ddPayment !== null
                  ? data.revenues[0].ddPayment
                  : 0,
              airpayAmount:
                data.revenues[0].airpayPayment !== null
                  ? data.revenues[0].airpayPayment
                  : 0,
              rtgsAmount:
                data.revenues[0].rtgsPayment !== null
                  ? data.revenues[0].rtgsPayment
                  : 0,
              walletAmount:
                data.revenues[0].walletPayment !== null
                  ? data.revenues[0].walletPayment
                  : 0,
              employeeLoanAmount:
                data.revenues[0].employeeLoanPayment !== null
                  ? data.revenues[0].employeeLoanPayment
                  : 0,
              salaryAdvanceAmount:
                data.revenues[0].salaryAdvancePayment !== null
                  ? data.revenues[0].salaryAdvancePayment
                  : 0,
              roPaymentAmount:
                data.revenues[0].roPayment !== null
                  ? data.revenues[0].roPayment
                  : 0,
              razorPayAmount:
                data.revenues[0].razorPayPayment !== null
                  ? data.revenues[0].razorPayPayment
                  : 0,
              upiAmount:
                data.revenues[0].upiPayment !== null
                  ? data.revenues[0].upiPayment
                  : 0,
              netAmount: this.getNetRevenue(data.revenues[0])
            });
          }
        });
      }
      if (this.ghsRevenueList && this.ghsRevenueList.results) {
        this.ghsRevenueList.results.forEach(data => {
          if (data.revenues.length > 0) {
            this.rowData.push({
              revenueType: data.revenueType,
              cashAmount:
                data.revenues[0].cashPayment !== null
                  ? data.revenues[0].cashPayment
                  : 0,
              ccAmount:
                data.revenues[0].cardPayment !== null
                  ? data.revenues[0].cardPayment
                  : 0,
              chequeAmount:
                data.revenues[0].chequePayment !== null
                  ? data.revenues[0].chequePayment
                  : 0,
              ddAmount:
                data.revenues[0].ddPayment !== null
                  ? data.revenues[0].ddPayment
                  : 0,
              airpayAmount:
                data.revenues[0].airpayPayment !== null
                  ? data.revenues[0].airpayPayment
                  : 0,
              rtgsAmount: 'NA',
              walletAmount: 'NA',
              employeeLoanAmount:
                data.revenues[0].employeeLoanPayment !== null
                  ? data.revenues[0].employeeLoanPayment
                  : 0,
              salaryAdvanceAmount: 'NA',
              roPaymentAmount: 
                data.revenues[0].roPayment !== null
                  ? data.revenues[0].roPayment
                  : 0,
              razorPayAmount: 'NA',
              upiAmount: 'NA',
              netAmount: this.getNetRevenue(data.revenues[0])
            });
          }
        });
      }
      if (this.serviceRevenueList && this.serviceRevenueList.results) {
        this.serviceRevenueList.results.forEach(data => {
          if (data.revenues.length > 0) {
            this.rowData.push({
              revenueType: data.revenueType,
              cashAmount:
                data.revenues[0].cashPayment !== null
                  ? data.revenues[0].cashPayment
                  : 0,
              ccAmount:
                data.revenues[0].cardPayment !== null
                  ? data.revenues[0].cardPayment
                  : 0,
              chequeAmount:
                data.revenues[0].chequePayment !== null
                  ? data.revenues[0].chequePayment
                  : 0,
              ddAmount:
                data.revenues[0].ddPayment !== null
                  ? data.revenues[0].ddPayment
                  : 0,
              airpayAmount:
                data.revenues[0].airpayPayment !== null
                  ? data.revenues[0].airpayPayment
                  : 0,
              rtgsAmount: 
                data.revenues[0].rtgsPayment !== null
                  ? data.revenues[0].rtgsPayment
                  : 0,
              walletAmount: 
                data.revenues[0].walletPayment !== null
                  ? data.revenues[0].walletPayment
                  : 0,
              employeeLoanAmount:
                data.revenues[0].employeeLoanPayment !== null
                  ? data.revenues[0].employeeLoanPayment
                  : 0,
              salaryAdvanceAmount: 
                data.revenues[0].salaryAdvancePayment !== null
                  ? data.revenues[0].salaryAdvancePayment
                  : 0,
              roPaymentAmount: 
                data.revenues[0].roPayment !== null
                  ? data.revenues[0].roPayment
                  : 0,
              razorPayAmount: 
                data.revenues[0].razorPayPayment !== null
                  ? data.revenues[0].razorPayPayment
                  : 0,
              upiAmount: 
                data.revenues[0].upiPayment !== null
                  ? data.revenues[0].upiPayment
                  : 0,
              netAmount: this.getNetRevenue(data.revenues[0])
            });
          }
        });
      }
      this.totalSummation = [];
      this.getTotalaRevenues();

      if (this.rowData.length > 0) {
        this.rowData.push({
          revenueType: 'Net Revenue',
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

  loadColumns() {
    this.translate
      .get([
        'pw.revenue.revenueTypeFieldText',
        'pw.revenue.revenueTypeFieldHeaderText',
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
        'pw.revenue.netAmountFieldText',
        'pw.revenue.netAmountFieldHeaderText',
        'pw.revenue.totalLabel',
        'pw.revenue.razorPayFieldHeaderText',
        'pw.revenue.razorPayFieldText',
        'pw.revenue.upiFieldText',
        'pw.revenue.upiFieldHeaderText'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.columnDefs = [
          {
            field: translatedMessages['pw.revenue.revenueTypeFieldText'],
            headerName:
              translatedMessages['pw.revenue.revenueTypeFieldHeaderText'],
            width: 100,
            minWidth: 80,
            pinned: 'left'
          },
          {
            field: translatedMessages['pw.revenue.cashFieldText'],
            headerName: translatedMessages['pw.revenue.cashFieldHeaderText'],
            width: 80,
            minWidth: 80,
            cellClass: 'pw-justify-content-end'
          },
          {
            field: translatedMessages['pw.revenue.ccFieldText'],
            headerName: translatedMessages['pw.revenue.ccFieldHeaderText'],
            width: 80,
            minWidth: 80,
            cellClass: 'pw-justify-content-end'
          },
          {
            field: translatedMessages['pw.revenue.chequeFieldText'],
            headerName: translatedMessages['pw.revenue.chequeFieldHeaderText'],
            width: 80,
            minWidth: 80,
            cellClass: 'pw-justify-content-end'
          },
          {
            field: translatedMessages['pw.revenue.ddFieldText'],
            headerName: translatedMessages['pw.revenue.ddFieldHeaderText'],
            width: 80,
            minWidth: 80,
            cellClass: 'pw-justify-content-end'
          },
          {
            field: translatedMessages['pw.revenue.employeeLoanFieldText'],
            headerName:
              translatedMessages['pw.revenue.employeeLoanFieldHeaderText'],
            width: 120,
            minWidth: 120,
            cellClass: 'pw-justify-content-end'
          },
          {
            field: translatedMessages['pw.revenue.airpayFieldText'],
            headerName: translatedMessages['pw.revenue.airpayFieldHeaderText'],
            width: 80,
            minWidth: 80,
            cellClass: 'pw-justify-content-end'
          },
          {
            field: translatedMessages['pw.revenue.rtgsFieldText'],
            headerName: translatedMessages['pw.revenue.rtgsFieldHeaderText'],
            width: 80,
            minWidth: 80,
            cellClass: 'pw-justify-content-end'
          },
          {
            field: translatedMessages['pw.revenue.walletFieldText'],
            headerName: translatedMessages['pw.revenue.walletFieldHeaderText'],
            width: 80,
            minWidth: 80,
            cellClass: 'pw-justify-content-end'
          },

          {
            field: translatedMessages['pw.revenue.salaryAdvanceFieldText'],
            headerName:
              translatedMessages['pw.revenue.salaryAdvanceFieldHeaderText'],
            width: 120,
            minWidth: 120,
            cellClass: 'pw-justify-content-end'
          },
          {
            field: translatedMessages['pw.revenue.roPaymentFieldText'],
            headerName:
              translatedMessages['pw.revenue.roPaymentFieldHeaderText'],
            width: 100,
            minWidth: 100,
            cellClass: 'pw-justify-content-end'
          },
          {
            field: translatedMessages['pw.revenue.razorPayFieldText'],
            headerName:
              translatedMessages['pw.revenue.razorPayFieldHeaderText'],
            width: 100,
            minWidth: 80,
            cellClass: 'pw-justify-content-end'
          },
          {
            field: translatedMessages['pw.revenue.upiFieldText'],
            headerName:
              translatedMessages['pw.revenue.upiFieldHeaderText'],
            width: 100,
            minWidth: 80,
            cellClass: 'pw-justify-content-end'
          },
          {
            field: translatedMessages['pw.revenue.netAmountFieldText'],
            headerName:
              translatedMessages['pw.revenue.netAmountFieldHeaderText'],
            width: 100,
            minWidth: 80,
            cellClass: 'pw-justify-content-end'
          }
        ];
      });
  }
  gridReady(params: GridReadyEvent) {
    this.api = params.api;
  }

  getTotalaRevenues() {
    for (let i = 0; i < this.rowData.length; i++) {
      if (i === 0) {
        this.totalSummation.push({
          revenueType: 'Net Revenue',
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
          cashAmount: 
            this.rowData[i].cashAmount !== 'NA' ? eachSummation.cashAmount + this.rowData[i].cashAmount : eachSummation.cashAmount,
          ccAmount: 
            this.rowData[i].ccAmount !== 'NA' ? eachSummation.ccAmount + this.rowData[i].ccAmount : eachSummation.ccAmount,
          chequeAmount:
            this.rowData[i].chequeAmount !== 'NA' ? eachSummation.chequeAmount + this.rowData[i].chequeAmount : eachSummation.chequeAmount,
          ddAmount: 
            this.rowData[i].ddAmount !== 'NA' ? eachSummation.ddAmount + this.rowData[i].ddAmount : eachSummation.ddAmount,
          airpayAmount:
            this.rowData[i].airpayAmount !== 'NA' ? eachSummation.airpayAmount + this.rowData[i].airpayAmount : eachSummation.airpayAmount,
          rtgsAmount: 
            this.rowData[i].rtgsAmount !== 'NA' ? eachSummation.rtgsAmount + this.rowData[i].rtgsAmount : eachSummation.rtgsAmount,
          walletAmount: 
            this.rowData[i].walletAmount !== 'NA' ? eachSummation.walletAmount + this.rowData[i].walletAmount : eachSummation.walletAmount,
          employeeLoanAmount:
            this.rowData[i].employeeLoanAmount !== 'NA' ? eachSummation.employeeLoanAmount + this.rowData[i].employeeLoanAmount : eachSummation.employeeLoanAmount,
          salaryAdvanceAmount: 
            this.rowData[i].salaryAdvanceAmount !== 'NA' ? eachSummation.salaryAdvanceAmount + this.rowData[i].salaryAdvanceAmount : eachSummation.salaryAdvanceAmount,
          roPaymentAmount: 
            this.rowData[i].roPaymentAmount !== 'NA' ? eachSummation.roPaymentAmount + this.rowData[i].roPaymentAmount : eachSummation.roPaymentAmount,
          razorPayAmount: 
            this.rowData[i].razorPayAmount !== 'NA' ? eachSummation.razorPayAmount + this.rowData[i].razorPayAmount : eachSummation.razorPayAmount,
          upiAmount: 
            this.rowData[i].upiAmount !== 'NA' ? eachSummation.upiAmount + this.rowData[i].upiAmount : eachSummation.upiAmount,
          netAmount: eachSummation.netAmount + Number(this.rowData[i].netAmount)
        }));
      }
    }
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
