import {
  CustomErrors,
  PaginatePayload,
  RevenueResponse,
  TodayRevenueResponse
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import * as moment from 'moment';
import { initialState, RevenueReducer } from './revenue.reducer';
import * as actions from './revenue.actions';
import { RevenueState } from './revenue.state';

describe('Revenue Reducer Testing Suite', () => {
  let testState = initialState;

  describe('Actions should update state properly', () => {
    it('should return the initial state', () => {
      const action: any = {};
      const state: RevenueState = RevenueReducer(undefined, action);

      expect(state).toBe(testState);
    });

    it('LOAD_REVENUE_LIST action', () => {
      testState = {
        ...testState,
        isLoading: false
      };
      const payload: PaginatePayload = {
        pageIndex: 0,
        pageSize: 10
      };

      const requestBody = {
        fromDate: moment('2020-08-31T18:30:00.000Z'),
        toDate: moment('2020-11-09T18:30:00.000Z')
      };

      const action = new actions.LoadRevenueList(payload, requestBody);

      const result: RevenueState = RevenueReducer(testState, action);

      expect(result.isLoading).toBeTruthy();
    });

    it('LOAD_REVENUE_LIST_SUCCESS action', () => {
      testState = {
        ...testState,
        isLoading: true,
        revenueData: null
      };

      const payload: RevenueResponse = {
        revenues: [],
        totalRevenues: 10
      };

      const action = new actions.LoadRevenueListSuccess(payload);

      const result: RevenueState = RevenueReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.revenueData).toBe(payload);
    });

    it('LOAD_REVENUE_LIST_FAILURE action', () => {
      testState = {
        ...testState,
        isLoading: true,
        error: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.LoadRevenueListFailure(payload);

      const result: RevenueState = RevenueReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.error).toBe(payload);
    });

    it('GET_TODAY_REVENUE_LIST action', () => {
      testState = {
        ...testState,
        isLoading: false
      };
      const payload = '';
      const businessDate = '';

      const action = new actions.GetTodayRevenueList(payload);

      const result: RevenueState = RevenueReducer(testState, action);

      expect(result.isLoading).toBeTruthy();
    });

    it('GET_TODAY_REVENUE_LIST_SUCCESS action', () => {
      testState = {
        ...testState,
        isLoading: true,
        todayRevenue: null
      };

      const payload: TodayRevenueResponse = {
        results: []
      };

      const action = new actions.GetTodayRevenueListSuccess(payload);

      const result: RevenueState = RevenueReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.todayRevenue).toBe(payload);
    });

    it('GET_TODAY_REVENUE_LIST_FAILURE action', () => {
      testState = {
        ...testState,
        isLoading: true,
        error: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.GetTodayRevenueListFailure(payload);

      const result: RevenueState = RevenueReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.error).toBe(payload);
    });

    it('GET_GHS_REVENUE_LIST action', () => {
      testState = {
        ...testState,
        isLoading: false
      };
      const payload = '';

      const action = new actions.GetGhsRevenueList(payload);

      const result: RevenueState = RevenueReducer(testState, action);

      expect(result.isLoading).toBeTruthy();
    });

    it('GET_GHS_REVENUE_LIST_SUCCESS action', () => {
      testState = {
        ...testState,
        isLoading: true,
        ghsRevenue: null
      };

      const payload: TodayRevenueResponse = {
        results: []
      };

      const action = new actions.GetGhsRevenueListSuccess(payload);

      const result: RevenueState = RevenueReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.ghsRevenue).toBe(payload);
    });

    it('GET_GHS_REVENUE_LIST_FAILURE action', () => {
      testState = {
        ...testState,
        isLoading: true,
        error: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.GetGhsRevenueListFailure(payload);

      const result: RevenueState = RevenueReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.error).toBe(payload);
    });

    it('RESET_ERROR action', () => {
      testState = {
        ...testState,
        error: CustomErrorAdaptor.fromJson(Error('Some new Error'))
      };

      const action = new actions.ResetError();

      const result: RevenueState = RevenueReducer(testState, action);

      expect(result.error).toBeNull();
    });
  });
});
