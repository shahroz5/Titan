import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  CustomErrors,
  BrandListing,
  BrandMaster,
  UpdateBrandMasterDetailsPayload,
  UpadateIsActivePayload,
  SubBrandListingPayload,
  SearchPayload
} from '@poss-web/shared/models';

import {
  SaveSubBrandMasterDetailsSuccess,
  UpdateSubBrandMasterDetailsSuccess,
  UpdateSubBrandMasterDetailsFailure,
  LoadSubrandDetailsByBrandCodeSuccess,
  SearchSubBrandByBrandCodeSuccess,
  SearchSubBrandByBrandCodeFailure,
  LoadSubBrandListing,
  SubBrandMasterActionTypes,
  LoadSubBrandListingSuccess,
  LoadSubBrandListingFailure,
  SaveSubBrandMasterDetails,
  SaveSubBrandMasterDetailsFailure,
  UpdateSubBrandMasterDetails,
  LoadSubrandDetailsByBrandCode,
  UpdateIsActive,
  UpdateIsActiveSuccess,
  UpdateIsActiveFailure,
  LoadParenBrands,
  LoadParenBrandsSuccess,
  LoadParenBrandsFailure,
  SearchSubBrandByBrandCode,
  LoadReset,
  ResetIsActiveToggle,
  LoadSubrandDetailsByBrandCodeFailure
} from './subbrand.actions';

describe('Subbrand Master Action Testing Suite', () => {
  describe('LoadSubBrandListing Action Test Cases', () => {
    it('should check correct type is used for  LoadSubBrandListing action ', () => {
      const payload: SubBrandListingPayload = {
        pageEvent: { pageIndex: 0, pageSize: 100 },
        parentBrandCode: 'Tanishq'
      };
      const action = new LoadSubBrandListing(payload);
      expect({ ...action }).toEqual({
        type: SubBrandMasterActionTypes.LOAD_SUB_BRAND_MASTER_LISTING,
        payload
      });
    });
    it('should check correct type is used for  LoadSubBrandListingSuccess action ', () => {
      const payload: BrandListing = { results: [], totalElements: 0 };
      const action = new LoadSubBrandListingSuccess(payload);

      expect({ ...action }).toEqual({
        type: SubBrandMasterActionTypes.LOAD_SUB_BRAND_MASTER_LISTING_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadSubBrandListingFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadSubBrandListingFailure(payload);

      expect({ ...action }).toEqual({
        type: SubBrandMasterActionTypes.LOAD_SUB_BRAND_MASTER_LISTING_FAILURE,
        payload
      });
    });
  });

  describe('SaveSubBrandMasterDetails Action Test Cases', () => {
    it('should check correct type is used for  SaveSubBrandMasterDetails action ', () => {
      const payload: BrandMaster = {
        brandCode: 'tanishq',
        description: 'ABC',
        parentBrandCode: 'titan',
        configDetails: {},
        orgCode: 'TJ',
        isActive: true
      };
      const action = new SaveSubBrandMasterDetails(payload);
      expect({ ...action }).toEqual({
        type: SubBrandMasterActionTypes.SAVE_SUB_BRAND_MASTER_DETAILS,
        payload
      });
    });
    it('should check correct type is used for SaveSubBrandMasterDetailsSuccess action ', () => {
      const action = new SaveSubBrandMasterDetailsSuccess();

      expect({ ...action }).toEqual({
        type: SubBrandMasterActionTypes.SAVE_SUB_BRAND_MASTER_DETAILS_SUCCESS
      });
    });
    it('should check correct type is used for  SaveSubBrandMasterDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SaveSubBrandMasterDetailsFailure(payload);

      expect({ ...action }).toEqual({
        type: SubBrandMasterActionTypes.SAVE_SUB_BRAND_MASTER_DETAILS_FAILURE,
        payload
      });
    });
  });

  describe('UpdateSubBrandMasterDetails Action Test Cases', () => {
    it('should check correct type is used for  UpdateSubBrandMasterDetails action ', () => {
      const payload: UpdateBrandMasterDetailsPayload = {
        brandCode: 'tanishq',
        data: {
          isActive: false
        }
      };
      const action = new UpdateSubBrandMasterDetails(payload);
      expect({ ...action }).toEqual({
        type: SubBrandMasterActionTypes.UPDATE_SUB_BRAND_MASTER_DETAILS,
        payload
      });
    });
    it('should check correct type is used for UpdateSubBrandMasterDetailsSuccess action ', () => {
      const action = new UpdateSubBrandMasterDetailsSuccess();

      expect({ ...action }).toEqual({
        type: SubBrandMasterActionTypes.UPDATE_SUB_BRAND_MASTER_DETAILS_SUCCESS
      });
    });
    it('should check correct type is used for  UpdateSubBrandMasterDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new UpdateSubBrandMasterDetailsFailure(payload);

      expect({ ...action }).toEqual({
        type: SubBrandMasterActionTypes.UPDATE_SUB_BRAND_MASTER_DETAILS_FAILURE,
        payload
      });
    });
  });

  describe('LoadSubrandDetailsByBrandCode Action Test Cases', () => {
    it('should check correct type is used for  LoadSubrandDetailsByBrandCode action ', () => {
      const payload = 'tanishq';
      const action = new LoadSubrandDetailsByBrandCode(payload);
      expect({ ...action }).toEqual({
        type: SubBrandMasterActionTypes.LOAD_SUB_BRAND_DETAILS_BY_BRAND_CODE,
        payload
      });
    });
    it('should check correct type is used for LoadSubrandDetailsByBrandCode action ', () => {
      const payload: BrandMaster = {
        brandCode: 'tanishq',
        description: 'ABC',
        parentBrandCode: 'titan',
        configDetails: {},
        orgCode: 'TJ',
        isActive: true
      };

      const action = new LoadSubrandDetailsByBrandCodeSuccess(payload);

      expect({ ...action }).toEqual({
        type:
          SubBrandMasterActionTypes.LOAD_SUB_BRAND_DETAILS_BY_BRAND_CODE_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadSubrandDetailsByBrandCodeFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadSubrandDetailsByBrandCodeFailure(payload);

      expect({ ...action }).toEqual({
        type:
          SubBrandMasterActionTypes.LOAD_SUB_BRAND_DETAILS_BY_BRAND_CODE_FAILURE,
        payload
      });
    });
  });

  describe('UpdateIsActive Action Test Cases', () => {
    it('should check correct type is used for  UpdateIsActive action ', () => {
      const payload: UpadateIsActivePayload = {
        brandCode: 'tanishq',
        isActive: true
      };
      const action = new UpdateIsActive(payload);
      expect({ ...action }).toEqual({
        type: SubBrandMasterActionTypes.UPDATE_IS_ACTIVE,
        payload
      });
    });
    it('should check correct type is used for UpdateIsActiveSuccess action ', () => {
      const payload: BrandMaster = {
        brandCode: 'tanishq',
        description: 'ABC',
        parentBrandCode: 'titan',
        configDetails: {},
        orgCode: 'TJ',
        isActive: true
      };

      const action = new UpdateIsActiveSuccess(payload);

      expect({ ...action }).toEqual({
        type: SubBrandMasterActionTypes.UPDATE_IS_ACTIVE_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for UpdateIsActiveFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new UpdateIsActiveFailure(payload);

      expect({ ...action }).toEqual({
        type: SubBrandMasterActionTypes.UPDATE_IS_ACTIVE_FAILURE,
        payload
      });
    });
  });

  describe('LoadParenBrands Action Test Cases', () => {
    it('should check correct type is used for  LoadParenBrands action ', () => {
      const action = new LoadParenBrands();
      expect({ ...action }).toEqual({
        type: SubBrandMasterActionTypes.LOAD_PARENT_BRANDS
      });
    });
    it('should check correct type is used for LoadParenBrandsSuccess action ', () => {
      const payload: BrandMaster[] = [
        {
          brandCode: 'new',
          description: '',
          parentBrandCode: '',
          configDetails: {},
          orgCode: '',
          isActive: true
        }
      ];
      const action = new LoadParenBrandsSuccess(payload);
      expect({ ...action }).toEqual({
        type: SubBrandMasterActionTypes.LOAD_PARENT_BRANDS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadParenBrandsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadParenBrandsFailure(payload);

      expect({ ...action }).toEqual({
        type: SubBrandMasterActionTypes.LOAD_PARENT_BRANDS_FAILURE,
        payload
      });
    });
  });

  describe('SearchSubBrandByBrandCode Action Test Cases', () => {
    it('should check correct type is used for  SearchSubBrandByBrandCode action ', () => {
      const payload: SearchPayload = {
        brandCode: 'tanishq',
        parentBrandCode: 'Titan'
      };
      const action = new SearchSubBrandByBrandCode(payload);
      expect({ ...action }).toEqual({
        type: SubBrandMasterActionTypes.SEARCH_SUB_BRAND_BY_BRAND_CODE,
        payload
      });
    });
    it('should check correct type is used for SearchSubBrandByBrandCodeSuccess action ', () => {
      const payload: BrandListing = { results: [], totalElements: 0 };
      const action = new SearchSubBrandByBrandCodeSuccess(payload);

      expect({ ...action }).toEqual({
        type: SubBrandMasterActionTypes.SEARCH_SUB_BRAND_BY_BRAND_CODE_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for SearchSubBrandByBrandCodeFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SearchSubBrandByBrandCodeFailure(payload);

      expect({ ...action }).toEqual({
        type: SubBrandMasterActionTypes.SEARCH_SUB_BRAND_BY_BRAND_CODE_FAILURE,
        payload
      });
    });
  });

  describe('LoadReset Action Test Cases', () => {
    it('should check correct type is used for  LoadReset action ', () => {
      const action = new LoadReset();
      expect({ ...action }).toEqual({
        type: SubBrandMasterActionTypes.LOAD_RESET_BRAND_DETAILS
      });
    });
  });

  describe('ResetIsActiveToggle Action Test Cases', () => {
    it('should check correct type is used for  ResetIsActiveToggle action ', () => {
      const action = new ResetIsActiveToggle();
      expect({ ...action }).toEqual({
        type: SubBrandMasterActionTypes.RESET_IS_ACTIVE
      });
    });
  });
});
