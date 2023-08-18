import { MarketCodeFacade } from './market-code.facade';
import { MarketCodeState } from './market-code.state';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { initialState } from './market-code.reducer';
import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import {
  LoadMarketCodesListingPayload,
  SaveMarketCodeDetailsPayload,
  SaveMarketMaterialFactorsPayload
} from '@poss-web/shared/models';
import {
  LoadMarketCodeDetails,
  LoadMarketCodeDetailsBasedOnMarketCode,
  ResetMarketCodeDetails,
  SaveMarketCodeDetails,
  SaveMarketMaterialFactors,
  SearchMarketCode,
  SearchMarketCodeFailure,
  UpdateMarketCodeDetails,
  UpdateMarketMaterialFactors
} from './market-code.actions';
describe('MarketCode Facade Testing Suite', () => {
  const intialState: MarketCodeState = {
    error: null,
    isLoading: false,
    marketCodeListing: null,
    totalMarketCodes: null,
    marketCodeDetails: null,
    hasSavedMarketDetails: null,
    hasSavedMarketCodeFactors: null,
    hasUpdatedMarketDetails: null,
    hasUpdatedMarketCodeFacators: null,
    hasToggleButton: false
  };
  let marketCodeFacade: MarketCodeFacade;
  let store: Store;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), MarketCodeFacade]
    });
    marketCodeFacade = TestBed.inject(MarketCodeFacade);
    store = TestBed.inject(Store);
  });
  describe('Dispatch Actions action', () => {
    it('should call LOAD_MARKET_CODE_DETAILS', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const listPayload: LoadMarketCodesListingPayload = {
        pageIndex: 0,
        pageSize: 100
      };
      const action = new LoadMarketCodeDetails(listPayload);
      marketCodeFacade.loadMarketCodesLisitng(listPayload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call LOAD_MARKET_CODE_DETAILS_BASED_ON_MARKET_CODE', () => {
      spyOn(store, 'dispatch').and.returnValue({});

      const action = new LoadMarketCodeDetailsBasedOnMarketCode('MarketCode');
      marketCodeFacade.loadMarketDetailsBasedOnMarketCode('MarketCode');
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call SEARCH_MARKET_CODE', () => {
      spyOn(store, 'dispatch').and.returnValue({});

      const action = new SearchMarketCode('MAR');
      marketCodeFacade.searchMarketCode('MAR');
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call RESET_MARKET_CODE_DETAILS', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new ResetMarketCodeDetails();
      marketCodeFacade.resetMarketCodeDetails();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call SAVE_MARKET_CODE_DETAILS', () => {
      const savePayload: SaveMarketCodeDetailsPayload = {
        marketCode: 'MAR',
        description: 'Market Code is MAR',
        isActive: true
      };
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new SaveMarketCodeDetails(savePayload);
      marketCodeFacade.saveMarketCodeDetails(savePayload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call SEARCH_MARKET_CODE', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: SaveMarketMaterialFactorsPayload = {
        marketCode: 'MAR',
        marketMarkupFactors: [
          {
            addAmount: 10,
            deductAmount: 100,
            markupFactor: 100,
            metalTypeCode: 'gold'
          }
        ]
      };
      const action = new SaveMarketMaterialFactors(payload);
      marketCodeFacade.saveMarketMaterialFacators(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call UPDATE_MARKET_CODE_DETAILS', () => {
      const updateStaus = {
        marketCode: 'MAR',
        updateMarketDetails: {
          isActive: true
        }
      };
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new UpdateMarketCodeDetails(updateStaus);
      marketCodeFacade.updateMarketCodeDetails(updateStaus);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call UPDATE_MARKET_MATERIAL_FACTORS', () => {
      const payload: SaveMarketMaterialFactorsPayload = {
        marketCode: 'MAR',
        marketMarkupFactors: [
          {
            addAmount: 10,
            deductAmount: 100,
            markupFactor: 100,
            metalTypeCode: 'gold'
          }
        ]
      };
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new UpdateMarketMaterialFactors(payload);
      marketCodeFacade.updateMarketMaterialFactors(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
  });
  describe('Access Selector action', () => {
    it('should access the get marketcode details listing', () => {
      expect(marketCodeFacade.getMarketCodes()).toEqual(
        marketCodeFacade['marketCodesListing$']
      );
    });
    it('should access the get total maret codes', () => {
      expect(marketCodeFacade.getTotalMarketCodesCount()).toEqual(
        marketCodeFacade['totalMarketCodes$']
      );
    });
    it('should access the get error', () => {
      expect(marketCodeFacade.getError()).toEqual(
        marketCodeFacade['hasError$']
      );
    });
    it('should access the get hassaved', () => {
      expect(marketCodeFacade.getHasSavedMarketCodeDetails()).toEqual(
        marketCodeFacade['hasSavedMarketCodeDetails$']
      );
    });
    it('should access the get hasupdated', () => {
      expect(marketCodeFacade.getHasUpdatedMarketCodeDetails()).toEqual(
        marketCodeFacade['hasUpdatedMarketCodeDetails$']
      );
    });
    it('should access the get hasupdated marketmaterial factors', () => {
      expect(marketCodeFacade.getHasUpdatedMarketMaterialFacators()).toEqual(
        marketCodeFacade['hasUpdatedMarketMaterialFacators$']
      );
    });
    it('should access the get hassaved marketmaterial factors', () => {
      expect(marketCodeFacade.getSavedMarketMaterialFacators()).toEqual(
        marketCodeFacade['hassavedMarketMaterialFacators$']
      );
    });
    it('should access the get isLoading', () => {
      expect(marketCodeFacade.getIsLoading()).toEqual(
        marketCodeFacade['isLoading$']
      );
    });
    it('should access the get marketcode details', () => {
      expect(marketCodeFacade.getMarketCodeDetailsBasedOnMarketCode()).toEqual(
        marketCodeFacade['marketCodeDetails$']
      );
    });
  });
});
