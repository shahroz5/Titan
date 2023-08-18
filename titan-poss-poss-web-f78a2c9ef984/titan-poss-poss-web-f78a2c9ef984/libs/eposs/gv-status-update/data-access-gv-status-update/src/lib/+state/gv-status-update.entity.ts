import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { GvStatusList } from '@poss-web/shared/models';

export interface GVStatusUpdateEntity extends EntityState<GvStatusList> {}
export const gvStatusUpdateAdapter = createEntityAdapter<GvStatusList>({
  selectId:List => List.serialNo
});

export const gvStatusUpdateSelector = gvStatusUpdateAdapter.getSelectors();

// Todo add sort by line item number
