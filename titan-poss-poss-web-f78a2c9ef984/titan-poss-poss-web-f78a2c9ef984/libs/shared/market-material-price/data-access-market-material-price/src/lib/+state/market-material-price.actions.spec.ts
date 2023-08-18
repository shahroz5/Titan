import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  CustomErrors,
  SavePricePayload,
  MaterialPriceList,
  LoadMarketBasedOnMaterial,
  MarketListing,
  ViewLocationPayload,
  LocationDetailsList,
  LoadSavedBasePrice,
  SearchMarketCodePayload,
  SearchSavedLocationPriceByLocationPayload,
  SearchComputedPriceByLocationPayload,
  MarketDetails,
  MaterialPricePayload
} from '@poss-web/shared/models';
import {
  LoadMetalPriceDetails,
  MarketMaterialPriceActionTypes,
  LoadMetalPriceDetailsSuccess,
  LoadMetalPriceDetailsFailure,
  LoadMarketDetailsBasedOnMaterial,
  LoadMarketDetailsBasedOnMaterialSuccess,
  LoadMarketDetailsBasedOnMaterialFailure,
  SavePrice,
  SavePriceSuccess,
  SavePriceFailure,
  LoadReset,
  UpdateCheckBox,
  ComputeBasePriceForForcedType,
  ViewLocationPrice,
  ViewLocationPriceSuccess,
  LoadSavedPrice,
  LoadSavedPriceSuccess,
  LoadSavedPriceFailure,
  SearchMarketCode,
  SearchMarketCodeSuccess,
  SearchMarketCodeFailure,
  SearchSavedLocationPriceByLocationCode,
  SearchSavedLocationPriceByLocationCodeSuccess,
  SearchSavedLocationPriceByLocationCodeFailure,
  SearchComputedPriceByLocationCode,
  SearchComputedPriceByLocationCodeSuccess,
  SearchComputedPriceByLocationCodeFailure,
  LoadResetSelectedStock,
  LoadResetLocationData,
  UpdateSelectedDate,
  UpdateSelectedStock,
  UpdateSelectedMarketCode,
  ComputePriceForAll,
  RemovePriceForAll,
  UpdateAllSelected,
  UpdateHasNewViewLocationPrice,
  ViewLocationPriceFailure
} from './market-material-price.actions';

describe('MarketMaterialPrice  Action Testing Suite', () => {
  describe('LoadMetalPriceDetails Action Test Cases', () => {
    it('should check correct type is used for  LoadMetalPriceDetails action ', () => {
      const payload: MaterialPricePayload = {
        applicableDate: 10,
        materialCode: 'j',
        configId: '1'
      };

      const action = new LoadMetalPriceDetails(payload);
      expect({ ...action }).toEqual({
        type: MarketMaterialPriceActionTypes.LOAD_METAL_PRICE_DETAILS,
        payload
      });
    });
    it('should check correct type is used for  LoadMetalPriceDetailsSuccess action ', () => {
      const payload: MaterialPriceList[] = [
        {
          price: 1000,
          priceType: 'D',
          remarks: 'remarks',
          id: '1',
          time: '10',
          createdDate: new Date()
        }
      ];
      const action = new LoadMetalPriceDetailsSuccess(payload);

      expect({ ...action }).toEqual({
        type: MarketMaterialPriceActionTypes.LOAD_METAL_PRICE_DETAILS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadMetalPriceDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadMetalPriceDetailsFailure(payload);

      expect({ ...action }).toEqual({
        type: MarketMaterialPriceActionTypes.LOAD_METAL_PRICE_DETAILS_FAILURE,
        payload
      });
    });
  });

  describe('LoadMarketDetailsBasedOnMaterial Action Test Cases', () => {
    it('should check correct type is used for  LoadMarketDetailsBasedOnMaterial action ', () => {
      const payload: LoadMarketBasedOnMaterial = {
        data: {
          materialCode: 'J',
          pageSize: 10,
          pageIndex: 1
        }
      };
      const action = new LoadMarketDetailsBasedOnMaterial(payload);
      expect({ ...action }).toEqual({
        type:
          MarketMaterialPriceActionTypes.LOAD_MARKET_DETAILS_BASED_ON_MATERIAL,
        payload
      });
    });
    it('should check correct type is used for LoadMarketDetailsBasedOnMaterialSuccess action ', () => {
      const payload: MarketListing = {
        marketDetails: [
          {
            materialCode: '',
            marketCode: 'KA',
            description: 'KARANATAKA',
            markupFactor: 1,
            addAmount: 10,
            deductAmount: 10,
            computedPrice: 200
          }
        ],
        totalCount: 1
      };

      const action = new LoadMarketDetailsBasedOnMaterialSuccess(payload);

      expect({ ...action }).toEqual({
        type:
          MarketMaterialPriceActionTypes.LOAD_MARKET_DETAILS_BASED_ON_MATERIAL_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadMarketDetailsBasedOnMaterialFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadMarketDetailsBasedOnMaterialFailure(payload);

      expect({ ...action }).toEqual({
        type:
          MarketMaterialPriceActionTypes.LOAD_MARKET_DETAILS_BASED_ON_MATERIAL_FAILURE,
        payload
      });
    });
  });

  describe('SavePrice Action Test Cases', () => {
    it('should check correct type is used for  SavePrice action ', () => {
      const payload: SavePricePayload = {
        materialCode: 'J',
        data: {
          applicableDate: 10,
          marketCodes: [],
          basePrice: 10,
          remarks: 'remarks',
          priceTypeCode: 'D'
        }
      };
      const action = new SavePrice(payload);
      expect({ ...action }).toEqual({
        type: MarketMaterialPriceActionTypes.SAVE_PRICE,
        payload
      });
    });
    it('should check correct type is used for SavePriceSuccess action ', () => {
      const action = new SavePriceSuccess();

      expect({ ...action }).toEqual({
        type: MarketMaterialPriceActionTypes.SAVE_PRICE_SUCCESS
      });
    });
    it('should check correct type is used for  SavePriceFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SavePriceFailure(payload);

      expect({ ...action }).toEqual({
        type: MarketMaterialPriceActionTypes.SAVE_PRICE_FAILURE,
        payload
      });
    });
  });

  describe('UpdateCheckBox Action Test Cases', () => {
    it('should check correct type is used for  UpdateCheckBox action ', () => {
      const payload = true;
      const action = new UpdateCheckBox(payload);
      expect({ ...action }).toEqual({
        type: MarketMaterialPriceActionTypes.UPDATE_CHECKBOX,
        payload
      });
    });
  });

  describe('ComputeBasePriceForForcedType Action Test Cases', () => {
    it('should check correct type is used for  ComputeBasePriceForForcedType action ', () => {
      const payload = 10;
      const action = new ComputeBasePriceForForcedType(payload);
      expect({ ...action }).toEqual({
        type: MarketMaterialPriceActionTypes.COMPUTE_BASE_PRICE,
        payload
      });
    });
  });
  describe('ViewLocationPrice Action Test Cases', () => {
    it('should check correct type is used for  ViewLocationPrice action ', () => {
      const payload: ViewLocationPayload = {
        pageIndex: 1,
        pageSize: 10,
        materialCode: 'J',
        data: {
          marketCodes: [],
          applicableDate: 10,
          priceTypeCode: 'F',
          basePrice: 100
        }
      };
      const action = new ViewLocationPrice(payload);
      expect({ ...action }).toEqual({
        type: MarketMaterialPriceActionTypes.VIEW_LOCATION_PRICE,
        payload
      });
    });
    it('should check correct type is used for SavePriceSuccess action ', () => {
      const payload: LocationDetailsList = {
        locationDetails: [
          {
            locationCode: 'URB',
            locationDescription: 'URB',
            marketCode: 'KA',
            marketDescription: 'KA',
            materialPrice: '1001'
          }
        ],
        totalCount: 10
      };
      const action = new ViewLocationPriceSuccess(payload);

      expect({ ...action }).toEqual({
        type: MarketMaterialPriceActionTypes.VIEW_LOCATION_PRICE_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  ViewLocationPriceFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new ViewLocationPriceFailure(payload);

      expect({ ...action }).toEqual({
        type: MarketMaterialPriceActionTypes.VIEW_LOCATION_PRICE_FAILURE,
        payload
      });
    });
  });

  describe('LoadSavedPrice Action Test Cases', () => {
    it('should check correct type is used for  LoadSavedPrice action ', () => {
      const payload: LoadSavedBasePrice = {
        pageSize: 10,
        pageIndex: 1,
        materialCode: 'j',
        id: '1'
      };
      const action = new LoadSavedPrice(payload);
      expect({ ...action }).toEqual({
        type: MarketMaterialPriceActionTypes.LOAD_SAVED_BASE_PRICE,
        payload
      });
    });
    it('should check correct type is used for LoadSavedPriceSuccess action ', () => {
      const payload: LocationDetailsList = {
        locationDetails: [
          {
            locationCode: 'URB',
            locationDescription: 'URB',
            marketCode: 'KA',
            marketDescription: 'KA',
            materialPrice: '1001'
          }
        ],
        totalCount: 10
      };
      const action = new LoadSavedPriceSuccess(payload);

      expect({ ...action }).toEqual({
        type: MarketMaterialPriceActionTypes.LOAD_SAVED_BASE_PRICE_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadSavedPriceFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadSavedPriceFailure(payload);

      expect({ ...action }).toEqual({
        type: MarketMaterialPriceActionTypes.LOAD_SAVED_BASE_PRICE_FAILURE,
        payload
      });
    });
  });

  describe('SearchMarketCode Action Test Cases', () => {
    it('should check correct type is used for  SearchMarketCode action ', () => {
      const payload: SearchMarketCodePayload = {
        data: {
          materialCode: 'J',
          marketCode: 'KA'
        },
        selectedStock: ''
      };
      const action = new SearchMarketCode(payload);
      expect({ ...action }).toEqual({
        type: MarketMaterialPriceActionTypes.SEARCH_MARKET_CODE,
        payload
      });
    });
    it('should check correct type is used for SearchMarketCodeSuccess action ', () => {
      const payload: MarketListing = {
        marketDetails: [
          {
            materialCode: '',
            marketCode: 'KA',
            description: 'KARANATAKA',
            markupFactor: 1,
            addAmount: 10,
            deductAmount: 10,
            computedPrice: 200
          }
        ],
        totalCount: 1
      };

      const action = new SearchMarketCodeSuccess(payload);

      expect({ ...action }).toEqual({
        type: MarketMaterialPriceActionTypes.SEARCH_MARKET_CODE_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  SearchMarketCodeFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SearchMarketCodeFailure(payload);

      expect({ ...action }).toEqual({
        type: MarketMaterialPriceActionTypes.SEARCH_MARKET_CODE_FAILURE,
        payload
      });
    });
  });

  describe('SearchSavedLocationPriceByLocationCode Action Test Cases', () => {
    it('should check correct type is used for  SearchSavedLocationPriceByLocationCode action ', () => {
      const payload: SearchSavedLocationPriceByLocationPayload = {
        id: '1',
        locationCode: 'URB',
        materialCode: 'J',
        pageIndex: 1,
        pageSize: 10
      };
      const action = new SearchSavedLocationPriceByLocationCode(payload);
      expect({ ...action }).toEqual({
        type:
          MarketMaterialPriceActionTypes.SEARCH_SAVED_LOCATION_PRICE_BY_LOCATION_CODE,
        payload
      });
    });
    it('should check correct type is used for SearchSavedLocationPriceByLocationCodeSuccess action ', () => {
      const payload: LocationDetailsList = {
        locationDetails: [
          {
            locationCode: 'URB',
            locationDescription: 'URB',
            marketCode: 'KA',
            marketDescription: 'KA',
            materialPrice: '1001'
          }
        ],
        totalCount: 10
      };

      const action = new SearchSavedLocationPriceByLocationCodeSuccess(payload);

      expect({ ...action }).toEqual({
        type:
          MarketMaterialPriceActionTypes.SEARCH_SAVED_LOCATION_PRICE_BY_LOCATION_CODE_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  SearchSavedLocationPriceByLocationCodeFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SearchSavedLocationPriceByLocationCodeFailure(payload);

      expect({ ...action }).toEqual({
        type:
          MarketMaterialPriceActionTypes.SEARCH_SAVED_LOCATION_PRICE_BY_LOCATION_CODE_FAILURE,
        payload
      });
    });
  });

  describe('SearchComputedPriceByLocationCode Action Test Cases', () => {
    it('should check correct type is used for  SearchComputedPriceByLocationCode action ', () => {
      const payload: SearchComputedPriceByLocationPayload = {
        locationCode: 'URB',
        materialCode: 'J',
        pageIndex: 1,
        pageSize: 10,
        data: ''
      };
      const action = new SearchComputedPriceByLocationCode(payload);
      expect({ ...action }).toEqual({
        type:
          MarketMaterialPriceActionTypes.SEARCH_COMPUTED_PRICE_BY_LOCATION_CODE,
        payload
      });
    });
    it('should check correct type is used for SearchComputedPriceByLocationCodeSuccess action ', () => {
      const payload: LocationDetailsList = {
        locationDetails: [
          {
            locationCode: 'URB',
            locationDescription: 'URB',
            marketCode: 'KA',
            marketDescription: 'KA',
            materialPrice: '1001'
          }
        ],
        totalCount: 10
      };

      const action = new SearchComputedPriceByLocationCodeSuccess(payload);

      expect({ ...action }).toEqual({
        type:
          MarketMaterialPriceActionTypes.SEARCH_COMPUTED_PRICE_BY_LOCATION_CODE_SUCCESS,

        payload
      });
    });
    it('should check correct type is used for  SearchComputedPriceByLocationCodeFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SearchComputedPriceByLocationCodeFailure(payload);

      expect({ ...action }).toEqual({
        type:
          MarketMaterialPriceActionTypes.SEARCH_COMPUTED_PRICE_BY_LOCATION_CODE_FAILURE,
        payload
      });
    });
  });

  describe('LoadReset Action Test Cases', () => {
    it('should check correct type is used for  LoadReset action ', () => {
      const action = new LoadReset();
      expect({ ...action }).toEqual({
        type: MarketMaterialPriceActionTypes.LOAD_RESET
      });
    });
  });
  describe('LoadResetSelectedStock Action Test Cases', () => {
    it('should check correct type is used for  LoadResetSelectedStock action ', () => {
      const action = new LoadResetSelectedStock();
      expect({ ...action }).toEqual({
        type: MarketMaterialPriceActionTypes.LOAD_RESET_SELECTED_STOCK
      });
    });
  });
  describe('LoadResetLocationData Action Test Cases', () => {
    it('should check correct type is used for  LoadResetLocationData action ', () => {
      const action = new LoadResetLocationData();
      expect({ ...action }).toEqual({
        type: MarketMaterialPriceActionTypes.LOAD_RESET_LOCATION_DATA
      });
    });
  });

  describe('UpdateSelectedDate Action Test Cases', () => {
    it('should check correct type is used for  UpdateSelectedDate action ', () => {
      const payload = 10;
      const action = new UpdateSelectedDate(payload);
      expect({ ...action }).toEqual({
        type: MarketMaterialPriceActionTypes.UPDATE_SELECTED_DATE,
        payload
      });
    });
  });

  describe('UpdateSelectedStock Action Test Cases', () => {
    it('should check correct type is used for  UpdateSelectedStock action ', () => {
      const payload = 10;
      const action = new UpdateSelectedStock(payload);
      expect({ ...action }).toEqual({
        type: MarketMaterialPriceActionTypes.UPDATE_SELECTED_STOCK,
        payload
      });
    });
  });

  describe('UpdateSelectedMarketCode Action Test Cases', () => {
    it('should check correct type is used for  UpdateSelectedMarketCode action ', () => {
      const payload = 10;
      const action = new UpdateSelectedMarketCode(payload);
      expect({ ...action }).toEqual({
        type: MarketMaterialPriceActionTypes.UPDATE_MARKET_CODE_SELECTED,
        payload
      });
    });
  });

  describe('ComputePriceForAll Action Test Cases', () => {
    it('should check correct type is used for  ComputePriceForAll action ', () => {
      const payload: MarketDetails[] = [
        {
          materialCode: '',
          marketCode: 'KA',
          description: 'KARANATAKA',
          markupFactor: 1,
          addAmount: 10,
          deductAmount: 10,
          computedPrice: 200
        }
      ];
      const action = new ComputePriceForAll(payload);
      expect({ ...action }).toEqual({
        type: MarketMaterialPriceActionTypes.COMPUTE_PRICE_FOR_ALL,
        payload
      });
    });
  });

  describe('RemovePriceForAll Action Test Cases', () => {
    it('should check correct type is used for  RemovePriceForAll action ', () => {
      const payload: MarketDetails[] = [
        {
          materialCode: '',
          marketCode: 'KA',
          description: 'KARANATAKA',
          markupFactor: 1,
          addAmount: 10,
          deductAmount: 10,
          computedPrice: 200
        }
      ];
      const action = new RemovePriceForAll(payload);
      expect({ ...action }).toEqual({
        type: MarketMaterialPriceActionTypes.REMOVE_PRICE_FOR_ALL,
        payload
      });
    });
  });

  describe('UpdateAllSelected Action Test Cases', () => {
    it('should check correct type is used for  UpdateAllSelected action ', () => {
      const payload = true;
      const action = new UpdateAllSelected(payload);
      expect({ ...action }).toEqual({
        type: MarketMaterialPriceActionTypes.UPDATE_ALL_SELECTED,
        payload
      });
    });
  });

  describe('UpdateHasNewViewLocationPrice Action Test Cases', () => {
    it('should check correct type is used for  UpdateHasNewViewLocationPrice action ', () => {
      const payload = true;
      const action = new UpdateHasNewViewLocationPrice(payload);
      expect({ ...action }).toEqual({
        type: MarketMaterialPriceActionTypes.UPDATE_HAS_NEW_VIEW_LOCATION_PRICE,
        payload
      });
    });
  });
});
