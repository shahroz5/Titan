import {
  Component,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { TranslateService } from '@ngx-translate/core';
import { CashMemoFacade } from '@poss-web/poss/cash-memo/data-access-cash-memo';
import { ProductFacade } from '@poss-web/poss/shared/product/data-access-product';
import { CommonFacade } from '@poss-web/shared/common/data-access-common';
import { CustomerFacade } from '@poss-web/shared/customer/data-access-customer';
import { CustomerSearchComponent } from '@poss-web/shared/customer/ui-customer-search';
import {
  AllowedTransactionTypeMap,
  CashMemoDetailsResponse,
  Command,
  CommomStateAttributeNameEnum,
  CommomStateAttributeTypeEnum,
  CustomerInfo,
  CustomErrors,
  CustomerServiceAbstraction,
  CustomerSummaryAbstraction,
  CUSTOMER_TYPE_ENUM,
  LocationSettingAttributesEnum,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  PaymentDetails,
  SEARCH_BY_ENUM,
  ShortcutServiceAbstraction,
  TransactionTypeEnum
} from '@poss-web/shared/models';
import { PaymentFacade } from '@poss-web/shared/payment/data-access-payment';
import { CommonBaseComponent } from '@poss-web/shared/util-common';
import { POSS_WEB_TIME_TRACKING_LOG } from '@poss-web/shared/util-config';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { ResetTcsPopupComponent } from '@poss-web/poss/shared/view-tcs/ui-view-tcs';
import { MatDialog } from '@angular/material/dialog';
import { LocationSettingsFacade } from '@poss-web/shared/location-settings/data-access-location-settings';
import { DiscountFacade } from '@poss-web/poss/shared/discount/data-access-discount';
import { UlpIdPopupComponent } from 'libs/shared/customer/ui-customer-search/src/lib/ulp-id-popup/ulp-id-popup.component';

const createButtonShortcutKey = 'CustomerSearchContainerComponent.CREATE';

@Component({
  selector: 'poss-web-customer-search-container',
  templateUrl: './customer-search-container.component.html',
  styleUrls: ['./customer-search-container.component.scss']
})
export class CustomerSearchContainerComponent
  extends CommonBaseComponent
  implements OnInit, OnDestroy {
  @ViewChild(CustomerSearchComponent)
  customerSearchComponentRef: CustomerSearchComponent;
  isCustomerSelected = false;
  @Input() issuePendingFoc = false;
  isSearchingCustomer$: Observable<boolean>;
  hasCustomerResult$: Observable<boolean>;
  selectedCustomer$: Observable<CustomerInfo>;
  createdCustomerStatus$: Observable<{
    customerId: string;
    customerType: string;
    ulpId: string;
  }>;
  updatedCustomerStatus$: Observable<boolean>;
  customerResult$: Observable<CustomerInfo>;
  oneTimeCustomer$: Observable<CustomerInfo[]>;
  destroy$: Subject<null> = new Subject<null>();
  enableClear = false;
  enableEdit = false;
  enableCreate = false;

  viewCashMemoDetails: CashMemoDetailsResponse;
  partailUpdateCashMemoDetails: CashMemoDetailsResponse;
  tcsToBeCollectedAtCM: number;
  paymentDetails: PaymentDetails[] = [];

  transactionType: TransactionTypeEnum;
  allowedTransactionTypes = new Map<
    CUSTOMER_TYPE_ENUM,
    TransactionTypeEnum[]
  >();
  allowedCustomerTypes: CUSTOMER_TYPE_ENUM[] = [];
  customerDetailsInBrand: any;

  createCustomerOptions: {
    value: CUSTOMER_TYPE_ENUM;
    translateKey: string;
  }[] = [
    {
      value: CUSTOMER_TYPE_ENUM.INTERNATIONAL,
      translateKey: 'pw.customerSearch.internationComerOption'
    },
    {
      value: CUSTOMER_TYPE_ENUM.INSTITUTIONAL,
      translateKey: 'pw.customerSearch.institutionalCustomerOption'
    },
    {
      value: CUSTOMER_TYPE_ENUM.ONE_TIME,
      translateKey: 'pw.customerSearch.oneTimeCustomerOption'
    }
  ];
  ghsPaymentsAdded;
  @ViewChild('matMenuTriggerRef') matMenuTriggerRef: MatMenuTrigger;
  numberOfProductsInGrid = 0;
  @Input() hideCustomerSearch = false;

  constructor(
    private customerFacade: CustomerFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private customerService: CustomerServiceAbstraction,
    private customerSummaryService1: CustomerSummaryAbstraction,
    public paymentFacade: PaymentFacade,
    private translate: TranslateService,
    private commonFacade: CommonFacade,
    private cashMemoFacade: CashMemoFacade,
    private shortcutService: ShortcutServiceAbstraction,
    @Inject(POSS_WEB_TIME_TRACKING_LOG) public timeTrackingLog: boolean,
    private productFacade: ProductFacade,
    private dialog: MatDialog,
    public locationSettingsFacade: LocationSettingsFacade,
    public discountFacade: DiscountFacade
  ) {
    super(timeTrackingLog);
  }

  ngOnInit() {
    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.GLOBAL,
        CommomStateAttributeNameEnum.TRANSACTION_CONFIG
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(config => {
        if (config && config.transactionType) {
          if (
            config.transactionType.subType === TransactionTypeEnum.GIFT_SALE
          ) {
            this.transactionType = config.transactionType.subType;
          } else {
            this.transactionType = config.transactionType.type;
          }
        } else {
          this.transactionType = null;
        }
        this.fetchAllowedCustomerTypes();
      });

    this.customerFacade
      .getAllowedTransactionTypes()
      .pipe(takeUntil(this.destroy$))
      .subscribe((allowedTransactionTypes: AllowedTransactionTypeMap) => {
        if (allowedTransactionTypes !== null) {
          this.allowedTransactionTypes = allowedTransactionTypes;
          this.fetchAllowedCustomerTypes();
        } else {
          this.customerFacade.loadAllowedTransactionTypes();
        }
      });

    this.customerFacade
      .getSearchError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        this.errorHandler(error);
      });

    this.customerFacade
      .getEnableClear()
      .pipe(takeUntil(this.destroy$))
      .subscribe((enableClear: boolean) => {
        this.enableClear = enableClear;
      });

    this.customerFacade
      .getEnableEdit()
      .pipe(takeUntil(this.destroy$))
      .subscribe((enableEdit: boolean) => {
        this.enableEdit = enableEdit;
      });

    this.customerFacade
      .getEnableCreate()
      .pipe(takeUntil(this.destroy$))
      .subscribe((enableCreate: boolean) => {
        this.enableCreate = enableCreate;
      });

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.CASHMEMO,
        CommomStateAttributeNameEnum.TCS_TO_BE_COLLECTED
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(tcsAmount => {
        this.tcsToBeCollectedAtCM = tcsAmount;
      });

    this.paymentFacade
      .getPaymentDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe(paymentDetails => {
        this.paymentDetails = paymentDetails;
      });

    this.locationSettingsFacade
      .getLocationSetting(LocationSettingAttributesEnum.FACTORY_BRAND_CODE)
      .pipe(takeUntil(this.destroy$))
      .subscribe(brandCode => {
        if (brandCode) {
          this.customerFacade.loadBrandDetails(brandCode);
        }
      });

    this.customerFacade
      .getBrandDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe(brandDetails => {
        if (brandDetails) {
          this.customerDetailsInBrand = brandDetails.customerDetails;
        }
      });

    this.isSearchingCustomer$ = this.customerFacade.getIsSearchingCustomer();
    this.hasCustomerResult$ = this.customerFacade.getHasCustomerResult();
    this.customerResult$ = this.customerFacade.getSearchCustomerResult();
    this.oneTimeCustomer$ = this.customerFacade.getSearchOneTimeCustomer();

    this.createdCustomerStatus$ = this.customerFacade.getCreatedCustomerStatus();
    this.updatedCustomerStatus$ = this.customerFacade.getUpdatedCustomerStatus();

    this.selectedCustomer$ = this.customerFacade.getSelectSelectedCustomer();

    this.selectedCustomer$
      .pipe(takeUntil(this.destroy$))
      .subscribe((customer: CustomerInfo) => {
        this.isCustomerSelected = !!customer;
        this.addStopTracking('pw.instrumentationMessges.selectCustomerMsg');
      });

    this.createdCustomerStatus$
      .pipe(takeUntil(this.destroy$))
      .subscribe(customerInfo => {
        if (customerInfo) {
          this.showSuccessNotification(
            customerInfo.customerId,
            customerInfo.customerType,
            customerInfo.ulpId
          );
        }
      });

    this.updatedCustomerStatus$
      .pipe(takeUntil(this.destroy$))
      .subscribe(status => {
        if (status) {
          this.updateNotification();
        }
      });
    this.cashMemoFacade
      .getViewCashMemoResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.partailUpdateCashMemoDetails = null;
        this.viewCashMemoDetails = data;
      });
    this.cashMemoFacade
      .getPartialUpdateCashMemoResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.viewCashMemoDetails = null;
        this.partailUpdateCashMemoDetails = data;
      });
    this.paymentFacade
      .getGhsPaymentDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.ghsPaymentsAdded = data;
      });
    this.productFacade
      .getItemDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.numberOfProductsInGrid = data.length;
      });

    this.shortcutService.commands
      .pipe(takeUntil(this.destroy$))
      .subscribe(command => {
        this.shortcutEventHandler(command);
      });
    this.customerResult$.pipe(takeUntil(this.destroy$)).subscribe(data => {
      this.addStopTracking('pw.instrumentationMessges.searchCustomerMsg');
    });
    this.oneTimeCustomer$.pipe(takeUntil(this.destroy$)).subscribe(data => {
      this.addStopTracking('pw.instrumentationMessges.searchCustomerMsg');
    });
  }

  fetchAllowedCustomerTypes() {
    let allowedCustomerTypes: CUSTOMER_TYPE_ENUM[] = [];
    if (this.transactionType) {
      allowedCustomerTypes = this.checkForCustomerType(
        CUSTOMER_TYPE_ENUM.REGULAR,
        []
      );
      allowedCustomerTypes = this.checkForCustomerType(
        CUSTOMER_TYPE_ENUM.INSTITUTIONAL,
        allowedCustomerTypes
      );
      allowedCustomerTypes = this.checkForCustomerType(
        CUSTOMER_TYPE_ENUM.INTERNATIONAL,
        allowedCustomerTypes
      );
      allowedCustomerTypes = this.checkForCustomerType(
        CUSTOMER_TYPE_ENUM.ONE_TIME,
        allowedCustomerTypes
      );
    }

    this.allowedCustomerTypes = allowedCustomerTypes;
  }

  checkForCustomerType(
    customerType: CUSTOMER_TYPE_ENUM,
    selectedCustomerTypes: CUSTOMER_TYPE_ENUM[]
  ): CUSTOMER_TYPE_ENUM[] {
    const customerTypes = selectedCustomerTypes;
    if (this.allowedTransactionTypes.has(customerType)) {
      const transactionTypes = this.allowedTransactionTypes.get(customerType);
      if (transactionTypes.includes(this.transactionType)) {
        customerTypes.push(customerType);
      }
    }
    return customerTypes;
  }

  focus() {
    if (this.customerSearchComponentRef)
      this.customerSearchComponentRef.focus();
  }

  search(data: { searchBy: SEARCH_BY_ENUM; searchValue: string }) {
    this.addStartTracking('pw.instrumentationMessges.searchCustomerMsg');
    if (data.searchBy === SEARCH_BY_ENUM.CUSTOMER_NAME) {
      this.customerFacade.searchOneTimeCustomer(
        data.searchBy,
        data.searchValue
      );
    } else {
      this.customerFacade.searchCustomer(data.searchBy, data.searchValue);
    }
  }

  clear() {
    this.customerFacade.clearCustomerSearch();
    this.customerFacade.clearSelectedCustomer();
    this.isCustomerSelected = false;
    this.overlayNotification.close();
  }

  resetTcsAmount() {
    this.dialog
      .open(ResetTcsPopupComponent, {
        width: '500px',
        height: 'auto'
      })
      .afterClosed()
      .subscribe(res => {
        if (res) {
          this.commonFacade.setTcsTcsAmountNeedToReset(true);
        }
      });
  }

  selectCustomer(customer: CustomerInfo) {
    this.addStartTracking('pw.instrumentationMessges.selectCustomerMsg');
    this.customerFacade.selectCustomer(customer);
  }

  selectInternationalCustomer(passportId: string) {
    this.customerFacade.selectInternationalCustomer(passportId);
  }

  selectedOneTimeCustomer(customerId: string) {
    this.customerFacade.selectOneTimeCustomer(customerId);
  }

  createCustomer({ customerType, searchType, searchValue }) {
    const customerId = 'New';
    this.customerService.open({
      customerType,
      searchType,
      searchValue,
      customerId
    });
  }

  createCustomerFromOption(customerType) {
    const customerId = 'New';
    this.customerService.open({
      customerType,
      customerId
    });
  }

  createCustomerMenu(customerType, customerId) {
    this.customerService.open({ customerType, customerId });
  }
  editCustomer(serviceConfig) {
    this.customerService.open(serviceConfig);
  }
  viewCustomer(customer: CustomerInfo) {
    this.customerSummaryService1.open(customer.customerId);
  }

  createOneTimeCustomer() {
    this.createCustomerMenu(CUSTOMER_TYPE_ENUM.ONE_TIME, 'New');
  }

  checkOneTimeCustomer(): boolean {
    return this.checkCustomerType(CUSTOMER_TYPE_ENUM.ONE_TIME);
  }

  checkInternationalCustomer(): boolean {
    return this.checkCustomerType(CUSTOMER_TYPE_ENUM.INTERNATIONAL);
  }

  checkInstituationalCustomer(): boolean {
    return this.checkCustomerType(CUSTOMER_TYPE_ENUM.INSTITUTIONAL);
  }

  checkCustomerType(value: CUSTOMER_TYPE_ENUM) {
    return this.allowedCustomerTypes.includes(value);
  }

  errorHandler(error: CustomErrors) {
    if (error) {
      this.overlayNotification.show({
        type: OverlayNotificationType.ERROR,
        hasClose: true,
        error: error
      });
    }
  }

  showSuccessNotification(
    customerId: string,
    customerType: string,
    encirlceId?: string
  ) {
    const regularkey = 'pw.customerCreation.isCreatedSuccessMsg';
    const otherkey = 'pw.customerCreation.isOtherCustomerCreatedSuccessMsg';

    this.translate
      .get([regularkey, otherkey], {
        customerType: customerType
      })
      .pipe(take(1))
      .subscribe((translatedMsg: any) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SUCCESS,
            hasBackdrop: false,
            hasClose: true,
            message:
              customerType === CUSTOMER_TYPE_ENUM.REGULAR
                ? translatedMsg[regularkey] + encirlceId
                : translatedMsg[otherkey] + customerId
          })
          .events.pipe(takeUntil(this.destroy$))
          .subscribe();
      });
  }

  updateNotification() {
    const updatedkey = 'pw.customerCreation.isUpdatedSuccessMsg';
    this.translate
      .get([updatedkey])
      .pipe(take(1))
      .subscribe((translatedMsg: any) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SUCCESS,
            hasBackdrop: false,
            hasClose: true,
            message: translatedMsg[updatedkey]
          })
          .events.pipe(takeUntil(this.destroy$))
          .subscribe();
      });
  }

  showDeleteError() {
    const deleteErrorkey = 'pw.customerSearch.deleteError';
    this.translate
      .get(deleteErrorkey)
      .pipe(take(1))
      .subscribe((translatedMsg: any) => {
        this.overlayNotification.show({
          type: OverlayNotificationType.SIMPLE,
          hasClose: true,
          message: translatedMsg
        });
      });
  }

  /**
   * method to handle shortcut commands
   * @param command: shortcut command
   */
  shortcutEventHandler(command: Command) {
    switch (command.name) {
      case createButtonShortcutKey: {
        if (this.matMenuTriggerRef) {
          this.matMenuTriggerRef.openMenu();
        }
        break;
      }
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.clear();
    this.customerFacade.clearAllowedTransactions();
  }
}
