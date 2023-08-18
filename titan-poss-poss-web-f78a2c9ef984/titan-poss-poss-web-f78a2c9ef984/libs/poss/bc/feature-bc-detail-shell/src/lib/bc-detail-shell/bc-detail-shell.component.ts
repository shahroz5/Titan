import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { getBillCancelRouteUrl } from '@poss-web/shared/util-site-routes';

@Component({
  selector: 'poss-web-bc-detail-shell',
  templateUrl: './bc-detail-shell.component.html',
})
export class BcDetailShellComponent  {
  hasNotification = true;
  constructor(private router: Router) {}



  back() {
    this.router.navigate([getBillCancelRouteUrl()]);
  }
}
