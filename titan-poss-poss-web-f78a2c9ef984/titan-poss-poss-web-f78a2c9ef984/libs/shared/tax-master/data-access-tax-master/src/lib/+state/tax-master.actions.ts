import { Action } from '@ngrx/store';
import {
    CustomErrors,
    LoadTaxMasterListingPayload,
    LoadTaxMasterListingSuccessPayload,
    TaxMasterDetails
} from '@poss-web/shared/models';





export enum TaxMasterActionTypes {
    LOAD_TAX_MASTER_LISTING = '[Load-TaxMaster-Listing] Load TaxMaster Listing',
    LOAD_TAX_MASTER_LISTING_SUCCESS = '[Load-TaxMaster-Listing] Load TaxMaster Listing Success',
    LOAD_TAX_MASTER_LISTING_FAILURE = '[Load-TaxMaster-Listing] Load TaxMaster Listing Failure',

    LOAD_TAX_MASTER_DETAILS_BY_TAXCODE = '[Load-TaxMaster-Details] Load TaxMaster Details By TaxCode',
    LOAD_TAX_MASTER_DETAILS_BY_TAXCODE_SUCCESS = '[Load-TaxMaster-Details] Load TaxMaster Details By TaxCode Success',
    LOAD_TAX_MASTER_DETAILS_BY_TAXCODE_FAILURE = '[Load-TaxMaster-Details] Load TaxMaster Details By TaxCode Failure',

    RESET_TAX_MASTER_DIALOG_DATA = '[Load-TaxMaster-Details] Reset TaxMaster Dialog Data',

    SAVE_TAX_MASTER_FORM_DETAILS = '[ Save-TaxMaster-Details ] SaveForm Details',
    SAVE_TAX_MASTER_FORM_DETAILS_SUCCESS = '[ Save-TaxMaster-Details ] SaveForm Details Success',
    SAVE_TAX_MASTER_FORM_DETAILS_FAILURE = '[ Save-TaxMaster-Details ] SaveForm Details Failure',

    EDIT_TAX_MASTER_FORM_DETAILS = '[ Edit-TaxMaster-Details ] EditForm Details',
    EDIT_TAX_MASTER_FORM_DETAILS_SUCCESS = '[ Edit-TaxMaster-Details ] EditForm Details Success',
    EDIT_TAX_MASTER_FORM_DETAILS_FAILURE = '[ Edit-TaxMaster-Details ] EditForm Details Failure',

    SEARCH_TAX_MASTER_DETAILS = '[Load-TaxMaster-Details] Search TaxMaster-Details',
    SEARCH_TAX_MASTER_DETAILS_SUCCESS = '[Load-TaxMaster-Details] Search TaxMaster-Details Success',
    SEARCH_TAX_MASTER_DETAILS_FAILURE = '[Load-TaxMaster-Details] Search TaxMaster-Details Failure'
}

export class LoadTaxMasterListing implements Action {
    readonly type = TaxMasterActionTypes.LOAD_TAX_MASTER_LISTING;
    constructor(public payload: LoadTaxMasterListingPayload) { }
}
export class LoadTaxMasterListingSuccess implements Action {
    readonly type = TaxMasterActionTypes.LOAD_TAX_MASTER_LISTING_SUCCESS;
    constructor(public payload: LoadTaxMasterListingSuccessPayload) { }
}
export class LoadTaxMasterListingFailure implements Action {
    readonly type = TaxMasterActionTypes.LOAD_TAX_MASTER_LISTING_FAILURE;
    constructor(public payload: CustomErrors) { }
}

export class LoadTaxMasterDetailsByTaxCode implements Action {
    readonly type =
        TaxMasterActionTypes.LOAD_TAX_MASTER_DETAILS_BY_TAXCODE;
    constructor(public payload: string) { }
}
export class LoadTaxMasterDetailsByTaxCodeSuccess implements Action {
    readonly type =
        TaxMasterActionTypes.LOAD_TAX_MASTER_DETAILS_BY_TAXCODE_SUCCESS;
    constructor(public payload: TaxMasterDetails) { }
}
export class LoadTaxMasterDetailsByTaxCodeFailure implements Action {
    readonly type =
        TaxMasterActionTypes.LOAD_TAX_MASTER_DETAILS_BY_TAXCODE_FAILURE;
    constructor(public payload: CustomErrors) { }
}


export class SaveTaxMasterFormDetails implements Action {
    readonly type = TaxMasterActionTypes.SAVE_TAX_MASTER_FORM_DETAILS;
    constructor(public payload: TaxMasterDetails) { }
}
export class SaveTaxMasterFormDetailsSuccess implements Action {
    readonly type = TaxMasterActionTypes.SAVE_TAX_MASTER_FORM_DETAILS_SUCCESS;
    constructor(public payload: TaxMasterDetails) { }
}
export class SaveTaxMasterFormDetailsFailure implements Action {
    readonly type = TaxMasterActionTypes.SAVE_TAX_MASTER_FORM_DETAILS_FAILURE;
    constructor(public payload: CustomErrors) { }
}


export class EditTaxMasterFormDetails implements Action {
    readonly type = TaxMasterActionTypes.EDIT_TAX_MASTER_FORM_DETAILS
    constructor(public payload: TaxMasterDetails) { }
}
export class EditTaxMasterFormDetailsSuccess implements Action {
    readonly type = TaxMasterActionTypes.EDIT_TAX_MASTER_FORM_DETAILS_SUCCESS;
    constructor(public payload: TaxMasterDetails) { }
}
export class EditTaxMasterFormDetailsFailure implements Action {
    readonly type = TaxMasterActionTypes.EDIT_TAX_MASTER_FORM_DETAILS_FAILURE
    constructor(public payload: CustomErrors) { }
}


export class SearchTaxMasterCode implements Action {
    readonly type = TaxMasterActionTypes.SEARCH_TAX_MASTER_DETAILS;
    constructor(public payload: string) { }
}
export class SearchTaxMasterCodeSuccess implements Action {
    readonly type = TaxMasterActionTypes.SEARCH_TAX_MASTER_DETAILS_SUCCESS;
    constructor(public payload: TaxMasterDetails[]) { }
}
export class SearchTaxMasterCodeFailure implements Action {
    readonly type = TaxMasterActionTypes.SEARCH_TAX_MASTER_DETAILS_FAILURE;
    constructor(public payload: CustomErrors) { }
}

export class ResetTaxMasterDialog implements Action {
    readonly type = TaxMasterActionTypes.RESET_TAX_MASTER_DIALOG_DATA;
}

export type TaxMasterActions =
    | LoadTaxMasterListing
    | LoadTaxMasterListingSuccess
    | LoadTaxMasterListingFailure
    | LoadTaxMasterDetailsByTaxCode
    | LoadTaxMasterDetailsByTaxCodeSuccess
    | LoadTaxMasterDetailsByTaxCodeFailure
    | SaveTaxMasterFormDetails
    | SaveTaxMasterFormDetailsSuccess
    | SaveTaxMasterFormDetailsFailure
    | EditTaxMasterFormDetails
    | EditTaxMasterFormDetailsSuccess
    | EditTaxMasterFormDetailsFailure
    | SearchTaxMasterCode
    | SearchTaxMasterCodeSuccess
    | SearchTaxMasterCodeFailure
    | ResetTaxMasterDialog
