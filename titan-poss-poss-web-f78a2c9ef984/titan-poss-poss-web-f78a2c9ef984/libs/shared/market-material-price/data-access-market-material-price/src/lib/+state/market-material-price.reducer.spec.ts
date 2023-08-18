//you should simply assert that you get the right state given the provided inputs.

import * as actions from './market-material-price.actions';

import {
  SavePricePayload,
  MaterialPricePayload,
  MaterialPriceList,
  LoadMarketBasedOnMaterial,
  MarketListing,
  MarketDetails,
  ViewLocationPayload,
  LocationDetailsList,
  LoadSavedBasePrice,
  SearchMarketCodePayload,
  SearchSavedLocationPriceByLocationPayload,
  SearchComputedPriceByLocationPayload
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  marketMaterialPriceReducer,
  initialState
} from './market-material-price.reducer';
import { MarketMaterialPriceState } from './market-material-price.state';
import {
  marketAdaptor,
  locationDetailAdaptor,
  selectedStockAdaptor
} from './market-material-price.entity';

describe('marketMaterialPriceReducer reducer Testing Suite', () => {
  let testState = initialState;
  const marketDetails: MarketDetails = {
    materialCode: '',
    marketCode: 'KA',
    description: 'KARANATAKA',
    markupFactor: 1,
    addAmount: 10,
    deductAmount: 10,
    computedPrice: 200,
    isChecked: true
  };

  describe('Testing LoadMetalPriceDetails ', () => {
    beforeEach(() => {});
    it('Load LoadMetalPriceDetails should set the isLoading to true', () => {
      const payload: MaterialPricePayload = {
        applicableDate: 10,
        materialCode: 'j',
        configId: '1'
      };

      const action = new actions.LoadMetalPriceDetails(payload);

      const result: MarketMaterialPriceState = marketMaterialPriceReducer(
        testState,
        action
      );

      expect(result.isLoading).toBe(true);
    });
    it('LoadMetalPriceDetailsSuccess should return list of cashback list', () => {
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

      const action = new actions.LoadMetalPriceDetailsSuccess(payload);

      const result: MarketMaterialPriceState = marketMaterialPriceReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.metalPriceDetails.length).toBe(1);
    });
    it('LoadMetalPriceDetailsFailure should return error', () => {
      const action = new actions.LoadMetalPriceDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: MarketMaterialPriceState = marketMaterialPriceReducer(
        testState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadMarketDetailsBasedOnMaterial Functionality ', () => {
    beforeEach(() => {});
    it('LoadMarketDetailsBasedOnMaterial ', () => {
      const payload: LoadMarketBasedOnMaterial = {
        data: {
          materialCode: 'J',
          pageSize: 10,
          pageIndex: 1
        }
      };
      const action = new actions.LoadMarketDetailsBasedOnMaterial(payload);

      const result: MarketMaterialPriceState = marketMaterialPriceReducer(
        testState,
        action
      );

      expect(result.isLoading).toBe(true);
    });
    it('LoadMarketDetailsBasedOnMaterialSuccess should update the payerBank property', () => {
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
      const action = new actions.LoadMarketDetailsBasedOnMaterialSuccess(
        payload
      );

      const result: MarketMaterialPriceState = marketMaterialPriceReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.marketDetailsBasedOnMaterial.ids.length).toBe(1);
    });
    it('LoadMarketDetailsBasedOnMaterialFailure should return error', () => {
      const action = new actions.LoadMarketDetailsBasedOnMaterialFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: MarketMaterialPriceState = marketMaterialPriceReducer(
        testState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing SavePrice ', () => {
    beforeEach(() => {});
    it('SavePrice ', () => {
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
      const action = new actions.SavePrice(payload);

      const result: MarketMaterialPriceState = marketMaterialPriceReducer(
        initialState,
        action
      );

      expect(result.hasSaved).toBe(false);
      expect(result.isLoading).toBe(true);
    });
    it('SavePriceSuccess should update the hasUpdated property to true', () => {
      const action = new actions.SavePriceSuccess();

      const result: MarketMaterialPriceState = marketMaterialPriceReducer(
        initialState,
        action
      );

      expect(result.hasSaved).toBe(true);

      expect(result.isLoading).toBe(false);
    });
    it('SavePriceFailure should return error', () => {
      const action = new actions.SavePriceFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: MarketMaterialPriceState = marketMaterialPriceReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing UpdateCheckBox Functionality ', () => {
    beforeEach(() => {});
    it('UpdateCheckBox ', () => {
      testState = {
        ...testState,
        marketDetailsBasedOnMaterial: marketAdaptor.setAll(
          [
            {
              ...marketDetails,
              isChecked: true,
              materialCode: '',
              marketCode: 'KA',
              description: 'KARANATAKA',
              markupFactor: 1,
              addAmount: 10,
              deductAmount: 10,
              computedPrice: 200
            }
          ],
          testState.marketDetailsBasedOnMaterial
        )
      };
      const payload = {
        isChecked: true,
        ids: ['KA']
      };
      const action = new actions.UpdateCheckBox(payload);

      const result: MarketMaterialPriceState = marketMaterialPriceReducer(
        testState,
        action
      );
      const updatedItem =
        result.marketDetailsBasedOnMaterial.entities[marketDetails.marketCode];
      expect(result.allSelected).toBeFalsy();

      expect(updatedItem.isChecked).toBe(true);
    });
  });

  describe('Testing ComputeBasePriceForForcedType Functionality ', () => {
    beforeEach(() => {});
    it('ComputeBasePriceForForcedType ', () => {
      testState = {
        ...testState,
        marketDetailsBasedOnMaterial: marketAdaptor.setAll(
          [
            {
              ...marketDetails,
              isChecked: true,
              materialCode: '',
              marketCode: 'KA',
              description: 'KARANATAKA',
              markupFactor: 1,
              addAmount: 10,
              deductAmount: 10,
              computedPrice: 200
            }
          ],
          testState.marketDetailsBasedOnMaterial
        )
      };
      const payload = {
        checked: true,
        marketCode: ['KA'],
        computedPrice: 200
      };
      const action = new actions.ComputeBasePriceForForcedType(payload);

      const result: MarketMaterialPriceState = marketMaterialPriceReducer(
        testState,
        action
      );
      const updatedItem =
        result.marketDetailsBasedOnMaterial.entities[marketDetails.marketCode];
      expect(updatedItem.isChecked).toBe(true);
      expect(updatedItem.computedPrice).toBe(200);
    });
  });
  describe('Testing ViewLocationPrice ', () => {
    beforeEach(() => {});
    it('ViewLocationPrice should set the isloading true', () => {
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
      const action = new actions.ViewLocationPrice(payload);

      const result: MarketMaterialPriceState = marketMaterialPriceReducer(
        initialState,

        action
      );

      expect(result.isLoading).toBe(true);
    });
    it('ViewLocationPriceSuccess should return the location deatails', () => {
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
      const action = new actions.ViewLocationPriceSuccess(payload);

      const result: MarketMaterialPriceState = marketMaterialPriceReducer(
        initialState,

        action
      );

      expect(result.hasNewViewLocationPriceSuccess).toBe(true);
      expect(result.isLoading).toBe(false);
      expect(result.locationDetails.ids.length).toEqual(1);
    });
    it('ViewLocationPriceFailure should return error', () => {
      const action = new actions.ViewLocationPriceFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: MarketMaterialPriceState = marketMaterialPriceReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadSavedPrice Functionality ', () => {
    beforeEach(() => {});
    it('LoadSavedPrice should return saved price', () => {
      const payload: LoadSavedBasePrice = {
        pageSize: 10,
        pageIndex: 1,
        materialCode: 'j',
        id: '1'
      };
      const action = new actions.LoadSavedPrice(payload);

      const result: MarketMaterialPriceState = marketMaterialPriceReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(true);
    });
    it('LoadSavedPriceSuccess should return saved price', () => {
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

      const action = new actions.LoadSavedPriceSuccess(payload);

      const result: MarketMaterialPriceState = marketMaterialPriceReducer(
        initialState,
        action
      );

      expect(result.hasNewViewLocationPriceSuccess).toBe(true);
      expect(result.isLoading).toBe(false);
      expect(result.locationDetails.ids.length).toEqual(1);
    });
    it('LoadSavedPriceFailure should return error', () => {
      const action = new actions.LoadSavedPriceFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: MarketMaterialPriceState = marketMaterialPriceReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing SearchMarketCode Functionality ', () => {
    beforeEach(() => {});
    it('SearchMarketCode should return market code', () => {
      const payload: SearchMarketCodePayload = {
        data: {
          materialCode: 'J',
          marketCode: 'KA'
        },
        selectedStock: ''
      };
      const action = new actions.SearchMarketCode(payload);

      const result: MarketMaterialPriceState = marketMaterialPriceReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(true);
    });

    it('SearchMarketCodeSuccess should return market code', () => {
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
      const action = new actions.SearchMarketCodeSuccess(payload);

      const result: MarketMaterialPriceState = marketMaterialPriceReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.marketDetailsBasedOnMaterial.ids.length).toBe(1);
    });
    it('SearchMarketCodeFailure should return error', () => {
      const action = new actions.SearchMarketCodeFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: MarketMaterialPriceState = marketMaterialPriceReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing SearchSavedLocationPriceByLocationCode Functionality ', () => {
    beforeEach(() => {});
    it('SearchSavedLocationPriceByLocationCode should return location details', () => {
      const payload: SearchSavedLocationPriceByLocationPayload = {
        id: '1',
        locationCode: 'URB',
        materialCode: 'J',
        pageIndex: 1,
        pageSize: 10
      };
      const action = new actions.SearchSavedLocationPriceByLocationCode(
        payload
      );

      const result: MarketMaterialPriceState = marketMaterialPriceReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(true);
    });
    it('SearchSavedLocationPriceByLocationCodeSuccess should return location details', () => {
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
      const action = new actions.SearchSavedLocationPriceByLocationCodeSuccess(
        payload
      );

      const result: MarketMaterialPriceState = marketMaterialPriceReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.locationDetails.ids.length).toBe(1);
    });
    it('SearchSavedLocationPriceByLocationCodeFailure should return error', () => {
      const action = new actions.SearchSavedLocationPriceByLocationCodeFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: MarketMaterialPriceState = marketMaterialPriceReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing SearchComputedPriceByLocationCode Functionality ', () => {
    beforeEach(() => {});
    it('SearchComputedPriceByLocationCode should return the searched location', () => {
      const payload: SearchComputedPriceByLocationPayload = {
        locationCode: 'URB',
        materialCode: 'J',
        pageIndex: 1,
        pageSize: 10,
        data: ''
      };
      const action = new actions.SearchComputedPriceByLocationCode(payload);

      const result: MarketMaterialPriceState = marketMaterialPriceReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(true);
    });
    it('SearchComputedPriceByLocationCodeSuccess should set  isLoading fasle hasupdated true', () => {
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

      const action = new actions.SearchComputedPriceByLocationCodeSuccess(
        payload
      );

      const result: MarketMaterialPriceState = marketMaterialPriceReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.computedPriceSearchResult.ids.length).toBe(1);
    });
    it('SearchComputedPriceByLocationCodeFailure should return error', () => {
      const action = new actions.SearchComputedPriceByLocationCodeFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: MarketMaterialPriceState = marketMaterialPriceReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadReset Functionality ', () => {
    beforeEach(() => {});
    it('LoadReset should reset the state', () => {
      const action = new actions.LoadReset();

      const result: MarketMaterialPriceState = marketMaterialPriceReducer(
        initialState,
        action
      );

      expect(result.error).toEqual(null);
      expect(result.locationDetailsCount).toEqual(null);
      expect(result.totalElements).toEqual(null);
      expect(result.hasNewViewLocationPriceSuccess).toEqual(null);
      expect(result.hasSaved).toEqual(null);
      expect(result.metalPriceDetails).toEqual([]);
    });
  });

  describe('Testing LoadResetSelectedStock Functionality ', () => {
    beforeEach(() => {});
    it('LoadResetSelectedStock should reset the selected stock', () => {
      const action = new actions.LoadResetSelectedStock();

      const result: MarketMaterialPriceState = marketMaterialPriceReducer(
        initialState,
        action
      );

      expect(result.selectedStock).toEqual(
        selectedStockAdaptor.getInitialState()
      );
    });
  });

  describe('Testing LoadResetLocationData Functionality ', () => {
    beforeEach(() => {});
    it('LoadResetLocationData should reset the  location data', () => {
      const action = new actions.LoadResetLocationData();

      const result: MarketMaterialPriceState = marketMaterialPriceReducer(
        initialState,
        action
      );

      expect(result.locationDetails).toEqual(
        locationDetailAdaptor.getInitialState()
      );
    });
  });

  describe('Testing UpdateSelectedDate Functionality ', () => {
    beforeEach(() => {});
    it('UpdateSelectedDate should reset the  selected date', () => {
      const payload = 10;
      const action = new actions.UpdateSelectedDate(payload);

      const result: MarketMaterialPriceState = marketMaterialPriceReducer(
        initialState,
        action
      );

      expect(result.date).toEqual(payload);
    });
  });

  describe('Testing UpdateSelectedStock Functionality ', () => {
    beforeEach(() => {});
    it('UpdateSelectedStock should update the selected stock', () => {
      testState = {
        ...testState,
        marketDetailsBasedOnMaterial: marketAdaptor.setAll(
          [
            {
              ...marketDetails,
              isChecked: true,
              materialCode: '',
              marketCode: 'KA',
              description: 'KARANATAKA',
              markupFactor: 1,
              addAmount: 10,
              deductAmount: 10,
              computedPrice: 200
            }
          ],
          testState.marketDetailsBasedOnMaterial
        )
      };
      const payload = {
        checked: true,
        ids: ['KA']
      };
      const action = new actions.UpdateSelectedStock(payload);

      const result: MarketMaterialPriceState = marketMaterialPriceReducer(
        testState,
        action
      );

      const updatedItem =
        result.marketDetailsBasedOnMaterial.entities[marketDetails.marketCode];
      expect(result.allSelected).toBeFalsy();

      expect(updatedItem.isChecked).toBeTruthy();
    });
  });

  describe('Testing ComputePriceForAll Functionality ', () => {
    beforeEach(() => {});
    it('ComputePriceForAll ', () => {
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
      const action = new actions.ComputePriceForAll(payload);

      const result: MarketMaterialPriceState = marketMaterialPriceReducer(
        initialState,
        action
      );
      const updatedItem =
        result.marketDetailsBasedOnMaterial.entities[marketDetails.marketCode];
      expect(updatedItem.computedPrice).toEqual(200);
    });
  });

  describe('Testing RemovePriceForAll Functionality ', () => {
    beforeEach(() => {});
    it('RemovePriceForAll ', () => {
      const payload: MarketDetails[] = [
        {
          materialCode: '',
          marketCode: 'KA',
          description: 'KARANATAKA',
          markupFactor: 1,
          addAmount: 10,
          deductAmount: 10,
          computedPrice: null
        }
      ];
      const action = new actions.RemovePriceForAll(payload);

      const result: MarketMaterialPriceState = marketMaterialPriceReducer(
        initialState,
        action
      );
      const updatedItem =
        result.marketDetailsBasedOnMaterial.entities[marketDetails.marketCode];
      expect(updatedItem.computedPrice).toEqual(null);
    });
  });

  describe('Testing UpdateHasNewViewLocationPrice Functionality ', () => {
    beforeEach(() => {});
    it('UpdateHasNewViewLocationPrice ', () => {
      const payload = true;
      const action = new actions.UpdateHasNewViewLocationPrice(payload);

      const result: MarketMaterialPriceState = marketMaterialPriceReducer(
        initialState,
        action
      );

      expect(result.hasNewViewLocationPriceSuccess).toEqual(true);
    });
  });
  describe('Testing UpdateAllSelected Functionality ', () => {
    beforeEach(() => {});
    it('UpdateAllSelected ', () => {
      const payload = true;
      const action = new actions.UpdateAllSelected(payload);

      const result: MarketMaterialPriceState = marketMaterialPriceReducer(
        initialState,
        action
      );

      expect(result.allSelected).toEqual(true);
    });
  });
});
