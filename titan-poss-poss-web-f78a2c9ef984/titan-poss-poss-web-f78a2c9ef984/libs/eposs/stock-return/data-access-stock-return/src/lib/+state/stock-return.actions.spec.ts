import {
  CFAddress,
  ConfirmStockReturnPayload,
  CreateIssueItemsPayload,
  CustomErrors,
  HistoryAdvancedFilterPayload,
  LoadStockIssueInvoiceHistory,
  LoadStockIssueInvoiceHistoryPayload,
  LoadStockReturnItemsPayload,
  ProductCategory,
  ProductGroup,
  RemoveSelectedItemsPayload,
  RequestInvoice,
  SearchItemPayload,
  StockReturnItem,
  StoreUser
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import * as moment from 'moment';
import {
  ClearSearch,
  ConfirmIssue,
  ConfirmIssueFailure,
  ConfirmIssueSuccess,
  CreateIssueItems,
  CreateIssueItemsFailure,
  CreateIssueItemsSuccess,
  CreateRequestToCfa,
  CreateRequestToCfaFailure,
  CreateRequestToCfaSuccess,
  LoadCFALocationCode,
  LoadCFALocationCodeFailure,
  LoadCFALocationCodeSuccess,
  LoadCourierDetails,
  LoadCourierDetailsFailure,
  LoadCourierDetailsSuccess,
  LoadEmployeeCodes,
  LoadEmployeeCodesFailure,
  LoadEmployeeCodesSuccess,
  LoadEmployeeDetails,
  LoadEmployeeDetailsFailure,
  LoadEmployeeDetailsSuccess,
  LoadHeaderLevelDetails,
  LoadHeaderLevelDetailsFailure,
  LoadHeaderLevelDetailsSuccess,
  LoadIssueInvoiceHistory,
  LoadIssueInvoiceHistoryFailure,
  LoadIssueInvoiceHistorySucceess,
  LoadItems,
  LoadItemsFailure,
  LoadItemSuccess,
  LoadProductCategories,
  LoadProductCategoriesFailure,
  LoadProductCategoriesSuccess,
  LoadProductGroups,
  LoadProductGroupsFailure,
  LoadProductGroupsSuccess,
  LoadStuddedProductGroups,
  LoadStuddedProductGroupsFailure,
  LoadStuddedProductGroupsSuccess,
  RemoveSelectedItems,
  RemoveSelectedItemsFailure,
  RemoveSelectedItemsSuccess,
  ResetStockReturnHistory,
  ResetStockReturnItems,
  SearchItem,
  SearchItemFailure,
  SearchItemSuccess,
  SelectedProductsSearch,
  SelectedProductsSearchFailure,
  SelectedProdutsSearchSuccess,
  StockReturnActionTypes,
  StoreAdvancedFilterData,
  StoreHistoryType
} from './stock-return.actions';

describe('StockRetun Action TestCases', () => {
  const createIssueItems: CreateIssueItemsPayload = {
    id: 123,
    invoiceItems: [{ inventoryId: 132123123 }]
  };
  const loadItems: LoadStockReturnItemsPayload = {
    id: 12,
    pageSize: 10,
    pageIndex: 1,
    sortBy: null,
    sortOrder: null,
    itemId: '12333333',
    lotNumber: '123333',
    filter: [{ key: '', value: [] }]
  };
  const invoiceHistory: RequestInvoice[] = [
    {
      id: 12,
      srcLocationCode: 'PNA',
      destLocationCode: 'URB',
      status: 'Verified',
      weightUnit: 'gms',
      currencyCode: 'INR',
      srcLocationDescription: 'urb',
      destLocationDescription: 'rso',
      srcDocNo: '123',
      srcFiscalYear: '2019',
      srcDocDate: moment(123123123),
      destDocNo: '123',
      destDocDate: moment(12312312),
      orderType: 'p',
      totalAvailableQuantity: 123,
      totalMeasuredQuantity: 123,
      totalAvailableValue: 123,
      totalMeasuredValue: 123,
      totalAvailableWeight: 123,
      totalMeasuredWeight: 123,
      invoiceType: 'ISSUE_TO_CFA',
      remarks: 'good',
      courierDetails: null
    }
  ];
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
  const historyPayload: LoadStockIssueInvoiceHistoryPayload = {
    loadStockIssueInvoiceHistory: invoceHistory,
    pageIndex: 0,
    pageSize: 10,
    invoiceType: 'ISSUE_INVOICE'
  };
  const advanceFilter: HistoryAdvancedFilterPayload = {
    docFromDate: 12312213,
    docToDate: 2123121,
    fiscalYear: '2019',
    invoiceNumber: 'INVOICE'
  };
  const removeSelectedItems: RemoveSelectedItemsPayload = {
    requestId: 230,
    itemIds: [21, 22]
  };
  const productGroup: ProductGroup[] = [
    {
      description: 'ProductGroup',
      productGroupCode: 'pg'
    }
  ];
  const productCat: ProductCategory[] = [
    {
      description: 'ProductCategory',
      productCategoryCode: 'pc'
    }
  ];
  const employeeDetails: StoreUser[] = [
    {
      empName: 'raju',
      employeeCode: '1213',
      locationCode: 'pna',
      mobileNo: '1234555556',
      isLoginActive: true,
    }
  ];
  const stockReturnItem: StockReturnItem[] = [
    {
      id: 1,
      itemCode: '123123123',
      lotNumber: '123132',
      mfgDate: moment(213123123),
      productCategory: 'pc',
      productGroup: 'pg',
      binCode: 'PURCFA',
      binGroupCode: 'PURCFA',
      stdValue: 123,
      stdWeight: 123,
      currencyCode: 'INR',
      weightUnit: 'gms',
      status: 'verified',
      imageURL: 'www.image',
      itemDetails: {},
      availableQuantity: 123,
      availableWeight: 123,
      availableValue: 123,
      measuredQuantity: 123,
      measuredWeight: 123,
      measuredValue: 123,
      orderType: 'P',
      inventoryId: '12312312',
      productCategoryDesc: 'DESC',
      productGroupDesc: 'ASC',
      remarks: 'good',
      isStudded: true,
      thumbnailImageURL:'',
      taxDetails:{
      },
      isLoadingImage: true,
      isLoadingThumbnailImage :true

    }
  ];
  const headerDetails: StockReturnItem = {
    id: 1,
    itemCode: '123123123',
    lotNumber: '123132',
    mfgDate: moment(213123123),
    productCategory: 'pc',
    productGroup: 'pg',
    binCode: 'PURCFA',
    binGroupCode: 'PURCFA',
    stdValue: 123,
    stdWeight: 123,
    currencyCode: 'INR',
    weightUnit: 'gms',
    status: 'verified',
    imageURL: 'www.image',
    itemDetails: {},
    availableQuantity: 123,
    availableWeight: 123,
    availableValue: 123,
    measuredQuantity: 123,
    measuredWeight: 123,
    measuredValue: 123,
    orderType: 'P',
    inventoryId: '12312312',
    productCategoryDesc: 'DESC',
    productGroupDesc: 'ASC',
    remarks: 'good',
    isStudded: true,
    thumbnailImageURL:'',
      taxDetails:{
      },
      isLoadingImage: true,
      isLoadingThumbnailImage :true
  };

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
  const searchVariantCode: SearchItemPayload = {
    id: 23,
    variantCode: '123123123',
    lotNumber: '12312312'
  };
  const cfaAddress: CFAddress = {
    locationCode: 'PNA',
    brandCode: 'BC',
    townCode: 123,
    stateCode: 123,
    regionCode: 'LC',
    locationTypeCode: 'PNA',
    isActive: true,
    address: 'Vijayawada',
    phoneNo: '9010462817',
    description: 'CFAAdress'
  };
  describe('CreateRequestToCfa Action Test Cases', () => {
    it('should check correct type is used for CreateRequestToCfa action ', () => {
      const action = new CreateRequestToCfa();

      expect(action.type).toEqual(StockReturnActionTypes.CREATE_REQUEST_TO_CFA);
    });
    it('should check correct type is used for CreateRequestToCfaSuccess action ', () => {
      const action = new CreateRequestToCfaSuccess(120);

      expect(action.type).toEqual(
        StockReturnActionTypes.CREATE_REQUEST_TO_CFA_SUCCESS
      );
      expect(action.payload).toEqual(120);
    });
    it('should check correct type is used for  CreateRequestToCfaFailue action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new CreateRequestToCfaFailure(payload);

      expect(action.type).toEqual(
        StockReturnActionTypes.CREATE_REQUEST_TO_CFA_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('ConfirmIssue Action Test Cases', () => {
    it('should check correct type is used for ConfirmIssue action ', () => {
      const action = new ConfirmIssue(confirmIssue);

      expect(action.type).toEqual(StockReturnActionTypes.CONFIRM_ISSUE);
      expect(action.payload).toEqual(confirmIssue);
    });
    it('should check correct type is used for ConfirmIssueSuccess action ', () => {
      const action = new ConfirmIssueSuccess(120);

      expect(action.type).toEqual(StockReturnActionTypes.CONFIRM_ISSUE_SUCCESS);
      expect(action.payload).toEqual(120);
    });
    it('should check correct type is used for ConfirmIssueFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new ConfirmIssueFailure(payload);

      expect(action.type).toEqual(StockReturnActionTypes.CONFIRM_ISSUE_FAILURE);
      expect(action.payload).toEqual(payload);
    });
  });

  describe('SearchItem Action Test Cases', () => {
    it('should check correct type is used for SearchItem action ', () => {
      const action = new SearchItem(searchVariantCode);

      expect(action.type).toEqual(StockReturnActionTypes.SEARCH_ITEM);
      expect(action.payload).toEqual(searchVariantCode);
    });
    it('should check correct type is used for SearchItemSuccess action ', () => {
      const action = new SearchItemSuccess({
        items: stockReturnItem,
        count: 1
      });

      expect(action.type).toEqual(StockReturnActionTypes.SEARCH_ITEM_SUCCESS);
      expect(action.payload).toEqual({
        items: stockReturnItem,
        count: 1
      });
    });
    it('should check correct type is used for SearchItemFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SearchItemFailure(payload);

      expect(action.type).toEqual(StockReturnActionTypes.SEARCH_ITEM_FAILURE);
      expect(action.payload).toEqual(payload);
    });

    it('should check correct type is used for ClearSearch action ', () => {
      const action = new ClearSearch();

      expect(action.type).toEqual(StockReturnActionTypes.CLEAR_SEARCH);
    });
  });
  describe('CreateIssueItems Action TestCases', () => {
    it('should check correct type is used for CreateIssueItems action ', () => {
      const action = new CreateIssueItems(createIssueItems);

      expect(action.type).toEqual(StockReturnActionTypes.CREATE_ISSUE_ITEMS);
      expect(action.payload).toEqual(createIssueItems);
    });
    it('should check correct type is used for CreateIssueItemsSuccess action ', () => {
      const action = new CreateIssueItemsSuccess();

      expect(action.type).toEqual(
        StockReturnActionTypes.CREATE_ISSUE_ITEMS_SUCCESS
      );
    });

    it('should check correct type is used for CreateIssueItemsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new CreateIssueItemsFailure(payload);

      expect(action.type).toEqual(
        StockReturnActionTypes.CREATE_ISSUE_ITEMS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });
  describe('LoadCFALocationCode Action TestCases', () => {
    it('should check correct type is used for LoadCFALocationCode action ', () => {
      const action = new LoadCFALocationCode();

      expect(action.type).toEqual(
        StockReturnActionTypes.LOAD_CFA_LOCATION_CODE
      );
    });
    it('should check correct type is used for LoadCFALocationCodeSuccess action ', () => {
      const action = new LoadCFALocationCodeSuccess(cfaAddress);

      expect(action.type).toEqual(
        StockReturnActionTypes.LOAD_CFA_LOCATION_CODE_SUCCESS
      );
    });
    it('should check correct type is used for LoadCFALocationCodeFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadCFALocationCodeFailure(payload);

      expect(action.type).toEqual(
        StockReturnActionTypes.LOAD_CFA_LOCATION_CODE_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });
  describe('LoadItems Action TestCases', () => {
    it('should check correct type is used for LoadItems action ', () => {
      const action = new LoadItems(loadItems);

      expect(action.type).toEqual(StockReturnActionTypes.LOAD_ITEMS);
      expect(action.payload).toEqual(loadItems);
    });
    it('should check correct type is used for LoadItemsSuccess action ', () => {
      const action = new LoadItemSuccess({ items: stockReturnItem, count: 1 });

      expect(action.type).toEqual(StockReturnActionTypes.LOAD_ITEM_SUCCESS);
      expect(action.payload).toEqual({ items: stockReturnItem, count: 1 });
    });
    it('should check correct type is used for LoadItemFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadItemsFailure(payload);

      expect(action.type).toEqual(StockReturnActionTypes.LOAD_ITEM_FAILURE);
      expect(action.payload).toEqual(payload);
    });
  });
  describe('RemoveSelectedItems Action TestCases', () => {
    it('should check correct type is used for RemoveSelectedItems action ', () => {
      const action = new RemoveSelectedItems(removeSelectedItems);

      expect(action.type).toEqual(StockReturnActionTypes.REMOVE_SELECTED_ITEMS);
      expect(action.payload).toEqual(removeSelectedItems);
    });
    it('should check correct type is used for RemoveSelectedItemsSuccess action ', () => {
      const action = new RemoveSelectedItemsSuccess();

      expect(action.type).toEqual(
        StockReturnActionTypes.REMOVE_SELECTED_ITEMS_SUCCESS
      );
    });
    it('should check correct type is used for RemoveSelectedItemsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new RemoveSelectedItemsFailure(payload);

      expect(action.type).toEqual(
        StockReturnActionTypes.REMOVE_SELECTED_ITEMS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });
  describe('SelectedProductsSearch Action TestCases', () => {
    it('should check correct type is used for SelectedProductsSearch action ', () => {
      const action = new SelectedProductsSearch(searchItemPayload);

      expect(action.type).toEqual(
        StockReturnActionTypes.SELECTED_PRODUCTS_SEARCH
      );
      expect(action.payload).toEqual(searchItemPayload);
    });
    it('should check correct type is used for SelectedProductsSearchSuccess action ', () => {
      const action = new SelectedProdutsSearchSuccess({
        items: stockReturnItem,
        count: 1
      });

      expect(action.type).toEqual(
        StockReturnActionTypes.SELECTED_PRODUCTS_SEARCH_SUCESSS
      );
      expect(action.payload).toEqual({
        items: stockReturnItem,
        count: 1
      });
    });
    it('should check correct type is used for SelectedProductsSearchFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SelectedProductsSearchFailure(payload);

      expect(action.type).toEqual(
        StockReturnActionTypes.SELECTED_PRODUCTS_SEARCH_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });
  describe('LoadCourierDetails Action TestCases', () => {
    it('should check correct type is used for LoadCourierDetails action ', () => {
      const action = new LoadCourierDetails();

      expect(action.type).toEqual(StockReturnActionTypes.LOAD_COURIER_DETAILS);
    });
    it('should check correct type is used for LoadCourierDetailsSuccess action ', () => {
      const action = new LoadCourierDetailsSuccess(['BLUE DART']);

      expect(action.type).toEqual(
        StockReturnActionTypes.LOAD_COURIER_DETAILS_SUCCESS
      );
      expect(action.payload).toEqual(['BLUE DART']);
    });
    it('should check correct type is used for LoadCourierDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadCourierDetailsFailure(payload);

      expect(action.type).toEqual(
        StockReturnActionTypes.LOAD_COURIER_DETAILS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });
  describe('LoadHeaderLevelDetails Action TestCases', () => {
    it('should check correct type is used for LoadHeaderLevelDetails action ', () => {
      const action = new LoadHeaderLevelDetails(123);

      expect(action.type).toEqual(
        StockReturnActionTypes.LOAD_HEADER_LEVEL_DETAILS
      );
      expect(action.payload).toEqual(123);
    });
    it('should check correct type is used for LoadHeaderLevelDetailsSuccess action ', () => {
      const action = new LoadHeaderLevelDetailsSuccess(headerDetails);

      expect(action.type).toEqual(
        StockReturnActionTypes.LOAD_HEADER_LEVEL_DETAILS_SUCCESS
      );
      expect(action.payload).toEqual(headerDetails);
    });
    it('should check correct type is used for LoadHeaderLevelDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadHeaderLevelDetailsFailure(payload);

      expect(action.type).toEqual(
        StockReturnActionTypes.LOAD_HEADER_LEVEL_DETAILS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });
  describe('LoadProductGroups Action TestCases', () => {
    it('should check correct type is used for LoadProductGroups action ', () => {
      const action = new LoadProductGroups();

      expect(action.type).toEqual(StockReturnActionTypes.LOAD_PROUDCT_GROUPS);
    });
    it('should check correct type is used for LoadProductGroupsSuccess action ', () => {
      const action = new LoadProductGroupsSuccess(productGroup);

      expect(action.type).toEqual(
        StockReturnActionTypes.LOAD_PROUDCT_GROUPS_SUCCESS
      );
      expect(action.payload).toEqual(productGroup);
    });
    it('should check correct type is used for LoadProductGroupsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadProductGroupsFailure(payload);

      expect(action.type).toEqual(
        StockReturnActionTypes.LOAD_PROUDCT_GROUPS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('LoadProductCategory Action TestCases', () => {
    it('should check correct type is used for LoadProductCategory action ', () => {
      const action = new LoadProductCategories();

      expect(action.type).toEqual(
        StockReturnActionTypes.LOAD_PRODUCT_CATEGORIES
      );
    });
    it('should check correct type is used for LoadProductCategorySucces action ', () => {
      const action = new LoadProductCategoriesSuccess(productCat);

      expect(action.type).toEqual(
        StockReturnActionTypes.LOAD_PRODUCT_CATEGORIES_SUCCESS
      );
      expect(action.payload).toEqual(productCat);
    });
    it('should check correct type is used for LoadProductCategoryFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadProductCategoriesFailure(payload);

      expect(action.type).toEqual(
        StockReturnActionTypes.LOAD_PRODUCT_CATEGORIES_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('LoadEmployeeCodes Action TestCases', () => {
    it('should check correct type is used for LoadEmployeeCodes action ', () => {
      const action = new LoadEmployeeCodes();

      expect(action.type).toEqual(StockReturnActionTypes.LOAD_EMPLOYEE_CODES);
    });
    it('should check correct type is used for LoadEmployeeCodesSuccess action ', () => {
      const action = new LoadEmployeeCodesSuccess(['pna']);

      expect(action.type).toEqual(
        StockReturnActionTypes.LOAD_EMPLOYEE_CODES_SUCCESS
      );
      expect(action.payload).toEqual(['pna']);
    });
    it('should check correct type is used for LoadEmployeeCodesFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadEmployeeCodesFailure(payload);

      expect(action.type).toEqual(
        StockReturnActionTypes.LOAD_EMPLOYEE_CODES_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('LoadEmployeeDetails Action TestCases', () => {
    it('should check correct type is used for LoadEmployeeDetails action ', () => {
      const action = new LoadEmployeeDetails('123');

      expect(action.type).toEqual(StockReturnActionTypes.LOAD_EMPLOYEE_DETAILS);
    });
    it('should check correct type is used for LoadEmployeeDetailsSuccess action ', () => {
      const action = new LoadEmployeeDetailsSuccess(employeeDetails);

      expect(action.type).toEqual(
        StockReturnActionTypes.LOAD_EMPLOYEE_DETAILS_SUCCESS
      );
      expect(action.payload).toEqual(employeeDetails);
    });
    it('should check correct type is used for LoadEmployeeDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadEmployeeDetailsFailure(payload);

      expect(action.type).toEqual(
        StockReturnActionTypes.LOAD_EMPLOYEE_DETAILS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });
  describe('LoadIssueInvoiceHistory Action TestCases', () => {
    it('should check correct type is used for LoadIssueInvoiceHistory action ', () => {
      const action = new LoadIssueInvoiceHistory(historyPayload);

      expect(action.type).toEqual(
        StockReturnActionTypes.LOAD_ISSUE_INVOICE_HISTORY
      );
    });
    it('should check correct type is used for LoadIssueInvoiceHistorySuccess action ', () => {
      const action = new LoadIssueInvoiceHistorySucceess({
        requestInvoice: invoiceHistory,
        totalElements: 1
      });

      expect(action.type).toEqual(
        StockReturnActionTypes.LOAD_ISSUE_INVOICE_HISTORY_SUCCESS
      );
      expect(action.payload).toEqual({
        requestInvoice: invoiceHistory,
        totalElements: 1
      });
    });
    it('should check correct type is used for LoadIssueInvoiceHistoryFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadIssueInvoiceHistoryFailure(payload);

      expect(action.type).toEqual(
        StockReturnActionTypes.LOAD_ISSUE_INVOICE_HISTORY_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });
  describe('StoreHistoryType Action TestCases', () => {
    it('should check correct type is used for StoreHistoryType action ', () => {
      const action = new StoreHistoryType('INVOICE');

      expect(action.type).toEqual(StockReturnActionTypes.STORE_HISTORY_TYPE);
      expect(action.payload).toEqual('INVOICE');
    });
    it('should check correct type is used for StoreAdvancedFilterData action ', () => {
      const action = new StoreAdvancedFilterData(advanceFilter);

      expect(action.type).toEqual(
        StockReturnActionTypes.STORE_ADVANCED_FILTER_DATE
      );
      expect(action.payload).toEqual(advanceFilter);
    });

    it('should check correct type is used for ResetStockReturnHistory action ', () => {
      const action = new ResetStockReturnHistory();

      expect(action.type).toEqual(
        StockReturnActionTypes.RESET_STOCK_RETURN_HISTORY
      );
    });
    it('should check correct type is used for ResetStockReturnItems action ', () => {
      const action = new ResetStockReturnItems();

      expect(action.type).toEqual(
        StockReturnActionTypes.RESET_STOCK_RETURN_ITEMS
      );
    });
  });
  describe('LoadStuddedProductGroups Action TestCases', () => {
    it('should check correct type is used for LoadStuddedProductGroups action ', () => {
      const action = new LoadStuddedProductGroups();

      expect(action.type).toEqual(
        StockReturnActionTypes.LOAD_STUDDED_PRODUCT_GROUPS
      );
    });
    it('should check correct type is used for LoadStuddedProductGroupsSuccess action ', () => {
      const action = new LoadStuddedProductGroupsSuccess(['studded']);

      expect(action.type).toEqual(
        StockReturnActionTypes.LOAD_STUDDED_PRODUCT_GROUPS_SUCCESS
      );
      expect(action.payload).toEqual(['studded']);
    });

    it('should check correct type is used for LoadStuddedProductGroupsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadStuddedProductGroupsFailure(payload);

      expect(action.type).toEqual(
        StockReturnActionTypes.LOAD_STUDDED_PRODUCT_GROUPS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });
});
