import { EntityState, createEntityAdapter } from '@ngrx/entity';

import { PriceGroupMaster } from '@poss-web/shared/models';
export interface PriceGroupEntity extends EntityState<PriceGroupMaster> { }

export const priceGroupAdaptor = createEntityAdapter<PriceGroupMaster>({
  selectId: priceGroupList => priceGroupList.priceGroup
});

export const priceGroupSelector = priceGroupAdaptor.getSelectors();
