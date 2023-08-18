import { createSelector } from '@ngrx/store';
import { selectTepState } from './direct-tep.reducer';

const selectError = createSelector(selectTepState, state => state.errors);

const selectIsLoading = createSelector(
  selectTepState,
  state => state.isLoading
);

const selectIsLoadingPriceUpdate = createSelector(
  selectTepState,
  state => state.isLoadingPriceUpdate
);
const selectWorkflowDetails = createSelector(
  selectTepState,

  state => state.selectedData
);
const selectIsOpenTaskLoading = createSelector(
  selectTepState,
  state => state.isOpenTaskLoading
);
const refundCashLimit = createSelector(
  selectTepState,
  state => state.refundCashLimit
);

const selectSelectedRsoName = createSelector(
  selectTepState,
  state => state.selectedRsoName
);

const selectSelectedCmItem = createSelector(
  selectTepState,
  state => state.selectedCmItem
);

const selectCreateOpenTepTransactionResponse = createSelector(
  selectTepState,
  state => state.createOpenTepTransactionResponse
);

const selectUpdateOpenTepTransactionResponse = createSelector(
  selectTepState,
  state => state.updateOpenTepTransactionResponse
);

const selectTepItemConfiguratonResponse = createSelector(
  selectTepState,
  state => state.tepItemConfiguratonResponse
);

const selectTepCashMemoResponseItemList = createSelector(
  selectTepState,
  state => state.tepCashMemoResponseItemList
);

const selectTepPriceDetailsResponse = createSelector(
  selectTepState,
  state => state.tepPriceDetailsResponse
);

const updateTepPriceDetailsResponse = createSelector(
  selectTepState,
  state => state.UpdatePriceDetailsResponse
);

const selectAddTepItemResponse = createSelector(
  selectTepState,
  state => state.addTepItemResponse
);

const selectUpdateTepItemResponse = createSelector(
  selectTepState,
  state => state.updateTepItemResponse
);

const selectConfirmTepItemResponse = createSelector(
  selectTepState,
  state => state.confirmTepItemResponse
);

const selectDeleteTepItemResponse = createSelector(
  selectTepState,
  state => state.deleteTepItemResponse
);

const selectRsoList = createSelector(selectTepState, state => state.rsoList);

const selectRemarks = createSelector(selectTepState, state => state.remarks);

const selectTotalQty = createSelector(selectTepState, state => state.totalQty);

const selectTotalGrossWt = createSelector(
  selectTepState,
  state => state.totalGrossWt
);

const selectTotalExchangeWt = createSelector(
  selectTepState,
  state => state.totalExchangeAmt
);

const selectSelectedPaymentMethod = createSelector(
  selectTepState,
  state => state.selectedPaymentMethod
);

const selectSelectedTepType = createSelector(
  selectTepState,
  state => state.selectedTepType
);

const selectScannedTepItemCode = createSelector(
  selectTepState,
  state => state.scannedTepItemCode
);

const selectTepItemCutPieceDetailsResponse = createSelector(
  selectTepState,
  state => state.tepItemCutPieceDetailsResponse
);

const selectCutPieceTotalQty = createSelector(
  selectTepState,
  state => state.cutPieceTotalQty
);

const selectCutPieceTotalValue = createSelector(
  selectTepState,
  state => state.cutPieceTotalValue
);

const selectViewTepTransactionResponse = createSelector(
  selectTepState,
  state => state.viewTepTransactionResponse
);

const selectViewTepItemResponse = createSelector(
  selectTepState,
  state => state.viewTepItemResponse
);

const selectDeleteTransactionResponse = createSelector(
  selectTepState,
  state => state.deleteTepTransactionResponse
);

const selectCmListItemTepConfigurationResponse = createSelector(
  selectTepState,
  state => state.cmListItemTepConfigurationResponse
);

const selectIsRefundFormValid = createSelector(
  selectTepState,
  state => state.isRefundFormValid
);

const selectIsRequestRaisingScenario = createSelector(
  selectTepState,
  state => state.isRequestRaisingScenario
);

const selectGoldPlusLocations = createSelector(
  selectTepState,
  state => state.goldPlusLocations
);

const selectFileUploadRes = createSelector(
  selectTepState,
  state => state.uploadFileResponse
);

const selectFileIdProofDownloadUrl = createSelector(
  selectTepState,
  state => state.downloadIdProofFileUrl
);

const selectFileCancelledChequeDownloadUrl = createSelector(
  selectTepState,
  state => state.downloadCancelledChequeFileUrl
);

const selectFileApprovalMailDownloadUrl = createSelector(
  selectTepState,
  state => state.downloadApprovalMailFileUrl
);

const cancelResponse = createSelector(
  selectTepState,
  state => state.cancelResponse
);
const cancelTEPResponse = createSelector(
  selectTepState,
  state => state.cancelTEPResponse
);

const selectFtepReasons = createSelector(
  selectTepState,
  state => state.fvtReasons
);

const selectUpdateTepTransactionPriceDetailsResponse = createSelector(
  selectTepState,
  state => state.updateTepTransactionPriceDetailsResponse
);

const selectCreateOpenCutPieceTepTransactionResponse = createSelector(
  selectTepState,
  state => state.createOpenCutPieceTepTransactionResponse
);

const selectPatchCutPieceTepTransactionResponse = createSelector(
  selectTepState,
  state => state.patchCutPieceTepTransactionResponse
);

const selectAddCutPieceTepItemResponse = createSelector(
  selectTepState,
  state => state.addCutPieceTepItemResponse
);

const selectPatchCutPieceTepItemResponse = createSelector(
  selectTepState,
  state => state.patchCutPieceTepItemResponse
);

const selectConfirmCutPieceTepItemResponse = createSelector(
  selectTepState,
  state => state.confirmCutPieceTepItemResponse
);

const selectAvailableDiscountsList = createSelector(
  selectTepState,
  state => state.availableDiscountsList
);

const selectStuddedProductGroupCodes = createSelector(
  selectTepState,
  state => state.studdedProductGroupCodes
);

const selectIsExceptionScenario = createSelector(
  selectTepState,
  state => state.isExceptionScenario
);

const selectHoldTransactionMetalRates = createSelector(
  selectTepState,
  state => state.holdTransactionMetalRates
);

export const TepSelectors = {
  selectError,
  cancelResponse,
  selectIsLoading,
  cancelTEPResponse,
  updateTepPriceDetailsResponse,
  selectIsOpenTaskLoading,
  selectSelectedRsoName,
  selectSelectedCmItem,
  selectCreateOpenTepTransactionResponse,
  selectUpdateOpenTepTransactionResponse,
  selectTepItemConfiguratonResponse,
  selectTepCashMemoResponseItemList,
  selectTepPriceDetailsResponse,
  selectAddTepItemResponse,
  selectUpdateTepItemResponse,
  selectConfirmTepItemResponse,
  selectDeleteTepItemResponse,
  selectRsoList,
  selectRemarks,
  selectTotalQty,
  selectTotalGrossWt,
  selectWorkflowDetails,
  selectTotalExchangeWt,
  selectSelectedPaymentMethod,
  selectSelectedTepType,
  selectScannedTepItemCode,
  selectViewTepTransactionResponse,
  selectViewTepItemResponse,
  selectDeleteTransactionResponse,
  selectTepItemCutPieceDetailsResponse,
  selectCutPieceTotalQty,
  selectCutPieceTotalValue,
  selectCmListItemTepConfigurationResponse,
  selectIsRefundFormValid,
  selectIsRequestRaisingScenario,
  selectGoldPlusLocations,
  selectFileUploadRes,
  selectFileIdProofDownloadUrl,
  selectFileCancelledChequeDownloadUrl,
  selectFileApprovalMailDownloadUrl,
  selectFtepReasons,
  selectUpdateTepTransactionPriceDetailsResponse,
  selectCreateOpenCutPieceTepTransactionResponse,
  selectPatchCutPieceTepTransactionResponse,
  selectAddCutPieceTepItemResponse,
  selectPatchCutPieceTepItemResponse,
  selectConfirmCutPieceTepItemResponse,
  selectIsLoadingPriceUpdate,
  selectAvailableDiscountsList,
  selectStuddedProductGroupCodes,
  selectIsExceptionScenario,
  selectHoldTransactionMetalRates,
  refundCashLimit
};
