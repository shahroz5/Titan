import { MetalTypeActions, MetalTypeAction } from './metal-type.actions';
import { MetalTypeState } from './metal-type.state';
import { metalTypeAdaptor } from './metal-type.entity';
import { createFeatureSelector } from '@ngrx/store';

export const initialState: MetalTypeState = {
  metalTypeList: metalTypeAdaptor.getInitialState(),
  isLoading: null,
  error: null,
  totalElements: null,
  hasSaved: null,
  hasUpdated: null,
  metalType: null,
  materialTypeLov: null
};

export const METAL_FEATURE_NAME = 'metal-type';

export const selectMetalTypeState = createFeatureSelector<MetalTypeState>(
  METAL_FEATURE_NAME
);
export function metalTypeReducer(
  state: any = initialState,
  action: MetalTypeAction
) {
  switch (action.type) {
    case MetalTypeActions.SEARCH_METAL_TYPE_BY_MATERIAL_CODE:
    case MetalTypeActions.LOAD_MATERIAL_TYPE_LOV:
    case MetalTypeActions.LOAD_METAL_TYPE_LISTING:
    case MetalTypeActions.LOAD_METAL_TYPE_DETAIL_BY_MATERIAL_CODE:
      return {
        ...state,
        isLoading: true
      };

    case MetalTypeActions.SEARCH_METAL_TYPE_BY_MATERIAL_CODE_SUCCESS:
    case MetalTypeActions.LOAD_METAL_TYPE_LISTING_SUCCESS:
      return {
        ...state,
        isLoading: false,
        metalTypeList: metalTypeAdaptor.setAll(
          action.payload.results,
          state.metalTypeList
        ),
        totalElements: action.payload.totalElements
      };
    case MetalTypeActions.LOAD_METAL_TYPE_LISTING_FAILURE:
    case MetalTypeActions.LOAD_METAL_TYPE_DETAIL_BY_MATERIAL_CODE_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    case MetalTypeActions.SEARCH_METAL_TYPE_BY_MATERIAL_CODE_FAILURE:
      return {
        ...state,
        isLoading: null,
        error: action.payload,
        metalTypeList: metalTypeAdaptor.removeAll(state.metalTypeList)
      };

    case MetalTypeActions.CREATE_METAL_TYPE:
      return {
        ...state,
        hasSaved: false
      };
    case MetalTypeActions.CREATE_METAL_TYPE_SUCCESS:
      return {
        ...state,
        hasSaved: true
      };
    case MetalTypeActions.CREATE_METAL_TYPE_FAILURE:
      return {
        ...state,
        hasSaved: null,
        error: action.payload
      };

    case MetalTypeActions.UPDATE_METAL_TYPE_DETAIL:
      return {
        ...state,
        hasUpdated: false
      };
    case MetalTypeActions.UPDATE_METAL_TYPE_DETAIL_SUCCESS:
      return {
        ...state,
        hasUpdated: true
      };

    case MetalTypeActions.UPDATE_METAL_TYPE_DETAIL_FAILURE:
      return {
        ...state,
        hasUpdated: false,
        error: action.payload
      };

    case MetalTypeActions.LOAD_METAL_TYPE_DETAIL_BY_MATERIAL_CODE_SUCCESS:
      return {
        ...state,
        metalType: action.payload,
        isLoading: false
      };

    case MetalTypeActions.LOAD_MATERIAL_TYPE_LOV_FAILURE:
      return {
        ...state,
        isLoading: null,
        error: action.payload
      };

    case MetalTypeActions.LOAD_MATERIAL_TYPE_LOV_SUCCESS:
      return {
        ...state,
        isLoading: false,
        materialTypeLov: action.payload
      };

    case MetalTypeActions.LOAD_RESET:
      return {
        ...state,
        error: null,
        isLoading: null,
        hasUpdated: null,
        totalElements: null,
        hasSaved: null,
        metalType: null,
        metalTypeList: metalTypeAdaptor.removeAll(state.metalTypeList)
      };

    default:
      return { ...state };
  }
}
