import { RevenueState } from './revenue.state';
import { RevenueActions, RevenueActionTypes } from './revenue.actions';

export const initialState: RevenueState = {
  isLoading: false,
  error: null,
  revenueData: null,
  todayRevenue: null,
  ghsRevenue: null,
  serviceRevenue: null
};

export function RevenueReducer(
  state: RevenueState = initialState,
  action: RevenueActions
): RevenueState {
  switch (action.type) {
    case RevenueActionTypes.LOAD_REVENUE_LIST:
    case RevenueActionTypes.GET_TODAY_REVENUE_LIST:
    case RevenueActionTypes.GET_GHS_REVENUE_LIST:
    case RevenueActionTypes.GET_SERVICE_REVENUE_LIST:
      return {
        ...state,
        isLoading: true
      };

    case RevenueActionTypes.LOAD_REVENUE_LIST_SUCCESS:
      return {
        ...state,
        revenueData: action.payload,
        isLoading: false
      };

    case RevenueActionTypes.GET_GHS_REVENUE_LIST_SUCCESS:
      return {
        ...state,
        ghsRevenue: action.payload,
        isLoading: false
      };

    case RevenueActionTypes.GET_SERVICE_REVENUE_LIST_SUCCESS:
      return {
        ...state,
        serviceRevenue: action.payload,
        isLoading: false
      };

    case RevenueActionTypes.RESET_ERROR:
      return {
        ...state,
        error: null
      };

    case RevenueActionTypes.GET_TODAY_REVENUE_LIST_SUCCESS:
      return {
        ...state,
        todayRevenue: action.payload,
        isLoading: false
      };

    case RevenueActionTypes.LOAD_REVENUE_LIST_FAILURE:
    case RevenueActionTypes.GET_TODAY_REVENUE_LIST_FAILURE:
    case RevenueActionTypes.GET_GHS_REVENUE_LIST_FAILURE:
    case RevenueActionTypes.GET_SERVICE_REVENUE_LIST_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    default:
      return state;
  }
}
