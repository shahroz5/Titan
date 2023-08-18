import { CnApprovalListResponse } from '@poss-web/shared/models';
import { EntityState, createEntityAdapter } from '@ngrx/entity';

export interface CnRequestListEntity
  extends EntityState<CnApprovalListResponse> {}

export const cnRequestListAdaptor = createEntityAdapter<CnApprovalListResponse>(
  {
    selectId: request => request.processId
  }
);

export const cnRequestListSelector = cnRequestListAdaptor.getSelectors();
