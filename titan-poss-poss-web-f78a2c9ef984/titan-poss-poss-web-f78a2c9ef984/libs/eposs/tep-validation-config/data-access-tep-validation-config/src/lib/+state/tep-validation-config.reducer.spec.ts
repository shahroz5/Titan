import {
  TEPValidationConfigListing,
  TEPValidationConfigListingPayload
} from '@poss-web/shared/models';
import * as actions from './tep-validation-config.actons';
import { TepValidationConfigState } from './tep-validation-config.state';
import {
  initialState as istate,
  tepValidationConfigReducer
} from './tep-validation-config.reducer';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';

describe('TEP Validation config Reducer Testing Suite', () => {
  const initialState: TepValidationConfigState = { ...istate };

  const responsePayload: TEPValidationConfigListing = {
    results: [
      {
        configDetails: {
          data: {
            fvtCNCancellationDeductionPercent: 10,
            isAnnexurePrintingAllowed: true,
            isFVTCNCancellationAllowed: true,
            isInterBrandCashRefundAllowed: true,
            tepCancellationDays: 1
          },
          type: 'TYPE'
        },
        configId: '1',
        configType: 'Type',
        description: 'Desc',
        isActive: true,
        offerDetails: null
      }
    ],
    totalElements: 1
  };

  describe('Testing LoadTepValidationConfigListing Functionality', () => {
    it('LoadTepValidationConfigListing should be called', () => {
      const payload1: TEPValidationConfigListingPayload = {
        pageIndex: 0,
        pageSize: 1
      };
      const action = new actions.LoadTepValidationConfigListing(payload1);

      const result: TepValidationConfigState = tepValidationConfigReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.error).toEqual(null);
    });
    it('LoadTepValidationConfigListing should return list', () => {
      const action = new actions.LoadTepValidationConfigListingSuccess(
        responsePayload
      );
      const result: TepValidationConfigState = tepValidationConfigReducer(
        initialState,
        action
      );

      expect(result.tepValidationConfiglist).toBeDefined();
      expect(result.isLoading).toBe(false);
    });
    it('LoadTepValidationConfigListingFailure should return error', () => {
      const action = new actions.LoadTepValidationConfigListingFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: TepValidationConfigState = tepValidationConfigReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing SearchTepValidationConfigDetails Functionality', () => {
    it('SearchTepValidationConfigDetails should be called', () => {
      const action = new actions.SearchTepValidationConfigDetails('payload');

      const result: TepValidationConfigState = tepValidationConfigReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.error).toEqual(null);
    });
    it('SearchTepValidationConfigDetailsSuccess should return list', () => {
      const action = new actions.SearchTepValidationConfigDetailsSuccess(
        responsePayload
      );
      const result: TepValidationConfigState = tepValidationConfigReducer(
        initialState,
        action
      );

      expect(result.tepValidationConfiglist).toBeDefined();
      expect(result.isLoading).toBe(false);
    });
    it('SearchTepValidationConfigDetailsFailure should return error', () => {
      const action = new actions.SearchTepValidationConfigDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: TepValidationConfigState = tepValidationConfigReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadTepValidationConfigDetails Functionality', () => {
    it('LoadTepValidationConfigDetails should be called', () => {
      const action = new actions.LoadTepValidationConfigDetails('Code');

      const result: TepValidationConfigState = tepValidationConfigReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.error).toEqual(null);
    });
    it('LoadTepValidationConfigDetailsSuccess should return list', () => {
      const action = new actions.LoadTepValidationConfigDetailsSuccess(
        responsePayload.results[0]
      );
      const result: TepValidationConfigState = tepValidationConfigReducer(
        initialState,
        action
      );

      expect(result.tepValidationConfigDetails).toBeDefined();
      expect(result.isLoading).toBe(false);
    });
    it('LoadTepValidationConfigDetailsFailure should return error', () => {
      const action = new actions.LoadTepValidationConfigDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: TepValidationConfigState = tepValidationConfigReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing SaveTepValidationConfigDetails Functionality', () => {
    it('SaveTepValidationConfigDetails should be called', () => {
      const action = new actions.SaveTepValidationConfigDetails(
        responsePayload.results[0]
      );

      const result: TepValidationConfigState = tepValidationConfigReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.error).toEqual(null);
    });
    it('SaveTepValidationConfigDetailsSuccess should return list', () => {
      const action = new actions.SaveTepValidationConfigDetailsSuccess(
        responsePayload.results[0]
      );
      const result: TepValidationConfigState = tepValidationConfigReducer(
        initialState,
        action
      );

      expect(result.hasSaved).toBe(true);
      expect(result.isLoading).toBe(false);
    });
    it('SaveTepValidationConfigDetailsFailure should return error', () => {
      const action = new actions.SaveTepValidationConfigDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: TepValidationConfigState = tepValidationConfigReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing UpdateTepValidationConfigDetails Functionality', () => {
    it('UpdateTepValidationConfigDetails should be called', () => {
      const action = new actions.UpdateTepValidationConfigDetails(
        responsePayload.results[0]
      );

      const result: TepValidationConfigState = tepValidationConfigReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.error).toEqual(null);
    });
    it('UpdateTepValidationConfigDetailsSuccess should return list', () => {
      const action = new actions.UpdateTepValidationConfigDetailsSuccess(
        responsePayload.results[0]
      );
      const result: TepValidationConfigState = tepValidationConfigReducer(
        initialState,
        action
      );

      expect(result.hasUpdated).toBe(true);
      expect(result.isLoading).toBe(false);
    });
    it('UpdateTepValidationConfigDetailsFailure should return error', () => {
      const action = new actions.UpdateTepValidationConfigDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: TepValidationConfigState = tepValidationConfigReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });
});
