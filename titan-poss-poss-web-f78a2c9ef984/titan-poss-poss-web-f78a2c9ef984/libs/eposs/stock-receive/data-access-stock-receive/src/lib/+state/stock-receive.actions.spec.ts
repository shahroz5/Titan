import {
  LoadPendingBoutiqueSTNSuccess,
  LoadPendingBoutiqueSTNFailure,
  LoadPendingCFAInvoice,
  LoadPendingCFAInvoiceSuccess,
  LoadPendingCFAInvoiceFailure,
  SearchPendingStocks,
  SearchPendingStocksSuccess,
  SearchPendingStocksFailure,
  SearchPendingInvoices,
  SearchPendingInvoicesSuccess,
  SearchPendingInvoicesFailure,
  LoadSelectedStock,
  LoadSelectedStockFailure,
  LoadSelectedStockSuccess,
  LoadSelectedInvoice,
  LoadSelectedInvoiceSuccess,
  LoadSelectedInvoiceFailure,
  SearchClear,
  LoadItemsTotalCount,
  LoadItemsTotalCountSuccess,
  LoadItemsTotalCountFailure,
  LoadItems,
  LoadItemsSuccess,
  LoadItemsFailure,
  LoadBinCodes,
  LoadBinCodesSuccess,
  LoadBinCodesFailure,
  LoadRemarks,
  LoadRemarksSuccess,
  LoadRemarksFailure,
  LoadProductGroups,
  LoadProductGroupsSuccess,
  LoadProductGroupsFailure,
  LoadStuddedProductGroups,
  LoadStuddedProductGroupsSuccess,
  LoadStuddedProductGroupsFailure,
  LoadProductCategories,
  LoadProductCategoriesSuccess,
  LoadProductCategoriesFailure,
  VerifyItem,
  VerifyItemSuccess,
  VerifyItemFailure,
  UpdateItem,
  UpdateItemSuccess,
  UpdateItemFailure,
  ValidateItem,
  ValidateItemSuccess,
  ValidateItemFailure,
  VerifyAllItems,
  VerifyAllItemsSuccess,
  VerifyAllItemsFailure,
  AssignBinToAllItems,
  AssignBinToAllItemsSuccess,
  AssignBinToAllItemsFailure,
  ConfirmStockReceive,
  ConfirmStockReceiveSuccess,
  ConfirmStockReceiveFailure,
  ResetError,
  ClearStocks,
  ClearItems,
  ResetSearch,
  ClearSearchResult,
  LoadStockReceiveHistory,
  LoadStockReceiveHistoryFailure,
  LoadStockReceiveHistorySuccess,
  LoadStockReceiveInvoiceHistoryFailure,
  LoadStockReceiveInvoiceHistorySuccess,
  LoadStockReceiveInvoiceHistory,
  ResetStockReceiveHistory,
  LoadStockReceiveHistoryItems,
  LoadStockReceiveHistoryItemsFailure,
  LoadStockReceiveHistoryItemsSuccess,
  StoreHistoryType,
  StoreAdvancedFilterData
} from './stock-receive.actions';
// Actions are not containing any business logic so this provides less value to
// test. They are only used to trigger a reducer or an effect, which is already
// covered by type-safety by using Typescript. You might anyway want to write tests
// for your action dispatchers for the sake of enforcing a specific coverage level
// and “double checking” that the right action is being dispatched.
import {
  LoadPendingFactorySTN,
  StockReceiveActionTypes,
  LoadPendingFactorySTNSuccess,
  LoadPendingFactorySTNFailure,
  LoadPendingBoutiqueSTN
} from './stock-receive.actions';
import {
  StockReceiveLoadPendingPayload,
  StockReceiveStock,
  CustomErrors,
  StockReceiveSearchPendingPayload,
  StockReceiveLoadItemsTotalCountPayload,
  StockReceiveLoadItemsTotalCountSuccessResponse,
  StockReceiveLoadItemsPayload,
  StockReceiveItem,
  BinCode,
  Lov,
  ProductGroup,
  ProductCategory,
  StockReceiveUpdateItemPayload,
  StockReceiveUpdateItemFailurePayload,
  StockReceiveItemValidate,
  StockReceiveUpdateAllItemsPayload,
  StockReceiveConfirmStockReceivePayload,
  StockReceiveHistoryPayload,
  StockReceiveHistoryItemsPayload,
  AdvanceFilterPayload,
  StockReceiveTypesEnum
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import * as moment from 'moment';

const dummyStockResponse: StockReceiveStock[] = [
  {
    id: 111,
    srcDocNo: 111,
    srcLocationCode: 'TestLocation',
    type: 'courier',
    courierDetails: {
      type: 'TEST',
      data: {
        companyName: 'Test',
        docketNumber: 'Test',
        lockNumber: 'Test',
        roadPermitNumber: 'Test',
        employeeId: 'Test',
        employeeMobileNumber: 'Test',
        employeeName: 'Test'
      }
    },
    orderType: 'R',
    courierReceivedDate: moment(),
    totalAvailableValue: 10,
    totalAvailableWeight: 10,
    totalAvailableQuantity: 10,
    totalMeasuredQuantity: 10,
    totalMeasuredValue: 10,
    totalMeasuredWeight: 10,
    srcDocDate: moment(),
    currencyCode: 'INR',
    weightUnit: 'gms',
    status: 'issued',
    srcFiscalYear: 2020,
    destDocDate: moment(),
    destDocNo: 111,
    destLocationCode: 'TestCode',
    srcLocationDescription: 'Description',
    destLocationDescription: 'Description'
  }
];

const dummyItemsResponse: StockReceiveItem[] = [
  {
    id: '23SW22',
    binCode: 'TestBinCode',
    itemCode: '1233NXB992',
    itemDetails: {},
    stdValue: 10,
    stdWeight: 10,
    lotNumber: '121212',
    mfgDate: moment(),
    status: 'issued',
    availableValue: 10,
    availableWeight: 10,
    currencyCode: 'INR',
    weightUnit: 'gms',
    imageURL: 'http://test.com',
    measuredQuantity: 10,
    measuredWeight: 10,
    binGroupCode: 'TestBinGroupCode',
    availableQuantity: 10,
    orderType: 'P',
    productCategory: 'TestProductCategory',
    productGroup: 'TestProductGroup',
    productCategoryDesc: 'TestProductCategoryDesc',
    productGroupDesc: 'TestProductGroupDesc',
    remarks: 'TestRemarks',
    isUpdating: false,
    isUpdatingSuccess: null,
    isValidating: false,
    isValidatingSuccess: null,
    isValidatingError: false,
    isStudded: true,
    thumbnailImageURL: 'dummy',
    isLoadingImage: true,
    isLoadingThumbnailImage: true
  }
];

describe('Stock Receive Action Testing Suite', () => {
  describe('LoadPendingFactorySTN Action Test Cases', () => {
    it('should check correct type is used for  LoadPendingFactorySTN action ', () => {
      const payload: StockReceiveLoadPendingPayload = {
        pageIndex: 0,
        pageSize: 100
      };
      const action = new LoadPendingFactorySTN(payload);

      expect(action.type).toEqual(
        StockReceiveActionTypes.LOAD_PENDING_FACTORY_STN
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  LoadPendingFactorySTNSuccess action ', () => {
      const payload: StockReceiveStock[] = dummyStockResponse;
      const action = new LoadPendingFactorySTNSuccess(payload);

      expect(action.type).toEqual(
        StockReceiveActionTypes.LOAD_PENDING_FACTORY_STN_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  LoadPendingFactorySTNFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadPendingFactorySTNFailure(payload);

      expect(action.type).toEqual(
        StockReceiveActionTypes.LOAD_PENDING_FACTORY_STN_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });
  describe('LoadPendingBoutiqueSTN Action Test Cases', () => {
    it('should check correct type is used for  LoadPendingBoutiqueSTN action ', () => {
      const payload: StockReceiveLoadPendingPayload = {
        pageIndex: 0,
        pageSize: 100
      };
      const action = new LoadPendingBoutiqueSTN(payload);

      expect(action.type).toEqual(
        StockReceiveActionTypes.LOAD_PENDING_BOUTIQUE_STN
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  LoadPendingBoutiqueSTNSuccess action ', () => {
      const payload: StockReceiveStock[] = dummyStockResponse;
      const action = new LoadPendingBoutiqueSTNSuccess(payload);

      expect(action.type).toEqual(
        StockReceiveActionTypes.LOAD_PENDING_BOUTIQUE_STN_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  LoadPendingBoutiqueSTNFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadPendingBoutiqueSTNFailure(payload);

      expect(action.type).toEqual(
        StockReceiveActionTypes.LOAD_PENDING_BOUTIQUE_STN_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('LoadPendingCFAInvoice Action Test Cases', () => {
    it('should check correct type is used for  LoadPendingCFAInvoice action ', () => {
      const payload: StockReceiveLoadPendingPayload = {
        pageIndex: 0,
        pageSize: 100
      };
      const action = new LoadPendingCFAInvoice(payload);

      expect(action.type).toEqual(
        StockReceiveActionTypes.LOAD_PENDING_CFA_INVOICE
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  LoadPendingCFAInvoiceSuccess action ', () => {
      const payload: StockReceiveStock[] = dummyStockResponse;
      const action = new LoadPendingCFAInvoiceSuccess(payload);

      expect(action.type).toEqual(
        StockReceiveActionTypes.LOAD_PENDING_CFA_INVOICE_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  LoadPendingCFAInvoiceFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadPendingCFAInvoiceFailure(payload);

      expect(action.type).toEqual(
        StockReceiveActionTypes.LOAD_PENDING_CFA_INVOICE_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('SearchPendingStocks Action Test Cases', () => {
    it('should check correct type is used for  SearchPendingStocks action ', () => {
      const payload: StockReceiveSearchPendingPayload = {
        type: '',
        srcDocnumber: "123"
      };
      const action = new SearchPendingStocks(payload);

      expect(action.type).toEqual(
        StockReceiveActionTypes.SEARCH_PENDING_STOCKS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  SearchPendingStocksSuccess action ', () => {
      const payload: StockReceiveStock[] = dummyStockResponse;
      const action = new SearchPendingStocksSuccess(payload);

      expect(action.type).toEqual(
        StockReceiveActionTypes.SEARCH_PENDING_STOCKS_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  SearchPendingStocksFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SearchPendingStocksFailure(payload);

      expect(action.type).toEqual(
        StockReceiveActionTypes.SEARCH_PENDING_STOCKS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('SearchPendingInvoices Action Test Cases', () => {
    it('should check correct type is used for  SearchPendingStocks action ', () => {
      const payload: StockReceiveSearchPendingPayload = {
        type: '',
        srcDocnumber: "123"
      };
      const action = new SearchPendingInvoices(payload);

      expect(action.type).toEqual(
        StockReceiveActionTypes.SEARCH_PENDING_INVOICES
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  SearchPendingInvoicesSuccess action ', () => {
      const payload: StockReceiveStock[] = dummyStockResponse;
      const action = new SearchPendingInvoicesSuccess(payload);

      expect(action.type).toEqual(
        StockReceiveActionTypes.SEARCH_PENDING_INVOICES_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  SearchPendingInvoicesFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SearchPendingInvoicesFailure(payload);

      expect(action.type).toEqual(
        StockReceiveActionTypes.SEARCH_PENDING_INVOICES_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });
  describe('LoadSelectedStock Action Test Cases', () => {
    it('should check correct type is used for  LoadSelectedStock action ', () => {
      const payload: { id: string; type: string } = {
        id: '123',
        type: 'FAC_BTQ'
      };
      const action = new LoadSelectedStock(payload);

      expect(action.type).toEqual(StockReceiveActionTypes.LOAD_SELECTED_STOCK);
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  LoadSelectedStockSuccess action ', () => {
      const payload: StockReceiveStock = dummyStockResponse[0];
      const action = new LoadSelectedStockSuccess(payload);

      expect(action.type).toEqual(
        StockReceiveActionTypes.LOAD_SELECTED_STOCK_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  LoadSelectedStockFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadSelectedStockFailure(payload);

      expect(action.type).toEqual(
        StockReceiveActionTypes.LOAD_SELECTED_STOCK_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });
  describe('LoadSelectedInvoice Action Test Cases', () => {
    it('should check correct type is used for  LoadSelectedInvoice action ', () => {
      const payload: { id: string; type: string } = {
        id: '123',
        type: 'FAC_BTQ'
      };
      const action = new LoadSelectedInvoice(payload);

      expect(action.type).toEqual(
        StockReceiveActionTypes.LOAD_SELECTED_INVOICE
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  LoadSelectedInvoiceSuccess action ', () => {
      const payload: StockReceiveStock = dummyStockResponse[0];
      const action = new LoadSelectedInvoiceSuccess(payload);

      expect(action.type).toEqual(
        StockReceiveActionTypes.LOAD_SELECTED_INVOICE_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  LoadSelectedInvoiceFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadSelectedInvoiceFailure(payload);

      expect(action.type).toEqual(
        StockReceiveActionTypes.LOAD_SELECTED_INVOICE_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('SearchClear Action Test Cases', () => {
    it('should check correct type is used for  SearchClear action ', () => {
      const action = new SearchClear();

      expect(action.type).toEqual(StockReceiveActionTypes.SEARCH_CLEAR);
    });
  });

  describe('LoadItemsTotalCount Action Test Cases', () => {
    it('should check correct type is used for  LoadItemsTotalCount action ', () => {
      const payload: StockReceiveLoadItemsTotalCountPayload = {
        id: 123,
        type: 'FAC_BTQ',
        storeType: 'L1'
      };
      const action = new LoadItemsTotalCount(payload);

      expect(action.type).toEqual(StockReceiveActionTypes.LOAD_ItEMS_COUNT);
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  LoadItemsTotalCountSuccess action ', () => {
      const payload: StockReceiveLoadItemsTotalCountSuccessResponse = {
        nonVerifiedItemsTotalCount: 10,
        verifiedItemsTotalCount: 12
      };
      const action = new LoadItemsTotalCountSuccess(payload);

      expect(action.type).toEqual(
        StockReceiveActionTypes.LOAD_ItEMS_COUNT_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  LoadItemsTotalCountFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadItemsTotalCountFailure(payload);

      expect(action.type).toEqual(
        StockReceiveActionTypes.LOAD_ItEMS_COUNT_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('LoadItems Action Test Cases', () => {
    it('should check correct type is used for  LoadItems action ', () => {
      const payload: StockReceiveLoadItemsPayload = {
        storeType: 'L1',
        type: 'FAC_BTQ',
        id: 123,
        status: 'ISSUED',
        itemCode: null,
        lotNumber: null,
        pageIndex: 1,
        pageSize: 10,
        sortBy: 'weight',
        sortOrder: 'ASC',
        filter: []
      };
      const action = new LoadItems(payload);

      expect(action.type).toEqual(StockReceiveActionTypes.LOAD_ITEMS);
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  LoadItemsSuccess action ', () => {
      const payload: {
        items: StockReceiveItem[];
        count: number;
        status: string;
      } = { items: dummyItemsResponse, count: 10, status: null };
      const action = new LoadItemsSuccess(payload);

      expect(action.type).toEqual(StockReceiveActionTypes.LOAD_ITEMS_SUCCESS);
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  LoadItemsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadItemsFailure(payload);

      expect(action.type).toEqual(StockReceiveActionTypes.LOAD_ITEMS_FAILURE);
      expect(action.payload).toEqual(payload);
    });
  });

  describe('LoadBinCodes Action Test Cases', () => {
    it('should check correct type is used for  LoadBinCodes action ', () => {
      const payload = 'STN';
      const action = new LoadBinCodes(payload);

      expect(action.type).toEqual(StockReceiveActionTypes.LOAD_BIN_CODES);
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  LoadBinCodesSuccess action ', () => {
      const payload: BinCode[] = [
        { binCode: 'Test123', description: 'Test123' }
      ];
      const action = new LoadBinCodesSuccess(payload);

      expect(action.type).toEqual(
        StockReceiveActionTypes.LOAD_BIN_CODES_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  LoadBinCodesFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadBinCodesFailure(payload);

      expect(action.type).toEqual(
        StockReceiveActionTypes.LOAD_BIN_CODES_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });
  describe('LoadRemarks Action Test Cases', () => {
    it('should check correct type is used for  LoadRemarks action ', () => {
      const action = new LoadRemarks();

      expect(action.type).toEqual(StockReceiveActionTypes.LOAD_REMARKS);
    });
    it('should check correct type is used for  LoadRemarksSuccess action ', () => {
      const payload: Lov[] = [
        { code: 'Test123', isActive: true, value: 'Test123' }
      ];
      const action = new LoadRemarksSuccess(payload);

      expect(action.type).toEqual(StockReceiveActionTypes.LOAD_REMARKS_SUCCESS);
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  LoadRemarksFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadRemarksFailure(payload);

      expect(action.type).toEqual(StockReceiveActionTypes.LOAD_REMARKS_FAILURE);
      expect(action.payload).toEqual(payload);
    });
  });

  describe('LoadProductGroups Action Test Cases', () => {
    it('should check correct type is used for  LoadProductGroups action ', () => {
      const action = new LoadProductGroups();

      expect(action.type).toEqual(StockReceiveActionTypes.LOAD_PRODUCT_GROUPS);
    });
    it('should check correct type is used for  LoadProductGroupsSuccess action ', () => {
      const payload: ProductGroup[] = [
        { description: 'Test123', productGroupCode: 'Test123' }
      ];
      const action = new LoadProductGroupsSuccess(payload);

      expect(action.type).toEqual(
        StockReceiveActionTypes.LOAD_PRODUCT_GROUPS_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  LoadProductGroupsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadProductGroupsFailure(payload);

      expect(action.type).toEqual(
        StockReceiveActionTypes.LOAD_PRODUCT_GROUPS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('LoadStuddedProductGroups Action Test Cases', () => {
    it('should check correct type is used for  LoadStuddedProductGroups action ', () => {
      const action = new LoadStuddedProductGroups();

      expect(action.type).toEqual(
        StockReceiveActionTypes.LOAD_STUDDED_PRODUCT_GROUPS
      );
    });
    it('should check correct type is used for  LoadStuddedProductGroupsSuccess action ', () => {
      const payload: string[] = ['71'];
      const action = new LoadStuddedProductGroupsSuccess(payload);

      expect(action.type).toEqual(
        StockReceiveActionTypes.LOAD_STUDDED_PRODUCT_GROUPS_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  LoadStuddedProductGroupsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadStuddedProductGroupsFailure(payload);

      expect(action.type).toEqual(
        StockReceiveActionTypes.LOAD_STUDDED_PRODUCT_GROUPS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('LoadProductCategories Action Test Cases', () => {
    it('should check correct type is used for  LoadProductCategories action ', () => {
      const action = new LoadProductCategories();

      expect(action.type).toEqual(
        StockReceiveActionTypes.LOAD_PRODUCT_CATEGORIES
      );
    });
    it('should check correct type is used for  LoadProductCategoriesSuccess action ', () => {
      const payload: ProductCategory[] = [
        { description: 'Test123', productCategoryCode: 'Test123' }
      ];
      const action = new LoadProductCategoriesSuccess(payload);

      expect(action.type).toEqual(
        StockReceiveActionTypes.LOAD_PRODUCT_CATEGORIES_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  LoadProductCategoriesFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadProductCategoriesFailure(payload);

      expect(action.type).toEqual(
        StockReceiveActionTypes.LOAD_PRODUCT_CATEGORIES_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });
  describe('VerifyItem Action Test Cases', () => {
    it('should check correct type is used for  VerifyItem action ', () => {
      const payload: StockReceiveUpdateItemPayload = {
        type: 'FC_BTQ',
        storeType: 'L1',
        id: 123,
        itemId: 'ITEM_CODE',
        newUpdate: null,
        actualDetails: null
      };
      const action = new VerifyItem(payload);

      expect(action.type).toEqual(StockReceiveActionTypes.VERIFY_ITEM);
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  VerifyItemSuccess action ', () => {
      const payload: StockReceiveItem = dummyItemsResponse[0];
      const action = new VerifyItemSuccess(payload);

      expect(action.type).toEqual(StockReceiveActionTypes.VERIFY_ITEM_SUCCESS);
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  VerifyItemFailure action ', () => {
      const payload: StockReceiveUpdateItemFailurePayload = {
        itemId: 'ITEM_CODE',
        actualDetails: null,
        error: CustomErrorAdaptor.fromJson(Error('Some Error'))
      };
      const action = new VerifyItemFailure(payload);

      expect(action.type).toEqual(StockReceiveActionTypes.VERIFY_ITEM_FAILURE);
      expect(action.payload).toEqual(payload);
    });
  });
  describe('UpdateItem Action Test Cases', () => {
    it('should check correct type is used for  UpdateItem action ', () => {
      const payload: StockReceiveUpdateItemPayload = {
        type: 'FC_BTQ',
        storeType: 'L1',
        id: 123,
        itemId: 'ITEM_CODE',
        newUpdate: null,
        actualDetails: null
      };
      const action = new UpdateItem(payload);

      expect(action.type).toEqual(StockReceiveActionTypes.UPADTE_ITEM);
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  UpdateItemSuccess action ', () => {
      const payload: StockReceiveItem = dummyItemsResponse[0];
      const action = new UpdateItemSuccess(payload);

      expect(action.type).toEqual(StockReceiveActionTypes.UPADTE_ITEM_SUCCESS);
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  UpdateItemFailure action ', () => {
      const payload: StockReceiveUpdateItemFailurePayload = {
        itemId: 'ITEM_CODE',
        actualDetails: null,
        error: CustomErrorAdaptor.fromJson(Error('Some Error'))
      };
      const action = new UpdateItemFailure(payload);

      expect(action.type).toEqual(StockReceiveActionTypes.UPADTE_ITEM_FAILURE);
      expect(action.payload).toEqual(payload);
    });
  });
  describe('ValidateItem Action Test Cases', () => {
    it('should check correct type is used for  ValidateItem action ', () => {
      const payload: StockReceiveItemValidate = {
        itemId: 'ITEM_CODE',
        productGroupCode: '71',
        availableWeight: 12,
        measuredWeight: 10,
        measuredQuantity: 1,
        availableQuantity: 1
      };
      const action = new ValidateItem(payload);

      expect(action.type).toEqual(StockReceiveActionTypes.VALIDATE_ITEM);
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  ValidateItemSuccess action ', () => {
      const payload: { itemId: string; isSuccess: boolean } = {
        itemId: 'ITEM_CODE',
        isSuccess: true
      };
      const action = new ValidateItemSuccess(payload);

      expect(action.type).toEqual(
        StockReceiveActionTypes.VALIDATE_ITEM_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  ValidateItemFailure action ', () => {
      const payload: { itemId: string; error: CustomErrors } = {
        itemId: 'ITEM_CODE',
        error: CustomErrorAdaptor.fromJson(Error('Some Error'))
      };
      const action = new ValidateItemFailure(payload);

      expect(action.type).toEqual(
        StockReceiveActionTypes.VALIDATE_ITEM_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });
  describe('VerifyAllItems  Action Test Cases', () => {
    it('should check correct type is used for  VerifyAllItems  action ', () => {
      const payload: StockReceiveUpdateAllItemsPayload = {
        type: 'FAC_BTQ',
        storeType: 'L1',
        id: 123,
        data: {
          binCode: 'BINCODE'
        }
      };
      const action = new VerifyAllItems(payload);

      expect(action.type).toEqual(StockReceiveActionTypes.VERIFY_ALL_ITEMS);
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  VerifyAllItemsSuccess action ', () => {
      const payload = true;
      const action = new VerifyAllItemsSuccess(payload);

      expect(action.type).toEqual(
        StockReceiveActionTypes.VERIFY_ALL_ITEMS_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  VerifyAllItemsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new VerifyAllItemsFailure(payload);

      expect(action.type).toEqual(
        StockReceiveActionTypes.VERIFY_ALL_ITEMS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('AssignBinToAllItems   Action Test Cases', () => {
    it('should check correct type is used for  AssignBinToAllItems   action ', () => {
      const payload: StockReceiveUpdateAllItemsPayload = {
        type: 'FAC_BTQ',
        storeType: 'L1',
        id: 123,
        data: {
          binCode: 'BINCODE'
        }
      };
      const action = new AssignBinToAllItems(payload);

      expect(action.type).toEqual(StockReceiveActionTypes.ASSIGN_BIN_ALL_ITEMS);
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  AssignBinToAllItemsSuccess action ', () => {
      const payload = true;
      const action = new AssignBinToAllItemsSuccess(payload);

      expect(action.type).toEqual(
        StockReceiveActionTypes.ASSIGN_BIN_ALL_ITEMS_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  AssignBinToAllItemsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new AssignBinToAllItemsFailure(payload);

      expect(action.type).toEqual(
        StockReceiveActionTypes.ASSIGN_BIN_ALL_ITEMS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('ConfirmStockReceive   Action Test Cases', () => {
    it('should check correct type is used for  ConfirmStockReceive   action ', () => {
      const payload: StockReceiveConfirmStockReceivePayload = {
        type: 'FAC_BTQ',
        storeType: 'L1',
        id: 123,
        confirmReceive: null
      };
      const action = new ConfirmStockReceive(payload);

      expect(action.type).toEqual(
        StockReceiveActionTypes.CONFIRM_STOCK_RECEIVE
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  ConfirmStockReceiveSuccess action ', () => {
      const payload = true;
      const action = new ConfirmStockReceiveSuccess(payload);

      expect(action.type).toEqual(
        StockReceiveActionTypes.CONFIRM_STOCK_RECEIVE_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  ConfirmStockReceiveFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new ConfirmStockReceiveFailure(payload);

      expect(action.type).toEqual(
        StockReceiveActionTypes.CONFIRM_STOCK_RECEIVE_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });
  describe('ResetError Action Test Cases', () => {
    it('should check correct type is used for  ResetError    action ', () => {
      const action = new ResetError();

      expect(action.type).toEqual(StockReceiveActionTypes.RESET_ERROR);
    });
  });
  describe('ClearStocks  Action Test Cases', () => {
    it('should check correct type is used for  ClearStocks  action ', () => {
      const action = new ClearStocks();

      expect(action.type).toEqual(StockReceiveActionTypes.CLEAR_STOCKS);
    });
  });
  describe('ClearItems   Action Test Cases', () => {
    it('should check correct type is used for  ClearItems   action ', () => {
      const action = new ClearItems();

      expect(action.type).toEqual(StockReceiveActionTypes.CLEAR_ITEMS);
    });
  });
  describe('ResetSearch  Action Test Cases', () => {
    it('should check correct type is used for  ResetSearch  action ', () => {
      const payload = true;
      const action = new ResetSearch(payload);

      expect(action.type).toEqual(StockReceiveActionTypes.RESET_SEARCH);
      expect(action.payload).toEqual(payload);
    });
  });
  describe('ClearSearchResult   Action Test Cases', () => {
    it('should check correct type is used for  ClearSearchResult   action ', () => {
      const action = new ClearSearchResult();

      expect(action.type).toEqual(StockReceiveActionTypes.CLEAR_SEARCH_RESULT);
    });
  });
  describe('LoadStockReceiveHistory  Action Test Cases', () => {
    it('should check correct type is used for  LoadStockReceiveHistory action ', () => {
      const payload: StockReceiveHistoryPayload = {
        data: null,
        pageIndex: 10,
        pageSize: 1,
        transferType: StockReceiveTypesEnum.HISTORY
      };
      const action = new LoadStockReceiveHistory(payload);

      expect(action.type).toEqual(
        StockReceiveActionTypes.LOAD_STOCK_RECEIVE_HISTORY
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  LoadStockReceiveHistorySuccess action ', () => {
      const payload: { stocks: StockReceiveStock[]; count: number } = {
        stocks: dummyStockResponse,
        count: 10
      };
      const action = new LoadStockReceiveHistorySuccess(payload);

      expect(action.type).toEqual(
        StockReceiveActionTypes.LOAD_STOCK_RECEIVE_HISTORY_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  LoadStockReceiveHistoryFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadStockReceiveHistoryFailure(payload);

      expect(action.type).toEqual(
        StockReceiveActionTypes.LOAD_STOCK_RECEIVE_HISTORY_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });
  describe('LoadStockReceiveInvoiceHistory   Action Test Cases', () => {
    it('should check correct type is used for  LoadStockReceiveInvoiceHistory  action ', () => {
      const payload: StockReceiveHistoryPayload = {
        data: null,
        pageIndex: 10,
        pageSize: 1,
        transferType: StockReceiveTypesEnum.HISTORY
      };
      const action = new LoadStockReceiveInvoiceHistory(payload);

      expect(action.type).toEqual(
        StockReceiveActionTypes.LOAD_STOCK_RECEIVE_INVOICE_HISTORY
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  LoadStockReceiveInvoiceHistorySuccess action ', () => {
      const payload: { stocks: StockReceiveStock[]; count: number } = {
        stocks: dummyStockResponse,
        count: 10
      };
      const action = new LoadStockReceiveInvoiceHistorySuccess(payload);

      expect(action.type).toEqual(
        StockReceiveActionTypes.LOAD_STOCK_RECEIVE_INVOICE_HISTORY_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  LoadStockReceiveInvoiceHistoryFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadStockReceiveInvoiceHistoryFailure(payload);

      expect(action.type).toEqual(
        StockReceiveActionTypes.LOAD_STOCK_RECEIVE_INVOICE_HISTORY_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });
  describe('ResetStockReceiveHistory  Action Test Cases', () => {
    it('should check correct type is used for  ResetStockReceiveHistory  action ', () => {
      const action = new ResetStockReceiveHistory();

      expect(action.type).toEqual(
        StockReceiveActionTypes.RESET_STOCK_RECEIVE_HISTORY
      );
    });
  });

  describe('LoadStockReceiveHistoryItems  Action Test Cases', () => {
    it('should check correct type is used for  LoadStockReceiveHistoryItems  action ', () => {
      const payload: StockReceiveHistoryItemsPayload = {
        StockReceiveHistoryItem: null,
        pageIndex: 10,
        pageSize: 1,
        id: '123',
        isL1L2Store: true,
        isL3Store: false,
        sort: ['weight'],
        sortOrder: 'ASC',
        historyAPIType: null
      };
      const action = new LoadStockReceiveHistoryItems(payload);

      expect(action.type).toEqual(
        StockReceiveActionTypes.LOAD_STOCK_RECEIVE_HISTORY_ITEMS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  LoadStockReceiveHistoryItemsSuccess action ', () => {
      const payload: {
        items: StockReceiveItem[];
        count: number;
        status: string;
      } = { items: dummyItemsResponse, count: 10, status: null };
      const action = new LoadStockReceiveHistoryItemsSuccess(payload);

      expect(action.type).toEqual(
        StockReceiveActionTypes.LOAD_STOCK_RECEIVE_HISTORY_ITEMS_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  LoadStockReceiveHistoryItemsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadStockReceiveHistoryItemsFailure(payload);

      expect(action.type).toEqual(
        StockReceiveActionTypes.LOAD_STOCK_RECEIVE_HISTORY_ITEMS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('StoreHistoryType   Action Test Cases', () => {
    it('should check correct type is used for  StoreHistoryType  action ', () => {
      const payload = 'TESTING';
      const action = new StoreHistoryType(payload);

      expect(action.type).toEqual(StockReceiveActionTypes.STORE_HISTORY_TYPE);
      expect(action.payload).toEqual(payload);
    });
  });

  describe('StoreAdvancedFilterData    Action Test Cases', () => {
    it('should check correct type is used for  StoreAdvancedFilterData   action ', () => {
      const payload: AdvanceFilterPayload = {
        docFromDate: 111,
        docToDate: 222,
        stnNumber: 333,
        sourceLocationCode: 'URB',
        fiscalYear: '2020',
        docNumber: '444'
      };
      const action = new StoreAdvancedFilterData(payload);

      expect(action.type).toEqual(
        StockReceiveActionTypes.STORE_ADVANCED_FILTER_DATE
      );
      expect(action.payload).toEqual(payload);
    });
  });
});
