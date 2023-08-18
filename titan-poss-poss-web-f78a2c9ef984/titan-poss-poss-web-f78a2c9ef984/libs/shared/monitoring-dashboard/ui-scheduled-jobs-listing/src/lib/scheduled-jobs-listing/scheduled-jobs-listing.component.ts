import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Inject,
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
  ManualRunSchedulerJobRequestPayload,
  MonitoringDashboardEnum,
  SchedulerJobsResults
} from '@poss-web/shared/models';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PageEvent } from '@angular/material/paginator';
import { ManualRunJobComponent } from '@poss-web/shared/components/ui-ag-grid';
import {
  POSS_APP_TYPE,
  POSS_WEB_DATE_FORMAT
} from '@poss-web/shared/util-config';
import * as moment from 'moment';

@Component({
  selector: 'poss-web-scheduled-jobs-listing',
  templateUrl: './scheduled-jobs-listing.component.html',
  styleUrls: ['./scheduled-jobs-listing.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScheduledJobsListingComponent
  implements OnChanges, OnInit, OnDestroy {
  api: GridApi;
  columnApi: ColumnApi;
  domLayout = MonitoringDashboardEnum.AUTO_HEIGHT;
  animateRows = true;
  rowHeight = 35;
  rowSelection = MonitoringDashboardEnum.SINGLE;
  defaultColDef = {
    enableCellTextSelection: true,
    suppressMovable: true
  };
  columnDefs = [];
  rowDataSchedulerListing = [];
  component: ScheduledJobsListingComponent = this;

  @Input() scheduledJobsData: SchedulerJobsResults[];
  @Input() count = 0;
  @Input() minPageSize = 0;
  @Input() pageEvent: PageEvent;
  @Input() pageSizeOptions: number[];

  @Output() paginator = new EventEmitter<PageEvent>();
  @Output() manualRunSchedulerJob = new EventEmitter<
    ManualRunSchedulerJobRequestPayload
  >();

  destroy$: Subject<null> = new Subject<null>();

  isFocusing = false;
  focusedHeaderName: string;
  currentRowIndex: number;
  currentRowField: string;
  currentRowInfo: string;

  constructor(
    public translate: TranslateService,
    @Inject(POSS_APP_TYPE) private appType,
    @Inject(POSS_WEB_DATE_FORMAT) private dateFormat
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['scheduledJobsData']) {
      this.rowDataSchedulerListing = [];
      if (!!this.scheduledJobsData && this.scheduledJobsData.length > 0) {
        this.scheduledJobsData.forEach(data => {
          this.rowDataSchedulerListing.push({
            schedulerCode: data.code,
            jobDescription: data.description,
            lastRunTime: data.lastRunTime,
            nextRunTime: data.nextRunTime,
            businessDate: data.businessDate
              ? moment(data.businessDate).format(this.dateFormat)
              : null,
            isActive: data.active,
            tabType: MonitoringDashboardEnum.SCHEDULER,
            buttonName: MonitoringDashboardEnum.MANUAL_RUN
          });
        });
      }
    }
  }

  ngOnInit(): void {
    const jobDescription = 'pw.monitoringDashboard.jobDescription';
    const lastRunTime = 'pw.monitoringDashboard.lastSchedulerRunTime';
    const nextRunTime = 'pw.monitoringDashboard.nextSchedulerRunTime';
    const action = 'pw.monitoringDashboard.action';
    const businessDate = 'pw.monitoringDashboard.businessDate';

    this.translate
      .get([jobDescription, lastRunTime, nextRunTime, action, businessDate])
      .pipe(takeUntil(this.destroy$))
      .subscribe(translatedMessages => {
        if (this.appType === MonitoringDashboardEnum.EPOSS) {
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
              headerName: translatedMessages[jobDescription],
              field: 'jobDescription',
              resizable: true,
              minWidth: 300,
              width: 310,
              maxWidth: 500
            },
            {
              headerName: translatedMessages[lastRunTime],
              field: 'lastRunTime',
              width: 150
            },
            {
              headerName: translatedMessages[nextRunTime],
              field: 'nextRunTime',
              width: 150
            },
            {
              headerName: translatedMessages[action],
              cellRenderer: 'manualRunRenderer',
              width: 150
            }
          ];
        } else {
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
              headerName: translatedMessages[jobDescription],
              field: 'jobDescription',
              resizable: true,
              minWidth: 300,
              width: 310,
              maxWidth: 500
            },
            {
              headerName: translatedMessages[lastRunTime],
              field: 'lastRunTime',
              width: 150
            },
            {
              headerName: translatedMessages[nextRunTime],
              field: 'nextRunTime',
              width: 150
            },
            {
              headerName: translatedMessages[businessDate],
              field: 'businessDate',
              width: 150
            }
          ];
        }
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
    const requestPayload: ManualRunSchedulerJobRequestPayload = {
      schedulerCode: rowData.schedulerCode
    };
    this.manualRunSchedulerJob.emit(requestPayload);
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
