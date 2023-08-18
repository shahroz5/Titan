import { EntityState, createEntityAdapter } from '@ngrx/entity';
import {
  BinToBinTransferItem,
  BinToBinTransferItemListGroup,
  BinToBinTransferHistoryItemHeader
} from '@poss-web/shared/models';

export interface ItemEntity extends EntityState<BinToBinTransferItem> {}
export const itemAdapter = createEntityAdapter<BinToBinTransferItem>({
  selectId: item => item.id
});
export const itemSelector = itemAdapter.getSelectors();

export interface ItemListGroupEntity
  extends EntityState<BinToBinTransferItemListGroup> {}
export const itemListGroupAdapter = createEntityAdapter<
  BinToBinTransferItemListGroup
>({
  selectId: itemListGroup => itemListGroup.id
});
export const itemListGroupSelector = itemListGroupAdapter.getSelectors();

export interface BinToBinTransferEntity
  extends EntityState<BinToBinTransferHistoryItemHeader> {}
export const binToBinTransferHistoryAdaptor = createEntityAdapter<
  BinToBinTransferHistoryItemHeader
>({
  selectId: binToBinTransfer => binToBinTransfer.id
});
export const binToBinHistorySelector = binToBinTransferHistoryAdaptor.getSelectors();
