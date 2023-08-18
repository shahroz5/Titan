import { RoRequestApprovalListResponse } from '@poss-web/shared/models';
import { EntityState, createEntityAdapter } from '@ngrx/entity';

export interface RequestListEntity
  extends EntityState<RoRequestApprovalListResponse> {}

export const requestListAdaptor = createEntityAdapter<
  RoRequestApprovalListResponse
>({
  selectId: request => request.processId
});

export const requestListSelector = requestListAdaptor.getSelectors();
