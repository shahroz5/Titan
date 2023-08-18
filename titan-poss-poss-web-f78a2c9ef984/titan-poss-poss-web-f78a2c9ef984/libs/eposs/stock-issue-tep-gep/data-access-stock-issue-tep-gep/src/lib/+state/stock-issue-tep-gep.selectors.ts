import { createSelector } from '@ngrx/store';

import { selectIssueTEPGEPState } from './stock-issue-tep-gep.reducers';
import {
  itemsSelector,
  stockIssueItemsSelector
} from './stock-issue-tep-gep.entity';

const selectCreateStockIssueResponse = createSelector(
  selectIssueTEPGEPState,
  state => state.createStockIssueResponse
);

const selectSelectedStockIssueResponse = createSelector(
  selectIssueTEPGEPState,
  state => state.selectedStockIssueResponse
);

const selectUpdateStockIssueResponse = createSelector(
  selectIssueTEPGEPState,
  state => state.updateStockIssueResponse
);

export const items = createSelector(
  selectIssueTEPGEPState,
  state => state.items
);

const selectItems = createSelector(items, itemsSelector.selectAll);

const selectUpdateAllStockIssueItemsResponse = createSelector(
  selectIssueTEPGEPState,
  state => state.updateAllStockIssueItemsResponse
);

const selectCreateStockIssueItemsResponse = createSelector(
  selectIssueTEPGEPState,
  state => state.createStockIssueItemsResponse
);

export const stockIssueItems = createSelector(
  selectIssueTEPGEPState,
  state => state.stockIssueItems
);

const selectStockIssueItems = createSelector(
  stockIssueItems,
  stockIssueItemsSelector.selectAll
);

const selectHasError = createSelector(
  selectIssueTEPGEPState,
  state => state.hasError
);

const selectIsLoading = createSelector(
  selectIssueTEPGEPState,
  state => state.isLoading
);

const selectTotalItemsCount = createSelector(
  selectIssueTEPGEPState,
  state => state.totalItemsCount
);

const selectTotalStockIssueItemsCount = createSelector(
  selectIssueTEPGEPState,
  state => state.totalStockIssueItemsCount
);

const selectFactoryAddress = createSelector(
  selectIssueTEPGEPState,
  state => state.factoryAddress
);
const selectCFAAddress = createSelector(
  selectIssueTEPGEPState,
  state => state.cfaAddress
);
const selectProductCategories = createSelector(
  selectIssueTEPGEPState,
  state => state.productCategories
);

const selectProductGroups = createSelector(
  selectIssueTEPGEPState,
  state => state.productGroups
);

const selectCourierDetails = createSelector(
  selectIssueTEPGEPState,
  state => state.courierDetails
);

const selectLocationCode = createSelector(
  selectIssueTEPGEPState,
  state => state.LocationCode
);

const selectEmployeeCodes = createSelector(
  selectIssueTEPGEPState,
  state => state.employeeCodes
);

const selectEmployeeDetails = createSelector(
  selectIssueTEPGEPState,
  state => state.employeeDetails
);

const selectSortDataItems = createSelector(
  selectIssueTEPGEPState,
  state => state.sortDataItems
);

const selectSortDataStockIssueItems = createSelector(
  selectIssueTEPGEPState,
  state => state.sortDataStockIssueItems
);

const selectFilterDataItems = createSelector(
  selectIssueTEPGEPState,
  state => state.filterDataItems
);

const selectFilterDataStockIssueItems = createSelector(
  selectIssueTEPGEPState,
  state => state.filterDataStockIssueItems
);

const selectIsCourierDetailsLoading = createSelector(
  selectIssueTEPGEPState,
  state => state.isCourierDetailsLoading
);

const selectIsFactoryAddressLoading = createSelector(
  selectIssueTEPGEPState,
  state => state.isFactoryAddressLoading
);

const selectIsEmployeeCodesLoading = createSelector(
  selectIssueTEPGEPState,
  state => state.isEmployeeCodesLoading
);

const selectIsProductCategoriesLoading = createSelector(
  selectIssueTEPGEPState,
  state => state.isProductCategoriesLoading
);

const selectIsProductGroupsLoading = createSelector(
  selectIssueTEPGEPState,
  state => state.isProductGroupsLoading
);

// Image
export const selectIsLoadingImage = createSelector(
  selectIssueTEPGEPState,
  state => state.isLoadingImage
);

export const issueTEPSelectors = {
  selectCreateStockIssueResponse,
  selectUpdateStockIssueResponse,
  selectItems,
  selectUpdateAllStockIssueItemsResponse,
  selectCreateStockIssueItemsResponse,
  selectStockIssueItems,
  selectHasError,
  selectIsLoading,
  selectTotalItemsCount,
  selectTotalStockIssueItemsCount,
  selectFactoryAddress,
  selectCFAAddress,
  selectProductCategories,
  selectProductGroups,
  selectCourierDetails,
  selectLocationCode,
  selectEmployeeCodes,
  selectEmployeeDetails,
  selectSortDataItems,
  selectSortDataStockIssueItems,
  selectFilterDataItems,
  selectFilterDataStockIssueItems,
  selectIsCourierDetailsLoading,
  selectIsFactoryAddressLoading,
  selectIsEmployeeCodesLoading,
  selectIsProductCategoriesLoading,
  selectIsProductGroupsLoading,
  selectIsLoadingImage,
  selectSelectedStockIssueResponse
};
