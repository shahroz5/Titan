import { Action } from '@ngrx/store';

import {
  CustomErrors,
  PriceGroupListPayload,
  PriceGroupListing,
  PriceGroupMaster,
  UpdatePriceGroupMasterPayload,
  SavePriceGroupMasterPayload
} from '@poss-web/shared/models';
export enum PriceGroupMasterActionsTypes {
  LOAD_PRICE_GROUP_LISTING = '[Price-group-list] Load Price Group Listing',
  LOAD_PRICE_GROUP_LISTING_SUCCESS = '[Price-group-list] Load Price Group Listing Success',
  LOAD_PRICE_GROUP_LISTING_FAILURE = '[Price-group-list] Load Price Group Listing Failure',

  LOAD_PRICE_GROUP_BY_PRICE_GROUP_CODE = '[Price-group-list] Load Price Group By Price Group Code ',
  LOAD_PRICE_GROUP_BY_PRICE_GROUP_CODE_SUCCESS = '[Price-group-list] Load Price Group By Price Group Code  Success',
  LOAD_PRICE_GROUP_BY_PRICE_GROUP_CODE_FAILURE = '[Price-group-list] Load Price Group By Price Group Code  Failure',

  UPDATE_PRICE_GROUP_BY_PRICE_GROUP_CODE = '[Price-group-list] Update Price Group By Price Group Code',
  UPDATE_PRICE_GROUP_BY_PRICE_GROUP_CODE_SUCCESS = '[Price-group-list]  Update Price Group By Price Group Code Success',
  UPDATE_PRICE_GROUP_BY_PRICE_GROUP_CODE_FAILURE = '[Price-group-list]  Update Price Group By Price Group Code Failure',

  SAVE_PRICE_GROUP = '[Price-group-list] Save Price Group',
  SAVE_PRICE_GROUP_SUCCESS = '[Price-group-list] Save Price Group Success',
  SAVE_PRICE_GROUP_FAILURE = '[Price-group-list] Save Price Group Failure',

  SEARCH_PRICE_GROUP_LIST = '[Price-group-list] Search Price Group List',
  SEARCH_PRICE_GROUP_LIST_SUCCESS = '[Price-group-list] Search Price Group List Success',
  SEARCH_PRICE_GROUP_LIST_FAILURE = '[Price-group-list] Search Price Group Lisy Failure',


  LOAD_RESET = '[Price-Group-list] Load Reset'
}

export class LoadReset implements Action {
  readonly type = PriceGroupMasterActionsTypes.LOAD_RESET;
}

export class SearchPriceGroupList implements Action {
  readonly type = PriceGroupMasterActionsTypes.SEARCH_PRICE_GROUP_LIST;
  constructor(public payload: string) { }
}

export class SearchPriceGroupListSuccess implements Action {
  readonly type = PriceGroupMasterActionsTypes.SEARCH_PRICE_GROUP_LIST_SUCCESS;
  constructor(public payload: PriceGroupListing) { }
}

export class SearchPriceGroupListFailure implements Action {
  readonly type = PriceGroupMasterActionsTypes.SEARCH_PRICE_GROUP_LIST_FAILURE;
  constructor(public payload: CustomErrors) { }
}

export class LoadPriceGroupByPriceGroupCode implements Action {
  readonly type =
    PriceGroupMasterActionsTypes.LOAD_PRICE_GROUP_BY_PRICE_GROUP_CODE;
  constructor(public payload: string) { }
}

export class LoadPriceGroupByPriceGroupCodeSuccess implements Action {
  readonly type =
    PriceGroupMasterActionsTypes.LOAD_PRICE_GROUP_BY_PRICE_GROUP_CODE_SUCCESS;
  constructor(public payload: PriceGroupMaster) { }
}

export class LoadPriceGroupByPriceGroupCodeFailure implements Action {
  readonly type =
    PriceGroupMasterActionsTypes.LOAD_PRICE_GROUP_BY_PRICE_GROUP_CODE_FAILURE;
  constructor(public payload: CustomErrors) { }
}

export class UpdatePricGroupByPriceGroupCode implements Action {
  readonly type =
    PriceGroupMasterActionsTypes.UPDATE_PRICE_GROUP_BY_PRICE_GROUP_CODE;
  constructor(public payload: UpdatePriceGroupMasterPayload) { }
}

export class UpdatePricGroupByPriceGroupCodeSuccess implements Action {
  readonly type =
    PriceGroupMasterActionsTypes.UPDATE_PRICE_GROUP_BY_PRICE_GROUP_CODE_SUCCESS;
}

export class UpdatePricGroupByPriceGroupCodeFailure implements Action {
  readonly type =
    PriceGroupMasterActionsTypes.UPDATE_PRICE_GROUP_BY_PRICE_GROUP_CODE_FAILURE;
  constructor(public payload: CustomErrors) { }
}
export class SavePriceGroup implements Action {
  readonly type = PriceGroupMasterActionsTypes.SAVE_PRICE_GROUP;
  constructor(public payload: SavePriceGroupMasterPayload) { }
}

export class SavePriceGroupSuccess implements Action {
  readonly type = PriceGroupMasterActionsTypes.SAVE_PRICE_GROUP_SUCCESS;
}

export class SavePriceGroupFailure implements Action {
  readonly type = PriceGroupMasterActionsTypes.SAVE_PRICE_GROUP_FAILURE;
  constructor(public payload: CustomErrors) { }
}

export class LoadPriceGroup implements Action {
  readonly type = PriceGroupMasterActionsTypes.LOAD_PRICE_GROUP_LISTING;
  constructor(public payload: PriceGroupListPayload) { }
}

export class LoadPriceGroupSuccess implements Action {
  readonly type = PriceGroupMasterActionsTypes.LOAD_PRICE_GROUP_LISTING_SUCCESS;
  constructor(public payload: PriceGroupListing) { }
}

export class LoadPriceGroupFailure implements Action {
  readonly type = PriceGroupMasterActionsTypes.LOAD_PRICE_GROUP_LISTING_FAILURE;
  constructor(public payload: CustomErrors) { }
}

export type PriceGroupMasterActions =
  | LoadPriceGroup
  | LoadPriceGroupSuccess
  | LoadPriceGroupFailure
  | LoadPriceGroupByPriceGroupCode
  | LoadPriceGroupByPriceGroupCodeSuccess
  | LoadPriceGroupByPriceGroupCodeFailure
  | UpdatePricGroupByPriceGroupCode
  | UpdatePricGroupByPriceGroupCodeSuccess
  | UpdatePricGroupByPriceGroupCodeFailure
  | SavePriceGroup
  | SavePriceGroupFailure
  | SavePriceGroupSuccess
  | SearchPriceGroupList
  | SearchPriceGroupListSuccess
  | SearchPriceGroupListFailure
  | LoadReset;
