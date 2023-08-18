import { createSelector } from '@ngrx/store';
import { creditNoteSelector } from './grf.entity';
import { selectCtGrfState } from './grf.reducer';

const selectError = createSelector(selectCtGrfState, state => state.errors);

const selectIsLoading = createSelector(
  selectCtGrfState,
  state => state.isLoading
);

const selectSelectedRsoName = createSelector(
  selectCtGrfState,
  state => state.selectedRsoName
);

const selectInitiateGrfResponse = createSelector(
  selectCtGrfState,
  state => state.initiateGrfResponse
);

const selectUpdateGrfResponse = createSelector(
  selectCtGrfState,
  state => state.updateGrfResponse
);

const selectPartiallyUpdateGrfResponse = createSelector(
  selectCtGrfState,
  state => state.partiallyGrfResponse
);

const selectGoldWeight = createSelector(
  selectCtGrfState,
  state => state.goldWeight
);

const selectRsoDetails = createSelector(
  selectCtGrfState,
  state => state.rsoDetails
);

const selectRemarks = createSelector(selectCtGrfState, state => state.remarks);

const selectViewGrfResponse = createSelector(
  selectCtGrfState,
  state => state.viewGrfResponse
);

const selectFrozenCNs = createSelector(
  selectCtGrfState,
  state => state.frozenCNs
);

export const creditNotes = createSelector(
  selectCtGrfState,
  state => state.creditNote
);
const selectGRFCN = createSelector(creditNotes, creditNoteSelector.selectAll);

const selectMergeCNsResponse = createSelector(
  selectCtGrfState,
  state => state.mergeCNsResponse
);

const selectHasOtpValidated = createSelector(
  selectCtGrfState,
  state => state.hasOtpValidated
);

const selectAnotherCustomerCN = createSelector(
  selectCtGrfState,
  state => state.anotherCustomerCN
);

const selectGrfHistoryResponse = createSelector(
  selectCtGrfState,
  state => state.grfHistoryItems
);

const selectHistorySearchParamDetails = createSelector(
  selectCtGrfState,
  state => state.historySearchParamDetails
);

const selectOrderNumber = createSelector(
  selectCtGrfState,
  state => state.orderNumber
);

const selectCNValidationDetails = createSelector(
  selectCtGrfState,
  state => state.cnValidationDetails
);

const selectFileUploadListRes = createSelector(
  selectCtGrfState,
  state => state.uploadFileListResponse
);

const selectFileUploadRes = createSelector(
  selectCtGrfState,
  state => state.uploadFileResponse
);

const selectFileDownloadUrl = createSelector(
  selectCtGrfState,
  state => state.downloadFileUrl
);

export const CtGrfSelectors = {
  selectError,
  selectIsLoading,
  selectSelectedRsoName,
  selectInitiateGrfResponse,
  selectUpdateGrfResponse,
  selectPartiallyUpdateGrfResponse,
  selectGoldWeight,
  selectRsoDetails,
  selectRemarks,
  selectViewGrfResponse,
  selectFrozenCNs,
  selectGRFCN,
  selectMergeCNsResponse,
  selectHasOtpValidated,
  selectAnotherCustomerCN,
  selectGrfHistoryResponse,
  selectHistorySearchParamDetails,
  selectOrderNumber,
  selectCNValidationDetails,
  selectFileUploadListRes,
  selectFileDownloadUrl,
  selectFileUploadRes
};
