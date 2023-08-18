import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { DataPersistence } from '@nrwl/angular';
import { BankDepositDetails, CashDenomition } from '@poss-web/shared/models';
import { hot, cold } from 'jasmine-marbles';
import {
  POSS_WEB_API_URL,
  POSS_WEB_CACHING_STRATEGY
} from '@poss-web/shared/util-config';
import { Observable } from 'rxjs';
import { BoutiqueBankDepositService } from '../boutique-bank-deposit.service';
import { BoutiqueBankDepostEffects } from './boutique-bank-deposit.effects';
import { BoutiqueBankDepositSelectors } from './boutique-bank-deposit.selectors';
import { provideMockActions } from '@ngrx/effects/testing';
import {
  LoadBankDepositDetails,
  LoadBankDepositDetailsFailure,
  LoadBankDepositDetailsSuccess,
  LoadPendingDates,
  LoadPendingDatesFailure,
  LoadPendingDatesSuccess,
  SaveBankDepositDetails,
  SaveBankDepositDetailsFailure,
  SaveBankDepositDetailsSuccess,
  SaveCashDenomition,
  SaveCashDenomitionFailure,
  SaveCashDenomitionSuccess
} from './boutique-bank-deposit.actions';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
describe('BoutiqueBankDepostEffects Testing Suite', () => {
  const payload: any = {
    bankDeposit: [
      {
        amount: 0,
        approvalDetails: {
          data: {},
          type: 'Approve'
        },
        bankName: 'Axis',
        businessDate: '2020-10-16T16:28:13.029Z',
        collectionDate: '2020-10-16T16:28:13.029Z',
        depositAmount: 0,
        depositDate: '2020-10-16T16:28:13.029Z',
        depositDetails: {
          data: {},
          type: 'string'
        },
        id: 'ABC'
      }
    ]
  };
  const boutiqueBankDepositDetails: BankDepositDetails[] = [
    {
      collectionDate: '2020-10-09',
      paymentCode: 'CASH',
      locationCode: 'URB',
      payerBankName: 'AXIS',
      payeeBankName: ['AXIS', 'ICICI'],
      instrumentDate: '2020-10-09',
      depositDate: '2020-10-09',
      businessDate: '2020-10-09',
      instrumentNo: 12,
      amount: 12222,
      openingBalance: 12222,
      depositAmount: 12222,
      pifNo: 12222,
      midCode: 1222,
      depositDetails: {},
      isGhsIncluded: true,
      depositSlipNo: 123,
      password: 'Welcome@123',
      approvalDetails: {},
      isBankingCompleted: true,
      id: 'abc',
      depositedSlipDate: '2020-10-19'
    }
  ];
  let actions$: Observable<any>;
  let effect: BoutiqueBankDepostEffects;
  const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'httpClient',
    ['get']
  );
  const initialState = {};
  const boutiqueBankDepositServiceSpy = jasmine.createSpyObj<
    BoutiqueBankDepositService
  >([
    'loadBankDepositDetails',
    'saveBankDepostDetails',
    'saveCashDenomiton',
    'loadPendingGHSDates'
  ]);
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BoutiqueBankDepostEffects,
        DataPersistence,
        provideMockStore({ initialState }),
        provideMockActions(() => actions$),
        {
          provide: POSS_WEB_API_URL,
          useValue: ''
        },
        {
          provide: POSS_WEB_CACHING_STRATEGY,
          useValue: []
        },
        {
          provide: HttpClient,
          useValue: httpClientSpy
        },
        {
          provide: BoutiqueBankDepositService,
          useValue: boutiqueBankDepositServiceSpy
        }
      ]
    });
    effect = TestBed.inject(BoutiqueBankDepostEffects);
    //boutiqueBankDepositService = TestBed.get(BoutiqueBankDepositService);
  });

  describe('loadBankDepositDetails', () => {
    it('should return a stream with loadBankDepositDetails', () => {
      const parameters: string[] = ['CC', 'DD'];
      const action = new LoadBankDepositDetails(parameters);
      const outcome = new LoadBankDepositDetailsSuccess(
        boutiqueBankDepositDetails
      );
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: boutiqueBankDepositDetails });
      boutiqueBankDepositServiceSpy.loadBankDepositDetails.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadBankDepostDetails$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const parameters: string[] = ['CC', 'DD'];
      const action = new LoadBankDepositDetails(parameters);
      const error = new Error('some error');
      const outcome = new LoadBankDepositDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      boutiqueBankDepositServiceSpy.loadBankDepositDetails.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.loadBankDepostDetails$).toBeObservable(expected);
    });
  });

  describe('saveBankDepositDetails', () => {
    it('should return a stream with saveBankDepositDetails', () => {
      const action = new SaveBankDepositDetails(payload);
      const bankDepositDetails: BankDepositDetails[] = [
        {
          collectionDate: '2020-10-09',
          paymentCode: 'CASH',
          locationCode: 'URB',
          payerBankName: 'AXIS',
          payeeBankName: ['AXIS', 'ICICI'],
          instrumentDate: '2020-10-09',
          depositDate: '2020-10-09',
          businessDate: '2020-10-09',
          instrumentNo: 12,
          amount: 12222,
          openingBalance: 12222,
          depositAmount: 12222,
          pifNo: 12222,
          midCode: 1222,
          depositDetails: {},
          isGhsIncluded: true,
          depositSlipNo: 123,
          password: 'Welcome@123',
          approvalDetails: {},
          isBankingCompleted: true,
          id: 'abc',
          depositedSlipDate: '2020-10-19'
        }
      ];
      const outcome = new SaveBankDepositDetailsSuccess({
        data: bankDepositDetails,
        totalDepositAmount: 100
      });
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: { data: bankDepositDetails, totalDepositAmount: 100 }
      });
      boutiqueBankDepositServiceSpy.saveBankDepostDetails.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.saveBankDepositDetails$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new SaveBankDepositDetails(payload);
      const error = new Error('some error');
      const outcome = new SaveBankDepositDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      boutiqueBankDepositServiceSpy.saveBankDepostDetails.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.saveBankDepositDetails$).toBeObservable(expected);
    });
  });

  describe('SaveCashDenomition', () => {
    const paylo: CashDenomition = {
      bankDepositIds: ['123'],
      denominationDetails: {
        data: {},
        type: 'string'
      }
    };
    it('should return a stream with SaveCashDenomition', () => {
      const action = new SaveCashDenomition(payload);

      const outcome = new SaveCashDenomitionSuccess();
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', {
        a: null
      });
      boutiqueBankDepositServiceSpy.saveCashDenomiton.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.saveCashDenomition$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new SaveCashDenomition(paylo);
      const error = new Error('some error');
      const outcome = new SaveCashDenomitionFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      boutiqueBankDepositServiceSpy.saveCashDenomiton.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.saveCashDenomition$).toBeObservable(expected);
    });
  });

  describe('LoadPendingDates', () => {
    const response = ['123'];
    it('should return a stream with LoadPendingDates', () => {
      const action = new LoadPendingDates();

      const outcome = new LoadPendingDatesSuccess(response);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', {
        a: response
      });
      boutiqueBankDepositServiceSpy.loadPendingGHSDates.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadPendingDates$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new LoadPendingDates();
      const error = new Error('some error');
      const outcome = new LoadPendingDatesFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      boutiqueBankDepositServiceSpy.loadPendingGHSDates.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.loadPendingDates$).toBeObservable(expected);
    });
  });
});
