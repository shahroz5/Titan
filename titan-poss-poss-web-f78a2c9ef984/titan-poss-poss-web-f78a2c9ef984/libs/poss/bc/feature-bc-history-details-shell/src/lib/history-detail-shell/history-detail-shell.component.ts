import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { getBillCancelHistoryRouteUrl } from '@poss-web/shared/util-site-routes';
@Component({
  selector: 'poss-web-history-detail-shell',
  templateUrl: './history-detail-shell.component.html'
})
export class HistoryDetailShellComponent  {
  hasNotification = true;
  constructor(private router: Router) {}



  back() {
    this.router.navigate([getBillCancelHistoryRouteUrl()], {
      state: { clearFilter: false }
    });
  }
}
