import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Event, NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CtGrfFacade } from '@poss-web/poss/grf/data-access-grf';
import { IsGrfAllowedPopUpComponent } from '@poss-web/poss/grf/feature-grf';
import { AuthFacade } from '@poss-web/shared/auth/data-access-auth';
import { CommonFacade } from '@poss-web/shared/common/data-access-common';
import {
  CurrencySymbolService,
  WeightFormatterService
} from '@poss-web/shared/components/ui-formatters';
import { CustomerFacade } from '@poss-web/shared/customer/data-access-customer';
import { ValidateCustomerService } from '@poss-web/shared/customer/feature-customer-create';
import { LocationSettingsFacade } from '@poss-web/shared/location-settings/data-access-location-settings';
import {
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  CashMemoDetailsResponse,
  CommomStateAttributeNameEnum,
  CommomStateAttributeTypeEnum,
  CustomErrors,
  Customers,
  CustomerServiceAbstraction,
  FileUploadLists,
  GoldRateFreezeEnumTypes,
  InvoiceDeliveryTypes,
  LocationSettingAttributesEnum,
  ManualBillRequest,
  MetalPrice,
  OverlayNotificationEventRef,
  OverlayNotificationEventType,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  PanFormVerifyPopupServiceAbstraction,
  PartialUpdateGrfRequestPayload,
  PaymentDetails,
  PostTransactionConfirmationActionsServiceAbstraction,
  printDocTypeEnum,
  printFileTypeEnum,
  PrintingServiceAbstraction,
  printTransactionTypesEnum,
  printTypesEnum,
  RoleCodesEnum,
  RsoNameObject,
  SharedBodEodFeatureServiceAbstraction,
  StatusTypesEnum,
  SubTransactionTypeEnum,
  SummaryBarEventRef,
  SummaryBarEventType,
  SummaryBarServiceAbstraction,
  SummaryBarType,
  ToolbarConfig,
  TransactionTypeEnum,
  UpdateOrderDetails,
  ValidationTypesEnum
} from '@poss-web/shared/models';
import {
  OrderConfirmationFacade,
  OrderService
} from '@poss-web/shared/order-confirmation/data-access-order-confirmation';
import { PaymentFacade } from '@poss-web/shared/payment/data-access-payment';
import { ToolbarFacade } from '@poss-web/shared/toolbar/data-access-toolbar';
import { ErrorEnums } from '@poss-web/shared/util-error';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { getManualGrfUrl } from '@poss-web/shared/util-site-routes';
import { Observable, Subject } from 'rxjs';
import { filter, take, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-manual-grf',
  templateUrl: './manual-grf.component.html',
  styleUrls: ['./manual-grf.component.scss']
})
export class ManualGrfComponent implements OnInit, OnDestroy {
  @ViewChild('grfSuccessNotificationTemplate', { static: true })
  private grfSuccessNotificationTemplate: TemplateRef<any>;
  baseCurrencyCode: string = '';
  printErrorText: string;
  ctGrfFormGroup: FormGroup;
  transactionId: string;
  selectedRsoName: { value: string; description: string };
  rsoNamesList: { value: string; description: string }[] = [];
  creditNoteNumber: string;
  selectCustomerAlertMessage = '';
  selectRsoNameAlertMessage = '';
  addRemarksAlertMessage = '';
  reversePaymentAlertMessage = '';
  invalidRemarksAlertMessage = '';
  technicalIssueInTransactionIdAlertMessage = '';
  goldPriceIsChangedTo = '';
  confirmationMessage = '';
  paymentDetailsList = [];
  clearSelectedRsoName = false;
  updatedGoldPrice = 0;
  metalType = '';
  grfRemarks = '';
  goldWeight: number;
  roleCode = RoleCodesEnum.RSO;
  grfDocNo = '';
  isLoading$: Observable<boolean>;
  isOrderConfirmationLoading$: Observable<boolean>;
  metalDetails: MetalPrice;
  standardMetalPriceDetails: any;
  paidValue = 0;
  destroy$: Subject<null> = new Subject<null>();
  summaryBarRemarks$ = new Subject<string>();
  isOpenTask = false;
  selectedRso;
  isGrfAllowed = false;
  status: StatusTypesEnum;
  isLoggedIn: boolean;
  transactionTypeEnum = TransactionTypeEnum;
  subTransactionTypeEnum = SubTransactionTypeEnum;
  isTransactionSuccess = false;
  customerId = null;
  customer: Customers = null;
  manualBillDetails = null;
  businessDay: number;
  TransactionTypeEnumRef = TransactionTypeEnum;
  detailsFlag$: Subject<boolean> = new Subject<boolean>();
  toolbarData: ToolbarConfig = {
    txnType: TransactionTypeEnum.GRF,
    subTxnType: SubTransactionTypeEnum.MANUAL_FROZEN_RATES,
    loadMetalPrices: true,
    loadHoldPopup: true,
    loadOpenOrdersPopup: true
  };
  actionType = ValidationTypesEnum.REGULARIZE;
  imageUrl: string;
  validationTypesEnum = ValidationTypesEnum;

  customerType: string;
  panMandatoryForGRF: boolean;
  maxAllowedAmount: number;
  isProfileMatched: boolean;

  @Output() orderNumber = new EventEmitter<{
    orderNo: number;
    status: StatusTypesEnum;
  }>();

  constructor(
    public currencySymbolService: CurrencySymbolService,
    public translate: TranslateService,
    private dialog: MatDialog,
    private locationSettingsFacade: LocationSettingsFacade,
    private paymentFacade: PaymentFacade,
    private commonFacade: CommonFacade,
    private customerFacade: CustomerFacade,
    private ctGrfFacade: CtGrfFacade,
    private toolbarFacade: ToolbarFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private summaryBar: SummaryBarServiceAbstraction,
    private fieldValidatorsService: FieldValidatorsService,
    private orderService: OrderService,
    private orderConfirmationFacade: OrderConfirmationFacade,
    private router: Router,
    public printingService: PrintingServiceAbstraction,
    private activatedRoute: ActivatedRoute,
    private authFacade: AuthFacade,
    private alertPopupService: AlertPopupServiceAbstraction,
    private weightFormatterService: WeightFormatterService,
    private postConfirmationActions: PostTransactionConfirmationActionsServiceAbstraction,

    private bodEodFeatureService: SharedBodEodFeatureServiceAbstraction,
    private panFormVerifyPopupService: PanFormVerifyPopupServiceAbstraction,
    private customerService: CustomerServiceAbstraction,
    private validateCustomerService: ValidateCustomerService
  ) {
    this.ctGrfFormGroup = new FormGroup({
      amount: new FormControl('', [
        this.fieldValidatorsService.requiredField('Amount')
      ])
    });
    this.translate
      .get(['pw.otherReceiptsIssues.printError'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.printErrorText =
          translatedMessages['pw.otherReceiptsIssues.printError'];
      });
  }

  ngOnInit(): void {
    const toolbarData: ToolbarConfig = {
      txnType: TransactionTypeEnum.ADV,
      subTxnType: SubTransactionTypeEnum.MANUAL_FROZEN_RATES,
      loadMetalPrices: true,
      loadHoldPopup: false,
      loadOpenOrdersPopup: true
    };
    this.toolbarFacade.setToolbarConfig(toolbarData);
    this.commonFacade.setGrfGoldWeight(0);
    this.locationSettingsFacade
      .getLocationSetting(LocationSettingAttributesEnum.GRF_IS_GRF_ALLOWED)
      .pipe(takeUntil(this.destroy$))
      .subscribe((isGrfAllowed: string) => {
        //if (isGrfAllowed) {
        if (isGrfAllowed === 'true') {
          this.isGrfAllowed = true;
          this.getTranslatedAlertMessages();
          this.getStandardMetalPriceList();
          this.locationSettingsFacade
            .getLocationSetting(
              LocationSettingAttributesEnum.BASECURRENCY_CURRENCY_CODE
            )
            .pipe(takeUntil(this.destroy$))
            .subscribe((currencyCode: string) => {
              this.baseCurrencyCode = currencyCode;
            });
          this.printingService
            .getPrintError()
            .pipe(takeUntil(this.destroy$))
            .subscribe((error: CustomErrors) => {
              if (error) {
                this.errorHandler(error);
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
                this.showAlertPopUp(
                  'pw.regularCashMemo.printingSuccessMessage'
                );
              }
            });
          // this.commonFacade.setTransactionConfig({
          //   isPaymentEditable: true,
          //   transactionType: {
          //     type: TransactionTypeEnum.ADV,
          //     subType: SubTransactionTypeEnumMANUAL_FROZEN_RATES
          //   }
          // });
          this.bodEodFeatureService
            .getBusinessDayDate()
            .pipe(takeUntil(this.destroy$))
            .subscribe(data => {
              this.businessDay = data;
            });
          this.commonFacade.setTransactionConfig({
            isPaymentEditable: true,
            transactionType: {
              type: TransactionTypeEnum.ADV,
              subType: SubTransactionTypeEnum.MANUAL_FROZEN_RATES
            }
          });

          this.ctGrfFacade.loadRsoDetails(this.roleCode);
          this.ctGrfFacade
            .getRsoDetails()
            .pipe(takeUntil(this.destroy$))
            .subscribe((rsoDetails: RsoNameObject[]) => {
              this.rsoNamesList = rsoDetails;
              // if (rsoDetails && rsoDetails.length > 0) {
              //   this.rsoNamesList = rsoDetails.map((rsoName: string) => {
              //     return { value: rsoName, description: rsoName };
              //   });
              // } else {
              //   this.rsoNamesList = [];
              // }
            });
          this.getCustomerResponse();
          this.getInitiateGrfResponse();

          const id = this.activatedRoute.snapshot.params['_id'];
          if (id !== 'new' && this.router.url.includes('manual-grf')) {
            this.ctGrfFacade.getViewGrfDetails(
              SubTransactionTypeEnum.MANUAL_FROZEN_RATES,
              id
            );
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
                (event: Event) =>
                  event instanceof NavigationEnd && this.isLoggedIn
              ),
              takeUntil(this.destroy$)
            )
            .subscribe(() => {
              const id = this.activatedRoute.snapshot.params['_id'];
              if (id !== 'new' && this.router.url.includes('manual-grf')) {
                this.ctGrfFacade.getViewGrfDetails(
                  SubTransactionTypeEnum.MANUAL_FROZEN_RATES,
                  id
                );
                // this.commonFacade.setTransactionTD(id);
                this.commonFacade.setTransactionTD(id);
              } else {
                this.isOpenTask = false;
              }
            });

          this.ctGrfFacade
            .getViewGrfResponse()
            .pipe(takeUntil(this.destroy$))
            .subscribe((viewGrfResponse: any) => {
              if (viewGrfResponse) {
                this.isOpenTask = true;
                this.status = StatusTypesEnum.OPEN;
                this.orderNumber.emit({
                  orderNo: viewGrfResponse.docNo,
                  status: this.status
                });
                this.ctGrfFacade.setOrderNumber(
                  viewGrfResponse.docNo,
                  this.status
                );
                this.commonFacade.setGrfOrderNumber({
                  orderNo: viewGrfResponse.docNo,
                  status: this.status
                });
                this.transactionId = viewGrfResponse.id;
                this.customerId = viewGrfResponse.customerId;
                if (viewGrfResponse.manualBillDetails) {
                  const manualData = { ...viewGrfResponse };
                  manualData.manualBillDetails = {
                    ...viewGrfResponse.manualBillDetails.manualBillDetails
                  };
                  manualData.manualBillDetails['validationType'] =
                    viewGrfResponse.manualBillDetails.validationType;
                  this.manualBillDetails = manualData;
                  this.detailsFlag$.next(true);
                }
                this.ctGrfFormGroup
                  .get('amount')
                  .setValue(viewGrfResponse.finalValue);
                this.ctGrfFormGroup.updateValueAndValidity();
                this.onFocusOut();
                const rsoNames = this.rsoNamesList.map(
                  (rsoNameObj: { value: string; description: string }) => {
                    return rsoNameObj.value;
                  }
                );
                if (rsoNames.includes(viewGrfResponse.employeeCode)) {
                  this.selectedRso = {
                    value: viewGrfResponse.employeeCode,
                    description: viewGrfResponse.employeeCode
                  };
                  this.setSelectedRSOName(this.selectedRso);
                }
                if (viewGrfResponse.status === StatusTypesEnum.OPEN) {
                  const val =
                    viewGrfResponse?.manualBillDetails?.validationType;
                  if (val === ValidationTypesEnum.PASSWORD_VALIDATION) {
                    this.actionType = ValidationTypesEnum.REGULARIZE;
                    this.showSummaryBar();
                  } else if (val === ValidationTypesEnum.REQUEST_APPROVAL) {
                    this.actionType = ValidationTypesEnum.SENDAPPROVAL;
                    this.showSummaryBar();
                  }
                  if (
                    val === ValidationTypesEnum.REQUEST_APPROVAL
                    // &&
                    // data.customerDocDetails
                    //   ?.split(',')
                    //   .includes(ImageTypesEnum.MANUAL_BILL)
                  ) {
                    this.ctGrfFacade.loadFileUploadList({
                      txnType: TransactionTypeEnum.GRF,
                      id: viewGrfResponse.id,
                      customerId: viewGrfResponse.customerId
                    });
                  }
                  this.summaryBarRemarks$.next(viewGrfResponse.remarks);
                  if (viewGrfResponse.customerId) {
                    this.customerFacade.loadSelectedCustomer(
                      String(viewGrfResponse.customerId),
                      false
                    );
                  }
                }
              } else {
                this.isOpenTask = false;
              }
            });
          this.ctGrfFacade
            .getSelectedRsoName()
            .pipe(takeUntil(this.destroy$))
            .subscribe(
              (selectedRsoName: { value: string; description: string }) => {
                if (!selectedRsoName) {
                  this.clearSelectedRsoName = true;
                }
                this.selectedRsoName = selectedRsoName;
              }
            );
          this.actionType = ValidationTypesEnum.REGULARIZE;
          this.showSummaryBar();
          this.paymentFacade
            .getPaymentDetails()
            .pipe(takeUntil(this.destroy$))
            .subscribe((paymentDetails: PaymentDetails[]) => {
              this.paymentDetailsList = paymentDetails;
            });
          this.paymentFacade
            .getTotalPaidAmount()
            .pipe(takeUntil(this.destroy$))
            .subscribe(totalValue => {
              this.paidValue = totalValue;
            });
          this.toolbarFacade
            .getMetalPriceDetails()
            .pipe(takeUntil(this.destroy$))
            .subscribe((metalPriceList: MetalPrice[]) => {
              if (metalPriceList && metalPriceList.length > 0) {
                const gold22KaratDetailsObj = metalPriceList.filter(
                  priceObj => {
                    return priceObj.karatage === 22;
                  }
                );
                this.metalDetails = gold22KaratDetailsObj[0];
                this.metalType =
                  gold22KaratDetailsObj && gold22KaratDetailsObj[0]
                    ? gold22KaratDetailsObj[0].metalTypeCode
                    : '';
                this.updatedGoldPrice =
                  gold22KaratDetailsObj && gold22KaratDetailsObj[0]
                    ? gold22KaratDetailsObj[0].ratePerUnit
                    : 0;
              } else {
                this.metalType = '';
                this.updatedGoldPrice = 0;
              }
            });

          this.orderConfirmationFacade
            .confirmCashMemoResponse()
            .pipe(takeUntil(this.destroy$))
            .subscribe((response: CashMemoDetailsResponse) => {
              if (response) {
                this.orderNumber.emit({
                  orderNo: 0,
                  status: StatusTypesEnum.CONFIRMED
                });
                this.ctGrfFacade.setOrderNumber(0, StatusTypesEnum.CONFIRMED);
                this.commonFacade.setGrfOrderNumber({
                  orderNo: 0,
                  status: StatusTypesEnum.CONFIRMED
                });
                this.loadOpenValues();
                // if (response.cndocNos && response.cndocNos.length > 0) {
                //   this.creditNoteNumber = response.cndocNos.join();
                // }
                if (
                  response.cndocNos &&
                  Object.values(response.cndocNos).length > 0
                ) {
                  this.creditNoteNumber = Object.values(response.cndocNos)[0];
                }
                if (response.docNo) {
                  this.grfDocNo = response.docNo.toString();
                }
                this.showGrfSuccessNotification();
                this.isOpenTask = false;
                this.isTransactionSuccess = true;
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

          this.ctGrfFacade
            .getPartiallyUpdateGrfResponse()
            .pipe(takeUntil(this.destroy$))
            .subscribe(response => {
              if (response) {
                this.commonFacade.setTransactionTD(this.transactionId);
                if (
                  this.ctGrfFormGroup.get('amount').value &&
                  this.ctGrfFormGroup.get('amount').value > 0
                ) {
                  this.commonFacade.setTransactionTotalAmount(
                    Number(
                      Number(this.ctGrfFormGroup.get('amount').value).toFixed(2)
                    )
                  );
                }
              }
            });

          this.ctGrfFacade
            .getError()
            .pipe(takeUntil(this.destroy$))
            .subscribe((error: CustomErrors) => {
              if (error && error.code) {
                this.errorHandler(error);
              }
            });
          this.ctGrfFacade
            .getGoldWeight()
            .pipe(takeUntil(this.destroy$))
            .subscribe((goldWeight: number) => {
              this.goldWeight = goldWeight;
            });

          this.ctGrfFacade
            .getFileUploadRes()
            .pipe(takeUntil(this.destroy$))
            .subscribe((data: boolean) => {
              if (data) {
                this.ctGrfFacade.loadFileUploadList({
                  txnType: TransactionTypeEnum.GRF,
                  id: this.transactionId,
                  customerId: this.customerId
                });
              }
            });

          this.ctGrfFacade
            .getFileUploadListRes()
            .pipe(takeUntil(this.destroy$))
            .subscribe((data: FileUploadLists[]) => {
              if (data.length !== 0)
                this.ctGrfFacade.loadFileDownloadUrl({
                  id: data[data.length - 1].id,
                  locationCode: null
                });
            });

          this.ctGrfFacade
            .getFileDownloadUrl()
            .pipe(takeUntil(this.destroy$))
            .subscribe((data: string) => {
              this.imageUrl = data;
            });
          this.isLoading$ = this.ctGrfFacade.getIsLoading();
          this.isOrderConfirmationLoading$ = this.orderConfirmationFacade.getIsLoading();
        } else if (isGrfAllowed === 'false') {
          this.isGrfAllowed = false;
          this.openIsGrfAllowedDialog();
        }
        //}
      });
  }

  validateBill(event: ManualBillRequest) {
    if (this.customerId !== null) {
      this.ctGrfFacade.initiateGrf(
        SubTransactionTypeEnum.MANUAL_FROZEN_RATES,
        event
      );
    }
  }

  getStandardMetalPriceList() {
    // this.commonFacade.loadStandardMetalPriceDetails();
    this.commonFacade.loadGRFStandardMetalPriceDetails();
    // this.commonFacade
    //   .getStandardMetalPriceDetails()
    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.GRF,
        CommomStateAttributeNameEnum.STANDARD_METAL_PRICE_DETAILS
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((standardMetalsPrice: any) => {
        const metalsPriceData = { ...standardMetalsPrice };
        // if (metalsPriceData && Object.keys(metalsPriceData).length > 0) {
        //   Object.keys(metalsPriceData).forEach((key: any) => {
        //     metalsPriceData[key] = {
        //       ...metalsPriceData[key],
        //       purity: Number(metalsPriceData[key].purity.toFixed(3))
        //     };
        //   });
        // }
        this.standardMetalPriceDetails = metalsPriceData;
      });
  }

  openGoldPriceChangedConfirmationDialog() {
    const updatedGoldPrice = `${this.currencySymbolService.get(
      this.baseCurrencyCode
    )}${this.updatedGoldPrice}`;
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.CONFIRM,
        message:
          this.goldPriceIsChangedTo +
          ' ' +
          updatedGoldPrice +
          ' ' +
          this.confirmationMessage
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) {
          this.createGRF(this.grfRemarks);
        } else {
          this.clearData();
        }
      });

    // const dialogRef = this.dialog.open(
    //   GoldPriceChangeConfirmationPopUpComponent,
    //   {
    //     width: '400px',
    //     hasBackdrop: true,
    //     data: {
    //       goldPrice: `${this.currencySymbolService.get(this.baseCurrencyCode)}${
    //         this.updatedGoldPrice
    //       }`
    //     }
    //   }
    // );

    // dialogRef
    //   .afterClosed()
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe(res => {
    //     if (res) {
    //       if (res === 'confirm') {
    //         this.createGRF(this.grfRemarks);
    //       } else if (res === 'cancel') {
    //         this.clearData();
    //       }
    //     }
    //   });
  }

  openIsGrfAllowedDialog() {
    const dialogRef = this.dialog.open(IsGrfAllowedPopUpComponent, {
      width: '400px',
      hasBackdrop: true,
      data: {}
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (res) {
          if (res === 'ok') {
            this.router.navigate(['home']);
          }
        }
      });
  }

  /**
   * to display error message
   * @param error : error from api
   */
  errorHandler(error: CustomErrors) {
    if (
      (error && error.code === 'ERR-SALE-085') ||
      error.code === 'ERR-SALE-008'
    ) {
      this.getStandardMetalPriceList();
      this.openGoldPriceChangedConfirmationDialog();
    } else if (error.code === ErrorEnums.ERR_QZ_TRAY) {
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
            this.showGrfSuccessNotification();
          }
        });
    }
  }

  printError(message: string) {
    this.overlayNotification
      .show({
        type: OverlayNotificationType.TIMER,
        message,
        hasClose: false
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: OverlayNotificationEventRef) => {
        this.showGrfSuccessNotification(); //call your respective success overlay method
      });
  }

  getCustomerResponse() {
    this.customerFacade
      .getSelectSelectedCustomer()
      .pipe(takeUntil(this.destroy$))
      .subscribe(customer => {
        if (customer) {
          this.customerId = customer.customerId;
          this.customer = customer;
          if (this.customerId && this.transactionId) {
            const customerRequestBody: PartialUpdateGrfRequestPayload = {
              customerId: Number(this.customerId),
              metalType: this.metalType
            };
            this.ctGrfFacade.partiallyUpdateGrf(
              SubTransactionTypeEnum.MANUAL_FROZEN_RATES,
              this.transactionId,
              customerRequestBody
            );
          }
        } else {
          this.customerId = null;
          this.customer = null;
        }
      });
  }

  getInitiateGrfResponse() {
    this.ctGrfFacade
      .getInitiateGrfResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        if (data) {
          if (data.manualBillDetails) {
            const manualData = { ...data };
            manualData.manualBillDetails = {
              ...manualData.manualBillDetails.manualBillDetails
            };
            manualData.manualBillDetails['validationType'] =
              data.manualBillDetails.validationType;
            this.manualBillDetails = manualData;
            this.detailsFlag$.next(true);
          }
          this.transactionId = '';
          this.transactionId = data.id;
          this.status = StatusTypesEnum.OPEN;
          this.orderNumber.emit({ orderNo: data.docNo, status: this.status });
          this.ctGrfFacade.setOrderNumber(data.docNo, this.status);
          this.commonFacade.setGrfOrderNumber({
            orderNo: data.docNo,
            status: this.status
          });
          this.loadOpenValues();
          let customerRequestBody: PartialUpdateGrfRequestPayload;
          if (this.customerId) {
            customerRequestBody = {
              customerId: Number(this.customerId),
              metalType: this.metalType
            };
            if (this.transactionId) {
              this.onFocusOut();
              this.ctGrfFacade.partiallyUpdateGrf(
                SubTransactionTypeEnum.MANUAL_FROZEN_RATES,
                this.transactionId,
                customerRequestBody
              );
              this.setSelectedRSOName(this.selectedRsoName);
              // this.onFocusOut();
              this.customerFacade.loadSelectedCustomer(
                String(this.customerId),
                false
              );
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
      subTxnType: SubTransactionTypeEnum.MANUAL_FROZEN_RATES
    });
    this.toolbarFacade.loadOpenOrders({
      searchValue: '',
      status: StatusTypesEnum.OPEN,
      txnType: TransactionTypeEnum.ADV,
      subTxnType: SubTransactionTypeEnum.MANUAL_FROZEN_RATES,
      pageIndex: 0,
      pageSize: 10
    });
  }

  showGrfSuccessNotification(): void {
    this.overlayNotification
      .show({
        type: OverlayNotificationType.CUSTOM,
        hasBackdrop: true,
        hasClose: true,
        template: this.grfSuccessNotificationTemplate
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: OverlayNotificationEventRef) => {
        if (event.eventType === OverlayNotificationEventType.CLOSE) {
          this.clearData();
          this.router.navigate([getManualGrfUrl()]);
        }
      });
  }

  onFocusOut(): void {
    if (
      this.transactionId
      // &&
      // (this.ctGrfFormGroup.get('amount').value > 0 ||
      //   this.ctGrfFormGroup.get('amount').value === 0)
    ) {
      const amount = Number(
        Number(this.ctGrfFormGroup.get('amount').value).toFixed(2)
      );
      this.ctGrfFacade.setTotalAmount(amount);

      if (this.ctGrfFormGroup.get('amount').value > 0) {
        const requestPayload: PartialUpdateGrfRequestPayload = {
          totalValue: amount
        };
        this.ctGrfFacade.partiallyUpdateGrf(
          SubTransactionTypeEnum.MANUAL_FROZEN_RATES,
          this.transactionId,
          requestPayload
        );
      } else {
        this.commonFacade.setTransactionTD(this.transactionId);
        this.commonFacade.setTransactionTotalAmount(
          Number(Number(0).toFixed(2))
        );
      }
      const goldWeight =
        Number(this.ctGrfFormGroup.get('amount').value) /
        Number(this.updatedGoldPrice);
      this.ctGrfFacade.setGoldWeight(
        Number(this.weightFormatterService.format(goldWeight))
      );
      this.commonFacade.setGrfGoldWeight(
        Number(this.weightFormatterService.format(goldWeight))
      );
    } else if (!this.customerId) {
      this.showAlertNotification(this.selectCustomerAlertMessage);
    } else if (this.customerId && !this.transactionId) {
      this.showAlertNotification(
        this.technicalIssueInTransactionIdAlertMessage
      );
    } else {
      // this.commonFacade.setTransactionTotalAmount(0);
      this.commonFacade.setTransactionTotalAmount(0);
    }
  }

  setSelectedRSOName(event: { value: string; description: string }): void {
    this.clearSelectedRsoName = false;
    const requestPayload: PartialUpdateGrfRequestPayload = {};
    if (this.transactionId && event && event.value) {
      requestPayload.employeeCode = event.value;
      this.ctGrfFacade.partiallyUpdateGrf(
        SubTransactionTypeEnum.MANUAL_FROZEN_RATES,
        this.transactionId,
        requestPayload
      );
    }
    this.ctGrfFacade.setSelectedRsoName(event);
  }

  showAlertNotification(message: string): void {
    this.overlayNotification
      .show({
        type: OverlayNotificationType.SIMPLE,
        hasClose: true,
        message
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  showSummaryBar(): void {
    this.summaryBar
      .open(SummaryBarType.GRF, {
        type: GoldRateFreezeEnumTypes?.NEW_GRF,
        remarks: this.summaryBarRemarks$.asObservable(),
        actionType: this.actionType
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: SummaryBarEventRef) => {
        this.grfRemarks = event.remarks;
        switch (event.eventType) {
          case SummaryBarEventType.CLAER: {
            // if (this.paymentDetailsList.length > 0) {
            //   this.showAlertNotification(this.reversePaymentAlertMessage);
            // } else {
            this.clearData();
            this.router.navigate([getManualGrfUrl()]);
            // }
            break;
          }
          case SummaryBarEventType.REGULARIZE_GRF: {
            if (!this.selectedRsoName) {
              this.showAlertNotification(this.selectRsoNameAlertMessage);
            } else if (this.customerId !== null) {
              let isFormValidated = this.validateCustomerService.validateCustomer(
                this.customer
              );
              if (isFormValidated) {
                if (
                  this.paidValue > this.maxAllowedAmount &&
                  this.panMandatoryForGRF &&
                  !this.isProfileMatched
                ) {
                  this.showPanFormVerifyPopup();
                } else {
                  this.createGRF(this.grfRemarks);
                }
              } else {
                this.customerService.open({
                  customerType: this.customerType,
                  customerId: this.customerId
                });
              }
            }
            // else if (event.remarks === null || event.remarks === undefined) {
            //   this.showAlertNotification(this.addRemarksAlertMessage);
            // }
            // else if (event.remarks === 'invalid') {
            //   this.showAlertNotification(this.invalidRemarksAlertMessage);
            // }
            break;
          }
        }
      });
  }

  // createGRF(remarks: string) {
  //   const totalAmount = this.ctGrfFormGroup.get('amount').value;
  //   const requestDetailsPayload: UpdateGrfRequestPayload = {
  //     customerId: Number(this.customerId),
  //     paidValue: totalAmount,
  //     remarks: remarks,
  //     metalRateList: {
  //       metalRates: this.standardMetalPriceDetails
  //     },
  //     weightAgreed: Number(this.goldWeight.toFixed(3))
  //   };
  //   this.ctGrfFacade.updateGrf(this.transactionId, requestDetailsPayload);
  // }

  createGRF(remarks: string) {
    const totalAmount = this.ctGrfFormGroup.get('amount').value;
    const orderDetails: UpdateOrderDetails = {
      cashMemoId: this.transactionId,
      status:
        this.actionType === ValidationTypesEnum.REGULARIZE
          ? StatusTypesEnum.CONFIRMED
          : StatusTypesEnum.APPROVAL_PENDING,
      orderDetails: {
        customerId: Number(this.customerId),
        finalValue: Number(Number(totalAmount).toFixed(2)),
        paidValue: Number(Number(this.paidValue).toFixed(2)),
        remarks: remarks ? remarks : null,
        weightAgreed: Number(this.goldWeight.toFixed(3)),
        metalRateList: {
          metalRates: this.standardMetalPriceDetails
        },
        hallmarkCharges: 0,
        hallmarkDiscount: 0
      },
      transactionType: TransactionTypeEnum.ADV,
      subTransactionType: SubTransactionTypeEnum.MANUAL_FROZEN_RATES
    };
    const msg = this.orderService.confirmOrder(
      orderDetails,
      this.paymentDetailsList,
      TransactionTypeEnum.ADV
    );
    if (msg) {
      this.errorNotifications(msg);
    }
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

  // {
  //   J: {
  //     metalTypeCode: this.metalDetails.metalTypeCode,
  //     purity: this.metalDetails.purity,
  //     ratePerUnit: this.metalDetails.ratePerUnit,
  //     applicableDate: Number(this.metalDetails.applicableDate),
  //     currency: this.baseCurrencyCode
  //   }
  // }

  clearData() {
    this.isTransactionSuccess = false;
    this.isProfileMatched = false;
    this.transactionId = '';
    this.commonFacade.clearTransactionTD();
    this.ctGrfFormGroup.get('amount').reset();
    this.ctGrfFormGroup.markAsPristine();
    this.clearSelectedRsoName = true;
    this.customerFacade.clearSelectedCustomer();
    this.ctGrfFacade.setRemarks('');
    // this.paymentFacade.resetPayment();
    this.commonFacade.setTransactionTotalAmount(0);
    this.commonFacade.setGrfGoldWeight(0);
    this.ctGrfFacade.resetGrf();
    this.ctGrfFacade.loadRsoDetails(this.roleCode);
    this.selectedRso = null;
    this.printingService.resetPrint();
    this.summaryBarRemarks$.next('');
    this.commonFacade.setGrfOrderNumber({
      orderNo: 0,
      status: null
    });
    this.manualBillDetails = null;
    this.detailsFlag$.next(false);
    this.actionType = ValidationTypesEnum.REGULARIZE;
    this.loadOpenValues();
  }

  printGrfConfirmedTransaction(
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
            printType: printTypesEnum.GRF,
            doctype: printDocTypeEnum.CUSTOMER_PRINT,
            transacionType: printTransactionTypesEnum.SALES,
            printFileType: printFileTypeEnum.INVOICE_PRINT,
            transacionId: transactionId,
            customerId: this.customerId,
            invoiceType: action
          });
        }
      });
  }

  showAlertPopUp(message: string) {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.INFO,
        message
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  getTranslatedAlertMessages() {
    const selectCustomerAlertMessage = 'pw.grf.selectCustomerAlert';
    const selectRsoNameAlertMessage = 'pw.grf.selectRsoNameAlert';
    const addRemarksAlertMessage = 'pw.grf.addRemarksAlert';
    const reversePaymentAlertMessage = 'pw.grf.reversePaymentAlertMessage';
    const invalidRemarksAlertMessage = 'pw.grf.invalidRemarksAlertMessage';
    const technicalIssueInTransactionIdAlertMessage =
      'pw.grf.technicalIssueInTransactionIdAlertMessage';
    const goldPriceIsChangedTo = 'pw.grf.goldPriceIsChangedTo';
    const confirmationMessage = 'pw.grf.confirmationMessage';
    this.translate
      .get([
        selectCustomerAlertMessage,
        selectRsoNameAlertMessage,
        addRemarksAlertMessage,
        reversePaymentAlertMessage,
        invalidRemarksAlertMessage,
        technicalIssueInTransactionIdAlertMessage,
        goldPriceIsChangedTo,
        confirmationMessage
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
        this.goldPriceIsChangedTo = translatedMessages[goldPriceIsChangedTo];
        this.confirmationMessage = translatedMessages[confirmationMessage];
      });
  }

  validationTypeChange(event: string) {
    if (event === ValidationTypesEnum.PASSWORD) {
      this.actionType = ValidationTypesEnum.REGULARIZE;
      this.showSummaryBar();
    } else if (event === ValidationTypesEnum.APPROVAL) {
      this.actionType = ValidationTypesEnum.SENDAPPROVAL;
      this.showSummaryBar();
    }
  }

  uploadFile(event: FormData) {
    console.log('EVENT UPLOAD FILE :', event);
    this.ctGrfFacade.loadFileUpload({
      file: event,
      txnType: TransactionTypeEnum.GRF,
      id: this.transactionId
    });
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

  ngOnDestroy() {
    this.orderNumber.emit({
      orderNo: 0,
      status: StatusTypesEnum.SUSPENDED
    });
    this.ctGrfFacade.setOrderNumber(0, StatusTypesEnum.SUSPENDED);
    this.commonFacade.setGrfOrderNumber({
      orderNo: 0,
      status: StatusTypesEnum.SUSPENDED
    });
    this.isOpenTask = false;
    this.clearData();
    this.summaryBar.close();
    this.destroy$.next();
    this.destroy$.complete();
    this.orderConfirmationFacade.resetValues();
    this.customerFacade.clearCustomerSearch();
    this.printingService.resetPrint();
    this.commonFacade.clearTransactionConfig();
    this.toolbarFacade.resetValues();
    this.toolbarFacade.setToolbarConfig({
      loadMetalPrices: true,
      loadHoldPopup: false,
      loadOpenOrdersPopup: false
    });
    this.commonFacade.clearCmImageUrl();
  }
}
