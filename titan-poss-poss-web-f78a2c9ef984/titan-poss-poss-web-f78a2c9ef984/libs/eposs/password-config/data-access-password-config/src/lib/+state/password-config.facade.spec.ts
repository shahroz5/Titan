import { initialState } from './password-config.reducer';

import { Store } from '@ngrx/store';
import { TestBed } from '@angular/core/testing';
import { PasswordConfigFacade } from './password-config.facade';
import { provideMockStore } from '@ngrx/store/testing';
import * as moment from 'moment';
import { PasswordConfigState } from './password-config.state';
import {
  GenerateBoutiquePasswordForGoldRate,
  GenerateBoutiquePasswordForManualBill,
  GenerateCashDepositPassword,
  GetDocumentTypes,
  GetLocationCodes,
  GetMaterialPrices,
  ResetPasswordValues,
  ResetValues
} from './password-config.actions';
import {
  GenerateBoutiquePasswordForGoldRateRequest,
  GenerateBoutiquePasswordForManualBillRequest,
  GenerateCashDepositPasswordRequest,
  GenerateCashDepositPasswordResponse,
  MetalRatesPayload
} from '@poss-web/shared/models';

describe('Bank Deposit facade Testing Suite action', () => {
  let passwordConfigFacade: PasswordConfigFacade;

  let store: Store<PasswordConfigState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), PasswordConfigFacade]
    });

    passwordConfigFacade = TestBed.inject(PasswordConfigFacade);
    store = TestBed.inject(Store);
    spyOn(store, 'dispatch').and.returnValue({});
  });

  describe('Dispatch Actions', () => {
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

    const dummyBoutiquePasswordForMetalRateRequest: GenerateBoutiquePasswordForGoldRateRequest = {
      locationCode: 'CPD',
      metalRates: { J: { metalTypeCode: 'J', ratePerUnit: 4694 } },
      applicableDate: moment('2021-01-06T10:54:16+05:30').valueOf(),
      remarks: 'test'
    };

    const dummyMaterialPricesRequest: MetalRatesPayload = {
      applicableDate: moment('2021-01-06T10:54:16+05:30').valueOf(),
      locationCode: 'CPD'
    };

    it('should call generateCashDepositPassword action', () => {
      const action = new GenerateCashDepositPassword(
        dummyCashDepositPasswordRequest
      );
      passwordConfigFacade.generateCashDepositPassword(
        dummyCashDepositPasswordRequest
      );
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call GenerateBoutiquePasswordForManualBill action', () => {
      const action = new GenerateBoutiquePasswordForManualBill(
        dummyBoutiquePasswordForManualBillRequest
      );
      passwordConfigFacade.generateBoutiquePasswordForManualBill(
        dummyBoutiquePasswordForManualBillRequest
      );
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call ResetPasswordValues action', () => {
      const action = new ResetPasswordValues();
      passwordConfigFacade.resetPasswordValues();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call ResetValues action', () => {
      const action = new ResetValues();
      passwordConfigFacade.resetValues();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call generateBoutiquePasswordForGoldRate action', () => {
      const action = new GenerateBoutiquePasswordForGoldRate(
        dummyBoutiquePasswordForMetalRateRequest
      );
      passwordConfigFacade.generateBoutiquePasswordForGoldRate(
        dummyBoutiquePasswordForMetalRateRequest
      );
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call loadMaterialPrices action', () => {
      const action = new GetMaterialPrices(dummyMaterialPricesRequest);
      passwordConfigFacade.loadMaterialPrices(dummyMaterialPricesRequest);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call loadDocumentTypes action', () => {
      const type = 'TRANSACTION_TYPE';
      const action = new GetDocumentTypes(type);
      passwordConfigFacade.loadDocumentTypes(type);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call loadLocationCodes action', () => {
      const action = new GetLocationCodes();
      passwordConfigFacade.loadLocationCodes();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
  });

  describe('Access Selector', () => {
    it('should access getGenerateBoutiquePasswordForManualBillResponse selector', () => {
      expect(
        passwordConfigFacade.getGenerateBoutiquePasswordForManualBillResponse()
      ).toEqual(
        passwordConfigFacade['generateBoutiquePasswordForManualBillResponse$']
      );
    });

    it('should access Error selector', () => {
      expect(passwordConfigFacade.getHasError()).toEqual(
        passwordConfigFacade['hasError$']
      );
    });

    it('should access isLoading selector', () => {
      expect(passwordConfigFacade.getIsLoading()).toEqual(
        passwordConfigFacade['isLoading$']
      );
    });

    it('should access Cash Deposit Password selector', () => {
      expect(
        passwordConfigFacade.getGenerateCashDepositPasswordResponse()
      ).toEqual(passwordConfigFacade['generateCashDepositPasswordResponse$']);
    });

    it('should access getGenerateBoutiquePasswordForGoldRateResponse selector', () => {
      expect(
        passwordConfigFacade.getGenerateBoutiquePasswordForGoldRateResponse()
      ).toEqual(
        passwordConfigFacade['generateBoutiquePasswordForGoldrateResponse$']
      );
    });

    it('should access getMaterialPrices selector', () => {
      expect(passwordConfigFacade.getMaterialPrices()).toEqual(
        passwordConfigFacade['materialPrices$']
      );
    });

    it('should access getDocumentTypes selector', () => {
      expect(passwordConfigFacade.getDocumentTypes()).toEqual(
        passwordConfigFacade['documentTypes$']
      );
    });

    it('should access getLocationCodes selector', () => {
      expect(passwordConfigFacade.getLocationCodes()).toEqual(
        passwordConfigFacade['locationCodes$']
      );
    });
  });
});
