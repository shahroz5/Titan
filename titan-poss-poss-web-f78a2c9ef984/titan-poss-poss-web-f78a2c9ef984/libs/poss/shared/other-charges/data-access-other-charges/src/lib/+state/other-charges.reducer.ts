import { OtherChargesState } from './other-charges.state';
import {
  OtherChargesActions,
  OtherChargesActionTypes
} from './other-charges.actions';

export const OtherChargesFeatureKey = 'OtherCharges';

export const initialState: OtherChargesState = {
  hasError: null,
  isLoading: false,
  partialUpdateCashMemoResponse: null,
  taxDetails: null,
  reasons: null
};

export function OtherChargesReducer(
  state: OtherChargesState = initialState,
  action: OtherChargesActions
): OtherChargesState {
  switch (action.type) {
    case OtherChargesActionTypes.PARTIAL_UPDATE_CASH_MEMO:
    case OtherChargesActionTypes.LOAD_REASONS:
      return { ...state, isLoading: true, hasError: null };

    case OtherChargesActionTypes.PARTIAL_UPDATE_CASH_MEMO_FAILURE:
    case OtherChargesActionTypes.LOAD_REASONS_FAILURE:
    case OtherChargesActionTypes.LOAD_TAX_DETAILS_FAILURE:
      return {
        ...state,
        hasError: action.payload,
        isLoading: false
      };

    case OtherChargesActionTypes.PARTIAL_UPDATE_CASH_MEMO_SUCCESS:
      return {
        ...state,
        isLoading: false,
        partialUpdateCashMemoResponse: action.payload
      };

    case OtherChargesActionTypes.LOAD_REASONS_SUCCESS:
      return {
        ...state,
        reasons: action.payload,
        hasError: null,
        isLoading: false
      };
    case OtherChargesActionTypes.RESET_VALUES:
      return {
        ...state,
        hasError: null,
        isLoading: false,
        taxDetails: null,
        partialUpdateCashMemoResponse: null
      };
    case OtherChargesActionTypes.LOAD_TAX_DETAILS:
      return { ...state, isLoading: true, hasError: null, taxDetails: null };
    case OtherChargesActionTypes.LOAD_TAX_DETAILS_SUCCESS:
      return {
        ...state,
        taxDetails: action.payload,
        hasError: null,
        isLoading: false
      };
    default:
      return state;
  }
}
