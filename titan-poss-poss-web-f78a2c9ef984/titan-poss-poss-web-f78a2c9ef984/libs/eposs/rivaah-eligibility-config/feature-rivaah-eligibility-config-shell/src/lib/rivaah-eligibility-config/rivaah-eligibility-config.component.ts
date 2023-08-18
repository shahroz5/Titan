import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@poss-web/shared/auth/feature-auth';
import { ConfigurationsMenuKeyEnum } from '@poss-web/shared/models';
import { getConfigurationHomeRouteUrl } from '@poss-web/shared/util-site-routes';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-rivaah-eligibility-config',
  templateUrl: './rivaah-eligibility-config.component.html'
})
export class RivaahEligibilityConfigComponent implements OnInit, OnDestroy {
  destroy$: Subject<null> = new Subject<null>();
  isLoggedIn: boolean;

  constructor(
    public router: Router,
    private authService: AuthService,
    ) { }

  ngOnInit(): void {
    this.authService
      .isUserLoggedIn()
      .pipe(takeUntil(this.destroy$))
      .subscribe((isLoggedIn: boolean) => {
        this.isLoggedIn = isLoggedIn;
      });
  }

  back() {
    this.router.navigate([getConfigurationHomeRouteUrl()], {
      queryParams: {
        menu: ConfigurationsMenuKeyEnum.DISCOUNTS
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
