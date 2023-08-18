import { Action } from '@ngrx/store';
import {
  CustomErrors,
  LoadProductGroupPayload,
  LoadProductGroupsPayload,
  MappedLocDetails,
  ProductCategory,
  ProductGroup,
  ProductGroupMappingOption,
  RivaahConfigurationResponse, 
  RivaahEligibilityConfigRequest, 
  RivaahEligibilityConfigResponse, 
  RivaahLocationListPayload, 
  RivaahLocationSuccessList, 
  SaveProductGroup, 
  SaveProductGroups, 
  SaveRivaahLocationsPayload
} from '@poss-web/shared/models';

export enum RivaahConfigurationActionTypes {
  LOAD_COUPON_CONFIGURATION = '[Rivaah Coupon Configuration] Load Rivaah Coupon Configuration Details',
  LOAD_COUPON_CONFIGURATION_SUCCESSS = '[Rivaah Coupon Configuration] Load Rivaah Coupon Configuration Details Success',
  LOAD_COUPON_CONFIGURATION_FAILURE = '[Rivaah Coupon Configuration] Load Rivaah Coupon Configuration Details Failure',

  UPDATE_COUPON_CONFIGURATION = '[Rivaah Configuration]  Update Rivaah Coupon Configuration',
  UPDATE_COUPON_CONFIGURATION_SUCCESS = '[Rivaah Configuration] Update Rivaah Coupon Configuration Success',
  UPDATE_COUPON_CONFIGURATION_FAILURE = '[Rivaah Configuration] Update Rivaah Coupon Configuration Failure',

  LOAD_RIVAAH_ELIGIBILITY_CONFIGURATION = '[Rivaah Coupon Configuration] Load Rivaah Eligibility Configuration Details',
  LOAD_RIVAAH_ELIGIBILITY_CONFIGURATION_SUCCESSS = '[Rivaah Coupon Configuration] Load Rivaah Eligibility Configuration Details Success',
  LOAD_RIVAAH_ELIGIBILITY_CONFIGURATION_FAILURE = '[Rivaah Coupon Configuration] Load Rivaah Eligibility Configuration Details Failure',

  CREATE_RIVAAH_ELIGIBILITY_CONFIGURATION = '[Rivaah Configuration]  Create Rivaah Eligibility Configuration',
  CREATE_RIVAAH_ELIGIBILITY_CONFIGURATION_SUCCESS = '[Rivaah Configuration] Create Rivaah Eligibility Configuration Success',
  CREATE_RIVAAH_ELIGIBILITY_CONFIGURATION_FAILURE = '[Rivaah Configuration] Create Rivaah Eligibility Configuration Failure',

  UPDATE_RIVAAH_ELIGIBILITY_CONFIGURATION = '[Rivaah Configuration]  Update Rivaah Eligibility Configuration',
  UPDATE_RIVAAH_ELIGIBILITY_CONFIGURATION_SUCCESS = '[Rivaah Configuration] Update Rivaah Eligibility Configuration Success',
  UPDATE_RIVAAH_ELIGIBILITY_CONFIGURATION_FAILURE = '[Rivaah Configuration] Update Rivaah Eligibility Configuration Failure',

  DELETE_RIVAAH_ELIGIBILITY_CONFIGURATION = '[Rivaah Configuration]  Delete Rivaah Eligibility Configuration',
  DELETE_RIVAAH_ELIGIBILITY_CONFIGURATION_SUCCESS = '[Rivaah Configuration] Delete Rivaah Eligibility Configuration Success',
  DELETE_RIVAAH_ELIGIBILITY_CONFIGURATION_FAILURE = '[Rivaah Configuration] Delete Rivaah Eligibility Configuration Failure',

  TOGGLE_RIVAAH_ELIGIBILITY_CONFIGURATION_STATUS = '[Rivaah Configuration]  Toggle Rivaah Eligibility Configuration Status',
  TOGGLE_RIVAAH_ELIGIBILITY_CONFIGURATION_STATUS_SUCCESS = '[Rivaah Configuration] Toggle Rivaah Eligibility Configuration Status Success',
  TOGGLE_RIVAAH_ELIGIBILITY_CONFIGURATION_STATUS_FAILURE = '[Rivaah Configuration] Toggle Rivaah Eligibility Configuration Status Failure',

  LOAD_RESET = '[Rivaah Configuration] Load Reset',

  LOAD_MAPPED_PRODUCT_GROUPS_BY_PRODUCT_ID = '[Rivaah Configuration] Load Mapped Product group By Product category Id',
  LOAD_MAPPED_PRODUCT_GROUPS_BY_PRODUCT_ID_SUCCESS = '[Rivaah Configuration] Load Mapped Product group Mapping By Product category Id  Success',
  LOAD_MAPPED_PRODUCT_GROUPS_BY_PRODUCT_ID_FAILURE = '[Rivaah Configuration] Load Mapped Product group By Product category Id Failure',

  UPDATE_PRODUCT_GROUPS_BY_PRODUCT_ID = '[Rivaah Configuration] Update Product Groups By Product category Id',
  UPDATE_PRODUCT_GROUPS_BY_PRODUCT_ID_SUCCESS = '[Rivaah Configuration] Update Product Groups  By Product category Id  Success',
  UPDATE_PRODUCT_GROUPS_BY_PRODUCT_ID_FAILURE = '[Rivaah Configuration] Update Product Groups By Product category Id Failure',

  LOAD_PRODUCT_CATEGORY = '[Rivaah Configuration]  Load Product Category',
  LOAD_PRODUCT_CATEGORY_SUCCESS = '[Rivaah Configuration]  Load Product Category Success',
  LOAD_PRODUCT_CATEGORY_FAILURE = '[Rivaah Configuration]  Load Product Category Failure',

  LOAD_MAPPED_PRODUCT_CATEGORY = '[Rivaah Configuration]  Mapped Product Category',
  LOAD_MAPPED_PRODUCT_CATEGORY_SUCCESS = '[Rivaah Configuration]  Mapped Product Category Success',
  LOAD_MAPPED_PRODUCT_CATEGORY_FAILURE = '[Rivaah Configuration]  Mapped Product Category Failure',

  LOAD_RIVAAH_MAPPED_LOCATION_LIST = '[Rivaah Configuration] Load Mapped Location List',
  LOAD_RIVAAH_MAPPED_LOCATION_LIST_SUCCESS = '[Rivaah Configuration] Load Mapped Location List Success',
  LOAD_RIVAAH_MAPPED_LOCATION_LIST_FAILURE = '[Rivaah Configuration] Load Mapped Location List Failure',

  SAVE_RIVAAH_LOCATIONS = '[Rivaah Configuration] Rivaah Save Locations',
  SAVE_RIVAAH_LOCATIONS_SUCCESS = '[Rivaah Configuration] Rivaah Save Locations Success',
  SAVE_RIVAAH_LOCATIONS_FAILURE = '[Rivaah Configuration] Rivaah Save Locations Failure',

  UPDATE_RIVAAH_LOCATIONS = '[Rivaah Configuration] Rivaah Locations Updated',
  UPDATE_RIVAAH_LOCATIONS_SUCCESS = '[Rivaah Configuration] Rivaah Locations Updated Success',
  UPDATE_RIVAAH_LOCATIONS_FAILURE = '[Rivaah Configuration] Rivaah Locations Updated Failure',

  DELETE_RIVAAH_LOCATIONS = '[Rivaah Configuration] Rivaah Locations Deleted',
  DELETE_RIVAAH_LOCATIONS_SUCCESS = '[Rivaah Configuration] Rivaah Locations Deleted Success',
  DELETE_RIVAAH_LOCATIONS_FAILURE = '[Rivaah Configuration] Rivaah Locations Deleted Failure',

  GET_MAPPED_LOCATIONS = '[Rivaah Configuration] Get Mapped Locations',
  GET_MAPPED_LOCATIONS_SUCCESS = '[Rivaah Configuration] Get Mapped Locations Success',
  GET_MAPPED_LOCATIONS_FAILURE = '[Rivaah Configuration] Get Mapped Locations Failure',
}

export class LoadCouponConfiguration implements Action {
  readonly type = RivaahConfigurationActionTypes.LOAD_COUPON_CONFIGURATION;
  constructor(public payload: { configId: string; ruleType: string }) {}
}
export class LoadCouponConfigurationSuccess implements Action {
  readonly type =
    RivaahConfigurationActionTypes.LOAD_COUPON_CONFIGURATION_SUCCESSS;
  constructor(public payload: RivaahConfigurationResponse) {}
}
export class LoadCouponConfigurationFailure implements Action {
  readonly type =
    RivaahConfigurationActionTypes.LOAD_COUPON_CONFIGURATION_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class UpdateCouponConfiguration implements Action {
  readonly type = RivaahConfigurationActionTypes.UPDATE_COUPON_CONFIGURATION;
  constructor(public payload: RivaahConfigurationResponse) {}
}
export class UpdateCouponConfigurationSuccess implements Action {
  readonly type =
    RivaahConfigurationActionTypes.UPDATE_COUPON_CONFIGURATION_SUCCESS;
  constructor(public payload: RivaahConfigurationResponse) {}
}
export class UpdateCouponConfigurationFailure implements Action {
  readonly type =
    RivaahConfigurationActionTypes.UPDATE_COUPON_CONFIGURATION_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadRivaahEligibilityConfiguration implements Action {
  readonly type =
    RivaahConfigurationActionTypes.LOAD_RIVAAH_ELIGIBILITY_CONFIGURATION;
  constructor(
    public payload: {
      configId: string;
      ruleType: string;
      productCategoryCode?: string;
      productGroupCode?: string;
      pageIndex?: number;
      pageSize?: number;
    }
  ) {}
}
export class LoadRivaahEligibilityConfigurationSuccess implements Action {
  readonly type =
    RivaahConfigurationActionTypes.LOAD_RIVAAH_ELIGIBILITY_CONFIGURATION_SUCCESSS;
  constructor(public payload: RivaahEligibilityConfigResponse) {}
}
export class LoadRivaahEligibilityConfigurationFailure implements Action {
  readonly type =
    RivaahConfigurationActionTypes.LOAD_RIVAAH_ELIGIBILITY_CONFIGURATION_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class CreateRivaahEligibilityConfiguration implements Action {
  readonly type =
    RivaahConfigurationActionTypes.CREATE_RIVAAH_ELIGIBILITY_CONFIGURATION;
  constructor(public payload: RivaahEligibilityConfigRequest) {}
}
export class CreateRivaahEligibilityConfigurationSuccess implements Action {
  readonly type =
    RivaahConfigurationActionTypes.CREATE_RIVAAH_ELIGIBILITY_CONFIGURATION_SUCCESS;
}
export class CreateRivaahEligibilityConfigurationFailure implements Action {
  readonly type =
    RivaahConfigurationActionTypes.CREATE_RIVAAH_ELIGIBILITY_CONFIGURATION_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class UpdateRivaahEligibilityConfiguration implements Action {
  readonly type =
    RivaahConfigurationActionTypes.UPDATE_RIVAAH_ELIGIBILITY_CONFIGURATION;
  constructor(public payload: RivaahEligibilityConfigRequest) {}
}
export class UpdateRivaahEligibilityConfigurationSuccess implements Action {
  readonly type =
    RivaahConfigurationActionTypes.UPDATE_RIVAAH_ELIGIBILITY_CONFIGURATION_SUCCESS;
}
export class UpdateRivaahEligibilityConfigurationFailure implements Action {
  readonly type =
    RivaahConfigurationActionTypes.UPDATE_RIVAAH_ELIGIBILITY_CONFIGURATION_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class DeleteRivaahEligibilityConfiguration implements Action {
  readonly type =
    RivaahConfigurationActionTypes.DELETE_RIVAAH_ELIGIBILITY_CONFIGURATION;
  constructor(public payload: RivaahEligibilityConfigRequest) {}
}
export class DeleteRivaahEligibilityConfigurationSuccess implements Action {
  readonly type =
    RivaahConfigurationActionTypes.DELETE_RIVAAH_ELIGIBILITY_CONFIGURATION_SUCCESS;
}
export class DeleteRivaahEligibilityConfigurationFailure implements Action {
  readonly type =
    RivaahConfigurationActionTypes.DELETE_RIVAAH_ELIGIBILITY_CONFIGURATION_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class ToggleRivaahEligibilityConfigurationStatus implements Action {
  readonly type =
    RivaahConfigurationActionTypes.TOGGLE_RIVAAH_ELIGIBILITY_CONFIGURATION_STATUS;
  constructor(public payload: RivaahEligibilityConfigRequest) {}
}
export class ToggleRivaahEligibilityConfigurationStatusSuccess implements Action {
  readonly type =
    RivaahConfigurationActionTypes.TOGGLE_RIVAAH_ELIGIBILITY_CONFIGURATION_STATUS_SUCCESS;
}
export class ToggleRivaahEligibilityConfigurationStatusFailure implements Action {
  readonly type =
    RivaahConfigurationActionTypes.TOGGLE_RIVAAH_ELIGIBILITY_CONFIGURATION_STATUS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadReset {
  readonly type = RivaahConfigurationActionTypes.LOAD_RESET;
}

export class LoadMappedProductGroupsByProductId implements Action {
  readonly type = RivaahConfigurationActionTypes.LOAD_MAPPED_PRODUCT_GROUPS_BY_PRODUCT_ID;
  constructor(public payload: LoadProductGroupsPayload) {}
}
export class LoadMappedProductGroupsByProductIdSuccess implements Action {
  readonly type =
  RivaahConfigurationActionTypes.LOAD_MAPPED_PRODUCT_GROUPS_BY_PRODUCT_ID_SUCCESS;
  constructor(public payload: ProductGroupMappingOption[]) {}
}
export class LoadMappedProductGroupsByProductIdFailure implements Action {
  readonly type =
  RivaahConfigurationActionTypes.LOAD_MAPPED_PRODUCT_GROUPS_BY_PRODUCT_ID_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class UpdateProductGroupByProductId implements Action {
  readonly type =
    RivaahConfigurationActionTypes.UPDATE_PRODUCT_GROUPS_BY_PRODUCT_ID;
  constructor(public payload: SaveProductGroups) {}
}
export class UpdateProductGroupByProductIdSuccess implements Action {
  readonly type =
    RivaahConfigurationActionTypes.UPDATE_PRODUCT_GROUPS_BY_PRODUCT_ID_SUCCESS;
  constructor(public payload: ProductGroupMappingOption[]) {}
}
export class UpdateProductGroupByProductIdFailure implements Action {
  readonly type =
    RivaahConfigurationActionTypes.UPDATE_PRODUCT_GROUPS_BY_PRODUCT_ID_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class LoadProductCategory implements Action {
  readonly type = RivaahConfigurationActionTypes.LOAD_PRODUCT_CATEGORY;
}
export class LoadProductCategorySuccess implements Action {
  readonly type =
  RivaahConfigurationActionTypes.LOAD_PRODUCT_CATEGORY_SUCCESS
  constructor(public payload: ProductCategory[]) {}
}
export class LoadProductCategoryFailure implements Action {
  readonly type =
  RivaahConfigurationActionTypes.LOAD_PRODUCT_CATEGORY_FAILURE
  constructor(public payload: CustomErrors) {}
}
export class LoadMappedProductCategory implements Action {
  readonly type = RivaahConfigurationActionTypes.LOAD_MAPPED_PRODUCT_CATEGORY;
  constructor(
    public payload: {
      ruleId: string;
      ruleType: string;
    }
  ) {}
}
export class LoadMappedProductCategorySuccess implements Action {
  readonly type =
  RivaahConfigurationActionTypes.LOAD_MAPPED_PRODUCT_CATEGORY_SUCCESS
  constructor(public payload: ProductCategory[]) {}
}
export class LoadMappedProductCategoryFailure implements Action {
  readonly type =
  RivaahConfigurationActionTypes.LOAD_MAPPED_PRODUCT_CATEGORY_FAILURE
  constructor(public payload: CustomErrors) {}
}
export class LoadRivaahMappedLocationList implements Action {
  readonly type = RivaahConfigurationActionTypes.LOAD_RIVAAH_MAPPED_LOCATION_LIST;
  constructor(public payload: RivaahLocationListPayload) {}
}
export class LoadRivaahMappedLocationListSuccess implements Action {
  readonly type =
  RivaahConfigurationActionTypes.LOAD_RIVAAH_MAPPED_LOCATION_LIST_SUCCESS;
  constructor(public payload: RivaahLocationSuccessList) {}
}
export class LoadRivaahMappedLocationListFailure implements Action {
  readonly type =
  RivaahConfigurationActionTypes.LOAD_RIVAAH_MAPPED_LOCATION_LIST_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class SaveRivaahLocations implements Action {
  readonly type = RivaahConfigurationActionTypes.SAVE_RIVAAH_LOCATIONS;
  constructor(public payload: SaveRivaahLocationsPayload) {}
}
export class SaveRivaahLocationsSuccess implements Action {
  readonly type = RivaahConfigurationActionTypes.SAVE_RIVAAH_LOCATIONS_SUCCESS;
  // constructor(public payload: DiscountLocationList) {}
}
export class SaveRivaahLocationsFailure implements Action {
  readonly type = RivaahConfigurationActionTypes.SAVE_RIVAAH_LOCATIONS_FAILURE;
  constructor(public payload: CustomErrors) {}
}export class UpdateRivaahLocations implements Action {
  readonly type = RivaahConfigurationActionTypes.UPDATE_RIVAAH_LOCATIONS;
  constructor(public payload: SaveRivaahLocationsPayload) {}
}
export class UpdateRivaahLocationsSuccess implements Action {
  readonly type = RivaahConfigurationActionTypes.UPDATE_RIVAAH_LOCATIONS_SUCCESS;
  // constructor(public payload: DiscountLocationList) {}
}
export class UpdateRivaahLocationsFailure implements Action {
  readonly type = RivaahConfigurationActionTypes.UPDATE_RIVAAH_LOCATIONS_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class DeleteRivaahLocations implements Action {
  readonly type = RivaahConfigurationActionTypes.DELETE_RIVAAH_LOCATIONS;
  constructor(public payload: SaveRivaahLocationsPayload) {}
}
export class DeleteRivaahLocationsSuccess implements Action {
  readonly type = RivaahConfigurationActionTypes.DELETE_RIVAAH_LOCATIONS_SUCCESS;
  // constructor(public payload: DiscountLocationList) {}
}
export class DeleteRivaahLocationsFailure implements Action {
  readonly type = RivaahConfigurationActionTypes.DELETE_RIVAAH_LOCATIONS_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class LoadSelectedLocations implements Action {
  readonly type = RivaahConfigurationActionTypes.GET_MAPPED_LOCATIONS;
  constructor(public payload: RivaahLocationListPayload) {}
}

export class LoadSelectedLocationsSuccess implements Action {
  readonly type = RivaahConfigurationActionTypes.GET_MAPPED_LOCATIONS_SUCCESS;
  constructor(public payload: MappedLocDetails[]) {}
}

export class LoadSelectedLocationsFailure implements Action {
  readonly type = RivaahConfigurationActionTypes.GET_MAPPED_LOCATIONS_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export type RivaahConfigurationAction =
  | LoadCouponConfiguration
  | LoadCouponConfigurationSuccess
  | LoadCouponConfigurationFailure
  | UpdateCouponConfiguration
  | UpdateCouponConfigurationSuccess
  | UpdateCouponConfigurationFailure
  | LoadRivaahEligibilityConfiguration
  | LoadRivaahEligibilityConfigurationSuccess
  | LoadRivaahEligibilityConfigurationFailure
  | CreateRivaahEligibilityConfiguration
  | CreateRivaahEligibilityConfigurationSuccess
  | CreateRivaahEligibilityConfigurationFailure
  | UpdateRivaahEligibilityConfiguration
  | UpdateRivaahEligibilityConfigurationSuccess
  | UpdateRivaahEligibilityConfigurationFailure
  | DeleteRivaahEligibilityConfiguration
  | DeleteRivaahEligibilityConfigurationSuccess
  | DeleteRivaahEligibilityConfigurationFailure
  | ToggleRivaahEligibilityConfigurationStatus
  | ToggleRivaahEligibilityConfigurationStatusSuccess
  | ToggleRivaahEligibilityConfigurationStatusFailure
  | LoadReset
  | LoadMappedProductGroupsByProductId
  | LoadMappedProductGroupsByProductIdSuccess
  | LoadMappedProductGroupsByProductIdFailure
  | LoadProductCategory
  | LoadProductCategorySuccess
  | LoadProductCategoryFailure
  | LoadMappedProductCategory
  | LoadMappedProductCategorySuccess
  | LoadMappedProductCategoryFailure
  | UpdateProductGroupByProductId
  | UpdateProductGroupByProductIdSuccess
  | UpdateProductGroupByProductIdFailure
  | LoadRivaahMappedLocationList
  | LoadRivaahMappedLocationListSuccess
  | LoadRivaahMappedLocationListFailure
  | SaveRivaahLocations
  | SaveRivaahLocationsSuccess
  | SaveRivaahLocationsFailure
  | UpdateRivaahLocations
  | UpdateRivaahLocationsSuccess
  | UpdateRivaahLocationsFailure
  | DeleteRivaahLocations
  | DeleteRivaahLocationsSuccess
  | DeleteRivaahLocationsFailure
  | LoadSelectedLocations
  | LoadSelectedLocationsSuccess
  | LoadSelectedLocationsFailure;
