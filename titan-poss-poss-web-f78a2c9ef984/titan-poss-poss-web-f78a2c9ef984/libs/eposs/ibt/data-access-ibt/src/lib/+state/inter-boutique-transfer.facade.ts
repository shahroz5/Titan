import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { interBoutiqueTransferSelectors } from './inter-boutique-transfer.selectors';
import * as InterBoutiqueTransferActions from './inter-boutique-transfer.actions';
import { InterBoutiqueTransferState } from './inter-boutique-transfer.state';
import {
  Request,
  LoadRequestListPayload,
  LoadBoutiqueListPayload,
  LoadRequestPayload,
  LoadItemListPayload,
  UpdateItemListPayload,
  UpdateItemListStatusPayload,
  LoadRequestListCountPayload,
  LoadIBTHistoryPayload,
  LoadSelectedHistoryHeaderInfoPayload,
  LoadIBTHistoryItemsPayload,
  InterBoutiqueTransferRequestTypesEnum,
  HistoryFilterData,
  ImageReqPayload,
} from '@poss-web/shared/models';

@Injectable()
export class InterBoutiqueTransferFacade {
  constructor(private store: Store<InterBoutiqueTransferState>) {}

  private requestSentList$ = this.store.select(
    interBoutiqueTransferSelectors.selectRequestSentList
  );

  private requestReceivedList$ = this.store.select(
    interBoutiqueTransferSelectors.selectRequestReceivedList
  );

  private requestSentListCount$ = this.store.select(
    interBoutiqueTransferSelectors.selectRequestSentListCount
  );

  private requestReceivedListCount$ = this.store.select(
    interBoutiqueTransferSelectors.selectRequestReceivedListCount
  );

  private boutiqueList$ = this.store.select(
    interBoutiqueTransferSelectors.selectBoutiqueList
  );

  private boutiqueListCount$ = this.store.select(
    interBoutiqueTransferSelectors.selectBoutiqueListCount
  );

  private createRequestResponse$ = this.store.select(
    interBoutiqueTransferSelectors.selectCreateRequestResponse
  );

  private request$ = this.store.select(
    interBoutiqueTransferSelectors.selectRequest
  );

  private itemList$ = this.store.select(
    interBoutiqueTransferSelectors.selectItemList
  );

  private updateItemListResponse$ = this.store.select(
    interBoutiqueTransferSelectors.selectUpdateItemListResponse
  );

  private updateItemListStatusResponse$ = this.store.select(
    interBoutiqueTransferSelectors.selectUpdateItemListStatusResponse
  );

  private searchItemResponse$ = this.store.select(
    interBoutiqueTransferSelectors.selectSearchItemResponse
  );

  private hasError$ = this.store.select(
    interBoutiqueTransferSelectors.selectHasError
  );

  private isLoading$ = this.store.select(
    interBoutiqueTransferSelectors.selectIsLoading
  );

  private ibtHistory$ = this.store.select(
    interBoutiqueTransferSelectors.selectIBTHistory
  );
  private isLoadingHistory$ = this.store.select(
    interBoutiqueTransferSelectors.selectIsLoadingIBTHistory
  );
  private ibtHistoryCount$ = this.store.select(
    interBoutiqueTransferSelectors.selectIBTHistoryCount
  );
  private historyFilterData$ = this.store.select(
    interBoutiqueTransferSelectors.selectHistoryFilterData
  );
  private isLoadingSelectedHistory$ = this.store.select(
    interBoutiqueTransferSelectors.selectIsLoadingSelectedHistory
  );
  private selectedHistory$ = this.store.select(
    interBoutiqueTransferSelectors.selectSelectedHistory
  );
  private hasSelectedHistory$ = this.store.select(
    interBoutiqueTransferSelectors.selectHasSelectedHistory
  );
  private radioHistoryType$ = this.store.select(
    interBoutiqueTransferSelectors.selectRadioHistoryType
  );
  private advancedFilter$ = this.store.select(
    interBoutiqueTransferSelectors.selectAdvancedFilterData
  );

  // Image
  private isLoadingImage$ = this.store.select(
    interBoutiqueTransferSelectors.selectIsLoadingImage
  );
  
  loadRequestSentListCount(
    loadRequestListCountPayload: LoadRequestListCountPayload
  ) {
    this.store.dispatch(
      new InterBoutiqueTransferActions.LoadRequestSentListCount(
        loadRequestListCountPayload
      )
    );
  }

  loadRequestReceivedListCount(
    loadRequestListCountPayload: LoadRequestListCountPayload
  ) {
    this.store.dispatch(
      new InterBoutiqueTransferActions.LoadRequestReceivedListCount(
        loadRequestListCountPayload
      )
    );
  }

  getRequestSentListCount() {
    return this.requestSentListCount$;
  }

  getRequestReceivedListCount() {
    return this.requestReceivedListCount$;
  }

  // Image
  getIsLoadingImage() {
    return this.isLoadingImage$;
  }

  loadRequestSentList(loadRequestListPayload: LoadRequestListPayload) {
    this.store.dispatch(
      new InterBoutiqueTransferActions.LoadRequestSentList(
        loadRequestListPayload
      )
    );
  }

  getRequestSentList() {
    return this.requestSentList$;
  }

  loadRequestReceivedList(loadRequestListPayload: LoadRequestListPayload) {
    this.store.dispatch(
      new InterBoutiqueTransferActions.LoadRequestReceivedList(
        loadRequestListPayload
      )
    );
  }

  getRequestReceivedList() {
    return this.requestReceivedList$;
  }

  loadBoutiqueList(loadBoutiqueListPayload: LoadBoutiqueListPayload) {
    this.store.dispatch(
      new InterBoutiqueTransferActions.LoadBoutiqueList(loadBoutiqueListPayload)
    );
  }

  getBoutiqueList() {
    return this.boutiqueList$;
  }

  loadBoutiqueListCount(loadBoutiqueListPayload: LoadBoutiqueListPayload) {
    this.store.dispatch(
      new InterBoutiqueTransferActions.LoadBoutiqueListCount(
        loadBoutiqueListPayload
      )
    );
  }

  getBoutiqueListCount() {
    return this.boutiqueListCount$;
  }

  createRequest(request: Request) {
    this.store.dispatch(
      new InterBoutiqueTransferActions.CreateRequest(request)
    );
  }

  getCreateRequestResponse() {
    return this.createRequestResponse$;
  }

  loadRequest(loadRequestPayload: LoadRequestPayload) {
    this.store.dispatch(
      new InterBoutiqueTransferActions.LoadRequest(loadRequestPayload)
    );
  }

  getRequest() {
    return this.request$;
  }

  loadItemList(loadItemListPayload: LoadItemListPayload) {
    this.store.dispatch(
      new InterBoutiqueTransferActions.LoadItemList(loadItemListPayload)
    );
  }

  getItemList() {
    return this.itemList$;
  }

  updateItemList(updateItemListPayload: UpdateItemListPayload) {
    this.store.dispatch(
      new InterBoutiqueTransferActions.UpdateItemList(updateItemListPayload)
    );
  }

  updateItemListResponse() {
    return this.updateItemListResponse$;
  }

  updateItemListStatus(
    updateItemListStatusPayload: UpdateItemListStatusPayload
  ) {
    this.store.dispatch(
      new InterBoutiqueTransferActions.UpdateItemListStatus(
        updateItemListStatusPayload
      )
    );
  }

  updateSelectedRequestProductListStatusResponse() {
    return this.updateItemListStatusResponse$;
  }

  getHasError() {
    return this.hasError$;
  }

  getIsLoading() {
    return this.isLoading$;
  }

  loadSearchItem(itemCode: string) {
    this.store.dispatch(new InterBoutiqueTransferActions.SearchItem(itemCode));
  }

  getSearchItemResponse() {
    return this.searchItemResponse$;
  }
  loadStuddedProductGroups() {
    this.store.dispatch(
      new InterBoutiqueTransferActions.LoadStuddedProductGroups()
    );
  }

  loadIBTHistory(historyPayload: LoadIBTHistoryPayload) {
    this.store.dispatch(
      new InterBoutiqueTransferActions.LoadIBTHistory(historyPayload)
    );
  }
  getIBTHistory() {
    return this.ibtHistory$;
  }
  loadHistoryFilterData(date: HistoryFilterData) {
    this.store.dispatch(
      new InterBoutiqueTransferActions.LoadHistoryFilterData(date)
    );
  }
  getHistoryFilterData() {
    return this.historyFilterData$;
  }
  loadRadioHistoryType(radio: InterBoutiqueTransferRequestTypesEnum) {
    this.store.dispatch(
      new InterBoutiqueTransferActions.RadioHistoryType(radio)
    );
  }
  getRadioHistoryType() {
    return this.radioHistoryType$;
  }
  getIsIBTHistoryLoading() {
    return this.isLoadingHistory$;
  }
  getIBTHistoryCount() {
    return this.ibtHistoryCount$;
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
  getAdvancedFilter() {
    return this.advancedFilter$;
  }
  loadSelectedHistory(payload: LoadSelectedHistoryHeaderInfoPayload) {
    this.store.dispatch(
      new InterBoutiqueTransferActions.LoadSelectedHistory(payload)
    );
  }
  loadHistoryItems(loadItemsPayload: LoadIBTHistoryItemsPayload) {
    this.store.dispatch(
      new InterBoutiqueTransferActions.LoadHistoryItems(loadItemsPayload)
    );
  }
  /**
   * Dispatch Action for Clearing list results
   */
  clearRequestSentList() {
    this.store.dispatch(
      new InterBoutiqueTransferActions.ClearRequestSentList()
    );
  }

  clearRequestReceivedList() {
    this.store.dispatch(
      new InterBoutiqueTransferActions.ClearRequestReceivedList()
    );
  }

  clearItemList() {
    this.store.dispatch(new InterBoutiqueTransferActions.ClearItemList());
  }

  clearBoutiqueList() {
    this.store.dispatch(new InterBoutiqueTransferActions.ClearBoutiqueList());
  }

  resetBoutiqueListCount() {
    this.store.dispatch(
      new InterBoutiqueTransferActions.ResetBoutiqueListCount()
    );
  }

  clearSearchItemResponse() {
    this.store.dispatch(
      new InterBoutiqueTransferActions.ClearSearchItemResponse()
    );
  }

  resetRequestList() {
    this.store.dispatch(new InterBoutiqueTransferActions.ResetRequestList());
  }

  resetLoadedHistory() {
    this.store.dispatch(new InterBoutiqueTransferActions.ResetLoadedHistory());
  }
  resetAdvanceFilter(businessDay: number) {
    this.store.dispatch(
      new InterBoutiqueTransferActions.ResetHstoryFilter(businessDay)
    );
  }
  // Image
  loadThumbnailImageUrl(payload: ImageReqPayload) {
    this.store.dispatch(
      new  InterBoutiqueTransferActions.LoadThumbnailImageUrl(payload)
    );
  }
  loadImageUrl(payload: ImageReqPayload) {
    this.store.dispatch(new  InterBoutiqueTransferActions.LoadImageUrl(payload));
  }
}
