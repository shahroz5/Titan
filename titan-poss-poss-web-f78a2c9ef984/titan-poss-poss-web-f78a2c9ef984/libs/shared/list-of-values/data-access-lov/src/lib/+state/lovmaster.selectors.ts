import { createSelector } from '@ngrx/store';
import { selectLovMasterState } from './lovmaster.reducer';


const selectLovMasterTypes = createSelector(
  selectLovMasterState,
  state => state.lovMasterTypes
);

const selectLovMasterTypesMain = createSelector(
  selectLovMasterState,
  state => state.lovMasterTypesMain
);

const selectLovMasterListing = createSelector(
  selectLovMasterState,
  state => state.lovMasterListing
);

const selectLovMasterDetails = createSelector(
  selectLovMasterState,
  state => state.lovMasterDetails
);


const selectTotalLovMasterDetails = createSelector(
  selectLovMasterState,
  state => state.totalMasterDetails
);

const selectIsLoading = createSelector(
  selectLovMasterState,
  state => state.isLoading
);


const selectError = createSelector(
  selectLovMasterState,
  state => state.error
);


const selectSaveLovMasterFormResponse = createSelector(
  selectLovMasterState,
  state => state.saveLovMasterDetails
);

const selectEditLovMasterFormResponse = createSelector(
  selectLovMasterState,
  state => state.editLovMasterDetails
);


export const LovMasterSelectors = {
  selectLovMasterTypes,
  selectLovMasterListing,
  selectLovMasterDetails,
  selectTotalLovMasterDetails,
  selectIsLoading,
  selectError,
  selectSaveLovMasterFormResponse,
  selectEditLovMasterFormResponse,
  selectLovMasterTypesMain
};
