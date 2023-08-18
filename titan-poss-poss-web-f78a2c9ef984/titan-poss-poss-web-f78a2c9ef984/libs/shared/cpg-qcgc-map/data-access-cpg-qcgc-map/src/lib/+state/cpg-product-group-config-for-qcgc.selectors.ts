import { createSelector } from '@ngrx/store';
import { selectCPGProductGroupConfigForQCGCState } from './cpg-product-group-config-for-qcgc.reducer';


const selectCPGProductGroupConfigListing = createSelector(
    selectCPGProductGroupConfigForQCGCState,
    state => state.cpgProductGroupConfigListing
);

const selectCPGProductGroupConfigDetails = createSelector(
    selectCPGProductGroupConfigForQCGCState,
    state => state.cpgProductGroupConfigDetails
);


const selectTotalCpgProductGroupConfig = createSelector(
    selectCPGProductGroupConfigForQCGCState,
    state => state.totalCpgProductGroupConfig
);

const selectCPGProductGroupConfigDetailsSavedResponse = createSelector(
    selectCPGProductGroupConfigForQCGCState,
    state => state.cpgProductGroupConfigDetailsSavedResponse
);

const selectCPGProductGroupConfigDetailsEditedResponse = createSelector(
    selectCPGProductGroupConfigForQCGCState,
    state => state.cpgProductGroupConfigDetailsEditedResponse
);

const selectCPGProductGroupMappingUpdated = createSelector(
    selectCPGProductGroupConfigForQCGCState,
    state => state.cpgProductGroupMappingUpdated
);

const selectIsLoading = createSelector(
    selectCPGProductGroupConfigForQCGCState,
    state => state.isLoading
);

const selectError = createSelector(
    selectCPGProductGroupConfigForQCGCState,
    state => state.error
);

const selectCPGProductGroupMapping = createSelector(
    selectCPGProductGroupConfigForQCGCState,
    state => state.cpgProductGroupMapping
);

export const CPGProductGroupConfigSelectors = {
    selectCPGProductGroupConfigListing,
    selectCPGProductGroupConfigDetails,
    selectCPGProductGroupConfigDetailsSavedResponse,
    selectCPGProductGroupConfigDetailsEditedResponse,
    selectTotalCpgProductGroupConfig,
    selectCPGProductGroupMapping,
    selectCPGProductGroupMappingUpdated,
    selectIsLoading,
    selectError
};
