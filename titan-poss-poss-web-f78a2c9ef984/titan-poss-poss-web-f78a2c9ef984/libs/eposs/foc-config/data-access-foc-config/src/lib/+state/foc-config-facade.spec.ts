import {
  FocConfigurationListPayload,
  SchemeDetails,
  LoadProductGroupPayload,
  SaveProductGroup,
  SaveVariantDetailsPayload,
  LoadVariantDetailsPayload,
  FocLocationListPayload,
  SaveLocationPayload,
  FOCItemCodesPayload,
  FocItemsSavePayload,
  FocItemsPayload
} from '@poss-web/shared/models';
import { Store } from '@ngrx/store';

import { TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';

import { FocConfigurationFacade } from './foc-config-facade';

import {
  LoadReset,
  LoadFocConfigurationList,
  UpdateFocSchemeConfiguration,
  SaveFocSchemeConfiguration,
  SearchConfigBySchemeName,
  LoadFocSchemeConfigurationByConfigId,
  LoadMappedProductGroupsByConfigId,
  UpdateProductGroupByConfigId,
  SaveVariantDetails,
  LoadVariantDetailsById,
  LoadRangeWeight,
  LoadLocationById,
  UpdateLocationById,
  LoadFocItemCodes,
  SaveFocItems,
  SearchFocItem,
  SearchLocationCode,
  PublishFocScheme,
  LoadVariantDetailsValueGoldStandardById,
  LoadVariantDetailsValueGoldSlabById,
  LoadVariantDetailsValueOthersStandardById,
  LoadVariantDetailsValueOthersSlabById,
  LoadVariantDetailsWeightGoldStandardById,
  LoadVariantDetailsWeightGoldSlabById,
  LoadVariantDetailsWeightOthersStandardById,
  LoadVariantDetailsWeightOthersSlabById,
  LoadAllSelectedItemCodes,
  LoadAllSelectedLocationCodes
} from './foc-config-actions';
import { FocConfigurationState } from './foc-config-state';

describe(' focConfigurationFacade Testing Suite', () => {
  const initialState: FocConfigurationState = {
    focConfigList: null,
    isLoading: null,
    error: null,
    schemeDetails: null,
    hasSaved: null,
    hasUpdated: null,
    totalElements: null,
    rangeWeight: [],
    valueBasedVariantDetails: [],
    weightBasedVariantDetails: [],
    valueBasedVariantDetailsGoldStandard: [],
    valueBasedVariantDetailsGoldSlab: [],
    weightBasedVariantDetailsGoldStandard: [],
    weightBasedVariantDetailsGoldSlab: [],
    valueBasedVariantDetailsOthersStandard: [],
    valueBasedVariantDetailsOthersSlab: [],
    weightBasedVariantDetailsOthersStandard: [],
    weightBasedVariantDetailsOthersSlab: [],
    productGroups: null,
    focItems: [],
    locationList: [],
    isLocationUpdated: null,
    itemCodes: [],
    hasSavedFocItems: false,
    mappedFocItems: [],
    totalFocItems: 0,
    schemeDetailsById: null,
    hasProductsUpdated: false,
    totalLocation: null,
    loadMappedProdcutGroup: null,
    isPublished: null,
    allSelectedItemCodes: null,
    allSelectedLocationCodes: null,
    focTypeSate: null
  };
  let focConfigurationFacade: FocConfigurationFacade;
  let store: MockStore<FocConfigurationFacade>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), FocConfigurationFacade]
    });
    store = TestBed.inject<any>(Store);
    focConfigurationFacade = TestBed.inject<any>(FocConfigurationFacade);
  });

  describe('Dispatch Actions action', () => {
    it('should call LOAD_FOC_CONFIGURATION_LIST action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: FocConfigurationListPayload = {
        pageIndex: 0,
        pageSize: 10,
        length: 10
      };
      const action = new LoadFocConfigurationList(payload);
      focConfigurationFacade.loadFocConfigurationList(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call UPDATE_FOC_SCHEME_CONFIGURATION action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: SchemeDetails = {
        id: '1',
        clubbingConfigData: {
          data: {
            isExchangeOffer: true,
            isCBO: true,
            isGHS: true,
            isRiva: true,
            isEmpowerment: true,
            isDV: true
          },
          type: 'CLUBBING OFFER'
        },
        description: 'Scheme One',
        grnConfigData: {
          data: {
            noOfDaysBeforeOfferPeriod: '1',
            noOfDaysAfterOfferPeriod: '2',
            utilizationPercent: '3'
          },
          type: 'GRN_CONFIG'
        },
        isActive: true,
        name: 'Scheme One',
        orderConfigData: {
          data: {
            isGoldRateFrozenForCO: true,
            isGoldRateFrozenForAB: true,
            offerPeriodForCO: '1',
            offerPeriodForAB: '2',
            coPercent: '3',
            abPercent: '22'
          },
          type: 'ORDER_CONFIG'
        },
        tepConfigData: {
          data: {
            isEnabled: true,
            tepDetails: [
              {
                durationInDays: '1',
                recoveryPercent: '10'
              }
            ]
          },
          type: 'TEP_CONFIG'
        }
      };
      const action = new UpdateFocSchemeConfiguration(payload);
      focConfigurationFacade.updateFocSchemeConfiguration(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call SAVE_FOC_SCHEME_CONFIGURATION action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: SchemeDetails = {
        id: '1',
        clubbingConfigData: {
          data: {
            isExchangeOffer: true,
            isCBO: true,
            isGHS: true,
            isRiva: true,
            isEmpowerment: true,
            isDV: true
          },
          type: 'CLUBBING OFFER'
        },
        description: 'Scheme One',
        grnConfigData: {
          data: {
            noOfDaysBeforeOfferPeriod: '1',
            noOfDaysAfterOfferPeriod: '2',
            utilizationPercent: '3'
          },
          type: 'GRN_CONFIG'
        },
        isActive: true,
        name: 'Scheme One',
        orderConfigData: {
          data: {
            isGoldRateFrozenForCO: true,
            isGoldRateFrozenForAB: true,
            offerPeriodForCO: '1',
            offerPeriodForAB: '2',
            coPercent: '3',
            abPercent: '22'
          },
          type: 'ORDER_CONFIG'
        },
        tepConfigData: {
          data: {
            isEnabled: true,
            tepDetails: [
              {
                durationInDays: '1',
                recoveryPercent: '10'
              }
            ]
          },
          type: 'TEP_CONFIG'
        }
      };
      const action = new SaveFocSchemeConfiguration(payload);
      focConfigurationFacade.saveFocSchemeConfiguration(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call SEARCH_CONFIG_BY_SCHEME_NAME action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload = 'Scheme One';
      const action = new SearchConfigBySchemeName(payload);
      focConfigurationFacade.searchConfig(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LOAD_FOC_SCHEME_CONFIGURATION_BY_CONFIG_ID action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload = '1';

      const action = new LoadFocSchemeConfigurationByConfigId(payload);
      focConfigurationFacade.loadFocSchemeConfigurationByConfigId(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LOAD_MAPPED_PRODUCT_GROUPS_BY_CONFIG_ID action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: LoadProductGroupPayload = {
        masterId: '11',
        category: 'GOLD_COIN',
        schemeDetailsId: '22'
      };
      const action = new LoadMappedProductGroupsByConfigId(payload);
      focConfigurationFacade.loadMappedProductGroupByConfigId(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call UPDATE_PRODUCT_GROUPS_BY_CONFIG_ID action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: SaveProductGroup = {
        masterId: '11',
        schemeDetailsId: '22',
        category: 'GOLD_COIN',
        addProducts: ['76'],
        removeProducts: []
      };
      const action = new UpdateProductGroupByConfigId(payload);
      focConfigurationFacade.updateProductGroupByConfigId(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call SAVE_VARIANT_DETAILS action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: SaveVariantDetailsPayload = {
        masterId: '1',
        discountType: 'STANDARD',
        addSchemeDetails: [
          {
            category: 'VALUE_BASED',
            focEligibility: 'PRE_DISCOUNT_TAX',
            fromSaleValue: '100',
            isActive: true,
            isMultiple: true,
            isSingle: true,
            itemCode: '',
            itemType: 'GOLD',
            karat: '22',
            offerType: 'STANDARD',
            quantity: '1',
            rowId: '0',
            stdSaleValue: '1000',
            toSaleValue: '200',
            weight: '1'
          }
        ],
        updateSchemeDetails: [],
        deleteSchemeDetails: []
      };
      const action = new SaveVariantDetails(payload);
      focConfigurationFacade.saveVariantDetails(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call LOAD_VARIANT_DEATAILS_BY_ID action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: LoadVariantDetailsPayload = {
        id: '1'
      };
      const action = new LoadVariantDetailsById(payload);
      focConfigurationFacade.loadVariantDetailsById(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call LOAD_RANGE_WEIGHT action', () => {
      spyOn(store, 'dispatch').and.returnValue({});

      const action = new LoadRangeWeight();
      focConfigurationFacade.loadRangeWeight();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LOAD_MAPPED_LOCATIONS_BY_ID action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: FocLocationListPayload = {
        pageSize: 10,
        pageIndex: 1,
        length: 100,
        id: '1'
      };
      const action = new LoadLocationById(payload);
      focConfigurationFacade.loadLocationListById(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call UPDATE_LOCATIONS_BY_ID action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: SaveLocationPayload = {
        id: '1',
        saveLocationPayload: {
          addLocations: ['URB']
        }
      };
      const action = new UpdateLocationById(payload);
      focConfigurationFacade.updateLocationById(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LOAD_FOC_ITEM_CODES action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: FOCItemCodesPayload = {
        excludeProductCategories: [],
        excludeProductGroups: [],
        includeProductCategories: [],
        includeProductGroups: ['74'],
        isFocItem: true
      };
      const action = new LoadFocItemCodes(payload);
      focConfigurationFacade.loadFOCItemCodes(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call SAVE_FOC_ITEMS action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: FocItemsSavePayload = {
        id: '1',
        savePayload: {
          addItems: [
            {
              itemCode: '53FCDS2222AE0',
              stdWeight: 32,
              karat: 22
            }
          ],
          removeItems: []
        }
      };
      const action = new SaveFocItems(payload);
      focConfigurationFacade.saveFocItems(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call SEARCH_FOC_ITEM action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: { configId: string; itemCode: string } = {
        configId: '1',
        itemCode: '5FSCDDCD000'
      };
      const action = new SearchFocItem(payload);
      focConfigurationFacade.searchFocItems(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call SEARCH_LOCATION_CODE action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: { configId: string; locationCode: string } = {
        configId: '1',
        locationCode: '5FSCDDCD000'
      };
      const action = new SearchLocationCode(payload);
      focConfigurationFacade.searchLocationCode(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call PUBLISH_FOC_SCHEME action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload = '1';
      const action = new PublishFocScheme(payload);
      focConfigurationFacade.publishFocScheme(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LOAD_VARIANT_DEATAILS_VALUE_GOLD_STANDARD_BY_ID action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: LoadVariantDetailsPayload = {
        id: '1'
      };
      const action = new LoadVariantDetailsValueGoldStandardById(payload);
      focConfigurationFacade.loadVariantDetailsValueGoldStandardById(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LOAD_VARIANT_DEATAILS_VALUE_GOLD_SLAB_BY_ID action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: LoadVariantDetailsPayload = {
        id: '1'
      };
      const action = new LoadVariantDetailsValueGoldSlabById(payload);
      focConfigurationFacade.loadVariantDetailsValueGoldSlabById(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LOAD_VARIANT_DEATAILS_VALUE_OTHERS_STANDARD_BY_ID action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: LoadVariantDetailsPayload = {
        id: '1'
      };
      const action = new LoadVariantDetailsValueOthersStandardById(payload);
      focConfigurationFacade.loadVariantDetailsValueOthersStandardById(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LOAD_VARIANT_DEATAILS_VALUE_OTHERS_SLAB_BY_ID action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: LoadVariantDetailsPayload = {
        id: '1'
      };
      const action = new LoadVariantDetailsValueOthersSlabById(payload);
      focConfigurationFacade.loadVariantDetailsValueOthersSlabById(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LOAD_VARIANT_DEATAILS_WEIGHT_GOLD_STANDARD_BY_ID action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: LoadVariantDetailsPayload = {
        id: '1'
      };
      const action = new LoadVariantDetailsWeightGoldStandardById(payload);
      focConfigurationFacade.loadVariantDetailsWeightGoldStandardById(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LOAD_VARIANT_DEATAILS_WEIGHT_GOLD_SLAB_BY_ID action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: LoadVariantDetailsPayload = {
        id: '1'
      };
      const action = new LoadVariantDetailsWeightGoldSlabById(payload);
      focConfigurationFacade.loadVariantDetailsWeightGoldSlabById(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LOAD_VARIANT_DEATAILS_WEIGHT_OTHERS_STANDARD_BY_ID action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: LoadVariantDetailsPayload = {
        id: '1'
      };
      const action = new LoadVariantDetailsWeightOthersStandardById(payload);
      focConfigurationFacade.loadVariantDetailsWeightOthersStandardById(
        payload
      );
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LOAD_VARIANT_DEATAILS_WEIGHT_OTHERS_SLAB_BY_ID action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: LoadVariantDetailsPayload = {
        id: '1'
      };
      const action = new LoadVariantDetailsWeightOthersSlabById(payload);
      focConfigurationFacade.loadVariantDetailsWeightOthersSlabById(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LOAD_ALL_SELECTED_ITEM_CODES action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: FocItemsPayload = {
        id: '1',
        pageIndex: 1,
        pageSize: 10
      };
      const action = new LoadAllSelectedItemCodes(payload);
      focConfigurationFacade.loadAllFocItemCodes(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call LOAD_ALL_SELECTED_LOCATION_CODES action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: FocLocationListPayload = {
        pageSize: 10,
        pageIndex: 1,
        length: 100,
        id: '1'
      };
      const action = new LoadAllSelectedLocationCodes(payload);
      focConfigurationFacade.loadAllLocations(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LOAD_RESET action', () => {
      spyOn(store, 'dispatch').and.returnValue({});

      const action = new LoadReset();
      focConfigurationFacade.loadReset();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
  });

  describe('Access Selector action', () => {
    it('should access the getIsLocationUpdated selector action', () => {
      expect(focConfigurationFacade.getIsLocationUpdated()).toEqual(
        focConfigurationFacade['isLocationUpdated$']
      );
    });

    it('should access the getLocationList selector action', () => {
      expect(focConfigurationFacade.getLocationList()).toEqual(
        focConfigurationFacade['selectLocationList$']
      );
    });

    it('should access the getProductGroups selector action', () => {
      expect(focConfigurationFacade.getProductGroups()).toEqual(
        focConfigurationFacade['selectProductGroups$']
      );
    });

    it('should access the getHasSaved selector action', () => {
      expect(focConfigurationFacade.getHasSaved()).toEqual(
        focConfigurationFacade['hasSaved$']
      );
    });

    it('should access the getValueBasedVariantDetails selector action', () => {
      expect(focConfigurationFacade.getValueBasedVariantDetails()).toEqual(
        focConfigurationFacade['selectValueBasedVariantDetails$']
      );
    });

    it('should access the getWeightBasedVariantDetails selector action', () => {
      expect(focConfigurationFacade.getWeightBasedVariantDetails()).toEqual(
        focConfigurationFacade['selectWeightBasedVariantDetails$']
      );
    });

    it('should access the getRangeWeight selector action', () => {
      expect(focConfigurationFacade.getRangeWeight()).toEqual(
        focConfigurationFacade['selectRangeWeight$']
      );
    });

    it('should access the getError selector action', () => {
      expect(focConfigurationFacade.getError()).toEqual(
        focConfigurationFacade['error$']
      );
    });

    it('should access the getIsloading selector action', () => {
      expect(focConfigurationFacade.getIsloading()).toEqual(
        focConfigurationFacade['isLoading$']
      );
    });
    it('should access the getHasUpdated selector action', () => {
      expect(focConfigurationFacade.getHasUpdated()).toEqual(
        focConfigurationFacade['hasUpdated$']
      );
    });

    it('should access the getTotalElement selector action', () => {
      expect(focConfigurationFacade.getTotalElement()).toEqual(
        focConfigurationFacade['totalElements$']
      );
    });
    it('should access the getSchemeDetails selector action', () => {
      expect(focConfigurationFacade.getSchemeDetails()).toEqual(
        focConfigurationFacade['schemeDetails$']
      );
    });
    it('should access the getFocConfigurationList selector action', () => {
      expect(focConfigurationFacade.getFocConfigurationList()).toEqual(
        focConfigurationFacade['focConfigList$']
      );
    });

    it('should access the getFocItemCodes selector action', () => {
      expect(focConfigurationFacade.getFocItemCodes()).toEqual(
        focConfigurationFacade['selectFocItemCodes$']
      );
    });

    it('should access the getHasFocItemsSaved selector action', () => {
      expect(focConfigurationFacade.getHasFocItemsSaved()).toEqual(
        focConfigurationFacade['selectHasFocItemsSaved$']
      );
    });

    it('should access the getTotalFocItems selector action', () => {
      expect(focConfigurationFacade.getTotalFocItems()).toEqual(
        focConfigurationFacade['selectTotalFocItems$']
      );
    });

    it('should access the getLocationCount selector action', () => {
      expect(focConfigurationFacade.getLocationCount()).toEqual(
        focConfigurationFacade['selectLocationCount$']
      );
    });

    it('should access the getMappedFocItems selector action', () => {
      expect(focConfigurationFacade.getMappedFocItems()).toEqual(
        focConfigurationFacade['selectMappedFocItems$']
      );
    });

    it('should access the getSchemeDetailsById selector action', () => {
      expect(focConfigurationFacade.getSchemeDetailsById()).toEqual(
        focConfigurationFacade['selectSchemeDetailsById$']
      );
    });

    it('should access the getHasProductsUpdated selector action', () => {
      expect(focConfigurationFacade.getHasProductsUpdated()).toEqual(
        focConfigurationFacade['selectHasProductsUpdated$']
      );
    });
  });
});
