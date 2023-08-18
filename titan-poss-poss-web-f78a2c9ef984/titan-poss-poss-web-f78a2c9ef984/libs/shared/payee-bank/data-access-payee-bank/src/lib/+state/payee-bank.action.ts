import { Action } from '@ngrx/store';
import {
  LoadPayeeBankListingPayload,
  CustomErrors,
  LoadPayeeBankListingSuccessPayload,
  PayeeBankDetails,
  SavePayeeBankFormPayload,
  PayeeBankGLCodePayload,
  PayeeBankGLCodeDetails,
  SaveGLcodeDetails,
  GlCodeDefaultsPayload,
  PayeeGLCodeDetailsSuccessList,
  GlSelectMappedLocations,
  LocationCodeDetails,
  StateSummary,
  TownSummary
} from '@poss-web/shared/models';

export enum PayeeBankActionTypes {
  LOAD_PAYEE_BANK_LISTING = '[Load-PayeeBank-Details] Load PayeeBank Listing',
  LOAD_PAYEE_BANK_LISTING_SUCCESS = '[Load-PayeeBank-Details] Load PayeeBank Listing Success',
  LOAD_PAYEE_BANK_LISTING_FAILURE = '[Load-PayeeBank-Details] Load PayeeBank Listing Failure',

  LOAD_PAYEE_BANK_DETAILS_BY_PAYEE_BANKNAME = '[Load-BankName-Details] Load BankName Details By BankName Code',
  LOAD_PAYEE_BANK_DETAILS_BY_PAYEE_BANKNAME_SUCCESS = '[Load-BankName-Details] Load BankName Details By BankName Code Success',
  LOAD_PAYEE_BANK_DETAILS_BY_PAYEE_BANKNAME_FAILURE = '[Load-BankName-Details] Load BankName Details By BankName Code Failure',

  SAVE_PAYEE_BANK_FORM_DETAILS = '[ Save-PayeeBank-Details ] SaveForm Details',
  SAVE_PAYEE_BANK_FORM_DETAILS_SUCCESS = '[ Save-PayeeBank-Details ] SaveForm Details Success',
  SAVE_PAYEE_BANK_FORM_DETAILS_FAILURE = '[ Save-PayeeBank-Details ] SaveForm Details Failure',

  EDIT_PAYEE_BANK_FORM_DETAILS = '[ Edit-PayeeBank-Details ] EditForm Details',
  EDIT_PAYEE_BANK_FORM_DETAILS_SUCCESS = '[ Edit-PayeeBank-Details ] EditForm Details Success',
  EDIT_PAYEE_BANK_FORM_DETAILS_FAILURE = '[ Edit-PayeeBank-Details ] EditForm Details Failure',

  SEARCH_PAYEE_BANK_DETAILS = '[Load-PayeeBank-Details] Search PayeeBank-Details',
  SEARCH_PAYEE_BANK_DETAILS_SUCCESS = '[Load-PayeeBank-Details] Search PayeeBank-Details Success',
  SEARCH_PAYEE_BANK_DETAILS_FAILURE = '[Load-PayeeBank-Details] Search PayeeBank-Details Failure',

  LOAD_PAYEE_BANK_GL_CODE_DETAILS = '[Load-PayeeBank-Locations] Load PayeeBank GL Code Details',
  LOAD_PAYEE_BANK_GL_CODE_DETAILS_SUCCESS = '[Load-PayeeBank-Locations] Load PayeeBank GL Code Details Success',
  LOAD_PAYEE_BANK_GL_CODE_DETAILS_FAILURE = '[Load-PayeeBank-Locations] Load PayeeBank GL Code Details Failure',

  SAVE_PAYEE_BANK_GL_CODE_DETAILS = '[Save-PayeeBank-Locations] Save PayeeBank GL Code Details',
  SAVE_PAYEE_BANK_GL_CODE_DETAILS_SUCCESS = '[Save-PayeeBank-Locations] Save PayeeBank GL Code Details Success',
  SAVE_PAYEE_BANK_GL_CODE_DETAILS_FAILURE = '[Save-PayeeBank-Locations] Save PayeeBank GL Code Details Failure',

  GET_LOCATIONS = '[Payee-Bank] Get Locations',
  GET_LOCATIONS_SUCCESS = '[Payee-Bank] Get Locations Success',
  GET_LOCATIONS_FAILURE = '[Payee-Bank] Get Locations Failure',

  RESET_BANK_DETAILS = '[Reset-Payee-Bank] Reset Payee Bank Details',
  RESET_GL_CODE_DETAILS = '[Reset-Payee-Bank] Reset Payee Bank GL Code Details',

  CHECK_GL_CODE_DEFAULTS = '[Payee-Bank-Configuration] Check Gl Code Defaults',
  CHECK_GL_CODE_DEFAULTS_SUCCESS = '[Payee-Bank-Configuration] Check Gl Code Defaults Success',
  CHECK_GL_CODE_DEFAULTS_FAILURE = '[Payee-Bank-Configuration] Check Gl Code Defaults Failure',

  GET_MAPPED_LOCATIONS = '[Payee-Bank-Configuration] Get Mapped Locations',
  GET_MAPPED_LOCATIONS_SUCCESS = '[Payee-Bank-Configuration] Get Mapped Locations Success',
  GET_MAPPED_LOCATIONS_FAILURE = '[Payee-Bank-Configuration] Get Mapped Locations Failure',

  ADD_GL_CODE_DETAILS = '[Payee-Bank-Configuration] Add GL Code Details',
  UPDATE_GL_CODE_DETAILS = '[Payee-Bank-Configuration] Update GL Code Details',
  DELETE_GL_CODE_DETAILS = '[Payee-Bank-Configuration] Delete GL Code Details',

  LOAD_STATES = '[Payee-Bank] Load States',
  LOAD_STATES_SUCCESS = '[Payee-Bank] Load States Success',
  LOAD_STATES_FAILURE = '[Payee-Bank] Load States Failure',

  LOAD_TOWNS = '[Payee-Bank] Load towns',
  LOAD_TOWNS_SUCCESS = '[Payee-Bank] Load Towns Success',
  LOAD_TOWNS_FAILURE = '[Payee-Bank] Load Towns Failure'
}

export class LoadPayeeBankDetails implements Action {
  readonly type = PayeeBankActionTypes.LOAD_PAYEE_BANK_LISTING;
  constructor(public payload: LoadPayeeBankListingPayload) {}
}
export class LoadPayeeBankDetailsSuccess implements Action {
  readonly type = PayeeBankActionTypes.LOAD_PAYEE_BANK_LISTING_SUCCESS;
  constructor(public payload: LoadPayeeBankListingSuccessPayload) {}
}
export class LoadPayeeBankDetailsFailure implements Action {
  readonly type = PayeeBankActionTypes.LOAD_PAYEE_BANK_LISTING_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadPayeeBankByPayeeBankName implements Action {
  readonly type =
    PayeeBankActionTypes.LOAD_PAYEE_BANK_DETAILS_BY_PAYEE_BANKNAME;
  constructor(public payload: string) {}
}
export class LoadPayeeBankByPayeeBankNameSuccess implements Action {
  readonly type =
    PayeeBankActionTypes.LOAD_PAYEE_BANK_DETAILS_BY_PAYEE_BANKNAME_SUCCESS;
  constructor(public payload: PayeeBankDetails) {}
}
export class LoadPayeeBankByPayeeBankNameFailure implements Action {
  readonly type =
    PayeeBankActionTypes.LOAD_PAYEE_BANK_DETAILS_BY_PAYEE_BANKNAME_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SavePayeeBankFormDetails implements Action {
  readonly type = PayeeBankActionTypes.SAVE_PAYEE_BANK_FORM_DETAILS;
  constructor(public payload: SavePayeeBankFormPayload) {}
}

export class SavePayeeBankFormDetailsSuccess implements Action {
  readonly type = PayeeBankActionTypes.SAVE_PAYEE_BANK_FORM_DETAILS_SUCCESS;
  constructor(public payload: PayeeBankDetails) {}
}

export class SavePayeeBankFormDetailsFailure implements Action {
  readonly type = PayeeBankActionTypes.SAVE_PAYEE_BANK_FORM_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class EditPayeeBankFormDetails implements Action {
  readonly type = PayeeBankActionTypes.EDIT_PAYEE_BANK_FORM_DETAILS;
  constructor(public payload: SavePayeeBankFormPayload) {}
}

export class EditPayeeBankFormDetailsSuccess implements Action {
  readonly type = PayeeBankActionTypes.EDIT_PAYEE_BANK_FORM_DETAILS_SUCCESS;
  constructor(public payload: PayeeBankDetails) {}
}
export class EditPayeeBankFormDetailsFailure implements Action {
  readonly type = PayeeBankActionTypes.EDIT_PAYEE_BANK_FORM_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SearchPayeebankName implements Action {
  readonly type = PayeeBankActionTypes.SEARCH_PAYEE_BANK_DETAILS;
  constructor(public payload: string) {}
}
export class SearchPayeebankNameSuccess implements Action {
  readonly type = PayeeBankActionTypes.SEARCH_PAYEE_BANK_DETAILS_SUCCESS;
  constructor(public payload: PayeeBankDetails[]) {}
}
export class SearchPayeebankNameFailure implements Action {
  readonly type = PayeeBankActionTypes.SEARCH_PAYEE_BANK_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadPayeeBankGlCodeDetails implements Action {
  readonly type = PayeeBankActionTypes.LOAD_PAYEE_BANK_GL_CODE_DETAILS;
  constructor(public payload: PayeeBankGLCodePayload) {}
}

export class LoadPayeeBankGlCodeDetailsSuccess implements Action {
  readonly type = PayeeBankActionTypes.LOAD_PAYEE_BANK_GL_CODE_DETAILS_SUCCESS;
  constructor(public payload: PayeeGLCodeDetailsSuccessList) {}
}

export class LoadPayeeBankGlCodeDetailsFailure implements Action {
  readonly type = PayeeBankActionTypes.LOAD_PAYEE_BANK_GL_CODE_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SavePayeeBankGlCodeDetails implements Action {
  readonly type = PayeeBankActionTypes.SAVE_PAYEE_BANK_GL_CODE_DETAILS;
  constructor(public payload: SaveGLcodeDetails) {}
}

export class SavePayeeBankGlCodeDetailsSuccess implements Action {
  readonly type = PayeeBankActionTypes.SAVE_PAYEE_BANK_GL_CODE_DETAILS_SUCCESS;
  constructor(public payload: PayeeBankGLCodeDetails) {}
}

export class SavePayeeBankGlCodeDetailsFailure implements Action {
  readonly type = PayeeBankActionTypes.SAVE_PAYEE_BANK_GL_CODE_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class ResetGlCodeDetails implements Action {
  readonly type = PayeeBankActionTypes.RESET_GL_CODE_DETAILS;
}
export class ResetBankDetails implements Action {
  readonly type = PayeeBankActionTypes.RESET_BANK_DETAILS;
}

export class GetLocationCodes implements Action {
  readonly type = PayeeBankActionTypes.GET_LOCATIONS;

}

export class GetLocationCodesSuccess implements Action {
  readonly type = PayeeBankActionTypes.GET_LOCATIONS_SUCCESS;
  constructor(public payload: LocationCodeDetails[]) {}
}

export class GetLocationCodesFailure implements Action {
  readonly type = PayeeBankActionTypes.GET_LOCATIONS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class GetGlCodeIsDefaults implements Action {
  readonly type = PayeeBankActionTypes.CHECK_GL_CODE_DEFAULTS;
  constructor(public payload: GlCodeDefaultsPayload) {}
}

export class GetGlCodeIsDefaultsSuccess implements Action {
  readonly type = PayeeBankActionTypes.CHECK_GL_CODE_DEFAULTS_SUCCESS;
  constructor(public payload: PayeeBankGLCodeDetails[]) {}
}

export class GetGlCodeIsDefaultsFailure implements Action {
  readonly type = PayeeBankActionTypes.CHECK_GL_CODE_DEFAULTS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadMappedLocations implements Action {
  readonly type = PayeeBankActionTypes.GET_MAPPED_LOCATIONS;
  constructor(public payload: PayeeBankGLCodePayload) {}
}

export class LoadMappedLocationsSuccess implements Action {
  readonly type = PayeeBankActionTypes.GET_MAPPED_LOCATIONS_SUCCESS;
  constructor(public payload: GlSelectMappedLocations[]) {}
}

export class LoadMappedLocationsFailure implements Action {
  readonly type = PayeeBankActionTypes.GET_MAPPED_LOCATIONS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

// export class AddGlCodeDetails implements Action {
//   readonly type = PayeeBankActionTypes.ADD_GL_CODE_DETAILS;
//   constructor(public payload: PayeeBankGLCodeDetails[]) {}
// }
export class UpdateGlCodeDetails implements Action {
  readonly type = PayeeBankActionTypes.UPDATE_GL_CODE_DETAILS;
  constructor(
    public payload: { id: string; glCode: number; isDefault: boolean }
  ) {}
}
export class DeleteGlCodeDetails implements Action {
  readonly type = PayeeBankActionTypes.DELETE_GL_CODE_DETAILS;
  constructor(public payload: string) {}
}

export class LoadTowns implements Action {
  readonly type = PayeeBankActionTypes.LOAD_TOWNS;
  constructor(public payload: string) {}
}

export class LoadTownsSuccess implements Action {
  readonly type = PayeeBankActionTypes.LOAD_TOWNS_SUCCESS;
  constructor(public payload: TownSummary[]) {}
}

export class LoadTownsFailure implements Action {
  readonly type = PayeeBankActionTypes.LOAD_TOWNS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadStates implements Action {
  readonly type = PayeeBankActionTypes.LOAD_STATES;
  constructor(public payload: string) {}
}

export class LoadStatesSuccess implements Action {
  readonly type = PayeeBankActionTypes.LOAD_STATES_SUCCESS;
  constructor(public payload: StateSummary[]) {}
}
export class LoadStatesFailure implements Action {
  readonly type = PayeeBankActionTypes.LOAD_STATES_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export type PayeeBankActions =
  | LoadPayeeBankDetails
  | LoadPayeeBankDetailsSuccess
  | LoadPayeeBankDetailsFailure
  | LoadPayeeBankByPayeeBankName
  | LoadPayeeBankByPayeeBankNameSuccess
  | LoadPayeeBankByPayeeBankNameFailure
  | SavePayeeBankFormDetails
  | SavePayeeBankFormDetailsFailure
  | EditPayeeBankFormDetails
  | EditPayeeBankFormDetailsSuccess
  | EditPayeeBankFormDetailsFailure
  | SavePayeeBankFormDetailsSuccess
  | SearchPayeebankName
  | SearchPayeebankNameSuccess
  | SearchPayeebankNameFailure
  | LoadPayeeBankGlCodeDetails
  | LoadPayeeBankGlCodeDetailsSuccess
  | LoadPayeeBankGlCodeDetailsFailure
  | SavePayeeBankGlCodeDetails
  | SavePayeeBankGlCodeDetailsSuccess
  | SavePayeeBankGlCodeDetailsFailure
  | ResetGlCodeDetails
  | ResetBankDetails
  | GetLocationCodes
  | GetLocationCodesSuccess
  | GetLocationCodesFailure
  | GetGlCodeIsDefaults
  | GetGlCodeIsDefaultsSuccess
  | GetGlCodeIsDefaultsFailure
  | LoadMappedLocations
  | LoadMappedLocationsSuccess
  | LoadMappedLocationsFailure
  // | AddGlCodeDetails
  | LoadTowns
  | LoadTownsSuccess
  | LoadTownsFailure
  | LoadStates
  | LoadStatesSuccess
  | LoadStatesFailure
  | UpdateGlCodeDetails
  | DeleteGlCodeDetails;
