import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { GrnReqStatus } from '@poss-web/shared/models';

export interface GrnRequestItemEntity extends EntityState<GrnReqStatus> {}

export const grnReqItemAdaptor = createEntityAdapter<GrnReqStatus>({
  selectId: item => item.grnId
});

export const grnReqItemSelector = grnReqItemAdaptor.getSelectors();
