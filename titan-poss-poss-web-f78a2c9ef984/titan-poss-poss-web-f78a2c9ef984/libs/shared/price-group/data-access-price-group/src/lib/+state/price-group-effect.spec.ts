//you here need to assert a reactive result as well as trigger an effect.
//To assert that an effect returns the right observable stream, we can use
// Rx Marbles.
import { Observable } from 'rxjs';
import { hot, cold } from 'jasmine-marbles';

import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { HttpClient } from '@angular/common/http';

import {
  StockReceiveLoadPendingPayload,
  PriceGroupListPayload,
  PriceGroupListing,
  UpdatePriceGroupMasterPayload,
  SavePriceGroupMasterPayload
} from '@poss-web/shared/models';

import { DataPersistence } from '@nrwl/angular';

import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  LoadPriceGroup,
  LoadPriceGroupSuccess,
  LoadPriceGroupFailure,
  LoadPriceGroupByPriceGroupCode,
  LoadPriceGroupByPriceGroupCodeSuccess,
  LoadPriceGroupByPriceGroupCodeFailure,
  UpdatePricGroupByPriceGroupCode,
  UpdatePricGroupByPriceGroupCodeSuccess,
  UpdatePricGroupByPriceGroupCodeFailure,
  SavePriceGroup,
  SavePriceGroupSuccess,
  SavePriceGroupFailure,
  SearchPriceGroupList,
  SearchPriceGroupListSuccess,
  SearchPriceGroupListFailure
} from './price-group-actions';
import { PriceGroupEffect } from './price-group-effect';
import { PriceGroupService } from '../price-group.service';

describe('Price Group Effects Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: PriceGroupEffect;
  const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'httpClient',
    ['get', 'post', 'patch']
  );
  const initialState = {};
  let priceGroupService = jasmine.createSpyObj<PriceGroupService>(
    'PriceGroupService',
    [
      'getPriceGroupMasterList',
      'getPriceGroupByPriceGroupCode',
      'updatePriceGroupByPriceGroupCode',
      'savePriceGroup',
      'searchPriceGroupList'
    ]
  );
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PriceGroupEffect,
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
          provide: PriceGroupService,
          useValue: {
            getPriceGroupMasterList: jasmine.createSpy(),
            getPriceGroupByPriceGroupCode: jasmine.createSpy(),
            updatePriceGroupByPriceGroupCode: jasmine.createSpy(),
            savePriceGroup: jasmine.createSpy(),
            searchPriceGroupList: jasmine.createSpy()
          }
        }
      ]
    });

    effect = TestBed.inject(PriceGroupEffect);
    priceGroupService = TestBed.inject<any>(PriceGroupService);
  });

  describe('loadPriceGroupList', () => {
    it('should return a stream with price group list', () => {
      const parameters: PriceGroupListPayload = {
        pageIndex: 0,
        pageSize: 100
      };
      const priceGroupListing: PriceGroupListing = {
        results: [
          {
            priceGroup: 'priceGroup1',
            description: 'priceGroup1',
            isActive: true
          }
        ],
        totalElements: 1
      };
      const action = new LoadPriceGroup(parameters);
      const outcome = new LoadPriceGroupSuccess(priceGroupListing);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: priceGroupListing });
      priceGroupService.getPriceGroupMasterList.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadPriceGroupList$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters: PriceGroupListPayload = {
        pageIndex: 0,
        pageSize: 100
      };

      const action = new LoadPriceGroup(parameters);
      const error = new Error('some error');
      const outcome = new LoadPriceGroupFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      priceGroupService.getPriceGroupMasterList.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadPriceGroupList$).toBeObservable(expected);
    });
  });
  describe('loadPriceGroupByPriceGroupCode', () => {
    it('should return a stream with price group object', () => {
      const parameters = 'priceGroup1';
      const priceGroup = {
        priceGroup: 'priceGroup1',
        description: 'priceGroup1',
        isActive: true
      };

      const action = new LoadPriceGroupByPriceGroupCode(parameters);
      const outcome = new LoadPriceGroupByPriceGroupCodeSuccess(priceGroup);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: priceGroup });
      priceGroupService.getPriceGroupByPriceGroupCode.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadPriceGroupByPriceGroupCode$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters = 'priceGroup1';
      const action = new LoadPriceGroupByPriceGroupCode(parameters);
      const error = new Error('some error');
      const outcome = new LoadPriceGroupByPriceGroupCodeFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      priceGroupService.getPriceGroupByPriceGroupCode.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.loadPriceGroupByPriceGroupCode$).toBeObservable(expected);
    });
  });
  describe('updatePriceGroupByPriceGroupCode', () => {
    it('should return a stream with price group list', () => {
      const parameters: UpdatePriceGroupMasterPayload = {
        priceGroup: 'priceGroup1',
        data: {
          isActive: true
        }
      };
      const action = new UpdatePricGroupByPriceGroupCode(parameters);
      const outcome = new UpdatePricGroupByPriceGroupCodeSuccess();
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', {});
      priceGroupService.updatePriceGroupByPriceGroupCode.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.updatePriceGroupByPriceGroupCode$).toBeObservable(
        expected$
      );
    });

    it('should fail and return an action with the error', () => {
      const parameters: UpdatePriceGroupMasterPayload = {
        priceGroup: 'priceGroup1',
        data: {
          isActive: true
        }
      };
      const action = new UpdatePricGroupByPriceGroupCode(parameters);
      const error = new Error('some error');
      const outcome = new UpdatePricGroupByPriceGroupCodeFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      priceGroupService.updatePriceGroupByPriceGroupCode.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.updatePriceGroupByPriceGroupCode$).toBeObservable(expected);
    });
  });
  describe('savePriceGroupMaster', () => {
    it('should return a stream with price group list', () => {
      const parameters: SavePriceGroupMasterPayload = {
        priceGroup: 'priceGroup1',
        description: 'priceGroup1',
        isActive: true
      };

      const action = new SavePriceGroup(parameters);
      const outcome = new SavePriceGroupSuccess();
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {});
      priceGroupService.savePriceGroup.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.savePriceGroupMaster$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters: SavePriceGroupMasterPayload = {
        priceGroup: 'priceGroup1',
        description: 'priceGroup1',
        isActive: true
      };

      const action = new SavePriceGroup(parameters);
      const error = new Error('some error');
      const outcome = new SavePriceGroupFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      priceGroupService.savePriceGroup.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.savePriceGroupMaster$).toBeObservable(expected);
    });
  });
  describe('searchPriceGroupList', () => {
    it('should return a stream with price group list', () => {
      const parameters = 'priceGroup1';
      const priceGroupListing: PriceGroupListing = {
        results: [
          {
            priceGroup: 'priceGroup1',
            description: 'priceGroup1',
            isActive: true
          }
        ],
        totalElements: 1
      };
      const action = new SearchPriceGroupList(parameters);
      const outcome = new SearchPriceGroupListSuccess(priceGroupListing);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: priceGroupListing });
      priceGroupService.searchPriceGroupList.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.searchPriceGroupList$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters = 'priceGroup1';
      const action = new SearchPriceGroupList(parameters);
      const error = new Error('some error');
      const outcome = new SearchPriceGroupListFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      priceGroupService.searchPriceGroupList.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.searchPriceGroupList$).toBeObservable(expected);
    });
  });
});
