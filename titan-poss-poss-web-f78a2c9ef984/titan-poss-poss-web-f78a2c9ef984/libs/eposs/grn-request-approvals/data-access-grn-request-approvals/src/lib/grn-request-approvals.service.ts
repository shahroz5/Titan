import { Injectable } from '@angular/core';
import {
  GrnRequestApprovalListRequest,
  grnRequestEnum,
  SaveGrnRequestApproval
} from '@poss-web/shared/models';
import {
  ApiService,
  getRoRequestApprovalListUrl,
  getSaveGrnRequestApprovalStatusUrl
} from '@poss-web/shared/util-api-service';
import { map } from 'rxjs/operators';
import { GrnRequestApprovalsAdaptors } from '@poss-web/shared/util-adaptors';
import { forkJoin } from 'rxjs';

@Injectable()
export class GrnRequestApprovalsService {
  ids = [];

  constructor(private apiService: ApiService) {}

  loadGrnRequestList(
    grnRequestApprovalListRequest: GrnRequestApprovalListRequest
  ) {
    const url = getRoRequestApprovalListUrl(
      grnRequestApprovalListRequest.approvalStatus,
      grnRequestApprovalListRequest.workflowType,
      grnRequestApprovalListRequest.pageIndex,
      grnRequestApprovalListRequest.pageSize,
      grnRequestApprovalListRequest.approvalStatus !== grnRequestEnum.PENDING ?
      ['createdDate,DESC'] : ['createdDate,ASC']
    );
    return this.apiService
      .post(url.path, grnRequestApprovalListRequest.filterOptions, url.params)
      .pipe(map(data => GrnRequestApprovalsAdaptors.getGrnRequestList(data)));
  }

  saveGrnRequestApprovalStatus(saveGrnRequestApproval: SaveGrnRequestApproval) {
    const ids = [];

    for (const req of saveGrnRequestApproval.bulkApproverRequestObjectDto) {
      const url = getSaveGrnRequestApprovalStatusUrl(
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
