import { Action } from '@ngrx/store';

import {
  CustomErrors,
  ComplexityListing,
  ComplexityListPayload,
  ComplexityCode
} from '@poss-web/shared/models';

export const enum ComplexityCodeActionTypes {
  LOAD_COMPLEXIETY_CODE_LISTING = '[complexity-code-list] Load Complexity Code Listing',
  LOAD_COMPLEXIETY_CODE_LISTING_SUCCESS = '[complexity-code-list] Load Complexity Code Listing Success',
  LOAD_COMPLEXIETY_CODE_LISTING_FAILURE = '[complexity-code-list] Load Complexity Code Listing Failure',

  LOAD_COMPLEXITY_BY_CODE = '[complexity-code-list] Load Complexity By Code ',
  LOAD_COMPLEXITY_BY_CODE_SUCCESS = '[complexity-code-list] Load Complexity By  Code  Success',
  LOAD_COMPLEXITY_BY_CODE_FAILURE = '[complexity-code-list] Load Complexity By  Code  Failure',

  UPDATE_COMPLEXITY_BY_CODE = '[complexity-code-list] Update Complexity By Code Code',
  UPDATE_COMPLEXITY_BY_CODE_SUCCESS = '[complexity-code-list]  Update Complexity By Code Code Success',
  UPDATE_COMPLEXITY_BY_CODE_FAILURE = '[complexity-code-list]  Update Complexity By Code Code Failure',

  SAVE_COMPLEXIETY_CODE = '[complexity-code-list] Save  Complexity Code',
  SAVE_COMPLEXIETY_CODE_SUCCESS = '[complexity-code-list] Save  Complexity Code Success',
  SAVE_COMPLEXIETY_CODE_FAILURE = '[complexity-code-list] Save  Complexity Code Failure',

  SEARCH_COMPLEXIETY_CODE = '[complexity-code-list] Search Complexity Code',
  SEARCH_COMPLEXIETY_CODE_SUCCESS = '[complexity-code-list] Search Complexity Code Success',
  SEARCH_COMPLEXIETY_CODE_FAILURE = '[complexity-code-list] Search Complexity Code Failure',

  LOAD_RESET = '[complexity-code-list] Load Reset'
}

export class LoadReset implements Action {
  readonly type = ComplexityCodeActionTypes.LOAD_RESET;
}

export class SearchComplexityCode implements Action {
  readonly type = ComplexityCodeActionTypes.SEARCH_COMPLEXIETY_CODE;
  constructor(public payload: string) {}
}

export class SearchComplexityCodeSuccess implements Action {
  readonly type = ComplexityCodeActionTypes.SEARCH_COMPLEXIETY_CODE_SUCCESS;
  constructor(public payload: ComplexityListing) {}
}

export class SearchComplexityCodeFailure implements Action {
  readonly type = ComplexityCodeActionTypes.SEARCH_COMPLEXIETY_CODE_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadComplexityByCode implements Action {
  readonly type = ComplexityCodeActionTypes.LOAD_COMPLEXITY_BY_CODE;
  constructor(public payload: string) {}
}

export class LoadComplexityByCodeSuccess implements Action {
  readonly type = ComplexityCodeActionTypes.LOAD_COMPLEXITY_BY_CODE_SUCCESS;
  constructor(public payload: ComplexityCode) {}
}

export class LoadComplexityByCodeFailure implements Action {
  readonly type = ComplexityCodeActionTypes.LOAD_COMPLEXITY_BY_CODE_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class UpdateComplexityByCode implements Action {
  readonly type = ComplexityCodeActionTypes.UPDATE_COMPLEXITY_BY_CODE;
  constructor(public payload: ComplexityCode) {}
}

export class UpdateComplexityByCodeSuccess implements Action {
  readonly type = ComplexityCodeActionTypes.UPDATE_COMPLEXITY_BY_CODE_SUCCESS;
}

export class UpdateComplexityByCodeFailure implements Action {
  readonly type = ComplexityCodeActionTypes.UPDATE_COMPLEXITY_BY_CODE_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class SaveComplexityCode implements Action {
  readonly type = ComplexityCodeActionTypes.SAVE_COMPLEXIETY_CODE;
  constructor(public payload: ComplexityCode) {}
}

export class SaveComplexityCodeSuccess implements Action {
  readonly type = ComplexityCodeActionTypes.SAVE_COMPLEXIETY_CODE_SUCCESS;
}

export class SaveComplexityCodeFailure implements Action {
  readonly type = ComplexityCodeActionTypes.SAVE_COMPLEXIETY_CODE_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadComplexityCodeList implements Action {
  readonly type = ComplexityCodeActionTypes.LOAD_COMPLEXIETY_CODE_LISTING;
  constructor(public payload: ComplexityListPayload) {}
}

export class LoadComplexityCodeListSuccess implements Action {
  readonly type =
    ComplexityCodeActionTypes.LOAD_COMPLEXIETY_CODE_LISTING_SUCCESS;
  constructor(public payload: ComplexityListing) {}
}

export class LoadComplexityCodeListFailure implements Action {
  readonly type =
    ComplexityCodeActionTypes.LOAD_COMPLEXIETY_CODE_LISTING_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export type ComplexityCodeActions =
  | SearchComplexityCode
  | SearchComplexityCodeSuccess
  | SearchComplexityCodeFailure
  | SaveComplexityCode
  | SaveComplexityCodeFailure
  | SaveComplexityCodeSuccess
  | LoadReset
  | LoadComplexityByCode
  | LoadComplexityByCodeSuccess
  | LoadComplexityByCodeFailure
  | UpdateComplexityByCode
  | UpdateComplexityByCodeFailure
  | UpdateComplexityByCodeSuccess
  | LoadComplexityCodeList
  | LoadComplexityCodeListSuccess
  | LoadComplexityCodeListFailure;
