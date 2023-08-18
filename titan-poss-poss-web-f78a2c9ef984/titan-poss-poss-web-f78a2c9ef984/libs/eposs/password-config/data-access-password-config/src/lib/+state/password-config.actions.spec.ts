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
import {
  PasswordConfigActionTypes,
  GenerateCashDepositPassword,
  GenerateCashDepositPasswordSuccess,
  GenerateCashDepositPasswordFailure,
  ResetValues,
  GenerateBoutiquePasswordForManualBill,
  GenerateBoutiquePasswordForManualBillSuccess,
  GenerateBoutiquePasswordForManualBillFailure,
  GenerateBoutiquePasswordForGoldRate,
  GenerateBoutiquePasswordForGoldRateSuccess,
  GenerateBoutiquePasswordForGoldRateFailure,
  GetDocumentTypesFailure,
  GetDocumentTypesSuccess,
  GetDocumentTypes,
  GetMaterialPricesFailure,
  GetMaterialPricesSuccess,
  GetMaterialPrices,
  GetLocationCodesSuccess,
  GetLocationCodesFailure,
  GetLocationCodes,
  ResetPasswordValues
} from './password-config.actions';

import * as moment from 'moment';

describe('Password Config Action Testing suit', () => {
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

  describe('Generate Cash Deposit Password Action Test Cases', () => {
    it('should check correct type is used for  GenerateCashDepositPassword action ', () => {
      const action = new GenerateCashDepositPassword(
        dummyCashDepositPasswordRequest
      );

      expect(action.type).toEqual(
        PasswordConfigActionTypes.GENERATE_CASH_DEPOSIT_PASSWORD
      );
      expect(action.payload).toEqual(dummyCashDepositPasswordRequest);
    });

    it('should check correct type is used for  GenerateCashDepositPasswordSuccess action ', () => {
      const action = new GenerateCashDepositPasswordSuccess(
        dummyCashDepositPasswordResponse
      );

      expect(action.type).toEqual(
        PasswordConfigActionTypes.GENERATE_CASH_DEPOSIT_PASSWORD_SUCCESS
      );
      expect(action.payload).toEqual(dummyCashDepositPasswordResponse);
    });

    it('should check correct type is used for  GenerateCashDepositPasswordFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new GenerateCashDepositPasswordFailure(payload);

      expect(action.type).toEqual(
        PasswordConfigActionTypes.GENERATE_CASH_DEPOSIT_PASSWORD_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('Generate Boutique Password For Manual Bill Action Test Cases', () => {
    it('should check correct type is used for  GenerateBoutiquePasswordForManualBill action ', () => {
      const action = new GenerateBoutiquePasswordForManualBill(
        dummyBoutiquePasswordForManualBillRequest
      );

      expect(action.type).toEqual(
        PasswordConfigActionTypes.GENERATE_BOUTIQUE_PASSWORD_FOR_MANUAL_BILL
      );
      expect(action.payload).toEqual(dummyBoutiquePasswordForManualBillRequest);
    });

    it('should check correct type is used for  GenerateBoutiquePasswordForManualBillSuccess action ', () => {
      const action = new GenerateBoutiquePasswordForManualBillSuccess(
        dummyBoutiquePasswordForManualBillResponse
      );

      expect(action.type).toEqual(
        PasswordConfigActionTypes.GENERATE_BOUTIQUE_PASSWORD_FOR_MANUAL_BILL_SUCCESS
      );
      expect(action.payload).toEqual(
        dummyBoutiquePasswordForManualBillResponse
      );
    });

    it('should check correct type is used for  GenerateBoutiquePasswordForManualBillFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new GenerateBoutiquePasswordForManualBillFailure(payload);

      expect(action.type).toEqual(
        PasswordConfigActionTypes.GENERATE_BOUTIQUE_PASSWORD_FOR_MANUAL_BILL_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('Generate Boutique Password For Metal Rate Action Test Cases', () => {
    it('should check correct type is used for  GenerateBoutiquePasswordForMetalRate action ', () => {
      const action = new GenerateBoutiquePasswordForGoldRate(
        dummyBoutiquePasswordForMetalRateRequest
      );

      expect(action.type).toEqual(
        PasswordConfigActionTypes.GENERATE_BOUTIQUE_PASSWORD_FOR_GOLD_RATE
      );
      expect(action.payload).toEqual(dummyBoutiquePasswordForMetalRateRequest);
    });

    it('should check correct type is used for  GenerateBoutiquePasswordForMetalRateSuccess action ', () => {
      const action = new GenerateBoutiquePasswordForGoldRateSuccess(
        dummyBoutiquePasswordForMetalRateResponse
      );

      expect(action.type).toEqual(
        PasswordConfigActionTypes.GENERATE_BOUTIQUE_PASSWORD_FOR_GOLD_RATE_SUCCESS
      );
      expect(action.payload).toEqual(dummyBoutiquePasswordForMetalRateResponse);
    });

    it('should check correct type is used for  GenerateBoutiquePasswordForMetalRateFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new GenerateBoutiquePasswordForGoldRateFailure(payload);

      expect(action.type).toEqual(
        PasswordConfigActionTypes.GENERATE_BOUTIQUE_PASSWORD_FOR_GOLD_RATE_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('Get Document Type Action Test Cases', () => {
    it('should check correct type is used for GetDocumentType action ', () => {
      const payload = 'TRANSACTION_TYPE';
      const action = new GetDocumentTypes(payload);

      expect(action.type).toEqual(PasswordConfigActionTypes.GET_DOCUMENT_TYPES);
      expect(action.payload).toEqual(payload);
    });

    it('should check correct type is used for  GetDocumentTypeSuccess action ', () => {
      const payload: TransactionTypes[] = dummyDocumentTypesResponse;
      const action = new GetDocumentTypesSuccess(payload);

      expect(action.type).toEqual(
        PasswordConfigActionTypes.GET_DOCUMENT_TYPES_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });

    it('should check correct type is used for  GetDocumentTypeFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new GetDocumentTypesFailure(payload);

      expect(action.type).toEqual(
        PasswordConfigActionTypes.GET_DOCUMENT_TYPES_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('Get Material Prices Action Test Cases', () => {
    it('should check correct type is used for GetMaterialPrices action ', () => {
      const action = new GetMaterialPrices(dummyMaterialPricesRequest);

      expect(action.type).toEqual(
        PasswordConfigActionTypes.GET_MATERIAL_PRICES
      );
      expect(action.payload).toEqual(dummyMaterialPricesRequest);
    });

    it('should check correct type is used for  GetMaterialPricesSuccess action ', () => {
      const payload: MetalRates[] = dummyMaterialPricesResponse;
      const action = new GetMaterialPricesSuccess(payload);

      expect(action.type).toEqual(
        PasswordConfigActionTypes.GET_MATERIAL_PRICES_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });

    it('should check correct type is used for  GetMaterialPricesFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new GetMaterialPricesFailure(payload);

      expect(action.type).toEqual(
        PasswordConfigActionTypes.GET_MATERIAL_PRICES_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('Get Location Codes Action Test Cases', () => {
    it('should check correct type is used for GetLocationCodes action ', () => {
      const action = new GetLocationCodes();

      expect(action.type).toEqual(PasswordConfigActionTypes.GET_LOCATION_CODES);
    });

    it('should check correct type is used for  GetLocationCodesSuccess action ', () => {
      const payload: LocationSummaryList[] = dummyLocationCodesResponse;
      const action = new GetLocationCodesSuccess(payload);

      expect(action.type).toEqual(
        PasswordConfigActionTypes.GET_LOCATION_CODES_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });

    it('should check correct type is used for  GetLocationCodesFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new GetLocationCodesFailure(payload);

      expect(action.type).toEqual(
        PasswordConfigActionTypes.GET_LOCATION_CODES_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('Other Action Test Cases', () => {
    it('should check correct type is used for ResetValues action ', () => {
      const action = new ResetValues();
      expect({ ...action }).toEqual({
        type: PasswordConfigActionTypes.RESET_VALUES
      });
    });

    it('should check correct type is used for ResetPasswordValues action ', () => {
      const action = new ResetPasswordValues();
      expect({ ...action }).toEqual({
        type: PasswordConfigActionTypes.RESET_PASSWORD_VALUES
      });
    });
  });
});
