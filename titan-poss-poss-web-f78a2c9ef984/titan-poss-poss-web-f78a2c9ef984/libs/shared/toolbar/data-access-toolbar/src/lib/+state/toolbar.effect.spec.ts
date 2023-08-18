import { TestBed } from '@angular/core/testing';
import { DataPersistence } from '@nrwl/angular';
import { Observable } from 'rxjs';
import { ToolbarService } from '../toolbar.service';
import { ToolbarEffect } from './toolbar.effect';
import { initialState, TOOLBAR_FEATURE_KEY } from './toolbar.reducer';
import { provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import {
  MetalPrice,
  StatusTypesEnum,
  TransactionCount,
  TransactionDetails,
  TransactionListCountPayload,
  TransactionListPayload
} from '@poss-web/shared/models';
import * as moment from 'moment';
import { hot, cold } from 'jasmine-marbles';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  LoadMetalPriceDetails,
  LoadMetalPriceDetailsFailure,
  LoadMetalPriceDetailsSuccess,
  LoadOnHold,
  LoadOnHoldCount,
  LoadOnHoldCountFailure,
  LoadOnHoldCountSuccess,
  LoadOnHoldSuccess,
  LoadOpenOrders,
  LoadOpenOrdersCount,
  LoadOpenOrdersCountFailure,
  LoadOpenOrdersCountSuccess,
  LoadOpenOrdersFailure,
  LoadOpenOrdersSuccess,
  ResetOnHold,
  ResetOpenOrders
} from './toolbar.actions';

describe('Toolabr Effect Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: ToolbarEffect;

  const toolbarServiceSpy = jasmine.createSpyObj<ToolbarService>([
    'getMaterialPriceDetails',
    'loadTransactionList',
    'loadTransactionListCount'
  ]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ToolbarEffect,
        DataPersistence,
        provideMockStore({
          initialState: {
            [TOOLBAR_FEATURE_KEY]: initialState
          }
        }),
        provideMockActions(() => actions$),

        {
          provide: ToolbarService,
          useValue: toolbarServiceSpy
        }
      ]
    });

    effect = TestBed.inject(ToolbarEffect);
  });

  describe('loadMetalPriceDetails', () => {
    const dummyMetalPriceResponse: MetalPrice[] = [
      {
        applicableDate: new Date('2021-01-06T10:19:19+05:30'),
        // currency: 'INR',
        karatage: 0,
        metalName: 'Platinum',
        metalTypeCode: 'L',
        offset: 1,
        purity: 95,
        ratePerUnit: 3465,
        unit: 'gms'
      }
    ];

    it('should return a loadMetalPriceDetails', () => {
      const action = new LoadMetalPriceDetails();
      const outcome = new LoadMetalPriceDetailsSuccess(dummyMetalPriceResponse);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: dummyMetalPriceResponse });
      toolbarServiceSpy.getMaterialPriceDetails.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.loadMetalPriceDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadMetalPriceDetails();
      const error = new Error('some error');
      const outcome = new LoadMetalPriceDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      toolbarServiceSpy.getMaterialPriceDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadMetalPriceDetails$).toBeObservable(expected);
    });
  });

  describe('openOrders', () => {
    const dummyTransactionListPayload: TransactionListPayload = {
      pageIndex: 0,
      pageSize: 10,
      searchValue: 'Test1',
      status: 'OPEN',
      txnType: 'CM',
      subTxnType: 'NEW_CM'
    };

    const dummyTransactionDetailsResponse: TransactionDetails[] = [
      {
        customerId: 101,
        customerName: 'TESTING',
        docDate: moment(1611513000000),
        docNo: 15,
        firstHoldTime: moment(1611667249687),
        fiscalYear: 2020,
        id: '1681C56A-9080-427A-8B9A-3C6FC9369399',
        lastHoldTime: moment(1611667249687),
        locationCode: 'CPD',
        // mobileNumber: '8645635697',
        status: StatusTypesEnum.HOLD,
        subTxnType: 'NEW_CM',
        txnType: 'CM',
        totalElements: 10
      }
    ];

    it('should return a LoadOpenOrders', () => {
      const action = new LoadOpenOrders(dummyTransactionListPayload);
      const outcome = new LoadOpenOrdersSuccess(
        dummyTransactionDetailsResponse
      );
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', {
        b: dummyTransactionDetailsResponse
      });
      toolbarServiceSpy.loadTransactionList.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.openOrders$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadOpenOrders(dummyTransactionListPayload);
      const error = new Error('some error');
      const outcome = new ResetOpenOrders();
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      toolbarServiceSpy.loadTransactionList.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.openOrders$).toBeObservable(expected);
    });
  });

  describe('openOrdersCount', () => {
    const dummyTransactionListCountPayload: TransactionListCountPayload = {
      status: 'HOLD',
      txnType: 'CM',
      subTxnType: 'NEW_CM'
    };

    const dummyTransactionCountResponse: TransactionCount[] = [
      {
        count: 10,
        txnType: 'CM',
        subTxnType: 'NEW_CM'
      }
    ];

    it('should return a openOrdersCount', () => {
      const action = new LoadOpenOrdersCount(dummyTransactionListCountPayload);
      const outcome = new LoadOpenOrdersCountSuccess(
        dummyTransactionCountResponse
      );
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', {
        b: dummyTransactionCountResponse
      });
      toolbarServiceSpy.loadTransactionListCount.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.openOrdersCount$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadOpenOrdersCount(dummyTransactionListCountPayload);
      const error = new Error('some error');
      const outcome = new LoadOpenOrdersCountFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      toolbarServiceSpy.loadTransactionListCount.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.openOrdersCount$).toBeObservable(expected);
    });
  });

  describe('openOrders', () => {
    const dummyTransactionListPayload: TransactionListPayload = {
      pageIndex: 0,
      pageSize: 10,
      searchValue: 'Test1',
      status: 'OPEN',
      txnType: 'CM',
      subTxnType: 'NEW_CM'
    };

    const dummyTransactionDetailsResponse: TransactionDetails[] = [
      {
        customerId: 101,
        customerName: 'TESTING',
        docDate: moment(1611513000000),
        docNo: 15,
        firstHoldTime: moment(1611667249687),
        fiscalYear: 2020,
        id: '1681C56A-9080-427A-8B9A-3C6FC9369399',
        lastHoldTime: moment(1611667249687),
        locationCode: 'CPD',
        // mobileNumber: '8645635697',
        status: StatusTypesEnum.HOLD,
        subTxnType: 'NEW_CM',
        txnType: 'CM',
        totalElements: 10
      }
    ];

    it('should return a LoadOpenOrders', () => {
      const action = new LoadOpenOrders(dummyTransactionListPayload);
      const outcome = new LoadOpenOrdersSuccess(
        dummyTransactionDetailsResponse
      );
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', {
        b: dummyTransactionDetailsResponse
      });
      toolbarServiceSpy.loadTransactionList.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.openOrders$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadOpenOrders(dummyTransactionListPayload);
      const error = new Error('some error');
      const outcome = new ResetOpenOrders();
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      toolbarServiceSpy.loadTransactionList.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.openOrders$).toBeObservable(expected);
    });
  });

  describe('openOrdersCount', () => {
    const dummyTransactionListCountPayload: TransactionListCountPayload = {
      status: 'HOLD',
      txnType: 'CM',
      subTxnType: 'NEW_CM'
    };

    const dummyTransactionCountResponse: TransactionCount[] = [
      {
        count: 10,
        txnType: 'CM',
        subTxnType: 'NEW_CM'
      }
    ];

    it('should return a openOrdersCount', () => {
      const action = new LoadOpenOrdersCount(dummyTransactionListCountPayload);
      const outcome = new LoadOpenOrdersCountSuccess(
        dummyTransactionCountResponse
      );
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', {
        b: dummyTransactionCountResponse
      });
      toolbarServiceSpy.loadTransactionListCount.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.openOrdersCount$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadOpenOrdersCount(dummyTransactionListCountPayload);
      const error = new Error('some error');
      const outcome = new LoadOpenOrdersCountFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      toolbarServiceSpy.loadTransactionListCount.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.openOrdersCount$).toBeObservable(expected);
    });
  });

  describe('onHold', () => {
    const dummyTransactionListPayload: TransactionListPayload = {
      pageIndex: 0,
      pageSize: 10,
      searchValue: 'Test1',
      status: 'OPEN',
      txnType: 'CM',
      subTxnType: 'NEW_CM'
    };

    const dummyTransactionDetailsResponse: TransactionDetails[] = [
      {
        customerId: 101,
        customerName: 'TESTING',
        docDate: moment(1611513000000),
        docNo: 15,
        firstHoldTime: moment(1611667249687),
        fiscalYear: 2020,
        id: '1681C56A-9080-427A-8B9A-3C6FC9369399',
        lastHoldTime: moment(1611667249687),
        locationCode: 'CPD',
        // mobileNumber: '8645635697',
        status: StatusTypesEnum.HOLD,
        subTxnType: 'NEW_CM',
        txnType: 'CM',
        totalElements: 10
      }
    ];

    it('should return a LoadOnHold', () => {
      const action = new LoadOnHold(dummyTransactionListPayload);
      const outcome = new LoadOnHoldSuccess(dummyTransactionDetailsResponse);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', {
        b: dummyTransactionDetailsResponse
      });
      toolbarServiceSpy.loadTransactionList.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.onHold$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadOnHold(dummyTransactionListPayload);
      const error = new Error('some error');
      const outcome = new ResetOnHold();
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      toolbarServiceSpy.loadTransactionList.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.onHold$).toBeObservable(expected);
    });
  });

  describe('onHoldCount', () => {
    const dummyTransactionListCountPayload: TransactionListCountPayload = {
      status: 'HOLD',
      txnType: 'CM',
      subTxnType: 'NEW_CM'
    };

    const dummyTransactionCountResponse: TransactionCount[] = [
      {
        count: 10,
        txnType: 'CM',
        subTxnType: 'NEW_CM'
      }
    ];

    it('should return a openOrdersCount', () => {
      const action = new LoadOnHoldCount(dummyTransactionListCountPayload);
      const outcome = new LoadOnHoldCountSuccess(dummyTransactionCountResponse);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', {
        b: dummyTransactionCountResponse
      });
      toolbarServiceSpy.loadTransactionListCount.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.onHoldCount$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadOnHoldCount(dummyTransactionListCountPayload);
      const error = new Error('some error');
      const outcome = new LoadOnHoldCountFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      toolbarServiceSpy.loadTransactionListCount.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.onHoldCount$).toBeObservable(expected);
    });
  });
});
