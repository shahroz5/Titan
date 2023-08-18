import {
  LoadProductCategoryListingPayload,
  LoadProductCategoryListingSuccessPayload,
  ProductCategoryDetails
} from '@poss-web/shared/models';
import * as actions from './product-category.actions';
import { ProductCategoryState } from './product-category.state';
import {
  ProductCategoryReducer,
  initialState as istate
} from './product-category.reducer';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';

describe('Product Category Reducer Testing Suite', () => {
  const initialState = { ...istate, productCategoryListing: [] };

  const responsePayload: ProductCategoryDetails = {
    orgCode: 'orgCode',
    productCategoryCode: 'A',
    description: 'desc',
    isActive: true,
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

  describe('Testing LoadProductCategoryDetails Functionality', () => {
    it('LoadProductCategoryDetails should be called', () => {
      const payload: LoadProductCategoryListingPayload = {
        pageIndex: 0,
        pageSize: 8
      };

      const action = new actions.LoadProductCategoryDetails(payload);

      const result: ProductCategoryState = ProductCategoryReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.error).toEqual(null);
    });
    it('LoadProductCategoryDetailsSuccess should return list', () => {
      const payload: LoadProductCategoryListingSuccessPayload = {
        productCategoryListing: [],
        totalElements: 2
      };
      const action = new actions.LoadProductCategoryDetailsSuccess(payload);
      const result: ProductCategoryState = ProductCategoryReducer(
        initialState,
        action
      );

      expect(result.totalProductCategoryDetails).toBe(2);
      expect(result.isLoading).toBe(false);
    });
    it('LoadProductCategoryDetailsFailure should return error', () => {
      const action = new actions.LoadProductCategoryDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: ProductCategoryState = ProductCategoryReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadProductCategoryByProductCategoryCode Functionality', () => {
    it('LoadProductCategoryByProductCategoryCode should be called', () => {
      const action = new actions.LoadProductCategoryByProductCategoryCode(
        'test'
      );

      const result: ProductCategoryState = ProductCategoryReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.error).toEqual(null);
    });
    it('LoadProductCategoryDetailsSuccess should return list', () => {
      const action = new actions.LoadProductCategoryByProductCategoryCodeSuccess(
        responsePayload
      );
      const result: ProductCategoryState = ProductCategoryReducer(
        initialState,
        action
      );

      expect(result.productCategoryDetails).toBeDefined();
      expect(result.isLoading).toBe(false);
    });
    it('LoadProductCategoryByProductCategoryCodeFailure should return error', () => {
      const action = new actions.LoadProductCategoryByProductCategoryCodeFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: ProductCategoryState = ProductCategoryReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadProductCategoryByProductCategoryCode Functionality', () => {
    it('LoadProductCategoryByProductCategoryCode should be called', () => {
      const action = new actions.LoadProductCategoryByProductCategoryCode(
        'test'
      );
      const result: ProductCategoryState = ProductCategoryReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.error).toEqual(null);
    });
    it('LoadProductCategoryDetailsSuccess should return list', () => {
      const action = new actions.LoadProductCategoryByProductCategoryCodeSuccess(
        responsePayload
      );
      const result: ProductCategoryState = ProductCategoryReducer(
        initialState,
        action
      );
      expect(result.productCategoryDetails).toBeDefined();
      expect(result.isLoading).toBe(false);
    });
    it('LoadProductCategoryByProductCategoryCodeFailure should return error', () => {
      const action = new actions.LoadProductCategoryByProductCategoryCodeFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: ProductCategoryState = ProductCategoryReducer(
        initialState,
        action
      );
      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing SaveProductCategoryFormDetails Functionality', () => {
    it('SaveProductCategoryFormDetails should be called', () => {
      const action = new actions.SaveProductCategoryFormDetails(
        responsePayload
      );
      const result: ProductCategoryState = ProductCategoryReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.error).toEqual(null);
    });
    it('SaveProductCategoryFormDetailsSuccess should return list', () => {
      const payload: LoadProductCategoryListingSuccessPayload = {
        productCategoryListing: [],
        totalElements: 2
      };
      const action = new actions.SaveProductCategoryFormDetailsSuccess(
        responsePayload
      );
      const result: ProductCategoryState = ProductCategoryReducer(
        initialState,
        action
      );
      expect(result.saveProductCategoryResponses).toBeDefined();
      expect(result.isLoading).toBe(false);
    });
    it('SaveProductCategoryFormDetailsFailure should return error', () => {
      const action = new actions.SaveProductCategoryFormDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: ProductCategoryState = ProductCategoryReducer(
        initialState,
        action
      );
      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing EditProductCategoryFormDetails Functionality', () => {
    it('EditProductCategoryFormDetails should be called', () => {
      const action = new actions.EditProductCategoryFormDetails(
        responsePayload
      );
      const result: ProductCategoryState = ProductCategoryReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.error).toEqual(null);
    });
    it('EditProductCategoryFormDetailsSuccess should return list', () => {
      const action = new actions.EditProductCategoryFormDetailsSuccess(
        responsePayload
      );
      const result: ProductCategoryState = ProductCategoryReducer(
        initialState,
        action
      );
      expect(result.editProductCategoryResponses).toBeDefined();
      expect(result.isLoading).toBe(false);
    });
    it('EditProductCategoryFormDetailsFailure should return error', () => {
      const action = new actions.EditProductCategoryFormDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: ProductCategoryState = ProductCategoryReducer(
        initialState,
        action
      );
      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing SearchProductCategoryCode Functionality', () => {
    it('SearchProductCategoryCode should be called', () => {
      const action = new actions.SearchProductCategoryCode('a');
      const result: ProductCategoryState = ProductCategoryReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.error).toEqual(null);
    });
    it('SearchProductCategoryCodeSuccess should return list', () => {
      const action = new actions.SearchProductCategoryCodeSuccess([
        responsePayload
      ]);
      const result: ProductCategoryState = ProductCategoryReducer(
        initialState,
        action
      );
      expect(result.productCategoryListing).toBeDefined();
      expect(result.isLoading).toBe(false);
    });
    it('SearchProductCategoryCodeFailure should return error', () => {
      const action = new actions.SearchProductCategoryCodeFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: ProductCategoryState = ProductCategoryReducer(
        initialState,
        action
      );
      expect(result.error.message).toEqual('some error');
    });
  });
});
