import { createSelector } from '@ngrx/store';
import { selectDigitalSignatureState } from './digital-signature.reducer';

const selectError = createSelector(
  selectDigitalSignatureState,
  state => state.errors
);

const selectIsLoading = createSelector(
  selectDigitalSignatureState,
  state => state.isLoading
);

const selectGetStoreDetailsResponse = createSelector(
  selectDigitalSignatureState,
  state => state.getStoreDetailsResponse
);

const selectGetCustomerDetailsResponse = createSelector(
  selectDigitalSignatureState,
  state => state.getCustomerDetailsResponse
);

const selectGetCustomerDetailsForDigitalSignatureResponse = createSelector(
  selectDigitalSignatureState,
  state => state.getCustomerDetailsForDigitalSignatureResponse
);

const selectSendCustomerDetailsForDigitalSignatureResponse = createSelector(
  selectDigitalSignatureState,
  state => state.sendCustomerDetailsForDigitalSignatureResponse
);

const selectUploadDigitalSignatureResponse = createSelector(
  selectDigitalSignatureState,
  state => state.uploadDigitalSignatureResponse
);

const selectIsOtpGenerated = createSelector(
  selectDigitalSignatureState,
  state => state.isOTPGenerated
);

const selectIsOtpVerified = createSelector(
  selectDigitalSignatureState,
  state => state.isOTPVerified
);

const selectEmployeeSignatureDetailsResponse = createSelector(
  selectDigitalSignatureState,
  state => state.employeeSignatureDetailsResponse
);

const selectUploadEmployeeSignatureResponse = createSelector(
  selectDigitalSignatureState,
  state => state.uploadEmployeeSignatureResponse
);

export const DigitalSignatureSelectors = {
  selectError,
  selectIsLoading,
  selectGetStoreDetailsResponse,
  selectGetCustomerDetailsResponse,
  selectGetCustomerDetailsForDigitalSignatureResponse,
  selectSendCustomerDetailsForDigitalSignatureResponse,
  selectUploadDigitalSignatureResponse,
  selectIsOtpGenerated,
  selectIsOtpVerified,
  selectEmployeeSignatureDetailsResponse,
  selectUploadEmployeeSignatureResponse
};
