import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { DataPersistence } from '@nrwl/angular';
import { hot, cold } from 'jasmine-marbles';
import {
  POSS_WEB_API_URL,
  POSS_WEB_CACHING_STRATEGY
} from '@poss-web/shared/util-config';
import {
  TEPProductGroupConfigDetails,
  TEPProductGroupConfigListing,
  TEPProductGroupConfigListingPayload,
  TEPValidationConfigListing,
  TEPValidationConfigListingPayload,
  TEPValidationConfigResult
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';

import { TepProductGroupConfigService } from '../tep-product-group-config.service';
import { TepProductGroupConfigEffect } from './tep-product-group-config.effect';
import { TEP_PRODUCT_GROUP_CONFIG_FEATURE_NAME } from './tep-product-group-config.reducer';

import {
  LoadTepProductGroupConfigDetails,
  LoadTepProductGroupConfigDetailsFailure,
  LoadTepProductGroupConfigDetailsSuccess,
  LoadTepProductGroupConfigListing,
  LoadTepProductGroupConfigListingFailure,
  LoadTepProductGroupConfigListingSuccess,
  SaveTepProductGroupConfigDetails,
  SaveTepProductGroupConfigDetailsFailure,
  SaveTepProductGroupConfigDetailsSuccess,
  SearchTepProductConfigDetails,
  SearchTepProductConfigDetailsFailure,
  SearchTepProductConfigDetailsSuccess,
  UpdateTepProductGroupConfigDetails,
  UpdateTepProductGroupConfigDetailsFailure,
  UpdateTepProductGroupConfigDetailsSuccess
} from './tep-product-group-config.actons';

describe('TEP Product Group Config  Effects Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: TepProductGroupConfigEffect;
  const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'httpClient',
    ['get', 'post', 'patch']
  );
  const initialState = {};

  const tepProductGroupConfigServiceSpy = jasmine.createSpyObj<
    TepProductGroupConfigService
  >([
    'getTepProductGroupConfigList',
    'searchTepProductGroupConfigList',
    'getTepProductGroupConfigDetails',
    'saveTepProductGroupConfigDetails',
    'updateTepProductGroupConfigDetails',
    'getTepProductGroupMappingList',
    'searchTepProductGroupMappingList',
    'saveTepExceptionMappingDetails'
  ]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TepProductGroupConfigEffect,
        DataPersistence,
        provideMockStore({
          initialState: {
            [TEP_PRODUCT_GROUP_CONFIG_FEATURE_NAME]: initialState
          }
        }),
        provideMockActions(() => actions$),
        {
          provide: POSS_WEB_API_URL,
          useValue: ''
        },
        {
          provide: POSS_WEB_CACHING_STRATEGY,
          useValue: []
        },
        {
          provide: HttpClient,
          useValue: httpClientSpy
        },
        {
          provide: TepProductGroupConfigService,
          useValue: tepProductGroupConfigServiceSpy
        }
      ]
    });

    effect = TestBed.inject(TepProductGroupConfigEffect);
  });

  describe('LoadTepProductGroupConfigListing', () => {
    it('should return LoadTepProductGroupConfigListing', () => {
      const payload1: TEPProductGroupConfigListingPayload = {
        pageIndex: 0,
        pageSize: 10
      };
      const action = new LoadTepProductGroupConfigListing(payload1);

      const payload2: TEPProductGroupConfigListing = {
        results: [
          {
            configDetails: {
              data: 'Data',
              type: 'Type'
            },
            configId: 'ConfigId',
            configType: 'ConfigType',
            customerMobileNos: ['123', '456'],
            description: 'Desc',
            isActive: true,
            offerDetails: {
              data: 'Data',
              type: 'Type'
            }
          }
        ],
        totalElements: 1
      };

      const outcome = new LoadTepProductGroupConfigListingSuccess(payload2);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: payload2
      });
      tepProductGroupConfigServiceSpy.getTepProductGroupConfigList.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadTepProductGroupConfigListing$).toBeObservable(
        expected$
      );
    });

    it('should fail and return an action with the error', () => {
      const payload1: TEPProductGroupConfigListingPayload = {
        pageIndex: 0,
        pageSize: 10
      };
      const action = new LoadTepProductGroupConfigListing(payload1);
      const error = new Error('some error');
      const outcome = new LoadTepProductGroupConfigListingFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      tepProductGroupConfigServiceSpy.getTepProductGroupConfigList.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.loadTepProductGroupConfigListing$).toBeObservable(expected);
    });
  });

  describe('SearchTepProductConfigDetails Details', () => {
    it('should return a details of TEP Exception Config for SearchTepProductConfigDetailsSuccess', () => {
      const payload2: TEPProductGroupConfigListing = {
        results: [
          {
            configDetails: {
              data: 'Data',
              type: 'Type'
            },
            configId: 'ConfigId',
            configType: 'ConfigType',
            customerMobileNos: ['123', '456'],
            description: 'Desc',
            isActive: true,
            offerDetails: {
              data: 'Data',
              type: 'Type'
            }
          }
        ],
        totalElements: 1
      };

      const payload1: string = 'Code';
      const action = new SearchTepProductConfigDetails(payload1);
      const outcome = new SearchTepProductConfigDetailsSuccess(payload2);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: payload2
      });
      tepProductGroupConfigServiceSpy.searchTepProductGroupConfigList.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.searchTepProductConfigDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error for SearchTepProductConfigDetailsFailure', () => {
      const payload1: string = 'Code';
      const action = new SearchTepProductConfigDetails(payload1);

      const error = new Error('some error');
      const outcome = new SearchTepProductConfigDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      tepProductGroupConfigServiceSpy.searchTepProductGroupConfigList.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.searchTepProductConfigDetails$).toBeObservable(expected);
    });
  });

  describe('LoadTepProductGroupConfigDetails Details', () => {
    it('should return a details of TEP Exception Config for LoadTepProductGroupConfigDetailsSuccess', () => {
      const payload1: string = 'Code';
      const action = new LoadTepProductGroupConfigDetails(payload1);

      const payload2: TEPProductGroupConfigDetails = {
        configDetails: {
          data: 'Data',
          type: 'Type'
        },
        configId: 'ConfigId',
        configType: 'ConfigType',
        customerMobileNos: ['123', '456'],
        description: 'Desc',
        isActive: true,
        offerDetails: {
          data: 'Data',
          type: 'Type'
        }
      };
      const outcome = new LoadTepProductGroupConfigDetailsSuccess(payload2);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: payload2
      });
      tepProductGroupConfigServiceSpy.getTepProductGroupConfigDetails.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadTepProductGroupConfigDetails$).toBeObservable(
        expected$
      );
    });

    it('should fail and return an action with the error for LoadTepProductGroupConfigDetailsFailure', () => {
      const payload1: string = 'Code';

      const action = new LoadTepProductGroupConfigDetails(payload1);
      const error = new Error('some error');
      const outcome = new LoadTepProductGroupConfigDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      tepProductGroupConfigServiceSpy.getTepProductGroupConfigDetails.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.loadTepProductGroupConfigDetails$).toBeObservable(expected);
    });
  });

  describe('SaveTepProductGroupConfigDetails Details', () => {
    it('should return a details of TEP Exception Config for SaveTepProductGroupConfigDetailsSuccess', () => {
      const payload: TEPProductGroupConfigDetails = {
        configDetails: {
          data: 'Data',
          type: 'Type'
        },
        configId: 'ConfigId',
        configType: 'ConfigType',
        customerMobileNos: ['123', '456'],
        description: 'Desc',
        isActive: true,
        offerDetails: {
          data: 'Data',
          type: 'Type'
        }
      };

      const action = new SaveTepProductGroupConfigDetails(payload);
      const outcome = new SaveTepProductGroupConfigDetailsSuccess(payload);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: payload
      });
      tepProductGroupConfigServiceSpy.saveTepProductGroupConfigDetails.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.saveTepProductGroupConfigDetails$).toBeObservable(
        expected$
      );
    });

    it('should fail and return an action with the error for SaveTepProductGroupConfigDetailsFailure', () => {
      const payload: TEPProductGroupConfigDetails = {
        configDetails: {
          data: 'Data',
          type: 'Type'
        },
        configId: 'ConfigId',
        configType: 'ConfigType',
        customerMobileNos: ['123', '456'],
        description: 'Desc',
        isActive: true,
        offerDetails: {
          data: 'Data',
          type: 'Type'
        }
      };

      const action = new SaveTepProductGroupConfigDetails(payload);
      const error = new Error('some error');
      const outcome = new SaveTepProductGroupConfigDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      tepProductGroupConfigServiceSpy.saveTepProductGroupConfigDetails.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.saveTepProductGroupConfigDetails$).toBeObservable(expected);
    });
  });

  describe('UpdateTepProductGroupConfigDetails Details', () => {
    it('should return a details of TEP Exception Config for UpdateTepProductGroupConfigDetailsSuccess', () => {
      const payload: TEPProductGroupConfigDetails = {
        configDetails: {
          data: 'Data',
          type: 'Type'
        },
        configId: 'ConfigId',
        configType: 'ConfigType',
        customerMobileNos: ['123', '456'],
        description: 'Desc',
        isActive: true,
        offerDetails: {
          data: 'Data',
          type: 'Type'
        }
      };

      const action = new UpdateTepProductGroupConfigDetails(payload);
      const outcome = new UpdateTepProductGroupConfigDetailsSuccess(payload);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: payload
      });
      tepProductGroupConfigServiceSpy.updateTepProductGroupConfigDetails.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.updateTepProductGroupConfigDetails$).toBeObservable(
        expected$
      );
    });

    it('should fail and return an action with the error for UpdateTepProductGroupConfigDetailsFailure', () => {
      const payload: TEPProductGroupConfigDetails = {
        configDetails: {
          data: 'Data',
          type: 'Type'
        },
        configId: 'ConfigId',
        configType: 'ConfigType',
        customerMobileNos: ['123', '456'],
        description: 'Desc',
        isActive: true,
        offerDetails: {
          data: 'Data',
          type: 'Type'
        }
      };

      const action = new UpdateTepProductGroupConfigDetails(payload);
      const error = new Error('some error');
      const outcome = new UpdateTepProductGroupConfigDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      tepProductGroupConfigServiceSpy.updateTepProductGroupConfigDetails.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.updateTepProductGroupConfigDetails$).toBeObservable(
        expected
      );
    });
  });
});
