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
  ComplexityListPayload,
  ComplexityListing,
  ComplexityCode
} from '@poss-web/shared/models';

import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { ComplexityCodeEffect } from './complexity-code.effects';
import { ComplexityCodeService } from '../complexity-code.service';

import {
  LoadComplexityCodeList,
  LoadComplexityCodeListSuccess,
  LoadComplexityCodeListFailure,
  SaveComplexityCode,
  SaveComplexityCodeSuccess,
  SaveComplexityCodeFailure,
  UpdateComplexityByCode,
  UpdateComplexityByCodeSuccess,
  UpdateComplexityByCodeFailure,
  LoadComplexityByCode,
  LoadComplexityByCodeSuccess,
  LoadComplexityByCodeFailure,
  SearchComplexityCode,
  SearchComplexityCodeSuccess,
  SearchComplexityCodeFailure
} from './complexity-code.actions';

describe('ComplexityCodeEffect Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: ComplexityCodeEffect;
  const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'httpClient',
    ['get', 'post', 'patch']
  );
  const initialState = {};
  let complexityCodeService = jasmine.createSpyObj<ComplexityCodeService>(
    'complexityCodeService',
    [
      'getComplexityCodeList',
      'getComplexityByCode',
      'saveComplexityCode',
      'updateComplexityCode',
      'searchComplexityCode'
    ]
  );

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ComplexityCodeEffect,
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
          provide: ComplexityCodeService,
          useValue: {
            getComplexityCodeList: jasmine.createSpy(),
            getComplexityByCode: jasmine.createSpy(),
            saveComplexityCode: jasmine.createSpy(),
            updateComplexityCode: jasmine.createSpy(),
            searchComplexityCode: jasmine.createSpy()
          }
        }
      ]
    });

    effect = TestBed.inject(ComplexityCodeEffect);
    complexityCodeService = TestBed.inject<any>(ComplexityCodeService);
  });

  describe('loadComplexityCodeList', () => {
    it('should return a stream with complexity code list', () => {
      const payload: ComplexityListPayload = {
        pageIndex: 0,
        pageSize: 100
      };
      const metalTypeList: ComplexityListing = {
        results: [],
        totalElements: 0
      };
      const action = new LoadComplexityCodeList(payload);
      const outcome = new LoadComplexityCodeListSuccess(metalTypeList);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: metalTypeList });
      complexityCodeService.getComplexityCodeList.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadComplexityCodeList$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: ComplexityListPayload = {
        pageIndex: 0,
        pageSize: 100
      };

      const action = new LoadComplexityCodeList(payload);
      const error = new Error('some error');
      const outcome = new LoadComplexityCodeListFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      complexityCodeService.getComplexityCodeList.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadComplexityCodeList$).toBeObservable(expected);
    });
  });

  describe('saveComplexityCode', () => {
    it('should return a stream with complexity code ', () => {
      const parameters: ComplexityCode = {
        complexityCode: 'ABC',
        description: 'ABC',
        isActive: true
      };

      const action = new SaveComplexityCode(parameters);
      const outcome = new SaveComplexityCodeSuccess();
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: parameters });
      complexityCodeService.saveComplexityCode.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.saveComplexityCode$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters: ComplexityCode = {
        complexityCode: 'ABC',
        description: 'ABC',
        isActive: true
      };
      const action = new SaveComplexityCode(parameters);
      const error = new Error('some error');
      const outcome = new SaveComplexityCodeFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      complexityCodeService.saveComplexityCode.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.saveComplexityCode$).toBeObservable(expected);
    });
  });

  describe('UpdateComplexityByCode', () => {
    it('should return a stream with updated complexity code', () => {
      const parameters: ComplexityCode = {
        complexityCode: 'ABC',
        description: 'ABC',
        isActive: true
      };

      const action = new UpdateComplexityByCode(parameters);
      const outcome = new UpdateComplexityByCodeSuccess();
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', {});
      complexityCodeService.updateComplexityCode.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.updateComplexityByCode$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters: ComplexityCode = {
        complexityCode: 'ABC',
        description: 'ABC',
        isActive: true
      };
      const action = new UpdateComplexityByCode(parameters);
      const error = new Error('some error');
      const outcome = new UpdateComplexityByCodeFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      complexityCodeService.updateComplexityCode.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.updateComplexityByCode$).toBeObservable(expected);
    });
  });

  describe('LoadComplexityByCode', () => {
    it('should return a stream with complexity code  object', () => {
      const payload = 'ABC';
      const res: ComplexityCode = {
        complexityCode: 'ABC',
        description: 'ABC',
        isActive: true
      };

      const action = new LoadComplexityByCode(payload);
      const outcome = new LoadComplexityByCodeSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      complexityCodeService.getComplexityByCode.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadComplexityByCode$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters = 'ABC';
      const action = new LoadComplexityByCode(parameters);
      const error = new Error('some error');
      const outcome = new LoadComplexityByCodeFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      complexityCodeService.getComplexityByCode.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadComplexityByCode$).toBeObservable(expected);
    });
  });

  describe('SearchComplexityCode', () => {
    it('should return a stream with searched complexity code', () => {
      const payload = 'ABC';
      const res: ComplexityListing = {
        totalElements: 1,
        results: [
          {
            complexityCode: 'ABC',
            description: 'ABC',
            isActive: true
          }
        ]
      };
      const action = new SearchComplexityCode(payload);
      const outcome = new SearchComplexityCodeSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      complexityCodeService.searchComplexityCode.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.searchComplexityCode$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters = 'ABC';
      const action = new SearchComplexityCode(parameters);
      const error = new Error('some error');
      const outcome = new SearchComplexityCodeFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      complexityCodeService.searchComplexityCode.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.searchComplexityCode$).toBeObservable(expected);
    });
  });
});
