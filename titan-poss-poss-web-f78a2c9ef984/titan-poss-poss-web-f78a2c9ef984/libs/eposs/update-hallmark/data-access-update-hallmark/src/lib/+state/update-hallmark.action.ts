import { Action } from '@ngrx/store';

import {
  UpdateHallmarkDetails,
  CustomErrors
} from '@poss-web/shared/models';

export enum UpdateHallmarkActionTypes {

  UPDATE_ITEM_HALLMARK_DETAILS = '[ UpdateHallmark ] Update Item Hallmark Details',
  UPDATE_ITEM_HALLMARK_DETAILS_SUCCESS = '[ UpdateHallmark ] Update Item Hallmark Details Success',
  UPDATE_ITEM_HALLMARK_DETAILS_FAILURE = '[ UpdateHallmark ] Update Item Hallmark Details Failure',

  RESET_ERROR = '[ UpdateHallmark ] Reset Error',

}

export class UpdateItemHallmarkDetails implements Action {
  readonly type = UpdateHallmarkActionTypes.UPDATE_ITEM_HALLMARK_DETAILS;
  constructor(public payload: UpdateHallmarkDetails) {}
}

export class UpdateItemHallmarkDetailsSuccess implements Action {
  readonly type = UpdateHallmarkActionTypes.UPDATE_ITEM_HALLMARK_DETAILS_SUCCESS;
  constructor(public payload: boolean) {}
}

export class UpdateItemHallmarkDetailsFailure implements Action {
  readonly type = UpdateHallmarkActionTypes.UPDATE_ITEM_HALLMARK_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class ResetError implements Action {
  readonly type = UpdateHallmarkActionTypes.RESET_ERROR;
}

export type UpdateHallmarkAction =
  | UpdateItemHallmarkDetails
  | UpdateItemHallmarkDetailsSuccess
  | UpdateItemHallmarkDetailsFailure
  | ResetError;

