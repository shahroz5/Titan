import { createSelector, createFeatureSelector } from '@ngrx/store';
import { RevenueState, REVENUE_FEATURE_KEY } from './revenue.state';

export const selectRevenueState = createFeatureSelector<RevenueState>(
  REVENUE_FEATURE_KEY
);

const selectIsLoading = createSelector(
  selectRevenueState,
  state => state.isLoading
);

const selectDayWiseRevenueList = createSelector(
  selectRevenueState,
  state => state.revenueData
);

const selectTodayRevenueList = createSelector(
  selectRevenueState,
  state => state.todayRevenue
);

const selectGhsRevenueList = createSelector(
  selectRevenueState,
  state => state.ghsRevenue
);

const selectServiceRevenueList = createSelector(
  selectRevenueState,
  state => state.serviceRevenue
);

const selectError = createSelector(selectRevenueState, state => state.error);

export const RevenueSelectors = {
  selectError,
  selectIsLoading,
  selectDayWiseRevenueList,
  selectTodayRevenueList,
  selectGhsRevenueList,
  selectServiceRevenueList
};
