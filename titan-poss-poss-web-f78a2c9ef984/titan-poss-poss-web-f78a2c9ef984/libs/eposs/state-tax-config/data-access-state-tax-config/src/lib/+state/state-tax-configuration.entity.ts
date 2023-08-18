import { EntityState, createEntityAdapter } from '@ngrx/entity';
import {
  TaxDetailsConfig, StateTaxConfigurationListingData
} from '@poss-web/shared/models';

export interface StateTaxConfigurationEntity extends EntityState<any> { }


export const StateTaxConfigurationListingAdapter = createEntityAdapter<StateTaxConfigurationListingData>({
  selectId: data => data.id
});
export const stateTaxConfigurationListingAdapterSelector = StateTaxConfigurationListingAdapter.getSelectors();


export const taxDetailsConfigListingAdapter = createEntityAdapter<TaxDetailsConfig>({
  selectId: data => data.id
});
export const taxDetailsConfigListingSelector = taxDetailsConfigListingAdapter.getSelectors();
