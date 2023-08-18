import { TestBed } from '@angular/core/testing';
import { hot, cold } from 'jasmine-marbles';

import { provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { DataPersistence } from '@nrwl/angular';
import { LoggerService } from '@poss-web/shared/util-logger';
import { Observable } from 'rxjs';
import { MonitoringDashboardEffects } from './monitoring-dashboard.effects';
import { MonitoringDashboardService } from '../monitoring-dashboard.service';
import {
  LoadAllScheduledJobs,
  LoadAllScheduledJobsFailure,
  LoadAllScheduledJobsForUpdate,
  LoadAllScheduledJobsForUpdateFailure,
  LoadAllScheduledJobsForUpdateSuccess,
  LoadAllScheduledJobsSuccess,
  LoadCountByMessageType,
  LoadCountByMessageTypeFailure,
  LoadCountByMessageTypeSuccess,
  LoadDataSyncJobs,
  LoadDataSyncJobsFailure,
  LoadDataSyncJobsSuccess,
  LoadDataSyncStatusList,
  LoadDataSyncStatusListFailure,
  LoadDataSyncStatusListSuccess,
  ManuallyRunSchedulerJob,
  ManuallyRunSchedulerJobFailure,
  ManuallyRunSchedulerJobSuccess,
  ManuallyRunSelectedJob,
  ManuallyRunSelectedJobFailure,
  ManuallyRunSelectedJobSuccess,
  UpdateScheduleTime,
  UpdateScheduleTimeFailure,
  UpdateScheduleTimeSuccess
} from './monitoring-dashboard.actions';
import {
  DataSyncCountByMessageTypePayload,
  DataSyncCountByMessageTypeResponse,
  DataSyncMessagesList,
  DataSyncMessagesListResponse,
  DataSyncMessagesPayloadData,
  DataSyncMessagesRequestPayload,
  ManualRunDataSyncPayload,
  ManualRunSchedulerJobRequestPayload,
  SchedulerJobsListingPayload,
  SchedulerJobsResponse,
  SchedulerJobsResults,
  SelectDropDownOption,
  UpdateScheduleTimeRequestPayload
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';

describe('Monitoring Dashboard Effects Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: MonitoringDashboardEffects;

  const initialState = {};
  const monitoringDashboardServiceSpy: jasmine.SpyObj<MonitoringDashboardService> = jasmine.createSpyObj<
    MonitoringDashboardService
  >('MonitoringDashboardService', [
    'loadAllScheduledJobs',
    'manuallyRunSchedulerJob',
    'updateScheduleTime',
    'loadDataSyncStatusList',
    'loadCountByMessageType',
    'loadDataSyncJobs',
    'manuallyRunDataSyncJob'
  ]);
  const loggerService = jasmine.createSpyObj<LoggerService>('LoggerService', [
    'error'
  ]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MonitoringDashboardEffects,
        DataPersistence,
        provideMockStore({ initialState }),
        provideMockActions(() => actions$),
        {
          provide: MonitoringDashboardService,
          useValue: monitoringDashboardServiceSpy
        },
        {
          provide: LoggerService,
          useValue: loggerService
        }
      ]
    });
    effect = TestBed.inject(MonitoringDashboardEffects);
  });

  describe('LoadAllScheduledJobs Effects Testing', () => {
    const payload: SchedulerJobsListingPayload = {
      pageIndex: 1,
      pageSize: 10
    };

    it('should load all Scheduled Jobs', () => {
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

      const responsePayload: SchedulerJobsResponse = {
        schedulerJobsResults: schedulerJobsResults,
        schedulerJobsCount: 1
      };

      const action = new LoadAllScheduledJobs(payload);
      const outCome = new LoadAllScheduledJobsSuccess(responsePayload);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: responsePayload });
      monitoringDashboardServiceSpy.loadAllScheduledJobs.and.returnValue(
        response$
      );
      const expected$ = cold('--b', { b: outCome });
      expect(effect.loadAllScheduledJobs$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadAllScheduledJobs(payload);
      const error = new Error('some error');
      const outCome = new LoadAllScheduledJobsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      monitoringDashboardServiceSpy.loadAllScheduledJobs.and.returnValue(
        response$
      );
      const expected$ = cold('--b', { b: outCome });
      expect(effect.loadAllScheduledJobs$).toBeObservable(expected$);
    });
  });

  describe('ManuallyRunSchedulerJob Effects Testing', () => {
    const payload: ManualRunSchedulerJobRequestPayload = {
      schedulerCode: 'ABCD'
    };

    it('should Manually Run Scheduler jobs', () => {
      const action = new ManuallyRunSchedulerJob(payload);
      const outCome = new ManuallyRunSchedulerJobSuccess();
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: null });
      monitoringDashboardServiceSpy.manuallyRunSchedulerJob.and.returnValue(
        response$
      );
      const expected$ = cold('--b', { b: outCome });
      expect(effect.manuallyRunSchedulerJob$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new ManuallyRunSchedulerJob(payload);
      const error = new Error('some error');
      const outCome = new ManuallyRunSchedulerJobFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      monitoringDashboardServiceSpy.manuallyRunSchedulerJob.and.returnValue(
        response$
      );
      const expected$ = cold('--b', { b: outCome });
      expect(effect.manuallyRunSchedulerJob$).toBeObservable(expected$);
    });
  });

  describe('LoadAllScheduledJobsForUpdate Effects Testing', () => {
    const listingPayload: SchedulerJobsListingPayload = {
      pageIndex: 1,
      pageSize: 10
    };

    it('should Load All Scheduled Jobs for Update', () => {
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
      const responsePayload: SchedulerJobsResponse = {
        schedulerJobsResults: schedulerJobsResults,
        schedulerJobsCount: 1
      };

      const action = new LoadAllScheduledJobsForUpdate(listingPayload);
      const outCome = new LoadAllScheduledJobsForUpdateSuccess(responsePayload);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: responsePayload });
      monitoringDashboardServiceSpy.loadAllScheduledJobs.and.returnValue(
        response$
      );
      const expected$ = cold('--b', { b: outCome });
      expect(effect.loadAllScheduledJobsForUpdate$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadAllScheduledJobsForUpdate(listingPayload);
      const error = new Error('some error');
      const outCome = new LoadAllScheduledJobsForUpdateFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      monitoringDashboardServiceSpy.loadAllScheduledJobs.and.returnValue(
        response$
      );
      const expected$ = cold('--b', { b: outCome });
      expect(effect.loadAllScheduledJobsForUpdate$).toBeObservable(expected$);
    });
  });

  describe('UpdateScheduleTime Effects Testing', () => {
    const payload: UpdateScheduleTimeRequestPayload = {
      cronExpression: '',
      isActive: true,
      schedulerCode: 'CODE'
    };

    it('should Update Schedule Time & status', () => {
      const action = new UpdateScheduleTime(payload);
      const outCome = new UpdateScheduleTimeSuccess();
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: null });
      monitoringDashboardServiceSpy.updateScheduleTime.and.returnValue(
        response$
      );
      const expected$ = cold('--b', { b: outCome });
      expect(effect.updateScheduleTime$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new UpdateScheduleTime(payload);
      const error = new Error('some error');
      const outCome = new UpdateScheduleTimeFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      monitoringDashboardServiceSpy.updateScheduleTime.and.returnValue(
        response$
      );
      const expected$ = cold('--b', { b: outCome });
      expect(effect.updateScheduleTime$).toBeObservable(expected$);
    });
  });

  describe('LoadDataSyncStatusList Effects Testing', () => {
    it('should Load Data Sync Status List', () => {
      const responsePayload: SelectDropDownOption[] = [
        {
          value: 'value',
          description: 'description'
        }
      ];

      const action = new LoadDataSyncStatusList();
      const outCome = new LoadDataSyncStatusListSuccess(responsePayload);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: responsePayload });
      monitoringDashboardServiceSpy.loadDataSyncStatusList.and.returnValue(
        response$
      );
      const expected$ = cold('--b', { b: outCome });
      expect(effect.loadDataSyncStatusList$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadDataSyncStatusList();
      const error = new Error('some error');
      const outCome = new LoadDataSyncStatusListFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      monitoringDashboardServiceSpy.loadDataSyncStatusList.and.returnValue(
        response$
      );
      const expected$ = cold('--b', { b: outCome });
      expect(effect.loadDataSyncStatusList$).toBeObservable(expected$);
    });
  });

  describe('LoadCountByMessageType Effects Testing', () => {
    const payload: DataSyncCountByMessageTypePayload = {
      date: 123456789,
      location: 'CPD'
    };
    it('should Load Count By Message Type', () => {
      const responsePayload: DataSyncCountByMessageTypeResponse[] = [
        {
          statusCode: 'SAVED',
          statusDecs: 'saved',
          messageCount: 1
        }
      ];

      const action = new LoadCountByMessageType(payload);
      const outCome = new LoadCountByMessageTypeSuccess(responsePayload);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: responsePayload });
      monitoringDashboardServiceSpy.loadCountByMessageType.and.returnValue(
        response$
      );
      const expected$ = cold('--b', { b: outCome });
      expect(effect.loadCountByMessageType$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadCountByMessageType(payload);
      const error = new Error('some error');
      const outCome = new LoadCountByMessageTypeFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      monitoringDashboardServiceSpy.loadCountByMessageType.and.returnValue(
        response$
      );
      const expected$ = cold('--b', { b: outCome });
      expect(effect.loadCountByMessageType$).toBeObservable(expected$);
    });
  });

  describe('LoadDataSyncJobs Effects Testing', () => {
    const dataSyncMessagesPayloadData: DataSyncMessagesPayloadData = {
      date: 123456789,
      location: 'CPD',
      statusCode: 'SAVED'
    };
    const payload: DataSyncMessagesRequestPayload = {
      payload: dataSyncMessagesPayloadData,
      queryParams: null
    };

    it('should Load data sync Jobs', () => {
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
      const responsePayload: DataSyncMessagesListResponse = {
        messagelist: dataSyncMessagesList,
        count: 1
      };

      const action = new LoadDataSyncJobs(payload);
      const outCome = new LoadDataSyncJobsSuccess(responsePayload);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: responsePayload });
      monitoringDashboardServiceSpy.loadDataSyncJobs.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.loadDataSyncJobs$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadDataSyncJobs(payload);
      const error = new Error('some error');
      const outCome = new LoadDataSyncJobsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      monitoringDashboardServiceSpy.loadDataSyncJobs.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.loadDataSyncJobs$).toBeObservable(expected$);
    });
  });

  describe('ManuallyRunSelectedJob Effects Testing', () => {
    const manualRunDataSyncPayload: ManualRunDataSyncPayload = {
      destination: 'EPOSS',
      messageid: '1234'
    };

    it('should Manually Run Selected Job', () => {
      const action = new ManuallyRunSelectedJob(manualRunDataSyncPayload);
      const outCome = new ManuallyRunSelectedJobSuccess();
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: null });
      monitoringDashboardServiceSpy.manuallyRunDataSyncJob.and.returnValue(
        response$
      );
      const expected$ = cold('--b', { b: outCome });
      expect(effect.manuallyRunSelectedJob$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new ManuallyRunSelectedJob(manualRunDataSyncPayload);
      const error = new Error('some error');
      const outCome = new ManuallyRunSelectedJobFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      monitoringDashboardServiceSpy.manuallyRunDataSyncJob.and.returnValue(
        response$
      );
      const expected$ = cold('--b', { b: outCome });
      expect(effect.manuallyRunSelectedJob$).toBeObservable(expected$);
    });
  });
});
