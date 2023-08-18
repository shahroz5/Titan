import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, Event } from '@angular/router';
import { BCTabsEnum, SalesMenuKeyEnum } from '@poss-web/shared/models';
import { Subject, Observable } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import {
  getCMBillCancelRouteUrl,
  getSalesHomePageUrl,
  getBillCancelRouteUrl
} from '@poss-web/shared/util-site-routes';
import { AuthService } from '@poss-web/shared/auth/feature-auth';
import { PermissionFacade } from '@poss-web/shared/permission/data-access-permission';
import { ElementPermissionService } from '@poss-web/shared/permission/util-element-permissions';

@Component({
  selector: 'poss-web-bc-shell',
  templateUrl: './bc-shell.component.html'
})
export class BcShellComponent implements OnInit, OnDestroy {
  tab: BCTabsEnum;
  destroy$: Subject<null> = new Subject<null>();
  BCTabsEnumRef = BCTabsEnum;
  isLoggedIn: boolean;
  permissions$: Observable<any[]>;

  BILL_CANCELLATION_REQUEST_VIEW_SUBMENU =
    'Customer Transaction Status-Bill Cancellation Request/View Submenu';
  BILL_CANCELLATION_HISTORY_SUBMENU =
    'Customer Transaction Status-Bill Cancellation History Submenu';

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private permissionfacade: PermissionFacade,
    private elementPermission: ElementPermissionService
  ) {}

  ngOnInit(): void {
    this.permissions$ = this.permissionfacade.getPermissionforURL();
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
    this.changeTab(this.activatedRoute.snapshot.params['tab']);
  }

  loadPermission = (element: string) =>
    this.elementPermission.loadPermission(element, this.permissions$);

  changeTab(newTab: BCTabsEnum) {
    if (this.tab !== newTab) {
      this.tab = newTab;
      if (this.tab) {
        this.router.navigate([getCMBillCancelRouteUrl(this.tab)]);
      } else {
        this.router.navigate([getBillCancelRouteUrl()]);
      }
    }
  }

  back() {
    this.router.navigate([getSalesHomePageUrl()], {
      queryParams: {
        menu: SalesMenuKeyEnum.CUSTOMER_TRANSACTION_MENU_KEY
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
