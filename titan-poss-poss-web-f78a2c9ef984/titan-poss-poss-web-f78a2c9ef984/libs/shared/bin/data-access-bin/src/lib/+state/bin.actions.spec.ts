import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  CustomErrors,
  SaveBinCodeFormPayload,
  LoadBinCodeDetailsListingSuccessPayload,
  LocationsByBinGroupAndBinCodePayload,
  LocationMappingPostPayload,
  LoadBinGroupDetailsListingPayload,
  BinCodeSaveModel,
  LocationList,
  LocationMappingPost,
  LoadSearchBinCodeDetails
} from '@poss-web/shared/models';
import {
  BinActionTypes,
  SaveBinCodeNewFormDetails,
  SaveBinCodeNewFormDetailsSuccess,
  SaveBinCodeNewFormDetailsFailure,
  ResetBinCodeDialog,
  LoadBinCodeDetails,
  LoadBinCodeDetailsSuccess,
  LoadBinCodeDetailsFailure,
  LoadBinCodesByBinGroupCode,
  LoadBinCodesByBinGroupCodeSuccess,
  LoadBinCodesByBinGroupCodeFailure,
  EditBinCodeFormDetails,
  EditBinCodeFormDetailsSuccess,
  EditBinCodeFormDetailsFailure,
  SearchBinName,
  SearchBinNameSuccess,
  SearchBinNameFailure,
  LoadLocationsByBinGroupAndBinCode,
  LoadLocationsByBinGroupAndBinCodeSuccess,
  LoadLocationsByBinGroupAndBinCodeFailure,
  SaveLocationMappingDetails,
  SaveLocationMappingDetailsSuccess,
  SaveLocationMappingDetailsFailure
} from './bin.actions';

describe('Bin Code Action Testing Suite', () => {
  //Bin code
  describe('LoadBinCodeDetails Action Test Cases', () => {
    it('should check correct type is used for  LoadBinCodeDetails action ', () => {
      const payload: LoadBinGroupDetailsListingPayload = {
        pageIndex: 0,
        pageSize: 100
      };
      const action = new LoadBinCodeDetails(payload);
      expect({ ...action }).toEqual({
        type: BinActionTypes.LOAD_BIN_CODE_DETAILS,
        payload
      });
    });
    it('should check correct type is used for  LoadBinCodeDetailsSuccess action ', () => {
      const payload: LoadBinCodeDetailsListingSuccessPayload = {
        binCodeDetailsListing: [],
        totalElements: 0
      };
      const action = new LoadBinCodeDetailsSuccess(payload);

      expect({ ...action }).toEqual({
        type: BinActionTypes.LOAD_BIN_CODE_DETAILS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadBinCodeDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadBinCodeDetailsFailure(payload);

      expect({ ...action }).toEqual({
        type: BinActionTypes.LOAD_BIN_CODE_DETAILS_FAILURE,
        payload
      });
    });
  });

  // stone type by stone type code
  describe('LoadBinCodesByBinGroupCode Action Test Cases', () => {
    it('should check correct type is used for  LoadBinCodesByBinGroupCode action ', () => {
      const payload = {
        binGroupCode: 'aaa',
        pageIndex: 0,
        pageSize: 10
      };
      const action = new LoadBinCodesByBinGroupCode(payload);
      expect({ ...action }).toEqual({
        type: BinActionTypes.LOAD_BIN_CODES_BY_BIN_GROUPCODE,
        payload
      });
    });
    it('should check correct type is used for LoadBinCodesByBinGroupCodeSuccess action ', () => {
      const payload: LoadSearchBinCodeDetails = {
        binCodeSearchListing: [],
        totalElements: 0
      };
      const action = new LoadBinCodesByBinGroupCodeSuccess(payload);

      expect({ ...action }).toEqual({
        type: BinActionTypes.LOAD_BIN_CODES_BY_BIN_GROUPCODE_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadBinCodesByBinGroupCodeFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadBinCodesByBinGroupCodeFailure(payload);

      expect({ ...action }).toEqual({
        type: BinActionTypes.LOAD_BIN_CODES_BY_BIN_GROUPCODE_FAILURE,
        payload
      });
    });
  });
  // locs by bin group and bin code
  describe('LoadLocationsByBinGroupAndBinCode Action Test Cases', () => {
    it('should check correct type is used for  LoadLocationsByBinGroupAndBinCode action ', () => {
      const payload: LocationsByBinGroupAndBinCodePayload = {
        binGroup: 'aaa',
        binCodes: ['aaa']
      };
      const action = new LoadLocationsByBinGroupAndBinCode(payload);
      expect({ ...action }).toEqual({
        type: BinActionTypes.LOAD_LOCATIONS_BY_BINGROUP_AND_BINCODE,
        payload
      });
    });
    it('should check correct type is used for LoadLocationsByBinGroupAndBinCodeSuccess action ', () => {
      const payload: LocationList[] = [
        {
          id: '1',
          description: 'aaa'
        }
      ];
      const action = new LoadLocationsByBinGroupAndBinCodeSuccess(payload);

      expect({ ...action }).toEqual({
        type: BinActionTypes.LOAD_LOCATIONS_BY_BINGROUP_AND_BINCODE_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadLocationsByBinGroupAndBinCodeFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadLocationsByBinGroupAndBinCodeFailure(payload);

      expect({ ...action }).toEqual({
        type: BinActionTypes.LOAD_LOCATIONS_BY_BINGROUP_AND_BINCODE_FAILURE,
        payload
      });
    });
  });
  //
  describe('EditBinCodeFormDetails Action Test Cases', () => {
    it('should check correct type is used for  EditBinCodeFormDetails action ', () => {
      const payload: BinCodeSaveModel = {
        binCode: 'aaa',
        binGroups: [{ binGroupCode: 'aaa', isActive: true }],
        description: 'aaa'
      };
      const action = new EditBinCodeFormDetails(payload);
      expect({ ...action }).toEqual({
        type: BinActionTypes.EDIT_BINCODE_FORM_DETAILS,
        payload
      });
    });
    it('should check correct type is used for EditBinCodeFormDetailsSuccess action ', () => {
      const payload: BinCodeSaveModel = {
        binCode: 'aaa',
        binGroups: [{ binGroupCode: 'aaa', isActive: true }],
        description: 'aaa'
      };

      const action = new EditBinCodeFormDetailsSuccess(payload);

      expect({ ...action }).toEqual({
        type: BinActionTypes.EDIT_BINCODE_FORM_DETAILS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  EditBinCodeFormDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new EditBinCodeFormDetailsFailure(payload);

      expect({ ...action }).toEqual({
        type: BinActionTypes.EDIT_BINCODE_FORM_DETAILS_FAILURE,
        payload
      });
    });
  });

  describe('SaveBinCodeNewFormDetails Action Test Cases', () => {
    it('should check correct type is used for  SaveBinCodeNewFormDetails action ', () => {
      const payload: SaveBinCodeFormPayload = {
        binCode: 'aaa',
        binGroups: ['AAA'],
        description: 'aaa'
      };
      const action = new SaveBinCodeNewFormDetails(payload);
      expect({ ...action }).toEqual({
        type: BinActionTypes.SAVE_BINCODE_FORM_DETAILS,
        payload
      });
    });
    it('should check correct type is used for SaveBinCodeNewFormDetailsSuccess action ', () => {
      const payload: SaveBinCodeFormPayload = {
        binCode: 'aaa',
        binGroups: ['AAA'],
        description: 'aaa'
      };
      const action = new SaveBinCodeNewFormDetailsSuccess(payload);

      expect({ ...action }).toEqual({
        type: BinActionTypes.SAVE_BINCODE_FORM_DETAILS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  SaveBinCodeNewFormDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SaveBinCodeNewFormDetailsFailure(payload);

      expect({ ...action }).toEqual({
        type: BinActionTypes.SAVE_BINCODE_FORM_DETAILS_FAILURE,
        payload
      });
    });
  });
  //location mapping save
  describe('SaveLocationMappingDetails Action Test Cases', () => {
    it('should check correct type is used for  SaveLocationMappingDetails action ', () => {
      const payload: LocationMappingPostPayload = {
        binGroup: 'aaa',
        data: { addLocations: [], binCodes: [], removeLocations: [] }
      };
      const action = new SaveLocationMappingDetails(payload);
      expect({ ...action }).toEqual({
        type: BinActionTypes.SAVE_LOCATION_MAPPING_DETAILS,
        payload
      });
    });
    it('should check correct type is used for SaveLocationMappingDetailsSuccess action ', () => {
      const payload: LocationMappingPost = {
        addLocations: [],
        binCodes: [],
        removeLocations: []
      };

      const action = new SaveLocationMappingDetailsSuccess(payload);

      expect({ ...action }).toEqual({
        type: BinActionTypes.SAVE_LOCATION_MAPPING_DETAILS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  SaveLocationMappingDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SaveLocationMappingDetailsFailure(payload);

      expect({ ...action }).toEqual({
        type: BinActionTypes.SAVE_LOCATION_MAPPING_DETAILS_FAILURE,
        payload
      });
    });
  });
  describe('SearchBinName Action Test Cases', () => {
    it('should check correct type is used for  SearchBinName action ', () => {
      const payload = { binCode: 'ABC', binGroupCode: 'AAA' };
      const action = new SearchBinName(payload);
      expect({ ...action }).toEqual({
        type: BinActionTypes.SEARCH_BIN_NAME,
        payload
      });
    });
    it('should check correct type is used for SearchBinNameSuccess action ', () => {
      const payload: LoadSearchBinCodeDetails = {
        binCodeSearchListing: [],
        totalElements: 0
      };
      const action = new SearchBinNameSuccess(payload);

      expect({ ...action }).toEqual({
        type: BinActionTypes.SEARCH_BIN_NAME_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for SearchBinNameFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SearchBinNameFailure(payload);

      expect({ ...action }).toEqual({
        type: BinActionTypes.SEARCH_BIN_NAME_FAILURE,
        payload
      });
    });
  });

  describe('ResetBinCodeDialog Action Test Cases', () => {
    it('should check correct type is used for  ResetBinCodeDialog action ', () => {
      const action = new ResetBinCodeDialog();
      expect({ ...action }).toEqual({
        type: BinActionTypes.RESET_BINCODE_DIALOG_DATA
      });
    });
  });
});
