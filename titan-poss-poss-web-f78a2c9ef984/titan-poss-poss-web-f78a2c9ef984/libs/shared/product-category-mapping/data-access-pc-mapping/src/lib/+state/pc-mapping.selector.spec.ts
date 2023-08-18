// you will need to assert that the store is calling the right selector function.

import { CustomErrors, ProductCategory } from '@poss-web/shared/models';
import { initialState } from './pc-mapping.reducer';
import * as selectors from './pc-mapping.selector';
import { ProductCategoryMappingState } from './pc-mapping.state';

describe('ProductCategoryMappingState selector Testing Suite', () => {
  const error: CustomErrors = {
    error: null,
    code: '',
    message: '',
    traceId: '',
    timeStamp: ''
  };

  describe('Testing ProductCategoryMappingState related Selectors', () => {
    it('selectProductGroups Should return the product group list', () => {
      const productCategory: ProductCategory[] = [
        {
          description: 'GOLD COIN',
          productCategoryCode: '71'
        }
      ];

      const state: ProductCategoryMappingState = {
        ...initialState,
        productCategory: productCategory
      };
      expect(
        selectors.ProductCategoryMappingSelectors.selectProductCategory.projector(
          state
        )
      ).toEqual(productCategory);
    });

    it('selectIsloading Should return the true or false', () => {
      const state: ProductCategoryMappingState = {
        ...initialState,
        isLoading: true
      };
      expect(
        selectors.ProductCategoryMappingSelectors.selectIsloading.projector(
          state
        )
      ).toEqual(true);
    });
    it('selectError Should return the error object', () => {
      const state: ProductCategoryMappingState = {
        ...initialState,
        error: {
          error: null,
          timeStamp: '',
          traceId: '',
          code: '',
          message: ''
        }
      };
      expect(
        selectors.ProductCategoryMappingSelectors.selectError.projector(state)
      ).toEqual(error);
    });
  });
});
