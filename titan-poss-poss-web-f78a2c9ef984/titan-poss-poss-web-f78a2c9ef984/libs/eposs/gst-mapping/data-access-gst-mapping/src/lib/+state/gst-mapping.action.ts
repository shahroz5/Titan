import { Action } from '@ngrx/store';
import {
  CustomErrors,
  LoadGSTMappingListPayload,
  GSTMappingResponse,
  Tax,
  GSTMappingDetails,
  GSTMappingPayload,
  Lov
} from '@poss-web/shared/models';
export enum GSTMappingActionTypes {
  LOAD_GST_MAPPING_LIST = '[ GST-Mapping ] Load GST Mapping List',
  LOAD_GST_MAPPING_LIST_SUCCESS = '[ GST-Mapping ] Load GST Mapping List Success',
  LOAD_GST_MAPPING_LIST_FAILURE = '[ GST-Mapping ] Load GST Mapping List Failure',

  ADD_GST_MAPPING = '[ GST-Mapping ] Add GST Mapping',
  ADD_GST_MAPPING_SUCCESS = '[ GST-Mapping ] Add GST Mapping Success',
  ADD_GST_MAPPING_FAILURE = '[ GST-Mapping ] Add GST Mapping Failure',

  EDIT_GST_MAPPING = '[ GST-Mapping ] Edit GST Mapping',
  EDIT_GST_MAPPING_SUCCESS = '[ GST-Mapping ] Edit GST Mapping Success',
  EDIT_GST_MAPPING_FAILURE = '[ GST-Mapping ] Edit GST Mapping Failure',

  LOAD_TRANSACTION_TYPES = '[ GST-Mapping ] Load Transaction Types ',
  LOAD_TRANSACTION_TYPES_SUCCESS = '[ GST-Mapping ] Load Transaction Types Success ',
  LOAD_TRANSACTION_TYPES_FAILURE = '[ GST-Mapping ]  Load Transaction Types Failure ',

  LOAD_TAXES = '[ GST-Mapping ] Load Taxes ',
  LOAD_TAXES_SUCCESS = '[ GST-Mapping ] Load Taxes Success ',
  LOAD_TAXES_FAILURE = '[ GST-Mapping ]  Load Taxes Failure ',

  RESET_DATA = '[ GST-Mapping ] Reset Data'
}

export class LoadGSTMappingList implements Action {
  readonly type = GSTMappingActionTypes.LOAD_GST_MAPPING_LIST;
  constructor(public payload: LoadGSTMappingListPayload) {}
}
export class LoadGSTMappingListSuccess implements Action {
  readonly type = GSTMappingActionTypes.LOAD_GST_MAPPING_LIST_SUCCESS;
  constructor(public payload: GSTMappingResponse) {}
}
export class LoadGSTMappingListFailure implements Action {
  readonly type = GSTMappingActionTypes.LOAD_GST_MAPPING_LIST_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class AddGSTMapping implements Action {
  readonly type = GSTMappingActionTypes.ADD_GST_MAPPING;
  constructor(public payload: GSTMappingPayload) {}
}
export class AddGSTMappingSuccess implements Action {
  readonly type = GSTMappingActionTypes.ADD_GST_MAPPING_SUCCESS;
  constructor(public payload: GSTMappingDetails) {}
}
export class AddGSTMappingFailure implements Action {
  readonly type = GSTMappingActionTypes.ADD_GST_MAPPING_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class EditGSTMapping implements Action {
  readonly type = GSTMappingActionTypes.EDIT_GST_MAPPING;
  constructor(public payload: { configId: string; data: GSTMappingPayload }) {}
}
export class EditGSTMappingSuccess implements Action {
  readonly type = GSTMappingActionTypes.EDIT_GST_MAPPING_SUCCESS;
  constructor(public payload: GSTMappingDetails) {}
}
export class EditGSTMappingFailure implements Action {
  readonly type = GSTMappingActionTypes.EDIT_GST_MAPPING_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadTransactionTypes implements Action {
  readonly type = GSTMappingActionTypes.LOAD_TRANSACTION_TYPES;
}

export class LoadTransactionTypesSuccess implements Action {
  readonly type = GSTMappingActionTypes.LOAD_TRANSACTION_TYPES_SUCCESS;
  constructor(public payload: Lov[]) {}
}
export class LoadTransactionTypesFailure implements Action {
  readonly type = GSTMappingActionTypes.LOAD_TRANSACTION_TYPES_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadTaxes implements Action {
  readonly type = GSTMappingActionTypes.LOAD_TAXES;
}

export class LoadTaxesSuccess implements Action {
  readonly type = GSTMappingActionTypes.LOAD_TAXES_SUCCESS;
  constructor(public payload: Tax[]) {}
}
export class LoadTaxesFailure implements Action {
  readonly type = GSTMappingActionTypes.LOAD_TAXES_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class ResetData implements Action {
  readonly type = GSTMappingActionTypes.RESET_DATA;
}

export type GSTMappingActions =
  | LoadGSTMappingList
  | LoadGSTMappingListSuccess
  | LoadGSTMappingListFailure
  | LoadTransactionTypes
  | LoadTransactionTypesSuccess
  | LoadTransactionTypesFailure
  | LoadTaxes
  | LoadTaxesSuccess
  | LoadTaxesFailure
  | AddGSTMapping
  | AddGSTMappingSuccess
  | AddGSTMappingFailure
  | EditGSTMapping
  | EditGSTMappingSuccess
  | EditGSTMappingFailure
  | ResetData;
