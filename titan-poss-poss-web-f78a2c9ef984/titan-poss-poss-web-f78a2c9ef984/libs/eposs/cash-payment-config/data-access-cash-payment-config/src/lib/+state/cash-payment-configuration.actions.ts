import { Action } from '@ngrx/store';
import {
    CustomErrors,
    CashPaymentConfiguration
} from '@poss-web/shared/models';

export enum CashPaymentConfigurationActionTypes {
    LOAD_CASH_PAYMENT_CONFIGURATION = '[Cash Payment Configuration] Load Cash Payment Configuration',
    LOAD_CASH_PAYMENT_CONFIGURATION_SUCCESS = '[Cash Payment Configuration] Load Cash Payment Configuration Success',
    LOAD_CASH_PAYMENT_CONFIGURATION_FAILURE = '[Cash Payment Configuration] Load Cash Payment Configuration Failure',

    ADDNEW_CASH_PAYMENT_CONFIGURATION = '[Cash Payment Configuration] Add New Cash Payment Configuration',
    ADDNEW_CASH_PAYMENT_CONFIGURATION_SUCCESS = '[Cash Payment Configuration] Add New Cash Payment Configuration Success',
    ADDNEW_CASH_PAYMENT_CONFIGURATION_FAILURE = '[Cash Payment Configuration] Add New Cash Payment Configuration Failure',

    EDIT_CASH_PAYMENT_CONFIGURATION = '[Cash Payment Configuration] Edit Cash Payment Configuration',
    EDIT_CASH_PAYMENT_CONFIGURATION_SUCCESS = '[Cash Payment Configuration] Edit Cash Payment Configuration Success',
    EDIT_CASH_PAYMENT_CONFIGURATION_FAILURE = '[Cash Payment Configuration] Edit Cash Payment Configuration Failure'
}

export class LoadCashPaymentConfiguration implements Action {
    readonly type = CashPaymentConfigurationActionTypes.LOAD_CASH_PAYMENT_CONFIGURATION;
    constructor(public payload: number) { }
}
export class LoadCashPaymentConfigurationSuccess implements Action {
    readonly type = CashPaymentConfigurationActionTypes.LOAD_CASH_PAYMENT_CONFIGURATION_SUCCESS;
    constructor(public payload: CashPaymentConfiguration) { }
}
export class LoadCashPaymentConfigurationFailure implements Action {
    readonly type = CashPaymentConfigurationActionTypes.LOAD_CASH_PAYMENT_CONFIGURATION_FAILURE;
    constructor(public payload: CustomErrors) { }
}


export class AddNewCashPaymentConfiguration implements Action {
    readonly type = CashPaymentConfigurationActionTypes.ADDNEW_CASH_PAYMENT_CONFIGURATION;
    constructor(public payload: CashPaymentConfiguration) { }
}
export class AddNewCashPaymentConfigurationSuccess implements Action {
    readonly type = CashPaymentConfigurationActionTypes.ADDNEW_CASH_PAYMENT_CONFIGURATION_SUCCESS;
    constructor(public payload: CashPaymentConfiguration) { }
}
export class AddNewCashPaymentConfigurationFailure implements Action {
    readonly type = CashPaymentConfigurationActionTypes.ADDNEW_CASH_PAYMENT_CONFIGURATION_FAILURE;
    constructor(public payload: CustomErrors) { }
}


export class EditCashPaymentConfiguration implements Action {
    readonly type = CashPaymentConfigurationActionTypes.EDIT_CASH_PAYMENT_CONFIGURATION;
    constructor(public payload: { ruleId: number; cashPaymentConfigurationForm: CashPaymentConfiguration }) { }
}
export class EditCashPaymentConfigurationSuccess implements Action {
    readonly type = CashPaymentConfigurationActionTypes.EDIT_CASH_PAYMENT_CONFIGURATION_SUCCESS;
    constructor(public payload: CashPaymentConfiguration) { }
}
export class EditCashPaymentConfigurationFailure implements Action {
    readonly type = CashPaymentConfigurationActionTypes.EDIT_CASH_PAYMENT_CONFIGURATION_FAILURE;
    constructor(public payload: CustomErrors) { }
}


export type CashPaymentConfigurationActions =
    | LoadCashPaymentConfiguration
    | LoadCashPaymentConfigurationSuccess
    | LoadCashPaymentConfigurationFailure
    | AddNewCashPaymentConfiguration
    | AddNewCashPaymentConfigurationSuccess
    | AddNewCashPaymentConfigurationFailure
    | EditCashPaymentConfiguration
    | EditCashPaymentConfigurationSuccess
    | EditCashPaymentConfigurationFailure;
