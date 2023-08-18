import { Injectable } from '@angular/core';
import {
  ApiService,
  getCnRequestApprovalListUrl,
  getSaveCnRequestApprovalStatusUrl
} from '@poss-web/shared/util-api-service';
import { CnApprovalListRequest, SaveCnApproval } from '@poss-web/shared/models';
import { map } from 'rxjs/operators';
import { CnApprovalsAdaptor } from '@poss-web/shared/util-adaptors';
import { forkJoin } from 'rxjs';

@Injectable()
export class CnApprovalsService {
  ids = [];

  constructor(private apiService: ApiService) {}

  loadCnApprovalList(cnApprovalListRequest: CnApprovalListRequest) {
    const url = getCnRequestApprovalListUrl(
      cnApprovalListRequest.approvalStatus,
      cnApprovalListRequest.workflowType,
      cnApprovalListRequest.pageIndex,
      cnApprovalListRequest.pageSize
    );
    return this.apiService
      .post(url.path, cnApprovalListRequest.filterOptions, url.params)
      .pipe(map(data => CnApprovalsAdaptor.getCnRequestList(data)));
  }

  saveCnApprovalStatus(saveCnApproval: SaveCnApproval) {
    const ids = [];

    for (const req of saveCnApproval.bulkApproverRequestObjectDto) {
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
}
