import { ProfileDataFacade } from '@poss-web/shared/profile/data-access-profile';
import {
  getStockReceiveRouteUrl,
  getStockReceiveHistoryRouteUrl
} from '@poss-web/shared/util-site-routes';
import {
  StockReceiveTypesEnum,
  StockReceiveCarrierTypesEnum,
  StockReceiveAPITypesEnum,
  StockReceiveStock,
  Command,
  ShortcutServiceAbstraction,
  StockStatusEnum
} from '@poss-web/shared/models';
import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef
} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import {
  takeUntil,
  filter,
  withLatestFrom,
  take
} from 'rxjs/operators';
import { Router, ActivatedRoute, NavigationEnd, Event } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { InventoryHomeFacade } from '@poss-web/eposs/inventory-home/data-access-inventory-home';
import * as moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { ElementPermissionService } from '@poss-web/shared/permission/util-element-permissions';
import { PermissionFacade } from '@poss-web/shared/permission/data-access-permission';
import { PermissionService } from '@poss-web/shared/permission/ui-permission';
import { AuthFacade } from '@poss-web/shared/auth/data-access-auth';
const searchShortcutKey = 'StockReceiveListComponent.MAIN_SEARCH';
const cardListShortcutKey = 'StockReceiveListComponent.CARD_LIST';
const dropDownShortcutKey = 'StockReceiveListComponent.FILTER';
const backShortcutKey = 'StockReceiveListComponent.BACK';
const tab1ShortcutKey = 'Common.TAB_1';
const tab2ShortcutKey = 'Common.TAB_2';
const tab3ShortcutKey = 'Common.TAB_3';
const tab4ShortcutKey = 'Common.TAB_4';
const tab5ShortcutKey = 'Common.TAB_5';
const componentName = 'StockReceiveListComponent';

@Component({
  selector: 'poss-web-stock-receive-list',
  templateUrl: './stock-receive-list.component.html',
  styleUrls: ['./stock-receive-list.component.scss']
})
export class StockReceiveListComponent implements OnInit, OnDestroy {
  storeType: string;

  isLoadingCount$: Observable<boolean>;
  pendingFactorySTNCount$: Observable<number>;
  pendingBoutiqueSTNCount$: Observable<number>;
  pendingMerchandiseSTNcount$: Observable<number>;
  stockReceiveHistoryCount$: Observable<number>;
  pendingFactorySTN$: Observable<StockReceiveStock[]>;
  pendingBoutiqueSTN$: Observable<StockReceiveStock[]>;
  pendingMerchandiseSTN$: Observable<StockReceiveStock[]>;
  searchStockResults$: Observable<StockReceiveStock[]>;
  isLoadingPendingFactorySTN: boolean;
  isLoadingStockReceiveHistory: boolean;
  isLoadingPendingBoutiqueSTN: boolean;
  isLoadingPendingMerchandiseSTN: boolean;
  isSearchingStocks$: Observable<boolean>;
  hasSearchStockResults$: Observable<boolean>;
  isPendingFactorySTNLoadedOnce = false;
  isPendingBoutiqueSTNLoadedOnce = false;
  isPendingMerchandiseLoadedOnce = false;
  isStockReceiveHistoryLoaddedOnce = false;
  pendingCFAInvoice$: Observable<StockReceiveStock[]>;
  pendingCFAInvoiceCount$: Observable<number>;
  searchInvoiceResults$: Observable<StockReceiveStock[]>;
  isLoadingPendingCFAInvoice: boolean;
  isSearchingInvoices$: Observable<boolean>;
  hasSearchInvoiceResults$: Observable<boolean>;
  isPendingCFAInvoiceLoadedOnce = false;
  pageSize = 4;
  initalPageSize = 8;
  stockReceiveType: any;
  stockReceiveEnumRef = StockReceiveTypesEnum;
  StockReceiveAPITypesEnumRef = StockReceiveAPITypesEnum;
  stockReceiveCarrierTypesEnumRef = StockReceiveCarrierTypesEnum;
  isL1L2Store: boolean;
  isL3Store: boolean;

  searchFormControl = new FormControl();
  currentDate = moment();
  historyFormGroup: FormGroup;

  historyType: StockReceiveTypesEnum;
  historyAPIType: StockReceiveAPITypesEnum;

  advanceFilter = null;
  stockReceiveHistory$: Observable<StockReceiveStock[]>;
  docNumber = null;
  private destroy$: Subject<null> = new Subject<null>();
  isLoggedIn: boolean;
  noDataFoundMessageSTN: String;
  noDataFoundMessagePurchaseInvoice: String;
  permissions$: Observable<any[]>;
  stockStatusEnumRef = StockStatusEnum;
  currentFiscalYear: string;
  searchedSrcDocNumber: number;
  hasFromFetchedOracle = false;
  bussinessDay = null;

  @ViewChild('tabRef') tabRef: ElementRef;
  factoryTabPermission = 'Inventory Stock Receive - Receive from Factory Tab';
  boutiqueTabPermission = 'Inventory Stock Receive - Receive from Boutique Tab';
  merchandiseTabPermission =
    'Inventory Stock Receive - Receive from Merchandise Tab';
  cfaTabPermission = 'Inventory Stock Receive - Receive from CFA Tab';
  historyTabPermission = 'Inventory Stock Receive - History Tab';
  factoryRadioButtonPermission =
    'Inventory Stock Receive - History Tab Factory Radio button';
  boutiqueRadioButtonPermission =
    'Inventory Stock Receive - History Tab Boutique Radio button';
  merchandiseRadioButtonPermission =
    'Inventory Stock Receive - History Tab Merchandise Radio button';

  loadPermission = (element: string) =>
    this.elementPermission.loadPermission(element, this.permissions$);

  constructor(
    private inventoryHomeFacade: InventoryHomeFacade,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private shortcutService: ShortcutServiceAbstraction,
    private profiledatafacade: ProfileDataFacade,
    public dialog: MatDialog,
    private elementPermission: ElementPermissionService,
    private permissionfacade: PermissionFacade,
    private permissionService: PermissionService,
    private authFacade: AuthFacade
  ) {
    this.historyFormGroup = new FormGroup({
      selectRadioButton: new FormControl()
    });
  }

  ngOnInit(): void {
    this.permissions$ = this.permissionfacade.getPermissionforURL();
    this.shortcutService.componentNames = [componentName]; 
    this.shortcutService.commands
      .pipe(takeUntil(this.destroy$))
      .subscribe((command: Command) => this.shortcutEventHandler(command));

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

    this.authFacade
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
        this.navigateToTabs();
      });
  }

  private componentInit(): void {
    this.isLoadingCount$ = this.inventoryHomeFacade.getIsLoadingCount();

    this.getStocks();
    this.navigateToTabs();
  }

  navigateToTabs() {
    const fullUrl = this.router.url;
    const type = this.router.url.split('?')[0].split('/').pop();
    if (!fullUrl.includes(StockReceiveTypesEnum.HISTORY)) {
      this.changeStockReceiveType(type);
    } else {
      this.stockReceiveType = StockReceiveTypesEnum.HISTORY;

      this.historyFormGroup
        .get('selectRadioButton')
        .setValue(this.activatedRoute.snapshot.params['requestType']);
    }
  }

  changeStockReceiveType(newType: any): void {
    if (this.stockReceiveType !== newType) {
      if (newType !== StockReceiveTypesEnum.HISTORY) {
        if (this.stockReceiveType !== StockReceiveTypesEnum.HISTORY) {
          this.stockReceiveType = newType;
          if (
            (newType === StockReceiveTypesEnum.FAC_BTQ &&
              !this.isPendingFactorySTNLoadedOnce) ||
            (newType === StockReceiveTypesEnum.BTQ_BTQ &&
              !this.isPendingBoutiqueSTNLoadedOnce) ||
            (newType === StockReceiveTypesEnum.MER_BTQ &&
              !this.isPendingMerchandiseLoadedOnce) ||
            (newType === StockReceiveTypesEnum.CFA_BTQ &&
              !this.isPendingCFAInvoiceLoadedOnce)
          ) {
          }
        } else {
          this.stockReceiveType = newType;
        }
        this.router.navigate([getStockReceiveRouteUrl(newType)]);
      } else {
        this.stockReceiveType = newType;
        this.router.navigate([getStockReceiveHistoryRouteUrl()], {
          state: { clearFilter: true }
        });
      }
    }
  }

  loadCount(isL1L2: boolean) {
    if (isL1L2) {
      this.elementPermission
        .loadPermission(this.factoryTabPermission, this.permissions$)
        .pipe(
          withLatestFrom(
            this.elementPermission.loadPermission(
              this.boutiqueTabPermission,
              this.permissions$
            ),
            this.elementPermission.loadPermission(
              this.merchandiseTabPermission,
              this.permissions$
            )
          ),
          take(1)
        )
        .subscribe(([val1, val2, val3]) => {
          const availableTransactionCodes = [
            ...val1.transactionCodes,
            ...val2.transactionCodes,
            ...val3.transactionCodes
          ];
          const hasRequestPermission = availableTransactionCodes.find(key =>
            this.permissionService.hasPermission(key)
          );
          if (hasRequestPermission) {
            this.inventoryHomeFacade.loadStockTransferNoteCount();
          }
        });
    } else {
      this.elementPermission
        .loadPermission(this.cfaTabPermission, this.permissions$)
        .pipe(takeUntil(this.destroy$))
        .subscribe(data => {
          const hasRequestPermission = data.transactionCodes.find(key =>
            this.permissionService.hasPermission(key)
          );
          if (hasRequestPermission) {
            this.inventoryHomeFacade.loadReceiveInvoiceCount();
          }
        });
    }
  }

  private shortcutEventHandler(command: Command) {
    let isTab = false;
    const tabCount = Number(command.name?.split('_').pop());
    if (
      (command.name === tab1ShortcutKey ||
        command.name === tab2ShortcutKey ||
        command.name === tab3ShortcutKey ||
        command.name === tab4ShortcutKey ||
        command.name === tab5ShortcutKey) &&
      !isNaN(tabCount) &&
      tabCount <= this.tabRef.nativeElement.children.length
    ) {
      switch (this.tabRef?.nativeElement?.children[tabCount - 1]?.id) {
        case 'receiveFromFactoryTab': {
          this.changeStockReceiveType(StockReceiveTypesEnum.FAC_BTQ);
          isTab = true;
          break;
        }
        case 'receiveFromBoutiqueTab': {
          this.changeStockReceiveType(StockReceiveTypesEnum.BTQ_BTQ);
          isTab = true;
          break;
        }
        case 'receiveFromMerchandiseTab': {
          this.changeStockReceiveType(StockReceiveTypesEnum.MER_BTQ);
          isTab = true;
          break;
        }
        case 'receiveFromCfaTab': {
          this.changeStockReceiveType(StockReceiveTypesEnum.CFA_BTQ);
          isTab = true;
          break;
        }
        case 'receiveFromHistoryTab': {
          this.changeStockReceiveType(StockReceiveTypesEnum.HISTORY);
          isTab = true;
          break;
        }
      }
    }
  }

  private getStocks(): void {
    if (this.isL1L2Store) {
      this.loadCount(true);
      this.pendingFactorySTNCount$ = this.inventoryHomeFacade.getPendingFactorySTNCount();
      this.pendingBoutiqueSTNCount$ = this.inventoryHomeFacade.getPendingBoutiqueSTNCount();
      this.pendingMerchandiseSTNcount$ = this.inventoryHomeFacade.getPendingMerchandiseSTNcount();
    } else if (this.isL3Store) {
      this.loadCount(false);
      this.pendingCFAInvoiceCount$ = this.inventoryHomeFacade.getPendingCFASTNCount();
    }
  }

  /**
   * NgOnDestroy function
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
