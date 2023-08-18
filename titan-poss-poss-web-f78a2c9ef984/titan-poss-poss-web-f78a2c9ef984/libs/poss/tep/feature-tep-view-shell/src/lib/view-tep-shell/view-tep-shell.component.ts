import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  getcancelTEPUrl,
  gethistoryTEPUrl,
  getRefundListingUrl,
  getRequestListingUrl
} from '@poss-web/shared/util-site-routes';

@Component({
  templateUrl: './view-tep-shell.component.html'
})
export class ViewTepShellComponent implements OnInit {
  hasNotification = true;
  refundView = true;
  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    if (
      this.activatedRoute.snapshot.params['_processId'] ||
      this.activatedRoute.snapshot.params['_action']
    ) {
      this.refundView = false;
    }
  }



  back() {
    if (this.activatedRoute.snapshot.params['_processId']) {
      this.router.navigate([getRequestListingUrl()], {
        state: { clearFilter: false }
      });
    } else if (this.activatedRoute.snapshot.params['_action'] === 'cancel') {
      this.router.navigate([getcancelTEPUrl()], {
        state: { clearFilter: false }
      });
    } else if (this.activatedRoute.snapshot.params['_action'] === 'history') {
      this.router.navigate([gethistoryTEPUrl()], {
        state: { clearFilter: false }
      });
    } else {
      this.router.navigate([getRefundListingUrl()], {
        state: { clearFilter: false }
      });
    }
  }
}
