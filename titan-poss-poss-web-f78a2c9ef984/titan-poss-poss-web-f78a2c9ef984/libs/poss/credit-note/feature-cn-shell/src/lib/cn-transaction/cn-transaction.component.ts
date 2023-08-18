import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonFacade } from '@poss-web/shared/common/data-access-common';
import {
  CNSearchEnum,
  FileUploadDocTypeEnum,
  FileUploadFileTypeEnum
} from '@poss-web/shared/models';
import { getCreditNoteUrl } from '@poss-web/shared/util-site-routes';

@Component({
  selector: 'poss-web-cn-transaction',
  templateUrl: './cn-transaction.component.html'
})
export class CNTransactionComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private commonFacade: CommonFacade
  ) {}
  hasNotification = true;
  tabType: string;
  requestType: string;
  docType = FileUploadDocTypeEnum.CN_WORKFLOW;
  fileType = FileUploadFileTypeEnum.OTHERS;
  CNSearchEnumRef = CNSearchEnum;
  showFileUploadForCancelCnRequest = false;

  ngOnInit(): void {
    const fromPath = this.route.pathFromRoot[2];
    this.tabType = fromPath.snapshot.params['_tabType'];
    this.requestType = fromPath.snapshot.params['_requestType'];
    this.commonFacade.setFileUploadVisible(true)
  }
  back() {
    this.router.navigate([getCreditNoteUrl(this.tabType)], {
      state: { clearFilter: false }
    });
  }
  isCancelCnAutoApproved(isAutoApproved: boolean) {
    if (
      this.requestType === this.CNSearchEnumRef.CANCEL_CN &&
      isAutoApproved === false
    ) {
      this.showFileUploadForCancelCnRequest = true;
    } else {
      this.showFileUploadForCancelCnRequest = false;
    }
  }
}
