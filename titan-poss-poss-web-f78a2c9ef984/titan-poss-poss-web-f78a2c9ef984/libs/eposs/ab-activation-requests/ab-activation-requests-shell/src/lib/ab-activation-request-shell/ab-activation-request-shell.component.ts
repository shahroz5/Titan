import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, Event } from '@angular/router';
import { ApprovalsMenuKeyEnum } from '@poss-web/shared/models';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { AuthService } from '@poss-web/shared/auth/feature-auth';
import {
  getApprovalsAdvanceBookingActivationUrl,
  getApprovalsHomeRouteUrl
} from '@poss-web/shared/util-site-routes';

@Component({
  selector: 'poss-web-ab-activation-request-shell',
  templateUrl: './ab-activation-request-shell.component.html',
  styleUrls: []
})
export class AbActivationRequestShellComponent implements OnInit {
  tab = 'requests';

  destroy$: Subject<null> = new Subject<null>();
  isLoggedIn: boolean;
  hasNotification = true;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService
      .isUserLoggedIn()
      .pipe(takeUntil(this.destroy$))
      .subscribe((isLoggedIn: boolean) => {
        this.isLoggedIn = isLoggedIn;
      });

    this.router.events
      .pipe(
        filter(
          (event: Event) => event instanceof NavigationEnd && this.isLoggedIn
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        const tab = this.activatedRoute.snapshot.params['tab'];
        this.changeTab(tab);
      });
    this.tab = this.activatedRoute.snapshot.params['tab'];
    this.changeTab(this.tab);
  }

  changeTab(newTab: any) {
    if (this.tab !== newTab) {
      this.tab = newTab;


      this.router.navigate([getApprovalsAdvanceBookingActivationUrl(this.tab)]);
    }
  }

  back() {

    this.router.navigate([getApprovalsHomeRouteUrl()], {
      queryParams: {
        menu: ApprovalsMenuKeyEnum.CUSTOMER_TRANSACTION_MENU_KEY
      }
    });
  }
}
