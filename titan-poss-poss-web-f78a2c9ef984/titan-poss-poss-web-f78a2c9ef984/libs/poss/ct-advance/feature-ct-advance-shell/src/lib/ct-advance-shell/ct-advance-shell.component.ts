import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import {
  BodEodStatusEnum,
  CommomStateAttributeTypeEnum,
  CtAdvanceTabsEnum,
  SalesMenuKeyEnum,
  StatusTypesEnum
} from '@poss-web/shared/models';
import {
  getAdvanceOpenHoldUrl,
  getHomePageUrl,
  getSalesHomePageUrl
} from '@poss-web/shared/util-site-routes';
import { AuthService } from '@poss-web/shared/auth/feature-auth';
import { SharedBodEodFacade } from '@poss-web/shared/bod-eod/data-access-bod-eod';
import { PermissionFacade } from '@poss-web/shared/permission/data-access-permission';
import { ElementPermissionService } from '@poss-web/shared/permission/util-element-permissions';

@Component({
  selector: 'poss-web-ct-advance-shell',
  templateUrl: './ct-advance-shell.component.html',
  styleUrls: []
})
export class CtAdvanceShellComponent implements OnInit, OnDestroy {
  ctAdvanceTabsEnum = CtAdvanceTabsEnum;
  tab: string;
  destroy$: Subject<null> = new Subject<null>();
  hasNotification = true;
  id: string;
  orderNumber: number;
  status: StatusTypesEnum;
  isLoggedIn: boolean;
  StatusTypesEnumRef = StatusTypesEnum;
  bodEodStatus: string;
  isGoldRateAvailable: boolean;
  commomStateAttributeTypeEnum = CommomStateAttributeTypeEnum;
  permissions$: Observable<any[]>;

  currentItem = 'Customer Transaction Status-Accept Advance Add/Edit Submenu';
  ACCEPT_ADVANCE_VIEW_SUBMENU =
    'Customer Transaction Status-Accept Advance View Submenu';
  ACCEPT_ADVANCE_HISTORY_SUBMENU =
    'Customer Transaction Status-Accept Advance History Submenu';
  ACCEPT_ADVANCE_ADD_EDIT_SUBMENU =
    'Customer Transaction Status-Accept Advance Add/Edit Submenu';

  constructor(
    public router: Router,
    private activatedRoute: ActivatedRoute,
    public translate: TranslateService,
    public authService: AuthService,
    private sharedBodEodFacade: SharedBodEodFacade,
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

    this.sharedBodEodFacade
      .getBodEodStatus()
      .pipe(
        filter(BodEodStatus => !!BodEodStatus),
        takeUntil(this.destroy$)
      )
      .subscribe(bodEodStatus => {
        this.bodEodStatus = bodEodStatus;
      });

    this.sharedBodEodFacade
      .getGoldRateAvailablityStatus()
      .pipe(takeUntil(this.destroy$))
      .subscribe(goldRateAvailable => {
        this.isGoldRateAvailable = goldRateAvailable;
      });

    // this.router.events
    //   .pipe(
    //     filter(
    //       (event: Event) => event instanceof NavigationEnd && this.isLoggedIn
    //     ),
    //     takeUntil(this.destroy$)
    //   )
    //   .subscribe(() => {
    //     const tab = this.activatedRoute.snapshot.params['tab'];
    //     this.changeTab(tab);
    //   });

    // if (this.isLoggedIn) {
    //   this.changeTab(this.activatedRoute.snapshot.params['tab']);
    // }
  }

  loadPermission = (element: string) =>
    this.elementPermission.loadPermission(element, this.permissions$);

  // changeTab(newTab: any) {
  //   if (this.tab !== newTab) {
  //     this.tab = newTab;
  //     this.router.navigate(['..', this.tab], {
  //       relativeTo: this.activatedRoute
  //     });
  //   }
  // }

  enablePayment(): boolean {
    // const isPaymentEnabled =
    //   this.tab === this.ctAdvanceTabsEnum.ACCEPT_ADVANCE ||
    //   this.tab === this.ctAdvanceTabsEnum.HISTORY
    //     ? true
    //     : false;

    const isPaymentEnabled = this.router.url.includes(
      this.ctAdvanceTabsEnum.ACCEPT_ADVANCE
    )
      ? true
      : false;
    return isPaymentEnabled;
  }

  onSelected(eventId: string) {
    this.router.navigate([getAdvanceOpenHoldUrl(eventId)]);
  }

  back() {
    if (
      this.bodEodStatus === BodEodStatusEnum.OPEN &&
      this.isGoldRateAvailable
    ) {
      this.router.navigate([getSalesHomePageUrl()], {
        queryParams: {
          menu: SalesMenuKeyEnum.CUSTOMER_TRANSACTION_MENU_KEY
        }
      });
    } else {
      this.router.navigate([getHomePageUrl()]);
    }
  }

  selectedOrderNumber(event: { orderNo: number; status: StatusTypesEnum }) {
    this.orderNumber = event.orderNo;
    this.status = event.status;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
