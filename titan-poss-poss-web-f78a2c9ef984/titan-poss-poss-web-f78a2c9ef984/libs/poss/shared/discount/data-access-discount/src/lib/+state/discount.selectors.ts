import { createSelector } from '@ngrx/store';
import { DiscountTypeEnum, StatusTypesEnum } from '@poss-web/shared/models';
import { selectDiscountState } from './discount.reducer';

const selectIsLoading = createSelector(
  selectDiscountState,
  state => state.isLoading
);

const selectIsAlreadyAddedDiscountsLoading = createSelector(
  selectDiscountState,
  state => state.isAlreadyAddedDiscountsLoading
);

const selectIsDiscountDetailsLoading = createSelector(
  selectDiscountState,
  state => state.isDiscountDetailsLoading
);

const selectIsDropdownLoading = createSelector(
  selectDiscountState,
  state => state.isDropdownLoading
);

const selectIsABDropdownLoading = createSelector(
  selectDiscountState,
  state => state.isABDropdownLoading
);

const selectIsAutoDiscLoading = createSelector(
  selectDiscountState,
  state => state.isAutoDiscLoading
);

const selectError = createSelector(selectDiscountState, state => state.error);

const selectItemLevelDiscounts = createSelector(
  selectDiscountState,
  state => state.itemLevelDiscounts
);

const selectItemLevelDiscountsDetails = createSelector(
  selectDiscountState,
  state => state.itemLevelDiscountsDetails
);

const selectGetItemLevelDiscountsRes = createSelector(
  selectDiscountState,
  state => state.getItemLevelDiscountsRes
);

const selectGetIsExcludeSlabItemAdded = createSelector(
  selectDiscountState,
  state => state.isExcludeSlabItemAdded
);

const selectSaveItemLevelDiscountsRes = createSelector(
  selectDiscountState,
  state => state.saveItemLevelDiscountsRes
);

const selectUpdateItemLevelDiscountsRes = createSelector(
  selectDiscountState,
  state => state.updateItemLevelDiscountsRes
);

const selectDeleteItemLevelDiscountsRes = createSelector(
  selectDiscountState,
  state => state.deleteItemLevelDiscountsRes
);

const selectPcDesc = createSelector(
  selectDiscountState,
  state => state.productCategoryDesc
);

const selectPgDesc = createSelector(
  selectDiscountState,
  state => state.productGroupDesc
);

const selectIsDescLoaded = createSelector(
  selectPcDesc,
  selectPgDesc,
  (pcDesc, pgDesc) => {
    if (pcDesc !== null && pgDesc !== null) {
      return true;
    } else {
      return false;
    }
  }
);

const selectDiscountTypes = createSelector(
  selectDiscountState,
  state => state.discountTypes
);

const selectTransactionLevelDiscounts = createSelector(
  selectDiscountState,
  state => state.transactionLevelDiscounts
);

const selectDigiGoldDiscounts = createSelector(
  selectDiscountState,
  state => state.digiDiscounts
);

const selectGrnMultipleDiscounts = createSelector(
  selectDiscountState,
  state => state.grnMultipleDiscount
);
const selectSystemDvDiscounts = createSelector(
  selectDiscountState,
  state => state.availableSystemDvDiscounts
);
const selectAvailableEmployeeDiscounts = createSelector(
  selectDiscountState,
  state => state.availableEmployeeDiscounts
);
const selectAvailableTsssDiscounts = createSelector(
  selectDiscountState,
  state => state.availableTsssDiscounts
);
const selectAvailableTataEmployeeDiscounts = createSelector(
  selectDiscountState,
  state => state.availableTataEmployeeDiscounts
);
const selectAvailableEmpowermentDiscounts = createSelector(
  selectDiscountState,
  state => state.availableEmpowermentDiscounts
);
const selectIsLoadingAvailableDiscounts = createSelector(
  selectDiscountState,
  state => state.isLoadingAvailableDiscounts
);
const selectIsTransactionLevelDiscountsApplied = createSelector(
  selectDiscountState,
  state => state.isTransactionLevelDiscountApplied
);
const selectAppliedTransactionLevelDiscounts = createSelector(
  selectDiscountState,
  state => state.appliedTransactionLevelDiscounts
);

const selectCurrentdiscountState = createSelector(
  selectDiscountState,
  state => state.discountState
);

const selectAppliedTransactionLevelDiscountsBykey = (key: string) =>
  createSelector(selectDiscountState, state =>
    state.appliedTransactionLevelDiscounts.filter(
      data =>
        data.discountType === key && data.status !== StatusTypesEnum.CONFIRMED
    )
  );
const selectAppliedBillLevelTransactionLevelDiscounts = createSelector(
  selectDiscountState,
  state =>
    state.appliedTransactionLevelDiscounts.filter(
      data => data.discountType === DiscountTypeEnum.BILL_LEVEL_DISCOUNT
    )
);
const selectAppliedEmployeeDiscounts = createSelector(
  selectDiscountState,
  state =>
    state.appliedTransactionLevelDiscounts.filter(
      data => data.discountType === DiscountTypeEnum.EMPLOYEE_DISCOUNT
    )
);
const selectAppliedTsssDiscounts = createSelector(selectDiscountState, state =>
  state.appliedTransactionLevelDiscounts.filter(
    data => data.discountType === DiscountTypeEnum.TSSS_DISCOUNT
  )
);
const selectAppliedTataEmployeeDiscounts = createSelector(
  selectDiscountState,
  state =>
    state.appliedTransactionLevelDiscounts.filter(
      data => data.discountType === DiscountTypeEnum.TATA_EMPLOYEE_DISCOUNT
    )
);
const selectAppliedSystemDvDiscounts = createSelector(
  selectDiscountState,
  state =>
    state.appliedTransactionLevelDiscounts.filter(
      data => data.discountType === DiscountTypeEnum.SYSTEM_DISCOUNT_DV
    )
);
const selectAppliedSystemGhsBonusDiscounts = createSelector(
  selectDiscountState,
  state =>
    state.appliedTransactionLevelDiscounts.filter(
      data => data.discountType === DiscountTypeEnum.SYSTEM_DISCOUNT_GHS_BONUS
    )
);
const selectAppliedEmpowermentDiscounts = createSelector(
  selectDiscountState,
  state =>
    state.appliedTransactionLevelDiscounts.filter(
      data => data.discountType === DiscountTypeEnum.EMPOWERMENT_DISCOUNT
    )
);
const selectIsAllAppliedTransactionLevelDiscountsRemoved = createSelector(
  selectDiscountState,
  state => state.isAllAppliedTransactionLevelDiscountDeleted
);
const selectIsSelectedTransactionLevelDiscountRemoved = createSelector(
  selectDiscountState,
  state => state.isSelectedTransactionLevelDiscountDeleted
);

const selectCurrentDeletedDiscount = createSelector(
  selectDiscountState,
  state => state.currentDeleteDiscount
);
const selectCurrentConfirmedDiscount = createSelector(
  selectDiscountState,
  state => state.currentConfirmedDiscount
);

const selectIsTransactionLevelDiscountUpdated = createSelector(
  selectDiscountState,
  state => state.isTransactionLevelDiscountUpdated
);
const selectIsRsoSelected = createSelector(
  selectDiscountState,
  state => state.isRsoSelected
);
const selectIsTransactionLevelDiscountConfirmed = createSelector(
  selectDiscountState,
  state => state.isTransactionLevelDiscountConfirmed
);

const selectIsEncircleDiscDetails = createSelector(
  selectDiscountState,
  state => state.isEncircleDiscDetails
);
const selectTataCompanyList = createSelector(
  selectDiscountState,
  state => state.tataCompanyList
);

const selectEligibleItemsResponseForKaratOrCoinOffer = createSelector(
  selectDiscountState,
  state => state.eligibileItemsResponseForKaratOrCoinOffer
);

const selectEligibleItemsResponseForGepPurityOffer = createSelector(
  selectDiscountState,
  state => state.eligibleItemsResponseForGepPurityOffer
);

const selectAppliedKaratorCoinOfferDiscountResponse = createSelector(
  selectDiscountState,
  state => state.appliedKaratorCoinOfferDiscountResponse
);
const selectDiscountVoucherDetails = createSelector(
  selectDiscountState,
  state => {
    return state.discountVoucherDetails;
  }
);
const selectRefreshDiscountsAndOffersPanel = createSelector(
  selectDiscountState,
  state => state.refreshOffersAndDiscountsPanel
);
const selectCheckABCOEligibilityRes = createSelector(
  selectDiscountState,
  state => state.ABCOEligibilityRes
);
const selectLoadABCODiscountsRes = createSelector(
  selectDiscountState,
  state => state.ABCODiscountsRes
);
const selectLoadNewABCODiscountsRes = createSelector(
  selectDiscountState,
  state => state.newABCODiscountsRes
);
const selectLoadABCODiscountDetailsRes = createSelector(
  selectDiscountState,
  state => state.ABCODiscountDetailsRes
);
const selectLoadABCOConfigDetailsRes = createSelector(
  selectDiscountState,
  state => state.ABCOConfigDetailsRes
);
const selectLoadAutoDiscountsRes = createSelector(
  selectDiscountState,
  state => state.autoDiscountsRes
);
const selectClearEncircleRes = createSelector(
  selectDiscountState,
  state => state.isClearEncircle
);
const selectReloadDiscountGrid = createSelector(
  selectDiscountState,
  state => state.reloadDiscounts
);
const selectOrderDiscDetails = createSelector(
  selectDiscountState,
  state => state.orderDiscountDetails
);
const selectRivaahGHSDiscounts = createSelector(
  selectDiscountState,
  state => state.rivaahGHSDiscounts
);
const selectSaveRivaahGHSDiscountsResponse = createSelector(
  selectDiscountState,
  state => state.saveRivaahGHSDiscountsResponse
);
const selectEnableCalculateRivaahGHSDiscounts = createSelector(
  selectDiscountState,
  state => state.enableCalculateRivaahGHSDiscounts
);
const selectReasonForChangingDiscounts = createSelector(
  selectDiscountState,
  state => state.reasonForChangingDiscounts
);
const selectReasonForNotGivingDiscounts = createSelector(
  selectDiscountState,
  state => state.reasonForNotGivingDiscounts
);
export const DiscountSelectors = {
  selectIsLoading,
  selectError,
  selectItemLevelDiscounts,
  selectItemLevelDiscountsDetails,
  selectGetItemLevelDiscountsRes,
  selectSaveItemLevelDiscountsRes,
  selectUpdateItemLevelDiscountsRes,
  selectDeleteItemLevelDiscountsRes,
  selectDiscountTypes,
  selectPcDesc,
  selectPgDesc,
  selectIsDescLoaded,
  selectTransactionLevelDiscounts,
  selectSystemDvDiscounts,
  selectAvailableEmployeeDiscounts,
  selectAvailableTsssDiscounts,
  selectAvailableTataEmployeeDiscounts,
  selectAvailableEmpowermentDiscounts,
  selectIsLoadingAvailableDiscounts,
  selectIsTransactionLevelDiscountsApplied,
  selectAppliedTransactionLevelDiscounts,
  selectAppliedBillLevelTransactionLevelDiscounts,
  selectAppliedEmployeeDiscounts,
  selectAppliedTsssDiscounts,
  selectAppliedTataEmployeeDiscounts,
  selectAppliedSystemDvDiscounts,
  selectAppliedSystemGhsBonusDiscounts,
  selectAppliedEmpowermentDiscounts,
  selectIsAllAppliedTransactionLevelDiscountsRemoved,
  selectIsSelectedTransactionLevelDiscountRemoved,
  selectIsTransactionLevelDiscountUpdated,
  selectIsRsoSelected,
  selectIsTransactionLevelDiscountConfirmed,
  selectIsEncircleDiscDetails,
  selectTataCompanyList,
  selectEligibleItemsResponseForKaratOrCoinOffer,
  selectAppliedKaratorCoinOfferDiscountResponse,
  selectDiscountVoucherDetails,
  selectRefreshDiscountsAndOffersPanel,
  selectIsAlreadyAddedDiscountsLoading,
  selectIsDiscountDetailsLoading,
  selectIsDropdownLoading,
  selectCheckABCOEligibilityRes,
  selectLoadABCODiscountsRes,
  selectLoadNewABCODiscountsRes,
  selectLoadABCODiscountDetailsRes,
  selectLoadABCOConfigDetailsRes,
  selectLoadAutoDiscountsRes,
  selectIsABDropdownLoading,
  selectIsAutoDiscLoading,
  selectCurrentDeletedDiscount,
  selectDigiGoldDiscounts,
  selectCurrentConfirmedDiscount,
  selectCurrentdiscountState,
  selectEligibleItemsResponseForGepPurityOffer,
  selectAppliedTransactionLevelDiscountsBykey,
  selectClearEncircleRes,
  selectReloadDiscountGrid,
  selectOrderDiscDetails,
  selectRivaahGHSDiscounts,
  selectSaveRivaahGHSDiscountsResponse,
  selectEnableCalculateRivaahGHSDiscounts,
  selectReasonForChangingDiscounts,
  selectReasonForNotGivingDiscounts,
  selectGrnMultipleDiscounts,
  selectGetIsExcludeSlabItemAdded
};
