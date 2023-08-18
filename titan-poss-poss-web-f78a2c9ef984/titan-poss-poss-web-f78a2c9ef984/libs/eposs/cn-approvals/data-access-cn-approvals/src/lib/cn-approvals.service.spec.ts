import { TestBed } from '@angular/core/testing';

import {
  CnApprovalListRequest,
  CnApprovalListResponse,
  SaveCnApproval
} from '@poss-web/shared/models';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { CnApprovalsAdaptor } from '@poss-web/shared/util-adaptors';
import { getCnRequestApprovalListUrl, getSaveCnRequestApprovalStatusUrl } from '@poss-web/shared/util-api-service';
import { CnApprovalsService } from './cn-approvals.service';
describe('CnApprovalsService', () => {
  let httpTestingController: HttpTestingController;
  const apiUrl = 'http://localhost:3000';
  let cnApprovalsService: CnApprovalsService;
  const dummyCNApprovalRequestResponse: CnApprovalListResponse[] = [
    {
      locationCode: 'CPD',
      cnNumber: '1',
      fiscalYear: '2020',
      cnType: 'ACTIVATE',
      cnDate: '21/06/2021',
      customerName: 'ABC',
      customerMobileNumber: '8976542378',
      amount: '1000',
      requestedBy: 'CPD',
      requestedType: 'ACTIVATE',
      suspendedDate: '20/06/2021',
      requestorRemarks: 11,
      remarks: 'OK',
      processId: '22',
      taskId: '33',
      taskName: 'TEST',
      totalElements: 10
    }
  ];

  const dummyCNApprovalRequestRequestResponse = {
    pageNumber: 0,
    pageSize: 0,
    results: dummyCNApprovalRequestResponse,
    totalElements: 0,
    totalPages: 0
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CnApprovalsService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    cnApprovalsService = TestBed.inject(CnApprovalsService);
  });

  it('should be created', () => {
    expect(cnApprovalsService).toBeTruthy();
  });

  describe('loadCnApprovalList', () => {
    const cnApprovalListRequest: CnApprovalListRequest = {
      approvalStatus: 'PENDING',
      filterOptions: {
        fiscalYear: 2020,
        dateRangeType: 'CUSTOM'
      },
      workflowType: 'CREDIT_NOTE_ACTIVATE',
      pageIndex: 0,
      pageSize: 10
    };
    const url = getCnRequestApprovalListUrl(
      cnApprovalListRequest.approvalStatus,
      cnApprovalListRequest.workflowType,
      cnApprovalListRequest.pageIndex,
      cnApprovalListRequest.pageSize
    );
    it('should call POST api method with correct url and params', () => {
      spyOn(CnApprovalsAdaptor, 'getCnRequestList').and.returnValue({});

      cnApprovalsService.loadCnApprovalList(cnApprovalListRequest).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.get('page').toString()).toEqual(
        cnApprovalListRequest.pageIndex.toString()
      );
      expect(request.request.params.get('size').toString()).toEqual(
        cnApprovalListRequest.pageSize.toString()
      );
      request.flush({});
    });

    it('should call CnApprovalsAdaptor getCnRequestList method with correct  parameters', () => {
      spyOn(CnApprovalsAdaptor, 'getCnRequestList').and.returnValue({});

      cnApprovalsService.loadCnApprovalList(cnApprovalListRequest).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush(dummyCNApprovalRequestRequestResponse);
      expect(CnApprovalsAdaptor.getCnRequestList).toHaveBeenCalledWith(
        dummyCNApprovalRequestRequestResponse
      );
    });

    it('should return data mapped by adaptors', () => {
      spyOn(CnApprovalsAdaptor, 'getCnRequestList').and.returnValue(
        dummyCNApprovalRequestResponse
      );

      cnApprovalsService
        .loadCnApprovalList(cnApprovalListRequest)
        .subscribe(data1 => {
          expect(data1).toEqual(dummyCNApprovalRequestResponse);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush({});
    });
  });

  describe('saveCnApprovalStatus', () => {
    it('should call PUT api method with correct url and params', () => {
      const saveCnApprovalRequest: SaveCnApproval = {
        bulkApproverRequestObjectDto: [
          {
            approvedData: {
              data: null,
              type: 'type'
            },
            approverRemarks: '',
            approved: true,
            processId: '1',
            taskId: '2',
            taskName: '3'
          }
        ]
      }
      const url = getSaveCnRequestApprovalStatusUrl(
        saveCnApprovalRequest.bulkApproverRequestObjectDto[0].approved,
        saveCnApprovalRequest.bulkApproverRequestObjectDto[0].processId,
        saveCnApprovalRequest.bulkApproverRequestObjectDto[0].taskId,
        saveCnApprovalRequest.bulkApproverRequestObjectDto[0].taskName
      )

      cnApprovalsService.saveCnApprovalStatus(saveCnApprovalRequest).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PUT');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    })

  })
});
