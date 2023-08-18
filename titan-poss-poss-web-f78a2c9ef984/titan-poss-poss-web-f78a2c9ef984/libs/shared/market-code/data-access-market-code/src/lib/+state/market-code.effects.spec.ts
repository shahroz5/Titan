import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { DataPersistence } from '@nrwl/angular';
import {
  LoadMarketCodeListingSuccessPayload,
  LoadMarketCodesListingPayload,
  MarketCodeDetails,
  MarketMaterialFactors,
  SaveMarketCodeDetailsPayload,
  SaveMarketMaterialFactorsPayload,
  UpdateMarketCodeDetailsPayload
} from '@poss-web/shared/models';
import { Observable } from 'rxjs';
import { MarketCodeService } from '../market-code.service';
import { MarketCodeEffects } from './market-code.effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { hot, cold } from 'jasmine-marbles';
import {
  POSS_WEB_API_URL,
  POSS_WEB_CACHING_STRATEGY
} from '@poss-web/shared/util-config';
import {
  LoadMarketCodeDetails,
  LoadMarketCodeDetailsBasedOnMarketCode,
  LoadMarketCodeDetailsBasedOnMarketCodeFailure,
  LoadMarketCodeDetailsBasedOnMarketCodeSuccess,
  LoadMarketCodeDetailsFailure,
  LoadMarketCodeDetailsSuccess,
  SaveMarketCodeDetails,
  SaveMarketCodeDetailsFailure,
  SaveMarketCodeDetailsSuccess,
  SaveMarketMaterialFacatorsFailure,
  SaveMarketMaterialFacatorsSuccess,
  SaveMarketMaterialFactors,
  SearchMarketCode,
  SearchMarketCodeFailure,
  SearchMarketCodeSuccess,
  UpdateMarketCodeDetails,
  UpdateMarketCodeDetailsFailure,
  UpdateMarketCodeDetailsSuccess,
  UpdateMarketMaterialFactors,
  UpdateMarketMaterialFactorsFailure,
  UpdateMarketMaterialFactorsSuccess
} from './market-code.actions';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';

describe('Market Code Effects Testing Suite', () => {
  const marketCodeServiceSpy = jasmine.createSpyObj<MarketCodeService>([
    'getMarketDetails',
    'saveMarketCodeDetails',
    'updateMarketCodeDetails',
    'saveMarketMaterialFacators',
    'updateMarketMaterialFacators',
    'updateCourierStatus',
    'loadMaterialFacatorsBasedOnMarketCode',
    'getSearchResult',
    'getMarketDetailsBasedOnMarketCode'
  ]);
  const marketCodeDetails: MarketCodeDetails[] = [
    {
      marketCode: 'MAR',
      description: 'MAR',
      isActive: true,
      marketMaterialFacators: {}
    }
  ];
  const saveMarketMaterialFactorsSuccess: MarketMaterialFactors = {
    goldAddAmount: '123',
    goldDeductAmount: '123',
    goldMarkupFactor: '123',
    silverAddAmount: '123',
    silverDeductAmount: '123',
    silverMarkupFactor: '133',
    platinumAddAmount: '123',
    platinumDeductAmount: '123',
    platinumMarkupFactor: '123',
    marketCode: 'MAR',
    description: 'MAR',
    isActive: true,
    f1MarkupFactor: '123',
    f2MarkupFactor: '123'
  };

  const saveMarketCodeDetails: SaveMarketCodeDetailsPayload = {
    marketCode: 'MAR',
    description: 'MAR',
    isActive: true
  };
  const saveMarketMaterialFactors: SaveMarketMaterialFactorsPayload = {
    marketCode: 'MAR',
    marketMarkupFactors: [
      {
        addAmount: 10,
        deductAmount: 11,
        markupFactor: 12,
        metalTypeCode: 'gold'
      }
    ]
  };
  const dummyMarketCodeListing: LoadMarketCodeListingSuccessPayload = {
    marketCodeListing: marketCodeDetails,
    totalElements: 1
  };
  const updateMarketCodeDetails: UpdateMarketCodeDetailsPayload = {
    marketCode: 'MAR',
    updateMarketDetails: {
      isActive: true
    }
  };
  let actions$: Observable<any>;
  let effect: MarketCodeEffects;
  const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'httpClient',
    ['get']
  );
  const initialState = {};

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MarketCodeEffects,
        DataPersistence,
        provideMockStore({ initialState }),
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
          provide: MarketCodeService,
          useValue: marketCodeServiceSpy
        }
      ]
    });
    effect = TestBed.inject(MarketCodeEffects);
  });
  describe('loadMarketCodeDetails', () => {
    it('should return a stream with courierDetailsListing', () => {
      const parameters: LoadMarketCodesListingPayload = {
        pageIndex: 0,
        pageSize: 100
      };
      const action = new LoadMarketCodeDetails(parameters);
      const outcome = new LoadMarketCodeDetailsSuccess(dummyMarketCodeListing);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: dummyMarketCodeListing });
      marketCodeServiceSpy.getMarketDetails.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadMarketCode$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const parameters: LoadMarketCodesListingPayload = {
        pageIndex: 0,
        pageSize: 100
      };
      const action = new LoadMarketCodeDetails(parameters);
      const error = new Error('some error');
      const outcome = new LoadMarketCodeDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      marketCodeServiceSpy.getMarketDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadMarketCode$).toBeObservable(expected);
    });
  });
  describe('loadMarketDetailsBasedOnMarketCode', () => {
    it('should return a stream with loadMarketDetailsBasedOnMarketCode', () => {
      const action = new LoadMarketCodeDetailsBasedOnMarketCode('MAR');
      const outcome = new LoadMarketCodeDetailsBasedOnMarketCodeSuccess(
        saveMarketCodeDetails
      );
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: saveMarketCodeDetails });
      marketCodeServiceSpy.getMarketDetailsBasedOnMarketCode.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadMarketCodeDetailsBasedOnMarketCode$).toBeObservable(
        expected$
      );
    });
    it('should fail and return an action with the error', () => {
      const action = new LoadMarketCodeDetailsBasedOnMarketCode('MAR');
      const error = new Error('some error');
      const outcome = new LoadMarketCodeDetailsBasedOnMarketCodeFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      marketCodeServiceSpy.getMarketDetailsBasedOnMarketCode.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.loadMarketCodeDetailsBasedOnMarketCode$).toBeObservable(
        expected
      );
    });
  });
  describe('searchMarketCode', () => {
    it('should return a stream with searchMarketCode', () => {
      const action = new SearchMarketCode('MAR');
      const outcome = new SearchMarketCodeSuccess(marketCodeDetails);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: marketCodeDetails });
      marketCodeServiceSpy.getSearchResult.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.searchMarketCode$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new SearchMarketCode('MAR');
      const error = new Error('some error');
      const outcome = new SearchMarketCodeFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      marketCodeServiceSpy.getSearchResult.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.searchMarketCode$).toBeObservable(expected);
    });
  });
  describe('saveMarketCodeDetails', () => {
    it('should return a stream with saveMarketCodeDetails', () => {
      const action = new SaveMarketCodeDetails(saveMarketCodeDetails);
      const outcome = new SaveMarketCodeDetailsSuccess(saveMarketCodeDetails);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: saveMarketCodeDetails });
      marketCodeServiceSpy.saveMarketCodeDetails.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.saveMarketCodeDetails$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new SaveMarketCodeDetails(saveMarketCodeDetails);
      const error = new Error('some error');
      const outcome = new SaveMarketCodeDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      marketCodeServiceSpy.saveMarketCodeDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.saveMarketCodeDetails$).toBeObservable(expected);
    });
  });
  describe('updateMarketCodeDetails', () => {
    it('should return a stream with updateMarketCodeDetails', () => {
      const action = new UpdateMarketCodeDetails(updateMarketCodeDetails);
      const outcome = new UpdateMarketCodeDetailsSuccess(saveMarketCodeDetails);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: saveMarketCodeDetails });
      marketCodeServiceSpy.updateMarketCodeDetails.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.updateMarketCodeDetails$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new UpdateMarketCodeDetails(updateMarketCodeDetails);
      const error = new Error('some error');
      const outcome = new UpdateMarketCodeDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      marketCodeServiceSpy.updateMarketCodeDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.updateMarketCodeDetails$).toBeObservable(expected);
    });
  });
  describe('saveMarketMaterialFactors', () => {
    it('should return a stream with saveMarketMaterialFactors', () => {
      const action = new SaveMarketMaterialFactors(saveMarketMaterialFactors);
      const outcome = new SaveMarketMaterialFacatorsSuccess(
        saveMarketMaterialFactorsSuccess
      );
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: saveMarketMaterialFactorsSuccess });
      marketCodeServiceSpy.saveMarketMaterialFacators.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.saveMarketMaterialFactors$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new SaveMarketMaterialFactors(saveMarketMaterialFactors);
      const error = new Error('some error');
      const outcome = new SaveMarketMaterialFacatorsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      marketCodeServiceSpy.saveMarketMaterialFacators.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.saveMarketMaterialFactors$).toBeObservable(expected);
    });
  });
  describe('updateMarketMaterialFactors', () => {
    it('should return a stream with updateMarketMaterialFactors', () => {
      const action = new UpdateMarketMaterialFactors(saveMarketMaterialFactors);
      const outcome = new UpdateMarketMaterialFactorsSuccess(
        saveMarketMaterialFactorsSuccess
      );
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: saveMarketMaterialFactorsSuccess });
      marketCodeServiceSpy.updateMarketMaterialFacators.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.updateMarketMaterialFactors$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new UpdateMarketMaterialFactors(saveMarketMaterialFactors);
      const error = new Error('some error');
      const outcome = new UpdateMarketMaterialFactorsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      marketCodeServiceSpy.updateMarketMaterialFacators.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.updateMarketMaterialFactors$).toBeObservable(expected);
    });
  });
});
