import { Action } from '@ngrx/store';
import {
  PayerBankConfigListingPayload,
  PayerBankConfigListingSuccessPaylod,
  CustomErrors,
  ToggleButtonPayload,
  SavePayerBankConfigDetailsPayload,
  UpdatePayerBankConfigPayload,
  PayerBankConfigDetails,
  PaymentModeResponse,
  PayerBankMaster,
  PayerBankConfiguration,
  PayerBanksResponse
} from '@poss-web/shared/models';
export enum PayerBankConfigActionTypes {
  LOAD_PAYER_BANK_CONFIGURATIONS = '[payer-bank-config] Load Payer Bank Configurations',
  LOAD_PAYER_BANK_CONFIGURATIONS_SUCCESS = '[payer-bank-config] Load Payer Bank Configurations Success',
  LOAD_PAYER_BANK_DETAILS_FAILURE = '[payer-bank-config] Load Payer Bank Configurations Failure',

  SAVE_PAYER_BANK_CONFIG_DETAILS = '[payer-bank-config] Save Payer Bank Config Details',
  SAVE_PAYER_BANK_CONFIG_DETAILS_SUCCESS = '[payer-bank-config] Save Payer Bank Config Details Success',
  SAVE_PAYER_BANK_CONFIG_DETAILS_FAILURE = '[payer-bank-config] Save Payer Bank Config Details Failure',

  PAYER_BANK_CONFIG_DETAILS_BY_CONFIGNAME = '[payer-bank-config] Payer Bank Details By ConfigName',
  PAYER_BANK_CONFIG_DETAILS_BY_CONFIGNAME_SUCCESS = '[payer-bank-config] Payer Bank Details By ConfigName Success',
  PAYER_BANK_CONFIG_DETAILS_BY_CONFIGNAME_FAILURE = '[payer-bank-config] Payer Bank Details By ConfigName Failure',

  UPDATE_PAYER_BANK_CONFIG_DETAILS = '[payer-bank-config] Update Payer Bank Config Details',
  UPDATE_PAYER_BANK_CONFIG_DETAILS_SUCCESS = '[payer-bank-config] Update Payer Bank Config Details Success',
  UPDATE_PAYER_BANK_CONFIG_DETAILS_FAILURE = '[payer-bank-config] Update Payer Bank Config Details Failure',

  SEARCH_CONFIG_NAME = '[payer-bank-config] Search Config Name',
  SEARCH_CONFIG_NAME_SUCCESS = '[payer-bank-config] Search Config Name Success',
  SEARCH_CONFIG_NAME_FAILURE = '[payer-bank-config] Search Config Name Failure',

  LOAD_PAYER_BANKS = '[payer-bank-config] Load Payer Banks',
  LOAD_PAYER_BANKS_SUCCESS = '[payer-bank-config] Load Payer Banks Success',
  LOAD_PAYER_BANKS_FAILURE = '[payer-bank-config] Load Payer Banks Failure',

  UPDATE_TOGGLE_BUTTON = '[payer-bank-config] Update Toggle button',
  UPDATE_TOGGLE_BUTTON_SUCCESS = '[payer-bank-config] Update Toggle button Success',
  UPDATE_TOGGLE_BUTTON_FAILURE = '[payer-bank-config] Update Toggle button Failure',

  RESET_PAYER_BANK_CONFIG_DETAILS = '[payer-bank-config] Reset Payer Bank Config Details',
  LOAD_PAYMENT_MODES = '[payer-bank-config] Load Payment Modes',
  LOAD_PAYMENT_MODES_SUCCESS = '[payer-bank-config] Load Payment Modes Success',
  LOAD_PAYMENT_MODES_FAILURE = '[payer-bank-config] Load Payment Modes Failure',

  SEARCH_PAYER_BANK = '[payer-bank-config]Search Payer Bank',
  SEARCH_PAYER_BANK_SUCCESS = '[payer-bank-config]Search Payer Bank Success',
  SEARCH_PAYER_BANK_FAILURE = '[payer-bank-config]Search Payer Bank Failure'
}

export class LoadPayerBankConfigurations implements Action {
  readonly type = PayerBankConfigActionTypes.LOAD_PAYER_BANK_CONFIGURATIONS;
  constructor(public payload: PayerBankConfigListingPayload) {}
}
export class LoadPayerBankConfigurationsSuccess implements Action {
  readonly type =
    PayerBankConfigActionTypes.LOAD_PAYER_BANK_CONFIGURATIONS_SUCCESS;
  constructor(public payload: PayerBankConfigListingSuccessPaylod) {}
}
export class LoadPayerBankConfigurationsFailure implements Action {
  readonly type = PayerBankConfigActionTypes.LOAD_PAYER_BANK_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class SavePayerBankConfigDetails implements Action {
  readonly type = PayerBankConfigActionTypes.SAVE_PAYER_BANK_CONFIG_DETAILS;
  constructor(public payload: SavePayerBankConfigDetailsPayload) {}
}
export class SavePayerBankConfigDetailsSuccess implements Action {
  readonly type =
    PayerBankConfigActionTypes.SAVE_PAYER_BANK_CONFIG_DETAILS_SUCCESS;
  constructor(public payload: string) {}
}
export class SavePayerBankConfigDetailsFailure implements Action {
  readonly type =
    PayerBankConfigActionTypes.SAVE_PAYER_BANK_CONFIG_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class PayerBankDetailsByConfigName implements Action {
  readonly type =
    PayerBankConfigActionTypes.PAYER_BANK_CONFIG_DETAILS_BY_CONFIGNAME;
  constructor(public payload: string) {}
}
export class PayerBankDetailsByConfigNameSuccess implements Action {
  readonly type =
    PayerBankConfigActionTypes.PAYER_BANK_CONFIG_DETAILS_BY_CONFIGNAME_SUCCESS;
  constructor(public payload: PayerBankConfigDetails) {}
}
export class PayerBankDetailsByConfigNameFailure implements Action {
  readonly type =
    PayerBankConfigActionTypes.PAYER_BANK_CONFIG_DETAILS_BY_CONFIGNAME_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class UpdatePayerBankConfigDetails implements Action {
  readonly type = PayerBankConfigActionTypes.UPDATE_PAYER_BANK_CONFIG_DETAILS;
  constructor(public payload: UpdatePayerBankConfigPayload) {}
}
export class UpdatePayerBankConfigDetailsSuccess implements Action {
  readonly type =
    PayerBankConfigActionTypes.UPDATE_PAYER_BANK_CONFIG_DETAILS_SUCCESS;
}
export class UpdatePayerBankConfigDetailsFailure implements Action {
  readonly type =
    PayerBankConfigActionTypes.UPDATE_PAYER_BANK_CONFIG_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class SearchConfigName implements Action {
  readonly type = PayerBankConfigActionTypes.SEARCH_CONFIG_NAME;
  constructor(public payload: string) {}
}
export class SearchConfigNameSuccess implements Action {
  readonly type = PayerBankConfigActionTypes.SEARCH_CONFIG_NAME_SUCCESS;
  constructor(public payload: PayerBankConfiguration[]) {}
}
export class SearchConfigNameFailure implements Action {
  readonly type = PayerBankConfigActionTypes.SEARCH_CONFIG_NAME_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class LoadPayerBanks implements Action {
  readonly type = PayerBankConfigActionTypes.LOAD_PAYER_BANKS;
  constructor(public payload: PayerBankConfigListingPayload) {}
}
export class LoadPayerBanksSuccess implements Action {
  readonly type = PayerBankConfigActionTypes.LOAD_PAYER_BANKS_SUCCESS;
  constructor(public payload: PayerBanksResponse) {}
}
export class LoadPayerBanksFailure implements Action {
  readonly type = PayerBankConfigActionTypes.LOAD_PAYER_BANKS_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class UpdateToggleButton implements Action {
  readonly type = PayerBankConfigActionTypes.UPDATE_TOGGLE_BUTTON;
  constructor(public payload: ToggleButtonPayload) {}
}
export class UpdateToggleButtonSuccess implements Action {
  readonly type = PayerBankConfigActionTypes.UPDATE_TOGGLE_BUTTON_SUCCESS;
}
export class UpdateToggleButtonFailure implements Action {
  readonly type = PayerBankConfigActionTypes.UPDATE_TOGGLE_BUTTON_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class ResetPayerBankConfigDetails implements Action {
  readonly type = PayerBankConfigActionTypes.RESET_PAYER_BANK_CONFIG_DETAILS;
}
export class LoadPaymentModes implements Action {
  readonly type = PayerBankConfigActionTypes.LOAD_PAYMENT_MODES;
}
export class LoadPaymentModesSuccess implements Action {
  readonly type = PayerBankConfigActionTypes.LOAD_PAYMENT_MODES_SUCCESS;
  constructor(public payload: PaymentModeResponse[]) {}
}
export class LoadPaymentModesFailure implements Action {
  readonly type = PayerBankConfigActionTypes.LOAD_PAYMENT_MODES_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class SearchPayerBank implements Action {
  readonly type = PayerBankConfigActionTypes.SEARCH_PAYER_BANK;
  constructor(public payload: string) {}
}
export class SearchPayerBankSuccess implements Action {
  readonly type = PayerBankConfigActionTypes.SEARCH_PAYER_BANK_SUCCESS;
  constructor(public payload: PayerBankMaster[]) {}
}
export class SearchPayerBankFailure implements Action {
  readonly type = PayerBankConfigActionTypes.SEARCH_PAYER_BANK_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export type PayerBankConfigActions =
  | LoadPayerBankConfigurations
  | LoadPayerBankConfigurationsSuccess
  | LoadPayerBankConfigurationsFailure
  | SavePayerBankConfigDetails
  | SavePayerBankConfigDetailsSuccess
  | SavePayerBankConfigDetailsFailure
  | PayerBankDetailsByConfigName
  | PayerBankDetailsByConfigNameSuccess
  | PayerBankDetailsByConfigNameFailure
  | UpdatePayerBankConfigDetails
  | UpdatePayerBankConfigDetailsSuccess
  | UpdatePayerBankConfigDetailsFailure
  | SearchConfigName
  | SearchConfigNameSuccess
  | SearchConfigNameFailure
  | LoadPayerBanks
  | LoadPayerBanksSuccess
  | LoadPayerBanksFailure
  | UpdateToggleButton
  | UpdateToggleButtonSuccess
  | UpdateToggleButtonFailure
  | ResetPayerBankConfigDetails
  | LoadPaymentModes
  | LoadPaymentModesSuccess
  | LoadPaymentModesFailure
  | SearchPayerBank
  | SearchPayerBankSuccess
  | SearchPayerBankFailure;
