import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  AfterViewInit
} from '@angular/core';
import { fieldValidation } from '@poss-web/shared/util-field-validators';
import {
  CustomErrors,
  OverlayNotificationServiceAbstraction,
  RequestInvoice,
  HistoryAdvancedFilterPayload,
  StockIssueHistoryAPITypes,
  OverlayNotificationType,
  OverlayNotificationEventRef,
  StockStatusEnum,
  HistoryTypes,
  LocationSettingAttributesEnum,
  SharedBodEodFeatureServiceAbstraction,
  StockIssueTypesEnum,
  StockIssueAPIRequestTypesEnum,
  StockIssueTEPGEPTypesEnum,
  StockIssueHistoryTypes,
  Command,
  ShortcutServiceAbstraction
} from '@poss-web/shared/models';
import { Observable, Subject, fromEvent } from 'rxjs';
import { Router, ActivatedRoute, NavigationEnd, Event } from '@angular/router';
import { takeUntil, debounceTime, take, filter } from 'rxjs/operators';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import {
  getStockIssueTEPGEPRouteUrl,
  getStockReceiveIssueCFADefaultRouteUrl,
  getStockIssueRouteUrl,
  getStockIssueInvoiceHistoryUrl,
  getStockIssueTEPHistoryAllowedRouteUrl,
  getStockIssueReturnDetailsRouteUrl
} from '@poss-web/shared/util-site-routes';

import { getInventoryHomeRouteUrl } from '@poss-web/shared/util-site-routes';
import { CardListComponent } from '@poss-web/shared/components/ui-card-list';
import * as moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { StockReturnHistoryPopupComponent } from '@poss-web/eposs/stock-return/ui-stock-return-history-popup';
import { StockReturnFacade } from '@poss-web/eposs/stock-return/data-access-stock-return';
import { ElementPermissionService } from '@poss-web/shared/permission/util-element-permissions';
import { PermissionFacade } from '@poss-web/shared/permission/data-access-permission';
import { AuthFacade } from '@poss-web/shared/auth/data-access-auth';
import { TranslateService } from '@ngx-translate/core';
import { LocationSettingsFacade } from '@poss-web/shared/location-settings/data-access-location-settings';
const searchShortCutKeyF2 = 'StockReturnHistoryListComponent.MAIN_SEARCH';
const cardlistShortcutKeyF2 = 'StockReturnHistoryListComponent.CARD_LIST';
const backShortcutKey = 'StockReturnHistoryListComponent.BACK';

const primaryDropdownShortcutKeyF7 =
  'StockReturnHistoryListComponent.PRIMARY_DROPDOWN';
const tab1ShortcutKey = 'Common.TAB_1';
const tab2ShortcutKey = 'Common.TAB_2';
const tab3ShortcutKey = 'Common.TAB_3';
const filterShortCutKeyF8 = 'StockReturnHistoryListComponent.FILTER';
const componentName = 'StockReturnHistoryListComponent';
@Component({
  selector: 'poss-web-stock-return-history-list',
  templateUrl: './stock-return-history-list.component.html',
  styleUrls: ['./stock-return-history-list.component.scss']
})
export class StockReturnHistoryListComponent
  implements OnInit, OnDestroy, AfterViewInit {
  transferTypeForm: FormGroup;
  hasNotification = false;
  isStockInvoiceHistoryLoadedOnce = false;
  error$: Observable<CustomErrors>;
  pageSize = 4;
  initialPageSize = 8;
  destroy$: Subject<null> = new Subject<null>();
  historyAdvancedFilter: HistoryAdvancedFilterPayload;
  @ViewChild('searchBox', { static: true })
  searchBox: ElementRef;
  @ViewChild('transferTypeDropDown', { read: ElementRef })
  transferTypeDropDown: ElementRef;
  @ViewChild(CardListComponent)
  cardListComponentRef: CardListComponent;
  searchForm: FormGroup;
  searchFormControl = new FormControl();
  showNoResultsFoundNaN = false;
  type: StockIssueTypesEnum;
  StockIssueTypesEnumRef = StockIssueTypesEnum;
  stockIssueTEPGEPTypesEnumRef = StockIssueTEPGEPTypesEnum;
  stockIssueAPiRequestTypesEnumRef = StockIssueAPIRequestTypesEnum;
  stockIssueHistoryTypesRef = StockIssueHistoryTypes;
  stockIssueHistoryAPITypes: StockIssueHistoryAPITypes;
  isHistoryLoading$: Observable<boolean>;
  isLoadingHistory = false;
  historyForm: FormGroup;
  requestType: any;
  invoiceType: string = null;
  historyType: string = StockIssueHistoryTypes.BTQ_CFA;
  stockInvoiceHistory$: Observable<RequestInvoice[]>;
  stockInvoiceHistoryCount$: Observable<number>;
  tab: string;
  radioButtonType: string = StockIssueHistoryTypes.TEP_PLAIN;
  tepApiType: string = StockIssueHistoryAPITypes.TEP_PLAIN;
  invoiceNumber = null;
  isLoggedIn: boolean;
  noDataFoundMessage: string;
  historyTypesRef = HistoryTypes;

  returnInvoiceHistoryTab = 'Inventory Stock Issue - Return to CFA Tab L3';
  tepHistoryTab = 'Inventory Stock Issue - TEP History Tab L3';
  gepHistoryTab = 'Inventory Stock Issue - GEP History Tab L3';

  newIssuesDropdown = 'Inventory Stock Issue - Create Issue Type Dropdown L3';

  newIssueToCFAPermission = 'Inventory Stock Issue - L3 Dropdown value CFA';
  newTepPlainIssuePermission =
    'Inventory Stock Issue - L3 Dropdown value TEP_PLAIN';
  newTepStuddedIssuePermission =
    'Inventory Stock Issue - L3 Dropdown value TEP_STUDDED';
  newGepIssuePermission = 'Inventory Stock Issue - L3 Dropdown value GEP';
  newTepGoldCoinIssuePermission =
    'Inventory Stock Issue - L3 Dropdown value TEP GOLD COIN';

  tepPlainRadioButton = 'Inventory Stock Issue - TEP Plain Radio Button';
  tepStuddedRadioButton = 'Inventory Stock Issue - TEP Studded Radio Button';
  tepGoldCoinRadioButton = 'Inventory Stock Issue - TEP Gold Coin Radio Button';

  permissions$: Observable<any[]>;
  reset = true;
  currentFiscalYear: string;
  @ViewChild('tabRef') tabRef: ElementRef;

  stockStatusEnumRef = StockStatusEnum;
  bussinessDay = null;
  constructor(
    private stockReturnFacade: StockReturnFacade,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private shortcutService: ShortcutServiceAbstraction,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private dialog: MatDialog,
    private elementPermission: ElementPermissionService,
    private permissionfacade: PermissionFacade,
    private authFacade: AuthFacade,
    private translate: TranslateService,
    private locationSettingsFacade: LocationSettingsFacade,
    private bodEodFeatureService: SharedBodEodFeatureServiceAbstraction
  ) {
    this.translate
      .get(['pw.entity.invoiceHistoryEntity'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((entity: any) => {
        this.translate
          .get(['pw.global.noDataFoundMessage'], {
            entityName: entity['pw.entity.invoiceHistoryEntity']
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe((translatedMsg: any) => {
            this.noDataFoundMessage =
              translatedMsg['pw.global.noDataFoundMessage'];
          });
      });
    this.transferTypeForm = this.formBuilder.group({
      selectedTransferType: ''
    });
    this.isStockInvoiceHistoryLoadedOnce = false;
    this.searchForm = this.formBuilder.group({
      searchValue: []
    });

    this.historyForm = this.formBuilder.group({
      selectTepRadioButton: new FormControl('')
    });
    if (
      this.router.getCurrentNavigation() &&
      this.router.getCurrentNavigation().extras.state &&
      this.router.getCurrentNavigation().extras.state.clearFilter === false
    ) {
      this.reset = false;
    } else {
      this.reset = true;
      this.stockReturnFacade.resetAdvanceFilter(this.bussinessDay);
    }
  }

  ngOnInit() {
    this.permissions$ = this.permissionfacade.getPermissionforURL();
    this.hasNotification = false;
    this.historyType = this.activatedRoute.snapshot.params['invoiceType'];
    this.bodEodFeatureService
      .getLatestBusinessDate()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.bussinessDay = data;
          this.stockReturnFacade.storeAdvancedFilterData({
            docFromDate: this.historyAdvancedFilter?.docFromDate
              ? this.historyAdvancedFilter.docFromDate
              : moment(this.bussinessDay).startOf('day').valueOf(),
            docToDate: this.historyAdvancedFilter?.docFromDate
              ? this.historyAdvancedFilter?.docFromDate
              : moment(this.bussinessDay).endOf('day').valueOf(),
            fiscalYear: this.historyAdvancedFilter?.fiscalYear
              ? this.historyAdvancedFilter.fiscalYear
              : null,
            invoiceNumber: this.historyAdvancedFilter?.invoiceNumber
              ? this.historyAdvancedFilter.invoiceNumber
              : null
          });
          this.isLoadingHistory = false;
          this.loadHistory();
        }
      });
    if (
      this.activatedRoute.snapshot.params['invoiceType'] ===
      StockIssueHistoryTypes.TEP_PLAIN
    ) {
      this.historyType = StockIssueHistoryTypes.TEP_PLAIN;
      this.invoiceType = StockIssueHistoryAPITypes.TEP_PLAIN;
      this.historyForm
        .get('selectTepRadioButton')
        .setValue(StockIssueHistoryTypes.TEP_PLAIN);
    } else if (
      this.activatedRoute.snapshot.params['invoiceType'] ===
      StockIssueHistoryTypes.TEP_STUDDED
    ) {
      this.historyType = StockIssueHistoryTypes.TEP_STUDDED;
      this.invoiceType = StockIssueHistoryAPITypes.TEP_STUDDED;
      this.historyForm
        .get('selectTepRadioButton')
        .setValue(StockIssueHistoryTypes.TEP_STUDDED);
    } else if (
      this.activatedRoute.snapshot.params['invoiceType'] ===
      StockIssueHistoryTypes.TEP_GOLD_COIN
    ) {
      this.historyType = StockIssueHistoryTypes.TEP_GOLD_COIN;
      this.invoiceType = StockIssueHistoryAPITypes.TEP_GOLD_COIN;
      this.historyForm
        .get('selectTepRadioButton')
        .setValue(StockIssueHistoryTypes.TEP_GOLD_COIN);
    }
    this.locationSettingsFacade
      .getLocationSetting(LocationSettingAttributesEnum.COUNTRY_FISCAL_YEAR)
      .pipe(takeUntil(this.destroy$))
      .subscribe((fiscalyear: string) => {
        this.currentFiscalYear = fiscalyear;
      });
    this.stockReturnFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
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
        if (
          this.activatedRoute.snapshot.params['invoiceType'] ===
          StockIssueHistoryTypes.TEP_PLAIN
        ) {
          this.historyType = StockIssueHistoryTypes.TEP_PLAIN;
          this.invoiceType = StockIssueHistoryAPITypes.TEP_PLAIN;
          this.historyForm
            .get('selectTepRadioButton')
            .setValue(StockIssueHistoryTypes.TEP_PLAIN);
        } else if (
          this.activatedRoute.snapshot.params['invoiceType'] ===
          StockIssueHistoryTypes.TEP_STUDDED
        ) {
          this.historyType = StockIssueHistoryTypes.TEP_STUDDED;
          this.invoiceType = StockIssueHistoryAPITypes.TEP_STUDDED;
          this.historyForm
            .get('selectTepRadioButton')
            .setValue(StockIssueHistoryTypes.TEP_STUDDED);
        } else if (
          this.activatedRoute.snapshot.params['invoiceType'] ===
          StockIssueHistoryTypes.TEP_GOLD_COIN
        ) {
          this.historyType = StockIssueHistoryTypes.TEP_GOLD_COIN;
          this.invoiceType = StockIssueHistoryAPITypes.TEP_GOLD_COIN;
          this.historyForm
            .get('selectTepRadioButton')
            .setValue(StockIssueHistoryTypes.TEP_GOLD_COIN);
        }
      });

    this.historyForm
      .get('selectTepRadioButton')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((type: any) => {
        if (type === StockIssueHistoryTypes.TEP_PLAIN) {
          this.historyType = type;
          this.invoiceType = StockIssueHistoryAPITypes.TEP_PLAIN;
        } else if (type === StockIssueHistoryTypes.TEP_STUDDED){
          this.historyType = type;
          this.invoiceType = StockIssueHistoryAPITypes.TEP_STUDDED;
        } else if (type === StockIssueHistoryTypes.TEP_GOLD_COIN){
          this.historyType = type;
          this.invoiceType = StockIssueHistoryAPITypes.TEP_GOLD_COIN;
        }
        this.router.navigate([getStockIssueInvoiceHistoryUrl(type)]);
        this.loadHistory();
      });
    this.stockReturnFacade
      .getAdvancedFilter()
      .pipe(takeUntil(this.destroy$))
      .subscribe((advancedFilter: HistoryAdvancedFilterPayload) => {
        this.historyAdvancedFilter = advancedFilter;
      });
    this.shortcutService.componentNames = [componentName];
    this.shortcutService.commands
      .pipe(takeUntil(this.destroy$))
      .subscribe(command => this.shortcutEventHandler(command));
    this.changeStockIssueHistoryType(this.historyType);
    this.componentInit();
  }
  componentInit() {
    this.isHistoryLoading$ = this.stockReturnFacade.getIsLoadingHistory();
    this.stockReturnFacade
      .getIsLoadingHistory()
      .pipe(takeUntil(this.destroy$))
      .subscribe((isLoading: boolean) => {
        this.isLoadingHistory = isLoading;
      });
    this.stockInvoiceHistory$ = this.stockReturnFacade.getIssueInvoiceHistory();
    this.stockInvoiceHistoryCount$ = this.stockReturnFacade.getIssueInvoiceHistoryCount();
    this.stockInvoiceHistory$
      .pipe(takeUntil(this.destroy$))
      .subscribe((invoiceHistory: RequestInvoice[]) => {
        if (
          invoiceHistory &&
          invoiceHistory.length !== 0 &&
          !this.isStockInvoiceHistoryLoadedOnce
        ) {
          this.isStockInvoiceHistoryLoadedOnce = true;
        }
      });
  }

  ngAfterViewInit(): void {
    /**
     * Event Handler for search Box input with debounce
     */
    fromEvent(this.searchBox.nativeElement, 'input')
      .pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe((event: any) => {
        this.invoiceNumber = this.searchFormControl.value;
        this.showNoResultsFoundNaN = false;
        if (this.invoiceNumber != null) {
          if (this.validateSearch(this.invoiceNumber)) {
            this.loadHistory();
          }
        } else if (this.invoiceNumber === '') {
          this.clearSearch();
        }
      });
  }
  validateSearch(searchValue: string): boolean {
    return fieldValidation.requestNumberField.pattern.test(searchValue);
  }

  newIssueToCFA() {
    this.router.navigate([
      getStockIssueRouteUrl(getStockReceiveIssueCFADefaultRouteUrl())
    ]);
  }
  /**
   * method to handle shortcut commands
   * @param command: shortcut command
   */
  shortcutEventHandler(command: Command) {
    let isTab = false;
    const tabCount = Number(command.name.split('_').pop());
    if (
      (command.name === tab1ShortcutKey ||
        command.name === tab2ShortcutKey ||
        command.name === tab3ShortcutKey) &&
      !isNaN(tabCount) &&
      tabCount <= this.tabRef.nativeElement.children.length
    ) {
      switch (this.tabRef.nativeElement.children[tabCount - 1].id) {
        case 'invoiceHistory': {
          this.changeStockIssueHistoryType(StockIssueHistoryTypes.BTQ_CFA);
          isTab = true;
          break;
        }
        case 'tepHistory': {
          this.changeStockIssueHistoryType(StockIssueHistoryTypes.TEP);
          isTab = true;
          break;
        }
        case 'gepHistory': {
          this.changeStockIssueHistoryType(StockIssueHistoryTypes.GEP);
          isTab = true;
          break;
        }
      }
    }

    if (!isTab) {
      if (command.name === searchShortCutKeyF2) {
        if (this.searchBox) {
          this.searchBox.nativeElement.focus();
        }
      } else if (command.name === cardlistShortcutKeyF2) {
        if (this.cardListComponentRef) {
          this.cardListComponentRef.focus();
        }
      } else if (command.name === primaryDropdownShortcutKeyF7) {
        if (this.transferTypeDropDown) {
          this.transferTypeDropDown.nativeElement.focus();
        }
      } else if (command.name === backShortcutKey) {
        this.back();
      } else if (command.name === filterShortCutKeyF8) {
        this.advancedFilter();
      }
    }
  }

  back() {
    this.router.navigate([getInventoryHomeRouteUrl()]);
  }
  changeStockIssueHistoryType(newType: string) {
    if (this.tab !== newType) {
      if (this.reset) {
        this.stockReturnFacade.resetAdvanceFilter(this.bussinessDay);
      } else {
        this.reset = true;
      }
      switch (newType) {
        case StockIssueHistoryTypes.BTQ_CFA:
          this.historyType = newType;
          this.tab = newType;
          this.invoiceType = StockIssueHistoryAPITypes.BTQ_CFA;
          if (this.bussinessDay) this.loadHistory();
          this.router.navigate([
            getStockIssueInvoiceHistoryUrl(this.historyType)
          ]);
          break;
        case StockIssueHistoryTypes.TEP_PLAIN:
        case StockIssueHistoryTypes.TEP_STUDDED:
        case StockIssueHistoryTypes.TEP_GOLD_COIN:
          this.tab = StockIssueHistoryTypes.TEP;
          if (this.bussinessDay) this.loadHistory();
          this.router.navigate([
            getStockIssueInvoiceHistoryUrl(this.historyType)
          ]);
          break;
        case StockIssueHistoryTypes.GEP:
          this.tab = newType;
          this.historyType = newType;
          this.invoiceType = StockIssueHistoryAPITypes.GEP;
          if (this.bussinessDay) this.loadHistory();
          this.router.navigate([
            getStockIssueInvoiceHistoryUrl(this.historyType)
          ]);
          break;
        case StockIssueHistoryTypes.TEP:
          this.tab = newType;
          this.historyType = this.radioButtonType;
          this.invoiceType = this.tepApiType;
          this.router.navigate([getStockIssueTEPHistoryAllowedRouteUrl()]);
          break;
      }
    }
  }
  loadHistory() {
    this.isStockInvoiceHistoryLoadedOnce = false;
    this.stockReturnFacade.resetStockReturnHistory();
    this.loadStocks(0);
  }

  loadStocks(pageIndex) {
    if (this.isLoadingHistory === false) {
      if (this.historyAdvancedFilter) {
        if (
          this.historyAdvancedFilter.invoiceNumber !== '' &&
          this.historyAdvancedFilter.invoiceNumber !== null
        ) {
          this.invoiceNumber = this.historyAdvancedFilter.invoiceNumber;
        }
      }
      this.stockReturnFacade.loadIssueInvoiceHistory({
        loadStockIssueInvoiceHistory: {
          actionType: 'ISSUE',
          dateRangeType: 'CUSTOM',
          destDocNo: null,
          destFiscalYear: null,
          endDate: this.historyAdvancedFilter.docToDate
            ? this.historyAdvancedFilter.docToDate
            : moment(this.bussinessDay).endOf('day').valueOf(),
          locationCode: null,
          srcDocNo: this.invoiceNumber,
          srcFiscalYear: this.historyAdvancedFilter
            ? this.historyAdvancedFilter.fiscalYear
            : null,
          startDate: this.historyAdvancedFilter.docFromDate
            ? this.historyAdvancedFilter.docFromDate
            : moment(this.bussinessDay).startOf('day').valueOf(),
          statuses: []
        },
        pageIndex: pageIndex,
        pageSize: this.isStockInvoiceHistoryLoadedOnce
          ? this.pageSize
          : this.initialPageSize,
        invoiceType: this.invoiceType
      });
    }
  }
  onSelected(issue: any) {
    this.router.navigate([
      getStockIssueReturnDetailsRouteUrl(this.historyType, issue.id)
    ]);
  }

  /**
   * method to call the transfer type
   * @param selectedTransferType : type selected from dropdown
   */
  createStockIssueTransferType() {
    const selectedTransferType = this.transferTypeForm.value
      .selectedTransferType;
    if (selectedTransferType === 'NEW_ISSUE_TO_CFA') {
      this.newIssueToCFA();
    } else {
      this.getIssueTEPGEPUrl(selectedTransferType);
    }
  }

  getIssueTEPGEPUrl(selectedTransferType) {
    const type = StockIssueTypesEnum.FACTORY;
    this.router.navigate([
      getStockIssueTEPGEPRouteUrl(
        type,
        selectedTransferType.toLowerCase().replace(/_/gi, '-')
      )
    ]);
  }

  clearSearch(event = null) {
    this.searchFormControl.reset();
    this.invoiceNumber = null;
    this.loadHistory();
  }

  advancedFilter() {
    this.dialog.closeAll();
    const emitData = {
      advanceFilter: this.historyAdvancedFilter
        ? this.historyAdvancedFilter
        : {},
      currentFiscalYear: this.currentFiscalYear,
      bussinessDay: moment(this.bussinessDay)
    };
    this.overlayNotification.close();
    const dialogRef = this.dialog.open(StockReturnHistoryPopupComponent, {
      width: '30vw',
      data: emitData,
      disableClose: true
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (res !== undefined) {
          this.invoiceNumber = null;
          this.stockReturnFacade.storeAdvancedFilterData(res);
          this.loadHistory();
        }
      });
  }
  omit_special_char($event: KeyboardEvent) {
    const pattern = /^[0-9]$/;
    return pattern.test($event.key);
  }
  errorHandler(error: CustomErrors) {
    this.hasNotification = true;
    this.overlayNotification
      .show({
        type: OverlayNotificationType.ERROR,
        hasBackdrop: true,
        hasClose: true,
        error: error
      })
      .events.pipe(take(1))
      .subscribe((event: OverlayNotificationEventRef) => {
        this.hasNotification = false;
      });
  }

  /**
   * gets the status of the request and determines the color code and status description
   * @param status : status of the request
   */
  loadPermission = (element: string) =>
    this.elementPermission.loadPermission(element, this.permissions$);

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
