import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  getGRFApprovalsRouteUrl,
  getGRFequestApprovalsListRouteUrl,

} from '@poss-web/shared/util-site-routes';
@Component({
  selector: 'poss-web-grf-status-shell',
  templateUrl: './grf-status-shell.component.html'
})
export class GrfStatusShellComponent  {

  constructor(private router: Router) {
    // if (router.url.split('/', 2)[1] === approvalUrl) {
    //   this.isCorpUser = true;
    // } else {
    //   this.isCorpUser = false;
    // }
  }

  back() {
      this.router.navigate([getGRFApprovalsRouteUrl()]);
  }

}
