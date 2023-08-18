import { createFeatureSelector } from '@ngrx/store';
import {
  UpgradeVersionKey,
  UpgradeversionState
} from './upgrade-version.state';
import {
  UpgradeVersionActionTypes,
  UpgradeVersionActions
} from './upgrade-version.actions';

export const selectUpgradeVersionState = createFeatureSelector<
  UpgradeversionState
>(UpgradeVersionKey);
export const initialState: UpgradeversionState = {
  errors: null,
  isLoading: false,
  upgradeVersion: null,
  upgradeVersionResponse: null
};

export function UpgradeVersionReducer(
  state: UpgradeversionState = initialState,
  action: UpgradeVersionActions
): UpgradeversionState {
  switch (action.type) {
    case UpgradeVersionActionTypes.GET_IS_UPDATE_AVAILABLE:
      return {
        ...state,
        upgradeVersion: null,
        isLoading: true,
        errors: null
      };
    case UpgradeVersionActionTypes.GET_IS_UPDATE_AVAILABLE_SUCCESS:
      return {
        ...state,
        upgradeVersion: action.payload,
        isLoading: false,
        errors: null
      };
    case UpgradeVersionActionTypes.GET_IS_UPDATE_AVAILABLE_FAILURE:
      return {
        ...state,
        upgradeVersion: null,
        isLoading: false,
        errors: action.payload
      };

    case UpgradeVersionActionTypes.SEND_REQUEST_FOR_UPGRADE:
      return {
        ...state,
        upgradeVersionResponse: null,
        isLoading: true,
        errors: null
      };
    case UpgradeVersionActionTypes.SEND_REQUEST_FOR_UPGRADE_SUCCESS:
      return {
        ...state,
        upgradeVersionResponse: action.payload,
        isLoading: false,
        errors: null
      };
    case UpgradeVersionActionTypes.SEND_REQUEST_FOR_UPGRADE_FAILURE:
      return {
        ...state,
        upgradeVersionResponse: null,
        isLoading: false,
        errors: action.payload
      };
    default:
      return state;
  }
}
