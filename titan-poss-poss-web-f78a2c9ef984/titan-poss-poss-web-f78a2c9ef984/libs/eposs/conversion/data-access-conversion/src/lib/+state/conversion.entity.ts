import { createEntityAdapter, EntityState } from '@ngrx/entity';
import {
  ConversionHistory,
  ConversionInventoryItem,
  ConversionRequests
} from '@poss-web/shared/models';

export interface ConverionRequestEntity
  extends EntityState<ConversionRequests> {}
export const conversionRequestAdaptor = createEntityAdapter<ConversionRequests>(
  {
    selectId: conversionRequest => conversionRequest.id
  }
);
export const conversionRequestSelector = conversionRequestAdaptor.getSelectors();

export interface ItemEntity extends EntityState<ConversionInventoryItem> {}
export const itemAdapter = createEntityAdapter<ConversionInventoryItem>({
  selectId: item => item.id
});
export const itemSelector = itemAdapter.getSelectors();

export interface ConverionRequestHistoryEntity
  extends EntityState<ConversionHistory> {}
export const conversionRequestHistoryAdaptor = createEntityAdapter<
  ConversionHistory
>({
  selectId: conversionRequestHistory => conversionRequestHistory.id
});
export const conversionRequestHistorySelector = conversionRequestHistoryAdaptor.getSelectors();
