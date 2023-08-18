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
  VendorMasterListPayload,
  VendorMasterListing,
  VendorMaster
} from '@poss-web/shared/models';

import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { VendorMasterService } from '../vendor-master.service';

import { VendorMasterEffect } from './vendor-master.effect';
import {
  LoadVendorMasterList,
  LoadVendorMasterListSuccess,
  LoadVendorMasterListFailure,
  LoadVendorMasterByCode,
  LoadVendorMasterByCodeSuccess,
  LoadVendorMasterByCodeFailure,
  SearchVendorMasterByCodeSuccess,
  SearchVendorMasterByCodeFailure,
  SearchVendorMasterByCode
} from './vendor-master.action';

describe('VendorMasterEffect Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: VendorMasterEffect;
  const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'httpClient',
    ['get', 'post', 'patch']
  );
  const initialState = {};
  let vendorMasterService = jasmine.createSpyObj<VendorMasterService>(
    'VendorMasterService',
    [
      'getVendorMasterList',
      'getSearchVendorMasterList',
      'getVendorMasterByCode'
    ]
  );

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        VendorMasterEffect,
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
          provide: VendorMasterService,
          useValue: {
            getVendorMasterList: jasmine.createSpy(),
            getSearchVendorMasterList: jasmine.createSpy(),
            getVendorMasterByCode: jasmine.createSpy()
          }
        }
      ]
    });

    effect = TestBed.inject(VendorMasterEffect);
    vendorMasterService = TestBed.inject<any>(VendorMasterService);
  });

  describe('loadVendorMasterList', () => {
    it('should return a stream with vendor list', () => {
      const payload: VendorMasterListPayload = {
        pageIndex: 0,
        pageSize: 10
      };

      const res: VendorMasterListing = {
        results: [
          {
            vendorCode: 'EMAIL',
            vendorName: 'EMAIL',
            vendorDetail: '',
            baseUrl: 'email.com',
            vendorType: 'EMAIL'
          }
        ],
        totalElements: 1
      };

      const action = new LoadVendorMasterList(payload);
      const outcome = new LoadVendorMasterListSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      vendorMasterService.getVendorMasterList.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadVendorMasterList$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: VendorMasterListPayload = {
        pageIndex: 0,
        pageSize: 10
      };
      const action = new LoadVendorMasterList(payload);
      const error = new Error('some error');
      const outcome = new LoadVendorMasterListFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      vendorMasterService.getVendorMasterList.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadVendorMasterList$).toBeObservable(expected);
    });
  });

  describe('loadVendorMasterByCode', () => {
    it('should return a stream with vendor details by vendor code', () => {
      const payload = 'EMAIL';

      const res: VendorMaster = {
        vendorCode: 'EMAIL',
        vendorName: 'EMAIL',
        vendorDetail: '',
        baseUrl: 'email.com',
        vendorType: 'EMAIL'
      };
      const action = new LoadVendorMasterByCode(payload);
      const outcome = new LoadVendorMasterByCodeSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      vendorMasterService.getVendorMasterByCode.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadVendorMasterByCode$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload = 'EMAIL';

      const action = new LoadVendorMasterByCode(payload);
      const error = new Error('some error');
      const outcome = new LoadVendorMasterByCodeFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      vendorMasterService.getVendorMasterByCode.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadVendorMasterByCode$).toBeObservable(expected);
    });
  });

  describe('searchVendorMasterList', () => {
    it('should return a stream with searched  vendor ', () => {
      const payload = 'EMAIL';

      const res: VendorMasterListing = {
        results: [
          {
            vendorCode: 'EMAIL',
            vendorName: 'EMAIL',
            vendorDetail: '',
            baseUrl: 'email.com',
            vendorType: 'EMAIL'
          }
        ],
        totalElements: 1
      };

      const action = new SearchVendorMasterByCode(payload);
      const outcome = new SearchVendorMasterByCodeSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      vendorMasterService.getSearchVendorMasterList.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.searchVendorMasterList$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload = 'EMAIL';
      const action = new SearchVendorMasterByCode(payload);
      const error = new Error('some error');
      const outcome = new SearchVendorMasterByCodeFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      vendorMasterService.getSearchVendorMasterList.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.searchVendorMasterList$).toBeObservable(expected);
    });
  });
});
