import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { EncircleProductGroupMappingFacade } from './encircle-product-group-mapping.facade';
import { EncircleProductGroupMappingState } from './encircle-product-group-mapping.state';
import { provideMockStore } from '@ngrx/store/testing';
import {
  LoadAllSelectedProductGroups,
  LoadProductGroups,
  LoadSelectedProductGroups,
  RemoveEncircleProdcutGroups,
  ResetProductGroups,
  SaveEncircleProdcutGroups,
  SearchProductGroupCode
} from './encircle-product-group-mapping.actions';
import { EncircleProductGroupMappingSavePayload } from '@poss-web/shared/models';
describe('EncircleProductGroupMappingFacade Testing Suite', () => {
  const initialState: EncircleProductGroupMappingState = {
    error: null,
    isLoading: null,
    hasSaved: false,
    selectedProductGroups: [],
    hasRemoved: false,
    productGroups: null,
    totalElements: 0,
    allSelectedGroups: null
  };
  const payload = {
    paymentMode: 'Encircle',
    pageIndex: 0,
    pageSize: 10
  };
  const savePayload: EncircleProductGroupMappingSavePayload = {
    savePayload: {
      addProductGroupCode: ['71', '72'],
      removeProductMappingIds: []
    },
    paymentCategoryName: 'Encircle'
  };
  let encircleProductGroupMappingFacade: EncircleProductGroupMappingFacade;
  let store: Store;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({ initialState }),
        EncircleProductGroupMappingFacade
      ]
    });
    encircleProductGroupMappingFacade = TestBed.inject(
      EncircleProductGroupMappingFacade
    );
    store = TestBed.inject(Store);
  });
  describe('Dispatch Actions', () => {
    it('should call LOAD_SELECTED_PRODUCT_GROUPS', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new LoadSelectedProductGroups(payload);
      encircleProductGroupMappingFacade.loadSelectedProductGroups(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call SAVE_ENCIRCLE_PRODUCT_GROUPS', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new SaveEncircleProdcutGroups(savePayload);
      encircleProductGroupMappingFacade.saveProductGroups(savePayload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call REMOVE_ENCIRCLE_PRODUCT_GROUPS', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new RemoveEncircleProdcutGroups(savePayload);
      encircleProductGroupMappingFacade.removeProductGroups(savePayload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call RESET_PRODUCT_GROUPS', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new ResetProductGroups();
      encircleProductGroupMappingFacade.resetProductGroups();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call LOAD_PRODUCT_GROUPS', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new LoadProductGroups();
      encircleProductGroupMappingFacade.loadProductGroups();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call SEARCH_PRODUCT_GROUP_CODE', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new SearchProductGroupCode('71');
      encircleProductGroupMappingFacade.searchProductGroupCode('71');
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call LOAD_ALL_SELECTED_PRODUCT_GROUPS', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new LoadAllSelectedProductGroups(payload);
      encircleProductGroupMappingFacade.loadAllSelectedProductGroups(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
  });
  describe('Access Selectors', () => {
    it('should access the error', () => {
      expect(encircleProductGroupMappingFacade.getError()).toEqual(
        encircleProductGroupMappingFacade['selectError$']
      );
    });
    it('should access the isloading', () => {
      expect(encircleProductGroupMappingFacade.getIsLoading()).toEqual(
        encircleProductGroupMappingFacade['selectIsLoading$']
      );
    });
    it('should access the selected product groups', () => {
      expect(
        encircleProductGroupMappingFacade.getSelectedProductGroups()
      ).toEqual(
        encircleProductGroupMappingFacade['selectSelectedProductGroups']
      );
    });
    it('should access the hassaved', () => {
      expect(encircleProductGroupMappingFacade.getHasSaved()).toEqual(
        encircleProductGroupMappingFacade['selectHasSaved$']
      );
    });
    it('should access the hasremoved', () => {
      expect(encircleProductGroupMappingFacade.getHasRemoved()).toEqual(
        encircleProductGroupMappingFacade['selectHasRemoved$']
      );
    });
    it('should access the productgroups', () => {
      expect(encircleProductGroupMappingFacade.getProductGroups()).toEqual(
        encircleProductGroupMappingFacade['selectProductGroups$']
      );
    });
    it('should access the total elements', () => {
      expect(encircleProductGroupMappingFacade.getTotalElements()).toEqual(
        encircleProductGroupMappingFacade['selectTotalElements$']
      );
    });
    it('should access the all selected product groups', () => {
      expect(
        encircleProductGroupMappingFacade.getAllSelectedProductGroups()
      ).toEqual(
        encircleProductGroupMappingFacade['selectAllSelectedProductGroups$']
      );
    });
  });
});
