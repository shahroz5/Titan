import { createSelector } from '@ngrx/store';
import { selectUpdateHallmarkState } from './update-hallmark.reducers';
import { itemSelector } from './update-hallmark.entity';


const selectIsHallmarkDetailsUpdated = createSelector(
  selectUpdateHallmarkState,
  state => state.isHallmarkDetailsUpdated
);

const selectHasError = createSelector(
  selectUpdateHallmarkState,
  state => state.error
);

const selectIsLoading = createSelector(
  selectUpdateHallmarkState,
  state => state.isLoading
);

export const UpdateHallmarkSelector = {
  selectIsHallmarkDetailsUpdated,
  selectHasError,
  selectIsLoading
};
