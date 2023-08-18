import { inject, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import {
  Column,
  ConfirmIssuePayload,
  Filter,
  IssueAdvanceFilterPayload,
  ItemToleranceValidate,
  LoadCancelIssuesPayload,
  LoadCancelIssuesSTNPayload,
  LoadCancelIssuetemsPayload,
  LoadHistoryRequestPayload,
  LoadIssueItemPayload,
  LoadIssueItemsTotalCountPayload,
  LoadPendingIssuePayload,
  LoadSelectedPayload,
  LoadStockIssueHistoryItemsPayload,
  RequestList,
  SearchPendingPayload,
  StockIssueAPIRequestTypesEnum,
  StockIssueSelectedHistoryPayload,
  UpdateAllItemPayload,
  UpdateItemListStatusPayload,
  UpdateItemPayload
} from '@poss-web/shared/models';
import * as moment from 'moment';
import {
  CancelIssueSTN,
  ClearHistoryAdvancedFilterData,
  ClearHistoryItems,
  ClearItems,
  ClearPendingIssuesForCancel,
  ClearSortAndFilter,
  ConfirmIssue,
  LoadBoutiqueIssuePendingSTN,
  LoadCancelIssueCount,
  LoadCancelIssueDetails,
  LoadCancelIssueItems,
  LoadCancelIssueItemsCount,
  LoadCancelIssuePendingSTN,
  LoadCourierDetails,
  LoadEmployeeCodes,
  LoadEmployeeDetails,
  LoadFactoryIssuePendingSTN,
  LoadHistoryItems,
  LoadHistoryItemsTotalCount,
  LoadIssueHistory,
  LoadIssueItemsTotalCount,
  LoadIssueSTNCount,
  LoadItems,
  LoadMerchantIssuePendingSTN,
  LoadProductCategories,
  LoadProductGroups,
  LoadSelectedHistory,
  LoadSelectedIssue,
  LoadStuddedProductGroups,
  LoadTotalMeasuredWeightAndValue,
  ResetError,
  ResetLoadedHistory,
  ResetStockIssueList,
  SearchClear,
  SearchPendingIssues,
  SetFilterDataApprovedProducts,
  SetFilterDataSelectedProducts,
  SetHistoryAdvancedFilterData,
  SetSortDataApprovedProducts,
  SetSortDataSelectedProducts,
  UpdateAllItems,
  UpdateItem,
  UpdateItemListStatus,
  ValidateItem
} from './stock-issue.actions';
import {
  issueItemAdaptor,
  requestStockTransferNoteAdaptor
} from './stock-issue.entity';
import { StockIssueFacade } from './stock-issue.facade';
import { StockIssueState } from './stock-issue.state';

describe('Stock Issue Facade Testing Suite', () => {
  const initialState: StockIssueState = {
    issueFactorySTN: requestStockTransferNoteAdaptor.getInitialState(),
    issueBoutiqueSTN: requestStockTransferNoteAdaptor.getInitialState(),
    issueMerchantSTN: requestStockTransferNoteAdaptor.getInitialState(),

    isLoadingIssueFactorySTN: false,
    isLoadingIssueBoutiqueSTN: false,
    isLoadingIssueMerchantSTN: false,

    pendingBTQ_FAC_STNCount: 0,
    pendingBTQ_BTQ_STNCount: 0,
    pendingBTQ_MER_STNCount: 0,

    isLoadingIssueCount: false,

    searchIssueResults: requestStockTransferNoteAdaptor.getInitialState(),
    isSearchingIssues: false,
    hasSearchIssueResults: false,

    isStockIssueListReset: false,

    //DETAILS PAGE
    selectedIssue: null,
    isLoadingSelectedIssue: false,
    hasSelectedIssue: false,

    isItemsTotalCountLoading: false,
    isItemsTotalCountLoaded: null,

    issueItems: issueItemAdaptor.getInitialState(),
    isIssueItemsLoading: false,
    issueItemsTotalCount: 0,

    approvedItems: issueItemAdaptor.getInitialState(),
    isApprovedItemsLoading: false,
    approvedItemsTotalCount: 0,

    selectedItems: issueItemAdaptor.getInitialState(),
    isSelectedItemsLoading: false,
    selectedItemsTotalCount: 0,

    searchedItems: issueItemAdaptor.getInitialState(),
    isSearchingItems: false,
    hasSearchedItems: false,
    items: issueItemAdaptor.getInitialState(),
    isItemsLoading: false,
    isItemsLoaded: null,
    itemsCount: 0,

    isSearchIssueItemsCountLoaded: false,
    searchedIssueItemsCount: 0,

    isUpdatingAllItems: false,
    isUpdatingAllItemsSuccess: null,

    updateItemSuccess: null,
    isupdateItemLoading: false,
    isitemUpdating: false,
    isItemUpdated: false,

    confirmIssue: null,
    isItemIssued: null,

    courierDetails: null,
    isLoadingCourierDetails: false,
    hasCourierDetails: false,

    employeeCodes: [],
    employeeDetails: null,

    productCategories: [],
    productGroups: [],
    isLoading: false,

    filterDataAllProducts: {},
    filterDataSelectedProducts: {},
    sortDataAllProducts: [],
    sortDataSelectedProducts: [],

    error: null,

    updateItemListStatusResponse: {} as RequestList,

    totalMeasuredValue: 0,
    totalMeasuredWeight: 0,

    issueHistory: requestStockTransferNoteAdaptor.getInitialState(),
    isLoadingHistory: false,
    issueHistoryCount: 0,

    isLoadingSelectedHistory: false,
    hasSelectedHistory: false,
    selectedHistory: null,

    historyItemsTotalCount: 0,
    isLoadingHistoryItemsTotalCount: false,

    isLoadingHistoryItems: false,
    isHistoryItemsLoaded: false,
    historyItems: issueItemAdaptor.getInitialState(),
    historyItemsCount: 0,
    advancedFilterData: {
      docFromDate: moment().startOf('day').valueOf(),
      docToDate: moment().endOf('day').valueOf(),
      locationCode: null,
      fiscalYear: null,
      docNo: null
    },
    studdedProductGroups: [],
    issueCancelSTN: requestStockTransferNoteAdaptor.getInitialState(),
    isLoadingIssueCancelSTN: false,
    pendingBTQ_BTQ_STNCancelCount: 0,
    cancelIssueItems: issueItemAdaptor.getInitialState(),
    cancelIssueItemsCount: 0,
    cancelIssuesSTNRes: null,
    cancelIssueSTNDetails: null,
    totalIssueCancelSTNCount: null,
    isLoadingImage:null
  };
  let stockIssueFacade: StockIssueFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), StockIssueFacade]
    });

    stockIssueFacade = TestBed.inject(StockIssueFacade);
  });

  describe('getBTQ_FAC_PendingSTN', () => {
    it('should get stored BTQ_FAC value', () => {
      expect(stockIssueFacade.getBTQ_FAC_PendingSTN()).toBeTruthy();
    });
  });

  describe('getBTQ_BTQ_PendingSTN', () => {
    it('should get stored BTQ_BTQ value', () => {
      expect(stockIssueFacade.getBTQ_BTQ_PendingSTN()).toBeTruthy();
    });
  });
  describe('getBTQ_MER_PendingSTN', () => {
    it('should get stored BTQ_MER value', () => {
      expect(stockIssueFacade.getBTQ_MER_PendingSTN()).toBeTruthy();
    });
  });

  describe('getSearchIssueresult', () => {
    it('should get stored getSearchIssueResult value', () => {
      expect(stockIssueFacade.getSearchIssueResult()).toBeTruthy();
    });
  });
  describe('getIsSearchingIssues', () => {
    it('should get stored getIsSearchingIssues value', () => {
      expect(stockIssueFacade.getIsSearchingIssues()).toBeTruthy();
    });
  });
  describe('getHasSearchIssueResults', () => {
    it('should get stored getHasSearchIssueResults value', () => {
      expect(stockIssueFacade.getHasSearchIssueResults()).toBeTruthy();
    });
  });
  describe('getError', () => {
    it('should get stored getError value', () => {
      expect(stockIssueFacade.getError()).toBeTruthy();
    });
  });
  describe('getisLoadingIssueToFactory', () => {
    it('should get stored getisLoadingIssueToFactory value', () => {
      expect(stockIssueFacade.getisLoadingIssueToFactory()).toBeTruthy();
    });
  });
  describe('getisLoadingIssueToBoutique', () => {
    it('should get stored getisLoadingIssueToBoutique value', () => {
      expect(stockIssueFacade.getisLoadingIssueToBoutique()).toBeTruthy();
    });
  });
  describe('getIsLoadingIssueToMerchant', () => {
    it('should get stored getIsLoadingIssueToMerchant value', () => {
      expect(stockIssueFacade.getIsLoadingIssueToMerchant()).toBeTruthy();
    });
  });
  describe('getIsLoadingSelectedIssue', () => {
    it('should get stored getIsLoadingSelectedIssue value', () => {
      expect(stockIssueFacade.getIsLoadingSelectedIssue()).toBeTruthy();
    });
  });
  describe('getSelectedIssue', () => {
    it('should get stored getSelectedIssue value', () => {
      expect(stockIssueFacade.getSelectedIssue()).toBeTruthy();
    });
  });
  describe('getHasSelectedIssue', () => {
    it('should get stored getHasSelectedIssue value', () => {
      expect(stockIssueFacade.getHasSelectedIssue()).toBeTruthy();
    });
  });

  describe('getHagetApprovedItemsTotalCountsSelectedIssue', () => {
    it('should get stored getApprovedItemsTotalCount value', () => {
      expect(stockIssueFacade.getApprovedItemsTotalCount()).toBeTruthy();
    });
  });
  describe('getSelectedItemsTotalCount', () => {
    it('should get stored getSelectedItemsTotalCount value', () => {
      expect(stockIssueFacade.getSelectedItemsTotalCount()).toBeTruthy();
    });
  });
  describe('getIsItemsTotalCountLoading', () => {
    it('should get stored getIsItemsTotalCountLoading value', () => {
      expect(stockIssueFacade.getIsItemsTotalCountLoading()).toBeTruthy();
    });
  });
  describe('getItemsTotalCountLoaded', () => {
    it('should get stored getItemsTotalCountLoaded value', () => {
      expect(stockIssueFacade.getItemsTotalCountLoaded()).toBeTruthy();
    });
  });

  describe('getApprovedItems', () => {
    it('should get stored getApprovedItems value', () => {
      expect(stockIssueFacade.getApprovedItems()).toBeTruthy();
    });
  });
  describe('getSelectedItems', () => {
    it('should get stored getSelectedItems value', () => {
      expect(stockIssueFacade.getSelectedItems()).toBeTruthy();
    });
  });
  describe('getIsApprovedItemsLoading', () => {
    it('should get stored getIsApprovedItemsLoading value', () => {
      expect(stockIssueFacade.getIsApprovedItemsLoading()).toBeTruthy();
    });
  });
  describe('getIsSelectedItemsLoading', () => {
    it('should get stored getIsSelectedItemsLoading value', () => {
      expect(stockIssueFacade.getIsSelectedItemsLoading()).toBeTruthy();
    });
  });
  describe('getSelectedIssueItems', () => {
    it('should get stored getSelectedIssueItems value', () => {
      expect(stockIssueFacade.getSelectedIssueItems()).toBeTruthy();
    });
  });

  describe('getIsIssueItemsLoading', () => {
    it('should get stored getIsIssueItemsLoading value', () => {
      expect(stockIssueFacade.getIsIssueItemsLoading()).toBeTruthy();
    });
  });
  describe('getIssueItemsTotalCount', () => {
    it('should get stored getIssueItemsTotalCount value', () => {
      expect(stockIssueFacade.getIssueItemsTotalCount()).toBeTruthy();
    });
  });
  describe('getIssueItemsTotalCountLoaded', () => {
    it('should get stored getIssueItemsTotalCountLoaded value', () => {
      expect(stockIssueFacade.getIssueItemsTotalCountLoaded()).toBeTruthy();
    });
  });

  describe('getIssueConfirmStatus', () => {
    it('should get stored getIssueConfirmStatus value', () => {
      expect(stockIssueFacade.getIssueConfirmStatus()).toBeTruthy();
    });
  });
  describe('getIssueConfirm', () => {
    it('should get stored getIssueConfirm value', () => {
      expect(stockIssueFacade.getIssueConfirm()).toBeTruthy();
    });
  });
  describe('getConfirmationSrcDocNo', () => {
    it('should get stored getConfirmationSrcDocNo value', () => {
      expect(stockIssueFacade.getConfirmationSrcDocNo()).toBeTruthy();
    });
  });

  describe('getSearchedItems', () => {
    it('should get stored getSearchedItems value', () => {
      expect(stockIssueFacade.getSearchedItems()).toBeTruthy();
    });
  });
  describe('getHasSearchedItems', () => {
    it('should get stored getHasSearchedItems value', () => {
      expect(stockIssueFacade.getHasSearchedItems()).toBeTruthy();
    });
  });
  describe('getIsSearchingItems', () => {
    it('should get stored getIsSearchingItems value', () => {
      expect(stockIssueFacade.getIsSearchingItems()).toBeTruthy();
    });
  });

  describe('getPendingBTQ_BTQ_STNCount', () => {
    it('should get stored getPendingBTQ_BTQ_STNCount value', () => {
      expect(stockIssueFacade.getPendingBTQ_BTQ_STNCount()).toBeTruthy();
    });
  });
  describe('getPendingBTQ_MER_STNCount', () => {
    it('should get stored getPendingBTQ_MER_STNCount value', () => {
      expect(stockIssueFacade.getPendingBTQ_MER_STNCount()).toBeTruthy();
    });
  });
  describe('getPendingBTQ_FAC_STNCount', () => {
    it('should get stored getPendingBTQ_FAC_STNCount value', () => {
      expect(stockIssueFacade.getPendingBTQ_FAC_STNCount()).toBeTruthy();
    });
  });
  describe('getIsLoadingCount', () => {
    it('should get stored getIsLoadingCount value', () => {
      expect(stockIssueFacade.getIsLoadingCount()).toBeTruthy();
    });
  });
  describe('getPendingIssueSTNCount', () => {
    it('should get stored getPendingIssueSTNCount value', () => {
      expect(stockIssueFacade.getPendingIssueSTNCount()).toBeTruthy();
    });
  });

  describe('getSearchedIssueItemsCount', () => {
    it('should get stored getSearchedIssueItemsCount value', () => {
      expect(stockIssueFacade.getSearchedIssueItemsCount()).toBeTruthy();
    });
  });
  describe('getSearchedIssueItemsCountLoaded', () => {
    it('should get stored getSearchedIssueItemsCountLoaded value', () => {
      expect(stockIssueFacade.getSearchedIssueItemsCountLoaded()).toBeTruthy();
    });
  });
  describe('getItemUpdateStatus', () => {
    it('should get stored getItemUpdateStatus value', () => {
      expect(stockIssueFacade.getItemUpdateStatus()).toBeTruthy();
    });
  });
  describe('getIsItemUpdating', () => {
    it('should get stored getIsItemUpdating value', () => {
      expect(stockIssueFacade.getIsItemUpdating()).toBeTruthy();
    });
  });

  describe('getIsUpdateAllItems', () => {
    it('should get stored getIsUpdateAllItems value', () => {
      expect(stockIssueFacade.getIsUpdateAllItems()).toBeTruthy();
    });
  });
  describe('getselectIsUpdateAllItemsSuccess', () => {
    it('should get stored getselectIsUpdateAllItemsSuccess value', () => {
      expect(stockIssueFacade.getselectIsUpdateAllItemsSuccess()).toBeTruthy();
    });
  });
  describe('getCourierDetails', () => {
    it('should get stored getCourierDetails value', () => {
      expect(stockIssueFacade.getCourierDetails()).toBeTruthy();
    });
  });
  describe('getIsLoadingCourierDetails', () => {
    it('should get stored getIsLoadingCourierDetails value', () => {
      expect(stockIssueFacade.getIsLoadingCourierDetails()).toBeTruthy();
    });
  });
  describe('getHasCourierDetails', () => {
    it('should get stored getHasCourierDetails value', () => {
      expect(stockIssueFacade.getHasCourierDetails()).toBeTruthy();
    });
  });
  describe('getHistoryCount', () => {
    it('should get stored getHistoryCount value', () => {
      expect(stockIssueFacade.getHistoryCount()).toBeTruthy();
    });
  });
  describe(' loadEmployeeCodes', () => {
    it('should dispatch LoadEmployeeCodes action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadEmployeeCodes();
      stockIssueFacade.loadEmployeeCodes();

      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });
  describe('getEmployeeCodes', () => {
    it('should get stored getEmployeeCodes value', () => {
      expect(stockIssueFacade.getEmployeeCodes()).toBeTruthy();
    });
  });
  describe(' loadEmployeeDetails', () => {
    it('should dispatch LoadEmployeeDetails action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadEmployeeDetails('111');
      stockIssueFacade.loadEmployeeDetails('111');
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });
  describe('getEmployeeDetails', () => {
    it('should get stored getEmployeeDetails value', () => {
      expect(stockIssueFacade.getEmployeeDetails()).toBeTruthy();
    });
  });

  describe('loadProductCategories', () => {
    it('should dispatch LoadProductCategories action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new LoadProductCategories();
        stockIssueFacade.loadProductCategories();
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });
  describe('getProductCategories', () => {
    it('should get stored getProductCategories value', () => {
      expect(stockIssueFacade.getProductCategories()).toBeTruthy();
    });
  });

  describe('loadProductGroups', () => {
    it('should dispatch LoadProductGroups action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadProductGroups();
      stockIssueFacade.loadProductGroups();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });
  describe('getProductGroups', () => {
    it('should get stored getProductGroups value', () => {
      expect(stockIssueFacade.getProductGroups()).toBeTruthy();
    });
  });

  describe('setFilterDataApprovedProducts', () => {
    it('should dispatch SetFilterDataApprovedProducts action', inject(
      [Store],
      store => {
        const payload: { [key: string]: Filter[] } = {
          ['productCategory']: [{ id: 1, description: 'AA', selected: true }]
        };
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new SetFilterDataApprovedProducts(payload);
        stockIssueFacade.setIssueAppovedProductsFilter(payload);
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });
  describe('SetFilterDataSelectedProducts', () => {
    it('should dispatch SetFilterDataSelectedProducts action', inject(
      [Store],
      store => {
        const payload: { [key: string]: Filter[] } = {
          ['productCategory']: [{ id: 1, description: 'AA', selected: true }]
        };
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new SetFilterDataSelectedProducts(payload);
        stockIssueFacade.setIssueSelectedProductsFilter(payload);
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });
  describe('getfilterDataSelectedProducts', () => {
    it('should get stored getfilterDataSelectedProducts value', () => {
      expect(stockIssueFacade.getfilterDataSelectedProducts()).toBeTruthy();
    });
  });
  describe('getfilterDataApprovedProducts', () => {
    it('should get stored getfilterDataApprovedProducts value', () => {
      expect(stockIssueFacade.getfilterDataApprovedProducts()).toBeTruthy();
    });
  });

  describe('setIssueApprovedProductsSort', () => {
    it('should dispatch SetSortDataApprovedProducts action', inject(
      [Store],
      store => {
        const payload: Column[] = [];
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new SetSortDataApprovedProducts(payload);
        stockIssueFacade.setIssueApprovedProductsSort(payload);
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });
  describe('setIssueSelectedProductsSort', () => {
    it('should dispatch SetSortDataSelectedProducts action', inject(
      [Store],
      store => {
        const payload: Column[] = [];
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new SetSortDataSelectedProducts(payload);
        stockIssueFacade.setIssueSelectedProductsSort(payload);
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });
  describe('getSortDataApprovedProducts', () => {
    it('should get stored getSortDataApprovedProducts value', () => {
      expect(stockIssueFacade.getSortDataApprovedProducts()).toBeTruthy();
    });
  });
  describe('getSortDataSelectedProducts', () => {
    it('should get stored getSortDataSelectedProducts value', () => {
      expect(stockIssueFacade.getSortDataSelectedProducts()).toBeTruthy();
    });
  });

  describe('getItems', () => {
    it('should get stored getItems value', () => {
      expect(stockIssueFacade.getItems()).toBeTruthy();
    });
  });

  describe('getIsItemsLoading', () => {
    it('should get stored getIsItemsLoading value', () => {
      expect(stockIssueFacade.getIsItemsLoading()).toBeTruthy();
    });
  });
  describe('getItemsCount', () => {
    it('should get stored getItemsCount value', () => {
      expect(stockIssueFacade.getItemsCount()).toBeTruthy();
    });
  });
  describe('getIsItemsLoaded', () => {
    it('should get stored getIsItemsLoaded value', () => {
      expect(stockIssueFacade.getIsItemsLoaded()).toBeTruthy();
    });
  });
  describe('getTotalMeasuredWeight', () => {
    it('should get stored getTotalMeasuredWeight value', () => {
      expect(stockIssueFacade.getTotalMeasuredWeight()).toBeTruthy();
    });
  });
  describe('getTotalMeasuredValue', () => {
    it('should get stored getTotalMeasuredValue value', () => {
      expect(stockIssueFacade.getTotalMeasuredValue()).toBeTruthy();
    });
  });
  describe('clearSortAndFilter', () => {
    it('should dispatch ClearSortAndFilter action', inject([Store], store => {
      const payload: LoadPendingIssuePayload = {
        requestType: 'FAC',
        pageIndex: 0,
        pageSize: 8
      };
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new ClearSortAndFilter();
      stockIssueFacade.clearSortAndFilter();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('loadIssueToFactorySTN', () => {
    it('should dispatch ClearSortAndFilter action', inject([Store], store => {
      const payload: LoadPendingIssuePayload = {
        requestType: 'FAC',
        pageIndex: 0,
        pageSize: 8
      };
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadFactoryIssuePendingSTN(payload);
      stockIssueFacade.loadIssueToFactorySTN(payload);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });
  describe('clealoadIssueToBoutiqueSTNrSortAndFilter', () => {
    it('should dispatch LoadBoutiqueIssuePendingSTN action', inject(
      [Store],
      store => {
        const payload: LoadPendingIssuePayload = {
          requestType: 'NTQ',
          pageIndex: 0,
          pageSize: 8
        };
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new LoadBoutiqueIssuePendingSTN(payload);
        stockIssueFacade.loadIssueToBoutiqueSTN(payload);
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });
  describe('loadIssueToMerchantSTN', () => {
    it('should dispatch LoadMerchantIssuePendingSTN action', inject(
      [Store],
      store => {
        const payload: LoadPendingIssuePayload = {
          requestType: 'MER',
          pageIndex: 0,
          pageSize: 8
        };
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new LoadMerchantIssuePendingSTN(payload);
        stockIssueFacade.loadIssueToMerchantSTN(payload);
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });
  describe('resetStockIssueList', () => {
    it('should dispatch LoadMerchantIssuePendingSTN action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new ResetStockIssueList();
        stockIssueFacade.resetStockIssueList();
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });

  describe('searchPendingIssues', () => {
    it('should dispatch SearchPendingIssues action', inject([Store], store => {
      const payload: SearchPendingPayload = {
        reqDocNo: 111,
        requestType: 'FAC'
      };
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new SearchPendingIssues(payload);
      stockIssueFacade.searchPendingIssues(payload);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });
  describe('searchClear', () => {
    it('should dispatch SearchClear action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new SearchClear();
      stockIssueFacade.searchClear();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });
  describe('loadSelectedIssue', () => {
    it('should dispatch LoadSelectedIssue action', inject([Store], store => {
      const payload: LoadSelectedPayload = {
        id: 111,
        requestType: 'FAC'
      };
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadSelectedIssue(payload);
      stockIssueFacade.loadSelectedIssue(payload);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });
  describe('loadItems', () => {
    it('should dispatch LoadItems action', inject([Store], store => {
      const payload: LoadIssueItemPayload = {
        id: 1,
        itemCode: '1000111112222',
        lotNumber: '1AOB111',
        requestType: 'FAC',
        storeType: 'L1',
        status: 'APPROVED',
        pageIndex: 0,
        pageSize: 10
        // sort?: Map<string, string>;
        // filter?: { key: string; value: any[] }[];
      };
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadItems(payload);
      stockIssueFacade.loadItems(payload);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });
  describe('clearItems', () => {
    it('should dispatch ClearItems action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new ClearItems();
      stockIssueFacade.clearItems();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('loadItemsTotalCount', () => {
    it('should dispatch LoadIssueItemsTotalCount action', inject(
      [Store],
      store => {
        const payload: LoadIssueItemsTotalCountPayload = {
          id: 11,
          requestType: 'FAC',
          storeType: 'L1'
        };
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new LoadIssueItemsTotalCount(payload);
        stockIssueFacade.loadItemsTotalCount(payload);
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });
  describe('confirmIssue', () => {
    it('should dispatch ConfirmIssue action', inject([Store], store => {
      const payload: ConfirmIssuePayload = {
        requestType: 'FAC',
        id: 1,
        data: {
          carrierDetails: {
            data: 'test data',
            type: 'test data'
          },
          remarks: 'remarks'
        }
      };
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new ConfirmIssue(payload);
      stockIssueFacade.confirmIssue(payload);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });
  describe('LoadIssueSTNCount', () => {
    it('should dispatch LoadIssueSTNCount action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadIssueSTNCount();
      stockIssueFacade.LoadIssueSTNCount();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });
  describe('validateItem', () => {
    it('should dispatch ValidateItem action', inject([Store], store => {
      const payload: ItemToleranceValidate = {
        itemId: '11100000AB11',
        productGroupCode: '71',
        availableWeight: 10.1,
        measuredWeight: 10.08,
        measuredQuantity: 2,
        availableQuantity: 2
      };
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new ValidateItem(payload);
      stockIssueFacade.validateItem(payload);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });
  describe('updateItem', () => {
    it('should dispatch ValidateItem action', inject([Store], store => {
      const payload: UpdateItemPayload = {
        requestType: 'FAC',
        storeType: 'L1',
        id: 1,
        itemId: '111000AB11',
        newUpdate: {
          measuredQuantity: 10.1,
          status: 'APPROVED',
          inventoryId: '12345676DFGH',
          measuredWeight: 10.2
        },
        actualDetails: {
          measuredQuantity: 10.1,
          status: 'APPROVED',
          inventoryId: '12345676DFGH',
          measuredWeight: 10.2
        }
      };
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new UpdateItem(payload);
      stockIssueFacade.updateItem(payload);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });
  describe('updateAllItems', () => {
    it('should dispatch UpdateAllItems action', inject([Store], store => {
      const payload: UpdateAllItemPayload = {
        requestType: 'FAC',
        storeType: 'L1',
        id: 1,
        itemId: '11001111',
        status: 'APPROVED'
      };
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new UpdateAllItems(payload);
      stockIssueFacade.UpdateAllItems(payload);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('updateAllItems', () => {
    it('should dispatch UpdateAllItems action', inject([Store], store => {
      const payload: UpdateAllItemPayload = {
        requestType: 'FAC',
        storeType: 'L1',
        id: 1,
        itemId: '11001111',
        status: 'APPROVED'
      };
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new UpdateAllItems(payload);
      stockIssueFacade.UpdateAllItems(payload);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });
  describe('loadCourierDetails', () => {
    it('should dispatch loadCourierDetails action', inject([Store], store => {
      const payload = 'HNR';
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadCourierDetails(payload);
      stockIssueFacade.loadCourierDetails(payload);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });
  describe('loadStuddedProductGroups', () => {
    it('should dispatch UpdateAllItems action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadStuddedProductGroups();
      stockIssueFacade.loadStuddedProductGroups();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });
  describe('resetError', () => {
    it('should dispatch ResetError action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new ResetError();
      stockIssueFacade.resetError();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('updateItemListStatus', () => {
    it('should dispatch UpdateItemListStatus action', inject([Store], store => {
      const payload: UpdateItemListStatusPayload = {
        type: 'BTQ',
        id: 11,
        requestGroup: 'IBT',
        itemIds: [],
        remarks: 'test data'
      };
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new UpdateItemListStatus(payload);
      stockIssueFacade.updateItemListStatus(payload);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });
  describe('loadMeasuredWeightAndValue', () => {
    it('should dispatch LoadMeasuredWeightAndValue action', inject(
      [Store],
      store => {
        const payload: LoadSelectedPayload = {
          id: 1,
          requestType: 'FAC'
        };
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new LoadTotalMeasuredWeightAndValue(payload);
        stockIssueFacade.loadMeasuredWeightAndValue(payload);
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });
  describe('updateSelectedRequestProductListStatusResponse', () => {
    it('should get stored updateSelectedRequestProductListStatusResponse value', () => {
      expect(
        stockIssueFacade.updateSelectedRequestProductListStatusResponse()
      ).toBeTruthy();
    });
  });

  describe('getIsLoading', () => {
    it('should get stored getIsLoading value', () => {
      expect(stockIssueFacade.getIsLoading()).toBeTruthy();
    });
  });
  describe('getIssueHistory', () => {
    it('should get stored getIssueHistory value', () => {
      expect(stockIssueFacade.getIssueHistory()).toBeTruthy();
    });
  });
  describe('getIsIssueHistoryLoading', () => {
    it('should get stored getIsIssueHistoryLoading value', () => {
      expect(stockIssueFacade.getIsIssueHistoryLoading()).toBeTruthy();
    });
  });
  describe('getIssueHistoryCount', () => {
    it('should get stored getIssueHistoryCount value', () => {
      expect(stockIssueFacade.getIssueHistoryCount()).toBeTruthy();
    });
  });

  describe('getSelectedHistory', () => {
    it('should get stored getSelectedHistory value', () => {
      expect(stockIssueFacade.getSelectedHistory()).toBeTruthy();
    });
  });
  describe('getIsLoadingSelectedHistory', () => {
    it('should get stored getIsLoadingSelectedHistory value', () => {
      expect(stockIssueFacade.getIsLoadingSelectedHistory()).toBeTruthy();
    });
  });
  describe('getHasSelectedHistory', () => {
    it('should get stored getHasSelectedHistory value', () => {
      expect(stockIssueFacade.getHasSelectedHistory()).toBeTruthy();
    });
  });
  describe('getIsLoadingHistoryItems', () => {
    it('should get stored getIsLoadingHistoryItems value', () => {
      expect(stockIssueFacade.getIsLoadingHistoryItems()).toBeTruthy();
    });
  });

  describe('getIsHistoryItemsLoaded', () => {
    it('should get stored getIsHistoryItemsLoaded value', () => {
      expect(stockIssueFacade.getIsHistoryItemsLoaded()).toBeTruthy();
    });
  });
  describe('getHistoryItems', () => {
    it('should get stored getHistoryItems value', () => {
      expect(stockIssueFacade.getHistoryItems()).toBeTruthy();
    });
  });
  // describe('getHistoryItemsCount', () => {
  //   it('should get stored getHistoryItemsCount value', () => {
  //     expect(stockIssueFacade.getHistoryItemsCount()).toBeTruthy();
  //   });
  // });
  describe('getHistoryItemsTotalCount', () => {
    it('should get stored getHistoryItemsTotalCount value', () => {
      expect(stockIssueFacade.getHistoryItemsTotalCount()).toBeTruthy();
    });
  });
  describe('getIsLoadingHistoryItemsTotalCount', () => {
    it('should get stored getIsLoadingHistoryItemsTotalCount value', () => {
      expect(
        stockIssueFacade.getIsLoadingHistoryItemsTotalCount()
      ).toBeTruthy();
    });
  });
  describe('getAdvancedFilterData', () => {
    it('should get stored getAdvancedFilterData value', () => {
      expect(stockIssueFacade.getAdvancedFilterData()).toBeTruthy();
    });
  });
  describe('loadIssueHistory', () => {
    it('should dispatch LoadIssueHistory action', inject([Store], store => {
      const payload: LoadHistoryRequestPayload = {
        payload: {
          actionType: 'ISSUE',
          dateRangeType: 'TODAY',
          destDocNo: null,
          destFiscalYear: null,
          endDate: null,
          locationCode: null,
          srcDocNo: null,
          srcFiscalYear: null,
          startDate: null,
          statuses: []
        },
        pageSize: 0,
        pageIndex: 10,
        sort: [],
        transferType: 'BTQ_FAC'
      };
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadIssueHistory(payload);
      stockIssueFacade.loadIssueHistory(payload);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });
  describe('resetLoadedHistory', () => {
    it('should dispatch ResetLoadedHistory action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new ResetLoadedHistory();
      stockIssueFacade.resetLoadedHistory();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });
  describe('loadSelectedHistory', () => {
    it('should dispatch LoadSelectedHistory action', inject([Store], store => {
      const payload: StockIssueSelectedHistoryPayload = {
        actionType: 'ISSUE',
        id: 1,
        type: 'BTW',
        isL1L2Store: true,
        isL3Store: false
      };
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadSelectedHistory(payload);
      stockIssueFacade.loadSelectedHistory(payload);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('loadHistoryItems', () => {
    it('should dispatch LoadHistoryItems action', inject([Store], store => {
      const payload: LoadStockIssueHistoryItemsPayload = {
        payload: {
          binCodes: null,
          binGroupCode: null,
          itemCode: '111',
          lotNumber: '111111',
          productCategories: [],
          productGroups: [],
          statuses: []
        },
        actionType: 'ISSUE',
        id: 1,
        page: 0,
        size: 10,
        sort: null,
        transferType: 'BTQ_FAC',
        isL1L2Store: true,
        isL3Store: false
      };
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadHistoryItems(payload);
      stockIssueFacade.loadHistoryItems(payload);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('clearHistoryItems', () => {
    it('should dispatch ClearHistoryItems action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new ClearHistoryItems();
      stockIssueFacade.clearHistoryItems();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('loadHistoryItemstotalCount', () => {
    it('should dispatch LoadHistoryItemstotalCount action', inject(
      [Store],
      store => {
        const payload: LoadStockIssueHistoryItemsPayload = {
          payload: {
            binCodes: null,
            binGroupCode: null,
            itemCode: '111',
            lotNumber: '111111',
            productCategories: [],
            productGroups: [],
            statuses: []
          },
          actionType: 'ISSUE',
          id: 1,
          page: 0,
          size: 10,
          sort: null,
          transferType: 'BTQ_FAC',
          isL1L2Store: true,
          isL3Store: false
        };
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new LoadHistoryItemsTotalCount(payload);
        stockIssueFacade.loadHistoryItemstotalCount(payload);
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });
  describe('setAdvancedFilterData', () => {
    it('should dispatch SetHistoryAdvancedFilterData action', inject(
      [Store],
      store => {
        const payload: IssueAdvanceFilterPayload = {
          docFromDate: null,
          docToDate: null,
          locationCode: null,
          fiscalYear: null,
          docNo: null
        };
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new SetHistoryAdvancedFilterData(payload);
        stockIssueFacade.setAdvancedFilterData(payload);
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });
  describe('clearAdvancedFilterData', () => {
    it('should dispatch ClearHistoryAdvancedFilterData action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new ClearHistoryAdvancedFilterData(1);
        stockIssueFacade.clearAdvancedFilterData(1);
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });

  // cancel STN
  describe('loadIssueToBoutiqueSTNCancel', () => {
    const payload: LoadCancelIssuesSTNPayload = {
      requestType: 'FAC',
      pageIndex: 0,
      pageSize: 8
    };
    it('should dispatch LoadCancelIssuePendingSTN action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new LoadCancelIssuePendingSTN(payload);
        stockIssueFacade.loadIssueToBoutiqueSTNCancel(payload);
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });
  describe('LoadIssueSTNCancelCount', () => {
    const payload: LoadCancelIssuesPayload = {
      transferType: StockIssueAPIRequestTypesEnum.BTQ_BTQ
    };
    it('should dispatch LoadCancelIssueCount action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadCancelIssueCount(payload);
      stockIssueFacade.LoadIssueSTNCancelCount(payload);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });
  describe('loadCancelIssueItems', () => {
    const payload: LoadCancelIssuetemsPayload = {
      id: 1,
      page: 0,
      size: 10,
      sort: [''],
      transferType: 'BTQ_BTQ',
      binCodes: [],
      binGroupCode: '',
      itemCode: '',
      lotNumber: '',
      productCategories: [],
      productGroups: []
    };
    it('should dispatch LoadCancelIssueItems action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadCancelIssueItems(payload);
      stockIssueFacade.loadCancelIssueItems(payload);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });
  describe('LoadCancelIssueItemsCount', () => {
    const payload: LoadCancelIssuesPayload = {
      transferType: StockIssueAPIRequestTypesEnum.BTQ_BTQ
    };
    it('should dispatch LoadCancelIssueItemsCount action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new LoadCancelIssueItemsCount(payload);
        stockIssueFacade.loadCancelIssueItemsCount(payload);
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });
  describe('loadCancelIssueSTNDetails', () => {
    const payload: LoadCancelIssuesPayload = {
      transferType: StockIssueAPIRequestTypesEnum.BTQ_BTQ
    };
    it('should dispatch LoadCancelIssueDetails action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new LoadCancelIssueDetails(payload);
        stockIssueFacade.loadCancelIssueSTNDetails(payload);
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });
  describe('cancelIssueSTN', () => {
    const payload: LoadCancelIssuesPayload = {
      transferType: StockIssueAPIRequestTypesEnum.BTQ_BTQ
    };
    it('should dispatch CancelIssueSTN action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new CancelIssueSTN(payload);
      stockIssueFacade.cancelIssueSTN(payload);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });
  describe('clearPendingIssuesForCancel', () => {
    it('should dispatch ClearPendingIssuesForCancel action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new ClearPendingIssuesForCancel();
        stockIssueFacade.clearPendingIssuesForCancel();
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });

  describe('getBTQ_BTQ_PendingSTNCancel', () => {
    it('should get stored getBTQ_BTQ_PendingSTNCancel value', () => {
      expect(stockIssueFacade.getBTQ_BTQ_PendingSTNCancel()).toBeTruthy();
    });
  });
  describe('getisLoadingIssueToBoutiqueCancelSTN', () => {
    it('should get stored getisLoadingIssueToBoutiqueCancelSTN value', () => {
      expect(
        stockIssueFacade.getisLoadingIssueToBoutiqueCancelSTN()
      ).toBeTruthy();
    });
  });
  describe('getPendingBTQ_BTQ_STNCancelCount', () => {
    it('should get stored getPendingBTQ_BTQ_STNCancelCount value', () => {
      expect(stockIssueFacade.getPendingBTQ_BTQ_STNCancelCount()).toBeTruthy();
    });
  });
  describe('getCancelIssueItems', () => {
    it('should get stored getCancelIssueItems value', () => {
      expect(stockIssueFacade.getCancelIssueItems()).toBeTruthy();
    });
  });
  describe('getCancelIssueItemsCount', () => {
    it('should get stored getCancelIssueItemsCount value', () => {
      expect(stockIssueFacade.getCancelIssueItemsCount()).toBeTruthy();
    });
  });
  describe('getCancelIssueSTNDetails', () => {
    it('should get stored getCancelIssueSTNDetails value', () => {
      expect(stockIssueFacade.getCancelIssueSTNDetails()).toBeTruthy();
    });
  });
  describe('getCancelIssueSTNRes', () => {
    it('should get stored getCancelIssueSTNRes value', () => {
      expect(stockIssueFacade.getCancelIssueSTNRes()).toBeTruthy();
    });
  });
});
