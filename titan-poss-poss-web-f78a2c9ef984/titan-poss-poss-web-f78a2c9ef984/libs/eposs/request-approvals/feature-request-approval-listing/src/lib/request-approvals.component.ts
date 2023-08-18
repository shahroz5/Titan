import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  ElementRef,
  ChangeDetectionStrategy
} from '@angular/core';
import { fieldValidation } from '@poss-web/shared/util-field-validators';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Observable, Subject, fromEvent } from 'rxjs';
import {
  BinRequestApprovalsItems,
  BinApprovalspayload,
  ApprovalsMenuKeyEnum,
  RequestApprovalsEnum,
  RequestApprovalsAPITypesEnum,
  RequestApprovals,
  OverlayNotificationType,
  OverlayNotificationEventRef,
  CustomErrors,
  OverlayNotificationServiceAbstraction,
  Command,
  ShortcutServiceAbstraction
} from '@poss-web/shared/models';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import {
  getBinCodeRouteUrl,
  getRequestOtherIssuesRouteUrl,
  getApprovalsHomeRouteUrl,
  getInventoryRequestApprovalsTypeUrl,
  getIbtCancellationRequestApprovalsDetailsRouteUrl,
  getIbtRequestApprovalsDetailsRouteUrl,
  getOtherIssuesRequestDetailsRouteUrl
} from '@poss-web/shared/util-site-routes';
import {
  SelectionDailogOption,
  SelectionDialogService
} from '@poss-web/shared/components/ui-selection-dialog';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';

import { RequestApprovalsFacade } from '@poss-web/eposs/request-approvals/data-access-request-approvals';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil, debounceTime, filter } from 'rxjs/operators';
import { CardListComponent } from '@poss-web/shared/components/ui-card-list';
import { ElementPermissionService } from '@poss-web/shared/permission/util-element-permissions';
import { PermissionFacade } from '@poss-web/shared/permission/data-access-permission';
import { PermissionService } from '@poss-web/shared/permission/ui-permission';
import { AuthFacade } from '@poss-web/shared/auth/data-access-auth';
import { ProfileDataFacade } from '@poss-web/shared/profile/data-access-profile';

const SEARCH_SHORTCUT_KEY = 'RequestApprovalsComponent.MAIN_SEARCH';
const CARD_LIST_SHORTCUT_KEY = 'RequestApprovalsComponent.CARD_LIST';

const DROPDOWN_SHORTCUT_KEY = 'RequestApprovalsComponent.PRIMARY_DROPDOWN';

const tab1ShortcutKey = 'Common.TAB_1';
const tab2ShortcutKey = 'Common.TAB_2';
const tab3ShortcutKey = 'Common.TAB_3';
const componentName = 'RequestApprovalsComponent';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'poss-web-request-approvals',
  templateUrl: './request-approvals.component.html',
  styleUrls: ['./request-approvals.component.scss']
})
export class RequestApprovalsComponent
  implements OnInit, OnDestroy, AfterViewInit {
  searchForm: FormGroup;
  binRequestApprovalsCount$: Observable<any>;
  ibtRequestApprovalsCount$: Observable<any>;
  ibtCancelCount$: Observable<number>;
  reqApprovalsType: RequestApprovalsEnum;
  reqType: RequestApprovalsEnum;
  reqApprovalsTypeRef = RequestApprovalsEnum;
  isBinRequestLoadedOnce = false;
  isIbtRequestLoadedOnce = false;
  isOtherIssuezRequestLoadedOnce = false;
  isADJloadedOnce = false;
  isPSVLoadedOnce = false;
  isLOSSLoadedOnce = false;
  isLOANLoadedOnce = false;
  isFOCLoadedOnce = false;
  isEXHLoadedOnce = false;
  adjCount: Observable<number>;
  psvCount: Observable<number>;
  lossCount: Observable<number>;
  loanCount: Observable<number>;
  focCount: Observable<number>;
  exhCount: Observable<number>;
  adj$: Observable<RequestApprovals[]>;
  psv$: Observable<RequestApprovals[]>;
  loss$: Observable<RequestApprovals[]>;
  ibtType: string;
  loan$: Observable<RequestApprovals[]>;
  exh$: Observable<RequestApprovals[]>;
  foc$: Observable<RequestApprovals[]>;

  storeType: string;
  isLoading: boolean;
  isLocationLoading: boolean;
  otherIssuesType: Observable<number>;
  Items$: Observable<BinRequestApprovalsItems[]>;
  ibtCard$: Observable<RequestApprovals[]>;
  ibtCancellationCard$: Observable<RequestApprovals[]>;
  ibtCount$: Observable<number>;
  isIbtLoading$: Observable<boolean>;
  isFocLoading$: Observable<boolean>;
  isLossLoading$: Observable<boolean>;
  isLoanLoading$: Observable<boolean>;
  isExhLoading$: Observable<boolean>;
  isPsvLoading$: Observable<boolean>;
  isAdjLoading$: Observable<boolean>;
  isCancelLoading$: Observable<boolean>;
  isIbtLoading: boolean;
  otherIssuesCount: Observable<number>;
  //TODO take pagesize from appsettings
  pageIndex = 0;
  binGroup: string;
  locationForSelection: SelectionDailogOption[] = [];
  selectedLocation: SelectionDailogOption;
  location$: Observable<Location[]>;
  initailPageEvent: PageEvent = {
    pageIndex: this.pageIndex,
    pageSize: 5,
    length: 0
  };
  pageSizeOptions: number[] = [];
  pageSize = 8;
  isLoggedIn: boolean;
  @ViewChild('searchBox', { static: true, read: ElementRef })
  searchRef: ElementRef;

  @ViewChild(CardListComponent)
  cardListComponentRef: CardListComponent;

  itemsPageEvent: PageEvent = this.initailPageEvent;
  isItemsLoading$: Observable<boolean>;
  isItemsLoading: boolean;
  destroy$: Subject<null> = new Subject<null>();
  hasNotification: boolean;
  searchValue: any;
  otherIssues$: Observable<RequestApprovals[]>;

  reqDocNo: number;
  locationCode: string;
  sort: string;
  searchLocationPlaceHolder: string;
  selectLocationLableText: string;
  showNoResultsFound: boolean;
  otherBoutiqueFormControl = new FormControl(RequestApprovalsEnum.ADJ);
  @ViewChild('tabRef') tabRef: ElementRef;

  BIN_REQUEST_TAB = 'RequestApproval Home - NewBinRequest Tab';
  IBT_REQUEST_TAB = 'RequestApproval Home - IBT Tab';
  OTHERISSUES_REQUEST_TAB = 'RequestApproval Home - OtherIssues Tab';
  ADJ_REQUEST_TAB = 'RequestApproval Home - Adjustments SubTab';
  LOAN_REQUEST_TAB = 'RequestApproval Home - loan SubTab';
  FOC_REQUEST_TAB = 'RequestApproval Home - FOC SubTab';
  LOSS_REQUEST_TAB = 'RequestApproval Home - Loss SubTab';
  PSV_REQUEST_TAB = 'RequestApproval Home - PSV SubTab';
  EXH_REQUEST_TAB = 'RequestApproval Home - Exhibition SubTab';

  permissions$: Observable<any[]>;

  constructor(
    private router: Router,
    private appsettingFacade: AppsettingFacade,
    private activatedRoute: ActivatedRoute,
    private shortcutService: ShortcutServiceAbstraction,
    private dialog: MatDialog,
    private selectionDialog: SelectionDialogService,
    private formBuilder: FormBuilder,
    private appSettingFacade: AppsettingFacade,
    private binRequestFacade: RequestApprovalsFacade,
    private translate: TranslateService,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private elementPermission: ElementPermissionService,
    private permissionfacade: PermissionFacade,
    private permissionService: PermissionService,
    private authFacade: AuthFacade,
    private profiledatafacade: ProfileDataFacade
  ) {
    this.authFacade
      .isUserLoggedIn()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: boolean) => {
        this.isLoggedIn = data;
      });
      this.shortcutService.componentNames = [componentName];
    this.shortcutService.commands
      .pipe(takeUntil(this.destroy$))
      .subscribe(command => {
        this.shortcutEventHandler(command);
      });

    this.translate
      .get([
        'pw.instock.selectLocationPlaceHolder',
        'pw.instock.selectDestinationBinLableText'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.selectLocationLableText =
          translatedMessages['pw.instock.selectDestinationBinLableText'];
        this.searchLocationPlaceHolder =
          translatedMessages['pw.instock.selectLocationPlaceHolder'];
      });
    this.searchForm = this.formBuilder.group({
      searchValue: [],
      selectedValue: []
    });

    this.authFacade
      .isUserLoggedIn()
      .pipe(takeUntil(this.destroy$))
      .subscribe((isLoggedIn: boolean) => {
        this.isLoggedIn = isLoggedIn;
      });

    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd && this.isLoggedIn),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        let type = this.activatedRoute.snapshot.params['type'];
        const tab = this.activatedRoute.snapshot.params['tab'];

        if (
          type === RequestApprovalsEnum.BIN_COR ||
          type === RequestApprovalsEnum.IBT_COR ||
          type === RequestApprovalsEnum.Other_Issues
        ) {
          if (this.isLoggedIn) this.changeReqApprovalsType(type);
        }
        if (
          tab === RequestApprovalsEnum.ADJ ||
          tab === RequestApprovalsEnum.FOC ||
          tab === RequestApprovalsEnum.EXH ||
          tab === RequestApprovalsEnum.LOAN ||
          tab === RequestApprovalsEnum.LOSS ||
          tab === RequestApprovalsEnum.PSV
        ) {
          type = RequestApprovalsEnum.Other_Issues;
          if (this.isLoggedIn) this.changeReqType(tab);
        }
      });
  }

  ngOnInit() {
    this.binRequestFacade.resetError();
    this.binRequestFacade.resetUpdate();
    this.binRequestFacade.resetBinRequestApprovalsCount();
    this.binRequestFacade.resetBinRequestApprovals();

    this.binRequestFacade.resetIbtRequestApprovalsCount();
    this.binRequestFacade.resetIbtRequestApprovals();
    this.binRequestFacade.resetFocRequestApprovalsCount();
    this.binRequestFacade.resetFocRequestApprovals();
    this.binRequestFacade.resetExhRequestApprovalsCount();
    this.binRequestFacade.resetExhtRequestApprovals();
    this.binRequestFacade.resetPsvRequestApprovalsCount();
    this.binRequestFacade.resetPsvRequestApprovals();
    this.binRequestFacade.resetLossRequestApprovalsCount();
    this.binRequestFacade.resetLossRequestApprovals();
    this.binRequestFacade.resetLoanRequestApprovalsCount();
    this.binRequestFacade.resetLoanRequestApprovals();
    this.binRequestFacade.resetadjRequestApprovalsCount();
    this.binRequestFacade.resetadjRequestApprovals();

    this.permissions$ = this.permissionfacade.getPermissionforURL();
    this.elementPermission
      .loadPermission(this.BIN_REQUEST_TAB, this.permissions$)
      .pipe(
        filter(data => !!data.transactionCodes),
        takeUntil(this.destroy$)
      )
      .subscribe(val1 => {
        const availableTransactionCodes = val1.transactionCodes;
        const hasRequestPermission = availableTransactionCodes.find(key =>
          this.permissionService.hasPermission(key)
        );
        if (hasRequestPermission) {
          this.binRequestFacade.loadbinRequestApprovalsItemCount();
        }
      });
    this.elementPermission
      .loadPermission(this.IBT_REQUEST_TAB, this.permissions$)
      .pipe(
        filter(data => !!data.transactionCodes),
        takeUntil(this.destroy$)
      )
      .subscribe(data => {
        const availableTransactionCodes = data.transactionCodes;
        const hasRequestPermission = availableTransactionCodes.find(key =>
          this.permissionService.hasPermission(key)
        );
        if (hasRequestPermission) {
          this.binRequestFacade.loadibtRequestApprovalsItemCount();
          this.binRequestFacade.loadibtCancelCount();
        }
      });

    this.elementPermission
      .loadPermission(this.OTHERISSUES_REQUEST_TAB, this.permissions$)
      .pipe(
        filter(data => !!data.transactionCodes),
        takeUntil(this.destroy$)
      )
      .subscribe(data => {
        const availableTransactionCodes = data.transactionCodes;
        const hasRequestPermission = availableTransactionCodes.find(key =>
          this.permissionService.hasPermission(key)
        );
        if (hasRequestPermission) {
          this.binRequestFacade.loadRequestCount();
        }
      });

    this.otherIssuesCount = this.binRequestFacade.getOtherIssueCount();
    this.ibtCount$ = this.binRequestFacade.getIbtCardCount();

    this.ibtRequestApprovalsCount$ = this.binRequestFacade.getIbtItemsCount();
    this.ibtCancelCount$ = this.binRequestFacade.getIbtCancelCount();

    this.adjCount = this.binRequestFacade.getadjCount();

    this.exhCount = this.binRequestFacade.getexhCount();

    this.focCount = this.binRequestFacade.getfocCount();

    this.loanCount = this.binRequestFacade.getloanCount();

    this.lossCount = this.binRequestFacade.getlossCount();

    this.psvCount = this.binRequestFacade.getpsvCount();
    this.ibtCard$ = this.binRequestFacade.getIbtRequest();
    this.ibtCancellationCard$ = this.binRequestFacade.getIbtCancellationRequest();
    this.exh$ = this.binRequestFacade.getexhRequest();
    this.adj$ = this.binRequestFacade.getadjRequest();
    this.foc$ = this.binRequestFacade.getfocRequest();
    this.loss$ = this.binRequestFacade.getlossRequest();

    this.loan$ = this.binRequestFacade.getloanRequest();
    this.psv$ = this.binRequestFacade.getpsvRequest();

    this.isItemsLoading$ = this.binRequestFacade.getIsBinRequestApprovalsItemsLoading();
    this.isItemsLoading$.pipe(takeUntil(this.destroy$)).subscribe(data => {
      if (data) {
        this.isItemsLoading = data;
      }
    });
    this.Items$ = this.binRequestFacade.getbinItems();

    this.loadIbtRequest(0);
    this.isIbtLoading$ = this.binRequestFacade.getIsLoadingIbt();
    this.isAdjLoading$ = this.binRequestFacade.getIsLoadingadj();
    this.isFocLoading$ = this.binRequestFacade.getIsLoadingfoc();
    this.isLossLoading$ = this.binRequestFacade.getIsLoadingloss();
    this.isLoanLoading$ = this.binRequestFacade.getIsLoadingloan();
    this.isExhLoading$ = this.binRequestFacade.getIsLoadingexh();
    this.isPsvLoading$ = this.binRequestFacade.getIsLoadingpsv();
    this.isCancelLoading$ = this.binRequestFacade.getIsLoadingIbtCancellation();

    this.isIbtLoading$.pipe(takeUntil(this.destroy$)).subscribe(data => {
      if (data) {
        this.isIbtLoading = data;
      }
    });

    this.binRequestFacade
      .getupdateItem()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.initialLoad();

          this.binRequestFacade.loadbinRequestApprovalsItemCount();
          this.successNotification(
            data.status,
            data.binName,
            data.reqLocationCode,
            data.binGroupCode
          );
        }
      });
    this.appSettingFacade
      .getPageSizeOptions()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: number[]) => {
        this.pageSizeOptions = data;
      });
    this.profiledatafacade
      .getBoutiqueType()
      .pipe(takeUntil(this.destroy$))
      .subscribe(val => {
        this.storeType = val;
      });
    this.componentOnInit();
    this.appsettingFacade
      .getPageSize()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        const pageSize = data;
        this.initailPageEvent.pageSize = pageSize;
      });

    this.binRequestFacade
      .getIsLoading()
      .pipe(takeUntil(this.destroy$))
      .subscribe((isLoading: boolean) => {
        this.isLoading = isLoading;
      });

    this.binRequestFacade
      .getIsLocationLoading()
      .pipe(takeUntil(this.destroy$))
      .subscribe((isLoading: boolean) => {
        this.isLocationLoading = isLoading;
      });
    this.binRequestApprovalsCount$ = this.binRequestFacade.getItemCount();

    this.binRequestFacade.loadLocations();

    this.componentInit();

    this.binRequestFacade
      .getHasUpdatingFailure()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.errorHandler(data);
        }
      });

    this.binRequestFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        if (error) {
          this.errorHandler(error);
        }
      });
  }

  componentOnInit() {
    const type = this.activatedRoute.snapshot.params['type'];
    const tab = this.activatedRoute.snapshot.params['tab'];

    if (
      !type ||
      !(
        type === RequestApprovalsEnum.BIN_COR ||
        type === RequestApprovalsEnum.IBT_COR ||
        type === RequestApprovalsEnum.Other_Issues
      )
    ) {
    } else {
      this.changeReqApprovalsType(type);
    }

    if (
      !tab ||
      !(
        tab === RequestApprovalsEnum.ADJ ||
        tab === RequestApprovalsEnum.EXH ||
        tab === RequestApprovalsEnum.FOC ||
        tab === RequestApprovalsEnum.LOAN ||
        tab === RequestApprovalsEnum.LOSS ||
        tab === RequestApprovalsEnum.EXH
      )
    ) {
    } else {
      this.changeReqType(tab);
    }
  }

  shortcutEventHandler(command: Command): void {
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
        case 'binReq': {
          this.changeReqApprovalsType(RequestApprovalsEnum.BIN_COR);
          isTab = true;
          break;
        }
        case 'ibtReq': {
          this.changeReqApprovalsType(RequestApprovalsEnum.IBT_COR);
          isTab = true;
          break;
        }
        case 'otherIssuesReq': {
          this.changeReqApprovalsType(RequestApprovalsEnum.Other_Issues);
          isTab = true;
          break;
        }
      }
    }

    if (!isTab) {
      switch (command.name) {
        case SEARCH_SHORTCUT_KEY: {
          if (
            this.searchRef &&
            this.searchRef.nativeElement &&
            this.searchRef.nativeElement.focus
          ) {
            this.searchRef.nativeElement.focus();
          }
          break;
        }
        case CARD_LIST_SHORTCUT_KEY: {
          if (this.cardListComponentRef) {
            this.cardListComponentRef.focus();
          }
          break;
        }
        case DROPDOWN_SHORTCUT_KEY: {
          this.openBinSelectionPopup();
          break;
        }
      }
    }
  }

  changeReqApprovalsType(newType: RequestApprovalsEnum): void {
    this.ibtType = 'IBT_Request';
    if (this.reqApprovalsType !== newType) {
      this.clear();

      this.reqApprovalsType = newType;
      if (this.reqApprovalsType !== RequestApprovalsEnum.Other_Issues) {
        this.router.navigate([getInventoryRequestApprovalsTypeUrl(newType)]);
      }

      if (
        this.reqApprovalsType === RequestApprovalsEnum.BIN_COR ||
        (this.reqApprovalsType === RequestApprovalsEnum.IBT_COR &&
          !this.isIbtRequestLoadedOnce)
      ) {
        this.loadRequests(0);
      } else if (
        this.reqApprovalsType === RequestApprovalsEnum.Other_Issues &&
        !this.isOtherIssuezRequestLoadedOnce
      ) {
        this.router.navigate([getRequestOtherIssuesRouteUrl()]);
      }
    }
  }
  changeReqType(newType: RequestApprovalsEnum): void {
    this.reqApprovalsType = RequestApprovalsEnum.Other_Issues;
    if (this.reqType !== newType) {
      this.clear();

      this.router.navigate([
        '/approvals/inventory-approvals/OtherIssuesRequest/' + newType
      ]);

      this.reqType = newType;

      if (
        (this.reqType === RequestApprovalsEnum.ADJ && !this.isADJloadedOnce) ||
        (this.reqType === RequestApprovalsEnum.LOAN &&
          !this.isLOANLoadedOnce) ||
        (this.reqType === RequestApprovalsEnum.LOSS &&
          !this.isLOSSLoadedOnce) ||
        (this.reqType === RequestApprovalsEnum.FOC && !this.isFOCLoadedOnce) ||
        (this.reqType === RequestApprovalsEnum.PSV && !this.isPSVLoadedOnce) ||
        (this.reqType === RequestApprovalsEnum.EXH && !this.isEXHLoadedOnce)
      ) {
        this.loadOtherIssues(0);
      }
    }
  }

  loadOtherIssues(index: number) {
    this.reqDocNo = null;
    this.locationCode = null;
    this.loadOtherIssueRequest(index);
  }

  componentInit() {
    this.binRequestFacade
      .getLocations()
      .pipe(takeUntil(this.destroy$))
      .subscribe((locations: any) => {
        if (locations) {
          this.locationForSelection = locations.map(location => ({
            id: location.locationCode,
            description: location.locationCode + ' - ' + location.description
          }));
        }
      });
  }

  ngAfterViewInit() {
    fromEvent(this.searchRef.nativeElement, 'input')
      .pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe((event: any) => {
        this.searchValue = this.searchForm.get('searchValue').value;

        if (this.searchValue !== '') {
          if (this.validateSearch(this.searchValue)) {
            this.search(this.searchValue);
          } else {
            this.clearSearchRequest();
          }
        } else {
          this.clearSearch();
        }
      });
  }

  clearSearchRequest() {
    if (this.reqApprovalsType === RequestApprovalsEnum.BIN_COR) {
      this.binRequestFacade.ClearBinRequest();
    } else if (this.reqApprovalsType === RequestApprovalsEnum.IBT_COR) {
      this.binRequestFacade.ClearIbtRequest();
    } else if (this.reqApprovalsType === RequestApprovalsEnum.Other_Issues) {
      if (this.reqType === RequestApprovalsEnum.ADJ) {
        this.binRequestFacade.ClearADJRequest();
      } else if (this.reqType === RequestApprovalsEnum.EXH) {
        this.binRequestFacade.ClearExhRequest();
      } else if (this.reqType === RequestApprovalsEnum.FOC) {
        this.binRequestFacade.ClearFOCRequest();
      } else if (this.reqType === RequestApprovalsEnum.LOSS) {
        this.binRequestFacade.ClearLOSSRequest();
      } else if (this.reqType === RequestApprovalsEnum.LOAN) {
        this.binRequestFacade.ClearLOANRequest();
      } else if (this.reqType === RequestApprovalsEnum.PSV) {
        this.binRequestFacade.ClearPSVRequest();
      }
    }
  }

  select(selectedValue: SelectionDailogOption) {
    this.reset();
    this.locationCode = selectedValue.id;
    if (this.reqApprovalsType === RequestApprovalsEnum.BIN_COR) {
      this.itemsPageEvent = this.initailPageEvent;
      this.loadBinApprovals();
    } else if (this.reqApprovalsType === RequestApprovalsEnum.IBT_COR) {
      this.pageIndex = 0;
      this.loadIbtRequest(this.pageIndex);
    } else if (this.reqApprovalsType === RequestApprovalsEnum.Other_Issues) {
      this.pageIndex = 0;
      this.loadOtherIssueRequest(this.pageIndex);
    }
  }

  openBinSelectionPopup() {
    this.dialog.closeAll();
    this.selectionDialog
      .open({
        title: this.selectLocationLableText,
        placeholder: this.searchLocationPlaceHolder,
        options: this.locationForSelection
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((selectedOption: SelectionDailogOption) => {
        if (selectedOption) {
          this.selectedLocation = selectedOption;
          this.select(this.selectedLocation);
        }
      });
  }

  search(searchValue: number) {
    this.reqDocNo = searchValue;
    this.reset();

    if (this.reqApprovalsType === RequestApprovalsEnum.BIN_COR) {
      this.itemsPageEvent = this.initailPageEvent;
      this.loadBinApprovals();
    } else if (this.reqApprovalsType === RequestApprovalsEnum.IBT_COR) {
      this.pageIndex = 0;
      this.loadIbtRequest(this.pageIndex);
    } else if (this.reqApprovalsType === RequestApprovalsEnum.Other_Issues) {
      this.pageIndex = 0;
      this.loadOtherIssueRequest(this.pageIndex);
    }
  }

  clear() {
    this.reqDocNo = null;
    this.searchForm.reset();
    this.locationCode = null;
  }

  validateSearch(searchValue: string): boolean {
    return fieldValidation.requestNumberField.pattern.test(searchValue);
  }

  clearSearch() {
    this.reqDocNo = null;
    if (this.reqApprovalsType === RequestApprovalsEnum.BIN_COR) {
      this.loadBinApprovals();
    } else if (this.reqApprovalsType === RequestApprovalsEnum.IBT_COR) {
      this.loadIbtRequest(0);
    } else if (this.reqApprovalsType === RequestApprovalsEnum.Other_Issues) {
      this.loadOtherIssueRequest(0);
    }
    this.searchForm.reset();
  }

  loadRequests(pageIndex: number): void {
    this.getRequestApprovals();

    if (this.reqApprovalsType === RequestApprovalsEnum.BIN_COR) {
      this.reqType = null;
      this.initialLoad();
    } else if (this.reqApprovalsType === RequestApprovalsEnum.IBT_COR) {
      this.reqType = null;

      this.reqDocNo = null;
      this.locationCode = null;

      this.loadIbtRequest(pageIndex);
    } else this.loadOtherIssues(pageIndex);
  }
  reset() {
    if (this.reqApprovalsType === RequestApprovalsEnum.IBT_COR) {
      this.binRequestFacade.resetIbtRequestApprovalsCount();
      this.binRequestFacade.resetIbtRequestApprovals();
    } else if (this.reqApprovalsType === RequestApprovalsEnum.Other_Issues) {
      if (this.reqType === RequestApprovalsEnum.FOC) {
        this.binRequestFacade.resetFocRequestApprovalsCount();
        this.binRequestFacade.resetFocRequestApprovals();
      } else if (this.reqType === RequestApprovalsEnum.EXH) {
        this.binRequestFacade.resetExhRequestApprovalsCount();
        this.binRequestFacade.resetExhtRequestApprovals();
      } else if (this.reqType === RequestApprovalsEnum.PSV) {
        this.binRequestFacade.resetPsvRequestApprovalsCount();
        this.binRequestFacade.resetPsvRequestApprovals();
      } else if (this.reqType === RequestApprovalsEnum.LOSS) {
        this.binRequestFacade.resetLossRequestApprovalsCount();
        this.binRequestFacade.resetLossRequestApprovals();
      } else if (this.reqType === RequestApprovalsEnum.LOAN) {
        this.binRequestFacade.resetLoanRequestApprovalsCount();
        this.binRequestFacade.resetLoanRequestApprovals();
      } else if (this.reqType === RequestApprovalsEnum.ADJ) {
        this.binRequestFacade.resetadjRequestApprovalsCount();
        this.binRequestFacade.resetadjRequestApprovals();
      }
    }
  }
  numberCheck($event: KeyboardEvent) {
    const pattern = fieldValidation.numbersField.pattern;

    return pattern.test($event.key);
  }
  getRequestApprovals() {
    if (this.reqApprovalsType === RequestApprovalsEnum.IBT_COR) {
      this.binRequestFacade.loadIbtRequest({
        reqLocationCode: this.locationCode,
        reqDocNo: this.reqDocNo,
        requestType: RequestApprovalsAPITypesEnum.BTQ,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      });

      this.ibtCard$ = this.binRequestFacade.getIbtRequest();

      this.ibtCard$
        .pipe(takeUntil(this.destroy$))
        .subscribe((items: RequestApprovals[]) => {
          if (items && items.length !== 0 && !this.isIbtRequestLoadedOnce) {
            this.isIbtRequestLoadedOnce = true;
          }
        });

      this.binRequestFacade.loadIbtCancellationRequest({
        reqLocationCode: this.locationCode,
        reqDocNo: this.reqDocNo,
        requestType: RequestApprovalsAPITypesEnum.CANCEL,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        status: RequestApprovalsAPITypesEnum.CANCEL_STATUS,
        sort: this.sort
      });
      this.ibtCancellationCard$ = this.binRequestFacade.getIbtCancellationRequest();

      this.ibtCancellationCard$
        .pipe(takeUntil(this.destroy$))
        .subscribe((cancelItems: RequestApprovals[]) => {
          if (
            cancelItems &&
            cancelItems.length !== 0 &&
            !this.isIbtRequestLoadedOnce
          ) {
            this.isIbtRequestLoadedOnce = true;
          }
        });
    }
    if (this.reqType === RequestApprovalsEnum.ADJ) {

      this.adj$
        .pipe(takeUntil(this.destroy$))
        .subscribe((items: RequestApprovals[]) => {
          if (items && items.length !== 0 && !this.isADJloadedOnce) {
            this.isADJloadedOnce = true;
          }
        });
    } else if (this.reqType === RequestApprovalsEnum.EXH) {
      this.exh$
        .pipe(takeUntil(this.destroy$))
        .subscribe((items: RequestApprovals[]) => {
          if (items && items.length !== 0 && !this.isEXHLoadedOnce) {
            this.isEXHLoadedOnce = true;
          }
        });
    } else if (this.reqType === RequestApprovalsEnum.FOC) {

      this.foc$
        .pipe(takeUntil(this.destroy$))
        .subscribe((items: RequestApprovals[]) => {
          if (items && items.length !== 0 && !this.isFOCLoadedOnce) {
            this.isFOCLoadedOnce = true;
          }
        });
    } else if (this.reqType === RequestApprovalsEnum.LOAN) {

      this.loan$
        .pipe(takeUntil(this.destroy$))
        .subscribe((items: RequestApprovals[]) => {
          if (items && items.length !== 0 && !this.isLOANLoadedOnce) {
            this.isLOANLoadedOnce = true;
          }
        });
    } else if (this.reqType === RequestApprovalsEnum.LOSS) {

      this.loss$
        .pipe(takeUntil(this.destroy$))
        .subscribe((items: RequestApprovals[]) => {
          if (items && items.length !== 0 && !this.isLOSSLoadedOnce) {
            this.isLOSSLoadedOnce = true;
          }
        });
    } else if (this.reqType === RequestApprovalsEnum.PSV) {

      this.psv$
        .pipe(takeUntil(this.destroy$))
        .subscribe((items: RequestApprovals[]) => {
          if (items && items.length !== 0 && !this.isPSVLoadedOnce) {
            this.isPSVLoadedOnce = true;
          }
        });
    }
  }

  loadOtherIssueRequest(pageIndex: number) {
    let type;
    console.log(this.reqType, 'load other ssuues');
    if (this.reqType === RequestApprovalsEnum.ADJ) {
      console.log(this.reqType, 'load other ssuues');
      type = RequestApprovalsAPITypesEnum.ADJ;
      this.binRequestFacade.loadADJRequest({
        reqLocationCode: this.locationCode,
        reqDocNo: this.reqDocNo,
        requestType: type,
        pageIndex: pageIndex,
        pageSize: this.pageSize
      });
    } else if (this.reqType === RequestApprovalsEnum.EXH) {
      console.log(this.reqType, 'load other ssuues');
      type = RequestApprovalsAPITypesEnum.EXH;
      this.binRequestFacade.loadEXHRequest({
        reqLocationCode: this.locationCode,
        reqDocNo: this.reqDocNo,
        requestType: type,
        pageIndex: pageIndex,
        pageSize: this.pageSize
      });
    } else if (this.reqType === RequestApprovalsEnum.FOC) {
      console.log(this.reqType, 'load other ssuues');
      type = RequestApprovalsAPITypesEnum.FOC;
      this.binRequestFacade.loadFocRequest({
        reqLocationCode: this.locationCode,
        reqDocNo: this.reqDocNo,
        requestType: type,
        pageIndex: pageIndex,
        pageSize: this.pageSize
      });
    } else if (this.reqType === RequestApprovalsEnum.LOSS) {
      console.log(this.reqType, 'load other ssuues');
      type = RequestApprovalsAPITypesEnum.LOSS;
      this.binRequestFacade.loadLOSSRequest({
        reqLocationCode: this.locationCode,
        reqDocNo: this.reqDocNo,
        requestType: type,
        pageIndex: pageIndex,
        pageSize: this.pageSize
      });
    } else if (this.reqType === RequestApprovalsEnum.LOAN) {
      console.log(this.reqType, 'load other ssuues');
      type = RequestApprovalsAPITypesEnum.LOAN;
      this.binRequestFacade.loadLOANRequest({
        reqLocationCode: this.locationCode,
        reqDocNo: this.reqDocNo,
        requestType: type,
        pageIndex: pageIndex,
        pageSize: this.pageSize
      });
    } else if (this.reqType === RequestApprovalsEnum.PSV) {
      console.log(this.reqType, 'load other ssuues');
      type = RequestApprovalsAPITypesEnum.PSV;
      this.binRequestFacade.loadPSVRequest({
        reqLocationCode: this.locationCode,
        reqDocNo: this.reqDocNo,
        requestType: type,
        pageIndex: pageIndex,
        pageSize: this.pageSize
      });
    }

  }

  onOtherIssuesSelected(stock: any): void {
    let tab;
    if (this.reqType === RequestApprovalsEnum.ADJ) {
      tab = RequestApprovalsEnum.ADJ;
    } else if (this.reqType === RequestApprovalsEnum.FOC) {
      tab = RequestApprovalsEnum.FOC;
    } else if (this.reqType === RequestApprovalsEnum.LOSS) {
      tab = RequestApprovalsEnum.LOSS;
    } else if (this.reqType === RequestApprovalsEnum.LOAN) {
      tab = RequestApprovalsEnum.LOAN;
    } else if (this.reqType === RequestApprovalsEnum.EXH) {
      tab = RequestApprovalsEnum.EXH;
    } else if (this.reqType === RequestApprovalsEnum.PSV) {
      tab = RequestApprovalsEnum.PSV;
    }

    this.router.navigate([getOtherIssuesRequestDetailsRouteUrl(tab, stock.id)]);
  }

  onSelected(stock: any) {
    if (this.ibtType === 'IBT_Request') {
      this.router.navigate([getIbtRequestApprovalsDetailsRouteUrl(stock.id)]);
    } else if (this.ibtType === 'IBT_Cancellation_Request') {
      this.router.navigate([
        getIbtCancellationRequestApprovalsDetailsRouteUrl(stock.id)
      ]);
    }
  }

  loadIbtRequest(pageIndex: number) {
    this.binRequestFacade.loadIbtRequest({
      reqLocationCode: this.locationCode,
      reqDocNo: this.reqDocNo,
      requestType: RequestApprovalsAPITypesEnum.BTQ,
      pageIndex: pageIndex,
      pageSize: this.pageSize
    });

    this.binRequestFacade.loadIbtCancellationRequest({
      reqLocationCode: this.locationCode,
      reqDocNo: this.reqDocNo,
      requestType: RequestApprovalsAPITypesEnum.CANCEL,
      pageIndex: pageIndex,
      pageSize: this.pageSize,
      status: RequestApprovalsAPITypesEnum.CANCEL_STATUS,
      sort: this.sort
    });
  }

  initialLoad() {
    this.locationCode = null;
    this.reqDocNo = null;
    this.binRequestFacade.loadBinRequestApprovalsItems({
      pageIndex: this.pageIndex,
      pageSize: this.initailPageEvent.pageSize
    });
  }

  paginateItems(event: PageEvent) {
    this.itemsPageEvent = event;
    this.loadBinApprovals();
  }

  loadBinApprovals() {
    this.binRequestFacade.loadBinRequestApprovalsItems({
      locationCode: this.locationCode,
      reqDocNo: this.reqDocNo,
      pageIndex: this.itemsPageEvent.pageIndex,
      pageSize: this.itemsPageEvent.pageSize
    });
  }

  approvals(approvalsValue: BinApprovalspayload) {
    this.binRequestFacade.updateItem({
      binRequestUpdateDto: {
        remarks: approvalsValue.binRequestUpdateDto.remarks,
        status: approvalsValue.binRequestUpdateDto.status
      },
      id: approvalsValue.id
    });
  }

  clearPopup() {
    this.locationCode = null;
    if (this.reqApprovalsType === RequestApprovalsEnum.BIN_COR)
      this.loadBinApprovals();
    else if (this.reqApprovalsType === RequestApprovalsEnum.IBT_COR)
      this.loadIbtRequest(0);
    else if (this.reqApprovalsType === RequestApprovalsEnum.Other_Issues)
      this.loadOtherIssueRequest(0);
  }

  back() {
    this.router.navigate([getApprovalsHomeRouteUrl()], {
      queryParams: { menu: ApprovalsMenuKeyEnum.INVENTORY_MENU_KEY }
    });
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

  successNotification(
    status: string,
    bin: string,
    location: string,
    binGroupCode: string
  ) {
    let key = '';
    // check if the error is the custom error
    if (status === 'APPROVED') {
      //Obtain the transation key which will be use to obtain the translated error message
      //based on the language selected. Default is the english language(refer en.json from asset folder).
      key = 'pw.requestApprovalsNotificationMessages.acceptMessage';
    } else if (status === 'APVL_REJECTED') {
      key = 'pw.requestApprovalsNotificationMessages.rejectMessage';
    }
    this.translate
      .get(key)
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMsg: string) => {
        this.hasNotification = true;
        this.overlayNotification
          .show({
            type: OverlayNotificationType.TIMER,
            message: bin + ' ' + translatedMsg
          })
          .events.pipe(takeUntil(this.destroy$))
          .subscribe((event: OverlayNotificationEventRef) => {
            this.hasNotification = false;
            if (status === 'APPROVED') {
              this.router.navigate([getBinCodeRouteUrl()], {
                queryParams: {
                  binCode: bin,
                  location: location,
                  binGroup: binGroupCode
                },
                queryParamsHandling: 'merge'
              });
            }
          });
      });
  }

  loadPermission = (element: string) =>
    this.elementPermission.loadPermission(element, this.permissions$);

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
