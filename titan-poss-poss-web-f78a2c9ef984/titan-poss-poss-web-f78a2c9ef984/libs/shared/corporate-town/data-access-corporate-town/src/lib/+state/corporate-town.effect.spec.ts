import { Observable } from 'rxjs';
import { hot, cold } from 'jasmine-marbles';

import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { HttpClient } from '@angular/common/http';

import { DataPersistence } from '@nrwl/angular';

import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  LoadCorporateTownDetails,
  LoadCorporateTownDetailsSuccess,
  LoadCorporateTownDetailsFailure,
  LoadStateDetails,
  LoadStateDetailsSuccess,
  LoadStateDetailsFailure,
  LoadTownDetailsByTownCode,
  LoadTownDetailsByTownCodeSuccess,
  LoadTownDetailsByTownCodeFailure,
  ResetTownDetailsDialog,
  SaveTownFormDetails,
  SaveTownFormDetailsSuccess,
  SaveTownFormDetailsFailure,
  EditTownFormDetails,
  EditTownFormDetailsSuccess,
  EditTownFormDetailsFailure,
  SearchCorporateTownCode,
  SearchCorporateTownCodeSuccess,
  SearchCorporateTownCodeFailure
} from './corporate-town.actions';
import { CorporateTownEffect } from './corporate-town.effect';
import { CorporateTownService } from '../corporate-town.service';
import {
  CorporateTown,
  LoadCorporateTownListingPayload,
  LoadCorporateTownListingSuccessPayload,
  SaveTownFormDetailsPayload,
  StateSummary
} from '@poss-web/shared/models';
import { StateDataService } from '@poss-web/shared/masters/data-access-masters';

describe('  Stone Type Effects Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: CorporateTownEffect;
  const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'httpClient',
    ['get', 'post', 'patch']
  );
  const initialState = {};
  let stoneTypeService = jasmine.createSpyObj<CorporateTownService>(
    'CorporateTownService',
    [
      'getCorporateTownDetails',
      'getTownDetailsByTownCode',
      'saveTownFormDetails',
      'editTownFormDetails',
      'searchCorporateTown'
    ]
  );
  const stateDataserviceSpy = jasmine.createSpyObj<StateDataService>(
    'StateDataService',
    ['getStatesSummary']
  );
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CorporateTownEffect,
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
          provide: CorporateTownService,
          useValue: {
            getCorporateTownDetails: jasmine.createSpy(),
            getTownDetailsByTownCode: jasmine.createSpy(),
            saveTownFormDetails: jasmine.createSpy(),
            editTownFormDetails: jasmine.createSpy(),
            searchCorporateTown: jasmine.createSpy()
          }
        },
        {
          provide: StateDataService,
          useValue: stateDataserviceSpy
        }
      ]
    });

    effect = TestBed.inject(CorporateTownEffect);
    stoneTypeService = TestBed.inject<any>(CorporateTownService);
  });

  describe('loadStoneTypeDetails', () => {
    it('should return a stream with stone type list', () => {
      const parameters: LoadCorporateTownListingPayload = {
        pageIndex: 0,
        pageSize: 100
      };
      const stoneTypeListing: LoadCorporateTownListingSuccessPayload = {
        corporateTownDetailsListing: [],
        totalElements: 0
      };
      const action = new LoadCorporateTownDetails(parameters);
      const outcome = new LoadCorporateTownDetailsSuccess(stoneTypeListing);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: stoneTypeListing });
      stoneTypeService.getCorporateTownDetails.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadCorporateTownDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters: LoadCorporateTownListingPayload = {
        pageIndex: 0,
        pageSize: 100
      };

      const action = new LoadCorporateTownDetails(parameters);
      const error = new Error('some error');
      const outcome = new LoadCorporateTownDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      stoneTypeService.getCorporateTownDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadCorporateTownDetails$).toBeObservable(expected);
    });
  });
  describe('loadTownDetailsByTownCode', () => {
    it('should return a stream with stone type object', () => {
      const parameters = 'abc';
      const town: CorporateTown = {
        townId: 1,
        townCode: 'TEST',
        stateId: 'TEST',
        description: 'TEST',
        stateName: 'TEST',
        isActive: true
      };

      const action = new LoadTownDetailsByTownCode(parameters);
      const outcome = new LoadTownDetailsByTownCodeSuccess(town);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: town });
      stoneTypeService.getTownDetailsByTownCode.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadTownDetailsByTownCode$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters = 'abc';
      const action = new LoadTownDetailsByTownCode(parameters);
      const error = new Error('some error');
      const outcome = new LoadTownDetailsByTownCodeFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      stoneTypeService.getTownDetailsByTownCode.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadTownDetailsByTownCode$).toBeObservable(expected);
    });
  });

  describe('saveTownFormDetails', () => {
    it('should return a stream with stone type list', () => {
      const parameters: SaveTownFormDetailsPayload = {
        townCode: 'TEST',
        stateId: 'TEST',
        description: 'TEST',
        isActive: true
      };
      const town: CorporateTown = {
        townId: 1,
        townCode: 'TEST',
        stateId: 'TEST',
        description: 'TEST',
        stateName: 'TEST',
        isActive: true
      };

      const action = new SaveTownFormDetails(parameters);
      const outcome = new SaveTownFormDetailsSuccess(town);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: parameters });
      stoneTypeService.saveTownFormDetails.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      return expect(effect.saveTownFormDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters: SaveTownFormDetailsPayload = {
        townCode: 'TEST',
        stateId: 'TEST',
        description: 'TEST',
        isActive: true
      };
      const action = new SaveTownFormDetails(parameters);
      const error = new Error('some error');
      const outcome = new SaveTownFormDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      stoneTypeService.saveTownFormDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.saveTownFormDetails$).toBeObservable(expected);
    });
  });

  describe('editTownFormDetails', () => {
    it('should return a stream with stone type list', () => {
      const parameters: SaveTownFormDetailsPayload = {
        townCode: 'TEST',
        stateId: 'TEST',
        description: 'TEST',
        isActive: true
      };
      const town: CorporateTown = {
        townId: 1,
        townCode: 'TEST',
        stateId: 'TEST',
        description: 'TEST',
        stateName: 'TEST',
        isActive: true
      };

      const action = new EditTownFormDetails(parameters);
      const outcome = new EditTownFormDetailsSuccess(town);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: parameters });
      stoneTypeService.editTownFormDetails.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      return expect(effect.editTownFormDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters: SaveTownFormDetailsPayload = {
        townCode: 'TEST',
        stateId: 'TEST',
        description: 'TEST',
        isActive: true
      };
      const action = new EditTownFormDetails(parameters);
      const error = new Error('some error');
      const outcome = new EditTownFormDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      stoneTypeService.editTownFormDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.editTownFormDetails$).toBeObservable(expected);
    });
  });

  describe('loadStoneTypeDetails', () => {
    it('should return a stream with stone type list', () => {
      const parameters = 'IND';

      const statesListing: StateSummary[] = [
        {
          stateId: 1,
          description: 'KARNATAKA',
          stateTaxCode: 111
        }
      ];
      const action = new LoadStateDetails(parameters);
      const outcome = new LoadStateDetailsSuccess(statesListing);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: statesListing });
      stateDataserviceSpy.getStatesSummary.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadStatesDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters = 'IND';

      const action = new LoadStateDetails(parameters);
      const error = new Error('some error');
      const outcome = new LoadStateDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      stateDataserviceSpy.getStatesSummary.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadStatesDetails$).toBeObservable(expected);
    });
  });
  describe('searchCorporateTownByTownCode', () => {
    it('should return a stream with stone type list', () => {
      const parameters = 'ABC';
      const townListing: LoadCorporateTownListingSuccessPayload = {
        corporateTownDetailsListing: [],
        totalElements: 1
      };
      const action = new SearchCorporateTownCode(parameters);
      const outcome = new SearchCorporateTownCodeSuccess(townListing);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: townListing });
      stoneTypeService.searchCorporateTown.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.searchCorporateTownByTownCode$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters = 'stoneType1';
      const action = new SearchCorporateTownCode(parameters);
      const error = new Error('some error');
      const outcome = new SearchCorporateTownCodeFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      stoneTypeService.searchCorporateTown.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.searchCorporateTownByTownCode$).toBeObservable(expected);
    });
  });
});
