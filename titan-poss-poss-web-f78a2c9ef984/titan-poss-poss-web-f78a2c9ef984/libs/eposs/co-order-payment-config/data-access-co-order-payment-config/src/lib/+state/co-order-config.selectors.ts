import { createSelector } from '@ngrx/store';
import { selectCoOrderPaymentConfigState } from './co-order-config.reducer';

const selectCoOrderPaymentConfigList = createSelector(
  selectCoOrderPaymentConfigState,
  state => state.orderConfigList
);

const selectCoOrderPaymentConfig = createSelector(
  selectCoOrderPaymentConfigState,
  state => state.orderConfig
);

const selectError = createSelector(
  selectCoOrderPaymentConfigState,
  state => state.error
);
const selectIsLoading = createSelector(
  selectCoOrderPaymentConfigState,
  state => state.isLoading
);
const selectHassaved = createSelector(
  selectCoOrderPaymentConfigState,
  state => state.hasSaved
);
const selectIsUpdated = createSelector(
  selectCoOrderPaymentConfigState,
  state => state.IsUpdated
);
const selectTotalElement = createSelector(
  selectCoOrderPaymentConfigState,
  state => state.totalElements
);
const selectProductGroups = createSelector(
  selectCoOrderPaymentConfigState,
  state => state.productGroups
);
const selectConfigId = createSelector(
  selectCoOrderPaymentConfigState,
  state => state.configId
);
const selectIsCleared = createSelector(
  selectCoOrderPaymentConfigState,
  state => state.isCleared
);
const selectCoOrderPaymentConfigDetails = createSelector(
  selectCoOrderPaymentConfigState,
  state => state.orderPaymentConfigDetails
);
const selectRuleDetailsCount = createSelector(
  selectCoOrderPaymentConfigState,
  state => state.ruleDetailsCount
);
const selectAllRuleDetails = createSelector(
  selectCoOrderPaymentConfigState,
  state => state.allCoOrderPaymentConfigDetails
);
const selectUniqueNameCheckCount = createSelector(
  selectCoOrderPaymentConfigState,
  state => state.uniqueNameCheckCount
);

export const selectCoOrderPaymentConfigSelectors = {
  selectCoOrderPaymentConfigList,
  selectCoOrderPaymentConfig,
  selectError,
  selectIsUpdated,
  selectHassaved,
  selectIsLoading,
  selectTotalElement,
  selectProductGroups,
  selectConfigId,
  selectIsCleared,
  selectCoOrderPaymentConfigDetails,
  selectRuleDetailsCount,
  selectAllRuleDetails,
  selectUniqueNameCheckCount
};
