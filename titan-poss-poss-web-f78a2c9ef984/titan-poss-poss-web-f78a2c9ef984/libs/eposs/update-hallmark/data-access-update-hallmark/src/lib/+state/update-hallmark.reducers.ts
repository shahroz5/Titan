import { UpdateHallmarkActionTypes, UpdateHallmarkAction } from './update-hallmark.action';
import { UpdateHallmarkState } from './update-hallmark.state';

import * as moment from 'moment';
import { createFeatureSelector } from '@ngrx/store';

export const updateHallmarkDetails = 'updateHallmarkDetails';

export const selectUpdateHallmarkState = createFeatureSelector<UpdateHallmarkState>(
  updateHallmarkDetails
);

export const initialBoutiqueStatisticsState: UpdateHallmarkState = {
  isLoading: false,
  error: null,
  isHallmarkDetailsUpdated: false
};

export function UpdateHallmarkReducer(
  state: UpdateHallmarkState = initialBoutiqueStatisticsState,
  action: UpdateHallmarkAction
): UpdateHallmarkState {
  switch (action.type) {
    case UpdateHallmarkActionTypes.UPDATE_ITEM_HALLMARK_DETAILS:
      return {
        ...state,
        isLoading: true,
        isHallmarkDetailsUpdated: false,
        error: null,
      };

    case UpdateHallmarkActionTypes.UPDATE_ITEM_HALLMARK_DETAILS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        isHallmarkDetailsUpdated: action.payload
      };

    case UpdateHallmarkActionTypes.UPDATE_ITEM_HALLMARK_DETAILS_FAILURE:
      return {
        ...state,
        isHallmarkDetailsUpdated: false,
        error: action.payload,
        isLoading: false
      };
    case UpdateHallmarkActionTypes.RESET_ERROR:
      return {
        ...state,
        error: null,
        isHallmarkDetailsUpdated: false
      };
    default:
      return state;
  }
}
