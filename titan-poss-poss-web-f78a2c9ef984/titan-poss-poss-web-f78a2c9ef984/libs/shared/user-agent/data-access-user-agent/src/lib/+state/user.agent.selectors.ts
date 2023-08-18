import { createSelector } from '@ngrx/store';
import { selectUAState } from './user.agent.reducer';
const selectError = createSelector(
  selectUAState,
  state => state.error
);

const selectIsLoading = createSelector(
  selectUAState,
  state => state.isLoading
);
const selectEncryptedHostname = createSelector(
  selectUAState,
  state => state.hostname
);


export const UASelectors = {
 
  selectEncryptedHostname,
  selectIsLoading,
  selectError
};
