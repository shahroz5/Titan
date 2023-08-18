import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { CountryData } from '@poss-web/shared/models';

export interface CountryEntity extends EntityState<CountryData> {}
export const countryAdapter = createEntityAdapter<CountryData>({
  selectId: country => country.description
});
export const countrySelector = countryAdapter.getSelectors();
