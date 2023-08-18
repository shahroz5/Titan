import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';


import * as transactionTypeMasterActions from './transaction-type-master.actions';
import { TransactionTypeMasterSelectors } from './transaction-type-master.selectors';
import { LoadTransactionTypeMasterListingPayload, TransactionTypeMasterDetails } from '@poss-web/shared/models';
import { TransactionTypeMasterState } from './transaction-type-master.state';

@Injectable()
export class TransactionTypeMasterFacade {
    constructor(private store: Store<TransactionTypeMasterState>) { }


    private transactionTypeMasterListing$ = this.store.select(
        TransactionTypeMasterSelectors.selectTransactionTypeMasterListing
    );

    private isLoading$ = this.store.select(
        TransactionTypeMasterSelectors.selectIsLoading
    );

    private totalTransactionTypeMasterDetailsCount$ = this.store.select(
        TransactionTypeMasterSelectors.selectTotalTransactionTypeMasterDetailsCount
    );

    private hasError$ = this.store.select(
        TransactionTypeMasterSelectors.selectError
    );

    private transactionTypeMasterDetails$ = this.store.select(
        TransactionTypeMasterSelectors.selectTransactionTypeMasterDetails
    );

    private isSaved$ = this.store.select(
        TransactionTypeMasterSelectors.selectSaveResponse
    );

    private isEdited$ = this.store.select(
        TransactionTypeMasterSelectors.selectEditResponse
    );

    getisLoading() {
        return this.isLoading$;
    }

    getTotalTransactionTypeMasterDetails() {
        return this.totalTransactionTypeMasterDetailsCount$;
    }

    getTransactionTypeMasterListing() {
        return this.transactionTypeMasterListing$;
    }

    getSaveResponse() {
        return this.isSaved$
    }

    getEditResponse() {
        return this.isEdited$
    }

    getError() {
        return this.hasError$;
    }

    getTransactionTypeMasterDetails() {
        return this.transactionTypeMasterDetails$;
    }

    loadTransactionTypeMasterListing(
        loadListingPayload: LoadTransactionTypeMasterListingPayload
    ) {
        this.store.dispatch(
            new transactionTypeMasterActions.LoadTransactionTypeMasterListing(
                loadListingPayload
            )
        );
    }

    loadTransactionTypeMasterDetailsByCode(
        Code: string
    ) {
        this.store.dispatch(
            new transactionTypeMasterActions.LoadTransactionTypeMasterByCode(
                Code
            )
        );
    }

    editFormDetails(editFormDetails: TransactionTypeMasterDetails) {
        this.store.dispatch(
            new transactionTypeMasterActions.EditTransactionTypeMasterFormDetails(editFormDetails)
        );
    }

    saveFormDetails(saveFormDetails: TransactionTypeMasterDetails) {
        this.store.dispatch(
            new transactionTypeMasterActions.SaveTransactionTypeMasterFormDetails(saveFormDetails)
        );
    }

    resetTransactionTypeMasterData() {
        this.store.dispatch(new transactionTypeMasterActions.ResetTransactionTypeMaster());
    }

    searchTransactionTypeMaster(code: string) {
        this.store.dispatch(new transactionTypeMasterActions.SearchTransactionTypeMasterCode(code));
    }

}
