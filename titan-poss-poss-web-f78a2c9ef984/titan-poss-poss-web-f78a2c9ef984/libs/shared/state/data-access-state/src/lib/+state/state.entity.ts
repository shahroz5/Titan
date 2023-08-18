import { EntityState, createEntityAdapter } from '@ngrx/entity';
import {
  StateData,
  CountriesDetails,
  LoadStateTaxClassListing
} from '@poss-web/shared/models';

export interface StateEntity extends EntityState<any> { }

export const stateAdapter = createEntityAdapter<StateData>({
  selectId: state => state.stateId
});

export const countryAdapter = createEntityAdapter<CountriesDetails>({
  selectId: country => country.countryCode
});



export const stateTaxAdapter = createEntityAdapter<LoadStateTaxClassListing>({
  selectId: stateTax => stateTax.taxClassCode
});

export const stateSelector = stateAdapter.getSelectors();
export const countrySelector = countryAdapter.getSelectors();

export const stateTaxSelector = stateTaxAdapter.getSelectors();
