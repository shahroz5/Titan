import { Action } from '@ngrx/store';
import {
  CustomerDigitalSignatureRequestPayload,
  CustomerDigitalSignatureResponse,
  CustomErrors,
  EmployeeSignatureDetailsResponse,
  StoreDetailsResponse
} from '@poss-web/shared/models';

export enum DigitalSignatureActionTypes {
  GET_STORE_DETAILS_FOR_DIGITAL_SIGNATURE = '[Digital Signature] Get Store Details For Digital Signature',
  GET_STORE_DETAILS_FOR_DIGITAL_SIGNATURE_SUCCESS = '[Digital Signature] Get Store Details For Digital Signature Success',
  GET_STORE_DETAILS_FOR_DIGITAL_SIGNATURE_FAILURE = '[Digital Signature] Get Store Details For Digital Signature Failure',
  GET_CUSTOMER_DETAILS = '[Digital Signature] Get Customer Details',
  GET_CUSTOMER_DETAILS_SUCCESS = '[Digital Signature] Get Customer Details Success',
  GET_CUSTOMER_DETAILS_FAILURE = '[Digital Signature] Get Customer Details Failure',
  GET_CUSTOMER_DETAILS_FOR_DIGITAL_SIGNATURE = '[Digital Signature] Get Customer Details For Digital Signature',
  GET_CUSTOMER_DETAILS_FOR_DIGITAL_SIGNATURE_SUCCESS = '[Digital Signature] Get Customer Details For Digital Signature Success',
  GET_CUSTOMER_DETAILS_FOR_DIGITAL_SIGNATURE_FAILURE = '[Digital Signature] Get Customer Details For Digital Signature Failure',
  SEND_CUSTOMER_DETAILS_FOR_DIGITAL_SIGNATURE = '[Digital Signature] Send Customer Details For Digital Signature',
  SEND_CUSTOMER_DETAILS_FOR_DIGITAL_SIGNATURE_SUCCESS = '[Digital Signature] Send Customer Details For Digital Signature Success',
  SEND_CUSTOMER_DETAILS_FOR_DIGITAL_SIGNATURE_FAILURE = '[Digital Signature] Send Customer Details For Digital Signature Failure',
  UPLOAD_DIGITAL_SIGNATURE = '[Digital Signature] Upload Digital Signature',
  UPLOAD_DIGITAL_SIGNATURE_SUCCESS = '[Digital Signature] Upload Digital Signature Success',
  UPLOAD_DIGITAL_SIGNATURE_FAILURE = '[Digital Signature] Upload Digital Signature Failure',

  GENERATE_OTP = '[Digital Signature] Generate OTP',
  GENERATE_OTP_SUCCESS = '[Digital Signature] Generate OTP Success',
  GENERATE_OTP_FAILURE = '[Digital Signature] Generate OTP Failure',

  VALIDATE_OTP = '[Digital Signature] Validate OTP',
  VALIDATE_OTP_SUCCESS = '[Digital Signature] Validate OTP Success',
  VALIDATE_OTP_FAILURE = '[Digital Signature] Validate OTP Failure',

  LOAD_EMPLOYEE_SIGNATURE_DETAILS = '[Digital Signature] Load Employee Signature Details',
  LOAD_EMPLOYEE_SIGNATURE_DETAILS_SUCCESS = '[Digital Signature] Load Employee Signature Details Success',
  LOAD_EMPLOYEE_SIGNATURE_DETAILS_FAILURE = '[Digital Signature] Load Employee Signature Details Failure',

  UPLOAD_EMPLOYEE_SIGNATURE = '[Digital Signature] Load Employee Signature',
  UPLOAD_EMPLOYEE_SIGNATURE_SUCCESS = '[Digital Signature] Load Employee Signature Success',
  UPLOAD_EMPLOYEE_SIGNATURE_FAILURE = '[Digital Signature] Load Employee Signature Failure',

  RESET_DIGITAL_SIGNATURE = '[Digital Signature] RESET DIGITAL SIGNATURE'
}

export class GetStoreDetailsForDigitalSignature implements Action {
  readonly type =
    DigitalSignatureActionTypes.GET_STORE_DETAILS_FOR_DIGITAL_SIGNATURE;
}

export class GetStoreDetailsForDigitalSignatureSuccess implements Action {
  readonly type =
    DigitalSignatureActionTypes.GET_STORE_DETAILS_FOR_DIGITAL_SIGNATURE_SUCCESS;
  constructor(public payload: StoreDetailsResponse) {}
}

export class GetStoreDetailsForDigitalSignatureFailure implements Action {
  readonly type =
    DigitalSignatureActionTypes.GET_STORE_DETAILS_FOR_DIGITAL_SIGNATURE_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class GetCustomerDetails implements Action {
  readonly type = DigitalSignatureActionTypes.GET_CUSTOMER_DETAILS;
  constructor(readonly mobileNumber?: string, readonly ulpNumber?: string) {}
}
export class GetCustomerDetailsSuccess implements Action {
  readonly type = DigitalSignatureActionTypes.GET_CUSTOMER_DETAILS_SUCCESS;
  constructor(readonly payload: CustomerDigitalSignatureResponse[]) {}
}
export class GetCustomerDetailsFailure implements Action {
  readonly type = DigitalSignatureActionTypes.GET_CUSTOMER_DETAILS_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}
export class GetCustomerDetailsForDigitalSignature implements Action {
  readonly type =
    DigitalSignatureActionTypes.GET_CUSTOMER_DETAILS_FOR_DIGITAL_SIGNATURE;
  constructor(
    readonly customerType: string,
    readonly mobileNumber?: string,
    readonly ulpNumber?: string
  ) {}
}
export class GetCustomerDetailsForDigitalSignatureSuccess implements Action {
  readonly type =
    DigitalSignatureActionTypes.GET_CUSTOMER_DETAILS_FOR_DIGITAL_SIGNATURE_SUCCESS;
  constructor(readonly payload: CustomerDigitalSignatureResponse[]) {}
}
export class GetCustomerDetailsForDigitalSignatureFailure implements Action {
  readonly type =
    DigitalSignatureActionTypes.GET_CUSTOMER_DETAILS_FOR_DIGITAL_SIGNATURE_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class SendCustomerDetailsForDigitalSignature implements Action {
  readonly type =
    DigitalSignatureActionTypes.SEND_CUSTOMER_DETAILS_FOR_DIGITAL_SIGNATURE;
  constructor(readonly payload: CustomerDigitalSignatureRequestPayload) {}
}
export class SendCustomerDetailsForDigitalSignatureSuccess implements Action {
  readonly type =
    DigitalSignatureActionTypes.SEND_CUSTOMER_DETAILS_FOR_DIGITAL_SIGNATURE_SUCCESS;
  constructor(readonly payload: CustomerDigitalSignatureResponse) {}
}
export class SendCustomerDetailsForDigitalSignatureFailure implements Action {
  readonly type =
    DigitalSignatureActionTypes.SEND_CUSTOMER_DETAILS_FOR_DIGITAL_SIGNATURE_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class UploadDigitalSignature implements Action {
  readonly type = DigitalSignatureActionTypes.UPLOAD_DIGITAL_SIGNATURE;
  constructor(
    readonly mobileNumber: string,
    readonly customerType: string,
    readonly payload: string
  ) {}
}
export class UploadDigitalSignatureSuccess implements Action {
  readonly type = DigitalSignatureActionTypes.UPLOAD_DIGITAL_SIGNATURE_SUCCESS;
  constructor(readonly payload: CustomerDigitalSignatureResponse) {}
}
export class UploadDigitalSignatureFailure implements Action {
  readonly type = DigitalSignatureActionTypes.UPLOAD_DIGITAL_SIGNATURE_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class GenerateOtp implements Action {
  readonly type = DigitalSignatureActionTypes.GENERATE_OTP;
  constructor(readonly payload: string) {}
}

export class GenerateOtpSuccess implements Action {
  readonly type = DigitalSignatureActionTypes.GENERATE_OTP_SUCCESS;
  constructor(readonly payload: boolean) {}
}

export class GenerateOtpFailure implements Action {
  readonly type = DigitalSignatureActionTypes.GENERATE_OTP_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class ValidateOtp implements Action {
  readonly type = DigitalSignatureActionTypes.VALIDATE_OTP;
  constructor(readonly customerId: string, readonly token: string) {}
}

export class ValidateOtpSuccess implements Action {
  readonly type = DigitalSignatureActionTypes.VALIDATE_OTP_SUCCESS;
  constructor(readonly payload: boolean) {}
}

export class ValidateOtpFailure implements Action {
  readonly type = DigitalSignatureActionTypes.VALIDATE_OTP_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class LoadEmployeeSignatureDetails implements Action {
  readonly type = DigitalSignatureActionTypes.LOAD_EMPLOYEE_SIGNATURE_DETAILS;
  constructor(readonly employeeCode: string) {}
}

export class LoadEmployeeSignatureDetailsSuccess implements Action {
  readonly type =
    DigitalSignatureActionTypes.LOAD_EMPLOYEE_SIGNATURE_DETAILS_SUCCESS;
  constructor(readonly payload: EmployeeSignatureDetailsResponse) {}
}

export class LoadEmployeeSignatureDetailsFailure implements Action {
  readonly type =
    DigitalSignatureActionTypes.LOAD_EMPLOYEE_SIGNATURE_DETAILS_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class UploadEmployeeSignature implements Action {
  readonly type = DigitalSignatureActionTypes.UPLOAD_EMPLOYEE_SIGNATURE;
  constructor(
    readonly employeeCode: string,
    readonly cashierSignature: string
  ) {}
}

export class UploadEmployeeSignatureSuccess implements Action {
  readonly type = DigitalSignatureActionTypes.UPLOAD_EMPLOYEE_SIGNATURE_SUCCESS;
  constructor(readonly payload: EmployeeSignatureDetailsResponse) {}
}

export class UploadEmployeeSignatureFailure implements Action {
  readonly type = DigitalSignatureActionTypes.UPLOAD_EMPLOYEE_SIGNATURE_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class ResetDigitalSignature implements Action {
  readonly type = DigitalSignatureActionTypes.RESET_DIGITAL_SIGNATURE;
}

export type DigitalSignatureActions =
  | GetCustomerDetails
  | GetCustomerDetailsSuccess
  | GetCustomerDetailsFailure
  | GetCustomerDetailsForDigitalSignature
  | GetCustomerDetailsForDigitalSignatureSuccess
  | GetCustomerDetailsForDigitalSignatureFailure
  | SendCustomerDetailsForDigitalSignature
  | SendCustomerDetailsForDigitalSignatureSuccess
  | SendCustomerDetailsForDigitalSignatureFailure
  | UploadDigitalSignature
  | UploadDigitalSignatureSuccess
  | UploadDigitalSignatureFailure
  | GenerateOtp
  | GenerateOtpSuccess
  | GenerateOtpFailure
  | ValidateOtp
  | ValidateOtpSuccess
  | ValidateOtpFailure
  | ResetDigitalSignature
  | LoadEmployeeSignatureDetails
  | LoadEmployeeSignatureDetailsSuccess
  | LoadEmployeeSignatureDetailsFailure
  | UploadEmployeeSignature
  | UploadEmployeeSignatureSuccess
  | UploadEmployeeSignatureFailure
  | GetStoreDetailsForDigitalSignature
  | GetStoreDetailsForDigitalSignatureSuccess
  | GetStoreDetailsForDigitalSignatureFailure;
