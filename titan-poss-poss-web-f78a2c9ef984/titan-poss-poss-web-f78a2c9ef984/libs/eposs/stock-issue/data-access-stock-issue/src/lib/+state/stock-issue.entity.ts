import { EntityState, createEntityAdapter } from '@ngrx/entity';
import {
  IssueInventoryItem,
  StockRequestNote,
  RequestInvoice
} from '@poss-web/shared/models';

export interface RequestStockTransferNoteEntity
  extends EntityState<StockRequestNote> {}
export const requestStockTransferNoteAdaptor = createEntityAdapter<
  StockRequestNote
>({
  selectId: requestStockTransferNote => requestStockTransferNote.id
});
export const requestStockTransferNoteSelector = requestStockTransferNoteAdaptor.getSelectors();

export interface IssueItemEntity extends EntityState<IssueInventoryItem> {}
export const issueItemAdaptor = createEntityAdapter<IssueInventoryItem>({
  selectId: issueItem => issueItem.id
});
export const issueItemSelector = issueItemAdaptor.getSelectors();

export interface RequestInvoiceEntity extends EntityState<RequestInvoice> {}
export const requestInvoiceAdaptor = createEntityAdapter<RequestInvoice>({
  selectId: requestInvoice => requestInvoice.id
});
export const requestInvoiceSelector = requestInvoiceAdaptor.getSelectors();
