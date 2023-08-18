import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  OnDestroy
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import {
  AlertPopupServiceAbstraction,
  CmBillList,
  AlertPopupTypeEnum
} from '@poss-web/shared/models';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as moment from 'moment';
import { DateFormatterService } from '@poss-web/shared/components/ui-formatters';

@Component({
  selector: 'poss-web-bc-grid',
  templateUrl: './bc-grid.component.html'
})
export class BcGridComponent implements OnInit, OnDestroy {
  domLayout = 'autoHeight';
  rowHeight = '50';
  animateRows = true;
  api: GridApi;
  rowData = [];
  columnDefs = [];
  defaultColDef = {
    resizable: true,
    suppressMovable: true
  };

  cmNo: string;
  customerName: string;
  invoicedTime: string;
  cmNoHeader: string;
  customerNameHeader: string;
  invoicedTimeHeader: string;

  @Output() selectedCM = new EventEmitter<CmBillList>();
  @Output() sortOrder = new EventEmitter<any>();
  @Input() cmBillList$: Observable<CmBillList[]>;
  @Input() approvalHrs: number;
  @Input() approvalRequired: boolean;
  destroy$: Subject<null> = new Subject<null>();

  constructor(
    private translate: TranslateService,
    private dialog: MatDialog,
    private alertPopupService: AlertPopupServiceAbstraction,
    private dateFormatterService: DateFormatterService
  ) {
    this.translate
      .get([
        'pw.bc.cmNoLabel',
        'pw.bc.customerNameLabel',
        'pw.bc.invoicedTimeLabel',
        'pw.bc.cmNoHeaderLabel',
        'pw.bc.customerNameHeaderLabel',
        'pw.bc.invoicedTimeHeaderLabel'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        (this.cmNo = translatedMessages['pw.bc.cmNoLabel']),
          (this.customerName = translatedMessages['pw.bc.customerNameLabel']),
          (this.invoicedTime = translatedMessages['pw.bc.invoicedTimeLabel']),
          (this.cmNoHeader = translatedMessages['pw.bc.cmNoHeaderLabel']),
          (this.customerNameHeader =
            translatedMessages['pw.bc.customerNameHeaderLabel']),
          (this.invoicedTimeHeader =
            translatedMessages['pw.bc.invoicedTimeHeaderLabel']);
      });
  }

  ngOnInit(): void {
    this.loadColumns();
    this.cmBillList$
      .pipe(takeUntil(this.destroy$))
      .subscribe((billList: CmBillList[]) => {
        if (billList.length !== 0) {
          this.rowData = billList;
        } else {
          this.rowData = [];
        }
      });
  }

  loadColumns() {
    this.columnDefs = [
      {
        field: this.cmNo,
        headerName: this.cmNoHeader,
        sortable: true,
        width: 208,
        cellRenderer: headerName =>
          `<a class="pw-anchor-underline">${headerName.value}</a>`
      },
      {
        field: this.customerName,
        headerName: this.customerNameHeader,
        width: 208
      },
      {
        field: this.invoicedTime,
        headerName: this.invoicedTimeHeader,
        width: 208,
        cellRenderer: headerName => this.timeRenderer(headerName)
      }
    ];
  }

  onGridSizeChanged() {
    this.api.sizeColumnsToFit();
  }

  gridReady(params: GridReadyEvent) {
    this.api = params.api;
  }

  printSortStateToConsole(event) {
    const sortState = this.api.getSortModel();
    if (sortState.length === 0) {
      this.sortOrder.emit(null);
    } else {
      for (let i = 0; i < sortState.length; i++) {
        const item = sortState[i];
        item.sort = item.sort[0].toUpperCase() + item.sort.slice(1);
        this.sortOrder.emit(item);
      }
    }
  }

  onCellClicked(clickEvent) {
    let isApprovalRequired: boolean;
    if (this.approvalRequired) {
      const totalHours = moment().diff(clickEvent.data.refTxnTime, 'hours');
      if (totalHours < this.approvalHrs) {
        isApprovalRequired = false;
      } else {
        isApprovalRequired = true;
      }
    } else {
      isApprovalRequired = false;
    }
    if (clickEvent.colDef.field === this.cmNo && isApprovalRequired) {
      this.alertPopupService
        .open({
          type: AlertPopupTypeEnum.CONFIRM,
          message: 'pw.bc.cancelConfirmMsg'
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe((res: boolean) => {
          if (res === true) {
            this.selectedCM.emit(clickEvent.data);
          }
        });
    } else {
      this.selectedCM.emit(clickEvent.data);
    }
  }

  timeRenderer(billData) {
    return `${this.dateFormatterService.format(billData.data.refDocDate)} ${billData.data.refTxnTime.format('LT')}`;
    // const totalHours = moment().diff(time, 'hours');
    // const totalMins = moment().diff(time, 'minutes');
    // if (totalHours === 0) {
    //   if (totalMins < 10) {
    //     return `${time.format('LT')}(${time.fromNow()})`;
    //   } else {
    //     return `${time.format('LT')}(a few minutes ago)`;
    //   }
    // } else if (totalHours === 1) {
    //   return `${time.format('LT')}(${totalHours} hour ago)`;
    // } else if (totalHours > 1 && totalHours < 24) {
    //   return `${time.format('LT')}(${totalHours} hours ago)`;
    // } else {
    //   return `${time.format('LT')}(${time.fromNow()})`;
    // }
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
