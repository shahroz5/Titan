//you should simply assert that you get the right state given the provided inputs.

import * as actions from './product-group-mapping.actions';
import { ProductGroup } from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  ProductGroupMappingReducer,
  initialState
} from './product-group-mapping.reducer';
import { ProductGroupMappingState } from './product-group-mapping.state';

describe('ProductGroupMappingReducer reducer Testing Suite', () => {
  const testState = initialState;

  describe('Testing LoadProductGroupMapping ', () => {
    beforeEach(() => {});
    it('Load LoadProductGroupMapping should set the isLoading to true', () => {
      const payload = '';

      const action = new actions.LoadProductGroupMapping(payload);

      const result: ProductGroupMappingState = ProductGroupMappingReducer(
        testState,
        action
      );

      expect(result.isLoading).toBe(true);
    });
    it('LoadProductGroupMappingSuccess should return list Product Groups', () => {
      const payload: ProductGroup[] = [
        {
          description: 'GOLD COIN',
          productGroupCode: '71'
        }
      ];
      const action = new actions.LoadProductGroupMappingSuccess(payload);

      const result: ProductGroupMappingState = ProductGroupMappingReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.productGroups.length).toBe(1);
    });
    it('LoadProductGroupMappingFailure should return error', () => {
      const action = new actions.LoadProductGroupMappingFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: ProductGroupMappingState = ProductGroupMappingReducer(
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

      const result: ProductGroupMappingState = ProductGroupMappingReducer(
        initialState,
        action
      );

      expect(result).toEqual(initialState);
    });
  });
});
