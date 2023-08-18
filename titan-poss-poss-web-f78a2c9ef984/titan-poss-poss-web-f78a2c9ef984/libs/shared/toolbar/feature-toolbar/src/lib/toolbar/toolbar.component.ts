import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { TranslateService } from '@ngx-translate/core';
import { SharedBodEodFacade } from '@poss-web/shared/bod-eod/data-access-bod-eod';
import { CommonFacade } from '@poss-web/shared/common/data-access-common';
import { CustomerFacade } from '@poss-web/shared/customer/data-access-customer';
import { LocationSettingsFacade } from '@poss-web/shared/location-settings/data-access-location-settings';
import {
  Command,
  CommomStateAttributeNameEnum,
  CommomStateAttributeTypeEnum,
  CustomErrors,
  DataEvent,
  LocationSettingAttributesEnum,
  MetalPrice,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  ShortcutServiceAbstraction,
  StatusTypesEnum,
  ToolbarConfig,
  TransactionCount,
  TransactionDetails,
  TransactionTypeEnum
} from '@poss-web/shared/models';
import { ProfileDataFacade } from '@poss-web/shared/profile/data-access-profile';
import { ToolbarFacade } from '@poss-web/shared/toolbar/data-access-toolbar';
import { CommonBaseComponent } from '@poss-web/shared/util-common';
import {
  POSS_WEB_MATERIAL_PRICE_REFRESH_INTERVAL,
  POSS_WEB_TIME_TRACKING_LOG
} from '@poss-web/shared/util-config';
import {
  OnHoldComponent,
  OpenOrdersComponent
} from '@poss-web/shared/toolbar/ui-toolbar';
import * as moment from 'moment';
import { interval, Observable, Subject } from 'rxjs';
import { filter, take, takeUntil } from 'rxjs/operators';
import { PermissionFacade } from '@poss-web/shared/permission/data-access-permission';
import { ElementPermissionService } from '@poss-web/shared/permission/util-element-permissions';

const openTasksShortcutKey = 'ToolbarComponent.OPEN';
const onHoldShortcutKey = 'ToolbarComponent.HOLD';

@Component({
  selector: 'poss-web-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent
  extends CommonBaseComponent
  implements OnInit, OnDestroy {
  metals: MetalPrice[] = [];
  Previousmetals: MetalPrice[];
  destroy$: Subject<null> = new Subject<null>();
  isLoading = false;
  currencyCode: string;
  bussinessDay: number;
  onHoldResponse$: Observable<TransactionDetails[]>;
  openOrdersResponse$: Observable<TransactionDetails[]>;
  txnType: string;
  subTxnType: string;
  searchValue = '';
  pageIndex = 0;
  pageSize = 10;
  onHoldCount = 0;
  openOrdersCount = 0;

  @Output() selectedIdEmit = new EventEmitter<string>();
  @Output() selectedHoldIdEmit = new EventEmitter<string>();
  @ViewChild('openOrderTrigger') openOrderTrigger: MatMenuTrigger;
  @ViewChild('onHoldTrigger') onHoldTrigger: MatMenuTrigger;

  enableMetalPrice: boolean;
  enableOpenOrders: boolean;
  enableOnHold: boolean;
  isCorpUser: boolean;
  configHoldTime$: Observable<number>;
  permissions$: Observable<any[]>;
  transactionType: TransactionTypeEnum;
  setOpenFocus = false;
  setHoldFocus = false;
  @ViewChild(OpenOrdersComponent)
  private openOrdersComponent: OpenOrdersComponent;
  @ViewChild(OnHoldComponent)
  private onHoldComponent: OnHoldComponent;
  @Input() item = '';

  constructor(
    private toolbarFacade: ToolbarFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    public locationSettingsFacade: LocationSettingsFacade,
    @Inject(POSS_WEB_MATERIAL_PRICE_REFRESH_INTERVAL) public refreshInterval,
    public customerFacade: CustomerFacade,
    private commonFacade: CommonFacade,
    private profiledatafacade: ProfileDataFacade,
    private bodEodFacade: SharedBodEodFacade,
    @Inject(POSS_WEB_TIME_TRACKING_LOG) public timeTrackingLog: boolean,
    private translate: TranslateService,
    private shortcutService: ShortcutServiceAbstraction,
    private permissionfacade: PermissionFacade,
    private elementPermission: ElementPermissionService
  ) {
    super(timeTrackingLog);
    this.profiledatafacade
      .isCorpUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe(val1 => {
        this.isCorpUser = val1;
      });
  }

  ngOnInit() {
    this.permissions$ = this.permissionfacade.getPermissionforURL();
    this.bodEodFacade.loadLatestBusinessDay();
    this.bodEodFacade
      .getLatestBusinessDate()
      .pipe(
        filter(date => date !== -1),
        takeUntil(this.destroy$)
      )
      .subscribe((closedBusinessDate: number) => {
        console.log('BUSINESS DATE in Tool bar :', closedBusinessDate);
        if (closedBusinessDate) {
          this.bussinessDay = closedBusinessDate;
        }
      });

    if (!this.isCorpUser) {
      this.toolbarFacade.resetOnHold();
      this.toolbarFacade.resetOpenOrders();
      this.toolbarFacade.loadMetalPriceDetails();
      const source = interval(this.refreshInterval);
      source.subscribe(() => this.LoadMetals());

      this.componentInit();

      this.toolbarFacade
        .getToolbarConfig()
        .pipe(takeUntil(this.destroy$))
        .subscribe((data: ToolbarConfig) => {
          if (data) {
            this.enableMetalPrice = data.loadMetalPrices;
            this.enableOpenOrders = data.loadOpenOrdersPopup;
            this.enableOnHold = data.loadHoldPopup;
            this.txnType = data.txnType;
            this.subTxnType = data.subTxnType;
            this.loadTransactions();
          }
        });
    }

    this.shortcutService.commands
      .pipe(takeUntil(this.destroy$))
      .subscribe(command => {
        this.shortcutEventHandler(command);
      });
  }

  loadPermission = (element: string) =>
    this.elementPermission.loadPermission(element, this.permissions$);

  dateFormat(date) {
    return moment(Number(date));
  }

  LoadMetals() {
    this.toolbarFacade.loadMetalPriceDetails();
  }

  componentInit() {
    this.onHoldResponse$ = this.toolbarFacade.getOnHoldResponse();
    this.openOrdersResponse$ = this.toolbarFacade.getOpenOrdersResponse();
    this.configHoldTime$ = this.commonFacade.getCommonFacadeAttributes(
      CommomStateAttributeTypeEnum.GLOBAL,
      CommomStateAttributeNameEnum.CONFIG_HOLD_TIME
    );

    this.toolbarFacade
      .getOnHoldCount()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: TransactionCount[]) => {
        this.onHoldCount = 0;
        if (data.length !== 0) {
          data.forEach(element => {
            this.onHoldCount += element.count;
          });
        }
      });

    this.toolbarFacade
      .getOpenOrdersCount()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: TransactionCount[]) => {
        this.openOrdersCount = 0;
        if (data.length !== 0) {
          data.forEach(element => {
            this.openOrdersCount += element.count;
          });
        }
      });

    this.toolbarFacade
      .getMetalPriceDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe(priceDetails => {
        if (priceDetails) {
          this.metals = priceDetails;
        }
      });

    this.locationSettingsFacade
      .getLocationSetting(
        LocationSettingAttributesEnum.BASECURRENCY_CURRENCY_CODE
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(currencyCode => {
        this.currencyCode = currencyCode;
      });

    this.toolbarFacade
      .getPreviousMetalPriceDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe(priceDetail => {
        if (priceDetail) {
          this.Previousmetals = priceDetail;
        }
      });

    this.toolbarFacade
      .getHasError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });

    this.toolbarFacade
      .getIsLoading()
      .pipe(takeUntil(this.destroy$))
      .subscribe((isLoading: boolean) => {
        this.isLoading = isLoading;
      });

    this.openOrdersResponse$.pipe(takeUntil(this.destroy$)).subscribe(data => {
      if (data.length !== 0)
        this.addStopTracking(
          'pw.instrumentationMessges.searchOpenOrderFromPopupMsg'
        );
    });

    this.onHoldResponse$.pipe(takeUntil(this.destroy$)).subscribe(data => {
      if (data.length !== 0)
        this.addStopTracking(
          'pw.instrumentationMessges.searchHoldOrderFromPopupMsg'
        );
    });
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
      .subscribe();
  }

  searchItems(searchEvent: DataEvent) {
    if (searchEvent.type === StatusTypesEnum.OPEN)
      this.addStartTracking(
        'pw.instrumentationMessges.searchOpenOrderFromPopupMsg'
      );
    else if (searchEvent.type === StatusTypesEnum.HOLD)
      this.addStartTracking(
        'pw.instrumentationMessges.searchHoldOrderFromPopupMsg'
      );
    this.loadTransactionList(
      searchEvent.searchData,
      searchEvent.pageIndex,
      searchEvent.type
    );
  }

  clearSearch(clearEvent: DataEvent) {
    this.loadTransactionList(
      clearEvent.searchData,
      clearEvent.pageIndex,
      clearEvent.type
    );
  }

  paginate(pageEvent: DataEvent) {
    this.loadTransactionList(
      pageEvent.searchData,
      pageEvent.pageIndex,
      pageEvent.type
    );
  }

  loadTransactionList(searchValue: any, pageIndex: number, status: string) {
    if (status === StatusTypesEnum.OPEN) {
      this.toolbarFacade.loadOpenOrders({
        searchValue: searchValue,
        status: status,
        txnType: this.txnType,
        subTxnType: this.subTxnType,
        pageIndex: pageIndex,
        pageSize: this.pageSize
      });
    } else if (status === StatusTypesEnum.HOLD) {
      this.toolbarFacade.loadOnHold({
        searchValue: searchValue,
        status: status,
        txnType: this.txnType,
        subTxnType: this.subTxnType,
        pageIndex: pageIndex,
        pageSize: this.pageSize
      });
    }
  }

  selectedId(cashMemoId: string) {
    const openOrderTriggerElement: MatMenuTrigger = this.openOrderTrigger;
    if (this.enableOpenOrders) {
      openOrderTriggerElement.closeMenu();
    }
    const onHoldTriggerElement: MatMenuTrigger = this.onHoldTrigger;
    if (this.enableOnHold) {
      onHoldTriggerElement.closeMenu();
    }
    this.selectedIdEmit.emit(cashMemoId);
    this.selectedHoldIdEmit.emit(cashMemoId);
    this.commonFacade.setTransactionTD(cashMemoId);
  }

  loadTransactions() {
    if (this.enableOpenOrders) {
      this.toolbarFacade.loadOpenOrdersCount({
        status: StatusTypesEnum.OPEN,
        txnType: this.txnType,
        subTxnType: this.subTxnType
      });
      this.loadTransactionList(
        this.searchValue,
        this.pageIndex,
        StatusTypesEnum.OPEN
      );
    }
    if (this.enableOnHold) {
      this.toolbarFacade.loadOnHoldCount({
        status: StatusTypesEnum.HOLD,
        txnType: this.txnType,
        subTxnType: this.subTxnType
      });
      this.loadTransactionList(
        this.searchValue,
        this.pageIndex,
        StatusTypesEnum.HOLD
      );
    }
    if (this.enableMetalPrice) {
      this.LoadMetals();
    }
  }

  // Instrmentation
  addStartTracking(actionName) {
    this.translate
      .get(actionName)
      .pipe(take(1))
      .subscribe((translatedMsg: any) => {
        this.startTracking(translatedMsg);
      });
  }

  addStopTracking(actionName) {
    this.translate
      .get(actionName)
      .pipe(take(1))
      .subscribe((translatedMsg: any) => {
        this.stopTracking(translatedMsg);
      });
  }
  /**
   * method to handle shortcut commands
   * @param command: shortcut command
   */
  shortcutEventHandler(command: Command) {
    setTimeout(() => {
      this.resetFocus();
    }, 10);
    switch (command.name) {
      case openTasksShortcutKey: {
        const openOrderTriggerElement: MatMenuTrigger = this.openOrderTrigger;
        openOrderTriggerElement.openMenu();
        this.setOpenFocus = true;
        break;
      }
      case onHoldShortcutKey: {
        const onHoldTriggerElement: MatMenuTrigger = this.onHoldTrigger;
        onHoldTriggerElement.openMenu();
        this.setHoldFocus = true;
        break;
      }
    }
  }

  resetFocus() {
    this.setOpenFocus = false;
    this.setHoldFocus = false;
  }

  resetOpenOrderData(): void {
    this.openOrdersComponent.clearSearch();
    this.toolbarFacade.loadOpenOrdersCount({
      status: StatusTypesEnum.OPEN,
      txnType: this.txnType,
      subTxnType: this.subTxnType
    });
  }

  resetHoldOrderData(): void {
    this.onHoldComponent.clearSearch();
    this.toolbarFacade.loadOnHoldCount({
      status: StatusTypesEnum.HOLD,
      txnType: this.txnType,
      subTxnType: this.subTxnType
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.toolbarFacade.resetValues();
  }
}
