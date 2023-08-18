import {
  ComplexityPriceGroupDetails,
  EditComplexityPriceGroupFormPayload,
  PriceGroups,
  Complexity,
  CustomErrors,
  LoadComplexityPriceGroupListingPayload,
  LoadComplexityPriceGroupListingSuccessPayload,
  SaveComplexityPriceGroupFormPayload,
  ComplexityPricegroupFilter
} from '@poss-web/shared/models';
import { Action } from '@ngrx/store';


export enum ComplexityPriceGroupActionTypes {
  LOAD_COMPLEXITY_PRICEGROUP_MAPPING_LISTING = '[Load-Complexity-Pricegroup-Mapping] Load Complexity Pricegroup Map Details',
  LOAD_COMPLEXITY_PRICEGROUP_MAPPING_LISTING_SUCCESS = '[Load-Complexity-Pricegroup-Mapping] Load Complexity Pricegroup Map Details Success',
  LOAD_COMPLEXITY_PRICEGROUP_MAPPING_LISTING_FAILURE = '[Load-Complexity-Pricegroup-Mapping] Load Complexity Pricegroup Map Details Failure',

  LOAD_COMPLEXITY_PRICEGROUP_MAPPING_DETAILS_BY_ID = '[Load-Complexity-Pricegroup-Mapping] Load Complexity Pricegroup Map Details By Id',
  LOAD_COMPLEXITY_PRICEGROUP_MAPPING_DETAILS_BY_ID_SUCCESS = '[Load-Complexity-Pricegroup-Mapping] Load Complexity Pricegroup Map Details By Id Success',
  LOAD_COMPLEXITY_PRICEGROUP_MAPPING_DETAILS_BY_ID_FAILURE = '[Load-Complexity-Pricegroup-Mapping] Load Complexity Pricegroup Map Details By IdFailure',

  RESET_COMPLEXITY_PRICEGROUP_DIALOG_DATA = '[Load-Complexity-Pricegroup-Mapping] Reset Complexity Pricegroup Dialog Data',

  SAVE_COMPLEXITY_PRICEGROUP_FORM_DETAILS = '[ Save-Complexity-Pricegroup-Details ] SaveForm Details',
  SAVE_COMPLEXITY_PRICEGROUP_FORM_DETAILS_SUCCESS = '[ Save-Complexity-Pricegroup-Details ] SaveForm Details Success',
  SAVE_COMPLEXITY_PRICEGROUP_FORM_DETAILS_FAILURE = '[ Save-Complexity-Pricegroup-Details ] SaveForm Details Failure',

  EDIT_COMPLEXITY_PRICEGROUP_FORM_DETAILS = '[ Edit-Complexity-Pricegroup-Details ] EditForm Details',
  EDIT_COMPLEXITY_PRICEGROUP_FORM_DETAILS_SUCCESS = '[ Edit-Complexity-Pricegroup-Details ] EditForm Details Success',
  EDIT_COMPLEXITY_PRICEGROUP_FORM_DETAILS_FAILURE = '[ Edit-Complexity-Pricegroup-Details ] EditForm Details Failure',

  SEARCH_COMPLEXITY_PRICEGROUP_BY_COMPLEXITYCODE = '[Load-Complexity-Pricegroup-Mapping] Search Complexity Pricegroup By Id',
  SEARCH_COMPLEXITY_PRICEGROUP_BY_COMPLEXITYCODE_SUCCESS = '[Load-Complexity-Pricegroup-Mapping] Search Complexity Pricegroup By Id Success',
  SEARCH_COMPLEXITY_PRICEGROUP_BY_COMPLEXITYCODE_FAILURE = '[Load-Complexity-Pricegroup-Mapping] Search Complexity Pricegroup By Id Failure',

  LOAD_COMPLEXITY_CODE = '[Load-Complexity-Pricegroup-Mapping] Load Complexitycode ',
  LOAD_COMPLEXITY_CODE_SUCCESS = '[Load-Complexity-Pricegroup-Mapping] Load Complexitycode Success',
  LOAD_COMPLEXITY_CODE_FAILURE = '[Load-Complexity-Pricegroup-Mapping] Load Complexitycode Failure',

  LOAD_PRICEGROUP = '[Load-Complexity-Pricegroup-Mapping] Load Pricegroup',
  LOAD_PRICEGROUP_SUCCESS = '[Load-Complexity-Pricegroup-Mapping] Load Pricegroup Success',
  LOAD_PRICEGROUP_FAILURE = '[Load-Complexity-Pricegroup-Mapping] Load Pricegroup Failure',

  LOAD_FILE_UPLOAD_ITEMS = '[ Load-Complexity-Pricegroup-Mapping ] Load File Upload Items ',
  LOAD_FILE_UPLOAD_ITEMS_SUCCESS = '[ Load-Complexity-Pricegroup-Mapping] Load File Upload Items Success',
  LOAD_FILE_UPLOAD_ITEMS_FAILURE = '[ Load-Complexity-Pricegroup-Mapping ] Load File Upload Items Failure',
}

export class LoadComplexityPricegroupMappingDetails implements Action {
  readonly type =
    ComplexityPriceGroupActionTypes.LOAD_COMPLEXITY_PRICEGROUP_MAPPING_LISTING;
  constructor(
    public payload: LoadComplexityPriceGroupListingPayload,
    public complexityCode?: string,
    public priceCode?: string
  ) {}
}

export class LoadComplexityPricegroupMappingDetailsSuccess implements Action {
  readonly type =
    ComplexityPriceGroupActionTypes.LOAD_COMPLEXITY_PRICEGROUP_MAPPING_LISTING_SUCCESS;
  constructor(public payload: LoadComplexityPriceGroupListingSuccessPayload) {}
}

export class LoadComplexityPricegroupMappingDetailsFailure implements Action {
  readonly type =
    ComplexityPriceGroupActionTypes.LOAD_COMPLEXITY_PRICEGROUP_MAPPING_LISTING_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadComplexityPricegroupMappingDetailsById implements Action {
  readonly type =
    ComplexityPriceGroupActionTypes.LOAD_COMPLEXITY_PRICEGROUP_MAPPING_DETAILS_BY_ID;
  constructor(public payload: string) {}
}

export class LoadComplexityPricegroupMappingDetailsByIdSuccess
  implements Action {
  readonly type =
    ComplexityPriceGroupActionTypes.LOAD_COMPLEXITY_PRICEGROUP_MAPPING_DETAILS_BY_ID_SUCCESS;
  constructor(public payload: ComplexityPriceGroupDetails) {}
}

export class LoadComplexityPricegroupMappingDetailsByIdFailure
  implements Action {
  readonly type =
    ComplexityPriceGroupActionTypes.LOAD_COMPLEXITY_PRICEGROUP_MAPPING_DETAILS_BY_ID_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class ResetComplexityPricegroupDialog implements Action {
  readonly type =
    ComplexityPriceGroupActionTypes.RESET_COMPLEXITY_PRICEGROUP_DIALOG_DATA;
}

export class SaveComplexityPricegroupFormDetails implements Action {
  readonly type =
    ComplexityPriceGroupActionTypes.SAVE_COMPLEXITY_PRICEGROUP_FORM_DETAILS;
  constructor(public payload: SaveComplexityPriceGroupFormPayload) {}
}

export class SaveComplexityPricegroupFormDetailsSuccess implements Action {
  readonly type =
    ComplexityPriceGroupActionTypes.SAVE_COMPLEXITY_PRICEGROUP_FORM_DETAILS_SUCCESS;
  constructor(public payload: ComplexityPriceGroupDetails) {}
}

export class SaveComplexityPricegroupFormDetailsFailure implements Action {
  readonly type =
    ComplexityPriceGroupActionTypes.SAVE_COMPLEXITY_PRICEGROUP_FORM_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class EditComplexityPricegroupFormDetails implements Action {
  readonly type =
    ComplexityPriceGroupActionTypes.EDIT_COMPLEXITY_PRICEGROUP_FORM_DETAILS;
  constructor(public payload: EditComplexityPriceGroupFormPayload) {}
}

export class EditComplexityPricegroupFormDetailsSuccess implements Action {
  readonly type =
    ComplexityPriceGroupActionTypes.EDIT_COMPLEXITY_PRICEGROUP_FORM_DETAILS_SUCCESS;
  constructor(public payload: ComplexityPriceGroupDetails) {}
}

export class EditComplexityPricegroupFormDetailsFailure implements Action {
  readonly type =
    ComplexityPriceGroupActionTypes.EDIT_COMPLEXITY_PRICEGROUP_FORM_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class LoadComplexityCode implements Action {
  readonly type = ComplexityPriceGroupActionTypes.LOAD_COMPLEXITY_CODE;
}

export class LoadComplexityCodeSuccess implements Action {
  readonly type = ComplexityPriceGroupActionTypes.LOAD_COMPLEXITY_CODE_SUCCESS;
  constructor(public payload: Complexity[]) {}
}

export class LoadComplexityCodeFailure implements Action {
  readonly type = ComplexityPriceGroupActionTypes.LOAD_COMPLEXITY_CODE_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadPricegroup implements Action {
  readonly type = ComplexityPriceGroupActionTypes.LOAD_PRICEGROUP;
}

export class LoadPricegroupSuccess implements Action {
  readonly type = ComplexityPriceGroupActionTypes.LOAD_PRICEGROUP_SUCCESS;
  constructor(public payload: PriceGroups[]) {}
}

export class LoadPricegroupFailure implements Action {
  readonly type = ComplexityPriceGroupActionTypes.LOAD_PRICEGROUP_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadFileUploadItems implements Action {
  readonly type = ComplexityPriceGroupActionTypes.LOAD_FILE_UPLOAD_ITEMS;
  constructor(public payload: FormData) {}
}

export class LoadFileUploadItemsSuccess implements Action {
  readonly type = ComplexityPriceGroupActionTypes.LOAD_FILE_UPLOAD_ITEMS_SUCCESS;
  constructor(public payload: boolean) {}
}

export class LoadFileUploadItemsFailure implements Action {
  readonly type = ComplexityPriceGroupActionTypes.LOAD_FILE_UPLOAD_ITEMS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export type ComplexityPriceGroupActions =
  | LoadComplexityPricegroupMappingDetails
  | LoadComplexityPricegroupMappingDetailsSuccess
  | LoadComplexityPricegroupMappingDetailsFailure
  | LoadComplexityPricegroupMappingDetailsById
  | LoadComplexityPricegroupMappingDetailsByIdSuccess
  | LoadComplexityPricegroupMappingDetailsByIdFailure
  | ResetComplexityPricegroupDialog
  | SaveComplexityPricegroupFormDetails
  | SaveComplexityPricegroupFormDetailsSuccess
  | SaveComplexityPricegroupFormDetailsFailure
  | EditComplexityPricegroupFormDetails
  | EditComplexityPricegroupFormDetailsSuccess
  | EditComplexityPricegroupFormDetailsFailure
  | LoadComplexityCode
  | LoadComplexityCodeSuccess
  | LoadComplexityCodeFailure
  | LoadPricegroup
  | LoadPricegroupSuccess
  | LoadPricegroupFailure
  | LoadFileUploadItems
  | LoadFileUploadItemsSuccess
  | LoadFileUploadItemsFailure;
