import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { StockReceiveService } from './stock-receive.service';
import {
  getStockReceiveByPaginationEndpointUrl,
  getPurchaseInvoiceByPaginationEndpointUrl,
  getStockReceiveBySrcDocNoEndpointUrl,
  getPurchaseInvoiceBySrcDocNoEndpointUrl,
  getStockByIdEndpointUrl,
  getInvociePurchaseByIdEndpointUrl,
  getStockReceiveItemsEndpointUrl,
  getStockReceiveUrl,
  getPurchaseInvoiceUrl,
  getStockReceiveVerifyItemEndpointUrl,
  getValidateItemEndpointUrl,
  getStockReceiveUpdateAllItemsEndpointUrl,
  getStockReceiveConfirmSTNEndpointUrl,
  getStockReceiveHistoryById,
  getStockReceiveCFAHistoryById,
  getStockReceiveHistoryEndPointUrl,
  getStockReceiveCFAHistoryUrl,
  getStockReceiveCFAHistroyItemsEndpointUrl,
  getStockReceiveHistroyItemsEndpointUrl
} from '@poss-web/shared/util-api-service';
import {
  StockReceiveStockHelper,
  StockReceiveStockAdaptor,
  StockReceiveItemHelper,
  StockRecevieItemAdaptor
} from '@poss-web/shared/util-adaptors';
import {
  StockReceiveTypeFieldEnum,
  StockReceiveStock,
  StockReceiveItemStatusEnum,
  StockReceiveItem,
  StockReceiveItemUpdate,
  StockReceiveConfirmReceive,
  StockReceiveTypesEnum,
  StockReceiveHistory,
  StockReceiveHistoryItem
} from '@poss-web/shared/models';
import * as moment from 'moment';

describe('StockReceiveService ', () => {
  let httpTestingController: HttpTestingController;
  let stockReceiveService: StockReceiveService;
  const apiUrl = 'http://localhost:3000';

  const dummyItemsResponse: StockReceiveItem[] = [
    {
      id: '23SW22',
      binCode: 'TestBinCode',
      itemCode: '1233NXB992',
      itemDetails: {},
      stdValue: 10,
      stdWeight: 10,
      lotNumber: '121212',
      mfgDate: moment(),
      status: 'issued',
      availableValue: 10,
      availableWeight: 10,
      currencyCode: 'INR',
      weightUnit: 'gms',
      imageURL: 'http://test.com',
      measuredQuantity: 10,
      measuredWeight: 10,
      binGroupCode: 'TestBinGroupCode',
      availableQuantity: 10,
      orderType: 'P',
      productCategory: 'TestProductCategory',
      productGroup: 'TestProductGroup',
      productCategoryDesc: 'TestProductCategoryDesc',
      productGroupDesc: 'TestProductGroupDesc',
      remarks: 'TestRemarks',
      isUpdating: false,
      isUpdatingSuccess: null,
      isValidating: false,
      isValidatingSuccess: null,
      isValidatingError: false,
      isStudded: true,
      thumbnailImageURL: 'dummy',
      isLoadingImage: true,
      isLoadingThumbnailImage: true
    }
  ];

  const dummyItemsRequestResponse = {
    results: dummyItemsResponse,
    pageIndex: 0,
    pageSize: 8,
    totalElements: 10
  };

  const dummyStockResponse: StockReceiveStock[] = [
    {
      id: 111,
      srcDocNo: 111,
      srcLocationCode: 'TestLocation',
      type: 'courier',
      courierDetails: {
        type: 'TEST',
        data: {
          companyName: 'Test',
          docketNumber: 'Test',
          lockNumber: 'Test',
          roadPermitNumber: 'Test',
          employeeId: 'Test',
          employeeMobileNumber: 'Test',
          employeeName: 'Test'
        }
      },
      orderType: 'R',
      courierReceivedDate: moment(),
      totalAvailableValue: 10,
      totalAvailableWeight: 10,
      totalAvailableQuantity: 10,
      totalMeasuredQuantity: 10,
      totalMeasuredValue: 10,
      totalMeasuredWeight: 10,
      srcDocDate: moment(),
      currencyCode: 'INR',
      weightUnit: 'gms',
      status: 'issued',
      srcFiscalYear: 2020,
      destDocDate: moment(),
      destDocNo: 111,
      destLocationCode: 'TestCode',
      srcLocationDescription: 'Description',
      destLocationDescription: 'Description'
    }
  ];

  const dummyStockRequestResponse = {
    results: dummyStockResponse,
    pageIndex: 0,
    pageSize: 8,
    totalElements: 1
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        StockReceiveService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    stockReceiveService = TestBed.inject(StockReceiveService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(stockReceiveService).toBeTruthy();
  });

  describe('getStocks', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(StockReceiveStockHelper, 'getStocks').and.returnValue({});
      const transferType = 'FAC_BTQ';
      const pageIndex = 0;
      const pageSize = 8;
      const { path, params } = getStockReceiveByPaginationEndpointUrl(
        transferType,
        pageIndex,
        pageSize
      );

      stockReceiveService
        .getStocks(transferType, pageIndex, pageSize)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.params.toString()).toEqual(params.toString());
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.get('transferType')).toEqual(transferType);
      expect(request.request.params.get('page').toString()).toEqual(
        pageIndex.toString()
      );
      expect(request.request.params.get('size').toString()).toEqual(
        pageSize.toString()
      );
      request.flush({});
    });

    it('should call stocks helper method with correct arguments', () => {
      spyOn(StockReceiveStockHelper, 'getStocks').and.returnValue({});
      const transferType = 'FAC_BTQ';
      const pageIndex = 0;
      const pageSize = 8;
      const path = getStockReceiveByPaginationEndpointUrl(
        transferType,
        pageIndex,
        pageSize
      ).path;

      stockReceiveService
        .getStocks(transferType, pageIndex, pageSize)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush(dummyStockRequestResponse);
      expect(StockReceiveStockHelper.getStocks).toHaveBeenCalledWith(
        dummyStockRequestResponse,
        StockReceiveTypeFieldEnum.STN
      );
    });

    it('should return data mapped by stocks helper', () => {
      spyOn(StockReceiveStockHelper, 'getStocks').and.returnValue({
        stocks: dummyStockResponse,
        count: 10
      });

      const transferType = 'FAC_BTQ';
      const pageIndex = 0;
      const pageSize = 8;
      const path = getStockReceiveByPaginationEndpointUrl(
        transferType,
        pageIndex,
        pageSize
      ).path;

      stockReceiveService
        .getStocks(transferType, pageIndex, pageSize)
        .subscribe(data => {
          expect(data).toEqual(dummyStockResponse);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush({});
    });
  });

  describe('getInvoices', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(StockReceiveStockHelper, 'getStocks').and.returnValue({});
      const transferType = 'CFA_BTQ';
      const pageIndex = 0;
      const pageSize = 8;
      const { path, params } = getPurchaseInvoiceByPaginationEndpointUrl(
        transferType,
        pageIndex,
        pageSize
      );

      stockReceiveService
        .getInvoices(transferType, pageIndex, pageSize)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.params.toString()).toEqual(params.toString());
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.get('invoiceType')).toEqual(transferType);
      expect(request.request.params.get('page').toString()).toEqual(
        pageIndex.toString()
      );
      expect(request.request.params.get('size').toString()).toEqual(
        pageSize.toString()
      );
      request.flush({});
    });

    it('should call stocks helper method with correct arguments', () => {
      spyOn(StockReceiveStockHelper, 'getStocks').and.returnValue({});
      const transferType = 'CFA_BTQ';
      const pageIndex = 0;
      const pageSize = 8;
      const path = getPurchaseInvoiceByPaginationEndpointUrl(
        transferType,
        pageIndex,
        pageSize
      ).path;

      stockReceiveService
        .getInvoices(transferType, pageIndex, pageSize)
        .subscribe(data => {});

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush(dummyStockRequestResponse);
      expect(StockReceiveStockHelper.getStocks).toHaveBeenCalledWith(
        dummyStockRequestResponse,
        StockReceiveTypeFieldEnum.INVOICE
      );
    });

    it('should return data mapped by stocks helper', () => {
      const transferType = 'FAC_BTQ';
      const pageIndex = 0;
      const pageSize = 8;
      spyOn(StockReceiveStockHelper, 'getStocks').and.returnValue({
        stocks: dummyStockResponse,
        count: 10
      });
      const path = getStockReceiveByPaginationEndpointUrl(
        transferType,
        pageIndex,
        pageSize
      ).path;

      stockReceiveService
        .getStocks(transferType, pageIndex, pageSize)
        .subscribe(data => {
          expect(data).toEqual(dummyStockResponse);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush({});
    });
  });

  describe('searchStocks', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(StockReceiveStockHelper, 'getStocks').and.returnValue({});
      const type = 'FAC_BTQ';
      const srcDocNumber = "11111";
      const { path, params } = getStockReceiveBySrcDocNoEndpointUrl(
        srcDocNumber,
        type
      );

      stockReceiveService.searchStocks(srcDocNumber, type).subscribe();

      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + path
      );
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.toString()).toEqual(params.toString());
      expect(request.request.params.get('transferType')).toEqual(type);
      expect(request.request.params.get('srcDocNo').toString()).toEqual(
        srcDocNumber.toString()
      );
      request.flush({});
    });

    it('should call stocks helper method with correct arguments', () => {
      spyOn(StockReceiveStockHelper, 'getStocks').and.returnValue({});
      const type = 'FAC_BTQ';
      const srcDocNumber = "11111";
      const path = getStockReceiveBySrcDocNoEndpointUrl(srcDocNumber, type)
        .path;

      stockReceiveService.searchStocks(srcDocNumber, type).subscribe();

      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + path
      );
      request.flush(dummyStockRequestResponse);
      expect(StockReceiveStockHelper.getStocks).toHaveBeenCalledWith(
        dummyStockRequestResponse,
        StockReceiveTypeFieldEnum.STN
      );
    });

    it('should return data mapped by stocks helper', () => {
      spyOn(StockReceiveStockHelper, 'getStocks').and.returnValue({
        stocks: dummyStockResponse,
        count: 10
      });
      const type = 'FAC_BTQ';
      const srcDocNumber = "11111";
      const path = getStockReceiveBySrcDocNoEndpointUrl(srcDocNumber, type)
        .path;

      stockReceiveService.searchStocks(srcDocNumber, type).subscribe(data => {
        expect(data).toEqual(dummyStockResponse);
      });

      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + path
      );
      request.flush({});
    });
  });

  describe('searchInovices', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(StockReceiveStockHelper, 'getStocks').and.returnValue({});
      const type = 'CFA_BTQ';
      const srcDocNumber = "11111";
      const { path, params } = getPurchaseInvoiceBySrcDocNoEndpointUrl(
        srcDocNumber,
        type
      );

      stockReceiveService.searchInovices(srcDocNumber, type).subscribe();

      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + path
      );

      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.toString()).toEqual(params.toString());
      expect(request.request.params.get('invoiceType')).toEqual(type);
      expect(request.request.params.get('srcDocNo').toString()).toEqual(
        srcDocNumber.toString()
      );
      request.flush({});
    });

    it('should call stocks helper method with correct arguments', () => {
      spyOn(StockReceiveStockHelper, 'getStocks').and.returnValue({});
      const type = 'CFA_BTQ';
      const srcDocNumber = "11111";
      const path = getPurchaseInvoiceBySrcDocNoEndpointUrl(srcDocNumber, type)
        .path;

      stockReceiveService.searchInovices(srcDocNumber, type).subscribe();

      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + path
      );

      request.flush(dummyStockRequestResponse);
      expect(StockReceiveStockHelper.getStocks).toHaveBeenCalledWith(
        dummyStockRequestResponse,
        StockReceiveTypeFieldEnum.INVOICE
      );
    });

    it('should return data mapped by stocks helper', () => {
      spyOn(StockReceiveStockHelper, 'getStocks').and.returnValue({
        stocks: dummyStockResponse,
        count: 10
      });
      const type = 'FAC_BTQ';
      const srcDocNumber = "11111";
      const path = getPurchaseInvoiceBySrcDocNoEndpointUrl(srcDocNumber, type)
        .path;

      stockReceiveService.searchInovices(srcDocNumber, type).subscribe(data => {
        expect(data).toEqual(dummyStockResponse);
      });

      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + path
      );

      request.flush({});
    });
  });

  describe('getStock', () => {
    it('Stock-Receive : should call GET api method with correct url and params', () => {
      spyOn(StockReceiveStockAdaptor, 'fromJson').and.returnValue({});
      const type = 'FAC_BTQ';
      const id = '11111';
      const { path, params } = getStockByIdEndpointUrl(id, type);

      stockReceiveService.getStock(id, type, 'null').subscribe();

      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + path
      );
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.toString()).toEqual(params.toString());
      expect(request.request.params.get('transferType')).toEqual(type);
      request.flush({});
    });

    it('History : should call GET api method with correct url and params', () => {
      spyOn(StockReceiveStockAdaptor, 'fromJson').and.returnValue({});
      const id = '11111';
      const type = StockReceiveTypesEnum.HISTORY;
      const historytype = StockReceiveTypesEnum.FAC_BTQ;

      const { path, params } = getStockReceiveHistoryById(id, historytype);

      stockReceiveService.getStock(id, type, historytype).subscribe();

      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + path
      );
      expect(request.request.params.toString()).toEqual(params.toString());
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });

    it('should call stock adaptor method with correct arguments', () => {
      spyOn(StockReceiveStockAdaptor, 'fromJson').and.returnValue({});
      const type = StockReceiveTypesEnum.FAC_BTQ;
      const historytype = null;
      const id = '11111';
      const path = getStockByIdEndpointUrl(id, type).path;

      stockReceiveService.getStock(id, type, historytype).subscribe();

      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + path
      );
      request.flush(dummyStockResponse);
      expect(StockReceiveStockAdaptor.fromJson).toHaveBeenCalledWith(
        dummyStockResponse,
        StockReceiveTypeFieldEnum.STN
      );
    });

    it('should return data mapped by stock adaptor', () => {
      const result = dummyStockResponse[0];

      spyOn(StockReceiveStockAdaptor, 'fromJson').and.returnValue(result);
      const type = StockReceiveTypesEnum.FAC_BTQ;
      const historytype = null;
      const id = '11111';
      const path = getStockByIdEndpointUrl(id, type).path;

      stockReceiveService.getStock(id, type, historytype).subscribe(data => {
        expect(data).toEqual(result);
      });

      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + path
      );
      request.flush({});
    });
  });

  describe('getInvoice', () => {
    it('Stock Receive : should call GET api method with correct url and params', () => {
      spyOn(StockReceiveStockAdaptor, 'fromJson').and.returnValue({});
      const type = 'CFA_BTQ';
      const id = '11111';
      const { path, params } = getInvociePurchaseByIdEndpointUrl(id, type);

      stockReceiveService.getInvoice(id, type, null).subscribe();

      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + path
      );
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.toString()).toEqual(params.toString());
      expect(request.request.params.get('invoiceType')).toEqual(type);
      request.flush({});
    });

    it('History : should call GET api method with correct url and params', () => {
      spyOn(StockReceiveStockAdaptor, 'fromJson').and.returnValue({});
      const id = '11111';
      const type = StockReceiveTypesEnum.HISTORY;
      const historytype = StockReceiveTypesEnum.FAC_BTQ;
      const { path, params } = getStockReceiveCFAHistoryById(id, historytype);

      stockReceiveService.getInvoice(id, type, historytype).subscribe();

      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + path
      );
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });

    it('should call stock adaptor method with correct arguments', () => {
      spyOn(StockReceiveStockAdaptor, 'fromJson').and.returnValue({});
      const type = 'CFA_BTQ';
      const id = '11111';
      const path = getInvociePurchaseByIdEndpointUrl(id, type).path;

      stockReceiveService.getInvoice(id, type, null).subscribe();

      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + path
      );

      request.flush(dummyStockResponse);
      expect(StockReceiveStockAdaptor.fromJson).toHaveBeenCalledWith(
        dummyStockResponse,
        StockReceiveTypeFieldEnum.INVOICE
      );
    });

    it('should return data mapped by stock adaptor', () => {
      const result = dummyStockResponse[0];

      spyOn(StockReceiveStockAdaptor, 'fromJson').and.returnValue(result);
      const type = 'CFA_BTQ';
      const id = '11111';
      const path = getInvociePurchaseByIdEndpointUrl(id, type).path;

      stockReceiveService.getInvoice(id, type, null).subscribe(data => {
        expect(data).toEqual(result);
      });

      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + path
      );

      request.flush({});
    });
  });

  describe('getItemsCount', () => {
    it('for L1/L2 should call GET api method with correct url and params', () => {
      const storeType = 'L1';
      const type = 'FAC_BTQ';
      const id = 11;
      const pageIndex = 0;
      const pageSize = 1;
      const url1 = getStockReceiveItemsEndpointUrl(
        storeType,
        type,
        StockReceiveItemStatusEnum.ISSUED,
        id,
        null,
        null,
        pageIndex,
        pageSize,
        null,
        null,
        null
      );

      const url2 = getStockReceiveItemsEndpointUrl(
        storeType,
        type,
        StockReceiveItemStatusEnum.VERIFIED,
        id,
        null,
        null,
        pageIndex,
        pageSize,
        null,
        null,
        null
      );

      stockReceiveService.getItemsCount(storeType, type, id).subscribe();

      const request1 = httpTestingController.expectOne(
        req => req.url === apiUrl + url1.path
      );
      expect(request1.cancelled).toBeFalsy();
      expect(request1.request.method).toEqual('GET');
      expect(request1.request.responseType).toEqual('json');
      expect(request1.request.params.toString()).toEqual(
        url1.params.toString()
      );
      expect(request1.request.params.get('transferType')).toEqual(type);
      expect(request1.request.params.get('page').toString()).toEqual(
        pageIndex.toString()
      );
      expect(request1.request.params.get('size').toString()).toEqual(
        pageSize.toString()
      );
      expect(request1.request.url.includes(getStockReceiveUrl())).toBeTruthy();
      expect(request1.request.params.get('status')).toEqual(
        StockReceiveItemStatusEnum.ISSUED
      );
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
      expect(request2.request.params.get('transferType')).toEqual(type);
      expect(request2.request.params.get('page').toString()).toEqual(
        pageIndex.toString()
      );
      expect(request2.request.params.get('size').toString()).toEqual(
        pageSize.toString()
      );
      expect(request2.request.url.includes(getStockReceiveUrl())).toBeTruthy();
      expect(request2.request.params.get('status')).toEqual(
        StockReceiveItemStatusEnum.VERIFIED
      );
      request2.flush({});
    });

    it('for L3 should call GET api method with correct url and params', () => {
      const storeType = 'L3';
      const type = 'FAC_BTQ';
      const id = 11;
      const pageIndex = 0;
      const pageSize = 1;
      const url1 = getStockReceiveItemsEndpointUrl(
        storeType,
        type,
        StockReceiveItemStatusEnum.ISSUED,
        id,
        null,
        null,
        pageIndex,
        pageSize,
        null,
        null,
        null
      );

      const url2 = getStockReceiveItemsEndpointUrl(
        storeType,
        type,
        StockReceiveItemStatusEnum.VERIFIED,
        id,
        null,
        null,
        pageIndex,
        pageSize,
        null,
        null,
        null
      );

      stockReceiveService.getItemsCount(storeType, type, id).subscribe();

      const request1 = httpTestingController.expectOne(
        req => req.url === apiUrl + url1.path
      );
      expect(request1.cancelled).toBeFalsy();
      expect(request1.request.method).toEqual('GET');
      expect(request1.request.responseType).toEqual('json');
      expect(request1.request.params.toString()).toEqual(
        url1.params.toString()
      );
      expect(request1.request.params.get('invoiceType')).toEqual(type);
      expect(request1.request.params.get('page').toString()).toEqual(
        pageIndex.toString()
      );
      expect(request1.request.params.get('size').toString()).toEqual(
        pageSize.toString()
      );
      expect(
        request1.request.url.includes(getPurchaseInvoiceUrl())
      ).toBeTruthy();
      expect(request1.request.params.get('status')).toEqual(
        StockReceiveItemStatusEnum.ISSUED
      );
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
      expect(request2.request.params.get('invoiceType')).toEqual(type);
      expect(request2.request.params.get('page').toString()).toEqual(
        pageIndex.toString()
      );
      expect(request2.request.params.get('size').toString()).toEqual(
        pageSize.toString()
      );
      expect(
        request2.request.url.includes(getPurchaseInvoiceUrl())
      ).toBeTruthy();
      expect(request2.request.params.get('status')).toEqual(
        StockReceiveItemStatusEnum.VERIFIED
      );
      request2.flush({});
    });

    it('should return data mapped by stock adaptor', () => {
      const result1 = {
        totalElements: 19
      };
      const result2 = {
        totalElements: 11
      };
      const storeType = 'L1';
      const type = 'FAC_BTQ';
      const id = 11;
      const pageIndex = 0;
      const pageSize = 1;
      const url1 = getStockReceiveItemsEndpointUrl(
        storeType,
        type,
        StockReceiveItemStatusEnum.ISSUED,
        id,
        null,
        null,
        pageIndex,
        pageSize,
        null,
        null,
        null
      );

      const url2 = getStockReceiveItemsEndpointUrl(
        storeType,
        type,
        StockReceiveItemStatusEnum.VERIFIED,
        id,
        null,
        null,
        pageIndex,
        pageSize,
        null,
        null,
        null
      );

      stockReceiveService.getItemsCount(storeType, type, id).subscribe(data => {
        expect(data.nonVerifiedItemsTotalCount).toEqual(result1.totalElements);
        expect(data.verifiedItemsTotalCount).toEqual(result2.totalElements);
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
    it('Stock Receive for L1/L2 Stores should call GET api method with correct url and params', () => {
      spyOn(StockReceiveItemHelper, 'getItems').and.returnValue({});
      const storeType = 'L1';
      const type = 'FAC_BTQ';
      const status = 'issued';
      const id = 111;
      const itemCode = '2SXD22';
      const lotNumber = '2WER2';
      const pageIndex = 0;
      const pageSize = 10;
      const sortBy = 'weight';
      const sortOrder = 'ASC';
      const filter: { key: string; value: any[] }[] = [
        { key: 'test', value: ['test1', 'test2'] }
      ];
      const { path, params } = getStockReceiveItemsEndpointUrl(
        storeType,
        type,
        status,
        id,
        itemCode,
        lotNumber,
        pageIndex,
        pageSize,
        sortBy,
        sortOrder,
        filter
      );

      stockReceiveService
        .getItems(
          storeType,
          type,
          status,
          id,
          itemCode,
          lotNumber,
          pageIndex,
          pageSize,
          sortBy,
          sortOrder,
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
      expect(request.request.params.get('transferType')).toEqual(type);
      expect(request.request.params.get('itemCode')).toEqual(itemCode);
      expect(request.request.params.get('lotNumber')).toEqual(lotNumber);
      expect(request.request.params.get('status')).toEqual(status);
      expect(request.request.params.get('sort')).toEqual(
        `${sortBy},${sortOrder}`
      );
      expect(request.request.params.get('page').toString()).toEqual(
        pageIndex.toString()
      );
      expect(request.request.params.get('size').toString()).toEqual(
        pageSize.toString()
      );
      expect(request.request.url.includes(getStockReceiveUrl())).toBeTruthy();
      request.flush({});
    });
    it('Stock Receive for L3 Stores should call GET api method with correct url and params', () => {
      spyOn(StockReceiveItemHelper, 'getItems').and.returnValue({});
      const storeType = 'L3';
      const type = 'FAC_BTQ';
      const status = 'issued';
      const id = 111;
      const itemCode = '2SXD22';
      const lotNumber = '2WER2';
      const pageIndex = 0;
      const pageSize = 10;
      const sortBy = 'weight';
      const sortOrder = 'ASC';
      const filter: { key: string; value: any[] }[] = [
        { key: 'test', value: ['test1', 'test2'] }
      ];
      const { path, params } = getStockReceiveItemsEndpointUrl(
        storeType,
        type,
        status,
        id,
        itemCode,
        lotNumber,
        pageIndex,
        pageSize,
        sortBy,
        sortOrder,
        filter
      );

      stockReceiveService
        .getItems(
          storeType,
          type,
          status,
          id,
          itemCode,
          lotNumber,
          pageIndex,
          pageSize,
          sortBy,
          sortOrder,
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
      expect(request.request.params.get('invoiceType')).toEqual(type);
      expect(request.request.params.get('itemCode')).toEqual(itemCode);
      expect(request.request.params.get('lotNumber')).toEqual(lotNumber);
      expect(request.request.params.get('status')).toEqual(status);
      expect(request.request.params.get('sort')).toEqual(
        `${sortBy},${sortOrder}`
      );
      expect(request.request.params.get('page').toString()).toEqual(
        pageIndex.toString()
      );
      expect(request.request.params.get('size').toString()).toEqual(
        pageSize.toString()
      );
      expect(
        request.request.url.includes(getPurchaseInvoiceUrl())
      ).toBeTruthy();
      request.flush({});
    });

    it('should call item helper method with correct arguments', () => {
      spyOn(StockReceiveItemHelper, 'getItems').and.returnValue({});
      const storeType = 'L3';
      const type = 'FAC_BTQ';
      const status = 'issued';
      const id = 111;
      const itemCode = '2SXD22';
      const lotNumber = '2WER2';
      const pageIndex = 0;
      const pageSize = 10;
      const sortBy = 'weight';
      const sortOrder = 'ASC';
      const filter: { key: string; value: any[] }[] = [
        { key: 'test', value: ['test1', 'test2'] }
      ];
      const path = getStockReceiveItemsEndpointUrl(
        storeType,
        type,
        status,
        id,
        itemCode,
        lotNumber,
        pageIndex,
        pageSize,
        sortBy,
        sortOrder,
        filter
      ).path;

      stockReceiveService
        .getItems(
          storeType,
          type,
          status,
          id,
          itemCode,
          lotNumber,
          pageIndex,
          pageSize,
          sortBy,
          sortOrder,
          filter
        )
        .subscribe();

      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + path
      );

      request.flush(dummyItemsRequestResponse);
      expect(StockReceiveItemHelper.getItems).toHaveBeenCalledWith(
        dummyItemsRequestResponse,
        []
      );
    });

    it('should return items and count from item helper', () => {
      const itemResult = dummyItemsResponse;
      const itemCount = 10;
      const result = { items: itemResult, count: itemCount };
      spyOn(StockReceiveItemHelper, 'getItems').and.returnValue(result);
      const storeType = 'L3';
      const type = 'FAC_BTQ';
      const status = 'issued';
      const id = 111;
      const itemCode = '2SXD22';
      const lotNumber = '2WER2';
      const pageIndex = 0;
      const pageSize = 10;
      const sortBy = 'weight';
      const sortOrder = 'ASC';
      const filter: { key: string; value: any[] }[] = [
        { key: 'test', value: ['test1', 'test2'] }
      ];
      const path = getStockReceiveItemsEndpointUrl(
        storeType,
        type,
        status,
        id,
        itemCode,
        lotNumber,
        pageIndex,
        pageSize,
        sortBy,
        sortOrder,
        filter
      ).path;

      stockReceiveService
        .getItems(
          storeType,
          type,
          status,
          id,
          itemCode,
          lotNumber,
          pageIndex,
          pageSize,
          sortBy,
          sortOrder,
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

  describe('verifyItem', () => {
    it('for L1/L2 should call PATCH api method with correct url and params', () => {
      spyOn(StockReceiveItemHelper, 'getItems').and.returnValue({});
      const storeType = 'L1';
      const type = 'FAC_BTQ';
      const id = 1111;
      const itemId = '222';
      const itemUpdate: StockReceiveItemUpdate = {
        binCode: 'TestBinCode',
        binGroupCode: 'TestBinGroupCode',
        measuredWeight: 10,
        remarks: 'TestRemakrs',
        itemDetails: {}
      };

      const { path, params } = getStockReceiveVerifyItemEndpointUrl(
        storeType,
        type,
        id,
        itemId
      );

      stockReceiveService
        .verifyItem(storeType, type, id, itemId, itemUpdate)
        .subscribe();

      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + path
      );
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.params.toString()).toEqual(params.toString());
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.get('transferType')).toEqual(type);
      expect(request.request.url.includes(getStockReceiveUrl())).toBeTruthy();
      expect(request.request.body as Object).toEqual(
        JSON.stringify(itemUpdate)
      );
      request.flush({});
    });

    it('for L3 should call PATCH api method with correct url and params', () => {
      spyOn(StockReceiveItemHelper, 'getItems').and.returnValue({});
      const storeType = 'L3';
      const type = 'FAC_BTQ';
      const id = 1111;
      const itemId = '222';
      const itemUpdate: StockReceiveItemUpdate = {
        binCode: 'TestBinCode',
        binGroupCode: 'TestBinGroupCode',
        measuredWeight: 10,
        remarks: 'TestRemakrs',
        itemDetails: {}
      };

      const { path, params } = getStockReceiveVerifyItemEndpointUrl(
        storeType,
        type,
        id,
        itemId
      );

      stockReceiveService
        .verifyItem(storeType, type, id, itemId, itemUpdate)
        .subscribe();

      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + path
      );
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.params.toString()).toEqual(params.toString());
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.get('invoiceType')).toEqual(type);
      expect(
        request.request.url.includes(getPurchaseInvoiceUrl())
      ).toBeTruthy();
      expect(request.request.body as Object).toEqual(
        JSON.stringify(itemUpdate)
      );
      request.flush({});
    });

    it('should call stocks helper method with correct arguments', () => {
      spyOn(StockRecevieItemAdaptor, 'fromJson').and.returnValue({});
      const result = dummyItemsResponse[0];
      const storeType = 'L3';
      const type = 'FAC_BTQ';
      const id = 1111;
      const itemId = '222';
      const itemUpdate: StockReceiveItemUpdate = {
        binCode: 'TestBinCode',
        binGroupCode: 'TestBinGroupCode',
        measuredWeight: 10,
        remarks: 'TestRemakrs',
        itemDetails: {}
      };

      const path = getStockReceiveVerifyItemEndpointUrl(
        storeType,
        type,
        id,
        itemId
      ).path;

      stockReceiveService
        .verifyItem(storeType, type, id, itemId, itemUpdate)
        .subscribe();

      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + path
      );

      request.flush(result);
      expect(StockRecevieItemAdaptor.fromJson).toHaveBeenCalledWith(result, []);
    });

    it('should return data mapped by stocks helper', () => {
      const result = dummyItemsResponse[0];
      spyOn(StockRecevieItemAdaptor, 'fromJson').and.returnValue(result);

      const storeType = 'L3';
      const type = 'FAC_BTQ';
      const id = 1111;
      const itemId = '222';
      const itemUpdate: StockReceiveItemUpdate = {
        binCode: 'TestBinCode',
        binGroupCode: 'TestBinGroupCode',
        measuredWeight: 10,
        remarks: 'TestRemakrs',
        itemDetails: {}
      };

      const path = getStockReceiveVerifyItemEndpointUrl(
        storeType,
        type,
        id,
        itemId
      ).path;

      stockReceiveService
        .verifyItem(storeType, type, id, itemId, itemUpdate)
        .subscribe(data => {
          expect(data).toEqual(result);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush({});
    });
  });

  describe('updateAllItems', () => {
    it('for L1/L2 should call PATCH api method with correct url and params', () => {
      const storeType = 'L1';
      const type = 'FAC_BTQ';
      const id = 1111;
      const requestUpdate = {
        binCode: 'TestBinCode'
      };

      const { path, params } = getStockReceiveUpdateAllItemsEndpointUrl(
        storeType,
        type,
        id
      );

      stockReceiveService
        .updateAllItems(storeType, type, id, requestUpdate)
        .subscribe();

      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + path
      );
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.params.toString()).toEqual(params.toString());
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.get('transferType')).toEqual(type);
      expect(request.request.url.includes(getStockReceiveUrl())).toBeTruthy();
      expect(request.request.body as Object).toEqual(
        JSON.stringify(requestUpdate)
      );
      request.flush({});
    });
    it('for L3 should call PATCH api method with correct url and params', () => {
      const storeType = 'L3';
      const type = 'FAC_BTQ';
      const id = 1111;
      const requestUpdate = {
        binCode: 'TestBinCode'
      };

      const { path, params } = getStockReceiveUpdateAllItemsEndpointUrl(
        storeType,
        type,
        id
      );

      stockReceiveService
        .updateAllItems(storeType, type, id, requestUpdate)
        .subscribe();

      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + path
      );
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.params.toString()).toEqual(params.toString());
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.get('invoiceType')).toEqual(type);
      expect(
        request.request.url.includes(getPurchaseInvoiceUrl())
      ).toBeTruthy();
      expect(request.request.body as Object).toEqual(
        JSON.stringify(requestUpdate)
      );
      request.flush({});
    });
    it('should return data sent by the api', () => {
      const result = { isValid: true };

      const storeType = 'L3';
      const type = 'FAC_BTQ';
      const id = 1111;
      const requestUpdate = {
        binCode: 'TestBinCode'
      };

      const path = getStockReceiveUpdateAllItemsEndpointUrl(storeType, type, id)
        .path;

      stockReceiveService
        .updateAllItems(storeType, type, id, requestUpdate)
        .subscribe(data => {
          expect(data).toEqual(result);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush(result);
    });
  });

  describe('getStockReceiveHistory', () => {
    it('should call POST api method with correct url and params', () => {
      spyOn(StockReceiveStockHelper, 'getStocks').and.returnValue({});
      const data: StockReceiveHistory = {
        dateRangeType: 'TODAY',
        destDocNo: 63,
        destFiscalYear: 2020,
        endDate: 2,
        locationCode: 'FHJR',
        srcDocNo: 63,
        srcFiscalYear: 2020,
        startDate: 14,
        statuses: [],
        actionType: 'P',
        invoiceType: '0001'
      };

      const type = StockReceiveTypesEnum.FAC_BTQ;

      const pageIndex = 0;
      const pageSize = 0;
      const path = getStockReceiveHistoryEndPointUrl(pageIndex, pageSize, type, ['lastModifiedDate,DESC'])
        .path;

      stockReceiveService
        .getStockReceiveHistory(data, pageIndex, pageSize, type, ['lastModifiedDate,DESC'])
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });

    it('should call stocks helper method with correct arguments', () => {
      spyOn(StockReceiveStockHelper, 'getStocks').and.returnValue({});
      const data: StockReceiveHistory = {
        dateRangeType: 'TODAY',

        destDocNo: 63,
        destFiscalYear: 2020,
        endDate: 2,
        locationCode: 'FHJR',
        srcDocNo: 63,
        srcFiscalYear: 2020,
        startDate: 14,
        statuses: [],
        actionType: 'P',
        invoiceType: '0001'
      };
      const type = StockReceiveTypesEnum.FAC_BTQ;

      const pageIndex = 0;
      const pageSize = 0;
      const path = getStockReceiveHistoryEndPointUrl(pageIndex, pageSize, type, ['lastModifiedDate,DESC'])
        .path;

      stockReceiveService
        .getStockReceiveHistory(data, pageIndex, pageSize, type, ['lastModifiedDate,DESC'])
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush(dummyStockRequestResponse);
      expect(StockReceiveStockHelper.getStocks).toHaveBeenCalledWith(
        dummyStockRequestResponse,
        StockReceiveTypeFieldEnum.STN
      );
    });

    it('should return data mapped by stocks helper', () => {
      spyOn(StockReceiveStockHelper, 'getStocks').and.returnValue({
        stocks: dummyStockResponse,
        count: 10
      });

      const data: StockReceiveHistory = {
        dateRangeType: 'TODAY',

        destDocNo: 63,
        destFiscalYear: 2020,
        endDate: 2,
        locationCode: 'FHJR',
        srcDocNo: 63,
        srcFiscalYear: 2020,
        startDate: 14,
        statuses: [],
        actionType: 'P',
        invoiceType: '0001'
      };
      const type = StockReceiveTypesEnum.FAC_BTQ;
      const pageIndex = 0;
      const pageSize = 0;
      const path = getStockReceiveHistoryEndPointUrl(pageIndex, pageSize, type, ['lastModifiedDate,DESC'])
        .path;

      stockReceiveService
        .getStockReceiveHistory(data, pageIndex, pageSize, type, ['lastModifiedDate,DESC'])
        .subscribe(res => {
          expect(res.stocks).toEqual(dummyStockResponse);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush({});
    });
  });

  describe('getStockReceiveInvoiceHistory', () => {
    it('should call POST api method with correct url and params', () => {
      spyOn(StockReceiveStockHelper, 'getStocks').and.returnValue({});
      const data: StockReceiveHistory = {
        dateRangeType: 'TODAY',

        destDocNo: 63,
        destFiscalYear: 2020,
        endDate: 2,
        locationCode: 'FHJR',
        srcDocNo: 63,
        srcFiscalYear: 2020,
        startDate: 14,
        statuses: [],
        actionType: 'P',
        invoiceType: '0001'
      };
      const type = StockReceiveTypesEnum.FAC_BTQ;

      const pageIndex = 0;
      const pageSize = 0;
      const { params, path } = getStockReceiveCFAHistoryUrl(
        pageIndex,
        pageSize,
        type,
        ['lastModifiedDate,DESC']
      );

      stockReceiveService
        .getStockReceiveInvoiceHistory(data, pageIndex, pageSize, type, ['lastModifiedDate,DESC'])
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });

    it('should call stocks helper method with correct arguments', () => {
      spyOn(StockReceiveStockHelper, 'getStocks').and.returnValue({});
      const data: StockReceiveHistory = {
        dateRangeType: 'TODAY',

        destDocNo: 63,
        destFiscalYear: 2020,
        endDate: 2,
        locationCode: 'FHJR',
        srcDocNo: 63,
        srcFiscalYear: 2020,
        startDate: 14,
        statuses: [],
        actionType: 'P',
        invoiceType: '0001'
      };
      const type = StockReceiveTypesEnum.FAC_BTQ;
      const pageIndex = 0;
      const pageSize = 0;
      const path = getStockReceiveCFAHistoryUrl(pageIndex, pageSize, type, ['lastModifiedDate,DESC']).path;

      stockReceiveService
        .getStockReceiveInvoiceHistory(data, pageIndex, pageSize, type, ['lastModifiedDate,DESC'])
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush(dummyStockRequestResponse);
      expect(StockReceiveStockHelper.getStocks).toHaveBeenCalledWith(
        dummyStockRequestResponse,
        StockReceiveTypeFieldEnum.INVOICE
      );
    });

    it('should return data mapped by stocks helper', () => {
      spyOn(StockReceiveStockHelper, 'getStocks').and.returnValue({
        stocks: dummyStockResponse,
        count: 10
      });

      const data: StockReceiveHistory = {
        dateRangeType: 'TODAY',

        destDocNo: 63,
        destFiscalYear: 2020,
        endDate: 2,
        locationCode: 'FHJR',
        srcDocNo: 63,
        srcFiscalYear: 2020,
        startDate: 14,
        statuses: [],
        actionType: 'P',
        invoiceType: '0001'
      };
      const type = StockReceiveTypesEnum.FAC_BTQ;
      const pageIndex = 0;
      const pageSize = 0;
      const path = getStockReceiveCFAHistoryUrl(pageIndex, pageSize, type, ['lastModifiedDate,DESC']).path;

      stockReceiveService
        .getStockReceiveInvoiceHistory(data, pageIndex, pageSize, type, ['lastModifiedDate,DESC'])
        .subscribe(res => {
          expect(res.stocks).toEqual(dummyStockResponse);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush({});
    });
  });

  describe('getHistoryItems', () => {
    it('for L1/L2 it should call POST api method with correct url', () => {
      spyOn(StockReceiveItemHelper, 'getItems').and.returnValue({});
      const stockReceiveHistoryItems: StockReceiveHistoryItem = {
        binCodes: '37',
        binGroupCode: '71',
        itemCode: '2BA005179',
        lotNumber: 'FHJR',
        productCategories: '800-S01BDAA',
        productGroups: 'ATP',
        statuses: 'R'
      };
      const id = '01';
      const pageIndex = 0;
      const pageSize = 0;
      const isL1L2Store = true;
      const isL3Store = false;
      const sortBy = ['Gross wgt'];
      const sortOrder = 'LTH';
      const studdedProductGroups = [];
      const { params, path } = getStockReceiveHistroyItemsEndpointUrl(
        id,
        pageIndex,
        pageSize,
        sortBy,
        sortOrder
      );

      stockReceiveService
        .getHistoryItems(
          stockReceiveHistoryItems,
          id,
          pageIndex,
          pageSize,
          isL1L2Store,
          isL3Store,
          sortBy,
          sortOrder,
          studdedProductGroups
        )
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      expect(request.request.params.toString()).toEqual(params.toString());
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      request.flush({});
    });
    it('for L3 it should call POST api method with correct url', () => {
      spyOn(StockReceiveItemHelper, 'getItems').and.returnValue({});
      const stockReceiveHistoryItems: StockReceiveHistoryItem = {
        binCodes: '37',
        binGroupCode: '71',
        itemCode: '2BA005179',
        lotNumber: 'FHJR',
        productCategories: '800-S01BDAA',
        productGroups: 'ATP',
        statuses: 'R'
      };
      const id = '01';
      const pageIndex = 0;
      const pageSize = 0;
      const isL1L2Store = false;
      const isL3Store = true;
      const sortBy = ['Gross wgt'];
      const sortOrder = 'LTH';
      const studdedProductGroups = [];
      const { params, path } = getStockReceiveCFAHistroyItemsEndpointUrl(
        id,
        pageIndex,
        pageSize,
        sortBy,
        sortOrder
      );

      stockReceiveService
        .getHistoryItems(
          stockReceiveHistoryItems,
          id,
          pageIndex,
          pageSize,
          isL1L2Store,
          isL3Store,
          sortBy,
          sortOrder,
          studdedProductGroups
        )
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      expect(request.request.params.toString()).toEqual(params.toString());
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      request.flush({});
    });
    it('for L1/L2 it should call stocks helper method with correct arguments', () => {
      spyOn(StockReceiveItemHelper, 'getItems').and.returnValue({});
      const stockReceiveHistoryItems: StockReceiveHistoryItem = {
        binCodes: '37',
        binGroupCode: '71',
        itemCode: '2BA005179',
        lotNumber: 'FHJR',
        productCategories: '800-S01BDAA',
        productGroups: 'ATP',
        statuses: 'R'
      };
      const id = '01';
      const pageIndex = 0;
      const pageSize = 0;
      const isL1L2Store = true;
      const isL3Store = false;
      const sortBy = ['Gross wgt'];
      const sortOrder = 'LTH';
      const studdedProductGroups = [];
      const { params, path } = getStockReceiveHistroyItemsEndpointUrl(
        id,
        pageIndex,
        pageSize,
        sortBy,
        sortOrder
      );

      stockReceiveService
        .getHistoryItems(
          stockReceiveHistoryItems,
          id,
          pageIndex,
          pageSize,
          isL1L2Store,
          isL3Store,
          sortBy,
          sortOrder,
          studdedProductGroups
        )
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush(dummyItemsRequestResponse);
      expect(StockReceiveItemHelper.getItems).toHaveBeenCalledWith(
        dummyItemsRequestResponse,
        []
      );
    });
    it('for L3 it should call stocks helper method with correct arguments', () => {
      spyOn(StockReceiveItemHelper, 'getItems').and.returnValue({});
      const stockReceiveHistoryItems: StockReceiveHistoryItem = {
        binCodes: '37',
        binGroupCode: '71',
        itemCode: '2BA005179',
        lotNumber: 'FHJR',
        productCategories: '800-S01BDAA',
        productGroups: 'ATP',
        statuses: 'R'
      };
      const id = '01';
      const pageIndex = 0;
      const pageSize = 0;
      const isL1L2Store = false;
      const isL3Store = true;
      const sortBy = ['Gross wgt'];
      const sortOrder = 'LTH';
      const studdedProductGroups = [];
      const { params, path } = getStockReceiveCFAHistroyItemsEndpointUrl(
        id,
        pageIndex,
        pageSize,
        sortBy,
        sortOrder
      );

      stockReceiveService
        .getHistoryItems(
          stockReceiveHistoryItems,
          id,
          pageIndex,
          pageSize,
          isL1L2Store,
          isL3Store,
          sortBy,
          sortOrder,
          studdedProductGroups
        )
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush(dummyItemsRequestResponse);
      expect(StockReceiveItemHelper.getItems).toHaveBeenCalledWith(
        dummyItemsRequestResponse,
        []
      );
    });
    it('for L1/L2 it should return data mapped by stocks helper', () => {
      const itemResult = dummyItemsResponse;
      const itemCount = 10;
      const result = { items: itemResult, count: itemCount };
      spyOn(StockReceiveItemHelper, 'getItems').and.returnValue(result);
      const stockReceiveHistoryItems: StockReceiveHistoryItem = {
        binCodes: '37',
        binGroupCode: '71',
        itemCode: '2BA005179',
        lotNumber: 'FHJR',
        productCategories: '800-S01BDAA',
        productGroups: 'ATP',
        statuses: 'R'
      };
      const id = '01';
      const pageIndex = 0;
      const pageSize = 0;
      const isL1L2Store = true;
      const isL3Store = false;
      const sortBy = ['Gross wgt'];
      const sortOrder = 'LTH';
      const studdedProductGroups = [];
      const { params, path } = getStockReceiveHistroyItemsEndpointUrl(
        id,
        pageIndex,
        pageSize,
        sortBy,
        sortOrder
      );

      stockReceiveService
        .getHistoryItems(
          stockReceiveHistoryItems,
          id,
          pageIndex,
          pageSize,
          isL1L2Store,
          isL3Store,
          sortBy,
          sortOrder,
          studdedProductGroups
        )
        .subscribe(data => {
          expect(data.items).toEqual(itemResult, []);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush({});
    });

    it('for L3 it should return data mapped by stocks helper', () => {
      const itemResult = dummyItemsResponse;
      const itemCount = 10;
      const result = { items: itemResult, count: itemCount };
      spyOn(StockReceiveItemHelper, 'getItems').and.returnValue(result);
      const stockReceiveHistoryItems: StockReceiveHistoryItem = {
        binCodes: '37',
        binGroupCode: '71',
        itemCode: '2BA005179',
        lotNumber: 'FHJR',
        productCategories: '800-S01BDAA',
        productGroups: 'ATP',
        statuses: 'R'
      };
      const id = '01';
      const pageIndex = 0;
      const pageSize = 0;
      const isL1L2Store = false;
      const isL3Store = true;
      const sortBy = ['Gross wgt'];
      const sortOrder = 'LTH';
      const studdedProductGroups = [];
      const { params, path } = getStockReceiveCFAHistroyItemsEndpointUrl(
        id,
        pageIndex,
        pageSize,
        sortBy,
        sortOrder
      );

      stockReceiveService
        .getHistoryItems(
          stockReceiveHistoryItems,
          id,
          pageIndex,
          pageSize,
          isL1L2Store,
          isL3Store,
          sortBy,
          sortOrder,
          studdedProductGroups
        )
        .subscribe(data => {
          expect(data.items).toEqual(itemResult, []);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush({});
    });
  });

  describe('confirmStn', () => {
    it('for L1/L2 should call PATCH api method with correct url and params', () => {
      spyOn(StockReceiveStockAdaptor, 'fromJson').and.returnValue({});
      const storeType = 'L1';
      const type = 'FAC_BTQ';
      const id = 1111;
      const confirmReceive: StockReceiveConfirmReceive = {
        courierReceivedDate: 'string',
        receivedDate: '25-02-2020',
        remarks: 'Remarks'
      };

      const { path, params } = getStockReceiveConfirmSTNEndpointUrl(
        storeType,
        type,
        id
      );

      stockReceiveService
        .confirmStn(storeType, type, id, confirmReceive)
        .subscribe();

      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + path
      );
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.params.toString()).toEqual(params.toString());
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.get('transferType')).toEqual(type);
      expect(request.request.url.includes(getStockReceiveUrl())).toBeTruthy();
      expect(request.request.body as Object).toEqual(
        JSON.stringify(confirmReceive)
      );
      request.flush({});
    });
    it('for L3 should call PATCH api method with correct url and params', () => {
      spyOn(StockReceiveStockAdaptor, 'fromJson').and.returnValue({});
      const storeType = 'L3';
      const type = 'FAC_BTQ';
      const id = 1111;
      const confirmReceive: StockReceiveConfirmReceive = {
        courierReceivedDate: 'string',
        receivedDate: '25-02-2020',
        remarks: 'Remarks'
      };

      const { path, params } = getStockReceiveConfirmSTNEndpointUrl(
        storeType,
        type,
        id
      );

      stockReceiveService
        .confirmStn(storeType, type, id, confirmReceive)
        .subscribe();

      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + path
      );
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.params.toString()).toEqual(params.toString());
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.get('invoiceType')).toEqual(type);
      expect(
        request.request.url.includes(getPurchaseInvoiceUrl())
      ).toBeTruthy();
      expect(request.request.body as Object).toEqual(
        JSON.stringify(confirmReceive)
      );
      request.flush({});
    });
    it('for L1/L2 should call stock adaptor method with correct arguments', () => {
      spyOn(StockReceiveStockAdaptor, 'fromJson').and.returnValue({});
      const storeType = 'L1';
      const type = 'FAC_BTQ';
      const id = 1111;
      const confirmReceive: StockReceiveConfirmReceive = {
        courierReceivedDate: 'string',
        receivedDate: '25-02-2020',
        remarks: 'Remarks'
      };

      const path = getStockReceiveConfirmSTNEndpointUrl(storeType, type, id)
        .path;

      stockReceiveService
        .confirmStn(storeType, type, id, confirmReceive)
        .subscribe();

      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + path
      );
      request.flush(dummyStockResponse);
      expect(StockReceiveStockAdaptor.fromJson).toHaveBeenCalledWith(
        dummyStockResponse,
        StockReceiveTypeFieldEnum.STN
      );
    });

    it('for L3 should call stock adaptor method with correct arguments', () => {
      spyOn(StockReceiveStockAdaptor, 'fromJson').and.returnValue({});
      const storeType = 'L3';
      const type = 'FAC_BTQ';
      const id = 1111;
      const confirmReceive: StockReceiveConfirmReceive = {
        courierReceivedDate: 'string',
        receivedDate: '25-02-2020',
        remarks: 'Remarks'
      };

      const path = getStockReceiveConfirmSTNEndpointUrl(storeType, type, id)
        .path;

      stockReceiveService
        .confirmStn(storeType, type, id, confirmReceive)
        .subscribe();

      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + path
      );
      request.flush(dummyStockResponse);
      expect(StockReceiveStockAdaptor.fromJson).toHaveBeenCalledWith(
        dummyStockResponse,
        StockReceiveTypeFieldEnum.INVOICE
      );
    });

    it('should return data mapped by stock adaptor', () => {
      const result = dummyStockResponse[0];
      spyOn(StockReceiveStockAdaptor, 'fromJson').and.returnValue(result);
      const storeType = 'L3';
      const type = 'FAC_BTQ';
      const id = 1111;
      const confirmReceive: StockReceiveConfirmReceive = {
        courierReceivedDate: 'string',
        receivedDate: '25-02-2020',
        remarks: 'Remarks'
      };

      const path = getStockReceiveConfirmSTNEndpointUrl(storeType, type, id)
        .path;

      stockReceiveService
        .confirmStn(storeType, type, id, confirmReceive)
        .subscribe(data => {
          expect(data).toEqual(result);
        });

      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + path
      );
      request.flush({});
    });
  });
});
