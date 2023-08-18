import { Observable } from 'rxjs';
import { hot, cold } from 'jasmine-marbles';

import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { HttpClient } from '@angular/common/http';

import { DataPersistence } from '@nrwl/angular';

import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { StoneTypeEffect } from './stone-type.effects';
import { StoneTypeService } from '../stone-type.service';
import {
  LoadStoneTypeListingPayload,
  LoadStoneTypeListingSuccessPayload,
  StoneTypeDetails,
  SaveStoneTypeFormDetailsPayload
} from '@poss-web/shared/models';
import {
  LoadStoneTypeDetails,
  LoadStoneTypeDetailsSuccess,
  LoadStoneTypeDetailsFailure,
  LoadStoneTypeByStoneTypeCode,
  LoadStoneTypeByStoneTypeCodeSuccess,
  LoadStoneTypeByStoneTypeCodeFailure,
  SaveStoneTypeFormDetails,
  SaveStoneTypeFormDetailsSuccess,
  SaveStoneTypeFormDetailsFailure,
  EditStoneTypeFormDetails,
  EditStoneTypeFormDetailsSuccess,
  EditStoneTypeFormDetailsFailure,
  SearchStoneTypeCode,
  SearchStoneTypeCodeSuccess,
  SearchStoneTypeCodeFailure
} from './stone-type.actions';

describe('  Stone Type Effects Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: StoneTypeEffect;
  const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'httpClient',
    ['get', 'post', 'patch']
  );
  const initialState = {};
  let stoneTypeService = jasmine.createSpyObj<StoneTypeService>(
    'StoneTypeService',
    [
      'getStoneTypeDetails',
      'getStoneTypeDetailsByStoneTypeCode',
      'saveStoneTypeFormDetails',
      'editStoneTypeFormDetails',
      'getStoneTypeSearchResult'
    ]
  );
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        StoneTypeEffect,
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
          provide: StoneTypeService,
          useValue: {
            getStoneTypeDetails: jasmine.createSpy(),
            getStoneTypeDetailsByStoneTypeCode: jasmine.createSpy(),
            saveStoneTypeFormDetails: jasmine.createSpy(),
            editStoneTypeFormDetails: jasmine.createSpy(),
            getStoneTypeSearchResult: jasmine.createSpy()
          }
        }
      ]
    });

    effect = TestBed.inject(StoneTypeEffect);
    stoneTypeService = TestBed.inject<any>(StoneTypeService);
  });

  describe('loadStoneTypeDetails', () => {
    it('should return a stream with stone type list', () => {
      const parameters: LoadStoneTypeListingPayload = {
        pageIndex: 0,
        pageSize: 100
      };
      const stoneTypeListing: LoadStoneTypeListingSuccessPayload = {
        stoneTypeListing: [
          {
            stoneTypeCode: 'stoneType1',
            configDetails: { karatageWeightPrint: 'ABC' },
            description: 'stoneType1',
            isActive: true
          }
        ],
        totalElements: 1
      };
      const action = new LoadStoneTypeDetails(parameters);
      const outcome = new LoadStoneTypeDetailsSuccess(stoneTypeListing);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: stoneTypeListing });
      stoneTypeService.getStoneTypeDetails.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadStoneTypeDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters: LoadStoneTypeListingPayload = {
        pageIndex: 0,
        pageSize: 100
      };

      const action = new LoadStoneTypeDetails(parameters);
      const error = new Error('some error');
      const outcome = new LoadStoneTypeDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      stoneTypeService.getStoneTypeDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadStoneTypeDetails$).toBeObservable(expected);
    });
  });
  describe('loadStonetypeByStoneTypeCode', () => {
    it('should return a stream with stone type object', () => {
      const parameters = 'stoneType1';
      const stoneType = {
        stoneTypeCode: 'stoneType1',
        configDetails: { karatageWeightPrint: 'ABC' },
        description: 'stoneType1',
        isActive: true
      };

      const action = new LoadStoneTypeByStoneTypeCode(parameters);
      const outcome = new LoadStoneTypeByStoneTypeCodeSuccess(stoneType);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: stoneType });
      stoneTypeService.getStoneTypeDetailsByStoneTypeCode.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadStoneTypeDetailsByStoneTypeCode$).toBeObservable(
        expected$
      );
    });

    it('should fail and return an action with the error', () => {
      const parameters = 'stoneType1';
      const action = new LoadStoneTypeByStoneTypeCode(parameters);
      const error = new Error('some error');
      const outcome = new LoadStoneTypeByStoneTypeCodeFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      stoneTypeService.getStoneTypeDetailsByStoneTypeCode.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.loadStoneTypeDetailsByStoneTypeCode$).toBeObservable(
        expected
      );
    });
  });

  describe('saveStonetype', () => {
    it('should return a stream with stone type list', () => {
      const parameters: SaveStoneTypeFormDetailsPayload = {
        stoneTypeCode: 'stoneType1',
        description: 'stoneType1',
        configDetails: { karatageWeightPrint: 'ABC' },
        isActive: true
      };

      const action = new SaveStoneTypeFormDetails(parameters);
      const outcome = new SaveStoneTypeFormDetailsSuccess(parameters);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: parameters });
      stoneTypeService.saveStoneTypeFormDetails.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.saveStoneTypeFormDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters: SaveStoneTypeFormDetailsPayload = {
        stoneTypeCode: 'stoneType1',
        description: 'stoneType1',
        configDetails: { karatageWeightPrint: 'ABC' },
        isActive: true
      };

      const action = new SaveStoneTypeFormDetails(parameters);
      const error = new Error('some error');
      const outcome = new SaveStoneTypeFormDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      stoneTypeService.saveStoneTypeFormDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.saveStoneTypeFormDetails$).toBeObservable(expected);
    });
  });

  describe('editStonetype', () => {
    it('should return a stream with stone type list', () => {
      const parameters: StoneTypeDetails = {
        stoneTypeCode: 'stoneType1',
        description: 'stoneType1',
        configDetails: { karatageWeightPrint: 'ABC' },
        isActive: true
      };

      const action = new EditStoneTypeFormDetails(parameters);
      const outcome = new EditStoneTypeFormDetailsSuccess(parameters);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: parameters });
      stoneTypeService.editStoneTypeFormDetails.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.editStoneTypeFormDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters: StoneTypeDetails = {
        stoneTypeCode: 'stoneType1',
        description: 'stoneType1',
        configDetails: { karatageWeightPrint: 'ABC' },
        isActive: true
      };

      const action = new EditStoneTypeFormDetails(parameters);
      const error = new Error('some error');
      const outcome = new EditStoneTypeFormDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      stoneTypeService.editStoneTypeFormDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.editStoneTypeFormDetails$).toBeObservable(expected);
    });
  });

  describe('searchStoneTypeList', () => {
    it('should return a stream with stone type list', () => {
      const parameters = 'stoneType1';
      const stoneTypeListing: StoneTypeDetails[] = [
        {
          stoneTypeCode: 'stoneType1',
          description: 'stoneType1',
          configDetails: { karatageWeightPrint: 'ABC' },
          isActive: true
        }
      ];
      const action = new SearchStoneTypeCode(parameters);
      const outcome = new SearchStoneTypeCodeSuccess(stoneTypeListing);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: stoneTypeListing });
      stoneTypeService.getStoneTypeSearchResult.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.searchStoneTypeFormDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters = 'stoneType1';
      const action = new SearchStoneTypeCode(parameters);
      const error = new Error('some error');
      const outcome = new SearchStoneTypeCodeFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      stoneTypeService.getStoneTypeSearchResult.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.searchStoneTypeFormDetails$).toBeObservable(expected);
    });
  });
});
