import * as selectors from './monitoring-dashboard.selectors';
import {
  CustomErrors,
  DataSyncCountByMessageTypeResponse,
  DataSyncMessagesList,
  SchedulerJobsResults,
  SelectDropDownOption
} from '@poss-web/shared/models';
import { initialState } from './monitoring-dashboard.reducer';
import { MonitoringDashboardState } from './monitoring-dashboard.state';

describe('Monitoring Dashboard Selector Testing Suite', () => {
  it('Testing selectIsLoading selector', () => {
    const state: MonitoringDashboardState = {
      ...initialState,
      isLoading: true
    };
    expect(
      selectors.monitoringDashboardSelectors.selectIsLoading.projector(state)
    ).toEqual(true);
  });
  it('Testing selectError selector', () => {
    const error: Error = {
      name: 'Name',
      message: 'error message',
      stack: 'stack'
    };
    const customErrors: CustomErrors = {
      code: 'EC2',
      message: 'error occured',
      traceId: 'abcdefghijk',
      timeStamp: '',
      error: error
    };

    const state: MonitoringDashboardState = {
      ...initialState,
      errors: customErrors
    };
    expect(
      selectors.monitoringDashboardSelectors.selectError.projector(state)
    ).toEqual(customErrors);
  });
  it('Testing selectScheduledJobs selector', () => {
    const schedulerJobsResults: SchedulerJobsResults[] = [
      {
        active: true,
        businessDate: 123456789,
        code: 'SAVED',
        cronExpression: null,
        description: 'description',
        lastRunTime: null,
        locationCode: 'CPD',
        nextRunTime: null,
        status: 'SAVED'
      }
    ];

    const state: MonitoringDashboardState = {
      ...initialState,
      scheduledJobs: schedulerJobsResults
    };
    expect(
      selectors.monitoringDashboardSelectors.selectScheduledJobs.projector(
        state
      )
    ).toEqual(schedulerJobsResults);
  });
  it('Testing selectSchedulerJobsCount selector', () => {
    const state: MonitoringDashboardState = {
      ...initialState,
      schedulerJobsCount: 10
    };
    expect(
      selectors.monitoringDashboardSelectors.selectSchedulerJobsCount.projector(
        state
      )
    ).toEqual(10);
  });
  it('Testing selectManualRunScheduleJobStatus selector', () => {
    const state: MonitoringDashboardState = {
      ...initialState,
      manualRunScheduleJobSuccess: true
    };
    expect(
      selectors.monitoringDashboardSelectors.selectManualRunScheduleJobStatus.projector(
        state
      )
    ).toEqual(true);
  });
  it('Testing selectScheduledJobsListForUpdate selector', () => {
    const schedulerJobsResults: SchedulerJobsResults[] = [
      {
        active: true,
        businessDate: 123456789,
        code: 'SAVED',
        cronExpression: null,
        description: 'description',
        lastRunTime: null,
        locationCode: 'CPD',
        nextRunTime: null,
        status: 'SAVED'
      }
    ];

    const state: MonitoringDashboardState = {
      ...initialState,
      scheduledJobsListForUpdate: schedulerJobsResults
    };
    expect(
      selectors.monitoringDashboardSelectors.selectScheduledJobsListForUpdate.projector(
        state
      )
    ).toEqual(schedulerJobsResults);
  });
  it('Testing selectScheduledJobsListForUpdateCount selector', () => {
    const state: MonitoringDashboardState = {
      ...initialState,
      scheduledJobsListForUpdateCount: 10
    };
    expect(
      selectors.monitoringDashboardSelectors.selectScheduledJobsListForUpdateCount.projector(
        state
      )
    ).toEqual(10);
  });
  it('Testing selectUpdateScheduleJobSuccess selector', () => {
    const state: MonitoringDashboardState = {
      ...initialState,
      updatingScheduleJobSuccess: true
    };
    expect(
      selectors.monitoringDashboardSelectors.selectUpdateScheduleJobSuccess.projector(
        state
      )
    ).toEqual(true);
  });
  it('Testing selectDataSyncStatusList selector', () => {
    const responsePayload: SelectDropDownOption[] = [
      {
        value: 'value',
        description: 'description'
      }
    ];

    const state: MonitoringDashboardState = {
      ...initialState,
      dataSyncStatusList: responsePayload
    };
    expect(
      selectors.monitoringDashboardSelectors.selectDataSyncStatusList.projector(
        state
      )
    ).toEqual(responsePayload);
  });
  it('Testing selectDataSyncCountByMessageType selector', () => {
    const responsePayload: DataSyncCountByMessageTypeResponse[] = [
      {
        statusCode: 'SAVED',
        statusDecs: 'saved',
        messageCount: 1
      }
    ];

    const state: MonitoringDashboardState = {
      ...initialState,
      dataSyncCountByMessageType: responsePayload
    };
    expect(
      selectors.monitoringDashboardSelectors.selectDataSyncCountByMessageType.projector(
        state
      )
    ).toEqual(responsePayload);
  });
  it('Testing selectDataSyncJobs selector', () => {
    const dataSyncMessagesList: DataSyncMessagesList[] = [
      {
        dataflowDirection: 'IN',
        destination: 'CPD',
        exception: null,
        id: '123',
        messageRefId: '1234',
        messageType: 'type',
        operation: 'FLOW',
        source: 'EPOSS',
        status: 'SAVED',
        syncTime: 123
      }
    ];

    const state: MonitoringDashboardState = {
      ...initialState,
      dataSyncJobs: dataSyncMessagesList
    };
    expect(
      selectors.monitoringDashboardSelectors.selectDataSyncJobs.projector(state)
    ).toEqual(dataSyncMessagesList);
  });
  it('Testing selectDataSyncJobsCount selector', () => {
    const state: MonitoringDashboardState = {
      ...initialState,
      dataSyncJobsCount: 10
    };
    expect(
      selectors.monitoringDashboardSelectors.selectDataSyncJobsCount.projector(
        state
      )
    ).toEqual(10);
  });
  it('Testing selectManualRetryDataSyncJobStatus selector', () => {
    const state: MonitoringDashboardState = {
      ...initialState,
      manualRetryDataSyncJobSuccess: true
    };
    expect(
      selectors.monitoringDashboardSelectors.selectManualRetryDataSyncJobStatus.projector(
        state
      )
    ).toEqual(true);
  });
});
