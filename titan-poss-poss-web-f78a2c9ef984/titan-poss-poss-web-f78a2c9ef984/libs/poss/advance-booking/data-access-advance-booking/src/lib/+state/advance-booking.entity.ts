import { EntityState, createEntityAdapter } from '@ngrx/entity';
import {
  AdvanceBookingDetailsResponse,
  RequestStatus
} from '@poss-web/shared/models';

// export interface ProductDetailsEntity extends EntityState<ProductDetails> {}
// export const productDetailsAdapter = createEntityAdapter<ProductDetails>({
//   selectId: productDetails => productDetails.inventoryId
// });
// export const productDetailsSelector = productDetailsAdapter.getSelectors();

// export interface ItemDetailsEntity
//   extends EntityState<CashMemoItemDetailsResponse> {}
// export const itemDetailsAdapter = createEntityAdapter<
//   CashMemoItemDetailsResponse
// >({
//   selectId: itemDetails => itemDetails.itemId
// });

// export const itemDetailsSelector = itemDetailsAdapter.getSelectors();

export interface ABEntity extends EntityState<AdvanceBookingDetailsResponse> {}
export const ABAdapter = createEntityAdapter<AdvanceBookingDetailsResponse>({
  selectId: data => data.id
});
export const ABSelector = ABAdapter.getSelectors();

export interface ABRequestStatusListEntity extends EntityState<RequestStatus> {}
export const ABRequestStatusListAdapter = createEntityAdapter<RequestStatus>({
  selectId: data => data.processId
});
export const ABRequestStatusListSelector = ABRequestStatusListAdapter.getSelectors();
