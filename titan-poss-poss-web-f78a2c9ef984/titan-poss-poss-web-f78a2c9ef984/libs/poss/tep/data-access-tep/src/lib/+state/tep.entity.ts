import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { RefundStatus, RequestStatus } from '@poss-web/shared/models';

export interface TEPRequestStatusListEntity
  extends EntityState<RequestStatus> {}
export const TEPRequestStatusListAdapter = createEntityAdapter<RequestStatus>({
  selectId: data => data.processId
});
export const TEPRequestStatusListSelector = TEPRequestStatusListAdapter.getSelectors();

export interface TEPRefundStatusListEntity extends EntityState<RefundStatus> {}
export const TEPRefundStatusListAdapter = createEntityAdapter<RefundStatus>({
  selectId: data => data.id
});
export const TEPRefundStatusListSelector = TEPRefundStatusListAdapter.getSelectors();


