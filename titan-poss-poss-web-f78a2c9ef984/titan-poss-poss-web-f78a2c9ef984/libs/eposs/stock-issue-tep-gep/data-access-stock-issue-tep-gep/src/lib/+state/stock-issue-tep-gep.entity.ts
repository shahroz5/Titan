import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { StockIssueItem } from '@poss-web/shared/models';

export interface ItemsEntity extends EntityState<StockIssueItem> {}
export const itemsAdapter = createEntityAdapter<StockIssueItem>({
  selectId: items => items.inventoryId
});
export const itemsSelector = itemsAdapter.getSelectors();

export interface StockIssueItemsEntity extends EntityState<StockIssueItem> {}
export const stockIssueItemsAdapter = createEntityAdapter<StockIssueItem>({
  selectId: items => items.id
});
export const stockIssueItemsSelector = stockIssueItemsAdapter.getSelectors();
