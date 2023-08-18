import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { OtherIssueService } from './other-issues.service';
import {
  OtherIssuedataModel,
  OtherIssueModel,
  RequestOtherIssueStockTransferNote,
  OtherIssuesItem,
  OtherIssuesCreateStockResponse,
  OtherReceiptsIssuesEnum,
  LoadOtherIssuesSTNCountPayload,
  AdjustmentSearchItemPayloadSuccess,
  ConfirmOtherStockIssueResponse
} from '@poss-web/shared/models';
import * as moment from 'moment';

import {
  OtherIssuesAdaptor,
  OtherIssuesDataHelper
} from '@poss-web/shared/util-adaptors';
import {
  getOtherStockIssueBySrcDocNoEndpointUrl,
  getOtherStockIssueByPaginationEndpointUrl,
  getOtherIssueSTNCountEndpointUrl,
  getOtherIssueItemsByPaginationEndpointUrl,
  searchOtherIssueDetailsItemsByPaginationEndpointUrl,
  getcreateOtherIssuesStockRequestEndpointUrl,
  getOtherIssueCreateItemsByPaginationEndpointUrl,
  searchOtherIssueCreateItemsByPaginationEndpointUrl,
  getCreateOtherIssueStockRequestItemsUrl,
  getupdateStockRequestCreateItemUrl,
  getupdateStockRequestUrl,
  getCreateOtherStockIssueItemsUrl,
  getConfirmOtherIssueUrl,
  getSearchAdjustmentEndpointUrl,
  getcreateOtherIssuesAdjustmentRequestEndpointUrl,
  getCancelStockRequestUrl,
  getPrintOtherIssuesEndpointUrl
} from '@poss-web/shared/util-api-service';
import { map } from 'rxjs/operators';

describe('OtherIssueService', () => {
  let httpTestingController: HttpTestingController;
  let otherIssueService: OtherIssueService;
  const apiUrl = 'http://localhost:3000';

  const dummyCount: LoadOtherIssuesSTNCountPayload = {
    pendingOtherIssuesSTNCount: 3,
    countData: [{ type: 'EXH', count: 3 }]
  };

  const dummmyIssueList: OtherIssuedataModel = {
    issueData: [
      {
        id: 4966,
        srcLocationCode: 'URB',
        destLocationCode: 'URB',
        status: 'APPROVED',
        weightUnit: 'gms',
        currencyCode: 'INR',
        srcDocNo: null,
        srcFiscalYear: null,
        srcDocDate: null,
        destDocNo: null,
        destDocDate: null,
        orderType: null,
        totalAvailableQuantity: 2,
        totalMeasuredQuantity: null,
        totalAvailableValue: 1264123.12,
        totalMeasuredValue: 0,
        totalAvailableWeight: 47.483,
        totalMeasuredWeight: null,
        reqDocDate: moment(1592288081939),
        reqDocNo: 48,
        reqLocationCode: 'URB',
        requestType: 'EXH',
        otherDetails: {
          type: 'approval',
          data: {
            approvalCode: '444',
            approvedBy: 're'
          }
        },
        carrierDetails: {
          type: 'address_exh',
          data: {
            address1: 'ff',
            address2: 'ff',
            city: 'banglore',
            town: 'kar',
            Designation: '',
            contactNo: 8105391994,
            emailId: '',
            employeeId: '',
            employeeName: '',
            pinCode: '123456'
          }
        }
      }
    ],
    totalElements: 1
  };
  const dummySearchPSV: AdjustmentSearchItemPayloadSuccess = {
    items: [
      {
        id: 1,
        itemCode: '512313CDYMAA00',
        lotNumber: '2JA005739',
        mfgDate: moment(1558895400000),
        productCategory: 'C',
        productGroup: '71',
        approvedQuantity: 1,
        isStudded: false,
        isUpdating: true,
        isUpdatingSuccess: false,
        issuedQuantity: 1,
        itemValue: 2,
        itemWeight: 3,
        measuredQuantity: 2,
        measuredValue: 1,
        measuredWeight: 1,
        orderType: '',
        productCategoryId: '',
        productGroupId: '',
        requestedQuantity: 3,
        totalQuantity: 3,
        totalValue: 12,
        totalWeight: 2,
        binCode: 'BEST DEAL',
        binGroupCode: 'STN',
        stdValue: 60103.55,
        stdWeight: 19.346,
        currencyCode: 'INR',
        weightUnit: 'gms',
        status: null,
        imageURL: '/productcatalogue/ProductImages/2313CDY.jpg',
        itemDetails: {},
        availableWeight: 19.346,
        availableValue: 60103.55,
        availableQuantity: 1,
        taxDetails:{}
      }
    ],
    count: 1
  };
  const dummySearchdata: OtherIssueModel[] = [
    {
      id: 4966,
      srcLocationCode: 'URB',
      destLocationCode: 'URB',
      status: 'APPROVED',
      weightUnit: 'gms',
      currencyCode: 'INR',
      srcDocNo: null,
      srcFiscalYear: null,
      srcDocDate: null,
      destDocNo: null,
      destDocDate: null,
      orderType: null,
      totalAvailableQuantity: 2,
      totalMeasuredQuantity: null,
      totalAvailableValue: 1264123.12,
      totalMeasuredValue: 0,
      totalAvailableWeight: 47.483,
      totalMeasuredWeight: null,
      reqDocDate: moment(1592288081939),
      reqDocNo: 48,
      reqLocationCode: 'URB',
      requestType: 'EXH',
      otherDetails: {
        type: 'approval',
        data: {
          approvalCode: '444',
          approvedBy: 're'
        }
      },
      carrierDetails: {
        type: 'address_exh',
        data: {
          address1: 'ff',
          address2: 'ff',
          city: 'banglore',
          town: 'kar',
          Designation: '',
          contactNo: 8105391994,
          emailId: '',
          employeeId: '',
          employeeName: '',
          pinCode: '123456'
        }
      }
    }
  ];

  const dummyConfirmIssueResponse: ConfirmOtherStockIssueResponse = {
    id: 8297,
    srcLocationCode: 'URB',
    destLocationCode: 'URB',
    status: 'ISSUED',
    weightUnit: 'gms',
    currencyCode: 'INR',
    srcLocationDescription: null,
    destLocationDescription: null,
    srcDocNo: 231,
    srcFiscalYear: 2020,
    srcDocDate: moment(1600681186289),
    destDocNo: null,
    courierDetails: '',
    destDocDate: null,
    orderType: null,
    totalAvailableQuantity: null,
    totalMeasuredQuantity: 0,
    totalAvailableValue: null,
    totalMeasuredValue: 0,
    totalAvailableWeight: null,
    totalMeasuredWeight: 0,
    transferType: 'ADJ',
    courierReceivedDate: null
  };

  const dummyCreateAdjustment: OtherIssueModel = {
    id: 5260,
    srcLocationCode: 'URB',
    destLocationCode: 'URB',
    status: 'APVL_PENDING',
    weightUnit: 'gms',
    currencyCode: 'INR',
    carrierDetails: null,
    otherDetails: null,
    reqLocationCode: null,
    remarks: null,
    srcDocNo: 517,
    srcFiscalYear: null,
    srcDocDate: moment(1600692426386),
    destDocNo: null,
    destDocDate: null,
    orderType: null,
    totalAvailableQuantity: 15,
    totalMeasuredQuantity: 15,
    totalAvailableValue: 7631640,
    totalMeasuredValue: 7631640,
    totalAvailableWeight: 321.9,
    totalMeasuredWeight: 321.9,
    reqDocNo: 517,
    reqDocDate: moment(1600692426386),
    requestType: 'FOC'
  };

  const dummysearchOtherIssueCreateItems: OtherIssuesItem[] = [
    {
      id: null,
      itemCode: '512219VGGQ2A00',
      lotNumber: '2EB000073',
      mfgDate: moment(1588703400000),
      productCategory: 'V',
      productGroup: '71',
      binCode: 'LOAN',
      binGroupCode: 'LOAN',
      stdValue: 160410,
      stdWeight: 46.186,
      currencyCode: 'INR',
      weightUnit: 'gms',
      status: 'OPEN',
      imageURL: '/productcatalogue/ProductImages/2219VGG.jpg',
      itemDetails: null,
      availableQuantity: 5,
      availableWeight: 230.93,
      availableValue: 802050,
      measuredQuantity: null,
      measuredWeight: null,
      measuredValue: null,
      orderType: null,
      approvedQuantity: null,
      isStudded: null,
      isUpdating: null,
      isUpdatingSuccess: null,
      issuedQuantity: null,
      itemValue: null,
      itemWeight: null,
      productCategoryId: null,
      productGroupId: null,
      requestedQuantity: null,
      totalQuantity: null,
      totalValue: null,
      totalWeight: null,
      totalElements: null,

      inventoryId: 123,
      taxDetails:{},
    }
  ];

  const dummyLoadIssue: RequestOtherIssueStockTransferNote = {
    currencyUnit: '',
    destLocationCode: '',
    id: 1,
    reqDocDate: moment(),
    reqDocNo: 1,
    reqLocationCode: '',
    requestType: '',
    srcLocationCode: '',
    status: '',
    totalAvailableQuantity: 1,
    totalAvailableValue: 1,
    totalAvailableWeight: 1,
    totalQuantity: 1,
    totalValue: 1,
    totalWeight: 1,
    weightUnit: '',
    carrierDetails: null,
    otherDetails: null
  };

  const dummyCreateStockResponse: OtherIssuesCreateStockResponse = {
    destLocationCode: '',
    id: 1,
    reqDocDate: moment(),
    reqDocNo: 1,
    srcLocationCode: '',
    status: '',
    totalQuantity: 1
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        OtherIssueService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    otherIssueService = TestBed.inject(OtherIssueService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(otherIssueService).toBeTruthy();
  });

  describe('getIssuesCount', () => {
    it('should call GET api method with correct url', () => {
      spyOn(OtherIssuesAdaptor, 'issuesSTNCountFromJson').and.returnValue({});
      const path = getOtherIssueSTNCountEndpointUrl();

      otherIssueService.getOtherIssuesSTNCount().subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });
    it('should call otherIssues Adaptor method with correct arguments', () => {
      spyOn(OtherIssuesAdaptor, 'issuesSTNCountFromJson').and.returnValue({});
      const path = getOtherIssueSTNCountEndpointUrl();

      otherIssueService.getOtherIssuesSTNCount().subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush(dummyCount);
      expect(OtherIssuesAdaptor.issuesSTNCountFromJson).toHaveBeenCalledWith(
        dummyCount
      );
    });

    it('should retun data mapped by otherissue Adaptor', () => {
      spyOn(OtherIssuesAdaptor, 'issuesSTNCountFromJson').and.returnValue(
        dummyCount
      );

      const path = getOtherIssueSTNCountEndpointUrl();

      otherIssueService.getOtherIssuesSTNCount().subscribe(data => {
        expect(data).toEqual(dummyCount);
      });

      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + path
      );
      request.flush({});
    });
  });

  describe('getIssues', () => {
    it('should call GET api method with correct url', () => {
      spyOn(OtherIssuesDataHelper, 'getOtherisssuesData').and.returnValue({});
      const requestType = 'EXH';
      const pageIndex = 0;
      const pageSize = 8;
      const path = getOtherStockIssueByPaginationEndpointUrl(
        requestType,
        pageIndex,
        pageSize
      );

      otherIssueService
        .getIssueList(requestType, pageIndex, pageSize)
        .subscribe();
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });
    it('should call otherIssues helper method with correct arguments', () => {
      spyOn(OtherIssuesDataHelper, 'getOtherisssuesData').and.returnValue({});
      const requestType = 'EXH';
      const pageIndex = 0;
      const pageSize = 8;
      const path = getOtherStockIssueByPaginationEndpointUrl(
        requestType,
        pageIndex,
        pageSize
      );

      otherIssueService
        .getIssueList(requestType, pageIndex, pageSize)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush(dummmyIssueList);
      expect(OtherIssuesDataHelper.getOtherisssuesData).toHaveBeenCalledWith(
        dummmyIssueList
      );
    });

    it('should retun data mapped by otherissue helper', () => {
      spyOn(OtherIssuesDataHelper, 'getOtherisssuesData').and.returnValue(
        dummmyIssueList
      );

      const requestType = 'EXH';
      const pageIndex = 0;
      const pageSize = 8;
      const path = getOtherStockIssueByPaginationEndpointUrl(
        requestType,
        pageIndex,
        pageSize
      );

      otherIssueService
        .getIssueList(requestType, pageIndex, pageSize)
        .subscribe(data => {
          expect(data).toEqual(dummmyIssueList);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush({});
    });
  });

  describe('searchIssues', () => {
    it('should call GET api method with correct url', () => {
      spyOn(OtherIssuesDataHelper, 'getOtherisssuesSearchData').and.returnValue(
        {}
      );

      const type = 'EXH';
      const reqDocNo = 48;

      const path = getOtherStockIssueBySrcDocNoEndpointUrl(reqDocNo, type);

      otherIssueService.searchIssueStocks(reqDocNo, type).subscribe();
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });

    it('should retun data mapped by otherissue helper', () => {
      spyOn(OtherIssuesDataHelper, 'getOtherisssuesSearchData').and.returnValue(
        dummySearchdata
      );

      const type = 'EXH';
      const reqDocNo = 48;

      const path = getOtherStockIssueBySrcDocNoEndpointUrl(reqDocNo, type);

      otherIssueService.searchIssueStocks(reqDocNo, type).subscribe(data => {
        expect(data).toEqual(dummySearchdata);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush({});
    });
  });
  describe('searchOtherIssueCreateItems', () => {
    it('should call GET api method with correct url', () => {
      spyOn(OtherIssuesAdaptor, 'OtherIssueItemfromJson').and.returnValue({});
      const reqtype = 'EXH';
      const reqDocNo = 48;
      const id = 12;
      const itemCode = '';
      const lotNumber = '';
      const studdedProductGroups = [];

      const path = searchOtherIssueCreateItemsByPaginationEndpointUrl(
        id,
        status,
        0,
        1,
        reqtype,
        itemCode,
        lotNumber
      );

      otherIssueService
        .searchOtherIssueCreateItems(
          id,
          itemCode,
          status,
          reqtype,
          lotNumber,
          studdedProductGroups
        )
        .subscribe();
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });

    it('should retun data mapped by otherissue helper', () => {
      spyOn(OtherIssuesAdaptor, 'OtherIssueItemfromJson').and.returnValue({});

      const reqtype = 'EXH';
      const reqDocNo = 48;
      const id = 12;
      const itemCode = '';
      const lotNumber = '';
      const studdedProductGroups = [];

      const path = searchOtherIssueCreateItemsByPaginationEndpointUrl(
        id,
        status,
        0,
        1,
        reqtype,
        itemCode,
        lotNumber
      );

      otherIssueService
        .searchOtherIssueCreateItems(
          id,
          itemCode,
          status,
          reqtype,
          lotNumber,
          studdedProductGroups
        )
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush(dummysearchOtherIssueCreateItems);
      expect(OtherIssuesAdaptor.OtherIssueItemfromJson).toHaveBeenCalledWith(
        dummysearchOtherIssueCreateItems,
        []
      );
    });

    it('should retun data mapped by otherissue Adaptor', () => {
      const id = 1234;
      const itemCode = '';
      const status = '';
      const reqtype = '';
      const lotNumber = '';
      const studdedProductGroups = [];
      spyOn(OtherIssuesAdaptor, 'OtherIssueItemfromJson').and.returnValue(
        dummysearchOtherIssueCreateItems
      );

      const path = searchOtherIssueCreateItemsByPaginationEndpointUrl(
        id,
        status,
        0,
        1,
        reqtype,
        itemCode,
        lotNumber
      );

      otherIssueService
        .searchOtherIssueCreateItems(
          id,
          itemCode,
          status,
          reqtype,
          lotNumber,
          studdedProductGroups
        )
        .subscribe(data => {
          expect(data).toEqual(dummysearchOtherIssueCreateItems);
        });

      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + path.path
      );
      request.flush({});
    });
  });

  describe('cancelRequest', () => {
    it('should call GET api method with correct url', () => {
      const id = 3192;
      const requestType = 'EXH';

      const path = getCancelStockRequestUrl(id, requestType);

      otherIssueService.cancelStockRequest(id, requestType).subscribe();
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });
  });

  describe('printIssue', () => {
    it('should call GET api method with correct url', () => {
      const id = 3192;
      const requestType = 'EXH';

      const path = getPrintOtherIssuesEndpointUrl(id, requestType);

      otherIssueService.printOtherIssue(id, requestType).subscribe();
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('text');

      request.flush({});
    });
  });

  describe('ConfirmIssue', () => {
    it('should call GET api method with correct url', () => {
      const id = 3192;
      const requestType = 'EXH';

      const carrierDetails = {
        type: '',
        data: ''
      };
      const remarks = '';
      const destinationLocationCode = '';

      spyOn(
        OtherIssuesAdaptor,
        'confirmOtherStockIssueResponseFromJson'
      ).and.returnValue({});
      const path = getConfirmOtherIssueUrl(id, requestType);

      otherIssueService
        .confirmOtherStockIssue(
          id,
          requestType,
          carrierDetails,
          remarks,
          destinationLocationCode
        )
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });
    it('should call otherIssues Adaptor method with correct arguments', () => {
      const id = 3192;
      const requestType = 'EXH';
      const carrierDetails = {
        type: '',
        data: ''
      };
      const remarks = '';
      const destinationLocationCode = '';

      spyOn(
        OtherIssuesAdaptor,
        'confirmOtherStockIssueResponseFromJson'
      ).and.returnValue({});

      const path = getConfirmOtherIssueUrl(id, requestType);
      otherIssueService
        .confirmOtherStockIssue(
          id,
          requestType,
          carrierDetails,
          remarks,
          destinationLocationCode
        )
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush(dummyConfirmIssueResponse);
      expect(
        OtherIssuesAdaptor.confirmOtherStockIssueResponseFromJson
      ).toHaveBeenCalledWith(dummyConfirmIssueResponse);
    });

    it('should retun data mapped by otherissue Adaptor', () => {
      const id = 3192;
      const requestType = 'EXH';
      const carrierDetails = {
        type: '',
        data: ''
      };
      const remarks = '';
      const destinationLocationCode = '';

      spyOn(
        OtherIssuesAdaptor,
        'confirmOtherStockIssueResponseFromJson'
      ).and.returnValue(dummyConfirmIssueResponse);
      const path = getConfirmOtherIssueUrl(id, requestType);
      otherIssueService
        .confirmOtherStockIssue(
          id,
          requestType,
          carrierDetails,
          remarks,
          destinationLocationCode
        )
        .subscribe(data => {
          expect(data).toEqual(dummyConfirmIssueResponse);
        });

      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + path.path
      );
      request.flush({});
    });
  });

  describe('searchInventory', () => {
    it('should call GET api method with correct url', () => {
      const variantCode = '';
      const lotNumber = '';
      const productGroups = [];
      const studdedProductGroups = [];
      spyOn(OtherIssuesAdaptor, 'searchedAdjustmentItems').and.returnValue({});
      const path = getSearchAdjustmentEndpointUrl(
        variantCode,
        lotNumber,
        productGroups
      );

      otherIssueService
        .searchAdjustmentItem(
          variantCode,
          lotNumber,
          productGroups,
          studdedProductGroups
        )
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });
    it('should retun data mapped by otherissue Adaptor', () => {
      const variantCode = '';
      const lotNumber = '';
      const productGroups = [];
      const studdedProductGroups = [];
      spyOn(OtherIssuesAdaptor, 'searchedAdjustmentItems').and.returnValue(
        dummySearchPSV
      );
      const path = getSearchAdjustmentEndpointUrl(
        variantCode,
        lotNumber,
        productGroups
      );

      otherIssueService
        .searchAdjustmentItem(
          variantCode,
          lotNumber,
          productGroups,
          studdedProductGroups
        )

        .subscribe(data => {
          expect(data).toEqual(dummySearchPSV);
        });

      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + path.path
      );
      request.flush({});
    });
  });

  describe('createStockRequestAdjustment', () => {
    it('should call GET api method with correct url', () => {
      const reqType = 'ADJ';
      const approvalDetails = { data: { approvalCode: '', approvedBy: '' } };
      const items = [];
      const remarks = 'ok';
      spyOn(OtherIssuesAdaptor, 'OtherIssueDatafromJson').and.returnValue({});
      const path = getcreateOtherIssuesAdjustmentRequestEndpointUrl(reqType);

      otherIssueService
        .createStockRequestAdjustment(reqType, approvalDetails, items, remarks)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });
    it('should call otherIssues Adaptor method with correct arguments', () => {
      spyOn(OtherIssuesAdaptor, 'OtherIssueDatafromJson').and.returnValue({});
      const reqType = 'ADJ';
      const approvalDetails = { data: { approvalCode: '', approvedBy: '' } };
      const items = [];
      const remarks = 'ok';

      const path = getcreateOtherIssuesAdjustmentRequestEndpointUrl(reqType);

      otherIssueService
        .createStockRequestAdjustment(reqType, approvalDetails, items, remarks)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush(dummyCreateAdjustment);
      expect(OtherIssuesAdaptor.OtherIssueDatafromJson).toHaveBeenCalledWith(
        dummyCreateAdjustment
      );
    });

    it('should retun data mapped by otherissue Adaptor', () => {
      const reqType = 'ADJ';
      const approvalDetails = { data: { approvalCode: '', approvedBy: '' } };
      const items = [];
      const remarks = 'ok';
      spyOn(OtherIssuesAdaptor, 'OtherIssueDatafromJson').and.returnValue(
        dummyCreateAdjustment
      );
      const path = getcreateOtherIssuesAdjustmentRequestEndpointUrl(reqType);

      otherIssueService
        .createStockRequestAdjustment(reqType, approvalDetails, items, remarks)
        .subscribe(data => {
          expect(data).toEqual(dummyCreateAdjustment);
        });

      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + path.path
      );
      request.flush({});
    });
  });

  describe('createOtherIssueStockRequestItems', () => {
    it('should call GET api method with correct url', () => {
      const id = 3192;
      const requestType = 'EXH';
      const issueItems = [];

      const path = getCreateOtherIssueStockRequestItemsUrl(id, requestType);

      otherIssueService
        .createOtherIssueStockRequestItems(id, issueItems, requestType)
        .subscribe();
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });
  });

  describe('createOtherStockIssueItems', () => {
    it('should call GET api method with correct url', () => {
      const id = 3192;
      const requestType = 'EXH';
      const issueItems = [];

      const path = getCreateOtherStockIssueItemsUrl(id, requestType);

      otherIssueService
        .createOtherStockIssueItems(id, issueItems, requestType)
        .subscribe();
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });
  });

  describe('removeOtherIssueStockRequestItems', () => {
    it('should call GET api method with correct url', () => {
      const id = 3192;
      const requestType = 'EXH';
      const itemid = 1234;

      const value = [];

      const path = getCreateOtherIssueStockRequestItemsUrl(id, requestType);

      otherIssueService
        .removeOtherIssueStockRequestItems(id, itemid, requestType)
        .subscribe();
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PUT');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });
  });

  describe('updateStockRequestCreateItem', () => {
    it('should call GET api method with correct url', () => {
      const id = 3192;
      const requestType = 'EXH';
      const itemid = 1234;

      const value = [];

      const path = getupdateStockRequestCreateItemUrl(id, itemid, requestType);

      otherIssueService
        .updateStockRequestCreateItem(id, itemid, requestType, value)
        .subscribe();
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });
  });

  describe('updateStockRequest', () => {
    it('should call GET api method with correct url', () => {
      const id = 3192;
      const requestType = 'EXH';
      const carrierDetails = [];
      const approvalDetails = [];
      const remarks = '';
      const status = '';

      const path = getupdateStockRequestUrl(id, requestType);

      otherIssueService
        .updateStockRequest(
          id,
          requestType,
          carrierDetails,
          approvalDetails,
          remarks,
          status
        )
        .subscribe();
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });
  });

  describe('searchOtherIssueDetailsItems', () => {
    it('should call GET api method with correct url', () => {
      const id = 1234;
      const itemCode = '';
      const status = '';
      const reqtype = '';
      const lotNumber = '';
      const studdedProductGroups = [];
      spyOn(OtherIssuesAdaptor, 'OtherIssueItemfromJson').and.returnValue({});
      const path = searchOtherIssueDetailsItemsByPaginationEndpointUrl(
        id,
        status,
        0,
        1,
        reqtype,
        itemCode,
        lotNumber
      );

      otherIssueService
        .searchOtherIssueDetailsItems(
          id,
          itemCode,
          status,
          reqtype,
          lotNumber,
          studdedProductGroups
        )
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });
    it('should call otherIssues Adaptor method with correct arguments', () => {
      const id = 1234;
      const itemCode = '';
      const status = '';
      const reqtype = '';
      const lotNumber = '';
      const studdedProductGroups = [];
      spyOn(OtherIssuesAdaptor, 'OtherIssueItemfromJson').and.returnValue({});
      const path = searchOtherIssueDetailsItemsByPaginationEndpointUrl(
        id,
        status,
        0,
        1,
        reqtype,
        itemCode,
        lotNumber
      );

      otherIssueService
        .searchOtherIssueDetailsItems(
          id,
          itemCode,
          status,
          reqtype,
          lotNumber,
          studdedProductGroups
        )
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush(dummysearchOtherIssueCreateItems);
      expect(OtherIssuesAdaptor.OtherIssueItemfromJson).toHaveBeenCalledWith(
        dummysearchOtherIssueCreateItems,
        []
      );
    });

    it('should retun data mapped by otherissue Adaptor', () => {
      const id = 1234;
      const itemCode = '';
      const status = '';
      const reqtype = '';
      const lotNumber = '';
      const studdedProductGroups = [];
      spyOn(OtherIssuesAdaptor, 'OtherIssueItemfromJson').and.returnValue(
        dummysearchOtherIssueCreateItems
      );
      const path = searchOtherIssueDetailsItemsByPaginationEndpointUrl(
        id,
        status,
        0,
        1,
        reqtype,
        itemCode,
        lotNumber
      );

      otherIssueService
        .searchOtherIssueDetailsItems(
          id,
          itemCode,
          status,
          reqtype,
          lotNumber,
          studdedProductGroups
        )
        .subscribe(data => {
          expect(data).toEqual(dummysearchOtherIssueCreateItems);
        });

      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + path.path
      );
      request.flush({});
    });
  });

  describe('getOtherIssuesCreateItemsCount', () => {
    it('should call GET api method with correct url and params', () => {
      const storeType = 'L1';
      const type = 'EXH';
      const id = 11;
      const pageIndex = 0;
      const pageSize = 1;
      const url1 = getOtherIssueCreateItemsByPaginationEndpointUrl(
        id,
        OtherReceiptsIssuesEnum.OPEN,
        0,
        1,
        type
      );

      const url2 = getOtherIssueCreateItemsByPaginationEndpointUrl(
        id,
        OtherReceiptsIssuesEnum.OPEN,
        0,
        1,
        type
      );

      otherIssueService.getOtherIssuesCreateItemsCount(type, id).subscribe();

      const request1 = httpTestingController.expectOne(req => {
        return true;
      });

      expect(request1.cancelled).toBeFalsy();
      expect(request1.request.method).toEqual('GET');
      expect(request1.request.responseType).toEqual('json');

      request1.flush({});

      const request2 = httpTestingController.expectOne(req => true);

      expect(request2.cancelled).toBeFalsy();
      expect(request2.request.method).toEqual('GET');
      expect(request2.request.responseType).toEqual('json');

      request2.flush({});
    });

    it('should call GET api method with correct url and params', () => {
      const storeType = 'L3';
      const type = 'EXH';
      const id = 11;
      const pageIndex = 0;
      const pageSize = 1;
      const url1 = getOtherIssueCreateItemsByPaginationEndpointUrl(
        id,
        OtherReceiptsIssuesEnum.OPEN,
        0,
        1,
        type
      );

      const url2 = getOtherIssueCreateItemsByPaginationEndpointUrl(
        id,
        OtherReceiptsIssuesEnum.OPEN,
        0,
        1,
        type
      );

      otherIssueService.getOtherIssuesCreateItemsCount(type, id).subscribe();

      const request1 = httpTestingController.expectOne(req => true);
      expect(request1.cancelled).toBeFalsy();
      expect(request1.request.method).toEqual('GET');
      expect(request1.request.responseType).toEqual('json');

      request1.flush({});

      const request2 = httpTestingController.expectOne(req => true);
      expect(request2.cancelled).toBeFalsy();
      expect(request2.request.method).toEqual('GET');
      expect(request2.request.responseType).toEqual('json');

      request2.flush({});
    });
  });

  describe('getOtherIssueCreateItems', () => {
    it('should call GET api method with correct url', () => {
      const id = 1234;
      const status = '';
      const pageIndex = 0;
      const pageSize = 1;
      const reqtype = 'EXH';

      spyOn(OtherIssuesAdaptor, 'OtherIssueItemfromJson').and.returnValue({});
      const path = getOtherIssueCreateItemsByPaginationEndpointUrl(
        id,
        status,
        pageIndex,
        pageSize,
        reqtype
      );

      otherIssueService
        .getOtherIssueCreateItems(id, status, pageIndex, pageSize, reqtype)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });
    it('should call otherIssues Adaptor method with correct arguments', () => {
      const id = 1234;
      const itemCode = '';
      const status = '';
      const reqtype = '';
      const lotNumber = '';

      const sort = new Map();

      const filter = [];
      const studdedProductGroups = [];

      spyOn(OtherIssuesAdaptor, 'OtherIssueItemfromJson').and.returnValue({});
      const path = getOtherIssueCreateItemsByPaginationEndpointUrl(
        id,
        status,
        0,
        1,
        reqtype,
        itemCode,
        lotNumber
      );

      otherIssueService
        .getOtherIssueCreateItems(
          id,
          status,
          0,
          1,
          reqtype,
          itemCode,
          lotNumber,
          sort,
          filter,
          studdedProductGroups
        )
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush(dummysearchOtherIssueCreateItems);
      expect(OtherIssuesAdaptor.OtherIssueItemfromJson).toHaveBeenCalledWith(
        dummysearchOtherIssueCreateItems,
        studdedProductGroups
      );
    });

    it('should retun data mapped by otherissue Adaptor', () => {
      const id = 1234;
      const itemCode = '';
      const status = '';
      const reqtype = '';
      const lotNumber = '';

      spyOn(OtherIssuesAdaptor, 'OtherIssueItemfromJson').and.returnValue(
        dummysearchOtherIssueCreateItems
      );
      const path = getOtherIssueCreateItemsByPaginationEndpointUrl(
        id,
        status,
        0,
        1,
        reqtype,
        itemCode,
        lotNumber
      );

      otherIssueService
        .getOtherIssueCreateItems(
          id,
          status,
          0,
          1,
          itemCode,
          reqtype,
          lotNumber
        )

        .subscribe(data => {
          expect(data).toEqual(dummysearchOtherIssueCreateItems);
        });

      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + path.path
      );
      request.flush({});
    });
  });

  describe('getOtherIssuesItems', () => {
    it('should call GET api method with correct url', () => {
      const id = 1234;
      const status = '';
      const pageIndex = 0;
      const pageSize = 1;
      const reqtype = 'EXH';

      spyOn(OtherIssuesAdaptor, 'OtherIssueItemfromJson').and.returnValue({});
      const path = getOtherIssueItemsByPaginationEndpointUrl(
        id,
        status,
        pageIndex,
        pageSize,
        reqtype
      );

      otherIssueService
        .getOtherIssuesItems(id, status, pageIndex, pageSize, reqtype)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });
    it('should call otherIssues Adaptor method with correct arguments', () => {
      const id = 1234;
      const itemCode = '';
      const status = '';
      const reqtype = '';
      const lotNumber = '';

      const sort = new Map();

      const filter = [];
      const studdedProductGroups = [];

      spyOn(OtherIssuesAdaptor, 'OtherIssueItemfromJson').and.returnValue({});
      const path = getOtherIssueItemsByPaginationEndpointUrl(
        id,
        status,
        0,
        1,
        reqtype,
        itemCode,
        lotNumber
      );

      otherIssueService
        .getOtherIssuesItems(
          id,
          status,
          0,
          1,
          reqtype,
          itemCode,
          lotNumber,
          sort,
          filter,
          studdedProductGroups
        )
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush(dummysearchOtherIssueCreateItems);
      expect(OtherIssuesAdaptor.OtherIssueItemfromJson).toHaveBeenCalledWith(
        dummysearchOtherIssueCreateItems,
        studdedProductGroups
      );
    });

    it('should retun data mapped by otherissue Adaptor', () => {
      const id = 1234;
      const itemCode = '';
      const status = '';
      const reqtype = '';
      const lotNumber = '';

      spyOn(OtherIssuesAdaptor, 'OtherIssueItemfromJson').and.returnValue(
        dummysearchOtherIssueCreateItems
      );
      const path = getOtherIssueItemsByPaginationEndpointUrl(
        id,
        status,
        0,
        1,
        reqtype,
        itemCode,
        lotNumber
      );

      otherIssueService
        .getOtherIssuesItems(id, status, 0, 1, itemCode, reqtype, lotNumber)

        .subscribe(data => {
          expect(data).toEqual(dummysearchOtherIssueCreateItems);
        });

      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + path.path
      );
      request.flush({});
    });
  });

  describe('getOtherStockIssue', () => {
    it('should call GET api method with correct url', () => {
      const reqDocNo = 0;
      const requestType = '';

      spyOn(
        OtherIssuesAdaptor,
        'requestStockTransferNoteFromJson'
      ).and.returnValue({});
      const path = getOtherStockIssueBySrcDocNoEndpointUrl(
        reqDocNo,
        requestType
      );

      otherIssueService.getOtherStockIssue(reqDocNo, requestType).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });
    it('should call otherIssues Adaptor method with correct arguments', () => {
      const reqDocNo = 0;
      const requestType = '';

      spyOn(
        OtherIssuesAdaptor,
        'requestStockTransferNoteFromJson'
      ).and.returnValue({});
      const path = getOtherStockIssueBySrcDocNoEndpointUrl(
        reqDocNo,
        requestType
      );

      otherIssueService.getOtherStockIssue(reqDocNo, requestType).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush(dummyLoadIssue);
      expect(
        OtherIssuesAdaptor.requestStockTransferNoteFromJson
      ).toHaveBeenCalledWith(dummyLoadIssue);
    });

    it('should retun data mapped by otherissue Adaptor', () => {
      const reqDocNo = 0;
      const requestType = '';

      spyOn(
        OtherIssuesAdaptor,
        'requestStockTransferNoteFromJson'
      ).and.returnValue(dummyLoadIssue);
      const path = getOtherStockIssueBySrcDocNoEndpointUrl(
        reqDocNo,
        requestType
      );

      otherIssueService
        .getOtherStockIssue(reqDocNo, requestType)

        .subscribe(data => {
          expect(data).toEqual(dummyLoadIssue);
        });

      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + path.path
      );
      request.flush({});
    });
  });

  describe('createOtherIssuesStockRequest', () => {
    it('should call GET api method with correct url', () => {
      const reqDocNo = 0;
      const requestType = '';

      spyOn(
        OtherIssuesAdaptor,
        'requestStockTransferNoteFromJson'
      ).and.returnValue({});
      const path = getcreateOtherIssuesStockRequestEndpointUrl(requestType);

      otherIssueService.createOtherIssuesStockRequest(requestType).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });
    it('should call otherIssues Adaptor method with correct arguments', () => {
      const reqDocNo = 0;
      const requestType = '';

      spyOn(
        OtherIssuesAdaptor,
        'createOtherIssueStockRequestFromJson'
      ).and.returnValue({});
      const path = getcreateOtherIssuesStockRequestEndpointUrl(requestType);

      otherIssueService.createOtherIssuesStockRequest(requestType).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush(dummyCreateStockResponse);
      expect(
        OtherIssuesAdaptor.createOtherIssueStockRequestFromJson
      ).toHaveBeenCalledWith(dummyCreateStockResponse);
    });

    it('should retun data mapped by otherissue Adaptor', () => {
      const reqDocNo = 0;
      const requestType = '';

      spyOn(
        OtherIssuesAdaptor,
        'createOtherIssueStockRequestFromJson'
      ).and.returnValue(dummyCreateStockResponse);
      const path = getcreateOtherIssuesStockRequestEndpointUrl(requestType);

      otherIssueService
        .createOtherIssuesStockRequest(requestType)

        .subscribe(data => {
          expect(data).toEqual(dummyCreateStockResponse);
        });

      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + path.path
      );
      request.flush({});
    });
  });
});
