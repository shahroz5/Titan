import { TestBed } from '@angular/core/testing';
import { DataPersistence } from '@nrwl/angular';

import { Observable } from 'rxjs';
import { provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import {
  ActiveConfig,
  BrandSummary,
  ConfigTypeEnum,
  CountrySummary,
  LoadActiveConfigsPayload,
  LoadMappedLocationsPayload,
  LocationMappingOption,
  LocationSummaryList,
  Lov,
  RegionSummary,
  SelectedLocationFilters,
  StateSummary,
  TownSummary,
  UpdateLocationMappingPayload
} from '@poss-web/shared/models';

import { hot, cold } from 'jasmine-marbles';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  BrandDataService,
  CountryDataService,
  LocationDataService,
  LovDataService,
  RegionDataService,
  StateDataService,
  TownDataService
} from '@poss-web/shared/masters/data-access-masters';
import { LocationMappingEffect } from './location-mapping.effect';
import { LOCATION_MAPPING_FEATURE_KEY } from './location-mapping.reducer';

import { initialState } from './location-mapping.reducer';
import { LocationMappingDataAccessService } from '../location-mapping-data-access.service';
import {
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
  SearchLocations,
  SearchLocationsFailure,
  SearchLocationsSuccess,
  UpdateLocationMapping,
  UpdateLocationMappingFailure,
  UpdateLocationMappingSuccess
} from './location-mapping.actions';

describe('Location mapping Effect Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: LocationMappingEffect;

  const brandDataServiceSpy = jasmine.createSpyObj<BrandDataService>([
    'getBrandSummary'
  ]);

  const regionDataServiceSpy = jasmine.createSpyObj<RegionDataService>([
    'getRegionSummary'
  ]);

  const lovDataServiceSpy = jasmine.createSpyObj<LovDataService>([
    'getLocationLovs'
  ]);

  const countryDataServiceSpy = jasmine.createSpyObj<CountryDataService>([
    'getCountrySummary'
  ]);

  const stateDataServiceSpy = jasmine.createSpyObj<StateDataService>([
    'getStatesFromLocationMaster'
  ]);

  const townDataServiceSpy = jasmine.createSpyObj<TownDataService>([
    'getTownsSummary'
  ]);

  const locationDataServiceSpy = jasmine.createSpyObj<LocationDataService>([
    'getLocationSummaryList'
  ]);

  const locationMappingDataAccessServiceSpy = jasmine.createSpyObj<
    LocationMappingDataAccessService
  >(['loadActiveConfigs', 'updateLocationMapping', 'getMappedLocations']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LocationMappingEffect,
        DataPersistence,
        provideMockStore({
          initialState: {
            [LOCATION_MAPPING_FEATURE_KEY]: initialState
          }
        }),
        provideMockActions(() => actions$),

        {
          provide: LovDataService,
          useValue: lovDataServiceSpy
        },

        {
          provide: BrandDataService,
          useValue: brandDataServiceSpy
        },

        {
          provide: RegionDataService,
          useValue: regionDataServiceSpy
        },
        {
          provide: CountryDataService,
          useValue: countryDataServiceSpy
        },
        {
          provide: StateDataService,
          useValue: stateDataServiceSpy
        },
        {
          provide: LocationDataService,
          useValue: locationDataServiceSpy
        },
        {
          provide: TownDataService,
          useValue: townDataServiceSpy
        },
        {
          provide: LocationMappingDataAccessService,
          useValue: locationMappingDataAccessServiceSpy
        }
      ]
    });

    effect = TestBed.inject(LocationMappingEffect);
  });

  describe('searchLocations', () => {
    it('should return a location search List', () => {
      const payload: SelectedLocationFilters = {
        brands: ['BRAND1'],
        regions: ['REGION1'],
        levels: ['LEVEL1'],
        countries: ['COUNTRY1'],
        states: ['STATE1'],
        towns: ['TOWNS1']
      };

      const response: LocationSummaryList[] = [
        {
          locationCode: 'Location code 1',
          description: 'Location code 1'
        },
        {
          locationCode: 'Location code 2',
          description: 'Location code 2'
        }
      ];
      const action = new SearchLocations(payload);
      const outcome = new SearchLocationsSuccess(response);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: response });
      locationDataServiceSpy.getLocationSummaryList.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.searchLocations$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: SelectedLocationFilters = {
        brands: ['BRAND1'],
        regions: ['REGION1'],
        levels: ['LEVEL1'],
        countries: ['COUNTRY1'],
        states: ['STATE1'],
        towns: ['TOWNS1']
      };
      const error = new Error('some error');

      const action = new SearchLocations(payload);
      const outcome = new SearchLocationsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      locationDataServiceSpy.getLocationSummaryList.and.returnValue(response$);
      const expected$ = cold('--b', { b: outcome });
      expect(effect.searchLocations$).toBeObservable(expected$);
    });
  });

  describe('loadActiveConfigs', () => {
    it('should return a Active confi List', () => {
      const payload: LoadActiveConfigsPayload = {
        ruleType: ConfigTypeEnum.WEIGHT_TOLERANCE,
        data: {
          excludeRuleId: 'ID1',
          includeLocations: ['ID2']
        }
      };

      const response: ActiveConfig[] = [
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
      const action = new LoadActiveConfigs(payload);
      const outcome = new LoadActiveConfigsSuccess(response);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: response });
      locationMappingDataAccessServiceSpy.loadActiveConfigs.and.returnValue(
        response$
      );

      const expected$ = cold('--c', { c: outcome });

      expect(effect.loadActiveConfigs$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: LoadActiveConfigsPayload = {
        ruleType: ConfigTypeEnum.WEIGHT_TOLERANCE,
        data: {
          excludeRuleId: 'ID1',
          includeLocations: ['ID2']
        }
      };
      const error = new Error('some error');

      const action = new LoadActiveConfigs(payload);
      const outcome = new LoadActiveConfigsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      locationMappingDataAccessServiceSpy.loadActiveConfigs.and.returnValue(
        response$
      );
      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadActiveConfigs$).toBeObservable(expected$);
    });
  });

  describe('updateLocationMapping', () => {
    it('should update Location Mapping', () => {
      const payload: UpdateLocationMappingPayload = {
        ruleType: ConfigTypeEnum.CUSTOMER_TRANSACTION_CONFIGURATIONS,
        ruleID: 'ID',
        data: {
          addLocations: ['LOC1'],
          overwriteLocations: ['LOC2'],
          removeLocations: ['LOC3']
        }
      };
      const response = null;

      const action = new UpdateLocationMapping(payload);
      const outcome = new UpdateLocationMappingSuccess();
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: response });
      locationMappingDataAccessServiceSpy.updateLocationMapping.and.returnValue(
        response$
      );

      const expected$ = cold('--c', { c: outcome });

      expect(effect.updateLocationMapping$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: UpdateLocationMappingPayload = {
        ruleType: ConfigTypeEnum.CUSTOMER_TRANSACTION_CONFIGURATIONS,
        ruleID: 'ID',
        data: {
          addLocations: ['LOC1'],
          overwriteLocations: ['LOC2'],
          removeLocations: ['LOC3']
        }
      };
      const error = new Error('some error');

      const action = new UpdateLocationMapping(payload);
      const outcome = new UpdateLocationMappingFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      locationMappingDataAccessServiceSpy.updateLocationMapping.and.returnValue(
        response$
      );
      const expected$ = cold('--b', { b: outcome });
      expect(effect.updateLocationMapping$).toBeObservable(expected$);
    });
  });

  describe('loadMappedLocations', () => {
    it('should return mapped Locations ', () => {
      const payload: LoadMappedLocationsPayload = {
        ruleType: ConfigTypeEnum.GEP_PURITY_CONFIGURATIONS,
        ruleID: 'ID'
      };
      const response: LocationMappingOption[] = [
        {
          id: 'Location code 1',
          description: 'Location code 1'
        },
        {
          id: 'Location code 2',
          description: 'Location code 2'
        }
      ];

      const action = new LoadMappedLocations(payload);
      const outcome = new LoadMappedLocationsSuccess(response);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: response });
      locationMappingDataAccessServiceSpy.getMappedLocations.and.returnValue(
        response$
      );

      const expected$ = cold('--c', { c: outcome });

      expect(effect.loadMappedLocations$).toBeObservable(expected$);
    });

    it('should return success if  ERR_CONFIG_002 error ', () => {
      const payload: LoadMappedLocationsPayload = {
        ruleType: ConfigTypeEnum.GEP_PURITY_CONFIGURATIONS,
        ruleID: 'ID'
      };

      spyOn(effect, 'errorHandler').and.returnValue({ code: 'ERR-CONFIG-002' });
      const response: LocationMappingOption[] = [];

      const error = new Error('some error');

      const action = new LoadMappedLocations(payload);
      const outcome = new LoadMappedLocationsSuccess(response);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-#', {}, error);
      locationMappingDataAccessServiceSpy.getMappedLocations.and.returnValue(
        response$
      );

      const expected$ = cold('--c', { c: outcome });

      expect(effect.loadMappedLocations$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: LoadMappedLocationsPayload = {
        ruleType: ConfigTypeEnum.GEP_PURITY_CONFIGURATIONS,
        ruleID: 'ID'
      };
      const error = new Error('some error');

      const action = new LoadMappedLocations(payload);
      const outcome = new LoadMappedLocationsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      locationMappingDataAccessServiceSpy.getMappedLocations.and.returnValue(
        response$
      );
      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadMappedLocations$).toBeObservable(expected$);
    });
  });

  describe('loadBrands', () => {
    it('should return brands list ', () => {
      const response: BrandSummary[] = [
        {
          brandCode: 'Brand code 1',
          description: 'Brand code 1'
        },
        {
          brandCode: 'Brand code 2',
          description: 'Brand code 2'
        }
      ];

      const action = new LoadBrands();
      const outcome = new LoadBrandsSuccess(response);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: response });
      brandDataServiceSpy.getBrandSummary.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.loadBrands$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const error = new Error('some error');

      const action = new LoadBrands();
      const outcome = new LoadBrandsFailure(CustomErrorAdaptor.fromJson(error));
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      brandDataServiceSpy.getBrandSummary.and.returnValue(response$);
      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadBrands$).toBeObservable(expected$);
    });
  });

  describe('loadRegions', () => {
    it('should return regions list ', () => {
      const response: RegionSummary[] = [
        {
          regionCode: 'Region code 1',
          description: 'Region code 1'
        },
        {
          regionCode: 'Region code 2',
          description: 'Region code 2'
        }
      ];

      const action = new LoadRegions();
      const outcome = new LoadRegionsSuccess(response);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: response });
      regionDataServiceSpy.getRegionSummary.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.loadRegions$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const error = new Error('some error');

      const action = new LoadRegions();
      const outcome = new LoadRegionsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      regionDataServiceSpy.getRegionSummary.and.returnValue(response$);
      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadRegions$).toBeObservable(expected$);
    });
  });

  describe('loadLevels', () => {
    it('should return levels list ', () => {
      const response: Lov[] = [
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

      const action = new LoadLevels();
      const outcome = new LoadLevelsSuccess(response);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: response });
      lovDataServiceSpy.getLocationLovs.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.loadLevels$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const error = new Error('some error');

      const action = new LoadLevels();
      const outcome = new LoadLevelsFailure(CustomErrorAdaptor.fromJson(error));
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      lovDataServiceSpy.getLocationLovs.and.returnValue(response$);
      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadLevels$).toBeObservable(expected$);
    });
  });

  describe('loadCountries', () => {
    it('should return country list ', () => {
      const response: CountrySummary[] = [
        {
          countryCode: 'Country code 1',
          description: 'Country code 1'
        },
        {
          countryCode: 'Country code 2',
          description: 'Country code 2'
        }
      ];

      const action = new LoadCountries();
      const outcome = new LoadCountriesSuccess(response);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: response });
      countryDataServiceSpy.getCountrySummary.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.loadCountries$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const error = new Error('some error');

      const action = new LoadCountries();
      const outcome = new LoadCountriesFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      countryDataServiceSpy.getCountrySummary.and.returnValue(response$);
      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadCountries$).toBeObservable(expected$);
    });
  });

  describe('loadStates', () => {
    it('should return state list ', () => {
      const payload: { countryCode: string; regionCodes: string[] } = {
        countryCode: 'Country 1',
        regionCodes: ['Region 1']
      };
      const response: StateSummary[] = [
        {
          stateId: 1,
          description: 'State code 1'
        },
        {
          stateId: 2,
          description: 'State code 2'
        }
      ];

      const action = new LoadStates(payload);
      const outcome = new LoadStatesSuccess(response);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: response });
      stateDataServiceSpy.getStatesFromLocationMaster.and.returnValue(
        response$
      );

      const expected$ = cold('--c', { c: outcome });

      expect(effect.loadStates$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: { countryCode: string; regionCodes: string[] } = {
        countryCode: 'Country 1',
        regionCodes: ['Region 1']
      };
      const error = new Error('some error');

      const action = new LoadStates(payload);
      const outcome = new LoadStatesFailure(CustomErrorAdaptor.fromJson(error));
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      stateDataServiceSpy.getStatesFromLocationMaster.and.returnValue(
        response$
      );
      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadStates$).toBeObservable(expected$);
    });
  });

  describe('loadTowns', () => {
    it('should return town list ', () => {
      const payload = 'State1';

      const response: TownSummary[] = [
        {
          townCode: 1,
          description: 'Town code 1'
        },
        {
          townCode: 2,
          description: 'Town code 2'
        }
      ];

      const action = new LoadTowns(payload);
      const outcome = new LoadTownsSuccess(response);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: response });
      townDataServiceSpy.getTownsSummary.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.loadTowns$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload = 'State1';

      const error = new Error('some error');

      const action = new LoadTowns(payload);
      const outcome = new LoadTownsFailure(CustomErrorAdaptor.fromJson(error));
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      townDataServiceSpy.getTownsSummary.and.returnValue(response$);
      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadTowns$).toBeObservable(expected$);
    });
  });
});
