import {
  EncircleProductGroupMappingSavePayload,
  ProductGroup,
  ProductGroupMappingOption,
  ProductGroupMappingResponse
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import * as actions from './encircle-product-group-mapping.actions';
import {
  EncircleProductGroupMappingReducer,
  initialState
} from './encircle-product-group-mapping.reducer';
import { EncircleProductGroupMappingState } from './encircle-product-group-mapping.state';

describe('EncircleProductMapping Reducer Testing Suite', () => {
  const payload = {
    paymentMode: 'Encircle',
    pageIndex: 0,
    pageSize: 10
  };
  const savePayload: EncircleProductGroupMappingSavePayload = {
    savePayload: {
      addProductGroupCode: ['71', '72'],
      removeProductMappingIds: []
    },
    paymentCategoryName: 'Encircle'
  };
  const selectedProductGroups: ProductGroupMappingOption[] = [
    {
      id: '123',
      uuid: '123',
      description: 'Metal'
    }
  ];
  const selectedProductGroupsResponse: ProductGroupMappingResponse = {
    response: selectedProductGroups,
    totalElements: 1
  };
  const productGroups: ProductGroup[] = [
    {
      description: 'Metal',
      productGroupCode: '71'
    }
  ];
  describe('Testing SaveEncircleProdcutGroups', () => {
    it('SaveEncircleProdcutGroups should return isLoading=true,error=null', () => {
      const action = new actions.SaveEncircleProdcutGroups(savePayload);

      const result: EncircleProductGroupMappingState = EncircleProductGroupMappingReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(true);
      expect(result.hasSaved).toBe(false);
    });
    it('SaveEncircleProdcutGroupsSuccess should return proper state', () => {
      const action = new actions.SaveEncircleProdcutGroupsSuccess();

      const result: EncircleProductGroupMappingState = EncircleProductGroupMappingReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.hasSaved).toBe(true);
    });
    it('SaveEncircleProdcutGroupsFailure should return error', () => {
      const action = new actions.SaveEncircleProdcutGroupsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: EncircleProductGroupMappingState = EncircleProductGroupMappingReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
      expect(result.hasSaved).toEqual(false);
    });
  });
  describe('Testing LoadSelectedProductGroups', () => {
    it('LoadSelectedProductGroups should return proper state', () => {
      const action = new actions.LoadSelectedProductGroups(payload);
      const result: EncircleProductGroupMappingState = EncircleProductGroupMappingReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(true);
    });
    it('LoadSelectedProductGroupsSuccess should return proper state', () => {
      const action = new actions.LoadSelectedProductGroupsSuccess(
        selectedProductGroupsResponse
      );

      const result: EncircleProductGroupMappingState = EncircleProductGroupMappingReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.selectedProductGroups).toBe(
        selectedProductGroupsResponse.response
      );
      expect(result.totalElements).toBe(
        selectedProductGroupsResponse.totalElements
      );
    });
    it('LoadSelectedProductGroupsFailure should return error', () => {
      const action = new actions.LoadSelectedProductGroupsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: EncircleProductGroupMappingState = EncircleProductGroupMappingReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
    });
  });
  describe('LoadAllSelectedProductGroups Test Cases', () => {
    it('LoadAllSelectedProductGroups should return proper state', () => {
      const action = new actions.LoadAllSelectedProductGroups(payload);
      const result: EncircleProductGroupMappingState = EncircleProductGroupMappingReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(true);
    });
    it('LoadAllSelectedProductGroupsSuccess should return proper state', () => {
      const action = new actions.LoadAllSelectedProductGroupsSuccess(
        selectedProductGroupsResponse
      );

      const result: EncircleProductGroupMappingState = EncircleProductGroupMappingReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.allSelectedGroups).toBe(selectedProductGroups);
    });
    it('LoadAllSelectedProductGroupsFailure should return error', () => {
      const action = new actions.LoadAllSelectedProductGroupsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: EncircleProductGroupMappingState = EncircleProductGroupMappingReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
    });
  });
  describe('ResetProductGroups Test Cases', () => {
    it('ResetProductGroups should return proper state', () => {
      const action = new actions.ResetProductGroups();
      const result: EncircleProductGroupMappingState = EncircleProductGroupMappingReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.selectedProductGroups).toBe(null);
      expect(result.hasSaved).toBe(false);
      expect(result.hasRemoved).toBe(false);
      expect(result.isLoading).toBe(false);
      expect(result.error).toBe(null);
      expect(result.allSelectedGroups).toBe(null);
      expect(result.totalElements).toBe(0);
    });
  });
  describe('RemoveEncircleProdcutGroups Test Cases', () => {
    it('RemoveEncircleProdcutGroups should return proper state', () => {
      const action = new actions.RemoveEncircleProdcutGroups(savePayload);
      const result: EncircleProductGroupMappingState = EncircleProductGroupMappingReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(true);
      expect(result.hasRemoved).toBe(false);
    });
    it('RemoveEncircleProdcutGroupsSuccess should return proper state', () => {
      const action = new actions.RemoveEncircleProdcutGroupsSuccess();
      const result: EncircleProductGroupMappingState = EncircleProductGroupMappingReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.hasRemoved).toBe(true);
    });
    it('RemoveEncircleProdcutGroupsFailure should return error', () => {
      const action = new actions.RemoveEncircleProdcutGroupsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: EncircleProductGroupMappingState = EncircleProductGroupMappingReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
      expect(result.hasRemoved).toEqual(false);
    });
  });
  describe('SearchProductGroupCode should return proper state', () => {
    it('SearchProductGroupCode should return proper state', () => {
      const action = new actions.SearchProductGroupCode('71');
      const result: EncircleProductGroupMappingState = EncircleProductGroupMappingReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(true);
    });
    it('SearchProductGroupCodeSuccess should return proper state', () => {
      const action = new actions.SearchProductGroupCodeSuccess(
        selectedProductGroupsResponse
      );
      const result: EncircleProductGroupMappingState = EncircleProductGroupMappingReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.selectedProductGroups).toBe(
        selectedProductGroupsResponse.response
      );
      expect(result.totalElements).toBe(
        selectedProductGroupsResponse.totalElements
      );
    });
    it('SearchProductGroupCodeFailure should return error', () => {
      const action = new actions.SearchProductGroupCodeFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: EncircleProductGroupMappingState = EncircleProductGroupMappingReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
    });
  });
  describe('LoadProductGroups Test Cases', () => {
    it('LoadProductGroups should return proper state', () => {
      const action = new actions.LoadProductGroups();
      const result: EncircleProductGroupMappingState = EncircleProductGroupMappingReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(true);
    });
    it('LoadProductGroupsSuccess should return proper state', () => {
      const action = new actions.LoadProductGroupsSuccess(productGroups);
      const result: EncircleProductGroupMappingState = EncircleProductGroupMappingReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.productGroups).toBe(productGroups);
    });
    it('LoadProductGroupsFailure should return error', () => {
      const action = new actions.SearchProductGroupCodeFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: EncircleProductGroupMappingState = EncircleProductGroupMappingReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
    });
  });
});
