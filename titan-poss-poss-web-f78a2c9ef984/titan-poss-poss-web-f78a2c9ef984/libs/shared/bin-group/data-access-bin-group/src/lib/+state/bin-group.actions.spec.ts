import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  CustomErrors,
  LoadBinGroupDetailsListingPayload,
  LoadBinGroupDetailsListingSuccessPayload,
  BinGroupDetails,
  SaveBinGroupFormDetailsPayload
} from '@poss-web/shared/models';
import {
  BinGroupActionTypes,
  LoadBinGroupDetails,
  LoadBinGroupDetailsSuccess,
  LoadBinGroupDetailsFailure,
  LoadBinGroupByBinGroupCode,
  LoadBinGroupByBinGroupCodeSuccess,
  LoadBinGroupByBinGroupCodeFailure,
  ResetBinGroupDialog,
  SaveBinGroupFormDetails,
  SaveBinGroupFormDetailsFailure,
  EditBinGroupFormDetails,
  EditBinGroupFormDetailsSuccess,
  EditBinGroupFormDetailsFailure,
  SaveBinGroupFormDetailsSuccess,
  SearchByBinGroupCode,
  SearchByBinGroupCodeSuccess,
  SearchByBinGroupCodeFailure,
  SearchClear
} from './bin-group.actions';

describe('Region Action Testing Suite', () => {
  //bin group
  describe('LoadRegionDetails Action Test Cases', () => {
    it('should check correct type is used for  LoadRegionDetails action ', () => {
      const payload: LoadBinGroupDetailsListingPayload = {
        pageIndex: 0,
        pageSize: 100
      };
      const action = new LoadBinGroupDetails(payload);
      expect({ ...action }).toEqual({
        type: BinGroupActionTypes.LOAD_BIN_GROUP_DETAILS,
        payload
      });
    });
    it('should check correct type is used for  LoadBinGroupDetailsSuccess action ', () => {
      const payload: LoadBinGroupDetailsListingSuccessPayload = {
        binGroupDetailsListing: [],
        totalElements: 0
      };
      const action = new LoadBinGroupDetailsSuccess(payload);

      expect({ ...action }).toEqual({
        type: BinGroupActionTypes.LOAD_BIN_GROUP_DETAILS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadBinGroupDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadBinGroupDetailsFailure(payload);

      expect({ ...action }).toEqual({
        type: BinGroupActionTypes.LOAD_BIN_GROUP_DETAILS_FAILURE,
        payload
      });
    });
  });

  // bin group by bin group code
  describe('LoadBinGroupByBinGroupCode Action Test Cases', () => {
    it('should check correct type is used for  LoadBinGroupByBinGroupCode action ', () => {
      const payload = 'abc';
      const action = new LoadBinGroupByBinGroupCode(payload);
      expect({ ...action }).toEqual({
        type: BinGroupActionTypes.LOAD_BIN_GROUP_DETAILS_BY_BIN_GROUPCODE,
        payload
      });
    });
    it('should check correct type is used for LoadBinGroupByBinGroupCodeSuccess action ', () => {
      const payload: BinGroupDetails = {
        binGroupCode: 'AAA',
        description: 'AAA',
        isActive: true
      };
      const action = new LoadBinGroupByBinGroupCodeSuccess(payload);

      expect({ ...action }).toEqual({
        type:
          BinGroupActionTypes.LOAD_BIN_GROUP_DETAILS_BY_BIN_GROUPCODE_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadBinGroupByBinGroupCodeFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadBinGroupByBinGroupCodeFailure(payload);

      expect({ ...action }).toEqual({
        type:
          BinGroupActionTypes.LOAD_BIN_GROUP_DETAILS_BY_BIN_GROUPCODE_FAILURE,
        payload
      });
    });
  });

  describe('EditBinGroupFormDetails Action Test Cases', () => {
    it('should check correct type is used for  EditBinGroupFormDetails action ', () => {
      const payload: SaveBinGroupFormDetailsPayload = {
        binGroupCode: 'AAA',
        description: 'AAA',
        isActive: true
      };
      const action = new EditBinGroupFormDetails(payload);
      expect({ ...action }).toEqual({
        type: BinGroupActionTypes.EDIT_BINGROUP_FORM_DETAILS,
        payload
      });
    });
    it('should check correct type is used for EditBinGroupFormDetailsSuccess action ', () => {
      const payload: SaveBinGroupFormDetailsPayload = {
        binGroupCode: 'AAA',
        description: 'AAA',
        isActive: true
      };

      const action = new EditBinGroupFormDetailsSuccess(payload);

      expect({ ...action }).toEqual({
        type: BinGroupActionTypes.EDIT_BINGROUP_FORM_DETAILS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  EditBinGroupFormDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new EditBinGroupFormDetailsFailure(payload);

      expect({ ...action }).toEqual({
        type: BinGroupActionTypes.EDIT_BINGROUP_FORM_DETAILS_FAILURE,
        payload
      });
    });
  });

  describe('SaveBinGroupFormDetails Action Test Cases', () => {
    it('should check correct type is used for  SaveBinGroupFormDetails action ', () => {
      const payload: SaveBinGroupFormDetailsPayload = {
        binGroupCode: 'AAA',
        description: 'AAA',
        isActive: true
      };
      const action = new SaveBinGroupFormDetails(payload);
      expect({ ...action }).toEqual({
        type: BinGroupActionTypes.SAVE_BINGROUP_FORM_DETAILS,
        payload
      });
    });
    it('should check correct type is used for SaveBinGroupFormDetailsSuccess action ', () => {
      const payload: SaveBinGroupFormDetailsPayload = {
        binGroupCode: 'AAA',
        description: 'AAA',
        isActive: true
      };

      const action = new SaveBinGroupFormDetailsSuccess(payload);

      expect({ ...action }).toEqual({
        type: BinGroupActionTypes.SAVE_BINGROUP_FORM_DETAILS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  SaveBinGroupFormDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SaveBinGroupFormDetailsFailure(payload);

      expect({ ...action }).toEqual({
        type: BinGroupActionTypes.SAVE_BINGROUP_FORM_DETAILS_FAILURE,
        payload
      });
    });
  });
  describe('SearchByBinGroupCode Action Test Cases', () => {
    it('should check correct type is used for  SearchByBinGroupCode action ', () => {
      const payload = 'ABC';
      const action = new SearchByBinGroupCode(payload);
      expect({ ...action }).toEqual({
        type: BinGroupActionTypes.SEARCH_BINGROUP_BY_BINGROUPCODE,
        payload
      });
    });
    it('should check correct type is used for SearchByBinGroupCodeSuccess action ', () => {
      const payload: LoadBinGroupDetailsListingSuccessPayload = {
        binGroupDetailsListing: [],
        totalElements: 0
      };
      const action = new SearchByBinGroupCodeSuccess(payload);

      expect({ ...action }).toEqual({
        type: BinGroupActionTypes.SEARCH_BINGROUP_BY_BINGROUPCODE_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for SearchByBinGroupCodeFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SearchByBinGroupCodeFailure(payload);

      expect({ ...action }).toEqual({
        type: BinGroupActionTypes.SEARCH_BINGROUP_BY_BINGROUPCODE_FAILURE,
        payload
      });
    });
  });

  describe('ResetBinGroupDialog Action Test Cases', () => {
    it('should check correct type is used for  ResetBinGroupDialog action ', () => {
      const action = new ResetBinGroupDialog();
      expect({ ...action }).toEqual({
        type: BinGroupActionTypes.RESET_BINGROUP_DIALOG_DATA
      });
    });
  });

  describe('SearchClear Action Test Cases', () => {
    it('should check correct type is used for  SearchClear action ', () => {
      const action = new SearchClear();
      expect({ ...action }).toEqual({
        type: BinGroupActionTypes.SEARCH_CLEAR
      });
    });
  });
});
