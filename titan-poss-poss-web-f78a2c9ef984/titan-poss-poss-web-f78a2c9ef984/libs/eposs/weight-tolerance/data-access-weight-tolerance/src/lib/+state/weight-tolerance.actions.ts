import { Action } from '@ngrx/store';
import {
  CustomErrors,
  WeightToleranceResponse,
  UpdateWeightTolerancePayload,
  SaveWeightTolerancePayload,
  WeightToleranceList,
  WeightToleranceListPayload,
  ConfigDetails,
  ProductGroup,
  LoadWeightToleranceByConfigidPayload,
  WeightTolerance
} from '@poss-web/shared/models';

export enum WeightToleranceActionTypes {
  LOAD_CONFIG_LIST = '[Weight-tolerance-listing] Load Config List',
  LOAD_CONFIG_LIST_SUCCESS = '[Weight-tolerance-listing] Load Config List Success',
  LOAD_CONFIG_LIST_FAILURE = '[Weight-tolerance-listing] Load Config List Failure',

  LOAD_SELECTED_CONFIG_DETAILS = '[Weight-tolerance-details] Load Selected ConfigDetails',
  LOAD_SELECTED_CONFIG_DETAILS_SUCCESSS = '[Weight-tolerance-details] Load Selected Config Details Success',
  LOAD_SELECTED_CONFIG_DETAILS_FAILURE = '[Weight-tolerance-details] Load Selected Config Details Failure',

  SAVE_WEIGHT_TOLERANCE_DETAILS = '[Weight-tolerance-listing] Save Weight Tolerance Details',
  SAVE_WEIGHT_TOLERANCE_DETAILS_SUCCESS = '[Weight-tolerance-listing] Save Weight Tolerance Details Success',
  SAVE_WEIGHT_TOLERANCE_DETAILS_FAILURE = '[Weight-tolerance-listing] Save Weight Tolerance Details Failure',

  LOAD_WEIGHT_TOLERANCE_BY_CONFIG_ID = '[Weight-tolerance-details] Load Weight Tolerance By Config Id',
  LOAD_WEIGHT_TOLERANCE_BY_CONFIG_ID_SUCCESS = '[Weight-tolerance-details] Load Weight Tolerance By Config Id Success',
  LOAD_WEIGHT_TOLERANCE_BY_CONFIG_ID_FAILURE = '[Weight-tolerance-details] Load Weight Tolerance By Config Id Failure',

  UPADTE_WEIGHT_TOLERANCE = '[Weight-tolerance-details] Upadate Weight Tolerance',
  UPADTE_WEIGHT_TOLERANCE_SUCCESS = '[Weight-tolerance-details] Update Weight Tolerance Success',
  UPADTE_WEIGHT_TOLERANCE_FAILURE = '[Weight-tolerance-details] Update Weight Tolerance Failure',

  UPDATE_IS_ACTIVE = '[Weight-tolerance-list] Update Is Active',
  UPDATE_IS_ACTIVE_SUCCESS = '[Weight-tolerance-list] Update Is Active Success',
  UPDATE_IS_ACTIVE_FAILURE = '[Weight-tolerance-list]Update Is Active Failure',

  LOAD_RANGE_WEIGHT = '[Weight-tolerance-detail] Load Range Weight',
  LOAD_RANGE_WEIGHT_SUCCESS = '[Weight-tolerance-detail] Load Range Weight Success',
  LOAD_RANGE_WEIGHT_FAILURE = '[Weight-tolerance-detail] Load Range Weight Failre',

  REMOVE_WEIGHT_TOLERANCE = '[Weight-tolerance-details]  Remove Weight Tolerance  By id',
  REMOVE_WEIGHT_TOLERANCE_SUCCESS = '[Weight-tolerance-details]  Remove Weight Tolerance  By  id Success',
  REMOVE_WEIGHT_TOLERANCE_FAILURE = '[Weight-tolerance-details] Remove Weight Tolerance By  id Failure',

  LOAD_PRODUCT_GROUPS = '[Weight-tolerance-details]Load Product groups',
  LOAD_PRODUCT_GROUPS_SUCCESS = '[Weight-tolerance-details]Load Product groups Success',
  LOAD_PRODUCT_GROUPS_FAILURE = '[Weight-tolerance-details] Load Product groups Failure',

  SEARCH_CONFIG_DETAILS_BY_CONFIG_NAME = '[Weight-tolerance-list] Search Config Details By Config Name',
  SEARCH_CONFIG_DETAILS_BY_CONFIG_NAME_SUCCESS = '[Weight-tolerance-list] Search Config Details By Config Name Success',
  SEARCH_CONFIG_DETAILS_BY_CONFIG_NAME_FAILURE = '[Weight-tolerance-list] Search Config Details By Config Name Failure',

  LOAD_RESET = '[Weight-tolerance-list]Load Reset'
}

export class LoadProductGroupMapping implements Action {
  readonly type = WeightToleranceActionTypes.LOAD_PRODUCT_GROUPS;
}

export class LoadProductGroupMappingSuccess implements Action {
  readonly type = WeightToleranceActionTypes.LOAD_PRODUCT_GROUPS_SUCCESS;
  constructor(public payload: ProductGroup[]) {}
}

export class LoadProductGroupMappingFailure implements Action {
  readonly type = WeightToleranceActionTypes.LOAD_PRODUCT_GROUPS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class RemoveWeightTolerance implements Action {
  readonly type = WeightToleranceActionTypes.REMOVE_WEIGHT_TOLERANCE;
  constructor(public payload: UpdateWeightTolerancePayload) {}
}
export class RemoveWeightToleranceSuccess implements Action {
  readonly type = WeightToleranceActionTypes.REMOVE_WEIGHT_TOLERANCE_SUCCESS;
  constructor(public payload: WeightToleranceResponse) {}
}
export class RemoveWeightToleranceFailure implements Action {
  readonly type = WeightToleranceActionTypes.REMOVE_WEIGHT_TOLERANCE_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class UpdateIsActive implements Action {
  readonly type = WeightToleranceActionTypes.UPDATE_IS_ACTIVE;
  constructor(public payload: UpdateWeightTolerancePayload) {}
}

export class UpdateIsActiveSuccess implements Action {
  readonly type = WeightToleranceActionTypes.UPDATE_IS_ACTIVE_SUCCESS;
  constructor(public payload: any) {}
}

export class UpdateIsActiveFailure implements Action {
  readonly type = WeightToleranceActionTypes.UPDATE_IS_ACTIVE_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadConfigList implements Action {
  readonly type = WeightToleranceActionTypes.LOAD_CONFIG_LIST;
  constructor(public payload: WeightToleranceListPayload) {}
}

export class LoadConfigListSuccess implements Action {
  readonly type = WeightToleranceActionTypes.LOAD_CONFIG_LIST_SUCCESS;
  constructor(public payload: WeightToleranceList) {}
}
export class LoadConfigListFailure implements Action {
  readonly type = WeightToleranceActionTypes.LOAD_CONFIG_LIST_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadSelectedConfigDetails implements Action {
  readonly type = WeightToleranceActionTypes.LOAD_SELECTED_CONFIG_DETAILS;
  constructor(public payload: string) {}
}

export class LoadSelectedConfigDetailsSuccess implements Action {
  readonly type =
    WeightToleranceActionTypes.LOAD_SELECTED_CONFIG_DETAILS_SUCCESSS;
  constructor(public payload: ConfigDetails) {}
}
export class LoadSelectedConfigDetailsFailure implements Action {
  readonly type =
    WeightToleranceActionTypes.LOAD_SELECTED_CONFIG_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SaveWeightTolerance implements Action {
  readonly type = WeightToleranceActionTypes.SAVE_WEIGHT_TOLERANCE_DETAILS;
  constructor(public payload: SaveWeightTolerancePayload) {}
}

export class SaveWeightToleranceSuccess implements Action {
  readonly type =
    WeightToleranceActionTypes.SAVE_WEIGHT_TOLERANCE_DETAILS_SUCCESS;
  constructor(public payload: string) {}
}
export class SaveWeightToleranceFailure implements Action {
  readonly type =
    WeightToleranceActionTypes.SAVE_WEIGHT_TOLERANCE_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadWeightToleranceByConfigid implements Action {
  readonly type = WeightToleranceActionTypes.LOAD_WEIGHT_TOLERANCE_BY_CONFIG_ID;
  constructor(public payload: LoadWeightToleranceByConfigidPayload) {}
}

export class LoadWeightToleranceByConfigidSuccess implements Action {
  readonly type =
    WeightToleranceActionTypes.LOAD_WEIGHT_TOLERANCE_BY_CONFIG_ID_SUCCESS;
  constructor(public payload: WeightToleranceResponse) {}
}
export class LoadWeightToleranceByConfigidFailure implements Action {
  readonly type =
    WeightToleranceActionTypes.LOAD_WEIGHT_TOLERANCE_BY_CONFIG_ID_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class UpdateWeightTolerance implements Action {
  readonly type = WeightToleranceActionTypes.UPADTE_WEIGHT_TOLERANCE;
  constructor(public payload: UpdateWeightTolerancePayload) {}
}

export class UpdateWeightToleranceSuccess implements Action {
  readonly type = WeightToleranceActionTypes.UPADTE_WEIGHT_TOLERANCE_SUCCESS;
  constructor(public payload: WeightToleranceResponse) {}
}
export class UpdateWeightToleranceFailure implements Action {
  readonly type = WeightToleranceActionTypes.UPADTE_WEIGHT_TOLERANCE_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadRangeWeight implements Action {
  readonly type = WeightToleranceActionTypes.LOAD_RANGE_WEIGHT;
}

export class LoadRangeWeightSuccesss implements Action {
  readonly type = WeightToleranceActionTypes.LOAD_RANGE_WEIGHT_SUCCESS;
  constructor(public payload: any) {}
}
export class LoadRangeWeightFailure implements Action {
  readonly type = WeightToleranceActionTypes.LOAD_RANGE_WEIGHT_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SearchConfigDetailsByConfigName implements Action {
  readonly type =
    WeightToleranceActionTypes.SEARCH_CONFIG_DETAILS_BY_CONFIG_NAME;
  constructor(public payload: string) {}
}

export class SearchConfigDetailsByConfigNameSuccess implements Action {
  readonly type =
    WeightToleranceActionTypes.SEARCH_CONFIG_DETAILS_BY_CONFIG_NAME_SUCCESS;
  constructor(public payload: WeightToleranceList) {}
}

export class SearchConfigDetailsByConfigNameFailure implements Action {
  readonly type =
    WeightToleranceActionTypes.SEARCH_CONFIG_DETAILS_BY_CONFIG_NAME_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadReset implements Action {
  readonly type = WeightToleranceActionTypes.LOAD_RESET;
}

export type WeightToleranceActions =
  | UpdateIsActiveSuccess
  | UpdateIsActiveFailure
  | UpdateIsActive
  | LoadConfigList
  | LoadConfigListSuccess
  | LoadConfigListFailure
  | LoadSelectedConfigDetails
  | LoadSelectedConfigDetailsSuccess
  | LoadSelectedConfigDetailsFailure
  | SaveWeightTolerance
  | SaveWeightToleranceSuccess
  | SaveWeightToleranceFailure
  | LoadWeightToleranceByConfigid
  | LoadWeightToleranceByConfigidSuccess
  | LoadWeightToleranceByConfigidFailure
  | UpdateWeightTolerance
  | UpdateWeightToleranceSuccess
  | UpdateWeightToleranceFailure
  | LoadRangeWeight
  | LoadRangeWeightSuccesss
  | LoadRangeWeightFailure
  | SearchConfigDetailsByConfigName
  | SearchConfigDetailsByConfigNameSuccess
  | SearchConfigDetailsByConfigNameFailure
  | LoadReset
  | RemoveWeightTolerance
  | RemoveWeightToleranceSuccess
  | RemoveWeightToleranceFailure
  | LoadProductGroupMapping
  | LoadProductGroupMappingSuccess
  | LoadProductGroupMappingFailure;
