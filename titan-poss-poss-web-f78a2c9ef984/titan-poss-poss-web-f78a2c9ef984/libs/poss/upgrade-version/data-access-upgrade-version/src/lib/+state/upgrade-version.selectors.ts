import { createSelector } from '@ngrx/store';
import { selectUpgradeVersionState } from './upgrade-version.reducer';
import { state } from '@angular/animations';

const selectError = createSelector(
  selectUpgradeVersionState,
  state => state.errors
);

const selectIsLoading = createSelector(
  selectUpgradeVersionState,
  state => state.isLoading
);

const selectIsUpgradeAvailable = createSelector(
  selectUpgradeVersionState,
  state => state.upgradeVersion
);

const selectSendRequestForUpgrade = createSelector(
  selectUpgradeVersionState,
  state => state.upgradeVersionResponse
);

export const UpgradeVersionSelectors = {
  selectError,
  selectIsLoading,
  selectIsUpgradeAvailable,
  selectSendRequestForUpgrade
};
