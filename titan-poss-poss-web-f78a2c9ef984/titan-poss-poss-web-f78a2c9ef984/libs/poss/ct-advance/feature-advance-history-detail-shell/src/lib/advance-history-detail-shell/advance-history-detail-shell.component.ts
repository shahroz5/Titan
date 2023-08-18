import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { getAdvanceHistoryListingRouteUrl } from '@poss-web/shared/util-site-routes';
// import { CommonFacade } from '@poss-web/shared/common/data-access-common';

@Component({
  selector: 'poss-web-advance-history-detail-shell',
  templateUrl: './advance-history-detail-shell.component.html'
})
export class AdvanceHistoryDetailShellComponent {
  hasNotification = true;
  constructor(
    private router: Router // private commonFacade: CommonFacade
  ) {}

  back() {
    // this.commonFacade.setTransactionConfig(null);
    // this.commonFacade.setTransactionConfig(null);
    this.router.navigate([getAdvanceHistoryListingRouteUrl()], {
      state: { clearFilter: false }
    });
  }
}
