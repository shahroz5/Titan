import { createFeatureSelector } from '@ngrx/store';
import { TepStoneConfigState } from './tep-stone-config.state';
import {
  tepStoneConfigAdaptor,
  tepStoneConfigDetailsAdaptor
} from './tep-stone-config.entity';
import {
  TepStoneConfigActions,
  TepStoneConfigActionTypes
} from './tep-stone-config.actons';
import { Update } from '@ngrx/entity';
import { TEPStoneConfigDetails } from '@poss-web/shared/models';

export const initialState: TepStoneConfigState = {
  tepStoneConfiglist: tepStoneConfigAdaptor.getInitialState(),
  tepStoneConfigDetails: null,
  totalElements: null,
  tepStoneConfigDetailslist: tepStoneConfigDetailsAdaptor.getInitialState(),
  tepStoneConfigDetailsData: null,
  totalDetailsElements: null,
  tepStoneConfigQualities: null,
  tepStoneConfigStoneType: null,
  tepStoneConfigRange: null,
  error: null,
  isLoading: null,
  hasSaved: null,
  hasUpdated: null
};

export const TEP_STONE_CONFIG_FEATURE_NAME = 'tep_stone_config';

export const selectTepStoneConfig = createFeatureSelector<TepStoneConfigState>(
  TEP_STONE_CONFIG_FEATURE_NAME
);

export function tepStoneConfigReducer(
  state: TepStoneConfigState = initialState,
  action: TepStoneConfigActions
): TepStoneConfigState {
  switch (action.type) {
    case TepStoneConfigActionTypes.LOAD_TEP_STONE_CONFIG_LISTING:
    case TepStoneConfigActionTypes.SEARCH_TEP_STONE_CONFIG:
      return {
        ...state,
        tepStoneConfigDetails: null,
        error: null,
        isLoading: true,
        hasSaved: null,
        hasUpdated: null
      };

    case TepStoneConfigActionTypes.LOAD_TEP_STONE_CONFIG_LISTING_SUCCESS:
    case TepStoneConfigActionTypes.SEARCH_TEP_STONE_CONFIG_SUCCESS:
      return {
        ...state,
        tepStoneConfiglist: tepStoneConfigAdaptor.setAll(
          action.payload.results,
          state.tepStoneConfiglist
        ),
        totalElements: action.payload.totalElements,
        error: null,
        isLoading: false
      };

    case TepStoneConfigActionTypes.LOAD_TEP_STONE_CONFIG_LISTING_FAILURE:
    case TepStoneConfigActionTypes.SEARCH_TEP_STONE_CONFIG_FAILURE:
    case TepStoneConfigActionTypes.SEARCH_TEP_STONE_CONFIG_DATA_LISTING_FAILURE:
      return {
        ...state,
        tepStoneConfigDetailslist: tepStoneConfigDetailsAdaptor.removeAll(
          state.tepStoneConfigDetailslist
        ),
        error: null,
        isLoading: false
      };
    //
    case TepStoneConfigActionTypes.LOAD_TEP_STONE_CONFIG_DATA_LISTING:
      return {
        ...state,
        tepStoneConfigDetailslist: tepStoneConfigDetailsAdaptor.getInitialState(),
        error: null,
        isLoading: true,
        hasSaved: null,
        hasUpdated: null
      };

    case TepStoneConfigActionTypes.LOAD_TEP_STONE_CONFIG_DATA_LISTING_SUCCESS:
    case TepStoneConfigActionTypes.SEARCH_TEP_STONE_CONFIG_DATA_LISTING_SUCCESS:
      return {
        ...state,
        tepStoneConfigDetailslist: tepStoneConfigDetailsAdaptor.setAll(
          action.payload.results,
          state.tepStoneConfigDetailslist
        ),
        totalElements: action.payload.totalElements,
        error: null,
        isLoading: false
      };

    case TepStoneConfigActionTypes.LOAD_TEP_STONE_CONFIG_DATA_LISTING_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    case TepStoneConfigActionTypes.SEARCH_TEP_STONE_CONFIG_DATA_LISTING:
      return {
        ...state,
        error: null,
        isLoading: true,
        hasSaved: null,
        hasUpdated: null
      };
    //
    case TepStoneConfigActionTypes.LOAD_TEP_STONE_CONFIG:
      return {
        ...state,
        tepStoneConfigDetails: null,
        tepStoneConfigDetailslist: tepStoneConfigDetailsAdaptor.removeAll(
          state.tepStoneConfigDetailslist
        ),
        error: null,
        isLoading: true,
        hasSaved: null,
        hasUpdated: null
      };

    case TepStoneConfigActionTypes.LOAD_TEP_STONE_CONFIG_SUCCESS:
      return {
        ...state,
        tepStoneConfigDetails: action.payload,
        isLoading: false
      };

    case TepStoneConfigActionTypes.LOAD_TEP_STONE_CONFIG_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    case TepStoneConfigActionTypes.SAVE_TEP_STONE_CONFIG:
      return {
        ...state,
        error: null,
        isLoading: true,
        hasSaved: null,
        hasUpdated: null
      };

    case TepStoneConfigActionTypes.SAVE_TEP_STONE_CONFIG_SUCCESS:
      return {
        ...state,
        tepStoneConfigDetails: action.payload,
        isLoading: false,
        hasSaved: true
      };

    case TepStoneConfigActionTypes.SAVE_TEP_STONE_CONFIG_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    case TepStoneConfigActionTypes.UPDATE_TEP_STONE_CONFIG:
      return {
        ...state,
        error: null,
        isLoading: true,
        hasSaved: null,
        hasUpdated: null
      };

    case TepStoneConfigActionTypes.UPDATE_TEP_STONE_CONFIG_SUCCESS:
      return {
        ...state,
        tepStoneConfigDetails: action.payload,
        isLoading: false,
        hasUpdated: true
      };

    case TepStoneConfigActionTypes.UPDATE_TEP_STONE_CONFIG_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    case TepStoneConfigActionTypes.LOAD_TEP_STONE_TYPES_LIST:
      return {
        ...state,
        error: null,
        tepStoneConfigStoneType: null,
        isLoading: true,
        hasSaved: null,
        hasUpdated: null
      };
    case TepStoneConfigActionTypes.LOAD_TEP_STONE_TYPES_LIST_SUCCESS:
      return {
        ...state,
        tepStoneConfigStoneType: action.payload,
        isLoading: false,
        hasUpdated: false
      };
    case TepStoneConfigActionTypes.LOAD_TEP_STONE_TYPES_LIST_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    case TepStoneConfigActionTypes.LOAD_TEP_STONE_QUALITIES_LIST:
      return {
        ...state,
        error: null,
        isLoading: true,
        hasSaved: null,
        hasUpdated: null
      };
    case TepStoneConfigActionTypes.LOAD_TEP_STONE_QUALITIES_LIST_SUCCESS:
      return {
        ...state,
        tepStoneConfigQualities: action.payload,
        isLoading: false,
        hasUpdated: false
      };
    case TepStoneConfigActionTypes.LOAD_TEP_STONE_QUALITIES_LIST_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    case TepStoneConfigActionTypes.LOAD_TEP_STONE_RANGE_LIST:
      return {
        ...state,
        error: null,
        isLoading: true,
        hasSaved: null,
        hasUpdated: null
      };
    case TepStoneConfigActionTypes.LOAD_TEP_STONE_RANGE_LIST_SUCCESS:
      return {
        ...state,
        tepStoneConfigRange: action.payload,
        isLoading: false,
        hasUpdated: false
      };
    case TepStoneConfigActionTypes.LOAD_TEP_STONE_QUALITIES_LIST_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    case TepStoneConfigActionTypes.SAVE_TEP_STONE_CONFIG_DATA_DETAILS:
      return {
        ...state,
        error: null,
        isLoading: true,
        hasSaved: null,
        hasUpdated: null
      };

    case TepStoneConfigActionTypes.SAVE_TEP_STONE_CONFIG_DATA_DETAILS_SUCCESS:
      return {
        ...state,
        tepStoneConfigDetailslist: tepStoneConfigDetailsAdaptor.addMany(
          action.payload.results,
          state.tepStoneConfigDetailslist
        ),
        isLoading: false,
        hasSaved: true
      };

    case TepStoneConfigActionTypes.SAVE_TEP_STONE_CONFIG_DATA_DETAILS_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    case TepStoneConfigActionTypes.EDIT_TEP_STONE_CONFIG_DATA_DETAILS:
      return {
        ...state,
        error: null,
        isLoading: true,
        hasSaved: null,
        hasUpdated: null
      };

    case TepStoneConfigActionTypes.EDIT_TEP_STONE_CONFIG_DATA_DETAILS_SUCCESS:
      return {
        ...state,
        tepStoneConfigDetailslist: tepStoneConfigDetailsAdaptor.updateMany(
          action.payload.results.map(
            (data): Update<TEPStoneConfigDetails> => ({
              id: data.id,
              changes: {
                ...data
              }
            })
          ),
          state.tepStoneConfigDetailslist
        ),
        isLoading: false,
        hasSaved: true
      };

    case TepStoneConfigActionTypes.EDIT_TEP_STONE_CONFIG_DATA_DETAILS_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    case TepStoneConfigActionTypes.REMOVE_TEP_STONE_CONFIG_DATA_DETAILS:
      return {
        ...state,
        error: null,
        isLoading: true,
        hasSaved: null,
        hasUpdated: null
      };

    case TepStoneConfigActionTypes.REMOVE_TEP_STONE_CONFIG_DATA_DETAILS_SUCCESS:
      return {
        ...state,
        tepStoneConfigDetailslist: tepStoneConfigDetailsAdaptor.removeMany(
          action.payload,
          state.tepStoneConfigDetailslist
        ),
        isLoading: false,
        hasSaved: true
      };

    case TepStoneConfigActionTypes.REMOVE_TEP_STONE_CONFIG_DATA_DETAILS_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    default:
      return { ...state };
  }
}
