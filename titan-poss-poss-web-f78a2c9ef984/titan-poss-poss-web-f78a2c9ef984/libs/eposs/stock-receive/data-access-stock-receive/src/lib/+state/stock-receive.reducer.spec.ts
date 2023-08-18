//you should simply assert that you get the right state given the provided inputs.
import {
  StockReceiveCourierDetails,
  StockReceiveStock,
  StockReceiveLoadPendingPayload,
  CustomErrors,
  Errors,
  StockReceiveSearchPendingPayload,
  StockReceiveLoadItemsTotalCountPayload,
  StockReceiveLoadItemsTotalCountSuccessResponse,
  StockReceiveLoadItemsPayload,
  StockReceiveItem,
  StockReceiveHistoryPayload,
  StockReceiveHistory,
  BinCode,
  Lov,
  ProductGroup,
  ProductCategory,
  StockReceiveUpdateItemPayload,
  StockReceiveItemUpdate,
  StockReceiveUpdateItemFailurePayload,
  StockReceiveItemValidate,
  StockReceiveUpdateAllItemsPayload,
  StockReceiveConfirmStockReceivePayload,
  StockReceiveHistoryItem,
  StockReceiveHistoryItemsPayload,
  AdvanceFilterPayload
} from '@poss-web/shared/models';

import * as moment from 'moment';
import { Moment } from 'moment';
import * as actions from './stock-receive.actions';
import { Action } from '@ngrx/store';
import { initialState, StockReceiveReducer } from './stock-receive.reducer';
import { StockReceiveState } from './stock-receive.state';
import { itemAdapter, stockAdapter } from './stock-receive.entity';

describe('Stock Receive reducer Testing Suite', () => {
  const testState = initialState;
  const createCourier = (
    type: string,
    companyName: string,
    docketNumber: string,
    lockNumber: string,
    roadPermitNumber: string,
    employeeId: string,
    employeeMobileNumber: string,
    employeeName: string
  ): StockReceiveCourierDetails => ({
    type,
    data: {
      companyName,
      docketNumber,
      lockNumber,
      roadPermitNumber,
      employeeId,
      employeeMobileNumber,
      employeeName
    }
  });

  const createPendingSTN = (
    id: number,
    currencyCode: string,
    courierDetails: StockReceiveCourierDetails,
    courierReceivedDate: Moment,
    orderType: string,
    srcDocNo: number,
    srcDocDate: Moment,
    srcFiscalYear: number,
    srcLocationCode: string,
    status: string,
    destDocDate: Moment,
    destDocNo: number,
    destLocationCode: string,
    totalAvailableWeight: number,
    totalAvailableQuantity: number,
    totalAvailableValue: number,
    totalMeasuredQuantity: number,
    totalMeasuredValue: number,
    totalMeasuredWeight: number,
    type: string,
    weightUnit: string,
    srcLocationDescription: string,
    destLocationDescription: string,
    reasonForDelay?: string,
    remarks?: string
  ): StockReceiveStock => {
    return {
      id,
      currencyCode,
      courierDetails,
      courierReceivedDate,
      orderType,
      srcDocNo,
      srcDocDate,
      srcFiscalYear,
      srcLocationCode,
      status,
      destDocDate,
      destDocNo,
      destLocationCode,
      totalAvailableWeight,
      totalAvailableQuantity,
      totalAvailableValue,
      totalMeasuredQuantity,
      totalMeasuredValue,
      totalMeasuredWeight,
      type,
      weightUnit,
      srcLocationDescription,
      destLocationDescription,
      reasonForDelay,
      remarks
    };
  };

  const pendingSTN1 = createPendingSTN(
    1, // id:
    'INR', //currencyCode:
    createCourier(
      'R',
      'companyName',
      'docketNumber',
      'lockNumber',
      'roadPermitNumber',
      'employeeId',
      'employeeMobileNumber',
      'employeeName'
    ), //    courierDetails:
    moment(), //  courierReceivedDate:
    'P', // orderType:
    123, //srcDocNo:
    moment(), //srcDocDate:
    2020, //  srcFiscalYear:
    'URB', //srcLocationCode:
    'test', // status:
    moment(), //destDocDate:
    123, // destDocNo:
    'hnr', // destLocationCode:
    10.6, //totalAvailableWeight:
    2, //totalAvailableQuantity:
    10000, //totalAvailableValue:
    2, //totalMeasuredQuantity:
    10000, //totalMeasuredValue:
    10.6, //totalMeasuredWeight:
    '', // type:
    '', //  weightUnit:
    '', // srcLocationDescription:
    '', //destLocationDescription:
    '', //reasonForDelay?:
    '' // remarks?:
  );

  const pendingSTN2 = createPendingSTN(
    2, // id:
    'INR', //currencyCode:
    createCourier(
      '',
      'companyName',
      'docketNumber',
      'lockNumber',
      'roadPermitNumber',
      'employeeId',
      'employeeMobileNumber',
      'employeeName'
    ), //    courierDetails:
    moment(), //  courierReceivedDate:
    '', // orderType:
    123, //srcDocNo:
    moment(), //srcDocDate:
    2020, //  srcFiscalYear:
    'URB', //srcLocationCode:
    '', // status:
    moment(), //destDocDate:
    123, // destDocNo:
    'hnr', // destLocationCode:
    10.6, //totalAvailableWeight:
    2, //totalAvailableQuantity:
    10000, //totalAvailableValue:
    2, //totalMeasuredQuantity:
    10000, //totalMeasuredValue:
    10.6, //totalMeasuredWeight:
    '', // type:
    '', //  weightUnit:
    '', // srcLocationDescription:
    '', //destLocationDescription:
    '', //reasonForDelay?:
    '' // remarks?:
  );

  const createPayload = (
    pageIndex: number,
    pageSize: number
  ): StockReceiveLoadPendingPayload => ({
    pageIndex,
    pageSize
  });

  const pendingStn = createPayload(0, 100);

  const createSearchPendingPayload = (
    srcDocnumber: string,
    type: string
  ): StockReceiveSearchPendingPayload => ({
    srcDocnumber,
    type
  });

  const searchPendingPayload = createSearchPendingPayload('0', 'FAC_BTQ');

  const createLoadItemsCount = (
    storeType: string,
    type: string,
    id: number
  ): StockReceiveLoadItemsTotalCountPayload => ({
    storeType,
    type,
    id
  });
  const loadItems = createLoadItemsCount('L1', 'FAC_BTQ', 0);
  const dummyItem: StockReceiveItem = {
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
  };

  const stockReceiveHistoryPayload: StockReceiveHistoryPayload = {
    data: {
      dateRangeType: 'TODAY',
      destDocNo: 0,
      destFiscalYear: 0,
      endDate: 0,
      locationCode: 'LOC',
      srcDocNo: 0,
      srcFiscalYear: 0,
      startDate: 0,
      statuses: [],
      actionType: 'AT',
      invoiceType: 'INV'
    },
    transferType: 'TT',
    pageIndex: 0,
    pageSize: 10
  };

  const stockReceiveItemUpdate: StockReceiveItemUpdate = {
    binCode: 'test',
    binGroupCode: 'test',
    measuredWeight: 0,
    remarks: 'test',
    itemDetails: 'test'
  };

  const itemsPayload: StockReceiveLoadItemsPayload = {
    storeType: 'FAC_BTQ',
    type: 'R',
    id: 0,
    status: 'S',
    itemCode: 'I',
    lotNumber: 'L',
    pageIndex: 0,
    pageSize: 10,
    sortBy: 'S',
    sortOrder: 'S',
    filter: [
      {
        key: 'K',
        value: []
      }
    ],
    isSearchReset: false,
    isHistory: false,
    historyType: 'H'
  };

  const stockReceiveUpdateItemPayload: StockReceiveUpdateItemPayload = {
    type: 'R',
    storeType: 'FAC_BTQ',
    id: 2,
    itemId: dummyItem.id,
    newUpdate: stockReceiveItemUpdate,
    actualDetails: stockReceiveItemUpdate,
    loadItemsPayload: itemsPayload,
    loadTemsCountPayload: loadItems
  };

  const stockReceiveUpdateAllItemsPayload: StockReceiveUpdateAllItemsPayload = {
    type: 'T',
    storeType: 'ST',
    id: 1,
    data: {}
  };

  const customError: CustomErrors = {
    code: 'C',
    message: 'M',
    traceId: 'T',
    timeStamp: 'TS',
    error: {
      name: 'N',
      message: 'M',
      stack: 'S'
    }
  };

  const stockReceiveUpdateItemFailurePayload: StockReceiveUpdateItemFailurePayload = {
    itemId: 'I',
    actualDetails: {
      binCode: dummyItem.binCode,
      binGroupCode: dummyItem.binGroupCode,
      measuredWeight: dummyItem.measuredWeight,
      remarks: dummyItem.remarks,
      itemDetails: dummyItem.itemDetails
    },
    error: customError
  };

  describe('Actions should update state properly', () => {
    beforeEach(() => {});
    it('LoadPendingFactorySTNSuccess', () => {
      const pendingStnData = [pendingSTN1, pendingSTN2];
      const action = new actions.LoadPendingFactorySTNSuccess(pendingStnData);

      const result: StockReceiveState = StockReceiveReducer(testState, action);

      expect(result.isLoadingPendingFactorySTN).toBe(false);
      expect(result.pendingFactorySTN.ids.length).toBe(2);
    });

    it('LoadingPendingFactorySTN', () => {
      const action = new actions.LoadPendingFactorySTN(pendingStn);
      const result: StockReceiveState = StockReceiveReducer(testState, action);

      expect(result.isLoadingPendingFactorySTN).toBe(true);
      expect(result.error).toBe(null);
    });

    it('LoadPendingFactorySTNFailure', () => {
      const customErrorData: CustomErrors = {
        code: 'C',
        message: 'M',
        traceId: 'T',
        timeStamp: 'TS',
        error: {
          name: 'N',
          message: 'M',
          stack: 'ST'
        }
      };
      const action = new actions.LoadPendingFactorySTNFailure(customErrorData);
      const result: StockReceiveState = StockReceiveReducer(testState, action);
      expect(result.isLoadingPendingFactorySTN).toBe(false);
      expect(result.error).toEqual(customErrorData);
    });

    it('LoadPendingBoutiqueSTN', () => {
      const action = new actions.LoadPendingBoutiqueSTN(pendingStn);
      const result: StockReceiveState = StockReceiveReducer(testState, action);

      expect(result.isLoadingPendingBoutiqueSTN).toBe(true);
      expect(result.error).toBe(null);
    });

    it('LoadPendingBoutiqueSTNSuccess', () => {
      const pendingStnData = [pendingSTN1, pendingSTN2];
      const action = new actions.LoadPendingBoutiqueSTNSuccess(pendingStnData);

      const result: StockReceiveState = StockReceiveReducer(testState, action);

      expect(result.isLoadingPendingBoutiqueSTN).toBe(false);
      expect(result.pendingBoutiqueSTN.ids.length).toBe(2);
    });

    it('LoadPendingBoutiqueSTNFailure', () => {
      const action = new actions.LoadPendingBoutiqueSTNFailure(customError);
      const result: StockReceiveState = StockReceiveReducer(testState, action);
      expect(result.isLoadingPendingBoutiqueSTN).toBe(false);
      expect(result.error).toEqual(customError);
    });

    it('LoadPendingMerchandiseSTN', () => {
      const action = new actions.LoadPendingMerchandiseSTN(pendingStn);
      const result: StockReceiveState = StockReceiveReducer(testState, action);

      expect(result.isLoadingPendingMerchandiseSTN).toBe(true);
      expect(result.error).toBe(null);
    });

    it('LoadPendingMerchandiseSTNSuccess', () => {
      const pendingStnData = [pendingSTN1, pendingSTN2];
      const action = new actions.LoadPendingMerchandiseSTNSuccess(
        pendingStnData
      );
      const newState = {
        ...testState,
        pendingMerchandiseSTN: stockAdapter.setAll(
          pendingStnData,
          testState.pendingMerchandiseSTN
        )
      };
      const result: StockReceiveState = StockReceiveReducer(newState, action);

      expect(result.isLoadingPendingMerchandiseSTN).toBe(false);
      expect(result.pendingMerchandiseSTN.ids.length).toBe(2);
    });

    it('LoadPendingMerchandiseSTNFailure', () => {
      const action = new actions.LoadPendingMerchandiseSTNFailure(customError);
      const result: StockReceiveState = StockReceiveReducer(testState, action);
      expect(result.isLoadingPendingMerchandiseSTN).toBe(false);
      expect(result.error).toEqual(customError);
    });

    it('LoadPendingCFAInvoice', () => {
      const action = new actions.LoadPendingCFAInvoice(pendingStn);
      const result: StockReceiveState = StockReceiveReducer(testState, action);
      expect(result.isLoadingPendingCFAInvoice).toBe(true);
      expect(result.error).toBe(null);
    });

    it('LoadPendingCFAInvoiceSuccess', () => {
      const pendingStnData = [pendingSTN1, pendingSTN2];
      const newState: StockReceiveState = {
        ...testState,
        pendingCFAInvoice: stockAdapter.setAll(
          pendingStnData,
          testState.pendingCFAInvoice
        )
      };
      const action = new actions.LoadPendingCFAInvoiceSuccess(pendingStnData);
      const result: StockReceiveState = StockReceiveReducer(newState, action);
      expect(result.isLoadingPendingCFAInvoice).toBe(false);
      expect(result.pendingCFAInvoice.ids.length).toBe(2);
    });

    it('LoadPendingCFAInvoiceFailure', () => {
      const action = new actions.LoadPendingCFAInvoiceFailure(customError);
      const result: StockReceiveState = StockReceiveReducer(testState, action);
      expect(result.isLoadingPendingCFAInvoice).toBe(false);
      expect(result.error).toEqual(customError);
    });

    it('SearchPendingStocks', () => {
      const pendingStnData = [pendingSTN1, pendingSTN2];
      const action = new actions.SearchPendingStocks(searchPendingPayload);
      const newState = {
        ...testState,
        searchStockResults: stockAdapter.setAll(
          pendingStnData,
          testState.searchStockResults
        )
      };
      const result: StockReceiveState = StockReceiveReducer(newState, action);

      expect(result.isSearchingStocks).toBe(true);
      expect(result.hasSearchStockResults).toBe(false);
      expect(result.searchStockResults.ids.length).toBe(0);
      expect(result.error).toBe(null);
    });

    it('SearchPendingStocksSuccess', () => {
      const pendingStnData = [pendingSTN1, pendingSTN2];
      const action = new actions.SearchPendingStocksSuccess(pendingStnData);
      const newState = {
        ...testState,
        searchStockResults: stockAdapter.setAll(
          pendingStnData,
          testState.searchStockResults
        )
      };
      const result: StockReceiveState = StockReceiveReducer(newState, action);

      expect(result.isSearchingStocks).toBe(false);
      expect(result.hasSearchStockResults).toBe(true);
      expect(result.searchStockResults.ids.length).toBe(2);
    });

    it('SearchPendingStocksFailure', () => {
      const action = new actions.SearchPendingStocksFailure(customError);
      const result: StockReceiveState = StockReceiveReducer(testState, action);
      expect(result.isSearchingStocks).toBe(false);
      expect(result.error).toBe(customError);
    });

    it('SearchPendingInvoices', () => {
      const pendingStnData = [pendingSTN1, pendingSTN2];
      const action = new actions.SearchPendingInvoices(searchPendingPayload);
      const newState = {
        ...testState,
        searchInvoiceResults: stockAdapter.setAll(
          pendingStnData,
          testState.searchInvoiceResults
        )
      };
      const result: StockReceiveState = StockReceiveReducer(newState, action);

      expect(result.isSearchingInvoices).toBe(true);
      expect(result.hasSearchInvoiceResults).toBe(false);
      expect(result.searchInvoiceResults.ids.length).toBe(0);
      expect(result.error).toBe(null);
    });

    it('SearchPendingInvoicesSuccess', () => {
      const pendingStnData = [pendingSTN1, pendingSTN2];
      const action = new actions.SearchPendingInvoicesSuccess(pendingStnData);
      const newState = {
        ...testState,
        searchInvoiceResults: stockAdapter.setAll(
          pendingStnData,
          testState.searchInvoiceResults
        )
      };
      const result: StockReceiveState = StockReceiveReducer(newState, action);

      expect(result.isSearchingInvoices).toBe(false);
      expect(result.hasSearchInvoiceResults).toBe(true);
      expect(result.searchInvoiceResults.ids.length).toBe(2);
    });

    it('SearchPendingInvoicesFailure', () => {
      const action = new actions.SearchPendingInvoicesFailure(customError);
      const result: StockReceiveState = StockReceiveReducer(testState, action);
      expect(result.isSearchingInvoices).toBe(false);
      expect(result.error).toBe(customError);
    });

    it('Search clear', () => {
      const pendingStnData = [pendingSTN1, pendingSTN2];
      const action = new actions.SearchClear();
      const newState = {
        ...testState,
        searchStockResults: stockAdapter.setAll(
          pendingStnData,
          testState.searchStockResults
        ),
        searchInvoiceResults: stockAdapter.setAll(
          pendingStnData,
          testState.searchInvoiceResults
        )
      };
      const result: StockReceiveState = StockReceiveReducer(newState, action);

      expect(result.searchStockResults.ids.length).toBe(0);
      expect(result.searchInvoiceResults.ids.length).toBe(0);
      expect(result.isSearchingStocks).toBe(false);
      expect(result.isSearchingInvoices).toBe(false);
      expect(result.hasSearchStockResults).toBe(false);
      expect(result.hasSearchInvoiceResults).toBe(false);
      expect(result.error).toBe(null);
    });

    it('Clear search result', () => {
      const pendingStnData = [pendingSTN1, pendingSTN2];
      const action = new actions.ClearSearchResult();
      const newState = {
        ...testState,
        searchStockResults: stockAdapter.setAll(
          pendingStnData,
          testState.searchStockResults
        ),
        searchInvoiceResults: stockAdapter.setAll(
          pendingStnData,
          testState.searchInvoiceResults
        )
      };
      const result: StockReceiveState = StockReceiveReducer(newState, action);

      expect(result.searchStockResults.ids.length).toBe(0);
      expect(result.searchInvoiceResults.ids.length).toBe(0);
      expect(result.hasSearchStockResults).toBe(true);
      expect(result.hasSearchInvoiceResults).toBe(true);
      expect(result.error).toBe(null);
    });

    it('LoadSelectedStock', () => {
      const action = new actions.LoadSelectedStock({ id: '23SW22', type: 'R' });
      const newState: StockReceiveState = {
        ...testState,
        items: itemAdapter.addOne(dummyItem, testState.items)
      };
      const result: StockReceiveState = StockReceiveReducer(newState, action);

      expect(result.isLoadingSelectedStock).toBe(true);
      expect(result.items.ids.length).toBe(0);
      expect(result.selectedStock).toBe(null);
      expect(result.selectedInvoice).toBe(null);
      expect(result.isItemsTotalCountLoading).toBe(false);
      expect(result.isItemsTotalCountLoaded).toBe(null);
      expect(result.isItemsLoading).toBe(false);
      expect(result.isItemsLoaded).toBe(null);
      expect(result.isVerifyingAllItem).toBe(false);
      expect(result.isVerifyingAllItemSuccess).toBe(null);
      expect(result.isAssigningBinToAllItems).toBe(false);
      expect(result.isAssigningBinToAllItemsSuccess).toBe(null);
      expect(result.confirmedStock).toBe(null);
      expect(result.isConfirmStockReceiveSuccess).toBe(null);
      expect(result.isConfirmingStockReceive).toBe(false);
      expect(result.error).toBe(null);
    });

    it('LoadSelectedStockSuccess', () => {
      const pendingStnData = pendingSTN1;
      const action = new actions.LoadSelectedStockSuccess(pendingStnData);
      const result: StockReceiveState = StockReceiveReducer(testState, action);
      expect(result.isLoadingSelectedStock).toBe(false);
      expect(result.selectedStock).toEqual(pendingStnData);
    });

    it('LoadSelectedStockFailure', () => {
      const action = new actions.LoadSelectedStockFailure(customError);
      const result: StockReceiveState = StockReceiveReducer(testState, action);
      expect(action).toBeTruthy();
    });

    it('LoadSelectedInvoiceFailure', () => {
      const action = new actions.LoadSelectedInvoiceFailure(customError);
      const result: StockReceiveState = StockReceiveReducer(testState, action);
      expect(result.isSearchingInvoices).toBe(false);
      expect(result.error).toEqual(customError);
    });

    it('LoadSelectedInvoice', () => {
      const action = new actions.LoadSelectedInvoice({
        id: '23SW22',
        type: 'R'
      });
      const newState = {
        ...testState,
        items: itemAdapter.setAll([dummyItem], testState.items)
      };
      const result: StockReceiveState = StockReceiveReducer(newState, action);

      expect(result.isLoadingSelectedStock).toBe(true);
      expect(result.items.ids.length).toEqual(0);
      expect(result.selectedInvoice).toBe(null);
      expect(result.error).toBe(null);
      expect(result.selectedStock).toBe(null);
      expect(result.isItemsTotalCountLoading).toBe(false);
      expect(result.isItemsTotalCountLoaded).toBe(null);
      expect(result.isItemsLoading).toBe(false);
      expect(result.isItemsLoaded).toBe(null);
      expect(result.itemsCount).toBe(0);
      expect(result.isVerifyingAllItem).toBe(false);
      expect(result.isVerifyingAllItemSuccess).toBe(null);
      expect(result.isAssigningBinToAllItems).toBe(false);
      expect(result.isAssigningBinToAllItemsSuccess).toBe(null);
      expect(result.confirmedStock).toBe(null);
      expect(result.isConfirmStockReceiveSuccess).toBe(null);
      expect(result.isConfirmingStockReceive).toBe(false);
    });

    it('LoadSelectedInvoiceSuccess', () => {
      const pendingStnData = pendingSTN1;
      const action = new actions.LoadSelectedInvoiceSuccess(pendingStnData);

      const result: StockReceiveState = StockReceiveReducer(testState, action);

      expect(result.isLoadingSelectedStock).toBe(false);
      expect(result.selectedInvoice).toBe(pendingStnData);
    });

    it('LoadItemsTotalCount', () => {
      const action = new actions.LoadItemsTotalCount(loadItems);
      const result: StockReceiveState = StockReceiveReducer(testState, action);

      expect(result.isItemsTotalCountLoading).toBe(true);
      expect(result.isItemsTotalCountLoaded).toBe(null);
      expect(result.error).toBe(null);
    });

    it('LoadItemsTotalCountSuccess', () => {
      const items: StockReceiveLoadItemsTotalCountSuccessResponse = {
        nonVerifiedItemsTotalCount: 1,
        verifiedItemsTotalCount: 2
      };
      const action = new actions.LoadItemsTotalCountSuccess(items);

      const result: StockReceiveState = StockReceiveReducer(testState, action);
      expect(result.totalCounts.nonVerifiedItemsTotalCount).toEqual(
        items.nonVerifiedItemsTotalCount
      );
      expect(result.totalCounts.nonVerifiedItemsTotalCount).toEqual(
        items.nonVerifiedItemsTotalCount
      );
      expect(result.totalCounts.isLoaded).toEqual(true);
      expect(result.isItemsTotalCountLoading).toBe(false);
      expect(result.isItemsTotalCountLoaded).toBe(true);
    });

    it('LoadItemsTotalCountFailure', () => {
      const action = new actions.LoadItemsTotalCountFailure(customError);
      const result: StockReceiveState = StockReceiveReducer(testState, action);
      expect(result.isItemsTotalCountLoading).toBe(false);
      expect(result.isItemsTotalCountLoaded).toBe(false);
      expect(result.error).toEqual(customError);
    });

    it('LoadItems', () => {
      const itemsPayloadData: StockReceiveLoadItemsPayload = {
        storeType: 'R',
        type: 'R',
        id: 0,
        status: 'S',
        itemCode: 'C',
        lotNumber: 'L',
        pageIndex: 0,
        pageSize: 10,
        sortBy: 'S',
        sortOrder: 'S',
        filter: [
          {
            key: 'K',
            value: []
          }
        ],
        isSearchReset: false,
        isHistory: false,
        historyType: 'R'
      };
      const action = new actions.LoadItems(itemsPayloadData);
      const result: StockReceiveState = StockReceiveReducer(testState, action);

      expect(result.isItemsLoading).toBe(true);
      expect(result.isItemsLoaded).toBe(null);
      expect(result.error).toBe(null);
    });

    it('LoadItemsSuccess', () => {
      const payload = {
        items: [dummyItem],
        count: 1,
        status: 'S'
      };
      const action = new actions.LoadItemsSuccess(payload);
      const newState = {
        ...testState,
        items: itemAdapter.setAll(payload.items, testState.items)
      };
      const result: StockReceiveState = StockReceiveReducer(testState, action);
      expect(result.items.ids.length).toBe(1);
      expect(result.itemsCount).toEqual(payload.count);
      expect(result.isItemsLoading).toBe(false);
      expect(result.isItemsLoaded).toBe(true);
    });

    it('LoadItemsFailure', () => {
      const action = new actions.LoadItemsFailure(customError);
      const result: StockReceiveState = StockReceiveReducer(testState, action);
      expect(result.isItemsLoading).toBe(false);
      expect(result.isItemsLoaded).toBe(false);
      expect(result.error).toEqual(customError);
    });

    it('LoadStockReceiveHistory', () => {
      const action = new actions.LoadStockReceiveHistory(
        stockReceiveHistoryPayload
      );
      const result: StockReceiveState = StockReceiveReducer(testState, action);
      expect(result.isLoadingHistory).toEqual(true);
    });

    it('LoadStockReceiveHistorySuccess', () => {
      const pendingStnData = [pendingSTN1, pendingSTN2];
      const dummyItems: StockReceiveItem[] = [dummyItem];
      const action = new actions.LoadStockReceiveHistorySuccess({
        stocks: pendingStnData,
        count: 0
      });
      const newState = {
        ...testState,
        items: itemAdapter.setAll(dummyItems, testState.items)
      };
      const result: StockReceiveState = StockReceiveReducer(newState, action);
      expect(result.items.ids.length).toEqual(1);
      expect(result.itemsCount).toBe(0);
      expect(result.isItemsLoading).toBe(false);
      expect(result.isItemsLoaded).toBe(null);
    });

    it('LoadStockReceiveHistoryFailure', () => {
      const action = new actions.LoadStockReceiveHistoryFailure(customError);
      const result: StockReceiveState = StockReceiveReducer(testState, action);
      expect(result.isItemsLoading).toBe(false);
      expect(result.isItemsLoaded).toBe(null);
      expect(result.error).toEqual(customError);
    });

    it('LoadBinCodes', () => {
      const action = new actions.LoadBinCodes('');
      const result: StockReceiveState = StockReceiveReducer(testState, action);
      expect(result.isLoadingBinGroups).toBe(true);
      expect(result.error).toEqual(null);
    });

    it('LoadBinCodesSuccess', () => {
      const payload: BinCode[] = [
        {
          binCode: 'C',
          description: 'DES'
        }
      ];
      const action = new actions.LoadBinCodesSuccess(payload);
      const result: StockReceiveState = StockReceiveReducer(testState, action);
      expect(result.binCodes).toEqual(payload);
      expect(result.isLoadingBinGroups).toEqual(false);
    });

    it('LoadBinCodesFailure', () => {
      const action = new actions.LoadBinCodesFailure(customError);
      const result: StockReceiveState = StockReceiveReducer(testState, action);
      expect(result.isLoadingBinGroups).toBe(false);
      expect(result.error).toEqual(customError);
    });

    it('LoadRemarks', () => {
      const action = new actions.LoadRemarks();
      const result: StockReceiveState = StockReceiveReducer(testState, action);
      expect(result.error).toBe(null);
      expect(result.isLoadingRemarks).toEqual(true);
    });

    it('LoadRemarksSuccess', () => {
      const payload: Lov[] = [
        {
          code: 'C',
          isActive: true,
          value: 'VAL'
        }
      ];
      const action = new actions.LoadRemarksSuccess(payload);
      const result: StockReceiveState = StockReceiveReducer(testState, action);
      expect(result.remarks).toBe(payload);
      expect(result.isLoadingRemarks).toEqual(false);
    });

    it('LoadRemarksFailure', () => {
      const action = new actions.LoadRemarksFailure(customError);
      const result: StockReceiveState = StockReceiveReducer(testState, action);
      expect(result.error).toEqual(customError);
      expect(result.isLoadingRemarks).toEqual(false);
    });

    it('LoadProductGroups', () => {
      const action = new actions.LoadProductGroups();
      const result: StockReceiveState = StockReceiveReducer(testState, action);
      expect(result.error).toEqual(null);
      expect(result.isLoadingProductGroups).toEqual(true);
    });

    it('LoadProductGroupsSuccess', () => {
      const payload: ProductGroup[] = [
        {
          description: 'DES',
          productGroupCode: 'C'
        }
      ];
      const action = new actions.LoadProductGroupsSuccess(payload);
      const result: StockReceiveState = StockReceiveReducer(testState, action);
      expect(result.productGroups).toEqual(payload);
      expect(result.isLoadingProductGroups).toEqual(false);
    });

    it('LoadProductGroupsFailure', () => {
      const action = new actions.LoadProductGroupsFailure(customError);
      const result: StockReceiveState = StockReceiveReducer(testState, action);
      expect(result.error).toEqual(customError);
      expect(result.isLoadingProductGroups).toEqual(false);
    });

    it('LoadStuddedProductGroupsSuccess', () => {
      const action = new actions.LoadStuddedProductGroupsSuccess([
        'stone',
        'diamond'
      ]);
      const result: StockReceiveState = StockReceiveReducer(testState, action);
      expect(result.studdedProductGroups).toEqual(['stone', 'diamond']);
    });

    it('LoadStuddedProductGroupsFailure', () => {
      const action = new actions.LoadStuddedProductGroupsFailure(customError);
      const result: StockReceiveState = StockReceiveReducer(testState, action);
      expect(result.error).toEqual(customError);
    });

    it('LoadProductCategories', () => {
      const action = new actions.LoadProductCategories();
      const result: StockReceiveState = StockReceiveReducer(testState, action);
      expect(result.error).toEqual(null);
      expect(result.isLoadingProductCategories).toEqual(true);
    });

    it('LoadProductCategoriesSuccess', () => {
      const payload: ProductCategory[] = [
        {
          description: 'DES',
          productCategoryCode: 'C'
        }
      ];
      const action = new actions.LoadProductCategoriesSuccess(payload);
      const result: StockReceiveState = StockReceiveReducer(testState, action);
      expect(result.productCategories).toEqual(payload);
      expect(result.isLoadingProductCategories).toEqual(false);
    });

    it('LoadProductCategoriesFailure', () => {
      const action = new actions.LoadProductCategoriesFailure(customError);
      const result: StockReceiveState = StockReceiveReducer(testState, action);
      expect(result.error).toEqual(customError);
      expect(result.isLoadingProductCategories).toEqual(false);
    });

    it('ResetError', () => {
      const action = new actions.ResetError();
      const result: StockReceiveState = StockReceiveReducer(testState, action);
      expect(result.error).toEqual(null);
    });

    it('ClearItems', () => {
      const action = new actions.ClearItems();
      const newState = {
        ...testState,
        items: itemAdapter.setAll([dummyItem], testState.items)
      };
      const result: StockReceiveState = StockReceiveReducer(newState, action);
      expect(result.items.ids.length).toEqual(0);
    });

    it('ResetSearch', () => {
      const action = new actions.ResetSearch(false);
      const result: StockReceiveState = StockReceiveReducer(testState, action);
      expect(result.searchReset.reset).toEqual(false);
    });

    // xit('ResetSearch', () => {
    //   const action = new actions.ResetSearch(false);
    //   const result: StockReceiveState = StockReceiveReducer(
    //     testState,
    //     action
    //   );
    //   expect(result.searchReset).toEqual(false);
    // });

    // xit('ResetSearch', () => {
    //   const action = new actions.ResetSearch(false);
    //   const result: StockReceiveState = StockReceiveReducer(
    //     testState,
    //     action
    //   );
    //   expect(result.searchReset).toEqual(false);
    // });

    // xit('ResetSearch', () => {
    //   const action = new actions.ResetSearch(false);
    //   const result: StockReceiveState = StockReceiveReducer(
    //     testState,
    //     action
    //   );
    //   expect(result.searchReset).toEqual(false);
    // });

    // xit('ResetSearch', () => {
    //   const action = new actions.ResetSearch(false);
    //   const result: StockReceiveState = StockReceiveReducer(
    //     testState,
    //     action
    //   );
    //   expect(result.searchReset).toEqual(false);
    // });

    it('LoadStockReceiveInvoiceHistory', () => {
      const action = new actions.LoadStockReceiveInvoiceHistory(
        stockReceiveHistoryPayload
      );
      const result: StockReceiveState = StockReceiveReducer(testState, action);
      expect(result.isLoadingHistory).toEqual(true);
    });

    it('LoadStockReceiveInvoiceHistorySuccess', () => {
      const pendingStnData = [pendingSTN1, pendingSTN2];
      const action = new actions.LoadStockReceiveInvoiceHistorySuccess({
        stocks: pendingStnData,
        count: 2
      });
      const newState = {
        ...testState,
        stockReceiveHistory: stockAdapter.setAll(
          pendingStnData,
          testState.stockReceiveHistory
        )
      };
      const result: StockReceiveState = StockReceiveReducer(newState, action);
      expect(result.stockReceiveHistory.ids.length).toEqual(2);
      expect(result.isLoadingHistory).toEqual(false);
      expect(result.totalElements).toEqual(2);
    });

    it('LoadStockReceiveInvoiceHistoryFailure', () => {
      const action = new actions.LoadStockReceiveInvoiceHistoryFailure(
        customError
      );
      const result: StockReceiveState = StockReceiveReducer(testState, action);
      expect(result.isLoadingHistory).toEqual(false);
      expect(result.error).toEqual(customError);
    });

    it('VerifyItem', () => {
      const action = new actions.VerifyItem(stockReceiveUpdateItemPayload);
      const newState = {
        ...testState,
        items: itemAdapter.addOne(dummyItem, testState.items)
      };
      const result: StockReceiveState = StockReceiveReducer(newState, action);
      const updatedItem = result.items.entities[dummyItem.id];
      expect(updatedItem.binCode).toEqual(
        stockReceiveUpdateItemPayload.newUpdate.binCode
      );
      expect(updatedItem.binGroupCode).toEqual(
        stockReceiveUpdateItemPayload.newUpdate.binGroupCode
      );
      expect(updatedItem.measuredWeight).toEqual(
        stockReceiveUpdateItemPayload.newUpdate.measuredWeight
      );
      expect(updatedItem.remarks).toEqual(
        stockReceiveUpdateItemPayload.newUpdate.remarks
      );
      expect(result.error).toBe(null);
      expect(result.verifyItemSuccess).toBe(null);
    });

    it('VerifyItemSuccess', () => {
      const action = new actions.VerifyItemSuccess(dummyItem);
      const result: StockReceiveState = StockReceiveReducer(testState, action);
      expect(result.verifyItemSuccess).toEqual(true);
    });

    it('VerifyItemFailure', () => {
      const action = new actions.VerifyItemFailure(
        stockReceiveUpdateItemFailurePayload
      );
      const newState = {
        ...testState,
        items: itemAdapter.addOne(dummyItem, testState.items)
      };
      const result: StockReceiveState = StockReceiveReducer(newState, action);
      const updatedItem = result.items.entities[dummyItem.id];
      expect(updatedItem.binCode).toEqual(
        stockReceiveUpdateItemFailurePayload.actualDetails.binCode
      );
      expect(updatedItem.binGroupCode).toEqual(
        stockReceiveUpdateItemFailurePayload.actualDetails.binGroupCode
      );
      expect(updatedItem.measuredWeight).toEqual(
        stockReceiveUpdateItemFailurePayload.actualDetails.measuredWeight
      );
      expect(updatedItem.remarks).toEqual(
        stockReceiveUpdateItemFailurePayload.actualDetails.remarks
      );
      expect(result.verifyItemSuccess).toEqual(false);
      expect(result.error).toEqual(customError);
    });

    it('UpdateItem', () => {
      const action = new actions.UpdateItem(stockReceiveUpdateItemPayload);
      const newState = {
        ...testState,
        items: itemAdapter.addOne(dummyItem, testState.items)
      };
      const result: StockReceiveState = StockReceiveReducer(newState, action);
      const updatedItem = result.items.entities[dummyItem.id];
      expect(updatedItem.binCode).toEqual(
        stockReceiveUpdateItemPayload.newUpdate.binCode
      );
      expect(updatedItem.binGroupCode).toEqual(
        stockReceiveUpdateItemPayload.newUpdate.binGroupCode
      );
      expect(updatedItem.measuredWeight).toEqual(
        stockReceiveUpdateItemPayload.newUpdate.measuredWeight
      );
      expect(updatedItem.remarks).toEqual(
        stockReceiveUpdateItemPayload.newUpdate.remarks
      );
      expect(updatedItem.isUpdating).toBe(true);
      expect(updatedItem.isUpdatingSuccess).toBe(null);
      expect(updatedItem.isValidatingSuccess).toBe(null);
    });

    it('UpdateItemSuccess', () => {
      const action = new actions.UpdateItemSuccess(dummyItem);
      const newState = {
        ...testState,
        items: itemAdapter.addOne(dummyItem, testState.items)
      };
      const result: StockReceiveState = StockReceiveReducer(newState, action);
      const updatedItem = result.items.entities[dummyItem.id];
      expect(updatedItem.isUpdating).toEqual(false);
      expect(updatedItem.isUpdatingSuccess).toEqual(true);
      expect(result.updateItemSuccess).toEqual(true);
    });

    it('UpdateItemFailure', () => {
      const action = new actions.UpdateItemFailure(
        stockReceiveUpdateItemFailurePayload
      );
      const newState = {
        ...testState,
        items: itemAdapter.addOne(dummyItem, testState.items)
      };
      const result: StockReceiveState = StockReceiveReducer(newState, action);
      const updatedItem = result.items.entities[dummyItem.id];
      expect(updatedItem.binCode).toEqual(
        stockReceiveUpdateItemFailurePayload.actualDetails.binCode
      );
      expect(updatedItem.binGroupCode).toEqual(
        stockReceiveUpdateItemFailurePayload.actualDetails.binGroupCode
      );
      expect(updatedItem.measuredWeight).toEqual(
        stockReceiveUpdateItemFailurePayload.actualDetails.measuredWeight
      );
      expect(updatedItem.remarks).toEqual(
        stockReceiveUpdateItemFailurePayload.actualDetails.remarks
      );
      expect(updatedItem.isUpdating).toEqual(false);
      expect(updatedItem.isUpdatingSuccess).toEqual(null);
      expect(result.error).toBe(customError);
      expect(result.updateItemSuccess).toBe(false);
    });

    it('ValidateItem', () => {
      const stockReceiveItemValidate: StockReceiveItemValidate = {
        itemId: dummyItem.id,
        productGroupCode: 'C',
        availableWeight: 1,
        measuredWeight: 1,
        measuredQuantity: 1,
        availableQuantity: 1
      };
      const action = new actions.ValidateItem(stockReceiveItemValidate);
      const newState = {
        ...testState,
        items: itemAdapter.addOne(dummyItem, testState.items)
      };
      const result: StockReceiveState = StockReceiveReducer(newState, action);
      const validatedItem = result.items.entities[dummyItem.id];
      expect(validatedItem.isValidating).toEqual(true);
      expect(validatedItem.isValidatingSuccess).toEqual(null);
      expect(validatedItem.isValidatingError).toEqual(false);
      expect(result.error).toEqual(null);
    });

    it('ValidateItemSuccess', () => {
      const payload = {
        itemId: dummyItem.id,
        isSuccess: true
      };
      const action = new actions.ValidateItemSuccess(payload);
      const newState = {
        ...testState,
        items: itemAdapter.addOne(dummyItem, testState.items)
      };
      const result: StockReceiveState = StockReceiveReducer(newState, action);

      const validatedItem = result.items.entities[dummyItem.id];
      expect(validatedItem.isValidating).toEqual(false);
      expect(validatedItem.isValidatingSuccess).toEqual(payload.isSuccess);
    });

    it('ValidateItemFailure', () => {
      const payload = {
        itemId: dummyItem.id,
        error: customError
      };
      const action = new actions.ValidateItemFailure(payload);
      const newState = {
        ...testState,
        items: itemAdapter.addOne(dummyItem, testState.items)
      };
      const result: StockReceiveState = StockReceiveReducer(newState, action);

      const validatedItem = result.items.entities[dummyItem.id];
      expect(validatedItem.isValidatingError).toEqual(true);
      expect(validatedItem.isValidating).toEqual(false);
      expect(result.error).toEqual(customError);
    });

    it('VerifyAllItems', () => {
      const action = new actions.VerifyAllItems(
        stockReceiveUpdateAllItemsPayload
      );
      const result: StockReceiveState = StockReceiveReducer(testState, action);
      expect(result.error).toEqual(null);
      expect(result.isVerifyingAllItem).toEqual(true);
      expect(result.isVerifyingAllItemSuccess).toEqual(null);
    });

    it('VerifyAllItemsSuccess', () => {
      const action = new actions.VerifyAllItemsSuccess(true);
      const newState = {
        ...testState,
        items: itemAdapter.setAll([dummyItem], testState.items)
      };
      const result: StockReceiveState = StockReceiveReducer(newState, action);

      expect(result.items.ids.length).toEqual(0);
      expect(result.isVerifyingAllItem).toEqual(false);
      expect(result.isVerifyingAllItemSuccess).toEqual(true);
    });

    it('VerifyAllItemsFailure', () => {
      const action = new actions.VerifyAllItemsFailure(customError);
      const result: StockReceiveState = StockReceiveReducer(testState, action);
      expect(result.error).toEqual(customError);
      expect(result.isVerifyingAllItem).toEqual(false);
      expect(result.isVerifyingAllItemSuccess).toEqual(false);
    });

    it('AssignBinToAllItems', () => {
      const action = new actions.AssignBinToAllItems(
        stockReceiveUpdateAllItemsPayload
      );
      const result: StockReceiveState = StockReceiveReducer(testState, action);

      expect(result.error).toEqual(null);
      expect(result.isAssigningBinToAllItems).toEqual(true);
      expect(result.isAssigningBinToAllItemsSuccess).toEqual(null);
    });

    it('AssignBinToAllItemsSuccess', () => {
      const action = new actions.AssignBinToAllItemsSuccess(true);
      const result: StockReceiveState = StockReceiveReducer(testState, action);

      expect(result.isAssigningBinToAllItems).toEqual(false);
      expect(result.isAssigningBinToAllItemsSuccess).toEqual(true);
    });

    it('AssignBinToAllItemsFailure', () => {
      const action = new actions.AssignBinToAllItemsFailure(customError);
      const result: StockReceiveState = StockReceiveReducer(testState, action);

      expect(result.error).toEqual(customError);
      expect(result.isAssigningBinToAllItems).toEqual(false);
      expect(result.isAssigningBinToAllItemsSuccess).toEqual(false);
    });

    it('ConfirmStockReceive', () => {
      const payload: StockReceiveConfirmStockReceivePayload = {
        type: 'R',
        storeType: 'R',
        id: 1,
        confirmReceive: {
          remarks: 'remark'
        }
      };
      const action = new actions.ConfirmStockReceive(payload);
      const result: StockReceiveState = StockReceiveReducer(testState, action);

      expect(result.confirmedStock).toEqual(null);
      expect(result.isConfirmStockReceiveSuccess).toEqual(null);
      expect(result.isConfirmingStockReceive).toEqual(true);
      expect(result.error).toEqual(null);
    });

    it('ConfirmStockReceiveSuccess', () => {
      const pendingStnData = [pendingSTN1, pendingSTN2];
      const payload: any = {};
      const action = new actions.ConfirmStockReceiveSuccess(payload);
      const newState = {
        ...testState,
        pendingFactorySTN: stockAdapter.setAll(
          pendingStnData,
          testState.pendingFactorySTN
        ),
        pendingBoutiqueSTN: stockAdapter.setAll(
          pendingStnData,
          testState.pendingBoutiqueSTN
        ),
        pendingCFAInvoice: stockAdapter.setAll(
          pendingStnData,
          testState.pendingCFAInvoice
        ),
        pendingMerchandiseSTN: stockAdapter.setAll(
          pendingStnData,
          testState.pendingMerchandiseSTN
        )
      };
      const result: StockReceiveState = StockReceiveReducer(newState, action);

      expect(result.isConfirmStockReceiveSuccess).toEqual(true);
      expect(result.isConfirmingStockReceive).toEqual(false);
      expect(result.pendingFactorySTN.ids.length).toEqual(0);
      expect(result.pendingBoutiqueSTN.ids.length).toEqual(0);
      expect(result.pendingCFAInvoice.ids.length).toEqual(0);
      expect(result.pendingMerchandiseSTN.ids.length).toEqual(0);
    });

    it('ConfirmStockReceiveFailure', () => {
      const action = new actions.ConfirmStockReceiveFailure(customError);
      const result: StockReceiveState = StockReceiveReducer(testState, action);

      expect(result.error).toEqual(customError);
      expect(result.isConfirmStockReceiveSuccess).toEqual(false);
      expect(result.isConfirmingStockReceive).toEqual(false);
    });

    it('ClearStocks', () => {
      const pendingStnData = [pendingSTN1, pendingSTN2];
      const action = new actions.ClearStocks();
      const newState = {
        ...testState,
        pendingFactorySTN: stockAdapter.setAll(
          pendingStnData,
          testState.pendingFactorySTN
        ),
        pendingBoutiqueSTN: stockAdapter.setAll(
          pendingStnData,
          testState.pendingBoutiqueSTN
        ),
        pendingCFAInvoice: stockAdapter.setAll(
          pendingStnData,
          testState.pendingCFAInvoice
        ),
        pendingMerchandiseSTN: stockAdapter.setAll(
          pendingStnData,
          testState.pendingMerchandiseSTN
        )
      };
      const result: StockReceiveState = StockReceiveReducer(newState, action);

      expect(result.isConfirmStockReceiveSuccess).toEqual(null);
      expect(result.isConfirmingStockReceive).toEqual(false);
      expect(result.pendingFactorySTN.ids.length).toEqual(0);
      expect(result.pendingBoutiqueSTN.ids.length).toEqual(0);
      expect(result.pendingCFAInvoice.ids.length).toEqual(0);
      expect(result.pendingMerchandiseSTN.ids.length).toEqual(0);
    });

    it('ResetStockReceiveHistory', () => {
      const pendingStnData = [pendingSTN1, pendingSTN2];
      const action = new actions.ResetStockReceiveHistory();
      const newState = {
        ...testState,
        stockReceiveHistory: stockAdapter.setAll(
          pendingStnData,
          testState.stockReceiveHistory
        )
      };
      const result: StockReceiveState = StockReceiveReducer(newState, action);
      expect(result.stockReceiveHistory.ids.length).toEqual(0);
      expect(result.totalElements).toEqual(0);
    });

    it('LoadStockReceiveHistoryItems', () => {
      const payload: StockReceiveHistoryItemsPayload = {
        StockReceiveHistoryItem: {
          binCodes: 'B',
          binGroupCode: 'C',
          itemCode: 'C',
          lotNumber: 'L',
          productCategories: 'PC',
          productGroups: 'PG',
          statuses: 'S'
        },
        pageIndex: 1,
        pageSize: 1,
        id: '23SW22',
        isL1L2Store: false,
        isL3Store: true,
        sort: [],
        sortOrder: 'S',
        historyAPIType: 'TEST'
      };
      const action = new actions.LoadStockReceiveHistoryItems(payload);
      const result: StockReceiveState = StockReceiveReducer(testState, action);

      expect(result.isItemsLoading).toBe(true);
      expect(result.isItemsLoaded).toBe(null);
      expect(result.error).toBe(null);
    });

    it('LoadStockReceiveHistoryItemsSuccess', () => {
      const payload = {
        items: [dummyItem],
        count: 1
      };
      const action = new actions.LoadStockReceiveHistoryItemsSuccess(payload);
      const newState = {
        ...testState,
        items: itemAdapter.setAll(payload.items, testState.items)
      };
      const result: StockReceiveState = StockReceiveReducer(testState, action);
      expect(result.items.ids.length).toBe(1);
      expect(result.itemsCount).toEqual(payload.count);
      expect(result.isItemsLoading).toBe(false);
      expect(result.isItemsLoaded).toBe(true);
    });

    it('LoadStockReceiveHistoryItemsFailure', () => {
      const action = new actions.LoadStockReceiveHistoryItemsFailure(
        customError
      );
      const result: StockReceiveState = StockReceiveReducer(testState, action);
      expect(result.isItemsLoading).toBe(false);
      expect(result.isItemsLoaded).toBe(false);
      expect(result.error).toEqual(customError);
    });

    it('StoreHistoryType', () => {
      const action = new actions.StoreHistoryType('');
      const result: StockReceiveState = StockReceiveReducer(testState, action);
      expect(result.historyType).toEqual('');
    });

    it('StoreAdvancedFilterData', () => {
      const payload: AdvanceFilterPayload = {
        docFromDate: 1,
        docToDate: 2,
        stnNumber: 3,
        sourceLocationCode: 'A',
        fiscalYear: 'Y',
        docNumber: 'D'
      };
      const action = new actions.StoreAdvancedFilterData(payload);
      const result: StockReceiveState = StockReceiveReducer(testState, action);

      expect(result.advancedFilter).toEqual(payload);
    });
  });
});
