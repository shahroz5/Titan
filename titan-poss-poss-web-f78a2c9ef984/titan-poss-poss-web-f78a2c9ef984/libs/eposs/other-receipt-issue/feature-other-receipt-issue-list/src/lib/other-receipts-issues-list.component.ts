import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy
} from '@angular/core';

import { Observable, fromEvent, Subject, merge } from 'rxjs';
import {
  ActivatedRoute,
  Router
} from '@angular/router';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators
} from '@angular/forms';
import { debounceTime, takeUntil, filter } from 'rxjs/operators';
import {
  OtherReceiptsIssuesEnum,
  TransferType,
  OtherReceiptsModel,
  OtherIssueModel,
  CustomErrors,
  OtherReceiptTransferType,
  OverlayNotificationServiceAbstraction,
  OtherReceiptsIssuesAdvanceFilterPayload,
  LocationSettingAttributesEnum,
  SharedBodEodFeatureServiceAbstraction,
  OverlayNotificationType,
  Command,
  ShortcutServiceAbstraction
} from '@poss-web/shared/models';
import { CardListComponent } from '@poss-web/shared/components/ui-card-list';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { OtherReceiptsFacade } from '@poss-web/eposs/other-receipt/data-access-other-receipt';
import { OtherIssuesFacade } from '@poss-web/eposs/other-issue/data-access-other-issue';
import {
  getInStockHomeRouteUrl,
  getOtherIssueReceiptAdjCreateNewUrl,
  getOtherIssueEXHCreateNewUrl,
  getOtherReceiptsIssuesHistoryListRouteUrl,
  getOtherIssuesDefaultUrl,
  getOtherReceiptsDefaultUrl,
  getOtherIssuesRaisedRequestsSuggestedRoutes,
  getOtherIssuesSuggestedRoutes,
  getOtherReceiptsIssuesSuggestedRoutes,
  getOtherReceiptsSuggestedRoutes,
  getAllOtherIssuesSuggestedRoutes,
  getOtherReceiptsIssuesHistoryDetailsRouteUrl,
  getOtherIssueReceiptsDetailsRouteUrl,
  get404Url
} from '@poss-web/shared/util-site-routes';
import * as moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { OtherReceiptsIssueHistoryAdvancedPopupComponent } from '@poss-web/eposs/other-receipt-issue/ui-other-receipt-issue-history-item-list';
import { commonTranslateKeyMap } from '@poss-web/shared/util-adaptors';
import { TranslateService } from '@ngx-translate/core';
import { fieldValidation } from '@poss-web/shared/util-field-validators';
import { PermissionFacade } from '@poss-web/shared/permission/data-access-permission';
import { PermissionService } from '@poss-web/shared/permission/ui-permission';
import { ElementPermissionService } from '@poss-web/shared/permission/util-element-permissions';
import { LocationSettingsFacade } from '@poss-web/shared/location-settings/data-access-location-settings';
const backShortcutKey = 'OtherReceiptListComponent.BACK';
const searchShortcutKey = 'OtherReceiptListComponent.MAIN_SEARCH';
const cardListShortcutKey = 'OtherReceiptListComponent.CARD_LIST';
const secondaryDropdownShortcutKey =
  'OtherReceiptListComponent.SECONDARY_DROPDOWN';
const primaryDropdownShortcutKey = 'OtherReceiptListComponent.PRIMARY_DROPDOWN';
const filterShortcutKey = 'OtherReceiptListComponent.FILTER';
const componentName = 'OtherReceiptListComponent';
const tab1ShortcutKey = 'Common.TAB_1';
const tab2ShortcutKey = 'Common.TAB_2';
const tab3ShortcutKey = 'Common.TAB_3';
@Component({
  selector: 'poss-web-other-receipts-issues-list',
  templateUrl: './other-receipts-issues-list.component.html',
  styleUrls: ['./other-receipts-issues-list.component.scss']
})
export class OtherReceiptsIssuesListComponent
  implements OnInit, AfterViewInit, OnDestroy {
  type: OtherReceiptsIssuesEnum;
  historyType: OtherReceiptsIssuesEnum;
  transferType: OtherReceiptsIssuesEnum;
  initialPageIndex = 0;
  initalpageSize = 8;
  pageSize = 4;
  getReceiptsIssueUrl: string;
  otherIssuesTabEnumRef = OtherReceiptsIssuesEnum;
  otherReceiptsIssuesEnumRef = OtherReceiptsIssuesEnum;
  hasError$: Observable<string>;
  isLoading$: Observable<boolean>;
  otherReceiptsCount$: Observable<number>;
  otherIssuesCount$: Observable<number>;
  otherReceiptsDropDown: OtherReceiptTransferType[] = [
    {
      type: this.otherIssuesTabEnumRef.EXHIBITION_TYPE,
      count: 0
    },
    {
      type: this.otherIssuesTabEnumRef.LOAN,
      count: 0
    }
  ];
  otherIssueDropDown: OtherReceiptTransferType[] = [
    {
      type: this.otherIssuesTabEnumRef.EXHIBITION_TYPE,
      count: 0
    },
    {
      type: this.otherIssuesTabEnumRef.LOAN,
      count: 0
    },
    {
      type: this.otherIssuesTabEnumRef.LOSS_TYPE,
      count: 0
    },
    {
      type: this.otherIssuesTabEnumRef.ADJUSTMENT_TYPE,
      count: 0
    },
    {
      type: this.otherIssuesTabEnumRef.PSV,
      count: 0
    },
    {
      type: this.otherIssuesTabEnumRef.FOC,
      count: 0
    }
  ];
  otherRecieptsCardCount: number;
  otherIssueCardCountNumber: number;
  dropDownValue: TransferType[] = [];
  otherReceiptsList$: Observable<OtherReceiptsModel[]>;
  otherIssuesList$: Observable<OtherIssueModel[]>;
  isOtherReceiptListLoadedOnce = false;
  isOtherIssueListLoadedOnce = false;
  isOtherReceiptLoanListLoadedOnce = false;
  isOtherIssueLoanListLoadedOnce = false;
  destroy$: Subject<null> = new Subject<null>();
  isLoadingOtherReceiptsSTN$: Observable<boolean>;
  isLoadingOtherIssuesSTN$: Observable<boolean>;
  searchStockResults$: Observable<OtherReceiptsModel[]>;
  searchOtherissueStockResults$: Observable<OtherIssueModel[]>;
  isSearchingStocks$: Observable<boolean>;
  hasSearchStockResults$: Observable<boolean>;
  transferTypeDropDown = new FormControl();
  transferTypeForm: FormGroup;
  totalIssueElementCount$: Observable<number>;
  totalReceiptsElementCount$: Observable<number>;
  searchFormControl = new FormControl();
  otherReceiptsSelectedDropDown: string;
  otherIssuesSelectedDropDown: string;
  hasNotification = false;
  reqType: string;
  dateFormat: string;
  currentFiscalYear: string;
  listType: string;
  noDataFoundMessageForOtherReceipt = '';
  historyOtherIssueTypes: {
    value: OtherReceiptsIssuesEnum;
    translateKey: string;
    elementPermission: string;
  }[] = [];
  historyOtherIssueRaisedRequestsTypes: {
    value: OtherReceiptsIssuesEnum;
    translateKey: string;
    elementPermission: string;
  }[] = [];
  historOtherReceiptsTypes: {
    value: OtherReceiptsIssuesEnum;
    translateKey: string;
    elementPermission: string;
  }[] = [];
  otherIssueHistory$: Observable<OtherIssueModel[]>;
  otherIssueHistoryCount$: Observable<number>;
  isLoadingOtherIssueHistory$: Observable<boolean>;
  otherReceiptsHistory$: Observable<OtherReceiptsModel[]>;
  otherReceiptsHistoryCount$: Observable<number>;
  isLoadingOtherReceiptsHistory$: Observable<boolean>;
  isloaded = false;

  historyForm: FormGroup;
  currentDate = moment();
  historyFormData = null;

  @ViewChild('searchBox', { static: true })
  searchBox: ElementRef;

  @ViewChild('historySearch')
  private historySearch: ElementRef;

  @ViewChild('otherReceiptsCardList')
  otherReceiptsCardList: CardListComponent;

  @ViewChild('otherIssuesCardList')
  otherIssuesCardList: CardListComponent;

  @ViewChild('otherReceiptsHistoryCardList')
  otherReceiptsHistoryCardList: CardListComponent;

  @ViewChild('otherIssuesHistoryCardList')
  otherIssuesHistoryCardList: CardListComponent;

  @ViewChild('historyRequestCardList')
  historyRequestCardList: CardListComponent;

  @ViewChild('otherReceiptIssuesSecondaryDropDown', {
    static: true,
    read: ElementRef
  })
  otherReceiptIssuesSecondaryDropDown: ElementRef;

  @ViewChild('OtherIssuesPrimaryDropDown', {
    read: ElementRef
  })
  OtherIssuesPrimaryDropDown: ElementRef;

  @ViewChild('OtherReceiptPrimaryDropDown', {
    read: ElementRef
  })
  OtherReceiptPrimaryDropDown: ElementRef;

  @ViewChild('tabRef') tabRef: ElementRef;

  @ViewChild('HistoryPrimaryDropDown', {
    read: ElementRef
  })
  HistoryPrimaryDropDown: ElementRef;

  historySearchControl = new FormControl();
  advanceFilter = null;
  docNumber = null;
  otherIssueType = null;

  noDataFoundMessageForOtherissue = '';
  status: string;
  statusColor: string;
  permissions$: Observable<any[]>;
  bussinessDay = null;

  //All Tabs in other issues home.
  OTHER_ISSUES_TAB = 'Other Issues Home - Other Issues Tab';
  OTHER_RECEIPT_TAB = 'Other Issues Home - Other Receipt Tab';
  HISTORY_TAB = 'Other Issues Home - History Tab';
  OTHER_ISSUES_NEW_ISSUES = 'Other Issues Home - Other Issues Tab';
  OTHER_RECEIPT_NEW_ISSUES = 'Other Receipt Home - New Receipt Dropdown';

  //All issues
  EXH = 'Other Issues Home - Issues Exibition';
  LOAN = 'Other Issues Home - Issues Loan';
  ADJ = 'Other Issues Home - Issues Adjustment';
  PSV = 'Other Issues Home - Issues PSV';
  LOSS = 'Other Issues Home - Issues LOSS';
  FOC = 'Other Issues Home - Issues FOC';

  //All new receipt options
  OTHER_RECEIPTS_NEW_ADJUSTMENT =
    'Other Receipt Home -  New Receipts Adjustment';
  OTHER_RECEIPTS_NEW_PSV = 'Other Receipt Home -  New Receipts PSV';

  //All receipt
  OTHER_RECEIPTS_LOAN = 'Other Receipt Home - Receipts Loan';
  OTHER_RECEIPTS_EXHIBTION = 'Other Receipt Home - Receipts Exhibtion';

  //History Radio buttons
  HISTORY_RECEIPTS_RADIO_BUTTON = 'Other Issues Home - Receipts Radio Button';
  HISTORY_ISSUES_RADIO_BUTTON = 'Other Issues Home - Issues Radio Button';

  //History other receipts dropdown
  HISTORY_RECEIPTS_DROPDOWN_ADJUSTMENT =
    'Other Issues Home - History receipts dropdown Adjustment';
  HISTORY_RECEIPTS_DROPDOWN_EXHIBITION =
    'Other Issues Home - History receipts dropdown Exhibition';
  HISTORY_RECEIPTS_DROPDOWN_LOAN =
    'Other Issues Home - History receipts dropdown Loan';
  HISTORY_RECEIPTS_DROPDOWN_PSV =
    'Other Issues Home - History receipts dropdown PSV';

  //Other issues select type dropdown
  HISTORY_ISSUE_SELECT_TYPE_DROPDOWN_ISSUE =
    'Other Issues Home - History Select Type Other Issues';
  HISTORY_ISSUE_SELECT_TYPE_DROPDOWN_RAISED_REQUESTS =
    'Other Issues Home - History Select Type Raised Requests';

  //History other issues dropdown
  HISTORY_ISSUES_DROPDOWN_ADJUSTMENT =
    'Other Issues Home - History issue dropdown Adjustment';
  HISTORY_ISSUES_DROPDOWN_EXHIBITION =
    'Other Issues Home - History issue dropdown Exhibition';
  HISTORY_ISSUES_DROPDOWN_FOC =
    'Other Issues Home - History issue dropdown FOC';
  HISTORY_ISSUES_DROPDOWN_LOAN =
    'Other Issues Home - History issue dropdown Loan';
  HISTORY_ISSUES_DROPDOWN_LOSS =
    'Other Issues Home - History issue dropdown Loss';
  HISTORY_ISSUES_DROPDOWN_PSV =
    'Other Issues Home - History issue dropdown PSV';

  //History Other issues raised requests dropdown
  HISTORY_REQUESTS_DROPDOWN_ADJUSTMENT =
    'Other Issues Home - History request dropdown Adjustment';
  HISTORY_REQUESTS_DROPDOWN_EXHIBITION =
    'Other Issues Home - History request dropdown Exhibition';
  HISTORY_REQUESTS_DROPDOWN_FOC =
    'Other Issues Home - History request dropdown FOC';
  HISTORY_REQUESTS_DROPDOWN_LOAN =
    'Other Issues Home - History request dropdown Loan';
  HISTORY_REQUESTS_DROPDOWN_LOSS =
    'Other Issues Home - History request dropdown Loss';
  HISTORY_REQUESTS_DROPDOWN_PSV =
    'Other Issues Home - History request dropdown PSV';

  constructor(
    private otherIssueFacade: OtherIssuesFacade,
    private otherReceiptsFacade: OtherReceiptsFacade,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private appsettingFacade: AppsettingFacade,
    private shortcutService: ShortcutServiceAbstraction,
    private dialog: MatDialog,
    private translate: TranslateService,
    private permissionfacade: PermissionFacade,
    private elementPermission: ElementPermissionService,
    private permissionService: PermissionService,
    private locationSettingsFacade: LocationSettingsFacade,
    private bodEodFeatureService: SharedBodEodFeatureServiceAbstraction
  ) {
    this.permissions$ = this.permissionfacade.getPermissionforURL();
    this.historyForm = this.formBuilder.group({
      date: new FormControl(this.currentDate, Validators.required),
      selectRadioButton: new FormControl('')
    });

    if (
      this.router.getCurrentNavigation() &&
      this.router.getCurrentNavigation().extras.state &&
      this.router.getCurrentNavigation().extras.state.clearFilter === false
    ) {
      console.log('do not clear');
    } else {
      this.otherIssueFacade.clearAdvancedFilterData(this.bussinessDay);
    }

    this.translate
      .get(['pw.entity.otherIssueEntity'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((entity: any) => {
        this.translate
          .get(['pw.global.noDataFoundMessage'], {
            entityName: entity['pw.entity.otherIssueEntity']
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe((translatedMsg: any) => {
            this.noDataFoundMessageForOtherissue =
              translatedMsg['pw.global.noDataFoundMessage'];
          });
      });

    this.translate
      .get(['pw.entity.otherReceiptEntity'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((entity: any) => {
        this.translate
          .get(['pw.global.noDataFoundMessage'], {
            entityName: entity['pw.entity.otherReceiptEntity']
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe((translatedMsg: any) => {
            this.noDataFoundMessageForOtherReceipt =
              translatedMsg['pw.global.noDataFoundMessage'];
          });
      });
  }

  ngOnInit() {




    this.activatedRoute.params.subscribe(res => {
      if (this.activatedRoute.snapshot.params['listType'] === 'list') {
        this.tabSelectionChange(
          this.activatedRoute.snapshot.params['listType'],
          this.activatedRoute.snapshot.params['tabType']
        );
      }
      if (this.activatedRoute.snapshot.params['listType'] === 'history') {
        this.historyType = this.activatedRoute.snapshot.params['tabType'];
        if (
          this.historyType === OtherReceiptsIssuesEnum.OTHER_ISSUES ||
          this.historyType === OtherReceiptsIssuesEnum.OTHER_ISSUES_REQUESTS
        ) {
          this.historyForm.patchValue(
            {
              selectRadioButton: OtherReceiptsIssuesEnum.OTHER_ISSUES
            },
            {
              emitEvent: false
            }
          );
        } else if (
          this.historyType === OtherReceiptsIssuesEnum.OTHER_RECEIPTS
        ) {
          this.historyForm.patchValue(
            {
              selectRadioButton: OtherReceiptsIssuesEnum.OTHER_RECEIPTS
            }

          );
        }
        this.transferTypeDropDown.patchValue(this.getTransferType(), {
          emitEvent: false
        });
        this.loadHistoryList(0);
      }
    });
    this.bodEodFeatureService
      .getLatestBusinessDate()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.bussinessDay = data;
          this.otherIssueFacade.setAdvancedFilterData({
            docFromDate: this.advanceFilter?.docFromDate
              ? this.advanceFilter?.docFromDate
              : moment(this.bussinessDay).startOf('day').valueOf(),
            docToDate: this.advanceFilter?.docToDate
              ? this.advanceFilter?.docToDate
              : moment(this.bussinessDay).endOf('day').valueOf(),
            status: this.advanceFilter?.status
              ? this.advanceFilter?.status
              : null,
            docNo: this.advanceFilter?.docNo ? this.advanceFilter?.docNo : null,
            fiscalYear: this.advanceFilter?.fiscalYear
              ? this.advanceFilter?.fiscalYear
              : null
          });
          this.loadHistoryList(0);

        }
      });
    this.resetListData();

    merge(this.otherIssueFacade.getError(), this.otherReceiptsFacade.getError())
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
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
      .subscribe((data: any) => {

        this.changeHistoryTabType();
      });
    this.transferTypeDropDown.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        if (this.listType === 'history') {

          this.changeHistoryType(this.transferTypeDropDown.value);

        }
      });

    this.otherIssuesCount$ = this.otherIssueFacade.getOtherIssuesSTNCount();

    this.otherReceiptsCount$ = this.otherReceiptsFacade.getOtherReceiptsSTNCount();
    //
    this.otherIssueHistory$ = this.otherIssueFacade.getOtherIssueHistory();
    this.otherIssueHistoryCount$ = this.otherIssueFacade.getOtherIssueHistoryCount();
    this.isLoadingOtherIssueHistory$ = this.otherIssueFacade.getIsLoadingIssueHistory();
    this.otherReceiptsHistory$ = this.otherReceiptsFacade.getOtherReceiptsHistory();
    this.otherReceiptsHistoryCount$ = this.otherReceiptsFacade.getOtherReceiptsHistoryCount();
    this.isLoadingOtherReceiptsHistory$ = this.otherReceiptsFacade.getIsLoadingReceiptsHistory();
    this.componentInIt();

    this.historyOtherIssueTypes = [
      {
        value: OtherReceiptsIssuesEnum.ADJUSTMENT_TYPE,
        translateKey: 'pw.stockIssue.adjText',
        elementPermission: this.HISTORY_ISSUES_DROPDOWN_ADJUSTMENT
      },
      {
        value: OtherReceiptsIssuesEnum.EXHIBITION_TYPE,
        translateKey: 'pw.stockIssue.exhText',
        elementPermission: this.HISTORY_ISSUES_DROPDOWN_EXHIBITION
      },
      {
        value: OtherReceiptsIssuesEnum.FOC,
        translateKey: 'pw.stockIssue.focText',
        elementPermission: this.HISTORY_ISSUES_DROPDOWN_FOC
      },
      {
        value: OtherReceiptsIssuesEnum.LOAN,
        translateKey: 'pw.stockIssue.loanText',
        elementPermission: this.HISTORY_ISSUES_DROPDOWN_LOAN
      },
      {
        value: OtherReceiptsIssuesEnum.LOSS_TYPE,
        translateKey: 'pw.stockIssue.lossText',
        elementPermission: this.HISTORY_ISSUES_DROPDOWN_LOSS
      },
      {
        value: OtherReceiptsIssuesEnum.PSV,
        translateKey: 'pw.stockIssue.psvText',
        elementPermission: this.HISTORY_ISSUES_DROPDOWN_PSV
      }
    ];
    this.historyOtherIssueRaisedRequestsTypes = [
      {
        value: OtherReceiptsIssuesEnum.ADJUSTMENT_TYPE,
        translateKey: 'pw.stockIssue.adjText',
        elementPermission: this.HISTORY_REQUESTS_DROPDOWN_ADJUSTMENT
      },
      {
        value: OtherReceiptsIssuesEnum.EXHIBITION_TYPE,
        translateKey: 'pw.stockIssue.exhText',
        elementPermission: this.HISTORY_REQUESTS_DROPDOWN_EXHIBITION
      },
      {
        value: OtherReceiptsIssuesEnum.FOC,
        translateKey: 'pw.stockIssue.focText',
        elementPermission: this.HISTORY_REQUESTS_DROPDOWN_FOC
      },
      {
        value: OtherReceiptsIssuesEnum.LOAN,
        translateKey: 'pw.stockIssue.loanText',
        elementPermission: this.HISTORY_REQUESTS_DROPDOWN_LOAN
      },
      {
        value: OtherReceiptsIssuesEnum.LOSS_TYPE,
        translateKey: 'pw.stockIssue.lossText',
        elementPermission: this.HISTORY_REQUESTS_DROPDOWN_LOSS
      },
      {
        value: OtherReceiptsIssuesEnum.PSV,
        translateKey: 'pw.stockIssue.psvText',
        elementPermission: this.HISTORY_REQUESTS_DROPDOWN_PSV
      }
    ];
    this.historOtherReceiptsTypes = [
      {
        value: OtherReceiptsIssuesEnum.ADJUSTMENT_TYPE,
        translateKey: 'pw.stockIssue.adjText',
        elementPermission: this.HISTORY_RECEIPTS_DROPDOWN_ADJUSTMENT
      },
      {
        value: OtherReceiptsIssuesEnum.EXHIBITION_TYPE,
        translateKey: 'pw.stockIssue.exhText',
        elementPermission: this.HISTORY_RECEIPTS_DROPDOWN_EXHIBITION
      },
      {
        value: OtherReceiptsIssuesEnum.LOAN,
        translateKey: 'pw.stockIssue.loanText',
        elementPermission: this.HISTORY_RECEIPTS_DROPDOWN_LOAN
      },
      {
        value: OtherReceiptsIssuesEnum.PSV,
        translateKey: 'pw.stockIssue.psvText',
        elementPermission: this.HISTORY_RECEIPTS_DROPDOWN_PSV
      }
    ];


    this.elementPermission
      .loadPermission(this.OTHER_ISSUES_TAB, this.permissions$)
      .pipe(
        filter(data => !!data.transactionCodes),
        takeUntil(this.destroy$)
      )
      .subscribe(data => {
        const hasRequestPermission = data.transactionCodes.find(key =>
          this.permissionService.hasPermission(key)
        );
        if (hasRequestPermission) {
          this.otherIssueFacade.loadOtherIssuesCount();
        }
      });

    this.elementPermission
      .loadPermission(this.OTHER_RECEIPT_TAB, this.permissions$)
      .pipe(
        filter(data => !!data.transactionCodes),
        takeUntil(this.destroy$)
      )
      .subscribe(data => {
        const hasRequestPermission = data.transactionCodes.find(key =>
          this.permissionService.hasPermission(key)
        );

        if (hasRequestPermission === 'I9' || hasRequestPermission === 'I10') {
          this.otherReceiptsFacade.loadOtherReceiptsCount();
        }
      });
  }

  ngAfterViewInit() {
    fromEvent(this.searchBox.nativeElement, 'input')
      .pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe(() => {
        const searchValue = this.searchFormControl.value;

        if (searchValue !== '') {
          if (this.validateSearch(searchValue)) {
            this.searchStocks(searchValue);
          } else {
            this.otherIssueFacade.searchIssueClear();
            this.otherReceiptsFacade.searchClear();
          }
        } else {
          this.clearSearch();
        }
      });

    fromEvent(this.historySearch.nativeElement, 'input')
      .pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe((event: any) => {
        const docNumber = this.historySearchControl.value;
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
              this.otherIssueFacade.setAdvancedFilterData({
                ...this.advanceFilter,
                docNo: null,
                fiscalYear: null
              });
            }
            this.docNumber = docNumber;

            this.loadHistoryList(0);
          } else {
            this.otherReceiptsFacade.resetOtherReceiptHistory();
            this.otherIssueFacade.resetOtherIssueHistory();
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
        case 'otherIssues': {
          this.tabselected('list', 'otherissues');
          isTab = true;
          break;
        }
        case 'otherReceipts': {
          this.tabselected('list', 'otherreceipts');
          isTab = true;
          break;
        }
        case 'history': {
          this.tabSelectionChange('history', 'otherissues');
          isTab = true;
          break;
        }
      }
    }

    if (!isTab) {
      switch (command.name) {
        case backShortcutKey: {
          this.back();
          break;
        }
        case searchShortcutKey: {
          if (this.listType === 'history') {
            if (this.historySearch && this.historySearch.nativeElement) {
              this.historySearch.nativeElement.focus();
            }
          } else {
            if (this.searchBox && this.searchBox.nativeElement) {
              this.searchBox.nativeElement.focus();
            }
          }
          break;
        }
        case cardListShortcutKey: {
          if (
            this.otherReceiptsCardList &&
            this.listType === OtherReceiptsIssuesEnum.REQUEST_LIST_TYPE &&
            this.type === 'otherreceipts'
          ) {
            this.otherReceiptsCardList.focus();
          }
          if (
            this.otherIssuesCardList &&
            this.listType === OtherReceiptsIssuesEnum.REQUEST_LIST_TYPE &&
            this.type === 'otherissues'
          ) {
            this.otherIssuesCardList.focus();
          }
          if (
            this.otherReceiptsHistoryCardList &&
            this.listType === OtherReceiptsIssuesEnum.HISTORY_LIST_TYPE &&
            this.historyType === 'otherreceipts'
          ) {
            this.otherReceiptsHistoryCardList.focus();
          }
          if (
            this.otherIssuesHistoryCardList &&
            this.listType === OtherReceiptsIssuesEnum.HISTORY_LIST_TYPE &&
            this.historyType === 'otherissues'
          ) {
            this.otherIssuesHistoryCardList.focus();
          }
          if (
            this.historyRequestCardList &&
            this.listType === OtherReceiptsIssuesEnum.HISTORY_LIST_TYPE &&
            this.historyType === 'otherissues-requests'
          ) {
            this.historyRequestCardList.focus();
          }

          break;
        }

        case secondaryDropdownShortcutKey: {
          if (
            (this.type === OtherReceiptsIssuesEnum.OTHER_ISSUES ||
              this.type === OtherReceiptsIssuesEnum.OTHER_RECEIPTS) &&
            this.otherReceiptIssuesSecondaryDropDown &&
            this.otherReceiptIssuesSecondaryDropDown.nativeElement
          ) {
            this.otherReceiptIssuesSecondaryDropDown.nativeElement.focus();
          }
          break;
        }
        case primaryDropdownShortcutKey: {
          if (
            this.listType === 'history' &&
            this.HistoryPrimaryDropDown &&
            this.HistoryPrimaryDropDown.nativeElement
          ) {
            this.HistoryPrimaryDropDown.nativeElement.focus();
          } else {
            if (
              this.type === OtherReceiptsIssuesEnum.OTHER_ISSUES &&
              this.OtherIssuesPrimaryDropDown &&
              this.OtherIssuesPrimaryDropDown.nativeElement
            ) {
              this.OtherIssuesPrimaryDropDown.nativeElement.focus();
            } else if (
              this.type === OtherReceiptsIssuesEnum.OTHER_RECEIPTS &&
              this.OtherReceiptPrimaryDropDown &&
              this.OtherReceiptPrimaryDropDown.nativeElement
            ) {
              this.OtherReceiptPrimaryDropDown.nativeElement.focus();
            }
          }

          break;
        }

        case filterShortcutKey: {
          if (this.listType === 'history') this.openHistoryFilter();
          break;
        }
      }
    }
  }

  componentInIt() {
    this.appsettingFacade
      .getDateFormat()
      .pipe(takeUntil(this.destroy$))
      .subscribe((format: string) => {
        this.dateFormat = format;
      });
    this.listType = this.activatedRoute.snapshot.params['listType'];
    this.reqType = this.activatedRoute.snapshot.params['type'];
    this.shortcutService.componentNames = [componentName];
    this.shortcutService.commands
      .pipe(takeUntil(this.destroy$))
      .subscribe(command => this.shortcutEventHandler(command));
    this.otherIssueFacade
      .getAdvancedFilterData()
      .pipe(takeUntil(this.destroy$))
      .subscribe((filterData: OtherReceiptsIssuesAdvanceFilterPayload) => {
        this.advanceFilter = filterData;
      });
  }
  listInit(newType: OtherReceiptsIssuesEnum.OTHER_ISSUES = null) {
    let type = newType
      ? newType
      : this.activatedRoute.snapshot.params['tabType'];
    if (this.reqType === OtherReceiptsIssuesEnum.EXHIBITION) {
      if (type === OtherReceiptsIssuesEnum.OTHER_ISSUES) {
        this.otherIssueFacade.setSelectedDropDownForIssues(
          OtherReceiptsIssuesEnum.EXHIBITION_TYPE
        );
      } else if (type === OtherReceiptsIssuesEnum.OTHER_RECEIPTS) {
        this.otherReceiptsFacade.setSelectedDropDownForReceipts(
          OtherReceiptsIssuesEnum.EXHIBITION_TYPE
        );
      }
    } else if (this.reqType === OtherReceiptsIssuesEnum.LOAN_TYPE) {
      if (type === OtherReceiptsIssuesEnum.OTHER_ISSUES) {
        this.otherIssueFacade.setSelectedDropDownForIssues(
          OtherReceiptsIssuesEnum.LOAN
        );
      } else if (type === OtherReceiptsIssuesEnum.OTHER_RECEIPTS) {
        this.otherReceiptsFacade.setSelectedDropDownForReceipts(
          OtherReceiptsIssuesEnum.LOAN
        );
      }
    } else if (this.reqType === OtherReceiptsIssuesEnum.ADJUSTMENT) {
      this.otherIssueFacade.setSelectedDropDownForIssues(
        OtherReceiptsIssuesEnum.ADJUSTMENT_TYPE
      );
    } else if (this.reqType === OtherReceiptsIssuesEnum.PSV) {
      this.otherIssueFacade.setSelectedDropDownForIssues(
        OtherReceiptsIssuesEnum.PSV
      );
    } else if (this.reqType === OtherReceiptsIssuesEnum.LOSS) {
      if (type === OtherReceiptsIssuesEnum.OTHER_ISSUES) {
        this.otherIssueFacade.setSelectedDropDownForIssues(
          OtherReceiptsIssuesEnum.LOSS_TYPE
        );
      } else if (type === OtherReceiptsIssuesEnum.OTHER_RECEIPTS) {
        this.otherReceiptsFacade.setSelectedDropDownForReceipts(
          OtherReceiptsIssuesEnum.LOSS_TYPE
        );
      }
    } else if (this.reqType === OtherReceiptsIssuesEnum.FOC) {
      this.otherIssueFacade.setSelectedDropDownForIssues(
        OtherReceiptsIssuesEnum.FOC
      );
    }
    this.totalReceiptsElementCount$ = this.otherReceiptsFacade.getTotalReceiptsElementCount();
    if (type === OtherReceiptsIssuesEnum.OTHER_RECEIPTS) {
      this.hasError$ = this.otherReceiptsFacade.getHasError();
      this.isSearchingStocks$ = this.otherReceiptsFacade.getIsSearchingStocks();
      this.hasSearchStockResults$ = this.otherReceiptsFacade.getHasSearchStockResults();
    } else if (type === OtherReceiptsIssuesEnum.OTHER_ISSUES) {
      this.hasError$ = this.otherIssueFacade.getHasError();
      this.isSearchingStocks$ = this.otherIssueFacade.getIsSearchingStocks();
      this.hasSearchStockResults$ = this.otherIssueFacade.getHasSearchStockResults();
    }

    this.isLoadingOtherReceiptsSTN$ = this.otherReceiptsFacade.getIsLoadingOtherReceiptSTN();
    this.isLoadingOtherIssuesSTN$ = this.otherIssueFacade.getIsLoadingOtherIssuesSTN();

    this.searchStockResults$ = this.otherReceiptsFacade.getSearchStockResults();
    this.searchOtherissueStockResults$ = this.otherIssueFacade.getOtherIssueSearchStockResults();

    this.otherReceiptsFacade.getSelectedDropDownvalue().subscribe(result => {
      this.otherReceiptsSelectedDropDown = this.getTransferType();
    });

    if (
      this.otherReceiptsSelectedDropDown ===
      OtherReceiptsIssuesEnum.EXHIBITION_TYPE
    ) {
      this.transferType = OtherReceiptsIssuesEnum.EXHIBITION;
    } else if (
      this.otherReceiptsSelectedDropDown === OtherReceiptsIssuesEnum.LOAN
    ) {
      this.transferType = OtherReceiptsIssuesEnum.LOAN_TYPE;
    } else if (
      this.otherReceiptsSelectedDropDown ===
      OtherReceiptsIssuesEnum.ADJUSTMENT_TYPE
    ) {
      this.transferType = OtherReceiptsIssuesEnum.ADJUSTMENT;
    } else if (
      this.otherReceiptsSelectedDropDown === OtherReceiptsIssuesEnum.LOSS_TYPE
    ) {
      this.transferType = OtherReceiptsIssuesEnum.LOSS;
    } else if (
      this.otherReceiptsSelectedDropDown === OtherReceiptsIssuesEnum.PSV
    ) {
      this.transferType = OtherReceiptsIssuesEnum.PSV;
    } else if (
      this.otherReceiptsSelectedDropDown === OtherReceiptsIssuesEnum.FOC
    ) {
      this.transferType = OtherReceiptsIssuesEnum.FOC;
    }

    if (this.transferType === OtherReceiptsIssuesEnum.EXHIBITION) {
      this.transferTypeDropDown.patchValue(this.otherReceiptsSelectedDropDown);
    } else if (this.transferType === OtherReceiptsIssuesEnum.LOAN_TYPE) {
      this.transferTypeDropDown.patchValue(OtherReceiptsIssuesEnum.LOAN);
    } else if (this.transferType === OtherReceiptsIssuesEnum.ADJUSTMENT) {
      this.transferTypeDropDown.patchValue(this.otherReceiptsSelectedDropDown);
    } else if (this.transferType === OtherReceiptsIssuesEnum.LOSS) {
      this.transferTypeDropDown.patchValue(this.otherReceiptsSelectedDropDown);
    } else if (this.transferType === OtherReceiptsIssuesEnum.PSV) {
      this.transferTypeDropDown.patchValue(this.otherReceiptsSelectedDropDown);
    } else if (this.transferType === OtherReceiptsIssuesEnum.FOC) {
      this.transferTypeDropDown.patchValue(this.otherReceiptsSelectedDropDown);
    }
    if (
      !type ||
      !(
        type === OtherReceiptsIssuesEnum.OTHER_RECEIPTS ||
        type === OtherReceiptsIssuesEnum.OTHER_ISSUES
      )
    ) {
      type = OtherReceiptsIssuesEnum.OTHER_RECEIPTS;
      this.router.navigate([get404Url()]);
    }
    this.getStockList();
    this.onTabSelection(type);
  }

  onTabSelection(tabSelection: OtherReceiptsIssuesEnum) {


    this.clearSearch();
    let changeTransferType: OtherReceiptsIssuesEnum;

    if (
      this.listType === 'list' &&
      this.type !== tabSelection &&
      tabSelection === OtherReceiptsIssuesEnum.OTHER_RECEIPTS
    ) {


      this.transferTypeDropDown.patchValue(this.otherReceiptsSelectedDropDown);
      if (
        this.otherReceiptsSelectedDropDown ===
        OtherReceiptsIssuesEnum.EXHIBITION_TYPE
      ) {
        changeTransferType = OtherReceiptsIssuesEnum.EXHIBITION;
        this.transferType = OtherReceiptsIssuesEnum.EXHIBITION;
      } else if (
        this.otherReceiptsSelectedDropDown === OtherReceiptsIssuesEnum.LOAN
      ) {
        changeTransferType = OtherReceiptsIssuesEnum.LOAN_TYPE;
        this.transferType = OtherReceiptsIssuesEnum.LOAN_TYPE;
      } else if (
        this.otherReceiptsSelectedDropDown ===
        OtherReceiptsIssuesEnum.ADJUSTMENT_TYPE
      ) {
        changeTransferType = OtherReceiptsIssuesEnum.ADJUSTMENT;
        this.transferType = OtherReceiptsIssuesEnum.ADJUSTMENT;
      } else if (
        this.otherReceiptsSelectedDropDown === OtherReceiptsIssuesEnum.LOSS_TYPE
      ) {
        changeTransferType = OtherReceiptsIssuesEnum.LOSS;
        this.transferType = OtherReceiptsIssuesEnum.LOSS;
      } else if (
        this.otherReceiptsSelectedDropDown === OtherReceiptsIssuesEnum.PSV
      ) {
        changeTransferType = OtherReceiptsIssuesEnum.PSV;
        this.transferType = OtherReceiptsIssuesEnum.PSV;
      }

      if (this.transferType === OtherReceiptsIssuesEnum.EXHIBITION) {
        this.otherReceiptsList$ = this.otherReceiptsFacade.getOtherReceiptList();
        this.otherReceiptsList$
          .pipe(takeUntil(this.destroy$))
          .subscribe((stocks: OtherReceiptsModel[]) => {
            if (
              stocks &&
              stocks.length !== 0 &&
              !this.isOtherReceiptListLoadedOnce
            ) {
              this.isOtherReceiptListLoadedOnce = true;
            }
          });
      }

      if (this.transferType === OtherReceiptsIssuesEnum.LOAN_TYPE) {
        this.otherReceiptsList$ = this.otherReceiptsFacade.getOtherReceiptLoanList();
        this.otherReceiptsList$
          .pipe(takeUntil(this.destroy$))
          .subscribe((stocks: OtherReceiptsModel[]) => {
            if (
              stocks &&
              stocks.length !== 0 &&
              !this.isOtherReceiptLoanListLoadedOnce
            ) {
              this.isOtherReceiptLoanListLoadedOnce = true;
            }
          });
      }


      this.type = tabSelection;

      if (
        tabSelection === OtherReceiptsIssuesEnum.OTHER_RECEIPTS &&
        (changeTransferType === OtherReceiptsIssuesEnum.EXHIBITION ||
          changeTransferType === OtherReceiptsIssuesEnum.LOAN_TYPE)
      ) {
        this.transferType = this.activatedRoute.snapshot.params['type'];
        this.transferTypeDropDown.patchValue(this.getTransferType());
        this.loadStockList(0);
      }
    }

    if (
      this.listType === 'list' &&
      this.type !== tabSelection &&
      tabSelection === OtherReceiptsIssuesEnum.OTHER_ISSUES
    ) {
      this.otherIssueFacade
        .getSelectedIssueDropDownValue()
        .pipe(takeUntil(this.destroy$))
        .subscribe(result => {
          this.otherIssuesSelectedDropDown = result;
        });

      this.transferTypeDropDown.patchValue(this.otherIssuesSelectedDropDown);
      if (
        this.otherIssuesSelectedDropDown ===
        OtherReceiptsIssuesEnum.EXHIBITION_TYPE
      ) {
        changeTransferType = OtherReceiptsIssuesEnum.EXHIBITION;
        this.transferType = OtherReceiptsIssuesEnum.EXHIBITION;
      } else if (
        this.otherIssuesSelectedDropDown === OtherReceiptsIssuesEnum.LOAN
      ) {
        changeTransferType = OtherReceiptsIssuesEnum.LOAN_TYPE;
        this.transferType = OtherReceiptsIssuesEnum.LOAN_TYPE;
      } else if (
        this.otherIssuesSelectedDropDown ===
        OtherReceiptsIssuesEnum.ADJUSTMENT_TYPE
      ) {
        changeTransferType = OtherReceiptsIssuesEnum.ADJUSTMENT;
        this.transferType = OtherReceiptsIssuesEnum.ADJUSTMENT;
      } else if (
        this.otherIssuesSelectedDropDown === OtherReceiptsIssuesEnum.LOSS_TYPE
      ) {
        changeTransferType = OtherReceiptsIssuesEnum.LOSS;
        this.transferType = OtherReceiptsIssuesEnum.LOSS;
      } else if (
        this.otherIssuesSelectedDropDown === OtherReceiptsIssuesEnum.PSV
      ) {
        changeTransferType = OtherReceiptsIssuesEnum.PSV;
        this.transferType = OtherReceiptsIssuesEnum.PSV;
      } else if (
        this.otherIssuesSelectedDropDown === OtherReceiptsIssuesEnum.FOC
      ) {
        changeTransferType = OtherReceiptsIssuesEnum.FOC;
        this.transferType = OtherReceiptsIssuesEnum.FOC;
      }


      this.type = tabSelection;

      if (tabSelection === OtherReceiptsIssuesEnum.OTHER_ISSUES) {
        this.transferType = this.activatedRoute.snapshot.params['type'];
        this.transferTypeDropDown.patchValue(this.getTransferType());
        this.loadStockList(0);
      }
    }
  }

  getStockList() {


    this.otherIssuesCount$ = this.otherIssueFacade.getOtherIssuesSTNCount();



    this.otherReceiptsCount$ = this.otherReceiptsFacade.getOtherReceiptsSTNCount();

  }

  loadStockList(pageIndex) {
    let type: string;
    if (this.type === OtherReceiptsIssuesEnum.OTHER_RECEIPTS) {
      if (this.transferType === OtherReceiptsIssuesEnum.EXHIBITION) {
        type = 'EXH';
        this.otherReceiptsFacade.loadReceiptList({
          type: type,
          pageIndex: pageIndex,
          pageSize:
            pageIndex === this.initialPageIndex
              ? this.initalpageSize
              : this.pageSize
        });
      } else if (this.transferType === OtherReceiptsIssuesEnum.LOAN_TYPE) {
        type = 'LOAN';
        this.otherReceiptsFacade.loadReceiptLoanList({
          type: type,
          pageIndex: pageIndex,
          pageSize:
            pageIndex === this.initialPageIndex
              ? this.initalpageSize
              : this.pageSize
        });
      }
    } else if (this.type === OtherReceiptsIssuesEnum.OTHER_ISSUES) {
      if (this.transferType === OtherReceiptsIssuesEnum.EXHIBITION) {
        type = 'EXH';
        this.otherIssueFacade.loadIssueList({
          type: type,
          pageIndex: pageIndex,
          pageSize:
            pageIndex === this.initialPageIndex
              ? this.initalpageSize
              : this.pageSize
        });
        this.totalIssueElementCount$ = this.otherIssueFacade.getTotalIssueElementCount();
        this.otherIssuesList$ = this.otherIssueFacade.getOtherIssueList();
      } else if (this.transferType === OtherReceiptsIssuesEnum.LOAN_TYPE) {
        type = 'LOAN';
        this.otherIssueFacade.loadIssueLoanList({
          type: type,
          pageIndex: pageIndex,
          pageSize:
            pageIndex === this.initialPageIndex
              ? this.initalpageSize
              : this.pageSize
        });
        this.totalIssueElementCount$ = this.otherIssueFacade.getTotalIssueElementCount();
        this.otherIssuesList$ = this.otherIssueFacade.getOtherIssueLoanList();
      } else if (this.transferType === OtherReceiptsIssuesEnum.ADJUSTMENT) {
        type = OtherReceiptsIssuesEnum.ADJUSTMENT_TYPE;
        this.otherIssueFacade.loadIssueADJList({
          type: type,
          pageIndex: pageIndex,
          pageSize:
            pageIndex === this.initialPageIndex
              ? this.initalpageSize
              : this.pageSize
        });
        this.totalIssueElementCount$ = this.otherIssueFacade.getTotalIssueElementCount();
        this.otherIssuesList$ = this.otherIssueFacade.getOtherIssueADJList();
      } else if (this.transferType === OtherReceiptsIssuesEnum.LOSS) {
        type = OtherReceiptsIssuesEnum.LOSS_TYPE;
        this.otherIssueFacade.loadIssueLossList({
          type: type,
          pageIndex: pageIndex,
          pageSize:
            pageIndex === this.initialPageIndex
              ? this.initalpageSize
              : this.pageSize
        });
        this.totalIssueElementCount$ = this.otherIssueFacade.getTotalIssueElementCount();
        this.otherIssuesList$ = this.otherIssueFacade.getOtherIssueLossList();
      } else if (this.transferType === OtherReceiptsIssuesEnum.PSV) {
        type = OtherReceiptsIssuesEnum.PSV;
        this.otherIssueFacade.loadIssuePSVList({
          type: type,
          pageIndex: pageIndex,
          pageSize:
            pageIndex === this.initialPageIndex
              ? this.initalpageSize
              : this.pageSize
        });
        this.totalIssueElementCount$ = this.otherIssueFacade.getTotalIssueElementCount();
        this.otherIssuesList$ = this.otherIssueFacade.getOtherIssuePSVList();
      } else if (this.transferType === OtherReceiptsIssuesEnum.FOC) {
        type = OtherReceiptsIssuesEnum.FOC;
        this.otherIssueFacade.loadIssueFOCList({
          type: type,
          pageIndex: pageIndex,
          pageSize:
            pageIndex === this.initialPageIndex
              ? this.initalpageSize
              : this.pageSize
        });
        this.totalIssueElementCount$ = this.otherIssueFacade.getTotalIssueElementCount();
        this.otherIssuesList$ = this.otherIssueFacade.getOtherIssueFOCList();
      }
    }
  }

  searchStocks(srcDocnumber: number) {
    let type: string;
    if (this.type === OtherReceiptsIssuesEnum.OTHER_RECEIPTS) {
      if (this.transferType === OtherReceiptsIssuesEnum.EXHIBITION) {
        type = 'EXH';
      } else if (this.transferType === OtherReceiptsIssuesEnum.LOAN_TYPE) {
        type = 'LOAN';
      } else if (this.transferType === OtherReceiptsIssuesEnum.ADJUSTMENT) {
        type = 'ADJ';
      }
      this.otherReceiptsFacade.searchPendingReceiptsStocks({
        srcDocnumber: srcDocnumber,
        type: type
      });
      this.hasSearchStockResults$ = this.otherReceiptsFacade.getHasSearchStockResults();
      this.isSearchingStocks$ = this.otherReceiptsFacade.getIsSearchingStocks();
    } else if (this.type === OtherReceiptsIssuesEnum.OTHER_ISSUES) {
      if (this.transferType === OtherReceiptsIssuesEnum.EXHIBITION) {
        type = OtherReceiptsIssuesEnum.EXHIBITION_TYPE;
      } else if (this.transferType === OtherReceiptsIssuesEnum.LOAN_TYPE) {
        type = OtherReceiptsIssuesEnum.LOAN;
      } else if (this.transferType === OtherReceiptsIssuesEnum.ADJUSTMENT) {
        type = OtherReceiptsIssuesEnum.ADJUSTMENT_TYPE;
      } else if (this.transferType === OtherReceiptsIssuesEnum.LOSS) {
        type = OtherReceiptsIssuesEnum.LOSS_TYPE;
      } else if (this.transferType === OtherReceiptsIssuesEnum.PSV) {
        type = OtherReceiptsIssuesEnum.PSV;
      } else if (this.transferType === OtherReceiptsIssuesEnum.FOC) {
        type = OtherReceiptsIssuesEnum.FOC;
      }
      this.otherIssueFacade.searchPendingIssuesStocks({
        srcDocnumber: srcDocnumber,
        type: type
      });
      this.hasSearchStockResults$ = this.otherIssueFacade.getHasSearchStockResults();
      this.isSearchingStocks$ = this.otherReceiptsFacade.getIsSearchingStocks();
    }
  }

  onReceiptCardSelected(stock: OtherReceiptsModel) {
    if (
      this.type === OtherReceiptsIssuesEnum.OTHER_RECEIPTS &&
      (this.transferType === OtherReceiptsIssuesEnum.EXHIBITION ||
        this.transferType === OtherReceiptsIssuesEnum.LOAN_TYPE)
    ) {
      this.router.navigate(
        ['../../../', this.type, this.transferType, stock.id, 'nonverified'],
        {
          relativeTo: this.activatedRoute
        }
      );
    }
  }

  onIssueCardSelected(stock: OtherIssueModel) {
    if (
      this.type === OtherReceiptsIssuesEnum.OTHER_ISSUES &&
      (this.transferType === OtherReceiptsIssuesEnum.EXHIBITION ||
        this.transferType === OtherReceiptsIssuesEnum.LOAN_TYPE ||
        this.transferType === OtherReceiptsIssuesEnum.ADJUSTMENT ||
        this.transferType === OtherReceiptsIssuesEnum.LOSS ||
        this.transferType === OtherReceiptsIssuesEnum.PSV ||
        this.transferType === OtherReceiptsIssuesEnum.FOC)
    ) {
      if (stock.status === OtherReceiptsIssuesEnum.APVL_PENDING_STATUS) {
        this.router.navigate([
          getOtherIssueReceiptsDetailsRouteUrl(
            this.type,
            this.transferType,
            stock.reqDocNo
          )
        ]);
      }
      if (stock.status === OtherReceiptsIssuesEnum.APPROVED_STATUS) {
        this.router.navigate([
          getOtherIssueReceiptsDetailsRouteUrl(
            this.type,
            this.transferType,
            stock.reqDocNo
          )
        ]);
      }
    }
  }

  clearSearch() {
    this.searchFormControl.reset();
    this.otherReceiptsFacade.searchClear();
    this.otherIssueFacade.searchIssueClear();
  }

  /**
   * To add class for color based on status sent
   * @param status: status of the request
   */
  getStatusColor(status: string) {
    switch (status) {
      case 'REQUESTED':
      case 'ACPT_REJECTED':
      case 'APRVL_PENDING':
      case 'APRVL_REJECTED':
      case 'CANCELLED':
      case 'EXPIRED':
      case 'REJECTED':
        return false;

      case 'ACCEPTED':
      case 'APPROVED':
        return true;
    }
  }

  onFilterSelect(data: string) {
    this.clearSearch();
    let tabValue: OtherReceiptsIssuesEnum;
    if (data === OtherReceiptsIssuesEnum.EXHIBITION_TYPE) {
      tabValue = OtherReceiptsIssuesEnum.EXHIBITION;
    } else if (data === OtherReceiptsIssuesEnum.LOAN) {
      tabValue = OtherReceiptsIssuesEnum.LOAN_TYPE;
    } else if (data === OtherReceiptsIssuesEnum.ADJUSTMENT_TYPE) {
      tabValue = OtherReceiptsIssuesEnum.ADJUSTMENT;
    } else if (data === OtherReceiptsIssuesEnum.LOSS_TYPE) {
      tabValue = OtherReceiptsIssuesEnum.LOSS;
    } else if (data === OtherReceiptsIssuesEnum.PSV) {
      tabValue = OtherReceiptsIssuesEnum.PSV;
    } else if (data === OtherReceiptsIssuesEnum.FOC) {
      tabValue = OtherReceiptsIssuesEnum.FOC;
    }
    this.transferType = tabValue;
    this.router.navigate(['../', tabValue], {
      relativeTo: this.activatedRoute
    });
    if (
      this.transferType === OtherReceiptsIssuesEnum.LOAN_TYPE ||
      this.transferType === OtherReceiptsIssuesEnum.EXHIBITION ||
      this.transferType === OtherReceiptsIssuesEnum.ADJUSTMENT ||
      this.transferType === OtherReceiptsIssuesEnum.LOSS ||
      this.transferType === OtherReceiptsIssuesEnum.PSV ||
      this.transferType === OtherReceiptsIssuesEnum.FOC
    ) {
      this.loadStockList(0);
    }
    if (this.type === OtherReceiptsIssuesEnum.OTHER_RECEIPTS) {
      this.otherReceiptsFacade.setSelectedDropDownForReceipts(data);
      if (this.transferType === OtherReceiptsIssuesEnum.LOAN_TYPE) {
        this.otherReceiptsList$ = this.otherReceiptsFacade.getOtherReceiptLoanList();
      } else if (this.transferType === OtherReceiptsIssuesEnum.EXHIBITION) {
        this.otherReceiptsList$ = this.otherReceiptsFacade.getOtherReceiptList();
      } else if (this.transferType === OtherReceiptsIssuesEnum.ADJUSTMENT) {
        this.otherReceiptsList$ = this.otherReceiptsFacade.getReceiptADJList();
      }
      if (this.otherReceiptsCardList) {
        this.otherReceiptsCardList.resetFocus();
      }
    } else if (this.type === OtherReceiptsIssuesEnum.OTHER_ISSUES) {
      this.otherIssueFacade.setSelectedDropDownForIssues(data);
      if (this.transferType === OtherReceiptsIssuesEnum.LOAN_TYPE) {
        this.otherIssuesList$ = this.otherIssueFacade.getOtherIssueLoanList();
      } else if (this.transferType === OtherReceiptsIssuesEnum.EXHIBITION) {
        this.otherIssuesList$ = this.otherIssueFacade.getOtherIssueList();
      } else if (this.transferType === OtherReceiptsIssuesEnum.ADJUSTMENT) {
        this.otherIssuesList$ = this.otherIssueFacade.getOtherIssueADJList();
      } else if (this.transferType === OtherReceiptsIssuesEnum.LOSS) {
        this.otherIssuesList$ = this.otherIssueFacade.getOtherIssueLossList();
      } else if (this.transferType === OtherReceiptsIssuesEnum.PSV) {
        this.otherIssuesList$ = this.otherIssueFacade.getOtherIssuePSVList();
      } else if (this.transferType === OtherReceiptsIssuesEnum.FOC) {
        this.otherIssuesList$ = this.otherIssueFacade.getOtherIssueFOCList();
      }
      if (this.otherIssuesCardList) {
        this.otherIssuesCardList.resetFocus();
      }
    }
  }

  createNewOtherIssue(event: string) {
    if (
      event === OtherReceiptsIssuesEnum.EXHIBITION ||
      event === OtherReceiptsIssuesEnum.LOAN_TYPE ||
      event === OtherReceiptsIssuesEnum.LOSS
    ) {
      this.router.navigateByUrl(getOtherIssueEXHCreateNewUrl(this.type, event));
    } else if (
      event === OtherReceiptsIssuesEnum.ADJUSTMENT ||
      event === OtherReceiptsIssuesEnum.PSV ||
      event === OtherReceiptsIssuesEnum.FOC
    ) {
      this.router.navigateByUrl(
        getOtherIssueReceiptAdjCreateNewUrl(this.type, event)
      );
    }
  }
  createNewOtherReceipts(event: string) {
    if (
      event === OtherReceiptsIssuesEnum.ADJUSTMENT ||
      event === OtherReceiptsIssuesEnum.PSV
    ) {
      this.router.navigateByUrl(
        getOtherIssueReceiptAdjCreateNewUrl(this.type, event)
      );
    }
  }
  resetListData() {
    this.isOtherReceiptListLoadedOnce = false;
    this.otherIssueFacade.resetOtherIssueListData();
    this.otherReceiptsFacade.resetOtherReceiptListData();
  }
  errorHandler(error: CustomErrors) {
    this.overlayNotification
      .show({
        type: OverlayNotificationType.ERROR,
        hasClose: true,
        error: error
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe();
  }
  back() {
    this.router.navigate([getInStockHomeRouteUrl()]);
  }

  // HISTORY
  onHistoryTabSelection() {
    this.router.navigate([getOtherReceiptsIssuesSuggestedRoutes()]);
  }

  changeHistoryTabType() {
    const historyTab = this.historyForm.get('selectRadioButton').value;

    if (this.historyType !== historyTab) {

      if (
        historyTab === OtherReceiptsIssuesEnum.OTHER_ISSUES ||
        historyTab === OtherReceiptsIssuesEnum.OTHER_ISSUES_REQUESTS
      ) {
        this.router.navigate([getAllOtherIssuesSuggestedRoutes()]);
      } else if (historyTab === OtherReceiptsIssuesEnum.OTHER_RECEIPTS) {
        this.router.navigate([getOtherReceiptsSuggestedRoutes()]);
      }
      this.historyType = historyTab;

    }
  }
  changeHistoryType(value: any) {
    this.router
      .navigate([
        getOtherReceiptsIssuesHistoryListRouteUrl(
          this.historyType,
          this.getTransferTypeValue(value)
        )
      ])
      .then(() => {
        // this.loadHistoryList(0);
      });
  }
  getTransferType(): OtherReceiptsIssuesEnum {
    switch (this.activatedRoute.snapshot.params['type']) {
      case OtherReceiptsIssuesEnum.EXHIBITION:
        return OtherReceiptsIssuesEnum.EXHIBITION_TYPE;
      case OtherReceiptsIssuesEnum.LOAN_TYPE:
        return OtherReceiptsIssuesEnum.LOAN;
      case OtherReceiptsIssuesEnum.ADJUSTMENT:
        return OtherReceiptsIssuesEnum.ADJUSTMENT_TYPE;
      case OtherReceiptsIssuesEnum.LOSS:
        return OtherReceiptsIssuesEnum.LOSS_TYPE;
      case OtherReceiptsIssuesEnum.PSV:
        return OtherReceiptsIssuesEnum.PSV;
      case OtherReceiptsIssuesEnum.FOC:
        return OtherReceiptsIssuesEnum.FOC;
    }
  }
  getTransferTypeValue(value: any): OtherReceiptsIssuesEnum {
    switch (value) {
      case OtherReceiptsIssuesEnum.EXHIBITION_TYPE:
        return OtherReceiptsIssuesEnum.EXHIBITION;
      case OtherReceiptsIssuesEnum.LOAN:
        return OtherReceiptsIssuesEnum.LOAN_TYPE;
      case OtherReceiptsIssuesEnum.ADJUSTMENT_TYPE:
        return OtherReceiptsIssuesEnum.ADJUSTMENT;
      case OtherReceiptsIssuesEnum.LOSS_TYPE:
        return OtherReceiptsIssuesEnum.LOSS;
      case OtherReceiptsIssuesEnum.PSV:
        return OtherReceiptsIssuesEnum.PSV;
      case OtherReceiptsIssuesEnum.FOC:
        return OtherReceiptsIssuesEnum.FOC;
    }
  }
  getDynamicValueForIssuesACL(value) {
    switch (value) {
      case OtherReceiptsIssuesEnum.EXHIBITION_TYPE:
        return this.EXH;
      case OtherReceiptsIssuesEnum.LOAN:
        return this.LOAN;
      case OtherReceiptsIssuesEnum.ADJUSTMENT_TYPE:
        return this.ADJ;
      case OtherReceiptsIssuesEnum.LOSS_TYPE:
        return this.LOSS;
      case OtherReceiptsIssuesEnum.PSV:
        return this.PSV;
      case OtherReceiptsIssuesEnum.FOC:
        return this.FOC;
    }
  }

  getDynamicValueForReceiptsACL(value) {
    switch (value) {
      case OtherReceiptsIssuesEnum.EXHIBITION_TYPE:
        return this.OTHER_RECEIPTS_EXHIBTION;
      case OtherReceiptsIssuesEnum.LOAN:
        return this.OTHER_RECEIPTS_LOAN;
    }
  }
  loadHistoryList(pageIndex) {
    if (pageIndex === 0) {
      this.otherIssueFacade.resetOtherIssueHistory();
      this.otherReceiptsFacade.resetOtherReceiptHistory();
    }
    this.reqType = this.activatedRoute.snapshot.params['type'];
    if (this.advanceFilter) {
      if (
        !(this.advanceFilter.docNo === '' || this.advanceFilter.docNo === null)
      ) {
        this.docNumber = null;
        this.historySearchControl.reset();
        this.docNumber = this.advanceFilter.docNo;
      }
    }
    if (this.historyType === OtherReceiptsIssuesEnum.OTHER_RECEIPTS) {
      this.otherReceiptsFacade.loadOtherReceiptsHistory({
        page: pageIndex,
        size: pageIndex === 0 ? 8 : 4,
        sort: 'receivedDocNo,asc',
        payload: {
          actionType: 'RECEIVE',
          dateRangeType: 'CUSTOM',
          endDate: this.advanceFilter?.docToDate
            ? this.advanceFilter.docToDate
            : moment(this.bussinessDay).endOf('day').valueOf(),
          issueDocNo: null,
          issueFiscalYear: this.advanceFilter
            ? this.advanceFilter.fiscalYear
            : null,
          receiveDocNo: this.docNumber,
          receiveFiscalYear: null,
          startDate: this.advanceFilter?.docFromDate
            ? this.advanceFilter.docFromDate
            : moment(this.bussinessDay).startOf('day').valueOf(),
          statuses:
            this.advanceFilter && this.advanceFilter.status !== null
              ? this.advanceFilter.status
              : ['RECEIVED'],
          transactionType: this.transferTypeDropDown.value
        },
        transactionType: this.getTransferType()
      });
    } else if (this.historyType === OtherReceiptsIssuesEnum.OTHER_ISSUES) {
      this.otherIssueFacade.loadOtherIssueHistory({
        type: OtherReceiptsIssuesEnum.OTHER_ISSUES,
        page: pageIndex,
        size: pageIndex === 0 ? 8 : 4,
        sort: 'issuedDocNo,asc',
        payload: {
          actionType: 'ISSUE',
          dateRangeType: 'CUSTOM',
          endDate: this.advanceFilter?.docToDate
            ? this.advanceFilter.docToDate
            : moment(this.bussinessDay).endOf('day').valueOf(),
          issueDocNo: this.docNumber,
          issueFiscalYear: this.advanceFilter
            ? this.advanceFilter.fiscalYear
            : null,
          receiveDocNo: null,
          receiveFiscalYear: null,
          startDate: this.advanceFilter?.docFromDate
            ? this.advanceFilter.docFromDate
            : moment(this.bussinessDay).startOf('day').valueOf(),
          statuses:
            this.advanceFilter && this.advanceFilter.status !== null
              ? this.advanceFilter.status
              : ['ISSUED', 'COMPLETED'],
          transactionType: this.transferTypeDropDown.value
        },
        issueType: this.getTransferType()
      });
    } else if (
      this.historyType === OtherReceiptsIssuesEnum.OTHER_ISSUES_REQUESTS
    ) {
      this.otherIssueFacade.loadOtherIssueHistory({
        type: OtherReceiptsIssuesEnum.OTHER_ISSUES_REQUESTS,
        page: pageIndex,
        size: pageIndex === 0 ? 8 : 4,
        sort: 'reqDocNo,asc',
        payload: {
          actionType: 'ISSUE',
          dateRangeType: 'CUSTOM',
          endDate: this.advanceFilter?.docToDate
            ? this.advanceFilter?.docToDate
            : moment(this.bussinessDay).endOf('day').valueOf(),
          locationCode: null,
          reqDocNo: this.docNumber,
          reqFiscalYear: this.advanceFilter
            ? this.advanceFilter.fiscalYear
            : null,
          requestType: this.transferTypeDropDown.value,
          startDate: this.advanceFilter?.docFromDate
            ? this.advanceFilter.docFromDate
            : moment(this.bussinessDay).startOf('day').valueOf(),
          statuses:
            this.advanceFilter && this.advanceFilter.status !== null
              ? this.advanceFilter.status
              : ['CANCELLED', 'APVL_REJECTED']
        },
        issueType: this.getTransferType()
      });
    }
  }
  onHistoryCardSelected(stock) {
    this.router.navigate([
      getOtherReceiptsIssuesHistoryDetailsRouteUrl(
        this.historyType,
        this.activatedRoute.snapshot.params['type'],
        stock.id
      )
    ]);
  }
  tabSelectionChange(listType: any, tabType: any) {
    if (listType === 'list') {
      this.listType = listType;
      if (!this.isloaded) {
        this.isloaded = true;
        this.reqType = this.activatedRoute.snapshot.params['type'];
        this.listInit(tabType);
      } else {
        this.onTabSelection(tabType);
      }
    } else if (listType === 'history' && this.listType !== 'history') {
      this.listType = listType;
      this.type = null;
      this.onHistoryTabSelection();
    }
  }
  tabselected(listType: any, tabType: any) {
    this.isloaded = false;
    this.clearSearch();

    if (tabType === OtherReceiptsIssuesEnum.OTHER_ISSUES) {
      this.router.navigate([getOtherIssuesDefaultUrl()]);
    } else {
      this.router.navigate([getOtherReceiptsDefaultUrl()]);
    }
  }
  openHistoryFilter() {
    const emitData = {
      advancedFilter: this.advanceFilter ? this.advanceFilter : {},
      type: this.historyType,
      currentFiscalYear: this.currentFiscalYear,
      bussinessDay: moment(this.bussinessDay)
    };
    const dialogRef = this.dialog.open(
      OtherReceiptsIssueHistoryAdvancedPopupComponent,
      {
        width: '30vw',
        data: emitData,
        disableClose: true
      }
    );
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data !== undefined) {
          this.docNumber = null;
          this.historySearchControl.reset();
          this.otherIssueFacade.setAdvancedFilterData(data);

          this.loadHistoryList(0);
        }
      });
  }
  clearHistorySearch(event = null) {

    this.historySearchControl.reset();

    this.docNumber = null;
    this.loadHistoryList(0);
  }
  otherIssuesTypeChange(value) {


    this.historySearchControl.reset();
    this.historyType = value;

    if (this.historyType === 'otherissues') {
      this.router.navigate([getOtherIssuesSuggestedRoutes()]);
    } else {
      this.router.navigate([getOtherIssuesRaisedRequestsSuggestedRoutes()]);
    }

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

  numberCheck($event: KeyboardEvent) {
    const pattern = fieldValidation.numbersField.pattern;
    return pattern.test($event.key);
  }
  loadPermission = (element: string) => {
    return this.elementPermission.loadPermission(element, this.permissions$);
  };
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
