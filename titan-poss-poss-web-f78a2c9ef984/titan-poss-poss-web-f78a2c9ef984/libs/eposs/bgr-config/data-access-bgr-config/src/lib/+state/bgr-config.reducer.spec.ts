import { BgrConfigState } from './bgr-config.state';
import { initialState, BgrConfigReducer } from './bgr-config.reducer';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import * as actions from './bgr-config.actions';
import {
  BgrConfigListingParams,
  BgrConfigListingRequestPayload,
  BgrConfigListingResult
} from '@poss-web/shared/models';

describe('Bgr Config reducer Testing Suite', () => {
  describe('Testing Load Bgr Config Listing Reducer Functionality', () => {
    beforeEach(() => {});
    it('Testing LOAD_BGR_CONFIG_LISTING', () => {
      const params: BgrConfigListingParams = {
        pageIndex: 0,
        pageSize: 10
      };
      const requestPayload: BgrConfigListingRequestPayload = {
        ruleType: 'BGR_CONFIG'
      };
      const action = new actions.LoadBgrConfigListing(params, requestPayload);
      const result: BgrConfigState = BgrConfigReducer(initialState, action);
      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
    });
    it('LOAD_BGR_CONFIG_LISTING_SUCCESS should update bgrConfigListing field in state', () => {
      const payload: BgrConfigListingResult = {
        results: [
          {
            ruleId: 1234,
            ruleType: 'BGR_CONFIG'
          }
        ],
        pageNumber: 0,
        pageSize: 10,
        totalPages: 10,
        totalElements: 100
      };
      const action = new actions.LoadBgrConfigListingSuccess(payload);
      const result: BgrConfigState = BgrConfigReducer(initialState, action);
      expect(result.bgrConfigListing).toBe(payload.results);
    });
    it('LOAD_BGR_CONFIG_LISTING_FAILURE should return error', () => {
      const action = new actions.LoadBgrConfigListingFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: BgrConfigState = BgrConfigReducer(initialState, action);
      expect(result.error.message).toEqual('some error');
    });
  });
  describe('Testing Search Bgr Config Listing Reducer Functionality', () => {
    beforeEach(() => {});
    it('Testing SEARCH_BGR_CONFIG_LISTING', () => {
      const action = new actions.SearchBgrConfigListing('');
      const result: BgrConfigState = BgrConfigReducer(initialState, action);
      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
    });
    it('SEARCH_BGR_CONFIG_LISTING_SUCCESS should update bgrConfigListing field in state', () => {
      const payload: BgrConfigListingResult = {
        results: [
          {
            ruleId: 1234,
            ruleType: 'BGR_CONFIG'
          }
        ],
        pageNumber: 0,
        pageSize: 10,
        totalPages: 10,
        totalElements: 100
      };
      const action = new actions.SearchBgrConfigListingSuccess(payload);
      const result: BgrConfigState = BgrConfigReducer(initialState, action);
      expect(result.bgrConfigListing).toBe(payload.results);
    });
    it('SEARCH_BGR_CONFIG_LISTING_FAILURE should return error', () => {
      const action = new actions.SearchBgrConfigListingFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: BgrConfigState = BgrConfigReducer(initialState, action);
      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing Load Bgr Config Details Reducer Functionality', () => {
    beforeEach(() => {});
    it('Testing LOAD_BGR_CONFIG_DETAILS', () => {
      const action = new actions.LoadBgrConfigDetails('');
      const result: BgrConfigState = BgrConfigReducer(initialState, action);
      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
    });
    it('LOAD_BGR_CONFIG_DETAILS_SUCCESS should update bgrConfigDetails field in state', () => {
      const response = {
        ruleId: 1234,
        ruleType: 'BGR_CONFIG'
      };
      const action = new actions.LoadBgrConfigDetailsSuccess(response);
      const result: BgrConfigState = BgrConfigReducer(initialState, action);
      expect(result.bgrConfigDetails).toBe(response);
    });
    it('LOAD_BGR_CONFIG_DETAILS_FAILURE should return error', () => {
      const action = new actions.LoadBgrConfigDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: BgrConfigState = BgrConfigReducer(initialState, action);
      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing Save Bgr Config Details Reducer Functionality', () => {
    beforeEach(() => {});
    it('Testing SAVE_BGR_CONFIG_DETAILS', () => {
      const payload = {
        ruleId: 1234,
        ruleType: 'BGR_CONFIG'
      };
      const action = new actions.SaveBgrConfigDetails(payload, null);
      const result: BgrConfigState = BgrConfigReducer(initialState, action);
      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
    });
    it('SAVE_BGR_CONFIG_DETAILS_SUCCESS should update bgrConfigDetailsSaved field in state', () => {
      const response = {
        ruleId: 1234,
        ruleType: 'BGR_CONFIG'
      };
      const action = new actions.SaveBgrConfigDetailsSuccess(response);
      const result: BgrConfigState = BgrConfigReducer(initialState, action);
      expect(result.bgrConfigDetailsSaved).toBe(response);
    });
    it('LOAD_BGR_CONFIG_DETAILS_FAILURE should return error', () => {
      const action = new actions.SaveBgrConfigDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: BgrConfigState = BgrConfigReducer(initialState, action);
      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing Edit Bgr Config Details Reducer Functionality', () => {
    beforeEach(() => {});
    it('Testing EDIT_BGR_CONFIG_DETAILS', () => {
      const payload = {
        ruleId: 1234,
        ruleType: 'BGR_CONFIG'
      };
      const action = new actions.EditBgrConfigDetails(payload);
      const result: BgrConfigState = BgrConfigReducer(initialState, action);
      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
    });
    it('EDIT_BGR_CONFIG_DETAILS_SUCCESS should update bgrConfigDetailsEdited field in state', () => {
      const response = {
        ruleId: 1234,
        ruleType: 'BGR_CONFIG'
      };
      const action = new actions.EditBgrConfigDetailsSuccess(response);
      const result: BgrConfigState = BgrConfigReducer(initialState, action);
      expect(result.bgrConfigDetailsEdited).toBe(response);
    });
    it('EDIT_BGR_CONFIG_DETAILS_FAILURE should return error', () => {
      const action = new actions.EditBgrConfigDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: BgrConfigState = BgrConfigReducer(initialState, action);
      expect(result.error.message).toEqual('some error');
    });
  });
});
