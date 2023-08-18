import {
  CustomErrors,
  Lov,
  SelectedLocationFilters,
  LocationSummaryList,
  LoadActiveConfigsPayload,
  ConfigTypeEnum,
  ActiveConfig,
  BrandSummary,
  RegionSummary,
  CountrySummary,
  StateSummary,
  TownSummary,
  UpdateLocationMappingPayload,
  LoadMappedLocationsPayload,
  LocationMappingOption
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  Clear,
  LoadActiveConfigs,
  LoadActiveConfigsFailure,
  LoadActiveConfigsSuccess,
  LoadBrands,
  LoadBrandsFailure,
  LoadBrandsSuccess,
  LoadCountries,
  LoadCountriesFailure,
  LoadCountriesSuccess,
  LoadLevels,
  LoadLevelsFailure,
  LoadLevelsSuccess,
  LoadMappedLocations,
  LoadMappedLocationsFailure,
  LoadMappedLocationsSuccess,
  LoadRegions,
  LoadRegionsFailure,
  LoadRegionsSuccess,
  LoadStates,
  LoadStatesFailure,
  LoadStatesSuccess,
  LoadTowns,
  LoadTownsFailure,
  LoadTownsSuccess,
  LocationMappingActionTypes,
  ResetError,
  ResetMappedLocations,
  SearchLocations,
  SearchLocationsFailure,
  SearchLocationsSuccess,
  UpdateLocationMapping,
  UpdateLocationMappingFailure,
  UpdateLocationMappingSuccess
} from './location-mapping.actions';

describe('Location Mapping Action Testing ', () => {
  describe('Search Locations Action Test Cases', () => {
    it('should check correct type and payload is used for  SearchLocations action ', () => {
      const payload: SelectedLocationFilters = {
        brands: ['BRAND1'],
        regions: ['REGION1'],
        levels: ['LEVEL1'],
        countries: ['COUNTRY1'],
        states: ['STATE1'],
        towns: ['TOWNS1']
      };
      const action = new SearchLocations(payload);

      expect(action.type).toEqual(LocationMappingActionTypes.SEARCH_LOCAITONS);
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type  and payload is used for  SearchLocationstSuccess action ', () => {
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

      expect(action.type).toEqual(
        LocationMappingActionTypes.SEARCH_LOCAITONS_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type  and payload is used for  SearchLocationsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SearchLocationsFailure(payload);

      expect(action.type).toEqual(
        LocationMappingActionTypes.SEARCH_LOCAITONS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });
  describe('Load Active Configss Action Test Cases', () => {
    it('should check correct type and payload is used for  LoadActiveConfigs action ', () => {
      const payload: LoadActiveConfigsPayload = {
        ruleType: ConfigTypeEnum.WEIGHT_TOLERANCE,
        data: {
          excludeRuleId: 'ID1',
          includeLocations: ['ID2']
        }
      };
      const action = new LoadActiveConfigs(payload);

      expect(action.type).toEqual(
        LocationMappingActionTypes.LOAD_ACTIVE_CONFIGS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type  and payload is used for LoadActiveConfigstSuccess action ', () => {
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

      expect(action.type).toEqual(
        LocationMappingActionTypes.LOAD_ACTIVE_CONFIGS_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type  and payload is used for  LoadActiveConfigsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadActiveConfigsFailure(payload);

      expect(action.type).toEqual(
        LocationMappingActionTypes.LOAD_ACTIVE_CONFIGS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('Load Brands Action Test Cases', () => {
    it('should check correct type and payload is used for  LoadBrands action ', () => {
      const action = new LoadBrands();

      expect(action.type).toEqual(LocationMappingActionTypes.LOAD_BRANDS);
    });
    it('should check correct type  and payload is used for LoadBrandstSuccess action ', () => {
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

      expect(action.type).toEqual(
        LocationMappingActionTypes.LOAD_BRANDS_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type  and payload is used for  LoadBrandsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadBrandsFailure(payload);

      expect(action.type).toEqual(
        LocationMappingActionTypes.LOAD_BRANDS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('Load levels Action Test Cases', () => {
    it('should check correct type and payload is used for  LoadLevels action ', () => {
      const action = new LoadLevels();

      expect(action.type).toEqual(LocationMappingActionTypes.LOAD_LEVELS);
    });
    it('should check correct type  and payload is used for LoadLevelsSuccess action ', () => {
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

      expect(action.type).toEqual(
        LocationMappingActionTypes.LOAD_LEVELS_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type  and payload is used for  LoadLevelsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadLevelsFailure(payload);

      expect(action.type).toEqual(
        LocationMappingActionTypes.LOAD_LEVELS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('Load Regions Action Test Cases', () => {
    it('should check correct type and payload is used for  LoadRegions action ', () => {
      const action = new LoadRegions();

      expect(action.type).toEqual(LocationMappingActionTypes.LOAD_REGIONS);
    });
    it('should check correct type  and payload is used for LoadRegionsSuccess action ', () => {
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

      expect(action.type).toEqual(
        LocationMappingActionTypes.LOAD_REGIONS_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type  and payload is used for  LoadRegionsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadRegionsFailure(payload);

      expect(action.type).toEqual(
        LocationMappingActionTypes.LOAD_REGIONS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('Load Countries Action Test Cases', () => {
    it('should check correct type and payload is used for  LoadCountries action ', () => {
      const action = new LoadCountries();

      expect(action.type).toEqual(LocationMappingActionTypes.LOAD_COUNTRIES);
    });
    it('should check correct type  and payload is used for LoadCountriesSuccess action ', () => {
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

      expect(action.type).toEqual(
        LocationMappingActionTypes.LOAD_COUNTRIES_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type  and payload is used for  LoadCountriesFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadCountriesFailure(payload);

      expect(action.type).toEqual(
        LocationMappingActionTypes.LOAD_COUNTRIES_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('Load states Action Test Cases', () => {
    it('should check correct type and payload is used for  LoadStates action ', () => {
      const payload: { countryCode: string; regionCodes: string[] } = {
        countryCode: 'Country 1',
        regionCodes: ['Region 1']
      };
      const action = new LoadStates(payload);

      expect(action.type).toEqual(LocationMappingActionTypes.LOAD_STATES);
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type  and payload is used for LoadStatesSuccess   action ', () => {
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

      expect(action.type).toEqual(
        LocationMappingActionTypes.LOAD_STATES_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type  and payload is used for  LoadStatesFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadStatesFailure(payload);

      expect(action.type).toEqual(
        LocationMappingActionTypes.LOAD_STATES_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('Load towns Action Test Cases', () => {
    it('should check correct type and payload is used for  LoadTowns action ', () => {
      const payload = 'State1';
      const action = new LoadTowns(payload);

      expect(action.type).toEqual(LocationMappingActionTypes.LOAD_TOWNS);
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type  and payload is used for LoadTownsSuccess   action ', () => {
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

      expect(action.type).toEqual(
        LocationMappingActionTypes.LOAD_TOWNS_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type  and payload is used for  LoadTownsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadTownsFailure(payload);

      expect(action.type).toEqual(
        LocationMappingActionTypes.LOAD_TOWNS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('Update Location Mapping Action Test Cases', () => {
    it('should check correct type and payload is used for  UpdateLocationMapping action ', () => {
      const payload: UpdateLocationMappingPayload = {
        ruleType: ConfigTypeEnum.CUSTOMER_TRANSACTION_CONFIGURATIONS,
        ruleID: 'ID',
        data: {
          addLocations: ['LOC1'],
          overwriteLocations: ['LOC2'],
          removeLocations: ['LOC3']
        }
      };
      const action = new UpdateLocationMapping(payload);

      expect(action.type).toEqual(
        LocationMappingActionTypes.UPDATE_LOCATION_MAPPING
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type  and payload is used for UpdateLocationMappingSuccess   action ', () => {
      const action = new UpdateLocationMappingSuccess();

      expect(action.type).toEqual(
        LocationMappingActionTypes.UPDATE_LOCATION_MAPPING_SUCCESS
      );
    });
    it('should check correct type  and payload is used for  UpdateLocationMappingFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new UpdateLocationMappingFailure(payload);

      expect(action.type).toEqual(
        LocationMappingActionTypes.UPDATE_LOCATION_MAPPING_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('Load Mapped Locations Action Test Cases', () => {
    it('should check correct type and payload is used for  LoadMappedLocations action ', () => {
      const payload: LoadMappedLocationsPayload = {
        ruleType: ConfigTypeEnum.GEP_PURITY_CONFIGURATIONS,
        ruleID: 'ID'
      };
      const action = new LoadMappedLocations(payload);

      expect(action.type).toEqual(
        LocationMappingActionTypes.LOAD_MAPPED_LOCATIONS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type  and payload is used for  LoadMappedLocationsSuccess action ', () => {
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

      expect(action.type).toEqual(
        LocationMappingActionTypes.LOAD_MAPPED_LOCATIONS_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type  and payload is used for  LoadMappedLocationsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadMappedLocationsFailure(payload);

      expect(action.type).toEqual(
        LocationMappingActionTypes.LOAD_MAPPED_LOCATIONS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });


  describe('Reset/Clear Action', () => {
    it('should check correct type and payload is used for  ResetMappedLocations action ', () => {
    
      const action = new ResetMappedLocations();

      expect(action.type).toEqual(
        LocationMappingActionTypes.RESET_MAPPED_LOCATIONS
      );
    });

    it('should check correct type and payload is used for  Clear action ', () => {
    
      const action = new Clear();

      expect(action.type).toEqual(
        LocationMappingActionTypes.CLEAR
      );
    });

    it('should check correct type and payload is used for  ResetError action ', () => {
    
      const action = new ResetError();

      expect(action.type).toEqual(
        LocationMappingActionTypes.RESET_ERROR
      );
    });


     
  });


  


});
