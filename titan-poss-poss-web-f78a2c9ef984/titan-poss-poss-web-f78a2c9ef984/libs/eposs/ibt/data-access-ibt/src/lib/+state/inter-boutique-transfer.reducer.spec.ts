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
  IBThistoryHeaderPayload,
  LoadIBTHistoryItemsResponse,
  LoadSelectedHistoryHeaderInfoPayload,
  LoadIBTHistoryItemsPayload,
  HistoryFilterData,
  InterBoutiqueTransferRequestTypesEnum
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import * as moment from 'moment';
import {
  initialState,
  interBoutiqueTransferReducer
} from './inter-boutique-transfer.reducer';
import * as actions from './inter-boutique-transfer.actions';
import { InterBoutiqueTransferState } from './inter-boutique-transfer.state';
import {
  boutiqueListAdapter,
  IBTHistoryAdaptor,
  itemListAdapter,
  requestListAdapter
} from './inter-boutique-transfer.entity';

describe('IBT Reducer Testing Suite', () => {
  let testState = initialState;

  describe('Actions should update state properly', () => {
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

    it('should return the initial state', () => {
      const action: any = {};
      const state: InterBoutiqueTransferState = interBoutiqueTransferReducer(
        undefined,
        action
      );
      expect(state).toBe(testState);
    });

    it('LoadRequestSentList action', () => {
      testState = {
        ...testState,
        isLoading: false
      };

      const action = new actions.LoadRequestSentList(loadRequestListPayload);
      const result: InterBoutiqueTransferState = interBoutiqueTransferReducer(
        testState,
        action
      );
      expect(result.isLoading).toBeTruthy();
    });

    it('LoadRequestSentListSuccess action', () => {
      testState = {
        ...testState,
        isLoading: true,
        requestSentList: requestListAdapter.addMany(
          [requestListResponse],
          testState.requestSentList
        )
      };
      const action = new actions.LoadRequestSentListSuccess([
        requestListResponse
      ]);
      const result: InterBoutiqueTransferState = interBoutiqueTransferReducer(
        testState,
        action
      );
      expect(result.isLoading).toBeFalsy();
      expect(result.requestSentList.ids.length).toBe(1);
    });

    it('LoadRequestSentListFailure action', () => {
      testState = {
        ...testState,
        isLoading: true,
        hasError: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.LoadRequestSentListFailure(payload);

      const result: InterBoutiqueTransferState = interBoutiqueTransferReducer(
        testState,
        action
      );

      expect(result.isLoading).toBeFalsy();
      expect(result.hasError).toBe(payload);
    });

    it('LoadRequestReceivedList action', () => {
      testState = {
        ...testState,
        isLoading: false
      };

      const action = new actions.LoadRequestReceivedList(
        loadRequestListPayload
      );
      const result: InterBoutiqueTransferState = interBoutiqueTransferReducer(
        testState,
        action
      );
      expect(result.isLoading).toBeTruthy();
    });

    it('LoadRequestReceivedListSuccess action', () => {
      testState = {
        ...testState,
        isLoading: true,
        requestReceivedList: requestListAdapter.addMany(
          [requestListResponse],
          testState.requestReceivedList
        )
      };
      const action = new actions.LoadRequestReceivedListSuccess([
        requestListResponse
      ]);
      const result: InterBoutiqueTransferState = interBoutiqueTransferReducer(
        testState,
        action
      );
      expect(result.isLoading).toBeFalsy();
      expect(result.requestReceivedList.ids.length).toBe(1);
    });

    it('LoadRequestReceivedListFailure action', () => {
      testState = {
        ...testState,
        isLoading: true,
        hasError: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.LoadRequestReceivedListFailure(payload);

      const result: InterBoutiqueTransferState = interBoutiqueTransferReducer(
        testState,
        action
      );

      expect(result.isLoading).toBeFalsy();
      expect(result.hasError).toBe(payload);
    });

    it('LoadRequestSentListCount action', () => {
      testState = {
        ...testState,
        isLoading: false
      };

      const action = new actions.LoadRequestSentListCount(
        loadRequestListCountPayload
      );
      const result: InterBoutiqueTransferState = interBoutiqueTransferReducer(
        testState,
        action
      );
      expect(result.isLoading).toBeTruthy();
    });

    it('LoadRequestSentListCountSuccess action', () => {
      testState = {
        ...testState,
        isLoading: true,
        requestSentListCount: requestListCountResponse
      };
      const action = new actions.LoadRequestSentListCountSuccess(
        requestListCountResponse
      );
      const result: InterBoutiqueTransferState = interBoutiqueTransferReducer(
        testState,
        action
      );
      expect(result.isLoading).toBeFalsy();
      expect(result.requestSentListCount).toBe(10);
    });

    it('LoadRequestSentListCountFailure action', () => {
      testState = {
        ...testState,
        isLoading: true,
        hasError: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.LoadRequestSentListCountFailure(payload);

      const result: InterBoutiqueTransferState = interBoutiqueTransferReducer(
        testState,
        action
      );

      expect(result.isLoading).toBeFalsy();
      expect(result.hasError).toBe(payload);
    });

    it('LoadRequestReceivedListCount action', () => {
      testState = {
        ...testState,
        isLoading: false
      };

      const action = new actions.LoadRequestReceivedListCount(
        loadRequestListPayload
      );
      const result: InterBoutiqueTransferState = interBoutiqueTransferReducer(
        testState,
        action
      );
      expect(result.isLoading).toBeTruthy();
    });

    it('LoadRequestReceivedListCountSuccess action', () => {
      testState = {
        ...testState,
        isLoading: true,
        requestReceivedListCount: requestListCountResponse
      };
      const action = new actions.LoadRequestReceivedListCountSuccess(
        requestListCountResponse
      );
      const result: InterBoutiqueTransferState = interBoutiqueTransferReducer(
        testState,
        action
      );
      expect(result.isLoading).toBeFalsy();
      expect(result.requestReceivedListCount).toBe(requestListCountResponse);
    });

    it('LoadRequestReceivedListCountFailure action', () => {
      testState = {
        ...testState,
        isLoading: true,
        hasError: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new actions.LoadRequestReceivedListCountFailure(payload);
      const result: InterBoutiqueTransferState = interBoutiqueTransferReducer(
        testState,
        action
      );

      expect(result.isLoading).toBeFalsy();
      expect(result.hasError).toBe(payload);
    });

    it('LoadBoutiqueList action', () => {
      testState = {
        ...testState,
        isLoading: false
      };

      const action = new actions.LoadBoutiqueList(loadBoutiqueListPayload);
      const result: InterBoutiqueTransferState = interBoutiqueTransferReducer(
        testState,
        action
      );
      expect(result.isLoading).toBeTruthy();
    });

    it('LoadBoutiqueListSuccess action', () => {
      testState = {
        ...testState,
        isLoading: true,
        boutiqueList: boutiqueListAdapter.addMany(
          boutiqueListResponse,
          testState.boutiqueList
        )
      };
      const action = new actions.LoadBoutiqueListSuccess(boutiqueListResponse);
      const result: InterBoutiqueTransferState = interBoutiqueTransferReducer(
        testState,
        action
      );
      expect(result.isLoading).toBeFalsy();
      expect(result.boutiqueList.ids.length).toBe(1);
    });

    it('LoadBoutiqueListFailure action', () => {
      testState = {
        ...testState,
        isLoading: true,
        hasError: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.LoadBoutiqueListFailure(payload);

      const result: InterBoutiqueTransferState = interBoutiqueTransferReducer(
        testState,
        action
      );

      expect(result.isLoading).toBeFalsy();
      expect(result.hasError).toBe(payload);
    });

    it('LoadBoutiqueListCount action', () => {
      testState = {
        ...testState,
        isLoading: false
      };

      const action = new actions.LoadBoutiqueListCount(loadBoutiqueListPayload);
      const result: InterBoutiqueTransferState = interBoutiqueTransferReducer(
        testState,
        action
      );
      expect(result.isLoading).toBeTruthy();
    });

    it('LoadBoutiqueListCountSuccess action', () => {
      testState = {
        ...testState,
        isLoading: true,
        boutiqueListCount: boutiqueListCountResponse
      };
      const action = new actions.LoadBoutiqueListCountSuccess(
        boutiqueListCountResponse
      );
      const result: InterBoutiqueTransferState = interBoutiqueTransferReducer(
        testState,
        action
      );
      expect(result.isLoading).toBeFalsy();
      expect(result.boutiqueListCount).toBe(boutiqueListCountResponse);
    });

    it('LoadBoutiqueListCountFailure action', () => {
      testState = {
        ...testState,
        isLoading: true,
        hasError: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.LoadBoutiqueListCountFailure(payload);

      const result: InterBoutiqueTransferState = interBoutiqueTransferReducer(
        testState,
        action
      );

      expect(result.isLoading).toBeFalsy();
      expect(result.hasError).toBe(payload);
    });

    it('CreateRequest action', () => {
      testState = {
        ...testState,
        isLoading: false
      };

      const action = new actions.CreateRequest(createRequestPayload);
      const result: InterBoutiqueTransferState = interBoutiqueTransferReducer(
        testState,
        action
      );
      expect(result.isLoading).toBeTruthy();
    });

    it('CreateRequestSuccess action', () => {
      testState = {
        ...testState,
        isLoading: true,
        createRequestResponse: createRequestResponse
      };
      const action = new actions.CreateRequestSuccess(createRequestResponse);
      const result: InterBoutiqueTransferState = interBoutiqueTransferReducer(
        testState,
        action
      );
      expect(result.isLoading).toBeFalsy();
      expect(result.createRequestResponse).toBe(createRequestResponse);
    });

    it('CreateRequestFailure action', () => {
      testState = {
        ...testState,
        isLoading: true,
        hasError: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.CreateRequestFailure(payload);

      const result: InterBoutiqueTransferState = interBoutiqueTransferReducer(
        testState,
        action
      );

      expect(result.isLoading).toBeFalsy();
      expect(result.hasError).toBe(payload);
    });

    it('LoadRequest action', () => {
      testState = {
        ...testState,
        isLoading: false
      };

      const action = new actions.LoadRequest(loadRequestPayload);
      const result: InterBoutiqueTransferState = interBoutiqueTransferReducer(
        testState,
        action
      );
      expect(result.isLoading).toBeTruthy();
    });

    it('LoadRequestSuccess action', () => {
      testState = {
        ...testState,
        isLoading: true,
        request: requestListResponse
      };
      const action = new actions.LoadRequestSuccess(requestListResponse);
      const result: InterBoutiqueTransferState = interBoutiqueTransferReducer(
        testState,
        action
      );
      expect(result.isLoading).toBeFalsy();
      expect(result.request).toBe(requestListResponse);
    });

    it('LoadRequestFailure action', () => {
      testState = {
        ...testState,
        isLoading: true,
        hasError: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.LoadRequestFailure(payload);

      const result: InterBoutiqueTransferState = interBoutiqueTransferReducer(
        testState,
        action
      );

      expect(result.isLoading).toBeFalsy();
      expect(result.hasError).toBe(payload);
    });

    it('LoadItemList action', () => {
      testState = {
        ...testState,
        isLoading: false
      };

      const action = new actions.LoadItemList(loadItemListPayload);
      const result: InterBoutiqueTransferState = interBoutiqueTransferReducer(
        testState,
        action
      );
      expect(result.isLoading).toBeTruthy();
    });

    it('LoadItemListSuccess action', () => {
      testState = {
        ...testState,
        isLoading: true,
        itemList: itemListAdapter.addMany([itemListRes], testState.itemList)
      };
      const action = new actions.LoadItemListSuccess([itemListRes]);
      const result: InterBoutiqueTransferState = interBoutiqueTransferReducer(
        testState,
        action
      );
      expect(result.isLoading).toBeFalsy();
      expect(result.itemList.ids.length).toBe(1);
    });

    it('LoadItemListFailure action', () => {
      testState = {
        ...testState,
        isLoading: true,
        hasError: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.LoadItemListFailure(payload);

      const result: InterBoutiqueTransferState = interBoutiqueTransferReducer(
        testState,
        action
      );

      expect(result.isLoading).toBeFalsy();
      expect(result.hasError).toBe(payload);
    });

    it('UpdateItemList action', () => {
      testState = {
        ...testState,
        isLoading: false
      };

      const action = new actions.UpdateItemList(updateItemListPayload);
      const result: InterBoutiqueTransferState = interBoutiqueTransferReducer(
        testState,
        action
      );
      expect(result.isLoading).toBeTruthy();
    });

    it('UpdateItemListSuccess action', () => {
      testState = {
        ...testState,
        isLoading: true,
        updateItemListResponse: itemListRes
      };
      const action = new actions.UpdateItemListSuccess(itemListRes);
      const result: InterBoutiqueTransferState = interBoutiqueTransferReducer(
        testState,
        action
      );
      expect(result.isLoading).toBeFalsy();
      expect(result.updateItemListResponse).toBe(itemListRes);
    });

    it('UpdateItemListFailure action', () => {
      testState = {
        ...testState,
        isLoading: true,
        hasError: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.UpdateItemListFailure(payload);

      const result: InterBoutiqueTransferState = interBoutiqueTransferReducer(
        testState,
        action
      );

      expect(result.isLoading).toBeFalsy();
      expect(result.hasError).toBe(payload);
    });

    it('UpdateItemListStatus action', () => {
      testState = {
        ...testState,
        isLoading: false
      };

      const action = new actions.UpdateItemListStatus(
        updateItemListStatusPayload
      );
      const result: InterBoutiqueTransferState = interBoutiqueTransferReducer(
        testState,
        action
      );
      expect(result.isLoading).toBeTruthy();
    });

    it('UpdateItemListStatusSuccess action', () => {
      testState = {
        ...testState,
        isLoading: true,
        updateItemListStatusResponse: requestListResponse
      };
      const action = new actions.UpdateItemListStatusSuccess(
        requestListResponse
      );
      const result: InterBoutiqueTransferState = interBoutiqueTransferReducer(
        testState,
        action
      );
      expect(result.isLoading).toBeFalsy();
      expect(result.updateItemListStatusResponse).toBe(requestListResponse);
    });

    it('UpdateItemListStatusFailure action', () => {
      testState = {
        ...testState,
        isLoading: true,
        hasError: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.UpdateItemListStatusFailure(payload);

      const result: InterBoutiqueTransferState = interBoutiqueTransferReducer(
        testState,
        action
      );

      expect(result.isLoading).toBeFalsy();
      expect(result.hasError).toBe(payload);
    });

    it('SearchItem action', () => {
      testState = {
        ...testState,
        isLoading: false
      };

      const action = new actions.SearchItem(searchItemRequest);
      const result: InterBoutiqueTransferState = interBoutiqueTransferReducer(
        testState,
        action
      );
      expect(result.isLoading).toBeTruthy();
    });

    it('SearchItemSuccess action', () => {
      testState = {
        ...testState,
        isLoading: true,
        searchItemResponse: {
          searchResult: searchItemResponse,
          isSearchSuccess: true
        }
      };
      const action = new actions.SearchItemSuccess(searchItemResponse);
      const result: InterBoutiqueTransferState = interBoutiqueTransferReducer(
        testState,
        action
      );
      expect(result.isLoading).toBeFalsy();
      expect(result.searchItemResponse.searchResult).toBe(searchItemResponse);
      expect(result.searchItemResponse.isSearchSuccess).toBe(true);
    });

    it('SearchItemFailure action', () => {
      testState = {
        ...testState,
        isLoading: true,
        hasError: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.SearchItemFailure(payload);

      const result: InterBoutiqueTransferState = interBoutiqueTransferReducer(
        testState,
        action
      );

      expect(result.isLoading).toBeFalsy();
      expect(result.hasError).toBe(payload);
    });

    it('LoadIBTHistory action', () => {
      testState = {
        ...testState,
        isLoadingHistory: false
      };

      const action = new actions.LoadIBTHistory(loadIBTHistoryPayload);
      const result: InterBoutiqueTransferState = interBoutiqueTransferReducer(
        testState,
        action
      );
      expect(result.isLoadingHistory).toBeTruthy();
    });

    it('LoadIBTHistorySuccess action', () => {
      testState = {
        ...testState,
        isLoadingHistory: true,
        IBThistory: IBTHistoryAdaptor.addMany(
          [IBThistoryHeaderPayloadRes],
          testState.IBThistory
        )
      };
      const action = new actions.LoadIBTHistorySuccess(
        loadIBTHistoryItemsResponse
      );
      const result: InterBoutiqueTransferState = interBoutiqueTransferReducer(
        testState,
        action
      );
      expect(result.isLoadingHistory).toBeFalsy();
      expect(result.IBThistory.ids.length).toBe(1);
    });

    it('LoadIBTHistoryFailure action', () => {
      testState = {
        ...testState,
        isLoadingHistory: true,
        hasError: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.LoadIBTHistoryFailure(payload);

      const result: InterBoutiqueTransferState = interBoutiqueTransferReducer(
        testState,
        action
      );

      expect(result.isLoadingHistory).toBeFalsy();
      expect(result.hasError).toBe(payload);
    });

    it('LoadStuddedProductGroups action', () => {
      testState = {
        ...testState,
        isLoading: true
      };

      const action = new actions.LoadStuddedProductGroups();
      const result: InterBoutiqueTransferState = interBoutiqueTransferReducer(
        testState,
        action
      );
      expect(result.isLoading).toBeTruthy();
    });

    it('LoadStuddedProductGroupsSuccess action', () => {
      testState = {
        ...testState,
        isLoading: false,
        studdedProductGroups: studdedProductGroups
      };
      const action = new actions.LoadStuddedProductGroupsSuccess(
        studdedProductGroups
      );
      const result: InterBoutiqueTransferState = interBoutiqueTransferReducer(
        testState,
        action
      );
      expect(result.isLoading).toBeFalsy();
      expect(result.studdedProductGroups).toBe(studdedProductGroups);
    });

    it('LoadStuddedProductGroupsFailure action', () => {
      testState = {
        ...testState,
        isLoading: false,
        hasError: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.LoadStuddedProductGroupsFailure(payload);

      const result: InterBoutiqueTransferState = interBoutiqueTransferReducer(
        testState,
        action
      );

      expect(result.isLoading).toBeFalsy();
      expect(result.hasError).toBe(payload);
    });

    it('LoadSelectedHistory action', () => {
      testState = {
        ...testState,
        isLoadingSelectedHistory: false
      };

      const action = new actions.LoadSelectedHistory(
        loadSelectedHistoryHeaderInfoPayload
      );
      const result: InterBoutiqueTransferState = interBoutiqueTransferReducer(
        testState,
        action
      );
      expect(result.isLoadingSelectedHistory).toBeTruthy();
    });

    it('LoadSelectedHistorySuccess action', () => {
      testState = {
        ...testState,
        isLoadingSelectedHistory: true,
        selectedHistory: IBThistoryHeaderPayloadRes
      };
      const action = new actions.LoadSelectedHistorySuccess(
        IBThistoryHeaderPayloadRes
      );
      const result: InterBoutiqueTransferState = interBoutiqueTransferReducer(
        testState,
        action
      );
      expect(result.isLoadingSelectedHistory).toBeFalsy();
      expect(result.selectedHistory).toBe(IBThistoryHeaderPayloadRes);
    });

    it('LoadSelectedHistoryFailure action', () => {
      testState = {
        ...testState,
        isLoadingSelectedHistory: true,
        hasError: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.LoadSelectedHistoryFailure(payload);

      const result: InterBoutiqueTransferState = interBoutiqueTransferReducer(
        testState,
        action
      );

      expect(result.isLoadingSelectedHistory).toBeFalsy();
      expect(result.hasError).toBe(payload);
    });

    it('LoadHistoryItems action', () => {
      testState = {
        ...testState,
        isLoading: false
      };

      const action = new actions.LoadHistoryItems(loadIBTHistoryItemsPayload);
      const result: InterBoutiqueTransferState = interBoutiqueTransferReducer(
        testState,
        action
      );
      expect(result.isLoading).toBeTruthy();
    });

    it('LoadHistoryItemsSuccess action', () => {
      testState = {
        ...testState,
        isLoading: true,
        items: IBTHistoryAdaptor.addMany(
          [IBThistoryHeaderPayloadRes],
          testState.items
        )
      };
      const action = new actions.LoadHistoryItemsSuccess([itemListRes]);
      const result: InterBoutiqueTransferState = interBoutiqueTransferReducer(
        testState,
        action
      );
      expect(result.isLoading).toBeFalsy();
      expect(result.items.ids.length).toBe(1);
    });

    it('LoadHistoryItemsFailure action', () => {
      testState = {
        ...testState,
        isLoading: true,
        hasError: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.LoadHistoryItemsFailure(payload);

      const result: InterBoutiqueTransferState = interBoutiqueTransferReducer(
        testState,
        action
      );

      expect(result.isLoading).toBeFalsy();
      expect(result.hasError).toBe(payload);
    });

    it('ClearRequestSentList', () => {
      const action = new actions.ClearRequestSentList();
      const newState = {
        ...testState,
        requestSentList: requestListAdapter.addMany(
          [requestListResponse],
          testState.requestSentList
        )
      };
      const result: InterBoutiqueTransferState = interBoutiqueTransferReducer(
        newState,
        action
      );
      expect(result.requestSentList.ids.length).toEqual(0);
    });

    it('ClearRequestReceivedList', () => {
      const action = new actions.ClearRequestReceivedList();
      const newState = {
        ...testState,
        requestReceivedList: requestListAdapter.addMany(
          [requestListResponse],
          testState.requestReceivedList
        )
      };
      const result: InterBoutiqueTransferState = interBoutiqueTransferReducer(
        newState,
        action
      );
      expect(result.requestReceivedList.ids.length).toEqual(0);
    });

    it('ClearItemList', () => {
      const action = new actions.ClearItemList();
      const newState = {
        ...testState,
        itemList: itemListAdapter.addMany([itemListRes], testState.itemList)
      };
      const result: InterBoutiqueTransferState = interBoutiqueTransferReducer(
        newState,
        action
      );
      expect(result.itemList.ids.length).toEqual(0);
    });

    it('ClearBoutiqueList', () => {
      const action = new actions.ClearBoutiqueList();
      const newState = {
        ...testState,
        boutiqueList: boutiqueListAdapter.addMany(
          boutiqueListResponse,
          testState.boutiqueList
        )
      };
      const result: InterBoutiqueTransferState = interBoutiqueTransferReducer(
        newState,
        action
      );
      expect(result.boutiqueList.ids.length).toEqual(0);
    });

    it('ResetBoutiqueListCount', () => {
      const action = new actions.ResetBoutiqueListCount();
      const newState = {
        ...testState,
        boutiqueListCount: 10
      };
      const result: InterBoutiqueTransferState = interBoutiqueTransferReducer(
        newState,
        action
      );
      expect(result.boutiqueListCount).toEqual(-1);
    });

    it('ClearSearchItemResponse', () => {
      const action = new actions.ClearSearchItemResponse();
      const newState = {
        ...testState,
        searchItemResponse: {
          searchResult: searchItemResponse,
          isSearchSuccess: true
        }
      };
      const result: InterBoutiqueTransferState = interBoutiqueTransferReducer(
        newState,
        action
      );
      expect(result.searchItemResponse).toEqual({
        searchResult: null,
        isSearchSuccess: false
      });
    });

    it('ResetRequestList', () => {
      const action = new actions.ResetRequestList();
      const newState = {
        ...testState,
        requestSentListCount: 10,
        requestReceivedListCount: 10
      };
      const result: InterBoutiqueTransferState = interBoutiqueTransferReducer(
        newState,
        action
      );
      expect(result.requestSentListCount).toEqual(0);
      expect(result.requestReceivedListCount).toEqual(0);
    });

    it('LoadHistoryFilterData', () => {
      const action = new actions.LoadHistoryFilterData(historyFilterData);
      const newState = {
        ...testState,
        advancedFilter: historyFilterData
      };
      const result: InterBoutiqueTransferState = interBoutiqueTransferReducer(
        newState,
        action
      );
      expect(result.advancedFilter).toEqual(historyFilterData);
    });

    it('RadioHistoryType', () => {
      const action = new actions.RadioHistoryType(
        interBoutiqueTransferRequestTypesEnumReq
      );
      const newState = {
        ...testState,
        historyType: interBoutiqueTransferRequestTypesEnumReq
      };
      const result: InterBoutiqueTransferState = interBoutiqueTransferReducer(
        newState,
        action
      );
      expect(result.historyType).toEqual(
        interBoutiqueTransferRequestTypesEnumReq
      );
    });

    it('ResetHstoryFilter', () => {
      const payload = 5670000;
      const action = new actions.ResetHstoryFilter(payload);
      const newState = {
        ...testState,
        advancedFilter: historyFilterData
      };
      const result: InterBoutiqueTransferState = interBoutiqueTransferReducer(
        newState,
        action
      );
      expect(result.advancedFilter).toEqual({
        startDate: moment(action.payload).startOf('day').valueOf(),
        endDate: moment(action.payload).endOf('day').valueOf(),
        reqFiscalYear: null,
        locationCode: null,
        statuses: [],
        dateType: null
      });
    });

    it('ResetLoadedHistory', () => {
      const action = new actions.ResetLoadedHistory();
      const newState = {
        ...testState,
        ibtHistoryCount: 10
      };
      const result: InterBoutiqueTransferState = interBoutiqueTransferReducer(
        newState,
        action
      );
      expect(result.ibtHistoryCount).toEqual(0);
    });
  });
});
