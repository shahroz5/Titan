import { createSelector } from '@ngrx/store';
import { selectItemDetailsState } from './item-details-popup.reducer';

const selectStoneDetails = createSelector(
  selectItemDetailsState,
  state => state.stoneDetails
);

const selectCOStoneDetails = createSelector(
  selectItemDetailsState,
  state => state.COStoneDetails
);

const selectIsLoading = createSelector(
  selectItemDetailsState,
  state => state.isLoading
);

const selectError = createSelector(
  selectItemDetailsState,
  state => state.error
);

const selectPcDesc = createSelector(
  selectItemDetailsState,
  state => state.productCategoryDesc
);

const selectPgDesc = createSelector(
  selectItemDetailsState,
  state => state.productGroupDesc
);

const selectIsDescLoaded = createSelector(
  selectPcDesc,
  selectPgDesc,
  (pcDesc, pgDesc) => {
    if (pcDesc !== null && pgDesc !== null) {
      return true;
    } else {
      return false;
    }
  }
);

export const ItemDetailsPopupSelectors = {
  selectStoneDetails,
  selectIsLoading,
  selectError,
  selectPcDesc,
  selectPgDesc,
  selectIsDescLoaded,
  selectCOStoneDetails
};
