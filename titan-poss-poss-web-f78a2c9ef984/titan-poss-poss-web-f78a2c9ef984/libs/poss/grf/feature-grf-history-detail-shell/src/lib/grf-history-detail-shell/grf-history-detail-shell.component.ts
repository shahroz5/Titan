import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { getGrfHistoryListingRouteUrl } from '@poss-web/shared/util-site-routes';
// import { CommonFacade } from '@poss-web/shared/common/data-access-common';

@Component({
  selector: 'poss-web-grf-history-detail-shell',
  templateUrl: './grf-history-detail-shell.component.html'
})
export class GrfHistoryDetailShellComponent {
  hasNotification = true;
  constructor(
    private router: Router // private commonFacade: CommonFacade
  ) {}

  back() {
    // this.commonFacade.setTransactionConfig(null);
    // this.commonFacade.setTransactionConfig(null);
    this.router.navigate([getGrfHistoryListingRouteUrl()], {
      state: { clearFilter: false }
    });
  }
}
