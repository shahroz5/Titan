import { TestBed } from '@angular/core/testing';
import { DataPersistence } from '@nrwl/angular';
import { Observable } from 'rxjs';
import { InterBoutiqueTransferService } from '../inter-boutique-transfer.service';
import { InterBoutiqueTransferEffects } from './inter-boutique-transfer.effect';
import { initialState, ibtFeatureKey } from './inter-boutique-transfer.reducer';
import { provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import {
  BoutiqueList,
  IBThistoryHeaderPayload,
  ItemList,
  ItemSummary,
  LoadBoutiqueListPayload,
  LoadIBTHistoryItemsPayload,
  LoadIBTHistoryItemsResponse,
  LoadIBTHistoryPayload,
  LoadItemListPayload,
  LoadRequestListCountPayload,
  LoadRequestListPayload,
  LoadRequestPayload,
  LoadSelectedHistoryHeaderInfoPayload,
  RequestList,
  UpdateItemListPayload,
  UpdateItemListStatusPayload,
  Request,
  ProductGroup
} from '@poss-web/shared/models';
import * as moment from 'moment';
import { hot, cold } from 'jasmine-marbles';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  ItemDataService,
  ProductGroupDataService
} from '@poss-web/shared/masters/data-access-masters';
import {
  ClearRequestReceivedList,
  ClearRequestSentList,
  CreateRequest,
  CreateRequestFailure,
  CreateRequestSuccess,
  LoadBoutiqueList,
  LoadBoutiqueListCount,
  LoadBoutiqueListCountFailure,
  LoadBoutiqueListCountSuccess,
  LoadBoutiqueListFailure,
  LoadBoutiqueListSuccess,
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

describe('IBT Effect Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: InterBoutiqueTransferEffects;

  const interBoutiqueTransferServiceSpy = jasmine.createSpyObj<
    InterBoutiqueTransferService
  >([
    'getRequestList',
    'getRequestCount',
    'getBoutiqueList',
    'getBoutiqueCount',
    'createRequest',
    'getRequest',
    'getItemList',
    'updateItemList',
    'updateItemListStatus',
    'getHistory',
    'getSelectedHistory',
    'getHistoryItems'
  ]);

  const itemDataServiceSpy = jasmine.createSpyObj<ItemDataService>([
    'getItemSummaryByCode'
  ]);

  const productGroupDataServiceSpy = jasmine.createSpyObj<
    ProductGroupDataService
  >(['getProductGroups']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        InterBoutiqueTransferEffects,
        DataPersistence,
        provideMockStore({
          initialState: {
            [ibtFeatureKey]: initialState
          }
        }),
        provideMockActions(() => actions$),

        {
          provide: InterBoutiqueTransferService,
          useValue: interBoutiqueTransferServiceSpy
        },
        {
          provide: ItemDataService,
          useValue: itemDataServiceSpy
        },
        {
          provide: ProductGroupDataService,
          useValue: productGroupDataServiceSpy
        }
      ]
    });

    effect = TestBed.inject(InterBoutiqueTransferEffects);
  });

  describe('loadRequestSentList', () => {
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

    it('should return a loadRequestSentList', () => {
      const action = new LoadRequestSentList(loadRequestListPayload);
      const outcome = new LoadRequestSentListSuccess([requestListResponse]);
      actions$ = cold('-a', { a: action });
      const response$ = cold('-b', { b: [requestListResponse] });
      interBoutiqueTransferServiceSpy.getRequestList.and.returnValue(response$);
      const expected$ = cold('--c', { c: outcome });
      expect(effect.loadRequestSentList$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadRequestSentList(loadRequestListPayload);
      const error = new Error('some error');
      const outcome = new ClearRequestSentList();
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      interBoutiqueTransferServiceSpy.getRequestList.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadRequestSentList$).toBeObservable(expected);
    });
  });

  describe('loadRequestReceivedList', () => {
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

    it('should return a loadRequestReceivedList', () => {
      const action = new LoadRequestReceivedList(loadRequestListPayload);
      const outcome = new LoadRequestReceivedListSuccess([requestListResponse]);
      actions$ = cold('-a', { a: action });
      const response$ = cold('-b', { b: [requestListResponse] });
      interBoutiqueTransferServiceSpy.getRequestList.and.returnValue(response$);
      const expected$ = cold('--c', { c: outcome });
      expect(effect.loadRequestReceivedList$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadRequestReceivedList(loadRequestListPayload);
      const error = new Error('some error');
      const outcome = new ClearRequestReceivedList();
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      interBoutiqueTransferServiceSpy.getRequestList.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadRequestReceivedList$).toBeObservable(expected);
    });
  });

  describe('loadRequestSentListCount', () => {
    const loadRequestListCountPayload: LoadRequestListCountPayload = {
      requestGroup: 'SENT',
      searchValue: 12
    };

    const requestListCountResponse: number = 10;

    it('should return a loadRequestSentListCount', () => {
      const action = new LoadRequestSentListCount(loadRequestListCountPayload);
      const outcome = new LoadRequestSentListCountSuccess(
        requestListCountResponse
      );
      actions$ = cold('-a', { a: action });
      const response$ = cold('-b', { b: requestListCountResponse });
      interBoutiqueTransferServiceSpy.getRequestCount.and.returnValue(
        response$
      );
      const expected$ = cold('--c', { c: outcome });
      expect(effect.loadRequestSentListCount$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadRequestSentListCount(loadRequestListCountPayload);
      const error = new Error('some error');
      const outcome = new LoadRequestSentListCountFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      interBoutiqueTransferServiceSpy.getRequestCount.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.loadRequestSentListCount$).toBeObservable(expected);
    });
  });

  describe('loadRequestReceivedListCount', () => {
    const loadRequestListCountPayload: LoadRequestListCountPayload = {
      requestGroup: 'SENT',
      searchValue: 12
    };

    const requestListCountResponse: number = 10;

    it('should return a loadRequestReceivedListCount', () => {
      const action = new LoadRequestReceivedListCount(
        loadRequestListCountPayload
      );
      const outcome = new LoadRequestReceivedListCountSuccess(
        requestListCountResponse
      );
      actions$ = cold('-a', { a: action });
      const response$ = cold('-b', { b: requestListCountResponse });
      interBoutiqueTransferServiceSpy.getRequestCount.and.returnValue(
        response$
      );
      const expected$ = cold('--c', { c: outcome });
      expect(effect.loadRequestReceivedListCount$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadRequestReceivedListCount(
        loadRequestListCountPayload
      );
      const error = new Error('some error');
      const outcome = new LoadRequestReceivedListCountFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      interBoutiqueTransferServiceSpy.getRequestCount.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.loadRequestReceivedListCount$).toBeObservable(expected);
    });
  });

  describe('loadBoutiqueList', () => {
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

    it('should return a loadBoutiqueList', () => {
      const action = new LoadBoutiqueList(loadBoutiqueListPayload);
      const outcome = new LoadBoutiqueListSuccess(boutiqueListResponse);
      actions$ = cold('-a', { a: action });
      const response$ = cold('-b', { b: boutiqueListResponse });
      interBoutiqueTransferServiceSpy.getBoutiqueList.and.returnValue(
        response$
      );
      const expected$ = cold('--c', { c: outcome });
      expect(effect.loadBoutiqueList$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadBoutiqueList(loadBoutiqueListPayload);
      const error = new Error('some error');
      const outcome = new LoadBoutiqueListFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      interBoutiqueTransferServiceSpy.getBoutiqueList.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.loadBoutiqueList$).toBeObservable(expected);
    });
  });

  describe('loadBoutiqueListCount', () => {
    const loadBoutiqueListPayload: LoadBoutiqueListPayload = {
      item: [{ itemCode: '5130182SHABA00', quantity: 1 }],
      regionType: 'TOWN'
    };

    const boutiqueListCountResponse: number = 20;
    it('should return a loadBoutiqueListCount', () => {
      const action = new LoadBoutiqueListCount(loadBoutiqueListPayload);
      const outcome = new LoadBoutiqueListCountSuccess(
        boutiqueListCountResponse
      );
      actions$ = cold('-a', { a: action });
      const response$ = cold('-b', { b: boutiqueListCountResponse });
      interBoutiqueTransferServiceSpy.getBoutiqueCount.and.returnValue(
        response$
      );
      const expected$ = cold('--c', { c: outcome });
      expect(effect.loadBoutiqueListCount$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadBoutiqueListCount(loadBoutiqueListPayload);
      const error = new Error('some error');
      const outcome = new LoadBoutiqueListCountFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      interBoutiqueTransferServiceSpy.getBoutiqueCount.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.loadBoutiqueListCount$).toBeObservable(expected);
    });
  });

  describe('createRequest', () => {
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
    it('should return a createRequest', () => {
      const action = new CreateRequest(createRequestPayload);
      const outcome = new CreateRequestSuccess(createRequestResponse);
      actions$ = cold('-a', { a: action });
      const response$ = cold('-b', { b: createRequestResponse });
      interBoutiqueTransferServiceSpy.createRequest.and.returnValue(response$);
      const expected$ = cold('--c', { c: outcome });
      expect(effect.createRequest$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new CreateRequest(createRequestPayload);
      const error = new Error('some error');
      const outcome = new CreateRequestFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      interBoutiqueTransferServiceSpy.createRequest.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.createRequest$).toBeObservable(expected);
    });
  });

  describe('loadRequest', () => {
    const loadRequestPayload: LoadRequestPayload = {
      id: 138,
      requestGroup: 'SENT'
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
    it('should return a loadRequest', () => {
      const action = new LoadRequest(loadRequestPayload);
      const outcome = new LoadRequestSuccess(createRequestResponse);
      actions$ = cold('-a', { a: action });
      const response$ = cold('-b', { b: createRequestResponse });
      interBoutiqueTransferServiceSpy.getRequest.and.returnValue(response$);
      const expected$ = cold('--c', { c: outcome });
      expect(effect.loadRequest$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadRequest(loadRequestPayload);
      const error = new Error('some error');
      const outcome = new LoadRequestFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      interBoutiqueTransferServiceSpy.getRequest.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadRequest$).toBeObservable(expected);
    });
  });

  describe('loadItemList', () => {
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
    it('should return a loadItemList', () => {
      const action = new LoadItemList(loadItemListPayload);
      const outcome = new LoadItemListSuccess([itemListRes]);
      actions$ = cold('-a', { a: action });
      const response$ = cold('-b', { b: [itemListRes] });
      interBoutiqueTransferServiceSpy.getItemList.and.returnValue(response$);
      const expected$ = cold('--c', { c: outcome });
      expect(effect.loadItemList$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadItemList(loadItemListPayload);
      const error = new Error('some error');
      const outcome = new LoadItemListFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      interBoutiqueTransferServiceSpy.getItemList.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadItemList$).toBeObservable(expected);
    });
  });

  describe('updateItemList', () => {
    const updateItemListPayload: UpdateItemListPayload = {
      id: 92,
      itemId: 'A5D6041E-365C-409A-A614-EB022C5E44C0',
      requestGroup: 'SENT',
      data: {
        quantity: 1,
        status: 'ACCEPTED'
      }
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
    it('should return a updateItemList', () => {
      const action = new UpdateItemList(updateItemListPayload);
      const outcome = new UpdateItemListSuccess(itemListRes);
      actions$ = cold('-a', { a: action });
      const response$ = cold('-b', { b: itemListRes });
      interBoutiqueTransferServiceSpy.updateItemList.and.returnValue(response$);
      const expected$ = cold('--c', { c: outcome });
      expect(effect.updateItemList$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new UpdateItemList(updateItemListPayload);
      const error = new Error('some error');
      const outcome = new UpdateItemListFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      interBoutiqueTransferServiceSpy.updateItemList.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.updateItemList$).toBeObservable(expected);
    });
  });

  describe('updateItemListStatus', () => {
    const updateItemListStatusPayload: UpdateItemListStatusPayload = {
      type: 'ACCEPTED',
      id: 92,
      requestGroup: 'SENT',
      itemIds: ['A5D6041E-365C-409A-A614-EB022C5E44C0'],
      remarks: 'string'
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
    it('should return a updateItemListStatus', () => {
      const action = new UpdateItemListStatus(updateItemListStatusPayload);
      const outcome = new UpdateItemListStatusSuccess(requestListResponse);
      actions$ = cold('-a', { a: action });
      const response$ = cold('-b', { b: requestListResponse });
      interBoutiqueTransferServiceSpy.updateItemListStatus.and.returnValue(
        response$
      );
      const expected$ = cold('--c', { c: outcome });
      expect(effect.updateItemListStatus$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new UpdateItemListStatus(updateItemListStatusPayload);
      const error = new Error('some error');
      const outcome = new UpdateItemListStatusFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      interBoutiqueTransferServiceSpy.updateItemListStatus.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.updateItemListStatus$).toBeObservable(expected);
    });
  });

  describe('searchItem', () => {
    const searchItemRequest: string = '504117VDCS1A09';

    const searchItemResponse: ItemSummary = {
      itemCode: '5',
      productCategoryCode: 'UD',
      productCategoryDesc: 'RUDRAKSHA',
      productGroupCode: '74',
      productGroupDesc: 'Diamonds',
      stdValue: 511
    };
    it('should return a searchItem', () => {
      const action = new SearchItem(searchItemRequest);
      const outcome = new SearchItemSuccess(searchItemResponse);
      actions$ = cold('-a', { a: action });
      const response$ = cold('-b', { b: searchItemResponse });
      itemDataServiceSpy.getItemSummaryByCode.and.returnValue(response$);
      const expected$ = cold('--c', { c: outcome });
      expect(effect.searchItem$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new SearchItem(searchItemRequest);
      const error = new Error('some error');
      const outcome = new SearchItemFailure(CustomErrorAdaptor.fromJson(error));
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      itemDataServiceSpy.getItemSummaryByCode.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.searchItem$).toBeObservable(expected);
    });
  });

  describe('loadStuddedProductGroups', () => {
    const serviceReponse: ProductGroup[] = [
      {
        productGroupCode: 'Test 1',
        description: 'Test 1'
      },
      {
        productGroupCode: 'Test 2',
        description: 'Test 2'
      }
    ];
    const studdedProductGroups: string[] = serviceReponse.map(
      pg => pg.productGroupCode
    );

    it('should return a loadStuddedProductGroups', () => {
      const action = new LoadStuddedProductGroups();
      const outcome = new LoadStuddedProductGroupsSuccess(studdedProductGroups);
      actions$ = cold('-a', { a: action });
      const response$ = cold('-b', { b: serviceReponse });
      productGroupDataServiceSpy.getProductGroups.and.returnValue(response$);
      const expected$ = cold('--c', { c: outcome });
      expect(effect.loadStuddedProductGroups$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadStuddedProductGroups();
      const error = new Error('some error');
      const outcome = new LoadStuddedProductGroupsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      productGroupDataServiceSpy.getProductGroups.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadStuddedProductGroups$).toBeObservable(expected);
    });
  });

  describe('loadIBTHistory', () => {
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

    const loadIBTHistoryItemsEmptyResponse: LoadIBTHistoryItemsResponse = {
      count: 0,
      items: []
    };

    it('should return a loadIBTHistory', () => {
      const action = new LoadIBTHistory(loadIBTHistoryPayload);
      const outcome = new LoadIBTHistorySuccess(loadIBTHistoryItemsResponse);
      actions$ = cold('-a', { a: action });
      const response$ = cold('-b', { b: loadIBTHistoryItemsResponse });
      interBoutiqueTransferServiceSpy.getHistory.and.returnValue(response$);
      const expected$ = cold('--c', { c: outcome });
      expect(effect.loadIBTHistory$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadIBTHistory(loadIBTHistoryPayload);
      const error = new Error('some error');
      const outcome = new LoadIBTHistorySuccess(
        loadIBTHistoryItemsEmptyResponse
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      interBoutiqueTransferServiceSpy.getHistory.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadIBTHistory$).toBeObservable(expected);
    });
  });

  describe('loadSelectedHistory', () => {
    const loadSelectedHistoryHeaderInfoPayload: LoadSelectedHistoryHeaderInfoPayload = {
      id: 125,
      actionType: 'RECEIVE'
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

    it('should return a loadSelectedHistory', () => {
      const action = new LoadSelectedHistory(
        loadSelectedHistoryHeaderInfoPayload
      );
      const outcome = new LoadSelectedHistorySuccess(
        IBThistoryHeaderPayloadRes
      );
      actions$ = cold('-a', { a: action });
      const response$ = cold('-b', { b: IBThistoryHeaderPayloadRes });
      interBoutiqueTransferServiceSpy.getSelectedHistory.and.returnValue(
        response$
      );
      const expected$ = cold('--c', { c: outcome });
      expect(effect.loadSelectedHistory$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadSelectedHistory(
        loadSelectedHistoryHeaderInfoPayload
      );
      const error = new Error('some error');
      const outcome = new LoadSelectedHistoryFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      interBoutiqueTransferServiceSpy.getSelectedHistory.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.loadSelectedHistory$).toBeObservable(expected);
    });
  });

  describe('loadHistoryItems', () => {
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

    it('should return a loadHistoryItems', () => {
      const action = new LoadHistoryItems(loadIBTHistoryItemsPayload);
      const outcome = new LoadHistoryItemsSuccess([itemListRes]);
      actions$ = cold('-a', { a: action });
      const response$ = cold('-b', { b: [itemListRes] });
      interBoutiqueTransferServiceSpy.getHistoryItems.and.returnValue(
        response$
      );
      const expected$ = cold('--c', { c: outcome });
      expect(effect.loadHistoryItems$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadHistoryItems(loadIBTHistoryItemsPayload);
      const error = new Error('some error');
      const outcome = new LoadHistoryItemsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      interBoutiqueTransferServiceSpy.getHistoryItems.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.loadHistoryItems$).toBeObservable(expected);
    });
  });
});
