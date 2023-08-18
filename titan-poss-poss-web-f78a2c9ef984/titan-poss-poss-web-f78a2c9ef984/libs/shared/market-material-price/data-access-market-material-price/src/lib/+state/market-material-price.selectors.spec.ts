// you will need to assert that the store is calling the right selector function.

import { MaterialPriceList, CustomErrors } from '@poss-web/shared/models';

import { initialState } from './market-material-price.reducer';
import * as selectors from './market-material-price.selectors';

import { MarketMaterialPriceState } from './market-material-price.state';

describe('MarketMaterialPriceState selector Testing Suite', () => {
  const error: CustomErrors = {
    error: null,
    code: '',
    message: '',
    traceId: '',
    timeStamp: ''
  };

  describe('Testing MarketMaterialPriceState related Selectors', () => {
    it('selectMetalPriceDetails Should return the list of material price list', () => {
      const mterialPriceList: MaterialPriceList[] = [
        {
          price: 1000,
          priceType: 'D',
          remarks: 'remarks',
          id: '1',
          time: '10',
          createdDate: new Date()
        }
      ];

      const state: MarketMaterialPriceState = {
        ...initialState,
        metalPriceDetails: mterialPriceList
      };
      expect(
        selectors.MarketMaterialPriceSelectors.selectMetalPriceDetails.projector(
          state
        )
      ).toEqual(mterialPriceList);
    });

    it('selectIsloading Should return the true or false', () => {
      const state: MarketMaterialPriceState = {
        ...initialState,
        isLoading: true
      };
      expect(
        selectors.MarketMaterialPriceSelectors.selectIsLoading.projector(state)
      ).toEqual(true);
    });
    it('selectError Should return the error object', () => {
      const state: MarketMaterialPriceState = {
        ...initialState,
        error: {
          error: null,
          timeStamp: '',
          traceId: '',
          code: '',
          message: ''
        }
      };
      expect(
        selectors.MarketMaterialPriceSelectors.selectError.projector(state)
      ).toEqual(error);
    });

    it('selectHasSaved Should return the true or false', () => {
      const state: MarketMaterialPriceState = {
        ...initialState,
        hasSaved: true
      };
      expect(
        selectors.MarketMaterialPriceSelectors.selectHasSaved.projector(state)
      ).toEqual(true);
    });

    it('selectTotalCount  Should return total elements', () => {
      const state: MarketMaterialPriceState = {
        ...initialState,
        totalElements: 10
      };
      expect(
        selectors.MarketMaterialPriceSelectors.selectTotalCount.projector(state)
      ).toEqual(10);
    });
    it('selectHasNewViewLocationPriceSuccess ', () => {
      const state: MarketMaterialPriceState = {
        ...initialState,
        hasNewViewLocationPriceSuccess: true
      };
      expect(
        selectors.MarketMaterialPriceSelectors.selectHasNewViewLocationPriceSuccess.projector(
          state
        )
      ).toEqual(true);
    });

    it('selcetLocationDetailsCount  Should return total elements', () => {
      const state: MarketMaterialPriceState = {
        ...initialState,
        locationDetailsCount: 10
      };
      expect(
        selectors.MarketMaterialPriceSelectors.selcetLocationDetailsCount.projector(
          state
        )
      ).toEqual(10);
    });

    it('selcetComputedPriceSearchResultCount  Should return total elements', () => {
      const state: MarketMaterialPriceState = {
        ...initialState,
        computedPriceSearchResultCount: 10
      };
      expect(
        selectors.MarketMaterialPriceSelectors.selcetComputedPriceSearchResultCount.projector(
          state
        )
      ).toEqual(10);
    });

    it('selectDate  ', () => {
      const state: MarketMaterialPriceState = {
        ...initialState,
        date: 10
      };
      expect(
        selectors.MarketMaterialPriceSelectors.selectDate.projector(state)
      ).toEqual(10);
    });

    it('selectAllSelected  ', () => {
      const state: MarketMaterialPriceState = {
        ...initialState,
        allSelected: true
      };
      expect(
        selectors.MarketMaterialPriceSelectors.selectAllSelected.projector(
          state
        )
      ).toEqual(true);
    });

    it('selecthasMarketDetailsBasedOnMaterialLoaded  ', () => {
      const state: MarketMaterialPriceState = {
        ...initialState,
        hasMarketDetailsBasedOnMaterialLoaded: true
      };
      expect(
        selectors.MarketMaterialPriceSelectors.selecthasMarketDetailsBasedOnMaterialLoaded.projector(
          state
        )
      ).toEqual(true);
    });
  });
});
