import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TepRequestFeatureKey } from './tep.reducer';
import { TEPRequestState } from './tep.state';
import {
  TEPRefundStatusListSelector,
  TEPRequestStatusListSelector
} from './tep.entity';

export const selectTEPRequestState = createFeatureSelector<TEPRequestState>(
  TepRequestFeatureKey
);

const selectHasError = createSelector(
  selectTEPRequestState,
  state => state.hasError
);
const requestList = createSelector(
  selectTEPRequestState,
  state => state.TEPRequestStatusList
);

const refundList = createSelector(
  selectTEPRequestState,
  state => state.TEPRefundRequestStatusList
);
const dropDownValues = createSelector(
  selectTEPRequestState,
  state => state.requestStausDropDownValues
);

const refundDropDownValues = createSelector(
  selectTEPRequestState,
  state => state.refundStausDropDownValues
);

const selectRequests = createSelector(
  requestList,
  TEPRequestStatusListSelector.selectAll
);

const selectRefunds = createSelector(
  refundList,
  TEPRefundStatusListSelector.selectAll
);

const selectedData = createSelector(
  selectTEPRequestState,
  state => state.refundDetails
);

const selectedApprovedData = createSelector(
  selectTEPRequestState,
  state => state.approvedRefundDetails
);

const selectWorkflowDetails = createSelector(
  selectTEPRequestState,
  state => state.selectedData
);
const selectTepItemConfiguratonResponse = createSelector(
  selectTEPRequestState,
  state => state.tepItemConfiguratonResponse
);

const selectIsLoading = createSelector(
  selectTEPRequestState,
  state => state.isLoading
);

const selectRequestCount = createSelector(
  selectTEPRequestState,
  state => state.TEPRequestStatusListCount
);

const selectRefundCount = createSelector(
  selectTEPRequestState,
  state => state.TEPRefundRequestStatusListCount
);
const selectSearchValues = createSelector(
  selectTEPRequestState,
  state => state.searchValues
);

const selectTEPCount = createSelector(
  selectTEPRequestState,
  state => state.searhTEPResponseCount
);

const SearchTEPResponse = createSelector(
  selectTEPRequestState,
  state => state.searhTEPResponse
);
const selectHistorySearchParamDetails = createSelector(
  selectTEPRequestState,
  state => state.historySearchParamDetails
);

const selectTEPHistoryResponse = createSelector(
  selectTEPRequestState,
  state => state.historyItems
);


export const TEPRequestSelectors = {
  selectHasError,
  selectIsLoading,
  selectTEPHistoryResponse,
  selectHistorySearchParamDetails,
  selectWorkflowDetails,
  selectRequestCount,
  selectTepItemConfiguratonResponse,
  selectRefunds,
  selectTEPCount,
  selectRefundCount,
  selectedApprovedData,
  selectRequests,
  SearchTEPResponse,
  refundDropDownValues,
  selectedData,
  selectSearchValues,
  dropDownValues
};
