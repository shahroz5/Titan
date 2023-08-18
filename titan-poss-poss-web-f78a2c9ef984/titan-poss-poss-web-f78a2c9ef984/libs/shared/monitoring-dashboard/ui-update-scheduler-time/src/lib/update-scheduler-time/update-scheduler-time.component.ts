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
  MonitoringDashboardEnum,
  SchedulerJobsResults,
  UpdateScheduleTimeRequestPayload
} from '@poss-web/shared/models';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PageEvent } from '@angular/material/paginator';
import {
  EditItemComponent,
  InputValidatorComponent,
  ManualRunJobComponent,
  ToggleButtonCellComponent
} from '@poss-web/shared/components/ui-ag-grid';

@Component({
  selector: 'poss-web-update-scheduler-time',
  templateUrl: './update-scheduler-time.component.html',
  styleUrls: ['./update-scheduler-time.component.scss']
})
export class UpdateSchedulerTimeComponent
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
  rowDataUpdateScheduler = [];
  component: UpdateSchedulerTimeComponent = this;

  @Input() scheduledJobsData: SchedulerJobsResults[];
  @Input() count = 0;
  @Input() minPageSize = 0;
  @Input() pageEvent: PageEvent;
  @Input() pageSizeOptions: number[];
  @Output() paginator = new EventEmitter<PageEvent>();
  @Output() updateScheduleTime = new EventEmitter<
    UpdateScheduleTimeRequestPayload
  >();

  destroy$: Subject<null> = new Subject<null>();

  constructor(public translate: TranslateService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['scheduledJobsData']) {
      this.rowDataUpdateScheduler = [];
      if (!!this.scheduledJobsData && this.scheduledJobsData.length > 0) {
        this.scheduledJobsData.forEach(data => {
          this.rowDataUpdateScheduler.push({
            id: data.code,
            schedulerCode: data.code,
            cronExpression: data.cronExpression,
            isActive: data.active,
            tabType: MonitoringDashboardEnum.SCHEDULER,
            buttonName: MonitoringDashboardEnum.UPDATE
          });
        });
      }
    }
  }

  ngOnInit(): void {
    const schedulerCode = 'pw.monitoringDashboard.schedulerCode';
    const cronExpression = 'pw.monitoringDashboard.cronExpression';
    const isActive = 'pw.monitoringDashboard.isActive';
    const action = 'pw.monitoringDashboard.action';

    this.translate
      .get([schedulerCode, cronExpression, isActive, action])
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
            headerName: translatedMessages[schedulerCode],
            field: 'schedulerCode',
            minWidth: 200,
            width: 200
          },
          {
            headerName: translatedMessages[cronExpression],
            field: 'cronExpression',
            cellClass: 'pw-form-input-width',
            resizable: true,
            editable: true,
            suppressSizeToFit: true,
            singleClickEdit: true,
            cellEditor: 'inputValidator',
            cellRendererFramework: EditItemComponent,
            valueFormatter: (params: { value: { value: any } }) => {
              if (typeof params.value === 'object') {
                if (params.value.value) {
                  return params.value.value;
                } else {
                  return ' ';
                }
              } else {
                return params.value;
              }
            },
            cellClassRules: {
              'pw-gray-border': params => {
                return params.value.isValid === true;
              },
              'pw-error-border': params => {
                return (
                  params.value.isValid === false && params.value.value !== ''
                );
              }
            }
          },
          {
            headerName: translatedMessages[isActive],
            field: 'isActive',
            cellRendererFramework: ToggleButtonCellComponent,
            minWidth: 100,
            width: 100
          },
          {
            headerName: translatedMessages[action],
            cellRenderer: 'manualRunRenderer',
            minWidth: 120,
            width: 120
          }
        ];
      });
  }

  // custom components used in ag grid
  getComponents() {
    return {
      manualRunRenderer: ManualRunJobComponent,
      inputValidator: InputValidatorComponent
    };
  }

  getContext() {
    return {
      validators: {
        cronExpression: []
      },
      componentParent: this.component,
      disableInput: true
    };
  }

  manualRunJob(rowData) {
    const requestPayload: UpdateScheduleTimeRequestPayload = {
      cronExpression:
        typeof rowData.cronExpression === 'object'
          ? rowData.cronExpression.value
            ? rowData.cronExpression.value
            : ''
          : rowData.cronExpression,
      isActive: rowData.isActive,
      schedulerCode: rowData.schedulerCode
    };
    this.updateScheduleTime.emit(requestPayload);
  }



  onGridSizeChanged() {
    this.api.sizeColumnsToFit();
  }

  gridReady(params: GridReadyEvent) {
    this.api = params.api;
    this.columnApi = params.columnApi;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
