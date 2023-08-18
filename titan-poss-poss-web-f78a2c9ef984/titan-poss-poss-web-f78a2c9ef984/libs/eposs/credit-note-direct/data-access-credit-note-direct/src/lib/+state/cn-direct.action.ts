import { Action } from '@ngrx/store';
import {
  CustomErrors,
  SearchPayloadReq,
  CnListRes,
  UploadCNPayloadReq,
  SaveCnActionPayload
} from '@poss-web/shared/models';

export enum CNDirectActionTypes {
  SEARCH_CN_DIRECT_LIST = '[cn-direct] Search  Cn Direct List',
  SEARCH_CN_DIRECT_LIST_SUCCESS = '[cn-direct] Search  Cn Direct List Success',
  SEARCH_CN_DIRECT_LIST_FAILURE = '[cn-direct] Search  Cn Direct List Failure',

  SAVE_CN_DIRECT_ACTION = '[cn-direct] Save Cn Direct Status ',
  SAVE_CN_DIRECT_ACTION_SUCCESS = '[cn-direct] Save Cn Direct Status Success ',
  SAVE_CN_DIRECT_ACTION_FAILURE = '[cn-direct] Save Cn Direct Status Failure ',

  UPLOAD_CN = '[cn-direct] Upload Cn',
  UPLOAD_CN_SUCCESS = '[cn-direct] Upload Cn Success',
  UPLOAD_CN_FAILURE = '[cn-direct] Upload Cn Failure',

  LOAD_RESET = '[cn-direct] Load Reset'
}

export class SearchCnDirectList implements Action {
  readonly type = CNDirectActionTypes.SEARCH_CN_DIRECT_LIST;
  constructor(public payload: SearchPayloadReq) {}
}
export class SearchCnDirectListSuccess implements Action {
  readonly type = CNDirectActionTypes.SEARCH_CN_DIRECT_LIST_SUCCESS;
  constructor(public payload: CnListRes) {}
}

export class SearchCnDirectListFailure implements Action {
  readonly type = CNDirectActionTypes.SEARCH_CN_DIRECT_LIST_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class UploadCn implements Action {
  readonly type = CNDirectActionTypes.UPLOAD_CN;
  constructor(public payload: UploadCNPayloadReq) {}
}
export class UploadCnSuccess implements Action {
  readonly type = CNDirectActionTypes.UPLOAD_CN_SUCCESS;
  constructor(public payload: CnListRes) {}
}

export class UploadCnFailure implements Action {
  readonly type = CNDirectActionTypes.UPLOAD_CN_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SaveCnDirectAction implements Action {
  readonly type = CNDirectActionTypes.SAVE_CN_DIRECT_ACTION;
  constructor(public payload: SaveCnActionPayload) {}
}
export class SaveCnDirectActionSuccess implements Action {
  readonly type = CNDirectActionTypes.SAVE_CN_DIRECT_ACTION_SUCCESS;
  constructor(public payload: string[]) {}
}
export class SaveCnDirectActionFailure implements Action {
  readonly type = CNDirectActionTypes.SAVE_CN_DIRECT_ACTION_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadReset implements Action {
  readonly type = CNDirectActionTypes.LOAD_RESET;
}

export type CnDirectActions =
  | SearchCnDirectList
  | SearchCnDirectListFailure
  | SearchCnDirectListSuccess
  | SaveCnDirectAction
  | SaveCnDirectActionFailure
  | SaveCnDirectActionSuccess
  | UploadCn
  | UploadCnFailure
  | UploadCnSuccess
  | LoadReset;
