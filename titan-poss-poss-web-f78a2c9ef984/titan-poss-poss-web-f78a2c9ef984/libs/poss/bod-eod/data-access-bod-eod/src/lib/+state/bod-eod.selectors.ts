import { createSelector } from '@ngrx/store';
import { selectBodEodState } from './bod-eod.reducer';

const selectError = createSelector(selectBodEodState, state => state.errors);

const selectIsLoading = createSelector(
  selectBodEodState,
  state => state.isLoading
);

const selectBodProcessStatus = createSelector(
  selectBodEodState,
  state => state.bodProcessStatus
);
const selectEodProcessStatus = createSelector(
  selectBodEodState,
  state => state.eodProcessStatus
);
const selectPreviousdayEodStatus = createSelector(
  selectBodEodState,
  state => state.previousdayEODStatus
);
const selectBodBusinessDate = createSelector(
  selectBodEodState,
  state => state.bodBusinessDate
);

const selectClosedBusinessDate = createSelector(
  selectBodEodState,
  state => state.closedBusinessDate
);
const selectRateFetchAttempts = createSelector(
  selectBodEodState,
  state => state.rateFetchAttempts
);
const selectIsBodProcessStarted = createSelector(
  selectBodEodState,
  state => state.isBodProcessStarted
);
const selectIsEodProcessStarted = createSelector(
  selectBodEodState,
  state => state.isEodProcessStarted
);
const selectAvailableMetalRates = createSelector(
  selectBodEodState,
  state => state.availableMetalRates
);
const selectGoldRate = createSelector(selectBodEodState, state =>
  state.availableMetalRates
    ? state.availableMetalRates.goldRate
      ? state.availableMetalRates.goldRate
      : null
    : null
);
const selectIsGoldRateAvailable = createSelector(
  selectBodEodState,
  state => state.isGoldRateAvailable
);
const selectMetalRatesAvailableStatus = createSelector(
  selectBodEodState,
  state => state.metalRatesAvailableStatus
);

const selectBoutiquePossBodStatus = createSelector(
  selectBodEodState,
  state => state.boutiquePossBodStatus
);
const selectGhsBodStatus = createSelector(
  selectBodEodState,
  state => state.ghsBodStatus
);
const selectGhsOfflineBodPassword = createSelector(
  selectBodEodState,
  state => state.ghsOfflineBodPassword
);
const selectCurrentDayBodStatus = createSelector(
  selectBodEodState,
  state => state.currentDayBodStatus
);
const selectEodBusinessDate = createSelector(
  selectBodEodState,
  state => state.eodBusinessDate
);
const selectWalkInDetailsStatus = createSelector(
  selectBodEodState,
  state => state.walkInDetailsStatus
);
const selectGhsBankDepositUploadStatus = createSelector(
  selectBodEodState,
  state => state.previousDayGhsBankDepositUploadStatus
);
const selectBoutiqueBankDepositStatus = createSelector(
  selectBodEodState,
  state => state.previousDayBankDepositCompletionStatus
);
const selectBoutiqueRevenueCollectionStatus = createSelector(
  selectBodEodState,
  state => state.boutiqueRevenueCollectionStatus
);
const selectGhsRevenueCollectionStatus = createSelector(
  selectBodEodState,
  state => state.ghsRevenueCollectionStatus
);
const selectServiceRevenueCollectionStatus = createSelector(
  selectBodEodState,
  state => state.serviceRevenueCollectionStatus
);

const selectGhsEodActivityStatus = createSelector(
  selectBodEodState,
  state => state.ghsEodActivityStatus
);
const selectBoutiquePossEodActivityStatus = createSelector(
  selectBodEodState,
  state => state.boutiquePossEodActivityStatus
);
const selectOfflineGhsEodRevenueCollectionStatus = createSelector(
  selectBodEodState,
  state => state.offlineGhsEodRevenueCollectionStatus
);
const selectBodStepsStatus = createSelector(
  selectBodEodState,
  state => state.bodStepsStatus
);
const selectEodStepsStatus = createSelector(
  selectBodEodState,
  state => state.eodStepsStatus
);
const selectOfflineEghsPasswordsListing = createSelector(
  selectBodEodState,
  state => state.viewGhsOfflineBodPasswordData
);
const selectofflineGhsPasswordCount = createSelector(
  selectBodEodState,
  state => state.offlineGhsPasswordCount
);
const selectActiveUserSessions = createSelector(
  selectBodEodState,
  state => state.activeUserSessions
);

export const bodEodSelectors = {
  selectError,
  selectIsLoading,
  selectBodProcessStatus,
  selectEodProcessStatus,
  selectPreviousdayEodStatus,
  selectBodBusinessDate,
  selectRateFetchAttempts,
  selectIsBodProcessStarted,
  selectIsEodProcessStarted,
  selectAvailableMetalRates,
  selectGoldRate,
  selectIsGoldRateAvailable,
  selectMetalRatesAvailableStatus,
  selectBoutiquePossBodStatus,
  selectGhsBodStatus,
  selectGhsOfflineBodPassword,
  selectCurrentDayBodStatus,

  selectEodBusinessDate,
  selectWalkInDetailsStatus,
  selectGhsBankDepositUploadStatus,
  selectBoutiqueBankDepositStatus,
  selectBoutiqueRevenueCollectionStatus,
  selectGhsRevenueCollectionStatus,
  selectServiceRevenueCollectionStatus,

  selectGhsEodActivityStatus,
  selectBoutiquePossEodActivityStatus,
  selectOfflineGhsEodRevenueCollectionStatus,
  selectBodStepsStatus,
  selectEodStepsStatus,
  selectOfflineEghsPasswordsListing,
  selectofflineGhsPasswordCount,
  selectActiveUserSessions,
  selectClosedBusinessDate
};
