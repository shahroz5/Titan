import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { TEPStoneConfig, TEPStoneConfigDetails } from '@poss-web/shared/models';

export interface TepStoneConfigEntity extends EntityState<TEPStoneConfig> {}

export const tepStoneConfigAdaptor = createEntityAdapter<TEPStoneConfig>({
  selectId: tepStoneConfig => tepStoneConfig.configId
});

export const tepStoneConfigSelector = tepStoneConfigAdaptor.getSelectors();

export interface TepStoneConfigDetailsEntity
  extends EntityState<TEPStoneConfigDetails> {}

export const tepStoneConfigDetailsAdaptor = createEntityAdapter<
  TEPStoneConfigDetails
>({
  selectId: tepStoneConfig => tepStoneConfig.id
});

export const tepStoneConfigDetailsSelector = tepStoneConfigDetailsAdaptor.getSelectors();
