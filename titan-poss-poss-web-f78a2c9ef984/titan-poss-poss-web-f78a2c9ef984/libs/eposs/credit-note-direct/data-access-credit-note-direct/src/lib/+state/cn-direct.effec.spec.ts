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
  SearchPayloadReq,
  CnListRes,
  SaveCnActionPayload,
  UploadCNPayloadReq
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { CnDirectService } from '../cn-direct.service';
import { CnDirectEffect } from './cn-direct.effect';
import {
  SearchCnDirectListFailure,
  SearchCnDirectList,
  SearchCnDirectListSuccess,
  SaveCnDirectAction,
  SaveCnDirectActionFailure,
  SaveCnDirectActionSuccess,
  UploadCn,
  UploadCnFailure,
  UploadCnSuccess
} from './cn-direct.action';

describe('CnDirectEffect Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: CnDirectEffect;
  const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'httpClient',
    ['get', 'post', 'patch']
  );
  const initialState = {};
  let cnDirectService = jasmine.createSpyObj<CnDirectService>(
    'CnDirectService',
    ['searchCn', 'saveCnAction', 'uploadCnSearch']
  );

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CnDirectEffect,
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
          provide: CnDirectService,
          useValue: {
            searchCn: jasmine.createSpy(),
            saveCnAction: jasmine.createSpy(),
            uploadCnSearch: jasmine.createSpy()
          }
        }
      ]
    });

    effect = TestBed.inject(CnDirectEffect);
    cnDirectService = TestBed.inject<any>(CnDirectService);
  });

  describe('searchCnList', () => {
    const payload: SearchPayloadReq = {
      fiscalYear: '2020',
      cnNumber: 11,
      locationCode: 'CPD',
      pageEvent: {
        page: 0,
        size: 10
      }
    };
    it('should return a stream with cn  list', () => {
      const res: CnListRes = {
        cnList: [],
        totalElements: 0
      };

      const action = new SearchCnDirectList(payload);
      const outcome = new SearchCnDirectListSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      cnDirectService.searchCn.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.searchCnList$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new SearchCnDirectList(payload);
      const error = new Error('some error');
      const outcome = new SearchCnDirectListFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      cnDirectService.searchCn.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.searchCnList$).toBeObservable(expected);
    });
  });

  describe('saveCnApprovals', () => {
    const payload: SaveCnActionPayload = {
      cnIds: ['1'],
      operation: 'SUSPEND'
    };
    it('should return a stream with  saved ids', () => {
      const res = ['1', '2'];
      const action = new SaveCnDirectAction(payload);
      const outcome = new SaveCnDirectActionSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      cnDirectService.saveCnAction.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.saveCnApprovals$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new SaveCnDirectAction(payload);
      const error = new Error('some error');
      const outcome = new SaveCnDirectActionFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      cnDirectService.saveCnAction.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.saveCnApprovals$).toBeObservable(expected);
    });
  });

  describe('uploadCn', () => {
    const payload: UploadCNPayloadReq = {
      file: null,
      pageEvent: {
        page: 1,
        size: 10
      }
    };
    it('should return a stream with  saved ids', () => {
      const res: CnListRes = {
        cnList: [],
        totalElements: 0
      };
      const action = new UploadCn(payload);
      const outcome = new UploadCnSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      cnDirectService.uploadCnSearch.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.uploadCn$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new UploadCn(payload);
      const error = new Error('some error');
      const outcome = new UploadCnFailure(CustomErrorAdaptor.fromJson(error));
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      cnDirectService.uploadCnSearch.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.uploadCn$).toBeObservable(expected);
    });
  });
});
