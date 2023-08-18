import { EntityState, createEntityAdapter } from '@ngrx/entity';
import {
  TEPProductGroupConfigDetails,
  TEPProductGroupMappingDetails
} from '@poss-web/shared/models';

export interface TepProductGroupConfigEntity
  extends EntityState<TEPProductGroupConfigDetails> {}

export const tepProductGroupConfigAdaptor = createEntityAdapter<
  TEPProductGroupConfigDetails
>({
  selectId: tepProductGroupConfig => tepProductGroupConfig.configId
});

export const tepProductGroupConfigSelector = tepProductGroupConfigAdaptor.getSelectors();

export interface TepProductGroupMappingEntity
  extends EntityState<TEPProductGroupMappingDetails> {}

export const tepProductGroupMappingAdaptor = createEntityAdapter<
  TEPProductGroupMappingDetails
>({
  selectId: tepProductGroupMapping => tepProductGroupMapping.id
});

export const tepProductGroupMappingSelector = tepProductGroupMappingAdaptor.getSelectors();
