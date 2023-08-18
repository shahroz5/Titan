import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  getCMRequestApprovalsListRouteUrl,
  getCMRequestListRouteUrl
} from '@poss-web/shared/util-site-routes';

const approvalUrl = 'approvals';
@Component({
  selector: 'poss-web-cm-request-shell',
  templateUrl: './cm-request-shell.component.html',
  styleUrls: []
})
export class CmRequestShellComponent  {
  isCorpUser: boolean;

  constructor(private router: Router) {
    if (router.url.split('/', 2)[1] === approvalUrl) {
      this.isCorpUser = true;
    } else {
      this.isCorpUser = false;
    }
  }

  back() {
    if (this.isCorpUser) {
      this.router.navigate([getCMRequestApprovalsListRouteUrl()]);
    } else {
      this.router.navigate([getCMRequestListRouteUrl()]);
    }
  }
}
