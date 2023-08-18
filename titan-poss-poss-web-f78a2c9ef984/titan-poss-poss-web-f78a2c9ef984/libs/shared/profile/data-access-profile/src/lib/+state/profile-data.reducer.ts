import { createFeatureSelector } from '@ngrx/store';

import {
  ProfileDataActionTypes,
  ProfileDataActions
} from './profile-data.actions';
import { ProfileDataState } from './profile-data.state';

export const PROFILEDATA_FEATURE_KEY = 'profileData';

export const selectProfileDataState = createFeatureSelector<ProfileDataState>(
  PROFILEDATA_FEATURE_KEY
);

export const initialState: ProfileDataState = {
  empName: '',
  email: '',
  userType: '',
  boutiqueType: '',
  boutiqueCode: '',
  boutiqueDesc: '',
  isBTQUser: null,
  isCorpUser: null,
  isRegUser: false,
  regionCode: '',
  isL1Boutique: false,
  isL2Boutique: false,
  isL3Boutique: false,
  error: null,
  orgCode: '',
  address: null,
  roles: [],
  cashierSignatureDetails: null,
  uploadEmployeeSignatureResponse: null,
  isLoading: false,
  signatureError: null
};

export function ProfileDataReducer(
  state: ProfileDataState = initialState,
  action: ProfileDataActions
): ProfileDataState {
  switch (action.type) {
    case ProfileDataActionTypes.CLEAR_PROFILE_DATA:
      return initialState;

    case ProfileDataActionTypes.LOAD_PROFILE_DATA:
      return {
        ...state,
        error: null
      };

    case ProfileDataActionTypes.LOAD_PROFILE_DATA_SUCCESS:
      return {
        ...state,
        error: null,
        email: action.payload.email,
        empName: action.payload.empName,
        userType: action.payload.userType,
        boutiqueCode: action.payload.boutiqueCode,
        boutiqueDesc: action.payload.boutiqueDesc,
        boutiqueType: action.payload.boutiqueType,
        isBTQUser: action.payload.isBTQUser,
        isCorpUser: action.payload.isCorpUser,
        isRegUser: action.payload.isRegUser,
        regionCode: action.payload.regionCode,
        isL1Boutique: action.payload.isL1Boutique,
        isL2Boutique: action.payload.isL2Boutique,
        isL3Boutique: action.payload.isL3Boutique,
        orgCode: action.payload.orgCode,
        address: action.payload.address,
        roles: action.payload.roles
      };
    case ProfileDataActionTypes.LOAD_PROFILE_DATA_FAILURE:
      return {
        ...state,
        error: action.payload
      };

    case ProfileDataActionTypes.LOAD_EMPLOYEE_SIGNATURE_DETAILS:
      return { ...state, isLoading: true, signatureError: null };

    case ProfileDataActionTypes.LOAD_EMPLOYEE_SIGNATURE_DETAILS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        cashierSignatureDetails: action.payload,
        signatureError: null
      };

    case ProfileDataActionTypes.LOAD_EMPLOYEE_SIGNATURE_DETAILS_FAILURE:
      return {
        ...state,
        isLoading: false,
        cashierSignatureDetails: null,
        signatureError: action.payload
      };

    case ProfileDataActionTypes.UPLOAD_EMPLOYEE_SIGNATURE:
      return { ...state, isLoading: true, signatureError: null };

    case ProfileDataActionTypes.UPLOAD_EMPLOYEE_SIGNATURE_SUCCESS:
      return {
        ...state,
        uploadEmployeeSignatureResponse: action.payload,
        signatureError: null,
        isLoading: false
      };
    case ProfileDataActionTypes.UPLOAD_EMPLOYEE_SIGNATURE_FAILURE:
      return {
        ...state,
        uploadEmployeeSignatureResponse: null,
        signatureError: action.payload,
        isLoading: false
      };

    default:
      return state;
  }
}
