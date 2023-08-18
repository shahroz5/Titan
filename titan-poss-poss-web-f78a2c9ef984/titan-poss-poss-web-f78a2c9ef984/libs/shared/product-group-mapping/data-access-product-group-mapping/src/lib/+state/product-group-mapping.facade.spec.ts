import { Store } from '@ngrx/store';
import { TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { ProductGroupMappingFacade } from './product-group-mapping.facade';
import { ProductGroupMappingState } from './product-group-mapping.state';
import {
  LoadProductGroupMapping,
  LoadReset
} from './product-group-mapping.actions';

describe(' productGroupMappingFacade Testing Suite', () => {
  const initialState: ProductGroupMappingState = {
    productGroups: [],
    error: null,
    isLoading: null
  };

  let productGroupMappingFacade: ProductGroupMappingFacade;
  let store: MockStore<ProductGroupMappingFacade>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), ProductGroupMappingFacade]
    });
    store = TestBed.inject<any>(Store);
    productGroupMappingFacade = TestBed.inject<any>(ProductGroupMappingFacade);
  });

  describe('Dispatch Actions action', () => {
    it('should call LOAD_PRODUCT_GROUPS action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload = undefined;
      const action = new LoadProductGroupMapping(payload);
      productGroupMappingFacade.loadProductGroups();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LOAD_RESET action', () => {
      spyOn(store, 'dispatch').and.returnValue({});

      const action = new LoadReset();
      productGroupMappingFacade.loadReset();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
  });

  describe('Access Selector action', () => {
    it('should access the getIsloading selector action', () => {
      expect(productGroupMappingFacade.getIsloading()).toEqual(
        productGroupMappingFacade['isLoading$']
      );
    });

    it('should access the getProductGroups selector action', () => {
      expect(productGroupMappingFacade.getProductGroups()).toEqual(
        productGroupMappingFacade['productGroups$']
      );
    });

    it('should access the getError selector action', () => {
      expect(productGroupMappingFacade.getError()).toEqual(
        productGroupMappingFacade['error$']
      );
    });
  });
});
