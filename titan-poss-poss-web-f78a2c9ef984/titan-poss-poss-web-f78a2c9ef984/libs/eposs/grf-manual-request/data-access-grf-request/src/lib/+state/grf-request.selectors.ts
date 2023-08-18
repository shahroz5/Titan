import { createSelector } from '@ngrx/store';
import {
  cmRequestListSelector,
  itemDetailsSelector
} from './grf-request.entity';
import { selectGrfRequestState } from './grf-request.reducer';

const selectHasError = createSelector(
  selectGrfRequestState,
  state => state.hasError
);

const selectIsLoading = createSelector(
  selectGrfRequestState,
  state => state.isLoading
);

export const cmRequestList = createSelector(
  selectGrfRequestState,
  state => state.cmRequestList
);

const selectGrfRequestList = createSelector(
  cmRequestList,
  cmRequestListSelector.selectAll
);

const selectGrfRequestDetails = createSelector(
  selectGrfRequestState,
  state => state.cmRequestDetails
);

const selectGrfApprovalRequest = createSelector(
  selectGrfRequestState,
  state => state.cmApprovalRequest
);

const selectGrfProductList = createSelector(
  selectGrfRequestState,
  state => state.productList
);

export const productDetails = createSelector(
  selectGrfRequestState,
  state => state.productDetails
);

const selectGrfProductDetails = createSelector(
  productDetails,
  itemDetailsSelector.selectAll
);

const selectGrfCustomerDetails = createSelector(
  selectGrfRequestState,
  state => state.customerDetails
);

const selectGrfHeaderDetails = createSelector(
  selectGrfRequestState,
  state => state.headerDetails
);

const selectUpdateCashMemoResponse = createSelector(
  selectGrfRequestState,
  state => state.updateCashMemoResponse
);

const selectFileUploadListRes = createSelector(
  selectGrfRequestState,
  state => state.uploadFileListResponse
);

const selectFileDownloadUrl = createSelector(
  selectGrfRequestState,
  state => state.downloadFileUrl
);

export const cmRequestSelectors = {
  selectHasError,
  selectIsLoading,
  selectGrfRequestList,
  selectGrfRequestDetails,
  selectGrfApprovalRequest,
  selectGrfProductDetails,
  selectGrfProductList,
  selectGrfCustomerDetails,
  selectGrfHeaderDetails,
  selectUpdateCashMemoResponse,
  selectFileUploadListRes,
  selectFileDownloadUrl
};
