import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute, NavigationEnd, Event } from '@angular/router';
import { Observable, Subject, fromEvent } from 'rxjs';
import { takeUntil, debounceTime, filter } from 'rxjs/operators';
import { FormControl, FormGroup } from '@angular/forms';

import { InterBoutiqueTransferFacade } from '@poss-web/eposs/ibt/data-access-ibt';
import {
  getIBTCreateRequestRouteUrl,
  getInStockHomeRouteUrl,
  getInterBoutiqueTransferRouteUrl,
  get404Url
} from '@poss-web/shared/util-site-routes';
import { commonTranslateKeyMap } from '@poss-web/shared/util-adaptors';
import {
  InterBoutiqueTransferRequestTypesEnum,
  RequestList,
  CustomErrors,
  OverlayNotificationServiceAbstraction,
  IBThistoryHeaderPayload,
  InterBoutiqueTransferStatusTypesEnum,
  HistoryFilterData,
  Command,
  ShortcutServiceAbstraction,
  OverlayNotificationType,
  OverlayNotificationEventRef,
  LocationSettingAttributesEnum,
  SharedBodEodFeatureServiceAbstraction
} from '@poss-web/shared/models';
import { CardListComponent } from '@poss-web/shared/components/ui-card-list';
import * as moment from 'moment';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { MatDialog } from '@angular/material/dialog';
import { HistoryAdvancedSearchPopupComponent } from '@poss-web/eposs/ibt/ui-ibt-item-list';
import { fieldValidation } from '@poss-web/shared/util-field-validators';
import { PermissionFacade } from '@poss-web/shared/permission/data-access-permission';
import { ElementPermissionService } from '@poss-web/shared/permission/util-element-permissions';
import { PermissionService } from '@poss-web/shared/permission/ui-permission';
import { AuthFacade } from '@poss-web/shared/auth/data-access-auth';
import { LocationSettingsFacade } from '@poss-web/shared/location-settings/data-access-location-settings';
const searchShortcutKey = 'InterBoutiqueTransferComponent.MAIN_SEARCH';
const backShortcutKey = 'InterBoutiqueTransferComponent.BACK';
const cardListShortcutKey = 'InterBoutiqueTransferComponent.CARD_LIST';
const primaryButtonShortcutKey =
  'InterBoutiqueTransferComponent.PRIMARY_BUTTON';
const tab1ShortcutKey = 'Common.TAB_1';
const tab2ShortcutKey = 'Common.TAB_2';
const tab3ShortcutKey = 'Common.TAB_3';
const historyFilter = 'InterBoutiqueTransferComponent.FILTER';
const componentName = 'InterBoutiqueTransferComponent';

@Component({
  selector: 'poss-web-inter-boutique-transfer',
  templateUrl: './inter-boutique-transfer.component.html',
  styleUrls: ['./inter-boutique-transfer.component.scss'],
})
export class InterBoutiqueTransferComponent
  implements OnInit, OnDestroy, AfterViewInit {
  requestSentListCount: number;
  requestReceivedListCount: number;
  requestSentList$: Observable<RequestList[]>;
  requestReceivedList$: Observable<RequestList[]>;

  interBoutiqueTransferRequestType: InterBoutiqueTransferRequestTypesEnum;
  requestType: InterBoutiqueTransferRequestTypesEnum;
  interBoutiqueTransferRequestTypesEnumRef = InterBoutiqueTransferRequestTypesEnum;
  statusEnumRef = InterBoutiqueTransferStatusTypesEnum;
  requestId: number;
  status: string;
  statusColor: string;

  pageSize = 4;
  initalPageSize = 8;
  requestSentListLoadedOnce = true;
  requestReceivedListLoadedOnce = true;
  isLoading = false;
  hasNotification = false;
  @ViewChild('searchBox', { static: true })
  searchBox: ElementRef;
  @ViewChild('historySearch', { static: true })
  historySearch: ElementRef;
  @ViewChild(CardListComponent)
  cardListComponentRef: CardListComponent;
  searchFormControl = new FormControl();
  searchValue = 0;
  historySearchValue = 0;
  requestSentListCountDisplay: number;
  requestReceivedListCountDisplay: number;

  historyFormGroup: FormGroup;
  currentDate = moment();

  ibtHistoryTotalCount$: Observable<number>;
  ibtHistory$: Observable<IBThistoryHeaderPayload[]>;
  isLoadingHistory: boolean;
  isHistoryLoadedOnce = false;
  historyFormData: any;
  historyReqFormControl = new FormControl(
    InterBoutiqueTransferRequestTypesEnum.RECEIVE
  );
  destroy$: Subject<null> = new Subject<null>();
  dateFormat: string;
  type = InterBoutiqueTransferRequestTypesEnum.RECEIVE;
  btqReqType = InterBoutiqueTransferRequestTypesEnum.SENT;
  newbtqReqType: InterBoutiqueTransferRequestTypesEnum;
  permissions$: Observable<any[]>;
  noDataFoundMessage: string;

  IBT_REQUESTS_SENT_TAB = 'Inventory IBT - Requests Sent Tab';
  IBT_REQUESTS_RECEIVED_TAB = 'Inventory IBT - Requests Received Tab';
  IBT_HISTORY_TAB = 'Inventory IBT - History Tab';
  IBT_SEND_NEW_REQUEST_BUTTON = 'Inventory IBT - Send New Request Button';
  IBT_HISTORY_REQUESTS_SENT_RADIO_BUTTON =
    'Inventory IBT - History Requests Sent Radio Button';
  IBT_HISTORY_REQUESTS_RECEIVED_RADIO_BUTTON =
    'Inventory IBT - History Requests Received Radio Button';
  isFilterApplied = false;
  isLoggedIn: boolean;
  @ViewChild('tabRef') tabRef: ElementRef;
  currentFiscalYear: string;
  bussinessDay = null;
  constructor(
    private interBoutiqueTransferFacade: InterBoutiqueTransferFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private translate: TranslateService,
    private router: Router,
    private permissionfacade: PermissionFacade,
    private elementPermission: ElementPermissionService,
    private permissionService: PermissionService,
    private activatedRoute: ActivatedRoute,
    private shortcutService: ShortcutServiceAbstraction,
    private appSettingFacade: AppsettingFacade,
    private dialog: MatDialog,
    private authFacade: AuthFacade,
    private locationSettingsFacade: LocationSettingsFacade,
    private bodEodFeatureService: SharedBodEodFeatureServiceAbstraction
  ) {
    this.historyFormGroup = new FormGroup({
      selectRadioButton: new FormControl(this.type)
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
        const requestType = this.activatedRoute.snapshot.params['requestType'];
        if (
          requestType !== InterBoutiqueTransferRequestTypesEnum.SENT &&
          requestType !== InterBoutiqueTransferRequestTypesEnum.RECEIVED &&
          requestType !== InterBoutiqueTransferRequestTypesEnum.HISTORY
        ) {
          this.router.navigate([get404Url()]);
          return;
        } else {
          this.changeInterBoutiqueTransferRequestType(requestType);
        }
      });
    if (
      this.router.getCurrentNavigation() &&
      this.router.getCurrentNavigation().extras.state &&
      this.router.getCurrentNavigation().extras.state.clearFilter === false
    ) {
      console.log('dont clear');
    } else {
      console.log('clear');
      this.interBoutiqueTransferFacade.resetAdvanceFilter(this.bussinessDay);
    }
    this.translate
      .get(['pw.entity.requestsEntity'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((entity: any) => {
        this.translate
          .get(['pw.global.noDataFoundMessage'], {
            entityName: entity['pw.entity.requestsEntity']
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe((translatedMessages: any) => {
            this.noDataFoundMessage =
              translatedMessages['pw.global.noDataFoundMessage'];
          });
      });
  }

  ngOnInit(): void {
    this.permissions$ = this.permissionfacade.getPermissionforURL();
    this.interBoutiqueTransferFacade.loadStuddedProductGroups();
    this.interBoutiqueTransferFacade.resetLoadedHistory();
    this.interBoutiqueTransferFacade.resetRequestList();
    this.requestType = this.activatedRoute.snapshot.params['requestType'];
    this.bodEodFeatureService
      .getLatestBusinessDate()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.bussinessDay = data;
          this.interBoutiqueTransferFacade.loadHistoryFilterData({
            startDate: this.historyFormData?.startDate
              ? this.historyFormData?.startDate
              : this.bussinessDay,
            endDate: this.historyFormData?.endDate
              ? this.historyFormData.endDate
              : this.bussinessDay,
            reqFiscalYear: this.historyFormData?.reqFiscalYear
              ? this.historyFormData.reqFiscalYear
              : null,
            locationCode: this.historyFormData?.locationCode
              ? this.historyFormData?.locationCode
              : null,
            statuses: this.historyFormData?.statuses
              ? this.historyFormData?.statuses
              : [],
            dateType: this.historyFormData?.dateType
              ? this.historyFormData?.dateType
              : 'REQUESTDATE'
          });
          this.isHistoryLoadedOnce = false;
          if (InterBoutiqueTransferRequestTypesEnum.HISTORY) this.loadHistory();
        }
      });
    this.changeInterBoutiqueTransferRequestType(this.requestType);
    this.shortcutService.componentNames = [componentName];
    this.shortcutService.commands
      .pipe(takeUntil(this.destroy$))
      .subscribe(command => {
        this.shortcutEventHandler(command);
      });
    this.locationSettingsFacade
      .getLocationSetting(LocationSettingAttributesEnum.COUNTRY_FISCAL_YEAR)
      .pipe(takeUntil(this.destroy$))
      .subscribe((fiscalYear: string) => {
        this.currentFiscalYear = fiscalYear;
      });

    this.componentInit();
  }
  loadPermission = (element: string) =>
    this.elementPermission.loadPermission(element, this.permissions$);

  ngAfterViewInit(): void {
    /**
     * Event Handler for search Box input with debounce
     */
    fromEvent(this.searchBox.nativeElement, 'input')
      .pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe((event: any) => {
        const searchValue = this.searchFormControl.value;
        this.interBoutiqueTransferFacade.clearRequestSentList();
        this.interBoutiqueTransferFacade.clearRequestReceivedList();
        if (searchValue !== '') {
          if (this.validateSearch(searchValue)) {
            this.searchValue = searchValue;
            this.loadRequests(0);
          } else {
            this.interBoutiqueTransferFacade.clearRequestSentList();
            this.interBoutiqueTransferFacade.clearRequestReceivedList();
          }
        } else {
          this.clearSearch();
        }
      });
    fromEvent(this.historySearch.nativeElement, 'input')
      .pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe((event: any) => {
        const historySearchValue = this.searchFormControl.value;
        this.interBoutiqueTransferFacade.resetLoadedHistory();
        if (historySearchValue !== '') {
          if (this.validateSearch(historySearchValue)) {
            this.historySearchValue = historySearchValue;
            this.loadRequests(0);
          } else {
            this.interBoutiqueTransferFacade.resetLoadedHistory();
          }
        } else this.clearSearch();
      });
  }

  /**
   * to load and get data
   */
  componentInit(): void {
    this.requestSentList$ = this.interBoutiqueTransferFacade.getRequestSentList();
    this.requestReceivedList$ = this.interBoutiqueTransferFacade.getRequestReceivedList();
    this.elementPermission
      .loadPermission(this.IBT_REQUESTS_SENT_TAB, this.permissions$)
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
          this.interBoutiqueTransferFacade.loadRequestSentListCount({
            requestGroup: InterBoutiqueTransferRequestTypesEnum.SENT.toUpperCase(),
            searchValue: this.searchValue
          });
        }
      });
    this.elementPermission
      .loadPermission(this.IBT_REQUESTS_RECEIVED_TAB, this.permissions$)
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
          this.interBoutiqueTransferFacade.loadRequestReceivedListCount({
            requestGroup: InterBoutiqueTransferRequestTypesEnum.RECEIVED.toUpperCase(),
            searchValue: this.searchValue
          });
        }
      });

    this.interBoutiqueTransferFacade
      .getIsLoading()
      .pipe(takeUntil(this.destroy$))
      .subscribe((isLoading: boolean) => {
        this.isLoading = isLoading;
      });
    this.interBoutiqueTransferFacade
      .getHasError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });
    this.interBoutiqueTransferFacade
      .getRequestSentListCount()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: number) => {
        this.requestSentListCountDisplay = data;
      });
    this.interBoutiqueTransferFacade
      .getRequestReceivedListCount()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: number) => {
        this.requestReceivedListCountDisplay = data;
      });
    this.requestSentList$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: RequestList[]) => {
        this.requestSentListCount = 0;
        if (data.length !== 0) {
          this.requestSentListCount = data[0].totalElements;
        }
      });
    this.requestReceivedList$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: RequestList[]) => {
        this.requestReceivedListCount = 0;
        if (data.length !== 0) {
          this.requestReceivedListCount = data[0].totalElements;
        }
      });

    this.interBoutiqueTransferFacade
      .getIsIBTHistoryLoading()
      .pipe(takeUntil(this.destroy$))
      .subscribe((isLoading: boolean) => {
        this.isLoadingHistory = isLoading;
      });

    this.appSettingFacade
      .getDateFormat()
      .pipe(takeUntil(this.destroy$))
      .subscribe((format: string) => {
        this.dateFormat = format;
      });

    this.ibtHistoryTotalCount$ = this.interBoutiqueTransferFacade.getIBTHistoryCount();
    this.ibtHistory$ = this.interBoutiqueTransferFacade.getIBTHistory();
    console.log('general', this.isHistoryLoadedOnce);

    this.ibtHistory$
      .pipe(takeUntil(this.destroy$))
      .subscribe((history: IBThistoryHeaderPayload[]) => {
        if (history && history.length !== 0 && !this.isHistoryLoadedOnce) {
          this.isHistoryLoadedOnce = true;
        }
      });

    this.historyFormGroup
      .get('selectRadioButton')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(historyType => {
        console.log('aaa', historyType);
        if (
          historyType === this.interBoutiqueTransferRequestTypesEnumRef.RECEIVE
        ) {
          this.type = historyType;

          this.btqReqType = InterBoutiqueTransferRequestTypesEnum.SENT;
        } else {
          this.type = this.interBoutiqueTransferRequestTypesEnumRef.ISSUE;
          this.btqReqType = InterBoutiqueTransferRequestTypesEnum.RECEIVED;
        }

        console.log('radio3', this.type);
        console.log('radio-btq3', this.btqReqType);
        this.interBoutiqueTransferFacade.resetAdvanceFilter(this.bussinessDay);
        this.interBoutiqueTransferFacade.loadRadioHistoryType(this.type);
        this.loadHistory();
      });
  }

  inStockUrl() {
    this.router.navigate([getInStockHomeRouteUrl()]);
  }
  /**
   * Load Requests data based on the type of the request
   * @param pageIndex: page number index
   */
  loadRequests(pageIndex: number): void {
    if (!this.isLoading) {
      switch (this.interBoutiqueTransferRequestType) {
        case InterBoutiqueTransferRequestTypesEnum.SENT: {
          this.interBoutiqueTransferFacade.loadRequestSentList({
            requestGroup: InterBoutiqueTransferRequestTypesEnum.SENT.toUpperCase(),
            searchValue: this.searchValue,
            pageIndex: pageIndex,
            pageSize: this.requestSentListLoadedOnce
              ? this.initalPageSize
              : this.pageSize
          });
          this.requestSentListLoadedOnce = false;
          break;
        }
        case InterBoutiqueTransferRequestTypesEnum.RECEIVED: {
          this.interBoutiqueTransferFacade.loadRequestReceivedList({
            requestGroup: InterBoutiqueTransferRequestTypesEnum.RECEIVED.toUpperCase(),
            searchValue: this.searchValue,
            pageIndex: pageIndex,
            pageSize: this.requestReceivedListLoadedOnce
              ? this.initalPageSize
              : this.pageSize
          });
          this.requestReceivedListLoadedOnce = false;
          break;
        }
        case InterBoutiqueTransferRequestTypesEnum.HISTORY: {
          console.log('tpe-2', this.type);
          this.interBoutiqueTransferFacade
            .getHistoryFilterData()
            .pipe(takeUntil(this.destroy$))
            .subscribe((filterData: HistoryFilterData) => {
              this.filterCheck();
              this.historyFormData = filterData;
            });
          this.interBoutiqueTransferFacade
            .getRadioHistoryType()
            .pipe(takeUntil(this.destroy$))
            .subscribe(historyType => {
              console.log('htype', historyType);

              if (
                historyType === InterBoutiqueTransferRequestTypesEnum.ISSUE &&
                this.interBoutiqueTransferRequestType ===
                  InterBoutiqueTransferRequestTypesEnum.HISTORY
              ) {
                this.type = historyType;
                this.historyFormGroup.patchValue(
                  {
                    selectRadioButton: historyType
                  },
                  { emitEvent: false }
                );
                this.btqReqType =
                  InterBoutiqueTransferRequestTypesEnum.RECEIVED;
              } else if (
                historyType === InterBoutiqueTransferRequestTypesEnum.RECEIVE &&
                this.interBoutiqueTransferRequestType ===
                  InterBoutiqueTransferRequestTypesEnum.HISTORY
              ) {
                this.btqReqType = InterBoutiqueTransferRequestTypesEnum.SENT;
              }
              console.log('radio-type2', this.type);
              console.log('radio-btq2', this.btqReqType);
            });

          this.interBoutiqueTransferFacade.loadIBTHistory({
            historyData: {
              actionType: this.type,
              dateRangeType: 'CUSTOM',
              endDate: this.historyFormData?.endDate
                ? this.historyFormData.endDate
                : moment(this.bussinessDay).endOf('day').valueOf(),
              locationCode: this.historyFormData
                ? this.historyFormData.locationCode
                : null,
              reqDocNo: this.historySearchValue
                ? this.historySearchValue
                : this.historyFormData.reqDocNo
                ? this.historyFormData.reqDocNo
                : null,
              reqFiscalYear: this.historyFormData
                ? this.historyFormData.reqFiscalYear
                : null,
              startDate: this.historyFormData?.startDate
                ? this.historyFormData.startDate
                : moment(this.bussinessDay).startOf('day').valueOf(),
              statuses: this.historyFormData
                ? this.historyFormData.statuses
                : [],
              dateType: this.historyFormData
                ? this.historyFormData.dateType
                : null,

            },
            page: pageIndex,
            size: this.isHistoryLoadedOnce
              ? this.pageSize
              : this.initalPageSize,
            requestType: 'BTQ'
          });
          this.isHistoryLoadedOnce = false;
          break;
        }
      }
    }
  }

  loadHistory() {
    this.interBoutiqueTransferFacade.resetLoadedHistory();
    this.isHistoryLoadedOnce = false;
    if (!this.isHistoryLoadedOnce) {
      this.loadRequests(0);
    }
  }
  /**
   * Switch Between different types of request list
   * @param newInterBoutiqueTransferRequestType : new Request Type
   */
  changeInterBoutiqueTransferRequestType(
    newInterBoutiqueTransferRequestType: InterBoutiqueTransferRequestTypesEnum
  ): void {
    if (
      this.interBoutiqueTransferRequestType !==
      newInterBoutiqueTransferRequestType
    ) {
      this.interBoutiqueTransferRequestType = newInterBoutiqueTransferRequestType;
      this.clearSearch();
      if (
        (this.interBoutiqueTransferRequestType ===
          InterBoutiqueTransferRequestTypesEnum.SENT &&
          this.requestSentListLoadedOnce) ||
        (this.interBoutiqueTransferRequestType ===
          InterBoutiqueTransferRequestTypesEnum.RECEIVED &&
          this.requestReceivedListLoadedOnce)
      ) {
        console.log('inchangtype', this.isHistoryLoadedOnce);

        this.loadRequests(0);
      }
      if (
        this.interBoutiqueTransferRequestType ===
          InterBoutiqueTransferRequestTypesEnum.HISTORY &&
        this.isHistoryLoadedOnce
      ) {
        this.loadHistory();
      }
      this.router.navigate([
        getInterBoutiqueTransferRouteUrl(newInterBoutiqueTransferRequestType)
      ]);
    }
  }
  advancedFilter(e?) {
    const emitData = {
      formData: this.historyFormData ? this.historyFormData : {},
      currentFiscalYear: this.currentFiscalYear,
      bussinessDay: moment(this.bussinessDay)
    };
    this.overlayNotification.close();
    const dialogRef = this.dialog.open(HistoryAdvancedSearchPopupComponent, {
      width: '30vw',
      data: emitData,
      disableClose: true
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (res) {
          this.interBoutiqueTransferFacade.loadHistoryFilterData(res);
          this.historyFormData = res;
          this.loadHistory();
        }
      });
  }
  filterCheck() {
    if (
      !(
        (this.historyFormData?.startDate === null ||
          this.historyFormData?.startDate === '') &&
        (this.historyFormData?.endDate === null ||
          this.historyFormData?.endDate === '') &&
        (this.historyFormData?.locationCode === null ||
          this.historyFormData?.locationCode === '') &&
        (this.historyFormData?.reqFiscalYear === null ||
          this.historyFormData?.reqFiscalYear === '') &&
        (this.historyFormData?.statuses === null ||
          this.historyFormData?.statuses === '')&&
        (this.historyFormData?.dateType === null ||
          this.historyFormData?.dateType === '')
      )
    ) {
      this.isFilterApplied = true;
    }
  }

  /**
   * On click of request,request id is captured to load list of products in that request by routing
   * @param request: contains details of particular request
   */
  onRequestSelected(request: RequestList): void {
    this.requestId = request.id;
    this.router.navigate([this.requestId], {
      relativeTo: this.activatedRoute
    });
  }
  selected(data: any): void {
    this.router.navigate([this.btqReqType, data.id], {
      relativeTo: this.activatedRoute
    });
  }

  /**
   * to create a new request
   */
  createRequest(): void {
    this.router.navigate([getIBTCreateRequestRouteUrl()]);
  }

  /**
   * gets the status of the request and determines the color code and status description
   * @param status : status of the request
   */
  getStatus(status: string) {
    let key;
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

  clearSearch() {
    this.searchFormControl.reset();
    this.interBoutiqueTransferFacade.clearRequestSentList();
    this.interBoutiqueTransferFacade.clearRequestReceivedList();
    this.interBoutiqueTransferFacade.resetLoadedHistory();
    this.searchValue = 0;
    this.historySearchValue = 0;
    this.requestSentListLoadedOnce = true;
    this.requestReceivedListLoadedOnce = true;
    this.isHistoryLoadedOnce = false;
    this.loadRequests(0);
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
        case 'ibtSent': {
          this.changeInterBoutiqueTransferRequestType(
            InterBoutiqueTransferRequestTypesEnum.SENT
          );
          isTab = true;
          break;
        }
        case 'ibtReceived': {
          this.changeInterBoutiqueTransferRequestType(
            InterBoutiqueTransferRequestTypesEnum.RECEIVED
          );
          isTab = true;
          break;
        }
        case 'ibtHistory': {
          this.changeInterBoutiqueTransferRequestType(
            InterBoutiqueTransferRequestTypesEnum.HISTORY
          );
          isTab = true;
          break;
        }
      }
    }

    if (!isTab) {
      switch (command.name) {
        case searchShortcutKey: {
          if (
            this.interBoutiqueTransferRequestType ===
            InterBoutiqueTransferRequestTypesEnum.HISTORY
          ) {
            if (this.historySearch) {
              this.historySearch.nativeElement.focus();
            }
          } else {
            if (this.searchBox) {
              this.searchBox.nativeElement.focus();
            }
          }
          break;
        }

        case backShortcutKey: {
          this.inStockUrl();
          break;
        }

        case cardListShortcutKey: {
          if (this.cardListComponentRef) {
            this.cardListComponentRef.focus();
          }
          break;
        }

        case primaryButtonShortcutKey: {
          this.createRequest();
          break;
        }

        case historyFilter: {
          this.advancedFilter();
          break;
        }
      }
    }
  }

  /**
   * to display error message
   * @param error : error from api
   */
  errorHandler(error: CustomErrors) {
    this.overlayNotification
      .show({
        type: OverlayNotificationType.ERROR,
        hasClose: true, // optional
        error: error
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: OverlayNotificationEventRef) => {
        // Action based event
      });
  }

  /**
   * Method to check input field is number or not
   */
  numberCheck($event: KeyboardEvent) {
    const pattern = fieldValidation.numbersField.pattern;
    return pattern.test($event.key);
  }

  validateSearch(searchValue: string): boolean {
    return fieldValidation.requestNumberField.pattern.test(searchValue);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
