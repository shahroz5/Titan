import { Injectable } from '@angular/core';
import {
  CnApprovalListRequest,
  EditRefundItemPayload,
  FullValueTepRequestsResponse,
  FvtAcceptOrRejectRequestPayload,
  RefundList,
  RefundListingPayload,
  RefundListItem,
  SaveCnApproval,
  tepApprovalListResponse,
  tepRequests,
  workflowPayload
} from '@poss-web/shared/models';
import { RequestApprovalsItemsAdaptor } from '@poss-web/shared/util-adaptors';
import {
  ApiService,
  editTepRefundItemDataUrl,
  getCmApprovalRequestUrl,
  getCnRequestApprovalListUrl,
  getFullValueTepRequestApprovalListUrl,
  getSaveCnRequestApprovalStatusUrl,
  getTepRefundListingUrl,
  getWorkFlowProcessDetailsUrl
} from '@poss-web/shared/util-api-service';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TepApprovalService {
  constructor(private apiService: ApiService) {}

  loadtepApprovalList(payload: CnApprovalListRequest): Observable<tepRequests> {
    const url = getCnRequestApprovalListUrl(
      payload.approvalStatus,
      payload.workflowType,
      payload.pageIndex,
      payload.pageSize
    );
    return this.apiService
      .post(url.path, payload.filterOptions, url.params)
      .pipe(map(data => RequestApprovalsItemsAdaptor.TepRequestList(data)));
  }

  loadFullValueTepApprovalList(
    payload: CnApprovalListRequest
  ): Observable<FullValueTepRequestsResponse> {
    const url = getFullValueTepRequestApprovalListUrl(
      payload.approvalStatus,
      payload.workflowType,
      payload.pageIndex,
      payload.pageSize,
      payload.sort
    );
    return this.apiService
      .post(url.path, payload.filterOptions, url.params)
      .pipe(
        map(data => RequestApprovalsItemsAdaptor.FullValueTepRequestsList(data))
      );
  }

  // getFullValueTepRequestWorkflowDetails(taskId: string, processId: string, taskName: string, workFlowType: string): Observable<any> {
  //   const urlObject = getCmRequestDetailsUrl()
  // }

  savetepApprovalStatus(saveTepApproval: SaveCnApproval) {
    const ids = [];

    for (const req of saveTepApproval.bulkApproverRequestObjectDto) {
      const url = getSaveCnRequestApprovalStatusUrl(
        req.approved,
        req.processId,
        req.taskId,
        req.taskName
      );
      const reqBody = {
        approvedData: req.approvedData,
        approverRemarks: req.approverRemarks
      };

      ids.push(
        this.apiService
          .put(url.path, reqBody, url.params)
          .pipe(map(data => data?.processId))
      );
    }

    return forkJoin(...ids);
  }

  loadWorkflowDeatils(
    data: workflowPayload
  ): Observable<tepApprovalListResponse> {
    const workflowUrl = getWorkFlowProcessDetailsUrl(data);

    return this.apiService
      .get(workflowUrl.path, workflowUrl.params)
      .pipe(map(res => RequestApprovalsItemsAdaptor.TepWorkflowDeatils(res)));
  }

  loadTepRefundList(
    data: RefundListingPayload,
    page: number,
    size: number
  ): Observable<RefundList> {
    const refundUrl = getTepRefundListingUrl('TEP', page, size);

    return this.apiService
      .post(refundUrl.path, data, refundUrl.params)
      .pipe(map(res => res));
  }

  editTepRefundItemData(
    data: EditRefundItemPayload,
    status: string,
    id: string
  ): Observable<RefundListItem> {
    const refundUrl = editTepRefundItemDataUrl('TEP', status, id);

    return this.apiService
      .put(refundUrl.path, data, refundUrl.params)
      .pipe(map(res => res));
  }

  sendFvtApprovalRequest(
    isApprove: boolean,
    requestBody: any,
    processId: string,
    taskId: string,
    taskName: string
  ): Observable<FvtAcceptOrRejectRequestPayload> {
    const url = getCmApprovalRequestUrl(isApprove, processId, taskId, taskName);

    return this.apiService
      .put(url.path, requestBody, url.params)
      .pipe(map(data => data));
  }
}
