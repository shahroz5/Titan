import { Action } from '@ngrx/store';
import {
  CustomErrors,
  CoOrderPaymentConfigReqPayload,
  CoOrderPaymentConfigPayload,
  CoOrderPaymentConfigList,
  ProductGroup,
  SaveCoOrderPaymentsPayload,
  UpdateCoOrderPaymentConfigPayload,
  CoOrderPayementRulesRequest,
  CoOrderpyamentRulesResponse
} from '@poss-web/shared/models';

export enum CoOrderPaymentConfigActionTypes {
  LOAD_CO_ORDER_PAYMENT_CONFIG_LIST = '[CoOrder Payment Config] Load CoOrder Payment Config List',
  LOAD_CO_ORDER_PAYMENT_CONFIG_LIST_SUCCESS = '[CoOrder Payment Config] Load CoOrder Payment Config List Success',
  LOAD_CO_ORDER_PAYMENT_CONFIG_LIST_FAILURE = '[CoOrder Payment Config] Load CoOrder Payment Config List Failure',

  LOAD_SELECTED_CO_ORDER_PAYMENT_CONFIG_DETAILS = '[CoOrder Payment Config] Load Selected Config Details',
  LOAD_SELECTED_CO_ORDER_PAYMENT_CONFIG_DETAILS_SUCCESSS = '[CoOrder Payment Config] Load Selected Config Details Success',
  LOAD_SELECTED_CO_ORDER_PAYMENT_CONFIG_DETAILS_FAILURE = '[CoOrder Payment Config] Load Selected Config Details Failure',

  SEARCH_CO_ORDER_PAYMENT_CONFIG_DETAILS_BY_CONFIG_NAME = '[CoOrder Payment Config] Search Config Details By Config Name',
  SEARCH_CO_ORDER_PAYMENT_CONFIG_DETAILS_BY_CONFIG_NAME_SUCCESS = '[CoOrder Payment Config] Search Config Details By Config Name Success',
  SEARCH_CO_ORDER_PAYMENT_CONFIG_DETAILS_BY_CONFIG_NAME_FAILURE = '[CoOrder Payment Config] Search Config Details By Config Name Failure',

  UPDATE_CO_ORDER_PAYMENT_CONFIG_IS_ACTIVE = '[CoOrder Payment Config] Update Ordder Payment  Is Active',
  UPDATE_CO_ORDER_PAYMENT_CONFIG_IS_ACTIVE_SUCCESS = '[CoOrder Payment Config] Update Ordder Payment Is Active Success',
  UPDATE_CO_ORDER_PAYMENT_CONFIG_IS_ACTIVE_FAILURE = '[CoOrder Payment Config]Update Ordder Payment Is Active Failure',

  LOAD_PRODUCT_GROUPS = '[CoOrder Payment Config Details] Load Product groups',
  LOAD_PRODUCT_GROUPS_SUCCESS = '[CoOrder Payment Config Details] Load Product groups Success',
  LOAD_PRODUCT_GROUPS_FAILURE = '[CoOrder Payment Config Details] Load Product groups Failure',

  SAVE_CO_ORDER_PAYMENT_CONFIG_DETAILS = '[CoOrder Payment Config Details] Save CoOrder Payment Config Details',
  SAVE_CO_ORDER_PAYMENT_CONFIG_DETAILS_SUCCESS = '[CoOrder Payment Config Details] Save CoOrder Payment Config Details Success',
  SAVE_CO_ORDER_PAYMENT_CONFIG_DETAILS_FAILURE = '[CoOrder Payment Config Details] Save CoOrder Payment Config Details Failure',

  UPADTE_CO_ORDER_PAYMENT_CONFIG = '[CoOrder Payment Config Details] Upadate CoOrder Payment Config',
  UPADTE_CO_ORDER_PAYMENT_CONFIG_SUCCESS = '[CoOrder Payment Config Details] Update CoOrder Payment Config Success',
  UPADTE_CO_ORDER_PAYMENT_CONFIG_FAILURE = '[CoOrder Payment Config Details] Update CoOrder Payment Config Failure',

  LOAD_CO_ORDER_PAYMENT_BY_CONFIG_ID = '[CoOrder Payment Config Details] Load CoOrder Payment Config By Config Id',
  LOAD_CO_ORDER_PAYMENT_BY_CONFIG_ID_SUCCESS = '[CoOrder Payment Config Details] Load CoOrder Payment Config By Config Id Success',
  LOAD_CO_ORDER_PAYMENT_BY_CONFIG_ID_FAILURE = '[CoOrder Payment Config Details] Load CoOrder Payment Config By Config Id Failure',

  LOAD_ALL_CONFIG_RULES = '[CoOrder Payment Config Details] Load All Config Rules',
  LOAD_ALL_CONFIG_RULES_SUCCESS = '[CoOrder Payment Config Details] Load All Config Rules Success',
  LOAD_ALL_CONFIG_RULES_FAILURE = '[CoOrder Payment Config Details] Load All Config Rules Failure',

  REMOVE_CO_ORDER_PAYMENT_CONFIG = '[CoOrder Payment Config Details]  Remove CoOrder Payment Config  By id',
  REMOVE_CO_ORDER_PAYMENT_CONFIG_SUCCESS = '[CoOrder Payment Config Details]  Remove CoOrder Payment Config  By  id Success',
  REMOVE_CO_ORDER_PAYMENT_CONFIG_FAILURE = '[CoOrder Payment Config Details] Remove CoOrder Payment Config By  id Failure',

  LOAD_RESET = '[CoOrder Payment Config] Load Reset',

  CO_ORDER_PAYMENT_CONFIG_UNIQUE_NAME_CHECK = '[CoOrder Payment Config Details] Unique Name Check',
  CO_ORDER_PAYMENT_CONFIG_UNIQUE_NAME_CHECK_SUCCESS = '[CoOrder Payment Config Details] Unique Name Check Success ',
  CO_ORDER_PAYMENT_CONFIG_UNIQUE_NAME_CHECK_FAILURE = '[CoOrder Payment Config Details]Unique Name Check Failure'
}

export class LoadCoOrderPaymentsConfigList implements Action {
  readonly type =
    CoOrderPaymentConfigActionTypes.LOAD_CO_ORDER_PAYMENT_CONFIG_LIST;
  constructor(public payload: CoOrderPaymentConfigReqPayload) {}
}
export class LoadCoOrderPaymentsConfigListSuccess implements Action {
  readonly type =
    CoOrderPaymentConfigActionTypes.LOAD_CO_ORDER_PAYMENT_CONFIG_LIST_SUCCESS;
  constructor(public payload: CoOrderPaymentConfigList) {}
}

export class LoadCoOrderPaymentsConfigListFailure implements Action {
  readonly type =
    CoOrderPaymentConfigActionTypes.LOAD_CO_ORDER_PAYMENT_CONFIG_LIST_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class LoadSelectedConfigDetails implements Action {
  readonly type =
    CoOrderPaymentConfigActionTypes.LOAD_SELECTED_CO_ORDER_PAYMENT_CONFIG_DETAILS;
  constructor(public payload: string) {}
}

export class LoadSelectedConfigDetailsSuccess implements Action {
  readonly type =
    CoOrderPaymentConfigActionTypes.LOAD_SELECTED_CO_ORDER_PAYMENT_CONFIG_DETAILS_SUCCESSS;
  constructor(public payload: CoOrderPaymentConfigPayload) {}
}
export class LoadSelectedConfigDetailsFailure implements Action {
  readonly type =
    CoOrderPaymentConfigActionTypes.LOAD_SELECTED_CO_ORDER_PAYMENT_CONFIG_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class SearchConfigDetailsByConfigName implements Action {
  readonly type =
    CoOrderPaymentConfigActionTypes.SEARCH_CO_ORDER_PAYMENT_CONFIG_DETAILS_BY_CONFIG_NAME;
  constructor(public payload: string) {}
}

export class SearchConfigDetailsByConfigNameSuccess implements Action {
  readonly type =
    CoOrderPaymentConfigActionTypes.SEARCH_CO_ORDER_PAYMENT_CONFIG_DETAILS_BY_CONFIG_NAME_SUCCESS;
  constructor(public payload: CoOrderPaymentConfigList) {}
}

export class SearchConfigDetailsByConfigNameFailure implements Action {
  readonly type =
    CoOrderPaymentConfigActionTypes.SEARCH_CO_ORDER_PAYMENT_CONFIG_DETAILS_BY_CONFIG_NAME_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class UpdateConfigIsActive implements Action {
  readonly type =
    CoOrderPaymentConfigActionTypes.UPDATE_CO_ORDER_PAYMENT_CONFIG_IS_ACTIVE;
  constructor(public payload: UpdateCoOrderPaymentConfigPayload) {}
}

export class UpdateConfigIsActiveSuccess implements Action {
  readonly type =
    CoOrderPaymentConfigActionTypes.UPDATE_CO_ORDER_PAYMENT_CONFIG_IS_ACTIVE_SUCCESS;
  constructor(public payload: any) {}
}

export class UpdateConfigIsActiveFailure implements Action {
  readonly type =
    CoOrderPaymentConfigActionTypes.UPDATE_CO_ORDER_PAYMENT_CONFIG_IS_ACTIVE_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class LoadProductGroupMapping implements Action {
  readonly type = CoOrderPaymentConfigActionTypes.LOAD_PRODUCT_GROUPS;
}

export class LoadProductGroupMappingSuccess implements Action {
  readonly type = CoOrderPaymentConfigActionTypes.LOAD_PRODUCT_GROUPS_SUCCESS;
  constructor(public payload: ProductGroup[]) {}
}

export class LoadProductGroupMappingFailure implements Action {
  readonly type = CoOrderPaymentConfigActionTypes.LOAD_PRODUCT_GROUPS_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class LoadReset implements Action {
  readonly type = CoOrderPaymentConfigActionTypes.LOAD_RESET;
}

export class SaveOderPaymentConfig implements Action {
  readonly type =
    CoOrderPaymentConfigActionTypes.SAVE_CO_ORDER_PAYMENT_CONFIG_DETAILS;
  constructor(public payload: SaveCoOrderPaymentsPayload) {}
}

export class SaveOderPaymentConfigSuccess implements Action {
  readonly type =
    CoOrderPaymentConfigActionTypes.SAVE_CO_ORDER_PAYMENT_CONFIG_DETAILS_SUCCESS;
  constructor(public payload: string) {}
}
export class SaveOderPaymentConfigFailure implements Action {
  readonly type =
    CoOrderPaymentConfigActionTypes.SAVE_CO_ORDER_PAYMENT_CONFIG_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class UpdateCoOrderPaymentConfig implements Action {
  readonly type =
    CoOrderPaymentConfigActionTypes.UPADTE_CO_ORDER_PAYMENT_CONFIG;
  constructor(public payload: UpdateCoOrderPaymentConfigPayload) {}
}

export class UpdateCoOrderPaymentConfigSuccess implements Action {
  readonly type =
    CoOrderPaymentConfigActionTypes.UPADTE_CO_ORDER_PAYMENT_CONFIG_SUCCESS;
  constructor(public payload: any) {}
}
export class UpdateCoOrderPaymentConfigFailure implements Action {
  readonly type =
    CoOrderPaymentConfigActionTypes.UPADTE_CO_ORDER_PAYMENT_CONFIG_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class RemoveCoOrderPaymentConfig implements Action {
  readonly type =
    CoOrderPaymentConfigActionTypes.REMOVE_CO_ORDER_PAYMENT_CONFIG;
  constructor(public payload: UpdateCoOrderPaymentConfigPayload) {}
}
export class RemoveCoOrderPaymentConfigSuccess implements Action {
  readonly type =
    CoOrderPaymentConfigActionTypes.REMOVE_CO_ORDER_PAYMENT_CONFIG_SUCCESS;
  constructor(public payload: any) {}
}
export class RemoveCoOrderPaymentConfigFailure implements Action {
  readonly type =
    CoOrderPaymentConfigActionTypes.REMOVE_CO_ORDER_PAYMENT_CONFIG_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadCoOrderConfigByConfigId implements Action {
  readonly type =
    CoOrderPaymentConfigActionTypes.LOAD_CO_ORDER_PAYMENT_BY_CONFIG_ID;
  constructor(public payload: CoOrderPayementRulesRequest) {}
}

export class LoadCoOrderConfigByConfigIdSuccess implements Action {
  readonly type =
    CoOrderPaymentConfigActionTypes.LOAD_CO_ORDER_PAYMENT_BY_CONFIG_ID_SUCCESS;
  constructor(public payload: CoOrderpyamentRulesResponse) {}
}
export class LoadCoOrderConfigByConfigIdFailure implements Action {
  readonly type =
    CoOrderPaymentConfigActionTypes.LOAD_CO_ORDER_PAYMENT_BY_CONFIG_ID_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class LoadAllConfigRules implements Action {
  readonly type = CoOrderPaymentConfigActionTypes.LOAD_ALL_CONFIG_RULES;
  constructor(public payload: CoOrderPayementRulesRequest) {}
}

export class LoadAllConfigRulesSuccess implements Action {
  readonly type = CoOrderPaymentConfigActionTypes.LOAD_ALL_CONFIG_RULES_SUCCESS;
  constructor(public payload: CoOrderpyamentRulesResponse) {}
}
export class LoadAllConfigRulesFailure implements Action {
  readonly type = CoOrderPaymentConfigActionTypes.LOAD_ALL_CONFIG_RULES_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class UniqueConfigurationNameCheck implements Action {
  readonly type =
    CoOrderPaymentConfigActionTypes.CO_ORDER_PAYMENT_CONFIG_UNIQUE_NAME_CHECK;
  constructor(public payload: string) {}
}
export class UniqueConfigurationNameCheckSuccess implements Action {
  readonly type =
    CoOrderPaymentConfigActionTypes.CO_ORDER_PAYMENT_CONFIG_UNIQUE_NAME_CHECK_SUCCESS;
  constructor(public payload: number) {}
}
export class UniqueConfigurationNameCheckFailure implements Action {
  readonly type =
    CoOrderPaymentConfigActionTypes.CO_ORDER_PAYMENT_CONFIG_UNIQUE_NAME_CHECK_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export type CoOrderPaymentsConfigActions =
  | LoadCoOrderPaymentsConfigList
  | LoadCoOrderPaymentsConfigListSuccess
  | LoadCoOrderPaymentsConfigListFailure
  | LoadSelectedConfigDetails
  | LoadSelectedConfigDetailsSuccess
  | LoadSelectedConfigDetailsFailure
  | SearchConfigDetailsByConfigName
  | SearchConfigDetailsByConfigNameSuccess
  | SearchConfigDetailsByConfigNameFailure
  | UpdateConfigIsActive
  | UpdateConfigIsActiveSuccess
  | UpdateConfigIsActiveFailure
  | LoadProductGroupMapping
  | LoadProductGroupMappingSuccess
  | LoadProductGroupMappingFailure
  | SaveOderPaymentConfig
  | SaveOderPaymentConfigSuccess
  | SaveOderPaymentConfigFailure
  | UpdateCoOrderPaymentConfig
  | UpdateCoOrderPaymentConfigSuccess
  | UpdateCoOrderPaymentConfigFailure
  | RemoveCoOrderPaymentConfig
  | RemoveCoOrderPaymentConfigSuccess
  | RemoveCoOrderPaymentConfigFailure
  | LoadCoOrderConfigByConfigId
  | LoadCoOrderConfigByConfigIdSuccess
  | LoadCoOrderConfigByConfigIdFailure
  | LoadAllConfigRules
  | LoadAllConfigRulesSuccess
  | LoadAllConfigRulesFailure
  | LoadReset
  | UniqueConfigurationNameCheck
  | UniqueConfigurationNameCheckSuccess
  | UniqueConfigurationNameCheckFailure;
