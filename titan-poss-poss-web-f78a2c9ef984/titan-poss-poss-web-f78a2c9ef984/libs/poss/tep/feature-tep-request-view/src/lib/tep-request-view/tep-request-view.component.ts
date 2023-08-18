import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Event, NavigationEnd, Router } from '@angular/router';
import { LocationSettingsFacade } from '@poss-web/shared/location-settings/data-access-location-settings';
import { TranslateService } from '@ngx-translate/core';
import { ProductFacade } from '@poss-web/poss/shared/product/data-access-product';
import { AuthFacade } from '@poss-web/shared/auth/data-access-auth';
import { CommonFacade } from '@poss-web/shared/common/data-access-common';
import { FilePreviewComponent } from '@poss-web/shared/components/ui-file-upload';
import { GrnFacade } from '@poss-web/poss/grn/data-access-grn';
import { ItemPreviewPopupComponent } from '@poss-web/shared/components/ui-item-preview-popup';
import { CustomerFacade } from '@poss-web/shared/customer/data-access-customer';
import { FileFacade } from '@poss-web/shared/file-upload/data-access-file-upload';
import { ProductSearchAutocompleteComponent } from '@poss-web/shared/item-master/ui-product-search-autocomplete';
import {
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  BillCancelPayload,
  CancelResponse,
  CancelTEPResponse,
  CommomStateAttributeNameEnum,
  CommomStateAttributeTypeEnum,
  ConfirmRequestTepRequestPayload,
  ConfirmTepItemResponse,
  CreateTepTypesEnum,
  CustomErrors,
  DiscountListPayload,
  DiscountsList,
  DiscountsSelectionServiceAbstraction,
  FileTypeEnum,
  GetTepItemConfiguratonResponse,
  GetTepPriceDetailsRequestPayload,
  GetTepPriceDetailsResponse,
  GrnApprovalTypeEnums,
  GrnApproverSuccessList,
  InvoiceDeliveryTypes,
  LocationSettingAttributesEnum,
  OverlayNotificationEventRef,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  PostTransactionConfirmationActionsServiceAbstraction,
  printDocTypeEnum,
  printFileTypeEnum,
  PrintingServiceAbstraction,
  printTransactionTypesEnum,
  printTypesEnum,
  RefundDetails,
  RefundOptionTypes,
  RoleCodesEnum,
  RsoNameObject,
  SaveTepDataType,
  SearchEmitEvent,
  SearchProductList,
  SelectDropDownOption,
  StoneDetail,
  StoneList,
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
  TransactionTypeEnum
} from '@poss-web/shared/models';
import { TepFacade } from '@poss-web/shared/tep/data-access-direct-tep';
import { ToolbarFacade } from '@poss-web/shared/toolbar/data-access-toolbar';
import { POSS_WEB_COIN_PRODUCT_GROUP_CODE } from '@poss-web/shared/util-config';
import { ErrorEnums } from '@poss-web/shared/util-error';
import {
  getcancelTEPUrl,
  getRequestListingUrl
} from '@poss-web/shared/util-site-routes';
import * as moment from 'moment';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
@Component({
  selector: 'poss-web-tep-request-view',
  templateUrl: './tep-request-view.component.html'
})
export class TepRequestViewComponent implements OnInit, OnDestroy {
  @ViewChild('tepSuccessNotificationTemplate', { static: true })
  private tepSuccessNotificationTemplate: TemplateRef<any>;
  tepType: string;
  tepTypesEnum = TepTypesEnum;
  tepPaymentTypesEnum = TepPaymentTypesEnum;
  createTepTypesEnum = CreateTepTypesEnum;
  tepStatusEnum = TepStatusEnum;
  createTepFormGroup: FormGroup;

  rsoNamesList: SelectDropDownOption[] = [];
  selectedRso: SelectDropDownOption;
  clearSelectedRsoName = false;
  searchProductList$: Observable<SearchProductList[]>;
  searchEnableFlag$: Observable<boolean>;
  tepDetails: TepTransactionResponse;
  tepItemList: any[] = [];
  tepTransactionId: string;
  tepItemConfiguration: GetTepItemConfiguratonResponse;
  customerId: number;
  recentlyAddedUniqueRowId: string;
  isLoading$: Observable<boolean>;
  isProductSearchLoading$: Observable<boolean>;
  roleCode = RoleCodesEnum.RSO;
  itemCode = '';
  destroy$: Subject<null> = new Subject<null>();
  modalDetails: SaveTepDataType;
  deleteId = '';
  deleteIdForSoftDelete = '';
  standardMetalRates: any;
  totalQty = 0;
  totalGrossWt = 0;
  totalExchangeAmt = 0;
  totalTax = 0;
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
  creditNoteNumber: number;
  docNo: number;
  srcDocNo: number;
  tepCnNo: number;
  status: string;
  openStatus: string;
  paymentOptionTypes = ['Cash', 'Cheque', 'RTGS'];
  isOpenTask = false;
  isLoggedIn: boolean;
  isViewTepItemPriceDetails = false;
  summaryBarRemarks$ = new Subject<string>();
  isSaleableModified = false;
  approverProcessType = '';

  cashMemoDetailsId = null;
  printErrorText: string;
  transactionTypeEnum = TransactionTypeEnum;
  subTransactionTypeEnum = SubTransactionTypeEnum;
  refundDetails: RefundDetails;
  isCashLimitExceeded: boolean;
  refundDeductionAmt: number;
  netRefundAmt: number;
  selectedPaymentMode: string;
  isTransactionSuccess = false;
  viewSelectedTepItemData: any;
  isTepRequestApprovalItemAlreadyAdded = false;
  selectedCustomer: any;
  isRefundFormValid = false;
  refundDetailsFromRefundForm: RefundDetails;
  updatedPrice: GetTepPriceDetailsResponse;
  standardMetalPriceDetails: any;
  isItemSaleable = false;
  transactionStatus = '';
  itemProductGroupCode = '';
  idProofImageUrl: string;
  cancelledChequeImageUrl: string;
  approvalMailImageUrl: string;
  uploadType: TepUploadTypes;
  workflowDetails: any;
  toolbarData: ToolbarConfig = {
    loadMetalPrices: true,
    loadHoldPopup: false,
    loadOpenOrdersPopup: false
  };
  filesList: any;
  selectionAllSubject: Subject<any> = new Subject<any>();
  selectionAllObservable = this.selectionAllSubject.asObservable();
  defaultImageUrl = 'assets/img/product-default-image.svg';
  currentLocationCode: string;
  allowedPaymentMode: string;

  reasonsForFullValueTep = [
    { value: 'Reason 1', description: 'Reason 1' },
    { value: 'Reason 2', description: 'Reason 2' }
  ];

  approverListForFvt = [];
  remarks = '';

  @ViewChild('confirmSuccessNotificationTemplate1', { static: true })
  confirmSuccessNotificationTemplate1: TemplateRef<any>;
  @ViewChild('confirmSuccessNotificationTemplate2', { static: true })
  confirmSuccessNotificationTemplate2: TemplateRef<any>;
  @ViewChild(ProductSearchAutocompleteComponent)
  private searchComponent: ProductSearchAutocompleteComponent;
  isCommonLoading$: Observable<boolean>;

  constructor(
    private toolbarFacade: ToolbarFacade,
    private productFacade: ProductFacade,
    public printingService: PrintingServiceAbstraction,
    private summaryBar: SummaryBarServiceAbstraction,
    private tepItemPopUpServiceAbstraction: TepItemPopUpServiceAbstraction,
    public tepFacade: TepFacade,
    private commonFacade: CommonFacade,
    private grnFacade: GrnFacade,
    private customerFacade: CustomerFacade,
    private translate: TranslateService,
    private router: Router,
    private dialog: MatDialog,
    private fileFacade: FileFacade,
    private activatedRoute: ActivatedRoute,
    private locationSettingsFacade: LocationSettingsFacade,
    private authFacade: AuthFacade,
    private overlayNotificationServiceAbstraction: OverlayNotificationServiceAbstraction,
    private alertPopupService: AlertPopupServiceAbstraction,
    private postConfirmationActions: PostTransactionConfirmationActionsServiceAbstraction,
    private discountsSelectionService: DiscountsSelectionServiceAbstraction,
    @Inject(POSS_WEB_COIN_PRODUCT_GROUP_CODE) public coinCode: string
  ) {
    this.commonFacade.loadTEPStandardMetalPriceDetails();
    this.createTepFormGroup = new FormGroup({
      fvtApprovalDate: new FormControl(null),
      fvtApprover: new FormControl(null),
      fvtReason: new FormControl(null),
      tepType: new FormControl(this.createTepTypesEnum?.REGULAR_TEP),
      tepPaymentType: new FormControl(this.tepPaymentTypesEnum.CN),
      selectedPaymentOptionForRefund: new FormControl(
        this.paymentOptionTypes[0]
      ),
      coinOfferDiscount: new FormControl(false),
      fvtApprovalCode: new FormControl({ value: null, disabled: true })
    });
    this.translate
      .get(['pw.otherReceiptsIssues.printError'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.printErrorText =
          translatedMessages['pw.otherReceiptsIssues.printError'];
      });
  }

  getWorkflow(type) {
    switch (type.toUpperCase()) {
      case CreateTepTypesEnum.REGULAR_TEP: {
        return 'TEP_APPROVAL_WORKFLOW';
      }
      case CreateTepTypesEnum.FULL_VALUE_TEP: {
        return 'FULL_VALUE_TEP';
      }
      case CreateTepTypesEnum.TEP_EXCEPTION_APPROVAL_WORKFLOW: {
        return CreateTepTypesEnum.TEP_EXCEPTION_APPROVAL_WORKFLOW;
      }
      case CreateTepTypesEnum.MANUAL_TEP: {
        return 'MANUAL_TEP';
      }
      case CreateTepTypesEnum.MANUAL_FULL_VALUE_TEP: {
        return 'MANUAL_FULL_VALUE_TEP';
      }
      default: {
        return 'TEP_APPROVAL_WORKFLOW';
      }
    }
  }

  ngOnInit(): void {
    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.TEP,
        CommomStateAttributeNameEnum.STANDARD_METAL_PRICE_DETAILS
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((standardMetalsPrice: any) => {
        if (standardMetalsPrice && !this.standardMetalPriceDetails) {
          this.standardMetalPriceDetails = standardMetalsPrice;
          this.updatePrice(standardMetalsPrice);
        }
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
    this.toolbarFacade.setToolbarConfig(this.toolbarData);

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
        const type = this.activatedRoute.snapshot.params['_txntype'];
        this.tepType = type;
        if (type) {
          this.createTepFormGroup
            .get('tepType')
            .patchValue(
              this.activatedRoute.snapshot.params['_txntype'].toUpperCase()
            );
        }
        const id = this.activatedRoute.snapshot.params['_id'];
        if (id) {
          this.tepItemList = [];

          this.tepFacade.loadTepTransactionDetails(
            this.activatedRoute.snapshot.params['_id'],
            this.createTepFormGroup.get('tepType').value ===
              CreateTepTypesEnum.TEP_EXCEPTION_APPROVAL_WORKFLOW
              ? CreateTepTypesEnum.REGULAR_TEP
              : this.createTepFormGroup.get('tepType').value,
            this.activatedRoute.snapshot.params['_processId'] &&
              (this.createTepFormGroup.get('tepType').value ===
                CreateTepTypesEnum.FULL_VALUE_TEP ||
                this.createTepFormGroup.get('tepType').value ===
                  CreateTepTypesEnum.TEP_EXCEPTION_APPROVAL_WORKFLOW ||
                this.createTepFormGroup.get('tepType').value ===
                  CreateTepTypesEnum.MANUAL_FULL_VALUE_TEP)
              ? true
              : false,
            this.createTepFormGroup.get('tepType').value ===
              CreateTepTypesEnum.TEP_EXCEPTION_APPROVAL_WORKFLOW
              ? true
              : false
          );
        }

        const action = this.activatedRoute.snapshot.params['_action'];
        if (action) {
          this.showSummaryBar(action);
        }
        const workFlow = this.activatedRoute.snapshot.params['_processId'];
        if (workFlow) {
          this.tepFacade.loadworkflowProcessDetails({
            processId: this.activatedRoute.snapshot.params['_processId'],
            workflowType: this.getWorkflow(
              this.activatedRoute.snapshot.params['_txntype']
            )
          });
        }
      });

    if (this.activatedRoute.snapshot.params['_txntype']) {
      this.tepType = this.activatedRoute.snapshot.params['_txntype'];
      this.createTepFormGroup
        .get('tepType')
        .patchValue(
          this.activatedRoute.snapshot.params['_txntype'].toUpperCase()
        );
    }
    if (this.activatedRoute.snapshot.params['_id']) {
      this.tepItemList = [];

      this.tepFacade.loadTepTransactionDetails(
        this.activatedRoute.snapshot.params['_id'],
        this.createTepFormGroup.get('tepType').value ===
          CreateTepTypesEnum.TEP_EXCEPTION_APPROVAL_WORKFLOW
          ? CreateTepTypesEnum.REGULAR_TEP
          : this.createTepFormGroup.get('tepType').value,
        this.activatedRoute.snapshot.params['_processId'] &&
          (this.createTepFormGroup.get('tepType').value ===
            CreateTepTypesEnum.FULL_VALUE_TEP ||
            this.createTepFormGroup.get('tepType').value ===
              CreateTepTypesEnum.TEP_EXCEPTION_APPROVAL_WORKFLOW ||
            this.createTepFormGroup.get('tepType').value ===
              CreateTepTypesEnum.MANUAL_FULL_VALUE_TEP)
          ? true
          : false,

        this.createTepFormGroup.get('tepType').value ===
          CreateTepTypesEnum.TEP_EXCEPTION_APPROVAL_WORKFLOW
          ? true
          : false
      );
      this.commonFacade.setTransactionTD(
        this.activatedRoute.snapshot.params['_id']
      );
    }

    if (this.activatedRoute.snapshot.params['_action']) {
      this.showSummaryBar(this.activatedRoute.snapshot.params['_action']);
    }

    if (this.activatedRoute.snapshot.params['_processId']) {
      this.tepFacade.loadworkflowProcessDetails({
        processId: this.activatedRoute.snapshot.params['_processId'],
        workflowType: this.getWorkflow(
          this.activatedRoute.snapshot.params['_txntype']
        )
      });
    }
    this.fileFacade.clearResponse();

    this.fileFacade.loadDocumentsList({
      customerId: null,
      docType: 'TEP',
      fileType: 'OTHERS',
      id: this.activatedRoute.snapshot.params['_id']
    });

    this.commonFacade.setTepTotalGrossWt(0);
    this.commonFacade.setTepTotalExchangeAmt(0);
    this.commonFacade.setTepTotalQty(0);
    this.commonFacade.setIsTepRefundFormValid(false);
    this.commonFacade.setIsTepRequestRaising(false);
    this.commonFacade.setTepSelectedPaymentMethod(null);
    this.getTranslatedAlertMessages();

    this.searchProductList$ = this.productFacade.getSearchProductList();
    this.searchEnableFlag$ = this.productFacade.getGridSearchEnable();

    this.commonFacade.setTransactionConfig({
      transactionType: {
        type: TransactionTypeEnum.TEP,
        subType:
          this.createTepFormGroup.get('tepType').value ===
          CreateTepTypesEnum.TEP_EXCEPTION_APPROVAL_WORKFLOW
            ? this.createTepTypesEnum.REGULAR_TEP
            : this.createTepFormGroup.get('tepType').value
      }
    });

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.TEP,
        CommomStateAttributeNameEnum.IS_TEP_REQUEST_RAISING
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((isTepRequestRaising: boolean) => {
        if (isTepRequestRaising) {
          this.isTepRequestApprovalItemAlreadyAdded = isTepRequestRaising;
        }
      });

    this.tepFacade
      .getCancelRequest()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: CancelTEPResponse) => {
        if (data) {
          this.showCancelNotification();
        }
      });

    this.grnFacade
      .getApprovers()
      .pipe(takeUntil(this.destroy$))
      .subscribe((approvers: GrnApproverSuccessList[]) => {
        this.approverListForFvt = approvers;
      });

    this.fileFacade
      .getDocumentsLst()
      .pipe(takeUntil(this.destroy$))
      .subscribe(docs => {
        if (docs) {
          this.filesList = docs;
        }
      });
    this.fileFacade
      .getDocumentUrlById()
      .pipe(takeUntil(this.destroy$))
      .subscribe(docUrl => {
        if (docUrl) {
          this.showPopup(docUrl);
        }
      });
    this.fileFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });

    this.tepFacade
      .getCancelTEPResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: CancelResponse) => {
        if (data) {
          this.srcDocNo = data.docNo;
          this.showCancelNotification(true);
        }
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

    this.printingService
      .getPrintError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
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

    this.getSelectedCustomer();
    this.getTepTransactionResponse();
    if (
      this.activatedRoute.snapshot.params['_processId'] &&
      (this.createTepFormGroup.get('tepType').value ===
        CreateTepTypesEnum.REGULAR_TEP ||
        this.createTepFormGroup.get('tepType').value ===
          CreateTepTypesEnum.MANUAL_TEP)
    ) {
    } else {
      this.getTepItemResponse();
    }

    this.getUpdateTepTransactionResponse();

    this.getTepItemProductCodeDetail();
    this.getTepItemConfiguration();

    this.getTepHoldOrConfirmationResponse();

    this.tepFacade
      .getTepCashMemoResponseItemList()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data?.results[0]?.cashMemoDetailsId) {
          this.cashMemoDetailsId = data?.results[0]?.cashMemoDetailsId;
        }
      });
    /* this.locationSettingsFacade
      .getLocationSetting(LocationSettingAttributesEnum.BANKING_PAYMENT_MODE)
      .pipe(takeUntil(this.destroy$))
      .subscribe((paymentMode: string) => {
        if (this.refundDetails) {
          this.allowedPaymentMode =
            paymentMode === RefundOptionTypes.RO_PAYMENT
              ? this.refundDetails.refundTypeSelected
              : paymentMode;
        }
      }); */
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
        }
      });

    this.tepFacade
      .getUpdatedPriceDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: GetTepPriceDetailsResponse) => {
        if (data) {
          this.updatedPrice = data;
          this.getTepItemResponse(data);
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

  updatePrice(standardPrice) {
    this.tepFacade
      .getWorkflowDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe(details => {
        if (details) {
          this.workflowDetails = details;
          let stonesList = [];
          if (details.approvedData.data.stones) {
            stonesList = details.approvedData.data.stones.map(
              (stone: StoneDetail) => {
                console.log('STONE :', stone);
                const stoneData: StoneList = {
                  measuredNoOfStones: stone.measuredNoOfStones,
                  stoneCode: stone.stoneCode,
                  measuredStoneWeight: stone.stoneWeight
                };
                return stoneData;
              }
            );
          } else if (details.headerData.data.tepExceptionDetails) {
            this.showSummaryBar(details.approvalStatus);
          } else if (!details.approvedData.data.stones) {
            stonesList = details.headerData.data.priceDetails.stones.map(
              (stone: StoneDetail) => {
                console.log('STONE :', stone);
                const stoneData: StoneList = {
                  measuredNoOfStones: stone.measuredNoOfStones,
                  stoneCode: stone.stoneCode,
                  measuredStoneWeight: stone.stoneWeight
                };
                return stoneData;
              }
            );
          }

          const updatePricePayload: GetTepPriceDetailsRequestPayload = {
            itemCode: details.headerData.data.itemCode,
            standardPrice: standardPrice,
            cashMemoDetailsId: details.headerData.data.cashMemoDetailsId,
            tepType: this.createTepFormGroup.get('tepType').value,
            measuredQuantity: details.headerData.data.totalQuantity,
            measuredWeight: details.headerData.data.stdWeight,
            stones: stonesList
          };
          if (
            (this.activatedRoute.snapshot.params['_processId'] &&
              this.createTepFormGroup.get('tepType').value ===
                CreateTepTypesEnum.REGULAR_TEP) ||
            this.createTepFormGroup.get('tepType').value ===
              CreateTepTypesEnum.MANUAL_TEP
          ) {
            this.tepFacade.updateItemPriceDetails(updatePricePayload);
          }

          this.showSummaryBar(details.approvalStatus);
        }
      });
  }

  showCancelNotification(value?: boolean): void {
    this.overlayNotificationServiceAbstraction
      .show({
        type: OverlayNotificationType.CUSTOM,
        hasBackdrop: true,
        hasClose: true,
        template: value
          ? this.confirmSuccessNotificationTemplate2
          : this.confirmSuccessNotificationTemplate1
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: OverlayNotificationEventRef) => {
        if (event.eventType === 0) {
          this.clearTepData();
          if (value) {
            this.router.navigate([getcancelTEPUrl()], {
              state: { clearFilter: false }
            });
          } else {
            this.router.navigate([getRequestListingUrl()], {
              state: { clearFilter: false }
            });
          }
        }
      });
  }

  loadImageUrl(fileData) {
    let extn = fileData.name.split('.').pop();
    extn = extn.toLowerCase();
    if (extn === FileTypeEnum.PDF) {
      this.fileFacade.downloadPdfFile(fileData);
    } else if (extn === FileTypeEnum.JPG || extn === FileTypeEnum.JPEG) {
      this.fileFacade.loadDocumentUrlById(fileData.id);
    }
  }

  showPopup(image): void {
    this.dialog.open(FilePreviewComponent, {
      height: '490px',
      width: '700px',
      autoFocus: false,
      data: {
        defaultImageUrl: this.defaultImageUrl,
        imageUrl: image,
        previewHeader: 'File upload'
      }
    });
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
          this.router.navigate([getRequestListingUrl()], {
            state: { clearFilter: false }
          });
        }
      });
  }
  getTepTransactionResponse() {
    this.tepFacade
      .getTepTransactionDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe((tepTransactionDetails: TepTransactionResponse) => {
        console.log(tepTransactionDetails, 't-tep');
        if (tepTransactionDetails) {
          this.tepItemList = [];
          this.tepDetails = tepTransactionDetails;

          this.isOpenTask = true;
          this.openStatus = tepTransactionDetails.status;

          this.tepTransactionId = tepTransactionDetails.id;
          this.customerId = tepTransactionDetails.customerId;

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
          }

          if (tepTransactionDetails.customerId) {
            this.customerFacade.loadSelectedCustomer(
              String(tepTransactionDetails.customerId),
              false,
              false
            );
          }
          this.tepFacade.SetTotalQty(tepTransactionDetails.totalQuantity);
          this.commonFacade.setTepTotalQty(tepTransactionDetails.totalQuantity);
          this.tepFacade.SetTotalGrossWt(tepTransactionDetails.totalWeight);
          this.commonFacade.setTepTotalGrossWt(
            tepTransactionDetails.totalWeight
          );
          this.tepFacade.SetTotalExchangeAmt(tepTransactionDetails.totalValue);

          this.totalTax = tepTransactionDetails.totalTax;

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
            this.refundDetails = {
              refundTypeSelected:
                tepTransactionDetails.refundDetails.data.refundMode,
              nameAsPerBankRecord:
                tepTransactionDetails.refundDetails.data.customerName,
              accountHolderName:
                tepTransactionDetails.refundDetails.data.customerName,
              bankName: tepTransactionDetails.refundDetails.data.bankName,
              accountNumber:
                tepTransactionDetails.refundDetails.data.bankAccountNo,
              reenteredAccountNumber:
                tepTransactionDetails.refundDetails.data.bankAccountNo,
              branch: tepTransactionDetails.refundDetails.data.branchName,
              ifscCode: tepTransactionDetails.refundDetails.data.ifscCode
            };

            this.refundDetailsFromRefundForm = this.refundDetails;
            this.allowedPaymentMode = this.refundDetails?.refundTypeSelected;
          } else {
            this.createTepFormGroup
              .get('tepPaymentType')
              .setValue(TepPaymentTypesEnum.CN);
          }
          if (
            this.createTepFormGroup.get('tepType').value ===
            CreateTepTypesEnum.CUT_PIECE_TEP
          ) {
            tepTransactionDetails.itemIds.forEach((tepItemId: string) => {
              this.tepFacade.loadTepItemDetails(
                tepTransactionDetails.id,
                tepItemId,
                this.createTepFormGroup.get('tepType').value ===
                  CreateTepTypesEnum.TEP_EXCEPTION_APPROVAL_WORKFLOW
                  ? CreateTepTypesEnum.REGULAR_TEP
                  : this.createTepFormGroup.get('tepType').value,
                this.createTepFormGroup.get('tepType').value ===
                  CreateTepTypesEnum.TEP_EXCEPTION_APPROVAL_WORKFLOW
                  ? CreateTepTypesEnum.REGULAR_TEP
                  : this.createTepFormGroup.get('tepType').value,
                this.selectedCustomer && this.selectedCustomer.mobileNumber
                  ? this.selectedCustomer.mobileNumber
                  : null
              );
            });
          } else {
            tepTransactionDetails.itemIdList.forEach((tepItemId: string) => {
              this.tepFacade.loadTepItemDetails(
                tepTransactionDetails.id,
                tepItemId,
                this.createTepFormGroup.get('tepType').value ===
                  CreateTepTypesEnum.TEP_EXCEPTION_APPROVAL_WORKFLOW
                  ? CreateTepTypesEnum.REGULAR_TEP
                  : this.createTepFormGroup.get('tepType').value,
                this.createTepFormGroup.get('tepType').value ===
                  CreateTepTypesEnum.TEP_EXCEPTION_APPROVAL_WORKFLOW
                  ? CreateTepTypesEnum.REGULAR_TEP
                  : this.createTepFormGroup.get('tepType').value,
                this.selectedCustomer && this.selectedCustomer.mobileNumber
                  ? this.selectedCustomer.mobileNumber
                  : null
              );
            });
          }

          if (this.transactionStatus === TepStatusEnum.APPROVED) {
            this.createTepFormGroup.get('tepPaymentType').disable();
          } else {
            this.createTepFormGroup.get('tepPaymentType').enable();
          }
          this.createTepFormGroup
            .get('tepPaymentType')
            .updateValueAndValidity();
          this.createTepFormGroup
            .get('fvtApprovalCode')
            .setValue(
              tepTransactionDetails.approvalDetails?.data?.approvalCode
            );
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
          this.createTepFormGroup.get('fvtApprover').disabled;

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
        } else {
          this.isOpenTask = false;
        }
      });
  }

  getTepItemResponse(value?: GetTepPriceDetailsResponse) {
    this.tepFacade
      .getTepItemDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe((tepItemDetails: any) => {
        if (tepItemDetails) {
          if (value) {
            tepItemDetails = { ...tepItemDetails, priceDetails: value };
          }

          const id = '_' + Math.random().toString(36).substr(2, 9);
          this.itemCode = tepItemDetails.itemCode;
          this.recentlyAddedUniqueRowId = id;
          let tepItemObject;
          if (this.tepType !== TepTypesEnum.TEP_CUT_PIECE) {
            tepItemObject = {
              rowKey: this.recentlyAddedUniqueRowId,
              cashMemoDetailsId: tepItemDetails.cashMemoDetailsId,
              variantCode: tepItemDetails.itemCode,
              lotNumber:
                this.tepDetails.status === TepStatusEnum.CONFIRMED
                  ? tepItemDetails.lotNumber
                  : tepItemDetails?.priceDetails?.lotNumber,
              cmAvailable: tepItemDetails.isCMMandatory,
              grossWt: tepItemDetails?.totalWeight,
              saleable: tepItemDetails.isSaleable,
              discountRecovered: tepItemDetails?.priceDetails?.discountRecovered
                ? tepItemDetails?.priceDetails?.discountRecovered
                : 0,
              deductionAmt: tepItemDetails?.priceDetails?.deductionAmount
                ? tepItemDetails?.priceDetails?.deductionAmount
                : 0,
              exchangeValue: tepItemDetails?.finalValue,

              totalTax: tepItemDetails.totalTax ? tepItemDetails.totalTax : 0,
              taxDetails: tepItemDetails.taxDetails
                ? tepItemDetails.taxDetails
                : null,
              refundDeduction: tepItemDetails?.priceDetails
                ?.refundDeductionAmount
                ? tepItemDetails?.priceDetails?.refundDeductionAmount
                : 0,
              formGroup: new FormGroup({
                cmAvailable: new FormControl({
                  value: tepItemDetails?.priceDetails?.iscashMemoAvailable,
                  disabled: true
                }),
                saleable: new FormControl({
                  value: tepItemDetails.isSaleable,
                  disabled: true
                })
              }),
              itemId: tepItemDetails.itemId,
              stonesDetails: tepItemDetails?.priceDetails?.stones,
              stoneDetailsList: tepItemDetails?.priceDetails?.stones,
              stoneDetails: tepItemDetails?.priceDetails?.stones,
              discountDetails: tepItemDetails.discountDetails,
              unitWeight: tepItemDetails.unitWeight,
              unitValue: tepItemDetails.unitValue,
              totalValue: tepItemDetails.totalValue,
              totalWeight: tepItemDetails.totalWeight,
              quantity: tepItemDetails.quantity,
              viewPriceDetails: tepItemDetails.priceDetails,
              workflowDetails:
                this.workflowDetails?.approvedData?.type ===
                'FULL_VALUE_TEP_DETAILS'
                  ? this.getPaymentType(
                      this.workflowDetails?.approvedData?.data
                    )
                  : null,
              workflowValue:
                this.workflowDetails?.approvedData?.type ===
                'FULL_VALUE_TEP_DETAILS'
                  ? this.tepDetails.totalValue
                  : null
            };
          } else {
            tepItemObject = {
              variantCode:
                tepItemDetails.itemDetails.data.ORIGINAL_ITEM.itemCode,
              lotNo: tepItemDetails.itemDetails.data.ORIGINAL_ITEM.lotNumber,
              grossWt:
                tepItemDetails.itemDetails.data.ORIGINAL_ITEM.grossWeight,
              goldWt:
                tepItemDetails.itemDetails.data.ORIGINAL_ITEM.metalWeight.data
                  .goldWeight,
              cutPieceCode: tepItemDetails.itemCode,
              cutPieceLotNo: tepItemDetails.lotNumber,
              cutPieceWt: tepItemDetails.stdWeight,
              itemId: tepItemDetails.id,
              cutPieceValue: tepItemDetails.stdValue,
              formGroup: new FormGroup({
                isHallmarking: new FormControl({
                  value: tepItemDetails?.isHallmarking,
                  disabled: true
                })
              })
            };
          }
          if (
            tepItemDetails.priceDetails &&
            tepItemDetails?.priceDetails?.refundDeductionAmount
          ) {
            this.refundDeductionAmt =
              this.refundDeductionAmt +
              (tepItemDetails?.priceDetails?.refundDeductionAmount
                ? tepItemDetails?.priceDetails?.refundDeductionAmount
                : 0);
          }

          if (
            this.createTepFormGroup.get('tepType').value ===
              CreateTepTypesEnum.FULL_VALUE_TEP ||
            this.createTepFormGroup.get('tepType').value ===
              CreateTepTypesEnum.MANUAL_FULL_VALUE_TEP
          ) {
            if (
              this.createTepFormGroup.get('tepPaymentType').value ===
              TepPaymentTypesEnum.REFUND
            ) {
              this.netRefundAmt =
                this.netRefundAmt + tepItemDetails.netRefundValue;
              this.commonFacade.setTepTotalRefundAmt(this.netRefundAmt);

              this.commonFacade.setTepSelectedPaymentMethod(
                TepPaymentTypesEnum.REFUND
              );
            } else {
              this.netRefundAmt =
                this.netRefundAmt + tepItemDetails.netRefundValue;

              this.commonFacade.setTepSelectedPaymentMethod(
                TepPaymentTypesEnum.CN
              );

              this.commonFacade.setTepTotalExchangeAmt(
                this.tepDetails.finalValue
              );
            }
          } else {
            if (
              this.createTepFormGroup.get('tepPaymentType').value ===
              TepPaymentTypesEnum.REFUND
            ) {
              this.netRefundAmt =
                this.netRefundAmt + tepItemDetails.netRefundValue;
              this.commonFacade.setTepTotalRefundAmt(this.netRefundAmt);

              this.commonFacade.setTepSelectedPaymentMethod(
                TepPaymentTypesEnum.REFUND
              );
            } else {
              this.netRefundAmt =
                this.netRefundAmt + tepItemDetails.netRefundValue;

              this.commonFacade.setTepSelectedPaymentMethod(
                TepPaymentTypesEnum.CN
              );

              this.commonFacade.setTepTotalExchangeAmt(
                this.tepDetails.finalValue
              );
            }
          }
          this.tepItemList = [...this.tepItemList, tepItemObject];
        }
      });
  }

  getPaymentType(value) {
    if (value.tepValue[0] === 'Current Value') {
      return value.paymentValue[0];
    } else if (value.tepValue[0] === 'Invoice Value') {
      return value.paymentValue[0];
    } else {
      return 'Overiding Value';
    }
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
          this.showTepSuccessNotification();
          this.isOpenTask = false;

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
        interBrandTepNotEligibleAlertMsg
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

  getRsoList() {
    this.tepFacade
      .getRsoList()
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: RsoNameObject[]) => {
        this.rsoNamesList = response;
        // if (response && response.length > 0) {
        //   this.rsoNamesList = response.map((rsoName: string) => {
        //     return { value: rsoName, description: rsoName };
        //   });
        // } else {
        //   this.rsoNamesList = [];
        // }
      });
  }

  getError() {
    this.tepFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error && error.code) {
          this.clearSearchField();

          this.errorHandler(error);
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
    } else {
      this.overlayNotificationServiceAbstraction
        .show({
          type: OverlayNotificationType.ERROR,
          hasClose: true,
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

  printError(msg) {
    this.overlayNotificationServiceAbstraction

      .show({
        type: OverlayNotificationType.TIMER,
        message: msg,
        hasClose: false
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: OverlayNotificationEventRef) => {
        if (this.activatedRoute.snapshot.params['_action'] === 'history') {
          this.showSummaryBar(this.activatedRoute.snapshot.params['_action']);
        } else {
          this.showTepSuccessNotification();
        }
      });
  }

  getSelectedCustomer() {
    this.customerFacade
      .getSelectSelectedCustomer()
      .pipe(takeUntil(this.destroy$))
      .subscribe(customer => {
        if (!this.isOpenTask) {
          if (!this.tepTransactionId && customer && customer.customerId) {
            this.selectedCustomer = customer;
            this.customerId = customer.customerId;
            this.tepFacade.createOpenTepTransaction(
              this.createTepFormGroup.get('tepType').value ===
                CreateTepTypesEnum.TEP_EXCEPTION_APPROVAL_WORKFLOW
                ? CreateTepTypesEnum.REGULAR_TEP
                : this.createTepFormGroup.get('tepType').value,
              {}
            );
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

  getTepItemConfiguration() {
    this.tepFacade
      .getTepItemConfiguratonResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: GetTepItemConfiguratonResponse) => {
        if (response) {
          this.clearSearchField();

          this.isItemSaleable = response.isTEPSaleBin;

          this.tepItemConfiguration = response;
          const itemObject = {
            ...this.tepItemConfiguration,
            itemCode: this.itemCode,
            rowKey: this.recentlyAddedUniqueRowId,
            coinOfferEnabled: this.createTepFormGroup.get('coinOfferDiscount')
              .value,
            isViewTepItemPriceDetails: this.isViewTepItemPriceDetails,
            viewSelectedTepItem: this.viewSelectedTepItemData,
            isTepRequestApprovedScenario: true,

            tepType:
              this.createTepFormGroup.get('tepType').value ===
              CreateTepTypesEnum.TEP_EXCEPTION_APPROVAL_WORKFLOW
                ? CreateTepTypesEnum.REGULAR_TEP
                : this.createTepFormGroup.get('tepType').value,
            productGroupCode: this.itemProductGroupCode
          };
          this.tepItemPopUpServiceAbstraction.open(itemObject).subscribe();
        }
      });
  }

  viewTepItemValuation(event) {
    this.isViewTepItemPriceDetails = true;
    this.viewSelectedTepItemData = event;
    this.tepFacade.loadTepItemConfiguration(
      event.variantCode,
      this.createTepFormGroup.get('tepType').value ===
        CreateTepTypesEnum.TEP_EXCEPTION_APPROVAL_WORKFLOW
        ? CreateTepTypesEnum.REGULAR_TEP
        : this.createTepFormGroup.get('tepType').value
    );
  }

  showSummaryBar(value): void {
    this.summaryBar
      .open(SummaryBarType.TEP_VIEW, {
        type: value,
        remarks: this.summaryBarRemarks$.asObservable()
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: SummaryBarEventRef) => {
        this.remarks = event.remarks;
        switch (event.eventType) {
          case SummaryBarEventType.CONFRIM: {
            const requestPayload: DiscountListPayload = {
              id: this.tepTransactionId,
              subTxnType:
                this.createTepFormGroup.get('tepType').value ===
                CreateTepTypesEnum.TEP_EXCEPTION_APPROVAL_WORKFLOW
                  ? CreateTepTypesEnum.REGULAR_TEP
                  : this.createTepFormGroup.get('tepType').value,
              txnType: TransactionTypeEnum.TEP
            };
            this.tepFacade.loadAvailableDiscountsList(requestPayload);
            break;
          }
          case SummaryBarEventType.CANCEL: {
            this.tepFacade.cancel(
              this.activatedRoute.snapshot.params['_processId'],
              this.getWorkflow(this.activatedRoute.snapshot.params['_txntype'])
            );
            break;
          }
          case SummaryBarEventType.CANCEL_TEP: {
            if (event.remarks) {
              const CancelPayload: BillCancelPayload = {
                employeeCode: this.tepDetails.employeeCode,
                reasonForCancellation: event.remarks,
                cancelType: null,
                refTxnId: this.tepDetails.id,
                remarks: null
              };
              this.tepFacade.cancelTEP(CancelPayload);
            }

            break;
          }
          case SummaryBarEventType.PRINT: {
            this.print();
            break;
          }

          case SummaryBarEventType.PRINT_ANNEXURE: {
            this.printAnnexure();
            break;
          }
        }
      });
  }

  printAnnexure() {
    this.printingService.loadPrintData({
      printType: printTypesEnum.TEP_ANNEXURE,
      transacionId: this.tepTransactionId,
      transacionType: printTransactionTypesEnum.SALES,
      printFileType: printFileTypeEnum.INVOICE_PRINT,
      doctype: printDocTypeEnum.CUSTOMER_PRINT,
      reprint: true,
      customerId: this.customerId,
      invoiceType: InvoiceDeliveryTypes.PRINT
    });

    // Todo : Integrate Print Service.
  }
  print(isTEPCancel?: boolean) {
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
            printType: 
              isTEPCancel 
                ? printTypesEnum.TEP_CANCEL_PRINTS 
                : this.createTepFormGroup.get('tepPaymentType').value === TepPaymentTypesEnum.REFUND 
                  ? printTypesEnum.TEP_REFUND
                  : printTypesEnum.TEP_PRINTS,
            transacionId: this.tepTransactionId,
            transacionType: printTransactionTypesEnum.SALES,
            printFileType: printFileTypeEnum.INVOICE_PRINT,
            doctype: printDocTypeEnum.CUSTOMER_PRINT,
            reprint: isTEPCancel ? false : true,
            customerId: this.customerId,
            invoiceType: action
          });
        }
      });
  }

  clearTepData() {
    this.remarks = '';
    this.transactionStatus = '';
    this.isTransactionSuccess = false;
    this.deleteId = '';

    this.customerFacade.clearCustomerSearch();
    this.customerFacade.clearSelectedCustomer();
    this.tepTransactionId = '';

    this.tepItemList = [];
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
    this.summaryBarRemarks$.next('');
    this.isTepRequestApprovalItemAlreadyAdded = false;
  }

  loadItemImageUrl(event: string) {
    this.commonFacade.loadCMImageUrl(event);
  }

  confirmOrHoldTep(
    tepStatusType: TepStatusEnum,
    type: TepPaymentTypesEnum,
    remarks?: string,
    discountTypeSelected?: string
  ) {
    this.tepFacade.resetAvailableDiscountsList();
    const confirmTepRequestPayload: ConfirmRequestTepRequestPayload = {
      metalRateList: { metalRates: this.standardMetalPriceDetails },
      totalValue:
        this.activatedRoute.snapshot.params['_processId'] &&
        (this.createTepFormGroup.get('tepType').value ===
          CreateTepTypesEnum.FULL_VALUE_TEP ||
          this.createTepFormGroup.get('tepType').value ===
            CreateTepTypesEnum.TEP_EXCEPTION_APPROVAL_WORKFLOW ||
          this.createTepFormGroup.get('tepType').value ===
            CreateTepTypesEnum.MANUAL_FULL_VALUE_TEP)
          ? this.tepDetails?.totalValue
          : this.updatedPrice?.finalValue,
      remarks: null,
      discountTypeSelected,
      totalWeight: this.tepDetails.totalWeight,
      refundDetails: this.tepDetails?.refundDetails
    };

    this.tepFacade.confirmRequestTep(
      this.tepTransactionId,
      tepStatusType,
      this.createTepFormGroup.get('tepType').value ===
        CreateTepTypesEnum.TEP_EXCEPTION_APPROVAL_WORKFLOW
        ? CreateTepTypesEnum.REGULAR_TEP
        : this.createTepFormGroup.get('tepType').value,
      this.createTepFormGroup.get('tepType').value ===
        CreateTepTypesEnum.REGULAR_TEP
        ? 'TEP_APPROVAL_WORKFLOW'
        : this.createTepFormGroup.get('tepType').value.toUpperCase(),
      confirmTepRequestPayload
    );
  }

  getSelectedPaymentOption(event: any) {
    this.tepFacade.SetPaymentMethod(event);
    this.commonFacade.setTepSelectedPaymentMethod(event);
    this.selectedPaymentMode = event;
  }

  getTepItemProductCodeDetail() {
    this.tepFacade
      .getTepItemProductCodeDetail()
      .pipe(takeUntil(this.destroy$))
      .subscribe((productGroupCode: string) => {
        if (productGroupCode) {
          this.itemProductGroupCode = productGroupCode;
          if (this.createTepFormGroup.get('coinOfferDiscount').value) {
            if (productGroupCode === '73') {
              this.tepFacade.loadTepItemConfiguration(
                this.itemCode,
                this.createTepFormGroup.get('tepType').value ===
                  CreateTepTypesEnum.TEP_EXCEPTION_APPROVAL_WORKFLOW
                  ? CreateTepTypesEnum.REGULAR_TEP
                  : this.createTepFormGroup.get('tepType').value
              );
            } else {
              this.tepFacade.SetTepItemProductCode('');
              this.showAlertNotification(this.coinOfferDiscountEnabledAlertMsg);
            }
          } else {
            this.tepFacade.loadTepItemConfiguration(
              this.itemCode,
              this.createTepFormGroup.get('tepType').value ===
                CreateTepTypesEnum.TEP_EXCEPTION_APPROVAL_WORKFLOW
                ? CreateTepTypesEnum.REGULAR_TEP
                : this.createTepFormGroup.get('tepType').value
            );
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
    if (this.customerId && this.tepTransactionId) {
      const id = '_' + Math.random().toString(36).substr(2, 9);

      const checkDuplicateItemList = this.tepItemList.filter((tepItem: any) => {
        return tepItem.variantCode === event.itemCode;
      });
      if (checkDuplicateItemList.length > 0) {
        this.showAlertNotification(this.itemAddedAlreadyAlertMsg);
      } else {
        this.itemCode = event.itemCode;
        this.recentlyAddedUniqueRowId = id;
        this.tepFacade.LoadTepItemProductCodeDetail(event.itemCode);
      }
      this.productFacade.loadProductDetails({
        itemCode: event.itemCode
      });
    } else {
      this.productFacade.clearSearchProductList();
      this.showAlertNotification(this.selectCustomerAlertMessage);
    }
  }

  exactSearchByItemcode(event: SearchEmitEvent) {
    this.productFacade.clearProductRelatedDetails();
    if (event.isValid) {
      this.productFacade.loadProductDetails({
        itemCode: event.searchValue
      });
    } else {
      this.productFacade.clearSearchProductList();
    }
  }

  getRefundDetails(event: RefundDetails) {
    this.refundDetailsFromRefundForm = event;
    if (event) {
      if (event.refundTypeSelected === RefundOptionTypes.CHEQUE) {
        if (event.nameAsPerBankRecord) {
          this.tepFacade.setIsRefundFormValid(true);
          this.commonFacade.setIsTepRefundFormValid(true);
        } else {
          this.tepFacade.setIsRefundFormValid(false);
          this.commonFacade.setIsTepRefundFormValid(false);
        }
      } else if (event.refundTypeSelected === RefundOptionTypes.RTGS) {
        if (
          event.accountHolderName &&
          event.accountNumber &&
          event.bankName &&
          event.branch &&
          event.ifscCode &&
          event.reenteredAccountNumber
        ) {
          this.tepFacade.setIsRefundFormValid(true);
          this.commonFacade.setIsTepRefundFormValid(true);
        } else {
          this.tepFacade.setIsRefundFormValid(false);
          this.commonFacade.setIsTepRefundFormValid(false);
        }
      } else if (event.refundTypeSelected === RefundOptionTypes.CASH) {
        this.tepFacade.setIsRefundFormValid(true);
        this.commonFacade.setIsTepRefundFormValid(true);
      }
    }
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

  ngOnDestroy() {
    this.isTepRequestApprovalItemAlreadyAdded = false;
    this.fileFacade.clearResponse();
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
