import { Action } from '@ngrx/store';
import { CustomErrors, Hostname } from '@poss-web/shared/models';

export enum UAActionTypes {
  GET_ENCRYPTED_HOSTNAME = '[Payment] Get Encrypted HostName',
  GET_ENCRYPTED_HOSTNAME_SUCCESS = '[Payment] Get Encrypted HostName Success',
  GET_ENCRYPTED_HOSTNAME_FAILURE = '[Payment] Get Encrypted HostName Failure',


}

export class GetEncryptedHostName implements Action {
  readonly type = UAActionTypes.GET_ENCRYPTED_HOSTNAME;
}
export class GetEncryptedHostNameSuccess implements Action {
  readonly type = UAActionTypes.GET_ENCRYPTED_HOSTNAME_SUCCESS;
  constructor(public payload: Hostname) {}
}
export class GetEncryptedHostNameFailure implements Action {
  readonly type = UAActionTypes.GET_ENCRYPTED_HOSTNAME_FAILURE;
  constructor(public payload: CustomErrors) {}
}


export type UAActions =
  | GetEncryptedHostName
  | GetEncryptedHostNameSuccess
  | GetEncryptedHostNameFailure;

