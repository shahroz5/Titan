import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { CustomErrors, ProductGroup } from '@poss-web/shared/models';
import {
  LoadReset,
  LoadProductGroupMappingSuccess,
  LoadProductGroupMappingFailure,
  LoadProductGroupMapping,
  ProductGroupMappingActionTypes
} from './product-group-mapping.actions';
describe('ProductGroupActions  Action Testing Suite', () => {
  describe('LoadProductGroupMapping Action Test Cases', () => {
    it('should check correct type is used for  LoadProductGroupMapping action ', () => {
      const payload = '';

      const action = new LoadProductGroupMapping(payload);
      expect({ ...action }).toEqual({
        type: ProductGroupMappingActionTypes.LOAD_PRODUCT_GROUPS,
        payload
      });
    });
    it('should check correct type is used for  LoadProductGroupMappingSuccess action ', () => {
      const payload: ProductGroup[] = [
        {
          description: 'GOLD COIN',
          productGroupCode: '71'
        }
      ];

      const action = new LoadProductGroupMappingSuccess(payload);

      expect({ ...action }).toEqual({
        type: ProductGroupMappingActionTypes.LOAD_PRODUCT_GROUPS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadProductGroupMappingFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadProductGroupMappingFailure(payload);

      expect({ ...action }).toEqual({
        type: ProductGroupMappingActionTypes.LOAD_PRODUCT_GROUPS_FAILURE,
        payload
      });
    });
  });

  describe('LoadReset Action Test Cases', () => {
    it('should check correct type is used for  LoadReset action ', () => {
      const action = new LoadReset();
      expect({ ...action }).toEqual({
        type: ProductGroupMappingActionTypes.LOAD_RESET
      });
    });
  });
});
