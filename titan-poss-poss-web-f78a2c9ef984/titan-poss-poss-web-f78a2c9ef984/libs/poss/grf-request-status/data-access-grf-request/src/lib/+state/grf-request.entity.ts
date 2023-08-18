import { EntityState, createEntityAdapter } from '@ngrx/entity';

import { CashMemoItemDetails, CmRequestList } from '@poss-web/shared/models';

export interface CmRequestListEntity extends EntityState<CmRequestList> {}
export const cmRequestListAdapter = createEntityAdapter<CmRequestList>({
  selectId: cmRequestList => cmRequestList.processId
});
export const cmRequestListSelector = cmRequestListAdapter.getSelectors();

export interface ItemDetailsEntity extends EntityState<CashMemoItemDetails> {}
export const itemDetailsAdapter = createEntityAdapter<CashMemoItemDetails>({
  selectId: itemDetails => itemDetails.itemId
});
export const itemDetailsSelector = itemDetailsAdapter.getSelectors();
