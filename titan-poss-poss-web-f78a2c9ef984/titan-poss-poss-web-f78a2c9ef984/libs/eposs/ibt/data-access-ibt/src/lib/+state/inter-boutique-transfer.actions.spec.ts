import {
  BoutiqueList,
  CustomErrors,
  LoadBoutiqueListPayload,
  LoadRequestListCountPayload,
  LoadRequestListPayload,
  RequestList,
  Request,
  LoadRequestPayload,
  LoadItemListPayload,
  ItemList,
  UpdateItemListPayload,
  UpdateItemListStatusPayload,
  ItemSummary,
  LoadIBTHistoryPayload,
  LoadIBTHistoryItemsResponse,
  IBThistoryHeaderPayload,
  LoadSelectedHistoryHeaderInfoPayload,
  LoadIBTHistoryItemsPayload,
  HistoryFilterData,
  InterBoutiqueTransferRequestTypesEnum
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';

import * as moment from 'moment';
import {
  ClearBoutiqueList,
  ClearItemList,
  ClearRequestReceivedList,
  ClearRequestSentList,
  ClearSearchItemResponse,
  CreateRequest,
  CreateRequestFailure,
  CreateRequestSuccess,
  InterBoutiqueTransferActionTypes,
  LoadBoutiqueList,
  LoadBoutiqueListCount,
  LoadBoutiqueListCountFailure,
  LoadBoutiqueListCountSuccess,
  LoadBoutiqueListFailure,
  LoadBoutiqueListSuccess,
  LoadHistoryFilterData,
  LoadHistoryItems,
  LoadHistoryItemsFailure,
  LoadHistoryItemsSuccess,
  LoadIBTHistory,
  LoadIBTHistoryFailure,
  LoadIBTHistorySuccess,
  LoadItemList,
  LoadItemListFailure,
  LoadItemListSuccess,
  LoadRequest,
  LoadRequestFailure,
  LoadRequestReceivedList,
  LoadRequestReceivedListCount,
  LoadRequestReceivedListCountFailure,
  LoadRequestReceivedListCountSuccess,
  LoadRequestReceivedListFailure,
  LoadRequestReceivedListSuccess,
  LoadRequestSentList,
  LoadRequestSentListCount,
  LoadRequestSentListCountFailure,
  LoadRequestSentListCountSuccess,
  LoadRequestSentListFailure,
  LoadRequestSentListSuccess,
  LoadRequestSuccess,
  LoadSelectedHistory,
  LoadSelectedHistoryFailure,
  LoadSelectedHistorySuccess,
  LoadStuddedProductGroups,
  LoadStuddedProductGroupsFailure,
  LoadStuddedProductGroupsSuccess,
  RadioHistoryType,
  ResetBoutiqueListCount,
  ResetHstoryFilter,
  ResetLoadedHistory,
  ResetRequestList,
  SearchItem,
  SearchItemFailure,
  SearchItemSuccess,
  UpdateItemList,
  UpdateItemListFailure,
  UpdateItemListStatus,
  UpdateItemListStatusFailure,
  UpdateItemListStatusSuccess,
  UpdateItemListSuccess
} from './inter-boutique-transfer.actions';

describe('IBT Actions Testing suit', () => {
  const loadRequestListPayload: LoadRequestListPayload = {
    requestGroup: 'SENT',
    searchValue: 12,
    pageIndex: 0,
    pageSize: 8
  };

  const requestListResponse: RequestList = {
    createdDate: moment(1616078003356),
    destLocationCode: 'CPD',
    id: 69,
    reqDocDate: moment(1615919400000),
    reqDocNo: 20,
    requestRemarks: 'send',
    requestType: 'BTQ',
    srcLocationCode: 'PTU',
    status: 'REQUESTED',
    totalRequestedQuantity: 1,
    totalElements: 1,
    acceptedQuantity: null,
    approvedQuantity: null
  };
  const loadRequestListCountPayload: LoadRequestListCountPayload = {
    requestGroup: 'SENT',
    searchValue: 12
  };

  const requestListCountResponse: number = 10;

  const loadBoutiqueListPayload: LoadBoutiqueListPayload = {
    item: [{ itemCode: '5130182SHABA00', quantity: 1 }],
    regionType: 'TOWN'
  };

  const boutiqueListResponse: BoutiqueList[] = [
    {
      address: null,
      contactNo: null,
      description: 'Pune - JM Road',
      locationCode: 'TPN',
      phoneNo: null
    }
  ];

  const boutiqueListCountResponse: number = 20;

  const createRequestPayload: Request = {
    items: [{ itemCode: '5130182SHABA00', quantity: 1 }],
    remarks: 'send',
    srcLocationCode: 'VSH'
  };

  const createRequestResponse: RequestList = {
    createdDate: moment(1625625540904),
    destLocationCode: 'CPD',
    id: 138,
    reqDocDate: moment(1625509800000),
    reqDocNo: 17,
    requestRemarks: 'send',
    requestType: 'BTQ',
    srcLocationCode: 'VSH',
    status: 'REQUESTED',
    acceptedQuantity: null,
    approvedQuantity: null,
    totalRequestedQuantity: 1,
    totalElements: 1
  };

  const loadRequestPayload: LoadRequestPayload = {
    id: 138,
    requestGroup: 'SENT'
  };

  const loadItemListPayload: LoadItemListPayload = {
    id: 138,
    requestGroup: 'SENT'
  };

  const itemListRes: ItemList = {
    acceptedQuantity: null,
    approvedQuantity: null,
    availableQuantity: 1,
    binCode: '.STN',
    binGroupCode: 'STN',
    currencyCode: 'INR',
    id: '2946A1EC-5790-4451-B7D5-FD62E1253CC8',
    imageURL: '/productcatalogue/ProductImages/30182SH.jpg',
    inventoryId: '900E385A-6D71-4E7F-B5DD-E6B3C400D086',
    itemCode: '5130182SHABA00',
    itemDetails: { type: 'ITEM_DETAILS', data: { stoneValue: 0 } },
    lotNumber: '2EA000117',
    mfgDate: moment(1625596200000),
    productCategory: '2',
    productCategoryDesc: 'SetProduct2',
    productGroup: '71',
    productGroupDesc: 'Gold Plain',
    requestedQuantity: 1,
    requestedWeight: 29.975,
    status: 'REQUESTED',
    stdValue: 107885,
    stdWeight: 29.975,
    totalAcceptedQuantity: null,
    weightUnit: 'gms',
    isStudded: false
  };

  const updateItemListPayload: UpdateItemListPayload = {
    id: 92,
    itemId: 'A5D6041E-365C-409A-A614-EB022C5E44C0',
    requestGroup: 'SENT',
    data: {
      quantity: 1,
      status: 'ACCEPTED'
    }
  };

  const updateItemListStatusPayload: UpdateItemListStatusPayload = {
    type: 'ACCEPTED',
    id: 92,
    requestGroup: 'SENT',
    itemIds: ['A5D6041E-365C-409A-A614-EB022C5E44C0'],
    remarks: 'string'
  };

  const searchItemRequest: string = '504117VDCS1A09';

  const searchItemResponse: ItemSummary = {
    itemCode: '5',
    productCategoryCode: 'UD',
    productCategoryDesc: 'RUDRAKSHA',
    productGroupCode: '74',
    productGroupDesc: 'Diamonds',
    stdValue: 511
  };

  const studdedProductGroups: string[] = ['72'];

  const loadIBTHistoryPayload: LoadIBTHistoryPayload = {
    historyData: {
      actionType: 'RECEIVE',
      dateRangeType: 'CUSTOM',
      statuses: [],
      dateType: 'REQUESTDATE'
    },
    page: 0,
    size: 0,
    requestType: 'BTQ'
  };

  const IBThistoryHeaderPayloadRes: IBThistoryHeaderPayload = {
    carrierDetails: {},
    currencyCode: 'INR',
    destDocDate: moment(1624386600000),
    destDocNo: null,
    destLocationCode: 'CPD',
    destLocationDescription: 'Delhi - CPD @CC',
    id: '125',
    orderType: null,
    otherDetails: {},
    remarks: 'cancel',
    reqDocDate: moment(1624386600000),
    reqDocNo: 16,
    reqLocationCode: 'CPD',
    requestType: 'BTQ',
    srcDocDate: moment(1624386600000),
    srcFiscalYear: 2021,
    srcLocationCode: 'VSH',
    srcLocationDescription: 'Vashi 2 - LFS',
    status: 'CANCELLED',
    totalAvailableQuantity: null,
    totalAvailableValue: null,
    totalAvailableWeight: null,
    totalMeasuredQuantity: 1,
    totalMeasuredValue: 11594,
    totalMeasuredWeight: 0.88,
    weightUnit: 'gms',
    dateType: 'REQUESTDATE'
  };

  const loadIBTHistoryItemsResponse: LoadIBTHistoryItemsResponse = {
    count: 1,
    items: [IBThistoryHeaderPayloadRes]
  };

  const loadSelectedHistoryHeaderInfoPayload: LoadSelectedHistoryHeaderInfoPayload = {
    id: 125,
    actionType: 'RECEIVE'
  };

  const loadIBTHistoryItemsPayload: LoadIBTHistoryItemsPayload = {
    historyItemsData: {
      binCodes: [null],
      binGroupCode: null,
      itemCode: null,
      lotNumber: null,
      productCategories: [null],
      productGroups: [null]
    },
    requestType: 'BTQ',
    actionType: 'RECEIVE',
    page: 0,
    size: 0
  };

  const historyFilterData: HistoryFilterData = {
    endDate: 1625682599999,
    locationCode: null,
    reqFiscalYear: 2021,
    startDate: 1617215400000,
    statuses: ['ISSUED'],
    dateType: 'REQUESTDATE'
  };

  let interBoutiqueTransferRequestTypesEnumReq: InterBoutiqueTransferRequestTypesEnum;

  describe('Load Request Sent List Action Test Cases', () => {
    it('should check correct type is used for  LoadRequestSentList action ', () => {
      const action = new LoadRequestSentList(loadRequestListPayload);

      expect(action.type).toEqual(
        InterBoutiqueTransferActionTypes.LOAD_REQUEST_SENT_LIST
      );
      expect(action.payload).toEqual(loadRequestListPayload);
    });

    it('should check correct type is used for  LoadRequestSentListSuccess action ', () => {
      const action = new LoadRequestSentListSuccess([requestListResponse]);

      expect(action.type).toEqual(
        InterBoutiqueTransferActionTypes.LOAD_REQUEST_SENT_LIST_SUCCESS
      );
      expect(action.payload).toEqual([requestListResponse]);
    });

    it('should check correct type is used for  LoadRequestSentListFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadRequestSentListFailure(payload);

      expect(action.type).toEqual(
        InterBoutiqueTransferActionTypes.LOAD_REQUEST_SENT_LIST_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('Load Request Received List Action Test Cases', () => {
    it('should check correct type is used for  LoadRequestReceivedList action ', () => {
      const action = new LoadRequestReceivedList(loadRequestListPayload);

      expect(action.type).toEqual(
        InterBoutiqueTransferActionTypes.LOAD_REQUEST_RECEIVED_LIST
      );
      expect(action.payload).toEqual(loadRequestListPayload);
    });

    it('should check correct type is used for  LoadRequestReceivedListSuccess action ', () => {
      const action = new LoadRequestReceivedListSuccess([requestListResponse]);

      expect(action.type).toEqual(
        InterBoutiqueTransferActionTypes.LOAD_REQUEST_RECEIVED_LIST_SUCCESS
      );
      expect(action.payload).toEqual([requestListResponse]);
    });

    it('should check correct type is used for  LoadRequestReceivedListFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadRequestReceivedListFailure(payload);

      expect(action.type).toEqual(
        InterBoutiqueTransferActionTypes.LOAD_REQUEST_RECEIVED_LIST_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('Load Request Sent List Count Action Test Cases', () => {
    it('should check correct type is used for  LoadRequestSentListCount action ', () => {
      const action = new LoadRequestSentListCount(loadRequestListCountPayload);

      expect(action.type).toEqual(
        InterBoutiqueTransferActionTypes.LOAD_REQUEST_SENT_LIST_COUNT
      );
      expect(action.payload).toEqual(loadRequestListCountPayload);
    });

    it('should check correct type is used for  LoadRequestSentListCountSuccess action ', () => {
      const action = new LoadRequestSentListCountSuccess(
        requestListCountResponse
      );

      expect(action.type).toEqual(
        InterBoutiqueTransferActionTypes.LOAD_REQUEST_SENT_LIST_COUNT_SUCCESS
      );
      expect(action.payload).toEqual(requestListCountResponse);
    });

    it('should check correct type is used for  LoadRequestSentListCountFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadRequestSentListCountFailure(payload);

      expect(action.type).toEqual(
        InterBoutiqueTransferActionTypes.LOAD_REQUEST_SENT_LIST_COUNT_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('Load Request Received List Count Action Test Cases', () => {
    it('should check correct type is used for  LoadRequestReceivedListCount action ', () => {
      const action = new LoadRequestReceivedListCount(loadRequestListPayload);

      expect(action.type).toEqual(
        InterBoutiqueTransferActionTypes.LOAD_REQUEST_RECEIVED_LIST_COUNT
      );
      expect(action.payload).toEqual(loadRequestListPayload);
    });

    it('should check correct type is used for  LoadRequestReceivedListCountSuccess action ', () => {
      const action = new LoadRequestReceivedListCountSuccess(
        requestListCountResponse
      );

      expect(action.type).toEqual(
        InterBoutiqueTransferActionTypes.LOAD_REQUEST_RECEIVED_LIST_COUNT_SUCCESS
      );
      expect(action.payload).toEqual(requestListCountResponse);
    });

    it('should check correct type is used for  LoadRequestReceivedListCountFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadRequestReceivedListCountFailure(payload);

      expect(action.type).toEqual(
        InterBoutiqueTransferActionTypes.LOAD_REQUEST_RECEIVED_LIST_COUNT_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('Load Boutique List Action Test Cases', () => {
    it('should check correct type is used for  LoadBoutiqueList action ', () => {
      const action = new LoadBoutiqueList(loadBoutiqueListPayload);

      expect(action.type).toEqual(
        InterBoutiqueTransferActionTypes.LOAD_BOUTIQUE_LIST
      );
      expect(action.payload).toEqual(loadBoutiqueListPayload);
    });

    it('should check correct type is used for  LoadBoutiqueListSuccess action ', () => {
      const action = new LoadBoutiqueListSuccess(boutiqueListResponse);

      expect(action.type).toEqual(
        InterBoutiqueTransferActionTypes.LOAD_BOUTIQUE_LIST_SUCCESS
      );
      expect(action.payload).toEqual(boutiqueListResponse);
    });

    it('should check correct type is used for  LoadBoutiqueListFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadBoutiqueListFailure(payload);

      expect(action.type).toEqual(
        InterBoutiqueTransferActionTypes.LOAD_BOUTIQUE_LIST_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('Load Boutique List Count Action Test Cases', () => {
    it('should check correct type is used for  LoadBoutiqueListCount action ', () => {
      const action = new LoadBoutiqueListCount(loadBoutiqueListPayload);

      expect(action.type).toEqual(
        InterBoutiqueTransferActionTypes.LOAD_BOUTIQUE_LIST_COUNT
      );
      expect(action.payload).toEqual(loadBoutiqueListPayload);
    });

    it('should check correct type is used for  LoadBoutiqueListCountSuccess action ', () => {
      const action = new LoadBoutiqueListCountSuccess(
        boutiqueListCountResponse
      );

      expect(action.type).toEqual(
        InterBoutiqueTransferActionTypes.LOAD_BOUTIQUE_LIST_COUNT_SUCCESS
      );
      expect(action.payload).toEqual(boutiqueListCountResponse);
    });

    it('should check correct type is used for  LoadBoutiqueListCountFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadBoutiqueListCountFailure(payload);

      expect(action.type).toEqual(
        InterBoutiqueTransferActionTypes.LOAD_BOUTIQUE_LIST_COUNT_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('Create Request Action Test Cases', () => {
    it('should check correct type is used for  CreateRequest action ', () => {
      const action = new CreateRequest(createRequestPayload);

      expect(action.type).toEqual(
        InterBoutiqueTransferActionTypes.CREATE_REQUEST
      );
      expect(action.payload).toEqual(createRequestPayload);
    });

    it('should check correct type is used for  CreateRequestSuccess action ', () => {
      const action = new CreateRequestSuccess(createRequestResponse);

      expect(action.type).toEqual(
        InterBoutiqueTransferActionTypes.CREATE_REQUEST_SUCCESS
      );
      expect(action.payload).toEqual(createRequestResponse);
    });

    it('should check correct type is used for  CreateRequestFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new CreateRequestFailure(payload);

      expect(action.type).toEqual(
        InterBoutiqueTransferActionTypes.CREATE_REQUEST_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('Load Request Action Test Cases', () => {
    it('should check correct type is used for  LoadRequest action ', () => {
      const action = new LoadRequest(loadRequestPayload);

      expect(action.type).toEqual(
        InterBoutiqueTransferActionTypes.LOAD_REQUEST
      );
      expect(action.payload).toEqual(loadRequestPayload);
    });

    it('should check correct type is used for  LoadRequestSuccess action ', () => {
      const action = new LoadRequestSuccess(createRequestResponse);

      expect(action.type).toEqual(
        InterBoutiqueTransferActionTypes.LOAD_REQUEST_SUCCESS
      );
      expect(action.payload).toEqual(createRequestResponse);
    });

    it('should check correct type is used for  LoadRequestFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadRequestFailure(payload);

      expect(action.type).toEqual(
        InterBoutiqueTransferActionTypes.LOAD_REQUEST_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('Load Item List Action Test Cases', () => {
    it('should check correct type is used for  LoadItemList action ', () => {
      const action = new LoadItemList(loadItemListPayload);

      expect(action.type).toEqual(
        InterBoutiqueTransferActionTypes.LOAD_ITEM_LIST
      );
      expect(action.payload).toEqual(loadItemListPayload);
    });

    it('should check correct type is used for  LoadItemListSuccess action ', () => {
      const action = new LoadItemListSuccess([itemListRes]);

      expect(action.type).toEqual(
        InterBoutiqueTransferActionTypes.LOAD_ITEM_LIST_SUCCESS
      );
      expect(action.payload).toEqual([itemListRes]);
    });

    it('should check correct type is used for  LoadItemListFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadItemListFailure(payload);

      expect(action.type).toEqual(
        InterBoutiqueTransferActionTypes.LOAD_ITEM_LIST_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('Update Item List Action Test Cases', () => {
    it('should check correct type is used for  UpdateItemList action ', () => {
      const action = new UpdateItemList(updateItemListPayload);

      expect(action.type).toEqual(
        InterBoutiqueTransferActionTypes.UPDATE_ITEM_LIST
      );
      expect(action.payload).toEqual(updateItemListPayload);
    });

    it('should check correct type is used for  UpdateItemListSuccess action ', () => {
      const action = new UpdateItemListSuccess(itemListRes);

      expect(action.type).toEqual(
        InterBoutiqueTransferActionTypes.UPDATE_ITEM_LIST_SUCCESS
      );
      expect(action.payload).toEqual(itemListRes);
    });

    it('should check correct type is used for  UpdateItemListFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new UpdateItemListFailure(payload);

      expect(action.type).toEqual(
        InterBoutiqueTransferActionTypes.UPDATE_ITEM_LIST_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('Update Item List Status Action Test Cases', () => {
    it('should check correct type is used for  UpdateItemListStatus action ', () => {
      const action = new UpdateItemListStatus(updateItemListStatusPayload);

      expect(action.type).toEqual(
        InterBoutiqueTransferActionTypes.UPDATE_ITEM_LIST_STATUS
      );
      expect(action.payload).toEqual(updateItemListStatusPayload);
    });

    it('should check correct type is used for  UpdateItemListStatusSuccess action ', () => {
      const action = new UpdateItemListStatusSuccess(requestListResponse);

      expect(action.type).toEqual(
        InterBoutiqueTransferActionTypes.UPDATE_ITEM_LIST_STATUS_SUCCESS
      );
      expect(action.payload).toEqual(requestListResponse);
    });

    it('should check correct type is used for  UpdateItemListStatusFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new UpdateItemListStatusFailure(payload);

      expect(action.type).toEqual(
        InterBoutiqueTransferActionTypes.UPDATE_ITEM_LIST_STATUS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('SearchItem Action Test Cases', () => {
    it('should check correct type is used for  SearchItem action ', () => {
      const action = new SearchItem(searchItemRequest);

      expect(action.type).toEqual(InterBoutiqueTransferActionTypes.SEARCH_ITEM);
      expect(action.payload).toEqual(searchItemRequest);
    });

    it('should check correct type is used for  SearchItemSuccess action ', () => {
      const action = new SearchItemSuccess(searchItemResponse);

      expect(action.type).toEqual(
        InterBoutiqueTransferActionTypes.SEARCH_ITEM_SUCCESS
      );
      expect(action.payload).toEqual(searchItemResponse);
    });

    it('should check correct type is used for  SearchItemFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SearchItemFailure(payload);

      expect(action.type).toEqual(
        InterBoutiqueTransferActionTypes.SEARCH_ITEM_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('Other Action Test Cases', () => {
    it('should check correct type is used for ClearRequestSentList action ', () => {
      const action = new ClearRequestSentList();
      expect({ ...action }).toEqual({
        type: InterBoutiqueTransferActionTypes.CLEAR_REQUEST_SENT_LIST
      });
    });

    it('should check correct type is used for ClearRequestReceivedList action ', () => {
      const action = new ClearRequestReceivedList();
      expect({ ...action }).toEqual({
        type: InterBoutiqueTransferActionTypes.CLEAR_REQUEST_RECEIVED_LIST
      });
    });

    it('should check correct type is used for ClearItemList action ', () => {
      const action = new ClearItemList();
      expect({ ...action }).toEqual({
        type: InterBoutiqueTransferActionTypes.CLEAR_ITEM_LIST
      });
    });

    it('should check correct type is used for ClearBoutiqueList action ', () => {
      const action = new ClearBoutiqueList();
      expect({ ...action }).toEqual({
        type: InterBoutiqueTransferActionTypes.CLEAR_BOUTIQUE_LIST
      });
    });

    it('should check correct type is used for ResetBoutiqueListCount action ', () => {
      const action = new ResetBoutiqueListCount();
      expect({ ...action }).toEqual({
        type: InterBoutiqueTransferActionTypes.RESET_BOUTIQUE_LIST_COUNT
      });
    });

    it('should check correct type is used for ClearSearchItemResponse action ', () => {
      const action = new ClearSearchItemResponse();
      expect({ ...action }).toEqual({
        type: InterBoutiqueTransferActionTypes.CLEAR_SEARCH_ITEM_RESPONSE
      });
    });

    it('should check correct type is used for ResetRequestList action ', () => {
      const action = new ResetRequestList();
      expect({ ...action }).toEqual({
        type: InterBoutiqueTransferActionTypes.RESET_REQUEST_LIST
      });
    });

    it('should check correct type is used for ResetLoadedHistory action ', () => {
      const action = new ResetLoadedHistory();
      expect({ ...action }).toEqual({
        type: InterBoutiqueTransferActionTypes.RESET_LOADED_HISTORY
      });
    });

    it('should check correct type is used for ResetHstoryFilter action ', () => {
      const payload = 345700000;
      const action = new ResetHstoryFilter(payload);
      expect({ ...action }).toEqual({
        type: InterBoutiqueTransferActionTypes.RESET_HISTORY_FILTER_DATA,
        payload
      });
    });
  });

  describe('Load Studded Product Groups Action Test Cases', () => {
    it('should check correct type is used for LoadStuddedProductGroups action ', () => {
      const action = new LoadStuddedProductGroups();

      expect(action.type).toEqual(
        InterBoutiqueTransferActionTypes.LOAD_STUDDED_PRODUCT_GROUPS
      );
    });

    it('should check correct type is used for LoadStuddedProductGroupSuccess action ', () => {
      const action = new LoadStuddedProductGroupsSuccess(studdedProductGroups);

      expect(action.type).toEqual(
        InterBoutiqueTransferActionTypes.LOAD_STUDDED_PRODUCT_GROUPS_SUCCESS
      );
      expect(action.payload).toEqual(studdedProductGroups);
    });

    it('should check correct type is used for LoadStuddedProductGroupsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadStuddedProductGroupsFailure(payload);

      expect(action.type).toEqual(
        InterBoutiqueTransferActionTypes.LOAD_STUDDED_PRODUCT_GROUPS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('Load IBT History Action Test Cases', () => {
    it('should check correct type is used for LoadIBTHistory action ', () => {
      const action = new LoadIBTHistory(loadIBTHistoryPayload);

      expect(action.type).toEqual(
        InterBoutiqueTransferActionTypes.LOAD_IBT_HISTORY
      );
      expect(action.payload).toEqual(loadIBTHistoryPayload);
    });

    it('should check correct type is used for LoadIBTHistorySuccess action ', () => {
      const action = new LoadIBTHistorySuccess(loadIBTHistoryItemsResponse);

      expect(action.type).toEqual(
        InterBoutiqueTransferActionTypes.LOAD_IBT_HISTORY_SUCCESS
      );
      expect(action.payload).toEqual(loadIBTHistoryItemsResponse);
    });

    it('should check correct type is used for LoadIBTHistoryFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadIBTHistoryFailure(payload);

      expect(action.type).toEqual(
        InterBoutiqueTransferActionTypes.LOAD_IBT_HISTORY_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('Load Selected History Action Test Cases', () => {
    it('should check correct type is used for LoadSelectedHistory action ', () => {
      const action = new LoadSelectedHistory(
        loadSelectedHistoryHeaderInfoPayload
      );

      expect(action.type).toEqual(
        InterBoutiqueTransferActionTypes.LOAD_SELECTED_HISTORY
      );
      expect(action.payload).toEqual(loadSelectedHistoryHeaderInfoPayload);
    });

    it('should check correct type is used for LoadSelectedHistorySuccess action ', () => {
      const action = new LoadSelectedHistorySuccess(IBThistoryHeaderPayloadRes);

      expect(action.type).toEqual(
        InterBoutiqueTransferActionTypes.LOAD_SELECTED_HISTORY_SUCCESS
      );
      expect(action.payload).toEqual(IBThistoryHeaderPayloadRes);
    });

    it('should check correct type is used for LoadSelectedHistoryFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadSelectedHistoryFailure(payload);

      expect(action.type).toEqual(
        InterBoutiqueTransferActionTypes.LOAD_SELECTED_HISTORY_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('Load History Items Action Test Cases', () => {
    it('should check correct type is used for LoadHistoryItems action ', () => {
      const action = new LoadHistoryItems(loadIBTHistoryItemsPayload);

      expect(action.type).toEqual(
        InterBoutiqueTransferActionTypes.LOAD_HISTORY_ITEMS
      );
      expect(action.payload).toEqual(loadIBTHistoryItemsPayload);
    });

    it('should check correct type is used for LoadHistoryItemsSuccess action ', () => {
      const action = new LoadHistoryItemsSuccess([itemListRes]);

      expect(action.type).toEqual(
        InterBoutiqueTransferActionTypes.LOAD_HISTORY_ITEMS_SUCCESS
      );
      expect(action.payload).toEqual([itemListRes]);
    });

    it('should check correct type is used for LoadHistoryItemsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadHistoryItemsFailure(payload);

      expect(action.type).toEqual(
        InterBoutiqueTransferActionTypes.LOAD_HISTORY_ITEMS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('Load History Filter Data Action Test Cases', () => {
    it('should check correct type is used for LoadHistoryFilterData action ', () => {
      const action = new LoadHistoryFilterData(historyFilterData);

      expect(action.type).toEqual(
        InterBoutiqueTransferActionTypes.LOAD_HISTORY_FILTER_DATA
      );
      expect(action.payload).toEqual(historyFilterData);
    });
  });

  describe('Radio History Type Action Test Cases', () => {
    it('should check correct type is used for RadioHistoryType action ', () => {
      const action = new RadioHistoryType(
        interBoutiqueTransferRequestTypesEnumReq
      );

      expect(action.type).toEqual(
        InterBoutiqueTransferActionTypes.RADIO_HISTORY_TYPE
      );
      expect(action.payload).toEqual(interBoutiqueTransferRequestTypesEnumReq);
    });
  });
});
