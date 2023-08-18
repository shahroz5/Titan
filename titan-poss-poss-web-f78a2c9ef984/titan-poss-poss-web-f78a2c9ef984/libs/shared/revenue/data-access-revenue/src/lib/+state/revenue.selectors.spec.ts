import {
  RevenuePaymentModeWiseResponse,
  RevenueResponse,
  TodayRevenueResult,
  TodayRevenueResponse
} from '@poss-web/shared/models';
import * as moment from 'moment';
import { initialState } from './revenue.reducer';
// you will need to assert that the store is calling the right selector function.
import * as selectors from './revenue.selectors';
import { RevenueState } from './revenue.state';

describe('Testing Revenue related Selectors', () => {
  const revenueResult: RevenuePaymentModeWiseResponse[] = [
    {
      cashPayment: 1000,
      cardPayment: 1000,
      chequePayment: 1000,
      ddPayment: 1000,
      airpayPayment: 1000,
      rtgsPayment: 1000,
      walletPayment: 1000,
      employeeLoanPayment: 1000,
      salaryAdvancePayment: 1000,
      roPayment: 1000
    }
  ];

  const result: RevenueResponse = {
    revenues: [
      {
        date: moment(1604860200000),
        revenues: revenueResult
      }
    ],
    totalRevenues: 10
  };
  const todayRevenueResult: TodayRevenueResult[] = [
    {
      revenueType: 'Store',
      revenues: revenueResult
    }
  ];

  const todayRevenue: TodayRevenueResponse = {
    results: todayRevenueResult
  };

  it('Should return  day wise revenue ', () => {
    const state: RevenueState = {
      ...initialState,
      revenueData: result
    };
    expect(
      selectors.RevenueSelectors.selectDayWiseRevenueList.projector(state)
    ).toEqual(result);
  });

  it('Should return  today revenue ', () => {
    const state: RevenueState = {
      ...initialState,
      todayRevenue: todayRevenue
    };
    expect(
      selectors.RevenueSelectors.selectTodayRevenueList.projector(state)
    ).toEqual(todayRevenue);
  });

  it('Should return  ghs revenue ', () => {
    const state: RevenueState = {
      ...initialState,
      ghsRevenue: todayRevenue
    };
    expect(
      selectors.RevenueSelectors.selectGhsRevenueList.projector(state)
    ).toEqual(todayRevenue);
  });

  it('Should return  isLoading status ', () => {
    const state: RevenueState = {
      ...initialState,
      isLoading: false
    };
    expect(selectors.RevenueSelectors.selectIsLoading.projector(state)).toEqual(
      false
    );
  });

  it('Should return  error ', () => {
    const state: RevenueState = {
      ...initialState,
      error: null
    };
    expect(selectors.RevenueSelectors.selectError.projector(state)).toEqual(
      null
    );
  });
});
