import { selectActivateUserState } from './activate-user.reducer';

import { createSelector } from '@ngrx/store';
import { ActivateUserState } from './activate-user.state';

export const selectActivateUser = createSelector(
  selectActivateUserState,
  (state: ActivateUserState) => state
);

const generatedOtp = createSelector(
  selectActivateUser,
  (state: ActivateUserState) => state.generatedOtp
);

const verifiedOtp = createSelector(
  selectActivateUser,
  (state: ActivateUserState) => state.verifiedOtp
);

const fetchUsername = createSelector(
  selectActivateUser,
  (state: ActivateUserState) => state.username
);

const selectError = createSelector(
  selectActivateUser,
  (state: ActivateUserState) => state.error
);

const isLoading = createSelector(
  selectActivateUser,
  (state: ActivateUserState) => state.isLoading
);

export const ActivateUserSelectors = {
  selectError,
  isLoading,
  generatedOtp,
  verifiedOtp,
  fetchUsername
};
