import { TestBed } from '@angular/core/testing';

import {
  RoRequestApprovalListResponse,
  SaveRoRequestApproval
} from '@poss-web/shared/models';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { RoRequestApprovalAdaptor } from '@poss-web/shared/util-adaptors';
import {
  getRoRequestApprovalListUrl,
  getSaveRoRequestApprovalStatusUrl,
  getWorkFlowProcessUrl
} from '@poss-web/shared/util-api-service';
import { RoRequestApprovalService } from './ro-request-approval.service';
import * as moment from 'moment';
describe('RoRequestApprovalService', () => {
  let httpTestingController: HttpTestingController;
  const apiUrl = 'http://localhost:3000';
  let roRequestApprovalService: RoRequestApprovalService;
  const approvalStatus = 'PENDING';
  const workflowType = 'RO_REQUEST_APPROVAL';
  const pageIndex = 0;
  const pageSize = 10;

  const roRequestApprovalListResponse: RoRequestApprovalListResponse[] = [
    {
      approvedBy: 'commercial',
      approvedDate: moment(),
      remarks: 'approverRemarks',
      docDate: moment(),
      reqNo: 1,
      fiscalYear: 2020,
      amount: 2000,
      customerName: 'abc',
      customerTitle: 'abcd',
      customerMobileNumber: 1234567890,
      cashierId: '1',
      customerId: '1',
      locationCode: 'URB',
      processId: '1',
      cashierName: 'ABC',
      requestedDate: moment(),
      requestTime: moment().format('hh:mm A'),
      // requestTime: moment(request.requestedDate).
      requestorReason: 'requestorRemarks',
      taskId: '1',
      taskName: '1',
      workflowType: '1',
      totalElements: 1,
      approvalStatus: 'APPROVED'
    }
  ];
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        RoRequestApprovalService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    roRequestApprovalService = TestBed.inject(RoRequestApprovalService);
  });

  it('should be created', () => {
    expect(roRequestApprovalService).toBeTruthy();
  });

  describe('getRoRequestApprovalList', () => {
    const url = getRoRequestApprovalListUrl(
      approvalStatus,
      workflowType,
      pageIndex,
      pageSize
    );

    it('should call POST api method with correct url and params', () => {
      spyOn(
        RoRequestApprovalAdaptor,
        'getRoRequestApprovalList'
      ).and.returnValue({});

      roRequestApprovalService
        .getRoRequestApprovalList(
          approvalStatus,

          pageIndex,
          pageSize,
          workflowType
        )
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });

    it('should call RoRequestApprovalAdaptor getRoRequestApprovalList method with correct  parameters', () => {
      spyOn(
        RoRequestApprovalAdaptor,
        'getRoRequestApprovalList'
      ).and.returnValue({});

      roRequestApprovalService
        .getRoRequestApprovalList(
          approvalStatus,

          pageIndex,
          pageSize,
          workflowType
        )
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush(roRequestApprovalListResponse);
      expect(
        RoRequestApprovalAdaptor.getRoRequestApprovalList
      ).toHaveBeenCalledWith(roRequestApprovalListResponse);
    });

    it('should return data mapped by adaptors', () => {
      spyOn(
        RoRequestApprovalAdaptor,
        'getRoRequestApprovalList'
      ).and.returnValue(roRequestApprovalListResponse);

      roRequestApprovalService
        .getRoRequestApprovalList(
          approvalStatus,
          pageIndex,
          pageSize,
          workflowType
        )
        .subscribe(data1 => {
          expect(data1).toEqual(roRequestApprovalListResponse);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush({});
    });
  });

  describe('saveRoRequestApprovalStatus', () => {
    const saveRoRequestApproval: SaveRoRequestApproval = {
      bulkApproverRequestObjectDto: [
        {
          approverRemarks: 'Remarsk',
          approved: true,
          processId: '1',
          taskId: '1',
          taskName: 'test'
        }
      ]
    };
    const url = getSaveRoRequestApprovalStatusUrl(true, '1', '1', 'test');
    const id = ['1', '2'];
    it('should call PUT api method with correct url and params', () => {
      spyOn(RoRequestApprovalAdaptor, 'getApprovedIds').and.returnValue({});

      roRequestApprovalService
        .saveRoRequestApprovalStatus(saveRoRequestApproval)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PUT');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });
  });

  describe('getBoutiqueRoRequestApprovalList', () => {
    it('should call POST api method with correct url and params', () => {
      spyOn(
        RoRequestApprovalAdaptor,
        'getBoutiqueApprovalRequests'
      ).and.returnValue({});

      const requestParams = {
        approvalStatus: 'PENDING',
        workflowType: 'APPROVE_RO_PAYMENT',
        pageIndex: 0,
        pageSize: 10
      }

      const url = getWorkFlowProcessUrl(requestParams).path;

      roRequestApprovalService.getBoutiqueRoRequestApprovalList(
        'PENDING',
        null,
        'APPROVE_RO_PAYMENT',
        0,
        10
      ).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
  })
});
