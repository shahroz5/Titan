import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import {
  TepTypesEnum,
  StatusTypesEnum,
  SalesMenuKeyEnum,
  CommomStateAttributeTypeEnum
} from '@poss-web/shared/models';
import {
  Routes,
  getCreateTepUrl,
  getCutPieceTepUrl,
  getManualTepUrl,
  getSalesHomePageUrl
} from '@poss-web/shared/util-site-routes';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '@poss-web/shared/auth/feature-auth';
import { ElementPermissionService } from '@poss-web/shared/permission/util-element-permissions';
import { PermissionFacade } from '@poss-web/shared/permission/data-access-permission';

@Component({
  selector: 'poss-web-tep-shell',
  templateUrl: './tep-shell.component.html'
})
export class TepShellComponent implements OnInit, OnDestroy {
  tepTypesEnum = TepTypesEnum;
  tab: string;
  destroy$: Subject<null> = new Subject<null>();
  hasNotification = true;
  salesRoute = `/${Routes['R257']}`;
  orderNumber: number;
  status: StatusTypesEnum;
  StatusTypesEnumRef = StatusTypesEnum;
  isLoggedIn: boolean;
  onHoldTime: any;
  onHoldId: string = null;
  showOrderNumber: boolean;
  fileUploadTitle =
    'Upload Approval Mail/ ID proof and Cancelled cheque/ Bank Passbook';
  fileType = 'OTHERS';
  commomStateAttributeTypeEnum = CommomStateAttributeTypeEnum;
  permissions$: Observable<any[]>;

  TEP_ADD_EDIT_SUBMENU = 'Customer Transaction Status-TEP Add/Edit Submenu';
  TEP_VIEW_SUBMENU = 'Customer Transaction Status-TEP View Submenu';
  TEP_HISTORY_SUBMENU = 'Customer Transaction Status-TEP History Submenu';
  TEP_MANUAL_GEP_VIEW_SUBMENU =
    'Customer Transaction Status-TEP View Manual TEP Submenu';
  TEP_CANCEL_SUBMENU = 'Customer Transaction Status-TEP Cancel Submenu';

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public translate: TranslateService,
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
  }

  loadPermission = (element: string) =>
    this.elementPermission.loadPermission(element, this.permissions$);

  // changeTab(newTab: TepTypesEnum) {
  //   if (this.tab !== newTab) {
  //     this.tab = newTab;
  //     this.router.navigate(['..', this.tab], {
  //       relativeTo: this.activatedRoute
  //     });
  //   }
  // }

  onSelected(eventId: string) {
    console.log('ON SELECTED :', eventId);
    if (this.router.url.includes('create-tep')) {
      this.router.navigate([getCreateTepUrl(eventId)]);
    } else if (this.router.url.includes('cut-piece-tep')) {
      this.router.navigate([getCutPieceTepUrl(eventId)]);
    } else if (this.router.url.includes('manual-tep')) {
      this.router.navigate([getManualTepUrl(eventId)]);
    }
  }

  onSelectedOnHold(event) {
    this.onHoldId = event.id;
    this.onHoldTime = event.lastHoldTime;
    this.orderNumber = event.docNo;
    this.status = StatusTypesEnum.HOLD;
    // this.router.navigate(['sales/gep/', this.tab, event.id]);
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
    if (this.orderNumber > 0) {
      this.showOrderNumber = true;
    } else {
      this.showOrderNumber = false;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
