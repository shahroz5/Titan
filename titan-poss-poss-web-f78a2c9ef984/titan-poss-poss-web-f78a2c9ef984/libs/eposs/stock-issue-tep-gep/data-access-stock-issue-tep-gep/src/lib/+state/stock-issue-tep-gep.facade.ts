import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import * as IssueTEPActions from './stock-issue-tep-gep.action';
import { issueTEPSelectors } from './stock-issue-tep-gep.selectors';
import {
  Column,
  Filter,
  CreateStockIssuePayload,
  UpdateStockIssuePayload,
  LoadStockIssueItemsPayload,
  CreateStockIssueItemsPayload,
  LoadStockIssueItemsCountPayload,
  ImageReqPayload
} from '@poss-web/shared/models';
import { IssueTEPState } from './stock-issue-tep-gep.state';

@Injectable()
export class IssueTEPFacade {
  constructor(private store: Store<IssueTEPState>) {}
  private createStockIssueResponse$ = this.store.select(
    issueTEPSelectors.selectCreateStockIssueResponse
  );

  private updateStockIssueResponse$ = this.store.select(
    issueTEPSelectors.selectUpdateStockIssueResponse
  );

  private getItems$ = this.store.select(issueTEPSelectors.selectItems);

  private updateAllStockIssueItemsResponse$ = this.store.select(
    issueTEPSelectors.selectUpdateAllStockIssueItemsResponse
  );

  private createStockIssueItemsResponse$ = this.store.select(
    issueTEPSelectors.selectCreateStockIssueItemsResponse
  );

  private getStockIssueItems$ = this.store.select(
    issueTEPSelectors.selectStockIssueItems
  );

  private hasError$ = this.store.select(issueTEPSelectors.selectHasError);

  private isLoading$ = this.store.select(issueTEPSelectors.selectIsLoading);

  private totalItemsCount$ = this.store.select(
    issueTEPSelectors.selectTotalItemsCount
  );

  private totalStockIssueItemsCount$ = this.store.select(
    issueTEPSelectors.selectTotalStockIssueItemsCount
  );

  private factoryAddress$ = this.store.select(
    issueTEPSelectors.selectFactoryAddress
  );

  private cfaAddress$ = this.store.select(issueTEPSelectors.selectCFAAddress);

  private productCategories$ = this.store.select(
    issueTEPSelectors.selectProductCategories
  );

  private productGroups$ = this.store.select(
    issueTEPSelectors.selectProductGroups
  );

  private courierDetails$ = this.store.select(
    issueTEPSelectors.selectCourierDetails
  );

  private loadLocationCode$ = this.store.select(
    issueTEPSelectors.selectLocationCode
  );

  private employeeCodes$ = this.store.select(
    issueTEPSelectors.selectEmployeeCodes
  );

  private employeeDetails$ = this.store.select(
    issueTEPSelectors.selectEmployeeDetails
  );

  private sortDataItems$ = this.store.select(
    issueTEPSelectors.selectSortDataItems
  );

  private sortDataStockIssueItems$ = this.store.select(
    issueTEPSelectors.selectSortDataStockIssueItems
  );

  private filterDataItems$ = this.store.select(
    issueTEPSelectors.selectFilterDataItems
  );

  private filterDataStockIssueItems$ = this.store.select(
    issueTEPSelectors.selectFilterDataStockIssueItems
  );

  private isCourierDetailsLoading$ = this.store.select(
    issueTEPSelectors.selectIsCourierDetailsLoading
  );

  private isFactoryAddressLoading$ = this.store.select(
    issueTEPSelectors.selectIsFactoryAddressLoading
  );

  private isEmployeeCodesLoading$ = this.store.select(
    issueTEPSelectors.selectIsEmployeeCodesLoading
  );

  private isProductCategoriesLoading$ = this.store.select(
    issueTEPSelectors.selectIsProductCategoriesLoading
  );

  private isProductGroupsLoading$ = this.store.select(
    issueTEPSelectors.selectIsProductGroupsLoading
  );

  // Image
  private isLoadingImage$ = this.store.select(
    issueTEPSelectors.selectIsLoadingImage
  );

  private selectedStockIssueResponse$ = this.store.select(
    issueTEPSelectors.selectSelectedStockIssueResponse
  );

  createStockIssue(createStockIssuePayload: CreateStockIssuePayload) {
    this.store.dispatch(
      new IssueTEPActions.CreateStockIssue(createStockIssuePayload)
    );
  }

  getCreateStockIssueResponse() {
    return this.createStockIssueResponse$;
  }

  loadSelectedStockIssue(createStockIssuePayload: CreateStockIssuePayload) {
    this.store.dispatch(
      new IssueTEPActions.LoadSelectedStockIssue(createStockIssuePayload)
    );
  }

  getSelectedStockIssueResponse() {
    return this.selectedStockIssueResponse$;
  }

  updateStockIssue(updateStockIssuePayload: UpdateStockIssuePayload) {
    this.store.dispatch(
      new IssueTEPActions.UpdateStockIssue(updateStockIssuePayload)
    );
  }

  getUpdateStockIssueResponse() {
    return this.updateStockIssueResponse$;
  }

  loadItems(loadStockIssueItemsPayload: LoadStockIssueItemsPayload) {
    this.store.dispatch(
      new IssueTEPActions.LoadItems(loadStockIssueItemsPayload)
    );
  }

  getItems() {
    return this.getItems$;
  }

  updateAllStockIssueItems(
    updateAllStockIssueItemsPayload: CreateStockIssueItemsPayload
  ) {
    this.store.dispatch(
      new IssueTEPActions.UpdateAllStockIssueItems(
        updateAllStockIssueItemsPayload
      )
    );
  }

  getUpdateAllStockIssueItemsResponse() {
    return this.updateAllStockIssueItemsResponse$;
  }

  createStockIssueItems(
    createStockIssueItemsPayload: CreateStockIssueItemsPayload
  ) {
    this.store.dispatch(
      new IssueTEPActions.CreateStockIssueItems(createStockIssueItemsPayload)
    );
  }

  getCreateStockIssueItemsResponse() {
    return this.createStockIssueItemsResponse$;
  }

  loadStockIssueItems(loadStockIssueItemsPayload: LoadStockIssueItemsPayload) {
    this.store.dispatch(
      new IssueTEPActions.LoadStockIssueItems(loadStockIssueItemsPayload)
    );
  }

  getStockIssueItems() {
    return this.getStockIssueItems$;
  }

  searchClear() {
    this.store.dispatch(new IssueTEPActions.SearchClear());
  }

  resetList() {
    this.store.dispatch(new IssueTEPActions.ResetList());
  }

  resetResponse() {
    this.store.dispatch(new IssueTEPActions.ResetResponse());
  }

  resetAll() {
    this.store.dispatch(new IssueTEPActions.ResetAll());
  }

  getError() {
    return this.hasError$;
  }

  getIsLoading() {
    return this.isLoading$;
  }

  loadTotalItemsCount(
    loadStockIssueItemsCountPayload: LoadStockIssueItemsCountPayload
  ) {
    this.store.dispatch(
      new IssueTEPActions.LoadTotalItemsCount(loadStockIssueItemsCountPayload)
    );
  }

  getTotalItemsCount() {
    return this.totalItemsCount$;
  }

  loadTotalStockIssueItemsCount(
    loadStockIssueItemsCountPayload: LoadStockIssueItemsCountPayload
  ) {
    this.store.dispatch(
      new IssueTEPActions.LoadTotalStockIssueItemsCount(
        loadStockIssueItemsCountPayload
      )
    );
  }

  getTotalStockIssueItemsCount() {
    return this.totalStockIssueItemsCount$;
  }

  loadFactoryAddress() {
    this.store.dispatch(new IssueTEPActions.LoadFactoryAddress());
  }

  loadCFAAddress() {
    this.store.dispatch(new IssueTEPActions.LoadcfaAddress());
  }

  getFactoryAddress() {
    return this.factoryAddress$;
  }

  getcfaAddress() {
    return this.cfaAddress$;
  }

  loadProductCategories() {
    this.store.dispatch(new IssueTEPActions.LoadProductCategories());
  }

  getProductCategories() {
    return this.productCategories$;
  }

  loadProductGroups() {
    this.store.dispatch(new IssueTEPActions.LoadProductGroups());
  }

  getProductGroups() {
    return this.productGroups$;
  }

  loadCourierDetails(locationCode: string) {
    this.store.dispatch(new IssueTEPActions.LoadCourierDetails(locationCode));
  }

  getCourierDetails() {
    return this.courierDetails$;
  }

  loadLocationCode() {
    this.store.dispatch(new IssueTEPActions.LoadLocationCodes());
  }

  getLocationCode() {
    return this.loadLocationCode$;
  }
  loadEmployeeCodes() {
    this.store.dispatch(new IssueTEPActions.LoadEmployeeCodes());
  }

  getEmployeeCodes() {
    return this.employeeCodes$;
  }

  loadEmployeeDetails(employeeCode: string) {
    this.store.dispatch(new IssueTEPActions.LoadEmployeeDetails(employeeCode));
  }

  getEmployeeDetails() {
    return this.employeeDetails$;
  }

  setSortDataItems(sortData: Column[]) {
    this.store.dispatch(new IssueTEPActions.SetSortDataItems(sortData));
  }
  setSortDataStockIssueItems(sortData: Column[]) {
    this.store.dispatch(
      new IssueTEPActions.SetSortDataStockIssueItems(sortData)
    );
  }

  getSortDataItems() {
    return this.sortDataItems$;
  }
  getSortDataStockIssueItems() {
    return this.sortDataStockIssueItems$;
  }

  setFilterDataItems(filterData: { [key: string]: Filter[] }) {
    this.store.dispatch(new IssueTEPActions.SetFilterDataItems(filterData));
  }
  setFilterDataStockIssueItems(filterData: { [key: string]: Filter[] }) {
    this.store.dispatch(
      new IssueTEPActions.SetFilterDataStockIssueItems(filterData)
    );
  }

  // Image
  loadThumbnailImageUrl(payload: ImageReqPayload) {
    this.store.dispatch(new IssueTEPActions.LoadThumbnailImageUrl(payload));
  }
  loadImageUrl(payload: ImageReqPayload) {
    this.store.dispatch(new IssueTEPActions.LoadImageUrl(payload));
  }
  getfilterDataItems() {
    return this.filterDataItems$;
  }
  getfilterDataStockIssueItems() {
    return this.filterDataStockIssueItems$;
  }

  getIsCourierDetailsLoading() {
    return this.isCourierDetailsLoading$;
  }

  getIsFactoryAddressLoading() {
    return this.isFactoryAddressLoading$;
  }

  getIsEmployeeCodesLoading() {
    return this.isEmployeeCodesLoading$;
  }

  getIsProductCategoriesLoading() {
    return this.isProductCategoriesLoading$;
  }

  getIsProductGroupsLoading() {
    return this.isProductGroupsLoading$;
  }

  loadStuddedProductGroups() {
    this.store.dispatch(new IssueTEPActions.LoadStuddedProductGroups());
  }

  // Image
  getIsLoadingImage() {
    return this.isLoadingImage$;
  }
}
