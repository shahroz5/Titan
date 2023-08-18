import { Action } from '@ngrx/store';

import {
  CustomErrors,
  UcpMarketCodeListPayload,
  UcpMarketCodeListing,
  UcpMarketCode,
  UpdateUcpMarketCodePayload,
  SaveUcpMarketCodePayload,
  UcpProductGroup,
  MarketCode
} from '@poss-web/shared/models';

export const enum UcpMarketCodeFactorActionTypes {
  LOAD_UCP_MARKET_CODE_FACTOR_LISTING = '[ucp-market-code-factor] Load UCP Market code factor Listing',
  LOAD_UCP_MARKET_CODE_FACTOR_LISTING_SUCCESS = '[ucp-market-code-factor] Load UCP Market code factor Listing Success',
  LOAD_UCP_MARKET_CODE_FACTOR_LISTING_FAILURE = '[ucp-market-code-factor] Load UCP Market code factor Listing Failure',

  LOAD_UCP_MARKET_CODE_FACTOR_BY_CODE = '[ucp-market-code-factor] Load UCP Market code factor By Code ',
  LOAD_UCP_MARKET_CODE_FACTOR_BY_CODE_SUCCESS = '[ucp-market-code-factor] Load UCP Market code factor By  Code  Success',
  LOAD_UCP_MARKET_CODE_FACTOR_BY_CODE_FAILURE = '[ucp-market-code-factor] Load UCP Market code factor By  Code  Failure',

  UPDATE_UCP_MARKET_CODE_FACTOR_BY_CODE = '[ucp-market-code-factor] Update UCP Market code factor By Code Code',
  UPDATE_UCP_MARKET_CODE_FACTOR_BY_CODE_SUCCESS = '[ucp-market-code-factor]  Update UCP Market code factor By Code Code Success',
  UPDATE_UCP_MARKET_CODE_FACTOR_BY_CODE_FAILURE = '[ucp-market-code-factor]  Update UCP Market code factor By Code Code Failure',

  SAVE_UCP_MARKET_CODE_FACTOR = '[ucp-market-code-factor] Save  UCP Market code factor',
  SAVE_UCP_MARKET_CODE_FACTOR_SUCCESS = '[ucp-market-code-factor] Save  UCP Market code factor Success',
  SAVE_UCP_MARKET_CODE_FACTOR_FAILURE = '[ucp-market-code-factor] Save  UCP Market code factor Failure',

  LOAD_MARKET_CODE = '[ucp-market-code-factor] Load Market code ',
  LOAD_MARKET_CODE_SUCCESS = '[ucp-market-code-factor] Load Market code Success',
  LOAD_MARKET_CODE_FAILURE = '[ucp-market-code-factor]Load Market code Failure',

  LOAD_UCP_PRODUCT_CODE = '[ucp-market-code-factor] Load UCP Product Code',
  LOAD_UCP_PRODUCT_CODE_SUCCESS = '[ucp-market-code-factor] Load UCP Product Code Success',
  LOAD_UCP_PRODUCT_CODE_FAILURE = '[ucp-market-code-factor] Load UCP Product Code Failure',

  LOAD_RESET = '[ucp-market-code-factor] Load Reset'
}

export class LoadMarketCode implements Action {
  readonly type = UcpMarketCodeFactorActionTypes.LOAD_MARKET_CODE;
}

export class LoadMarketCodeSuccess implements Action {
  readonly type = UcpMarketCodeFactorActionTypes.LOAD_MARKET_CODE_SUCCESS;
  constructor(public payload: MarketCode[]) {}
}

export class LoadMarketCodeFailure implements Action {
  readonly type = UcpMarketCodeFactorActionTypes.LOAD_MARKET_CODE_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadReset implements Action {
  readonly type = UcpMarketCodeFactorActionTypes.LOAD_RESET;
}

export class LoadUcpProductCode implements Action {
  readonly type = UcpMarketCodeFactorActionTypes.LOAD_UCP_PRODUCT_CODE;
}

export class LoadUcpProductCodeSuccess implements Action {
  readonly type = UcpMarketCodeFactorActionTypes.LOAD_UCP_PRODUCT_CODE_SUCCESS;
  constructor(public payload: UcpProductGroup[]) {}
}

export class LoadUcpProductCodeFailure implements Action {
  readonly type = UcpMarketCodeFactorActionTypes.LOAD_UCP_PRODUCT_CODE_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadUCPMarketCodeFactorByCode implements Action {
  readonly type =
    UcpMarketCodeFactorActionTypes.LOAD_UCP_MARKET_CODE_FACTOR_BY_CODE;
  constructor(public payload: string) {}
}

export class LoadUCPMarketCodeFactorByCodeSuccess implements Action {
  readonly type =
    UcpMarketCodeFactorActionTypes.LOAD_UCP_MARKET_CODE_FACTOR_BY_CODE_SUCCESS;
  constructor(public payload: UcpMarketCode) {}
}

export class LoadUCPMarketCodeFactorByCodeFailure implements Action {
  readonly type =
    UcpMarketCodeFactorActionTypes.LOAD_UCP_MARKET_CODE_FACTOR_BY_CODE_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class UpdateUCPMarketCodeFactorByCode implements Action {
  readonly type =
    UcpMarketCodeFactorActionTypes.UPDATE_UCP_MARKET_CODE_FACTOR_BY_CODE;
  constructor(public payload: UpdateUcpMarketCodePayload) {}
}

export class UpdateUCPMarketCodeFactorByCodeSuccess implements Action {
  readonly type =
    UcpMarketCodeFactorActionTypes.UPDATE_UCP_MARKET_CODE_FACTOR_BY_CODE_SUCCESS;
}

export class UpdateUCPMarketCodeFactorByCodeFailure implements Action {
  readonly type =
    UcpMarketCodeFactorActionTypes.UPDATE_UCP_MARKET_CODE_FACTOR_BY_CODE_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class SaveUCPMarketCodeFactorCode implements Action {
  readonly type = UcpMarketCodeFactorActionTypes.SAVE_UCP_MARKET_CODE_FACTOR;
  constructor(public payload: SaveUcpMarketCodePayload) {}
}

export class SaveUCPMarketCodeFactorCodeSuccess implements Action {
  readonly type =
    UcpMarketCodeFactorActionTypes.SAVE_UCP_MARKET_CODE_FACTOR_SUCCESS;
}

export class SaveUCPMarketCodeFactorCodeFailure implements Action {
  readonly type =
    UcpMarketCodeFactorActionTypes.SAVE_UCP_MARKET_CODE_FACTOR_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadUCPMarketCodeFactorCodeList implements Action {
  readonly type =
    UcpMarketCodeFactorActionTypes.LOAD_UCP_MARKET_CODE_FACTOR_LISTING;
  constructor(
    public payload: UcpMarketCodeListPayload,
    public searchValue?: string
  ) {}
}

export class LoadUCPMarketCodeFactorCodeListSuccess implements Action {
  readonly type =
    UcpMarketCodeFactorActionTypes.LOAD_UCP_MARKET_CODE_FACTOR_LISTING_SUCCESS;
  constructor(public payload: UcpMarketCodeListing) {}
}

export class LoadUCPMarketCodeFactorCodeListFailure implements Action {
  readonly type =
    UcpMarketCodeFactorActionTypes.LOAD_UCP_MARKET_CODE_FACTOR_LISTING_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export type UCPMarketCodeFactorCodeActions =
  | SaveUCPMarketCodeFactorCode
  | SaveUCPMarketCodeFactorCodeFailure
  | SaveUCPMarketCodeFactorCodeSuccess
  | UpdateUCPMarketCodeFactorByCode
  | UpdateUCPMarketCodeFactorByCodeFailure
  | UpdateUCPMarketCodeFactorByCodeSuccess
  | LoadUCPMarketCodeFactorCodeList
  | LoadUCPMarketCodeFactorCodeListFailure
  | LoadUCPMarketCodeFactorCodeListSuccess
  | LoadUCPMarketCodeFactorByCode
  | LoadUCPMarketCodeFactorByCodeSuccess
  | LoadUCPMarketCodeFactorByCodeFailure
  | LoadMarketCode
  | LoadMarketCodeFailure
  | LoadMarketCodeSuccess
  | LoadUcpProductCode
  | LoadUcpProductCodeFailure
  | LoadUcpProductCodeSuccess
  | LoadReset;
