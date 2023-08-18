import {
  Component,
  Output,
  EventEmitter,
  SimpleChanges,
  Input,
  OnChanges,
  OnDestroy,
  ChangeDetectionStrategy,
  Inject
} from '@angular/core';
import { Subject } from 'rxjs';
import { CurrencySymbolService, DateFormatterService } from '@poss-web/shared/components/ui-formatters';
import { GridApi, GridReadyEvent, GridOptions } from 'ag-grid-community';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { MatToggleRender } from '@poss-web/shared/components/ui-ag-grid';
import { PageEvent } from '@angular/material/paginator';
import {
  ABSubTxnTypes,
  AccessList,
  AdvanceBookingDetailsResponse,
  SearchListFields,
  SubTransactionTypeEnum
} from '@poss-web/shared/models';
import { commonTranslateKeyMap } from '@poss-web/shared/util-adaptors';
import * as moment from 'moment';
import { POSS_WEB_CURRENCY_CODE } from '@poss-web/shared/util-config';
@Component({
  selector: 'poss-web-search-list-advance-booking',
  templateUrl: './search-list-advance-booking.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchListAdvanceBookingComponent implements OnChanges, OnDestroy {
  api: GridApi;
  @Input() advanceBooking: AdvanceBookingDetailsResponse[];

  @Input() disable: boolean;
  @Input() count = 0;
  @Output() activate = new EventEmitter<AccessList>();
  @Input() pageSizeOptions: number[];
  @Input() minPageSize = 0;
  @Input() pageEvent: PageEvent;
  @Input() pageSize = 10;
  @Output() paginator = new EventEmitter<PageEvent>();
  @Output() sort = new EventEmitter<any>();
  @Output() onselected = new EventEmitter<any>();
  gridData: string[] = [];
  rowData: AdvanceBookingDetailsResponse[] = [];
  domLayout = 'autoHeight';
  rowHeight = '50';
  animateRows = true;
  rowSelection = 'multiple';
  context = this;
  columnDefs = [];
  private gridOptions: GridOptions;
  destroy$: Subject<null> = new Subject<null>();
  defaultColDef = {
    flex: 1,

    resizable: true
  };
  status: string;
  statusColor: string;

  isFocusing = false;
  focusedHeaderName: string;
  currentRowIndex: number;
  currentRowField: string;
  currentRowInfo: string;

  constructor(
    private translate: TranslateService,
    private dateFormatterService: DateFormatterService,
    @Inject(POSS_WEB_CURRENCY_CODE) public defaultCurrencyCode,
    private currencySymbolService: CurrencySymbolService,
  ) {
    this.translate
      .get([
        'pw.advanceBooking.statusFieldLabel',
        'pw.advanceBooking.statusHeaderLabel',
        'pw.advanceBooking.locationCodeFieldLabel',
        'pw.advanceBooking.locationCodeHeaderLabel',
        'pw.advanceBooking.customerFieldLabel',
        'pw.advanceBooking.customerHeaderLabel',
        'pw.advanceBooking.doDateFieldLabel',
        'pw.advanceBooking.doDateHeaderLabel',
        'pw.advanceBooking.doNoFieldLabel',
        'pw.advanceBooking.doNoHeaderLabel',
        'pw.advanceBooking.subTxnTypeHeaderLabel',
        'pw.advanceBooking.netAmountHeaderLabel'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.columnDefs = [
          {
            field: translatedMessages['pw.advanceBooking.doNoFieldLabel'],
            headerName: translatedMessages['pw.advanceBooking.doNoHeaderLabel'],
            cellRenderer: headerName =>
              `<a class="pw-anchor-underline">${headerName.value}</a>`
          },
          {
            field: translatedMessages['pw.advanceBooking.customerFieldLabel'],
            headerName:
              translatedMessages['pw.advanceBooking.customerHeaderLabel']
          },
          {
            field: translatedMessages['pw.advanceBooking.doDateFieldLabel'],
            headerName:
              translatedMessages['pw.advanceBooking.doDateHeaderLabel'],
            valueFormatter: params => {
              return this.dateFormatterService.format(moment(params.value));
            }
          },
          {
            field:
              translatedMessages['pw.advanceBooking.locationCodeFieldLabel'],
            headerName:
              translatedMessages['pw.advanceBooking.locationCodeHeaderLabel']
          },
          {
            field: translatedMessages['pw.advanceBooking.statusFieldLabel'],
            headerName:
              translatedMessages['pw.advanceBooking.statusHeaderLabel'],
            cellClass: params => {
              const color = this.getStatusColor(params.data.status);

              return color;
            }
          },
          {
            field: SearchListFields.FINAL_VALUE,
            headerName:
              translatedMessages['pw.advanceBooking.netAmountHeaderLabel'] +
              ` (${this.currencySymbolService.get(this.defaultCurrencyCode)})`,
            cellClass: 'pw-justify-content-end',
          },
          {
            field: SearchListFields.SUB_TXNTYPE,
            headerName:
              translatedMessages['pw.advanceBooking.subTxnTypeHeaderLabel'],
            valueFormatter: params => this.subTxnTypeFormatter(params.value),
          }
        ];
      });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['advanceBooking']) {
      this.rowData = this.advanceBooking;
    }
  }

  gridReady(params: GridReadyEvent) {
    this.api = params.api;
  }

  onGridSizeChanged() {
    if (window.innerWidth >= 991) {
      this.api.sizeColumnsToFit();
    }
  }

  printSortStateToConsole(event) {
    const sortState = this.api.getSortModel();
    if (sortState.length === 0) {
      this.sort.emit();
    } else {
      for (let i = 0; i < sortState.length; i++) {
        const item = sortState[i];
        item.sort = item.sort[0].toUpperCase() + item.sort.slice(1);
        this.sort.emit(item);
      }
    }
  }

  getComponents() {
    return {
      checkBoxRowRenderer: MatToggleRender
    };
  }

  selectionChange(data: AccessList) {
    this.activate.emit(data);
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getStatusColor(status: string) {
    if (status) {
      let key;
      if (commonTranslateKeyMap.has(status)) {
        key = commonTranslateKeyMap.get(status);
      }
      if (key) {
        this.translate
          .get([key.statusColor])
          .pipe(takeUntil(this.destroy$))
          .subscribe((translatedMessages: string) => {
            this.statusColor = translatedMessages[key.statusColor];
          });

        return this.statusColor;
      }
    }
  }

  onCellClicked(clickEvent) {
    if (clickEvent.colDef.field === 'docNo') {
      this.onselected.emit(clickEvent.data);
    }
  }

  onCellFocused(event) {
    this.isFocusing = true;
    this.focusedHeaderName = event.column.colDef.headerName;
    this.currentRowIndex = Number(event.rowIndex);
    this.currentRowField = event.column.colDef.field;
    var node = this.api.getDisplayedRowAtIndex(this.currentRowIndex);
    this.currentRowInfo = this.api.getValue(this.currentRowField, node);
    if (this.currentRowField === 'docDate')
      this.currentRowInfo = this.dateFormatterService.format(
        moment(this.currentRowInfo)
      );
  }

  focusOut(event) {
    this.isFocusing = false;
  }

  subTxnTypeFormatter(data){
    if(data === SubTransactionTypeEnum.NEW_AB)
    return ABSubTxnTypes.NEW_AB;
    else if(data === SubTransactionTypeEnum.MANUAL_AB)
    return ABSubTxnTypes.MANUAL_AB;
    return data;
  }
}
