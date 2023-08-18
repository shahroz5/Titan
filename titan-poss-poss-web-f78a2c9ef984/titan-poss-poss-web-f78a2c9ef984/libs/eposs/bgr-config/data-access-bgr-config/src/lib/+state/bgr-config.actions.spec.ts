import { Action } from '@ngrx/store';
import {
  BgrConfigListingParams,
  BgrConfigListingRequestPayload,
  BgrConfigListingResult,
  CustomErrors,
  GetMaxFlatTepConfigResponse,
  MaxFlatTepConfigDetails,
  MaxFlatValuePatchPayload,
  BgrConfigDetails
} from '@poss-web/shared/models';
import {
  BgrConfigActionTypes,
  EditBgrConfigDetails,
  EditBgrConfigDetailsFailure,
  EditBgrConfigDetailsSuccess,
  LoadBgrConfigDetails,
  LoadBgrConfigDetailsFailure,
  LoadBgrConfigDetailsSuccess,
  LoadBgrConfigListing,
  LoadBgrConfigListingFailure,
  LoadBgrConfigListingSuccess,
  SaveBgrConfigDetails,
  SaveBgrConfigDetailsFailure,
  SaveBgrConfigDetailsSuccess,
  SearchBgrConfigListing,
  SearchBgrConfigListingFailure,
  SearchBgrConfigListingSuccess
} from './bgr-config.actions';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';

describe('Actions Testing Suite', () => {
  describe('Load BGR Config Listing Actions Test Cases', () => {
    it('should check correct type is used for LoadBgrConfigListing action ', () => {
      const params: BgrConfigListingParams = {
        pageIndex: 0,
        pageSize: 10
      };
      const requestPayload: BgrConfigListingRequestPayload = {
        ruleType: 'BGR_CONFIG'
      };
      const action = new LoadBgrConfigListing(params, requestPayload);
      expect({ ...action }).toEqual({
        type: BgrConfigActionTypes.LOAD_BGR_CONFIG_LISTING,
        params: params,
        requestPayload: requestPayload
      });
    });
    it('should check correct type is used for LoadBgrConfigListingSuccess action ', () => {
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
      const action = new LoadBgrConfigListingSuccess(payload);
      expect({ ...action }).toEqual({
        type: BgrConfigActionTypes.LOAD_BGR_CONFIG_LISTING_SUCCESS,
        payload: payload
      });
    });
    it('should check correct type is used for  LoadBgrConfigListingFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadBgrConfigListingFailure(payload);
      expect({ ...action }).toEqual({
        type: BgrConfigActionTypes.LOAD_BGR_CONFIG_LISTING_FAILURE,
        payload
      });
    });
  });

  describe('Search Bgr Config Listing Actions Test Cases', () => {
    it('should check correct type is used for SearchBgrConfigListing action ', () => {
      const action = new SearchBgrConfigListing('');
      expect({ ...action }).toEqual({
        type: BgrConfigActionTypes.SEARCH_BGR_CONFIG_LISTING,
        payload: ''
      });
    });
    it('should check correct type is used for SearchBgrConfigListingSuccess action ', () => {
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
      const action = new SearchBgrConfigListingSuccess(payload);
      expect({ ...action }).toEqual({
        type: BgrConfigActionTypes.SEARCH_BGR_CONFIG_LISTING_SUCCESS,
        payload: payload
      });
    });
    it('should check correct type is used for  SearchBgrConfigListingFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SearchBgrConfigListingFailure(payload);
      expect({ ...action }).toEqual({
        type: BgrConfigActionTypes.SEARCH_BGR_CONFIG_LISTING_FAILURE,
        payload
      });
    });
  });

  describe('Load Bgr Config Details Actions Test Cases', () => {
    it('should check correct type is used for LoadBgrConfigDetails action ', () => {
      const action = new LoadBgrConfigDetails('');
      expect({ ...action }).toEqual({
        type: BgrConfigActionTypes.LOAD_BGR_CONFIG_DETAILS,
        payload: ''
      });
    });
    it('should check correct type is used for LoadBgrConfigDetailsSuccess action ', () => {
      const payload: BgrConfigDetails = {
        ruleId: 1234,
        ruleType: 'BGR_CONFIG'
      };
      const action = new LoadBgrConfigDetailsSuccess(payload);
      expect({ ...action }).toEqual({
        type: BgrConfigActionTypes.LOAD_BGR_CONFIG_DETAILS_SUCCESS,
        payload: payload
      });
    });
    it('should check correct type is used for  LoadBgrConfigDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadBgrConfigDetailsFailure(payload);
      expect({ ...action }).toEqual({
        type: BgrConfigActionTypes.LOAD_BGR_CONFIG_DETAILS_FAILURE,
        payload
      });
    });
  });

  describe('Save Bgr Config Details Actions Test Cases', () => {
    it('should check correct type is used for SaveBgrConfigDetails action ', () => {
      const payload: BgrConfigDetails = {
        ruleId: 1234,
        ruleType: 'BGR_CONFIG'
      };
      const action = new SaveBgrConfigDetails(payload, null);
      expect({ ...action }).toEqual({
        type: BgrConfigActionTypes.SAVE_BGR_CONFIG_DETAILS,
        payload,
        locationMappingDetails: null
      });
    });
    it('should check correct type is used for SaveBgrConfigDetailsSuccess action ', () => {
      const payload: BgrConfigDetails = {
        ruleId: 1234,
        ruleType: 'BGR_CONFIG'
      };
      const action = new SaveBgrConfigDetailsSuccess(payload);
      expect({ ...action }).toEqual({
        type: BgrConfigActionTypes.SAVE_BGR_CONFIG_DETAILS_SUCCESS,
        payload: payload
      });
    });
    it('should check correct type is used for  SaveBgrConfigDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SaveBgrConfigDetailsFailure(payload);
      expect({ ...action }).toEqual({
        type: BgrConfigActionTypes.SAVE_BGR_CONFIG_DETAILS_FAILURE,
        payload
      });
    });
  });

  describe('Edit Bgr Config Details Actions Test Cases', () => {
    it('should check correct type is used for EditBgrConfigDetails action ', () => {
      const payload: BgrConfigDetails = {
        ruleId: 1234,
        ruleType: 'BGR_CONFIG'
      };
      const action = new EditBgrConfigDetails(payload);
      expect({ ...action }).toEqual({
        type: BgrConfigActionTypes.EDIT_BGR_CONFIG_DETAILS,
        payload
      });
    });
    it('should check correct type is used for EditBgrConfigDetailsSuccess action ', () => {
      const payload: BgrConfigDetails = {
        ruleId: 1234,
        ruleType: 'BGR_CONFIG'
      };
      const action = new EditBgrConfigDetailsSuccess(payload);
      expect({ ...action }).toEqual({
        type: BgrConfigActionTypes.EDIT_BGR_CONFIG_DETAILS_SUCCESS,
        payload: payload
      });
    });
    it('should check correct type is used for  EditBgrConfigDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new EditBgrConfigDetailsFailure(payload);
      expect({ ...action }).toEqual({
        type: BgrConfigActionTypes.EDIT_BGR_CONFIG_DETAILS_FAILURE,
        payload
      });
    });
  });
});
