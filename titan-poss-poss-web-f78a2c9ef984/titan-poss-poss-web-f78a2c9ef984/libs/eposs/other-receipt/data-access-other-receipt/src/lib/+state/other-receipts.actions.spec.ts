import {
  CustomErrors,
  OtherIssuesItem,
  ProductCategory,
  ProductGroup,
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
  BinCode,
  OtherReceiptUpdateItemFailurePayload,
  OtherReceiptItemUpdate,
  ConfirmOtherReceivePayload,
  Lov,
  ItemSummary,
  LoadOtherReceiptsHistoryPayload,
  LoadOtherReceiptsHistoryItemsPayload
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
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
  LoadStuddedProductGroups,
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
  OtherReceiptsActionTypes,
  LoadOtherReceiptsHistory,
  LoadOtherReceiptsHistorySuccess,
  LoadOtherReceiptsHistoryFailure,
  ResetOtherReceiptsHistory,
  LoadSelectedHistory,
  LoadSelectedHistorySuccess,
  LoadSelectedHistoryFailure,
  LoadSelectedHistoryItems,
  LoadSelectedHistoryItemsSuccess,
  LoadSelectedHistoryItemsFailure,
  ClearHistoryItems,
  LoadSelectedHistoryItemsTotalCount,
  LoadSelectedHistoryItemsTotalCountSuccess,
  LoadSelectedHistoryItemsTotalCountFailure
} from './other-receipts.actions';

const dummyReceiptCount: LoadOtherReceiptsSTNCountPayload = {
  countData: [{ type: '', count: 0 }],
  pendingOtherReceiptsSTNCount: 0
};

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

const otherReceiptAdjustmentSearchPayload: OtherReceiptAdjustmentSearchPayload = {
  lotNumber: '',
  variantCode: ''
};

const confirmStockReceivePayload = {
  confirmReceive: { remarks: '' },
  id: 1,
  transactionType: 'EXH'
};

const otherReceiptStockPayLoad: OtherReceiptStockPayLoad = {
  id: '1234',
  transactionType: 'EXH'
};

const otherReceiptLoadItemsTotalCountPayload: OtherReceiptLoadItemsTotalCountPayload = {
  id: 1234,
  transactionType: 'EXH'
};
describe('Other receipt Action Testing Suite', () => {
  describe('LoadReceiptsSTNCount Action Test Cases', () => {
    it('should check correct type is used for  LoadIssuesSTNCount action ', () => {
      const action = new LoadReceiptsSTNCount();

      expect(action.type).toEqual(
        OtherReceiptsActionTypes.LOAD_RECEIPTS_STN_COUNT
      );
    });
    it('should check correct type is used for LoadReceiptsSTNCountSuccess action ', () => {
      const payload: LoadOtherReceiptsSTNCountPayload = dummyReceiptCount;
      const action = new LoadReceiptsSTNCountSuccess(payload);

      expect(action.type).toEqual(
        OtherReceiptsActionTypes.LOAD_RECEIPTS_STN_COUNT_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  LoadReceiptsSTNCountFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadReceiptsSTNCountFailure(payload);

      expect(action.type).toEqual(
        OtherReceiptsActionTypes.LOAD_RECEIPTS_STN_COUNT_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('LoadProductGroups Action Test Cases', () => {
    it('should check correct type is used for  LoadProductGroups action ', () => {
      const action = new LoadProductGroups();

      expect(action.type).toEqual(OtherReceiptsActionTypes.LOAD_PROUDCT_GROUPS);
    });
    it('should check correct type is used for  LoadProductGroupsSuccess action ', () => {
      const payload: ProductGroup[] = [
        { description: '', productGroupCode: '' }
      ];
      const action = new LoadProductGroupsSuccess(payload);

      expect(action.type).toEqual(
        OtherReceiptsActionTypes.LOAD_PROUDCT_GROUPS_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  LoadProductGroupsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadProductGroupsFailure(payload);

      expect(action.type).toEqual(
        OtherReceiptsActionTypes.LOAD_PROUDCT_GROUPS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('LoadProductCategories Action Test Cases', () => {
    it('should check correct type is used for  LoadProductCategories action ', () => {
      const action = new LoadProductCategories();

      expect(action.type).toEqual(
        OtherReceiptsActionTypes.LOAD_PRODUCT_CATEGORIES
      );
    });
    it('should check correct type is used for  LoadProductCategoriesSuccess action ', () => {
      const payload: ProductCategory[] = [
        { description: '', productCategoryCode: '', isActive: true }
      ];
      const action = new LoadProductCategoriesSuccess(payload);

      expect(action.type).toEqual(
        OtherReceiptsActionTypes.LOAD_PRODUCT_CATEGORIES_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  LoadProductCategoriesFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadProductCategoriesFailure(payload);

      expect(action.type).toEqual(
        OtherReceiptsActionTypes.LOAD_PRODUCT_CATEGORIES_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('AddItemsToCart Action Test Cases', () => {
    it('should check correct type is used for AddItemsToCart action ', () => {
      const payload: AdjustmentItem[] = [adjustmentitem];
      const action = new AddItemsToCart(payload);

      expect(action.type).toEqual(OtherReceiptsActionTypes.ADD_ITEMS_TO_CART);
      expect(action.payload).toEqual(payload);
    });
  });

  describe('AddItemsToCartPSV Action Test Cases', () => {
    it('should check correct type is used for AddItemsToCartPSV action ', () => {
      const payload: AdjustmentItem[] = [adjustmentitem];
      const action = new AddItemsToCartPSV(payload);

      expect(action.type).toEqual(
        OtherReceiptsActionTypes.PSV_ADD_ITEMS_TO_CART
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('LoadStuddedProductGroups Action Test Cases', () => {
    it('should check correct type is used for LoadStuddedProductGroups action ', () => {
      const action = new LoadStuddedProductGroups();

      expect(action.type).toEqual(
        OtherReceiptsActionTypes.LOAD_STUDDED_PRODUCT_GROUPS
      );
    });
    it('should check correct type is used for LoadStuddedProductGroupsSuccess action ', () => {
      const payload: string[] = [];

      const action = new LoadStuddedProductGroupsSuccess(payload);

      expect(action.type).toEqual(
        OtherReceiptsActionTypes.LOAD_STUDDED_PRODUCT_GROUPS_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for LoadStuddedProductGroupsFailre action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadStuddedProductGroupsFailure(payload);

      expect(action.type).toEqual(
        OtherReceiptsActionTypes.LOAD_STUDDED_PRODUCT_GROUPS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });

    describe('ClearSearchCartItemAdjustment Action Test Cases', () => {
      it('should check correct type is used for ClearSearchCartItemAdjustment action ', () => {
        const action = new ClearSearchCartItemAdjustment();

        expect(action.type).toEqual(
          OtherReceiptsActionTypes.CLEAR_SEARCH_CART_ITEM_ADJUSTMENT
        );
      });
    });
  });

  describe('ClearSearchInventoryItemAdjustment Action Test Cases', () => {
    it('should check correct type is used for ClearSearchInventoryItemAdjustment action ', () => {
      const action = new ClearSearchInventoryItemAdjustment();

      expect(action.type).toEqual(
        OtherReceiptsActionTypes.CLEAR_SEARCH_INVENTORY_ADJUSTMENT
      );
    });
  });

  describe('ClearSearchInventoryItemPSV Action Test Cases', () => {
    it('should check correct type is used for ClearSearchInventoryItemPSV action ', () => {
      const action = new ClearSearchInventoryItemPSV();

      expect(action.type).toEqual(
        OtherReceiptsActionTypes.CLEAR_SEARCH_INVENTORY_PSV
      );
    });
  });

  describe('SearchCartItemsAdjustment Action Test Cases', () => {
    it('should check correct type is used for SearchCartItemsAdjustment action ', () => {
      const payload: SearchCartItemPSVPayload = {
        searchValue: ''
      };
      const action = new SearchCartItemsAdjustment(payload);

      expect(action.type).toEqual(
        OtherReceiptsActionTypes.SEARCH_CART_ITEM_ADJUSTMENT
      );
    });
  });
  describe('ClearItems Action Test Cases', () => {
    it('should check correct type is used for ClearItems action ', () => {
      const action = new ClearItems();

      expect(action.type).toEqual(OtherReceiptsActionTypes.CLEAR_ITEMS);
    });
  });

  describe('SearchCartItemsPSV Action Test Cases', () => {
    it('should check correct type is used for SearchCartItemsPSV action ', () => {
      const payload: SearchCartItemPSVPayload = {
        searchValue: ''
      };
      const action = new SearchCartItemsPSV(payload);

      expect(action.type).toEqual(
        OtherReceiptsActionTypes.SEARCH_CART_ITEM_PSV
      );
    });
  });

  describe('ClearSearchCartItemPSV Action Test Cases', () => {
    it('should check correct type is used for ClearSearchCartItemPSV action ', () => {
      const action = new ClearSearchCartItemPSV();

      expect(action.type).toEqual(
        OtherReceiptsActionTypes.CLEAR_SEARCH_CART_ITEM_PSV
      );
    });
  });

  describe('LoadRecieptList Action Test Cases', () => {
    it('should check correct type is used for LoadRecieptList action ', () => {
      const payload: OtherReceiptLoadListItemsPayload = otherReceiptLoadListItemsPayload;

      const action = new LoadRecieptList(payload);

      expect(action.type).toEqual(OtherReceiptsActionTypes.LOAD_RECEIPT_LIST);
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for LoadRecieptListSuccess action ', () => {
      const payload: OtherReceiptsDataModel = otherReceiptsDataModel;

      const action = new LoadRecieptListSuccess(payload);

      expect(action.type).toEqual(
        OtherReceiptsActionTypes.LOAD_RECEIPT_LIST_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for LoadRecieptListFailre action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadRecieptListFailure(payload);

      expect(action.type).toEqual(
        OtherReceiptsActionTypes.LOAD_RECEIPT_LIST_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });

    describe('ClearSearchCartItemAdjustment Action Test Cases', () => {
      it('should check correct type is used for ClearSearchCartItemAdjustment action ', () => {
        const action = new ClearSearchCartItemAdjustment();

        expect(action.type).toEqual(
          OtherReceiptsActionTypes.CLEAR_SEARCH_CART_ITEM_ADJUSTMENT
        );
      });
    });
  });

  describe('SearchPendingReceipts Action Test Cases', () => {
    it('should check correct type is used for SearchPendingReceipts action ', () => {
      const payload: OtherReceiptSearchPendingPayload = otherReceiptSearchPendingPayload;

      const action = new SearchPendingReceipts(payload);

      expect(action.type).toEqual(
        OtherReceiptsActionTypes.SEARCH_PENDING_RECEIPTS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for SearchPendingReceiptsSuccess action ', () => {
      const payload: OtherReceiptsModel[] = [receipt2];

      const action = new SearchPendingReceiptsSuccess(payload);

      expect(action.type).toEqual(
        OtherReceiptsActionTypes.SEARCH_PENDING_RECEIPTS_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for SearchPendingReceiptsFailre action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SearchPendingReceiptsFailure(payload);

      expect(action.type).toEqual(
        OtherReceiptsActionTypes.SEARCH_PENDING_RECEIPTS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });

    describe('ClearSearchCartItemAdjustment Action Test Cases', () => {
      it('should check correct type is used for ClearSearchCartItemAdjustment action ', () => {
        const action = new ClearSearchCartItemAdjustment();

        expect(action.type).toEqual(
          OtherReceiptsActionTypes.CLEAR_SEARCH_CART_ITEM_ADJUSTMENT
        );
      });
    });
  });

  describe('LoadItemsTotalCount Action Test Cases', () => {
    it('should check correct type is used for LoadItemsTotalCount action ', () => {
      const payload: OtherReceiptLoadItemsTotalCountPayload = otherReceiptLoadItemsTotalCountPayload;

      const action = new LoadItemsTotalCount(payload);

      expect(action.type).toEqual(OtherReceiptsActionTypes.LOAD_ItEMS_COUNT);
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for LoadItemsTotalCountSuccess action ', () => {
      const payload: OtherReceiptLoadItemsTotalCountSuccessPayload = otherReceiptLoadItemsTotalCountSuccessPayload;

      const action = new LoadItemsTotalCountSuccess(payload);

      expect(action.type).toEqual(
        OtherReceiptsActionTypes.LOAD_ItEMS_COUNT_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for LoadItemsTotalCountFailre action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadItemsTotalCountFailure(payload);

      expect(action.type).toEqual(
        OtherReceiptsActionTypes.LOAD_ItEMS_COUNT_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });

    describe('ClearSearchCartItemAdjustment Action Test Cases', () => {
      it('should check correct type is used for ClearSearchCartItemAdjustment action ', () => {
        const action = new ClearSearchCartItemAdjustment();

        expect(action.type).toEqual(
          OtherReceiptsActionTypes.CLEAR_SEARCH_CART_ITEM_ADJUSTMENT
        );
      });
    });
  });

  describe('LoadSelectedStock Action Test Cases', () => {
    it('should check correct type is used for LoadSelectedStock action ', () => {
      const payload: OtherReceiptStockPayLoad = otherReceiptStockPayLoad;

      const action = new LoadSelectedStock(payload);

      expect(action.type).toEqual(OtherReceiptsActionTypes.LOAD_SELECTED_STOCK);
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for LoadSelectedStockSuccess action ', () => {
      const payload: OtherReceiptsModel = receipt2;

      const action = new LoadSelectedStockSuccess(payload);

      expect(action.type).toEqual(
        OtherReceiptsActionTypes.LOAD_SELECTED_STOCK_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for LoadSelectedStockFailre action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadSelectedStockFailure(payload);

      expect(action.type).toEqual(
        OtherReceiptsActionTypes.LOAD_SELECTED_STOCK_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });

    describe('ClearSearchCartItemAdjustment Action Test Cases', () => {
      it('should check correct type is used for ClearSearchCartItemAdjustment action ', () => {
        const action = new ClearSearchCartItemAdjustment();

        expect(action.type).toEqual(
          OtherReceiptsActionTypes.CLEAR_SEARCH_CART_ITEM_ADJUSTMENT
        );
      });
    });
  });

  describe('LoadNonVerifiedItems Action Test Cases', () => {
    it('should check correct type is used for LoadNonVerifiedItems action ', () => {
      const payload: OtherReceiptLoadItemsPayload = otherReceiptLoadItemsPayload;

      const action = new LoadNonVerifiedItems(payload);

      expect(action.type).toEqual(
        OtherReceiptsActionTypes.LOAD_NON_VERIFIED_ITEMS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for LoadNonVerifiedItemsSuccess action ', () => {
      const payload = { items: [item1], count: 2 };

      const action = new LoadNonVerifiedItemsSuccess(payload);

      expect(action.type).toEqual(
        OtherReceiptsActionTypes.LOAD_NON_VERIFIED_ITEMS_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for LoadNonVerifiedItemsFailre action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadNonVerifiedItemsFailure(payload);

      expect(action.type).toEqual(
        OtherReceiptsActionTypes.LOAD_NON_VERIFIED_ITEMS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });

    describe('ClearSearchCartItemAdjustment Action Test Cases', () => {
      it('should check correct type is used for ClearSearchCartItemAdjustment action ', () => {
        const action = new ClearSearchCartItemAdjustment();

        expect(action.type).toEqual(
          OtherReceiptsActionTypes.CLEAR_SEARCH_CART_ITEM_ADJUSTMENT
        );
      });
    });
  });

  describe('LoadVerifiedItems Action Test Cases', () => {
    it('should check correct type is used for LoadVerifiedItems action ', () => {
      const payload: OtherReceiptLoadItemsPayload = otherReceiptLoadItemsPayload;

      const action = new LoadVerifiedItems(payload);

      expect(action.type).toEqual(OtherReceiptsActionTypes.LOAD_VERIFIED_ITEMS);
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for LoadVerifiedItemsSuccess action ', () => {
      const payload = { items: [item1], count: 2 };
      const action = new LoadVerifiedItemsSuccess(payload);

      expect(action.type).toEqual(
        OtherReceiptsActionTypes.LOAD_VERIFIED_ITEMS_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for LoadVerifiedItemsFailre action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadVerifiedItemsFailure(payload);

      expect(action.type).toEqual(
        OtherReceiptsActionTypes.LOAD_VERIFIED_ITEMS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });

    describe('ClearSearchCartItemAdjustment Action Test Cases', () => {
      it('should check correct type is used for ClearSearchCartItemAdjustment action ', () => {
        const action = new ClearSearchCartItemAdjustment();

        expect(action.type).toEqual(
          OtherReceiptsActionTypes.CLEAR_SEARCH_CART_ITEM_ADJUSTMENT
        );
      });
    });
  });
  describe('LoadBinCodes Action Test Cases', () => {
    it('should check correct type is used for LoadBinCodes action ', () => {
      const payload = 'test';

      const action = new LoadBinCodes(payload);

      expect(action.type).toEqual(OtherReceiptsActionTypes.LOAD_BIN_CODES);
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for LoadBinCodesSuccess action ', () => {
      const payload: BinCode[] = [{ binCode: '', description: '' }];

      const action = new LoadBinCodesSuccess(payload);

      expect(action.type).toEqual(
        OtherReceiptsActionTypes.LOAD_BIN_CODES_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for LoadBinCodesFailre action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadBinCodesFailure(payload);

      expect(action.type).toEqual(
        OtherReceiptsActionTypes.LOAD_BIN_CODES_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });

    describe('ClearSearchCartItemAdjustment Action Test Cases', () => {
      it('should check correct type is used for ClearSearchCartItemAdjustment action ', () => {
        const action = new ClearSearchCartItemAdjustment();

        expect(action.type).toEqual(
          OtherReceiptsActionTypes.CLEAR_SEARCH_CART_ITEM_ADJUSTMENT
        );
      });
    });
  });

  describe('VerifyItem Action Test Cases', () => {
    it('should check correct type is used for VerifyItem action ', () => {
      const payload: OtherReceiptUpdateItemPayload = otherReceiptUpdateItemPayload;

      const action = new VerifyItem(payload);

      expect(action.type).toEqual(OtherReceiptsActionTypes.VERIFY_ITEM);
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for VerifyItemSuccess action ', () => {
      const payload: OtherReceiptItem = item1;

      const action = new VerifyItemSuccess(payload);

      expect(action.type).toEqual(OtherReceiptsActionTypes.VERIFY_ITEM_SUCCESS);
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for VerifyItemFailre action ', () => {
      const payload: OtherReceiptUpdateItemFailurePayload = {
        actualDetails: otherReceiptItemUpdate,
        error: CustomErrorAdaptor.fromJson(Error('Some Error')),
        itemId: ''
      };

      const action = new VerifyItemFailure(payload);

      expect(action.type).toEqual(OtherReceiptsActionTypes.VERIFY_ITEM_FAILURE);
      expect(action.payload).toEqual(payload);
    });

    describe('ClearSearchCartItemAdjustment Action Test Cases', () => {
      it('should check correct type is used for ClearSearchCartItemAdjustment action ', () => {
        const action = new ClearSearchCartItemAdjustment();

        expect(action.type).toEqual(
          OtherReceiptsActionTypes.CLEAR_SEARCH_CART_ITEM_ADJUSTMENT
        );
      });
    });
  });

  describe('UpdateItem Action Test Cases', () => {
    it('should check correct type is used for UpdateItem action ', () => {
      const payload: OtherReceiptUpdateItemPayload = otherReceiptUpdateItemPayload;

      const action = new UpdateItem(payload);

      expect(action.type).toEqual(OtherReceiptsActionTypes.UPADTE_ITEM);
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for UpdateItemSuccess action ', () => {
      const payload: OtherReceiptItem = item1;

      const action = new UpdateItemSuccess(payload);

      expect(action.type).toEqual(OtherReceiptsActionTypes.UPADTE_ITEM_SUCCESS);
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for UpdateItemFailre action ', () => {
      const payload: OtherReceiptUpdateItemFailurePayload = {
        actualDetails: otherReceiptItemUpdate,
        error: CustomErrorAdaptor.fromJson(Error('Some Error')),
        itemId: ''
      };
      const action = new UpdateItemFailure(payload);

      expect(action.type).toEqual(OtherReceiptsActionTypes.UPADTE_ITEM_FAILURE);
      expect(action.payload).toEqual(payload);
    });

    describe('ClearSearchCartItemAdjustment Action Test Cases', () => {
      it('should check correct type is used for ClearSearchCartItemAdjustment action ', () => {
        const action = new ClearSearchCartItemAdjustment();

        expect(action.type).toEqual(
          OtherReceiptsActionTypes.CLEAR_SEARCH_CART_ITEM_ADJUSTMENT
        );
      });
    });
  });

  describe('ConfirmStockReceive Action Test Cases', () => {
    it('should check correct type is used for ConfirmStockReceive action ', () => {
      const payload: ConfirmOtherReceivePayload = confirmStockReceivePayload;

      const action = new ConfirmStockReceive(payload);

      expect(action.type).toEqual(
        OtherReceiptsActionTypes.CONFIRM_STOCK_RECEIVE
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for ConfirmStockReceiveSuccess action ', () => {
      const payload = [];

      const action = new ConfirmStockReceiveSuccess(payload);

      expect(action.type).toEqual(
        OtherReceiptsActionTypes.CONFIRM_STOCK_RECEIVE_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for ConfirmStockReceiveFailre action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new ConfirmStockReceiveFailure(payload);

      expect(action.type).toEqual(
        OtherReceiptsActionTypes.CONFIRM_STOCK_RECEIVE_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });

    describe('ClearSearchCartItemAdjustment Action Test Cases', () => {
      it('should check correct type is used for ClearSearchCartItemAdjustment action ', () => {
        const action = new ClearSearchCartItemAdjustment();

        expect(action.type).toEqual(
          OtherReceiptsActionTypes.CLEAR_SEARCH_CART_ITEM_ADJUSTMENT
        );
      });
    });
  });
  describe('LoadRemarks Action Test Cases', () => {
    it('should check correct type is used for LoadRemarks action ', () => {
      const action = new LoadRemarks();

      expect(action.type).toEqual(OtherReceiptsActionTypes.LOAD_REMARKS);
    });
    it('should check correct type is used for LoadRemarksSuccess action ', () => {
      const payload: Lov[] = [{ code: '', isActive: true, value: '' }];

      const action = new LoadRemarksSuccess(payload);

      expect(action.type).toEqual(
        OtherReceiptsActionTypes.LOAD_REMARKS_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for LoadRemarksFailre action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadRemarksFailure(payload);

      expect(action.type).toEqual(
        OtherReceiptsActionTypes.LOAD_REMARKS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });

    describe('ClearSearchCartItemAdjustment Action Test Cases', () => {
      it('should check correct type is used for ClearSearchCartItemAdjustment action ', () => {
        const action = new ClearSearchCartItemAdjustment();

        expect(action.type).toEqual(
          OtherReceiptsActionTypes.CLEAR_SEARCH_CART_ITEM_ADJUSTMENT
        );
      });
    });
  });
  describe('VerifyAllItems Action Test Cases', () => {
    it('should check correct type is used for VerifyAllItems action ', () => {
      const payload: OtherReceiptUpdateAllItemsPayload = otherReceiptUpdateAllItemsPayload;

      const action = new VerifyAllItems(payload);

      expect(action.type).toEqual(OtherReceiptsActionTypes.VERIFY_ALL_ITEMS);
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for VerifyAllItemsSuccess action ', () => {
      const payload = true;

      const action = new VerifyAllItemsSuccess(payload);

      expect(action.type).toEqual(
        OtherReceiptsActionTypes.VERIFY_ALL_ITEMS_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for VerifyAllItemsFailre action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new VerifyAllItemsFailure(payload);

      expect(action.type).toEqual(
        OtherReceiptsActionTypes.VERIFY_ALL_ITEMS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });

    describe('ClearSearchCartItemAdjustment Action Test Cases', () => {
      it('should check correct type is used for ClearSearchCartItemAdjustment action ', () => {
        const action = new ClearSearchCartItemAdjustment();

        expect(action.type).toEqual(
          OtherReceiptsActionTypes.CLEAR_SEARCH_CART_ITEM_ADJUSTMENT
        );
      });
    });
  });
  describe('AssignBinToAllItems Action Test Cases', () => {
    it('should check correct type is used for AssignBinToAllItems action ', () => {
      const payload: OtherReceiptUpdateAllItemsPayload = otherReceiptUpdateAllItemsPayload;

      const action = new AssignBinToAllItems(payload);

      expect(action.type).toEqual(
        OtherReceiptsActionTypes.ASSIGN_BIN_ALL_ITEMS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for AssignBinToAllItemsSuccess action ', () => {
      const payload = true;

      const action = new AssignBinToAllItemsSuccess(payload);

      expect(action.type).toEqual(
        OtherReceiptsActionTypes.ASSIGN_BIN_ALL_ITEMS_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for AssignBinToAllItemsFailre action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new AssignBinToAllItemsFailure(payload);

      expect(action.type).toEqual(
        OtherReceiptsActionTypes.ASSIGN_BIN_ALL_ITEMS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });

    describe('ClearSearchCartItemAdjustment Action Test Cases', () => {
      it('should check correct type is used for ClearSearchCartItemAdjustment action ', () => {
        const action = new ClearSearchCartItemAdjustment();

        expect(action.type).toEqual(
          OtherReceiptsActionTypes.CLEAR_SEARCH_CART_ITEM_ADJUSTMENT
        );
      });
    });
  });

  describe('LoadRecieptLoanList Action Test Cases', () => {
    it('should check correct type is used for LoadRecieptLoanList action ', () => {
      const payload: OtherReceiptLoadListItemsPayload = otherReceiptLoadListItemsPayload;

      const action = new LoadRecieptLoanList(payload);

      expect(action.type).toEqual(
        OtherReceiptsActionTypes.LOAD_RECEIPT_LOAN_LIST
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for LoadRecieptLoanListSuccess action ', () => {
      const payload: OtherReceiptsDataModel = otherReceiptsDataModel;

      const action = new LoadRecieptLoanListSuccess(payload);

      expect(action.type).toEqual(
        OtherReceiptsActionTypes.LOAD_RECEIPT_LOAN_LIST_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for LoadRecieptLoanListFailre action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadRecieptLoanListFailure(payload);

      expect(action.type).toEqual(
        OtherReceiptsActionTypes.LOAD_RECEIPT_LOAN_LIST_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });

    describe('ClearSearchCartItemAdjustment Action Test Cases', () => {
      it('should check correct type is used for ClearSearchCartItemAdjustment action ', () => {
        const action = new ClearSearchCartItemAdjustment();

        expect(action.type).toEqual(
          OtherReceiptsActionTypes.CLEAR_SEARCH_CART_ITEM_ADJUSTMENT
        );
      });
    });
  });

  describe('AdjustmentSearch Action Test Cases', () => {
    it('should check correct type is used for AdjustmentSearch action ', () => {
      const payload: OtherReceiptAdjustmentSearchPayload = otherReceiptAdjustmentSearchPayload;

      const action = new AdjustmentSearch(payload);

      expect(action.type).toEqual(OtherReceiptsActionTypes.ADJUSTMENT_SEARCH);
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for AdjustmentSearchSuccess action ', () => {
      const payload: ItemSummary = item;

      const action = new AdjustmentSearchSuccess(payload);

      expect(action.type).toEqual(
        OtherReceiptsActionTypes.ADJUSTMENT_SEARCH_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for AdjustmentSearchFailre action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new AdjustmentSearchFailure(payload);

      expect(action.type).toEqual(
        OtherReceiptsActionTypes.ADJUSTMENT_SEARCH_FAILUREE
      );
      expect(action.payload).toEqual(payload);
    });

    describe('ClearSearchCartItemAdjustment Action Test Cases', () => {
      it('should check correct type is used for ClearSearchCartItemAdjustment action ', () => {
        const action = new ClearSearchCartItemAdjustment();

        expect(action.type).toEqual(
          OtherReceiptsActionTypes.CLEAR_SEARCH_CART_ITEM_ADJUSTMENT
        );
      });
    });
  });
  describe('ConfirmAdjustementItems Action Test Cases', () => {
    it('should check correct type is used for ConfirmAdjustementItems action ', () => {
      const payload: OtherReceiptConfirmAdjustmentItemsPayload = otherReceiptConfirmAdjustmentItemsPayload;

      const action = new ConfirmAdjustementItems(payload);

      expect(action.type).toEqual(
        OtherReceiptsActionTypes.CONFIRM_ADJUSTEMENT_ITEMS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for ConfirmAdjustementItemsSuccess action ', () => {
      const payload: AdjustmentItem = adjustmentitem;

      const action = new ConfirmAdjustementItemsSuccess(payload);

      expect(action.type).toEqual(
        OtherReceiptsActionTypes.CONFIRM_ADJUSTEMENT_ITEMS_SUCCEESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for ConfirmAdjustementItemsFailre action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new ConfirmAdjustementItemsFailure(payload);

      expect(action.type).toEqual(
        OtherReceiptsActionTypes.CONFIRM_ADJUSTEMENT_ITEMS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });

    describe('ClearSearchCartItemAdjustment Action Test Cases', () => {
      it('should check correct type is used for ClearSearchCartItemAdjustment action ', () => {
        const action = new ClearSearchCartItemAdjustment();

        expect(action.type).toEqual(
          OtherReceiptsActionTypes.CLEAR_SEARCH_CART_ITEM_ADJUSTMENT
        );
      });
    });
  });
  describe('LoadReceiptsADJList Action Test Cases', () => {
    it('should check correct type is used for LoadReceiptsADJList action ', () => {
      const payload: OtherReceiptLoadListItemsPayload = otherReceiptLoadListItemsPayload;

      const action = new LoadReceiptsADJList(payload);

      expect(action.type).toEqual(
        OtherReceiptsActionTypes.LOAD_RECEIPTS_ADJ_LIST
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for LoadReceiptsADJListSuccess action ', () => {
      const payload: OtherReceiptsDataModel = otherReceiptsDataModel;

      const action = new LoadReceiptsADJListSuccess(payload);

      expect(action.type).toEqual(
        OtherReceiptsActionTypes.LOAD_RECEIPTS_ADJ_LIST_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for LoadReceiptsADJListFailre action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadReceiptsADJListFailure(payload);

      expect(action.type).toEqual(
        OtherReceiptsActionTypes.LOAD_RECEIPTS_ADJ_LIST_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });

    describe('ClearSearchCartItemAdjustment Action Test Cases', () => {
      it('should check correct type is used for ClearSearchCartItemAdjustment action ', () => {
        const action = new ClearSearchCartItemAdjustment();

        expect(action.type).toEqual(
          OtherReceiptsActionTypes.CLEAR_SEARCH_CART_ITEM_ADJUSTMENT
        );
      });
    });
  });
  describe('PSVSearch Action Test Cases', () => {
    it('should check correct type is used for PSVSearch action ', () => {
      const payload: OtherReceiptAdjustmentSearchPayload = otherReceiptAdjustmentSearchPayload;

      const action = new PSVSearch(payload);

      expect(action.type).toEqual(OtherReceiptsActionTypes.PSV_SEARCH);
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for PSVSearchSuccess action ', () => {
      const payload: ItemSummary = item;

      const action = new PSVSearchSuccess(payload);

      expect(action.type).toEqual(OtherReceiptsActionTypes.PSV_SEARCH_SUCCESS);
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for PSVSearchFailre action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new PSVSearchFailure(payload);

      expect(action.type).toEqual(OtherReceiptsActionTypes.PSV_SEARCH_FAILUREE);
      expect(action.payload).toEqual(payload);
    });

    describe('ClearSearchCartItemAdjustment Action Test Cases', () => {
      it('should check correct type is used for ClearSearchCartItemAdjustment action ', () => {
        const action = new ClearSearchCartItemAdjustment();

        expect(action.type).toEqual(
          OtherReceiptsActionTypes.CLEAR_SEARCH_CART_ITEM_ADJUSTMENT
        );
      });
    });
  });

  describe('PSVSearch Action Test Cases', () => {
    it('should check correct type is used for PSVSearch action ', () => {
      const payload: OtherReceiptAdjustmentSearchPayload = otherReceiptAdjustmentSearchPayload;

      const action = new PSVSearch(payload);

      expect(action.type).toEqual(OtherReceiptsActionTypes.PSV_SEARCH);
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for PSVSearchSuccess action ', () => {
      const payload: ItemSummary = item;

      const action = new PSVSearchSuccess(payload);

      expect(action.type).toEqual(OtherReceiptsActionTypes.PSV_SEARCH_SUCCESS);
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for PSVSearchFailre action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new PSVSearchFailure(payload);

      expect(action.type).toEqual(OtherReceiptsActionTypes.PSV_SEARCH_FAILUREE);
      expect(action.payload).toEqual(payload);
    });

    describe('ClearSearchCartItemAdjustment Action Test Cases', () => {
      it('should check correct type is used for ClearSearchCartItemAdjustment action ', () => {
        const action = new ClearSearchCartItemAdjustment();

        expect(action.type).toEqual(
          OtherReceiptsActionTypes.CLEAR_SEARCH_CART_ITEM_ADJUSTMENT
        );
      });
    });
  });

  describe('ConfirmPSVItems Action Test Cases', () => {
    it('should check correct type is used for ConfirmPSVItems action ', () => {
      const payload: OtherReceiptConfirmAdjustmentItemsPayload = otherReceiptConfirmAdjustmentItemsPayload;

      const action = new ConfirmPSVItems(payload);

      expect(action.type).toEqual(OtherReceiptsActionTypes.CONFIRM_PSV_ITEMS);
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for ConfirmPSVItemsSuccess action ', () => {
      const payload: AdjustmentItem = adjustmentitem;

      const action = new ConfirmPSVItemsSuccess(payload);

      expect(action.type).toEqual(
        OtherReceiptsActionTypes.CONFIRM_PSV_ITEMS_SUCCEESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for ConfirmPSVItemsFailre action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new ConfirmPSVItemsFailure(payload);

      expect(action.type).toEqual(
        OtherReceiptsActionTypes.CONFIRM_PSV_ITEMS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });

    describe('ClearSearchCartItemAdjustment Action Test Cases', () => {
      it('should check correct type is used for ClearSearchCartItemAdjustment action ', () => {
        const action = new ClearSearchCartItemAdjustment();

        expect(action.type).toEqual(
          OtherReceiptsActionTypes.CLEAR_SEARCH_CART_ITEM_ADJUSTMENT
        );
      });
    });
  });
  describe('ValidateNonVerifiedItem Action Test Cases', () => {
    it('should check correct type is used for ValidateNonVerifiedItem action ', () => {
      const payload: OtherReceiptItemValidate = itemValidate;

      const action = new ValidateNonVerifiedItem(payload);

      expect(action.type).toEqual(
        OtherReceiptsActionTypes.VALIDATE_NON_VERIFIED_ITEM
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for ValidateNonVerifiedItemSuccess action ', () => {
      const payload = { itemId: 'test', isSuccess: true };
      const action = new ValidateNonVerifiedItemSuccess(payload);

      expect(action.type).toEqual(
        OtherReceiptsActionTypes.VALIDATE_NON_VERIFIED_ITEM_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for ValidateNonVerifiedItemFailre action ', () => {
      const payload = {
        error: CustomErrorAdaptor.fromJson(Error('Some Error')),
        itemId: ''
      };
      const action = new ValidateNonVerifiedItemFailure(payload);

      expect(action.type).toEqual(
        OtherReceiptsActionTypes.VALIDATE_NON_VERIFIED_ITEM_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });

    describe('ClearSearchCartItemAdjustment Action Test Cases', () => {
      it('should check correct type is used for ClearSearchCartItemAdjustment action ', () => {
        const action = new ClearSearchCartItemAdjustment();

        expect(action.type).toEqual(
          OtherReceiptsActionTypes.CLEAR_SEARCH_CART_ITEM_ADJUSTMENT
        );
      });
    });
  });
  describe('ValidateVerifiedItem Action Test Cases', () => {
    it('should check correct type is used for ValidateVerifiedItem action ', () => {
      const payload: OtherReceiptItemValidate = itemValidate;

      const action = new ValidateVerifiedItem(payload);

      expect(action.type).toEqual(
        OtherReceiptsActionTypes.VALIDATE_VERIFIED_ITEM
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for ValidateVerifiedItemSuccess action ', () => {
      const payload = { itemId: 'test', isSuccess: true };
      const action = new ValidateVerifiedItemSuccess(payload);

      expect(action.type).toEqual(
        OtherReceiptsActionTypes.VALIDATE_VERIFIED_ITEM_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for ValidateVerifiedItemFailre action ', () => {
      const payload = {
        error: CustomErrorAdaptor.fromJson(Error('Some Error')),
        itemId: ''
      };
      const action = new ValidateVerifiedItemFailure(payload);

      expect(action.type).toEqual(
        OtherReceiptsActionTypes.VALIDATE_VERIFIED_ITEM_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });

    describe('ClearSearchCartItemAdjustment Action Test Cases', () => {
      it('should check correct type is used for ClearSearchCartItemAdjustment action ', () => {
        const action = new ClearSearchCartItemAdjustment();

        expect(action.type).toEqual(
          OtherReceiptsActionTypes.CLEAR_SEARCH_CART_ITEM_ADJUSTMENT
        );
      });
    });
  });
  describe('SearchClear Action Test Cases', () => {
    it('should check correct type is used for SearchClear action ', () => {
      const action = new SearchClear();

      expect(action.type).toEqual(OtherReceiptsActionTypes.SEARCH_CLEAR);
    });
  });
  describe('DropDownvalueForReceipts Action Test Cases', () => {
    it('should check correct type is used for DropDownvalueForReceipts action ', () => {
      const action = new DropDownvalueForReceipts('');

      expect(action.type).toEqual(
        OtherReceiptsActionTypes.DROPDOWN_SELECTED_FOR_RECEIPTS
      );
    });
  });

  describe('RemoveAdjustementItem Action Test Cases', () => {
    it('should check correct type is used for RemoveAdjustementItem action ', () => {
      const action = new RemoveAdjustementItem(adjustmentitem);

      expect(action.type).toEqual(
        OtherReceiptsActionTypes.REMOVE_ADJUSTEMENT_ITEM
      );
    });
  });

  describe('UpdateAdjustementItem Action Test Cases', () => {
    it('should check correct type is used for UpdateAdjustementItem action ', () => {
      const action = new UpdateAdjustementItem(
        otherReceiptUpdateAdjustementItemPayload
      );

      expect(action.type).toEqual(
        OtherReceiptsActionTypes.UPDATE_ADJUSTEMENT_ITEMS
      );
    });
  });

  describe('RemovePSVItem Action Test Cases', () => {
    it('should check correct type is used for RemovePSVItem action ', () => {
      const action = new RemovePSVItem(adjustmentitem);

      expect(action.type).toEqual(OtherReceiptsActionTypes.REMOVE_PSV_ITEM);
    });
  });

  describe('UpdatePSVItem Action Test Cases', () => {
    it('should check correct type is used for UpdatePSVItem action ', () => {
      const action = new UpdatePSVItem(
        otherReceiptUpdateAdjustementItemPayload
      );

      expect(action.type).toEqual(OtherReceiptsActionTypes.UPDATE_PSV_ITEMS);
    });
  });

  describe('RemoveMultiplePSVItems Action Test Cases', () => {
    it('should check correct type is used for RemoveMultiplePSVItems action ', () => {
      const action = new RemoveMultiplePSVItems([]);

      expect(action.type).toEqual(
        OtherReceiptsActionTypes.REMOVE_MULTIPLE_PSV_ITEMs
      );
    });
  });

  describe('RemoveMultipleAdjustementItems Action Test Cases', () => {
    it('should check correct type is used for RemoveMultipleAdjustementItems action ', () => {
      const action = new RemoveMultipleAdjustementItems([]);

      expect(action.type).toEqual(
        OtherReceiptsActionTypes.REMOVE_MULTIPLE_ADJUSTEMENT_ITEMs
      );
    });
  });
  describe('ResetAdjustmentReceiptData Action Test Cases', () => {
    it('should check correct type is used for ResetAdjustmentReceiptData action ', () => {
      const action = new ResetAdjustmentReceiptData();

      expect(action.type).toEqual(
        OtherReceiptsActionTypes.RESET_ADJUSTMENT_DATA
      );
    });
  });
  describe('ClearSearchInventoryItemAdjustment Action Test Cases', () => {
    it('should check correct type is used for ClearSearchInventoryItemAdjustment action ', () => {
      const action = new ClearSearchInventoryItemAdjustment();

      expect(action.type).toEqual(
        OtherReceiptsActionTypes.CLEAR_SEARCH_INVENTORY_ADJUSTMENT
      );
    });
  });

  describe('ResetPSVReceiptData Action Test Cases', () => {
    it('should check correct type is used for ResetPSVReceiptData action ', () => {
      const action = new ResetPSVReceiptData();

      expect(action.type).toEqual(OtherReceiptsActionTypes.RESET_PSV_DATA);
    });
  });
  describe('ResetReceiptsListData Action Test Cases', () => {
    it('should check correct type is used for ResetReceiptsListData action ', () => {
      const action = new ResetReceiptsListData();

      expect(action.type).toEqual(
        OtherReceiptsActionTypes.RESET_RECEIPTS_LIST_DATA
      );
    });
  });

  describe('SetFilterDataNonVerifiedProducts Action Test Cases', () => {
    it('should check correct type is used for SetFilterDataNonVerifiedProducts action ', () => {
      const action = new SetFilterDataNonVerifiedProducts({});

      expect(action.type).toEqual(
        OtherReceiptsActionTypes.SET_FILTER_DATA_NON_VERIFIED_PRODUCTS
      );
    });
  });

  describe('SetFilterDataVerifiedProducts Action Test Cases', () => {
    it('should check correct type is used for SetFilterDataVerifiedProducts action ', () => {
      const action = new SetFilterDataVerifiedProducts({});

      expect(action.type).toEqual(
        OtherReceiptsActionTypes.SET_FILTER_DATA_VERIFIED_PRODUCTS
      );
    });
  });
  describe('SetSortDataVerifiedProducts Action Test Cases', () => {
    it('should check correct type is used for SetSortDataNonVerifiedProducts action ', () => {
      const action = new SetSortDataNonVerifiedProducts([]);

      expect(action.type).toEqual(
        OtherReceiptsActionTypes.SET_SORT_DATA_NON_VERIFIED_PRODUCTS
      );
    });
  });

  describe('SetSortDataVerifiedProducts Action Test Cases', () => {
    it('should check correct type is used for SetSortDataVerifiedProducts action ', () => {
      const action = new SetSortDataVerifiedProducts([]);

      expect(action.type).toEqual(
        OtherReceiptsActionTypes.SET_SORT_DATA_VERIFIED_PRODUCTS
      );
    });
  });

  describe('LoadOtherReceiptsHistory Action Test Cases', () => {
    it('should check correct type is used for LoadOtherReceiptsHistory action', () => {
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
      expect({ ...action }).toEqual({
        type: OtherReceiptsActionTypes.LOAD_OTHER_RECEIPTS_HISTORY,
        payload
      });
    });

    it('should check correct type is used for LoadOtherReceiptsHistorySuccess action', () => {
      const payload: OtherReceiptsDataModel = {
        receiptsData: [],
        totalElements: 0
      };
      const action = new LoadOtherReceiptsHistorySuccess(payload);
      expect({ ...action }).toEqual({
        type: OtherReceiptsActionTypes.LOAD_OTHER_RECEIPTS_HISTORY_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadOtherReceiptsHistoryFailure action', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadOtherReceiptsHistoryFailure(payload);
      expect({ ...action }).toEqual({
        type: OtherReceiptsActionTypes.LOAD_OTHER_RECEIPTS_HISTORY_FAILURE,
        payload
      });
    });
  });

  describe('ResetOtherReceiptsHistory Action Test Cases', () => {
    it('should check correct type is used for ResetOtherReceiptsHistory', () => {
      const action = new ResetOtherReceiptsHistory();
      expect({ ...action }).toEqual({
        type: OtherReceiptsActionTypes.RESET_OTHER_RECEIPTS_HISTORY
      });
    });
  });
  describe('LoadSelectedHistory Action Test Cases', () => {
    it('should check correct type is used for LoadSelectedHistory action', () => {
      const payload: { id: number; transactionType: string } = {
        id: 1,
        transactionType: 'ADJ'
      };
      const action = new LoadSelectedHistory(payload);
      expect({ ...action }).toEqual({
        type: OtherReceiptsActionTypes.LOAD_SELECTED_OTHER_RECEIPTS_HISTORY,
        payload
      });
    });
    it('should check correct type is used for LoadSelectedHistorySuccess Action', () => {
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
      expect({ ...action }).toEqual({
        type:
          OtherReceiptsActionTypes.LOAD_SELECTED_OTHER_RECEIPTS_HISTORY_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadSelectedHistoryFailure', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadSelectedHistoryFailure(payload);
      expect({ ...action }).toEqual({
        type:
          OtherReceiptsActionTypes.LOAD_SELECTED_OTHER_RECEIPTS_HISTORY_FAILURE,
        payload
      });
    });
  });
  describe('LoadSelectedHistoryItems Action Test Case', () => {
    it('should check correct type is used for LoadSelectedHistoryItems Action', () => {
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
      expect({ ...action }).toEqual({
        type: OtherReceiptsActionTypes.LOAD_OTHER_RECEIPTS_HISTORY_ITEMS,
        payload
      });
    });
    it('should check correct type is used for LoadSelectedHistoryItemsSuccess Action', () => {
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
      expect({ ...action }).toEqual({
        type:
          OtherReceiptsActionTypes.LOAD_OTHER_RECEIPTS_HISTORY_ITEMS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadSelectedHistoryItemsFailure Action', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadSelectedHistoryItemsFailure(payload);
      expect({ ...action }).toEqual({
        type:
          OtherReceiptsActionTypes.LOAD_OTHER_RECEIPTS_HISTORY_ITEMS_FAILURE,
        payload
      });
    });
  });
  describe('ClearHistoryItems', () => {
    it('should check correct type is used for ClearHistoryItems Action', () => {
      const action = new ClearHistoryItems();
      expect({ ...action }).toEqual({
        type: OtherReceiptsActionTypes.CLEAR_OTHER_RECEIPTS_HISTORY_ITEMS
      });
    });
  });
  describe('LoadSelectedHistoryItemsTotalCount Action Test Cases', () => {
    it('should check correct type is used for LoadSelectedHistoryItemsTotalCount Action', () => {
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
      expect({ ...action }).toEqual({
        type:
          OtherReceiptsActionTypes.LOAD_OTHER_RECEIPTS_HISTORY_ITEMS_TOTAL_COUNT,
        payload
      });
    });
    it('should check correct type is used for LoadSelectedHistoryItemsTotalCountSuccess Action', () => {
      const payload = 1;
      const action = new LoadSelectedHistoryItemsTotalCountSuccess(payload);
      expect({ ...action }).toEqual({
        type:
          OtherReceiptsActionTypes.LOAD_OTHER_RECEIPTS_HISTORY_ITEMS_TOTAL_COUNT_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadSelectedHistoryItemsTotalCountFailure Action', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadSelectedHistoryItemsTotalCountFailure(payload);
      expect({ ...action }).toEqual({
        type:
          OtherReceiptsActionTypes.LOAD_OTHER_RECEIPTS_HISTORY_ITEMS_TOTAL_COUNT_FAILURE,
        payload
      });
    });
  });
});
