import { Store } from '@ngrx/store';
import { inject, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { MonitoringDashboardState } from './monitoring-dashboard.state';
import { MonitoringDashboardFacade } from './monitoring-dashboard.facade';
import {
  LoadAllScheduledJobs,
  ResetState,
  LoadAllScheduledJobsForUpdate,
  UpdateScheduleTime,
  LoadDataSyncStatusList,
  LoadCountByMessageType,
  LoadDataSyncJobs,
  ManuallyRunSelectedJob,
  ManuallyRunSchedulerJob
} from './monitoring-dashboard.actions';
import {
  DataSyncCountByMessageTypePayload,
  DataSyncMessagesPayloadData,
  DataSyncMessagesRequestPayload,
  ManualRunDataSyncPayload,
  ManualRunSchedulerJobRequestPayload,
  SchedulerJobsListingPayload,
  UpdateScheduleTimeRequestPayload
} from '@poss-web/shared/models';

describe('Monitoring Dashboard Facade Testing Suite', () => {
  const initialState: MonitoringDashboardState = {
    errors: null,
    isLoading: false,
    scheduledJobs: null,
    schedulerJobsCount: null,
    manualRunScheduleJobSuccess: null,
    scheduledJobsListForUpdate: null,
    scheduledJobsListForUpdateCount: null,
    updatingScheduleJobSuccess: null,
    dataSyncStatusList: null,
    dataSyncCountByMessageType: null,
    dataSyncJobs: null,
    dataSyncJobsCount: null,
    manualRetryDataSyncJobSuccess: null
  };

  let monitoringDashboardFacade: MonitoringDashboardFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), MonitoringDashboardFacade]
    });

    monitoringDashboardFacade = TestBed.inject(MonitoringDashboardFacade);
  });

  it('should dispatch ResetState action', inject([Store], store => {
    const storeSpy = spyOn(store, 'dispatch').and.callThrough();
    const expectedAction = new ResetState();

    monitoringDashboardFacade.resetState();
    expect(storeSpy).toHaveBeenCalledWith(expectedAction);
  }));

  it('should dispatch LoadAllScheduledJobs action', inject([Store], store => {
    const listingPayload: SchedulerJobsListingPayload = {
      pageIndex: 1,
      pageSize: 10
    };
    const storeSpy = spyOn(store, 'dispatch').and.callThrough();
    const expectedAction = new LoadAllScheduledJobs(listingPayload);

    monitoringDashboardFacade.loadScheduledJobs(listingPayload);
    expect(storeSpy).toHaveBeenCalledWith(expectedAction);
  }));

  it('should dispatch LoadAllScheduledJobsForUpdate action', inject(
    [Store],
    store => {
      const listingPayload: SchedulerJobsListingPayload = {
        pageIndex: 1,
        pageSize: 10
      };
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadAllScheduledJobsForUpdate(listingPayload);

      monitoringDashboardFacade.loadScheduledJobsListForUpdate(listingPayload);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }
  ));

  it('should dispatch UpdateScheduleTime action', inject([Store], store => {
    const payload: UpdateScheduleTimeRequestPayload = {
      cronExpression: '',
      isActive: true,
      schedulerCode: 'CODE'
    };
    const storeSpy = spyOn(store, 'dispatch').and.callThrough();
    const expectedAction = new UpdateScheduleTime(payload);

    monitoringDashboardFacade.updateScheduleTime(payload);
    expect(storeSpy).toHaveBeenCalledWith(expectedAction);
  }));

  it('should dispatch LoadDataSyncStatusList action', inject([Store], store => {
    const storeSpy = spyOn(store, 'dispatch').and.callThrough();
    const expectedAction = new LoadDataSyncStatusList();

    monitoringDashboardFacade.loadDataSyncStatusList();
    expect(storeSpy).toHaveBeenCalledWith(expectedAction);
  }));

  it('should dispatch LoadCountByMessageType action', inject([Store], store => {
    const payload: DataSyncCountByMessageTypePayload = {
      date: 123456789,
      location: 'CPD'
    };
    const storeSpy = spyOn(store, 'dispatch').and.callThrough();
    const expectedAction = new LoadCountByMessageType(payload);

    monitoringDashboardFacade.loadCountByMessageType(payload);
    expect(storeSpy).toHaveBeenCalledWith(expectedAction);
  }));

  it('should dispatch LoadDataSyncJobs action', inject([Store], store => {
    const dataSyncMessagesPayloadData: DataSyncMessagesPayloadData = {
      date: 123456789,
      location: 'CPD',
      statusCode: 'SAVED'
    };

    const payload: DataSyncMessagesRequestPayload = {
      payload: dataSyncMessagesPayloadData,
      queryParams: null
    };

    const storeSpy = spyOn(store, 'dispatch').and.callThrough();
    const expectedAction = new LoadDataSyncJobs(payload);

    monitoringDashboardFacade.loadDataSyncJobs(payload);
    expect(storeSpy).toHaveBeenCalledWith(expectedAction);
  }));

  it('should dispatch ManuallyRunSelectedJob action', inject([Store], store => {
    const manualRunDataSyncPayload: ManualRunDataSyncPayload = {
      destination: 'EPOSS',
      messageid: '1234'
    };

    const storeSpy = spyOn(store, 'dispatch').and.callThrough();
    const expectedAction = new ManuallyRunSelectedJob(manualRunDataSyncPayload);

    monitoringDashboardFacade.manuallyRunSelectedJob(manualRunDataSyncPayload);
    expect(storeSpy).toHaveBeenCalledWith(expectedAction);
  }));

  it('should dispatch ManuallyRunSchedulerJob action', inject(
    [Store],
    store => {
      const payload: ManualRunSchedulerJobRequestPayload = {
        schedulerCode: 'ABCD'
      };

      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new ManuallyRunSchedulerJob(payload);
      monitoringDashboardFacade.manuallyRunSchedulerJob(payload);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }
  ));

  it('should access  getIsLoading() selector action', () => {
    expect(monitoringDashboardFacade.getIsLoading()).toEqual(
      monitoringDashboardFacade['isLoading$']
    );
  });
  it('should access  getError() selector action', () => {
    expect(monitoringDashboardFacade.getError()).toEqual(
      monitoringDashboardFacade['error$']
    );
  });
  it('should access  getScheduledJobs() selector action', () => {
    expect(monitoringDashboardFacade.getScheduledJobs()).toEqual(
      monitoringDashboardFacade['scheduledJobs$']
    );
  });
  it('should access  getSchedulerJobsCount() selector action', () => {
    expect(monitoringDashboardFacade.getSchedulerJobsCount()).toEqual(
      monitoringDashboardFacade['schedulerJobsCount$']
    );
  });
  it('should access  getManualRunScheduleJobStatus() selector action', () => {
    expect(monitoringDashboardFacade.getManualRunScheduleJobStatus()).toEqual(
      monitoringDashboardFacade['manualRunScheduleJobStatus$']
    );
  });
  it('should access  getScheduledJobsListForUpdate() selector action', () => {
    expect(monitoringDashboardFacade.getScheduledJobsListForUpdate()).toEqual(
      monitoringDashboardFacade['scheduledJobsListForUpdate$']
    );
  });
  it('should access  getScheduledJobsListForUpdateCount() selector action', () => {
    expect(
      monitoringDashboardFacade.getScheduledJobsListForUpdateCount()
    ).toEqual(monitoringDashboardFacade['scheduledJobsListForUpdateCount$']);
  });
  it('should access  getUpdateScheduleJobSuccess() selector action', () => {
    expect(monitoringDashboardFacade.getUpdateScheduleJobSuccess()).toEqual(
      monitoringDashboardFacade['updateScheduleJobSuccess$']
    );
  });
  it('should access  getDataSyncStatusList() selector action', () => {
    expect(monitoringDashboardFacade.getDataSyncStatusList()).toEqual(
      monitoringDashboardFacade['dataSyncStatusList$']
    );
  });
  it('should access  getDataSyncCountByMessageType() selector action', () => {
    expect(monitoringDashboardFacade.getDataSyncCountByMessageType()).toEqual(
      monitoringDashboardFacade['dataSyncCountByMessageType$']
    );
  });
  it('should access  getDataSyncJobs() selector action', () => {
    expect(monitoringDashboardFacade.getDataSyncJobs()).toEqual(
      monitoringDashboardFacade['dataSyncJobs$']
    );
  });
  it('should access  getDataSyncJobsCount() selector action', () => {
    expect(monitoringDashboardFacade.getDataSyncJobsCount()).toEqual(
      monitoringDashboardFacade['dataSyncJobsCount$']
    );
  });
  it('should access  getManualRetryDataSyncJobStatus() selector action', () => {
    expect(monitoringDashboardFacade.getManualRetryDataSyncJobStatus()).toEqual(
      monitoringDashboardFacade['manualRetryDataSyncJobStatus$']
    );
  });
});
