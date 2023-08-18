import { TestBed } from '@angular/core/testing';

import {
  RoRequestApprovalListResponse,
  SaveRoRequestApproval,
  roRequestEnum,
  ABRequests
} from '@poss-web/shared/models';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import {
  RoRequestApprovalAdaptor,
  CmRequestAdaptor,
  ABRequestsHelper
} from '@poss-web/shared/util-adaptors';
import {
  getBillCancellationRequestUrl,
  putBillCancellationUrl
} from '@poss-web/shared/util-api-service';
import { AbRequestsService} from './ab-requests.service';
import * as moment from 'moment';
describe('RoRequestApprovalService', () => {
  let httpTestingController: HttpTestingController;
  const apiUrl = 'http://localhost:3000';
  let requestApprovalService:AbRequestsService;
  const approvalStatus = 'PENDING';
  const workflowType = 'RO_REQUEST_APPROVAL';
  const pageIndex = 0;
  const pageSize = 10;


  const RequestApprovalListResponse: ABRequests = {
    results:[
    {
      approvedBy: 'Abc',
      invoiceNo:788,
      approvedDate: null,
      approverRemarks: 'Abc',
      docDate:null,
      docNo: 89,
      fiscalYear: 89,
      headerData: null,
      customerName: 'Abc',
      totalAmount: 78999,
      locationCode: 'Abc',
      mobileNumber: 907890000,
      abDocNo: 89,
      processId: 'Abc',
      requestedBy: 'Abc',
      requestedDate: null,
      requestorRemarks: 'Abc',
      taskId: 'Abc',
      taskName: 'Abc',
      workflowType: 'Abc',
    }
  ],
  count:1

}
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AbRequestsService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    requestApprovalService = TestBed.inject(AbRequestsService);
  });

  it('should be created', () => {
    expect(requestApprovalService).toBeTruthy();
  });

  describe('getloadabRequest', () => {
    const payload={
      approvalStatus:approvalStatus,
      page:8,
      size:9,
      workflowType:workflowType
    }
    const {path ,params}= getBillCancellationRequestUrl(payload
    );

    it('should call Post api method with correct url and params', () => {
      spyOn(
        ABRequestsHelper,
        'getBills'
      ).and.returnValue({});

      requestApprovalService
        .getloadabRequest({
          approvalStatus:approvalStatus,
        workflowType:workflowType,
        body:{}
        }
        )
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        console.log(req.url, apiUrl, path)
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });


  })

  describe('putab', () => {

    const payload={
      processId:'667-90UI-8990000',
      approved:true,
      taskId:'567890-IO-56789',
      taskNam:'PROCESS-L1'
    }
    const {path ,params}=putBillCancellationUrl(payload
    );

    it('should call Put api method with correct url and params', () => {


      requestApprovalService
        .putab({
          approved: 'yes',
  body: {
    approvedData: {
      data: null,
      type:'cm'
    },
    approverRemarks: 'string',
  },
  processId: '4567890',
  taskId: '4567890',
  taskName: 'string',

})
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        console.log(req.url, apiUrl, path)
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PUT');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });


  })
});
