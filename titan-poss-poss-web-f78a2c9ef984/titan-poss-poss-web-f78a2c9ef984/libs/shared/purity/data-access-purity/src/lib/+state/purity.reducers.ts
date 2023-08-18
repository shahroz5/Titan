import { PurityActionTypes, PurityActions } from './purity.actions';
import { purityAdaptor } from './purity.entity';
import { PurityState } from './purity.state';

import { createFeatureSelector } from '@ngrx/store';

export const initialState: PurityState = {
  purityList: purityAdaptor.getInitialState(),
  error: null,
  isLoading: false,
  totalElements: null,
  metalType: null,
  purity: null,
  hasSaved: null,
  hasUpdated: null,
  isActiveUpdated: null
};

export const PURITY_FEATURE_NAME = 'purity';

export const selectPurityState = createFeatureSelector<PurityState>(
  PURITY_FEATURE_NAME
);

export function purityReducers(
  state: PurityState = initialState,
  action: PurityActions
) {
  switch (action.type) {
    case PurityActionTypes.LOAD_PURITY_LISTING:
    case PurityActionTypes.LOAD_PURITY_DETAIL_BY_MATERIAL_CODE_AND_PURITY:
    case PurityActionTypes.LOAD_METAL_TYPES:
      return {
        ...state,
        isLoading: true
      };

    case PurityActionTypes.LOAD_PURITY_LISTING_SUCCESS:
      return {
        ...state,
        isLoading: false,
        purityList: purityAdaptor.setAll(
          action.payload.purityList,
          state.purityList
        ),
        totalElements: action.payload.totalElements
      };

    case PurityActionTypes.LOAD_PURITY_LISTING_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: null
      };

    case PurityActionTypes.LOAD_RESET:
      return {
        ...state,
        error: null,
        purity: null,
        totalElements: null,
        isActiveUpdated: null,
        hasSaved: null,
        hasUpdated: null,
        purityList: purityAdaptor.removeAll(state.purityList)
      };

    case PurityActionTypes.LOAD_METAL_TYPES_SUCCESS:
      return {
        ...state,
        metalType: action.payload,
        isLoading: false
      };

    case PurityActionTypes.LOAD_PURITY_DETAIL_BY_MATERIAL_CODE_AND_PURITY_FAILURE:
    case PurityActionTypes.UPDATE_PURITY_DETAIL_FAILURE:
    case PurityActionTypes.LOAD_METAL_TYPES_FAILURE:
      return {
        ...state,
        error: action.payload
      };

    case PurityActionTypes.LOAD_PURITY_DETAIL_BY_MATERIAL_CODE_AND_PURITY_SUCCESS:
      return {
        ...state,
        purity: action.payload,
        isLoading: false
      };

    case PurityActionTypes.CREATE_PURITY:
      return {
        ...state,
        hasSaved: false,
        isLoading: true
      };
    case PurityActionTypes.CREATE_PURITY_SUCCESS:
      return {
        ...state,
        hasSaved: true,
        isLoading: false
      };

    case PurityActionTypes.CREATE_PURITY_FAILURE:
      return {
        ...state,
        hasSaved: false,
        isLoading: null,
        error: action.payload
      };

    case PurityActionTypes.UPDATE_PURITY_DETAIL:
      return {
        ...state,
        hasUpdated: false
      };
    case PurityActionTypes.UPDATE_PURITY_DETAIL_SUCCESS:
      return {
        ...state,
        hasUpdated: true
      };

    default:
      return state;
  }
}
