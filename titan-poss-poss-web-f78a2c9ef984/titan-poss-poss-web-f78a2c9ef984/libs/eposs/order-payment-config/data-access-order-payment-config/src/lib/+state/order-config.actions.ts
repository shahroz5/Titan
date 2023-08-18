import { Action } from '@ngrx/store';
import {
  CustomErrors,
  OrderPaymentConfigReqPayload,
  OrderPaymentConfigPayload,
  OrderPaymentConfigList,
  ProductGroup,
  SaveOrderPaymentsPayload,
  UpdateOrderPaymentConfigPayload,
  OrderPayementRulesRequest,
  OrderpyamentRulesResponse
} from '@poss-web/shared/models';

export enum OrderPaymentConfigActionTypes {
  LOAD_ORDER_PAYMENT_CONFIG_LIST = '[Order Payment Config] Load Order Payment Config List',
  LOAD_ORDER_PAYMENT_CONFIG_LIST_SUCCESS = '[Order Payment Config] Load Order Payment Config List Success',
  LOAD_ORDER_PAYMENT_CONFIG_LIST_FAILURE = '[Order Payment Config] Load Order Payment Config List Failure',

  LOAD_SELECTED_ORDER_PAYMENT_CONFIG_DETAILS = '[Order Payment Config] Load Selected Config Details',
  LOAD_SELECTED_ORDER_PAYMENT_CONFIG_DETAILS_SUCCESSS = '[Order Payment Config] Load Selected Config Details Success',
  LOAD_SELECTED_ORDER_PAYMENT_CONFIG_DETAILS_FAILURE = '[Order Payment Config] Load Selected Config Details Failure',

  SEARCH_ORDER_PAYMENT_CONFIG_DETAILS_BY_CONFIG_NAME = '[Order Payment Config] Search Config Details By Config Name',
  SEARCH_ORDER_PAYMENT_CONFIG_DETAILS_BY_CONFIG_NAME_SUCCESS = '[Order Payment Config] Search Config Details By Config Name Success',
  SEARCH_ORDER_PAYMENT_CONFIG_DETAILS_BY_CONFIG_NAME_FAILURE = '[Order Payment Config] Search Config Details By Config Name Failure',

  UPDATE_ORDER_PAYMENT_CONFIG_IS_ACTIVE = '[Order Payment Config] Update Ordder Payment  Is Active',
  UPDATE_ORDER_PAYMENT_CONFIG_IS_ACTIVE_SUCCESS = '[Order Payment Config] Update Ordder Payment Is Active Success',
  UPDATE_ORDER_PAYMENT_CONFIG_IS_ACTIVE_FAILURE = '[Order Payment Config]Update Ordder Payment Is Active Failure',

  LOAD_PRODUCT_GROUPS = '[Order Payment Config Details] Load Product groups',
  LOAD_PRODUCT_GROUPS_SUCCESS = '[Order Payment Config Details] Load Product groups Success',
  LOAD_PRODUCT_GROUPS_FAILURE = '[Order Payment Config Details] Load Product groups Failure',

  SAVE_ORDER_PAYMENT_CONFIG_DETAILS = '[Order Payment Config Details] Save Order Payment Config Details',
  SAVE_ORDER_PAYMENT_CONFIG_DETAILS_SUCCESS = '[Order Payment Config Details] Save Order Payment Config Details Success',
  SAVE_ORDER_PAYMENT_CONFIG_DETAILS_FAILURE = '[Order Payment Config Details] Save Order Payment Config Details Failure',

  UPADTE_ORDER_PAYMENT_CONFIG = '[Order Payment Config Details] Upadate Order Payment Config',
  UPADTE_ORDER_PAYMENT_CONFIG_SUCCESS = '[Order Payment Config Details] Update Order Payment Config Success',
  UPADTE_ORDER_PAYMENT_CONFIG_FAILURE = '[Order Payment Config Details] Update Order Payment Config Failure',

  LOAD_ORDER_PAYMENT_BY_CONFIG_ID = '[Order Payment Config Details] Load Order Payment Config By Config Id',
  LOAD_ORDER_PAYMENT_BY_CONFIG_ID_SUCCESS = '[Order Payment Config Details] Load Order Payment Config By Config Id Success',
  LOAD_ORDER_PAYMENT_BY_CONFIG_ID_FAILURE = '[Order Payment Config Details] Load Order Payment Config By Config Id Failure',

  LOAD_ALL_CONFIG_RULES = '[Order Payment Config Details] Load All Config Rules',
  LOAD_ALL_CONFIG_RULES_SUCCESS = '[Order Payment Config Details] Load All Config Rules Success',
  LOAD_ALL_CONFIG_RULES_FAILURE = '[Order Payment Config Details] Load All Config Rules Failure',

  REMOVE_ORDER_PAYMENT_CONFIG = '[Order Payment Config Details]  Remove Order Payment Config  By id',
  REMOVE_ORDER_PAYMENT_CONFIG_SUCCESS = '[Order Payment Config Details]  Remove Order Payment Config  By  id Success',
  REMOVE_ORDER_PAYMENT_CONFIG_FAILURE = '[Order Payment Config Details] Remove Order Payment Config By  id Failure',

  LOAD_RESET = '[Order Payment Config] Load Reset',

  ORDER_PAYMENT_CONFIG_UNIQUE_NAME_CHECK = '[Order Payment Config Details] Unique Name Check',
  ORDER_PAYMENT_CONFIG_UNIQUE_NAME_CHECK_SUCCESS = '[Order Payment Config Details] Unique Name Check Success ',
  ORDER_PAYMENT_CONFIG_UNIQUE_NAME_CHECK_FAILURE = '[Order Payment Config Details]Unique Name Check Failure'
}

export class LoadOrderPaymentsConfigList implements Action {
  readonly type = OrderPaymentConfigActionTypes.LOAD_ORDER_PAYMENT_CONFIG_LIST;
  constructor(public payload: OrderPaymentConfigReqPayload) {}
}
export class LoadOrderPaymentsConfigListSuccess implements Action {
  readonly type =
    OrderPaymentConfigActionTypes.LOAD_ORDER_PAYMENT_CONFIG_LIST_SUCCESS;
  constructor(public payload: OrderPaymentConfigList) {}
}

export class LoadOrderPaymentsConfigListFailure implements Action {
  readonly type =
    OrderPaymentConfigActionTypes.LOAD_ORDER_PAYMENT_CONFIG_LIST_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class LoadSelectedConfigDetails implements Action {
  readonly type =
    OrderPaymentConfigActionTypes.LOAD_SELECTED_ORDER_PAYMENT_CONFIG_DETAILS;
  constructor(public payload: string) {}
}

export class LoadSelectedConfigDetailsSuccess implements Action {
  readonly type =
    OrderPaymentConfigActionTypes.LOAD_SELECTED_ORDER_PAYMENT_CONFIG_DETAILS_SUCCESSS;
  constructor(public payload: OrderPaymentConfigPayload) {}
}
export class LoadSelectedConfigDetailsFailure implements Action {
  readonly type =
    OrderPaymentConfigActionTypes.LOAD_SELECTED_ORDER_PAYMENT_CONFIG_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class SearchConfigDetailsByConfigName implements Action {
  readonly type =
    OrderPaymentConfigActionTypes.SEARCH_ORDER_PAYMENT_CONFIG_DETAILS_BY_CONFIG_NAME;
  constructor(public payload: string) {}
}

export class SearchConfigDetailsByConfigNameSuccess implements Action {
  readonly type =
    OrderPaymentConfigActionTypes.SEARCH_ORDER_PAYMENT_CONFIG_DETAILS_BY_CONFIG_NAME_SUCCESS;
  constructor(public payload: OrderPaymentConfigList) {}
}

export class SearchConfigDetailsByConfigNameFailure implements Action {
  readonly type =
    OrderPaymentConfigActionTypes.SEARCH_ORDER_PAYMENT_CONFIG_DETAILS_BY_CONFIG_NAME_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class UpdateConfigIsActive implements Action {
  readonly type =
    OrderPaymentConfigActionTypes.UPDATE_ORDER_PAYMENT_CONFIG_IS_ACTIVE;
  constructor(public payload: UpdateOrderPaymentConfigPayload) {}
}

export class UpdateConfigIsActiveSuccess implements Action {
  readonly type =
    OrderPaymentConfigActionTypes.UPDATE_ORDER_PAYMENT_CONFIG_IS_ACTIVE_SUCCESS;
  constructor(public payload: any) {}
}

export class UpdateConfigIsActiveFailure implements Action {
  readonly type =
    OrderPaymentConfigActionTypes.UPDATE_ORDER_PAYMENT_CONFIG_IS_ACTIVE_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class LoadProductGroupMapping implements Action {
  readonly type = OrderPaymentConfigActionTypes.LOAD_PRODUCT_GROUPS;
}

export class LoadProductGroupMappingSuccess implements Action {
  readonly type = OrderPaymentConfigActionTypes.LOAD_PRODUCT_GROUPS_SUCCESS;
  constructor(public payload: ProductGroup[]) {}
}

export class LoadProductGroupMappingFailure implements Action {
  readonly type = OrderPaymentConfigActionTypes.LOAD_PRODUCT_GROUPS_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class LoadReset implements Action {
  readonly type = OrderPaymentConfigActionTypes.LOAD_RESET;
}

export class SaveOderPaymentConfig implements Action {
  readonly type =
    OrderPaymentConfigActionTypes.SAVE_ORDER_PAYMENT_CONFIG_DETAILS;
  constructor(public payload: SaveOrderPaymentsPayload) {}
}

export class SaveOderPaymentConfigSuccess implements Action {
  readonly type =
    OrderPaymentConfigActionTypes.SAVE_ORDER_PAYMENT_CONFIG_DETAILS_SUCCESS;
  constructor(public payload: string) {}
}
export class SaveOderPaymentConfigFailure implements Action {
  readonly type =
    OrderPaymentConfigActionTypes.SAVE_ORDER_PAYMENT_CONFIG_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class UpdateOrderPaymentConfig implements Action {
  readonly type = OrderPaymentConfigActionTypes.UPADTE_ORDER_PAYMENT_CONFIG;
  constructor(public payload: UpdateOrderPaymentConfigPayload) {}
}

export class UpdateOrderPaymentConfigSuccess implements Action {
  readonly type =
    OrderPaymentConfigActionTypes.UPADTE_ORDER_PAYMENT_CONFIG_SUCCESS;
  constructor(public payload: any) {}
}
export class UpdateOrderPaymentConfigFailure implements Action {
  readonly type =
    OrderPaymentConfigActionTypes.UPADTE_ORDER_PAYMENT_CONFIG_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class RemoveOrderPaymentConfig implements Action {
  readonly type = OrderPaymentConfigActionTypes.REMOVE_ORDER_PAYMENT_CONFIG;
  constructor(public payload: UpdateOrderPaymentConfigPayload) {}
}
export class RemoveOrderPaymentConfigSuccess implements Action {
  readonly type =
    OrderPaymentConfigActionTypes.REMOVE_ORDER_PAYMENT_CONFIG_SUCCESS;
  constructor(public payload: any) {}
}
export class RemoveOrderPaymentConfigFailure implements Action {
  readonly type =
    OrderPaymentConfigActionTypes.REMOVE_ORDER_PAYMENT_CONFIG_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadOrderConfigByConfigId implements Action {
  readonly type = OrderPaymentConfigActionTypes.LOAD_ORDER_PAYMENT_BY_CONFIG_ID;
  constructor(public payload: OrderPayementRulesRequest) {}
}

export class LoadOrderConfigByConfigIdSuccess implements Action {
  readonly type =
    OrderPaymentConfigActionTypes.LOAD_ORDER_PAYMENT_BY_CONFIG_ID_SUCCESS;
  constructor(public payload: OrderpyamentRulesResponse) {}
}
export class LoadOrderConfigByConfigIdFailure implements Action {
  readonly type =
    OrderPaymentConfigActionTypes.LOAD_ORDER_PAYMENT_BY_CONFIG_ID_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class LoadAllConfigRules implements Action {
  readonly type = OrderPaymentConfigActionTypes.LOAD_ALL_CONFIG_RULES;
  constructor(public payload: OrderPayementRulesRequest) {}
}

export class LoadAllConfigRulesSuccess implements Action {
  readonly type = OrderPaymentConfigActionTypes.LOAD_ALL_CONFIG_RULES_SUCCESS;
  constructor(public payload: OrderpyamentRulesResponse) {}
}
export class LoadAllConfigRulesFailure implements Action {
  readonly type = OrderPaymentConfigActionTypes.LOAD_ALL_CONFIG_RULES_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class UniqueConfigurationNameCheck implements Action {
  readonly type =
  OrderPaymentConfigActionTypes.ORDER_PAYMENT_CONFIG_UNIQUE_NAME_CHECK;
  constructor(public payload: string) {}
}
export class UniqueConfigurationNameCheckSuccess implements Action {
  readonly type =
  OrderPaymentConfigActionTypes.ORDER_PAYMENT_CONFIG_UNIQUE_NAME_CHECK_SUCCESS;
  constructor(public payload: number) {}
}
export class UniqueConfigurationNameCheckFailure implements Action {
  readonly type =
  OrderPaymentConfigActionTypes.ORDER_PAYMENT_CONFIG_UNIQUE_NAME_CHECK_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export type OrderPaymentsConfigActions =
  | LoadOrderPaymentsConfigList
  | LoadOrderPaymentsConfigListSuccess
  | LoadOrderPaymentsConfigListFailure
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
  | UpdateOrderPaymentConfig
  | UpdateOrderPaymentConfigSuccess
  | UpdateOrderPaymentConfigFailure
  | RemoveOrderPaymentConfig
  | RemoveOrderPaymentConfigSuccess
  | RemoveOrderPaymentConfigFailure
  | LoadOrderConfigByConfigId
  | LoadOrderConfigByConfigIdSuccess
  | LoadOrderConfigByConfigIdFailure
  | LoadAllConfigRules
  | LoadAllConfigRulesSuccess
  | LoadAllConfigRulesFailure
  | LoadReset
  | UniqueConfigurationNameCheck
  | UniqueConfigurationNameCheckSuccess
  | UniqueConfigurationNameCheckFailure;
