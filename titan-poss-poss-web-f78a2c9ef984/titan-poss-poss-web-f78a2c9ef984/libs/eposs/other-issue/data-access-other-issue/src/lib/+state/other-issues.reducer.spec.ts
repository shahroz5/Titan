import {
  AdjustmentSearchItemPayload,
  AdjustmentSearchItemPayloadSuccess,
  CancelOtherRequestPayload,
  ConfirmOtherStockIssuePayload,
  ConfirmOtherStockIssueResponse,
  CourierDetailsOtherIssue,
  CreateOtherIssueStockRequestItemsPayload,
  CreateOtherStockIssueItemsPayload,
  CreateStockRequestAdjustmentPayload,
  CustomErrors,
  LoadAllOtherIssuePayload,
  LoadOtherIssueCreateItemsTotalCountPayload,
  LoadOtherIssueCreateItemsTotalCountSuccessPayload,
  LoadOtherIssueHistoryItemsPayload,
  LoadOtherIssueHistoryPayload,
  LoadOtherIssuesItemPayload,
  LoadOtherIssuesSTNCountPayload,
  OtherDetails,
  OtherIssuedataModel,
  OtherIssueLoadListItemsPayload,
  OtherIssueLoadSelectedPayload,
  OtherIssueModel,
  OtherIssuesCreateStockResponse,
  OtherIssuesCreateStockResponsePayload,
  OtherIssueSearchPendingPayload,
  OtherIssuesHistoryItem,
  OtherIssuesItem,
  OtherReceiptsIssuesAdvanceFilterPayload,
  PrintOtherIssuePayload,
  ProductCategory,
  ProductGroup,
  PSVSearchItemPayload,
  PSVSearchItemPayloadSuccess,
  RemoveCartItemPSVPayload,
  RemoveOtherIssueStockRequestItemsPayload,
  RequestOtherIssueStockTransferNote,
  SearchCartItemPSVPayload,
  UpdateCartItemAdjustmentPayload,
  UpdateStockRequestItemPayload,
  UpdateStockRequestPayload
} from '@poss-web/shared/models';
import * as moment from 'moment';
import {
  LoadOtherIssueHistory,
  LoadOtherIssueHistorySuccess,
  LoadOtherIssueHistoryFailure,
  LoadIssuesSTNCount
} from './other-issues.actions';
import { OtherIssuesState } from './other-issues.state';
import { otherIssuesReducer, initialState } from './other-issues.reducer';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import * as actions from './other-issues.actions';

describe('Other issues Reducer Testing Suite', () => {
  const createHistorySTN = (
    id: number,
    srcLocationCode: string,
    destLocationCode: string,
    status: string,
    weightUnit: string,
    currencyCode: string,
    reqDocNo: number,
    reqDocDate: moment.Moment,
    reqLocationCode: string,
    requestType: string,
    carrierDetails: CourierDetailsOtherIssue,
    destDocDate: moment.Moment,
    destDocNo: number,
    orderType: string,
    otherDetails: OtherDetails,
    srcDocDate: moment.Moment,
    srcDocNo: number,
    srcFiscalYear: number,
    totalAvailableQuantity: number,
    totalAvailableValue: number,
    totalAvailableWeight: number,
    totalMeasuredQuantity: number,
    totalMeasuredValue: number,
    totalMeasuredWeight: number,
    remarks?: string
  ): OtherIssueModel => {
    return {
      id,
      srcLocationCode,
      destLocationCode,
      status,
      weightUnit,
      currencyCode,
      reqDocNo,
      reqDocDate,
      reqLocationCode,
      requestType,
      carrierDetails,
      destDocDate,
      destDocNo,
      orderType,
      otherDetails,
      srcDocDate,
      srcDocNo,
      srcFiscalYear,
      totalAvailableQuantity,
      totalAvailableValue,
      totalAvailableWeight,
      totalMeasuredQuantity,
      totalMeasuredValue,
      totalMeasuredWeight,
      remarks
    };
  };
  const historySTN1 = createHistorySTN(
    1,
    'srcLocationCode1',
    'destLocationCode1',
    'ISSUED',
    'gms',
    'INR',
    1001,
    moment(),
    'reqLocationCode1',
    '',
    null,
    moment(),
    2001,
    null,
    null,
    moment(),
    3003,
    2019,
    1,
    1000,
    10,
    1,
    1000,
    10,
    'remarks'
  );
  const historySTN2 = createHistorySTN(
    2,
    'srcLocationCode2',
    'destLocationCode2',
    'ISSUED',
    'gms',
    'INR',
    2001,
    moment(),
    'reqLocationCode2',
    '',
    null,
    moment(),
    2222,
    null,
    null,
    moment(),
    33333,
    2019,
    2,
    2000,
    20,
    2,
    2000,
    20,
    'remarks'
  );

  const createItemList = (
    id: number,
    itemCode: string,
    lotNumber: string,
    productCategory: string,
    productCategoryDesc: string,
    productGroup: string,
    productGroupDesc: string,
    binCode: string,
    binGroupCode: string,
    orderType: string,
    itemValue: number,
    itemWeight: number,
    totalQuantity: number,
    totalValue: number,
    totalWeight: number,
    currencyCode: string,
    weightUnit: string,
    mfgDate: moment.Moment,
    status: string,
    imageURL: string,
    itemDetails: {},
    approvedQuantity: number,
    issuedQuantity: number,
    requestedQuantity: number,
    isUpdating: boolean,
    isUpdatingSuccess: boolean,
    totalElements: number,
    inventoryId: number,
    measuredWeight: number,
    measuredValue: number,
    measuredQuantity: number,
    availableQuantity: number,
    availableValue: number,
    availableWeight: number,
    stdWeight: number,
    stdValue: number,
    isStudded: boolean
  ): OtherIssuesHistoryItem => {
    return {
      id,
      itemCode,
      lotNumber,
      productCategory,
      productCategoryDesc,
      productGroup,
      productGroupDesc,
      binCode,
      binGroupCode,
      orderType,
      itemValue,
      itemWeight,
      totalQuantity,
      totalValue,
      totalWeight,
      currencyCode,
      weightUnit,
      mfgDate,
      status,
      imageURL,
      itemDetails,
      approvedQuantity,
      issuedQuantity,
      requestedQuantity,
      isUpdating,
      isUpdatingSuccess,
      totalElements,
      inventoryId,
      measuredWeight,
      measuredValue,
      measuredQuantity,
      availableQuantity,
      availableValue,
      availableWeight,
      stdWeight,
      stdValue,
      isStudded
    };
  };

  const item1 = createItemList(
    1,
    '111AAA1111BB11',
    '10000AB1',
    'productCategory',
    'productCategoryDesc',
    'productGroup',
    'productGroupDesc',
    'binCode',
    'binGroupCode',
    null,
    1000,
    10,
    1,
    1000,
    10,
    'INR',
    'gms',
    moment(),
    'status',
    'url',
    {},
    1,
    1,
    1,
    false,
    true,
    10,
    11111,
    10,
    1000,
    1,
    1,
    1000,
    10,
    10,
    1000,
    true
  );
  const item2 = createItemList(
    2,
    '222AAA2222BB22',
    '20000AB2',
    'productCategory',
    'productCategoryDesc',
    'productGroup',
    'productGroupDesc',
    'binCode',
    'binGroupCode',
    null,
    2000,
    20,
    2,
    2000,
    20,
    'INR',
    'gms',
    moment(),
    'status',
    'url',
    {},
    2,
    2,
    2,
    false,
    true,
    20,
    22222,
    20,
    2000,
    2,
    2,
    2000,
    20,
    20,
    2000,
    true
  );

  const historySTNArray = [historySTN1, historySTN2];
  const historyItemsArray = [item1, item2];

  const dummyIssueCount: LoadOtherIssuesSTNCountPayload = {
    countData: [{ type: '', count: 0 }],
    pendingOtherIssuesSTNCount: 0
  };

  const dummmyIssueList: OtherIssuedataModel = {
    issueData: [
      {
        id: 4966,
        srcLocationCode: 'URB',
        destLocationCode: 'URB',
        status: 'APPROVED',
        weightUnit: 'gms',
        currencyCode: 'INR',
        srcDocNo: null,
        srcFiscalYear: null,
        srcDocDate: null,
        destDocNo: null,
        destDocDate: null,
        orderType: null,
        totalAvailableQuantity: 2,
        totalMeasuredQuantity: null,
        totalAvailableValue: 1264123.12,
        totalMeasuredValue: 0,
        totalAvailableWeight: 47.483,
        totalMeasuredWeight: null,
        reqDocDate: moment(1592288081939),
        reqDocNo: 48,
        reqLocationCode: 'URB',
        requestType: 'EXH',
        otherDetails: {
          type: 'approval',
          data: {
            approvalCode: '444',
            approvedBy: 're'
          }
        },
        carrierDetails: {
          type: 'address_exh',
          data: {
            address1: 'ff',
            address2: 'ff',
            city: 'banglore',
            town: 'kar',
            Designation: '',
            contactNo: 8105391994,
            emailId: '',
            employeeId: '',
            employeeName: '',
            pinCode: '123456'
          }
        }
      }
    ],
    totalElements: 1
  };

  const dummyCreateIssue: OtherIssueModel = {
    id: 5260,
    srcLocationCode: 'URB',
    destLocationCode: 'URB',
    status: 'APVL_PENDING',
    weightUnit: 'gms',
    currencyCode: 'INR',
    carrierDetails: null,
    otherDetails: null,
    reqLocationCode: null,
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
    totalMeasuredWeight: 321.9,
    reqDocNo: 517,
    reqDocDate: moment(1600692426386),
    requestType: 'FOC'
  };

  const dummyLoadIssue: RequestOtherIssueStockTransferNote = {
    currencyUnit: '',
    destLocationCode: '',
    id: 1,
    reqDocDate: moment(),
    reqDocNo: 1,
    reqLocationCode: '',
    requestType: '',
    srcLocationCode: '',
    status: '',
    totalAvailableQuantity: 1,
    totalAvailableValue: 1,
    totalAvailableWeight: 1,
    totalQuantity: 1,
    totalValue: 1,
    totalWeight: 1,
    weightUnit: '',
    carrierDetails: null,
    otherDetails: null
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

  const dummyConfirmIssueResponse: ConfirmOtherStockIssueResponse = {
    id: 8297,
    srcLocationCode: 'URB',
    destLocationCode: 'URB',
    status: 'ISSUED',
    weightUnit: 'gms',
    currencyCode: 'INR',
    srcLocationDescription: null,
    destLocationDescription: null,
    srcDocNo: 231,
    srcFiscalYear: 2020,
    srcDocDate: moment(1600681186289),
    destDocNo: null,
    courierDetails: '',
    destDocDate: null,
    orderType: null,
    totalAvailableQuantity: null,
    totalMeasuredQuantity: 0,
    totalAvailableValue: null,
    totalMeasuredValue: 0,
    totalAvailableWeight: null,
    totalMeasuredWeight: 0,
    transferType: 'ADJ',
    courierReceivedDate: null
  };
  const dummySuccessPayload: LoadOtherIssueCreateItemsTotalCountSuccessPayload = {
    allOtherIssueCreateItemsTotalCount: 0,
    selectedOtherIssueCreateItemsTotalCount: 1
  };
  const dummyCreateStockResponse: OtherIssuesCreateStockResponse = {
    destLocationCode: '',
    id: 1,
    reqDocDate: moment(),
    reqDocNo: 1,
    srcLocationCode: '',
    status: '',
    totalQuantity: 1
  };
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

  describe('Testing Load Other Issue History Functionality', () => {
    it('LoadOtherIssueHistory should be called', () => {
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
      const action = new LoadOtherIssueHistory(payload);
      const result: OtherIssuesState = otherIssuesReducer(initialState, action);
      expect(result.isLoadingHistory).toEqual(true);
      expect(result.error).toEqual(null);
    });

    it('LoadOtherIssueHistory should be called', () => {
      const payload: OtherIssuedataModel = {
        issueData: historySTNArray,
        totalElements: 2
      };
      const action = new LoadOtherIssueHistorySuccess(payload);
      const result: OtherIssuesState = otherIssuesReducer(initialState, action);
      expect(result.otherIssueHistory.ids.length).toBe(2);
      expect(result.otherIssueHistoryCount).toEqual(2);
      expect(result.isLoadingHistory).toEqual(false);
    });
    it('LoadOtherIssueHistoryFailure should be called', () => {
      const action = new actions.LoadOtherIssueHistoryFailure(
        CustomErrorAdaptor.fromJson(Error('Some Error'))
      );

      const result: OtherIssuesState = otherIssuesReducer(initialState, action);
      expect(result.isLoadingHistory).toEqual(false);
      expect(result.error.message).toEqual('Some Error');
    });
  });
  describe('Testing Reset Other Issue History Functionality', () => {
    it('ResetOtherIssueHistory should be called', () => {
      const action = new actions.ResetOtherIssueHistory();
      const result: OtherIssuesState = otherIssuesReducer(initialState, action);
      expect(result.otherIssueHistory.ids.length).toBe(0);
    });
  });

  describe('Testing Load Selected Other Issue History Functionality', () => {
    it('LoadSelectedHistory should be called', () => {
      const payload = {
        type: 'other-issue',
        actionType: 'ISSUE',
        id: 1,
        transactionType: 'ADJ'
      };
      const action = new actions.LoadSelectedHistory(payload);
      const result: OtherIssuesState = otherIssuesReducer(initialState, action);
      expect(result.isLoadingSelectedHistory).toBe(true);
      expect(result.hasSelectedHistory).toBe(false);
      expect(result.selectedHistory).toBeNull();
      expect(result.historyItemsCount).toBe(0);
      expect(result.historyItems.ids.length).toBe(0);
      expect(result.isLoadingHistoryItems).toBe(false);
      expect(result.isHistoryItemsLoaded).toBe(false);
      expect(result.error).toBeNull();
    });

    it('LoadSelectedHistorySuccess should be called', () => {
      const payload = historySTN1;
      const action = new actions.LoadSelectedHistorySuccess(payload);
      const result: OtherIssuesState = otherIssuesReducer(initialState, action);
      expect(result.selectedHistory.id).toBe(historySTN1.id);
      expect(result.isLoadingSelectedHistory).toBe(false);
      expect(result.hasSelectedHistory).toBe(true);
    });

    it('LoadSelectedHistoryFailure should be called', () => {
      const action = new actions.LoadSelectedHistoryFailure(
        CustomErrorAdaptor.fromJson(Error('Some Error'))
      );
      const result: OtherIssuesState = otherIssuesReducer(initialState, action);
      expect(result.hasSelectedHistory).toBe(true);
      expect(result.isLoadingSelectedHistory).toBe(false);
      expect(result.error.message).toBe('Some Error');
    });
  });

  describe('Testing Load Selected Other Issue History Items Functionality', () => {
    it('LoadSelectedHistoryItems should be called', () => {
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
      const action = new actions.LoadSelectedHistoryItems(payload);
      const result: OtherIssuesState = otherIssuesReducer(initialState, action);
      expect(result.historyItems.ids.length).toBe(0);
      expect(result.isLoadingHistoryItems).toBe(true);
      expect(result.isHistoryItemsLoaded).toBe(false);
      expect(result.error).toBeNull();
    });

    it('LoadSelectedHistoryItemsSuccess should be called', () => {
      const payload = historyItemsArray;
      const action = new actions.LoadSelectedHistoryItemsSuccess({
        items: payload,
        count: 2
      });
      const result: OtherIssuesState = otherIssuesReducer(initialState, action);
      expect(result.historyItemsCount).toBe(2);
      expect(result.historyItems.ids.length).toBe(2);
      expect(result.isLoadingHistoryItems).toBe(false);
      expect(result.isHistoryItemsLoaded).toBe(true);
    });

    it('LoadSelectedHistoryFailure should be called', () => {
      const action = new actions.LoadSelectedHistoryFailure(
        CustomErrorAdaptor.fromJson(Error('Some Error'))
      );
      const result: OtherIssuesState = otherIssuesReducer(initialState, action);
      expect(result.hasSelectedHistory).toBe(true);
      expect(result.isLoadingSelectedHistory).toBe(false);
      expect(result.error.message).toBe('Some Error');
    });
  });
  describe('Testing Clear Selected Other Issue History Items Functionality', () => {
    it('ClearSelectedHistoryItems should be called', () => {
      const action = new actions.ClearSelectedHistoryItems();
      const result: OtherIssuesState = otherIssuesReducer(initialState, action);
      expect(result.historyItems.ids.length).toBe(0);
    });
  });

  describe('Testing Load Selected Other Issue History Items Total Count Functionality', () => {
    it('LoadSelectedHistoryItemsTotalCount should be called', () => {
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
      const action = new actions.LoadSelectedHistoryItemsTotalCount(payload);
      const result: OtherIssuesState = otherIssuesReducer(initialState, action);
      expect(result.isLoadingHistoryItemsTotalCount).toBe(true);
      expect(result.error).toBeNull();
    });

    it('LoadSelectedHistoryItemsTotalCountSuccess should be called', () => {
      const payload = 10;
      const action = new actions.LoadSelectedHistoryItemsTotalCountSuccess(
        payload
      );
      const result: OtherIssuesState = otherIssuesReducer(initialState, action);
      expect(result.historyItemsTotalCount).toBe(10);
      expect(result.isLoadingHistoryItemsTotalCount).toBe(false);
      expect(result.isHistoryItemsTotalCountLoaded).toBe(true);
    });

    it('LoadSelectedHistoryItemsTotalCountFailure should be called', () => {
      const action = new actions.LoadSelectedHistoryItemsTotalCountFailure(
        CustomErrorAdaptor.fromJson(Error('Some Error'))
      );
      const result: OtherIssuesState = otherIssuesReducer(initialState, action);
      expect(result.isLoadingHistoryItemsTotalCount).toBe(false);
      expect(result.error.message).toBe('Some Error');
    });
  });

  describe('LoadIssuesSTNCount Reducer Test Cases', () => {
    it('LoadIssuesSTNCount should be calle ', () => {
      const action = new LoadIssuesSTNCount();

      const result: OtherIssuesState = otherIssuesReducer(initialState, action);

      expect(result.error).toBeNull();
    });
    it('LoadIssuesSTNCountSuccess should be called ', () => {
      const payload: LoadOtherIssuesSTNCountPayload = {
        countData: [{ count: 1, type: 'EXH' }],
        pendingOtherIssuesSTNCount: 1
      };

      const action = new actions.LoadIssuesSTNCountSuccess(payload);
      const result: OtherIssuesState = otherIssuesReducer(initialState, action);
      expect(result.otherIssuesDropdownValues).toBeTruthy();
      expect(result.pendingOtherIssuesSTNCount).toBeTruthy();
    });
    it('LoadIssuesSTNCountFailure should be called ', () => {
      const action = new actions.LoadIssuesSTNCountFailure(
        CustomErrorAdaptor.fromJson(Error('Some Error'))
      );

      const result: OtherIssuesState = otherIssuesReducer(initialState, action);
      expect(result.otherIssuesDropdownValues).toBe(null);
      expect(result.pendingOtherIssuesSTNCount).toBe(0);
      expect(result.error.message).toBe('Some Error');
    });
  });

  describe('Testing Set HistAdvancedFilterData Functionality', () => {
    it('SettingHistoryAdvancedFilterData shpuld be called', () => {
      const payload: OtherReceiptsIssuesAdvanceFilterPayload = {
        docFromDate: null,
        docToDate: null,
        status: null,
        fiscalYear: null,
        docNo: null
      };
      const action = new actions.SetOtherReceiptsIssueFilterData(payload);
      const result: OtherIssuesState = otherIssuesReducer(initialState, action);
      expect(result.advancedfilter).toEqual(payload);
    });
  });
  // describe('Testing Clear HistAdvancedFilterData Functionality', () => {
  //   it('ClearOtherReceiptsIssueFilterData should be called', () => {
  //     const action = new actions.ClearOtherReceiptsIssueFilterData();
  //     const result: OtherIssuesState = otherIssuesReducer(initialState, action);

  //     expect(result.advancedfilter.docFromDate).toBeTruthy();
  //     expect(result.advancedfilter.docToDate).toBeTruthy();
  //     expect(result.advancedfilter.fiscalYear).toBeNull();
  //     expect(result.advancedfilter.status).toBeNull();
  //     expect(result.advancedfilter.docNo).toBeNull();
  //   });
  // });

  describe('LoadIssueList reducer Test Cases', () => {
    it('  LoadIssueList reducer ', () => {
      const payload: OtherIssueLoadListItemsPayload = {
        pageIndex: 0,
        pageSize: 1,
        type: 'EXH'
      };

      const action = new actions.LoadIssueList(payload);

      const result: OtherIssuesState = otherIssuesReducer(initialState, action);

      expect(result.isLoadingOtherIssuesList).toBe(true);
      expect(result.error).toBeNull();
    });
    it('  LoadIssueListSuccess reducer  to be called ', () => {
      const payload: OtherIssuedataModel = dummmyIssueList;
      const action = new actions.LoadIssueListSuccess(payload);

      const result: OtherIssuesState = otherIssuesReducer(initialState, action);
      expect(result.isLoadingOtherIssuesList).toBe(false);
      expect(result.otherIssuesList).toBeTruthy();
      expect(result.error).toBeNull();
    });
    it('  LoadIssueListFailure reducer  to be called ', () => {
      const action = new actions.LoadIssueListFailure(
        CustomErrorAdaptor.fromJson(Error('Some Error'))
      );

      const result: OtherIssuesState = otherIssuesReducer(initialState, action);
      expect(result.isLoadingOtherIssuesList).toBe(false);
      expect(result.error.message).toBe('Some Error');
    });
  });

  describe('LoadIssueLoanList Reducer Test Cases', () => {
    it('LoadIssueLoanList Reducer  to be called ', () => {
      const payload: OtherIssueLoadListItemsPayload = {
        pageIndex: 0,
        pageSize: 1,
        type: 'EXH'
      };

      const action = new actions.LoadIssueLoanList(payload);

      const result: OtherIssuesState = otherIssuesReducer(initialState, action);
      expect(result.isLoadingOtherIssuesLoanList).toBe(true);

      expect(result.error).toBeNull();
    });
    it('  LoadIssueLoanListSuccess Reducer  to be called ', () => {
      const payload: OtherIssuedataModel = dummmyIssueList;
      const action = new actions.LoadIssueLoanListSuccess(payload);

      const result: OtherIssuesState = otherIssuesReducer(initialState, action);
      expect(result.isLoadingOtherIssuesLoanList).toBe(false);
      expect(result.otherIssueLoanList).toBeTruthy();
      expect(result.error).toBeNull();
    });
    it('  LoadIssueListFailure Reducer  to be called ', () => {
      const action = new actions.LoadIssueLoanListFailure(
        CustomErrorAdaptor.fromJson(Error('Some Error'))
      );

      const result: OtherIssuesState = otherIssuesReducer(initialState, action);

      expect(result.isLoadingOtherIssuesLoanList).toBe(false);
      expect(result.error.message).toBe('Some Error');
    });
  });

  describe('LoadIssueADJList Reducer Test Cases', () => {
    it(' LoadIssueADJList to be called', () => {
      const payload: OtherIssueLoadListItemsPayload = {
        pageIndex: 0,
        pageSize: 1,
        type: 'EXH'
      };

      const action = new actions.LoadIssueADJList(payload);
      const result: OtherIssuesState = otherIssuesReducer(initialState, action);
      expect(result.isLoadingOtherIssuesADJList).toBe(true);

      expect(result.error).toBeNull();
    });
    it(' LoadIssueADJListSuccess to be called', () => {
      const payload: OtherIssuedataModel = dummmyIssueList;
      const action = new actions.LoadIssueADJListSuccess(payload);

      const result: OtherIssuesState = otherIssuesReducer(initialState, action);
      expect(result.isLoadingOtherIssuesADJList).toBe(false);
      expect(result.otherIssueADJList).toBeTruthy();
      expect(result.error).toBeNull();
    });
    it(' LoadIssueADJListFailure to be called', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new actions.LoadIssueADJListFailure(payload);
      const result: OtherIssuesState = otherIssuesReducer(initialState, action);

      expect(result.isLoadingOtherIssuesADJList).toBe(false);
      expect(result.error.message).toBe('Some Error');
    });
  });

  describe('LoadIssueLossList Reducer Test Cases', () => {
    it(' LoadIssueLossList to be called', () => {
      const payload: OtherIssueLoadListItemsPayload = {
        pageIndex: 0,
        pageSize: 1,
        type: 'EXH'
      };

      const action = new actions.LoadIssueLossList(payload);

      const result: OtherIssuesState = otherIssuesReducer(initialState, action);
      expect(result.isLoadingOtherIssuesLossList).toBe(true);

      expect(result.error).toBeNull();
    });
    it(' LoadIssueLossListSuccess to be called', () => {
      const payload: OtherIssuedataModel = dummmyIssueList;

      const action = new actions.LoadIssueLossListSuccess(payload);
      const result: OtherIssuesState = otherIssuesReducer(initialState, action);
      expect(result.isLoadingOtherIssuesLossList).toBe(false);
      expect(result.otherIssueLossList).toBeTruthy();
      expect(result.error).toBeNull();
    });
    it(' LoadIssueLossListFailure to be called', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.LoadIssueLossListFailure(payload);

      const result: OtherIssuesState = otherIssuesReducer(initialState, action);

      expect(result.isLoadingOtherIssuesLossList).toBe(false);
      expect(result.error.message).toBe('Some Error');
    });
    describe('LoadIssuePSVList Reducer Test Cases', () => {
      it(' LoadIssuePSVListSuccess to be called', () => {
        const payload: OtherIssueLoadListItemsPayload = {
          pageIndex: 0,
          pageSize: 1,
          type: 'EXH'
        };

        const action = new actions.LoadIssuePSVList(payload);
        const result: OtherIssuesState = otherIssuesReducer(
          initialState,
          action
        );
        expect(result.isLoadingOtherIssuesPSVList).toBe(true);

        expect(result.error).toBeNull();
      });
      it(' LoadIssuePSVList to be called', () => {
        const payload: OtherIssuedataModel = dummmyIssueList;
        const action = new actions.LoadIssuePSVListSuccess(payload);

        const result: OtherIssuesState = otherIssuesReducer(
          initialState,
          action
        );
        expect(result.isLoadingOtherIssuesPSVList).toBe(false);
        expect(result.otherIssuePSVList).toBeTruthy();
        expect(result.error).toBeNull();
      });
      it(' LoadIssuePSVListFailure to be called', () => {
        const payload: CustomErrors = CustomErrorAdaptor.fromJson(
          Error('Some Error')
        );
        const action = new actions.LoadIssuePSVListFailure(payload);
        const result: OtherIssuesState = otherIssuesReducer(
          initialState,
          action
        );

        expect(result.isLoadingOtherIssuesPSVList).toBe(false);
        expect(result.error.message).toBe('Some Error');
      });
    });

    describe('LoadIssueFOCList Reducer Test Cases', () => {
      it(' LoadIssueFOCList to be called', () => {
        const payload: OtherIssueLoadListItemsPayload = {
          pageIndex: 0,
          pageSize: 1,
          type: 'EXH'
        };

        const action = new actions.LoadIssueFOCList(payload);

        const result: OtherIssuesState = otherIssuesReducer(
          initialState,
          action
        );
        expect(result.isLoadingOtherIssuesFOCList).toBe(true);

        expect(result.error).toBeNull();
      });
      it(' LoadIssueFOCListSuccess to be called', () => {
        const payload: OtherIssuedataModel = dummmyIssueList;
        const action = new actions.LoadIssueFOCListSuccess(payload);

        const result: OtherIssuesState = otherIssuesReducer(
          initialState,
          action
        );
        expect(result.isLoadingOtherIssuesFOCList).toBe(false);
        expect(result.otherIssueFOCList).toBeTruthy();
        expect(result.error).toBeNull();
      });
      it(' LoadIssueFOCListFailure to be called', () => {
        const payload: CustomErrors = CustomErrorAdaptor.fromJson(
          Error('Some Error')
        );
        const action = new actions.LoadIssueFOCListFailure(payload);
        const result: OtherIssuesState = otherIssuesReducer(
          initialState,
          action
        );

        expect(result.isLoadingOtherIssuesFOCList).toBe(false);
        expect(result.error.message).toBe('Some Error');
      });
    });

    describe('SearchPendingIssue Reducer Test Cases', () => {
      it(' SearchPendingIssue to be called', () => {
        const payload: OtherIssueSearchPendingPayload = {
          srcDocnumber: 1,
          type: 'EXH'
        };

        const action = new actions.SearchPendingIssue(payload);

        const result: OtherIssuesState = otherIssuesReducer(
          initialState,
          action
        );

        expect(result.isSearchingStocks).toBe(true);
        expect(result.hasSearchStockResults).toBeNull();

        expect(result.error).toBeNull();
      });
      it(' SearchPendingIssueSuccess to be called', () => {
        const payload: OtherIssueModel[] = [dummyCreateIssue];
        const action = new actions.SearchPendingIssueSuccess(payload);

        const result: OtherIssuesState = otherIssuesReducer(
          initialState,
          action
        );
        expect(result.isSearchingStocks).toBe(false);
        expect(result.searchIssueStockResults).toBeTruthy();
        expect(result.error).toBeNull();
      });
      it(' LoadIssueFOCListFailure to be called', () => {
        const payload: CustomErrors = CustomErrorAdaptor.fromJson(
          Error('Some Error')
        );
        const action = new actions.SearchPendingIssueFailure(payload);
        const result: OtherIssuesState = otherIssuesReducer(
          initialState,
          action
        );

        expect(result.isSearchingStocks).toBe(false);
        expect(result.error.message).toBe('Some Error');
      });
    });

    describe('CreateStockRequestAdjustment Reducer Test Cases', () => {
      it(' CreateStockRequestAdjustment to be called', () => {
        const payload: CreateStockRequestAdjustmentPayload = {
          approvalDetails: { data: '', type: '' },
          items: [],
          remarks: '',
          reqType: 'EXH'
        };

        const action = new actions.CreateStockRequestAdjustment(payload);
        const result: OtherIssuesState = otherIssuesReducer(
          initialState,
          action
        );

        expect(result.isLoadingAdjustment).toBe(true);

        expect(result.error).toBeNull();
      });
      it(' CreateStockRequestAdjustmentSuccess to be called', () => {
        const payload: OtherIssueModel = dummyCreateIssue;
        const action = new actions.CreateStockRequestAdjustmentSuccess(payload);

        const result: OtherIssuesState = otherIssuesReducer(
          initialState,
          action
        );
        expect(result.isLoadingAdjustment).toBe(false);
        expect(result.createStockRequestAdjustmentResponse).toBeTruthy();
        expect(result.error).toBeNull();
      });
      it(' CreateStockRequestAdjustmentFailure to be called', () => {
        const payload: CustomErrors = CustomErrorAdaptor.fromJson(
          Error('Some Error')
        );
        const action = new actions.CreateStockRequestAdjustmentFailure(payload);
        const result: OtherIssuesState = otherIssuesReducer(
          initialState,
          action
        );

        expect(result.isLoadingAdjustment).toBe(false);
        expect(result.error.message).toBe('Some Error');
      });
    });

    describe('UpdateStockRequest Reducer Test Cases', () => {
      it(' UpdateStockRequest to be called', () => {
        const payload: UpdateStockRequestPayload = {
          approvalDetails: { data: '', type: '' },
          carrierDetails: { data: '', type: '' },
          id: 1,
          status: '',
          remarks: '',
          reqType: 'EXH'
        };

        const action = new actions.UpdateStockRequest(payload);
        const result: OtherIssuesState = otherIssuesReducer(
          initialState,
          action
        );

        expect(result.isLoadingUpdateStockRequestResponse).toBe(true);

        expect(result.error).toBeNull();
      });
      it(' UpdateStockRequest to be called', () => {
        const payload: OtherIssueModel = dummyCreateIssue;
        const action = new actions.UpdateStockRequestSuccess(payload);

        const result: OtherIssuesState = otherIssuesReducer(
          initialState,
          action
        );
        expect(result.isLoadingUpdateStockRequestResponse).toBe(false);
        expect(result.updateStockRequestResponse).toBeTruthy();
        expect(result.error).toBeNull();
      });
      it(' UpdateStockRequest to be called', () => {
        const payload: CustomErrors = CustomErrorAdaptor.fromJson(
          Error('Some Error')
        );
        const action = new actions.UpdateStockRequestFailure(payload);

        const result: OtherIssuesState = otherIssuesReducer(
          initialState,
          action
        );

        expect(result.isLoadingUpdateStockRequestResponse).toBe(false);
        expect(result.error.message).toBe('Some Error');
      });
    });

    describe('CreateStockRequestPSV Reducer Test Cases', () => {
      it(' CreateStockRequestPSV to be called', () => {
        const payload: CreateStockRequestAdjustmentPayload = {
          approvalDetails: { data: '', type: '' },
          items: [],
          remarks: '',
          reqType: 'EXH'
        };

        const action = new actions.CreateStockRequestPSV(payload);
        const result: OtherIssuesState = otherIssuesReducer(
          initialState,
          action
        );

        expect(result.isLoadingPSV).toBe(true);

        expect(result.error).toBeNull();
      });
      it('CreateStockRequestPSVSuccess to be called', () => {
        const payload: OtherIssueModel = dummyCreateIssue;
        const action = new actions.CreateStockRequestPSVSuccess(payload);

        const result: OtherIssuesState = otherIssuesReducer(
          initialState,
          action
        );
        expect(result.isLoadingPSV).toBe(false);
        expect(result.createStockRequestPSVResponse).toBeTruthy();
        expect(result.error).toBeNull();
      });
      it('CreateStockRequestPSVFailure to be called', () => {
        const payload: CustomErrors = CustomErrorAdaptor.fromJson(
          Error('Some Error')
        );
        const action = new actions.CreateStockRequestPSVFailure(payload);

        const result: OtherIssuesState = otherIssuesReducer(
          initialState,
          action
        );

        expect(result.isLoadingPSV).toBe(false);
        expect(result.error.message).toBe('Some Error');
      });
    });

    describe('CreateStockRequestFOC Reducer Test Cases', () => {
      it(' CreateStockRequestFOC to be called', () => {
        const payload: CreateStockRequestAdjustmentPayload = {
          approvalDetails: { data: '', type: '' },
          items: [],
          remarks: '',
          reqType: 'EXH'
        };

        const action = new actions.CreateStockRequestFOC(payload);
        const result: OtherIssuesState = otherIssuesReducer(
          initialState,
          action
        );

        expect(result.isLoadingFOC).toBe(true);

        expect(result.error).toBeNull();
      });
      it('CreateStockRequestFOCSuccess to be called', () => {
        const payload: OtherIssueModel = dummyCreateIssue;
        const action = new actions.CreateStockRequestFOCSuccess(payload);

        const result: OtherIssuesState = otherIssuesReducer(
          initialState,
          action
        );
        expect(result.isLoadingFOC).toBe(false);
        expect(result.createStockRequestFOCResponse).toBeTruthy();
        expect(result.error).toBeNull();
      });
      it('CreateStockRequestFOCFailure to be called', () => {
        const payload: CustomErrors = CustomErrorAdaptor.fromJson(
          Error('Some Error')
        );
        const action = new actions.CreateStockRequestFOCFailure(payload);

        const result: OtherIssuesState = otherIssuesReducer(
          initialState,
          action
        );

        expect(result.isLoadingFOC).toBe(false);
        expect(result.error.message).toBe('Some Error');
      });
    });

    describe('DropDownvalueForIssues Reducer Test Cases', () => {
      it(' DropDownvalueForIssues to be called', () => {
        const payload = 'EXH';

        const action = new actions.DropDownvalueForIssues(payload);

        const result: OtherIssuesState = otherIssuesReducer(
          initialState,
          action
        );

        expect(result.selectedDropDownForIssues).toBe('EXH');

        expect(result.error).toBeNull();
      });
    });
    describe('LoadSelectedIssue Reducer Test Cases', () => {
      it('LoadSelectedIssue to be called', () => {
        const payload: OtherIssueLoadSelectedPayload = {
          reqDocNo: 1,
          type: 'EXH'
        };

        const action = new actions.LoadSelectedIssue(payload);

        const result: OtherIssuesState = otherIssuesReducer(
          initialState,
          action
        );

        expect(result.isLoadingOtherIssueSelectedStock).toBe(true);

        expect(result.error).toBeNull();
      });
      it('LoadSelectedIssueSuccess to be called', () => {
        const payload: RequestOtherIssueStockTransferNote = dummyLoadIssue;
        const action = new actions.LoadSelectedIssueSuccess(payload);

        const result: OtherIssuesState = otherIssuesReducer(
          initialState,
          action
        );
        expect(result.isLoadingOtherIssueSelectedStock).toBe(false);
        expect(result.selectedIssue).toBeTruthy();
        expect(result.error).toBeNull();
      });
      it('LoadSelectedIssueFailure to be called', () => {
        const payload: CustomErrors = CustomErrorAdaptor.fromJson(
          Error('Some Error')
        );
        const action = new actions.LoadSelectedIssueFailure(payload);
        const result: OtherIssuesState = otherIssuesReducer(
          initialState,
          action
        );

        expect(result.isLoadingOtherIssueSelectedStock).toBe(false);
        expect(result.error.message).toBe('Some Error');
      });
    });
    /////
    describe('LoadNonVerifiedOtherIssueItems Action Test Cases', () => {
      it('LoadNonVerifiedOtherIssueItems to be called', () => {
        const payload: LoadOtherIssuesItemPayload = {
          id: 1,
          pageIndex: 2,
          pageSize: 1,
          status: '',
          type: ''
        };

        const action = new actions.LoadNonVerifiedOtherIssueItems(payload);

        const result: OtherIssuesState = otherIssuesReducer(
          initialState,
          action
        );
        expect(result.isLoadingOtherIssueDetails).toBe(true);

        expect(result.error).toBeNull();
      });
      it('LoadNonVerifiedOtherIssueItemsSuccess to be called', () => {
        const payload: OtherIssuesItem[] = dummysearchOtherIssueCreateItems;
        const action = new actions.LoadNonVerifiedOtherIssueItemsSuccess(
          payload
        );

        const result: OtherIssuesState = otherIssuesReducer(
          initialState,
          action
        );
        expect(result.isLoadingOtherIssueDetails).toBe(false);
        expect(result.nonVerifiedOtherIssuesItems).toBeTruthy();
        expect(result.error).toBeNull();
      });
      it('LoadNonVerifiedOtherIssueItemsFailre to be called', () => {
        const payload: CustomErrors = CustomErrorAdaptor.fromJson(
          Error('Some Error')
        );
        const action = new actions.LoadNonVerifiedOtherIssueItemsFailure(
          payload
        );

        const result: OtherIssuesState = otherIssuesReducer(
          initialState,
          action
        );
        expect(result.isLoadingOtherIssueDetails).toBe(false);

        expect(result.error.message).toBe('Some Error');
      });
    });

    describe('LoadAllOtherIssueCreateItems Action Test Cases', () => {
      it('LoadAllOtherIssueCreateItems to be called', () => {
        const payload: LoadAllOtherIssuePayload = {
          id: 1,
          pageIndex: 2,
          pageSize: 1,
          reqtype: ''
        };

        const action = new actions.LoadAllOtherIssueCreateItems(payload);

        const result: OtherIssuesState = otherIssuesReducer(
          initialState,
          action
        );
        expect(result.isallOtherIssueCreateItemsLoading).toBe(true);

        expect(result.error).toBeNull();
      });
      it('LoadAllOtherIssueCreateItemsSuccess to be called', () => {
        const payload: OtherIssuesItem[] = dummysearchOtherIssueCreateItems;
        const action = new actions.LoadAllOtherIssueCreateItemsSuccess(payload);

        const result: OtherIssuesState = otherIssuesReducer(
          initialState,
          action
        );
        expect(result.isallOtherIssueCreateItemsLoading).toBe(false);
        expect(result.allOtherIssueCreateItems).toBeTruthy();
        expect(result.error).toBeNull();
      });
      it('LoadAllOtherIssueCreateItemsFailre to be called', () => {
        const payload: CustomErrors = CustomErrorAdaptor.fromJson(
          Error('Some Error')
        );
        const action = new actions.LoadAllOtherIssueCreateItemsFailure(payload);

        const result: OtherIssuesState = otherIssuesReducer(
          initialState,
          action
        );
        expect(result.isallOtherIssueCreateItemsLoading).toBe(false);
        expect(result.error.message).toBe('Some Error');
      });
    });

    describe('LoadSelectedOtherIssueCreateItems Action Test Cases', () => {
      it('LoadSelectedOtherIssueCreateItems to be called', () => {
        const payload: LoadAllOtherIssuePayload = {
          id: 1,
          pageIndex: 2,
          pageSize: 1,
          reqtype: ''
        };

        const action = new actions.LoadSelectedOtherIssueCreateItems(payload);

        const result: OtherIssuesState = otherIssuesReducer(
          initialState,
          action
        );
        expect(result.isselectedOtherIssueCreateItemsLoading).toBe(true);

        expect(result.error).toBeNull();
      });
      it('LoadSelectedOtherIssueCreateItemsSuccess to be called', () => {
        const payload: OtherIssuesItem[] = dummysearchOtherIssueCreateItems;
        const action = new actions.LoadSelectedOtherIssueCreateItemsSuccess(
          payload
        );

        const result: OtherIssuesState = otherIssuesReducer(
          initialState,
          action
        );
        expect(result.isselectedOtherIssueCreateItemsLoading).toBe(false);
        expect(result.selectedOtherIssueCreateItems).toBeTruthy();
        expect(result.error).toBeNull();
      });
      it('LoadSelectedOtherIssueCreateItemsFailre to be called', () => {
        const payload: CustomErrors = CustomErrorAdaptor.fromJson(
          Error('Some Error')
        );
        const action = new actions.LoadSelectedOtherIssueCreateItemsFailure(
          payload
        );

        const result: OtherIssuesState = otherIssuesReducer(
          initialState,
          action
        );
        expect(result.isselectedOtherIssueCreateItemsLoading).toBe(false);
        expect(result.error.message).toBe('Some Error');
      });
    });

    describe('AddItemsToCart Action Test Cases', () => {
      it('AddItemsToCart to be called', () => {
        const payload: OtherIssuesItem[] = dummysearchOtherIssueCreateItems;
        const action = new actions.AddItemsToCart(payload);

        const result: OtherIssuesState = otherIssuesReducer(
          initialState,
          action
        );

        expect(result.adjustmentItemsInCarts).toBeTruthy();
        expect(result.error).toBeNull();
      });
    });

    describe('AddPSVItemsToCart Action Test Cases', () => {
      it('AddPSVItemsToCart to be called', () => {
        const payload: OtherIssuesItem[] = dummysearchOtherIssueCreateItems;
        const action = new actions.AddPSVItemsToCart(payload);

        const result: OtherIssuesState = otherIssuesReducer(
          initialState,
          action
        );

        expect(result.psvItemsInCarts).toBeTruthy();
        expect(result.error).toBeNull();
      });
    });

    describe('AddFOCItemsToCart Action Test Cases', () => {
      it('AddFOCItemsToCart to be called', () => {
        const payload: OtherIssuesItem[] = dummysearchOtherIssueCreateItems;
        const action = new actions.AddFOCItemsToCart(payload);

        const result: OtherIssuesState = otherIssuesReducer(
          initialState,
          action
        );

        expect(result.focItemsInCarts).toBeTruthy();
        expect(result.error).toBeNull();
      });
    });

    describe('SearchClearIssue Action Test Cases', () => {
      it(' SearchClearIssue to be called', () => {
        const action = new actions.SearchClearIssue();

        const result: OtherIssuesState = otherIssuesReducer(
          initialState,
          action
        );
        expect(result.isSearchingStocks).toBe(false);
        expect(result.searchIssueStockResults).toBeTruthy();
        expect(result.hasSearchStockResults).toBeNull();
        expect(result.error).toBeNull();
      });
    });

    describe('ClearItems Action Test Cases', () => {
      it('ClearItems to be called', () => {
        const action = new actions.ClearItems();

        const result: OtherIssuesState = otherIssuesReducer(
          initialState,
          action
        );
        expect(result.nonVerifiedOtherIssuesItems).toBeTruthy();
        expect(result.allOtherIssueCreateItems).toBeTruthy();
        expect(result.selectedOtherIssueCreateItems).toBeTruthy();
      });
    });

    describe('CreateOtherStockIssueItems Action Test Cases', () => {
      it('CreateOtherStockIssueItems to be called', () => {
        const payload: CreateOtherStockIssueItemsPayload = {
          id: 1,
          data: '',
          transferType: ''
        };

        const action = new actions.CreateOtherStockIssueItems(payload);

        const result: OtherIssuesState = otherIssuesReducer(
          initialState,
          action
        );
        expect(result.isLoadingOtherIssueDetails).toBe(true);

        expect(result.error).toBeNull();
      });
      it('CreateOtherStockIssueItemsSuccess to be called', () => {
        const payload: any = [];
        const action = new actions.CreateOtherStockIssueItemsItemsSuccess(
          payload
        );

        const result: OtherIssuesState = otherIssuesReducer(
          initialState,
          action
        );
        expect(result.isLoadingOtherIssueDetails).toBe(false);
        expect(result.createOtherStockIssueItemsResponse).toBeTruthy();
        expect(result.error).toBeNull();
      });
      it('CreateOtherStockIssueItemsFailre to be called', () => {
        const payload: CustomErrors = CustomErrorAdaptor.fromJson(
          Error('Some Error')
        );
        const action = new actions.CreateOtherStockIssueItemsItemsFailure(
          payload
        );

        const result: OtherIssuesState = otherIssuesReducer(
          initialState,
          action
        );
        expect(result.isLoadingOtherIssueDetails).toBe(false);

        expect(result.error.message).toBe('Some Error');
      });
    });

    describe('RemoveInitialLoadOtherIssue Action Test Cases', () => {
      it('RemoveInitialLoadOtherIssue to be called', () => {
        const action = new actions.RemoveInitialLoadOtherIssue();

        const result: OtherIssuesState = otherIssuesReducer(
          initialState,
          action
        );

        expect(result.nonVerifiedOtherIssuesItems).toBeTruthy();
        expect(result.error).toBeNull();
      });
    });

    describe('ConfirmOtherStockIssue Action Test Cases', () => {
      it('ConfirmOtherStockIssue to be called', () => {
        const payload: ConfirmOtherStockIssuePayload = {
          id: 1,
          carrierDetails: { data: '', type: '' },
          destinationLocationCode: '',
          remarks: '',
          transferType: ''
        };

        const action = new actions.ConfirmOtherStockIssue(payload);

        const result: OtherIssuesState = otherIssuesReducer(
          initialState,
          action
        );
        expect(result.isLoadingOtherIssueDetails).toBe(true);

        expect(result.error).toBeNull();
      });
      it('ConfirmOtherStockIssueSuccess to be called', () => {
        const payload: ConfirmOtherStockIssueResponse = dummyConfirmIssueResponse;

        const action = new actions.ConfirmOtherStockIssueSuccess(payload);

        const result: OtherIssuesState = otherIssuesReducer(
          initialState,
          action
        );
        expect(result.isLoadingOtherIssueDetails).toBe(false);
        expect(result.confirmOtherStockIssueResponse).toBeTruthy();
        expect(result.error).toBeNull();
      });
      it('ConfirmOtherStockIssueFailre to be called', () => {
        const payload: CustomErrors = CustomErrorAdaptor.fromJson(
          Error('Some Error')
        );
        const action = new actions.ConfirmOtherStockIssueFailure(payload);

        const result: OtherIssuesState = otherIssuesReducer(
          initialState,
          action
        );
        expect(result.isLoadingOtherIssueDetails).toBe(false);

        expect(result.error.message).toBe('Some Error');
      });
    });

    describe('ResetConfirmOtherIssueResponse Action Test Cases', () => {
      it('ResetConfirmOtherIssueResponse to be called', () => {
        const action = new actions.ResetConfirmOtherIssueResponse();

        const result: OtherIssuesState = otherIssuesReducer(
          initialState,
          action
        );

        expect(result.filterDataOtherIssue).toBeTruthy();
        expect(result.confirmOtherStockIssueResponse).toBeTruthy();

        expect(result.printDataResponse).toBeNull();
        expect(result.error).toBeNull();
      });
    });
    describe('CreateOtherIssueStockRequest Action Test Cases', () => {
      it('CreateOtherIssueStockRequest to be called', () => {
        const payload: OtherIssuesCreateStockResponsePayload = {
          reqtype: 'EXH'
        };

        const action = new actions.CreateOtherIssueStockRequest(payload);

        const result: OtherIssuesState = otherIssuesReducer(
          initialState,
          action
        );
        expect(result.isCreateOtherIssueStockRequestPending).toBe(true);

        expect(result.error).toBeNull();
      });
      it('CreateOtherIssueStockRequestSuccess to be called', () => {
        const payload: OtherIssuesCreateStockResponse = dummyCreateStockResponse;

        const action = new actions.CreateOtherIssueStockRequestSuccess(payload);

        const result: OtherIssuesState = otherIssuesReducer(
          initialState,
          action
        );
        expect(result.isCreateOtherIssueStockRequestPending).toBe(false);
        expect(result.createOtherIssueStockRequestResponse).toBeTruthy();
        expect(result.error).toBeNull();
      });
      it('CreateOtherIssueStockRequestFailre to be called', () => {
        const payload: CustomErrors = CustomErrorAdaptor.fromJson(
          Error('Some Error')
        );
        const action = new actions.CreateOtherIssueStockRequestFailure(payload);

        const result: OtherIssuesState = otherIssuesReducer(
          initialState,
          action
        );
        expect(result.isCreateOtherIssueStockRequestPending).toBe(false);
        expect(result.error.message).toBe('Some Error');
      });
    });

    describe('LoadIssueItemsCreateTotalCount Action Test Cases', () => {
      it('LoadIssueItemsCreateTotalCount to be called', () => {
        const payload: LoadOtherIssueCreateItemsTotalCountPayload = {
          id: 1,
          reqtype: ''
        };

        const action = new actions.LoadIssueItemsCreateTotalCount(payload);

        const result: OtherIssuesState = otherIssuesReducer(
          initialState,
          action
        );
        expect(result.isOtherIssueItemTotalCountLoading).toBe(true);

        expect(result.allOtherIssueCreateItemsTotalCount).toBe(0);
        expect(result.selectedOtherIssueCreateItemsTotalCount).toBe(0);
        expect(result.error).toBeNull();
      });
      it('LoadIssueItemsCreateTotalCountSuccess to be called', () => {
        const payload: LoadOtherIssueCreateItemsTotalCountSuccessPayload = dummySuccessPayload;
        const action = new actions.LoadIssueItemsCreateTotalCountSuccess(
          payload
        );

        const result: OtherIssuesState = otherIssuesReducer(
          initialState,
          action
        );
        expect(result.isOtherIssueItemTotalCountLoading).toBe(false);
        expect(result.allOtherIssueCreateItemsTotalCount).toBe(0);
        expect(result.selectedOtherIssueCreateItemsTotalCount).toBeTruthy();
        expect(result.error).toBeNull();
      });
      it('LoadIssueItemsCreateTotalCountFailre to be called', () => {
        const payload: CustomErrors = CustomErrorAdaptor.fromJson(
          Error('Some Error')
        );
        const action = new actions.LoadIssueItemsCreateTotalCountFailure(
          payload
        );

        const result: OtherIssuesState = otherIssuesReducer(
          initialState,
          action
        );
        expect(result.isOtherIssueItemTotalCountLoading).toBe(false);
        expect(result.isOtherIssueCreateItemTotalCountLoaded).toBe(false);
        expect(result.error.message).toBe('Some Error');
      });
    });

    describe('CreateOtherIssueStockRequestItems Action Test Cases', () => {
      it('CreateOtherIssueStockRequestItems to be called', () => {
        const payload: CreateOtherIssueStockRequestItemsPayload = {
          data: {},
          id: 1,
          requestType: ''
        };

        const action = new actions.CreateOtherIssueStockRequestItems(payload);

        const result: OtherIssuesState = otherIssuesReducer(
          initialState,
          action
        );
        expect(result.isLoadingOtherIssueRequestItemsResponse).toBe(true);

        expect(result.error).toBeNull();
      });
      it('CreateOtherIssueStockRequestItemsSuccess to be called', () => {
        const payload: any = [];
        const action = new actions.CreateOtherIssueStockRequestItemsSuccess(
          payload
        );

        const result: OtherIssuesState = otherIssuesReducer(
          initialState,
          action
        );
        expect(result.isLoadingOtherIssueRequestItemsResponse).toBe(false);
        expect(result.createOtherIssueStockRequestItemsResponse).toBeTruthy();
        expect(result.error).toBeNull();
      });
      it('CreateOtherIssueStockRequestItemsFailre to be called', () => {
        const payload: CustomErrors = CustomErrorAdaptor.fromJson(
          Error('Some Error')
        );
        const action = new actions.CreateOtherIssueStockRequestItemsFailure(
          payload
        );

        const result: OtherIssuesState = otherIssuesReducer(
          initialState,
          action
        );
        expect(result.isLoadingOtherIssueRequestItemsResponse).toBe(false);
        expect(result.error.message).toBe('Some Error');
      });
    });

    describe('RemoveOtherIssueStockRequestItems Action Test Cases', () => {
      it('RemoveOtherIssueStockRequestItems to be called', () => {
        const payload: RemoveOtherIssueStockRequestItemsPayload = {
          id: 1,
          data: {},
          requestType: ''
        };

        const action = new actions.RemoveOtherIssueStockRequestItems(payload);

        const result: OtherIssuesState = otherIssuesReducer(
          initialState,
          action
        );
        expect(result.isLoadingOtherIssueStockRequestItemsResponse).toBe(true);

        expect(result.error).toBeNull();
      });
      it('RemoveOtherIssueStockRequestItemsSuccess to be called', () => {
        const payload: any = [];
        const action = new actions.RemoveOtherIssueStockRequestItemsSuccess(
          payload
        );

        const result: OtherIssuesState = otherIssuesReducer(
          initialState,
          action
        );
        expect(result.isLoadingOtherIssueStockRequestItemsResponse).toBe(false);
        expect(result.removeOtherIssueStockRequestItemsResponse).toBeTruthy();
        expect(result.error).toBeNull();
      });
      it('RemoveOtherIssueStockRequestItemsFailre to be called', () => {
        const payload: CustomErrors = CustomErrorAdaptor.fromJson(
          Error('Some Error')
        );
        const action = new actions.RemoveOtherIssueStockRequestItemsFailure(
          payload
        );

        const result: OtherIssuesState = otherIssuesReducer(
          initialState,
          action
        );
        expect(result.isLoadingOtherIssueStockRequestItemsResponse).toBe(false);
        expect(result.error.message).toBe('Some Error');
      });
    });

    describe('UpdateStockRequestCreateItem Action Test Cases', () => {
      it('UpdateStockRequestCreateItem to be called', () => {
        const payload: UpdateStockRequestItemPayload = {
          id: 1,
          itemid: 1,
          reqType: '',
          value: { inventoryId: 0, measuredWeight: 0, quantity: 0, status: '' }
        };

        const action = new actions.UpdateStockRequestCreateItem(payload);

        const result: OtherIssuesState = otherIssuesReducer(
          initialState,
          action
        );
        expect(result.isLoadingUpdateStockRequestCreateItemResponse).toBe(true);

        expect(result.error).toBeNull();
      });
      it('UpdateStockRequestCreateItemSuccess to be called', () => {
        const payload: any = [];
        const action = new actions.UpdateStockRequestCreateItemSuccess(payload);

        const result: OtherIssuesState = otherIssuesReducer(
          initialState,
          action
        );
        expect(result.isLoadingUpdateStockRequestCreateItemResponse).toBe(
          false
        );
        expect(result.updateStockRequestCreateItemResponse).toBeTruthy();
        expect(result.error).toBeNull();
      });
      it('UpdateStockRequestCreateItemFailre to be called', () => {
        const payload: CustomErrors = CustomErrorAdaptor.fromJson(
          Error('Some Error')
        );
        const action = new actions.UpdateStockRequestCreateItemFailure(payload);

        const result: OtherIssuesState = otherIssuesReducer(
          initialState,
          action
        );
        expect(result.isLoadingUpdateStockRequestCreateItemResponse).toBe(
          false
        );
        expect(result.error.message).toBe('Some Error');
      });
    });

    describe('ResetOtherIssueCreateListItems Action Test Cases', () => {
      it('ResetOtherIssueCreateListItems to be called', () => {
        const action = new actions.ResetOtherIssueCreateListItems();

        const result: OtherIssuesState = otherIssuesReducer(
          initialState,
          action
        );

        expect(result.allOtherIssueCreateItems).toBeTruthy();
        expect(result.selectedOtherIssueCreateItems).toBeTruthy();
        expect(result.error).toBeNull();
      });
    });

    describe('ResetOtherIssueCreateResponse Action Test Cases', () => {
      it('ResetOtherIssueCreateResponse to be called', () => {
        const action = new actions.ResetOtherIssueCreateResponse();

        const result: OtherIssuesState = otherIssuesReducer(
          initialState,
          action
        );

        expect(result.allOtherIssueCreateItemsTotalCount).toBe(0);
        expect(result.selectedOtherIssueCreateItemsTotalCount).toBe(0);
        expect(result.sortDataAllProducts.length).toBe(0);
        expect(result.sortDataSelectedProducts.length).toBe(0);
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

        const action = new actions.SearchAdjustment(payload);

        const result: OtherIssuesState = otherIssuesReducer(
          initialState,
          action
        );
        expect(result.isSearchingAdjustment).toBe(true);
        expect(result.hasSearchedItemAdjustment).toBe(false);

        expect(result.error).toBeNull();
      });
      it('SearchAdjustmentSuccess to be called', () => {
        const payload: AdjustmentSearchItemPayloadSuccess = dummySearchADJ;

        const action = new actions.SearchAdjustmentSuccess(payload);

        const result: OtherIssuesState = otherIssuesReducer(
          initialState,
          action
        );
        expect(result.isSearchingAdjustment).toBe(false);
        expect(result.hasSearchedItemAdjustment).toBe(true);
        expect(result.searchedAdjustmentItems).toBeTruthy();
        expect(result.error).toBeNull();
      });
      it('SearchAdjustmentFailre to be called', () => {
        const payload: CustomErrors = CustomErrorAdaptor.fromJson(
          Error('Some Error')
        );
        const action = new actions.SearchAdjustmentFailure(payload);

        const result: OtherIssuesState = otherIssuesReducer(
          initialState,
          action
        );
        expect(result.isSearchingAdjustment).toBe(false);
        expect(result.hasSearchedItemAdjustment).toBe(false);

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

        const action = new actions.SearchPSV(payload);

        const result: OtherIssuesState = otherIssuesReducer(
          initialState,
          action
        );
        expect(result.isSearchingPSV).toBe(true);
        expect(result.hasSearchedItemPSV).toBe(false);

        expect(result.error).toBeNull();
      });
      it('SearchPSVSuccess to be called', () => {
        const payload: PSVSearchItemPayloadSuccess = dummySearchADJ;

        const action = new actions.SearchPSVSuccess(payload);

        const result: OtherIssuesState = otherIssuesReducer(
          initialState,
          action
        );
        expect(result.isSearchingPSV).toBe(false);
        expect(result.hasSearchedItemPSV).toBe(true);
        expect(result.searchedPSVItems).toBeTruthy();
        expect(result.error).toBeNull();
      });
      it('SearchPSVFailre to be called', () => {
        const payload: CustomErrors = CustomErrorAdaptor.fromJson(
          Error('Some Error')
        );
        const action = new actions.SearchPSVFailure(payload);

        const result: OtherIssuesState = otherIssuesReducer(
          initialState,
          action
        );
        expect(result.isSearchingPSV).toBe(false);
        expect(result.hasSearchedItemPSV).toBe(false);

        expect(result.error.message).toBe('Some Error');
      });
    });

    describe('SearchFOC Action Test Cases', () => {
      it('SearchFOC to be called', () => {
        const payload: PSVSearchItemPayload = {
          lotNumber: '',
          productGroups: [],
          variantCode: ''
        };

        const action = new actions.SearchFOC(payload);

        const result: OtherIssuesState = otherIssuesReducer(
          initialState,
          action
        );
        expect(result.isSearchingFOC).toBe(true);
        expect(result.hasSearchedItemFOC).toBe(false);

        expect(result.error).toBeNull();
      });
      it('SearchFOCSuccess to be called', () => {
        const payload: PSVSearchItemPayloadSuccess = dummySearchADJ;

        const action = new actions.SearchFOCSuccess(payload);

        const result: OtherIssuesState = otherIssuesReducer(
          initialState,
          action
        );
        expect(result.isSearchingFOC).toBe(false);
        expect(result.hasSearchedItemFOC).toBe(true);
        expect(result.searchedFOCItems).toBeTruthy();
        expect(result.error).toBeNull();
      });
      it('SearchFOCFailre to be called', () => {
        const payload: CustomErrors = CustomErrorAdaptor.fromJson(
          Error('Some Error')
        );
        const action = new actions.SearchFOCFailure(payload);

        const result: OtherIssuesState = otherIssuesReducer(
          initialState,
          action
        );
        expect(result.isSearchingFOC).toBe(false);
        expect(result.hasSearchedItemFOC).toBe(false);
        expect(result.error.message).toBe('Some Error');
      });
    });

    describe('UpdateCartItemsAdjustment Action Test Cases', () => {
      it('UpdateCartItemsAdjustment to be called', () => {
        const payload: UpdateCartItemAdjustmentPayload = {
          id: 1,
          quantity: 1,
          weight: 0
        };
        const action = new actions.UpdateCartItemsAdjustment(payload);

        const result: OtherIssuesState = otherIssuesReducer(
          initialState,
          action
        );

        expect(result.adjustmentItemsInCarts).toBeTruthy();
        expect(result.error).toBeNull();
      });
    });

    describe('RemoveCartItemsAdjustment Action Test Cases', () => {
      it('RemoveCartItemsAdjustment to be called', () => {
        const payload: RemoveCartItemPSVPayload = {
          ids: []
        };
        const action = new actions.RemoveCartItemsAdjustment(payload);

        const result: OtherIssuesState = otherIssuesReducer(
          initialState,
          action
        );
        expect(result.hasSearchItemInCartSearch).toBe(false);
        expect(result.adjustmentItemsInCartsSearch.ids.length).toBe(0);
        expect(result.adjustmentItemsInCarts.ids.length).toBe(0);
        expect(result.error).toBeNull();
      });
    });

    describe('SearchCartItemsAdjustment Action Test Cases', () => {
      it('SearchCartItemsAdjustment to be called', () => {
        const payload: SearchCartItemPSVPayload = {
          searchValue: ''
        };
        const action = new actions.SearchCartItemsAdjustment(payload);

        const result: OtherIssuesState = otherIssuesReducer(
          initialState,
          action
        );
        expect(result.hasSearchItemInCartSearch).toBe(true);
        expect(result.adjustmentItemsInCartsSearch).toBeTruthy();
        expect(result.error).toBeNull();
      });
    });

    describe('UpdateCartItemsPSV Action Test Cases', () => {
      it('UpdateCartItemsPSV to be called', () => {
        const payload: UpdateCartItemAdjustmentPayload = {
          id: 1,
          quantity: 1,
          weight: 0
        };
        const action = new actions.UpdateCartItemsPSV(payload);

        const result: OtherIssuesState = otherIssuesReducer(
          initialState,
          action
        );

        expect(result.psvItemsInCarts).toBeTruthy();
        expect(result.error).toBeNull();
      });
    });

    describe('RemoveCartItemsPSV Action Test Cases', () => {
      it('RemoveCartItemsPSV to be called', () => {
        const payload: RemoveCartItemPSVPayload = {
          ids: []
        };
        const action = new actions.RemoveCartItemsPSV(payload);

        const result: OtherIssuesState = otherIssuesReducer(
          initialState,
          action
        );

        expect(result.psvItemsInCartsSearch.ids.length).toBe(0);
        expect(result.psvItemsInCarts.ids.length).toBe(0);
        expect(result.error).toBeNull();
      });
    });

    describe('SearchCartItemsPSV Action Test Cases', () => {
      it('SearchCartItemsPSV to be called', () => {
        const payload: SearchCartItemPSVPayload = {
          searchValue: ''
        };
        const action = new actions.SearchCartItemsPSV(payload);

        const result: OtherIssuesState = otherIssuesReducer(
          initialState,
          action
        );
        expect(result.hasSearchItemInCartSearchPSV).toBe(true);
        expect(result.psvItemsInCartsSearch).toBeTruthy();
        expect(result.error).toBeNull();
      });
    });

    describe('ResetPSVIssueData Action Test Cases', () => {
      it('ResetPSVIssueData to be called', () => {
        const action = new actions.ResetPSVIssueData();

        const result: OtherIssuesState = otherIssuesReducer(
          initialState,
          action
        );
        expect(result.hasSearchItemInCartSearchPSV).toBe(false);
        expect(result.isSearchingPSV).toBe(false);
        expect(result.hasSearchedItemPSV).toBe(false);
        expect(result.psvItemsInCarts.ids.length).toBe(0);
        expect(result.error).toBeNull();
      });
    });

    describe('ClearSearchCartItemPSV Action Test Cases', () => {
      it('ClearSearchCartItemPSV to be called', () => {
        const action = new actions.ClearSearchCartItemPSV();

        const result: OtherIssuesState = otherIssuesReducer(
          initialState,
          action
        );
        expect(result.psvItemsInCartsSearch.ids.length).toBe(0);
        expect(result.hasSearchItemInCartSearchPSV).toBe(false);
        expect(result.error).toBeNull();
      });
    });

    describe('ResetAdjustmentIssueData Action Test Cases', () => {
      it('ResetAdjustmentIssueData to be called', () => {
        const action = new actions.ResetAdjustmentIssueData();

        const result: OtherIssuesState = otherIssuesReducer(
          initialState,
          action
        );
        expect(result.hasSearchItemInCartSearch).toBe(false);
        expect(result.hasSearchedItemAdjustment).toBe(false);
        expect(result.isSearchingAdjustment).toBe(false);
        expect(result.adjustmentItemsInCartsSearch.ids.length).toBe(0);
        expect(result.adjustmentItemsInCarts.ids.length).toBe(0);
        expect(result.error).toBeNull();
      });
    });

    describe('ClearSearchCartItemAdjustment Action Test Cases', () => {
      it('ClearSearchCartItemAdjustment to be called', () => {
        const action = new actions.ClearSearchCartItemAdjustment();

        const result: OtherIssuesState = otherIssuesReducer(
          initialState,
          action
        );
        expect(result.hasSearchItemInCartSearch).toBe(false);
        expect(result.adjustmentItemsInCartsSearch.ids.length).toBe(0);
        expect(result.error).toBeNull();
      });
    });

    describe('LoadStuddedProductGroups Action Test Cases', () => {
      it('LoadStuddedProductGroupsSuccess to be called', () => {
        const payload: string[] = [];

        const action = new actions.LoadStuddedProductGroupsSuccess([
          'stone',
          'diamond'
        ]);
        const result: OtherIssuesState = otherIssuesReducer(
          initialState,
          action
        );
        expect(result.studdedProductGroups).toEqual(['stone', 'diamond']);
      });
      it('LoadStuddedProductGroupsFailre to be called', () => {
        const payload: CustomErrors = CustomErrorAdaptor.fromJson(
          Error('Some Error')
        );
        const action = new actions.LoadStuddedProductGroupsFailure(payload);

        const result: OtherIssuesState = otherIssuesReducer(
          initialState,
          action
        );

        expect(result.error.message).toBe('Some Error');
      });
    });

    describe('UpdateCartItemsFOC Action Test Cases', () => {
      it('UpdateCartItemsFOC to be called', () => {
        const payload: UpdateCartItemAdjustmentPayload = {
          id: 1,
          quantity: 1,
          weight: 0
        };
        const action = new actions.UpdateCartItemsFOC(payload);

        const result: OtherIssuesState = otherIssuesReducer(
          initialState,
          action
        );

        expect(result.focItemsInCarts).toBeTruthy();
        expect(result.error).toBeNull();
      });
    });

    describe('RemoveCartItemsFOC Action Test Cases', () => {
      it('RemoveCartItemsFOC to be called', () => {
        const payload: RemoveCartItemPSVPayload = {
          ids: []
        };
        const action = new actions.RemoveCartItemsFOC(payload);

        const result: OtherIssuesState = otherIssuesReducer(
          initialState,
          action
        );
        expect(result.hasSearchItemInCartSearchFOC).toBe(false);
        expect(result.focItemsInCartsSearch.ids.length).toBe(0);
        expect(result.focItemsInCarts.ids.length).toBe(0);
        expect(result.error).toBeNull();
      });
    });

    describe('SearchCartItemsFOC Action Test Cases', () => {
      it('SearchCartItemsFOC to be called', () => {
        const payload: SearchCartItemPSVPayload = {
          searchValue: ''
        };
        const action = new actions.SearchCartItemsFOC(payload);

        const result: OtherIssuesState = otherIssuesReducer(
          initialState,
          action
        );
        expect(result.hasSearchItemInCartSearchFOC).toBe(true);
        expect(result.focItemsInCartsSearch).toBeTruthy();
        expect(result.error).toBeNull();
      });
    });

    describe('ResetFOCIssueData Action Test Cases', () => {
      it('ResetFOCIssueData to be called', () => {
        const action = new actions.ResetFOCIssueData();

        const result: OtherIssuesState = otherIssuesReducer(
          initialState,
          action
        );
        expect(result.hasSearchItemInCartSearchFOC).toBe(false);
        expect(result.hasSearchedItemFOC).toBe(false);
        expect(result.isSearchingFOC).toBe(false);
        expect(result.focItemsInCarts.ids.length).toBe(0);
        expect(result.error).toBeNull();
      });
    });

    describe('ClearSearchCartItemFOC Action Test Cases', () => {
      it('ClearSearchCartItemFOC to be called', () => {
        const action = new actions.ClearSearchCartItemFOC();

        const result: OtherIssuesState = otherIssuesReducer(
          initialState,
          action
        );
        expect(result.hasSearchedItemFOC).toBe(false);

        expect(result.focItemsInCartsSearch.ids.length).toBe(0);
        expect(result.error).toBeNull();
      });
    });

    describe('ClearSearchInventoryItemAdjustment Action Test Cases', () => {
      it('ClearSearchInventoryItemAdjustment to be called', () => {
        const action = new actions.ClearSearchInventoryItemAdjustment();

        const result: OtherIssuesState = otherIssuesReducer(
          initialState,
          action
        );
        expect(result.isSearchingAdjustment).toBe(false);
        expect(result.hasSearchedItemAdjustment).toBe(false);
        expect(result.searchedAdjustmentItems.ids.length).toBe(0);
        expect(result.searchCountAdjustment).toBeNull();
      });
    });

    describe('ClearSearchInventoryItemPSV Action Test Cases', () => {
      it('ClearSearchInventoryItemPSV to be called', () => {
        const action = new actions.ClearSearchInventoryItemPSV();

        const result: OtherIssuesState = otherIssuesReducer(
          initialState,
          action
        );
        expect(result.isSearchingPSV).toBe(false);
        expect(result.hasSearchedItemPSV).toBe(false);
        expect(result.searchedPSVItems.ids.length).toBe(0);
        expect(result.searchCountPSV).toBeNull();
      });
    });

    describe('ClearSearchInventoryItemFOC Action Test Cases', () => {
      it('ClearSearchInventoryItemFOC to be called', () => {
        const action = new actions.ClearSearchInventoryItemFOC();

        const result: OtherIssuesState = otherIssuesReducer(
          initialState,
          action
        );
        expect(result.isSearchingFOC).toBe(false);
        expect(result.hasSearchedItemFOC).toBe(false);
        expect(result.searchedFOCItems.ids.length).toBe(0);
        expect(result.searchCountFOC).toBeNull();
      });
    });

    describe('LoadIssueADJList Action Test Cases', () => {
      it(' LoadIssueADJList to be called', () => {
        const payload: OtherIssueLoadListItemsPayload = {
          pageIndex: 0,
          pageSize: 1,
          type: 'EXH'
        };

        const action = new actions.LoadIssueADJList(payload);

        const result: OtherIssuesState = otherIssuesReducer(
          initialState,
          action
        );
        expect(result.isLoadingOtherIssuesADJList).toBe(true);

        expect(result.error).toBeNull();
      });
      it(' LoadIssueADJListSuccess to be called', () => {
        const payload: OtherIssuedataModel = dummmyIssueList;
        const action = new actions.LoadIssueADJListSuccess(payload);

        const result: OtherIssuesState = otherIssuesReducer(
          initialState,
          action
        );
        expect(result.isLoadingOtherIssuesADJList).toBe(false);
        expect(result.otherIssueADJList).toBeTruthy();
        expect(result.error).toBeNull();
      });
      it(' LoadIssueADJListFailure to be called', () => {
        const payload: CustomErrors = CustomErrorAdaptor.fromJson(
          Error('Some Error')
        );
        const action = new actions.LoadIssueADJListFailure(payload);

        const result: OtherIssuesState = otherIssuesReducer(
          initialState,
          action
        );
        expect(result.isLoadingOtherIssuesADJList).toBe(false);

        expect(result.error.message).toBe('Some Error');
      });
    });

    describe('ResetIssueListData Action Test Cases', () => {
      it('ResetIssueListData to be called', () => {
        const action = new actions.ResetIssueListData();

        const result: OtherIssuesState = otherIssuesReducer(
          initialState,
          action
        );

        expect(result.pendingOtherIssuesSTNCount).toBe(0);

        expect(result.otherIssuesList.ids.length).toBe(0);
        expect(result.otherIssueLoanList.ids.length).toBe(0);
        expect(result.otherIssuePSVList.ids.length).toBe(0);
        expect(result.otherIssueADJList.ids.length).toBe(0);

        expect(result.otherIssueLossList.ids.length).toBe(0);
        expect(result.otherIssueFOCList.ids.length).toBe(0);

        expect(result.totalElementsOtherIssues).toBe(0);
        expect(result.error).toBeNull();
      });
    });

    describe('CancelStockRequest Action Test Cases', () => {
      it(' CancelStockRequest to be called', () => {
        const payload: CancelOtherRequestPayload = {
          id: 0,
          requestType: ''
        };

        const action = new actions.CancelStockRequest(payload);

        const result: OtherIssuesState = otherIssuesReducer(
          initialState,
          action
        );
        expect(result.isLoadingCancelStockRequestResponse).toBe(true);

        expect(result.error).toBeNull();
      });
      it(' CancelStockRequestSuccess to be called', () => {
        const payload: any = [];
        const action = new actions.CancelStockRequestSuccess(payload);

        const result: OtherIssuesState = otherIssuesReducer(
          initialState,
          action
        );
        expect(result.isLoadingCancelStockRequestResponse).toBe(false);
        expect(result.cancelStockRequestResponse).toBeTruthy();
        expect(result.error).toBeNull();
      });
      it(' CancelStockRequestFailure to be called', () => {
        const payload: CustomErrors = CustomErrorAdaptor.fromJson(
          Error('Some Error')
        );
        const action = new actions.CancelStockRequestFailure(payload);

        const result: OtherIssuesState = otherIssuesReducer(
          initialState,
          action
        );
        expect(result.isLoadingCancelStockRequestResponse).toBe(false);

        expect(result.error.message).toBe('Some Error');
      });
    });

    describe('PrintOtherIssues Action Test Cases', () => {
      it(' PrintOtherIssues to be called', () => {
        const payload: PrintOtherIssuePayload = {
          id: 1,
          requestType: ''
        };

        const action = new actions.PrintOtherIssues(payload);

        const result: OtherIssuesState = otherIssuesReducer(
          initialState,
          action
        );

        expect(result.printDataResponse).toBeNull();
        expect(result.error).toBeNull();
      });
      it(' PrintOtherIssuesSuccess to be called', () => {
        const payload: any = [];
        const action = new actions.PrintOtherIssuesSuccess(payload);

        const result: OtherIssuesState = otherIssuesReducer(
          initialState,
          action
        );
        expect(result.printDataResponse).toBeTruthy();

        expect(result.error).toBeNull();
      });
      it(' PrintOtherIssuesFailure to be called', () => {
        const payload: CustomErrors = CustomErrorAdaptor.fromJson(
          Error('Some Error')
        );
        const action = new actions.PrintOtherIssuesFailure(payload);

        const result: OtherIssuesState = otherIssuesReducer(
          initialState,
          action
        );
        expect(result.printDataResponse).toBeNull();
        expect(result.error.message).toBe('Some Error');
      });
    });

    describe('LoadProductGroups Action Test Cases', () => {
      it(' LoadProductGroups to be called', () => {
        const payload = '';
        const action = new actions.LoadProductGroups(payload);

        const result: OtherIssuesState = otherIssuesReducer(
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
        const action = new actions.LoadProductGroupsSuccess(payload);

        const result: OtherIssuesState = otherIssuesReducer(
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
        const action = new actions.LoadProductGroupsFailure(payload);

        const result: OtherIssuesState = otherIssuesReducer(
          initialState,
          action
        );
        expect(result.isLoading).toBe(false);

        expect(result.error.message).toBe('Some Error');
      });
    });

    describe('LoadProductCategories Action Test Cases', () => {
      it(' LoadProductCategories to be called', () => {
        const action = new actions.LoadProductCategories();

        const result: OtherIssuesState = otherIssuesReducer(
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
        const action = new actions.LoadProductCategoriesSuccess(payload);

        const result: OtherIssuesState = otherIssuesReducer(
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
        const action = new actions.LoadProductCategoriesFailure(payload);

        const result: OtherIssuesState = otherIssuesReducer(
          initialState,
          action
        );
        expect(result.isLoading).toBe(false);

        expect(result.error.message).toBe('Some Error');
      });
    });

    describe('SetFilterDataAllProducts Action Test Cases', () => {
      it('SetFilterDataAllProducts to be called', () => {
        const payload = {};
        const action = new actions.SetFilterDataAllProducts(payload);

        const result: OtherIssuesState = otherIssuesReducer(
          initialState,
          action
        );

        expect(result.filterDataAllProducts).toBeTruthy();
        expect(result.error).toBeNull();
      });
    });

    describe('SetFilterDataSelectedProducts Action Test Cases', () => {
      it('SetFilterDataSelectedProducts to be called', () => {
        const payload = {};
        const action = new actions.SetFilterDataSelectedProducts(payload);

        const result: OtherIssuesState = otherIssuesReducer(
          initialState,
          action
        );

        expect(result.filterDataSelectedProducts).toBeTruthy();
        expect(result.error).toBeNull();
      });
    });

    describe('SetSortDataAllProducts Action Test Cases', () => {
      it('SetSortDataAllProducts to be called', () => {
        const action = new actions.SetSortDataAllProducts([]);

        const result: OtherIssuesState = otherIssuesReducer(
          initialState,
          action
        );

        expect(result.sortDataAllProducts).toBeTruthy();
        expect(result.error).toBeNull();
      });
    });

    describe('SetSortDataSelectedProducts Action Test Cases', () => {
      it('SetSortDataSelectedProducts to be called', () => {
        const action = new actions.SetSortDataSelectedProducts([]);

        const result: OtherIssuesState = otherIssuesReducer(
          initialState,
          action
        );

        expect(result.sortDataSelectedProducts).toBeTruthy();
        expect(result.error).toBeNull();
      });
    });

    describe('SetFilterDataOtherIssue Action Test Cases', () => {
      it('SetFilterDataOtherIssue to be called', () => {
        const action = new actions.SetFilterDataOtherIssue({});

        const result: OtherIssuesState = otherIssuesReducer(
          initialState,
          action
        );

        expect(result.filterDataOtherIssue).toBeTruthy();
        expect(result.error).toBeNull();
      });
    });

    describe('SetSortDataOtherIssue Action Test Cases', () => {
      it('SetSortDataOtherIssue to be called', () => {
        const action = new actions.SetSortDataOtherIssue([]);

        const result: OtherIssuesState = otherIssuesReducer(
          initialState,
          action
        );

        expect(result.sortDataotherIssue).toBeTruthy();
        expect(result.error).toBeNull();
      });
    });
  });
});
