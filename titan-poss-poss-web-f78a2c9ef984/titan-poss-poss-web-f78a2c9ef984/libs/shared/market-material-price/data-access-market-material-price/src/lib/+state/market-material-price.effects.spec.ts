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
  SearchMarketCodePayload,
  MarketListing,
  LoadSavedBasePrice,
  LocationDetailsList,
  SavePricePayload,
  LoadMarketBasedOnMaterial,
  MaterialPricePayload,
  MaterialPriceList,
  ViewLocationPayload,
  SearchComputedPriceByLocationPayload,
  SearchSavedLocationPriceByLocationPayload
} from '@poss-web/shared/models';

import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { MarketMaterialPriceEffects } from './market-material-price.effects';
import { MaterialPriceService } from '../material-price.service';
import {
  SearchMarketCodeSuccess,
  SearchMarketCodeFailure,
  SearchMarketCode,
  LoadSavedPriceSuccess,
  LoadSavedPriceFailure,
  LoadSavedPrice,
  SavePriceSuccess,
  SavePriceFailure,
  SavePrice,
  LoadMarketDetailsBasedOnMaterialSuccess,
  LoadMarketDetailsBasedOnMaterialFailure,
  LoadMarketDetailsBasedOnMaterial,
  LoadMetalPriceDetailsSuccess,
  LoadMetalPriceDetailsFailure,
  LoadMetalPriceDetails,
  ViewLocationPriceSuccess,
  ViewLocationPriceFailure,
  ViewLocationPrice,
  SearchComputedPriceByLocationCodeSuccess,
  SearchComputedPriceByLocationCodeFailure,
  SearchComputedPriceByLocationCode,
  SearchSavedLocationPriceByLocationCodeSuccess,
  SearchSavedLocationPriceByLocationCodeFailure,
  SearchSavedLocationPriceByLocationCode
} from './market-material-price.actions';
import { FileDownloadService } from '@poss-web/shared/util-common';

describe('MarketMaterialPriceEffects Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: MarketMaterialPriceEffects;
  const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'httpClient',
    ['get', 'post', 'patch']
  );
  const initialState = {};
  let metalTypePriceService = jasmine.createSpyObj<MaterialPriceService>(
    'MaterialPriceService',
    [
      'getMaterialPriceDetails',
      'getMarketDetailsBasedOnMaterial',
      'getComputedLocationPrice',
      'loadSavedBasePrice',
      'savePrice',
      'getSearchResult',
      'searchComputedPriceByLocationCode',
      'searchSavedLocationPriceByLocationCode'
    ]
  );

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MarketMaterialPriceEffects,
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
          provide: MaterialPriceService,
          useValue: {
            searchSavedLocationPriceByLocationCode: jasmine.createSpy(),
            searchComputedPriceByLocationCode: jasmine.createSpy(),
            getSearchResult: jasmine.createSpy(),
            savePrice: jasmine.createSpy(),
            loadSavedBasePrice: jasmine.createSpy(),
            getComputedLocationPrice: jasmine.createSpy(),
            getMarketDetailsBasedOnMaterial: jasmine.createSpy(),
            getMaterialPriceDetails: jasmine.createSpy()
          }
        }
      ]
    });

    effect = TestBed.inject(MarketMaterialPriceEffects);
    metalTypePriceService = TestBed.inject<any>(MaterialPriceService);
  });

  describe('searchMarketCode', () => {
    it('should return a stream with market code list', () => {
      const payload: SearchMarketCodePayload = {
        data: {
          materialCode: 'J',
          marketCode: 'KA'
        },
        selectedStock: ''
      };
      const res: MarketListing = {
        marketDetails: [
          {
            materialCode: '',
            marketCode: 'KA',
            description: 'KARANATAKA',
            markupFactor: 1,
            addAmount: 10,
            deductAmount: 10,
            computedPrice: 200
          }
        ],
        totalCount: 1
      };

      const action = new SearchMarketCode(payload);
      const outcome = new SearchMarketCodeSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      metalTypePriceService.getSearchResult.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.searchMarketCode$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: SearchMarketCodePayload = {
        data: {
          materialCode: 'J',
          marketCode: 'KA'
        },
        selectedStock: ''
      };

      const action = new SearchMarketCode(payload);
      const error = new Error('some error');
      const outcome = new SearchMarketCodeFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      metalTypePriceService.getSearchResult.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.searchMarketCode$).toBeObservable(expected);
    });
  });

  describe('loadSavedBasePrice', () => {
    it('should return a stream with location code list', () => {
      const payload: LoadSavedBasePrice = {
        pageSize: 10,
        pageIndex: 1,
        materialCode: 'j',
        id: '1'
      };
      const res: LocationDetailsList = {
        locationDetails: [
          {
            locationCode: 'URB',
            locationDescription: 'URB',
            marketCode: 'KA',
            marketDescription: 'KA',
            materialPrice: '1001'
          }
        ],
        totalCount: 10
      };

      const action = new LoadSavedPrice(payload);
      const outcome = new LoadSavedPriceSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      metalTypePriceService.loadSavedBasePrice.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadSavedBasePrice$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: LoadSavedBasePrice = {
        pageSize: 10,
        pageIndex: 1,
        materialCode: 'j',
        id: '1'
      };

      const action = new LoadSavedPrice(payload);
      const error = new Error('some error');
      const outcome = new LoadSavedPriceFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      metalTypePriceService.loadSavedBasePrice.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadSavedBasePrice$).toBeObservable(expected);
    });
  });

  describe('savePrice', () => {
    it('should return a stream with SavePriceSuccess', () => {
      const payload: SavePricePayload = {
        materialCode: 'J',
        data: {
          applicableDate: 10,
          marketCodes: [],
          basePrice: 10,
          remarks: 'remarks',
          priceTypeCode: 'D'
        }
      };

      const action = new SavePrice(payload);
      const outcome = new SavePriceSuccess();
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: {} });
      metalTypePriceService.savePrice.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.savePrice$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: SavePricePayload = {
        materialCode: 'J',
        data: {
          applicableDate: 10,
          marketCodes: [],
          basePrice: 10,
          remarks: 'remarks',
          priceTypeCode: 'D'
        }
      };

      const action = new SavePrice(payload);
      const error = new Error('some error');
      const outcome = new SavePriceFailure(CustomErrorAdaptor.fromJson(error));
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      metalTypePriceService.savePrice.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.savePrice$).toBeObservable(expected);
    });
  });

  describe('loadMarketDetailsBasedOnMaterial', () => {
    it('should return a stream with market code list', () => {
      const payload: LoadMarketBasedOnMaterial = {
        data: {
          materialCode: 'J',
          pageSize: 10,
          pageIndex: 1
        }
      };
      const res: MarketListing = {
        marketDetails: [
          {
            materialCode: '',
            marketCode: 'KA',
            description: 'KARANATAKA',
            markupFactor: 1,
            addAmount: 10,
            deductAmount: 10,
            computedPrice: 200
          }
        ],
        totalCount: 1
      };

      const action = new LoadMarketDetailsBasedOnMaterial(payload);
      const outcome = new LoadMarketDetailsBasedOnMaterialSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      metalTypePriceService.getMarketDetailsBasedOnMaterial.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadMarketDetailsBasedOnMaterial$).toBeObservable(
        expected$
      );
    });

    it('should fail and return an action with the error', () => {
      const payload: LoadMarketBasedOnMaterial = {
        data: {
          materialCode: 'J',
          pageSize: 10,
          pageIndex: 1
        }
      };

      const action = new LoadMarketDetailsBasedOnMaterial(payload);
      const error = new Error('some error');
      const outcome = new LoadMarketDetailsBasedOnMaterialFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      metalTypePriceService.getMarketDetailsBasedOnMaterial.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.loadMarketDetailsBasedOnMaterial$).toBeObservable(expected);
    });
  });

  describe('loadMetalPriceDetails', () => {
    it('should return a stream with material price list', () => {
      const payload: MaterialPricePayload = {
        applicableDate: 10,
        materialCode: 'j',
        configId: '1'
      };
      const res: MaterialPriceList[] = [
        {
          price: 1000,
          priceType: 'D',
          remarks: 'remarks',
          id: '1',
          time: '10',
          createdDate: new Date()
        }
      ];
      const action = new LoadMetalPriceDetails(payload);
      const outcome = new LoadMetalPriceDetailsSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      metalTypePriceService.getMaterialPriceDetails.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadMetalPriceDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: MaterialPricePayload = {
        applicableDate: 10,
        materialCode: 'j',
        configId: '1'
      };

      const action = new LoadMetalPriceDetails(payload);
      const error = new Error('some error');
      const outcome = new LoadMetalPriceDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      metalTypePriceService.getMaterialPriceDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadMetalPriceDetails$).toBeObservable(expected);
    });
  });

  describe('viewComputedLocationPriceDetails', () => {
    it('should return a stream with location code list', () => {
      const payload: ViewLocationPayload = {
        pageIndex: 1,
        pageSize: 10,
        materialCode: 'J',
        data: {
          marketCodes: [],
          applicableDate: 10,
          priceTypeCode: 'F',
          basePrice: 100
        }
      };
      const res: LocationDetailsList = {
        locationDetails: [
          {
            locationCode: 'URB',
            locationDescription: 'URB',
            marketCode: 'KA',
            marketDescription: 'KA',
            materialPrice: '1001'
          }
        ],
        totalCount: 10
      };

      const action = new ViewLocationPrice(payload);
      const outcome = new ViewLocationPriceSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      metalTypePriceService.getComputedLocationPrice.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.viewComputedLocationPriceDetails$).toBeObservable(
        expected$
      );
    });

    it('should fail and return an action with the error', () => {
      const payload: ViewLocationPayload = {
        pageIndex: 1,
        pageSize: 10,
        materialCode: 'J',
        data: {
          marketCodes: [],
          applicableDate: 10,
          priceTypeCode: 'F',
          basePrice: 100
        }
      };

      const action = new ViewLocationPrice(payload);
      const error = new Error('some error');
      const outcome = new ViewLocationPriceFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      metalTypePriceService.getComputedLocationPrice.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.viewComputedLocationPriceDetails$).toBeObservable(expected);
    });
  });

  describe('searchComputedPriceByLocationCode', () => {
    it('should return a stream with location code list', () => {
      const payload: SearchComputedPriceByLocationPayload = {
        locationCode: 'URB',
        materialCode: 'J',
        pageIndex: 1,
        pageSize: 10,
        data: ''
      };
      const res: LocationDetailsList = {
        locationDetails: [
          {
            locationCode: 'URB',
            locationDescription: 'URB',
            marketCode: 'KA',
            marketDescription: 'KA',
            materialPrice: '1001'
          }
        ],
        totalCount: 10
      };

      const action = new SearchComputedPriceByLocationCode(payload);
      const outcome = new SearchComputedPriceByLocationCodeSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      metalTypePriceService.searchComputedPriceByLocationCode.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.searchComputedPriceByLocationCode$).toBeObservable(
        expected$
      );
    });

    it('should fail and return an action with the error', () => {
      const payload: SearchComputedPriceByLocationPayload = {
        locationCode: 'URB',
        materialCode: 'J',
        pageIndex: 1,
        pageSize: 10,
        data: ''
      };

      const action = new SearchComputedPriceByLocationCode(payload);
      const error = new Error('some error');
      const outcome = new SearchComputedPriceByLocationCodeFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      metalTypePriceService.searchComputedPriceByLocationCode.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.searchComputedPriceByLocationCode$).toBeObservable(
        expected
      );
    });
  });

  describe('SearchSavedLocationPriceByLocationCode', () => {
    it('should return a stream with location code list', () => {
      const payload: SearchSavedLocationPriceByLocationPayload = {
        id: '1',
        locationCode: 'URB',
        materialCode: 'J',
        pageIndex: 1,
        pageSize: 10
      };
      const res: LocationDetailsList = {
        locationDetails: [
          {
            locationCode: 'URB',
            locationDescription: 'URB',
            marketCode: 'KA',
            marketDescription: 'KA',
            materialPrice: '1001'
          }
        ],
        totalCount: 10
      };

      const action = new SearchSavedLocationPriceByLocationCode(payload);
      const outcome = new SearchSavedLocationPriceByLocationCodeSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      metalTypePriceService.searchSavedLocationPriceByLocationCode.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.SearchSavedLocationPriceByLocationCode$).toBeObservable(
        expected$
      );
    });

    it('should fail and return an action with the error', () => {
      const payload: SearchSavedLocationPriceByLocationPayload = {
        id: '1',
        locationCode: 'URB',
        materialCode: 'J',
        pageIndex: 1,
        pageSize: 10
      };

      const action = new SearchSavedLocationPriceByLocationCode(payload);
      const error = new Error('some error');
      const outcome = new SearchSavedLocationPriceByLocationCodeFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      metalTypePriceService.searchSavedLocationPriceByLocationCode.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.SearchSavedLocationPriceByLocationCode$).toBeObservable(
        expected
      );
    });
  });
});
