import { ActivateUserState } from './activate-user.state';
import {
  ActivateUserActions,
  ActivateUserActionTypes
} from './activate-user.actions';

import { createFeatureSelector } from '@ngrx/store';

export const ACTIVATEUSER_FEATURE_KEY = 'activateUser';

export const selectActivateUserState = createFeatureSelector<ActivateUserState>(
  ACTIVATEUSER_FEATURE_KEY
);

const initialState: ActivateUserState = {
  generatedOtp: false,
  verifiedOtp: false,
  username: '',
  error: null,
  isLoading: false
};

export function ActivateUserReducer(
  state: ActivateUserState = initialState,
  action: ActivateUserActions
): ActivateUserState {
  switch (action.type) {
    case ActivateUserActionTypes.GENERATE_OTP:
      return {
        ...state,
        isLoading: true,
        username: action.payload,
        generatedOtp: false,
        error: null
      };

    case ActivateUserActionTypes.GENERATE_OTP_SUCCESS:
      return {
        ...state,
        generatedOtp: true,
        verifiedOtp: false,
        isLoading: false
      };

    case ActivateUserActionTypes.GENERATE_OTP_FAILURE:
      return {
        ...state,
        isLoading: false,
        generatedOtp: false,
        username: '',
        error: action.payload
      };

    case ActivateUserActionTypes.RESET_OTP_VERIFICATION:
      return {
        ...state,
        verifiedOtp: false,
        error: null
      };

    case ActivateUserActionTypes.VERIFY_OTP:
      return {
        ...state,
        isLoading: true,
        verifiedOtp: false,
        error: null
      };

    case ActivateUserActionTypes.VERIFY_OTP_SUCCESS:
      return {
        ...state,
        verifiedOtp: true,
        isLoading: false
      };

    case ActivateUserActionTypes.VERIFY_OTP_FAILURE:
      return {
        ...state,
        isLoading: false,
        verifiedOtp: false,
        error: action.payload
      };

    default:
      return state;
  }
}
