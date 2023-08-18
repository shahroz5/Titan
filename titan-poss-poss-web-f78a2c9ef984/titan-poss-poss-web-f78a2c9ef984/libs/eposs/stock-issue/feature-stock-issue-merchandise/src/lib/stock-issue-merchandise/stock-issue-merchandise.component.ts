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
  LocationSettingAttributesEnum,
  SharedBodEodFeatureServiceAbstraction,
  StockIssueTypesEnum,
  StockIssueAPIRequestTypesEnum,
  OverlayNotificationType,
  OverlayNotificationEventRef,
  Command,
  ShortcutServiceAbstraction
} from '@poss-web/shared/models';
import { Observable, Subject, fromEvent } from 'rxjs';
import { StockIssueFacade } from '@poss-web/eposs/stock-issue/data-access-stock-issue';
import { Router, ActivatedRoute } from '@angular/router';
import {
  takeUntil,
  debounceTime,
  filter,
  withLatestFrom,
  take
} from 'rxjs/operators';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { CardListComponent } from '@poss-web/shared/components/ui-card-list';
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

const componentName = 'StockIssueListComponent';

@Component({
  selector: 'poss-web-stock-issue-merchandise',
  templateUrl: './stock-issue-merchandise.component.html'
})
export class StockIssueMerchandiseComponent
  implements OnInit, OnDestroy, AfterViewInit {
  storeType: string;

  isLoadingCount$: Observable<boolean>;
  isLoadingCFA$: Observable<boolean>;

  BTQ_MER_IssuePendingSTNCount$: Observable<number>;
  allPendingIssuePendingSTNCount$: Observable<number>;

  BTQ_MER_PendingSTN$: Observable<StockRequestNote[]>;
  searchIssueSTNResult$: Observable<StockRequestNote[]>;

  isLoadingBTQ_MER_STN: boolean;

  isSearchingIssues$: Observable<boolean>;
  hasSearchIssueResults$: Observable<boolean>;

  isPendingBTQ_MERSTNLoadedOnce = false;

  isL1L2Store: boolean;
  isL3Store: boolean;

  error$: Observable<CustomErrors>;
  isLoading = false;

  pageSize = 4;
  initialPageSize = 8;
  dateFormat: string;
  destroy$: Subject<null> = new Subject<null>();

  noDataFoundMessage;

  @ViewChild('searchBox')
  searchBox: ElementRef;

  @ViewChild(CardListComponent)
  cardListComponentRef: CardListComponent;

  searchForm: FormGroup;

  searchFormControl = new FormControl();
  showNoResultsFoundNaN = false;

  type: StockIssueTypesEnum;
  StockIssueTypesEnumRef = StockIssueTypesEnum;

  currentDate = moment();

  requestType: any;
  invoiceType: string = null;

  status: string;
  statusColor: string;
  hasNotification = false;

  docNumber = null;
  isLoggedIn: boolean;

  navigation: any;

  permissions$: Observable<any[]>;
  currentFiscalYear: string;
  bussinessDay = null;
  constructor(
    private stockIssueFacade: StockIssueFacade,
    private router: Router,
    private activatedRoute: ActivatedRoute,
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
    this.searchForm = this.formBuilder.group({
      searchValue: []
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
    if (this.searchBox) {
      fromEvent(this.searchBox.nativeElement, 'input')
        .pipe(debounceTime(1000), takeUntil(this.destroy$))
        .subscribe((event: any) => {
          const searchValue = this.searchFormControl.value;
          this.showNoResultsFoundNaN = false;

          if (searchValue !== '') {
            if (this.validateSearch(searchValue)) {
              // this.stockIssueFacade.resetStockIssueList();
              this.searchIssues(searchValue);
            } else {
              this.stockIssueFacade.searchClear();
            }
          } else {
            this.clearSearch();
          }
        });
    }
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
        if (this.type !== StockIssueTypesEnum.HISTORY) {
          if (this.searchBox) {
            this.searchBox.nativeElement.focus();
          }
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

    this.isSearchingIssues$ = this.stockIssueFacade.getIsSearchingIssues();
    this.hasSearchIssueResults$ = this.stockIssueFacade.getHasSearchIssueResults();
    this.searchIssueSTNResult$ = this.stockIssueFacade.getSearchIssueResult();

    this.stockIssueFacade
      .getIsLoadingIssueToMerchant()
      .pipe(takeUntil(this.destroy$))
      .subscribe((isLoading: boolean) => {
        this.isLoadingBTQ_MER_STN = isLoading;
      });

    const type = this.activatedRoute.snapshot.params['type'];

    this.authFacade
      .isUserLoggedIn()
      .pipe(takeUntil(this.destroy$))
      .subscribe((isLoggedIn: boolean) => {
        this.isLoggedIn = isLoggedIn;
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
  }

  getIssues() {
    if (this.isL1L2Store) {
      this.BTQ_MER_IssuePendingSTNCount$ = this.stockIssueFacade.getPendingBTQ_MER_STNCount();

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
    }
  }

  searchIssues(reqDocNo: number) {
    let requestType: string;

    requestType = StockIssueAPIRequestTypesEnum.MER;
    if (this.isL1L2Store) {
      this.stockIssueFacade.searchPendingIssues({
        reqDocNo: reqDocNo,
        requestType: requestType
      });
    }
  }

  loadStocks(pageIndex) {
    if (!this.isLoading) {
      this.stockIssueFacade.loadIssueToMerchantSTN({
        requestType: StockIssueAPIRequestTypesEnum.MER,
        pageIndex: pageIndex,
        pageSize: this.isPendingBTQ_MERSTNLoadedOnce
          ? this.pageSize
          : this.initialPageSize
      });
    }
  }
  onSelected(issue: any) {
    if (this.isL1L2Store) {
      this.router.navigate(
        [
          '/inventory/stockissue/details',
          StockIssueTypesEnum.MERCHANDISE,
          issue.id
        ],
        {
          relativeTo: this.activatedRoute
        }
      );
    } else {
      // TODO : throw an error
    }
  }

  clearSearch(event = null) {
    if (this.cardListComponentRef) {
      this.cardListComponentRef.resetFocus();
    }

    this.searchFormControl.reset();
    this.stockIssueFacade.searchClear();
    this.showNoResultsFoundNaN = false;
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

  numberCheck($event: KeyboardEvent) {
    const pattern = fieldValidation.numbersField.pattern;
    return pattern.test($event.key);
  }
  loadPermission = (element: string) =>
    this.elementPermission.loadPermission(element, this.permissions$);

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
