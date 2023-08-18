import * as selectors from './location-master.selectors';
import {
  BaseCurrencyTypes,
  BrandSummary,
  LocationListingPayload,
  LocationMasterDetails,
  LocationMasterDropdownList,
  LocationTypes,
  MarketCodeTypes,
  OwnerTypes,
  RegionSummary,
  StateTypes,
  Towns
} from '@poss-web/shared/models';
import { initialState } from './location-master.reducer';
import { LocationMasterState } from './location-master.state';

describe('Tax Class Selector Testing Suite', () => {
  const payload: LocationMasterDetails = {
    locationCode: 'Code'
  };

  describe('Testing selectIsLoading Related Selectors', () => {
    it('should return selectIsLoading Selector', () => {
      const state: LocationMasterState = {
        ...initialState,
        isLoading: true
      };
      expect(
        selectors.LocationMasterSelectors.selectIsLoading.projector(state)
      ).toEqual(true);
    });
  });

  describe('Testing selectIsSaved    Related Selectors', () => {
    it('should return selectIsSaved    Selector', () => {
      const payload: StateTypes[] = [
        {
          id: '1',
          name: 'Name'
        }
      ];
      const state: LocationMasterState = {
        ...initialState,
        isSaved: true
      };
      expect(
        selectors.LocationMasterSelectors.selectIsSaved.projector(state)
      ).toEqual(true);
    });
  });

  describe('Testing selectLocationCFATypes Related Selectors', () => {
    it('should return selectLocationCFATypes Selector', () => {
      const payload: StateTypes[] = [
        {
          id: '1',
          name: 'Name'
        }
      ];
      const state: LocationMasterState = {
        ...initialState,
        LocationCFATypes: payload
      };
      expect(
        selectors.LocationMasterSelectors.selectLocationCFATypes.projector(
          state
        )
      ).toEqual(payload);
    });
  });

  describe('Testing selectCountryCode Related Selectors', () => {
    it('should return selectCountryCode Selector', () => {
      const payload: StateTypes[] = [
        {
          id: '1',
          name: 'Name'
        }
      ];
      const state: LocationMasterState = {
        ...initialState,
        countryCode: payload
      };
      expect(
        selectors.LocationMasterSelectors.selectCountryCode.projector(state)
      ).toEqual(payload);
    });
  });

  describe('Testing selectRefundMode   Related Selectors', () => {
    it('should return selectRefundMode   Selector', () => {
      const payload: StateTypes[] = [
        {
          id: '1',
          name: 'Name'
        }
      ];
      const state: LocationMasterState = {
        ...initialState,
        refundMode: payload
      };
      expect(
        selectors.LocationMasterSelectors.selectRefundMode.projector(state)
      ).toEqual(payload);
    });
  });

  describe('Testing selectInvoicetype  Related Selectors', () => {
    it('should return selectInvoicetype  Selector', () => {
      const payload: StateTypes[] = [
        {
          id: '1',
          name: 'Name'
        }
      ];
      const state: LocationMasterState = {
        ...initialState,
        invoicetype: payload
      };
      expect(
        selectors.LocationMasterSelectors.selectInvoicetype.projector(state)
      ).toEqual(payload);
    });
  });

  describe('Testing selectLocationSize Related Selectors', () => {
    it('should return selectLocationSize Selector', () => {
      const payload: StateTypes[] = [
        {
          id: '1',
          name: 'Name'
        }
      ];
      const state: LocationMasterState = {
        ...initialState,
        locationSize: payload
      };
      expect(
        selectors.LocationMasterSelectors.selectLocationSize.projector(state)
      ).toEqual(payload);
    });
  });

  describe('Testing selectCurrencyTypes    Related Selectors', () => {
    it('should return selectCurrencyTypes    Selector', () => {
      const payload: BaseCurrencyTypes[] = [
        {
          id: '1',
          name: 'Name'
        }
      ];
      const state: LocationMasterState = {
        ...initialState,
        currencyTypes: payload
      };
      expect(
        selectors.LocationMasterSelectors.selectCurrencyTypes.projector(state)
      ).toEqual(payload);
    });
  });

  describe('Testing selectBaseCurrencyTypes   Related Selectors', () => {
    it('should return selectBaseCurrencyTypes   Selector', () => {
      const payload: BaseCurrencyTypes[] = [
        {
          id: '1',
          name: 'Name'
        }
      ];
      const state: LocationMasterState = {
        ...initialState,
        baseCurrencyTypes: payload
      };
      expect(
        selectors.LocationMasterSelectors.selectBaseCurrencyTypes.projector(
          state
        )
      ).toEqual(payload);
    });
  });

  describe('Testing selectMarketCode  Related Selectors', () => {
    it('should return selectMarketCode  Selector', () => {
      const payload: MarketCodeTypes = {
        id: '1',
        name: 'Name'
      };
      const state: LocationMasterState = {
        ...initialState,
        marketTypes: payload
      };
      expect(
        selectors.LocationMasterSelectors.selectMarketCode.projector(state)
      ).toEqual(payload);
    });
  });

  describe('Testing selectBrands Related Selectors', () => {
    it('should return selectBrands Selector', () => {
      const payload: LocationMasterDropdownList[] = [
        {
          id: '1',
          name: 'name'
        }
      ];
      const state: LocationMasterState = {
        ...initialState,
        brands: payload
      };
      expect(
        selectors.LocationMasterSelectors.selectBrands.projector(state)
      ).toEqual(payload);
    });
  });

  describe('Testing selectSubBrand  Related Selectors', () => {
    it('should return selectSubBrand  Selector', () => {
      const payload: BrandSummary[] = [
        {
          brandCode: 'code',
          description: 'desc'
        }
      ];
      const state: LocationMasterState = {
        ...initialState,
        subBrands: payload
      };
      expect(
        selectors.LocationMasterSelectors.selectSubBrand.projector(state)
      ).toEqual(payload);
    });
  });

  describe('Testing selectRegions Related Selectors', () => {
    it('should return selectRegions Selector', () => {
      const payload: LocationMasterDropdownList[] = [
        {
          id: '1',
          name: 'name'
        }
      ];
      const state: LocationMasterState = {
        ...initialState,
        regions: payload
      };
      expect(
        selectors.LocationMasterSelectors.selectRegions.projector(state)
      ).toEqual(payload);
    });
  });

  describe('Testing selectSubRegions Related Selectors', () => {
    it('should return selectSubRegions Selector', () => {
      const payload: RegionSummary[] = [
        {
          description: 'Desc',
          regionCode: 'code'
        }
      ];
      const state: LocationMasterState = {
        ...initialState,
        subRegions: payload
      };
      expect(
        selectors.LocationMasterSelectors.selectSubRegions.projector(state)
      ).toEqual(payload);
    });
  });

  describe('Testing selectOwnerInfo   Related Selectors', () => {
    it('should return selectOwnerInfo   Selector', () => {
      const payload: OwnerTypes = {
        id: '1',
        name: 'name'
      };
      const state: LocationMasterState = {
        ...initialState,
        ownerInfo: payload
      };
      expect(
        selectors.LocationMasterSelectors.selectOwnerInfo.projector(state)
      ).toEqual(payload);
    });
  });

  describe('Testing selectError  Related Selectors', () => {
    it('should return selectError  Selector', () => {
      const state: LocationMasterState = {
        ...initialState,
        error: null
      };
      expect(
        selectors.LocationMasterSelectors.selectError.projector(state)
      ).toEqual(null);
    });
  });

  describe('Testing selectTotalCount Related Selectors', () => {
    it('should return selectTotalCount Selector', () => {
      const state: LocationMasterState = {
        ...initialState,
        totalCount: 1
      };
      expect(
        selectors.LocationMasterSelectors.selectTotalCount.projector(state)
      ).toEqual(1);
    });
  });

  describe('Testing selectTotalCount Related Selectors', () => {
    it('should return selectTotalCount Selector', () => {
      const state: LocationMasterState = {
        ...initialState,
        isCopySuccess: true
      };
      expect(
        selectors.LocationMasterSelectors.selectIscopySuccess.projector(state)
      ).toEqual(true);
    });
  });

  describe('Testing selectTotalCount Related Selectors', () => {
    it('should return selectTotalCount Selector', () => {
      const state: LocationMasterState = {
        ...initialState,
        locationDetails: payload
      };
      expect(
        selectors.LocationMasterSelectors.selectLocationDetails.projector(state)
      ).toEqual(payload);
    });
  });

  describe('Testing selectLocationTypes Related Selectors', () => {
    const data: LocationTypes = {
      code: 'Code',
      value: 'Value'
    };
    it('should return selectLocationTypes Selector', () => {
      const state: LocationMasterState = {
        ...initialState,
        locationTypes: data
      };
      expect(
        selectors.LocationMasterSelectors.selectLocationTypes.projector(state)
      ).toEqual(data);
    });
  });

  describe('Testing selectTowns Related Selectors', () => {
    const data: Towns[] = [
      {
        id: '1',
        name: 'name',
        state_id: '2'
      }
    ];
    it('should return selectTowns Selector', () => {
      const state: LocationMasterState = {
        ...initialState,
        towns: data
      };
      expect(
        selectors.LocationMasterSelectors.selectTowns.projector(state)
      ).toEqual(data);
    });
  });

  describe('Testing selectStates Related Selectors', () => {
    const data: StateTypes[] = [
      {
        id: '1',
        name: 'name'
      }
    ];
    it('should return selectStates Selector', () => {
      const state: LocationMasterState = {
        ...initialState,
        stateTypes: data
      };
      expect(
        selectors.LocationMasterSelectors.selectStates.projector(state)
      ).toEqual(data);
    });
  });
});
