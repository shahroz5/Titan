import {
  ActiveConfig,
  BrandSummary,
  CountrySummary,
  LocationMappingOption,
  LocationSummaryList,
  Lov,
  RegionSummary,
  StateSummary,
  TownSummary
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  Clear,
  LoadActiveConfigsFailure,
  LoadActiveConfigsSuccess,
  LoadBrandsFailure,
  LoadBrandsSuccess,
  LoadCountriesFailure,
  LoadCountriesSuccess,
  LoadLevelsFailure,
  LoadLevelsSuccess,
  LoadMappedLocations,
  LoadMappedLocationsFailure,
  LoadMappedLocationsSuccess,
  LoadRegionsFailure,
  LoadRegionsSuccess,
  LoadStatesFailure,
  LoadStatesSuccess,
  LoadTownsFailure,
  LoadTownsSuccess,
  ResetMappedLocations,
  SearchLocationsFailure,
  SearchLocationsSuccess,
  UpdateLocationMapping,
  UpdateLocationMappingFailure,
  UpdateLocationMappingSuccess
} from './location-mapping.actions';

import {
  initialState,
  LocationMappingReducer
} from './location-mapping.reducer';
import { LocationMappingState } from './location-mapping.state';

describe('Location Mapping Reducer Testing Suite', () => {
  let testState = initialState;

  describe('Actions should check intial state', () => {
    it('should return the initial state', () => {
      const action: any = {};
      const state: LocationMappingState = LocationMappingReducer(
        undefined,
        action
      );
      expect(state).toEqual(testState);
    });
  });

  describe('Search location actions', () => {
    it('SEARCH_LOCAITONS_SUCCESS action', () => {
      testState = {
        ...testState,
        locations: []
      };
      const payload: LocationSummaryList[] = [
        {
          locationCode: 'Location code 1',
          description: 'Location code 1'
        },
        {
          locationCode: 'Location code 2',
          description: 'Location code 2'
        }
      ];
      const action = new SearchLocationsSuccess(payload);

      const result: LocationMappingState = LocationMappingReducer(
        testState,
        action
      );

      expect(result.locations).toEqual(payload);
    });

    it('SEARCH_LOCAITONS_FAILURE action', () => {
      testState = {
        ...testState,
        error: null
      };

      const payload = CustomErrorAdaptor.fromJson(Error('some error'));

      const action = new SearchLocationsFailure(payload);

      const result: LocationMappingState = LocationMappingReducer(
        testState,
        action
      );

      expect(result.error).toEqual(payload);
    });
  });

  describe('Load Active Configs actions', () => {
    it('LOAD_ACTIVE_CONFIGS_SUCCESS action', () => {
      testState = {
        ...testState,
        activeConfigs: []
      };
      const payload: ActiveConfig[] = [
        {
          configId: 'Location 1',
          configName: 'L1ID',
          locationCode: 'Location 1'
        },
        {
          configId: 'Location 2',
          configName: 'L2ID',
          locationCode: 'Location 2'
        }
      ];
      const action = new LoadActiveConfigsSuccess(payload);

      const result: LocationMappingState = LocationMappingReducer(
        testState,
        action
      );

      expect(result.activeConfigs).toEqual(payload);
    });

    it('LOAD_ACTIVE_CONFIGS_FAILURE action', () => {
      testState = {
        ...testState,
        error: null
      };

      const payload = CustomErrorAdaptor.fromJson(Error('some error'));

      const action = new LoadActiveConfigsFailure(payload);

      const result: LocationMappingState = LocationMappingReducer(
        testState,
        action
      );

      expect(result.error).toEqual(payload);
    });
  });

  describe('Load Brands actions', () => {
    it('LOAD_BRANDS_SUCCESS action', () => {
      testState = {
        ...testState,
        brands: []
      };
      const payload: BrandSummary[] = [
        {
          brandCode: 'Brand code 1',
          description: 'Brand code 1'
        },
        {
          brandCode: 'Brand code 2',
          description: 'Brand code 2'
        }
      ];
      const action = new LoadBrandsSuccess(payload);

      const result: LocationMappingState = LocationMappingReducer(
        testState,
        action
      );

      expect(result.brands).toEqual(payload);
    });

    it('LOAD_BRANDS_FAILURE action', () => {
      testState = {
        ...testState,
        error: null
      };

      const payload = CustomErrorAdaptor.fromJson(Error('some error'));

      const action = new LoadBrandsFailure(payload);

      const result: LocationMappingState = LocationMappingReducer(
        testState,
        action
      );

      expect(result.error).toEqual(payload);
    });
  });

  describe('Load Levels actions', () => {
    it('LOAD_LEVELS_SUCCESS action', () => {
      testState = {
        ...testState,
        levels: []
      };
      const payload: Lov[] = [
        {
          code: 'Level 1',
          isActive: true,
          value: 'Level 1'
        },
        {
          code: 'Level 2',
          isActive: true,
          value: 'Level 2'
        }
      ];
      const action = new LoadLevelsSuccess(payload);

      const result: LocationMappingState = LocationMappingReducer(
        testState,
        action
      );

      expect(result.levels).toEqual(payload);
    });

    it('LOAD_LEVELS_FAILURE action', () => {
      testState = {
        ...testState,
        error: null
      };

      const payload = CustomErrorAdaptor.fromJson(Error('some error'));

      const action = new LoadLevelsFailure(payload);

      const result: LocationMappingState = LocationMappingReducer(
        testState,
        action
      );

      expect(result.error).toEqual(payload);
    });
  });

  describe('Load Regions actions', () => {
    it('LOAD_REGIONS_SUCCESS action', () => {
      testState = {
        ...testState,
        regions: []
      };
      const payload: RegionSummary[] = [
        {
          regionCode: 'Region code 1',
          description: 'Region code 1'
        },
        {
          regionCode: 'Region code 2',
          description: 'Region code 2'
        }
      ];
      const action = new LoadRegionsSuccess(payload);

      const result: LocationMappingState = LocationMappingReducer(
        testState,
        action
      );

      expect(result.regions).toEqual(payload);
    });

    it('LOAD_REGIONS_FAILURE action', () => {
      testState = {
        ...testState,
        error: null
      };

      const payload = CustomErrorAdaptor.fromJson(Error('some error'));

      const action = new LoadRegionsFailure(payload);

      const result: LocationMappingState = LocationMappingReducer(
        testState,
        action
      );

      expect(result.error).toEqual(payload);
    });
  });

  describe('Load Countries actions', () => {
    it('LOAD_COUNTRIES_SUCCESS action', () => {
      testState = {
        ...testState,
        countries: []
      };
      const payload: CountrySummary[] = [
        {
          countryCode: 'Country code 1',
          description: 'Country code 1'
        },
        {
          countryCode: 'Country code 2',
          description: 'Country code 2'
        }
      ];
      const action = new LoadCountriesSuccess(payload);

      const result: LocationMappingState = LocationMappingReducer(
        testState,
        action
      );

      expect(result.countries).toEqual(payload);
    });

    it('LOAD_COUNTRIES_FAILURE action', () => {
      testState = {
        ...testState,
        error: null
      };

      const payload = CustomErrorAdaptor.fromJson(Error('some error'));

      const action = new LoadCountriesFailure(payload);

      const result: LocationMappingState = LocationMappingReducer(
        testState,
        action
      );

      expect(result.error).toEqual(payload);
    });
  });

  describe('Load states actions', () => {
    it('LOAD_STATES_SUCCESS action', () => {
      testState = {
        ...testState,
        states: []
      };
      const payload: StateSummary[] = [
        {
          stateId: 1,
          description: 'State code 1'
        },
        {
          stateId: 2,
          description: 'State code 2'
        }
      ];
      const action = new LoadStatesSuccess(payload);

      const result: LocationMappingState = LocationMappingReducer(
        testState,
        action
      );

      expect(result.states).toEqual(payload);
    });

    it('LOAD_STATES_FAILURE action', () => {
      testState = {
        ...testState,
        error: null
      };

      const payload = CustomErrorAdaptor.fromJson(Error('some error'));

      const action = new LoadStatesFailure(payload);

      const result: LocationMappingState = LocationMappingReducer(
        testState,
        action
      );

      expect(result.error).toEqual(payload);
    });
  });

  describe('Load towns actions', () => {
    it('LOAD_TOWNS_SUCCESS action', () => {
      testState = {
        ...testState,
        towns: []
      };
      const payload: TownSummary[] = [
        {
          townCode: 1,
          description: 'Town code 1'
        },
        {
          townCode: 2,
          description: 'Town code 2'
        }
      ];
      const action = new LoadTownsSuccess(payload);

      const result: LocationMappingState = LocationMappingReducer(
        testState,
        action
      );

      expect(result.towns).toEqual(payload);
    });

    it('LOAD_TOWNS_FAILURE action', () => {
      testState = {
        ...testState,
        error: null
      };

      const payload = CustomErrorAdaptor.fromJson(Error('some error'));

      const action = new LoadTownsFailure(payload);

      const result: LocationMappingState = LocationMappingReducer(
        testState,
        action
      );

      expect(result.error).toEqual(payload);
    });
  });

  describe('Update Location Mapping actions', () => {
    it('UPDATE_LOCATION_MAPPING action', () => {
      testState = {
        ...testState,
        updateStatus: { isSuccess: true }
      };

      const action = new UpdateLocationMapping(null);

      const result: LocationMappingState = LocationMappingReducer(
        testState,
        action
      );

      expect(result.updateStatus).toBeNull();
    });

    it('UPDATE_LOCATION_MAPPING_SUCCESS action', () => {
      testState = {
        ...testState,
        updateStatus: null
      };

      const action = new UpdateLocationMappingSuccess();

      const result: LocationMappingState = LocationMappingReducer(
        testState,
        action
      );

      expect(result.updateStatus).toEqual({ isSuccess: true });
    });
  });

  describe('Load Location Mapping actions', () => {
    it('LOAD_MAPPED_LOCATIONS action', () => {
      const mappedLocations: LocationMappingOption[] = [
        {
          id: 'Location code 1',
          description: 'Location code 1'
        },
        {
          id: 'Location code 2',
          description: 'Location code 2'
        }
      ];
      testState = {
        ...testState,
        mappedLocations: mappedLocations
      };

      const action = new LoadMappedLocations(null);

      const result: LocationMappingState = LocationMappingReducer(
        testState,
        action
      );

      expect(result.mappedLocations).toEqual([]);
    });

    it('LOAD_MAPPED_LOCATIONS_SUCCESS action', () => {
      testState = {
        ...testState,
        mappedLocations: []
      };

      const payload: LocationMappingOption[] = [
        {
          id: 'Location code 1',
          description: 'Location code 1'
        },
        {
          id: 'Location code 2',
          description: 'Location code 2'
        }
      ];

      const action = new LoadMappedLocationsSuccess(payload);

      const result: LocationMappingState = LocationMappingReducer(
        testState,
        action
      );

      expect(result.mappedLocations).toEqual(payload);
    });

    it('LOAD_MAPPED_LOCATIONS_FAILURE action', () => {
      testState = {
        ...testState,
        error: null
      };

      const payload = CustomErrorAdaptor.fromJson(Error('some error'));

      const action = new LoadMappedLocationsFailure(payload);

      const result: LocationMappingState = LocationMappingReducer(
        testState,
        action
      );

      expect(result.error).toEqual(payload);
    });
  });

  describe('Clear/Reset actions', () => {
    it('RESET_MAPPED_LOCATIONS action', () => {
      const mappedLocations: LocationMappingOption[] = [
        {
          id: 'Location code 1',
          description: 'Location code 1'
        },
        {
          id: 'Location code 2',
          description: 'Location code 2'
        }
      ];
      testState = {
        ...testState,
        mappedLocations: mappedLocations
      };

      const action = new ResetMappedLocations();

      const result: LocationMappingState = LocationMappingReducer(
        testState,
        action
      );

      expect(result.mappedLocations).toEqual([]);
    });

    it('CLEAR action', () => {
      const mappedLocations: LocationMappingOption[] = [
        {
          id: 'Location code 1',
          description: 'Location code 1'
        },
        {
          id: 'Location code 2',
          description: 'Location code 2'
        }
      ];
      testState = {
        ...testState,
        mappedLocations: mappedLocations,
        locations: [
          {
            locationCode: 'Location code 1',
            description: 'Location code 1'
          }
        ],
        brands: [
          {
            brandCode: 'Brand code 1',
            description: 'Brand code 1'
          }
        ],
        levels: [
          {
            code: 'Level 1',
            isActive: true,
            value: 'Level 1'
          }
        ],
        regions: [
          {
            regionCode: 'Region code 1',
            description: 'Region code 1'
          }
        ],
        countries: [
          {
            countryCode: 'Country code 1',
            description: 'Country code 1'
          }
        ],
        states: [
          {
            stateId: 1,
            description: 'State code 1'
          }
        ],
        towns: [
          {
            townCode: 1,
            description: 'Town code 1'
          }
        ],
        activeConfigs: [
          {
            configId: 'Location 1',
            configName: 'L1ID',
            locationCode: 'Location 1'
          }
        ],
        updateStatus: {
          isSuccess: true
        },
        error: CustomErrorAdaptor.fromJson(Error('some error'))
      };

      const action = new Clear();

      const result: LocationMappingState = LocationMappingReducer(
        testState,
        action
      );

      expect(result.mappedLocations).toEqual([]);
      expect(result.locations).toEqual([]);
      expect(result.brands).toEqual([]);
      expect(result.regions).toEqual([]);
      expect(result.levels).toEqual([]);
      expect(result.countries).toEqual([]);
      expect(result.states).toEqual([]);
      expect(result.towns).toEqual([]);
      expect(result.error).toBeNull();
      expect(result.updateStatus).toBeNull();
      expect(result.activeConfigs).toEqual([]);
    });
  });
});
