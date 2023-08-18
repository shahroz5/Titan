import { Action } from '@ngrx/store';

import {
  LocationSummaryList,
  TownSummary,
  StateSummary,
  CountrySummary,
  Lov,
  RegionSummary,
  BrandSummary,
  CustomErrors,
  SelectedLocationFilters,
  ActiveConfig,
  LoadActiveConfigsPayload,
  UpdateLocationMappingPayload,
  LocationMappingOption,
  LoadMappedLocationsPayload
} from '@poss-web/shared/models';

export enum LocationMappingActionTypes {
  SEARCH_LOCAITONS = '[ Location-Mapping ] Search locations',
  SEARCH_LOCAITONS_SUCCESS = '[ Location-Mapping ] Search locations Success',
  SEARCH_LOCAITONS_FAILURE = '[ Location-Mapping ] Search locations Failure',

  LOAD_ACTIVE_CONFIGS = '[ Location-Mapping ] Load Active Configs',
  LOAD_ACTIVE_CONFIGS_SUCCESS = '[ Location-Mapping ] Load Active Configs Success',
  LOAD_ACTIVE_CONFIGS_FAILURE = '[ Location-Mapping ] Load Active Configs Failure',

  UPDATE_LOCATION_MAPPING = '[ Location-Mapping ] Update Location Mapping',
  UPDATE_LOCATION_MAPPING_SUCCESS = '[ Location-Mapping ]  Update Location Mapping  Success',
  UPDATE_LOCATION_MAPPING_FAILURE = '[ Location-Mapping ]  Update Location Mapping Failure',

  LOAD_MAPPED_LOCATIONS = '[ Location-Mapping ] Load Mapped Locations',
  LOAD_MAPPED_LOCATIONS_SUCCESS = '[ Location-Mapping ] Load Mapped Locations Success',
  LOAD_MAPPED_LOCATIONS_FAILURE = '[ Location-Mapping ] Load Mapped Locations Failure',

  CLEAR = '[ Location-Mapping ] Clear Data',

  LOAD_BRANDS = '[Location-Mapping] Load Brands',
  LOAD_BRANDS_SUCCESS = '[Location-Mapping] Load Brands Success',
  LOAD_BRANDS_FAILURE = '[Location-Mapping] Load Brands Failure',

  LOAD_REGIONS = '[Location-Mapping] Load Region',
  LOAD_REGIONS_SUCCESS = '[Location-Mapping] Load Region Success',
  LOAD_REGIONS_FAILURE = '[Location-Mapping] Load Region Failure',

  LOAD_LEVELS = '[Location-Mapping] Load Levels',
  LOAD_LEVELS_SUCCESS = '[Location-Mapping] Load Levels Success',
  LOAD_LEVELS_FAILURE = '[Location-Mapping]Load Levels Failure',

  LOAD_COUNTRIES = '[Location-Mapping] Load Countries',
  LOAD_COUNTRIES_SUCCESS = '[Location-Mapping] Load Countries Success',
  LOAD_COUNTRIES_FAILURE = '[Location-Mapping] Load Countries Failure',

  LOAD_STATES = '[Location-Mapping] Load States',
  LOAD_STATES_SUCCESS = '[Location-Mapping] Load States Success',
  LOAD_STATES_FAILURE = '[Location-Mapping] Load States Failure',

  LOAD_TOWNS = '[Location-Mapping] Load towns',
  LOAD_TOWNS_SUCCESS = '[Location-Mapping] Load Towns Success',
  LOAD_TOWNS_FAILURE = '[Location-Mapping] Load Towns Failure',

  RESET_ERROR = '[ Location-Mapping ] Reset Error',

  RESET_MAPPED_LOCATIONS = '[ Location-Mapping ] Reset Mapped Locations',
  RESET_ACTIVE_CONFIGS = '[ Location-Mapping ] Reset Active Configs'
}

export class SearchLocations implements Action {
  readonly type = LocationMappingActionTypes.SEARCH_LOCAITONS;
  constructor(public payload: SelectedLocationFilters) {}
}

export class SearchLocationsSuccess implements Action {
  readonly type = LocationMappingActionTypes.SEARCH_LOCAITONS_SUCCESS;
  constructor(public payload: LocationSummaryList[]) {}
}

export class SearchLocationsFailure implements Action {
  readonly type = LocationMappingActionTypes.SEARCH_LOCAITONS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadActiveConfigs implements Action {
  readonly type = LocationMappingActionTypes.LOAD_ACTIVE_CONFIGS;
  constructor(public payload: LoadActiveConfigsPayload) {}
}

export class LoadActiveConfigsSuccess implements Action {
  readonly type = LocationMappingActionTypes.LOAD_ACTIVE_CONFIGS_SUCCESS;
  constructor(public payload: ActiveConfig[]) {}
}

export class LoadActiveConfigsFailure implements Action {
  readonly type = LocationMappingActionTypes.LOAD_ACTIVE_CONFIGS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class Clear implements Action {
  readonly type = LocationMappingActionTypes.CLEAR;
}

export class LoadBrands implements Action {
  readonly type = LocationMappingActionTypes.LOAD_BRANDS;
}

export class LoadBrandsSuccess implements Action {
  readonly type = LocationMappingActionTypes.LOAD_BRANDS_SUCCESS;
  constructor(public payload: BrandSummary[]) {}
}

export class LoadBrandsFailure implements Action {
  readonly type = LocationMappingActionTypes.LOAD_BRANDS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadLevels implements Action {
  readonly type = LocationMappingActionTypes.LOAD_LEVELS;
}
export class LoadLevelsSuccess implements Action {
  readonly type = LocationMappingActionTypes.LOAD_LEVELS_SUCCESS;
  constructor(public payload: Lov[]) {}
}

export class LoadLevelsFailure implements Action {
  readonly type = LocationMappingActionTypes.LOAD_LEVELS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadRegions implements Action {
  readonly type = LocationMappingActionTypes.LOAD_REGIONS;
}
export class LoadRegionsSuccess implements Action {
  readonly type = LocationMappingActionTypes.LOAD_REGIONS_SUCCESS;
  constructor(public payload: RegionSummary[]) {}
}

export class LoadRegionsFailure implements Action {
  readonly type = LocationMappingActionTypes.LOAD_REGIONS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadCountries implements Action {
  readonly type = LocationMappingActionTypes.LOAD_COUNTRIES;
}

export class LoadCountriesSuccess implements Action {
  readonly type = LocationMappingActionTypes.LOAD_COUNTRIES_SUCCESS;
  constructor(public payload: CountrySummary[]) {}
}

export class LoadCountriesFailure implements Action {
  readonly type = LocationMappingActionTypes.LOAD_COUNTRIES_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadStates implements Action {
  readonly type = LocationMappingActionTypes.LOAD_STATES;
  constructor(public payload: { countryCode: string; regionCodes: string[] }) {}
}

export class LoadStatesSuccess implements Action {
  readonly type = LocationMappingActionTypes.LOAD_STATES_SUCCESS;
  constructor(public payload: StateSummary[]) {}
}

export class LoadStatesFailure implements Action {
  readonly type = LocationMappingActionTypes.LOAD_STATES_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadTowns implements Action {
  readonly type = LocationMappingActionTypes.LOAD_TOWNS;
  constructor(public payload: string) {}
}

export class LoadTownsSuccess implements Action {
  readonly type = LocationMappingActionTypes.LOAD_TOWNS_SUCCESS;
  constructor(public payload: TownSummary[]) {}
}

export class LoadTownsFailure implements Action {
  readonly type = LocationMappingActionTypes.LOAD_TOWNS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class ResetError implements Action {
  readonly type = LocationMappingActionTypes.RESET_ERROR;
}

export class UpdateLocationMapping implements Action {
  readonly type = LocationMappingActionTypes.UPDATE_LOCATION_MAPPING;
  constructor(public payload: UpdateLocationMappingPayload) {}
}
export class UpdateLocationMappingSuccess implements Action {
  readonly type = LocationMappingActionTypes.UPDATE_LOCATION_MAPPING_SUCCESS;
}
export class UpdateLocationMappingFailure implements Action {
  readonly type = LocationMappingActionTypes.UPDATE_LOCATION_MAPPING_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadMappedLocations implements Action {
  readonly type = LocationMappingActionTypes.LOAD_MAPPED_LOCATIONS;
  constructor(public payload: LoadMappedLocationsPayload) {}
}
export class LoadMappedLocationsSuccess implements Action {
  readonly type = LocationMappingActionTypes.LOAD_MAPPED_LOCATIONS_SUCCESS;
  constructor(public payload: LocationMappingOption[]) {}
}
export class LoadMappedLocationsFailure implements Action {
  readonly type = LocationMappingActionTypes.LOAD_MAPPED_LOCATIONS_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class ResetMappedLocations implements Action {
  readonly type = LocationMappingActionTypes.RESET_MAPPED_LOCATIONS;
}
export class ResetActiveConfigs implements Action {
  readonly type = LocationMappingActionTypes.RESET_ACTIVE_CONFIGS;
}
/**
 * Stock Receive Actions Type
 */
export type LocationMappingActions =
  | SearchLocations
  | SearchLocationsSuccess
  | SearchLocationsFailure
  | Clear
  | LoadBrands
  | LoadBrandsSuccess
  | LoadBrandsFailure
  | LoadRegions
  | LoadRegionsSuccess
  | LoadRegionsFailure
  | LoadLevels
  | LoadLevelsSuccess
  | LoadLevelsFailure
  | LoadCountries
  | LoadCountriesSuccess
  | LoadCountriesFailure
  | LoadStates
  | LoadStatesSuccess
  | LoadStatesFailure
  | LoadTowns
  | LoadTownsSuccess
  | LoadTownsFailure
  | LoadActiveConfigs
  | LoadActiveConfigsSuccess
  | LoadActiveConfigsFailure
  | UpdateLocationMapping
  | UpdateLocationMappingSuccess
  | UpdateLocationMappingFailure
  | LoadMappedLocations
  | LoadMappedLocationsSuccess
  | LoadMappedLocationsFailure
  | ResetError
  | ResetMappedLocations
  | ResetActiveConfigs;
