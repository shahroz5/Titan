import { ProfileDataFacade } from '@poss-web/shared/profile/data-access-profile';
import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  AfterViewInit,
  ElementRef
} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil, take, filter, withLatestFrom } from 'rxjs/operators';
import { Router } from '@angular/router';

import {
  getInStockHomeRouteUrl,
  getStockReceiveDefaultRouteUrl,
  getStockIssueL1L2RouteUrl,
  getStockIssueL3RouteUrl
} from '@poss-web/shared/util-site-routes';
import {
  CustomErrors,
  OverlayNotificationServiceAbstraction,
  Command,
  ShortcutServiceAbstraction,
  OverlayNotificationType
} from '@poss-web/shared/models';
import { InventoryHomeFacade } from '@poss-web/eposs/inventory-home/data-access-inventory-home';
import { FocusableListDirective } from '@poss-web/shared/components/ui-focusable-list';
import { ElementPermissionService } from '@poss-web/shared/permission/util-element-permissions';
import { PermissionFacade } from '@poss-web/shared/permission/data-access-permission';
import { PermissionService } from '@poss-web/shared/permission/ui-permission';

const componentName = 'InventoryHomeComponent';
const commonComponent = 'Common';

@Component({
  selector: 'poss-web-inventory-home',
  templateUrl: './inventory-home.component.html',
  styleUrls: ['./inventory-home.component.scss']
})
export class InventoryHomeComponent
  implements OnInit, OnDestroy, AfterViewInit {
  stockTransferNoteCount$: Observable<number>;
  receiveInvoiceCount$: Observable<number>;
  storeType: string;
  destroy$: Subject<null> = new Subject<null>();

  issueTransferNoteCount$: Observable<number>;
  issueInvoiceCount$: Observable<number>;

  isL1L2Store: boolean;
  isL3Store: boolean;

  permissions$: Observable<any[]>;

  @ViewChild(FocusableListDirective, { static: true })
  focusableListDirectiveRef: FocusableListDirective;

  @ViewChild('parent', { static: true }) parent: ElementRef;

  STOCK_ISSUE_CARD_L1L2 = 'Inventory Home - Stock Issue Card L1L2';
  STOCK_ISSUE_CARD_L3 = 'Inventory Home - Stock Issue  Card L3';
  STOCK_ISSUE_REQ_COUNT_L1L2 =
    'Inventory Home - Stock Issue L1L2 Request Count';

  STOCK_RECEIVE_REQ_CARD = 'Inventory Home - Stock Receive Request Card';
  STOCK_RECEIVE_REQ_COUNT_L1L2 =
    'Inventory Home - Stock Receive Request Count L1L2';
  STOCK_RECEIVE_REQ_COUNT_L3 =
    'Inventory Home - Stock Receive Request Count L3';

  IN_STOCK_MANAGEMENT_CARD = 'Inventory Home - In-Stock Management Card';

  constructor(
    private inventoryHomeFacade: InventoryHomeFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private router: Router,
    private shortcutService: ShortcutServiceAbstraction,
    private profiledatafacade: ProfileDataFacade,
    private elementPermission: ElementPermissionService,
    private permissionfacade: PermissionFacade,
    private permissionService: PermissionService
  ) {}

  ngOnInit() {
    this.permissions$ = this.permissionfacade.getPermissionforURL();
    this.profiledatafacade
      .getBoutiqueType()
      .pipe(
        filter((val: string) => !!val),
        withLatestFrom(
          this.profiledatafacade.isL1Boutique(),
          this.profiledatafacade.isL2Boutique(),
          this.profiledatafacade.isL3Boutique()
        ),
        take(1)
      )
      .subscribe(([val, val1, val2, val3]) => {
        this.storeType = val;
        this.isL1L2Store = val1 || val2;
        this.isL3Store = val3;
        this.componentInit();
      });

    this.inventoryHomeFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        if (error) {
          this.errorHandler(error);
        }
      });

    this.profiledatafacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe(profileError => {
        if (profileError) {
          this.errorHandler(profileError);
        }
      });
    this.shortcutService.componentNames = [componentName]; 
    this.shortcutService.commands
      .pipe(takeUntil(this.destroy$))
      .subscribe(command => {
        this.shortcutEventHandler(command);
      });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.focusableListDirectiveRef.focus();
    }, 100);
  }

  componentInit() {
    this.stockTransferNoteCount$ = this.inventoryHomeFacade.getPendingSTNCount();
    this.receiveInvoiceCount$ = this.inventoryHomeFacade.getReceiveInvoiceCount();
    this.issueTransferNoteCount$ = this.inventoryHomeFacade.getPendingIssueSTNCount();

    this.elementPermission
      .loadPermission(this.STOCK_RECEIVE_REQ_COUNT_L1L2, this.permissions$)
      .pipe(
        filter(data => !!data.transactionCodes),
        takeUntil(this.destroy$)
      )
      .subscribe(data => {
        const hasRequestPermission = data.transactionCodes.find(key =>
          this.permissionService.hasPermission(key)
        );
        if (hasRequestPermission) {
          this.inventoryHomeFacade.loadStockTransferNoteCount();
        }
      });

    this.elementPermission
      .loadPermission(this.STOCK_RECEIVE_REQ_COUNT_L3, this.permissions$)
      .pipe(
        filter(data => !!data.transactionCodes),
        takeUntil(this.destroy$)
      )
      .subscribe(data => {
        const hasRequestPermission = data.transactionCodes.find(key =>
          this.permissionService.hasPermission(key)
        );
        if (hasRequestPermission) {
          this.inventoryHomeFacade.loadReceiveInvoiceCount();
        }
      });

    this.elementPermission
      .loadPermission(this.STOCK_ISSUE_REQ_COUNT_L1L2, this.permissions$)
      .pipe(
        filter(data => !!data.transactionCodes),
        takeUntil(this.destroy$)
      )
      .subscribe(data => {
        const hasRequestPermission = data.transactionCodes.find(key =>
          this.permissionService.hasPermission(key)
        );
        if (hasRequestPermission) {
          this.inventoryHomeFacade.LoadIssueSTNCount();
        }
      });
  }

  stockReceiveUrl() {
    this.router.navigate([getStockReceiveDefaultRouteUrl()]);
  }

  inStockUrl() {
    this.router.navigate([getInStockHomeRouteUrl()]);
  }

  // TODO : call default path of stock issue. remove dependecy on isL1L2
  stockIssueUrl() {
    if (this.isL1L2Store) {
      this.router.navigate([getStockIssueL1L2RouteUrl()]);
    } else {
      // const url = getStockReturnRouteUrl(this.defaultStockReturnPath);
      this.router.navigate([getStockIssueL3RouteUrl()]);
    }
  }

  /**
   * method to handle shortcut commands
   * @param command: shortcut command
   */
  shortcutEventHandler(command: Command) {
    const commandName = command.name.split('.', 1);
    if (commandName[0] === commonComponent) {
      const menuCount = Number(command.name.split('_').pop());
      if (
        !isNaN(menuCount) &&
        menuCount <= this.parent.nativeElement.children.length
      ) {
        switch (this.parent.nativeElement.children[menuCount - 1].id) {
          case 'receive': {
            this.stockReceiveUrl();
            break;
          }
          case 'instock': {
            this.inStockUrl();
            break;
          }
          case 'issue': {
            this.stockIssueUrl();
            break;
          }
        }
      }
    } 
  }

  errorHandler(error: CustomErrors) {
    this.overlayNotification
      .show({
        type: OverlayNotificationType.ERROR,
        hasClose: true, // optional
        error: error
      })
      .events.pipe(take(1))
      .subscribe();
  }

  loadPermission = (element: string) =>
    this.elementPermission.loadPermission(element, this.permissions$);


  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
