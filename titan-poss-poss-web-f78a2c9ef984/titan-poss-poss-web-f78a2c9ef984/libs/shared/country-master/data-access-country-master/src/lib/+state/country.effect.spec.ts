import { Observable } from 'rxjs';
import { hot, cold } from 'jasmine-marbles';

import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { HttpClient } from '@angular/common/http';

import { DataPersistence } from '@nrwl/angular';

import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { CountryEffect } from './country.effect';
import { CountryService } from '../country.service';
import {
  LoadCountryDetails,
  LoadCountryDetailsSuccess,
  LoadCountryDetailsFailure,
  LoadCountryByCountryCode,
  LoadCountryByCountryCodeSuccess,
  LoadCountryByCountryCodeFailure,
  ResetCountryDialog,
  SaveCountryFormDetails,
  SaveCountryFormDetailsFailure,
  EditCountryFormDetails,
  EditCountryFormDetailsSuccess,
  EditCountryFormDetailsFailure,
  SaveCountryFormDetailsSuccess,
  SearchCountryCode,
  SearchCountryCodeSuccess,
  SearchCountryCodeFailure,
  LoadCurrencyCode,
  LoadCurrencyCodeFailure,
  LoadCurrencyCodeSuccess,
  LoadDateFormats,
  LoadDateFormatsSuccess,
  LoadDateFormatsFailure,
  LoadTimeFormats,
  LoadTimeFormatsSuccess,
  LoadTimeFormatsFailure
} from './country.action';
import {
  LoadCountryListingPayload,
  LoadCountryListingSuccessPayload,
  CountryMaster,
  SaveCountryFormDetailsPayload,
  CountryDetails,
  CountryNameData,
  CurrencyCodeData,
  Lov,
  CurrencyList
} from '@poss-web/shared/models';
import {
  LocationDataService,
  LovDataService
} from '@poss-web/shared/masters/data-access-masters';

describe('  Country Effects Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: CountryEffect;
  const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'httpClient',
    ['get', 'post', 'patch']
  );
  const initialState = {};
  let countryService = jasmine.createSpyObj<CountryService>('CountryService', [
    'getCountryDetails',
    'getCountryByCountryCode',
    'saveCountryFormDetails',
    'editCountryFormDetails',
    'getCountrySearchResult'
  ]);
  const locationDataServiceSpy = jasmine.createSpyObj<LocationDataService>([
    'getCurrencyList'
  ]);
  const lovDataServiceSpy = jasmine.createSpyObj<LovDataService>(['getLov']);
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CountryEffect,
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
          provide: CountryService,
          useValue: {
            getCountryDetails: jasmine.createSpy(),
            getCountryByCountryCode: jasmine.createSpy(),
            saveCountryFormDetails: jasmine.createSpy(),
            editCountryFormDetails: jasmine.createSpy(),
            getCountrySearchResult: jasmine.createSpy()
          }
        },
        {
          provide: LocationDataService,
          useValue: locationDataServiceSpy
        },
        {
          provide: LovDataService,
          useValue: lovDataServiceSpy
        }
      ]
    });

    effect = TestBed.inject(CountryEffect);
    countryService = TestBed.inject<any>(CountryService);
  });

  describe('loadStoneTypeDetails', () => {
    it('should return a stream with stone type list', () => {
      const parameters: LoadCountryListingPayload = {
        pageIndex: 0,
        pageSize: 100
      };
      const countryListing: LoadCountryListingSuccessPayload = {
        countryListing: [],
        totalElements: 1
      };
      const action = new LoadCountryDetails(parameters);
      const outcome = new LoadCountryDetailsSuccess(countryListing);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: countryListing });
      countryService.getCountryDetails.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadCountryDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters: LoadCountryListingPayload = {
        pageIndex: 0,
        pageSize: 100
      };
      const action = new LoadCountryDetails(parameters);
      const error = new Error('some error');
      const outcome = new LoadCountryDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      countryService.getCountryDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadCountryDetails$).toBeObservable(expected);
    });
  });
  describe('LoadCountryByCountryCode', () => {
    it('should return a stream with stone type object', () => {
      const parameters = 'stoneType1';
      const countryDetails: CountryMaster = {
        countryCode: 'ABC',
        description: 'ABC',
        currencyCode: 'ABC',
        dateFormat: 'ABC',
        fiscalYearStart: 'ABC',
        isdCode: 'ABC',
        phoneLength: 'ABC',
        locale: 'ABC',
        timeFormat: 'ABC',
        fiscalYear: 2020,
        weightUnit: 'gms',
        stoneWeightUnit: 'karat',
        isActive: true
      };
      const action = new LoadCountryByCountryCode(parameters);
      const outcome = new LoadCountryByCountryCodeSuccess(countryDetails);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: countryDetails });
      countryService.getCountryByCountryCode.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadCountryDetailsByCountryCode$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters = 'ABC';
      const action = new LoadCountryByCountryCode(parameters);
      const error = new Error('some error');
      const outcome = new LoadCountryByCountryCodeFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      countryService.getCountryByCountryCode.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadCountryDetailsByCountryCode$).toBeObservable(expected);
    });
  });

  describe('SaveCountryFormDetails', () => {
    it('should return a stream with stone type list', () => {
      const parameters: SaveCountryFormDetailsPayload = {
        countryCode: 'ABC',
        description: 'ABC',
        currencyCode: 'ABC',
        dateFormat: 'ABC',
        fiscalYearStart: 'ABC',
        isdCode: 'ABC',
        phoneLength: 'ABC',
        locale: 'ABC',
        timeFormat: 'ABC',
        fiscalYear: 2020,
        weightUnit: 'gms',
        stoneWeightUnit: 'karat',
        isActive: true
      };
      const param2: CountryMaster = {
        countryCode: 'ABC',
        description: 'ABC',
        currencyCode: 'ABC',
        dateFormat: 'ABC',
        fiscalYearStart: 'ABC',
        isdCode: 'ABC',
        phoneLength: 'ABC',
        locale: 'ABC',
        timeFormat: 'ABC',
        fiscalYear: 2020,
        weightUnit: 'gms',
        stoneWeightUnit: 'karat',
        isActive: true
      };

      const action = new SaveCountryFormDetails(parameters);
      const outcome = new SaveCountryFormDetailsSuccess(param2);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: parameters });
      countryService.saveCountryFormDetails.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.saveCountryFormDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters: SaveCountryFormDetailsPayload = {
        countryCode: 'ABC',
        description: 'ABC',
        currencyCode: 'ABC',
        dateFormat: 'ABC',
        fiscalYearStart: 'ABC',
        isdCode: 'ABC',
        phoneLength: 'ABC',
        locale: 'ABC',
        timeFormat: 'ABC',
        fiscalYear: 2020,
        weightUnit: 'gms',
        stoneWeightUnit: 'karat',
        isActive: true
      };
      const action = new SaveCountryFormDetails(parameters);
      const error = new Error('some error');
      const outcome = new SaveCountryFormDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      countryService.saveCountryFormDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.saveCountryFormDetails$).toBeObservable(expected);
    });
  });

  describe('EditCountryFormDetails', () => {
    it('should return a stream with Country list', () => {
      const parameters: SaveCountryFormDetailsPayload = {
        countryCode: 'ABC',
        description: 'ABC',
        currencyCode: 'ABC',
        dateFormat: 'ABC',
        fiscalYearStart: 'ABC',
        isdCode: 'ABC',
        phoneLength: 'ABC',
        locale: 'ABC',
        timeFormat: 'ABC',
        fiscalYear: 2020,
        weightUnit: 'gms',
        stoneWeightUnit: 'karat',
        isActive: true
      };
      const param2: CountryMaster = {
        countryCode: 'ABC',
        description: 'ABC',
        currencyCode: 'ABC',
        dateFormat: 'ABC',
        fiscalYearStart: 'ABC',
        isdCode: 'ABC',
        phoneLength: 'ABC',
        locale: 'ABC',
        timeFormat: 'ABC',
        fiscalYear: 2020,
        weightUnit: 'gms',
        stoneWeightUnit: 'karat',
        isActive: true
      };
      const action = new EditCountryFormDetails(parameters);
      const outcome = new EditCountryFormDetailsSuccess(param2);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: parameters });
      countryService.editCountryFormDetails.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.editCountryFormDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters: SaveCountryFormDetailsPayload = {
        countryCode: 'ABC',
        description: 'ABC',
        currencyCode: 'ABC',
        dateFormat: 'ABC',
        fiscalYearStart: 'ABC',
        isdCode: 'ABC',
        phoneLength: 'ABC',
        locale: 'ABC',
        timeFormat: 'ABC',
        fiscalYear: 2020,
        weightUnit: 'gms',
        stoneWeightUnit: 'karat',
        isActive: true
      };

      const action = new EditCountryFormDetails(parameters);
      const error = new Error('some error');
      const outcome = new EditCountryFormDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      countryService.editCountryFormDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.editCountryFormDetails$).toBeObservable(expected);
    });
  });

  describe('SearchCountryCode', () => {
    it('should return a stream with stone type list', () => {
      const parameters = 'stoneType1';
      const currencyListing: CountryDetails[] = [
        {
          countryCode: 'ABC',
          description: 'ABC',
          isdCode: 'ABC',
          dateFormat: 'ABC',
          phoneLength: 'ABC',
          locale: 'ABC',
          timeFormat: 'ABC',
          isActive: true
        }
      ];
      const action = new SearchCountryCode(parameters);
      const outcome = new SearchCountryCodeSuccess(currencyListing);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: currencyListing });
      countryService.getCountrySearchResult.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.searchCountryFormDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters = 'ABC';
      const action = new SearchCountryCode(parameters);
      const error = new Error('some error');
      const outcome = new SearchCountryCodeFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      countryService.getCountrySearchResult.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.searchCountryFormDetails$).toBeObservable(expected);
    });
  });

  describe('LoadCurrencyCode', () => {
    it('should return a stream with currency code list', () => {
      const currencyListing: CurrencyList[] = [
        {
          currencyCode: 'ABC',
          description: 'ABC'
        }
      ];
      const action = new LoadCurrencyCode();
      const outcome = new LoadCurrencyCodeSuccess(currencyListing);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: currencyListing });
      locationDataServiceSpy.getCurrencyList.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.currencyCode$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadCurrencyCode();
      const error = new Error('some error');
      const outcome = new LoadCurrencyCodeFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      locationDataServiceSpy.getCurrencyList.and.returnValue(response$);
      const expected$ = cold('--b', { b: outcome });
      expect(effect.currencyCode$).toBeObservable(expected$);
    });
  });

  describe('LoadDateFormats', () => {
    it('should return a stream with CountryName list', () => {
      const list: Lov[] = [{ code: 'abc', isActive: true, value: 'abc' }];
      const action = new LoadDateFormats();
      const outcome = new LoadDateFormatsSuccess(list);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: list });
      lovDataServiceSpy.getLov.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.LoadDateFormats$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadDateFormats();
      const error = new Error('some error');
      const outcome = new LoadDateFormatsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      lovDataServiceSpy.getLov.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.LoadDateFormats$).toBeObservable(expected);
    });
  });

  describe('LoadTimeFormats', () => {
    it('should return a stream with CountryName list', () => {
      const list: Lov[] = [{ code: 'abc', isActive: true, value: 'abc' }];
      const action = new LoadTimeFormats();
      const outcome = new LoadTimeFormatsSuccess(list);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: list });
      lovDataServiceSpy.getLov.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadTimeFormats$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadTimeFormats();
      const error = new Error('some error');
      const outcome = new LoadTimeFormatsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      lovDataServiceSpy.getLov.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadTimeFormats$).toBeObservable(expected);
    });
  });
});
