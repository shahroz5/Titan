import {
  AdjustmentItem,
  OtherIssuesItem,
  OtherReceiptItemValidate,
  OtherReceiptsIssuesEnum,
  OtherReceiptLoadItemsPayload,
  OtherReceiptUpdateAllItemsPayload,
  OtherReceiptUpdateItemPayload,
  OtherReceiptUpdateAdjustementItemPayload,
  OtherReceiptSearchCartItemAdjustmentPayload,
  OtherReceiptConfirmAdjustmentItemsPayload,
  OtherReceiptLoadListItemsPayload,
  OtherReceiptSearchPendingPayload,
  OtherReceiptAdjustmentSearchPayload,
  ConfirmStockReceivePayload,
  OtherReceiptStockPayLoad,
  LoadOtherReceiptsHistoryPayload,
  OtherReceiptsModel,
  LoadOtherReceiptsHistoryItemsPayload
} from '@poss-web/shared/models';

import {
  LoadStuddedProductGroups,

  //create page
  ClearItems,
  //psv and adjustment
  AddItemsToCart,
  SearchCartItemsAdjustment,
  ClearSearchCartItemAdjustment,
  SearchCartItemsPSV,
  ClearSearchCartItemPSV,
  ClearSearchInventoryItemAdjustment,
  ClearSearchInventoryItemPSV,
  LoadProductGroups,
  LoadProductCategories,
  ResetReceiptsListData,
  LoadReceiptsSTNCount,
  SearchClear,
  LoadRemarks,
  ResetPSVReceiptData,
  ResetAdjustmentReceiptData,
  ValidateNonVerifiedItem,
  ValidateVerifiedItem,
  SetFilterDataNonVerifiedProducts,
  SetFilterDataVerifiedProducts,
  SetSortDataNonVerifiedProducts,
  SetSortDataVerifiedProducts,
  AssignBinToAllItems,
  VerifyAllItems,
  VerifyItem,
  UpdateItem,
  LoadNonVerifiedItems,
  LoadVerifiedItems,
  SearchPendingReceipts,
  LoadRecieptList,
  LoadRecieptLoanList,
  LoadBinCodes,
  DropDownvalueForReceipts,
  RemoveMultipleAdjustementItems,
  AddItemsToCartPSV,
  RemovePSVItem,
  RemoveMultiplePSVItems,
  AdjustmentSearch,
  PSVSearch,
  UpdatePSVItem,
  UpdateAdjustementItem,
  ConfirmAdjustementItems,
  ConfirmPSVItems,
  LoadReceiptsADJList,
  RemoveAdjustementItem,
  ConfirmStockReceive,
  LoadItemsTotalCount,
  LoadSelectedStock,
  LoadOtherReceiptsHistory,
  ResetOtherReceiptsHistory,
  LoadSelectedHistory,
  LoadSelectedHistoryItemsTotalCountSuccess,
  LoadSelectedHistoryItems,
  ClearHistoryItems,
  LoadSelectedHistoryItemsTotalCount
} from './other-receipts.actions';
import { OtherReceiptState } from './other-receipts.state';
import { Store } from '@ngrx/store';
import { TestBed, inject } from '@angular/core/testing';
import { OtherReceiptsFacade } from './other-receipts.facade';
import {
  OtherReceiptAdapter,
  adjustmentAdaptor,
  itemAdapter
} from './other-receipts.entity';
import * as moment from 'moment';

import { provideMockStore, MockStore } from '@ngrx/store/testing';

describe('Other Receipt facade Testing Suite action', () => {
  const initialState: OtherReceiptState = {
    isLoading: false,

    pendingOtherReceiptsSTNCount: 0,
    otherReceiptList: OtherReceiptAdapter.getInitialState(),
    otherReceiptLoanList: OtherReceiptAdapter.getInitialState(),
    isLoadingOtherReceiptList: false,
    isLoadingOtherReceiptLoanList: true,
    isSearchingStocks: false,
    searchStockResults: OtherReceiptAdapter.getInitialState(),
    hasSearchStockResults: null,
    nonVerifiedItems: itemAdapter.getInitialState(),
    isNonVerifiedItemsLoading: false,
    nonVerifiedItemsTotalCount: 0,
    itemsCountNonVerified: 0,
    itemsCountVerified: 0,
    verifiedItems: itemAdapter.getInitialState(),
    isVerifiedItemsLoading: false,
    verifiedItemsTotalCount: 0,

    isItemsTotalCountLoaded: null,
    isItemsTotalCountLoading: false,

    isSearchingItems: false,
    hasSearchedItems: false,
    binCodes: null,
    remarks: null,

    selectedStock: null,
    confirmedStock: null,
    isVerifyingAllItem: false,
    isVerifyingAllItemSuccess: null,
    confirmStockReceiveErrors: null,
    selectedStockLoadError: null,
    isAssigningBinToAllItems: false,
    isAssigningBinToAllItemsSuccess: null,
    isConfirmStockReceiveSuccess: null,
    isConfirmingStockReceive: false,
    verifyItemSuccess: null,
    otherReceiptsDropdownValues: null,
    selectedDropDownForReceipts: OtherReceiptsIssuesEnum.EXHIBITION_TYPE,
    error: null,
    isItemIssued: false,
    totalElementsOtherReceipts: 0,
    isLoadingRemarks: false,
    isLoadingSelectedStock: false,
    updateItemSuccess: false,
    isLoadingBinGroups: false,
    isSearchingAdjustmentItems: false,
    hasSearchedAdjustmentItems: false,
    isLoadingAdjustment: false,
    adjustmentSearchedItems: null,
    itemsInCarts: adjustmentAdaptor.getInitialState(),
    adjustmentSearchedItemsCount: null,
    confirmAdjustementItemResponse: null,
    adjustmentItemsInCartsSearch: adjustmentAdaptor.getInitialState(),
    hasSearchItemInCartSearchAdjustment: false,
    otherReceiptADJList: OtherReceiptAdapter.getInitialState(),
    isLoadingOtherReceiptADJList: false,
    studdedProductGroups: [],
    isSearchingPSVItems: false,
    hasSearchedItemPSV: false,
    psvSearchedItems: null,
    itemsInCartsPSV: adjustmentAdaptor.getInitialState(),
    psvSearchedItemsCount: null,
    confirmPSVItemResponse: null,
    IsLoadingPSV: false,
    hasSearchItemInCartSearchPSV: false,
    psvItemsInCartsSearch: adjustmentAdaptor.getInitialState(),

    productCategories: null,
    productGroups: null,

    filterDataNonVerifiedProducts: {},
    filterDataVerifiedProducts: {},

    sortDataNonVerifiedProducts: [],
    sortDataVerifiedProducts: [],
    isNonVerifiedItemsLoaded: null,
    isVerifiedItemsLoaded: null,

    otherReceiptsHistory: OtherReceiptAdapter.getInitialState(),
    isLoadingHistory: false,
    otherReceiptsHistoryCount: 0,

    isLoadingSelectedHistory: false,
    hasSelectedHistory: false,
    selectedHistory: null,

    historyItemsCount: 0,
    historyItems: itemAdapter.getInitialState(),
    isLoadingHistoryItems: false,
    isHistoryItemsLoaded: false,

    historyItemsTotalCount: 0,
    isLoadingHistoryItemsTotalCount: false,
    isHistoryItemsTotalCountLoaded: false,
    isLoadingImage:true
  };

  let otherReceiptsFacade: OtherReceiptsFacade;

  //let store: MockStore<OtherReceiptState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), OtherReceiptsFacade]
    });

    otherReceiptsFacade = TestBed.inject(OtherReceiptsFacade);
  });

  describe('Dispatch Actions action', () => {
    const adjustmentitem: AdjustmentItem = {
      binCode: 'a',
      binGroupCode: 'a',
      destDocNo: 1,
      imageURL: '',
      itemCode: '',
      measuredQuantity: 1,
      measuredWeight: 2,
      productCategory: '',
      productCategoryId: '',
      productGroup: '',
      productGroupId: '',
      stdValue: 1,
      isStudded: false,
      thumbnailImageURL:'',
    taxDetails:{},
    isLoadingImage:true,
    isLoadingThumbnailImage: true,
    id:''
    };

    const itemValidate: OtherReceiptItemValidate = {
      availableQuantity: 1,
      availableWeight: 1,
      itemId: '',
      measuredQuantity: 1,
      measuredWeight: 1,
      productGroupCode: ''
    };

    const otherReceiptLoadItemsPayload: OtherReceiptLoadItemsPayload = {
      id: 1,
      pageIndex: 0,
      pageSize: 10,
      property: '',
      sortBy: '',
      transactionType: 'EXH'
    };

    const otherReceiptUpdateItemPayload: OtherReceiptUpdateItemPayload = {
      actualDetails: {
        binCode: '',
        binGroupCode: '',
        itemDetails: {},
        measuredWeight: 1,
        remarks: ''
      },
      id: 1,
      itemId: '',
      newUpdate: {
        binCode: '',
        binGroupCode: '',
        itemDetails: {},
        measuredWeight: 1,
        remarks: ''
      },
      transactionType: 'EXH'
    };

    const otherReceiptUpdateAllItemsPayload: OtherReceiptUpdateAllItemsPayload = {
      data: {},
      id: 1,
      transactionType: 'EXH'
    };

    const otherReceiptUpdateAdjustementItemPayload: OtherReceiptUpdateAdjustementItemPayload = {
      itemId: '',
      items: {
        binCode: '',
        binGroupCode: '',
        itemCode: '',
        quantity: 1,
        value: 1,
        measuredWeight: 1
      }
    };

    const otherReceiptSearchCartItemAdjustmentPayload: OtherReceiptSearchCartItemAdjustmentPayload = {
      searchValue: 'EXH'
    };

    const otherReceiptConfirmAdjustmentItemsPayload: OtherReceiptConfirmAdjustmentItemsPayload = {
      items: [],
      remarks: '',
      type: 'EXH'
    };

    const otherReceiptLoadListItemsPayload: OtherReceiptLoadListItemsPayload = {
      pageIndex: 0,
      pageSize: 10,
      type: 'EXH'
    };

    const otherReceiptSearchPendingPayload: OtherReceiptSearchPendingPayload = {
      srcDocnumber: 12,
      type: 'EXH'
    };

    const otherReceiptAdjustmentSearchPayload: OtherReceiptAdjustmentSearchPayload = {
      lotNumber: '',
      variantCode: ''
    };

    const confirmStockReceivePayload: ConfirmStockReceivePayload = {
      confirmReceive: { remarks: '' },
      id: 1,
      transactionType: 'EXH'
    };

    const otherReceiptStockPayLoad: OtherReceiptStockPayLoad = {
      id: '1234',
      transactionType: 'EXH'
    };
    it('should call  CLEAR_ITEMS action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const action = new ClearItems();
      otherReceiptsFacade.clearItems();
      expect(storeSpy).toHaveBeenCalledWith(action);
    }));

    it('should call ADD_ADJUSTMENT_ITEMS_TO_CART action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const payload: AdjustmentItem[] = [adjustmentitem];

        const action = new AddItemsToCart(payload);
        otherReceiptsFacade.addItemsToCart(payload);
        expect(storeSpy).toHaveBeenCalledWith(action);
      }
    ));
    it('should call CLEAR_SEARCH_CART_ITEM_ADJUSTMENT action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();

        const action = new ClearSearchCartItemAdjustment();
        otherReceiptsFacade.clearSearchCartItemAdjustment();
        expect(storeSpy).toHaveBeenCalledWith(action);
      }
    ));

    it('should call CLEAR_SEARCH_CART_ITEM_PSV action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();

        const action = new ClearSearchCartItemPSV();
        otherReceiptsFacade.clearSearchCartItemPSV();
        expect(storeSpy).toHaveBeenCalledWith(action);
      }
    ));

    it('should call CLEAR_SEARCH_INVENTORY_ADJUSTMENT action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();

        const action = new ClearSearchInventoryItemAdjustment();
        otherReceiptsFacade.clearSearchInventoryItemAdjustment();
        expect(storeSpy).toHaveBeenCalledWith(action);
      }
    ));

    it('should call CLEAR_SEARCH_INVENTORY_PSV action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();

        const action = new ClearSearchInventoryItemPSV();
        otherReceiptsFacade.clearSearchInventoryItemPSV();
        expect(storeSpy).toHaveBeenCalledWith(action);
      }
    ));

    it('should call LOAD_PRODUCT_GROUPS action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const action = new LoadProductGroups();
      otherReceiptsFacade.loadProductGroups();
      expect(storeSpy).toHaveBeenCalledWith(action);
    }));

    it('should call LOAD_STUDDED_PRODUCT_GROUPS action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const action = new LoadStuddedProductGroups();
        otherReceiptsFacade.loadStuddedProductGroups();
        expect(storeSpy).toHaveBeenCalledWith(action);
      }
    ));

    it('should call LOAD_PRODUCT_CATEGORIES action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const action = new LoadProductCategories();
      otherReceiptsFacade.loadProductCategories();
      expect(storeSpy).toHaveBeenCalledWith(action);
    }));

    it('should call loadOtherReceiptsCount action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const action = new LoadReceiptsSTNCount();
      otherReceiptsFacade.loadOtherReceiptsCount();
      expect(storeSpy).toHaveBeenCalledWith(action);
    }));

    it('should call resetOtherReceiptListData action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const action = new ResetReceiptsListData();
        otherReceiptsFacade.resetOtherReceiptListData();
        expect(storeSpy).toHaveBeenCalledWith(action);
      }
    ));

    it('should call searchClear action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const action = new SearchClear();
      otherReceiptsFacade.searchClear();
      expect(storeSpy).toHaveBeenCalledWith(action);
    }));

    it('should call loadRemarks action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const action = new LoadRemarks();
      otherReceiptsFacade.loadRemarks();
      expect(storeSpy).toHaveBeenCalledWith(action);
    }));

    it('should call resetPSVReceiptData action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const action = new ResetPSVReceiptData();
      otherReceiptsFacade.resetPSVReceiptData();
      expect(storeSpy).toHaveBeenCalledWith(action);
    }));

    it('should call resetAdjustmentReceiptData action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const action = new ResetAdjustmentReceiptData();
        otherReceiptsFacade.resetAdjustmentReceiptData();
        expect(storeSpy).toHaveBeenCalledWith(action);
      }
    ));

    it('should call validateNonVerifiedItem action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const action = new ValidateNonVerifiedItem(itemValidate);
      otherReceiptsFacade.validateNonVerifiedItem(itemValidate);
      expect(storeSpy).toHaveBeenCalledWith(action);
    }));

    it('should call validateVerifiedItem action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const action = new ValidateVerifiedItem(itemValidate);
      otherReceiptsFacade.validateVerifiedItem(itemValidate);
      expect(storeSpy).toHaveBeenCalledWith(action);
    }));

    it('should call setOtherReciptNonVerifiedFilter action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const action = new SetFilterDataNonVerifiedProducts({});
        otherReceiptsFacade.setOtherReciptNonVerifiedFilter({});
        expect(storeSpy).toHaveBeenCalledWith(action);
      }
    ));

    it('should call setOtherReciptVerifiedFilter action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const action = new SetFilterDataVerifiedProducts({});
        otherReceiptsFacade.setOtherReciptVerifiedFilter({});
        expect(storeSpy).toHaveBeenCalledWith(action);
      }
    ));
    it('should call setOtherReceiptNonVerifiedProductsSort action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const action = new SetSortDataNonVerifiedProducts([]);
        otherReceiptsFacade.setOtherReceiptNonVerifiedProductsSort([]);
        expect(storeSpy).toHaveBeenCalledWith(action);
      }
    ));
    it('should call setOtherReceiptVerifiedProductsSort action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const action = new SetSortDataVerifiedProducts([]);
        otherReceiptsFacade.setOtherReceiptVerifiedProductsSort([]);
        expect(storeSpy).toHaveBeenCalledWith(action);
      }
    ));

    it('should call assignBinToAllItems action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const action = new AssignBinToAllItems(otherReceiptUpdateAllItemsPayload);
      otherReceiptsFacade.assignBinToAllItems(
        otherReceiptUpdateAllItemsPayload
      );
      expect(storeSpy).toHaveBeenCalledWith(action);
    }));

    it('should call verifyAllItems action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const action = new VerifyAllItems(otherReceiptUpdateAllItemsPayload);
      otherReceiptsFacade.verifyAllItems(otherReceiptUpdateAllItemsPayload);
      expect(storeSpy).toHaveBeenCalledWith(action);
    }));

    it('should call verifyItem action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const action = new VerifyItem(otherReceiptUpdateItemPayload);
      otherReceiptsFacade.verifyItem(otherReceiptUpdateItemPayload);
      expect(storeSpy).toHaveBeenCalledWith(action);
    }));
    it('should call updateItem action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const action = new UpdateItem(otherReceiptUpdateItemPayload);
      otherReceiptsFacade.updateItem(otherReceiptUpdateItemPayload);
      expect(storeSpy).toHaveBeenCalledWith(action);
    }));
    it('should call loadVerifiedItems action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const action = new LoadVerifiedItems(otherReceiptLoadItemsPayload);
      otherReceiptsFacade.loadVerifiedItems(otherReceiptLoadItemsPayload);
      expect(storeSpy).toHaveBeenCalledWith(action);
    }));
    it('should call loadNonVerifiedItems action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const action = new LoadNonVerifiedItems(otherReceiptLoadItemsPayload);
      otherReceiptsFacade.loadNonVerifiedItems(otherReceiptLoadItemsPayload);
      expect(storeSpy).toHaveBeenCalledWith(action);
    }));

    it('should call searchPendingReceiptsStocks action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const action = new SearchPendingReceipts(
          otherReceiptSearchPendingPayload
        );
        otherReceiptsFacade.searchPendingReceiptsStocks(
          otherReceiptSearchPendingPayload
        );
        expect(storeSpy).toHaveBeenCalledWith(action);
      }
    ));
    it('should call loadReceiptList action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const action = new LoadRecieptList(otherReceiptLoadListItemsPayload);
      otherReceiptsFacade.loadReceiptList(otherReceiptLoadListItemsPayload);
      expect(storeSpy).toHaveBeenCalledWith(action);
    }));
    it('should call loadReceiptLoanList action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const action = new LoadRecieptLoanList(otherReceiptLoadListItemsPayload);
      otherReceiptsFacade.loadReceiptLoanList(otherReceiptLoadListItemsPayload);
      expect(storeSpy).toHaveBeenCalledWith(action);
    }));
    it('should call loadReceiptList action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const action = new LoadRecieptList(otherReceiptLoadListItemsPayload);
      otherReceiptsFacade.loadReceiptList(otherReceiptLoadListItemsPayload);
      expect(storeSpy).toHaveBeenCalledWith(action);
    }));
    it('should call loadBinCodes action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const action = new LoadBinCodes('');
      otherReceiptsFacade.loadBinCodes('');
      expect(storeSpy).toHaveBeenCalledWith(action);
    }));
    it('should call setSelectedDropDownForReceipts action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const action = new DropDownvalueForReceipts('');
        otherReceiptsFacade.setSelectedDropDownForReceipts('');
        expect(storeSpy).toHaveBeenCalledWith(action);
      }
    ));
    it('should call removeMultipleAdjustementItems action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const action = new RemoveMultipleAdjustementItems([]);
        otherReceiptsFacade.removeMultipleAdjustementItems([]);
        expect(storeSpy).toHaveBeenCalledWith(action);
      }
    ));

    it('should call addItemsToCartPSV action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const action = new AddItemsToCartPSV([adjustmentitem]);
      otherReceiptsFacade.addItemsToCartPSV([adjustmentitem]);
      expect(storeSpy).toHaveBeenCalledWith(action);
    }));

    it('should call removePSVItem action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const action = new RemovePSVItem(adjustmentitem);
      otherReceiptsFacade.removePSVItem(adjustmentitem);
      expect(storeSpy).toHaveBeenCalledWith(action);
    }));

    it('should call removeMultiplePSVItems action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const action = new RemoveMultiplePSVItems([]);
      otherReceiptsFacade.removeMultiplePSVItems([]);
      expect(storeSpy).toHaveBeenCalledWith(action);
    }));

    it('should call adjustmentItemSearch action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const action = new AdjustmentSearch(otherReceiptAdjustmentSearchPayload);
      otherReceiptsFacade.adjustmentItemSearch(
        otherReceiptAdjustmentSearchPayload
      );
      expect(storeSpy).toHaveBeenCalledWith(action);
    }));

    it('should call psvItemSearch action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const action = new PSVSearch(otherReceiptAdjustmentSearchPayload);
      otherReceiptsFacade.psvItemSearch(otherReceiptAdjustmentSearchPayload);
      expect(storeSpy).toHaveBeenCalledWith(action);
    }));

    it('should call updateAdjustementItem action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const action = new UpdateAdjustementItem(
        otherReceiptUpdateAdjustementItemPayload
      );
      otherReceiptsFacade.updateAdjustementItem(
        otherReceiptUpdateAdjustementItemPayload
      );
      expect(storeSpy).toHaveBeenCalledWith(action);
    }));

    it('should call updatePSVItem action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const action = new UpdatePSVItem(
        otherReceiptUpdateAdjustementItemPayload
      );
      otherReceiptsFacade.updatePSVItem(
        otherReceiptUpdateAdjustementItemPayload
      );
      expect(storeSpy).toHaveBeenCalledWith(action);
    }));

    it('should call SearchAdjustmentCartItems action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const action = new SearchCartItemsAdjustment(
          otherReceiptSearchCartItemAdjustmentPayload
        );
        otherReceiptsFacade.SearchAdjustmentCartItems(
          otherReceiptSearchCartItemAdjustmentPayload
        );
        expect(storeSpy).toHaveBeenCalledWith(action);
      }
    ));
    it('should call SearchPSVCartItems action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const action = new SearchCartItemsPSV(
        otherReceiptSearchCartItemAdjustmentPayload
      );
      otherReceiptsFacade.SearchPSVCartItems(
        otherReceiptSearchCartItemAdjustmentPayload
      );
      expect(storeSpy).toHaveBeenCalledWith(action);
    }));

    it('should call confirmAdjustementItems action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const action = new ConfirmAdjustementItems(
        otherReceiptConfirmAdjustmentItemsPayload
      );
      otherReceiptsFacade.confirmAdjustementItems(
        otherReceiptConfirmAdjustmentItemsPayload
      );
      expect(storeSpy).toHaveBeenCalledWith(action);
    }));
    it('should call confirmPSVItems action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const action = new ConfirmPSVItems(
        otherReceiptConfirmAdjustmentItemsPayload
      );
      otherReceiptsFacade.confirmPSVItems(
        otherReceiptConfirmAdjustmentItemsPayload
      );
      expect(storeSpy).toHaveBeenCalledWith(action);
    }));

    it('should call loadReceiptADJList action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const action = new LoadReceiptsADJList(otherReceiptLoadListItemsPayload);
      otherReceiptsFacade.loadReceiptADJList(otherReceiptLoadListItemsPayload);
      expect(storeSpy).toHaveBeenCalledWith(action);
    }));

    it('should call removeAdjustementItem action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const action = new RemoveAdjustementItem(adjustmentitem);
      otherReceiptsFacade.removeAdjustementItem(adjustmentitem);
      expect(storeSpy).toHaveBeenCalledWith(action);
    }));

    it('should call confirmStock action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const action = new ConfirmStockReceive(confirmStockReceivePayload);
      otherReceiptsFacade.confirmStock(confirmStockReceivePayload);
      expect(storeSpy).toHaveBeenCalledWith(action);
    }));

    it('should call loadItemsTotalCount action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const action = new LoadItemsTotalCount({ id: 1, transactionType: 'EXH' });
      otherReceiptsFacade.loadItemsTotalCount({
        id: 1,
        transactionType: 'EXH'
      });
      expect(storeSpy).toHaveBeenCalledWith(action);
    }));

    it('should call loadSelectedStock action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const action = new LoadSelectedStock(otherReceiptStockPayLoad);
      otherReceiptsFacade.loadSelectedStock(otherReceiptStockPayLoad);
      expect(storeSpy).toHaveBeenCalledWith(action);
    }));
  });

  describe('Access Selector action', () => {
    it('should get getAdjustmentItemsSearchCount data', () => {
      expect(otherReceiptsFacade.getAdjustmentItemsSearchCount()).toBeTruthy();
    });
    it('should get getHasError data', () => {
      expect(otherReceiptsFacade.getHasError()).toBeTruthy();
    });

    it('should get getIsLoading data', () => {
      expect(otherReceiptsFacade.getIsLoading()).toBeTruthy();
    });

    it('should get getAdjustmentSearchedItems data', () => {
      expect(otherReceiptsFacade.getAdjustmentSearchedItems()).toBeTruthy();
    });

    it('should get getBinCodes data', () => {
      expect(otherReceiptsFacade.getBinCodes()).toBeTruthy();
    });

    it('should get getCartItemIds data', () => {
      expect(otherReceiptsFacade.getCartItemIds()).toBeTruthy();
    });

    it('should get getConfirmAdjustementItemsResponse data', () => {
      expect(
        otherReceiptsFacade.getConfirmAdjustementItemsResponse()
      ).toBeTruthy();
    });

    it('should get getConfirmPSVItemsResponse data', () => {
      expect(otherReceiptsFacade.getConfirmPSVItemsResponse()).toBeTruthy();
    });

    it('should get getConfirmStockReceiveErrors data', () => {
      expect(otherReceiptsFacade.getConfirmStockReceiveErrors()).toBeTruthy();
    });

    it('should get getConfirmedStock data', () => {
      expect(otherReceiptsFacade.getConfirmedStock()).toBeTruthy();
    });

    it('should get getHasSearchItemInCartSearchAdjustment data', () => {
      expect(
        otherReceiptsFacade.getHasSearchItemInCartSearchAdjustment()
      ).toBeTruthy();
    });

    it('should get getHasSearchItemInCartSearchPSV data', () => {
      expect(
        otherReceiptsFacade.getHasSearchItemInCartSearchPSV()
      ).toBeTruthy();
    });

    it('should get getIsSearchingStocks data', () => {
      expect(otherReceiptsFacade.getIsSearchingStocks()).toBeTruthy();
    });

    it('should get getHasSearchStockResults data', () => {
      expect(otherReceiptsFacade.getHasSearchStockResults()).toBeTruthy();
    });

    it('should get getHasSearchedItems data', () => {
      expect(otherReceiptsFacade.getHasSearchedItems()).toBeTruthy();
    });

    it('should get getIsVerifyingAllItemSuccess data', () => {
      expect(otherReceiptsFacade.getIsVerifyingAllItemSuccess()).toBeTruthy();
    });

    it('should get getIsSearchingAdjustment data', () => {
      expect(otherReceiptsFacade.getIsSearchingAdjustment()).toBeTruthy();
    });

    it('should get gethasSearchedItemAdjustment data', () => {
      expect(otherReceiptsFacade.gethasSearchedItemAdjustment()).toBeTruthy();
    });

    it('should get getIsLoadingAdjustment data', () => {
      expect(otherReceiptsFacade.getIsLoadingAdjustment()).toBeTruthy();
    });

    it('should get getError data', () => {
      expect(otherReceiptsFacade.getError()).toBeTruthy();
    });
    it('should get getIsSearchingPSV data', () => {
      expect(otherReceiptsFacade.getIsSearchingPSV()).toBeTruthy();
    });
    it('should get gethasSearchedItemPSV data', () => {
      expect(otherReceiptsFacade.gethasSearchedItemPSV()).toBeTruthy();
    });
    it('should get getIsLoadingPSV data', () => {
      expect(otherReceiptsFacade.getIsLoadingPSV()).toBeTruthy();
    });
    it('should get getError data', () => {
      expect(otherReceiptsFacade.getError()).toBeTruthy();
    });
    it('should get getHasSearchItemInCartSearchPSV data', () => {
      expect(
        otherReceiptsFacade.getHasSearchItemInCartSearchPSV()
      ).toBeTruthy();
    });
  });

  it('should get getProductCategories data', () => {
    expect(otherReceiptsFacade.getProductCategories()).toBeTruthy();
  });
  it('should get getProductGroups data', () => {
    expect(otherReceiptsFacade.getProductGroups()).toBeTruthy();
  });

  ////

  it('should get getOtherReceiptsSTNCount data', () => {
    expect(otherReceiptsFacade.getOtherReceiptsSTNCount()).toBeTruthy();
  });
  it('should get getOtherReceiptList data', () => {
    expect(otherReceiptsFacade.getOtherReceiptList()).toBeTruthy();
  });

  it('should get getOtherReceiptLoanList data', () => {
    expect(otherReceiptsFacade.getOtherReceiptLoanList()).toBeTruthy();
  });

  it('should get getIsLoadingOtherReceiptSTN data', () => {
    expect(otherReceiptsFacade.getIsLoadingOtherReceiptSTN()).toBeTruthy();
  });

  it('should get getSearchStockResults data', () => {
    expect(otherReceiptsFacade.getSearchStockResults()).toBeTruthy();
  });

  it('should get getVerifiedItems data', () => {
    expect(otherReceiptsFacade.getVerifiedItems()).toBeTruthy();
  });

  it('should get getIsNonVerifiedItemsLoading data', () => {
    expect(otherReceiptsFacade.getIsNonVerifiedItemsLoading()).toBeTruthy();
  });

  it('should get getIsVerifiedItemsLoading data', () => {
    expect(otherReceiptsFacade.getIsVerifiedItemsLoading()).toBeTruthy();
  });

  it('should get getItemsTotalCountLoaded data', () => {
    expect(otherReceiptsFacade.getItemsTotalCountLoaded()).toBeTruthy();
  });

  it('should get getIsItemsTotalCountLoading data', () => {
    expect(otherReceiptsFacade.getIsItemsTotalCountLoading()).toBeTruthy();
  });

  it('should get getIsSearchingItems data', () => {
    expect(otherReceiptsFacade.getIsSearchingItems()).toBeTruthy();
  });

  it('should get getRemarks data', () => {
    expect(otherReceiptsFacade.getRemarks()).toBeTruthy();
  });

  it('should get getSelectedStock data', () => {
    expect(otherReceiptsFacade.getSelectedStock()).toBeTruthy();
  });

  it('should get getNonVerifiedItemsTotalCount data', () => {
    expect(otherReceiptsFacade.getNonVerifiedItemsTotalCount()).toBeTruthy();
  });

  it('should get getVerifiedItemsTotalCount data', () => {
    expect(otherReceiptsFacade.getVerifiedItemsTotalCount()).toBeTruthy();
  });

  it('should get getIsAssigningBinToAllItemsSuccess data', () => {
    expect(
      otherReceiptsFacade.getIsAssigningBinToAllItemsSuccess()
    ).toBeTruthy();
  });

  it('should get getselectedStockLoadError data', () => {
    expect(otherReceiptsFacade.getselectedStockLoadError()).toBeTruthy();
  });

  it('should get getIsAssigningBinToAllItems data', () => {
    expect(otherReceiptsFacade.getIsAssigningBinToAllItems()).toBeTruthy();
  });

  it('should get getOtherReceiptsDropdown data', () => {
    expect(otherReceiptsFacade.getOtherReceiptsDropdown()).toBeTruthy();
  });

  it('should get getSelectedDropDownvalue data', () => {
    expect(otherReceiptsFacade.getSelectedDropDownvalue()).toBeTruthy();
  });
  it('should get getTotalReceiptsElementCount data', () => {
    expect(otherReceiptsFacade.getTotalReceiptsElementCount()).toBeTruthy();
  });
  it('should get getIsLoadingRemarks data', () => {
    expect(otherReceiptsFacade.getIsLoadingRemarks()).toBeTruthy();
  });
  it('should get getIsLoadingBinGroups data', () => {
    expect(otherReceiptsFacade.getIsLoadingBinGroups()).toBeTruthy();
  });
  it('should get getIsLoadingSelectedStock data', () => {
    expect(otherReceiptsFacade.getIsLoadingSelectedStock()).toBeTruthy();
  });
  it('should get getUpdateItemSuccess data', () => {
    expect(otherReceiptsFacade.getUpdateItemSuccess()).toBeTruthy();
  });

  it('should get getItemsInCart data', () => {
    expect(otherReceiptsFacade.getItemsInCart()).toBeTruthy();
  });
  it('should get getReceiptADJList data', () => {
    expect(otherReceiptsFacade.getReceiptADJList()).toBeTruthy();
  });

  it('should get getPSVSearchedItems data', () => {
    expect(otherReceiptsFacade.getPSVSearchedItems()).toBeTruthy();
  });
  it('should get getItemsInCartPSV data', () => {
    expect(otherReceiptsFacade.getItemsInCartPSV()).toBeTruthy();
  });

  it('should get getPSVItemsSearchCount data', () => {
    expect(otherReceiptsFacade.getPSVItemsSearchCount()).toBeTruthy();
  });
  it('should get getfilterDataVerifiedProducts data', () => {
    expect(otherReceiptsFacade.getfilterDataVerifiedProducts()).toBeTruthy();
  });

  it('should get getSortDataNonVerifiedProducts data', () => {
    expect(otherReceiptsFacade.getSortDataNonVerifiedProducts()).toBeTruthy();
  });
  it('should get getSortDataVerifiedProducts data', () => {
    expect(otherReceiptsFacade.getSortDataVerifiedProducts()).toBeTruthy();
  });

  it('should get getItemsCountNonVerified data', () => {
    expect(otherReceiptsFacade.getItemsCountNonVerified()).toBeTruthy();
  });
  it('should get getItemsCountVerified data', () => {
    expect(otherReceiptsFacade.getItemsCountVerified()).toBeTruthy();
  });

  it('should get getIsNonVerifiedItemsLoaded data', () => {
    expect(otherReceiptsFacade.getIsNonVerifiedItemsLoaded()).toBeTruthy();
  });
  it('should get getIsVerifiedItemsLoaded data', () => {
    expect(otherReceiptsFacade.getIsVerifiedItemsLoaded()).toBeTruthy();
  });

  it('should get getVerifyItemSuccess data', () => {
    expect(otherReceiptsFacade.getVerifyItemSuccess()).toBeTruthy();
  });
  it('should get getItemsCountVerified data', () => {
    expect(otherReceiptsFacade.getItemsCountVerified()).toBeTruthy();
  });

  it('should get getNonVerifiedItems data', () => {
    expect(otherReceiptsFacade.getNonVerifiedItems()).toBeTruthy();
  });

  it('should get getfilterDataNonVerifiedProducts data', () => {
    expect(otherReceiptsFacade.getfilterDataNonVerifiedProducts()).toBeTruthy();
  });

  describe('getOtherReceiptsHistory access Selector', () => {
    it('should return getOtherReceiptsHistory data', () => {
      expect(otherReceiptsFacade.getOtherReceiptsHistory()).toBeTruthy();
    });
  });
  describe('getIsLoadingReceiptsHistory access Selector', () => {
    it('should return getIsLoadingReceiptsHistory data', () => {
      expect(otherReceiptsFacade.getIsLoadingReceiptsHistory()).toBeTruthy();
    });
  });
  describe('getHasSelectedHistory access Selector', () => {
    it('should return getHasSelectedHistory data', () => {
      expect(otherReceiptsFacade.getHasSelectedHistory()).toBeTruthy();
    });
  });
  describe('getSelectedHistory access Selector', () => {
    it('should return getSelectedHistory data', () => {
      expect(otherReceiptsFacade.getSelectedHistory()).toBeTruthy();
    });
  });
  describe('getHistoryItemsCount access Selector', () => {
    it('should return getHistoryItemsCount data', () => {
      expect(otherReceiptsFacade.getHistoryItemsCount()).toBeTruthy();
    });
  });
  describe('getHistoryItems access Selector', () => {
    it('should return getHistoryItems data', () => {
      expect(otherReceiptsFacade.getHistoryItems()).toBeTruthy();
    });
  });
  describe('getHistoryItemsCount access Selector', () => {
    it('should return getHistoryItemsCount data', () => {
      expect(otherReceiptsFacade.getHistoryItemsCount()).toBeTruthy();
    });
  });
  describe('getHistoryItems access Selector', () => {
    it('should return getHistoryItems data', () => {
      expect(otherReceiptsFacade.getHistoryItems()).toBeTruthy();
    });
  });
  describe('getIsLoadingHistoryItems access Selector', () => {
    it('should return getIsLoadingHistoryItems data', () => {
      expect(otherReceiptsFacade.getIsLoadingHistoryItems()).toBeTruthy();
    });
  });
  describe('getIsHistoryItemsLoaded access Selector', () => {
    it('should return getIsHistoryItemsLoaded data', () => {
      expect(otherReceiptsFacade.getIsHistoryItemsLoaded()).toBeTruthy();
    });
  });
  describe('getHistoryItemsTotalCount access Selector', () => {
    it('should return getHistoryItemsTotalCount data', () => {
      expect(otherReceiptsFacade.getHistoryItemsTotalCount()).toBeTruthy();
    });
  });
  describe('getIsLoadingHistoryItemsTotalCount access Selector', () => {
    it('should return getIsLoadingHistoryItemsTotalCount data', () => {
      expect(
        otherReceiptsFacade.getIsLoadingHistoryItemsTotalCount()
      ).toBeTruthy();
    });
  });
  describe('getIsHistoryItemsTotalCountLoaded access Selector', () => {
    it('should return getIsHistoryItemsTotalCountLoaded data', () => {
      expect(
        otherReceiptsFacade.getIsHistoryItemsTotalCountLoaded()
      ).toBeTruthy();
    });
  });
  describe('Dispatch loadOtherReceiptsHistory Action', () => {
    it('should call loadOtherReceiptsHistory action', inject([Store], store => {
      const payload: LoadOtherReceiptsHistoryPayload = {
        page: 0,
        size: 8,
        sort: '',
        payload: {
          actionType: 'RECEIVE',
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
        transactionType: 'ADJ'
      };
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const action = new LoadOtherReceiptsHistory(payload);
      otherReceiptsFacade.loadOtherReceiptsHistory(payload);
      expect(storeSpy).toHaveBeenCalledWith(action);
    }));
  });
  describe('Dispatch resetOtherReceiptHistory Action', () => {
    it('should call resetOtherReceiptHistory action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const action = new ResetOtherReceiptsHistory();
      otherReceiptsFacade.resetOtherReceiptHistory();
      expect(storeSpy).toHaveBeenCalledWith(action);
    }));
  });
  describe('Dispatch loadSelectedHistory Action', () => {
    it('should call loadSelectedHistory action', inject([Store], store => {
      const payload: { id: number; transactionType: string } = {
        id: 1,
        transactionType: 'ADJ'
      };
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const action = new LoadSelectedHistory(payload);
      otherReceiptsFacade.loadSelectedHistory(1, 'ADJ');
      expect(storeSpy).toHaveBeenCalledWith(action);
    }));
  });
  describe('Dispatch loadSelectedHistoryItems Action', () => {
    it('should call loadSelectedHistoryItems action', inject([Store], store => {
      const payload: LoadOtherReceiptsHistoryItemsPayload = {
        id: 111,
        page: 0,
        size: 8,
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
      const action = new LoadSelectedHistoryItems(payload);
      otherReceiptsFacade.loadSelectedHistoryItems(payload);
      expect(storeSpy).toHaveBeenCalledWith(action);
    }));
  });
  describe('Dispatch clearHistoryItems Action', () => {
    it('should call clearHistoryItems action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const action = new ClearHistoryItems();
      otherReceiptsFacade.clearHistoryItems();
      expect(storeSpy).toHaveBeenCalledWith(action);
    }));
  });
  describe('Dispatch loadSelectedHistoryItemsTotalCount Action', () => {
    it('should call loadSelectedHistoryItemsTotalCount action', inject(
      [Store],
      store => {
        const payload: LoadOtherReceiptsHistoryItemsPayload = {
          id: 111,
          page: 0,
          size: 8,
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
        const action = new LoadSelectedHistoryItemsTotalCount(payload);
        otherReceiptsFacade.loadSelectedHistoryItemsTotalCount(payload);
        expect(storeSpy).toHaveBeenCalledWith(action);
      }
    ));
  });
});
