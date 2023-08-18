import {
  CustomerTransactionConfigListPayload,
  CustomerTransactionConfigListResponse,
  CustomErrors,
  CustomerTransactionConfig,
  UpdateStatus,
  CheckBoxHeader,
  SaveCustomerTranConfigDetails,
  CustomerConfigDetails
} from '@poss-web/shared/models';
import { Action } from '@ngrx/store';

export enum CustomerTransactionConfigActionTypes {
  LOAD_CUSTOMER_TRANSACTION_CONFIG_LIST = '[Customer-Transaction-config] Load Customer Transaction ConfigList',
  LOAD_CUSTOMER_TRANSACTION_CONFIG_LIST_SUCCESS = '[Customer-Transaction-config] Load Customer Transaction ConfigList Success',
  LOAD_CUSTOMER_TRANSACTION_CONFIG_LIST_FAILURE = '[Customer-Transaction-config] Load Customer Transaction ConfigList Failure',

  SEARCH_CONFIG_NAME = '[Customer-Transaction-config] Search Config Name',
  SEARCH_CONFIG_NAME_SUCCESS = '[Customer-Transaction-config] Search Config Name Success',
  SEARCH_CONFIG_NAME_FAILURE = '[Customer-Transaction-config] Search Config Name Failure',

  UPDATE_CONFIG_STATUS = '[Customer-Transaction-config] Update Config Status',
  UPDATE_CONFIG_STATUS_SUCCESS = '[Customer-Transaction-config] Update Config Status Success',
  UPDATE_CONFIG_STATUS_FAILURE = '[Customer-Transaction-config] Update Config Status Failure',

  LOAD_TRANSACTIONTYPES = '[Customer-Transaction-config] Load TransactionTypes',
  LOAD_TRANSACTIONTYPES_SUCCESS = '[Customer-Transaction-config] Load TransactionTypes Success',
  LOAD_TRANSACTIONTYPES_FAILURE = '[Customer-Transaction-config] Load TransactionTypes Failure',

  LOAD_CUSTOMERS = '[Customer-Transaction-config] Load Customers',
  LOAD_CUSTOMERS_SUCCESS = '[Customer-Transaction-config] Load Customers Success',
  LOAD_CUSTOMERS_FAILURE = '[Customer-Transaction-config] Load Customers Failure',

  SAVE_CUSTOMER_TRANSACTION_CONFIG_DETAILS = '[Customer-Transaction-config] Save Customer Transaction Config Details',
  SAVE_CUSTOMER_TRANSACTION_CONFIG_DETAILS_SUCCESS = '[Customer-Transaction-config] Save Customer Transaction Config Details Success',
  SAVE_CUSTOMER_TRANSACTION_CONFIG_DETAILS_FAILURE = '[Customer-Transaction-config] Save Customer Transaction Config Details Failure',

  UPDATE_CUSTOMER_TRANSACTION_CONFIG_DETAILS = '[Customer-Transaction-config] Update Customer Transaction Config Details',
  UPDATE_CUSTOMER_TRANSACTION_CONFIG_DETAILS_SUCCESS = '[Customer-Transaction-config] Update Customer Transaction Config Details Success',
  UPDATE_CUSTOMER_TRANSACTION_CONFIG_DETAILS_FAILURE = '[Customer-Transaction-config] Update Customer Transaction Config Details Failure',

  GET_CUSTOMER_TRANSACTION_CONFIG_DETAILS = '[Customer-Transaction-config] Get Customer Transaction Config Details',
  GET_CUSTOMER_TRANSACTION_CONFIG_DETAILS_SUCCESS = '[Customer-Transaction-config] Get Customer Transaction Config Details Success',
  GET_CUSTOMER_TRANSACTION_CONFIG_DETAILS_FAILURE = '[Customer-Transaction-config] Get Customer Transaction Config Details Failure',

  RESET_CUSTOMER_CONFIGS = '[Customer-Transaction-config] Reset Customer Configs'
}
export class LoadCustomerTransactionConfigList implements Action {
  readonly type =
    CustomerTransactionConfigActionTypes.LOAD_CUSTOMER_TRANSACTION_CONFIG_LIST;
  constructor(public payload: CustomerTransactionConfigListPayload) {}
}
export class LoadCustomerTransactionConfigListSuccess implements Action {
  readonly type =
    CustomerTransactionConfigActionTypes.LOAD_CUSTOMER_TRANSACTION_CONFIG_LIST_SUCCESS;
  constructor(public payload: CustomerTransactionConfigListResponse) {}
}
export class LoadCustomerTransactionConfigListFailure implements Action {
  readonly type =
    CustomerTransactionConfigActionTypes.LOAD_CUSTOMER_TRANSACTION_CONFIG_LIST_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class SearchConfigName implements Action {
  readonly type = CustomerTransactionConfigActionTypes.SEARCH_CONFIG_NAME;
  constructor(public payload: string) {}
}
export class SearchConfigNameSuccess implements Action {
  readonly type =
    CustomerTransactionConfigActionTypes.SEARCH_CONFIG_NAME_SUCCESS;
  constructor(public payload: CustomerTransactionConfig[]) {}
}
export class SearchConfigNameFailure implements Action {
  readonly type =
    CustomerTransactionConfigActionTypes.SEARCH_CONFIG_NAME_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class UpdateConfigStatus implements Action {
  readonly type = CustomerTransactionConfigActionTypes.UPDATE_CONFIG_STATUS;
  constructor(public payload: UpdateStatus) {}
}
export class UpdateConfigStatusSucceess implements Action {
  readonly type =
    CustomerTransactionConfigActionTypes.UPDATE_CONFIG_STATUS_SUCCESS;
}
export class UpdateConfigStatusFailure implements Action {
  readonly type =
    CustomerTransactionConfigActionTypes.UPDATE_CONFIG_STATUS_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class LoadTransactionTypes implements Action {
  readonly type = CustomerTransactionConfigActionTypes.LOAD_TRANSACTIONTYPES;
  constructor(public payload: string) {}
}
export class LoadTransactionTypesSuccess implements Action {
  readonly type =
    CustomerTransactionConfigActionTypes.LOAD_TRANSACTIONTYPES_SUCCESS;
  constructor(public payload: CheckBoxHeader[]) {}
}
export class LoadTransactionTypesFailure implements Action {
  readonly type =
    CustomerTransactionConfigActionTypes.LOAD_TRANSACTIONTYPES_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class LoadCustomers implements Action {
  readonly type = CustomerTransactionConfigActionTypes.LOAD_CUSTOMERS;
}
export class LoadCustomersSuccess implements Action {
  readonly type = CustomerTransactionConfigActionTypes.LOAD_CUSTOMERS_SUCCESS;
  constructor(public payload: CheckBoxHeader[]) {}
}
export class LoadCustomersFailure implements Action {
  readonly type = CustomerTransactionConfigActionTypes.LOAD_CUSTOMERS_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class SaveCustomerTransactionConfigDetails implements Action {
  readonly type =
    CustomerTransactionConfigActionTypes.SAVE_CUSTOMER_TRANSACTION_CONFIG_DETAILS;
  constructor(public payload: SaveCustomerTranConfigDetails) {}
}
export class SaveCustomerTransactionConfigDetailsSuccess implements Action {
  readonly type =
    CustomerTransactionConfigActionTypes.SAVE_CUSTOMER_TRANSACTION_CONFIG_DETAILS_SUCCESS;
  constructor(public payload: string) {}
}
export class SaveCustomerTransactionConfigDetailsFailure implements Action {
  readonly type =
    CustomerTransactionConfigActionTypes.SAVE_CUSTOMER_TRANSACTION_CONFIG_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class UpdateCustomerTransactionConfigDetails implements Action {
  readonly type =
    CustomerTransactionConfigActionTypes.UPDATE_CUSTOMER_TRANSACTION_CONFIG_DETAILS;
  constructor(public payload: SaveCustomerTranConfigDetails) {}
}
export class UpdateCustomerTransactionConfigDetailsSuccess implements Action {
  readonly type =
    CustomerTransactionConfigActionTypes.UPDATE_CUSTOMER_TRANSACTION_CONFIG_DETAILS_SUCCESS;
}
export class UpdateCustomerTransactionConfigDetailsFailure implements Action {
  readonly type =
    CustomerTransactionConfigActionTypes.UPDATE_CUSTOMER_TRANSACTION_CONFIG_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class GetCustomerTransactionConfigDetails implements Action {
  readonly type =
    CustomerTransactionConfigActionTypes.GET_CUSTOMER_TRANSACTION_CONFIG_DETAILS;
  constructor(public payload: string) {}
}
export class GetCustomerTransactionConfigDetailsSuccess implements Action {
  readonly type =
    CustomerTransactionConfigActionTypes.GET_CUSTOMER_TRANSACTION_CONFIG_DETAILS_SUCCESS;
  constructor(public payload: CustomerConfigDetails) {}
}
export class GetCustomerTransactionConfigDetailsFailure implements Action {
  readonly type =
    CustomerTransactionConfigActionTypes.GET_CUSTOMER_TRANSACTION_CONFIG_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class ResetCustomerConfigs implements Action {
  readonly type = CustomerTransactionConfigActionTypes.RESET_CUSTOMER_CONFIGS;
}

export type CustomerTransactionConfigActions =
  | LoadCustomerTransactionConfigList
  | LoadCustomerTransactionConfigListSuccess
  | LoadCustomerTransactionConfigListFailure
  | SearchConfigName
  | SearchConfigNameSuccess
  | SearchConfigNameFailure
  | UpdateConfigStatus
  | UpdateConfigStatusSucceess
  | UpdateConfigStatusFailure
  | LoadTransactionTypes
  | LoadTransactionTypesSuccess
  | LoadTransactionTypesFailure
  | LoadCustomers
  | LoadCustomersSuccess
  | LoadCustomersFailure
  | SaveCustomerTransactionConfigDetails
  | SaveCustomerTransactionConfigDetailsSuccess
  | SaveCustomerTransactionConfigDetailsFailure
  | UpdateCustomerTransactionConfigDetails
  | UpdateCustomerTransactionConfigDetailsSuccess
  | UpdateCustomerTransactionConfigDetailsFailure
  | GetCustomerTransactionConfigDetails
  | GetCustomerTransactionConfigDetailsSuccess
  | GetCustomerTransactionConfigDetailsFailure
  | ResetCustomerConfigs;
