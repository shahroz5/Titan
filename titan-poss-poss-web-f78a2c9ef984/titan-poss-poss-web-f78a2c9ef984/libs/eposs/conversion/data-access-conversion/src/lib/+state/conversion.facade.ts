import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  ConversionHistoryAdvancedFilterPayload,
  ConversionHistoryItemsPayload,
  ConversionInventoryItem,
  ConversionLoadItemsPayload,
  ConversionSplitItemPayload,
  ConversionSplitReqPayload,
  ConvertedTransactionHistoryPayload,
  ImageReqPayload,
  LoadConversionRequestsPayload,
  PriceRequest,
  RequestSentHistoryPayload
} from '@poss-web/shared/models';
import { PriceRequestPayload } from '../../../../../../shared/models/src';
import * as ConversionActions from './conversion.actions';
import { conversionSelectors } from './conversion.selector';
import { ConversionState } from './conversion.state';

@Injectable()
export class ConversionFacade {
  private searchedItemsList$ = this.store.select(
    conversionSelectors.selectSearchedItemsList
  );
  private isSearchingItems$ = this.store.select(
    conversionSelectors.selectIsSearchingItems
  );
  private hasSearchedItems$ = this.store.select(
    conversionSelectors.selectHasSearchedItems
  );

  private selectedVarient$ = this.store.select(
    conversionSelectors.selectSelectedVarient
  );
  private hasSelectedVarient$ = this.store.select(
    conversionSelectors.selectHasSelectedVarient
  );

  private isLoadingConversionItems$ = this.store.select(
    conversionSelectors.selectisLoadingConversionItems
  );
  private hasConversionItems$ = this.store.select(
    conversionSelectors.selectHasConversionItems
  );
  private conversionItems$ = this.store.select(
    conversionSelectors.selectConversionItems
  );
  private itemSplitResponse$ = this.store.select(
    conversionSelectors.selectItemSplitResponse
  );
  private isSplitting$ = this.store.select(
    conversionSelectors.selectIsSplitting
  );
  private isSplitted$ = this.store.select(conversionSelectors.selectIsSplitted);
  private hasRequestResponse$ = this.store.select(
    conversionSelectors.selectHasRequestResponse
  );

  private standardPrice$ = this.store.select(conversionSelectors.selectStandardMetalPriceDetails);
  private priceDetails$ = this.store.select(conversionSelectors.selectPriceDetails);

  private isSendingRequest$ = this.store.select(
    conversionSelectors.selectIsSendingRequest
  );
  private conversionRequestResponse$ = this.store.select(
    conversionSelectors.selectConversionRequestResponse
  );
  private isConversionCountLoading$ = this.store.select(
    conversionSelectors.selectIsLoadingCount
  );
  private conversionRequestCount$ = this.store.select(
    conversionSelectors.selectConversionRequestCount
  );
  private conversionRequests$ = this.store.select(
    conversionSelectors.selectConversionRequests
  );

  private isConversionRequestsLoading$ = this.store.select(
    conversionSelectors.selectIsLoadingRequests
  );

  private isSearchingRequests$ = this.store.select(
    conversionSelectors.selectIsSearchingRequests
  );
  private hasSearchedRequests$ = this.store.select(
    conversionSelectors.selectHasSearchedRequests
  );
  private searchedRequests$ = this.store.select(
    conversionSelectors.selectSearchedConversionRequests
  );

  private isSelectedRequestLoading$ = this.store.select(
    conversionSelectors.selectIsLoadingSelectedRequest
  );
  private selectedRequest$ = this.store.select(
    conversionSelectors.selectSelectedRequest
  );
  private isSelectedRequestDataLoading$ = this.store.select(
    conversionSelectors.selectIsLoadingSelectedRequestData
  );
  private selectedRequestData$ = this.store.select(
    conversionSelectors.selectSelectedRequestData
  );

  private selectRsoDetails$ = this.store.select(
    conversionSelectors.selectRsoDetails
  );
  private selectIsLoadingRsoDetails$ = this.store.select(
    conversionSelectors.selectIsLoadingRsoDetails
  );
  private selectHasRsoDetails$ = this.store.select(
    conversionSelectors.selectHasRsoDetails
  );

  private selectBinCodes$ = this.store.select(
    conversionSelectors.selectBincodes
  );
  private selectIsLoading$ = this.store.select(
    conversionSelectors.selectIsLoading
  );
  private selectHasBinCodes$ = this.store.select(
    conversionSelectors.selectHasBinCodes
  );

  private error$ = this.store.select(conversionSelectors.selectError);
  private conversionHistory$ = this.store.select(
    conversionSelectors.selectConversionHistory
  );
  private conversionHistoryCount$ = this.store.select(
    conversionSelectors.selectConversionHistoryCount
  );

  private isLoadingHistory$ = this.store.select(
    conversionSelectors.selectIsLoadingHistory
  );
  private selectedRequestHistory$ = this.store.select(
    conversionSelectors.selectSelectedRequestHistory
  );
  private selectConversionHistoryItems$ = this.store.select(
    conversionSelectors.selectConversionHistoryItems
  );
  private selectConversionHistoryItemsCount$ = this.store.select(
    conversionSelectors.selectConversionHistoryItemsCount
  );
  private requestType$ = this.store.select(
    conversionSelectors.selectRequestType
  );
  private advancedFilter$ = this.store.select(
    conversionSelectors.selectAdvancedFilterData
  );

  // Image
  private isLoadingImage$ = this.store.select(
    conversionSelectors.selectIsLoadingImage
  );

  constructor(private store: Store<ConversionState>) {}

  getSearchedItemsList() {
    return this.searchedItemsList$;
  }
  getIsSearchingItems() {
    return this.isSearchingItems$;
  }
  getHasSearchedItems() {
    return this.hasSearchedItems$;
  }

  getSelectedVarient() {
    return this.selectedVarient$;
  }
  getHasSelectedVarient() {
    return this.hasSelectedVarient$;
  }

  getisLoadingConversionItems() {
    return this.isLoadingConversionItems$;
  }
  getHasConverionItemsLoaded() {
    return this.hasConversionItems$;
  }
  getConversionItems() {
    return this.conversionItems$;
  }

  getItemSplitResponse() {
    return this.itemSplitResponse$;
  }
  getIsSplitting() {
    return this.isSplitting$;
  }
  getIsSplitted() {
    return this.isSplitted$;
  }
  getIsSendingRequest() {
    return this.isSendingRequest$;
  }
  getConversionRequestResponse() {
    return this.conversionRequestResponse$;
  }
  getHasRequestResponse() {
    return this.hasRequestResponse$;
  }
  getConversionRequestCount() {
    return this.conversionRequestCount$;
  }
  getIsLoadingConversionRequestCount() {
    return this.isConversionCountLoading$;
  }
  getConversionRequests() {
    return this.conversionRequests$;
  }

  getIsLoadingConversionRequests() {
    return this.isConversionRequestsLoading$;
  }

  getIsSearchingRequests() {
    return this.isSearchingRequests$;
  }
  getHasSearchedRequests() {
    return this.hasSearchedRequests$;
  }
  getSearchedRequests() {
    return this.searchedRequests$;
  }

  getIsLoadingSelectedRequest() {
    return this.isSelectedRequestLoading$;
  }
  getSelectedRequest() {
    return this.selectedRequest$;
  }
  getIsLoadingSelectedRequestData() {
    return this.isSelectedRequestDataLoading$;
  }
  getSelectedRequestData() {
    return this.selectedRequestData$;
  }
  getRsoDetails() {
    return this.selectRsoDetails$;
  }
  getIsLoadingRsoDetails() {
    return this.selectIsLoadingRsoDetails$;
  }
  getHasRsoDetails() {
    return this.selectHasRsoDetails$;
  }

  getBinCodes() {
    return this.selectBinCodes$;
  }
  getIsLoading() {
    return this.selectIsLoading$;
  }
  getHasBinCodes() {
    return this.selectHasBinCodes$;
  }
  getConversionHistory() {
    return this.conversionHistory$;
  }
  getConversionHistoryCount() {
    return this.conversionHistoryCount$;
  }
  getIsLoadingHistory() {
    return this.isLoadingHistory$;
  }
  getSelectedRequestHistory() {
    return this.selectedRequestHistory$;
  }
  getConversionHistoryItems() {
    return this.selectConversionHistoryItems$;
  }
  getConversionHistoryItemsCount() {
    return this.selectConversionHistoryItemsCount$;
  }
  getRequestType() {
    return this.requestType$;
  }
  getAdvancedFilter() {
    return this.advancedFilter$;
  }

  getStandardPrice(){
    return this.standardPrice$;
  }

  getError() {
    return this.error$;
  }

  // Image
  getIsLoadingImage() {
    return this.isLoadingImage$;
  }

  getPriceDetails() {
    return this.priceDetails$;
  }

  // Below Actions
  loadSearchedItemsList(SearchItemsPayload: string) {
    this.store.dispatch(
      new ConversionActions.LoadSearchVarient(SearchItemsPayload)
    );
  }

  loadStandardPrice() {
    this.store.dispatch(new ConversionActions.LoadStandardMetalPriceDetails());
  }

  clearSearchedItemsList() {
    this.store.dispatch(new ConversionActions.ClearVarientSearchList());
  }
  loadConversionItems(loadItemsPayload: ConversionLoadItemsPayload) {
    this.store.dispatch(
      new ConversionActions.LoadConversionItems(loadItemsPayload)
    );
  }
  loadConversionHistoryItems(
    conversionHistoryItemsPayload: ConversionHistoryItemsPayload
  ) {
    this.store.dispatch(
      new ConversionActions.LoadConversionHistoryItems(
        conversionHistoryItemsPayload
      )
    );
  }
  clearLoadedConversionItems() {
    this.store.dispatch(new ConversionActions.ClearLoadedConversionItem());
  }
  addToSelectedVarient(item: ConversionInventoryItem) {
    this.store.dispatch(new ConversionActions.AddToItemList(item));
  }
  removeFromSelectedVarient() {
    this.store.dispatch(new ConversionActions.RemoveFromItemList());
  }
  splitItem(splitItemPayload: ConversionSplitItemPayload) {
    this.store.dispatch(new ConversionActions.SplitItems(splitItemPayload));
  }
  sendConversionRequest(conversionRequestPayload: ConversionSplitReqPayload) {
    this.store.dispatch(
      new ConversionActions.SendConversionRequest(conversionRequestPayload)
    );
  }
  loadConversionReqCount() {
    this.store.dispatch(new ConversionActions.LoadRequestsCount());
  }
  loadConversionRequests(
    loadConversionRequestsPayload: LoadConversionRequestsPayload
  ) {
    this.store.dispatch(
      new ConversionActions.LoadConversionRequests(
        loadConversionRequestsPayload
      )
    );
  }
  searchConversionRequests(srcDocNo: number) {
    this.store.dispatch(
      new ConversionActions.SearchConversionRequests(srcDocNo)
    );
  }
  clearSearchedRequests() {
    this.store.dispatch(new ConversionActions.ClearSearchRequests());
  }
  loadSelectedRequest(srcDocNo: number) {
    this.store.dispatch(new ConversionActions.LoadSelectedRequest(srcDocNo));
  }
  loadSelectedRequestData(id: number) {
    this.store.dispatch(new ConversionActions.LoadSelectedRequestData(id));
  }
  loadRsoDetails() {
    this.store.dispatch(new ConversionActions.LoadRsoDetails());
  }
  loadBinCodes(binGroup: string) {
    this.store.dispatch(new ConversionActions.LoadBinCodes(binGroup));
  }
  resetError() {
    this.store.dispatch(new ConversionActions.ResetError());
  }
  resetSelectedRequestData() {
    this.store.dispatch(new ConversionActions.ResetSelectedRequestData());
  }
  confirmConversion(confirmConversionPayload: ConversionSplitItemPayload) {
    this.store.dispatch(
      new ConversionActions.ConfirmConversion(confirmConversionPayload)
    );
  }
  loadStuddedProductGroups() {
    this.store.dispatch(new ConversionActions.LoadStuddedProductGroups());
  }
  loadRequestSentHistory(requestSentHistoryPayload: RequestSentHistoryPayload) {
    this.store.dispatch(
      new ConversionActions.LoadRequestSentHistory(requestSentHistoryPayload)
    );
  }
  loadConvertedTransactionHistory(
    convertedTransactionHistoryPayload: ConvertedTransactionHistoryPayload
  ) {
    this.store.dispatch(
      new ConversionActions.LoadConvertedTransactionHistory(
        convertedTransactionHistoryPayload
      )
    );
  }
  loadSelectedRequestHistory(reqDocNo: number, requestType: string) {
    this.store.dispatch(
      new ConversionActions.LoadSelectedRequestHistory({
        reqDocNo: reqDocNo,
        requestType: requestType
      })
    );
  }
  resetConversionHistory() {
    this.store.dispatch(new ConversionActions.ResetConversionHistory());
  }
  storeRequestType(requestType: string) {
    this.store.dispatch(new ConversionActions.StoreRequestType(requestType));
  }
  storeAdvancedFilterData(
    advancedFilter: ConversionHistoryAdvancedFilterPayload
  ) {
    this.store.dispatch(
      new ConversionActions.StoreAdvancedFilterData(advancedFilter)
    );
  }
  resetAdvanceFilter() {
    this.store.dispatch(new ConversionActions.ResetAdvanceFilter());
  }
  // Image For Saerch by Variant
  loadSearchVariantThumbnailImageUrl(payload: ImageReqPayload) {
    this.store.dispatch(
      new  ConversionActions.LoadSearchVariantThumbnailImageUrl(payload)
    );
  }
  loadSearchVariantImageUrl(payload: ImageReqPayload) {
    this.store.dispatch(new  ConversionActions.LoadSearchVariantImageUrl(payload));
  }
  // Image For Request Sent
  loadRequestThumbnailImageUrl(payload: ImageReqPayload) {
    this.store.dispatch(
      new  ConversionActions.LoadRequestThumbnailImageUrl(payload)
    );
  }
  loadRequestImageUrl(payload: ImageReqPayload) {
    this.store.dispatch(new  ConversionActions.LoadRequestImageUrl(payload));
  }
  // Image For History
  loadHistoryThumbnailImageUrl(payload: ImageReqPayload) {
    this.store.dispatch(
      new  ConversionActions.LoadHistoryThumbnailImageUrl(payload)
    );
  }
  loadHistoryImageUrl(payload: ImageReqPayload) {
    this.store.dispatch(new  ConversionActions.LoadHistoryImageUrl(payload));
  }
  loadItemPriceDetails(pricePayload: PriceRequestPayload) {
    this.store.dispatch(new ConversionActions.LoadPriceDetails(pricePayload));
  }

  reset
}
