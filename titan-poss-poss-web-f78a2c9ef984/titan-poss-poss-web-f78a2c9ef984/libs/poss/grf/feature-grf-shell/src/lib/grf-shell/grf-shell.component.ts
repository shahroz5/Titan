import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import {
  CommomStateAttributeTypeEnum,
  GoldRateFreezeEnumTypes,
  SalesMenuKeyEnum,
  StatusTypesEnum
} from '@poss-web/shared/models';
import {
  getGrfOpenHoldUrl,
  getManualGrfOpenHoldUrl,
  getSalesHomePageUrl,
  Routes
} from '@poss-web/shared/util-site-routes';
import { AuthService } from '@poss-web/shared/auth/feature-auth';
import { PermissionFacade } from '@poss-web/shared/permission/data-access-permission';
import { ElementPermissionService } from '@poss-web/shared/permission/util-element-permissions';

@Component({
  selector: 'poss-web-grf-shell',
  templateUrl: './grf-shell.component.html',
  styleUrls: []
})
export class GrfShellComponent implements OnInit, OnDestroy {
  goldRateFreezeTypesEnum = GoldRateFreezeEnumTypes;
  tab: string;
  destroy$: Subject<null> = new Subject<null>();
  hasNotification = true;
  salesRoute = `/${Routes['R257']}`;
  orderNumber: number;
  status: StatusTypesEnum;
  isLoggedIn: boolean;
  StatusTypesEnumRef = StatusTypesEnum;
  docType = 'MERGE_GRF';
  fileUploadTitle = 'Consent Form/ Photo ID Upload';
  fileType = 'OTHERS';
  commomStateAttributeTypeEnum = CommomStateAttributeTypeEnum;
  permissions$: Observable<any[]>;

  GRF_ADD_EDIT_SUBMENU = 'Customer Transaction Status-GRF Add/Edit Submenu';
  GRF_MERGE_SUBMENU = 'Customer Transaction Status-GRF Merge Submenu';
  GRF_HISTORY_SUBMENU = 'Customer Transaction Status-GRF History Submenu';
  GRF_VIEW_SUBMENU = 'Customer Transaction Status-GRF View Submenu';

  constructor(
    public router: Router,
    private activatedRoute: ActivatedRoute,
    public translate: TranslateService,
    public authService: AuthService,
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
    //   this.changeTab(
    //     this.activatedRoute.snapshot.params[GoldRateFreezeShellEnum.TAB]
    //   );
    // }
  }

  loadPermission = (element: string) =>
    this.elementPermission.loadPermission(element, this.permissions$);

  // changeTab(newTab: GoldRateFreezeEnumTypes) {
  //   if (this.tab !== newTab) {
  //     this.tab = newTab;

  //     this.router.navigate(['..', this.tab], {
  //       relativeTo: this.activatedRoute
  //     });
  //   }
  // }

  enablePayment(): boolean {
    // const isPaymentEnabled =
    //   this.tab === this.goldRateFreezeTypesEnum.NEW_GRF ? true : false;

    const isPaymentEnabled =
      this.router.url.includes(this.goldRateFreezeTypesEnum.NEW_GRF) ||
      this.router.url.includes(this.goldRateFreezeTypesEnum.MANUAL_GRF)
        ? true
        : false;
    return isPaymentEnabled;
  }

  onSelected(eventId: string) {
    if (this.router.url.includes(this.goldRateFreezeTypesEnum.MANUAL_GRF)) {
      this.router.navigate([getManualGrfOpenHoldUrl(eventId)]);
    } else {
      this.router.navigate([getGrfOpenHoldUrl(eventId)]);
    }
  }

  back() {
    this.router.navigate([getSalesHomePageUrl()], {
      queryParams: {
        menu: SalesMenuKeyEnum.CUSTOMER_TRANSACTION_MENU_KEY
      }
    });
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
