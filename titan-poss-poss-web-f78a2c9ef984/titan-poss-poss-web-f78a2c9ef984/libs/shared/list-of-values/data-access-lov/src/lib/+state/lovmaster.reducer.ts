import { LovMasterState } from './lovmaster.state';
import { LovActionTypes, LovMasterActions } from './lovmaster.actons';
import { createFeatureSelector } from '@ngrx/store';

export const initialState: LovMasterState = {
  lovMasterTypes: null,
  lovMasterTypesMain: null,
  lovMasterListing: null,
  lovMasterDetails: null,
  saveLovMasterDetails: null,
  editLovMasterDetails: null,
  totalMasterDetails: 0,
  error: null,
  isLoading: false
};

export const LOV_MASTER_FEATURE_KEY = 'lovMaster';
export const selectLovMasterState = createFeatureSelector<LovMasterState>(
  LOV_MASTER_FEATURE_KEY
);

export function LovMasterReducer(
  state: LovMasterState = initialState,
  action: LovMasterActions
): LovMasterState {
  switch (action.type) {
    case LovActionTypes.LOAD_LOV_TYPES:
      return {
        ...state,
        saveLovMasterDetails: null,
        editLovMasterDetails: null,
        isLoading: true
      };

    case LovActionTypes.LOAD_LOV_TYPES_SUCCESS:
      return {
        ...state,
        lovMasterTypes: action.payload,
        isLoading: false
      };

    case LovActionTypes.LOAD_LOV_TYPES_MAIN:
      return {
        ...state,
        saveLovMasterDetails: null,
        editLovMasterDetails: null,
        isLoading: true
      };

    case LovActionTypes.LOAD_LOV_TYPES_MAIN_SUCCESS:
      return {
        ...state,
        lovMasterTypesMain: action.payload,
        isLoading: false
      };
    case LovActionTypes.LOAD_LOV_TYPES_FAILURE:
    case LovActionTypes.SAVE_LOV_TOWN_FAILURE:
    case LovActionTypes.EDIT_LOV_TOWN_FAILURE:
    case LovActionTypes.LOAD_LOV_TYPES_MAIN_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    case LovActionTypes.LOAD_LOV_LISTING:
    case LovActionTypes.SAVE_LOV_TOWN:
    case LovActionTypes.EDIT_LOV_TOWN:
      return {
        ...state,
        isLoading: true
      };

    case LovActionTypes.LOAD_LOV_LISTING_SUCCESS:
      return {
        ...state,
        lovMasterListing: action.payload.LovListing,
        totalMasterDetails: action.payload.totalElements,
        isLoading: false
      };

    case LovActionTypes.LOAD_LOV_LISTING_FAILURE:
      return {
        ...state,
        lovMasterListing: null,
        totalMasterDetails: 0,
        error: action.payload,
        isLoading: false
      };

    case LovActionTypes.NO_LOVTYPE_LISTING:
      return {
        ...state,
        lovMasterListing: null,
        totalMasterDetails: 0
      };

    case LovActionTypes.SAVE_LOV_TOWN_SUCCESS:
      return {
        ...state,
        saveLovMasterDetails: action.payload,
        isLoading: false
      };

    case LovActionTypes.EDIT_LOV_TOWN_SUCCESS:
      return {
        ...state,
        lovMasterListing: action.payload.LovListing,
        totalMasterDetails: action.payload.totalElements,
        editLovMasterDetails: action.payload.LovListing,
        isLoading: false
      };

    case LovActionTypes.RESET_LOV_DIALOG_DATA:
      return { ...state, ...initialState };

    default:
      return state;
  }
}
