import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '@poss-web/shared/auth/feature-auth';
import { CommonFacade } from '@poss-web/shared/common/data-access-common';
import {
  advanceBookingEnum,
  CommomStateAttributeTypeEnum,
  SalesMenuKeyEnum,
  ToolbarConfig,
  TransactionTypeEnum
} from '@poss-web/shared/models';
import { PermissionFacade } from '@poss-web/shared/permission/data-access-permission';
import { ElementPermissionService } from '@poss-web/shared/permission/util-element-permissions';
import { ScrollService } from '@poss-web/shared/util-common';
import {
  getManualAdvanceBookingDetailsUrl,
  getSalesHomePageUrl,
  getSelectedAdvanceBookingUrl
} from '@poss-web/shared/util-site-routes';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-advance-booking-shell',
  templateUrl: './advance-booking-shell.component.html',
  styleUrls: ['./advance-booking-shell.component.scss']
})
export class AdvanceBookingShellComponent implements OnInit, OnDestroy {
  tab: advanceBookingEnum;
  advanceBookingEnumRef = advanceBookingEnum;
  destroy$: Subject<null> = new Subject<null>();
  hasNotification = true;
  orderNumber = 0;
  transactionType = TransactionTypeEnum;
  minValue = 0;
  isLoggedIn: boolean;
  createCM$: Subject<boolean> = new Subject<boolean>();
  clearProductGrid$: Subject<null> = new Subject<null>();
  toolbarData: Subject<ToolbarConfig> = new Subject<ToolbarConfig>();
  commomStateAttributeTypeEnum = CommomStateAttributeTypeEnum;
  fileUploadTitleText: string;
  fileType = 'OTHERS';
  permissions$: Observable<any[]>;

  currentItem = 'Customer Transaction Status-AB Add/Edit Submenu';
  AB_ADD_EDIT_SUBMENU = 'Customer Transaction Status-AB Add/Edit Submenu';
  AB_VIEW_SUBMENU = 'Customer Transaction Status-AB View Submenu';
  AB_VIEW_PAYMENT_SUBMENU =
    'Customer Transaction Status-AB View Payment Submenu';

  constructor(
    public router: Router,
    public authService: AuthService,
    public scrollService: ScrollService,
    private translate: TranslateService,
    private commonFacade: CommonFacade,
    private permissionfacade: PermissionFacade,
    private elementPermission: ElementPermissionService
  ) {
    this.translate
      .get(['pw.cashMemoShell.fileUploadTitleText'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.fileUploadTitleText =
          translatedMessages['pw.cashMemoShell.fileUploadTitleText'];
      });
  }

  ngOnInit(): void {
    this.permissions$ = this.permissionfacade.getPermissionforURL();
    this.authService
      .isUserLoggedIn()
      .pipe(takeUntil(this.destroy$))
      .subscribe((isLoggedIn: boolean) => {
        console.log('AdvanceBookingShell: isLoggedIn:', isLoggedIn);
        this.isLoggedIn = isLoggedIn;
      });
  }

  loadPermission = (element: string) =>
    this.elementPermission.loadPermission(element, this.permissions$);

  possHomeUrl() {
    this.router.navigate([getSalesHomePageUrl()], {
      queryParams: {
        menu: SalesMenuKeyEnum.CUSTOMER_TRANSACTION_MENU_KEY
      }
    });
  }

  onSelected(eventId: string) {
    if (this.router.url.includes('manual'))
      this.router.navigate([getManualAdvanceBookingDetailsUrl(eventId)]);
    else this.router.navigate([getSelectedAdvanceBookingUrl(eventId)]);
  }

  selectedOrderNumber(event: number) {
    this.orderNumber = event;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onCreateCM(event) {
    this.createCM$.next(event);
  }
  scrollUp() {
    document.getElementsByTagName('mat-sidenav-content')[0].scroll({
      top: 0,
      behavior: 'smooth'
    });
  }
  clearProductGrid() {
    this.clearProductGrid$.next();
  }
}
