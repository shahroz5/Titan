import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef
} from '@angular/core';
import { Router } from '@angular/router';
import { Subject, combineLatest, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import {
  getInterBoutiqueTransferRouteUrl,
  getBintoBinTransferRouteUrl,
  getConversionRouteUrl,
  getInventoryHomeRouteUrl,
  getInterBoutiqueTransferDefaultRouteUrl,
  getBintoBinTransferDefaultRouteUrl,
  getConversionDefaultRouteUrl,
  getBinCreationRouteUrl,
  getBinCreationDefaultRouteUrl,
  getOtherIssuesReceiptsDefaultUrl,
  getUpdateHallmarkDetailsRouteUrl
} from '@poss-web/shared/util-site-routes';

import { ShortcutServiceAbstraction, Command } from '@poss-web/shared/models';
import { ProfileDataFacade } from '@poss-web/shared/profile/data-access-profile';
import { PermissionFacade } from '@poss-web/shared/permission/data-access-permission';
import { ElementPermissionService } from '@poss-web/shared/permission/util-element-permissions';

const backShortcutKey = 'InstockHomeComponent.BACK';
const componentName = 'InstockHomeComponent';
const menu1ShortcutKey = 'Common.MENU_1';
const menu2ShortcutKey = 'Common.MENU_2';
const menu3ShortcutKey = 'Common.MENU_3';
const menu4ShortcutKey = 'Common.MENU_4';
const menu5ShortcutKey = 'Common.MENU_5';

@Component({
  selector: 'poss-web-instock-home',
  templateUrl: './instock-home.component.html',
  styleUrls: ['./instock-home.component.scss']
})
export class InstockHomeComponent implements OnInit, OnDestroy {
  destroy$: Subject<null> = new Subject<null>();
  isL1L2Store: boolean;
  permissions$: Observable<any[]>;
  @ViewChild('menuRef') menuRef: ElementRef;

  IBT_SUBMENU = 'Inventory Instock Home - IBT SubMenu';
  BINTOBIN_TRANSFER_SUBMENU =
    'Inventory Instock Home - Bin to Bin transfer SubMenu';
  OTHER_ISSUE_OTHER_RECEIPT_MENU =
    'Inventory Instock Home - Other Receipt/Issue Menu';
  CONVERSION_SUBMENU = 'Inventory Instock Home - Conversion SubMenu';
  BIN_DETAILS_SUBMENU = 'Inventory Instock Home - Bin Details SubMenu';
  UPDATE_HALLMARK_SUBMENU = 'Inventory Instock Home - Update Hallmark Details SubMenu'

  constructor(
    private router: Router,
    private shortcutService: ShortcutServiceAbstraction,
    private profiledatafacade: ProfileDataFacade,
    private permissionfacade: PermissionFacade,
    private elementPermission: ElementPermissionService
  ) {
    combineLatest([
      this.profiledatafacade.isL1Boutique().pipe(takeUntil(this.destroy$)),
      this.profiledatafacade.isL2Boutique().pipe(takeUntil(this.destroy$))
    ]).subscribe(([val1, val2]) => {
      this.isL1L2Store = val1 || val2;
    });
  }

  ngOnInit() {
    this.permissions$ = this.permissionfacade.getPermissionforURL();
    this.shortcutService.componentNames = [componentName];
    this.shortcutService.commands
      .pipe(takeUntil(this.destroy$))
      .subscribe(command => {
        this.shortcutEventHandler(command);
      });
  }
  loadPermission = (element: string) =>
    this.elementPermission.loadPermission(element, this.permissions$);

  inventoryUrl() {
    this.router.navigate([getInventoryHomeRouteUrl()]);
  }

  interBoutiqueTransferUrl() {
    this.router.navigate([
      getInterBoutiqueTransferRouteUrl(
        getInterBoutiqueTransferDefaultRouteUrl()
      )
    ]);
  }

  bintobinTransferUrl() {
    this.router.navigate([
      getBintoBinTransferRouteUrl(getBintoBinTransferDefaultRouteUrl())
    ]);
  }

  binCreationUrl() {
    this.router.navigate([
      getBinCreationRouteUrl(getBinCreationDefaultRouteUrl())
    ]);
  }

  conversionUrl() {
    this.router.navigate([
      getConversionRouteUrl(getConversionDefaultRouteUrl())
    ]);
  }

  otherReceiptIssueUrl() {
    this.router.navigate([getOtherIssuesReceiptsDefaultUrl()]);
  }

  updateHallmarkUrl() {
    this.router.navigate([
      getUpdateHallmarkDetailsRouteUrl()
    ]);
  }

  /**
   * method to handle shortcut commands
   * @param command: shortcut command
   */
  shortcutEventHandler(command: Command) {
    let isMenu = false;
    const tabCount = Number(command.name.split('_').pop());
    if (
      (command.name === menu1ShortcutKey ||
        command.name === menu2ShortcutKey ||
        command.name === menu3ShortcutKey ||
        command.name === menu4ShortcutKey ||
        command.name === menu5ShortcutKey) &&
      !isNaN(tabCount) &&
      tabCount <= this.menuRef.nativeElement.children.length
    ) {
      switch (this.menuRef.nativeElement.children[tabCount - 1].id) {
        case 'btb': {
          this.bintobinTransferUrl();
          isMenu = true;
          break;
        }
        case 'ibt': {
          this.interBoutiqueTransferUrl();
          isMenu = true;
          break;
        }
        case 'conv': {
          this.conversionUrl();
          isMenu = true;
          break;
        }
        case 'otherIR': {
          this.otherReceiptIssueUrl();
          isMenu = true;
          break;
        }
        case 'binDetails': {
          this.binCreationUrl();
          isMenu = true;
          break;
        }
        case 'uhm': {
          this.updateHallmarkUrl();
          isMenu = true;
          break;
        }
      }
    }

    if (!isMenu) {
      switch (command.name) {
        case backShortcutKey: {
          this.inventoryUrl();
          break;
        }
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
