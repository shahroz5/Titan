import { Component } from '@angular/core';
import { getGEPHistoryUrl } from '@poss-web/shared/util-site-routes';
import { Router} from '@angular/router';

@Component({
  selector: 'poss-web-gep-view-shell',
  templateUrl: './gep-view-shell.component.html'
})
export class GepViewShellComponent  {
  hasNotification = true;
  constructor(private router: Router) {}



  back() {
    this.router.navigate([getGEPHistoryUrl()], {
      state: { clearFilter: false }
    });
  }
}
