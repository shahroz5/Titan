import { EntityState, createEntityAdapter } from '@ngrx/entity';
import {
  BillCancellation,
  CashMemoItemDetails,
  ProductDetails
} from '@poss-web/shared/models';

export interface BillDetailsEntity extends EntityState<BillCancellation> {}
export const billDetailsAdapter = createEntityAdapter<BillCancellation>({
  selectId: billDetails => billDetails.taskId
});

export const BillDetailsSelector = billDetailsAdapter.getSelectors();
export interface ProductDetailsEntity extends EntityState<ProductDetails> {}
export const productDetailsAdapter = createEntityAdapter<ProductDetails>({
  selectId: productDetails => productDetails.inventoryId
});
export const productDetailsSelector = productDetailsAdapter.getSelectors();

export interface ItemDetailsEntity extends EntityState<CashMemoItemDetails> {}
export const itemDetailsAdapter = createEntityAdapter<CashMemoItemDetails>({
  selectId: itemDetails => itemDetails.itemId
});

export const itemDetailsSelector = itemDetailsAdapter.getSelectors();
export interface BillStatusEntity extends EntityState<any> {}
export const billStatusAdapter = createEntityAdapter<any>({
  selectId: item => item.processId
});

export const billSelector = billStatusAdapter.getSelectors();
