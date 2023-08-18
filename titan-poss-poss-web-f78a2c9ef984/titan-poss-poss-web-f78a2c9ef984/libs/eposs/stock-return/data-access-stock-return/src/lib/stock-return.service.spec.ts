import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { StockReturnService } from './stock-return.service';
import {
  SearchItemPayloadSuccess,
  StockReturnItem,
  ConfirmCFAItems,
  InvoiceItems
} from '@poss-web/shared/models';
import { TestBed } from '@angular/core/testing';
import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { StockReturnAdaptor } from '@poss-web/shared/util-adaptors';
import {
  getSearchReturnInvoiceItemCfaEndpointUrl,
  getCreateRequestEndpointUrl,
  getConfirmReturnInvoiceCfaEndpointUrl,
  getReturnInvoiceCfaUrl,
  getCreateIssueItemsEndPointUrl,
  getRemoveSelectedItemsUrl,
  getLoadHeaderLevelUrl,
  getItemsToCFAUrl
} from '@poss-web/shared/util-api-service';
describe('StockReturnService', () => {
  const apiUrl = 'http://localhost:3000';
  let httpTestingController: HttpTestingController;
  let stockReturnService: StockReturnService;
  const dummyHeaderLevelDetails = {
    id: 0,
    itemCode: null,
    lotNumber: null,
    mfgDate: null,
    productCategory: null,
    productGroup: null,
    binCode: null,
    binGroupCode: null,
    stdValue: null,
    stdWeight: null,
    currencyCode: null,
    weightUnit: null,
    status: null,
    imageURL: null,
    itemDetails: null,
    availableQuantity: null,
    availableWeight: null,
    availableValue: null,
    measuredQuantity: null,
    measuredWeight: null,
    measuredValue: null,
    orderType: null,
    inventoryId: null,
    productCategoryDesc: null,
    productGroupDesc: null,
    // for l3
    remarks: 'good',
    thumbnailImageURL:'',
      taxDetails:{
      },
      isLoadingImage: true,
      isLoadingThumbnailImage :true
  };
  const dummyConfirmIssueToCfaData = {
    currencyCode: 'test',
    destDocDate: '2020-04-07T16:15:47.613Z',
    destDocNo: 10,
    destLocationCode: 'test',
    destLocationDescription: 'test',
    id: 0,
    invoiceType: 'test',
    issuedRemarks: 'test',
    orderType: 'test',
    srcDocDate: '2020-04-07T16:15:47.613Z',
    srcDocNo: 0,
    srcFiscalYear: 0,
    srcLocationCode: 'test',
    srcLocationDescription: 'test',
    status: 'test',
    totalAvailableQuantity: 0,
    totalAvailableValue: 0,
    totalAvailableWeight: 0,
    totalMeasuredQuantity: 0,
    totalMeasuredValue: 0,
    totalMeasuredWeight: 0,
    weightUnit: 'test'
  };
  const dummySearch: StockReturnItem[] = [
    {
      id: 0,
      itemCode: null,
      lotNumber: null,
      mfgDate: null,
      productCategory: null,
      productGroup: null,
      binCode: null,
      binGroupCode: null,
      stdValue: null,
      stdWeight: null,
      currencyCode: null,
      weightUnit: null,
      status: null,
      imageURL: null,
      itemDetails: null,
      availableQuantity: null,
      availableWeight: null,
      availableValue: null,
      measuredQuantity: null,
      measuredWeight: null,
      measuredValue: null,
      orderType: null,
      inventoryId: null,
      productCategoryDesc: null,
      productGroupDesc: null,
      // for l3
      remarks: 'good',
      isStudded: false,
      thumbnailImageURL:'',
      taxDetails:{
      },
      isLoadingImage: true,
      isLoadingThumbnailImage :true
    }
  ];
  const dummySearchRespone: SearchItemPayloadSuccess = {
    items: dummySearch,
    count: 10
  };
  const dummyItemsResponse = {
    results: dummySearch,
    pageIndex: 0,
    pageSize: 8,
    totalElements: 10
  };
  const dummyRequestInvoiceResponse: StockReturnItem = {
    id: 0,
    itemCode: null,
    lotNumber: null,
    mfgDate: null,
    productCategory: null,
    productGroup: null,
    binCode: null,
    binGroupCode: null,
    stdValue: null,
    stdWeight: null,
    currencyCode: null,
    weightUnit: null,
    status: null,
    imageURL: null,
    itemDetails: null,
    availableQuantity: null,
    availableWeight: null,
    availableValue: null,
    measuredQuantity: null,
    measuredWeight: null,
    measuredValue: null,
    orderType: null,
    inventoryId: null,
    productCategoryDesc: null,
    productGroupDesc: null,
    // for l3
    remarks: 'good',
    isStudded: false,
    thumbnailImageURL:'',
      taxDetails:{
      },
      isLoadingImage: true,
      isLoadingThumbnailImage :true
  };
  const dummyRequestInvoiceData = 10;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        StockReturnService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    stockReturnService = TestBed.inject(StockReturnService);
  });
  afterEach(() => {
    httpTestingController.verify();
  });
  it('should be created', () => {
    expect(stockReturnService).toBeTruthy();
  });
  describe('getSearchResult', () => {
    it('should call GET api method with correct url', () => {
      spyOn(StockReturnAdaptor, 'searchedItems').and.returnValue({});
      const itemCode = '100';
      const lotNumber = '101';
      const id = 8;
      const studdedProductGroups: string[] = [];
      const { path, params } = getSearchReturnInvoiceItemCfaEndpointUrl(
        id,
        itemCode,
        lotNumber
      );

      stockReturnService
        .searchItem(id, itemCode, lotNumber, studdedProductGroups)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        console.log('request', req);
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      // expect(
      //   request.request.url.includes(getReturnInvoiceCfaUrl())
      // ).toBeTruthy();
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.toString()).toEqual(params.toString());
      expect(request.request.params.get('invoiceType').toString()).toEqual(
        'BTQ_CFA'
      );
      expect(request.request.params.get('lotNumber').toString()).toEqual(
        lotNumber
      );
      expect(request.request.params.get('itemCode').toString()).toEqual(
        itemCode
      );
      request.flush({});
    });
    it('should call stock return adaptor method with correct arguments', () => {
      spyOn(StockReturnAdaptor, 'searchedItems').and.returnValue({});
      const itemCode = '100';
      const lotNumber = '101';
      const id = 8;
      const studdedProductGroups: [] = [];
      const path = getSearchReturnInvoiceItemCfaEndpointUrl(
        id,
        itemCode,
        lotNumber
      ).path;

      stockReturnService.searchItem(id, itemCode, lotNumber).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush(dummySearchRespone);
      expect(StockReturnAdaptor.searchedItems).toHaveBeenCalledWith(
        dummySearchRespone,
        studdedProductGroups
      );
    });
    it('should retun data mapped by stock return adaptor', () => {
      spyOn(StockReturnAdaptor, 'searchedItems').and.returnValue({
        items: dummySearch,
        count: 10
      });

      const itemCode = '100';
      const lotNumber = '101';
      const id = 8;
      const path = getSearchReturnInvoiceItemCfaEndpointUrl(
        id,
        itemCode,
        lotNumber
      ).path;
      stockReturnService.searchItem(id, itemCode, lotNumber).subscribe(data => {
        expect(data).toEqual(dummySearchRespone);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush({});
    });
  });
  describe('createRequestToCfa', () => {
    it('should call POST api method with correct url', () => {
      spyOn(StockReturnAdaptor, 'invoiceIdFromJson').and.returnValue({});

      const { path, params } = getCreateRequestEndpointUrl();

      stockReturnService.createReturnRequestToCfa().subscribe();

      const request = httpTestingController.expectOne(req => {
        console.log('req', req);
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.params.toString()).toEqual(params.toString());
      expect(request.request.params.get('invoiceType').toString()).toEqual(
        'BTQ_CFA'
      );
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
    it('should call stock return adaptor method with correct arguments', () => {
      spyOn(StockReturnAdaptor, 'invoiceIdFromJson').and.returnValue({});

      const path = getCreateRequestEndpointUrl().path;

      stockReturnService.createReturnRequestToCfa().subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush(dummyRequestInvoiceData);
      expect(StockReturnAdaptor.invoiceIdFromJson).toHaveBeenCalledWith(
        dummyRequestInvoiceData
      );
    });
    it('should retun data mapped by stock return adaptor', () => {
      const transferType = 'FAC_BTQ';
      const pageIndex = 0;
      const pageSize = 8;
      spyOn(StockReturnAdaptor, 'invoiceIdFromJson').and.returnValue(10);
      const path = getCreateRequestEndpointUrl().path;

      stockReturnService.createReturnRequestToCfa().subscribe(data => {
        expect(data).toEqual(dummyRequestInvoiceData);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush({});
    });
  });
  describe('confirmIssue', () => {
    it('should call PATCH api method with correct url and params', () => {
      spyOn(StockReturnAdaptor, 'confirmedIssueInvoiceTocfa').and.returnValue(
        {}
      );
      const id = 10;
      const confirmIssuePayload: ConfirmCFAItems = {
        cfaLocationCode: 'PNA',
        remarks: 'GOOD',
        carrierDetails: {
          type: 'HAND CARRY',
          data: {
            empId: 1,
            empName: 'test',
            phoneNumber: '9010462817'
          }
        }
      };

      const { path, params } = getConfirmReturnInvoiceCfaEndpointUrl(id);

      stockReturnService.confirmIssueCfa(id, confirmIssuePayload).subscribe();

      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + path
      );
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.toString()).toEqual(params.toString());
      expect(request.request.params.get('invoiceType').toString()).toEqual(
        'BTQ_CFA'
      );
      expect(request.request.body as Object).toEqual(
        JSON.stringify(confirmIssuePayload)
      );
      request.flush({});
    });
    it('should call stock return adaptor with correct arguments', () => {
      spyOn(StockReturnAdaptor, 'confirmedIssueInvoiceTocfa').and.returnValue(
        {}
      );
      const id = 10;
      const confirmIssuePayload: ConfirmCFAItems = {
        cfaLocationCode: 'PNA',
        remarks: 'GOOD',
        carrierDetails: {
          type: 'HAND CARRY',
          data: {
            empId: 1,
            empName: 'test',
            phoneNumber: '9010462817'
          }
        }
      };

      const path = getConfirmReturnInvoiceCfaEndpointUrl(id).path;

      stockReturnService.confirmIssueCfa(id, confirmIssuePayload).subscribe();

      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + path
      );

      request.flush(dummyConfirmIssueToCfaData);
      expect(
        StockReturnAdaptor.confirmedIssueInvoiceTocfa
      ).toHaveBeenCalledWith(dummyConfirmIssueToCfaData);
    });
    it('should retun data mapped by stocks helper', () => {
      const result = dummyConfirmIssueToCfaData.destDocNo;
      spyOn(StockReturnAdaptor, 'confirmedIssueInvoiceTocfa').and.returnValue(
        result
      );
      const id = 10;
      const confirmIssuePayload: ConfirmCFAItems = {
        cfaLocationCode: 'PNA',
        remarks: 'GOOD',
        carrierDetails: {
          type: 'HAND CARRY',
          data: {
            empId: 1,
            empName: 'test',
            phoneNumber: '9010462817'
          }
        }
      };

      const path = getConfirmReturnInvoiceCfaEndpointUrl(id).path;
      stockReturnService
        .confirmIssueCfa(id, confirmIssuePayload)
        .subscribe(data => {
          expect(data).toEqual(result);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush({});
    });
  });
  describe('createIssueItems', () => {
    it('should call POST api method with correct url', () => {
      const id = 10;
      const invoiceItems: InvoiceItems[] = [
        {
          inventoryId: 123
        }
      ];
      const { path, params } = getCreateIssueItemsEndPointUrl(id);

      stockReturnService.createIssueItems(id, invoiceItems).subscribe();

      const request = httpTestingController.expectOne(req => {
        console.log('req', req);
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.params.toString()).toEqual(params.toString());
      expect(request.request.params.get('invoiceType').toString()).toEqual(
        'BTQ_CFA'
      );
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
  });
  describe('removeItems', () => {
    it('should call PUT api method with correct url', () => {
      const id = 100;
      const items: number[] = [101, 102];
      const { path, params } = getRemoveSelectedItemsUrl(id);

      stockReturnService.removeSelectedItems(id, items).subscribe();

      const request = httpTestingController.expectOne(req => {
        console.log('request', req);
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PUT');
      expect(request.request.params.toString()).toEqual(params.toString());
      expect(request.request.params.get('invoiceType').toString()).toEqual(
        'BTQ_CFA'
      );
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
  });
  describe('loadHeaderLevelDetails', () => {
    it('should call GET api method with correct url', () => {
      spyOn(StockReturnAdaptor, 'getHeaderLevelDetails').and.returnValue({});
      const rquestId = 100;

      const { path, params } = getLoadHeaderLevelUrl(rquestId);

      stockReturnService.loadHeaderLevelDetails(rquestId).subscribe();

      const request = httpTestingController.expectOne(req => {
        console.log('request', req);
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.params.toString()).toEqual(params.toString());
      expect(request.request.params.get('invoiceType').toString()).toEqual(
        'BTQ_CFA'
      );
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
    it('should call stock return adaptor method with correct arguments', () => {
      spyOn(StockReturnAdaptor, 'getHeaderLevelDetails').and.returnValue({});
      const rquestId = 100;

      const path = getLoadHeaderLevelUrl(rquestId).path;

      stockReturnService.loadHeaderLevelDetails(rquestId).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush(dummyHeaderLevelDetails);
      expect(StockReturnAdaptor.getHeaderLevelDetails).toHaveBeenCalledWith(
        dummyHeaderLevelDetails
      );
    });
    it('should retun data mapped by stock return adaptor', () => {
      spyOn(StockReturnAdaptor, 'getHeaderLevelDetails').and.returnValue(
        dummyHeaderLevelDetails
      );
      const rquestId = 100;
      const path = getLoadHeaderLevelUrl(rquestId).path;

      stockReturnService.loadHeaderLevelDetails(rquestId).subscribe(data => {
        expect(data).toEqual(dummyHeaderLevelDetails);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush({});
    });
  });
  describe('getCFAItems', () => {
    it('should call GET api method with correct url', () => {
      spyOn(StockReturnAdaptor, 'getItemsFromJson').and.returnValue({});
      const id = 111;
      const itemId = '2SXD22';
      const lotNumber = '2WER2';
      const pageIndex = 0;
      const pageSize = 10;
      const sortBy = 'weight';
      const sortOrder = 'ASC';
      const filter: { key: string; value: any[] }[] = [
        { key: 'test', value: ['test1', 'test2'] }
      ];
      const studdedProductGroups: [] = [];
      const { path, params } = getItemsToCFAUrl(
        id,
        pageIndex,
        pageSize,
        sortBy,
        sortOrder,
        itemId,
        lotNumber,
        filter
      );

      stockReturnService
        .getItemsCFA({
          id,
          pageIndex,
          pageSize,
          sortBy,
          sortOrder,
          itemId,
          lotNumber,
          filter
        })
        .subscribe();

      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + path
      );
      expect(request.request.params.get('itemCode')).toEqual(itemId);
      expect(request.request.params.get('lotNumber')).toEqual(lotNumber);
      expect(request.request.params.get('page').toString()).toEqual(
        pageIndex.toString()
      );
      expect(request.request.params.get('size').toString()).toEqual(
        pageSize.toString()
      );
      expect(request.request.params.get('sort')).toEqual(
        `${sortBy},${sortOrder}`
      );
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      expect(
        request.request.url.includes(getReturnInvoiceCfaUrl())
      ).toBeTruthy();
      request.flush({});
    });
    it('should call item adaptor method with correct arguments', () => {
      spyOn(StockReturnAdaptor, 'getItemsFromJson').and.returnValue({});
      const id = 111;
      const itemId = '2SXD22';
      const lotNumber = '2WER2';
      const pageIndex = 0;
      const pageSize = 10;
      const sortBy = 'weight';
      const sortOrder = 'ASC';
      const filter: { key: string; value: any[] }[] = [
        { key: 'test', value: ['test1', 'test2'] }
      ];
      const studdedProductGroups: string[] = [];
      const { path, params } = getItemsToCFAUrl(
        id,
        pageIndex,
        pageSize,
        sortBy,
        sortOrder,
        itemId,
        lotNumber,
        filter
      );

      stockReturnService
        .getItemsCFA(
          {
            id,
            pageIndex,
            pageSize,
            sortBy,
            sortOrder,
            itemId,
            lotNumber,
            filter
          },
          studdedProductGroups
        )
        .subscribe();

      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + path
      );

      request.flush(dummyItemsResponse);
      expect(request.request.params.get('itemCode')).toEqual(itemId);
      expect(request.request.params.get('lotNumber')).toEqual(lotNumber);
      expect(request.request.params.get('page').toString()).toEqual(
        pageIndex.toString()
      );
      expect(request.request.params.get('size').toString()).toEqual(
        pageSize.toString()
      );
      expect(request.request.params.get('sort')).toEqual(
        `${sortBy},${sortOrder}`
      );
      expect(StockReturnAdaptor.getItemsFromJson).toHaveBeenCalledWith(
        dummyItemsResponse,
        studdedProductGroups
      );
    });
    it('should retun items and count from item adaptor', () => {
      const itemResult = dummySearch;
      const itemCount = 10;
      const result = { items: dummySearch, count: itemCount };
      spyOn(StockReturnAdaptor, 'getItemsFromJson').and.returnValue(result);
      const id = 111;
      const itemId = '2SXD22';
      const lotNumber = '2WER2';
      const pageIndex = 0;
      const pageSize = 10;
      const sortBy = 'weight';
      const sortOrder = 'ASC';
      const filter: { key: string; value: any[] }[] = [
        { key: 'test', value: ['test1', 'test2'] }
      ];
      const { path, params } = getItemsToCFAUrl(
        id,
        pageIndex,
        pageSize,
        sortBy,
        sortOrder,
        itemId,
        lotNumber,
        filter
      );
      stockReturnService
        .getItemsCFA({
          id,
          pageIndex,
          pageSize,
          sortBy,
          sortOrder,
          itemId,
          lotNumber,
          filter
        })
        .subscribe(data => {
          expect(data.items).toEqual(itemResult);
          expect(data.count).toEqual(itemCount);
        });

      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + path
      );
      expect(request.request.params.get('itemCode')).toEqual(itemId);
      expect(request.request.params.get('lotNumber')).toEqual(lotNumber);
      expect(request.request.params.get('page').toString()).toEqual(
        pageIndex.toString()
      );
      expect(request.request.params.get('size').toString()).toEqual(
        pageSize.toString()
      );
      expect(request.request.params.get('sort')).toEqual(
        `${sortBy},${sortOrder}`
      );

      request.flush({});
    });
  });
});
