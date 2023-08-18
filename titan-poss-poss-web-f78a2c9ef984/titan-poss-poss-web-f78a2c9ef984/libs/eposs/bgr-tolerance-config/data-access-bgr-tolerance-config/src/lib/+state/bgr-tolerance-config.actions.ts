import { Action } from '@ngrx/store';
import {
  CustomErrors,
  LoadAbToleranceConfigReqPayload,
  AbToleranceConfigResponse,
  SaveAbTolerancePayload,
  AbToleranceWeightRange,
  ABToleranceUpdateRangeMappingPayload,
  AbToleranceRangeMappingResponse,
  AbToleranceConfigMetalType
} from '@poss-web/shared/models';

export enum BgrToleranceConfigActionTypes {
  LOAD_BGR_TOLERANCE_CONFIG_LIST = '[BGR Tolerance Config] Load BGR Tolerance Config List',
  LOAD_BGR_TOLERANCE_CONFIG_LIST_SUCCESS = '[BGR Tolerance Config] Load BGR Tolerance Config List Success',
  LOAD_BGR_TOLERANCE_CONFIG_LIST_FAILURE = '[BGR Tolerance Config]Load BGR Tolerance Config List Failure',

  SEARCH_BGR_TOLERANCE_CONFIG_LIST = '[BGR Tolerance Config] Search BGR Tolerance Config List ',
  SEARCH_BGR_TOLERANCE_CONFIG_LIST_SUCCESS = '[BGR Tolerance Config] Search BGR Tolerance Config List Success ',
  SEARCH_BGR_TOLERANCE_CONFIG_LIST_FAILURE = '[BGR Tolerance Config] Search BGR Tolerance Config List Failure',

  UPADTE_BGR_TOLERANCE_CONFIG_IS_ACTIVE = '[BGR Tolerance Config]  Update BGR Tolerance Config Is Active',
  UPADTE_BGR_TOLERANCE_CONFIG_IS_ACTIVE_SUCCESS = '[BGR Tolerance Config] Update BGR Tolerance Config Is Active Success',
  UPADTE_BGR_TOLERANCE_CONFIG_IS_ACTIVE_FAILURE = '[BGR Tolerance Config] Updated BGR Tolerance Config Is Active Failure',

  SAVE_BGR_TOLERANCE_CONFIG = '[BGR Tolerance Config] Save BGR Tolerance Config',
  SAVE_BGR_TOLERANCE_CONFIG_SUCCESS = '[BGR Tolerance Config] Save BGR Tolerance Config Success',
  SAVE_BGR_TOLERANCE_CONFIG_FAILURE = '[BGR Tolerance Config] Save BGR Tolerance Config Failure',

  LOAD_SELECTED_CONFIG_DETAILS = '[BGR Tolerance Config] Load Selected BGR Tolerance Config Details',
  LOAD_SELECTED_CONFIG_DETAILS_SUCCESSS = '[BGR Tolerance Config] Load Selected BGR Tolerance Config Details Success',
  LOAD_SELECTED_CONFIG_DETAILS_FAILURE = '[BGR Tolerance Config] Load Selected BGR Tolerance Config Details Failure',

  LOAD_RANGE_MAPPING_BY_CONFIG_ID = '[BGR Tolerance Config] Load Range Mapping By Config Id',
  LOAD_RANGE_MAPPING_BY_CONFIG_ID_SUCCESS = '[BGR Tolerance Config] Load Range Mapping By Config Id Success',
  LOAD_RANGE_MAPPING_BY_CONFIG_ID_FAILURE = '[BGR Tolerance Config] Load Range Mapping By Config Id Failure',

  UPADTE_RANGE_MAPPING = '[BGR Tolerance Config] Upadate Range Mapping',
  UPADTE_RANGE_MAPPING_SUCCESS = '[BGR Tolerance Config] Update Range Mapping Success',
  UPADTE_RANGE_MAPPING_FAILURE = '[BGR Tolerance Config] Update Range Mapping Failure',

  LOAD_RESET = '[BGR Tolerance Config] Load Reset',

  LOAD_BGR_TOLERANCE_RANGE_WEIGHT = '[BGR Tolerance Config] Load BGR Tolerance Range Weight',
  LOAD_BGR_TOLERANCE_RANGE_WEIGHT_SUCCESS = '[BGR Tolerance Config] Load BGR Tolerance Range Weight Success',
  LOAD_BGR_TOLERANCE_RANGE_WEIGHT_FAILURE = '[BGR Tolerance Config] Load BGR Tolerance Range Weight Failure',

  LOAD_METAL_TYPES = '[AB Tolerance Confi g]Load Metal Types',
  LOAD_METAL_TYPES_SUCCESS = '[BGR Tolerance Config] Load Metal Types Success',
  LOAD_METAL_TYPES_FAILURE = '[BGR Tolerance Config] Load Metal Types Failure',

  REMOVE_BGR_TOLERANCE_CONFIG = '[BGR Tolerance Config] Remove BGR Tolerance Config  By id',
  REMOVE_BGR_TOLERANCE_CONFIG_SUCCESS = '[BGR Tolerance Config] Remove BGR Tolerance Config  By  id Success',
  REMOVE_BGR_TOLERANCE_CONFIG_FAILURE = '[BGR Tolerance Config] Remove BGR Tolerance Config By  id Failure',

  UPDATE_CONFIG_ID = '[Update Config Id] Update Config Id'
}
export class LoadBgrToleranceConfigList implements Action {
  readonly type = BgrToleranceConfigActionTypes.LOAD_BGR_TOLERANCE_CONFIG_LIST;
  constructor(public payload: LoadAbToleranceConfigReqPayload) {}
}
export class LoadBgrToleranceConfigListSuccess implements Action {
  readonly type =
    BgrToleranceConfigActionTypes.LOAD_BGR_TOLERANCE_CONFIG_LIST_SUCCESS;
  constructor(
    public payload: {
      data: AbToleranceConfigResponse[];
      totalElements: number;
    }
  ) {}
}
export class LoadBgrToleranceConfigListFailure implements Action {
  readonly type =
    BgrToleranceConfigActionTypes.LOAD_BGR_TOLERANCE_CONFIG_LIST_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class SearchBgrToleranceConfigList implements Action {
  readonly type =
    BgrToleranceConfigActionTypes.SEARCH_BGR_TOLERANCE_CONFIG_LIST;
  constructor(public payload: string, public ruleType: string) {}
}
export class SearchBgrToleranceConfigListSuccess implements Action {
  readonly type =
    BgrToleranceConfigActionTypes.SEARCH_BGR_TOLERANCE_CONFIG_LIST_SUCCESS;
  constructor(
    public payload: {
      data: AbToleranceConfigResponse[];
      totalElements: number;
    }
  ) {}
}
export class SearchBgrToleranceConfigListFailure implements Action {
  readonly type =
    BgrToleranceConfigActionTypes.SEARCH_BGR_TOLERANCE_CONFIG_LIST_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SaveBgrToleranceConfig implements Action {
  readonly type = BgrToleranceConfigActionTypes.SAVE_BGR_TOLERANCE_CONFIG;
  constructor(public payload: SaveAbTolerancePayload) {}
}
export class SaveBgrToleranceConfigSuccess implements Action {
  readonly type =
    BgrToleranceConfigActionTypes.SAVE_BGR_TOLERANCE_CONFIG_SUCCESS;
  constructor(public payload: AbToleranceConfigResponse) {}
}
export class SaveBgrToleranceConfigFailure implements Action {
  readonly type =
    BgrToleranceConfigActionTypes.SAVE_BGR_TOLERANCE_CONFIG_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class UpdateBgrToleranceConfigIsActive implements Action {
  readonly type =
    BgrToleranceConfigActionTypes.UPADTE_BGR_TOLERANCE_CONFIG_IS_ACTIVE;
  constructor(public payload: AbToleranceConfigResponse) {}
}
export class UpdateBgrToleranceConfigIsActiveSuccess implements Action {
  readonly type =
    BgrToleranceConfigActionTypes.UPADTE_BGR_TOLERANCE_CONFIG_IS_ACTIVE_SUCCESS;
  constructor(public payload: AbToleranceConfigResponse) {}
}
export class UpdateBgrToleranceConfigIsActiveFailure implements Action {
  readonly type =
    BgrToleranceConfigActionTypes.UPADTE_BGR_TOLERANCE_CONFIG_IS_ACTIVE_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadReset implements Action {
  readonly type = BgrToleranceConfigActionTypes.LOAD_RESET;
}

export class LoadBgrToleranceRangeWeight implements Action {
  readonly type = BgrToleranceConfigActionTypes.LOAD_BGR_TOLERANCE_RANGE_WEIGHT;
}

export class LoadBgrToleranceRangeWeightSuccess implements Action {
  readonly type =
    BgrToleranceConfigActionTypes.LOAD_BGR_TOLERANCE_RANGE_WEIGHT_SUCCESS;
  constructor(public payload: AbToleranceWeightRange[]) {}
}
export class LoadBgrToleranceRangeWeightFailure implements Action {
  readonly type =
    BgrToleranceConfigActionTypes.LOAD_BGR_TOLERANCE_RANGE_WEIGHT_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadSelectedConfigDetails implements Action {
  readonly type = BgrToleranceConfigActionTypes.LOAD_SELECTED_CONFIG_DETAILS;
  constructor(public payload: string, public ruleType: string) {}
}
export class LoadSelectedConfigDetailsSuccess implements Action {
  readonly type =
    BgrToleranceConfigActionTypes.LOAD_SELECTED_CONFIG_DETAILS_SUCCESSS;
  constructor(public payload: AbToleranceConfigResponse) {}
}
export class LoadSelectedConfigDetailsFailure implements Action {
  readonly type =
    BgrToleranceConfigActionTypes.LOAD_SELECTED_CONFIG_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadRangeMappingByConfigId implements Action {
  readonly type = BgrToleranceConfigActionTypes.LOAD_RANGE_MAPPING_BY_CONFIG_ID;
  constructor(public payload: string, public ruleType: string) {}
}

export class LoadRangeMappingByConfigIdSuccess implements Action {
  readonly type =
    BgrToleranceConfigActionTypes.LOAD_RANGE_MAPPING_BY_CONFIG_ID_SUCCESS;
  constructor(public payload: any) {}
}
export class LoadRangeMappingByConfigIdFailure implements Action {
  readonly type =
    BgrToleranceConfigActionTypes.LOAD_RANGE_MAPPING_BY_CONFIG_ID_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class UpdateRangeMapping implements Action {
  readonly type = BgrToleranceConfigActionTypes.UPADTE_RANGE_MAPPING;
  constructor(public payload: ABToleranceUpdateRangeMappingPayload) {}
}

export class UpdateRangeMappingSuccess implements Action {
  readonly type = BgrToleranceConfigActionTypes.UPADTE_RANGE_MAPPING_SUCCESS;
  constructor(public payload: AbToleranceRangeMappingResponse) {}
}
export class UpdateRangeMappingFailure implements Action {
  readonly type = BgrToleranceConfigActionTypes.UPADTE_RANGE_MAPPING_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadMetalTypes implements Action {
  readonly type = BgrToleranceConfigActionTypes.LOAD_METAL_TYPES;
}
export class LoadMetalTypesSuccess implements Action {
  readonly type = BgrToleranceConfigActionTypes.LOAD_METAL_TYPES_SUCCESS;
  constructor(public payload: AbToleranceConfigMetalType[]) {}
}
export class LoadMetalTypesFailure implements Action {
  readonly type = BgrToleranceConfigActionTypes.LOAD_METAL_TYPES_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class RemoveBgrToleranceConfig implements Action {
  readonly type = BgrToleranceConfigActionTypes.REMOVE_BGR_TOLERANCE_CONFIG;
  constructor(public payload: ABToleranceUpdateRangeMappingPayload) {}
}
export class RemoveBgrToleranceConfigSuccess implements Action {
  readonly type =
    BgrToleranceConfigActionTypes.REMOVE_BGR_TOLERANCE_CONFIG_SUCCESS;
  constructor(public payload: any) {}
}
export class RemoveBgrToleranceConfigFailure implements Action {
  readonly type =
    BgrToleranceConfigActionTypes.REMOVE_BGR_TOLERANCE_CONFIG_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class UpdateConfigId implements Action {
  readonly type = BgrToleranceConfigActionTypes.UPDATE_CONFIG_ID;
  constructor(readonly configId: number) {}
}

export type BgrToleranceConfigAction =
  | LoadBgrToleranceConfigList
  | LoadBgrToleranceConfigListSuccess
  | LoadBgrToleranceConfigListFailure
  | UpdateBgrToleranceConfigIsActive
  | UpdateBgrToleranceConfigIsActiveSuccess
  | UpdateBgrToleranceConfigIsActiveFailure
  | SaveBgrToleranceConfig
  | SaveBgrToleranceConfigSuccess
  | SaveBgrToleranceConfigFailure
  | SearchBgrToleranceConfigList
  | SearchBgrToleranceConfigListSuccess
  | SearchBgrToleranceConfigListFailure
  | LoadReset
  | LoadBgrToleranceRangeWeight
  | LoadBgrToleranceRangeWeightSuccess
  | LoadBgrToleranceRangeWeightFailure
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
  | RemoveBgrToleranceConfig
  | RemoveBgrToleranceConfigSuccess
  | RemoveBgrToleranceConfigFailure
  | UpdateConfigId;
