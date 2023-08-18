import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import {
  TepTypesEnum,
  TepShellEnum,
  SalesMenuKeyEnum
} from '@poss-web/shared/models';
import { getSalesHomePageUrl } from '@poss-web/shared/util-site-routes';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '@poss-web/shared/auth/feature-auth';

@Component({
  selector: 'poss-web-tep-request-shell',
  templateUrl: './tep-request-shell.component.html'
})
export class TepRequestShellComponent implements OnInit, OnDestroy {
  tepTypesEnum = TepTypesEnum;
  tab: string;
  destroy$: Subject<null> = new Subject<null>();
  hasNotification: false;
  isLoggedIn: boolean;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public translate: TranslateService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService
      .isUserLoggedIn()
      .pipe(takeUntil(this.destroy$))
      .subscribe((isLoggedIn: boolean) => {
        this.isLoggedIn = isLoggedIn;
      });

    this.changeTab(this.activatedRoute.snapshot.params[TepShellEnum.TAB]);
  }

  changeTab(newTab: TepTypesEnum) {
    if (this.tab !== newTab) {
      this.tab = newTab;

      this.router.navigate(['..', this.tab], {
        relativeTo: this.activatedRoute,
        state: { clearFilter: true }
      });
    }
  }

  back() {
    this.router.navigate([getSalesHomePageUrl()], {
      queryParams: {
        menu: SalesMenuKeyEnum.REQUEST_APPROVALS_STATUS
      }
    });
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
