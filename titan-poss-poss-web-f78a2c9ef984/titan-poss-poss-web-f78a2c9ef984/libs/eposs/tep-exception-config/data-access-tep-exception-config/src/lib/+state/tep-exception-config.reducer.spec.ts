import {
  TEPExceptionConfigListingPayload,
  TEPExceptiononfigListing
} from '@poss-web/shared/models';
import * as actions from './tep-exception-config.actons';
import { TepExceptionConfigState } from './tep-exception-config.state';
import {
  initialState as istate,
  tepExceptionConfigReducer
} from './tep-exception-config.reducer';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';

describe('TEP Exception config Reducer Testing Suite', () => {
  const initialState: TepExceptionConfigState = { ...istate };

  const responsePayload: TEPExceptiononfigListing = {
    results: [
      {
        configId: '1',
        isActive: true,
        configDetails: {
          data: null,
          type: 'TYPE'
        },
        configType: 'TYPE',
        createdDate: 222222,
        customerMobileNos: ['3333333'],
        description: 'Desc',
        endDate: 444444,
        isOfferEnabled: true,
        itemCode: 'Code',
        offerDetails: {
          data: null,
          type: 'TYPE'
        },
        startDate: 111111
      }
    ],
    totalElements: 1
  };

  describe('Testing LoadTepExceptionConfigListing Functionality', () => {
    it('LoadTepExceptionConfigListing should be called', () => {
      const payload1: TEPExceptionConfigListingPayload = {
        pageIndex: 0,
        pageSize: 1
      };
      const action = new actions.LoadTepExceptionConfigListing(payload1);

      const result: TepExceptionConfigState = tepExceptionConfigReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.error).toEqual(null);
    });
    it('LoadTepExceptionConfigListingSuccess should return list', () => {
      const action = new actions.LoadTepExceptionConfigListingSuccess(
        responsePayload
      );
      const result: TepExceptionConfigState = tepExceptionConfigReducer(
        initialState,
        action
      );

      expect(result.tepExceptionConfiglist).toBeDefined();
      expect(result.isLoading).toBe(false);
    });
    it('LoadTepExceptionConfigListingFailure should return error', () => {
      const action = new actions.LoadTepExceptionConfigListingFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: TepExceptionConfigState = tepExceptionConfigReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadTepExceptionConfigDetails Functionality', () => {
    it('LoadTepExceptionConfigDetails should be called', () => {
      const action = new actions.LoadTepExceptionConfigDetails('payload');

      const result: TepExceptionConfigState = tepExceptionConfigReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.error).toEqual(null);
    });
    it('LoadTepExceptionConfigDetailsSuccess should return list', () => {
      const action = new actions.LoadTepExceptionConfigDetailsSuccess(
        responsePayload.results[0]
      );
      const result: TepExceptionConfigState = tepExceptionConfigReducer(
        initialState,
        action
      );

      expect(result.tepExceptionConfigDetails).toBeDefined();
      expect(result.isLoading).toBe(false);
    });
    it('LoadTepExceptionConfigDetailsFailure should return error', () => {
      const action = new actions.LoadTepExceptionConfigDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: TepExceptionConfigState = tepExceptionConfigReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing SaveTepExceptionConfigDetails Functionality', () => {
    it('SaveTepExceptionConfigDetails should be called', () => {
      const action = new actions.SaveTepExceptionConfigDetails(
        responsePayload.results[0]
      );

      const result: TepExceptionConfigState = tepExceptionConfigReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.error).toEqual(null);
    });
    it('SaveTepExceptionConfigDetailsSuccess should return list', () => {
      const action = new actions.SaveTepExceptionConfigDetailsSuccess(
        responsePayload.results[0]
      );
      const result: TepExceptionConfigState = tepExceptionConfigReducer(
        initialState,
        action
      );

      expect(result.hasSaved).toBe(true);
      expect(result.isLoading).toBe(false);
    });
    it('SaveTepExceptionConfigDetailsFailure should return error', () => {
      const action = new actions.SaveTepExceptionConfigDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: TepExceptionConfigState = tepExceptionConfigReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing UpdateTepExceptionConfigDetails Functionality', () => {
    it('UpdateTepExceptionConfigDetails should be called', () => {
      const action = new actions.UpdateTepExceptionConfigDetails(
        responsePayload.results[0]
      );

      const result: TepExceptionConfigState = tepExceptionConfigReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.error).toEqual(null);
    });
    it('UpdateTepExceptionConfigDetailsSuccess should return list', () => {
      const action = new actions.UpdateTepExceptionConfigDetailsSuccess(
        responsePayload.results[0]
      );
      const result: TepExceptionConfigState = tepExceptionConfigReducer(
        initialState,
        action
      );

      expect(result.hasUpdated).toBe(true);
      expect(result.isLoading).toBe(false);
    });
    it('UpdateTepExceptionConfigDetailsFailure should return error', () => {
      const action = new actions.UpdateTepExceptionConfigDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: TepExceptionConfigState = tepExceptionConfigReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadTepGlobalConfigListing Functionality', () => {
    it('LoadTepGlobalConfigListing should be called', () => {
      const action = new actions.LoadTepGlobalConfigListing();

      const result: TepExceptionConfigState = tepExceptionConfigReducer(
        initialState,
        action
      );
      expect(result.error).toEqual(null);
    });
    it('LoadTepGlobalConfigListingSuccess should return list', () => {
      const action = new actions.LoadTepGlobalConfigListingSuccess(1);
      const result: TepExceptionConfigState = tepExceptionConfigReducer(
        initialState,
        action
      );

      expect(result.maxFlatTepExchangeValue).toBe(1);
    });
    it('LoadTepGlobalConfigListingFailure should return error', () => {
      const action = new actions.LoadTepGlobalConfigListingFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: TepExceptionConfigState = tepExceptionConfigReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });
});
