import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';


import * as taxClassActions from './tax-class.actions';
import { TaxClassSelectors } from './tax-class.selectors';
import { LoadTaxMasterListingPayload, TaxMasterDetails, TaxClassDetails } from '@poss-web/shared/models';
import { TaxClassState } from './tax-class.state';

@Injectable()
export class TaxClassFacade {
    constructor(private store: Store<TaxClassState>) { }


    private taxClassListing$ = this.store.select(
        TaxClassSelectors.selectTaxClassListing
    );

    private isLoading$ = this.store.select(
        TaxClassSelectors.selectIsLoading
    );

    private totalTaxClassDetailsCount$ = this.store.select(
        TaxClassSelectors.selectTotalTaxClassDetailsCount
    );

    private hasError$ = this.store.select(
        TaxClassSelectors.selectError
    );

    private TaxClassDetailsByTaxClassCode$ = this.store.select(
        TaxClassSelectors.selectTaxClassDetailsByTaxClassCode
    );

    private isTaxClassSaved$ = this.store.select(
        TaxClassSelectors.selectSaveTaxClassFormResponse
    );

    private isTaxClassEdited$ = this.store.select(
        TaxClassSelectors.selectEditTaxClassFormResponse
    );

    getisLoading() {
        return this.isLoading$;
    }

    getTotalTaxClassDetails() {
        return this.totalTaxClassDetailsCount$;
    }

    getTaxClassListing() {
        return this.taxClassListing$;
    }

    getTaxClassSaveResponse() {
        return this.isTaxClassSaved$;
    }

    getTaxClassEditResponse() {
        return this.isTaxClassEdited$;
    }

    getError() {
        return this.hasError$;
    }

    getTaxClassDetailsByTaxClassCode() {
        return this.TaxClassDetailsByTaxClassCode$;
    }

    loadTaxClassListing(
        loadTaxClassListingPayload: LoadTaxMasterListingPayload
    ) {
        this.store.dispatch(
            new taxClassActions.LoadTaxClassListing(
                loadTaxClassListingPayload
            )
        );
    }

    loadTaxClassDetailsByTaxClassCode(
        taxClassCode: string
    ) {
        this.store.dispatch(
            new taxClassActions.LoadTaxClassDetailsByTaxClassCode(
                taxClassCode
            )
        );
    }

    editTaxClassFormDetails(editFormDetails: TaxClassDetails) {
        this.store.dispatch(
            new taxClassActions.EditTaxClassFormDetails(editFormDetails)
        );
    }

    saveTaxClassFormDetails(saveFormDetails: TaxClassDetails) {
        this.store.dispatch(
            new taxClassActions.SaveTaxClassFormDetails(saveFormDetails)
        );
    }

    resetTaxClassDialogData() {
        this.store.dispatch(new taxClassActions.ResetTaxClassDialog());
    }

    searchTaxClass(taxClassCode: string) {
        this.store.dispatch(new taxClassActions.SearchTaxClassCode(taxClassCode));
    }

}
