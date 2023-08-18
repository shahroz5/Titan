import { createEntityAdapter, EntityState } from '@ngrx/entity';
import {
  OtherReceiptItem,
  OtherReceiptsModel,
  AdjustmentItem
} from '@poss-web/shared/models';

export interface ItemEntity extends EntityState<OtherReceiptItem> {}
export const itemAdapter = createEntityAdapter<OtherReceiptItem>({
  selectId: item => item.id
});

export const itemSelector = itemAdapter.getSelectors();

export interface OtherReceiptEntity extends EntityState<OtherReceiptsModel> {}
export const OtherReceiptAdapter = createEntityAdapter<OtherReceiptsModel>({
  selectId: stockTransferNote => stockTransferNote.id
});
export const otheReceiptSelector = OtherReceiptAdapter.getSelectors();

export interface AdjustmentEntity extends EntityState<AdjustmentItem> {}
export const adjustmentAdaptor = createEntityAdapter<AdjustmentItem>({
  selectId: adjustmentItem => adjustmentItem.itemCode
});
export const adjustementSelector = adjustmentAdaptor.getSelectors();
