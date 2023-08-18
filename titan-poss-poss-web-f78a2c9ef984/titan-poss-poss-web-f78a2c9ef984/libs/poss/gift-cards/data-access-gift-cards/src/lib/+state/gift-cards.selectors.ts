import { createSelector } from '@ngrx/store';
import { selectGiftCardsState } from './gift-cards.reducer';

const selectError = createSelector(selectGiftCardsState, state => state.errors);

const selectIsLoading = createSelector(
  selectGiftCardsState,
  state => state.isLoading
);

const selectGcCashMemoDetails = createSelector(
  selectGiftCardsState,
  state => state.gcCashMemoDetails
);

const selectPartiallyUpdatedGcCmResponse = createSelector(
  selectGiftCardsState,
  state => state.partiallyUpdatedGcCmResponse
);

const selectAddGiftCardItemResponse = createSelector(
  selectGiftCardsState,
  state => state.addGiftCardItemResponse
);

const selectGetAddedGiftCardItemResponse = createSelector(
  selectGiftCardsState,
  state => state.getAddedGiftCardItemResponse
);

const selectDeleteAddedGiftCardItemResponse = createSelector(
  selectGiftCardsState,
  state => state.deleteAddedGiftCardItemResponse
);

const selectPartiallyUpdateGiftCardItemResponse = createSelector(
  selectGiftCardsState,
  state => state.partiallyUpdateGiftCardItemResponse
);

const selectGcCashMemoAvailableForCancellation = createSelector(
  selectGiftCardsState,
  state => state.gcCashMemoBillsReadyForCancellation
);

const selectSelectedGcCashMemoData = createSelector(
  selectGiftCardsState,
  state => state.selectedGcCashMemoData
);

const selectSelectedRSOName = createSelector(
  selectGiftCardsState,
  state => state.selectedRSOName
);

const selectCardsTotalAmount = createSelector(
  selectGiftCardsState,
  state => state.cardsTotalAmount
);

const selectGcTotalPaidAmount = createSelector(
  selectGiftCardsState,
  state => state.gcTotalAmountPaid
);

const selectCardsTotalQty = createSelector(
  selectGiftCardsState,
  state => state.cardsTotalQty
);

const selectCardsList = createSelector(
  selectGiftCardsState,
  state => state.cardsList
);

const selectGcCashMemoCancelResponse = createSelector(
  selectGiftCardsState,
  state => state.cancelGcCashMemoResponse
);

const selectMaxAmount = createSelector(
  selectGiftCardsState,
  state => state.maxAmount
);

const selectMinAmount = createSelector(
  selectGiftCardsState,
  state => state.minAmount
);

const selectUpdateGcCashMemoResponse = createSelector(
  selectGiftCardsState,
  state => state.updateGcCashMemoResponse
);

const selectLoadRSODetails = createSelector(
  selectGiftCardsState,
  state => state.rsoDetails
);

const selectprintDataResponse = createSelector(selectGiftCardsState, state => {
  return state.printDataResponse;
});

const selectGcCancellationReasons = createSelector(
  selectGiftCardsState,
  state => {
    return state.gcCancellationReasons;
  }
);

const selectSelectedCancellationReason = createSelector(
  selectGiftCardsState,
  state => {
    return state.selectedGcCancellationReason;
  }
);

const selectRemarks = createSelector(
  selectGiftCardsState,
  state => state.remarks
);

const selectOrderNumber = createSelector(
  selectGiftCardsState,
  state => state.orderNumber
);

const selectGcBalance = createSelector(
  selectGiftCardsState,
  state => state.gcBalance
);
const selectGcHistoryListing = createSelector(
  selectGiftCardsState,
  state => state.gcHistoryListItems
);
const selectGcHistoryTotalElements = createSelector(
  selectGiftCardsState,
  state => state.gcHistoryTotalElements
);
const selectHistorySearchParameter = createSelector(
  selectGiftCardsState,
  state => state.historySearchParameter
);

export const giftCardsSelectors = {
  selectError,
  selectIsLoading,
  selectGcCashMemoDetails,
  selectPartiallyUpdatedGcCmResponse,
  selectAddGiftCardItemResponse,
  selectGetAddedGiftCardItemResponse,
  selectDeleteAddedGiftCardItemResponse,
  selectPartiallyUpdateGiftCardItemResponse,
  selectLoadRSODetails,
  selectSelectedRSOName,
  selectCardsTotalAmount,
  selectGcTotalPaidAmount,
  selectCardsTotalQty,
  selectCardsList,
  selectMaxAmount,
  selectMinAmount,
  selectUpdateGcCashMemoResponse,
  selectprintDataResponse,
  selectGcCashMemoAvailableForCancellation,
  selectSelectedGcCashMemoData,
  selectGcCashMemoCancelResponse,
  selectGcCancellationReasons,
  selectSelectedCancellationReason,
  selectRemarks,
  selectOrderNumber,
  selectGcBalance,
  selectGcHistoryListing,
  selectGcHistoryTotalElements,
  selectHistorySearchParameter
};
