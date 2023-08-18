import {
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Event, NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { TEPRequestFacade } from '@poss-web/poss/tep/data-access-tep';
import { AuthFacade } from '@poss-web/shared/auth/data-access-auth';
import { CommonFacade } from '@poss-web/shared/common/data-access-common';
import { CustomerFacade } from '@poss-web/shared/customer/data-access-customer';
import { LocationSettingsFacade } from '@poss-web/shared/location-settings/data-access-location-settings';
import {
  CreateTepTypesEnum,
  CustomErrors,
  GetTepItemConfiguratonResponse,
  LocationSettingAttributesEnum,
  OverlayNotificationEventRef,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  RoleCodesEnum,
  RsoNameObject,
  SelectDropDownOption,
  StatusTypesEnum,
  SummaryBarEventRef,
  SummaryBarEventType,
  SummaryBarServiceAbstraction,
  SummaryBarType,
  TepItemPopUpServiceAbstraction,
  TepPaymentTypesEnum,
  TepTypesEnum,
  TransactionTypeEnum
} from '@poss-web/shared/models';
import { TepFacade } from '@poss-web/shared/tep/data-access-direct-tep';
import { ToolbarFacade } from '@poss-web/shared/toolbar/data-access-toolbar';
import { getRefundListingUrl } from '@poss-web/shared/util-site-routes';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-tep-view',
  templateUrl: './tep-view.component.html'
})
export class TepViewComponent implements OnInit, OnDestroy {
  searchEnableFlag$: any;
  destroy$: Subject<null> = new Subject<null>();
  tepPaymentTypesEnum = TepPaymentTypesEnum;
  createTepTypesEnum = CreateTepTypesEnum;
  createTepFormGroup: FormGroup;
  isLoading$: Observable<boolean>;
  currencyCode: string;
  refundDeductionAmt = 0;
  tepItemList: any[] = [];
  netRefundAmt = 0;
  tepDetails: any;
  viewSelectedTepItemData: any;
  isItemSaleable = false;
  response: GetTepItemConfiguratonResponse;
  paymentOptionTypes = ['Cash', 'Cheque', 'RTGS'];
  searchProductList$: any;
  isLoggedIn: boolean;
  @ViewChild('confirmRegularizeSuccessNotificationTemplate', { static: true })
  confirmRegularizeSuccessNotificationTemplate: TemplateRef<any>;
  rsoNamesList: SelectDropDownOption[] = [];
  roleCode = RoleCodesEnum.RSO;
  constructor(
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private translate: TranslateService,
    public locationSettingsFacade: LocationSettingsFacade,
    private router: Router,
    private tepItemPopUpServiceAbstraction: TepItemPopUpServiceAbstraction,
    private activatedRoute: ActivatedRoute,
    private authFacade: AuthFacade,
    private tepRequestFacade: TEPRequestFacade,
    private summaryBar: SummaryBarServiceAbstraction,
    private commonFacade: CommonFacade,
    private toolbarFacade: ToolbarFacade,
    public customerFacade: CustomerFacade,
    public tepFacade: TepFacade
  ) {
    this.createTepFormGroup = new FormGroup({
      fvtApprovalDate: new FormControl(null),
      fvtApprover: new FormControl(null),
      fvtReason: new FormControl(null),
      tepType: new FormControl(this.createTepTypesEnum?.REGULAR_TEP),
      tepPaymentType: new FormControl(this.tepPaymentTypesEnum.CN),
      selectedPaymentOptionForRefund: new FormControl(
        this.paymentOptionTypes[0]
      ),
      coinOfferDiscount: new FormControl(false)
    });
  }

  ngOnInit(): void {
    this.tepRequestFacade.resetValue();
    this.commonFacade.setTepTotalGrossWt(0);
    this.commonFacade.setTepTotalRefundAmt(0);
    this.commonFacade.setTepSelectedPaymentMethod(null);
    this.commonFacade.setTepTotalQty(0);
    this.commonFacade.setIsTEPApprovalValid(false);
    this.componentInit();
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
        const id = this.activatedRoute.snapshot.params['_id'];

        if (id) {
          this.tepRequestFacade.loadTepRefundDetails({
            id: id,
            txnType: TransactionTypeEnum.TEP
          });
        }
      });

    if (this.activatedRoute.snapshot.params['_id']) {
      this.tepRequestFacade.loadTepRefundDetails({
        id: this.activatedRoute.snapshot.params['_id'],
        txnType: TransactionTypeEnum.TEP
      });
    }
    this.tepFacade.LoadRsoList(this.roleCode);
    this.getRsoList();
    this.showSummaryBar();
  }
  showSuccessMessageNotification() {
    this.overlayNotification
      .show({
        type: OverlayNotificationType.CUSTOM,
        message: '',
        hasBackdrop: true,
        hasClose: true,
        template: this.confirmRegularizeSuccessNotificationTemplate
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: OverlayNotificationEventRef) => {
        this.router.navigate([getRefundListingUrl()], {
          state: { clearFilter: false }
        });
      });
  }
  showSummaryBar(): void {
    this.summaryBar
      .open(SummaryBarType.TEP_VIEW, {
        type: TepTypesEnum.REFUND_STATUS
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: SummaryBarEventRef) => {
        switch (event.eventType) {
          case SummaryBarEventType.TEP_REQUEST_APPROVAL: {
            this.tepRequestFacade.ApproveRefundDetails({
              id: this.tepDetails.id,
              txnType: TransactionTypeEnum.TEP,
              status: 'PENDING_FROM_RO'
            });
            break;
          }
        }
      });
  }

  viewTepItemValuation(event: any) {
    this.viewSelectedTepItemData = event;
    this.tepRequestFacade.loadTepItemConfiguration(
      event.variantCode,
      this.createTepFormGroup.get('tepType').value
    );
  }

  getTepItemResponse(tepItemDetails) {
    if (tepItemDetails) {
      const tepItemObject = {
        rowKey: tepItemDetails?.itemCode,
        cashMemoDetailsId: tepItemDetails?.cashMemoDetailsId
          ? tepItemDetails.cashMemoDetailsId
          : null,
        variantCode: tepItemDetails?.priceDetails?.itemCode,
        cmAvailable: tepItemDetails?.isCmAvailable,
        grossWt: tepItemDetails?.totalWeight,
        saleable: tepItemDetails?.isSaleable,
        discountRecovered: tepItemDetails?.priceDetails?.discountRecovered
          ? tepItemDetails.priceDetails?.discountRecovered
          : 0,
        deductionAmt: tepItemDetails?.priceDetails?.deductionAmount
          ? tepItemDetails?.priceDetails?.deductionAmount
          : 0,
        exchangeValue: tepItemDetails?.priceDetails?.finalValue,
        totalTax: tepItemDetails?.totalTax ? tepItemDetails?.totalTax : 0,
        productCode: tepItemDetails?.priceDetails?.productGroupCode,
        refundDeduction: tepItemDetails?.priceDetails?.refundDeductionAmount
          ? tepItemDetails.priceDetails?.refundDeductionAmount
          : 0,
        formGroup: new FormGroup({
          cmAvailable: new FormControl({
            value: tepItemDetails?.priceDetails?.iscashMemoAvailable,
            disabled: true
          }),
          saleable: new FormControl({
            value: tepItemDetails?.isSaleable,
            disabled: true
          })
        }),
        itemId: tepItemDetails?.itemId,
        stonesDetails: tepItemDetails?.priceDetails?.stones,
        stoneDetailsList: tepItemDetails?.priceDetails?.stones,
        stoneDetails: tepItemDetails?.priceDetails?.stones,
        discountDetails: tepItemDetails?.discountDetails,
        unitWeight: tepItemDetails?.totalWeight,
        unitValue: tepItemDetails?.totalValue,
        totalValue: tepItemDetails?.totalValue,
        totalWeight: tepItemDetails?.totalWeight,
        quantity: tepItemDetails?.priceDetails?.itemQuantity,
        viewPriceDetails: tepItemDetails?.priceDetails
      };

      if (
        tepItemDetails?.priceDetails &&
        tepItemDetails?.priceDetails?.refundDeductionAmount
      ) {
        this.refundDeductionAmt =
          this.refundDeductionAmt +
          (tepItemDetails?.priceDetails?.refundDeductionAmount
            ? tepItemDetails?.priceDetails?.refundDeductionAmount
            : 0);
      }

      this.commonFacade.setTepSelectedPaymentMethod('REFUND');
      this.commonFacade.setTepTotalRefundAmt(this.netRefundAmt);

      this.tepItemList.push(tepItemObject);
    }
  }

  componentInit() {
    this.isLoading$ = this.tepRequestFacade.getIsLoading();
    this.locationSettingsFacade
      .getLocationSetting(
        LocationSettingAttributesEnum.BASECURRENCY_CURRENCY_CODE
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(currencyCode => {
        this.currencyCode = currencyCode;
      });
    this.tepRequestFacade
      .getHasError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });

    this.tepRequestFacade
      .getOrderSendToRO()
      .pipe(takeUntil(this.destroy$))
      .subscribe(order => {
        if (order && order.status === 'PENDING_FROM_RO') {
          this.showSuccessMessageNotification();
        }
      });

    this.tepRequestFacade
      .getSelectedData()
      .pipe(takeUntil(this.destroy$))
      .subscribe(order => {
        if (order) {
          this.tepDetails = order;

          this.customerFacade.loadSelectedCustomer(
            String(order.headerData.data.customerId),
            false,
            false
          );
          this.commonFacade.setTepTotalGrossWt(
            order.headerData.data.totalWeight
          );

          this.netRefundAmt = order.headerData.data.totalRefundAmount
            ? order.headerData.data.totalRefundAmount
            : order.headerData.data.totalValue;

          if (order.status === StatusTypesEnum.APPROVAL_PENDING) {
            this.commonFacade.setIsTEPApprovalValid(true);
          }
          this.commonFacade.setTepTotalQty(order.headerData.data.totalQuantity);
          this.tepItemList = [];
          if (
            order.headerData.data.itemDetails &&
            order.headerData.data.itemDetails.length > 0
          ) {
            order.headerData.data.itemDetails.forEach(element => {
              this.getTepItemResponse(element);
            });
          }
        }
      });

    this.tepRequestFacade
      .getTepItemConfiguratonResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: GetTepItemConfiguratonResponse) => {
        if (response) {
          this.tepItemPopUpServiceAbstraction
            .open({
              ...this.response,
              itemCode: this.viewSelectedTepItemData.variantCode,
              rowKey: this.viewSelectedTepItemData.variantCode,
              coinOfferEnabled: false,
              isViewTepItemPriceDetails: true,
              viewSelectedTepItem: this.viewSelectedTepItemData,
              isTepRequestApprovedScenario: true,

              tepType: this.tepDetails.subTxnType,
              productGroupCode: this.viewSelectedTepItemData.productCode
            })
            .subscribe();
        }
      });
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.tepItemList = [];
    this.tepDetails = [];
    this.refundDeductionAmt = 0;
    this.commonFacade.setIsTEPApprovalValid(false);
    this.customerFacade.clearCustomerSearch();
    this.summaryBar.close();
  }
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

  getRsoList() {
    this.tepFacade
      .getRsoList()
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: RsoNameObject[]) => {
        this.rsoNamesList = response;
      });
  }
}
