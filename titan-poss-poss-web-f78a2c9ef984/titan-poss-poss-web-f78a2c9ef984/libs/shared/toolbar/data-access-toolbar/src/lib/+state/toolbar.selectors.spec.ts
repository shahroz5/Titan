import {
  StatusTypesEnum,
  ToolbarConfig,
  TransactionCount,
  TransactionDetails,
  MetalPrice
} from '@poss-web/shared/models';
import * as moment from 'moment';
import { initialState } from './toolbar.reducer';
// you will need to assert that the store is calling the right selector function.
import * as selectors from './toolbar.selectors';
import { ToolbarState } from './toolbar.state';

describe('Testing Toolbar related Selectors', () => {
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

  const dummyTransactionCountResponse: TransactionCount[] = [
    {
      count: 10,
      txnType: 'CM',
      subTxnType: 'NEW_CM'
    }
  ];

  const dummyToolbarConfig: ToolbarConfig = {
    loadMetalPrices: true,
    loadHoldPopup: true,
    loadOpenOrdersPopup: true
  };

  it('Should return  metalPriceDetails', () => {
    const state: ToolbarState = {
      ...initialState,
      metalPriceDetails: dummyMetalPriceResponse
    };
    expect(
      selectors.toolbarSelectors.selectMetalPriceDetails.projector(state)
    ).toEqual(dummyMetalPriceResponse);
  });

  it('Should return  previousMetalPriceDetails ', () => {
    const state: ToolbarState = {
      ...initialState,
      previousMetalPriceDetails: dummyMetalPriceResponse
    };
    expect(
      selectors.toolbarSelectors.selectPreviousMetalPriceDetails.projector(
        state
      )
    ).toEqual(dummyMetalPriceResponse);
  });

  it('Should return  selectOpenOrdersResponse', () => {
    const state: ToolbarState = {
      ...initialState,
      openOrdersResponse: dummyTransactionDetailsResponse
    };
    expect(
      selectors.toolbarSelectors.selectOpenOrdersResponse.projector(state)
    ).toEqual(dummyTransactionDetailsResponse);
  });

  it('Should return  openOrdersCount ', () => {
    const state: ToolbarState = {
      ...initialState,
      openOrdersCount: dummyTransactionCountResponse
    };
    expect(
      selectors.toolbarSelectors.selectOpenOrdersCountResponse.projector(state)
    ).toEqual(dummyTransactionCountResponse);
  });

  it('Should return  selectOnHoldResponse', () => {
    const state: ToolbarState = {
      ...initialState,
      onHoldResponse: dummyTransactionDetailsResponse
    };
    expect(
      selectors.toolbarSelectors.selectOnHoldResponse.projector(state)
    ).toEqual(dummyTransactionDetailsResponse);
  });

  it('Should return  onHoldCount ', () => {
    const state: ToolbarState = {
      ...initialState,
      onHoldCount: dummyTransactionCountResponse
    };
    expect(
      selectors.toolbarSelectors.selectOnHoldCountResponse.projector(state)
    ).toEqual(dummyTransactionCountResponse);
  });

  it('Should return  toolbarConfig ', () => {
    const state: ToolbarState = {
      ...initialState,
      toolbarConfig: dummyToolbarConfig
    };
    expect(
      selectors.toolbarSelectors.selectToolbarConfig.projector(state)
    ).toEqual(dummyToolbarConfig);
  });

  it('Should return  isLoading status ', () => {
    const state: ToolbarState = {
      ...initialState,
      isLoading: false
    };
    expect(selectors.toolbarSelectors.selectIsLoading.projector(state)).toEqual(
      false
    );
  });

  it('Should return  error ', () => {
    const state: ToolbarState = {
      ...initialState,
      hasError: null
    };
    expect(selectors.toolbarSelectors.selectHasError.projector(state)).toEqual(
      null
    );
  });
});
