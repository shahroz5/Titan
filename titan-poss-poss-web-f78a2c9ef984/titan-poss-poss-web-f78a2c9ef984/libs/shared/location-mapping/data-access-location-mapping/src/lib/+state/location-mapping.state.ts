import {
  LocationSummaryList,
  StateSummary,
  TownSummary,
  CountrySummary,
  RegionSummary,
  BrandSummary,
  CustomErrors,
  Lov,
  ActiveConfig,
  LocationMappingOption
} from '@poss-web/shared/models';

export interface LocationMappingState {
  locations: LocationSummaryList[];
  brands: BrandSummary[];
  regions: RegionSummary[];
  levels: Lov[];
  countries: CountrySummary[];
  states: StateSummary[];
  towns: TownSummary[];
  mappedLocations: LocationMappingOption[];
  activeConfigs: ActiveConfig[];
  updateStatus: {
    isSuccess: boolean;
  };
  error: CustomErrors;
}
