import { EntityState, createEntityAdapter } from '@ngrx/entity';

import { LocationListingData } from '@poss-web/shared/models';



export interface LocationListingEntity extends EntityState<LocationListingData> { }

export const locationListAdapter = createEntityAdapter<LocationListingData>({
  selectId: locationList => locationList.locationCode
});

export const locationSelector = locationListAdapter.getSelectors();




