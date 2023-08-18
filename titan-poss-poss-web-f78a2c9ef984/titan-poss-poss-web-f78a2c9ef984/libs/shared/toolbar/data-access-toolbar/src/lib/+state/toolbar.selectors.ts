import { createSelector } from '@ngrx/store';
import { selectToolbarState } from './toolbar.reducer';

const selectHasError = createSelector(
  selectToolbarState,
  state => state.hasError
);

const selectIsLoading = createSelector(
  selectToolbarState,
  state => state.isLoading
);

const selectMetalPriceDetails = createSelector(
  selectToolbarState,
  state => state.metalPriceDetails
);

const selectPreviousMetalPriceDetails = createSelector(
  selectToolbarState,
  state => state.previousMetalPriceDetails
);

const selectOpenOrdersResponse = createSelector(
  selectToolbarState,
  state => state.openOrdersResponse
);

const selectOpenOrdersCountResponse = createSelector(
  selectToolbarState,
  state => state.openOrdersCount
);

const selectOnHoldResponse = createSelector(
  selectToolbarState,
  state => state.onHoldResponse
);

const selectOnHoldCountResponse = createSelector(
  selectToolbarState,
  state => state.onHoldCount
);

const selectConfirmOrdersResponse = createSelector(
  selectToolbarState,
  state => state.confirmOrdersResponse
);

const selectToolbarConfig = createSelector(
  selectToolbarState,
  state => state.toolbarConfig
);

export const toolbarSelectors = {
  selectHasError,
  selectIsLoading,
  selectMetalPriceDetails,
  selectPreviousMetalPriceDetails,
  selectOpenOrdersResponse,
  selectOpenOrdersCountResponse,
  selectOnHoldResponse,
  selectOnHoldCountResponse,
  selectToolbarConfig,
  selectConfirmOrdersResponse
};
