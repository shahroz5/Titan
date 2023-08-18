//you here need to assert a reactive result as well as trigger an effect.
//To assert that an effect returns the right observable stream, we can use
// Rx Marbles.
import { Observable } from 'rxjs';
import { hot, cold } from 'jasmine-marbles';

import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { HttpClient } from '@angular/common/http';

import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { DataPersistence } from '@nrwl/angular';
import {
  LoadWeightValueConfigListingPayload,
  WeightValueConfigListingResult,
  WeightValueConfigDetails,
  BasedWeightValueConfig,
  DataWeightValueConfig,
  RuleDetailsWeightValueConfig,
  ConfigTypeEnum
} from '@poss-web/shared/models';

import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { GRNWeightValueConfigEffect } from './weight-value-config.effect';
import { GRNWeightValueConfigService } from '../weight-value-config.service';

import { FileDownloadService } from '@poss-web/shared/util-common';
import {
  SearchWeightValueConfigListingFailure,
  SearchWeightValueConfigListing,
  SearchWeightValueConfigListingSuccess,
  EditWeightValueConfigDetailsSuccess,
  EditWeightValueConfigDetailsFailure,
  EditWeightValueConfigDetails,
  LoadWeightValueConfigListing,
  LoadWeightValueConfigListingSuccess,
  LoadWeightValueConfigListingFailure,
  LoadWeightValueConfigDetails,
  LoadWeightValueConfigDetailsSuccess,
  LoadWeightValueConfigDetailsFailure,
  SaveWeightValueConfigDetails,
  SaveWeightValueConfigDetailsSuccess,
  SaveWeightValueConfigDetailsFailure,
  LoadMappedLocationsCount,
  LoadMappedLocationsCountSuccess,
  LoadMappedLocationsCountFailure
} from './weight-value-config.actions';

describe('GRNWeightValueConfigEffect Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: GRNWeightValueConfigEffect;
  const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'httpClient',
    ['get', 'post', 'patch']
  );
  const initialState = {};
  let weightValueConfigService = jasmine.createSpyObj<
    GRNWeightValueConfigService
  >('GRNWeightValueConfigService', [
    'getWeightValueConfigList',
    'getWeightValueConfigSearch',
    'getWeightValueConfigDetails',
    'saveWeightValueConfigDetails',
    'editWeightValueConfigDetails',
    'getMappedLocationsCount'
  ]);
  const fileDownloadService = jasmine.createSpyObj<FileDownloadService>([
    'getErrorResponse'
  ]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GRNWeightValueConfigEffect,
        DataPersistence,
        provideMockStore({ initialState }),
        provideMockActions(() => actions$),
        {
          provide: POSS_WEB_API_URL,
          useValue: ''
        },

        {
          provide: HttpClient,
          useValue: httpClientSpy
        },
        {
          provide: FileDownloadService,
          useValue: fileDownloadService
        },

        {
          provide: GRNWeightValueConfigService,
          useValue: {
            getWeightValueConfigList: jasmine.createSpy(),
            getWeightValueConfigSearch: jasmine.createSpy(),
            getWeightValueConfigDetails: jasmine.createSpy(),
            saveWeightValueConfigDetails: jasmine.createSpy(),
            editWeightValueConfigDetails: jasmine.createSpy(),
            getMappedLocationsCount: jasmine.createSpy()
          }
        }
      ]
    });

    effect = TestBed.inject(GRNWeightValueConfigEffect);
    weightValueConfigService = TestBed.inject<any>(GRNWeightValueConfigService);
  });

  describe('loadWeightValueConfigListing', () => {
    it('should return a stream with weight value config list', () => {
      const payload: LoadWeightValueConfigListingPayload = {
        pageIndex: 1,
        pageSize: 10
      };
      const weightValueConfigListing: WeightValueConfigDetails[] = [];
      const res: WeightValueConfigListingResult = {
        results: weightValueConfigListing,
        pageNumber: 1,
        pageSize: 10,
        totalPages: 10,
        totalElements: 1
      };

      const action = new LoadWeightValueConfigListing(payload);
      const outcome = new LoadWeightValueConfigListingSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      weightValueConfigService.getWeightValueConfigList.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadWeightValueConfigListing$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: LoadWeightValueConfigListingPayload = {
        pageIndex: 1,
        pageSize: 10
      };

      const action = new LoadWeightValueConfigListing(payload);
      const error = new Error('some error');
      const outcome = new LoadWeightValueConfigListingFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      weightValueConfigService.getWeightValueConfigList.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.loadWeightValueConfigListing$).toBeObservable(expected);
    });
  });

  describe('searchWeightValueConfigListing', () => {
    it('should return a stream with weight value config ', () => {
      const payload = 'TEST';

      const weightValueConfigListing: WeightValueConfigDetails[] = [];
      const res: WeightValueConfigListingResult = {
        results: weightValueConfigListing,
        pageNumber: 1,
        pageSize: 10,
        totalPages: 10,
        totalElements: 1
      };

      const action = new SearchWeightValueConfigListing(payload);
      const outcome = new SearchWeightValueConfigListingSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      weightValueConfigService.getWeightValueConfigSearch.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.searchWeightValueConfigListing$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload = 'TEST';

      const action = new SearchWeightValueConfigListing(payload);
      const error = new Error('some error');
      const outcome = new SearchWeightValueConfigListingFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      weightValueConfigService.getWeightValueConfigSearch.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.searchWeightValueConfigListing$).toBeObservable(expected);
    });
  });
  describe('loadWeightValueConfigDetails', () => {
    it('should return a stream with weight value config details', () => {
      const payload = 'test';
      const weightBased: BasedWeightValueConfig[] = [
        {
          rowId: '1',
          fromRange: '100',
          toRange: '200',
          toleranceAllowed: '1',
          tolerancePercent: '1',
          toleranceValue: '1'
        }
      ];
      const valueBased: BasedWeightValueConfig[] = [
        {
          rowId: '1',
          fromRange: '100',
          toRange: '200',
          toleranceAllowed: '1',
          tolerancePercent: '1',
          toleranceValue: '1'
        }
      ];
      const data: DataWeightValueConfig = {
        weightBased,
        valueBased
      };

      const ruleDetailsWeightValueConfig: RuleDetailsWeightValueConfig = {
        type: ConfigTypeEnum.GRN_TOLERANCE_CONFIG,
        data
      };

      const res: WeightValueConfigDetails = {
        ruleDetails: ruleDetailsWeightValueConfig,
        description: 'description',
        ruleId: 1,
        ruleType: ConfigTypeEnum.GRN_TOLERANCE_CONFIG,
        isActive: true
      };

      const action = new LoadWeightValueConfigDetails(payload);
      const outcome = new LoadWeightValueConfigDetailsSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      weightValueConfigService.getWeightValueConfigDetails.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadWeightValueConfigDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload = 'test';

      const action = new LoadWeightValueConfigDetails(payload);
      const error = new Error('some error');
      const outcome = new LoadWeightValueConfigDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      weightValueConfigService.getWeightValueConfigDetails.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.loadWeightValueConfigDetails$).toBeObservable(expected);
    });
  });

  describe('saveWeightValueConfigDetails', () => {
    it('should return a stream with SaveWeightValueConfigDetailsSuccess', () => {
      const weightBased: BasedWeightValueConfig[] = [
        {
          rowId: '1',
          fromRange: '100',
          toRange: '200',
          toleranceAllowed: '1',
          tolerancePercent: '1',
          toleranceValue: '1'
        }
      ];
      const valueBased: BasedWeightValueConfig[] = [
        {
          rowId: '1',
          fromRange: '100',
          toRange: '200',
          toleranceAllowed: '1',
          tolerancePercent: '1',
          toleranceValue: '1'
        }
      ];
      const data: DataWeightValueConfig = {
        weightBased,
        valueBased
      };

      const ruleDetailsWeightValueConfig: RuleDetailsWeightValueConfig = {
        type: ConfigTypeEnum.GRN_TOLERANCE_CONFIG,
        data
      };

      const payload: WeightValueConfigDetails = {
        ruleDetails: ruleDetailsWeightValueConfig,
        description: 'description',
        ruleId: 1,
        ruleType: ConfigTypeEnum.GRN_TOLERANCE_CONFIG,
        isActive: true
      };

      const action = new SaveWeightValueConfigDetails(payload);
      const outcome = new SaveWeightValueConfigDetailsSuccess(payload);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: payload });
      weightValueConfigService.saveWeightValueConfigDetails.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.saveWeightValueConfigDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const weightBased: BasedWeightValueConfig[] = [
        {
          rowId: '1',
          fromRange: '100',
          toRange: '200',
          toleranceAllowed: '1',
          tolerancePercent: '1',
          toleranceValue: '1'
        }
      ];
      const valueBased: BasedWeightValueConfig[] = [
        {
          rowId: '1',
          fromRange: '100',
          toRange: '200',
          toleranceAllowed: '1',
          tolerancePercent: '1',
          toleranceValue: '1'
        }
      ];
      const data: DataWeightValueConfig = {
        weightBased,
        valueBased
      };

      const ruleDetailsWeightValueConfig: RuleDetailsWeightValueConfig = {
        type: ConfigTypeEnum.GRN_TOLERANCE_CONFIG,
        data
      };

      const payload: WeightValueConfigDetails = {
        ruleDetails: ruleDetailsWeightValueConfig,
        description: 'description',
        ruleId: 1,
        ruleType: ConfigTypeEnum.GRN_TOLERANCE_CONFIG,
        isActive: true
      };

      const action = new SaveWeightValueConfigDetails(payload);
      const error = new Error('some error');
      const outcome = new SaveWeightValueConfigDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      weightValueConfigService.saveWeightValueConfigDetails.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.saveWeightValueConfigDetails$).toBeObservable(expected);
    });
  });

  describe('editWeightValueConfigDetails', () => {
    it('should return a stream with editWeightValueConfigDetails', () => {
      const weightBased: BasedWeightValueConfig[] = [
        {
          rowId: '1',
          fromRange: '100',
          toRange: '200',
          toleranceAllowed: '1',
          tolerancePercent: '1',
          toleranceValue: '1'
        }
      ];
      const valueBased: BasedWeightValueConfig[] = [
        {
          rowId: '1',
          fromRange: '100',
          toRange: '200',
          toleranceAllowed: '1',
          tolerancePercent: '1',
          toleranceValue: '1'
        }
      ];
      const data: DataWeightValueConfig = {
        weightBased,
        valueBased
      };

      const ruleDetailsWeightValueConfig: RuleDetailsWeightValueConfig = {
        type: ConfigTypeEnum.GRN_TOLERANCE_CONFIG,
        data
      };

      const payload: WeightValueConfigDetails = {
        ruleDetails: ruleDetailsWeightValueConfig,
        description: 'description',
        ruleId: 1,
        ruleType: ConfigTypeEnum.GRN_TOLERANCE_CONFIG,
        isActive: true
      };

      const action = new EditWeightValueConfigDetails(payload);
      const outcome = new EditWeightValueConfigDetailsSuccess(payload);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: payload });
      weightValueConfigService.editWeightValueConfigDetails.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.editWeightValueConfigDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const weightBased: BasedWeightValueConfig[] = [
        {
          rowId: '1',
          fromRange: '100',
          toRange: '200',
          toleranceAllowed: '1',
          tolerancePercent: '1',
          toleranceValue: '1'
        }
      ];
      const valueBased: BasedWeightValueConfig[] = [
        {
          rowId: '1',
          fromRange: '100',
          toRange: '200',
          toleranceAllowed: '1',
          tolerancePercent: '1',
          toleranceValue: '1'
        }
      ];
      const data: DataWeightValueConfig = {
        weightBased,
        valueBased
      };

      const ruleDetailsWeightValueConfig: RuleDetailsWeightValueConfig = {
        type: ConfigTypeEnum.GRN_TOLERANCE_CONFIG,
        data
      };

      const payload: WeightValueConfigDetails = {
        ruleDetails: ruleDetailsWeightValueConfig,
        description: 'description',
        ruleId: 1,
        ruleType: ConfigTypeEnum.GRN_TOLERANCE_CONFIG,
        isActive: true
      };

      const action = new EditWeightValueConfigDetails(payload);
      const error = new Error('some error');
      const outcome = new EditWeightValueConfigDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      weightValueConfigService.editWeightValueConfigDetails.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.editWeightValueConfigDetails$).toBeObservable(expected);
    });
  });

  describe('LoadMappedLocationsCount', () => {
    it('should fail and return an action with the error', () => {
      const payload = '1';
      const action = new LoadMappedLocationsCount(payload);
      const error = new Error('some error');
      const outcome = new LoadMappedLocationsCountFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      weightValueConfigService.getMappedLocationsCount.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.loadMappedLocationsCount$).toBeObservable(expected);
    });
  });
});
