import {
  CustomErrors,
  LoadProductCategoryListingPayload,
  LoadProductCategoryListingSuccessPayload,
  ProductCategoryDetails,
  SaveProductCategoryFormDetailsPayload
} from '@poss-web/shared/models';
import {
  LoadProductCategoryDetails,
  LoadProductCategoryDetailsSuccess,
  LoadProductCategoryDetailsFailure,
  ProductCategoryActionTypes,
  LoadProductCategoryByProductCategoryCode,
  LoadProductCategoryByProductCategoryCodeSuccess,
  LoadProductCategoryByProductCategoryCodeFailure,
  SaveProductCategoryFormDetails,
  SaveProductCategoryFormDetailsSuccess,
  SaveProductCategoryFormDetailsFailure,
  EditProductCategoryFormDetails,
  EditProductCategoryFormDetailsSuccess,
  EditProductCategoryFormDetailsFailure,
  SearchProductCategoryCode,
  SearchProductCategoryCodeSuccess,
  SearchProductCategoryCodeFailure
} from './product-category.actions';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';

describe('Product Category Action Testing Suite', () => {
  describe('LoadProductCategoryDetails Action Test Cases', () => {
    it('should check correct type is used for LoadProductCategoryDetails action', () => {
      const payload: LoadProductCategoryListingPayload = {
        pageIndex: 0,
        pageSize: 8
      };
      const action = new LoadProductCategoryDetails(payload);
      expect({ ...action }).toEqual({
        type: ProductCategoryActionTypes.LOAD_PRODUCT_CATEGORY_DETAILS,
        payload
      });
    });

    it('should check correct type is used for LoadProductCategoryDetailsSuccess action', () => {
      const payload: LoadProductCategoryListingSuccessPayload = {
        productCategoryListing: [],
        totalElements: 8
      };

      const action = new LoadProductCategoryDetailsSuccess(payload);
      expect({ ...action }).toEqual({
        type: ProductCategoryActionTypes.LOAD_PRODUCT_CATEGORY_DETAILS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadProductCategoryDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadProductCategoryDetailsFailure(payload);

      expect({ ...action }).toEqual({
        type: ProductCategoryActionTypes.LOAD_PRODUCT_CATEGORY_DETAILS_FAILURE,
        payload
      });
    });
  });

  describe('LoadProductCategoryByProductCategoryCode Action Test Cases', () => {
    it('should check correct type is used for LoadProductCategoryByProductCategoryCode action', () => {
      const payload = 'TEST';
      const action = new LoadProductCategoryByProductCategoryCode(payload);
      expect({ ...action }).toEqual({
        type:
          ProductCategoryActionTypes.LOAD_PRODUCT_CATEGORY_DETAILS_BY_PRODUCT_CATEGORYCODE,
        payload
      });
    });

    it('should check correct type is used for LoadProductCategoryByProductCategoryCodeSuccess action', () => {
      const payload: ProductCategoryDetails = {
        description: 'Desc',
        orgCode: 'orgCode',
        productCategoryCode: 'code',
        isActive: true,
        isConversionEnabled: true,
        hallmarkDetails: {
          data: {
            hallmarkingCharges: '10',
            isAllowedForHallmarking: false,
            isFOCForHallmarkingCharges: false
          },
          type: 'HALLMARK_DETAILS'
        }
      };

      const action = new LoadProductCategoryByProductCategoryCodeSuccess(
        payload
      );
      expect({ ...action }).toEqual({
        type:
          ProductCategoryActionTypes.LOAD_PRODUCT_CATEGORY_DETAILS_BY_PRODUCT_CATEGORYCODE_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadProductCategoryByProductCategoryCodeFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadProductCategoryByProductCategoryCodeFailure(
        payload
      );

      expect({ ...action }).toEqual({
        type:
          ProductCategoryActionTypes.LOAD_PRODUCT_CATEGORY_DETAILS_BY_PRODUCT_CATEGORYCODE_FAILURE,
        payload
      });
    });
  });

  describe('SaveProductCategoryFormDetails Action Test Cases', () => {
    it('should check correct type is used for LoadProductCategoryByProductCategoryCode action', () => {
      const payload: SaveProductCategoryFormDetailsPayload = {
        isActive: true,
        isConversionEnabled: true,
        hallmarkQuantity: 10,
        description: 'desc',
        orgCode: 'ORG',
        productCategoryCode: 'CODE',
        hallmarkDetails: {
          data: {
            hallmarkingCharges: '10',
            isAllowedForHallmarking: false,
            isFOCForHallmarkingCharges: false
          },
          type: 'HALLMARK_DETAILS'
        }
      };
      const action = new SaveProductCategoryFormDetails(payload);
      expect({ ...action }).toEqual({
        type: ProductCategoryActionTypes.SAVE_PRODUCT_CATEGORY_FORM_DETAILS,
        payload
      });
    });

    it('should check correct type is used for SaveProductCategoryFormDetailsSuccess action', () => {
      const payload: ProductCategoryDetails = {
        description: 'Desc',
        orgCode: 'orgCode',
        productCategoryCode: 'code',
        isActive: true,
        isConversionEnabled: true,
        hallmarkDetails: {
          data: {
            hallmarkingCharges: '10',
            isAllowedForHallmarking: false,
            isFOCForHallmarkingCharges: false
          },
          type: 'HALLMARK_DETAILS'
        }
      };

      const action = new SaveProductCategoryFormDetailsSuccess(payload);
      expect({ ...action }).toEqual({
        type:
          ProductCategoryActionTypes.SAVE_PRODUCT_CATEGORY_FORM_DETAILS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for SaveProductCategoryFormDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SaveProductCategoryFormDetailsFailure(payload);

      expect({ ...action }).toEqual({
        type:
          ProductCategoryActionTypes.SAVE_PRODUCT_CATEGORY_FORM_DETAILS_FAILURE,
        payload
      });
    });
  });

  describe('EditProductCategoryFormDetails Action Test Cases', () => {
    it('should check correct type is used for LoadProductCategoryByProductCategoryCode action', () => {
      const payload: SaveProductCategoryFormDetailsPayload = {
        isActive: true,
        description: 'desc',
        orgCode: 'ORG',
        productCategoryCode: 'CODE',
        isConversionEnabled: true,
        hallmarkQuantity: 10,
        hallmarkDetails: {
          data: {
            hallmarkingCharges: '10',
            isAllowedForHallmarking: false,
            isFOCForHallmarkingCharges: false
          },
          type: 'HALLMARK_DETAILS'
        }
      };
      const action = new EditProductCategoryFormDetails(payload);
      expect({ ...action }).toEqual({
        type: ProductCategoryActionTypes.EDIT_PRODUCT_CATEGORY_FORM_DETAILS,
        payload
      });
    });

    it('should check correct type is used for EditProductCategoryFormDetailsSuccess action', () => {
      const payload: ProductCategoryDetails = {
        description: 'Desc',
        orgCode: 'orgCode',
        productCategoryCode: 'code',
        isActive: true,
        isConversionEnabled: true,
        hallmarkDetails: {
          data: {
            hallmarkingCharges: '10',
            isAllowedForHallmarking: false,
            isFOCForHallmarkingCharges: false
          },
          type: 'HALLMARK_DETAILS'
        }
      };

      const action = new EditProductCategoryFormDetailsSuccess(payload);
      expect({ ...action }).toEqual({
        type:
          ProductCategoryActionTypes.EDIT_PRODUCT_CATEGORY_FORM_DETAILS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for EditProductCategoryFormDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new EditProductCategoryFormDetailsFailure(payload);

      expect({ ...action }).toEqual({
        type:
          ProductCategoryActionTypes.EDIT_PRODUCT_CATEGORY_FORM_DETAILS_FAILURE,
        payload
      });
    });
  });

  describe('SearchProductCategoryCode Action Test Cases', () => {
    it('should check correct type is used for SearchProductCategoryCode action', () => {
      const payload = 'param';
      const action = new SearchProductCategoryCode(payload);
      expect({ ...action }).toEqual({
        type: ProductCategoryActionTypes.SEARCH_PRODUCT_CATEGORY_DETAILS,
        payload
      });
    });
    it('should check correct type is used for SearchProductCategoryCodeSuccess action', () => {
      const payload: ProductCategoryDetails[] = [];

      const action = new SearchProductCategoryCodeSuccess(payload);
      expect({ ...action }).toEqual({
        type:
          ProductCategoryActionTypes.SEARCH_PRODUCT_CATEGORY_DETAILS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for SearchProductCategoryCodeFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SearchProductCategoryCodeFailure(payload);

      expect({ ...action }).toEqual({
        type:
          ProductCategoryActionTypes.SEARCH_PRODUCT_CATEGORY_DETAILS_FAILURE,
        payload
      });
    });
  });
});
