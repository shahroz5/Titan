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
  PaymentMasterListPayload,
  PaymentMasterList,
  SavePaymentMasterPayload,
  UpdatePaymentMasterPayload,
  PaymentMaster
} from '@poss-web/shared/models';

import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { PaymentMasterEffects } from './payment-master.effects';
import { PaymentMasterService } from '../payment-master.service';
import {
  LoadPaymentMasterList,
  UpdatePaymentMaster,
  UpdatePaymentMasterSuccess,
  UpdatePaymentMasterFailure,
  LoadPaymentMasterByPaymentCodeSuccess,
  LoadPaymentMasterByPaymentCodeFailure,
  LoadPaymentMasterByPaymentCode,
  SearchPaymentMasterSuccess,
  SearchPaymentMaster,
  SearchPaymentMasterFailure,
  LoadPaymentMasterListSuccess,
  LoadPaymentMasterListFailure,
  SavePaymentMaster,
  SavePaymentMasterSuccess,
  SavePaymentMasterFailure
} from './payment-master.actions';

describe('PaymentMasterEffects Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: PaymentMasterEffects;
  const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'httpClient',
    ['get', 'post', 'patch']
  );
  const initialState = {};
  let paymentMasterService = jasmine.createSpyObj<PaymentMasterService>(
    'paymentMasterService',
    [
      'getPaymentMasterList',
      'loadPaymentMasterByPaymentCode',
      'savePaymentMaster',
      'updatePaymentMaster',
      'searchPaymentMaster'
    ]
  );

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PaymentMasterEffects,
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
          provide: PaymentMasterService,
          useValue: {
            getPaymentMasterList: jasmine.createSpy(),
            loadPaymentMasterByPaymentCode: jasmine.createSpy(),
            savePaymentMaster: jasmine.createSpy(),
            updatePaymentMaster: jasmine.createSpy(),
            searchPaymentMaster: jasmine.createSpy()
          }
        }
      ]
    });

    effect = TestBed.inject(PaymentMasterEffects);
    paymentMasterService = TestBed.inject<any>(PaymentMasterService);
  });

  describe('loadPaymentMasterList', () => {
    it('should return a stream with payment mode list', () => {
      const payload: PaymentMasterListPayload = {
        pageIndex: 0,
        pageSize: 100,
        length: 0
      };
      const res: PaymentMasterList = {
        results: [
          {
            paymentCode: 'GPAY',
            type: 'wallet',
            description: 'gogglePay',
            isActive: true,
            referenceOne: 'transactionId',
            customerDependent: true,
            isEditable: false
          }
        ],
        totalElements: 1
      };
      const action = new LoadPaymentMasterList(payload);
      const outcome = new LoadPaymentMasterListSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      paymentMasterService.getPaymentMasterList.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadPaymentMasterList$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: PaymentMasterListPayload = {
        pageIndex: 0,
        pageSize: 100,
        length: 0
      };

      const action = new LoadPaymentMasterList(payload);
      const error = new Error('some error');
      const outcome = new LoadPaymentMasterListFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      paymentMasterService.getPaymentMasterList.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadPaymentMasterList$).toBeObservable(expected);
    });
  });

  describe('savePaymentMaster', () => {
    it('should return a stream with payment master ', () => {
      const payload: SavePaymentMasterPayload = {
        paymentGroup: 'WALLET',
        data: {
          paymentCode: 'gpay',
          description: 'gogglePay',
          isActive: true,

          customerDependent: true,
          fieldDetails: [
            {
              fieldCode: 'transaction_id',
              fieldName: 'transactionid',
              fieldType: null,
              fieldRegex: null
            }
          ]
        }
      };

      const action = new SavePaymentMaster(payload);
      const outcome = new SavePaymentMasterSuccess();
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: {} });
      paymentMasterService.savePaymentMaster.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.savePaymentMaster$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: SavePaymentMasterPayload = {
        paymentGroup: 'WALLET',
        data: {
          paymentCode: 'gpay',
          description: 'gogglePay',
          isActive: true,

          customerDependent: true,
          fieldDetails: [
            {
              fieldCode: 'transaction_id',
              fieldName: 'transactionid',
              fieldType: null,
              fieldRegex: null
            }
          ]
        }
      };
      const action = new SavePaymentMaster(payload);
      const error = new Error('some error');
      const outcome = new SavePaymentMasterFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      paymentMasterService.savePaymentMaster.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.savePaymentMaster$).toBeObservable(expected);
    });
  });

  describe('updatePaymentMaster', () => {
    it('should return a stream with updated payment master', () => {
      const payload: UpdatePaymentMasterPayload = {
        paymentCode: 'GPAY',
        paymentGroup: 'WALLET',
        data: {
          isActive: false
        }
      };
      const action = new UpdatePaymentMaster(payload);
      const outcome = new UpdatePaymentMasterSuccess();
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: {} });
      paymentMasterService.updatePaymentMaster.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.updatePaymentMaster$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: UpdatePaymentMasterPayload = {
        paymentCode: 'GPAY',
        paymentGroup: 'WALLET',
        data: {
          isActive: false
        }
      };
      const action = new UpdatePaymentMaster(payload);
      const error = new Error('some error');
      const outcome = new UpdatePaymentMasterFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      paymentMasterService.updatePaymentMaster.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.updatePaymentMaster$).toBeObservable(expected);
    });
  });

  describe('loadPaymentMasterByPaymentCode', () => {
    it('should return a stream with  payment master  object', () => {
      const payload = 'GPAY';
      const res: PaymentMaster = {
        paymentCode: 'GPAY',
        type: 'wallet',
        description: 'gogglePay',
        isActive: true,
        referenceOne: 'transactionId',
        customerDependent: true,
        isEditable: false
      };
      const action = new LoadPaymentMasterByPaymentCode(payload);
      const outcome = new LoadPaymentMasterByPaymentCodeSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      paymentMasterService.loadPaymentMasterByPaymentCode.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadPaymentMasterByPaymentCode$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload = 'GPAY';
      const action = new LoadPaymentMasterByPaymentCode(payload);
      const error = new Error('some error');
      const outcome = new LoadPaymentMasterByPaymentCodeFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      paymentMasterService.loadPaymentMasterByPaymentCode.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.loadPaymentMasterByPaymentCode$).toBeObservable(expected);
    });
  });

  describe('searchPaymentMaster', () => {
    it('should return a stream with searched metal type', () => {
      const payload = 'GPAY';
      const res: PaymentMasterList = {
        results: [
          {
            paymentCode: 'GPAY',
            type: 'wallet',
            description: 'gogglePay',
            isActive: true,
            referenceOne: 'transactionId',
            customerDependent: true,
            isEditable: false
          }
        ],
        totalElements: 1
      };
      const action = new SearchPaymentMaster(payload);
      const outcome = new SearchPaymentMasterSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      paymentMasterService.searchPaymentMaster.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.searchPaymentMaster$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters = 'tanishq';
      const action = new SearchPaymentMaster(parameters);
      const error = new Error('some error');
      const outcome = new SearchPaymentMasterFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      paymentMasterService.searchPaymentMaster.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.searchPaymentMaster$).toBeObservable(expected);
    });
  });
});
