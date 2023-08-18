import {
  CFAddress,
  ConfirmStockReturnPayload,
  CreateIssueItemsPayload,
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
import * as moment from 'moment';
import * as actions from './stock-return.actions';
import { initialState } from './stock-return.reducers';
import { StockReturnState } from './stock-return.state';
import { stockReturnReducer } from './stock-return.reducers';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { searchedItems } from './stock-return.selectors';
import { itemAdaptor, requestInvoiceAdaptor } from './stock-return.entity';

describe('StockReturn Reducer Testing Suite', () => {
  const testState = initialState;
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
      isLoginActive:false,
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
  describe('CreateRequestToCfa', () => {
    it('CreateRequestToCfa should return proper state', () => {
      const action = new actions.CreateRequestToCfa();

      const result: StockReturnState = stockReturnReducer(initialState, action);

      expect(result.newRequestId).toBe(null);
      expect(result.isLoading).toBe(true);
    });
    it('CreateRequestToCfaSuccess should return proper state', () => {
      const action = new actions.CreateRequestToCfaSuccess(120);

      const result: StockReturnState = stockReturnReducer(initialState, action);

      expect(result.newRequestId).toBe(120);
      expect(result.isLoading).toBe(false);
    });
    it('CreateRequestToCfaFailure should return error', () => {
      const action = new actions.CreateRequestToCfaFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: StockReturnState = stockReturnReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
    });
  });

  describe('ConfirmIssue', () => {
    it('ConfirmIssue should return proper state', () => {
      const action = new actions.ConfirmIssue(confirmIssue);

      const result: StockReturnState = stockReturnReducer(initialState, action);

      expect(result.invoiceNumber).toBe(null);
    });
    it('ConfirmIssueSuccess should return proper state', () => {
      const action = new actions.ConfirmIssueSuccess(120);

      const result: StockReturnState = stockReturnReducer(initialState, action);

      expect(result.invoiceNumber).toBe(120);
    });
    it('ConfirmIssueFailure should return error', () => {
      const action = new actions.ConfirmIssueFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: StockReturnState = stockReturnReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
    });
  });
  describe('SearchItem', () => {
    it('SearchItem should return proper state', () => {
      const action = new actions.SearchItem(searchVariantCode);

      const result: StockReturnState = stockReturnReducer(initialState, action);

      expect(result.hasSearched).toBe(true);
      expect(result.hasSearchedItem).toBe(false);
    });
    it('SearchItemSuccess should return proper state', () => {
      const response = {
        items: stockReturnItem,
        count: 1
      };
      const newState = {
        ...testState,
        items: itemAdaptor.setAll(stockReturnItem, testState.searchedItems)
      };
      const action = new actions.SearchItemSuccess(response);

      const result: StockReturnState = stockReturnReducer(newState, action);

      expect(result.hasSearched).toBe(false);
      expect(result.hasSearchedItem).toBe(true);
      expect(result.searchCount).toBe(response.count);
      expect(result.searchedItems.ids.length).toBe(response.items.length);
    });
    it('SearchItemFailure should return error', () => {
      const action = new actions.SearchItemFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: StockReturnState = stockReturnReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
      expect(result.hasSearched).toEqual(false);
      expect(result.hasSearchedItem).toEqual(false);
    });
  });

  describe('CreateIssueItems', () => {
    it('CreateIssueItems should return proper state', () => {
      const action = new actions.CreateIssueItems(createIssueItems);

      const result: StockReturnState = stockReturnReducer(initialState, action);

      expect(result.isLoading).toBe(true);
      expect(result.hasIssued).toBe(null);
    });
    it('CreateIssueItemsSuccess should return proper state', () => {
      const action = new actions.CreateIssueItemsSuccess();

      const result: StockReturnState = stockReturnReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.hasIssued).toBe(true);
    });
    it('CreateIssueItemsFailure should return error', () => {
      const action = new actions.CreateIssueItemsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: StockReturnState = stockReturnReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
      expect(result.hasIssued).toEqual(false);
    });
  });

  describe('ClearSearch', () => {
    it('ClearSearch should return proper state', () => {
      const action = new actions.ClearSearch();

      const result: StockReturnState = stockReturnReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.totalItemCount).toBe(0);
      expect(result.selectedProductsSearchCount).toBe(null);
      expect(result.invoiceNumber).toBe(null);
      expect(result.hasSearchedItem).toBe(null);
    });
  });
  describe('LoadCFALocationCode', () => {
    it('LoadCFALocationCode should return proper state', () => {
      const action = new actions.LoadCFALocationCode();

      const result: StockReturnState = stockReturnReducer(initialState, action);

      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
    });
    it('LoadCFALocationCodeSuccess should return proper state', () => {
      const action = new actions.LoadCFALocationCodeSuccess(cfaAddress);

      const result: StockReturnState = stockReturnReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.CFAddress).toBe(cfaAddress);
    });
    it('LoadCFALocationCodeFailure should return error', () => {
      const action = new actions.LoadCFALocationCodeFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: StockReturnState = stockReturnReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
    });
  });

  describe('LoadItems', () => {
    it('LoadItems should return proper state', () => {
      const action = new actions.LoadItems(loadItems);

      const result: StockReturnState = stockReturnReducer(initialState, action);

      expect(result.isLoading).toBe(true);
      expect(result.selectedProductsSearchCount).toBe(null);
    });
    it('LoadItemsSuccess should return proper state', () => {
      const newState = {
        ...testState,
        items: itemAdaptor.setAll(stockReturnItem, testState.searchedItems)
      };
      const action = new actions.LoadItemSuccess({
        items: stockReturnItem,
        count: 1
      });

      const result: StockReturnState = stockReturnReducer(newState, action);
      expect(result.isLoading).toBe(false);
      expect(result.hasLoaded).toBe(true);
      expect(result.loadedItems.ids.length).toBe(stockReturnItem.length);
      expect(result.totalItemCount).toBe(1);
    });
    it('LoadItemsFailure should return error', () => {
      const action = new actions.LoadItemsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: StockReturnState = stockReturnReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
      expect(result.hasLoaded).toEqual(false);
      expect(result.totalItemCount).toEqual(0);
    });
  });
  describe('RemoveSelectedItems', () => {
    it('RemoveSelectedItems should return proper state', () => {
      const action = new actions.RemoveSelectedItems(removeSelectedItems);

      const result: StockReturnState = stockReturnReducer(initialState, action);

      expect(result.isLoading).toBe(true);
      expect(result.hasRemovedMultipleItems).toBe(false);
    });
    it('RemoveSelectedItemsSuccess should return proper state', () => {
      const action = new actions.RemoveSelectedItemsSuccess();

      const result: StockReturnState = stockReturnReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.hasRemovedMultipleItems).toBe(true);
    });
    it('RemoveSelectedItemsFailure should return error', () => {
      const action = new actions.RemoveSelectedItemsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: StockReturnState = stockReturnReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
      expect(result.hasRemovedMultipleItems).toEqual(false);
    });
  });

  describe('SelectedProductsSearch', () => {
    it('SelectedProductsSearch should return proper state', () => {
      const action = new actions.SelectedProductsSearch(searchItemPayload);

      const result: StockReturnState = stockReturnReducer(initialState, action);

      expect(result.isLoading).toBe(true);
      expect(result.hasSelectedProductsSearch).toBe(null);
    });
    it('SelectedProductsSearchSuccess should return proper state', () => {
      const newState = {
        ...testState,
        items: itemAdaptor.setAll(stockReturnItem, testState.searchedItems)
      };
      const action = new actions.SelectedProdutsSearchSuccess({
        items: stockReturnItem,
        count: 1
      });

      const result: StockReturnState = stockReturnReducer(newState, action);

      expect(result.isLoading).toBe(false);
      //expect(result.loadedItems.ids).toBe(2);
      expect(result.selectedProductsSearchCount).toBe(1);
    });
    it('SelectedProductsSearchFailure should return error', () => {
      const action = new actions.SelectedProductsSearchFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: StockReturnState = stockReturnReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
      expect(result.hasSelectedProductsSearch).toEqual(false);
    });
  });
  describe('LoadCourierDetails', () => {
    it('LoadCourierDetails should return proper state', () => {
      const action = new actions.LoadCourierDetails();

      const result: StockReturnState = stockReturnReducer(initialState, action);

      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
    });
    it('LoadCourierDetailsSuccess should return proper state', () => {
      const response = ['BLUE DART'];
      const action = new actions.LoadCourierDetailsSuccess(response);

      const result: StockReturnState = stockReturnReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.error).toBe(null);
      expect(result.courierDetails).toBe(response);
    });
    it('LoadCourierDetailsFailure should return error', () => {
      const action = new actions.LoadCourierDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: StockReturnState = stockReturnReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
    });
  });

  describe('LoadHeaderLevelDetails', () => {
    it('LoadHeaderLevelDetails should return proper state', () => {
      const action = new actions.LoadHeaderLevelDetails(120);

      const result: StockReturnState = stockReturnReducer(initialState, action);

      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
    });
    it('LoadHeaderLevelDetailsSuccess should return proper state', () => {
      const action = new actions.LoadHeaderLevelDetailsSuccess(headerDetails);

      const result: StockReturnState = stockReturnReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.headerLevelDetails).toBe(headerDetails);
    });
    it('LoadHeaderLevelDetailsFailure should return error', () => {
      const action = new actions.LoadHeaderLevelDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: StockReturnState = stockReturnReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
    });
  });

  describe('LoadProductCategories', () => {
    it('LoadHeaderLevelDetails should return proper state', () => {
      const action = new actions.LoadProductCategories();

      const result: StockReturnState = stockReturnReducer(initialState, action);

      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
    });
    it('LoadProductCategoriesSuccess should return proper state', () => {
      const action = new actions.LoadProductCategoriesSuccess(productCat);

      const result: StockReturnState = stockReturnReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.productCategories).toBe(productCat);
      expect(result.error).toBe(null);
    });
    it('LoadProductCategoriesFailure should return error', () => {
      const action = new actions.LoadProductCategoriesFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: StockReturnState = stockReturnReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
    });
  });

  describe('LoadProductGroups', () => {
    it('LoadProductGroups should return proper state', () => {
      const action = new actions.LoadProductGroups();

      const result: StockReturnState = stockReturnReducer(initialState, action);

      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
    });
    it('LoadProductGroupsSuccess should return proper state', () => {
      const action = new actions.LoadProductGroupsSuccess(productGroup);

      const result: StockReturnState = stockReturnReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.productGroups).toBe(productGroup);
      expect(result.error).toBe(null);
    });
    it('LoadProductGroupsFailure should return error', () => {
      const action = new actions.LoadProductGroupsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: StockReturnState = stockReturnReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
    });
  });
  describe('LoadEmployeeCodes', () => {
    it('LoadEmployeeCodes should return proper state', () => {
      const action = new actions.LoadEmployeeCodes();

      const result: StockReturnState = stockReturnReducer(initialState, action);

      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
    });
    it('LoadEmployeeCodesSucess should return proper state', () => {
      const response = ['PNA'];
      const action = new actions.LoadEmployeeCodesSuccess(response);

      const result: StockReturnState = stockReturnReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.employeeCodes).toBe(response);
    });
    it('LoadEmployeeCodesFailure should return error', () => {
      const action = new actions.LoadEmployeeCodesFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: StockReturnState = stockReturnReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
    });
  });

  describe('LoadEmployeeDetails', () => {
    it('LoadEmployeeDetails should return proper state', () => {
      const action = new actions.LoadEmployeeDetails('abc123');

      const result: StockReturnState = stockReturnReducer(initialState, action);

      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
    });
    it('LoadEmployeeDetailsSuccess should return proper state', () => {
      const action = new actions.LoadEmployeeDetailsSuccess(employeeDetails);

      const result: StockReturnState = stockReturnReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.employeeDetails).toBe(employeeDetails);
    });
    it('LoadEmployeeDetailsFailure should return error', () => {
      const action = new actions.LoadEmployeeDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: StockReturnState = stockReturnReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
    });
  });

  describe('LoadIssueInvoiceHistory', () => {
    it('LoadIssueInvoiceHistory should return proper state', () => {
      const action = new actions.LoadIssueInvoiceHistory(historyPayload);

      const result: StockReturnState = stockReturnReducer(initialState, action);

      expect(result.isLoadingHistory).toBe(true);
      expect(result.error).toBe(null);
    });
    it('LoadIssueInvoiceHistorySucceess should return proper state', () => {
      const newState = {
        ...testState,
        items: requestInvoiceAdaptor.setAll(
          invoiceHistory,
          testState.invoiceHistory
        )
      };
      const action = new actions.LoadIssueInvoiceHistorySucceess({
        requestInvoice: invoiceHistory,
        totalElements: 1
      });

      const result: StockReturnState = stockReturnReducer(initialState, action);

      expect(result.isLoadingHistory).toBe(false);
      expect(result.invoiceHistory.ids.length).toBe(invoiceHistory.length);
      expect(result.totalHistoryInvoiceItems).toBe(1);
    });
    it('LoadIssueInvoiceHistoryFailure should return error', () => {
      const action = new actions.LoadIssueInvoiceHistoryFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: StockReturnState = stockReturnReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
      expect(result.isLoadingHistory).toEqual(false);
    });
  });

  describe('StoreHistoryType', () => {
    it('StoreHistoryType should return proper state', () => {
      const action = new actions.StoreHistoryType('INVOICE');

      const result: StockReturnState = stockReturnReducer(initialState, action);

      expect(result.historyType).toBe('INVOICE');
    });
    it('StoreAdvancedFilterData should return proper state', () => {
      const action = new actions.StoreAdvancedFilterData(advanceFilter);

      const result: StockReturnState = stockReturnReducer(initialState, action);

      expect(result.advancedFilter).toBe(advanceFilter);
    });
    it('ResetStockReturnHistory should return error', () => {
      const newState = {
        ...testState,
        items: requestInvoiceAdaptor.setAll(
          invoiceHistory,
          testState.invoiceHistory
        )
      };
      const action = new actions.ResetStockReturnHistory();

      const result: StockReturnState = stockReturnReducer(initialState, action);

      expect(result.totalHistoryInvoiceItems).toEqual(0);
      expect(result.invoiceHistory.ids.length).toEqual(0);
    });
    it('ResetStockReturnItems should return error', () => {
      const newState = {
        ...testState,
        items: itemAdaptor.setAll(stockReturnItem, testState.loadedItems)
      };
      const action = new actions.ResetStockReturnItems();

      const result: StockReturnState = stockReturnReducer(newState, action);

      expect(result.hasSelectedProductsSearch).toEqual(false);
      expect(result.selectedProductsSearchCount).toEqual(0);
      expect(result.loadedItems.ids.length).toEqual(0);
    });

    it('ResetAdavanceFilter should return error', () => {
      const action = new actions.ResetAdavanceFilter(123);

      const result: StockReturnState = stockReturnReducer(initialState, action);

      expect(result.advancedFilter).toEqual({
        docFromDate: moment(action.payload).startOf('day').valueOf(),
        docToDate: moment(action.payload).endOf('day').valueOf(),
        fiscalYear: null,
        invoiceNumber: null
      });
    });
  });

  describe('LoadStuddedProductGroupsSuccess', () => {
    it('LoadStuddedProductGroupsSuccess should return proper state', () => {
      const response = ['abc'];
      const action = new actions.LoadStuddedProductGroupsSuccess(response);

      const result: StockReturnState = stockReturnReducer(initialState, action);

      expect(result.studdedProductGroups).toBe(response);
    });

    it('LoadStuddedProductGroupsFailure should return error', () => {
      const action = new actions.LoadStuddedProductGroupsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: StockReturnState = stockReturnReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
    });
  });
});
