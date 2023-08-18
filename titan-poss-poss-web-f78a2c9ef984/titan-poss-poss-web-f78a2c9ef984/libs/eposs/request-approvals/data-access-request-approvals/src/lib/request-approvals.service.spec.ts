import { RequestApprovalsService } from './request-approvals.service';
import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import * as moment from 'moment';

import {
  IbtApprovalsItemsHelper,
  BinRequestApprovalsItemHelper,
  IbtRequestApprovalsItemHelper,
  RequestApprovalsItemsAdaptor
} from '@poss-web/shared/util-adaptors';
import {
  getBinRequestApprovalsUrl,
  getLocationsUrl,
  getIbtRequestApprovalsUrl,
  getIbtCancelApprovalsUrl,
  getIbtsApprovalsUrl,
  getIbtsCancellationApprovalsUrl,
  getAllBinRequestApprovalsCountUrl,
  getAllIBTRequestApprovalsCountUrl,
  getIBTCancelRequestApprovalsCountUrl,
  updateIbtCancelUrl,
  getRequestByIdEndpointUrl,
  getAllIBTItemsRequestApprovalsCountUrl,
  updateBinRequestApprovalsCountUrl,
  updateIbtRequestApprovalsCountUrl,
  updateIbtApprovalsCountUrl,
  getCancelRequestByIdEndpointUrl,
  getAdjustmentApprovalsCountUrl,
  getLossApprovalsCountUrl,
  getLoanApprovalsCountUrl,
  getPsvApprovalsCountUrl,
  getExhibitionApprovalsCountUrl,
  getFocApprovalsCountUrl,
  getLocationCountUrl
} from '@poss-web/shared/util-api-service';
import {
  RequestApprovals,
  LoadRequestResponseItems,
  LoadRequestTotalCountSuccessPayload,
  LoadBinRequestResponse,
  RequestApprovalsItems
} from '@poss-web/shared/models';

describe(' RequestApprovalsService ', () => {
  let httpTestingController: HttpTestingController;
  let requestApprovalsService: RequestApprovalsService;
  const apiUrl = 'http://localhost:3000';
  const requestType = 'BTQ';

  const dummyItemList: RequestApprovals[] = [
    {
      id: 1234,
      reqDocNo: 7890,
      srcLocationCode: 'ABO',
      destLocationCode: 'URB',
      totalAcceptedQuantity: 10,
      totalAcceptedValue: 5,
      totalAcceptedWeight: 100,
      totalRequestedWeight: 60,
      totalRequestedQuantity: 10,
      totalRequestedValue: 89,
      weightUnit: 'gms',
      createdDate: null,
      currencyCode: 'INR',
      srcDocNo: 456789,
      totalIssuedQuantity: 89,
      status: 'APL_PENDING',
      reqDocDate: moment(),
      requestType: 'BTQ',
      totalIssuedValue: 87.9,
      totalIssuedWeight: 90,
      srcDocDate: moment(),
      otherDetails: {
        type: 'BTQ',
        data: {
          approvedCode: 'RTYUIO',
          approvedBy: 'Sush'
        }
      },
      carrierDetails: {
        type: 'BTQ',
        data: {
          employeeName: 'Hari',
          employeeId: '7889',
          emailId: 'ryi@gmail.com'
        }
      }
    },
    {
      id: 671234,
      reqDocNo: 767890,
      srcLocationCode: 'URB',
      destLocationCode: 'ABO',
      totalAcceptedQuantity: 104,
      totalAcceptedValue: 534,
      totalAcceptedWeight: 100,
      totalRequestedWeight: 60,
      totalRequestedQuantity: 10,
      totalRequestedValue: 89,
      weightUnit: 'gms',
      currencyCode: 'INR',
      createdDate: null,
      srcDocNo: 456789,
      totalIssuedQuantity: 89,
      status: 'APL_PENDING',
      reqDocDate: moment(),
      requestType: 'BTQ',
      totalIssuedValue: 87.9,
      totalIssuedWeight: 90,
      srcDocDate: moment(),
      otherDetails: {
        type: 'BTQ',
        data: {
          approvedCode: 'RTYUIO',
          approvedBy: 'Sush'
        }
      },
      carrierDetails: {
        type: 'BTQ',
        data: {
          employeeName: 'Hari',
          employeeId: '7889',
          emailId: 'ryi@gmail.com'
        }
      }
    }
  ];

  const dummyItemResponse = {
    results: dummyItemList,
    pageNumber: 0,
    pageSize: 8,
    totalPages: 1,
    totalElements: 6
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        RequestApprovalsService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    requestApprovalsService = TestBed.inject(RequestApprovalsService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(requestApprovalsService).toBeTruthy();
  });

  describe('getRequestItemGroups', () => {
    it('Request Approval List - should call GET api method with correct url and params', () => {
      spyOn(IbtRequestApprovalsItemHelper, 'getItems').and.returnValue({});
      const type = 'BTQ';
      const pageIndex = 0;
      const pageSize = 10;
      const locationCode = null;
      const reqDocNo = 57789;

      const { path, params } = getIbtsApprovalsUrl(
        locationCode,
        reqDocNo,
        type,
        pageIndex,
        pageSize
      );

      requestApprovalsService
        .getIbtsApprovals(locationCode, reqDocNo, type, pageIndex, pageSize)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.params.toString()).toEqual(params.toString());
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.get('requestType')).toEqual(type);
      expect(request.request.params.get('size').toString()).toEqual(
        pageSize.toString()
      );

      request.flush({});
    });
  });

  it('Request Approval List - should call GET api method with correct url and params', () => {
    spyOn(IbtRequestApprovalsItemHelper, 'getItems').and.returnValue({});
    const type = 'BTQ_BTQ';
    const pageIndex = 0;
    const pageSize = 10;
    const locationCode = null;
    const reqDocNo = 57789;
    const status = 'CNCL_APVL_PENDING';
    const sort = null;

    const { path, params } = getIbtsCancellationApprovalsUrl(
      locationCode,
      reqDocNo,
      type,
      pageIndex,
      pageSize,
      sort,
      status
    );

    requestApprovalsService
      .getIbtsCancellationApprovals(
        locationCode,
        reqDocNo,
        type,
        pageIndex,
        pageSize,
        sort,
        status
      )
      .subscribe();

    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + path;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('GET');

    expect(request.request.responseType).toEqual('json');
    expect(request.request.params.get('transferType')).toEqual(type);
    request.flush({});
  });

  it('Request Approval List - should call getIbtCancelRequestApprovalsItems api method with correct url and params', () => {
    spyOn(IbtApprovalsItemsHelper, 'getItems').and.returnValue({});

    const pageIndex = 0;
    const pageSize = 10;

    const itemCode = null;

    const id = 900;

    const isSelectedData = null;
    const { path, params } = getIbtCancelApprovalsUrl(
      id,
      requestType,
      pageIndex,
      pageSize
    );

    requestApprovalsService
      .getIbtCancelRequestApprovalsItems(
        id,
        requestType,
        pageIndex,
        pageSize,
        isSelectedData
      )
      .subscribe();

    const request = httpTestingController.expectOne(req => {
      console.log(req.url, apiUrl + path);
      return req.url === apiUrl + path;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('GET');
    expect(request.request.responseType).toEqual('json');
    expect(request.request.params.get('itemCode')).toEqual(itemCode);

    request.flush({});
  });

  it('Request Approval List - should call getIbtRequestApprovalsItems api method with correct url and params', () => {
    spyOn(IbtApprovalsItemsHelper, 'getItems').and.returnValue({});

    const pageIndex = 0;
    const pageSize = 10;
    const itemCode = '67888';
    const sortBy = 'reqDocDate';
    const sortOrder = 'ASC';
    const filter: { key: string; value: any[] }[] = [
      { key: 'test', value: ['test1', 'test2'] }
    ];

    const id = 900;

    const isSelectedData = null;
    const { path, params } = getIbtRequestApprovalsUrl(
      id,
      itemCode,
      requestType,
      pageIndex,
      sortBy,
      sortOrder,
      filter,
      pageSize
    );

    requestApprovalsService
      .getIbtRequestApprovalsItems(
        id,
        itemCode,
        requestType,
        pageIndex,
        sortBy,
        sortOrder,
        filter,
        pageSize,
        isSelectedData
      )
      .subscribe();

    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + path;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('GET');
    expect(request.request.responseType).toEqual('json');
    expect(request.request.params.get('itemCode')).toEqual(itemCode);

    request.flush({});
  });

  it('Request Approval List - should call getBinRequestApprovalsItems api method with correct url and params', () => {
    spyOn(BinRequestApprovalsItemHelper, 'getItems').and.returnValue({});

    const pageIndex = 0;
    const pageSize = 10;
    const locationCode = null;
    const reqDocNo = 4567890;
    const { path, params } = getBinRequestApprovalsUrl(
      locationCode,
      reqDocNo,
      pageIndex,
      pageSize
    );

    requestApprovalsService
      .getBinRequestApprovalsItems(locationCode, reqDocNo, pageIndex, pageSize)
      .subscribe();

    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + path;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('GET');
    expect(request.request.responseType).toEqual('json');
    expect(request.request.params.get('reqDocNo')).toEqual(reqDocNo.toString());

    request.flush({});
  });

  it('Request Approval List - should call getLocation api method with correct url and params', () => {
    const pageIndex = 0;
    const pageSize = 10;

    const { path, params } = getLocationsUrl(pageIndex, pageSize);

    requestApprovalsService.getLocation(pageIndex, pageSize).subscribe();

    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + path;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('GET');
    expect(request.request.responseType).toEqual('json');
    expect(request.request.params.get('page').toString()).toEqual(
      pageIndex.toString()
    );
    expect(request.request.params.get('size').toString()).toEqual(
      pageSize.toString()
    );

    request.flush({});
  });

  it('Request Approval List - should call getBinRequestApprovalsCount() api method with correct url and params', () => {
    const url = getAllBinRequestApprovalsCountUrl();

    requestApprovalsService.getBinRequestApprovalsCount().subscribe();

    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + url;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('GET');
    expect(request.request.responseType).toEqual('json');

    request.flush({});
  });

  it('Request Approval List - should call getIbtRequestApprovalsCount() api method with correct url and params', () => {
    const { path, params } = getAllIBTRequestApprovalsCountUrl();

    requestApprovalsService.getIbtRequestApprovalsCount().subscribe();

    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + path;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('GET');
    expect(request.request.responseType).toEqual('json');
    expect(request.request.params.toString()).toEqual(params.toString());
    expect(request.request.params.get('requestType')).toEqual('BTQ');
    expect(request.request.params.get('status')).toEqual('APVL_PENDING');

    request.flush({});
  });

  it('Request Approval List - should call getIbtCancelRequestApprovalsCount() api method with correct url and params', () => {
    const { path, params } = getIBTCancelRequestApprovalsCountUrl();

    requestApprovalsService.getIbtCancelRequestApprovalsCount().subscribe();

    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + path;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('GET');
    expect(request.request.responseType).toEqual('json');
    expect(request.request.params.toString()).toEqual(params.toString());
    expect(request.request.params.get('transferType')).toEqual('BTQ_BTQ');
    expect(request.request.params.get('status')).toEqual('CNCL_APVL_PENDING');

    request.flush({});
  });

  it('Request Approval List - should call getIbtItemsRequestApprovalsCount api method with correct url and params', () => {
    const payload = {
      requestType: 'BTQ',
      id: 3456789
    };

    const { path, params } = getAllIBTItemsRequestApprovalsCountUrl(payload);

    requestApprovalsService
      .getIbtItemsRequestApprovalsCount(payload)
      .subscribe();

    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + path;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('GET');
    expect(request.request.responseType).toEqual('json');
    expect(request.request.params.toString()).toEqual(params.toString());
    expect(request.request.params.get('requestType')).toEqual('BTQ');
    expect(request.request.params.get('status')).toEqual('APVL_PENDING');

    request.flush({});
  });

  it('Request Approval List - should call getLocation api method with correct url and params', () => {
    const pageIndex = 0;
    const pageSize = 10;

    const { path, params } = getLocationsUrl(pageIndex, pageSize);

    requestApprovalsService.getLocation(pageIndex, pageSize).subscribe();

    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + path;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('GET');
    expect(request.request.responseType).toEqual('json');
    expect(request.request.params.get('page').toString()).toEqual(
      pageIndex.toString()
    );
    expect(request.request.params.get('size').toString()).toEqual(
      pageSize.toString()
    );

    request.flush({});
  });
  it('Request Approval List - should call getLocationCount api method with correct url and params', () => {
    const url = getLocationCountUrl();

    requestApprovalsService.getLocationCount().subscribe();

    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + url;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('GET');
    expect(request.request.responseType).toEqual('json');

    request.flush({});
  });

  it('Request Approval List - should call  updateBinApprovalStatus api method with correct url and params', () => {
    const payload = {
      binRequestUpdateDto: {
        remarks: 'approved',
        status: 'APPROVED'
      },
      id: 1234
    };

    const url = updateBinRequestApprovalsCountUrl(payload.id);

    requestApprovalsService.updateBinApprovalStatus(payload).subscribe();

    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + url;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('PATCH');
    expect(request.request.responseType).toEqual('json');

    request.flush({});
  });

  it('Request Approval List - should call updateIbtApprovalStatus api method with correct url and params', () => {
    const payload = {
      itemUpdateDto: {
        quantity: 90,
        status: 'APPROVED'
      },
      id: 1234,
      itemId: '355IITT8'
    };

    const { path, params } = updateIbtRequestApprovalsCountUrl(
      payload.id,
      payload.itemId
    );

    requestApprovalsService.updateIbtApprovalStatus(payload).subscribe();

    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + path;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('PATCH');
    expect(request.request.responseType).toEqual('json');
    expect(request.request.params.get('requestType').toString()).toEqual('BTQ');

    request.flush({});
  });

  it('Request Approval List - should call updateIbtApproval api method with correct url and params', () => {
    const payload = {
      requestUpdateDto: {
        itemIds: [],
        remarks: 'APPROVED',
        status: 'APPROVED'
      },
      id: 1234,
      requestType: 'BTQ'
    };

    const { path, params } = updateIbtApprovalsCountUrl(
      payload.id,
      payload.requestType
    );

    requestApprovalsService.updateIbtApprovals(payload).subscribe();

    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + path;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('PATCH');
    expect(request.request.responseType).toEqual('json');
    expect(request.request.params.get('requestType').toString()).toEqual('BTQ');

    request.flush({});
  });

  it('Request Approval List - should call updateIbtCancelApprovals api method with correct url and params', () => {
    const payload = {
      stUpdateDto: {
        remarks: 'APPROVED',
        status: 'APPROVED'
      },
      id: 1234,
      transferType: 'BTQ_CANCEL'
    };

    const { path, params } = updateIbtCancelUrl(
      payload.id,
      payload.transferType
    );

    requestApprovalsService.updateIbtCancelApprovals(payload).subscribe();

    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + path;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('PATCH');
    expect(request.request.responseType).toEqual('json');
    expect(request.request.params.get('transferType').toString()).toEqual(
      'BTQ_CANCEL'
    );

    request.flush({});
  });

  it('Request Approval List - should call  getIbtsApprovals api method with correct url and params', () => {
    spyOn(IbtRequestApprovalsItemHelper, 'getItems').and.returnValue({});
    const locationCode = 'ABO';
    const reqDocNo = 456;
    const type = 'BTQ';
    const pageIndex = 0;
    const pageSize = 10;

    const { path, params } = getIbtsApprovalsUrl(
      locationCode,
      reqDocNo,
      type,
      pageIndex,
      pageSize
    );

    requestApprovalsService
      .getIbtsApprovals(locationCode, reqDocNo, type, pageIndex, pageSize)
      .subscribe();

    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + path;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('GET');
    expect(request.request.responseType).toEqual('json');
    expect(request.request.params.get('page').toString()).toEqual(
      pageIndex.toString()
    );
    expect(request.request.params.get('size').toString()).toEqual(
      pageSize.toString()
    );

    request.flush({});
  });

  it('Request Approval List - should call  getRequest api method with correct url and params', () => {
    spyOn(RequestApprovalsItemsAdaptor, 'fromJson').and.returnValue({});

    const payload = {
      id: 9789,
      requestType: 'BTQ'
    };

    const { path, params } = getRequestByIdEndpointUrl(
      payload.id,
      payload.requestType
    );

    requestApprovalsService.getRequest(payload).subscribe();

    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + path;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('GET');
    expect(request.request.responseType).toEqual('json');
    expect(request.request.params.get('requestType').toString()).toEqual('BTQ');

    request.flush({});
  });

  it('Request Approval List - should call  getCancelRequest api method with correct url and params', () => {
    spyOn(RequestApprovalsItemsAdaptor, 'fromJson').and.returnValue({});

    const payload = {
      id: 9789,
      requestType: 'BTQ'
    };

    const { path, params } = getCancelRequestByIdEndpointUrl(
      payload.id,
      payload.requestType
    );

    requestApprovalsService.getCancelRequest(payload).subscribe();

    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + path;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('GET');
    expect(request.request.responseType).toEqual('json');
    expect(request.request.params.get('transferType').toString()).toEqual(
      'BTQ'
    );

    request.flush({});
  });

  // it('Request Approval List - should call  getRequestsCount api method with correct url and params', () => {
  //   const adjCountUrl = getAdjustmentApprovalsCountUrl();

  //   const lossCountUrl = getLossApprovalsCountUrl();
  //   const loanCountUrl = getLoanApprovalsCountUrl();
  //   const focCountUrl = getFocApprovalsCountUrl();
  //   const exhCountUrl = getExhibitionApprovalsCountUrl();
  //   const psvCountUrl = getPsvApprovalsCountUrl();

  //   requestApprovalsService.getRequestsCount().subscribe();

  //   const adjRequest = httpTestingController.expectOne(req => {
  //     console.log(req.url, 'url');
  //     console.log(apiUrl + adjCountUrl, 'req');
  //     return req.url === apiUrl + adjCountUrl;
  //   });
  //   expect(adjRequest.cancelled).toBeFalsy();
  //   expect(adjRequest.request.method).toEqual('GET');
  //   expect(adjRequest.request.responseType).toEqual('json');
  //   adjRequest.flush({});

  //   const lossRequest = httpTestingController.expectOne(req => {
  //     console.log(req.url, 'url2');
  //     console.log(apiUrl + lossCountUrl, 'req2');
  //     return req.url === apiUrl + lossCountUrl;
  //   });
  //   expect(lossRequest.cancelled).toBeFalsy();
  //   expect(lossRequest.request.method).toEqual('GET');
  //   expect(lossRequest.request.responseType).toEqual('json');
  //   lossRequest.flush({});

  //   const loanRequest = httpTestingController.expectOne(req => {
  //     return req.url === apiUrl + loanCountUrl;
  //   });
  //   expect(loanRequest.cancelled).toBeFalsy();
  //   expect(loanRequest.request.method).toEqual('GET');
  //   expect(loanRequest.request.responseType).toEqual('json');
  //   loanRequest.flush({});

  //   const focRequest = httpTestingController.expectOne(req => {
  //     return req.url === apiUrl + focCountUrl;
  //   });
  //   expect(focRequest.cancelled).toBeFalsy();
  //   expect(focRequest.request.method).toEqual('GET');
  //   expect(focRequest.request.responseType).toEqual('json');
  //   focRequest.flush({});

  //   const exhRequest = httpTestingController.expectOne(req => {
  //     return req.url === apiUrl + exhCountUrl;
  //   });

  //   expect(exhRequest.cancelled).toBeFalsy();
  //   expect(exhRequest.request.method).toEqual('GET');
  //   expect(exhRequest.request.responseType).toEqual('json');
  //   exhRequest.flush({});

  //   const psvRequest = httpTestingController.expectOne(req => {
  //     return req.url === apiUrl + psvCountUrl;
  //   });

  //   expect(psvRequest.cancelled).toBeFalsy();
  //   expect(psvRequest.request.method).toEqual('GET');
  //   expect(psvRequest.request.responseType).toEqual('json');

  //   psvRequest.flush({});
  // });
});
