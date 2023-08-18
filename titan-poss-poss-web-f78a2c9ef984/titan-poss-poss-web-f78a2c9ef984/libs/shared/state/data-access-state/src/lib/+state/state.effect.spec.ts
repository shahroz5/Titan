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
  LoadStateListingPayload,
  LoadStatesDetailsListingSuccessPayload,
  LoadCountryDetailsListingSuccessPayload,
  StateData,
  SaveStateDetailsPayload
} from '@poss-web/shared/models';

import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { StateEffect } from './state.effect';
import { StateService } from '../state.service';
import {
  LoadStateByCode,
  LoadStateByCodeSuccess,
  LoadStateByCodeFailure,
  SaveStateFormDetailsSuccess,
  SaveStateFormDetailsFailure,
  SaveStateFormDetails,
  EditStateDetailsSuccess,
  EditStateDetails,
  EditStateDetailsFailure,
  UpdateIsActiveSuccess,
  UpdateIsActive,
  UpdateIsActiveFailure,
  LoadStateDetailsFailure,
  LoadCountryDetails,
  LoadStateDetails,
  LoadStateDetailsSuccess,
  LoadCountryDetailsSuccess,
  LoadCountryDetailsFailure,
  SearchState,
  SearchStateSuccess,
  SearchStateFailure
} from './state.actions';

describe('StateEffect Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: StateEffect;
  const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'httpClient',
    ['get', 'post', 'patch']
  );
  const initialState = {};
  let stateService = jasmine.createSpyObj<StateService>('stateService', [
    'getStateDetails',
    'getCountryDetails',
    'getStateByCode',
    'saveStateFormDetails',
    'editStateFormDetails',
    'searchStateByCode',
    'updateIsActive'
  ]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        StateEffect,
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
          provide: StateService,
          useValue: {
            getStateDetails: jasmine.createSpy(),
            getCountryDetails: jasmine.createSpy(),
            getStateByCode: jasmine.createSpy(),
            saveStateFormDetails: jasmine.createSpy(),
            editStateFormDetails: jasmine.createSpy(),
            searchStateByCode: jasmine.createSpy(),
            updateIsActive: jasmine.createSpy()
          }
        }
      ]
    });

    effect = TestBed.inject(StateEffect);
    stateService = TestBed.inject<any>(StateService);
  });

  describe('loadStateDetails', () => {
    it('should return a stream with state list', () => {
      const payload: LoadStateListingPayload = {
        pageIndex: 0,
        pageSize: 100
      };
      const payloadRes: LoadStatesDetailsListingSuccessPayload = {
        stateDetailsListing: [
          {
            stateCode: 'KA',
            isActive: false,
            isUnionTerritory: false,
            description: 'KARNATAKA',
            countryCode: 'IND',
            configDetails: {}
          }
        ],
        totalElements: 1
      };
      const action = new LoadStateDetails(payload);
      const outcome = new LoadStateDetailsSuccess(payloadRes);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: payloadRes });
      stateService.getStateDetails.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadStateDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: LoadStateListingPayload = {
        pageIndex: 0,
        pageSize: 100
      };
      const action = new LoadStateDetails(payload);
      const error = new Error('some error');
      const outcome = new LoadStateDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      stateService.getStateDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadStateDetails$).toBeObservable(expected);
    });
  });

  describe('LoadCountryDetails', () => {
    it('should return a stream with country list ', () => {
      const payloadRes: LoadCountryDetailsListingSuccessPayload = {
        countryDetailsListing: [{ countryCode: 'IND', description: 'INDIA' }],
        totalElements: 1
      };
      const action = new LoadCountryDetails();
      const outcome = new LoadCountryDetailsSuccess(payloadRes);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: payloadRes });
      stateService.getCountryDetails.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadCountryDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadCountryDetails();
      const error = new Error('some error');
      const outcome = new LoadCountryDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      stateService.getCountryDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadCountryDetails$).toBeObservable(expected);
    });
  });

  describe('loadStateByCode', () => {
    it('should return a stream with  state', () => {
      const payload = 'KA';
      const payloadRes: StateData = {
        configDetails: {},
        stateCode: 'KA',
        description: 'KARANATAKA',
        isUnionTerritory: false,
        isActive: false,
        countryCode: 'IND'
      };
      const action = new LoadStateByCode(payload);
      const outcome = new LoadStateByCodeSuccess(payloadRes);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: payloadRes });
      stateService.getStateByCode.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadStateByCode$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload = 'KA';
      const action = new LoadStateByCode(payload);
      const error = new Error('some error');
      const outcome = new LoadStateByCodeFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      stateService.getStateByCode.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadStateByCode$).toBeObservable(expected);
    });
  });

  describe('saveStateFormDetails', () => {
    it('should return a stream with state object', () => {
      const payload: SaveStateDetailsPayload = {
        configDetails: {},
        stateCode: 'KA',
        description: 'KARANATAKA',
        isUnionTerritory: false,
        isActive: false,
        countryCode: 'IND'
      };

      const payloadRes: SaveStateDetailsPayload = {
        configDetails: {},
        stateCode: 'KA',
        description: 'KARANATAKA',
        isUnionTerritory: false,
        isActive: false,
        countryCode: 'IND'
      };
      const action = new SaveStateFormDetails(payload);
      const outcome = new SaveStateFormDetailsSuccess(payloadRes);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: payloadRes });
      stateService.saveStateFormDetails.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.saveStateFormDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: SaveStateDetailsPayload = {
        configDetails: {},
        stateCode: 'KA',
        description: 'KARANATAKA',
        isUnionTerritory: false,
        isActive: false,
        countryCode: 'IND'
      };

      const action = new SaveStateFormDetails(payload);
      const error = new Error('some error');
      const outcome = new SaveStateFormDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      stateService.saveStateFormDetails.and.returnValue(response$);

      const expected = cold('--b', { b: outcome });
      expect(effect.saveStateFormDetails$).toBeObservable(expected);
    });
  });

  describe('editStateFormDetails', () => {
    it('should return a stream with updated state', () => {
      const payload: SaveStateDetailsPayload = {
        configDetails: {},
        stateCode: 'KA',
        description: 'KARANATAKA',
        isUnionTerritory: false,
        isActive: false,
        countryCode: 'IND'
      };
      const payloadRes: SaveStateDetailsPayload = {
        configDetails: {},
        stateCode: 'KA',
        description: 'KARANATAKA',
        isUnionTerritory: false,
        isActive: false,
        countryCode: 'IND'
      };

      const action = new EditStateDetails(payload);
      const outcome = new EditStateDetailsSuccess(payloadRes);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: payloadRes });
      stateService.editStateFormDetails.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.editStateFormDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: SaveStateDetailsPayload = {
        configDetails: {},
        stateCode: 'KA',
        description: 'KARANATAKA',
        isUnionTerritory: false,
        isActive: false,
        countryCode: 'IND'
      };
      const action = new EditStateDetails(payload);
      const error = new Error('some error');
      const outcome = new EditStateDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      stateService.editStateFormDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.editStateFormDetails$).toBeObservable(expected);
    });
  });

  describe('searchStateByCode', () => {
    it('searchStateByCode should return searched state ', () => {
      const payload = 'KA';
      const payloadRes: LoadStatesDetailsListingSuccessPayload = {
        stateDetailsListing: [
          {
            stateCode: 'KA',
            isActive: false,
            isUnionTerritory: false,
            description: 'KARNATAKA',
            countryCode: 'IND',
            configDetails: {}
          }
        ],
        totalElements: 1
      };
      const action = new SearchState(payload);
      const outcome = new SearchStateSuccess(payloadRes);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: payloadRes });
      stateService.searchStateByCode.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.searchStateByCode$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload = 'KA';
      const action = new SearchState(payload);
      const error = new Error('some error');
      const outcome = new SearchStateFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      stateService.searchStateByCode.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.searchStateByCode$).toBeObservable(expected);
    });
  });

  describe('updateIsActive', () => {
    it('updateIsActive should return update state ', () => {
      const payload: StateData = {
        configDetails: {},
        stateCode: 'KA',
        description: 'KARANATAKA',
        isUnionTerritory: false,
        isActive: false,
        countryCode: 'IND'
      };

      const action = new UpdateIsActive(payload);
      const outcome = new UpdateIsActiveSuccess('');
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: '' });
      stateService.updateIsActive.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.updateIsActive$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: StateData = {
        configDetails: {},
        stateCode: 'KA',
        description: 'KARANATAKA',
        isUnionTerritory: false,
        isActive: false,
        countryCode: 'IND'
      };
      const action = new UpdateIsActive(payload);
      const error = new Error('some error');
      const outcome = new UpdateIsActiveFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      stateService.updateIsActive.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.updateIsActive$).toBeObservable(expected);
    });
  });
});
