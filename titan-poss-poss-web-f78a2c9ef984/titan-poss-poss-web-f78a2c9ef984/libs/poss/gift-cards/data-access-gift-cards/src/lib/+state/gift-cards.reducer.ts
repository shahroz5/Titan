import { createFeatureSelector } from '@ngrx/store';
import { GiftCardsState } from './gift-cards.state';
import { GiftCardsActionTypes, GiftCardsActions } from './gift-cards.actions';

export const giftCardsFeatureKey = 'giftCards';

export const selectGiftCardsState = createFeatureSelector<GiftCardsState>(
  giftCardsFeatureKey
);

export const initialState: GiftCardsState = {
  errors: null,
  isLoading: false,
  selectedRSOName: null,
  cardsTotalAmount: 0,
  gcTotalAmountPaid: 0,
  cardsTotalQty: 0,
  cardsList: [],
  maxAmount: 50000,
  minAmount: 10000,
  gcCashMemoDetails: null,
  partiallyUpdatedGcCmResponse: null,
  addGiftCardItemResponse: null,
  getAddedGiftCardItemResponse: null,
  deleteAddedGiftCardItemResponse: null,
  partiallyUpdateGiftCardItemResponse: null,
  updateGcCashMemoResponse: null,
  rsoDetails: [],
  printDataResponse: null,
  gcCashMemoBillsReadyForCancellation: [],
  selectedGcCashMemoData: null,
  cancelGcCashMemoResponse: null,
  selectedGcCancellationReason: null,
  gcCancellationReasons: [],
  remarks: '',
  orderNumber: { order: 0, status: null },
  gcBalance: null,

  gcHistoryListItems: null,
  gcHistoryTotalElements: null,
  historySearchParameter: null
};

export function GiftCardsReducer(
  state: GiftCardsState = initialState,
  action: GiftCardsActions
): GiftCardsState {
  switch (action.type) {
    case GiftCardsActionTypes.CREATE_GC_CASH_MEMO:
      return { ...state, isLoading: true, errors: null };
    case GiftCardsActionTypes.CREATE_GC_CASH_MEMO_SUCCESS:
      return {
        ...state,
        gcCashMemoDetails: action.payload,
        errors: null,
        isLoading: false
      };
    case GiftCardsActionTypes.CREATE_GC_CASH_MEMO_FAILURE:
    case GiftCardsActionTypes.PARTIALLY_UPDATE_GC_CASH_MEMO_FAILURE:
    case GiftCardsActionTypes.UPDATE_GC_CASH_MEMO_FAILURE:
      return {
        ...state,
        errors: action.payload,
        isLoading: false
      };
    case GiftCardsActionTypes.PARTIALLY_UPDATE_GC_CASH_MEMO:
      return { ...state, isLoading: true, errors: null };
    case GiftCardsActionTypes.PARTIALLY_UPDATE_GC_CASH_MEMO_SUCCESS:
      return {
        ...state,
        partiallyUpdatedGcCmResponse: action.payload,
        errors: null,
        isLoading: false
      };
    case GiftCardsActionTypes.UPDATE_GC_CASH_MEMO:
      return { ...state, isLoading: true, errors: null };
    case GiftCardsActionTypes.UPDATE_GC_CASH_MEMO_SUCCESS:
      return {
        ...state,
        updateGcCashMemoResponse: action.payload,
        errors: null,
        isLoading: false
      };
    case GiftCardsActionTypes.ADD_GIFT_CARD_ITEM:
      return { ...state, isLoading: true, errors: null };
    case GiftCardsActionTypes.ADD_GIFT_CARD_ITEM_SUCCESS:
      return {
        ...state,
        addGiftCardItemResponse: action.payload,
        errors: null,
        isLoading: false
      };
    case GiftCardsActionTypes.ADD_GIFT_CARD_ITEM_FAILURE:
      return {
        ...state,
        addGiftCardItemResponse: null,
        errors: action.payload,
        isLoading: false
      };
    case GiftCardsActionTypes.GET_ADDED_GIFT_CARD_ITEM:
      return { ...state, isLoading: true, errors: null };
    case GiftCardsActionTypes.GET_ADDED_GIFT_CARD_ITEM_SUCCESS:
      return {
        ...state,
        getAddedGiftCardItemResponse: action.payload,
        errors: null,
        isLoading: false
      };
    case GiftCardsActionTypes.GET_ADDED_GIFT_CARD_ITEM_FAILURE:
      return {
        ...state,
        getAddedGiftCardItemResponse: null,
        errors: action.payload,
        isLoading: false
      };
    case GiftCardsActionTypes.DELETE_ADDED_GIFT_CARD_ITEM:
      return { ...state, isLoading: true, errors: null };
    case GiftCardsActionTypes.DELETE_ADDED_GIFT_CARD_ITEM_SUCCESS:
      return {
        ...state,
        deleteAddedGiftCardItemResponse: action.payload,
        errors: null,
        isLoading: false
      };
    case GiftCardsActionTypes.DELETE_ADDED_GIFT_CARD_ITEM_FAILURE:
      return {
        ...state,
        deleteAddedGiftCardItemResponse: null,
        errors: action.payload,
        isLoading: false
      };
    case GiftCardsActionTypes.PARTIALLY_UPDATE_GIFT_CARD_ITEM:
      return { ...state, isLoading: true, errors: null };
    case GiftCardsActionTypes.PARTIALLY_UPDATE_GIFT_CARD_ITEM_SUCCESS:
      return {
        ...state,
        partiallyUpdateGiftCardItemResponse: action.payload,
        errors: null,
        isLoading: false
      };
    case GiftCardsActionTypes.PARTIALLY_UPDATE_GIFT_CARD_ITEM_FAILURE:
      return {
        ...state,
        partiallyUpdateGiftCardItemResponse: null,
        errors: action.payload,
        isLoading: false
      };
    case GiftCardsActionTypes.LOAD_RSO_DETAILS:
      return { ...state, isLoading: true, errors: null };
    case GiftCardsActionTypes.LOAD_RSO_DETAILS_SUCCESS:
      return {
        ...state,
        rsoDetails: action.payload,
        errors: null,
        isLoading: false
      };
    case GiftCardsActionTypes.LOAD_RSO_DETAILS_FAILURE:
      return {
        ...state,
        rsoDetails: null,
        errors: action.payload,
        isLoading: false
      };
    case GiftCardsActionTypes.PRINT_GC_CASH_MEMO:
      return { ...state, isLoading: true, errors: null };
    case GiftCardsActionTypes.PRINT_GC_CASH_MEMO_SUCCESS:
      return {
        ...state,
        printDataResponse: action.payload,
        errors: null,
        isLoading: false
      };
    case GiftCardsActionTypes.PRINT_GC_CASH_MEMO_FAILURE:
      return {
        ...state,
        printDataResponse: null,
        errors: action.payload,
        isLoading: false
      };
    case GiftCardsActionTypes.LOAD_CASH_MEMO_BILLS_AVAILABLE_FOR_CANCELLATION:
      return { ...state, isLoading: true, errors: null };
    case GiftCardsActionTypes.LOAD_CASH_MEMO_BILLS_AVAILABLE_FOR_CANCELLATION_SUCCESS:
      return {
        ...state,
        gcCashMemoBillsReadyForCancellation: action.payload,
        errors: null,
        isLoading: false
      };
    case GiftCardsActionTypes.LOAD_CASH_MEMO_BILLS_AVAILABLE_FOR_CANCELLATION_FAILURE:
      return {
        ...state,
        gcCashMemoBillsReadyForCancellation: null,
        errors: action.payload,
        isLoading: false
      };
    case GiftCardsActionTypes.LOAD_SELECTED_GC_CASH_MEMO_DETAILS:
      return { ...state, isLoading: true, errors: null };
    case GiftCardsActionTypes.LOAD_SELECTED_GC_CASH_MEMO_DETAILS_SUCCESS:
      return {
        ...state,
        selectedGcCashMemoData: action.payload,
        errors: null,
        isLoading: false
      };
    case GiftCardsActionTypes.LOAD_SELECTED_GC_CASH_MEMO_DETAILS_FAILURE:
      return {
        ...state,
        selectedGcCashMemoData: null,
        errors: action.payload,
        isLoading: false
      };
    case GiftCardsActionTypes.LOAD_CANCEL_GC_CASH_MEMO:
      return { ...state, isLoading: true, errors: null };
    case GiftCardsActionTypes.LOAD_CANCEL_GC_CASH_MEMO_SUCCESS:
      return {
        ...state,
        cancelGcCashMemoResponse: action.payload,
        errors: null,
        isLoading: false
      };
    case GiftCardsActionTypes.LOAD_CANCEL_GC_CASH_MEMO_FAILURE:
      return {
        ...state,
        cancelGcCashMemoResponse: null,
        errors: action.payload,
        isLoading: false
      };
    case GiftCardsActionTypes.LOAD_GC_CANCELLATION_REASONS:
      return { ...state, isLoading: true, errors: null };
    case GiftCardsActionTypes.LOAD_GC_CANCELLATION_REASONS_SUCCESS:
      return {
        ...state,
        gcCancellationReasons: action.payload,
        errors: null,
        isLoading: false
      };
    case GiftCardsActionTypes.LOAD_GC_CANCELLATION_REASONS_FAILURE:
      return {
        ...state,
        gcCancellationReasons: null,
        errors: action.payload,
        isLoading: false
      };
    case GiftCardsActionTypes.LOAD_GC_BALANCE:
      return {
        ...state,
        gcBalance: null,
        errors: null,
        isLoading: true
      };
    case GiftCardsActionTypes.LOAD_GC_BALANCE_SUCCESS:
      return {
        ...state,
        gcBalance: action.payload,
        errors: null,
        isLoading: false
      };
    case GiftCardsActionTypes.LOAD_GC_BALANCE_FAILURE:
      return {
        ...state,
        gcBalance: null,
        errors: action.payload,
        isLoading: false
      };
    case GiftCardsActionTypes.SET_SELECTED_CANCELLATION_REASON:
      return {
        ...state,
        selectedGcCancellationReason: action.payload,
        isLoading: false
      };
    case GiftCardsActionTypes.SELECTED_RSO_NAME:
      return {
        ...state,
        selectedRSOName: action.payload,
        isLoading: false
      };
    case GiftCardsActionTypes.SET_CARDS_TOTAL_AMOUNT:
      return {
        ...state,
        cardsTotalAmount: action.payload
      };
    case GiftCardsActionTypes.SET_GC_TOTAL_PAID_AMOUNT:
      return {
        ...state,
        gcTotalAmountPaid: action.payload
      };
    case GiftCardsActionTypes.SET_CARDS_TOTAL_QTY:
      return {
        ...state,
        cardsTotalQty: action.payload
      };
    case GiftCardsActionTypes.LOAD_CARDS_LIST:
      return {
        ...state,
        cardsList: action.payload
      };
    case GiftCardsActionTypes.RESET_GIFT_CARDS_DATA:
      return {
        ...state,
        errors: null,
        isLoading: false,
        selectedRSOName: null,
        cardsTotalAmount: 0,
        gcTotalAmountPaid: 0,
        cardsTotalQty: 0,
        cardsList: [],
        gcCashMemoDetails: null,
        partiallyUpdatedGcCmResponse: null,
        addGiftCardItemResponse: null,
        getAddedGiftCardItemResponse: null,
        deleteAddedGiftCardItemResponse: null,
        partiallyUpdateGiftCardItemResponse: null,
        updateGcCashMemoResponse: null,
        rsoDetails: [],
        printDataResponse: null,
        gcCashMemoBillsReadyForCancellation: [],
        selectedGcCashMemoData: null,
        cancelGcCashMemoResponse: null,
        remarks: '',
        orderNumber: { order: 0, status: null }
      };
    case GiftCardsActionTypes.SET_REMARKS:
      return {
        ...state,
        remarks: action.payload
      };

    case GiftCardsActionTypes.SET_ORDER_NUMBER:
      return {
        ...state,
        orderNumber: { order: action.payload, status: action.status }
      };
    case GiftCardsActionTypes.LOAD_GIFT_CARDS_HISTORY_LIST_ITEMS:
      return {
        ...state,
        isLoading: true,
        errors: null
      };
    case GiftCardsActionTypes.LOAD_GIFT_CARDS_HISTORY_LIST_ITEMS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        errors: null,
        gcHistoryListItems: action.payload.giftCardsHistoryListItems,
        gcHistoryTotalElements: action.payload.totalElements
      };
    case GiftCardsActionTypes.LOAD_GIFT_CARDS_HISTORY_LIST_ITEMS_FAILURE:
      return {
        ...state,
        isLoading: false,
        errors: action.payload,
        gcHistoryListItems: null,
        gcHistoryTotalElements: null
      };
    case GiftCardsActionTypes.RESET_HISTORY:
      return {
        ...state,
        gcHistoryTotalElements: null,
        gcHistoryListItems: null,
        historySearchParameter: null
      };
    case GiftCardsActionTypes.UPDATE_HISTORY_SEARCH_PARAMETER:
      return {
        ...state,
        historySearchParameter: action.payload
      };
    default:
      return state;
  }
}
