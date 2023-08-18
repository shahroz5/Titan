import { CustomErrors, ItemStoneDetails } from '@poss-web/shared/models';
import { Action } from '@ngrx/store';

export enum ItemDetailsPopupActionTypes {
  LOAD_STONE_DETAILS = '[ Item-Details ] Load Stone Details',
  LOAD_STONE_DETAILS_SUCCESS = '[ Item-Details ]  Load Stone Details Success',
  LOAD_STONE_DETAILS_FAILURE = '[ Item-Details ]  Load Stone Details Failure',

  LOAD_PC_DESC = '[ Item-Details ] Load PC Desc',
  LOAD_PC_DESC_SUCCESS = '[ Item-Details ]  Load PC Desc Success',
  LOAD_PC_DESC_FAILURE = '[ Item-Details ]  Load PC Desc Failure',

  LOAD_PG_DESC = '[ Item-Details ] Load PG Desc',
  LOAD_PG_DESC_SUCCESS = '[ Item-Details ]  Load PG Desc Success',
  LOAD_PG_DESC_FAILURE = '[ Item-Details ]  Load PG Desc Failure',

  LOAD_CO_STONE_DETAILS = '[ Item-Details ] Load CO Stone Details',
  LOAD_CO_STONE_DETAILS_SUCCESS = '[ Item-Details ]  Load CO Stone Details Success',
  LOAD_C0_STONE_DETAILS_FAILURE = '[ Item-Details ]  Load CO Stone Details Failure',

  CLEAR = '[ Item-Details ] Clear Data',

  RESET_ERROR = '[ Item-Details  ] Reset Error'
}

export class LoadStoneDetails implements Action {
  readonly type = ItemDetailsPopupActionTypes.LOAD_STONE_DETAILS;
  constructor(
    public payload: {
      itemCode: string;
      lotNumber: string | number;
      locationCode?: string;
    }
  ) {}
}

export class LoadStoneDetailsSuccess implements Action {
  readonly type = ItemDetailsPopupActionTypes.LOAD_STONE_DETAILS_SUCCESS;
  constructor(public payload: ItemStoneDetails[]) {}
}

export class LoadStoneDetailsFailure implements Action {
  readonly type = ItemDetailsPopupActionTypes.LOAD_STONE_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadCOStoneDetails implements Action {
  readonly type = ItemDetailsPopupActionTypes.LOAD_CO_STONE_DETAILS;
  constructor(
    public payload: {
      itemCode: string;
    }
  ) {}
}

export class LoadCOStoneDetailsSuccess implements Action {
  readonly type = ItemDetailsPopupActionTypes.LOAD_CO_STONE_DETAILS_SUCCESS;
  constructor(public payload: ItemStoneDetails[]) {}
}

export class LoadCOStoneDetailsFailure implements Action {
  readonly type = ItemDetailsPopupActionTypes.LOAD_C0_STONE_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class Clear implements Action {
  readonly type = ItemDetailsPopupActionTypes.CLEAR;
}

export class LoadPcDesc implements Action {
  readonly type = ItemDetailsPopupActionTypes.LOAD_PC_DESC;
}

export class LoadPcDescSuccess implements Action {
  readonly type = ItemDetailsPopupActionTypes.LOAD_PC_DESC_SUCCESS;
  constructor(public payload: {}) {}
}

export class LoadPcDescFailure implements Action {
  readonly type = ItemDetailsPopupActionTypes.LOAD_PC_DESC_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadPgDesc implements Action {
  readonly type = ItemDetailsPopupActionTypes.LOAD_PG_DESC;
}

export class LoadPgDescSuccess implements Action {
  readonly type = ItemDetailsPopupActionTypes.LOAD_PG_DESC_SUCCESS;
  constructor(public payload: {}) {}
}

export class LoadPgDescFailure implements Action {
  readonly type = ItemDetailsPopupActionTypes.LOAD_PG_DESC_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export type ItemDetailsPopupActions =
  | LoadStoneDetails
  | LoadStoneDetailsSuccess
  | LoadStoneDetailsFailure
  | LoadCOStoneDetails
  | LoadCOStoneDetailsSuccess
  | LoadCOStoneDetailsFailure
  | LoadPcDesc
  | LoadPcDescSuccess
  | LoadPcDescFailure
  | LoadPgDesc
  | LoadPgDescSuccess
  | LoadPgDescFailure
  | Clear;
