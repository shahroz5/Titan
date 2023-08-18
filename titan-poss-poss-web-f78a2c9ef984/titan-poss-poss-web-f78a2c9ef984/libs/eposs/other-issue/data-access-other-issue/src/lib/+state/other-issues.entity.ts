
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import {
  OtherIssueModel,
  OtherIssuesItem,
  OtherIssuesHistoryItem
} from '@poss-web/shared/models';

export interface OtherIssueEntity extends EntityState<OtherIssueModel> {}
export const otherIssueAdapter = createEntityAdapter<OtherIssueModel>({
  selectId: otherIssueData => otherIssueData.id
});
export const otheIssueSelector = otherIssueAdapter.getSelectors();




export interface OtherIssueItemEntity extends EntityState<OtherIssuesItem> {}
export const otherIssuesItemAdapter = createEntityAdapter<OtherIssuesItem>({
  selectId: item => item.id
});
export const otherIssueItemSelector = otherIssuesItemAdapter.getSelectors();

export interface OtherIssueCreateItemEntity
  extends EntityState<OtherIssuesItem> {}
export const otherIssuesCreateItemAdapter = createEntityAdapter<
  OtherIssuesItem
>({
  selectId: item => item.inventoryId
});
export const otherIssueCreateItemSelector = otherIssuesCreateItemAdapter.getSelectors();

export interface OtherIssueHistoryItemEntity
  extends EntityState<OtherIssuesHistoryItem> {}
export const otherIssuesHistoryItemAdapter = createEntityAdapter<
  OtherIssuesHistoryItem
>({
  selectId: item => item.id
});
export const otherIssueHistoryItemSelector = otherIssuesHistoryItemAdapter.getSelectors();
