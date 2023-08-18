import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { StockReturnItem, RequestInvoice, StockIssueItem, LoadItemsSuccessCfaPayload } from '@poss-web/shared/models';

export interface ItemEntity extends EntityState<StockReturnItem> {}
export const itemAdaptor = createEntityAdapter<StockReturnItem>({
  selectId: item => item.id
});

export const itemsAdapter = createEntityAdapter<StockIssueItem>({
  selectId: items => items.inventoryId
});
export const itemsAdapters = createEntityAdapter<LoadItemsSuccessCfaPayload>({
  selectId: items => items.inventoryId
});
export const itemSelector = itemAdaptor.getSelectors();
export interface RequestInvoiceEntity extends EntityState<RequestInvoice> {}
export const requestInvoiceAdaptor = createEntityAdapter<RequestInvoice>({
  selectId: requestInvoice => requestInvoice.id
});
export const requestInvoiceSelector = requestInvoiceAdaptor.getSelectors();
