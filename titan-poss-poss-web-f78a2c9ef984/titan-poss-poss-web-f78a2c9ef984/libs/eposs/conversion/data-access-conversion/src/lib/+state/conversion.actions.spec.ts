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
import {
  AddToItemList,
  ClearLoadedConversionItem,
  ClearSearchRequests,
  ClearVarientSearchList,
  ConfirmConversion,
  ConfirmConversionFailure,
  ConfirmConversionSuccess,
  ConversionActionTypes,
  LoadBinCodes,
  LoadBinCodesFailure,
  LoadBinCodesSuccess,
  LoadConversionHistoryItems,
  LoadConversionHistoryItemsFailure,
  LoadConversionHistoryItemsSuccess,
  LoadConversionItems,
  LoadConversionItemsFailure,
  LoadConversionItemsSuccess,
  LoadConversionRequests,
  LoadConversionRequestsFailure,
  LoadConversionRequestsSuccess,
  LoadConvertedTransactionHistory,
  LoadConvertedTransactionHistoryFailure,
  LoadConvertedTransactionHistorySuccess,
  LoadRequestsCount,
  LoadRequestsCountFailure,
  LoadRequestsCountSuccess,
  LoadRequestSentHistory,
  LoadRequestSentHistoryFailure,
  LoadRequestSentHistorySuccess,
  LoadRsoDetails,
  LoadRsoDetailsFailure,
  LoadRsoDetailsSuccess,
  LoadSearchVarient,
  LoadSearchVarientFailure,
  LoadSearchVarientSuccess,
  LoadSelectedRequest,
  LoadSelectedRequestData,
  LoadSelectedRequestDataFailure,
  LoadSelectedRequestDataSuccess,
  LoadSelectedRequestFailure,
  LoadSelectedRequestHistory,
  LoadSelectedRequestHistoryFailure,
  LoadSelectedRequestHistorySuccess,
  LoadSelectedRequestSuccess,
  LoadStuddedProductGroups,
  LoadStuddedProductGroupsFailure,
  LoadStuddedProductGroupsSuccess,
  RemoveFromItemList,
  ResetAdvanceFilter,
  ResetConversionHistory,
  ResetError,
  SearchConversionRequests,
  SearchConversionRequestsFailure,
  SearchConversionRequestsSuccess,
  SendConversionRequest,
  SendConversionRequestFailure,
  SendConversionRequestSuccess,
  SplitItems,
  SplitItemsFailure,
  SplitItemsSuccess,
  StoreAdvancedFilterData,
  StoreRequestType
} from './conversion.actions';

describe('Conversion Action Testing Suite', () => {
  const requestPayload: RequestSentHistoryPayload = {
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
  const response: ConversionHistorySuccessPayload = {
    requestSentHistory: [conversionHistory],
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
  const advanceFilter: ConversionHistoryAdvancedFilterPayload = {
    requestFromDate: 123,
    requestToDate: 12312312,
    fiscalYear: 2020,
    statuses: [],
    docNo: 12
  };
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

  describe('LoadSearchVarient', () => {
    it('should check correct type is used for LoadSearchVarient action ', () => {
      const action = new LoadSearchVarient(itemCode);
      expect(action.type).toEqual(ConversionActionTypes.LOAD_SEARCH_VARIENT);
      expect(action.payload).toEqual(itemCode);
    });
    it('should check correct type is used for LoadSearchVarientSuccess action ', () => {
      const action = new LoadSearchVarientSuccess([conversionInventoryItem]);
      expect(action.type).toEqual(
        ConversionActionTypes.LOAD_SEARCH_VARIENT_SUCCESS
      );
      expect(action.payload).toEqual([conversionInventoryItem]);
    });
    it('should check correct type is used for LoadSearchVarientFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadSearchVarientFailure(payload);
      expect(action.type).toEqual(
        ConversionActionTypes.LOAD_SEARCH_VARIENT_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('ClearVarientSearchList, AddToItemList, RemoveFromItemList, ClearLoadedConversionItem', () => {
    it('should check correct type is used for ClearVarientSearchList action ', () => {
      const action = new ClearVarientSearchList();
      expect(action.type).toEqual(
        ConversionActionTypes.CLEAR_VARIENT_SEARCH_LIST
      );
    });
    it('should check correct type is used for AddToItemList action ', () => {
      const action = new AddToItemList(conversionInventoryItem);
      expect(action.type).toEqual(
        ConversionActionTypes.ADD_TO_SELECTED_VARIENT
      );
    });
    it('should check correct type is used for RemoveFromItemList action ', () => {
      const action = new RemoveFromItemList();
      expect(action.type).toEqual(
        ConversionActionTypes.REMOVE_FROM_SELECTED_VARIENT
      );
    });
    it('should check correct type is used for ClearLoadedConversionItem action ', () => {
      const action = new ClearLoadedConversionItem();
      expect(action.type).toEqual(
        ConversionActionTypes.CLEAR_LOADED_CONVERSION_ITEMS
      );
    });
  });

  describe('LoadConversionItems', () => {
    it('should check correct type is used for LoadConversionItems action ', () => {
      const action = new LoadConversionItems(conversionLoadItemsPayload);
      expect(action.type).toEqual(ConversionActionTypes.LOAD_CONVERSION_ITEMS);
      expect(action.payload).toEqual(conversionLoadItemsPayload);
    });
    it('should check correct type is used for LoadConversionItemsSuccess action ', () => {
      const action = new LoadConversionItemsSuccess(conversionItem);
      expect(action.type).toEqual(
        ConversionActionTypes.LOAD_CONVERSION_ITEMS_SUCCESS
      );
      expect(action.payload).toEqual(conversionItem);
    });
    it('should check correct type is used for LoadConversionItemsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadConversionItemsFailure(payload);
      expect(action.type).toEqual(
        ConversionActionTypes.LOAD_CONVERSION_ITEMS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('SplitItems', () => {
    it('should check correct type is used for SplitItems action ', () => {
      const action = new SplitItems(conversionSplitItemPayload);
      expect(action.type).toEqual(ConversionActionTypes.SPLIT_ITEM);
      expect(action.payload).toEqual(conversionSplitItemPayload);
    });
    it('should check correct type is used for SplitItemsSuccess action ', () => {
      const action = new SplitItemsSuccess(conversionResponse);
      expect(action.type).toEqual(ConversionActionTypes.SPLIT_ITEM_SUCCESS);
      expect(action.payload).toEqual(conversionResponse);
    });
    it('should check correct type is used for SplitItemsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SplitItemsFailure(payload);
      expect(action.type).toEqual(ConversionActionTypes.SPLIT_ITEM_FAILURE);
      expect(action.payload).toEqual(payload);
    });
  });

  describe('SendConversionRequest', () => {
    it('should check correct type is used for SendConversionRequest action ', () => {
      const action = new SendConversionRequest(conversionSplitReqPayload);
      expect(action.type).toEqual(
        ConversionActionTypes.SEND_CONVERSION_REQUEST
      );
      expect(action.payload).toEqual(conversionSplitReqPayload);
    });
    it('should check correct type is used for SendConversionRequestSuccess action ', () => {
      const action = new SendConversionRequestSuccess(
        conversionRequestResponse
      );
      expect(action.type).toEqual(
        ConversionActionTypes.SEND_CONVERSION_REQUEST_SUCCESS
      );
      expect(action.payload).toEqual(conversionRequestResponse);
    });
    it('should check correct type is used for SendConversionRequestFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SendConversionRequestFailure(payload);
      expect(action.type).toEqual(
        ConversionActionTypes.SEND_CONVERSION_REQUEST_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('LoadRequestsCount', () => {
    it('should check correct type is used for LoadRequestsCount action ', () => {
      const action = new LoadRequestsCount();
      expect(action.type).toEqual(ConversionActionTypes.LOAD_REQUESTS_COUNT);
    });
    it('should check correct type is used for LoadRequestsCountSuccess action ', () => {
      const action = new LoadRequestsCountSuccess(1);
      expect(action.type).toEqual(
        ConversionActionTypes.LOAD_REQUESTS_COUNT_SUCCESS
      );
      expect(action.payload).toEqual(1);
    });
    it('should check correct type is used for LoadRequestsCountFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadRequestsCountFailure(payload);
      expect(action.type).toEqual(
        ConversionActionTypes.LOAD_REQUESTS_COUNT_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('LoadConversionRequests', () => {
    it('should check correct type is used for LoadConversionRequests action ', () => {
      const action = new LoadConversionRequests(loadConversionRequestsPayload);
      expect(action.type).toEqual(
        ConversionActionTypes.LOAD_CONVERSION_REQUESTS
      );
      expect(action.payload).toEqual(loadConversionRequestsPayload);
    });
    it('should check correct type is used for LoadConversionRequestsSuccess action ', () => {
      const action = new LoadConversionRequestsSuccess(
        conversionRequestsResponse
      );
      expect(action.type).toEqual(
        ConversionActionTypes.LOAD_CONVERSION_REQUESTS_SUCCESS
      );
      expect(action.payload).toEqual(conversionRequestsResponse);
    });
    it('should check correct type is used for LoadConversionRequestsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadConversionRequestsFailure(payload);
      expect(action.type).toEqual(
        ConversionActionTypes.LOAD_CONVERSION_REQUESTS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('SearchConversionRequests', () => {
    it('should check correct type is used for SearchConversionRequests action ', () => {
      const action = new SearchConversionRequests(12);
      expect(action.type).toEqual(
        ConversionActionTypes.SEARCH_CONVERSION_REQUESTS
      );
      expect(action.payload).toEqual(12);
    });
    it('should check correct type is used for SearchConversionRequestsSuccess action ', () => {
      const action = new SearchConversionRequestsSuccess([conversionRequests]);
      expect(action.type).toEqual(
        ConversionActionTypes.SEARCH_CONVERSION_REQUESTS_SUCCESS
      );
      expect(action.payload).toEqual([conversionRequests]);
    });
    it('should check correct type is used for SearchConversionRequestsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SearchConversionRequestsFailure(payload);
      expect(action.type).toEqual(
        ConversionActionTypes.SEARCH_CONVERSION_REQUESTS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('ClearSearchRequests, ResetError', () => {
    it('should check correct type is used for ClearSearchRequests action ', () => {
      const action = new ClearSearchRequests();
      expect(action.type).toEqual(ConversionActionTypes.SEARCH_CLEAR);
    });
    it('should check correct type is used for ResetError action ', () => {
      const action = new ResetError();
      expect(action.type).toEqual(ConversionActionTypes.RESET_ERROR);
    });
  });

  describe('LoadSelectedRequest', () => {
    it('should check correct type is used for LoadSelectedRequest action ', () => {
      const action = new LoadSelectedRequest(12);
      expect(action.type).toEqual(ConversionActionTypes.LOAD_SELECTED_REQUEST);
      expect(action.payload).toEqual(12);
    });
    it('should check correct type is used for LoadSelectedRequestSuccess action ', () => {
      const action = new LoadSelectedRequestSuccess(conversionRequests);
      expect(action.type).toEqual(
        ConversionActionTypes.LOAD_SELECTED_REQUEST_SUCCESS
      );
      expect(action.payload).toEqual(conversionRequests);
    });
    it('should check correct type is used for LoadSelectedRequestFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadSelectedRequestFailure(payload);
      expect(action.type).toEqual(
        ConversionActionTypes.LOAD_SELECTED_REQUEST_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('LoadSelectedRequestData', () => {
    it('should check correct type is used for LoadSelectedRequestData action ', () => {
      const action = new LoadSelectedRequestData(12);
      expect(action.type).toEqual(
        ConversionActionTypes.LOAD_SELECTED_REQUEST_DATA
      );
      expect(action.payload).toEqual(12);
    });
    it('should check correct type is used for LoadSelectedRequestDataSuccess action ', () => {
      const action = new LoadSelectedRequestDataSuccess([
        conversionRequestItems
      ]);
      expect(action.type).toEqual(
        ConversionActionTypes.LOAD_SELECTED_REQUEST_DATA_SUCCESS
      );
      expect(action.payload).toEqual([conversionRequestItems]);
    });
    it('should check correct type is used for LoadSelectedRequestDataFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadSelectedRequestDataFailure(payload);
      expect(action.type).toEqual(
        ConversionActionTypes.LOAD_SELECTED_REQUEST_DATA_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('LoadRsoDetails', () => {
    it('should check correct type is used for LoadRsoDetails action ', () => {
      const action = new LoadRsoDetails();
      expect(action.type).toEqual(ConversionActionTypes.LOAD_RSO_DETAILS);
    });
    it('should check correct type is used for LoadRsoDetailsSuccess action ', () => {
      const action = new LoadRsoDetailsSuccess(['rso']);
      expect(action.type).toEqual(
        ConversionActionTypes.LOAD_RSO_DETAILS_SUCCESS
      );
      expect(action.payload).toEqual(['rso']);
    });
    it('should check correct type is used for LoadRsoDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadRsoDetailsFailure(payload);
      expect(action.type).toEqual(
        ConversionActionTypes.LOAD_RSO_DETAILS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('ConfirmConversion', () => {
    it('should check correct type is used for ConfirmConversion action ', () => {
      const action = new ConfirmConversion(conversionSplitItemPayload);
      expect(action.type).toEqual(ConversionActionTypes.CONFIRM_CONVERSION);
      expect(action.payload).toEqual(conversionSplitItemPayload);
    });
    it('should check correct type is used for ConfirmConversionSuccess action ', () => {
      const action = new ConfirmConversionSuccess(conversionResponse);
      expect(action.type).toEqual(
        ConversionActionTypes.CONFIRM_CONVERSION_SUCCESS
      );
      expect(action.payload).toEqual(conversionResponse);
    });
    it('should check correct type is used for ConfirmConversionFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new ConfirmConversionFailure(payload);
      expect(action.type).toEqual(
        ConversionActionTypes.CONFIRM_CONVERSION_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('LoadBinCodes', () => {
    it('should check correct type is used for LoadBinCodes action ', () => {
      const action = new LoadBinCodes('STN');
      expect(action.type).toEqual(ConversionActionTypes.LOAD_BINCODES);
      expect(action.payload).toEqual('STN');
    });
    it('should check correct type is used for LoadBinCodesSuccess action ', () => {
      const action = new LoadBinCodesSuccess([binCode]);
      expect(action.type).toEqual(ConversionActionTypes.LOAD_BINCODES_SUCCESS);
      expect(action.payload).toEqual([binCode]);
    });
    it('should check correct type is used for LoadBinCodesFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadBinCodesFailure(payload);
      expect(action.type).toEqual(ConversionActionTypes.LOAD_BINCODES_FAILURE);
      expect(action.payload).toEqual(payload);
    });
  });

  describe('LoadStuddedProductGroups', () => {
    it('should check correct type is used for LoadStuddedProductGroups action ', () => {
      const action = new LoadStuddedProductGroups();
      expect(action.type).toEqual(
        ConversionActionTypes.LOAD_STUDDED_PRODUCT_GROUPS
      );
    });
    it('should check correct type is used for LoadStuddedProductGroupsSuccess action ', () => {
      const action = new LoadStuddedProductGroupsSuccess([
        'One',
        'Two',
        'Three'
      ]);
      expect(action.type).toEqual(
        ConversionActionTypes.LOAD_STUDDED_PRODUCT_GROUPS_SUCCESS
      );
      expect(action.payload).toEqual(['One', 'Two', 'Three']);
    });
    it('should check correct type is used for LoadStuddedProductGroupsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadStuddedProductGroupsFailure(payload);
      expect(action.type).toEqual(
        ConversionActionTypes.LOAD_STUDDED_PRODUCT_GROUPS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('LoadRequestSentHistory', () => {
    it('should check correct type is used for LoadRequestSentHistory action ', () => {
      const action = new LoadRequestSentHistory(requestPayload);

      expect(action.type).toEqual(
        ConversionActionTypes.LOAD_REQUEST_SENT_HISTORY
      );
      expect(action.payload).toEqual(requestPayload);
    });
    it('should check correct type is used for LoadRequestSentHistorySuccess action ', () => {
      const action = new LoadRequestSentHistorySuccess(response);

      expect(action.type).toEqual(
        ConversionActionTypes.LOAD_REQUEST_SENT_HISTORY_SUCCESS
      );
      expect(action.payload).toEqual(response);
    });
    it('should check correct type is used for LoadRequestSentHistoryFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadRequestSentHistoryFailure(payload);

      expect(action.type).toEqual(
        ConversionActionTypes.LOAD_REQUEST_SENT_HISTORY_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('LoadConvertedTransactionHistory', () => {
    it('should check correct type is used for LoadConvertedTransactionHistory action ', () => {
      const action = new LoadConvertedTransactionHistory(
        convertedTransactionPayload
      );
      expect(action.type).toEqual(
        ConversionActionTypes.LOAD_CONVERTED_TRANSACTION_HISTORY
      );
      expect(action.payload).toEqual(convertedTransactionPayload);
    });
    it('should check correct type is used for LoadConvertedTransactionHistorySuccess action ', () => {
      const action = new LoadConvertedTransactionHistorySuccess(response);
      expect(action.type).toEqual(
        ConversionActionTypes.LOAD_CONVERTED_TRANSACTION_HISTORY_SUCCESS
      );
      expect(action.payload).toEqual(response);
    });
    it('should check correct type is used for LoadConvertedTransactionHistoryFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadConvertedTransactionHistoryFailure(payload);

      expect(action.type).toEqual(
        ConversionActionTypes.LOAD_CONVERTED_TRANSACTION_HISTORY_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('LoadSelectedRequestHistory', () => {
    it('should check correct type is used for LoadSelectedRequestHistory action ', () => {
      const action = new LoadSelectedRequestHistory({
        reqDocNo: 12,
        requestType: 'CM'
      });
      expect(action.type).toEqual(
        ConversionActionTypes.LOAD_SELECTED_REQUEST_HISTORY
      );
      expect(action.payload).toEqual({ reqDocNo: 12, requestType: 'CM' });
    });
    it('should check correct type is used for LoadSelectedRequestHistorySuccess action ', () => {
      const action = new LoadSelectedRequestHistorySuccess(conversionHistory);
      expect(action.type).toEqual(
        ConversionActionTypes.LOAD_SELECTED_REQUEST_HISTORY_SUCCESS
      );
      expect(action.payload).toEqual(conversionHistory);
    });
    it('should check correct type is used for LoadSelectedRequestHistoryFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadSelectedRequestHistoryFailure(payload);
      expect(action.type).toEqual(
        ConversionActionTypes.LOAD_SELECTED_REQUEST_HISTORY_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('LoadConversionHistoryItems', () => {
    it('should check correct type is used for LoadConversionHistoryItems action ', () => {
      const action = new LoadConversionHistoryItems(conversionHistoryPayload);
      expect(action.type).toEqual(
        ConversionActionTypes.LOAD_CONVERSION_HISTORY_ITEMS
      );
      expect(action.payload).toEqual(conversionHistoryPayload);
    });
    it('should check correct type is used for LoadConversionHistoryItemsSuccess action ', () => {
      const action = new LoadConversionHistoryItemsSuccess(itemsResponse);
      expect(action.type).toEqual(
        ConversionActionTypes.LOAD_CONVERSION_HISTORY_ITEMS_SUCCESS
      );
      expect(action.payload).toEqual(itemsResponse);
    });
    it('should check correct type is used for LoadConversionHistoryItemsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadConversionHistoryItemsFailure(payload);
      expect(action.type).toEqual(
        ConversionActionTypes.LOAD_CONVERSION_HISTORY_ITEMS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('StoreRequestType, StoreAdvancedFilterData, ResetConversionHistory, ResetAdvanceFilter', () => {
    it('should check correct type is used for StoreRequestType action ', () => {
      const action = new StoreRequestType('REQUEST');

      expect(action.type).toEqual(ConversionActionTypes.STORE_REQUEST_TYPE);
      expect(action.payload).toEqual('REQUEST');
    });
    it('should check correct type is used for StoreAdvancedFilterData action ', () => {
      const action = new StoreAdvancedFilterData(advanceFilter);

      expect(action.type).toEqual(ConversionActionTypes.STORE_ADVANCED_FILTER);
      expect(action.payload).toEqual(advanceFilter);
    });

    it('should check correct type is used for ResetConversionHistory action ', () => {
      const action = new ResetConversionHistory();

      expect(action.type).toEqual(
        ConversionActionTypes.RESET_CONVERSION_HISTORY
      );
    });
    it('should check correct type is used for ResetAdvanceFilter action ', () => {
      const action = new ResetAdvanceFilter();

      expect(action.type).toEqual(ConversionActionTypes.RESET_ADVANCE_FILTER);
    });
  });
});
