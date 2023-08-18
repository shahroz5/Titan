import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { PriceGroupMaster } from '@poss-web/shared/models';

// -----
export interface PriceGroupMasterEntity extends EntityState<PriceGroupMaster> {}

export const PriceGroupMasterAdaptor = createEntityAdapter<PriceGroupMaster>({
  selectId: priceGroupMaster => priceGroupMaster.priceGroup
});
export const priceGroupMasterSelector = PriceGroupMasterAdaptor.getSelectors();
// -----

// // -----
// export interface TepProductGroupMappingEntity
//   extends EntityState<TEPProductGroupMappingDetails> {}

// export const tepProductGroupMappingAdaptor = createEntityAdapter<
//   TEPProductGroupMappingDetails
// >({
//   selectId: tepProductGroupMapping => tepProductGroupMapping.id
// });

// export const tepProductGroupMappingSelector = tepProductGroupMappingAdaptor.getSelectors();
// // -----
