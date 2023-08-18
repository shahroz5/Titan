import { Injectable } from '@angular/core';
import {
  ApiService,
  getRoRequestApprovalListUrl,
  getSaveRoRequestApprovalStatusUrl,
  getWorkFlowProcessUrl
} from '@poss-web/shared/util-api-service';
import { SaveRoRequestApproval, roRequestEnum } from '@poss-web/shared/models';
import { map } from 'rxjs/operators';
import { RoRequestApprovalAdaptor } from '@poss-web/shared/util-adaptors';
import { forkJoin } from 'rxjs';

@Injectable()
export class RoRequestApprovalService {
  constructor(private apiService: ApiService) {}
  getRoRequestApprovalList(
    approvalStatus: string,
    pageIndex?: number,
    pageSize?: number,
    workflowType?: string,
    filterOptions?: any
  ) {
    const url = getRoRequestApprovalListUrl(
      approvalStatus,
      workflowType,
      pageIndex,
      pageSize
    );
    return this.apiService
      .post(url.path, filterOptions, url.params)
      .pipe(
        map(data => RoRequestApprovalAdaptor.getRoRequestApprovalList(data))
      );
  }

  saveRoRequestApprovalStatus(saveRoRequestApproval: SaveRoRequestApproval) {
    const ids = [];

    for (const req of saveRoRequestApproval.bulkApproverRequestObjectDto) {
      const url = getSaveRoRequestApprovalStatusUrl(
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

  getBoutiqueRoRequestApprovalList(
    approvalStatus: string,
    filterOptions: any,
    workflowType: any,
    pageIndex: number,
    pageSize: number
  ) {
    const reqBody = filterOptions;
    const requestParams = {
      workflowType: roRequestEnum.workflowType,
      approvalStatus: approvalStatus,
      page: pageIndex,
      size: pageSize
    };

    const url = getWorkFlowProcessUrl(requestParams);

    return this.apiService
      .post(url.path, reqBody, url.params)
      .pipe(
        map(data => RoRequestApprovalAdaptor.getBoutiqueApprovalRequests(data))
      );
  }
}
