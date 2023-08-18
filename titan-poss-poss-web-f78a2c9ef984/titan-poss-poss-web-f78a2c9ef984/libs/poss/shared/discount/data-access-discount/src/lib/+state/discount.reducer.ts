import { DiscountState } from './discount.state';
import { createFeatureSelector } from '@ngrx/store';
import { DiscountActions, DiscountActionTypes } from './discount.actions';

export const DISCOUNT_FEATURE_KEY = 'discount';

export const selectDiscountState = createFeatureSelector<DiscountState>(
  DISCOUNT_FEATURE_KEY
);

/**
 * The initial state of the store
 */
export const initialState: DiscountState = {
  error: null,
  isLoading: false,
  isDropdownLoading: false,
  isAlreadyAddedDiscountsLoading: false,
  isDiscountDetailsLoading: false,
  isAutoDiscLoading: false,
  isABDropdownLoading: false,
  currentConfirmedDiscount: null,
  isRsoSelected: true,
  discountState: null,
  itemLevelDiscounts: null,
  itemLevelDiscountsDetails: null,
  getItemLevelDiscountsRes: null,
  saveItemLevelDiscountsRes: { response: [], data: null },
  updateItemLevelDiscountsRes: [],
  deleteItemLevelDiscountsRes: { response: false, data: null },
  productCategoryDesc: null,
  productGroupDesc: null,
  isDescLoaded: false,
  discountTypes: [],
  digiDiscounts: null,
  grnMultipleDiscount: null,
  transactionLevelDiscounts: [],
  isLoadingAvailableDiscounts: false,
  availableEmployeeDiscounts: null,
  availableTsssDiscounts: null,
  availableTataEmployeeDiscounts: null,
  availableSystemDvDiscounts: null,
  availableEmpowermentDiscounts: null,
  isTransactionLevelDiscountApplied: false,
  appliedTransactionLevelDiscounts: [],
  isAllAppliedTransactionLevelDiscountDeleted: {
    isDeleted: false,
    discountType: null
  },
  isSelectedTransactionLevelDiscountDeleted: false,
  isTransactionLevelDiscountUpdated: false,
  isTransactionLevelDiscountConfirmed: false,
  currentDeleteDiscount: null,
  tataCompanyList: [],
  refreshOffersAndDiscountsPanel: false,

  isEncircleDiscDetails: null,
  eligibileItemsResponseForKaratOrCoinOffer: null,
  appliedKaratorCoinOfferDiscountResponse: null,

  discountVoucherDetails: null,

  ABCOEligibilityRes: null,
  ABCODiscountsRes: null,
  newABCODiscountsRes: null,
  ABCODiscountDetailsRes: null,
  ABCOConfigDetailsRes: null,
  autoDiscountsRes: { response: null, data: null },
  eligibleItemsResponseForGepPurityOffer: null,
  isClearEncircle: false,
  reloadDiscounts: false,
  orderDiscountDetails: null,
  rivaahGHSDiscounts: null,
  saveRivaahGHSDiscountsResponse: null,
  enableCalculateRivaahGHSDiscounts: false,
  reasonForChangingDiscounts: [],
  reasonForNotGivingDiscounts: [],
  isExcludeSlabItemAdded: null
};

/**
 * The reducer function which manipulates the store for respective Action
 */
export function DiscountReducer(
  state: DiscountState = initialState,
  action: DiscountActions
): DiscountState {
  switch (action.type) {
    case DiscountActionTypes.LOAD_ITEM_LEVEL_DISCOUNTS:
      return {
        ...state,
        error: null,
        isDropdownLoading: true,
        itemLevelDiscounts: null
      };
    case DiscountActionTypes.LOAD_ITEM_LEVEL_DISCOUNTS_SUCCESS:
      return {
        ...state,
        isDropdownLoading: false,
        itemLevelDiscounts: action.payload
      };
    case DiscountActionTypes.LOAD_ITEM_LEVEL_DISCOUNTS_DETAILS:
      return {
        ...state,
        error: null,
        isDiscountDetailsLoading: true,
        itemLevelDiscountsDetails: null
      };
    case DiscountActionTypes.LOAD_ITEM_LEVEL_DISCOUNTS_DETAILS_SUCCESS:
      return {
        ...state,
        isDiscountDetailsLoading: false,
        itemLevelDiscountsDetails: action.payload
      };
    case DiscountActionTypes.GET_ITEM_LEVEL_DISCOUNTS:
      return {
        ...state,
        error: null,
        isAlreadyAddedDiscountsLoading: true,
        getItemLevelDiscountsRes: null
      };

    case DiscountActionTypes.SAVE_EXCLUDE_SLAB_ITEM_DISCOUNT:
      return {
        ...state,
        isLoading: true,
        isExcludeSlabItemAdded: false
      };

    case DiscountActionTypes.SAVE_EXCLUDE_SLAB_ITEM_DISCOUNT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isExcludeSlabItemAdded: true
      };

    case DiscountActionTypes.GET_ITEM_LEVEL_DISCOUNTS_SUCCESS:
      return {
        ...state,
        isAlreadyAddedDiscountsLoading: false,
        getItemLevelDiscountsRes: action.payload
      };
    case DiscountActionTypes.SAVE_ITEM_LEVEL_DISCOUNTS:
      return {
        ...state,
        error: null,
        isLoading: true,
        saveItemLevelDiscountsRes: { response: [], data: null }
      };
    case DiscountActionTypes.SAVE_ITEM_LEVEL_DISCOUNTS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        saveItemLevelDiscountsRes: action.payload
      };
    case DiscountActionTypes.UPDATE_ITEM_LEVEL_DISCOUNTS:
      return {
        ...state,
        error: null,
        isLoading: true
        // updateItemLevelDiscountsRes: false
      };
    case DiscountActionTypes.UPDATE_ITEM_LEVEL_DISCOUNTS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        updateItemLevelDiscountsRes: state.updateItemLevelDiscountsRes.concat(
          action.payload
        )
      };
    case DiscountActionTypes.DELETE_ITEM_LEVEL_DISCOUNTS:
      return {
        ...state,
        error: null,
        isLoading: true,
        deleteItemLevelDiscountsRes: { response: false, data: null }
      };
    case DiscountActionTypes.DELETE_ITEM_LEVEL_DISCOUNTS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        deleteItemLevelDiscountsRes: {
          response: action.payload.response,
          data: action.payload.data
        }
      };

    case DiscountActionTypes.LOAD_PC_DESC:
    case DiscountActionTypes.LOAD_PG_DESC:
      return {
        ...state,
        error: null,
        isLoading: true
      };
    case DiscountActionTypes.LOAD_PC_DESC_SUCCESS:
      return {
        ...state,
        isLoading: false,
        productCategoryDesc: action.payload
      };
    case DiscountActionTypes.LOAD_PG_DESC_SUCCESS:
      return {
        ...state,
        isLoading: false,
        productGroupDesc: action.payload
      };
    case DiscountActionTypes.LOAD_PC_DESC_FAILURE:
    case DiscountActionTypes.LOAD_PG_DESC_FAILURE:
    case DiscountActionTypes.SAVE_ITEM_LEVEL_DISCOUNTS_FAILURE:
    case DiscountActionTypes.UPDATE_ITEM_LEVEL_DISCOUNTS_FAILURE:
    case DiscountActionTypes.DELETE_ITEM_LEVEL_DISCOUNTS_FAILURE:
    case DiscountActionTypes.CHECK_AB_CO_ELIGIBILITY_FAILURE:
    case DiscountActionTypes.LOAD_AB_CO_DISCOUNT_DETAILS_FAILURE:
    case DiscountActionTypes.LOAD_AB_CO_CONFIG_DETAILS_FAILURE:
    case DiscountActionTypes.LOAD_RIVAAH_GHS_DISCOUNTS_FAILURE:
    case DiscountActionTypes.SAVE_RIVAAH_GHS_DISCOUNTS_FAILURE:
    case DiscountActionTypes.LOAD_REASON_FOR_CHANGING_DISCOUNTS_FAILURE:
    case DiscountActionTypes.LOAD_REASON_FOR_NOTGIVING_DISCOUNTS_FAILURE:
    case DiscountActionTypes.SAVE_EXCLUDE_SLAB_ITEM_DISCOUNT_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    case DiscountActionTypes.LOAD_ITEM_LEVEL_DISCOUNTS_FAILURE:
      return {
        ...state,
        error: action.payload,
        isDropdownLoading: false
      };

    case DiscountActionTypes.LOAD_ITEM_LEVEL_DISCOUNTS_DETAILS_FAILURE:
      return {
        ...state,
        error: action.payload,
        isDiscountDetailsLoading: false
      };

    case DiscountActionTypes.GET_ITEM_LEVEL_DISCOUNTS_FAILURE:
      return {
        ...state,
        error: action.payload,
        isAlreadyAddedDiscountsLoading: false
      };

    case DiscountActionTypes.LOAD_AB_CO_DISCOUNTS_FAILURE:
    case DiscountActionTypes.LOAD_NEW_AB_CO_DISCOUNTS_FAILURE:
      return {
        ...state,
        error: action.payload,
        isABDropdownLoading: false
      };

    case DiscountActionTypes.LOAD_AUTO_DISCOUNTS_FAILURE:
      return {
        ...state,
        error: action.payload,
        isAutoDiscLoading: false
      };

    case DiscountActionTypes.CLEAR:
      return {
        ...state,
        error: null,
        isLoading: false,
        isAutoDiscLoading: false,
        isABDropdownLoading: false,
        itemLevelDiscounts: null,
        itemLevelDiscountsDetails: null,
        getItemLevelDiscountsRes: null,
        saveItemLevelDiscountsRes: { response: [], data: null },
        updateItemLevelDiscountsRes: [],
        deleteItemLevelDiscountsRes: { response: false, data: null },
        isDropdownLoading: false,
        isAlreadyAddedDiscountsLoading: false,
        isDiscountDetailsLoading: false,
        ABCOEligibilityRes: null,
        ABCODiscountsRes: null,
        currentDeleteDiscount: null,
        newABCODiscountsRes: null,
        currentConfirmedDiscount: null,
        discountState: null,
        ABCODiscountDetailsRes: null,
        ABCOConfigDetailsRes: null,
        autoDiscountsRes: { response: null, data: null },
        discountTypes: [],
        isClearEncircle: false,
        discountVoucherDetails: null,
        rivaahGHSDiscounts: null,
        saveRivaahGHSDiscountsResponse: null
        // enableCalculateRivaahGHSDiscounts: false
        // orderDiscountDetails: null
      };
    case DiscountActionTypes.CLEAR_ITEM_LEVEL_DISCOUNT_DETAILS:
      return {
        ...state,
        error: null,
        isLoading: false,
        itemLevelDiscountsDetails: null,
        ABCOEligibilityRes: null,
        ABCODiscountDetailsRes: null,
        ABCOConfigDetailsRes: null,
        discountState: null
      };

    case DiscountActionTypes.SET_DISCOUNT_STATE:
      return {
        ...state,
        discountState: action.payload
      };
    case DiscountActionTypes.CLEAR_UPDATE_ITEM_LEVEL_DISCOUNT_DETAILS:
      return {
        ...state,
        error: null,
        isLoading: false,
        updateItemLevelDiscountsRes: []
      };
    case DiscountActionTypes.REFRESH_DISCOUNT_AND_OFFERS_PANEL:
      return {
        ...state,
        refreshOffersAndDiscountsPanel: action.payload
      };
    case DiscountActionTypes.LOAD_TRANSACTION_LEVEL_DISCOUNTS:
      return {
        ...state,
        isLoading: true,
        error: null,
        transactionLevelDiscounts: []
      };
    case DiscountActionTypes.LOAD_TRANSACTION_LEVEL_DISCOUNTS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        transactionLevelDiscounts: action.payload
      };
    case DiscountActionTypes.LOAD_TRANSACTION_LEVEL_DISCOUNTS_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };

    case DiscountActionTypes.LOAD_DIGI_GOLD_DISCOUNTS:
      return {
        ...state,
        isLoading: true,
        error: null,
        digiDiscounts: null
      };
    case DiscountActionTypes.LOAD_DIGI_GOLD_DISCOUNTS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        digiDiscounts: action.payload[0]
      };
    case DiscountActionTypes.LOAD_DIGI_GOLD_DISCOUNTS_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };
    case DiscountActionTypes.LOAD_GRN_MULTIPLE_DISCOUNTS:
      return {
        ...state,
        isLoading: true,
        error: null,
        grnMultipleDiscount: null
      };
    case DiscountActionTypes.LOAD_GRN_MULTIPLE_DISCOUNTS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        grnMultipleDiscount: action.payload[0]
      };
    case DiscountActionTypes.LOAD_GRN_MULTIPLE_DISCOUNTS_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };
    case DiscountActionTypes.LOAD_AVAILABLE_EMPLOYEE_DISCOUNTS:
      return {
        ...state,
        isLoading: true,
        isLoadingAvailableDiscounts: true,
        error: null,
        availableEmployeeDiscounts: null
      };
    case DiscountActionTypes.LOAD_AVAILABLE_EMPLOYEE_DISCOUNTS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isLoadingAvailableDiscounts: false,
        availableEmployeeDiscounts: action.payload
      };
    case DiscountActionTypes.LOAD_AVAILABLE_EMPLOYEE_DISCOUNTS_FAILURE:
      return {
        ...state,
        isLoading: false,
        isLoadingAvailableDiscounts: false,
        availableEmployeeDiscounts: null,
        error: action.payload
      };

    case DiscountActionTypes.LOAD_AVAILABLE_TSSS_DISCOUNTS:
      return {
        ...state,
        isLoading: true,
        isLoadingAvailableDiscounts: true,
        error: null,
        availableTsssDiscounts: null
      };
    case DiscountActionTypes.LOAD_AVAILABLE_TSSS_DISCOUNTS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isLoadingAvailableDiscounts: false,
        availableTsssDiscounts: action.payload
      };
    case DiscountActionTypes.LOAD_AVAILABLE_TSSS_DISCOUNTS_FAILURE:
      return {
        ...state,
        isLoading: false,
        isLoadingAvailableDiscounts: false,
        availableTsssDiscounts: null,
        error: action.payload
      };

    case DiscountActionTypes.LOAD_AVAILABLE_TATA_EMPLOYEE_DISCOUNTS:
      return {
        ...state,
        isLoading: true,
        isLoadingAvailableDiscounts: true,
        error: null,
        availableTataEmployeeDiscounts: null
      };
    case DiscountActionTypes.LOAD_AVAILABLE_TATA_EMPLOYEE_DISCOUNTS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isLoadingAvailableDiscounts: false,
        availableTataEmployeeDiscounts: action.payload
      };
    case DiscountActionTypes.LOAD_AVAILABLE_TATA_EMPLOYEE_DISCOUNTS_FAILURE:
      return {
        ...state,
        isLoading: false,
        isLoadingAvailableDiscounts: false,
        availableTataEmployeeDiscounts: null,
        error: action.payload
      };
    case DiscountActionTypes.LOAD_AVAILABLE_SYSTEM_DV_DISCOUNTS:
      return {
        ...state,
        isLoading: true,
        isLoadingAvailableDiscounts: true,
        error: null,
        availableSystemDvDiscounts: null
      };
    case DiscountActionTypes.LOAD_AVAILABLE_SYSTEM_DV_DISCOUNTS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isLoadingAvailableDiscounts: false,
        availableSystemDvDiscounts: action.payload
      };
    case DiscountActionTypes.LOAD_AVAILABLE_SYSTEM_DV_DISCOUNTS_FAILURE:
      return {
        ...state,
        isLoading: false,
        isLoadingAvailableDiscounts: false,
        availableSystemDvDiscounts: null,
        error: action.payload
      };
    case DiscountActionTypes.LOAD_AVAILABLE_EMPOWERMENT_DISCOUNT:
      return {
        ...state,
        isLoading: true,
        isLoadingAvailableDiscounts: true,
        error: null,
        availableEmpowermentDiscounts: null
      };
    case DiscountActionTypes.LOAD_AVAILABLE_EMPOWERMENT_DISCOUNT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isLoadingAvailableDiscounts: false,
        availableEmpowermentDiscounts: action.payload
      };
    case DiscountActionTypes.LOAD_AVAILABLE_EMPOWERMENT_DISCOUNT_FAILURE:
      return {
        ...state,
        isLoading: false,
        isLoadingAvailableDiscounts: false,
        availableEmpowermentDiscounts: null,
        error: action.payload
      };
    case DiscountActionTypes.APPLY_DISCOUNT_AT_TRANSACTION_LEVEL:
      return {
        ...state,
        isLoading: true,
        isTransactionLevelDiscountApplied: false,
        error: null
      };
    case DiscountActionTypes.APPLY_DISCOUNT_AT_TRANSACTION_LEVEL_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isTransactionLevelDiscountApplied: action.payload
      };
    case DiscountActionTypes.APPLY_DISCOUNT_AT_TRANSACTION_LEVEL_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };

    case DiscountActionTypes.LOAD_APPLIED_TRANSACTION_LEVEL_DISCOUNTS:
      return {
        ...state,
        isLoading: true,
        appliedTransactionLevelDiscounts: [],
        error: null
      };
    case DiscountActionTypes.LOAD_APPLIED_TRANSACTION_LEVEL_DISCOUNTS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        appliedTransactionLevelDiscounts: action.payload
      };
    case DiscountActionTypes.LOAD_APPLIED_TRANSACTION_LEVEL_DISCOUNTS_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };
    case DiscountActionTypes.REMOVE_ALL_APPLIED_TRANSACTION_LEVEL_DISCOUNTS:
      return {
        ...state,
        isLoading: true,
        isAllAppliedTransactionLevelDiscountDeleted: {
          isDeleted: false,
          discountType: null
        },
        error: null
      };
    case DiscountActionTypes.REMOVE_ALL_APPLIED_TRANSACTION_LEVEL_DISCOUNTS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isAllAppliedTransactionLevelDiscountDeleted: {
          isDeleted: action.payload.isDeleted,
          discountType: action.payload.discountType
        }
      };
    case DiscountActionTypes.REMOVE_ALL_APPLIED_TRANSACTION_LEVEL_DISCOUNTS_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };

    case DiscountActionTypes.REMOVE_APPLIED_TRANSACTION_LEVEL_DISCOUNT_BY_ID:
      return {
        ...state,
        isLoading: true,
        isSelectedTransactionLevelDiscountDeleted: false,
        error: null
      };
    case DiscountActionTypes.REMOVE_APPLIED_TRANSACTION_LEVEL_DISCOUNT_BY_ID_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isSelectedTransactionLevelDiscountDeleted: action.payload
      };
    case DiscountActionTypes.REMOVE_APPLIED_TRANSACTION_LEVEL_DISCOUNT_BY_ID_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };

    case DiscountActionTypes.REMOVE_DIGI_DISCOUNT:
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case DiscountActionTypes.REMOVE_DIGI_DISCOUNT_SUCCESS:
      return {
        ...state,
        isLoading: false,

        currentDeleteDiscount: action.deletedDiscount
      };
    case DiscountActionTypes.REMOVE_DIGI_DISCOUNT_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };

    case DiscountActionTypes.UPDATE_APPLIED_TRANSACTION_LEVEL_DISCOUNTS:
      return {
        ...state,
        isLoading: true,
        isTransactionLevelDiscountUpdated: false,
        error: null
      };
    case DiscountActionTypes.UPDATE_APPLIED_TRANSACTION_LEVEL_DISCOUNTS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isTransactionLevelDiscountUpdated: action.payload
      };
    case DiscountActionTypes.UPDATE_APPLIED_TRANSACTION_LEVEL_DISCOUNTS_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };
    case DiscountActionTypes.CONFIRM_APPLIED_TRANSACTION_LEVEL_DISCOUNTS:
      return {
        ...state,
        isLoading: true,
        isTransactionLevelDiscountConfirmed: false,
        currentConfirmedDiscount: null,
        error: null
      };
    case DiscountActionTypes.CONFIRM_APPLIED_TRANSACTION_LEVEL_DISCOUNTS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        currentConfirmedDiscount: action.confirmedDiscounts,
        appliedTransactionLevelDiscounts: [
          ...state.appliedTransactionLevelDiscounts.map(discount => ({
            ...discount,
            status: 'CONFIRMED'
          }))
        ],
        isTransactionLevelDiscountConfirmed: action.payload
      };
    case DiscountActionTypes.CONFIRM_APPLIED_TRANSACTION_LEVEL_DISCOUNTS_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };
    case DiscountActionTypes.LOAD_DISCOUNT_TYPES:
      return {
        ...state,
        isLoading: true,
        discountTypes: [],
        error: null
      };
    case DiscountActionTypes.LOAD_DISCOUNT_TYPES_SUCCESS:
      return {
        ...state,
        isLoading: false,
        discountTypes: action.payload
      };
    case DiscountActionTypes.LOAD_DISCOUNT_TYPES_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };
    case DiscountActionTypes.CLEAR_TRANSACTION_LEVEL_DISCOUNT_DETAILS:
      return {
        ...state,
        error: null,
        // commented as a fix for 217480 and 217479
        // transactionLevelDiscounts: [],
        digiDiscounts: null,
        isTransactionLevelDiscountApplied: false,
        appliedTransactionLevelDiscounts: [],
        isAllAppliedTransactionLevelDiscountDeleted: {
          isDeleted: false,
          discountType: null
        },
        isSelectedTransactionLevelDiscountDeleted: false,
        currentDeleteDiscount: null,
        isTransactionLevelDiscountUpdated: false,
        availableEmployeeDiscounts: null,
        availableTsssDiscounts: null,
        availableTataEmployeeDiscounts: null,
        availableSystemDvDiscounts: null,
        availableEmpowermentDiscounts: null,
        currentConfirmedDiscount: null,
        discountState: null
      };

    case DiscountActionTypes.SET_IS_RSO_SELECETED:
      return {
        ...state,
        isRsoSelected: action.payload
      };
    case DiscountActionTypes.CLEAR_ISENCIRCLE_ADDED:
      return {
        ...state,
        error: null,
        isLoading: false,
        isEncircleDiscDetails: null
      };
    case DiscountActionTypes.CLEAR_ENCIRCLE:
      return {
        ...state,
        error: null,
        isLoading: false,
        isClearEncircle: true
      };
    case DiscountActionTypes.SET_ISENCIRCLE_DETAILS:
      return {
        ...state,
        error: null,
        isLoading: false,
        isEncircleDiscDetails: action.payload
      };
    case DiscountActionTypes.LOAD_TATA_COMPANY_NAME_LIST:
      return {
        ...state,
        isLoading: true,
        error: null,
        tataCompanyList: []
      };
    case DiscountActionTypes.LOAD_TATA_COMPANY_NAME_LIST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        tataCompanyList: action.payload
      };
    case DiscountActionTypes.LOAD_TATA_COMPANY_NAME_LIST_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };

    case DiscountActionTypes.LOAD_ELIGIBLE_ITEMS_FOR_DISCOUNT_IDS:
      return {
        ...state,
        isLoading: true,
        eligibileItemsResponseForKaratOrCoinOffer: null,
        error: null
      };
    case DiscountActionTypes.LOAD_ELIGIBLE_ITEMS_FOR_DISCOUNT_IDS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        eligibileItemsResponseForKaratOrCoinOffer: action.payload
      };
    case DiscountActionTypes.LOAD_ELIGIBLE_ITEMS_FOR_DISCOUNT_IDS_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };

    case DiscountActionTypes.LOAD_ELIGIBLE_ITEMS_FOR_GEP_PURITY_CONFIG:
      return {
        ...state,
        isLoading: true,
        eligibleItemsResponseForGepPurityOffer: null,
        error: null
      };
    case DiscountActionTypes.LOAD_ELIGIBLE_ITEMS_FOR_GEP_PURITY_CONFIG_SUCCESS:
      return {
        ...state,
        isLoading: false,
        eligibleItemsResponseForGepPurityOffer: action.payload
      };
    case DiscountActionTypes.LOAD_ELIGIBLE_ITEMS_FOR_GEP_PURITY_CONFIG_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };

    case DiscountActionTypes.APPLY_KARAT_OR_COIN_OFFER_DISCOUNT:
      return {
        ...state,
        isLoading: true,
        appliedKaratorCoinOfferDiscountResponse: null,
        error: null
      };
    case DiscountActionTypes.APPLY_KARAT_OR_COIN_OFFER_DISCOUNT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        appliedKaratorCoinOfferDiscountResponse: action.payload
      };
    case DiscountActionTypes.APPLY_KARAT_OR_COIN_OFFER_DISCOUNT_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };
    case DiscountActionTypes.LOAD_DISCOUNT_VOUCHER_DETAILS:
      return {
        ...state,
        isLoading: true,
        discountVoucherDetails: null,
        error: null
      };
    case DiscountActionTypes.LOAD_DISCOUNT_VOUCHER_DETAILS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        discountVoucherDetails: action.payload
      };
    case DiscountActionTypes.LOAD_DISCOUNT_VOUCHER_DETAILS_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };
    // case DiscountActionTypes.SET_GHS_PAYMENT_DETAILS:
    //   return {
    //     ...state
    //     // ghsPaymentDetails: action.payload
    //   };

    case DiscountActionTypes.CHECK_AB_CO_ELIGIBILITY:
      return {
        ...state,
        isLoading: true,
        ABCOEligibilityRes: null
      };

    case DiscountActionTypes.CHECK_AB_CO_ELIGIBILITY_SUCCESS:
      return {
        ...state,
        isLoading: false,
        ABCOEligibilityRes: action.payload ? action.payload : 'no-response'
      };

    case DiscountActionTypes.LOAD_AB_CO_DISCOUNTS:
      return {
        ...state,
        isABDropdownLoading: true,
        ABCODiscountsRes: null
      };

    case DiscountActionTypes.LOAD_AB_CO_DISCOUNTS_SUCCESS:
      return {
        ...state,
        isABDropdownLoading: false,
        ABCODiscountsRes: action.payload
      };

    case DiscountActionTypes.LOAD_NEW_AB_CO_DISCOUNTS:
      return {
        ...state,
        isABDropdownLoading: true,
        newABCODiscountsRes: null
      };

    case DiscountActionTypes.LOAD_NEW_AB_CO_DISCOUNTS_SUCCESS:
      return {
        ...state,
        isABDropdownLoading: false,
        newABCODiscountsRes: action.payload
      };

    case DiscountActionTypes.LOAD_AB_CO_DISCOUNT_DETAILS:
      return {
        ...state,
        isLoading: true,
        ABCODiscountDetailsRes: null
      };

    case DiscountActionTypes.LOAD_AB_CO_DISCOUNT_DETAILS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        ABCODiscountDetailsRes: action.payload
      };

    case DiscountActionTypes.LOAD_AB_CO_CONFIG_DETAILS:
      return {
        ...state,
        isLoading: true,
        ABCOConfigDetailsRes: null
      };

    case DiscountActionTypes.LOAD_AB_CO_CONFIG_DETAILS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        ABCOConfigDetailsRes: action.payload
      };

    case DiscountActionTypes.LOAD_AUTO_DISCOUNTS:
      return {
        ...state,
        isAutoDiscLoading: true,
        autoDiscountsRes: { response: null, data: null }
      };

    case DiscountActionTypes.LOAD_AUTO_DISCOUNTS_SUCCESS:
      return {
        ...state,
        isAutoDiscLoading: false,
        autoDiscountsRes: {
          response: action.payload.response,
          data: action.payload.data
        }
      };
    case DiscountActionTypes.RELOAD_GRID_ON_DISCOUNT_APPLY_DELETE:
      return {
        ...state,
        isLoading: false,
        reloadDiscounts: action.payload
      };

    case DiscountActionTypes.SET_ORDER_DISCOUNT_DETAILS:
      return {
        ...state,
        isLoading: false,
        orderDiscountDetails: action.payload
      };

    case DiscountActionTypes.CLEAR_ORDER_DISCOUNT_DETAILS:
      return {
        ...state,
        isLoading: false,
        orderDiscountDetails: null
      };

    case DiscountActionTypes.LOAD_RIVAAH_GHS_DISCOUNTS:
      return {
        ...state,
        isLoading: true,
        error: null,
        rivaahGHSDiscounts: null
      };
    case DiscountActionTypes.LOAD_RIVAAH_GHS_DISCOUNTS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        rivaahGHSDiscounts: action.payload
      };
    case DiscountActionTypes.SAVE_RIVAAH_GHS_DISCOUNTS:
      return {
        ...state,
        isLoading: true,
        error: null,
        saveRivaahGHSDiscountsResponse: null
      };
    case DiscountActionTypes.SAVE_RIVAAH_GHS_DISCOUNTS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        saveRivaahGHSDiscountsResponse: action.payload
      };

    case DiscountActionTypes.SET_ENABLE_CALCULATE_RIVAAH_GHS_DISCOUNTS:
      return {
        ...state,
        enableCalculateRivaahGHSDiscounts: action.payload
      };

    case DiscountActionTypes.LOAD_REASON_FOR_CHANGING_DISCOUNTS:
    case DiscountActionTypes.LOAD_REASON_FOR_NOTGIVING_DISCOUNTS:
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case DiscountActionTypes.LOAD_REASON_FOR_CHANGING_DISCOUNTS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        reasonForChangingDiscounts: action.payload
      };

    case DiscountActionTypes.LOAD_REASON_FOR_NOTGIVING_DISCOUNTS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        reasonForNotGivingDiscounts: action.payload
      };

    default:
      return state;
  }
}
