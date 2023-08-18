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
  TEPValidationConfigListing,
  TEPValidationConfigListingPayload,
  TEPValidationConfigResult
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';

import { TepValidationConfigService } from '../tep-validation-config.service';
import { TepValidationConfigEffect } from './tep-validation-config.effect';
import { TEP_VALIDATION_CONFIG_FEATURE_NAME } from './tep-validation-config.reducer';

import {
  LoadTepValidationConfigDetails,
  LoadTepValidationConfigDetailsFailure,
  LoadTepValidationConfigDetailsSuccess,
  LoadTepValidationConfigListing,
  LoadTepValidationConfigListingFailure,
  LoadTepValidationConfigListingSuccess,
  SaveTepValidationConfigDetails,
  SaveTepValidationConfigDetailsFailure,
  SaveTepValidationConfigDetailsSuccess,
  SearchTepValidationConfigDetails,
  SearchTepValidationConfigDetailsFailure,
  SearchTepValidationConfigDetailsSuccess,
  UpdateTepValidationConfigDetails,
  UpdateTepValidationConfigDetailsFailure,
  UpdateTepValidationConfigDetailsSuccess
} from './tep-validation-config.actons';

describe('TEP Exception Config  Effects Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: TepValidationConfigEffect;
  const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'httpClient',
    ['get', 'post', 'patch']
  );
  const initialState = {};

  const tepExceptionConfigServiceSpy = jasmine.createSpyObj<
    TepValidationConfigService
  >([
    'getTepValidationConfigList',
    'searchTepValidationConfigList',
    'getTepValidationConfigDetails',
    'saveTepValidationConfigDetails',
    'updateTepValidationConfigDetails',
    'updateTepExceptionConfigDetails'
  ]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TepValidationConfigEffect,
        DataPersistence,
        provideMockStore({
          initialState: {
            [TEP_VALIDATION_CONFIG_FEATURE_NAME]: initialState
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
          provide: TepValidationConfigService,
          useValue: tepExceptionConfigServiceSpy
        }
      ]
    });

    effect = TestBed.inject(TepValidationConfigEffect);
  });

  describe('LoadTepValidationConfigListing', () => {
    it('should return LoadTepValidationConfigListing', () => {
      const payload1: TEPValidationConfigListingPayload = {
        pageIndex: 0,
        pageSize: 1
      };
      const action = new LoadTepValidationConfigListing(payload1);

      const payload2: TEPValidationConfigListing = {
        results: [
          {
            configDetails: {
              data: {
                fvtCNCancellationDeductionPercent: 10,
                isAnnexurePrintingAllowed: true,
                isFVTCNCancellationAllowed: true,
                isInterBrandCashRefundAllowed: true,
                tepCancellationDays: 1
              },
              type: 'TYPE'
            },
            configId: '1',
            configType: 'Type',
            description: 'Desc',
            isActive: true,
            offerDetails: null
          }
        ],
        totalElements: 1
      };

      const outcome = new LoadTepValidationConfigListingSuccess(payload2);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: payload2
      });
      tepExceptionConfigServiceSpy.getTepValidationConfigList.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadTepValidationConfigListing$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload1: TEPValidationConfigListingPayload = {
        pageIndex: 0,
        pageSize: 1
      };
      const action = new LoadTepValidationConfigListing(payload1);
      const error = new Error('some error');
      const outcome = new LoadTepValidationConfigListingFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      tepExceptionConfigServiceSpy.getTepValidationConfigList.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.loadTepValidationConfigListing$).toBeObservable(expected);
    });
  });

  describe('SearchTepValidationConfigDetails Details', () => {
    it('should return a details of TEP Exception Config for SearchTepValidationConfigDetailsSuccess', () => {
      const payload2: TEPValidationConfigListing = {
        results: [
          {
            configDetails: {
              data: {
                fvtCNCancellationDeductionPercent: 10,
                isAnnexurePrintingAllowed: true,
                isFVTCNCancellationAllowed: true,
                isInterBrandCashRefundAllowed: true,
                tepCancellationDays: 1
              },
              type: 'TYPE'
            },
            configId: '1',
            configType: 'Type',
            description: 'Desc',
            isActive: true,
            offerDetails: null
          }
        ],
        totalElements: 1
      };

      const payload1: string = 'Code';
      const action = new SearchTepValidationConfigDetails(payload1);
      const outcome = new SearchTepValidationConfigDetailsSuccess(payload2);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: payload2
      });
      tepExceptionConfigServiceSpy.searchTepValidationConfigList.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.searchTepValidationDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error for SearchTepValidationConfigDetailsFailure', () => {
      const payload1: string = 'Code';
      const action = new SearchTepValidationConfigDetails(payload1);

      const error = new Error('some error');
      const outcome = new SearchTepValidationConfigDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      tepExceptionConfigServiceSpy.searchTepValidationConfigList.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.searchTepValidationDetails$).toBeObservable(expected);
    });
  });

  describe('LoadTepValidationConfigDetails Details', () => {
    it('should return a details of TEP Exception Config for LoadTepValidationConfigDetailsSuccess', () => {
      const payload1: string = 'Code';
      const action = new LoadTepValidationConfigDetails(payload1);

      const payload2: TEPValidationConfigResult = {
        configDetails: {
          data: {
            fvtCNCancellationDeductionPercent: 10,
            isAnnexurePrintingAllowed: true,
            isFVTCNCancellationAllowed: true,
            isInterBrandCashRefundAllowed: true,
            tepCancellationDays: 1
          },
          type: 'TYPE'
        },
        configId: '1',
        configType: 'Type',
        description: 'Desc',
        isActive: true,
        offerDetails: null
      };
      const outcome = new LoadTepValidationConfigDetailsSuccess(payload2);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: payload2
      });
      tepExceptionConfigServiceSpy.getTepValidationConfigDetails.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadTepValidationConfigDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error for LoadTepValidationConfigDetailsFailure', () => {
      const payload1: string = 'Code';

      const action = new LoadTepValidationConfigDetails(payload1);
      const error = new Error('some error');
      const outcome = new LoadTepValidationConfigDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      tepExceptionConfigServiceSpy.getTepValidationConfigDetails.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.loadTepValidationConfigDetails$).toBeObservable(expected);
    });
  });

  describe('SaveTepExceptionConfigDetails Details', () => {
    it('should return a details of TEP Exception Config for SaveTepExceptionConfigDetailsSuccess', () => {
      const payload: TEPValidationConfigResult = {
        configDetails: {
          data: {
            fvtCNCancellationDeductionPercent: 10,
            isAnnexurePrintingAllowed: true,
            isFVTCNCancellationAllowed: true,
            isInterBrandCashRefundAllowed: true,
            tepCancellationDays: 1
          },
          type: 'TYPE'
        },
        configId: '1',
        configType: 'Type',
        description: 'Desc',
        isActive: true,
        offerDetails: null
      };

      const action = new SaveTepValidationConfigDetails(payload);
      const outcome = new SaveTepValidationConfigDetailsSuccess(payload);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: payload
      });
      tepExceptionConfigServiceSpy.saveTepValidationConfigDetails.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.saveTepValidationConfigDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error for SaveTepValidationConfigDetailsFailure', () => {
      const payload: TEPValidationConfigResult = {
        configDetails: {
          data: {
            fvtCNCancellationDeductionPercent: 10,
            isAnnexurePrintingAllowed: true,
            isFVTCNCancellationAllowed: true,
            isInterBrandCashRefundAllowed: true,
            tepCancellationDays: 1
          },
          type: 'TYPE'
        },
        configId: '1',
        configType: 'Type',
        description: 'Desc',
        isActive: true,
        offerDetails: null
      };

      const action = new SaveTepValidationConfigDetails(payload);
      const error = new Error('some error');
      const outcome = new SaveTepValidationConfigDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      tepExceptionConfigServiceSpy.saveTepValidationConfigDetails.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.saveTepValidationConfigDetails$).toBeObservable(expected);
    });
  });

  describe('UpdateTepValidationConfigDetails Details', () => {
    it('should return a details of TEP Exception Config for UpdateTepValidationConfigDetailsSuccess', () => {
      const payload: TEPValidationConfigResult = {
        configDetails: {
          data: {
            fvtCNCancellationDeductionPercent: 10,
            isAnnexurePrintingAllowed: true,
            isFVTCNCancellationAllowed: true,
            isInterBrandCashRefundAllowed: true,
            tepCancellationDays: 1
          },
          type: 'TYPE'
        },
        configId: '1',
        configType: 'Type',
        description: 'Desc',
        isActive: true,
        offerDetails: null
      };

      const action = new UpdateTepValidationConfigDetails(payload);
      const outcome = new UpdateTepValidationConfigDetailsSuccess(payload);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: payload
      });
      tepExceptionConfigServiceSpy.updateTepValidationConfigDetails.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.updateTepValidationConfigDetails$).toBeObservable(
        expected$
      );
    });

    it('should fail and return an action with the error for UpdateTepValidationConfigDetailsFailure', () => {
      const payload: TEPValidationConfigResult = {
        configDetails: {
          data: {
            fvtCNCancellationDeductionPercent: 10,
            isAnnexurePrintingAllowed: true,
            isFVTCNCancellationAllowed: true,
            isInterBrandCashRefundAllowed: true,
            tepCancellationDays: 1
          },
          type: 'TYPE'
        },
        configId: '1',
        configType: 'Type',
        description: 'Desc',
        isActive: true,
        offerDetails: null
      };

      const action = new UpdateTepValidationConfigDetails(payload);
      const error = new Error('some error');
      const outcome = new UpdateTepValidationConfigDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      tepExceptionConfigServiceSpy.updateTepValidationConfigDetails.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.updateTepValidationConfigDetails$).toBeObservable(expected);
    });
  });
});
