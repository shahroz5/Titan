import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import {
  ExcludeItemCodesPayload, GEPDetailsPayload,
  GEPPurityConfigListPayload,
  ProductGroupDeduction,
  PurityDetailsPayload,
  RemoveProductGroupDeduction,
  RemoveThemeCodesPayload,
  SaveThemeCodesPayload
} from '@poss-web/shared/models';
import {
  DeleteThemeCodes,
  GetExcludeItemCodes,
  GetExcludeThemeCodes,
  ItemCodeErrorLogDownload,
  LoadGepDetails,
  LoadGEPPurityConfig,
  LoadGepPurityDetails,
  LoadGoldRanges,
  LoadItemTypes,
  LoadMetalTypes,
  LoadPlatinumRanges,
  LoadProductGroups,
  LoadProductGroupsDeduction,
  LoadSelectedPgs,
  LoadSilverRanges,
  RemoveProductGroups,
  ResetGepPurityConfiguration,
  SaveGEPDetails,
  SaveProductGroupsDeduction,
  SavePurityDetails,
  SaveThemeCodes,
  SearchConfigName,
  SearchItemCode,
  SearchProductGroup,
  UpdateToggleButton,
  UploadFile
} from './gep-purity-config.actions';
import { GEPPurityConfigFacade } from './gep-purity-config.facade';
import { GEPPurityConfigState } from './gep-purity-config.state';
describe('GEPPurityConfigFacade Testing Suite', () => {
  const initialState: GEPPurityConfigState = {
    totalElements: 0,
    GEPPurityConfigList: null,
    isLoading: false,
    error: null,
    hasGEPDetailsSaved: false,
    metalType: null,
    itemType: null,
    hasPurityDetailsSaved: false,
    excludeThemeCodes: null,
    excludeItemCodes: null,
    productGroups: null,
    hasSearched: null,
    configId: null,
    hasGroupsSaved: false,
    gepDetails: null,
    purityDetails: [],
    productGroupsDeduction: null,
    hasThemeCodeSaved: false,
    hasThemeCodeRemoved: false,
    hasProductGroupRemoved: false,
    errorLog: null,
    fileResponse: undefined,
    productGroupsCount: 0,
    hasUpdateToggleButton: false,
    goldRanges: [],
    platinumRanges: [],
    silverRanges: [],
    location: [],
    allSelectedGroups: [],
    hasGroupsDataUpdated: false
  };
  let gepPurityConfigFacade: GEPPurityConfigFacade;
  let store: Store;
  const searchPayload = {
    configName: 'PRO123',
    type: 'GEP_ITEM'
  };
  const saveGEPDetails: GEPDetailsPayload = {
    gepConfiguration: {
      description: 'Configuration',
      isActive: true
    },
    gepDetails: {
      offerDetails: {
        gepCNUtilizationPercentage: 12,
        gepDiscountStartDate: 12,
        gepDiscountEndDate: 12,
        daysForGEPCNAfterOffer: 12,
        daysForGRNAndRebillingAfterOffer: 12,
        grnCNUtilizationPercentage: 12,
        isRivaah: true
      },
      configDetails: {
        gepDaysAfterCOOffer: 12,
        gepDaysAfterABOffer: 12,
        minKaratAccepted: 12,
        gepDiscountDeductionAmt: true,
        gepAsPayment: true,
        baseKaratForPurity: 12,
        holdTime: 12,
        isPreMeltingDetailsMandatory: true
      },
      description: 'Configuration',
      isActive: true,
      isOfferEnabled: true
    },

    configId: '123'
  };
  const savePurityDetails: PurityDetailsPayload = {
    configuration: {
      description: 'Configuration',
      isActive: true
    },
    purityDetails: {
      addConfigDetails: [
        {
          deductionPercent: 12,
          endDate: 16000000,
          itemType: 'item',
          metalType: 'metal',
          rangeId: '123',
          schemePercent: 100,
          startDate: 1600000,
          id: 'abc123'
        }
      ],
      removeConfigDetails: [],
      updateConfigDetails: [
        {
          deductionPercent: 12,
          endDate: 16000000,
          itemType: 'item',
          metalType: 'metal',
          rangeId: '123',
          schemePercent: 100,
          startDate: 1600000,
          id: 'abc123'
        }
      ]
    },
    configId: 'abc123'
  };
  const uploadFile: ExcludeItemCodesPayload = {
    gepConfiguration: {
      description: 'Configuration',
      isActive: true,
      type: 'GEP_ITEM'
    },
    uploadPayload: {
      configId: 'abc123',
      type: 'GEP_ITEM',
      formData: null
    }
  };
  const productGroupsDeductionPayload: ProductGroupDeduction = {
    config: {
      description: 'Configuration',
      isActive: true
    },
    productGroups: {
      addProductGroups: [{ productGroupCode: '71', configDetails: {} }],
      addRanges: [
        {
          rangeId: 'abc123',
          percentValue: 100
        }
      ],
      removeProductGroups: []
    },
    configId: 'abc123'
  };
  const saveThemeCodesPayload: SaveThemeCodesPayload = {
    saveThemeCodes: {
      addThemes: ['1'],
      removeThemes: ['2']
    },
    config: {
      description: 'Configuration',
      isActive: true
    },
    configId: 'abc123'
  };
  const removeThemeCodes: RemoveThemeCodesPayload = {
    configId: 'abc123',
    deleteThemeCode: {
      addThemes: [],
      removeThemes: ['1']
    }
  };
  const removeProductGroups: RemoveProductGroupDeduction = {
    configId: 'abc123',
    deleteProductGroup: {
      addProductGroups: [],
      addRanges: [
        {
          rangeId: 'abc123',
          percentValue: 100
        }
      ],
      removeProductGroups: ['71']
    }
  };
  const searchItemCodePayload = {
    configId: 'abc123',
    itemCode: '12'
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), GEPPurityConfigFacade]
    });
    gepPurityConfigFacade = TestBed.inject(GEPPurityConfigFacade);
    store = TestBed.inject(Store);
  });
  describe('Dispatch Actions TestCases', () => {
    it('should call LOAD_GEP_PURITY_CONFIG_LIST', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: GEPPurityConfigListPayload = {
        pageIndex: 0,
        pageSize: 100,
        type: 'GEP_ITEM',
        description: 'Configuration'
      };
      const action = new LoadGEPPurityConfig(payload);
      gepPurityConfigFacade.loadGepPurityConfigList(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call SEARCH_CONFIG_NAME', () => {
      spyOn(store, 'dispatch').and.returnValue({});

      const action = new SearchConfigName(searchPayload);
      gepPurityConfigFacade.searchGepPurityConfigSearch(searchPayload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call SAVE_GEP_DETAILS', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new SaveGEPDetails(saveGEPDetails);
      gepPurityConfigFacade.saveGEPDetails(saveGEPDetails);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call LOAD_METAL_TYPES', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new LoadMetalTypes();
      gepPurityConfigFacade.loadMetalTypes();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call LOAD_ITEM_TYPES', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new LoadItemTypes();
      gepPurityConfigFacade.loadItemTypes();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call LOAD_RANGES', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new LoadGoldRanges('GEP_PURITY_GOLD');
      gepPurityConfigFacade.loadGoldRanges('GEP_PURITY_GOLD');
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call SAVE_PURITY_DETAILS', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new SavePurityDetails(savePurityDetails);
      gepPurityConfigFacade.savePurityDetails(savePurityDetails);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call UPLOAD_FILE', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new UploadFile(uploadFile);
      gepPurityConfigFacade.uploadFile(uploadFile);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call LOAD_EXCLUDE_THEME_CODES', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new GetExcludeThemeCodes('abc123');
      gepPurityConfigFacade.loadExcludeThemeCodes('abc123');
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call LOAD_EXCLUDE_ITEM_CODES', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const excludeItemCodesPayload = {
        configId: 'abc123',
        pageIndex: 0,
        pageSize: 10
      };
      const action = new GetExcludeItemCodes(excludeItemCodesPayload);
      gepPurityConfigFacade.loadExcludeItemCodes(excludeItemCodesPayload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call LOAD_PRODUCT_GROUPS', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new LoadProductGroups();
      gepPurityConfigFacade.loadProductGroups();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call SEARCH_PRODUCT_GROUP', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new SearchProductGroup({
        searchValue: '72',
        configId: 'abc123'
      });
      gepPurityConfigFacade.searchProductGroup({
        searchValue: '72',
        configId: 'abc123'
      });
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call RESET_GEP_PURITY_CONFIGURATION', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new ResetGepPurityConfiguration();
      gepPurityConfigFacade.resetGepPurityConfiguration();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call RESET_GEP_PURITY_CONFIGURATION', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new ResetGepPurityConfiguration();
      gepPurityConfigFacade.resetGepPurityConfiguration();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call RESET_GEP_PURITY_CONFIGURATION', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new ResetGepPurityConfiguration();
      gepPurityConfigFacade.resetGepPurityConfiguration();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call SAVE_PRODUCT_GROUPS_DEDUCTION', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new SaveProductGroupsDeduction(
        productGroupsDeductionPayload
      );
      gepPurityConfigFacade.saveProductGroupsDeduction(
        productGroupsDeductionPayload
      );
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call LOAD_GEP_PURITY_DETAILS', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new LoadGepPurityDetails('abc123');
      gepPurityConfigFacade.loadGepPurityDetails('abc123');
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call LOAD_GEP_DETAILS', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new LoadGepDetails('abc123');
      gepPurityConfigFacade.loadGepDetails('abc123');
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call LOAD_PRODUCT_GROUPS_DEDUCTION', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new LoadProductGroupsDeduction({
        configId: 'abc123',
        pageIndex: 0,
        pageSize: 10
      });
      gepPurityConfigFacade.loadProductGroupsDeduction({
        configId: 'abc123',
        pageIndex: 0,
        pageSize: 10
      });
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call SAVE_THEME_CODE', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new SaveThemeCodes(saveThemeCodesPayload);
      gepPurityConfigFacade.saveThemeCode(saveThemeCodesPayload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call DELETE_THEME_CODE', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new DeleteThemeCodes(removeThemeCodes);
      gepPurityConfigFacade.deleteThemeCode(removeThemeCodes);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call REMOVE_PRODUCT_GROUP', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new RemoveProductGroups(removeProductGroups);
      gepPurityConfigFacade.removeProductGroup(removeProductGroups);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call SEARCH_ITEM_CODES', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new SearchItemCode(searchItemCodePayload);
      gepPurityConfigFacade.searchItemCodes(searchItemCodePayload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call LOAD_ITEM_CODES_ERRORLOG', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new ItemCodeErrorLogDownload('ABC123');
      gepPurityConfigFacade.loadItemCodesErrorLog('ABC123');
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call UPDATE_TOGGLE_BUTTON', () => {
      const payload = {
        configId: 'abc123',
        isActive: true
      };
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new UpdateToggleButton(payload);
      gepPurityConfigFacade.updateToggleButton({
        configId: 'abc123',
        isActive: true
      });
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LOAD_PLATINUM_RANGES', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new LoadSilverRanges('GEP_PURITY_SILVER');
      gepPurityConfigFacade.loadSilverRanges('GEP_PURITY_SILVER');
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call LOAD_PLATINUM_RANGES', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new LoadPlatinumRanges('GEP_PURITY_PLATINUM');
      gepPurityConfigFacade.loadPlatinumRanges('GEP_PURITY_PLATINUM');
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call LOAD_PLATINUM_RANGES', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new LoadPlatinumRanges('GEP_PURITY_PLATINUM');
      gepPurityConfigFacade.loadPlatinumRanges('GEP_PURITY_PLATINUM');
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call LOAD_PLATINUM_RANGES', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new LoadSelectedPgs({
        configId: 'abc123',
        pageIndex: 0,
        pageSize: 10
      });
      gepPurityConfigFacade.loadAllSelectedPgs({
        configId: 'abc123',
        pageIndex: 0,
        pageSize: 10
      });
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
  });
  describe('Testing Selectors', () => {
    it('should access the totalElementss', () => {
      expect(gepPurityConfigFacade.getTotalCount()).toEqual(
        gepPurityConfigFacade['totalElements$']
      );
    });
    it('should access the configList', () => {
      expect(gepPurityConfigFacade.getGepPurityConfigList()).toEqual(
        gepPurityConfigFacade['gepPurityConfigList$']
      );
    });
    it('should access the isLoading', () => {
      expect(gepPurityConfigFacade.getIsLoading()).toEqual(
        gepPurityConfigFacade['isLoading$']
      );
    });
    it('should access the error', () => {
      expect(gepPurityConfigFacade.getError()).toEqual(
        gepPurityConfigFacade['error$']
      );
    });
    it('should access the hasGEPDetailsSaved', () => {
      expect(gepPurityConfigFacade.getHasGEPDetailsSaved()).toEqual(
        gepPurityConfigFacade['selectHasGEPDetailsSaved$']
      );
    });
    it('should access the metalTpes', () => {
      expect(gepPurityConfigFacade.getMetalTypes()).toEqual(
        gepPurityConfigFacade['selectMetalType$']
      );
    });
    it('should access the itemTypes', () => {
      expect(gepPurityConfigFacade.getItemTypes()).toEqual(
        gepPurityConfigFacade['selectItemType$']
      );
    });
    it('should access the ranges', () => {
      expect(gepPurityConfigFacade.getGoldRanges()).toEqual(
        gepPurityConfigFacade['selectGoldRanges$']
      );
    });
    it('should access the hasPurityDetailsSaved', () => {
      expect(gepPurityConfigFacade.getHasPurityDetailsSaved()).toEqual(
        gepPurityConfigFacade['selectHasPurityDetailsSaved$']
      );
    });
    it('should access the excludeThemeCodes', () => {
      expect(gepPurityConfigFacade.getExcludeThemeCodes()).toEqual(
        gepPurityConfigFacade['selectExcludeThemeCodes$']
      );
    });
    it('should access the excludeItemCodes', () => {
      expect(gepPurityConfigFacade.getExcludeItemCodes()).toEqual(
        gepPurityConfigFacade['selectExcludeItemCodes$']
      );
    });
    it('should access the productGroups', () => {
      expect(gepPurityConfigFacade.getProductGroups()).toEqual(
        gepPurityConfigFacade['selectProductGroups$']
      );
    });
    it('should access the configId', () => {
      expect(gepPurityConfigFacade.getConfigId()).toEqual(
        gepPurityConfigFacade['selectConfigId$']
      );
    });
    it('should access the hasProductGroupsDeducted', () => {
      expect(gepPurityConfigFacade.getHasProductGroupsDeducted()).toEqual(
        gepPurityConfigFacade['selectHasProductsDeductionSaved$']
      );
    });
    it('should access the purityDetails', () => {
      expect(gepPurityConfigFacade.getPurityDetails()).toEqual(
        gepPurityConfigFacade['selectPurityDetails$']
      );
    });
    it('should access the productGroupsDeduction', () => {
      expect(gepPurityConfigFacade.getProductGroupsDeduction()).toEqual(
        gepPurityConfigFacade['selectProductGroupsDeduction$']
      );
    });
    it('should access the hasSearched', () => {
      expect(gepPurityConfigFacade.getHasSearched()).toEqual(
        gepPurityConfigFacade['selectHasSearched$']
      );
    });
    it('should access the hasThemeCodeSaved', () => {
      expect(gepPurityConfigFacade.getHasThemeCodeSaved()).toEqual(
        gepPurityConfigFacade['selectHasThemeCodeSaved$']
      );
    });
    it('should access the hasThemeCodeRemoved', () => {
      expect(gepPurityConfigFacade.getHasThemeCodeRemoved()).toEqual(
        gepPurityConfigFacade['selectHasThemeCodeRemoved$']
      );
    });
    it('should access the hasProductGroupRemoved', () => {
      expect(gepPurityConfigFacade.getHasProductGroupRemoved()).toEqual(
        gepPurityConfigFacade['selectHasRemoveProductGroup$']
      );
    });
    it('should access the hasProductGroupRemoved', () => {
      expect(gepPurityConfigFacade.getHasProductGroupRemoved()).toEqual(
        gepPurityConfigFacade['selectHasRemoveProductGroup$']
      );
    });
    it('should access the fileResponse', () => {
      expect(gepPurityConfigFacade.getFileResponse()).toEqual(
        gepPurityConfigFacade['selectFileResponse$']
      );
    });
    it('should access the totalItemCodes', () => {
      expect(gepPurityConfigFacade.getTotalItemCodes()).toEqual(
        gepPurityConfigFacade['selectItemCodesCount$']
      );
    });
    it('should access the gepDetails', () => {
      expect(gepPurityConfigFacade.getGepDetails()).toEqual(
        gepPurityConfigFacade['selectGepDetails$']
      );
    });
    it('should access the errorLog', () => {
      expect(gepPurityConfigFacade.getErrorLog()).toEqual(
        gepPurityConfigFacade['selectErrorLog$']
      );
    });

    it('should access the hasToggleButton', () => {
      expect(gepPurityConfigFacade.getHasToggleButton()).toEqual(
        gepPurityConfigFacade['selectHasToggleButton$']
      );
    });

    it('should access the productGroupsCount', () => {
      expect(gepPurityConfigFacade.getProductGroupsCount()).toEqual(
        gepPurityConfigFacade['selectProductGroupsCount$']
      );
    });

    it('should access the silverRanges', () => {
      expect(gepPurityConfigFacade.getSilverRanges()).toEqual(
        gepPurityConfigFacade['selectSilverRanges$']
      );
    });

    it('should access the platinumRanges', () => {
      expect(gepPurityConfigFacade.getPlatinumRanges()).toEqual(
        gepPurityConfigFacade['selectPlatinumRanges$']
      );
    });

    // it('should access the locations', () => {
    //   expect(gepPurityConfigFacade.getLocations()).toEqual(
    //     gepPurityConfigFacade['selectLocations$']
    //   );
    // });

    it('should access the selectedPgs', () => {
      expect(gepPurityConfigFacade.getSelectedPgs()).toEqual(
        gepPurityConfigFacade['selectedProductGroups$']
      );
    });
  });
});
