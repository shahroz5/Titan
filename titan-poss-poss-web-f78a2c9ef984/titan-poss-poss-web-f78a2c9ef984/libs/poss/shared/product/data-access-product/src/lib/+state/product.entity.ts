import { EntityState, createEntityAdapter } from '@ngrx/entity';
import {
  ProductDetails,
  CashMemoItemDetailsResponse,
  COItemDetailsResponse
} from '@poss-web/shared/models';

export interface ProductDetailsEntity extends EntityState<ProductDetails> {}
export const productDetailsAdapter = createEntityAdapter<ProductDetails>({
  selectId: productDetails => productDetails.inventoryId
});
export const productDetailsSelector = productDetailsAdapter.getSelectors();

export interface ItemDetailsEntity
  extends EntityState<CashMemoItemDetailsResponse> {}
export const itemDetailsAdapter = createEntityAdapter<
  CashMemoItemDetailsResponse
>({
  selectId: itemDetails => itemDetails.itemId
});

export const itemDetailsSelector = itemDetailsAdapter.getSelectors();

export interface COItemDetailsEntity
  extends EntityState<COItemDetailsResponse> {}
export const COItemDetailsAdapter = createEntityAdapter<COItemDetailsResponse>({
  selectId: COItemDetails => COItemDetails.itemId
});

export const COItemDetailsSelector = COItemDetailsAdapter.getSelectors();
