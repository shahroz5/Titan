import { EntityState, createEntityAdapter } from '@ngrx/entity';

import { AbManualRequestList } from '@poss-web/shared/models';

export interface AbManualRequestListEntity
  extends EntityState<AbManualRequestList> {}
export const AbManualRequestListAdapter = createEntityAdapter<
  AbManualRequestList
>({
  selectId: abManualRequestList => abManualRequestList.processId
});
export const AbManualRequestListSelector = AbManualRequestListAdapter.getSelectors();

export interface ItemDetailsEntity extends EntityState<any> {}
export const itemDetailsAdapter = createEntityAdapter<any>({
  selectId: itemDetails => itemDetails.itemId
});
export const itemDetailsSelector = itemDetailsAdapter.getSelectors();
