import {
  BinHistroyResponse,
  HistoryFilterData,
  LocationSettingAttributesEnum,
  SharedBodEodFeatureServiceAbstraction,
  OverlayNotificationServiceAbstraction,
  BinDetailsRequestTypesEnum,
  CustomErrors,
  OverlayNotificationType,
  OverlayNotificationEventRef,
  BinDetailsStatusTypesEnum,
  Command,
  ShortcutServiceAbstraction
} from '@poss-web/shared/models';
import { AuthFacade } from '@poss-web/shared/auth/data-access-auth';
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy,
  AfterViewInit
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute, NavigationEnd, Event } from '@angular/router';
import { Observable, Subject, fromEvent } from 'rxjs';
import { takeUntil, debounceTime, filter } from 'rxjs/operators';

import { MatDialog } from '@angular/material/dialog';
import { CardListComponent } from '@poss-web/shared/components/ui-card-list';
import { InStockFacade } from '@poss-web/eposs/new-bin-request/data-access-bin-request';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import {
  getInStockHomeRouteUrl,
  getBinCreationRouteUrl,
  getBinCreationDefaultRouteUrl,
  get404Url
} from '@poss-web/shared/util-site-routes';
import {
  BinDetailsAdvancedFilterComponent,
  BinDetailsListingComponent
} from '@poss-web/eposs/new-bin-request/ui-bin-details-popup';
import { commonTranslateKeyMap } from '@poss-web/shared/util-adaptors';
import { FormControl } from '@angular/forms';
import * as moment from 'moment';
import { LocationSettingsFacade } from '@poss-web/shared/location-settings/data-access-location-settings';

export const searchListShortcutKey = 'BinDetailsComponent.MAIN_SEARCH';
export const cardListShortcutKey = 'BinDetailsComponent.CARD_LIST';
export const backShortcutKey = 'BinDetailsComponent.BACK';

export const filterShortcutKey = 'BinDetailsComponent.FILTER';

const tab1ShortcutKey = 'Common.TAB_1';
const componentName = 'BinDetailsComponent';
@Component({
  selector: 'poss-web-bin-details',
  templateUrl: './bin-details.component.html'
})
export class BinDetailsComponent implements OnInit, OnDestroy, AfterViewInit {
  pageSize = 4;
  initalPageSize = 8;
  historyListLoadedOnce = true;
  binListLoadedOnce = true;
  requestListLoadedOnce = true;
  isHistoryLoadedOnce = true;
  isLoading = false;
  hasNotification = false;
  destroy$: Subject<null> = new Subject<null>();
  dateFormat: string;
  @ViewChild('searchBox', { static: true, read: ElementRef })
  searchBox: ElementRef;
  @ViewChild(CardListComponent)
  cardListComponentRef: CardListComponent;
  searchFormControl = new FormControl();
  searchValue: string = null;
  historyFormData: any;
  currentDate = moment();
  binDetailsRequestType: BinDetailsRequestTypesEnum;
  requestType: BinDetailsRequestTypesEnum;
  binDetailsTypesEnumRef = BinDetailsRequestTypesEnum;
  historyTotalCount$: Observable<number>;
  history$: Observable<BinHistroyResponse[]>;
  isLoadingHistory: any;
  statusEnumRef = BinDetailsStatusTypesEnum;
  requestId: number;
  status: string;
  statusColor: string;
  isLoggedIn: boolean;
  noDataFoundMessage: any;
  currentFiscalYear: string;
  bussinessDay = null;
  constructor(
    private facade: InStockFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private translate: TranslateService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private shortcutService: ShortcutServiceAbstraction,
    private appSettingFacade: AppsettingFacade,
    private dialog: MatDialog,
    private authFacade: AuthFacade,
    private locationSettingsFacade: LocationSettingsFacade,
    private bodEodFeatureService: SharedBodEodFeatureServiceAbstraction
  ) {
    this.translate
      .get(['pw.entity.abManual'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((entity: any) => {
        this.translate
          .get(['pw.global.noDataFoundMessage'], {
            entityName: entity['pw.entity.abManual']
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe((translatedMsg: any) => {
            this.noDataFoundMessage =
              translatedMsg['pw.global.noDataFoundMessage'];
          });
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
        const requestType = this.activatedRoute.snapshot.params['type'];
        if (requestType !== BinDetailsRequestTypesEnum.HISTORY) {
          this.router.navigate([get404Url()]);
          return;
        } else {
          this.changeBinDetailsRequestType(requestType);
        }
      });

    if (
      this.router.getCurrentNavigation() &&
      this.router.getCurrentNavigation().extras.state
    ) {
      console.log('dont clear');
    } else {
      console.log('clear');
      this.facade.resetFilter(this.bussinessDay);
    }
  }

  ngOnInit(): void {
    this.facade.resetHistory();

    this.requestType = this.activatedRoute.snapshot.params['type'];

    this.changeBinDetailsRequestType(this.requestType);

    this.bodEodFeatureService
      .getLatestBusinessDate()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.bussinessDay = data;
          console.log('abc', this.bussinessDay);
          this.facade.loadHistoryFilterData({
            startDate: this.historyFormData?.startDate
              ? this.historyFormData.startDate
              : this.bussinessDay,
            endDate: this.historyFormData?.endDate
              ? this.historyFormData.endDate
              : this.bussinessDay,
            reqFiscalYear: this.historyFormData?.reqFiscalYear
              ? this.historyFormData?.reqFiscalYear
              : null,
            statuses: this.historyFormData?.statuses
              ? this.historyFormData.statuses
              : []
          });
          if (this.binDetailsRequestType === BinDetailsRequestTypesEnum.HISTORY)
            console.log('calling');
          this.loadRequests(0);
        }
      });

    this.componentInit();
  }

  ngAfterViewInit(): void {
    /**
     * Event Handler for search Box input with debounce
     */

    fromEvent(this.searchBox.nativeElement, 'input')
      .pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe((event: any) => {
        const historySearchValue = this.searchFormControl.value;
        this.facade.resetHistory();
        if (historySearchValue !== null || historySearchValue !== undefined) {
          this.searchValue = historySearchValue;
          this.loadRequests(0);
        } else if (
          historySearchValue === null ||
          historySearchValue !== undefined
        ) {
          this.clearSearch();
        }
      });
  }

  /**
   * to load and get data
   */
  componentInit(): void {
    this.locationSettingsFacade
      .getLocationSetting(LocationSettingAttributesEnum.COUNTRY_FISCAL_YEAR)
      .pipe(takeUntil(this.destroy$))
      .subscribe((fiscalYear: string) => {
        console.log('1234', fiscalYear);
        this.currentFiscalYear = fiscalYear;
      });
    this.shortcutService.componentNames = [componentName];
    this.shortcutService.commands
      .pipe(takeUntil(this.destroy$))
      .subscribe((command: Command) => {
        console.log(command, 'command subs in list');
        this.shortcutEventHandler(command);
      });

    this.historyTotalCount$ = this.facade.getBinHistoryCount();

    this.history$ = this.facade.getBinHistory();

    this.facade
      .getIsLoading()
      .pipe(takeUntil(this.destroy$))
      .subscribe((isLoading: boolean) => {
        this.isLoading = isLoading;
      });
    this.facade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });

    this.facade
      .getHistoryError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((er: CustomErrors) => {
        if (er) {
          this.errorHandler(er);
        }
      });

    this.facade
      .getHistoryLoading()
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
  }

  /**
   * Switch Between different types of request list
   * @param newInterBoutiqueTransferRequestType : new Request Type
   */
  changeBinDetailsRequestType(
    newBinRequestType: BinDetailsRequestTypesEnum
  ): void {
    if (this.binDetailsRequestType !== newBinRequestType) {
      this.binDetailsRequestType = newBinRequestType;
      this.clearSearch();

      if (
        this.binDetailsRequestType === BinDetailsRequestTypesEnum.HISTORY &&
        this.isHistoryLoadedOnce
      ) {
        this.loadRequests(0);
      }
      this.router.navigate([
        getBinCreationRouteUrl(getBinCreationDefaultRouteUrl())
      ]);
    }
  }

  advancedFilter(e) {
    this.overlayNotification.close();
    const emitData = {
      formData: this.historyFormData ? this.historyFormData : {},
      currentFiscalYear: this.currentFiscalYear,
      bussinessDay: moment(this.bussinessDay)
    };
    const dialogRef = this.dialog.open(BinDetailsAdvancedFilterComponent, {
      width: '30vw',
      data: emitData,
      disableClose: true
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (res) {
          this.facade.resetHistory();
          this.facade.loadHistoryFilterData(res);

          this.isHistoryLoadedOnce = true;
          this.historyFormData = res;
          this.loadRequests(0);
        }
      });
  }

  private shortcutEventHandler(command: Command): void {
    console.log(command, 'command');

    switch (command.name) {
      case searchListShortcutKey: {
        if (
          this.searchBox &&
          this.searchBox.nativeElement &&
          this.searchBox.nativeElement.focus
        ) {
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

      case filterShortcutKey: {
        this.advancedFilter(null);

        break;
      }

      case backShortcutKey: {
        this.dialog.closeAll();
        this.inStockUrl();
        break;
      }
      case tab1ShortcutKey: {
        this.changeBinDetailsRequestType(BinDetailsRequestTypesEnum.HISTORY);
        break;
      }
    }
  }

  loadRequests(pageIndex: number): void {
    if (!this.isLoading) {
      switch (this.binDetailsRequestType) {
        case BinDetailsRequestTypesEnum.BINS: {
          this.binListLoadedOnce = false;
          break;
        }
        case BinDetailsRequestTypesEnum.REQUESTS: {
          this.requestListLoadedOnce = false;
          break;
        }
        case BinDetailsRequestTypesEnum.HISTORY: {
          this.facade
            .getHistoryFilterData()
            .pipe(takeUntil(this.destroy$))
            .subscribe((filterData: HistoryFilterData) => {
              console.log(filterData);
              this.historyFormData = filterData;
            });

          this.facade.loadBinHistory({
            historyRequestBinDto: {
              binName: this.searchValue ? this.searchValue : null,
              binGroupCode: null,
              dateRangeType: 'CUSTOM',
              endDate: this.historyFormData.endDate
                ? this.historyFormData.endDate
                : moment(this.bussinessDay).endOf('day').valueOf(),

              reqFiscalYear: this.historyFormData?.reqFiscalYear
                ? this.historyFormData.reqFiscalYear
                : null,

              startDate: this.historyFormData.startDate
                ? this.historyFormData.startDate
                : moment(this.bussinessDay).startOf('day').valueOf(),
              statuses: this.historyFormData.statuses
                ? this.historyFormData.statuses
                : []
            },
            page: pageIndex,
            size: this.isHistoryLoadedOnce ? this.initalPageSize : this.pageSize
          });
          this.isHistoryLoadedOnce = false;
          break;
        }
      }
    }
  }

  clearSearch() {
    this.searchFormControl.reset();

    this.facade.resetHistory();
    this.searchValue = null;

    this.isHistoryLoadedOnce = true;
    this.loadRequests(0);
  }

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

  selected(data: BinHistroyResponse): void {
    const dialogRef = this.dialog.open(BinDetailsListingComponent, {
      width: '500px',

      data: data ? data : {}
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        //  console.log(result)
      });
  }

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

  inStockUrl() {
    this.router.navigate([getInStockHomeRouteUrl()]);
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
