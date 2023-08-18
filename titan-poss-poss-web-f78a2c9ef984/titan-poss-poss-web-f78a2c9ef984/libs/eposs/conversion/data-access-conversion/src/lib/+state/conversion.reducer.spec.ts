import {
  BinCode,
  ConversionApprovalDetailsPayload,
  ConversionHistoryAdvancedFilterPayload,
  ConversionHistoryItems,
  ConversionHistoryItemsPayload,
  ConversionHistoryItemsSuccessPayload,
  ConversionHistorySuccessPayload,
  ConversionInventoryItem,
  ConversionItem,
  ConversionItemPayload,
  ConversionLoadItemsPayload,
  ConversionRequestItems,
  ConversionRequestResponse,
  ConversionRequests,
  ConversionRequestsResponse,
  ConversionResponse,
  ConversionSplitItemDetailsDataPayload,
  ConversionSplitItemPayload,
  ConversionSplitReqItemPayload,
  ConversionSplitReqPayload,
  ConvertedTransactionHistoryPayload,
  CustomErrors,
  LoadConversionRequestsPayload,
  RequestSentHistoryPayload
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import * as moment from 'moment';
import * as actions from './conversion.actions';
import {
  conversionRequestAdaptor,
  conversionRequestHistoryAdaptor,
  itemAdapter
} from './conversion.entity';
import { ConversionReducer, initialState } from './conversion.reducer';
import { ConversionState } from './conversion.state';

describe('Conversion Reducer Testing Suite', () => {
  const itemCode = '501090FGALAP70';
  const conversionInventoryItem: ConversionInventoryItem = {
    availableQuantity: 1,
    availableValue: 166396,
    availableWeight: 3.905,
    binCode: 'AREPLNISH',
    binGroupCode: 'STN',
    currencyCode: 'INR',
    id: 'CB45B857-57A4-467C-A97E-BCF7193585F1',
    imageURL: '/productcatalogue/ProductImages/1090FGA.jpg',
    itemCode: '501090FGALAP70',
    isLoadingImage: true,
    isLoadingThumbnailImage: false,
    thumbnailImageURL: 'abcdefg',
    itemDetails: {
      type: 'ITEM_DETAILS',
      data: {
        stoneValue: 141200.0,
        hallMarkRemarks1: '',
        hallMarkingCode: '',
        hallMarkingCentreName: '',
        hallMarkRemarks: '',
        hallMarkedDate: null,
        isHallMarking: true
      }
    },
    lotNumber: '3IH005125',
    mfgDate: moment(1636309800000),
    productCategory: 'F',
    productCategoryDesc: 'FINGER RING',
    productGroup: '77',
    productGroupDesc: 'Studded - Solitaire',
    status: null,
    stdValue: 166396,
    stdWeight: 3.905,
    weightUnit: 'gms',
    isStudded: false
  };
  const conversionLoadItemsPayload: ConversionLoadItemsPayload = {
    itemCode: '501090FGALAP70',
    lotNumber: '3IH005125',
    itemWeight: 3.905,
    binCode: 'AREPLNISH'
  };
  const conversionItem: ConversionItem = {
    autoApproved: false,
    binCode: 'AREPLNISH',
    childItems: [],
    complexityCode: 'PNA',
    currencyCode: 'INR',
    imageURL: '/productcatalogue/ProductImages/1090FGA.jpg',
    inventoryId: 'CB45B857-57A4-467C-A97E-BCF7193585F1',
    itemCode: '501090FGALAP70',
    isLoadingImage: true,
    isLoadingThumbnailImage: false,
    thumbnailImageURL: 'abcdefg',
    itemDescription: 'FINGER RING/D(100-150)/B(40-49 CENTS)/SI/G-H',
    lotNumber: '3IH005125',
    productCategory: 'F',
    productCategoryDesc: 'FINGER RING',
    productGroup: '77',
    productGroupDesc: 'Studded - Solitaire',
    productType: null,
    stdValue: 166396,
    stdWeight: 3.905,
    stoneValue: null,
    weightUnit: 'gms',
    isStudded: false
  };
  const conversionItemPayload: ConversionItemPayload = {
    binCode: 'AREPLNISH',
    inventoryId: 'CB45B857-57A4-467C-A97E-BCF7193585F1',
    itemCode: '501090FGALAP70',
    lotNumber: '3IH005125',
    measuredWeight: 3.905
  };
  const conversionSplitItemPayload: ConversionSplitItemPayload = {
    issueItems: [conversionItemPayload],
    receiveItems: [conversionItemPayload],
    rsoName: ''
  };
  const conversionResponse: ConversionResponse = {
    currencyCode: 'INR',
    destDocDate: moment(456),
    destDocNo: 12,
    destLocationCode: 'CPD',
    id: 12,
    orderType: 'CM',
    srcDocDate: moment(123),
    srcDocNo: 12,
    srcFiscalYear: 12,
    srcLocationCode: 'CPD',
    status: null,
    totalValue: 166396,
    totalWeight: 3.905,
    weightUnit: 'gms',
    totalQuantity: 1
  };
  const conversionApprovalDetailsPayload: ConversionApprovalDetailsPayload = {
    data: null,
    type: 'ITEM_DETAILS'
  };
  const conversionSplitItemDetailsDataPayload: ConversionSplitItemDetailsDataPayload = {
    remarks: 'good',
    itemCode: '123',
    netWeight: 3.123,
    stonePrice: 12345,
    complexityCode: 123,
    sold: 'yes',
    itemType: 'AB'
  };
  const conversionSplitReqItemPayload: ConversionSplitReqItemPayload = {
    binCode: 'AREPLNISH',
    inventoryId: 'CB45B857-57A4-467C-A97E-BCF7193585F1',
    itemCode: '501090FGALAP70',
    itemDetails: {
      type: 'ITEM_DETAILS',
      data: conversionSplitItemDetailsDataPayload
    },
    lotNumber: '3IH005125',
    measuredWeight: 3.905,
    quantity: 1
  };
  const conversionSplitReqPayload: ConversionSplitReqPayload = {
    otherDetails: conversionApprovalDetailsPayload,
    items: [conversionSplitReqItemPayload],
    remarks: null
  };
  const conversionRequestResponse: ConversionRequestResponse = {
    currencyCode: 'INR',
    destDocDate: moment(456),
    destDocNo: 12,
    destLocationCode: 'CPD',
    id: 12,
    orderType: 'CM',
    reqDocDate: moment(123),
    reqDocNo: 123,
    requestType: 'REQUEST',
    srcDocDate: moment(123),
    srcDocNo: 12,
    srcFiscalYear: 12,
    srcLocationCode: 'CPD',
    status: 'PENDING',
    totalAvailableQuantity: 12,
    totalMeasuredQuantity: 12,
    totalAvailableValue: 12,
    totalMeasuredValue: 12,
    totalAvailableWeight: 12,
    totalMeasuredWeight: 12,
    weightUnit: 'gms'
  };
  const loadConversionRequestsPayload: LoadConversionRequestsPayload = {
    pageIndex: 0,
    pageSize: 8
  };
  const conversionRequests: ConversionRequests = {
    id: 12,
    srcDocNo: 12,
    status: 'PENDING',
    createdDate: moment(123),
    totalQuantity: 12,
    totalWeight: 12,
    totalValue: 12,
    otherDetails: null,
    approvalRemarks: 'approved'
  };
  const conversionRequestsResponse: ConversionRequestsResponse = {
    conversionRequestsList: [conversionRequests],
    count: 2
  };
  const conversionRequestItems: ConversionRequestItems = {
    binCode: 'AREPLNISH',
    imageURL: '/productcatalogue/ProductImages/1090FGA.jpg',
    inventoryId: 'CB45B857-57A4-467C-A97E-BCF7193585F1',
    itemCode: '501090FGALAP70',
    isLoadingImage: true,
    isLoadingThumbnailImage: false,
    thumbnailImageURL: 'abcdefg',
    itemDetails: {
      complexityCode: '123',
      itemCode: '123',
      itemType: 'AB',
      netWeight: '3.123',
      remarks: 'good',
      sold: 'yes',
      stonePrice: '12345'
    },
    lotNumber: '3IH005125',
    mfgDate: moment(123),
    productCategory: 'F',
    productCategoryDesc: 'FINGER RING',
    productGroup: '77',
    productGroupDesc: 'Studded - Solitaire',
    stdValue: 166396,
    stdWeight: 3.905,
    weightUnit: 'gms',
    isStudded: false
  };
  const binCode: BinCode = { binCode: 'ONE', description: 'One' };
  const requestSentHistoryPayload: RequestSentHistoryPayload = {
    requestSentPayload: {
      actionType: 'REQUEST_SENT',
      dateRangeType: 'CUSTOM',
      endDate: '12312321321',
      locationCode: '123123213',
      reqDocNo: 12,
      reqFiscalYear: '2021',
      startDate: '123123213',
      statuses: []
    },
    pageIndex: 0,
    pageSize: 10,
    requestType: 'REQUEST'
  };
  const conversionHistory = {
    id: 12,
    srcLocationCode: 'CPD',
    destLocationCode: 'CPD',
    status: 'PENDING',
    weightUnit: '12',
    currencyCode: 'INR',
    srcLocationDescription: 'CPD',
    destLocationDescription: '123',
    srcDocNo: 12,
    srcFiscalYear: 12,
    srcDocDate: moment(123),
    destDocNo: '12',
    destDocDate: moment(456),
    totalAvailableQuantity: 12,
    totalMeasuredQuantity: 12,
    totalAvailableValue: 12,
    totalMeasuredValue: 12,
    totalAvailableWeight: 12,
    totalMeasuredWeight: 12,
    reqDocDate: moment(123),
    reqDocNo: 123,
    reqLocationCode: 'CPD',
    requestType: 'REQUEST',
    remarks: 'good',
    prevTransaction: 12,
    rsoName: 'RSO'
  };
  const conversionHistorySuccessPayload: ConversionHistorySuccessPayload = {
    requestSentHistory: [conversionHistory],
    count: 10
  };
  const conversionHistoryPayload: ConversionHistoryItemsPayload = {
    historyItemsPaylod: {
      binCodes: [],
      binGroupCode: '123',
      itemCode: '123',
      lotNumber: '123',
      productCategories: [],
      productGroups: []
    },
    pageIndex: 0,
    pageSize: 10,
    id: 123,
    requestType: 'ICT',
    preTransactionId: 12
  };
  const conversionHistoryItems: ConversionHistoryItems = {
    id: '123',
    itemCode: '123',
    lotNumber: '123',
    mfgDate: moment(123),
    productCategory: '123',
    productGroup: '123',
    productCategoryDesc: '123',
    productGroupDesc: '12',
    binCode: '123',
    binGroupCode: '123',
    stdValue: 123,
    stdWeight: 123,
    currencyCode: 'INR',
    weightUnit: 'gms',
    status: 'PENDING',
    imageURL: 'abcdef',
    isLoadingImage: true,
    isLoadingThumbnailImage: false,
    thumbnailImageURL: 'abcdefg',
    itemDetails: {
      remarks: 'good',
      itemCode: '123',
      netWeight: 'gms',
      stonePrice: '12',
      complexityCode: '123',
      sold: 'yes',
      itemType: 'AB'
    },
    availableQuantity: 12,
    availableWeight: 12,
    availableValue: 12,
    measuredQuantity: 12,
    measuredWeight: 12,
    measuredValue: 12,
    orderType: 'CM',
    inventoryId: '123',
    isStudded: true
  };
  const itemsResponse: ConversionHistoryItemsSuccessPayload = {
    items: [conversionHistoryItems],
    count: 10
  };
  const convertedTransactionPayload: ConvertedTransactionHistoryPayload = {
    convertedTransaction: {
      actionType: 'REQUEST',
      dateRangeType: 'CUSTOM',
      endDate: 12222,
      issueDocNo: 13,
      issueFiscalYear: 2020,
      receiveDocNo: 12,
      receiveFiscalYear: 2021,
      startDate: 12312312,
      statuses: []
    },
    pageIndex: 0,
    pageSize: 12,
    transactionType: 'TRANACTION'
  };
  const advanceFilter: ConversionHistoryAdvancedFilterPayload = {
    requestFromDate: 123,
    requestToDate: 12312312,
    fiscalYear: 2020,
    statuses: [],
    docNo: 12
  };

  describe('Testing LoadSearchVarient Functionality', () => {
    beforeEach(() => {});

    it('Testing LOAD_SEARCH_VARIENT', () => {
      const action = new actions.LoadSearchVarient(itemCode);
      const result: ConversionState = ConversionReducer(initialState, action);
      expect(result.isSearchingItems).toBe(true);
      expect(result.hasSearchedItems).toBe(null);
      expect(result.conversionItems).toBe(null);
      expect(result.error).toBe(null);
    });

    it('Testing LOAD_SEARCH_VARIENT_SUCCESS', () => {
      const action = new actions.LoadSearchVarientSuccess([
        conversionInventoryItem
      ]);
      const result: ConversionState = ConversionReducer(initialState, action);
      expect(result.searchedItemsList).toBe(action.payload);
      expect(result.isSearchingItems).toBe(false);
      expect(result.hasSearchedItems).toBe(true);
    });

    it('Testing LOAD_SEARCH_VARIENT_FAILURE', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new actions.LoadSearchVarientFailure(payload);
      const result: ConversionState = ConversionReducer(initialState, action);
      expect(result.isSearchingItems).toBe(false);
      expect(result.hasSearchedItems).toBe(false);
      expect(result.error).toBe(action.payload);
    });
  });
  describe('Testing ClearVarientSearchList, AddToItemList, RemoveFromItemList, ClearLoadedConversionItem, ClearSearchRequests Functionality', () => {
    beforeEach(() => {});

    it('Testing CLEAR_VARIENT_SEARCH_LIST', () => {
      const action = new actions.ClearVarientSearchList();
      const result: ConversionState = ConversionReducer(initialState, action);
      expect(result.hasSearchedItems).toBe(false);
      expect(result.searchedItemsList).toEqual([]);
    });
    it('Testing ADD_TO_SELECTED_VARIENT', () => {
      const action = new actions.AddToItemList(conversionInventoryItem);
      const result: ConversionState = ConversionReducer(initialState, action);
      expect(result.selectedVarient).toEqual(
        itemAdapter.addOne(action.payload, initialState.selectedVarient)
      );
      expect(result.hasselectedVarient).toBe(true);
    });
    it('Testing REMOVE_FROM_SELECTED_VARIENT', () => {
      const action = new actions.RemoveFromItemList();
      const result: ConversionState = ConversionReducer(initialState, action);
      expect(result.selectedVarient).toEqual(
        itemAdapter.removeAll(initialState.selectedVarient)
      );
      expect(result.hasselectedVarient).toBe(false);
    });
    it('Testing CLEAR_LOADED_CONVERSION_ITEMS', () => {
      const action = new actions.ClearLoadedConversionItem();
      const result: ConversionState = ConversionReducer(initialState, action);
      expect(result.hasConversionItems).toBe(false);
      expect(result.conversionRequests).toEqual(
        conversionRequestAdaptor.getInitialState()
      );
    });
    it('Testing SEARCH_CLEAR', () => {
      const action = new actions.ClearSearchRequests();
      const result: ConversionState = ConversionReducer(initialState, action);
      expect(result.isSearchingRequests).toBe(false);
      expect(result.hasSearchedConversionRequests).toBe(true);
      expect(result.isLoadingRequests).toBe(false);
      expect(result.searchedConversionRequests).toEqual(
        conversionRequestAdaptor.removeAll(
          initialState.searchedConversionRequests
        )
      );
      expect(result.conversionRequests).toEqual(
        conversionRequestAdaptor.removeAll(initialState.conversionRequests)
      );
    });
  });
  describe('Testing LoadConversionItems Functionality', () => {
    beforeEach(() => {});

    it('Testing LOAD_CONVERSION_ITEMS', () => {
      const action = new actions.LoadConversionItems(
        conversionLoadItemsPayload
      );
      const result: ConversionState = ConversionReducer(initialState, action);
      expect(result.isLoadingConversionItems).toBe(true);
      expect(result.conversionItems).toBe(null);
      expect(result.error).toBe(null);
    });

    it('Testing LOAD_CONVERSION_ITEMS_SUCCESS', () => {
      const action = new actions.LoadConversionItemsSuccess(conversionItem);
      const result: ConversionState = ConversionReducer(initialState, action);
      expect(result.isLoadingConversionItems).toBe(false);
      expect(result.hasConversionItems).toBe(true);
      expect(result.conversionItems).toBe(action.payload);
    });

    it('Testing LOAD_CONVERSION_ITEMS_FAILURE', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new actions.LoadConversionItemsFailure(payload);
      const result: ConversionState = ConversionReducer(initialState, action);
      expect(result.isLoadingConversionItems).toBe(false);
      expect(result.hasConversionItems).toBe(false);
      expect(result.error).toBe(action.payload);
    });
  });
  describe('Testing SplitItems Functionality', () => {
    beforeEach(() => {});

    it('Testing SPLIT_ITEM', () => {
      const action = new actions.SplitItems(conversionSplitItemPayload);
      const result: ConversionState = ConversionReducer(initialState, action);
      expect(result.ItemSplitResponse).toBe(null);
      expect(result.isSplitting).toBe(true);
      expect(result.isSplitted).toBe(null);
      expect(result.error).toBe(null);
    });

    it('Testing SPLIT_ITEM_SUCCESS', () => {
      const action = new actions.SplitItemsSuccess(conversionResponse);
      const result: ConversionState = ConversionReducer(initialState, action);
      expect(result.ItemSplitResponse).toBe(action.payload);
      expect(result.isSplitting).toBe(false);
      expect(result.isSplitted).toBe(true);
    });

    it('Testing SPLIT_ITEM_FAILURE', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new actions.SplitItemsFailure(payload);
      const result: ConversionState = ConversionReducer(initialState, action);
      expect(result.isSplitting).toBe(false);
      expect(result.isSplitted).toBe(false);
      expect(result.error).toBe(action.payload);
    });
  });
  describe('Testing ConfirmConversion Functionality', () => {
    beforeEach(() => {});

    it('Testing CONFIRM_CONVERSION', () => {
      const action = new actions.ConfirmConversion(conversionSplitItemPayload);
      const result: ConversionState = ConversionReducer(initialState, action);
      expect(result.ItemSplitResponse).toBe(null);
      expect(result.isSplitting).toBe(true);
      expect(result.isSplitted).toBe(null);
      expect(result.error).toBe(null);
    });

    it('Testing CONFIRM_CONVERSION_SUCCESS', () => {
      const action = new actions.ConfirmConversionSuccess(conversionResponse);
      const result: ConversionState = ConversionReducer(initialState, action);
      expect(result.ItemSplitResponse).toBe(action.payload);
      expect(result.isSplitting).toBe(false);
      expect(result.isSplitted).toBe(true);
    });

    it('Testing CONFIRM_CONVERSION_FAILURE', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new actions.ConfirmConversionFailure(payload);
      const result: ConversionState = ConversionReducer(initialState, action);
      expect(result.isSplitting).toBe(false);
      expect(result.isSplitted).toBe(false);
      expect(result.error).toBe(action.payload);
    });
  });
  describe('Testing SendConversionRequest Functionality', () => {
    beforeEach(() => {});

    it('Testing SEND_CONVERSION_REQUEST', () => {
      const action = new actions.SendConversionRequest(
        conversionSplitReqPayload
      );
      const result: ConversionState = ConversionReducer(initialState, action);
      expect(result.error).toBe(null);
      expect(result.isSendingRequest).toBe(true);
    });

    it('Testing SEND_CONVERSION_REQUEST_SUCCESS', () => {
      const action = new actions.SendConversionRequestSuccess(
        conversionRequestResponse
      );
      const result: ConversionState = ConversionReducer(initialState, action);
      expect(result.isSendingRequest).toBe(false);
      expect(result.conversionRequestResponse).toBe(action.payload);
      expect(result.hasRequestResponse).toBe(true);
    });

    it('Testing SEND_CONVERSION_REQUEST_FAILURE', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new actions.SendConversionRequestFailure(payload);
      const result: ConversionState = ConversionReducer(initialState, action);
      expect(result.error).toBe(action.payload);
      expect(result.isSendingRequest).toBe(false);
      expect(result.hasRequestResponse).toBe(false);
    });
  });
  describe('Testing LoadRequestsCount Functionality', () => {
    beforeEach(() => {});

    it('Testing LOAD_REQUESTS_COUNT', () => {
      const action = new actions.LoadRequestsCount();
      const result: ConversionState = ConversionReducer(initialState, action);
      expect(result.isLoadingCount).toBe(true);
      expect(result.error).toBe(null);
    });

    it('Testing LOAD_REQUESTS_COUNT_SUCCESS', () => {
      const action = new actions.LoadRequestsCountSuccess(1);
      const result: ConversionState = ConversionReducer(initialState, action);
      expect(result.conversionRequestsCount).toBe(action.payload);
      expect(result.isLoadingCount).toBe(false);
    });

    it('Testing LOAD_REQUESTS_COUNT_FAILURE', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new actions.LoadRequestsCountFailure(payload);
      const result: ConversionState = ConversionReducer(initialState, action);
      expect(result.error).toBe(action.payload);
    });
  });
  describe('Testing LoadConversionRequests Functionality', () => {
    beforeEach(() => {});

    it('Testing LOAD_CONVERSION_REQUESTS', () => {
      const action = new actions.LoadConversionRequests(
        loadConversionRequestsPayload
      );
      const result: ConversionState = ConversionReducer(initialState, action);
      expect(result.isLoadingRequests).toBe(true);
      expect(result.error).toBe(null);
    });

    it('Testing LOAD_CONVERSION_REQUESTS_SUCCESS', () => {
      const action = new actions.LoadConversionRequestsSuccess(
        conversionRequestsResponse
      );
      const result: ConversionState = ConversionReducer(initialState, action);
      expect(result.isLoadingRequests).toBe(false);
      expect(result.conversionRequests).toEqual(
        conversionRequestAdaptor.addMany(
          action.payload.conversionRequestsList,
          initialState.conversionRequests
        )
      );
      expect(result.conversionRequestsCount).toBe(action.payload.count);
    });

    it('Testing LOAD_CONVERSION_REQUESTS_FAILURE', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new actions.LoadConversionRequestsFailure(payload);
      const result: ConversionState = ConversionReducer(initialState, action);
      expect(result.isLoadingRequests).toBe(false);
      expect(result.error).toBe(action.payload);
    });
  });
  describe('Testing SearchConversionRequests Functionality', () => {
    beforeEach(() => {});

    it('Testing SEARCH_CONVERSION_REQUESTS', () => {
      const action = new actions.SearchConversionRequests(12);
      const result: ConversionState = ConversionReducer(initialState, action);
      expect(result.isSearchingRequests).toBe(true);
      expect(result.error).toBe(null);
    });

    it('Testing SEARCH_CONVERSION_REQUESTS_SUCCESS', () => {
      const action = new actions.SearchConversionRequestsSuccess([
        conversionRequests
      ]);
      const result: ConversionState = ConversionReducer(initialState, action);
      expect(result.isSearchingRequests).toBe(false);
      expect(result.hasSearchedConversionRequests).toBe(true);
      expect(result.searchedConversionRequests).toEqual(
        conversionRequestAdaptor.setAll(
          action.payload,
          initialState.searchedConversionRequests
        )
      );
    });

    it('Testing SEARCH_CONVERSION_REQUESTS_FAILURE', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new actions.SearchConversionRequestsFailure(payload);
      const result: ConversionState = ConversionReducer(initialState, action);
      expect(result.isSearchingRequests).toBe(false);
      expect(result.hasSearchedConversionRequests).toBe(false);
      expect(result.error).toBe(action.payload);
    });
  });
  describe('Testing LoadSelectedRequest Functionality', () => {
    beforeEach(() => {});

    it('Testing LOAD_SELECTED_REQUEST', () => {
      const action = new actions.LoadSelectedRequest(12);
      const result: ConversionState = ConversionReducer(initialState, action);
      expect(result.isLoadingSelectedRequest).toBe(true);
      expect(result.selectedRequest).toBe(null);
      expect(result.error).toBe(null);
    });

    it('Testing LOAD_SELECTED_REQUEST_SUCCESS', () => {
      const action = new actions.LoadSelectedRequestSuccess(conversionRequests);
      const result: ConversionState = ConversionReducer(initialState, action);
      expect(result.selectedRequest).toBe(action.payload);
      expect(result.isLoadingSelectedRequest).toBe(false);
    });

    it('Testing LOAD_SELECTED_REQUEST_FAILURE', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new actions.LoadSelectedRequestFailure(payload);
      const result: ConversionState = ConversionReducer(initialState, action);
      expect(result.isLoadingSelectedRequest).toBe(false);
      expect(result.error).toBe(action.payload);
    });
  });
  describe('Testing LoadSelectedRequestData Functionality', () => {
    beforeEach(() => {});

    it('Testing LOAD_SELECTED_REQUEST_DATA', () => {
      const action = new actions.LoadSelectedRequestData(12);
      const result: ConversionState = ConversionReducer(initialState, action);
      expect(result.isLoadingSelectedRequestData).toBeTruthy();
      expect(result.selectedRequestData.length).toBe(0);
      expect(result.error).toBe(null);
    });

    it('Testing LOAD_SELECTED_REQUEST_DATA_SUCCESS', () => {
      const action = new actions.LoadSelectedRequestDataSuccess([
        conversionRequestItems
      ]);
      const result: ConversionState = ConversionReducer(initialState, action);
      expect(result.isLoadingSelectedRequestData).toBe(false);
      expect(result.selectedRequestData.length).toBe(1);
    });

    it('Testing LOAD_SELECTED_REQUEST_DATA_FAILURE', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new actions.LoadSelectedRequestDataFailure(payload);
      const result: ConversionState = ConversionReducer(initialState, action);
      expect(result.isLoadingSelectedRequestData).toBe(false);
      expect(result.error).toBe(action.payload);
    });
  });
  describe('Testing LoadRsoDetails Functionality', () => {
    beforeEach(() => {});

    it('Testing LOAD_RSO_DETAILS', () => {
      const action = new actions.LoadRsoDetails();
      const result: ConversionState = ConversionReducer(initialState, action);
      expect(result.rsoDetails).toEqual([]);
      expect(result.isLoadingRsoDetails).toBe(true);
      expect(result.error).toBe(null);
    });

    it('Testing LOAD_RSO_DETAILS_SUCCESS', () => {
      const action = new actions.LoadRsoDetailsSuccess(['rso']);
      const result: ConversionState = ConversionReducer(initialState, action);
      expect(result.rsoDetails).toBe(action.payload);
      expect(result.isLoadingRsoDetails).toBe(false);
      expect(result.hasRsoDetails).toBe(true);
    });

    it('Testing LOAD_RSO_DETAILS_FAILURE', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new actions.LoadRsoDetailsFailure(payload);
      const result: ConversionState = ConversionReducer(initialState, action);
      expect(result.error).toBe(action.payload);
      expect(result.isLoadingRsoDetails).toBe(false);
    });
  });
  describe('Testing LoadBinCodes Functionality', () => {
    beforeEach(() => {});

    it('Testing LOAD_BINCODES', () => {
      const action = new actions.LoadBinCodes('STN');
      const result: ConversionState = ConversionReducer(initialState, action);
      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
    });

    it('Testing LOAD_BINCODES_SUCCESS', () => {
      const action = new actions.LoadBinCodesSuccess([binCode]);
      const result: ConversionState = ConversionReducer(initialState, action);
      expect(result.binCodes).toBe(action.payload);
      expect(result.isLoading).toBe(false);
      expect(result.hasBinCodes).toBe(true);
    });

    it('Testing LOAD_BINCODES_FAILURE', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new actions.LoadBinCodesFailure(payload);
      const result: ConversionState = ConversionReducer(initialState, action);
      expect(result.error).toBe(action.payload);
      expect(result.isLoading).toBe(false);
    });
  });
  describe('Testing LoadBinCodes Functionality', () => {
    beforeEach(() => {});

    it('Testing LOAD_BINCODES', () => {
      const action = new actions.LoadBinCodes('STN');
      const result: ConversionState = ConversionReducer(initialState, action);
      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
    });

    it('Testing LOAD_BINCODES_SUCCESS', () => {
      const action = new actions.LoadBinCodesSuccess([binCode]);
      const result: ConversionState = ConversionReducer(initialState, action);
      expect(result.binCodes).toBe(action.payload);
      expect(result.isLoading).toBe(false);
      expect(result.hasBinCodes).toBe(true);
    });

    it('Testing LOAD_BINCODES_FAILURE', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new actions.LoadBinCodesFailure(payload);
      const result: ConversionState = ConversionReducer(initialState, action);
      expect(result.error).toBe(action.payload);
      expect(result.isLoading).toBe(false);
    });
  });
  describe('Testing LoadStuddedProductGroups Functionality', () => {
    beforeEach(() => {});

    it('Testing LOAD_STUDDED_PRODUCT_GROUPS_SUCCESS', () => {
      const action = new actions.LoadStuddedProductGroupsSuccess([
        'One',
        'Two',
        'Three'
      ]);
      const result: ConversionState = ConversionReducer(initialState, action);
      expect(result.studdedProductGroups).toBe(action.payload);
    });

    it('Testing LOAD_STUDDED_PRODUCT_GROUPS_FAILURE', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new actions.LoadStuddedProductGroupsFailure(payload);
      const result: ConversionState = ConversionReducer(initialState, action);
      expect(result.error).toBe(action.payload);
    });
  });
  // History Related
  describe('Testing LoadRequestSentHistory Functionality', () => {
    beforeEach(() => {});

    it('Testing LOAD_REQUEST_SENT_HISTORY', () => {
      const action = new actions.LoadRequestSentHistory(
        requestSentHistoryPayload
      );
      const result: ConversionState = ConversionReducer(initialState, action);
      expect(result.isLoadingHistory).toBe(true);
      expect(result.error).toBe(null);
    });

    it('Testing LOAD_REQUEST_SENT_HISTORY_SUCCESS', () => {
      const action = new actions.LoadRequestSentHistorySuccess(
        conversionHistorySuccessPayload
      );
      const result: ConversionState = ConversionReducer(initialState, action);
      expect(result.isLoadingHistory).toBe(false);
      expect(result.conversionHistory).toEqual(
        conversionRequestHistoryAdaptor.addMany(
          action.payload.requestSentHistory,
          initialState.conversionHistory
        )
      );
      expect(result.totalElements).toBe(action.payload.count);
    });

    it('Testing LOAD_REQUEST_SENT_HISTORY_FAILURE', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new actions.LoadRequestSentHistoryFailure(payload);
      const result: ConversionState = ConversionReducer(initialState, action);
      expect(result.error).toBe(action.payload);
      expect(result.isLoadingHistory).toBe(false);
    });
  });
  describe('Testing LoadConversionHistoryItems Functionality', () => {
    beforeEach(() => {});

    it('Testing LOAD_CONVERSION_HISTORY_ITEMS', () => {
      const action = new actions.LoadConversionHistoryItems(
        conversionHistoryPayload
      );
      const result: ConversionState = ConversionReducer(initialState, action);
      expect(result.isLoadingHistory).toBe(true);
      expect(result.error).toBe(null);
    });

    it('Testing LOAD_CONVERSION_HISTORY_ITEMS_SUCCESS', () => {
      const action = new actions.LoadConversionHistoryItemsSuccess(
        itemsResponse
      );
      const result: ConversionState = ConversionReducer(initialState, action);
      expect(result.isLoadingHistory).toBe(false);
      expect(result.conversionHistoryItems).toBe(action.payload.items);
      expect(result.historyItemsCount).toBe(action.payload.count);
    });

    it('Testing LOAD_CONVERSION_HISTORY_ITEMS_FAILURE', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new actions.LoadConversionHistoryItemsFailure(payload);
      const result: ConversionState = ConversionReducer(initialState, action);
      expect(result.error).toBe(action.payload);
      expect(result.isLoadingHistory).toBe(false);
    });
  });
  describe('Testing LoadConvertedTransactionHistory Functionality', () => {
    beforeEach(() => {});

    it('Testing LOAD_CONVERTED_TRANSACTION_HISTORY', () => {
      const action = new actions.LoadConvertedTransactionHistory(
        convertedTransactionPayload
      );
      const result: ConversionState = ConversionReducer(initialState, action);
      expect(result.isLoadingHistory).toBe(true);
      expect(result.error).toBe(null);
    });

    it('Testing LOAD_CONVERTED_TRANSACTION_HISTORY_SUCCESS', () => {
      const action = new actions.LoadConvertedTransactionHistorySuccess(
        conversionHistorySuccessPayload
      );
      const result: ConversionState = ConversionReducer(initialState, action);
      expect(result.isLoadingHistory).toBe(false);
      expect(result.conversionHistory).toEqual(
        conversionRequestHistoryAdaptor.addMany(
          action.payload.requestSentHistory,
          initialState.conversionHistory
        )
      );
      expect(result.totalElements).toBe(action.payload.count);
    });

    it('Testing LOAD_CONVERTED_TRANSACTION_HISTORY_FAILURE', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new actions.LoadConvertedTransactionHistoryFailure(
        payload
      );
      const result: ConversionState = ConversionReducer(initialState, action);
      expect(result.error).toBe(action.payload);
      expect(result.isLoadingHistory).toBe(false);
    });
  });
  describe('Testing LoadSelectedRequestHistory Functionality', () => {
    beforeEach(() => {});

    it('Testing LOAD_SELECTED_REQUEST_HISTORY', () => {
      const action = new actions.LoadSelectedRequestHistory({
        reqDocNo: 12,
        requestType: 'CM'
      });
      const result: ConversionState = ConversionReducer(initialState, action);
      expect(result.isLoadingHistory).toBe(true);
      expect(result.selectedRequestHistory).toBe(null);
      expect(result.error).toBe(null);
    });

    it('Testing LOAD_SELECTED_REQUEST_HISTORY_SUCCESS', () => {
      const action = new actions.LoadSelectedRequestHistorySuccess(
        conversionHistory
      );
      const result: ConversionState = ConversionReducer(initialState, action);
      expect(result.isLoadingHistory).toBe(false);
      expect(result.selectedRequestHistory).toBe(action.payload);
    });

    it('Testing LOAD_SELECTED_REQUEST_HISTORY_FAILURE', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new actions.LoadSelectedRequestHistoryFailure(payload);
      const result: ConversionState = ConversionReducer(initialState, action);
      expect(result.error).toBe(action.payload);
      expect(result.isLoadingHistory).toBe(false);
    });
  });
  describe('Testing ResetError, StoreRequestType, StoreAdvancedFilterData, ResetAdvanceFilter, ResetConversionHistory Functionality', () => {
    beforeEach(() => {});

    it('Testing RESET_ERROR', () => {
      const action = new actions.ResetError();
      const result: ConversionState = ConversionReducer(initialState, action);
      expect(result.error).toBe(null);
    });
    it('Testing STORE_REQUEST_TYPE', () => {
      const action = new actions.StoreRequestType('REQUEST');
      const result: ConversionState = ConversionReducer(initialState, action);
      expect(result.requestType).toBe(action.payload);
    });
    it('Testing STORE_ADVANCED_FILTER', () => {
      const action = new actions.StoreAdvancedFilterData(advanceFilter);
      const result: ConversionState = ConversionReducer(initialState, action);
      expect(result.advancedFilter).toBe(action.payload);
    });
    it('Testing RESET_ADVANCE_FILTER', () => {
      const action = new actions.ResetAdvanceFilter();
      const result: ConversionState = ConversionReducer(initialState, action);
      expect(result.advancedFilter).toEqual({
        requestFromDate: moment().startOf('day').valueOf(),
        requestToDate: moment().endOf('day').valueOf(),
        fiscalYear: null,
        statuses: [],
        docNo: null
      });
    });
    it('Testing RESET_CONVERSION_HISTORY', () => {
      const action = new actions.ResetConversionHistory();
      const result: ConversionState = ConversionReducer(initialState, action);
      expect(result.conversionHistory).toEqual(
        conversionRequestHistoryAdaptor.removeAll(
          initialState.conversionHistory
        )
      );
      expect(result.totalElements).toEqual(0);
      expect(result.conversionHistoryItems).toBe(null);
      expect(result.historyItemsCount).toEqual(0);
    });
  });
});
