import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import {
  ConversionApprovalDetailsPayload,
  ConversionHistoryItemsPayload,
  ConversionInventoryItem,
  ConversionItemPayload,
  ConversionLoadItemsPayload,
  ConversionSplitItemDetailsDataPayload,
  ConversionSplitItemPayload,
  ConversionSplitReqItemPayload,
  ConversionSplitReqPayload,
  ConvertedTransactionHistoryPayload,
  LoadConversionRequestsPayload,
  RequestSentHistoryPayload
} from '@poss-web/shared/models';
import * as moment from 'moment';
import {
  AddToItemList,
  ClearLoadedConversionItem,
  ClearSearchRequests,
  ClearVarientSearchList,
  ConfirmConversion,
  LoadBinCodes,
  LoadConversionHistoryItems,
  LoadConversionItems,
  LoadConversionRequests,
  LoadConvertedTransactionHistory,
  LoadRequestsCount,
  LoadRequestSentHistory,
  LoadRsoDetails,
  LoadSearchVarient,
  LoadSelectedRequest,
  LoadSelectedRequestData,
  LoadSelectedRequestHistory,
  LoadStuddedProductGroups,
  RemoveFromItemList,
  ResetAdvanceFilter,
  ResetConversionHistory,
  ResetError,
  SearchConversionRequests,
  SendConversionRequest,
  SplitItems,
  StoreAdvancedFilterData,
  StoreRequestType
} from './conversion.actions';
import {
  conversionRequestAdaptor,
  conversionRequestHistoryAdaptor,
  itemAdapter
} from './conversion.entity';
import { ConversionFacade } from './conversion.facade';
import { ConversionState } from './conversion.state';
describe('Conversion Facade Testing Suite', () => {
  const initialState: ConversionState = {
    searchedItemsList: [],
    isSearchingItems: false,
    hasSearchedItems: null,

    selectedVarient: itemAdapter.getInitialState(),
    hasselectedVarient: false,

    conversionItems: null,
    isLoadingConversionItems: false,
    hasConversionItems: null,

    ItemSplitResponse: null,
    isSplitting: null,
    isSplitted: null,

    conversionRequestResponse: null,
    isSendingRequest: false,
    hasRequestResponse: null,

    conversionRequests: conversionRequestAdaptor.getInitialState(),
    isLoadingRequests: false,

    conversionRequestsCount: 0,
    isLoadingCount: false,

    searchedConversionRequests: conversionRequestAdaptor.getInitialState(),
    isSearchingRequests: false,
    hasSearchedConversionRequests: null,

    selectedRequest: null,
    isLoadingSelectedRequest: false,

    selectedRequestData: [],
    isLoadingSelectedRequestData: false,

    rsoDetails: [],
    isLoadingRsoDetails: false,
    hasRsoDetails: false,

    binCodes: [],
    isLoading: false,
    hasBinCodes: false,
    studdedProductGroups: [],
    error: null,
    conversionHistory: conversionRequestHistoryAdaptor.getInitialState(),
    isLoadingRequestSentHistory: null,
    totalElements: null,
    isLoadingHistory: false,
    selectedRequestHistory: null,
    conversionHistoryItems: null,
    historyItemsCount: 0,
    requestType: 'requestSent',
    advancedFilter: {
      requestFromDate: moment().startOf('day').valueOf(),
      requestToDate: moment().endOf('day').valueOf(),
      docNo: null,
      fiscalYear: null,
      statuses: []
    },
    isLoadingImage: false
  };
  let conversionFacade: ConversionFacade;
  let store: Store;

  const conversionItemPayload: ConversionItemPayload = {
    binCode: 'AREPLNISH',
    inventoryId: 'CB45B857-57A4-467C-A97E-BCF7193585F1',
    itemCode: '501090FGALAP70',
    lotNumber: '3IH005125',
    measuredWeight: 3.905
  };
  const conversionSplitItemPayload: ConversionSplitItemPayload = {
    issueItems: [conversionItemPayload],
    receiveItems: [conversionItemPayload],
    rsoName: ''
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), ConversionFacade]
    });
    conversionFacade = TestBed.inject(ConversionFacade);
    store = TestBed.inject(Store);
  });
  describe('Dispatch Actions', () => {
    it('should call LOAD_SEARCH_VARIENT action', () => {
      const payload = '';
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadSearchVarient(payload);
      conversionFacade.loadSearchedItemsList(payload);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    });
    it('should call CLEAR_VARIENT_SEARCH_LIST action', () => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new ClearVarientSearchList();
      conversionFacade.clearSearchedItemsList();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    });
    it('should call LOAD_CONVERSION_ITEMS action', () => {
      const conversionLoadItemsPayload: ConversionLoadItemsPayload = {
        itemCode: '501090FGALAP70',
        lotNumber: '3IH005125',
        itemWeight: 3.905,
        binCode: 'AREPLNISH'
      };
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadConversionItems(
        conversionLoadItemsPayload
      );
      conversionFacade.loadConversionItems(conversionLoadItemsPayload);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    });
    it('should call LOAD_CONVERSION_HISTORY_ITEMS action', () => {
      const conversionHistoryPayload: ConversionHistoryItemsPayload = {
        historyItemsPaylod: {
          binCodes: [],
          binGroupCode: '123',
          itemCode: '123',
          lotNumber: '123',
          productCategories: [],
          productGroups: []
        },
        pageIndex: 0,
        pageSize: 10,
        id: 123,
        requestType: 'ICT',
        preTransactionId: 12
      };
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadConversionHistoryItems(
        conversionHistoryPayload
      );
      conversionFacade.loadConversionHistoryItems(conversionHistoryPayload);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    });
    it('should call CLEAR_LOADED_CONVERSION_ITEMS action', () => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new ClearLoadedConversionItem();
      conversionFacade.clearLoadedConversionItems();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    });
    it('should call ADD_TO_SELECTED_VARIENT action', () => {
      const conversionInventoryItem: ConversionInventoryItem = {
        availableQuantity: 1,
        availableValue: 166396,
        availableWeight: 3.905,
        binCode: 'AREPLNISH',
        binGroupCode: 'STN',
        currencyCode: 'INR',
        id: 'CB45B857-57A4-467C-A97E-BCF7193585F1',
        imageURL: '/productcatalogue/ProductImages/1090FGA.jpg',
        itemCode: '501090FGALAP70',
        isLoadingImage: true,
        isLoadingThumbnailImage: false,
        thumbnailImageURL: 'abcdefg',
        itemDetails: {
          type: 'ITEM_DETAILS',
          data: {
            stoneValue: 141200.0,
            hallMarkRemarks1: '',
            hallMarkingCode: '',
            hallMarkingCentreName: '',
            hallMarkRemarks: '',
            hallMarkedDate: null,
            isHallMarking: true
          }
        },
        lotNumber: '3IH005125',
        mfgDate: moment(1636309800000),
        productCategory: 'F',
        productCategoryDesc: 'FINGER RING',
        productGroup: '77',
        productGroupDesc: 'Studded - Solitaire',
        status: null,
        stdValue: 166396,
        stdWeight: 3.905,
        weightUnit: 'gms',
        isStudded: false
      };

      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new AddToItemList(conversionInventoryItem);
      conversionFacade.addToSelectedVarient(conversionInventoryItem);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    });
    it('should call REMOVE_FROM_SELECTED_VARIENT action', () => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new RemoveFromItemList();
      conversionFacade.removeFromSelectedVarient();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    });
    it('should call SPLIT_ITEM action', () => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new SplitItems(conversionSplitItemPayload);
      conversionFacade.splitItem(conversionSplitItemPayload);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    });
    it('should call SEND_CONVERSION_REQUEST action', () => {
      const conversionApprovalDetailsPayload: ConversionApprovalDetailsPayload = {
        data: null,
        type: 'ITEM_DETAILS'
      };
      const conversionSplitItemDetailsDataPayload: ConversionSplitItemDetailsDataPayload = {
        remarks: 'good',
        itemCode: '123',
        netWeight: 3.123,
        stonePrice: 12345,
        complexityCode: 123,
        sold: 'yes',
        itemType: 'AB'
      };
      const conversionSplitReqItemPayload: ConversionSplitReqItemPayload = {
        binCode: 'AREPLNISH',
        inventoryId: 'CB45B857-57A4-467C-A97E-BCF7193585F1',
        itemCode: '501090FGALAP70',
        itemDetails: {
          type: 'ITEM_DETAILS',
          data: conversionSplitItemDetailsDataPayload
        },
        lotNumber: '3IH005125',
        measuredWeight: 3.905,
        quantity: 1
      };
      const conversionSplitReqPayload: ConversionSplitReqPayload = {
        otherDetails: conversionApprovalDetailsPayload,
        items: [conversionSplitReqItemPayload],
        remarks: null
      };

      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new SendConversionRequest(
        conversionSplitReqPayload
      );
      conversionFacade.sendConversionRequest(conversionSplitReqPayload);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    });
    it('should call LOAD_REQUESTS_COUNT action', () => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadRequestsCount();
      conversionFacade.loadConversionReqCount();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    });
    it('should call LOAD_CONVERSION_REQUESTS action', () => {
      const loadConversionRequestsPayload: LoadConversionRequestsPayload = {
        pageIndex: 0,
        pageSize: 8
      };
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadConversionRequests(
        loadConversionRequestsPayload
      );
      conversionFacade.loadConversionRequests(loadConversionRequestsPayload);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    });
    it('should call SEARCH_CONVERSION_REQUESTS action', () => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new SearchConversionRequests(12);
      conversionFacade.searchConversionRequests(12);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    });
    it('should call SEARCH_CLEAR action', () => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new ClearSearchRequests();
      conversionFacade.clearSearchedRequests();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    });
    it('should call LOAD_SELECTED_REQUEST action', () => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadSelectedRequest(12);
      conversionFacade.loadSelectedRequest(12);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    });
    it('should call LOAD_SELECTED_REQUEST_DATA action', () => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadSelectedRequestData(12);
      conversionFacade.loadSelectedRequestData(12);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    });
    it('should call LOAD_RSO_DETAILS action', () => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadRsoDetails();
      conversionFacade.loadRsoDetails();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    });
    it('should call LOAD_BINCODES action', () => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadBinCodes('STN');
      conversionFacade.loadBinCodes('STN');
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    });
    it('should call RESET_ERROR action', () => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new ResetError();
      conversionFacade.resetError();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    });
    it('should call CONFIRM_CONVERSION action', () => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new ConfirmConversion(conversionSplitItemPayload);
      conversionFacade.confirmConversion(conversionSplitItemPayload);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    });
    it('should call LOAD_STUDDED_PRODUCT_GROUPS action', () => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadStuddedProductGroups();
      conversionFacade.loadStuddedProductGroups();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    });

    // History Related Below
    it('should call LOAD_REQUEST_SENT_HISTORY action', () => {
      const requestPayload: RequestSentHistoryPayload = {
        requestSentPayload: {
          actionType: 'REQUEST_SENT',
          dateRangeType: 'CUSTOM',
          endDate: '12312321321',
          locationCode: '123123213',
          reqDocNo: 12,
          reqFiscalYear: '2021',
          startDate: '123123213',
          statuses: []
        },
        pageIndex: 0,
        pageSize: 10,
        requestType: 'REQUEST'
      };
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new LoadRequestSentHistory(requestPayload);
      conversionFacade.loadRequestSentHistory(requestPayload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call LOAD_CONVERTED_TRANSACTION_HISTORY action', () => {
      const convertedTransactionPayload: ConvertedTransactionHistoryPayload = {
        convertedTransaction: {
          actionType: 'REQUEST',
          dateRangeType: 'CUSTOM',
          endDate: 12222,
          issueDocNo: 13,
          issueFiscalYear: 2020,
          receiveDocNo: 12,
          receiveFiscalYear: 2021,
          startDate: 12312312,
          statuses: []
        },
        pageIndex: 0,
        pageSize: 12,
        transactionType: 'TRANACTION'
      };
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new LoadConvertedTransactionHistory(
        convertedTransactionPayload
      );
      conversionFacade.loadConvertedTransactionHistory(
        convertedTransactionPayload
      );
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call LOAD_SELECTED_REQUEST_HISTORY action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new LoadSelectedRequestHistory({
        reqDocNo: 12,
        requestType: 'REQUEST'
      });
      conversionFacade.loadSelectedRequestHistory(12, 'REQUEST');
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call RESET_CONVERSION_HISTORY action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new ResetConversionHistory();
      conversionFacade.resetConversionHistory();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call STORE_REQUEST_TYPE action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new StoreRequestType('REQUEST');
      conversionFacade.storeRequestType('REQUEST');
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call STORE_ADVANCED_FILTER action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new StoreAdvancedFilterData({
        requestFromDate: 123,
        requestToDate: 12312312,
        fiscalYear: 2020,
        statuses: [],
        docNo: 12
      });
      conversionFacade.storeAdvancedFilterData({
        requestFromDate: 123,
        requestToDate: 12312312,
        fiscalYear: 2020,
        statuses: [],
        docNo: 12
      });
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call RESET_ADVANCE_FILTER action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new ResetAdvanceFilter();
      conversionFacade.resetAdvanceFilter();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
  });

  describe('Access selector ', () => {
    it('should access the get searchedItemsList selector ', () => {
      expect(conversionFacade.getSearchedItemsList()).toEqual(
        conversionFacade['searchedItemsList$']
      );
    });
    it('should access the get isSearchingItems selector ', () => {
      expect(conversionFacade.getIsSearchingItems()).toEqual(
        conversionFacade['isSearchingItems$']
      );
    });
    it('should access the get hasSearchedItems selector ', () => {
      expect(conversionFacade.getHasSearchedItems()).toEqual(
        conversionFacade['hasSearchedItems$']
      );
    });
    it('should access the get selectedVarient selector ', () => {
      expect(conversionFacade.getSelectedVarient()).toEqual(
        conversionFacade['selectedVarient$']
      );
    });
    it('should access the get hasSelectedVarient selector ', () => {
      expect(conversionFacade.getHasSelectedVarient()).toEqual(
        conversionFacade['hasSelectedVarient$']
      );
    });
    it('should access the get isLoadingConversionItems selector ', () => {
      expect(conversionFacade.getisLoadingConversionItems()).toEqual(
        conversionFacade['isLoadingConversionItems$']
      );
    });
    it('should access the get hasConversionItems selector ', () => {
      expect(conversionFacade.getHasConverionItemsLoaded()).toEqual(
        conversionFacade['hasConversionItems$']
      );
    });
    it('should access the get conversionItems selector ', () => {
      expect(conversionFacade.getConversionItems()).toEqual(
        conversionFacade['conversionItems$']
      );
    });
    it('should access the get itemSplitResponse selector ', () => {
      expect(conversionFacade.getItemSplitResponse()).toEqual(
        conversionFacade['itemSplitResponse$']
      );
    });
    it('should access the get isSplitting selector ', () => {
      expect(conversionFacade.getIsSplitting()).toEqual(
        conversionFacade['isSplitting$']
      );
    });
    it('should access the get isSplitted selector ', () => {
      expect(conversionFacade.getIsSplitted()).toEqual(
        conversionFacade['isSplitted$']
      );
    });
    it('should access the get isSendingRequest selector ', () => {
      expect(conversionFacade.getIsSendingRequest()).toEqual(
        conversionFacade['isSendingRequest$']
      );
    });
    it('should access the get conversionRequestResponse selector ', () => {
      expect(conversionFacade.getConversionRequestResponse()).toEqual(
        conversionFacade['conversionRequestResponse$']
      );
    });
    it('should access the get hasRequestResponse selector ', () => {
      expect(conversionFacade.getHasRequestResponse()).toEqual(
        conversionFacade['hasRequestResponse$']
      );
    });
    it('should access the get conversionRequestCount selector ', () => {
      expect(conversionFacade.getConversionRequestCount()).toEqual(
        conversionFacade['conversionRequestCount$']
      );
    });
    it('should access the get isConversionCountLoading selector ', () => {
      expect(conversionFacade.getIsLoadingConversionRequestCount()).toEqual(
        conversionFacade['isConversionCountLoading$']
      );
    });
    it('should access the get conversionRequests selector ', () => {
      expect(conversionFacade.getConversionRequests()).toEqual(
        conversionFacade['conversionRequests$']
      );
    });
    it('should access the get isConversionRequestsLoading selector ', () => {
      expect(conversionFacade.getIsLoadingConversionRequests()).toEqual(
        conversionFacade['isConversionRequestsLoading$']
      );
    });
    it('should access the get isSearchingRequests selector ', () => {
      expect(conversionFacade.getIsSearchingRequests()).toEqual(
        conversionFacade['isSearchingRequests$']
      );
    });
    it('should access the get hasSearchedRequests selector ', () => {
      expect(conversionFacade.getHasSearchedRequests()).toEqual(
        conversionFacade['hasSearchedRequests$']
      );
    });
    it('should access the get searchedRequests selector ', () => {
      expect(conversionFacade.getSearchedRequests()).toEqual(
        conversionFacade['searchedRequests$']
      );
    });
    it('should access the get isSelectedRequestLoading selector ', () => {
      expect(conversionFacade.getIsLoadingSelectedRequest()).toEqual(
        conversionFacade['isSelectedRequestLoading$']
      );
    });
    it('should access the get selectedRequest selector ', () => {
      expect(conversionFacade.getSelectedRequest()).toEqual(
        conversionFacade['selectedRequest$']
      );
    });
    it('should access the get isSelectedRequestDataLoading selector ', () => {
      expect(conversionFacade.getIsLoadingSelectedRequestData()).toEqual(
        conversionFacade['isSelectedRequestDataLoading$']
      );
    });
    it('should access the get selectedRequestData selector ', () => {
      expect(conversionFacade.getSelectedRequestData()).toEqual(
        conversionFacade['selectedRequestData$']
      );
    });
    it('should access the get selectRsoDetails selector ', () => {
      expect(conversionFacade.getRsoDetails()).toEqual(
        conversionFacade['selectRsoDetails$']
      );
    });
    it('should access the get selectIsLoadingRsoDetails selector ', () => {
      expect(conversionFacade.getIsLoadingRsoDetails()).toEqual(
        conversionFacade['selectIsLoadingRsoDetails$']
      );
    });
    it('should access the get selectHasRsoDetails selector ', () => {
      expect(conversionFacade.getHasRsoDetails()).toEqual(
        conversionFacade['selectHasRsoDetails$']
      );
    });
    it('should access the get selectBinCodes selector ', () => {
      expect(conversionFacade.getBinCodes()).toEqual(
        conversionFacade['selectBinCodes$']
      );
    });
    it('should access the get selectIsLoading selector ', () => {
      expect(conversionFacade.getIsLoading()).toEqual(
        conversionFacade['selectIsLoading$']
      );
    });
    it('should access the get selectHasBinCodes selector ', () => {
      expect(conversionFacade.getHasBinCodes()).toEqual(
        conversionFacade['selectHasBinCodes$']
      );
    });

    // History Related
    it('should access the get conversionHistory selector ', () => {
      expect(conversionFacade.getConversionHistory()).toEqual(
        conversionFacade['conversionHistory$']
      );
    });
    it('should access the get conversionHistoryCount selector ', () => {
      expect(conversionFacade.getConversionHistoryCount()).toEqual(
        conversionFacade['conversionHistoryCount$']
      );
    });
    it('should access the get isLoadingHistory selector ', () => {
      expect(conversionFacade.getIsLoadingHistory()).toEqual(
        conversionFacade['isLoadingHistory$']
      );
    });
    it('should access the get request sent history selector ', () => {
      expect(conversionFacade.getSelectedRequestHistory()).toEqual(
        conversionFacade['selectedRequestHistory$']
      );
    });
    it('should access the get conversionHistoryItems selector ', () => {
      expect(conversionFacade.getConversionHistoryItems()).toEqual(
        conversionFacade['selectConversionHistoryItems$']
      );
    });
    it('should access the get historyCount selector ', () => {
      expect(conversionFacade.getConversionHistoryItemsCount()).toEqual(
        conversionFacade['selectConversionHistoryItemsCount$']
      );
    });
    it('should access the get requesttype selector ', () => {
      expect(conversionFacade.getRequestType()).toEqual(
        conversionFacade['requestType$']
      );
    });
    it('should access the get advanceFilter selector ', () => {
      expect(conversionFacade.getAdvancedFilter()).toEqual(
        conversionFacade['advancedFilter$']
      );
    });
    it('should access the get error selector ', () => {
      expect(conversionFacade.getError()).toEqual(conversionFacade['error$']);
    });
  });
});
