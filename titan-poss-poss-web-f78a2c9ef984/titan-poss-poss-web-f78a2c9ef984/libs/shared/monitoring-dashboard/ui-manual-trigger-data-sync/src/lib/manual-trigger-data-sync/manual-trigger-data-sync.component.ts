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
import { TranslateService } from '@ngx-translate/core';
import { GridApi, ColumnApi, GridReadyEvent } from 'ag-grid-community';
import {
  DataSyncMessagesList,
  MonitoringDashboardEnum
} from '@poss-web/shared/models';
import { PageEvent } from '@angular/material/paginator';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ManualRunJobComponent } from '@poss-web/shared/components/ui-ag-grid';

@Component({
  selector: 'poss-web-manual-trigger-data-sync',
  templateUrl: './manual-trigger-data-sync.component.html',
  styleUrls: ['./manual-trigger-data-sync.component.scss']
})
export class ManualTriggerDataSyncComponent
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
  manualTriggerDataSyncRowData = [];

  component: ManualTriggerDataSyncComponent = this;

  @Input() dataSyncJobsData: DataSyncMessagesList[];
  @Input() count = 0;
  @Input() minPageSize = 0;
  @Input() pageEvent: PageEvent;
  @Input() pageSizeOptions: number[];

  @Output() paginator = new EventEmitter<PageEvent>();
  @Output() manuallyRunSelectedJob = new EventEmitter<any>();

  destroy$: Subject<null> = new Subject<null>();

  isFocusing = false;
  focusedHeaderName: string;
  currentRowIndex: number;
  currentRowField: string;
  currentRowInfo: string;

  constructor(public translate: TranslateService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['dataSyncJobsData']) {
      this.manualTriggerDataSyncRowData = [];
      if (!!this.dataSyncJobsData && this.dataSyncJobsData.length > 0) {
        this.dataSyncJobsData.forEach(data => {
          this.manualTriggerDataSyncRowData.push({
            source: data.source,
            destination: data.destination,
            messageId: data.messageRefId,
            reason: data.exception ? data.exception : null,
            dataflowDirection: data.dataflowDirection,
            status: data.status,
            id: data.id
          });
        });
      }
    }
  }

  ngOnInit(): void {
    const source = 'pw.monitoringDashboard.source';
    const destination = 'pw.monitoringDashboard.destination';
    const messageId = 'pw.monitoringDashboard.messageId';
    const reason = 'pw.monitoringDashboard.reason';
    const action = 'pw.monitoringDashboard.action';

    this.translate
      .get([source, destination, messageId, reason, action])
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
            headerName: translatedMessages[source],
            field: 'source'
          },
          {
            headerName: translatedMessages[destination],
            field: 'destination'
          },
          {
            headerName: translatedMessages[messageId],
            field: 'messageId',
            resizable: true,
            minWidth: 250,
            width: 350,
            maxWidth: 500
          },
          {
            headerName: translatedMessages[reason],
            field: 'reason',
            resizable: true,
            minWidth: 250,
            width: 350,
            maxWidth: 500
          },
          {
            headerName: translatedMessages[action],
            cellRenderer: 'manualRunRenderer'
          }
        ];
      });
  }

  // custom components used in ag grid
  getComponents() {
    return {
      manualRunRenderer: ManualRunJobComponent
    };
  }
  getContext() {
    return {
      componentParent: this.component,
      disableInput: true
    };
  }

  manualRunJob(rowData) {
    const requestPayload = {
      destination: rowData.destination,
      messageid: rowData.id
    };
    this.manuallyRunSelectedJob.emit(requestPayload);
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
