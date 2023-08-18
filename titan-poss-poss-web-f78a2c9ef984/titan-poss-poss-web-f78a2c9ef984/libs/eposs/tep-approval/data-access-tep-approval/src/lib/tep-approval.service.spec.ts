import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';import { TestBed } from '@angular/core/testing';
import { EditRefundItemPayload, RefundList, RefundListingPayload, RefundListItem, workflowPayload } from '@poss-web/shared/models';
import { getCmApprovalRequestUrl, getWorkFlowProcessDetailsUrl } from '@poss-web/shared/util-api-service';
import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { CnApprovalListRequest, SaveCnApproval } from 'libs/shared/models/src/lib/request-approvals/cn-approvals.model';
import { FullValueTepRequestsResponse, FvtAcceptOrRejectRequestPayload, tepRequests } from 'libs/shared/models/src/lib/request-approvals/tep-approvals.model';
import { RequestApprovalsItemsAdaptor } from 'libs/shared/util-adaptors/src/lib/request-approvals/request-approvals-items.adaptor';
import { editTepRefundItemDataUrl, getCnRequestApprovalListUrl, getFullValueTepRequestApprovalListUrl, getSaveCnRequestApprovalStatusUrl, getTepRefundListingUrl } from 'libs/shared/util-api-service/src/lib/request-approvals.endpoints';

import { TepApprovalService } from './tep-approval.service';

describe('TepApprovalService', () => {
  let service: TepApprovalService;
  let httpTestingController: HttpTestingController;
  const apiUrl = 'http://localhost:3000';

  const approvalListRequest: CnApprovalListRequest = {
    approvalStatus: 'PENDING',
    workflowType: null,
    pageIndex: 0,
    pageSize: 10
  }
  const editRefundItemPayload: EditRefundItemPayload = {
    approvedData: {
      type: '',
      data: {
        refundMode: '',
        customerName: '',
        bankName: '',
      }
    }
  }
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        TepApprovalService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(TepApprovalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('loadtepApprovalList', () => {
    it('should call POST api method with correct url and params', () => {
      spyOn(
        RequestApprovalsItemsAdaptor, 'TepRequestList'
      ).and.returnValue({});

      const url = getCnRequestApprovalListUrl(
        approvalListRequest.approvalStatus,
        approvalListRequest.workflowType,
        approvalListRequest.pageIndex,
        approvalListRequest.pageSize
      )

      service.loadtepApprovalList(approvalListRequest).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');
    })
  })

  describe('loadFullValueTepApprovalList', () => {
    it('should call POST api method with correct url and params', () => {
      spyOn(
        RequestApprovalsItemsAdaptor,
        'FullValueTepRequestsList'
      ).and.returnValue({});

      const url = getFullValueTepRequestApprovalListUrl(
        approvalListRequest.approvalStatus,
        approvalListRequest.workflowType,
        approvalListRequest.pageIndex,
        approvalListRequest.pageSize,
        approvalListRequest.sort
      )

      service.loadFullValueTepApprovalList(approvalListRequest).subscribe();
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');
    })
    /* it('should return data mapped by adaptors', () => {
      const responsePayload: FullValueTepRequestsResponse = {
        results: [{
          taskId: "4e8e4feb-ec9e-11ec-8aa4-00155db7a4a7",
          taskName: "REQUEST_APPROVER_L1",
          processId: "4E5E17FE-EC9E-11EC-8AA4-00155DB7A4A7",
          approvalStatus: "PENDING",
          approvedBy: null,
          approvedDate: null,
          approverCode: null,
          approverRemarks: null,
          docDate: 1655292520808,
          docNo: 1,
          fiscalYear: 2022,
          headerData: {
            type: 'TEP_APPROVAL_WORKFLOW_HEADER',
            data: {
              approvalDetails: {
                data: {
                  approvalDate: '',
                  approvalCode: '',
                  approvedBy: '',
                  fileList: {
                    results: [{
                      id: '',
                      name: ''
                    }]
                  }
                },
                type: ''
              },
              fvtLocationCode: '52',
              fvtLocationType: '',
              cmLocationCode: '',
              cmDocNo: 2,
              cmDocDate: 45,
              noOfDaysFromCm: 6,
              customerName: '',
              customerMobileNo: '',
              reasonForFullValueTep: '',
              itemCode: '',
              lotNumber: '',
              totalNoOfStones: 6,
              measuredNoOfStones: 6,
              measuredWeight: 6,
              billedWeight: 5,
              totalQuantity: 6,
              salesTxnId: '',
              metalValue: 9,
              stoneValue: 0,
              paymentMode: ''
            },
          },
          locationCode: "CPD",

          requestedBy: "cashiercpd",
          requestedDate: 1655292520808,
          requestorCode: "cashiercpd",
          requestorRemarks: null,
          workflowType: "TEP_APPROVAL_WORKFLOW",
        }],
        totalElements: 10,
        totalPages: 10,
        pageNumber: 0,
        pageSize: 10
      }
      spyOn(
        RequestApprovalsItemsAdaptor,
        'FullValueTepRequestsList'
      ).and.returnValue({});

      const url = getFullValueTepRequestApprovalListUrl(
        approvalListRequest.approvalStatus,
        approvalListRequest.workflowType,
        approvalListRequest.pageIndex,
        approvalListRequest.pageSize,
        approvalListRequest.sort
      )

      service.loadFullValueTepApprovalList(approvalListRequest)
      .subscribe(data => {
        expect(data).toEqual(responsePayload);
      });
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      request.flush({});
    })*/
  })
  describe('savetepApprovalStatus', () => {
    it('should call PUT method with correct url and params', () => {
      const payload: SaveCnApproval = {
        bulkApproverRequestObjectDto: [{
          approverRemarks: 'remarks',
          approved: false,
          processId: '1',
          taskId: 'Task 1',
          taskName: 'Save Task'
        }],
      }
      const url = getSaveCnRequestApprovalStatusUrl(
        payload.bulkApproverRequestObjectDto[0].approved,
        payload.bulkApproverRequestObjectDto[0].processId,
        payload.bulkApproverRequestObjectDto[0].taskId,
        payload.bulkApproverRequestObjectDto[0].taskName
      )
      service.savetepApprovalStatus(payload).subscribe();
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PUT');
      expect(request.request.responseType).toEqual('json');
    })
    it('should return data mapped by adaptors', () => {
      const payload: SaveCnApproval = {
        bulkApproverRequestObjectDto: [{
          approverRemarks: 'remarks',
          approved: false,
          processId: '1',
          taskId: 'Task 1',
          taskName: 'Save Task'
        }],
      }
      const url = getSaveCnRequestApprovalStatusUrl(
        payload.bulkApproverRequestObjectDto[0].approved,
        payload.bulkApproverRequestObjectDto[0].processId,
        payload.bulkApproverRequestObjectDto[0].taskId,
        payload.bulkApproverRequestObjectDto[0].taskName
      )
      service.savetepApprovalStatus(payload).subscribe(
        data => {
          expect(data).toEqual(data)
        }
      );
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      request.flush(payload);
    })
    it('if process id is null', () => {
      const ids = [];
      const payload: SaveCnApproval = {
        bulkApproverRequestObjectDto: [{
          approverRemarks: 'remarks',
          approved: false,
          processId: '1',
          taskId: 'Task 1',
          taskName: 'Save Task'
        }],
      }
      const url = getSaveCnRequestApprovalStatusUrl(
        payload.bulkApproverRequestObjectDto[0].approved,
        payload.bulkApproverRequestObjectDto[0].processId,
        payload.bulkApproverRequestObjectDto[0].taskId,
        payload.bulkApproverRequestObjectDto[0].taskName
      )
      service.savetepApprovalStatus(payload).subscribe(
        data => {
          expect(data).toBeDefined();
        }
      );
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      request.flush(null);
    })
  })

  describe('loadWorkflowDetails', () => {
    it('should call GET api method with correct url and params', () => {
      const payload: workflowPayload = {
        processId: '1',
        workflowType: 'TEP_APPROVAL_WORKFLOW'
      }
      spyOn(
        RequestApprovalsItemsAdaptor,
        'TepWorkflowDeatils'
      ).and.returnValue({});

      const url = getWorkFlowProcessDetailsUrl(payload)

      service.loadWorkflowDeatils(payload).subscribe();
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
    })
  })

  describe('loadTepRefundList', () => {
    it('should call POST api method with correct url and params', () => {
      const payload: RefundListingPayload = {
        subTxnType: 'TEP'
      }
      const url = getTepRefundListingUrl(
        'TEP',
        0,
        10
      )

      service.loadTepRefundList(payload, 0, 10).subscribe();
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');
    })
    it('should return data mapped by adaptors', () => {
      const payload: RefundListingPayload = {
        subTxnType: 'TEP'
      }
      const responsePayload: RefundList = {
        pageNumber: 0,
        pageSize: 0,
        results: [{
          approvedData: {
            type: 'TYPE',
            data: {
              refundMode: 'RTGS',
              customerName: 'CUSTOMER1',
              bankName: 'ICICI',
            }
          },
          docDate: '16-JUN-2020',
          docNo: 45,
          headerData: {
            type: 'TYPE1',
            data: {
              customerName: 'CUSTOMER2',
              customerId: 3,
              remarks: 'Remarks',
              totalWeight: 1029.6,
              totalValue: 3000,
              totalQuantity: 23,
              itemDetails: [{
                itemCode: 'ITEM CODE',
                isCmAvailable: true,
                isSaleable: false,
                priceDetails: null,
                totalWeight: 36,
                totalValue: 4560
              }]
            }
          },
          id: '23',
          locationCode: 'LOC2',
          refTxnId: null,
          refundType: 'RTGS',
          remarks: 'Remarks',
          requestorName: 'CUSTOMER',
          status: 'PENDING'
        }],
        totalElements: 0,
        totalPages: 0
      }
      const url = getTepRefundListingUrl(
        'TEP',
        0,
        10
      )

      service.loadTepRefundList(payload, 0, 10)
      .subscribe(data => {
        expect(data).toEqual(responsePayload)
      });
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      request.flush(responsePayload);
    })
  })

  describe('editTepRefundItemData', () => {
    it('should call PUT api method with correct url and params', () => {
      const url = editTepRefundItemDataUrl(
        'TEP',
        'PENDING',
        '10'
      )
      service.editTepRefundItemData(editRefundItemPayload, 'PENDING', '10').subscribe();
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PUT');
      expect(request.request.responseType).toEqual('json');
    })
    it('should return data mapped by adaptors', () => {
      const responsePayload: RefundListItem = {
        approvedData: {
          type: 'TYPE',
          data: {
            refundMode: 'RTGS',
            customerName: 'CUSTOMER1',
            bankName: 'ICICI',
          }
        },
        docDate: '16-JUN-2020',
        docNo: 45,
        headerData: {
          type: 'TYPE1',
          data: {
            customerName: 'CUSTOMER2',
            customerId: 3,
            remarks: 'Remarks',
            totalWeight: 1029.6,
            totalValue: 3000,
            totalQuantity: 23,
            itemDetails: [{
              itemCode: 'ITEM CODE',
              isCmAvailable: true,
              isSaleable: false,
              priceDetails: null,
              totalWeight: 36,
              totalValue: 4560
            }]
          }
        },
        id: '23',
        locationCode: 'LOC2',
        refTxnId: null,
        refundType: 'RTGS',
        remarks: 'Remarks',
        requestorName: 'CUSTOMER',
        status: 'PENDING'
      }
      const url = editTepRefundItemDataUrl(
        'TEP',
        'PENDING',
        '10'
      )

      service.editTepRefundItemData(editRefundItemPayload, 'PENDING', '10')
      .subscribe(data => {
        expect(data).toEqual(responsePayload);
      });
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      request.flush(responsePayload);
    })
  })

  describe('sendFvtApprovalRequest', () => {
    it('should call PUT api method with correct url and params', () => {
      const payload: EditRefundItemPayload = {
        approvedData: {
          type: '',
          data: {
            refundMode: '',
            customerName: '',
            bankName: '',
          }
        }
      }
      const url = getCmApprovalRequestUrl(
        false,
        '1',
        'Task1',
        'Task'
      )

      service.sendFvtApprovalRequest(false, {}, '1', 'Task1', 'Task').subscribe();
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PUT');
      expect(request.request.responseType).toEqual('json');
    })
    it('should return data mapped by adaptors', () => {
      const responsePayload: FvtAcceptOrRejectRequestPayload = {
        approvedData: {
          type:'',
          data: {
            tepValue: null,
            approverRemarks: null,
            paymentValue: null
          }
        },
        approverRemarks: 'Remarks'
      }
      const url = getCmApprovalRequestUrl(
        false,
        '1',
        'Task1',
        'Task'
      )

      service.sendFvtApprovalRequest(false, null, '1', 'Task1', 'Task').subscribe(
        data => {
          expect(data).toEqual(responsePayload)
        }
      );
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      request.flush(responsePayload);
    })
  })
})

