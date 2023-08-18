import {
  LoadPendingFactorySTN,
  LoadPendingBoutiqueSTN,
  LoadPendingMerchandiseSTN,
  LoadPendingCFAInvoice,
  SearchPendingStocks,
  SearchPendingInvoices,
  SearchClear,
  ClearSearchResult,
  LoadSelectedStock,
  LoadSelectedInvoice,
  LoadItemsTotalCount,
  LoadItems,
  LoadBinCodes,
  LoadRemarks,
  VerifyItem,
  UpdateItem,
  ValidateItem,
  ResetError,
  ClearStocks,
  ConfirmStockReceive,
  VerifyAllItems,
  AssignBinToAllItems,
  LoadProductGroups,
  LoadStuddedProductGroups,
  LoadProductCategories,
  ClearItems,
  LoadStockReceiveHistory,
  LoadStockReceiveInvoiceHistory,
  LoadStockReceiveHistoryItems,
  ResetStockReceiveHistory,
  StoreHistoryType,
  StoreAdvancedFilterData
} from './stock-receive.actions';

import {
  StockReceiveLoadPendingPayload,
  StockReceiveSearchPendingPayload,
  StockReceiveLoadItemsTotalCountPayload,
  StockReceiveLoadItemsPayload,
  StockReceiveUpdateItemPayload,
  StockReceiveItemValidate,
  StockReceiveConfirmStockReceivePayload,
  StockReceiveUpdateAllItemsPayload,
  StockReceiveHistoryPayload,
  StockReceiveHistoryItemsPayload,
  AdvanceFilterPayload
} from '@poss-web/shared/models';

import { Store } from '@ngrx/store';
import { StockReceiveState } from './stock-receive.state';
import { TestBed, inject } from '@angular/core/testing';
import { StockReceiveFacade } from './stock-receive.facade';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { stockAdapter, itemAdapter } from './stock-receive.entity';
import * as moment from 'moment';

describe('Stock Receive facade Testing Suite action', () => {
  const initialState: StockReceiveState = {
    isLoadingImage: true,
    oracleFetchInfo : null,
    pendingFactorySTN: stockAdapter.getInitialState(),
    pendingBoutiqueSTN: stockAdapter.getInitialState(),
    pendingMerchandiseSTN: stockAdapter.getInitialState(),
    pendingCFAInvoice: stockAdapter.getInitialState(),
    searchStockResults: stockAdapter.getInitialState(),
    searchInvoiceResults: stockAdapter.getInitialState(),
    isLoadingPendingFactorySTN: false,
    isLoadingPendingBoutiqueSTN: false,
    isLoadingPendingMerchandiseSTN: false,
    isLoadingPendingCFAInvoice: false,
    isSearchingStocks: false,
    hasSearchStockResults: false,

    isSearchingInvoices: false,
    hasSearchInvoiceResults: false,

    // for item verification in detail page
    selectedStock: null,
    selectedInvoice: null,
    isLoadingSelectedStock: false,

    isItemsTotalCountLoading: false,
    isItemsTotalCountLoaded: null,

    items: itemAdapter.getInitialState(),
    isItemsLoading: false,
    isItemsLoaded: null,
    itemsCount: 0,
    totalCounts: {
      nonVerifiedItemsTotalCount: 0,
      verifiedItemsTotalCount: 0,
      isLoaded: false
    },
    verifyItemSuccess: null,
    updateItemSuccess: null,

    isVerifyingAllItem: false,
    isVerifyingAllItemSuccess: null,

    isAssigningBinToAllItems: false,
    isAssigningBinToAllItemsSuccess: null,

    binCodes: [],
    remarks: [],
    isLoadingBinGroups: false,
    isLoadingRemarks: false,

    confirmedStock: null,
    isConfirmStockReceiveSuccess: null,
    isConfirmingStockReceive: false,

    isTotalMeasuredWeightLoading: false,
    totalMeasuredWeight: 0,

    productGroups: [],
    isLoadingProductGroups: false,

    productCategories: [],
    isLoadingProductCategories: false,

    studdedProductGroups: [],

    searchReset: {
      reset: false
    },
    error: null,
    //history
    stockReceiveHistory: stockAdapter.getInitialState(),
    isLoadingHistory: false,
    totalElements: 0,
    historyType: null,
    advancedFilter: {
      docNumber: null,
      docFromDate: moment().valueOf(),
      docToDate: moment().valueOf(),
      stnNumber: null,
      sourceLocationCode: null,
      fiscalYear: null
    }

  };

  let stockReceiveFacade: StockReceiveFacade;
  /*
 | LoadPendingFactorySTN
  | LoadPendingFactorySTNSuccess
  | LoadPendingFactorySTNFailure
*/

  let store: Store;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), StockReceiveFacade]
    });

    stockReceiveFacade = TestBed.inject(StockReceiveFacade);
    store = TestBed.inject(Store);
  });

  // describe(' Pending Factory STN action', () => {
  //   it('should call load pending factory stn action', inject(
  //     [Store],
  //     store => {
  //       const parameters: StockReceiveLoadPendingPayload = {
  //         pageIndex: 0,
  //         pageSize: 100
  //       };
  //       const storeSpy = spyOn(store, 'dispatch').and.callThrough();
  //       const expectedAction = new LoadPendingFactorySTN(parameters);
  //       stockReceiveFacade.loadPendingFactorySTN(parameters);
  //       expect(storeSpy).toHaveBeenCalledWith(expectedAction);
  //     }
  //   ));
  // });

  describe('Dispatch Actions action', () => {
    it('should call LOAD_PENDING_FACTORY_STN action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: StockReceiveLoadPendingPayload = {
        pageIndex: 0,
        pageSize: 100
      };
      const action = new LoadPendingFactorySTN(payload);
      stockReceiveFacade.loadPendingFactorySTN(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LOAD_PENDING_BOUTIQUE_STN action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: StockReceiveLoadPendingPayload = {
        pageIndex: 0,
        pageSize: 100
      };
      const action = new LoadPendingBoutiqueSTN(payload);
      stockReceiveFacade.loadPendingBoutiqueSTN(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LOAD_PENDING_MERCHANDISE_STN action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: StockReceiveLoadPendingPayload = {
        pageIndex: 0,
        pageSize: 100
      };
      const action = new LoadPendingMerchandiseSTN(payload);
      stockReceiveFacade.loadPendingMerchandiseSTN(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LOAD_PENDING_CFA_INVOICE action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: StockReceiveLoadPendingPayload = {
        pageIndex: 0,
        pageSize: 100
      };
      const action = new LoadPendingCFAInvoice(payload);
      stockReceiveFacade.loadPendingCFAInvoice(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call SEARCH_PENDING_STOCKS action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const parameters: StockReceiveSearchPendingPayload = {
        srcDocnumber: "0",
        type: 'R'
      };
      const action = new SearchPendingStocks(parameters);
      stockReceiveFacade.searchPendingStocks(parameters);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call SEARCH_PENDING_INVOICES action', () => {
      const parameters: StockReceiveSearchPendingPayload = {
        srcDocnumber:"0",
        type: 'R'
      };
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new SearchPendingInvoices(parameters);
      stockReceiveFacade.searchPendingInvoices(parameters);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call SEARCH_CLEAR action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new SearchClear();
      stockReceiveFacade.searchClear();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call CLEAR_SEARCH_RESULT action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new ClearSearchResult();
      stockReceiveFacade.clearSearchResult();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LOAD_SELECTED_STOCK action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const parameters: any = {
        id: 'stock1',
        type: 'P'
      };
      const action = new LoadSelectedStock(parameters);
      stockReceiveFacade.loadSelectedStock(parameters);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LOAD_SELECTED_INVOICE action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const parameters: any = {
        id: 'stock1',
        type: 'P'
      };
      const action = new LoadSelectedInvoice(parameters);
      stockReceiveFacade.loadSelectedInvoice(parameters);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LOAD_ItEMS_COUNT action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const parameters: StockReceiveLoadItemsTotalCountPayload = {
        storeType: 'L1',
        type: 'P',
        id: 1000000
      };
      const action = new LoadItemsTotalCount(parameters);
      stockReceiveFacade.loadItemsTotalCount(parameters);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LOAD_ITEMS action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const parameters: StockReceiveLoadItemsPayload = {
        storeType: 'L2',
        type: 'R',
        id: 1,
        status: 'received',
        itemCode: 'STK',
        lotNumber: '1',
        pageIndex: 1,
        pageSize: 100,
        sortBy: 'LTH',
        sortOrder: 'HTL',
        filter: [{ key: '', value: [] }],
        isSearchReset: false,
        isHistory: false,
        historyType: 'history'
      };
      const action = new LoadItems(parameters);
      stockReceiveFacade.loadItems(parameters);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LOAD_BIN_CODES action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const binGroupCode = 'bangle';
      const action = new LoadBinCodes(binGroupCode);
      stockReceiveFacade.loadBinCodes(binGroupCode);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LOAD_REMARKS action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new LoadRemarks();
      stockReceiveFacade.loadRemarks();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call VERIFY_ITEM action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const parameters: StockReceiveUpdateItemPayload = {
        type: 'P',
        storeType: 'L3',
        id: 1,
        itemId: '1',
        newUpdate: {
          binCode: '',
          binGroupCode: '',
          measuredWeight: 1,
          remarks: '',
          itemDetails: ''
        },
        actualDetails: {
          binCode: '',
          binGroupCode: '',
          measuredWeight: 1,
          remarks: '',
          itemDetails: ''
        },
        loadItemsPayload: {
          storeType: 'L2',
          type: 'R',
          id: 1,
          status: 'received',
          itemCode: 'STK',
          lotNumber: '1',
          pageIndex: 1,
          pageSize: 100,
          sortBy: 'LTH',
          sortOrder: 'HTL',
          filter: [{ key: '', value: [] }],
          isSearchReset: false,
          isHistory: false,
          historyType: 'history'
        },
        loadTemsCountPayload: {
          storeType: 'L2',
          type: 'R',
          id: 1
        }
      };
      const action = new VerifyItem(parameters);
      stockReceiveFacade.verifyItem(parameters);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call UPADTE_ITEM action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const parameters: StockReceiveUpdateItemPayload = {
        type: 'P',
        storeType: 'L3',
        id: 1,
        itemId: '1',
        newUpdate: {
          binCode: '',
          binGroupCode: '',
          measuredWeight: 1,
          remarks: '',
          itemDetails: ''
        },
        actualDetails: {
          binCode: '',
          binGroupCode: '',
          measuredWeight: 1,
          remarks: '',
          itemDetails: ''
        },
        loadItemsPayload: {
          storeType: 'L2',
          type: 'R',
          id: 1,
          status: 'received',
          itemCode: 'STK',
          lotNumber: '1',
          pageIndex: 1,
          pageSize: 100,
          sortBy: 'LTH',
          sortOrder: 'HTL',
          filter: [{ key: '', value: [] }],
          isSearchReset: false,
          isHistory: false,
          historyType: 'history'
        },
        loadTemsCountPayload: {
          storeType: 'L2',
          type: 'R',
          id: 1
        }
      };
      const action = new UpdateItem(parameters);
      stockReceiveFacade.updateItem(parameters);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call VALIDATE_ITEM action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const parameters: StockReceiveItemValidate = {
        itemId: '',
        productGroupCode: '',
        availableWeight: 1,
        measuredWeight: 1,
        measuredQuantity: 1,
        availableQuantity: 1
      };
      const action = new ValidateItem(parameters);
      stockReceiveFacade.validateItem(parameters);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call RESET_ERROR action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new ResetError();
      stockReceiveFacade.resetError();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call CLEAR_STOCKS action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new ClearStocks();
      stockReceiveFacade.clearStocks();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call CONFIRM_STOCK_RECEIVE action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const parameters: StockReceiveConfirmStockReceivePayload = {
        type: 'P',
        storeType: 'L2',
        id: 1,
        confirmReceive: {
          courierReceivedDate: '',
          reasonForDelay: '',
          receivedDate: '',
          remarks: ''
        }
      };
      const action = new ConfirmStockReceive(parameters);
      stockReceiveFacade.confirmStock(parameters);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call VERIFY_ALL_ITEMS action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const parameters: StockReceiveUpdateAllItemsPayload = {
        type: 'R',
        storeType: 'L3',
        id: 1,
        data: {
          binCode: 'B',
          id: ['1', '2', '3'],
          status: 'received'
        }
      };
      const action = new VerifyAllItems(parameters);
      stockReceiveFacade.verifyAllItems(parameters);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call ASSIGN_BIN_ALL_ITEMS items action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const parameters: StockReceiveUpdateAllItemsPayload = {
        type: 'R',
        storeType: 'L3',
        id: 1,
        data: {
          binCode: 'B',
          id: ['1', '2', '3'],
          status: 'received'
        }
      };
      const action = new AssignBinToAllItems(parameters);
      stockReceiveFacade.assignBinToAllItems(parameters);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LOAD_PRODUCT_GROUPS action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new LoadProductGroups();
      stockReceiveFacade.loadProductGroups();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LOAD_STUDDED_PRODUCT_GROUPS action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new LoadStuddedProductGroups();
      stockReceiveFacade.loadStuddedProductGroups();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LOAD_PRODUCT_CATEGORIES action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new LoadProductCategories();
      stockReceiveFacade.loadProductCategories();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call CLEAR_ITEMS action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new ClearItems();
      stockReceiveFacade.clearItems();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LOAD_STOCK_RECEIVE_HISTORY action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const parameters: StockReceiveHistoryPayload = {
        data: {
          dateRangeType: 'TODAY',
          destDocNo: 1,
          destFiscalYear: 1,
          endDate: 1,
          locationCode: '',
          srcDocNo: 1,
          srcFiscalYear: 1,
          startDate: 1,
          statuses: [],
          actionType: '',
          invoiceType: ''
        },
        transferType: null,
        pageIndex: 0,
        pageSize: 100
      };
      const action = new LoadStockReceiveHistory(parameters);
      stockReceiveFacade.loadStockReceiveHistory(parameters);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LOAD_STOCK_RECEIVE_INVOICE_HISTORY action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const parameters: StockReceiveHistoryPayload = {
        data: {
          dateRangeType: 'TODAY',
          destDocNo: 1,
          destFiscalYear: 1,
          endDate: 1,
          locationCode: '',
          srcDocNo: 1,
          srcFiscalYear: 1,
          startDate: 1,
          statuses: [],
          actionType: '',
          invoiceType: ''
        },
        transferType: null,
        pageIndex: 0,
        pageSize: 100
      };
      const action = new LoadStockReceiveInvoiceHistory(parameters);
      stockReceiveFacade.loadStockReceiveInvoiceHistory(parameters);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('for L1/L2 it should call LOAD_STOCK_RECEIVE_HISTORY_ITEMS action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const parameters: StockReceiveHistoryItemsPayload = {
        StockReceiveHistoryItem: {
          binCodes: '',
          binGroupCode: '',
          itemCode: '',
          lotNumber: '',
          productCategories: '',
          productGroups: '',
          statuses: ''
        },
        pageIndex: 0,
        pageSize: 100,
        id: '1',
        isL1L2Store: true,
        isL3Store: false,
        sort: [],
        sortOrder: '',
        historyAPIType: 'TEST'
      };
      const action = new LoadStockReceiveHistoryItems(parameters);
      stockReceiveFacade.loadStockReceiveHistoryItems(parameters);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('for L3 it should call LOAD_STOCK_RECEIVE_HISTORY_ITEMS action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const parameters: StockReceiveHistoryItemsPayload = {
        StockReceiveHistoryItem: {
          binCodes: '',
          binGroupCode: '',
          itemCode: '',
          lotNumber: '',
          productCategories: '',
          productGroups: '',
          statuses: ''
        },
        pageIndex: 0,
        pageSize: 100,
        id: '1',
        isL1L2Store: false,
        isL3Store: true,
        sort: [],
        sortOrder: '',
        historyAPIType: 'TEST'
      };
      const action = new LoadStockReceiveHistoryItems(parameters);
      stockReceiveFacade.loadStockReceiveHistoryItems(parameters);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call RESET_STOCK_RECEIVE_HISTORY action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new ResetStockReceiveHistory();
      stockReceiveFacade.resetStockReceiveHistory();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call STORE_HISTORY_TYPE action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const historyType = 'H';
      const action = new StoreHistoryType(historyType);
      stockReceiveFacade.storeHistoryType(historyType);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call STORE_ADVANCED_FILTER_DATE action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const parameters: AdvanceFilterPayload = {
        docFromDate: 1,
        docToDate: 1,
        stnNumber: 1,
        sourceLocationCode: '',
        fiscalYear: '',
        docNumber: ''
      };
      const action = new StoreAdvancedFilterData(parameters);
      stockReceiveFacade.storeAdvancedFilterData(parameters);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
  });

  describe('Access  selector ', () => {
    it('should access the get pending factory stn  selector ', () => {
      expect(stockReceiveFacade.getPendingFactorySTN()).toEqual(
        stockReceiveFacade['pendingFactorySTN$']
      );
    });

    it('should access the get pending boutique stn  selector ', () => {
      expect(stockReceiveFacade.getPendingBoutiqueSTN()).toEqual(
        stockReceiveFacade['pendingBoutiqueSTN$']
      );
    });

    it('should access the get pending merchandise stn  selector ', () => {
      expect(stockReceiveFacade.getPendingMerchandiseSTN()).toEqual(
        stockReceiveFacade['pendingMerchandiseSTN$']
      );
    });

    it('should access the getPendingCFAInvoice  selector ', () => {
      expect(stockReceiveFacade.getPendingCFAInvoice()).toEqual(
        stockReceiveFacade['pendingCFAInvoice$']
      );
    });
    it('should access the getSearchStockResults  selector ', () => {
      expect(stockReceiveFacade.getSearchStockResults()).toEqual(
        stockReceiveFacade['searchStockResults$']
      );
    });

    it('should access the getSearchInvoiceResults  selector ', () => {
      expect(stockReceiveFacade.getSearchInvoiceResults()).toEqual(
        stockReceiveFacade['searchInvoiceResults$']
      );
    });

    it('should access the getIsLoadingPendingFactorySTN  selector ', () => {
      expect(stockReceiveFacade.getIsLoadingPendingFactorySTN()).toEqual(
        stockReceiveFacade['isLoadingPendingFactorySTN$']
      );
    });

    it('should access the getIsLoadingPendingBoutiqueSTN  selector ', () => {
      expect(stockReceiveFacade.getIsLoadingPendingBoutiqueSTN()).toEqual(
        stockReceiveFacade['isLoadingPendingBoutiqueSTN$']
      );
    });

    it('should access the getILoadingPendingMerchandiseSTN  selector ', () => {
      expect(stockReceiveFacade.getILoadingPendingMerchandiseSTN()).toEqual(
        stockReceiveFacade['isLoadingPendingMerchandiseSTN$']
      );
    });

    it('should access the getIsLoadingPendingCFAInvoice  selector ', () => {
      expect(stockReceiveFacade.getIsLoadingPendingCFAInvoice()).toEqual(
        stockReceiveFacade['isLoadingPendingCFAInvoice$']
      );
    });

    it('should access the getIsSearchingStocks  selector ', () => {
      expect(stockReceiveFacade.getIsSearchingStocks()).toEqual(
        stockReceiveFacade['isSearchingStocks$']
      );
    });

    it('should access the getHasSearchStockResults  selector ', () => {
      expect(stockReceiveFacade.getHasSearchStockResults()).toEqual(
        stockReceiveFacade['hasSearchStockResults$']
      );
    });

    it('should access the getIsSearchingInvoices  selector ', () => {
      expect(stockReceiveFacade.getIsSearchingInvoices()).toEqual(
        stockReceiveFacade['isSearchingInvoices$']
      );
    });

    it('should access the getHasSearchInvoiceResults  selector ', () => {
      expect(stockReceiveFacade.getHasSearchInvoiceResults()).toEqual(
        stockReceiveFacade['hasSearchInvoiceResults$']
      );
    });

    it('should access the getError  selector ', () => {
      expect(stockReceiveFacade.getError()).toEqual(
        stockReceiveFacade['error$']
      );
    });

    it('should access the getIsLoadingSelectedStock  selector ', () => {
      expect(stockReceiveFacade.getIsLoadingSelectedStock()).toEqual(
        stockReceiveFacade['isLoadingSelectedStock$']
      );
    });

    it('should access the getSelectedStock  selector ', () => {
      expect(stockReceiveFacade.getSelectedStock()).toEqual(
        stockReceiveFacade['selectedStock$']
      );
    });

    it('should access the getSelectedInvoice  selector ', () => {
      expect(stockReceiveFacade.getSelectedInvoice()).toEqual(
        stockReceiveFacade['selectedInvoice$']
      );
    });

    it('should access the getTotalCounts  selector ', () => {
      expect(stockReceiveFacade.getTotalCounts()).toEqual(
        stockReceiveFacade['totalCounts$']
      );
    });

    it('should access the getIsItemsTotalCountLoading  selector ', () => {
      expect(stockReceiveFacade.getIsItemsTotalCountLoading()).toEqual(
        stockReceiveFacade['isItemsTotalCountLoading$']
      );
    });

    it('should access the getItemsTotalCountLoaded  selector ', () => {
      expect(stockReceiveFacade.getItemsTotalCountLoaded()).toEqual(
        stockReceiveFacade['itemsTotalCountLoaded$']
      );
    });

    it('should access the getItems  selector ', () => {
      expect(stockReceiveFacade.getItems()).toEqual(
        stockReceiveFacade['items$']
      );
    });

    it('should access the getIsItemsLoading  selector ', () => {
      expect(stockReceiveFacade.getIsItemsLoading()).toEqual(
        stockReceiveFacade['itemsLoading$']
      );
    });

    it('should access the getVerifyItemSuccess  selector ', () => {
      expect(stockReceiveFacade.getVerifyItemSuccess()).toEqual(
        stockReceiveFacade['verifyItemSuccess$']
      );
    });

    it('should access the getUpdateItemSuccess  selector ', () => {
      expect(stockReceiveFacade.getUpdateItemSuccess()).toEqual(
        stockReceiveFacade['updateItemSuccess$']
      );
    });

    it('should access the getItemsCount  selector ', () => {
      expect(stockReceiveFacade.getItemsCount()).toEqual(
        stockReceiveFacade['itemsCount$']
      );
    });

    it('should access the getBinCodes  selector ', () => {
      expect(stockReceiveFacade.getBinCodes()).toEqual(
        stockReceiveFacade['binCodes$']
      );
    });

    it('should access the getRemarks  selector ', () => {
      expect(stockReceiveFacade.getRemarks()).toEqual(
        stockReceiveFacade['remarks$']
      );
    });

    it('should access the getIsItemsLoaded  selector ', () => {
      expect(stockReceiveFacade.getIsItemsLoaded()).toEqual(
        stockReceiveFacade['isItemsLoaded$']
      );
    });

    it('should access the getIsLoadingBinGroups  selector ', () => {
      expect(stockReceiveFacade.getIsLoadingBinGroups()).toEqual(
        stockReceiveFacade['isLoadingBinGroups$']
      );
    });
    it('should access the getIsLoadingRemarks  selector ', () => {
      expect(stockReceiveFacade.getIsLoadingRemarks()).toEqual(
        stockReceiveFacade['isLoadingRemarks$']
      );
    });

    it('should access the getProductGroups  selector ', () => {
      expect(stockReceiveFacade.getProductGroups()).toEqual(
        stockReceiveFacade['productGroups$']
      );
    });

    it('should access the getIsLoadingProductGroups  selector ', () => {
      expect(stockReceiveFacade.getIsLoadingProductGroups()).toEqual(
        stockReceiveFacade['isLoadingProductGroups$']
      );
    });

    it('should access the getProductCategories  selector ', () => {
      expect(stockReceiveFacade.getProductCategories()).toEqual(
        stockReceiveFacade['productCategories$']
      );
    });

    it('should access the getIsLoadingProductCategories  selector ', () => {
      expect(stockReceiveFacade.getIsLoadingProductCategories()).toEqual(
        stockReceiveFacade['isLoadingProductCategories$']
      );
    });

    it('should access the getConfirmedStock  selector ', () => {
      expect(stockReceiveFacade.getConfirmedStock()).toEqual(
        stockReceiveFacade['confirmedStock$']
      );
    });

    it('should access the getIsConfirmStockReceiveSuccess  selector ', () => {
      expect(stockReceiveFacade.getIsConfirmStockReceiveSuccess()).toEqual(
        stockReceiveFacade['isConfirmStockReceiveSuccess$']
      );
    });

    it('should access the getIsConfirmingStockReceive  selector ', () => {
      expect(stockReceiveFacade.getIsConfirmingStockReceive()).toEqual(
        stockReceiveFacade['isConfirmingStockReceive$']
      );
    });

    it('should access the getIsVerifyingAllItem  selector ', () => {
      expect(stockReceiveFacade.getIsVerifyingAllItem()).toEqual(
        stockReceiveFacade['isVerifyingAllItem$']
      );
    });

    it('should access the getIsVerifyingAllItemSuccess  selector ', () => {
      expect(stockReceiveFacade.getIsVerifyingAllItemSuccess()).toEqual(
        stockReceiveFacade['isVerifyingAllItemSuccess$']
      );
    });

    it('should access the getSearchReset  selector ', () => {
      expect(stockReceiveFacade.getSearchReset()).toEqual(
        stockReceiveFacade['searchReset$']
      );
    });

    it('should access the getStockReceiveHistory  selector ', () => {
      expect(stockReceiveFacade.getStockReceiveHistory()).toEqual(
        stockReceiveFacade['stockReceiveHistory$']
      );
    });

    it('should access the getIsLoadingHistory  selector ', () => {
      expect(stockReceiveFacade.getIsLoadingHistory()).toEqual(
        stockReceiveFacade['isLoadingHistory$']
      );
    });

    it('should access the getHistoryTotalElements  selector ', () => {
      expect(stockReceiveFacade.getHistoryTotalElements()).toEqual(
        stockReceiveFacade['historyTotalElements$']
      );
    });

    it('should access the getHistoryType  selector ', () => {
      expect(stockReceiveFacade.getHistoryType()).toEqual(
        stockReceiveFacade['historyType$']
      );
    });

    it('should access the getAdvancedFilter  selector ', () => {
      expect(stockReceiveFacade.getAdvancedFilter()).toEqual(
        stockReceiveFacade['advancedFilter$']
      );
    });

    it('should access the getIsAssigningBinToAllItems  selector ', () => {
      expect(stockReceiveFacade.getIsAssigningBinToAllItems()).toEqual(
        stockReceiveFacade['isAssigningBinToAllItems$']
      );
    });

    it('should access the getIsAssigningBinToAllItemsSuccess  selector ', () => {
      expect(stockReceiveFacade.getIsAssigningBinToAllItemsSuccess()).toEqual(
        stockReceiveFacade['isAssigningBinToAllItemsSuccess$']
      );
    });
  });
});
