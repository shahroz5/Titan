import { createSelector } from '@ngrx/store';
import { selectRivaahConfigurationState } from './rivaah-configuration.reducer';

const selectIsloading = createSelector(
  selectRivaahConfigurationState,
  state => state.isLoading
);

const selectHasUpdated = createSelector(
  selectRivaahConfigurationState,
  state => state.hasUpdated
);

const selectError = createSelector(
  selectRivaahConfigurationState,
  state => state.error
);

const selectIsCouponSaved = createSelector(
  selectRivaahConfigurationState,
  state => state.isCouponSaved
);

const selectCouponConfig = createSelector(
  selectRivaahConfigurationState,
  state => state.couponConfig
);

const selectTotalElements = createSelector(
  selectRivaahConfigurationState,
  state => state.totalElements
);

const selectisRivaElibilityCreated = createSelector(
  selectRivaahConfigurationState,
  state => state.isRivaElibilityCreated
);

const selectisRivaElibilityUpdated = createSelector(
  selectRivaahConfigurationState,
  state => state.isRivaElibilityUpdated
);

const selectisRivaElibilityDeleted = createSelector(
  selectRivaahConfigurationState,
  state => state.isRivaElibilityDeleted
);

const selectisRivaElibilityToggled = createSelector(
  selectRivaahConfigurationState,
  state => state.isRivaElibilityToggled
);

const selectRivaahEligibilityConfig = createSelector(
  selectRivaahConfigurationState,
  state => state.rivaahEligibilityRes
);

const selectProductGroups = createSelector(
  selectRivaahConfigurationState,
  state => state.productGroups
);

const selectHasProductsUpdated = createSelector(
  selectRivaahConfigurationState,
  state => state.hasProductsUpdated
);

const selectProductCategory = createSelector(
  selectRivaahConfigurationState,
  state => state.productCategory
);

const selectMappedProductCategory = createSelector(
  selectRivaahConfigurationState,
  state => state.mappedProductCategory
)
const selectSavedLocations = createSelector(
  selectRivaahConfigurationState,
  state => state.savedLocations
);
const selectUpdatedLocations = createSelector(
  selectRivaahConfigurationState,
  state => state.updatedLocations
);
const selectDeletedLocations = createSelector(
  selectRivaahConfigurationState,
  state => state.deletedLocations
);

const selectLocationCount = createSelector(
  selectRivaahConfigurationState,
  state => state.locationCount
);

const selectRivaahLocations = createSelector(
  selectRivaahConfigurationState,
  state => state.rivaahLocations
);

const selectMappedLocations = createSelector(
  selectRivaahConfigurationState,
  state => state.selectedLocations
);

export const RivaahConfigurationSelectors = {
  selectIsloading,
  selectHasUpdated,
  selectError,
  selectCouponConfig,
  selectRivaahEligibilityConfig,
  selectisRivaElibilityCreated,
  selectisRivaElibilityUpdated,
  selectisRivaElibilityDeleted,
  selectisRivaElibilityToggled,
  selectTotalElements,
  selectIsCouponSaved,
  selectProductGroups,
  selectHasProductsUpdated,
  selectProductCategory,
  selectMappedProductCategory,
  selectSavedLocations,
  selectUpdatedLocations,
  selectDeletedLocations,
  selectLocationCount,
  selectRivaahLocations,
  selectMappedLocations
};
