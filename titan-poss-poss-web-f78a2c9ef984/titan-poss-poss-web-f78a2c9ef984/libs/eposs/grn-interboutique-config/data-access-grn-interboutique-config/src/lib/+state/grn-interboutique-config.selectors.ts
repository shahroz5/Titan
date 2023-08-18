import { createSelector } from '@ngrx/store';
import { selectGrnInterboutiqueConfigState } from './grn-interboutique-config.reducer';


const selectGrnInterboutiqueConfigDetails = createSelector(
    selectGrnInterboutiqueConfigState,
    state => state.grnInterboutiqueConfigDetails
);

const selectIsLoading = createSelector(
    selectGrnInterboutiqueConfigState,
    state => state.isLoading
);

const selectEditGrnInterboutiqueConfigResponses = createSelector(
    selectGrnInterboutiqueConfigState,
    state => state.editGrnInterboutiqueConfigResponses
);

const selectError = createSelector(
    selectGrnInterboutiqueConfigState,
    state => state.error
);


export const GrnInterboutiqueConfigSelectors = {
    selectGrnInterboutiqueConfigDetails,
    selectEditGrnInterboutiqueConfigResponses,
    selectIsLoading,
    selectError
};
