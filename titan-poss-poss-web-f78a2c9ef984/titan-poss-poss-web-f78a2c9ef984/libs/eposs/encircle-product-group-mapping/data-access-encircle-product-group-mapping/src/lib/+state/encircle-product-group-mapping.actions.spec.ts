import {
  CustomErrors,
  EncircleProductGroupMappingSavePayload,
  ProductGroup,
  ProductGroupMappingOption,
  ProductGroupMappingResponse
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  EncircleProductGroupMappingActionTypes,
  LoadAllSelectedProductGroups,
  LoadAllSelectedProductGroupsFailure,
  LoadAllSelectedProductGroupsSuccess,
  LoadProductGroups,
  LoadProductGroupsFailure,
  LoadProductGroupsSuccess,
  LoadSelectedProductGroups,
  LoadSelectedProductGroupsFailure,
  LoadSelectedProductGroupsSuccess,
  RemoveEncircleProdcutGroups,
  RemoveEncircleProdcutGroupsFailure,
  RemoveEncircleProdcutGroupsSuccess,
  ResetProductGroups,
  SaveEncircleProdcutGroups,
  SaveEncircleProdcutGroupsFailure,
  SaveEncircleProdcutGroupsSuccess,
  SearchProductGroupCode,
  SearchProductGroupCodeFailure,
  SearchProductGroupCodeSuccess
} from './encircle-product-group-mapping.actions';

describe('EncricleProductGroupMapping Actions Test Cases', () => {
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
  describe('SaveEncircleProdcutGroups Test Cases', () => {
    it('should check correct type is used for SaveEncircleProdcutGroups action ', () => {
      const action = new SaveEncircleProdcutGroups(savePayload);

      expect(action.type).toEqual(
        EncircleProductGroupMappingActionTypes.SAVE_ENCIRCLE_PRODUCT_GROUPS
      );
      expect(action.payload).toEqual(savePayload);
    });
    it('should check correct type is used for SaveEncircleProdcutGroupsSuccess action ', () => {
      const action = new SaveEncircleProdcutGroupsSuccess();

      expect(action.type).toEqual(
        EncircleProductGroupMappingActionTypes.SAVE_ENCIRCLE_PRODUCT_GROUPS_SUCCESS
      );
    });
    it('should check correct type is used for SaveEncircleProdcutGroupsFailure action ', () => {
      const errorPayload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SaveEncircleProdcutGroupsFailure(errorPayload);

      expect(action.type).toEqual(
        EncircleProductGroupMappingActionTypes.SAVE_ENCIRCLE_PRODUCT_GROUPS_FAILURE
      );
      expect(action.payload).toEqual(errorPayload);
    });
  });
  describe('LoadSelectedProductGroups Test Cases', () => {
    it('should check correct type is used for LoadSelectedProductGroups action ', () => {
      const action = new LoadSelectedProductGroups(payload);

      expect(action.type).toEqual(
        EncircleProductGroupMappingActionTypes.LOAD_SELECTED_PRODUCT_GROUPS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for LoadSelectedProductGroupsSuccess action ', () => {
      const action = new LoadSelectedProductGroupsSuccess(
        selectedProductGroupsResponse
      );

      expect(action.type).toEqual(
        EncircleProductGroupMappingActionTypes.LOAD_SELECTED_PRODUCT_GROUPS_SUCCESS
      );
      expect(action.payload).toEqual(selectedProductGroupsResponse);
    });
    it('should check correct type is used for LoadSelectedProductGroupsFailure action ', () => {
      const errorPayload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadSelectedProductGroupsFailure(errorPayload);

      expect(action.type).toEqual(
        EncircleProductGroupMappingActionTypes.LOAD_SELECTED_PRODUCT_GROUPS_FAILURE
      );
      expect(action.payload).toEqual(errorPayload);
    });
  });
  describe('LoadAllSelectedProductGroups Test Cases', () => {
    it('should check correct type is used for LoadAllSelectedProductGroups action ', () => {
      const action = new LoadAllSelectedProductGroups(payload);

      expect(action.type).toEqual(
        EncircleProductGroupMappingActionTypes.LOAD_ALL_SELECTED_PRODUCT_GROUPS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for LoadAllSelectedProductGroupsSuccess action ', () => {
      const action = new LoadAllSelectedProductGroupsSuccess(
        selectedProductGroupsResponse
      );

      expect(action.type).toEqual(
        EncircleProductGroupMappingActionTypes.LOAD_ALL_SELECTED_PRODUCT_GROUPS_SUCCESS
      );
      expect(action.payload).toEqual(selectedProductGroupsResponse);
    });
    it('should check correct type is used for LoadAllSelectedProductGroupsFailure action ', () => {
      const errorPayload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadAllSelectedProductGroupsFailure(errorPayload);

      expect(action.type).toEqual(
        EncircleProductGroupMappingActionTypes.LOAD_ALL_SELECTED_PRODUCT_GROUPS_FAILURE
      );
      expect(action.payload).toEqual(errorPayload);
    });
  });
  describe('ResetProductGroups Test Cases', () => {
    it('should check correct type is used for ResetProductGroups action ', () => {
      const action = new ResetProductGroups();

      expect(action.type).toEqual(
        EncircleProductGroupMappingActionTypes.RESET_PRODUCT_GROUPS
      );
    });
  });
  describe('RemoveEncircleProdcutGroups Test Cases', () => {
    it('should check correct type is used for RemoveEncircleProdcutGroups action ', () => {
      const action = new RemoveEncircleProdcutGroups(savePayload);

      expect(action.type).toEqual(
        EncircleProductGroupMappingActionTypes.REMOVE_ENCIRCLE_PRODUCT_GROUPS
      );
      expect(action.payload).toEqual(savePayload);
    });
    it('should check correct type is used for RemoveEncircleProdcutGroupsSuccess action ', () => {
      const action = new RemoveEncircleProdcutGroupsSuccess();

      expect(action.type).toEqual(
        EncircleProductGroupMappingActionTypes.REMOVE_ENCIRCLE_PRODUCT_GROUPS_SUCCESS
      );
    });
    it('should check correct type is used for RemoveEncircleProdcutGroupsFailure action ', () => {
      const errorPayload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new RemoveEncircleProdcutGroupsFailure(errorPayload);

      expect(action.type).toEqual(
        EncircleProductGroupMappingActionTypes.REMOVE_ENCIRCLE_PRODUCT_GROUPS_FAILURE
      );
      expect(action.payload).toEqual(errorPayload);
    });
  });
  describe('LoadProductGroups Test Cases', () => {
    it('should check correct type is used for LoadProductGroups action ', () => {
      const action = new LoadProductGroups();

      expect(action.type).toEqual(
        EncircleProductGroupMappingActionTypes.LOAD_PRODUCT_GROUPS
      );
    });
    it('should check correct type is used for LoadProductGroupsSuccess action ', () => {
      const action = new LoadProductGroupsSuccess(productGroups);

      expect(action.type).toEqual(
        EncircleProductGroupMappingActionTypes.LOAD_PRODUCT_GROUPS_SUCCESS
      );
      expect(action.payload).toEqual(productGroups);
    });
    it('should check correct type is used for LoadProductGroupsFailure action ', () => {
      const errorPayload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadProductGroupsFailure(errorPayload);

      expect(action.type).toEqual(
        EncircleProductGroupMappingActionTypes.LOAD_PRODUCT_GROUPS_FAILURE
      );
      expect(action.payload).toEqual(errorPayload);
    });
  });
  describe('SearchProductGroupCode Test Cases', () => {
    it('should check correct type is used for SearchProductGroupCode action ', () => {
      const action = new SearchProductGroupCode('71');

      expect(action.type).toEqual(
        EncircleProductGroupMappingActionTypes.SEARCH_PRODUCT_GROUP_CODE
      );
    });
    it('should check correct type is used for SearchProductGroupCodeSuccess action ', () => {
      const action = new SearchProductGroupCodeSuccess(
        selectedProductGroupsResponse
      );

      expect(action.type).toEqual(
        EncircleProductGroupMappingActionTypes.SEARCH_PRODUCT_GROUP_CODE_SUCCESS
      );
      expect(action.payload).toEqual(selectedProductGroupsResponse);
    });
    it('should check correct type is used for SearchProductGroupCodeFailure action ', () => {
      const errorPayload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SearchProductGroupCodeFailure(errorPayload);

      expect(action.type).toEqual(
        EncircleProductGroupMappingActionTypes.SEARCH_PRODUCT_GROUP_CODE_FAILURE
      );
      expect(action.payload).toEqual(errorPayload);
    });
  });
});
