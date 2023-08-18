import {
  CustomErrors,
  ProductCategoryMapping,
  ProductCategoryMappingList
} from '@poss-web/shared/models';
import {
  CutPieceConfigActionTypes,
  LoadCutPieceConfigs,
  LoadCutPieceConfigsFailure,
  LoadCutPieceConfigsSuccess,
  LoadProductCategories,
  LoadProductCategoriesFailure,
  LoadProductCategoriesSuccess,
  LoadProductCategoryMapping,
  LoadProductCategoryMappingFailure,
  LoadProductCategoryMappingSuccess,
  ResetCutPieceConfig,
  SaveCutPieceConfig,
  SaveCutPieceConfigFailure,
  SaveCutPieceConfigSuccess,
  SearchProductCategoryCode,
  SearchProductCategoryCodeFailure,
  SearchProductCategroyCodeSuccess
} from './cut-piece-config.actions';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';

describe('CutPieceConfig Testing Suite', () => {
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
  describe('LoadCutPieceConfigs Action Test Cases', () => {
    it('should check correct type is used for  LoadCutPieceConfigs action ', () => {
      const action = new LoadCutPieceConfigs();

      expect(action.type).toEqual(
        CutPieceConfigActionTypes.LOAD_CUT_PIECE_CONFIGS
      );
      //expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  LoadCutPieceConfigsSuccess action ', () => {
      const action = new LoadCutPieceConfigsSuccess('abc123');

      expect(action.type).toEqual(
        CutPieceConfigActionTypes.LOAD_CUT_PIECE_CONFIGS_SUCCESS
      );
      expect(action.payload).toEqual('abc123');
    });
    it('should check correct type is used for  LoadCutPieceConfigsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadCutPieceConfigsFailure(payload);

      expect(action.type).toEqual(
        CutPieceConfigActionTypes.LOAD_CUT_PIECE_CONFIGS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('SearchProductCategoryCode Action Test Cases', () => {
    it('should check correct type is used for SearchProductCategoryCode action ', () => {
      const action = new SearchProductCategoryCode({
        productCategoryCode: 'abc123',
        configId: 'abc123'
      });

      expect(action.type).toEqual(
        CutPieceConfigActionTypes.SEARCH_PRODUCT_CATEGORY_CODE
      );
      expect(action.payload).toEqual({
        productCategoryCode: 'abc123',
        configId: 'abc123'
      });
    });
    it('should check correct type is used for SearchProductCategoryCodeSuccess action ', () => {
      const action = new SearchProductCategroyCodeSuccess(searchResponse);

      expect(action.type).toEqual(
        CutPieceConfigActionTypes.SEARCH_PRODUCT_CATEGORY_CODE_SUCCESS
      );
      expect(action.payload).toEqual(searchResponse);
    });
    it('should check correct type is used for SearchProductCategoryCodeFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SearchProductCategoryCodeFailure(payload);

      expect(action.type).toEqual(
        CutPieceConfigActionTypes.SEARCH_PRODUCT_CATEGORY_CODE_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('SaveCutPieceConfig Action Test Cases', () => {
    it('should check correct type is used for SaveCutPieceConfig action ', () => {
      const action = new SaveCutPieceConfig(savePayload);

      expect(action.type).toEqual(
        CutPieceConfigActionTypes.SAVE_CUT_PIECE_CONFIG
      );
      expect(action.payload).toEqual(savePayload);
    });
    it('should check correct type is used for SaveCutPieceConfigSuccess action ', () => {
      const action = new SaveCutPieceConfigSuccess();

      expect(action.type).toEqual(
        CutPieceConfigActionTypes.SAVE_CUT_PIECE_CONFIG_SUCCESS
      );
    });
    it('should check correct type is used for SaveCutPieceConfigFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SaveCutPieceConfigFailure(payload);

      expect(action.type).toEqual(
        CutPieceConfigActionTypes.SAVE_CUT_PIECE_CONFIG_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('LoadProductCategoryMapping Action Test Cases', () => {
    it('should check correct type is used for LoadProductCategoryMapping action ', () => {
      const action = new LoadProductCategoryMapping(listPaload);

      expect(action.type).toEqual(
        CutPieceConfigActionTypes.LOAD_PRODUCT_CATEGORIES_MAPPING
      );
      expect(action.payload).toEqual(listPaload);
    });
    it('should check correct type is used for LoadProductCategoryMappingSuccess action ', () => {
      const action = new LoadProductCategoryMappingSuccess({
        response: searchResponse,
        totalElements: 1
      });

      expect(action.type).toEqual(
        CutPieceConfigActionTypes.LOAD_PRODUCT_CATEGORIES_MAPPING_SUCCESS
      );
    });
    it('should check correct type is used for LoadProductCategoryMappingFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadProductCategoryMappingFailure(payload);

      expect(action.type).toEqual(
        CutPieceConfigActionTypes.LOAD_PRODUCT_CATEGORIES_MAPPING_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('LoadProductCategories Action Test Cases', () => {
    const response = [
      {
        productCategoryCode: 'I',
        description: 'Product Category',
        isActive: true
      }
    ];
    it('should check correct type is used for LoadProductCategories action ', () => {
      const action = new LoadProductCategories();

      expect(action.type).toEqual(
        CutPieceConfigActionTypes.LOAD_PRODUCT_CATEGORIES
      );
    });
    it('should check correct type is used for LoadProductCategoriesSuccess action ', () => {
      const action = new LoadProductCategoriesSuccess(response);

      expect(action.type).toEqual(
        CutPieceConfigActionTypes.LOAD_PRODUCT_CATEGORIES_SUCCESS
      );
    });
    it('should check correct type is used for LoadProductCategoriesFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadProductCategoriesFailure(payload);

      expect(action.type).toEqual(
        CutPieceConfigActionTypes.LOAD_PRODUCT_CATEGORIES_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });

    it('should check correct type is used for ResetCutPieceConfig action ', () => {
      const action = new ResetCutPieceConfig();

      expect(action.type).toEqual(
        CutPieceConfigActionTypes.RESET_CUT_PIECE_CONFIG
      );
    });
  });
});
