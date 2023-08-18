import { createSelector } from '@ngrx/store';
import { selectCatchmentState } from './catchment.reducer';


const selectCatchmentListing = createSelector(
    selectCatchmentState,
    state => state.catchmentListing
);

const selectCatchmentDetails = createSelector(
    selectCatchmentState,
    state => state.catchmentDetails
);

const selectTotalCatchmentDetailsCount = createSelector(
    selectCatchmentState,
    state => state.totalCatchmentDetails
);

const selectSaveCatchmentResponses = createSelector(
    selectCatchmentState,
    state => state.saveCatchmentResponses
);

const selectEditCatchmentResponses = createSelector(
    selectCatchmentState,
    state => state.editCatchmentResponses
);

const selectIsLoading = createSelector(
    selectCatchmentState,
    state => state.isLoading
);

const selectError = createSelector(
    selectCatchmentState,
    state => state.error
);



export const CatchmentSelectors = {
    selectCatchmentListing,
    selectCatchmentDetails,
    selectSaveCatchmentResponses,
    selectEditCatchmentResponses,
    selectTotalCatchmentDetailsCount,
    selectIsLoading,
    selectError
};
