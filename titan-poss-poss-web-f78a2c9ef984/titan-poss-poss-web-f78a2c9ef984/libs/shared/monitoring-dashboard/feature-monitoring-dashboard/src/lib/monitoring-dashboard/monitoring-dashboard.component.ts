import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Router, ActivatedRoute, NavigationEnd, Event } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { filter, take, takeUntil } from 'rxjs/operators';
import {
  CustomErrors,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  MonitoringDashboardEnum,
  PossHomeKeyEnum,
  SchedulerJobsResults,
  SelectDropDownOption,
  DataSyncCountByMessageTypePayload,
  DataSyncCountByMessageTypeResponse,
  DataSyncMessagesList,
  ManualRunDataSyncPayload,
  UpdateScheduleTimeRequestPayload,
  ManualRunSchedulerJobRequestPayload,
  OverlayNotificationEventType,
  PermissionData,
  DataSyncMessagesPayloadData
} from '@poss-web/shared/models';
import { getPossHomeRouteUrl } from '@poss-web/shared/util-site-routes';
import { AuthFacade } from '@poss-web/shared/auth/data-access-auth';
import { MonitoringDashboardFacade } from '@poss-web/shared/monitoring-dashboard/data-access-monitoring-dashboard';
import { PageEvent } from '@angular/material/paginator';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { LocationMappingFacade } from '@poss-web/shared/location-mapping/data-access-location-mapping';
import {
  SelectionDailogOption,
  SelectionDialogService
} from '@poss-web/shared/components/ui-selection-dialog';
import * as moment from 'moment';
import { FormControl, FormGroup } from '@angular/forms';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { MatDialog } from '@angular/material/dialog';
import { POSS_APP_TYPE } from '@poss-web/shared/util-config';
import { PermissionFacade } from '@poss-web/shared/permission/data-access-permission';
import { ElementPermissionService } from '@poss-web/shared/permission/util-element-permissions';

@Component({
  selector: 'poss-web-monitoring-dashboard',
  templateUrl: './monitoring-dashboard.component.html',
  styleUrls: ['./monitoring-dashboard.component.scss']
})
export class MonitoringDashboardComponent implements OnInit, OnDestroy {
  tab: string;
  monitoringDashboardEnum = MonitoringDashboardEnum;

  scheduledJobsListForView: Observable<SchedulerJobsResults[]>;
  scheduledJobsListForViewCount: Observable<number>;

  scheduledJobsListForUpdate: Observable<SchedulerJobsResults[]>;
  scheduledJobsListForUpdateCount: Observable<number>;

  dataSyncMessageList$: Observable<SelectDropDownOption[]>;
  dataSyncStatisticsCount$: Observable<DataSyncCountByMessageTypeResponse[]>;

  dataSyncJobs$: Observable<DataSyncMessagesList[]>;
  dataSyncJobsCount$: Observable<number>;
  permissions$: Observable<any[]>;

  destroy$: Subject<null> = new Subject<null>();
  isLoading$: Observable<boolean>;
  isLoggedIn: boolean;

  scheduledJobsPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };
  updateScheduledTimePageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };
  dataSyncJobsPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };
  pageSizeOptions: number[] = [];
  minPageSize: number;

  locationFilter = {
    brands: null,
    regions: null,
    levels: null,
    countries: null,
    states: null,
    towns: null
  };
  dataSyncSearchForm: FormGroup;

  searchByLabel: string;
  selectDateLabel: string;
  locationLabel: string;
  statusCodeLabel: string;
  selectLocationLableText: string;
  searchLocationPlaceHolder: string;
  selectedLocation: SelectionDailogOption;
  locationForSelection: SelectionDailogOption[] = [];
  locationCode: string[] = [];
  currentDate = moment();
  isEpossApplication = false;
  SCHEDULER_TAB_PERMISSIONS = MonitoringDashboardEnum.SCHEDULER_TAB_PERMISSIONS;
  DATASYNC_TAB_PERMISSIONS = MonitoringDashboardEnum.DATASYNC_TAB_PERMISSIONS;

  constructor(
    private router: Router,
    @Inject(POSS_APP_TYPE) private appType,
    private activatedRoute: ActivatedRoute,
    public translate: TranslateService,
    private authFacade: AuthFacade,
    private dialog: MatDialog,
    private selectionDialog: SelectionDialogService,
    private appsettingFacade: AppsettingFacade,
    private monitoringDashboardFacade: MonitoringDashboardFacade,
    private locationMappingFacade: LocationMappingFacade,
    private fieldValidatorsService: FieldValidatorsService,
    private permissionfacade: PermissionFacade,
    private elementPermission: ElementPermissionService,
    private overlayNotification: OverlayNotificationServiceAbstraction
  ) {
    if (this.appType === MonitoringDashboardEnum.EPOSS) {
      this.isEpossApplication = true;
    }

    this.translate
      .get([
        'pw.monitoringDashboard.searchBy',
        'pw.monitoringDashboard.selectDate',
        'pw.monitoringDashboard.location',
        'pw.monitoringDashboard.statusCode',
        'pw.monitoringDashboard.selectLocationCode',
        'pw.monitoringDashboard.searchByLocationCode'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(translatedMsg => {
        this.searchByLabel = translatedMsg['pw.monitoringDashboard.searchBy'];
        this.selectDateLabel =
          translatedMsg['pw.monitoringDashboard.selectDate'];
        this.locationLabel = translatedMsg['pw.monitoringDashboard.location'];
        this.statusCodeLabel =
          translatedMsg['pw.monitoringDashboard.statusCode'];
        this.selectLocationLableText =
          translatedMsg['pw.monitoringDashboard.selectLocationCode'];
        this.searchLocationPlaceHolder =
          translatedMsg['pw.monitoringDashboard.searchByLocationCode'];
      });

    this.dataSyncSearchForm = new FormGroup({
      selectRadioButton: new FormControl(
        this.monitoringDashboardEnum.MESSAGE_COUNT_BY_TYPE,
        [this.fieldValidatorsService.requiredField(this.searchByLabel)]
      ),
      selectDate: new FormControl(this.currentDate, [
        this.fieldValidatorsService.requiredField(this.selectDateLabel)
      ]),
      statusCode: new FormControl('')
    });

    this.locationMappingFacade
      .getError()
      .pipe(
        takeUntil(this.destroy$),
        filter(errorVal => !!errorVal)
      )
      .subscribe(errorVal => this.errorHandler(errorVal));
  }

  ngOnInit(): void {
    this.permissions$ = this.permissionfacade.getPermissionforURL();
    this.authFacade
      .isUserLoggedIn()
      .pipe(takeUntil(this.destroy$))
      .subscribe((isLoggedIn: boolean) => {
        this.isLoggedIn = isLoggedIn;
      });

    this.router.events
      .pipe(
        filter(
          (event: Event) => event instanceof NavigationEnd && this.isLoggedIn
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        const tab = this.activatedRoute.snapshot.params[
          MonitoringDashboardEnum.TAB
        ];
        this.changeTab(tab);
      });
    this.changeTab(
      this.activatedRoute.snapshot.params[MonitoringDashboardEnum.TAB]
    );

    this.componentInit();
  }

  componentInit() {
    this.monitoringDashboardFacade.resetState();
    this.scheduledJobsListForView = this.monitoringDashboardFacade.getScheduledJobs();
    this.scheduledJobsListForViewCount = this.monitoringDashboardFacade.getSchedulerJobsCount();

    this.scheduledJobsListForUpdate = this.monitoringDashboardFacade.getScheduledJobsListForUpdate();
    this.scheduledJobsListForUpdateCount = this.monitoringDashboardFacade.getScheduledJobsListForUpdateCount();

    // To load and get locations for location popup
    this.locationMappingFacade.searchLocations(this.locationFilter);

    this.locationMappingFacade
      .getLocations()
      .pipe(takeUntil(this.destroy$))
      .subscribe((locations: any) => {
        if (locations) {
          this.locationForSelection = locations.map(location => ({
            id: location.locationCode,
            description: location.locationCode + ' - ' + location.description
          }));
        }
      });
    // To show message on success of Scheduler Manual Run
    this.monitoringDashboardFacade
      .getManualRunScheduleJobStatus()
      .pipe(takeUntil(this.destroy$))
      .subscribe(status => {
        if (!!status) {
          this.showNotifications(
            'pw.monitoringDashboard.manualRunSuccessful',
            MonitoringDashboardEnum.MANUAL_RUN_SCHEDULER_SUCCESS
          );
        }
      });
    // To show message on success of Update Scheduler Time Response
    this.monitoringDashboardFacade
      .getUpdateScheduleJobSuccess()
      .pipe(takeUntil(this.destroy$))
      .subscribe(status => {
        if (!!status) {
          this.showNotifications(
            'pw.monitoringDashboard.schedulerUpdateSuccessful',
            MonitoringDashboardEnum.UPDATE_SCHEDULER_SUCCESS
          );
        }
      });
    //To get data Sync message status list
    this.monitoringDashboardFacade.loadDataSyncStatusList();
    this.dataSyncMessageList$ = this.monitoringDashboardFacade.getDataSyncStatusList();

    // To get data sync stats count by message id
    this.dataSyncStatisticsCount$ = this.monitoringDashboardFacade.getDataSyncCountByMessageType();

    // To get data Sync messages
    this.dataSyncJobs$ = this.monitoringDashboardFacade.getDataSyncJobs();
    this.dataSyncJobsCount$ = this.monitoringDashboardFacade.getDataSyncJobsCount();

    this.monitoringDashboardFacade
      .getManualRetryDataSyncJobStatus()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (!!data) {
          this.showNotifications(
            'pw.monitoringDashboard.manualRunSuccessful',
            MonitoringDashboardEnum.MANUAL_RUN_DATA_SYNC_SUCCESS
          );
        }
      });

    // this.error$ = this.monitoringDashboardFacade.getError();
    this.isLoading$ = this.monitoringDashboardFacade.getIsLoading();

    this.appsettingFacade
      .getPageSize()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        const pageSize = JSON.parse(data.toString());
        this.scheduledJobsPageEvent.pageSize = pageSize;
        this.updateScheduledTimePageEvent.pageSize = pageSize;
        this.dataSyncJobsPageEvent.pageSize = pageSize;
        // To get the data on page load, uncomment the below method calls
        this.loadScheduledJobsList();
        this.loadScheduledJobsListForUpdate();
        this.loadDataSyncJobsList();
      });
    this.appsettingFacade
      .getPageSizeOptions()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.pageSizeOptions = data;
        this.minPageSize = this.pageSizeOptions.reduce((a: number, b: number) =>
          a < b ? a : b
        );
      });
    this.monitoringDashboardFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });
    // To load the dataSync Stats on load with default search criteria
    this.searchDataSyncMessages();
  }

  selectRadiochanged(selectedButton: string) {
    if (
      selectedButton === this.monitoringDashboardEnum.MANUAL_TRIGGER_OF_JOBS
    ) {
      this.dataSyncSearchForm
        .get('statusCode')
        .setValidators([
          this.fieldValidatorsService.requiredField(this.statusCodeLabel)
        ]);
    } else {
      this.dataSyncSearchForm.get('statusCode').clearValidators();
    }
    this.dataSyncSearchForm.get('statusCode').updateValueAndValidity();
  }

  loadPermission = (element: string): Observable<PermissionData> =>
    this.elementPermission.loadPermission(element, this.permissions$);

  loadScheduledJobsList() {
    this.monitoringDashboardFacade.loadScheduledJobs(
      this.scheduledJobsPageEvent
    );
  }
  loadScheduledJobsListForUpdate() {
    this.monitoringDashboardFacade.loadScheduledJobsListForUpdate(
      this.updateScheduledTimePageEvent
    );
  }
  searchDataSyncMessages() {
    if (this.dataSyncSearchForm.valid) {
      const requestpayload: DataSyncCountByMessageTypePayload = {
        date: moment(this.dataSyncSearchForm.get('selectDate').value).valueOf(),
        location: this.selectedLocation
          ? this.selectedLocation.id
            ? this.selectedLocation.id
            : ''
          : ''
      };
      if (
        this.selectedLocation === null ||
        this.selectedLocation === undefined
      ) {
        delete requestpayload.location;
      }

      //Call Appropriate Api based on radio selection
      if (
        this.dataSyncSearchForm.controls['selectRadioButton'].value ===
        this.monitoringDashboardEnum.MESSAGE_COUNT_BY_TYPE
      ) {
        this.loadCountByMessageType(requestpayload);
      } else if (
        this.dataSyncSearchForm.controls['selectRadioButton'].value ===
        this.monitoringDashboardEnum.MANUAL_TRIGGER_OF_JOBS
      ) {
        this.loadDataSyncJobsList();
      }
    }
  }

  openLocationPopup() {
    this.dialog.closeAll();
    this.selectionDialog
      .open({
        title: this.selectLocationLableText,
        placeholder: this.searchLocationPlaceHolder,
        options: this.locationForSelection
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((selectedOption: SelectionDailogOption) => {
        if (selectedOption) {
          this.selectedLocation = selectedOption;
          this.locationCode = [selectedOption.id];
        }
      });
  }

  clearPopup() {
    this.locationCode = [];
    this.selectedLocation = null;
  }

  loadDataSyncJobsList() {
    const payload: DataSyncMessagesPayloadData = {
      date: moment(this.dataSyncSearchForm.get('selectDate').value).valueOf(),
      location: this.selectedLocation
        ? this.selectedLocation.id
          ? this.selectedLocation.id
          : ''
        : '',
      statusCode: this.dataSyncSearchForm.get('statusCode').value
    };
    if (this.selectedLocation === null || this.selectedLocation === undefined) {
      delete payload.location;
    }
    const queryParams = {
      page: this.dataSyncJobsPageEvent.pageIndex,
      size: this.dataSyncJobsPageEvent.pageSize
    };
    if (!!this.dataSyncSearchForm.get('statusCode').value) {
      this.monitoringDashboardFacade.loadDataSyncJobs({ payload, queryParams });
    }
  }

  back() {
    this.router.navigate([getPossHomeRouteUrl()], {
      queryParams: {
        menu: PossHomeKeyEnum.MONITORING_DASHBOARD
      }
    });
  }

  loadCountByMessageType(requestpayload: DataSyncCountByMessageTypePayload) {
    this.monitoringDashboardFacade.loadCountByMessageType(requestpayload);
  }

  changeTab(newTab: MonitoringDashboardEnum) {
    if (this.tab !== newTab) {
      this.tab = newTab;

      this.router.navigate(['..', this.tab], {
        relativeTo: this.activatedRoute
      });
    }
  }

  paginateSchedulerJobs(pageEvent: PageEvent) {
    this.scheduledJobsPageEvent = pageEvent;
    this.loadScheduledJobsList();
  }
  paginateUpdateScheduleTime(pageEvent: PageEvent) {
    this.updateScheduledTimePageEvent = pageEvent;
    this.loadScheduledJobsListForUpdate();
  }
  paginateDataSyncJobs(pageEvent: PageEvent) {
    this.dataSyncJobsPageEvent = pageEvent;
    this.loadDataSyncJobsList();
  }
  manuallyRunSelectedJob(requestPayload: ManualRunDataSyncPayload) {
    this.monitoringDashboardFacade.manuallyRunSelectedJob(requestPayload);
  }
  manualRunSchedulerJob(requestPayload: ManualRunSchedulerJobRequestPayload) {
    this.monitoringDashboardFacade.manuallyRunSchedulerJob(requestPayload);
  }

  updateScheduleTime(requestPayload: UpdateScheduleTimeRequestPayload) {
    this.monitoringDashboardFacade.updateScheduleTime(requestPayload);
  }

  showNotifications(key: string, type?: string) {
    this.translate
      .get(key)
      .pipe(take(1))
      .subscribe((translatedMsg: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SIMPLE,
            message: translatedMsg,
            hasClose: true,
            hasBackdrop: true
          })
          .events.pipe(take(1))
          .subscribe(event => {
            if (event.eventType === OverlayNotificationEventType.CLOSE) {
              switch (type) {
                case MonitoringDashboardEnum.MANUAL_RUN_SCHEDULER_SUCCESS:
                  this.loadScheduledJobsList();
                  break;
                case MonitoringDashboardEnum.UPDATE_SCHEDULER_SUCCESS:
                  this.loadScheduledJobsList();
                  this.loadScheduledJobsListForUpdate();
                  break;
                case MonitoringDashboardEnum.MANUAL_RUN_DATA_SYNC_SUCCESS:
                  this.loadDataSyncJobsList();
                  break;
                default:
                  break;
              }
            }
          });
      });
  }

  errorHandler(error: CustomErrors) {
    this.overlayNotification
      .show({
        type: OverlayNotificationType.ERROR,
        message: error.message,
        hasClose: true, // optional
        error: error,
        hasBackdrop: true
      })
      .events.pipe(take(1))
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
