import { Observable } from 'rxjs';
import { hot, cold } from 'jasmine-marbles';

import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { HttpClient } from '@angular/common/http';

import { DataPersistence } from '@nrwl/angular';

import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { ClubDiscountsEffect } from './clubbing-discount.effects';
import { ClubbingDiscountsService } from '../clubbing-discounts.service';

import {
  LoadClubbingDiscountConfigList,
  LoadClubbingDiscountConfigListSuccess,
  LoadClubbingDiscountConfigListFailure,
  SaveClubbingDiscountConfigList,
  SaveClubbingDiscountConfigListSuccess,
  SaveClubbingDiscountConfigListFailure,
  LoadType1Discounts,
  LoadType1DiscountsSuccess,
  LoadType1DiscountsFailure,
  LoadType2Discounts,
  LoadType2DiscountsSuccess,
  LoadType2DiscountsFailure,
  LoadType3Discounts,
  LoadType3DiscountsSuccess,
  LoadType3DiscountsFailure
} from './clubbing-discount.actions';
import {
  ClubDiscountsList,
  ClubDiscountsListPayload,
  ClubDiscountsSuccessList,
  DiscountTypeBasedCodes,
  SaveRulesPayload
} from '@poss-web/shared/models';

describe('  Currency Effects Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: ClubDiscountsEffect;
  const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'httpClient',
    ['get', 'post', 'patch']
  );
  const initialState = {};
  let clubbingDiscountService = jasmine.createSpyObj<ClubbingDiscountsService>(
    'ClubbingDiscountsService',
    [
      'loadClubbingDiscountConfigList',
      'getDiscountCodesByType',
      'saveClubbedDiscounts'
    ]
  );
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ClubDiscountsEffect,
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
          provide: ClubbingDiscountsService,
          useValue: {
            loadClubbingDiscountConfigList: jasmine.createSpy(),
            getDiscountCodesByType: jasmine.createSpy(),
            saveClubbedDiscounts: jasmine.createSpy()
          }
        }
      ]
    });

    effect = TestBed.inject(ClubDiscountsEffect);
    clubbingDiscountService = TestBed.inject<any>(ClubbingDiscountsService);
  });

  describe('loadGlLocationPaymentDetails', () => {
    it('should return a stream with Currency list', () => {
      const parameters: ClubDiscountsListPayload = {
        pageIndex: 0,
        pageSize: 100
      };
      const currencyListing: ClubDiscountsSuccessList = {
        clubDiscountsList: [],
        count: 1
      };
      const action = new LoadClubbingDiscountConfigList(parameters);
      const outcome = new LoadClubbingDiscountConfigListSuccess(
        currencyListing
      );
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: currencyListing });
      clubbingDiscountService.loadClubbingDiscountConfigList.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadDiscountConfigList$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters: ClubDiscountsListPayload = {
        pageIndex: 0,
        pageSize: 100
      };
      const action = new LoadClubbingDiscountConfigList(parameters);
      const error = new Error('some error');
      const outcome = new LoadClubbingDiscountConfigListFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      clubbingDiscountService.loadClubbingDiscountConfigList.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.loadDiscountConfigList$).toBeObservable(expected);
    });
  });

  describe('saveGlLocationPaymentDetails', () => {
    it('should return a stream with Currency list', () => {
      const parameters: SaveRulesPayload = {
        addRules: [
          {
            type1DiscountCode: 'AAA',
            type2DiscountCode: 'BBB',
            type3DiscountCode: 'CCC'
          }
        ],
        removeRules: []
      };
      const param2: ClubDiscountsList = {
        id: '4567890',
        type1DiscountCode: 'AAA',
        type2DiscountCode: 'BBB',
        type3DiscountCode: 'CCC'
      };

      const action = new SaveClubbingDiscountConfigList(parameters);
      const outcome = new SaveClubbingDiscountConfigListSuccess(param2);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: param2 });
      clubbingDiscountService.saveClubbedDiscounts.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.saveClubbedDiscountDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters: SaveRulesPayload = {
        addRules: [
          {
            type1DiscountCode: 'AAA',
            type2DiscountCode: 'BBB',
            type3DiscountCode: 'CCC'
          }
        ],
        removeRules: []
      };

      const action = new SaveClubbingDiscountConfigList(parameters);
      const error = new Error('some error');
      const outcome = new SaveClubbingDiscountConfigListFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      clubbingDiscountService.saveClubbedDiscounts.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.saveClubbedDiscountDetails$).toBeObservable(expected);
    });
  });

  describe('LoadType1Discounts', () => {
    it('should return a stream with Type 1 Discounts object', () => {
      const payload = 'TYPE1';
      const type1Codes: DiscountTypeBasedCodes[] = [
        {
          id: '12',
          discountCode: 'AAA'
        }
      ];

      const action = new LoadType1Discounts(payload);
      const outcome = new LoadType1DiscountsSuccess(type1Codes);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: type1Codes });
      clubbingDiscountService.getDiscountCodesByType.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadType1DiscountCodes$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload = 'TYPE1';
      const action = new LoadType1Discounts(payload);
      const error = new Error('some error');
      const outcome = new LoadType1DiscountsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      clubbingDiscountService.getDiscountCodesByType.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadType1DiscountCodes$).toBeObservable(expected);
    });
  });

  describe('LoadType1Discounts', () => {
    it('should return a stream with Type 1 Discounts object', () => {
      const payload = 'TYPE2';
      const type1Codes: DiscountTypeBasedCodes[] = [
        {
          id: '12',
          discountCode: 'AAA'
        }
      ];

      const action = new LoadType2Discounts(payload);
      const outcome = new LoadType2DiscountsSuccess(type1Codes);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: type1Codes });
      clubbingDiscountService.getDiscountCodesByType.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadType2DiscountCodes$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload = 'TYPE2';
      const action = new LoadType2Discounts(payload);
      const error = new Error('some error');
      const outcome = new LoadType2DiscountsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      clubbingDiscountService.getDiscountCodesByType.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadType2DiscountCodes$).toBeObservable(expected);
    });
  });

  describe('LoadType1Discounts', () => {
    it('should return a stream with Type 1 Discounts object', () => {
      const payload = 'TYPE3';
      const type1Codes: DiscountTypeBasedCodes[] = [
        {
          id: '12',
          discountCode: 'AAA'
        }
      ];

      const action = new LoadType3Discounts(payload);
      const outcome = new LoadType3DiscountsSuccess(type1Codes);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: type1Codes });
      clubbingDiscountService.getDiscountCodesByType.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadType3DiscountCodes$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload = 'TYPE3';
      const action = new LoadType3Discounts(payload);
      const error = new Error('some error');
      const outcome = new LoadType3DiscountsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      clubbingDiscountService.getDiscountCodesByType.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadType3DiscountCodes$).toBeObservable(expected);
    });
  });
});
