//you here need to assert a reactive result as well as trigger an effect.
//To assert that an effect returns the right observable stream, we can use
// Rx Marbles.
import { Observable, from } from 'rxjs';
import { hot, cold } from 'jasmine-marbles';

import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { HttpClient } from '@angular/common/http';

import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { DataPersistence } from '@nrwl/angular';
import {
  UcpMarketCodeListPayload,
  UcpMarketCode,
  UpdateUcpMarketCodePayload,
  UcpMarketCodeListing,
  SaveUcpMarketCodePayload,
  MarketCode,
  UcpProductGroup
} from '@poss-web/shared/models';
import { UcpMarketCodeFactorEffect } from './ucp-market-code-factor.effect';

import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { UcpMarketCodeFactorService } from '../ucp-market-code-factor.service';
import {
  LoadUCPMarketCodeFactorCodeListSuccess,
  LoadUCPMarketCodeFactorCodeList,
  LoadUCPMarketCodeFactorCodeListFailure,
  LoadUCPMarketCodeFactorByCodeSuccess,
  LoadUCPMarketCodeFactorByCodeFailure,
  LoadUCPMarketCodeFactorByCode,
  UpdateUCPMarketCodeFactorByCodeSuccess,
  UpdateUCPMarketCodeFactorByCode,
  UpdateUCPMarketCodeFactorByCodeFailure,
  SaveUCPMarketCodeFactorCodeSuccess,
  SaveUCPMarketCodeFactorCodeFailure,
  SaveUCPMarketCodeFactorCode,
  LoadMarketCodeSuccess,
  LoadMarketCodeFailure,
  LoadMarketCode,
  LoadUcpProductCodeSuccess,
  LoadUcpProductCodeFailure,
  LoadUcpProductCode
} from './ucp-market-code-factor.action';

describe('UcpMarketCodeFactorEffect Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: UcpMarketCodeFactorEffect;
  const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'httpClient',
    ['get', 'post', 'patch']
  );
  const initialState = {};
  let ucpMarketCodeFactorService = jasmine.createSpyObj<
    UcpMarketCodeFactorService
  >('UcpMarketCodeFactorService', [
    'getUcpMarketCodeFactorList',
    'getUcpMarketCodeFactorByCode',
    'updateUcpMarketCodeFactorByCode',
    'saveUcpMarketCodeFactor',
    'getMarketCode',
    'getUcpProductGroup'
  ]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UcpMarketCodeFactorEffect,
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
          provide: UcpMarketCodeFactorService,
          useValue: {
            getUcpMarketCodeFactorList: jasmine.createSpy(),
            getUcpMarketCodeFactorByCode: jasmine.createSpy(),
            updateUcpMarketCodeFactorByCode: jasmine.createSpy(),
            saveUcpMarketCodeFactor: jasmine.createSpy(),
            getMarketCode: jasmine.createSpy(),
            getUcpProductGroup: jasmine.createSpy()
          }
        }
      ]
    });

    effect = TestBed.inject(UcpMarketCodeFactorEffect);
    ucpMarketCodeFactorService = TestBed.inject<any>(
      UcpMarketCodeFactorService
    );
  });

  describe('loadUcpMarketCodeFactorList', () => {
    it('should return a stream with ucp market code  list', () => {
      const payload: UcpMarketCodeListPayload = {
        pageIndex: 1,
        pageSize: 10
      };

      const res: UcpMarketCodeListing = {
        results: [
          {
            marketCode: 'KA',
            id: '1',
            ucpCfa: '71',
            ucpFactor: '1.1'
          }
        ],
        totalElements: 10
      };

      const action = new LoadUCPMarketCodeFactorCodeList(payload);
      const outcome = new LoadUCPMarketCodeFactorCodeListSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      ucpMarketCodeFactorService.getUcpMarketCodeFactorList.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadUcpMarketCodeFactorList$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: UcpMarketCodeListPayload = {
        pageIndex: 1,
        pageSize: 10
      };
      const action = new LoadUCPMarketCodeFactorCodeList(payload);
      const error = new Error('some error');
      const outcome = new LoadUCPMarketCodeFactorCodeListFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      ucpMarketCodeFactorService.getUcpMarketCodeFactorList.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.loadUcpMarketCodeFactorList$).toBeObservable(expected);
    });
  });

  describe('loadUcpMarketCodeFactorByCode', () => {
    it('should return a stream with ucp market by code ', () => {
      const payload = '1';
      const res: UcpMarketCode = {
        marketCode: 'KA',
        id: '1',
        ucpCfa: '71',
        ucpFactor: '1.1'
      };

      const action = new LoadUCPMarketCodeFactorByCode(payload);
      const outcome = new LoadUCPMarketCodeFactorByCodeSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      ucpMarketCodeFactorService.getUcpMarketCodeFactorByCode.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadUcpMarketCodeFactorByCode$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload = '1';
      const action = new LoadUCPMarketCodeFactorByCode(payload);
      const error = new Error('some error');
      const outcome = new LoadUCPMarketCodeFactorByCodeFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      ucpMarketCodeFactorService.getUcpMarketCodeFactorByCode.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.loadUcpMarketCodeFactorByCode$).toBeObservable(expected);
    });
  });

  describe('updateUcpMarketCodeFactorByCode', () => {
    it('should return a stream with updateUcpMarketCodeFactorByCode success', () => {
      const payload: UpdateUcpMarketCodePayload = {
        data: {
          ucpFactor: 1
        },
        id: '1'
      };

      const action = new UpdateUCPMarketCodeFactorByCode(payload);
      const outcome = new UpdateUCPMarketCodeFactorByCodeSuccess();
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: {} });
      ucpMarketCodeFactorService.updateUcpMarketCodeFactorByCode.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.updateUcpMarketCodeFactorByCode$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: UpdateUcpMarketCodePayload = {
        data: {
          ucpFactor: 1
        },
        id: '1'
      };
      const action = new UpdateUCPMarketCodeFactorByCode(payload);
      const error = new Error('some error');
      const outcome = new UpdateUCPMarketCodeFactorByCodeFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      ucpMarketCodeFactorService.updateUcpMarketCodeFactorByCode.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.updateUcpMarketCodeFactorByCode$).toBeObservable(expected);
    });
  });

  describe('saveUcpMarketCodeFactor', () => {
    it('should return a stream with SaveUCPMarketCodeFactorCode Success', () => {
      const payload: SaveUcpMarketCodePayload = {
        marketCode: 'KA',
        markupFactor: 1,
        productGroupCode: '71'
      };

      const action = new SaveUCPMarketCodeFactorCode(payload);
      const outcome = new SaveUCPMarketCodeFactorCodeSuccess();
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: {} });

      ucpMarketCodeFactorService.saveUcpMarketCodeFactor.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.saveUcpMarketCodeFactor$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: SaveUcpMarketCodePayload = {
        marketCode: 'KA',
        markupFactor: 1,
        productGroupCode: '71'
      };

      const action = new SaveUCPMarketCodeFactorCode(payload);
      const error = new Error('some error');
      const outcome = new SaveUCPMarketCodeFactorCodeFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      ucpMarketCodeFactorService.saveUcpMarketCodeFactor.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.saveUcpMarketCodeFactor$).toBeObservable(expected);
    });
  });

  describe('loadMarketCode', () => {
    it('should return a stream with market codes', () => {
      const res: MarketCode[] = [
        {
          id: '29',
          name: 'KA'
        }
      ];

      const action = new LoadMarketCode();
      const outcome = new LoadMarketCodeSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      ucpMarketCodeFactorService.getMarketCode.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadMarketCode$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadMarketCode();
      const error = new Error('some error');
      const outcome = new LoadMarketCodeFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      ucpMarketCodeFactorService.getMarketCode.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadMarketCode$).toBeObservable(expected);
    });
  });

  describe('loadUcpProductGroup', () => {
    it('should return a stream with config  ', () => {
      const res: UcpProductGroup[] = [
        {
          id: '72',
          name: 'Gold studed'
        }
      ];
      const action = new LoadUcpProductCode();
      const outcome = new LoadUcpProductCodeSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      ucpMarketCodeFactorService.getUcpProductGroup.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadUcpProductGroup$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadUcpProductCode();
      const error = new Error('some error');
      const outcome = new LoadUcpProductCodeFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      ucpMarketCodeFactorService.getUcpProductGroup.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadUcpProductGroup$).toBeObservable(expected);
    });
  });
});
