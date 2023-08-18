import { fieldValidation } from '@poss-web/shared/util-field-validators';
import { ProfileDataFacade } from '@poss-web/shared/profile/data-access-profile';
import { CardListComponent } from '@poss-web/shared/components/ui-card-list';
import {
  getInventoryHomeRouteUrl,
  getStockReceiveRouteUrl
} from '@poss-web/shared/util-site-routes';
import { StockReceiveFacade } from '@poss-web/eposs/stock-receive/data-access-stock-receive';
import {
  StockReceiveTypesEnum,
  StockReceiveCarrierTypesEnum,
  StockReceiveAPITypesEnum,
  StockReceiveTabEnum,
  CustomErrors,
  StockReceiveStock,
  OverlayNotificationServiceAbstraction,
  Command,
  ShortcutServiceAbstraction,
  OverlayNotificationType,
  StockStatusEnum
} from '@poss-web/shared/models';
import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  AfterViewInit
} from '@angular/core';
import { Observable, Subject, fromEvent } from 'rxjs';
import {
  debounceTime,
  takeUntil,
  filter,
  withLatestFrom,
  take
} from 'rxjs/operators';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { InventoryHomeFacade } from '@poss-web/eposs/inventory-home/data-access-inventory-home';
import * as moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { ElementPermissionService } from '@poss-web/shared/permission/util-element-permissions';
import { PermissionFacade } from '@poss-web/shared/permission/data-access-permission';
import { AuthFacade } from '@poss-web/shared/auth/data-access-auth';
import { TranslateService } from '@ngx-translate/core';
const searchShortcutKey = 'StockReceiveListComponent.MAIN_SEARCH';
const cardListShortcutKey = 'StockReceiveListComponent.CARD_LIST';
const backShortcutKey = 'StockReceiveListComponent.BACK';
const componentName = 'StockReceiveListComponent';

@Component({
  selector: 'poss-web-stock-receive-merchandise',
  templateUrl: './stock-receive-merchandise.component.html',
  styleUrls: []
})
export class StockReceiveMerchandiseComponent
  implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(CardListComponent)
  private cardListComponentRef: CardListComponent;
  @ViewChild('searchBox', { static: true })
  private searchBox: ElementRef;
  storeType: string;

  isLoadingCount$: Observable<boolean>;
  pendingMerchandiseSTNcount$: Observable<number>;
  pendingMerchandiseSTN$: Observable<StockReceiveStock[]>;
  searchStockResults$: Observable<StockReceiveStock[]>;
  isLoadingPendingMerchandiseSTN: boolean;
  isSearchingStocks$: Observable<boolean>;
  hasSearchStockResults$: Observable<boolean>;
  isPendingMerchandiseLoadedOnce = false;
  pageSize = 4;
  initalPageSize = 8;
  stockReceiveType: StockReceiveTypesEnum;
  stockReceiveEnumRef = StockReceiveTypesEnum;
  StockReceiveAPITypesEnumRef = StockReceiveAPITypesEnum;
  stockReceiveCarrierTypesEnumRef = StockReceiveCarrierTypesEnum;
  isL1L2Store: boolean;
  isL3Store: boolean;

  searchFormControl = new FormControl();
  currentDate = moment();

  docNumber = null;
  private destroy$: Subject<null> = new Subject<null>();
  isLoggedIn: boolean;
  noDataFoundMessageSTN: string;
  noDataFoundMessagePurchaseInvoice: string;
  permissions$: Observable<any[]>;
  stockStatusEnumRef = StockStatusEnum;
  currentFiscalYear: string;
  searchedSrcDocNumber: number;
  hasFromFetchedOracle = false;
  bussinessDay = null;

  loadPermission = (element: string) =>
    this.elementPermission.loadPermission(element, this.permissions$);

  constructor(
    private stockReceiveFacade: StockReceiveFacade,
    private inventoryHomeFacade: InventoryHomeFacade,
    private router: Router,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private shortcutService: ShortcutServiceAbstraction,
    private profiledatafacade: ProfileDataFacade,
    public dialog: MatDialog,
    private elementPermission: ElementPermissionService,
    private permissionfacade: PermissionFacade,
    private authFacade: AuthFacade,
    private translate: TranslateService
  ) {
    this.translate
      .get(['pw.entity.stnEntity'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((entity: any) => {
        this.translate
          .get(['pw.global.noDataFoundMessage'], {
            entityName: entity['pw.entity.stnEntity']
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe((translatedMsg: any) => {
            this.noDataFoundMessageSTN =
              translatedMsg['pw.global.noDataFoundMessage'];
          });
      });
  }

  ngOnInit(): void {
    this.permissions$ = this.permissionfacade.getPermissionforURL();
    this.inventoryHomeFacade.resetError();
    this.stockReceiveFacade.clearStocks();
    this.stockReceiveFacade.searchClear();
    this.stockReceiveFacade.resetError();
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
  }

  ngAfterViewInit(): void {
    /**
     * Event Handler for search Box input with debounce
     */
    fromEvent(this.searchBox.nativeElement, 'input')
      .pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe((event: any) => {
        this.search();
      });
  }

  validateSearch(searchValue: string): boolean {
    return fieldValidation.requestNumberField.pattern.test(searchValue);
  }

  search() {
    const searchValue = this.searchFormControl.value;
    if (searchValue !== '') {
      if (this.validateSearch(searchValue)) {
        this.searchedSrcDocNumber = searchValue;
        this.hasFromFetchedOracle = false;
        this.searchStocks(searchValue);
      } else {
        this.stockReceiveFacade.clearSearchResult();
      }
    } else {
      this.clearSearch();
    }
  }

  /**
   * Clears the search result and search value
   */
  clearSearch(): void {
    if (this.cardListComponentRef) {
      this.cardListComponentRef.resetFocus();
    }
    this.searchFormControl.reset();
    this.stockReceiveFacade.searchClear();
    if (this.hasFromFetchedOracle) {
      this.stockReceiveFacade.clearStocks();
      this.isPendingMerchandiseLoadedOnce = false;
      this.loadStocks(0);
    }
  }

  private componentInit(): void {
    this.stockReceiveFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((stockReceiveError: CustomErrors) => {
        this.errorHandler(stockReceiveError);
      });

    this.inventoryHomeFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((dashboardError: CustomErrors) => {
        this.errorHandler(dashboardError);
      });

    this.stockReceiveFacade
      .getOracleFetchInfo()
      .pipe(takeUntil(this.destroy$))
      .subscribe((info: { hasFecthed: boolean }) => {
        if (info) {
          this.hasFromFetchedOracle = info.hasFecthed;
        }
      });

    this.isLoadingCount$ = this.inventoryHomeFacade.getIsLoadingCount();
    this.isSearchingStocks$ = this.stockReceiveFacade.getIsSearchingStocks();
    this.hasSearchStockResults$ = this.stockReceiveFacade.getHasSearchStockResults();
    this.searchStockResults$ = this.stockReceiveFacade.getSearchStockResults();

    // Code to take history type from store. For ACL impl taking history type from the route param
    // this.stockReceiveFacade
    //   .getHistoryType()
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe(historyType => {
    //     if (historyType) {
    //       this.selectHistoryType(historyType);

    //       this.router.navigate([
    //         getStockReceiveRouteUrl('history'),
    //         historyType
    //       ]);
    //     }
    //   });

    this.stockReceiveFacade
      .getILoadingPendingMerchandiseSTN()
      .pipe(takeUntil(this.destroy$))
      .subscribe((isLoading: boolean) => {
        this.isLoadingPendingMerchandiseSTN = isLoading;
      });

    this.getStocks();
    this.loadStocks(0);
  }

  private errorHandler(error: CustomErrors) {
    if (error) {
      this.overlayNotification.show({
        type: OverlayNotificationType.ERROR,
        hasClose: true,
        error: error
      });
    }
  }

  back() {
    this.router.navigate([getInventoryHomeRouteUrl()]);
  }

  /**
   * Loads the stocks based on the type of the transfer based on the pageIndex passed by poss-web-card-list component
   * @param pageIndex : next pageIndex to be loaded
   */
  loadStocks(pageIndex: number): void {
    if (this.isLoadingPendingMerchandiseSTN === false) {
      this.stockReceiveFacade.loadPendingMerchandiseSTN({
        pageIndex: pageIndex,
        pageSize: this.isPendingMerchandiseLoadedOnce
          ? this.pageSize
          : this.initalPageSize
      });
    }
  }

  /**
   * Function navigates to the seleted Stock's details page triggered by poss-web-card-list component
   * @param stock :Selected stock
   */
  onSelected(stock: any): void {
    this.router.navigate([
      getStockReceiveRouteUrl(StockReceiveTypesEnum.MER_BTQ),
      stock.id,
      StockReceiveTabEnum.NON_VERIFIED
    ]);
  }

  private getStocks(): void {
    if (this.isL1L2Store) {
      this.pendingMerchandiseSTNcount$ = this.inventoryHomeFacade.getPendingMerchandiseSTNcount();

      this.pendingMerchandiseSTN$ = this.stockReceiveFacade.getPendingMerchandiseSTN();
      this.pendingMerchandiseSTN$
        .pipe(takeUntil(this.destroy$))
        .subscribe((stocks: StockReceiveStock[]) => {
          if (
            stocks &&
            stocks.length !== 0 &&
            !this.isPendingMerchandiseLoadedOnce
          ) {
            this.isPendingMerchandiseLoadedOnce = true;
          }
        });
    }
  }

  /**
   * Search Stocks based on srcDocNumber and Type of transfer
   * @param srcDocnumber : source doc number
   */
  private searchStocks(srcDocnumber: string): void {
    let type: string;
    type = StockReceiveTypesEnum.MER_BTQ;

    if (this.cardListComponentRef) {
      this.cardListComponentRef.resetFocus();
    }

    if (this.isL1L2Store) {
      this.stockReceiveFacade.searchPendingStocks({
        srcDocnumber: srcDocnumber,
        type: type
      });
    } else if (this.isL3Store) {
      this.stockReceiveFacade.searchPendingInvoices({
        srcDocnumber: srcDocnumber.replace(/[A-Za-z]/g, ''),
        type: type
      });
    }
  }

  private shortcutEventHandler(command: Command) {
    const isTab = false;

    if (!isTab) {
      switch (command.name) {
        case searchShortcutKey: {
          if (this.searchBox && this.searchBox.nativeElement) {
            this.searchBox.nativeElement.focus();
          }
          break;
        }
        case cardListShortcutKey: {
          if (this.cardListComponentRef) {
            this.cardListComponentRef.focus();
          }
          break;
        }
        case backShortcutKey: {
          this.back();
          break;
        }
      }
    }
  }

  searchKeyCheck($event: KeyboardEvent) {
    const pattern = fieldValidation.numbersField.pattern;

    return pattern.test($event.key);
  }

  /**
   * NgOnDestroy function
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
