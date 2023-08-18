import { Action } from '@ngrx/store';

import {
  CustomErrors,
  EmployeeSignatureDetailsResponse,
  ProfileData
} from '@poss-web/shared/models';

export enum ProfileDataActionTypes {
  LOAD_PROFILE_DATA = '[ profile-data ] Load Profile Data',
  LOAD_PROFILE_DATA_SUCCESS = '[ profile-data ] Load Profile Data Success',
  LOAD_PROFILE_DATA_FAILURE = '[ profile-data ] Load Profile Data Failure',

  LOAD_EMPLOYEE_SIGNATURE_DETAILS = '[Digital Signature] Load Employee Signature Details',
  LOAD_EMPLOYEE_SIGNATURE_DETAILS_SUCCESS = '[Digital Signature] Load Employee Signature Details Success',
  LOAD_EMPLOYEE_SIGNATURE_DETAILS_FAILURE = '[Digital Signature] Load Employee Signature Details Failure',

  UPLOAD_EMPLOYEE_SIGNATURE = '[Digital Signature] Load Employee Signature',
  UPLOAD_EMPLOYEE_SIGNATURE_SUCCESS = '[Digital Signature] Load Employee Signature Success',
  UPLOAD_EMPLOYEE_SIGNATURE_FAILURE = '[Digital Signature] Load Employee Signature Failure',

  CLEAR_PROFILE_DATA = '[ profile-data ] Clear Profile Data'
}

export class ClearProfileData implements Action {
  readonly type = ProfileDataActionTypes.CLEAR_PROFILE_DATA;
}

export class LoadProfileData implements Action {
  readonly type = ProfileDataActionTypes.LOAD_PROFILE_DATA;
}

export class LoadProfileDataSuccess implements Action {
  readonly type = ProfileDataActionTypes.LOAD_PROFILE_DATA_SUCCESS;
  constructor(public readonly payload: ProfileData) {}
}
export class LoadProfileDataFailure implements Action {
  readonly type = ProfileDataActionTypes.LOAD_PROFILE_DATA_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadEmployeeSignatureDetails implements Action {
  readonly type = ProfileDataActionTypes.LOAD_EMPLOYEE_SIGNATURE_DETAILS;
  constructor(readonly employeeCode: string) {}
}

export class LoadEmployeeSignatureDetailsSuccess implements Action {
  readonly type =
    ProfileDataActionTypes.LOAD_EMPLOYEE_SIGNATURE_DETAILS_SUCCESS;
  constructor(readonly payload: EmployeeSignatureDetailsResponse) {}
}

export class LoadEmployeeSignatureDetailsFailure implements Action {
  readonly type =
    ProfileDataActionTypes.LOAD_EMPLOYEE_SIGNATURE_DETAILS_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class UploadEmployeeSignature implements Action {
  readonly type = ProfileDataActionTypes.UPLOAD_EMPLOYEE_SIGNATURE;
  constructor(
    readonly employeeCode: string,
    readonly cashierSignature: string
  ) {}
}

export class UploadEmployeeSignatureSuccess implements Action {
  readonly type = ProfileDataActionTypes.UPLOAD_EMPLOYEE_SIGNATURE_SUCCESS;
  constructor(readonly payload: EmployeeSignatureDetailsResponse) {}
}

export class UploadEmployeeSignatureFailure implements Action {
  readonly type = ProfileDataActionTypes.UPLOAD_EMPLOYEE_SIGNATURE_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export type ProfileDataActions =
  | LoadProfileData
  | LoadProfileDataSuccess
  | LoadProfileDataFailure
  | ClearProfileData
  | LoadEmployeeSignatureDetails
  | LoadEmployeeSignatureDetailsSuccess
  | LoadEmployeeSignatureDetailsFailure
  | UploadEmployeeSignature
  | UploadEmployeeSignatureSuccess
  | UploadEmployeeSignatureFailure;
