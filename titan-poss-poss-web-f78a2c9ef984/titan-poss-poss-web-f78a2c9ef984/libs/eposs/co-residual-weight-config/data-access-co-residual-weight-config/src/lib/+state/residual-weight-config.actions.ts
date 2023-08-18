import { Action } from '@ngrx/store';
import {
  CustomErrors,
  ResidualWeightConfigResponse,
  LoadResidualWeightConfigListingPayload,
  ResidualWeightRange,
  RangeMappingResponse,
  UpdateRangeMappingPayload,
  SaveResidualTolerancePayload,
  LoadResidualToleranceByConfigidPayload,
  ResidualWeightToleranceResponse
} from '@poss-web/shared/models';

export enum ResidualWeightConfigActionTypes {
  LOAD_RESIDUAL_WEIGHT_CONFIG_LIST = '[Residual Weight Config] Load Residual Weight Config List',
  LOAD_RESIDUAL_WEIGHT_CONFIG_LIST_SUCCESS = '[Residual Weight Config] Load Residual Weight Config List Success',
  LOAD_RESIDUAL_WEIGHT_CONFIG_LIST_FAILURE = '[Residual Weight Config]Load Residual Weight Config List Failure',

  SEARCH_RESIDUAL_WEIGHT_CONFIG_LIST = '[Residual Weight Config] Search Residual Weight Config List ',
  SEARCH_RESIDUAL_WEIGHT_CONFIG_LIST_SUCCESS = '[Residual Weight Config] Search Residual Weight Config List Success ',
  SEARCH_RESIDUAL_WEIGHT_CONFIG_LIST_FAILURE = '[Residual Weight Config] Search Residual Weight Config List Failure',

  UPADTE_RESIDUAL_WEIGHT_CONFIG_IS_ACTIVE = '[Residual Weight Config]  Update Residual Weight Config Is Active',
  UPADTE_RESIDUAL_WEIGHT_CONFIG_IS_ACTIVE_SUCCESS = '[Residual Weight Config] Update Residual Weight Config Is Active Success',
  UPADTE_RESIDUAL_WEIGHT_CONFIG_IS_ACTIVE_FAILURE = '[Residual Weight Config] Updated Residual Weight Config Is Active Failure',

  SAVE_RESIDUAL_WEIGHT_CONFIG = '[Residual Weight Config] Save Residual Weight Config',
  SAVE_RESIDUAL_WEIGHT_CONFIG_SUCCESS = '[Residual Weight Config] Save Residual Weight Config Success',
  SAVE_RESIDUAL_WEIGHT_CONFIG_FAILURE = '[Residual Weight Config] Save Residual Weight Config Failure',

  LOAD_SELECTED_CONFIG_DETAILS = '[Residual Weight Config] Load Selected Residual Weight Config Details',
  LOAD_SELECTED_CONFIG_DETAILS_SUCCESSS = '[Residual Weight Config] Load Selected Residual Weight Config Details Success',
  LOAD_SELECTED_CONFIG_DETAILS_FAILURE = '[Residual Weight Config] Load Selected Residual Weight Config Details Failure',

  LOAD_RANGE_MAPPING_BY_CONFIG_ID = '[Residual Weight Config] Load Range Mapping By Config Id',
  LOAD_RANGE_MAPPING_BY_CONFIG_ID_SUCCESS = '[Residual Weight Config] Load Range Mapping By Config Id Success',
  LOAD_RANGE_MAPPING_BY_CONFIG_ID_FAILURE = '[Residual Weight Config] Load Range Mapping By Config Id Failure',

  UPADTE_RANGE_MAPPING = '[Residual Weight Config] Upadate Range Mapping',
  UPADTE_RANGE_MAPPING_SUCCESS = '[Residual Weight Config] Update Range Mapping Success',
  UPADTE_RANGE_MAPPING_FAILURE = '[Residual Weight Config] Update Range Mapping Failure',

  LOAD_RESET = '[Residual Weight Config] Load Reset',

  LOAD_RESIDUAL_WEIGHT_RANGE_WEIGHT = '[Residual Weight Config] Load Residual Range Weight',
  LOAD_RESIDUAL_WEIGHT_RANGE_WEIGHT_SUCCESS = '[Residual Weight Config] Load Residual Range Weight Success',
  LOAD_RESIDUAL_WEIGHT_RANGE_WEIGHT_FAILURE = '[Residual Weight Config] Load Range Residual Weight Failure',

  REMOVE_RESIDUAL_WEIGHT_RANGE_WEIGHT = '[Residual Weight Config] Remove Residual Range Weight By Id',
  REMOVE_RESIDUAL_WEIGHT_RANGE_WEIGHT_SUCCESS = '[Residual Weight Config] Remove Residual Range Weight By Id Success',
  REMOVE_RESIDUAL_WEIGHT_RANGE_WEIGHT_FAILURE = '[Residual Weight Config] Remove Residual Range Weight By Id Failure'
}
export class LoadResidualWeightConfigList implements Action {
  readonly type =
    ResidualWeightConfigActionTypes.LOAD_RESIDUAL_WEIGHT_CONFIG_LIST;
  constructor(public payload: LoadResidualWeightConfigListingPayload) {}
}
export class LoadResidualWeightConfigListSuccess implements Action {
  readonly type =
    ResidualWeightConfigActionTypes.LOAD_RESIDUAL_WEIGHT_CONFIG_LIST_SUCCESS;
  constructor(
    public payload: {
      data: ResidualWeightConfigResponse[];
      totalElements: number;
    }
  ) {}
}
export class LoadResidualWeightConfigListFailure implements Action {
  readonly type =
    ResidualWeightConfigActionTypes.LOAD_RESIDUAL_WEIGHT_CONFIG_LIST_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class SearchResidualWeightConfigList implements Action {
  readonly type =
    ResidualWeightConfigActionTypes.SEARCH_RESIDUAL_WEIGHT_CONFIG_LIST;
  constructor(public payload: string) {}
}
export class SearchResidualWeightConfigListSuccess implements Action {
  readonly type =
    ResidualWeightConfigActionTypes.SEARCH_RESIDUAL_WEIGHT_CONFIG_LIST_SUCCESS;
  constructor(
    public payload: {
      data: ResidualWeightConfigResponse[];
      totalElements: number;
    }
  ) {}
}
export class SearchResidualWeightConfigListFailure implements Action {
  readonly type =
    ResidualWeightConfigActionTypes.SEARCH_RESIDUAL_WEIGHT_CONFIG_LIST_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SaveResidualWeightConfig implements Action {
  readonly type = ResidualWeightConfigActionTypes.SAVE_RESIDUAL_WEIGHT_CONFIG;
  constructor(public payload: SaveResidualTolerancePayload) {}
}
export class SaveResidualWeightConfigSuccess implements Action {
  readonly type =
    ResidualWeightConfigActionTypes.SAVE_RESIDUAL_WEIGHT_CONFIG_SUCCESS;
  constructor(public payload: ResidualWeightConfigResponse) {}
}
export class SaveResidualWeightConfigFailure implements Action {
  readonly type =
    ResidualWeightConfigActionTypes.SAVE_RESIDUAL_WEIGHT_CONFIG_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class UpdateResidualWeightConfigIsActive implements Action {
  readonly type =
    ResidualWeightConfigActionTypes.UPADTE_RESIDUAL_WEIGHT_CONFIG_IS_ACTIVE;
  constructor(public payload: ResidualWeightConfigResponse) {}
}
export class UpdateResidualWeightConfigIsActiveSuccess implements Action {
  readonly type =
    ResidualWeightConfigActionTypes.UPADTE_RESIDUAL_WEIGHT_CONFIG_IS_ACTIVE_SUCCESS;
  constructor(public payload: ResidualWeightConfigResponse) {}
}
export class UpdateResidualWeightConfigIsActiveFailure implements Action {
  readonly type =
    ResidualWeightConfigActionTypes.UPADTE_RESIDUAL_WEIGHT_CONFIG_IS_ACTIVE_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadReset implements Action {
  readonly type = ResidualWeightConfigActionTypes.LOAD_RESET;
}

export class LoadResidualRangeWeight implements Action {
  readonly type =
    ResidualWeightConfigActionTypes.LOAD_RESIDUAL_WEIGHT_RANGE_WEIGHT;
}

export class LoadResidualRangeWeightSuccesss implements Action {
  readonly type =
    ResidualWeightConfigActionTypes.LOAD_RESIDUAL_WEIGHT_RANGE_WEIGHT_SUCCESS;
  constructor(public payload: ResidualWeightRange[]) {}
}
export class LoadResidualRangeWeightFailure implements Action {
  readonly type =
    ResidualWeightConfigActionTypes.LOAD_RESIDUAL_WEIGHT_RANGE_WEIGHT_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadSelectedConfigDetails implements Action {
  readonly type = ResidualWeightConfigActionTypes.LOAD_SELECTED_CONFIG_DETAILS;
  constructor(public payload: string) {}
}
export class LoadSelectedConfigDetailsSuccess implements Action {
  readonly type =
    ResidualWeightConfigActionTypes.LOAD_SELECTED_CONFIG_DETAILS_SUCCESSS;
  constructor(public payload: ResidualWeightConfigResponse) {}
}
export class LoadSelectedConfigDetailsFailure implements Action {
  readonly type =
    ResidualWeightConfigActionTypes.LOAD_SELECTED_CONFIG_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadRangeMappingByConfigid implements Action {
  readonly type =
    ResidualWeightConfigActionTypes.LOAD_RANGE_MAPPING_BY_CONFIG_ID;
  constructor(public payload: LoadResidualToleranceByConfigidPayload) {}
}

export class LoadRangeMappingByConfigidSuccess implements Action {
  readonly type =
    ResidualWeightConfigActionTypes.LOAD_RANGE_MAPPING_BY_CONFIG_ID_SUCCESS;
  constructor(public payload: ResidualWeightToleranceResponse) {}
}
export class LoadRangeMappingByConfigidFailure implements Action {
  readonly type =
    ResidualWeightConfigActionTypes.LOAD_RANGE_MAPPING_BY_CONFIG_ID_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class UpdateRangeMapping implements Action {
  readonly type = ResidualWeightConfigActionTypes.UPADTE_RANGE_MAPPING;
  constructor(public payload: UpdateRangeMappingPayload) {}
}

export class UpdateRangeMappingSuccess implements Action {
  readonly type = ResidualWeightConfigActionTypes.UPADTE_RANGE_MAPPING_SUCCESS;
  constructor(public payload: RangeMappingResponse) {}
}
export class UpdateRangeMappingFailure implements Action {
  readonly type = ResidualWeightConfigActionTypes.UPADTE_RANGE_MAPPING_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class RemoveRangeMapping implements Action {
  readonly type =
    ResidualWeightConfigActionTypes.REMOVE_RESIDUAL_WEIGHT_RANGE_WEIGHT;
  constructor(public payload: UpdateRangeMappingPayload) {}
}
export class RemoveRangeMappingSuccess implements Action {
  readonly type =
    ResidualWeightConfigActionTypes.REMOVE_RESIDUAL_WEIGHT_RANGE_WEIGHT_SUCCESS;
  constructor(public payload: any) {}
}
export class RemoveRangeMappingFailure implements Action {
  readonly type =
    ResidualWeightConfigActionTypes.REMOVE_RESIDUAL_WEIGHT_RANGE_WEIGHT_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export type ResidualWeightConfigAction =
  | LoadResidualWeightConfigList
  | LoadResidualWeightConfigListSuccess
  | LoadResidualWeightConfigListFailure
  | UpdateResidualWeightConfigIsActive
  | UpdateResidualWeightConfigIsActiveSuccess
  | UpdateResidualWeightConfigIsActiveFailure
  | SaveResidualWeightConfig
  | SaveResidualWeightConfigSuccess
  | SaveResidualWeightConfigFailure
  | SearchResidualWeightConfigList
  | SearchResidualWeightConfigListSuccess
  | SearchResidualWeightConfigListFailure
  | LoadReset
  | LoadResidualRangeWeight
  | LoadResidualRangeWeightSuccesss
  | LoadResidualRangeWeightFailure
  | LoadSelectedConfigDetails
  | LoadSelectedConfigDetailsSuccess
  | LoadSelectedConfigDetailsFailure
  | LoadRangeMappingByConfigid
  | LoadRangeMappingByConfigidSuccess
  | LoadRangeMappingByConfigidFailure
  | UpdateRangeMapping
  | UpdateRangeMappingSuccess
  | UpdateRangeMappingFailure
  | RemoveRangeMapping
  | RemoveRangeMappingSuccess
  | RemoveRangeMappingFailure;
