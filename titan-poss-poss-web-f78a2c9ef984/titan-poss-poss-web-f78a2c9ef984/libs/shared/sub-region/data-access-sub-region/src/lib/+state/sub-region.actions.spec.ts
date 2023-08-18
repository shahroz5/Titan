import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  LoadSubRegionListingPayload,
  LoadSubRegionListingSuccessPayload,
  CustomErrors,
  SubRegion,
  SaveSubRegionDetailsPayload,
  EditSubRegionDetailsPayload,
  LoadRegionDetailsListingSuccessPayload
} from '@poss-web/shared/models';
import {
  SubRegionActionTypes,
  LoadRegionDetails,
  LoadRegionDetailsSuccess,
  LoadRegionDetailsFailure,
  LoadSubRegionDetails,
  LoadSubRegionDetailsSuccess,
  LoadSubRegionDetailsFailure,
  LoadSubRegionByCode,
  LoadSubRegionByCodeSuccess,
  LoadSubRegionByCodeFailure,
  ResetSubRegionDialog,
  SaveSubRegionFormDetails,
  SaveSubRegionFormDetailsSuccess,
  SaveSubRegionFormDetailsFailure,
  EditSubRegionDetails,
  EditSubRegionDetailsSuccess,
  EditSubRegionDetailsFailure,
  SearchSubRegion,
  SearchSubRegionSuccess,
  SearchSubRegionFailure
} from './sub-region.actions';

describe('Region Action Testing Suite', () => {
  //stone type

  describe('LoadRegionDetails Action Test Cases', () => {
    it('should check correct type is used for  LoadRegionDetails action ', () => {
      // const payload: LoadRegionListingPayload = {
      //   pageIndex: 0,
      //   pageSize: 100
      // };
      const action = new LoadRegionDetails();
      expect({ ...action }).toEqual({
        type: SubRegionActionTypes.LOAD_REGION_DETAILS
      });
    });
    it('should check correct type is used for  LoadRegionDetailsSuccess action ', () => {
      const payload: LoadRegionDetailsListingSuccessPayload = {
        regionDetailsListing: [],
        totalElements: 0
      };
      const action = new LoadRegionDetailsSuccess(payload);

      expect({ ...action }).toEqual({
        type: SubRegionActionTypes.LOAD_REGION_DETAILS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadRegionDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadRegionDetailsFailure(payload);

      expect({ ...action }).toEqual({
        type: SubRegionActionTypes.LOAD_REGION_DETAILS_FAILURE,
        payload
      });
    });
  });

  describe('LoadSubRegionDetails Action Test Cases', () => {
    it('should check correct type is used for  LoadSubRegionDetails action ', () => {
      const payload: LoadSubRegionListingPayload = {
        pageIndex: 0,
        pageSize: 100,
        parentRegionCode: 'AAA'
      };
      const action = new LoadSubRegionDetails(payload);
      expect({ ...action }).toEqual({
        type: SubRegionActionTypes.LOAD_SUB_REGION_DETAILS,
        payload
      });
    });
    it('should check correct type is used for  LoadSubRegionDetailsSuccess action ', () => {
      const payload: LoadSubRegionListingSuccessPayload = {
        subRegionDetailsListing: [],
        totalElements: 0
      };
      const action = new LoadSubRegionDetailsSuccess(payload);

      expect({ ...action }).toEqual({
        type: SubRegionActionTypes.LOAD_SUB_REGION_DETAILS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadSubRegionDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadSubRegionDetailsFailure(payload);

      expect({ ...action }).toEqual({
        type: SubRegionActionTypes.LOAD_SUB_REGION_DETAILS_FAILURE,
        payload
      });
    });
  });
  // stone type by stone type code
  describe('LoadSubRegionByCode Action Test Cases', () => {
    it('should check correct type is used for  LoadSubRegionByCode action ', () => {
      const payload = 'abc';
      const action = new LoadSubRegionByCode(payload);
      expect({ ...action }).toEqual({
        type: SubRegionActionTypes.LOAD_SUB_REGION_DETAILS_BY_CODE,
        payload
      });
    });
    it('should check correct type is used for LoadSubRegionByCodeSuccess action ', () => {
      const payload: SubRegion = {
        regionCode: 'AAA',
        description: 'AAA',
        orgCode: 'AAA',
        configDetails: {},
        parentRegionCode: 'AAA',
        isActive: true
      };
      const action = new LoadSubRegionByCodeSuccess(payload);

      expect({ ...action }).toEqual({
        type: SubRegionActionTypes.LOAD_SUB_REGION_DETAILS_BY_CODE_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadSubRegionByCodeFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadSubRegionByCodeFailure(payload);

      expect({ ...action }).toEqual({
        type: SubRegionActionTypes.LOAD_SUB_REGION_DETAILS_BY_CODE_FAILURE,
        payload
      });
    });
  });

  describe('EditSubRegionDetails Action Test Cases', () => {
    it('should check correct type is used for  EditSubRegionDetails action ', () => {
      const payload: EditSubRegionDetailsPayload = {
        regionCode: 'AAA',
        description: 'AAA',
        configDetails: {},
        isActive: true
      };
      const action = new EditSubRegionDetails(payload);
      expect({ ...action }).toEqual({
        type: SubRegionActionTypes.EDIT_SUB_REGION_DETAILS,
        payload
      });
    });
    it('should check correct type is used for EditSubRegionDetailsSuccess action ', () => {
      const payload: SaveSubRegionDetailsPayload = {
        regionCode: 'AAA',
        description: 'AAA',
        orgCode: 'AAA',
        configDetails: {},
        parentRegionCode: 'AAA',
        isActive: true
      };

      const action = new EditSubRegionDetailsSuccess(payload);

      expect({ ...action }).toEqual({
        type: SubRegionActionTypes.EDIT_SUB_REGION_DETAILS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  EditSubRegionDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new EditSubRegionDetailsFailure(payload);

      expect({ ...action }).toEqual({
        type: SubRegionActionTypes.EDIT_SUB_REGION_DETAILS_FAILURE,
        payload
      });
    });
  });

  describe('SaveSubRegionFormDetails Action Test Cases', () => {
    it('should check correct type is used for  SaveSubRegionFormDetails action ', () => {
      const payload: SaveSubRegionDetailsPayload = {
        regionCode: 'AAA',
        description: 'AAA',
        orgCode: 'AAA',
        configDetails: {},
        parentRegionCode: 'AAA',
        isActive: true
      };
      const action = new SaveSubRegionFormDetails(payload);
      expect({ ...action }).toEqual({
        type: SubRegionActionTypes.SAVE_SUB_REGION_DETAILS,
        payload
      });
    });
    it('should check correct type is used for SaveSubRegionFormDetailsSuccess action ', () => {
      const payload: SaveSubRegionDetailsPayload = {
        regionCode: 'AAA',
        description: 'AAA',
        orgCode: 'AAA',
        configDetails: {},
        parentRegionCode: 'AAA',
        isActive: true
      };

      const action = new SaveSubRegionFormDetailsSuccess(payload);

      expect({ ...action }).toEqual({
        type: SubRegionActionTypes.SAVE_SUB_REGION_DETAILS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  SaveSubRegionFormDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SaveSubRegionFormDetailsFailure(payload);

      expect({ ...action }).toEqual({
        type: SubRegionActionTypes.SAVE_SUB_REGION_DETAILS_FAILURE,
        payload
      });
    });
  });
  describe('SearchSubRegion Action Test Cases', () => {
    it('should check correct type is used for  SearchSubRegion action ', () => {
      const payload = { regionCode: 'ABC', parentRegionCode: 'AAA' };
      const action = new SearchSubRegion(payload);
      expect({ ...action }).toEqual({
        type: SubRegionActionTypes.SEARCH_SUB_REGION_BY_CODE,
        payload
      });
    });
    it('should check correct type is used for SearchSubRegionSuccess action ', () => {
      const payload: LoadSubRegionListingSuccessPayload = {
        subRegionDetailsListing: [],
        totalElements: 0
      };
      const action = new SearchSubRegionSuccess(payload);

      expect({ ...action }).toEqual({
        type: SubRegionActionTypes.SEARCH_SUB_REGION_CODE_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for SearchSubRegionFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SearchSubRegionFailure(payload);

      expect({ ...action }).toEqual({
        type: SubRegionActionTypes.SEARCH_SUB_REGION_BY_CODE_FAILURE,
        payload
      });
    });
  });

  describe('ResetSubRegionDialog Action Test Cases', () => {
    it('should check correct type is used for  ResetSubRegionDialog action ', () => {
      const action = new ResetSubRegionDialog();
      expect({ ...action }).toEqual({
        type: SubRegionActionTypes.RESET_SUB_REGION_DIALOG_DATA
      });
    });
  });
});
