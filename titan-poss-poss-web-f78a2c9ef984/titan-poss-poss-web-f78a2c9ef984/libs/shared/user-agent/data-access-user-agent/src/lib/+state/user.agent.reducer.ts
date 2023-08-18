import { UAActionTypes, UAActions } from './user-agent.actions';
import { AuthState, UserAgentState } from '@poss-web/shared/models';
import { createFeatureSelector } from '@ngrx/store';

export const UA_FEATURE_KEY = 'user-agent';

export const selectUAState = createFeatureSelector<UserAgentState>(
  UA_FEATURE_KEY
);

const initialUAState: UserAgentState = {
  enableUnipay: false,
  hostname: '',
  isLoading: false,
  error: null
};

export function UAReducer(
  state: UserAgentState = initialUAState,
  action: UAActions
): UserAgentState {
  switch (action.type) {
    case UAActionTypes.GET_ENCRYPTED_HOSTNAME: {
      return {
        ...state,
        isLoading: true
      };
    }

    case UAActionTypes.GET_ENCRYPTED_HOSTNAME_SUCCESS:
      return {
        ...state,
        isLoading: false,
        hostname: action.payload.hostname
      };
    case UAActionTypes.GET_ENCRYPTED_HOSTNAME_FAILURE:

    default: {
      return state;
    }
  }
}
