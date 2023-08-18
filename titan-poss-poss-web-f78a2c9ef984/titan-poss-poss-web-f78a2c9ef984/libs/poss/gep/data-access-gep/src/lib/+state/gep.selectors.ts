import { createSelector } from '@ngrx/store';
import { selectGepState } from './gep.reducer';
import { gepDetailsSelector, gepCancelSelector } from './gep.entity';
import * as moment from 'moment';

const gepDetails = createSelector(
  selectGepState,
  state => state.gepProductDetails
);

const selectgepDetails = createSelector(
  gepDetails,
  gepDetailsSelector.selectAll
);

const selectGepInit = createSelector(
  selectGepState,
  state => state.gepInitResponse
);

const selectGepResponse = createSelector(
  selectGepState,
  state => state.gepResponse
);
const gepItemResponse = createSelector(selectGepState, state => state.gepItem);

const selectMetalPrice = createSelector(
  selectGepState,
  state => state.metalPrice
);

const selectUpdatedGep = createSelector(
  selectGepState,
  state => state.updateGepItem
);
const selectCustomerDetails = createSelector(
  selectGepState,
  state => state.updateRso
);

const selectGepDetails = createSelector(
  selectGepState,
  state => state.loadGepDetails
);

const selectTotalBreakUp = createSelector(
  selectGepState,
  state => state.totalBreakUp
);

const selectMetalType = createSelector(
  selectGepState,
  state => state.metalType
);

const selectItemType = createSelector(selectGepState, state => state.itemType);

const selectHasError = createSelector(selectGepState, state => state.hasError);

const selectIsLoaded = createSelector(selectGepState, state => state.isLoading);

const selectIsCustomerUpdate = createSelector(selectGepState, state => state.isCustomerUpdate);

const selectSummary = createSelector(selectGepState, state => state.summary);

const selectHoldRespone = createSelector(
  selectGepState,
  state => state.holdConfirmResponse
);

const selectDelete = createSelector(
  selectGepState,
  state => state.deleteResponse
);
const selectRso = createSelector(selectGepState, state => state.updateRso);

const selectloadOnHold = createSelector(
  selectGepState,
  state => state.loadOnHold
);
const selectcountOnhold = createSelector(
  selectGepState,
  state => state.countOnhold
);
const selectsaveCancelGep = createSelector(
  selectGepState,
  state => state.saveCancelGep
);

const gepCancel = createSelector(selectGepState, state => state.loadCancelGep);

const selectloadCancelGep = createSelector(
  gepCancel,
  gepCancelSelector.selectAll
);
const selectdeleteGep = createSelector(
  selectGepState,
  state => state.deleteGep
);

const selectloadgepitem = createSelector(
  selectGepState,
  state => state.loadGepItem
);

const selecttCancelCount = createSelector(
  selectGepState,
  state => state.cancelGepCount
);

const selectUploadResponse = createSelector(
  selectGepState,
  state => state.preMeltingUploadResponse
);

const selectRsoCancel = createSelector(selectGepState, state => state.rso);

const selectReason = createSelector(selectGepState, state => state.reason);

const selectproductTotalValue = createSelector(selectgepDetails, data =>
  data
    .map(gep => gep.totalValue)
    .reduce((amount1, amount2) => amount1 + amount2, 0)
);

const selectproductNetValue = createSelector(selectgepDetails, data =>
  data
    .map(gep => gep.netValue)
    .reduce((amount1, amount2) => amount1 + amount2, 0)
);

const selectProductTax = createSelector(selectgepDetails, data =>
  data
    .map(gep => gep.totaltax)
    .reduce((amount1, amount2) => (amount1 > amount2 ? amount1 : amount2), 0)
);

const selectProductWeight = createSelector(selectgepDetails, data => {
  console.log(data);
  return data
    .filter(filterData => filterData.totalValue > 0)
    .map(gep => gep.weight)
    .reduce((amount1, amount2) => Number(amount1) + Number(amount2), 0);
});

const selectProductQuantity = createSelector(selectgepDetails, data => {
  return data.filter(filterData => filterData.totalValue > 0).length;
});

const selectLastHoldTime = createSelector(selectGepDetails, data => {
  console.log(moment(data.lastHoldTime).diff(moment()) <= 0, data.lastHoldTime);
  return moment(data.lastHoldTime).diff(moment()) <= 0;
});

const selectFileUploadListRes = createSelector(
  selectGepState,
  state => state.uploadFileListResponse
);

const selectFileDownloadUrl = createSelector(
  selectGepState,
  state => state.downloadFileUrl
);

const selectHistorySearchParamDetails = createSelector(
  selectGepState,
  state => state.historySearchParamDetails
);

const selectGEPHistoryResponse = createSelector(
  selectGepState,
  state => state.historyItems
);

const selectViewGEPResponse = createSelector(
  selectGepState,
  state => state.viewGEPDeatilsResponse
);

const selectAvailableDiscountsList = createSelector(
  selectGepState,
  state => state.availableDiscountsList
);

export const GepSelector = {
  selectGepInit,
  selectHasError,
  selectIsLoaded,
  selectIsCustomerUpdate,
  selectGepResponse,
  selectMetalPrice,
  selectTotalBreakUp,
  selectMetalType,
  selectItemType,
  selectSummary,
  selectDelete,
  selectHoldRespone,
  selectRso,
  selectUpdatedGep,
  selectGepDetails,
  selectdeleteGep,
  selectloadCancelGep,
  selectsaveCancelGep,
  selectcountOnhold,
  selectloadOnHold,
  selectloadgepitem,
  selectUploadResponse,
  selectgepDetails,
  selectproductTotalValue,
  selectproductNetValue,
  selectProductWeight,
  selectProductQuantity,
  selectProductTax,
  selecttCancelCount,
  selectLastHoldTime,
  selectCustomerDetails,
  selectRsoCancel,
  selectReason,
  gepItemResponse,
  selectFileUploadListRes,
  selectFileDownloadUrl,
  selectHistorySearchParamDetails,
  selectGEPHistoryResponse,
  selectViewGEPResponse,
  selectAvailableDiscountsList
};
