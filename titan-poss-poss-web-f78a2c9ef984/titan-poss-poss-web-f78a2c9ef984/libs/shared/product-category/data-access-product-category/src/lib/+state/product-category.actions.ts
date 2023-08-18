import { Action } from '@ngrx/store';
import { LoadProductCategoryListingPayload, CustomErrors, LoadProductCategoryListingSuccessPayload, ProductCategoryDetails, SaveProductCategoryFormDetailsPayload } from '@poss-web/shared/models';





export enum ProductCategoryActionTypes {
    LOAD_PRODUCT_CATEGORY_DETAILS = '[Load-ProductCategory-Details] Load ProductCategory Details',
    LOAD_PRODUCT_CATEGORY_DETAILS_SUCCESS = '[Load-ProductCategory-Details] Load ProductCategory Details Success',
    LOAD_PRODUCT_CATEGORY_DETAILS_FAILURE = '[Load-ProductCategory-Details] Load ProductCategory Details Failure',

    LOAD_PRODUCT_CATEGORY_DETAILS_BY_PRODUCT_CATEGORYCODE = '[Load-ProductCategory-Details] Load ProductCategory Details By ProductCategory Code',
    LOAD_PRODUCT_CATEGORY_DETAILS_BY_PRODUCT_CATEGORYCODE_SUCCESS = '[Load-ProductCategory-Details] Load ProductCategory Details By ProductCategory Code Success',
    LOAD_PRODUCT_CATEGORY_DETAILS_BY_PRODUCT_CATEGORYCODE_FAILURE = '[Load-ProductCategory-Details] Load ProductCategory Details By ProductCategory Code Failure',

    RESET_PRODUCT_CATEGORY_DIALOG_DATA = '[Load-ProductCategory-Details] Reset ProductCategory Dialog Data',

    SAVE_PRODUCT_CATEGORY_FORM_DETAILS = '[ Save-ProductCategory-Details ] SaveForm Details',
    SAVE_PRODUCT_CATEGORY_FORM_DETAILS_SUCCESS = '[ Save-ProductCategory-Details ] SaveForm Details Success',
    SAVE_PRODUCT_CATEGORY_FORM_DETAILS_FAILURE = '[ Save-ProductCategory-Details ] SaveForm Details Failure',

    EDIT_PRODUCT_CATEGORY_FORM_DETAILS = '[ Edit-ProductCategory-Details ] EditForm Details',
    EDIT_PRODUCT_CATEGORY_FORM_DETAILS_SUCCESS = '[ Edit-ProductCategory-Details ] EditForm Details Success',
    EDIT_PRODUCT_CATEGORY_FORM_DETAILS_FAILURE = '[ Edit-ProductCategory-Details ] EditForm Details Failure',

    SEARCH_PRODUCT_CATEGORY_DETAILS = '[Load-ProductCategory-Details] Search ProductCategory-Details',
    SEARCH_PRODUCT_CATEGORY_DETAILS_SUCCESS = '[Load-ProductCategory-Details] Search ProductCategory-Details Success',
    SEARCH_PRODUCT_CATEGORY_DETAILS_FAILURE = '[Load-ProductCategory-Details] Search ProductCategory-Details Failure'
}

export class LoadProductCategoryDetails implements Action {
    readonly type = ProductCategoryActionTypes.LOAD_PRODUCT_CATEGORY_DETAILS;
    constructor(public payload: LoadProductCategoryListingPayload) { }
}
export class LoadProductCategoryDetailsSuccess implements Action {
    readonly type =
        ProductCategoryActionTypes.LOAD_PRODUCT_CATEGORY_DETAILS_SUCCESS;
    constructor(public payload: LoadProductCategoryListingSuccessPayload) { }
}
export class LoadProductCategoryDetailsFailure implements Action {
    readonly type =
        ProductCategoryActionTypes.LOAD_PRODUCT_CATEGORY_DETAILS_FAILURE;
    constructor(public payload: CustomErrors) { }
}

export class LoadProductCategoryByProductCategoryCode implements Action {
    readonly type =
        ProductCategoryActionTypes.LOAD_PRODUCT_CATEGORY_DETAILS_BY_PRODUCT_CATEGORYCODE;
    constructor(public payload: string) { }
}
export class LoadProductCategoryByProductCategoryCodeSuccess implements Action {
    readonly type =
        ProductCategoryActionTypes.LOAD_PRODUCT_CATEGORY_DETAILS_BY_PRODUCT_CATEGORYCODE_SUCCESS;
    constructor(public payload: ProductCategoryDetails) { }
}
export class LoadProductCategoryByProductCategoryCodeFailure implements Action {
    readonly type =
        ProductCategoryActionTypes.LOAD_PRODUCT_CATEGORY_DETAILS_BY_PRODUCT_CATEGORYCODE_FAILURE;
    constructor(public payload: CustomErrors) { }
}

export class ResetProductCategoryDialog implements Action {
    readonly type = ProductCategoryActionTypes.RESET_PRODUCT_CATEGORY_DIALOG_DATA;
}


export class SaveProductCategoryFormDetails implements Action {
    readonly type = ProductCategoryActionTypes.SAVE_PRODUCT_CATEGORY_FORM_DETAILS;
    constructor(public payload: SaveProductCategoryFormDetailsPayload) { }
}

export class SaveProductCategoryFormDetailsSuccess implements Action {
    readonly type = ProductCategoryActionTypes.SAVE_PRODUCT_CATEGORY_FORM_DETAILS_SUCCESS;
    constructor(public payload: ProductCategoryDetails) { }
}

export class SaveProductCategoryFormDetailsFailure implements Action {
    readonly type = ProductCategoryActionTypes.SAVE_PRODUCT_CATEGORY_FORM_DETAILS_FAILURE;
    constructor(public payload: CustomErrors) { }
}


export class EditProductCategoryFormDetails implements Action {
    readonly type = ProductCategoryActionTypes.EDIT_PRODUCT_CATEGORY_FORM_DETAILS;
    constructor(public payload: SaveProductCategoryFormDetailsPayload) { }
}


export class EditProductCategoryFormDetailsSuccess implements Action {
    readonly type = ProductCategoryActionTypes.EDIT_PRODUCT_CATEGORY_FORM_DETAILS_SUCCESS;
    constructor(public payload: ProductCategoryDetails) { }
}
export class EditProductCategoryFormDetailsFailure implements Action {
    readonly type = ProductCategoryActionTypes.EDIT_PRODUCT_CATEGORY_FORM_DETAILS_FAILURE;
    constructor(public payload: CustomErrors) { }
}


export class SearchProductCategoryCode implements Action {
    readonly type = ProductCategoryActionTypes.SEARCH_PRODUCT_CATEGORY_DETAILS;
    constructor(public payload: string) { }
}
export class SearchProductCategoryCodeSuccess implements Action {
    readonly type = ProductCategoryActionTypes.SEARCH_PRODUCT_CATEGORY_DETAILS_SUCCESS;
    constructor(public payload: ProductCategoryDetails[]) { }
}
export class SearchProductCategoryCodeFailure implements Action {
    readonly type = ProductCategoryActionTypes.SEARCH_PRODUCT_CATEGORY_DETAILS_FAILURE;
    constructor(public payload: CustomErrors) { }
}


export type ProductCategoryActions =
    | LoadProductCategoryDetails
    | LoadProductCategoryDetailsSuccess
    | LoadProductCategoryDetailsFailure
    | LoadProductCategoryByProductCategoryCode
    | LoadProductCategoryByProductCategoryCodeSuccess
    | LoadProductCategoryByProductCategoryCodeFailure
    | ResetProductCategoryDialog
    | SaveProductCategoryFormDetails
    | SaveProductCategoryFormDetailsFailure
    | EditProductCategoryFormDetails
    | EditProductCategoryFormDetailsSuccess
    | EditProductCategoryFormDetailsFailure
    | SaveProductCategoryFormDetailsSuccess
    | SearchProductCategoryCode
    | SearchProductCategoryCodeSuccess
    | SearchProductCategoryCodeFailure
