import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';


import * as CPGProductGroupConfigForQCGCActions from './cpg-product-group-config-for-qcgc.actions';
import { CPGProductGroupConfigSelectors } from './cpg-product-group-config-for-qcgc.selectors';
import { LoadCPGProductGroupConfigForQCGCListingPayload, CPGProductGroupConfigForQCGCDetails, CPGProductGroupConfigForQCGCMapping } from '@poss-web/shared/models';
import { CPGProductGroupConfigForQCGCState } from './cpg-product-group-config-for-qcgc.state';

@Injectable()
export class CPGProductGroupForQCGCFacade {
    constructor(private store: Store<CPGProductGroupConfigForQCGCState>) { }


    private cpgProductGroupConfigListing$ = this.store.select(
        CPGProductGroupConfigSelectors.selectCPGProductGroupConfigListing
    );

    private cpgProductGroupConfigDetails$ = this.store.select(
        CPGProductGroupConfigSelectors.selectCPGProductGroupConfigDetails
    );


    private totalCpgProductGroupConfig$ = this.store.select(
        CPGProductGroupConfigSelectors.selectTotalCpgProductGroupConfig
    );

    private cpgProductGroupConfigDetailsSavedResponse$ = this.store.select(
        CPGProductGroupConfigSelectors.selectCPGProductGroupConfigDetailsSavedResponse
    );

    private cpgProductGroupConfigDetailsEditedResponse$ = this.store.select(
        CPGProductGroupConfigSelectors.selectCPGProductGroupConfigDetailsEditedResponse
    );

    private isLoading$ = this.store.select(
        CPGProductGroupConfigSelectors.selectIsLoading
    );

    private hasError$ = this.store.select(
        CPGProductGroupConfigSelectors.selectError
    );

    private CPGProductGroupMapping$ = this.store.select(
        CPGProductGroupConfigSelectors.selectCPGProductGroupMapping
    );

    private CPGProductGroupMappingUpdated$ = this.store.select(
        CPGProductGroupConfigSelectors.selectCPGProductGroupMappingUpdated
    );


    getCPGProductGroupConfigListing() {
        return this.cpgProductGroupConfigListing$;
    }

    getCPGProductGroupConfigDetails() {
        return this.cpgProductGroupConfigDetails$;
    }


    getCPGProductGroupConfigDetailsSavedResponse() {
        return this.cpgProductGroupConfigDetailsSavedResponse$;
    }

    getCPGProductGroupConfigDetailsEditedResponse() {
        return this.cpgProductGroupConfigDetailsEditedResponse$;
    }

    getTotalCPGProductGroupConfig() {
        return this.totalCpgProductGroupConfig$;
    }

    getIsLoading() {
        return this.isLoading$;
    }

    getError() {
        return this.hasError$;
    }

    getCPGProductGroupMapping() {
        return this.CPGProductGroupMapping$;
    }

    getCPGProductGroupMappingUpdated() {
        return this.CPGProductGroupMappingUpdated$;
    }

    loadCPGProductGroupConfigListing(loadCPGProductGroupConfigListingPayload: LoadCPGProductGroupConfigForQCGCListingPayload) {
        this.store.dispatch(
            new CPGProductGroupConfigForQCGCActions.LoadCPGProductGroupConfigForQCGCListing(
                loadCPGProductGroupConfigListingPayload
            )
        );
    }

    searchCPGProductGroupConfigListing(param: string) {
        this.store.dispatch(
            new CPGProductGroupConfigForQCGCActions.SearchCPGProductGroupConfigForQCGCListing(
                param
            )
        );
    }

    loadCPGProductGroupConfigDetails(param: string) {
        this.store.dispatch(
            new CPGProductGroupConfigForQCGCActions.LoadCPGProductGroupConfigForQCGCDetails(
                param
            )
        );
    }

    saveCPGProductGroupConfigDetails(param: CPGProductGroupConfigForQCGCDetails) {
        this.store.dispatch(
            new CPGProductGroupConfigForQCGCActions.SaveCPGProductGroupConfigForQCGCDetails(
                param
            )
        );
    }

    editCPGProductGroupConfigDetails(param: CPGProductGroupConfigForQCGCDetails) {
        this.store.dispatch(
            new CPGProductGroupConfigForQCGCActions.EditCPGProductGroupConfigForQCGCDetails(
                param
            )
        );
    }

    LoadCPGProductGroupConfigMapping(param: string) {
        this.store.dispatch(
            new CPGProductGroupConfigForQCGCActions.LoadCPGProductGroupConfigForQCGCMapping(
                param
            )
        );
    }

    saveCPGProductGroupConfigMapping(param: CPGProductGroupConfigForQCGCMapping, id: string) {
        this.store.dispatch(
            new CPGProductGroupConfigForQCGCActions.SaveCPGProductGroupConfigForQCGCMapping(
                { data: param, id }
            )
        );
    }
}
