import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import {
  GiftCardsTypesEnum,
  StatusTypesEnum,
  SalesMenuKeyEnum,
  BodEodStatusEnum,
  CommomStateAttributeTypeEnum
} from '@poss-web/shared/models';
import {
  getGiftCardsSaleOpenHoldUrl,
  getHomePageUrl,
  getSalesHomePageUrl
} from '@poss-web/shared/util-site-routes';
import { AuthService } from '@poss-web/shared/auth/feature-auth';
import { SharedBodEodFacade } from '@poss-web/shared/bod-eod/data-access-bod-eod';
import { ElementPermissionService } from '@poss-web/shared/permission/util-element-permissions';
import { PermissionFacade } from '@poss-web/shared/permission/data-access-permission';

@Component({
  selector: 'poss-web-gift-cards-shell',
  templateUrl: './gift-cards-shell.component.html'
})
export class GiftCardsShellComponent implements OnInit, OnDestroy {
  giftCardsTypesEnum = GiftCardsTypesEnum;
  tab: string;
  destroy$: Subject<null> = new Subject<null>();
  hasNotification = true;
  isLoggedIn: boolean;
  orderNumber: number;
  status: StatusTypesEnum;
  StatusTypesEnumRef = StatusTypesEnum;
  bodEodStatus: string;
  isGoldRateAvailable: boolean;
  permissions$: Observable<any[]>;
  commomStateAttributeTypeEnum = CommomStateAttributeTypeEnum;

  GIFT_CARD_HISTORY_SUBMENU =
    'Customer Transaction Status-Gift Card History Submenu';
  GIFT_CARD_CANCEL = 'Customer Transaction Status-Gift Card Cancel Submenu';

  constructor(
    public router: Router,
    private activatedRoute: ActivatedRoute,
    public translate: TranslateService,
    private authService: AuthService,
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
    //     const tab = this.activatedRoute.snapshot.params[GiftCardShellEnum.TAB];
    //     this.changeTab(tab);
    //   });
    // if (this.isLoggedIn) {
    //   this.changeTab(
    //     this.activatedRoute.snapshot.params[GiftCardShellEnum.TAB]
    //   );
    // }
  }

  loadPermission = (element: string) =>
    this.elementPermission.loadPermission(element, this.permissions$);

  // changeTab(newTab: GiftCardsTypesEnum) {
  //   if (this.tab !== newTab) {
  //     this.tab = newTab;

  //     this.router.navigate(['..', this.tab], {
  //       relativeTo: this.activatedRoute
  //     });
  //   }
  // }

  enablePayment(): boolean {
    // const isPaymentEnabled =
    //   this.tab === this.giftCardsTypesEnum.GIFTCARD_SALE ||
    //   this.tab === this.giftCardsTypesEnum.GIFTCARD_CANCELLATION
    //     ? true
    //     : false;
    const isPaymentEnabled =
      this.router.url.includes('gift-cards/sale') ||
      this.router.url.includes('cancellation')
        ? true
        : false;
    return isPaymentEnabled;
  }

  onSelected(eventId: string) {
    this.router.navigate([getGiftCardsSaleOpenHoldUrl(eventId)]);
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
    console.log('EVENT 345 :', event);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
