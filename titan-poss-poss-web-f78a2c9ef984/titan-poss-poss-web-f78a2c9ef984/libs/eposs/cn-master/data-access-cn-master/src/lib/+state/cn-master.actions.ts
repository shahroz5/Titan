import { Action } from '@ngrx/store';
import {
  CnMasterDetail,
  CnMasterDetails,
  CnMasterListResponse,
  CnMasterRequestPayload,
  CustomErrors
} from '@poss-web/shared/models';

export enum CreditNoteMasterActionTypes {
  LOAD_CREDIT_NOTE_MASTER_LIST = '[credit-note-master] Load Credit Note Master List',
  LOAD_CREDIT_NOTE_MASTER_LIST_SUCCESS = '[credit-note-master] Load Credit Note Master List Success',
  LOAD_CREDIT_NOTE_MASTER_LIST_FAILURE = '[credit-note-master] Load Credit Note Master List Failure',

  LOAD_CREDIT_NOTE_MASTER_DETAIL_BY_CNTYPE = '[credit-note-master] Load Credit Note Master Detail By CN Type',
  LOAD_CREDIT_NOTE_MASTER_DETAIL_BY_CNTYPE_SUCCESS = '[credit-note-master] Load Credit Note Master Detail By CN Type Success',
  LOAD_CREDIT_NOTE_MASTER_DETAIL_BY_CNTYPE_FAILURE = '[credit-note-master] Load Credit Note Master Detail By CN Type Failure',

  SEARCH_CREDIT_NOTE_MASTER_LIST = '[credit-note-master] Search Credit Note Master List ',
  SEARCH_CREDIT_NOTE_MASTER_LIST_SUCCESS = '[credit-note-master] Search Credit Note Master List Success ',
  SEARCH_CREDIT_NOTE_MASTER_LIST_FAILURE = '[credit-note-master] Search Credit Note Master List Failure',

  UPDATE_CREDIT_NOTE_MASTER_DETAIL = '[credit-note-master] Update Credit Note Master Detail',
  UPDATE_CREDIT_NOTE_MASTER_DETAIL_SUCCESS = '[credit-note-master] Update Credit Note Master Detail Success',
  UPDATE_CREDIT_NOTE_MASTER_DETAIL_FAILURE = '[credit-note-master] Update Credit Note Master Detail Failure',

  LOAD_RESET = '[credit-note-master] Load Reset'
}

export class LoadCreditNoteMasterList implements Action {
  readonly type = CreditNoteMasterActionTypes.LOAD_CREDIT_NOTE_MASTER_LIST;
  constructor(public payload: CnMasterRequestPayload) {}
}
export class LoadCreditNoteMasterListSuccess implements Action {
  readonly type =
    CreditNoteMasterActionTypes.LOAD_CREDIT_NOTE_MASTER_LIST_SUCCESS;
  constructor(public payload: CnMasterListResponse) {}
}
export class LoadCreditNoteMasterListFailure implements Action {
  readonly type =
    CreditNoteMasterActionTypes.LOAD_CREDIT_NOTE_MASTER_LIST_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadCreditNoteMasterDetailByCNType implements Action {
  readonly type =
    CreditNoteMasterActionTypes.LOAD_CREDIT_NOTE_MASTER_DETAIL_BY_CNTYPE;
  constructor(public payload: string) {}
}
export class LoadCreditNoteMasterDetailByCNTypeSuccess implements Action {
  readonly type =
    CreditNoteMasterActionTypes.LOAD_CREDIT_NOTE_MASTER_DETAIL_BY_CNTYPE_SUCCESS;
  constructor(public payload: CnMasterDetail) {}
}
export class LoadCreditNoteMasterDetailByCNTypeFailure implements Action {
  readonly type =
    CreditNoteMasterActionTypes.LOAD_CREDIT_NOTE_MASTER_DETAIL_BY_CNTYPE_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class UpdateCreditNoteMasterDetail implements Action {
  readonly type = CreditNoteMasterActionTypes.UPDATE_CREDIT_NOTE_MASTER_DETAIL;
  constructor(public payload: { cnType: string; cnDetail: CnMasterDetails }) {}
}
export class UpdateCreditNoteMasterDetailSuccess implements Action {
  readonly type =
    CreditNoteMasterActionTypes.UPDATE_CREDIT_NOTE_MASTER_DETAIL_SUCCESS;
  constructor(public payload: CnMasterDetail) {}
}
export class UpdateCreditNoteMasterDetailFailure implements Action {
  readonly type =
    CreditNoteMasterActionTypes.UPDATE_CREDIT_NOTE_MASTER_DETAIL_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SearchCreditNoteMasterList implements Action {
  readonly type = CreditNoteMasterActionTypes.SEARCH_CREDIT_NOTE_MASTER_LIST;
  constructor(public payload: string) {}
}
export class SearchCreditNoteMasterListSuccess implements Action {
  readonly type =
    CreditNoteMasterActionTypes.SEARCH_CREDIT_NOTE_MASTER_LIST_SUCCESS;
  constructor(public payload: CnMasterListResponse) {}
}
export class SearchCreditNoteMasterListFailure implements Action {
  readonly type =
    CreditNoteMasterActionTypes.SEARCH_CREDIT_NOTE_MASTER_LIST_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadReset implements Action {
  readonly type = CreditNoteMasterActionTypes.LOAD_RESET;
}

export type CreditNoteMasterAction =
  | LoadCreditNoteMasterList
  | LoadCreditNoteMasterListSuccess
  | LoadCreditNoteMasterListFailure
  | LoadCreditNoteMasterDetailByCNType
  | LoadCreditNoteMasterDetailByCNTypeSuccess
  | LoadCreditNoteMasterDetailByCNTypeFailure
  | UpdateCreditNoteMasterDetail
  | UpdateCreditNoteMasterDetailSuccess
  | UpdateCreditNoteMasterDetailFailure
  | SearchCreditNoteMasterList
  | SearchCreditNoteMasterListSuccess
  | SearchCreditNoteMasterListFailure
  | LoadReset;
