import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  LoadRegionDetailsListingSuccessPayload,
  LoadRegionListingPayload,
  CustomErrors,
  RegionsData,
  SaveRegionDetailsPayload,
  EditRegionDetailsPayload
} from '@poss-web/shared/models';
import {
  RegionActionTypes,
  LoadRegionDetails,
  LoadRegionDetailsSuccess,
  LoadRegionDetailsFailure,
  LoadRegionByCode,
  LoadRegionByCodeSuccess,
  LoadRegionByCodeFailure,
  ResetRegionDialog,
  SaveRegionFormDetails,
  SaveRegionFormDetailsSuccess,
  SaveRegionFormDetailsFailure,
  EditRegionDetails,
  EditRegionDetailsSuccess,
  EditRegionDetailsFailure,
  SearchRegion,
  SearchRegionSuccess,
  SearchRegionFailure
} from './region.actions';

describe('Region Action Testing Suite', () => {
  //stone type
  describe('LoadRegionDetails Action Test Cases', () => {
    it('should check correct type is used for  LoadRegionDetails action ', () => {
      const payload: LoadRegionListingPayload = {
        pageIndex: 0,
        pageSize: 100
      };
      const action = new LoadRegionDetails(payload);
      expect({ ...action }).toEqual({
        type: RegionActionTypes.LOAD_REGION_DETAILS,
        payload
      });
    });
    it('should check correct type is used for  LoadRegionDetailsSuccess action ', () => {
      const payload: LoadRegionDetailsListingSuccessPayload = {
        regionDetailsListing: [],
        totalElements: 0
      };
      const action = new LoadRegionDetailsSuccess(payload);

      expect({ ...action }).toEqual({
        type: RegionActionTypes.LOAD_REGION_DETAILS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadRegionDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadRegionDetailsFailure(payload);

      expect({ ...action }).toEqual({
        type: RegionActionTypes.LOAD_REGION_DETAILS_FAILURE,
        payload
      });
    });
  });

  // stone type by stone type code
  describe('LoadRegionByCode Action Test Cases', () => {
    it('should check correct type is used for  LoadRegionByCode action ', () => {
      const payload = 'abc';
      const action = new LoadRegionByCode(payload);
      expect({ ...action }).toEqual({
        type: RegionActionTypes.LOAD_REGION_DETAILS_BY_CODE,
        payload
      });
    });
    it('should check correct type is used for LoadRegionByCodeSuccess action ', () => {
      const payload: RegionsData = {
        regionCode: 'AAA',
        description: 'AAA',
        orgCode: 'AAA',
        configDetails: {},
        parentRegionCode: 'AAA',
        isActive: true
      };
      const action = new LoadRegionByCodeSuccess(payload);

      expect({ ...action }).toEqual({
        type: RegionActionTypes.LOAD_REGION_DETAILS_BY_CODE_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadRegionByCodeFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadRegionByCodeFailure(payload);

      expect({ ...action }).toEqual({
        type: RegionActionTypes.LOAD_REGION_DETAILS_BY_CODE_FAILURE,
        payload
      });
    });
  });

  describe('EditRegionDetails Action Test Cases', () => {
    it('should check correct type is used for  EditRegionDetails action ', () => {
      const payload: EditRegionDetailsPayload = {
        regionCode: 'AAA',
        description: 'AAA',
        configDetails: {},
        isActive: true
      };
      const action = new EditRegionDetails(payload);
      expect({ ...action }).toEqual({
        type: RegionActionTypes.EDIT_REGION_DETAILS,
        payload
      });
    });
    it('should check correct type is used for EditRegionDetailsSuccess action ', () => {
      const payload: SaveRegionDetailsPayload = {
        regionCode: 'AAA',
        description: 'AAA',
        orgCode: 'AAA',
        configDetails: {},
        parentRegionCode: 'AAA',
        isActive: true
      };

      const action = new EditRegionDetailsSuccess(payload);

      expect({ ...action }).toEqual({
        type: RegionActionTypes.EDIT_REGION_DETAILS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  EditRegionDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new EditRegionDetailsFailure(payload);

      expect({ ...action }).toEqual({
        type: RegionActionTypes.EDIT_REGION_DETAILS_FAILURE,
        payload
      });
    });
  });

  describe('SaveRegionFormDetails Action Test Cases', () => {
    it('should check correct type is used for  SaveRegionFormDetails action ', () => {
      const payload: SaveRegionDetailsPayload = {
        regionCode: 'AAA',
        description: 'AAA',
        orgCode: 'AAA',
        configDetails: {},
        parentRegionCode: 'AAA',
        isActive: true
      };
      const action = new SaveRegionFormDetails(payload);
      expect({ ...action }).toEqual({
        type: RegionActionTypes.SAVE_REGION_DETAILS,
        payload
      });
    });
    it('should check correct type is used for SaveRegionFormDetailsSuccess action ', () => {
      const payload: SaveRegionDetailsPayload = {
        regionCode: 'AAA',
        description: 'AAA',
        orgCode: 'AAA',
        configDetails: {},
        parentRegionCode: 'AAA',
        isActive: true
      };

      const action = new SaveRegionFormDetailsSuccess(payload);

      expect({ ...action }).toEqual({
        type: RegionActionTypes.SAVE_REGION_DETAILS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  SaveRegionFormDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SaveRegionFormDetailsFailure(payload);

      expect({ ...action }).toEqual({
        type: RegionActionTypes.SAVE_REGION_DETAILS_FAILURE,
        payload
      });
    });
  });
  describe('SearchRegion Action Test Cases', () => {
    it('should check correct type is used for  SearchRegion action ', () => {
      const payload = 'ABC';
      const action = new SearchRegion(payload);
      expect({ ...action }).toEqual({
        type: RegionActionTypes.SEARCH_REGION_BY_CODE,
        payload
      });
    });
    it('should check correct type is used for SearchRegionSuccess action ', () => {
      const payload: LoadRegionDetailsListingSuccessPayload = {
        regionDetailsListing: [],
        totalElements: 0
      };
      const action = new SearchRegionSuccess(payload);

      expect({ ...action }).toEqual({
        type: RegionActionTypes.SEARCH_REGION_BY_CODE_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for SearchRegionFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SearchRegionFailure(payload);

      expect({ ...action }).toEqual({
        type: RegionActionTypes.SEARCH_REGION_BY_CODE_FAILURE,
        payload
      });
    });
  });

  describe('ResetRegionDialog Action Test Cases', () => {
    it('should check correct type is used for  ResetRegionDialog action ', () => {
      const action = new ResetRegionDialog();
      expect({ ...action }).toEqual({
        type: RegionActionTypes.RESET_REGION_DIALOG_DATA
      });
    });
  });
});
