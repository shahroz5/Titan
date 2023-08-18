import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';


import * as taxMasterActions from './tax-master.actions';
import { TaxMasterSelectors } from './tax-master.selectors';
import { LoadTaxMasterListingPayload, TaxMasterDetails } from '@poss-web/shared/models';
import { TaxMasterState } from './tax-master.state';

@Injectable()
export class TaxMasterFacade {
    constructor(private store: Store<TaxMasterState>) { }


    private taxMasterListing$ = this.store.select(
        TaxMasterSelectors.selectTaxMasterListing
    );

    private isLoading$ = this.store.select(
        TaxMasterSelectors.selectIsLoading
    );

    // private isproductCategorySaved$ = this.store.select(
    //     ProductCategorySelectors.selectSaveproductCategoryFormResponse
    // );

    // private isproductCategoryEdited$ = this.store.select(
    //     ProductCategorySelectors.selectEditproductCategoryFormResponse
    // );


    private totalTaxMasterDetailsCount$ = this.store.select(
        TaxMasterSelectors.selectTotalTaxMasterDetailsCount
    );

    private hasError$ = this.store.select(
        TaxMasterSelectors.selectError
    );

    private TaxMasterDetailsByTaxMasterCode$ = this.store.select(
        TaxMasterSelectors.selectTaxMasterDetailsByTaxMasterCode
    );

    private isTaxMasterSaved$ = this.store.select(
        TaxMasterSelectors.selectSaveTaxMasterFormResponse
    );

    private isTaxMasterEdited$ = this.store.select(
        TaxMasterSelectors.selectEditTaxMasterFormResponse
    );

    getisLoading() {
        return this.isLoading$;
    }

    getTotalTaxMasterDetails() {
        return this.totalTaxMasterDetailsCount$;
    }

    getTaxMasterListing() {
        return this.taxMasterListing$;
    }

    getTaxMasterSaveResponse() {
        return this.isTaxMasterSaved$;
    }

    getTaxMasterEditResponse() {
        return this.isTaxMasterEdited$;
    }

    getError() {
        return this.hasError$;
    }

    getTaxMasterDetailsByTaxCode() {
        return this.TaxMasterDetailsByTaxMasterCode$;
    }

    loadTaxMasterListing(
        loadTaxMasterListingPayload: LoadTaxMasterListingPayload
    ) {
        this.store.dispatch(
            new taxMasterActions.LoadTaxMasterListing(
                loadTaxMasterListingPayload
            )
        );
    }

    loadTaxMasterDetailsByTaxCode(
        taxCode: string
    ) {
        this.store.dispatch(
            new taxMasterActions.LoadTaxMasterDetailsByTaxCode(
                taxCode
            )
        );
    }

    editTaxMasterFormDetails(editFormDetails: TaxMasterDetails) {
        this.store.dispatch(
            new taxMasterActions.EditTaxMasterFormDetails(editFormDetails)
        );
    }

    saveTaxMasterFormDetails(saveFormDetails: TaxMasterDetails) {
        this.store.dispatch(
            new taxMasterActions.SaveTaxMasterFormDetails(saveFormDetails)
        );
    }

    resetTaxMasterDialogData() {
        this.store.dispatch(new taxMasterActions.ResetTaxMasterDialog());
    }

    searchTaxMaster(taxMasterCode: string) {
        this.store.dispatch(new taxMasterActions.SearchTaxMasterCode(taxMasterCode));
    }

}
