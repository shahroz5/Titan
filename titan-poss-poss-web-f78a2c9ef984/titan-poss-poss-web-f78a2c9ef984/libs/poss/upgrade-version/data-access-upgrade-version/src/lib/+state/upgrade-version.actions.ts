import { Action } from '@ngrx/store';
import {
  CustomErrors,
  UpgradeVersion,
  UpgradeVersionResponse
} from '@poss-web/shared/models';

export enum UpgradeVersionActionTypes {
  GET_IS_UPDATE_AVAILABLE = '[Upgrade-version] Get Is Update Available',
  GET_IS_UPDATE_AVAILABLE_SUCCESS = '[Upgrade-version] Get Is Update Available Success',
  GET_IS_UPDATE_AVAILABLE_FAILURE = '[Upgrade-version] Get Is Update Available Failure',

  SEND_REQUEST_FOR_UPGRADE = '[Upgrade-version] Send Request For Upgrade',
  SEND_REQUEST_FOR_UPGRADE_SUCCESS = '[Upgrade-version] Send Request For Upgrade Success',
  SEND_REQUEST_FOR_UPGRADE_FAILURE = '[Upgrade-version] Send Request For Upgrade Failure'
}

export class GetIsUpdateAvailable implements Action {
  readonly type = UpgradeVersionActionTypes.GET_IS_UPDATE_AVAILABLE;
}

export class GetIsUpdateAvailableSuccess implements Action {
  readonly type = UpgradeVersionActionTypes.GET_IS_UPDATE_AVAILABLE_SUCCESS;
  constructor(readonly payload: UpgradeVersion) {}
}

export class GetIsUpdateAvailableFailure implements Action {
  readonly type = UpgradeVersionActionTypes.GET_IS_UPDATE_AVAILABLE_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class SendRequestForUpgrade implements Action {
  readonly type = UpgradeVersionActionTypes.SEND_REQUEST_FOR_UPGRADE;
}

export class SendRequestForUpgradeSuccess implements Action {
  readonly type = UpgradeVersionActionTypes.SEND_REQUEST_FOR_UPGRADE_SUCCESS;
  constructor(readonly payload: UpgradeVersionResponse) {}
}

export class SendRequestForUpgradeFailure implements Action {
  readonly type = UpgradeVersionActionTypes.SEND_REQUEST_FOR_UPGRADE_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export type UpgradeVersionActions =
  | GetIsUpdateAvailable
  | GetIsUpdateAvailableSuccess
  | GetIsUpdateAvailableFailure
  | SendRequestForUpgrade
  | SendRequestForUpgradeSuccess
  | SendRequestForUpgradeFailure;
