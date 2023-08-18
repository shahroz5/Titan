import {
  CustomErrors,
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
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import * as moment from 'moment';
import { initialState, passwordConfigReducer } from './password-config.reducer';
import * as actions from './password-config.actions';
import { PasswordConfigState } from './password-config.state';

describe('Password Config Reducer Testing Suite', () => {
  let testState = initialState;

  describe('Actions should update state properly', () => {
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

    const dummyDocumentTypesResponse: TransactionTypes[] = [
      {
        description: 'Cash Memo',
        transactionType: 'CM'
      }
    ];

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

    const dummyLocationCodesResponse: LocationSummaryList[] = [
      {
        description: 'BVJVIJAYANAGAR',
        locationCode: 'TTO'
      }
    ];

    it('should return the initial state', () => {
      const action: any = {};
      const state: PasswordConfigState = passwordConfigReducer(
        undefined,
        action
      );

      expect(state).toBe(testState);
    });

    it('GENERATE_CASH_DEPOSIT_PASSWORD action', () => {
      testState = {
        ...testState,
        isLoading: false
      };

      const action = new actions.GenerateCashDepositPassword(
        dummyCashDepositPasswordRequest
      );

      const result: PasswordConfigState = passwordConfigReducer(
        testState,
        action
      );

      expect(result.isLoading).toBeTruthy();
    });

    it('GENERATE_CASH_DEPOSIT_PASSWORD_SUCCESS action', () => {
      testState = {
        ...testState,
        isLoading: true,
        generateCashDepostPasswordResponse: null
      };

      const action = new actions.GenerateCashDepositPasswordSuccess(
        dummyCashDepositPasswordResponse
      );

      const result: PasswordConfigState = passwordConfigReducer(
        testState,
        action
      );

      expect(result.isLoading).toBeFalsy();
      expect(result.generateCashDepostPasswordResponse).toBe(
        dummyCashDepositPasswordResponse
      );
    });

    it('GENERATE_CASH_DEPOSIT_PASSWORD_FAILURE action', () => {
      testState = {
        ...testState,
        isLoading: true,
        hasError: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.GenerateCashDepositPasswordFailure(payload);

      const result: PasswordConfigState = passwordConfigReducer(
        testState,
        action
      );

      expect(result.isLoading).toBeFalsy();
      expect(result.hasError).toBe(payload);
    });

    it('GENERATE_BOUTIQUE_PASSWORD_FOR_MANUAL_BILL action', () => {
      testState = {
        ...testState,
        isLoading: false
      };

      const action = new actions.GenerateBoutiquePasswordForManualBill(
        dummyBoutiquePasswordForManualBillRequest
      );

      const result: PasswordConfigState = passwordConfigReducer(
        testState,
        action
      );

      expect(result.isLoading).toBeTruthy();
    });

    it('GENERATE_BOUTIQUE_PASSWORD_FOR_MANUAL_BILL_SUCCESS action', () => {
      testState = {
        ...testState,
        isLoading: true,
        generateBoutiquePasswordResponseForManualBill: null
      };

      const action = new actions.GenerateBoutiquePasswordForManualBillSuccess(
        dummyBoutiquePasswordForManualBillResponse
      );

      const result: PasswordConfigState = passwordConfigReducer(
        testState,
        action
      );

      expect(result.isLoading).toBeFalsy();
      expect(result.generateBoutiquePasswordResponseForManualBill).toBe(
        dummyBoutiquePasswordForManualBillResponse
      );
    });

    it('GENERATE_BOUTIQUE_PASSWORD_FOR_MANUAL_BILL_FAILURE action', () => {
      testState = {
        ...testState,
        isLoading: true,
        hasError: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.GenerateBoutiquePasswordForManualBillFailure(
        payload
      );

      const result: PasswordConfigState = passwordConfigReducer(
        testState,
        action
      );

      expect(result.isLoading).toBeFalsy();
      expect(result.hasError).toBe(payload);
    });

    it('GENERATE_BOUTIQUE_PASSWORD_FOR_GOLD_RATE action', () => {
      testState = {
        ...testState,
        isLoading: false
      };

      const action = new actions.GenerateBoutiquePasswordForGoldRate(
        dummyBoutiquePasswordForMetalRateRequest
      );

      const result: PasswordConfigState = passwordConfigReducer(
        testState,
        action
      );

      expect(result.isLoading).toBeTruthy();
    });

    it('GENERATE_BOUTIQUE_PASSWORD_FOR_GOLD_RATE_SUCCESS action', () => {
      testState = {
        ...testState,
        isLoading: true,
        generateBoutiquePasswordResponseForGoldRate: null
      };

      const action = new actions.GenerateBoutiquePasswordForGoldRateSuccess(
        dummyBoutiquePasswordForMetalRateResponse
      );

      const result: PasswordConfigState = passwordConfigReducer(
        testState,
        action
      );

      expect(result.isLoading).toBeFalsy();
      expect(result.generateBoutiquePasswordResponseForGoldRate).toBe(
        dummyBoutiquePasswordForMetalRateResponse
      );
    });

    it('GENERATE_BOUTIQUE_PASSWORD_FOR_GOLD_RATE_FAILURE action', () => {
      testState = {
        ...testState,
        isLoading: true,
        hasError: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.GenerateBoutiquePasswordForGoldRateFailure(
        payload
      );

      const result: PasswordConfigState = passwordConfigReducer(
        testState,
        action
      );

      expect(result.isLoading).toBeFalsy();
      expect(result.hasError).toBe(payload);
    });

    it('GET_LOCATION_CODES action', () => {
      testState = {
        ...testState,
        isLoading: false
      };

      const action = new actions.GetLocationCodes();

      const result: PasswordConfigState = passwordConfigReducer(
        testState,
        action
      );

      expect(result.isLoading).toBeTruthy();
    });

    it('GET_LOCATION_CODES_SUCCESS action', () => {
      testState = {
        ...testState,
        isLoading: true,
        locationCodes: null
      };

      const action = new actions.GetLocationCodesSuccess(
        dummyLocationCodesResponse
      );

      const result: PasswordConfigState = passwordConfigReducer(
        testState,
        action
      );

      expect(result.isLoading).toBeFalsy();
      expect(result.locationCodes).toBe(dummyLocationCodesResponse);
    });

    it('GET_LOCATION_CODES_FAILURE action', () => {
      testState = {
        ...testState,
        isLoading: true,
        hasError: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.GetLocationCodesFailure(payload);

      const result: PasswordConfigState = passwordConfigReducer(
        testState,
        action
      );

      expect(result.isLoading).toBeFalsy();
      expect(result.hasError).toBe(payload);
    });

    it('GET_MATERIAL_PRICES action', () => {
      testState = {
        ...testState,
        isLoading: false
      };

      const action = new actions.GetMaterialPrices(dummyMaterialPricesRequest);

      const result: PasswordConfigState = passwordConfigReducer(
        testState,
        action
      );

      expect(result.isLoading).toBeTruthy();
    });

    it('GET_MATERIAL_PRICES_SUCCESS action', () => {
      testState = {
        ...testState,
        isLoading: true,
        materialPrices: null
      };

      const action = new actions.GetMaterialPricesSuccess(
        dummyMaterialPricesResponse
      );

      const result: PasswordConfigState = passwordConfigReducer(
        testState,
        action
      );

      expect(result.isLoading).toBeFalsy();
      expect(result.materialPrices).toBe(dummyMaterialPricesResponse);
    });

    it('GET_MATERIAL_PRICES_FAILURE action', () => {
      testState = {
        ...testState,
        isLoading: true,
        hasError: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.GetMaterialPricesFailure(payload);

      const result: PasswordConfigState = passwordConfigReducer(
        testState,
        action
      );

      expect(result.isLoading).toBeFalsy();
      expect(result.hasError).toBe(payload);
    });

    it('GET_DOCUMENT_TYPES action', () => {
      const type = 'TRANSACTION_TYPE';
      testState = {
        ...testState,
        isLoading: false
      };

      const action = new actions.GetDocumentTypes(type);

      const result: PasswordConfigState = passwordConfigReducer(
        testState,
        action
      );

      expect(result.isLoading).toBeTruthy();
    });

    it('GET_DOCUMENT_TYPES_SUCCESS action', () => {
      testState = {
        ...testState,
        isLoading: true,
        documentTypes: null
      };

      const action = new actions.GetDocumentTypesSuccess(
        dummyDocumentTypesResponse
      );

      const result: PasswordConfigState = passwordConfigReducer(
        testState,
        action
      );

      expect(result.isLoading).toBeFalsy();
      expect(result.documentTypes).toBe(dummyDocumentTypesResponse);
    });

    it('GET_DOCUMENT_TYPES_FAILURE action', () => {
      testState = {
        ...testState,
        isLoading: true,
        hasError: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.GetDocumentTypesFailure(payload);

      const result: PasswordConfigState = passwordConfigReducer(
        testState,
        action
      );

      expect(result.isLoading).toBeFalsy();
      expect(result.hasError).toBe(payload);
    });

    it('RESET_VALUES action', () => {
      const newState = {
        isLoading: true,
        hasError: null,
        locationCodes: dummyLocationCodesResponse,
        documentTypes: dummyDocumentTypesResponse,
        materialPrices: dummyMaterialPricesResponse,
        generateBoutiquePasswordResponseForManualBill: dummyBoutiquePasswordForManualBillResponse,
        generateBoutiquePasswordResponseForGoldRate: dummyBoutiquePasswordForMetalRateResponse,
        generateCashDepostPasswordResponse: dummyCashDepositPasswordResponse
      };

      const action = new actions.ResetValues();

      const result: PasswordConfigState = passwordConfigReducer(
        testState,
        action
      );

      expect(result.isLoading).toBeFalsy();
      expect(result.hasError).toBe(null);
      expect(result.locationCodes.length).toBe(0);
      expect(result.documentTypes.length).toBe(0);
      expect(result.materialPrices.length).toBe(0);
      expect(result.generateBoutiquePasswordResponseForManualBill).toBe(null);
      expect(result.generateBoutiquePasswordResponseForGoldRate).toBe(null);
      expect(result.generateCashDepostPasswordResponse).toBe(null);
    });

    it('RESET_PASSWORD_VALUES action', () => {
      testState = {
        ...testState,
        isLoading: true,
        hasError: null,
        generateBoutiquePasswordResponseForManualBill: dummyBoutiquePasswordForManualBillResponse,
        generateBoutiquePasswordResponseForGoldRate: dummyBoutiquePasswordForMetalRateResponse,
        generateCashDepostPasswordResponse: dummyCashDepositPasswordResponse
      };

      const action = new actions.ResetPasswordValues();

      const result: PasswordConfigState = passwordConfigReducer(
        testState,
        action
      );

      expect(result.isLoading).toBeFalsy();
      expect(result.hasError).toBe(null);
      expect(result.generateBoutiquePasswordResponseForManualBill).toBe(null);
      expect(result.generateBoutiquePasswordResponseForGoldRate).toBe(null);
      expect(result.generateCashDepostPasswordResponse).toBe(null);
    });
  });
});
