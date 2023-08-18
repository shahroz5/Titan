import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';


import * as transactionTypeMasterActions from './transaction-type-master.actions';
import { LoadTransactionTypeMasterListingPayload, TransactionTypeMasterDetails } from '@poss-web/shared/models';
import { TransactionTypeMasterState } from './transaction-type-master.state';
import { TransactionTypeMasterSelectors } from './transaction-type-master.selectors';

@Injectable()
export class TransactionTypeMasterFacade {
    constructor(private store: Store<TransactionTypeMasterState>) { }


    private transactionTypeMasterListing$ = this.store.select(
        TransactionTypeMasterSelectors.selectTransactionTypeMasterListing
    );

    private isLoading$ = this.store.select(
        TransactionTypeMasterSelectors.selectIsLoading
    );

    private totalDetailsCount$ = this.store.select(
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

    getTotalDetails() {
        return this.totalDetailsCount$;
    }

    getTransactionTypeMasterListing() {
        return this.transactionTypeMasterListing$;
    }

    getTransactionTypeMasterSaveResponse() {
        return this.isSaved$;
    }

    getTransactionTypeMasterEditResponse() {
        return this.isEdited$;
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

    loadTransactionTypeMasterByCode(
        code: string
    ) {
        this.store.dispatch(
            new transactionTypeMasterActions.LoadTransactionTypeMasterByCode(
                code
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

    resetData() {
        this.store.dispatch(new transactionTypeMasterActions.ResetTransactionTypeMaster());
    }

    searchTransactionTypeMaster(code: string) {
        this.store.dispatch(new transactionTypeMasterActions.SearchTransactionTypeMasterCode(code));
    }

}
