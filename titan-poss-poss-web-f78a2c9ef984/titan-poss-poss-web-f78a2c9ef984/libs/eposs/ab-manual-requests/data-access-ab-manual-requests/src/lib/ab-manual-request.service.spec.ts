import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { FileUploadDownloadPayload, TransactionTypeEnum } from '@poss-web/shared/models';
import { AbManulRequestAdaptor, CashMemoAdaptor } from '@poss-web/shared/util-adaptors';
import { ApiService, downloadManualBillUrl, getCashMemoEndPointUrl, getCmApprovalRequestUrl, getCmRequestDetailsUrl, getCmRequestListUrl, getProductDetailsEndPointUrl, manualBillListUrl } from '@poss-web/shared/util-api-service';
import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { AbManualRequestHelper } from 'libs/shared/util-adaptors/src/lib/helpers/ab-manual-request.helper';
import { AbManualRequestService } from './ab-manual-request.service';

describe('AbManualRequestService', () => {
  let abManualRequestService: AbManualRequestService;
  let httpTestingController: HttpTestingController;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;

  const apiUrl = 'http://localhost:3000'

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AbManualRequestService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    abManualRequestService = TestBed.inject(AbManualRequestService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  apiServiceSpy = jasmine.createSpyObj<ApiService>('ApiService', [
    'get',
    'post',
    'patch'
  ]);

  abManualRequestService = new AbManualRequestService(apiServiceSpy);

  it('should be created', () => {
    expect(abManualRequestService).toBeTruthy();
  })

  describe('getAbManualRequestList', () => {
    it('should call post api method with correct url and params', () => {
      const payload = {
        approvalStatus: 'PENDING',
        appliedFilters: {},
        pageIndex: 0,
        pageSize: 10,
        workflowType: 'workFlow'
      }
      spyOn(AbManualRequestHelper, 'getAbManualRequestList').and.returnValue({});
      const url = getCmRequestListUrl(
        payload.approvalStatus,
        payload.pageIndex,
        payload.pageSize,
        payload.workflowType
      )
      abManualRequestService.getAbManualRequestList(
        payload.approvalStatus,
        payload.appliedFilters,
        payload.pageIndex,
        payload.pageSize,
        payload.workflowType
      ).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    })
  })

  describe('getAbManualRequestDetails', () => {
    it('should call get api method with correct url and params', () => {
      const payload = {
        processId: 'processId',
        taskId: 'taskId',
        taskName: 'taskName',
        workflowType: 'workFlow'
      }
      spyOn(AbManulRequestAdaptor, 'getAbManualRequestDetailsFromJson').and.returnValue({});
      const url = getCmRequestDetailsUrl(
        payload.processId,
        payload.taskId,
        payload.taskName,
        payload.workflowType
      )
      abManualRequestService.getAbManualRequestDetails(
        payload.processId,
        payload.taskId,
        payload.taskName,
        payload.workflowType
      ).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    })
  })

  describe('getAbManualProductList', () => {
    it('should call get api method with correct url and params', () => {
      const payload = {
        id: 'id',
        txnType: 'txnType',
        subTxnType: 'subTxnType'
      }
      spyOn(CashMemoAdaptor, 'cashMemoDetailsResponseFromJson').and.returnValue({});
      const url = getCashMemoEndPointUrl(
        payload.txnType,
        payload.subTxnType,
        payload.id
      )
      abManualRequestService.getAbManualProductList(
        payload.id,
        payload.txnType,
        payload.subTxnType,
      ).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    })
  })

  describe('getProductDetails', () => {
    it('should call get api method with correct url and params', () => {
      const payload = {
        itemCode: 'itemCode'
      }
      const url = getProductDetailsEndPointUrl(
        payload.itemCode
      )
      abManualRequestService.getProductDetails(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    })
  })

  describe('getAbManualApprovalRequest', () => {
    it('should call put api method with correct url and params', () => {
      spyOn(AbManulRequestAdaptor, 'getAbManualApprovalRequestFromJson').and.returnValue({});
      const payload = {
        isApprove: false,
        requestBody: {},
        processId: 'processId',
        taskId: 'taskId',
        taskName: 'taskName'
      }
      const url = getCmApprovalRequestUrl(
        payload.isApprove,
        payload.processId,
        payload.taskId,
        payload.taskName
      )
      abManualRequestService.getAbManualApprovalRequest(
        payload.isApprove,
        payload.requestBody,
        payload.processId,
        payload.taskId,
        payload.taskName
      ).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PUT');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    })
  })

  describe('uploadFileList', () => {
    it('should call get api method with correct url and params', () => {
      const payload: FileUploadDownloadPayload = {
        txnType: TransactionTypeEnum.AB,
        id: 'id'
      }
      const url = manualBillListUrl(
        payload
      )
      abManualRequestService.uploadFileList(
        payload
      ).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    })
  })

  describe('downloadFile', () => {
    it('should call get api method with correct url and params', () => {
      const payload = {
        id: 'id',
        locationCode: 'CPD'
      }
      const url = downloadManualBillUrl(
        payload
      )
      abManualRequestService.downloadFile(
        payload
      ).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    })
  })
})
