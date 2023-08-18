import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';


import * as cashPaymentConfigurationActions from './cash-payment-configuration.actions';
import { CashPaymentConfigurationSelectors } from './cash-payment-configuration.selectors';
import { CashPaymentConfigurationState } from './cash-payment-configuration.state';
import { CashPaymentConfiguration } from '@poss-web/shared/models';

@Injectable()
export class CashPaymentConfigurationFacade {
    constructor(private store: Store<CashPaymentConfigurationState>) { }

    private cashPaymentConfigurationDetails$ = this.store.select(
        CashPaymentConfigurationSelectors.selectCashPaymentConfigurationDetails
    );

    private editCashPaymentConfigurationResponse$ = this.store.select(
        CashPaymentConfigurationSelectors.selectEditCashPaymentConfigurationResponses
    );

    private isLoading$ = this.store.select(
        CashPaymentConfigurationSelectors.selectIsLoading
    );

    private error$ = this.store.select(
        CashPaymentConfigurationSelectors.selectError
    );

    getError() {
        return this.error$;
    }

    getIsLoading() {
        return this.isLoading$;
    }

    getCashPaymentConfigurationDetails() {
        return this.cashPaymentConfigurationDetails$;
    }

    editCashPaymentConfigurationResponse() {
        return this.editCashPaymentConfigurationResponse$;
    }

    loadCashPaymentConfigurationDetails(ruleId: number) {
        this.store.dispatch(new cashPaymentConfigurationActions.LoadCashPaymentConfiguration(ruleId));
    }

    addNewCashPaymentConfigurationDetails(cashPaymentConfigurationForm: CashPaymentConfiguration) {
        this.store.dispatch(new cashPaymentConfigurationActions.AddNewCashPaymentConfiguration(cashPaymentConfigurationForm));
    }

    editCashPaymentConfigurationDetails(ruleId: number, cashPaymentConfigurationForm: CashPaymentConfiguration) {
        this.store.dispatch(new cashPaymentConfigurationActions.EditCashPaymentConfiguration({ ruleId, cashPaymentConfigurationForm }));
    }

}
