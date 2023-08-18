import { GlLocationPaymentState } from './gl-location.state';
import {
  GlLocationPaymentActions,
  GlLocationPaymentActionTypes
} from './gl-location.actions';
import { createFeatureSelector } from '@ngrx/store';
import { glLocPaymentAdapter } from './gl-location.entity';

export const GL_LOCATION_PAYMENT_FEATURE_KEY = 'glLocationPayment';
export const selectGlLocationPaymentState = createFeatureSelector<
  GlLocationPaymentState
>(GL_LOCATION_PAYMENT_FEATURE_KEY);
export const initialState: GlLocationPaymentState = {
  error: null,
  glLocationList: glLocPaymentAdapter.getInitialState(),
  isLoading: false,
  hasSaved: null,
  totalCount: 0,
  saveGlLocationPayment: null,
  paymentCodes: null,
  locationData: null
};

export function GlLocationPaymentReducer(
  state: GlLocationPaymentState = initialState,
  action: GlLocationPaymentActions
): GlLocationPaymentState {
  switch (action.type) {
    case GlLocationPaymentActionTypes.LOAD_GL_LOCATION_PAYMENT_LIST:
    case GlLocationPaymentActionTypes.LOAD_PAYMENT_CODES:
    case GlLocationPaymentActionTypes.GET_LOCATIONS:
      return {
        ...state,
        isLoading: true,
        hasSaved: false
      };

    case GlLocationPaymentActionTypes.LOAD_GL_LOCATION_PAYMENT_LIST_SUCCESS:
      return {
        ...state,
        glLocationList: glLocPaymentAdapter.setAll(
          action.payload.glLocationPaymentList,
          state.glLocationList
        ),
        totalCount: action.payload.count,
        isLoading: false,
        hasSaved: false,
        error: null
      };
    case GlLocationPaymentActionTypes.SAVE_GL_LOCATION_PAYMENT_DETAILS_SUCCESS:
      return {
        ...state,
        saveGlLocationPayment: action.payload,
        isLoading: false,
        hasSaved: true
      };
    case GlLocationPaymentActionTypes.UPDATE_GL_LOCATION_PAYMENT_DETAILS:
      return {
        ...state,
        isLoading: false,
        error: null,
        glLocationList: glLocPaymentAdapter.updateOne(
          {
            id: action.payload.id,
            changes: {
              glCode: action.payload.glCode,
              paymentCode: action.payload.paymentCode
            }
          },
          state.glLocationList
        )
      };

    case GlLocationPaymentActionTypes.DELETE_GL_LOCATION_PAYMENT_DETAILS:
      return {
        ...state,
        glLocationList: glLocPaymentAdapter.removeOne(
          action.payload,
          state.glLocationList
        ),
        isLoading: false,
        hasSaved: false
      };

    case GlLocationPaymentActionTypes.LOAD_PAYMENT_CODES_SUCCESS:
      return {
        ...state,
        paymentCodes: action.payload,
        isLoading: false,
        hasSaved: false
      };

    case GlLocationPaymentActionTypes.GET_LOCATIONS_SUCCESS:
      return {
        ...state,
        locationData: action.payload,
        isLoading: false
      };
    case GlLocationPaymentActionTypes.RESET_GL_LOCATION_PAYMENT:
      return {
        ...state,
        glLocationList: glLocPaymentAdapter.getInitialState(),
        isLoading: false,
        hasSaved: false,
        error: null
      };
    case GlLocationPaymentActionTypes.LOAD_GL_LOCATION_PAYMENT_LIST_FAILURE:
    case GlLocationPaymentActionTypes.SAVE_GL_LOCATION_PAYMENT_DETAILS_FAILURE:
    case GlLocationPaymentActionTypes.LOAD_PAYMENT_CODES_FAILURE:
    case GlLocationPaymentActionTypes.GET_LOCATIONS_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
        hasSaved: false
      };
    default:
      return state;
  }
}
