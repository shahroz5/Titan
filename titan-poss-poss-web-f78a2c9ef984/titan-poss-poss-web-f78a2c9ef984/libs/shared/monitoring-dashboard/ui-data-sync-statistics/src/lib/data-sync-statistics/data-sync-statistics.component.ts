import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { GridApi, ColumnApi, GridReadyEvent } from 'ag-grid-community';
import {
  DataSyncCountByMessageTypeResponse,
  MonitoringDashboardEnum
} from '@poss-web/shared/models';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-data-sync-statistics',
  templateUrl: './data-sync-statistics.component.html',
  styleUrls: ['./data-sync-statistics.component.scss']
})
export class DataSyncStatisticsComponent
  implements OnChanges, OnInit, OnDestroy {
  api: GridApi;
  columnApi: ColumnApi;
  domLayout = MonitoringDashboardEnum.AUTO_HEIGHT;
  animateRows = true;
  rowHeight = 35;
  rowSelection = MonitoringDashboardEnum.SINGLE;
  defaultColDef = {
    enableCellTextSelection: true,
    suppressMovable: true,
    flex: 1
  };
  columnDefs = [];
  dataSyncStatsRowData = [];
  component: DataSyncStatisticsComponent = this;

  @Input() dataSyncStatisticsData: DataSyncCountByMessageTypeResponse[];

  destroy$: Subject<null> = new Subject<null>();

  isFocusing = false;
  focusedHeaderName: string;
  currentRowIndex: number;
  currentRowField: string;
  currentRowInfo: string;

  constructor(public translate: TranslateService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['dataSyncStatisticsData']) {
      this.dataSyncStatsRowData = [];
      if (
        !!this.dataSyncStatisticsData &&
        this.dataSyncStatisticsData.length > 0
      ) {
        this.dataSyncStatisticsData.forEach(data => {
          this.dataSyncStatsRowData.push({
            statusCode: data.statusCode,
            statusDescription: data.statusDecs,
            messageCount: data.messageCount
          });
        });
      }
    }
  }

  ngOnInit(): void {
    const statusCode = 'pw.monitoringDashboard.statusCode';
    const statusDescription = 'pw.monitoringDashboard.statusDescription';
    const messageCount = 'pw.monitoringDashboard.messageCount';

    this.translate
      .get([statusCode, statusDescription, messageCount])
      .pipe(takeUntil(this.destroy$))
      .subscribe(translatedMessages => {
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
          {
            headerName: translatedMessages[statusCode],
            field: 'statusCode',
            minWidth: 100,
            width: 100
          },
          {
            headerName: translatedMessages[statusDescription],
            field: 'statusDescription'
          },
          {
            headerName: translatedMessages[messageCount],
            field: 'messageCount',
            minWidth: 90,
            width: 90
          }
        ];
      });
  }

  getContext() {
    return {
      componentParent: this.component,
      disableInput: true
    };
  }

  onGridSizeChanged() {
    this.api.sizeColumnsToFit();
  }

  gridReady(params: GridReadyEvent) {
    this.api = params.api;
    this.columnApi = params.columnApi;
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
