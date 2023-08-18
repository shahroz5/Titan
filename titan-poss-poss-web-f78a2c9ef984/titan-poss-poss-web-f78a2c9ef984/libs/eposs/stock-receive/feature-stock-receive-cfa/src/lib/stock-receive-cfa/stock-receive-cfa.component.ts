import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthFacade } from '@poss-web/shared/auth/data-access-auth';
import { ProfileDataFacade } from '@poss-web/shared/profile/data-access-profile';
import { InventoryHomeFacade } from '@poss-web/eposs/inventory-home/data-access-inventory-home';
import { StockReceiveFacade } from '@poss-web/eposs/stock-receive/data-access-stock-receive';
import { CardListComponent } from '@poss-web/shared/components/ui-card-list';
import { LocationSettingsFacade } from '@poss-web/shared/location-settings/data-access-location-settings';
import { ElementPermissionService } from '@poss-web/shared/permission/util-element-permissions';
import { PermissionFacade } from '@poss-web/shared/permission/data-access-permission';
import { PermissionService } from '@poss-web/shared/permission/ui-permission';
import {
  Command,
  CustomErrors,
  LocationSettingAttributesEnum,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  SharedBodEodFeatureServiceAbstraction,
  ShortcutServiceAbstraction,
  StockReceiveAPITypesEnum,
  StockReceiveCarrierTypesEnum,
  StockReceiveCFAInvoiceTypeFieldEnum,
  StockReceiveStock,
  StockReceiveTabEnum,
  StockReceiveTypesEnum,
  StockStatusEnum
} from '@poss-web/shared/models';
import * as moment from 'moment';
import { fromEvent, Observable, Subject } from 'rxjs';
import {
  debounceTime,
  filter,
  take,
  takeUntil,
  withLatestFrom
} from 'rxjs/operators';
import {
  fieldValidation,
  FieldValidatorsService
} from '@poss-web/shared/util-field-validators';
import {
  getInventoryHomeRouteUrl,
  getStockReceiveRouteUrl
} from '@poss-web/shared/util-site-routes';
const searchShortcutKey = 'StockReceiveListComponent.MAIN_SEARCH';
const cardListShortcutKey = 'StockReceiveListComponent.CARD_LIST';
const dropDownShortcutKey = 'StockReceiveListComponent.FILTER';
const backShortcutKey = 'StockReceiveListComponent.BACK';
const componentName = 'StockReceiveListComponent';
@Component({
  selector: 'poss-web-stock-receive-cfa',
  templateUrl: './stock-receive-cfa.component.html',
  styleUrls: ['./stock-receive-cfa.component.scss']
})
export class StockReceiveCfaComponent
  implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(CardListComponent)
  private cardListComponentRef: CardListComponent;
  @ViewChild('searchBox', { static: true })
  private searchBox: ElementRef;
  storeType: string;

  isLoadingCount$: Observable<boolean>;
  searchStockResults$: Observable<StockReceiveStock[]>;
  isSearchingStocks$: Observable<boolean>;
  hasSearchStockResults$: Observable<boolean>;

  pendingCFAInvoice$: Observable<StockReceiveStock[]>;
  pendingCFAInvoiceCount$: Observable<number>;
  searchInvoiceResults$: Observable<StockReceiveStock[]>;
  isLoadingPendingCFAInvoice: boolean;
  isSearchingInvoices$: Observable<boolean>;
  hasSearchInvoiceResults$: Observable<boolean>;
  isPendingCFAInvoiceLoadedOnce = false;
  pageSize = 4;
  initalPageSize = 8;

  stockReceiveType: StockReceiveTypesEnum;
  stockReceiveEnumRef = StockReceiveTypesEnum;
  StockReceiveAPITypesEnumRef = StockReceiveAPITypesEnum;
  stockReceiveCarrierTypesEnumRef = StockReceiveCarrierTypesEnum;
  stockReceiveCFAInvoiceTypeFieldEnum = StockReceiveCFAInvoiceTypeFieldEnum;
  isL1L2Store: boolean;
  isL3Store: boolean;

  searchFormControl = new FormControl();
  searchByFormControl = new FormControl();
  currentDate = moment();

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

  cfaTabPermission = 'Inventory Stock Receive - Receive from CFA Tab';
  searchTypes: { value: string; description: string }[] = [
    {
      value: 'CFA_INVOICE',
      description: 'CFA Invoice Number'
    },
    {
      value: 'CFA_INVOICE_ORACLE',
      description: 'CFA Invoice Number (oracle format AAAAA12345)'
    }
  ];

  constructor(
    private stockReceiveFacade: StockReceiveFacade,
    private inventoryHomeFacade: InventoryHomeFacade,
    private fieldValidatorsService: FieldValidatorsService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private shortcutService: ShortcutServiceAbstraction,
    private profiledatafacade: ProfileDataFacade,
    public dialog: MatDialog,
    private authFacade: AuthFacade,
    private translate: TranslateService,
    private elementPermission: ElementPermissionService,
    private permissionfacade: PermissionFacade,
    private permissionService: PermissionService,
    private locationSettingsFacade: LocationSettingsFacade,
    private bodEodFeatureService: SharedBodEodFeatureServiceAbstraction
  ) {
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
    const type = this.activatedRoute.snapshot.params['type'];
    this.stockReceiveType = type;
    this.permissions$ = this.permissionfacade.getPermissionforURL();
    this.inventoryHomeFacade.resetError();
    this.stockReceiveFacade.clearStocks();
    this.stockReceiveFacade.searchClear();
    this.stockReceiveFacade.resetError();
    this.searchByFormControl.setValue(
      StockReceiveCFAInvoiceTypeFieldEnum.CFA_INVOICE
    );
    this.bodEodFeatureService
      .getLatestBusinessDate()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.bussinessDay = data;
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
    this.isSearchingInvoices$ = this.stockReceiveFacade.getIsSearchingInvoices();
    this.hasSearchInvoiceResults$ = this.stockReceiveFacade.getHasSearchInvoiceResults();
    this.searchStockResults$ = this.stockReceiveFacade.getSearchStockResults();
    this.searchInvoiceResults$ = this.stockReceiveFacade.getSearchInvoiceResults();



    this.stockReceiveFacade
      .getIsLoadingPendingCFAInvoice()
      .pipe(takeUntil(this.destroy$))
      .subscribe((isLoading: boolean) => {
        this.isLoadingPendingCFAInvoice = isLoading;
      });

    this.getStocks();
    this.loadStocks(0);
  }
  searchKeyCheck($event: KeyboardEvent) {
    let pattern;
    if (
      this.searchByFormControl.value ===
      StockReceiveCFAInvoiceTypeFieldEnum.CFA_INVOICE_ORACLE
    ) {
      pattern = fieldValidation.alphaNumericField.pattern;
    } else {
      pattern = fieldValidation.numbersField.pattern;
    }
    return pattern.test($event.key);
  }

  selectionChange(searchBy: string) {
    this.searchFormControl.reset();
    if (
      this.searchByFormControl.value ===
      StockReceiveCFAInvoiceTypeFieldEnum.CFA_INVOICE_ORACLE
    ) {
      this.searchFormControl.setValidators([
        this.fieldValidatorsService.cfaCodeField('CFA Invoice Number')
      ]);
    } else {
      this.searchFormControl.clearValidators();
    }
    this.clearSearch();
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

  private shortcutEventHandler(command: Command) {
    const isTab = false;
    Number(command.name?.split('_').pop());

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
  ngAfterViewInit(): void {
    /**
     * Event Handler for search Box input with debounce
     */
    fromEvent(this.searchBox.nativeElement, 'input')
      .pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe((event: any) => {
        if (this.stockReceiveType !== StockReceiveTypesEnum.HISTORY) {
          this.search();
        }
      });
  }
  search() {
    const searchValue = this.searchFormControl.value;
    if (searchValue !== '') {
      if (this.validateSearch(searchValue)) {
        this.searchedSrcDocNumber = searchValue;
        if (
          this.searchByFormControl.value ===
          StockReceiveCFAInvoiceTypeFieldEnum.CFA_INVOICE_ORACLE
        ) {
          this.fetchInvoiceFromOracle();
        } else {
          this.hasFromFetchedOracle = false;
          this.searchStocks(searchValue);
        }
      } else if (
        this.searchByFormControl.value !==
        StockReceiveCFAInvoiceTypeFieldEnum.CFA_INVOICE_ORACLE
      ) {
        this.stockReceiveFacade.clearSearchResult();
      }
    } else {
      this.clearSearch();
    }
  }
  validateSearch(searchValue: string): boolean {
    if (
      this.searchByFormControl.value ===
      StockReceiveCFAInvoiceTypeFieldEnum.CFA_INVOICE_ORACLE
    ) {
      return fieldValidation.cfaCodeField.pattern.test(searchValue);
    } else {
      return fieldValidation.numbersField.pattern.test(searchValue);
    }
  }
  fetchInvoiceFromOracle() {
    this.stockReceiveFacade.fetchInvoiceFromOracle(
      this.searchedSrcDocNumber,
      StockReceiveAPITypesEnum.CFA_BTQ
    );
  }
  private getStocks(): void {
    if (this.isL3Store) {
      this.loadCount(false);
      this.pendingCFAInvoiceCount$ = this.inventoryHomeFacade.getPendingCFASTNCount();
      this.pendingCFAInvoice$ = this.stockReceiveFacade.getPendingCFAInvoice();
      this.pendingCFAInvoice$
        .pipe(takeUntil(this.destroy$))
        .subscribe((invoice: StockReceiveStock[]) => {
          if (
            invoice &&
            invoice.length !== 0 &&
            !this.isPendingCFAInvoiceLoadedOnce
          ) {
            this.isPendingCFAInvoiceLoadedOnce = true;
          }
        });
    }
  }

  /**
   * Search Stocks based on srcDocNumber and Type of transfer
   * @param srcDocnumber : source doc number
   */
  private searchStocks(srcDocnumber: string): void {
    const type = StockReceiveAPITypesEnum.CFA_BTQ;

    if (this.cardListComponentRef) {
      this.cardListComponentRef.resetFocus();
    }

    if (this.isL3Store) {
      this.stockReceiveFacade.searchPendingInvoices({
        srcDocnumber: srcDocnumber.replace(/[A-Za-z]/g, ''),
        type: type
      });
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
    if (this.stockReceiveType !== StockReceiveTypesEnum.HISTORY) {
      this.stockReceiveFacade.searchClear();
      if (this.hasFromFetchedOracle) {
        this.stockReceiveFacade.clearStocks();
        this.isPendingCFAInvoiceLoadedOnce = false;
        this.loadStocks(0);
      }
    }
  }

  /**
   * Loads the stocks based on the type of the transfer based on the pageIndex passed by poss-web-card-list component
   * @param pageIndex : next pageIndex to be loaded
   */
  loadStocks(pageIndex: number): void {
    if (this.isLoadingPendingCFAInvoice === false) {
      this.stockReceiveFacade.loadPendingCFAInvoice({
        pageIndex: pageIndex,
        pageSize: this.isPendingCFAInvoiceLoadedOnce
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
      getStockReceiveRouteUrl(StockReceiveTypesEnum.CFA_BTQ),
      stock.id,
      StockReceiveTabEnum.NON_VERIFIED
    ]);
  }
  loadCount(isL1L2: boolean) {
    if (!isL1L2) {
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
  /**
   * NgOnDestroy function
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
