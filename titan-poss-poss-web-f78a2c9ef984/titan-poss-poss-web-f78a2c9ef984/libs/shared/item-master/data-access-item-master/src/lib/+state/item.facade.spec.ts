import { Store } from '@ngrx/store';
import { ItemListingState } from './item.state';
import { ItemFacade } from './item.facade';
import {
  LoadItemByItemCode,
  // SearchItem,
  LoadStones,
  LoadFilterItemDetails,
  StoreFilter,
  ResetFilter,
  ResetItemByItemCode,
  LoadPricingType,
  LoadCFAProductCode
} from './item.actions';
import { TestBed, inject } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import {
  ItemFilterPayload,
  LoadItemListingPayload,
  ItemFilter
} from '@poss-web/shared/models';
describe('Item facade Testing Suite', () => {
  const initialState: ItemListingState = {
    itemListing: null,
    itemDetails: null,
    totalItemDetails: 0,
    isLoading: false,
    error: null,
    itemStones: null,
    itemFilter: null,
    filterPayload: null,
    pricingType: [],
    CFAproductCode: []
  };

  let itemFacade: ItemFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), ItemFacade]
    });

    itemFacade = TestBed.inject(ItemFacade);
  });

  describe('Access Selector action', () => {
    it('should access  getError() selector action', () => {
      expect(itemFacade.getError()).toEqual(itemFacade['itemError$']);
    });
    it('should access  getisLoading() selector action', () => {
      expect(itemFacade.getisLoading()).toEqual(itemFacade['isLoading$']);
    });
    it('should access  getTotalitemDetails() selector action', () => {
      expect(itemFacade.getTotalitemDetails()).toEqual(
        itemFacade['totalItemDetails$']
      );
    });
    it('should access  getitemDetailsListing() selector action', () => {
      expect(itemFacade.getitemDetailsListing()).toEqual(
        itemFacade['itemDetailsListing$']
      );
    });
    it('should access  getitemDetailsByitemCode() selector action', () => {
      expect(itemFacade.getitemDetailsByitemCode()).toEqual(
        itemFacade['itemDetailsByitemCode$']
      );
    });
    it('should access  getItemStones() selector action', () => {
      expect(itemFacade.getItemStones()).toEqual(itemFacade['itemStones$']);
    });
    it('should access  getItemFilter() selector action', () => {
      expect(itemFacade.getItemFilter()).toEqual(itemFacade['itemFilter$']);
    });
    it('should access  getPricingTypes() selector action', () => {
      expect(itemFacade.getPricingTypes()).toEqual(itemFacade['pricingTypes$']);
    });
    it('should access  getCFAproductCode() selector action', () => {
      expect(itemFacade.getCFAproductCode()).toEqual(
        itemFacade['CFAproductCodes$']
      );
    });
  });

  describe(' loadStoneTypeListing ', () => {
    it('should dispatch LoadStoneTypeDetails  action', inject(
      [Store],
      store => {
        const parameter1: LoadItemListingPayload = {
          pageIndex: 0,
          pageSize: 100
        };
        const parameter2: ItemFilterPayload = {
          fromStdValue: 10,
          fromStdWeight: 10,
          fromStoneCharges: 10,
          itemCode: 'ABC',
          pricingType: 'ABC',
          productCategoryCode: 'ABC',
          productGroupCode: 'ABC',
          toStdValue: 100,
          toStdWeight: 100,
          toStoneCharges: 100
        };
        const parameters: ItemFilter = {
          filterPayload: parameter2,
          paginate: parameter1
        };
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new LoadFilterItemDetails(parameters);
        itemFacade.loadItemFilter(parameters);
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });
  describe(' loadItemDetailsByitemCode ', () => {
    it('should dispatch loadItemDetailsByitemCode  action', inject(
      [Store],
      store => {
        const parameters = 'ABC';
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new LoadItemByItemCode(parameters);
        itemFacade.loadItemDetailsByitemCode(parameters);
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });

  // describe(' SearchItem ', () => {
  //   it('should dispatch SearchItem  action', inject([Store], store => {
  //     const parameters = 'ABC';
  //     const storeSpy = spyOn(store, 'dispatch').and.callThrough();
  //     const expectedAction = new SearchItem(parameters);
  //     itemFacade.searchItem(parameters);
  //     expect(storeSpy).toHaveBeenCalledWith(expectedAction);
  //   }));
  // });
  describe(' LoadStones ', () => {
    it('should dispatch LoadStones  action', inject([Store], store => {
      const parameters = 'ABC';
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadStones(parameters);
      itemFacade.loadItemStones(parameters);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe(' StoreItemFilter ', () => {
    it('should dispatch StoreItemFilter  action', inject([Store], store => {
      const parameters = {
        fromStdValue: 10,
        fromStdWeight: 10,
        fromStoneCharges: 10,
        itemCode: 'ABC',
        pricingType: 'ABC',
        productCategoryCode: 'ABC',
        productGroupCode: 'ABC',
        toStdValue: 100,
        toStdWeight: 100,
        toStoneCharges: 100
      };
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new StoreFilter(parameters);
      itemFacade.StoreItemFilter(parameters);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });
  describe(' LoadPricingType ', () => {
    it('should dispatch LoadPricingType  action', inject([Store], store => {
      const payload = 'PRICINGTYPE';
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadPricingType(payload);
      itemFacade.loadPricingTypes(payload);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });
  describe(' LoadCFAProductCode ', () => {
    it('should dispatch LoadCFAProductCode  action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadCFAProductCode();
      itemFacade.loadCFAproductCodes();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });
  describe(' ResetItemDetailsByitemCode ', () => {
    it('should dispatch ResetItemDetailsByitemCode  action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new ResetItemByItemCode();
        itemFacade.resetItemDetailsByitemCode();
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });
  describe(' ResetFilter ', () => {
    it('should dispatch ResetFilter  action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new ResetFilter();
      itemFacade.loadResetFilter();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });
});
