//you should simply assert that you get the right state given the provided inputs.

import * as actions from './pc-mapping.actions';
import { ProductCategory } from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  ProductCategoryMappingReducer,
  initialState
} from './pc-mapping.reducer';
import { ProductCategoryMappingState } from './pc-mapping.state';

describe('ProductCategoryMappingReducer reducer Testing Suite', () => {
  const testState = initialState;

  describe('Testing LoadProductGroupMapping ', () => {
    beforeEach(() => {});
    it('Load LoadProductGroupMapping should set the isLoading to true', () => {
      const action = new actions.LoadProductCategory();

      const result: ProductCategoryMappingState = ProductCategoryMappingReducer(
        testState,
        action
      );

      expect(result.isLoading).toBe(true);
    });
    it('LoadProductCategorySuccess should return list Product Groups', () => {
      const payload: ProductCategory[] = [
        {
          description: 'GOLD COIN',
          productCategoryCode: '71'
        }
      ];
      const action = new actions.LoadProductCategorySuccess(payload);

      const result: ProductCategoryMappingState = ProductCategoryMappingReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.productCategory.length).toBe(1);
    });
    it('LoadProductCategoryFailure should return error', () => {
      const action = new actions.LoadProductCategoryFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: ProductCategoryMappingState = ProductCategoryMappingReducer(
        testState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadReset Functionality ', () => {
    beforeEach(() => {});
    it('LoadReset should reset the state', () => {
      const action = new actions.LoadReset();

      const result: ProductCategoryMappingState = ProductCategoryMappingReducer(
        initialState,
        action
      );

      expect(result).toEqual(initialState);
    });
  });
});
