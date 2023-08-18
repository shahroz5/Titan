import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { getGiftCardsHistoryListingPageUrl } from '@poss-web/shared/util-site-routes';

@Component({
  selector: 'poss-web-gift-cards-history-details-shell',
  templateUrl: './gift-cards-history-details-shell.component.html',
  styleUrls: ['./gift-cards-history-details-shell.component.scss']
})
export class GiftCardsHistoryDetailsShellComponent {
  hasNotification = true;
  constructor(private router: Router) {}

  back() {
    this.router.navigate([getGiftCardsHistoryListingPageUrl()], {
      state: { clearFilter: false }
    });
  }
}
