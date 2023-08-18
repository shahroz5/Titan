// you will need to assert that the store is calling the right selector function.

import { CustomErrors, ProductGroup } from '@poss-web/shared/models';
import { initialState } from './product-group-mapping.reducer';
import * as selectors from './product-group-mapping.selector';
import { ProductGroupMappingState } from './product-group-mapping.state';

describe('ProductGroupMappingState selector Testing Suite', () => {
  const error: CustomErrors = {
    error: null,
    code: '',
    message: '',
    traceId: '',
    timeStamp: ''
  };

  describe('Testing ProductGroupMappingState related Selectors', () => {
    it('selectProductGroups Should return the product group list', () => {
      const productGroup: ProductGroup[] = [
        {
          description: 'GOLD COIN',
          productGroupCode: '71'
        }
      ];

      const state: ProductGroupMappingState = {
        ...initialState,
        productGroups: productGroup
      };
      expect(
        selectors.ProductGroupMappingSelectors.selectProductGroups.projector(
          state
        )
      ).toEqual(productGroup);
    });

    it('selectIsloading Should return the true or false', () => {
      const state: ProductGroupMappingState = {
        ...initialState,
        isLoading: true
      };
      expect(
        selectors.ProductGroupMappingSelectors.selectIsloading.projector(state)
      ).toEqual(true);
    });
    it('selectError Should return the error object', () => {
      const state: ProductGroupMappingState = {
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
        selectors.ProductGroupMappingSelectors.selectError.projector(state)
      ).toEqual(error);
    });
  });
});
