import {
    CustomErrors, ProductGroupMappingOption, CPGProductGroupConfigForQCGCDetails
} from '@poss-web/shared/models';

export interface CPGProductGroupConfigForQCGCState {
    cpgProductGroupConfigListing: CPGProductGroupConfigForQCGCDetails[];
    cpgProductGroupConfigDetails: CPGProductGroupConfigForQCGCDetails,
    totalCpgProductGroupConfig: number,
    cpgProductGroupConfigDetailsSavedResponse: CPGProductGroupConfigForQCGCDetails;
    cpgProductGroupConfigDetailsEditedResponse: CPGProductGroupConfigForQCGCDetails;
    cpgProductGroupMapping: ProductGroupMappingOption[];
    cpgProductGroupMappingUpdated: boolean;
    error: CustomErrors;
    isLoading: boolean;
}
