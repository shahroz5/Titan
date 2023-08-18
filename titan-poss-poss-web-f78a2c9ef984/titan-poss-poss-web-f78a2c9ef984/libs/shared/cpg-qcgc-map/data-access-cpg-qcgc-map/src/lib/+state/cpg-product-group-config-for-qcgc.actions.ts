import { Action } from '@ngrx/store';
import {
  CustomErrors,
  LoadCPGProductGroupConfigForQCGCListingPayload,
  CPGProductGroupConfigForQCGCListingResult,
  CPGProductGroupConfigForQCGCDetails,
  ProductGroupMappingOption,
  CPGProductGroupConfigForQCGCMapping
} from '@poss-web/shared/models';

export enum CPGProductGroupConfigForQCGCActionTypes {
  LOAD_CPG_PRODUCT_GROUP_CONFIG_FOR_QCGC_LISTING = '[Load-CPG-Product-Group-Config-for-QCGC-Listing] Load CPGProductGroupConfigForQCGC Listing',
  LOAD_CPG_PRODUCT_GROUP_CONFIG_FOR_QCGC_LISTING_SUCCESS = '[Load-CPG-Product-Group-Config-for-QCGC-Listing] Load CPGProductGroupConfigForQCGC Listing Success',
  LOAD_CPG_PRODUCT_GROUP_CONFIG_FOR_QCGC_LISTING_FAILURE = '[Load-CPG-Product-Group-Config-for-QCGC-Listing] Load CPGProductGroupConfigForQCGC Listing Failure',

  SEARCH_CPG_PRODUCT_GROUP_CONFIG_FOR_QCGC_LISTING = '[Search-CPG-Product-Group-Config-for-QCGC-Listing] Search CPGProductGroupConfiForQCGCg Listing',
  SEARCH_CPG_PRODUCT_GROUP_CONFIG_FOR_QCGC_LISTING_SUCCESS = '[Search-CPG-Product-Group-Config-for-QCGC-Listing] Search CPGProductGroupConfigForQCGC Listing Success',
  SEARCH_CPG_PRODUCT_GROUP_CONFIG_FOR_QCGC_LISTING_FAILURE = '[Search-CPG-Product-Group-Config-for-QCGC-Listing] Search CPGProductGroupConfigForQCGC Listing Failure',

  LOAD_CPG_PRODUCT_GROUP_CONFIG_FOR_QCGC_DETAILS = '[Load-CPG-Product-Group-Config-for-QCGC-Details] Load CPGProductGroupConfigForQCGC Details',
  LOAD_CPG_PRODUCT_GROUP_CONFIG_FOR_QCGC_DETAILS_SUCCESS = '[Load-CPG-Product-Group-Config-for-QCGC-Details] Load CPGProductGroupConfigForQCGC Details Success',
  LOAD_CPG_PRODUCT_GROUP_CONFIG_FOR_QCGC_DETAILS_FAILURE = '[Load-CPG-Product-Group-Config-for-QCGC-Details] Load CPGProductGroupConfigForQCGC Details Failure',

  SAVE_CPG_PRODUCT_GROUP_CONFIG_FOR_QCGC_DETAILS = '[Save-CPG-Product-Group-Config-for-QCGC-Details] Save CPGProductGroupConfigForQCGC Details',
  SAVE_CPG_PRODUCT_GROUP_CONFIG_FOR_QCGC_DETAILS_SUCCESS = '[Save-CPG-Product-Group-Config-for-QCGC-Details] Save CPGProductGroupConfigForQCGC Details Success',
  SAVE_CPG_PRODUCT_GROUP_CONFIG_FOR_QCGC_DETAILS_FAILURE = '[Save-CPG-Product-Group-Config-for-QCGC-Details] Save CPGProductGroupConfigForQCGC Details Failure',

  EDIT_CPG_PRODUCT_GROUP_CONFIG_FOR_QCGC_DETAILS = '[Edit-CPG-Product-Group-Config-for-QCGC-Details] Edit CPGProductGroupConfigForQCGC Details',
  EDIT_CPG_PRODUCT_GROUP_CONFIG_FOR_QCGC_DETAILS_SUCCESS = '[Edit-CPG-Product-Group-Config-for-QCGC-Details] Edit CPGProductGroupConfigForQCGC Details Success',
  EDIT_CPG_PRODUCT_GROUP_CONFIG_FOR_QCGC_DETAILS_FAILURE = '[Edit-CPG-Product-Group-Config-for-QCGC-Details] Edit CPGProductGroupConfigForQCGC Details Failure',

  LOAD_CPG_PRODUCT_GROUP_CONFIG_FOR_QCGC_MAPPING = '[Load-CPG-Product-Group-Config-for-QCGC-Mapping] Load CPGProductGroupConfigForQCGC Mapping',
  LOAD_CPG_PRODUCT_GROUP_CONFIG_FOR_QCGC_MAPPING_SUCCESS = '[Load-CPG-Product-Group-Config-for-QCGC-Mapping] Load CPGProductGroupConfigForQCGC Mapping Success',
  LOAD_CPG_PRODUCT_GROUP_CONFIG_FOR_QCGC_MAPPING_FAILURE = '[Load-CPG-Product-Group-Config-for-QCGC-Mapping] Load CPGProductGroupConfigForQCGC Mapping Failure',

  SAVE_CPG_PRODUCT_GROUP_CONFIG_FOR_QCGC_MAPPING = '[Save-CPG-Product-Group-Config-for-QCGC-Mapping] Save CPGProductGroupConfigForQCGC Mapping',
  SAVE_CPG_PRODUCT_GROUP_CONFIG_FOR_QCGC_MAPPING_SUCCESS = '[Save-CPG-Product-Group-Config-for-QCGC-Mapping] Save CPGProductGroupConfigForQCGC Mapping Success',
  SAVE_CPG_PRODUCT_GROUP_CONFIG_FOR_QCGC_MAPPING_FAILURE = '[Save-CPG-Product-Group-Config-for-QCGC-Mapping] Save CPGProductGroupConfigForQCGC Mapping Failure'
}

export class LoadCPGProductGroupConfigForQCGCListing implements Action {
  readonly type =
    CPGProductGroupConfigForQCGCActionTypes.LOAD_CPG_PRODUCT_GROUP_CONFIG_FOR_QCGC_LISTING;
  constructor(public payload: LoadCPGProductGroupConfigForQCGCListingPayload) {}
}
export class LoadCPGProductGroupConfigForQCGCListingSuccess implements Action {
  readonly type =
    CPGProductGroupConfigForQCGCActionTypes.LOAD_CPG_PRODUCT_GROUP_CONFIG_FOR_QCGC_LISTING_SUCCESS;
  constructor(public payload: CPGProductGroupConfigForQCGCListingResult) {}
}
export class LoadCPGProductGroupConfigForQCGCListingFailure implements Action {
  readonly type =
    CPGProductGroupConfigForQCGCActionTypes.LOAD_CPG_PRODUCT_GROUP_CONFIG_FOR_QCGC_LISTING_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SearchCPGProductGroupConfigForQCGCListing implements Action {
  readonly type =
    CPGProductGroupConfigForQCGCActionTypes.SEARCH_CPG_PRODUCT_GROUP_CONFIG_FOR_QCGC_LISTING;
  constructor(public payload: string) {}
}
export class SearchCPGProductGroupConfigForQCGCListingSuccess
  implements Action {
  readonly type =
    CPGProductGroupConfigForQCGCActionTypes.SEARCH_CPG_PRODUCT_GROUP_CONFIG_FOR_QCGC_LISTING_SUCCESS;
  constructor(public payload: CPGProductGroupConfigForQCGCDetails) {}
}
export class SearchCPGProductGroupConfigForQCGCListingFailure
  implements Action {
  readonly type =
    CPGProductGroupConfigForQCGCActionTypes.SEARCH_CPG_PRODUCT_GROUP_CONFIG_FOR_QCGC_LISTING_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadCPGProductGroupConfigForQCGCDetails implements Action {
  readonly type =
    CPGProductGroupConfigForQCGCActionTypes.LOAD_CPG_PRODUCT_GROUP_CONFIG_FOR_QCGC_DETAILS;
  constructor(public payload: string) {}
}
export class LoadCPGProductGroupConfigForQCGCDetailsSuccess implements Action {
  readonly type =
    CPGProductGroupConfigForQCGCActionTypes.LOAD_CPG_PRODUCT_GROUP_CONFIG_FOR_QCGC_DETAILS_SUCCESS;
  constructor(public payload: CPGProductGroupConfigForQCGCDetails) {}
}
export class LoadCPGProductGroupConfigForQCGCDetailsFailure implements Action {
  readonly type =
    CPGProductGroupConfigForQCGCActionTypes.LOAD_CPG_PRODUCT_GROUP_CONFIG_FOR_QCGC_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SaveCPGProductGroupConfigForQCGCDetails implements Action {
  readonly type =
    CPGProductGroupConfigForQCGCActionTypes.SAVE_CPG_PRODUCT_GROUP_CONFIG_FOR_QCGC_DETAILS;
  constructor(public payload: CPGProductGroupConfigForQCGCDetails) {}
}
export class SaveCPGProductGroupConfigForQCGCDetailsSuccess implements Action {
  readonly type =
    CPGProductGroupConfigForQCGCActionTypes.SAVE_CPG_PRODUCT_GROUP_CONFIG_FOR_QCGC_DETAILS_SUCCESS;
  constructor(public payload: CPGProductGroupConfigForQCGCDetails) {}
}
export class SaveCPGProductGroupConfigForQCGCDetailsFailure implements Action {
  readonly type =
    CPGProductGroupConfigForQCGCActionTypes.SAVE_CPG_PRODUCT_GROUP_CONFIG_FOR_QCGC_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class EditCPGProductGroupConfigForQCGCDetails implements Action {
  readonly type =
    CPGProductGroupConfigForQCGCActionTypes.EDIT_CPG_PRODUCT_GROUP_CONFIG_FOR_QCGC_DETAILS;
  constructor(public payload: CPGProductGroupConfigForQCGCDetails) {}
}
export class EditCPGProductGroupConfigForQCGCDetailsSuccess implements Action {
  readonly type =
    CPGProductGroupConfigForQCGCActionTypes.EDIT_CPG_PRODUCT_GROUP_CONFIG_FOR_QCGC_DETAILS_SUCCESS;
  constructor(public payload: CPGProductGroupConfigForQCGCDetails) {}
}
export class EditCPGProductGroupConfigForQCGCDetailsFailure implements Action {
  readonly type =
    CPGProductGroupConfigForQCGCActionTypes.EDIT_CPG_PRODUCT_GROUP_CONFIG_FOR_QCGC_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadCPGProductGroupConfigForQCGCMapping implements Action {
  readonly type =
    CPGProductGroupConfigForQCGCActionTypes.LOAD_CPG_PRODUCT_GROUP_CONFIG_FOR_QCGC_MAPPING;
  constructor(public payload: string) {}
}
export class LoadCPGProductGroupConfigForQCGCMappingSuccess implements Action {
  readonly type =
    CPGProductGroupConfigForQCGCActionTypes.LOAD_CPG_PRODUCT_GROUP_CONFIG_FOR_QCGC_MAPPING_SUCCESS;
  constructor(public payload: ProductGroupMappingOption[]) {}
}
export class LoadCPGProductGroupConfigForQCGCMappingFailure implements Action {
  readonly type =
    CPGProductGroupConfigForQCGCActionTypes.LOAD_CPG_PRODUCT_GROUP_CONFIG_FOR_QCGC_MAPPING_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SaveCPGProductGroupConfigForQCGCMapping implements Action {
  readonly type =
    CPGProductGroupConfigForQCGCActionTypes.SAVE_CPG_PRODUCT_GROUP_CONFIG_FOR_QCGC_MAPPING;
  constructor(
    public payload: { data: CPGProductGroupConfigForQCGCMapping; id: string }
  ) {}
}
export class SaveCPGProductGroupConfigForQCGCMappingSuccess implements Action {
  readonly type =
    CPGProductGroupConfigForQCGCActionTypes.SAVE_CPG_PRODUCT_GROUP_CONFIG_FOR_QCGC_MAPPING_SUCCESS;
  constructor(public payload: ProductGroupMappingOption[]) {}
}
export class SaveCPGProductGroupConfigForQCGCMappingFailure implements Action {
  readonly type =
    CPGProductGroupConfigForQCGCActionTypes.SAVE_CPG_PRODUCT_GROUP_CONFIG_FOR_QCGC_MAPPING_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export type CPGProductGroupConfigForQCGCActions =
  | LoadCPGProductGroupConfigForQCGCListing
  | LoadCPGProductGroupConfigForQCGCListingSuccess
  | LoadCPGProductGroupConfigForQCGCListingFailure
  | SearchCPGProductGroupConfigForQCGCListing
  | SearchCPGProductGroupConfigForQCGCListingSuccess
  | SearchCPGProductGroupConfigForQCGCListingFailure
  | LoadCPGProductGroupConfigForQCGCDetails
  | LoadCPGProductGroupConfigForQCGCDetailsSuccess
  | LoadCPGProductGroupConfigForQCGCDetailsFailure
  | SaveCPGProductGroupConfigForQCGCDetails
  | SaveCPGProductGroupConfigForQCGCDetailsSuccess
  | SaveCPGProductGroupConfigForQCGCDetailsFailure
  | EditCPGProductGroupConfigForQCGCDetails
  | EditCPGProductGroupConfigForQCGCDetailsSuccess
  | EditCPGProductGroupConfigForQCGCDetailsFailure
  | LoadCPGProductGroupConfigForQCGCMapping
  | LoadCPGProductGroupConfigForQCGCMappingSuccess
  | LoadCPGProductGroupConfigForQCGCMappingFailure
  | SaveCPGProductGroupConfigForQCGCMapping
  | SaveCPGProductGroupConfigForQCGCMappingSuccess
  | SaveCPGProductGroupConfigForQCGCMappingFailure;
