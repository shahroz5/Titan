import { Action } from '@ngrx/store';
import {
  CustomErrors,
  Customers,
  TownSummary,
  CountrySummary,
  CustomerLov,
  CustomerInfo,
  PincodeSummary,
  Zone,
  CreatedCustomerResponse,
  AllowedTransactionTypeMap,
  UpdateCustomerDetail,
  SEARCH_BY_ENUM,
  Brand,
  CustomerStateSummary,
  PanVerificationRequestPayload,
  ValidatePanResponse,
  GstVerificationRequestPayload,
  ValidateGstResponse,
  RivaahCouponDetail,
  ValidateEmailResponse,
  PanFormDetailsRequestPayload
} from '@poss-web/shared/models';

export interface FileUploadPayload {
  customerId?: number;
  file: FormData;
  id?: string;
  fileSubType?: string;
  fileType?: string;
  txnType?: string;
}

export enum CustomerActionTypes {
  LOAD_COUNTRIES = '[Create-Customer] Load Countries',
  LOAD_COUNTRIES_SUCCESS = '[Create-Customer] Load Countries Success',
  LOAD_COUNTRIES_FAILURE = '[Create-Customer] Load Countries Failure',

  LOAD_ALLOWED_TRANSACTIONTYPES = '[Create-Customer] Load Allowed Transaction Types',
  LOAD_ALLOWED_TRANSACTIONTYPES_SUCCESS = '[Create-Customer] Load Allowed Transaction Types Success',
  LOAD_ALLOWED_TRANSACTIONTYPES_FAILURE = '[Create-Customer] Load Allowed Transaction Types Failure',

  LOAD_STATES = '[Create-Customer] Load States',
  LOAD_STATES_SUCCESS = '[Create-Customer] Load States Success',
  LOAD_STATES_FAILURE = '[Create-Customer] Load States Failure',

  LOAD_TOWNS = '[Create-Customer] Load towns',
  LOAD_TOWNS_SUCCESS = '[Create-Customer] Load Towns Success',
  LOAD_TOWNS_FAILURE = '[Create-Customer] Load Towns Failure',

  LOAD_CATCHMENT_AREA = '[Create-Customer] Load Catchemnt Area',
  LOAD_CATCHMENT_AREA_SUCCESS = '[Create-Customer] Load Catchemnt Area Success',
  LOAD_CATCHMENT_AREA_FAILURE = '[Create-Customer] Load Catchemnt Area Failure',

  LOAD_PINCODE = '[Create-Customer] Load pincode',
  LOAD_PINCODE_SUCCESS = '[Create-Customer] Load Pincode Success',
  LOAD_PINCODE_FAILURE = '[Create-Customer] Load Pincode Failure',

  RESET_ERROR = '[ Create-Customer ] Reset Error',

  SAVE_CUSTOMER_FORM_DETAILS = '[Create-Customer] Save Customer Form Details',
  SAVE_CUSTOMER_FORM_DETAILS_SUCCESS = '[Create-Customer] Save Customer Form Details Success',
  SAVE_CUSTOMER_FORM_DETAILS_FAILURE = '[Create-Customer] Save Customer Form Details Failure',

  LOAD_SALUTATIONS = '[Create-Customer] Load Salutations',
  LOAD_SALUTATIONS_SUCCESS = '[Create-Customer] Load Salutations Success',
  LOAD_SALUTATIONS_FAILURE = '[Create-Customer] Load Salutations Failure',

  LOAD_ID_PROOFS = '[Create-Customer] Load ID Proofs',
  LOAD_ID_PROOFS_SUCCESS = '[Create-Customer] Load ID Proofs Success',
  LOAD_ID_PROOFS_FAILURE = '[Create-Customer] Load Load ID Proofs Failure',

  LOAD_COUNTRY_CODE = '[Create-Customer] Load Country Code',
  LOAD_COUNTRY_CODE_SUCCESS = '[Create-Customer] Load Country Code Success',
  LOAD_COUNTRY_CODE_FAILURE = '[Create-Customer] Load Country Code Failure',

  LOAD_CUSTOMER_UNIQUE_MOBILE = '[Create-Customer] Load Customers unique Mobile',
  LOAD_CUSTOMER_UNIQUE_MOBILE_SUCCESS = '[Create-Customer] Load Customers unique mobile Success',
  LOAD_CUSTOMER_UNIQUE_MOBILE_FAILURE = '[Create-Customer] Load Customers unique mobile Failure',

  LOAD_CUSTOMER_UNIQUE_EMAIL = '[Create-Customer] Load Customers unique email',
  LOAD_CUSTOMER_UNIQUE_EMAIL_SUCCESS = '[Create-Customer] Load Customers unique email Success',
  LOAD_CUSTOMER_UNIQUE_EMAIL_FAILURE = '[Create-Customer] Load Customers unique email Failure',

  LOAD_CUSTOMER_UNIQUE_PAN = '[Create-Customer] Load Customers unique pan',
  LOAD_CUSTOMER_UNIQUE_PAN_SUCCESS = '[Create-Customer] Load Customers unique pan Success',
  LOAD_CUSTOMER_UNIQUE_PAN_FAILURE = '[Create-Customer] Load Customers unique pan Failure',

  LOAD_CUSTOMER_UNIQUE_PASSPORT = '[Create-Customer] Load Customers unique PASSPORT',
  LOAD_CUSTOMER_UNIQUE_PASSPORT_SUCCESS = '[Create-Customer] Load Customers unique PASSPORT Success',
  LOAD_CUSTOMER_UNIQUE_PASSPORT_FAILURE = '[Create-Customer] Load Customers unique PASSPORT Failure',

  LOAD_CUSTOMER_UNIQUE_GST = '[Create-Customer] Load Customers unique GST',
  LOAD_CUSTOMER_UNIQUE_GST_SUCCESS = '[Create-Customer] Load Customers unique GST Success',
  LOAD_CUSTOMER_UNIQUE_GST_FAILURE = '[Create-Customer] Load Customers unique GST Failure',

  VERIFY_PAN_DETAILS = '[Create-Customer] Verify PAN details',
  VERIFY_PAN_DETAILS_SUCCESS = '[Create-Customer] Verify PAN details Success',
  VERIFY_PAN_DETAILS_FAILURE = '[Create-Customer] Verify PAN details Failure',

  UPDATE_PAN_FORM_DETAILS = '[Create-Customer] Update PAN FORM details',
  UPDATE_PAN_FORM_DETAILS_SUCCESS = '[Create-Customer] Update PAN FORM details Success',
  UPDATE_PAN_FORM_DETAILS_FAILURE = '[Create-Customer] Update PAN FORM details Failure',

  SEARCH_CUSTOMER = '[ Customer-Seach ] Search Customer',
  SEARCH_CUSTOMER_SUCCESS = '[ Customer-Seach ] Search Customer Success',
  SEARCH_CUSTOMER_FAILURE = '[ Customer-Seach ] Search Customer Failure',

  SEARCH_ONE_TIME_CUSTOMER = '[ One-Time-Customer-Seach ] Search One Time Customer',
  SEARCH_ONE_TIME_CUSTOMER_SUCCESS = '[ One-Time-Customer-Seach ] Search One Time Customer Success',
  SEARCH_ONE_TIME_CUSTOMER_FAILURE = '[ One-Time-Customer-Seach ] Search One Time Customer Failure',

  CLEAR_CUSTOMER_SEARCH = '[ Customer-Seach ] Clear Customer Search',
  CLEAR_SELECTED_CUSTOMER = '[ Customer-Seach ] Clear Selected Customer',
  CLEAR_VERIFICATION_STATUS = '[ Customer-Seach ] Clear Verification Status',
  CLEAR_PAN_VERIFICATION_STATUS = '[Create-Customer] Clear Pan Verification Status',
  CLEAR_GST_VERIFICATION_STATUS = '[Create-Customer] Clear Gst Verification Status',
  CLEAR_EMIAL_VALIDATION_STATUS = '[Create-Customer] Clear Email Validation Status',
  CLEAR_ALLOWED_TRANSACTIONS = '[ Customer-Search } Clear Allowed Transactions',

  SELECT_CUSTOMER = '[ Customer-Seach ] Select Customer',

  SELECT_INTERNATIONAL_CUSTOMER = '[ Customer-Seach ] Select International Customer',
  SELECT_INTERNATIONAL_CUSTOMER_SUCCESS = '[ Customer-Seach ] Select International Customer Success',
  SELECT_INTERNATIONAL_CUSTOMER_FAILURE = '[ Customer-Seach ] Select International Customer Failure',

  SELECT_ONETIME_CUSTOMER = '[ Customer-Seach ] Select One Time Customer',
  SELECT_ONETIME_CUSTOMER_SUCCESS = '[ Customer-Seach ] Select One Time Customer Success',
  SELECT_ONETIME_CUSTOMER_FAILURE = '[ Customer-Seach ] Select One Time Customer Failure',

  LOAD_ZONES = '[Create-Customer] Load Zones',
  LOAD_ZONES_SUCCESS = '[Create-Customer] Load Zones Success',
  LOAD_ZONES_FAILURE = '[Create-Customer] Load Zones Failure',

  SELECTED_CUSTOMER_DETAIL = '[Create-Customer] Load Selected Customer Detail',
  SELECTED_CUSTOMER_DETAIL_SUCCESS = '[Create-Customer] Load Selected Customer Detail Success',
  SELECTED_CUSTOMER_DETAIL_FAILURE = '[Create-Customer] Load Selected Customer Detail Failure',

  UPDATE_CUSTOMER = '[Create-Customer] Update Customer',
  UPDATE_CUSTOMER_SUCCESS = '[Create-Customer] Update Customer Success',
  UPDATE_CUSTOMER_FAILURE = '[Create-Customer] Update Customer Failure',

  LOAD_SELECTED_CUSTOMER = '[Create-Customer] Load Selected Customer ',
  LOAD_SELECTED_CUSTOMER_SUCCESS = '[Create-Customer] Load Selected Customer  Success',
  LOAD_SELECTED_CUSTOMER_FAILURE = '[Create-Customer] Load Selected Customer  Failure',

  LOAD_BRAND_DETAILS = '[Create-Customer] Load Brand Details',
  LOAD_BRAND_DETAILS_SUCCESS = '[Create-Customer]  Load Brand Details Success',
  LOAD_BRAND_DETAILS_FAILURE = '[Create-Customer]  Load Brand Details Failure',

  GET_GHS_CUSTOMER_DETAILS = '[ Customer-Get ] Get Customer',
  GET_GHS_CUSTOMER_DETAILS_SUCCESS = '[ Customer-Get ] Get Customer Success',
  GET_GHS_CUSTOMER_DETAILS_FAILURE = '[ Customer-Get ] Get Customer Failure',

  CLEAR_UPDATED_CUSTOMER = '[Create-Customer]  Clear Updated Customer',

  ENABLE_CUSTOMER_CREATE = '[Create-Customer] Enable Customer Create',
  DISABLE_CUSTOMER_CREATE = '[Create-Customer] Disable Customer Create',
  ENABLE_CUSTOMER_EDIT = '[Create-Customer] Enable Customer Edit',
  DISABLE_CUSTOMER_EDIT = '[Create-Customer] Disable Customer Edit',

  PAN_CARD_VERIFICATION_STATUS = '[Create-Customer] Pan Card Verification Status',
  PAN_CARD_VERIFICATION_STATUS_SUCCESS = '[Create-Customer] Pan Card Verification Status Success',
  PAN_CARD_VERIFICATION_STATUS_FAILURE = '[Create-Customer] Pan Card Verification Status Failure',

  GST_CARD_VERIFICATION_STATUS = '[Create-Customer] Gst Card Verification Status',
  GST_CARD_VERIFICATION_STATUS_SUCCESS = '[Create-Customer] Gst Card Verification Status Success',
  GST_CARD_VERIFICATION_STATUS_FAILURE = '[Create-Customer] Gst Card Verification Status Failure',

  EMAIL_VALIDATION_STATUS = '[Creat-customer] Email Validation Status',
  EMAIL_VALIDATION_STATUS_SUCCESS = '[Creat-customer] Email Validation Status Success',
  EMAIL_VALIDATION_STATUS_FAILURE = '[Creat-customer] Email Validation Status Failure',

  LOAD_RIVAAH_COUPON_DETAIL = '[Create-Customer] Load Rivaah coupon detail',
  LOAD_RIVAAH_COUPON_DETAIL_SUCCESS = '[Create-Customer] Load Rivaah coupon detail Success',
  LOAD_RIVAAH_COUPON_DETAIL_FAILURE = '[Create-Customer] Load Rivaah coupon detail Failure',
  CLEAR_RIVAAH_COUPON_DETAIL = '[Create-Customer] Clear Rivaah Coupon Detail'
}

export class EnableCustomerCreate implements Action {
  readonly type = CustomerActionTypes.ENABLE_CUSTOMER_CREATE;
}

export class DisableCustomerCreate implements Action {
  readonly type = CustomerActionTypes.DISABLE_CUSTOMER_CREATE;
}

export class EnableCustomerEdit implements Action {
  readonly type = CustomerActionTypes.ENABLE_CUSTOMER_EDIT;
}

export class DisableCustomerEdit implements Action {
  readonly type = CustomerActionTypes.DISABLE_CUSTOMER_EDIT;
}

export class LoadCountries implements Action {
  readonly type = CustomerActionTypes.LOAD_COUNTRIES;
}

export class LoadCountriesSuccess implements Action {
  readonly type = CustomerActionTypes.LOAD_COUNTRIES_SUCCESS;
  constructor(public payload: CountrySummary[]) {}
}

export class LoadCountriesFailure implements Action {
  readonly type = CustomerActionTypes.LOAD_COUNTRIES_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadAllowedTransactionTypes implements Action {
  readonly type = CustomerActionTypes.LOAD_ALLOWED_TRANSACTIONTYPES;
}

export class LoadAllowedTransactionTypesSuccess implements Action {
  readonly type = CustomerActionTypes.LOAD_ALLOWED_TRANSACTIONTYPES_SUCCESS;
  constructor(public payload: AllowedTransactionTypeMap) {}
}

export class LoadAllowedTransactionTypesFailure implements Action {
  readonly type = CustomerActionTypes.LOAD_ALLOWED_TRANSACTIONTYPES_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadStates implements Action {
  readonly type = CustomerActionTypes.LOAD_STATES;
  constructor(public payload: string) {}
}

export class LoadStatesSuccess implements Action {
  readonly type = CustomerActionTypes.LOAD_STATES_SUCCESS;
  constructor(public payload: CustomerStateSummary[]) {}
}

export class LoadStatesFailure implements Action {
  readonly type = CustomerActionTypes.LOAD_STATES_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadTowns implements Action {
  readonly type = CustomerActionTypes.LOAD_TOWNS;
  constructor(public payload: string) {}
}

export class LoadTownsSuccess implements Action {
  readonly type = CustomerActionTypes.LOAD_TOWNS_SUCCESS;
  constructor(public payload: TownSummary[]) {}
}

export class LoadTownsFailure implements Action {
  readonly type = CustomerActionTypes.LOAD_TOWNS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadCatchmentArea implements Action {
  readonly type = CustomerActionTypes.LOAD_CATCHMENT_AREA;
}

export class LoadCatchmentAreaSuccess implements Action {
  readonly type = CustomerActionTypes.LOAD_CATCHMENT_AREA_SUCCESS;
  constructor(public payload: []) {}
}

export class LoadCatchmentAreaFailure implements Action {
  readonly type = CustomerActionTypes.LOAD_CATCHMENT_AREA_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadCustomerUniqueMobile implements Action {
  readonly type = CustomerActionTypes.LOAD_CUSTOMER_UNIQUE_MOBILE;
  constructor(public payload: { searchType: string; value: string }) {}
}

export class LoadCustomerUniqueMobileSuccess implements Action {
  readonly type = CustomerActionTypes.LOAD_CUSTOMER_UNIQUE_MOBILE_SUCCESS;
  constructor(public payload: boolean) {}
}

export class LoadCustomerUniqueMobileFailure implements Action {
  readonly type = CustomerActionTypes.LOAD_CUSTOMER_UNIQUE_MOBILE_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadCustomerUniquePassport implements Action {
  readonly type = CustomerActionTypes.LOAD_CUSTOMER_UNIQUE_PASSPORT;
  constructor(public payload: { searchType: string; value: string }) {}
}

export class LoadCustomerUniquePassportSuccess implements Action {
  readonly type = CustomerActionTypes.LOAD_CUSTOMER_UNIQUE_PASSPORT_SUCCESS;
  constructor(public payload: boolean) {}
}

export class LoadCustomerUniquePassportFailure implements Action {
  readonly type = CustomerActionTypes.LOAD_CUSTOMER_UNIQUE_PASSPORT_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadCustomerUniqueEmail implements Action {
  readonly type = CustomerActionTypes.LOAD_CUSTOMER_UNIQUE_EMAIL;
  constructor(public payload: { searchType: string; value: string }) {}
}

export class LoadCustomerUniqueEmailSuccess implements Action {
  readonly type = CustomerActionTypes.LOAD_CUSTOMER_UNIQUE_EMAIL_SUCCESS;
  constructor(public payload: boolean) {}
}

export class LoadCustomerUniqueEmailFailure implements Action {
  readonly type = CustomerActionTypes.LOAD_CUSTOMER_UNIQUE_EMAIL_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadCustomerUniquePan implements Action {
  readonly type = CustomerActionTypes.LOAD_CUSTOMER_UNIQUE_PAN;
  constructor(public payload: { searchType: string; value: string }) {}
}

export class LoadCustomerUniquePanSuccess implements Action {
  readonly type = CustomerActionTypes.LOAD_CUSTOMER_UNIQUE_PAN_SUCCESS;
  constructor(public payload: boolean) {}
}

export class LoadCustomerUniquePanFailure implements Action {
  readonly type = CustomerActionTypes.LOAD_CUSTOMER_UNIQUE_PAN_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadCustomerUniqueGst implements Action {
  readonly type = CustomerActionTypes.LOAD_CUSTOMER_UNIQUE_GST;
  constructor(public payload: { searchType: string; value: string }) {}
}

export class LoadCustomerUniqueGstSuccess implements Action {
  readonly type = CustomerActionTypes.LOAD_CUSTOMER_UNIQUE_GST_SUCCESS;
  constructor(public payload: boolean) {}
}

export class LoadCustomerUniqueGstFailure implements Action {
  readonly type = CustomerActionTypes.LOAD_CUSTOMER_UNIQUE_GST_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class verifyPanDetails implements Action {
  readonly type = CustomerActionTypes.VERIFY_PAN_DETAILS;
  constructor(public payload: PanVerificationRequestPayload) {}
}

export class verifyPanDetailsSuccess implements Action {
  readonly type = CustomerActionTypes.VERIFY_PAN_DETAILS_SUCCESS;
  constructor(public payload: any) {}
}

export class verifyPanDetailsFailure implements Action {
  readonly type = CustomerActionTypes.VERIFY_PAN_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class updatePanFormDetails implements Action {
  readonly type = CustomerActionTypes.UPDATE_PAN_FORM_DETAILS;
  constructor(public payload: PanFormDetailsRequestPayload) {}
}

export class updatePanFormDetailsSuccess implements Action {
  readonly type = CustomerActionTypes.UPDATE_PAN_FORM_DETAILS_SUCCESS;
  constructor(public payload: any) {}
}

export class updatePanFormDetailsFailure implements Action {
  readonly type = CustomerActionTypes.UPDATE_PAN_FORM_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadPincode implements Action {
  readonly type = CustomerActionTypes.LOAD_PINCODE;
  constructor(public payload: { countryCode: string; pincode: string }) {}
}

export class LoadPincodeSuccess implements Action {
  readonly type = CustomerActionTypes.LOAD_PINCODE_SUCCESS;
  constructor(public payload: PincodeSummary) {}
}

export class LoadPincodeFailure implements Action {
  readonly type = CustomerActionTypes.LOAD_PINCODE_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadSalutations implements Action {
  readonly type = CustomerActionTypes.LOAD_SALUTATIONS;
  constructor(public payload: string) {}
}

export class LoadSalutationsSuccess implements Action {
  readonly type = CustomerActionTypes.LOAD_SALUTATIONS_SUCCESS;
  constructor(public payload: CustomerLov[]) {}
}

export class LoadSalutationsFailure implements Action {
  readonly type = CustomerActionTypes.LOAD_SALUTATIONS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadIdProofs implements Action {
  readonly type = CustomerActionTypes.LOAD_ID_PROOFS;
  constructor(public payload: string) {}
}

export class LoadIdProofsSuccess implements Action {
  readonly type = CustomerActionTypes.LOAD_ID_PROOFS_SUCCESS;
  constructor(public payload: CustomerLov[]) {}
}

export class LoadIdProofsFailure implements Action {
  readonly type = CustomerActionTypes.LOAD_ID_PROOFS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadCountryCode implements Action {
  readonly type = CustomerActionTypes.LOAD_COUNTRY_CODE;
}

export class LoadCountryCodeSuccess implements Action {
  readonly type = CustomerActionTypes.LOAD_COUNTRY_CODE_SUCCESS;
  constructor(public payload: string) {}
}

export class LoadCountryCodeFailure implements Action {
  readonly type = CustomerActionTypes.LOAD_COUNTRY_CODE_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SaveCustomerFormDetails implements Action {
  readonly type = CustomerActionTypes.SAVE_CUSTOMER_FORM_DETAILS;
  constructor(public payload: Customers) {}
}

export class SaveCustomerFormDetailsSuccess implements Action {
  readonly type = CustomerActionTypes.SAVE_CUSTOMER_FORM_DETAILS_SUCCESS;
  constructor(public payload: CustomerInfo) {}
}

export class SaveCustomerFormDetailsFailure implements Action {
  readonly type = CustomerActionTypes.SAVE_CUSTOMER_FORM_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class UpdateCustomer implements Action {
  readonly type = CustomerActionTypes.UPDATE_CUSTOMER;
  constructor(public payload: UpdateCustomerDetail) {}
}

export class UpdateCustomerSuccess implements Action {
  readonly type = CustomerActionTypes.UPDATE_CUSTOMER_SUCCESS;
  constructor(public payload: CustomerInfo) {}
}

export class UpdateCustomerFailure implements Action {
  readonly type = CustomerActionTypes.UPDATE_CUSTOMER_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class ResetError implements Action {
  readonly type = CustomerActionTypes.RESET_ERROR;
}

export class SearchCustomer implements Action {
  readonly type = CustomerActionTypes.SEARCH_CUSTOMER;
  constructor(
    public payload: { searchBy: SEARCH_BY_ENUM; searchValue: string }
  ) {}
}

export class SearchCustomerSuccess implements Action {
  readonly type = CustomerActionTypes.SEARCH_CUSTOMER_SUCCESS;
  constructor(public payload: CustomerInfo) {}
}

export class SearchCustomerFailure implements Action {
  readonly type = CustomerActionTypes.SEARCH_CUSTOMER_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class SearchOneTimeCustomer implements Action {
  readonly type = CustomerActionTypes.SEARCH_ONE_TIME_CUSTOMER;
  constructor(
    public payload: { searchBy: SEARCH_BY_ENUM; searchValue: string }
  ) {}
}

export class SearchOneTimeCustomerSuccess implements Action {
  readonly type = CustomerActionTypes.SEARCH_ONE_TIME_CUSTOMER_SUCCESS;
  constructor(public payload: CustomerInfo[]) {}
}

export class SearchOneTimeCustomerFailure implements Action {
  readonly type = CustomerActionTypes.SEARCH_ONE_TIME_CUSTOMER_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class ClearCustomerSearch implements Action {
  readonly type = CustomerActionTypes.CLEAR_CUSTOMER_SEARCH;
}
export class ClearSelectedCustomer implements Action {
  readonly type = CustomerActionTypes.CLEAR_SELECTED_CUSTOMER;
}

export class ClearVerificationStatus implements Action {
  readonly type = CustomerActionTypes.CLEAR_VERIFICATION_STATUS;
}

export class ClearPanVerificationStatus implements Action {
  readonly type = CustomerActionTypes.CLEAR_PAN_VERIFICATION_STATUS;
}

export class ClearGSTVerificationStatus implements Action {
  readonly type = CustomerActionTypes.CLEAR_GST_VERIFICATION_STATUS;
}

export class ClearEmailValidationStatus implements Action {
  readonly type = CustomerActionTypes.CLEAR_EMIAL_VALIDATION_STATUS;
}

export class ClearAllowedTransactions implements Action {
  readonly type = CustomerActionTypes.CLEAR_ALLOWED_TRANSACTIONS;
}

export class ClearUpdatedCustomer implements Action {
  readonly type = CustomerActionTypes.CLEAR_UPDATED_CUSTOMER;
}

export class ClearRivaahCouponDetail implements Action {
  readonly type = CustomerActionTypes.CLEAR_RIVAAH_COUPON_DETAIL;
}

export class SelectCustomer implements Action {
  readonly type = CustomerActionTypes.SELECT_CUSTOMER;
  constructor(public payload: CustomerInfo) {}
}

export class SelectInternationalCustomer implements Action {
  readonly type = CustomerActionTypes.SELECT_INTERNATIONAL_CUSTOMER;
  constructor(public payload: string) {}
}

export class SelectInternationalCustomerSuccess implements Action {
  readonly type = CustomerActionTypes.SELECT_INTERNATIONAL_CUSTOMER_SUCCESS;
  constructor(public payload: CustomerInfo) {}
}
export class SelectInternationalCustomerFailure implements Action {
  readonly type = CustomerActionTypes.SELECT_INTERNATIONAL_CUSTOMER_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SelectOneTimeCustomer implements Action {
  readonly type = CustomerActionTypes.SELECT_ONETIME_CUSTOMER;
  constructor(public payload: string) {}
}

export class SelectOneTimeCustomerSuccess implements Action {
  readonly type = CustomerActionTypes.SELECT_ONETIME_CUSTOMER_SUCCESS;
  constructor(public payload: CustomerInfo) {}
}
export class SelectOneTimeCustomerFailure implements Action {
  readonly type = CustomerActionTypes.SELECT_ONETIME_CUSTOMER_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadZones implements Action {
  readonly type = CustomerActionTypes.LOAD_ZONES;
}

export class LoadZonesSuccess implements Action {
  readonly type = CustomerActionTypes.LOAD_ZONES_SUCCESS;
  constructor(public payload: Zone[]) {}
}

export class LoadZonesFailure implements Action {
  readonly type = CustomerActionTypes.LOAD_ZONES_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SelectedCustomerDetail implements Action {
  readonly type = CustomerActionTypes.SELECTED_CUSTOMER_DETAIL;
  constructor(
    public payload: { customerId: string; isCalledFromCustomer?: boolean }
  ) {}
}

export class SelectedCustomerDetailSuccess implements Action {
  readonly type = CustomerActionTypes.SELECTED_CUSTOMER_DETAIL_SUCCESS;
  constructor(public payload: CreatedCustomerResponse) {}
}

export class SelectedCustomerDetailFailure implements Action {
  readonly type = CustomerActionTypes.SELECTED_CUSTOMER_DETAIL_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadSelectedCustomer implements Action {
  readonly type = CustomerActionTypes.LOAD_SELECTED_CUSTOMER;
  constructor(
    public payload: {
      customerId: string;
      enableClear: boolean;
      enableEdit: boolean;
      enableCreate: boolean;
      isCalledFromCustomer?: boolean;
    }
  ) {}
}

export class LoadSelectedCustomerSuccess implements Action {
  readonly type = CustomerActionTypes.LOAD_SELECTED_CUSTOMER_SUCCESS;
  constructor(
    public payload: {
      customerInfo: CustomerInfo;
      enableClear: boolean;
      enableEdit: boolean;
      enableCreate: boolean;
    }
  ) {}
}

export class LoadSelectedCustomerFailure implements Action {
  readonly type = CustomerActionTypes.LOAD_SELECTED_CUSTOMER_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadBrandDetails implements Action {
  readonly type = CustomerActionTypes.LOAD_BRAND_DETAILS;
  constructor(public payload: string) {}
}

export class LoadBrandDetailsSuccess implements Action {
  readonly type = CustomerActionTypes.LOAD_BRAND_DETAILS_SUCCESS;
  constructor(public payload: Brand) {}
}

export class LoadBrandDetailsFailure implements Action {
  readonly type = CustomerActionTypes.LOAD_BRAND_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class GetGhsCustomerDetails implements Action {
  readonly type = CustomerActionTypes.GET_GHS_CUSTOMER_DETAILS;
  constructor(
    public payload: { searchBy: SEARCH_BY_ENUM; searchValue: string }
  ) {}
}

export class GetCustomerDetailsSuccess implements Action {
  readonly type = CustomerActionTypes.GET_GHS_CUSTOMER_DETAILS_SUCCESS;
  constructor(public payload: CustomerInfo) {}
}

export class GetCustomerDetailsFailure implements Action {
  readonly type = CustomerActionTypes.GET_GHS_CUSTOMER_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class PanCardVerificationStatus implements Action {
  readonly type = CustomerActionTypes.PAN_CARD_VERIFICATION_STATUS;
  constructor(public payload: PanVerificationRequestPayload) {}
}

export class PanCardVerificationStatusSuccess implements Action {
  readonly type = CustomerActionTypes.PAN_CARD_VERIFICATION_STATUS_SUCCESS;
  constructor(public payload: ValidatePanResponse) {}
}

export class PanCardVerificationStatusFailure implements Action {
  readonly type = CustomerActionTypes.PAN_CARD_VERIFICATION_STATUS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class GstCardVerificationStatus implements Action {
  readonly type = CustomerActionTypes.GST_CARD_VERIFICATION_STATUS;
  constructor(public payload: GstVerificationRequestPayload) {}
}

export class GstCardVerificationStatusSuccess implements Action {
  readonly type = CustomerActionTypes.GST_CARD_VERIFICATION_STATUS_SUCCESS;
  constructor(public payload: ValidateGstResponse) {}
}

export class GstCardVerificationStatusFailure implements Action {
  readonly type = CustomerActionTypes.GST_CARD_VERIFICATION_STATUS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class EmailValidationStatus implements Action {
  readonly type = CustomerActionTypes.EMAIL_VALIDATION_STATUS;
  constructor(public payload: string) {}
}

export class EmailValidationStatusSuccess implements Action {
  readonly type = CustomerActionTypes.EMAIL_VALIDATION_STATUS_SUCCESS;
  constructor(public payload: ValidateEmailResponse) {}
}

export class EmailValidationStatusFailure implements Action {
  readonly type = CustomerActionTypes.EMAIL_VALIDATION_STATUS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadRivaahCouponDetail implements Action {
  readonly type = CustomerActionTypes.LOAD_RIVAAH_COUPON_DETAIL;
  constructor(public customerId: string, public sendCoupon: boolean) {}
}

export class LoadRivaahCouponDetailSucess implements Action {
  readonly type = CustomerActionTypes.LOAD_RIVAAH_COUPON_DETAIL_SUCCESS;
  constructor(public payload: RivaahCouponDetail) {}
}

export class LoadRivaahCouponDetailFailure implements Action {
  readonly type = CustomerActionTypes.LOAD_RIVAAH_COUPON_DETAIL_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export type CustomerActions =
  | LoadAllowedTransactionTypes
  | LoadAllowedTransactionTypesSuccess
  | LoadAllowedTransactionTypesFailure
  | LoadCountries
  | LoadCountriesSuccess
  | LoadCountriesFailure
  | LoadStates
  | LoadStatesSuccess
  | LoadStatesFailure
  | LoadTowns
  | LoadTownsSuccess
  | LoadTownsFailure
  | LoadPincode
  | LoadPincodeSuccess
  | LoadPincodeFailure
  | LoadSalutations
  | LoadSalutationsSuccess
  | LoadSalutationsFailure
  | ResetError
  | SaveCustomerFormDetails
  | SaveCustomerFormDetailsSuccess
  | SaveCustomerFormDetailsFailure
  | SearchCustomer
  | SearchCustomerSuccess
  | SearchCustomerFailure
  | SearchOneTimeCustomer
  | SearchOneTimeCustomerSuccess
  | SearchOneTimeCustomerFailure
  | ClearCustomerSearch
  | ClearSelectedCustomer
  | SelectCustomer
  | SelectInternationalCustomer
  | SelectInternationalCustomerSuccess
  | SelectInternationalCustomerFailure
  | SelectOneTimeCustomer
  | SelectOneTimeCustomerSuccess
  | SelectOneTimeCustomerFailure
  | LoadZones
  | LoadZonesSuccess
  | LoadZonesFailure
  | SelectedCustomerDetail
  | SelectedCustomerDetailSuccess
  | SelectedCustomerDetailFailure
  | UpdateCustomer
  | UpdateCustomerSuccess
  | UpdateCustomerFailure
  | LoadCustomerUniqueMobile
  | LoadCustomerUniqueMobileSuccess
  | LoadCustomerUniqueMobileFailure
  | LoadCustomerUniqueEmail
  | LoadCustomerUniqueEmailSuccess
  | LoadCustomerUniqueEmailFailure
  | LoadCustomerUniquePan
  | LoadCustomerUniquePanSuccess
  | LoadCustomerUniquePanFailure
  | LoadCustomerUniqueGst
  | LoadCustomerUniqueGstSuccess
  | LoadCustomerUniqueGstFailure
  | LoadCountryCode
  | LoadCountryCodeSuccess
  | LoadCountryCodeFailure
  | LoadSelectedCustomer
  | LoadSelectedCustomerSuccess
  | LoadSelectedCustomerFailure
  | LoadCustomerUniquePassport
  | LoadCustomerUniquePassportSuccess
  | LoadCustomerUniquePassportFailure
  | LoadIdProofs
  | LoadIdProofsSuccess
  | LoadIdProofsFailure
  | LoadBrandDetails
  | LoadBrandDetailsSuccess
  | LoadBrandDetailsFailure
  | GetGhsCustomerDetails
  | GetCustomerDetailsSuccess
  | GetCustomerDetailsFailure
  | ClearUpdatedCustomer
  | EnableCustomerCreate
  | DisableCustomerCreate
  | PanCardVerificationStatus
  | PanCardVerificationStatusSuccess
  | PanCardVerificationStatusFailure
  | GstCardVerificationStatus
  | GstCardVerificationStatusSuccess
  | GstCardVerificationStatusFailure
  | ClearVerificationStatus
  | LoadCatchmentArea
  | LoadCatchmentAreaSuccess
  | LoadCatchmentAreaFailure
  | ClearAllowedTransactions
  | ClearPanVerificationStatus
  | ClearGSTVerificationStatus
  | LoadRivaahCouponDetail
  | LoadRivaahCouponDetailSucess
  | LoadRivaahCouponDetailFailure
  | verifyPanDetails
  | verifyPanDetailsSuccess
  | verifyPanDetailsFailure
  | updatePanFormDetails
  | updatePanFormDetailsSuccess
  | updatePanFormDetailsFailure
  | ClearRivaahCouponDetail
  | EmailValidationStatus
  | EmailValidationStatusSuccess
  | EmailValidationStatusFailure
  | ClearEmailValidationStatus;
