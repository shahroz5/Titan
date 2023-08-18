import { createSelector } from '@ngrx/store';

import { selectInventoryHomeState } from './inventory-home.reducer';

const selectPendingFactorySTNCount = createSelector(
  selectInventoryHomeState,
  state => state.pendingFactorySTNCount
);

const selectPendingBoutiqueSTNCount = createSelector(
  selectInventoryHomeState,
  state => state.pendingBoutiqueSTNCount
);

const selectPendingMerchandiseSTNcount = createSelector(
  selectInventoryHomeState,
  state => state.pendingMerchandiseSTNcount
);

const selectPendingCFASTNCount = createSelector(
  selectInventoryHomeState,
  state => state.pendingCFASTNCount
);

const selectIsLoadingCount = createSelector(
  selectInventoryHomeState,
  state => state.isLoadingCount
);

const selectPendingBTQ_FAC_STNCount = createSelector(
  selectInventoryHomeState,
  state => state.pendingBTQ_FAC_STNCount
);

const selectPendingBTQ_BTQ_STNCount = createSelector(
  selectInventoryHomeState,
  state => state.pendingBTQ_BTQ_STNCount
);
const selectPendingBTQ_MER_STNCount = createSelector(
  selectInventoryHomeState,
  state => state.pendingBTQ_MER_STNCount
);

const selectIsLoadingIssueCount = createSelector(
  selectInventoryHomeState,
  state => state.isLoadingIssueCount
);

const selectError = createSelector(
  selectInventoryHomeState,
  state => state.error
);

export const inventoryHomeSelectors = {
  selectPendingFactorySTNCount,
  selectPendingBoutiqueSTNCount,
  selectPendingMerchandiseSTNcount,
  selectPendingCFASTNCount,
  selectIsLoadingCount,

  selectPendingBTQ_BTQ_STNCount,
  selectPendingBTQ_FAC_STNCount,
  selectPendingBTQ_MER_STNCount,
  selectIsLoadingIssueCount,

  selectError
};
