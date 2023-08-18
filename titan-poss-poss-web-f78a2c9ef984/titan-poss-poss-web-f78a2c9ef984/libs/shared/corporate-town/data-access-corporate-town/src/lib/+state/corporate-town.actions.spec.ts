import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  CustomErrors,
  LoadCorporateTownListingPayload,
  LoadCorporateTownListingSuccessPayload,
  LoadStateListingSuccessPayload,
  // LoadRegionDetailsListingSuccessPayload,
  SaveTownFormDetailsPayload,
  CorporateTown,
  StateSummary,
  LoadCountryCode,
  CountryList
} from '@poss-web/shared/models';
import {
  CorporateTownActionTypes,
  LoadCorporateTownDetails,
  LoadCorporateTownDetailsSuccess,
  LoadCorporateTownDetailsFailure,
  LoadStateDetails,
  LoadStateDetailsSuccess,
  LoadStateDetailsFailure,
  LoadTownDetailsByTownCode,
  LoadTownDetailsByTownCodeSuccess,
  LoadTownDetailsByTownCodeFailure,
  ResetTownDetailsDialog,
  SaveTownFormDetails,
  SaveTownFormDetailsSuccess,
  SaveTownFormDetailsFailure,
  EditTownFormDetails,
  EditTownFormDetailsSuccess,
  EditTownFormDetailsFailure,
  SearchCorporateTownCode,
  SearchCorporateTownCodeSuccess,
  SearchCorporateTownCodeFailure
} from './corporate-town.actions';

describe('Corporate Town Action Testing Suite', () => {
  //Towns
  describe('LoadCorporateTownDetails Action Test Cases', () => {
    it('should check correct type is used for  LoadCorporateTownDetails action ', () => {
      const payload: LoadCorporateTownListingPayload = {
        pageIndex: 0,
        pageSize: 100
      };
      const action = new LoadCorporateTownDetails(payload);
      expect({ ...action }).toEqual({
        type: CorporateTownActionTypes.LOAD_CORPORATE_TOWN,
        payload
      });
    });
    it('should check correct type is used for  LoadCorporateTownDetailsSuccess action ', () => {
      const payload: LoadCorporateTownListingSuccessPayload = {
        corporateTownDetailsListing: [],
        totalElements: 0
      };
      const action = new LoadCorporateTownDetailsSuccess(payload);

      expect({ ...action }).toEqual({
        type: CorporateTownActionTypes.LOAD_CORPORATE_TOWN_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadCorporateTownDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadCorporateTownDetailsFailure(payload);

      expect({ ...action }).toEqual({
        type: CorporateTownActionTypes.LOAD_CORPORATE_TOWN_FAILURE,
        payload
      });
    });
  });

  // Town  by town code
  describe('LoadTownDetailsByTownCode Action Test Cases', () => {
    it('should check correct type is used for  LoadTownDetailsByTownCode action ', () => {
      const payload = 'abc';
      const action = new LoadTownDetailsByTownCode(payload);
      expect({ ...action }).toEqual({
        type: CorporateTownActionTypes.LOAD_CORPORATE_TOWN_DETAILS_BY_TOWNCODE,
        payload
      });
    });
    it('should check correct type is used for LoadTownDetailsByTownCodeSuccess action ', () => {
      const payload: CorporateTown = {
        townId: 1,
        townCode: 'TEST',
        stateId: 'TEST',
        description: 'TEST',
        stateName: 'TEST',
        isActive: true
      };
      const action = new LoadTownDetailsByTownCodeSuccess(payload);

      expect({ ...action }).toEqual({
        type:
          CorporateTownActionTypes.LOAD_CORPORATE_TOWN_DETAILS_BY_TOWNCODE_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadTownDetailsByTownCodeFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadTownDetailsByTownCodeFailure(payload);

      expect({ ...action }).toEqual({
        type:
          CorporateTownActionTypes.LOAD_CORPORATE_TOWN_DETAILS_BY_TOWNCODE_FAILURE,
        payload
      });
    });
  });

  describe('EditTownFormDetails Action Test Cases', () => {
    it('should check correct type is used for  EditTownFormDetails action ', () => {
      const payload: SaveTownFormDetailsPayload = {
        townCode: 'TEST',
        stateId: 'TEST',
        description: 'TEST',
        isActive: true
      };
      const action = new EditTownFormDetails(payload);
      expect({ ...action }).toEqual({
        type: CorporateTownActionTypes.EDIT_CORPORATE_TOWN,
        payload
      });
    });
    it('should check correct type is used for EditTownFormDetailsSuccess action ', () => {
      const payload: CorporateTown = {
        townId: 1,
        townCode: 'TEST',
        stateId: 'TEST',
        description: 'TEST',
        stateName: 'TEST',
        isActive: true
      };

      const action = new EditTownFormDetailsSuccess(payload);

      expect({ ...action }).toEqual({
        type: CorporateTownActionTypes.EDIT_CORPORATE_TOWN_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  EditTownFormDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new EditTownFormDetailsFailure(payload);

      expect({ ...action }).toEqual({
        type: CorporateTownActionTypes.EDIT_CORPORATE_TOWN_FAILURE,
        payload
      });
    });
  });

  describe('SaveTownFormDetails Action Test Cases', () => {
    it('should check correct type is used for  SaveTownFormDetails action ', () => {
      const payload: SaveTownFormDetailsPayload = {
        townCode: 'TEST',
        stateId: 'TEST',
        description: 'TEST',
        isActive: true
      };
      const action = new SaveTownFormDetails(payload);
      expect({ ...action }).toEqual({
        type: CorporateTownActionTypes.SAVE_CORPORATE_TOWN,
        payload
      });
    });
    it('should check correct type is used for SaveTownFormDetailsSuccess action ', () => {
      const payload: CorporateTown = {
        townId: 1,
        townCode: 'TEST',
        stateId: 'TEST',
        description: 'TEST',
        stateName: 'TEST',
        isActive: true
      };

      const action = new SaveTownFormDetailsSuccess(payload);

      expect({ ...action }).toEqual({
        type: CorporateTownActionTypes.SAVE_CORPORATE_TOWN_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  SaveTownFormDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SaveTownFormDetailsFailure(payload);

      expect({ ...action }).toEqual({
        type: CorporateTownActionTypes.SAVE_CORPORATE_TOWN_FAILURE,
        payload
      });
    });
  });
  describe('SearchCorporateTownCode Action Test Cases', () => {
    it('should check correct type is used for  SearchCorporateTownCode action ', () => {
      const payload = 'ABC';
      const action = new SearchCorporateTownCode(payload);
      expect({ ...action }).toEqual({
        type: CorporateTownActionTypes.SEARCH_CORPORATETOWN,
        payload
      });
    });
    it('should check correct type is used for SearchCorporateTownCodeSuccess action ', () => {
      const payload: LoadCorporateTownListingSuccessPayload = {
        corporateTownDetailsListing: [],
        totalElements: 1
      };
      const action = new SearchCorporateTownCodeSuccess(payload);

      expect({ ...action }).toEqual({
        type: CorporateTownActionTypes.SEARCH_CORPORATETOWN_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for SearchCorporateTownCodeFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SearchCorporateTownCodeFailure(payload);

      expect({ ...action }).toEqual({
        type: CorporateTownActionTypes.SEARCH_CORPORATETOWN_FAILURE,
        payload
      });
    });
  });

  describe('ResetTownDetailsDialog Action Test Cases', () => {
    it('should check correct type is used for  ResetTownDetailsDialog action ', () => {
      const action = new ResetTownDetailsDialog();
      expect({ ...action }).toEqual({
        type: CorporateTownActionTypes.RESET_CORPORATE_TOWN_DIALOG_DATA
      });
    });
  });
});
