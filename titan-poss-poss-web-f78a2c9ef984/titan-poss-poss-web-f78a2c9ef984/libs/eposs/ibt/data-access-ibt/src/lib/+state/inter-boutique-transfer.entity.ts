import { EntityState, createEntityAdapter } from '@ngrx/entity';

import {
  RequestList,
  ItemList,
  BoutiqueList,
  IBThistoryHeaderPayload
} from '@poss-web/shared/models';

export interface RequestListEntity extends EntityState<RequestList> {}
export const requestListAdapter = createEntityAdapter<RequestList>({
  selectId: requestList => requestList.id
});
export const requestListSelector = requestListAdapter.getSelectors();

export interface ItemListEntity extends EntityState<ItemList> {}
export const itemListAdapter = createEntityAdapter<ItemList>({
  selectId: itemList => itemList.id
});
export const itemListSelector = itemListAdapter.getSelectors();

export interface BoutiqueListEntity extends EntityState<BoutiqueList> {}
export const boutiqueListAdapter = createEntityAdapter<BoutiqueList>({
  selectId: boutiqueList => boutiqueList.locationCode
});
export const boutiqueListSelector = boutiqueListAdapter.getSelectors();

export interface HistoryEntity extends EntityState<IBThistoryHeaderPayload> {}
export const IBTHistoryAdaptor = createEntityAdapter<IBThistoryHeaderPayload>({
  selectId: ibtHistory => ibtHistory.id
});
export const ibtHistorySelector = IBTHistoryAdaptor.getSelectors();
