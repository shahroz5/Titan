import { Action } from '@ngrx/store';
import {
  CustomErrors,
  LocationPriceGroupMapping,
  LocationPriceGroupMappingList,
  LocationSummaryList,
  Lov,
  PriceGroupListing,
} from '@poss-web/shared/models';

export enum PriceGroupMappingActionTypes {
  LOAD_LOCATION_LIST = '[price-group-mapping] Load Location List',
  LOAD_LOCATION_LIST_SUCCESS = '[price-group-mapping] Load Location List Success',
  LOAD_LOCATION_LIST_FAILURE = '[price-group-mapping] Load Location List Failure',

  LOAD_PRICE_GROUP_TYPE_LIST = '[price-group-mapping] Load Price Group Type List',
  LOAD_PRICE_GROUP_TYPE_LIST_SUCCESS = '[price-group-mapping] Load Price Group Type List Success',
  LOAD_PRICE_GROUP_TYPE_LIST_FAILURE = '[price-group-mapping] Load Price Group Type List Failure',

  LOAD_PRICE_GROUP_LIST = '[price-group-mapping] Load Price Group List',
  LOAD_PRICE_GROUP_LIST_SUCCESS = '[price-group-mapping] Load Price Group List Success',
  LOAD_PRICE_GROUP_LIST_FAILURE = '[price-group-mapping] Load Price Group List Failure',

  LOAD_LOCATION_PRICE_GROUP_MAPPING_LIST = '[price-group-mapping] Load Location Price Group Mapping List',
  LOAD_LOCATION_PRICE_GROUP_MAPPING_LIST_SUCCESS = '[price-group-mapping] Load Location Price Group Mapping List Success',
  LOAD_LOCATION_PRICE_GROUP_MAPPING_LIST_FAILURE = '[price-group-mapping] Load Location Price Group Mapping List Failure',

  SAVE_PRICE_GROUP_MAPPING = '[price-group-mapping] Save price group mapping',
  SAVE_PRICE_GROUP_MAPPING_SUCCESS = '[price-group-mapping] Save price group mapping Success',
  SAVE_PRICE_GROUP_MAPPING_FAILURE = '[price-group-mapping] Save price group mapping Failure',

  RESET_PRICE_GROUP_MAPPING = '[price-group-mapping] Reset price group mapping'
}
export class LoadLocationList implements Action {
  readonly type = PriceGroupMappingActionTypes.LOAD_LOCATION_LIST;

}
export class LoadLocationListSuccess implements Action {
  readonly type = PriceGroupMappingActionTypes.LOAD_LOCATION_LIST_SUCCESS;
  constructor(public payload: LocationSummaryList[]) {}
}
export class LoadLocationListFailure implements Action {
  readonly type = PriceGroupMappingActionTypes.LOAD_LOCATION_LIST_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadPriceGroupTypeList implements Action {
  readonly type = PriceGroupMappingActionTypes.LOAD_PRICE_GROUP_TYPE_LIST;
}
export class LoadPriceGroupTypeListSuccess implements Action {
  readonly type =
    PriceGroupMappingActionTypes.LOAD_PRICE_GROUP_TYPE_LIST_SUCCESS;
  constructor(public payload: Lov[]) {}
}
export class LoadPriceGroupTypeListFailure implements Action {
  readonly type =
    PriceGroupMappingActionTypes.LOAD_PRICE_GROUP_TYPE_LIST_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadPriceGroupList implements Action {
  readonly type = PriceGroupMappingActionTypes.LOAD_PRICE_GROUP_LIST;
}
export class LoadPriceGroupListSuccess implements Action {
  readonly type = PriceGroupMappingActionTypes.LOAD_PRICE_GROUP_LIST_SUCCESS;
  constructor(public payload: PriceGroupListing) {}
}
export class LoadPriceGroupListFailure implements Action {
  readonly type = PriceGroupMappingActionTypes.LOAD_PRICE_GROUP_LIST_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadLocationPriceGroupMappingList implements Action {
  readonly type =
    PriceGroupMappingActionTypes.LOAD_LOCATION_PRICE_GROUP_MAPPING_LIST;
  constructor(public payload: string) {}
}
export class LoadLocationPriceGroupMappingListSuccess implements Action {
  readonly type =
    PriceGroupMappingActionTypes.LOAD_LOCATION_PRICE_GROUP_MAPPING_LIST_SUCCESS;
  constructor(public payload: LocationPriceGroupMappingList[]) {}
}
export class LoadLocationPriceGroupMappingListFailure implements Action {
  readonly type =
    PriceGroupMappingActionTypes.LOAD_LOCATION_PRICE_GROUP_MAPPING_LIST_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SavePriceGroupMapping implements Action {
  readonly type = PriceGroupMappingActionTypes.SAVE_PRICE_GROUP_MAPPING;
  constructor(
    public payload: {
      locationCode: string;
      locationPriceGroupMapping: LocationPriceGroupMapping;
    }
  ) {}
}
export class SavePriceGroupMappingSuccess implements Action {
  readonly type = PriceGroupMappingActionTypes.SAVE_PRICE_GROUP_MAPPING_SUCCESS;
  constructor(public payload: LocationPriceGroupMappingList[]) {}
}
export class SavePriceGroupMappingFailure implements Action {
  readonly type = PriceGroupMappingActionTypes.SAVE_PRICE_GROUP_MAPPING_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class ResetPriceGroupMapping implements Action {
  readonly type = PriceGroupMappingActionTypes.RESET_PRICE_GROUP_MAPPING;
}

export type PriceGroupMappingActions =
  | LoadLocationList
  | LoadLocationListSuccess
  | LoadLocationListFailure
  | LoadPriceGroupList
  | LoadPriceGroupListSuccess
  | LoadPriceGroupListFailure
  | LoadPriceGroupTypeList
  | LoadPriceGroupTypeListSuccess
  | LoadPriceGroupTypeListFailure
  | LoadLocationPriceGroupMappingList
  | LoadLocationPriceGroupMappingListSuccess
  | LoadLocationPriceGroupMappingListFailure
  | SavePriceGroupMapping
  | SavePriceGroupMappingSuccess
  | SavePriceGroupMappingFailure
  | ResetPriceGroupMapping;
