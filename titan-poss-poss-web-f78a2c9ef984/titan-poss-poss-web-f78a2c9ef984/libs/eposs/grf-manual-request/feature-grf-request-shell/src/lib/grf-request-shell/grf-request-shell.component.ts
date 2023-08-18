import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  getGRFequestApprovalsListRouteUrl,

} from '@poss-web/shared/util-site-routes';
@Component({
  selector: 'poss-web-grf-request-shell',
  templateUrl: './grf-request-shell.component.html'
})
export class GrfRequestShellComponent {

  constructor(private router: Router) {
    // if (router.url.split('/', 2)[1] === approvalUrl) {
    //   this.isCorpUser = true;
    // } else {
    //   this.isCorpUser = false;
    // }
  }

  back() {
      this.router.navigate([getGRFequestApprovalsListRouteUrl()]);
  }

  // back() {
  //   if (this.isCorpUser) {
  //     this.router.navigate([getCMRequestApprovalsListRouteUrl()]);
  //   } else {
  //     this.router.navigate([getCMRequestListRouteUrl()]);
  //   }
  // }

}
