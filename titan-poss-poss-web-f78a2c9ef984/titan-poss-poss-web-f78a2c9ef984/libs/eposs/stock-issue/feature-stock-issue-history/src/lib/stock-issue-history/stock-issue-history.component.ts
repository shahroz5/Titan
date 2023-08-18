import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  AfterViewInit
} from '@angular/core';
import {
  StockRequestNote,
  CustomErrors,
  OverlayNotificationServiceAbstraction,
  LoadIssueHistoryPayload,
  StockIssueHistoryTypes,
  IssueAdvanceFilterPayload,
  LocationSettingAttributesEnum,
  SharedBodEodFeatureServiceAbstraction,
  StockIssueTypesEnum,
  StockIssueAPIRequestTypesEnum,
  StockIssueTEPGEPTypesEnum,
  OverlayNotificationType,
  OverlayNotificationEventRef,
  Command,
  ShortcutServiceAbstraction
} from '@poss-web/shared/models';
import { Observable, Subject, fromEvent, combineLatest } from 'rxjs';
import { StockIssueFacade } from '@poss-web/eposs/stock-issue/data-access-stock-issue';
import { Router, ActivatedRoute, NavigationEnd, Event } from '@angular/router';
import {
  takeUntil,
  debounceTime,
  filter,
  withLatestFrom,
  take
} from 'rxjs/operators';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import {
  getStockIssueTEPGEPRouteUrl,
  getStockIssueBoutiqueHistoryAllowedRouteUrl,
  getStockIssueFactoryHistoryAllowedRouteUrl,
  getStockIssueHistoryTabRouteUrl,
  getStockIssueHistoryDetailsRouteUrl
} from '@poss-web/shared/util-site-routes';

import { CardListComponent } from '@poss-web/shared/components/ui-card-list';
import { ProfileDataFacade } from '@poss-web/shared/profile/data-access-profile';
import * as moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { HistoryAdvancedSearchPopupComponent } from '@poss-web/eposs/shared/ui-out-of-stock-popup';
import { TranslateService } from '@ngx-translate/core';
import { commonTranslateKeyMap } from '@poss-web/shared/util-adaptors';
import { fieldValidation } from '@poss-web/shared/util-field-validators';
import { ElementPermissionService } from '@poss-web/shared/permission/util-element-permissions';
import { PermissionFacade } from '@poss-web/shared/permission/data-access-permission';
import { PermissionService } from '@poss-web/shared/permission/ui-permission';
import { AuthFacade } from '@poss-web/shared/auth/data-access-auth';
import { LocationSettingsFacade } from '@poss-web/shared/location-settings/data-access-location-settings';
const searchShortCutKeyF2 = 'StockIssueListComponent.MAIN_SEARCH';
const cardlistShortcutKeyF4 = 'StockIssueListComponent.CARD_LIST';
const backShortcutKey = 'StockIssueListComponent.BACK';

// const tepPlainL3ShortcutKey = 'StockIssueListComponent.MENU2';
// const tepStuddedL3ShortcutKey = 'StockIssueListComponent.MENU3';
// const gepL3ShortcutKey = 'StockIssueListComponent.MENU4';

const primaryDropdownShortcutKeyTS = 'StockIssueListComponent.PRIMARY_DROPDOWN';
const secondaryDropdownShortcutKeyTD =
  'StockIssueListComponent.SECONDARY_DROPDOWN';
const tab1ShortcutKey = 'Common.TAB_1';
const tab2ShortcutKey = 'Common.TAB_2';
const tab3ShortcutKey = 'Common.TAB_3';
const tab4ShortcutKey = 'Common.TAB_4';
const componentName = 'StockIssueListComponent';
const filterShortcutKey = 'StockIssueListComponent.FILTER';

@Component({
  selector: 'poss-web-stock-issue-history',
  templateUrl: './stock-issue-history.component.html'
})
export class StockIssueHistoryComponent
  implements OnInit, OnDestroy, AfterViewInit {
  storeType: string;

  isLoadingCount$: Observable<boolean>;
  isLoadingCFA$: Observable<boolean>;
  isLoadingHistoryCount$: Observable<boolean>;

  BTQ_FAC_IssuePendingSTNCount$: Observable<number>;
  BTQ_BTQ_IssuePendingSTNCount$: Observable<number>;
  BTQ_MER_IssuePendingSTNCount$: Observable<number>;
  allPendingIssuePendingSTNCount$: Observable<number>;
  issueHistoryCount$: Observable<number>;

  BTQ_FAC_PendingSTN$: Observable<StockRequestNote[]>;
  BTQ_BTQ_PendingSTN$: Observable<StockRequestNote[]>;
  BTQ_MER_PendingSTN$: Observable<StockRequestNote[]>;
  searchIssueSTNResult$: Observable<StockRequestNote[]>;

  issueHistory$: Observable<StockRequestNote[]>;

  isLoadingBTQ_FAC_STN: boolean;
  isLoadingBTQ_BTQ_STN: boolean;
  isLoadingBTQ_MER_STN: boolean;

  isLoadingHistory: boolean;

  isSearchingIssues$: Observable<boolean>;
  hasSearchIssueResults$: Observable<boolean>;

  isPendingBTQ_FACSTNLoadedOnce = false;
  isPendingBTQ_BTQSTNLoadedOnce = false;
  isPendingBTQ_MERSTNLoadedOnce = false;

  isHistoryLoadedOnce = false;
  isStockInvoiceHistoryLoadedOnce = false;

  isL1L2Store: boolean;
  isL3Store: boolean;

  error$: Observable<CustomErrors>;
  isLoading = false;

  pageSize = 4;
  initialPageSize = 8;
  dateFormat: string;
  destroy$: Subject<null> = new Subject<null>();

  noDataFoundMessage;

  @ViewChild('historySearch')
  private historySearch: ElementRef;

  @ViewChild(CardListComponent)
  cardListComponentRef: CardListComponent;

  // requestTypeForm: FormGroup;

  historySearchControl = new FormControl();
  showNoResultsFoundNaN = false;

  type: StockIssueTypesEnum;
  historyType: StockIssueHistoryTypes;
  StockIssueTypesEnumRef = StockIssueTypesEnum;
  stockIssueHistoryTypesRef = StockIssueHistoryTypes;
  stockIssueTEPGEPTypesEnumRef = StockIssueTEPGEPTypesEnum;
  stockIssueAPiRequestTypesEnumRef = StockIssueAPIRequestTypesEnum;
  isHistoryLoading$: Observable<boolean>;
  historyBoutiqueTypes: {
    value: StockIssueAPIRequestTypesEnum;
    translateKey: string;
    elementName: string;
  }[] = [];
  historyFactoryTypes: {
    value: StockIssueAPIRequestTypesEnum;
    translateKey: string;
    elementName: string;
  }[] = [];

  historyForm: FormGroup;
  currentDate = moment();

  historyFormData = null;

  requestType: any;
  invoiceType: string = null;

  status: string;
  statusColor: string;
  hasNotification = false;

  advanceFilter = null;
  docNumber = null;
  isLoggedIn: boolean;

  navigation: any;

  //TABS
  STOCK_ISSUE_ISSUE_TO_FACTORY_TAB =
    'Inventory Stock Issue - Issue to Factory Tab';
  STOCK_ISSUE_ISSUE_TO_MERCHANDISE_TAB =
    'Inventory Stock Issue - Issue to Merchandise Tab';
  STOCK_ISSUE_ISSUE_TO_OTHER_BOUTIQUES_TAB =
    'Inventory Stock Issue - Issue to Other Boutique Tab';
  STOCK_ISSUE_HISTORY_TAB = 'Inventory Stock Issue - History Tab';

  //NEW ISSUE DROPDOWN
  STOCK_ISSUE_TO_FACTORY_LIST =
    'Inventory Stock Issue - Issues Types Dropdown List';

  //NEW ISSUE DROPDOWN VALUES
  TEP_STUDDED_DROPDOWNLIST_VALUE =
    'Inventory Stock Issue - Other Issues List TEP STUDDED';
  TEP_PLAIN_DROPDOWNLIST_VALUE =
    'Inventory Stock Issue - Other Issues List TEP PLAIN';
  GEP_DROPDOWNLIST_VALUE = 'Inventory Stock Issue - Other Issues List GEP';

  //HISTORY RADIO BTN
  HISTORY_RADIO_BTN_FACTORY =
    'Inventory Stock Issue History - Radio button Issued to Factory';
  HISTORY_RADIO_BTN_BOUTIQUE =
    'Inventory Stock Issue History - Radio button Issued to Other Boutiques';
  //HISTORY DROPDOWN VALUES
  HISTORY_DROPDOWN_FACTORY = 'Inventory Stock Issue History - Dropdown Factory';
  HISTORY_DROPDOWN_TEP_PLAIN =
    'Inventory Stock Issue History - Dropdown TEP PLAIN';
  HISTORY_DROPDOWN_TEP_STUDDED =
    'Inventory Stock Issue History - Dropdown TEP STUDDED';
  HISTORY_DROPDOWN_GEP = 'Inventory Stock Issue History - Dropdown GEP';
  HISTORY_DROPDOWN_MER = 'Inventory Stock Issue History - Dropdown MER';
  HISTORY_DROPDOWN_IBT = 'Inventory Stock Issue History - Dropdown IBT';
  HISTORY_DROPDOWN_TEP_GOLD_COIN =
    'Inventory Stock Issue History - Dropdown TEP GOLD COIN';
  HISTORY_DROPDOWN_DEFECTIVE =
    'Inventory Stock Issue History - Dropdown DEFECTIVE';
  HISTORY_DROPDOWN_BTQ_CFA = 'Inventory Stock Issue History - Dropdown BTQ CFA';
  HISTORY_DROPDOWN_DIRECT_ISSUE =
    'Inventory Stock Issue History - Dropdown Direct Issue';

  permissions$: Observable<any[]>;
  currentFiscalYear: string;
  bussinessDay = null;
  constructor(
    private stockIssueFacade: StockIssueFacade,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private appsettingFacade: AppsettingFacade,
    private formBuilder: FormBuilder,
    private shortcutService: ShortcutServiceAbstraction,
    private profiledatafacade: ProfileDataFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private dialog: MatDialog,
    private translate: TranslateService,
    private elementPermission: ElementPermissionService,
    private permissionfacade: PermissionFacade,
    private permissionService: PermissionService,
    private authFacade: AuthFacade,
    private locationSettingsFacade: LocationSettingsFacade,
    private bodEodFeatureService: SharedBodEodFeatureServiceAbstraction
  ) {
    this.translate
      .get(['pw.entity.requestsEntity'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((entity: any) => {
        this.translate
          .get(['pw.global.noDataFoundMessage'], {
            entityName: entity['pw.entity.requestsEntity']
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe((translatedMsg: any) => {
            this.noDataFoundMessage =
              translatedMsg['pw.global.noDataFoundMessage'];
          });
      });
    this.isStockInvoiceHistoryLoadedOnce = false;

    this.historyForm = this.formBuilder.group({
      selectRadioButton: new FormControl('')
    });
    if (
      this.router.getCurrentNavigation() &&
      this.router.getCurrentNavigation().extras.state &&
      this.router.getCurrentNavigation().extras.state.clearFilter === false
    ) {
    } else {
      this.stockIssueFacade.clearAdvancedFilterData(this.bussinessDay);
    }
  }

  ngOnInit() {
    this.permissions$ = this.permissionfacade.getPermissionforURL();
    this.stockIssueFacade.resetLoadedHistory();
    this.stockIssueFacade.resetError();
    //todo check
    this.isHistoryLoadedOnce = false;
    this.isStockInvoiceHistoryLoadedOnce = false;
    this.bodEodFeatureService
      .getLatestBusinessDate()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.bussinessDay = data;
          this.stockIssueFacade.setAdvancedFilterData({
            docFromDate: this.advanceFilter?.docFromDate
              ? this.advanceFilter.docFromDate
              : moment(this.bussinessDay).startOf('day').valueOf(),
            docToDate: this.advanceFilter?.docToDate
              ? this.advanceFilter?.docToDate
              : moment(this.bussinessDay).endOf('day').valueOf(),
            locationCode: this.advanceFilter?.locationCode
              ? this.advanceFilter.locationCode
              : null,
            fiscalYear: this.advanceFilter?.fiscalYear
              ? this.advanceFilter?.fiscalYear
              : null,
            docNo: this.advanceFilter?.docNo ? this.advanceFilter.docNo : null
          });
          if (this.type === StockIssueTypesEnum.HISTORY) {
            this.loadStocks(0);
          }
        }
      });
    this.locationSettingsFacade
      .getLocationSetting(LocationSettingAttributesEnum.COUNTRY_FISCAL_YEAR)
      .pipe(takeUntil(this.destroy$))
      .subscribe((fiscalYear: string) => {
        this.currentFiscalYear = fiscalYear;
      });
    this.historyForm
      .get('selectRadioButton')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value: any) => {
        this.stockIssueFacade.resetLoadedHistory();
        if (value === StockIssueTypesEnum.FACTORY) {
          this.router.navigate([getStockIssueFactoryHistoryAllowedRouteUrl()]);
        } else {
          this.router.navigate([getStockIssueBoutiqueHistoryAllowedRouteUrl()]);
        }
        // todo patch according to url
        // if (
        //   this.historyForm.get('selectRadioButton').value ===
        //   StockIssueTypesEnum.BOUTIQUE
        // ) {
        //   // check url then patch
        //   this.historyAPITypeForm.patchValue({
        //     selectedType: StockIssueAPIRequestTypesEnum.BTQ
        //   });
        // } else if (
        //   this.historyForm.get('selectRadioButton').value ===
        //   StockIssueTypesEnum.FACTORY
        // ) {
        //   this.historyAPITypeForm.patchValue({
        //     selectedType: StockIssueAPIRequestTypesEnum.FAC
        //   });
        // }
      });

    combineLatest([
      this.elementPermission.loadPermission(
        this.STOCK_ISSUE_ISSUE_TO_FACTORY_TAB,
        this.permissions$
      ),
      this.elementPermission.loadPermission(
        this.STOCK_ISSUE_ISSUE_TO_OTHER_BOUTIQUES_TAB,
        this.permissions$
      ),
      this.elementPermission.loadPermission(
        this.STOCK_ISSUE_ISSUE_TO_MERCHANDISE_TAB,
        this.permissions$
      )
    ])
      .pipe(takeUntil(this.destroy$))
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
          this.stockIssueFacade.LoadIssueSTNCount();
        }
      });

    this.shortcutService.componentNames = [componentName];
    this.shortcutService.commands
      .pipe(takeUntil(this.destroy$))
      .subscribe(command => this.shortcutEventHandler(command));
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
  }

  ngAfterViewInit(): void {
    /**
     * Event Handler for search Box input with debounce
     */

    fromEvent(this.historySearch.nativeElement, 'input')
      .pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe((event: any) => {
        const docNumber = this.historySearchControl.value;
        this.showNoResultsFoundNaN = false;
        if (docNumber !== '') {
          if (this.validateSearch(docNumber)) {
            if (
              this.advanceFilter.docNo !== '' &&
              this.advanceFilter.docNo !== null
            ) {
              this.advanceFilter = {
                ...this.advanceFilter,
                docNo: null,
                fiscalYear: null
              };
            }
            this.docNumber = docNumber;
            this.stockIssueFacade.resetLoadedHistory();
            this.isHistoryLoadedOnce = false;
            this.loadStocks(0);
          } else {
            this.stockIssueFacade.resetLoadedHistory();
          }
        } else {
          this.clearHistorySearch();
        }
      });
  }
  validateSearch(searchValue: string): boolean {
    return fieldValidation.requestNumberField.pattern.test(searchValue);
  }

  /**
   * method to handle shortcut commands
   * @param command: shortcut command
   */
  // shortcutEventHandler(command: Command) {
  //   if (command.name === searchShortCutKeyF2) {
  //     if (this.searchBox) {
  //       this.searchBox.nativeElement.focus();
  //     }
  //   } else if (command.name === cardlistShortcutKeyF2) {
  //     if (this.cardListComponentRef) {
  //       this.cardListComponentRef.focus();
  //     }
  //   } else if (command.name === primaryDropdownShortcutKeyF7) {
  //     if (this.type !== StockIssueTypesEnum.FACTORY) {
  //       if (this.issueTypeDropdown) {
  //         this.issueTypeDropdown.nativeElement.focus();
  //       }
  //     } else {
  //       if (this.transferTypeDropDown) {
  //         this.transferTypeDropDown.nativeElement.focus();
  //       }
  //     }
  //   } else if (command.name === secondaryDropdownShortcutKeyF8) {
  //     if (this.issueTypeDropdown) {
  //       this.issueTypeDropdown.nativeElement.focus();
  //     }
  //   } else if (command.name === backShortcutKey) {
  //     this.back();
  //   } else if (command.name === tepPlainL3ShortcutKey) {
  //     this.getIssueTEPGEPUrl(this.stockIssueTEPGEPTypesEnumRef.TEP_PLAIN);
  //   } else if (command.name === tepStuddedL3ShortcutKey) {
  //     this.getIssueTEPGEPUrl(this.stockIssueTEPGEPTypesEnumRef.TEP_STUDDED);
  //   } else if (command.name === gepL3ShortcutKey) {
  //     this.getIssueTEPGEPUrl(this.stockIssueTEPGEPTypesEnumRef.GEP);
  //   } else if (command.name === tab1ShortcutKey) {
  //     this.changeStockIssueType(StockIssueTypesEnum.FACTORY);
  //   } else if (command.name === tab2ShortcutKey) {
  //     this.changeStockIssueType(StockIssueTypesEnum.BOUTIQUE);
  //   } else if (command.name === tab3ShortcutKey) {
  //     this.changeStockIssueType(StockIssueTypesEnum.HISTORY);
  //   }
  // }
  shortcutEventHandler(command: Command) {
    const isTab = false;
    const tabCount = Number(command.name.split('_').pop());

    if (!isTab) {
      if (command.name === searchShortCutKeyF2) {
        if (this.historySearch) {
          this.historySearch.nativeElement.focus();
        }
      } else if (command.name === cardlistShortcutKeyF4) {
        if (this.cardListComponentRef) {
          this.cardListComponentRef.focus();
        }
      }
      // else if (command.name === tepPlainL3ShortcutKey) {
      //   this.getIssueTEPGEPUrl(this.stockIssueTEPGEPTypesEnumRef.TEP_PLAIN);
      // } else if (command.name === tepStuddedL3ShortcutKey) {
      //   this.getIssueTEPGEPUrl(this.stockIssueTEPGEPTypesEnumRef.TEP_STUDDED);
      // } else if (command.name === gepL3ShortcutKey) {
      //   this.getIssueTEPGEPUrl(this.stockIssueTEPGEPTypesEnumRef.GEP);
      // }
      else if (command.name === filterShortcutKey) {
        this.openHistoryFilter();
      }
    }
  }

  componentInit() {
    this.hasNotification = false;
    this.stockIssueFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });

    this.stockIssueFacade.resetStockIssueList();

    this.isLoadingCount$ = this.stockIssueFacade.getIsLoadingCount();
    this.issueHistoryCount$ = this.stockIssueFacade.getIssueHistoryCount();

    this.isSearchingIssues$ = this.stockIssueFacade.getIsSearchingIssues();
    this.hasSearchIssueResults$ = this.stockIssueFacade.getHasSearchIssueResults();
    this.searchIssueSTNResult$ = this.stockIssueFacade.getSearchIssueResult();
    this.isHistoryLoading$ = this.stockIssueFacade.getIsIssueHistoryLoading();

    this.stockIssueFacade
      .getAdvancedFilterData()
      .pipe(takeUntil(this.destroy$))
      .subscribe((filterData: IssueAdvanceFilterPayload) => {
        this.advanceFilter = filterData;
      });

    this.stockIssueFacade
      .getisLoadingIssueToFactory()
      .pipe(takeUntil(this.destroy$))
      .subscribe((isLoading: boolean) => {
        this.isLoadingBTQ_FAC_STN = isLoading;
      });
    this.stockIssueFacade
      .getisLoadingIssueToBoutique()
      .pipe(takeUntil(this.destroy$))
      .subscribe((isLoading: boolean) => {
        this.isLoadingBTQ_BTQ_STN = isLoading;
      });
    this.stockIssueFacade
      .getIsLoadingIssueToMerchant()
      .pipe(takeUntil(this.destroy$))
      .subscribe((isLoading: boolean) => {
        this.isLoadingBTQ_MER_STN = isLoading;
      });

    this.stockIssueFacade
      .getIsIssueHistoryLoading()
      .pipe(takeUntil(this.destroy$))
      .subscribe((isLoading: boolean) => {
        this.isLoadingHistory = isLoading;
      });

    let fullUrl = this.router.url;
    let type = this.activatedRoute.snapshot.params['type'];

    if (fullUrl.includes(StockIssueTypesEnum.HISTORY)) {
      type = StockIssueTypesEnum.HISTORY;
      this.requestType = this.router.url.split('?')[0].split('/').pop();
      this.requestType = this.requestType.toUpperCase();

      switch (this.requestType.replace(/-/gi, '_')) {
        case StockIssueAPIRequestTypesEnum.FAC:
        case StockIssueAPIRequestTypesEnum.GEP:
        case StockIssueAPIRequestTypesEnum.TEP_PLAIN:
        case StockIssueAPIRequestTypesEnum.TEP_STUDDED:
        case StockIssueAPIRequestTypesEnum.TEP_GOLD_COIN:
        case StockIssueAPIRequestTypesEnum.BTQ_CFA:
        case StockIssueAPIRequestTypesEnum.DEFECTIVE:
          this.historyForm.patchValue(
            {
              selectRadioButton: StockIssueTypesEnum.FACTORY
            },
            { emitEvent: false }
          );
          break;
        case StockIssueAPIRequestTypesEnum.BTQ:
        case StockIssueAPIRequestTypesEnum.MER:
        case StockIssueAPIRequestTypesEnum.DIRECT_ISSUE:
          this.historyForm.patchValue(
            {
              selectRadioButton: StockIssueTypesEnum.BOUTIQUE
            },
            { emitEvent: false }
          );
          break;
      }
    }

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
        let currentUrl = this.router.url;
        if (currentUrl.includes(StockIssueTypesEnum.HISTORY)) {
          this.requestType = this.router.url.split('?')[0].split('/').pop();
          this.requestType = this.requestType.toUpperCase();
          switch (this.requestType.replace(/-/gi, '_')) {
            case StockIssueAPIRequestTypesEnum.FAC:
            case StockIssueAPIRequestTypesEnum.GEP:
            case StockIssueAPIRequestTypesEnum.TEP_PLAIN:
            case StockIssueAPIRequestTypesEnum.TEP_STUDDED:
            case StockIssueAPIRequestTypesEnum.TEP_GOLD_COIN:
            case StockIssueAPIRequestTypesEnum.BTQ_CFA:
            case StockIssueAPIRequestTypesEnum.DEFECTIVE:
              this.historyForm.patchValue(
                {
                  selectRadioButton: StockIssueTypesEnum.FACTORY
                },
                { emitEvent: false }
              );
              this.loadStocks(0);
              break;
            case StockIssueAPIRequestTypesEnum.BTQ:
            case StockIssueAPIRequestTypesEnum.MER:
            case StockIssueAPIRequestTypesEnum.DIRECT_ISSUE:
              this.historyForm.patchValue(
                {
                  selectRadioButton: StockIssueTypesEnum.BOUTIQUE
                },
                { emitEvent: false }
              );
              this.loadStocks(0);
              break;
          }
        }
      });

    // TODO make switch
    // if (type === StockIssueTypesEnum.MERCHANDISE) {
    //   this.requestTypeForm.patchValue(
    //     {
    //       selectedRequestType: StockIssueTypesEnum.MERCHANDISE
    //     },
    //     { emitEvent: false }
    //   );
    // } else if (type === StockIssueTypesEnum.BOUTIQUE) {
    //   this.requestTypeForm.patchValue(
    //     {
    //       selectedRequestType: StockIssueTypesEnum.BOUTIQUE
    //     },
    //     { emitEvent: false }
    //   );
    // }
    this.getIssues();
    this.loadStocks(0);

    // this.changeStockIssueType(type);
  }

  getIssues() {
    if (this.isL1L2Store) {
      this.BTQ_BTQ_IssuePendingSTNCount$ = this.stockIssueFacade.getPendingBTQ_BTQ_STNCount();
      this.BTQ_FAC_IssuePendingSTNCount$ = this.stockIssueFacade.getPendingBTQ_FAC_STNCount();
      this.BTQ_MER_IssuePendingSTNCount$ = this.stockIssueFacade.getPendingBTQ_MER_STNCount();

      this.issueHistoryCount$ = this.stockIssueFacade.getIssueHistoryCount();

      this.BTQ_FAC_PendingSTN$ = this.stockIssueFacade.getBTQ_FAC_PendingSTN();
      this.BTQ_FAC_PendingSTN$.pipe(takeUntil(this.destroy$)).subscribe(
        (issues: StockRequestNote[]) => {
          if (
            issues &&
            issues.length !== 0 &&
            !this.isPendingBTQ_FACSTNLoadedOnce
          ) {
            this.isPendingBTQ_FACSTNLoadedOnce = true;
          }
        }
      );
      this.BTQ_BTQ_PendingSTN$ = this.stockIssueFacade.getBTQ_BTQ_PendingSTN();
      this.BTQ_BTQ_PendingSTN$.pipe(takeUntil(this.destroy$)).subscribe(
        (issues: StockRequestNote[]) => {
          if (
            issues &&
            issues.length !== 0 &&
            !this.isPendingBTQ_BTQSTNLoadedOnce
          ) {
            this.isPendingBTQ_BTQSTNLoadedOnce = true;
          }
        }
      );
      this.BTQ_MER_PendingSTN$ = this.stockIssueFacade.getBTQ_MER_PendingSTN();
      this.BTQ_MER_PendingSTN$.pipe(takeUntil(this.destroy$)).subscribe(
        (issues: StockRequestNote[]) => {
          if (
            issues &&
            issues.length !== 0 &&
            !this.isPendingBTQ_MERSTNLoadedOnce
          ) {
            this.isPendingBTQ_MERSTNLoadedOnce = true;
          }
        }
      );
      this.issueHistory$ = this.stockIssueFacade.getIssueHistory();
      this.issueHistory$
        .pipe(takeUntil(this.destroy$))
        .subscribe((history: StockRequestNote[]) => {
          if (history && history.length !== 0 && !this.isHistoryLoadedOnce) {
            this.isHistoryLoadedOnce = true;
          }
        });
    }
  }

  // changeStockIssueTypeHistoryTab(newType: StockIssueTypesEnum) {
  //   this.showNoResultsFoundNaN = false;

  //   if (newType === StockIssueTypesEnum.HISTORY) {
  //     this.type = newType;
  //     this.clearSearch();
  //     this.isHistoryLoadedOnce = false;
  //     this.router.navigate([getStockIssueHistoryAllowedRouteUrl()]);
  //     this.type = StockIssueTypesEnum.HISTORY;
  //     this.loadStocks(0);
  //   }
  // }
  changeRequestType(newType: StockIssueAPIRequestTypesEnum) {
    this.showNoResultsFoundNaN = false;
    // this.clearSearch();

    this.isHistoryLoadedOnce = false;

    this.router.navigate([
      getStockIssueHistoryTabRouteUrl(newType.toLowerCase().replace(/_/gi, '-'))
    ]);
    // this.router.navigate(['/inventory/stockissue/history/newType']);
    this.type = StockIssueTypesEnum.HISTORY;
    // this.requestType = newType;
    // if (
    //   this.type === StockIssueTypesEnum.HISTORY &&
    //   !this.isHistoryLoadedOnce
    // ) {
    this.loadStocks(0);
    // }
    // }
  }

  searchIssues(reqDocNo: number) {
    let requestType: string;
    if (this.type === StockIssueTypesEnum.FACTORY) {
      requestType = StockIssueAPIRequestTypesEnum.FAC;
    } else if (this.type === StockIssueTypesEnum.BOUTIQUE) {
      requestType = StockIssueAPIRequestTypesEnum.BTQ;
    } else if (this.type === StockIssueTypesEnum.MERCHANDISE) {
      requestType = StockIssueAPIRequestTypesEnum.MER;
    }
    if (this.isL1L2Store) {
      this.stockIssueFacade.searchPendingIssues({
        reqDocNo: reqDocNo,
        requestType: requestType
      });
    }
  }

  loadStocks(pageIndex) {
    setTimeout(() => {
      if (!this.isLoading) {
        if (this.isL1L2Store && this.bussinessDay) {
          this.stockIssueFacade.loadIssueHistory({
            pageIndex: pageIndex,
            pageSize: pageIndex === 0 ? 8 : 4,
            sort: ['srcDocDate,asc'],
            payload: this.createHistoryPayload(),
            transferType: this.getTransferType(),
            isLegacy: this.setIsLegacyValue()
          });
        }
      }
    }, 1000);
  }

  setIsLegacyValue(): boolean {
    if (
      this.requestType === this.stockIssueAPiRequestTypesEnumRef.DIRECT_ISSUE
    ) {
      return true;
    } else if (this.requestType === this.stockIssueAPiRequestTypesEnumRef.BTQ) {
      return false;
    }
  }
  onSelected(issue: any) {
    if (this.isL1L2Store) {
      this.router.navigate([
        getStockIssueHistoryDetailsRouteUrl(
          StockIssueTypesEnum.HISTORY,
          this.requestType.toLowerCase().replace(/_/gi, '-'),
          issue.id
        )
      ]);
    } else {
      // TODO : throw an error
    }
  }

  getTransferType() {
    // ToDO check retun values
    this.requestType = this.requestType.replace(/-/gi, '_');
    switch (this.requestType) {
      case 'FAC':
        return 'BTQ_FAC';
      case 'BTQ':
        return 'BTQ_BTQ';
      case 'MER':
        return 'MER_BTQ';
      case 'TEP_PLAIN':
        return 'TEP_PLAIN';
      case 'TEP_STUDDED':
        return 'TEP_STUDDED';
      case 'GEP':
        return 'GEP';
      case 'TEP_GOLD_COIN':
        return 'TEP_GOLD_COIN';
      case 'BTQ_CFA':
        return 'BTQ_CFA';
      case 'DEFECTIVE':
        return 'DEFECTIVE';
      case 'DIRECT_ISSUE':
        return 'BTQ_BTQ';
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

  clearHistorySearch(event = null) {
    if (this.cardListComponentRef) {
      this.cardListComponentRef.resetFocus();
    }

    this.historySearchControl.reset();
    this.docNumber = null;
    this.loadStocks(0);
  }

  errorHandler(error: CustomErrors) {
    this.hasNotification = true;
    this.overlayNotification
      .show({
        type: OverlayNotificationType.ERROR,
        hasClose: true,
        error: error
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: OverlayNotificationEventRef) => {
        this.hasNotification = false;
      });
  }

  openHistoryFilter() {
    this.overlayNotification.close();
    const emitData = {
      formData: this.advanceFilter ? this.advanceFilter : {},
      currentFiscalYear: this.currentFiscalYear,
      bussinessDay: moment(this.bussinessDay),
      requestType: this.requestType
    };
    const dialogRef = this.dialog.open(HistoryAdvancedSearchPopupComponent, {
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
          this.historySearchControl.reset();
          this.stockIssueFacade.setAdvancedFilterData(data);
          this.stockIssueFacade.resetLoadedHistory();
          this.loadStocks(0);
        }
      });
  }

  /**
   * gets the status of the request and determines the color code and status description
   * @param status : status of the request
   */
  getStatus(status?: string) {
    let key = {
      status: '',
      statusColor: ''
    };
    if (commonTranslateKeyMap.has(status)) {
      key = commonTranslateKeyMap.get(status);
    }
    this.translate
      .get([key.status, key.statusColor])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: string) => {
        this.status = translatedMessages[key.status];
        this.statusColor = translatedMessages[key.statusColor];
      });
    return this.statusColor;
  }
  createHistoryPayload(): LoadIssueHistoryPayload {
    let locationCode = null;
    if (this.advanceFilter) {
      if (
        !(this.advanceFilter.docNo === '' || this.advanceFilter.docNo === null)
      ) {
        this.docNumber = null;
        this.historySearchControl.reset();
        this.docNumber = this.advanceFilter.docNo;
      }
      if (
        !(
          this.advanceFilter.locationCode === '' ||
          this.advanceFilter.locationCode === null
        )
      ) {
        locationCode = this.advanceFilter.locationCode.toUpperCase();
      } else {
        locationCode = this.advanceFilter.locationCode;
      }
    }
    return {
      actionType: 'ISSUE',
      dateRangeType: 'CUSTOM',
      destDocNo: null,
      destFiscalYear: null,
      endDate: this.advanceFilter.docToDate
        ? this.advanceFilter.docToDate
        : moment(this.bussinessDay).endOf('day').valueOf(),
      locationCode: locationCode,
      srcDocNo: this.docNumber,
      srcFiscalYear: this.advanceFilter ? this.advanceFilter.fiscalYear : null,
      startDate: this.advanceFilter.docFromDate
        ? this.advanceFilter.docFromDate
        : moment(this.bussinessDay).startOf('day').valueOf(),
      statuses: this.advanceFilter.statuses ? this.advanceFilter.statuses : []
    };
  }

  numberCheck($event: KeyboardEvent) {
    const pattern = fieldValidation.numbersField.pattern;
    return pattern.test($event.key);
  }
  loadPermission = (element: string) =>
    this.elementPermission.loadPermission(element, this.permissions$);
  setHistoryRadioButtons(newRequestType: any) {
    switch (newRequestType) {
      case StockIssueAPIRequestTypesEnum.FAC:
      case StockIssueAPIRequestTypesEnum.GEP:
      case StockIssueAPIRequestTypesEnum.TEP_PLAIN:
      case StockIssueAPIRequestTypesEnum.TEP_STUDDED:
      case StockIssueAPIRequestTypesEnum.TEP_GOLD_COIN:
        this.historyForm.patchValue(
          {
            selectRadioButton: StockIssueTypesEnum.FACTORY
          },
          { emitEvent: false }
        );
        break;
      case StockIssueAPIRequestTypesEnum.BTQ:
      case StockIssueAPIRequestTypesEnum.MER:
      case StockIssueAPIRequestTypesEnum.DIRECT_ISSUE:
        this.historyForm.patchValue(
          {
            selectRadioButton: StockIssueTypesEnum.BOUTIQUE
          },
          { emitEvent: false }
        );
        break;
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
