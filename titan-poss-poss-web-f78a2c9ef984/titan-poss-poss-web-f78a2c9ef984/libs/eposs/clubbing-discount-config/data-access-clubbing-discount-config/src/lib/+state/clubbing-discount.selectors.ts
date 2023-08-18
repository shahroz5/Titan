import { createSelector } from '@ngrx/store';
import { selectClubDiscountsState } from './clubbing-discount.reducer';
import { clubDiscountsSelector } from './clubbing-discount.entity';

export const selectIsLoading = createSelector(
  selectClubDiscountsState,
  state => state.isLoading
);
export const selectError = createSelector(
  selectClubDiscountsState,
  state => state.error
);
export const selectIsSaved = createSelector(
  selectClubDiscountsState,
  state => state.hasSaved
);
export const selectClubbedDiscountsListing = createSelector(
  selectClubDiscountsState,
  state => state.clubbedDiscountList
);
export const selectClubbedDiscountsList = createSelector(
  selectClubbedDiscountsListing,
  clubDiscountsSelector.selectAll
);
export const selectSaveClubbedDiscounts = createSelector(
  selectClubDiscountsState,
  state => state.saveclubbedDiscounts
);
export const selectTotalElements = createSelector(
  selectClubDiscountsState,
  state => state.totalCount
);

export const selectType1DiscountCodes = createSelector(
  selectClubDiscountsState,
  state => state.discountCodesType1
);
export const selectType2DiscountCodes = createSelector(
  selectClubDiscountsState,
  state => state.discountCodesType2
);
export const selectType3DiscountCodes = createSelector(
  selectClubDiscountsState,
  state => state.discountCodesType3
);
export const ClubDiscountsSelectors = {
  selectIsLoading,
  selectIsSaved,
  selectError,
  selectSaveClubbedDiscounts,
  selectTotalElements,
  selectClubbedDiscountsList,
  selectType1DiscountCodes,
  selectType2DiscountCodes,
  selectType3DiscountCodes
};
