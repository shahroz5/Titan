import { createSelector } from '@ngrx/store';
import { selectStateTaxConfigurationState } from './state-tax-configuration.reducer';
import { stateTaxConfigurationListingAdapterSelector, taxDetailsConfigListingSelector } from './state-tax-configuration.entity';


const selectStateTaxConfigurationListing = createSelector(
    selectStateTaxConfigurationState,
    state => state.stateTaxConfigurationListing
);

const selectLoadedStatesListing = createSelector(
    selectStateTaxConfigurationListing,
    stateTaxConfigurationListingAdapterSelector.selectAll
);

const selectTaxDetailsStateDetails = createSelector(
    selectStateTaxConfigurationState,
    state => state.taxDetailsStateDetails
);

const selectTaxDetailsStateDetailsSaveResponse = createSelector(
    selectStateTaxConfigurationState,
    state => state.taxDetailsStateDetailsSaveResponse
);

const selectTaxDetailsStateDetailsEditResponse = createSelector(
    selectStateTaxConfigurationState,
    state => state.taxDetailsStateDetailsEditResponse
);

const selectTaxDetailsSaveResponse = createSelector(
    selectStateTaxConfigurationState,
    state => state.taxDetailsSaveResponse
);

const selectTaxComponentDetails = createSelector(
    selectStateTaxConfigurationState,
    state => state.taxComponentDetails
);

const selectAllStateList = createSelector(
    selectStateTaxConfigurationState,
    state => state.allStateList
);

const selectAllTaxSystemList = createSelector(
    selectStateTaxConfigurationState,
    state => state.allTaxSystemList
);

const selectAllTaxClassList = createSelector(
    selectStateTaxConfigurationState,
    state => state.allTaxClassList
);

const selectAllTaxsList = createSelector(
    selectStateTaxConfigurationState,
    state => state.allTaxsList
);

const selectTotalStateTaxConfiguration = createSelector(
    selectStateTaxConfigurationState,
    state => state.totalStateTaxConfiguration
);

const selectTaxDetailsListing = createSelector(
    selectStateTaxConfigurationState,
    state => state.taxDetailsListing
);

const selectLoadedTaxDetailsListing = createSelector(
    selectTaxDetailsListing,
    taxDetailsConfigListingSelector.selectAll
);


const selectIsLoading = createSelector(
    selectStateTaxConfigurationState,
    state => state.isLoading
);


const selectError = createSelector(
    selectStateTaxConfigurationState,
    state => state.error
);

export const StateTaxConfigurationSelectors = {
    selectLoadedStatesListing,
    selectTaxDetailsStateDetails,
    selectTaxDetailsStateDetailsSaveResponse,
    selectTaxDetailsStateDetailsEditResponse,
    selectTaxDetailsSaveResponse,
    selectTaxComponentDetails,
    selectTotalStateTaxConfiguration,
    selectAllStateList,
    selectAllTaxClassList,
    selectAllTaxSystemList,
    selectAllTaxsList,
    selectLoadedTaxDetailsListing,
    selectIsLoading,
    selectError
};
