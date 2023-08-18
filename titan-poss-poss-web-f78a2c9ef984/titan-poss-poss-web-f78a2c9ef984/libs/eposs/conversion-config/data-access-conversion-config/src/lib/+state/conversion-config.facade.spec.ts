import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { ConversionConfigFacade } from './conversion-config.facade';
import { ConversionConfigState } from './conversion-config.state';
import { provideMockStore } from '@ngrx/store/testing';
import {
  ConversionConfigListPayload,
  SaveConversionConfigValuesPayload,
  UpdateStatus,
  UpdateToggleButtonPayload
} from '@poss-web/shared/models';
import {
  ConversionConfigDetailsById,
  LoadConversionConfigList,
  LoadProductCategories,
  LoadProductGroups,
  ResetConversionConfig,
  SaveConversionConfigValues,
  SearchConfigName,
  UpdateConversionConfigDetails,
  UpdateToggleButton
} from './conversion-config.actions';
describe('ConversionConfigFacade Testing Suite', () => {
  const initialState: ConversionConfigState = {
    totalElements: 0,
    isLoading: false,
    conversionConfigList: null,
    error: null,
    hasSaved: false,
    configDetailsById: null,
    hasUpdated: false,
    hasSearched: null,
    productGroups: [],
    productCategories: [],
    saveSuccessPayload: null
  };
  const savePayload: SaveConversionConfigValuesPayload = {
    configId: 1,
    createConfig: {
      description: 'Configuration',
      isActive: true,
      ruleDetails: {}
    },
    configValues: {
      addProducts: [
        {
          productCategoryCode: '71',
          productGroupCode: '72',
          ruleDetails: {
            allowedLimitValue: 123,
            allowedLimitWeight: 13,
            autoApprovalLimitValue: 13,
            autoApprovalLimitWeight: 13
          }
        }
      ],
      removeProducts: [],
      updateProducts: []
    }
  };
  const updateStatusPayload: UpdateToggleButtonPayload = {
    id: 1,
    toggleButton: {
      isActive: true,
      ruleDetails: {}
    }
  };
  let conversionConfigFacade: ConversionConfigFacade;
  let store: Store;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), ConversionConfigFacade]
    });
    conversionConfigFacade = TestBed.inject(ConversionConfigFacade);
    store = TestBed.inject(Store);
  });
  describe('Dispatch Actions TestCases', () => {
    it('should call LOAD_CFA_PRODUCTS', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: ConversionConfigListPayload = {
        pageIndex: 0,
        pageSize: 100,
        length: 0
      };
      const action = new LoadConversionConfigList(payload);
      conversionConfigFacade.loadConversionConfigList(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call CONVERSION_CONFIG_DETAILS_BY_ID', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new ConversionConfigDetailsById(123);
      conversionConfigFacade.loadConversionConfigDetailsById(123);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call RESET_CONVERSION_CONFIG', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new ResetConversionConfig();
      conversionConfigFacade.resetConversionConfig();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call LOAD_PRODUCT_GROUPS', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new LoadProductGroups();
      conversionConfigFacade.loadProductGroups();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call LOAD_PRODUCT_CATEGORIES', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new LoadProductCategories();
      conversionConfigFacade.loadProductCategories();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call SEARCH_BY_CONFIG_NAME', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new SearchConfigName('Configuration');
      conversionConfigFacade.searchByConfigName('Configuration');
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call SAVE_CONVERSION_CONFIG_VALUES', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new SaveConversionConfigValues(savePayload);
      conversionConfigFacade.saveConversionConfigValues(savePayload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call UPDATE_CONVERSION_CONFIG_DETAILS', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new UpdateConversionConfigDetails(savePayload);
      conversionConfigFacade.updateConversionConfigDetails(savePayload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call UPDATE_TOGGLE_BUTTON', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new UpdateToggleButton(updateStatusPayload);
      conversionConfigFacade.updateToggleButton(updateStatusPayload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
  });
  describe('Access Selector TestCases', () => {
    it('should access the conversionConfigList', () => {
      expect(conversionConfigFacade.getConversionConfigList()).toEqual(
        conversionConfigFacade['conversionConfigList$']
      );
    });
    it('should access the totalElements', () => {
      expect(conversionConfigFacade.getTotalElements()).toEqual(
        conversionConfigFacade['totalElements$']
      );
    });
    it('should access the isLoading', () => {
      expect(conversionConfigFacade.getIsLoading()).toEqual(
        conversionConfigFacade['isLoading$']
      );
    });
    it('should access the error', () => {
      expect(conversionConfigFacade.getError()).toEqual(
        conversionConfigFacade['error$']
      );
    });
    it('should access the hasSaved', () => {
      expect(conversionConfigFacade.getHasSaved()).toEqual(
        conversionConfigFacade['hasSaved$']
      );
    });
    it('should access the hasUpdated', () => {
      expect(conversionConfigFacade.getHasUpdated()).toEqual(
        conversionConfigFacade['hasUpdated$']
      );
    });
    it('should access the configDetailsById', () => {
      expect(conversionConfigFacade.getConversionConfigDetailsById()).toEqual(
        conversionConfigFacade['selectConversionConfigDetailsById$']
      );
    });
    it('should access the productGroups', () => {
      expect(conversionConfigFacade.getProductGroups()).toEqual(
        conversionConfigFacade['selectProductGroups$']
      );
    });
    it('should access the productCategories', () => {
      expect(conversionConfigFacade.getProductCategories()).toEqual(
        conversionConfigFacade['selectProductCategory$']
      );
    });
    it('should access the saveSuccessPayload', () => {
      expect(conversionConfigFacade.getSaveSuccessPayload()).toEqual(
        conversionConfigFacade['selectSaveSuccessPayload$']
      );
    });
    it('should access the hasSearched', () => {
      expect(conversionConfigFacade.getHasSearched()).toEqual(
        conversionConfigFacade['selectHasSearched$']
      );
    });
  });
});
