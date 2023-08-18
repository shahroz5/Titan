import { Component, OnDestroy, OnInit } from '@angular/core';
import { Event, NavigationEnd, Router } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import {
  CashMemoTypesEnum,
  SalesMenuKeyEnum,
  StatusTypesEnum,
  TransactionTypeEnum,
  ShortcutServiceAbstraction,
  Command,
  CommomStateAttributeTypeEnum
} from '@poss-web/shared/models';
import {
  getCashMemoIdUrl,
  getManualCashMemoIdUrl,
  getSalesHomePageUrl,
  getCashMemoUrl,
  getManualCashMemoUrl,
  getCashMemoHistory
} from '@poss-web/shared/util-site-routes';
import { AuthFacade } from '@poss-web/shared/auth/data-access-auth';
import { ScrollService } from '@poss-web/shared/util-common';
import { TranslateService } from '@ngx-translate/core';
import { CashMemoFacade } from '@poss-web/poss/cash-memo/data-access-cash-memo';
import { ElementPermissionService } from '@poss-web/shared/permission/util-element-permissions';
import { PermissionFacade } from '@poss-web/shared/permission/data-access-permission';

const backShortcutKey = 'CashMemoShellComponent.BACK';
const focusPanelShortcutKey = 'ShortcutPanelComponent.FOCUS_PANEL';
const cashMemoShellComponentKey = 'CashMemoShellComponent';
const productSearchAutocompleteComponentKey =
  'ProductSearchAutocompleteComponent';
const productGridComponentKey = 'ProductGridComponent';
const toolbarComponentKey = 'ToolbarComponent';
const customerSearchContainerComponentKey = 'CustomerSearchContainerComponent';
const customerSearchComponentKey = 'CustomerSearchComponent';
const cashMemoHistoryComponentKey = 'CashMemoHistoryComponent';
const shortcutPanelComponentKey = 'ShortcutPanelComponent';
const tab1ShortcutKey = 'Common.TAB_1';
const tab2CMShortcutKey = 'Common.TAB_2';
const tab3ShortcutKey = 'Common.TAB_3';

@Component({
  templateUrl: './cash-memo-shell.component.html',
  styleUrls: ['./cash-memo-shell.component.scss']
})
export class CashMemoShellComponent implements OnInit, OnDestroy {
  cashMemoTypesEnumRef = CashMemoTypesEnum;
  destroy$: Subject<null> = new Subject<null>();
  permissions$: Observable<any[]>;
  hasNotification = true;
  transactionType = TransactionTypeEnum;
  orderNumber: number;
  status: StatusTypesEnum;
  isLoggedIn: boolean;
  StatusTypesEnumRef = StatusTypesEnum;

  typesAllowedForPayment = [
    CashMemoTypesEnum.CM,
    CashMemoTypesEnum.MANUAL_BILL,
    CashMemoTypesEnum.AB
  ];

  typesAllowedForProduct = [
    CashMemoTypesEnum.CM,
    CashMemoTypesEnum.MANUAL_BILL
  ];
  fileUploadTitleText: string;
  fileType = 'OTHERS';

  commomStateAttributeTypeEnum = CommomStateAttributeTypeEnum;
  panelCount = 6;
  selectedPanel = 0;

  setPanelFocus$: Subject<boolean> = new Subject<boolean>();

  currentItem = 'Customer Transaction Status-Cashmemo Add/Edit Submenu';
  CASH_MEMO_ADD_EDIT_SUBMENU =
    'Customer Transaction Status-Cashmemo Add/Edit Submenu';
  CASH_MEMO_MANUAL_BILL_SUBMENU =
    'Customer Transaction Status-Create Cashmemo Manual Bill Submenu';
  CASH_MEMO_HISTORY_SUBMENU =
    'Customer Transaction Status-Cashmemo History Submenu';
  CASH_MEMO_VIEW_NEW_CM_SUBMENU =
    'Customer Transaction Status-Cashmemo View Submenu';
  CASH_MEMO_VIEW_PAYMENT_SUBMENU =
    'Customer Transaction Status-Cashmemo View Payment Submenu';

  constructor(
    public router: Router,
    public authFacade: AuthFacade,
    private shortcutService: ShortcutServiceAbstraction,
    public scrollService: ScrollService,
    private translate: TranslateService,
    private cashMemoFacade: CashMemoFacade,
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
    this.authFacade
      .isUserLoggedIn()
      .pipe(takeUntil(this.destroy$))
      .subscribe((isLoggedIn: boolean) => {
        console.log('CashMemoShell: isLoggedIn:', isLoggedIn);
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
        this.setShortcutComponentNames();
      });

    this.setShortcutComponentNames();
    this.shortcutService.commands
      .pipe(takeUntil(this.destroy$))
      .subscribe(command => {
        this.shortcutEventHandler(command);
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
    if (this.router.url.includes('manual-bill'))
      this.router.navigate([getManualCashMemoIdUrl(eventId)]);
    else this.router.navigate([getCashMemoIdUrl(eventId)]);
  }

  selectedOrderNumber(event: { orderNo: number; status: StatusTypesEnum }) {
    this.orderNumber = event.orderNo;
    this.status = event.status;
  }

  /**
   * method to handle shortcut commands
   * @param command: shortcut command
   */
  shortcutEventHandler(command: Command) {
    switch (command.name) {
      case backShortcutKey: {
        this.possHomeUrl();
        break;
      }

      case focusPanelShortcutKey: {
        this.setPanelFocus$.next(true);
        break;
      }

      case tab1ShortcutKey: {
        this.router.navigate([getCashMemoUrl()]);
        break;
      }

      case tab2CMShortcutKey: {
        this.router.navigate([getManualCashMemoUrl()]);
        break;
      }

      case tab3ShortcutKey: {
        this.router.navigate([getCashMemoHistory()]);
        break;
      }
    }
  }

  scrollUp() {
    document.getElementsByTagName('mat-sidenav-content')[0].scroll({
      top: 0,
      behavior: 'smooth'
    });
  }

  focusSelectedPanel(event) {
    setTimeout(() => {
      this.selectedPanel = 0;
      this.cashMemoFacade.setFocus(0);
    }, 10);

    console.log('focusSelectedPanel', event);
    this.selectedPanel = event;
    this.cashMemoFacade.setFocus(this.selectedPanel);
  }

  // setting component names to launch shortcut help popup
  setShortcutComponentNames() {
    if (!this.router.url.includes('history')) {
      this.shortcutService.componentNames = [
        cashMemoShellComponentKey,
        productSearchAutocompleteComponentKey,
        productGridComponentKey,
        toolbarComponentKey,
        customerSearchContainerComponentKey,
        customerSearchComponentKey,
        shortcutPanelComponentKey
      ];
    } else if (
      this.router.url.includes('history') &&
      !(
        this.router.url.includes('regular') ||
        this.router.url.includes('manual')
      )
    ) {
      this.shortcutService.componentNames = [
        cashMemoShellComponentKey,
        cashMemoHistoryComponentKey
      ];
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
