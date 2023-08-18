import {
  GenerateBoutiquePasswordForGoldRateResponse,
  GenerateBoutiquePasswordForManualBillResponse,
  GenerateCashDepositPasswordRequest,
  GenerateCashDepositPasswordResponse,
  LocationSummaryList,
  MetalRates,
  TransactionTypes
} from '@poss-web/shared/models';
import * as moment from 'moment';
import { initialState } from './password-config.reducer';
// you will need to assert that the store is calling the right selector function.
import * as selectors from './password-config.selectors';
import { PasswordConfigState } from './password-config.state';

describe('Testing Password Config related Selectors', () => {
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

  const dummyBoutiquePasswordForMetalRateResponse: GenerateBoutiquePasswordForGoldRateResponse = {
    metalRates: { J: { metalTypeCode: 'J', ratePerUnit: 4694 } },
    applicableDate: moment('2021-01-06T10:54:16+05:30'),
    id: '16b02e85-2cea-4283-883a-98c96cb02a84',
    password: 'iCdVSr8+lSQ='
  };

  const dummyLocationCodesResponse: LocationSummaryList[] = [
    {
      description: 'BVJVIJAYANAGAR',
      locationCode: 'TTO'
    }
  ];

  const dummyDocumentTypesResponse: TransactionTypes[] = [
    {
      description: 'Cash Memo',
      transactionType: 'CM'
    }
  ];

  const dummyMaterialPricesResponse: MetalRates[] = [
    {
      metalTypeCode: 'J',
      priceType: 'D',
      ratePerUnit: 4694
    }
  ];

  it('Should return  Cash Deposit Password ', () => {
    const state: PasswordConfigState = {
      ...initialState,
      generateCashDepostPasswordResponse: dummyCashDepositPasswordResponse
    };
    expect(
      selectors.passwordConfigSelectors.selectGenerateCashDepositPasswordResponse.projector(
        state
      )
    ).toEqual(dummyCashDepositPasswordResponse);
  });

  it('Should return  Manual Bill Password ', () => {
    const state: PasswordConfigState = {
      ...initialState,
      generateBoutiquePasswordResponseForManualBill: dummyBoutiquePasswordForManualBillResponse
    };
    expect(
      selectors.passwordConfigSelectors.selectGenerateBoutiquePasswordResponseForManualBill.projector(
        state
      )
    ).toEqual(dummyBoutiquePasswordForManualBillResponse);
  });

  it('Should return  Metal Rate Password ', () => {
    const state: PasswordConfigState = {
      ...initialState,
      generateBoutiquePasswordResponseForGoldRate: dummyBoutiquePasswordForMetalRateResponse
    };
    expect(
      selectors.passwordConfigSelectors.selectGenerateBoutiquePasswordResponseForGoldRate.projector(
        state
      )
    ).toEqual(dummyBoutiquePasswordForMetalRateResponse);
  });

  it('Should return  Location Codes ', () => {
    const locationCodes: LocationSummaryList[] = dummyLocationCodesResponse;
    const state: PasswordConfigState = {
      ...initialState,
      locationCodes: locationCodes
    };
    expect(
      selectors.passwordConfigSelectors.selectLocationCodes.projector(state)
    ).toEqual(locationCodes);
  });

  it('Should return Document Types ', () => {
    const documents: TransactionTypes[] = dummyDocumentTypesResponse;
    const state: PasswordConfigState = {
      ...initialState,
      documentTypes: documents
    };
    expect(
      selectors.passwordConfigSelectors.selectDocumentTypes.projector(state)
    ).toEqual(documents);
  });

  it('Should return Material Prices', () => {
    const materialPrices: MetalRates[] = dummyMaterialPricesResponse;
    const state: PasswordConfigState = {
      ...initialState,
      materialPrices: materialPrices
    };
    expect(
      selectors.passwordConfigSelectors.selectMaterialPrices.projector(state)
    ).toEqual(materialPrices);
  });

  it('Should return  isLoading status ', () => {
    const state: PasswordConfigState = {
      ...initialState,
      isLoading: false
    };
    expect(
      selectors.passwordConfigSelectors.selectIsLoading.projector(state)
    ).toEqual(false);
  });

  it('Should return  error ', () => {
    const state: PasswordConfigState = {
      ...initialState,
      hasError: null
    };
    expect(
      selectors.passwordConfigSelectors.selectHasError.projector(state)
    ).toEqual(null);
  });
});
