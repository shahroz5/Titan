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
  StockReceiveStock,
  OverlayNotificationServiceAbstraction,
  StockReceiveHistoryPayload,
  AdvanceFilterPayload,
  Command,
  ShortcutServiceAbstraction,
  LocationSettingAttributesEnum,
  OverlayNotificationType,
  SharedBodEodFeatureServiceAbstraction,
  StockStatusEnum,
  CustomErrors
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
import { FormControl, FormGroup } from '@angular/forms';
import { InventoryHomeFacade } from '@poss-web/eposs/inventory-home/data-access-inventory-home';
import * as moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { StockReceiveHistoryPopupComponent } from '@poss-web/eposs/stock-receive/ui-stock-receive-popup';
import { ElementPermissionService } from '@poss-web/shared/permission/util-element-permissions';
import { PermissionFacade } from '@poss-web/shared/permission/data-access-permission';
import { PermissionService } from '@poss-web/shared/permission/ui-permission';
import { AuthFacade } from '@poss-web/shared/auth/data-access-auth';
import { TranslateService } from '@ngx-translate/core';
import { LocationSettingsFacade } from '@poss-web/shared/location-settings/data-access-location-settings';
const searchShortcutKey = 'StockReceiveListComponent.MAIN_SEARCH';
const cardListShortcutKey = 'StockReceiveListComponent.CARD_LIST';
const dropDownShortcutKey = 'StockReceiveListComponent.FILTER';
const backShortcutKey = 'StockReceiveListComponent.BACK';
const componentName = 'StockReceiveListComponent';

@Component({
  selector: 'poss-web-stock-receive-history',
  templateUrl: './stock-receive-history.component.html',
  styleUrls: ['./stock-receive-history.component.scss']
})
export class StockReceiveHistoryComponent
  implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(CardListComponent)
  private cardListComponentRef: CardListComponent;
  @ViewChild('searchBox', { static: true })
  private searchBox: ElementRef;

  isLoadingCount$: Observable<boolean>;
  stockReceiveHistoryCount$: Observable<number>;
  searchStockResults$: Observable<StockReceiveStock[]>;
  isLoadingStockReceiveHistory: boolean;
  isSearchingStocks$: Observable<boolean>;
  hasSearchStockResults$: Observable<boolean>;
  isStockReceiveHistoryLoaddedOnce = false;
  pageSize = 4;
  initalPageSize = 8;
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
  noDataFoundMessageSTN: string;
  noDataFoundMessagePurchaseInvoice: string;
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
    private stockReceiveFacade: StockReceiveFacade,
    private inventoryHomeFacade: InventoryHomeFacade,
    private router: Router,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private shortcutService: ShortcutServiceAbstraction,
    private profiledatafacade: ProfileDataFacade,
    public dialog: MatDialog,
    private elementPermission: ElementPermissionService,
    private permissionfacade: PermissionFacade,
    private permissionService: PermissionService,
    private authFacade: AuthFacade,
    private translate: TranslateService,
    private locationSettingsFacade: LocationSettingsFacade,
    private bodEodFeatureService: SharedBodEodFeatureServiceAbstraction
  ) {
    this.historyFormGroup = new FormGroup({
      selectRadioButton: new FormControl(StockReceiveTypesEnum.FAC_BTQ)
    });
    this.historyAPIType = StockReceiveAPITypesEnum.FAC_BTQ;
    this.historyType = StockReceiveTypesEnum.FAC_BTQ;

    if (
      !(
        this.router.getCurrentNavigation() &&
        this.router.getCurrentNavigation().extras.state &&
        this.router.getCurrentNavigation().extras.state.clearFilter === false
      )
    ) {
      this.stockReceiveFacade.resetAdvanceFilter(this.bussinessDay);
    }

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

    this.translate
      .get(['pw.entity.purchaseInvoiceEntity'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((entity: any) => {
        this.translate
          .get(['pw.global.noDataFoundMessage'], {
            entityName: entity['pw.entity.purchaseInvoiceEntity']
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe((translatedMsg: any) => {
            this.noDataFoundMessagePurchaseInvoice =
              translatedMsg['pw.global.noDataFoundMessage'];
          });
      });
  }

  ngOnInit(): void {
    this.permissions$ = this.permissionfacade.getPermissionforURL();
    this.inventoryHomeFacade.resetError();
    this.stockReceiveFacade.clearStocks();
    this.stockReceiveFacade.resetError();
    this.bodEodFeatureService
      .getLatestBusinessDate()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.bussinessDay = data;
          if (
            !(
              this.router.getCurrentNavigation() &&
              this.router.getCurrentNavigation().extras.state &&
              this.router.getCurrentNavigation().extras.state.clearFilter ===
                false
            )
          ) {
            this.stockReceiveFacade.storeAdvancedFilterData({
              docFromDate: this.advanceFilter?.docFromDate
                ? this.advanceFilter.docFromDate
                : this.bussinessDay,
              docToDate: this.advanceFilter?.docToDate
                ? this.advanceFilter.docToDate
                : this.bussinessDay,
              stnNumber: this.advanceFilter?.stnNumber,
              sourceLocationCode: this.advanceFilter?.sourceLocationCode,
              fiscalYear: this.advanceFilter?.fiscalYear,
              docNumber: this.advanceFilter?.docNumber
            });
          }

          this.isLoadingStockReceiveHistory = false;
          this.loadHistory();
        }
      });
    this.locationSettingsFacade
      .getLocationSetting(LocationSettingAttributesEnum.COUNTRY_FISCAL_YEAR)
      .pipe(takeUntil(this.destroy$))
      .subscribe((fiscalYear: string) => {
        this.currentFiscalYear = fiscalYear;
      });
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
        this.historySearch();
      });
  }

  validateSearch(searchValue: string): boolean {
    return fieldValidation.requestNumberField.pattern.test(searchValue);
  }

  historySearch() {
    const docNumber = this.searchFormControl.value;
    if (docNumber !== '') {
      if (this.validateSearch(docNumber)) {
        this.docNumber = docNumber;
        this.loadHistory();
      } else {
        this.stockReceiveFacade.resetStockReceiveHistory();
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

    this.docNumber = null;
    this.loadHistory();
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


    this.isSearchingStocks$ = this.stockReceiveFacade.getIsSearchingStocks();
    this.hasSearchStockResults$ = this.stockReceiveFacade.getHasSearchStockResults();
    this.searchStockResults$ = this.stockReceiveFacade.getSearchStockResults();
    this.stockReceiveHistoryCount$ = this.stockReceiveFacade.getHistoryTotalElements();


    this.historyFormGroup
      .get('selectRadioButton')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(type => {
        this.selectHistoryType(type);
        this.stockReceiveFacade.storeHistoryType(this.historyType);

        this.router.navigate([
          getStockReceiveRouteUrl(StockReceiveTypesEnum.HISTORY),
          this.historyType
        ]);
        if (this.bussinessDay) this.loadHistory();
      });
    this.stockReceiveFacade
      .getAdvancedFilter()
      .pipe(takeUntil(this.destroy$))
      .subscribe((advancedFilter: AdvanceFilterPayload) => {
        this.advanceFilter = advancedFilter;
      });

    this.stockReceiveFacade
      .getIsLoadingHistory()
      .pipe(takeUntil(this.destroy$))
      .subscribe((isLoading: boolean) => {
        this.isLoadingStockReceiveHistory = isLoading;
      });

    this.getStocks();
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

  selectHistoryType(historyType: StockReceiveTypesEnum) {
    if (historyType === StockReceiveTypesEnum.FAC_BTQ) {
      this.historyAPIType = StockReceiveAPITypesEnum.FAC_BTQ;
    } else if (historyType === StockReceiveTypesEnum.BTQ_BTQ) {
      this.historyAPIType = StockReceiveAPITypesEnum.BTQ_BTQ;
    } else if (historyType === StockReceiveTypesEnum.MER_BTQ) {
      this.historyAPIType = StockReceiveAPITypesEnum.MER_BTQ;
    }
    console.log(this.historyType);
    this.historyType = historyType;
  }

  // navigateToPage(page) {
  //   this.router.navigate([`../${page}`], {
  //     relativeTo: this.activatedRoute
  //   });
  // }

  // navigateToTabs() {
  //   this.historyFormGroup
  //     .get('selectRadioButton')
  //     .setValue(this.activatedRoute.snapshot.params['type']);
  //   this.loadStocks(0);
  // }

  /**
   * Loads the stocks based on the type of the transfer based on the pageIndex passed by poss-web-card-list component
   * @param pageIndex : next pageIndex to be loaded
   */
  loadStocks(pageIndex: number): void {
    if (this.isLoadingStockReceiveHistory === false) {
      if (this.isL1L2Store) {
        this.stockReceiveFacade.loadStockReceiveHistory(
          this.createHistoryPayLoad(pageIndex)
        );
      } else if (this.isL3Store) {
        this.stockReceiveFacade.loadStockReceiveInvoiceHistory(
          this.createHistoryPayLoad(pageIndex)
        );
      }
    }
  }

  /**
   * Function navigates to the seleted Stock's details page triggered by poss-web-card-list component
   * @param stock :Selected stock
   */
  onSelected(stock: any): void {
    this.router.navigate([
      getStockReceiveRouteUrl(StockReceiveTypesEnum.HISTORY),
      this.isL1L2Store ? this.historyType : StockReceiveTypesEnum.CFA_BTQ,
      stock.id
    ]);
  }

  openHistoryFilter() {
    this.dialog.closeAll();
    const emitData = {
      advancedFilter: this.advanceFilter ? this.advanceFilter : {},
      isL1L2Store: this.isL1L2Store,
      isL3Store: this.isL3Store,
      currentFiscalYear: this.currentFiscalYear,
      bussinessDay: this.bussinessDay
    };
    const dialogRef = this.dialog.open(StockReceiveHistoryPopupComponent, {
      width: '30vw',
      data: emitData,
      disableClose: true
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data !== undefined) {
          this.docNumber = null;
          this.stockReceiveFacade.storeAdvancedFilterData(data);
          this.loadHistory();
        }
      });
  }

  private createHistoryPayLoad(pageIndex: number): StockReceiveHistoryPayload {
    if (this.advanceFilter && this.docNumber == null) {
      if (
        this.advanceFilter.docNo !== '' &&
        this.advanceFilter.docNo !== null
      ) {
        this.docNumber = this.advanceFilter.docNumber;
      }
    }

    return {
      data: {
        dateRangeType: 'CUSTOM',
        destDocNo: this.docNumber,
        destFiscalYear: this.advanceFilter
          ? this.advanceFilter.fiscalYear
          : null,
        endDate: this.advanceFilter?.docToDate
          ? this.advanceFilter?.docToDate
          : moment(this.bussinessDay).endOf('day').valueOf(),
        actionType: 'RECEIVE',
        locationCode: this.advanceFilter
          ? this.advanceFilter.sourceLocationCode
          : null,
        srcDocNo: this.advanceFilter ? this.advanceFilter.stnNumber : null,
        srcFiscalYear: null,
        startDate: this.advanceFilter?.docFromDate
          ? this.advanceFilter?.docFromDate
          : moment(this.bussinessDay).startOf('day').valueOf(),
        statuses: []
      },
      pageIndex: pageIndex,
      pageSize: this.isStockReceiveHistoryLoaddedOnce
        ? this.pageSize
        : this.initalPageSize,
      transferType: this.isL1L2Store
        ? this.historyAPIType
        : StockReceiveAPITypesEnum.CFA_BTQ
    };
  }

  loadHistory() {
    this.isStockReceiveHistoryLoaddedOnce = false;
    this.stockReceiveFacade.resetStockReceiveHistory();
    this.loadStocks(0);
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

  private getStocks(): void {
    this.stockReceiveHistory$ = this.stockReceiveFacade.getStockReceiveHistory();
    this.stockReceiveHistory$
      .pipe(takeUntil(this.destroy$))
      .subscribe((stocks: StockReceiveStock[]) => {
        if (
          stocks &&
          stocks.length !== 0 &&
          !this.isStockReceiveHistoryLoaddedOnce
        ) {
          this.isStockReceiveHistoryLoaddedOnce = true;
        }
      });
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

        case dropDownShortcutKey: {
          this.openHistoryFilter();

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
