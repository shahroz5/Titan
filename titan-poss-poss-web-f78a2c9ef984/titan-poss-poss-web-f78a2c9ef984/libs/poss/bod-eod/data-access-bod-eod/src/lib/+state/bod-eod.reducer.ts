import { createFeatureSelector } from '@ngrx/store';
import { BodEodEnum, BodEodStepsEnum } from '@poss-web/shared/models';
import { BodEodActions, BodEodActionTypes } from './bod-eod.actions';
import { BodEodState } from './bod-eod.state';

export const bodEodFeatureKey = 'bodEod';

export const selectBodEodState = createFeatureSelector<BodEodState>(
  bodEodFeatureKey
);

export const initialState: BodEodState = {
  errors: null,
  isLoading: false,
  closedBusinessDate: null,
  bodProcessStatus: BodEodEnum.PENDING,
  previousdayEODStatus: BodEodEnum.PENDING,
  isBodProcessStarted: null,
  isEodProcessStarted: null,
  bodBusinessDate: null,
  rateFetchAttempts: null,
  availableMetalRates: null,
  isGoldRateAvailable: false,
  metalRatesAvailableStatus: BodEodEnum.PENDING,

  boutiquePossBodStatus: BodEodEnum.PENDING,
  ghsBodStatus: BodEodEnum.PENDING,
  ghsOfflineBodPassword: null,
  viewGhsOfflineBodPasswordData: null,
  offlineGhsPasswordCount: null,
  // Eod below
  eodProcessStatus: BodEodEnum.PENDING,
  currentDayBodStatus: BodEodEnum.PENDING,
  eodBusinessDate: null,
  walkInDetailsStatus: BodEodEnum.PENDING,
  previousDayGhsBankDepositUploadStatus: BodEodEnum.PENDING,
  previousDayBankDepositCompletionStatus: BodEodEnum.PENDING,
  boutiqueRevenueCollectionStatus: BodEodEnum.PENDING,
  ghsRevenueCollectionStatus: BodEodEnum.PENDING,
  serviceRevenueCollectionStatus: BodEodEnum.PENDING,
  ghsEodActivityStatus: BodEodEnum.PENDING,
  boutiquePossEodActivityStatus: BodEodEnum.PENDING,
  offlineGhsEodRevenueCollectionStatus: BodEodEnum.PENDING,
  bodStepsStatus: null,
  eodStepsStatus: null,
  activeUserSessions: null
};

export function BodEodReducer(
  state: BodEodState = initialState,
  action: BodEodActions
): BodEodState {
  switch (action.type) {
    case BodEodActionTypes.CLOSED_BOD: {
      return {
        ...state,
        isLoading: true
      };
    }
    case BodEodActionTypes.CLOSED_BOD_SUCCESS:
      return {
        ...state,
        isLoading: false,
        closedBusinessDate: action.payload
      };
    case BodEodActionTypes.CLOSED_BOD_FAILURE:
      return {
        ...state,
        errors: action.payload,
        isLoading: false,
        closedBusinessDate: null
      };
    case BodEodActionTypes.PREVIOUS_DAY_EOD:
      return {
        ...state,
        previousdayEODStatus: BodEodEnum.PENDING,
        bodBusinessDate: null,
        rateFetchAttempts: null,
        isLoading: true,
        errors: null
      };
    case BodEodActionTypes.PREVIOUS_DAY_EOD_SUCCESS:
      return {
        ...state,
        previousdayEODStatus: BodEodEnum.COMPLETED,
        bodBusinessDate: action.payload.businessDate,
        rateFetchAttempts: action.payload.rateFetchAttempts,
        errors: null,
        isLoading: false
      };
    case BodEodActionTypes.PREVIOUS_DAY_EOD_FAILURE:
      return {
        ...state,
        previousdayEODStatus: BodEodEnum.ERROR,
        bodBusinessDate: null,
        rateFetchAttempts: null,
        errors: action.payload,
        isLoading: false
      };
    case BodEodActionTypes.LOAD_RETRY_ATTEMPTS:
      return {
        ...state,
        rateFetchAttempts: null,
        isLoading: true,
        errors: null
      };
    case BodEodActionTypes.LOAD_RETRY_ATTEMPTS_SUCCESS:
      return {
        ...state,
        rateFetchAttempts: action.payload.rateFetchAttempts,
        errors: null,
        isLoading: false
      };
    case BodEodActionTypes.LOAD_RETRY_ATTEMPTS_FAILURE:
      return {
        ...state,
        rateFetchAttempts: null,
        errors: action.payload,
        isLoading: false
      };
    case BodEodActionTypes.START_BOD_PROCESS:
      return {
        ...state,
        isLoading: true,
        errors: null,
        isBodProcessStarted: null
      };
    case BodEodActionTypes.START_BOD_PROCESS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        errors: null,
        isBodProcessStarted: true,
        bodBusinessDate: action.payload
      };
    case BodEodActionTypes.START_BOD_PROCESS_FAILURE:
      return {
        ...state,
        isLoading: false,
        errors: action.payload,
        isBodProcessStarted: false,
        bodBusinessDate: null
      };
    case BodEodActionTypes.LOAD_AVAILABLE_METAL_RATES_FOR_BUSINESS_DAY:
      return {
        ...state,
        isLoading: true,
        bodProcessStatus: BodEodEnum.INPROGRESS,

        availableMetalRates: null,
        metalRatesAvailableStatus: BodEodEnum.PENDING,
        errors: null
      };
    case BodEodActionTypes.LOAD_AVAILABLE_METAL_RATES_FOR_BUSINESS_DAY_SUCCESS:
      return {
        ...state,
        availableMetalRates: action.payload.availableMetalRates,
        isGoldRateAvailable: action.payload.goldRateAvailable,
        metalRatesAvailableStatus: !!action.payload.goldRateAvailable
          ? BodEodEnum.AVAILABLE
          : BodEodEnum.ERROR,
        bodStepsStatus: BodEodStepsEnum.STEP1_COMPLETED,
        errors: null,
        isLoading: false
      };
    case BodEodActionTypes.LOAD_AVAILABLE_METAL_RATES_FOR_BUSINESS_DAY_FAILURE:
      return {
        ...state,
        bodProcessStatus: BodEodEnum.ERROR,
        availableMetalRates: null,
        metalRatesAvailableStatus: BodEodEnum.ERROR,
        bodStepsStatus: BodEodStepsEnum.STEP1_ERROR,
        errors: action.payload,
        isLoading: false
      };

    case BodEodActionTypes.BOUTIQUE_POSS_BOD_COMPLETED:
      return {
        ...state,
        boutiquePossBodStatus: BodEodEnum.PENDING,
        isLoading: true,
        errors: null
      };
    case BodEodActionTypes.BOUTIQUE_POSS_BOD_COMPLETED_SUCCESS:
      return {
        ...state,
        boutiquePossBodStatus: BodEodEnum.COMPLETED,
        bodStepsStatus: BodEodStepsEnum.STEP2_COMPLETED,
        errors: null,
        isLoading: false
      };
    case BodEodActionTypes.BOUTIQUE_POSS_BOD_COMPLETED_FAILURE:
      return {
        ...state,
        bodProcessStatus: BodEodEnum.ERROR,
        boutiquePossBodStatus: BodEodEnum.ERROR,
        bodStepsStatus: BodEodStepsEnum.STEP2_ERROR,
        errors: action.payload,
        isLoading: false
      };

    case BodEodActionTypes.GHS_BOD:
      return {
        ...state,
        bodProcessStatus: BodEodEnum.INPROGRESS,
        ghsBodStatus: BodEodEnum.PENDING,
        isLoading: true,
        errors: null
      };
    case BodEodActionTypes.GHS_BOD_SUCCESS:
      return {
        ...state,
        bodProcessStatus: BodEodEnum.COMPLETED,
        ghsBodStatus: BodEodEnum.COMPLETED,
        bodStepsStatus: BodEodStepsEnum.STEP3_COMPLETED,
        errors: null,
        isLoading: false
      };
    case BodEodActionTypes.GHS_BOD_FAILURE:
      return {
        ...state,
        bodProcessStatus: BodEodEnum.ERROR,
        ghsBodStatus: BodEodEnum.ERROR,
        bodStepsStatus: BodEodStepsEnum.STEP3_ERROR,
        errors: action.payload,
        isLoading: false
      };
    case BodEodActionTypes.MARK_BOD_COMPLETED:
      return {
        ...state,
        bodProcessStatus: BodEodEnum.COMPLETED
      };
    case BodEodActionTypes.GENERATE_PASSWORD_FOR_EGHS_OFFLINE:
      return {
        ...state,
        ghsOfflineBodPassword: null,
        isLoading: true,
        errors: null
      };
    case BodEodActionTypes.GENERATE_PASSWORD_FOR_EGHS_OFFLINE_SUCCESS:
      return {
        ...state,
        ghsOfflineBodPassword: action.payload.password,
        isLoading: false,
        errors: null
      };
    case BodEodActionTypes.GENERATE_PASSWORD_FOR_EGHS_OFFLINE_FAILURE:
      return {
        ...state,
        ghsOfflineBodPassword: null,
        isLoading: false,
        errors: action.payload
      };
    case BodEodActionTypes.LOAD_GHS_OFFLINE_BOD_PASSWORDS:
      return {
        ...state,
        viewGhsOfflineBodPasswordData: null,
        isLoading: true,
        errors: null,
        offlineGhsPasswordCount: null
      };
    case BodEodActionTypes.LOAD_GHS_OFFLINE_BOD_PASSWORDS_SUCCESS:
      return {
        ...state,
        viewGhsOfflineBodPasswordData:
          action.payload.offlineEghsBodPasswordData,
        isLoading: false,
        errors: null,
        offlineGhsPasswordCount: action.payload.count
      };
    case BodEodActionTypes.LOAD_GHS_OFFLINE_BOD_PASSWORDS_FAILURE:
      return {
        ...state,
        viewGhsOfflineBodPasswordData: null,
        isLoading: false,
        errors: action.payload,
        offlineGhsPasswordCount: null
      };
    case BodEodActionTypes.LOAD_METAL_RATES_FOR_BUSINESS_DAY:
      return {
        ...state,
        availableMetalRates: null,
        isLoading: true,
        errors: null
      };
    case BodEodActionTypes.LOAD_METAL_RATES_FOR_BUSINESS_DAY_SUCCESS:
      return {
        ...state,
        metalRatesAvailableStatus: !!action.payload.goldRateAvailable
          ? BodEodEnum.AVAILABLE
          : BodEodEnum.ERROR,
        availableMetalRates: action.payload.availableMetalRates,
        isGoldRateAvailable: action.payload.goldRateAvailable,
        isLoading: false,
        errors: null
      };
    case BodEodActionTypes.LOAD_METAL_RATES_FOR_BUSINESS_DAY_FAILURE:
      return {
        ...state,
        metalRatesAvailableStatus: BodEodEnum.ERROR,
        availableMetalRates: null,
        isLoading: false,
        errors: action.payload
      };
    // Eod related below
    case BodEodActionTypes.CURRENT_DAY_BOD:
      return {
        ...state,
        currentDayBodStatus: BodEodEnum.PENDING,
        errors: null,
        isLoading: true
      };
    case BodEodActionTypes.CURRENT_DAY_BOD_SUCCESS:
      return {
        ...state,
        currentDayBodStatus: BodEodEnum.COMPLETED,
        eodBusinessDate: action.payload,
        errors: null,
        isLoading: false
      };
    case BodEodActionTypes.CURRENT_DAY_BOD_FAILURE:
      return {
        ...state,
        currentDayBodStatus: BodEodEnum.ERROR,
        errors: action.payload,
        isLoading: false
      };
    case BodEodActionTypes.START_EOD_PROCESS:
      return {
        ...state,
        isLoading: true,
        errors: null,
        isEodProcessStarted: null,
        eodProcessStatus: BodEodEnum.INPROGRESS
      };
    case BodEodActionTypes.START_EOD_PROCESS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        errors: null,
        isEodProcessStarted: true
      };
    case BodEodActionTypes.START_EOD_PROCESS_FAILURE:
      return {
        ...state,
        isLoading: false,
        errors: action.payload,
        isEodProcessStarted: null,
        eodProcessStatus: BodEodEnum.ERROR
      };
    case BodEodActionTypes.WALKIN_DETAILS_COMPLETED:
      return {
        ...state,
        eodProcessStatus: BodEodEnum.INPROGRESS,
        walkInDetailsStatus: BodEodEnum.PENDING,
        errors: null,
        isLoading: true
      };
    case BodEodActionTypes.WALKIN_DETAILS_COMPLETED_SUCCESS:
      return {
        ...state,
        walkInDetailsStatus: BodEodEnum.COMPLETED,
        eodStepsStatus: BodEodStepsEnum.STEP1_COMPLETED,
        errors: null,
        isLoading: false
      };
    case BodEodActionTypes.WALKIN_DETAILS_COMPLETED_FAILURE:
      return {
        ...state,
        eodProcessStatus: BodEodEnum.ERROR,
        walkInDetailsStatus: BodEodEnum.ERROR,
        eodStepsStatus: BodEodStepsEnum.STEP1_ERROR,
        errors: action.payload,
        isLoading: false
      };
    case BodEodActionTypes.PREVIOUSDAY_GHS_BANKDEPOSIT_UPLOAD:
      return {
        ...state,
        eodProcessStatus: BodEodEnum.INPROGRESS,
        previousDayGhsBankDepositUploadStatus: BodEodEnum.PENDING,
        errors: null,
        isLoading: true
      };

    case BodEodActionTypes.PREVIOUSDAY_GHS_BANKDEPOSIT_UPLOAD_SUCCESS:
      return {
        ...state,
        previousDayGhsBankDepositUploadStatus: BodEodEnum.COMPLETED,
        eodStepsStatus: BodEodStepsEnum.STEP2_COMPLETED,
        errors: null,
        isLoading: false
      };
    case BodEodActionTypes.PREVIOUSDAY_GHS_BANKDEPOSIT_UPLOAD_FAILURE:
      return {
        ...state,
        eodProcessStatus: BodEodEnum.ERROR,
        previousDayGhsBankDepositUploadStatus: BodEodEnum.ERROR,
        eodStepsStatus: BodEodStepsEnum.STEP2_ERROR,
        errors: action.payload,
        isLoading: false
      };
    case BodEodActionTypes.PREVIOUSDAY_BANKDEPOSIT_COMPLETED:
      return {
        ...state,
        eodProcessStatus: BodEodEnum.INPROGRESS,
        previousDayBankDepositCompletionStatus: BodEodEnum.PENDING,
        errors: null,
        isLoading: true
      };
    case BodEodActionTypes.PREVIOUSDAY_BANKDEPOSIT_COMPLETED_SUCCESS:
      return {
        ...state,
        previousDayBankDepositCompletionStatus: BodEodEnum.COMPLETED,
        eodStepsStatus: BodEodStepsEnum.STEP3_COMPLETED,
        errors: null,
        isLoading: false
      };
    case BodEodActionTypes.PREVIOUSDAY_BANKDEPOSIT_COMPLETED_FAILURE:
      return {
        ...state,
        eodProcessStatus: BodEodEnum.ERROR,
        previousDayBankDepositCompletionStatus: BodEodEnum.ERROR,
        eodStepsStatus: BodEodStepsEnum.STEP3_ERROR,
        errors: action.payload,
        isLoading: false
      };
    case BodEodActionTypes.BOUTIQUE_REVENUE_COLLECTION:
      return {
        ...state,
        eodProcessStatus: BodEodEnum.INPROGRESS,
        boutiqueRevenueCollectionStatus: BodEodEnum.PENDING,
        errors: null,
        isLoading: true
      };
    case BodEodActionTypes.BOUTIQUE_REVENUE_COLLECTION_SUCCESS:
      return {
        ...state,
        boutiqueRevenueCollectionStatus: BodEodEnum.COMPLETED,
        eodStepsStatus: BodEodStepsEnum.STEP4_COMPLETED,
        errors: null,
        isLoading: false
      };
    case BodEodActionTypes.BOUTIQUE_REVENUE_COLLECTION_FAILURE:
      return {
        ...state,
        eodProcessStatus: BodEodEnum.ERROR,
        boutiqueRevenueCollectionStatus: BodEodEnum.ERROR,
        eodStepsStatus: BodEodStepsEnum.STEP4_ERROR,
        errors: action.payload,
        isLoading: false
      };
    case BodEodActionTypes.GHS_REVENUE_COLLECTION:
      return {
        ...state,
        eodProcessStatus: BodEodEnum.INPROGRESS,
        ghsRevenueCollectionStatus: BodEodEnum.PENDING,
        errors: null,
        isLoading: true
      };
    case BodEodActionTypes.GHS_REVENUE_COLLECTION_SUCCESS:
      return {
        ...state,
        ghsRevenueCollectionStatus: BodEodEnum.COMPLETED,
        eodStepsStatus: BodEodStepsEnum.STEP5_COMPLETED,
        errors: null,
        isLoading: false
      };
    case BodEodActionTypes.GHS_REVENUE_COLLECTION_FAILURE:
      return {
        ...state,
        eodProcessStatus: BodEodEnum.ERROR,
        ghsRevenueCollectionStatus: BodEodEnum.ERROR,
        eodStepsStatus: BodEodStepsEnum.STEP5_ERROR,
        errors: action.payload,
        isLoading: false
      };
    case BodEodActionTypes.SERVICE_REVENUE_COLLECTION:
      return {
        ...state,
        eodProcessStatus: BodEodEnum.INPROGRESS,
        serviceRevenueCollectionStatus: BodEodEnum.PENDING,
        errors: null,
        isLoading: true
      };
    case BodEodActionTypes.SERVICE_REVENUE_COLLECTION_SUCCESS:
      return {
        ...state,
        serviceRevenueCollectionStatus: BodEodEnum.COMPLETED,
        eodStepsStatus: BodEodStepsEnum.STEP5_COMPLETED,
        errors: null,
        isLoading: false
      };
    case BodEodActionTypes.SERVICE_REVENUE_COLLECTION_FAILURE:
      return {
        ...state,
        eodProcessStatus: BodEodEnum.ERROR,
        serviceRevenueCollectionStatus: BodEodEnum.ERROR,
        eodStepsStatus: BodEodStepsEnum.STEP5_ERROR,
        errors: action.payload,
        isLoading: false
      };
    case BodEodActionTypes.OFFLINE_GHS_EOD_REVENUE_COLLECTION:
      return {
        ...state,
        offlineGhsEodRevenueCollectionStatus: BodEodEnum.PENDING,
        errors: null,
        isLoading: true
      };
    case BodEodActionTypes.OFFLINE_GHS_EOD_REVENUE_COLLECTION_SUCCESS:
      return {
        ...state,
        offlineGhsEodRevenueCollectionStatus: BodEodEnum.COMPLETED,
        errors: null,
        isLoading: false
      };
    case BodEodActionTypes.OFFLINE_GHS_EOD_REVENUE_COLLECTION_FAILURE:
      return {
        ...state,
        offlineGhsEodRevenueCollectionStatus: BodEodEnum.ERROR,
        errors: action.payload,
        isLoading: false
      };

    case BodEodActionTypes.GHS_EOD_ACTIVITY:
      return {
        ...state,
        eodProcessStatus: BodEodEnum.INPROGRESS,
        ghsEodActivityStatus: BodEodEnum.PENDING,
        errors: null,
        isLoading: true
      };
    case BodEodActionTypes.GHS_EOD_ACTIVITY_SUCCESS:
      return {
        ...state,
        ghsEodActivityStatus: BodEodEnum.COMPLETED,
        eodStepsStatus: BodEodStepsEnum.STEP6_COMPLETED,
        errors: null,
        isLoading: false
      };
    case BodEodActionTypes.GHS_EOD_ACTIVITY_FAILURE:
      return {
        ...state,
        eodProcessStatus: BodEodEnum.ERROR,
        ghsEodActivityStatus: BodEodEnum.ERROR,
        eodStepsStatus: BodEodStepsEnum.STEP6_ERROR,
        errors: action.payload,
        isLoading: false
      };

    case BodEodActionTypes.BOUTIQUE_POSS_EOD_ACTIVITY:
      return {
        ...state,
        eodProcessStatus: BodEodEnum.INPROGRESS,
        boutiquePossEodActivityStatus: BodEodEnum.PENDING,
        errors: null,
        isLoading: true
      };
    case BodEodActionTypes.BOUTIQUE_POSS_EOD_ACTIVITY_SUCCESS:
      return {
        ...state,
        eodProcessStatus: BodEodEnum.COMPLETED,
        boutiquePossEodActivityStatus: BodEodEnum.COMPLETED,
        eodStepsStatus: BodEodStepsEnum.STEP7_COMPLETED,
        errors: null,
        isLoading: false
      };
    case BodEodActionTypes.BOUTIQUE_POSS_EOD_ACTIVITY_FAILURE:
      return {
        ...state,
        eodProcessStatus: BodEodEnum.ERROR,
        boutiquePossEodActivityStatus: BodEodEnum.ERROR,
        eodStepsStatus: BodEodStepsEnum.STEP7_ERROR,
        errors: action.payload,
        isLoading: false
      };
    case BodEodActionTypes.MARK_EOD_COMPLETED:
      return {
        ...state,
        eodBusinessDate: null
      };
    case BodEodActionTypes.LOAD_ACTIVE_USER_SESSIONS:
      return {
        ...state,
        isLoading: true,
        errors: null,
        activeUserSessions: null
      };
    case BodEodActionTypes.LOAD_ACTIVE_USER_SESSIONS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        errors: null,
        activeUserSessions: action.payload
      };
    case BodEodActionTypes.LOAD_ACTIVE_USER_SESSIONS_FAILURE:
      return {
        ...state,
        isLoading: false,
        errors: action.payload,
        activeUserSessions: null
      };
    case BodEodActionTypes.RESET:
      return {
        ...state,
        errors: null,
        isLoading: false,
        closedBusinessDate: null,

        bodProcessStatus: BodEodEnum.PENDING,
        previousdayEODStatus: BodEodEnum.PENDING,
        isBodProcessStarted: null,
        isEodProcessStarted: null,
        bodBusinessDate: null,
        rateFetchAttempts: null,
        availableMetalRates: null,
        metalRatesAvailableStatus: BodEodEnum.PENDING,

        boutiquePossBodStatus: BodEodEnum.PENDING,
        ghsBodStatus: BodEodEnum.PENDING,
        ghsOfflineBodPassword: null,
        viewGhsOfflineBodPasswordData: null,
        offlineGhsPasswordCount: null,
        // Eod below
        eodProcessStatus: BodEodEnum.PENDING,
        currentDayBodStatus: BodEodEnum.PENDING,
        walkInDetailsStatus: BodEodEnum.PENDING,
        previousDayGhsBankDepositUploadStatus: BodEodEnum.PENDING,
        previousDayBankDepositCompletionStatus: BodEodEnum.PENDING,
        boutiqueRevenueCollectionStatus: BodEodEnum.PENDING,
        ghsRevenueCollectionStatus: BodEodEnum.PENDING,
        serviceRevenueCollectionStatus: BodEodEnum.PENDING,

        ghsEodActivityStatus: BodEodEnum.PENDING,
        boutiquePossEodActivityStatus: BodEodEnum.PENDING,
        offlineGhsEodRevenueCollectionStatus: BodEodEnum.PENDING,
        bodStepsStatus: null,
        eodStepsStatus: null,
        activeUserSessions: null
      };
    default:
      return state;
  }
}
