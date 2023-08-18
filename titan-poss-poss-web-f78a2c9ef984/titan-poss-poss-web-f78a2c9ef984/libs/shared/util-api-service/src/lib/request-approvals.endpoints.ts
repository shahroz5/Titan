import { HttpParams } from '@angular/common/http';
import {
  engineBaseUrl,
  paymentBaseUrl
} from './configuration-endpoints.constants';
import { getSalesBaseUrl } from './master-endpoints.constants';

export const workFlowBaseUrl = (): string => {
  return '/workflow/v2';
};
export const getRoRequestApprovalListUrl = (
  approvalStatus: string,
  workflowType: string,
  pageIndex: number,
  pageSize: number,
  sort?: string[]
): { path: string; params: HttpParams } => {
  const path = workFlowBaseUrl() + '/' + 'workflow-task';
  const params = new HttpParams()
    .set('approvalStatus', approvalStatus)
    .set('workflowType', workflowType)
    .set('size', pageSize.toString())
    .set('page', pageIndex.toString())
    .set('sort', 'createdDate,desc');
  // if (sort) {
  //   sort.forEach(sortvalue => {
  //     params = params.append('sort', sortvalue);
  //   });
  // }
  return { path, params };
};

export const getSaveRoRequestApprovalStatusUrl = (
  approved,
  processId,
  taskId,
  taskName
): { path: string; params: HttpParams } => {
  const path = workFlowBaseUrl() + '/' + 'workflow-task' + '/' + 'approval';

  const params = new HttpParams()
    .set('approved', approved)
    .set('processId', processId)
    .set('taskId', taskId)
    .set('taskName', taskName);
  return { path, params };
};
export const getSaveGrnRequestApprovalStatusUrl = (
  approved,
  processId,
  taskId,
  taskName
): { path: string; params: HttpParams } => {
  const path = workFlowBaseUrl() + '/' + 'workflow-task' + '/' + 'approval';

  const params = new HttpParams()
    .set('approved', approved)
    .set('processId', processId)
    .set('taskId', taskId)
    .set('taskName', taskName);
  return { path, params };
};

export const getBoutiqueRoRequestApprovalStatusUrl = (): string => {
  return workFlowBaseUrl() + '/' + 'workflow-process' + '/' + 'list';
};

export const getCnRequestApprovalListUrl = (
  approvalStatus: string,
  workflowType: string,
  pageIndex: number,
  pageSize: number
): { path: string; params: HttpParams } => {
  const path = workFlowBaseUrl() + '/' + 'workflow-task';
  const params = new HttpParams()
    .set('approvalStatus', approvalStatus)
    .set('workflowType', workflowType)
    .set('size', pageSize.toString())
    .set('page', pageIndex.toString())
    .set('sort', 'docNo,desc');
  return { path, params };
};

export const getFullValueTepRequestApprovalListUrl = (
  approvalStatus: string,
  workflowType: string,
  pageIndex: number,
  pageSize: number,
  sort?: string[]
): { path: string; params: HttpParams } => {
  const path = workFlowBaseUrl() + '/' + 'workflow-task';
  let params = new HttpParams()
    .set('approvalStatus', approvalStatus)
    .set('workflowType', workflowType)
    .set('size', pageSize.toString())
    .set('page', pageIndex.toString());
  if (sort) {
    sort.forEach(sortvalue => {
      params = params.append('sort', sortvalue);
    });
  }
  return { path, params };
};

export const getSaveCnRequestApprovalStatusUrl = (
  approved,
  processId,
  taskId,
  taskName
): { path: string; params: HttpParams } => {
  const path = workFlowBaseUrl() + '/' + 'workflow-task' + '/' + 'approval';

  const params = new HttpParams()
    .set('approved', approved)
    .set('processId', processId)
    .set('taskId', taskId)
    .set('taskName', taskName);
  return { path, params };
};

export const getTepRefundListingUrl = (
  txnType: string,
  page: number,
  size: number
): { path: string; params: HttpParams } => {
  const path = getSalesBaseUrl() + '/refund/list';

  const params = new HttpParams()
    .set('txnType', txnType)
    .set('page', page.toString())
    .set('size', size.toString());
  return { path, params };
};

export const editTepRefundItemDataUrl = (
  txnType: string,
  status: string,
  id: string
): { path: string; params: HttpParams } => {
  const path = getSalesBaseUrl() + `/refund/${id}`;

  const params = new HttpParams().set('txnType', txnType).set('status', status);
  return { path, params };
};

export const getTotalElementsUrl = (
  approvalStatus,

  workflowType
): { path: string; params: HttpParams } => {
  const path = workFlowBaseUrl() + '/' + 'workflow-task' + '/' + 'count';

  const params = new HttpParams()
    .set('approvalStatus', approvalStatus)
    .set('workflowType', workflowType);

  return { path, params };
};
