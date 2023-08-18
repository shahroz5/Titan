import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import {
  ConversionApprovalDetailsPayload,
  ConversionHistory,
  ConversionHistoryItems,
  ConversionHistoryItemsPayload,
  ConversionHistoryItemsSuccessPayload,
  ConversionHistorySuccessPayload,
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
  RequestSentHistoryPayload
} from '@poss-web/shared/models';
import { ConversionAdaptor } from '@poss-web/shared/util-adaptors';
import {
  getConversionItemsEndpointUrl,
  getConversionReqCountEndpointUrl,
  getConversionRequestDataByIdEnpointUrl,
  getConversionRequestEndpointUrl,
  getConversionRequestsByIdEndPointUrl,
  getConversionRequestsBySrcDocNoUrl,
  getConversionRequestsEndpointUrl,
  getConversionSearchItemsEndpointUrl,
  getConversionSplitItemEndpointUrl,
  getConvertedTransactionHistoryUrl,
  getRequestSentHistoryItemsUrl,
  getRequestSentHistoryUrl,
  getRsoDetailsEndpointUrl,
  getSelectedConvertedTransactionHistoryUrl,
  getSelectedRequestSentHistoryUrl
} from '@poss-web/shared/util-api-service';
import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import * as moment from 'moment';
import { ConversionService } from './conversion.service';

describe('ConversionService', () => {
  let httpTestingController: HttpTestingController;
  let conversionService: ConversionService;
  const apiUrl = 'http://localhost:3000';

  const dummyConversionRequest: ConversionRequests[] = [
    {
      createdDate: moment(),
      id: 0,
      srcDocNo: 0,
      status: 'APPROVED',
      totalQuantity: 0,
      totalValue: 0,
      totalWeight: 0
    }
  ];
  const dummyConversionRequestAPIResponse = {
    results: dummyConversionRequest,
    pageIndex: 0,
    pageSize: 8,
    totalElements: 1,
    totalPageSize: 1
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
    isLoadingImage: true,
    isLoadingThumbnailImage: false,
    thumbnailImageURL: 'abcdefg',
    inventoryId: 'CB45B857-57A4-467C-A97E-BCF7193585F1',
    itemCode: '501090FGALAP70',
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
  const conversionItem: ConversionItem = {
    autoApproved: false,
    binCode: 'AREPLNISH',
    childItems: [],
    complexityCode: 'PNA',
    currencyCode: 'INR',
    imageURL: '/productcatalogue/ProductImages/1090FGA.jpg',
    isLoadingImage: true,
    isLoadingThumbnailImage: false,
    thumbnailImageURL: 'abcdefg',
    inventoryId: 'CB45B857-57A4-467C-A97E-BCF7193585F1',
    itemCode: '501090FGALAP70',
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
  const conversionLoadItemsPayload: ConversionLoadItemsPayload = {
    itemCode: '501090FGALAP70',
    lotNumber: '3IH005125',
    itemWeight: 3.905,
    binCode: 'AREPLNISH'
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
  const conversionHistory: ConversionHistory = {
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
  const conversionHistoryItemsSuccessPayload: ConversionHistoryItemsSuccessPayload = {
    items: [conversionHistoryItems],
    count: 10
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ConversionService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    conversionService = TestBed.inject(ConversionService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });
  it('should be created', () => {
    expect(conversionService).toBeTruthy();
  });
  describe('getSearchedItems', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(ConversionAdaptor, 'inventoryItemFromJson').and.returnValue(['']);
      const itemCode = '111111111a';
      const url = getConversionSearchItemsEndpointUrl(itemCode);
      conversionService.getSearchedItems(itemCode).subscribe();
      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + url.path
      );
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.params.toString()).toEqual(url.params.toString());
      request.flush({});
    });
  });
  describe('getRequests', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(ConversionAdaptor, 'requestsFromJson').and.returnValue({});
      const pageIndex = 0;
      const pageSize = 8;
      const { path, params } = getConversionRequestsEndpointUrl(
        pageIndex,
        pageSize
      );
      conversionService.getRequests(pageIndex, pageSize).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.params.toString()).toEqual(params.toString());
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.get('page').toString()).toEqual(
        pageIndex.toString()
      );
      expect(request.request.params.get('size').toString()).toEqual(
        pageSize.toString()
      );
      request.flush({});
    });
    it('should call adaptor method with correct arguments', () => {
      spyOn(ConversionAdaptor, 'requestsFromJson').and.returnValue({});
      const pageIndex = 0;
      const pageSize = 8;
      const path = getConversionRequestsEndpointUrl(pageIndex, pageSize).path;
      conversionService.getRequests(pageIndex, pageSize).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush(dummyConversionRequestAPIResponse);
      expect(ConversionAdaptor.requestsFromJson).toHaveBeenCalledWith(
        dummyConversionRequestAPIResponse
      );
    });
    it('should return data mapped by conversion get requests helper', () => {
      spyOn(ConversionAdaptor, 'requestsFromJson').and.returnValue(
        dummyConversionRequest
      );
      const pageIndex = 0;
      const pageSize = 8;
      const path = getConversionRequestsEndpointUrl(pageIndex, pageSize).path;

      conversionService.getRequests(pageIndex, pageSize).subscribe(data => {
        expect(data).toEqual(dummyConversionRequest);
      });
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush({});
    });
  });

  it('getConversionRequests - should get Conversion Requests', () => {
    spyOn(ConversionAdaptor, 'conversionRequestsWithCount').and.returnValue(
      conversionRequestsResponse
    );
    const pageIndex = 0;
    const pageSize = 8;
    const url = getConversionRequestsEndpointUrl(pageIndex, pageSize);

    conversionService.getConversionRequests(pageIndex, pageSize).subscribe();
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + url.path;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('GET');
    expect(request.request.params.toString()).toEqual(url.params.toString());
    expect(request.request.responseType).toEqual('json');
    expect(request.request.params.get('page').toString()).toEqual(
      pageIndex.toString()
    );
    expect(request.request.params.get('size').toString()).toEqual(
      pageSize.toString()
    );
    request.flush({});
  });

  describe('getCount', () => {
    it('should call GET api method with correct url and params', () => {
      const url = getConversionReqCountEndpointUrl();
      conversionService.getCount().subscribe();

      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + url.path
      );
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.toString()).toEqual(url.params.toString());
      expect(request.request.params.get('page').toString()).toEqual('0');
      expect(request.request.params.get('size').toString()).toEqual('1');
      expect(request.request.url.includes('/conversion/requests')).toBeTruthy();
      request.flush({});
    });
    it('should return data as from api response', () => {
      const result = {
        totalElements: 9
      };
      const url = getConversionReqCountEndpointUrl();
      conversionService.getCount().subscribe(data => {
        expect(data).toEqual(result.totalElements);
      });
      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + url.path
      );
      request.flush(result);
    });
  });

  describe('getRequest', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(ConversionAdaptor, 'requestsFromJson').and.returnValue({});
      const srcDocNo = 111;

      const { path, params } = getConversionRequestsBySrcDocNoUrl(srcDocNo);
      conversionService.getRequest(srcDocNo).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.params.toString()).toEqual(params.toString());
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.get('srcDocNo').toString()).toEqual(
        srcDocNo.toString()
      );
      request.flush({});
    });
    it('should call adaptor method with correct arguments', () => {
      spyOn(ConversionAdaptor, 'requestsFromJson').and.returnValue({});
      const srcDocNo = 111;
      const path = getConversionRequestsBySrcDocNoUrl(srcDocNo).path;
      conversionService.getRequest(srcDocNo).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush(dummyConversionRequestAPIResponse);
      expect(ConversionAdaptor.requestsFromJson).toHaveBeenCalledWith(
        dummyConversionRequestAPIResponse
      );
    });
    it('should return data mapped by conversion get requests helper', () => {
      spyOn(ConversionAdaptor, 'requestsFromJson').and.returnValue(
        dummyConversionRequest
      );
      const srcDocNo = 111;
      const path = getConversionRequestsBySrcDocNoUrl(srcDocNo).path;

      conversionService.getRequest(srcDocNo).subscribe(data => {
        expect(data).toEqual(dummyConversionRequest);
      });
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush({});
    });
  });

  it('getSelectedRequestDetails - should get selected Request details', () => {
    spyOn(ConversionAdaptor, 'getSelectedRequestDetails').and.returnValue(
      conversionRequests
    );
    const id = 121;
    const url = getConversionRequestsByIdEndPointUrl(id);

    conversionService.getSelectedRequestDetails(id).subscribe();
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + url;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('GET');
    expect(request.request.responseType).toEqual('json');
    request.flush({});
  });
  it('getSelectedRequestItems - should get selected Request Items', () => {
    spyOn(ConversionAdaptor, 'SelectedRequestDataFromJson').and.returnValue(
      conversionRequestItems
    );
    const id = 121;
    const url = getConversionRequestDataByIdEnpointUrl(id);

    conversionService.getSelectedRequestItems(id).subscribe();
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + url;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('GET');
    expect(request.request.responseType).toEqual('json');
    request.flush({});
  });
  it('getConversionItems - should get conversion Items', () => {
    spyOn(ConversionAdaptor, 'ItemsFromJson').and.returnValue(conversionItem);
    const url = getConversionItemsEndpointUrl(conversionLoadItemsPayload);

    conversionService
      .getConversionItems(conversionLoadItemsPayload)
      .subscribe();
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + url.path;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('GET');
    expect(request.request.params.toString()).toEqual(url.params.toString());
    expect(request.request.responseType).toEqual('json');
    request.flush({});
  });
  it('sendConversionsRequest - should send conversion requests', () => {
    spyOn(
      ConversionAdaptor,
      'conversionRequestResponseFromJson'
    ).and.returnValue(conversionRequestResponse);
    const url = getConversionRequestEndpointUrl();

    conversionService
      .sendConversionsRequest(conversionSplitReqPayload)
      .subscribe();
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + url.path;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('POST');
    expect(request.request.params.toString()).toEqual(url.params.toString());
    expect(request.request.responseType).toEqual('json');
    request.flush({});
  });
  it('conversionrequestConfirm - should confirm conversion request', () => {
    spyOn(ConversionAdaptor, 'conversionResponseFromJson').and.returnValue(
      conversionResponse
    );
    const url = getConversionSplitItemEndpointUrl();

    conversionService
      .conversionrequestConfirm(conversionSplitItemPayload)
      .subscribe();
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + url;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('POST');
    expect(request.request.responseType).toEqual('json');
    request.flush({});
  });
  it('getRsoDetails - should get RSO Details', () => {
    spyOn(ConversionAdaptor, 'rsoDetailsFromJson').and.returnValue({
      empName: 'name',
      employeeCode: 'code'
    });
    const url = getRsoDetailsEndpointUrl();

    conversionService.getRsoDetails().subscribe();
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + url.path;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('GET');
    expect(request.request.params.toString()).toEqual(url.params.toString());
    expect(request.request.responseType).toEqual('json');
    request.flush({});
  });
  it('getRequestSentHistory - should get Request Sent History', () => {
    const pageIndex = 0;
    const pageSize = 8;
    const requestType = 'CONV';
    spyOn(ConversionAdaptor, 'requestSentHistory').and.returnValue({
      empName: 'name',
      employeeCode: 'code'
    });
    const url = getRequestSentHistoryUrl(pageIndex, pageSize, requestType);

    conversionService
      .getRequestSentHistory(
        requestPayload.requestSentPayload,
        pageIndex,
        pageSize,
        requestType
      )
      .subscribe();
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + url.path;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('POST');
    expect(request.request.params.toString()).toEqual(url.params.toString());
    expect(request.request.responseType).toEqual('json');
    request.flush({});
  });
  it('getConvertedTransactionHistory - should get converted transaction history', () => {
    const pageIndex = 0;
    const pageSize = 8;
    const transactionType = 'CONV';
    spyOn(ConversionAdaptor, 'requestSentHistory').and.returnValue(
      conversionHistorySuccessPayload
    );
    const url = getConvertedTransactionHistoryUrl(
      pageIndex,
      pageSize,
      transactionType
    );

    conversionService
      .getConvertedTransactionHistory(
        convertedTransactionPayload.convertedTransaction,
        pageIndex,
        pageSize,
        transactionType
      )
      .subscribe();
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + url.path;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('POST');
    expect(request.request.params.toString()).toEqual(url.params.toString());
    expect(request.request.responseType).toEqual('json');
    request.flush({});
  });
  it('getSelectedRequestHistory - should get selected request history for requestSent', () => {
    const reqDocNo = 2;
    const requestType = 'requestSent';

    spyOn(ConversionAdaptor, 'selectedRequestSentHistory').and.returnValue(
      conversionHistory
    );

    const url = getSelectedRequestSentHistoryUrl(reqDocNo);

    conversionService
      .getSelectedRequestHistory(reqDocNo, requestType)
      .subscribe();
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + url.path;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('GET');
    expect(request.request.params.toString()).toEqual(url.params.toString());
    expect(request.request.responseType).toEqual('json');
    request.flush({});
  });
  it('getSelectedRequestHistory - should get selected request history for convertedTransactions', () => {
    const reqDocNo = 2;
    const requestType = 'convertedTransactions';

    spyOn(ConversionAdaptor, 'selectedRequestSentHistory').and.returnValue(
      conversionHistory
    );
    const url = getSelectedConvertedTransactionHistoryUrl(reqDocNo);

    conversionService
      .getSelectedRequestHistory(reqDocNo, requestType)
      .subscribe();
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + url.path;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('GET');
    expect(request.request.params.toString()).toEqual(url.params.toString());
    expect(request.request.responseType).toEqual('json');
    request.flush({});
  });
  /* it('getConvesionHistoryItems - should get converted History Items', () => {
    const id = 2;
    const pageIndex = 0;
    const pageSize = 10;
    const requestType = 'requestSent';
    const prevTransaction = 100;
    const childItems = [];
    const studdedproductGroups = [];

    spyOn(ConversionAdaptor, 'conversionRequestHistoryTransactionItems').and.returnValue({
      conversionHistoryItemsSuccessPayload
    });
    const url = getRequestSentHistoryItemsUrl(id, pageIndex, pageSize);

    conversionService
      .getConvesionHistoryItems(
        conversionHistoryPayload.historyItemsPaylod,
        id,
        pageIndex,
        pageSize,
        requestType,
        prevTransaction,
        childItems,
        studdedproductGroups
      )
      .subscribe();
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + url.path;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('POST');
    expect(request.request.params.toString()).toEqual(url.params.toString());
    expect(request.request.responseType).toEqual('json');
    request.flush({});
  }); */
});
