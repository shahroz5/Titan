import { createFeatureSelector } from '@ngrx/store';
import { CreditNoteMasterState } from './cn-master.state';
import {
  CreditNoteMasterActionTypes,
  CreditNoteMasterAction
} from './cn-master.actions';

export const creditNoteMasterFeatureKey = 'creditNoteMaster';

export const selectCreditNoteMasterState = createFeatureSelector<
  CreditNoteMasterState
>(creditNoteMasterFeatureKey);

export const initialState: CreditNoteMasterState = {
  creditNoteMasterlist: [],
  isLoading: null,
  hasUpdated: null,
  totalElements: null,
  error: null,
  creditNoteMasterDetails: null
};

export function creditNoteMasterReducer(
  state: CreditNoteMasterState = initialState,
  action: CreditNoteMasterAction
) {
  switch (action.type) {
    case CreditNoteMasterActionTypes.SEARCH_CREDIT_NOTE_MASTER_LIST:
    case CreditNoteMasterActionTypes.LOAD_CREDIT_NOTE_MASTER_LIST:
    case CreditNoteMasterActionTypes.LOAD_CREDIT_NOTE_MASTER_DETAIL_BY_CNTYPE:
      return {
        ...state,
        isLoading: true
      };
    case CreditNoteMasterActionTypes.LOAD_CREDIT_NOTE_MASTER_LIST_SUCCESS:
    case CreditNoteMasterActionTypes.SEARCH_CREDIT_NOTE_MASTER_LIST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        creditNoteMasterlist: action.payload.cnMasterList,
        totalElements: action.payload.totalElements
      };

    case CreditNoteMasterActionTypes.LOAD_CREDIT_NOTE_MASTER_DETAIL_BY_CNTYPE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        creditNoteMasterDetails: action.payload
      };

    case CreditNoteMasterActionTypes.LOAD_CREDIT_NOTE_MASTER_LIST_FAILURE:
    case CreditNoteMasterActionTypes.SEARCH_CREDIT_NOTE_MASTER_LIST_FAILURE:
    case CreditNoteMasterActionTypes.LOAD_CREDIT_NOTE_MASTER_DETAIL_BY_CNTYPE_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: null
      };

    case CreditNoteMasterActionTypes.UPDATE_CREDIT_NOTE_MASTER_DETAIL:
      return {
        ...state,
        isLoading: true,
        hasUpdated: false
      };

    case CreditNoteMasterActionTypes.UPDATE_CREDIT_NOTE_MASTER_DETAIL_SUCCESS:
      return {
        ...state,
        hasUpdated: true,
        isLoading: false,
        creditNoteMasterDetails: action.payload
      };
    case CreditNoteMasterActionTypes.UPDATE_CREDIT_NOTE_MASTER_DETAIL_FAILURE:
      return {
        ...state,
        hasUpdated: false,
        isLoading: null,
        error: action.payload
      };

    case CreditNoteMasterActionTypes.LOAD_RESET:
      return {
        ...state,
        creditNoteMasterlist: [],
        hasUpdated: null,
        isLoading: null,
        error: null,
        totalElements: null,
        creditNoteMasterDetails: null
      };

    default: {
      return { ...state };
    }
  }
}
