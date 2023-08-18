import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { CustomErrors, ProductCategory } from '@poss-web/shared/models';
import {
  LoadReset,
  ProductCategoryMappingActionTypes,
  LoadProductCategory,
  LoadProductCategorySuccess,
  LoadProductCategoryFailure
} from './pc-mapping.actions';
describe('ProductCategoryMappingActions  Action Testing Suite', () => {
  describe('LoadProductCategory Action Test Cases', () => {
    it('should check correct type is used for  LoadProductCategory action ', () => {
      const action = new LoadProductCategory();
      expect({ ...action }).toEqual({
        type: ProductCategoryMappingActionTypes.LOAD_PRODUCT_CATEGORIES
      });
    });
    it('should check correct type is used for  LoadProductGroupMappingSuccess action ', () => {
      const payload: ProductCategory[] = [
        {
          description: 'GOLD COIN',
          productCategoryCode: '71'
        }
      ];

      const action = new LoadProductCategorySuccess(payload);

      expect({ ...action }).toEqual({
        type: ProductCategoryMappingActionTypes.LOAD_PRODUCT_CATEGORIES_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadProductGroupMappingFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadProductCategoryFailure(payload);

      expect({ ...action }).toEqual({
        type: ProductCategoryMappingActionTypes.LOAD_PRODUCT_CATEGORIES_FAILURE,
        payload
      });
    });
  });

  describe('LoadReset Action Test Cases', () => {
    it('should check correct type is used for  LoadReset action ', () => {
      const action = new LoadReset();
      expect({ ...action }).toEqual({
        type: ProductCategoryMappingActionTypes.LOAD_RESET
      });
    });
  });
});
