import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { CutPieceConfigFacade } from './cut-piece-config.facade';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import * as initialState from './cut-piece-config.reducer';
import {
  LoadCutPieceConfigs,
  LoadProductCategories,
  LoadProductCategoryMapping,
  ResetCutPieceConfig,
  SaveCutPieceConfig,
  SearchProductCategoryCode
} from './cut-piece-config.actions';
import { ProductCategoryMapping } from '@poss-web/shared/models';
describe('CutPieceConfiguration Facade Testing Suite', () => {
  let cutPieceConfigFacade: CutPieceConfigFacade;
  let store: Store;
  const payload: ProductCategoryMapping = {
    payload: {
      addProductCategories: ['I', 'A'],
      updateProductCategories: [],
      removeProductCategories: []
    },
    configId: 'abc123'
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), CutPieceConfigFacade]
    });
    cutPieceConfigFacade = TestBed.inject(CutPieceConfigFacade);
    store = TestBed.inject(Store);
  });
  describe('Dispatch Actions action', () => {
    it('should call LOAD_CUT_PIECE_CONFIGS', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new LoadCutPieceConfigs();
      cutPieceConfigFacade.loadCutPieceConfig();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call SAVE_CUT_PIECE_CONFIG', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new SaveCutPieceConfig(payload);
      cutPieceConfigFacade.saveCutPieceConfig(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LOAD_PRODUCT_CATEGORIES_MAPPING', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new LoadProductCategoryMapping({
        configId: 'abc123',
        pageIndex: 0,
        pageSize: 10
      });
      cutPieceConfigFacade.loadProductCategoryMapping({
        configId: 'abc123',
        pageIndex: 0,
        pageSize: 10
      });
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LOAD_PRODUCT_CATEGORIES', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new LoadProductCategories();
      cutPieceConfigFacade.loadProductCategories();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call SEARCH_PRODUCT_CATEGORY_CODE', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new SearchProductCategoryCode({
        productCategoryCode: 'I',
        configId: 'abc123'
      });
      cutPieceConfigFacade.searchProductCategoryCode({
        productCategoryCode: 'I',
        configId: 'abc123'
      });
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call RESET_CUT_PIECE_CONFIG', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new ResetCutPieceConfig();
      cutPieceConfigFacade.resetCutPieceConfig();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
  });

  describe('Access Selectors', () => {
    it('should access the get error', () => {
      expect(cutPieceConfigFacade.getError()).toEqual(
        cutPieceConfigFacade['error$']
      );
    });

    it('should access the get loading', () => {
      expect(cutPieceConfigFacade.getIsLoading()).toEqual(
        cutPieceConfigFacade['isLoading$']
      );
    });

    it('should access the get configId', () => {
      expect(cutPieceConfigFacade.getConfigId()).toEqual(
        cutPieceConfigFacade['configId$']
      );
    });

    it('should access the get hassaved', () => {
      expect(cutPieceConfigFacade.getHasSaved()).toEqual(
        cutPieceConfigFacade['hasSaved$']
      );
    });

    it('should access the get cutPieceConfigList', () => {
      expect(cutPieceConfigFacade.getCutPieceConfigList()).toEqual(
        cutPieceConfigFacade['cutPieceConfigList$']
      );
    });

    it('should access the get totalElements', () => {
      expect(cutPieceConfigFacade.getTotalElements()).toEqual(
        cutPieceConfigFacade['totalElements$']
      );
    });

    it('should access the get productCategories', () => {
      expect(cutPieceConfigFacade.getProductCategories()).toEqual(
        cutPieceConfigFacade['productCategories$']
      );
    });
  });
});
