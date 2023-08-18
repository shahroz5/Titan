import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';


import * as StateTaxConfituationActions from './state-tax-configuration.actions';
import { StateTaxConfigurationSelectors } from './state-tax-configuration.selectors';
import { LoadTaxMasterListingPayload, TaxDetailsSelect, StateTaxConfigurationStateDetails, TaxDetailsSubmit } from '@poss-web/shared/models';
import { StateTaxConfigurationState } from './state-tax-configuration.state';

@Injectable()
export class StateTaxConfigurationFacade {
    constructor(private store: Store<StateTaxConfigurationState>) { }


    private stateTaxConfigurationListing$ = this.store.select(
        StateTaxConfigurationSelectors.selectLoadedStatesListing
    );

    private taxDetailsStateDetails$ = this.store.select(
        StateTaxConfigurationSelectors.selectTaxDetailsStateDetails
    );

    private taxDetailsStateDetailsSaveResponse$ = this.store.select(
        StateTaxConfigurationSelectors.selectTaxDetailsStateDetailsSaveResponse
    );

    private taxDetailsStateDetailsEditResponse$ = this.store.select(
        StateTaxConfigurationSelectors.selectTaxDetailsStateDetailsEditResponse
    );

    private taxDetailsSaveResponse$ = this.store.select(
        StateTaxConfigurationSelectors.selectTaxDetailsSaveResponse
    );

    private taxComponentDetails$ = this.store.select(
        StateTaxConfigurationSelectors.selectTaxComponentDetails
    );

    private allStateList$ = this.store.select(
        StateTaxConfigurationSelectors.selectAllStateList
    );

    private allTaxSystemList$ = this.store.select(
        StateTaxConfigurationSelectors.selectAllTaxSystemList
    );

    private allTaxClassList$ = this.store.select(
        StateTaxConfigurationSelectors.selectAllTaxClassList
    );

    private allTaxsList$ = this.store.select(
        StateTaxConfigurationSelectors.selectAllTaxsList
    );

    private totalStateTaxConfiguration$ = this.store.select(
        StateTaxConfigurationSelectors.selectTotalStateTaxConfiguration
    );

    private taxDetailsListing$ = this.store.select(
        StateTaxConfigurationSelectors.selectLoadedTaxDetailsListing
    );

    private isLoading$ = this.store.select(
        StateTaxConfigurationSelectors.selectIsLoading
    );


    private hasError$ = this.store.select(
        StateTaxConfigurationSelectors.selectError
    );


    getTotalListingCount() {
        return this.totalStateTaxConfiguration$;
    }

    getTaxDetailsStateDetails() {
        return this.taxDetailsStateDetails$;
    }

    getTaxDetailsStateDetailsSaveResponse() {
        return this.taxDetailsStateDetailsSaveResponse$;
    }

    getTaxDetailsStateDetailsEditResponse() {
        return this.taxDetailsStateDetailsEditResponse$;
    }

    getTaxDetailsSaveResponse() {
        return this.taxDetailsSaveResponse$;
    }

    getTaxComponentDetails() {
        return this.taxComponentDetails$;
    }

    getStateTaxConfigurationListing() {
        return this.stateTaxConfigurationListing$;
    }

    getAllStateList() {
        return this.allStateList$;
    }

    getAllTaxSystemList() {
        return this.allTaxSystemList$;
    }

    getAllTaxClassList() {
        return this.allTaxClassList$;
    }

    getAllTaxsList() {
        return this.allTaxsList$;
    }

    getTaxDetailsListing() {
        return this.taxDetailsListing$;
    }

    getIsLoading() {
        return this.isLoading$;
    }

    getError() {
        return this.hasError$;
    }

    loadStateTaxConfigurationListing(
        loadTaxClassListingPayload: LoadTaxMasterListingPayload,
        stateName?: string
    ) {
        this.store.dispatch(
            new StateTaxConfituationActions.LoadStateTaxConfigurationListing({
                pageEvent : loadTaxClassListingPayload,
                stateName : stateName 
            })
        );
    }

    loadStateTaxDetails(configId: string) {
        this.store.dispatch(new StateTaxConfituationActions.LoadStateTaxConfigurationStateDetails(configId));
    }

    loadTaxDetailsList(configId: string) {
        this.store.dispatch(new StateTaxConfituationActions.LoadStateTaxConfigurationTaxDetails(configId));
    }

    loadAllStateList() {
        this.store.dispatch(new StateTaxConfituationActions.LoadAllStateList());
    }

    loadAllTaxClassList() {
        this.store.dispatch(new StateTaxConfituationActions.LoadAllTaxClassList());
    }

    loadAllTaxsList() {
        this.store.dispatch(new StateTaxConfituationActions.LoadAllTaxsList());
    }

    loadAllTaxSystemList() {
        this.store.dispatch(new StateTaxConfituationActions.LoadAllTaxsystemList());
    }

    selectTaxDetailsCheckbox(taxDetailsSelect: TaxDetailsSelect) {
        this.store.dispatch(new StateTaxConfituationActions.SelectStateTaxDetails(taxDetailsSelect));
    }


    selectAllTaxDetailsCheckbox(checked: boolean) {
        this.store.dispatch(new StateTaxConfituationActions.SelectAllStateTaxDetails(checked));
    }

    resetState() {
        this.store.dispatch(new StateTaxConfituationActions.ResetStateTaxCoonfigurationState());
    }


    saveStateTaxConfigurationStateDetails(formData: StateTaxConfigurationStateDetails) {
        this.store.dispatch(new StateTaxConfituationActions.SaveStateTaxConfigurationStateDetails(formData));
    }

    editStateTaxConfigurationStateDetails(formData: StateTaxConfigurationStateDetails, configId: string) {
        this.store.dispatch(new StateTaxConfituationActions.EditStateTaxConfigurationStateDetails({ formData, configId }));
    }

    editStateTaxConfigurationTaxDetails(formData: TaxDetailsSubmit, configId: string) {
        this.store.dispatch(new StateTaxConfituationActions.SaveStateTaxConfigurationTaxDetails({ formData, configId }));
    }

    searchStateTaxConfigurationListing(configId: string) {
        this.store.dispatch(new StateTaxConfituationActions.SearchStateTaxConfigurationListing(configId));
    }
}
