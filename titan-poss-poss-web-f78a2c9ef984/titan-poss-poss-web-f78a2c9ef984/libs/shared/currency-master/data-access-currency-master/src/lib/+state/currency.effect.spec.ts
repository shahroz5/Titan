import { Observable } from 'rxjs';
import { hot, cold } from 'jasmine-marbles';

import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { HttpClient } from '@angular/common/http';

import { DataPersistence } from '@nrwl/angular';

import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { CurrencyEffect } from './currency.effect';
import { CurrencyService } from '../currency-master.service';
import {
  LoadCurrencyDetails,
  LoadCurrencyDetailsSuccess,
  LoadCurrencyDetailsFailure,
  LoadCurrencyDetailsByCurrencyCode,
  LoadCurrencyDetailsByCurrencyCodeSuccess,
  LoadCurrencyDetailsByCurrencyCodeFailure,
  SaveCurrencyFormDetails,
  SaveCurrencyFormDetailsSuccess,
  SaveCurrencyFormDetailsFailure,
  EditCurrencyFormDetails,
  EditCurrencyFormDetailsSuccess,
  EditCurrencyFormDetailsFailure,
  SearchCurrency,
  SearchCurrencySuccess,
  SearchCurrencyFailure
} from './currency.action';
import {
  LoadCurrencyListingPayload,
  LoadCurrencyListingSuccessPayload,
  CurrencyDetails,
  SaveCurrencyDetailFormPayload
} from '@poss-web/shared/models';
import * as moment from 'moment';

describe('  Currency Effects Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: CurrencyEffect;
  const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'httpClient',
    ['get', 'post', 'patch']
  );
  const initialState = {};
  let currencyService = jasmine.createSpyObj<CurrencyService>(
    'CurrencyService',
    [
      'getCurrencyDetails',
      'getCurrencyDetailsByCurrencyCode',
      'saveCurrencyFormDetails',
      'editCurrencyFormDetails',
      'getCurrencyDetailsSearch'
    ]
  );
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CurrencyEffect,
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
          provide: CurrencyService,
          useValue: {
            getCurrencyDetails: jasmine.createSpy(),
            getCurrencyDetailsByCurrencyCode: jasmine.createSpy(),
            saveCurrencyFormDetails: jasmine.createSpy(),
            editCurrencyFormDetails: jasmine.createSpy(),
            getCurrencyDetailsSearch: jasmine.createSpy()
          }
        }
      ]
    });

    effect = TestBed.inject(CurrencyEffect);
    currencyService = TestBed.get(CurrencyService);
  });

  describe('loadStoneTypeDetails', () => {
    it('should return a stream with Currency list', () => {
      const parameters: LoadCurrencyListingPayload = {
        pageIndex: 0,
        pageSize: 100
      };
      const currencyListing: LoadCurrencyListingSuccessPayload = {
        currencyListing: [
          {
            currencyCode: 'ABC',
            currencySymbol: 'ABC',
            description: 'ABC',
            isActive: true,
            unicode: 'ABC',
            lastModifiedDate: moment()
          }
        ],
        totalElements: 1
      };
      const action = new LoadCurrencyDetails(parameters);
      const outcome = new LoadCurrencyDetailsSuccess(currencyListing);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: currencyListing });
      currencyService.getCurrencyDetails.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadCurrencyDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters: LoadCurrencyListingPayload = {
        pageIndex: 0,
        pageSize: 100
      };
      const action = new LoadCurrencyDetails(parameters);
      const error = new Error('some error');
      const outcome = new LoadCurrencyDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      currencyService.getCurrencyDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadCurrencyDetails$).toBeObservable(expected);
    });
  });
  describe('LoadCurrencyDetailsByCurrencyCode', () => {
    it('should return a stream with Currency object', () => {
      const parameters = 'stoneType1';
      const currencyDetails: CurrencyDetails = {
        currencyCode: 'ABC',
        currencySymbol: 'ABC',
        description: 'ABC',
        isActive: true,
        unicode: 'ABC',
        lastModifiedDate: moment()
      };

      const action = new LoadCurrencyDetailsByCurrencyCode(parameters);
      const outcome = new LoadCurrencyDetailsByCurrencyCodeSuccess(
        currencyDetails
      );
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: currencyDetails });
      currencyService.getCurrencyDetailsByCurrencyCode.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.LoadCurrencyDetailsByCurrencyCode$).toBeObservable(
        expected$
      );
    });

    it('should fail and return an action with the error', () => {
      const parameters = 'ABC';
      const action = new LoadCurrencyDetailsByCurrencyCode(parameters);
      const error = new Error('some error');
      const outcome = new LoadCurrencyDetailsByCurrencyCodeFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      currencyService.getCurrencyDetailsByCurrencyCode.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.LoadCurrencyDetailsByCurrencyCode$).toBeObservable(
        expected
      );
    });
  });

  describe('saveCurrencyFormDetails', () => {
    it('should return a stream with Currency list', () => {
      const parameters: SaveCurrencyDetailFormPayload = {
        currencyCode: 'AAA',
        currencySymbol: 'AAA',
        description: 'AAA',
        isActive: true
      };
      const param2: CurrencyDetails = {
        currencyCode: 'ABC',
        currencySymbol: 'ABC',
        description: 'ABC',
        isActive: true,
        unicode: 'ABC',
        lastModifiedDate: moment()
      };

      const action = new SaveCurrencyFormDetails(parameters);
      const outcome = new SaveCurrencyFormDetailsSuccess(param2);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: param2 });
      currencyService.saveCurrencyFormDetails.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.saveCurrencyFormDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters: SaveCurrencyDetailFormPayload = {
        currencyCode: 'ABC',
        currencySymbol: 'ABC',
        description: 'ABC',
        isActive: true
      };

      const action = new SaveCurrencyFormDetails(parameters);
      const error = new Error('some error');
      const outcome = new SaveCurrencyFormDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      currencyService.saveCurrencyFormDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.saveCurrencyFormDetails$).toBeObservable(expected);
    });
  });

  describe('EditCurrencyFormDetails', () => {
    it('should return a stream with Currency list', () => {
      const parameters: SaveCurrencyDetailFormPayload = {
        currencyCode: 'ABC',
        currencySymbol: 'ABC',
        description: 'ABC',
        isActive: true
      };
      const param2: CurrencyDetails = {
        currencyCode: 'ABC',
        currencySymbol: 'ABC',
        description: 'ABC',
        isActive: true,
        unicode: 'ABC',
        lastModifiedDate: moment()
      };
      const action = new EditCurrencyFormDetails(parameters);
      const outcome = new EditCurrencyFormDetailsSuccess(param2);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: param2 });
      currencyService.editCurrencyFormDetails.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.editCurrencyFormDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters: SaveCurrencyDetailFormPayload = {
        currencyCode: 'ABC',
        currencySymbol: 'ABC',
        description: 'ABC',
        isActive: true
      };

      const action = new EditCurrencyFormDetails(parameters);
      const error = new Error('some error');
      const outcome = new EditCurrencyFormDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      currencyService.editCurrencyFormDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.editCurrencyFormDetails$).toBeObservable(expected);
    });
  });

  describe('searchStoneTypeList', () => {
    it('should return a stream with Currency list', () => {
      const parameters = 'stoneType1';
      const currencyListing: CurrencyDetails[] = [
        {
          currencyCode: 'ABC',
          currencySymbol: 'ABC',
          description: 'ABC',
          isActive: true,
          unicode: 'ABC',
          lastModifiedDate: moment()
        }
      ];
      const action = new SearchCurrency(parameters);
      const outcome = new SearchCurrencySuccess(currencyListing);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: currencyListing });
      currencyService.getCurrencyDetailsSearch.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.SearchCurrency$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters = 'stoneType1';
      const action = new SearchCurrency(parameters);
      const error = new Error('some error');
      const outcome = new SearchCurrencyFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      currencyService.getCurrencyDetailsSearch.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.SearchCurrency$).toBeObservable(expected);
    });
  });
});
