import { CFAProductCodeState } from './cfa-product-code.state';
import { CFAProductCodeFacade } from './cfa-product-code.facade';
import { TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import {
  CFAProducts,
  LoadCFAProductCodeListingPayload,
  UpdateCFAProductsPayload
} from '@poss-web/shared/models';
import {
  LoadCFAProducts,
  LoadCFAProductsBasedOnProductGroupCode,
  SearchCFAproduct,
  ResetCFAProducts,
  UpdateCFAProducts,
  LoadProductTypes,
  SaveCFAProducts,
  LoadItemTypes
} from './cfa-product-code.actions';
import { Store } from '@ngrx/store';

describe('CFA Product Code Facade Testing', () => {
  const initialState: CFAProductCodeState = {
    error: null,
    CFAProductCodeListing: null,
    totalElements: null,
    CFAProduct: null,
    isLoading: null,
    hasSaved: null,
    hasUpdated: null,
    productType: null,
    itemTypes: null,
    plainStuddedType: null,
    pricingType: null
  };
  let cfaProductCodeFacade: CFAProductCodeFacade;
  let store: Store;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), CFAProductCodeFacade]
    });
    cfaProductCodeFacade = TestBed.inject(CFAProductCodeFacade);
    store = TestBed.inject(Store);
  });
  describe('Dispatch Actions action', () => {
    it('should call LOAD_CFA_PRODUCTS', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: LoadCFAProductCodeListingPayload = {
        pageIndex: 0,
        pageSize: 100
      };
      const action = new LoadCFAProducts(payload);
      cfaProductCodeFacade.loadCFAProductCodeListing(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call LOAD_CFA_PRODUCTS_BASED_ON_PRODUCTGROUPCODE', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new LoadCFAProductsBasedOnProductGroupCode('PRO123');
      cfaProductCodeFacade.loadCFAProductCode('PRO123');
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call SEARCH_CFA_PRODUCT', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new SearchCFAproduct('PRO123');
      cfaProductCodeFacade.searchCFAProdcut('PRO123');
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call RESET_CFA_PRODUCTS', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new ResetCFAProducts();
      cfaProductCodeFacade.resetCFAProducts();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call UPDATE_CFA_PRODUCTS', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: UpdateCFAProductsPayload = {
        productGroupCode: 'PRO123',
        data: {}
      };
      const action = new UpdateCFAProducts(payload);
      cfaProductCodeFacade.updateCFAProducts(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call LOAD_PRODUCT_TYPES', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new LoadProductTypes();
      cfaProductCodeFacade.loadProdcutTypes();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call LOAD_MATERIAL_TYPES', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new LoadItemTypes();
      cfaProductCodeFacade.loadItemTypes();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call SAVE_CFA_PRODUCTS', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: CFAProducts = {
        productGroupCode: 'Pro123',
        productType: 'Metal',
        description: 'Product Group Code is Pro123',
        itemTypeCode: 'material',
        orgCode: null,
        isActive: true,
        configDetails: {}
      };
      const action = new SaveCFAProducts(payload);
      cfaProductCodeFacade.saveCFAProducts(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
  });

  describe('Access Selector action', () => {
    it('should access the get cfaProductCode listing', () => {
      expect(cfaProductCodeFacade.getCFAProductCodeListing()).toEqual(
        cfaProductCodeFacade['CFAProductCodeListing$']
      );
    });
    it('should access the get total count', () => {
      expect(cfaProductCodeFacade.getTotalElements()).toEqual(
        cfaProductCodeFacade['totalElements$']
      );
    });
    it('should access the get cfaProductcode based on product group', () => {
      expect(
        cfaProductCodeFacade.getCFAProductCodeBasedOnProductGroup()
      ).toEqual(cfaProductCodeFacade['CFAProductCode$']);
    });
    it('should access the get is loading', () => {
      expect(cfaProductCodeFacade.getIsLoading()).toEqual(
        cfaProductCodeFacade['isLoading$']
      );
    });
    it('should access the get is loading', () => {
      expect(cfaProductCodeFacade.getIsLoading()).toEqual(
        cfaProductCodeFacade['isLoading$']
      );
    });
    it('should access the get has saved', () => {
      expect(cfaProductCodeFacade.getHasSaved()).toEqual(
        cfaProductCodeFacade['hasSaved$']
      );
    });
    it('should access the get has updated', () => {
      expect(cfaProductCodeFacade.getHasUpdated()).toEqual(
        cfaProductCodeFacade['hasUpdated$']
      );
    });
    it('should access the get has error', () => {
      expect(cfaProductCodeFacade.getHasError()).toEqual(
        cfaProductCodeFacade['hasError$']
      );
    });
    it('should access the get product types', () => {
      expect(cfaProductCodeFacade.getProductTypes()).toEqual(
        cfaProductCodeFacade['productTypes$']
      );
    });
    it('should access the get material types', () => {
      expect(cfaProductCodeFacade.getItemTypes()).toEqual(
        cfaProductCodeFacade['itemTypes$']
      );
    });
  });
});
