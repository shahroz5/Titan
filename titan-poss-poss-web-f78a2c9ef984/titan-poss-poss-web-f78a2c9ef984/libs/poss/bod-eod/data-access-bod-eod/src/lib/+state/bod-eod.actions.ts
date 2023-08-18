import { Action } from '@ngrx/store';
import {
  BankDepositRequestPayload,
  BodBusinessDayResponse,
  BodBusinessDayResponseFormat,
  CustomErrors,
  EghsBodGeneratedPassword,
  EghsBodPasswordsListingResponse,
  GhsFileUploadResponse,
  MetalRatesAndGoldAvailabilityResponse,
  MetalRatesRequestFormat,
  OfflineGhsEodRevenueCollection,
  ServiceFileUploadResponse,
  UsersActiveSessionsResults,
  WalkInDetailsResponse
} from '@poss-web/shared/models';

export enum BodEodActionTypes {
  PREVIOUS_DAY_EOD = '[Bod Eod] Previous day Eod',
  PREVIOUS_DAY_EOD_SUCCESS = '[Bod Eod] Previous day Eod Success',
  PREVIOUS_DAY_EOD_FAILURE = '[Bod Eod] Previous day Eod Failure',
  START_BOD_PROCESS = '[Bod Eod] Start BOD Process',
  START_BOD_PROCESS_SUCCESS = '[Bod Eod] Start BOD Process Success',
  START_BOD_PROCESS_FAILURE = '[Bod Eod] Start BOD Process Failure',
  LOAD_AVAILABLE_METAL_RATES_FOR_BUSINESS_DAY = '[Bod Eod] Available Metal Rates for business day',
  LOAD_AVAILABLE_METAL_RATES_FOR_BUSINESS_DAY_SUCCESS = '[Bod Eod] Available Metal Rates for business day Success',
  LOAD_AVAILABLE_METAL_RATES_FOR_BUSINESS_DAY_FAILURE = '[Bod Eod] Available Metal Rates for business day Failure',
  LOAD_METAL_RATES_FOR_BUSINESS_DAY = '[Bod Eod] Load Metal Rates for business day',
  LOAD_METAL_RATES_FOR_BUSINESS_DAY_SUCCESS = '[Bod Eod] Load Metal Rates for business day Success',
  LOAD_METAL_RATES_FOR_BUSINESS_DAY_FAILURE = '[Bod Eod] Load Metal Rates for business day Failure',

  BOUTIQUE_POSS_BOD_COMPLETED = '[Bod Eod] Boutique POSS Bod',
  BOUTIQUE_POSS_BOD_COMPLETED_SUCCESS = '[Bod Eod] Boutique POSS Bod Success',
  BOUTIQUE_POSS_BOD_COMPLETED_FAILURE = '[Bod Eod] Boutique POSS Bod Failure',
  GHS_BOD = '[Bod Eod] GHS BOD',
  GHS_BOD_SUCCESS = '[Bod Eod] GHS BOD Success',
  GHS_BOD_FAILURE = '[Bod Eod] GHS BOD Failure',
  MARK_BOD_COMPLETED = '[Bod Eod] Mark BOD Process completed',

  GENERATE_PASSWORD_FOR_EGHS_OFFLINE = '[Bod Eod] Generate Password For EGHS Offline',
  GENERATE_PASSWORD_FOR_EGHS_OFFLINE_SUCCESS = '[Bod Eod] Generate Password For EGHS Offline Success',
  GENERATE_PASSWORD_FOR_EGHS_OFFLINE_FAILURE = '[Bod Eod] Generate Password For EGHS Offline Failure',
  LOAD_GHS_OFFLINE_BOD_PASSWORDS = '[Bod Eod] Load EGHS Offline BOD Passwords for listing',
  LOAD_GHS_OFFLINE_BOD_PASSWORDS_SUCCESS = '[Bod Eod] Load EGHS Offline BOD Passwords for listing Success',
  LOAD_GHS_OFFLINE_BOD_PASSWORDS_FAILURE = '[Bod Eod] Load EGHS Offline BOD Passwords for listing failure',

  CURRENT_DAY_BOD = '[Bod Eod] Current day Bod',
  CURRENT_DAY_BOD_SUCCESS = '[Bod Eod] Current day Bod Success',
  CURRENT_DAY_BOD_FAILURE = '[Bod Eod] Current day Bod Failure',

  CLOSED_BOD = '[Bod Eod] Closed  Bod',
  CLOSED_BOD_SUCCESS = '[Bod Eod] Closed day Bod Success',
  CLOSED_BOD_FAILURE = '[Bod Eod] Closed day Bod Failure',

  LOAD_RETRY_ATTEMPTS = '[Bod Eod] Load Retry Attempts',
  LOAD_RETRY_ATTEMPTS_SUCCESS = '[Bod Eod] Load Retry Attempts Success',
  LOAD_RETRY_ATTEMPTS_FAILURE = '[Bod Eod] Load Retry Attempts Failure',

  START_EOD_PROCESS = '[Bod Eod] Start EOD Process',
  START_EOD_PROCESS_SUCCESS = '[Bod Eod] Start EOD Process Success',
  START_EOD_PROCESS_FAILURE = '[Bod Eod] Start EOD Process Failure',
  WALKIN_DETAILS_COMPLETED = '[Bod Eod] Walkin Details Completed',
  WALKIN_DETAILS_COMPLETED_SUCCESS = '[Bod Eod] Walkin Details Completed Success',
  WALKIN_DETAILS_COMPLETED_FAILURE = '[Bod Eod] Walkin Details Completed Failure',
  PREVIOUSDAY_GHS_BANKDEPOSIT_UPLOAD = '[Bod Eod] Previous day GHS Bank Deposit Upload',
  PREVIOUSDAY_GHS_BANKDEPOSIT_UPLOAD_SUCCESS = '[Bod Eod] Previous day GHS Bank Deposit Upload Success',
  PREVIOUSDAY_GHS_BANKDEPOSIT_UPLOAD_FAILURE = '[Bod Eod] Previous day GHS Bank Deposit Upload Failure',
  PREVIOUSDAY_BANKDEPOSIT_COMPLETED = '[Bod Eod] Previous day Bank Deposit Upload',
  PREVIOUSDAY_BANKDEPOSIT_COMPLETED_SUCCESS = '[Bod Eod] Previous day Bank Deposit Upload Success',
  PREVIOUSDAY_BANKDEPOSIT_COMPLETED_FAILURE = '[Bod Eod] Previous day Bank Deposit Upload Failure',
  BOUTIQUE_REVENUE_COLLECTION = '[Bod Eod] Boutique Revenue Collection',
  BOUTIQUE_REVENUE_COLLECTION_SUCCESS = '[Bod Eod] Boutique Revenue Collection Success',
  BOUTIQUE_REVENUE_COLLECTION_FAILURE = '[Bod Eod] Boutique Revenue Collection Failure',
  GHS_REVENUE_COLLECTION = '[Bod Eod] GHS Revenue Collection',
  GHS_REVENUE_COLLECTION_SUCCESS = '[Bod Eod] GHS Revenue Collection Success',
  GHS_REVENUE_COLLECTION_FAILURE = '[Bod Eod] GHS Revenue Collection Failure',

  GHS_EOD_ACTIVITY = '[Bod Eod] GHS Eod Activity',
  GHS_EOD_ACTIVITY_SUCCESS = '[Bod Eod] GHS Eod Activity Success',
  GHS_EOD_ACTIVITY_FAILURE = '[Bod Eod] GHS Eod Activity Failure',
  BOUTIQUE_POSS_EOD_ACTIVITY = '[Bod Eod] Boutique POSS Eod Activity',
  BOUTIQUE_POSS_EOD_ACTIVITY_SUCCESS = '[Bod Eod] Boutique POSS Eod Activity Success',
  BOUTIQUE_POSS_EOD_ACTIVITY_FAILURE = '[Bod Eod] Boutique POSS Eod Activity Failure',
  OFFLINE_GHS_EOD_REVENUE_COLLECTION = '[Bod Eod] Perform Offline GHS EOD Revenue Collection',
  OFFLINE_GHS_EOD_REVENUE_COLLECTION_SUCCESS = '[Bod Eod] Perform Offline GHS EOD Revenue Collection Success',
  OFFLINE_GHS_EOD_REVENUE_COLLECTION_FAILURE = '[Bod Eod] Perform Offline GHS EOD Revenue Collection Failure',
  MARK_EOD_COMPLETED = '[Bod Eod] Mark EOD Process completed',
  LOAD_ACTIVE_USER_SESSIONS = '[Bod Eod] Load Active User Sessions',
  LOAD_ACTIVE_USER_SESSIONS_SUCCESS = '[Bod Eod] Load Active User Sessions Success',
  LOAD_ACTIVE_USER_SESSIONS_FAILURE = '[Bod Eod] Load Active User Sessions Failure',
  RESET = '[Bod Eod] Reset BOD EOD State',
  SERVICE_REVENUE_COLLECTION = '[Bod Eod] SERVICE Revenue Collection',
  SERVICE_REVENUE_COLLECTION_SUCCESS = '[Bod Eod] SERVICE Revenue Collection Success',
  SERVICE_REVENUE_COLLECTION_FAILURE = '[Bod Eod] SERVICE Revenue Collection Failure',
}

// BOD Related
export class PreviousDayEod implements Action {
  readonly type = BodEodActionTypes.PREVIOUS_DAY_EOD;
}
export class PreviousDayEodSuccess implements Action {
  readonly type = BodEodActionTypes.PREVIOUS_DAY_EOD_SUCCESS;
  constructor(readonly payload: BodBusinessDayResponseFormat) {}
}
export class PreviousDayEodFailure implements Action {
  readonly type = BodEodActionTypes.PREVIOUS_DAY_EOD_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class LoadRetryAttempts implements Action {
  readonly type = BodEodActionTypes.LOAD_RETRY_ATTEMPTS;
}
export class LoadRetryAttemptsSuccess implements Action {
  readonly type = BodEodActionTypes.LOAD_RETRY_ATTEMPTS_SUCCESS;
  constructor(readonly payload: BodBusinessDayResponseFormat) {}
}
export class LoadRetryAttemptsFailure implements Action {
  readonly type = BodEodActionTypes.LOAD_RETRY_ATTEMPTS_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class StartBodProcess implements Action {
  readonly type = BodEodActionTypes.START_BOD_PROCESS;
}
export class StartBodProcessSuccess implements Action {
  readonly type = BodEodActionTypes.START_BOD_PROCESS_SUCCESS;
  constructor(readonly payload: number) {}
}
export class StartBodProcessFailure implements Action {
  readonly type = BodEodActionTypes.START_BOD_PROCESS_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}
export class LoadAvailableMetalRatesForBusinessDay implements Action {
  readonly type = BodEodActionTypes.LOAD_AVAILABLE_METAL_RATES_FOR_BUSINESS_DAY;
  constructor(readonly payload: MetalRatesRequestFormat) {}
}
export class LoadAvailableMetalRatesForBusinessDaySuccess implements Action {
  readonly type =
    BodEodActionTypes.LOAD_AVAILABLE_METAL_RATES_FOR_BUSINESS_DAY_SUCCESS;
  constructor(readonly payload: MetalRatesAndGoldAvailabilityResponse) {}
}
export class LoadAvailableMetalRatesForBusinessDayFailure implements Action {
  readonly type =
    BodEodActionTypes.LOAD_AVAILABLE_METAL_RATES_FOR_BUSINESS_DAY_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class LoadMetalRatesForBusinessDay implements Action {
  readonly type = BodEodActionTypes.LOAD_METAL_RATES_FOR_BUSINESS_DAY;
  constructor(readonly payload: number) {}
}
export class LoadMetalRatesForBusinessDaySuccess implements Action {
  readonly type = BodEodActionTypes.LOAD_METAL_RATES_FOR_BUSINESS_DAY_SUCCESS;
  constructor(readonly payload: MetalRatesAndGoldAvailabilityResponse) {}
}
export class LoadMetalRatesForBusinessDayFailure implements Action {
  readonly type = BodEodActionTypes.LOAD_METAL_RATES_FOR_BUSINESS_DAY_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class BoutiquePossBodCompleted implements Action {
  readonly type = BodEodActionTypes.BOUTIQUE_POSS_BOD_COMPLETED;
  constructor(readonly payload: number) {}
}
export class BoutiquePossBodCompletedSuccess implements Action {
  readonly type = BodEodActionTypes.BOUTIQUE_POSS_BOD_COMPLETED_SUCCESS;
  constructor(readonly payload: BodBusinessDayResponse) {}
}
export class BoutiquePossBodCompletedFailure implements Action {
  readonly type = BodEodActionTypes.BOUTIQUE_POSS_BOD_COMPLETED_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class GhsBodCompleted implements Action {
  readonly type = BodEodActionTypes.GHS_BOD;
  constructor(readonly payload: number) {}
}
export class GhsBodCompletedSuccess implements Action {
  readonly type = BodEodActionTypes.GHS_BOD_SUCCESS;
  constructor(readonly payload: BodBusinessDayResponse) {}
}
export class GhsBodCompletedFailure implements Action {
  readonly type = BodEodActionTypes.GHS_BOD_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}
export class MarkBodProcessCompleted implements Action {
  readonly type = BodEodActionTypes.MARK_BOD_COMPLETED;
}

export class GeneratePasswordForEghsOffline implements Action {
  readonly type = BodEodActionTypes.GENERATE_PASSWORD_FOR_EGHS_OFFLINE;
  constructor(readonly payload: any) {}
}
export class GeneratePasswordForEghsOfflineSuccess implements Action {
  readonly type = BodEodActionTypes.GENERATE_PASSWORD_FOR_EGHS_OFFLINE_SUCCESS;
  constructor(readonly payload: EghsBodGeneratedPassword) {}
}
export class GeneratePasswordForEghsOfflineFailure implements Action {
  readonly type = BodEodActionTypes.GENERATE_PASSWORD_FOR_EGHS_OFFLINE_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class LoadGhsOfflineBodPasswords implements Action {
  readonly type = BodEodActionTypes.LOAD_GHS_OFFLINE_BOD_PASSWORDS;
}
export class LoadGhsOfflineBodPasswordsSuccess implements Action {
  readonly type = BodEodActionTypes.LOAD_GHS_OFFLINE_BOD_PASSWORDS_SUCCESS;
  constructor(readonly payload: EghsBodPasswordsListingResponse) {}
}
export class LoadGhsOfflineBodPasswordsFailure implements Action {
  readonly type = BodEodActionTypes.LOAD_GHS_OFFLINE_BOD_PASSWORDS_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}
/* Eod Related Actions */
export class CurrentDayBod implements Action {
  readonly type = BodEodActionTypes.CURRENT_DAY_BOD;
}
export class CurrentDayBodSuccess implements Action {
  readonly type = BodEodActionTypes.CURRENT_DAY_BOD_SUCCESS;
  constructor(readonly payload: number) {}
}
export class CurrentDayBodFailure implements Action {
  readonly type = BodEodActionTypes.CURRENT_DAY_BOD_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class ClosedBod implements Action {
  readonly type = BodEodActionTypes.CLOSED_BOD;
}
export class ClosedBodSuccess implements Action {
  readonly type = BodEodActionTypes.CLOSED_BOD_SUCCESS;
  constructor(readonly payload: number) {}
}
export class ClosedBodFailure implements Action {
  readonly type = BodEodActionTypes.CLOSED_BOD_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class StartEodProcess implements Action {
  readonly type = BodEodActionTypes.START_EOD_PROCESS;
}
export class StartEodProcessSuccess implements Action {
  readonly type = BodEodActionTypes.START_EOD_PROCESS_SUCCESS;
  constructor(readonly payload: number) {}
}
export class StartEodProcessFailure implements Action {
  readonly type = BodEodActionTypes.START_EOD_PROCESS_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}
export class WalkinDetailsCompleted implements Action {
  readonly type = BodEodActionTypes.WALKIN_DETAILS_COMPLETED;
  constructor(readonly payload: number) {}
}
export class WalkinDetailsCompletedSuccess implements Action {
  readonly type = BodEodActionTypes.WALKIN_DETAILS_COMPLETED_SUCCESS;
  constructor(readonly payload: WalkInDetailsResponse) {}
}
export class WalkinDetailsCompletedFailure implements Action {
  readonly type = BodEodActionTypes.WALKIN_DETAILS_COMPLETED_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}
export class PreviousDayGHSBankDepositUpload implements Action {
  readonly type = BodEodActionTypes.PREVIOUSDAY_GHS_BANKDEPOSIT_UPLOAD;
  constructor(readonly payload: number) {}
}
export class PreviousDayGHSBankDepositUploadSuccess implements Action {
  readonly type = BodEodActionTypes.PREVIOUSDAY_GHS_BANKDEPOSIT_UPLOAD_SUCCESS;
  constructor(readonly payload: GhsFileUploadResponse) {}
}
export class PreviousDayGHSBankDepositUploadFailure implements Action {
  readonly type = BodEodActionTypes.PREVIOUSDAY_GHS_BANKDEPOSIT_UPLOAD_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}
export class PreviousDayBankDepositCompleted implements Action {
  readonly type = BodEodActionTypes.PREVIOUSDAY_BANKDEPOSIT_COMPLETED;
  constructor(readonly payload: BankDepositRequestPayload) {}
}
export class PreviousDayBankDepositCompletedSuccess implements Action {
  readonly type = BodEodActionTypes.PREVIOUSDAY_BANKDEPOSIT_COMPLETED_SUCCESS;
  constructor(readonly payload: GhsFileUploadResponse) {}
}
export class PreviousDayBankDepositCompletedFailure implements Action {
  readonly type = BodEodActionTypes.PREVIOUSDAY_BANKDEPOSIT_COMPLETED_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}
export class PerformRevenueCollection implements Action {
  readonly type = BodEodActionTypes.BOUTIQUE_REVENUE_COLLECTION;
  constructor(readonly payload: number) {}
}
export class PerformRevenueCollectionSuccess implements Action {
  readonly type = BodEodActionTypes.BOUTIQUE_REVENUE_COLLECTION_SUCCESS;
  constructor(readonly payload: GhsFileUploadResponse) {}
}
export class PerformRevenueCollectionFailure implements Action {
  readonly type = BodEodActionTypes.BOUTIQUE_REVENUE_COLLECTION_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}
export class PerformGhsRevenueCollection implements Action {
  readonly type = BodEodActionTypes.GHS_REVENUE_COLLECTION;
  constructor(readonly payload: number) {}
}
export class PerformGhsRevenueCollectionSuccess implements Action {
  readonly type = BodEodActionTypes.GHS_REVENUE_COLLECTION_SUCCESS;
  constructor(readonly payload: GhsFileUploadResponse) {}
}
export class PerformGhsRevenueCollectionFailure implements Action {
  readonly type = BodEodActionTypes.GHS_REVENUE_COLLECTION_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}
export class PerformServiceRevenueCollection implements Action {
  readonly type = BodEodActionTypes.SERVICE_REVENUE_COLLECTION;
  constructor(readonly payload: number) {}
}
export class PerformServiceRevenueCollectionSuccess implements Action {
  readonly type = BodEodActionTypes.SERVICE_REVENUE_COLLECTION_SUCCESS;
  constructor(readonly payload: ServiceFileUploadResponse) {}
}
export class PerformServiceRevenueCollectionFailure implements Action {
  readonly type = BodEodActionTypes.SERVICE_REVENUE_COLLECTION_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class GHSEodCompleted implements Action {
  readonly type = BodEodActionTypes.GHS_EOD_ACTIVITY;
  constructor(readonly payload: number) {}
}
export class GHSEodCompletedSuccess implements Action {
  readonly type = BodEodActionTypes.GHS_EOD_ACTIVITY_SUCCESS;
  constructor(readonly payload: BodBusinessDayResponse) {}
}
export class GHSEodCompletedFailure implements Action {
  readonly type = BodEodActionTypes.GHS_EOD_ACTIVITY_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class BoutiquePossEodCompleted implements Action {
  readonly type = BodEodActionTypes.BOUTIQUE_POSS_EOD_ACTIVITY;
  constructor(readonly payload: number) {}
}
export class BoutiquePossEodCompletedSuccess implements Action {
  readonly type = BodEodActionTypes.BOUTIQUE_POSS_EOD_ACTIVITY_SUCCESS;
  constructor(readonly payload: number) {}
}
export class BoutiquePossEodCompletedFailure implements Action {
  readonly type = BodEodActionTypes.BOUTIQUE_POSS_EOD_ACTIVITY_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class PerformOfflineEodGhsRevenueCollection implements Action {
  readonly type = BodEodActionTypes.OFFLINE_GHS_EOD_REVENUE_COLLECTION;
  constructor(readonly payload: OfflineGhsEodRevenueCollection) {}
}

export class PerformOfflineEodGhsRevenueCollectionSuccess implements Action {
  readonly type = BodEodActionTypes.OFFLINE_GHS_EOD_REVENUE_COLLECTION_SUCCESS;
}
export class PerformOfflineEodGhsRevenueCollectionFailure implements Action {
  readonly type = BodEodActionTypes.OFFLINE_GHS_EOD_REVENUE_COLLECTION_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}
export class MarkEodProcessCompleted implements Action {
  readonly type = BodEodActionTypes.MARK_EOD_COMPLETED;
}

export class LoadActiveUserSessions implements Action {
  readonly type = BodEodActionTypes.LOAD_ACTIVE_USER_SESSIONS;
}
export class LoadActiveUserSessionsSuccess implements Action {
  readonly type = BodEodActionTypes.LOAD_ACTIVE_USER_SESSIONS_SUCCESS;
  constructor(readonly payload: UsersActiveSessionsResults[]) {}
}
export class LoadActiveUserSessionsFailure implements Action {
  readonly type = BodEodActionTypes.LOAD_ACTIVE_USER_SESSIONS_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class Reset implements Action {
  readonly type = BodEodActionTypes.RESET;
}

export type BodEodActions =
  | PreviousDayEod
  | PreviousDayEodSuccess
  | PreviousDayEodFailure
  | StartBodProcess
  | StartBodProcessSuccess
  | StartBodProcessFailure
  | LoadAvailableMetalRatesForBusinessDay
  | LoadAvailableMetalRatesForBusinessDaySuccess
  | LoadAvailableMetalRatesForBusinessDayFailure
  | LoadMetalRatesForBusinessDay
  | LoadMetalRatesForBusinessDaySuccess
  | LoadMetalRatesForBusinessDayFailure
  | BoutiquePossBodCompleted
  | BoutiquePossBodCompletedSuccess
  | BoutiquePossBodCompletedFailure
  | GhsBodCompleted
  | GhsBodCompletedSuccess
  | GhsBodCompletedFailure
  | MarkBodProcessCompleted
  | GeneratePasswordForEghsOffline
  | GeneratePasswordForEghsOfflineSuccess
  | GeneratePasswordForEghsOfflineFailure
  | LoadGhsOfflineBodPasswords
  | LoadGhsOfflineBodPasswordsSuccess
  | LoadGhsOfflineBodPasswordsFailure
  | CurrentDayBod
  | CurrentDayBodSuccess
  | CurrentDayBodFailure
  | StartEodProcess
  | StartEodProcessSuccess
  | StartEodProcessFailure
  | WalkinDetailsCompleted
  | WalkinDetailsCompletedSuccess
  | WalkinDetailsCompletedFailure
  | PreviousDayGHSBankDepositUpload
  | PreviousDayGHSBankDepositUploadSuccess
  | PreviousDayGHSBankDepositUploadFailure
  | PreviousDayBankDepositCompleted
  | PreviousDayBankDepositCompletedSuccess
  | PreviousDayBankDepositCompletedFailure
  | PerformRevenueCollection
  | PerformRevenueCollectionSuccess
  | PerformRevenueCollectionFailure
  | PerformGhsRevenueCollection
  | PerformGhsRevenueCollectionSuccess
  | PerformGhsRevenueCollectionFailure
  | GHSEodCompleted
  | GHSEodCompletedSuccess
  | GHSEodCompletedFailure
  | BoutiquePossEodCompleted
  | BoutiquePossEodCompletedSuccess
  | BoutiquePossEodCompletedFailure
  | PerformOfflineEodGhsRevenueCollection
  | PerformOfflineEodGhsRevenueCollectionSuccess
  | PerformOfflineEodGhsRevenueCollectionFailure
  | MarkEodProcessCompleted
  | LoadActiveUserSessions
  | LoadActiveUserSessionsSuccess
  | LoadActiveUserSessionsFailure
  | ClosedBod
  | ClosedBodSuccess
  | ClosedBodFailure
  | PerformServiceRevenueCollection
  | PerformServiceRevenueCollectionSuccess
  | PerformServiceRevenueCollectionFailure
  | LoadRetryAttempts
  | LoadRetryAttemptsSuccess
  | LoadRetryAttemptsFailure
  | Reset;
