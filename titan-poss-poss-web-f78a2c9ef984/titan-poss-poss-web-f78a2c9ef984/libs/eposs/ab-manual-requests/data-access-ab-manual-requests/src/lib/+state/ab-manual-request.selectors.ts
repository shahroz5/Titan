import { createSelector } from '@ngrx/store';
import {
  AbManualRequestListSelector,
  itemDetailsSelector
} from './ab-manual-request.entity';
import { selectAbManualRequestState } from './ab-manual-request.reducer';

const selectHasError = createSelector(
  selectAbManualRequestState,
  state => state.hasError
);

const selectIsLoading = createSelector(
  selectAbManualRequestState,
  state => state.isLoading
);

const abManualRequestList = createSelector(
  selectAbManualRequestState,
  state => state.abManualRequestList
);

const selectAbManualRequestList = createSelector(
  abManualRequestList,
  AbManualRequestListSelector.selectAll
);

const selectAbManualRequestDetails = createSelector(
  selectAbManualRequestState,
  state => state.abManualRequestDetails
);

const selectAbManualApprovalRequest = createSelector(
  selectAbManualRequestState,
  state => state.abManualApprovalRequest
);

const selectAbManualProductList = createSelector(
  selectAbManualRequestState,
  state => state.productList
);

const productDetails = createSelector(
  selectAbManualRequestState,
  state => state.productDetails
);

const selectAbManualProductDetails = createSelector(
  productDetails,
  itemDetailsSelector.selectAll
);

const selectAbManualCustomerDetails = createSelector(
  selectAbManualRequestState,
  state => state.customerDetails
);

const selectAbManualHeaderDetails = createSelector(
  selectAbManualRequestState,
  state => state.headerDetails
);

const selectUpdateCashMemoResponse = createSelector(
  selectAbManualRequestState,
  state => state.updateCashMemoResponse
);
const selectHistoryFilterData = createSelector(
  selectAbManualRequestState,
  state => state.advancedFilter
);
const selectFileUploadListRes = createSelector(
  selectAbManualRequestState,
  state => state.uploadFileListResponse
);
const selectFileDownloadUrl = createSelector(
  selectAbManualRequestState,
  state => state.downloadFileUrl
);
export const AbManualRequestSelectors = {
  selectHasError,
  selectIsLoading,
  selectAbManualRequestList,
  selectAbManualRequestDetails,
  selectAbManualApprovalRequest,
  selectAbManualProductDetails,
  selectAbManualProductList,
  selectAbManualCustomerDetails,
  selectAbManualHeaderDetails,
  selectUpdateCashMemoResponse,
  selectHistoryFilterData,
  selectFileUploadListRes,
  selectFileDownloadUrl
};
