import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  COMOrders,
  CustomErrors,
  CustomerServiceAbstraction,
  CUSTOMER_TYPE_ENUM,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  RequestTypeEnum,
  SEARCH_BY_ENUM,
  SubTransactionTypeEnum,
  ToolbarConfig,
  TransactionTypeEnum
} from '@poss-web/shared/models';
import { ToolbarFacade } from '@poss-web/shared/toolbar/data-access-toolbar';
import { CustomerOrderFacade } from '@poss-web/poss/customer-order/data-access-co';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { PageEvent } from '@angular/material/paginator';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { getCustomerOrderIdUrl } from '@poss-web/shared/util-site-routes';
import { ErrorEnums } from '@poss-web/shared/util-error';
import { CustomerFacade } from '@poss-web/shared/customer/data-access-customer';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'poss-web-fetch-customer-order',
  templateUrl: './fetch-customer-order.component.html',
  styleUrls: ['./fetch-customer-order.component.scss']
})
export class FetchCustomerOrderComponent implements OnInit, OnDestroy {
  toolbarData: ToolbarConfig = {
    txnType: TransactionTypeEnum.CO,
    subTxnType: SubTransactionTypeEnum.NEW_CO,
    loadMetalPrices: true,
    loadHoldPopup: true,
    loadOpenOrdersPopup: true
  };
  destroy$: Subject<null> = new Subject<null>();
  fetchedCOItems: COMOrders[] = [];
  initialPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };
  pageSizeOptions: {
    value: number;
    description: number;
  }[] = [];
  isLoading$: Observable<boolean>;
  orderForm: FormGroup;
  requestTypeEnumRef = RequestTypeEnum;
  orderType: RequestTypeEnum;
  selectedMobileNumber: string;
  createdCustomerStatus$: Observable<{
    customerId: string;
    customerType: string;
    ulpId: string;
  }>;

  constructor(
    private toolbarFacade: ToolbarFacade,
    private customerOrderFacade: CustomerOrderFacade,
    private appSettingFacade: AppsettingFacade,
    private formBuilder: FormBuilder,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    public router: Router,
    private alertPopupService: AlertPopupServiceAbstraction,
    private customerService: CustomerServiceAbstraction,
    private customerFacade: CustomerFacade,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.toolbarFacade.setToolbarConfig(this.toolbarData);
    this.componentInit();
    this.orderForm = this.formBuilder.group({
      orderType: new FormControl(RequestTypeEnum.EA)
    });
  }

  componentInit() {
    this.appSettingFacade
      .getPageSize()
      .pipe(takeUntil(this.destroy$))
      .subscribe(pageSize => {
        this.initialPageEvent.pageSize = pageSize;
      });

    this.appSettingFacade
      .getPageSizeOptions()
      .pipe(takeUntil(this.destroy$))
      .subscribe(pageSizeOptions => {
        this.pageSizeOptions = [];
        if (pageSizeOptions.length) {
          pageSizeOptions.forEach(option =>
            this.pageSizeOptions.push({
              value: option,
              description: option
            })
          );
        }
      });
    this.isLoading$ = this.customerOrderFacade.getIsLoading();
    this.createdCustomerStatus$ = this.customerFacade.getCreatedCustomerStatus();

    this.customerOrderFacade.resetFetchedCO();

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

    this.customerOrderFacade
      .getHasError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });

    this.customerOrderFacade
      .getFetchedCOItems()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.fetchedCOItems = data;
      });

    this.customerOrderFacade
      .getCreateCORes()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.router.navigate([getCustomerOrderIdUrl(data.id)]);
        }
      });
  }

  selectedOrders(event) {
    this.selectedMobileNumber = event[0]?.mobileNumber;
    let coNumberList = [];
    event.map(element => coNumberList.push(element.comOrderNumber));
    this.customerOrderFacade.createCO({
      txnType: TransactionTypeEnum.CO,
      subTxnType: SubTransactionTypeEnum.NEW_CO,
      requestDetails: {
        conumberList: coNumberList,
        fetchRequestType: RequestTypeEnum.EA
      }
    });
  }

  fetchCO() {
    if (this.orderForm.get(['orderType']).value === RequestTypeEnum.EA) {
      this.orderType = RequestTypeEnum.EA;
      this.customerOrderFacade.fetchCOItems({
        locationCode: 'URB',
        requestDetails: RequestTypeEnum.EA
      });
    } else if (
      this.orderForm.get(['orderType']).value === RequestTypeEnum.COM
    ) {
      this.orderType = RequestTypeEnum.COM;
      this.customerOrderFacade.fetchCOItems({
        locationCode: 'URB',
        requestDetails: RequestTypeEnum.COM
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

  /**
   * to display error message
   * @param error : error from api
   */
  errorHandler(error: CustomErrors) {
    if (error.code === ErrorEnums.ERR_COM_001) {
      this.showAlertPopUp('pw.fetchCustomerOrder.createCustomerErrorMsg');
    } else {
      this.overlayNotification
        .show({
          type: OverlayNotificationType.ERROR,
          hasClose: true, // optional
          error: error
        })
        .events.pipe(takeUntil(this.destroy$))
        .subscribe(() => {});
    }
  }

  showAlertPopUp(message: string) {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.INFO,
        message
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) {
          this.createCustomer(
            CUSTOMER_TYPE_ENUM.REGULAR,
            'CUSTOMER_ORDER',
            this.selectedMobileNumber
          );
        }
      });
  }

  createCustomer(customerType, searchType, searchValue) {
    const customerId = 'New';
    this.customerService.open({
      customerType,
      searchType,
      searchValue,
      customerId
    });
  }

  ngOnDestroy(): void {
    this.toolbarFacade.setToolbarConfig({
      loadMetalPrices: true,
      loadHoldPopup: false,
      loadOpenOrdersPopup: false
    });
    this.selectedMobileNumber = '';
    this.destroy$.next();
    this.destroy$.complete();
  }
}
