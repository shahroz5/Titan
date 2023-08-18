import { Store } from '@ngrx/store';
import { TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { ProductCategoryMappingFacade } from './pc-mapping.facade';
import { ProductCategoryMappingState } from './pc-mapping.state';
import { LoadProductCategory, LoadReset } from './pc-mapping.actions';

describe(' ProductCategoryMappingFacade Testing Suite', () => {
  const initialState: ProductCategoryMappingState = {
    productCategory: [],
    error: null,
    isLoading: null
  };

  let productCategoryMappingFacade: ProductCategoryMappingFacade;
  let store: MockStore<ProductCategoryMappingFacade>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({ initialState }),
        ProductCategoryMappingFacade
      ]
    });
    store = TestBed.inject<any>(Store);
    productCategoryMappingFacade = TestBed.inject<any>(
      ProductCategoryMappingFacade
    );
  });

  describe('Dispatch Actions action', () => {
    it('should call LOAD_PRODUCT_CATEGORIES action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new LoadProductCategory();
      productCategoryMappingFacade.loadProductCategory();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LOAD_RESET action', () => {
      spyOn(store, 'dispatch').and.returnValue({});

      const action = new LoadReset();
      productCategoryMappingFacade.loadReset();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
  });

  describe('Access Selector action', () => {
    it('should access the getIsloading selector action', () => {
      expect(productCategoryMappingFacade.getIsloading()).toEqual(
        productCategoryMappingFacade['isLoading$']
      );
    });

    it('should access the getProductCategory selector action', () => {
      expect(productCategoryMappingFacade.getProductCategory()).toEqual(
        productCategoryMappingFacade['productCategory$']
      );
    });

    it('should access the getError selector action', () => {
      expect(productCategoryMappingFacade.getError()).toEqual(
        productCategoryMappingFacade['error$']
      );
    });
  });
});
