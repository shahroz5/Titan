import { GrnRequestApprovalListResponse } from '@poss-web/shared/models';
import { EntityState, createEntityAdapter } from '@ngrx/entity';

export interface GrnRequestListEntity
  extends EntityState<GrnRequestApprovalListResponse> {}

export const grnRequestListAdaptor = createEntityAdapter<
  GrnRequestApprovalListResponse
>({
  selectId: request => request.processId
});

export const grnRequestListSelector = grnRequestListAdaptor.getSelectors();
