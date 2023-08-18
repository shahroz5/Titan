import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import * as moment from 'moment';
import { itemAdaptor, requestInvoiceAdaptor } from './stock-return.entity';
import { StockReturnFacade } from './stock-return.facade';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { StockReturnState } from './stock-return.state';
import {
  ConfirmStockReturnPayload,
  CreateIssueItemsPayload,
  HistoryAdvancedFilterPayload,
  LoadStockIssueInvoiceHistory,
  LoadStockIssueInvoiceHistoryPayload,
  LoadStockReturnItemsPayload,
  RemoveSelectedItemsPayload,
  SearchItemPayload
} from '@poss-web/shared/models';
import {
  ClearSearch,
  ConfirmIssue,
  CreateIssueItems,
  CreateRequestToCfa,
  LoadCFALocationCode,
  LoadCourierDetails,
  LoadEmployeeCodes,
  LoadEmployeeDetails,
  LoadHeaderLevelDetails,
  LoadIssueInvoiceHistory,
  LoadItems,
  LoadProductCategories,
  LoadProductGroups,
  LoadProductGroupsFailure,
  LoadStuddedProductGroups,
  RemoveSelectedItems,
  ResetAdavanceFilter,
  ResetStockReturnHistory,
  ResetStockReturnItems,
  SearchItem,
  SelectedProductsSearch,
  StoreAdvancedFilterData,
  StoreHistoryType
} from './stock-return.actions';

describe('StockReturn Facade Testing Suite', () => {
  const invoceHistory: LoadStockIssueInvoiceHistory = {
    actionType: 'INVOICE',
    dateRangeType: 'Custom',
    destDocNo: 21,
    destFiscalYear: '2019',
    endDate: 12312321312,
    locationCode: 'PNA',
    srcDocNo: 123,
    srcFiscalYear: '2020',
    startDate: 2222222,
    statuses: []
  };
  const advanceFilter: HistoryAdvancedFilterPayload = {
    docFromDate: 12312213,
    docToDate: 2123121,
    fiscalYear: '2019',
    invoiceNumber: 'INVOICE'
  };
  const historyPayload: LoadStockIssueInvoiceHistoryPayload = {
    loadStockIssueInvoiceHistory: invoceHistory,
    pageIndex: 0,
    pageSize: 10,
    invoiceType: 'ISSUE_INVOICE'
  };
  const initialState: StockReturnState = {
    newRequestId: null,
    loadedItems: itemAdaptor.getInitialState(),
    sortedItems: itemAdaptor.getInitialState(),
    isLoading: false,
    hasSearchedItem: null,
    searchedItems: itemAdaptor.getInitialState(),
    invoiceNumber: null,
    hasIssued: null,
    CFAddress: null,
    totalItemCount: 0,
    selectedProductsSearchCount: null,
    hasSearched: false,
    hasLoaded: false,
    error: null,
    hasUpdated: null,
    hasRemovedMultipleItems: null,
    hasSelectedProductsSearch: null,
    searchCount: null,
    courierDetails: null,
    headerLevelDetails: null,
    productCategories: [],
    productGroups: [],
    employeeCodes: [],
    employeeDetails: null,
    invoiceHistory: requestInvoiceAdaptor.getInitialState(),
    totalHistoryInvoiceItems: 0,
    isLoadingHistory: null,
    advancedFilter: {
      docFromDate: moment().startOf('day').valueOf(),
      docToDate: moment().endOf('day').valueOf(),
      fiscalYear: null,
      invoiceNumber: null
    },
    historyType: null,
    studdedProductGroups: [],
    isLoadingImage: false,
    items: undefined
  };
  let stockReturnFacade: StockReturnFacade;
  let store: Store;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), StockReturnFacade]
    });
    stockReturnFacade = TestBed.inject(StockReturnFacade);
    store = TestBed.inject(Store);
  });
  const searchItemPayload: LoadStockReturnItemsPayload = {
    id: 12,
    pageSize: 10,
    pageIndex: 1,
    sortBy: null,
    sortOrder: null,
    itemId: '12333333',
    lotNumber: '123333',
    filter: [{ key: '', value: [] }]
  };
  describe('Dispatch Action TestCases', () => {
    it('should call SELECTED_PRODUCTS_SEARCH', () => {
      spyOn(store, 'dispatch').and.returnValue({});

      const action = new SelectedProductsSearch(searchItemPayload);
      stockReturnFacade.selectedProductsSearch(searchItemPayload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call LOAD_CFA_LOCATION_CODE', () => {
      spyOn(store, 'dispatch').and.returnValue({});

      const action = new LoadCFALocationCode();
      stockReturnFacade.loadCFAddress();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call LOAD_ITEMS', () => {
      const payload: LoadStockReturnItemsPayload = {
        id: 12,
        pageSize: 10,
        pageIndex: 1,
        sortBy: null,
        sortOrder: null,
        itemId: null,
        lotNumber: 'null',
        filter: null
      };
      spyOn(store, 'dispatch').and.returnValue({});

      const action = new LoadItems(payload);
      stockReturnFacade.loadItemCFA(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call LOAD_ITEMS', () => {
      const payload: LoadStockReturnItemsPayload = {
        id: 12,
        pageSize: 10,
        pageIndex: 1,
        sortBy: null,
        sortOrder: null,
        itemId: null,
        lotNumber: 'null',
        filter: null
      };
      spyOn(store, 'dispatch').and.returnValue({});

      const action = new LoadItems(payload);
      stockReturnFacade.loadItemCFA(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call CREATE_REQUEST_TO_CFA', () => {
      spyOn(store, 'dispatch').and.returnValue({});

      const action = new CreateRequestToCfa();
      stockReturnFacade.createRequestToCfa();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call CREATE_REQUEST_TO_CFA', () => {
      spyOn(store, 'dispatch').and.returnValue({});

      const action = new CreateRequestToCfa();
      stockReturnFacade.createRequestToCfa();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call CONFIRM_ISSUE', () => {
      const confirmIssue: ConfirmStockReturnPayload = {
        id: 231,
        confirmIssue: {
          cfaLocationCode: 'pna',
          remarks: 'good',
          carrierDetails: {
            type: 'BLUE DART',
            data: {}
          }
        }
      };
      spyOn(store, 'dispatch').and.returnValue({});

      const action = new ConfirmIssue(confirmIssue);
      stockReturnFacade.confirmIssue(confirmIssue);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call SEARCH_ITEM', () => {
      const searchVariantCode: SearchItemPayload = {
        id: 23,
        variantCode: '123123123',
        lotNumber: '12312312'
      };
      spyOn(store, 'dispatch').and.returnValue({});

      const action = new SearchItem(searchVariantCode);
      stockReturnFacade.searchItems(searchVariantCode);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call REMOVE_SELECTED_ITEMS', () => {
      const removeSelectedItems: RemoveSelectedItemsPayload = {
        requestId: 230,
        itemIds: [21, 22]
      };
      spyOn(store, 'dispatch').and.returnValue({});

      const action = new RemoveSelectedItems(removeSelectedItems);
      stockReturnFacade.removeSelectedItems(removeSelectedItems);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call CREATE_ISSUE_ITEMS', () => {
      const createIssueItems: CreateIssueItemsPayload = {
        id: 123,
        invoiceItems: [{ inventoryId: 132123123 }]
      };

      spyOn(store, 'dispatch').and.returnValue({});

      const action = new CreateIssueItems(createIssueItems);
      stockReturnFacade.createIssueItems(createIssueItems);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call CLEAR_SEARCH', () => {
      spyOn(store, 'dispatch').and.returnValue({});

      const action = new ClearSearch();
      stockReturnFacade.clearSearch();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call LOAD_COURIER_DETAILS', () => {
      spyOn(store, 'dispatch').and.returnValue({});

      const action = new LoadCourierDetails();
      stockReturnFacade.loadCourierDetails();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call LOAD_EMPLOYEE_DETAILS', () => {
      spyOn(store, 'dispatch').and.returnValue({});

      const action = new LoadEmployeeDetails('abc');
      stockReturnFacade.loadEmployeeDetails('abc');
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call LOAD_HEADER_LEVEL_DETAILS', () => {
      spyOn(store, 'dispatch').and.returnValue({});

      const action = new LoadHeaderLevelDetails(230);
      stockReturnFacade.loadHeaderLevelDetails(230);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call LOAD_PROUDCT_GROUPS', () => {
      spyOn(store, 'dispatch').and.returnValue({});

      const action = new LoadProductGroups();
      stockReturnFacade.loadProductGroups();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call LOAD_PRODUCT_CATEGORIES', () => {
      spyOn(store, 'dispatch').and.returnValue({});

      const action = new LoadProductCategories();
      stockReturnFacade.loadProductCategories();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call LOAD_EMPLOYEE_CODES', () => {
      spyOn(store, 'dispatch').and.returnValue({});

      const action = new LoadEmployeeCodes();
      stockReturnFacade.loadEmployeeCodes();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call LOAD_EMPLOYEE_CODES', () => {
      spyOn(store, 'dispatch').and.returnValue({});

      const action = new LoadEmployeeCodes();
      stockReturnFacade.loadEmployeeCodes();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call LOAD_STUDDED_PRODUCT_GROUPS', () => {
      spyOn(store, 'dispatch').and.returnValue({});

      const action = new LoadStuddedProductGroups();
      stockReturnFacade.loadStuddedProductGroups();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call LOAD_ISSUE_INVOICE_HISTORY', () => {
      spyOn(store, 'dispatch').and.returnValue({});

      const action = new LoadIssueInvoiceHistory(historyPayload);
      stockReturnFacade.loadIssueInvoiceHistory(historyPayload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call STORE_HISTORY_TYPE', () => {
      spyOn(store, 'dispatch').and.returnValue({});

      const action = new StoreHistoryType('INVOICE');
      stockReturnFacade.storeHistoryType('INVOICE');
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call STORE_ADVANCED_FILTER_DATE', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new StoreAdvancedFilterData(advanceFilter);
      stockReturnFacade.storeAdvancedFilterData(advanceFilter);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call RESET_STOCK_RETURN_HISTORY', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new ResetStockReturnHistory();
      stockReturnFacade.resetStockReturnHistory();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call RESET_STOCK_RETURN_HISTORY', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new ResetStockReturnItems();
      stockReturnFacade.resetStockReturnItems();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call RESET_ADVANCE_FILTER', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new ResetAdavanceFilter(123);
      stockReturnFacade.resetAdvanceFilter(123);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
  });
  describe('Access Seletor TestCases', () => {
    it('should access the get requestid', () => {
      expect(stockReturnFacade.getNewRequestId()).toEqual(
        stockReturnFacade['newRequestId$']
      );
    });

    it('should access the get selectedproducts search', () => {
      expect(stockReturnFacade.getHasSelectedProductsSearch()).toEqual(
        stockReturnFacade['hasSelectedProductsSearch$']
      );
    });
    it('should access the get hasremove multiple items', () => {
      expect(stockReturnFacade.getHasRemovedMultipleItems()).toEqual(
        stockReturnFacade['hasRemovedMultipleItems$']
      );
    });
    it('should access the get hassearch', () => {
      expect(stockReturnFacade.getHasSearched()).toEqual(
        stockReturnFacade['hasSearched$']
      );
    });
    it('should access the get cfaitems', () => {
      expect(stockReturnFacade.getCFAItems()).toEqual(
        stockReturnFacade['selectCFAItems$']
      );
    });
    it('should access the get totalitems count', () => {
      expect(stockReturnFacade.getTotalItemsCount()).toEqual(
        stockReturnFacade['selectTotalItemsCount$']
      );
    });
    it('should access the get cfacode', () => {
      expect(stockReturnFacade.getCFACode()).toEqual(
        stockReturnFacade['cfaCode$']
      );
    });
    it('should access the get cfacode', () => {
      expect(stockReturnFacade.getconfirmedReturnInvoiceCfa()).toEqual(
        stockReturnFacade['confirmedReturnInvoiceCfa$']
      );
    });
    it('should access the get error', () => {
      expect(stockReturnFacade.getError()).toEqual(stockReturnFacade['error$']);
    });
    it('should access the get isloading', () => {
      expect(stockReturnFacade.getIsloading()).toEqual(
        stockReturnFacade['isLoading$']
      );
    });
    it('should access the get confirmedcfa', () => {
      expect(stockReturnFacade.getconfirmedReturnInvoiceCfa()).toEqual(
        stockReturnFacade['confirmedReturnInvoiceCfa$']
      );
    });
    it('should access the get hassearched result', () => {
      expect(stockReturnFacade.getHasSearchResult()).toEqual(
        stockReturnFacade['hasSearcheResult$']
      );
    });
    it('should access the get searched items', () => {
      expect(stockReturnFacade.getSearchedItems()).toEqual(
        stockReturnFacade['searchedItems$']
      );
    });
    it('should access the get issued items', () => {
      expect(stockReturnFacade.getHasItemsIssued()).toEqual(
        stockReturnFacade['issueItemSuccess$']
      );
    });
    it('should access the get search count', () => {
      expect(stockReturnFacade.getSearchCount()).toEqual(
        stockReturnFacade['selectSearchCount$']
      );
    });
    it('should access the get carrier details', () => {
      expect(stockReturnFacade.getCourierDetails()).toEqual(
        stockReturnFacade['courierDetails$']
      );
    });
    it('should access the get header details', () => {
      expect(stockReturnFacade.getHeaderLevelDetails()).toEqual(
        stockReturnFacade['headerLevelDetails$']
      );
    });
    it('should access the get product groups', () => {
      expect(stockReturnFacade.getProductGroups()).toEqual(
        stockReturnFacade['productGroups$']
      );
    });
    it('should access the get productcategories', () => {
      expect(stockReturnFacade.getProductCategories()).toEqual(
        stockReturnFacade['productCategories$']
      );
    });
    it('should access the get employeecodes', () => {
      expect(stockReturnFacade.getEmployeeCodes()).toEqual(
        stockReturnFacade['employeeCodes$']
      );
    });
    it('should access the get employeedetails', () => {
      expect(stockReturnFacade.getEmployeeDetails()).toEqual(
        stockReturnFacade['employeeDetails$']
      );
    });
    it('should access the get isloading history', () => {
      expect(stockReturnFacade.getIsLoadingHistory()).toEqual(
        stockReturnFacade['isLoadingHistory$']
      );
    });
    it('should access the get issueinvoice history', () => {
      expect(stockReturnFacade.getIssueInvoiceHistory()).toEqual(
        stockReturnFacade['issueInvoiceHistory$']
      );
    });
    it('should access the get historytype', () => {
      expect(stockReturnFacade.getHistoryType()).toEqual(
        stockReturnFacade['historyType$']
      );
    });
    it('should access the get advancefilter', () => {
      expect(stockReturnFacade.getAdvancedFilter()).toEqual(
        stockReturnFacade['advancedFilter$']
      );
    });
    it('should access the get issueinvoice count', () => {
      expect(stockReturnFacade.getIssueInvoiceHistoryCount()).toEqual(
        stockReturnFacade['issueInvoiceHistoryCount$']
      );
    });
    it('should access the get issueinvoice count', () => {
      expect(stockReturnFacade.getSelectedProductsSearchCount()).toEqual(
        stockReturnFacade['selectedProductsSearchCount$']
      );
    });
  });
});
