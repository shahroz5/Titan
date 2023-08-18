import { Action } from '@ngrx/store';
import {
  CustomErrors,
  LocationListingPayload,
  LocationListingPage,
  LocationMasterDetails,
  LocationTypes,
  Towns,
  StateTypes,
  OwnerTypes,
  RegionSummary,
  BrandSummary,
  MarketCodeTypes,
  BaseCurrencyTypes,
  LocationMasterDropdownList,
  CurrencyTypes,
  CopyDetailsPayload,
  LocationCFAType
} from '@poss-web/shared/models';

export enum LocationMasterActionTypes {
  LOAD_LOCATION_LISTING = '[ Location-listing ] Load location listing',
  LOAD_LOCATION_LISTING_SUCCESS = '[ Location-listing ] Load location listing Success',
  LOAD_LOCATION_LISTING_FAILURE = '[ Location-listing ] Load location listing Failure',

  SEARCH_LOCATION_BY_LOCATIONCODE = '[Location-listing] Search Location By Location Code',
  SEARCH_LOCATION_BY_LOCATIONCODE_SUCCESS = '[Location-listing] Search Location By Location Code Success',
  SEARCH_LOCATION_BY_LOCATIONCODE_FAILURE = '[Location-listing] Search Location By Location Code Failure',

  COPY_DETAILS = '[Location-listing] Copy Details',
  COPY_DETAILS_SUCCESS = '[Location-listing] Copy Details Success',
  COPY_DETAILS_FAILURE = '[location-listing] Copy Details Failure',

  LOAD_LOCATION_DETAILS = '[Location-Details] Load loacation Details',
  LOAD_LOCATION_DETAILS_SUCCESS = '[Location-Details] Load loacation Details Success',
  LOAD_LOCATION_DETAILS_FAILURE = '[Location-Details] Load loacation Details Failure',

  SAVE_LOCATION_DETAILS = '[Location-Details] Save loacation Details',
  SAVE_LOCATION_DETAILS_SUCCESS = '[Location-Details] Save loacation Details Success',
  SAVE_LOCATION_DETAILS_FAILURE = '[Location-Details] Save loacation Details Failure',

  UPDATE_LOCATION_DETAILS = '[Location-Details] Update loacation Details',
  UPDATE_LOCATION_DETAILS_SUCCESS = '[Location-Details] Update loacation Details Success',
  UPDATE_LOCATION_DETAILS_FAILURE = '[Location-Details] Update loacation Details Failure',

  // Loading dropdown items
  LOAD_LOCATION_TYPES = '[Location-listing] Load Location Types',
  LOAD_LOCATION_TYPES_SUCCESS = '[Location-listing] Load Location Types Success',
  LOAD_LOCAITON_TYPES_FAILURE = '[Location-listing] Load Location Types Failure',

  LOAD_TOWNS = '[Location-listing] Load towns',
  LOAD_TOWNS_SUCCESS = '[Location-listing] Load Towns Success',
  LOAD_TOWNS_FAILURE = '[Location-listing] Load Towns Failure',

  LOAD_STATES = '[Location-listing] Load States',
  LOAD_STATES_SUCCESS = '[Location-listing] Load States Success',
  LOAD_STATES_FAILURE = '[Location-listing] Load States Failure',

  LOAD_OWNER_INFO = '[Location-listing] Load Owner Info',
  LOAD_OWNER_INFO_SUCCESS = '[Location-listing] Load Owner Info Success',
  LOAD_OWNER_INFO_FAILURE = '[Location-listing]Load Owner Info Failure',

  LOAD_REGION = '[Location-listing] Load Region',
  LOAD_REGION_SUCCESS = '[Location-listing] Load Region Success',
  LOAD_REGION_FAILURE = '[Location-listing] Load Region Failure',

  LOAD_SUB_REGION_DETAILS = '[Location] Load Sub Region Details',
  LOAD_SUB_REGION_DETAILS_SUCCESS = '[Location] Load Sub Region Details Success',
  LOAD_SUB_REGION_DETAILS_FAILURE = '[Location] Load Sub Region Details Failure',

  LOAD_BRAND = '[Location-listing] Load Brands',
  LOAD_BRAND_SUCCESS = '[Location-listing] Load Brands Success',
  LOAD_BRAND_FAILURE = '[Location-listing] Load Brands Failure',

  LOAD_SUB_BRAND_DETAILS = '[Location] Load Sub Brand Details',
  LOAD_SUB_BRAND_DETAILS_SUCCESS = '[Location] Load Sub Brand Details Success',
  LOAD_SUB_BRAND_DETAILS_FAILURE = '[Location] Load Sub Brand Details Failure',

  LOAD_MARKET_CODE = '[ghs-checkout] Load States',
  LOAD_MARKET_CODE_SUCCESS = '[ghs-checkout] Load States Success',
  LOAD_MARKET_CODE_FAILURE = '[ghs-checkout] Load States Failure',

  LOAD_BASE_CURRENCY = '[ghs-checkout] Load BaseCurrency',
  LOAD_BASE_CURRENCY_SUCCESS = '[ghs-checkout] Load BaseCurrency Success',
  LOAD_BASE_CURRENCY_FAILURE = '[ghs-checkout] Load BaseCurrency Failure',

  LOAD_CURRENCY = '[ Location ] Load Currency',
  LOAD_CURRENCY_SUCCESS = '[ Location ] Load Currency Success',
  LOAD_CURRENCY_FAILURE = '[ Location ] Load Currency Failure',

  LOAD_LOCATION_SIZE = '[ Location ] Load LocationSize',
  LOAD_LOCATION_SIZE_SUCCESS = '[ Location ] Load LocationSize Success',
  LOAD_LOCATION_SIZE_FAILURE = '[ Location ] Load LocationSize Failure',

  LOAD_INVOICE_TYPE = '[ Location ] Load InvoiceType',
  LOAD_INVOICE_TYPE_SUCCESS = '[ Location ] Load InvoiceType Success',
  LOAD_INVOICE_TYPE_FAILURE = '[ Location ] Load InvoiceType Failure',

  LOAD_REFUND_MODE = '[ Location ] Load RefundMode',
  LOAD_REFUND_MODE_SUCCESS = '[ Location ] Load RefundMode Success',
  LOAD_REFUND_MODE_FAILURE = '[ Location ] Load RefundMode Failure',

  LOAD_COUNTRY_CODE = '[ Location ] Load CountryCode',
  LOAD_COUNTRY_CODE_SUCCESS = '[ Location ] Load CountryCode Success',
  LOAD_COUNTRY_CODE_FAILURE = '[ Location ] Load CountryCode Failure',

  LOAD_CFA_LIST = '[ Location ] Load CFA List',
  LOAD_CFA_LIST_SUCCESS = '[ Location ] Load CFA List Success',
  LOAD_CFA_LIST_FAILURE = '[ Location ] Load CFA List Failure',
  // Loading dropdown items ends

  UPDATE_TRANSACTION_TYPE_DETAILS = '[Location-Details] Update Transaction Type Details',
  UPDATE_TRANSACTION_TYPE_DETAILS_SUCCESS = '[Location-Details] Update Transaction Type Details Success',
  UPDATE_TRANSACTION_TYPE_DETAILS_FAILURE = '[Location-Details] Update Transaction Type Details Failure',

  UPDATE_GHS_DETAILS = '[Location-Details] Update GHS Details',
  UPDATE_GHS_DETAILS_SUCCESS = '[Location-Details] Update GHS Details Success',
  UPDATE_GHS_DETAILS_FAILURE = '[Location-Details] Update GHS Details Failure',

  UPDATE_INVENTORY_DETAILS = '[Location-Details] Update Inventory Details',
  UPDATE_INVENTORY_DETAILS_SUCCESS = '[Location-Details] Update Inventory Details Success',
  UPDATE_INVENTORY_DETAILS_FAILURE = '[Location-Details] Update Inventory Details Failure',

  UPDATE_BANKING_DETAILS = '[Location-Details] Update Banking Details',
  UPDATE_BANKING_DETAILS_SUCCESS = '[Location-Details] Update Banking Details Success',
  UPDATE_BANKING_DETAILS_FAILURE = '[Location-Details] Update Banking Details Failure',

  UPDATE_OTP_DETAILS = '[Location-Details] Update OTP Details',
  UPDATE_OTP_DETAILS_SUCCESS = '[Location-Details] Update OTP Details Success',
  UPDATE_OTP_DETAILS_FAILURE = '[Location-Details] Update OTP Details Failure',

  UPDATE_CUSTOMER_DETAILS = '[Location-Details] Update customer Details',
  UPDATE_CUSTOMER_DETAILS_SUCCESS = '[Location-Details] Update customer Details Success',
  UPDATE_CUSTOMER_DETAILS_FAILURE = '[Location-Details] Update customer Details Failure',

  UPDATE_PAYMENTS_DETAILS = '[Location-Details] Update payments Details',
  UPDATE_PAYMENTS_DETAILS_SUCCESS = '[Location-Details] Update payments Details Success',
  UPDATE_PAYMENTS_DETAILS_FAILURE = '[Location-Details] Update payments Details Failure',

  UPDATE_FOC_DETAILS = '[Location-Details] Update foc Details',
  UPDATE_FOC_DETAILS_SUCCESS = '[Location-Details] Update foc Details Success',
  UPDATE_FOC_DETAILS_FAILURE = '[Location-Details] Update foc Details Failure',

  UPDATE_DISCOUNT_DETAILS = '[Location-Details] Update discount Details',
  UPDATE_DISCOUNT_DETAILS_SUCCESS = '[Location-Details] Update discount Details Success',
  UPDATE_DISCOUNT_DETAILS_FAILURE = '[Location-Details] Update discount Details Failure'
}

export class LoadLocationListing implements Action {
  readonly type = LocationMasterActionTypes.LOAD_LOCATION_LISTING;
  constructor(public payload: LocationListingPage) {}
}
export class LoadLocationListingSuccess implements Action {
  readonly type = LocationMasterActionTypes.LOAD_LOCATION_LISTING_SUCCESS;
  constructor(public payload: LocationListingPayload) {}
}
export class LoadLocationListingFailure implements Action {
  readonly type = LocationMasterActionTypes.LOAD_LOCATION_LISTING_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SearchLocationByLocationCode implements Action {
  readonly type = LocationMasterActionTypes.SEARCH_LOCATION_BY_LOCATIONCODE;
  constructor(public payload: string) {}
}
export class SearchLocationByLocationCodeSuccess implements Action {
  readonly type =
    LocationMasterActionTypes.SEARCH_LOCATION_BY_LOCATIONCODE_SUCCESS;
  constructor(public payload: LocationListingPayload) {}
}
export class SearchLocationByLocationCodeFailure implements Action {
  readonly type =
    LocationMasterActionTypes.SEARCH_LOCATION_BY_LOCATIONCODE_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class CopyDetails implements Action {
  readonly type = LocationMasterActionTypes.COPY_DETAILS;
  constructor(public payload: CopyDetailsPayload) {}
}
export class CopyDetailsSuccess implements Action {
  readonly type = LocationMasterActionTypes.COPY_DETAILS_SUCCESS;

}

export class CopyDetailsFailure implements Action {
  readonly type = LocationMasterActionTypes.COPY_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadLocationDetails implements Action {
  readonly type = LocationMasterActionTypes.LOAD_LOCATION_DETAILS;
  constructor(public payload: string) {}
}
export class LoadLocationDetailsSuccess implements Action {
  readonly type = LocationMasterActionTypes.LOAD_LOCATION_DETAILS_SUCCESS;
  constructor(public payload: LocationMasterDetails) {}
}
export class LoadLocationDetailsFailure implements Action {
  readonly type = LocationMasterActionTypes.LOAD_LOCATION_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SaveLocationDetails implements Action {
  readonly type = LocationMasterActionTypes.SAVE_LOCATION_DETAILS;
  constructor(public payload: LocationMasterDetails) {}
}
export class SaveLocationDetailsSuccess implements Action {
  readonly type = LocationMasterActionTypes.SAVE_LOCATION_DETAILS_SUCCESS;
  constructor(public payload: LocationMasterDetails) {}
}
export class SaveLocationDetailsFailure implements Action {
  readonly type = LocationMasterActionTypes.SAVE_LOCATION_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class UpdateLocationDetails implements Action {
  readonly type = LocationMasterActionTypes.UPDATE_LOCATION_DETAILS;
  constructor(public payload: LocationMasterDetails) {}
}
export class UpdateLocationDetailsSuccess implements Action {
  readonly type = LocationMasterActionTypes.UPDATE_LOCATION_DETAILS_SUCCESS;
  constructor(public payload: LocationMasterDetails) {}
}
export class UpdateLocationDetailsFailure implements Action {
  readonly type = LocationMasterActionTypes.UPDATE_LOCATION_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

// Loading dropdown items
export class LoadLocationTypes implements Action {
  readonly type = LocationMasterActionTypes.LOAD_LOCATION_TYPES;
}

export class LoadLocationTypesSuccess implements Action {
  readonly type = LocationMasterActionTypes.LOAD_LOCATION_TYPES_SUCCESS;
  constructor(public payload: LocationTypes) {}
}

export class LoadLocationTypesFailure implements Action {
  readonly type = LocationMasterActionTypes.LOAD_LOCAITON_TYPES_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadTowns implements Action {
  readonly type = LocationMasterActionTypes.LOAD_TOWNS;
  constructor(public payload: string) {}
}

export class LoadTownsSuccess implements Action {
  readonly type = LocationMasterActionTypes.LOAD_TOWNS_SUCCESS;
  constructor(public payload: Towns[]) {}
}

export class LoadTownsFailure implements Action {
  readonly type = LocationMasterActionTypes.LOAD_TOWNS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadStates implements Action {
  readonly type = LocationMasterActionTypes.LOAD_STATES;
  constructor(public payload: string) {}
}

export class LoadStatesSuccess implements Action {
  readonly type = LocationMasterActionTypes.LOAD_STATES_SUCCESS;
  constructor(public payload: StateTypes[]) {}
}

export class LoadStatesFailure implements Action {
  readonly type = LocationMasterActionTypes.LOAD_STATES_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadOwnerInfo implements Action {
  readonly type = LocationMasterActionTypes.LOAD_OWNER_INFO;
}

export class LoadOwnerInfoSuccess implements Action {
  readonly type = LocationMasterActionTypes.LOAD_OWNER_INFO_SUCCESS;
  constructor(public payload: OwnerTypes) {}
}

export class LoadOwnerInfoFailure implements Action {
  readonly type = LocationMasterActionTypes.LOAD_OWNER_INFO_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadRegion implements Action {
  readonly type = LocationMasterActionTypes.LOAD_REGION;
}
export class LoadRegionSuccess implements Action {
  readonly type = LocationMasterActionTypes.LOAD_REGION_SUCCESS;
  constructor(public payload: LocationMasterDropdownList[]) {}
}

export class LoadRegionFailure implements Action {
  readonly type = LocationMasterActionTypes.LOAD_REGION_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadSubRegion implements Action {
  readonly type = LocationMasterActionTypes.LOAD_SUB_REGION_DETAILS;
  constructor(public payload: string) {}
}

export class LoadSubRegionSuccess implements Action {
  readonly type = LocationMasterActionTypes.LOAD_SUB_REGION_DETAILS_SUCCESS;
  constructor(public payload: RegionSummary[]) {}
}

export class LoadSubRegionFailure implements Action {
  readonly type = LocationMasterActionTypes.LOAD_SUB_REGION_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadBrand implements Action {
  readonly type = LocationMasterActionTypes.LOAD_BRAND;
}

export class LoadBrandSuccess implements Action {
  readonly type = LocationMasterActionTypes.LOAD_BRAND_SUCCESS;
  constructor(public payload: LocationMasterDropdownList[]) {}
}

export class LoadBrandFailure implements Action {
  readonly type = LocationMasterActionTypes.LOAD_BRAND_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadSubBrand implements Action {
  readonly type = LocationMasterActionTypes.LOAD_SUB_BRAND_DETAILS;
  constructor(public payload: string) {}
}

export class LoadSubBrandSuccess implements Action {
  readonly type = LocationMasterActionTypes.LOAD_SUB_BRAND_DETAILS_SUCCESS;
  constructor(public payload: BrandSummary[]) {}
}

export class LoadSubBrandFailure implements Action {
  readonly type = LocationMasterActionTypes.LOAD_SUB_BRAND_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadMarketCode implements Action {
  readonly type = LocationMasterActionTypes.LOAD_MARKET_CODE;
}

export class LoadMarketCodeSuccess implements Action {
  readonly type = LocationMasterActionTypes.LOAD_MARKET_CODE_SUCCESS;
  constructor(public payload: MarketCodeTypes) {}
}

export class LoadMarketCodeFailure implements Action {
  readonly type = LocationMasterActionTypes.LOAD_MARKET_CODE_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadBaseCurrency implements Action {
  readonly type = LocationMasterActionTypes.LOAD_BASE_CURRENCY;
}

export class LoadBaseCurrencySuccess implements Action {
  readonly type = LocationMasterActionTypes.LOAD_BASE_CURRENCY_SUCCESS;
  constructor(public payload: BaseCurrencyTypes[]) {}
}

export class LoadBaseCurrencyFailure implements Action {
  readonly type = LocationMasterActionTypes.LOAD_BASE_CURRENCY_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadCurrency implements Action {
  readonly type = LocationMasterActionTypes.LOAD_CURRENCY;
}
export class LoadCurrencySuccess implements Action {
  readonly type = LocationMasterActionTypes.LOAD_CURRENCY_SUCCESS;
  constructor(public payload: CurrencyTypes[]) {}
}

export class LoadCurrencyFailure implements Action {
  readonly type = LocationMasterActionTypes.LOAD_CURRENCY_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadLocationSize implements Action {
  readonly type = LocationMasterActionTypes.LOAD_LOCATION_SIZE;
}
export class LoadLocationSizeSuccess implements Action {
  readonly type = LocationMasterActionTypes.LOAD_LOCATION_SIZE_SUCCESS;
  constructor(public payload: StateTypes[]) {}
}

export class LoadLocationSizeFailure implements Action {
  readonly type = LocationMasterActionTypes.LOAD_LOCATION_SIZE_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadInvoiceType implements Action {
  readonly type = LocationMasterActionTypes.LOAD_INVOICE_TYPE;
}
export class LoadInvoiceTypeSuccess implements Action {
  readonly type = LocationMasterActionTypes.LOAD_INVOICE_TYPE_SUCCESS;
  constructor(public payload: StateTypes[]) {}
}

export class LoadInvoiceTypeFailure implements Action {
  readonly type = LocationMasterActionTypes.LOAD_INVOICE_TYPE_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadRefundMode implements Action {
  readonly type = LocationMasterActionTypes.LOAD_REFUND_MODE;
}
export class LoadRefundModeSuccess implements Action {
  readonly type = LocationMasterActionTypes.LOAD_REFUND_MODE_SUCCESS;
  constructor(public payload: StateTypes[]) {}
}

export class LoadRefundModeFailure implements Action {
  readonly type = LocationMasterActionTypes.LOAD_REFUND_MODE_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadCountryCode implements Action {
  readonly type = LocationMasterActionTypes.LOAD_COUNTRY_CODE;
}
export class LoadCountryCodeSuccess implements Action {
  readonly type = LocationMasterActionTypes.LOAD_COUNTRY_CODE_SUCCESS;
  constructor(public payload: { id: string; name: string }[]) {}
}
export class LoadCountryCodeFailure implements Action {
  readonly type = LocationMasterActionTypes.LOAD_COUNTRY_CODE_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadCFAList implements Action {
  readonly type = LocationMasterActionTypes.LOAD_CFA_LIST;
}
export class LoadCFAListSuccess implements Action {
  readonly type = LocationMasterActionTypes.LOAD_CFA_LIST_SUCCESS;
  constructor(public payload: LocationCFAType[]) {}
}
export class LoadCFAListFailure implements Action {
  readonly type = LocationMasterActionTypes.LOAD_CFA_LIST_FAILURE;
  constructor(public payload: CustomErrors) {}
}
// Loading dropdown items ends

// All other details updating
// export class UpdateTransaction implements Action {
//   readonly type = LocationMasterActionTypes.UPDATE_TRANSACTION_TYPE_DETAILS;
//   constructor(public payload: LocationMasterDetails) {}
// }
// export class UpdateTransactionSuccess implements Action {
//   readonly type =
//     LocationMasterActionTypes.UPDATE_TRANSACTION_TYPE_DETAILS_SUCCESS;
//   constructor(public payload: LocationMasterDetails) {}
// }
// export class UpdateTransactionFailure implements Action {
//   readonly type =
//     LocationMasterActionTypes.UPDATE_TRANSACTION_TYPE_DETAILS_FAILURE;
//   constructor(public payload: CustomErrors) {}
// }

// export class UpdateGHS implements Action {
//   readonly type = LocationMasterActionTypes.UPDATE_GHS_DETAILS;
//   constructor(public payload: LocationMasterDetails) {}
// }
// export class UpdateGHSSuccess implements Action {
//   readonly type = LocationMasterActionTypes.UPDATE_GHS_DETAILS_SUCCESS;
//   constructor(public payload: LocationMasterDetails) {}
// }
// export class UpdateGHSFailure implements Action {
//   readonly type = LocationMasterActionTypes.UPDATE_GHS_DETAILS_FAILURE;
//   constructor(public payload: CustomErrors) {}
// }

// export class UpdateInventory implements Action {
//   readonly type = LocationMasterActionTypes.UPDATE_INVENTORY_DETAILS;
//   constructor(public payload: LocationMasterDetails) {}
// }
// export class UpdateInventorySuccess implements Action {
//   readonly type = LocationMasterActionTypes.UPDATE_INVENTORY_DETAILS_SUCCESS;
//   constructor(public payload: LocationMasterDetails) {}
// }
// export class UpdateInventoryFailure implements Action {
//   readonly type = LocationMasterActionTypes.UPDATE_INVENTORY_DETAILS_FAILURE;
//   constructor(public payload: CustomErrors) {}
// }

// export class UpdateBanking implements Action {
//   readonly type = LocationMasterActionTypes.UPDATE_BANKING_DETAILS;
//   constructor(public payload: LocationMasterDetails) {}
// }
// export class UpdateBankingSuccess implements Action {
//   readonly type = LocationMasterActionTypes.UPDATE_BANKING_DETAILS_SUCCESS;
//   constructor(public payload: LocationMasterDetails) {}
// }
// export class UpdateBankingFailure implements Action {
//   readonly type = LocationMasterActionTypes.UPDATE_BANKING_DETAILS_FAILURE;
//   constructor(public payload: CustomErrors) {}
// }
// All other details updating ends

export type LocationMasterActions =
  | LoadLocationListing
  | LoadLocationListingSuccess
  | LoadLocationListingFailure
  | SearchLocationByLocationCode
  | SearchLocationByLocationCodeSuccess
  | SearchLocationByLocationCodeFailure
  | CopyDetails
  | CopyDetailsSuccess
  | CopyDetailsFailure
  | LoadLocationDetails
  | LoadLocationDetailsSuccess
  | LoadLocationDetailsFailure
  | SaveLocationDetails
  | SaveLocationDetailsSuccess
  | SaveLocationDetailsFailure
  | UpdateLocationDetails
  | UpdateLocationDetailsSuccess
  | UpdateLocationDetailsFailure
  | LoadLocationTypes
  | LoadLocationTypesSuccess
  | LoadLocationTypesFailure
  | LoadTowns
  | LoadTownsSuccess
  | LoadTownsFailure
  | LoadStates
  | LoadStatesSuccess
  | LoadStatesFailure
  | LoadOwnerInfo
  | LoadOwnerInfoSuccess
  | LoadOwnerInfoFailure
  | LoadRegion
  | LoadRegionSuccess
  | LoadRegionFailure
  | LoadSubRegion
  | LoadSubRegionSuccess
  | LoadSubRegionFailure
  | LoadBrand
  | LoadBrandSuccess
  | LoadBrandFailure
  | LoadSubBrand
  | LoadSubBrandSuccess
  | LoadSubBrandFailure
  | LoadMarketCode
  | LoadMarketCodeSuccess
  | LoadMarketCodeFailure
  | LoadBaseCurrency
  | LoadBaseCurrencySuccess
  | LoadBaseCurrencyFailure
  | LoadCurrency
  | LoadCurrencySuccess
  | LoadCurrencyFailure
  | LoadLocationSize
  | LoadLocationSizeSuccess
  | LoadLocationSizeFailure
  | LoadInvoiceType
  | LoadInvoiceTypeSuccess
  | LoadInvoiceTypeFailure
  | LoadRefundMode
  | LoadRefundModeSuccess
  | LoadRefundModeFailure
  | LoadCountryCode
  | LoadCountryCodeSuccess
  | LoadCountryCodeFailure
  | LoadCFAList
  | LoadCFAListSuccess
  | LoadCFAListFailure;
