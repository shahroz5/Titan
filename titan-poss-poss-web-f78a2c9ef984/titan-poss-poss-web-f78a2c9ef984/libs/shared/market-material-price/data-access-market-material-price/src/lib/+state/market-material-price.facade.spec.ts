import {
  OfferDetailResponse,
  UpdateCardDetails,
  LoadCardDetailsPayload,
  MaterialPricePayload,
  LoadMarketBasedOnMaterial,
  MarketDetails,
  ViewLocationPayload,
  SavePricePayload,
  LoadSavedBasePrice,
  SearchMarketCodePayload,
  SearchSavedLocationPriceByLocationPayload,
  SearchComputedPriceByLocationPayload
} from '@poss-web/shared/models';
import { Store } from '@ngrx/store';

import { TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';

import { MarketMaterialPriceFacade } from './market-material-price.facade';

import {
  LoadReset,
  LoadMetalPriceDetails,
  LoadMarketDetailsBasedOnMaterial,
  RemovePriceForAll,
  ComputePriceForAll,
  UpdateAllSelected,
  UpdateHasNewViewLocationPrice,
  UpdateCheckBox,
  UpdateSelectedStock,
  LoadResetSelectedStock,
  LoadResetLocationData,
  UpdateSelectedDate,
  ComputeBasePriceForForcedType,
  ViewLocationPrice,
  SavePrice,
  LoadSavedPrice,
  SearchMarketCode,
  SearchComputedPriceByLocationCode,
  SearchSavedLocationPriceByLocationCode
} from './market-material-price.actions';
import { MarketMaterialPriceState } from './market-material-price.state';
import {
  marketAdaptor,
  locationDetailAdaptor,
  selectedStockAdaptor
} from './market-material-price.entity';

describe(' marketMaterialPriceFacade Testing Suite', () => {
  const initialState: MarketMaterialPriceState = {
    error: null,
    materialPriceType: null,
    materialTypes: null,
    metalPriceDetails: null,
    isLoading: null,
    marketDetailsBasedOnMaterial: marketAdaptor.getInitialState(),
    totalElements: null,
    locationDetails: locationDetailAdaptor.getInitialState(),
    hasSaved: null,
    hasNewViewLocationPriceSuccess: false,
    locationDetailsCount: null,
    computedPriceSearchResult: locationDetailAdaptor.getInitialState(),
    computedPriceSearchResultCount: null,
    date: null,
    selectedStock: selectedStockAdaptor.getInitialState(),
    hasMarketDetailsBasedOnMaterialLoaded: false,
    allSelected: null,
    isValueResetToZero: false
  };

  let marketMaterialPriceFacade: MarketMaterialPriceFacade;
  let store: MockStore<MarketMaterialPriceFacade>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), MarketMaterialPriceFacade]
    });
    store = TestBed.inject<any>(Store);
    marketMaterialPriceFacade = TestBed.inject<any>(MarketMaterialPriceFacade);
  });

  describe('Dispatch Actions action', () => {
    it('should call LOAD_METAL_PRICE_DETAILS action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: MaterialPricePayload = {
        applicableDate: '',
        configId: '1',
        materialCode: 'j'
      };
      const action = new LoadMetalPriceDetails(payload);
      marketMaterialPriceFacade.loadMetalPriceDetails(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LOAD_MARKET_DETAILS_BASED_ON_MATERIAL action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: LoadMarketBasedOnMaterial = {
        data: { materialCode: 'j', pageIndex: 1, pageSize: 10 }
      };
      const action = new LoadMarketDetailsBasedOnMaterial(payload);
      marketMaterialPriceFacade.loadMarketDetails(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call SEARCH_SAVED_LOCATION_PRICE_BY_LOCATION_CODE action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: SearchSavedLocationPriceByLocationPayload = {
        id: '1',
        locationCode: 'URB',
        materialCode: 'J',
        pageIndex: 1,
        pageSize: 10
      };
      const action = new SearchSavedLocationPriceByLocationCode(payload);
      marketMaterialPriceFacade.searchSavedLocationPriceByMarketCode(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call SEARCH_COMPUTED_PRICE_BY_LOCATION_CODE action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: SearchComputedPriceByLocationPayload = {
        locationCode: 'URB',
        materialCode: 'J',
        pageIndex: 1,
        pageSize: 10,
        data: {}
      };
      const action = new SearchComputedPriceByLocationCode(payload);
      marketMaterialPriceFacade.searchComputedPriceByMarketCode(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call SEARCH_MARKET_CODE action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: SearchMarketCodePayload = {
        data: {
          materialCode: 'j',
          marketCode: ''
        },
        selectedStock: []
      };

      const action = new SearchMarketCode(payload);
      marketMaterialPriceFacade.searchMaterialCode(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LOAD_SAVED_BASE_PRICE action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: LoadSavedBasePrice = {
        pageSize: 10,
        pageIndex: 1,
        materialCode: 'J',
        id: '1'
      };
      const action = new LoadSavedPrice(payload);
      marketMaterialPriceFacade.loadSavedBasePrice(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call SAVE_PRICE action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: SavePricePayload = {
        materialCode: 'J',
        data: {
          marketCodes: [],
          basePrice: 100,
          applicableDate: 100,
          priceTypeCode: 'D',
          remarks: 'remarks'
        }
      };
      const action = new SavePrice(payload);
      marketMaterialPriceFacade.savePrice(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call VIEW_LOCATION_PRICE action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: ViewLocationPayload = {
        pageIndex: 1,
        pageSize: 10,
        materialCode: 'J',
        data: {
          marketCodes: [],
          basePrice: 100,
          applicableDate: 100,
          priceTypeCode: 'D'
        }
      };
      const action = new ViewLocationPrice(payload);
      marketMaterialPriceFacade.loadLocationPrice(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call COMPUTE_BASE_PRICE action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload = '';
      const action = new ComputeBasePriceForForcedType(payload);
      marketMaterialPriceFacade.computeBasePriceForForcedType(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call UPDATE_SELECTED_DATE action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload = '1';
      const action = new UpdateSelectedDate(payload);
      marketMaterialPriceFacade.updateSelectedDate(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call LOAD_RESET action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: OfferDetailResponse = {
        id: '1',
        data: {
          addOffers: [
            {
              maxDiscountPercent: 100,
              maxInvoiceAmt: 100,
              maxSwipeAmt: 100,
              minInvoiceAmt: 100,
              minSwipeAmt: 100,
              discountAmt: '100',
              discountPercent: 100,
              id: '1',
              isCashbackAmount: true
            }
          ]
        }
      };
      const action = new LoadReset();
      marketMaterialPriceFacade.loadReset();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call LOAD_RESET_LOCATION_DATA action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: UpdateCardDetails = {
        id: '11',
        updateCards: ''
      };
      const action = new LoadResetLocationData();
      marketMaterialPriceFacade.loadResetLocationData();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call LOAD_RESET_SELECTED_STOCK action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: LoadCardDetailsPayload = {
        id: '1',
        pageEvent: {
          pageIndex: 1,
          pageSize: 2,
          length: 0
        }
      };
      const action = new LoadResetSelectedStock();
      marketMaterialPriceFacade.loadResetSelectedStock();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call UPDATE_SELECTED_STOCK action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload = '1';
      const action = new UpdateSelectedStock(payload);
      marketMaterialPriceFacade.updateSelectedStock(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call UPDATE_CHECKBOX action', () => {
      spyOn(store, 'dispatch').and.returnValue({});

      const action = new UpdateCheckBox('');
      marketMaterialPriceFacade.updateCheckBox('');
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call UPDATE_HAS_NEW_VIEW_LOCATION_PRICE action', () => {
      spyOn(store, 'dispatch').and.returnValue({});

      const action = new UpdateHasNewViewLocationPrice(true);
      marketMaterialPriceFacade.updateHasNewViewLocationPrice(true);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call UPDATE_ALL_SELECTED action', () => {
      spyOn(store, 'dispatch').and.returnValue({});

      const action = new UpdateAllSelected(true);
      marketMaterialPriceFacade.updateAllSelected(true);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call COMPUTE_PRICE_FOR_ALL action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: MarketDetails[] = [
        {
          materialCode: 'J',
          deductAmount: 1,
          marketCode: 'KA',
          description: 'test',
          addAmount: 100,
          markupFactor: 1,
          computedPrice: 100,
          isChecked: true
        }
      ];
      const action = new ComputePriceForAll(payload);
      marketMaterialPriceFacade.loadComputePriceForAll(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call REMOVE_PRICE_FOR_ALL action', () => {
      const payload: MarketDetails[] = [
        {
          materialCode: 'J',
          deductAmount: 1,
          marketCode: 'KA',
          description: 'test',
          addAmount: 100,
          markupFactor: 1,
          computedPrice: 100,
          isChecked: true
        }
      ];
      spyOn(store, 'dispatch').and.returnValue({});

      const action = new RemovePriceForAll(payload);
      marketMaterialPriceFacade.loadRemovePriceForAll(payload, '');
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
  });

  describe('Access Selector action', () => {
    it('should access the getAllSelected selector action', () => {
      expect(marketMaterialPriceFacade.getAllSelected()).toEqual(
        marketMaterialPriceFacade['allSelected$']
      );
    });

    it('should access the gethasMarketDetailsBasedOnMaterialLoaded selector action', () => {
      expect(
        marketMaterialPriceFacade.gethasMarketDetailsBasedOnMaterialLoaded()
      ).toEqual(
        marketMaterialPriceFacade['hasMarketDetailsBasedOnMaterialLoaded$']
      );
    });

    it('should access the getSelectedStock selector action', () => {
      expect(marketMaterialPriceFacade.getSelectedStock()).toEqual(
        marketMaterialPriceFacade['selectSelectedStock$']
      );
    });

    it('should access the getHasSaved selector action', () => {
      expect(marketMaterialPriceFacade.getHasSaved()).toEqual(
        marketMaterialPriceFacade['selctedHasSaved$']
      );
    });

    it('should access the getSelectedDate selector action', () => {
      expect(marketMaterialPriceFacade.getSelectedDate()).toEqual(
        marketMaterialPriceFacade['selctedDate$']
      );
    });

    it('should access the getcomputedPriceSearchResultCount selector action', () => {
      expect(
        marketMaterialPriceFacade.getcomputedPriceSearchResultCount()
      ).toEqual(marketMaterialPriceFacade['computedPriceSearchResultCount$']);
    });

    it('should access the getComputedPriceSearchResult selector action', () => {
      expect(marketMaterialPriceFacade.getComputedPriceSearchResult()).toEqual(
        marketMaterialPriceFacade['computedPriceSearchResult$']
      );
    });

    it('should access the getLocationDetailsCount selector action', () => {
      expect(marketMaterialPriceFacade.getLocationDetailsCount()).toEqual(
        marketMaterialPriceFacade['locationDetailsCount$']
      );
    });

    it('should access the getHasNewViewLocationPriceSuccess selector action', () => {
      expect(
        marketMaterialPriceFacade.getHasNewViewLocationPriceSuccess()
      ).toEqual(marketMaterialPriceFacade['hasNewViewLocationPriceSuccess$']);
    });
    it('should access the getLocationDetails selector action', () => {
      expect(marketMaterialPriceFacade.getLocationDetails()).toEqual(
        marketMaterialPriceFacade['locatonDetails$']
      );
    });

    it('should access the getError selector action', () => {
      expect(marketMaterialPriceFacade.getError()).toEqual(
        marketMaterialPriceFacade['error$']
      );
    });

    it('should access the getIsLoading selector action', () => {
      expect(marketMaterialPriceFacade.getIsLoading()).toEqual(
        marketMaterialPriceFacade['isLoading$']
      );
    });
    it('should access the getMetalPriceDetails selector action', () => {
      expect(marketMaterialPriceFacade.getMetalPriceDetails()).toEqual(
        marketMaterialPriceFacade['metalPriceDetails$']
      );
    });
    it('should access the getMarketDetailsBasedOnMaterial selector action', () => {
      expect(
        marketMaterialPriceFacade.getMarketDetailsBasedOnMaterial()
      ).toEqual(marketMaterialPriceFacade['marketDetailsBasedOnMaterial$']);
    });
    it('should access the getTotalMarketCodesCount selector action', () => {
      expect(marketMaterialPriceFacade.getTotalMarketCodesCount()).toEqual(
        marketMaterialPriceFacade['totalElements$']
      );
    });
  });
});
