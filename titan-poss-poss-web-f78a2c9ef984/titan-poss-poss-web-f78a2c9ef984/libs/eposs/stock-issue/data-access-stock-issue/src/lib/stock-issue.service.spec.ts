import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import {
  IssueInventoryItem,
  IssueItemUpdate,
  StockRequestNote
} from '@poss-web/shared/models';
import {
  IssueItemAdaptor,
  IssueItemHelper,
  StockIssueAdaptor,
  StockIssueHelper
} from '@poss-web/shared/util-adaptors';
import {
  getCancelIssueItemsByPaginationEndpointUrl,
  getCancelIssueItemsCountEndpointUrl,
  getCancelIssueSTNCountEndpointUrl,
  getCancelIssueSTNEndpointUrl,
  getIssueItemsByPaginationEndpointUrl,
  getIssueItemsCountEndpointUrl,
  getIssueSTNCountEndpointUrl,
  getIssueUpdateAllItemEndpointUrl,
  getIssueUpdateItemEndpointUrl,
  getStockIssueByPaginationEndpointUrl,
  getStockIssueBySrcDocNoEndpointUrl,
  getStockIssueCancelByPaginationEndpointUrl,
  getStockIssueRequestByIDEndpointUrl,
  getStockIssueRequestUrl
} from '@poss-web/shared/util-api-service';
import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import * as moment from 'moment';
import { StockIssueService } from './stock-issue.service';

describe('StockIssueService', () => {
  let httpTestingController: HttpTestingController;
  let stockIssueService: StockIssueService;
  const apiUrl = 'http://localhost:3000';

  const dummyItemResponse: IssueInventoryItem[] = [
    {
      availableQuantity: 5,
      availableValue: 5000,
      availableWeight: 50,
      binCode: 'TestBinCode',
      binGroupCode: 'TestBinGroupCode',
      currencyCode: 'INR',
      id: '111ew22',
      imageURL: 'http://test.com',
      inventoryId: 'F7D-A3D5',
      itemCode: '5097321AAA4A11',
      itemDetails: {},
      lotNumber: '1BA000001',
      measuredQuantity: 2,
      measuredValue: 2000,
      measuredWeight: 20,
      mfgDate: moment(),
      orderType: null,
      productCategory: 'OTHERS',
      productCategoryDesc: 'OTHERS',
      productGroup: '71',
      productGroupDesc: 'Gold Plain',
      status: 'APPROVED',
      stdValue: 100,
      stdWeight: 10,
      weightUnit: 'gms',
      isUpdating: false,
      isUpdatingSuccess: null,
      isValidating: false,
      isValidatingSuccess: null,
      isValidatingError: false,
      isStudded: false,
      isLoadingImage: true,
      isLoadingThumbnailImage: true,
      taxDetails: {},
      thumbnailImageURL: ''
    }
  ];
  const dummyItemsRequestResponse = {
    results: dummyItemResponse,
    pageIndex: 0,
    pageSize: 8,
    totalElements: 10
  };
  const dummyRequestResponse: StockRequestNote[] = [
    {
      carrierDetails: {
        type: 'TEST',
        data: {
          companyName: 'Test',
          docketNumber: 'Test',
          roadPermitNumber: 'Test'
          // employeeId: 'Test',
          // employeeMobileNumber: 'Test',
          // employeeName: 'Test'
        }
      },
      currencyCode: 'INR',
      destDocDate: moment(),
      destDocNo: 111,
      destLocationCode: 'TestLocation',
      destLocationDescription: 'TestLocation Description',
      id: 111,
      orderType: null,
      otherDetails: {},
      reqDocDate: moment(),
      reqDocNo: 111,
      reqLocationCode: 'TestLocation',
      requestType: 'FAC',
      srcDocDate: moment(),
      srcDocNo: 111,
      srcFiscalYear: 2020,
      srcLocationCode: 'TestLocation',
      srcLocationDescription: 'TestLocation Description',
      status: 'APPROVED',
      totalAvailableQuantity: 10,
      totalAvailableValue: 1000,
      totalAvailableWeight: 100,
      totalMeasuredQuantity: 5,
      totalMeasuredValue: 500,
      totalMeasuredWeight: 50,
      weightUnit: 'gms',
      courierReceivedDate: moment(),
      reasonForDelay: null,
      remarks: null,
      transferType: 'BTQ_FAC'
    }
  ];
  const dummyStockRequestResponse = {
    results: dummyRequestResponse,
    pageIndex: 0,
    pageSize: 8,
    totalElements: 1
  };

  const dummyWeightAndValueResponse = {
    currencyCode: 'INR',
    totalMeasuredQuantity: 10,
    totalMeasuredValue: 1000,
    totalMeasuredWeight: 100,
    weightUnit: 'gms'
  };
  const dummySTNCountResponse = {
    pendingIssueBTQ_BTQ_STNCount: 5,
    pendingIssueBTQ_FAC_STNCount: 7,
    pendingIssueBTQ_MER_STNCount: 9
  };
  const dummyIssuesCancelSTNResponse = {
    response: dummyRequestResponse,
    count: 1
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        StockIssueService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    stockIssueService = TestBed.inject(StockIssueService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(stockIssueService).toBeTruthy();
  });
  describe('getIssues', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(StockIssueHelper, 'getIssues').and.returnValue({});
      const requestType = 'FAC';
      const pageIndex = 0;
      const pageSize = 8;
      const { path, params } = getStockIssueByPaginationEndpointUrl(
        requestType,
        pageIndex,
        pageSize
      );
      stockIssueService.getIssues(requestType, pageIndex, pageSize).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.params.toString()).toEqual(params.toString());
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.get('requestType')).toEqual(requestType);
      expect(request.request.params.get('page').toString()).toEqual(
        pageIndex.toString()
      );
      expect(request.request.params.get('size').toString()).toEqual(
        pageSize.toString()
      );
      request.flush({});
    });
    it('should call getIssues helper method with correct arguments', () => {
      spyOn(StockIssueHelper, 'getIssues').and.returnValue({});
      const requestType = 'FAC';
      const pageIndex = 0;
      const pageSize = 8;
      const path = getStockIssueByPaginationEndpointUrl(
        requestType,
        pageIndex,
        pageSize
      ).path;
      stockIssueService.getIssues(requestType, pageIndex, pageSize).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush(dummyStockRequestResponse);
      expect(StockIssueHelper.getIssues).toHaveBeenCalledWith(
        dummyStockRequestResponse
      );
    });

    it('should retun data mapped by stocks helper', () => {
      spyOn(StockIssueHelper, 'getIssues').and.returnValue({
        response: dummyRequestResponse,
        count: 10
      });

      const requestType = 'FAC';
      const pageIndex = 0;
      const pageSize = 8;
      const path = getStockIssueByPaginationEndpointUrl(
        requestType,
        pageIndex,
        pageSize
      ).path;

      stockIssueService
        .getIssues(requestType, pageIndex, pageSize)
        .subscribe(data => {
          expect(data.response).toEqual(dummyRequestResponse);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush({});
    });
  });

  describe('searchIssues', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(StockIssueHelper, 'getIssues').and.returnValue({});
      const requestType = 'FAC';
      const reqDocNo = 11111;
      const { path, params } = getStockIssueBySrcDocNoEndpointUrl(
        reqDocNo,
        requestType
      );
      stockIssueService.searchIssues(reqDocNo, requestType).subscribe();

      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + path
      );
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.toString()).toEqual(params.toString());
      expect(request.request.params.get('requestType')).toEqual(requestType);
      expect(request.request.params.get('reqDocNo').toString()).toEqual(
        reqDocNo.toString()
      );
      request.flush({});
    });
    it('should call stocks helper method with correct arguments', () => {
      spyOn(StockIssueHelper, 'getIssues').and.returnValue({});
      const requestType = 'FAC';
      const reqDocNo = 11111;
      const path = getStockIssueBySrcDocNoEndpointUrl(reqDocNo, requestType)
        .path;

      stockIssueService.searchIssues(reqDocNo, requestType).subscribe();

      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + path
      );
      request.flush(dummyStockRequestResponse);
      expect(StockIssueHelper.getIssues).toHaveBeenCalledWith(
        dummyStockRequestResponse
      );
    });
    it('should retun data mapped by stocks helper', () => {
      spyOn(StockIssueHelper, 'getIssues').and.returnValue({
        response: dummyRequestResponse,
        count: 10
      });
      const requestType = 'FAC';
      const reqDocNo = 111;
      const path = getStockIssueBySrcDocNoEndpointUrl(reqDocNo, requestType)
        .path;

      stockIssueService.searchIssues(reqDocNo, requestType).subscribe(data => {
        expect(data).toEqual(dummyRequestResponse);
      });

      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + path
      );
      request.flush({});
    });
  });
  describe('getIssue', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(
        StockIssueAdaptor,
        'historyStockRequestNoteFromJson'
      ).and.returnValue({});
      const id = 1111;
      const requestType = 'FAC';
      const { path, params } = getStockIssueRequestByIDEndpointUrl(
        id,
        requestType
      );
      stockIssueService.getIssue(id, requestType).subscribe();
      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + path
      );
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.toString()).toEqual(params.toString());
      expect(request.request.params.get('requestType')).toEqual(requestType);
      request.flush({});
    });
    it('should call stock adaptor method with correct arguments', () => {
      spyOn(
        StockIssueAdaptor,
        'historyStockRequestNoteFromJson'
      ).and.returnValue({});
      const id = 1111;
      const requestType = 'FAC';
      const path = getStockIssueRequestByIDEndpointUrl(id, requestType).path;

      stockIssueService.getIssue(id, requestType).subscribe();

      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + path
      );
      request.flush(dummyRequestResponse);
      expect(
        StockIssueAdaptor.historyStockRequestNoteFromJson
      ).toHaveBeenCalledWith(dummyRequestResponse);
    });

    it('should retun data mapped by stock adaptor', () => {
      const result = dummyRequestResponse[0];

      spyOn(
        StockIssueAdaptor,
        'historyStockRequestNoteFromJson'
      ).and.returnValue(result);
      const id = 1111;
      const requestType = 'FAC';
      const path = getStockIssueRequestByIDEndpointUrl(id, requestType).path;

      stockIssueService.getIssue(id, requestType).subscribe(data => {
        expect(data).toEqual(result);
      });

      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + path
      );
      request.flush({});
    });
  });
  describe('getIssueItemsCount', () => {
    it('should call GET api method with correct url and params', () => {
      const storeType = 'L1';
      const type = 'FAC';
      const id = 11;
      const pageIndex = 0;
      const pageSize = 1;
      const url1 = getIssueItemsCountEndpointUrl(
        storeType,
        id,
        pageIndex,
        pageSize,
        type,
        'APPROVED'
      );
      const url2 = getIssueItemsCountEndpointUrl(
        storeType,
        id,
        pageIndex,
        pageSize,
        type,
        'SELECTED'
      );
      stockIssueService.getIssueItemsCount(storeType, id, type).subscribe();

      const request1 = httpTestingController.expectOne(
        req => req.url === apiUrl + url1.path
      );
      expect(request1.cancelled).toBeFalsy();
      expect(request1.request.method).toEqual('GET');
      expect(request1.request.responseType).toEqual('json');
      expect(request1.request.params.toString()).toEqual(
        url1.params.toString()
      );
      expect(request1.request.params.get('page').toString()).toEqual(
        pageIndex.toString()
      );
      expect(request1.request.params.get('size').toString()).toEqual(
        pageSize.toString()
      );
      expect(
        request1.request.url.includes(getStockIssueRequestUrl())
      ).toBeTruthy();
      expect(request1.request.params.get('status')).toEqual('APPROVED');
      request1.flush({});

      const request2 = httpTestingController.expectOne(
        req => req.url === apiUrl + url2.path
      );
      expect(request2.cancelled).toBeFalsy();
      expect(request2.request.method).toEqual('GET');
      expect(request2.request.responseType).toEqual('json');
      expect(request2.request.params.toString()).toEqual(
        url2.params.toString()
      );
      expect(request2.request.params.get('page').toString()).toEqual(
        pageIndex.toString()
      );
      expect(request2.request.params.get('size').toString()).toEqual(
        pageSize.toString()
      );
      expect(
        request2.request.url.includes(getStockIssueRequestUrl())
      ).toBeTruthy();
      expect(request2.request.params.get('status')).toEqual('SELECTED');
      request2.flush({});
    });

    it('should retun data mapped by stock adaptor', () => {
      const result1 = {
        totalElements: 19
      };
      const result2 = {
        totalElements: 11
      };
      const storeType = 'L1';
      const type = 'FAC';
      const id = 11;
      const pageIndex = 0;
      const pageSize = 1;
      const url1 = getIssueItemsCountEndpointUrl(
        storeType,
        id,
        pageIndex,
        pageSize,
        type,
        'APPROVED'
      );
      const url2 = getIssueItemsCountEndpointUrl(
        storeType,
        id,
        pageIndex,
        pageSize,
        type,
        'SELECTED'
      );

      stockIssueService
        .getIssueItemsCount(storeType, id, type)
        .subscribe(data => {
          expect(data.approvedItemsTotalCount).toEqual(result1.totalElements);
          expect(data.selectedItemsTotalCount).toEqual(result2.totalElements);
        });

      const request1 = httpTestingController.expectOne(
        req => req.url === apiUrl + url1.path
      );

      request1.flush(result1);

      const request2 = httpTestingController.expectOne(
        req => req.url === apiUrl + url2.path
      );

      request2.flush(result2);
    });
  });
  describe('getItems ', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(IssueItemHelper, 'getItems').and.returnValue({});

      const storeType = 'L1';
      const id = 111;
      const itemCode = '2SXD22';
      const lotNumber = '2WER2';
      const pageIndex = 0;
      const pageSize = 10;
      const requestType = 'FAC';
      const status = 'SELECTED';
      const isStudded = [];
      const sort: Map<string, string> = null;
      const filter: { key: string; value: any[] }[] = [
        { key: 'test', value: ['test1', 'test2'] }
      ];
      const { path, params } = getIssueItemsByPaginationEndpointUrl(
        id,
        itemCode,
        lotNumber,
        requestType,
        storeType,
        status,
        pageIndex,
        pageSize,
        sort,
        filter
      );
      stockIssueService
        .getItems(
          id,
          itemCode,
          lotNumber,
          requestType,
          storeType,
          status,
          pageIndex,
          pageSize,
          isStudded,
          sort,
          filter
        )
        .subscribe();

      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + path
      );
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.toString()).toEqual(params.toString());
      expect(request.request.params.get('requestType')).toEqual(requestType);
      expect(request.request.params.get('itemCode')).toEqual(itemCode);
      expect(request.request.params.get('lotNumber')).toEqual(lotNumber);
      expect(request.request.params.get('status')).toEqual(status);
      // expect(request.request.params.get('sort')).toEqual(
      //   `${sortBy},${sortOrder}`
      // );
      expect(request.request.params.get('page').toString()).toEqual(
        pageIndex.toString()
      );
      expect(request.request.params.get('size').toString()).toEqual(
        pageSize.toString()
      );
      expect(
        request.request.url.includes(getStockIssueRequestUrl())
      ).toBeTruthy();
      request.flush({});
    });
    it('should call item helper method with correct arguments', () => {
      spyOn(IssueItemHelper, 'getItems').and.returnValue({});

      const storeType = 'L1';
      const id = 111;
      const itemCode = '2SXD22';
      const lotNumber = '2WER2';
      const pageIndex = 0;
      const pageSize = 10;
      const requestType = 'FAC';
      const status = 'SELECTED';
      const isStudded = [];
      const sort: Map<string, string> = null;
      const filter: { key: string; value: any[] }[] = [
        { key: 'test', value: ['test1', 'test2'] }
      ];
      const path = getIssueItemsByPaginationEndpointUrl(
        id,
        itemCode,
        lotNumber,
        requestType,
        storeType,
        status,
        pageIndex,
        pageSize,
        sort,
        filter
      ).path;
      stockIssueService
        .getItems(
          id,
          itemCode,
          lotNumber,
          requestType,
          storeType,
          status,
          pageIndex,
          pageSize,
          isStudded,
          sort,
          filter
        )
        .subscribe();

      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + path
      );
      request.flush(dummyItemsRequestResponse);
      expect(IssueItemHelper.getItems).toHaveBeenCalledWith(
        dummyItemsRequestResponse,
        []
      );
    });
    it('should return items and count from item helper', () => {
      const itemResult = dummyItemResponse;
      const itemCount = 10;
      const result = { items: itemResult, count: itemCount };
      spyOn(IssueItemHelper, 'getItems').and.returnValue(result);
      const storeType = 'L1';
      const id = 111;
      const itemCode = '2SXD22';
      const lotNumber = '2WER2';
      const pageIndex = 0;
      const pageSize = 10;
      const requestType = 'FAC';
      const status = 'SELECTED';
      const isStudded = [];
      const sort: Map<string, string> = null;
      const filter: { key: string; value: any[] }[] = [
        { key: 'test', value: ['test1', 'test2'] }
      ];
      const path = getIssueItemsByPaginationEndpointUrl(
        id,
        itemCode,
        lotNumber,
        requestType,
        storeType,
        status,
        pageIndex,
        pageSize,
        sort,
        filter
      ).path;
      stockIssueService
        .getItems(
          id,
          itemCode,
          lotNumber,
          requestType,
          storeType,
          status,
          pageIndex,
          pageSize,
          isStudded,
          sort,
          filter
        )
        .subscribe(data => {
          expect(data.items).toEqual(itemResult);
          expect(data.count).toEqual(itemCount);
        });
      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + path
      );

      request.flush({});
    });
  });
  describe('updateItem', () => {
    it('should call PATCH api method with correct url and params', () => {
      spyOn(IssueItemHelper, 'getItems').and.returnValue({});
      const storeType = 'L1';
      const requestType = 'FAC';
      const id = 111;
      const itemId = 1111;
      const itemUpdate: IssueItemUpdate = {
        measuredQuantity: 10,
        status: 'SELECTED',
        inventoryId: '111EW23344',
        measuredWeight: 100
      };
      const { path, params } = getIssueUpdateItemEndpointUrl(
        requestType,
        storeType,
        id,
        itemId
      );

      stockIssueService
        .updateItem(requestType, storeType, id, itemId, itemUpdate)
        .subscribe();
      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + path
      );
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.params.toString()).toEqual(params.toString());
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.get('requestType')).toEqual(requestType);
      expect(
        request.request.url.includes(getStockIssueRequestUrl())
      ).toBeTruthy();
      expect(request.request.body as Object).toEqual(
        JSON.stringify({
          inventoryId: itemUpdate.inventoryId,
          measuredQuantity: itemUpdate.measuredQuantity,
          measuredWeight: itemUpdate.measuredWeight
        })
      );
      request.flush({});
    });
    it('should call stocks helper method with correct arguments', () => {
      spyOn(IssueItemAdaptor, 'fromJson').and.returnValue({});
      const result = dummyItemResponse[0];
      const storeType = 'L1';
      const requestType = 'FAC';
      const id = 111;
      const itemId = 1111;
      const itemUpdate: IssueItemUpdate = {
        measuredQuantity: 10,
        status: 'SELECTED',
        inventoryId: '111EW23344',
        measuredWeight: 100
      };
      const path = getIssueUpdateItemEndpointUrl(
        requestType,
        storeType,
        id,
        itemId
      ).path;

      stockIssueService
        .updateItem(requestType, storeType, id, itemId, itemUpdate)
        .subscribe();

      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + path
      );

      request.flush(result);
      expect(IssueItemAdaptor.fromJson).toHaveBeenCalledWith(result, []);
    });

    it('should retun data mapped by stocks helper', () => {
      const result = dummyItemResponse[0];
      spyOn(IssueItemAdaptor, 'fromJson').and.returnValue(result);

      const storeType = 'L1';
      const requestType = 'FAC';
      const id = 111;
      const itemId = 1111;
      const itemUpdate: IssueItemUpdate = {
        measuredQuantity: 10,
        status: 'SELECTED',
        inventoryId: '111EW23344',
        measuredWeight: 100
      };

      const path = getIssueUpdateItemEndpointUrl(
        requestType,
        storeType,
        id,
        itemId
      ).path;

      stockIssueService
        .updateItem(requestType, storeType, id, itemId, itemUpdate)
        .subscribe(data => {
          expect(data).toEqual(result);
        });
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush({});
    });
  });
  // describe('validateItem', () => {
  //   it('should call GET api method with correct url and params', () => {
  //     const productGroupCode = 'Test';
  //     const availableWeight = 10;
  //     const measuredWeight = 10;
  //     const measuredQuantity = 10;
  //     const availableQuantity = 10;
  //     const configType = 'WEIGHT_TOLERANCE';

  //     const { path, params } = getValidateItemEndpointUrl(
  //       productGroupCode,
  //       availableWeight,
  //       measuredWeight,
  //       measuredQuantity,
  //       availableQuantity,
  //       configType
  //     );
  //     stockIssueService
  //       .validateItem(
  //         productGroupCode,
  //         availableWeight,
  //         measuredWeight,
  //         measuredQuantity,
  //         availableQuantity
  //       )
  //       .subscribe();
  //     const request = httpTestingController.expectOne(
  //       req => req.url === apiUrl + path
  //     );
  //     expect(request.cancelled).toBeFalsy();
  //     expect(request.request.method).toEqual('GET');
  //     expect(request.request.params.toString()).toEqual(params.toString());
  //     expect(request.request.responseType).toEqual('json');
  //     expect(request.request.params.get('productGroupCode')).toEqual(
  //       productGroupCode
  //     );
  //     expect(request.request.params.get('availableWeight').toString()).toEqual(
  //       availableWeight.toString()
  //     );
  //     expect(request.request.params.get('measuredWeight').toString()).toEqual(
  //       measuredWeight.toString()
  //     );
  //     expect(request.request.params.get('measuredQuantity').toString()).toEqual(
  //       measuredQuantity.toString()
  //     );
  //     expect(
  //       request.request.params.get('availableQuantity').toString()
  //     ).toEqual(availableQuantity.toString());
  //     expect(request.request.params.get('configType')).toEqual(configType);

  //     request.flush({});
  //   });
  //   it('should retun data sent by the api', () => {
  //     const result = { isValid: true };

  //     const productGroupCode = 'Test';
  //     const availableWeight = 10;
  //     const measuredWeight = 10;
  //     const measuredQuantity = 10;
  //     const availableQuantity = 10;
  //     const configType = 'WEIGHT_TOLERANCE';

  //     const path = getValidateItemEndpointUrl(
  //       productGroupCode,
  //       availableWeight,
  //       measuredWeight,
  //       measuredQuantity,
  //       availableQuantity,
  //       configType
  //     ).path;

  //     stockIssueService
  //       .validateItem(
  //         productGroupCode,
  //         availableWeight,
  //         measuredWeight,
  //         measuredQuantity,
  //         availableQuantity
  //       )
  //       .subscribe(data => {
  //         expect(data).toEqual(result);
  //       });

  //     const request = httpTestingController.expectOne(req => {
  //       return req.url === apiUrl + path;
  //     });
  //     request.flush(result);
  //   });
  // });
  describe('updateAllItems', () => {
    it('should call PATCH api method with correct url and params', () => {
      const requestType = 'FAC';
      const storeType = 'L1';
      const id = 111;
      const itemIds = ['11', '22'];
      const status = 'SELECTED';
      const { path, params } = getIssueUpdateAllItemEndpointUrl(
        requestType,
        storeType,
        id
      );
      stockIssueService
        .updateAllItem(requestType, storeType, id, itemIds, status)
        .subscribe();
      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + path
      );
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.params.toString()).toEqual(params.toString());
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.get('requestType')).toEqual(requestType);
      expect(
        request.request.url.includes(getStockIssueRequestUrl())
      ).toBeTruthy();
      expect(request.request.body as Object).toEqual(
        JSON.stringify({ itemIds: itemIds, status: status })
      );
      request.flush({});
    });
    it('should return the data sent by api', () => {
      const result = { isValid: true };
      const requestType = 'FAC';
      const storeType = 'L1';
      const id = 111;
      const itemIds = ['11', '22'];
      const status = 'SELECTED';
      const path = getIssueUpdateAllItemEndpointUrl(requestType, storeType, id)
        .path;
      stockIssueService
        .updateAllItem(requestType, storeType, id, itemIds, status)
        .subscribe(data => {
          expect(data).toEqual(result);
        });
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush(result);
    });
  });

  describe('confirmIssue', () => {
    it('should call POST api method with correct url and params', () => {
      spyOn(
        StockIssueAdaptor,
        'historyStockRequestNoteFromJson'
      ).and.returnValue({});
      const id = 111;
      const data = {
        carrierDetails: {
          type: 'courier',
          data: {
            companyName: 'Bluedart',
            docketNumber: '12',
            lockNumber: '21',
            roadPermitNumber: '21',
            numberOfBoxes: '2',
            boxDetails: [
              {
                serialNumber: '11111',
                boxNumber: '22222',
                lockNumber: '33333',
                boxWeight: '140.50',
                weightUnit: 'gms'
              },
              {
                serialNumber: '11111',
                boxNumber: '22222',
                lockNumber: '33333',
                boxWeight: '140.50',
                weightUnit: 'gms'
              }
            ]
          }
        }
      };
      const requestType = 'FAC';
      const path = getStockIssueRequestByIDEndpointUrl(id, requestType).path;
      stockIssueService.confirmIssue(id, data, requestType).subscribe();

      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + path
      );
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.get('requestType')).toEqual(requestType);
      expect(
        request.request.url.includes(getStockIssueRequestUrl())
      ).toBeTruthy();
      expect(request.request.body as Object).toEqual(JSON.stringify(data));
      request.flush({});
    });
    it('should call adaptor method with correct arguments', () => {
      spyOn(
        StockIssueAdaptor,
        'historyStockRequestNoteFromJson'
      ).and.returnValue({});
      const id = 111;
      const data = {
        carrierDetails: {
          type: 'courier',
          data: {
            companyName: 'Bluedart',
            docketNumber: '12',
            lockNumber: '21',
            roadPermitNumber: '21',
            numberOfBoxes: '2',
            boxDetails: [
              {
                serialNumber: '11111',
                boxNumber: '22222',
                lockNumber: '33333',
                boxWeight: '140.50',
                weightUnit: 'gms'
              },
              {
                serialNumber: '11111',
                boxNumber: '22222',
                lockNumber: '33333',
                boxWeight: '140.50',
                weightUnit: 'gms'
              }
            ]
          }
        }
      };
      const requestType = 'FAC';
      const path = getStockIssueRequestByIDEndpointUrl(id, requestType).path;
      stockIssueService.confirmIssue(id, data, requestType).subscribe();

      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + path
      );
      request.flush(dummyRequestResponse);
      expect(
        StockIssueAdaptor.historyStockRequestNoteFromJson
      ).toHaveBeenCalledWith(dummyRequestResponse);
    });
    it('should return data mapped by stock adaptor', () => {
      const result = dummyRequestResponse[0];
      spyOn(
        StockIssueAdaptor,
        'historyStockRequestNoteFromJson'
      ).and.returnValue(result);
      const id = 111;
      const data = {
        carrierDetails: {
          type: 'courier',
          data: {
            companyName: 'Bluedart',
            docketNumber: '12',
            lockNumber: '21',
            roadPermitNumber: '21',
            numberOfBoxes: '2',
            boxDetails: [
              {
                serialNumber: '11111',
                boxNumber: '22222',
                lockNumber: '33333',
                boxWeight: '140.50',
                weightUnit: 'gms'
              },
              {
                serialNumber: '11111',
                boxNumber: '22222',
                lockNumber: '33333',
                boxWeight: '140.50',
                weightUnit: 'gms'
              }
            ]
          }
        }
      };
      const requestType = 'FAC';
      const path = getStockIssueRequestByIDEndpointUrl(id, requestType).path;
      stockIssueService.confirmIssue(id, data, requestType).subscribe(value => {
        expect(value).toEqual(result);
      });

      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + path
      );
      request.flush({});
    });
  });

  // describe('getHistory', () => {
  //   it('should call POST api method with correct url and params', () => {
  //     spyOn(StockIssueHelper, 'getIssues').and.returnValue({});
  //     const page = 0;
  //     const size = 8;
  //     const sort = [];
  //     const payload = {
  //       actionType: 'ISSUE',
  //       date: 'CUSTOM',
  //       destDocNo: null,
  //       destFiscalYear: null,
  //       endDate: '1587461631',
  //       locationCode: null,
  //       srcDocNo: null,
  //       srcFiscalYear: null,
  //       startDate: '1587460408',
  //       statuses: [],
  //       transferType: 'BTQ_FAC'
  //     };
  //     const { path, params } = getStockIssueHistoryByPaginationEndpointUrl(
  //       page,
  //       size,
  //       sort
  //     );
  //     stockIssueService.getHistory(page, size, sort, payload).subscribe();

  //     const request = httpTestingController.expectOne(req => {
  //       return req.url === apiUrl + path;
  //     });
  //     expect(request.cancelled).toBeFalsy();
  //     expect(request.request.method).toEqual('POST');
  //     expect(request.request.params.toString()).toEqual(params.toString());
  //     expect(request.request.responseType).toEqual('json');
  //     expect(request.request.params.get('page').toString()).toEqual(
  //       page.toString()
  //     );
  //     expect(request.request.params.get('size').toString()).toEqual(
  //       size.toString()
  //     );
  //     request.flush({});
  //   });
  //   it('should call getIssues helper method with correct arguments', () => {
  //     spyOn(StockIssueHelper, 'getIssues').and.returnValue({});
  //     const page = 0;
  //     const size = 8;
  //     const sort = [];
  //     const payload = {
  //       actionType: 'ISSUE',
  //       date: 'CUSTOM',
  //       destDocNo: null,
  //       destFiscalYear: null,
  //       endDate: '1587461631',
  //       locationCode: null,
  //       srcDocNo: null,
  //       srcFiscalYear: null,
  //       startDate: '1587460408',
  //       statuses: [],
  //       transferType: 'BTQ_FAC'
  //     };
  //     const { path } = getStockIssueHistoryByPaginationEndpointUrl(
  //       page,
  //       size,
  //       sort
  //     );
  //     stockIssueService.getHistory(page, size, sort, payload).subscribe();

  //     const request = httpTestingController.expectOne(req => {
  //       return req.url === apiUrl + path;
  //     });
  //     request.flush(dummyStockRequestResponse);
  //     expect(StockIssueHelper.getIssues).toHaveBeenCalledWith(
  //       dummyStockRequestResponse
  //     );
  //   });

  //   it('should retun data mapped by stocks helper', () => {
  //     spyOn(StockIssueHelper, 'getIssues').and.returnValue({
  //       response: dummyRequestResponse,
  //       count: 10
  //     });

  //     const page = 0;
  //     const size = 8;
  //     const sort = [];
  //     const payload = {
  //       actionType: 'ISSUE',
  //       date: 'CUSTOM',
  //       destDocNo: null,
  //       destFiscalYear: null,
  //       endDate: '1587461631',
  //       locationCode: null,
  //       srcDocNo: null,
  //       srcFiscalYear: null,
  //       startDate: '1587460408',
  //       statuses: [],
  //       transferType: 'BTQ_FAC'
  //     };
  //     const path = getStockIssueHistoryByPaginationEndpointUrl(page, size, sort)
  //       .path;
  //     stockIssueService
  //       .getHistory(page, size, sort, payload)
  //       .subscribe(data => {
  //         expect(data.response).toEqual(dummyRequestResponse);
  //       });

  //     const request = httpTestingController.expectOne(req => {
  //       return req.url === apiUrl + path;
  //     });
  //     request.flush({});
  //   });
  // });
  // describe('getSelectedHistory', () => {
  //   it('for stock issue L1/L2 stores should call GET api method with correct url and params', () => {
  //     spyOn(
  //       StockIssueAdaptor,
  //       'historyStockRequestNoteFromJson'
  //     ).and.returnValue({});
  //     const actionType = 'ISSUE';
  //     const id = 1111;
  //     const isL1L2Store = true;
  //     const isL3Store = false;
  //     const { path, params } = getStockIssueSelectedHistoryUrl(actionType, id);

  //     stockIssueService
  //       .getSelectedHistory(actionType, id, isL1L2Store, isL3Store)
  //       .subscribe();
  //     const request = httpTestingController.expectOne(
  //       req => req.url === apiUrl + path
  //     );
  //     expect(request.cancelled).toBeFalsy();
  //     expect(request.request.method).toEqual('GET');
  //     expect(request.request.responseType).toEqual('json');
  //     expect(request.request.params.toString()).toEqual(params.toString());
  //     request.flush({});
  //   });
  //   it('for stock issue L3 should call GET api method with correct url and params', () => {
  //     spyOn(
  //       StockIssueAdaptor,
  //       'historyStockRequestNoteFromJson'
  //     ).and.returnValue({});
  //     const actionType = 'ISSUE';
  //     const id = 1111;
  //     const isL1L2Store = false;
  //     const isL3Store = true;
  //     const { path, params } = getStockIssueInvoiceSelectedHistoryUrl(id);

  //     stockIssueService
  //       .getSelectedHistory(actionType, id, isL1L2Store, isL3Store)
  //       .subscribe();
  //     const request = httpTestingController.expectOne(
  //       req => req.url === apiUrl + path
  //     );
  //     expect(request.cancelled).toBeFalsy();
  //     expect(request.request.method).toEqual('GET');
  //     expect(request.request.responseType).toEqual('json');
  //     expect(request.request.params.toString()).toEqual(params.toString());
  //     request.flush({});
  //   });
  //   it('should call stock adaptor method with correct arguments', () => {
  //     spyOn(
  //       StockIssueAdaptor,
  //       'historyStockRequestNoteFromJson'
  //     ).and.returnValue({});
  //     const actionType = 'ISSUE';
  //     const id = 1111;
  //     const isL1L2Store = true;
  //     const isL3Store = false;
  //     const { path } = getStockIssueSelectedHistoryUrl(actionType, id);

  //     stockIssueService
  //       .getSelectedHistory(actionType, id, isL1L2Store, isL3Store)
  //       .subscribe();
  //     const request = httpTestingController.expectOne(
  //       req => req.url === apiUrl + path
  //     );
  //     request.flush(dummyRequestResponse);
  //     expect(
  //       StockIssueAdaptor.historyStockRequestNoteFromJson
  //     ).toHaveBeenCalledWith(dummyRequestResponse);
  //   });
  //   it('should retun data mapped by stock adaptor', () => {
  //     const result = dummyRequestResponse[0];

  //     spyOn(
  //       StockIssueAdaptor,
  //       'historyStockRequestNoteFromJson'
  //     ).and.returnValue(result);
  //     const actionType = 'ISSUE';
  //     const id = 1111;
  //     const isL1L2Store = true;
  //     const isL3Store = false;
  //     const path = getStockIssueSelectedHistoryUrl(actionType, id).path;

  //     stockIssueService
  //       .getSelectedHistory(actionType, id, isL1L2Store, isL3Store)
  //       .subscribe(data => {
  //         expect(data).toEqual(result);
  //       });

  //     const request = httpTestingController.expectOne(
  //       req => req.url === apiUrl + path
  //     );
  //     request.flush({});
  //   });
  // });
  // describe('getHistoryItems ', () => {
  //   it('for stock issue L1/L2 stores should call POST api method with correct url and params', () => {
  //     spyOn(IssueItemHelper, 'getItems').and.returnValue({});
  //     const actionType = 'ISSUE';
  //     const id = 111;
  //     const page = 0;
  //     const size = 10;
  //     const sort = [];
  //     const payload = {
  //       binCodes: [null],
  //       binGroupCode: null,
  //       itemCode: null,
  //       lotNumber: null,
  //       productCategories: [],
  //       productGroups: [],
  //       statuses: []
  //     };
  //     const isL1L2Store = true;
  //     const isL3Store = false;

  //     const { path, params } = getIssueHistoryItemsByPaginationEndpointUrl(
  //       actionType,
  //       id,
  //       page,
  //       size,
  //       sort
  //     );
  //     stockIssueService
  //       .getHistoryItems(
  //         actionType,
  //         id,
  //         page,
  //         size,
  //         sort,
  //         payload,
  //         isL1L2Store,
  //         isL3Store
  //       )
  //       .subscribe();

  //     const request = httpTestingController.expectOne(
  //       req => req.url === apiUrl + path
  //     );
  //     expect(request.cancelled).toBeFalsy();
  //     expect(request.request.method).toEqual('POST');
  //     expect(request.request.responseType).toEqual('json');
  //     expect(request.request.params.toString()).toEqual(params.toString());
  //     expect(request.request.params.get('page').toString()).toEqual(
  //       page.toString()
  //     );
  //     expect(request.request.params.get('size').toString()).toEqual(
  //       size.toString()
  //     );
  //     // expect(request.request.params.get('sort')).toEqual(sort);
  //     // expect(request.request.params.get('sort')).toEqual(
  //     //   `${sortBy},${sortOrder}`
  //     // );
  //     expect(request.request.url.includes('/history')).toBeTruthy();
  //     request.flush({});
  //   });
  //   it('for stock issue L3 stores should call POST api method with correct url and params', () => {
  //     spyOn(IssueItemHelper, 'getItems').and.returnValue({});
  //     const actionType = 'ISSUE';
  //     const id = 111;
  //     const page = 0;
  //     const size = 10;
  //     const sort = [];
  //     const payload = {
  //       binCodes: [null],
  //       binGroupCode: null,
  //       itemCode: null,
  //       lotNumber: null,
  //       productCategories: [],
  //       productGroups: [],
  //       statuses: []
  //     };
  //     const isL1L2Store = false;
  //     const isL3Store = true;

  //     const {
  //       path,
  //       params
  //     } = getIssueInvoiceHistoryItemsByPaginationEndpointUrl(
  //       id,
  //       page,
  //       size,
  //       sort
  //     );
  //     stockIssueService
  //       .getHistoryItems(
  //         actionType,
  //         id,
  //         page,
  //         size,
  //         sort,
  //         payload,
  //         isL1L2Store,
  //         isL3Store
  //       )
  //       .subscribe();

  //     const request = httpTestingController.expectOne(
  //       req => req.url === apiUrl + path
  //     );
  //     expect(request.cancelled).toBeFalsy();
  //     expect(request.request.method).toEqual('POST');
  //     expect(request.request.responseType).toEqual('json');
  //     expect(request.request.params.toString()).toEqual(params.toString());
  //     expect(request.request.params.get('page').toString()).toEqual(
  //       page.toString()
  //     );
  //     expect(request.request.params.get('size').toString()).toEqual(
  //       size.toString()
  //     );
  //     // expect(request.request.params.get('sort')).toEqual(sort);
  //     // expect(request.request.params.get('sort')).toEqual(
  //     //   `${sortBy},${sortOrder}`
  //     // );
  //     expect(request.request.url.includes('/history')).toBeTruthy();
  //     request.flush({});
  //   });
  //   it('should call item helper method with correct arguments', () => {
  //     spyOn(IssueItemHelper, 'getItems').and.returnValue({});
  //     const actionType = 'ISSUE';
  //     const id = 111;
  //     const page = 0;
  //     const size = 10;
  //     const sort = [];
  //     const payload = {
  //       binCodes: [null],
  //       binGroupCode: null,
  //       itemCode: null,
  //       lotNumber: null,
  //       productCategories: [],
  //       productGroups: [],
  //       statuses: []
  //     };
  //     const isL1L2Store = true;
  //     const isL3Store = false;
  //     const { path } = getIssueHistoryItemsByPaginationEndpointUrl(
  //       actionType,
  //       id,
  //       page,
  //       size,
  //       sort
  //     );
  //     stockIssueService
  //       .getHistoryItems(
  //         actionType,
  //         id,
  //         page,
  //         size,
  //         sort,
  //         payload,
  //         isL1L2Store,
  //         isL3Store
  //       )
  //       .subscribe();

  //     const request = httpTestingController.expectOne(
  //       req => req.url === apiUrl + path
  //     );

  //     request.flush(dummyItemsRequestResponse);
  //     expect(IssueItemHelper.getItems).toHaveBeenCalledWith(
  //       dummyItemsRequestResponse,
  //       []
  //     );
  //   });
  //   it('should return items and count from item helper', () => {
  //     const actionType = 'ISSUE';
  //     const itemResult = dummyItemResponse;
  //     const itemCount = 10;
  //     const result = { items: itemResult, count: itemCount };
  //     spyOn(IssueItemHelper, 'getItems').and.returnValue(result);
  //     const id = 111;
  //     const page = 0;
  //     const size = 10;
  //     const sort = [];
  //     const payload = {
  //       binCodes: [null],
  //       binGroupCode: null,
  //       itemCode: null,
  //       lotNumber: null,
  //       productCategories: [],
  //       productGroups: [],
  //       statuses: []
  //     };
  //     const isL1L2Store = true;
  //     const isL3Store = false;
  //     const path = getIssueHistoryItemsByPaginationEndpointUrl(
  //       actionType,
  //       id,
  //       page,
  //       size,
  //       sort
  //     ).path;

  //     stockIssueService
  //       .getHistoryItems(
  //         actionType,
  //         id,
  //         page,
  //         size,
  //         sort,
  //         payload,
  //         isL1L2Store,
  //         isL3Store
  //       )
  //       .subscribe(data => {
  //         expect(data.items).toEqual(itemResult);
  //         expect(data.count).toEqual(itemCount);
  //       });
  //     const request = httpTestingController.expectOne(
  //       req => req.url === apiUrl + path
  //     );

  //     request.flush({});
  //   });
  // });
  // describe('getHistoryItemsCount', () => {
  //   it('should call GET api method with correct url and params', () => {
  //     const actionType = 'ISSUE';
  //     const id = 11;
  //     const page = 0;
  //     const size = 1;
  //     const sort = [];
  //     const payload = {
  //       binCodes: [null],
  //       binGroupCode: null,
  //       itemCode: null,
  //       lotNumber: null,
  //       productCategories: [],
  //       productGroups: [],
  //       statuses: []
  //     };
  //     const isL1L2Store = true;
  //     const isL3Store = false;
  //     const url = getIssueHistoryItemsByPaginationEndpointUrl(
  //       actionType,
  //       id,
  //       page,
  //       size,
  //       sort
  //     );

  //     stockIssueService
  //       .getHistoryItemsCount(
  //         actionType,
  //         id,
  //         page,
  //         size,
  //         sort,
  //         payload,
  //         isL1L2Store,
  //         isL3Store
  //       )
  //       .subscribe();

  //     const request = httpTestingController.expectOne(
  //       req => req.url === apiUrl + url.path
  //     );
  //     expect(request.cancelled).toBeFalsy();
  //     expect(request.request.method).toEqual('POST');
  //     expect(request.request.responseType).toEqual('json');
  //     expect(request.request.params.toString()).toEqual(url.params.toString());
  //     expect(request.request.params.get('page').toString()).toEqual(
  //       page.toString()
  //     );
  //     expect(request.request.params.get('size').toString()).toEqual(
  //       size.toString()
  //     );
  //     expect(request.request.url.includes('/history')).toBeTruthy();

  //     request.flush({});
  //   });

  //   it('should retun data mapped by stock adaptor', () => {
  //     const result = {
  //       totalElements: 19
  //     };
  //     const actionType = 'ISSUE';
  //     const id = 11;
  //     const page = 0;
  //     const size = 1;
  //     const sort = [];
  //     const payload = {
  //       binCodes: [null],
  //       binGroupCode: null,
  //       itemCode: null,
  //       lotNumber: null,
  //       productCategories: [],
  //       productGroups: [],
  //       statuses: []
  //     };
  //     const isL1L2Store = true;
  //     const isL3Store = false;
  //     const url = getIssueHistoryItemsByPaginationEndpointUrl(
  //       actionType,
  //       id,
  //       page,
  //       size,
  //       sort
  //     );

  //     stockIssueService
  //       .getHistoryItemsCount(
  //         actionType,
  //         id,
  //         page,
  //         size,
  //         sort,
  //         payload,
  //         isL1L2Store,
  //         isL3Store
  //       )
  //       .subscribe(data => {
  //         expect(data).toEqual(result.totalElements);
  //       });

  //     const request1 = httpTestingController.expectOne(
  //       req => req.url === apiUrl + url.path
  //     );

  //     request1.flush(result);
  //   });
  // });

  describe('getWeightAndValue', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(
        StockIssueAdaptor,
        'measuredWeightAndValueFromJson'
      ).and.returnValue({});
      const id = 1111;
      const requestType = 'FAC';
      const { path, params } = getStockIssueRequestByIDEndpointUrl(
        id,
        requestType
      );
      stockIssueService.getWeightAndValue(id, requestType).subscribe();
      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + path
      );
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.toString()).toEqual(params.toString());
      expect(request.request.params.get('requestType')).toEqual(requestType);
      request.flush({});
    });
    it('should call stock adaptor method with correct arguments', () => {
      spyOn(
        StockIssueAdaptor,
        'measuredWeightAndValueFromJson'
      ).and.returnValue({});
      const id = 1111;
      const requestType = 'FAC';
      const path = getStockIssueRequestByIDEndpointUrl(id, requestType).path;

      stockIssueService.getWeightAndValue(id, requestType).subscribe();

      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + path
      );
      request.flush(dummyWeightAndValueResponse);
      expect(
        StockIssueAdaptor.measuredWeightAndValueFromJson
      ).toHaveBeenCalledWith(dummyWeightAndValueResponse);
    });

    it('should retun data mapped by stock adaptor', () => {
      const result = dummyWeightAndValueResponse;

      spyOn(
        StockIssueAdaptor,
        'measuredWeightAndValueFromJson'
      ).and.returnValue(result);
      const id = 1111;
      const requestType = 'FAC';
      const path = getStockIssueRequestByIDEndpointUrl(id, requestType).path;

      stockIssueService.getWeightAndValue(id, requestType).subscribe(data => {
        expect(data).toEqual(result);
      });

      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + path
      );
      request.flush({});
    });
  });
  describe('getCount', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(StockIssueAdaptor, 'IssueSTNCountFromJson').and.returnValue({});

      const { path } = getIssueSTNCountEndpointUrl();

      stockIssueService.getCount().subscribe();
      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + path
      );
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });
    it('should call stock adaptor method with correct arguments', () => {
      spyOn(StockIssueAdaptor, 'IssueSTNCountFromJson').and.returnValue({});

      const path = getIssueSTNCountEndpointUrl().path;

      stockIssueService.getCount().subscribe();

      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + path
      );
      request.flush(dummySTNCountResponse);
      expect(StockIssueAdaptor.IssueSTNCountFromJson).toHaveBeenCalledWith(
        dummySTNCountResponse
      );
    });

    it('should retun data mapped by stock adaptor', () => {
      const result = dummySTNCountResponse;

      spyOn(StockIssueAdaptor, 'IssueSTNCountFromJson').and.returnValue(result);
      const path = getIssueSTNCountEndpointUrl().path;

      stockIssueService.getCount().subscribe(data => {
        expect(data).toEqual(result);
      });

      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + path
      );
      request.flush({});
    });
  });

  // cancel STN

  describe('getIssuesCancelSTN', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(StockIssueHelper, 'getIssues').and.returnValue({});
      const page = 0;
      const size = 8;
      const transferType = 'BTQ_BTQ';
      const srcDocNo = 3;
      const { path, params } = getStockIssueCancelByPaginationEndpointUrl(
        transferType,
        page,
        size,
        srcDocNo
      );
      stockIssueService
        .getIssuesCancelSTN(transferType, page, size, srcDocNo)
        .subscribe();
      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + path
      );
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.toString()).toEqual(params.toString());
      expect(request.request.params.get('transferType')).toEqual(transferType);
      request.flush({});
    });
    it('should call stock adaptor method with correct arguments', () => {
      spyOn(StockIssueHelper, 'getIssues').and.returnValue({});
      const page = 0;
      const size = 8;
      const transferType = 'BTQ_BTQ';
      const srcDocNo = 3;
      const { path, params } = getStockIssueCancelByPaginationEndpointUrl(
        transferType,
        page,
        size,
        srcDocNo
      );
      stockIssueService
        .getIssuesCancelSTN(transferType, page, size, srcDocNo)
        .subscribe();

      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + path
      );
      request.flush(dummyIssuesCancelSTNResponse);
      expect(StockIssueHelper.getIssues).toHaveBeenCalledWith(
        dummyIssuesCancelSTNResponse
      );
    });
    it('should retun data mapped by stock adaptor', () => {
      spyOn(StockIssueHelper, 'getIssues').and.returnValue(
        dummyIssuesCancelSTNResponse
      );
      const page = 0;
      const size = 8;
      const transferType = 'BTQ_BTQ';
      const srcDocNo = 3;
      const { path, params } = getStockIssueCancelByPaginationEndpointUrl(
        transferType,
        page,
        size,
        srcDocNo
      );
      stockIssueService
        .getIssuesCancelSTN(transferType, page, size, srcDocNo)
        .subscribe(data => {
          expect(data).toEqual(dummyIssuesCancelSTNResponse);
        });

      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + path
      );
      request.flush({});
    });
  });

  describe('getCancelSTNCount', () => {
    const transferType = 'BTQ_BTQ';
    it('should call GET api method with correct url and params', () => {
      const { path, params } = getCancelIssueSTNCountEndpointUrl(transferType);
      stockIssueService.getCancelSTNCount(transferType).subscribe();
      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + path
      );
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.toString()).toEqual(params.toString());
      expect(request.request.params.get('transferType')).toEqual(transferType);
      request.flush({});
    });
  });

  describe('getCancelIssueSTNDetails', () => {
    const transferType = 'BTQ_BTQ';
    const id = 3;
    const dummyCancelRequestResponse: StockRequestNote = {
      carrierDetails: {
        type: 'TEST',
        data: {
          companyName: 'Test',
          docketNumber: 'Test',
          roadPermitNumber: 'Test'
          // employeeId: 'Test',
          // employeeMobileNumber: 'Test',
          // employeeName: 'Test'
        }
      },
      currencyCode: 'INR',
      destDocDate: moment(),
      destDocNo: 111,
      destLocationCode: 'TestLocation',
      destLocationDescription: 'TestLocation Description',
      id: 111,
      orderType: null,
      otherDetails: {},
      reqDocDate: moment(),
      reqDocNo: 111,
      reqLocationCode: 'TestLocation',
      requestType: 'FAC',
      srcDocDate: moment(),
      srcDocNo: 111,
      srcFiscalYear: 2020,
      srcLocationCode: 'TestLocation',
      srcLocationDescription: 'TestLocation Description',
      status: 'APPROVED',
      totalAvailableQuantity: 10,
      totalAvailableValue: 1000,
      totalAvailableWeight: 100,
      totalMeasuredQuantity: 5,
      totalMeasuredValue: 500,
      totalMeasuredWeight: 50,
      weightUnit: 'gms',
      courierReceivedDate: moment(),
      reasonForDelay: null,
      remarks: null,
      transferType: 'BTQ_FAC'
    };
    it('should call GET api method with correct url and params', () => {
      spyOn(StockIssueAdaptor, 'fromJson').and.returnValue({});
      const { path, params } = getCancelIssueSTNEndpointUrl(transferType, id);
      stockIssueService.getCancelIssueSTNDetails(transferType, id).subscribe();
      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + path
      );
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.toString()).toEqual(params.toString());
      expect(request.request.params.get('transferType')).toEqual(transferType);
      request.flush({});
    });
    it('should call stock adaptor method with correct arguments', () => {
      spyOn(StockIssueAdaptor, 'fromJson').and.returnValue({});
      const { path, params } = getCancelIssueSTNEndpointUrl(transferType, id);
      stockIssueService.getCancelIssueSTNDetails(transferType, id).subscribe();

      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + path
      );
      request.flush(dummyCancelRequestResponse);
      expect(StockIssueAdaptor.fromJson).toHaveBeenCalledWith(
        dummyCancelRequestResponse
      );
    });
    it('should retun data mapped by stock adaptor', () => {
      spyOn(StockIssueAdaptor, 'fromJson').and.returnValue(
        dummyCancelRequestResponse
      );
      const { path, params } = getCancelIssueSTNEndpointUrl(transferType, id);
      stockIssueService
        .getCancelIssueSTNDetails(transferType, id)
        .subscribe(data => {
          expect(data).toEqual(dummyCancelRequestResponse);
        });

      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + path
      );
      request.flush({});
    });
  });

  describe('getCancelIssueItems', () => {
    const payload = {
      id: 1,
      page: 0,
      size: 10,
      sort: [''],
      transferType: 'BTQ_BTQ',
      binCodes: [],
      binGroupCode: '',
      itemCode: '',
      lotNumber: '',
      productCategories: [],
      productGroups: [],
      studdedProductGroups: []
    };
    const itemsResponse = { items: dummyItemResponse, count: 1 };

    it('should call GET api method with correct url and params', () => {
      spyOn(IssueItemHelper, 'getItems').and.returnValue({});
      const { path, params } = getCancelIssueItemsByPaginationEndpointUrl(
        payload.id,
        payload.page,
        payload.size,
        payload.sort,
        payload.transferType,
        payload.binCodes,
        payload.binGroupCode,
        payload.itemCode,
        payload.lotNumber,
        payload.productCategories,
        payload.productGroups
      );
      stockIssueService
        .getCancelIssueItems(
          payload.id,
          payload.page,
          payload.size,
          payload.sort,
          payload.transferType,
          payload.binCodes,
          payload.binGroupCode,
          payload.itemCode,
          payload.lotNumber,
          payload.productCategories,
          payload.productGroups
        )
        .subscribe();
      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + path
      );
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.toString()).toEqual(params.toString());
      expect(request.request.params.get('transferType')).toEqual(
        payload.transferType
      );
      request.flush({});
    });
    it('should call stock adaptor method with correct arguments', () => {
      spyOn(IssueItemHelper, 'getItems').and.returnValue({});
      const { path, params } = getCancelIssueItemsByPaginationEndpointUrl(
        payload.id,
        payload.page,
        payload.size,
        payload.sort,
        payload.transferType,
        payload.binCodes,
        payload.binGroupCode,
        payload.itemCode,
        payload.lotNumber,
        payload.productCategories,
        payload.productGroups
      );
      stockIssueService
        .getCancelIssueItems(
          payload.id,
          payload.page,
          payload.size,
          payload.sort,
          payload.transferType,
          payload.binCodes,
          payload.binGroupCode,
          payload.itemCode,
          payload.lotNumber,
          payload.productCategories,
          payload.productGroups
        )
        .subscribe();

      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + path
      );
      request.flush(itemsResponse);
      expect(IssueItemHelper.getItems).toHaveBeenCalledWith(itemsResponse, []);
    });
    it('should retun data mapped by stock adaptor', () => {
      spyOn(IssueItemHelper, 'getItems').and.returnValue(itemsResponse);
      const { path, params } = getCancelIssueItemsByPaginationEndpointUrl(
        payload.id,
        payload.page,
        payload.size,
        payload.sort,
        payload.transferType,
        payload.binCodes,
        payload.binGroupCode,
        payload.itemCode,
        payload.lotNumber,
        payload.productCategories,
        payload.productGroups
      );
      stockIssueService
        .getCancelIssueItems(
          payload.id,
          payload.page,
          payload.size,
          payload.sort,
          payload.transferType,
          payload.binCodes,
          payload.binGroupCode,
          payload.itemCode,
          payload.lotNumber,
          payload.productCategories,
          payload.productGroups
        )
        .subscribe(data => {
          expect(data).toEqual(itemsResponse);
        });

      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + path
      );
      request.flush({});
    });
  });

  describe('getCancelIssueItemsCount', () => {
    const transferType = 'BTQ_BTQ';
    const id = 6;
    it('should call GET api method with correct url and params', () => {
      const { path, params } = getCancelIssueItemsCountEndpointUrl(
        transferType,
        id
      );
      stockIssueService.getCancelIssueItemsCount(transferType, id).subscribe();
      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + path
      );
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.toString()).toEqual(params.toString());
      expect(request.request.params.get('transferType')).toEqual(transferType);
      request.flush({});
    });
  });

  describe('getCancelIssueSTNRes', () => {
    const transferType = 'BTQ_BTQ';
    const id = 3;
    const dummyCancelRequestResponse: StockRequestNote = {
      carrierDetails: {
        type: 'TEST',
        data: {
          companyName: 'Test',
          docketNumber: 'Test',
          roadPermitNumber: 'Test'
          // employeeId: 'Test',
          // employeeMobileNumber: 'Test',
          // employeeName: 'Test'
        }
      },
      currencyCode: 'INR',
      destDocDate: moment(),
      destDocNo: 111,
      destLocationCode: 'TestLocation',
      destLocationDescription: 'TestLocation Description',
      id: 111,
      orderType: null,
      otherDetails: {},
      reqDocDate: moment(),
      reqDocNo: 111,
      reqLocationCode: 'TestLocation',
      requestType: 'FAC',
      srcDocDate: moment(),
      srcDocNo: 111,
      srcFiscalYear: 2020,
      srcLocationCode: 'TestLocation',
      srcLocationDescription: 'TestLocation Description',
      status: 'APPROVED',
      totalAvailableQuantity: 10,
      totalAvailableValue: 1000,
      totalAvailableWeight: 100,
      totalMeasuredQuantity: 5,
      totalMeasuredValue: 500,
      totalMeasuredWeight: 50,
      weightUnit: 'gms',
      courierReceivedDate: moment(),
      reasonForDelay: null,
      remarks: null,
      transferType: 'BTQ_FAC'
    };
    it('should call PATCH api method with correct url and params', () => {
      spyOn(StockIssueAdaptor, 'fromJson').and.returnValue({});
      const { path, params } = getCancelIssueSTNEndpointUrl(transferType, id);
      stockIssueService.getCancelIssueSTNRes(transferType, id, {}).subscribe();
      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + path
      );
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.toString()).toEqual(params.toString());
      expect(request.request.params.get('transferType')).toEqual(transferType);
      request.flush({});
    });
    it('should call stock adaptor method with correct arguments', () => {
      spyOn(StockIssueAdaptor, 'fromJson').and.returnValue({});
      const { path, params } = getCancelIssueSTNEndpointUrl(transferType, id);
      stockIssueService.getCancelIssueSTNRes(transferType, id, {}).subscribe();

      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + path
      );
      request.flush(dummyCancelRequestResponse);
      expect(StockIssueAdaptor.fromJson).toHaveBeenCalledWith(
        dummyCancelRequestResponse
      );
    });
    it('should retun data mapped by stock adaptor', () => {
      spyOn(StockIssueAdaptor, 'fromJson').and.returnValue(
        dummyCancelRequestResponse
      );
      const { path, params } = getCancelIssueSTNEndpointUrl(transferType, id);
      stockIssueService
        .getCancelIssueSTNRes(transferType, id, {})
        .subscribe(data => {
          expect(data).toEqual(dummyCancelRequestResponse);
        });

      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + path
      );
      request.flush({});
    });
  });
});
