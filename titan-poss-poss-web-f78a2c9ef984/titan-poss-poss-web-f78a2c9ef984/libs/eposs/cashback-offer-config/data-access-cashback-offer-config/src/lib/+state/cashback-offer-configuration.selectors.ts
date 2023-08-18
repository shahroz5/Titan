import { createSelector } from '@ngrx/store';
import { selectCashbackOfferConfigurationState } from './cashback-offer-configuration.reducer';

const selectCashbackOfferList = createSelector(
  selectCashbackOfferConfigurationState,
  state => state.cashbackOfferList
);

const selectTotalElements = createSelector(
  selectCashbackOfferConfigurationState,
  state => state.totalElements
);

const selectIsloading = createSelector(
  selectCashbackOfferConfigurationState,
  state => state.isLoading
);
const selectError = createSelector(
  selectCashbackOfferConfigurationState,
  state => state.error
);

const selectHasSaved = createSelector(
  selectCashbackOfferConfigurationState,
  state => state.hasSaved
);
const selectHasUpdated = createSelector(
  selectCashbackOfferConfigurationState,
  state => state.hasUpdated
);

const selectbankDetails = createSelector(
  selectCashbackOfferConfigurationState,
  state => state.bankDetails
);

const selectPayerBank = createSelector(
  selectCashbackOfferConfigurationState,
  state => state.payerBank
);

const selectExcludeCashBack = createSelector(
  selectCashbackOfferConfigurationState,
  state => state.excludeCashback
);

const selectOfferDetails = createSelector(
  selectCashbackOfferConfigurationState,
  state => state.offerDetails
);

const selectIsCleared = createSelector(
  selectCashbackOfferConfigurationState,
  state => state.isCleared
);

const selectIsCashAmount = createSelector(
  selectCashbackOfferConfigurationState,
  state => state.isCashAmount
);

const selectSelectedProductGroup = createSelector(
  selectCashbackOfferConfigurationState,
  state => state.selectedProductGroup
);
const selectisProductGroupUpdated = createSelector(
  selectCashbackOfferConfigurationState,
  state => state.isProductGroupUpdated
);

const selectCardDetails = createSelector(
  selectCashbackOfferConfigurationState,
  state => state.cardDetails
);
const selectisFileResponse = createSelector(
  selectCashbackOfferConfigurationState,
  state => state.fileResponse
);

const selectOfferDetailsUpdated = createSelector(
  selectCashbackOfferConfigurationState,
  state => state.offerDetailsUpdated
);
const selectErrorlog = createSelector(
  selectCashbackOfferConfigurationState,
  state => state.errorLog
);
export const CashbackOfferConfigurationSelectors = {
  selectCashbackOfferList,
  selectTotalElements,
  selectIsloading,
  selectError,
  selectHasSaved,
  selectHasUpdated,
  selectbankDetails,
  selectPayerBank,
  selectExcludeCashBack,
  selectOfferDetails,
  selectIsCleared,
  selectIsCashAmount,
  selectSelectedProductGroup,
  selectisProductGroupUpdated,
  selectCardDetails,
  selectisFileResponse,
  selectOfferDetailsUpdated,
  selectErrorlog
};
