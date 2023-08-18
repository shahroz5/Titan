import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  CustomErrors,
  LoadStateListingPayload,
  LoadStatesDetailsListingSuccessPayload,
  SaveStateDetailsPayload,
  StateData,
  LoadCountryDetailsListingSuccessPayload
} from '@poss-web/shared/models';

import {
  StateActionTypes,
  LoadStateDetails,
  LoadStateDetailsSuccess,
  LoadStateDetailsFailure,
  SearchState,
  SearchStateSuccess,
  SaveStateFormDetails,
  SaveStateFormDetailsSuccess,
  SaveStateFormDetailsFailure,
  EditStateDetailsSuccess,
  EditStateDetails,
  EditStateDetailsFailure,
  LoadStateByCode,
  LoadStateByCodeSuccess,
  LoadStateByCodeFailure,
  LoadCountryDetails,
  LoadCountryDetailsSuccess,
  LoadCountryDetailsFailure,
  ResetStateDialog,
  UpdateIsActive,
  UpdateIsActiveSuccess,
  UpdateIsActiveFailure,
  SearchStateFailure
} from './state.actions';

describe('State Action Testing Suite', () => {
  describe('LoadStateDetails Action Test Cases', () => {
    it('should check correct type is used for  LoadStateDetails action ', () => {
      const payload: LoadStateListingPayload = {
        pageIndex: 0,
        pageSize: 100
      };
      const action = new LoadStateDetails(payload);
      expect({ ...action }).toEqual({
        type: StateActionTypes.LOAD_STATE_DETAILS,
        payload
      });
    });
    it('should check correct type is used for  LoadStateDetailsSuccess action ', () => {
      const payload: LoadStatesDetailsListingSuccessPayload = {
        stateDetailsListing: [
          {
            stateCode: 'KA',
            isActive: true,
            isUnionTerritory: false,
            description: 'KARNATAKA',
            countryCode: 'IND',
            configDetails: {}
          }
        ],
        totalElements: 1
      };
      const action = new LoadStateDetailsSuccess(payload);

      expect({ ...action }).toEqual({
        type: StateActionTypes.LOAD_STATE_DETAILS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadStateDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadStateDetailsFailure(payload);

      expect({ ...action }).toEqual({
        type: StateActionTypes.LOAD_STATE_DETAILS_FAILURE,
        payload
      });
    });
  });

  describe('SearchState Action Test Cases', () => {
    it('should check correct type is used for  SearchState action ', () => {
      const payload = 'KA';
      const action = new SearchState(payload);
      expect({ ...action }).toEqual({
        type: StateActionTypes.SEARCH_STATE_BY_CODE,
        payload
      });
    });
    it('should check correct type is used for SearchStateSuccess action ', () => {
      const payload: LoadStatesDetailsListingSuccessPayload = {
        stateDetailsListing: [
          {
            stateCode: 'KA',
            isActive: true,
            isUnionTerritory: false,
            description: 'KARNATAKA',
            countryCode: 'IND',
            configDetails: {}
          }
        ],
        totalElements: 1
      };
      const action = new SearchStateSuccess(payload);

      expect({ ...action }).toEqual({
        type: StateActionTypes.SEARCH_STATE_BY_CODE_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  SearchStateFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SearchStateFailure(payload);

      expect({ ...action }).toEqual({
        type: StateActionTypes.SEARCH_STATE_BY_CODE_FAILURE,
        payload
      });
    });
  });

  describe('SaveStateFormDetails Action Test Cases', () => {
    it('should check correct type is used for  SaveStateFormDetails action ', () => {
      const payload: SaveStateDetailsPayload = {
        configDetails: {},
        stateCode: 'KA',
        description: 'KARANATAKA',
        isUnionTerritory: false,
        isActive: true,
        countryCode: 'IND'
      };
      const action = new SaveStateFormDetails(payload);
      expect({ ...action }).toEqual({
        type: StateActionTypes.SAVE_STATE_DETAILS,
        payload
      });
    });
    it('should check correct type is used for SaveStateFormDetailsSuccess action ', () => {
      const payload: SaveStateDetailsPayload = {
        configDetails: {},
        stateCode: 'KA',
        description: 'KARANATAKA',
        isUnionTerritory: false,
        isActive: true,
        countryCode: 'IND'
      };

      const action = new SaveStateFormDetailsSuccess(payload);

      expect({ ...action }).toEqual({
        type: StateActionTypes.SAVE_STATE_DETAILS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  SaveStateFormDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SaveStateFormDetailsFailure(payload);

      expect({ ...action }).toEqual({
        type: StateActionTypes.SAVE_STATE_DETAILS_FAILURE,
        payload
      });
    });
  });

  describe('EditStateDetails Action Test Cases', () => {
    it('should check correct type is used for  EditStateDetails action ', () => {
      const payload: SaveStateDetailsPayload = {
        configDetails: {},
        stateCode: 'KA',
        description: 'KARANATAKA',
        isUnionTerritory: false,
        isActive: true,
        countryCode: 'IND'
      };
      const action = new EditStateDetails(payload);
      expect({ ...action }).toEqual({
        type: StateActionTypes.EDIT_STATE_DETAILS,
        payload
      });
    });
    it('should check correct type is used for EditStateDetailsSuccess action ', () => {
      const payload: SaveStateDetailsPayload = {
        configDetails: {},
        stateCode: 'KA',
        description: 'KARANATAKA',
        isUnionTerritory: false,
        isActive: true,
        countryCode: 'IND'
      };
      const action = new EditStateDetailsSuccess(payload);

      expect({ ...action }).toEqual({
        type: StateActionTypes.EDIT_STATE_DETAILS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  EditStateDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new EditStateDetailsFailure(payload);

      expect({ ...action }).toEqual({
        type: StateActionTypes.EDIT_STATE_DETAILS_FAILURE,
        payload
      });
    });
  });

  describe('LoadStateByCode Action Test Cases', () => {
    it('should check correct type is used for  LoadStateByCode action ', () => {
      const payload = 'KA';
      const action = new LoadStateByCode(payload);
      expect({ ...action }).toEqual({
        type: StateActionTypes.LOAD_STATE_DETAILS_BY_CODE,
        payload
      });
    });
    it('should check correct type is used for LoadStateByCodeSuccess action ', () => {
      const payload: StateData = {
        configDetails: {},
        stateCode: 'KA',
        description: 'KARANATAKA',
        isUnionTerritory: false,
        isActive: true,
        countryCode: 'IND'
      };

      const action = new LoadStateByCodeSuccess(payload);

      expect({ ...action }).toEqual({
        type: StateActionTypes.LOAD_STATE_DETAILS_BY_CODE_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadStateByCodeFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadStateByCodeFailure(payload);

      expect({ ...action }).toEqual({
        type: StateActionTypes.LOAD_STATE_DETAILS_BY_CODE_FAILURE,
        payload
      });
    });
  });

  describe('LoadCountryDetails Action Test Cases', () => {
    it('should check correct type is used for  LoadCountryDetails action ', () => {
      const action = new LoadCountryDetails();
      expect({ ...action }).toEqual({
        type: StateActionTypes.LOAD_COUNTRY_DETAILS
      });
    });
    it('should check correct type is used for LoadCountryDetailsSuccess action ', () => {
      const payload: LoadCountryDetailsListingSuccessPayload = {
        countryDetailsListing: [{ countryCode: 'IND', description: 'INDIA' }],
        totalElements: 1
      };

      const action = new LoadCountryDetailsSuccess(payload);

      expect({ ...action }).toEqual({
        type: StateActionTypes.LOAD_COUNTRY_DETAILS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadCountryDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadCountryDetailsFailure(payload);

      expect({ ...action }).toEqual({
        type: StateActionTypes.LOAD_COUNTRY_DETAILS_FAILURE,
        payload
      });
    });
  });

  describe('UpdateIsActive Action Test Cases', () => {
    it('should check correct type is used for  UpdateIsActive action ', () => {
      const payload: StateData = {
        configDetails: {},
        stateCode: 'KA',
        description: 'KARANATAKA',
        isUnionTerritory: false,
        isActive: true,
        countryCode: 'IND'
      };
      const action = new UpdateIsActive(payload);
      expect({ ...action }).toEqual({
        type: StateActionTypes.UPDATE_IS_ACTIVE,
        payload
      });
    });
    it('should check correct type is used for UpdateIsActiveSuccess action ', () => {
      const payload: StateData = {
        configDetails: {},
        stateCode: 'KA',
        description: 'KARANATAKA',
        isUnionTerritory: false,
        isActive: true,
        countryCode: 'IND'
      };

      const action = new UpdateIsActiveSuccess(payload);

      expect({ ...action }).toEqual({
        type: StateActionTypes.UPDATE_IS_ACTIVE_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for UpdateIsActiveFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new UpdateIsActiveFailure(payload);

      expect({ ...action }).toEqual({
        type: StateActionTypes.UPDATE_IS_ACTIVE_FAILURE,
        payload
      });
    });
  });

  describe('ResetStateDialog Action Test Cases', () => {
    it('should check correct type is used for  ResetStateDialog action ', () => {
      const action = new ResetStateDialog();
      expect({ ...action }).toEqual({
        type: StateActionTypes.RESET_STATE_DIALOG_DATA
      });
    });
  });
});
