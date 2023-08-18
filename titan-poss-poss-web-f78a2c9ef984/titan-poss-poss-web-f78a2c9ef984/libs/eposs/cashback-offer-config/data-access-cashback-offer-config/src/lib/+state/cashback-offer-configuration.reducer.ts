import { createFeatureSelector } from '@ngrx/store';
import { CashbackOfferConfigurationState } from './cashback-offer-configuration.state';

import {
  CashbackOfferConfigurationActionTypes,
  CashbckOfferConfigurationAction
} from './cashback-offer-configuration.actions';
export const cashBackOfferConfigurationFeatureKey =
  'cashbackOfferConfiguration';

export const selectCashbackOfferConfigurationState = createFeatureSelector<
  CashbackOfferConfigurationState
>(cashBackOfferConfigurationFeatureKey);

export const initialState: CashbackOfferConfigurationState = {
  bankDetails: null,
  excludeCashback: null,
  isLoading: null,
  hasSaved: null,
  hasUpdated: null,
  offerDetailsUpdated: null,
  totalElements: null,
  error: null,
  cashbackOfferList: [],
  payerBank: [],
  offerDetails: [],
  isCleared: null,
  isCashAmount: true,
  selectedProductGroup: [],
  isProductGroupUpdated: null,
  cardDetails: null,
  fileResponse: null,
  errorLog: null
};

export function cashbackOfferConfigurationReducer(
  state: CashbackOfferConfigurationState = initialState,
  action: CashbckOfferConfigurationAction
) {
  switch (action.type) {
    case CashbackOfferConfigurationActionTypes.LOAD_CARD_DETAILS_BY_ID:
    case CashbackOfferConfigurationActionTypes.UPLOAD_CARD_DETAILS_BY_ID:
    case CashbackOfferConfigurationActionTypes.LOAD_MAPPED_PRODUCT_GROUP_BY_ID:
    case CashbackOfferConfigurationActionTypes.LOAD_PAYER_BANK_LIST:
    case CashbackOfferConfigurationActionTypes.LOAD_BANK_DETAILS_BY_ID:
    case CashbackOfferConfigurationActionTypes.LOAD_CASHBACK_OFFER_LIST:
    case CashbackOfferConfigurationActionTypes.ERROR_LOG_DOWNLOAD:
    case CashbackOfferConfigurationActionTypes.SAVE_BANK_DETAILS:
      return {
        ...state,
        isLoading: true
      };
    case CashbackOfferConfigurationActionTypes.UPDATE_CARD_DETAILS_BY_ID_SUCCESS:
      return {
        ...state,
        isLoading: false,
        hasUpdated: true
      };
    case CashbackOfferConfigurationActionTypes.ERROR_LOG_DOWNLOAD_SUCCESS:
      return {
        ...state,
        isLoading: false,
        errorLog: action.payload
      };
    case CashbackOfferConfigurationActionTypes.UPLOAD_CARD_DETAILS_BY_ID_SUCCESS:
      return {
        ...state,
        isLoading: false,
        fileResponse: action.payload
      };
    case CashbackOfferConfigurationActionTypes.LOAD_CARD_DETAILS_BY_ID_SUCCESS:
      return {
        ...state,
        isLoading: false,
        cardDetails: action.payload.cardDetails,
        totalElements: action.payload.totalElements
      };
    case CashbackOfferConfigurationActionTypes.UPDATE_CARD_DETAILS_BY_ID:
    case CashbackOfferConfigurationActionTypes.UPADTE_BANK_DETAILS:
      return {
        ...state,
        isLoading: true,
        hasUpdated: false
      };

    case CashbackOfferConfigurationActionTypes.UPADTE_BANK_DETAILS_FAILURE:
    case CashbackOfferConfigurationActionTypes.UPDATE_CARD_DETAILS_BY_ID_FAILURE:
      return {
        ...state,
        isLoading: null,
        hasUpdated: null,
        error: action.payload
      };
    case CashbackOfferConfigurationActionTypes.UPDATE_PRODUCT_GROUP_BY_ID:
      return {
        ...state,
        isLoading: true,
        isProductGroupUpdated: false
      };
    case CashbackOfferConfigurationActionTypes.UPDATE_PRODUCT_GROUP_BY_ID_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isProductGroupUpdated: true
      };
    case CashbackOfferConfigurationActionTypes.UPDATE_PRODUCT_GROUP_BY_ID_FAILURE:
      return {
        ...state,
        isLoading: null,
        isProductGroupUpdated: null,
        error: action.payload
      };
    case CashbackOfferConfigurationActionTypes.LOAD_MAPPED_PRODUCT_GROUP_BY_ID_SUCCESS:
      return {
        ...state,
        isLoading: false,
        selectedProductGroup: action.payload
      };
    case CashbackOfferConfigurationActionTypes.LOAD_OFFER_DETAILS_BY_ID:
    case CashbackOfferConfigurationActionTypes.CLEAR_OFFER_DETAILS_BY_ID:
      return {
        ...state,
        isLoading: true,
        isCleared: false
      };
    case CashbackOfferConfigurationActionTypes.UPDATE_OFFER_DETAILS_BY_ID:
      return {
        ...state,
        isLoading: true,
        isCashAmount: action.payload.data.isCashbackAmount,
        offerDetailsUpdated: false
      };

    case CashbackOfferConfigurationActionTypes.LOAD_OFFER_DETAILS_BY_ID_SUCCESS:
      return {
        ...state,
        offerDetails: action.payload,
        isLoading: false
      };

    case CashbackOfferConfigurationActionTypes.LOAD_PAYER_BANK_LIST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        payerBank: action.payload
      };

    case CashbackOfferConfigurationActionTypes.SAVE_BANK_DETAILS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        hasSaved: true,
        bankDetails: action.payload
      };

    case CashbackOfferConfigurationActionTypes.LOAD_CASHBACK_OFFER_LIST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        cashbackOfferList: action.payload.cashbackOfferList,
        totalElements: action.payload.totalElements
      };
    case CashbackOfferConfigurationActionTypes.LOAD_OFFER_DETAILS_BY_ID_FAILURE:
      return {
        ...state,
        isLoading: null,
        error: null, //ignore,
        offerDetails: []
      };
    case CashbackOfferConfigurationActionTypes.UPLOAD_CARD_DETAILS_BY_ID_FAILURE:
    case CashbackOfferConfigurationActionTypes.LOAD_CARD_DETAILS_BY_ID_FAILURE:
    case CashbackOfferConfigurationActionTypes.LOAD_BANK_DETAILS_BY_ID_FAILURE:
    case CashbackOfferConfigurationActionTypes.ERROR_LOG_DOWNLOAD_FAILURE:
    case CashbackOfferConfigurationActionTypes.LOAD_PAYER_BANK_LIST_FAILURE:
    case CashbackOfferConfigurationActionTypes.LOAD_CASHBACK_OFFER_LIST_FAILURE:
      return {
        ...state,
        isLoading: null,
        error: action.payload
      };
    case CashbackOfferConfigurationActionTypes.LOAD_MAPPED_PRODUCT_GROUP_BY_ID_FAILURE:
      return {
        ...state,
        isLoading: null,
        error: action.payload,
        selectedProductGroup: []
      };
    case CashbackOfferConfigurationActionTypes.SAVE_BANK_DETAILS_FAILURE:
      return {
        ...state,
        isLoading: null,
        hasSaved: null,
        error: action.payload
      };

    case CashbackOfferConfigurationActionTypes.UPADTE_BANK_DETAILSN_SUCCESS:
      return {
        ...state,
        isLoading: false,
        hasUpdated: true,
        bankDetails: action.payload,
        isCashAmount: action.payload.isCashAmount,
        excludeCashback: action.payload.excludeCashback
      };
    case CashbackOfferConfigurationActionTypes.UPDATE_OFFER_DETAILS_BY_ID_FAILURE:
      return {
        ...state,
        isLoading: null,
        offerDetailsUpdated: null,
        error: action.payload
      };

    case CashbackOfferConfigurationActionTypes.LOAD_BANK_DETAILS_BY_ID_SUCCESS:
      return {
        ...state,
        isLoading: false,
        bankDetails: action.payload,
        excludeCashback: action.payload.excludeCashback,
        isCashAmount: action.payload.isCashAmount
      };

    case CashbackOfferConfigurationActionTypes.UPDATE_OFFER_DETAILS_BY_ID_SUCCESS:
      return {
        ...state,
        isLoading: false,
        offerDetailsUpdated: true
      };

    case CashbackOfferConfigurationActionTypes.CLEAR_OFFER_DETAILS_BY_ID_SUCCESS:
      return {
        ...state,
        offerDetails: [],
        isLoading: false,
        isCleared: true
      };
    case CashbackOfferConfigurationActionTypes.CLEAR_OFFER_DETAILS_BY_ID_FAILURE:
      return {
        ...state,
        error: action.payload,
        isCleared: false,
        isLoading: null,
        totalElements: null
      };
    case CashbackOfferConfigurationActionTypes.LOAD_RESET_FILE_DATA:
      return {
        ...state,
        fileResponse: null,
        errorLog: null
      };
    case CashbackOfferConfigurationActionTypes.RESET_IS_CLEARED:
      return {
        ...state,
        isCleared: null,
        hasUpdated: null,
        hasSaved: null,
        fileResponse: null
      };
    case CashbackOfferConfigurationActionTypes.LOAD_RESET:
      return {
        ...state,
        bankDetails: null,
        excludeCashback: null,
        isLoading: null,
        hasSaved: null,
        hasUpdated: null,
        totalElements: null,
        error: null,
        cashbackOfferList: [],
        payerBank: [],
        offerDetails: [],
        isCleared: null,
        selectedProductGroup: [],
        fileResponse: null,
        errorLog: null
      };

    default:
      return { ...state };
  }
}
