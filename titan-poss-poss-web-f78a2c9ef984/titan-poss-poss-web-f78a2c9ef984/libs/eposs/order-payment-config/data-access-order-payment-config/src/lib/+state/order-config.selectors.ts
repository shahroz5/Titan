import { createSelector } from '@ngrx/store';
import { selectOrderPaymentConfigState } from './order-config.reducer';

const selectOrderPaymentConfigList = createSelector(
  selectOrderPaymentConfigState,
  state => state.orderConfigList
);

const selectOrderPaymentConfig = createSelector(
  selectOrderPaymentConfigState,
  state => state.orderConfig
);

const selectError = createSelector(
  selectOrderPaymentConfigState,
  state => state.error
);
const selectIsLoading = createSelector(
  selectOrderPaymentConfigState,
  state => state.isLoading
);
const selectHassaved = createSelector(
  selectOrderPaymentConfigState,
  state => state.hasSaved
);
const selectIsUpdated = createSelector(
  selectOrderPaymentConfigState,
  state => state.IsUpdated
);
const selectTotalElement = createSelector(
  selectOrderPaymentConfigState,
  state => state.totalElements
);
const selectProductGroups = createSelector(
  selectOrderPaymentConfigState,
  state => state.productGroups
);
const selectConfigId = createSelector(
  selectOrderPaymentConfigState,
  state => state.configId
);
const selectIsCleared = createSelector(
  selectOrderPaymentConfigState,
  state => state.isCleared
);
const selectOrderPaymentConfigDetails = createSelector(
  selectOrderPaymentConfigState,
  state => state.orderPaymentConfigDetails
);
const selectRuleDetailsCount = createSelector(
  selectOrderPaymentConfigState,
  state => state.ruleDetailsCount
);
const selectAllRuleDetails = createSelector(
  selectOrderPaymentConfigState,
  state => state.allOrderPaymentConfigDetails
);
const selectUniqueNameCheckCount = createSelector(
  selectOrderPaymentConfigState,
  state => state.uniqueNameCheckCount
);

export const selectOrderPaymentConfigSelectors = {
  selectOrderPaymentConfigList,
  selectOrderPaymentConfig,
  selectError,
  selectIsUpdated,
  selectHassaved,
  selectIsLoading,
  selectTotalElement,
  selectProductGroups,
  selectConfigId,
  selectIsCleared,
  selectOrderPaymentConfigDetails,
  selectRuleDetailsCount,
  selectAllRuleDetails,
  selectUniqueNameCheckCount,
};
