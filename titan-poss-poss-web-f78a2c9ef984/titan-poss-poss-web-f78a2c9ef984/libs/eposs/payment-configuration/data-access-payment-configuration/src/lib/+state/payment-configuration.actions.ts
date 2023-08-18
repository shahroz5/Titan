import { Action } from '@ngrx/store';
import {
  CustomErrors,
  PaymentConfigurationList,
  PaymentConfigurationListPayLoad,
  PaymentConfiguration,
  UpdatePaymentConfigurationPayload,
  SavePaymentConfigurationPayload,
  UpdatePaymentConfigurationDetailsPayload,
  LoadSelectedConfigById,
  SelectedOptionsData,
  MappedCount
} from '@poss-web/shared/models';

export enum PaymentConfigurationActionTypes {
  LOAD_PAYMENT_CONFIGURATION_LIST = '[payment-confguration] Load Payment Configuration List',
  LOAD_PAYMENT_CONFIGURATION_LIST_SUCCESS = '[payment-configuration] Load Payment Configuration List Success',
  LOAD_PAYMENT_CONFIGURATION_LIST_FAILURE = '[payment-configuration]Load Payment Configuration List Failure',

  SEARCH_PAYMENT_CONFIGURATION_LIST = '[payment-configuration] Search Payment Configuration List ',
  SEARCH_PAYMENT_CONFIGURATION_LIST_SUCCESS = '[payment-configuration] Search Payment Configuration List Success ',
  SEARCH_PAYMENT_CONFIGURATION_LIST_FAILURE = '[payment-configuration] Search Payment Configuration List Failure',

  CHECK_UNIQUE_PAYMENT_NAME = '[payment-configuration]  Check Unique Payment Name ',
  CHECK_UNIQUE_PAYMENT_NAME_SUCCESS = '[payment-configuration] Check Unique Payment Name Success',
  CHECK_UNIQUE_PAYMENT_NAME_FAILURE = '[payment-configuration]  Check Unique Payment Name  Failure',

  LOAD_PAYMENT_MODES_AND_TRANSACTION_TYPES = '[payment-configuration]  Load Payment Modes and Transaction Types ',
  LOAD_PAYMENT_MODES_AND_TRANSACTION_TYPES_SUCCESS = '[payment-configuration]   Load Payment Modes and Transaction Types Success',
  LOAD_PAYMENT_MODES_AND_TRANSACTION_TYPES_FAILURE = '[payment-configuration]  Load Payment Modes and Transaction Types Failure',

  SAVE_PAYMENT_CONFIGURATION = '[payment-configuration]  Save Payment Configuration',
  SAVE_PAYMENT_CONFIGURATION_SUCCESS = '[payment-configuration] Save Payment Configuration Success',
  SAVE_PAYMENT_CONFIGURATION_FAILURE = '[payment-configuration] Save Payment Configuration Failure',

  UPADTE_PAYMENT_CONFIGURATION = '[payment-configuration]  Update Payment Configuration',
  UPADTE_PAYMENT_CONFIGURATION_SUCCESS = '[payment-configuration] Update Payment Configuration Success',
  UPADTE_PAYMENT_CONFIGURATION_FAILURE = '[payment-configuration] Updated Payment Configuration Failure',

  LOAD_PAYMENT_CONFIGURATION_BY_CONFIG_ID = '[payment-configuration]  Load Payment Configuration By Config id',
  LOAD_PAYMENT_CONFIGURATION_BY_CONFIG_ID_SUCCESS = '[payment-configuration]  Load Payment Configuration By Config id Success',
  LOAD_PAYMENT_CONFIGURATION_BY_CONFIG_ID_FAILURE = '[payment-configuration] Load Payment Configuration By Config id Failure',

  LOAD_MAPPED_COUNT = '[payment-configuration] Load Mapped Count',
  LOAD_MAPPED_COUNT_SUCCESS = '[payment-configuration] Load Mapped Count Success',
  LOAD_MAPPED_COUNT_FAILURE = '[payment-configuration] Load Mapped Count Failure',

  UPDATE_COUNT = '[payment-configuration] Update Count',

  LOAD_SELECTED_PAYMENT_CONFIGURATION_DETAILS_BY_CONFIG_ID = '[payment-configuration]  Load Selected Payment Configuration Details By Config id',
  LOAD_SELECTED_PAYMENT_CONFIGURATION_DETAILS_BY_CONFIG_ID_SUCCESS = '[payment-configuration]  Load Selected Payment Configuration Details By Config id Success',
  LOAD_SELECTED_PAYMENT_CONFIGURATION_DETAILS_BY_CONFIG_ID_FAILURE = '[payment-configuration] Load Selected Payment Configuration Details By Config id Failure',

  UPDATE_SELECTED_PAYMENT_CONFIGURATION_DETAILS_BY_CONFIG_ID = '[payment-configuration]  Update Selected Payment Configuration Details By Config id',
  UPDATE_SELECTED_PAYMENT_CONFIGURATION_DETAILS_BY_CONFIG_ID_SUCCESS = '[payment-configuration]  Update Selected Payment Configuration Details By Config id Success',
  UPDATE_SELECTED_PAYMENT_CONFIGURATION_DETAILS_BY_CONFIG_ID_FAILURE = '[payment-configuration] Update  Selected Payment Configuration Details By Config id Failure',

  LOAD_RESET = '[payment-configuration] Load Reset',

  LOAD_PAYMENT_MODE_COUNT = '[payment-configuration] Load Payment Mode Count',
  LOAD_PAYMENT_MODE_COUNT_SUCCESS = '[payment-configuration] Load Payment Mode Count Success',
  LOAD_PAYMENT_MODE_COUNT_FAILURE = '[payment-configuration] Load Payment Mode Count Failure',

  LOAD_TCS_PAYMENT_MODE = '[payment-configuration] Load TCS Payment Mode',
  LOAD_TCS_PAYMENT_MODE_SUCCESS = '[payment-configuration] Load TCS Payment Mode Success',
  LOAD_TCS_PAYMENT_MODE_FAILURE = '[payment-configuration] Load TCS Payment Mode Failure'
}

export class LoadTCSPaymentMode implements Action {
  readonly type = PaymentConfigurationActionTypes.LOAD_TCS_PAYMENT_MODE;
  constructor(public payload: string) {}
}

export class LoadTCSPaymentModeSuccess implements Action {
  readonly type = PaymentConfigurationActionTypes.LOAD_TCS_PAYMENT_MODE_SUCCESS;
  constructor(public payload: any) {}
}
export class LoadTCSPaymentModeFailure implements Action {
  readonly type = PaymentConfigurationActionTypes.LOAD_TCS_PAYMENT_MODE_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadPaymentModeCount implements Action {
  readonly type = PaymentConfigurationActionTypes.LOAD_PAYMENT_MODE_COUNT;
}

export class LoadPaymentModeCountSuccess implements Action {
  readonly type =
    PaymentConfigurationActionTypes.LOAD_PAYMENT_MODE_COUNT_SUCCESS;
  constructor(public payload: number) {}
}
export class LoadPaymentModeCountFailure implements Action {
  readonly type =
    PaymentConfigurationActionTypes.LOAD_PAYMENT_MODE_COUNT_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class LoadPaymentConfigurationList implements Action {
  readonly type =
    PaymentConfigurationActionTypes.LOAD_PAYMENT_CONFIGURATION_LIST;
  constructor(public payload: PaymentConfigurationListPayLoad) {}
}
export class LoadPaymentConfigurationListSuccess implements Action {
  readonly type =
    PaymentConfigurationActionTypes.LOAD_PAYMENT_CONFIGURATION_LIST_SUCCESS;
  constructor(public payload: PaymentConfigurationList) {}
}
export class LoadPaymentConfigurationListFailure implements Action {
  readonly type =
    PaymentConfigurationActionTypes.LOAD_PAYMENT_CONFIGURATION_LIST_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SearchPaymentConfigurationList implements Action {
  readonly type =
    PaymentConfigurationActionTypes.SEARCH_PAYMENT_CONFIGURATION_LIST;
  constructor(public payload: string) {}
}
export class SearchPaymentConfigurationListSuccess implements Action {
  readonly type =
    PaymentConfigurationActionTypes.SEARCH_PAYMENT_CONFIGURATION_LIST_SUCCESS;
  constructor(public payload: PaymentConfigurationList) {}
}
export class SearchPaymentConfigurationListFailure implements Action {
  readonly type =
    PaymentConfigurationActionTypes.SEARCH_PAYMENT_CONFIGURATION_LIST_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class CheckUniquePaymentName implements Action {
  readonly type = PaymentConfigurationActionTypes.CHECK_UNIQUE_PAYMENT_NAME;
  constructor(public payload: string) {}
}
export class CheckUniquePaymentNameSuccess implements Action {
  readonly type =
    PaymentConfigurationActionTypes.CHECK_UNIQUE_PAYMENT_NAME_SUCCESS;
  constructor(public payload: PaymentConfigurationList) {}
}
export class CheckUniquePaymentNameFailure implements Action {
  readonly type =
    PaymentConfigurationActionTypes.CHECK_UNIQUE_PAYMENT_NAME_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadPaymentModesandTransactionTypes implements Action {
  readonly type =
    PaymentConfigurationActionTypes.LOAD_PAYMENT_MODES_AND_TRANSACTION_TYPES;
  constructor(public payload: any) {}
}
export class LoadPaymentModesandTransactionTypesSuccess implements Action {
  readonly type =
    PaymentConfigurationActionTypes.LOAD_PAYMENT_MODES_AND_TRANSACTION_TYPES_SUCCESS;
  constructor(public payload: any) {}
}
export class LoadPaymentModesandTransactionTypesFailure implements Action {
  readonly type =
    PaymentConfigurationActionTypes.LOAD_PAYMENT_MODES_AND_TRANSACTION_TYPES_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SavePaymentConfiguration implements Action {
  readonly type = PaymentConfigurationActionTypes.SAVE_PAYMENT_CONFIGURATION;
  constructor(public payload: SavePaymentConfigurationPayload) {}
}
export class SavePaymentConfigurationSuccess implements Action {
  readonly type =
    PaymentConfigurationActionTypes.SAVE_PAYMENT_CONFIGURATION_SUCCESS;
  constructor(public payload: string) {}
}
export class SavePaymentConfigurationSuccessFailure implements Action {
  readonly type =
    PaymentConfigurationActionTypes.SAVE_PAYMENT_CONFIGURATION_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class UpdatePaymentConfiguration implements Action {
  readonly type = PaymentConfigurationActionTypes.UPADTE_PAYMENT_CONFIGURATION;
  constructor(public payload: UpdatePaymentConfigurationPayload) {}
}
export class UpdatePaymentConfigurationSuccess implements Action {
  readonly type =
    PaymentConfigurationActionTypes.UPADTE_PAYMENT_CONFIGURATION_SUCCESS;
}
export class UpdatePaymentConfigurationFailure implements Action {
  readonly type =
    PaymentConfigurationActionTypes.UPADTE_PAYMENT_CONFIGURATION_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class LoadPaymentConfigurationByConfigId implements Action {
  readonly type =
    PaymentConfigurationActionTypes.LOAD_PAYMENT_CONFIGURATION_BY_CONFIG_ID;
  constructor(public payload: string) {}
}
export class LoadPaymentConfigurationByConfigIdSuccess implements Action {
  readonly type =
    PaymentConfigurationActionTypes.LOAD_PAYMENT_CONFIGURATION_BY_CONFIG_ID_SUCCESS;
  constructor(public payload: PaymentConfiguration) {}
}
export class LoadPaymentConfigurationByConfigIdFailure implements Action {
  readonly type =
    PaymentConfigurationActionTypes.LOAD_PAYMENT_CONFIGURATION_BY_CONFIG_ID_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadMappedCount implements Action {
  readonly type = PaymentConfigurationActionTypes.LOAD_MAPPED_COUNT;
  constructor(public payload: string) {}
}

export class LoadMappedCountSuccess implements Action {
  readonly type = PaymentConfigurationActionTypes.LOAD_MAPPED_COUNT_SUCCESS;
  constructor(public payload: MappedCount[]) {}
}

export class LoadMappedCountFailure implements Action {
  readonly type = PaymentConfigurationActionTypes.LOAD_MAPPED_COUNT_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class UpdateCount implements Action {
  readonly type = PaymentConfigurationActionTypes.UPDATE_COUNT;
  constructor(public payload: { count: number; id: string }) {}
}

export class LoadSelectedPaymentConfigurationDetailsByConfigId
  implements Action {
  readonly type =
    PaymentConfigurationActionTypes.LOAD_SELECTED_PAYMENT_CONFIGURATION_DETAILS_BY_CONFIG_ID;
  constructor(public payload: LoadSelectedConfigById) {}
}
export class LoadSelectedPaymentConfigurationDetailsByConfigIdSuccess
  implements Action {
  readonly type =
    PaymentConfigurationActionTypes.LOAD_SELECTED_PAYMENT_CONFIGURATION_DETAILS_BY_CONFIG_ID_SUCCESS;
  constructor(public payload: SelectedOptionsData) {}
}
export class LoadSelectedPaymentConfigurationDetailsByConfigIdFailure
  implements Action {
  readonly type =
    PaymentConfigurationActionTypes.LOAD_SELECTED_PAYMENT_CONFIGURATION_DETAILS_BY_CONFIG_ID_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class UpdateSelectedPaymentConfigurationDetailsByConfigId
  implements Action {
  readonly type =
    PaymentConfigurationActionTypes.UPDATE_SELECTED_PAYMENT_CONFIGURATION_DETAILS_BY_CONFIG_ID;
  constructor(public payload: UpdatePaymentConfigurationDetailsPayload) {}
}
export class UpdateSelectedPaymentConfigurationDetailsByConfigIdSuccess
  implements Action {
  readonly type =
    PaymentConfigurationActionTypes.UPDATE_SELECTED_PAYMENT_CONFIGURATION_DETAILS_BY_CONFIG_ID_SUCCESS;
}
export class UpdateSelectedPaymentConfigurationDetailsByConfigIdFailure
  implements Action {
  readonly type =
    PaymentConfigurationActionTypes.UPDATE_SELECTED_PAYMENT_CONFIGURATION_DETAILS_BY_CONFIG_ID_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadReset implements Action {
  readonly type = PaymentConfigurationActionTypes.LOAD_RESET;
}

export type PaymentConfigurationAction =
  | LoadPaymentConfigurationList
  | LoadPaymentConfigurationListSuccess
  | LoadPaymentConfigurationListFailure
  | SearchPaymentConfigurationList
  | SearchPaymentConfigurationListSuccess
  | SearchPaymentConfigurationListFailure
  | CheckUniquePaymentName
  | CheckUniquePaymentNameSuccess
  | CheckUniquePaymentNameFailure
  | SavePaymentConfiguration
  | SavePaymentConfigurationSuccess
  | SavePaymentConfigurationSuccessFailure
  | UpdatePaymentConfiguration
  | UpdatePaymentConfigurationSuccess
  | UpdatePaymentConfigurationFailure
  | LoadPaymentConfigurationByConfigId
  | LoadPaymentConfigurationByConfigIdSuccess
  | LoadPaymentConfigurationByConfigIdFailure
  | LoadMappedCount
  | LoadMappedCountSuccess
  | LoadMappedCountFailure
  | LoadSelectedPaymentConfigurationDetailsByConfigId
  | LoadSelectedPaymentConfigurationDetailsByConfigIdSuccess
  | LoadSelectedPaymentConfigurationDetailsByConfigIdFailure
  | UpdateSelectedPaymentConfigurationDetailsByConfigId
  | UpdateSelectedPaymentConfigurationDetailsByConfigIdSuccess
  | UpdateSelectedPaymentConfigurationDetailsByConfigIdFailure
  | LoadPaymentModesandTransactionTypes
  | LoadPaymentModesandTransactionTypesSuccess
  | LoadPaymentModesandTransactionTypesFailure
  | UpdateCount
  | LoadPaymentModeCount
  | LoadPaymentModeCountSuccess
  | LoadPaymentModeCountFailure
  | LoadTCSPaymentMode
  | LoadTCSPaymentModeFailure
  | LoadTCSPaymentModeSuccess
  | LoadReset;
