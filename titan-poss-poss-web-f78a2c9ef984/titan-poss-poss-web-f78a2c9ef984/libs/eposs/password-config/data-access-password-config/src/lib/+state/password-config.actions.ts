import { Action } from '@ngrx/store';
import {
  CustomErrors,
  LocationSummaryList,
  GenerateBoutiquePasswordForManualBillRequest,
  GenerateBoutiquePasswordForManualBillResponse,
  GenerateBoutiquePasswordForGoldRateRequest,
  GenerateBoutiquePasswordForGoldRateResponse,
  MetalRates,
  MetalRatesPayload,
  GenerateCashDepositPasswordResponse,
  GenerateCashDepositPasswordRequest,
  TransactionTypes
} from '@poss-web/shared/models';

export enum PasswordConfigActionTypes {
  GET_LOCATION_CODES = '[Password Config] Get Location Codes',
  GET_LOCATION_CODES_SUCCESS = '[Password Config] Get Location Codes Success',
  GET_LOCATION_CODES_FAILURE = '[Password Config] Get Location Codes Failure',

  GET_DOCUMENT_TYPES = '[Password Config] Get Document Types',
  GET_DOCUMENT_TYPES_SUCCESS = '[Password Config] Get Document Types Success',
  GET_DOCUMENT_TYPES_FAILURE = '[Password Config] Get Document Types Failure',

  GET_MATERIAL_PRICES = '[Password Config] Get Material Prices',
  GET_MATERIAL_PRICES_SUCCESS = '[Password Config] Get Material Prices Success',
  GET_MATERIAL_PRICES_FAILURE = '[Password Config] Get Material Prices Failure',

  GENERATE_BOUTIQUE_PASSWORD_FOR_MANUAL_BILL = '[Password Config] Generate Boutique Password for manual bill',
  GENERATE_BOUTIQUE_PASSWORD_FOR_MANUAL_BILL_SUCCESS = '[Password Config] Generate Boutique Password for manual bill Success',
  GENERATE_BOUTIQUE_PASSWORD_FOR_MANUAL_BILL_FAILURE = '[Password Config] Generate Boutique Password for manual bill Failure',

  GENERATE_BOUTIQUE_PASSWORD_FOR_GOLD_RATE = '[Password Config] Generate Boutique Password for gold rate',
  GENERATE_BOUTIQUE_PASSWORD_FOR_GOLD_RATE_SUCCESS = '[Password Config] Generate Boutique Password for gold rate Success',
  GENERATE_BOUTIQUE_PASSWORD_FOR_GOLD_RATE_FAILURE = '[Password Config] Generate Boutique Password for gold rate Failure',

  GENERATE_CASH_DEPOSIT_PASSWORD = '[Password Config] Generate Cash Deposit Password',
  GENERATE_CASH_DEPOSIT_PASSWORD_SUCCESS = '[Password Config] Generate Cash Deposit Password Success',
  GENERATE_CASH_DEPOSIT_PASSWORD_FAILURE = '[Password Config] Generate Cash Deposit Password Failure',

  RESET_VALUES = '[Password Config] Reset Values',
  RESET_PASSWORD_VALUES = '[Password Config] Reset Password Values'
}

export class GetLocationCodes implements Action {
  readonly type = PasswordConfigActionTypes.GET_LOCATION_CODES;
}

export class GetLocationCodesSuccess implements Action {
  readonly type = PasswordConfigActionTypes.GET_LOCATION_CODES_SUCCESS;
  constructor(public payload: LocationSummaryList[]) {}
}

export class GetLocationCodesFailure implements Action {
  readonly type = PasswordConfigActionTypes.GET_LOCATION_CODES_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class GetMaterialPrices implements Action {
  readonly type = PasswordConfigActionTypes.GET_MATERIAL_PRICES;
  constructor(public payload: MetalRatesPayload) {}
}

export class GetMaterialPricesSuccess implements Action {
  readonly type = PasswordConfigActionTypes.GET_MATERIAL_PRICES_SUCCESS;
  constructor(public payload: MetalRates[]) {}
}

export class GetMaterialPricesFailure implements Action {
  readonly type = PasswordConfigActionTypes.GET_MATERIAL_PRICES_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class GetDocumentTypes implements Action {
  readonly type = PasswordConfigActionTypes.GET_DOCUMENT_TYPES;
  constructor(public payload: string) {}
}

export class GetDocumentTypesSuccess implements Action {
  readonly type = PasswordConfigActionTypes.GET_DOCUMENT_TYPES_SUCCESS;
  constructor(public payload: TransactionTypes[]) {}
}

export class GetDocumentTypesFailure implements Action {
  readonly type = PasswordConfigActionTypes.GET_DOCUMENT_TYPES_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class GenerateBoutiquePasswordForManualBill implements Action {
  readonly type =
    PasswordConfigActionTypes.GENERATE_BOUTIQUE_PASSWORD_FOR_MANUAL_BILL;
  constructor(public payload: GenerateBoutiquePasswordForManualBillRequest) {}
}

export class GenerateBoutiquePasswordForManualBillSuccess implements Action {
  readonly type =
    PasswordConfigActionTypes.GENERATE_BOUTIQUE_PASSWORD_FOR_MANUAL_BILL_SUCCESS;
  constructor(public payload: GenerateBoutiquePasswordForManualBillResponse) {}
}

export class GenerateBoutiquePasswordForManualBillFailure implements Action {
  readonly type =
    PasswordConfigActionTypes.GENERATE_BOUTIQUE_PASSWORD_FOR_MANUAL_BILL_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class GenerateBoutiquePasswordForGoldRate implements Action {
  readonly type =
    PasswordConfigActionTypes.GENERATE_BOUTIQUE_PASSWORD_FOR_GOLD_RATE;
  constructor(public payload: GenerateBoutiquePasswordForGoldRateRequest) {}
}

export class GenerateBoutiquePasswordForGoldRateSuccess implements Action {
  readonly type =
    PasswordConfigActionTypes.GENERATE_BOUTIQUE_PASSWORD_FOR_GOLD_RATE_SUCCESS;
  constructor(public payload: GenerateBoutiquePasswordForGoldRateResponse) {}
}

export class GenerateBoutiquePasswordForGoldRateFailure implements Action {
  readonly type =
    PasswordConfigActionTypes.GENERATE_BOUTIQUE_PASSWORD_FOR_GOLD_RATE_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class GenerateCashDepositPassword implements Action {
  readonly type = PasswordConfigActionTypes.GENERATE_CASH_DEPOSIT_PASSWORD;
  constructor(public payload: GenerateCashDepositPasswordRequest) {}
}

export class GenerateCashDepositPasswordSuccess implements Action {
  readonly type =
    PasswordConfigActionTypes.GENERATE_CASH_DEPOSIT_PASSWORD_SUCCESS;
  constructor(public payload: GenerateCashDepositPasswordResponse) {}
}

export class GenerateCashDepositPasswordFailure implements Action {
  readonly type =
    PasswordConfigActionTypes.GENERATE_CASH_DEPOSIT_PASSWORD_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class ResetValues implements Action {
  readonly type = PasswordConfigActionTypes.RESET_VALUES;
}

export class ResetPasswordValues implements Action {
  readonly type = PasswordConfigActionTypes.RESET_PASSWORD_VALUES;
}

export type PasswordConfigActions =
  | GetLocationCodes
  | GetLocationCodesSuccess
  | GetLocationCodesFailure
  | GetDocumentTypes
  | GetDocumentTypesSuccess
  | GetDocumentTypesFailure
  | GetMaterialPrices
  | GetMaterialPricesSuccess
  | GetMaterialPricesFailure
  | GenerateBoutiquePasswordForManualBill
  | GenerateBoutiquePasswordForManualBillSuccess
  | GenerateBoutiquePasswordForManualBillFailure
  | GenerateBoutiquePasswordForGoldRate
  | GenerateBoutiquePasswordForGoldRateSuccess
  | GenerateBoutiquePasswordForGoldRateFailure
  | GenerateCashDepositPassword
  | GenerateCashDepositPasswordSuccess
  | GenerateCashDepositPasswordFailure
  | ResetValues
  | ResetPasswordValues;
