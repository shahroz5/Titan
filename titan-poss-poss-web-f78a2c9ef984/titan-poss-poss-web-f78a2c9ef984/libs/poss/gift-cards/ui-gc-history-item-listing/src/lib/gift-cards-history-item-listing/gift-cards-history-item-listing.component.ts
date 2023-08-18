import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';
import { DateFormatterService } from '@poss-web/shared/components/ui-formatters';
import { GiftCardsHistoryListItems } from '@poss-web/shared/models';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-gift-cards-history-item-listing',
  templateUrl: './gift-cards-history-item-listing.component.html',
  styleUrls: ['./gift-cards-history-item-listing.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GiftCardsHistoryItemListingComponent implements OnInit {
  @Input() giftCardsHistoryItemList: GiftCardsHistoryListItems[];
  @Input() totalGiftCardsHistoryReq: number;
  @Input() pageSizeOptions: number[] = [];
  @Input() pageEvent;

  @Output() paginator = new EventEmitter<PageEvent>();
  // @Output() searchHistory = new EventEmitter<any>();
  @Output() selectedHistoryItem: EventEmitter<string> = new EventEmitter<
    string
  >();
  @Output() sortOrder = new EventEmitter<any>();

  destroy$: Subject<null> = new Subject<null>();
  domLayout = 'autoHeight';
  rowHeight = '35';
  animateRows = true;
  columnDefs = [];

  defaultColDef = {
    flex: 1,
    suppressMovable: true
  };
  minPageSize = 0;
  api: GridApi;

  isFocusing = false;
  focusedHeaderName: string;
  currentRowIndex: number;
  currentRowField: string;
  currentRowInfo: string;

  constructor(
    private translate: TranslateService,
    private dateFormatterService: DateFormatterService
  ) {}

  ngOnInit(): void {
    this.minPageSize = this.pageSizeOptions.reduce((a: number, b: number) =>
      a < b ? a : b
    );

    this.translate
      .get([
        'pw.giftCardsHistory.documentNumber',
        'pw.giftCardsHistory.fiscalYear',
        'pw.giftCardsHistory.cmDate',
        'pw.giftCardsHistory.customerName',
        'pw.giftCardsHistory.totalQuantity',
        'pw.giftCardsHistory.totalValue',
        'pw.giftCardsHistory.status'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.columnDefs = [
          {
            headerName:
              translatedMessages['pw.giftCardsHistory.documentNumber'],
            field: 'docNo',
            width: 150,
            suppressMovable: true,
            sortable: true,
            cellRenderer: params => this.viewAnchorRenderer(params),
            cellClass: 'pw-fourth-color',
            cellStyle: { cursor: 'pointer' }
          },
          {
            headerName: translatedMessages['pw.giftCardsHistory.fiscalYear'],
            suppressMovable: true,
            field: 'fiscalYear',
            width: 150
          },
          {
            headerName: translatedMessages['pw.giftCardsHistory.cmDate'],
            field: 'docDate',
            resizable: true,
            width: 150,
            suppressMovable: true,
            suppressSizeToFit: true,
            valueFormatter: params => {
              return this.dateFormatterService.format(params.value);
            }
          },
          {
            headerName: translatedMessages['pw.giftCardsHistory.customerName'],
            field: 'customerName',
            resizable: true,
            width: 150,
            suppressMovable: true,
            suppressSizeToFit: true
          },
          {
            headerName: translatedMessages['pw.giftCardsHistory.totalQuantity'],
            field: 'totalQuantity',
            resizable: true,
            width: 150,
            suppressMovable: true,
            suppressSizeToFit: true
          },
          {
            headerName: translatedMessages['pw.giftCardsHistory.totalValue'],
            field: 'netAmount',
            resizable: true,
            width: 150,
            suppressMovable: true,
            suppressSizeToFit: true
          },
          {
            headerName: translatedMessages['pw.giftCardsHistory.status'],
            field: 'status',
            resizable: true,
            width: 150,
            suppressMovable: true,
            suppressSizeToFit: true
          }
        ];
      });
  }

  viewAnchorRenderer(params) {
    return `<a class="pw-anchor-underline pw-fourth-color">${params.value}</a>`;
  }

  onCellClicked(event) {
    if (event && event.column && event.column.getColId() === 'docNo') {
      if (event.data) {
        this.selectedHistoryItem.emit(event.data.id);
      } else if (!event || !event.data) {
        this.selectedHistoryItem.emit(null);
      }
    }
  }
  onCellKeyPress(pressEvent) {
    const keyPressed = pressEvent.event.key;
    if (keyPressed === 'Enter') {
      this.onCellClicked(pressEvent);
    }
  }
  gridReady(params: GridReadyEvent) {
    this.api = params.api;
  }

  printSortStateToConsole(event) {
    const sortState = this.api.getSortModel();
    console.log(sortState);
    if (sortState.length === 0) {
      this.sortOrder.emit(null);
    } else {
      for (let i = 0; i < sortState.length; i++) {
        const item = sortState[i];
        item.sort = item.sort[0].toUpperCase() + item.sort.slice(1);
        console.log(sortState);
        this.sortOrder.emit(item);
      }
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
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
