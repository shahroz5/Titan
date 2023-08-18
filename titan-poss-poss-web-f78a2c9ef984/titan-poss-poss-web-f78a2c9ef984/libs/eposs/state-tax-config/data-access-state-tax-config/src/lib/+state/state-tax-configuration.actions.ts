import { Action } from '@ngrx/store';
import {
    CustomErrors,
    LoadStateTaxConfigurationListingPayload,
    StateTaxConfigurationListingResult,
    LoadStatesDetailsListingSuccessPayload,
    StateTaxConfigurationStateDetails,
    TaxDetailsSelect,
    TaxDetailsConfig,
    TaxDetailsSubmit,
    TaxsList
} from '@poss-web/shared/models';


export enum StateTaxConfigurationActionTypes {
    LOAD_STATE_TAX_CONFIGURATION_LISTING = '[Load-State-Tax-Configuration-Listing] Load StateTaxConfiguration Listing',
    LOAD_STATE_TAX_CONFIGURATION_LISTING_SUCCESS = '[Load-State-Tax-Configuration-Listing] Load StateTaxConfiguration Listing Success',
    LOAD_STATE_TAX_CONFIGURATION_LISTING_FAILURE = '[Load-State-Tax-Configuration-Listing] Load StateTaxConfiguration Listing Failure',

    SEARCH_STATE_TAX_CONFIGURATION_LISTING = '[Search-State-Tax-Configuration-Listing] Search StateTaxConfiguration Listing',
    SEARCH_STATE_TAX_CONFIGURATION_LISTING_SUCCESS = '[Search-State-Tax-Configuration-Listing] Search StateTaxConfiguration Listing Success',
    SEARCH_STATE_TAX_CONFIGURATION_LISTING_FAILURE = '[Search-State-Tax-Configuration-Listing] Search StateTaxConfiguration Listing Failure',

    LOAD_STATE_TAX_CONFIGURATION_STATE_DETAILS = '[Load-State-Tax-Configuration-State-Details] Load StateTaxConfiguration State Details',
    LOAD_STATE_TAX_CONFIGURATION_STATE_DETAILS_SUCCESS = '[Load-State-Tax-Configuration-State-Details] Load StateTaxConfiguration State Details Success',
    LOAD_STATE_TAX_CONFIGURATION_STATE_DETAILS_FAILURE = '[Load-State-Tax-Configuration-State-Details] Load StateTaxConfiguration State Details Failure',

    SAVE_STATE_TAX_CONFIGURATION_STATE_DETAILS = '[Save-State-Tax-Configuration-State-Details] Save StateTaxConfiguration State Details',
    SAVE_STATE_TAX_CONFIGURATION_STATE_DETAILS_SUCCESS = '[Save-State-Tax-Configuration-State-Details] Save StateTaxConfiguration State Details Success',
    SAVE_STATE_TAX_CONFIGURATION_STATE_DETAILS_FAILURE = '[Save-State-Tax-Configuration-State-Details] Save StateTaxConfiguration State Details Failure',

    EDIT_STATE_TAX_CONFIGURATION_STATE_DETAILS = '[Save-State-Tax-Configuration-State-Details] Edit StateTaxConfiguration State Details',
    EDIT_STATE_TAX_CONFIGURATION_STATE_DETAILS_SUCCESS = '[Save-State-Tax-Configuration-State-Details] Edit StateTaxConfiguration State Details Success',
    EDIT_STATE_TAX_CONFIGURATION_STATE_DETAILS_FAILURE = '[Save-State-Tax-Configuration-State-Details] Edit StateTaxConfiguration State Details Failure',

    LOAD_STATE_TAX_CONFIGURATION_TAX_DETAILS = '[Load-State-Tax-Configuration-Tax-Details] Load StateTaxConfiguration Tax Details',
    LOAD_STATE_TAX_CONFIGURATION_TAX_DETAILS_SUCCESS = '[Load-State-Tax-Configuration-Tax-Details] Load StateTaxConfiguration Tax Details Success',
    LOAD_STATE_TAX_CONFIGURATION_TAX_DETAILS_FAILURE = '[Load-State-Tax-Configuration-Tax-Details] Load StateTaxConfiguration Tax Details Failure',

    SAVE_STATE_TAX_CONFIGURATION_TAX_DETAILS = '[Save-State-Tax-Configuration-Tax-Details] Save StateTaxConfiguration Tax Details',
    SAVE_STATE_TAX_CONFIGURATION_TAX_DETAILS_SUCCESS = '[Save-State-Tax-Configuration-Tax-Details] Save StateTaxConfiguration Tax Details Success',
    SAVE_STATE_TAX_CONFIGURATION_TAX_DETAILS_FAILURE = '[Save-State-Tax-Configuration-Tax-Details] Save StateTaxConfiguration Tax Details Failure',

    SELECT_STATE_TAX_DETAILS = '[Select-State-Tax-Details] Select StateTaxDetails',
    SELECT_ALL_STATE_TAX_DETAILS = '[Select-State-Tax-Details] Select All StateTaxDetails',

    LOAD_ALL_STATE_LIST = '[Load-State-Tax-Configuration-Listing] Load All State List',
    LOAD_ALL_STATE_LIST_SUCCESS = '[Load-State-Tax-Configuration-Listing] Load All State List Success',
    LOAD_ALL_STATE_LIST_FAILURE = '[Load-State-Tax-Configuration-Listing] Load All State List Failure',

    LOAD_ALL_TAXSYSTEM_LIST = '[Load-State-Tax-Configuration-Listing] Load All TaxSystem List',
    LOAD_ALL_TAXSYSTEM_LIST_SUCCESS = '[Load-State-Tax-Configuration-Listing] Load All TaxSystem List Success',
    LOAD_ALL_TAXSYSTEM_LIST_FAILURE = '[Load-State-Tax-Configuration-Listing] Load All TaxSystem List Failure',

    LOAD_ALL_TAXCLASS_LIST = '[Load-State-Tax-Configuration-Listing] Load All TaxClass List',
    LOAD_ALL_TAXCLASS_LIST_SUCCESS = '[Load-State-Tax-Configuration-Listing] Load All TaxClass List Success',
    LOAD_ALL_TAXCLASS_LIST_FAILURE = '[Load-State-Tax-Configuration-Listing] Load All TaxClass List Failure',

    LOAD_ALL_TAXS_LIST = '[Load-State-Tax-Configuration-Listing] Load All Taxs List',
    LOAD_ALL_TAXS_LIST_SUCCESS = '[Load-State-Tax-Configuration-Listing] Load All Taxs List Success',
    LOAD_ALL_TAXS_LIST_FAILURE = '[Load-State-Tax-Configuration-Listing] Load All Taxs List Failure',

    RESET_STATE = '[Load-State-Tax-Configuration-Listing] Reset State'

}

export class LoadStateTaxConfigurationListing implements Action {
    readonly type = StateTaxConfigurationActionTypes.LOAD_STATE_TAX_CONFIGURATION_LISTING;
        constructor(public payload: { pageEvent : LoadStateTaxConfigurationListingPayload, stateName?: string}) { }
}
export class LoadStateTaxConfigurationListingSuccess implements Action {
    readonly type = StateTaxConfigurationActionTypes.LOAD_STATE_TAX_CONFIGURATION_LISTING_SUCCESS;
    constructor(public payload: StateTaxConfigurationListingResult) { }
}
export class LoadStateTaxConfigurationListingFailure implements Action {
    readonly type = StateTaxConfigurationActionTypes.LOAD_STATE_TAX_CONFIGURATION_LISTING_FAILURE;
    constructor(public payload: CustomErrors) { }
}

//Search
export class SearchStateTaxConfigurationListing implements Action {
    readonly type = StateTaxConfigurationActionTypes.SEARCH_STATE_TAX_CONFIGURATION_LISTING;
    constructor(public payload: string) { }
}
export class SearchStateTaxConfigurationListingSuccess implements Action {
    readonly type = StateTaxConfigurationActionTypes.SEARCH_STATE_TAX_CONFIGURATION_LISTING_SUCCESS;
    constructor(public payload: StateTaxConfigurationListingResult) { }
}
export class SearchStateTaxConfigurationListingFailure implements Action {
    readonly type = StateTaxConfigurationActionTypes.SEARCH_STATE_TAX_CONFIGURATION_LISTING_FAILURE;
    constructor(public payload: CustomErrors) { }
}

/// State Details
export class LoadStateTaxConfigurationStateDetails implements Action {
    readonly type = StateTaxConfigurationActionTypes.LOAD_STATE_TAX_CONFIGURATION_STATE_DETAILS;
    constructor(public payload: string) { }
}
export class LoadStateTaxConfigurationStateDetailsSuccess implements Action {
    readonly type = StateTaxConfigurationActionTypes.LOAD_STATE_TAX_CONFIGURATION_STATE_DETAILS_SUCCESS;
    constructor(public payload: StateTaxConfigurationStateDetails) { }
}
export class LoadStateTaxConfigurationStateDetailsFailure implements Action {
    readonly type = StateTaxConfigurationActionTypes.LOAD_STATE_TAX_CONFIGURATION_STATE_DETAILS_FAILURE;
    constructor(public payload: CustomErrors) { }
}

// Save
export class SaveStateTaxConfigurationStateDetails implements Action {
    readonly type = StateTaxConfigurationActionTypes.SAVE_STATE_TAX_CONFIGURATION_STATE_DETAILS;
    constructor(public payload: StateTaxConfigurationStateDetails) { }
}
export class SaveStateTaxConfigurationStateDetailsSuccess implements Action {
    readonly type = StateTaxConfigurationActionTypes.SAVE_STATE_TAX_CONFIGURATION_STATE_DETAILS_SUCCESS;
    constructor(public payload: StateTaxConfigurationStateDetails) { }
}
export class SaveStateTaxConfigurationStateDetailsFailure implements Action {
    readonly type = StateTaxConfigurationActionTypes.SAVE_STATE_TAX_CONFIGURATION_STATE_DETAILS_FAILURE;
    constructor(public payload: CustomErrors) { }
}

export class EditStateTaxConfigurationStateDetails implements Action {
    readonly type = StateTaxConfigurationActionTypes.EDIT_STATE_TAX_CONFIGURATION_STATE_DETAILS;
    constructor(public payload: { formData: StateTaxConfigurationStateDetails, configId: string }) { }
}
export class EditStateTaxConfigurationStateDetailsSuccess implements Action {
    readonly type = StateTaxConfigurationActionTypes.EDIT_STATE_TAX_CONFIGURATION_STATE_DETAILS_SUCCESS;
    constructor(public payload: StateTaxConfigurationStateDetails) { }
}
export class EditStateTaxConfigurationStateDetailsFailure implements Action {
    readonly type = StateTaxConfigurationActionTypes.EDIT_STATE_TAX_CONFIGURATION_STATE_DETAILS_FAILURE;
    constructor(public payload: CustomErrors) { }
}
// State Details Ends

/// Tax Details
export class LoadStateTaxConfigurationTaxDetails implements Action {
    readonly type = StateTaxConfigurationActionTypes.LOAD_STATE_TAX_CONFIGURATION_TAX_DETAILS;
    constructor(public payload: string) { }
}
export class LoadStateTaxConfigurationTaxDetailsSuccess implements Action {
    readonly type = StateTaxConfigurationActionTypes.LOAD_STATE_TAX_CONFIGURATION_TAX_DETAILS_SUCCESS;
    constructor(public payload: TaxDetailsConfig[]) { }
}
export class LoadStateTaxConfigurationTaxDetailsFailure implements Action {
    readonly type = StateTaxConfigurationActionTypes.LOAD_STATE_TAX_CONFIGURATION_TAX_DETAILS_FAILURE;
    constructor(public payload: CustomErrors) { }
}

// Save
export class SaveStateTaxConfigurationTaxDetails implements Action {
    readonly type = StateTaxConfigurationActionTypes.SAVE_STATE_TAX_CONFIGURATION_TAX_DETAILS;
    constructor(public payload: { formData: TaxDetailsSubmit, configId: string }) { }
}
export class SaveStateTaxConfigurationTaxDetailsSuccess implements Action {
    readonly type = StateTaxConfigurationActionTypes.SAVE_STATE_TAX_CONFIGURATION_TAX_DETAILS_SUCCESS;
    constructor(public payload: TaxDetailsSubmit) { }
}
export class SaveStateTaxConfigurationTaxDetailsFailure implements Action {
    readonly type = StateTaxConfigurationActionTypes.SAVE_STATE_TAX_CONFIGURATION_TAX_DETAILS_FAILURE;
    constructor(public payload: CustomErrors) { }
}
// Tax Details Ends

export class SelectStateTaxDetails implements Action {
    readonly type = StateTaxConfigurationActionTypes.SELECT_STATE_TAX_DETAILS;
    constructor(public payload: TaxDetailsSelect) { }
}

export class SelectAllStateTaxDetails implements Action {
    readonly type = StateTaxConfigurationActionTypes.SELECT_ALL_STATE_TAX_DETAILS;
    constructor(public payload: boolean) { }
}


export class LoadAllStateList implements Action {
    readonly type = StateTaxConfigurationActionTypes.LOAD_ALL_STATE_LIST;
}
export class LoadAllStateListSuccess implements Action {
    readonly type = StateTaxConfigurationActionTypes.LOAD_ALL_STATE_LIST_SUCCESS;
    constructor(public payload: LoadStatesDetailsListingSuccessPayload) { }
}
export class LoadAllStateListFailure implements Action {
    readonly type = StateTaxConfigurationActionTypes.LOAD_ALL_STATE_LIST_FAILURE;
    constructor(public payload: CustomErrors) { }
}

export class LoadAllTaxsystemList implements Action {
    readonly type = StateTaxConfigurationActionTypes.LOAD_ALL_TAXSYSTEM_LIST;
}
export class LoadAllTaxsystemListSuccess implements Action {
    readonly type = StateTaxConfigurationActionTypes.LOAD_ALL_TAXSYSTEM_LIST_SUCCESS;
    constructor(public payload: string[]) { }
}
export class LoadAllTaxsystemListFailure implements Action {
    readonly type = StateTaxConfigurationActionTypes.LOAD_ALL_TAXSYSTEM_LIST_FAILURE;
    constructor(public payload: CustomErrors) { }
}

export class LoadAllTaxClassList implements Action {
    readonly type = StateTaxConfigurationActionTypes.LOAD_ALL_TAXCLASS_LIST;
}
export class LoadAllTaxClassListSuccess implements Action {
    readonly type = StateTaxConfigurationActionTypes.LOAD_ALL_TAXCLASS_LIST_SUCCESS;
    constructor(public payload: string[]) { }
}
export class LoadAllTaxClassListFailure implements Action {
    readonly type = StateTaxConfigurationActionTypes.LOAD_ALL_TAXCLASS_LIST_FAILURE;
    constructor(public payload: CustomErrors) { }
}

export class LoadAllTaxsList implements Action {
    readonly type = StateTaxConfigurationActionTypes.LOAD_ALL_TAXS_LIST;
}
export class LoadAllTaxsListSuccess implements Action {
    readonly type = StateTaxConfigurationActionTypes.LOAD_ALL_TAXS_LIST_SUCCESS;
    constructor(public payload: TaxsList[]) { }
}
export class LoadAllTaxsListFailure implements Action {
    readonly type = StateTaxConfigurationActionTypes.LOAD_ALL_TAXS_LIST_FAILURE;
    constructor(public payload: CustomErrors) { }
}

export class ResetStateTaxCoonfigurationState implements Action {
    readonly type = StateTaxConfigurationActionTypes.RESET_STATE;
}


export type StateTaxConfigurationActions =
    | LoadStateTaxConfigurationListing
    | LoadStateTaxConfigurationListingSuccess
    | LoadStateTaxConfigurationListingFailure
    | SearchStateTaxConfigurationListing
    | SearchStateTaxConfigurationListingSuccess
    | SearchStateTaxConfigurationListingFailure
    | LoadStateTaxConfigurationStateDetails
    | LoadStateTaxConfigurationStateDetailsSuccess
    | LoadStateTaxConfigurationStateDetailsFailure
    | SaveStateTaxConfigurationStateDetails
    | SaveStateTaxConfigurationStateDetailsSuccess
    | SaveStateTaxConfigurationStateDetailsFailure
    | EditStateTaxConfigurationStateDetails
    | EditStateTaxConfigurationStateDetailsSuccess
    | EditStateTaxConfigurationStateDetailsFailure
    | LoadStateTaxConfigurationTaxDetails
    | LoadStateTaxConfigurationTaxDetailsSuccess
    | LoadStateTaxConfigurationTaxDetailsFailure
    | SaveStateTaxConfigurationTaxDetails
    | SaveStateTaxConfigurationTaxDetailsSuccess
    | SaveStateTaxConfigurationTaxDetailsFailure
    | SelectStateTaxDetails
    | SelectAllStateTaxDetails
    | LoadAllStateList
    | LoadAllStateListSuccess
    | LoadAllStateListFailure
    | LoadAllTaxsystemList
    | LoadAllTaxsystemListSuccess
    | LoadAllTaxsystemListFailure
    | LoadAllTaxClassList
    | LoadAllTaxClassListSuccess
    | LoadAllTaxClassListFailure
    | LoadAllTaxsList
    | LoadAllTaxsListSuccess
    | LoadAllTaxsListFailure
    | ResetStateTaxCoonfigurationState
