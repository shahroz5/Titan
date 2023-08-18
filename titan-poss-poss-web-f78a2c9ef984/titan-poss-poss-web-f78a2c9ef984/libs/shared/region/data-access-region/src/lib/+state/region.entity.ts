import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { RegionsData } from '@poss-web/shared/models';



export interface RegionEntity extends EntityState<RegionsData> {}

export const regionAdapter = createEntityAdapter<RegionsData>({
  selectId: region => region.regionCode
});

export const regionSelector = regionAdapter.getSelectors();
