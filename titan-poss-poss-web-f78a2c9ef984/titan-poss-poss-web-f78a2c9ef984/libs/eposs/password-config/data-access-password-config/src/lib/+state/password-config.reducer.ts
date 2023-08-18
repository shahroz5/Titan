import { PasswordConfigState } from './password-config.state';
import {
  PasswordConfigActions,
  PasswordConfigActionTypes
} from './password-config.actions';

export const passwordConfigFeatureKey = getFeatureKey();

function getFeatureKey() {
  return 'passwordConfig';
}

export const initialState: PasswordConfigState = {
  hasError: null,
  isLoading: false,
  locationCodes: [],
  documentTypes: [],
  materialPrices: [],
  generateBoutiquePasswordResponseForManualBill: null,
  generateBoutiquePasswordResponseForGoldRate: null,
  generateCashDepostPasswordResponse: null
};

export function passwordConfigReducer(
  state: PasswordConfigState = initialState,
  action: PasswordConfigActions
): PasswordConfigState {
  switch (action.type) {
    case PasswordConfigActionTypes.GET_LOCATION_CODES:
    case PasswordConfigActionTypes.GET_DOCUMENT_TYPES:
    case PasswordConfigActionTypes.GET_MATERIAL_PRICES:
    case PasswordConfigActionTypes.GENERATE_BOUTIQUE_PASSWORD_FOR_MANUAL_BILL:
    case PasswordConfigActionTypes.GENERATE_BOUTIQUE_PASSWORD_FOR_GOLD_RATE:
    case PasswordConfigActionTypes.GENERATE_CASH_DEPOSIT_PASSWORD:
      return { ...state, isLoading: true, hasError: null };

    case PasswordConfigActionTypes.GET_LOCATION_CODES_FAILURE:
    case PasswordConfigActionTypes.GET_DOCUMENT_TYPES_FAILURE:
    case PasswordConfigActionTypes.GET_MATERIAL_PRICES_FAILURE:
    case PasswordConfigActionTypes.GENERATE_BOUTIQUE_PASSWORD_FOR_MANUAL_BILL_FAILURE:
    case PasswordConfigActionTypes.GENERATE_BOUTIQUE_PASSWORD_FOR_GOLD_RATE_FAILURE:
    case PasswordConfigActionTypes.GENERATE_CASH_DEPOSIT_PASSWORD_FAILURE:
      return {
        ...state,
        hasError: action.payload,
        isLoading: false
      };

    case PasswordConfigActionTypes.GET_LOCATION_CODES_SUCCESS:
      return {
        ...state,
        locationCodes: action.payload,
        hasError: null,
        isLoading: false
      };

    case PasswordConfigActionTypes.GET_DOCUMENT_TYPES_SUCCESS:
      return {
        ...state,
        documentTypes: action.payload,
        hasError: null,
        isLoading: false
      };

    case PasswordConfigActionTypes.GET_MATERIAL_PRICES_SUCCESS:
      return {
        ...state,
        materialPrices: action.payload,
        hasError: null,
        isLoading: false
      };

    case PasswordConfigActionTypes.GENERATE_BOUTIQUE_PASSWORD_FOR_MANUAL_BILL_SUCCESS:
      return {
        ...state,
        generateBoutiquePasswordResponseForManualBill: action.payload,
        hasError: null,
        isLoading: false
      };

    case PasswordConfigActionTypes.GENERATE_BOUTIQUE_PASSWORD_FOR_GOLD_RATE_SUCCESS:
      return {
        ...state,
        generateBoutiquePasswordResponseForGoldRate: action.payload,
        hasError: null,
        isLoading: false
      };

    case PasswordConfigActionTypes.GENERATE_CASH_DEPOSIT_PASSWORD_SUCCESS:
      return {
        ...state,
        generateCashDepostPasswordResponse: action.payload,
        hasError: null,
        isLoading: false
      };

    case PasswordConfigActionTypes.RESET_VALUES:
      return {
        ...state,
        hasError: null,
        isLoading: false,
        locationCodes: [],
        documentTypes: [],
        materialPrices: [],
        generateBoutiquePasswordResponseForManualBill: null,
        generateBoutiquePasswordResponseForGoldRate: null,
        generateCashDepostPasswordResponse: null
      };

      case PasswordConfigActionTypes.RESET_PASSWORD_VALUES:
        return {
          ...state,
          hasError: null,
          isLoading: false,
          generateBoutiquePasswordResponseForManualBill: null,
          generateBoutiquePasswordResponseForGoldRate: null,
          generateCashDepostPasswordResponse: null
        };
    default:
      return state;
  }
}
