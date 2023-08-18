import {
  Component,
  Output,
  EventEmitter,
  SimpleChanges,
  Input,
  OnChanges,
  OnDestroy,
  ChangeDetectionStrategy
} from '@angular/core';
import { Subject } from 'rxjs';
import { DateFormatterService } from '@poss-web/shared/components/ui-formatters';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { MatToggleRender } from '@poss-web/shared/components/ui-ag-grid';
import { PageEvent } from '@angular/material/paginator';
import { AccessList, TEPList } from '@poss-web/shared/models';
import { commonTranslateKeyMap } from '@poss-web/shared/util-adaptors';
import * as moment from 'moment';
import {
  CurrencyFormatterService,
  CurrencySymbolService
} from '@poss-web/shared/components/ui-formatters';
@Component({
  selector: 'poss-web-tep-search-list',
  templateUrl: './tep-search-list.component.html',

  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TepSearchListComponent implements OnChanges, OnDestroy {
  api: GridApi;
  @Input() tep: TEPList[];
  @Input() currencyCode: string;
  @Input() disable: boolean;
  @Input() count = 0;
  @Output() activate = new EventEmitter<AccessList>();
  @Input() pageSizeOptions: number[];
  @Input() minPageSize = 0;
  @Input() pageEvent: PageEvent;
  @Input() pageSize = 10;
  @Output() paginator = new EventEmitter<PageEvent>();

  @Output() onselected = new EventEmitter<any>();
  @Output() sort = new EventEmitter<any>();
  gridData: string[] = [];
  rowData: TEPList[] = [];
  domLayout = 'autoHeight';
  rowHeight = '50';
  rowSelection = 'multiple';
  columnDefs = [];
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
    private currencyFormatterService: CurrencyFormatterService,
    private currencySymbolService: CurrencySymbolService,
    private dateFormatterService: DateFormatterService
  ) {
    this.translate
      .get([
        'pw.tep.customerFieldLabel',
        'pw.tep.customerHeaderLabel',
        'pw.tep.doDateFieldLabel',
        'pw.tep.doDateHeaderLabel',
        'pw.tep.doNoFieldLabel',
        'pw.tep.doNoHeaderLabel',
        'pw.tep.tepTypeHeaderLabel',
        'pw.tep.tepTypeFieldLabel',
        'pw.tep.tepValueHeaderLabel',
        'pw.tep.tepValueFieldLabel'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.columnDefs = [
          {
            field: translatedMessages['pw.tep.doNoFieldLabel'],
            sortable: true,
            headerName: translatedMessages['pw.tep.doNoHeaderLabel'],
            cellRenderer: headerName =>
              `<a class="pw-anchor-underline">${headerName.value}</a>`
          },
          {
            field: translatedMessages['pw.tep.customerFieldLabel'],
            headerName: translatedMessages['pw.tep.customerHeaderLabel']
          },
          {
            field: translatedMessages['pw.tep.doDateFieldLabel'],
            headerName: translatedMessages['pw.tep.doDateHeaderLabel'],
            valueFormatter: params => {
              return this.dateFormatterService.format(moment(params.value));
            }
          },
          {
            field: translatedMessages['pw.tep.tepTypeFieldLabel'],
            headerName: translatedMessages['pw.tep.tepTypeHeaderLabel']
          },
          {
            field: translatedMessages['pw.tep.tepValueFieldLabel'],
            headerName:
              translatedMessages['pw.tep.tepValueHeaderLabel'] +
              ' (' +
              this.currencySymbolService.get(this.currencyCode) +
              ')',
            valueFormatter: params => {
              if (params.value) {
                return this.currencyFormatterService.format(
                  params.value,
                  this.currencyCode,
                  false
                );
              } else {
                return null;
              }
            }
          }
        ];
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tep']) {
      this.rowData = this.tep;
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
    if (clickEvent.colDef.field === 'refDocNo') {
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
    if (this.currentRowField === 'refDocDate')
      this.currentRowInfo = this.dateFormatterService.format(
        moment(this.currentRowInfo)
      );
    if (this.currentRowField === 'totalValue')
      this.currentRowInfo = this.currencyFormatterService.format(
        this.currentRowInfo,
        this.currencyCode,
        false
      );
  }

  focusOut(event) {
    this.isFocusing = false;
  }
}
