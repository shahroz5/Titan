import { Action } from '@ngrx/store';
import {
  CustomErrors,
  MarketDetails,
  MaterialPricePayload,
  MaterialPriceList,
  ViewLocationPayload,
  SavePricePayload,
  LoadSavedBasePrice,
  SearchMarketCodePayload,
  LoadMarketBasedOnMaterial,
  MarketListing,
  LocationDetailsList,
  SearchComputedPriceByLocationPayload,
  SearchSavedLocationPriceByLocationPayload
} from '@poss-web/shared/models';

export enum MarketMaterialPriceActionTypes {
  LOAD_METAL_PRICE_DETAILS = '[MaterialPriceType]Load Material Price Details',
  LOAD_METAL_PRICE_DETAILS_SUCCESS = '[MaterialPriceType]Load Material Price Details Success',
  LOAD_METAL_PRICE_DETAILS_FAILURE = '[MaterialPriceType]Load Material Price Details Failure',

  LOAD_MARKET_DETAILS_BASED_ON_MATERIAL = '[MaterialPriceType]Load Market Details Based on Material',
  LOAD_MARKET_DETAILS_BASED_ON_MATERIAL_SUCCESS = '[MaterialPriceType]Load Market Details Based on Material Success',
  LOAD_MARKET_DETAILS_BASED_ON_MATERIAL_FAILURE = '[MaterialPriceType]Load Market Details Based on Material Failure',

  SAVE_PRICE = '[MaterialPriceType]Save Price',
  SAVE_PRICE_SUCCESS = '[MaterialPriceType] Save Price Success',
  SAVE_PRICE_FAILURE = '[MaterialPriceType]Save Price Failure',

  UPDATE_CHECKBOX = '[MaterialPriceType]Update Checkbox',

  COMPUTE_BASE_PRICE = '[MaterialPriceType]Compute Base Price',

  VIEW_LOCATION_PRICE = '[MaterialPriecType] View Location Price',
  VIEW_LOCATION_PRICE_SUCCESS = '[MaterialPriceType] View Location Price Success',
  VIEW_LOCATION_PRICE_FAILURE = '[MaterialPriceType] View Location Price Failure',

  LOAD_SAVED_BASE_PRICE = '[MaterialPriceType]Load Saved Base Price',
  LOAD_SAVED_BASE_PRICE_SUCCESS = '[MaterialPriceType]Load Saved Base Price Success',
  LOAD_SAVED_BASE_PRICE_FAILURE = '[MaterialPriceType]Load Saved Base Price Failure',

  SEARCH_MARKET_CODE = '[MaterialPriceType]Search Market Code',
  SEARCH_MARKET_CODE_SUCCESS = '[MaterialPriceType]Search Market Code Success',
  SEARCH_MARKET_CODE_FAILURE = '[MaterialPriceType]Search Market Code Failure',

  SEARCH_SAVED_LOCATION_PRICE_BY_LOCATION_CODE = '[MaterialPriceType]Search Saved Location Price By Location Code',
  SEARCH_SAVED_LOCATION_PRICE_BY_LOCATION_CODE_SUCCESS = '[MaterialPriceType]Search Saved Location Price By Location Code Success',
  SEARCH_SAVED_LOCATION_PRICE_BY_LOCATION_CODE_FAILURE = '[MaterialPriceType]Search Saved Location Price By Location Code Failure',

  SEARCH_COMPUTED_PRICE_BY_LOCATION_CODE = '[MaterialPriceType]Search Computed Price By Location Code',
  SEARCH_COMPUTED_PRICE_BY_LOCATION_CODE_SUCCESS = '[MaterialPriceType]Search Computed Price By Location Code Success',
  SEARCH_COMPUTED_PRICE_BY_LOCATION_CODE_FAILURE = '[MaterialPriceType]Search Computed Price By Location Code Failure',

  LOAD_RESET = '[MaterialPriceType] Load Reset',
  LOAD_RESET_SELECTED_STOCK = '[MaterialPriceType] Load Reset Selected Stock',

  LOAD_RESET_LOCATION_DATA = '[MaterialPriceType] Load Reset Location Data',
  UPDATE_SELECTED_DATE = '[MaterialPriceType] Update Selected Date',

  UPDATE_SELECTED_STOCK = '[MaterialPriceType] Update Selected Stock',
  UPDATE_MARKET_CODE_SELECTED = '[MaterialPriceType] Update Market Code Selected',

  COMPUTE_PRICE_FOR_ALL = '[MaterialPriceType] Compute Price For All',

  REMOVE_PRICE_FOR_ALL = '[MaterialPriceType] Remove Price For All',
  UPDATE_ALL_SELECTED = '[MaterialPriceType] Update All Selected',

  UPDATE_HAS_NEW_VIEW_LOCATION_PRICE = '[MaterilaPriceType] Update Has View Location Price Success',

  LOAD_IS_VALUE_RESET_To_ZERO = '[MaterialPriceType]Load Is Value Reset To Zero',
  LOAD_IS_VALUE_RESET_To_ZERO_SUCCESS = '[MaterialPriceType]Load Is Value Reset To Zero Success',
  LOAD_IS_VALUE_RESET_To_ZERO_FAILURE = '[MaterialPriceType]Load Is Value Reset To Zero Failure'
}

export class UpdateHasNewViewLocationPrice implements Action {
  readonly type =
    MarketMaterialPriceActionTypes.UPDATE_HAS_NEW_VIEW_LOCATION_PRICE;
  constructor(public payload: boolean) {}
}
export class UpdateAllSelected implements Action {
  readonly type = MarketMaterialPriceActionTypes.UPDATE_ALL_SELECTED;
  constructor(public payload: boolean) {}
}
export class ComputePriceForAll implements Action {
  readonly type = MarketMaterialPriceActionTypes.COMPUTE_PRICE_FOR_ALL;
  constructor(public payload: MarketDetails[]) {}
}
export class RemovePriceForAll implements Action {
  readonly type = MarketMaterialPriceActionTypes.REMOVE_PRICE_FOR_ALL;
  constructor(public payload: MarketDetails[]) {}
}
export class UpdateSelectedMarketCode implements Action {
  readonly type = MarketMaterialPriceActionTypes.UPDATE_MARKET_CODE_SELECTED;
  constructor(public payload: any) {}
}
export class UpdateSelectedStock implements Action {
  readonly type = MarketMaterialPriceActionTypes.UPDATE_SELECTED_STOCK;
  constructor(public payload: any) {}
}
export class UpdateSelectedDate implements Action {
  readonly type = MarketMaterialPriceActionTypes.UPDATE_SELECTED_DATE;
  constructor(public payload: any) {}
}
export class LoadReset implements Action {
  readonly type = MarketMaterialPriceActionTypes.LOAD_RESET;
}
export class LoadResetLocationData implements Action {
  readonly type = MarketMaterialPriceActionTypes.LOAD_RESET_LOCATION_DATA;
}
export class LoadResetSelectedStock implements Action {
  readonly type = MarketMaterialPriceActionTypes.LOAD_RESET_SELECTED_STOCK;
}

export class SearchComputedPriceByLocationCode implements Action {
  readonly type =
    MarketMaterialPriceActionTypes.SEARCH_COMPUTED_PRICE_BY_LOCATION_CODE;
  constructor(public payload: SearchComputedPriceByLocationPayload) {}
}
export class SearchComputedPriceByLocationCodeSuccess implements Action {
  readonly type =
    MarketMaterialPriceActionTypes.SEARCH_COMPUTED_PRICE_BY_LOCATION_CODE_SUCCESS;
  constructor(public payload: LocationDetailsList) {}
}
export class SearchComputedPriceByLocationCodeFailure implements Action {
  readonly type =
    MarketMaterialPriceActionTypes.SEARCH_COMPUTED_PRICE_BY_LOCATION_CODE_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SearchSavedLocationPriceByLocationCode implements Action {
  readonly type =
    MarketMaterialPriceActionTypes.SEARCH_SAVED_LOCATION_PRICE_BY_LOCATION_CODE;
  constructor(public payload: SearchSavedLocationPriceByLocationPayload) {}
}
export class SearchSavedLocationPriceByLocationCodeSuccess implements Action {
  readonly type =
    MarketMaterialPriceActionTypes.SEARCH_SAVED_LOCATION_PRICE_BY_LOCATION_CODE_SUCCESS;
  constructor(public payload: LocationDetailsList) {}
}
export class SearchSavedLocationPriceByLocationCodeFailure implements Action {
  readonly type =
    MarketMaterialPriceActionTypes.SEARCH_SAVED_LOCATION_PRICE_BY_LOCATION_CODE_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SearchMarketCode implements Action {
  readonly type = MarketMaterialPriceActionTypes.SEARCH_MARKET_CODE;
  constructor(public payload: SearchMarketCodePayload) {}
}
export class SearchMarketCodeSuccess implements Action {
  readonly type = MarketMaterialPriceActionTypes.SEARCH_MARKET_CODE_SUCCESS;
  constructor(public payload: MarketListing) {}
}
export class SearchMarketCodeFailure implements Action {
  readonly type = MarketMaterialPriceActionTypes.SEARCH_MARKET_CODE_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class LoadSavedPrice implements Action {
  readonly type = MarketMaterialPriceActionTypes.LOAD_SAVED_BASE_PRICE;
  constructor(public payload: LoadSavedBasePrice) {}
}
export class LoadSavedPriceSuccess implements Action {
  readonly type = MarketMaterialPriceActionTypes.LOAD_SAVED_BASE_PRICE_SUCCESS;
  constructor(public payload: LocationDetailsList) {}
}
export class LoadSavedPriceFailure implements Action {
  readonly type = MarketMaterialPriceActionTypes.LOAD_SAVED_BASE_PRICE_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class ViewLocationPrice implements Action {
  readonly type = MarketMaterialPriceActionTypes.VIEW_LOCATION_PRICE;
  constructor(public payload: ViewLocationPayload) {}
}
export class ViewLocationPriceSuccess implements Action {
  readonly type = MarketMaterialPriceActionTypes.VIEW_LOCATION_PRICE_SUCCESS;
  constructor(public payload: LocationDetailsList) {}
}

export class ViewLocationPriceFailure implements Action {
  readonly type = MarketMaterialPriceActionTypes.VIEW_LOCATION_PRICE_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class UpdateCheckBox implements Action {
  readonly type = MarketMaterialPriceActionTypes.UPDATE_CHECKBOX;
  constructor(public payload: any) {}
}
export class ComputeBasePriceForForcedType implements Action {
  readonly type = MarketMaterialPriceActionTypes.COMPUTE_BASE_PRICE;
  constructor(public payload: any) {}
}

export class SavePrice implements Action {
  readonly type = MarketMaterialPriceActionTypes.SAVE_PRICE;
  constructor(public payload: SavePricePayload) {}
}
export class SavePriceSuccess implements Action {
  readonly type = MarketMaterialPriceActionTypes.SAVE_PRICE_SUCCESS;
}
export class SavePriceFailure implements Action {
  readonly type = MarketMaterialPriceActionTypes.SAVE_PRICE_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadMetalPriceDetails implements Action {
  readonly type = MarketMaterialPriceActionTypes.LOAD_METAL_PRICE_DETAILS;
  constructor(public payload: MaterialPricePayload) {}
}
export class LoadMetalPriceDetailsSuccess implements Action {
  readonly type =
    MarketMaterialPriceActionTypes.LOAD_METAL_PRICE_DETAILS_SUCCESS;
  constructor(public payload: any) {}
}
export class LoadMetalPriceDetailsFailure implements Action {
  readonly type =
    MarketMaterialPriceActionTypes.LOAD_METAL_PRICE_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class LoadMarketDetailsBasedOnMaterial implements Action {
  readonly type =
    MarketMaterialPriceActionTypes.LOAD_MARKET_DETAILS_BASED_ON_MATERIAL;
  constructor(public payload: LoadMarketBasedOnMaterial) {}
}
export class LoadMarketDetailsBasedOnMaterialSuccess implements Action {
  readonly type =
    MarketMaterialPriceActionTypes.LOAD_MARKET_DETAILS_BASED_ON_MATERIAL_SUCCESS;
  constructor(public payload: MarketListing) {}
}
export class LoadMarketDetailsBasedOnMaterialFailure implements Action {
  readonly type =
    MarketMaterialPriceActionTypes.LOAD_MARKET_DETAILS_BASED_ON_MATERIAL_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadIsValueResetToZero implements Action {
  readonly type = MarketMaterialPriceActionTypes.LOAD_IS_VALUE_RESET_To_ZERO;
}
export class LoadIsValueResetToZeroSuccess implements Action {
  readonly type =
    MarketMaterialPriceActionTypes.LOAD_IS_VALUE_RESET_To_ZERO_SUCCESS;
}
export class LoadIsValueResetToZeroFailure implements Action {
  readonly type =
    MarketMaterialPriceActionTypes.LOAD_IS_VALUE_RESET_To_ZERO_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export type MarketMaterialPriceActions =
  | ViewLocationPrice
  | ViewLocationPriceSuccess
  | ViewLocationPriceFailure
  | UpdateCheckBox
  | ComputeBasePriceForForcedType
  | LoadMetalPriceDetails
  | LoadMetalPriceDetailsSuccess
  | LoadMetalPriceDetailsFailure
  | LoadMarketDetailsBasedOnMaterial
  | LoadMarketDetailsBasedOnMaterialSuccess
  | LoadMarketDetailsBasedOnMaterialFailure
  | SavePrice
  | SavePriceSuccess
  | SavePriceFailure
  | LoadSavedPrice
  | LoadSavedPriceSuccess
  | LoadSavedPriceFailure
  | SearchMarketCode
  | SearchMarketCodeSuccess
  | SearchMarketCodeFailure
  | SearchComputedPriceByLocationCode
  | SearchComputedPriceByLocationCodeSuccess
  | SearchComputedPriceByLocationCodeFailure
  | SearchSavedLocationPriceByLocationCode
  | SearchSavedLocationPriceByLocationCodeSuccess
  | SearchSavedLocationPriceByLocationCodeFailure
  | UpdateSelectedDate
  | LoadReset
  | UpdateSelectedStock
  | UpdateSelectedMarketCode
  | ComputePriceForAll
  | RemovePriceForAll
  | UpdateAllSelected
  | UpdateHasNewViewLocationPrice
  | LoadResetLocationData
  | LoadResetSelectedStock
  | LoadIsValueResetToZero
  | LoadIsValueResetToZeroSuccess
  | LoadIsValueResetToZeroFailure;
