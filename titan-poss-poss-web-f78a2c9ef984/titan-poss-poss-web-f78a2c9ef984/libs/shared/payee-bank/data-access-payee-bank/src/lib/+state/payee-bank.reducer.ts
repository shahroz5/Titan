import { PayeeBankState } from './payee-bank.state';
import { PayeeBankActions, PayeeBankActionTypes } from './payee-bank.action';
import { createFeatureSelector } from '@ngrx/store';
import { payeeGlDetailsAdapter } from './payee-bank.entity';

export const initialState: PayeeBankState = {
  payeeBankListing: null,
  payeeBankDetails: null,
  totalPayeeBankDetails: 0,
  isLoading: false,
  saveBankDetailsSuccess: false,
  editBankDetailsSuccess: false,
  error: null,
  savePayeeBankResponses: null,
  editPayeeBankResponses: null,
  glCodeDetail: payeeGlDetailsAdapter.getInitialState(),
  saveGlCodeDetail: null,
  saveGlCodeDetailSuccess: false,
  mappingType: null,
  locationCodes: null,
  glCodeDefaults: [],
  totalCount: 0,
  mappedLocations: null,
  statesData: [],
  townsData: []
};

export const PAYEE_BANK_FEATURE_KEY = 'payeeBank';
export const selectPayeeBankState = createFeatureSelector<PayeeBankState>(
  PAYEE_BANK_FEATURE_KEY
);

export function PayeeBankReducer(
  state: PayeeBankState = initialState,
  action: PayeeBankActions
): PayeeBankState {
  switch (action.type) {
    case PayeeBankActionTypes.LOAD_PAYEE_BANK_LISTING:
    case PayeeBankActionTypes.LOAD_PAYEE_BANK_DETAILS_BY_PAYEE_BANKNAME:
    case PayeeBankActionTypes.SEARCH_PAYEE_BANK_DETAILS:
    case PayeeBankActionTypes.GET_LOCATIONS:
    case PayeeBankActionTypes.GET_MAPPED_LOCATIONS:
    case PayeeBankActionTypes.LOAD_STATES:
    case PayeeBankActionTypes.LOAD_TOWNS:
      return {
        ...state,
        isLoading: true,
        saveBankDetailsSuccess: false,
        editBankDetailsSuccess: false,
        saveGlCodeDetailSuccess: false,
        error: null
      };
    case PayeeBankActionTypes.LOAD_PAYEE_BANK_GL_CODE_DETAILS:
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case PayeeBankActionTypes.SAVE_PAYEE_BANK_FORM_DETAILS:
      return {
        ...state,
        isLoading: true,
        saveBankDetailsSuccess: false,
        error: null
      };
    case PayeeBankActionTypes.EDIT_PAYEE_BANK_FORM_DETAILS:
      return {
        ...state,
        isLoading: true,
        editBankDetailsSuccess: false,
        error: null
      };
    case PayeeBankActionTypes.LOAD_PAYEE_BANK_LISTING_SUCCESS:
      return {
        ...state,
        payeeBankListing: action.payload.payeeBankListing,
        totalPayeeBankDetails: action.payload.totalElements,
        isLoading: false,
        saveBankDetailsSuccess: false,
        editBankDetailsSuccess: false,
        saveGlCodeDetailSuccess: false,
        error: null
      };

    case PayeeBankActionTypes.LOAD_TOWNS_SUCCESS:
      return {
        ...state,
        townsData: action.payload,
        isLoading: false
      };

    case PayeeBankActionTypes.LOAD_STATES_SUCCESS:
      console.log(action.payload, 'reducer');

      return {
        ...state,
        statesData: action.payload,
        isLoading: false,
        error: null
      };
    case PayeeBankActionTypes.LOAD_PAYEE_BANK_LISTING_FAILURE:
    case PayeeBankActionTypes.LOAD_PAYEE_BANK_DETAILS_BY_PAYEE_BANKNAME_FAILURE:
    case PayeeBankActionTypes.EDIT_PAYEE_BANK_FORM_DETAILS_FAILURE:
    case PayeeBankActionTypes.SAVE_PAYEE_BANK_FORM_DETAILS_FAILURE:
    case PayeeBankActionTypes.LOAD_PAYEE_BANK_GL_CODE_DETAILS_FAILURE:
    case PayeeBankActionTypes.SAVE_PAYEE_BANK_GL_CODE_DETAILS_FAILURE:
    case PayeeBankActionTypes.GET_LOCATIONS_FAILURE:
    case PayeeBankActionTypes.CHECK_GL_CODE_DEFAULTS_FAILURE:
    case PayeeBankActionTypes.LOAD_TOWNS_FAILURE:
    case PayeeBankActionTypes.LOAD_STATES_FAILURE:
      // case PayeeBankActionTypes.GET_MAPPED_LOCATIONS_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
        saveBankDetailsSuccess: false,
        editBankDetailsSuccess: false,
        saveGlCodeDetailSuccess: false
      };

    case PayeeBankActionTypes.LOAD_PAYEE_BANK_DETAILS_BY_PAYEE_BANKNAME_SUCCESS:
      return {
        ...state,
        payeeBankDetails: action.payload,
        isLoading: false,
        saveBankDetailsSuccess: false,
        editBankDetailsSuccess: false,
        saveGlCodeDetailSuccess: false,
        error: null
      };

    case PayeeBankActionTypes.SAVE_PAYEE_BANK_FORM_DETAILS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        savePayeeBankResponses: action.payload,
        saveBankDetailsSuccess: true,
        // payeeBankListing: [...state.payeeBankListing, action.payload],
        error: null
      };

    case PayeeBankActionTypes.EDIT_PAYEE_BANK_FORM_DETAILS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        editPayeeBankResponses: action.payload,
        editBankDetailsSuccess: true,
        error: null
      };

    case PayeeBankActionTypes.SEARCH_PAYEE_BANK_DETAILS_SUCCESS:
      return {
        ...state,
        payeeBankListing: action.payload,
        isLoading: false,
        totalPayeeBankDetails: 0,
        error: null
      };

    case PayeeBankActionTypes.SEARCH_PAYEE_BANK_DETAILS_FAILURE:
      return {
        ...state,
        error: action.payload,
        payeeBankListing: null,
        isLoading: false,
        totalPayeeBankDetails: 0
      };

    case PayeeBankActionTypes.LOAD_PAYEE_BANK_GL_CODE_DETAILS_SUCCESS:
      return {
        ...state,
        glCodeDetail: payeeGlDetailsAdapter.setAll(
          action.payload.locationList,
          state.glCodeDetail
        ),
        totalCount: action.payload.count,
        saveGlCodeDetailSuccess: false,
        isLoading: false,
        error: null
      };
    case PayeeBankActionTypes.UPDATE_GL_CODE_DETAILS:
      console.log(action.payload, 'red action payload');

      return {
        ...state,
        glCodeDetail: payeeGlDetailsAdapter.updateOne(
          {
            id: action.payload.id,
            changes: {
              glCode: action.payload.glCode,
              isDefault: action.payload.isDefault
            }
          },
          state.glCodeDetail
        ),
        saveGlCodeDetailSuccess: false,
        isLoading: false,
        error: null
      };
    // case PayeeBankActionTypes.ADD_GL_CODE_DETAILS:
    //   return {
    //     ...state,
    //     glCodeDetail: payeeGlDetailsAdapter.addMany(
    //       action.payload,
    //       state.glCodeDetail
    //     ),
    //     saveGlCodeDetailSuccess: false,
    //     isLoading: false,
    //     error: null
    //   };
    case PayeeBankActionTypes.DELETE_GL_CODE_DETAILS:
      return {
        ...state,
        glCodeDetail: payeeGlDetailsAdapter.removeOne(
          action.payload,
          state.glCodeDetail
        ),
        saveGlCodeDetailSuccess: false,
        isLoading: false,
        error: null
      };
    case PayeeBankActionTypes.GET_MAPPED_LOCATIONS_SUCCESS:
      return {
        ...state,
        mappedLocations: action.payload,
        saveGlCodeDetailSuccess: false,
        isLoading: false,
        error: null
      };
    case PayeeBankActionTypes.SAVE_PAYEE_BANK_GL_CODE_DETAILS_SUCCESS:
      return {
        ...state,
        saveGlCodeDetail: action.payload,
        saveGlCodeDetailSuccess: true,
        isLoading: false,
        error: null
      };
    case PayeeBankActionTypes.GET_LOCATIONS_SUCCESS:
      return {
        ...state,
        locationCodes: action.payload,
        isLoading: false,
        error: null
      };
    // case PayeeBankActionTypes.CHECK_GL_CODE_DEFAULTS:
    //   return {
    //     ...state,
    //     glCodeDefaults: action.payload
    //   };
    case PayeeBankActionTypes.CHECK_GL_CODE_DEFAULTS_SUCCESS:
      return {
        ...state,
        glCodeDefaults: action.payload,
        isLoading: false,
        error: null
      };
    case PayeeBankActionTypes.RESET_GL_CODE_DETAILS:
      return {
        ...state,
        glCodeDetail: payeeGlDetailsAdapter.getInitialState(),
        isLoading: false,
        glCodeDefaults: [],
        saveGlCodeDetailSuccess: false,
        error: null
      };
    case PayeeBankActionTypes.RESET_BANK_DETAILS:
      return {
        ...state,
        isLoading: false,
        payeeBankDetails: null,
        error: null
      };

    default:
      return state;
  }
}
