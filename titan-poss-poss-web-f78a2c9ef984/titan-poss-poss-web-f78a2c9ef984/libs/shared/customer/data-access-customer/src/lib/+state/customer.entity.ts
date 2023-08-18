import {
  CountrySummary,
  Zone,
  CustomerStateSummary
} from '@poss-web/shared/models';

import { EntityState, createEntityAdapter } from '@ngrx/entity';

export interface CountryEntity extends EntityState<CountrySummary> {}
export const countryAdapter = createEntityAdapter<CountrySummary>({
  selectId: country => country.description
});
export const countrySelector = countryAdapter.getSelectors();

export interface StateEntity extends EntityState<CustomerStateSummary> {}
export const stateAdapter = createEntityAdapter<CustomerStateSummary>({
  selectId: state => state.description
});
export const stateSelector = stateAdapter.getSelectors();

export interface ZoneEntity extends EntityState<Zone> {}
export const zoneAdapter = createEntityAdapter<Zone>({
  selectId: zone => zone.zoneCode
});
export const zoneSelector = zoneAdapter.getSelectors();
