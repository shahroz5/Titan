import {
  ConfigTypeEnum,
  LocationMappingFormType
} from './location-mapping.enum';
import { TemplateRef, EventEmitter } from '@angular/core';
import { SelectDropDownOption } from '../select-dropdown.model';

export interface LocationFilterOption {
  id: string;
  description: string;
}

export interface LocationMappingOption {
  id: string;
  description: string;
}

export interface SelectableLocation {
  id: string;
  description: string;
  isSelected: boolean;
}

export interface LocationFilterOptions {
  brands: LocationFilterOption[];
  regions: LocationFilterOption[];
  levels: LocationFilterOption[];
  countries: SelectDropDownOption[];
  states: SelectDropDownOption[];
  towns: LocationFilterOption[];
}

export interface LocationMappingConfig {
  filterConfig: LocationFilterConfig;
  selectedLocations: LocationMappingOption[];
  template?: TemplateRef<any>;
  isConfig: boolean;
  configDetails: {
    configId: string;
    configType: ConfigTypeEnum;
  };
  formType?: LocationMappingFormType;
  readonly?: boolean;
  data?: any;
  isFormApplicable?: boolean;
  formLabel?: string;
}

export interface LocationFilterConfig {
  filterOptions: LocationFilterOptions;
  minFilterSelection: number;
  selectedLocationFilters: SelectedLocationFilters;
  setInputs: {
    setLevelsFromInput: boolean;
    setBrandFromInput: boolean;
    setRegionFromInput: boolean;
    setCountriesFromInput: boolean;
    setStatesFromInput: boolean;
    setTownsFromInput: boolean;
    countryData?: {
      value: string;
      decription: string;
      states?: {
        value: string;
        description: string;
        towns?: LocationFilterOption[];
      }[];
    }[];
  };
}

export interface SelectedLocationFilters {
  brands: string[];
  regions: string[];
  levels: string[];
  countries: string[];
  states: string[];
  towns: string[];
}

export interface LocationMappingApplyResponse {
  selectedLocations: LocationMappingOption[];
  addedLocations: LocationMappingOption[];
  removedLocations: LocationMappingOption[];
  overwriteLocations: LocationMappingOption[];
}

export interface LocationMappingServiceConfig {
  selectedLocations?: { id: string; description: string }[];
  template?: TemplateRef<any>;
  isConfig?: boolean;
  configDetails?: {
    configId: string;
    configType: ConfigTypeEnum;
  };
  readonly?: boolean;
  filterOptions?: LocationFilterOptionsInput;
}

export interface LocationFilterOptionsInput {
  brands?: LocationFilterOption[];
  regions?: LocationFilterOption[];
  levels?: LocationFilterOption[];
  countries?: {
    value: string;
    decription: string;
    states?: {
      value: string;
      description: string;
      towns?: LocationFilterOption[];
    }[];
  }[];
}

export interface LocationFilterServiceConfig {
  selectedLocationFilters: SelectedLocationFilters;
}

export abstract class LocationMappingServiceAbstraction {
  public abstract open(
    serviceConfig: LocationMappingServiceConfig
  ): EventEmitter<LocationMappingServiceResponse>;

  public abstract openLocationMappingWithForm(config: {
    formType: LocationMappingFormType;
    selectedLocations?: { id: string; description: string }[];
    readonly?: boolean;
    data?: any;
    isFormApplicable?: boolean;
    filterOptions?: LocationFilterOptionsInput;
    formLabel?: string;
  }): EventEmitter<LocationMappingWithFormServiceResponse>;

  public abstract openFilter(
    serviceConfig: LocationFilterServiceConfig
  ): EventEmitter<LocationFilterServiceResponse>;

  public abstract openLocationSelectionPopUp(): EventEmitter<
    LocationSelectionServiceResponse
  >;
}

export interface LocationMappingServiceResponse {
  type: string;
  data?: LocationMappingApplyResponse;
}
export interface LocationMappingWithFormServiceResponse {
  type: string;
  data?: {
    locations: LocationMappingApplyResponse;
    config?: any;
  };
}

export interface LocationSelectionServiceResponse {
  data: {
    selectedLocations: string[];
  };
}

export interface LocationFilterServiceResponse {
  type: string;
  locations: LocationMappingOption[];
  selectedLocationFilters: SelectedLocationFilters;
}

export interface ActiveConfig {
  locationCode: string;
  configId: string;
  configName: string;
}

export interface SelectableActiveConfig {
  locationCode: string;
  configId: string;
  isSelected: boolean;
}

export interface LoadActiveConfigsPayload {
  ruleType: ConfigTypeEnum;
  data: {
    excludeRuleId?: string;
    includeLocations: string[];
  };
}

export interface UpdateLocationMappingPayload {
  ruleType: any;
  ruleID: string;
  data: {
    addLocations: string[];
    overwriteLocations: string[];
    removeLocations: string[];
  };
}

export interface LoadMappedLocationsPayload {
  ruleType: ConfigTypeEnum;
  ruleID: string;
}
