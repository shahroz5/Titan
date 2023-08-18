import { createFeatureSelector, createSelector } from '@ngrx/store';
import { customerOrderFeatureKey } from './customer-order.reducer';
import { CustomerOrderState } from './customer-order.state';

export const selectCustomerOrderState = createFeatureSelector<
  CustomerOrderState
>(customerOrderFeatureKey);

const selectHasError = createSelector(
  selectCustomerOrderState,
  state => state.hasError
);

const selectIsLoading = createSelector(
  selectCustomerOrderState,
  state => state.isLoading
);

const selectFetchedCOItems = createSelector(
  selectCustomerOrderState,
  state => state.fetchedCOItems
);

const selectCreateCORes = createSelector(
  selectCustomerOrderState,
  state => state.createCORes
);

const selectViewCORes = createSelector(
  selectCustomerOrderState,
  state => state.viewCORes
);

const selectCOFrozenValue = createSelector(
  selectCustomerOrderState,
  state => state.frozenCOOrder
);

const selectMinCOFrozenAmount = createSelector(
  selectCustomerOrderState,
  state => state.frozenCOOrderAmount
);

const selectBestRate = createSelector(
  selectCustomerOrderState,
  state => state.bestRateCOOrder
);

const selectUpdateCORes = createSelector(
  selectCustomerOrderState,
  state => state.updateCORes
);

const selectPartialUpdateCORes = createSelector(
  selectCustomerOrderState,
  state => state.partialUpdateCORes
);

const selectDeleteCORes = createSelector(
  selectCustomerOrderState,
  state => state.deleteCoRes
);

const selectMinCOValue = createSelector(
  selectCustomerOrderState,
  state => state.minCOvalue
);

const selectRelationshipTypes = createSelector(
  selectCustomerOrderState,
  state => state.relationshipTypes
);

export const customerOrderSelectors = {
  selectHasError,
  selectIsLoading,
  selectFetchedCOItems,
  selectCreateCORes,
  selectViewCORes,
  selectUpdateCORes,
  selectPartialUpdateCORes,
  selectDeleteCORes,
  selectMinCOValue,
  selectRelationshipTypes,
  selectCOFrozenValue,
  selectMinCOFrozenAmount,
  selectBestRate
};
