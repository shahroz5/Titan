import {
  Component,
  Inject,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Event, NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ProductFacade } from '@poss-web/poss/shared/product/data-access-product';
import { AuthFacade } from '@poss-web/shared/auth/data-access-auth';
import { CommonFacade } from '@poss-web/shared/common/data-access-common';
import { ItemPreviewPopupComponent } from '@poss-web/shared/components/ui-item-preview-popup';
import { CustomerFacade } from '@poss-web/shared/customer/data-access-customer';
import { ProductSearchAutocompleteComponent } from '@poss-web/shared/item-master/ui-product-search-autocomplete';
import { LocationSettingsFacade } from '@poss-web/shared/location-settings/data-access-location-settings';
import { PrintingFacade } from '@poss-web/shared/printing/data-access-printing';
import {
  AddOrUpdateTepItemResponse,
  PanCardPopupAbstraction,
  AddTepItemRequestPayload,
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  CommomStateAttributeNameEnum,
  CommomStateAttributeTypeEnum,
  ConfirmOrHoldTepRequestPayload,
  ConfirmTepItemResponse,
  CreateOpenTepTransactionResponse,
  CreateTepTypesEnum,
  CustomErrors,
  DeleteTepItemResponse,
  DiscountListPayload,
  DiscountsList,
  DiscountsSelectionServiceAbstraction,
  GetTepItemConfiguratonResponse,
  InvoiceDeliveryTypes,
  LocationSettingAttributesEnum,
  ManualBillRequest,
  OverlayNotificationEventRef,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  PatchTepRequestPayload,
  PaymentDetails,
  PostTransactionConfirmationActionsServiceAbstraction,
  printDocTypeEnum,
  printFileTypeEnum,
  printTransactionTypesEnum,
  printTypesEnum,
  RefundDetails,
  RefundOptionTypes,
  RoleCodesEnum,
  SalesMenuKeyEnum,
  SaveTepDataType,
  SearchEmitEvent,
  SearchProductList,
  SelectDropDownOption,
  SharedBodEodFeatureServiceAbstraction,
  StatusTypesEnum,
  SubTransactionTypeEnum,
  SummaryBarEventRef,
  SummaryBarEventType,
  SummaryBarServiceAbstraction,
  SummaryBarType,
  TepItemPopUpServiceAbstraction,
  TepPaymentTypesEnum,
  TepStatusEnum,
  TepTransactionResponse,
  TepTypesEnum,
  TepUploadTypes,
  ToolbarConfig,
  TransactionTypeEnum,
  UpdateTepItemRequestPayload,
  ValidationTypesEnum,
  CUSTOMER_TYPE_ENUM,
  GrnApproverSuccessList,
  GrnApprovalTypeEnums,
  RsoNameObject,
  PanFormVerifyPopupServiceAbstraction,
  CustomerServiceAbstraction
} from '@poss-web/shared/models';
import { OrderConfirmationFacade } from '@poss-web/shared/order-confirmation/data-access-order-confirmation';
import { PaymentFacade } from '@poss-web/shared/payment/data-access-payment';
import { PrintingService } from '@poss-web/shared/printing/feature-printing';
import { TepFacade } from '@poss-web/shared/tep/data-access-direct-tep';
import { ToolbarFacade } from '@poss-web/shared/toolbar/data-access-toolbar';
import { POSS_WEB_COIN_PRODUCT_GROUP_CODE } from '@poss-web/shared/util-config';
import { ErrorEnums } from '@poss-web/shared/util-error';
import {
  getManualCashMemoUrl,
  getManualTepUrl,
  getSalesHomePageUrl
} from '@poss-web/shared/util-site-routes';
import * as moment from 'moment';
import { Moment } from 'moment';
import { Observable, Subject } from 'rxjs';
import { filter, take, takeUntil } from 'rxjs/operators';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { GrnFacade } from '@poss-web/poss/grn/data-access-grn';
import { SharedBodEodFacade } from '@poss-web/shared/bod-eod/data-access-bod-eod';
import { ElementPermissionService } from '@poss-web/shared/permission/util-element-permissions';
import { PermissionFacade } from '@poss-web/shared/permission/data-access-permission';
import { ValidateCustomerService } from '@poss-web/shared/customer/feature-customer-create';
// import { TepExceptionPopupComponent } from 'libs/poss/tep/ui-tep-exception/src/lib/tep-exception-popup/tep-exception-popup.component';

@Component({
  selector: 'poss-web-manual-tep',
  templateUrl: './manual-tep.component.html',
  styleUrls: ['./manual-tep.component.scss']
})
export class ManualTepComponent implements OnInit {
  @ViewChild('tepSuccessNotificationTemplate', { static: true })
  private tepSuccessNotificationTemplate: TemplateRef<any>;
  @ViewChild(ProductSearchAutocompleteComponent)
  private searchComponent: ProductSearchAutocompleteComponent;
  customerId = null;
  cashMemoId = null;
  isLoading$: Observable<boolean>;
  destroy$: Subject<null> = new Subject<null>();
  actionType = ValidationTypesEnum.REGULARIZE;
  TransactionTypeEnumRef = TransactionTypeEnum;
  detailsFlag$: Subject<boolean> = new Subject<boolean>();
  toolbarData: ToolbarConfig = {
    txnType: TransactionTypeEnum.TEP,
    subTxnType: SubTransactionTypeEnum.MANUAL_TEP,
    loadMetalPrices: true,
    loadHoldPopup: true,
    loadOpenOrdersPopup: true
  };
  summaryBarRemarks$ = new Subject<string>();
  currencyCode: string;
  isLoggedIn: boolean;
  paymentDetails: PaymentDetails[];
  printErrorText: string;
  manualBillDetails = null;
  tepPaymentTypesEnum = TepPaymentTypesEnum;
  createTepTypesEnum = CreateTepTypesEnum;
  tepStatusEnum = TepStatusEnum;
  createTepFormGroup: FormGroup;
  rsoNamesList: SelectDropDownOption[] = [];
  selectedRso: SelectDropDownOption;
  clearSelectedRsoName = false;
  searchProductList$: Observable<SearchProductList[]>;
  searchEnableFlag$: Observable<boolean>;
  tepItemList: any[] = [];
  cumulativeRefundAmt: number;
  isCashRefundAllowed: boolean;
  tepTransactionId: string;
  tepItemConfiguration: GetTepItemConfiguratonResponse;
  // recentlyAddedUniqueRowId: string;
  isProductSearchLoading$: Observable<boolean>;
  roleCode = RoleCodesEnum.RSO;
  itemCode = '';
  modalDetails: SaveTepDataType;
  deleteId = '';
  deleteIdForSoftDelete = '';
  standardMetalRates: any;
  totalQty = 0;
  totalGrossWt = 0;
  totalExchangeAmt = 0;
  totalTax = 0;
  totalValue = 0;
  selectCustomerAlertMessage = '';
  selectRsoNameAlertMessage = '';
  addRemarksAlertMessage = '';
  invalidRemarksAlertMessage = '';
  itemAddedAlreadyAlertMsg = '';
  technicalIssueInTransactionIdAlertMessage = '';
  coinOfferDiscountEnabledAlertMsg = '';
  productGroupIsNotEligibleForTepAlertMsg = '';
  interBrandTepNotEligibleAlertMsg = '';
  pleaseEnableCoinOfferDiscount = '';
  oneItemCanBeAddedInWorkflow = '';
  productRequiredWorkflowAlertMsg = '';
  saleableModifiedAlertMsg = '';
  transactionDeletedAlertMsg = '';
  noValuationDetailsWiththeItemAlertMsg = '';
  deleteVariantGridRowsAlertMsg = '';
  selectRefundTypeAlertMsg = '';
  enterNameAsPerBankRecordAlertMsg = '';
  enterProperDataInRefundFormAlertMsg = '';
  enterAccountHoldersNameAlertMsg = '';
  enterAccountNumberAlertMsg = '';
  reenterAccountNumberAlertMsg = '';
  enterBankNameAlertMsg = '';
  enterBranchNameAlertMsg = '';
  enterIfscCodeAlertMsg = '';
  accountNumbersNotMatchingAlertMsg = '';
  selectReasonAlertMsg = '';
  creditNoteNumber: number;
  docNo: number;
  reqDocNo: number;
  tepCnNo: number;
  status: string;
  openStatus: string;
  paymentOptionTypes = ['Cash', 'Cheque', 'RTGS'];
  isOpenTask = false;
  isViewTepItemPriceDetails = false;
  isSaleableModified = false;
  cashMemoDetailsId = null;
  transactionTypeEnum = TransactionTypeEnum;
  subTransactionTypeEnum = SubTransactionTypeEnum;
  refundDetails: RefundDetails;
  isCashLimitExceeded: boolean;
  refundDeductionAmt: number;
  netRefundAmt: number;
  subrefundMode: [];
  selectedPaymentMode: string;
  isTransactionSuccess = false;
  viewSelectedTepItemData: any;
  isTepRequestApprovalItemAlreadyAdded = false;
  selectedCustomer: any;
  isRefundFormValid = false;
  refundDetailsFromRefundForm: RefundDetails;
  isItemSaleable = false;
  transactionStatus = '';
  itemProductGroupCode = '';
  idProofImageUrl: string;
  cancelledChequeImageUrl: string;
  approvalMailImageUrl: string;
  uploadType: TepUploadTypes;
  reasonsForFullValueTep = [];
  approverListForFvt = [];
  lastHoldTime: Moment;
  tepHoldTimeInMinutes: number;
  saleableModifiedRowKey: any;
  isTepException: boolean = false;
  maxFlatTepException: number;
  alertMsgForPan: string;
  customerPAN: any;
  TepExceptionData: any;
  maxAllowedAmount: number;
  refundFormGroup: FormGroup;
  businessDay: number;
  remarks = '';
  customerType: any;
  form60Submitted: boolean;
  currentLocationCode: string;
  approverProcessType = '';
  addedItemCmDocDate = null;
  businessDate: any;
  isLastTransactionPrint = false;
  gstNumber: string;
  idProof: string;
  allowedPaymentMode: string;
  isCommonLoading$: Observable<boolean>;
  studdedProductGroupCodes = [];
  isProfileMatched: boolean;
  cashRefundLimit: number;
  panMandatoryForTEP: boolean;
  permissions$: Observable<any[]>;

  TEP_CONFIRM_MANUAL_TEP_SUBMENU =
    'Customer Transaction Status-TEP Confirm Manual TEP Submenu';
  TEP_MANUAL_TEP_ADD_EDIT =
    'Customer Transaction Status-TEP Add/Edit Manual Submenu';
  hideRefundSection: boolean;

  constructor(
    public customerFacade: CustomerFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private summaryBar: SummaryBarServiceAbstraction,
    private printingFacade: PrintingFacade,
    private tepFacade: TepFacade,
    private toolbarFacade: ToolbarFacade,
    private translate: TranslateService,
    private paymentFacade: PaymentFacade,
    private commonFacade: CommonFacade,
    private authFacade: AuthFacade,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private productFacade: ProductFacade,
    private orderConfirmationFacade: OrderConfirmationFacade,
    public printingService: PrintingService,
    private overlayNotificationServiceAbstraction: OverlayNotificationServiceAbstraction,
    private tepItemPopUpServiceAbstraction: TepItemPopUpServiceAbstraction,
    private locationSettingsFacade: LocationSettingsFacade,
    private alertPopupService: AlertPopupServiceAbstraction,
    private dialog: MatDialog,
    private postConfirmationActions: PostTransactionConfirmationActionsServiceAbstraction,
    private bodEodFeatureService: SharedBodEodFeatureServiceAbstraction,
    private discountsSelectionService: DiscountsSelectionServiceAbstraction,
    @Inject(POSS_WEB_COIN_PRODUCT_GROUP_CODE) public coinCode: string,
    private panCardServiceAbstraction: PanCardPopupAbstraction,
    private grnFacade: GrnFacade,
    private fieldValidatorsService: FieldValidatorsService,
    private bodeodFacade: SharedBodEodFacade,
    private panFormVerifyPopupService: PanFormVerifyPopupServiceAbstraction,
    private permissionfacade: PermissionFacade,
    private elementPermission: ElementPermissionService,
    private customerService: CustomerServiceAbstraction,
    private validateCustomerService: ValidateCustomerService
  ) {
    this.createTepFormGroup = new FormGroup({
      fvtApprovalDate: new FormControl(null),
      fvtApprover: new FormControl(null),
      fvtReason: new FormControl(null),
      tepType: new FormControl(this.createTepTypesEnum?.MANUAL_TEP),
      tepPaymentType: new FormControl(this.tepPaymentTypesEnum.CN),
      selectedPaymentOptionForRefund: new FormControl(
        this.paymentOptionTypes[0]
      ),
      coinOfferDiscount: new FormControl(false),
      fvtApprovalCode: new FormControl(null)
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
    this.permissions$ = this.permissionfacade.getPermissionforURL();
    this.tepFacade.LoadRsoList(this.roleCode);
    this.bodeodFacade.loadLatestBusinessDay();
    this.bodEodFeatureService
      .getBusinessDayDate()
      .pipe(takeUntil(this.destroy$))
      .subscribe(businessDate => {
        this.businessDate = moment(businessDate);
        if (this.businessDate) {
          this.createTepFormGroup
            .get('fvtApprovalDate')
            .setValue(this.businessDate);
          this.createTepFormGroup.updateValueAndValidity();
        }
      });
    this.customerFacade
      .getAllowedTransactionTypes()
      .pipe(takeUntil(this.destroy$))
      .subscribe(allowedTransactionTypes => {
        let transactionTypes = [];
        if (allowedTransactionTypes) {
          for (const [key, value] of allowedTransactionTypes.entries()) {
            value.forEach(type => {
              transactionTypes = [...transactionTypes, type];
            });
          }
          if (!transactionTypes.includes(TransactionTypeEnum.TEP)) {
            this.openCustomerSearchAvailabilityValidationDialog();
          }
        }
      });
    this.commonFacade.loadTEPStandardMetalPriceDetails();
    this.initiateManualTEP();
  }

  loadPermission = (element: string) =>
    this.elementPermission.loadPermission(element, this.permissions$);

  openCustomerSearchAvailabilityValidationDialog() {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.INFO,
        message:
          'Customer configuration is not available for transaction type TEP. Please set configuration and try again.'
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        this.back();
      });
  }

  back() {
    this.router.navigate([getSalesHomePageUrl()], {
      queryParams: {
        menu: SalesMenuKeyEnum.CUSTOMER_TRANSACTION_MENU_KEY
      }
    });
  }

  initiateManualTEP() {
    this.tepFacade.loadStuddedProductDetails('S', 'TEP');
    this.grnFacade
      .getApprovers()
      .pipe(takeUntil(this.destroy$))
      .subscribe((approvers: GrnApproverSuccessList[]) => {
        this.approverListForFvt = approvers;
      });
    this.clearPage(true);
    this.commonFacade.setFileUploadVisible(false);
    this.locationSettingsFacade
      .getLocationSetting(
        LocationSettingAttributesEnum.BASECURRENCY_CURRENCY_CODE
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((currencyCode: string) => {
        this.currencyCode = currencyCode;
      });
    this.locationSettingsFacade
      .getLocationSetting(LocationSettingAttributesEnum.BANKING_PAYMENT_MODE)
      .pipe(takeUntil(this.destroy$))
      .subscribe((paymentMode: string) => {
        this.allowedPaymentMode = paymentMode;
      });

    this.locationSettingsFacade
      .getLocationSetting(LocationSettingAttributesEnum.GLOBAL_LOCATION_CODE)
      .pipe(takeUntil(this.destroy$))
      .subscribe((locationCode: string) => {
        this.currentLocationCode = locationCode;
        console.log('CURRENT LOCATION CODE :', this.currentLocationCode);
        if (this.currentLocationCode) {
          this.grnFacade.loadApprovers({
            data: {
              locationCode: this.currentLocationCode
            },
            ruleType: 'FTEP_APPROVAL_ACCESS_REGULAR'
          });
        }
      });
    this.componentInit();
    this.getCustomerResponse();
    this.getCashMemoReponse();
    this.authFacade
      .isUserLoggedIn()
      .pipe(takeUntil(this.destroy$))
      .subscribe((isLoggedIn: boolean) => {
        this.isLoggedIn = isLoggedIn;
      });
    this.setRequestForApprovalDetails();
    this.commonFacade.setTepTotalGrossWt(0);
    this.commonFacade.setTepTotalExchangeAmt(0);
    this.commonFacade.setTepTotalRefundAmt(0);
    this.commonFacade.setTepTotalQty(0);
    this.commonFacade.setIsTepRefundFormValid(false);
    this.commonFacade.setIsTepRequestRaising(false);
    this.commonFacade.setTepSelectedPaymentMethod(null);
    this.getTranslatedAlertMessages();
    this.getStandardMetalRates();
    this.tepFacade.loadFvtReasons();
    this.searchProductList$ = this.productFacade.getSearchProductList();
    this.productFacade.setGridSearchEnable(true);
    this.searchEnableFlag$ = this.productFacade.getGridSearchEnable();
    const toolbarData: ToolbarConfig = {
      txnType: TransactionTypeEnum.TEP,
      subTxnType: this.createTepFormGroup.get('tepType').value, // NEW_TEP
      loadMetalPrices: true,
      loadHoldPopup: true,
      loadOpenOrdersPopup: true
    };
    this.toolbarFacade.setToolbarConfig(toolbarData);
    this.commonFacade.setTransactionConfig({
      transactionType: {
        type: TransactionTypeEnum.TEP,
        subType: this.createTepFormGroup.get('tepType').value
      }
    });
    this.tepFacade
      .getStuddedProductGroupCodes()
      .pipe(takeUntil(this.destroy$))
      .subscribe((codes: string[]) => {
        if (codes) {
          this.studdedProductGroupCodes = codes;
        }
      });
    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.TEP,
        CommomStateAttributeNameEnum.IS_TEP_REQUEST_RAISING
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((isTepRequestRaising: boolean) => {
        //if (isTepRequestRaising) {
        this.isTepRequestApprovalItemAlreadyAdded = isTepRequestRaising;
        //}
      });
    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.TEP,
        CommomStateAttributeNameEnum.IS_TEP_REFUND_FORM_VALID
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((isRefundFormValid: boolean) => {
        if (isRefundFormValid) {
          this.isRefundFormValid = true;
        } else {
          this.isRefundFormValid = false;
        }
      });

    this.tepFacade
      .getRefundCashLimit()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.isCashRefundAllowed = data?.isCashPaymentAllowed;
          this.hideRefundSection = false;
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
    const id = this.activatedRoute.snapshot.params['_id'];
    this.transactionStatus = this.activatedRoute.snapshot.queryParams['status'];

    if (id && this.transactionStatus === TepStatusEnum.APPROVED) {
      this.router.navigate([getManualTepUrl('new')]);
    }

    if (id && this.transactionStatus === TepStatusEnum.APPROVED) {
      this.commonFacade.loadTEPStandardMetalPriceDetails();
      this.tepFacade.loadTepTransactionDetails(
        id,
        this.createTepFormGroup.get('tepType').value
      );
      this.commonFacade.setTransactionTD(id);
    }
    const isManualTepTabSelected = this.router.url.includes('manual-tep');
    this.commonFacade.setFileUploadVisible(false);
    if (id !== 'new' && isManualTepTabSelected) {
      this.tepItemList = [];
      this.clearTepData();
      this.tepFacade.clearTepItemDetails();
      this.tepFacade.LoadRsoList(this.roleCode);
      this.commonFacade.loadTEPStandardMetalPriceDetails();
      this.tepFacade.loadTepTransactionDetails(
        id,
        this.createTepFormGroup.get('tepType').value
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
          (event: Event) => event instanceof NavigationEnd && this.isLoggedIn
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        const id = this.activatedRoute.snapshot.params['_id'];
        this.transactionStatus = this.activatedRoute.snapshot.queryParams[
          'status'
        ];
        const isManualTepTabSelected = this.router.url.includes('manual-tep');
        this.commonFacade.setFileUploadVisible(false);
        if (id !== 'new' && isManualTepTabSelected) {
          this.tepItemList = [];
          this.clearTepData();
          this.tepFacade.clearTepItemDetails();
          this.tepFacade.LoadRsoList(this.roleCode);
          this.commonFacade.loadTEPStandardMetalPriceDetails();
          this.tepFacade.loadTepTransactionDetails(
            id,
            this.createTepFormGroup.get('tepType').value
          );
          this.commonFacade.setTransactionTD(id);
        } else {
          this.isOpenTask = false;
        }
      });
    this.isLoading$ = this.tepFacade.getIsLoading();
    this.isProductSearchLoading$ = this.productFacade.getIsLoading();
    this.tepFacade.LoadRsoList(this.roleCode);
    this.getTotalQty();
    this.getTotalExchangeAmt();
    this.getTotalGrossWt();
    this.getRsoList();
    this.getError();
    this.getProductFacadeError();
    this.showSummaryBar();
    this.getSelectedCustomer();
    this.getTepTransactionResponse();
    this.getTepItemResponse();
    this.getOpenTepTransactionId();
    this.getUpdateTepTransactionResponse();
    this.getSelectedRsoName();
    this.getTepItemProductCodeDetail();
    this.getTepItemConfiguration();
    this.getAddTepItemToGridResponse();
    this.getDeleteTepItemResponse();
    this.getTepHoldOrConfirmationResponse();
    this.getDeleteTepTransactionResponse();
    this.getUpdateTepTransactionPriceDetailsResponse();
    this.tepFacade
      .getTepCashMemoResponseItemList()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data?.results[0]?.cashMemoDetailsId) {
          this.cashMemoDetailsId = data?.results[0]?.cashMemoDetailsId;
        }
      });
    this.createTepFormGroup
      .get('tepPaymentType')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        this.getSelectedPaymentOption(value);
      });
    this.customerFacade
      .getSelectSelectedCustomer()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.selectedCustomer = data;
          this.customerId = data.customerId;
          if (this.tepTransactionId) {
            const updateOpenTepTxn: PatchTepRequestPayload = {
              customerId: this.customerId
            };
            this.tepFacade.updateOpenTepTransaction(
              this.tepTransactionId,
              this.createTepFormGroup.get('tepType').value,
              updateOpenTepTxn
            );
          }
          if (this.customerId && this.netRefundAmt) {
            this.hideRefundSection = true;
            this.tepFacade.loadRefundCashLimit(
              this.customerId,
              this.netRefundAmt,
              TransactionTypeEnum.TEP
            );
          }
          if (this.tepItemList.length === 1) {
            this.tepFacade.loadTepItemExceptionConfiguration(
              this.tepItemList[0].variantCode,
              this.createTepFormGroup.get('tepType').value,
              false,
              this.selectedCustomer?.mobileNumber
            );
          }
          if (
            data?.customerType === CUSTOMER_TYPE_ENUM.INSTITUTIONAL &&
            this.tepItemList.length > 0
          ) {
            this.tepItemList.forEach(x => {
              this.deleteTepItemById({ itemId: x.itemId });
            });
          }
        } else {
          this.customerId = null;
        }
      });
    this.bodEodFeatureService
      .getBusinessDayDate()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.businessDay = data;
      });
    this.tepFacade
      .getFileApprovalMailDownloadUrl()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: string) => {
        if (data) {
          this.approvalMailImageUrl = data;
        }
      });
    this.tepFacade
      .getFvtReasons()
      .pipe(takeUntil(this.destroy$))
      .subscribe((fvtReasons: string[]) => {
        this.reasonsForFullValueTep = fvtReasons.map((reason: string) => {
          return {
            value: reason,
            description: reason
          };
        });
      });
    this.locationSettingsFacade
      .getLocationSetting(LocationSettingAttributesEnum.TEP_HOLD_TIME)
      .pipe(takeUntil(this.destroy$))
      .subscribe(tepHoldTime => {
        if (tepHoldTime) {
          this.tepHoldTimeInMinutes = Number(tepHoldTime);
          this.commonFacade.setConfigHoldTime(this.tepHoldTimeInMinutes);
        }
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
      .subscribe(brandDetail => {
        if (brandDetail) {
          this.maxAllowedAmount =
            brandDetail?.panCardDetails?.data?.configurationAmountForTEP;
          this.panMandatoryForTEP =
            brandDetail.panCardDetails.data.isPanCardMandatoryforTEP;
        }
      });
    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.CASHMEMO,
        CommomStateAttributeNameEnum.IMAGE_URL_DATA
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        if (data && data.itemCode && data.imageUrl) {
          this.openItemImagePopup(data);
        }
      });
    this.isCommonLoading$ = this.commonFacade.getCommonFacadeAttributes(
      CommomStateAttributeTypeEnum.CASHMEMO,
      CommomStateAttributeNameEnum.LOADING
    );
    this.commonFacade.clearCmImageUrl();
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
    this.tepFacade
      .getAvailableDiscountsList()
      .pipe(takeUntil(this.destroy$))
      .subscribe((discountsList: DiscountsList[]) => {
        if (discountsList && discountsList.length > 1) {
          this.discountsSelectionService
            .open(discountsList)
            .pipe(takeUntil(this.destroy$))
            .subscribe((data: DiscountsList) => {
              if (data) {
                this.confirmOrHoldTep(
                  TepStatusEnum.CONFIRMED,
                  this.createTepFormGroup.get('tepPaymentType').value,
                  this.remarks,
                  data.discountType
                );
              }
            });
        } else if (discountsList && discountsList.length < 2) {
          const discountTypeSelected =
            discountsList.length === 1 ? discountsList[0].discountType : null;
          this.confirmOrHoldTep(
            TepStatusEnum.CONFIRMED,
            this.createTepFormGroup.get('tepPaymentType').value,
            this.remarks,
            discountTypeSelected
          );
        }
      });
    this.isCashLimitExceeded = false;
    this.refundDeductionAmt = 0;
    this.netRefundAmt = 0;
  }

  ngOnChanges() {
    this.commonFacade.setTransactionConfig({
      transactionType: {
        type: TransactionTypeEnum.TEP,
        subType: this.createTepFormGroup.get('tepType').value
      }
    });
  }

  getCashMemoReponse() {
    this.tepFacade
      .getCreateOpenTepTransactionResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        if (data !== null) {
          const manualData = { ...data };
          manualData.manualBillDetails = {
            ...manualData.manualBillDetails.manualBillDetails
          };
          manualData.manualBillDetails['validationType'] =
            data.manualBillDetails.validationType;
          this.manualBillDetails = manualData;
          console.log('MANUAL DATA :', manualData);
          this.detailsFlag$.next(true);
          this.cashMemoId = data.id;
          const requestPayload: PatchTepRequestPayload = {
            customerId: this.customerId
          };
          this.tepFacade.updateOpenTepTransaction(
            this.cashMemoId,
            this.createTepFormGroup.get('tepType').value,
            requestPayload
          );
          this.commonFacade.setTransactionTD(data.id);
          this.commonFacade.setTepOrderNumber({
            orderNo: data.docNo,
            status: StatusTypesEnum.OPEN
          });
          this.loadOpenValues();
          this.productFacade.setGridSearchEnable(true);
          if (this.customerId) {
            this.customerFacade.loadSelectedCustomer(
              String(this.customerId),
              false
            );
          }
          const val = data?.manualBillDetails?.validationType;
          if (val === ValidationTypesEnum.PASSWORD_VALIDATION) {
            this.actionType = ValidationTypesEnum.REGULARIZE;
          } else if (val === ValidationTypesEnum.REQUEST_APPROVAL) {
            this.actionType = ValidationTypesEnum.SENDAPPROVAL;
          }
        }
      });
  }

  getCustomerResponse() {
    this.customerFacade
      .getSelectSelectedCustomer()
      .pipe(takeUntil(this.destroy$))
      .subscribe(customer => {
        if (customer) {
          this.customerId = customer.customerId;
        }
      });
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

  loadOpenValues() {
    this.toolbarFacade.loadOpenOrdersCount({
      status: StatusTypesEnum.OPEN,
      txnType: TransactionTypeEnum.TEP,
      subTxnType: this.createTepFormGroup.get('tepType').value
    });
    this.toolbarFacade.loadOpenOrders({
      searchValue: '',
      status: StatusTypesEnum.OPEN,
      txnType: TransactionTypeEnum.TEP,
      subTxnType: this.createTepFormGroup.get('tepType').value,
      pageIndex: 0,
      pageSize: 10
    });
  }

  loadHoldValues() {
    this.toolbarFacade.loadOnHoldCount({
      status: StatusTypesEnum.HOLD,
      txnType: TransactionTypeEnum.TEP,
      subTxnType: this.createTepFormGroup.get('tepType').value
    });
    this.toolbarFacade.loadOnHold({
      searchValue: '',
      status: StatusTypesEnum.HOLD,
      txnType: TransactionTypeEnum.TEP,
      subTxnType: this.createTepFormGroup.get('tepType').value,
      pageIndex: 0,
      pageSize: 10
    });
  }

  componentInit() {
    this.isLoading$ = this.tepFacade.getIsLoading();
    this.toolbarFacade.setToolbarConfig(this.toolbarData);
    this.commonFacade.setTransactionConfig({
      isPaymentEditable: true,
      transactionType: {
        type: TransactionTypeEnum.TEP,
        subType: this.createTepFormGroup.get('tepType').value
      }
    });

    this.tepFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
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
  }

  validateBill(event: ManualBillRequest) {
    // if (this.customerId !== null) {
    this.tepFacade.setHoldTransactionMetalRates(
      event?.manualBillDetails?.metalRates
    );
    this.tepFacade.createOpenTepTransaction(
      this.createTepFormGroup.get('tepType').value,
      event
    );
    // }
  }

  showSuccessMessageNotification() {
    this.overlayNotification
      .show({
        type: OverlayNotificationType.CUSTOM,
        message: '',
        hasBackdrop: true,
        hasClose: true
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: OverlayNotificationEventRef) => {
        this.clearPage(true);
        this.router.navigate([getManualCashMemoUrl()]);
      });
  }

  clearPage(clearTransactionID: boolean) {
    if (clearTransactionID) {
      this.commonFacade.clearTransactionTD();
      this.productFacade.clearProductGrid();
      this.productFacade.setGridSearchEnable(false);
    }
    this.commonFacade.clearCashMemo();
    this.tepFacade.resetTep();
    this.customerId = null;
    this.cashMemoId = null;
    this.customerFacade.clearCustomerSearch();
    this.overlayNotification.close();
    this.detailsFlag$.next(false);
    this.commonFacade.setTepOrderNumber({
      orderNo: 0,
      status: null
    });
    this.summaryBarRemarks$.next('');
    this.orderConfirmationFacade.resetValues();
  }

  expireTime(time: Moment) {
    const momentTime = moment(time);
    const currentTime = moment();
    const leftOverMinutes = currentTime.diff(moment(momentTime), 'minutes');
    if (leftOverMinutes <= this.tepHoldTimeInMinutes) {
      return currentTime
        .add(this.tepHoldTimeInMinutes - leftOverMinutes, 'minutes')
        .format('hh:mm A');
    } else {
      return ValidationTypesEnum.EXPIRED;
    }
  }

  updateTepTransactionPriceDetails() {
    this.tepFacade.updateTepTransactionPriceDetails(
      this.tepTransactionId,
      this.createTepFormGroup.get('tepType').value
    );
  }

  getUpdateTepTransactionPriceDetailsResponse() {
    this.tepFacade
      .getUpdateTepTransactionPriceDetailsResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe((dataResponse: TepTransactionResponse) => {
        if (dataResponse) {
          this.openStatus = dataResponse.status;
          this.tepTransactionId = dataResponse.id;
          this.customerId = dataResponse.customerId;
          this.lastHoldTime = dataResponse.lastHoldTime;
          this.updateTransactionDetailsOnScreen(dataResponse);
          this.showAlertNotification(
            'Hold time expired. Price is recalculated.'
          );
        } else {
          this.isOpenTask = false;
        }
        this.tepFacade.clearUpdateTepTransactionPriceDetailsResponse();
      });
  }

  updateTransactionDetailsOnScreen(
    tepTransactionDetails: TepTransactionResponse
  ) {
    this.tepItemList = [];
    this.tepFacade.loadFvtReasons();
    this.commonFacade.loadTEPStandardMetalPriceDetails();
    this.isOpenTask = true;
    this.commonFacade.setTepOrderNumber({
      orderNo: tepTransactionDetails.docNo,
      status: this.openStatus
    });
    if (
      this.createTepFormGroup.get('tepType').value ===
      CreateTepTypesEnum.MANUAL_FULL_VALUE_TEP
    ) {
      this.commonFacade.setIsTepRequestRaising(true);
    }
    const rsoNames = this.rsoNamesList.map(
      (rsoNameObj: { value: string; description: string }) => {
        return rsoNameObj.value;
      }
    );
    if (rsoNames.includes(tepTransactionDetails.employeeCode)) {
      this.selectedRso = {
        value: tepTransactionDetails.employeeCode,
        description: tepTransactionDetails.employeeCode
      };
      this.onSelectedRSONameChanged(this.selectedRso);
    } else {
      this.selectedRso = {
        value: tepTransactionDetails.employeeCode,
        description: tepTransactionDetails.employeeCode
      };
    }
    if (tepTransactionDetails.customerId) {
      if (this.openStatus !== StatusTypesEnum.HOLD) {
        this.customerFacade.loadSelectedCustomer(
          String(tepTransactionDetails.customerId)
        );
      } else {
        this.customerFacade.loadSelectedCustomer(
          String(tepTransactionDetails.customerId),
          false,
          false
        );
      }
    }
    if (tepTransactionDetails && tepTransactionDetails.manualBillDetails) {
      const manualData = { ...tepTransactionDetails };
      manualData.manualBillDetails = {
        ...tepTransactionDetails.manualBillDetails.manualBillDetails
      };
      manualData.manualBillDetails['validationType'] =
        tepTransactionDetails.manualBillDetails.validationType;
      this.manualBillDetails = manualData;
      this.detailsFlag$.next(true);
    }
    this.tepFacade.SetTotalQty(tepTransactionDetails.totalQuantity);
    this.commonFacade.setTepTotalQty(tepTransactionDetails.totalQuantity);
    this.tepFacade.SetTotalGrossWt(tepTransactionDetails.totalWeight);
    this.commonFacade.setTepTotalGrossWt(tepTransactionDetails.totalWeight);
    this.tepFacade.SetTotalExchangeAmt(tepTransactionDetails.totalValue);
    this.commonFacade.setTepTotalExchangeAmt(tepTransactionDetails.totalValue);
    this.netRefundAmt = tepTransactionDetails.netRefundAmount;
    this.totalTax = tepTransactionDetails.totalTax;
    this.totalValue = tepTransactionDetails.totalValue;
    this.cumulativeRefundAmt = tepTransactionDetails.cumulativeRefundAmt;
    this.summaryBarRemarks$.next(tepTransactionDetails.remarks);
    if (
      tepTransactionDetails &&
      tepTransactionDetails.refundDetails &&
      tepTransactionDetails.refundDetails.type
    ) {
      this.commonFacade.setIsTepRefundFormValid(true);
      this.tepFacade.setIsRefundFormValid(true);
      this.createTepFormGroup
        .get('tepPaymentType')
        .setValue(TepPaymentTypesEnum.REFUND);
      this.commonFacade.setFileUploadVisible(true);
      this.refundDetails = {
        refundTypeSelected: tepTransactionDetails.refundDetails.data.refundMode,
        nameAsPerBankRecord:
          tepTransactionDetails.refundDetails.data.refundMode ===
          RefundOptionTypes.CHEQUE
            ? tepTransactionDetails.refundDetails.data.customerName
            : null,
        accountHolderName:
          tepTransactionDetails.refundDetails.data.refundMode ===
          RefundOptionTypes.RTGS
            ? tepTransactionDetails.refundDetails.data.customerName
            : null,
        bankName: tepTransactionDetails.refundDetails.data.bankName,
        accountNumber: tepTransactionDetails.refundDetails.data.bankAccountNo,
        reenteredAccountNumber:
          tepTransactionDetails.refundDetails.data.bankAccountNo,
        branch: tepTransactionDetails.refundDetails.data.branchName,
        ifscCode: tepTransactionDetails.refundDetails.data.ifscCode
      };
      this.refundDetailsFromRefundForm = this.refundDetails;
      if (
        this.refundDetailsFromRefundForm &&
        this.refundDetailsFromRefundForm.refundTypeSelected &&
        (this.refundDetailsFromRefundForm.refundTypeSelected ===
          RefundOptionTypes.RTGS ||
          (this.refundDetailsFromRefundForm.refundTypeSelected ===
            RefundOptionTypes.RO_PAYMENT &&
            this.refundDetailsFromRefundForm?.paymentSubRefundModes ===
              RefundOptionTypes.RTGS &&
            (!this.refundDetailsFromRefundForm.accountHolderName ||
              !this.refundDetailsFromRefundForm.accountNumber ||
              !this.refundDetailsFromRefundForm.bankName ||
              !this.refundDetailsFromRefundForm.branch ||
              !this.refundDetailsFromRefundForm.ifscCode)) ||
          ((this.refundDetailsFromRefundForm.refundTypeSelected ===
            RefundOptionTypes.CHEQUE ||
            (this.refundDetailsFromRefundForm.refundTypeSelected ===
              RefundOptionTypes.RO_PAYMENT &&
              this.refundDetailsFromRefundForm?.paymentSubRefundModes ===
                RefundOptionTypes.CHEQUE)) &&
            !this.refundDetailsFromRefundForm.nameAsPerBankRecord))
      ) {
        this.refundDetailsFromRefundForm.invalid = true;
      }
    } else {
      this.createTepFormGroup
        .get('tepPaymentType')
        .setValue(TepPaymentTypesEnum.CN);
      this.commonFacade.setFileUploadVisible(false);
    }
    tepTransactionDetails.itemIdList.forEach((tepItemId: string) => {
      this.tepFacade.loadTepItemDetails(
        tepTransactionDetails.id,
        tepItemId,
        this.createTepFormGroup.get('tepType').value,
        this.createTepFormGroup.get('tepType').value,
        this.selectedCustomer && this.selectedCustomer.mobileNumber
          ? this.selectedCustomer.mobileNumber
          : null
      );
    });
    if (this.transactionStatus === TepStatusEnum.APPROVED) {
      this.createTepFormGroup.get('tepPaymentType').disable();
    } else {
      this.createTepFormGroup.get('tepPaymentType').enable();
    }
    this.createTepFormGroup.get('tepPaymentType').updateValueAndValidity();

    this.createTepFormGroup
      .get('fvtApprovalCode')
      .setValue(tepTransactionDetails.approvalDetails?.data?.approvalCode);
    console.log(
      'moment(tepTransactionDetails.approvalDetails?.data?.approvalDate) :',
      moment(tepTransactionDetails.approvalDetails?.data?.approvalDate)
    );
    this.createTepFormGroup
      .get('fvtApprovalDate')
      .setValue(
        moment(tepTransactionDetails.approvalDetails?.data?.approvalDate)
      );
    this.createTepFormGroup
      .get('fvtApprover')
      .setValue(tepTransactionDetails.approvalDetails?.data?.approvedBy);
    this.createTepFormGroup.updateValueAndValidity();
    this.approverProcessType =
      tepTransactionDetails.approvalDetails?.data?.processType;
    if (
      tepTransactionDetails.approvalDetails?.data?.processType ===
        GrnApprovalTypeEnums.EMAIL ||
      this.createTepFormGroup.get('tepPaymentType').value ===
        TepPaymentTypesEnum.REFUND
    ) {
      this.commonFacade.setFileUploadVisible(true);
    } else {
      this.commonFacade.setFileUploadVisible(false);
    }
    this.createTepFormGroup
      .get('fvtReason')
      .setValue(tepTransactionDetails.reason);
  }

  getTepTransactionResponse() {
    this.tepFacade
      .getTepTransactionDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe((tepTransactionDetails: TepTransactionResponse) => {
        if (tepTransactionDetails) {
          this.openStatus = tepTransactionDetails.status;
          this.tepTransactionId = tepTransactionDetails.id;
          this.commonFacade.setTransactionTD(this.tepTransactionId);
          this.customerId = tepTransactionDetails.customerId;

          this.lastHoldTime = tepTransactionDetails.lastHoldTime;
          if (this.openStatus === StatusTypesEnum.HOLD) {
            if (
              this.expireTime(this.lastHoldTime) === ValidationTypesEnum.EXPIRED
            ) {
              if (
                JSON.stringify(this.standardMetalRates) !==
                JSON.stringify(tepTransactionDetails?.metalRateList?.metalRates)
              ) {
                console.log(
                  'this.standardMetalRates :',
                  this.standardMetalRates
                );
                console.log(
                  'tepTransactionDetails?.metalRateList?.metalRates :',
                  tepTransactionDetails?.metalRateList?.metalRates
                );
                this.updateTepTransactionPriceDetails();
              } else {
                this.updateTransactionDetailsOnScreen(tepTransactionDetails);
                this.showAlertNotification('Hold Time Expired');
              }
            } else {
              this.updateTransactionDetailsOnScreen(tepTransactionDetails);
              this.tepFacade.setHoldTransactionMetalRates(
                tepTransactionDetails?.metalRateList?.metalRates
              );
            }
          } else {
            this.updateTransactionDetailsOnScreen(tepTransactionDetails);
            this.tepFacade.setHoldTransactionMetalRates(null);
          }
          this.tepFacade.setHoldTransactionMetalRates(
            tepTransactionDetails?.metalRateList?.metalRates
          );
        } else {
          this.isOpenTask = false;
        }
      });
  }

  getTepItemResponse() {
    this.tepFacade
      .getTepItemDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe((tepItemDetails: any) => {
        if (tepItemDetails) {
          this.itemCode = tepItemDetails.itemCode;
          this.subrefundMode = tepItemDetails?.subRefundModes;
          this.cashRefundLimit = tepItemDetails?.refundCashLimit;
          this.maxFlatTepException = tepItemDetails?.maxFlatTepException;
          const tepItemObject = {
            rowKey: tepItemDetails.priceDetails.itemId,
            cashMemoDetailsId: tepItemDetails.cashMemoDetailsId,
            lotNumber: tepItemDetails.lotNumber,
            variantCode: tepItemDetails.itemCode,
            cmAvailable: tepItemDetails.priceDetails.iscashMemoAvailable,
            grossWt: tepItemDetails.priceDetails.measuredWeight,
            saleable: tepItemDetails.isSaleable,
            discountRecovered: tepItemDetails.priceDetails.discountRecovered
              ? tepItemDetails.priceDetails.discountRecovered
              : 0,
            deductionAmt: tepItemDetails.priceDetails.deductionAmount
              ? tepItemDetails.priceDetails.deductionAmount
              : 0,
            netRefundAmount: tepItemDetails.netRefundValue
              ? tepItemDetails.netRefundValue
              : 0,
            exchangeValue: tepItemDetails.finalValue,
            totalTax: tepItemDetails.totalTax ? tepItemDetails.totalTax : 0,
            refundDeduction: tepItemDetails.priceDetails.refundDeductionAmount
              ? tepItemDetails.priceDetails.refundDeductionAmount
              : 0,
            formGroup: new FormGroup({
              cmAvailable: new FormControl({
                value: tepItemDetails.priceDetails.iscashMemoAvailable,
                disabled: true
              }),
              saleable: new FormControl({
                value: tepItemDetails.isSaleable,
                disabled:
                  !tepItemDetails.isTEPSaleBin ||
                  this.createTepFormGroup.get('tepType').value ===
                    this.createTepTypesEnum.MANUAL_INTER_BRAND_TEP ||
                  this.createTepFormGroup.get('tepType').value ===
                    this.createTepTypesEnum.MANUAL_FULL_VALUE_TEP
                    ? true
                    : false
              })
            }),
            itemId: tepItemDetails.itemId,
            stonesDetails: tepItemDetails.priceDetails.stones,
            stoneDetailsList: tepItemDetails.priceDetails.stones,
            stoneDetails: tepItemDetails.priceDetails.stones,
            discountDetails: tepItemDetails.discountDetails,
            unitWeight: tepItemDetails.priceDetails.measuredWeight,
            unitValue: tepItemDetails.unitValue,
            totalValue: tepItemDetails.totalValue,
            totalWeight: tepItemDetails.priceDetails.measuredWeight,
            quantity: tepItemDetails.quantity,
            viewPriceDetails: tepItemDetails.priceDetails
          };
          if (
            tepItemDetails.priceDetails &&
            tepItemDetails.priceDetails.refundDeductionAmount
          ) {
            this.refundDeductionAmt =
              this.refundDeductionAmt +
              (tepItemDetails.priceDetails.refundDeductionAmount
                ? tepItemDetails.priceDetails.refundDeductionAmount
                : 0);
            this.netRefundAmt =
              this.netRefundAmt +
              (tepItemDetails.netRefundValue
                ? tepItemDetails.netRefundValue
                : 0);
          }
          if (
            this.createTepFormGroup.get('tepPaymentType').value ===
            TepPaymentTypesEnum.REFUND
          ) {
            this.commonFacade.setTepTotalRefundAmt(this.netRefundAmt);
            this.commonFacade.setTepSelectedPaymentMethod(
              TepPaymentTypesEnum.REFUND
            );
            this.tepFacade.SetPaymentMethod(TepPaymentTypesEnum.REFUND);
          }
          this.tepItemList = [...this.tepItemList, tepItemObject];
          if (
            this.tepItemList.length === 1 &&
            tepItemDetails.priceDetails &&
            this.studdedProductGroupCodes.includes(
              tepItemDetails.priceDetails.productGroupCode
            ) &&
            !tepItemDetails.priceDetails.lotNumber &&
            tepItemDetails.priceDetails.cmDocNo
          ) {
            this.commonFacade.setIsTepRequestRaising(true);
            this.tepFacade.loadTepItemExceptionConfiguration(
              tepItemDetails.itemCode,
              this.createTepFormGroup.get('tepType').value,
              false,
              this.selectedCustomer?.mobileNumber
            );
          }
        }
        if (this.customerId) {
          this.hideRefundSection = true;
          this.tepFacade.loadRefundCashLimit(
            this.customerId,
            this.netRefundAmt,
            TransactionTypeEnum.TEP
          );
        }
      });
  }

  getTepHoldOrConfirmationResponse() {
    this.tepFacade
      .getConfirmTepItemResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe((confirmTepResponse: ConfirmTepItemResponse) => {
        if (confirmTepResponse) {
          this.status = confirmTepResponse.status
            ? confirmTepResponse.status.toUpperCase()
            : '';
          this.docNo = confirmTepResponse.docNo;
          this.tepCnNo = confirmTepResponse.cnDocNo;
          this.reqDocNo = confirmTepResponse.reqDocNo;
          this.showTepSuccessNotification();
          this.isOpenTask = false;
          this.commonFacade.setTepOrderNumber({
            orderNo: 0,
            status: null
          });
          this.loadOpenValues();
          this.loadHoldValues();
          this.isTransactionSuccess = true;
        }
      });
  }

  getTranslatedAlertMessages() {
    const selectCustomerAlertMessage = 'pw.grf.selectCustomerAlert';
    const selectRsoNameAlertMessage = 'pw.grf.selectRsoNameAlert';
    const addRemarksAlertMessage = 'pw.grf.addRemarksAlert';
    const reversePaymentAlertMessage = 'pw.grf.reversePaymentAlertMessage';
    const invalidRemarksAlertMessage = 'pw.grf.invalidRemarksAlertMessage';
    const technicalIssueInTransactionIdAlertMessage =
      'pw.grf.technicalIssueInTransactionIdAlertMessage';
    const coinOfferDiscountEnabledAlertMsg =
      'pw.tep.coinOfferDiscountEnabledAlertMsg';
    const pleaseEnableCoinOfferDiscount =
      'pw.tep.pleaseEnableCoinOfferDiscount';
    const itemAddedAlreadyAlertMsg = 'pw.tep.itemAddedAlreadyAlertMsg';
    const productGroupIsNotEligibleForTepAlertMsg =
      'pw.tep.productGroupIsNotEligibleForTepAlertMsg';
    const interBrandTepNotEligibleAlertMsg =
      'pw.tep.interBrandTepNotEligibleAlertMsg';
    const oneItemCanBeAddedInWorkflow = 'pw.tep.oneItemCanBeAddedInWorkflow';
    const productRequiredWorkflowAlertMsg =
      'pw.tep.productRequiredWorkflowAlertMsg';
    const saleableModifiedAlertMsg = 'pw.tep.saleableModifiedAlertMsg';
    const transactionDeletedAlertMsg = 'pw.tep.transactionDeletedAlertMsg';
    const noValuationDetailsWiththeItemAlertMsg =
      'pw.tep.noValuationDetailsWiththeItemAlertMsg';
    const deleteVariantGridRowsAlertMsg =
      'pw.tep.deleteVariantGridRowsAlertMsg';
    const selectRefundTypeAlertMsg = 'pw.tep.selectRefundTypeAlertMsg';
    const enterNameAsPerBankRecordAlertMsg =
      'pw.tep.enterNameAsPerBankRecordAlertMsg';
    const enterProperDataInRefundFormAlertMsg =
      'pw.tep.enterProperDataInRefundFormAlertMsg';
    const enterAccountHoldersNameAlertMsg =
      'pw.tep.enterAccountHoldersNameAlertMsg';
    const enterAccountNumberAlertMsg = 'pw.tep.enterAccountNumberAlertMsg';
    const reenterAccountNumberAlertMsg = 'pw.tep.reenterAccountNumberAlertMsg';
    const enterBankNameAlertMsg = 'pw.tep.enterBankNameAlertMsg';
    const enterBranchNameAlertMsg = 'pw.tep.enterBranchNameAlertMsg';
    const enterIfscCodeAlertMsg = 'pw.tep.enterIfscCodeAlertMsg';
    const accountNumbersNotMatchingAlertMsg =
      'pw.tep.accountNumbersNotMatchingAlertMsg';
    const selectReasonAlertMsg = 'pw.tep.selectReasonAlertMsg';
    this.translate
      .get([
        selectCustomerAlertMessage,
        selectRsoNameAlertMessage,
        addRemarksAlertMessage,
        reversePaymentAlertMessage,
        invalidRemarksAlertMessage,
        technicalIssueInTransactionIdAlertMessage,
        coinOfferDiscountEnabledAlertMsg,
        pleaseEnableCoinOfferDiscount,
        itemAddedAlreadyAlertMsg,
        productGroupIsNotEligibleForTepAlertMsg,
        interBrandTepNotEligibleAlertMsg,
        oneItemCanBeAddedInWorkflow,
        productRequiredWorkflowAlertMsg,
        saleableModifiedAlertMsg,
        transactionDeletedAlertMsg,
        noValuationDetailsWiththeItemAlertMsg,
        deleteVariantGridRowsAlertMsg,
        selectRefundTypeAlertMsg,
        enterNameAsPerBankRecordAlertMsg,
        enterProperDataInRefundFormAlertMsg,
        enterAccountHoldersNameAlertMsg,
        enterAccountNumberAlertMsg,
        reenterAccountNumberAlertMsg,
        enterBankNameAlertMsg,
        enterBranchNameAlertMsg,
        enterIfscCodeAlertMsg,
        accountNumbersNotMatchingAlertMsg,
        selectReasonAlertMsg
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(translatedMessages => {
        this.selectCustomerAlertMessage =
          translatedMessages[selectCustomerAlertMessage];
        this.selectRsoNameAlertMessage =
          translatedMessages[selectRsoNameAlertMessage];
        this.addRemarksAlertMessage =
          translatedMessages[addRemarksAlertMessage];
        this.invalidRemarksAlertMessage =
          translatedMessages[invalidRemarksAlertMessage];
        this.technicalIssueInTransactionIdAlertMessage =
          translatedMessages[technicalIssueInTransactionIdAlertMessage];
        this.coinOfferDiscountEnabledAlertMsg =
          translatedMessages[coinOfferDiscountEnabledAlertMsg];
        this.pleaseEnableCoinOfferDiscount =
          translatedMessages[pleaseEnableCoinOfferDiscount];
        this.itemAddedAlreadyAlertMsg =
          translatedMessages[itemAddedAlreadyAlertMsg];
        this.productGroupIsNotEligibleForTepAlertMsg =
          translatedMessages[productGroupIsNotEligibleForTepAlertMsg];
        this.interBrandTepNotEligibleAlertMsg =
          translatedMessages[interBrandTepNotEligibleAlertMsg];
        this.oneItemCanBeAddedInWorkflow =
          translatedMessages[oneItemCanBeAddedInWorkflow];
        this.productRequiredWorkflowAlertMsg =
          translatedMessages[productRequiredWorkflowAlertMsg];
        this.saleableModifiedAlertMsg =
          translatedMessages[saleableModifiedAlertMsg];
        this.transactionDeletedAlertMsg =
          translatedMessages[transactionDeletedAlertMsg];
        this.noValuationDetailsWiththeItemAlertMsg =
          translatedMessages[noValuationDetailsWiththeItemAlertMsg];
        this.deleteVariantGridRowsAlertMsg =
          translatedMessages[deleteVariantGridRowsAlertMsg];
        this.selectRefundTypeAlertMsg =
          translatedMessages[selectRefundTypeAlertMsg];
        this.enterNameAsPerBankRecordAlertMsg =
          translatedMessages[enterNameAsPerBankRecordAlertMsg];
        this.enterProperDataInRefundFormAlertMsg =
          translatedMessages[enterProperDataInRefundFormAlertMsg];
        this.enterAccountHoldersNameAlertMsg =
          translatedMessages[enterAccountHoldersNameAlertMsg];
        this.enterAccountNumberAlertMsg =
          translatedMessages[enterAccountNumberAlertMsg];
        this.reenterAccountNumberAlertMsg =
          translatedMessages[reenterAccountNumberAlertMsg];
        this.enterBankNameAlertMsg = translatedMessages[enterBankNameAlertMsg];
        this.enterBranchNameAlertMsg =
          translatedMessages[enterBranchNameAlertMsg];
        this.enterIfscCodeAlertMsg = translatedMessages[enterIfscCodeAlertMsg];
        this.accountNumbersNotMatchingAlertMsg =
          translatedMessages[accountNumbersNotMatchingAlertMsg];
        this.selectReasonAlertMsg = translatedMessages[selectReasonAlertMsg];
      });
  }

  coinOfferDiscountSelectionChanged(event: any) {
    if (event) {
      this.createTepFormGroup.get('coinOfferDiscount').setValue(event.checked);
      this.createTepFormGroup.get('coinOfferDiscount').updateValueAndValidity();
    }
  }

  showAlertNotification(message: string): void {
    this.overlayNotificationServiceAbstraction
      .show({
        type: OverlayNotificationType.SIMPLE,
        hasClose: true,
        hasBackdrop: true,
        message
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  getTotalQty() {
    this.tepFacade
      .getTotalQty()
      .pipe(takeUntil(this.destroy$))
      .subscribe((totalQty: number) => {
        if (totalQty) {
          this.totalQty = totalQty;
        }
      });
  }

  getTotalExchangeAmt() {
    this.tepFacade
      .getTotalExchangeAmt()
      .pipe(takeUntil(this.destroy$))
      .subscribe((totalExchangeAmt: number) => {
        if (totalExchangeAmt) {
          this.totalExchangeAmt = totalExchangeAmt;
        }
      });
  }

  getTotalGrossWt() {
    this.tepFacade
      .getTotalGrossWt()
      .pipe(takeUntil(this.destroy$))
      .subscribe((totalGrossWt: number) => {
        if (totalGrossWt) {
          this.totalGrossWt = totalGrossWt;
        }
      });
  }

  getStandardMetalRates() {
    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.TEP,
        CommomStateAttributeNameEnum.STANDARD_METAL_PRICE_DETAILS
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((standardMetalPriceDetails: any) => {
        this.standardMetalRates = standardMetalPriceDetails;
      });
  }

  getSelectedRsoName() {
    this.tepFacade
      .getSelectedRsoName()
      .pipe(takeUntil(this.destroy$))
      .subscribe((selectedRsoName: SelectDropDownOption) => {
        if (!selectedRsoName) {
          this.clearSelectedRsoName = true;
        }
        this.selectedRso = selectedRsoName;
      });
  }

  getRsoList() {
    this.tepFacade
      .getRsoList()
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: RsoNameObject[]) => {
        this.rsoNamesList = response;
      });
  }

  setTotalValueOfGridItems(event: any) {
    this.tepFacade.SetTotalQty(event.totalQty);
    this.commonFacade.setTepTotalQty(event.totalQty);
    this.tepFacade.SetTotalGrossWt(event.totalGrossWt);
    this.commonFacade.setTepTotalGrossWt(event.totalGrossWt);
    this.tepFacade.SetTotalExchangeAmt(event.totalExchangeValue);
    this.commonFacade.setTepTotalExchangeAmt(event.totalExchangeValue);
    if (
      this.createTepFormGroup.get('tepPaymentType').value ===
      TepPaymentTypesEnum.REFUND
    ) {
      this.commonFacade.setTepTotalRefundAmt(this.netRefundAmt); // #123
    }
    this.totalTax = event.totalTax;
    if (!this.customerId) {
      this.hideRefundSection = false;
    }
  }

  onPaymentMethodChanged(event: any) {
    if (
      this.createTepFormGroup.get('tepPaymentType').value ===
      TepPaymentTypesEnum.REFUND
    ) {
      this.commonFacade.setFileUploadVisible(true);
      this.commonFacade.setTepTotalRefundAmt(this.netRefundAmt); // #123
      this.tepFacade.setIsRefundFormValid(true);
      this.commonFacade.setIsTepRefundFormValid(true);
    } else {
      this.commonFacade.setFileUploadVisible(false);
      this.tepFacade.SetTotalExchangeAmt(this.totalExchangeAmt);
      this.commonFacade.setTepTotalExchangeAmt(this.totalExchangeAmt);
      this.tepFacade.setIsRefundFormValid(false);
      this.commonFacade.setIsTepRefundFormValid(false);
    }
    this.refundDetailsFromRefundForm = {
      accountHolderName: '',
      accountNumber: '',
      bankName: '',
      branch: '',
      ifscCode: '',
      invalid: true,
      nameAsPerBankRecord: '',
      reenteredAccountNumber: '',
      refundTypeSelected: '',
      paymentSubRefundModes: ''
    };
    this.refundDetails = null;
  }

  getError() {
    this.tepFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error && error.code) {
          this.clearSearchField();
          if (error.code === ErrorEnums.ERR_ENG_019) {
            const newErrorObj = {
              ...error,
              dynamicValues: {
                ...error.dynamicValues,
                enteredWeight: this.modalDetails.totalWeight
              }
            };
            this.errorHandler(newErrorObj);
          } else {
            this.errorHandler(error);
          }
        }
      });
  }

  getProductFacadeError() {
    this.productFacade
      .getHasError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error && error.code) {
          this.errorHandler(error);
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
      this.overlayNotificationServiceAbstraction
        .show({
          type: OverlayNotificationType.ERROR,
          hasClose: true, // optional
          error: error,
          hasBackdrop: true
        })
        .events.pipe(takeUntil(this.destroy$))
        .subscribe((event: OverlayNotificationEventRef) => {
          if (this.isTransactionSuccess) {
            this.showTepSuccessNotification();
          }
        });
    }
  }

  printError(message: string) {
    this.overlayNotificationServiceAbstraction

      .show({
        type: OverlayNotificationType.TIMER,
        message: message,
        hasClose: false
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: OverlayNotificationEventRef) => {
        if (!this.isLastTransactionPrint) this.showTepSuccessNotification(); //call your respective success overlay method
      });
  }

  getSelectedCustomer() {
    this.customerFacade
      .getSelectSelectedCustomer()
      .pipe(takeUntil(this.destroy$))
      .subscribe(customer => {
        if (customer && this.tepTransactionId) {
          this.customerId = customer.customerId;
          this.customerPAN = customer.custTaxNo;
          this.customerType = customer.customerType;
          this.form60Submitted =
            customer.customerDetails.data.form60AndIdProofSubmitted;
          this.gstNumber = customer.instiTaxNo;
          this.idProof = customer.customerDetails.data.idProof;
          const updateOpenTepTxn: PatchTepRequestPayload = {
            customerId: this.customerId
          };
          this.tepFacade.updateOpenTepTransaction(
            this.tepTransactionId,
            this.createTepFormGroup.get('tepType').value,
            updateOpenTepTxn
          );
        }
        if (!this.isOpenTask) {
          if (!this.tepTransactionId && customer && customer.customerId) {
            this.selectedCustomer = customer;
            this.customerId = customer.customerId;
            this.customerPAN = customer.custTaxNo;
            this.customerType = customer.customerType;
            this.form60Submitted =
              customer.customerDetails.data.form60AndIdProofSubmitted;
            this.gstNumber = customer.instiTaxNo;
            this.idProof = customer.customerDetails.data.idProof;
          }
        }
        if (!customer) {
          this.customerPAN = null;
          this.customerType = null;
          this.customerType = null;
          this.form60Submitted = null;
          this.gstNumber = null;
          this.idProof = null;
        }
      });
  }

  getOpenTepTransactionId() {
    this.tepFacade
      .getCreateOpenTepTransactionResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: CreateOpenTepTransactionResponse) => {
        if (response && response.id) {
          this.tepTransactionId = response.id;
          this.commonFacade.setTransactionTD(this.tepTransactionId);
          this.openStatus = response.status;
          this.commonFacade.setTepOrderNumber({
            orderNo: Number(response.docNo),
            status: this.openStatus
          });
          this.loadOpenValues();
          this.loadHoldValues();
          if (this.customerId && this.tepTransactionId) {
            const updateOpenTepTxn: PatchTepRequestPayload = {
              customerId: this.customerId
            };
            this.tepFacade.updateOpenTepTransaction(
              this.tepTransactionId,
              this.createTepFormGroup.get('tepType').value,
              updateOpenTepTxn
            );
            this.onSelectedRSONameChanged(this.selectedRso);
          }
        }
      });
  }

  getUpdateTepTransactionResponse() {
    this.tepFacade
      .getUpdateOpenTepTransactionResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe(response => console.log('Response :', response));
  }

  showTepSuccessNotification(): void {
    this.overlayNotificationServiceAbstraction
      .show({
        type: OverlayNotificationType.CUSTOM,
        hasBackdrop: true,
        hasClose: true,
        template: this.tepSuccessNotificationTemplate
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: OverlayNotificationEventRef) => {
        if (event.eventType === 0) {
          this.clearTepData();
          this.router.navigate([getManualTepUrl('new')]);
        }
      });
  }

  getTepItemConfiguration() {
    this.tepFacade
      .getTepItemConfiguratonResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: GetTepItemConfiguratonResponse) => {
        if (response) {
          this.deleteIdForSoftDelete = '';
          this.clearSearchField();
          this.isItemSaleable = response.isTEPSaleBin;
          this.subrefundMode = response?.subRefundModes;
          this.cashRefundLimit = response?.refundCashLimit;
          this.maxFlatTepException = response?.maxFlatTepException;
          if (
            (this.createTepFormGroup.get('tepType').value ===
              this.createTepTypesEnum.MANUAL_TEP &&
              response.isTepAllowed) ||
            (this.createTepFormGroup.get('tepType').value ===
              this.createTepTypesEnum.MANUAL_INTER_BRAND_TEP &&
              response.isInterBrandTepAllowed) ||
            (this.createTepFormGroup.get('tepType').value ===
              this.createTepTypesEnum.MANUAL_FULL_VALUE_TEP &&
              response.isFVTAllowed)
          ) {
            this.tepItemConfiguration = response;
            const itemObject = {
              ...this.tepItemConfiguration,
              itemCode: this.viewSelectedTepItemData
                ? this.viewSelectedTepItemData.variantCode
                : this.itemCode,
              rowKey: this.viewSelectedTepItemData
                ? this.viewSelectedTepItemData.rowKey
                : '',
              // : this.recentlyAddedUniqueRowId,
              coinOfferEnabled: this.createTepFormGroup.get('coinOfferDiscount')
                .value,
              isViewTepItemPriceDetails: this.isViewTepItemPriceDetails,
              viewSelectedTepItem: this.viewSelectedTepItemData,
              isTepRequestApprovedScenario: this.transactionStatus
                ? true
                : false,
              tepType: this.createTepFormGroup.get('tepType').value,
              productGroupCode: this.itemProductGroupCode,
              tepItemList: this.tepItemList
            };
            this.tepItemPopUpServiceAbstraction
              .open(itemObject)
              .subscribe((modalData: any) => {
                this.hideRefundSection = true;
                console.log('MODAL DATA $$$ :', modalData);
                if (
                  modalData &&
                  !modalData.viewTepItemData &&
                  modalData.type !== 'UPDATE_ITEMCODE'
                ) {
                  this.modalDetails = modalData;
                  this.isViewTepItemPriceDetails = false;
                  if (
                    this.tepItemList.length > 0 &&
                    this.isTepRequestApprovalItemAlreadyAdded
                  ) {
                    this.showAlertNotification(
                      this.oneItemCanBeAddedInWorkflow
                    );
                  } else if (
                    this.tepItemList.length > 1 &&
                    !this.isTepRequestApprovalItemAlreadyAdded &&
                    this.modalDetails.cashMemoDetailsId &&
                    !this.modalDetails.lotNumber &&
                    this.tepItemConfiguration.isCMMandatory &&
                    this.modalDetails.productGroupCode === '72'
                  ) {
                    this.showAlertNotification(
                      this.productRequiredWorkflowAlertMsg
                    );
                  } else {
                    if (
                      (this.tepItemList.length === 1 &&
                        !this.isTepRequestApprovalItemAlreadyAdded &&
                        this.modalDetails.cashMemoDetailsId &&
                        !this.modalDetails.lotNumber &&
                        this.tepItemConfiguration.isCMMandatory &&
                        this.studdedProductGroupCodes.includes(
                          this.modalDetails.productGroupCode
                        )) ||
                      this.createTepFormGroup.get('tepType').value ===
                        CreateTepTypesEnum.MANUAL_FULL_VALUE_TEP
                    ) {
                      this.commonFacade.setIsTepRequestRaising(true);
                    } else {
                      this.commonFacade.setIsTepRequestRaising(false);
                    }
                    const addTepItemRequestPayload: AddTepItemRequestPayload = {
                      cashMemoDetailsId: this.modalDetails.cashMemoDetailsId,
                      finalValue: modalData.exchangeValue,
                      isSaleable: modalData.saleableValue,
                      itemCode: modalData.variantCode,
                      quantity: modalData.quantity,
                      stonesDetails: modalData.stonesDetails,
                      totalValue: modalData.totalValue,
                      totalWeight: modalData.totalWeight,
                      unitValue: modalData.unitValue,
                      unitWeight: modalData.unitWeight,
                      discountDetails: modalData.discountDetails,
                      stoneDetailsList: modalData.stoneDetailsList
                    };

                    this.tepFacade.addTepItem(
                      this.tepTransactionId,
                      this.createTepFormGroup.get('tepType').value,
                      addTepItemRequestPayload
                    );
                  }
                } else if (
                  modalData &&
                  modalData.viewTepItemData &&
                  modalData.type !== 'UPDATE_ITEMCODE'
                ) {
                  this.modalDetails = modalData;
                  const updateTepItemRequestPayload: UpdateTepItemRequestPayload = {
                    finalValue: modalData.exchangeValue,
                    isSaleable: modalData.saleableValue,
                    quantity: modalData.quantity,
                    stonesDetails: modalData.stonesDetails
                      ? modalData.stonesDetails
                      : [],
                    totalValue: modalData.totalValue,
                    totalWeight: modalData.totalWeight,
                    unitValue: modalData.unitValue,
                    unitWeight: modalData.unitWeight
                  };

                  this.tepFacade.updateTepItem(
                    this.tepTransactionId,
                    modalData.viewTepItemData.itemId,
                    this.createTepFormGroup.get('tepType').value,
                    updateTepItemRequestPayload
                  );
                  this.isViewTepItemPriceDetails = false;
                  this.viewSelectedTepItemData = null;
                }
              });
          } else {
            if (
              this.createTepFormGroup.get('tepType').value ===
                this.createTepTypesEnum.MANUAL_TEP &&
              !response.isTepAllowed
            ) {
              this.showAlertNotification(
                this.productGroupIsNotEligibleForTepAlertMsg
              );
              this.isViewTepItemPriceDetails = false;
              this.viewSelectedTepItemData = null;
            } else if (
              this.createTepFormGroup.get('tepType').value ===
                this.createTepTypesEnum.MANUAL_INTER_BRAND_TEP &&
              !response.isInterBrandTepAllowed
            ) {
              this.showAlertNotification(this.interBrandTepNotEligibleAlertMsg);
              this.isViewTepItemPriceDetails = false;
              this.viewSelectedTepItemData = null;
            }
          }
        }
      });
  }

  updateItemCodeOnMismatch(itemMismatchObject: {
    id: string;
    value: string;
    type: string;
  }) {
    let index: number;
    const tepItem = this.tepItemList.filter((tepItem, index1) => {
      if (itemMismatchObject.id === tepItem.rowKey) {
        index = index1;
      }
      return itemMismatchObject.id === tepItem.rowKey;
    });
    this.tepItemList[index].variantCode = itemMismatchObject.value;
    this.tepItemList = [...this.tepItemList];
  }

  getAddTepItemToGridResponse() {
    this.tepFacade
      .getAddTepItemResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe((addTepItemResponse: AddOrUpdateTepItemResponse) => {
        if (addTepItemResponse && !this.isSaleableModified) {
          this.totalValue = addTepItemResponse?.totalValue;
          this.cumulativeRefundAmt = addTepItemResponse.cumulativeRefundAmt;
          this.deleteIdForSoftDelete = '';

          const itemIndex = this.tepItemList.findIndex(
            item => item.rowKey === this.modalDetails.rowKey
          );
          if (CreateTepTypesEnum.MANUAL_FULL_VALUE_TEP) {
            this.addedItemCmDocDate = moment(this.businessDate).subtract(
              15,
              'days'
            );
          } else {
            this.addedItemCmDocDate = null;
          }
          const tepItemData = {
            rowKey: addTepItemResponse.itemDetails.itemId,
            cashMemoDetailsId: this.modalDetails.cashMemoDetailsId,
            variantCode: this.modalDetails.variantCode,
            isDummy: this.modalDetails.isDummy,
            cmAvailable: this.modalDetails.cmAvailable,
            grossWt: addTepItemResponse.itemDetails.priceDetails.measuredWeight,
            saleable: this.modalDetails.saleableValue,
            deductionAmt: this.modalDetails.deductionAmt,
            exchangeValue: addTepItemResponse.itemDetails.finalValue
              ? addTepItemResponse.itemDetails.finalValue
              : 0,
            refundDeduction: addTepItemResponse.refundDeductionAmount
              ? addTepItemResponse.refundDeductionAmount
              : 0,
            netRefundAmount: addTepItemResponse.netRefundAmount
              ? addTepItemResponse.netRefundAmount
              : 0,
            discountRecovered: this.modalDetails.discountRecovery,
            discountDetails: this.modalDetails.discountDetails,
            unitWeight: Number(
              (
                addTepItemResponse.itemDetails.priceDetails.measuredWeight /
                addTepItemResponse.itemDetails.priceDetails.itemQuantity
              ).toFixed(3)
            ),
            stdWeight: addTepItemResponse.itemDetails.priceDetails.stdWeight,
            unitValue: addTepItemResponse.itemDetails.unitValue,
            totalValue: addTepItemResponse.itemDetails.totalValue,
            totalWeight:
              addTepItemResponse.itemDetails.priceDetails.measuredWeight,
            taxDetails: addTepItemResponse.taxDetails?.taxes?.length
              ? addTepItemResponse.taxDetails?.taxes[0]
              : null,
            totalTax: addTepItemResponse.itemDetails.totalTax,
            quantity: addTepItemResponse.itemDetails.quantity,
            stoneDetails: addTepItemResponse.itemDetails.priceDetails.stones,
            formGroup: new FormGroup({
              cmAvailable: new FormControl({
                value: this.modalDetails.cmAvailable,
                disabled: true
              }),
              saleable: new FormControl({
                value: this.modalDetails.saleableValue,
                disabled:
                  this.createTepFormGroup.get('tepType').value ===
                    this.createTepTypesEnum.MANUAL_INTER_BRAND_TEP ||
                  this.createTepFormGroup.get('tepType').value ===
                    this.createTepTypesEnum.MANUAL_FULL_VALUE_TEP ||
                  !this.modalDetails.enableSaleable
                    ? true
                    : false
              })
            }),
            itemId: addTepItemResponse.itemDetails.itemId,
            lotNumber: this.modalDetails.lotNumber,
            viewPriceDetails: addTepItemResponse.itemDetails.priceDetails
          };
          if (itemIndex > 0 || itemIndex === 0) {
            this.tepItemList[itemIndex] = tepItemData;
            this.tepItemList = [...this.tepItemList];
          } else {
            this.tepItemList = [...this.tepItemList, tepItemData];
          }
          this.refundDeductionAmt = 0;
          this.netRefundAmt = 0;
          this.tepItemList.forEach((tepItem: any) => {
            if (tepItem.refundDeduction) {
              this.refundDeductionAmt =
                this.refundDeductionAmt + tepItem.refundDeduction;
            }
            if (tepItem.netRefundAmount) {
              this.netRefundAmt = this.netRefundAmt + tepItem.netRefundAmount;
            }
          });

          this.netRefundAmt = this.netRefundAmt;
          this.tepFacade.SetTepItemProductCode('');
        } else if (addTepItemResponse && this.isSaleableModified) {
          this.deleteIdForSoftDelete = '';
          this.tepItemList.forEach((tepItem: any, index: number) => {
            if (tepItem.rowKey === this.saleableModifiedRowKey) {
              this.tepItemList[index].saleable =
                addTepItemResponse.itemDetails.isSaleable;
            }
          });
          this.tepItemList = [...this.tepItemList];
          if (addTepItemResponse.itemDetails.isSaleable) {
            this.showAlertNotification(
              `Item code ${addTepItemResponse?.itemDetails?.itemCode} is saleable now.`
            );
          } else {
            this.showAlertNotification(
              `Item code ${addTepItemResponse?.itemDetails?.itemCode} is not saleable now.`
            );
          }
        }
        this.isSaleableModified = false;
        this.saleableModifiedRowKey = null;
        this.createTepFormGroup.get('coinOfferDiscount').setValue(false);
        this.createTepFormGroup.updateValueAndValidity();
        if (
          this.tepItemList.length >= 1 &&
          this.customerId &&
          this.netRefundAmt
        ) {
          this.hideRefundSection = true;
          this.tepFacade.loadRefundCashLimit(
            this.customerId,
            this.netRefundAmt,
            TransactionTypeEnum.TEP
          );
        }
      });
  }

  deleteTepItemById(event: any) {
    this.deleteId = event.itemId;
    if (this.deleteId !== '') {
      this.tepFacade.DeleteTepItem(
        this.tepTransactionId,
        event.itemId,
        this.createTepFormGroup.get('tepType').value
      );
    } else {
      const objectToBeRemoved = this.tepItemList.filter(data => {
        return data.itemId === this.deleteId;
      });
      this.tepItemList.splice(
        this.tepItemList.indexOf(objectToBeRemoved[0]),
        1
      );
      this.tepItemList = [...this.tepItemList];
      this.deleteIdForSoftDelete = this.deleteId;
      if (this.tepItemList.length === 0) {
        this.isTepRequestApprovalItemAlreadyAdded = false;
      }
    }
  }

  getDeleteTepItemResponse() {
    this.tepFacade
      .getDeleteTepItemResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: DeleteTepItemResponse) => {
        if (response) {
          const objectToBeRemoved = this.tepItemList.filter(data => {
            return data.itemId === this.deleteId;
          });

          this.tepItemList.splice(
            this.tepItemList.indexOf(objectToBeRemoved[0]),
            1
          );
          this.deleteIdForSoftDelete = this.deleteId;
          this.refundDeductionAmt =
            this.refundDeductionAmt - objectToBeRemoved[0].refundDeduction;
          this.refundDeductionAmt = this.refundDeductionAmt;
          this.netRefundAmt =
            this.netRefundAmt - objectToBeRemoved[0].netRefundAmount;
          this.netRefundAmt = this.netRefundAmt;
          this.tepItemList = [...this.tepItemList];
          if (this.netRefundAmt && this.customerId) {
            this.hideRefundSection = true;
            this.tepFacade.loadRefundCashLimit(
              this.customerId,
              this.netRefundAmt,
              TransactionTypeEnum.TEP
            );
          }
          if (this.netRefundAmt === 0) {
            this.createTepFormGroup
              .get('tepPaymentType')
              .setValue(TepPaymentTypesEnum.CN);
            this.createTepFormGroup
              .get('tepPaymentType')
              .updateValueAndValidity();
          }
          if (this.tepItemList.length === 0) {
            this.isTepRequestApprovalItemAlreadyAdded = false;
          }
          this.tepFacade.clearDeleteTepItemResponse();
        }
      });
  }

  getDeleteTepTransactionResponse() {
    this.tepFacade
      .getDeleteTepTransactionResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe(deleteTepTransactionResponse => {
        if (deleteTepTransactionResponse) {
          this.tepTransactionId = '';
          this.clearTepData();
          this.commonFacade.setTepOrderNumber({
            orderNo: 0,
            status: null
          });
          this.isOpenTask = false;
          this.loadOpenValues();
          this.loadHoldValues();
          this.showAlertNotification(this.transactionDeletedAlertMsg);
        }
      });
  }

  viewTepItemValuation(event) {
    this.isViewTepItemPriceDetails = true;
    this.viewSelectedTepItemData = event;
    if (event && event.exchangeValue) {
      this.tepFacade.loadTepItemConfiguration(
        event.variantCode,
        this.createTepFormGroup.get('tepType').value,
        event.isDummy,
        this.selectedCustomer?.mobileNumber
      );
    } else {
      this.showAlertNotification(this.noValuationDetailsWiththeItemAlertMsg);
    }
  }

  showSummaryBar(): void {
    this.summaryBar
      .open(SummaryBarType.TEP, {
        type: TepTypesEnum.CREATE_TEP,
        remarks: this.summaryBarRemarks$.asObservable()
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: SummaryBarEventRef) => {
        this.remarks = event.remarks;
        this.isLastTransactionPrint = false;
        switch (event.eventType) {
          case SummaryBarEventType.DELETE: {
            if (this.tepTransactionId) {
              this.tepFacade.deleteTepTransactionDetails(
                this.tepTransactionId,
                this.createTepFormGroup.get('tepType').value
              );
            }
            break;
          }
          case SummaryBarEventType.CLAER: {
            this.clearTepData();
            this.router.navigate([getManualTepUrl('new')]);
            break;
          }
          case SummaryBarEventType.HOLD: {
            if (this.customerId && this.tepTransactionId) {
              let isFormValidated = this.validateCustomerService.validateCustomer(
                this.selectedCustomer
              );
              if (isFormValidated) {
                this.confirmOrHoldTep(
                  TepStatusEnum.HOLD,
                  this.createTepFormGroup.get('tepPaymentType').value,
                  event.remarks
                );
              } else {
                this.customerService.open({
                  customerType: this.customerType,
                  customerId: this.customerId
                });
              }
            } else {
              this.showAlertNotification(this.selectCustomerAlertMessage);
            }
            break;
          }
          case SummaryBarEventType.REFUND: {
            if (this.customerId && this.tepTransactionId) {
              const requestPayload: DiscountListPayload = {
                id: this.tepTransactionId,
                subTxnType: this.createTepFormGroup.get('tepType').value,
                txnType: TransactionTypeEnum.TEP
              };
              this.tepFacade.loadAvailableDiscountsList(requestPayload);
            } else {
              this.showAlertNotification(this.selectCustomerAlertMessage);
            }
            break;
          }
          case SummaryBarEventType.GENERATE_CN: {
            if (this.customerId && this.tepTransactionId) {
              let isFormValidated = this.validateCustomerService.validateCustomer(
                this.selectedCustomer
              );
              if (isFormValidated) {
                const requestPayload: DiscountListPayload = {
                  id: this.tepTransactionId,
                  subTxnType: this.createTepFormGroup.get('tepType').value,
                  txnType: TransactionTypeEnum.TEP
                };
                this.tepFacade.loadAvailableDiscountsList(requestPayload);
              } else {
                this.customerService.open({
                  customerType: this.customerType,
                  customerId: this.customerId
                });
              }
            } else {
              this.showAlertNotification(this.selectCustomerAlertMessage);
            }
            break;
          }
          case SummaryBarEventType.TEP_REQUEST_APPROVAL: {
            if (this.customerId && this.tepTransactionId) {
              let isFormValidated = this.validateCustomerService.validateCustomer(
                this.selectedCustomer
              );
              if (isFormValidated) {
                this.confirmOrHoldTep(
                  TepStatusEnum.CONFIRMED,
                  this.createTepFormGroup.get('tepPaymentType').value,
                  event.remarks
                );
              } else {
                this.customerService.open({
                  customerType: this.customerType,
                  customerId: this.customerId
                });
              }
            } else {
              this.showAlertNotification(this.selectCustomerAlertMessage);
            }
            break;
          }
          case SummaryBarEventType.PRINT: {
            this.isLastTransactionPrint = true;
            this.print();
            break;
          }
          /* case SummaryBarEventType.TEP_EXCEPTION: {
            this.isTepException = true;
            if (!this.customerId) {
              this.showAlertPopUp('Please Select the Customer');
            } else if (!this.selectedRso) {
              this.showAlertPopUp(this.selectRsoNameAlertMessage);
            } else if (this.customerId && this.tepItemList.length === 1) {
              let isFormValidated = this.validateCustomerService.validateCustomer(
                this.selectedCustomer
              );
              if (isFormValidated) {
                this.openTepExceptionPopup();
              } else {
                this.customerService.open({
                  customerType: this.customerType,
                  customerId: this.customerId
                });
              }
            } else if (this.selectedCustomer && this.tepItemList.length === 0) {
              this.showAlertPopUp('No Items are Available.');
            } else if (this.selectedCustomer && this.tepItemList.length > 1) {
              this.showAlertPopUp(
                'Only one item is allowed for TEP Exception.'
              );
            }
          } */
        }
      });
  }

  /* openTepExceptionPopup() {
    const dialogRef = this.dialog.open(TepExceptionPopupComponent, {
      height: 'auto',
      width: '500px',
      autoFocus: false,
      data: {
        variantCode: this.tepItemList[0].variantCode,
        maxFlatTepException: this.maxFlatTepException
      }
    });
    dialogRef.componentInstance.submit
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        if (value) {
          this.TepExceptionData = value;
          this.confirmOrHoldTep(
            TepStatusEnum.CONFIRMED,
            this.createTepFormGroup.get('tepPaymentType').value
          );
        }

        this.tepFacade
          .getConfirmTepItemResponse()
          .pipe(takeUntil(this.destroy$))
          .subscribe((confirmTepResponse: ConfirmTepItemResponse) => {
            if (confirmTepResponse && confirmTepResponse.reqDocNo) {
              dialogRef.componentInstance.onClose();
            }
          });
      });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        this.isTepException = value;
      });
  } */

  clearTepData() {
    this.remarks = '';
    this.commonFacade.setFileUploadVisible(false);
    this.transactionStatus = '';
    this.isTransactionSuccess = false;
    this.isProfileMatched = false;
    this.deleteId = '';
    // this.TepExceptionData = null;
    this.isCashRefundAllowed = false;
    this.customerFacade.clearCustomerSearch();
    this.customerFacade.clearSelectedCustomer();
    this.tepTransactionId = '';
    this.onSelectedRSONameChanged(null);
    this.tepItemList = [];
    this.customerId = null;
    this.createTepFormGroup.get('fvtApprovalCode').setValue('');
    this.createTepFormGroup.get('fvtApprovalDate').setValue(null);
    this.createTepFormGroup.get('fvtApprover').setValue(null);
    this.createTepFormGroup
      .get('tepPaymentType')
      .setValue(this.tepPaymentTypesEnum.CN);
    this.createTepFormGroup.get('coinOfferDiscount').setValue(false);
    this.createTepFormGroup.updateValueAndValidity();
    this.netRefundAmt = 0;
    this.refundDeductionAmt = 0;
    if (this.netRefundAmt === 0) {
      this.createTepFormGroup
        .get('tepPaymentType')
        .setValue(TepPaymentTypesEnum.CN);
      this.createTepFormGroup.get('tepPaymentType').updateValueAndValidity();
    }
    this.tepFacade.resetTep();
    this.tepFacade.LoadRsoList(this.roleCode);
    this.createTepFormGroup.get('fvtReason').setValue('');
    this.tepFacade.loadFvtReasons();
    this.summaryBarRemarks$.next('');
    this.commonFacade.setIsTepRequestRaising(false);
    this.commonFacade.setTepOrderNumber({
      orderNo: 0,
      status: null
    });
    this.isOpenTask = false;
    this.manualBillDetails = null;
    this.detailsFlag$.next(false);
    this.commonFacade.setTepTotalRefundAmt(0);
    this.commonFacade.setTepTotalGrossWt(0);
    this.commonFacade.setTepTotalQty(0);
    this.commonFacade.setTepTotalExchangeAmt(0);
  }

  validateRefundFormForHold(refundDetails: RefundDetails): boolean {
    if (
      refundDetails?.refundTypeSelected === RefundOptionTypes.CHEQUE ||
      (refundDetails?.refundTypeSelected === RefundOptionTypes.RO_PAYMENT &&
        refundDetails?.paymentSubRefundModes === RefundOptionTypes.CHEQUE)
    ) {
      if (
        refundDetails.nameAsPerBankRecord &&
        this.refundFormGroup.get('nameAsPerBankRecord').invalid
      ) {
        return true;
      } else {
        return false;
      }
    } else if (
      refundDetails?.refundTypeSelected === RefundOptionTypes.RTGS ||
      (refundDetails?.refundTypeSelected === RefundOptionTypes.RO_PAYMENT &&
        refundDetails?.paymentSubRefundModes === RefundOptionTypes.RTGS)
    ) {
      if (
        (refundDetails.accountHolderName &&
          this.refundFormGroup.get('accountHolderName').invalid) ||
        (refundDetails.bankName &&
          this.refundFormGroup.get('bankName').invalid) ||
        (refundDetails.accountNumber &&
          this.refundFormGroup.get('accountNumber').invalid) ||
        (refundDetails.reenteredAccountNumber &&
          this.refundFormGroup.get('reenteredAccountNumber').invalid) ||
        (refundDetails.branch && this.refundFormGroup.get('branch').invalid) ||
        (refundDetails.ifscCode && this.refundFormGroup.get('ifscCode').invalid)
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  getRefundForm(refundForm: FormGroup) {
    this.refundFormGroup = refundForm;
  }

  confirmOrHoldTep(
    tepStatusType: TepStatusEnum,
    type: TepPaymentTypesEnum,
    remarks?: string,
    discountTypeSelected?: string
  ) {
    this.tepFacade.resetAvailableDiscountsList();
    const dummyTepItemRows: any[] = this.tepItemList.filter((tepItem: any) => {
      return !tepItem.exchangeValue;
    });
    if (dummyTepItemRows && dummyTepItemRows.length > 0) {
      this.showAlertNotification(this.deleteVariantGridRowsAlertMsg);
    } else if (
      tepStatusType === TepStatusEnum.HOLD &&
      this.refundDetailsFromRefundForm &&
      this.refundFormGroup &&
      this.validateRefundFormForHold(this.refundDetailsFromRefundForm)
    ) {
      this.showAlertNotification(this.enterProperDataInRefundFormAlertMsg);
    } else if (
      this.createTepFormGroup.get('tepPaymentType').value ===
        TepPaymentTypesEnum.REFUND &&
      this.refundDetailsFromRefundForm &&
      !this.refundDetailsFromRefundForm.refundTypeSelected &&
      tepStatusType !== TepStatusEnum.HOLD
    ) {
      this.showAlertNotification(this.selectRefundTypeAlertMsg);
    } else if (
      this.createTepFormGroup.get('tepPaymentType').value ===
        TepPaymentTypesEnum.REFUND &&
      this.refundDetailsFromRefundForm &&
      (this.refundDetailsFromRefundForm.refundTypeSelected ===
        RefundOptionTypes.CHEQUE ||
        (this.refundDetailsFromRefundForm.refundTypeSelected ===
          RefundOptionTypes.RO_PAYMENT &&
          this.refundDetailsFromRefundForm?.paymentSubRefundModes ===
            RefundOptionTypes.CHEQUE)) &&
      this.refundDetailsFromRefundForm?.invalid === true &&
      tepStatusType !== TepStatusEnum.HOLD
    ) {
      if (
        this.refundDetailsFromRefundForm &&
        !this.refundDetailsFromRefundForm.nameAsPerBankRecord
      ) {
        this.showAlertNotification(this.enterNameAsPerBankRecordAlertMsg);
      } else {
        this.showAlertNotification(this.enterProperDataInRefundFormAlertMsg);
      }
    } else if (
      this.createTepFormGroup.get('tepPaymentType').value ===
        TepPaymentTypesEnum.REFUND &&
      this.refundDetailsFromRefundForm &&
      (this.refundDetailsFromRefundForm.refundTypeSelected ===
        RefundOptionTypes.RTGS ||
        (this.refundDetailsFromRefundForm.refundTypeSelected ===
          RefundOptionTypes.RO_PAYMENT &&
          this.refundDetailsFromRefundForm?.paymentSubRefundModes ===
            RefundOptionTypes.RTGS)) &&
      this.refundDetailsFromRefundForm.invalid === true &&
      tepStatusType !== TepStatusEnum.HOLD
    ) {
      if (
        this.refundDetailsFromRefundForm &&
        !this.refundDetailsFromRefundForm.accountHolderName
      ) {
        this.showAlertNotification(this.enterAccountHoldersNameAlertMsg);
      } else if (
        this.refundDetailsFromRefundForm &&
        !this.refundDetailsFromRefundForm.accountNumber
      ) {
        this.showAlertNotification(this.enterAccountNumberAlertMsg);
      } else if (
        this.refundDetailsFromRefundForm &&
        !this.refundDetailsFromRefundForm.reenteredAccountNumber
      ) {
        this.showAlertNotification(this.reenterAccountNumberAlertMsg);
      } else if (
        this.refundDetailsFromRefundForm &&
        !this.refundDetailsFromRefundForm.bankName
      ) {
        this.showAlertNotification(this.enterBankNameAlertMsg);
      } else if (
        this.refundDetailsFromRefundForm &&
        !this.refundDetailsFromRefundForm.branch
      ) {
        this.showAlertNotification(this.enterBranchNameAlertMsg);
      } else if (
        this.refundDetailsFromRefundForm &&
        !this.refundDetailsFromRefundForm.ifscCode
      ) {
        this.showAlertNotification(this.enterIfscCodeAlertMsg);
      } else {
        this.showAlertNotification(this.enterProperDataInRefundFormAlertMsg);
      }
    } else if (
      this.createTepFormGroup.get('tepPaymentType').value ===
        TepPaymentTypesEnum.REFUND &&
      this.refundDetailsFromRefundForm &&
      (this.refundDetailsFromRefundForm.refundTypeSelected ===
        RefundOptionTypes.RTGS ||
        (this.refundDetailsFromRefundForm.refundTypeSelected ===
          RefundOptionTypes.RO_PAYMENT &&
          this.refundDetailsFromRefundForm?.paymentSubRefundModes ===
            RefundOptionTypes.RTGS)) &&
      this.refundDetailsFromRefundForm.accountNumber !==
        this.refundDetailsFromRefundForm.reenteredAccountNumber &&
      tepStatusType !== TepStatusEnum.HOLD
    ) {
      this.showAlertNotification(this.accountNumbersNotMatchingAlertMsg);
    } else if (!this.selectedRso) {
      this.showAlertNotification(this.selectRsoNameAlertMessage);
    } else if (
      this.createTepFormGroup.get('tepType').value ===
        CreateTepTypesEnum.MANUAL_FULL_VALUE_TEP &&
      !this.createTepFormGroup.get('fvtReason').value
    ) {
      this.showAlertNotification(this.selectReasonAlertMsg);
    } else {
      {
        let refundDetails: any;
        if (
          this.refundDetailsFromRefundForm &&
          (this.refundDetailsFromRefundForm.refundTypeSelected ===
            RefundOptionTypes.RTGS ||
            (this.refundDetailsFromRefundForm.refundTypeSelected ===
              RefundOptionTypes.RO_PAYMENT &&
              this.refundDetailsFromRefundForm?.paymentSubRefundModes ===
                RefundOptionTypes.RTGS))
        ) {
          refundDetails = {
            type: 'TEP_RTGS_REFUND',
            data: {
              refundMode: this.refundDetailsFromRefundForm
                ?.paymentSubRefundModes
                ? this.refundDetailsFromRefundForm?.paymentSubRefundModes
                : this.refundDetailsFromRefundForm?.refundTypeSelected,
              customerName: this.refundDetailsFromRefundForm.accountHolderName,
              bankAccountNo: this.refundDetailsFromRefundForm.accountNumber,
              bankName: this.refundDetailsFromRefundForm.bankName,
              branchName: this.refundDetailsFromRefundForm.branch,
              ifscCode: this.refundDetailsFromRefundForm.ifscCode
            }
          };
        } else if (
          this.refundDetailsFromRefundForm &&
          (this.refundDetailsFromRefundForm.refundTypeSelected ===
            RefundOptionTypes.CHEQUE ||
            (this.refundDetailsFromRefundForm.refundTypeSelected ===
              RefundOptionTypes.RO_PAYMENT &&
              this.refundDetailsFromRefundForm?.paymentSubRefundModes ===
                RefundOptionTypes.CHEQUE))
        ) {
          refundDetails = {
            type: 'TEP_CHEQUE_REFUND',
            data: {
              refundMode: this.refundDetailsFromRefundForm
                ?.paymentSubRefundModes
                ? this.refundDetailsFromRefundForm?.paymentSubRefundModes
                : this.refundDetailsFromRefundForm?.refundTypeSelected,
              customerName: this.refundDetailsFromRefundForm.nameAsPerBankRecord
            }
          };
        } else if (
          this.refundDetailsFromRefundForm &&
          this.refundDetailsFromRefundForm.refundTypeSelected ===
            RefundOptionTypes.CASH
        ) {
          refundDetails = {
            type: 'TEP_CASH_REFUND',
            data: {
              refundMode: this.refundDetailsFromRefundForm.refundTypeSelected
            }
          };
        }
        const approverDetails = {
          type: 'FTEP_APPROVAL_DETAILS',
          data: {
            approvalCode: this.createTepFormGroup.get('fvtApprovalCode').value,
            approvalDate: this.createTepFormGroup.get('fvtApprovalDate').value,
            approvedBy: this.createTepFormGroup.get('fvtApprover').value,
            processType: this.approverProcessType
          }
        };
        /* const tepExceptionData = {
          type: 'TEP_EXCEPTION_DETAILS',
          data: {
            deductionPercent: this.TepExceptionData?.deductionPercent
              ? Number(this.TepExceptionData?.deductionPercent)
              : 0,
            flatExchangeValue: this.TepExceptionData?.flatTepExchangeAmount
              ? Number(this.TepExceptionData?.flatTepExchangeAmount)
              : 0,
            customerId: this.customerId,
            itemCode: this.TepExceptionData?.variantCode,
            approvedBy: this.TepExceptionData?.approvedBy
          }
        }; */
        const totalValue = (this.totalExchangeAmt - this.totalTax).toFixed(2);
        const confirmTepRequestPayload: ConfirmOrHoldTepRequestPayload = {
          approvalDetails:
            this.createTepFormGroup.get('tepType').value ===
            CreateTepTypesEnum.MANUAL_FULL_VALUE_TEP
              ? approverDetails
              : null,
          // tepExceptionDetails: this.isTepException ? tepExceptionData : null,
          customerId: this.customerId,
          employeeCode: this.selectedRso.value,
          paymentType: type === TepPaymentTypesEnum.REFUND ? 'REFUND' : 'CN',
          exchangeDetails: {
            type: 'EXCHANGE_DETAILS_CONFIG',
            data: {
              declarationFormUrl: '',
              isDeclarationFormSubmitted: true
            }
          },
          metalRateList: {
            metalRates: this.standardMetalRates
          },
          remarks: remarks ? remarks : null,
          totalQuantity: this.totalQty,
          totalTax: this.totalTax ? Number(this.totalTax.toFixed(2)) : 0,
          totalValue: this.totalValue,
          finalValue:
            type === TepPaymentTypesEnum.REFUND
              ? Math.round(this.netRefundAmt)
              : Math.round(this.totalExchangeAmt),
          totalWeight: this.totalGrossWt
            ? Number(this.totalGrossWt.toFixed(3))
            : null
        };

        if (discountTypeSelected) {
          confirmTepRequestPayload.discountTypeSelected = discountTypeSelected;
        }
        if (type === TepPaymentTypesEnum.REFUND) {
          confirmTepRequestPayload.refundDetails = refundDetails;
        }

        if (
          this.createTepFormGroup.get('tepType').value ===
          CreateTepTypesEnum.MANUAL_FULL_VALUE_TEP
        ) {
          confirmTepRequestPayload.reason = this.createTepFormGroup.get(
            'fvtReason'
          ).value;
        }
        if (
          this.totalQty !== 0 &&
          this.panMandatoryForTEP &&
          (this.createTepFormGroup.get('tepPaymentType').value ===
          TepPaymentTypesEnum.CN
            ? this.totalExchangeAmt > this.maxAllowedAmount
            : this.netRefundAmt > this.maxAllowedAmount) &&
          !this.isProfileMatched
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
          // this.openPanCardPopUp();
          this.showPanFormVerifyPopup();
        } else {
          this.tepFacade.confirmTep(
            this.tepTransactionId,
            tepStatusType,
            this.createTepFormGroup.get('tepType').value,
            confirmTepRequestPayload
          );
        }
      }
    }
  }

  openPanCardPopUp() {
    this.panCardServiceAbstraction.open(this.customerId, this.customerType);
  }

  openErrorMsgForOrder(message) {
    this.alertPopupService
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

  getSelectedTepType(event) {
    this.router.navigate([getManualTepUrl('new')]);
    if (event.value) {
      this.commonFacade.setIsTepRequestRaising(true);
    } else {
      this.commonFacade.setIsTepRequestRaising(false);
    }
    this.tepTransactionId = '';
    this.customerId = null;
    this.selectedCustomer = null;
    this.clearSearchField();
    this.clearTepData();
    this.loadHoldValues();
    this.loadOpenValues();
    this.commonFacade.setTepOrderNumber({
      orderNo: 0,
      status: null
    });
    this.tepFacade.loadFvtReasons();
    this.router.navigate([getManualTepUrl('new')]);
  }

  onSelectedRSONameChanged(event: SelectDropDownOption) {
    this.clearSelectedRsoName = false;
    if (
      this.tepTransactionId &&
      event &&
      this.transactionStatus !== TepStatusEnum.APPROVED
    ) {
      const updateOpenTepTransactionPayload: PatchTepRequestPayload = {
        employeeCode: event.value
      };
      this.tepFacade.updateOpenTepTransaction(
        this.tepTransactionId,
        this.createTepFormGroup.get('tepType').value,
        updateOpenTepTransactionPayload
      );
    }

    this.tepFacade.SetSelectedRsoName(event);
  }

  searchByItemcode(event: SearchEmitEvent) {
    this.cashMemoDetailsId = null;
    this.productFacade.clearProductRelatedDetails();
    if (event.lotNumber !== null) {
      this.productFacade.loadProductDetails({
        itemCode: event.searchValue,
        lotNumber: event.lotNumber
      });
    } else {
      if (event.isValid) {
        this.productFacade.loadSearchProduct({
          transactionType: 'TEP',
          searchValue: event.searchValue
        });
      } else {
        this.productFacade.clearSearchProductList();
      }
    }
  }

  getSelectedPaymentOption(event: any) {
    this.tepFacade.SetPaymentMethod(event);
    this.commonFacade.setTepSelectedPaymentMethod(event);
    this.selectedPaymentMode = event;
  }

  modifiedSaleableOptionForTepItem(event) {
    this.isSaleableModified = true;
    this.saleableModifiedRowKey = event.rowKey;
    const updateTepItemRequestPayload: UpdateTepItemRequestPayload = {
      isSaleable: event.saleable,
      finalValue: event.exchangeValue,
      quantity: event.quantity,
      stonesDetails:
        !event.stonesDetails ||
        (event.stonesDetails &&
          event.stonesDetails.length > 0 &&
          !event.stonesDetails[0].stoneQuality &&
          !event.stonesDetails[0].stoneCode)
          ? []
          : event.stoneDetails,
      totalValue: event.totalValue,
      totalWeight: event.totalWeight,
      unitValue: event.unitValue,
      unitWeight: event.unitWeight
    };

    this.tepFacade.updateTepItem(
      this.tepTransactionId,
      event.itemId,
      this.createTepFormGroup.get('tepType').value,
      updateTepItemRequestPayload
    );
  }

  getTepItemProductCodeDetail() {
    this.tepFacade
      .getTepItemProductCodeDetail()
      .pipe(takeUntil(this.destroy$))
      .subscribe((productGroupCode: string) => {
        if (productGroupCode) {
          this.itemProductGroupCode = productGroupCode;
          if (
            this.tepItemList.length > 0 &&
            this.isTepRequestApprovalItemAlreadyAdded
          ) {
            this.showAlertNotification(this.oneItemCanBeAddedInWorkflow);
          } else {
            // if (this.createTepFormGroup.get('coinOfferDiscount').value) {
            //   if (productGroupCode === '73') {
            //     this.tepFacade.loadTepItemConfiguration(
            //       this.itemCode,
            //       this.createTepFormGroup.get('tepType').value,
            //       this.createTepFormGroup.get('tepType').value ===
            //         CreateTepTypesEnum.INTER_BRAND_TEP
            //     );
            //   } else {
            //     this.tepFacade.SetTepItemProductCode('');
            //     this.showAlertNotification(
            //       this.coinOfferDiscountEnabledAlertMsg
            //     );
            //   }
            // } else {
            this.tepFacade.loadTepItemConfiguration(
              this.itemCode,
              this.createTepFormGroup.get('tepType').value,
              this.createTepFormGroup.get('tepType').value ===
                CreateTepTypesEnum.MANUAL_INTER_BRAND_TEP,
              this.selectedCustomer?.mobileNumber
            );
            // }
          }
        }
      });
  }

  getProductCodeCountForSeachedItem() {
    this.productFacade
      .getSearchProductListCount()
      .pipe(takeUntil(this.destroy$))
      .subscribe((count: number) => {
        if (count !== -1) {
          if (count === 0) {
            if (this.searchComponent) {
              this.searchComponent.noSearchResultFound = true;
            }
          } else {
            if (this.searchComponent) {
              this.searchComponent.noSearchResultFound = false;
            }
          }
        }
      });
  }

  printTepConfirmedTransaction(
    transactionId: string,
    txnType: string,
    subTxnType: string
  ) {
    this.postConfirmationActions
      .open()
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (res) {
          let action = null;
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
            printType: printTypesEnum.TEP_PRINTS,
            transacionId: transactionId,
            transacionType: printTransactionTypesEnum.SALES,
            printFileType: printFileTypeEnum.INVOICE_PRINT,
            doctype: printDocTypeEnum.CUSTOMER_PRINT,
            reprint: false,
            customerId: this.customerId,
            invoiceType: action
          });
        }
      });
  }

  print() {
    this.printingFacade.loadLastTransactionId({
      searchValue: '',
      status: StatusTypesEnum.CONFIRMED,
      txnType: TransactionTypeEnum.TEP,
      subTxnType: this.createTepFormGroup.get('tepType').value,
      pageIndex: 0,
      pageSize: 1
    });
    this.printingFacade
      .getLastTransactionId()
      .pipe(takeUntil(this.destroy$))
      .subscribe(lastTransactionId => {
        if (lastTransactionId) {
          this.postConfirmationActions
            .open()
            .pipe(takeUntil(this.destroy$))
            .subscribe(res => {
              if (res) {
                let action = null;
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
                  printType: printTypesEnum.TEP_PRINTS,
                  transacionId: lastTransactionId,
                  transacionType: printTransactionTypesEnum.SALES,
                  printFileType: printFileTypeEnum.INVOICE_PRINT,
                  doctype: printDocTypeEnum.CUSTOMER_PRINT,
                  reprint: false,
                  customerId: this.customerId,
                  lastTransactionPrint: true,
                  invoiceType: action
                });
              }
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

  selectedItemcode(event: SearchProductList) {
    this.deleteId = '';
    this.productFacade.clearProductRelatedDetails();
    this.tepFacade.SetTepItemProductCode('');
    // this.tepFacade.createOpenTepTransaction(
    //   this.createTepFormGroup.get('tepType').value,
    //   {}
    // );
    this.itemCode = event.itemCode;
    this.isViewTepItemPriceDetails = false;
    this.viewSelectedTepItemData = null;
    this.tepFacade.LoadTepItemProductCodeDetail(event.itemCode);
    this.productFacade.loadProductDetails({
      itemCode: event.itemCode
    });
    // if (this.customerId && this.tepTransactionId) {
    //   this.itemCode = event.itemCode;
    //   this.tepFacade.LoadTepItemProductCodeDetail(event.itemCode);
    //   this.productFacade.loadProductDetails({
    //     itemCode: event.itemCode
    //   });
    // } else {
    //   this.productFacade.clearSearchProductList();
    //   this.showAlertNotification(this.selectCustomerAlertMessage);
    // }
  }

  exactSearchByItemcode(event: SearchEmitEvent) {
    this.productFacade.clearProductRelatedDetails();
    if (event.isValid) {
      this.productFacade.loadSearchProduct({
        transactionType: 'TEP',
        searchValue: event.searchValue
      });
    } else {
      this.productFacade.clearSearchProductList();
    }
  }

  getRefundDetails(event: RefundDetails) {
    this.refundDetailsFromRefundForm = event;
    this.tepFacade.setIsRefundFormValid(true);
    this.commonFacade.setIsTepRefundFormValid(true);
  }

  clearSearchField() {
    this.searchComponent?.clearSearch(null);
  }

  uploadFile(event: { fileData: FormData; uploadType: TepUploadTypes }) {
    if (event.fileData && this.tepTransactionId && event.uploadType) {
      this.uploadType = event.uploadType;
      this.tepFacade.loadFileUpload({
        file: event.fileData,
        txnType: TransactionTypeEnum.TEP,
        id: this.tepTransactionId,
        uploadType: event.uploadType
      });
    }
  }

  uploadApprovalMailForFVT(event) {
    const fileList: FileList = event;
    const formData: FormData = new FormData();
    if (this.tepTransactionId) {
      if (fileList.length > 0) {
        formData.append('file', fileList.item(0));
        this.uploadFile({
          fileData: formData,
          uploadType: TepUploadTypes.APPROVAL_MAIL
        });
      }
    } else {
      this.showAlertNotification(this.selectCustomerAlertMessage);
    }
  }

  uploadError(event: string) {
    this.showNotifications(event);
  }

  showNotifications(key: string) {
    this.translate
      .get(key)
      .pipe(take(1))
      .subscribe((translatedMsg: string) => {
        this.overlayNotificationServiceAbstraction
          .show({
            type: OverlayNotificationType.SIMPLE,
            message: translatedMsg,
            hasClose: true,
            hasBackdrop: true
          })
          .events.pipe(take(1))
          .subscribe((event: OverlayNotificationEventRef) => {
            // Action based event
          });
      });
  }

  clearApprovalMail() {
    this.approvalMailImageUrl = null;
  }

  loadItemImageUrl(event: string) {
    this.commonFacade.loadCMImageUrl(event);
  }

  openItemImagePopup(data) {
    this.dialog.open(ItemPreviewPopupComponent, {
      height: '525px',
      width: '700px',
      autoFocus: false,
      data: {
        imageUrl: data.imageUrl,
        itemCode: data.itemCode
      }
    });
  }

  onApproverSelectionChange(event: any) {
    console.log('EVENT :', event);
    if (this.tepItemList.length > 0) {
      const x = this.approverListForFvt.filter(
        approverDetail => approverDetail.value === event.value
      );
      this.approverProcessType = x[0]?.processType;
      if (this.approverProcessType === GrnApprovalTypeEnums.EMAIL) {
        this.commonFacade.setFileUploadVisible(true);
        // this.showAlertNotification(
        //   'Please select Approval Date and upload Email Proof.'
        // );
      } else {
        if (
          this.createTepFormGroup.get('tepPaymentType').value ===
          this.tepPaymentTypesEnum.CN
        ) {
          this.commonFacade.setFileUploadVisible(false);
        }
      }
      this.setValidationForApproverDetails();
    } else {
      this.showAlertNotification(
        'Please add an item to the variant grid before adding approver details.'
      );
      this.createTepFormGroup.get('fvtApprover').setValue(null);
      this.createTepFormGroup.updateValueAndValidity();
    }
  }

  setValidationForApproverDetails() {
    const approvalCodeCtrl = this.createTepFormGroup.get('fvtApprovalCode');
    const dateCtrl = this.createTepFormGroup.get('fvtApprovalDate');
    console.log(this.approverProcessType, 'in validation');

    if (this.approverProcessType === GrnApprovalTypeEnums.CODE) {
      dateCtrl.reset();
      dateCtrl.setErrors(null);
      approvalCodeCtrl.setValidators([
        this.fieldValidatorsService.requiredField('Approval Code')
      ]);
    } else if (this.approverProcessType === GrnApprovalTypeEnums.EMAIL) {
      approvalCodeCtrl.reset();
      approvalCodeCtrl.setErrors(null);
      dateCtrl.setValidators([
        this.fieldValidatorsService.requiredField('Approval Date'),
        this.fieldValidatorsService.minDate(
          this.addedItemCmDocDate,
          'Approval Date'
        )
      ]);
    }
    approvalCodeCtrl.updateValueAndValidity;
    dateCtrl.updateValueAndValidity;
  }

  setRequestForApprovalDetails() {
    this.tepFacade
      .getIsExceptionScenario()
      .pipe(takeUntil(this.destroy$))
      .subscribe(isException => {
        if (
          isException &&
          this.isTepRequestApprovalItemAlreadyAdded &&
          this.createTepFormGroup.get('tepType').value !==
            CreateTepTypesEnum.MANUAL_FULL_VALUE_TEP
        ) {
          this.commonFacade.setIsTepRequestRaising(false);
        } else if (!isException && this.isItemEligibleReqWorkflow()) {
          this.commonFacade.setIsTepRequestRaising(true);
        }
      });
  }

  isItemEligibleReqWorkflow() {
    return (
      this.tepItemList.length === 1 &&
      this.tepItemList[0]?.viewPriceDetails?.cmDocNo &&
      !this.tepItemList[0]?.viewPriceDetails?.lotNumber &&
      this.studdedProductGroupCodes.includes(
        this.tepItemList[0]?.viewPriceDetails?.productGroupCode
      )
    );
  }

  showPanFormVerifyPopup() {
    this.panFormVerifyPopupService
      .open({
        type: AlertPopupTypeEnum.INFO,
        id: this.tepTransactionId,
        customerId: this.customerId,
        customerType: this.customerType,
        txnType: TransactionTypeEnum.TEP
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((dailogResponse: boolean) => {
        this.isProfileMatched = dailogResponse;
      });
  }

  ngOnDestroy() {
    this.isTepRequestApprovalItemAlreadyAdded = false;
    this.commonFacade.setTepOrderNumber({
      orderNo: 0,
      status: null
    });
    this.isOpenTask = false;
    this.summaryBar.close();
    this.overlayNotificationServiceAbstraction.close();
    this.tepFacade.resetTep();
    this.customerFacade.clearCustomerSearch();
    this.printingService.resetPrint();
    this.toolbarFacade.resetValues();
    this.clearTepData();
    this.commonFacade.clearCmImageUrl();
    this.destroy$.next();
    this.destroy$.complete();
    this.toolbarFacade.setToolbarConfig({
      loadMetalPrices: true,
      loadHoldPopup: false,
      loadOpenOrdersPopup: false
    });
  }
}
