import { Action } from '@ngrx/store';
import {
  CustomErrors,
  LoadMarketCodesListingPayload,
  LoadMarketCodeListingSuccessPayload,
  MarketCodeDetails,
  SaveMarketCodeDetailsPayload,
  UpdateMarketCodeDetailsPayload,
  SaveMarketMaterialFactorsPayload,
  MarketMaterialFactors
} from '@poss-web/shared/models';
export enum MarketCodeActionTypes {
  LOAD_MARKET_CODE_DETAILS = '[MarketCode]Load Market Code Details',
  LOAD_MARKET_CODES_DETAILS_SUCCESS = '[MarketCode]Load Market Code Details Success',
  LOAD_MARKET_CODE_DETAILS_FAILURE = '[MarketCode]Load Market Code Details Failure',

  LOAD_MARKET_CODE_DETAILS_BASED_ON_MARKET_CODE = '[MarketCode]Load Market Code Details Based On Market Code',
  LOAD_MARKET_CODE_DETAILS_BASED_ON_MARKET_CODE_SUCCESS = '[MarketCode]Load Market Code Details Based On Market Code Success',
  LOAD_MARKET_CODE_DETAILS_BASED_ON_MARKET_CODE_FAILURE = '[MarketCode]Load Market Code Details Based On Market Code Failure',

  RESET_MARKET_CODE_DETAILS = '[MarketCode]Reset Market Code Details',

  SEARCH_MARKET_CODE = '[MarketCode]Search Market Code',
  SEARCH_MARKET_CODE_SUCCESS = '[MarketCode]Search Market Code Success',
  SEARCH_MARKET_CODE_FAILURE = '[MarketCode]Search Market Code Failure',

  SAVE_MARKET_CODE_DETAILS = '[MarketCode]Save Market Code Details',
  SAVE_MARKET_CODE_DETAILS_SUCCESS = '[MarketCode]Save Market Code Details Success',
  SAVE_MARKET_CODE_DETAILS_FAILURE = '[MarketCode]Save Market Code Details Failure',

  UPDATE_MARKET_CODE_DETAILS = '[MarketCode]Update Market Code Details',
  UPDATE_MARKET_CODE_DETAILS_SUCCESS = '[MarketCode]Update Market Code Details Success',
  UPDATE_MARKET_CODE_DETAILS_FAILURE = '[MarketCode]Update Market Code Details Failure',

  SAVE_MARKET_MATERIAL_FACTORS = '[MarketCode]Save Market Material Factors',
  SAVE_MARKET_MATERIAL_FACTORS_SUCCESS = '[MarketCode]Save Market Material Factors Success',
  SAVE_MARKET_MATERIAL_FACTORS_FAILURE = '[MarketCode]Save Market Material Factors Failure',

  UPDATE_MARKET_MATERIAL_FACTORS = '[MarketCode]Update Market Material Facators',
  UPDATE_MARKET_MATERIAL_FACTORS_SUCCESS = '[MarketCode]Update Market Material Facators Success',
  UPDATE_MARKET_MATERIAL_FACTORS_FAILURE = '[MarketCode]Update Market Material Facators Failure',

  LOAD_MATERIAL_FACTORS_BASED_ON_MARKET_CODE = '[MarketCode]Load Material Facators Based On Market Code',
  LOAD_MATERIAL_FACTORS_BASED_ON_MARKET_CODE_SUCCESS = '[MarketCode]Load Material Facators Based On Market Code Success',
  LOAD_MATERIAL_FACTORS_BASED_ON_MARKET_CODE_FAILURE = '[MarketCode]Load Material Facators Based On Market Code Failure',

  UPDATE_TOGGLE_BUTTON = '[MarketCode]Update Toggle Button',
  UPDATE_TOGGLE_BUTTON_SUCCESS = '[MarketCode]Update Toggle Button Success',
  UPDATE_TOGGLE_BUTTON_FAILURE = '[MarketCode]Update Toggle Button Failure'
}
export class LoadMarketCodeDetails implements Action {
  readonly type = MarketCodeActionTypes.LOAD_MARKET_CODE_DETAILS;
  constructor(public payload: LoadMarketCodesListingPayload) {}
}
export class LoadMarketCodeDetailsSuccess implements Action {
  readonly type = MarketCodeActionTypes.LOAD_MARKET_CODES_DETAILS_SUCCESS;
  constructor(public payload: LoadMarketCodeListingSuccessPayload) {}
}
export class LoadMarketCodeDetailsFailure implements Action {
  readonly type = MarketCodeActionTypes.LOAD_MARKET_CODE_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class LoadMarketCodeDetailsBasedOnMarketCode implements Action {
  readonly type =
    MarketCodeActionTypes.LOAD_MARKET_CODE_DETAILS_BASED_ON_MARKET_CODE;
  constructor(public payload: string) {}
}
export class LoadMarketCodeDetailsBasedOnMarketCodeSuccess implements Action {
  readonly type =
    MarketCodeActionTypes.LOAD_MARKET_CODE_DETAILS_BASED_ON_MARKET_CODE_SUCCESS;
  constructor(public payload: MarketCodeDetails) {}
}
export class LoadMarketCodeDetailsBasedOnMarketCodeFailure implements Action {
  readonly type =
    MarketCodeActionTypes.LOAD_MARKET_CODE_DETAILS_BASED_ON_MARKET_CODE_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class ResetMarketCodeDetails implements Action {
  readonly type = MarketCodeActionTypes.RESET_MARKET_CODE_DETAILS;
}
export class SearchMarketCode implements Action {
  readonly type = MarketCodeActionTypes.SEARCH_MARKET_CODE;
  constructor(public payload: string) {}
}
export class SearchMarketCodeSuccess implements Action {
  readonly type = MarketCodeActionTypes.SEARCH_MARKET_CODE_SUCCESS;
  constructor(public payload: MarketCodeDetails[]) {}
}
export class SearchMarketCodeFailure implements Action {
  readonly type = MarketCodeActionTypes.SEARCH_MARKET_CODE_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class SaveMarketCodeDetails implements Action {
  readonly type = MarketCodeActionTypes.SAVE_MARKET_CODE_DETAILS;
  constructor(public payload: SaveMarketCodeDetailsPayload) {}
}
export class SaveMarketCodeDetailsSuccess implements Action {
  readonly type = MarketCodeActionTypes.SAVE_MARKET_CODE_DETAILS_SUCCESS;
  constructor(public payload: MarketCodeDetails) {}
}
export class SaveMarketCodeDetailsFailure implements Action {
  readonly type = MarketCodeActionTypes.SAVE_MARKET_CODE_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class UpdateMarketCodeDetails implements Action {
  readonly type = MarketCodeActionTypes.UPDATE_MARKET_CODE_DETAILS;
  constructor(public payload: UpdateMarketCodeDetailsPayload) {}
}
export class UpdateMarketCodeDetailsSuccess implements Action {
  readonly type = MarketCodeActionTypes.UPDATE_MARKET_CODE_DETAILS_SUCCESS;
  constructor(public payload: MarketCodeDetails) {}
}
export class UpdateMarketCodeDetailsFailure implements Action {
  readonly type = MarketCodeActionTypes.UPDATE_MARKET_CODE_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class SaveMarketMaterialFactors implements Action {
  readonly type = MarketCodeActionTypes.SAVE_MARKET_MATERIAL_FACTORS;
  constructor(public payload: SaveMarketMaterialFactorsPayload) {}
}
export class SaveMarketMaterialFacatorsSuccess implements Action {
  readonly type = MarketCodeActionTypes.SAVE_MARKET_MATERIAL_FACTORS_SUCCESS;
  constructor(public payload: MarketMaterialFactors) {}
}
export class SaveMarketMaterialFacatorsFailure implements Action {
  readonly type = MarketCodeActionTypes.SAVE_MARKET_MATERIAL_FACTORS_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class UpdateMarketMaterialFactors implements Action {
  readonly type = MarketCodeActionTypes.UPDATE_MARKET_MATERIAL_FACTORS;
  constructor(public payload: SaveMarketMaterialFactorsPayload) {}
}
export class UpdateMarketMaterialFactorsSuccess implements Action {
  readonly type = MarketCodeActionTypes.UPDATE_MARKET_MATERIAL_FACTORS_SUCCESS;
  constructor(public payload: MarketMaterialFactors) {}
}
export class UpdateMarketMaterialFactorsFailure implements Action {
  readonly type = MarketCodeActionTypes.UPDATE_MARKET_MATERIAL_FACTORS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class UpdateToggleButton implements Action {
  readonly type = MarketCodeActionTypes.UPDATE_TOGGLE_BUTTON;
  constructor(public payload: UpdateMarketCodeDetailsPayload) {}
}
export class UpdateToggleButtonSuccess implements Action {
  readonly type = MarketCodeActionTypes.UPDATE_TOGGLE_BUTTON_SUCCESS;
}
export class UpdateToggleButtonFailure implements Action {
  readonly type = MarketCodeActionTypes.UPDATE_TOGGLE_BUTTON_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export type MarketCodeActions =
  | LoadMarketCodeDetails
  | LoadMarketCodeDetailsSuccess
  | LoadMarketCodeDetailsFailure
  | LoadMarketCodeDetailsBasedOnMarketCode
  | LoadMarketCodeDetailsBasedOnMarketCodeSuccess
  | LoadMarketCodeDetailsBasedOnMarketCodeFailure
  | ResetMarketCodeDetails
  | SearchMarketCode
  | SearchMarketCodeSuccess
  | SearchMarketCodeFailure
  | SaveMarketCodeDetails
  | SaveMarketCodeDetailsSuccess
  | SaveMarketCodeDetailsFailure
  | UpdateMarketCodeDetails
  | UpdateMarketCodeDetailsSuccess
  | UpdateMarketCodeDetailsFailure
  | SaveMarketMaterialFactors
  | SaveMarketMaterialFacatorsSuccess
  | SaveMarketMaterialFacatorsFailure
  | UpdateMarketMaterialFactors
  | UpdateMarketMaterialFactorsSuccess
  | UpdateMarketMaterialFactorsFailure
  | UpdateToggleButton
  | UpdateToggleButtonSuccess
  | UpdateToggleButtonFailure;
