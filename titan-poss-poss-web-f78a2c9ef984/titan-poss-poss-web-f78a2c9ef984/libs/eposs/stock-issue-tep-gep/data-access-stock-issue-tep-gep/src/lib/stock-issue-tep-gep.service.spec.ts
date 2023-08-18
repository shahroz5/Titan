import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import {
  CreateStockIssueResponse,
  StockIssueItem
} from '@poss-web/shared/models';
import {
  StockIssueTEPGEPAdaptor,
  StockIssueTEPGEPHelper
} from '@poss-web/shared/util-adaptors';
import {
  getCreateStockIssueItemsUrl,
  getCreateStockIssueUrl,
  getStockIssueItemsCountUrl,
  getStockIssueItemsUrl,
  updateStockIssueUrl
} from '@poss-web/shared/util-api-service';
import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import * as moment from 'moment';
import { StockIssueTepGepService } from './stock-issue-tep-gep.service';

describe('stockIssueTepGepService ', () => {
  let httpTestingController: HttpTestingController;
  let stockIssueTepGepService: StockIssueTepGepService;
  const APIUrl = 'http://localhost:3000';

  const createStockIssueResponse: CreateStockIssueResponse = {
    id: 1,
    srcLocationCode: 'ABO',
    destLocationCode: 'FHJR',
    status: 'OPEN',
    weightUnit: 'gms',
    currencyCode: 'INR',
    srcDocNo: 1001,
    srcFiscalYear: 100,
    srcDocDate: moment(),
    destDocNo: 2001,
    destDocDate: moment(),
    orderType: 'R',
    totalAvailableQuantity: 5,
    totalMeasuredQuantity: 4,
    totalAvailableValue: 50,
    totalMeasuredValue: 60,
    totalAvailableWeight: 12,
    totalMeasuredWeight: 13,
    // for l1/l2
    transferType: 'TEP_PLAIN',
    // for l3
    invoiceType: 'TEP_PLAIN',
    // for l1/l2
    courierReceivedDate: moment(),
    courierDetails: {},
    // for l3
    issuedRemarks: 'remarks'
  };

  const itemsResponse: StockIssueItem[] = [
    {
      id: 1,
      itemCode: '21212121212921',
      lotNumber: '1234567',
      mfgDate: moment(),
      productCategory: 'P',
      productGroup: 'Plain',
      binCode: 'A',
      binGroupCode: 'B',
      stdValue: 120,
      stdWeight: 130,
      currencyCode: 'INR',
      weightUnit: 'gms',
      status: 'OPEN,',
      imageURL: 'url',
      itemDetails: {},
      availableQuantity: 10,
      availableWeight: 100,
      availableValue: 11,
      measuredQuantity: 20,
      measuredWeight: 200,
      measuredValue: 22,
      orderType: 'R',
      inventoryId: '100',
      productCategoryDesc: 'gold',
      productGroupDesc: 'plain',
      // for l3
      remarks: 'remarks',
      totalElements: 12,
      isStudded: true,
      refDocDate: moment(),
      refDocNumber: 1,
      refDocType: 'TEP',
      taxDetails: null
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        StockIssueTepGepService,
        {
          provide: POSS_WEB_API_URL,
          useValue: APIUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    stockIssueTepGepService = TestBed.inject(StockIssueTepGepService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(StockIssueTepGepService).toBeTruthy();
  });

  describe('createTransfer', () => {
    it('should call POST API method', () => {
      spyOn(
        StockIssueTEPGEPAdaptor,
        'createStockIssueResponseFromJson'
      ).and.returnValue({});
      const transferType = 'TEP_PLAIN';
      const storeType = 'L1';
      const path = getCreateStockIssueUrl(transferType, storeType).path;

      stockIssueTepGepService
        .createStockIssue(transferType, storeType)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === APIUrl + path;
      });

      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.url).toBe(APIUrl + path);
      request.flush({});
    });

    it('should call transfer helper method', () => {
      spyOn(
        StockIssueTEPGEPAdaptor,
        'createStockIssueResponseFromJson'
      ).and.returnValue({});
      const transferType = 'TEP_PLAIN';
      const storeType = 'L1';
      const path = getCreateStockIssueUrl(transferType, storeType).path;

      stockIssueTepGepService
        .createStockIssue(transferType, storeType)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === APIUrl + path;
      });
      request.flush(createStockIssueResponse);
      expect(
        StockIssueTEPGEPAdaptor.createStockIssueResponseFromJson
      ).toHaveBeenCalledWith(createStockIssueResponse);
    });

    it('should return mapped data', () => {
      spyOn(
        StockIssueTEPGEPAdaptor,
        'createStockIssueResponseFromJson'
      ).and.returnValue(createStockIssueResponse);
      const transferType = 'TEP_PLAIN';
      const storeType = 'L1';
      const path = getCreateStockIssueUrl(transferType, storeType).path;

      stockIssueTepGepService
        .createStockIssue(transferType, storeType)
        .subscribe(data => {
          expect(data).toEqual(createStockIssueResponse);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === APIUrl + path;
      });
      request.flush({});
    });
  });

  describe('updateStockIssue', () => {
    it('should call POST API method', () => {
      spyOn(
        StockIssueTEPGEPAdaptor,
        'createStockIssueResponseFromJson'
      ).and.returnValue({});
      const id = 1;
      const transferType = 'TEP_PLAIN';
      const storeType = 'L1';
      const remarks = 'remarks';
      const carrierDetails = {};
      const destinationLocationCode = 'ABO';
      const path = updateStockIssueUrl(id, transferType, storeType).path;

      stockIssueTepGepService
        .updateStockIssue(
          id,
          transferType,
          storeType,
          remarks,
          carrierDetails,
          destinationLocationCode
        )
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === APIUrl + path;
      });

      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.url).toBe(APIUrl + path);
      request.flush({});
    });

    it('should call PATCH API method', () => {
      spyOn(
        StockIssueTEPGEPAdaptor,
        'createStockIssueResponseFromJson'
      ).and.returnValue({});
      const id = 1;
      const transferType = 'TEP_PLAIN';
      const storeType = 'L3';
      const remarks = 'remarks';
      const carrierDetails = {};
      const cfaLocationCode = 'ABO';
      const path = updateStockIssueUrl(id, transferType, storeType).path;

      stockIssueTepGepService
        .updateStockIssue(
          id,
          transferType,
          storeType,
          remarks,
          carrierDetails,
          cfaLocationCode
        )
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === APIUrl + path;
      });

      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.url).toBe(APIUrl + path);
      request.flush({});
    });

    it('should call transfer helper method', () => {
      spyOn(
        StockIssueTEPGEPAdaptor,
        'createStockIssueResponseFromJson'
      ).and.returnValue({});
      const id = 1;
      const transferType = 'TEP_PLAIN';
      const storeType = 'L1';
      const remarks = 'remarks';
      const carrierDetails = {
        type: 'courier',
        data: 'any'
      };
      const locationCode = 'ABO';
      const path = updateStockIssueUrl(id, transferType, storeType).path;

      stockIssueTepGepService
        .updateStockIssue(
          id,
          transferType,
          storeType,
          remarks,
          carrierDetails,
          locationCode
        )
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === APIUrl + path;
      });
      request.flush(createStockIssueResponse);
      expect(
        StockIssueTEPGEPAdaptor.createStockIssueResponseFromJson
      ).toHaveBeenCalledWith(createStockIssueResponse);
    });

    it('should return mapped data', () => {
      spyOn(
        StockIssueTEPGEPAdaptor,
        'createStockIssueResponseFromJson'
      ).and.returnValue(createStockIssueResponse);
      const id = 1;
      const transferType = 'TEP_PLAIN';
      const storeType = 'L1';
      const remarks = 'remarks';
      const carrierDetails = {};
      const locationCode = 'ABO';
      const path = updateStockIssueUrl(id, transferType, storeType).path;

      stockIssueTepGepService
        .updateStockIssue(
          id,
          transferType,
          storeType,
          remarks,
          carrierDetails,
          locationCode
        )
        .subscribe(data => {
          expect(data).toEqual(createStockIssueResponse);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === APIUrl + path;
      });
      request.flush({});
    });
  });

  describe('createStockIssueItems', () => {
    it('should call POST API method', () => {
      const id = 12;
      const transferType = 'TEP_PLAIN';
      const storeType = 'L1';
      const issueItems = ['a'];
      const path = getCreateStockIssueItemsUrl(id, transferType, storeType)
        .path;

      stockIssueTepGepService
        .createStockIssueItems(id, transferType, storeType, issueItems)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === APIUrl + path;
      });

      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.url).toBe(APIUrl + path);
      request.flush({});
    });

    it('should call POST API method', () => {
      const id = 12;
      const transferType = 'TEP_PLAIN';
      const storeType = 'L3';
      const issueItems = ['a'];
      const path = getCreateStockIssueItemsUrl(id, transferType, storeType)
        .path;

      stockIssueTepGepService
        .createStockIssueItems(id, transferType, storeType, issueItems)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === APIUrl + path;
      });

      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.url).toBe(APIUrl + path);
      request.flush({});
    });

    it('should return mapped data', () => {
      const id = 12;
      const transferType = 'TEP_PLAIN';
      const storeType = 'L1';
      const issueItems = ['a'];
      const path = getCreateStockIssueItemsUrl(id, transferType, storeType)
        .path;

      stockIssueTepGepService
        .createStockIssueItems(id, transferType, storeType, issueItems)
        .subscribe(data => {
          expect(data).toEqual({});
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === APIUrl + path;
      });
      request.flush({});
    });
  });

  describe('updateStockTransfer', () => {
    it('should call PUT API method', () => {
      const id = 12;
      const transferType = 'TEP_PLAIN';
      const storeType = 'L1';
      const issueItems = ['a'];
      const path = getCreateStockIssueItemsUrl(id, transferType, storeType)
        .path;

      stockIssueTepGepService
        .updateAllStockIssueItems(id, transferType, storeType, issueItems)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === APIUrl + path;
      });

      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PUT');
      expect(request.request.url).toBe(APIUrl + path);
      request.flush({});
    });

    it('should return mapped data', () => {
      const id = 12;
      const transferType = 'TEP_PLAIN';
      const storeType = 'L1';
      const issueItems = ['a'];
      const path = getCreateStockIssueItemsUrl(id, transferType, storeType)
        .path;

      stockIssueTepGepService
        .createStockIssueItems(id, transferType, storeType, issueItems)
        .subscribe(data => {
          expect(data).toEqual({});
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === APIUrl + path;
      });
      request.flush({});
    });
  });

  describe('loadItems', () => {
    it('should call GET API method', () => {
      spyOn(StockIssueTEPGEPHelper, 'getStockIssueItems').and.returnValue({});
      const id = 1;
      const itemCode = '21213344908803';
      const lotNumber = '1234567';
      const transferType = 'TEP_PLAIN';
      const storeType = 'L1';
      const status = 'OPEN';
      const pageIndex = 0;
      const pageSize = 10;
      const sort = null;
      const filter = null;
      const path = getStockIssueItemsUrl(
        id,
        itemCode,
        lotNumber,
        transferType,
        storeType,
        status,
        pageIndex,
        pageSize,
        sort,
        filter
      );

      stockIssueTepGepService
        .loadStockIssueItems(
          id,
          itemCode,
          lotNumber,
          transferType,
          storeType,
          status,
          pageIndex,
          pageSize,
          sort,
          filter
        )
        .subscribe();

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
      spyOn(StockIssueTEPGEPHelper, 'getStockIssueItems').and.returnValue({});
      const id = 1;
      const itemCode = '21213344908803';
      const lotNumber = '1234567';
      const transferType = 'TEP_PLAIN';
      const storeType = 'L1';
      const status = 'OPEN';
      const pageIndex = 0;
      const pageSize = 10;
      const sort = null;
      const filter = null;
      const path = getStockIssueItemsUrl(
        id,
        itemCode,
        lotNumber,
        transferType,
        storeType,
        status,
        pageIndex,
        pageSize,
        sort,
        filter
      );
      stockIssueTepGepService
        .loadStockIssueItems(
          id,
          itemCode,
          lotNumber,
          transferType,
          storeType,
          status,
          pageIndex,
          pageSize,
          sort,
          filter
        )
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === APIUrl + path;
      });
      request.flush(itemsResponse);
      expect(StockIssueTEPGEPHelper.getStockIssueItems).toHaveBeenCalledWith(
        itemsResponse,
        []
      );
    });

    it('should return mapped data', () => {
      spyOn(StockIssueTEPGEPHelper, 'getStockIssueItems').and.returnValue(
        itemsResponse
      );
      const id = 1;
      const itemCode = '21213344908803';
      const lotNumber = '1234567';
      const transferType = 'TEP_PLAIN';
      const storeType = 'L1';
      const status = 'OPEN';
      const pageIndex = 0;
      const pageSize = 10;
      const sort = null;
      const filter = null;
      const path = getStockIssueItemsUrl(
        id,
        itemCode,
        lotNumber,
        transferType,
        storeType,
        status,
        pageIndex,
        pageSize,
        sort,
        filter
      );
      stockIssueTepGepService
        .loadStockIssueItems(
          id,
          itemCode,
          lotNumber,
          transferType,
          storeType,
          status,
          pageIndex,
          pageSize,
          sort,
          filter
        )
        .subscribe(data => {
          expect(data).toEqual(itemsResponse);
          expect(data.length).toEqual(1);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === APIUrl + path;
      });
      request.flush({});
    });
  });

  describe('getTotalCount', () => {
    it('should call GET API method', () => {
      const id = 1;
      const transferType = 'TEP_PLAIN';
      const storeType = 'L1';
      const status = 'OPEN';
      const path = getStockIssueItemsCountUrl(
        id,
        transferType,
        storeType,
        status
      ).path;
      stockIssueTepGepService
        .loadTotalCount(id, transferType, storeType, status)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === APIUrl + path;
      });

      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.url).toBe(APIUrl + path);
      request.flush({});
    });
  });

  describe('L1L2L3Store', () => {
    it('should be L1Store', () => {
      expect(stockIssueTepGepService.isL1L2Store('L1')).toEqual(true);
      expect(stockIssueTepGepService.isL1L2Store('L2')).toEqual(true);
      expect(stockIssueTepGepService.isL1L2Store('L3')).toEqual(false);
    });
    it('should be L2Store', () => {
      expect(stockIssueTepGepService.isL1L2Store('L2')).toEqual(true);
      expect(stockIssueTepGepService.isL1L2Store('L3')).toEqual(false);
      expect(stockIssueTepGepService.isL1L2Store('L1')).toEqual(true);
    });
    it('should be L3Store', () => {
      expect(stockIssueTepGepService.isL3Store('L3')).toEqual(true);
      expect(stockIssueTepGepService.isL3Store('L2')).toEqual(false);
      expect(stockIssueTepGepService.isL3Store('L1')).toEqual(false);
    });
  });
});
