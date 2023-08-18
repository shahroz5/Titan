import {
  DiscountsResponse,
  CustomErrors,
  DiscountTransactionLevelResponse,
  DiscountHeaders,
  DiscountConfigDetailsResponse,
  Lov,
  DiscountVoucherDetailsResponePayload,
  RemoveAppliedTransactionLevelDiscountByIDPayload,
  ConfirmTransactionLevelDiscountPayload,
  DiscountHeadersDetails,
  DiscountsRequest,
  CashMemoItemDetailsResponse,
  CashMemoDetailsResponse,
  RivaahGHSDiscounts
} from '@poss-web/shared/models';

export interface DiscountState {
  error: CustomErrors;
  isLoading: boolean;
  isDropdownLoading: boolean;
  isAlreadyAddedDiscountsLoading: boolean;
  isDiscountDetailsLoading: boolean;
  isAutoDiscLoading: boolean;
  isABDropdownLoading: boolean;

  isRsoSelected: boolean;

  itemLevelDiscounts: DiscountHeaders;
  itemLevelDiscountsDetails: {
    discountConfigDetails: DiscountConfigDetailsResponse[];
    clubbingId: string;
    data: CashMemoItemDetailsResponse;
  };
  getItemLevelDiscountsRes: DiscountsResponse[];
  saveItemLevelDiscountsRes: {
    response: DiscountsResponse[];
    data: CashMemoItemDetailsResponse;
  };
  updateItemLevelDiscountsRes: DiscountsResponse[];
  deleteItemLevelDiscountsRes: {
    response: boolean;
    data: {
      discountData: DiscountsRequest | DiscountsRequest[];
      itemData: any;
    };
  };
  productCategoryDesc: {};
  productGroupDesc: {};
  isDescLoaded: boolean;
  discountTypes: Lov[];
  currentDeleteDiscount: RemoveAppliedTransactionLevelDiscountByIDPayload;
  transactionLevelDiscounts: DiscountTransactionLevelResponse[];
  digiDiscounts: DiscountTransactionLevelResponse;
  grnMultipleDiscount: DiscountTransactionLevelResponse;
  currentConfirmedDiscount: ConfirmTransactionLevelDiscountPayload;
  isLoadingAvailableDiscounts: boolean;
  availableEmployeeDiscounts: DiscountTransactionLevelResponse[];
  availableTsssDiscounts: DiscountTransactionLevelResponse[];
  availableTataEmployeeDiscounts: DiscountTransactionLevelResponse[];
  availableSystemDvDiscounts: DiscountTransactionLevelResponse[];
  availableEmpowermentDiscounts: DiscountTransactionLevelResponse[];
  isTransactionLevelDiscountApplied: boolean;
  appliedTransactionLevelDiscounts: DiscountsResponse[];
  discountState: string;
  isAllAppliedTransactionLevelDiscountDeleted: {
    isDeleted: boolean;
    discountType: string;
  };
  isSelectedTransactionLevelDiscountDeleted: boolean;
  isTransactionLevelDiscountUpdated: boolean;
  isTransactionLevelDiscountConfirmed: any;

  tataCompanyList: Lov[];
  refreshOffersAndDiscountsPanel: boolean;

  isEncircleDiscDetails: any;
  isClearEncircle: boolean;
  eligibileItemsResponseForKaratOrCoinOffer: any;
  appliedKaratorCoinOfferDiscountResponse: any;

  discountVoucherDetails: DiscountVoucherDetailsResponePayload;
  ABCOEligibilityRes:
    | {
        discountConfigDetails: DiscountConfigDetailsResponse[];
        clubbingId: string;
      }
    | string;
  ABCODiscountsRes: DiscountHeaders;
  ABCOConfigDetailsRes: DiscountHeadersDetails;
  newABCODiscountsRes: DiscountHeaders;
  ABCODiscountDetailsRes: {
    discountConfigDetails: DiscountConfigDetailsResponse[];
    clubbingId: string;
  };
  autoDiscountsRes: {
    response: {
      discountConfigDetails: DiscountConfigDetailsResponse[];
      clubbingId: string;
    };
    data: CashMemoItemDetailsResponse;
  };
  eligibleItemsResponseForGepPurityOffer: any;
  reloadDiscounts: boolean;
  orderDiscountDetails: CashMemoDetailsResponse;
  rivaahGHSDiscounts: RivaahGHSDiscounts;
  saveRivaahGHSDiscountsResponse: string[];
  enableCalculateRivaahGHSDiscounts: boolean;
  reasonForChangingDiscounts: Lov[];
  reasonForNotGivingDiscounts: Lov[];
  isExcludeSlabItemAdded: boolean;
}
