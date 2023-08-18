import { Action } from '@ngrx/store';
import {
  CustomErrors,
  SaveRulesPayload,
  ClubDiscountsSuccessList,
  ClubDiscountsListPayload,
  ClubDiscountsList,
  DiscountTypeBasedCodes
} from '@poss-web/shared/models';
export enum ClubDiscountsActionTypes {
  LOAD_CLUBBING_DISCOUNTS = '[clubbing-discounts]  Load Clubbing Discount Config List',
  LOAD_CLUBBING_DISCOUNTS_SUCCESS = '[clubbing-discounts]  Load Clubbing Discount Config List Success',
  LOAD_CLUBBING_DISCOUNTS_FAILURE = '[clubbing-discounts]  Load Clubbing Discount Config List Failure',

  SAVE_CLUBBING_DISCOUNTS = '[clubbing-discounts]  Save Clubbing Discount Config List',
  SAVE_CLUBBING_DISCOUNTS_SUCCESS = '[clubbing-discounts]  Save Clubbing Discount Config List Success',
  SAVE_CLUBBING_DISCOUNTS_FAILURE = '[clubbing-discounts]  Save Clubbing Discount Config List Failure',

  LOAD_TYPE1_DISCOUNTS = '[clubbing-discounts]  Load Discounts By Type1',
  LOAD_TYPE1_DISCOUNTS_SUCCESS = '[clubbing-discounts]  Load Discounts By Type Success',
  LOAD_TYPE1_DISCOUNTS_FAILURE = '[clubbing-discounts]  Load Discounts By Type Failure',

  LOAD_TYPE2_DISCOUNTS = '[clubbing-discounts]  Load Discounts By Type2',
  LOAD_TYPE2_DISCOUNTS_SUCCESS = '[clubbing-discounts]  Load Discounts By Type2 Success',
  LOAD_TYPE2_DISCOUNTS_FAILURE = '[clubbing-discounts]  Load Discounts By Type2 Failure',

  LOAD_TYPE3_DISCOUNTS = '[clubbing-discounts]  Load Discounts By Type3',
  LOAD_TYPE3_DISCOUNTS_SUCCESS = '[clubbing-discounts]  Load Discounts By Type3 Success',
  LOAD_TYPE3_DISCOUNTS_FAILURE = '[clubbing-discounts]  Load Discounts By Type3 Failure',

  DELETE_CLUBBING_DISCOUNTS = '[clubbing-discounts]  Delete Clubbing Discount Config',
  RESET_CLUBBING_DISCOUNTS = '[clubbing-discounts]  Reset Clubbing Discount Config'
}

export class LoadClubbingDiscountConfigList implements Action {
  readonly type = ClubDiscountsActionTypes.LOAD_CLUBBING_DISCOUNTS;
  constructor(
    public payload: ClubDiscountsListPayload,
    public discountCode?: string
  ) {}
}
export class LoadClubbingDiscountConfigListSuccess implements Action {
  readonly type = ClubDiscountsActionTypes.LOAD_CLUBBING_DISCOUNTS_SUCCESS;
  constructor(public payload: ClubDiscountsSuccessList) {}
}

export class LoadClubbingDiscountConfigListFailure implements Action {
  readonly type = ClubDiscountsActionTypes.LOAD_CLUBBING_DISCOUNTS_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class SaveClubbingDiscountConfigList implements Action {
  readonly type = ClubDiscountsActionTypes.SAVE_CLUBBING_DISCOUNTS;
  constructor(public payload: SaveRulesPayload) {}
}
export class SaveClubbingDiscountConfigListSuccess implements Action {
  readonly type = ClubDiscountsActionTypes.SAVE_CLUBBING_DISCOUNTS_SUCCESS;
  constructor(public payload: ClubDiscountsList) {}
}

export class SaveClubbingDiscountConfigListFailure implements Action {
  readonly type = ClubDiscountsActionTypes.SAVE_CLUBBING_DISCOUNTS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadType1Discounts implements Action {
  readonly type = ClubDiscountsActionTypes.LOAD_TYPE1_DISCOUNTS;
  constructor(public payload: string) {}
}
export class LoadType1DiscountsSuccess implements Action {
  readonly type = ClubDiscountsActionTypes.LOAD_TYPE1_DISCOUNTS_SUCCESS;
  constructor(public payload: DiscountTypeBasedCodes[]) {}
}

export class LoadType1DiscountsFailure implements Action {
  readonly type = ClubDiscountsActionTypes.LOAD_TYPE1_DISCOUNTS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadType2Discounts implements Action {
  readonly type = ClubDiscountsActionTypes.LOAD_TYPE2_DISCOUNTS;
  constructor(public payload: string) {}
}
export class LoadType2DiscountsSuccess implements Action {
  readonly type = ClubDiscountsActionTypes.LOAD_TYPE2_DISCOUNTS_SUCCESS;
  constructor(public payload: DiscountTypeBasedCodes[]) {}
}
export class LoadType2DiscountsFailure implements Action {
  readonly type = ClubDiscountsActionTypes.LOAD_TYPE2_DISCOUNTS_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class LoadType3Discounts implements Action {
  readonly type = ClubDiscountsActionTypes.LOAD_TYPE3_DISCOUNTS;
  constructor(public payload: string) {}
}
export class LoadType3DiscountsSuccess implements Action {
  readonly type = ClubDiscountsActionTypes.LOAD_TYPE3_DISCOUNTS_SUCCESS;
  constructor(public payload: DiscountTypeBasedCodes[]) {}
}

export class LoadType3DiscountsFailure implements Action {
  readonly type = ClubDiscountsActionTypes.LOAD_TYPE3_DISCOUNTS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class DeleteClubbingDiscountConfigList implements Action {
  readonly type = ClubDiscountsActionTypes.DELETE_CLUBBING_DISCOUNTS;
  constructor(public payload: any) {}
}
export class ResetClubbingDiscountConfigList implements Action {
  readonly type = ClubDiscountsActionTypes.RESET_CLUBBING_DISCOUNTS;
}
export type ClubDiscountsActions =
  | LoadClubbingDiscountConfigList
  | LoadClubbingDiscountConfigListSuccess
  | LoadClubbingDiscountConfigListFailure
  | SaveClubbingDiscountConfigList
  | SaveClubbingDiscountConfigListSuccess
  | SaveClubbingDiscountConfigListFailure
  | LoadType1Discounts
  | LoadType1DiscountsSuccess
  | LoadType1DiscountsFailure
  | LoadType2Discounts
  | LoadType2DiscountsSuccess
  | LoadType2DiscountsFailure
  | LoadType3Discounts
  | LoadType3DiscountsSuccess
  | LoadType3DiscountsFailure
  | DeleteClubbingDiscountConfigList
  | ResetClubbingDiscountConfigList;
