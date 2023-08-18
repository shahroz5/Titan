import { CommonFacade } from '@poss-web/shared/common/data-access-common';
import {
  GepTransactionTypesEnum,
  StatusTypesEnum,
  CommomStateAttributeTypeEnum,
  SalesMenuKeyEnum,
  CommomStateAttributeNameEnum,
  TransactionTypeEnum
} from '@poss-web/shared/models';
import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '@poss-web/shared/auth/feature-auth';
import { getSalesHomePageUrl } from '@poss-web/shared/util-api-service';
import { ElementPermissionService } from '@poss-web/shared/permission/util-element-permissions';
import { PermissionFacade } from '@poss-web/shared/permission/data-access-permission';

@Component({
  selector: 'poss-web-gep-transaction',
  templateUrl: './gep-transaction.component.html',
  styleUrls: []
})
export class GepTransactionComponent implements OnInit {
  orderNumber = 0;
  tab: string;
  gepRef = GepTransactionTypesEnum;
  StatusTypesEnumRef = StatusTypesEnum;
  destroy$: Subject<null> = new Subject<null>();
  onHoldId: string = null;
  hasNotification = true;
  display = true;
  onHoldTime: any;
  openId: any;
  isLoggedIn: boolean;
  status: StatusTypesEnum;
  fileUploadTitle = 'Upload pre declaration form ';
  docType = TransactionTypeEnum.GEP;
  fileType = 'OTHERS';
  commomStateAttributeTypeEnum = CommomStateAttributeTypeEnum;
  permissions$: Observable<any[]>;

  GEP_ADD_EDIT_SUBMENU = 'Customer Transaction Status-GEP Add/Edit Submenu';
  GEP_VIEW_SUBMENU = 'Customer Transaction Status-GEP View Submenu';
  GEP_HISTORY_SUBMENU = 'Customer Transaction Status-GEP History Submenu';
  GEP_MANUAL_GEP_VIEW_SUBMENU =
    'Customer Transaction Status-GEP View Manual GEP Submenu';
  GEP_CANCEL_SUBMENU = 'Customer Transaction Status-GEP Cancel Submenu';

  constructor(
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private commonFacade: CommonFacade,
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
    // this.commonFacade
    //   .getComponentInstance()
    this.commonFacade

      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.GEP,
        CommomStateAttributeNameEnum.COMPONENT_INSTANCE
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(event => {
        if (event === 'listing' && this.tab === 'cancel') this.display = false;
        else this.display = true;
        console.log('EVENT IN GEP 345 :', event);
        console.log('DISPLAY :', this.display);
      });
  }

  loadPermission = (element: string) =>
    this.elementPermission.loadPermission(element, this.permissions$);

  onSelectedOnHold(event) {
    console.log(event, 'onhold');
    this.onHoldId = event.id;
    this.onHoldTime = event.lastHoldTime;
    this.orderNumber = event.docNo;
    console.log(this.onHoldId);
    this.status = StatusTypesEnum.HOLD;
    // this.commonFacade.setTransactionTD(event.id);
    this.commonFacade.setTransactionTD(event.id);

    // this.commonFacade.setTransactionConfig({
    //   txnId: event,
    //   status: 'HOLD'
    // });
    this.commonFacade.setTransactionConfig({
      txnId: event,
      status: 'HOLD'
    });
    // this.router.navigate(['sales/gep/', this.tab, event.id]);
  }

  onSelectedOpen(event) {
    console.log(event, 'openid');

    // this.commonFacade.setTransactionConfig({
    //   txnId: event,
    //   status: 'OPEN'
    // });
    this.commonFacade.setTransactionConfig({
      txnId: event,
      status: 'OPEN'
    });
  }

  back() {
    this.router.navigate([getSalesHomePageUrl()], {
      queryParams: {
        menu: SalesMenuKeyEnum.CUSTOMER_TRANSACTION_MENU_KEY
      }
    });
  }
}
