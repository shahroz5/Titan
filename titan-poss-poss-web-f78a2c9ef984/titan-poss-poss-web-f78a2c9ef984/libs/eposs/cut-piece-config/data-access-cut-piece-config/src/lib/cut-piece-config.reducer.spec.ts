import { CutPieceConfigState } from './cut-piece-config.state';
import * as actions from './cut-piece-config.actions';
import { CutPieceConfigReducer } from './cut-piece-config.reducer';
import {
  ProductCategoryMapping,
  ProductCategoryMappingList
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
describe('CutPieceConfig Reducer Testing Suite', () => {
  const initialState: CutPieceConfigState = {
    error: null,
    isLoading: false,
    configId: null,
    hasSaved: false,
    cutPieceConfigList: [],
    totalElements: 0,
    productCategories: [],
    allSelectedCategories: null
  };
  const searchResponse: ProductCategoryMappingList[] = [
    {
      cutPieceTepPercent: 12,
      productCategoryCode: 'A',
      id: 'abc123',
      description: 'abc123'
    }
  ];
  const savePayload: ProductCategoryMapping = {
    payload: {
      addProductCategories: ['I'],
      updateProductCategories: [],
      removeProductCategories: []
    },
    configId: 'abc123'
  };
  const listPaload = { configId: 'abc123', pageIndex: 0, pageSize: 20 };
  const productCategories = [
    {
      productCategoryCode: 'I',
      description: 'Product Category',
      isActive: true
    }
  ];
  describe('Testing LoadCutPieceConfigs', () => {
    it('LoadCutPieceConfigs should return proper state', () => {
      const action = new actions.LoadCutPieceConfigs();

      const result: CutPieceConfigState = CutPieceConfigReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
    });
    it('LoadCutPieceConfigsSuccess should return success response', () => {
      const action = new actions.LoadCutPieceConfigsSuccess('abc123');

      const result: CutPieceConfigState = CutPieceConfigReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.configId).toBe('abc123');
    });
    it('LoadCutPieceConfigsFailure should return error', () => {
      const action = new actions.LoadCutPieceConfigsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: CutPieceConfigState = CutPieceConfigReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
    });
  });

  describe('Testing SearchProductCategoryCode', () => {
    it('SearchProductCategoryCode should return proper state', () => {
      const action = new actions.SearchProductCategoryCode({
        productCategoryCode: 'abc123',
        configId: 'abc123'
      });

      const result: CutPieceConfigState = CutPieceConfigReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
    });
    it('SearchProductCategroyCodeSuccess should return success response', () => {
      const action = new actions.SearchProductCategroyCodeSuccess(
        searchResponse
      );

      const result: CutPieceConfigState = CutPieceConfigReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.cutPieceConfigList).toBe(searchResponse);
    });
    it('SearchProductCategoryCodeFailure should return error', () => {
      const action = new actions.SearchProductCategoryCodeFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: CutPieceConfigState = CutPieceConfigReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
    });
  });

  describe('Testing SaveCutPieceConfig', () => {
    it('SaveCutPieceConfig should return proper state', () => {
      const action = new actions.SaveCutPieceConfig(savePayload);

      const result: CutPieceConfigState = CutPieceConfigReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
      expect(result.hasSaved).toBe(false);
    });
    it('SaveCutPieceConfigSuccess should return success response', () => {
      const action = new actions.SaveCutPieceConfigSuccess();

      const result: CutPieceConfigState = CutPieceConfigReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.hasSaved).toBe(true);
    });
    it('SaveCutPieceConfigFailure should return error', () => {
      const action = new actions.SaveCutPieceConfigFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: CutPieceConfigState = CutPieceConfigReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
    });
  });

  describe('Testing LoadProductCategoryMapping', () => {
    it('LoadProductCategoryMapping should return proper state', () => {
      const action = new actions.LoadProductCategoryMapping(listPaload);

      const result: CutPieceConfigState = CutPieceConfigReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
    });
    it('LoadProductCategoryMappingSuccess should return success response', () => {
      const action = new actions.LoadProductCategoryMappingSuccess({
        response: searchResponse,
        totalElements: 1
      });

      const result: CutPieceConfigState = CutPieceConfigReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.cutPieceConfigList).toBe(searchResponse);
      expect(result.totalElements).toBe(1);
    });
    it('LoadProductCategoryMappingFailure should return error', () => {
      const action = new actions.LoadProductCategoryMappingFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: CutPieceConfigState = CutPieceConfigReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
    });
  });

  describe('Testing LoadProductCategories', () => {
    it('LoadProductCategories should return proper state', () => {
      const action = new actions.LoadProductCategories();

      const result: CutPieceConfigState = CutPieceConfigReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
    });
    it('LoadProductCategoriesSuccess should return success response', () => {
      const action = new actions.LoadProductCategoriesSuccess(
        productCategories
      );

      const result: CutPieceConfigState = CutPieceConfigReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.productCategories).toBe(productCategories);
    });
    it('LoadProductCategoriesFailure should return error', () => {
      const action = new actions.LoadProductCategoriesFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: CutPieceConfigState = CutPieceConfigReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
    });

    it('ResetCutPieceConfig should return success response', () => {
      const action = new actions.ResetCutPieceConfig();

      const result: CutPieceConfigState = CutPieceConfigReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.productCategories.length).toBe(0);
      expect(result.configId).toBe(null);
      expect(result.hasSaved).toBe(false);
      expect(result.totalElements).toBe(0);
      expect(result.cutPieceConfigList.length).toBe(0);
    });
  });
});
