import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { getInventoryHomeRouteUrl } from '@poss-web/shared/util-site-routes';

@Component({
  selector: 'poss-web-stock-receive-shell',
  templateUrl: './stock-receive-shell.component.html'
})
export class StockReceiveShellComponent {
  constructor(private router: Router) {}


  back() {
    this.router.navigate([getInventoryHomeRouteUrl()]);
  }
}
