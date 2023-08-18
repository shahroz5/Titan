import { Action } from '@ngrx/store';
import {
    CustomErrors,
    LoadTaxClassListingPayload,
    LoadTaxClassListingSuccessPayload,
    TaxClassDetails
} from '@poss-web/shared/models';





export enum TaxClassActionTypes {
    LOAD_TAX_CLASS_LISTING = '[Load-TaxClass-Listing] Load TaxClass Listing',
    LOAD_TAX_CLASS_LISTING_SUCCESS = '[Load-TaxClass-Listing] Load TaxClass Listing Success',
    LOAD_TAX_CLASS_LISTING_FAILURE = '[Load-TaxClass-Listing] Load TaxClass Listing Failure',

    LOAD_TAX_CLASS_DETAILS_BY_TAXCLASSCODE = '[Load-TaxClass-Details] Load TaxClass Details By TaxClassCode',
    LOAD_TAX_CLASS_DETAILS_BY_TAXCLASSCODE_SUCCESS = '[Load-TaxClass-Details] Load TaxClass Details By TaxClassCode Success',
    LOAD_TAX_CLASS_DETAILS_BY_TAXCLASSCODE_FAILURE = '[Load-TaxClass-Details] Load TaxClass Details By TaxClassCode Failure',

    RESET_TAX_CLASS_DIALOG_DATA = '[Load-TaxClass-Details] Reset TaxClass Dialog Data',

    SAVE_TAX_CLASS_FORM_DETAILS = '[ Save-TaxClass-Details ] SaveForm Details',
    SAVE_TAX_CLASS_FORM_DETAILS_SUCCESS = '[ Save-TaxClass-Details ] SaveForm Details Success',
    SAVE_TAX_CLASS_FORM_DETAILS_FAILURE = '[ Save-TaxClass-Details ] SaveForm Details Failure',

    EDIT_TAX_CLASS_FORM_DETAILS = '[ Edit-TaxClass-Details ] EditForm Details',
    EDIT_TAX_CLASS_FORM_DETAILS_SUCCESS = '[ Edit-TaxClass-Details ] EditForm Details Success',
    EDIT_TAX_CLASS_FORM_DETAILS_FAILURE = '[ Edit-TaxClass-Details ] EditForm Details Failure',

    SEARCH_TAX_CLASS_DETAILS = '[Load-TaxClass-Details] Search TaxClass-Details',
    SEARCH_TAX_CLASS_DETAILS_SUCCESS = '[Load-TaxClass-Details] Search TaxClass-Details Success',
    SEARCH_TAX_CLASS_DETAILS_FAILURE = '[Load-TaxClass-Details] Search TaxClass-Details Failure'
}

export class LoadTaxClassListing implements Action {
    readonly type = TaxClassActionTypes.LOAD_TAX_CLASS_LISTING;
    constructor(public payload: LoadTaxClassListingPayload) { }
}
export class LoadTaxClassListingSuccess implements Action {
    readonly type = TaxClassActionTypes.LOAD_TAX_CLASS_LISTING_SUCCESS;
    constructor(public payload: LoadTaxClassListingSuccessPayload) { }
}
export class LoadTaxClassListingFailure implements Action {
    readonly type = TaxClassActionTypes.LOAD_TAX_CLASS_LISTING_FAILURE;
    constructor(public payload: CustomErrors) { }
}

export class LoadTaxClassDetailsByTaxClassCode implements Action {
    readonly type =
        TaxClassActionTypes.LOAD_TAX_CLASS_DETAILS_BY_TAXCLASSCODE;
    constructor(public payload: string) { }
}
export class LoadTaxClassDetailsByTaxClassCodeSuccess implements Action {
    readonly type =
        TaxClassActionTypes.LOAD_TAX_CLASS_DETAILS_BY_TAXCLASSCODE_SUCCESS;
    constructor(public payload: TaxClassDetails) { }
}
export class LoadTaxClassDetailsByTaxClassCodeFailure implements Action {
    readonly type =
        TaxClassActionTypes.LOAD_TAX_CLASS_DETAILS_BY_TAXCLASSCODE_FAILURE;
    constructor(public payload: CustomErrors) { }
}


export class SaveTaxClassFormDetails implements Action {
    readonly type = TaxClassActionTypes.SAVE_TAX_CLASS_FORM_DETAILS;
    constructor(public payload: TaxClassDetails) { }
}
export class SaveTaxClassFormDetailsSuccess implements Action {
    readonly type = TaxClassActionTypes.SAVE_TAX_CLASS_FORM_DETAILS_SUCCESS;
    constructor(public payload: TaxClassDetails) { }
}
export class SaveTaxClassFormDetailsFailure implements Action {
    readonly type = TaxClassActionTypes.SAVE_TAX_CLASS_FORM_DETAILS_FAILURE;
    constructor(public payload: CustomErrors) { }
}


export class EditTaxClassFormDetails implements Action {
    readonly type = TaxClassActionTypes.EDIT_TAX_CLASS_FORM_DETAILS
    constructor(public payload: TaxClassDetails) { }
}
export class EditTaxClassFormDetailsSuccess implements Action {
    readonly type = TaxClassActionTypes.EDIT_TAX_CLASS_FORM_DETAILS_SUCCESS;
    constructor(public payload: TaxClassDetails) { }
}
export class EditTaxClassFormDetailsFailure implements Action {
    readonly type = TaxClassActionTypes.EDIT_TAX_CLASS_FORM_DETAILS_FAILURE
    constructor(public payload: CustomErrors) { }
}


export class SearchTaxClassCode implements Action {
    readonly type = TaxClassActionTypes.SEARCH_TAX_CLASS_DETAILS;
    constructor(public payload: string) { }
}
export class SearchTaxClassCodeSuccess implements Action {
    readonly type = TaxClassActionTypes.SEARCH_TAX_CLASS_DETAILS_SUCCESS;
    constructor(public payload: TaxClassDetails[]) { }
}
export class SearchTaxClassCodeFailure implements Action {
    readonly type = TaxClassActionTypes.SEARCH_TAX_CLASS_DETAILS_FAILURE;
    constructor(public payload: CustomErrors) { }
}

export class ResetTaxClassDialog implements Action {
    readonly type = TaxClassActionTypes.RESET_TAX_CLASS_DIALOG_DATA;
}

export type TaxClassActions =
    | LoadTaxClassListing
    | LoadTaxClassListingSuccess
    | LoadTaxClassListingFailure
    | LoadTaxClassDetailsByTaxClassCode
    | LoadTaxClassDetailsByTaxClassCodeSuccess
    | LoadTaxClassDetailsByTaxClassCodeFailure
    | SaveTaxClassFormDetails
    | SaveTaxClassFormDetailsSuccess
    | SaveTaxClassFormDetailsFailure
    | EditTaxClassFormDetails
    | EditTaxClassFormDetailsSuccess
    | EditTaxClassFormDetailsFailure
    | SearchTaxClassCode
    | SearchTaxClassCodeSuccess
    | SearchTaxClassCodeFailure
    | ResetTaxClassDialog
