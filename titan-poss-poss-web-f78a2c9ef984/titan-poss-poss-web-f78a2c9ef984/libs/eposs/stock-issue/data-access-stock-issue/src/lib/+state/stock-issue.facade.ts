import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { stockIssueSelectors } from './stock-issue.selector';
import * as StockIssueActions from './stock-issue.actions';
import { StockIssueState } from './stock-issue.state';
import { of } from 'rxjs';
import { combineAll, map } from 'rxjs/operators';
import {
  Filter,
  Column,
  UpdateAllItemPayload,
  UpdateItemPayload,
  ConfirmIssuePayload,
  LoadIssueItemsTotalCountPayload,
  LoadIssueItemPayload,
  LoadSelectedPayload,
  SearchPendingPayload,
  LoadPendingIssuePayload,
  UpdateItemListStatusPayload,
  LoadHistoryRequestPayload,
  LoadStockIssueHistoryItemsPayload,
  StockIssueSelectedHistoryPayload,
  IssueAdvanceFilterPayload,
  LoadCancelIssuesPayload,
  LoadCancelIssuesSTNPayload,
  LoadCancelIssuetemsPayload,
  ItemToleranceValidate,
  ImageReqPayload,
  RegenerateFilePayload
} from '@poss-web/shared/models';


@Injectable()
export class StockIssueFacade {
  constructor(private store: Store<StockIssueState>) {}

  private issueToFactorySTN$ = this.store.select(
    stockIssueSelectors.selectIssueToFactorySTN
  );

  private issueToBoutique$ = this.store.select(
    stockIssueSelectors.selectIssueToBoutiqueSTN
  );

  private issueToMerchant$ = this.store.select(
    stockIssueSelectors.selectIssuetoMerchantSTN
  );

  private selectedIssue$ = this.store.select(
    stockIssueSelectors.selectSelectedIssue
  );

  private selectHasSelectedssue$ = this.store.select(
    stockIssueSelectors.selectHasSelectedIssue
  );

  private error$ = this.store.select(stockIssueSelectors.selectError);

  private isLoadingIssueFactorySTN$ = this.store.select(
    stockIssueSelectors.selectIsLoadingIssueFactorySTN
  );
  private isLoadingIssueBoutiqueSTN$ = this.store.select(
    stockIssueSelectors.selectIsLoadingIssueBoutiqueSTN
  );
  private isLoadingIssueMerchantSTN$ = this.store.select(
    stockIssueSelectors.selectIsLoadingIssueMerchantSTN
  );

  private isSearchingIssues$ = this.store.select(
    stockIssueSelectors.selectIsSearchingIssues
  );
  private hasSearchSearchIssueResults$ = this.store.select(
    stockIssueSelectors.selectHasSearchIssueResults
  );

  private selectSearchIssueResults$ = this.store.select(
    stockIssueSelectors.selectSearchIssueResult
  );

  private approvedItemsTotalCount$ = this.store.select(
    stockIssueSelectors.selectApprovedItemsTotalCount
  );
  private selectedItemsTotalCount$ = this.store.select(
    stockIssueSelectors.selectSelectedItemsTotalCount
  );
  private isItemsTotalCountLoading$ = this.store.select(
    stockIssueSelectors.selectIsItemsTotalCountLoading
  );
  private isLoadingSelectedIssue$ = this.store.select(
    stockIssueSelectors.selectIsLoadingSelectedIssue
  );

  private approvedItems$ = this.store.select(
    stockIssueSelectors.selectApprovedItems
  );
  private isApprovedItemsLoading$ = this.store.select(
    stockIssueSelectors.selectIsApprovedItemsLoading
  );
  private selectedItems$ = this.store.select(
    stockIssueSelectors.selectSelectedItems
  );
  private isSelectedItemsLoading$ = this.store.select(
    stockIssueSelectors.selectIsSelectedItemsLoading
  );

  private issueItems$ = this.store.select(stockIssueSelectors.selectIssueItems);
  private isIssueItemsLoading$ = this.store.select(
    stockIssueSelectors.selectIsIssueItemsLoading
  );
  private issueItemsTotalCount$ = this.store.select(
    stockIssueSelectors.selectIssueItemsTotalCount
  );
  private issueItemsTotalCountLoaded$ = this.store.select(
    stockIssueSelectors.selectIssueItemsTotalCountLoaded
  );

  private issueConfirmStatus$ = this.store.select(
    stockIssueSelectors.selectConfirmIssueStatus
  );
  private issueConfirm$ = this.store.select(
    stockIssueSelectors.selectConfirmIssue
  );
  private confirmationDocNo$ = this.store.select(
    stockIssueSelectors.selectConfirmationSrcDocNo
  );

  // REQUEST COUNT
  private pendingBTQ_FAC_STNCount$ = this.store.select(
    stockIssueSelectors.selectPendingBTQ_FAC_STNCount
  );

  private pendingBTQ_BTQ_STNCount$ = this.store.select(
    stockIssueSelectors.selectPendingBTQ_BTQ_STNCount
  );
  private pendingBTQ_MER_STNCount$ = this.store.select(
    stockIssueSelectors.selectPendingBTQ_MER_STNCount
  );

  private isLoadingCount$ = this.store.select(
    stockIssueSelectors.selectIsLoadingIssueCount
  );
  private searchedItems$ = this.store.select(
    stockIssueSelectors.selectSearchedItems
  );
  private hasSearchedItems$ = this.store.select(
    stockIssueSelectors.selectHasSearchedItems
  );
  private isSearchingItems$ = this.store.select(
    stockIssueSelectors.selectIsSearchingItems
  );

  private selectIsUpdateAllItems$ = this.store.select(
    stockIssueSelectors.selectIsUpdatingAll
  );
  private selectIsUpdateAllItemsSuccess$ = this.store.select(
    stockIssueSelectors.selectIsUpdatingAllSuccess
  );

  private searchedIssueItemsTotalCount$ = this.store.select(
    stockIssueSelectors.selectSearchedIssueItemsCount
  );
  private searchIssueItemsTotalCountLoaded$ = this.store.select(
    stockIssueSelectors.selectSearchedissueItemsCountLoaded
  );

  private isItemUpdated$ = this.store.select(
    stockIssueSelectors.selectIsItemUpdateStatus
  );
  private isItemUpdating$ = this.store.select(
    stockIssueSelectors.selectIsItemUpdating
  );
  private courierDetails$ = this.store.select(
    stockIssueSelectors.selectCourierDetails
  );
  private isLoadingCourierDetails$ = this.store.select(
    stockIssueSelectors.selectIsLoadingCourierDetails
  );
  private hasCourierDetails$ = this.store.select(
    stockIssueSelectors.selectHasCourierDetails
  );

  private employeeCodes$ = this.store.select(
    stockIssueSelectors.selectEmployeeCodes
  );

  private employeeDetails$ = this.store.select(
    stockIssueSelectors.selectEmployeeDetails
  );

  private productCategories$ = this.store.select(
    stockIssueSelectors.selectProductCategories
  );

  private productGroups$ = this.store.select(
    stockIssueSelectors.selectProductGroups
  );

  private filterDataApprovedProducts$ = this.store.select(
    stockIssueSelectors.selectfilterDataApprovedProducts
  );

  private filterDataSelectedProducts$ = this.store.select(
    stockIssueSelectors.selectfilterDataSelectedProducts
  );
  private sortDataApprovedProducts$ = this.store.select(
    stockIssueSelectors.selectSortDataApprovedProducts
  );

  private sortDataSelectedProducts$ = this.store.select(
    stockIssueSelectors.selectSortDataSelectedProducts
  );

  private isItemsLoaded$ = this.store.select(
    stockIssueSelectors.selectIsItemsLoaded
  );
  private items$ = this.store.select(stockIssueSelectors.selectItems);
  private itemsLoading$ = this.store.select(
    stockIssueSelectors.selectIsItemsLoading
  );

  private itemsCount$ = this.store.select(stockIssueSelectors.selectItemsCount);

  private updateItemListStatusResponse$ = this.store.select(
    stockIssueSelectors.selectUpdateItemListStatusResponse
  );

  private totalMeasuredWeight$ = this.store.select(
    stockIssueSelectors.selectTotalMeasuredWeight
  );
  private totalMeasuredValue$ = this.store.select(
    stockIssueSelectors.selectTotalMeasuredValue
  );
  private isLoading$ = this.store.select(stockIssueSelectors.selectIsLoading);

  private issueHistory$ = this.store.select(
    stockIssueSelectors.selectIssueHistory
  );
  private isLoadingHistory$ = this.store.select(
    stockIssueSelectors.selectIsLoadingIssueHistory
  );
  private issueHistoryCount$ = this.store.select(
    stockIssueSelectors.selectIssueHistoryCount
  );
  private isLoadingSelectedHistory$ = this.store.select(
    stockIssueSelectors.selectIsLoadingSelectedHistory
  );
  private selectedHistory$ = this.store.select(
    stockIssueSelectors.selectSelectedHistory
  );
  private hasSelectedHistory$ = this.store.select(
    stockIssueSelectors.selectHasSelectedHistory
  );
  private isLoadingHistoryItems$ = this.store.select(
    stockIssueSelectors.selectIsLoadingHistoryItems
  );
  private historyItems$ = this.store.select(
    stockIssueSelectors.selectHistoryItems
  );
  private isHistoryItemsLoaded$ = this.store.select(
    stockIssueSelectors.selectIsHistoryItemsLoaded
  );
  // private historyItemsCount$ = this.store.select(
  //   stockIssueSelectors.selectHistoryItemsCount
  // );
  private historyItemsTotalCount$ = this.store.select(
    stockIssueSelectors.selectHistoryItemsTotalCount
  );
  private isLoadingHistoryItemsTotalCount$ = this.store.select(
    stockIssueSelectors.selectIsLoadingHistoryItemsTotalCount
  );

  private selectHistoryCount$ = this.store.select(
    stockIssueSelectors.selectHistoryCount
  );

  private selectAdavancedFilterData$ = this.store.select(
    stockIssueSelectors.selectAdvancedFilterData
  );

  // cancel STN

  private issueToBoutiqueCancelSTN$ = this.store.select(
    stockIssueSelectors.selectIssuetoBoutiqueCancelSTN
  );
  private totalIssueCancelSTNCount$ = this.store.select(
    stockIssueSelectors.selectTotalIssueCancelSTNCount
  );
  private isLoadingIssueBoutiqueSTNCancel$ = this.store.select(
    stockIssueSelectors.selectIsLoadingIssueBoutiqueCancelSTN
  );
  private pendingBTQ_BTQ_STNCancelCount$ = this.store.select(
    stockIssueSelectors.selectPendingBTQ_BTQ_STNCancelCount
  );
  private selectCancelIssueItems$ = this.store.select(
    stockIssueSelectors.selectCancelIssueItems
  );
  private selectCancelIssueItemsCount$ = this.store.select(
    stockIssueSelectors.selectCancelIssueItemsCount
  );
  private selectCancelIssueSTNDetails$ = this.store.select(
    stockIssueSelectors.selectCancelIssueSTNDetails
  );
  private selectCancelIssueSTNRes$ = this.store.select(
    stockIssueSelectors.selectCancelIssueSTNRes
  );
  private selectRegenerateFileRes$ = this.store.select(
    stockIssueSelectors.selectRegenerateFileRes
  );
  private selectIsFileLoading$ = this.store.select(
    stockIssueSelectors.selectIsFileLoading
  );

  // Image
  private isLoadingImage$ = this.store.select(
    stockIssueSelectors.selectIsLoadingImage
  );

  getBTQ_FAC_PendingSTN() {
    return this.issueToFactorySTN$;
  }

  getBTQ_BTQ_PendingSTN() {
    return this.issueToBoutique$;
  }
  getBTQ_MER_PendingSTN() {
    return this.issueToMerchant$;
  }

  getSearchIssueResult() {
    return this.selectSearchIssueResults$;
  }

  getIsSearchingIssues() {
    return this.isSearchingIssues$;
  }
  getHasSearchIssueResults() {
    return this.hasSearchSearchIssueResults$;
  }

  getError() {
    return this.error$;
  }
  getisLoadingIssueToFactory() {
    return this.isLoadingIssueFactorySTN$;
  }
  getisLoadingIssueToBoutique() {
    return this.isLoadingIssueBoutiqueSTN$;
  }
  getIsLoadingIssueToMerchant() {
    return this.isLoadingIssueMerchantSTN$;
  }

  getIsLoadingSelectedIssue() {
    return this.isLoadingSelectedIssue$;
  }
  getSelectedIssue() {
    return this.selectedIssue$;
  }
  getHasSelectedIssue() {
    return this.selectHasSelectedssue$;
  }

  getApprovedItemsTotalCount() {
    return this.approvedItemsTotalCount$;
  }

  getSelectedItemsTotalCount() {
    return this.selectedItemsTotalCount$;
  }

  getIsItemsTotalCountLoading() {
    return this.isItemsTotalCountLoading$;
  }

  getItemsTotalCountLoaded() {
    return this.issueItemsTotalCountLoaded$;
  }

  getApprovedItems() {
    return this.approvedItems$;
  }

  getSelectedItems() {
    return this.selectedItems$;
  }

  getIsApprovedItemsLoading() {
    return this.isApprovedItemsLoading$;
  }

  getIsSelectedItemsLoading() {
    return this.isSelectedItemsLoading$;
  }
  getSelectedIssueItems() {
    return this.issueItems$;
  }
  getIsIssueItemsLoading() {
    return this.isIssueItemsLoading$;
  }
  getIssueItemsTotalCount() {
    return this.issueItemsTotalCount$;
  }
  getIssueItemsTotalCountLoaded() {
    return this.issueItemsTotalCountLoaded$;
  }

  getIssueConfirmStatus() {
    return this.issueConfirmStatus$;
  }
  getIssueConfirm() {
    return this.issueConfirm$;
  }
  getConfirmationSrcDocNo() {
    return this.confirmationDocNo$;
  }
  getSearchedItems() {
    return this.searchedItems$;
  }
  getHasSearchedItems() {
    return this.hasSearchedItems$;
  }
  getIsSearchingItems() {
    return this.isSearchingItems$;
  }

  // REQUEST COUNT
  getPendingBTQ_BTQ_STNCount() {
    return this.pendingBTQ_BTQ_STNCount$;
  }
  getPendingBTQ_MER_STNCount() {
    return this.pendingBTQ_MER_STNCount$;
  }
  getPendingBTQ_FAC_STNCount() {
    return this.pendingBTQ_FAC_STNCount$;
  }

  getIsLoadingCount() {
    return this.isLoadingCount$;
  }

  getPendingIssueSTNCount() {
    const source = of(
      this.pendingBTQ_BTQ_STNCount$,
      this.pendingBTQ_FAC_STNCount$,
      this.pendingBTQ_MER_STNCount$
    );
    return source.pipe(
      combineAll(),
      map(numbers => numbers.reduce((sum, n) => sum + n, 0))
    );
  }

  getSearchedIssueItemsCount() {
    return this.searchedIssueItemsTotalCount$;
  }
  getSearchedIssueItemsCountLoaded() {
    return this.searchIssueItemsTotalCountLoaded$;
  }
  getItemUpdateStatus() {
    return this.isItemUpdated$;
  }
  getIsItemUpdating() {
    return this.isItemUpdating$;
  }

  getIsUpdateAllItems() {
    return this.selectIsUpdateAllItems$;
  }
  getselectIsUpdateAllItemsSuccess() {
    return this.selectIsUpdateAllItemsSuccess$;
  }
  getCourierDetails() {
    return this.courierDetails$;
  }
  getIsLoadingCourierDetails() {
    return this.isLoadingCourierDetails$;
  }
  getHasCourierDetails() {
    return this.hasCourierDetails$;
  }
  getHistoryCount() {
    return this.selectHistoryCount$;
  }

  loadEmployeeCodes() {
    this.store.dispatch(new StockIssueActions.LoadEmployeeCodes());
  }

  getEmployeeCodes() {
    return this.employeeCodes$;
  }

  loadEmployeeDetails(employeeCode: string) {
    this.store.dispatch(
      new StockIssueActions.LoadEmployeeDetails(employeeCode)
    );
  }

  getEmployeeDetails() {
    return this.employeeDetails$;
  }

  loadProductCategories() {
    this.store.dispatch(new StockIssueActions.LoadProductCategories());
  }

  getProductCategories() {
    return this.productCategories$;
  }

  loadProductGroups() {
    this.store.dispatch(new StockIssueActions.LoadProductGroups());
  }

  getProductGroups() {
    return this.productGroups$;
  }

  setIssueAppovedProductsFilter(filterData: { [key: string]: Filter[] }) {
    this.store.dispatch(
      new StockIssueActions.SetFilterDataApprovedProducts(filterData)
    );
  }
  setIssueSelectedProductsFilter(filterData: { [key: string]: Filter[] }) {
    this.store.dispatch(
      new StockIssueActions.SetFilterDataSelectedProducts(filterData)
    );
  }
  getfilterDataApprovedProducts() {
    return this.filterDataApprovedProducts$;
  }
  getfilterDataSelectedProducts() {
    return this.filterDataSelectedProducts$;
  }
  setIssueApprovedProductsSort(sortData: Column[]) {
    this.store.dispatch(
      new StockIssueActions.SetSortDataApprovedProducts(sortData)
    );
  }
  setIssueSelectedProductsSort(sortData: Column[]) {
    this.store.dispatch(
      new StockIssueActions.SetSortDataSelectedProducts(sortData)
    );
  }

  getSortDataApprovedProducts() {
    return this.sortDataApprovedProducts$;
  }
  getSortDataSelectedProducts() {
    return this.sortDataSelectedProducts$;
  }

  getItems() {
    return this.items$;
  }

  getIsItemsLoading() {
    return this.itemsLoading$;
  }
  getItemsCount() {
    return this.itemsCount$;
  }
  getIsItemsLoaded() {
    return this.isItemsLoaded$;
  }
  getTotalMeasuredWeight() {
    return this.totalMeasuredWeight$;
  }
  getTotalMeasuredValue() {
    return this.totalMeasuredValue$;
  }
  // Image
  getIsLoadingImage() {
    return this.isLoadingImage$;
  }

  clearSortAndFilter() {
    this.store.dispatch(new StockIssueActions.ClearSortAndFilter());
  }

  loadIssueToFactorySTN(loadIssueToFactorySTNPayload: LoadPendingIssuePayload) {
    this.store.dispatch(
      new StockIssueActions.LoadFactoryIssuePendingSTN(
        loadIssueToFactorySTNPayload
      )
    );
  }

  loadIssueToBoutiqueSTN(
    loadIssueToBoutiqueSTNPayload: LoadPendingIssuePayload
  ) {
    this.store.dispatch(
      new StockIssueActions.LoadBoutiqueIssuePendingSTN(
        loadIssueToBoutiqueSTNPayload
      )
    );
  }
  loadIssueToMerchantSTN(loadIssueToMerchantPayload: LoadPendingIssuePayload) {
    this.store.dispatch(
      new StockIssueActions.LoadMerchantIssuePendingSTN(
        loadIssueToMerchantPayload
      )
    );
  }

  resetStockIssueList() {
    this.store.dispatch(new StockIssueActions.ResetStockIssueList());
  }

  searchPendingIssues(searchPendingIssuesPayload: SearchPendingPayload) {
    this.store.dispatch(
      new StockIssueActions.SearchPendingIssues(searchPendingIssuesPayload)
    );
  }

  searchClear() {
    this.store.dispatch(new StockIssueActions.SearchClear());
  }

  loadSelectedIssue(loadSelectedIssuePayload: LoadSelectedPayload) {
    this.store.dispatch(
      new StockIssueActions.LoadSelectedIssue(loadSelectedIssuePayload)
    );
  }
  loadItems(loadItemsPayload: LoadIssueItemPayload) {
    this.store.dispatch(new StockIssueActions.LoadItems(loadItemsPayload));
  }
  clearItems() {
    this.store.dispatch(new StockIssueActions.ClearItems());
  }
  loadItemsTotalCount(
    loadIssueItemsTotalCountPayload: LoadIssueItemsTotalCountPayload
  ) {
    this.store.dispatch(
      new StockIssueActions.LoadIssueItemsTotalCount(
        loadIssueItemsTotalCountPayload
      )
    );
  }

  confirmIssue(issueConfirmPayload: ConfirmIssuePayload) {
    this.store.dispatch(
      new StockIssueActions.ConfirmIssue(issueConfirmPayload)
    );
  }

  LoadIssueSTNCount() {
    this.store.dispatch(new StockIssueActions.LoadIssueSTNCount());
  }

  validateItem(itemValidate: ItemToleranceValidate) {
    this.store.dispatch(new StockIssueActions.ValidateItem(itemValidate));
  }
  updateItem(updateItemPayload: UpdateItemPayload) {
    this.store.dispatch(new StockIssueActions.UpdateItem(updateItemPayload));
  }

  UpdateAllItems(updateAllItemsPayload: UpdateAllItemPayload) {
    this.store.dispatch(
      new StockIssueActions.UpdateAllItems(updateAllItemsPayload)
    );
  }
  loadCourierDetails(locationCode: string) {
    this.store.dispatch(new StockIssueActions.LoadCourierDetails(locationCode));
  }

  loadStuddedProductGroups() {
    this.store.dispatch(new StockIssueActions.LoadStuddedProductGroups());
  }

  resetError() {
    this.store.dispatch(new StockIssueActions.ResetError());
  }

  updateItemListStatus(
    updateItemListStatusPayload: UpdateItemListStatusPayload
  ) {
    this.store.dispatch(
      new StockIssueActions.UpdateItemListStatus(updateItemListStatusPayload)
    );
  }

  updateSelectedRequestProductListStatusResponse() {
    return this.updateItemListStatusResponse$;
  }
  loadMeasuredWeightAndValue(loadSelectedIssuePayload: LoadSelectedPayload) {
    this.store.dispatch(
      new StockIssueActions.LoadTotalMeasuredWeightAndValue(
        loadSelectedIssuePayload
      )
    );
  }
  getIsLoading() {
    return this.isLoading$;
  }
  getIssueHistory() {
    return this.issueHistory$;
  }
  getIsIssueHistoryLoading() {
    return this.isLoadingHistory$;
  }
  getIssueHistoryCount() {
    return this.issueHistoryCount$;
  }
  getSelectedHistory() {
    return this.selectedHistory$;
  }
  getIsLoadingSelectedHistory() {
    return this.isLoadingSelectedHistory$;
  }
  getHasSelectedHistory() {
    return this.hasSelectedHistory$;
  }
  getIsLoadingHistoryItems() {
    return this.isLoadingHistoryItems$;
  }
  getIsHistoryItemsLoaded() {
    return this.isHistoryItemsLoaded$;
  }
  getHistoryItems() {
    return this.historyItems$;
  }
  getHistoryItemsTotalCount() {
    return this.historyItemsTotalCount$;
  }
  getIsLoadingHistoryItemsTotalCount() {
    return this.isLoadingHistoryItemsTotalCount$;
  }
  loadIssueHistory(historyPayload: LoadHistoryRequestPayload) {
    this.store.dispatch(new StockIssueActions.LoadIssueHistory(historyPayload));
  }

  resetLoadedHistory() {
    this.store.dispatch(new StockIssueActions.ResetLoadedHistory());
  }
  loadSelectedHistory(
    stockIssueSelectedHistory: StockIssueSelectedHistoryPayload
  ) {
    this.store.dispatch(
      new StockIssueActions.LoadSelectedHistory(stockIssueSelectedHistory)
    );
  }
  loadHistoryItems(payload: LoadStockIssueHistoryItemsPayload) {
    this.store.dispatch(new StockIssueActions.LoadHistoryItems(payload));
  }
  clearHistoryItems() {
    this.store.dispatch(new StockIssueActions.ClearHistoryItems());
  }
  loadHistoryItemstotalCount(payload: LoadStockIssueHistoryItemsPayload) {
    this.store.dispatch(
      new StockIssueActions.LoadHistoryItemsTotalCount(payload)
    );
  }
  setAdvancedFilterData(filterData: IssueAdvanceFilterPayload) {
    this.store.dispatch(
      new StockIssueActions.SetHistoryAdvancedFilterData(filterData)
    );
  }
  getAdvancedFilterData() {
    return this.selectAdavancedFilterData$;
  }
  clearAdvancedFilterData(date: number) {
    this.store.dispatch(
      new StockIssueActions.ClearHistoryAdvancedFilterData(date)
    );
  }

  // cancel STN

  getBTQ_BTQ_PendingSTNCancel() {
    return this.issueToBoutiqueCancelSTN$;
  }
  getTotalIssueCancelSTNCount() {
    return this.totalIssueCancelSTNCount$;
  }
  getisLoadingIssueToBoutiqueCancelSTN() {
    return this.isLoadingIssueBoutiqueSTNCancel$;
  }
  getPendingBTQ_BTQ_STNCancelCount() {
    return this.pendingBTQ_BTQ_STNCancelCount$;
  }
  getCancelIssueItems() {
    return this.selectCancelIssueItems$;
  }
  getCancelIssueItemsCount() {
    return this.selectCancelIssueItemsCount$;
  }
  getCancelIssueSTNDetails() {
    return this.selectCancelIssueSTNDetails$;
  }
  getCancelIssueSTNRes() {
    return this.selectCancelIssueSTNRes$;
  }
  getRegenerateFileRes() {
    return this.selectRegenerateFileRes$;
  }
  getIsFileLoading() {
    return this.selectIsFileLoading$;
  }

  loadIssueToBoutiqueSTNCancel(
    loadIssueToBoutiqueSTNPayload: LoadCancelIssuesSTNPayload
  ) {
    this.store.dispatch(
      new StockIssueActions.LoadCancelIssuePendingSTN(
        loadIssueToBoutiqueSTNPayload
      )
    );
  }

  LoadIssueSTNCancelCount(payload: LoadCancelIssuesPayload) {
    this.store.dispatch(new StockIssueActions.LoadCancelIssueCount(payload));
  }

  loadCancelIssueItems(payload: LoadCancelIssuetemsPayload) {
    this.store.dispatch(new StockIssueActions.LoadCancelIssueItems(payload));
  }

  loadCancelIssueItemsCount(payload: LoadCancelIssuesPayload) {
    this.store.dispatch(
      new StockIssueActions.LoadCancelIssueItemsCount(payload)
    );
  }

  clearPendingIssuesForCancel() {
    this.store.dispatch(new StockIssueActions.ClearPendingIssuesForCancel());
  }

  loadCancelIssueSTNDetails(payload: LoadCancelIssuesPayload) {
    this.store.dispatch(new StockIssueActions.LoadCancelIssueDetails(payload));
  }

  cancelIssueSTN(payload: LoadCancelIssuesPayload) {
    this.store.dispatch(new StockIssueActions.CancelIssueSTN(payload));
  }

  regenerateFile(payload: RegenerateFilePayload) {
    this.store.dispatch(new StockIssueActions.RegenerateFile(payload));
  }
  // Image
  loadThumbnailImageUrl(payload: ImageReqPayload) {
    this.store.dispatch(
      new  StockIssueActions.LoadThumbnailImageUrl(payload)
    );
  }
  loadImageUrl(payload: ImageReqPayload) {
    this.store.dispatch(new  StockIssueActions.LoadImageUrl(payload));
  }
}
