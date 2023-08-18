import { TestBed } from '@angular/core/testing';
import { DataPersistence } from '@nrwl/angular';
import { Observable } from 'rxjs';
import { PasswordConfigService } from '../password-config.service';
import { PasswordConfigEffects } from './password-config.effect';
import {
  initialState,
  passwordConfigFeatureKey
} from './password-config.reducer';
import { provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import {
  GenerateBoutiquePasswordForGoldRateRequest,
  GenerateBoutiquePasswordForGoldRateResponse,
  GenerateBoutiquePasswordForManualBillRequest,
  GenerateBoutiquePasswordForManualBillResponse,
  GenerateCashDepositPasswordRequest,
  GenerateCashDepositPasswordResponse,
  LocationSummaryList,
  MetalRates,
  MetalRatesPayload,
  TransactionTypes
} from '@poss-web/shared/models';
import * as moment from 'moment';
import {
  GenerateBoutiquePasswordForGoldRate,
  GenerateBoutiquePasswordForGoldRateFailure,
  GenerateBoutiquePasswordForGoldRateSuccess,
  GenerateBoutiquePasswordForManualBill,
  GenerateBoutiquePasswordForManualBillFailure,
  GenerateBoutiquePasswordForManualBillSuccess,
  GenerateCashDepositPassword,
  GenerateCashDepositPasswordFailure,
  GenerateCashDepositPasswordSuccess,
  GetDocumentTypes,
  GetDocumentTypesFailure,
  GetDocumentTypesSuccess,
  GetLocationCodes,
  GetLocationCodesFailure,
  GetLocationCodesSuccess,
  GetMaterialPrices,
  GetMaterialPricesFailure,
  GetMaterialPricesSuccess
} from './password-config.actions';
import { hot, cold } from 'jasmine-marbles';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  LocationDataService,
  PaymentDataService
} from '@poss-web/shared/masters/data-access-masters';
import { CommonService } from '@poss-web/shared/common/data-access-common';

describe('Password Config Effect Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: PasswordConfigEffects;

  const passwordConfigServiceSpy = jasmine.createSpyObj<PasswordConfigService>([
    'generateCashDepositPassword',
    'generateBoutiquePasswordForManualBill',
    'generateBoutiquePasswordForGoldRate'
  ]);

  const locationServiceSpy = jasmine.createSpyObj<LocationDataService>([
    'getLocationSummaryList'
  ]);

  const paymentDataServiceSpy = jasmine.createSpyObj<PaymentDataService>([
    'getPaymentTransactionTypes'
  ]);

  const commonServiceSpy = jasmine.createSpyObj<CommonService>([
    'getStandardMaterialPriceDetailsHistory'
  ]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PasswordConfigEffects,
        DataPersistence,
        provideMockStore({
          initialState: {
            [passwordConfigFeatureKey]: initialState
          }
        }),
        provideMockActions(() => actions$),

        {
          provide: PasswordConfigService,
          useValue: passwordConfigServiceSpy
        },
        {
          provide: LocationDataService,
          useValue: locationServiceSpy
        },
        {
          provide: PaymentDataService,
          useValue: paymentDataServiceSpy
        },
        {
          provide: CommonService,
          useValue: commonServiceSpy
        }
      ]
    });

    effect = TestBed.inject(PasswordConfigEffects);
  });

  describe('generateCashDepositPassword', () => {
    const dummyCashDepositPasswordRequest: GenerateCashDepositPasswordRequest = {
      businessDate: moment('2020-11-17T04:59:43.172Z').valueOf(),
      collectionDate: moment('2020-11-17T04:59:43.172Z').valueOf(),
      depositAmount: 1000,
      locationCode: 'URB',
      remarks: 'Testing Remarks'
    };

    const dummyCashDepositPasswordResponse: GenerateCashDepositPasswordResponse = {
      businessDate: moment(1605589183172),
      collectionDate: moment(1605589183172),
      depositAmount: 1000,
      remarks: 'Testing Remarks',
      locationCode: 'URB',
      id: '6511827d-733c-469c-9e86-7489bcd47f1e',
      password: '5dbh4o3+y74='
    };

    it('should return a generateCashDepositPassword', () => {
      const action = new GenerateCashDepositPassword(
        dummyCashDepositPasswordRequest
      );
      const outcome = new GenerateCashDepositPasswordSuccess(
        dummyCashDepositPasswordResponse
      );
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: dummyCashDepositPasswordResponse });
      passwordConfigServiceSpy.generateCashDepositPassword.and.returnValue(
        response$
      );

      const expected$ = cold('--c', { c: outcome });

      expect(effect.generateCashDepostPassword$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new GenerateCashDepositPassword(
        dummyCashDepositPasswordRequest
      );
      const error = new Error('some error');
      const outcome = new GenerateCashDepositPasswordFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      passwordConfigServiceSpy.generateCashDepositPassword.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.generateCashDepostPassword$).toBeObservable(expected);
    });
  });

  describe('generateManualBillPassword', () => {
    const dummyBoutiquePasswordForManualBillRequest: GenerateBoutiquePasswordForManualBillRequest = {
      locationCode: 'CPD',
      manualBillDate: moment('2021-01-06T10:19:19+05:30').valueOf(),
      manualBillNo: '12',
      manualBillValue: 12000,
      metalRates: {
        J: { metalTypeCode: 'J', totalMetalWeight: 12, ratePerUnit: 4694 }
      },
      remarks: 'test',
      txnType: 'CM'
    };

    const dummyBoutiquePasswordForManualBillResponse: GenerateBoutiquePasswordForManualBillResponse = {
      id: '13eecdf7-d489-42e3-8ed2-0098781c3504',
      locationCode: 'CPD',
      manualBillDate: moment('2021-01-06T10:19:19+05:30'),
      manualBillNo: '12',
      manualBillValue: 12000,
      metalRates: {
        J: { metalTypeCode: 'J', totalMetalWeight: 12, ratePerUnit: 4694 }
      },
      password: 'IA2LFHLDnuo=',
      remarks: 'test',
      txnType: 'CM',
      isOld: false
    };

    it('should return a GenerateBoutiquePasswordForManualBill', () => {
      const action = new GenerateBoutiquePasswordForManualBill(
        dummyBoutiquePasswordForManualBillRequest
      );
      const outcome = new GenerateBoutiquePasswordForManualBillSuccess(
        dummyBoutiquePasswordForManualBillResponse
      );
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', {
        b: dummyBoutiquePasswordForManualBillResponse
      });
      passwordConfigServiceSpy.generateBoutiquePasswordForManualBill.and.returnValue(
        response$
      );

      const expected$ = cold('--c', { c: outcome });

      expect(effect.generateBoutiquePasswordForManualBill$).toBeObservable(
        expected$
      );
    });

    it('should fail and return an action with the error', () => {
      const action = new GenerateBoutiquePasswordForManualBill(
        dummyBoutiquePasswordForManualBillRequest
      );
      const error = new Error('some error');
      const outcome = new GenerateBoutiquePasswordForManualBillFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      passwordConfigServiceSpy.generateBoutiquePasswordForManualBill.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.generateBoutiquePasswordForManualBill$).toBeObservable(
        expected
      );
    });
  });

  describe('generateGoldRatePassword', () => {
    const dummyBoutiquePasswordForMetalRateRequest: GenerateBoutiquePasswordForGoldRateRequest = {
      locationCode: 'CPD',
      metalRates: { J: { metalTypeCode: 'J', ratePerUnit: 4694 } },
      applicableDate: moment('2021-01-06T10:54:16+05:30').valueOf(),
      remarks: 'test'
    };

    const dummyBoutiquePasswordForMetalRateResponse: GenerateBoutiquePasswordForGoldRateResponse = {
      metalRates: { J: { metalTypeCode: 'J', ratePerUnit: 4694 } },
      applicableDate: moment('2021-01-06T10:54:16+05:30'),
      id: '16b02e85-2cea-4283-883a-98c96cb02a84',
      password: 'iCdVSr8+lSQ='
    };

    it('should return a GenerateBoutiquePasswordForGoldRate', () => {
      const action = new GenerateBoutiquePasswordForGoldRate(
        dummyBoutiquePasswordForMetalRateRequest
      );
      const outcome = new GenerateBoutiquePasswordForGoldRateSuccess(
        dummyBoutiquePasswordForMetalRateResponse
      );
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', {
        b: dummyBoutiquePasswordForMetalRateResponse
      });
      passwordConfigServiceSpy.generateBoutiquePasswordForGoldRate.and.returnValue(
        response$
      );

      const expected$ = cold('--c', { c: outcome });

      expect(effect.generateBoutiquePasswordForGoldRate$).toBeObservable(
        expected$
      );
    });

    it('should fail and return an action with the error', () => {
      const action = new GenerateBoutiquePasswordForGoldRate(
        dummyBoutiquePasswordForMetalRateRequest
      );
      const error = new Error('some error');
      const outcome = new GenerateBoutiquePasswordForGoldRateFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      passwordConfigServiceSpy.generateBoutiquePasswordForGoldRate.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.generateBoutiquePasswordForGoldRate$).toBeObservable(
        expected
      );
    });
  });

  describe('getDocumentTypes', () => {
    const dummyDocumentTypesResponse: TransactionTypes[] = [
      {
        description: 'Cash Memo',
        transactionType: 'CM'
      }
    ];

    const type = 'TRANSACTION_TYPE';

    it('should return a GetDocumentTypes', () => {
      const action = new GetDocumentTypes(type);
      const outcome = new GetDocumentTypesSuccess(dummyDocumentTypesResponse);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', {
        b: dummyDocumentTypesResponse
      });
      paymentDataServiceSpy.getPaymentTransactionTypes.and.returnValue(
        response$
      );

      const expected$ = cold('--c', { c: outcome });

      expect(effect.getDocumentTypes$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new GetDocumentTypes(type);
      const error = new Error('some error');
      const outcome = new GetDocumentTypesFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      paymentDataServiceSpy.getPaymentTransactionTypes.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.getDocumentTypes$).toBeObservable(expected);
    });
  });

  describe('getLocationCodes', () => {
    const dummyLocationCodesResponse: LocationSummaryList[] = [
      {
        description: 'BVJVIJAYANAGAR',
        locationCode: 'TTO'
      }
    ];
    it('should return a getLocationCodes', () => {
      const action = new GetLocationCodes();
      const outcome = new GetLocationCodesSuccess(dummyLocationCodesResponse);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', {
        b: dummyLocationCodesResponse
      });
      locationServiceSpy.getLocationSummaryList.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.getLocationCodes$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new GetLocationCodes();
      const error = new Error('some error');
      const outcome = new GetLocationCodesFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      locationServiceSpy.getLocationSummaryList.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.getLocationCodes$).toBeObservable(expected);
    });
  });

  describe('getMaterialPrices', () => {
    const dummyMaterialPricesRequest: MetalRatesPayload = {
      applicableDate: moment('2021-01-06T10:54:16+05:30').valueOf(),
      locationCode: 'CPD'
    };

    const dummyMaterialPricesResponse: MetalRates[] = [
      {
        metalTypeCode: 'J',
        priceType: 'D',
        ratePerUnit: 4694
      }
    ];

    it('should return a getMaterialPrices', () => {
      const action = new GetMaterialPrices(dummyMaterialPricesRequest);
      const outcome = new GetMaterialPricesSuccess(dummyMaterialPricesResponse);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', {
        b: dummyMaterialPricesResponse
      });
      commonServiceSpy.getStandardMaterialPriceDetailsHistory.and.returnValue(
        response$
      );

      const expected$ = cold('--c', { c: outcome });

      expect(effect.getMaterialPrices$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new GetMaterialPrices(dummyMaterialPricesRequest);
      const error = new Error('some error');
      const outcome = new GetMaterialPricesFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      commonServiceSpy.getStandardMaterialPriceDetailsHistory.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.getMaterialPrices$).toBeObservable(expected);
    });
  });
});
