import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { RequestApprovals, RequestApprovalsItems,BinRequestApprovalsItems } from '@poss-web/shared/models';


export interface ItemEntity extends EntityState<BinRequestApprovalsItems> { }

export const itemAdapter = createEntityAdapter<BinRequestApprovalsItems>({
  selectId: item => item.id

});

export const itemSelector = itemAdapter.getSelectors();


export interface IbtRequestEntity extends EntityState<RequestApprovals> { }
export const ibtRequestAdapter = createEntityAdapter<RequestApprovals>({
  selectId: ibtRequest => ibtRequest.id
});
export const ibtRequestSelector = ibtRequestAdapter.getSelectors();

export interface IbtRequestItemsEntity extends EntityState<RequestApprovalsItems> { }
export const ibtRequestItemAdapter = createEntityAdapter<RequestApprovalsItems>({
  selectId: ibtRequestItem => ibtRequestItem.id
});
export const ibtRequestItemSelector = ibtRequestItemAdapter.getSelectors();
