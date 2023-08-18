import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { tepApprovalListResponse } from '@poss-web/shared/models';

export interface TepApprovalEntity extends EntityState<tepApprovalListResponse> {}
export const tepApprovalAdapter = createEntityAdapter<tepApprovalListResponse>({
  selectId:list => list.processId
});

export const  tepApprovalSelector = tepApprovalAdapter.getSelectors();
