import {
  CustomErrors,
  PaginatePayload,
  RevenueResponse,
  TodayRevenueResponse
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  GetGhsRevenueList,
  GetGhsRevenueListFailure,
  GetGhsRevenueListSuccess,
  GetTodayRevenueList,
  GetTodayRevenueListFailure,
  GetTodayRevenueListSuccess,
  LoadRevenueList,
  LoadRevenueListFailure,
  LoadRevenueListSuccess,
  ResetError,
  RevenueActionTypes
} from './revenue.actions';
import * as moment from 'moment';

describe('Revenue Action Testing suit', () => {
  describe('Load Daywise Revenue Action Test Cases', () => {
    it('should check correct type is used for  LoadRevenueList action ', () => {
      const payload: PaginatePayload = {
        pageIndex: 0,
        pageSize: 10
      };

      const requestBody = {
        fromDate: moment('2020-08-31T18:30:00.000Z'),
        toDate: moment('2020-11-09T18:30:00.000Z')
      };

      const action = new LoadRevenueList(payload, requestBody);

      expect(action.type).toEqual(RevenueActionTypes.LOAD_REVENUE_LIST);
      expect(action.payload).toEqual(requestBody);
    });

    it('should check correct type is used for  LoadRevenueListSuccess action ', () => {
      const payload: RevenueResponse = {
        revenues: [],
        totalRevenues: 10
      };
      const action = new LoadRevenueListSuccess(payload);

      expect(action.type).toEqual(RevenueActionTypes.LOAD_REVENUE_LIST_SUCCESS);
      expect(action.payload).toEqual(payload);
    });

    it('should check correct type is used for  LoadRevenueListFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadRevenueListFailure(payload);

      expect(action.type).toEqual(RevenueActionTypes.LOAD_REVENUE_LIST_FAILURE);
      expect(action.payload).toEqual(payload);
    });
  });

  describe('Get Today Revenue Action Test Cases', () => {
    it('should check correct type is used for  GetTodayRevenueList action ', () => {
      const locationcode = '';
      const businessDate = '';

      const action = new GetTodayRevenueList(locationcode);

      expect(action.type).toEqual(RevenueActionTypes.GET_TODAY_REVENUE_LIST);
      expect(action.payload).toEqual(locationcode);
    });

    it('should check correct type is used for GetTodayRevenueListSuccess action ', () => {
      const payload: TodayRevenueResponse = {
        results: []
      };
      const action = new GetTodayRevenueListSuccess(payload);

      expect(action.type).toEqual(
        RevenueActionTypes.GET_TODAY_REVENUE_LIST_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });

    it('should check correct type is used for  GetTodayRevenueListFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new GetTodayRevenueListFailure(payload);

      expect(action.type).toEqual(
        RevenueActionTypes.GET_TODAY_REVENUE_LIST_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('Get GHS Revenue Action Test Cases', () => {
    it('should check correct type is used for  GetGhsRevenueList action ', () => {
      const businessDate = '';

      const action = new GetGhsRevenueList(businessDate);

      expect(action.type).toEqual(RevenueActionTypes.GET_GHS_REVENUE_LIST);
      expect(action.payload).toEqual(businessDate);
    });

    it('should check correct type is used for GetGhsRevenueListSuccess action ', () => {
      const payload: TodayRevenueResponse = {
        results: []
      };
      const action = new GetGhsRevenueListSuccess(payload);

      expect(action.type).toEqual(
        RevenueActionTypes.GET_GHS_REVENUE_LIST_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });

    it('should check correct type is used for  GetGhsRevenueListFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new GetGhsRevenueListFailure(payload);

      expect(action.type).toEqual(
        RevenueActionTypes.GET_GHS_REVENUE_LIST_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('Other Action Test Cases', () => {
    it('should check correct type is used for ResetError action ', () => {
      const action = new ResetError();
      expect({ ...action }).toEqual({
        type: RevenueActionTypes.RESET_ERROR
      });
    });
  });
});
