import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { SubRegion, RegionsData } from '@poss-web/shared/models';


export interface SubRegionEntity extends EntityState<SubRegion> { }

export const subRegionAdapter = createEntityAdapter<SubRegion>({
  selectId: subRegion => subRegion.regionCode
});

export const regionAdapter = createEntityAdapter<RegionsData>({
  selectId: region => region.regionCode
});

export const regionSelector = regionAdapter.getSelectors();
export const subRegionSelector = subRegionAdapter.getSelectors();

