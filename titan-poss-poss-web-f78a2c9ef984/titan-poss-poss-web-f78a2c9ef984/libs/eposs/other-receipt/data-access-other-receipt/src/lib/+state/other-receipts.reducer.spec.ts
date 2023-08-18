import {
  AdjustmentSearchItemPayload,
  AdjustmentSearchItemPayloadSuccess,
  ConfirmOtherStockIssueResponse,
  CourierDetailsOtherIssue,
  CustomErrors,
  LoadOtherIssueCreateItemsTotalCountSuccessPayload,
  LoadOtherIssuesSTNCountPayload,
  OtherDetails,
  OtherIssuedataModel,
  OtherIssueModel,
  OtherIssuesCreateStockResponse,
  OtherIssuesHistoryItem,
  OtherIssuesItem,
  ProductCategory,
  ProductGroup,
  PSVSearchItemPayload,
  PSVSearchItemPayloadSuccess,
  RequestOtherIssueStockTransferNote,
  SearchCartItemPSVPayload,
  LoadOtherReceiptsSTNCountPayload,
  AdjustmentItem,
  OtherReceiptStockPayLoad,
  OtherReceiptAdjustmentSearchPayload,
  OtherReceiptSearchPendingPayload,
  OtherReceiptLoadListItemsPayload,
  OtherReceiptConfirmAdjustmentItemsPayload,
  OtherReceiptSearchCartItemAdjustmentPayload,
  OtherReceiptUpdateAdjustementItemPayload,
  OtherReceiptUpdateAllItemsPayload,
  OtherReceiptUpdateItemPayload,
  OtherReceiptLoadItemsPayload,
  OtherReceiptItemValidate,
  OtherReceiptsDataModel,
  OtherReceiptsModel,
  OtherReceiptLoadItemsTotalCountSuccessPayload,
  OtherReceiptLoadItemsTotalCountPayload,
  OtherReceiptItem,
  OtherReceiptUpdateItemFailurePayload,
  OtherReceiptItemUpdate,
  ConfirmOtherReceivePayload,
  Lov,
  ItemSummary,
  LoadOtherReceiptsHistoryPayload,
  LoadOtherReceiptsHistoryItemsPayload
} from '@poss-web/shared/models';
import * as moment from 'moment';
import {
  LoadProductGroups,
  LoadProductGroupsSuccess,
  LoadProductGroupsFailure,
  LoadProductCategories,
  LoadProductCategoriesSuccess,
  LoadProductCategoriesFailure,
  SearchCartItemsAdjustment,
  ClearSearchCartItemAdjustment,
  AddItemsToCart,
  ClearSearchInventoryItemAdjustment,
  ClearSearchInventoryItemPSV,
  SearchCartItemsPSV,
  ClearSearchCartItemPSV,
  ClearItems,
  LoadStuddedProductGroupsSuccess,
  LoadStuddedProductGroupsFailure,
  LoadReceiptsSTNCount,
  LoadReceiptsSTNCountSuccess,
  LoadReceiptsSTNCountFailure,
  LoadRecieptList,
  LoadRecieptListSuccess,
  LoadRecieptListFailure,
  SearchPendingReceipts,
  SearchPendingReceiptsSuccess,
  SearchPendingReceiptsFailure,
  SearchClear,
  LoadItemsTotalCount,
  LoadItemsTotalCountSuccess,
  LoadItemsTotalCountFailure,
  LoadSelectedStock,
  LoadSelectedStockSuccess,
  LoadSelectedStockFailure,
  LoadNonVerifiedItems,
  LoadNonVerifiedItemsSuccess,
  LoadNonVerifiedItemsFailure,
  LoadVerifiedItems,
  LoadVerifiedItemsSuccess,
  LoadVerifiedItemsFailure,
  LoadBinCodes,
  LoadBinCodesSuccess,
  LoadBinCodesFailure,
  VerifyItem,
  VerifyItemSuccess,
  VerifyItemFailure,
  UpdateItem,
  UpdateItemSuccess,
  UpdateItemFailure,
  ConfirmStockReceive,
  ConfirmStockReceiveSuccess,
  ConfirmStockReceiveFailure,
  LoadRemarks,
  LoadRemarksSuccess,
  LoadRemarksFailure,
  VerifyAllItems,
  VerifyAllItemsSuccess,
  VerifyAllItemsFailure,
  AssignBinToAllItems,
  AssignBinToAllItemsSuccess,
  AssignBinToAllItemsFailure,
  LoadRecieptLoanList,
  LoadRecieptLoanListSuccess,
  LoadRecieptLoanListFailure,
  DropDownvalueForReceipts,
  AdjustmentSearch,
  AdjustmentSearchSuccess,
  AdjustmentSearchFailure,
  ConfirmAdjustementItems,
  ConfirmAdjustementItemsSuccess,
  ConfirmAdjustementItemsFailure,
  RemoveAdjustementItem,
  UpdateAdjustementItem,
  RemoveMultipleAdjustementItems,
  LoadReceiptsADJList,
  LoadReceiptsADJListSuccess,
  LoadReceiptsADJListFailure,
  PSVSearch,
  PSVSearchSuccess,
  PSVSearchFailure,
  AddItemsToCartPSV,
  ConfirmPSVItems,
  ConfirmPSVItemsSuccess,
  ConfirmPSVItemsFailure,
  RemovePSVItem,
  UpdatePSVItem,
  RemoveMultiplePSVItems,
  ResetAdjustmentReceiptData,
  ResetPSVReceiptData,
  ResetReceiptsListData,
  SetFilterDataNonVerifiedProducts,
  SetFilterDataVerifiedProducts,
  SetSortDataNonVerifiedProducts,
  SetSortDataVerifiedProducts,
  ValidateNonVerifiedItem,
  ValidateNonVerifiedItemSuccess,
  ValidateNonVerifiedItemFailure,
  ValidateVerifiedItem,
  ValidateVerifiedItemSuccess,
  ValidateVerifiedItemFailure,
  LoadOtherReceiptsHistory,
  LoadOtherReceiptsHistorySuccess,
  LoadOtherReceiptsHistoryFailure,
  ResetOtherReceiptsHistory,
  LoadSelectedHistoryItemsTotalCountFailure,
  LoadSelectedHistorySuccess,
  LoadSelectedHistory,
  LoadSelectedHistoryFailure,
  LoadSelectedHistoryItems,
  LoadSelectedHistoryItemsSuccess,
  LoadSelectedHistoryItemsFailure,
  ClearHistoryItems,
  LoadSelectedHistoryItemsTotalCount,
  LoadSelectedHistoryItemsTotalCountSuccess
} from './other-receipts.actions';
import { OtherReceiptState } from './other-receipts.state';
import { OtherReceiptsReducer, initialState } from './other-receipts.reducer';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';

describe('Other Receipt Reducer Testing Suite', () => {
  const receipt2: OtherReceiptsModel = {
    id: 5260,
    transactionType: 'EXH',

    locationCode: 's',
    status: 'APVL_PENDING',
    weightUnit: 'gms',
    currencyCode: 'INR',
    carrierDetails: null,

    remarks: null,
    srcDocNo: 517,
    srcFiscalYear: null,
    srcDocDate: moment(1600692426386),
    destDocNo: null,
    destDocDate: null,
    orderType: null,
    totalAvailableQuantity: 15,
    totalMeasuredQuantity: 15,
    totalAvailableValue: 7631640,
    totalMeasuredValue: 7631640,
    totalAvailableWeight: 321.9,
    totalMeasuredWeight: 321.9
  };

  const otherReceiptsDataModel: OtherReceiptsDataModel = {
    receiptsData: [receipt2],
    totalElements: 1
  };
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
  const item: ItemSummary = {
    itemCode: '',
    productCategoryCode: '',
    productCategoryDesc: '',
    productGroupCode: '',
    productGroupDesc: '',
    stdValue: 1,
    isStudded: true,
    thumbnailImageURL:'',
    taxDetails:{},
    isLoadingImage:true,
    isLoadingThumbnailImage: true,
    id:''
  };

  const otherReceiptLoadItemsPayload: OtherReceiptLoadItemsPayload = {
    id: 1,
    pageIndex: 0,
    pageSize: 10,
    property: '',
    sortBy: '',
    transactionType: 'EXH'
  };
  const otherReceiptLoadItemsTotalCountSuccessPayload: OtherReceiptLoadItemsTotalCountSuccessPayload = {
    nonVerifiedItemsTotalCount: 1,
    verifiedItemsTotalCount: 1
  };
  const otherReceiptItemUpdate: OtherReceiptItemUpdate = {
    binCode: '',
    binGroupCode: '',
    itemDetails: {},
    measuredWeight: 1,
    remarks: ''
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
  const item1: OtherReceiptItem = {
    id: 'a',
    itemCode: '111AVSW1111',
    lotNumber: '10000AB1',
    productCategory: '',
    productCategoryDesc: '',
    productGroup: '',
    productGroupDesc: '',
    binCode: '',
    binGroupCode: '',
    orderType: null,
    itemValue: 100,

    totalQuantity: 1,
    totalValue: 100,
    totalWeight: 1,
    currencyCode: 'INR',
    weightUnit: 'gms',
    mfgDate: moment(),
    status: 'ISSUED',
    imageURL: '',
    itemDetails: { actualGoldWeight: 1, otherStoneWt: 1 },

    isUpdating: false,
    isUpdatingSuccess: true,

    isValidating: true,
    isValidatingError: false,
    isValidatingSuccess: true,
    remarks: '',
    measuredWeight: 10,
    measuredValue: 1000,
    measuredQuantity: 1,
    availableQuantity: 1,
    availableValue: 1000,
    availableWeight: 10,
    stdWeight: 10,
    stdValue: 100,
    isStudded: false,
    thumbnailImageURL:'',
    taxDetails:{},
    isLoadingImage:true,
    isLoadingThumbnailImage: true,
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

  const otherReceiptStockPayLoad: OtherReceiptStockPayLoad = {
    id: '1234',
    transactionType: 'EXH'
  };

  const otherReceiptLoadItemsTotalCountPayload: OtherReceiptLoadItemsTotalCountPayload = {
    id: 1234,
    transactionType: 'EXH'
  };

  const dummysearchOtherIssueCreateItems: OtherIssuesItem[] = [
    {
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

      taxDetails:{},
    }
  ];

  const dummySearchADJ: AdjustmentSearchItemPayloadSuccess = {
    items: [
      {
        id: 1,
        itemCode: '512313CDYMAA00',
        lotNumber: '2JA005739',
        mfgDate: moment(1558895400000),
        productCategory: 'C',
        productGroup: '71',
        approvedQuantity: 1,
        isStudded: false,
        isUpdating: true,
        isUpdatingSuccess: false,
        issuedQuantity: 1,
        itemValue: 2,
        itemWeight: 3,
        measuredQuantity: 2,
        measuredValue: 1,
        measuredWeight: 1,
        orderType: '',
        productCategoryId: '',
        productGroupId: '',
        requestedQuantity: 3,
        totalQuantity: 3,
        totalValue: 12,
        totalWeight: 2,
        binCode: 'BEST DEAL',
        binGroupCode: 'STN',
        stdValue: 60103.55,
        stdWeight: 19.346,
        currencyCode: 'INR',
        weightUnit: 'gms',
        status: null,
        imageURL: '/productcatalogue/ProductImages/2313CDY.jpg',
        itemDetails: {},
        availableWeight: 19.346,
        availableValue: 60103.55,
        availableQuantity: 1,

        taxDetails:{},

      }
    ],
    count: 1
  };

  describe('LoadProductGroups Action Test Cases', () => {
    it(' LoadProductGroups to be called', () => {
      const payload = '';
      const action = new LoadProductGroups();

      const result: OtherReceiptState = OtherReceiptsReducer(
        initialState,
        action
      );
      expect(result.error).toEqual(null);
      expect(result.isLoading).toEqual(true);
    });
    it(' LoadProductGroupsSuccess to be called', () => {
      const payload: ProductGroup[] = [
        { description: '', productGroupCode: '' }
      ];
      const action = new LoadProductGroupsSuccess(payload);

      const result: OtherReceiptState = OtherReceiptsReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.productGroups).toBeTruthy();
      expect(result.error).toBeNull();
    });
    it(' LoadProductGroupsFailure to be called', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadProductGroupsFailure(payload);

      const result: OtherReceiptState = OtherReceiptsReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(false);

      expect(result.error.message).toBe('Some Error');
    });
  });

  describe('ClearItems Action Test Cases', () => {
    it('ClearItems to be called', () => {
      const action = new ClearItems();

      const result: OtherReceiptState = OtherReceiptsReducer(
        initialState,
        action
      );
      expect(result.verifiedItems.ids.length).toBe(0);
      expect(result.verifiedItems.ids.length).toBe(0);
    });
  });

  describe('LoadReceiptsSTNCount Reducer Test Cases', () => {
    it('LoadReceiptsSTNCount should be calle ', () => {
      const action = new LoadReceiptsSTNCount();

      const result: OtherReceiptState = OtherReceiptsReducer(
        initialState,
        action
      );

      expect(result.error).toBeNull();
    });

    it('LoadReceiptsSTNCountSuccess should be called ', () => {
      const payload: LoadOtherReceiptsSTNCountPayload = {
        countData: [{ count: 1, type: 'EXH' }],
        pendingOtherReceiptsSTNCount: 1
      };

      const action = new LoadReceiptsSTNCountSuccess(payload);
      const result: OtherReceiptState = OtherReceiptsReducer(
        initialState,
        action
      );
      expect(result.otherReceiptsDropdownValues).toBeTruthy();
      expect(result.pendingOtherReceiptsSTNCount).toBeTruthy();
    });
    it('LoadReceiptsSTNCountFailure should be called ', () => {
      const action = new LoadReceiptsSTNCountFailure(
        CustomErrorAdaptor.fromJson(Error('Some Error'))
      );

      const result: OtherReceiptState = OtherReceiptsReducer(
        initialState,
        action
      );
      expect(result.otherReceiptsDropdownValues).toBe(null);
      expect(result.pendingOtherReceiptsSTNCount).toBe(0);
      expect(result.error.message).toBe('Some Error');
    });
  });

  describe('SearchPendingReceipts Reducer Test Cases', () => {
    it('SearchPendingReceipts should be calle ', () => {
      const action = new SearchPendingReceipts(
        otherReceiptSearchPendingPayload
      );

      const result: OtherReceiptState = OtherReceiptsReducer(
        initialState,
        action
      );
      expect(result.isSearchingStocks).toEqual(true);
      expect(result.hasSearchStockResults).toBe(null);
      expect(result.error).toBeNull();
    });
    it('SearchPendingReceiptsSuccess should be called ', () => {
      const action = new SearchPendingReceiptsSuccess([receipt2]);
      const result: OtherReceiptState = OtherReceiptsReducer(
        initialState,
        action
      );
      expect(result.isSearchingStocks).toEqual(false);
      expect(result.hasSearchStockResults).toBe(true);
      expect(result.searchStockResults).toBeTruthy();
    });
    it('SearchPendingReceiptsFailure should be called ', () => {
      const action = new SearchPendingReceiptsFailure(
        CustomErrorAdaptor.fromJson(Error('Some Error'))
      );

      const result: OtherReceiptState = OtherReceiptsReducer(
        initialState,
        action
      );
      expect(result.isSearchingStocks).toEqual(false);
      expect(result.hasSearchStockResults).toBe(false);

      expect(result.error.message).toBe('Some Error');
    });
  });
  describe('LoadSelectedStock Reducer Test Cases', () => {
    it('LoadSelectedStock should be calle ', () => {
      const action = new LoadSelectedStock(otherReceiptStockPayLoad);

      const result: OtherReceiptState = OtherReceiptsReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);

      expect(result.error).toBeNull();
    });
    it('LoadSelectedStockSuccess should be called ', () => {
      const action = new LoadSelectedStockSuccess(receipt2);
      const result: OtherReceiptState = OtherReceiptsReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.selectedStock).toBeTruthy();
    });
    it('LoadSelectedStockFailure should be called ', () => {
      const action = new LoadSelectedStockFailure(
        CustomErrorAdaptor.fromJson(Error('Some Error'))
      );

      const result: OtherReceiptState = OtherReceiptsReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);

      expect(result.error.message).toBe('Some Error');
    });
  });

  describe('LoadProductCategories Action Test Cases', () => {
    it(' LoadProductCategories to be called', () => {
      const action = new LoadProductCategories();

      const result: OtherReceiptState = OtherReceiptsReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(true);

      expect(result.error).toBeNull();
    });
    it(' LoadProductCategoriesSuccess to be called', () => {
      const payload: ProductCategory[] = [
        { description: '', productCategoryCode: '', isActive: true }
      ];
      const action = new LoadProductCategoriesSuccess(payload);

      const result: OtherReceiptState = OtherReceiptsReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.productCategories).toBeTruthy();
      expect(result.error).toBeNull();
    });
    it(' LoadProductCategoriesFailure to be called', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadProductCategoriesFailure(payload);

      const result: OtherReceiptState = OtherReceiptsReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(false);

      expect(result.error.message).toBe('Some Error');
    });
  });

  describe('LoadNonVerifiedItems Reducer Test Cases', () => {
    it('LoadNonVerifiedItems should be calle ', () => {
      const action = new LoadNonVerifiedItems(otherReceiptLoadItemsPayload);

      const result: OtherReceiptState = OtherReceiptsReducer(
        initialState,
        action
      );
      expect(result.isNonVerifiedItemsLoading).toEqual(true);
      expect(result.isNonVerifiedItemsLoaded).toBe(null);
      expect(result.error).toBeNull();
    });
    it('LoadNonVerifiedItemsSuccess should be called ', () => {
      const action = new LoadNonVerifiedItemsSuccess({
        items: [item1],
        count: 1
      });
      const result: OtherReceiptState = OtherReceiptsReducer(
        initialState,
        action
      );
      expect(result.isNonVerifiedItemsLoading).toEqual(false);
      expect(result.isNonVerifiedItemsLoaded).toBe(true);
      expect(result.nonVerifiedItems).toBeTruthy();
    });
    it('LoadNonVerifiedItemsFailure should be called ', () => {
      const action = new LoadNonVerifiedItemsFailure(
        CustomErrorAdaptor.fromJson(Error('Some Error'))
      );

      const result: OtherReceiptState = OtherReceiptsReducer(
        initialState,
        action
      );
      expect(result.isNonVerifiedItemsLoading).toEqual(false);
      expect(result.isNonVerifiedItemsLoaded).toBe(false);

      expect(result.error.message).toBe('Some Error');
    });
  });
  describe('LoadVerifiedItems Reducer Test Cases', () => {
    it('LoadVerifiedItems should be calle ', () => {
      const action = new LoadVerifiedItems(otherReceiptLoadItemsPayload);

      const result: OtherReceiptState = OtherReceiptsReducer(
        initialState,
        action
      );
      expect(result.isVerifiedItemsLoading).toEqual(true);
      expect(result.isVerifiedItemsLoaded).toBe(null);
      expect(result.error).toBeNull();
    });
    it('LoadVerifiedItemsSuccess should be called ', () => {
      const action = new LoadVerifiedItemsSuccess({ items: [item1], count: 1 });
      const result: OtherReceiptState = OtherReceiptsReducer(
        initialState,
        action
      );
      expect(result.isVerifiedItemsLoading).toEqual(false);
      expect(result.isVerifiedItemsLoaded).toBe(true);
      expect(result.verifiedItems).toBeTruthy();
    });
    it('LoadVerifiedItemsFailure should be called ', () => {
      const action = new LoadVerifiedItemsFailure(
        CustomErrorAdaptor.fromJson(Error('Some Error'))
      );

      const result: OtherReceiptState = OtherReceiptsReducer(
        initialState,
        action
      );
      expect(result.isVerifiedItemsLoading).toEqual(false);
      expect(result.isVerifiedItemsLoaded).toBe(false);

      expect(result.error.message).toBe('Some Error');
    });
  });
  describe('LoadBinCodes Reducer Test Cases', () => {
    it('LoadBinCodes should be calle ', () => {
      const action = new LoadBinCodes('test');

      const result: OtherReceiptState = OtherReceiptsReducer(
        initialState,
        action
      );
      expect(result.isLoadingBinGroups).toEqual(true);

      expect(result.error).toBeNull();
    });
    it('LoadBinCodesSuccess should be called ', () => {
      const action = new LoadBinCodesSuccess([]);
      const result: OtherReceiptState = OtherReceiptsReducer(
        initialState,
        action
      );
      expect(result.isLoadingBinGroups).toEqual(false);
      expect(result.hasSearchStockResults).toBe(null);
      expect(result.binCodes).toBeTruthy();
    });
    it('LoadBinCodesFailure should be called ', () => {
      const action = new LoadBinCodesFailure(
        CustomErrorAdaptor.fromJson(Error('Some Error'))
      );

      const result: OtherReceiptState = OtherReceiptsReducer(
        initialState,
        action
      );
      expect(result.isLoadingBinGroups).toEqual(false);

      expect(result.error.message).toBe('Some Error');
    });
  });

  describe('VerifyItem Reducer Test Cases', () => {
    it('VerifyItem should be calle ', () => {
      const action = new VerifyItem(otherReceiptUpdateItemPayload);

      const result: OtherReceiptState = OtherReceiptsReducer(
        initialState,
        action
      );

      expect(result.verifyItemSuccess).toBe(null);
      expect(result.error).toBeNull();
    });
    it('VerifyItemSuccess should be called ', () => {
      const action = new VerifyItemSuccess(item1);
      const result: OtherReceiptState = OtherReceiptsReducer(
        initialState,
        action
      );

      expect(result.verifyItemSuccess).toBe(true);
      expect(result.verifiedItemsTotalCount).toBe(0);
    });
    it('VerifyItemFailure should be called ', () => {
      const payload: OtherReceiptUpdateItemFailurePayload = {
        actualDetails: otherReceiptItemUpdate,
        error: CustomErrorAdaptor.fromJson(Error('Some Error')),
        itemId: ''
      };

      const action = new VerifyItemFailure(payload);

      const result: OtherReceiptState = OtherReceiptsReducer(
        initialState,
        action
      );
      expect(result.nonVerifiedItems).toBeTruthy();
      expect(result.hasSearchStockResults).toBe(null);

      expect(result.error.message).toBe('Some Error');
    });
  });

  describe('LoadItemsTotalCount Reducer Test Cases', () => {
    it('LoadItemsTotalCount should be calle ', () => {
      const action = new LoadItemsTotalCount(
        otherReceiptLoadItemsTotalCountPayload
      );

      const result: OtherReceiptState = OtherReceiptsReducer(
        initialState,
        action
      );
      expect(result.isItemsTotalCountLoading).toEqual(true);
      expect(result.isItemsTotalCountLoaded).toBe(null);
      expect(result.error).toBeNull();
    });
    it('LoadItemsTotalCountSuccess should be called ', () => {
      const action = new LoadItemsTotalCountSuccess(
        otherReceiptLoadItemsTotalCountSuccessPayload
      );
      const result: OtherReceiptState = OtherReceiptsReducer(
        initialState,
        action
      );
      expect(result.isItemsTotalCountLoading).toEqual(false);
      expect(result.isItemsTotalCountLoaded).toBe(true);
      expect(result.nonVerifiedItemsTotalCount).toBeTruthy();
      expect(result.verifiedItemsTotalCount).toBeTruthy();
    });
    it('LoadItemsTotalCountFailure should be called ', () => {
      const action = new LoadItemsTotalCountFailure(
        CustomErrorAdaptor.fromJson(Error('Some Error'))
      );

      const result: OtherReceiptState = OtherReceiptsReducer(
        initialState,
        action
      );
      expect(result.isItemsTotalCountLoading).toEqual(false);
      expect(result.isItemsTotalCountLoaded).toBe(false);

      expect(result.error.message).toBe('Some Error');
    });
  });

  describe('SearchClearIssue Action Test Cases', () => {
    it(' SearchClearIssue to be called', () => {
      const action = new SearchClear();

      const result: OtherReceiptState = OtherReceiptsReducer(
        initialState,
        action
      );
      expect(result.isSearchingStocks).toBe(false);
      expect(result.searchStockResults.ids.length).toBe(0);
      expect(result.hasSearchStockResults).toBeNull();
      expect(result.error).toBeNull();
    });
  });

  describe('AddItemsToCart Action Test Cases', () => {
    it('AddItemsToCart to be called', () => {
      const payload: OtherIssuesItem[] = dummysearchOtherIssueCreateItems;
      const action = new AddItemsToCart([adjustmentitem]);

      const result: OtherReceiptState = OtherReceiptsReducer(
        initialState,
        action
      );

      expect(result.itemsInCarts).toBeTruthy();
      expect(result.error).toBeNull();
    });
  });

  describe('ClearSearchInventoryItemAdjustment Action Test Cases', () => {
    it('ClearSearchInventoryItemAdjustment to be called', () => {
      const action = new ClearSearchInventoryItemAdjustment();

      const result: OtherReceiptState = OtherReceiptsReducer(
        initialState,
        action
      );
      expect(result.hasSearchItemInCartSearchAdjustment).toBe(false);
      expect(result.adjustmentItemsInCartsSearch.ids.length).toBe(0);
    });
  });

  describe('ClearSearchInventoryItemPSV Action Test Cases', () => {
    it('ClearSearchInventoryItemPSV to be called', () => {
      const action = new ClearSearchInventoryItemPSV();

      const result: OtherReceiptState = OtherReceiptsReducer(
        initialState,
        action
      );

      expect(result.hasSearchItemInCartSearchPSV).toBe(false);
      expect(result.psvItemsInCartsSearch.ids.length).toBe(0);
    });
  });
  describe('SearchCartItemsAdjustment Action Test Cases', () => {
    it('SearchCartItemsAdjustment to be called', () => {
      const payload: SearchCartItemPSVPayload = {
        searchValue: ''
      };
      const action = new SearchCartItemsAdjustment(payload);

      const result: OtherReceiptState = OtherReceiptsReducer(
        initialState,
        action
      );
      expect(result.hasSearchItemInCartSearchAdjustment).toBe(true);
      expect(result.adjustmentItemsInCartsSearch).toBeTruthy();
      expect(result.error).toBeNull();
    });
  });

  describe('UpdatePSV Action Test Cases', () => {
    it('UpdatePSV to be called', () => {
      const action = new UpdatePSVItem(
        otherReceiptUpdateAdjustementItemPayload
      );

      const result: OtherReceiptState = OtherReceiptsReducer(
        initialState,
        action
      );

      expect(result.itemsInCartsPSV).toBeTruthy();
      expect(result.error).toBeNull();
    });
  });

  describe('UpdateAdjustementItem Action Test Cases', () => {
    it('UpdateAdjustementItem to be called', () => {
      const action = new UpdateAdjustementItem(
        otherReceiptUpdateAdjustementItemPayload
      );

      const result: OtherReceiptState = OtherReceiptsReducer(
        initialState,
        action
      );

      expect(result.itemsInCarts).toBeTruthy();
      expect(result.error).toBeNull();
    });
  });
  describe('UpdateItem Reducer Test Cases', () => {
    it('UpdateItem should be calle ', () => {
      const action = new UpdateItem(otherReceiptUpdateItemPayload);

      const result: OtherReceiptState = OtherReceiptsReducer(
        initialState,
        action
      );
      expect(result.verifiedItems).toBeTruthy();

      expect(result.error).toBeNull();
    });
    it('UpdateItemSuccess should be called ', () => {
      const action = new UpdateItemSuccess(item1);
      const result: OtherReceiptState = OtherReceiptsReducer(
        initialState,
        action
      );

      expect(result.verifiedItems).toBeTruthy();
    });
    it('UpdateItemFailure should be called ', () => {
      const payload: OtherReceiptUpdateItemFailurePayload = {
        actualDetails: otherReceiptItemUpdate,
        error: CustomErrorAdaptor.fromJson(Error('Some Error')),
        itemId: ''
      };
      const action = new UpdateItemFailure(payload);

      const result: OtherReceiptState = OtherReceiptsReducer(
        initialState,
        action
      );
      expect(result.verifiedItems).toBeTruthy();

      expect(result.error.message).toBe('Some Error');
    });
  });

  describe('ConfirmStockReceive Reducer Test Cases', () => {
    it('ConfirmStockReceive should be calle ', () => {
      const payload: ConfirmOtherReceivePayload = {
        confirmReceive: { remarks: '' },
        id: 1,
        transactionType: 'EXH'
      };
      const action = new ConfirmStockReceive(payload);

      const result: OtherReceiptState = OtherReceiptsReducer(
        initialState,
        action
      );
      expect(result.isConfirmingStockReceive).toEqual(true);
      expect(result.confirmedStock).toBe(null);
      expect(result.error).toBeNull();
    });
    it('ConfirmStockReceiveSuccess should be called ', () => {
      const action = new ConfirmStockReceiveSuccess(otherReceiptsDataModel);
      const result: OtherReceiptState = OtherReceiptsReducer(
        initialState,
        action
      );
      expect(result.isConfirmingStockReceive).toEqual(false);
      expect(result.isConfirmStockReceiveSuccess).toBe(true);
      expect(result.confirmedStock).toBeTruthy();
    });
    it('ConfirmStockReceiveFailure should be called ', () => {
      const action = new ConfirmStockReceiveFailure(
        CustomErrorAdaptor.fromJson(Error('Some Error'))
      );

      const result: OtherReceiptState = OtherReceiptsReducer(
        initialState,
        action
      );
      expect(result.isConfirmStockReceiveSuccess).toEqual(false);
      expect(result.isConfirmingStockReceive).toBe(false);

      expect(result.error.message).toBe('Some Error');
    });
  });
  describe('LoadRemarks Reducer Test Cases', () => {
    it('LoadRemarks should be calle ', () => {
      const action = new LoadRemarks();

      const result: OtherReceiptState = OtherReceiptsReducer(
        initialState,
        action
      );
      expect(result.isLoadingRemarks).toEqual(true);

      expect(result.error).toBeNull();
    });
    it('LoadRemarksSuccess should be called ', () => {
      const action = new LoadRemarksSuccess([
        { code: '', isActive: true, value: '' }
      ]);
      const result: OtherReceiptState = OtherReceiptsReducer(
        initialState,
        action
      );
      expect(result.isLoadingRemarks).toEqual(false);

      expect(result.remarks).toBeTruthy();
    });
    it('LoadRemarksFailure should be called ', () => {
      const action = new LoadRemarksFailure(
        CustomErrorAdaptor.fromJson(Error('Some Error'))
      );

      const result: OtherReceiptState = OtherReceiptsReducer(
        initialState,
        action
      );
      expect(result.isLoadingRemarks).toEqual(false);

      expect(result.error.message).toBe('Some Error');
    });
  });
  describe('VerifyAllItems Reducer Test Cases', () => {
    it('VerifyAllItems should be calle ', () => {
      const action = new VerifyAllItems(otherReceiptUpdateAllItemsPayload);

      const result: OtherReceiptState = OtherReceiptsReducer(
        initialState,
        action
      );
      expect(result.isVerifyingAllItem).toEqual(true);
      expect(result.isVerifyingAllItemSuccess).toBe(null);
      expect(result.error).toBeNull();
    });
    it('VerifyAllItemsSuccess should be called ', () => {
      const action = new VerifyAllItemsSuccess(true);
      const result: OtherReceiptState = OtherReceiptsReducer(
        initialState,
        action
      );
      expect(result.isVerifyingAllItem).toEqual(false);
      expect(result.isVerifyingAllItemSuccess).toBe(true);
      expect(result.nonVerifiedItems.ids.length).toBe(0);
    });
    it('VerifyAllItemsFailure should be called ', () => {
      const action = new VerifyAllItemsFailure(
        CustomErrorAdaptor.fromJson(Error('Some Error'))
      );

      const result: OtherReceiptState = OtherReceiptsReducer(
        initialState,
        action
      );
      expect(result.isVerifyingAllItemSuccess).toEqual(false);
      expect(result.isVerifyingAllItem).toBe(false);

      expect(result.error.message).toBe('Some Error');
    });
  });

  describe('AddItemsToCartPSV Action Test Cases', () => {
    it('AddItemsToCartPSV to be called', () => {
      const action = new AddItemsToCartPSV([adjustmentitem]);

      const result: OtherReceiptState = OtherReceiptsReducer(
        initialState,
        action
      );

      expect(result.itemsInCartsPSV).toBeTruthy();
      expect(result.error).toBeNull();
    });
  });

  describe('LoadRecieptLoanList Reducer Test Cases', () => {
    it('LoadRecieptLoanList should be calle ', () => {
      const action = new LoadRecieptLoanList(otherReceiptLoadListItemsPayload);

      const result: OtherReceiptState = OtherReceiptsReducer(
        initialState,
        action
      );
      expect(result.isLoadingOtherReceiptLoanList).toEqual(true);

      expect(result.error).toBeNull();
    });
    it('LoadRecieptLoanListSuccess should be called ', () => {
      const action = new LoadRecieptLoanListSuccess(otherReceiptsDataModel);
      const result: OtherReceiptState = OtherReceiptsReducer(
        initialState,
        action
      );
      expect(result.isLoadingOtherReceiptLoanList).toEqual(false);

      expect(result.otherReceiptLoanList).toBeTruthy();
    });
    it('LoadRecieptLoanListFailure should be called ', () => {
      const action = new LoadRecieptLoanListFailure(
        CustomErrorAdaptor.fromJson(Error('Some Error'))
      );

      const result: OtherReceiptState = OtherReceiptsReducer(
        initialState,
        action
      );
      expect(result.isLoadingOtherReceiptLoanList).toEqual(false);

      expect(result.error.message).toBe('Some Error');
    });
  });

  describe('RemoveMultipleAdjustementItems Action Test Cases', () => {
    it('RemoveMultipleAdjustementItems to be called', () => {
      const action = new RemoveMultipleAdjustementItems(['test']);

      const result: OtherReceiptState = OtherReceiptsReducer(
        initialState,
        action
      );

      expect(result.hasSearchItemInCartSearchAdjustment).toBe(false);

      expect(result.error).toBeNull();
    });
  });

  describe('RemoveMultiplePSVItems Action Test Cases', () => {
    it('RemoveMultiplePSVItems to be called', () => {
      const action = new RemoveMultiplePSVItems([]);

      const result: OtherReceiptState = OtherReceiptsReducer(
        initialState,
        action
      );

      expect(result.psvItemsInCartsSearch).toBeTruthy();

      expect(result.error).toBeNull();
    });
  });

  describe('AssignBinToAllItems Reducer Test Cases', () => {
    it('AssignBinToAllItems should be calle ', () => {
      const action = new AssignBinToAllItems(otherReceiptUpdateAllItemsPayload);

      const result: OtherReceiptState = OtherReceiptsReducer(
        initialState,
        action
      );
      expect(result.isAssigningBinToAllItems).toEqual(true);
      expect(result.isAssigningBinToAllItemsSuccess).toBe(null);
      expect(result.error).toBeNull();
    });
    it('AssignBinToAllItemsSuccess should be called ', () => {
      const action = new AssignBinToAllItemsSuccess(true);
      const result: OtherReceiptState = OtherReceiptsReducer(
        initialState,
        action
      );
      expect(result.isAssigningBinToAllItems).toEqual(false);
      expect(result.isAssigningBinToAllItemsSuccess).toBe(true);
    });
    it('AssignBinToAllItemsFailure should be called ', () => {
      const action = new AssignBinToAllItemsFailure(
        CustomErrorAdaptor.fromJson(Error('Some Error'))
      );

      const result: OtherReceiptState = OtherReceiptsReducer(
        initialState,
        action
      );
      expect(result.isAssigningBinToAllItems).toEqual(false);
      expect(result.isAssigningBinToAllItemsSuccess).toBe(false);

      expect(result.error.message).toBe('Some Error');
    });
  });
  describe('ConfirmAdjustementItems Reducer Test Cases', () => {
    it('ConfirmAdjustementItems should be calle ', () => {
      const action = new ConfirmAdjustementItems(
        otherReceiptConfirmAdjustmentItemsPayload
      );

      const result: OtherReceiptState = OtherReceiptsReducer(
        initialState,
        action
      );
      expect(result.isLoadingAdjustment).toEqual(true);

      expect(result.error).toBeNull();
    });
    it('ConfirmAdjustementItemsSuccess should be called ', () => {
      const action = new ConfirmAdjustementItemsSuccess(adjustmentitem);
      const result: OtherReceiptState = OtherReceiptsReducer(
        initialState,
        action
      );
      expect(result.isLoadingAdjustment).toEqual(false);
      expect(result.confirmAdjustementItemResponse).toBeTruthy();
    });
    it('ConfirmAdjustementItemsFailure should be called ', () => {
      const action = new ConfirmAdjustementItemsFailure(
        CustomErrorAdaptor.fromJson(Error('Some Error'))
      );

      const result: OtherReceiptState = OtherReceiptsReducer(
        initialState,
        action
      );
      expect(result.isLoadingAdjustment).toEqual(false);

      expect(result.error.message).toBe('Some Error');
    });
  });
  describe('LoadReceiptsADJList Reducer Test Cases', () => {
    it('LoadReceiptsADJList should be calle ', () => {
      const action = new LoadReceiptsADJList(otherReceiptLoadListItemsPayload);

      const result: OtherReceiptState = OtherReceiptsReducer(
        initialState,
        action
      );
      expect(result.isLoadingOtherReceiptADJList).toEqual(true);

      expect(result.error).toBeNull();
    });
    it('LoadReceiptsADJListSuccess should be called ', () => {
      const action = new LoadReceiptsADJListSuccess(otherReceiptsDataModel);
      const result: OtherReceiptState = OtherReceiptsReducer(
        initialState,
        action
      );
      expect(result.isLoadingOtherReceiptADJList).toEqual(false);

      expect(result.otherReceiptADJList).toBeTruthy();
    });
    it('LoadReceiptsADJListFailure should be called ', () => {
      const action = new LoadReceiptsADJListFailure(
        CustomErrorAdaptor.fromJson(Error('Some Error'))
      );

      const result: OtherReceiptState = OtherReceiptsReducer(
        initialState,
        action
      );
      expect(result.isLoadingOtherReceiptADJList).toEqual(false);

      expect(result.error.message).toBe('Some Error');
    });
  });
  describe('ValidateNonVerifiedItem Reducer Test Cases', () => {
    it('ValidateNonVerifiedItem should be calle ', () => {
      const action = new ValidateNonVerifiedItem(itemValidate);

      const result: OtherReceiptState = OtherReceiptsReducer(
        initialState,
        action
      );

      expect(result.nonVerifiedItems).toBeTruthy();
      expect(result.error).toBeNull();
    });
    it('ValidateNonVerifiedItemSuccess should be called ', () => {
      const action = new ValidateNonVerifiedItemSuccess({
        itemId: '',
        isSuccess: true
      });
      const result: OtherReceiptState = OtherReceiptsReducer(
        initialState,
        action
      );

      expect(result.nonVerifiedItems).toBeTruthy();
    });
    it('ValidateNonVerifiedItemFailure should be called ', () => {
      const payload: OtherReceiptUpdateItemFailurePayload = {
        actualDetails: otherReceiptItemUpdate,
        error: CustomErrorAdaptor.fromJson(Error('Some Error')),
        itemId: ''
      };
      const action = new ValidateNonVerifiedItemFailure(payload);

      const result: OtherReceiptState = OtherReceiptsReducer(
        initialState,
        action
      );
      expect(result.nonVerifiedItems).toBeTruthy();
      expect(result.error.message).toBe('Some Error');
    });
  });

  describe('ConfirmPSVItems Reducer Test Cases', () => {
    it('ConfirmPSVItems should be calle ', () => {
      const action = new ConfirmPSVItems(
        otherReceiptConfirmAdjustmentItemsPayload
      );

      const result: OtherReceiptState = OtherReceiptsReducer(
        initialState,
        action
      );
      expect(result.IsLoadingPSV).toEqual(true);
      expect(result.error).toBeNull();
    });
    it('ConfirmPSVItemsSuccess should be called ', () => {
      const action = new ConfirmPSVItemsSuccess(adjustmentitem);
      const result: OtherReceiptState = OtherReceiptsReducer(
        initialState,
        action
      );
      expect(result.IsLoadingPSV).toEqual(false);

      expect(result.confirmPSVItemResponse).toBeTruthy();
    });
    it('ConfirmPSVItemsFailure should be called ', () => {
      const action = new ConfirmPSVItemsFailure(
        CustomErrorAdaptor.fromJson(Error('Some Error'))
      );

      const result: OtherReceiptState = OtherReceiptsReducer(
        initialState,
        action
      );
      expect(result.IsLoadingPSV).toEqual(false);

      expect(result.error.message).toBe('Some Error');
    });
  });

  describe('ValidateVerifiedItem Reducer Test Cases', () => {
    it('ValidateVerifiedItem should be calle ', () => {
      const action = new ValidateVerifiedItem(itemValidate);

      const result: OtherReceiptState = OtherReceiptsReducer(
        initialState,
        action
      );

      expect(result.verifiedItems).toBeTruthy();
      expect(result.error).toBeNull();
    });
    it('ValidateVerifiedItemSuccess should be called ', () => {
      const payload: OtherReceiptUpdateItemFailurePayload = {
        actualDetails: otherReceiptItemUpdate,
        error: CustomErrorAdaptor.fromJson(Error('Some Error')),
        itemId: ''
      };
      const action = new ValidateVerifiedItemSuccess({
        itemId: '',
        isSuccess: true
      });
      const result: OtherReceiptState = OtherReceiptsReducer(
        initialState,
        action
      );
      expect(result.verifiedItems).toBeTruthy();
    });
    it('ValidateVerifiedItemFailure should be called ', () => {
      const payload: OtherReceiptUpdateItemFailurePayload = {
        actualDetails: otherReceiptItemUpdate,
        error: CustomErrorAdaptor.fromJson(Error('Some Error')),
        itemId: ''
      };
      const action = new ValidateVerifiedItemFailure(payload);

      const result: OtherReceiptState = OtherReceiptsReducer(
        initialState,
        action
      );
      expect(result.verifiedItems).toBeTruthy();

      expect(result.error.message).toBe('Some Error');
    });
  });
  describe('DropDownvalueForReceipts Action Test Cases', () => {
    it('DropDownvalueForReceipts to be called', () => {
      const action = new DropDownvalueForReceipts('test');

      const result: OtherReceiptState = OtherReceiptsReducer(
        initialState,
        action
      );

      expect(result.selectedDropDownForReceipts).toBeTruthy();
      expect(result.error).toBeNull();
    });
  });

  describe('RemovePSVItem Action Test Cases', () => {
    it('RemovePSVItem to be called', () => {
      const action = new RemovePSVItem(adjustmentitem);

      const result: OtherReceiptState = OtherReceiptsReducer(
        initialState,
        action
      );

      expect(result.psvItemsInCartsSearch.ids.length).toBe(0);
      expect(result.itemsInCartsPSV.ids.length).toBe(0);
      expect(result.error).toBeNull();
    });
  });

  describe('RemoveAdjustementItem Action Test Cases', () => {
    it('RemoveAdjustementItem to be called', () => {
      const action = new RemoveAdjustementItem(adjustmentitem);

      const result: OtherReceiptState = OtherReceiptsReducer(
        initialState,
        action
      );

      expect(result.adjustmentItemsInCartsSearch.ids.length).toBe(0);
      expect(result.itemsInCartsPSV.ids.length).toBe(0);
      expect(result.error).toBeNull();
    });
  });

  describe('SearchAdjustment Action Test Cases', () => {
    it('SearchAdjustment to be called', () => {
      const payload: AdjustmentSearchItemPayload = {
        lotNumber: '',
        productGroups: [],
        variantCode: ''
      };

      const action = new AdjustmentSearch(payload);

      const result: OtherReceiptState = OtherReceiptsReducer(
        initialState,
        action
      );
      expect(result.isSearchingAdjustmentItems).toBe(true);
      expect(result.hasSearchedAdjustmentItems).toBe(false);

      expect(result.error).toBeNull();
    });
    it('SearchAdjustmentSuccess to be called', () => {
      const payload: AdjustmentSearchItemPayloadSuccess = dummySearchADJ;

      const action = new AdjustmentSearchSuccess(item);

      const result: OtherReceiptState = OtherReceiptsReducer(
        initialState,
        action
      );
      expect(result.isSearchingAdjustmentItems).toBe(false);
      expect(result.hasSearchedAdjustmentItems).toBe(true);
      expect(result.adjustmentSearchedItems).toBeTruthy();
      expect(result.error).toBeNull();
    });
    it('SearchAdjustmentFailre to be called', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new AdjustmentSearchFailure(payload);

      const result: OtherReceiptState = OtherReceiptsReducer(
        initialState,
        action
      );
      expect(result.isSearchingAdjustmentItems).toBe(false);
      expect(result.hasSearchedAdjustmentItems).toBe(false);

      expect(result.error.message).toBe('Some Error');
    });
  });

  describe('SearchPSV Action Test Cases', () => {
    it('SearchPSV to be called', () => {
      const payload: PSVSearchItemPayload = {
        lotNumber: '',
        productGroups: [],
        variantCode: ''
      };

      const action = new PSVSearch(payload);

      const result: OtherReceiptState = OtherReceiptsReducer(
        initialState,
        action
      );
      expect(result.isSearchingPSVItems).toBe(true);
      expect(result.hasSearchedItemPSV).toBe(false);

      expect(result.error).toBeNull();
    });
    it('SearchPSVSuccess to be called', () => {
      const payload: PSVSearchItemPayloadSuccess = dummySearchADJ;

      const action = new PSVSearchSuccess(item);

      const result: OtherReceiptState = OtherReceiptsReducer(
        initialState,
        action
      );
      expect(result.isSearchingPSVItems).toBe(false);
      expect(result.hasSearchedItemPSV).toBe(true);
      expect(result.psvSearchedItems).toBeTruthy();
      expect(result.error).toBeNull();
    });
    it('SearchPSVFailre to be called', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new PSVSearchFailure(payload);

      const result: OtherReceiptState = OtherReceiptsReducer(
        initialState,
        action
      );
      expect(result.isSearchingPSVItems).toBe(false);
      expect(result.hasSearchedItemPSV).toBe(false);

      expect(result.error.message).toBe('Some Error');
    });
  });

  describe('SearchCartItemsPSV Action Test Cases', () => {
    it('SearchCartItemsPSV to be called', () => {
      const payload: SearchCartItemPSVPayload = {
        searchValue: ''
      };
      const action = new SearchCartItemsPSV(payload);

      const result: OtherReceiptState = OtherReceiptsReducer(
        initialState,
        action
      );
      expect(result.hasSearchItemInCartSearchPSV).toBe(true);
      expect(result.psvItemsInCartsSearch).toBeTruthy();
      expect(result.error).toBeNull();
    });
  });

  describe('LoadRecieptList Reducer Test Cases', () => {
    it('LoadRecieptList should be calle ', () => {
      const action = new LoadRecieptList(otherReceiptLoadListItemsPayload);

      const result: OtherReceiptState = OtherReceiptsReducer(
        initialState,
        action
      );
      expect(result.isLoadingOtherReceiptList).toBe(true);
      expect(result.error).toBeNull();
    });
    it('LoadRecieptListSuccess should be called ', () => {
      const action = new LoadRecieptListSuccess(otherReceiptsDataModel);
      const result: OtherReceiptState = OtherReceiptsReducer(
        initialState,
        action
      );
      expect(result.isLoadingOtherReceiptList).toBe(false);
      expect(result.otherReceiptList).toBeTruthy();
      expect(result.totalElementsOtherReceipts).toBeTruthy();
    });
    it('LoadRecieptListFailure should be called ', () => {
      const action = new LoadRecieptListFailure(
        CustomErrorAdaptor.fromJson(Error('Some Error'))
      );

      const result: OtherReceiptState = OtherReceiptsReducer(
        initialState,
        action
      );
      expect(result.otherReceiptList.ids.length).toBe(0);

      expect(result.error.message).toBe('Some Error');
    });
  });

  describe('ResetPSVIssueData Action Test Cases', () => {
    it('ResetPSVIssueData to be called', () => {
      const action = new ResetPSVReceiptData();

      const result: OtherReceiptState = OtherReceiptsReducer(
        initialState,
        action
      );
      expect(result.hasSearchItemInCartSearchPSV).toBe(false);
      expect(result.isSearchingPSVItems).toBe(false);
      expect(result.hasSearchedItemPSV).toBe(false);
      expect(result.itemsInCartsPSV.ids.length).toBe(0);
      expect(result.error).toBeNull();
    });
  });

  describe('ClearSearchCartItemPSV Action Test Cases', () => {
    it('ClearSearchCartItemPSV to be called', () => {
      const action = new ClearSearchCartItemPSV();

      const result: OtherReceiptState = OtherReceiptsReducer(
        initialState,
        action
      );
      expect(result.psvItemsInCartsSearch.ids.length).toBe(0);
      expect(result.hasSearchItemInCartSearchPSV).toBe(false);
      expect(result.error).toBeNull();
    });
  });

  describe('ResetAdjustmentReceiptData Action Test Cases', () => {
    it('ResetAdjustmentReceiptData to be called', () => {
      const action = new ResetAdjustmentReceiptData();

      const result: OtherReceiptState = OtherReceiptsReducer(
        initialState,
        action
      );
      expect(result.hasSearchItemInCartSearchAdjustment).toBe(false);
      expect(result.hasSearchedAdjustmentItems).toBe(false);
      expect(result.isSearchingAdjustmentItems).toBe(false);
      expect(result.adjustmentItemsInCartsSearch.ids.length).toBe(0);
      expect(result.itemsInCarts.ids.length).toBe(0);
      expect(result.error).toBeNull();
    });
  });

  describe('ClearSearchCartItemAdjustment Action Test Cases', () => {
    it('ClearSearchCartItemAdjustment to be called', () => {
      const action = new ClearSearchCartItemAdjustment();

      const result: OtherReceiptState = OtherReceiptsReducer(
        initialState,
        action
      );
      expect(result.hasSearchItemInCartSearchAdjustment).toBe(false);
      expect(result.adjustmentItemsInCartsSearch.ids.length).toBe(0);
      expect(result.error).toBeNull();
    });
  });

  describe('LoadStuddedProductGroups Action Test Cases', () => {
    it('LoadStuddedProductGroupsSuccess to be called', () => {
      const payload: string[] = [];

      const action = new LoadStuddedProductGroupsSuccess(['stone', 'diamond']);
      const result: OtherReceiptState = OtherReceiptsReducer(
        initialState,
        action
      );
      expect(result.studdedProductGroups).toEqual(['stone', 'diamond']);
    });
    it('LoadStuddedProductGroupsFailre to be called', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadStuddedProductGroupsFailure(payload);

      const result: OtherReceiptState = OtherReceiptsReducer(
        initialState,
        action
      );

      expect(result.error.message).toBe('Some Error');
    });
  });

  describe('ResetReceiptsListData Action Test Cases', () => {
    it('ResetReceiptsListData to be called', () => {
      const action = new ResetReceiptsListData();

      const result: OtherReceiptState = OtherReceiptsReducer(
        initialState,
        action
      );

      expect(result.otherReceiptsDropdownValues).toBeNull();
      expect(result.pendingOtherReceiptsSTNCount).toBe(0);
      expect(result.totalElementsOtherReceipts).toBe(0);
      expect(result.error).toBeNull();
    });
  });

  describe('SetFilterDataNonVerifiedProducts Action Test Cases', () => {
    it('SetFilterDataNonVerifiedProducts to be called', () => {
      const action = new SetFilterDataNonVerifiedProducts({});

      const result: OtherReceiptState = OtherReceiptsReducer(
        initialState,
        action
      );

      expect(result.filterDataNonVerifiedProducts).toBeTruthy();
      expect(result.error).toBeNull();
    });
  });
  describe('SetFilterDataVerifiedProducts Action Test Cases', () => {
    it('SetFilterDataVerifiedProducts to be called', () => {
      const action = new SetFilterDataVerifiedProducts({});

      const result: OtherReceiptState = OtherReceiptsReducer(
        initialState,
        action
      );

      expect(result.filterDataVerifiedProducts).toBeTruthy();
      expect(result.error).toBeNull();
    });
  });
  describe('SetSortDataNonVerifiedProducts Action Test Cases', () => {
    it('SetSortDataNonVerifiedProducts to be called', () => {
      const action = new SetSortDataNonVerifiedProducts([]);

      const result: OtherReceiptState = OtherReceiptsReducer(
        initialState,
        action
      );

      expect(result.sortDataNonVerifiedProducts).toBeTruthy();
      expect(result.error).toBeNull();
    });
  });
  describe('SetSortDataVerifiedProducts Action Test Cases', () => {
    it('SetSortDataVerifiedProducts to be called', () => {
      const payload: OtherIssuesItem[] = dummysearchOtherIssueCreateItems;
      const action = new SetSortDataVerifiedProducts([]);

      const result: OtherReceiptState = OtherReceiptsReducer(
        initialState,
        action
      );

      expect(result.sortDataVerifiedProducts).toBeTruthy();
      expect(result.error).toBeNull();
    });
  });

  describe('LoadOtherReceiptsHistory Releated Reducers Testing', () => {
    it('LoadOtherReceiptsHistpry should be called', () => {
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
      const action = new LoadOtherReceiptsHistory(payload);
      const result: OtherReceiptState = OtherReceiptsReducer(
        initialState,
        action
      );
      expect(result.isLoadingHistory).toEqual(true);
      expect(result.error).toEqual(null);
    });
    it('LoadOtherReceiptsHistorySuccess should be called', () => {
      const payload: OtherReceiptsDataModel = {
        receiptsData: [],
        totalElements: 0
      };
      const action = new LoadOtherReceiptsHistorySuccess(payload);
      const result: OtherReceiptState = OtherReceiptsReducer(
        initialState,
        action
      );
      expect(result.otherReceiptsHistory.ids.length).toEqual(0);
      expect(result.otherReceiptsHistoryCount).toEqual(0);
      expect(result.isLoadingHistory).toEqual(false);
    });
    it('LoadOtherReceiptsHistorFailure should be called', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadOtherReceiptsHistoryFailure(payload);
      const result: OtherReceiptState = OtherReceiptsReducer(
        initialState,
        action
      );
      expect(result.isLoadingHistory).toEqual(false);
      expect(result.error.message).toEqual('Some Error');
    });
  });

  describe('ResetOtherReceiptsHistory Releated Reducers Testing', () => {
    it('ResetOtherReceiptsHistory should be called', () => {
      const action = new ResetOtherReceiptsHistory();
      const result: OtherReceiptState = OtherReceiptsReducer(
        initialState,
        action
      );
      expect(result.otherReceiptsHistory.ids.length).toBe(0);
    });
  });

  describe('LoadSelectedHistory Releated Reducer Testing', () => {
    it('LoadSelectedHistory should be called', () => {
      const payload: { id: number; transactionType: string } = {
        id: 1,
        transactionType: 'ADJ'
      };
      const action = new LoadSelectedHistory(payload);
      const result: OtherReceiptState = OtherReceiptsReducer(
        initialState,
        action
      );
      expect(result.isLoadingSelectedHistory).toEqual(true);
      expect(result.hasSelectedHistory).toEqual(false);
      expect(result.selectedHistory).toEqual(null);
      expect(result.historyItemsCount).toEqual(0);
      expect(result.historyItems.ids.length).toEqual(0);
      expect(result.isLoadingHistoryItems).toEqual(false);
      expect(result.isHistoryItemsLoaded).toEqual(false);
      expect(result.error).toEqual(null);
    });
    it('LoadSelectedHistorySuccess should be called', () => {
      const payload: OtherReceiptsModel = {
        id: 5260,
        transactionType: 'EXH',

        locationCode: 's',
        status: 'APVL_PENDING',
        weightUnit: 'gms',
        currencyCode: 'INR',
        carrierDetails: null,

        remarks: null,
        srcDocNo: 517,
        srcFiscalYear: null,
        srcDocDate: moment(1600692426386),
        destDocNo: null,
        destDocDate: null,
        orderType: null,
        totalAvailableQuantity: 15,
        totalMeasuredQuantity: 15,
        totalAvailableValue: 7631640,
        totalMeasuredValue: 7631640,
        totalAvailableWeight: 321.9,
        totalMeasuredWeight: 321.9
      };
      const action = new LoadSelectedHistorySuccess(payload);
      const result: OtherReceiptState = OtherReceiptsReducer(
        initialState,
        action
      );
      expect(result.isLoadingSelectedHistory).toEqual(false);
      expect(result.hasSelectedHistory).toEqual(true);
      expect(result.selectedHistory.id).toEqual(payload.id);
    });
    it('LoadSelectedHistoryFailure should de called', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadSelectedHistoryFailure(payload);
      const result: OtherReceiptState = OtherReceiptsReducer(
        initialState,
        action
      );
      expect(result.isLoadingSelectedHistory).toEqual(false);
      expect(result.hasSelectedHistory).toEqual(false);
      expect(result.error.message).toEqual('Some Error');
    });
  });

  describe('LoadSelectedHistoryItems Releated Reducer Testing', () => {
    it('LoadSelectedHistoryItems should be called', () => {
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
      const action = new LoadSelectedHistoryItems(payload);
      const result: OtherReceiptState = OtherReceiptsReducer(
        initialState,
        action
      );

      expect(result.historyItems.ids.length).toEqual(0);
      expect(result.isLoadingHistoryItems).toEqual(true);
      expect(result.isHistoryItemsLoaded).toEqual(false);
      expect(result.error).toEqual(null);
    });
    it('LoadSelectedHistoryItemsSuccess should be called', () => {
      const payload: { items: OtherReceiptItem[]; count: number } = {
        items: [
          {
            id: 'a',
            itemCode: '111AVSW1111',
            lotNumber: '10000AB1',
            productCategory: '',
            productCategoryDesc: '',
            productGroup: '',
            productGroupDesc: '',
            binCode: '',
            binGroupCode: '',
            orderType: null,
            itemValue: 100,
            totalQuantity: 1,
            totalValue: 100,
            totalWeight: 1,
            currencyCode: 'INR',
            weightUnit: 'gms',
            mfgDate: moment(),
            status: 'ISSUED',
            imageURL: '',
            itemDetails: { actualGoldWeight: 1, otherStoneWt: 1 },
            isUpdating: false,
            isUpdatingSuccess: true,
            isValidating: true,
            isValidatingError: false,
            isValidatingSuccess: true,
            remarks: '',
            measuredWeight: 10,
            measuredValue: 1000,
            measuredQuantity: 1,
            availableQuantity: 1,
            availableValue: 1000,
            availableWeight: 10,
            stdWeight: 10,
            stdValue: 100,
            isStudded: false,
            thumbnailImageURL:'',
            taxDetails:{},
            isLoadingImage:true,
            isLoadingThumbnailImage: true,

          }
        ],
        count: 1
      };
      const action = new LoadSelectedHistoryItemsSuccess(payload);
      const result: OtherReceiptState = OtherReceiptsReducer(
        initialState,
        action
      );
      expect(result.historyItemsCount).toEqual(1);
      expect(result.historyItems.ids.length).toEqual(1);
      expect(result.isHistoryItemsLoaded).toEqual(true);
      expect(result.isLoadingHistoryItems).toEqual(false);
    });
    it('LoadSelectedHistoryFailure should de called', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadSelectedHistoryItemsFailure(payload);
      const result: OtherReceiptState = OtherReceiptsReducer(
        initialState,
        action
      );
      expect(result.isLoadingHistoryItems).toEqual(false);
      expect(result.isHistoryItemsLoaded).toEqual(false);
      expect(result.error.message).toEqual('Some Error');
    });
  });

  describe('ClearHistoryItems Releated Reducer Testing', () => {
    it('ClearHistoryItems should be called', () => {
      const action = new ClearHistoryItems();
      const result: OtherReceiptState = OtherReceiptsReducer(
        initialState,
        action
      );
      expect(result.historyItems.ids.length).toEqual(0);
    });
  });
  describe('LoadSelectedHistoryItemsTotalCount Releated Reducer Testing', () => {
    it('LoadSelectedHistoryItemsTotalCount should be called', () => {
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
      const action = new LoadSelectedHistoryItemsTotalCount(payload);
      const result: OtherReceiptState = OtherReceiptsReducer(
        initialState,
        action
      );

      expect(result.isLoadingHistoryItemsTotalCount).toEqual(true);
      expect(result.error).toEqual(null);
    });
    it('LoadSelectedHistoryItemsTotalCountSuccess should be called', () => {
      const payload = 1;
      const action = new LoadSelectedHistoryItemsTotalCountSuccess(payload);
      const result: OtherReceiptState = OtherReceiptsReducer(
        initialState,
        action
      );
      expect(result.historyItemsTotalCount).toEqual(1);
      expect(result.isLoadingHistoryItemsTotalCount).toEqual(false);
      expect(result.isHistoryItemsTotalCountLoaded).toEqual(true);
    });
    it('LoadSelectedHistoryItemsTotalCountFailure should de called', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadSelectedHistoryItemsTotalCountFailure(payload);
      const result: OtherReceiptState = OtherReceiptsReducer(
        initialState,
        action
      );
      expect(result.isLoadingHistoryItemsTotalCount).toEqual(false);
      expect(result.error.message).toEqual('Some Error');
    });
  });
});
