import { Action } from '@ngrx/store';
import {
    CustomErrors,
    LoadTransactionTypeMasterListingPayload,
    LoadTransactionTypeMasterListingSuccessPayload,
    TransactionTypeMasterDetails
} from '@poss-web/shared/models';





export enum TransactionTypeMasterActionTypes {
    TRANSACTION_TYPE_MASTER_LISTING = '[Load-TransactionTypeMaster-Listing] Load TransactionTypeMaster Listing',
    TRANSACTION_TYPE_MASTER_LISTING_SUCCESS = '[Load-TransactionTypeMaster-Listing] Load TransactionTypeMaster Listing Success',
    TRANSACTION_TYPE_MASTER_LISTING_FAILURE = '[Load-TransactionTypeMaster-Listing] Load TransactionTypeMaster Listing Failure',

    TRANSACTION_TYPE_MASTER_DETAILS_BY_CODE = '[Load-TransactionTypeMaster-Details] Load TransactionTypeMaster Details By Code',
    TRANSACTION_TYPE_MASTER_DETAILS_BY_CODE_SUCCESS = '[Load-TransactionTypeMaster-Details] Load TransactionTypeMaster Details By Code Success',
    TRANSACTION_TYPE_MASTER_DETAILS_BY_CODE_FAILURE = '[Load-TransactionTypeMaster-Details] Load TransactionTypeMaster Details By Code Failure',

    RESET_TRANSACTION_TYPE_MASTER_DATA = '[Load-TransactionTypeMaster-Details] Reset TransactionTypeMaster Data',

    SAVE_TRANSACTION_TYPE_MASTER_FORM_DETAILS = '[ Save-TransactionTypeMaster-Details ] SaveForm Details',
    SAVE_TRANSACTION_TYPE_MASTER_FORM_DETAILS_SUCCESS = '[ Save-TransactionTypeMaster-Details ] SaveForm Details Success',
    SAVE_TRANSACTION_TYPE_MASTER_FORM_DETAILS_FAILURE = '[ Save-TransactionTypeMaster-Details ] SaveForm Details Failure',

    EDIT_TRANSACTION_TYPE_MASTER_FORM_DETAILS = '[ Edit-TransactionTypeMaster-Details ] EditForm Details',
    EDIT_TRANSACTION_TYPE_MASTER_FORM_DETAILS_SUCCESS = '[ Edit-TransactionTypeMaster-Details ] EditForm Details Success',
    EDIT_TRANSACTION_TYPE_MASTER_FORM_DETAILS_FAILURE = '[ Edit-TransactionTypeMaster-Details ] EditForm Details Failure',

    SEARCH_TRANSACTION_TYPE_MASTER_DETAILS = '[Load-TransactionTypeMaster-Details] Search TransactionTypeMaster-Details',
    SEARCH_TRANSACTION_TYPE_MASTER_DETAILS_SUCCESS = '[Load-TransactionTypeMaster-Details] Search TransactionTypeMaster-Details Success',
    SEARCH_TRANSACTION_TYPE_MASTER_DETAILS_FAILURE = '[Load-TransactionTypeMaster-Details] Search TransactionTypeMaster-Details Failure'
}

export class LoadTransactionTypeMasterListing implements Action {
    readonly type = TransactionTypeMasterActionTypes.TRANSACTION_TYPE_MASTER_LISTING;
    constructor(public payload: LoadTransactionTypeMasterListingPayload) { }
}
export class LoadTransactionTypeMasterListingSuccess implements Action {
    readonly type = TransactionTypeMasterActionTypes.TRANSACTION_TYPE_MASTER_LISTING_SUCCESS;
    constructor(public payload: LoadTransactionTypeMasterListingSuccessPayload) { }
}
export class LoadTransactionTypeMasterListingFailure implements Action {
    readonly type = TransactionTypeMasterActionTypes.TRANSACTION_TYPE_MASTER_LISTING_FAILURE;
    constructor(public payload: CustomErrors) { }
}

export class LoadTransactionTypeMasterByCode implements Action {
    readonly type =
        TransactionTypeMasterActionTypes.TRANSACTION_TYPE_MASTER_DETAILS_BY_CODE;
    constructor(public payload: string) { }
}
export class LoadTransactionTypeMasterByCodeSuccess implements Action {
    readonly type =
        TransactionTypeMasterActionTypes.TRANSACTION_TYPE_MASTER_DETAILS_BY_CODE_SUCCESS;
    constructor(public payload: TransactionTypeMasterDetails) { }
}
export class LoadTransactionTypeMasterByCodeFailure implements Action {
    readonly type =
        TransactionTypeMasterActionTypes.TRANSACTION_TYPE_MASTER_DETAILS_BY_CODE_FAILURE;
    constructor(public payload: CustomErrors) { }
}


export class SaveTransactionTypeMasterFormDetails implements Action {
    readonly type = TransactionTypeMasterActionTypes.SAVE_TRANSACTION_TYPE_MASTER_FORM_DETAILS;
    constructor(public payload: TransactionTypeMasterDetails) { }
}
export class SaveTransactionTypeMasterFormDetailsSuccess implements Action {
    readonly type = TransactionTypeMasterActionTypes.SAVE_TRANSACTION_TYPE_MASTER_FORM_DETAILS_SUCCESS;
    constructor(public payload: TransactionTypeMasterDetails) { }
}
export class SaveTransactionTypeMasterFormDetailsFailure implements Action {
    readonly type = TransactionTypeMasterActionTypes.SAVE_TRANSACTION_TYPE_MASTER_FORM_DETAILS_FAILURE;
    constructor(public payload: CustomErrors) { }
}


export class EditTransactionTypeMasterFormDetails implements Action {
    readonly type = TransactionTypeMasterActionTypes.EDIT_TRANSACTION_TYPE_MASTER_FORM_DETAILS
    constructor(public payload: TransactionTypeMasterDetails) { }
}
export class EditTransactionTypeMasterFormDetailsSuccess implements Action {
    readonly type = TransactionTypeMasterActionTypes.EDIT_TRANSACTION_TYPE_MASTER_FORM_DETAILS_SUCCESS;
    constructor(public payload: TransactionTypeMasterDetails) { }
}
export class EditTransactionTypeMasterFormDetailsFailure implements Action {
    readonly type = TransactionTypeMasterActionTypes.EDIT_TRANSACTION_TYPE_MASTER_FORM_DETAILS_FAILURE
    constructor(public payload: CustomErrors) { }
}


export class SearchTransactionTypeMasterCode implements Action {
    readonly type = TransactionTypeMasterActionTypes.SEARCH_TRANSACTION_TYPE_MASTER_DETAILS;
    constructor(public payload: string) { }
}
export class SearchTransactionTypeMasterCodeSuccess implements Action {
    readonly type = TransactionTypeMasterActionTypes.SEARCH_TRANSACTION_TYPE_MASTER_DETAILS_SUCCESS;
    constructor(public payload: LoadTransactionTypeMasterListingSuccessPayload) { }
}
export class SearchTransactionTypeMasterCodeFailure implements Action {
    readonly type = TransactionTypeMasterActionTypes.SEARCH_TRANSACTION_TYPE_MASTER_DETAILS_FAILURE;
    constructor(public payload: CustomErrors) { }
}

export class ResetTransactionTypeMaster implements Action {
    readonly type = TransactionTypeMasterActionTypes.RESET_TRANSACTION_TYPE_MASTER_DATA;
}

export type TransactionTypeMasterActions =
    | LoadTransactionTypeMasterListing
    | LoadTransactionTypeMasterListingSuccess
    | LoadTransactionTypeMasterListingFailure
    | LoadTransactionTypeMasterByCode
    | LoadTransactionTypeMasterByCodeSuccess
    | LoadTransactionTypeMasterByCodeFailure
    | SaveTransactionTypeMasterFormDetails
    | SaveTransactionTypeMasterFormDetailsSuccess
    | SaveTransactionTypeMasterFormDetailsFailure
    | EditTransactionTypeMasterFormDetails
    | EditTransactionTypeMasterFormDetailsSuccess
    | EditTransactionTypeMasterFormDetailsFailure
    | SearchTransactionTypeMasterCode
    | SearchTransactionTypeMasterCodeSuccess
    | SearchTransactionTypeMasterCodeFailure
    | ResetTransactionTypeMaster
