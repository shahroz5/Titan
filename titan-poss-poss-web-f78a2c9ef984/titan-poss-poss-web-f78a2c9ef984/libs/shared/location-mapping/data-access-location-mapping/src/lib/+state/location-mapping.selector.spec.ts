import {
  ActiveConfig,
  BrandSummary,
  CountrySummary,
  CustomErrors,
  LocationMappingOption,
  LocationSummaryList,
  Lov,
  RegionSummary,
  StateSummary,
  TownSummary
} from '@poss-web/shared/models';
import { LocationMappingState } from './location-mapping.state';
import { initialState } from './location-mapping.reducer';
import { LocationMappingSelectors } from './location-mapping.selectors';

describe('Testing Location mapping related Selectors', () => {
  it('Should return the error', () => {
    const error: CustomErrors = {
      code: 'ERR_1',
      message: 'Error',
      traceId: 'TraceID',
      timeStamp: '122131',
      error: null
    };
    const state: LocationMappingState = {
      ...initialState,
      error: error
    };
    expect(LocationMappingSelectors.selectError.projector(state)).toEqual(
      error
    );
  });

  it('Should return the locations', () => {
    const locations: LocationSummaryList[] = [
      {
        locationCode: 'Location code 1',
        description: 'Location code 1'
      },
      {
        locationCode: 'Location code 2',
        description: 'Location code 2'
      }
    ];

    const state: LocationMappingState = {
      ...initialState,
      locations: locations
    };
    expect(LocationMappingSelectors.selectLocations.projector(state)).toEqual(
      locations
    );
  });

  it('Should return the Brands', () => {
    const brands: BrandSummary[] = [
      {
        brandCode: 'Brand code 1',
        description: 'Brand code 1'
      },
      {
        brandCode: 'Brand code 2',
        description: 'Brand code 2'
      }
    ];

    const state: LocationMappingState = {
      ...initialState,
      brands: brands
    };
    expect(LocationMappingSelectors.selectBrands.projector(state)).toEqual(
      brands
    );
  });

  it('Should return the Regions', () => {
    const regions: RegionSummary[] = [
      {
        regionCode: 'Region code 1',
        description: 'Region code 1'
      },
      {
        regionCode: 'Region code 2',
        description: 'Region code 2'
      }
    ];

    const state: LocationMappingState = {
      ...initialState,
      regions: regions
    };
    expect(LocationMappingSelectors.selectRegions.projector(state)).toEqual(
      regions
    );
  });

  it('Should return the Levels', () => {
    const levels: Lov[] = [
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

    const state: LocationMappingState = {
      ...initialState,
      levels: levels
    };
    expect(LocationMappingSelectors.selectLevels.projector(state)).toEqual(
      levels
    );
  });

  it('Should return the Country', () => {
    const countries: CountrySummary[] = [
      {
        countryCode: 'Country code 1',
        description: 'Country code 1'
      },
      {
        countryCode: 'Country code 2',
        description: 'Country code 2'
      }
    ];

    const state: LocationMappingState = {
      ...initialState,
      countries: countries
    };
    expect(LocationMappingSelectors.selectCountries.projector(state)).toEqual(
      countries
    );
  });

  it('Should return the States', () => {
    const states: StateSummary[] = [
      {
        stateId: 1,
        description: 'State code 1'
      },
      {
        stateId: 2,
        description: 'State code 2'
      }
    ];

    const state: LocationMappingState = {
      ...initialState,
      states: states
    };
    expect(LocationMappingSelectors.selectStates.projector(state)).toEqual(
      states
    );
  });

  it('Should return the Towns', () => {
    const towns: TownSummary[] = [
      {
        townCode: 1,
        description: 'Town code 1'
      },
      {
        townCode: 2,
        description: 'Town code 2'
      }
    ];

    const state: LocationMappingState = {
      ...initialState,
      towns: towns
    };
    expect(LocationMappingSelectors.selectTowns.projector(state)).toEqual(
      towns
    );
  });

  it('Should return the ActiveConfigs', () => {
    const activeConfigs: ActiveConfig[] = [
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

    const state: LocationMappingState = {
      ...initialState,
      activeConfigs: activeConfigs
    };
    expect(
      LocationMappingSelectors.selectActiveConfigs.projector(state)
    ).toEqual(activeConfigs);
  });

  it('Should return the UpdateStatus', () => {
    const updateStatus = {
      isSuccess: true
    };

    const state: LocationMappingState = {
      ...initialState,
      updateStatus: updateStatus
    };
    expect(
      LocationMappingSelectors.selectUpdateStatus.projector(state)
    ).toEqual(updateStatus);
  });

  it('Should return the mapped locations', () => {
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

    const state: LocationMappingState = {
      ...initialState,
      mappedLocations: mappedLocations
    };
    expect(
      LocationMappingSelectors.selectMappedLocations.projector(state)
    ).toEqual(mappedLocations);
  });
});
