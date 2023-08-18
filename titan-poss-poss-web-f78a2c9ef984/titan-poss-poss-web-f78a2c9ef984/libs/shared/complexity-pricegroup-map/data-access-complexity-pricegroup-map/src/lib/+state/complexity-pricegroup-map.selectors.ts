import { createSelector } from '@ngrx/store';
import { selectComplexityPriceGroupState } from './complexity-pricegroup-map.reducer';

const selectComplexityPriceGroupDetailsListing = createSelector(
  selectComplexityPriceGroupState,
  state => state.complexityPricegroupListing
);


const selectTotalComplexityPriceGroupDetailsCount = createSelector(
  selectComplexityPriceGroupState,
  state => state.totalComplexityPricegroupDetails
);


const selectComplexityPriceGroupDetailsById = createSelector(
  selectComplexityPriceGroupState,
  state => state.complexityPricegroupDetails
);

const selectIsLoading = createSelector(
  selectComplexityPriceGroupState,
  state => state.isLoading
);

const selectError = createSelector(
  selectComplexityPriceGroupState,
  state => state.error
);

const selectSaveComplexityPriceGroupFormResponse = createSelector(
  selectComplexityPriceGroupState,
state => state.savecomplexityPricegroup
);

const selectEditComplexityPriceGroupFormResponse = createSelector(
  selectComplexityPriceGroupState,
state => state.editcomplexityPricegroup
);

const selectComplexityCode = createSelector(
  selectComplexityPriceGroupState,
  state => state.complexityCode
)

const selectPriceGroup = createSelector(
  selectComplexityPriceGroupState,
  state => state.pricegroup
)

const selectFileUploadSuccess = createSelector(
  selectComplexityPriceGroupState,
  state => state.isUploadSuccess
)
export const ComplexityPricegroupSelectors = {
  selectComplexityPriceGroupDetailsListing,
  selectTotalComplexityPriceGroupDetailsCount,
  selectComplexityPriceGroupDetailsById,
  selectIsLoading,
  selectError,
  selectSaveComplexityPriceGroupFormResponse,
  selectEditComplexityPriceGroupFormResponse,
  selectComplexityCode,
  selectPriceGroup,
  selectFileUploadSuccess
};
