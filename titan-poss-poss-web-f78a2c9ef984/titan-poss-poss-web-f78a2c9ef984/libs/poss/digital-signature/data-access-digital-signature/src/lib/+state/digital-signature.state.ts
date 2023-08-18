import {
  CustomerDigitalSignatureResponse,
  CustomErrors,
  EmployeeSignatureDetailsResponse,
  StoreDetailsResponse
} from '@poss-web/shared/models';

export class DigitalSignatureState {
  errors?: CustomErrors;
  isLoading?: boolean;
  getStoreDetailsResponse: StoreDetailsResponse;
  getCustomerDetailsForDigitalSignatureResponse: CustomerDigitalSignatureResponse[];
  getCustomerDetailsResponse: CustomerDigitalSignatureResponse[];
  sendCustomerDetailsForDigitalSignatureResponse: CustomerDigitalSignatureResponse;
  uploadDigitalSignatureResponse: CustomerDigitalSignatureResponse;
  isOTPGenerated: boolean;
  isOTPVerified: boolean;
  employeeSignatureDetailsResponse: EmployeeSignatureDetailsResponse;
  uploadEmployeeSignatureResponse: any;
}
