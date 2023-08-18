import { createFeatureSelector, createSelector } from '@ngrx/store';
import { advanceBookingFeatureKey } from './advance-booking.reducer';
import { AdvanceBookingState } from './advance-booking.state';
import {
  ABSelector,
  ABRequestStatusListSelector
} from './advance-booking.entity';

export const selectAdvanceBookingState = createFeatureSelector<
  AdvanceBookingState
>(advanceBookingFeatureKey);

const selectHasError = createSelector(
  selectAdvanceBookingState,
  state => state.hasError
);
const requestList = createSelector(
  selectAdvanceBookingState,
  state => state.ABRequestStatusList
);
const dropDownValues = createSelector(
  selectAdvanceBookingState,
  state => state.requestStausDropDownValues
);

const selectSearchValues = createSelector(
  selectAdvanceBookingState,
  state => state.searchValues
);

const selectOrderNumber = createSelector(
  selectAdvanceBookingState,
  state => state.orderNumber
);
const selectRequests = createSelector(
  requestList,
  ABRequestStatusListSelector.selectAll
);

const selectedData = createSelector(
  selectAdvanceBookingState,
  state => state.selectedData
);

const selectIsLoading = createSelector(
  selectAdvanceBookingState,
  state => state.isLoading
);

const selectABCount = createSelector(
  selectAdvanceBookingState,
  state => state.searhABResponseCount
);

const selectRequestCount = createSelector(
  selectAdvanceBookingState,
  state => state.ABRequestStatusListCount
);

const selectminABValue = createSelector(
  selectAdvanceBookingState,
  state => state.minABvalue
);

const selectABStatus = createSelector(
  selectAdvanceBookingState,
  state => state.status
);

const selectABFrozenValue = createSelector(
  selectAdvanceBookingState,
  state => state.frozenABOrder
);

const selectMinABFrozenAmount = createSelector(
  selectAdvanceBookingState,
  state => state.frozenABOrderAmount
);

const selectRSODetails = createSelector(
  selectAdvanceBookingState,
  state => state.RSODetails
);

const selectCreateCashMemoResponse = createSelector(
  selectAdvanceBookingState,
  state => state.createCashMemoResponse
);

const selectViewCashMemoResponse = createSelector(
  selectAdvanceBookingState,
  state => state.viewCashMemoResponse
);

const selectFreezeAdvanceBookingResponse = createSelector(
  selectAdvanceBookingState,
  state => state.freezeAdvanceBookingResponse
);

const selectUpdateCashMemoResponse = createSelector(
  selectAdvanceBookingState,
  state => state.updateCashMemoResponse
);

const selectDeleteCashMemoResponse = createSelector(
  selectAdvanceBookingState,
  state => state.deleteCashMemoResponse
);

const SearchABResponse = createSelector(
  selectAdvanceBookingState,
  state => state.searhABResponse
);

const selectSearchABResponse = createSelector(
  SearchABResponse,
  ABSelector.selectAll
);

const selectPartailUpdateCashMemoResponse = createSelector(
  selectAdvanceBookingState,
  state => state.partialUpdateCashMemoResponse
);

const selectFileUploadRes = createSelector(
  selectAdvanceBookingState,
  state => state.uploadFileResponse
);

const selectFileUploadListRes = createSelector(
  selectAdvanceBookingState,
  state => state.uploadFileListResponse
);

const selectFileDownloadUrl = createSelector(
  selectAdvanceBookingState,
  state => state.downloadFileUrl
);

const selectBestRate = createSelector(
  selectAdvanceBookingState,
  state => state.bestRateABOrder
);

const selectSearchABDetails = createSelector(
  selectAdvanceBookingState,
  state => state.searchABDetails
);

const selectIsMetalRateValidated = createSelector(
  selectAdvanceBookingState,
  state => state.isMetalRateValidated
);

export const advanceBookingSelectors = {
  selectHasError,
  selectIsLoading,

  selectRSODetails,

  selectCreateCashMemoResponse,
  selectViewCashMemoResponse,
  selectUpdateCashMemoResponse,
  selectDeleteCashMemoResponse,

  selectFreezeAdvanceBookingResponse,
  selectminABValue,
  selectABStatus,
  selectRequestCount,
  selectSearchValues,
  selectSearchABResponse,
  selectRequests,
  selectABCount,
  selectedData,
  dropDownValues,
  selectPartailUpdateCashMemoResponse,
  selectOrderNumber,
  selectFileUploadRes,
  selectFileUploadListRes,
  selectFileDownloadUrl,
  selectABFrozenValue,
  selectMinABFrozenAmount,
  selectBestRate,
  selectSearchABDetails,
  selectIsMetalRateValidated
};
