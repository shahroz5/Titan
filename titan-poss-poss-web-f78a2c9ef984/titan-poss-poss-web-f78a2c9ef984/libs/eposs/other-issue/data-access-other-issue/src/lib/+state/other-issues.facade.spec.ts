import {
  OtherIssuesItem,
  Filter,
  Column,
  OtherIssueLoadListItemsPayload,
  OtherIssueSearchPendingPayload,
  OtherIssueLoadSelectedPayload,
  CreateOtherStockIssueItemsPayload,
  LoadOtherIssuesItemPayload,
  ConfirmOtherStockIssuePayload,
  OtherIssuesCreateStockResponsePayload,
  LoadAllOtherIssuePayload,
  LoadOtherIssueCreateItemsTotalCountPayload,
  CreateOtherIssueStockRequestItemsPayload,
  RemoveOtherIssueStockRequestItemsPayload,
  UpdateStockRequestItemPayload,
  UpdateStockRequestPayload,
  AdjustmentSearchItemPayload,
  CreateStockRequestAdjustmentPayload,
  UpdateCartItemAdjustmentPayload,
  RemoveCartItemAdjustmentPayload,
  SearchCartItemAdjustmentPayload,
  PSVSearchItemPayload,
  CreateStockRequestPSVPayload,
  UpdateCartItemPSVPayload,
  RemoveCartItemPSVPayload,
  SearchCartItemPSVPayload,
  PrintOtherIssuePayload,
  CancelOtherRequestPayload,
  OtherIssuedataModel,
  LoadOtherIssueHistoryPayload,
  LoadOtherIssueHistoryItemsPayload,
  OtherReceiptsIssuesAdvanceFilterPayload
} from '@poss-web/shared/models';

import {
  LoadIssuesSTNCount,
  LoadIssueList,
  SearchPendingIssue,
  LoadIssueLoanList,
  DropDownvalueForIssues,
  LoadSelectedIssue,
  LoadStuddedProductGroups,
  LoadNonVerifiedOtherIssueItems,
  SearchClearIssue,
  CreateOtherStockIssueItems,
  RemoveInitialLoadOtherIssue,
  ConfirmOtherStockIssue,
  ResetConfirmOtherIssueResponse,
  //create page
  CreateOtherIssueStockRequest,
  LoadAllOtherIssueCreateItems,
  LoadSelectedOtherIssueCreateItems,
  LoadIssueItemsCreateTotalCount,
  CreateOtherIssueStockRequestItems,
  RemoveOtherIssueStockRequestItems,
  UpdateStockRequestCreateItem,
  ResetOtherIssueCreateListItems,
  ResetOtherIssueCreateResponse,
  UpdateStockRequest,
  ClearItems,
  //psv and adjustment
  SearchAdjustment,
  AddItemsToCart,
  CreateStockRequestAdjustment,
  UpdateCartItemsAdjustment,
  RemoveCartItemsAdjustment,
  SearchCartItemsAdjustment,
  LoadIssueADJList,
  ResetAdjustmentIssueData,
  LoadIssueLossList,
  LoadIssuePSVList,
  ClearSearchCartItemAdjustment,
  SearchPSV,
  AddPSVItemsToCart,
  CreateStockRequestPSV,
  UpdateCartItemsPSV,
  RemoveCartItemsPSV,
  SearchCartItemsPSV,
  ResetPSVIssueData,
  ClearSearchCartItemPSV,
  SearchFOC,
  AddFOCItemsToCart,
  CreateStockRequestFOC,
  UpdateCartItemsFOC,
  RemoveCartItemsFOC,
  SearchCartItemsFOC,
  ResetFOCIssueData,
  ClearSearchCartItemFOC,
  LoadIssueFOCList,
  ClearSearchInventoryItemAdjustment,
  ClearSearchInventoryItemPSV,
  ClearSearchInventoryItemFOC,
  ResetIssueListData,
  CancelStockRequest,
  PrintOtherIssues,
  LoadProductGroups,
  LoadProductCategories,
  SetFilterDataAllProducts,
  SetFilterDataSelectedProducts,
  SetSortDataAllProducts,
  SetSortDataSelectedProducts,
  SetFilterDataOtherIssue,
  SetSortDataOtherIssue,
  LoadOtherIssueHistory,
  ResetOtherIssueHistory,
  LoadSelectedHistory,
  LoadSelectedHistoryItems,
  SetOtherReceiptsIssueFilterData,
  ClearOtherReceiptsIssueFilterData,
  LoadSelectedHistoryItemsTotalCount,
  ClearSelectedHistoryItems
} from './other-issues.actions';
import { OtherIssuesState } from './other-issues.state';
import { Store } from '@ngrx/store';
import { TestBed, inject } from '@angular/core/testing';
import { OtherIssuesFacade } from './other-issues.facade';
import {
  otherIssueAdapter,
  otherIssuesItemAdapter,
  otherIssuesCreateItemAdapter,
  otherIssuesHistoryItemAdapter
} from './other-issues.entity';
import * as moment from 'moment';

import { provideMockStore, MockStore } from '@ngrx/store/testing';
const dummysearchOtherIssueCreateItems: OtherIssuesItem = {
  id: null,
  itemCode: '512219VGGQ2A00',
  lotNumber: '2EB000073',
  mfgDate: moment(1588703400000),
  productCategory: 'V',
  productGroup: '71',
  binCode: 'LOAN',
  binGroupCode: 'LOAN',
  stdValue: 160410,
  stdWeight: 46.186,
  currencyCode: 'INR',
  weightUnit: 'gms',
  status: 'OPEN',
  imageURL: '/productcatalogue/ProductImages/2219VGG.jpg',
  itemDetails: null,
  availableQuantity: 5,
  availableWeight: 230.93,
  availableValue: 802050,
  measuredQuantity: null,
  measuredWeight: null,
  measuredValue: null,
  orderType: null,
  approvedQuantity: null,
  isStudded: null,
  isUpdating: null,
  isUpdatingSuccess: null,
  issuedQuantity: null,
  itemValue: null,
  itemWeight: null,
  productCategoryId: null,
  productGroupId: null,
  requestedQuantity: null,
  totalQuantity: null,
  totalValue: null,
  totalWeight: null,
  totalElements: null,

  inventoryId: 123,
  taxDetails:{}
};

describe('Other Issue facade Testing Suite action', () => {
  const initialState: OtherIssuesState = {
    isLoading: false,
    pendingOtherIssuesSTNCount: 0,
    otherIssuesList: otherIssueAdapter.getInitialState(),
    otherIssueLoanList: otherIssueAdapter.getInitialState(),
    isLoadingOtherIssuesList: false,
    isLoadingOtherIssuesLoanList: false,
    isSearchingStocks: false,
    hasSearchStockResults: null,
    searchIssueStockResults: otherIssueAdapter.getInitialState(),
    otherIssuesDropdownValues: null,
    selectedDropDownForIssues: null,
    error: null,
    selectedIssue: null,
    isItemIssued: false,
    issueItemsTotalCount: 0,
    totalElementsOtherIssues: 0,
    nonVerifiedOtherIssuesItems: otherIssuesItemAdapter.getInitialState(),
    isLoadingOtherIssueSelectedStock: false,
    isSearchingOtherIssueItems: false,
    hasSearchedOtherssueIItems: false,
    createOtherStockIssueItemsResponse: {},
    isLoadingOtherIssueDetails: false,
    confirmOtherStockIssueResponse: {},

    //create page
    createOtherIssueStockRequestResponse: null,
    isCreateOtherIssueStockRequestPending: false,
    allOtherIssueCreateItems: otherIssuesCreateItemAdapter.getInitialState(),
    selectedOtherIssueCreateItems: otherIssuesCreateItemAdapter.getInitialState(),
    isallOtherIssueCreateItemsLoading: false,
    isselectedOtherIssueCreateItemsLoading: false,

    allOtherIssueCreateItemsTotalCount: 0,
    selectedOtherIssueCreateItemsTotalCount: 0,

    isOtherIssueCreateItemTotalCountLoaded: null,
    isOtherIssueItemTotalCountLoading: false,
    isSearchingOtherIssueCreateItems: false,
    hasSearchedOtherssueCreateItems: false,
    createOtherIssueStockRequestItemsResponse: {},
    isLoadingOtherIssueRequestItemsResponse: false,

    removeOtherIssueStockRequestItemsResponse: {},
    isLoadingOtherIssueStockRequestItemsResponse: false,
    updateStockRequestCreateItemResponse: {},
    isLoadingUpdateStockRequestCreateItemResponse: false,

    updateStockRequestResponse: {},
    isLoadingUpdateStockRequestResponse: false,

    //adjustment
    isSearchingAdjustment: false,
    hasSearchedItemAdjustment: false,
    searchedAdjustmentItems: otherIssuesItemAdapter.getInitialState(),
    searchCountAdjustment: null,
    adjustmentItemsInCarts: otherIssuesItemAdapter.getInitialState(),
    createStockRequestAdjustmentResponse: {},
    isLoadingAdjustment: false,
    adjustmentItemsInCartsSearch: otherIssuesItemAdapter.getInitialState(),
    hasSearchItemInCartSearch: false,
    otherIssueADJList: otherIssueAdapter.getInitialState(),
    isLoadingOtherIssuesADJList: false,

    otherIssueLossList: otherIssueAdapter.getInitialState(),
    isLoadingOtherIssuesLossList: false,

    otherIssuePSVList: otherIssueAdapter.getInitialState(),
    isLoadingOtherIssuesPSVList: false,
    // psv
    isSearchingPSV: false,
    hasSearchedItemPSV: false,
    searchedPSVItems: otherIssuesItemAdapter.getInitialState(),
    searchCountPSV: null,
    psvItemsInCarts: otherIssuesItemAdapter.getInitialState(),
    createStockRequestPSVResponse: {},
    isLoadingPSV: false,
    psvItemsInCartsSearch: otherIssuesItemAdapter.getInitialState(),
    hasSearchItemInCartSearchPSV: false,
    //FOC
    isSearchingFOC: false,
    hasSearchedItemFOC: false,
    searchedFOCItems: otherIssuesItemAdapter.getInitialState(),
    searchCountFOC: null,
    focItemsInCarts: otherIssuesItemAdapter.getInitialState(),
    createStockRequestFOCResponse: {},
    isLoadingFOC: false,
    focItemsInCartsSearch: otherIssuesItemAdapter.getInitialState(),
    hasSearchItemInCartSearchFOC: false,
    studdedProductGroups: [],
    otherIssueFOCList: otherIssueAdapter.getInitialState(),
    isLoadingOtherIssuesFOCList: false,

    isLoadingCancelStockRequestResponse: false,
    cancelStockRequestResponse: null,
    printDataResponse: null,

    productCategories: null,
    productGroups: null,
    filterDataAllProducts: {},
    filterDataSelectedProducts: {},
    sortDataAllProducts: [],
    sortDataSelectedProducts: [],

    filterDataOtherIssue: {},
    sortDataotherIssue: [],

    //HISTORY
    otherIssueHistory: otherIssueAdapter.getInitialState(),
    isLoadingHistory: false,
    otherIssueHistoryCount: 0,
    isLoadingHistoryCount: false,

    isLoadingSelectedHistory: false,
    hasSelectedHistory: false,
    selectedHistory: null,

    historyItemsCount: 0,
    historyItems: otherIssuesHistoryItemAdapter.getInitialState(),
    isLoadingHistoryItems: false,
    isHistoryItemsLoaded: false,

    historyItemsTotalCount: 0,
    isLoadingHistoryItemsTotalCount: false,
    isHistoryItemsTotalCountLoaded: false,

    advancedfilter: {
      docFromDate: moment().startOf('day').valueOf(),
      docToDate: moment().endOf('day').valueOf(),
      status: null,
      docNo: null,
      fiscalYear: null
    }
  };

  let otherIssuesFacade: OtherIssuesFacade;

  //let store: MockStore<OtherIssuesState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), OtherIssuesFacade]
    });

    otherIssuesFacade = TestBed.inject(OtherIssuesFacade);
  });

  describe('Dispatch Actions action', () => {
    it('should call RESET_ISSUE_LIST_DATA action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const action = new ResetIssueListData();
      otherIssuesFacade.resetOtherIssueListData();
      expect(storeSpy).toHaveBeenCalledWith(action);
    }));

    it('should call SEARCH_PENDING_ISSUE action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const payload: OtherIssueSearchPendingPayload = {
        srcDocnumber: 0,
        type: ''
      };
      const action = new SearchPendingIssue(payload);
      otherIssuesFacade.searchPendingIssuesStocks(payload);
      expect(storeSpy).toHaveBeenCalledWith(action);
    }));

    it('should call LOAD_ISSUES_STN_COUNT action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const action = new LoadIssuesSTNCount();
      otherIssuesFacade.loadOtherIssuesCount();
      expect(storeSpy).toHaveBeenCalledWith(action);
    }));

    it('should call LOAD_ISSUE_LIST action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const payload: OtherIssueLoadListItemsPayload = {
        pageIndex: 0,
        pageSize: 10,
        type: ''
      };
      const action = new LoadIssueList(payload);
      otherIssuesFacade.loadIssueList(payload);
      expect(storeSpy).toHaveBeenCalledWith(action);
    }));

    it('should call LOAD_ISSUE_LOAN_LIST action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const payload: OtherIssueLoadListItemsPayload = {
        pageIndex: 0,
        pageSize: 10,
        type: ''
      };
      const action = new LoadIssueLoanList(payload);
      otherIssuesFacade.loadIssueLoanList(payload);
      expect(storeSpy).toHaveBeenCalledWith(action);
    }));

    it('should call  DROPDOWN_SELECTED_FOR_ISSUES action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const payload = '';

        const action = new DropDownvalueForIssues(payload);
        otherIssuesFacade.setSelectedDropDownForIssues(payload);
        expect(storeSpy).toHaveBeenCalledWith(action);
      }
    ));

    it('should call  loadSelectedHistoryItemsTotalCount action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const payload = '';

        const action = new LoadSelectedHistoryItemsTotalCount({
          actionType: '',
          id: 1,
          page: 0,
          transactionType: 'EXH',
          payload: {
            binCodes: [],
            binGroupCode: '',
            itemCode: '',
            lotNumber: '',
            productCategories: [],
            productGroups: []
          },
          size: 0,
          sort: [],
          type: 'EXH'
        });
        otherIssuesFacade.loadSelectedHistoryItemsTotalCount({
          actionType: '',
          id: 1,
          page: 0,
          transactionType: 'EXH',
          payload: {
            binCodes: [],
            binGroupCode: '',
            itemCode: '',
            lotNumber: '',
            productCategories: [],
            productGroups: []
          },
          size: 0,
          sort: [],
          type: 'EXH'
        });
        expect(storeSpy).toHaveBeenCalledWith(action);
      }
    ));

    it('should call  clearSelectedHistoryItems action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();

        const action = new ClearSelectedHistoryItems();
        otherIssuesFacade.clearSelectedHistoryItems();
        expect(storeSpy).toHaveBeenCalledWith(action);
      }
    ));

    it('should call  SEARCH_CLEAR_ISSUE action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const action = new SearchClearIssue();
      otherIssuesFacade.searchIssueClear();
      expect(storeSpy).toHaveBeenCalledWith(action);
    }));

    it('should call  CLEAR_ITEMS action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const action = new ClearItems();
      otherIssuesFacade.clearItems();
      expect(storeSpy).toHaveBeenCalledWith(action);
    }));

    it('should call LOAD_ISSUE_LOAN_LIST action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const payload: OtherIssueLoadListItemsPayload = {
        pageIndex: 0,
        pageSize: 10,
        type: ''
      };
      const action = new LoadIssueLoanList(payload);
      otherIssuesFacade.loadIssueLoanList(payload);
      expect(storeSpy).toHaveBeenCalledWith(action);
    }));

    it('should call LOAD_SELECTED_ISSUE action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const payload: OtherIssueLoadSelectedPayload = {
        reqDocNo: 0,
        type: ''
      };
      const action = new LoadSelectedIssue(payload);
      otherIssuesFacade.loadSelectedIssue(payload);
      expect(storeSpy).toHaveBeenCalledWith(action);
    }));

    it('should call LOAD_NON_VERIFIED_OTHER_ISSUE_ITEMS action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const payload: LoadOtherIssuesItemPayload = {
          id: 0,
          pageIndex: 0,
          pageSize: 10,
          status: '',
          type: ''
        };
        const action = new LoadNonVerifiedOtherIssueItems(payload);
        otherIssuesFacade.loadNonVerifiedItems(payload);
        expect(storeSpy).toHaveBeenCalledWith(action);
      }
    ));

    it('should call CREATE_OTHER_STOCK_ISSUE_ITEMS action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const payload: CreateOtherStockIssueItemsPayload = {
          id: 0,
          data: '',
          transferType: ''
        };
        const action = new CreateOtherStockIssueItems(payload);
        otherIssuesFacade.createOtherStockIssueItems(payload);
        expect(storeSpy).toHaveBeenCalledWith(action);
      }
    ));

    it('should call REMOVE_INITIAL_LOAD_OTHER_ISSUE action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();

        const action = new RemoveInitialLoadOtherIssue();
        otherIssuesFacade.removeInitialLoadOtherIssue();
        expect(storeSpy).toHaveBeenCalledWith(action);
      }
    ));

    it('should call CONFIRM_OTHER_STOCK_ISSUE action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const payload: ConfirmOtherStockIssuePayload = {
          id: 0,
          carrierDetails: { data: {}, type: '' },
          destinationLocationCode: '',
          remarks: '',
          transferType: ''
        };
        const action = new ConfirmOtherStockIssue(payload);
        otherIssuesFacade.confirmOtherStockIssue(payload);
        expect(storeSpy).toHaveBeenCalledWith(action);
      }
    ));

    it('should call RESET_CONFIRM_OTHER_STOCK_ISSUE_RESPONSE action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();

        const action = new ResetConfirmOtherIssueResponse();
        otherIssuesFacade.resetConfirmOtherIssueResponse();
        expect(storeSpy).toHaveBeenCalledWith(action);
      }
    ));

    it('should call CREATE_OTHER_ISSUE_STOCK_REQUEST action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const payload: OtherIssuesCreateStockResponsePayload = {
          reqtype: ''
        };
        const action = new CreateOtherIssueStockRequest(payload);
        otherIssuesFacade.createOtherIssuesStockRequest(payload);
        expect(storeSpy).toHaveBeenCalledWith(action);
      }
    ));

    it('should call LOAD_ALL_OTHER_ISSUE_CREATE_ITEMS action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const payload: LoadAllOtherIssuePayload = {
          id: 0,
          pageIndex: 0,
          pageSize: 10,
          reqtype: ''
        };
        const action = new LoadAllOtherIssueCreateItems(payload);
        otherIssuesFacade.loadAllOtherIssueCreateItems(payload);
        expect(storeSpy).toHaveBeenCalledWith(action);
      }
    ));

    it('should call LOAD_SELECTED_OTHER_ISSUE_ITEMS action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const payload: LoadAllOtherIssuePayload = {
          id: 0,
          pageIndex: 0,
          pageSize: 10,
          reqtype: ''
        };
        const action = new LoadSelectedOtherIssueCreateItems(payload);
        otherIssuesFacade.loadSelectedOtherIssueCreateItems(payload);
        expect(storeSpy).toHaveBeenCalledWith(action);
      }
    ));

    it('should call LOAD_ISSUE_ITEMS_CREATE_COUNT action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const payload: LoadOtherIssueCreateItemsTotalCountPayload = {
          id: 1,
          reqtype: ''
        };
        const action = new LoadIssueItemsCreateTotalCount(payload);
        otherIssuesFacade.loadOtherIssueItemsCreateTotalCount(payload);
        expect(storeSpy).toHaveBeenCalledWith(action);
      }
    ));

    it('should call CREATE_OTHER_ISSUE_STOCK_REQUEST_ITEMS action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const payload: CreateOtherIssueStockRequestItemsPayload = {
          data: '',
          id: 1,
          requestType: ''
        };
        const action = new CreateOtherIssueStockRequestItems(payload);
        otherIssuesFacade.createOtherIssueStockRequestItems(payload);
        expect(storeSpy).toHaveBeenCalledWith(action);
      }
    ));

    it('should call REMOVE_OTHER_ISSUE_STOCK_REQUEST_ITEMS action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const payload: RemoveOtherIssueStockRequestItemsPayload = {
          data: '',
          id: 1,
          requestType: ''
        };
        const action = new RemoveOtherIssueStockRequestItems(payload);
        otherIssuesFacade.removeOtherIssueStockRequestItems(payload);
        expect(storeSpy).toHaveBeenCalledWith(action);
      }
    ));

    it('should call UPDATE_STOCK_REQUEST_CREATE_ITEM action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const payload: UpdateStockRequestItemPayload = {
          id: 1,
          itemid: 1,
          reqType: '',
          value: { inventoryId: 0, measuredWeight: 0, quantity: 0, status: '' }
        };
        const action = new UpdateStockRequestCreateItem(payload);
        otherIssuesFacade.updateStockRequestCreateItem(payload);
        expect(storeSpy).toHaveBeenCalledWith(action);
      }
    ));

    it('should call RESET_OTHER_ISSUE_CREATE_LIST_ITEMS action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();

        const action = new ResetOtherIssueCreateListItems();
        otherIssuesFacade.resetOtherIssueCreateListItems();
        expect(storeSpy).toHaveBeenCalledWith(action);
      }
    ));

    it('should call RESET_OTHER_ISSUE_CREATE_RESPONSEaction', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();

        const action = new ResetOtherIssueCreateResponse();
        otherIssuesFacade.resetOtherIssueCreateResponse();
        expect(storeSpy).toHaveBeenCalledWith(action);
      }
    ));

    it('should call UPDATE_STOCK_REQUEST action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const payload: UpdateStockRequestPayload = {
        id: 1,
        approvalDetails: { data: {}, type: '' },
        carrierDetails: { data: {}, type: '' },
        remarks: '',
        reqType: '',
        status: ''
      };
      const action = new UpdateStockRequest(payload);
      otherIssuesFacade.updateStockRequest(payload);
      expect(storeSpy).toHaveBeenCalledWith(action);
    }));

    it('should call ADJUSTMENT_SEARCH action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const payload: AdjustmentSearchItemPayload = {
        lotNumber: '',
        productGroups: [],
        variantCode: '',
        rowNumber: 1
      };
      const action = new SearchAdjustment(payload);
      otherIssuesFacade.searchAdjustmentItems(payload);
      expect(storeSpy).toHaveBeenCalledWith(action);
    }));

    it('should call ADD_ADJUSTMENT_ITEMS_TO_CART action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const payload: OtherIssuesItem[] = [dummysearchOtherIssueCreateItems];

        const action = new AddItemsToCart(payload);
        otherIssuesFacade.addItemsToCart(payload);
        expect(storeSpy).toHaveBeenCalledWith(action);
      }
    ));

    it('should call CREATE_STOCK_REQUEST_ADJUSTMENT action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const payload: CreateStockRequestAdjustmentPayload = {
          approvalDetails: { data: {}, type: '' },
          items: {},
          remarks: '',
          reqType: ''
        };
        const action = new CreateStockRequestAdjustment(payload);
        otherIssuesFacade.createStockRequestAdjustment(payload);
        expect(storeSpy).toHaveBeenCalledWith(action);
      }
    ));

    it('should call UPDATE_CART_ITEM_ADJUSTMENT action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const payload: UpdateCartItemAdjustmentPayload = {
          id: 1,
          quantity: 1,
          weight: 1
        };

        const action = new UpdateCartItemsAdjustment(payload);
        otherIssuesFacade.updateCartItem(payload);
        expect(storeSpy).toHaveBeenCalledWith(action);
      }
    ));

    it('should call REMOVE_CART_ITEM_ADJUSTMENT action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const payload: RemoveCartItemAdjustmentPayload = {
          ids: []
        };

        const action = new RemoveCartItemsAdjustment(payload);
        otherIssuesFacade.removeSelectedItems(payload);
        expect(storeSpy).toHaveBeenCalledWith(action);
      }
    ));

    it('should call LOAD_ISSUE_ADJ_LIST action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const payload: OtherIssueLoadListItemsPayload = {
        pageIndex: 0,
        pageSize: 1,
        type: ''
      };

      const action = new LoadIssueADJList(payload);
      otherIssuesFacade.loadIssueADJList(payload);
      expect(storeSpy).toHaveBeenCalledWith(action);
    }));

    it('should call RESET_ADJUSTMENT_ISSUE_DATA action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();

        const action = new ResetAdjustmentIssueData();
        otherIssuesFacade.resetAdjustmentIssueData();
        expect(storeSpy).toHaveBeenCalledWith(action);
      }
    ));

    it('should call LOAD_ISSUE_ADJ_LIST action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const payload: OtherIssueLoadListItemsPayload = {
        pageIndex: 0,
        pageSize: 1,
        type: ''
      };

      const action = new LoadIssueADJList(payload);
      otherIssuesFacade.loadIssueADJList(payload);
      expect(storeSpy).toHaveBeenCalledWith(action);
    }));

    it('should call LOAD_ISSUE_LOSS_LIST action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const payload: OtherIssueLoadListItemsPayload = {
        pageIndex: 0,
        pageSize: 1,
        type: ''
      };

      const action = new LoadIssueLossList(payload);
      otherIssuesFacade.loadIssueLossList(payload);
      expect(storeSpy).toHaveBeenCalledWith(action);
    }));

    it('should call LOAD_ISSUE_PSV_LIST action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const payload: OtherIssueLoadListItemsPayload = {
        pageIndex: 0,
        pageSize: 1,
        type: ''
      };

      const action = new LoadIssuePSVList(payload);
      otherIssuesFacade.loadIssuePSVList(payload);
      expect(storeSpy).toHaveBeenCalledWith(action);
    }));

    it('should call CLEAR_SEARCH_CART_ITEM_ADJUSTMENT action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();

        const action = new ClearSearchCartItemAdjustment();
        otherIssuesFacade.clearSearchCartItemAdjustment();
        expect(storeSpy).toHaveBeenCalledWith(action);
      }
    ));

    it('should call PSV_SEARCH_SUCCESS action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const payload: PSVSearchItemPayload = {
        lotNumber: '',
        productGroups: [],
        variantCode: '',
        rowNumber: 0
      };
      const action = new SearchPSV(payload);

      otherIssuesFacade.searchPSVItems(payload);
      expect(storeSpy).toHaveBeenCalledWith(action);
    }));

    it('should call ADD_PSV_ITEMS_TO_CART action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const payload: OtherIssuesItem[] = [dummysearchOtherIssueCreateItems];
      const action = new AddPSVItemsToCart(payload);
      otherIssuesFacade.addPSVItemsToCart(payload);
      expect(storeSpy).toHaveBeenCalledWith(action);
    }));

    it('should call CREATE_STOCK_REQUEST_PSV action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const payload: CreateStockRequestPSVPayload = {
        approvalDetails: { data: {}, type: '' },
        items: [],
        remarks: '',
        reqType: ''
      };
      const action = new CreateStockRequestPSV(payload);
      otherIssuesFacade.createStockRequestPSV(payload);
      expect(storeSpy).toHaveBeenCalledWith(action);
    }));

    it('should call REMOVE_CART_ITEM_PSV action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const payload: RemoveCartItemPSVPayload = {
        ids: []
      };
      const action = new RemoveCartItemsPSV(payload);
      otherIssuesFacade.removeSelectedPSVItems(payload);
      expect(storeSpy).toHaveBeenCalledWith(action);
    }));

    it('should call RESET_PSV_ISSUE_DATA action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const action = new ResetPSVIssueData();
      otherIssuesFacade.resetPSVIssueData();
      expect(storeSpy).toHaveBeenCalledWith(action);
    }));

    it('should call CLEAR_SEARCH_CART_ITEM_PSV action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();

        const action = new ClearSearchCartItemPSV();
        otherIssuesFacade.clearSearchCartItemPSV();
        expect(storeSpy).toHaveBeenCalledWith(action);
      }
    ));

    it('should call FOC_SEARCH action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const payload: PSVSearchItemPayload = {
        lotNumber: '',
        productGroups: [],
        variantCode: '',
        rowNumber: 1
      };
      const action = new SearchFOC(payload);
      otherIssuesFacade.searchFOCItems(payload);
      expect(storeSpy).toHaveBeenCalledWith(action);
    }));

    it('should call ADD_FOC_ITEMS_TO_CART action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const payload: OtherIssuesItem[] = [dummysearchOtherIssueCreateItems];
      const action = new AddFOCItemsToCart(payload);
      otherIssuesFacade.addFOCItemsToCart(payload);
      expect(storeSpy).toHaveBeenCalledWith(action);
    }));

    it('should call CREATE_STOCK_REQUEST_FOC action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const payload: CreateStockRequestPSVPayload = {
        approvalDetails: { data: {}, type: '' },
        items: '',
        remarks: '',
        reqType: ''
      };
      const action = new CreateStockRequestFOC(payload);
      otherIssuesFacade.createStockRequestFOC(payload);
      expect(storeSpy).toHaveBeenCalledWith(action);
    }));

    it('should call UPDATE_CART_ITEM_FOC action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const payload: UpdateCartItemPSVPayload = {
        id: 1,
        quantity: 1,
        weight: 1
      };
      const action = new UpdateCartItemsFOC(payload);
      otherIssuesFacade.updateFOCCartItem(payload);
      expect(storeSpy).toHaveBeenCalledWith(action);
    }));

    it('should call REMOVE_CART_ITEM_FOC action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const payload: RemoveCartItemPSVPayload = { ids: [] };
      const action = new RemoveCartItemsFOC(payload);
      otherIssuesFacade.removeSelectedFOCItems(payload);
      expect(storeSpy).toHaveBeenCalledWith(action);
    }));

    it('should call RESET_FOC_ISSUE_DATA action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const action = new ResetFOCIssueData();
      otherIssuesFacade.resetFOCIssueData();
      expect(storeSpy).toHaveBeenCalledWith(action);
    }));

    it('should call CLEAR_SEARCH_CART_ITEM_FOC action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();

        const action = new ClearSearchCartItemFOC();
        otherIssuesFacade.clearSearchCartItemFOC();
        expect(storeSpy).toHaveBeenCalledWith(action);
      }
    ));

    it('should call LOAD_ISSUE_FOC_LIST action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const payload: OtherIssueLoadListItemsPayload = {
        pageIndex: 0,
        pageSize: 1,
        type: ''
      };
      const action = new LoadIssueFOCList(payload);
      otherIssuesFacade.loadIssueFOCList(payload);
      expect(storeSpy).toHaveBeenCalledWith(action);
    }));

    it('should call CLEAR_SEARCH_INVENTORY_ADJUSTMENT action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();

        const action = new ClearSearchInventoryItemAdjustment();
        otherIssuesFacade.clearSearchInventoryItemAdjustment();
        expect(storeSpy).toHaveBeenCalledWith(action);
      }
    ));

    it('should call CLEAR_SEARCH_INVENTORY_PSV action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();

        const action = new ClearSearchInventoryItemPSV();
        otherIssuesFacade.clearSearchInventoryItemPSV();
        expect(storeSpy).toHaveBeenCalledWith(action);
      }
    ));

    it('should call CLEAR_SEARCH_INVENTORY_FOC action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();

        const action = new ClearSearchInventoryItemFOC();
        otherIssuesFacade.clearSearchInventoryItemFOC();
        expect(storeSpy).toHaveBeenCalledWith(action);
      }
    ));

    it('should call CANCEL_STOCK_REQUEST action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const payload: CancelOtherRequestPayload = { id: 1, requestType: '' };
      const action = new CancelStockRequest(payload);
      otherIssuesFacade.cancelOtherStockRequestResponse(payload);
      expect(storeSpy).toHaveBeenCalledWith(action);
    }));

    it('should call PRINT_OTHER_ISSUES action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const payload: PrintOtherIssuePayload = { id: 1, requestType: '' };
      const action = new PrintOtherIssues(payload);
      otherIssuesFacade.printOtherIssue(payload);
      expect(storeSpy).toHaveBeenCalledWith(action);
    }));

    it('should call LOAD_PRODUCT_GROUPS action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const action = new LoadProductGroups('');
      otherIssuesFacade.loadProductGroups('');
      expect(storeSpy).toHaveBeenCalledWith(action);
    }));

    it('should call LOAD_STUDDED_PRODUCT_GROUPS action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const action = new LoadStuddedProductGroups();
        otherIssuesFacade.loadStuddedProductGroups();
        expect(storeSpy).toHaveBeenCalledWith(action);
      }
    ));

    it('should call LOAD_PRODUCT_CATEGORIES action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const action = new LoadProductCategories();
      otherIssuesFacade.loadProductCategories();
      expect(storeSpy).toHaveBeenCalledWith(action);
    }));

    it('should call SET_FILTER_DATA_ALL_PRODUCTS action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const payload = {};
        const action = new SetFilterDataAllProducts({});
        otherIssuesFacade.setOtherIssueAllProductsFilter(payload);
        expect(storeSpy).toHaveBeenCalledWith(action);
      }
    ));

    it('should call SET_FILTER_DATA_SELECTED_PRODUCTS action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const payload = {};
        const action = new SetFilterDataSelectedProducts({});
        otherIssuesFacade.setOtherIssueSelectedProductsFilter(payload);
        expect(storeSpy).toHaveBeenCalledWith(action);
      }
    ));

    it('should call SET_SORT_DATA_ALL_PRODUCTS action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();

        const action = new SetSortDataAllProducts([]);
        otherIssuesFacade.setOtherIssueAllProductsSort([]);
        expect(storeSpy).toHaveBeenCalledWith(action);
      }
    ));

    it('should call CLEAR_ITEMS action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const action = new SetSortDataSelectedProducts([]);
      otherIssuesFacade.setOtherIssueSelectedProductsSort([]);
      expect(storeSpy).toHaveBeenCalledWith(action);
    }));

    it('should call SET_SORT_DATA_SELECTED_PRODUCTS action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();

        const action = new SetSortDataSelectedProducts([]);
        otherIssuesFacade.setOtherIssueSelectedProductsSort([]);
        expect(storeSpy).toHaveBeenCalledWith(action);
      }
    ));

    it('should call SET_FILTER_DATA_OTHER_ISSUE action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const payload = {};
        const action = new SetFilterDataOtherIssue(payload);
        otherIssuesFacade.setOtherIssueFilter(payload);
        expect(storeSpy).toHaveBeenCalledWith(action);
      }
    ));

    it('should call SET_SORT_DATA_OTHER_ISSUE action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const payload = {};
        const action = new SetSortDataOtherIssue([]);
        otherIssuesFacade.setOtherIssueSort([]);
        expect(storeSpy).toHaveBeenCalledWith(action);
      }
    ));

    it('should call UPDATE_CART_ITEM_PSV action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const payload: UpdateCartItemPSVPayload = {
        id: 0,
        quantity: 0,
        weight: 0
      };
      const action = new UpdateCartItemsPSV(payload);
      otherIssuesFacade.updatePSVCartItem(payload);
      expect(storeSpy).toHaveBeenCalledWith(action);
    }));
  });

  describe('Access Selector action', () => {
    it('should get OtherIssueHistory data', () => {
      expect(otherIssuesFacade.getOtherIssueHistory()).toBeTruthy();
    });
    it('should get getHasError data', () => {
      expect(otherIssuesFacade.getHasError()).toBeTruthy();
    });

    it('should get getIsLoading data', () => {
      expect(otherIssuesFacade.getIsLoading()).toBeTruthy();
    });

    it('should get getOtherIssuesSTNCount data', () => {
      expect(otherIssuesFacade.getOtherIssuesSTNCount()).toBeTruthy();
    });

    it('should get getOtherIssueList data', () => {
      expect(otherIssuesFacade.getOtherIssueList()).toBeTruthy();
    });

    it('should get getOtherIssueLoanList data', () => {
      expect(otherIssuesFacade.getOtherIssueLoanList()).toBeTruthy();
    });

    it('should get getIsLoadingOtherIssuesSTN data', () => {
      expect(otherIssuesFacade.getIsLoadingOtherIssuesSTN()).toBeTruthy();
    });

    it('should get getOtherIssueSearchStockResults data', () => {
      expect(otherIssuesFacade.getOtherIssueSearchStockResults()).toBeTruthy();
    });

    it('should get getOtherIssuesDropdown data', () => {
      expect(otherIssuesFacade.getOtherIssuesDropdown()).toBeTruthy();
    });

    it('should get getSelectedIssueDropDownValue data', () => {
      expect(otherIssuesFacade.getSelectedIssueDropDownValue()).toBeTruthy();
    });

    it('should get getSelectedIssue data', () => {
      expect(otherIssuesFacade.getSelectedIssue()).toBeTruthy();
    });

    it('should get getTotalIssueElementCount data', () => {
      expect(otherIssuesFacade.getTotalIssueElementCount()).toBeTruthy();
    });

    it('should get getIsSearchingStocks data', () => {
      expect(otherIssuesFacade.getIsSearchingStocks()).toBeTruthy();
    });

    it('should get getHasSearchStockResults data', () => {
      expect(otherIssuesFacade.getHasSearchStockResults()).toBeTruthy();
    });

    it('should get getNonVerifiedOtherissueItems data', () => {
      expect(otherIssuesFacade.getNonVerifiedOtherissueItems()).toBeTruthy();
    });

    it('should get getHasSearchedOtherIssueItems data', () => {
      expect(otherIssuesFacade.getHasSearchedOtherIssueItems()).toBeTruthy();
    });

    it('should get getisLoadingSelectedIssueStock data', () => {
      expect(otherIssuesFacade.getisLoadingSelectedIssueStock()).toBeTruthy();
    });

    it('should get getIsSearchingOtherIssueItems data', () => {
      expect(otherIssuesFacade.getSelectedIssueDropDownValue()).toBeTruthy();
    });

    it('should get getIsSearchingOtherIssueItems data', () => {
      expect(otherIssuesFacade.getIsSearchingOtherIssueItems()).toBeTruthy();
    });

    it('should get getCreateOtherStockIssueItemsResponse data', () => {
      expect(
        otherIssuesFacade.getCreateOtherStockIssueItemsResponse()
      ).toBeTruthy();
    });

    it('should get getConfirmOtherStockIssueResponse data', () => {
      expect(
        otherIssuesFacade.getConfirmOtherStockIssueResponse()
      ).toBeTruthy();
    });

    it('should get getisLoadingOtherIssueDetails data', () => {
      expect(otherIssuesFacade.getisLoadingOtherIssueDetails()).toBeTruthy();
    });

    it('should get getOtherIssuesStockRequest data', () => {
      expect(otherIssuesFacade.getOtherIssuesStockRequest()).toBeTruthy();
    });

    it('should get getAllOtherIssuesCreateItems data', () => {
      expect(otherIssuesFacade.getAllOtherIssuesCreateItems()).toBeTruthy();
    });

    it('should get getallOtherIssueCreateItemsTotalCount data', () => {
      expect(
        otherIssuesFacade.getallOtherIssueCreateItemsTotalCount()
      ).toBeTruthy();
    });

    it('should get getSelectedOtherIssueCreateTotalCount data', () => {
      expect(
        otherIssuesFacade.getSelectedOtherIssueCreateTotalCount()
      ).toBeTruthy();
    });

    it('should get getIsAllOtherIssueCreateItemsLoading data', () => {
      expect(
        otherIssuesFacade.getIsAllOtherIssueCreateItemsLoading()
      ).toBeTruthy();
    });

    it('should get getSelecetedIssuesCreateItems data', () => {
      expect(otherIssuesFacade.getSelecetedIssuesCreateItems()).toBeTruthy();
    });

    it('should get getselectIsSelectedOtherIssueItemsLoading data', () => {
      expect(
        otherIssuesFacade.getselectIsSelectedOtherIssueItemsLoading()
      ).toBeTruthy();
    });

    it('should get getselectIsOtherIssueCreateTotalCountLoaded data', () => {
      expect(
        otherIssuesFacade.getselectIsOtherIssueCreateTotalCountLoaded()
      ).toBeTruthy();
    });
    it('should get getselectIsOtherIssueCreateTotalCountLoading data', () => {
      expect(
        otherIssuesFacade.getselectIsOtherIssueCreateTotalCountLoading()
      ).toBeTruthy();
    });
    it('should get gethasSearchedOtherIssueCreateItems data', () => {
      expect(
        otherIssuesFacade.gethasSearchedOtherIssueCreateItems()
      ).toBeTruthy();
    });
    it('should get getisSearchingOtherIssueCreateItems data', () => {
      expect(
        otherIssuesFacade.getisSearchingOtherIssueCreateItems()
      ).toBeTruthy();
    });
    it('should get getCreateStockRequestItemsResponse data', () => {
      expect(
        otherIssuesFacade.getCreateStockRequestItemsResponse()
      ).toBeTruthy();
    });
    it('should get getRemoveOtherIssueStockRequestItemsResponse data', () => {
      expect(
        otherIssuesFacade.getRemoveOtherIssueStockRequestItemsResponse()
      ).toBeTruthy();
    });
    it('should get getRemoveOtherIssueStockRequestItemsResponse data', () => {
      expect(
        otherIssuesFacade.getRemoveOtherIssueStockRequestItemsResponse()
      ).toBeTruthy();
    });
    it('should get getupdateStockRequestResponse data', () => {
      expect(otherIssuesFacade.getupdateStockRequestResponse()).toBeTruthy();
    });
    it('should get getSearchedAdjustmentItems data', () => {
      expect(otherIssuesFacade.getSearchedAdjustmentItems()).toBeTruthy();
    });
    it('should get getpAdjustmentItemsInCarts data', () => {
      expect(otherIssuesFacade.getpAdjustmentItemsInCarts()).toBeTruthy();
    });
    it('should get getOtherIssueADJList data', () => {
      expect(otherIssuesFacade.getOtherIssueADJList()).toBeTruthy();
    });
    it('should get getOtherIssueLossList data', () => {
      expect(otherIssuesFacade.getOtherIssueLossList()).toBeTruthy();
    });

    it('should get getOtherIssuePSVList data', () => {
      expect(otherIssuesFacade.getOtherIssuePSVList()).toBeTruthy();
    });

    it('should get getCreateStockRequestAdjustmentResponse data', () => {
      expect(
        otherIssuesFacade.getCreateStockRequestAdjustmentResponse()
      ).toBeTruthy();
    });

    it('should get getAdjustmentItemsInCartsSearch data', () => {
      expect(otherIssuesFacade.getAdjustmentItemsInCartsSearch()).toBeTruthy();
    });

    it('should get getIsSearchingAdjustment data', () => {
      expect(otherIssuesFacade.getIsSearchingAdjustment()).toBeTruthy();
    });

    it('should get gethasSearchedItemAdjustment data', () => {
      expect(otherIssuesFacade.gethasSearchedItemAdjustment()).toBeTruthy();
    });

    it('should get getIsLoadingAdjustment data', () => {
      expect(otherIssuesFacade.getIsLoadingAdjustment()).toBeTruthy();
    });

    it('should get getHasSearchItemInCartSearch data', () => {
      expect(otherIssuesFacade.getHasSearchItemInCartSearch()).toBeTruthy();
    });
    it('should get getSearchedPSVItems data', () => {
      expect(otherIssuesFacade.getSearchedPSVItems()).toBeTruthy();
    });
    it('should get getPSVItemsInCarts data', () => {
      expect(otherIssuesFacade.getPSVItemsInCarts()).toBeTruthy();
    });
    it('should get getCreateStockRequestPSVResponse data', () => {
      expect(otherIssuesFacade.getCreateStockRequestPSVResponse()).toBeTruthy();
    });

    it('should get getPSVItemsInCartsSearch data', () => {
      expect(otherIssuesFacade.getPSVItemsInCartsSearch()).toBeTruthy();
    });
    it('should get getError data', () => {
      expect(otherIssuesFacade.getError()).toBeTruthy();
    });
    it('should get getIsSearchingPSV data', () => {
      expect(otherIssuesFacade.getIsSearchingPSV()).toBeTruthy();
    });
    it('should get gethasSearchedItemPSV data', () => {
      expect(otherIssuesFacade.gethasSearchedItemPSV()).toBeTruthy();
    });
    it('should get getIsLoadingPSV data', () => {
      expect(otherIssuesFacade.getIsLoadingPSV()).toBeTruthy();
    });
    it('should get getError data', () => {
      expect(otherIssuesFacade.getError()).toBeTruthy();
    });
    it('should get getHasSearchItemInCartSearchPSV data', () => {
      expect(otherIssuesFacade.getHasSearchItemInCartSearchPSV()).toBeTruthy();
    });
    it('should get getSearchedFOCItems data', () => {
      expect(otherIssuesFacade.getSearchedFOCItems()).toBeTruthy();
    });
    it('should get getFOCItemsInCarts data', () => {
      expect(otherIssuesFacade.getFOCItemsInCarts()).toBeTruthy();
    });
    it('should get getCreateStockRequestFOCResponse data', () => {
      expect(otherIssuesFacade.getCreateStockRequestFOCResponse()).toBeTruthy();
    });

    it('should get getFOCItemsInCartsSearch data', () => {
      expect(otherIssuesFacade.getFOCItemsInCartsSearch()).toBeTruthy();
    });
    it('should get getOtherIssueFOCList data', () => {
      expect(otherIssuesFacade.getOtherIssueFOCList()).toBeTruthy();
    });

    it('should get getIsSearchingFOC data', () => {
      expect(otherIssuesFacade.getIsSearchingFOC()).toBeTruthy();
    });

    it('should get gethasSearchedItemFOC data', () => {
      expect(otherIssuesFacade.gethasSearchedItemFOC()).toBeTruthy();
    });

    it('should get getIsLoadingFOC data', () => {
      expect(otherIssuesFacade.getIsLoadingFOC()).toBeTruthy();
    });

    it('should get getHasSearchItemInCartSearchFOC data', () => {
      expect(otherIssuesFacade.getHasSearchItemInCartSearchFOC()).toBeTruthy();
    });

    it('should get getIsLoadingCancelStockRequestResponse data', () => {
      expect(
        otherIssuesFacade.getIsLoadingCancelStockRequestResponse()
      ).toBeTruthy();
    });
    it('should get getCancelOtherStockRequestResponse data', () => {
      expect(
        otherIssuesFacade.getCancelOtherStockRequestResponse()
      ).toBeTruthy();
    });
    it('should get getPrintDataResponse data', () => {
      expect(otherIssuesFacade.getPrintDataResponse()).toBeTruthy();
    });

    it('should get getProductCategories data', () => {
      expect(otherIssuesFacade.getProductCategories()).toBeTruthy();
    });
    it('should get getProductGroups data', () => {
      expect(otherIssuesFacade.getProductGroups()).toBeTruthy();
    });
    it('should get getfilterDataAllProducts data', () => {
      expect(otherIssuesFacade.getfilterDataAllProducts()).toBeTruthy();
    });
    it('should get getSortDataAllProducts data', () => {
      expect(otherIssuesFacade.getSortDataAllProducts()).toBeTruthy();
    });
    it('should get getfilterDataSelectedProducts data', () => {
      expect(otherIssuesFacade.getfilterDataSelectedProducts()).toBeTruthy();
    });
    it('should get getSortDataSelectedProducts data', () => {
      expect(otherIssuesFacade.getSortDataSelectedProducts()).toBeTruthy();
    });
    it('should get getFilterDataOtherIssue data', () => {
      expect(otherIssuesFacade.getFilterDataOtherIssue()).toBeTruthy();
    });

    it('should get getSortDataOtherIssue data', () => {
      expect(otherIssuesFacade.getSortDataOtherIssue()).toBeTruthy();
    });
  });

  describe('getOtherIssueHistory', () => {
    it('should get OtherIssueHistory data', () => {
      expect(otherIssuesFacade.getOtherIssueHistory()).toBeTruthy();
    });
  });
  describe('getIsLoadingIssueHistory', () => {
    it('should get IsLoadingIssueHistory data', () => {
      expect(otherIssuesFacade.getIsLoadingIssueHistory()).toBeTruthy();
    });
  });

  describe('getOtherIssueHistoryCount', () => {
    it('should get OtherIssueHistoryCount data', () => {
      expect(otherIssuesFacade.getOtherIssueHistoryCount()).toBeTruthy();
    });
  });
  describe('getIsLoadingSelectedHistory', () => {
    it('should get IsLoadingSelectedHistory data', () => {
      expect(otherIssuesFacade.getIsLoadingSelectedHistory()).toBeTruthy();
    });
  });

  describe('getHasSelectedHistory', () => {
    it('should get HasSelectedHistory data', () => {
      expect(otherIssuesFacade.getHasSelectedHistory()).toBeTruthy();
    });
  });

  describe('getSelectedHistory', () => {
    it('should get SelectedHistory data', () => {
      expect(otherIssuesFacade.getSelectedHistory()).toBeTruthy();
    });
  });

  describe('getHistoryItemsCount', () => {
    it('should get HistoryItemsCount data', () => {
      expect(otherIssuesFacade.getHistoryItemsCount()).toBeTruthy();
    });
  });
  describe('getHistoryItems', () => {
    it('should get HistoryItems data', () => {
      expect(otherIssuesFacade.getHistoryItems()).toBeTruthy();
    });
  });

  describe('getIsLoadingHistoryItems', () => {
    it('should get IsLoadingHistoryItems data', () => {
      expect(otherIssuesFacade.getIsLoadingHistoryItems()).toBeTruthy();
    });
  });

  describe('getIsHistoryItemsLoaded', () => {
    it('should get IsHistoryItemsLoaded data', () => {
      expect(otherIssuesFacade.getIsHistoryItemsLoaded()).toBeTruthy();
    });
  });

  describe('getHistoryItemsTotalCount', () => {
    it('should get HistoryItemsTotalCount data', () => {
      expect(otherIssuesFacade.getHistoryItemsTotalCount()).toBeTruthy();
    });
  });

  describe('getIsLoadingHistoryItemsTotalCount', () => {
    it('should get IsLoadingHistoryItemsTotalCount data', () => {
      expect(
        otherIssuesFacade.getIsLoadingHistoryItemsTotalCount()
      ).toBeTruthy();
    });
  });

  describe('getIsHistoryItemsTotalCountLoaded', () => {
    it('should get IsHistoryItemsTotalCountLoaded data', () => {
      expect(
        otherIssuesFacade.getIsHistoryItemsTotalCountLoaded()
      ).toBeTruthy();
    });
  });
  describe('getAdvancedFilterData', () => {
    it('should get AdvancedFilterData data', () => {
      expect(otherIssuesFacade.getAdvancedFilterData()).toBeTruthy();
    });
  });

  describe('loadOtherIssueHistory', () => {
    it('should dispatch LoadOtherIssueHistory action', inject(
      [Store],
      store => {
        const payload: LoadOtherIssueHistoryPayload = {
          type: 'other-issues',
          page: 0,
          size: 8,
          sort: '',
          payload: {
            actionType: 'ISSUE',
            dateRangeType: 'LAST_YEAR',
            endDate: null,
            issueDocNo: null,
            issueFiscalYear: null,
            receiveDocNo: null,
            receiveFiscalYear: null,
            startDate: null,
            statuses: [],
            transactionType: 'ADJ'
          },
          issueType: 'ADJ'
        };
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new LoadOtherIssueHistory(payload);
        otherIssuesFacade.loadOtherIssueHistory(payload);
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });

  describe('resetOtherIssueHistory', () => {
    it('should dispatch loadOtherIssueHistory action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new ResetOtherIssueHistory();
        otherIssuesFacade.resetOtherIssueHistory();
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });

  describe('loadSelectedHistory', () => {
    it('should dispatch LoadSelectedHistory action', inject([Store], store => {
      const payload = {
        type: 'other-issue',
        actionType: 'ISSUE',
        id: 1,
        transactionType: 'ADJ'
      };
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadSelectedHistory(payload);
      otherIssuesFacade.loadSelectedHistory('other-issue', 'ISSUE', 1, 'ADJ');
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('loadSelectedHistoryItems', () => {
    it('should dispatch LoadSelectedHistoryItems action', inject(
      [Store],
      store => {
        const payload: LoadOtherIssueHistoryItemsPayload = {
          type: 'other-issues',
          actionType: 'ISSUE',
          id: 1,
          page: 0,
          size: 10,
          sort: [],
          payload: {
            binCodes: [],
            binGroupCode: null,
            itemCode: null,
            lotNumber: null,
            productCategories: [],
            productGroups: []
          },
          transactionType: 'ADJ'
        };
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new LoadSelectedHistoryItems(payload);
        otherIssuesFacade.loadSelectedHistoryItems(payload);
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });

  describe('loadSelectedHistoryItemsTotalCount', () => {
    it('should dispatch LoadSelectedHistoryItemsTotalCount action', inject(
      [Store],
      store => {
        const payload: LoadOtherIssueHistoryItemsPayload = {
          type: 'other-issues',
          actionType: 'ISSUE',
          id: 1,
          page: 0,
          size: 10,
          sort: [],
          payload: {
            binCodes: [],
            binGroupCode: null,
            itemCode: null,
            lotNumber: null,
            productCategories: [],
            productGroups: []
          },
          transactionType: 'ADJ'
        };
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new LoadSelectedHistoryItems(payload);
        otherIssuesFacade.loadSelectedHistoryItems(payload);
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });

  describe('setAdvancedFilterData', () => {
    it('should dispatch SetOtherReceiptsIssueFilterData action', inject(
      [Store],
      store => {
        const payload: OtherReceiptsIssuesAdvanceFilterPayload = {
          docFromDate: null,
          docToDate: null,
          fiscalYear: null,
          docNo: null,
          status: null
        };
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new SetOtherReceiptsIssueFilterData(payload);
        otherIssuesFacade.setAdvancedFilterData(payload);
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });

  // describe('clearAdvancedFilterData', () => {
  //   it('should dispatch ClearOtherReceiptsIssueFilterData action', inject(
  //     [Store],
  //     store => {
  //       const storeSpy = spyOn(store, 'dispatch').and.callThrough();
  //       const expectedAction = new ClearOtherReceiptsIssueFilterData();
  //       otherIssuesFacade.clearAdvancedFilterData();
  //       expect(storeSpy).toHaveBeenCalledWith(expectedAction);
  //     }
  //   ));
  // });
});
