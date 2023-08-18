import { Action } from '@ngrx/store';
import {
  CustomErrors,
  LoadAbToleranceConfigReqPayload,
  AbToleranceConfigResponse,
  SaveAbTolerancePayload,
  AbToleranceWeightRange,
  ABToleranceUpdateRangeMappingPayload,
  AbToleranceRangeMappingResponse,
  AbToleranceConfigMetalType,
  AbToleranceConfigDetailsReqPayload,
  AbToleranceConfigDetailsResPayload
} from '@poss-web/shared/models';

export enum AbToleranceConfigActionTypes {
  LOAD_AB_TOLERANCE_CONFIG_LIST = '[AB Tolerance Config] Load AB Tolerance Config List',
  LOAD_AB_TOLERANCE_CONFIG_LIST_SUCCESS = '[AB Tolerance Config] Load AB Tolerance Config List Success',
  LOAD_AB_TOLERANCE_CONFIG_LIST_FAILURE = '[AB Tolerance Config]Load AB Tolerance Config List Failure',

  SEARCH_AB_TOLERANCE_CONFIG_LIST = '[AB Tolerance Config] Search AB Tolerance Config List ',
  SEARCH_AB_TOLERANCE_CONFIG_LIST_SUCCESS = '[AB Tolerance Config] Search AB Tolerance Config List Success ',
  SEARCH_AB_TOLERANCE_CONFIG_LIST_FAILURE = '[AB Tolerance Config] Search AB Tolerance Config List Failure',

  UPADTE_AB_TOLERANCE_CONFIG_IS_ACTIVE = '[AB Tolerance Config]  Update AB Tolerance Config Is Active',
  UPADTE_AB_TOLERANCE_CONFIG_IS_ACTIVE_SUCCESS = '[AB Tolerance Config] Update AB Tolerance Config Is Active Success',
  UPADTE_AB_TOLERANCE_CONFIG_IS_ACTIVE_FAILURE = '[AB Tolerance Config] Updated AB Tolerance Config Is Active Failure',

  SAVE_AB_TOLERANCE_CONFIG = '[AB Tolerance Config] Save AB Tolerance Config',
  SAVE_AB_TOLERANCE_CONFIG_SUCCESS = '[AB Tolerance Config] Save AB Tolerance Config Success',
  SAVE_AB_TOLERANCE_CONFIG_FAILURE = '[AB Tolerance Config] Save AB Tolerance Config Failure',

  LOAD_SELECTED_CONFIG_DETAILS = '[AB Tolerance Config] Load Selected AB Tolerance Config Details',
  LOAD_SELECTED_CONFIG_DETAILS_SUCCESSS = '[AB Tolerance Config] Load Selected AB Tolerance Config Details Success',
  LOAD_SELECTED_CONFIG_DETAILS_FAILURE = '[AB Tolerance Config] Load Selected AB Tolerance Config Details Failure',

  LOAD_RANGE_MAPPING_BY_CONFIG_ID = '[AB Tolerance Config] Load Range Mapping By Config Id',
  LOAD_RANGE_MAPPING_BY_CONFIG_ID_SUCCESS = '[AB Tolerance Config] Load Range Mapping By Config Id Success',
  LOAD_RANGE_MAPPING_BY_CONFIG_ID_FAILURE = '[AB Tolerance Config] Load Range Mapping By Config Id Failure',

  UPADTE_RANGE_MAPPING = '[AB Tolerance Config] Upadate Range Mapping',
  UPADTE_RANGE_MAPPING_SUCCESS = '[AB Tolerance Config] Update Range Mapping Success',
  UPADTE_RANGE_MAPPING_FAILURE = '[AB Tolerance Config] Update Range Mapping Failure',

  LOAD_RESET = '[AB Tolerance Config] Load Reset',

  LOAD_AB_TOLERANCE_RANGE_WEIGHT = '[AB Tolerance Config] Load Ab Tolerance Range Weight',
  LOAD_AB_TOLERANCE_RANGE_WEIGHT_SUCCESS = '[AB Tolerance Config] Load Ab Tolerance Range Weight Success',
  LOAD_AB_TOLERANCE_RANGE_WEIGHT_FAILURE = '[AB Tolerance Config] Load Ab Tolerance Range Weight Failure',

  LOAD_METAL_TYPES = '[AB Tolerance Confi g]Load Metal Types',
  LOAD_METAL_TYPES_SUCCESS = '[AB Tolerance Config] Load Metal Types Success',
  LOAD_METAL_TYPES_FAILURE = '[AB Tolerance Config] Load Metal Types Failure',

  REMOVE_AB_TOLERANCE_CONFIG = '[AB Tolerance Config] Remove Ab Tolerance Config  By id',
  REMOVE_AB_TOLERANCE_CONFIG_SUCCESS = '[AB Tolerance Config] Remove Ab Tolerance Config  By  id Success',
  REMOVE_AB_TOLERANCE_CONFIG_FAILURE = '[AB Tolerance Config] Remove Ab Tolerance Config By  id Failure',

  AB_TOLERANCE_CONFIG_UNIQUE_NAME_CHECK = '[AB Tolerance Config] Unique Name Check',
  AB_TOLERANCE_CONFIG_UNIQUE_NAME_CHECK_SUCCESS = '[AB Tolerance Config] Unique Name Check Success ',
  AB_TOLERANCE_CONFIG_UNIQUE_NAME_CHECK_FAILURE = '[AB Tolerance Config]Unique Name Check Failure'
}
export class LoadAbToleranceConfigList implements Action {
  readonly type = AbToleranceConfigActionTypes.LOAD_AB_TOLERANCE_CONFIG_LIST;
  constructor(public payload: LoadAbToleranceConfigReqPayload) {}
}
export class LoadAbToleranceConfigListSuccess implements Action {
  readonly type =
    AbToleranceConfigActionTypes.LOAD_AB_TOLERANCE_CONFIG_LIST_SUCCESS;
  constructor(
    public payload: {
      data: AbToleranceConfigResponse[];
      totalElements: number;
    }
  ) {}
}
export class LoadAbToleranceConfigListFailure implements Action {
  readonly type =
    AbToleranceConfigActionTypes.LOAD_AB_TOLERANCE_CONFIG_LIST_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class SearchAbToleranceConfigList implements Action {
  readonly type = AbToleranceConfigActionTypes.SEARCH_AB_TOLERANCE_CONFIG_LIST;
  constructor(public payload: { configName: string; ruleType: string }) {}
}
export class SearchAbToleranceConfigListSuccess implements Action {
  readonly type =
    AbToleranceConfigActionTypes.SEARCH_AB_TOLERANCE_CONFIG_LIST_SUCCESS;
  constructor(
    public payload: {
      data: AbToleranceConfigResponse[];
      totalElements: number;
    }
  ) {}
}
export class SearchAbToleranceConfigListFailure implements Action {
  readonly type =
    AbToleranceConfigActionTypes.SEARCH_AB_TOLERANCE_CONFIG_LIST_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SaveAbToleranceConfig implements Action {
  readonly type = AbToleranceConfigActionTypes.SAVE_AB_TOLERANCE_CONFIG;
  constructor(public payload: SaveAbTolerancePayload) {}
}
export class SaveAbToleranceConfigSuccess implements Action {
  readonly type = AbToleranceConfigActionTypes.SAVE_AB_TOLERANCE_CONFIG_SUCCESS;
  constructor(public payload: AbToleranceConfigResponse) {}
}
export class SaveAbToleranceConfigFailure implements Action {
  readonly type = AbToleranceConfigActionTypes.SAVE_AB_TOLERANCE_CONFIG_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class UpdateAbToleranceConfigIsActive implements Action {
  readonly type =
    AbToleranceConfigActionTypes.UPADTE_AB_TOLERANCE_CONFIG_IS_ACTIVE;
  constructor(public payload: AbToleranceConfigResponse) {}
}
export class UpdateAbToleranceConfigIsActiveSuccess implements Action {
  readonly type =
    AbToleranceConfigActionTypes.UPADTE_AB_TOLERANCE_CONFIG_IS_ACTIVE_SUCCESS;
  constructor(public payload: AbToleranceConfigResponse) {}
}
export class UpdateAbToleranceConfigIsActiveFailure implements Action {
  readonly type =
    AbToleranceConfigActionTypes.UPADTE_AB_TOLERANCE_CONFIG_IS_ACTIVE_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadReset implements Action {
  readonly type = AbToleranceConfigActionTypes.LOAD_RESET;
}

export class LoadAbToleranceRangeWeight implements Action {
  readonly type = AbToleranceConfigActionTypes.LOAD_AB_TOLERANCE_RANGE_WEIGHT;
}

export class LoadAbToleranceRangeWeightSuccess implements Action {
  readonly type =
    AbToleranceConfigActionTypes.LOAD_AB_TOLERANCE_RANGE_WEIGHT_SUCCESS;
  constructor(public payload: AbToleranceWeightRange[]) {}
}
export class LoadAbToleranceRangeWeightFailure implements Action {
  readonly type =
    AbToleranceConfigActionTypes.LOAD_AB_TOLERANCE_RANGE_WEIGHT_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadSelectedConfigDetails implements Action {
  readonly type = AbToleranceConfigActionTypes.LOAD_SELECTED_CONFIG_DETAILS;
  constructor(public payload: { configId: string; ruleType: string }) {}
}
export class LoadSelectedConfigDetailsSuccess implements Action {
  readonly type =
    AbToleranceConfigActionTypes.LOAD_SELECTED_CONFIG_DETAILS_SUCCESSS;
  constructor(public payload: AbToleranceConfigResponse) {}
}
export class LoadSelectedConfigDetailsFailure implements Action {
  readonly type =
    AbToleranceConfigActionTypes.LOAD_SELECTED_CONFIG_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadRangeMappingByConfigId implements Action {
  readonly type = AbToleranceConfigActionTypes.LOAD_RANGE_MAPPING_BY_CONFIG_ID;
  constructor(public payload: AbToleranceConfigDetailsReqPayload) {}
}

export class LoadRangeMappingByConfigIdSuccess implements Action {
  readonly type =
    AbToleranceConfigActionTypes.LOAD_RANGE_MAPPING_BY_CONFIG_ID_SUCCESS;
  constructor(public payload: AbToleranceConfigDetailsResPayload) {}
}
export class LoadRangeMappingByConfigIdFailure implements Action {
  readonly type =
    AbToleranceConfigActionTypes.LOAD_RANGE_MAPPING_BY_CONFIG_ID_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class UpdateRangeMapping implements Action {
  readonly type = AbToleranceConfigActionTypes.UPADTE_RANGE_MAPPING;
  constructor(public payload: ABToleranceUpdateRangeMappingPayload) {}
}

export class UpdateRangeMappingSuccess implements Action {
  readonly type = AbToleranceConfigActionTypes.UPADTE_RANGE_MAPPING_SUCCESS;
  constructor(public payload: AbToleranceRangeMappingResponse) {}
}
export class UpdateRangeMappingFailure implements Action {
  readonly type = AbToleranceConfigActionTypes.UPADTE_RANGE_MAPPING_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadMetalTypes implements Action {
  readonly type = AbToleranceConfigActionTypes.LOAD_METAL_TYPES;
}
export class LoadMetalTypesSuccess implements Action {
  readonly type = AbToleranceConfigActionTypes.LOAD_METAL_TYPES_SUCCESS;
  constructor(public payload: AbToleranceConfigMetalType[]) {}
}
export class LoadMetalTypesFailure implements Action {
  readonly type = AbToleranceConfigActionTypes.LOAD_METAL_TYPES_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class RemoveAbToleranceConfig implements Action {
  readonly type = AbToleranceConfigActionTypes.REMOVE_AB_TOLERANCE_CONFIG;
  constructor(public payload: ABToleranceUpdateRangeMappingPayload) {}
}
export class RemoveAbToleranceConfigSuccess implements Action {
  readonly type =
    AbToleranceConfigActionTypes.REMOVE_AB_TOLERANCE_CONFIG_SUCCESS;
  constructor(public payload: any) {}
}
export class RemoveAbToleranceConfigFailure implements Action {
  readonly type =
    AbToleranceConfigActionTypes.REMOVE_AB_TOLERANCE_CONFIG_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class UniqueConfigurationNameCheck implements Action {
  readonly type =
    AbToleranceConfigActionTypes.AB_TOLERANCE_CONFIG_UNIQUE_NAME_CHECK;
  constructor(public payload: string) {}
}
export class UniqueConfigurationNameCheckSuccess implements Action {
  readonly type =
    AbToleranceConfigActionTypes.AB_TOLERANCE_CONFIG_UNIQUE_NAME_CHECK_SUCCESS;
  constructor(public payload: number) {}
}
export class UniqueConfigurationNameCheckFailure implements Action {
  readonly type =
    AbToleranceConfigActionTypes.AB_TOLERANCE_CONFIG_UNIQUE_NAME_CHECK_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export type AbToleranceConfigAction =
  | LoadAbToleranceConfigList
  | LoadAbToleranceConfigListSuccess
  | LoadAbToleranceConfigListFailure
  | UpdateAbToleranceConfigIsActive
  | UpdateAbToleranceConfigIsActiveSuccess
  | UpdateAbToleranceConfigIsActiveFailure
  | SaveAbToleranceConfig
  | SaveAbToleranceConfigSuccess
  | SaveAbToleranceConfigFailure
  | SearchAbToleranceConfigList
  | SearchAbToleranceConfigListSuccess
  | SearchAbToleranceConfigListFailure
  | LoadReset
  | LoadAbToleranceRangeWeight
  | LoadAbToleranceRangeWeightSuccess
  | LoadAbToleranceRangeWeightFailure
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
  | RemoveAbToleranceConfig
  | RemoveAbToleranceConfigSuccess
  | RemoveAbToleranceConfigFailure
  | UniqueConfigurationNameCheck
  | UniqueConfigurationNameCheckSuccess
  | UniqueConfigurationNameCheckFailure;
