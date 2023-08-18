import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { InterBoutiqueTransferService } from './inter-boutique-transfer.service';
import { TestBed } from '@angular/core/testing';
import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import {
  InterBoutiqueTransferHelper,
  InterBoutiqueTransferAdaptor
} from '@poss-web/shared/util-adaptors';
import {
  getRequestListByPaginationEndpointUrl,
  getBoutiqueListByPaginationEndpointUrl,
  getItemListEndpointUrl,
  getRequestEndpointUrl,
  getCreateRequestListEndpointUrl,
  updateItemListEndpointUrl,
  updateItemListStatusEndpointUrl,
  getIBTHistoryByPaginationEndpointUrl,
  getIBTSelectedHistoryUrl,
  getIBTHistoryItemsByPaginationEndpointUrl
} from '@poss-web/shared/util-api-service';
import * as moment from 'moment';
import {
  RequestList,
  RequestItem,
  BoutiqueList,
  ItemList,
  IBThistoryHeaderPayload,
  LoadIBTHistoryItemsResponse
} from '@poss-web/shared/models';

describe('IBTService ', () => {
  let httpTestingController: HttpTestingController;
  let IBTService: InterBoutiqueTransferService;
  const APIUrl = 'http://localhost:3000';

  const requestResponse: RequestList = {
    id: 1,
    reqDocNo: 10001,
    srcLocationCode: 'URB',
    destLocationCode: 'ABO',
    totalRequestedQuantity: 2,
    acceptedQuantity: 1,
    approvedQuantity: 0,
    status: 'REQUESTED',
    reqDocDate: moment(),
    requestType: 'SENT',
    requestRemarks: 'Testing',
    totalElements: 10,
    createdDate: moment()
  };

  const requestListResponse: RequestList[] = [requestResponse];

  const boutiqueListResponse: BoutiqueList[] = [
    {
      locationCode: 'ABO',
      address: 'temp address',
      contactNo: '9087654321',
      phoneNo: '1234567890',
      description: 'Boutique'
    }
  ];

  const itemRequest: RequestItem[] = [
    {
      itemCode: '78218271827182',
      quantity: 1
    }
  ];

  const itemDetails = [
    {
      quantity: 1,
      status: 'REQUESTED'
    }
  ];

  const itemResponse: ItemList = {
    id: '13',
    itemCode: '12537163763271',
    lotNumber: '1234567',
    mfgDate: moment(),
    productCategory: 'AbC',
    productGroup: 'qwe',
    binCode: 'binCode',
    binGroupCode: 'binGroupCode',
    stdValue: 1212,
    stdWeight: 909,
    currencyCode: 'INR',
    weightUnit: 'WER',
    status: 'status',
    imageURL: 'imageURL',
    itemDetails: 'itemDetails',
    requestedQuantity: 1,
    requestedWeight: 12,
    acceptedQuantity: 2,
    approvedQuantity: 3,
    availableQuantity: 4,
    inventoryId: '12',
    totalAcceptedQuantity: 56,
    productCategoryDesc: 'productCategoryDesc',
    productGroupDesc: 'productGroupDesc',
    isStudded: true
  };

  const itemListResponse: ItemList[] = [itemResponse];

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

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        InterBoutiqueTransferService,
        {
          provide: POSS_WEB_API_URL,
          useValue: APIUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    IBTService = TestBed.inject(InterBoutiqueTransferService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(InterBoutiqueTransferService).toBeTruthy();
  });

  describe('getRequests', () => {
    it('should call GET API method', () => {
      spyOn(InterBoutiqueTransferHelper, 'getRequestList').and.returnValue({});
      const type = 'SENT';
      const searchValue = 0;
      const pageIndex = 0;
      const pageSize = 8;
      const path = getRequestListByPaginationEndpointUrl(
        type,
        searchValue,
        pageIndex,
        pageSize
      ).path;

      IBTService.getRequestList(
        type,
        searchValue,
        pageIndex,
        pageSize
      ).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === APIUrl + path;
      });

      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.url).toBe(APIUrl + path);
      request.flush({});
    });

    it('should call requests helper method', () => {
      spyOn(InterBoutiqueTransferHelper, 'getRequestList').and.returnValue({});
      const type = 'BTQ';
      const searchValue = 0;
      const pageIndex = 0;
      const pageSize = 8;
      const path = getRequestListByPaginationEndpointUrl(
        type,
        searchValue,
        pageIndex,
        pageSize
      ).path;

      IBTService.getRequestList(
        type,
        searchValue,
        pageIndex,
        pageSize
      ).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === APIUrl + path;
      });
      request.flush(requestListResponse);
      expect(InterBoutiqueTransferHelper.getRequestList).toHaveBeenCalledWith(
        requestListResponse
      );
    });

    it('should return mapped data', () => {
      spyOn(InterBoutiqueTransferHelper, 'getRequestList').and.returnValue(
        requestListResponse
      );
      const type = 'BTQ';
      const searchValue = 0;
      const pageIndex = 0;
      const pageSize = 8;
      const path = getRequestListByPaginationEndpointUrl(
        type,
        searchValue,
        pageIndex,
        pageSize
      ).path;

      IBTService.getRequestList(
        type,
        searchValue,
        pageIndex,
        pageSize
      ).subscribe(data => {
        expect(data).toEqual(requestListResponse);
        expect(data.length).toEqual(1);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === APIUrl + path;
      });
      request.flush({});
    });
  });

  describe('getBoutiques', () => {
    it('should call POST API method', () => {
      spyOn(InterBoutiqueTransferHelper, 'getBoutiqueList').and.returnValue({});
      const items = itemRequest;
      const regionType = 'BTQ';
      const pageIndex = 0;
      const pageSize = 8;
      const path = getBoutiqueListByPaginationEndpointUrl(
        regionType,
        pageIndex,
        pageSize
      ).path;

      IBTService.getBoutiqueList(
        items,
        regionType,
        pageIndex,
        pageSize
      ).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === APIUrl + path;
      });

      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.url).toBe(APIUrl + path);
      request.flush({});
    });

    it('should call boutiques helper method', () => {
      spyOn(InterBoutiqueTransferHelper, 'getBoutiqueList').and.returnValue({});
      const items = itemRequest;
      const regionType = 'BTQ';
      const pageIndex = 0;
      const pageSize = 8;

      const path = getBoutiqueListByPaginationEndpointUrl(
        regionType,
        pageIndex,
        pageSize
      ).path;

      IBTService.getBoutiqueList(
        items,
        regionType,
        pageIndex,
        pageSize
      ).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === APIUrl + path;
      });
      request.flush(boutiqueListResponse);
      expect(InterBoutiqueTransferHelper.getBoutiqueList).toHaveBeenCalledWith(
        boutiqueListResponse
      );
    });

    it('should return mapped data', () => {
      spyOn(InterBoutiqueTransferHelper, 'getBoutiqueList').and.returnValue(
        boutiqueListResponse
      );
      const items = itemRequest;
      const regionType = 'BTQ';
      const pageIndex = 0;
      const pageSize = 8;
      const path = getBoutiqueListByPaginationEndpointUrl(
        regionType,
        pageIndex,
        pageSize
      ).path;

      IBTService.getBoutiqueList(
        items,
        regionType,
        pageIndex,
        pageSize
      ).subscribe(data => {
        expect(data).toEqual(boutiqueListResponse);
        expect(data.length).toEqual(1);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === APIUrl + path;
      });
      request.flush({});
    });
  });

  describe('getItems', () => {
    it('should call GET API method', () => {
      spyOn(InterBoutiqueTransferHelper, 'getItemList').and.returnValue({});
      const id = 12;
      const requestGroup = 'BTQ';
      const path = getItemListEndpointUrl(id, requestGroup).path;

      IBTService.getItemList(id, requestGroup).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === APIUrl + path;
      });

      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.url).toBe(APIUrl + path);
      request.flush({});
    });

    it('should call items helper method', () => {
      spyOn(InterBoutiqueTransferHelper, 'getItemList').and.returnValue({});
      const id = 12;
      const requestGroup = 'BTQ';
      const path = getItemListEndpointUrl(id, requestGroup).path;

      IBTService.getItemList(id, requestGroup).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === APIUrl + path;
      });
      request.flush(itemListResponse);
      expect(InterBoutiqueTransferHelper.getItemList).toHaveBeenCalledWith(
        itemListResponse,
        []
      );
    });

    it('should return mapped data', () => {
      spyOn(InterBoutiqueTransferHelper, 'getItemList').and.returnValue(
        itemListResponse
      );
      const id = 12;
      const requestGroup = 'BTQ';
      const path = getItemListEndpointUrl(id, requestGroup).path;

      IBTService.getItemList(id, requestGroup).subscribe(data => {
        expect(data).toEqual(itemListResponse);
        expect(data.length).toEqual(1);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === APIUrl + path;
      });
      request.flush({});
    });
  });

  describe('getRequest', () => {
    it('should call GET API method', () => {
      spyOn(InterBoutiqueTransferAdaptor, 'requestFromJson').and.returnValue(
        {}
      );
      const id = 12;
      const requestGroup = 'BTQ';
      const path = getRequestEndpointUrl(id, requestGroup).path;

      IBTService.getRequest(id, requestGroup).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === APIUrl + path;
      });

      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.url).toEqual(APIUrl + path);
      request.flush({});
    });

    it('should call request adpator method', () => {
      spyOn(InterBoutiqueTransferAdaptor, 'requestFromJson').and.returnValue(
        {}
      );
      const id = 12;
      const requestGroup = 'BTQ';
      const path = getRequestEndpointUrl(id, requestGroup).path;

      IBTService.getRequest(id, requestGroup).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === APIUrl + path;
      });

      request.flush(requestResponse);
      expect(InterBoutiqueTransferAdaptor.requestFromJson).toHaveBeenCalledWith(
        requestResponse
      );
    });

    it('should return mapped data', () => {
      spyOn(InterBoutiqueTransferAdaptor, 'requestFromJson').and.returnValue(
        requestResponse
      );
      const id = 12;
      const requestGroup = 'BTQ';
      const path = getRequestEndpointUrl(id, requestGroup).path;

      IBTService.getRequest(id, requestGroup).subscribe(data => {
        expect(data).toEqual(requestResponse);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === APIUrl + path;
      });
      request.flush({});
    });
  });

  describe('getRequestCount', () => {
    it('should call GET API method', () => {
      const type = 'SENT';
      const searchValue = 0;
      const pageIndex = 0;
      const pageSize = 1;
      const path = getRequestListByPaginationEndpointUrl(
        type,
        searchValue,
        pageIndex,
        pageSize
      ).path;

      IBTService.getRequestCount(type, searchValue).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === APIUrl + path;
      });

      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.url).toBe(APIUrl + path);
      request.flush({});
    });
  });

  describe('getBoutiqueCount', () => {
    it('should call POST API method', () => {
      const items = itemRequest;
      const regionType = 'BTQ';
      const pageIndex = 0;
      const pageSize = 1;

      const path = getBoutiqueListByPaginationEndpointUrl(
        regionType,
        pageIndex,
        pageSize
      ).path;

      IBTService.getBoutiqueCount(items, regionType).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === APIUrl + path;
      });

      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.url).toBe(APIUrl + path);
      request.flush({});
    });
  });

  describe('createRequest', () => {
    it('should call POST API method', () => {
      spyOn(InterBoutiqueTransferAdaptor, 'requestFromJson').and.returnValue(
        {}
      );
      const items = itemRequest;
      const remarks = 'remark';
      const srcLocationCode = 'URB';
      const path = getCreateRequestListEndpointUrl().path;

      IBTService.createRequest(items, remarks, srcLocationCode).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === APIUrl + path;
      });

      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.url).toBe(APIUrl + path);
      request.flush({});
    });

    it('should call requests helper method', () => {
      spyOn(InterBoutiqueTransferAdaptor, 'requestFromJson').and.returnValue(
        {}
      );
      const items = itemRequest;
      const remarks = 'remark';
      const srcLocationCode = 'URB';
      const path = getCreateRequestListEndpointUrl().path;

      IBTService.createRequest(items, remarks, srcLocationCode).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === APIUrl + path;
      });
      request.flush(requestResponse);
      expect(InterBoutiqueTransferAdaptor.requestFromJson).toHaveBeenCalledWith(
        requestResponse
      );
    });

    it('should return mapped data', () => {
      spyOn(InterBoutiqueTransferAdaptor, 'requestFromJson').and.returnValue(
        requestResponse
      );
      const items = itemRequest;
      const remarks = 'remark';
      const srcLocationCode = 'URB';
      const path = getCreateRequestListEndpointUrl().path;

      IBTService.createRequest(items, remarks, srcLocationCode).subscribe(
        data => {
          expect(data).toEqual(requestResponse);
        }
      );

      const request = httpTestingController.expectOne(req => {
        return req.url === APIUrl + path;
      });
      request.flush({});
    });
  });

  describe('updateItemList', () => {
    it('should call PATCH API method', () => {
      spyOn(InterBoutiqueTransferAdaptor, 'itemFromJson').and.returnValue({});
      const id = 1;
      const itemId = '10';
      const items = itemDetails;
      const requestGroup = 'SENT';
      const path = updateItemListEndpointUrl(id, itemId, requestGroup).path;

      IBTService.updateItemList(id, itemId, requestGroup, items).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === APIUrl + path;
      });

      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.url).toBe(APIUrl + path);
      request.flush({});
    });

    it('should call items helper method', () => {
      spyOn(InterBoutiqueTransferAdaptor, 'itemFromJson').and.returnValue({});
      const id = 1;
      const itemId = '10';
      const items = itemDetails;
      const requestGroup = 'SENT';
      const path = updateItemListEndpointUrl(id, itemId, requestGroup).path;

      IBTService.updateItemList(id, itemId, requestGroup, items).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === APIUrl + path;
      });
      request.flush(itemResponse);
      expect(InterBoutiqueTransferAdaptor.itemFromJson).toHaveBeenCalledWith(
        itemResponse,
        []
      );
    });

    it('should return mapped data', () => {
      spyOn(InterBoutiqueTransferAdaptor, 'itemFromJson').and.returnValue(
        itemResponse
      );
      const id = 1;
      const itemId = '10';
      const items = itemDetails;
      const requestGroup = 'SENT';
      const path = updateItemListEndpointUrl(id, itemId, requestGroup).path;

      IBTService.updateItemList(id, itemId, requestGroup, items).subscribe(
        data => {
          expect(data).toEqual(itemResponse);
        }
      );

      const request = httpTestingController.expectOne(req => {
        return req.url === APIUrl + path;
      });
      request.flush({});
    });
  });

  describe('updateRequest', () => {
    it('should call PATCH API method', () => {
      spyOn(InterBoutiqueTransferAdaptor, 'requestFromJson').and.returnValue(
        {}
      );
      const id = 1;
      const itemIds = ['10', '20', '30'];
      const status = 'ACCEPTED';
      const requestGroup = 'SENT';
      const remarks = 'accept';
      const path = updateItemListStatusEndpointUrl(id, requestGroup).path;

      IBTService.updateItemListStatus(
        status,
        id,
        itemIds,
        requestGroup,
        remarks
      ).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === APIUrl + path;
      });

      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.url).toBe(APIUrl + path);
      request.flush({});
    });

    it('should call requests helper method', () => {
      spyOn(InterBoutiqueTransferAdaptor, 'requestFromJson').and.returnValue(
        {}
      );
      const id = 1;
      const itemIds = ['10', '20', '30'];
      const status = 'ACCEPTED';
      const requestGroup = 'SENT';
      const remarks = 'accept';

      const path = updateItemListStatusEndpointUrl(id, requestGroup).path;

      IBTService.updateItemListStatus(
        status,
        id,
        itemIds,
        requestGroup,
        remarks
      ).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === APIUrl + path;
      });
      request.flush(requestResponse);
      expect(InterBoutiqueTransferAdaptor.requestFromJson).toHaveBeenCalledWith(
        requestResponse
      );
    });

    it('should return mapped data', () => {
      spyOn(InterBoutiqueTransferAdaptor, 'requestFromJson').and.returnValue(
        requestResponse
      );
      const id = 1;
      const itemIds = ['10', '20', '30'];
      const status = 'ACCEPTED';
      const requestGroup = 'SENT';
      const remarks = 'accept';
      const path = updateItemListStatusEndpointUrl(id, requestGroup).path;

      IBTService.updateItemListStatus(
        status,
        id,
        itemIds,
        requestGroup,
        remarks
      ).subscribe(data => {
        expect(data).toEqual(requestResponse);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === APIUrl + path;
      });
      request.flush({});
    });
  });

  describe('getHistory', () => {
    it('should call post API method', () => {
      spyOn(InterBoutiqueTransferHelper, 'getHistoryItemList').and.returnValue(
        {}
      );
      const page = 1;
      const size = 2;
      const requestType = 'BTQ';
      const historyPayload = {
        actionType: 'RECEIVE',
        dateRangeType: 'CUSTOM',
        statuses: []
      };
      const path = getIBTHistoryByPaginationEndpointUrl(page, size, requestType)
        .path;

      IBTService.getHistory(
        historyPayload,
        page,
        size,
        requestType
      ).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === APIUrl + path;
      });

      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.url).toBe(APIUrl + path);
      request.flush({});
    });

    it('should call history item list helper method', () => {
      spyOn(InterBoutiqueTransferHelper, 'getHistoryItemList').and.returnValue(
        {}
      );
      const page = 1;
      const size = 2;
      const requestType = 'BTQ';
      const historyPayload = {
        actionType: 'RECEIVE',
        dateRangeType: 'CUSTOM',
        statuses: []
      };
      const path = getIBTHistoryByPaginationEndpointUrl(page, size, requestType)
        .path;

      IBTService.getHistory(
        historyPayload,
        page,
        size,
        requestType
      ).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === APIUrl + path;
      });
      request.flush(loadIBTHistoryItemsResponse);
      expect(
        InterBoutiqueTransferHelper.getHistoryItemList
      ).toHaveBeenCalledWith(loadIBTHistoryItemsResponse);
    });

    it('should return mapped data', () => {
      spyOn(InterBoutiqueTransferHelper, 'getHistoryItemList').and.returnValue(
        loadIBTHistoryItemsResponse
      );
      const page = 1;
      const size = 2;
      const requestType = 'BTQ';
      const historyPayload = {
        actionType: 'RECEIVE',
        dateRangeType: 'CUSTOM',
        statuses: []
      };
      const path = getIBTHistoryByPaginationEndpointUrl(page, size, requestType)
        .path;

      IBTService.getHistory(historyPayload, page, size, requestType).subscribe(
        data => {
          expect(data).toEqual(loadIBTHistoryItemsResponse);
        }
      );

      const request = httpTestingController.expectOne(req => {
        return req.url === APIUrl + path;
      });
      request.flush({});
    });
  });

  describe('getSelectedHistory', () => {
    it('should call get API method', () => {
      spyOn(InterBoutiqueTransferAdaptor, 'historyFromJson').and.returnValue(
        {}
      );
      const id = 1;
      const actionType = 'RECEIVE';
      const path = getIBTSelectedHistoryUrl(id, actionType).path;

      IBTService.getSelectedHistory(id, actionType).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === APIUrl + path;
      });

      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.url).toBe(APIUrl + path);
      request.flush({});
    });

    it('should call history helper method', () => {
      spyOn(InterBoutiqueTransferAdaptor, 'historyFromJson').and.returnValue(
        {}
      );
      const id = 1;
      const actionType = 'RECEIVE';
      const path = getIBTSelectedHistoryUrl(id, actionType).path;
      IBTService.getSelectedHistory(id, actionType).subscribe();
      const request = httpTestingController.expectOne(req => {
        return req.url === APIUrl + path;
      });
      request.flush(IBThistoryHeaderPayloadRes);
      expect(InterBoutiqueTransferAdaptor.historyFromJson).toHaveBeenCalledWith(
        IBThistoryHeaderPayloadRes
      );
    });

    it('should return mapped data', () => {
      spyOn(InterBoutiqueTransferAdaptor, 'historyFromJson').and.returnValue(
        IBThistoryHeaderPayloadRes
      );
      const id = 1;
      const actionType = 'RECEIVE';
      const path = getIBTSelectedHistoryUrl(id, actionType).path;
      IBTService.getSelectedHistory(id, actionType).subscribe(data => {
        expect(data).toEqual(IBThistoryHeaderPayloadRes);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === APIUrl + path;
      });
      request.flush({});
    });
  });

  describe('getHistoryItems', () => {
    it('should call post API method', () => {
      spyOn(InterBoutiqueTransferHelper, 'getItemList').and.returnValue({});
      const pageIndex = 1;
      const pageSize = 2;
      const actionType = 'RECEIVE';
      const value = 10;
      const requestType = 'history';
      const historyItemsPayload = {
        binCodes: [null],
        binGroupCode: null,
        itemCode: null,
        lotNumber: null,
        productCategories: [null],
        productGroups: [null]
      };
      const studdedProductGroups = ['72'];
      const path = getIBTHistoryItemsByPaginationEndpointUrl(
        pageIndex,
        pageSize,
        value,
        actionType
      ).path;

      IBTService.getHistoryItems(
        historyItemsPayload,
        requestType,
        pageIndex,
        pageSize,
        value,
        actionType,
        studdedProductGroups
      ).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === APIUrl + path;
      });

      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.url).toBe(APIUrl + path);
      request.flush({});
    });

    it('should call history item list helper method', () => {
      spyOn(InterBoutiqueTransferHelper, 'getItemList').and.returnValue({});
      const pageIndex = 1;
      const pageSize = 2;
      const actionType = 'RECEIVE';
      const value = 10;
      const requestType = 'history';
      const historyItemsPayload = {
        binCodes: [null],
        binGroupCode: null,
        itemCode: null,
        lotNumber: null,
        productCategories: [null],
        productGroups: [null]
      };
      const studdedProductGroups = ['72'];
      const path = getIBTHistoryItemsByPaginationEndpointUrl(
        pageIndex,
        pageSize,
        value,
        actionType
      ).path;

      IBTService.getHistoryItems(
        historyItemsPayload,
        requestType,
        pageIndex,
        pageSize,
        value,
        actionType,
        studdedProductGroups
      ).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === APIUrl + path;
      });
      request.flush(itemListRes);
      expect(InterBoutiqueTransferHelper.getItemList).toHaveBeenCalledWith(
        itemListRes,
        studdedProductGroups
      );
    });

    it('should return mapped data', () => {
      spyOn(InterBoutiqueTransferHelper, 'getItemList').and.returnValue([
        itemListRes
      ]);
      const pageIndex = 1;
      const pageSize = 2;
      const actionType = 'RECEIVE';
      const value = 10;
      const requestType = 'history';
      const historyItemsPayload = {
        binCodes: [null],
        binGroupCode: null,
        itemCode: null,
        lotNumber: null,
        productCategories: [null],
        productGroups: [null]
      };
      const studdedProductGroups = ['72'];
      const path = getIBTHistoryItemsByPaginationEndpointUrl(
        pageIndex,
        pageSize,
        value,
        actionType
      ).path;

      IBTService.getHistoryItems(
        historyItemsPayload,
        requestType,
        pageIndex,
        pageSize,
        value,
        actionType,
        studdedProductGroups
      ).subscribe(data => {
        expect(data).toEqual([itemListRes]);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === APIUrl + path;
      });
      request.flush({});
    });
  });
});
