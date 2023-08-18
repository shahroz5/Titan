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
  TEPExceptionConfig,
  TEPExceptionConfigFilter,
  TEPExceptionConfigListingPayload,
  TEPExceptiononfigListing
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';

import { TepExceptionConfigService } from '../tep-exception-config.service';
import { TepExceptionConfigEffect } from './tep-exception-config.effect';
import { TEP_EXCEPTION_CONFIG_FEATURE_NAME } from './tep-exception-config.reducer';
import {
  LoadTepExceptionConfigDetails,
  LoadTepExceptionConfigDetailsFailure,
  LoadTepExceptionConfigDetailsSuccess,
  LoadTepExceptionConfigListing,
  LoadTepExceptionConfigListingFailure,
  LoadTepExceptionConfigListingSuccess,
  LoadTepGlobalConfigListing,
  LoadTepGlobalConfigListingFailure,
  LoadTepGlobalConfigListingSuccess,
  SaveTepExceptionConfigDetails,
  SaveTepExceptionConfigDetailsFailure,
  SaveTepExceptionConfigDetailsSuccess,
  SearchTepExceptionConfigDetails,
  SearchTepExceptionConfigDetailsFailure,
  SearchTepExceptionConfigDetailsSuccess,
  UpdateTepExceptionConfigDetails,
  UpdateTepExceptionConfigDetailsFailure,
  UpdateTepExceptionConfigDetailsSuccess
} from './tep-exception-config.actons';

describe('TEP Exception Config  Effects Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: TepExceptionConfigEffect;
  const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'httpClient',
    ['get', 'post', 'patch']
  );
  const initialState = {};

  const tepExceptionConfigServiceSpy = jasmine.createSpyObj<
    TepExceptionConfigService
  >([
    'getMaxFlatTepExchangeValue',
    'getTepExceptionConfigList',
    'searchTepExceptionConfigList',
    'getTepExceptionConfigDetails',
    'saveTepExceptionConfigDetails',
    'updateTepExceptionConfigDetails'
  ]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TepExceptionConfigEffect,
        DataPersistence,
        provideMockStore({
          initialState: {
            [TEP_EXCEPTION_CONFIG_FEATURE_NAME]: initialState
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
          provide: TepExceptionConfigService,
          useValue: tepExceptionConfigServiceSpy
        }
      ]
    });

    effect = TestBed.inject(TepExceptionConfigEffect);
  });

  describe('LoadTepExceptionConfigListing', () => {
    it('should return LoadTepExceptionConfigListing', () => {
      const payload1: TEPExceptionConfigListingPayload = {
        pageIndex: 0,
        pageSize: 1
      };
      const action = new LoadTepExceptionConfigListing(payload1);

      const payload2: TEPExceptiononfigListing = {
        results: [
          {
            configId: '1',
            isActive: true,
            configDetails: {
              data: null,
              type: 'TYPE'
            },
            configType: 'TYPE',
            createdDate: 222222,
            customerMobileNos: ['3333333'],
            description: 'Desc',
            endDate: 444444,
            isOfferEnabled: true,
            itemCode: 'Code',
            offerDetails: {
              data: null,
              type: 'TYPE'
            },
            startDate: 111111
          }
        ],
        totalElements: 1
      };

      const outcome = new LoadTepExceptionConfigListingSuccess(payload2);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: payload2
      });
      tepExceptionConfigServiceSpy.getTepExceptionConfigList.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadTepExceptionConfigListing$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload1: TEPExceptionConfigListingPayload = {
        pageIndex: 0,
        pageSize: 1
      };
      const action = new LoadTepExceptionConfigListing(payload1);
      const error = new Error('some error');
      const outcome = new LoadTepExceptionConfigListingFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      tepExceptionConfigServiceSpy.getTepExceptionConfigList.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.loadTepExceptionConfigListing$).toBeObservable(expected);
    });
  });

  describe('SearchTepExceptionConfigDetails Details', () => {
    it('should return a details of TEP Exception Config for SearchTepExceptionConfigDetailsSuccess', () => {
      const payload1: TEPExceptionConfigFilter = {
        configName: 'Name',
        variantCode: 'Code'
      };

      const payload2: TEPExceptiononfigListing = {
        results: [
          {
            configId: '1',
            isActive: true,
            configDetails: {
              data: null,
              type: 'TYPE'
            },
            configType: 'TYPE',
            createdDate: 222222,
            customerMobileNos: ['3333333'],
            description: 'Desc',
            endDate: 444444,
            isOfferEnabled: true,
            itemCode: 'Code',
            offerDetails: {
              data: null,
              type: 'TYPE'
            },
            startDate: 111111
          }
        ],
        totalElements: 1
      };

      const action = new SearchTepExceptionConfigDetails(payload1);
      const outcome = new SearchTepExceptionConfigDetailsSuccess(payload2);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: payload2
      });
      tepExceptionConfigServiceSpy.searchTepExceptionConfigList.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.searchTepExceptionConfigDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error for SearchTepExceptionConfigDetailsFailure', () => {
      const payload1: TEPExceptionConfigFilter = {
        configName: 'Name',
        variantCode: 'Code'
      };

      const action = new SearchTepExceptionConfigDetails(payload1);
      const error = new Error('some error');
      const outcome = new SearchTepExceptionConfigDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      tepExceptionConfigServiceSpy.searchTepExceptionConfigList.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.searchTepExceptionConfigDetails$).toBeObservable(expected);
    });
  });

  describe('LoadTepExceptionConfigDetails Details', () => {
    it('should return a details of TEP Exception Config for LoadTepExceptionConfigDetailsSuccess', () => {
      const payload1: string = 'Code';

      const payload2: TEPExceptionConfig = {
        configId: '1',
        isActive: true,
        configDetails: {
          data: null,
          type: 'TYPE'
        },
        configType: 'TYPE',
        createdDate: 222222,
        customerMobileNos: ['3333333'],
        description: 'Desc',
        endDate: 444444,
        isOfferEnabled: true,
        itemCode: 'Code',
        offerDetails: {
          data: null,
          type: 'TYPE'
        },
        startDate: 111111
      };

      const action = new LoadTepExceptionConfigDetails(payload1);
      const outcome = new LoadTepExceptionConfigDetailsSuccess(payload2);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: payload2
      });
      tepExceptionConfigServiceSpy.getTepExceptionConfigDetails.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadTepExceptionConfigDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error for LoadTepExceptionConfigDetailsFailure', () => {
      const payload1: string = 'Code';

      const action = new LoadTepExceptionConfigDetails(payload1);
      const error = new Error('some error');
      const outcome = new LoadTepExceptionConfigDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      tepExceptionConfigServiceSpy.getTepExceptionConfigDetails.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.loadTepExceptionConfigDetails$).toBeObservable(expected);
    });
  });

  describe('SaveTepExceptionConfigDetails Details', () => {
    it('should return a details of TEP Exception Config for SaveTepExceptionConfigDetailsSuccess', () => {
      const payload: TEPExceptionConfig = {
        configId: '1',
        isActive: true,
        configDetails: {
          data: null,
          type: 'TYPE'
        },
        configType: 'TYPE',
        createdDate: 222222,
        customerMobileNos: ['3333333'],
        description: 'Desc',
        endDate: 444444,
        isOfferEnabled: true,
        itemCode: 'Code',
        offerDetails: {
          data: null,
          type: 'TYPE'
        },
        startDate: 111111
      };

      const action = new SaveTepExceptionConfigDetails(payload);
      const outcome = new SaveTepExceptionConfigDetailsSuccess(payload);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: payload
      });
      tepExceptionConfigServiceSpy.saveTepExceptionConfigDetails.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.saveTepExceptionConfigDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error for SaveTepExceptionConfigDetailsFailure', () => {
      const payload: TEPExceptionConfig = {
        configId: '1',
        isActive: true,
        configDetails: {
          data: null,
          type: 'TYPE'
        },
        configType: 'TYPE',
        createdDate: 222222,
        customerMobileNos: ['3333333'],
        description: 'Desc',
        endDate: 444444,
        isOfferEnabled: true,
        itemCode: 'Code',
        offerDetails: {
          data: null,
          type: 'TYPE'
        },
        startDate: 111111
      };

      const action = new SaveTepExceptionConfigDetails(payload);
      const error = new Error('some error');
      const outcome = new SaveTepExceptionConfigDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      tepExceptionConfigServiceSpy.saveTepExceptionConfigDetails.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.saveTepExceptionConfigDetails$).toBeObservable(expected);
    });
  });

  describe('UpdateTepExceptionConfigDetails Details', () => {
    it('should return a details of TEP Exception Config for UpdateTepExceptionConfigDetailsSuccess', () => {
      const payload: TEPExceptionConfig = {
        configId: '1',
        isActive: true,
        configDetails: {
          data: null,
          type: 'TYPE'
        },
        configType: 'TYPE',
        createdDate: 222222,
        customerMobileNos: ['3333333'],
        description: 'Desc',
        endDate: 444444,
        isOfferEnabled: true,
        itemCode: 'Code',
        offerDetails: {
          data: null,
          type: 'TYPE'
        },
        startDate: 111111
      };

      const action = new UpdateTepExceptionConfigDetails(payload);
      const outcome = new UpdateTepExceptionConfigDetailsSuccess(payload);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: payload
      });
      tepExceptionConfigServiceSpy.updateTepExceptionConfigDetails.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.updateTepExceptionConfigDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error for UpdateTepExceptionConfigDetailsFailure', () => {
      const payload: TEPExceptionConfig = {
        configId: '1',
        isActive: true,
        configDetails: {
          data: null,
          type: 'TYPE'
        },
        configType: 'TYPE',
        createdDate: 222222,
        customerMobileNos: ['3333333'],
        description: 'Desc',
        endDate: 444444,
        isOfferEnabled: true,
        itemCode: 'Code',
        offerDetails: {
          data: null,
          type: 'TYPE'
        },
        startDate: 111111
      };

      const action = new UpdateTepExceptionConfigDetails(payload);
      const error = new Error('some error');
      const outcome = new UpdateTepExceptionConfigDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      tepExceptionConfigServiceSpy.updateTepExceptionConfigDetails.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.updateTepExceptionConfigDetails$).toBeObservable(expected);
    });
  });

  describe('LoadTepGlobalConfigListing Details', () => {
    it('should return a details of TEP Exception Config for LoadTepGlobalConfigListingSuccess', () => {
      const action = new LoadTepGlobalConfigListing();
      const outcome = new LoadTepGlobalConfigListingSuccess(1);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: 1
      });
      tepExceptionConfigServiceSpy.getMaxFlatTepExchangeValue.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadMaxFlatTepExchangeValue$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error for LoadTepGlobalConfigListingFailure', () => {
      const action = new LoadTepGlobalConfigListing();
      const error = new Error('some error');
      const outcome = new LoadTepGlobalConfigListingFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      tepExceptionConfigServiceSpy.getMaxFlatTepExchangeValue.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.loadMaxFlatTepExchangeValue$).toBeObservable(expected);
    });
  });
});
