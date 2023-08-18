import { createFeatureSelector, createSelector } from '@ngrx/store';
import { passwordConfigFeatureKey } from './password-config.reducer';
import { PasswordConfigState } from './password-config.state';

export const selectPasswordConfigState = createFeatureSelector<
  PasswordConfigState
>(passwordConfigFeatureKey);

const selectHasError = createSelector(
  selectPasswordConfigState,
  state => state.hasError
);

const selectIsLoading = createSelector(
  selectPasswordConfigState,
  state => state.isLoading
);

const selectLocationCodes = createSelector(
  selectPasswordConfigState,
  state => state.locationCodes
);

const selectDocumentTypes = createSelector(
  selectPasswordConfigState,
  state => state.documentTypes
);

const selectGenerateBoutiquePasswordResponseForManualBill = createSelector(
  selectPasswordConfigState,
  state => state.generateBoutiquePasswordResponseForManualBill
);

const selectGenerateBoutiquePasswordResponseForGoldRate = createSelector(
  selectPasswordConfigState,
  state => state.generateBoutiquePasswordResponseForGoldRate
);

const selectGenerateCashDepositPasswordResponse = createSelector(
  selectPasswordConfigState,
  state => state.generateCashDepostPasswordResponse
);

const selectMaterialPrices = createSelector(
  selectPasswordConfigState,
  state => state.materialPrices
);

export const passwordConfigSelectors = {
  selectHasError,
  selectIsLoading,
  selectLocationCodes,
  selectDocumentTypes,
  selectGenerateBoutiquePasswordResponseForManualBill,
  selectGenerateBoutiquePasswordResponseForGoldRate,
  selectGenerateCashDepositPasswordResponse,
  selectMaterialPrices
};
