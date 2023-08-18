import { RequestApprovalsState } from './request-approvals.state';
import {
  RequestApprovalsActions,
  RequestApprovalsActionTypes
} from './request-approvals.actions';
import {
  itemAdapter,
  ibtRequestAdapter,
  ibtRequestItemAdapter
} from './request-approvals.entity';
import { createFeatureSelector } from '@ngrx/store';

export const REQUEST_APPROVALS_FEATURE_KEY = 'requestApprovals';

export const selectRequestApprovalsState = createFeatureSelector<
  RequestApprovalsState
>(REQUEST_APPROVALS_FEATURE_KEY);

export const initialState: RequestApprovalsState = {
  binRequestApprovalsItem: itemAdapter.getInitialState(),
  binRequestItemsCount: 0,
  ibtRequestItemsCount: 0,
  isbinRequestItemsLoading: false,
  isLoading: false,
  error: null,
  isibtRequestCancelItemsLoading: false,
  hasUpdatingFailure: null,
  isBinRequestItemsCountReset: false,
  isBinRequestItemsReset: false,
  isIbtRequestItemsCountReset: false,
  isIbtRequestItemsReset: false,
  binRequestApproval: null,
  isUpdatingItemSuccess: false,
  isCancelUpdatingSuccess: false,
  ibtCancelUpdateRequest: null,
  hasUpadatingCancelApprovalsFailure: null,
  ibtCancelRequestItemsListCount: null,
  ibtCancelItems: ibtRequestItemAdapter.getInitialState(),

  locationCount: 0,
  isLocationLoading: false,
  location: [],
  ibtRequest: ibtRequestAdapter.getInitialState(),
  ibtCancellationRequest: ibtRequestAdapter.getInitialState(),
  isLoadingIbtCancellationRequest: false,
  searchIbtCancellationRequestResults: ibtRequestAdapter.getInitialState(),
  isSearchingCancellationIbtRequest: false,
  hasSearchCancellationIbtRequest: false,
  isLoadingIbtRequest: false,
  isSearchingIbtRequest: false,
  searchIbtRequestResults: ibtRequestAdapter.getInitialState(),
  hasSearchIbtRequest: null,
  selectedRequest: null,
  isLoadingSelectedStock: false,
  ibtCancelRequestItemsCount: 0,
  isIbtCancelRequestItemsCountReset: false,
  isIbtCancelRequestItemsReset: false,
  selectedCancelRequest: null,
  isLoadingSelectedCancelStock: false,

  adjRequest: ibtRequestAdapter.getInitialState(),
  isLoadingadjRequest: false,
  adjRequestItemsCount: 0,
  isadjRequestItemsCountReset: false,
  isadjRequestItemsReset: false,
  selectedAdjRequest: null,
  isLoadingSelectedAdjStock: false,

  lossRequest: ibtRequestAdapter.getInitialState(),
  isLoadinglossequest: false,
  lossRequestItemsCount: 0,
  islossRequestItemsCountReset: false,
  islossRequestItemsReset: false,
  selectedlossRequest: null,
  isLoadingSelectedlossStock: false,

  loanRequest: ibtRequestAdapter.getInitialState(),
  isLoadingloanRequest: false,
  loanRequestItemsCount: 0,
  isloanRequestItemsCountReset: false,
  isloanRequestItemsReset: false,
  selectedloanRequest: null,
  isLoadingSelectedloanStock: false,

  psvRequest: ibtRequestAdapter.getInitialState(),
  isLoadingpsvRequest: false,
  psvRequestItemsCount: 0,
  ispsvRequestItemsCountReset: false,
  ispsvRequestItemsReset: false,
  selectedpsvRequest: null,
  isLoadingSelectedpsvStock: false,

  exhRequest: ibtRequestAdapter.getInitialState(),
  isLoadingexhRequest: false,
  exhRequestItemsCount: 0,
  isexhRequestItemsCountReset: false,
  isexhRequestItemsReset: false,
  selectedexhRequest: null,
  isLoadingSelectedexhStock: false,

  focRequest: ibtRequestAdapter.getInitialState(),
  isLoadingfocRequest: false,
  focRequestItemsCount: 0,
  isfocRequestItemsCountReset: false,
  isfocRequestItemsReset: false,
  selectedfocRequest: null,
  isLoadingSelectedfocStock: false,

  ibtRequestApprovalsItem: ibtRequestItemAdapter.getInitialState(),
  ibtRequestApprovalsItemsCount: 0,
  isibtRequestItemsLoading: false,
  ibtRequestApproval: null,
  hasUpdatingIbtFailure: null,
  isUpdatingIbtSuccess: false,
  isUpdatingSuccess: false,
  hasUpadatingApprovalsFailure: null,
  ibtUpdateRequest: null,
  selectedItems: ibtRequestItemAdapter.getInitialState(),

  otherIssuesCount: 0,

  isRequestItemsReset: false,
  isRequestItemsCountReset: false,
  studdedProductGroups: [],
  isLoadingImage: false
};

export function RequestApprovalsReducer(
  state: RequestApprovalsState = initialState,
  action: RequestApprovalsActions
): RequestApprovalsState {
  switch (action.type) {
    case RequestApprovalsActionTypes.LOAD_BINREQUESTAPPROVALS_COUNT:
      return {
        ...state,
        binRequestApproval: null,
        isLoading: true,
        error: null,
        hasUpdatingFailure: null
      };

    case RequestApprovalsActionTypes.LOAD_BINREQUESTAPPROVALS_COUNT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        binRequestApproval: null,
        binRequestItemsCount: action.payload,
        error: null,
        hasUpdatingFailure: null
      };

    case RequestApprovalsActionTypes.LOAD_BINREQUESTAPPROVALS_COUNT_FAILURE:
      return {
        ...state,
        isLoading: false,
        binRequestApproval: null,
        error: action.payload
      };

    case RequestApprovalsActionTypes.LOAD_BINREQUESTAPPROVALS:
      return {
        ...state,
        isbinRequestItemsLoading: true,
        binRequestApproval: null,
        error: null,
        hasUpdatingFailure: null
      };

    case RequestApprovalsActionTypes.LOAD_BINREQUESTAPPROVALS_SUCCESS:
      return {
        ...state,
        binRequestApprovalsItem: itemAdapter.setAll(
          action.payload.items,
          state.binRequestApprovalsItem
        ),
        binRequestApproval: null,
        binRequestItemsCount: action.payload.count,
        isbinRequestItemsLoading: false,
        error: null,
        hasUpdatingFailure: null
      };

    case RequestApprovalsActionTypes.LOAD_BINREQUESTAPPROVALS_FAILURE:
      return {
        ...state,
        error: action.payload,
        isbinRequestItemsLoading: false
      };

    case RequestApprovalsActionTypes.RESET_BINREQUESTAPPROVALS:
      return {
        ...state,
        binRequestApprovalsItem: itemAdapter.getInitialState(),
        isBinRequestItemsReset: true,
        error: null,
        isLoading: false,
        hasUpdatingFailure: null
      };

    case RequestApprovalsActionTypes.RESET_BINREQUESTAPPROVALS_COUNT:
      return {
        ...state,
        binRequestItemsCount: 0,
        binRequestApproval: null,
        isBinRequestItemsCountReset: true,
        error: null,
        hasUpdatingFailure: null,
        isLoading: false
      };

    case RequestApprovalsActionTypes.RESET_REQUESTAPPROVALSITEMS:
      return {
        ...state,
        ibtRequestApprovalsItem: ibtRequestItemAdapter.getInitialState(),
        ibtRequestApprovalsItemsCount: 0,
        isRequestItemsReset: true,
        isibtRequestItemsLoading: false,
        error: null,
        isLoading: false
      };
    case RequestApprovalsActionTypes.RESET_ERROR:
      return {
        ...state,

        error: null,
        hasUpdatingFailure: null,
        hasUpadatingCancelApprovalsFailure: null,
        hasUpadatingApprovalsFailure: null,
        isLoading: false
      };

    case RequestApprovalsActionTypes.RESET_UPDATE:
      return {
        ...state,
        ibtUpdateRequest: null,
        ibtCancelUpdateRequest: null,
        isRequestItemsReset: true,
        error: null,
        isLoading: false,
        hasUpdatingFailure: null
      };

    case RequestApprovalsActionTypes.RESET_REQUESTAPPROVALSITEMS_COUNT:
      return {
        ...state,
        ibtRequestApprovalsItemsCount: 0,
        ibtRequestApproval: null,
        isRequestItemsCountReset: true,
        error: null,

        isLoading: false
      };

    case RequestApprovalsActionTypes.RESET_IBTREQUESTAPPROVALS:
      return {
        ...state,
        ibtRequest: ibtRequestAdapter.getInitialState(),
        ibtCancellationRequest: ibtRequestAdapter.getInitialState(),
        isIbtRequestItemsReset: true,
        error: null,
        isLoading: false
      };

    case RequestApprovalsActionTypes.RESET_IBTREQUESTAPPROVALS_COUNT:
      return {
        ...state,
        ibtRequestItemsCount: 0,
        ibtCancelRequestItemsCount: 0,

        isIbtRequestItemsCountReset: true,
        error: null,
        isLoading: false
      };

    case RequestApprovalsActionTypes.RESET_ADJREQUESTAPPROVALS:
      return {
        ...state,
        adjRequest: ibtRequestAdapter.getInitialState(),
        isadjRequestItemsReset: true,
        error: null,
        isLoading: false
      };

    case RequestApprovalsActionTypes.RESET_ADJREQUESTAPPROVALS_COUNT:
      return {
        ...state,
        adjRequestItemsCount: 0,

        isadjRequestItemsCountReset: true,
        error: null,
        isLoading: false
      };

    case RequestApprovalsActionTypes.RESET_LOSSREQUESTAPPROVALS:
      return {
        ...state,
        lossRequest: ibtRequestAdapter.getInitialState(),
        islossRequestItemsReset: true,
        error: null,
        isLoading: false
      };

    case RequestApprovalsActionTypes.RESET_LOSSREQUESTAPPROVALS_COUNT:
      return {
        ...state,
        lossRequestItemsCount: 0,

        islossRequestItemsCountReset: true,
        error: null,
        isLoading: false
      };

    case RequestApprovalsActionTypes.RESET_LOANREQUESTAPPROVALS:
      return {
        ...state,
        loanRequest: ibtRequestAdapter.getInitialState(),
        isloanRequestItemsReset: true,
        error: null,
        isLoading: false
      };

    case RequestApprovalsActionTypes.RESET_LOANREQUESTAPPROVALS_COUNT:
      return {
        ...state,
        loanRequestItemsCount: 0,

        isloanRequestItemsCountReset: true,
        error: null,
        isLoading: false
      };

    case RequestApprovalsActionTypes.RESET_PSVREQUESTAPPROVALS:
      return {
        ...state,
        psvRequest: ibtRequestAdapter.getInitialState(),
        ispsvRequestItemsReset: true,
        error: null,
        isLoading: false
      };

    case RequestApprovalsActionTypes.RESET_PSVREQUESTAPPROVALS_COUNT:
      return {
        ...state,
        psvRequestItemsCount: 0,

        ispsvRequestItemsCountReset: true,
        error: null,
        isLoading: false
      };

    case RequestApprovalsActionTypes.RESET_FOCREQUESTAPPROVALS:
      return {
        ...state,
        focRequest: ibtRequestAdapter.getInitialState(),
        isfocRequestItemsReset: true,
        error: null,
        isLoading: false
      };

    case RequestApprovalsActionTypes.RESET_FOCREQUESTAPPROVALS_COUNT:
      return {
        ...state,
        focRequestItemsCount: 0,

        isfocRequestItemsCountReset: true,
        error: null,
        isLoading: false
      };

    case RequestApprovalsActionTypes.RESET_EXHREQUESTAPPROVALS:
      return {
        ...state,
        exhRequest: ibtRequestAdapter.getInitialState(),
        isexhRequestItemsReset: true,
        error: null,
        isLoading: false
      };

    case RequestApprovalsActionTypes.RESET_EXHREQUESTAPPROVALS_COUNT:
      return {
        ...state,
        exhRequestItemsCount: 0,

        isexhRequestItemsCountReset: true,
        error: null,
        isLoading: false
      };

    case RequestApprovalsActionTypes.UPDATE_BINREQUESTAPPROVALS:
    case RequestApprovalsActionTypes.LOAD_LOCATION_COUNT:
      return {
        ...state,
        isLoading: true,
        error: null,
        hasUpdatingFailure: null
      };

    case RequestApprovalsActionTypes.UPDATE_BINREQUESTAPPROVALS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isUpdatingItemSuccess: true,
        binRequestApproval: action.payload,
        error: null,
        hasUpdatingFailure: null
      };

    case RequestApprovalsActionTypes.UPDATE_BINREQUESTAPPROVALS_FAILURE:
      return {
        ...state,
        hasUpdatingFailure: action.payload,
        isLoading: false,
        isUpdatingItemSuccess: false
      };
  }
  switch (action.type) {
    case RequestApprovalsActionTypes.UPDATE_IBTREQUESTAPPROVALSITEMS:
      return {
        ...state,
        isLoading: true,
        error: null,
        hasUpdatingIbtFailure: null
      };

    case RequestApprovalsActionTypes.UPDATE_IBTREQUESTAPPROVALSITEMS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isUpdatingIbtSuccess: true,
        ibtRequestApproval: action.payload,

        error: null,
        hasUpdatingIbtFailure: null
      };

    case RequestApprovalsActionTypes.UPDATE_IBTREQUESTAPPROVALSITEMS_FAILURE:
      return {
        ...state,
        hasUpdatingIbtFailure: action.payload,
        isLoading: false,
        isUpdatingIbtSuccess: false
      };

    case RequestApprovalsActionTypes.LOAD_STUDDED_PRODUCT_GROUPS_SUCCESS:
      return {
        ...state,
        studdedProductGroups: action.payload
      };

    case RequestApprovalsActionTypes.LOAD_STUDDED_PRODUCT_GROUPS_FAILURE:
      return {
        ...state,
        error: action.payload
      };

    case RequestApprovalsActionTypes.IBTREQUESTAPPROVALS:
      return {
        ...state,
        isLoading: true,
        error: null,
        hasUpadatingApprovalsFailure: null
      };

    case RequestApprovalsActionTypes.IBTREQUESTAPPROVALS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isUpdatingSuccess: true,

        error: null,
        hasUpadatingApprovalsFailure: null,
        ibtUpdateRequest: action.payload
      };

    case RequestApprovalsActionTypes.IBTREQUESTAPPROVALS_FAILURE:
      return {
        ...state,
        hasUpadatingApprovalsFailure: action.payload,
        isLoading: false,
        isUpdatingSuccess: false
      };

    case RequestApprovalsActionTypes.IBTCANCELREQUESTAPPROVALS:
      return {
        ...state,
        isLoading: true,
        error: null,
        hasUpadatingCancelApprovalsFailure: null
      };

    case RequestApprovalsActionTypes.IBTCANCELREQUESTAPPROVALS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isCancelUpdatingSuccess: true,

        error: null,
        hasUpadatingCancelApprovalsFailure: null,
        ibtCancelUpdateRequest: action.payload
      };

    case RequestApprovalsActionTypes.IBTCANCELREQUESTAPPROVALS_FAILURE:
      return {
        ...state,
        hasUpadatingCancelApprovalsFailure: action.payload,
        isLoading: false,
        isCancelUpdatingSuccess: false
      };

    case RequestApprovalsActionTypes.LOAD_LOCATION_COUNT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        locationCount: action.payload,
        error: null,
        hasUpdatingFailure: null
      };
  }
  switch (action.type) {
    case RequestApprovalsActionTypes.LOAD_LOCATION_COUNT_FAILURE:
    case RequestApprovalsActionTypes.LOAD_IBTREQUESTAPPROVALS_COUNT_FAILURE:
    case RequestApprovalsActionTypes.LOAD_IBTREQUESTITEMSAPPROVALS_COUNT_FAILURE:
    case RequestApprovalsActionTypes.LOAD_IBTREQUESTAPPROVALS_CANCEL_COUNT_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };

    case RequestApprovalsActionTypes.LOAD_LOCATION:
      return {
        ...state,
        isLocationLoading: true,
        error: null,
        hasUpdatingFailure: null
      };

    case RequestApprovalsActionTypes.LOAD_LOCATION_SUCCESS:
      return {
        ...state,
        location: action.payload,
        binRequestApproval: null,
        isLocationLoading: false,
        error: null,
        hasUpdatingFailure: null
      };

    case RequestApprovalsActionTypes.LOAD_LOCATION_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLocationLoading: false
      };

    case RequestApprovalsActionTypes.SEARCH_CLEAR:
      return {
        ...state,
        binRequestApprovalsItem: itemAdapter.getInitialState(),
        isLoading: false
      };

    case RequestApprovalsActionTypes.LOAD_IBT_REQUEST:
      return {
        ...state,
        isLoadingIbtRequest: true,
        error: null
      };

    case RequestApprovalsActionTypes.LOAD_IBT_REQUEST_SUCCESS:
      return {
        ...state,
        ibtRequest: ibtRequestAdapter.addMany(
          action.payload.items,
          state.ibtRequest
        ),
        ibtRequestItemsCount: action.payload.count,

        isLoadingIbtRequest: false,
        error: null
      };

    case RequestApprovalsActionTypes.LOAD_IBT_REQUEST_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoadingIbtRequest: false
      };

    case RequestApprovalsActionTypes.CLEAR_SEARCH_IBT_ITEMS:
      return {
        ...state,
        ibtRequest: ibtRequestAdapter.removeAll(state.ibtRequest),
        ibtRequestItemsCount: 0,
        ibtCancellationRequest: ibtRequestAdapter.removeAll(
          state.ibtCancellationRequest
        ),

        ibtCancelRequestItemsCount: 0,
        isLoadingIbtCancellationRequest: false,
        isLoadingIbtRequest: false
      };

    case RequestApprovalsActionTypes.LOAD_IBT_CANCELLATION_REQUEST:
      return {
        ...state,
        isLoadingIbtCancellationRequest: true,
        error: null
      };

    case RequestApprovalsActionTypes.LOAD_IBT_REQUEST_CANCELLATION_SUCCESS:
      return {
        ...state,
        ibtCancellationRequest: ibtRequestAdapter.addMany(
          action.payload.items,
          state.ibtCancellationRequest
        ),

        ibtCancelRequestItemsCount: action.payload.count,
        isLoadingIbtCancellationRequest: false,
        error: null
      };

    case RequestApprovalsActionTypes.LOAD_IBT_REQUEST_CANCELLATION_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoadingIbtCancellationRequest: false
      };

    case RequestApprovalsActionTypes.LOAD_EXH_REQUEST:
      return {
        ...state,
        isLoadingexhRequest: true,
        error: null
      };

    case RequestApprovalsActionTypes.LOAD_EXH_REQUEST_SUCCESS:
      return {
        ...state,
        exhRequest: ibtRequestAdapter.addMany(
          action.payload.items,
          state.exhRequest
        ),
        exhRequestItemsCount: action.payload.count,
        isLoadingexhRequest: false,
        error: null
      };

    case RequestApprovalsActionTypes.LOAD_EXH_REQUEST_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoadingexhRequest: false
      };

    case RequestApprovalsActionTypes.CLEAR_EXH_REQUEST:
      return {
        ...state,
        exhRequest: ibtRequestAdapter.removeAll(state.exhRequest),
        exhRequestItemsCount: 0,
        isLoadingexhRequest: false
      };

    case RequestApprovalsActionTypes.CLEAR_PSV_REQUEST:
      return {
        ...state,
        psvRequest: ibtRequestAdapter.removeAll(state.psvRequest),
        psvRequestItemsCount: 0,
        isLoadingpsvRequest: false
      };

    case RequestApprovalsActionTypes.CLEAR_FOC_REQUEST:
      return {
        ...state,
        focRequest: ibtRequestAdapter.removeAll(state.focRequest),
        focRequestItemsCount: 0,
        isLoadingfocRequest: false
      };
    case RequestApprovalsActionTypes.CLEAR_ADJ_REQUEST:
      return {
        ...state,
        adjRequest: ibtRequestAdapter.removeAll(state.adjRequest),
        adjRequestItemsCount: 0,
        isLoadingadjRequest: false
      };
    case RequestApprovalsActionTypes.CLEAR_LOSS_REQUEST:
      return {
        ...state,
        lossRequest: ibtRequestAdapter.removeAll(state.lossRequest),
        lossRequestItemsCount: 0,
        isLoadinglossequest: false
      };

    case RequestApprovalsActionTypes.CLEAR_LOAN_REQUEST:
      return {
        ...state,
        loanRequest: ibtRequestAdapter.removeAll(state.loanRequest),
        loanRequestItemsCount: 0,
        isLoadingloanRequest: false
      };

    case RequestApprovalsActionTypes.LOAD_PSV_REQUEST:
      return {
        ...state,
        isLoadingpsvRequest: true,
        error: null
      };

    case RequestApprovalsActionTypes.LOAD_PSV_REQUEST_SUCCESS:
      return {
        ...state,
        psvRequest: ibtRequestAdapter.addMany(
          action.payload.items,
          state.psvRequest
        ),
        psvRequestItemsCount: action.payload.count,
        isLoadingpsvRequest: false,
        error: null
      };

    case RequestApprovalsActionTypes.LOAD_PSV_REQUEST_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoadingpsvRequest: false
      };
  }
  switch (action.type) {
    case RequestApprovalsActionTypes.LOAD_FOC_REQUEST:
      return {
        ...state,
        isLoadingfocRequest: true,
        error: null
      };

    case RequestApprovalsActionTypes.LOAD_FOC_REQUEST_SUCCESS:
      return {
        ...state,
        focRequest: ibtRequestAdapter.addMany(
          action.payload.items,
          state.focRequest
        ),
        focRequestItemsCount: action.payload.count,
        isLoadingfocRequest: false,
        error: null
      };

    case RequestApprovalsActionTypes.LOAD_FOC_REQUEST_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoadingfocRequest: false
      };

    case RequestApprovalsActionTypes.LOAD_LOAN_REQUEST:
      return {
        ...state,
        isLoadingloanRequest: true,
        error: null
      };

    case RequestApprovalsActionTypes.LOAD_LOAN_REQUEST_SUCCESS:
      return {
        ...state,
        loanRequest: ibtRequestAdapter.addMany(
          action.payload.items,
          state.loanRequest
        ),
        loanRequestItemsCount: action.payload.count,
        isLoadingloanRequest: false,
        error: null
      };

    case RequestApprovalsActionTypes.LOAD_LOAN_REQUEST_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoadingloanRequest: false
      };

    case RequestApprovalsActionTypes.LOAD_LOSS_REQUEST:
      return {
        ...state,
        isLoadinglossequest: true,
        error: null
      };

    case RequestApprovalsActionTypes.LOAD_LOSS_REQUEST_SUCCESS:
      return {
        ...state,
        lossRequest: ibtRequestAdapter.addMany(
          action.payload.items,
          state.lossRequest
        ),
        lossRequestItemsCount: action.payload.count,
        isLoadinglossequest: false,
        error: null
      };

    case RequestApprovalsActionTypes.LOAD_LOSS_REQUEST_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoadinglossequest: false
      };

    case RequestApprovalsActionTypes.LOAD_ADJ_REQUEST:
      return {
        ...state,
        isLoadingadjRequest: true,
        error: null
      };

    case RequestApprovalsActionTypes.LOAD_ADJ_REQUEST_SUCCESS:
      return {
        ...state,
        adjRequest: ibtRequestAdapter.addMany(
          action.payload.items,
          state.adjRequest
        ),
        adjRequestItemsCount: action.payload.count,
        isLoadingadjRequest: false,
        error: null
      };

    case RequestApprovalsActionTypes.LOAD_ADJ_REQUEST_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoadingadjRequest: false
      };
  }
  switch (action.type) {
    case RequestApprovalsActionTypes.LOAD_IBTREQUESTAPPROVALS_COUNT:
      return {
        ...state,

        isLoading: true,
        error: null,
        hasUpdatingFailure: null
      };

    case RequestApprovalsActionTypes.LOAD_IBTREQUESTAPPROVALS_COUNT_SUCCESS:
      return {
        ...state,
        isLoading: false,

        ibtRequestItemsCount: action.payload,
        error: null,
        hasUpdatingFailure: null
      };

    // case RequestApprovalsActionTypes.LOAD_IBTREQUESTAPPROVALS_COUNT:
    //   return {
    //     ...state,

    //     isLoading: true,
    //     error: null,
    //     hasUpdatingFailure: null
    //   }

    // case RequestApprovalsActionTypes.LOAD_IBTREQUESTAPPROVALS_COUNT_SUCCESS:

    //   return {
    //     ...state,
    //     isLoading: false,

    //     ibtCancelRequestItemsCount: action.payload,
    //     error: null,
    //     hasUpdatingFailure: null
    //   };

    case RequestApprovalsActionTypes.LOAD_IBTREQUESTAPPROVALS_CANCEL_COUNT:
      return {
        ...state,

        isLoading: true,
        error: null,
        hasUpadatingCancelApprovalsFailure: null
      };

    case RequestApprovalsActionTypes.LOAD_IBTREQUESTAPPROVALS_CANCEL_COUNT_SUCCESS:
      return {
        ...state,
        isLoading: false,

        ibtCancelRequestItemsCount: action.payload,
        error: null,
        hasUpadatingCancelApprovalsFailure: null
      };

    case RequestApprovalsActionTypes.LOAD_SELECTED_REQUEST:
      return {
        ...state,
        isLoadingSelectedStock: true,

        error: null
      };

    case RequestApprovalsActionTypes.LOAD_SELECTED_REQUEST_SUCCESS:
      return {
        ...state,
        selectedRequest: action.payload,
        isLoadingSelectedStock: false
      };

    case RequestApprovalsActionTypes.LOAD_SELECTED_REQUEST_FAILURE:
      return {
        ...state,
        isLoadingSelectedStock: false,
        error: action.payload
      };

    case RequestApprovalsActionTypes.LOAD_SELECTED_CANCELLATION_REQUEST:
      return {
        ...state,
        isLoadingSelectedCancelStock: true,

        error: null
      };

    case RequestApprovalsActionTypes.LOAD_SELECTED_CANCELLATION_REQUEST_SUCCESS:
      return {
        ...state,
        selectedCancelRequest: action.payload,
        isLoadingSelectedCancelStock: false
      };

    case RequestApprovalsActionTypes.LOAD_SELECTED_CANCELLATION_REQUEST_FAILURE:
      return {
        ...state,
        isLoadingSelectedCancelStock: false,
        error: action.payload
      };

    case RequestApprovalsActionTypes.LOAD_IBTREQUESTAPPROVALS:
      return {
        ...state,
        isibtRequestItemsLoading: true,

        error: null
      };

    case RequestApprovalsActionTypes.LOAD_IBTREQUESTAPPROVALS_SUCCESS:
      return {
        ...state,
        ibtRequestApprovalsItem: ibtRequestItemAdapter.setAll(
          action.payload.items,
          state.ibtRequestApprovalsItem
        ),

        ibtRequestApprovalsItemsCount: action.payload.count,
        isibtRequestItemsLoading: false,
        error: null
      };

    case RequestApprovalsActionTypes.LOAD_IBTREQUESTAPPROVALS_FAILURE:
      return {
        ...state,
        error: action.payload,
        isibtRequestItemsLoading: false
      };

    case RequestApprovalsActionTypes.LOAD_IBTREQUESCANCELAPPROVALS_ITEMS:
      return {
        ...state,
        isibtRequestCancelItemsLoading: true,

        error: null
      };

    case RequestApprovalsActionTypes.LOAD_IBTREQUESTCANCELAPPROVALS_ITEMS_SUCCESS:
      return {
        ...state,
        ibtCancelItems: ibtRequestItemAdapter.setAll(
          action.payload.items,
          state.ibtCancelItems
        ),

        ibtCancelRequestItemsListCount: action.payload.count,
        isibtRequestCancelItemsLoading: false,
        error: null
      };

    case RequestApprovalsActionTypes.LOAD_IBTREQUESTCANCELAPPROVALS_ITEMS_FAILURE:
      return {
        ...state,
        error: action.payload,
        isibtRequestCancelItemsLoading: false
      };

    case RequestApprovalsActionTypes.LOAD_IBTREQUESTITEMSAPPROVALS_COUNT:
      return {
        ...state,

        isLoading: true,
        error: null
      };

    case RequestApprovalsActionTypes.LOAD_IBTREQUESTITEMSAPPROVALS_COUNT_SUCCESS:
      return {
        ...state,
        isLoading: false,

        ibtRequestApprovalsItemsCount: action.payload,
        error: null
      };

    case RequestApprovalsActionTypes.CLEAR_ITEM_LIST:
      return {
        ...state,
        ibtRequestApprovalsItem: ibtRequestItemAdapter.removeAll(
          state.ibtRequestApprovalsItem
        )
      };

    case RequestApprovalsActionTypes.LOAD_ItEMS_COUNT:
      return {
        ...state,
        psvRequestItemsCount: 0,
        focRequestItemsCount: 0,
        adjRequestItemsCount: 0,
        lossRequestItemsCount: 0,
        loanRequestItemsCount: 0,
        exhRequestItemsCount: 0,
        otherIssuesCount: 0,
        isLoading: true,
        error: null
      };

    case RequestApprovalsActionTypes.LOAD_ItEMS_COUNT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        psvRequestItemsCount: action.payload.psvRequestCount,
        focRequestItemsCount: action.payload.focRequestCount,
        adjRequestItemsCount: action.payload.adjRequestCount,
        lossRequestItemsCount: action.payload.lossRequestCount,
        loanRequestItemsCount: action.payload.loanRequestCount,
        exhRequestItemsCount: action.payload.exhRequestCount
      };

    case RequestApprovalsActionTypes.LOAD_ItEMS_COUNT_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    case RequestApprovalsActionTypes.LOAD_THUMBNAIL_IMAGE_URL:
      if(action.payload?.isCancelItems){
        return {
          ...state,
          error: null,
          ibtCancelItems: ibtRequestItemAdapter.updateOne(
            {
              id: action.payload.id,
              changes: {
                isLoadingThumbnailImage: true
              }
            },
            state.ibtCancelItems
          )
        };
      } else{
        return {
          ...state,
          error: null,
          ibtRequestApprovalsItem: ibtRequestItemAdapter.updateOne(
            {
              id: action.payload.id,
              changes: {
                isLoadingThumbnailImage: true
              }
            },
            state.ibtRequestApprovalsItem
          )
        };
      }
    case RequestApprovalsActionTypes.LOAD_THUMBNAIL_IMAGE_URL_SUCCESS:
      if(action.payload?.isCancelItems){
        return {
          ...state,
          ibtCancelItems: ibtRequestItemAdapter.updateOne(
            {
              id: action.payload.id,
              changes: {
                thumbnailImageURL: action.payload.thumbnailImageUrl,
                isLoadingThumbnailImage: false
              }
            },
            state.ibtCancelItems
          )
        };
      } else{
        return {
          ...state,
          ibtRequestApprovalsItem: ibtRequestItemAdapter.updateOne(
            {
              id: action.payload.id,
              changes: {
                thumbnailImageURL: action.payload.thumbnailImageUrl,
                isLoadingThumbnailImage: false
              }
            },
            state.ibtRequestApprovalsItem
          )
        };
      }

    case RequestApprovalsActionTypes.LOAD_THUMBNAIL_IMAGE_URL_FAILURE:
      if(action.payload?.isCancelItems){
        return {
          ...state,
          ibtCancelItems: ibtRequestItemAdapter.updateOne(
            {
              id: action.payload.id,
              changes: {
                isLoadingThumbnailImage: false
              }
            },
            state.ibtCancelItems
          )
        };
      } else{
        return {
          ...state,
          ibtRequestApprovalsItem: ibtRequestItemAdapter.updateOne(
            {
              id: action.payload.id,
              changes: {
                isLoadingThumbnailImage: false
              }
            },
            state.ibtRequestApprovalsItem
          )
        };
      }

    case RequestApprovalsActionTypes.LOAD_IMAGE_URL:
      if(action.payload?.isCancelItems){
        return {
          ...state,
          error: null,
          isLoadingImage: true,
          ibtCancelItems: ibtRequestItemAdapter.updateOne(
            {
              id: action.payload.id,
              changes: {
                isLoadingImage: true
              }
            },
            state.ibtCancelItems
          )
        };
      } else{
        return {
          ...state,
          error: null,
          isLoadingImage: true,
          ibtRequestApprovalsItem: ibtRequestItemAdapter.updateOne(
            {
              id: action.payload.id,
              changes: {
                isLoadingImage: true
              }
            },
            state.ibtRequestApprovalsItem
          )
        };
      }
    case RequestApprovalsActionTypes.LOAD_IMAGE_URL_SUCCESS:
    case RequestApprovalsActionTypes.LOAD_IMAGE_URL_FAILURE:
      if(action.payload?.isCancelItems){
        return {
          ...state,
          isLoadingImage: false,
          ibtCancelItems: ibtRequestItemAdapter.updateOne(
            {
              id: action.payload.id,
              changes: {
                imageURL: action.payload.imageUrl,
                isLoadingImage: false
              }
            },
            state.ibtCancelItems
          )
        };
      } else{
        return {
          ...state,
          isLoadingImage: false,
          ibtRequestApprovalsItem: ibtRequestItemAdapter.updateOne(
            {
              id: action.payload.id,
              changes: {
                imageURL: action.payload.imageUrl,
                isLoadingImage: false
              }
            },
            state.ibtRequestApprovalsItem
          )
        };
      }
  }
  return state;
}
