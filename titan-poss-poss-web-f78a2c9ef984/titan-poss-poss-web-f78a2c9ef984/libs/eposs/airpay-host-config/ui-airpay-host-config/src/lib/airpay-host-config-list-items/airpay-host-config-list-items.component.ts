import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  SimpleChanges,
  Input,
  OnChanges,
  OnDestroy,
  ChangeDetectionStrategy
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PageEvent } from '@angular/material/paginator';
import { GridReadyEvent, GridApi } from 'ag-grid-community';
import { TranslateService } from '@ngx-translate/core';

import { HostNameList } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-airpay-host-config-list-items',
  templateUrl: './airpay-host-config-list-items.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AirpayHostConfigListItemsComponent
  implements OnInit, OnChanges, OnDestroy {
  @Input() configList;

  @Input() count = 0;
  @Output() activate = new EventEmitter<HostNameList>();
  @Input() pageSizeOptions: number[];
  @Input() minPageSize = 0;
  @Input() pageEvent: PageEvent;
  @Input() pageSize = 10;
  @Output() paginator = new EventEmitter<PageEvent>();
  @Output() sort = new EventEmitter<any>();
  api: GridApi;
  rowData = [];
  columnDefs = [];

  context = this;

  domLayout = 'autoHeight';
  rowHeight = '35';
  animateRows = true;
  rowSelection = 'multiple';
  defaultColDef = {
    flex: 1,
    minWidth: 100,
    sortable: true,
    suppressMovable: true
  };
  destroy$: Subject<null> = new Subject<null>();

  locationHeaderName;
  locationFieldName;
  hostHeaderName;
  hostFieldName;
  statusHeaderName;
  statusFieldName;
  activeText;
  inActiveText;

  isFocusing = false;
  focusedHeaderName: string;
  currentRowIndex: number;
  currentRowField: string;
  currentRowInfo: string;

  constructor(private translate: TranslateService) {
    this.translate
      .get([
        'pw.airpayHostConfiguration.hostFieldName',
        'pw.airpayHostConfiguration.hostHeaderName',
        'pw.airpayHostConfiguration.locationFieldName',
        'pw.airpayHostConfiguration.locationHeaderName',
        'pw.airpayHostConfiguration.StatusFieldName',
        'pw.airpayHostConfiguration.StatusheaderName',
        'pw.airpayHostConfiguration.Active',
        'pw.airpayHostConfiguration.InActive'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.locationHeaderName =
          translatedMessages['pw.airpayHostConfiguration.locationHeaderName'];
        this.locationFieldName =
          translatedMessages['pw.airpayHostConfiguration.locationFieldName'];
        this.hostHeaderName =
          translatedMessages['pw.airpayHostConfiguration.hostHeaderName'];
        this.hostFieldName =
          translatedMessages['pw.airpayHostConfiguration.hostFieldName'];
        this.statusHeaderName =
          translatedMessages['pw.airpayHostConfiguration.StatusheaderName'];
        this.statusFieldName =
          translatedMessages['pw.airpayHostConfiguration.StatusFieldName'];
        this.activeText =
          translatedMessages['pw.airpayHostConfiguration.Active'];
        this.inActiveText =
          translatedMessages['pw.airpayHostConfiguration.InActive'];
      });
  }
  ngOnInit() {
    this.loadColumns();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['configList']) {
      this.rowData = this.configList;
    }
  }
  loadColumns() {
    this.columnDefs = [
      {
        minWidth: 5,
        width: 5,
        pinned: 'left',
        lockPinned: true,
        cellStyle: params => {
          if (params.data.newlyAdded) {
            return { backgroundColor: '#1eb496', padding: '0px' };
          }
        }
      },
      { field: this.locationFieldName, headerName: this.locationHeaderName },
      { field: this.hostFieldName, headerName: this.hostHeaderName },
      {
        field: this.statusFieldName,
        headerName: this.statusHeaderName,
        cellRenderer: params => {
          if (params.value) {
            return this.activeText;
          } else {
            return this.inActiveText;
          }
        }
      }
    ];
  }

  onGridSizeChanged() {
    if (window.innerWidth >= 991) {
      this.api.sizeColumnsToFit();
    }


  }

  gridReady(params: GridReadyEvent) {
    this.api = params.api;
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
        console.log(item, 'inuisort');
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
  }

  focusOut(event) {
    this.isFocusing = false;
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
