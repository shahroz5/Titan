import { Observable } from 'rxjs';
import { AppVersionDashboardEffect } from './app-version-dashboard.effect';
import { AppVersionDashboardService } from '../app-version-dashboard.service';
import { LoggerService } from '@poss-web/shared/util-logger';
import { TestBed } from '@angular/core/testing';
import { DataPersistence } from '@nrwl/angular';
import { provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import {
  AddApplicationVersion,
  AddApplicationVersionFailure,
  AddApplicationVersionSuccess,
  DeleteAppVersionById,
  DeleteAppVersionByIdFailure,
  DeleteAppVersionByIdSuccess,
  GetAppVersions,
  GetAppVersionsByStatus,
  GetAppVersionsByStatusFailure,
  GetAppVersionsByStatusSuccess,
  GetAppVersionsFailure,
  GetAppVersionsSuccess,
  GetStatusList,
  GetStatusListFailure,
  GetStatusListSuccess,
  ListAllApplicationVersions,
  ListAllApplicationVersionsFailure,
  ListAllApplicationVersionsSuccess,
  PublishAllAppVersions,
  PublishAllAppVersionsFailure,
  PublishAllAppVersionsSuccess
} from './app-version-dashboard.actions';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  AddVersionRequestModel,
  AllAppVersionsList,
  AppVersionByStatusRequestPayloadWithQueryParams,
  AppVersionDataByStatusResponse,
  AppVersionsList,
  SelectDropDownOption
} from '@poss-web/shared/models';
import { hot, cold } from 'jasmine-marbles';

describe('App Version Dashboard Effects Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: AppVersionDashboardEffect;

  const initialState = {};
  const appVersionDashboardServiceSpy: jasmine.SpyObj<AppVersionDashboardService> = jasmine.createSpyObj<
    AppVersionDashboardService
  >('AppVersionDashboardService', [
    'getAppVersions',
    'listAllApplicationVersions',
    'getAppVersionsByStatus',
    'getStatusList',
    'addApplicationVersion',
    'publishAllAppVersions',
    'deleteAppVersionById'
  ]);
  const loggerService = jasmine.createSpyObj<LoggerService>('LoggerService', [
    'error'
  ]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AppVersionDashboardEffect,
        DataPersistence,
        provideMockStore({ initialState }),
        provideMockActions(() => actions$),
        {
          provide: AppVersionDashboardService,
          useValue: appVersionDashboardServiceSpy
        },
        {
          provide: LoggerService,
          useValue: loggerService
        }
      ]
    });
    effect = TestBed.inject(AppVersionDashboardEffect);
  });

  describe('getAppVersions Effects Testing', () => {
    it('should get App versions', () => {
      const responsePayload: AppVersionsList = {
        appVersionData: [
          {
            databaseVersion: '1.0',

            possServiceVersion: '1.0',
            possUiVersion: '1.0'
          }
        ],
        possUiVersionsList: [
          {
            value: '1.0',
            description: '1.0'
          }
        ],
        apiVersionsList: [
          {
            value: '1.0',
            description: '1.0'
          }
        ],
        dbVersionsList: [
          {
            value: '1.0',
            description: '1.0'
          }
        ]
      };

      const action = new GetAppVersions();
      const outCome = new GetAppVersionsSuccess(responsePayload);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: responsePayload });
      appVersionDashboardServiceSpy.getAppVersions.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.getAppVersions$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new GetAppVersions();
      const error = new Error('some error');
      const outCome = new GetAppVersionsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      appVersionDashboardServiceSpy.getAppVersions.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.getAppVersions$).toBeObservable(expected$);
    });
  });

  describe('listAllApplicationVersions Effects Testing', () => {
    it('should get all App versions for select list', () => {
      const responsePayload: AllAppVersionsList = {
        allPossUiVersionsList: [
          {
            value: '1.0',
            description: '1.0'
          }
        ],
        allEpossUiVersionsList: [
          {
            value: '1.0',
            description: '1.0'
          }
        ],
        allApiVersionsList: [
          {
            value: '1.0',
            description: '1.0'
          }
        ],
        allDbVersionsList: [
          {
            value: '1.0',
            description: '1.0'
          }
        ]
      };

      const action = new ListAllApplicationVersions();
      const outCome = new ListAllApplicationVersionsSuccess(responsePayload);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: responsePayload });
      appVersionDashboardServiceSpy.listAllApplicationVersions.and.returnValue(
        response$
      );
      const expected$ = cold('--b', { b: outCome });
      expect(effect.listAllApplicationVersions$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new ListAllApplicationVersions();
      const error = new Error('some error');
      const outCome = new ListAllApplicationVersionsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      appVersionDashboardServiceSpy.listAllApplicationVersions.and.returnValue(
        response$
      );
      const expected$ = cold('--b', { b: outCome });
      expect(effect.listAllApplicationVersions$).toBeObservable(expected$);
    });
  });

  describe('getAppVersionsByStatus Effects Testing', () => {
    const payload: AppVersionByStatusRequestPayloadWithQueryParams = {
      appVersionByStatusRequestPayload: {
        status: 'OPEN',
        location: 'CPD',
        databaseVersion: '1.0',
        epossUiVersion: '1.0',
        possServiceVersion: '1.0',
        possUiVersion: '1.0'
      },
      queryParams: null
    };
    it('should get App versions by status', () => {
      const responsePayload: AppVersionDataByStatusResponse = {
        appVersionDataByStatus: [
          {
            databaseVersion: '1.0',
            downloadUrl: null,
            id: '1',
            locationCode: 'CPD',
            possServiceVersion: '1.0',
            possUiVersion: '1.0',
            status: 'OPEN',
            published: true
          }
        ],
        count: 1
      };

      const action = new GetAppVersionsByStatus(payload);
      const outCome = new GetAppVersionsByStatusSuccess(responsePayload);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: responsePayload });
      appVersionDashboardServiceSpy.getAppVersionsByStatus.and.returnValue(
        response$
      );
      const expected$ = cold('--b', { b: outCome });
      expect(effect.getAppVersionsByStatus$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new GetAppVersionsByStatus(payload);
      const error = new Error('some error');
      const outCome = new GetAppVersionsByStatusFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      appVersionDashboardServiceSpy.getAppVersionsByStatus.and.returnValue(
        response$
      );
      const expected$ = cold('--b', { b: outCome });
      expect(effect.getAppVersionsByStatus$).toBeObservable(expected$);
    });
  });

  describe('getStatusList Effects Testing', () => {
    it('should get status list', () => {
      const responsePayload: SelectDropDownOption[] = [
        {
          value: '1.0',
          description: '1.0'
        }
      ];

      const action = new GetStatusList();
      const outCome = new GetStatusListSuccess(responsePayload);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: responsePayload });
      appVersionDashboardServiceSpy.getStatusList.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.getStatusList$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new GetStatusList();
      const error = new Error('some error');
      const outCome = new GetStatusListFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      appVersionDashboardServiceSpy.getStatusList.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.getStatusList$).toBeObservable(expected$);
    });
  });

  describe('addApplicationVersion Effects Testing', () => {
    const payload: AddVersionRequestModel = {
      databaseVersion: '1.0',
      downloadUrl: null,
      locationCode: ['CPD'],
      possServiceVersion: '1.0',
      possUiVersion: '1.0'
    };

    it('should get status list', () => {
      const responsePayload: SelectDropDownOption[] = [
        {
          value: '1.0',
          description: '1.0'
        }
      ];

      const action = new AddApplicationVersion(payload);
      const outCome = new AddApplicationVersionSuccess(responsePayload);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: responsePayload });
      appVersionDashboardServiceSpy.addApplicationVersion.and.returnValue(
        response$
      );
      const expected$ = cold('--b', { b: outCome });
      expect(effect.addApplicationVersion$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new AddApplicationVersion(payload);
      const error = new Error('some error');
      const outCome = new AddApplicationVersionFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      appVersionDashboardServiceSpy.addApplicationVersion.and.returnValue(
        response$
      );
      const expected$ = cold('--b', { b: outCome });
      expect(effect.addApplicationVersion$).toBeObservable(expected$);
    });
  });

  describe('publishAllAppVersions Effects Testing', () => {
    it('should publish all app versions', () => {
      const action = new PublishAllAppVersions();
      const outCome = new PublishAllAppVersionsSuccess();
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: null });
      appVersionDashboardServiceSpy.publishAllAppVersions.and.returnValue(
        response$
      );
      const expected$ = cold('--b', { b: outCome });
      expect(effect.publishAllAppVersions$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new PublishAllAppVersions();
      const error = new Error('some error');
      const outCome = new PublishAllAppVersionsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      appVersionDashboardServiceSpy.publishAllAppVersions.and.returnValue(
        response$
      );
      const expected$ = cold('--b', { b: outCome });
      expect(effect.publishAllAppVersions$).toBeObservable(expected$);
    });
  });

  describe('deleteAppVersionById Effects Testing', () => {
    it('should publish all app versions', () => {
      const action = new DeleteAppVersionById(10);
      const outCome = new DeleteAppVersionByIdSuccess();
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: null });
      appVersionDashboardServiceSpy.deleteAppVersionById.and.returnValue(
        response$
      );
      const expected$ = cold('--b', { b: outCome });
      expect(effect.deleteAppVersionById$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new DeleteAppVersionById(10);
      const error = new Error('some error');
      const outCome = new DeleteAppVersionByIdFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      appVersionDashboardServiceSpy.deleteAppVersionById.and.returnValue(
        response$
      );
      const expected$ = cold('--b', { b: outCome });
      expect(effect.deleteAppVersionById$).toBeObservable(expected$);
    });
  });
});
