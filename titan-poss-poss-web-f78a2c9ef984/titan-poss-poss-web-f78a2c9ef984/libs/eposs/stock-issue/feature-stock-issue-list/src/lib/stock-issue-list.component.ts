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
  StockIssueHistoryTypes,
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
import { Observable, Subject, combineLatest } from 'rxjs';
import { StockIssueFacade } from '@poss-web/eposs/stock-issue/data-access-stock-issue';
import { Router, ActivatedRoute, NavigationEnd, Event } from '@angular/router';
import { takeUntil, filter, withLatestFrom, take } from 'rxjs/operators';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import {
  getStockIssueTEPGEPRouteUrl,
  getStockIssueRouteUrl,
  getStockIssueHistoryAllowedRouteUrl,
  getStockIssueHistoryTabRouteUrl,
  getInventoryHomeRouteUrl,
  getStockIssueDirectTransferDefaultRouteUrl
} from '@poss-web/shared/util-site-routes';

import { ProfileDataFacade } from '@poss-web/shared/profile/data-access-profile';
import * as moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
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
  selector: 'poss-web-stock-issue-list',
  templateUrl: './stock-issue-list.component.html',
  styleUrls: ['./stock-issue-list.component.scss']
})
export class StockIssueListComponent
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

  @ViewChild('transferTypeDropDown', { read: ElementRef })
  transferTypeDropDown: ElementRef;

  @ViewChild('issueTypeDropdown', { read: ElementRef })
  issueTypeDropdown: ElementRef;

  @ViewChild('tabRef') tabRef: ElementRef;

  transferTypeForm: FormGroup;
  // requestTypeForm: FormGroup;
  historyAPITypeForm: FormGroup;

  searchFormControl = new FormControl();
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
  STOCK_ISSUE_ISSUE_TO_OTHER_BOUTIQUES_CANCEL_TAB =
    'Inventory Stock Issue - Issue to Boutique Cancel Tab';
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
  BTQ_CFA_DROPDOWNLIST_VALUE = 'Inventory Stock Issue - Other Issues List CFA';
  DIRECT_ISSUE_DROPDOWNLIST_VALUE =
    'Inventory Stock Issue - Other Issues List Direct Issue';
  GOLD_COIN_DROPDOWNLIST_VALUE =
    'Inventory Stock Issue - Other Issues List Gold Coin';
  DISPUTE_DEFECTIVE_DROPDOWNLIST_VALUE =
    'Inventory Stock Issue - Other Issues Dispute/Defective';

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
  BTQ_BTQ_IssueCancelPendingSTNCount$: Observable<number>;
  isCancellationAllowed: boolean;

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

    // for other issue types
    this.transferTypeForm = this.formBuilder.group({
      selectedTransferType: ''
    });

    this.historyAPITypeForm = this.formBuilder.group({
      selectedType: ''
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

    // this.appsettingFacade
    //   .getDateFormat()
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe((format: string) => {
    //     this.dateFormat = format;
    //   });

    this.historyAPITypeForm
      .get('selectedType')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(type => {
        // if (this.type !== StockIssueTypesEnum.HISTORY) {
        //   this.changeStockIssueType(type);
        // } else {
        this.stockIssueFacade.resetLoadedHistory();
        this.isHistoryLoadedOnce = false;
        this.changeRequestType(type);
        // }
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

    this.locationSettingsFacade
      .getLocationSetting(
        LocationSettingAttributesEnum.INV_IS_STN_CANCELLATION_ALLOWED
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((isCancellationAllowed: string) => {
        this.isCancellationAllowed =
          isCancellationAllowed === 'true' ? true : false;
        if (this.isCancellationAllowed && this.isL1L2Store) {
          this.stockIssueFacade.LoadIssueSTNCancelCount({
            transferType: StockIssueAPIRequestTypesEnum.BTQ_BTQ
          });
        }
      });
  }

  ngAfterViewInit(): void {
    /**
     * Event Handler for search Box input with debounce
     */
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
    let isTab = false;
    const tabCount = Number(command.name.split('_').pop());
    if (
      (command.name === tab1ShortcutKey ||
        command.name === tab2ShortcutKey ||
        command.name === tab3ShortcutKey ||
        command.name === tab4ShortcutKey) &&
      !isNaN(tabCount) &&
      tabCount <= this.tabRef.nativeElement.children.length
    ) {
      switch (this.tabRef.nativeElement.children[tabCount - 1].id) {
        case 'issueFac': {
          this.changeStockIssueType(StockIssueTypesEnum.FACTORY);
          isTab = true;
          break;
        }
        case 'issueBtq': {
          this.changeStockIssueType(StockIssueTypesEnum.BOUTIQUE);
          isTab = true;
          break;
        }

        case 'issueMer': {
          this.changeStockIssueType(StockIssueTypesEnum.MERCHANDISE);
          isTab = true;
          break;
        }

        case 'issueHis': {
          this.changeStockIssueTypeHistoryTab(StockIssueTypesEnum.HISTORY);
          isTab = true;
          break;
        }
      }
    }

    if (!isTab) {
      if (command.name === primaryDropdownShortcutKeyTS) {
        if (this.issueTypeDropdown) {
          this.issueTypeDropdown.nativeElement.focus();
        }
      } else if (command.name === secondaryDropdownShortcutKeyTD) {
        if (this.transferTypeDropDown) {
          this.transferTypeDropDown.nativeElement.focus();
        }
      } else if (command.name === backShortcutKey) {
        this.back();
      }
      // else if (command.name === tepPlainL3ShortcutKey) {
      //   this.getIssueTEPGEPUrl(this.stockIssueTEPGEPTypesEnumRef.TEP_PLAIN);
      // } else if (command.name === tepStuddedL3ShortcutKey) {
      //   this.getIssueTEPGEPUrl(this.stockIssueTEPGEPTypesEnumRef.TEP_STUDDED);
      // } else if (command.name === gepL3ShortcutKey) {
      //   this.getIssueTEPGEPUrl(this.stockIssueTEPGEPTypesEnumRef.GEP);
      // }
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

    this.isHistoryLoading$ = this.stockIssueFacade.getIsIssueHistoryLoading();

    // let type = this.activatedRoute.snapshot.params['type'];
    const fullUrl = this.router.url;
    if (fullUrl.includes(StockIssueTypesEnum.HISTORY)) {
      this.requestType = this.router.url.split('?')[0].split('/').pop();
      this.requestType = this.requestType.toUpperCase();

      this.setHistoryDropdowns();
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
        const currentUlr = this.router.url;
        if (currentUlr.includes(StockIssueTypesEnum.HISTORY)) {
          this.requestType = this.router.url.split('?')[0].split('/').pop();
          this.requestType = this.requestType.toUpperCase();

          this.setHistoryDropdowns();
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
    if (fullUrl.includes(StockIssueTypesEnum.HISTORY)) {
      this.changeStockIssueType(StockIssueTypesEnum.HISTORY);
    } else {
      this.changeStockIssueType(this.router.url.split('?')[0].split('/').pop());
    }
  }

  getIssues() {
    if (this.isL1L2Store) {
      this.BTQ_BTQ_IssuePendingSTNCount$ = this.stockIssueFacade.getPendingBTQ_BTQ_STNCount();
      this.BTQ_FAC_IssuePendingSTNCount$ = this.stockIssueFacade.getPendingBTQ_FAC_STNCount();
      this.BTQ_MER_IssuePendingSTNCount$ = this.stockIssueFacade.getPendingBTQ_MER_STNCount();
      this.BTQ_BTQ_IssueCancelPendingSTNCount$ = this.stockIssueFacade.getPendingBTQ_BTQ_STNCancelCount();

      this.issueHistoryCount$ = this.stockIssueFacade.getIssueHistoryCount();
      this.historyBoutiqueTypes = [
        {
          value: StockIssueAPIRequestTypesEnum.BTQ,
          translateKey: 'pw.stockReceive.ibtBoutiqueTypeOption',
          elementName: this.HISTORY_DROPDOWN_IBT
        },
        {
          value: StockIssueAPIRequestTypesEnum.MER,
          translateKey: 'pw.stockReceive.merchandiseBoutiqueTypeOption',
          elementName: this.HISTORY_DROPDOWN_MER
        },
        {
          value: StockIssueAPIRequestTypesEnum.DIRECT_ISSUE,
          translateKey: 'DIRECT ISSUE',
          elementName: this.HISTORY_DROPDOWN_DIRECT_ISSUE
        }
      ];
      this.historyFactoryTypes = [
        {
          value: StockIssueAPIRequestTypesEnum.FAC,
          translateKey: 'pw.stockIssue.factoryTypeOption',
          elementName: this.HISTORY_DROPDOWN_FACTORY
        },
        {
          value: StockIssueAPIRequestTypesEnum.TEP_PLAIN,
          translateKey: 'pw.stockIssue.tepPlainText',
          elementName: this.HISTORY_DROPDOWN_TEP_PLAIN
        },
        {
          value: StockIssueAPIRequestTypesEnum.TEP_STUDDED,
          translateKey: 'pw.stockIssue.tepStuddedtext',
          elementName: this.HISTORY_DROPDOWN_TEP_STUDDED
        },
        {
          value: StockIssueAPIRequestTypesEnum.GEP,
          translateKey: 'pw.stockIssue.gepText',
          elementName: this.HISTORY_DROPDOWN_GEP
        },
        {
          value: StockIssueAPIRequestTypesEnum.TEP_GOLD_COIN,
          translateKey: 'pw.stockIssue.GCText',
          elementName: this.HISTORY_DROPDOWN_TEP_GOLD_COIN
        },
        {
          value: StockIssueAPIRequestTypesEnum.BTQ_CFA,
          translateKey: 'BTQ CFA',
          elementName: this.HISTORY_DROPDOWN_BTQ_CFA
        },
        {
          value: StockIssueAPIRequestTypesEnum.DEFECTIVE,
          translateKey: 'pw.stockIssue.defectiveText',
          elementName: this.HISTORY_DROPDOWN_DEFECTIVE
        }
      ];

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

  back() {
    this.router.navigate([getInventoryHomeRouteUrl()]);
  }

  changeStockIssueType(newType: any) {
    this.showNoResultsFoundNaN = false;
    if (this.type !== newType && newType !== StockIssueTypesEnum.HISTORY) {
      this.router.navigate([getStockIssueRouteUrl(newType)], {
        state: { clearFilter: false }
      });
      this.type = newType;
    }
    //  else if (newType === StockIssueTypesEnum.HISTORY) {
    //   this.type = newType;
    //   // if (this.requestType && this.requestType !== '') {
    //   //   if (
    //   //     this.requestType === StockIssueAPIRequestTypesEnum.BTQ ||
    //   //     this.requestType === StockIssueAPIRequestTypesEnum.MER
    //   //   ) {
    //   //     this.historyForm.patchValue(
    //   //       {
    //   //         selectRadioButton: StockIssueTypesEnum.BOUTIQUE
    //   //       },
    //   //       { emitEvent: false }
    //   //     );
    //   //   } else {
    //   //     this.historyForm.patchValue(
    //   //       {
    //   //         selectRadioButton: StockIssueTypesEnum.FACTORY
    //   //       },
    //   //       { emitEvent: false }
    //   //     );
    //   //   }
    //   //   this.historyAPITypeForm.patchValue(
    //   //     {
    //   //       selectedType: this.requestType
    //   //     },
    //   //     { emitEvent: false }
    //   //   );
    //   //   this.changeRequestType(this.requestType);
    //   // } else {

    //   //   this.historyAPITypeForm.patchValue(
    //   //     {
    //   //       selectedType: StockIssueAPIRequestTypesEnum.FAC
    //   //     },
    //   //     { emitEvent: false }
    //   //   );
    //   //   this.changeRequestType(StockIssueAPIRequestTypesEnum.FAC);
    //   // }
    //   this.clearSearch();
    //   this.isHistoryLoadedOnce = false;
    //   this.router.navigate([getStockIssueHistoryAllowedRouteUrl()]);
    //   this.type = StockIssueTypesEnum.HISTORY;
    //   // this.setHistoryRadioButtons();
    //   // this.setHistoryDropdowns();
    //   this.loadStocks(0);
    // }
  }
  changeStockIssueTypeHistoryTab(newType: StockIssueTypesEnum) {
    this.showNoResultsFoundNaN = false;

    if (newType === StockIssueTypesEnum.HISTORY) {
      this.type = newType;
      this.isHistoryLoadedOnce = false;
      this.router.navigate([getStockIssueHistoryAllowedRouteUrl()]);
      this.type = StockIssueTypesEnum.HISTORY;

      // this.loadStocks(0);
    }
  }
  changeRequestType(newType: StockIssueAPIRequestTypesEnum) {
    this.showNoResultsFoundNaN = false;

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
    // this.loadStocks(0);
    // }
    // }
  }

  /**
   * method to call the transfer type
   * @param selectedTransferType : type selected from dropdown
   */
  createStockIssueTransferType() {
    const selectedTransferType = this.transferTypeForm.value
      .selectedTransferType;
    if (selectedTransferType === 'DIRECT_ISSUE') {
      this.directIssue();
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

  directIssue() {
    this.router.navigate([
      getStockIssueRouteUrl(getStockIssueDirectTransferDefaultRouteUrl())
    ]);
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

  getTransferType() {
    // ToDO check retun values

    switch (this.historyAPITypeForm.get('selectedType').value) {
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
      case 'CFA':
        return 'CFA';
      case 'BTQ_CFA':
        return 'BTQ_CFA';
      case 'DIRECT_ISSUE':
        return 'DIRECT_ISSUE';
    }
  }

  numberCheck($event: KeyboardEvent) {
    const pattern = fieldValidation.numbersField.pattern;
    return pattern.test($event.key);
  }
  loadPermission = (element: string) =>
    this.elementPermission.loadPermission(element, this.permissions$);

  setHistoryDropdowns() {
    //     if(this.historyForm.get('selectRadioButton').value===StockIssueTypesEnum.BOUTIQUE){
    //  this.historyAPITypeForm.patchValue(
    //           {
    //             selectedType: this.requestType
    //           },
    //     }else{
    //         this.historyAPITypeForm.patchValue(
    //           {
    //             selectedType: this.requestType
    //           },
    //     }
    this.historyAPITypeForm.patchValue({
      selectedType: this.requestType.replace(/-/gi, '_')
    });
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
