import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { CurrencySymbolService } from '@poss-web/shared/components/ui-formatters';
import { TranslateService } from '@ngx-translate/core';
import { LocationSettingsFacade } from '@poss-web/shared/location-settings/data-access-location-settings';
import { PaymentFacade } from '@poss-web/shared/payment/data-access-payment';
import { CommonFacade } from '@poss-web/shared/common/data-access-common';
import {
  SummaryBarServiceAbstraction,
  TransactionTypeEnum,
  SubTransactionTypeEnum,
  OverlayNotificationServiceAbstraction,
  PartialUpdateAdvanceRequestPayload,
  CtAdvanceTabsEnum,
  SummaryBarEventRef,
  SummaryBarEventType,
  OverlayNotificationType,
  OverlayNotificationEventRef,
  OverlayNotificationEventType,
  PaymentDetails,
  RoleCodesEnum,
  CustomErrors,
  UpdateOrderDetails,
  StatusTypesEnum,
  CashMemoDetailsResponse,
  SummaryBarType,
  ToolbarConfig,
  LocationSettingAttributesEnum,
  printTypesEnum,
  printDocTypeEnum,
  printFileTypeEnum,
  printTransactionTypesEnum,
  PrintingServiceAbstraction,
  InvoiceDeliveryTypes,
  PostTransactionConfirmationActionsServiceAbstraction,
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  PanCardPopupAbstraction,
  CUSTOMER_TYPE_ENUM,
  RsoNameObject,
  PanFormVerifyPopupServiceAbstraction,
  CustomerServiceAbstraction,
  Customers
} from '@poss-web/shared/models';
// import { PrintingService } from '@poss-web/shared/printing/feature-printing';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { FormGroup, FormControl } from '@angular/forms';
import { CustomerFacade } from '@poss-web/shared/customer/data-access-customer';
import { filter, take, takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { CtAcceptAdvanceFacade } from '@poss-web/poss/ct-advance/data-access-ct-accept-advance';
import {
  OrderConfirmationFacade,
  OrderService
} from '@poss-web/shared/order-confirmation/data-access-order-confirmation';
import { ToolbarFacade } from '@poss-web/shared/toolbar/data-access-toolbar';
import { Router, ActivatedRoute, NavigationEnd, Event } from '@angular/router';
import { AuthFacade } from '@poss-web/shared/auth/data-access-auth';
import { ErrorEnums } from '@poss-web/shared/util-error';
import { getAcceptAdvanceUrl } from '@poss-web/shared/util-site-routes';
import { ValidateCustomerService } from '@poss-web/shared/customer/feature-customer-create';

@Component({
  selector: 'poss-web-accept-advance',
  templateUrl: './accept-advance.component.html',
  styleUrls: ['./accept-advance.component.scss']
})
export class AcceptAdvanceComponent implements OnInit, OnDestroy {
  @ViewChild('acceptAdvanceSuccessNotificationTemplate', { static: true })
  private acceptAdvanceSuccessNotificationTemplate: TemplateRef<any>;
  baseCurrencyCode = '';
  ctAcceptAdvanceFormGroup: FormGroup;
  customerId: string;
  customer: Customers;
  transactionId: string;
  selectedRsoName: { value: string; description: string };
  rsoNamesList: { value: string; description: string }[] = [];
  creditNoteNumber: any;
  selectCustomerAlertMessage = '';
  selectRsoNameAlertMessage = '';
  addRemarksAlertMessage = '';
  invalidRemarksAlertMessage = '';
  reversePaymentAlertMessage = '';
  technicalIssueInTransactionIdAlertMessage = '';
  paymentDetailsList = [];
  clearSelectedRsoName = false;
  roleCode = RoleCodesEnum.RSO;
  isOrderConfirmationLoading$: Observable<boolean>;
  isAcceptAdvanceLoading$: Observable<boolean>;
  paidValue = 0;
  paymentDetails: PaymentDetails[];
  isPaymentForEGHS = false;
  destroy$: Subject<null> = new Subject<null>();
  summaryBarRemarks$ = new Subject<string>();
  isOpenTask = false;
  selectedRso;
  status: StatusTypesEnum;
  isLoggedIn: boolean;
  transactionTypeEnum = TransactionTypeEnum;
  subTransactionTypeEnum = SubTransactionTypeEnum;
  isTransactionSuccess = false;
  printErrorText: string;
  docNo: number;
  @Output() orderNumber = new EventEmitter<{
    orderNo: number;
    status: StatusTypesEnum;
  }>();
  maxAllowedAmount: number;
  panMandatoryForAdvance: boolean;
  customerPAN: any;
  alertMsgForPan: any;
  customerType: any;
  form60Submitted: boolean;
  gstNumber: string;
  idProof: string;
  isProfileMatched: boolean;

  constructor(
    public currencySymbolService: CurrencySymbolService,
    public translate: TranslateService,
    private locationSettingsFacade: LocationSettingsFacade,
    private paymentFacade: PaymentFacade,
    private commonFacade: CommonFacade,
    private customerFacade: CustomerFacade,
    private ctAcceptAdvanceFacade: CtAcceptAdvanceFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private summaryBar: SummaryBarServiceAbstraction,
    private fieldValidatorsService: FieldValidatorsService,
    public printingService: PrintingServiceAbstraction,
    private orderService: OrderService,
    private orderConfirmationFacade: OrderConfirmationFacade,
    private toolbarFacade: ToolbarFacade,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authFacade: AuthFacade,
    private panFormVerifyPopupService: PanFormVerifyPopupServiceAbstraction,
    private postConfirmationActions: PostTransactionConfirmationActionsServiceAbstraction,
    private alertPopUpService: AlertPopupServiceAbstraction,
    private panCardServiceAbstraction: PanCardPopupAbstraction,
    private customerService: CustomerServiceAbstraction,
    private validateCustomerService: ValidateCustomerService
  ) {
    this.ctAcceptAdvanceFormGroup = new FormGroup({
      amount: new FormControl('', [
        this.fieldValidatorsService.requiredField('Amount')
      ]),
      paymentMadeForEGHS: new FormControl(false)
    });

    this.translate
      .get([
        'pw.otherReceiptsIssues.printError',
        'pw.regularCashMemo.alertMsgForPan'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.printErrorText =
          translatedMessages['pw.otherReceiptsIssues.printError'];
        this.alertMsgForPan =
          translatedMessages['pw.regularCashMemo.alertMsgForPan'];
      });
  }

  ngOnInit(): void {
    const toolbarData: ToolbarConfig = {
      txnType: TransactionTypeEnum.ADV,
      subTxnType: SubTransactionTypeEnum.NON_FROZEN_RATES,
      loadMetalPrices: true,
      loadHoldPopup: false,
      loadOpenOrdersPopup: true
    };
    this.toolbarFacade.setToolbarConfig(toolbarData);
    this.getTranslatedAlertMessages();
    this.locationSettingsFacade
      .getLocationSetting(
        LocationSettingAttributesEnum.BASECURRENCY_CURRENCY_CODE
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((currencyCode: string) => {
        this.baseCurrencyCode = currencyCode;
      });

    // this.commonFacade.setTransactionConfig({
    //   isPaymentEditable: true,
    //   transactionType: {
    //     type: TransactionTypeEnum.ADV,
    //     subType: SubTransactionTypeEnum.NON_FROZEN_RATES
    //   }
    // });
    this.commonFacade.setTransactionConfig({
      isPaymentEditable: true,
      transactionType: {
        type: TransactionTypeEnum.ADV,
        subType: SubTransactionTypeEnum.NON_FROZEN_RATES
      }
    });

    this.printingService
      .getPrintError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });

    this.ctAcceptAdvanceFacade.loadRsoDetails(this.roleCode);
    this.ctAcceptAdvanceFacade
      .getRsoDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe((rsoDetails: RsoNameObject[]) => {
        this.rsoNamesList = rsoDetails;
        // if (rsoDetails && rsoDetails.length > 0) {
        //   this.rsoNamesList = rsoDetails;
        //   this.rsoNamesList = rsoDetails.map((rsoName: string) => {
        //     return { value: rsoName, description: rsoName };
        //   });
        // } else {
        //   this.rsoNamesList = [];
        // }
      });
    this.getCustomerResponse();
    this.getInitiateAdvanceResponse();
    const id = this.activatedRoute.snapshot.params['_id'];
    const isAcceptAdvanceTabSelected = this.router.url.includes(
      'accept-advance'
    );
    if (id !== 'new' && isAcceptAdvanceTabSelected) {
      this.ctAcceptAdvanceFacade.getViewAdvanceDetails(id);
      this.commonFacade.setTransactionTD(id);
    } else {
      this.isOpenTask = false;
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
        const idRef = this.activatedRoute.snapshot.params['_id'];
        const isAcceptAdvanceTabSelectedRef = this.router.url.includes(
          'accept-advance'
        );
        if (idRef !== 'new' && isAcceptAdvanceTabSelectedRef) {
          this.ctAcceptAdvanceFacade.getViewAdvanceDetails(idRef);
          // this.commonFacade.setTransactionTD(id);
          this.commonFacade.setTransactionTD(idRef);
        } else {
          this.isOpenTask = false;
        }
      });
    this.ctAcceptAdvanceFacade
      .getViewAdvanceResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe((viewAdvanceResponse: any) => {
        if (viewAdvanceResponse) {
          this.isOpenTask = true;
          this.status = StatusTypesEnum.OPEN;
          this.orderNumber.emit({
            orderNo: viewAdvanceResponse.docNo,
            status: this.status
          });
          this.ctAcceptAdvanceFacade.setOrderNumber(
            viewAdvanceResponse.docNo,
            this.status
          );
          this.commonFacade.setAcceptAdvanceOrderNumber({
            orderNo: viewAdvanceResponse.docNo,
            status: this.status
          });
          this.transactionId = viewAdvanceResponse.id;
          this.customerId = viewAdvanceResponse.customerId;
          this.ctAcceptAdvanceFormGroup
            .get('amount')
            .setValue(viewAdvanceResponse.finalValue);
          this.ctAcceptAdvanceFormGroup.updateValueAndValidity();
          this.onFocusOut();

          // const rsoNames = this.rsoNamesList.map(
          //   (rsoNameObj: { value: string; description: string }) => {
          //     return rsoNameObj.value;
          //   }
          // );
          if (viewAdvanceResponse.employeeCode) {
            this.selectedRso = this.getRsoObjFromCode(
              viewAdvanceResponse.employeeCode
            );
            this.setSelectedRSOName(this.selectedRso);
          }

          if (
            viewAdvanceResponse.advanceDetails &&
            viewAdvanceResponse.advanceDetails.data &&
            viewAdvanceResponse.advanceDetails.data.isPaymentForEGHS
          ) {
            this.ctAcceptAdvanceFormGroup
              .get('paymentMadeForEGHS')
              .setValue(
                viewAdvanceResponse.advanceDetails.data.isPaymentForEGHS
              );
            this.ctAcceptAdvanceFormGroup.updateValueAndValidity();
          }
          if (viewAdvanceResponse.status === StatusTypesEnum.OPEN) {
            // this.updatePrice();
            this.summaryBarRemarks$.next(viewAdvanceResponse.remarks);
            if (viewAdvanceResponse.customerId) {
              this.customerFacade.loadSelectedCustomer(
                String(viewAdvanceResponse.customerId)
              );
            }
          }
        } else {
          this.isOpenTask = false;
        }
      });
    this.ctAcceptAdvanceFacade
      .getSelectedRsoName()
      .pipe(takeUntil(this.destroy$))
      .subscribe((selectedRsoName: { value: string; description: string }) => {
        if (!selectedRsoName) {
          this.clearSelectedRsoName = true;
        }
        this.selectedRsoName = selectedRsoName;
      });
    this.showSummaryBar();
    this.paymentFacade
      .getPaymentDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe((paymentDetails: PaymentDetails[]) => {
        this.paymentDetailsList = paymentDetails;
      });
    // this.ctAcceptAdvanceFacade
    //   .getUpdateAdvanceResponse()
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe((response: UpdateAdvanceTransactionResponse) => {
    //     if (response) {
    //       if (response.docNo) {
    //         this.creditNoteNumber = response.cndocNos[0];
    //       }
    //       this.showAcceptAdvanceSuccessNotification();
    //     }
    //   });
    this.ctAcceptAdvanceFacade
      .getPartiallyUpdateAdvanceResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe(response => {
        if (response) {
          // this.commonFacade.setTransactionTD(this.transactionId);
          this.commonFacade.setTransactionTD(this.transactionId);
          this.loadOpenValues();
          if (
            this.ctAcceptAdvanceFormGroup.get('amount').value &&
            this.ctAcceptAdvanceFormGroup.get('amount').value > 0
          ) {
            // this.commonFacade.setTransactionTotalAmount(
            //   this.ctAcceptAdvanceFormGroup.get('amount').value
            // );
            this.commonFacade.setTransactionTotalAmount(
              this.ctAcceptAdvanceFormGroup.get('amount').value
            );
          }
        }
      });
    this.paymentFacade
      .getTotalPaidAmount()
      .pipe(takeUntil(this.destroy$))
      .subscribe(totalValue => {
        this.paidValue = totalValue;
      });
    this.paymentFacade
      .getPaymentDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe((payments: PaymentDetails[]) => {
        this.paymentDetails = payments;
      });
    this.ctAcceptAdvanceFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error && error.code) {
          this.errorHandler(error);
        }
      });
    this.orderConfirmationFacade
      .getHasError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error && error.code) {
          this.errorHandler(error);
        }
      });
    this.orderConfirmationFacade
      .confirmCashMemoResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: CashMemoDetailsResponse) => {
        this.orderNumber.emit({
          orderNo: 0,
          status: StatusTypesEnum.CONFIRMED
        });
        this.ctAcceptAdvanceFacade.setOrderNumber(0, StatusTypesEnum.CONFIRMED);
        this.commonFacade.setAcceptAdvanceOrderNumber({
          orderNo: 0,
          status: StatusTypesEnum.CONFIRMED
        });
        this.loadOpenValues();
        if (response && response.docNo) {
          this.docNo = response.docNo;
          // if (response.cndocNos && response.cndocNos.length > 0)
          //   this.creditNoteNumber = response.cndocNos.join();
          if (
            response.cndocNos &&
            Object.values(response.cndocNos).length > 0
          ) {
            this.creditNoteNumber = Object.values(response.cndocNos)[0];
          }
          this.isTransactionSuccess = true;
          this.showAcceptAdvanceSuccessNotification();
          this.isOpenTask = false;
        }
      });

    this.getDeleteTepTransactionResponse();

    this.isOrderConfirmationLoading$ = this.orderConfirmationFacade.getIsLoading();
    this.isAcceptAdvanceLoading$ = this.ctAcceptAdvanceFacade.getIsLoading();
    this.ctAcceptAdvanceFormGroup
      .get('paymentMadeForEGHS')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value: boolean) => {
        this.isPaymentForEGHS = value;
        if (this.transactionId) {
          const partiallyUpdateRequestPayload: PartialUpdateAdvanceRequestPayload = {
            isPaymentForEGHS: this.isPaymentForEGHS
          };
          this.ctAcceptAdvanceFacade.partiallyUpdateAdvance(
            this.transactionId,
            partiallyUpdateRequestPayload
          );
        }
      });
    this.printingService
      .getIsMailSent()
      .pipe(takeUntil(this.destroy$))
      .subscribe((isMailSent: boolean) => {
        if (isMailSent) {
          this.showAlertPopUp('pw.regularCashMemo.mailSentMsg');
        }
      });

    this.printingService
      .getIsPrintingSuccess()
      .pipe(takeUntil(this.destroy$))
      .subscribe((isPrintingSuccess: boolean) => {
        if (isPrintingSuccess) {
          this.showAlertPopUp('pw.regularCashMemo.printingSuccessMessage');
        }
      });

    this.customerFacade
      .getBrandDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe(brandDetail => {
        if (brandDetail) {
          this.maxAllowedAmount =
            brandDetail?.panCardDetails?.data?.configurationAmountForAcceptAdvance;
          this.panMandatoryForAdvance =
            brandDetail?.panCardDetails?.data?.isPanCardMandatoryforAcceptAdvance;
        }
      });
  }

  /**
   * to display error message
   * @param error : error from api
   */

  errorHandler(error: CustomErrors) {
    if (error.code === ErrorEnums.ERR_QZ_TRAY) {
      this.printError(error.message);
    } else if (error.code === ErrorEnums.ERR_CUST_001) {
      this.customerService.open({
        customerType: this.customerType,
        customerId: this.customerId
      });
    } else {
      this.overlayNotification
        .show({
          type: OverlayNotificationType.ERROR,
          hasClose: true, // optional
          error: error,
          hasBackdrop: true
        })
        .events.pipe(takeUntil(this.destroy$))
        .subscribe((event: OverlayNotificationEventRef) => {
          if (this.isTransactionSuccess) {
            this.showAcceptAdvanceSuccessNotification();
          }
        });
    }
  }

  printError(message: string) {
    this.overlayNotification
      .show({
        type: OverlayNotificationType.TIMER,
        message: message,
        hasClose: false
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: OverlayNotificationEventRef) => {
        this.showAcceptAdvanceSuccessNotification(); //call your respective success overlay method
      });
  }

  getCustomerResponse() {
    this.customerFacade
      .getSelectSelectedCustomer()
      .pipe(takeUntil(this.destroy$))
      .subscribe(customer => {
        if (customer) {
          this.customer = customer;
        }
        if (!this.isOpenTask) {
          if (customer) {
            const tempCustomerId = this.customerId;
            this.customerId = customer.customerId;
            this.customer = customer;
            this.customerPAN = customer.custTaxNo;
            this.customerType = customer.customerType;
            this.form60Submitted =
              customer.customerDetails.data.form60AndIdProofSubmitted;
            this.gstNumber = customer.instiTaxNo;
            this.idProof = customer.customerDetails.data.idProof;
            if (this.customerId !== null && !this.transactionId) {
              this.ctAcceptAdvanceFacade.initiateAdvance();
            } else {
              if (tempCustomerId !== this.customerId && this.transactionId) {
                let requestBody = {
                  customerId: Number(this.customerId)
                };
                this.ctAcceptAdvanceFacade.partiallyUpdateAdvance(
                  this.transactionId,
                  requestBody
                );
              }
            }
          } else {
            this.customerId = null;
            this.customer = null;
            this.customerPAN = null;
            this.customerType = null;
            this.gstNumber = null;
            this.idProof = null;
          }
        }
      });
  }

  getInitiateAdvanceResponse() {
    this.ctAcceptAdvanceFacade
      .getInitiateAdvanceResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data !== null) {
          this.transactionId = data.id;
          this.status = StatusTypesEnum.OPEN;
          this.orderNumber.emit({ orderNo: data.docNo, status: this.status });
          this.ctAcceptAdvanceFacade.setOrderNumber(data.docNo, this.status);
          this.commonFacade.setAcceptAdvanceOrderNumber({
            orderNo: data.docNo,
            status: this.status
          });
          let requestBody: PartialUpdateAdvanceRequestPayload;
          this.loadOpenValues();
          if (this.customerId) {
            requestBody = {
              customerId: Number(this.customerId),
              isPaymentForEGHS: this.isPaymentForEGHS
            };
            if (this.transactionId) {
              this.onFocusOut();
              this.ctAcceptAdvanceFacade.partiallyUpdateAdvance(
                this.transactionId,
                requestBody
              );
              this.setSelectedRSOName(this.selectedRsoName);
              // this.onFocusOut();
              this.overlayNotification.close();
            }
          }
        }
      });
  }

  loadOpenValues() {
    this.toolbarFacade.loadOpenOrdersCount({
      status: StatusTypesEnum.OPEN,
      txnType: TransactionTypeEnum.ADV,
      subTxnType: SubTransactionTypeEnum.NON_FROZEN_RATES
    });
    this.toolbarFacade.loadOpenOrders({
      searchValue: '',
      status: StatusTypesEnum.OPEN,
      txnType: TransactionTypeEnum.ADV,
      subTxnType: SubTransactionTypeEnum.NON_FROZEN_RATES,
      pageIndex: 0,
      pageSize: 10
    });
  }

  showAcceptAdvanceSuccessNotification(): void {
    this.overlayNotification
      .show({
        type: OverlayNotificationType.CUSTOM,
        hasBackdrop: true,
        hasClose: true,
        template: this.acceptAdvanceSuccessNotificationTemplate
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: OverlayNotificationEventRef) => {
        if (event.eventType === OverlayNotificationEventType.CLOSE) {
          this.transactionId = '';
          this.clearData();
          this.router.navigate([getAcceptAdvanceUrl()]);
        }
      });
  }

  onFocusOut(): void {
    if (
      this.transactionId &&
      this.ctAcceptAdvanceFormGroup.get('amount').value > 0
    ) {
      const amount = Number(
        Number(this.ctAcceptAdvanceFormGroup.get('amount').value).toFixed(2)
      );
      this.ctAcceptAdvanceFacade.setTotalAmount(amount);
      const requestPayload: PartialUpdateAdvanceRequestPayload = {
        totalValue: amount
      };
      this.ctAcceptAdvanceFacade.partiallyUpdateAdvance(
        this.transactionId,
        requestPayload
      );
    } else if (!this.customerId) {
      this.showAlertNotification(this.selectCustomerAlertMessage);
    } else if (this.customerId && !this.transactionId) {
      this.showAlertNotification(
        this.technicalIssueInTransactionIdAlertMessage
      );
    } else {
      this.commonFacade.setTransactionTotalAmount(0);
    }
  }

  setSelectedRSOName(event: { value: string; description: string }): void {
    this.clearSelectedRsoName = false;
    const requestPayload: PartialUpdateAdvanceRequestPayload = {};
    if (this.transactionId && event && event.value) {
      requestPayload.employeeCode = event.value;
      this.ctAcceptAdvanceFacade.partiallyUpdateAdvance(
        this.transactionId,
        requestPayload
      );
    }
    this.ctAcceptAdvanceFacade.setSelectedRsoName(event);
  }

  showAlertNotification(message: string): void {
    this.overlayNotification
      .show({
        type: OverlayNotificationType.SIMPLE,
        hasClose: true,
        hasBackdrop: true,
        message
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  showSummaryBar(): void {
    this.summaryBar
      .open(SummaryBarType.ADV, {
        type: CtAdvanceTabsEnum.ACCEPT_ADVANCE,
        remarks: this.summaryBarRemarks$.asObservable()
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: SummaryBarEventRef) => {
        switch (event.eventType) {
          case SummaryBarEventType.DELETE: {
            if (this.transactionId) {
              this.ctAcceptAdvanceFacade.deleteAdvanceTransactionDetails(
                this.transactionId
              );
            }
            break;
          }
          case SummaryBarEventType.PRINT: {
            this.printAcceptAdvanceConfirmedTransaction(
              this.transactionId,
              this.transactionTypeEnum?.ADV,
              this.subTransactionTypeEnum?.NON_FROZEN_RATES
            );
            break;
          }
          case SummaryBarEventType.CLAER: {
            if (this.paymentDetailsList.length > 0) {
              this.showAlertNotification(this.reversePaymentAlertMessage);
            } else {
              this.clearData();
              this.router.navigate([getAcceptAdvanceUrl()]);
            }
            break;
          }
          case SummaryBarEventType.CONFRIM: {
            if (!this.selectedRsoName) {
              this.showAlertNotification(this.selectRsoNameAlertMessage);
            } else if (this.customerId !== null) {
              let isFormValidated = this.validateCustomerService.validateCustomer(
                this.customer
              );
              if (isFormValidated) {
                if (
                  this.panMandatoryForAdvance &&
                  !this.isProfileMatched &&
                  this.paidValue > this.maxAllowedAmount
                  // ((this.customerType === CUSTOMER_TYPE_ENUM.INTERNATIONAL &&
                  //   !this.form60Submitted) ||
                  //   (this.customerType === CUSTOMER_TYPE_ENUM.ONE_TIME &&
                  //     !this.form60Submitted &&
                  //     !this.customerPAN) ||
                  //   (this.customerType === CUSTOMER_TYPE_ENUM.INSTITUTIONAL &&
                  //     !this.gstNumber &&
                  //     !this.customerPAN) ||
                  //   (this.customerType === CUSTOMER_TYPE_ENUM.REGULAR &&
                  //     !this.customerPAN &&
                  //     !this.idProof))
                ) {
                  this.showPanFormVerifyPopup();
                } else {
                  this.confirmAcceptAdvance(event);
                }
              } else {
                this.customerService.open({
                  customerType: this.customerType,
                  customerId: this.customerId
                });
              }
            }
            break;
          }
        }
      });
  }

  openPanCardPopUp() {
    this.panCardServiceAbstraction.open(this.customerId, this.customerType);
  }

  showPanFormVerifyPopup() {
    this.panFormVerifyPopupService
      .open({
        type: AlertPopupTypeEnum.INFO,
        id: this.transactionId,
        customerId: Number(this.customerId),
        customerType: this.customerType,
        txnType: TransactionTypeEnum.ADV
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((dailogResponse: boolean) => {
        this.isProfileMatched = dailogResponse;
      });
  }

  confirmAcceptAdvance(event: any) {
    const orderDetails: UpdateOrderDetails = {
      cashMemoId: this.transactionId,
      orderDetails: {
        customerId: Number(this.customerId),
        finalValue: Number(
          Number(this.ctAcceptAdvanceFormGroup.get('amount').value).toFixed(2)
        ),
        paidValue: Number(Number(this.paidValue).toFixed(2)),
        remarks: event.remarks ? event.remarks : null,
        hallmarkCharges: 0,
        hallmarkDiscount: 0
      },
      status: StatusTypesEnum.CONFIRMED,
      transactionType: TransactionTypeEnum.ADV,
      subTransactionType: SubTransactionTypeEnum.NON_FROZEN_RATES
    };
    const msg = this.orderService.confirmOrder(
      orderDetails,
      this.paymentDetails,
      TransactionTypeEnum.ADV
    );

    if (msg) {
      this.errorNotifications(msg);
    }

    // this.orderConfirmationFacade.confirmCashMemo(
    //   orderDetails,
    //   this.notConfirmedPayements
    // );
  }

  errorNotifications(errorKey: string) {
    const key = errorKey;
    this.translate
      .get(key)
      .pipe(take(1))
      .subscribe((translatedMessage: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SIMPLE,
            message: translatedMessage,
            hasClose: true,
            hasBackdrop: true
          })
          .events.pipe(takeUntil(this.destroy$))
          .subscribe();
      });
  }

  openErrorMsgForOrder(message) {
    this.alertPopUpService
      .open({
        type: AlertPopupTypeEnum.INFO,
        message: message
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) {
          // Logic
        }
      });
  }

  clearData() {
    this.isTransactionSuccess = false;
    this.isProfileMatched = false;
    // this.commonFacade.clearTransactionTD();
    this.commonFacade.clearTransactionTD();
    this.ctAcceptAdvanceFormGroup.get('amount').reset();
    this.ctAcceptAdvanceFormGroup.get('paymentMadeForEGHS').reset();
    this.ctAcceptAdvanceFormGroup.markAsPristine();
    // this.ctAcceptAdvanceFormGroup.updateValueAndValidity();
    this.customerFacade.clearSelectedCustomer();
    this.customerFacade.clearCustomerSearch();
    this.customer = null;
    this.customerId = null;
    this.ctAcceptAdvanceFacade.setRemarks('');
    // this.paymentFacade.resetPayment();
    // this.commonFacade.setTransactionTotalAmount(0);
    this.commonFacade.setTransactionTotalAmount(0);
    this.ctAcceptAdvanceFacade.resetAcceptAdvance();
    this.ctAcceptAdvanceFacade.loadRsoDetails(this.roleCode);
    this.selectedRso = null;
    this.printingService.resetPrint();
    this.summaryBarRemarks$.next('');
    this.commonFacade.setAcceptAdvanceOrderNumber({
      orderNo: 0,
      status: null
    });
  }

  printAcceptAdvanceConfirmedTransaction(
    transactionId: string,
    txnType: string,
    subTxnType: string
  ) {
    this.postConfirmationActions
      .open()
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (res) {
          let action = '';
          switch (res) {
            case 'print': {
              action = InvoiceDeliveryTypes.PRINT;
              break;
            }
            case 'mail': {
              action = InvoiceDeliveryTypes.MAIL;
              break;
            }
            case 'both': {
              action = InvoiceDeliveryTypes.BOTH;
              break;
            }
          }
          this.printingService.loadPrintData({
            printType: printTypesEnum.ACCEPT_ADVANCE_PRINTS,
            transacionId: transactionId,
            transacionType: printTransactionTypesEnum.SALES,
            printFileType: printFileTypeEnum.INVOICE_PRINT,
            doctype: printDocTypeEnum.CUSTOMER_PRINT,
            invoiceType: action,
            customerId: this.customerId,
            reprint: true
          });
        }
      });
  }

  showAlertPopUp(message: string) {
    this.alertPopUpService
      .open({
        type: AlertPopupTypeEnum.INFO,
        message
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  getTranslatedAlertMessages() {
    const selectCustomerAlertMessage = 'pw.acceptAdvance.selectCustomerAlert';
    const selectRsoNameAlertMessage = 'pw.acceptAdvance.selectRsoNameAlert';
    const addRemarksAlertMessage = 'pw.acceptAdvance.addRemarksAlert';
    const reversePaymentAlertMessage =
      'pw.acceptAdvance.reversePaymentAlertMessage';
    const invalidRemarksAlertMessage =
      'pw.acceptAdvance.invalidRemarksAlertMessage';
    const technicalIssueInTransactionIdAlertMessage =
      'pw.acceptAdvance.technicalIssueInTransactionIdAlertMessage';
    this.translate
      .get([
        selectCustomerAlertMessage,
        selectRsoNameAlertMessage,
        addRemarksAlertMessage,
        reversePaymentAlertMessage,
        invalidRemarksAlertMessage,
        technicalIssueInTransactionIdAlertMessage
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(translatedMessages => {
        this.selectCustomerAlertMessage =
          translatedMessages[selectCustomerAlertMessage];
        this.selectRsoNameAlertMessage =
          translatedMessages[selectRsoNameAlertMessage];
        this.addRemarksAlertMessage =
          translatedMessages[addRemarksAlertMessage];
        this.reversePaymentAlertMessage =
          translatedMessages[reversePaymentAlertMessage];
        this.invalidRemarksAlertMessage =
          translatedMessages[invalidRemarksAlertMessage];
        this.technicalIssueInTransactionIdAlertMessage =
          translatedMessages[technicalIssueInTransactionIdAlertMessage];
      });
  }

  getDeleteTepTransactionResponse() {
    this.ctAcceptAdvanceFacade
      .getDeleteAdvanceTransactionResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe(deleteAdvanceTransactionResponse => {
        if (deleteAdvanceTransactionResponse) {
          this.transactionId = '';
          this.clearData();
          this.orderNumber.emit({
            orderNo: 0,
            status: StatusTypesEnum.SUSPENDED
          });
          this.isOpenTask = false;
          this.loadOpenValues();
          this.showAlertNotification('Transaction is successfully deleted.');
        }
      });
  }

  getRsoObjFromCode(code: string) {
    let selectedRso: RsoNameObject = {
      value: '',
      description: ''
    };
    if (this.rsoNamesList.length > 0) {
      const rsoList = this.rsoNamesList.filter((rsoNameObj: RsoNameObject) => {
        return code === rsoNameObj.value;
      });
      if (rsoList.length > 0) {
        selectedRso = rsoList[0];
      }
    }
    return selectedRso;
  }

  ngOnDestroy() {
    this.orderNumber.emit({
      orderNo: 0,
      status: StatusTypesEnum.SUSPENDED
    });
    this.ctAcceptAdvanceFacade.setOrderNumber(0, StatusTypesEnum.SUSPENDED);
    this.commonFacade.setAcceptAdvanceOrderNumber({
      orderNo: 0,
      status: StatusTypesEnum.SUSPENDED
    });
    this.isOpenTask = false;
    this.printingService.resetPrint();
    this.clearData();
    this.summaryBar.close();
    this.destroy$.next();
    this.destroy$.complete();
    this.orderConfirmationFacade.resetValues();
    this.customerFacade.clearCustomerSearch();
    this.commonFacade.clearTransactionConfig();
    this.toolbarFacade.resetValues();
    this.toolbarFacade.setToolbarConfig({
      loadMetalPrices: true,
      loadHoldPopup: false,
      loadOpenOrdersPopup: false
    });
  }
}
