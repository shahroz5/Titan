import { createFeatureSelector } from '@ngrx/store';
import {
  DigitalSignatureActions,
  DigitalSignatureActionTypes
} from './digital-signature.actions';
import { DigitalSignatureState } from './digital-signature.state';

export const digitalSignatureFeatureKey = 'digital-signature';

export const selectDigitalSignatureState = createFeatureSelector<
  DigitalSignatureState
>(digitalSignatureFeatureKey);

export const initialState: DigitalSignatureState = {
  errors: null,
  isLoading: false,
  getStoreDetailsResponse: null,
  getCustomerDetailsResponse: null,
  getCustomerDetailsForDigitalSignatureResponse: null,
  sendCustomerDetailsForDigitalSignatureResponse: null,
  uploadDigitalSignatureResponse: null,
  isOTPGenerated: null,
  isOTPVerified: null,
  employeeSignatureDetailsResponse: null,
  uploadEmployeeSignatureResponse: null
};

export function DigitalSignatureReducer(
  state: DigitalSignatureState = initialState,
  action: DigitalSignatureActions
): DigitalSignatureState {
  switch (action.type) {
    case DigitalSignatureActionTypes.GET_STORE_DETAILS_FOR_DIGITAL_SIGNATURE:
    case DigitalSignatureActionTypes.GET_CUSTOMER_DETAILS:
    case DigitalSignatureActionTypes.GET_CUSTOMER_DETAILS_FOR_DIGITAL_SIGNATURE:
    case DigitalSignatureActionTypes.SEND_CUSTOMER_DETAILS_FOR_DIGITAL_SIGNATURE:
    case DigitalSignatureActionTypes.UPLOAD_DIGITAL_SIGNATURE:
    case DigitalSignatureActionTypes.GENERATE_OTP:
    case DigitalSignatureActionTypes.VALIDATE_OTP:
    case DigitalSignatureActionTypes.LOAD_EMPLOYEE_SIGNATURE_DETAILS:
    case DigitalSignatureActionTypes.UPLOAD_EMPLOYEE_SIGNATURE:
      return { ...state, isLoading: true, errors: null };

    case DigitalSignatureActionTypes.GET_STORE_DETAILS_FOR_DIGITAL_SIGNATURE_SUCCESS:
      return {
        ...state,
        getStoreDetailsResponse: action.payload,
        errors: null,
        isLoading: false
      };
    case DigitalSignatureActionTypes.GET_STORE_DETAILS_FOR_DIGITAL_SIGNATURE_FAILURE:
      return {
        ...state,
        getStoreDetailsResponse: null,
        errors: action.payload,
        isLoading: false
      };

    case DigitalSignatureActionTypes.GET_CUSTOMER_DETAILS_SUCCESS:
      return {
        ...state,
        getCustomerDetailsResponse: action.payload,
        errors: null,
        isLoading: false
      };
    case DigitalSignatureActionTypes.GET_CUSTOMER_DETAILS_FAILURE:
      return {
        ...state,
        getCustomerDetailsResponse: null,
        errors: action.payload,
        isLoading: false
      };
    case DigitalSignatureActionTypes.GET_CUSTOMER_DETAILS_FOR_DIGITAL_SIGNATURE_SUCCESS:
      return {
        ...state,
        getCustomerDetailsForDigitalSignatureResponse: action.payload,
        errors: null,
        isLoading: false
      };
    case DigitalSignatureActionTypes.GET_CUSTOMER_DETAILS_FOR_DIGITAL_SIGNATURE_FAILURE:
      return {
        ...state,
        getCustomerDetailsForDigitalSignatureResponse: null,
        errors: action.payload,
        isLoading: false
      };
    case DigitalSignatureActionTypes.SEND_CUSTOMER_DETAILS_FOR_DIGITAL_SIGNATURE_SUCCESS:
      return {
        ...state,
        sendCustomerDetailsForDigitalSignatureResponse: action.payload,
        errors: null,
        isLoading: false
      };
    case DigitalSignatureActionTypes.SEND_CUSTOMER_DETAILS_FOR_DIGITAL_SIGNATURE_FAILURE:
      return {
        ...state,
        sendCustomerDetailsForDigitalSignatureResponse: null,
        errors: action.payload,
        isLoading: false
      };
    case DigitalSignatureActionTypes.UPLOAD_DIGITAL_SIGNATURE_SUCCESS:
      return {
        ...state,
        uploadDigitalSignatureResponse: action.payload,
        errors: null,
        isLoading: false
      };
    case DigitalSignatureActionTypes.UPLOAD_DIGITAL_SIGNATURE_FAILURE:
      return {
        ...state,
        uploadDigitalSignatureResponse: null,
        errors: action.payload,
        isLoading: false
      };

    case DigitalSignatureActionTypes.GENERATE_OTP_SUCCESS:
      return {
        ...state,
        isOTPGenerated: action.payload,
        errors: null,
        isLoading: false
      };
    case DigitalSignatureActionTypes.GENERATE_OTP_FAILURE:
      return {
        ...state,
        isOTPGenerated: false,
        errors: action.payload,
        isLoading: false
      };
    case DigitalSignatureActionTypes.VALIDATE_OTP_SUCCESS:
      return {
        ...state,
        isOTPVerified: action.payload,
        errors: null,
        isLoading: false
      };
    case DigitalSignatureActionTypes.VALIDATE_OTP_FAILURE:
      return {
        ...state,
        isOTPVerified: false,
        errors: action.payload,
        isLoading: false
      };

    case DigitalSignatureActionTypes.LOAD_EMPLOYEE_SIGNATURE_DETAILS_SUCCESS:
      return {
        ...state,
        employeeSignatureDetailsResponse: action.payload,
        errors: null,
        isLoading: false
      };
    case DigitalSignatureActionTypes.LOAD_EMPLOYEE_SIGNATURE_DETAILS_FAILURE:
      return {
        ...state,
        employeeSignatureDetailsResponse: null,
        errors: action.payload,
        isLoading: false
      };

    case DigitalSignatureActionTypes.UPLOAD_EMPLOYEE_SIGNATURE_SUCCESS:
      return {
        ...state,
        uploadEmployeeSignatureResponse: action.payload,
        errors: null,
        isLoading: false
      };
    case DigitalSignatureActionTypes.UPLOAD_EMPLOYEE_SIGNATURE_FAILURE:
      return {
        ...state,
        uploadEmployeeSignatureResponse: null,
        errors: action.payload,
        isLoading: false
      };

    case DigitalSignatureActionTypes.RESET_DIGITAL_SIGNATURE:
      return {
        ...state,
        isLoading: false,
        errors: null,
        getStoreDetailsResponse: null,
        getCustomerDetailsResponse: null,
        getCustomerDetailsForDigitalSignatureResponse: null,
        sendCustomerDetailsForDigitalSignatureResponse: null,
        uploadDigitalSignatureResponse: null,
        isOTPGenerated: null,
        isOTPVerified: null,
        employeeSignatureDetailsResponse: null,
        uploadEmployeeSignatureResponse: null
      };
    default:
      return state;
  }
}
