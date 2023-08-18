import { Action } from '@ngrx/store';
import {
  CustomErrors,
  LoadCoToleranceConfigReqPayload,
  CoToleranceConfigResponse,
  SaveCoTolerancePayload,
  CoToleranceWeightRange,
  COToleranceUpdateRangeMappingPayload,
  CoToleranceRangeMappingResponse,
  CoToleranceConfigMetalType,
  CoToleranceConfigDetailsReqPayload,
  CoToleranceConfigDetailsResPayload
} from '@poss-web/shared/models';

export enum CoToleranceConfigActionTypes {
  LOAD_CO_TOLERANCE_CONFIG_LIST = '[CO Tolerance Config] Load CO Tolerance Config List',
  LOAD_CO_TOLERANCE_CONFIG_LIST_SUCCESS = '[CO Tolerance Config] Load CO Tolerance Config List Success',
  LOAD_CO_TOLERANCE_CONFIG_LIST_FAILURE = '[CO Tolerance Config]Load CO Tolerance Config List Failure',

  SEARCH_CO_TOLERANCE_CONFIG_LIST = '[CO Tolerance Config] Search CO Tolerance Config List ',
  SEARCH_CO_TOLERANCE_CONFIG_LIST_SUCCESS = '[CO Tolerance Config] Search CO Tolerance Config List Success ',
  SEARCH_CO_TOLERANCE_CONFIG_LIST_FAILURE = '[CO Tolerance Config] Search CO Tolerance Config List Failure',

  UPADTE_CO_TOLERANCE_CONFIG_IS_ACTIVE = '[CO Tolerance Config]  Update CO Tolerance Config Is Active',
  UPADTE_CO_TOLERANCE_CONFIG_IS_ACTIVE_SUCCESS = '[CO Tolerance Config] Update CO Tolerance Config Is Active Success',
  UPADTE_CO_TOLERANCE_CONFIG_IS_ACTIVE_FAILURE = '[CO Tolerance Config] Updated CO Tolerance Config Is Active Failure',

  SAVE_CO_TOLERANCE_CONFIG = '[CO Tolerance Config] Save CO Tolerance Config',
  SAVE_CO_TOLERANCE_CONFIG_SUCCESS = '[CO Tolerance Config] Save CO Tolerance Config Success',
  SAVE_CO_TOLERANCE_CONFIG_FAILURE = '[CO Tolerance Config] Save CO Tolerance Config Failure',

  LOAD_SELECTED_CONFIG_DETAILS = '[CO Tolerance Config] Load Selected CO Tolerance Config Details',
  LOAD_SELECTED_CONFIG_DETAILS_SUCCESSS = '[CO Tolerance Config] Load Selected CO Tolerance Config Details Success',
  LOAD_SELECTED_CONFIG_DETAILS_FAILURE = '[CO Tolerance Config] Load Selected CO Tolerance Config Details Failure',

  LOAD_RANGE_MAPPING_BY_CONFIG_ID = '[CO Tolerance Config] Load Range Mapping By Config Id',
  LOAD_RANGE_MAPPING_BY_CONFIG_ID_SUCCESS = '[CO Tolerance Config] Load Range Mapping By Config Id Success',
  LOAD_RANGE_MAPPING_BY_CONFIG_ID_FAILURE = '[CO Tolerance Config] Load Range Mapping By Config Id Failure',

  UPADTE_RANGE_MAPPING = '[CO Tolerance Config] Upadate Range Mapping',
  UPADTE_RANGE_MAPPING_SUCCESS = '[CO Tolerance Config] Update Range Mapping Success',
  UPADTE_RANGE_MAPPING_FAILURE = '[CO Tolerance Config] Update Range Mapping Failure',

  LOAD_RESET = '[CO Tolerance Config] Load Reset',

  LOAD_CO_TOLERANCE_RANGE_WEIGHT = '[CO Tolerance Config] Load Co Tolerance Range Weight',
  LOAD_CO_TOLERANCE_RANGE_WEIGHT_SUCCESS = '[CO Tolerance Config] Load Co Tolerance Range Weight Success',
  LOAD_CO_TOLERANCE_RANGE_WEIGHT_FAILURE = '[CO Tolerance Config] Load Co Tolerance Range Weight Failure',

  LOAD_METAL_TYPES = '[CO Tolerance Confi g]Load Metal Types',
  LOAD_METAL_TYPES_SUCCESS = '[CO Tolerance Config] Load Metal Types Success',
  LOAD_METAL_TYPES_FAILURE = '[CO Tolerance Config] Load Metal Types Failure',

  REMOVE_CO_TOLERANCE_CONFIG = '[CO Tolerance Config] Remove Co Tolerance Config  By id',
  REMOVE_CO_TOLERANCE_CONFIG_SUCCESS = '[CO Tolerance Config] Remove Co Tolerance Config  By  id Success',
  REMOVE_CO_TOLERANCE_CONFIG_FAILURE = '[CO Tolerance Config] Remove Co Tolerance Config By  id Failure',

  CO_TOLERANCE_CONFIG_UNIQUE_NAME_CHECK = '[CO Tolerance Config] Unique Name Check',
  CO_TOLERANCE_CONFIG_UNIQUE_NAME_CHECK_SUCCESS = '[CO Tolerance Config] Unique Name Check Success ',
  CO_TOLERANCE_CONFIG_UNIQUE_NAME_CHECK_FAILURE = '[CO Tolerance Config]Unique Name Check Failure'
}
export class LoadCoToleranceConfigList implements Action {
  readonly type = CoToleranceConfigActionTypes.LOAD_CO_TOLERANCE_CONFIG_LIST;
  constructor(public payload: LoadCoToleranceConfigReqPayload) {}
}
export class LoadCoToleranceConfigListSuccess implements Action {
  readonly type =
    CoToleranceConfigActionTypes.LOAD_CO_TOLERANCE_CONFIG_LIST_SUCCESS;
  constructor(
    public payload: {
      data: CoToleranceConfigResponse[];
      totalElements: number;
    }
  ) {}
}
export class LoadCoToleranceConfigListFailure implements Action {
  readonly type =
    CoToleranceConfigActionTypes.LOAD_CO_TOLERANCE_CONFIG_LIST_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class SearchCoToleranceConfigList implements Action {
  readonly type = CoToleranceConfigActionTypes.SEARCH_CO_TOLERANCE_CONFIG_LIST;
  constructor(public payload: { configName: string; ruleType: string }) {}
}
export class SearchCoToleranceConfigListSuccess implements Action {
  readonly type =
    CoToleranceConfigActionTypes.SEARCH_CO_TOLERANCE_CONFIG_LIST_SUCCESS;
  constructor(
    public payload: {
      data: CoToleranceConfigResponse[];
      totalElements: number;
    }
  ) {}
}
export class SearchCoToleranceConfigListFailure implements Action {
  readonly type =
    CoToleranceConfigActionTypes.SEARCH_CO_TOLERANCE_CONFIG_LIST_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SaveCoToleranceConfig implements Action {
  readonly type = CoToleranceConfigActionTypes.SAVE_CO_TOLERANCE_CONFIG;
  constructor(public payload: SaveCoTolerancePayload) {}
}
export class SaveCoToleranceConfigSuccess implements Action {
  readonly type = CoToleranceConfigActionTypes.SAVE_CO_TOLERANCE_CONFIG_SUCCESS;
  constructor(public payload: CoToleranceConfigResponse) {}
}
export class SaveCoToleranceConfigFailure implements Action {
  readonly type = CoToleranceConfigActionTypes.SAVE_CO_TOLERANCE_CONFIG_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class UpdateCoToleranceConfigIsActive implements Action {
  readonly type =
    CoToleranceConfigActionTypes.UPADTE_CO_TOLERANCE_CONFIG_IS_ACTIVE;
  constructor(public payload: CoToleranceConfigResponse) {}
}
export class UpdateCoToleranceConfigIsActiveSuccess implements Action {
  readonly type =
    CoToleranceConfigActionTypes.UPADTE_CO_TOLERANCE_CONFIG_IS_ACTIVE_SUCCESS;
  constructor(public payload: CoToleranceConfigResponse) {}
}
export class UpdateCoToleranceConfigIsActiveFailure implements Action {
  readonly type =
    CoToleranceConfigActionTypes.UPADTE_CO_TOLERANCE_CONFIG_IS_ACTIVE_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadReset implements Action {
  readonly type = CoToleranceConfigActionTypes.LOAD_RESET;
}

export class LoadCoToleranceRangeWeight implements Action {
  readonly type = CoToleranceConfigActionTypes.LOAD_CO_TOLERANCE_RANGE_WEIGHT;
}

export class LoadCoToleranceRangeWeightSuccess implements Action {
  readonly type =
    CoToleranceConfigActionTypes.LOAD_CO_TOLERANCE_RANGE_WEIGHT_SUCCESS;
  constructor(public payload: CoToleranceWeightRange[]) {}
}
export class LoadCoToleranceRangeWeightFailure implements Action {
  readonly type =
    CoToleranceConfigActionTypes.LOAD_CO_TOLERANCE_RANGE_WEIGHT_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadSelectedConfigDetails implements Action {
  readonly type = CoToleranceConfigActionTypes.LOAD_SELECTED_CONFIG_DETAILS;
  constructor(public payload: { configId: string; ruleType: string }) {}
}
export class LoadSelectedConfigDetailsSuccess implements Action {
  readonly type =
    CoToleranceConfigActionTypes.LOAD_SELECTED_CONFIG_DETAILS_SUCCESSS;
  constructor(public payload: CoToleranceConfigResponse) {}
}
export class LoadSelectedConfigDetailsFailure implements Action {
  readonly type =
    CoToleranceConfigActionTypes.LOAD_SELECTED_CONFIG_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadRangeMappingByConfigId implements Action {
  readonly type = CoToleranceConfigActionTypes.LOAD_RANGE_MAPPING_BY_CONFIG_ID;
  constructor(public payload: CoToleranceConfigDetailsReqPayload) {}
}

export class LoadRangeMappingByConfigIdSuccess implements Action {
  readonly type =
    CoToleranceConfigActionTypes.LOAD_RANGE_MAPPING_BY_CONFIG_ID_SUCCESS;
  constructor(public payload: CoToleranceConfigDetailsResPayload) {}
}
export class LoadRangeMappingByConfigIdFailure implements Action {
  readonly type =
    CoToleranceConfigActionTypes.LOAD_RANGE_MAPPING_BY_CONFIG_ID_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class UpdateRangeMapping implements Action {
  readonly type = CoToleranceConfigActionTypes.UPADTE_RANGE_MAPPING;
  constructor(public payload: COToleranceUpdateRangeMappingPayload) {}
}

export class UpdateRangeMappingSuccess implements Action {
  readonly type = CoToleranceConfigActionTypes.UPADTE_RANGE_MAPPING_SUCCESS;
  constructor(public payload: CoToleranceRangeMappingResponse) {}
}
export class UpdateRangeMappingFailure implements Action {
  readonly type = CoToleranceConfigActionTypes.UPADTE_RANGE_MAPPING_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadMetalTypes implements Action {
  readonly type = CoToleranceConfigActionTypes.LOAD_METAL_TYPES;
}
export class LoadMetalTypesSuccess implements Action {
  readonly type = CoToleranceConfigActionTypes.LOAD_METAL_TYPES_SUCCESS;
  constructor(public payload: CoToleranceConfigMetalType[]) {}
}
export class LoadMetalTypesFailure implements Action {
  readonly type = CoToleranceConfigActionTypes.LOAD_METAL_TYPES_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class RemoveCoToleranceConfig implements Action {
  readonly type = CoToleranceConfigActionTypes.REMOVE_CO_TOLERANCE_CONFIG;
  constructor(public payload: COToleranceUpdateRangeMappingPayload) {}
}
export class RemoveCoToleranceConfigSuccess implements Action {
  readonly type =
    CoToleranceConfigActionTypes.REMOVE_CO_TOLERANCE_CONFIG_SUCCESS;
  constructor(public payload: any) {}
}
export class RemoveCoToleranceConfigFailure implements Action {
  readonly type =
    CoToleranceConfigActionTypes.REMOVE_CO_TOLERANCE_CONFIG_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class UniqueConfigurationNameCheck implements Action {
  readonly type =
    CoToleranceConfigActionTypes.CO_TOLERANCE_CONFIG_UNIQUE_NAME_CHECK;
  constructor(public payload: string) {}
}
export class UniqueConfigurationNameCheckSuccess implements Action {
  readonly type =
    CoToleranceConfigActionTypes.CO_TOLERANCE_CONFIG_UNIQUE_NAME_CHECK_SUCCESS;
  constructor(public payload: number) {}
}
export class UniqueConfigurationNameCheckFailure implements Action {
  readonly type =
    CoToleranceConfigActionTypes.CO_TOLERANCE_CONFIG_UNIQUE_NAME_CHECK_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export type CoToleranceConfigAction =
  | LoadCoToleranceConfigList
  | LoadCoToleranceConfigListSuccess
  | LoadCoToleranceConfigListFailure
  | UpdateCoToleranceConfigIsActive
  | UpdateCoToleranceConfigIsActiveSuccess
  | UpdateCoToleranceConfigIsActiveFailure
  | SaveCoToleranceConfig
  | SaveCoToleranceConfigSuccess
  | SaveCoToleranceConfigFailure
  | SearchCoToleranceConfigList
  | SearchCoToleranceConfigListSuccess
  | SearchCoToleranceConfigListFailure
  | LoadReset
  | LoadCoToleranceRangeWeight
  | LoadCoToleranceRangeWeightSuccess
  | LoadCoToleranceRangeWeightFailure
  | LoadSelectedConfigDetails
  | LoadSelectedConfigDetailsSuccess
  | LoadSelectedConfigDetailsFailure
  | LoadRangeMappingByConfigId
  | LoadRangeMappingByConfigIdSuccess
  | LoadRangeMappingByConfigIdFailure
  | UpdateRangeMapping
  | UpdateRangeMappingSuccess
  | UpdateRangeMappingFailure
  | LoadMetalTypes
  | LoadMetalTypesSuccess
  | LoadMetalTypesFailure
  | RemoveCoToleranceConfig
  | RemoveCoToleranceConfigSuccess
  | RemoveCoToleranceConfigFailure
  | UniqueConfigurationNameCheck
  | UniqueConfigurationNameCheckSuccess
  | UniqueConfigurationNameCheckFailure;
