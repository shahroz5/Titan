import { createSelector } from '@ngrx/store';
import {
  cmRequestListSelector,
  itemDetailsSelector
} from './cm-request.entity';
import { selectCmRequestState } from './cm-request.reducer';

const selectHasError = createSelector(
  selectCmRequestState,
  state => state.hasError
);

const selectIsLoading = createSelector(
  selectCmRequestState,
  state => state.isLoading
);

export const cmRequestList = createSelector(
  selectCmRequestState,
  state => state.cmRequestList
);

const selectCmRequestList = createSelector(
  cmRequestList,
  cmRequestListSelector.selectAll
);

const selectCmRequestDetails = createSelector(
  selectCmRequestState,
  state => state.cmRequestDetails
);

const selectCmApprovalRequest = createSelector(
  selectCmRequestState,
  state => state.cmApprovalRequest
);

const selectCmProductList = createSelector(
  selectCmRequestState,
  state => state.productList
);

export const productDetails = createSelector(
  selectCmRequestState,
  state => state.productDetails
);

const selectCmProductDetails = createSelector(
  productDetails,
  itemDetailsSelector.selectAll
);

const selectCmCustomerDetails = createSelector(
  selectCmRequestState,
  state => state.customerDetails
);

const selectCmHeaderDetails = createSelector(
  selectCmRequestState,
  state => state.headerDetails
);

const selectUpdateCashMemoResponse = createSelector(
  selectCmRequestState,
  state => state.updateCashMemoResponse
);

const selectFileUploadListRes = createSelector(
  selectCmRequestState,
  state => state.uploadFileListResponse
);

const selectFileDownloadUrl = createSelector(
  selectCmRequestState,
  state => state.downloadFileUrl
);

const dropDownValues = createSelector(
  selectCmRequestState,
  state => state.requestStausDropDownValues
);

export const cmRequestSelectors = {
  selectHasError,
  selectIsLoading,
  selectCmRequestList,
  selectCmRequestDetails,
  selectCmApprovalRequest,
  selectCmProductDetails,
  selectCmProductList,
  selectCmCustomerDetails,
  selectCmHeaderDetails,
  selectUpdateCashMemoResponse,
  selectFileUploadListRes,
  selectFileDownloadUrl,
  dropDownValues
};
