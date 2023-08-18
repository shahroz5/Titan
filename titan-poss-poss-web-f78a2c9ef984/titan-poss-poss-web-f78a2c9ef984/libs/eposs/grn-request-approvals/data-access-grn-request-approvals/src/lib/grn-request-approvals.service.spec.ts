import { TestBed } from '@angular/core/testing';

import {
  GrnRequestApprovalListRequest,
  GrnRequestApprovalListResponse
} from '@poss-web/shared/models';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { GrnRequestApprovalsAdaptors } from '@poss-web/shared/util-adaptors';
import { getRoRequestApprovalListUrl } from '@poss-web/shared/util-api-service';
import { GrnRequestApprovalsService } from './grn-request-approvals.service';
describe('GrnRequestApprovalsService', () => {
  let httpTestingController: HttpTestingController;
  const apiUrl = 'http://localhost:3000';
  let grnRequestApprovalsService: GrnRequestApprovalsService;
  const dummyGrnRequestResponse: GrnRequestApprovalListResponse[] = [
    {
      srcBoutiqueCode: 'URB',
      destBoutiqueCode: 'CPD',
      variantCode: '100',
      lotNumber: '001',
      fiscalYear: '2020',
      cmDocNumber: '1',
      isCmGoldRate: true,
      grnComments: 'test',
      grnReasons: 'dont want',
      approvedBy: 'SM',
      approvalCode: '11',
      approvalMailDated: '',
      returnedQty: 1,
      itemWeight: '0.01',
      pricePerUnit: 100,
      grnTotalPrice: 100,
      grnNumber: '10',
      processId: '1',
      taskId: '11',
      taskName: 't',
      remarks: 'remarks',
      cancelType: 'cancelType',
      totalElements:1
    }
  ];

  const dummyGrnRequestRequestResponse = {
    pageNumber: 0,
    pageSize: 0,
    results: dummyGrnRequestResponse,
    totalElements: 0,
    totalPages: 0
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        GrnRequestApprovalsService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    grnRequestApprovalsService = TestBed.inject(GrnRequestApprovalsService);
  });

  it('should be created', () => {
    expect(grnRequestApprovalsService).toBeTruthy();
  });

  describe('loadGrnRequestList', () => {
    const payload: GrnRequestApprovalListRequest = {
      approvalStatus: 'PENDING',
      workflowType: 'GOODS_RETURN',
      pageIndex: 1,
      pageSize: 10
    };
    const url = getRoRequestApprovalListUrl(
      payload.approvalStatus,
      payload.workflowType,
      payload.pageIndex,
      payload.pageSize
    );
    it('should call POST api method with correct url and params', () => {
      spyOn(GrnRequestApprovalsAdaptors, 'getGrnRequestList').and.returnValue(
        {}
      );

      grnRequestApprovalsService.loadGrnRequestList(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.get('page').toString()).toEqual(
        payload.pageIndex.toString()
      );
      expect(request.request.params.get('size').toString()).toEqual(
        payload.pageSize.toString()
      );
      request.flush({});
    });

    it('should call GrnRequestApprovalsAdaptors getGrnRequestList method with correct  parameters', () => {
      spyOn(GrnRequestApprovalsAdaptors, 'getGrnRequestList').and.returnValue(
        {}
      );

      grnRequestApprovalsService.loadGrnRequestList(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush(dummyGrnRequestRequestResponse);
      expect(
        GrnRequestApprovalsAdaptors.getGrnRequestList
      ).toHaveBeenCalledWith(dummyGrnRequestRequestResponse);
    });

    it('should return data mapped by adaptors', () => {
      spyOn(GrnRequestApprovalsAdaptors, 'getGrnRequestList').and.returnValue(
        dummyGrnRequestResponse
      );

      grnRequestApprovalsService
        .loadGrnRequestList(payload)
        .subscribe(data1 => {
          expect(data1).toEqual(dummyGrnRequestResponse);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush({});
    });
  });
});
