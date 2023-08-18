import {
  Component,
  EventEmitter,
  Inject,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CashMemoFacade } from '@poss-web/poss/cash-memo/data-access-cash-memo';
import { Input, OnChanges, SimpleChanges } from '@angular/core';
import {
  AddCnPopupComponent,
  ViewCnPopupComponent
} from '@poss-web/poss/shared/ui-add-cn-popup';
import { AddCoinPopupComponent } from '@poss-web/poss/shared/ui-add-coin-popup';
import { AddFocPopupComponent } from '@poss-web/poss/cash-memo/ui-add-foc-popup';
import { FocFacade } from '@poss-web/poss/foc/data-access-foc';
import {
  AbFocPopupComponent,
  AddFocAlertPopupComponent,
  FocOutOfStockComponent
} from '@poss-web/poss/foc/ui-foc-popups';
import { DiscountFacade } from '@poss-web/poss/shared/discount/data-access-discount';
import { ProductFacade } from '@poss-web/poss/shared/product/data-access-product';
import { ProductOutOfStockPopupComponent } from '@poss-web/poss/shared/product/ui-product';
import { ResetTcsPopupComponent } from '@poss-web/poss/shared/view-tcs/ui-view-tcs';
import { AuthFacade } from '@poss-web/shared/auth/data-access-auth';
import { CommonFacade } from '@poss-web/shared/common/data-access-common';
import {
  CurrencyFormatterService,
  WeightFormatterService
} from '@poss-web/shared/components/ui-formatters';
import { CustomerFacade } from '@poss-web/shared/customer/data-access-customer';
import { ProductSearchAutocompleteComponent } from '@poss-web/shared/item-master/ui-product-search-autocomplete';
import { LocationSettingsFacade } from '@poss-web/shared/location-settings/data-access-location-settings';
import {
  ABFocSchemeDetailsDto,
  AddFocPayload,
  AddFocPopupPayload,
  AddFocToCMPayload,
  AddFocToCmResponsePayload,
  AddManualFocPayload,
  AddManualFocToCMPayload,
  AdvanceBookingDetailsResponse,
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  AllowedPayments,
  AvailableSchemesPayload,
  CashMemoItemDetails,
  CashMemoItemDetailsRequest,
  CashMemoItemDetailsResponse,
  CashMemoItemValidate,
  CashMemoTaxDetails,
  CNDetailsRequestPayload,
  CoinDetails,
  CommomStateAttributeNameEnum,
  CommomStateAttributeTypeEnum,
  CreatedCustomerResponse,
  CreditNotePayment,
  CreditNoteType,
  CustomErrors,
  CUSTOMER_TYPE_ENUM,
  DiscountConfigDetailsResponse,
  DiscountPopupEnum,
  DiscountsResponse,
  DiscountTypeEnum,
  EditedWeightData,
  FocItemDetailsResponsePayload,
  FocSchemeDetailsDto,
  ItemHallmarkDetails,
  KeepFocPending,
  KeepFocPendingPayload,
  LocationSettingAttributesEnum,
  LovMasterEnum,
  ManualFocDetailsDto,
  MetalNamesEnum,
  MetalPrice,
  MetalTypeEnum,
  OverlayNotificationEventRef,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  PaymentDetails,
  PaymentGroupEnum,
  PaymentModeEnum,
  ProductDetails,
  ProductDetailsInGrid,
  ProductPriceDetails,
  ProductTypesEnum,
  RsoDetailsPayload,
  SearchEmitEvent,
  SearchProductList,
  SetTotalProductValuesPayload,
  SharedBodEodFeatureServiceAbstraction,
  SubTransactionTypeEnum,
  TaxTypesEnum,
  TransactionTypeEnum,
  UserProfile,
  ValidateManualFocPayload
} from '@poss-web/shared/models';
import { OrderConfirmationFacade } from '@poss-web/shared/order-confirmation/data-access-order-confirmation';
import { PaymentFacade } from '@poss-web/shared/payment/data-access-payment';
import { ToolbarFacade } from '@poss-web/shared/toolbar/data-access-toolbar';
import {
  POSS_WEB_COIN_PRODUCT_GROUP_CODE,
  POSS_WEB_MAX_NO_OF_ITEMS_IN_PRODUCT_GRID,
  POSS_WEB_TIME_TRACKING_LOG
} from '@poss-web/shared/util-config';
import { ErrorEnums } from '@poss-web/shared/util-error';
import { calculatePriceBreakup } from '@poss-web/shared/util-price';
import { Moment } from 'moment';
import { CommonBaseComponent } from '@poss-web/shared/util-common';
import { combineLatest, Observable, Subject } from 'rxjs';
import { filter, take, takeUntil, withLatestFrom } from 'rxjs/operators';
import { AddManualFocPopupComponent } from '@poss-web/poss/cash-memo/ui-add-manaul-foc-popup';
import { LotNumberSelectionPopupComponent } from '@poss-web/poss/shared/product/ui-product';
import { MatExpansionPanel } from '@angular/material/expansion';
import { UserManagementFacade } from '@poss-web/shared/user-mgmt/data-access-user';
import { FormControl, FormGroup } from '@angular/forms';
import { ElementPermissionService } from '@poss-web/shared/permission/util-element-permissions';
import { PermissionFacade } from '@poss-web/shared/permission/data-access-permission';

const selectRSO = 'Select RSO';
const RSOCode = 'RSO';
const weightCode = 'gms';

@Component({
  selector: 'poss-web-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent
  extends CommonBaseComponent
  implements OnInit, OnDestroy, OnChanges {
  customerDetails = null;
  isIGSTApplied = true;
  igstFormGroup: FormGroup;
  userProfile: UserProfile;
  isUserProfileLoading$: Observable<boolean>;
  customerId = null;
  cashMemoId = null;
  cashMemoStatus = null;
  rsoDetails: RsoDetailsPayload[] = [];
  regularItemArray = [];
  coinItemArray = [];
  editedItem: ProductDetailsInGrid;
  editedItemEvent: any;
  editedWeightData: EditedWeightData;
  metalRate: any;
  otherChargesList: any;
  standardPrice: any;
  taxDetails: CashMemoTaxDetails;
  priceDetails: ProductPriceDetails;
  transactionType: TransactionTypeEnum;
  silverCoinCode = '82';

  subTransactionType: SubTransactionTypeEnum;
  subTransactionTypeRef = SubTransactionTypeEnum;
  taxTransactionType: TransactionTypeEnum;
  transactionTypeEnumRef = TransactionTypeEnum;
  transactionId: string;
  pgDescription: {};
  taxAmt = 0;
  totalAmt = 0;
  finalAmt = 0;
  roundOff = 0;
  hallmarkCharges = 0;
  hallmarkDiscount = 0;

  rsoNames: { code: string; name: string }[] = [];
  selectRSO = 'Select RSO';
  isAddFlag = false;
  isUpdateFlag: boolean;
  isDeleteFlag = false;
  isLotNumberUpdate: boolean;
  isActualWeightUpdate: boolean;
  isQuantityUpdate: boolean;
  isLotNumberAdd: boolean;
  isUpdateSingleAutoDiscount = false;
  isLoading$: Observable<boolean>;
  isPriceLoading$: Observable<boolean>;
  isTaxLoading$: Observable<boolean>;
  isItemLoading$: Observable<boolean>;
  isCoinLoading$: Observable<boolean>;
  isTransactionLevelDiscountsLoading$: Observable<boolean>;
  isAutoDiscLoading$: Observable<boolean>;
  searchProductList$: Observable<SearchProductList[]>;
  isValid$: Observable<any>;
  product: ProductDetailsInGrid | ProductDetailsInGrid[];
  clearAllData$: Subject<null> = new Subject<null>();
  errorData$: Subject<boolean> = new Subject<boolean>();
  deleteSuccessResponse$: Subject<ProductDetailsInGrid> = new Subject<
    ProductDetailsInGrid
  >();
  resetLotNumber$: Subject<any> = new Subject<any>();
  destroy$: Subject<null> = new Subject<null>();

  @ViewChild(ProductSearchAutocompleteComponent)
  private searchComponent: ProductSearchAutocompleteComponent;
  imageUrlData$: Subject<any> = new Subject<any>();

  productType: string;
  enableProductGridUpdate = true;
  isRsoSelected = true;
  itemDetails: CashMemoItemDetailsResponse[] = [];
  outOfStockArray: CashMemoItemDetails[] = [];
  searchEnableFlag$: Observable<boolean>;
  isWeightEditConfig: boolean;
  isGRFAllowedCM: boolean;
  isGRFAllowedAB: boolean;
  minimumGRFUtilization: number;
  minimumGRNUtilization: number;
  isGRNAllowedCM: boolean;
  isGrnAllowedInAdvanceBooking: boolean;
  noOfProducts: number;
  currencyCode: string;
  coinData: any;
  addCoinFromSearch = false;
  reasons: string[] = [];

  // coin

  coinDetails: CoinDetails[] = [];
  coinPriceDetails$: Observable<ProductPriceDetails>;
  coinTaxDetails$: Observable<CashMemoTaxDetails>;
  coinGoldRate$: Observable<MetalPrice[]>;
  validCoinDetails$: Observable<{
    itemCode: string;
    coinDetails: CoinDetails[];
  }>;

  productDetails$: Observable<any>;
  // foc

  activeFocSchemes: AvailableSchemesPayload[] = [];
  selectedItemsDetails: CashMemoItemDetailsResponse[] = [];
  focSchemesAndItems: FocSchemeDetailsDto[] = [];
  focItemDetails: FocItemDetailsResponsePayload[];
  manualFocItemDetails: FocItemDetailsResponsePayload[];
  focPopupData = [];
  manualFocPopUpData = [];
  focParentForm: any;
  manualFocParentForm: any;
  selectedFocItems = [];
  selectedManualFocItems = [];
  focItemsInGrid: AddFocToCmResponsePayload[] = [];
  isFocAdded = false;
  isManualFocAdded = false;
  isFocKeptPending = false;
  isBillLevelDiscountsAdded = false;
  isSystemDDvDiscountsAdded = false;
  isSystemGhsBonusDiscountAdded = false;
  removeAllFocItems$: Subject<boolean> = new Subject<boolean>();
  focPopupData$: Subject<any> = new Subject<[]>();
  manualFocPopupData$: Subject<any> = new Subject<[]>();
  isLoadingFocItemDetails$: Observable<boolean>;
  isLoadingManualFocItemDetails$: Observable<boolean>;
  isFocLoading$: Observable<boolean>;
  focSelectedRso: string;
  manualFocSelectedRso: string;
  bussinessDay: number;
  keepFocPendingTrigger: boolean;
  isLoggedIn: boolean;
  abDetails = null;
  abDetailsPendingItemsCount = 0;
  isErrorinPriceUpdate = false;
  outOfStockItemsCount = 0;
  selectedOutOfStockItems = [];
  frozenAB: boolean;

  // Product Grid Data
  rsoDetails$: Subject<RsoDetailsPayload[]> = new Subject<
    RsoDetailsPayload[]
  >();
  reasons$: Observable<string[]>;
  pgDesc$: Observable<{}>;
  itemId: string;
  isAddItem = false;
  isUpdateItem = false;
  tempRowNumber = -1;
  headerDetails = null;
  updateDiscountDetails = [];
  cashMemoDiscountDetails: any;
  appliedEmployeeCouponCode = null;
  appliedTsssCouponCode = null;
  appliedTataEmployeeDiscountDetails = null;
  appliedEmpowermentDiscountDetails = null;
  appliedRivaahGhsDiscountDetails = null;
  employeeCodeRso: string;
  ulpID: string;
  enrolmentDate: Moment;
  existingDiscounts = [];
  isAddAllItem = false;
  addedEncircle = null;
  isABInvokedFirstTime = false;
  showEncircleAlert = true;
  totalNoOfItemsInProductGrid = 0;
  productGridLimitMsg: string;
  addMultipleCoinsCount = 0;
  selectedAutoDiscounts = [];
  abItemIdList = [];
  tcsToBeCollectedAtCM: number;
  paymentDetails: PaymentDetails[] = [];
  isCnRedeemed: boolean;
  cnPaymentDetails: PaymentDetails;

  allowedPayments: AllowedPayments = new Map<
    PaymentModeEnum,
    PaymentGroupEnum
  >();
  grfToleranceDetails: any;
  grnToleranceDetails: any;
  locationCode: string;
  customerMobileNumber: string;
  manualFocSchemesAndItems: ManualFocDetailsDto[] = [];
  currentFiscalYear: string;
  manualFocValidationDetails$: Observable<any>;
  isABInvoked$: Observable<boolean>;
  isABInvoked = false;
  grfCNErrorMsg1: string;
  selectedABFOCSchemesCount$: Observable<number>;
  rowId = 0;
  paymentModeEnumRef = PaymentModeEnum;
  totalFocWeightItems: number;
  keepFOCPending = true;
  @Input() setFocus: number;
  setFocusInProductSearch = false;
  @ViewChild(MatExpansionPanel) pannel?: MatExpansionPanel;
  removeFromOrder: boolean;
  selectedRSONames = [];
  isCommonLoading$: Observable<any>;
  isABDiscountsSelected = false;
  selectRSONameLabel: string;
  searchByRSOCodeLabel: string;
  selectedEventRso: any;
  isIGST = false;
  permissions$: Observable<any[]>;
  @Input() products = '';
  cummulativeDiscountWithExcludeDetails: any;

  CASH_MEMO_ADD_EDIT_SUBMENU =
    'Customer Transaction Status-Cashmemo Add/Edit Submenu';
  AB_ADD_EDIT_SUBMENU = 'Customer Transaction Status-AB Add/Edit Submenu';

  constructor(
    private productFacade: ProductFacade,
    private dialog: MatDialog,
    public customerFacade: CustomerFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private toolbarFacade: ToolbarFacade,
    private translate: TranslateService,
    private paymentFacade: PaymentFacade,
    public commonFacade: CommonFacade,
    private focFacade: FocFacade,
    private activatedRoute: ActivatedRoute,
    private weightFormatterService: WeightFormatterService,
    private currencyFormatterService: CurrencyFormatterService,
    private authFacade: AuthFacade,
    @Inject(POSS_WEB_COIN_PRODUCT_GROUP_CODE)
    public coinCode: string,
    private locationSettingsFacade: LocationSettingsFacade,
    private bodEodFeatureService: SharedBodEodFeatureServiceAbstraction,
    private orderConfirmationFacade: OrderConfirmationFacade,
    private cashMemoFacade: CashMemoFacade,
    public discountFacade: DiscountFacade,
    private permissionfacade: PermissionFacade,
    private elementPermission: ElementPermissionService,
    private alertPopupService: AlertPopupServiceAbstraction,
    @Inject(POSS_WEB_MAX_NO_OF_ITEMS_IN_PRODUCT_GRID)
    public maxNoOfItemsInProductGrid: number,
    @Inject(POSS_WEB_TIME_TRACKING_LOG) public timeTrackingLog: boolean,
    private userManagementFacade: UserManagementFacade
  ) {
    super(timeTrackingLog);
    this.translate
      .get([
        'pw.productGrid.productGridLimitMsg',
        'pw.productGrid.grfCNErrorMsg1',
        'pw.productGrid.selectRSONameLabel',
        'pw.productGrid.searchByRSOCodeLabel'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.productGridLimitMsg =
          translatedMessages['pw.productGrid.productGridLimitMsg'];
        this.grfCNErrorMsg1 =
          translatedMessages['pw.productGrid.grfCNErrorMsg1'];
        this.selectRSONameLabel =
          translatedMessages['pw.productGrid.selectRSONameLabel'];
        this.searchByRSOCodeLabel =
          translatedMessages['pw.productGrid.searchByRSOCodeLabel'];
      });
    this.igstFormGroup = new FormGroup({
      isIGST: new FormControl(this.isIGST)
    });
    this.userManagementFacade.loadUserProfile();
  }

  ngOnInit(): void {
    this.isUserProfileLoading$ = this.userManagementFacade.isLoading();
    this.permissions$ = this.permissionfacade.getPermissionforURL();
    this.productFacade.resetValues();
    this.discountFacade.setIsRsoSelected(this.isRsoSelected);
    this.componentInit();
    this.getDiscountReponse();
    this.productFacade
      .getClearProductGrid()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data === true) {
          this.clearPage(true);
        }
      });
    this.userManagementFacade
      .getUserProfile()
      .pipe(takeUntil(this.destroy$))
      .subscribe((userProfile: UserProfile) => {
        this.userProfile = userProfile;
      });
    this.productFacade
      .getPartialUpdateCashMemoResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.discountFacade.loadReloadDiscountsGrid(true);
        }
      });
    this.discountFacade
      .getIsExcludeSlabItemAdded()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: boolean) => {
        if (data) {
          this.discountFacade.loadReloadDiscountsGrid(true);
        }
      });
    this.authFacade
      .isUserLoggedIn()
      .pipe(takeUntil(this.destroy$))
      .subscribe((isLoggedIn: boolean) => {
        this.isLoggedIn = isLoggedIn;
      });

    this.cashMemoFacade
      .getViewCashMemoResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.cashMemoStatus = data?.status;
        this.cashMemoDiscountDetails = data?.discountDetails;
        this.appliedEmployeeCouponCode = this.cashMemoDiscountDetails?.data?.employeeDetails?.couponDetails[0]?.couponCode;
        this.appliedTsssCouponCode = this.cashMemoDiscountDetails?.data?.tsssDetails?.couponDetails[0]?.couponCode;
        this.appliedTataEmployeeDiscountDetails = this.cashMemoDiscountDetails?.data?.tataEmployeeDetails;
        this.appliedEmpowermentDiscountDetails = this.cashMemoDiscountDetails?.data?.empowermentDetails?.applyEmpowermentDiscount;
        this.appliedRivaahGhsDiscountDetails = this.cashMemoDiscountDetails?.data?.rivaahGhsDiscountDetails;
        this.employeeCodeRso = data?.employeeCode;
        if (this.cashMemoStatus) {
          this.rowId = data.itemIdList.length;
          this.focFacade.loadPendingCM({
            transactionId: this.cashMemoId,
            txnType: TransactionTypeEnum.CM,
            subTxnType: SubTransactionTypeEnum.NEW_CM,
            status: this.cashMemoStatus
          });
          this.loadAssignedFOC();
          this.loadAssignedManualFOC();
        }
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

    if (this.transactionType === this.transactionTypeEnumRef.CM) {
      this.commonFacade
        .getCommonFacadeAttributes(
          CommomStateAttributeTypeEnum.CASHMEMO,
          CommomStateAttributeNameEnum.IS_IGST_FLAG
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe((isIGSTFlag: boolean) => {
          if (isIGSTFlag !== this.isIGST) {
            this.isIGST = isIGSTFlag;
            this.igstFormGroup.get('isIGST').patchValue(this.isIGST);
          }
        });
    }
  }

  loadPermission = (element: string) =>
    this.elementPermission.loadPermission(element, this.permissions$);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['setFocus']) {
      if (
        (this.setFocus === 2 &&
          this.subTransactionType === SubTransactionTypeEnum.NEW_CM) ||
        (this.setFocus === 3 &&
          this.subTransactionType === SubTransactionTypeEnum.MANUAL_CM)
      ) {
        this.pannel.open();
        this.setFocusInProductSearch = true;
      } else {
        this.setFocusInProductSearch = false;
      }
    }
  }

  componentInit() {
    this.productFacade.loadRSODetails(RSOCode);
    this.productFacade.loadReasons(LovMasterEnum.WEIGHT_EDIT_REASON_TYPE);
    this.isLoading$ = this.productFacade.getIsLoading();
    this.isPriceLoading$ = this.productFacade.getIsPriceLoading();
    this.isTaxLoading$ = this.productFacade.getIsTaxLoading();
    this.isItemLoading$ = this.productFacade.getIsItemLoading();
    this.isCoinLoading$ = this.productFacade.getIsCoinLoading();
    this.searchProductList$ = this.productFacade.getSearchProductList();
    this.isValid$ = this.productFacade.getValidateWeight();
    this.isLoadingFocItemDetails$ = this.focFacade.getIsLoadingFocItemDetails();
    this.isLoadingManualFocItemDetails$ = this.focFacade.getIsLoadingManualFocItemDetails();
    this.isFocLoading$ = this.focFacade.getIsLoading();
    this.searchEnableFlag$ = this.productFacade.getGridSearchEnable();
    this.isTransactionLevelDiscountsLoading$ = this.discountFacade.getIsLoading();
    this.isAutoDiscLoading$ = this.discountFacade.getIsAutoDiscLoading();
    this.reasons$ = this.productFacade.getReasons();
    this.manualFocValidationDetails$ = this.focFacade.getIsManualFocValidated();
    this.isABInvoked$ = this.cashMemoFacade.getIsABInvoked();
    this.selectedABFOCSchemesCount$ = this.focFacade.getSelectedABFocSchemesCount();
    this.userManagementFacade
      .getError()
      .pipe(
        takeUntil(this.destroy$),
        filter(errorVal => !!errorVal)
      )
      .subscribe(errorVal => this.showNotification(errorVal));

    this.focFacade.resetFOCData();

    this.locationSettingsFacade
      .getLocationSetting(LocationSettingAttributesEnum.COUNTRY_FISCAL_YEAR)
      .pipe(takeUntil(this.destroy$))
      .subscribe((fiscalYear: string) => {
        this.currentFiscalYear = fiscalYear;
      });

    this.locationSettingsFacade
      .getLocationSetting(LocationSettingAttributesEnum.GLOBAL_LOCATION_CODE)
      .pipe(
        filter(status => !!status),
        takeUntil(this.destroy$)
      )
      .subscribe(locationCode => {
        this.locationCode = locationCode;
      });

    this.isABInvoked$.pipe(takeUntil(this.destroy$)).subscribe(isABInvoked => {
      this.isABInvoked = isABInvoked;
    });

    this.productFacade
      .getHasError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          if (
            error.code !== ErrorEnums.ERR_SALE_053 &&
            error.code !== ErrorEnums.ERR_SALE_390 &&
            error.code !== ErrorEnums.ERR_SALE_008
          )
            this.errorHandler(error);
        }
      });
    this.cashMemoFacade
      .getHasError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          if (error.code === ErrorEnums.ERR_SALE_103) this.errorHandler(error);
        }
      });

    this.paymentFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          if (error.code === ErrorEnums.ERR_SALE_103) this.errorHandler(error);
        }
      });
    this.paymentFacade
      .getAllowedPayments()
      .pipe(takeUntil(this.destroy$))
      .subscribe(allowedPayments => {
        this.allowedPayments = allowedPayments;
      });
    this.paymentFacade
      .getPaymentDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe(paymentDetails => {
        this.paymentDetails = paymentDetails;
        this.isCnRedeemed = false;
        this.isCnRedeemed = paymentDetails.some(
          x => x.otherDetails?.data?.isRateProtectedCN
        );
        this.cnPaymentDetails = paymentDetails.find(
          x => x.otherDetails?.data?.isRateProtectedCN
        );
        paymentDetails.forEach(x => {
          // .toString() === payload.payload.instrumentNo.toString();
          // if (x.instrumentNo.toString() === payload.payload.instrumentNo.toString()) {
          //   this.cnPaymentDetails = x;
          // }
        });
      });
    this.focFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });
    this.orderConfirmationFacade
      .getHasError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          if (
            error.code !== ErrorEnums.ERR_SALE_053 &&
            error.code !== ErrorEnums.ERR_SALE_390 &&
            error.code !== ErrorEnums.ERR_SALE_008
          )
            this.errorHandler(error);
        }
      });

    this.productFacade
      .getSearchProductListCount()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: number) => {
        if (data !== -1) {
          if (data === 0) {
            this.searchComponent.noSearchResultFound = true;
          } else {
            this.searchComponent.noSearchResultFound = false;
          }
        }
      });

    this.productFacade
      .getProductDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe((productValue: ProductDetails[]) => {
        this.addStopTracking(
          'pw.instrumentationMessges.exactItemCodeSearchMsg'
        );
        this.addStopTracking('pw.instrumentationMessges.scanningItemCodeMsg');
        let productFlag: boolean;
        let productDetail: ProductDetails;

        if (productValue.length !== 0) {
          if (productValue.length === 1) {
            const availableLotNumbers = [];
            productFlag = true;
            productValue.forEach(element => {
              availableLotNumbers.push({
                lotNumber: element.lotNumber,
                inventoryId: element.inventoryId,
                totalQuantity: element.totalQuantity
              });
              if (this.validateProduct(element.inventoryId)) {
                if (productFlag === true) {
                  productDetail = element;
                  productFlag = false;
                }
              }
            });
            if (productFlag === true) {
              this.errorData$.next(true);
            } else {
              this.errorData$.next(false);
              this.addStopTracking(
                'pw.instrumentationMessges.loadItemDetailsMsg'
              );
              if (productDetail.productGroupCode === this.coinCode) {
                this.productFacade.loadValidateProductAndPriceDetails({
                  inventoryId: productDetail.inventoryId,
                  orderPriceRequest: {
                    checkInventory: true,
                    itemCode: productDetail.itemCode,
                    lotNumber: productDetail.lotNumber,
                    inventoryId: productDetail.inventoryId,
                    standardPrice: this.standardPrice,
                    // measuredQuantity: productDetail.totalQuantity,
                    // measuredWeight:
                    //   productDetail.unitWeight * productDetail.totalQuantity
                    measuredQuantity: 1,
                    measuredWeight: productDetail.unitWeight
                  },
                  productDetails: productDetail,
                  availableLotNumbers: availableLotNumbers,
                  txnDetails: {
                    id: this.cashMemoId,
                    txnType: this.transactionType,
                    subTxnType: this.subTransactionType
                  },
                  isABInvoked: this.isABInvoked
                });
              } else {
                this.addStartTracking(
                  'pw.instrumentationMessges.loadPriceDetailsMsg'
                );
                this.productFacade.loadValidateProductAndPriceDetails({
                  inventoryId: productDetail.inventoryId,
                  orderPriceRequest: {
                    checkInventory: true,
                    itemCode: productDetail.itemCode,
                    lotNumber: productDetail.lotNumber,
                    inventoryId: productDetail.inventoryId,
                    standardPrice: this.standardPrice
                  },
                  productDetails: productDetail,
                  availableLotNumbers: availableLotNumbers,
                  txnDetails: {
                    id: this.cashMemoId,
                    txnType: this.transactionType,
                    subTxnType: this.subTransactionType
                  },
                  isABInvoked: this.isABInvoked
                });
              }
              this.addStartTracking(
                'pw.instrumentationMessges.loadTaxDetailsMsg'
              );
              if (productDetail && this.taxTransactionType) {
                this.productFacade.loadTaxDetails({
                  customerId: this.customerId,
                  isIGST: this.isIGST,
                  itemCode: productDetail.itemCode,
                  txnType: this.taxTransactionType
                });
              }
            }
          } else {
            const availableLotNumbers = [];
            productValue.forEach(element => {
              availableLotNumbers.push({
                lotNumber: element.lotNumber,
                inventoryId: element.inventoryId,
                totalQuantity: element.totalQuantity,
                isAdded: !this.validateProduct(element.inventoryId)
              });
            });
            this.openLotNumberSelection(productValue, availableLotNumbers);
          }
        }
      });

    this.productFacade
      .getProductDetailsCount()
      .pipe(takeUntil(this.destroy$))
      .subscribe((count: number) => {
        if (count !== -1) {
          if (count === 0) {
            this.searchComponent.noSearchResultFound = true;
          } else {
            this.searchComponent.noSearchResultFound = false;
          }
        }
      });

    this.productFacade
      .getLotNumberDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: ProductDetails) => {
        if (data) {
          if (this.isActualWeightUpdate === true) {
            this.productFacade.loadValidateProductAndPriceDetails({
              inventoryId: data.inventoryId,
              orderPriceRequest: {
                checkInventory: true,
                itemCode: data.itemCode,
                lotNumber: data.lotNumber,
                inventoryId: data.inventoryId,
                measuredQuantity: this.editedItem.quantity,
                measuredWeight: this.editedWeightData.actualWeight,
                standardPrice: this.standardPrice
              },
              productDetails: data,
              txnDetails: {
                id: this.cashMemoId,
                txnType: this.transactionType,
                subTxnType: this.subTransactionType
              },
              isABInvoked: this.isABInvoked
            });
          } else if (this.editedItem.productGroup === this.silverCoinCode) {
            this.productFacade.loadValidateProductAndPriceDetails({
              inventoryId: data.inventoryId,
              orderPriceRequest: {
                checkInventory: true,
                itemCode: data.itemCode,
                lotNumber: data.lotNumber,
                inventoryId: data.inventoryId,
                measuredQuantity: this.editedItem.quantity,
                measuredWeight: Number(
                  this.editedItem.quantity * this.editedItem.unitWeight
                ),
                standardPrice: this.standardPrice
              },
              productDetails: data,
              txnDetails: {
                id: this.cashMemoId,
                txnType: this.transactionType,
                subTxnType: this.subTransactionType
              },
              isABInvoked: this.isABInvoked
            });
          } else {
            this.productFacade.loadValidateProductAndPriceDetails({
              inventoryId: data.inventoryId,
              orderPriceRequest: {
                checkInventory: true,
                itemCode: data.itemCode,
                lotNumber: data.lotNumber,
                inventoryId: data.inventoryId,
                standardPrice: this.standardPrice
              },
              productDetails: data,
              txnDetails: {
                id: this.cashMemoId,
                txnType: this.transactionType,
                subTxnType: this.subTransactionType
              },
              isABInvoked: this.isABInvoked
            });
          }
          if (this.taxTransactionType && data?.itemCode) {
            this.productFacade.loadTaxDetails({
              customerId: this.customerId,
              isIGST: this.isIGST,
              itemCode: data.itemCode,
              txnType: this.taxTransactionType
            });
          }
        }
      });

    combineLatest([
      this.productFacade
        .getValidateProductAndPriceDetails()
        .pipe(takeUntil(this.destroy$)),
      this.productFacade.getTaxDetails().pipe(takeUntil(this.destroy$))
    ]).subscribe(([priceDetails, taxDetails]) => {
      if (priceDetails && taxDetails) {
        if (this.isUpdateFlag === false) {
          if (this.cashMemoId !== null) {
            this.addItemToCashMemo(priceDetails, taxDetails);
          } else {
            this.isAddFlag = true;
            this.priceDetails = priceDetails;
            this.taxDetails = taxDetails;
            this.productFacade.setCreateOrder(true);
          }
        } else if (this.isUpdateFlag === true) {
          if (this.isActualWeightUpdate === true) {
            this.isActualWeightUpdate = false;
            this.updateActualWeightValue(
              this.editedItem,
              this.editedWeightData,
              priceDetails,
              taxDetails
            );
          } else if (this.isLotNumberUpdate === true) {
            this.isLotNumberUpdate = false;
            this.isLotNumberAdd = true;
            this.updateLotNumberValue(
              this.editedItem,
              priceDetails,
              taxDetails
            );
          }
        }
        this.addStopTracking('pw.instrumentationMessges.loadPriceDetailsMsg');
        this.addStopTracking('pw.instrumentationMessges.loadTaxDetailsMsg');
      }
    });

    this.productFacade
      .getRSODetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe((rsoDetails: RsoDetailsPayload[]) => {
        console.log('rsoDetails:', rsoDetails);
        this.rsoDetails = [];
        if (rsoDetails.length !== 0) {
          rsoDetails.forEach(element =>
            this.rsoDetails.push({ code: element.code, name: element.name })
          );
          this.rsoDetails$.next(this.rsoDetails);
        }
      });

    this.productFacade
      .getDeleteItemFromCashMemoResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (item: {
          responseData: CashMemoItemDetailsResponse;
          itemDetails: ProductDetailsInGrid;
        }) => {
          console.log(item, 'item cm');

          if (item) {
            if (this.isDeleteFlag === true) {
              // if (
              //   item?.itemDetails?.selectedDiscounts?.filter(
              //     discount =>
              //       discount.discountType ===
              //         DiscountTypeEnum.SLAB_BASED_DISCOUNT ||
              //       discount.discountType ===
              //         DiscountTypeEnum.HIGH_VALUE_DISCOUNT ||
              //       discount.discountType ===
              //         DiscountTypeEnum.BEST_DEAL_DISCOUNT
              //   ).length > 0
              // ) {
              this.discountFacade.loadReloadDiscountsGrid(true);
              // }
              this.getTotalProductValues(
                this.itemDetails,
                item.responseData,
                null
              );
              this.deleteSuccessResponse$.next(item.itemDetails);
              this.addStopTracking(
                'pw.instrumentationMessges.deleteItemFromGridMsg'
              );
              if (item?.responseData?.txnType === TransactionTypeEnum.AB) {
                this.commonFacade.setABMinABVAlue(
                  item.responseData?.minOrderPayment >
                    item.responseData?.minDiscountPayment
                    ? item.responseData?.minOrderPayment
                    : item.responseData?.minDiscountPayment
                );
                this.commonFacade.setminFrozenABVAlue(
                  item.responseData?.minPaymentDetails?.data?.frozenMinPayment
                );
                if (
                  item.responseData.isFrozenRate &&
                  item.responseData.orderWeightDetails
                ) {
                  this.commonFacade.updateABWeight(
                    item.responseData.orderWeightDetails
                  );
                }
                this.focFacade.deleteABFocSchemes({
                  txnType: this.transactionType,
                  subTxnType: this.subTransactionType,
                  id: this.transactionId
                });
              }
            }
          }
        }
      );

    this.productFacade
      .getItemDetails()
      .pipe(
        withLatestFrom(this.productFacade.getSpecificItemId()),
        takeUntil(this.destroy$)
      )
      .subscribe(([item, itemId]) => {
        console.log('item test', item, itemId);
        let specificItem = [];
        this.selectedItemsDetails = item;
        if (this.selectedItemsDetails.length > 0) {
          if (this.transactionType === TransactionTypeEnum.CM)
            this.loadFocSchemes(false);
          else if (this.transactionType === TransactionTypeEnum.AB)
            this.addABFocScheme(false);
        } else this.focFacade.clearFocSchemesForItems();
        this.itemDetails = item;

        if (this.isAddItem) {
          this.rowId = this.itemDetails.length;
        }

        this.getTotalProductValues(item, null, itemId.id);
        if (this.itemDetails.length !== 0) {
          specificItem = item.filter(x => x?.itemDetails?.itemId === itemId.id);
          for (const element of this.itemDetails) {
            if (element.itemDetails.employeeCode === null) {
              this.isRsoSelected = false;
              this.discountFacade.setIsRsoSelected(this.isRsoSelected);
              break;
            } else {
              this.isRsoSelected = true;
            }
            this.discountFacade.setIsRsoSelected(this.isRsoSelected);
          }
        } else {
          this.isRsoSelected = true;
          this.discountFacade.setIsRsoSelected(this.isRsoSelected);
        }

        if (this.itemDetails.length !== 0) {
          this.outOfStockArray = [];
          this.itemDetails.forEach(element => {
            if (element.itemDetails?.itemInStock === false) {
              this.outOfStockArray.push(element.itemDetails);
            }
          });
          if (
            this.noOfProducts === this.itemDetails.length &&
            this.outOfStockArray.length !== 0 &&
            this.enableProductGridUpdate &&
            !this.isErrorinPriceUpdate
          ) {
            this.openOutOfStockPopup(this.outOfStockArray);
          }
        }

        if (item.length !== 0) {
          this.metalRate = item[0].metalRateList;
          // todo: to be set in state and used after other charge implementation
          this.otherChargesList = item[0].otherChargesList;
          this.productFacade.setMetalRate(this.metalRate);

          if (this.isDeleteFlag === false) {
            if (
              this.isErrorinPriceUpdate ||
              specificItem[0]?.itemDetails?.itemInStock ||
              !this.enableProductGridUpdate
            ) {
              this.sendProductToGrid(
                specificItem[0],
                itemId.isAdd,
                itemId.loadAutoDiscounts,
                itemId.hasError
              );
            }

            if (specificItem[0]?.txnType === TransactionTypeEnum.AB) {
              this.commonFacade.setABMinABVAlue(specificItem[0].minValue);
              this.commonFacade.setminFrozenABVAlue(
                specificItem[0].isFrozenAmount
              );

              if (
                specificItem[0]?.isFrozenRate &&
                specificItem[0]?.orderWeightDetails
              ) {
                this.commonFacade.updateABWeight(
                  specificItem[0]?.orderWeightDetails
                );
              }
            }
          }
        }
        // }
      });

    this.productFacade
      .getCoinDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe((coin: { itemCode: string; coinDetails: CoinDetails[] }) => {
        if (coin && coin.coinDetails.length !== 0) {
          if (coin.itemCode === null) {
            this.coinDetails = coin.coinDetails;
            this.addCoinPopup();
            this.addStopTracking(
              'pw.instrumentationMessges.loadCoinDetailsMsg'
            );
          } else {
            let coinFlag = true;
            let coinDetail: CoinDetails;
            coin.coinDetails.forEach(element => {
              if (this.validateCoin(element.itemCode, element.unitWeight)) {
                if (coinFlag === true) {
                  coinDetail = element;
                  coinFlag = false;
                }
              }
            });

            if (coinFlag === true) {
              this.errorData$.next(true);
            } else {
              this.errorData$.next(false);
              this.productFacade.loadPriceDetails({
                orderPriceRequest: {
                  checkInventory: true,
                  itemCode: coinDetail.itemCode,
                  standardPrice: this.standardPrice,
                  // measuredQuantity: coinDetail.totalQuantity,
                  // measuredWeight: coinDetail.unitWeight * coinDetail.totalQuantity
                  measuredQuantity: 1,
                  measuredWeight: coinDetail.unitWeight
                },
                productDetails: coinDetail
              });
              if (this.taxTransactionType && coinDetail?.itemCode) {
                this.productFacade.loadTaxDetails({
                  customerId: this.customerId,
                  isIGST: this.isIGST,
                  itemCode: coinDetail.itemCode,
                  txnType: this.taxTransactionType
                });
              }
            }
          }
        }
      });

    this.productFacade
      .getStandardPrice()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: {}) => {
        if (data) {
          this.standardPrice = data;
        }
      });

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.GLOBAL,
        CommomStateAttributeNameEnum.TRANSACTION_ID
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(transactionID => {
        if (transactionID) {
          this.clearPage(false);
          this.cashMemoId = transactionID;
          this.productFacade.loadRSODetails(RSOCode);
          this.productFacade.loadReasons(LovMasterEnum.WEIGHT_EDIT_REASON_TYPE);
          if (this.isAddFlag === true) {
            if (this.productType === ProductTypesEnum.COINS) {
              this.addCoinToCashMemo(this.coinData);
            } else {
              this.addItemToCashMemo(this.priceDetails, this.taxDetails);
            }
            this.isAddFlag = false;
          }
        } else {
          this.cashMemoId = null;
          this.paymentFacade.clearPaymentDetails();
        }
      });

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.GLOBAL,
        CommomStateAttributeNameEnum.TRANSACTION_CONFIG
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(transactionConfig => {
        if (transactionConfig) {
          this.transactionType = transactionConfig.transactionType?.type;
          this.subTransactionType = transactionConfig.transactionType?.subType;
          this.taxTransactionType = transactionConfig?.taxTransactionType;
          if (this.transactionType === TransactionTypeEnum.CM) {
            this.focFacade.loadAvailableSchemes();
            this.commonFacade.loadCMPgDesc();
          } else if (this.transactionType === TransactionTypeEnum.AB) {
            this.focFacade.loadAvailableSchemes();
            this.commonFacade.loadABPgDesc();
          }
        }
      });

    this.commonFacade
      .getCommonFacadeAttributes(
        this.transactionType === TransactionTypeEnum.AB
          ? CommomStateAttributeTypeEnum.ADVANCE_BOOKING
          : CommomStateAttributeTypeEnum.CASHMEMO,
        CommomStateAttributeNameEnum.GRF_TOLERANCE
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(tolerance => {
        if (tolerance) this.grfToleranceDetails = tolerance;
      });

    this.commonFacade
      .getCommonFacadeAttributes(
        this.transactionType === TransactionTypeEnum.AB
          ? CommomStateAttributeTypeEnum.ADVANCE_BOOKING
          : CommomStateAttributeTypeEnum.CASHMEMO,
        CommomStateAttributeNameEnum.GRN_TOLERANCE
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(tolerance => {
        if (tolerance) this.grnToleranceDetails = tolerance;
      });

    this.pgDesc$ = this.commonFacade.getCommonFacadeAttributes(
      this.transactionType === TransactionTypeEnum.AB
        ? CommomStateAttributeTypeEnum.ADVANCE_BOOKING
        : CommomStateAttributeTypeEnum.CASHMEMO,
      CommomStateAttributeNameEnum.PRODUCT_GROUP_DESC
    );

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.GLOBAL,
        CommomStateAttributeNameEnum.TRANSACTION_ID
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(transactionId => {
        this.transactionId = transactionId;
      });

    this.productFacade
      .getItemIDList()
      .pipe(takeUntil(this.destroy$))
      .subscribe((itemIDInfo: any) => {
        console.log('itemIDInfo', itemIDInfo);
        if (itemIDInfo !== null) {
          this.noOfProducts = itemIDInfo?.item?.itemIdList.length;
          itemIDInfo?.item?.itemIdList?.forEach(element => {
            this.isDeleteFlag = false;
            this.productFacade.getItemFromCashMemo({
              id: this.cashMemoId,
              itemId: element,
              headerData: itemIDInfo?.item,
              txnType: this.transactionType,
              subTxnType: this.subTransactionType,
              loadHeaderInfo: itemIDInfo.isGetHeaderDetails ? true : false,
              isAddItem: !itemIDInfo?.isUpdate,
              loadAutoDiscounts: itemIDInfo?.loadAutoDiscounts
            });
          });
        }
      });

    this.coinPriceDetails$ = this.productFacade.getPriceDetails();
    this.coinTaxDetails$ = this.productFacade.getTaxDetails();
    this.coinGoldRate$ = this.toolbarFacade.getMetalPriceDetails();
    this.validCoinDetails$ = this.productFacade.getValidCoinDetails();

    combineLatest([
      this.productFacade.getPriceDetails().pipe(takeUntil(this.destroy$)),
      this.productFacade.getTaxDetails().pipe(takeUntil(this.destroy$))
    ]).subscribe(([priceDetails, taxDetails]) => {
      if (priceDetails && taxDetails) {
        if (this.isUpdateFlag && this.isQuantityUpdate) {
          this.isQuantityUpdate = false;
          this.updateQuantityValue(this.editedItem, priceDetails, taxDetails);
        } else if (this.isUpdateFlag === false && this.addCoinFromSearch) {
          this.addCoinFromSearch = false;
          if (this.cashMemoId !== null) {
            this.addItemToCashMemo(priceDetails, taxDetails);
          } else {
            this.isAddFlag = true;
            this.priceDetails = priceDetails;
            this.taxDetails = taxDetails;
            this.productFacade.setCreateOrder(true);
          }
        }
      }
    });

    this.commonFacade
      .getCommonFacadeAttributes(
        this.transactionType === TransactionTypeEnum.AB
          ? CommomStateAttributeTypeEnum.ADVANCE_BOOKING
          : CommomStateAttributeTypeEnum.CASHMEMO,
        CommomStateAttributeNameEnum.IMAGE_URL_DATA
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        if (data !== null) {
          this.imageUrlData$.next(data);
        }
      });

    this.isCommonLoading$ = this.commonFacade.getCommonFacadeAttributes(
      TransactionTypeEnum.AB
        ? CommomStateAttributeTypeEnum.ADVANCE_BOOKING
        : CommomStateAttributeTypeEnum.CASHMEMO,
      CommomStateAttributeNameEnum.LOADING
    );

    combineLatest([
      this.paymentFacade
        .getHasCustomerSpecificPayments()
        .pipe(takeUntil(this.destroy$)),
      this.discountFacade
        .getAppliedSystemDvDiscounts()
        .pipe(takeUntil(this.destroy$)),
      this.discountFacade
        .getAppliedBillLevelTransactionLevelDiscounts()
        .pipe(takeUntil(this.destroy$)),
      this.discountFacade
        .getAppliedSystemGhsDiscounts()
        .pipe(takeUntil(this.destroy$)),
      this.focFacade.getIsFocAdded().pipe(takeUntil(this.destroy$)),
      this.focFacade.getIsManualFocAdded().pipe(takeUntil(this.destroy$)),
      this.commonFacade
        .getCommonFacadeAttributes(
          CommomStateAttributeTypeEnum.CASHMEMO,
          CommomStateAttributeNameEnum.ERROR_IN_PRICE_UPDATE
        )
        .pipe(takeUntil(this.destroy$)),
      this.focFacade.getIsFocKeptPending().pipe(takeUntil(this.destroy$))
    ]).subscribe(
      ([
        isAdded,
        systemDvDiscounts,
        billLevleDiscounts,
        systemGhsBonusDiscounts,
        isFocAdded,
        isManualFocAdded,
        isErrorinPriceUpdate,
        isFocKeptPending
      ]) => {
        if (
          isAdded ||
          systemDvDiscounts.length > 0 ||
          billLevleDiscounts.length > 0 ||
          systemGhsBonusDiscounts.length > 0 ||
          isFocAdded ||
          isManualFocAdded ||
          isErrorinPriceUpdate ||
          isFocKeptPending
        )
          this.enableProductGridUpdate = false;
        else this.enableProductGridUpdate = true;
      }
    );

    this.paymentFacade
      .getHasCustomerSpecificPayments()
      .pipe(takeUntil(this.destroy$))
      .subscribe(isAdded => {
        if (
          this.outOfStockArray.length !== 0 &&
          !this.isErrorinPriceUpdate &&
          this.enableProductGridUpdate
        )
          this.isErrorinPriceUpdate = true;
      });

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.CASHMEMO,
        CommomStateAttributeNameEnum.ERROR_IN_PRICE_UPDATE
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((isError: boolean) => {
        this.isErrorinPriceUpdate = isError;
      });

    this.productFacade
      .getSelectedItemDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: CashMemoItemDetailsResponse) => {
        if (data) {
          this.selectedOutOfStockItems.push(data.itemDetails);
          if (this.outOfStockItemsCount === this.selectedOutOfStockItems.length)
            this.openOutOfStockPopup(this.selectedOutOfStockItems);
        }
      });

    this.locationSettingsFacade
      .getLocationSetting(
        LocationSettingAttributesEnum.CM_IS_EDIT_WEIGHT_ALLOWED
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(isEditWeightAllowed => {
        this.isWeightEditConfig = Boolean(isEditWeightAllowed);
      });
    // GRF
    this.locationSettingsFacade
      .getLocationSetting(LocationSettingAttributesEnum.GRF_MINIMUM_UTILIZATION)
      .pipe(takeUntil(this.destroy$))
      .subscribe(minimumGRFUtilization => {
        this.minimumGRFUtilization = Number(minimumGRFUtilization);
      });
    this.locationSettingsFacade
      .getLocationSetting(
        LocationSettingAttributesEnum.GRF_IS_GRF_ALLOWED_IN_CM
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(isGRFAllowedCM => {
        this.isGRFAllowedCM = isGRFAllowedCM === 'true' ? true : false;
      });
    this.locationSettingsFacade
      .getLocationSetting(
        LocationSettingAttributesEnum.GRF_IS_GRF_ALLOWED_IN_AB
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(isGRFAllowedAB => {
        this.isGRFAllowedAB = isGRFAllowedAB === 'true' ? true : false;
      });

    // GRN
    this.locationSettingsFacade
      .getLocationSetting(
        LocationSettingAttributesEnum.GRN_MIN_UTILIZATION_PERCENT_FOR_GRN
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(minimumGRNUtilization => {
        this.minimumGRNUtilization = Number(minimumGRNUtilization);
      });
    this.locationSettingsFacade
      .getLocationSetting(
        LocationSettingAttributesEnum.GRN_IS_GRN_ALLOWED_IN_CM
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(isGRNAllowedCM => {
        this.isGRNAllowedCM = isGRNAllowedCM === 'true' ? true : false;
      });
    this.locationSettingsFacade
      .getLocationSetting(
        LocationSettingAttributesEnum.GRN_IS_GRN_ALLOWED_IN_AB
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(isGrnAllowedInAdvanceBooking => {
        this.isGrnAllowedInAdvanceBooking =
          isGrnAllowedInAdvanceBooking === 'true' ? true : false;
      });
    this.commonFacade
      .getCommonFacadeAttributes(
        this.transactionType === TransactionTypeEnum.AB
          ? CommomStateAttributeTypeEnum.ADVANCE_BOOKING
          : CommomStateAttributeTypeEnum.CASHMEMO,
        CommomStateAttributeNameEnum.PRODUCT_GROUP_DESC
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(pgDesc => {
        if (pgDesc !== null) {
          this.pgDescription = pgDesc;
        }
      });

    this.productFacade
      .getReasons()
      .pipe(takeUntil(this.destroy$))
      .subscribe((reasons: string[]) => {
        if (reasons.length !== 0) this.reasons = reasons;
        console.log('reasons:', reasons);
      });

    this.searchProductList$
      .pipe(takeUntil(this.destroy$))
      .subscribe(searchProductList => {
        if (searchProductList.length !== 0)
          this.addStopTracking(
            'pw.instrumentationMessges.suggestiveItemCodeSearchMsg'
          );
      });

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.CASHMEMO,
        CommomStateAttributeNameEnum.AB_DETAILS
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: AdvanceBookingDetailsResponse) => {
        this.abDetails = data;
        if (data !== null) this.abItemIdList = data.itemIdList;
        else this.abItemIdList = [];
      });

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.ADVANCE_BOOKING,
        CommomStateAttributeNameEnum.FROZEN_AB_VALUE
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: boolean) => {
        this.frozenAB = data;
      });

    this.focFacade
      .getAvailableSchemes()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: AvailableSchemesPayload[]) => {
        this.activeFocSchemes = data;
      });

    this.focFacade
      .getFocSchemes()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data && data.length > 0) {
          if (this.keepFocPendingTrigger) {
            this.focFacade.keepFocPending(this.keepFocPending());
            this.focFacade.setKeepFocTrigger(false);
          } else {
            this.focSchemesAndItems = data;
            this.loadFocItemDetails();
          }
        } else if (data && data.length === 0) {
          this.focPopupData$.next([]);
        }
      });

    this.focFacade
      .getManualFocItems()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data && data.length > 0) {
          this.manualFocSchemesAndItems = data;
        } else {
          this.manualFocSchemesAndItems = [];
        }
      });

    this.focFacade
      .getFocItemDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.focItemDetails = data;
          this.loadFocPopupData();
        }
      });

    this.focFacade
      .getManualFocItemDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.manualFocItemDetails = data;
          this.loadManualFocPopupData();
        }
      });

    this.focFacade
      .getFocListAddedToCM()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.commonFacade.setFocItems(data);
        this.focItemsInGrid = data;
        if (data && data.length > 0) {
          this.focItemsInGrid = data;
          this.sendFocProductToGrid(this.focItemsInGrid);
        } else {
          this.removeAllFocItems$.next(false);
        }
      });
    this.focFacade
      .getManualFocListAddedToCM()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data && data.length > 0) {
          this.commonFacade.setManualFocItems(data);
          this.focItemsInGrid = data;
          this.sendFocProductToGrid(this.focItemsInGrid);
        } else {
          this.removeAllFocItems$.next(true);
        }
      });
    this.focFacade
      .getPendingFocSchemeIds()
      .pipe(takeUntil(this.destroy$))
      .subscribe((ids: string[]) => {
        if (ids && ids.length > 0) {
          this.showPendingFocSuccessMessageNotification();
        }
      });
    this.focFacade
      .getIsFocAdded()
      .pipe(takeUntil(this.destroy$))
      .subscribe(isAdded => {
        this.isFocAdded = isAdded;
      });

    this.focFacade
      .getIsManualFocAdded()
      .pipe(takeUntil(this.destroy$))
      .subscribe(isAdded => {
        this.isManualFocAdded = isAdded;
      });
    // TODO
    this.focFacade
      .getIsFocKeptPending()
      .pipe(takeUntil(this.destroy$))
      .subscribe(isAdded => {
        this.isFocKeptPending = isAdded;
      });

    combineLatest([
      this.discountFacade
        .getAppliedSystemDvDiscounts()
        .pipe(takeUntil(this.destroy$)),
      this.discountFacade
        .getAppliedBillLevelTransactionLevelDiscounts()
        .pipe(takeUntil(this.destroy$)),
      this.discountFacade
        .getAppliedSystemGhsDiscounts()
        .pipe(takeUntil(this.destroy$))
    ]).subscribe(
      ([systemDvDiscounts, billLevleDiscounts, systemGhsBonusDiscounts]) => {
        this.isSystemDDvDiscountsAdded =
          systemDvDiscounts.length > 0 ? true : false;
        this.isSystemGhsBonusDiscountAdded =
          systemGhsBonusDiscounts.length > 0 ? true : false;
        this.isBillLevelDiscountsAdded =
          billLevleDiscounts.length > 0 ? true : false;
      }
    );
    this.focFacade
      .getKeepFocPendingTrigger()
      .pipe(takeUntil(this.destroy$))
      .subscribe(trigger => {
        this.keepFocPendingTrigger = trigger;
        if (this.keepFocPendingTrigger) {
          this.loadFocSchemes(true);
        }
      });
    this.focPopupData$
      .asObservable()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.showFocPopup(data);
      });

    // AB FOC

    combineLatest([
      this.focFacade.getABFocSchemes().pipe(takeUntil(this.destroy$)),
      this.focFacade.getSelectedABFocSchemes().pipe(takeUntil(this.destroy$))
    ]).subscribe(([FOCSchemes, selectedFOCSchemes]) => {
      if (FOCSchemes || selectedFOCSchemes) {
        console.log('AB FOC Schemes', FOCSchemes, selectedFOCSchemes);
        if (FOCSchemes !== null && selectedFOCSchemes !== null) {
          if (FOCSchemes.length === 0)
            this.showNotifications('pw.foc.noFocSchemesAvailableMsg');
          else this.ABFOCPopup(FOCSchemes, selectedFOCSchemes);
        }
      }
    });

    this.focFacade
      .getSavedABFocSchemes()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.showTimerNotifications('pw.productGrid.saveFOCSuccessMsg');
          this.addABFocScheme(false);
        }
      });

    this.focFacade
      .getDeletedABFocSchemes()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.showTimerNotifications('pw.productGrid.saveFOCSuccessMsg');
          this.addABFocScheme(false);
        }
      });

    //TODO add loader for FOC Active schemes and errorHandler(expect no config error)

    this.bodEodFeatureService
      .getBusinessDayDate()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.bussinessDay = data;
      });

    this.manualFocPopupData$
      .asObservable()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.showManualFocPopup(data);
      });

    this.discountFacade
      .getLoadAutoDiscountsRes()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (discounts: {
          response: {
            discountConfigDetails: DiscountConfigDetailsResponse[];
            clubbingId: string;
            cummulativeDiscountWithExcludeDetails: any;
          };
          data: CashMemoItemDetailsResponse;
        }) => {
          this.cummulativeDiscountWithExcludeDetails =
            discounts?.response?.cummulativeDiscountWithExcludeDetails;
          console.log(discounts, 'auto discounts');
          if (
            discounts.response &&
            discounts.response !== null &&
            (this.isAddItem ||
              this.isAddAllItem ||
              this.isUpdateSingleAutoDiscount)
          ) {
            const tempArray = [];
            discounts.response.discountConfigDetails.forEach(element => {
              tempArray.push({
                clubbedDiscountId: discounts.response.clubbingId
                  ? discounts.response.clubbingId
                  : null,
                cummulativeDiscountWithExcludeDetails: this
                  .cummulativeDiscountWithExcludeDetails,
                discountCode: element.discountConfigDetails.discountCode,
                discountId: element.discountConfigDetails.discountId,
                discountType: element.discountConfigDetails.discountType,
                discountValue: element.discountValue,
                discountValueDetails: {
                  data: {
                    discountValueDetails: element.discountValueDetails
                  },
                  type: DiscountPopupEnum.DISCOUNT_VALUE_DETAILS
                },
                isEdited: false,
                referenceId: null,
                referenceType: null,
                rivaahGhsDiscountDetails: element.rivaahGhsDetails
                // refPaymentId: element?.rivaahGhsDetails?.refPaymentId
                //   ? element?.rivaahGhsDetails?.refPaymentId
                //   : null
              });
            });
            this.selectedAutoDiscounts = tempArray;

            const payload = {
              txnType: this.transactionType,
              subTxnType: this.subTransactionType,
              transactionId: this.transactionId,
              itemId: discounts.data.itemDetails.itemId,
              requestBody: tempArray
            };

            if (
              discounts.data?.discountDetails &&
              discounts.data?.discountDetails?.length !== 0
            ) {
              this.discountFacade.loadDeleteItemLevelDiscounts({
                request: {
                  txnType: this.transactionType,
                  subTxnType: this.subTransactionType,
                  transactionId: this.transactionId,
                  itemId: discounts.data.itemDetails.itemId,
                  requestBody: tempArray
                },
                data: discounts.data
              });
            } else {
              if (this.updateEncircleOrNot(tempArray)) {
                this.discountFacade.loadSaveItemLevelDiscounts({
                  request: payload,
                  data: discounts.data
                });
              }
            }
          } else console.log(discounts, 'no auto discounts');
        }
      );

    this.discountFacade
      .deleteItemLevelDiscountsRes()
      .pipe(takeUntil(this.destroy$))
      .subscribe((discounts: { response: boolean; data: any }) => {
        console.log(
          '  CashMemo: deleted discounts:',
          discounts,
          this.isAddItem,
          this.isAddAllItem,
          this.isUpdateItem
        );
        if (
          discounts.response &&
          (this.isAddItem ||
            this.isAddAllItem ||
            this.isUpdateSingleAutoDiscount ||
            this.isUpdateItem)
        ) {
          const savePayload = {
            txnType: this.transactionType,
            subTxnType: this.subTransactionType,
            transactionId: this.transactionId,
            itemId: discounts.data.itemData.itemDetails.itemId,
            requestBody: discounts.data.discountData
          };
          if (this.updateEncircleOrNot(discounts?.data?.discountData)) {
            this.discountFacade.loadSaveItemLevelDiscounts({
              request: savePayload,
              data: discounts.data.itemData
            });
          } else {
            this.productFacade.getItemFromCashMemo({
              id: this.cashMemoId,
              itemId: discounts.data.itemData.itemDetails.itemId,
              headerData: discounts.data.itemData,
              txnType: this.transactionType,
              subTxnType: this.subTransactionType,
              loadHeaderInfo: true,
              isAddItem: false
            });
          }
        }
      });

    this.discountFacade
      .getItemLevelDiscountsDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (discounts: {
          discountConfigDetails: DiscountConfigDetailsResponse[];
          clubbingId: string;
          data: CashMemoItemDetailsResponse;
        }) => {
          console.log(
            'CashMemo: discounts details:',
            discounts,
            this.isUpdateItem
          );
          if (discounts && discounts !== null && this.isUpdateItem) {
            const tempArray = [];
            this.existingDiscounts = [];

            discounts.discountConfigDetails.forEach(element => {
              this.existingDiscounts.push(element);
              tempArray.push({
                clubbedDiscountId: discounts.clubbingId
                  ? discounts.clubbingId
                  : null,
                discountCode: element.discountConfigDetails.discountCode,
                discountId: element.discountConfigDetails.discountId,
                discountType: element.discountConfigDetails.discountType,
                discountValue: element.discountValue,
                discountValueDetails: {
                  data: {
                    discountValueDetails: element.discountValueDetails
                  },
                  type: DiscountPopupEnum.DISCOUNT_VALUE_DETAILS
                },
                isEdited: false,
                referenceId: null,
                referenceType: null,
                rivaahGhsDiscountDetails: element.rivaahGhsDetails
                // refPaymentId: element?.rivaahGhsDetails?.refPaymentId
                //   ? element?.rivaahGhsDetails?.refPaymentId
                //   : null
              });
            });

            const payload = {
              txnType: this.transactionType,
              subTxnType: this.subTransactionType,
              transactionId: this.transactionId,
              itemId: this.itemId,
              requestBody: tempArray
            };

            if (
              discounts.data?.discountDetails &&
              discounts.data?.discountDetails?.length !== 0
            ) {
              this.discountFacade.loadDeleteItemLevelDiscounts({
                request: {
                  txnType: this.transactionType,
                  subTxnType: this.subTransactionType,
                  transactionId: this.transactionId,
                  itemId: this.itemId,
                  requestBody: tempArray
                },
                data: discounts.data
              });
            } else {
              if (this.updateEncircleOrNot(tempArray)) {
                this.discountFacade.loadSaveItemLevelDiscounts({
                  request: payload,
                  data: discounts.data
                });
              }
            }
          }
        }
      );

    this.discountFacade
      .saveItemLevelDiscountsRes()
      .pipe(takeUntil(this.destroy$))
      .subscribe((discounts: { response: DiscountsResponse[]; data: any }) => {
        console.log('CashMemo: saved discounts:', discounts);
        if (
          discounts.response.length !== 0 &&
          (this.isAddItem ||
            this.isAddAllItem ||
            this.isUpdateSingleAutoDiscount ||
            this.isUpdateItem)
        ) {
          if (
            discounts.response.filter(
              discount =>
                discount.discountType === DiscountTypeEnum.ULP_ANNIVERSARY ||
                discount.discountType === DiscountTypeEnum.ULP_BIRTHDAY ||
                discount.discountType === DiscountTypeEnum.ULP_SPOUSE_BIRTHDAY
            ).length > 0
          ) {
            this.discountFacade.loadAppliedTransactionLevelDiscounts({
              transactionId: this.cashMemoId,
              txnType: this.transactionType,
              subTxnType: this.subTransactionType
            });
          }

          this.tempRowNumber++;

          if (
            this.productType === ProductTypesEnum.COINS &&
            this.addMultipleCoinsCount !== 0
          ) {
            if (this.addMultipleCoinsCount - 1 === this.tempRowNumber)
              this.isAddItem = false;
          } else {
            this.isAddItem = false;
            this.isUpdateSingleAutoDiscount = false;
            this.isUpdateItem = false;
          }

          if (
            discounts.response.filter(
              discount =>
                discount.discountType ===
                  DiscountTypeEnum.SLAB_BASED_DISCOUNT ||
                discount.discountType ===
                  DiscountTypeEnum.HIGH_VALUE_DISCOUNT ||
                discount.discountType === DiscountTypeEnum.BEST_DEAL_DISCOUNT
            ).length > 0
          ) {
            this.discountFacade.loadReloadDiscountsGrid(true);
          } else {
            this.productFacade.getItemFromCashMemo({
              id: this.cashMemoId,
              itemId: discounts.response[0].itemId,
              headerData: discounts.data,
              txnType: this.transactionType,
              subTxnType: this.subTransactionType,
              loadHeaderInfo: true,
              isAddItem: false
            });
            this.addStopTracking(
              'pw.instrumentationMessges.addItemAutoDiscMsg'
            );
            this.addStopTracking('pw.instrumentationMessges.productSearchMsg');
          }

          if (this.tempRowNumber === this.noOfProducts - 1) {
            this.isAddAllItem = false;
            this.tempRowNumber = -1;
          }
        }
      });

    this.customerFacade
      .getSelectSelectedCustomer()
      .pipe(takeUntil(this.destroy$))
      .subscribe(customer => {
        if (customer) {
          this.customerDetails = customer;
          this.customerId = customer.customerId;
          this.customerMobileNumber = customer.mobileNumber;
          if (this.customerMobileNumber) {
            this.loadManualFoc();
          }
          if (
            this.customerDetails !== null &&
            this.customerDetails.customerType !== CUSTOMER_TYPE_ENUM.REGULAR &&
            this.customerDetails.customerType !== CUSTOMER_TYPE_ENUM.ONE_TIME
          ) {
            this.isIGSTApplied = false;
          } else {
            this.isIGSTApplied = true;
          }
        } else {
          this.customerDetails = null;
          this.customerId = null;
          this.customerMobileNumber = null;
        }
      });

    this.customerFacade
      .getSelectedCustomerDetail()
      .pipe(takeUntil(this.destroy$))
      .subscribe((customer: CreatedCustomerResponse) => {
        if (customer) {
          const tempCustomerId = this.customerId;
          this.customerDetails = customer;
          this.customerId = customer.customerId;
          this.customerMobileNumber = customer.mobileNumber;
          if (this.customerMobileNumber) {
            this.loadManualFoc();
          }
          this.ulpID = customer.ulpId;
          this.enrolmentDate = customer.enrollmentDate;

          if (
            tempCustomerId !== this.customerId &&
            customer.isCalledFromCustomer !== true
          ) {
            const tempItemDetails = this.itemDetails;
            this.isAddAllItem = true;
            tempItemDetails.forEach(data => {
              this.getAutoDiscounts(data);
            });
          }
        } else {
          this.customerDetails = null;
          this.customerId = null;
          this.customerMobileNumber = null;
        }
      });

    this.discountFacade
      .updateItemLevelDiscountsRes()
      .pipe(takeUntil(this.destroy$))
      .subscribe((discounts: DiscountsResponse[]) => {
        console.log('CashMemo: update discounts:', discounts);
        if (
          discounts.length !== 0 &&
          discounts.length === this.existingDiscounts.length &&
          this.isUpdateItem
        ) {
          this.isUpdateItem = false;
          this.productFacade.getItemFromCashMemo({
            id: this.cashMemoId,
            itemId: this.itemId,
            headerData: this.headerDetails,
            txnType: this.transactionType,
            subTxnType: this.subTransactionType,
            loadHeaderInfo: true,
            isAddItem: false
          });
          this.discountFacade.clearUpdateItemLevelDiscountDetails();
        }
      });
  }

  getDiscountReponse() {
    this.productFacade
      .getIsABInvokedFirstTime()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        isABInvokedFirstTime =>
          (this.isABInvokedFirstTime = isABInvokedFirstTime)
      );

    this.discountFacade
      .getIsEncircleDiscDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe(addedEncircle => {
        if (addedEncircle) {
          this.addedEncircle = {
            discountType: addedEncircle
          };
        } else {
          this.addedEncircle = addedEncircle === undefined ? undefined : null;
        }
        if (this.addedEncircle !== null) this.encircleAlert(this.addedEncircle);
      });

    this.productFacade
      .getIsABDiscountsSelected()
      .pipe(takeUntil(this.destroy$))
      .subscribe(isABDiscountsSelected => {
        this.isABDiscountsSelected =
          isABDiscountsSelected.filter(value => !!value).length > 0;
      });
  }

  errorHandler(error: CustomErrors) {
    if (error.code === ErrorEnums.ERR_INV_014) {
      const key = 'pw.productGrid.itemsNotAvailableMsg';
      this.errorNotifications(key, error.traceId);
    } else if (error.code === ErrorEnums.ERR_SALE_215) {
      error = {
        ...error,
        dynamicValues: {
          metalType: this.getMetalName(error?.dynamicValues?.metalType)
        }
      };
      this.overlayNotification
        .show({
          type: OverlayNotificationType.ERROR,
          hasClose: true, // optional
          error: error
        })
        .events.pipe(takeUntil(this.destroy$))
        .subscribe();
    } else if (
      error.code === ErrorEnums.ERR_SALE_255 ||
      error.code === ErrorEnums.ERR_SALE_256 ||
      error.code === ErrorEnums.ERR_SALE_257
    ) {
      this.abDetailsPendingItemsCount = error?.errorCause.length;
      error?.errorCause.forEach(element => {
        this.productFacade.loadAbItemDetails({
          id: this.abDetails.id,
          itemId: element,
          headerData: this.abDetails,
          txnType: TransactionTypeEnum.AB,
          subTxnType: SubTransactionTypeEnum.NEW_AB
        });
      });
      this.openPendingAbItemsPopup();
    } else if (error.code === ErrorEnums.ERR_SALE_103) {
      this.outOfStockItemsCount = error?.errorCause.length;
      error?.errorCause.forEach(element => {
        this.productFacade.resetItemIdValues();
        this.productFacade.loadItemDetails(element);
      });
    } else {
      this.overlayNotification
        .show({
          type: OverlayNotificationType.ERROR,
          hasClose: true, // optional
          error: error
        })
        .events.pipe(takeUntil(this.destroy$))
        .subscribe();
    }
    if (this.isLotNumberUpdate) this.resetLotNumber();
  }

  // search

  searchByItemcode(event: SearchEmitEvent) {
    const tcsPayment = this.paymentDetails.find(
      value => value.isTcsPayment === true
    );
    if (
      this.transactionType === TransactionTypeEnum.CM &&
      this.tcsToBeCollectedAtCM !== 0 &&
      tcsPayment
    ) {
      this.deleteTcsAmountPopup();
    } else if (
      this.transactionType === TransactionTypeEnum.CM &&
      this.tcsToBeCollectedAtCM !== 0 &&
      !tcsPayment
    ) {
      this.resetTcsAmountPopup();
    } else {
      if (
        this.enableProductGridUpdate &&
        this.isRsoSelected &&
        !this.isErrorinPriceUpdate &&
        this.totalNoOfItemsInProductGrid < this.maxNoOfItemsInProductGrid
      ) {
        this.productFacade.clearProductRelatedDetails();
        this.isUpdateFlag = false;
        if (event.lotNumber !== null) {
          this.addStartTracking(
            'pw.instrumentationMessges.scanningItemCodeMsg'
          );
          this.productFacade.loadProductDetails({
            itemCode: event.searchValue,
            lotNumber: event.lotNumber
          });
        } else {
          if (event.isValid) {
            this.addStartTracking(
              'pw.instrumentationMessges.suggestiveItemCodeSearchMsg'
            );
            this.productFacade.loadSearchProduct({
              searchValue: event.searchValue
            });
          } else {
            this.productFacade.clearSearchProductList();
          }
        }
      } else {
        if (this.isRsoSelected === false) {
          this.showNotifications('pw.productGrid.rsoNotSelectedMsg');
        } else if (this.isErrorinPriceUpdate) {
          this.showNotifications('pw.productGrid.refreshGridMsg');
        } else if (
          this.totalNoOfItemsInProductGrid >= this.maxNoOfItemsInProductGrid
        ) {
          this.showNotifications(
            this.productGridLimitMsg + this.maxNoOfItemsInProductGrid
          );
        } else {
          this.showUpdateError();
        }
      }
    }
  }

  selectedItemcode(event: SearchProductList) {
    this.addStartTracking('pw.instrumentationMessges.productSearchMsg');
    this.productFacade.clearProductRelatedDetails();
    this.isUpdateFlag = false;
    if (event.productGroupCode === this.coinCode) {
      this.addCoinFromSearch = true;
      this.productFacade.loadCoinDetails({
        itemCode: event.itemCode,
        withSaleableCheck: false
      });
    } else {
      this.addStartTracking('pw.instrumentationMessges.loadItemDetailsMsg');
      this.productFacade.loadProductDetails({
        itemCode: event.itemCode
      });
    }
  }

  exactSearchByItemcode(event: SearchEmitEvent) {
    const tcsPayment = this.paymentDetails.find(
      value => value.isTcsPayment === true
    );
    if (
      this.transactionType === TransactionTypeEnum.CM &&
      this.tcsToBeCollectedAtCM !== 0 &&
      tcsPayment
    ) {
      this.deleteTcsAmountPopup();
    } else if (
      this.transactionType === TransactionTypeEnum.CM &&
      this.tcsToBeCollectedAtCM !== 0 &&
      !tcsPayment
    ) {
      this.resetTcsAmountPopup();
    } else {
      if (
        this.enableProductGridUpdate &&
        this.isRsoSelected &&
        !this.isErrorinPriceUpdate &&
        this.totalNoOfItemsInProductGrid < this.maxNoOfItemsInProductGrid
      ) {
        this.productFacade.clearProductRelatedDetails();
        this.isUpdateFlag = false;
        if (event.isValid) {
          this.addStartTracking(
            'pw.instrumentationMessges.exactItemCodeSearchMsg'
          );
          this.productFacade.loadProductDetails({
            itemCode: event.searchValue
          });
        } else {
          this.productFacade.clearProductList();
        }
      } else {
        if (this.isRsoSelected === false) {
          this.showNotifications('pw.productGrid.rsoNotSelectedMsg');
        } else if (this.isErrorinPriceUpdate) {
          this.showNotifications('pw.productGrid.refreshGridMsg');
        } else if (
          this.totalNoOfItemsInProductGrid >= this.maxNoOfItemsInProductGrid
        ) {
          this.showNotifications(
            this.productGridLimitMsg + this.maxNoOfItemsInProductGrid
          );
        } else {
          this.showUpdateError();
        }
      }
    }
  }

  clearSearchField() {
    this.searchComponent?.clearSearch(null);
  }

  // update event

  updateSelectedLotNumber(event) {
    const eventData = event.data;
    this.productFacade.setItemDetailsOperation('LOT');
    this.addStartTracking(
      'pw.instrumentationMessges.updatingLotNumberDetailsMsg'
    );
    this.editedItem = eventData.data;
    this.editedItemEvent = eventData;
    this.isUpdateFlag = true;
    if (
      eventData.data.productType === ProductTypesEnum.REGULAR &&
      eventData.data.productGroup === this.silverCoinCode
    ) {
      //lot number update
      this.isLotNumberUpdate = true;
      this.productFacade.resetLotNumberValues();
      this.removeFromOrder = event.removeFromOrder;
      this.productFacade.loadLotNumber(eventData.data.selectedLotNumber);
      const index = this.regularItemArray.indexOf(eventData.oldValue);
      this.regularItemArray.splice(index, 1);
    } else if (
      eventData.data.productType === ProductTypesEnum.REGULAR &&
      eventData.data.productGroup !== this.silverCoinCode
    ) {
      this.isLotNumberUpdate = true;
      this.productFacade.resetLotNumberValues();
      this.removeFromOrder = event.removeFromOrder;
      this.productFacade.loadLotNumber(eventData.data.selectedLotNumber);
      const index = this.regularItemArray.indexOf(eventData.oldValue);
      this.regularItemArray.splice(index, 1);
    } else {
      if (
        eventData.data.productGroup !== this.silverCoinCode &&
        eventData.data.totalQuantity >= eventData.value.value &&
        eventData.value.value > 0
      ) {
        this.isQuantityUpdate = true;
        this.productFacade.loadPriceDetails({
          orderPriceRequest: {
            checkInventory: true,
            itemCode: eventData.data.itemCode,
            standardPrice: this.standardPrice,
            measuredQuantity: Number(eventData.value.value),
            measuredWeight: Number(
              eventData.value.value * eventData.data.unitWeight
            )
          },
          productDetails: eventData.data.productDetails
        });
        if (this.taxTransactionType && eventData?.data?.itemCode) {
          this.productFacade.loadTaxDetails({
            customerId: this.customerId,
            isIGST: this.isIGST,
            itemCode: eventData.data.itemCode,
            txnType: this.taxTransactionType
          });
        }
      } else {
        const errorKey = 'pw.productGrid.quantityErrorMsg';
        this.errorNotifications(errorKey);
      }
    }
  }

  updateActualWeight(event) {
    this.productFacade.setItemDetailsOperation('WEIGHT');
    this.addStartTracking('pw.instrumentationMessges.updatingActualWeightMsg');
    this.editedItem = event.item;
    this.editedWeightData = event.data;
    this.isUpdateFlag = true;
    this.isActualWeightUpdate = true;
    this.productFacade.resetLotNumberValues();
    this.productFacade.loadLotNumber(event.item.selectedLotNumber);
  }

  updateSelectedRso(event) {
    this.productFacade.setItemDetailsOperation('RSO');
    this.addStartTracking('pw.instrumentationMessges.updatingRsoNameMsg');
    this.isUpdateFlag = true;
    this.isDeleteFlag = false;
    this.productFacade.partialUpdateItemInCashMemo({
      id: this.cashMemoId,
      itemId: event.data.itemId,
      itemDetails: {
        employeeCode:
          event.data.selectedRso === null ||
          event.data.selectedRso === selectRSO
            ? ''
            : event.data.selectedRso
      },
      availableLotNumbers: event.data.availableLotNumbers,
      productDetails: event.data.productDetails,
      txnType: this.transactionType,
      subTxnType: this.subTransactionType,
      oldData: event.data.responseData,
      isIGST: this.isIGST
    });
  }

  //  add

  addItemToCashMemo(
    priceDetails: ProductPriceDetails,
    taxDetails: CashMemoTaxDetails
  ) {
    const totalItemValue =
      priceDetails.priceDetails.isUcp && !priceDetails.ignoreUcpRecalculate
        ? this.calculateTotalValueForUCP(taxDetails, priceDetails.finalValue)
        : this.currencyRoundOff(priceDetails.finalValue);
    const totalItemTax = this.calculateTax(
      taxDetails,
      totalItemValue,
      priceDetails.priceDetails.itemHallmarkDetails
    );
    const hallmarkingCharges = priceDetails?.priceDetails?.itemHallmarkDetails
      ?.hallmarkingCharges
      ? priceDetails?.priceDetails?.itemHallmarkDetails?.hallmarkingCharges
      : 0;
    const hallmarkingDiscount =
      priceDetails?.priceDetails?.itemHallmarkDetails
        ?.isFOCForHallmarkingCharges && hallmarkingCharges
        ? hallmarkingCharges
        : 0;
    this.addStartTracking('pw.instrumentationMessges.addItemToGridMsg');

    const itemToBeAdded: CashMemoItemDetailsRequest = {
      itemCode: priceDetails.productDetails.itemCode,
      lotNumber: priceDetails.productDetails.lotNumber,
      inventoryId: priceDetails.productDetails.inventoryId,
      // totalQuantity:
      //   priceDetails.productDetails.productGroupCode === this.coinCode
      //     ? priceDetails.productDetails.totalQuantity
      //     : 1,
      totalQuantity: 1,
      totalValue: this.currencyRoundOff(totalItemValue),
      // unitValue: this.currencyRoundOff(
      //   totalItemValue /
      //     (priceDetails.productDetails.productGroupCode === this.coinCode
      //       ? priceDetails.productDetails.totalQuantity
      //       : 1)
      // ),
      unitValue: this.currencyRoundOff(totalItemValue),
      // totalWeight: this.weightRoundOff(
      //   priceDetails.productDetails.unitWeight *
      //     (priceDetails.productDetails.productGroupCode === this.coinCode
      //       ? priceDetails.productDetails.totalQuantity
      //       : 1)
      // ),
      totalWeight: this.weightRoundOff(priceDetails.productDetails.unitWeight),
      inventoryWeight: priceDetails.productDetails.unitWeight,
      employeeCode: this.selectedEventRso,
      remarks: null,
      reason: null,
      totalDiscount: 0,
      totalTax: this.currencyRoundOff(totalItemTax),
      hallmarkCharges: hallmarkingCharges,
      hallmarkDiscount: hallmarkingDiscount,
      finalValue: this.currencyRoundOff(
        totalItemValue + totalItemTax + hallmarkingCharges - hallmarkingDiscount
      )
    };
    this.isDeleteFlag = false;
    this.isAddItem = true;
    if (priceDetails.productDetails.productGroupCode === this.coinCode) {
      if (
        this.validateCoin(
          priceDetails.productDetails.itemCode,
          priceDetails.productDetails.unitWeight
        )
      ) {
        this.productFacade.addItemToCashMemo({
          id: this.cashMemoId,
          itemDetails: itemToBeAdded,
          availableLotNumbers: priceDetails.availableLotNumbers,
          productDetails: priceDetails.productDetails,
          txnType: this.transactionType,
          subTxnType: this.subTransactionType,
          isIGST: this.isIGST
        });
      } else {
        this.errorData$.next(true);
      }
    } else {
      this.productFacade.addItemToCashMemo({
        id: this.cashMemoId,
        itemDetails: itemToBeAdded,
        availableLotNumbers: priceDetails.availableLotNumbers,
        productDetails: priceDetails.productDetails,
        txnType: this.transactionType,
        subTxnType: this.subTransactionType,
        isIGST: this.isIGST
      });
    }
    this.clearSearchField();
  }

  // delete

  deleteItemFromCashMemo(deleteEvent) {
    this.addStartTracking('pw.instrumentationMessges.deleteItemFromGridMsg');
    this.isDeleteFlag = true;
    this.isUpdateFlag = false;
    this.productFacade.deleteItemFromCashMemo({
      id: this.cashMemoId,
      itemId: deleteEvent?.removeFromOrder
        ? deleteEvent.data.itemId
        : deleteEvent.itemId,
      txnType: this.transactionType,
      subTxnType: this.subTransactionType,
      itemDetails: deleteEvent?.removeFromOrder
        ? deleteEvent.data
        : deleteEvent,
      removeFromOrder: deleteEvent?.removeFromOrder ? deleteEvent.res : null
    });

    if (deleteEvent?.removeFromOrder) {
      if (deleteEvent.data.productType === ProductTypesEnum.REGULAR) {
        const index = this.regularItemArray.indexOf(
          deleteEvent.data.inventoryId
        );
        this.regularItemArray.splice(index, 1);
      } else {
        const index = this.coinItemArray.findIndex(
          item =>
            item.itemCode === deleteEvent.data.itemCode &&
            item.unitWeight === deleteEvent.data.unitWeight
        );
        this.coinItemArray.splice(index, 1);
      }
    } else {
      if (deleteEvent.productType === ProductTypesEnum.REGULAR) {
        const index = this.regularItemArray.indexOf(deleteEvent.inventoryId);
        this.regularItemArray.splice(index, 1);
      } else {
        const index = this.coinItemArray.findIndex(
          item =>
            item.itemCode === deleteEvent.itemCode &&
            item.unitWeight === deleteEvent.unitWeight
        );
        this.coinItemArray.splice(index, 1);
      }
    }
  }

  resetTcsAmountPopup() {
    this.dialog
      .open(ResetTcsPopupComponent, {
        width: '500px',
        height: 'auto'
      })
      .afterClosed()
      .subscribe(res => {
        if (res) {
          this.resetTcs();
        }
      });
  }

  validateItem(data: CashMemoItemValidate) {
    this.productFacade.clearValidateItem();
    this.productFacade.validateItem(data);
  }

  errorNotifications(errorKey: string, showTraceId?: string) {
    const key = errorKey;
    this.translate
      .get(key)
      .pipe(take(1))
      .subscribe((translatedMessage: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SIMPLE,
            message: showTraceId
              ? `( Trace ID : ${showTraceId} ) ` + translatedMessage
              : translatedMessage,
            hasClose: true,
            hasBackdrop: true
          })
          .events.pipe(takeUntil(this.destroy$))
          .subscribe();
      });
  }

  getTotalProductValues(
    itemDetails: CashMemoItemDetailsResponse[],
    headerResponse?: CashMemoItemDetailsResponse,
    itemId?: string
  ) {
    let productQty = 0;
    let productWeight = 0;
    let productDisc = 0;
    let productAmt = 0;
    let coinQty = 0;
    let coinWeight = 0;
    let coinDisc = 0;
    let coinAmt = 0;
    let specificItem = [];

    if (itemDetails.length !== 0) {
      if (this.isDeleteFlag && headerResponse) {
        this.taxAmt = 0;
        this.totalAmt = 0;
        this.finalAmt = 0;
        this.roundOff = 0;
        this.taxAmt = headerResponse?.totalTax;
        this.totalAmt = headerResponse?.totalValue;
        this.finalAmt = headerResponse?.finalValue;
        this.roundOff = headerResponse?.roundingVariance;
        this.hallmarkCharges = headerResponse?.hallmarkCharges;
        this.hallmarkDiscount = headerResponse?.hallmarkDiscount;
      } else if (this.isDeleteFlag === false) {
        specificItem = itemDetails.filter(
          x => x?.itemDetails?.itemId === itemId
        );
        console.log('specificItem', specificItem);
        this.taxAmt = 0;
        this.totalAmt = 0;
        this.finalAmt = 0;
        this.roundOff = 0;
        this.taxAmt = specificItem[0]?.totalTax;
        this.totalAmt = specificItem[0]?.totalValue;
        this.finalAmt = specificItem[0]?.finalValue;
        this.roundOff = specificItem[0]?.roundingVariance;
        this.hallmarkCharges = specificItem[0]?.hallmarkCharges;
        this.hallmarkDiscount = specificItem[0]?.hallmarkDiscount;
      }
      itemDetails.forEach(element => {
        if (element?.itemDetails?.productGroupCode === this.coinCode) {
          coinQty = coinQty + element?.itemDetails?.totalQuantity;
          coinWeight = coinWeight + element?.itemDetails?.totalWeight;
          coinDisc = coinDisc + element?.itemDetails?.totalDiscount;
          coinAmt = coinAmt + element?.itemDetails?.totalValue;
        } else {
          productQty = productQty + element?.itemDetails?.totalQuantity;
          productWeight = productWeight + element?.itemDetails?.totalWeight;
          productDisc = productDisc + element?.itemDetails?.totalDiscount;
          productAmt = productAmt + element?.itemDetails?.totalValue;
        }
      });
    } else {
      this.taxAmt = 0;
      this.totalAmt = 0;
      this.finalAmt = 0;
      this.roundOff = 0;
    }

    const totalValues: SetTotalProductValuesPayload = {
      productQty: productQty,
      productWeight: productWeight,
      productDisc: productDisc,
      productAmt: productAmt,
      taxAmt: this.taxAmt,
      totalAmt: this.totalAmt,
      coinQty: coinQty,
      coinWeight: coinWeight,
      coinDisc: coinDisc,
      coinAmt: coinAmt,
      finalAmt: this.finalAmt,
      roundOff: this.roundOff,
      hallmarkCharges: this.hallmarkCharges,
      hallmarkDiscount: this.hallmarkDiscount
    };

    console.log('totalValues', totalValues);
    if (this.transactionType === TransactionTypeEnum.AB) {
      this.commonFacade.setABTotalProductValues(totalValues);
    } else {
      this.commonFacade.setCMTotalProductValues(totalValues);
    }
  }

  // clears the entire page
  clearPage(clearCustomer: boolean) {
    if (clearCustomer) {
      this.customerDetails = null;
      this.isIGST = false;
      this.igstFormGroup.get('isIGST').patchValue(this.isIGST);
      this.customerId = null;
      this.isAddFlag = false;
      this.taxDetails = null;
      this.productType = null;
      this.coinData = null;
      this.priceDetails = null;
      this.abDetails = null;
      this.transactionId = null;
      this.enrolmentDate = null;
      this.ulpID = null;
      this.addedEncircle = null;
      this.showEncircleAlert = true;
      this.overlayNotification.close();
      this.isAddAllItem = false;
      this.outOfStockItemsCount = 0;
      this.selectedOutOfStockItems = [];
      this.abDetailsPendingItemsCount = 0;
      this.addMultipleCoinsCount = 0;
      this.selectedAutoDiscounts = [];
      this.abItemIdList = [];
    }
    if (clearCustomer) this.productFacade.resetValues();
    else {
      this.productFacade.resetProductValues();
    }
    this.regularItemArray = [];
    this.coinItemArray = [];
    this.itemDetails = [];
    this.outOfStockArray = [];
    this.noOfProducts = 0;
    this.isRsoSelected = true;
    this.clearAllData$.next();
    this.isUpdateFlag = false;
    this.cashMemoId = null;
    this.errorData$.next(false);
    this.isDeleteFlag = false;
    this.clearSearchField();
    this.isActualWeightUpdate = false;
    this.isLotNumberUpdate = false;
    this.isLotNumberAdd = false;
    this.isQuantityUpdate = false;
    this.editedItem = null;
    this.editedItemEvent = null;
    this.editedWeightData = null;
    this.metalRate = null;
    this.otherChargesList = null;
    this.taxAmt = 0;
    this.totalAmt = 0;
    this.finalAmt = 0;
    this.roundOff = 0;
    this.hallmarkCharges = 0;
    this.hallmarkDiscount = 0;
    this.enableProductGridUpdate = true;
    this.isErrorinPriceUpdate = false;
    this.addCoinFromSearch = false;
    this.isAddItem = false;
    this.isUpdateItem = false;
    this.headerDetails = null;
    this.itemId = null;
    this.existingDiscounts = [];
    this.tempRowNumber = -1;
    this.rowId = 0;
    this.isUpdateSingleAutoDiscount = false;
    this.removeFromOrder = null;
  }

  // send

  sendProductToGrid(
    responseData: CashMemoItemDetailsResponse,
    isAdd: boolean,
    loadAutoDiscounts: boolean,
    hasError = false
  ) {
    let operationValue: string;
    this.productFacade
      .getItemDetailsOperation()
      .pipe(take(1))
      .subscribe((operation: string) => (operationValue = operation));
    if (responseData.itemDetails.productGroupCode === this.coinCode) {
      this.productType = ProductTypesEnum.COINS;
    } else {
      this.productType = ProductTypesEnum.REGULAR;
    }
    const priceResult = calculatePriceBreakup(
      responseData.itemDetails?.priceDetails,
      responseData.itemDetails?.taxDetails?.data,
      {
        isUcp: responseData.itemDetails?.priceDetails?.isUcp,
        totalValue: responseData.itemDetails?.totalValue,
        weightUnit: weightCode,
        weight: responseData.itemDetails?.totalWeight
      },
      responseData.itemDetails.totalDiscount
    );

    const productDataToGrid: ProductDetailsInGrid = {
      itemCode: responseData.itemDetails.itemCode,
      binCode: responseData.itemDetails.binCode,
      description: this.pgDescription
        ? this.pgDescription[`${responseData.itemDetails.productGroupCode}`]
        : responseData.itemDetails.productGroupCode,
      selectedLotNumber:
        this.productType === ProductTypesEnum.COINS
          ? String(responseData.itemDetails.totalQuantity)
          : responseData.itemDetails.inventoryId,
      availableLotNumbers: responseData.availableLotNumbers,
      unitWeight: responseData.itemDetails.unitWeight,
      actualWeight: responseData.itemDetails.totalWeight,
      selectedRso:
        responseData.itemDetails.employeeCode === null
          ? selectRSO
          : responseData.itemDetails.employeeCode,
      availableRso: this.rsoDetails,
      pricePerUnit:
        priceResult.basePrice / responseData.itemDetails.totalQuantity,
      discount: responseData.itemDetails.totalDiscount,
      selectedDiscounts: responseData.discountDetails,
      finalPrice: priceResult.totalAfterTax,
      priceBreakUp: priceResult,
      productDetails: responseData?.productDetails,
      inventoryId: responseData.itemDetails.inventoryId,
      itemId: responseData.itemDetails.itemId,
      productType: this.productType,
      isAdd: isAdd,
      remarks: responseData.itemDetails.remarks
        ? responseData.itemDetails.remarks
        : null,
      availableReasons: this.reasons,
      selectedReason: responseData.itemDetails.reason
        ? responseData.itemDetails.reason
        : null,
      priceDetails: responseData.itemDetails.priceDetails,
      quantity: responseData.itemDetails.totalQuantity,
      taxDetails: responseData.itemDetails.taxDetails,
      stdWeight: responseData.itemDetails.stdWeight,
      karatage: responseData?.productDetails?.karatage,
      productCatergory: responseData.itemDetails.productCategoryCode,
      productGroup: responseData.itemDetails.productGroupCode,
      status: responseData?.status,
      totalQuantity: responseData?.productDetails?.totalQuantity,
      subTxnType: responseData?.subTxnType,
      refSubTxnType: responseData?.refSubTxnType
        ? responseData?.refSubTxnType
        : null,
      responseData: responseData,
      hmQuantity: priceResult.itemHallmarkDetails.hmQuantity,
      isFOCForHallmarkingCharges:
        priceResult.itemHallmarkDetails.isFOCForHallmarkingCharges,
      isHallmarked: priceResult.itemHallmarkDetails.isHallmarked,
      rowId: responseData.itemDetails.rowId,
      age: responseData.itemDetails?.itemDetails?.data?.age
    };

    this.product = productDataToGrid;
    this.itemId = responseData.itemDetails.itemId;
    if (this.isUpdateFlag) {
      if (operationValue === 'LOT')
        this.addStopTracking(
          'pw.instrumentationMessges.updatingLotNumberDetailsMsg'
        );
      else if (operationValue === 'WEIGHT')
        this.addStopTracking(
          'pw.instrumentationMessges.updatingActualWeightMsg'
        );
      else if (operationValue === 'RSO')
        this.addStopTracking('pw.instrumentationMessges.updatingRsoNameMsg');
    } else {
      this.addStopTracking('pw.instrumentationMessges.addItemToGridMsg');
    }

    if (
      this.productType === ProductTypesEnum.REGULAR &&
      (isAdd || this.isLotNumberAdd)
    ) {
      this.regularItemArray.push(responseData.itemDetails.inventoryId);
      this.isLotNumberAdd = false;
    } else if (
      this.productType === ProductTypesEnum.COINS &&
      (isAdd || this.isLotNumberAdd)
    ) {
      this.coinItemArray.push({
        itemCode: responseData.itemDetails.itemCode,
        unitWeight: responseData.itemDetails.unitWeight
      });
    }
    this.headerDetails = responseData;
    if (
      (this.isAddItem && isAdd) ||
      this.isUpdateSingleAutoDiscount ||
      loadAutoDiscounts
    ) {
      this.addStartTracking('pw.instrumentationMessges.addItemAutoDiscMsg');
      this.getAutoDiscounts(responseData);
    }
    if (this.isUpdateItem && !hasError) {
      if (this.isABInvoked && this.isABDiscountsSelected) {
        this.discountUpdatePopup();
      } else {
        this.calculateDiscountValuesAfterUpdate(responseData);
      }
      this.addStopTracking('pw.instrumentationMessges.addCoinToGridMsg');
    }

    if (loadAutoDiscounts) {
      this.isAddAllItem = true;
      this.tempRowNumber = -1;
    }
  }

  getAutoDiscounts(responseData) {
    let otherThanSelectedRow = [];
    if (this.itemDetails.length > 0) {
      otherThanSelectedRow = this.itemDetails.filter(
        eachRow =>
          eachRow.itemDetails.itemId !== responseData.itemDetails.itemId
      );
    }

    const payload = {
      businessDate: this.bussinessDay,
      itemDetails: {
        itemCode: responseData.itemDetails.itemCode,
        lotNumber: responseData.itemDetails.lotNumber,
        mfgDate:
          responseData.itemDetails.itemDetails?.data[
            responseData.itemDetails.inventoryId
          ]?.mfgDate,
        stockInwardDate:
          responseData.itemDetails.itemDetails?.data[
            responseData.itemDetails.inventoryId
          ]?.stockInwardDate,
        totalTax: responseData.itemDetails.totalTax,
        totalWeight: responseData.itemDetails.totalWeight,
        netWeight: responseData.itemDetails.priceDetails.netWeight,
        totalValue: responseData.itemDetails.totalValue,
        complexityPercent:
          responseData?.itemDetails?.priceDetails?.makingChargeDetails
            ?.wastagePct,
        makingChargePerGram:
          responseData?.itemDetails?.priceDetails?.makingChargeDetails
            ?.makingChargePgram,
        productCategoryCode: responseData.itemDetails.productCategoryCode,
        productGroupCode: responseData.itemDetails.productGroupCode
      },
      itemDetailsForCummulativeCal: this.sendCumulativeDiscountDetails(
        otherThanSelectedRow
      ),
      transactionDetails: {
        transactionType: responseData.txnType,
        subTransactionType: responseData.subTxnType,
        isFrozenRate: this.frozenAB
      },
      encircleDiscount: this.addedEncircle ? this.addedEncircle : {},
      employeeDetails: this.appliedEmployeeCouponCode
        ? {
            couponDetails: [
              {
                couponCode: this.appliedEmployeeCouponCode
              }
            ]
          }
        : null,
      tsssDetails: this.appliedTsssCouponCode
        ? {
            couponDetails: [
              {
                couponCode: this.appliedTsssCouponCode
              }
            ]
          }
        : null,
      tataEmployeeDetails: this.appliedTataEmployeeDiscountDetails
        ? this.appliedTataEmployeeDiscountDetails
        : null,
      empowermentDetails: this.appliedEmpowermentDiscountDetails
        ? {
            applyEmpowermentDiscount: this.appliedEmpowermentDiscountDetails
          }
        : null,
      rivaahGhsDetails: this.appliedRivaahGhsDiscountDetails
        ? this.appliedRivaahGhsDiscountDetails
        : responseData.discountTxnDetails?.data?.rivaahGhsDiscountDetails
        ? responseData.discountTxnDetails?.data?.rivaahGhsDiscountDetails
        : null
    };

    this.discountFacade.loadAutoDiscounts({
      request: {
        customerDetails: {
          enrollmentDate: this.enrolmentDate,
          ulpId: this.ulpID
        },
        discountRequestDto: payload,
        itemDetails: {
          itemCode: responseData.itemDetails.itemCode,
          lotNumber: responseData.itemDetails.lotNumber,
          productCategoryCode: responseData.itemDetails.productCategoryCode,
          productGroupCode: responseData.itemDetails.productGroupCode,
          priceDetails: responseData.itemDetails.priceDetails,
          totalQuantity: responseData.itemDetails.totalQuantity,
          totalValue: responseData.itemDetails.totalValue,
          totalWeight: responseData.itemDetails.totalWeight,
          netWeight: responseData.itemDetails.priceDetails.netWeight,
          totalTax: responseData.itemDetails.totalTax
        }
      },
      data: responseData
    });
  }

  sendCumulativeDiscountDetails(otherItemSelected) {
    const otherItemSendToItemLevel = [];
    if (otherItemSelected.length > 0) {
      otherItemSelected.map(eachVal => {
        if (eachVal?.discountDetails?.length > 0) {
          eachVal.discountDetails.forEach(val => {
            if (
              val.discountType === DiscountTypeEnum.SLAB_BASED_DISCOUNT ||
              DiscountTypeEnum.HIGH_VALUE_DISCOUNT ||
              DiscountTypeEnum.BEST_DEAL_DISCOUNT
            ) {
              otherItemSendToItemLevel.push(eachVal);
            }
          });
        } else if (eachVal.productType !== 'FOC') {
          otherItemSendToItemLevel.push(eachVal);
        }
      });
    }
    if (otherItemSendToItemLevel?.length > 0) {
      const itemDetailsArray = [];

      otherItemSendToItemLevel.forEach(val => {
        itemDetailsArray.push({
          itemCode: val.itemDetails.itemCode,
          discountTypeAndIdAppliedOnItem: this.getDiscountTypeAndIdMapForOtherItem(
            val
          ),
          totalDiscount: val.itemDetails.totalDiscount,
          lotNumber: val.itemDetails.lotNumber,
          mfgDate: val.itemDetails.itemDetails?.data?.mfgDate,
          stockInwardDate: val.itemDetails.itemDetails?.data?.stockInwardDate,
          totalTax: val.itemDetails.totalTax,
          totalWeight: val.itemDetails.totalWeight,
          netWeight: val.itemDetails.priceDetails.netWeight,
          totalValue: val.itemDetails.totalValue,
          complexityPercent:
            val?.itemDetails?.priceDetails?.makingChargeDetails?.wastagePct,
          makingChargePerGram:
            val?.itemDetails?.priceDetails?.makingChargeDetails
              ?.makingChargePgram,
          productCategoryCode: val.itemDetails.productCategoryCode,
          productGroupCode: val.itemDetails.productGroupCode,
          isUcp: val.itemDetails.priceDetails.isUcp
        });
      });
      return itemDetailsArray;
    } else {
      return [];
    }
  }

  getDiscountTypeAndIdMapForOtherItem(selctedDiscountVal) {
    const discountTypeAndIdAppliedOnItem = new Map();
    if (selctedDiscountVal?.discountDetails?.length > 0) {
      const slectedDiscountTypesAndId = selctedDiscountVal.discountDetails.filter(
        val =>
          val.discountType === DiscountTypeEnum.SLAB_BASED_DISCOUNT ||
          DiscountTypeEnum.HIGH_VALUE_DISCOUNT ||
          DiscountTypeEnum.BEST_DEAL_DISCOUNT
      );
      if (slectedDiscountTypesAndId.length > 0) {
        slectedDiscountTypesAndId.forEach(obj => {
          discountTypeAndIdAppliedOnItem.set(obj.discountType, obj.discountId);
        });
      }
    }

    if (
      discountTypeAndIdAppliedOnItem !== null &&
      discountTypeAndIdAppliedOnItem !== undefined &&
      discountTypeAndIdAppliedOnItem.size !== 0
    ) {
      return this.convertMapToObject(discountTypeAndIdAppliedOnItem);
    } else {
      return null;
    }
  }

  convertMapToObject(pairs) {
    return Array.from(pairs).reduce(
      (acc, [key, value]) => Object.assign(acc, { [key]: value }),
      {}
    );
  }

  //  update method

  updateLotNumberValue(
    productData: ProductDetailsInGrid,
    priceDetails: ProductPriceDetails,
    taxDetails: CashMemoTaxDetails
  ) {
    const totalItemValue =
      priceDetails.priceDetails.isUcp && !priceDetails.ignoreUcpRecalculate
        ? this.calculateTotalValueForUCP(taxDetails, priceDetails.finalValue)
        : this.currencyRoundOff(priceDetails.finalValue);
    const totalItemTax = this.calculateTax(
      taxDetails,
      totalItemValue - productData.discount,
      priceDetails.priceDetails.itemHallmarkDetails
    );
    const hallmarkingCharges = priceDetails?.priceDetails?.itemHallmarkDetails
      ?.hallmarkingCharges
      ? priceDetails?.priceDetails?.itemHallmarkDetails?.hallmarkingCharges
      : 0;
    const hallmarkingDiscount =
      priceDetails?.priceDetails?.itemHallmarkDetails
        ?.isFOCForHallmarkingCharges && hallmarkingCharges
        ? hallmarkingCharges
        : 0;
    const itemToBeUpdated: CashMemoItemDetailsRequest = {
      itemCode: priceDetails.productDetails.itemCode,
      lotNumber: priceDetails.productDetails.lotNumber,
      inventoryId: priceDetails.productDetails.inventoryId,
      totalQuantity: productData.quantity,
      totalWeight: this.weightRoundOff(
        priceDetails.productDetails.unitWeight * productData.quantity
      ),
      inventoryWeight: priceDetails.productDetails.unitWeight,
      remarks: null,
      reason: null,
      totalValue: this.currencyRoundOff(totalItemValue),
      unitValue:
        productData.productGroup === this.silverCoinCode
          ? this.currencyRoundOff(totalItemValue / Number(productData.quantity))
          : this.currencyRoundOff(
              totalItemValue / Number(productData.selectedLotNumber?.value)
            ),
      employeeCode:
        productData.selectedRso === null ||
        productData.selectedRso === selectRSO
          ? ''
          : productData.selectedRso,
      itemId: productData.itemId,
      totalDiscount: productData.discount,
      totalTax: this.currencyRoundOff(totalItemTax),
      hallmarkCharges: hallmarkingCharges,
      hallmarkDiscount: hallmarkingDiscount,
      finalValue: this.currencyRoundOff(
        totalItemValue +
          totalItemTax -
          productData.discount +
          hallmarkingCharges -
          hallmarkingDiscount
      )
    };

    this.isDeleteFlag = false;
    this.isUpdateSingleAutoDiscount = true;
    this.productFacade.updateItemInCashMemo({
      id: this.cashMemoId,
      itemId: productData.itemId,
      itemDetails: itemToBeUpdated,
      availableLotNumbers: productData.availableLotNumbers,
      productDetails: priceDetails.productDetails,
      txnType: this.transactionType,
      subTxnType: this.subTransactionType,
      oldData: productData.responseData,
      removeFromOrder: this.removeFromOrder,
      isIGST: this.isIGST
    });
  }

  updateActualWeightValue(
    productData: ProductDetailsInGrid,
    editedData: EditedWeightData,
    priceDetails: ProductPriceDetails,
    taxDetails: CashMemoTaxDetails
  ) {
    const totalItemValue = this.currencyRoundOff(priceDetails.finalValue);
    const totalItemTax = this.calculateTax(
      taxDetails,
      totalItemValue - productData.discount,
      priceDetails.priceDetails.itemHallmarkDetails
    );
    const hallmarkingCharges = priceDetails?.priceDetails?.itemHallmarkDetails
      ?.hallmarkingCharges
      ? priceDetails?.priceDetails?.itemHallmarkDetails?.hallmarkingCharges
      : 0;
    const hallmarkingDiscount =
      priceDetails?.priceDetails?.itemHallmarkDetails
        ?.isFOCForHallmarkingCharges && hallmarkingCharges
        ? hallmarkingCharges
        : 0;
    const itemToBeUpdated: CashMemoItemDetailsRequest = {
      itemCode: productData.itemCode,
      lotNumber: priceDetails.productDetails.lotNumber,
      inventoryId: priceDetails.productDetails.inventoryId,
      totalQuantity: productData.quantity,
      totalWeight: this.weightRoundOff(editedData.actualWeight),
      inventoryWeight: productData.unitWeight,
      remarks: editedData.remarks ? editedData.remarks : null,
      totalValue: this.currencyRoundOff(totalItemValue),
      unitValue: this.currencyRoundOff(totalItemValue),
      employeeCode:
        productData.selectedRso === null ||
        productData.selectedRso === selectRSO
          ? ''
          : productData.selectedRso,
      reason: editedData.reason ? editedData.reason : null,
      itemId: productData.itemId,
      totalDiscount: productData.discount,
      totalTax: this.currencyRoundOff(totalItemTax),
      hallmarkCharges: hallmarkingCharges,
      hallmarkDiscount: hallmarkingDiscount,
      finalValue: this.currencyRoundOff(
        totalItemValue +
          totalItemTax -
          productData.discount +
          hallmarkingCharges -
          hallmarkingDiscount
      )
    };

    this.isDeleteFlag = false;
    this.isUpdateItem = true;
    this.productFacade.updateItemInCashMemo({
      id: this.cashMemoId,
      itemId: productData.itemId,
      itemDetails: itemToBeUpdated,
      availableLotNumbers: productData.availableLotNumbers,
      productDetails: priceDetails.productDetails,
      txnType: this.transactionType,
      subTxnType: this.subTransactionType,
      oldData: productData.responseData,
      isIGST: this.isIGST
    });
  }

  validateClear() {
    this.productFacade.clearValidateItem();
  }

  validateProduct(inventoryId: string): boolean {
    if (this.regularItemArray.filter(c => c === inventoryId).length === 1) {
      return false;
    } else {
      return true;
    }
  }

  validateCoin(itemCode: string, unitWeight: number): boolean {
    if (
      this.coinItemArray.filter(
        c => c.itemCode === itemCode && c.unitWeight === unitWeight
      ).length === 1
    ) {
      return false;
    } else {
      return true;
    }
  }

  //  tax

  calculateTax(
    taxDetails: CashMemoTaxDetails,
    totalItemValue: number,
    itemHallmarkDetails: ItemHallmarkDetails
  ): number {
    let taxValue = 0;
    let cessTaxValue = 0;

    if (taxDetails.data !== null) {
      for (const tax of Object.keys(taxDetails.data)) {
        taxValue += this.currencyRoundOff(
          (totalItemValue * taxDetails.data[tax].taxPercentage) / 100
        );
      }
    }
    if (taxDetails.cess !== null) {
      for (const tax of Object.keys(taxDetails.cess)) {
        if (taxDetails.cess[tax].cessOnTax === true) {
          cessTaxValue = (taxValue * taxDetails.cess[tax].cessPercentage) / 100;
        } else {
          cessTaxValue =
            (totalItemValue * taxDetails.cess[tax].cessPercentage) / 100;
        }
      }
    }
    return (
      this.currencyRoundOff(cessTaxValue) +
      this.currencyRoundOff(taxValue) +
      this.calculateHallmarkingTax(itemHallmarkDetails)
    );
  }

  //  hallmarking tax

  calculateHallmarkingTax(hallmarkingDetails: ItemHallmarkDetails): number {
    let taxValue = 0;

    if (
      hallmarkingDetails.isFOCForHallmarkingCharges !== null &&
      hallmarkingDetails.isFOCForHallmarkingCharges === false
    ) {
      if (
        hallmarkingDetails.hallmarkingCharges &&
        hallmarkingDetails.hallmarkGstPct
      ) {
        taxValue =
          (hallmarkingDetails.hallmarkingCharges *
            hallmarkingDetails.hallmarkGstPct) /
          100;
      }
    }

    return this.currencyRoundOff(taxValue);
  }

  // calculate total value from finalValue and tax
  // pending: cessontax true calculation pending
  calculateTotalValueForUCP(
    taxDetails: CashMemoTaxDetails,
    finalValue: number
  ): number {
    let taxValue = 0;
    let cessTaxValue = 0;
    let totalValue = 0;

    if (taxDetails.data !== null) {
      for (const tax of Object.keys(taxDetails.data)) {
        if (tax !== TaxTypesEnum.HALLMARK_GST) {
          taxValue += taxDetails.data[tax].taxPercentage / 100;
        }
      }
    }
    if (taxDetails.cess !== null) {
      for (const tax of Object.keys(taxDetails.cess)) {
        if (taxDetails.cess[tax].cessOnTax === true) {
          // cessTaxValue = (taxValue * taxDetails.cess[tax].cessPercentage) / 100;
          cessTaxValue = taxDetails.cess[tax].cessPercentage / 100;
        } else {
          cessTaxValue = taxDetails.cess[tax].cessPercentage / 100;
        }
      }
    }

    totalValue = finalValue / (cessTaxValue + taxValue + 1);
    totalValue = this.currencyRoundOff(totalValue);
    totalValue =
      totalValue + (finalValue - totalValue * (cessTaxValue + taxValue + 1));

    return this.currencyRoundOff(totalValue);
  }

  loadImageUrl(event: string) {
    if (this.transactionType === TransactionTypeEnum.AB) {
      this.commonFacade.loadABImageUrl(event);
    } else {
      this.commonFacade.loadCMImageUrl(event);
    }
  }

  // Coin
  openAddCoinPopup() {
    if (this.coinDetails.length === 0) {
      this.addStartTracking('pw.instrumentationMessges.loadCoinDetailsMsg');
      this.productFacade.loadCoinDetails({
        itemCode: null,
        withSaleableCheck: true
      });
    } else {
      this.addCoinPopup();
    }
  }

  addCoinPopup() {
    this.addCoinFromSearch = false;
    if (
      this.enableProductGridUpdate &&
      this.isRsoSelected &&
      !this.isErrorinPriceUpdate &&
      this.totalNoOfItemsInProductGrid < this.maxNoOfItemsInProductGrid
    ) {
      const dialogRef = this.dialog.open(AddCoinPopupComponent, {
        width: '60vw',
        data: {
          coinDetails: this.coinDetails
        },
        disableClose: true
      });

      dialogRef.componentInstance.onAdd.subscribe(data => {
        this.productFacade.loadPriceDetails({
          orderPriceRequest: {
            checkInventory: true,
            itemCode: data.itemCode,
            standardPrice: this.standardPrice,
            // measuredQuantity: data.totalQuantity,
            // measuredWeight: data.totalQuantity * data.unitWeight,
            measuredQuantity: 1,
            measuredWeight: data.unitWeight
          }
        });
        if (this.taxTransactionType && data?.itemCode) {
          this.productFacade.loadTaxDetails({
            customerId: this.customerId,
            isIGST: this.isIGST,
            itemCode: data.itemCode,
            txnType: this.taxTransactionType
          });
        }
      });

      dialogRef.componentInstance.onUpdate.subscribe(data => {
        this.productFacade.loadPriceDetails({
          orderPriceRequest: {
            checkInventory: true,
            itemCode: data.itemCode,
            standardPrice: this.standardPrice,
            measuredQuantity: data.quantity,
            measuredWeight: data.quantity * data.unitWeight
          }
        });
        if (this.taxTransactionType && data?.itemCode) {
          this.productFacade.loadTaxDetails({
            customerId: this.customerId,
            isIGST: this.isIGST,
            itemCode: data.itemCode,
            txnType: this.taxTransactionType
          });
        }
      });

      dialogRef.componentInstance.priceDetails = this.coinPriceDetails$;
      dialogRef.componentInstance.taxDetails = this.coinTaxDetails$;
      dialogRef.componentInstance.metalPrice = this.coinGoldRate$;
      dialogRef.componentInstance.validCoinDetails$ = this.validCoinDetails$;

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.addStartTracking('pw.instrumentationMessges.addCoinToGridMsg');
          this.addCoinToCashMemo(result);
        }
      });

      dialogRef.componentInstance.onReset.subscribe(data => {
        this.productFacade.resetCoinValues();
      });

      dialogRef.componentInstance.onLoadCoinDetails.subscribe(data => {
        this.productFacade.loadValidCoinDetails({
          itemCode: data,
          withSaleableCheck: true
        });
      });
    } else {
      if (this.isRsoSelected === false) {
        this.showNotifications('pw.productGrid.rsoNotSelectedMsg');
      } else if (this.isErrorinPriceUpdate) {
        this.showNotifications('pw.productGrid.refreshGridMsg');
      } else if (
        this.totalNoOfItemsInProductGrid >= this.maxNoOfItemsInProductGrid
      ) {
        this.showNotifications(
          this.productGridLimitMsg + this.maxNoOfItemsInProductGrid
        );
      } else {
        this.showUpdateError();
      }
    }
  }

  addCoinToCashMemo(data) {
    this.productType = ProductTypesEnum.COINS;
    if (this.cashMemoId !== null) {
      this.addMultipleCoinsCount = data.length;
      data.forEach(element => {
        const totalItemValue = this.currencyRoundOff(element.finalPrice);
        const totalItemTax = this.calculateTax(
          element.taxDetails,
          totalItemValue,
          element?.priceDetails?.itemHallmarkDetails
        );
        const hallmarkingCharges = element?.priceDetails?.itemHallmarkDetails
          ?.hallmarkingCharges
          ? element?.priceDetails?.itemHallmarkDetails?.hallmarkingCharges
          : 0;
        const hallmarkingDiscount =
          element.priceDetails?.itemHallmarkDetails
            ?.isFOCForHallmarkingCharges && hallmarkingCharges
            ? hallmarkingCharges
            : 0;
        const itemToBeAdded: CashMemoItemDetailsRequest = {
          itemCode: element.itemCode,
          totalQuantity: element.quantity,
          totalValue: this.currencyRoundOff(totalItemValue),
          unitValue: this.currencyRoundOff(element.pricePerUnit),
          totalWeight: this.weightRoundOff(element.actualWeight),
          inventoryWeight: this.weightRoundOff(element.unitWeight),
          employeeCode: null,
          remarks: null,
          totalDiscount: 0,
          totalTax: this.currencyRoundOff(totalItemTax),
          reason: null,
          hallmarkCharges: hallmarkingCharges,
          hallmarkDiscount: hallmarkingDiscount,
          finalValue: this.currencyRoundOff(
            totalItemValue +
              totalItemTax +
              hallmarkingCharges -
              hallmarkingDiscount
          )
        };
        if (this.validateCoin(element.itemCode, element.unitWeight)) {
          {
            this.isDeleteFlag = false;
            this.isUpdateFlag = false;
            this.isAddItem = true;
            this.tempRowNumber = -1;
            this.productFacade.addItemToCashMemo({
              id: this.cashMemoId,
              itemDetails: itemToBeAdded,
              txnType: this.transactionType,
              subTxnType: this.subTransactionType,
              productDetails: element,
              isIGST: this.isIGST
            });
          }
        } else {
          this.errorData$.next(true);
        }
        this.clearSearchField();
      });
    } else {
      this.isAddFlag = true;
      this.coinData = data;
      this.productFacade.setCreateOrder(true);
    }
  }

  updateQuantityValue(
    productData: ProductDetailsInGrid,
    priceDetails: ProductPriceDetails,
    taxDetails: CashMemoTaxDetails
  ) {
    const totalItemValue = this.currencyRoundOff(priceDetails.finalValue);
    const totalItemTax = this.calculateTax(
      taxDetails,
      totalItemValue - productData.discount,
      priceDetails.priceDetails.itemHallmarkDetails
    );
    const hallmarkingCharges = priceDetails?.priceDetails?.itemHallmarkDetails
      ?.hallmarkingCharges
      ? priceDetails?.priceDetails?.itemHallmarkDetails?.hallmarkingCharges
      : 0;
    const hallmarkingDiscount =
      priceDetails?.priceDetails?.itemHallmarkDetails
        ?.isFOCForHallmarkingCharges && hallmarkingCharges
        ? hallmarkingCharges
        : 0;
    const itemToBeUpdated: CashMemoItemDetailsRequest = {
      itemCode: productData.itemCode,
      lotNumber:
        productData.productGroup === this.silverCoinCode
          ? priceDetails.productDetails.lotNumber
          : null,
      inventoryId: null,
      totalQuantity:
        productData.productGroup === this.silverCoinCode
          ? Number(productData.quantity)
          : Number(productData.selectedLotNumber?.value),
      totalWeight:
        productData.productGroup === this.silverCoinCode
          ? this.weightRoundOff(
              productData.unitWeight * Number(productData.quantity)
            )
          : this.weightRoundOff(
              productData.unitWeight *
                Number(productData.selectedLotNumber?.value)
            ),
      inventoryWeight: productData.unitWeight,
      remarks: null,
      reason: null,
      totalValue: this.currencyRoundOff(totalItemValue),
      unitValue:
        productData.productGroup === this.silverCoinCode
          ? this.currencyRoundOff(totalItemValue / Number(productData.quantity))
          : this.currencyRoundOff(
              totalItemValue / Number(productData.selectedLotNumber?.value)
            ),
      employeeCode:
        productData.selectedRso === null ||
        productData.selectedRso === selectRSO
          ? ''
          : productData.selectedRso,
      itemId: productData.itemId,
      totalDiscount: productData.discount,
      totalTax: this.currencyRoundOff(totalItemTax),
      hallmarkCharges: hallmarkingCharges,
      hallmarkDiscount: hallmarkingDiscount,
      finalValue: this.currencyRoundOff(
        totalItemValue +
          totalItemTax -
          productData.discount +
          hallmarkingCharges -
          hallmarkingDiscount
      )
    };

    this.isDeleteFlag = false;
    this.productFacade.updateItemInCashMemo({
      id: this.cashMemoId,
      itemId: productData.itemId,
      itemDetails: itemToBeUpdated,
      availableLotNumbers: productData.availableLotNumbers,
      productDetails: productData.productDetails,
      txnType: this.transactionType,
      subTxnType: this.subTransactionType,
      oldData: productData.responseData,
      isIGST: this.isIGST
    });
  }

  showUpdateError() {
    let updateErrorkey;
    if (this.isErrorinPriceUpdate) {
      this.clearSearchField();
      updateErrorkey = 'pw.productGrid.refreshGridMsg';
    } else if (this.isFocAdded) {
      updateErrorkey = 'pw.regularCashMemo.removeFocProductsErrorMsg';
    } else if (this.isManualFocAdded) {
      updateErrorkey = 'pw.regularCashMemo.removeManualFocProductsErrorMsg';
    } else if (this.isFocKeptPending) {
      updateErrorkey = 'pw.regularCashMemo.removePendinfFocProductsErrorMsg';
    } else if (this.isBillLevelDiscountsAdded) {
      updateErrorkey = 'pw.regularCashMemo.removeBillLevelDiscountsErrorMsg';
    } else if (this.isSystemDDvDiscountsAdded) {
      updateErrorkey = 'pw.regularCashMemo.removeDvDiscountsErrorMsg';
    } else if (this.isSystemGhsBonusDiscountAdded) {
      updateErrorkey = 'pw.regularCashMemo.removeGhsBonusDiscountsErrorMsg';
    } else {
      updateErrorkey = 'pw.regularCashMemo.updateErrorMsg';
    }

    this.translate
      .get(updateErrorkey)
      .pipe(take(1))
      .subscribe((translatedMsg: any) => {
        this.overlayNotification.show({
          type: OverlayNotificationType.SIMPLE,
          hasClose: true,
          message: translatedMsg,
          hasBackdrop: this.isErrorinPriceUpdate ? true : false
        });
      });
  }

  showNotifications(key: string) {
    this.clearSearchField();
    const selectErrorkey = key;
    this.translate
      .get(selectErrorkey)
      .pipe(take(1))
      .subscribe((translatedMsg: any) => {
        this.overlayNotification.show({
          type: OverlayNotificationType.SIMPLE,
          hasClose: true,
          message: translatedMsg,
          hasBackdrop: true
        });
      });
  }

  showNotification(error?: CustomErrors, message?: string) {
    this.overlayNotification
      .show({
        type: message
          ? OverlayNotificationType.SIMPLE
          : OverlayNotificationType.ERROR,
        error: error,
        hasClose: true,
        message: message,
        hasBackdrop: !!message
      })
      .events.pipe(take(1))
      .subscribe();
  }
  openOutOfStockPopup(data: CashMemoItemDetails[]) {
    this.dialog.closeAll();
    const dialogRef = this.dialog.open(ProductOutOfStockPopupComponent, {
      width: '500px',
      height: 'auto',
      data: {
        infoMsg: 'pw.productGrid.outOfStockInfo',
        data: data
      },
      disableClose: true
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result.data.length !== 0) {
          this.overlayNotification.close();
          this.deleteFocItems();
          this.focFacade.resetFOCData();
          result.data.forEach(element => {
            this.deleteItemFromCashMemo(element);
          });
        }
      });
  }

  openPendingAbItemsPopup() {
    this.productFacade
      .getAbItemDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe((item: CashMemoItemDetailsResponse[]) => {
        if (
          item.length !== 0 &&
          this.abDetailsPendingItemsCount === item.length
        ) {
          this.dialog.closeAll();
          const tempItemArray = [];
          item.forEach(element => {
            tempItemArray.push(element.itemDetails);
          });
          const dialogRef = this.dialog.open(ProductOutOfStockPopupComponent, {
            width: '500px',
            height: 'auto',
            data: {
              infoMsg: 'pw.productGrid.deleteOrderItemsMsg',
              data: tempItemArray
            },
            disableClose: true
          });

          dialogRef
            .afterClosed()
            .pipe(takeUntil(this.destroy$))
            .subscribe(result => {
              if (result && result.res === true && result.data.length !== 0) {
                this.overlayNotification.close();
                result.data.forEach(element => {
                  this.productFacade.deleteItemDetails({
                    id: this.abDetails.id,
                    itemId: element.itemId,
                    txnType: TransactionTypeEnum.AB,
                    subTxnType: SubTransactionTypeEnum.NEW_AB,
                    itemDetails: element,
                    removeFromOrder: null,
                    cashMemoId: this.transactionId
                  });
                });
              }
            });
        }
      });
  }

  getMetalName(metalType: string) {
    if (metalType === MetalTypeEnum.GOLD) return MetalNamesEnum.J;
    if (metalType === MetalTypeEnum.PLATINUM) return MetalNamesEnum.L;
    if (metalType === MetalTypeEnum.SILVER) return MetalNamesEnum.P;
  }

  //  weight and currency formatter
  currencyRoundOff(amount: any) {
    const roundedOffAmount = this.currencyFormatterService.format(
      amount,
      this.currencyCode,
      false
    );
    return !!roundedOffAmount
      ? +roundedOffAmount.replace(new RegExp(',', 'g'), '')
      : 0;
  }

  weightRoundOff(weight: any) {
    const roundedOffWeight = this.weightFormatterService.format(weight);
    return !!roundedOffWeight ? +roundedOffWeight : 0;
  }

  discountPopupClosed(event) {
    if (event.reason !== null) {
      this.isUpdateFlag = true;
      this.isDeleteFlag = false;
      this.productFacade.partialUpdateItemInCashMemo({
        id: this.cashMemoId,
        itemId: event.data.itemId,
        itemDetails: {
          discountDetails: {
            data: {
              remarks: event.reason
            },
            type: 'DISCOUNT_DETAILS'
          }
        },
        availableLotNumbers: event.data.availableLotNumbers,
        productDetails: event.data.productDetails,
        txnType: this.transactionType,
        subTxnType: this.subTransactionType,
        oldData: event.data.responseData,
        isIGST: this.isIGST
      });
    }
    if (event.discountsReload)
      this.discountFacade.loadReloadDiscountsGrid(true);
    else if (event.reason === null) {
      this.productFacade.getItemFromCashMemo({
        id: this.cashMemoId,
        itemId: event.data.itemId,
        headerData: event.data.responseData,
        txnType: this.transactionType,
        subTxnType: this.subTransactionType,
        loadHeaderInfo: true,
        isAddItem: false
      });
    }
  }

  // FOC
  loadFocSchemes(loadDetails: boolean) {
    this.focSelectedRso = null;
    if (this.isRsoSelected === false && loadDetails === true) {
      this.showNotifications('pw.productGrid.rsoNotSelectedMsg');
    } else {
      this.addStartTracking('pw.instrumentationMessges.addFocFromPopupMsg');
      this.selectedFocItems = [];
      this.selectedItemsDetails.forEach(element => {});
      const result = this.selectedItemsDetails.reduce(
        (acc, obj) => {
          if (acc.map.hasOwnProperty(obj.itemDetails.productGroupCode)) {
            acc.map[obj.itemDetails.productGroupCode].totalDiscount += Number(
              obj.itemDetails.totalDiscount
            );
            acc.map[obj.itemDetails.productGroupCode].totalTax += Number(
              obj.itemDetails.totalTax
            );
            acc.map[obj.itemDetails.productGroupCode].totalValue += Number(
              obj.itemDetails.totalValue
            );
            acc.map[
              obj.itemDetails.productGroupCode
            ].totalMaterialWeight += Number(
              obj.itemDetails.measuredWeightDetails.data.materialWeight *
                obj.itemDetails.totalQuantity
            );
            acc.map[
              obj.itemDetails.productGroupCode
            ].totalMetalWeight += Number(
              (obj.itemDetails.measuredWeightDetails.data.goldWeight +
                obj.itemDetails.measuredWeightDetails.data.silverWeight +
                obj.itemDetails.measuredWeightDetails.data.platinumWeight) *
                obj.itemDetails.totalQuantity
            );
            acc.map[
              obj.itemDetails.productGroupCode
            ].totalStoneWeight += Number(
              (obj.itemDetails.measuredWeightDetails.data.diamondWeight +
                obj.itemDetails.measuredWeightDetails.data.stoneWeight) *
                obj.itemDetails.totalQuantity
            );
            acc.map[obj.itemDetails.productGroupCode].focItemDetails.push({
              itemCode: obj.itemDetails.itemCode,
              lotNumber: obj.itemDetails.lotNumber
            });
          } else {
            const newObj = Object.assign(
              {},
              {
                productGroupCode: obj.itemDetails.productGroupCode,
                totalDiscount: Number(obj.itemDetails.totalDiscount),
                totalTax: Number(obj.itemDetails.totalTax),
                totalValue: Number(obj.itemDetails.totalValue),
                totalMaterialWeight: Number(
                  obj.itemDetails.measuredWeightDetails.data.materialWeight *
                    obj.itemDetails.totalQuantity
                ),
                totalMetalWeight: Number(
                  (obj.itemDetails.measuredWeightDetails.data.goldWeight +
                    obj.itemDetails.measuredWeightDetails.data.silverWeight +
                    obj.itemDetails.measuredWeightDetails.data.platinumWeight) *
                    obj.itemDetails.totalQuantity
                ),
                totalStoneWeight: Number(
                  (obj.itemDetails.measuredWeightDetails.data.diamondWeight +
                    obj.itemDetails.measuredWeightDetails.data.stoneWeight) *
                    obj.itemDetails.totalQuantity
                ),
                focItemDetails: [
                  {
                    itemCode: obj.itemDetails.itemCode,
                    lotNumber: obj.itemDetails.lotNumber
                  }
                ]
              }
            );
            acc.map[obj.itemDetails.productGroupCode] = newObj;
            acc.data.push(newObj);
          }
          return acc;
        },
        { data: [], map: {} }
      ).data;
      if (loadDetails) {
        if (this.abItemIdList.length !== 0) {
          this.focFacade.loadFocSchemesAndItems({
            payload: { businessDate: this.bussinessDay, purchaseItems: result },
            cashMemoId: this.transactionId,
            abItemIdList: this.abItemIdList
          });
        } else {
          this.focFacade.loadFocSchemesAndItems({
            payload: { businessDate: this.bussinessDay, purchaseItems: result }
          });
        }
      } else {
        if (this.abItemIdList.length !== 0) {
          this.focFacade.loadFocSchemesForItems({
            payload: { businessDate: this.bussinessDay, purchaseItems: result },
            cashMemoId: this.transactionId,
            abItemIdList: this.abItemIdList
          });
        } else {
          this.focFacade.loadFocSchemesForItems({
            payload: { businessDate: this.bussinessDay, purchaseItems: result }
          });
        }
      }
    }
  }
  addFocToCM() {
    const focDetailPayload: AddFocPayload[] = [];

    for (const details of this.focSchemesAndItems) {
      let itemDetails: AddFocPopupPayload[] = [];
      details.focItems.forEach(v => {
        itemDetails = this.selectedFocItems
          .filter(x => {
            return (
              x.itemCode === v.itemCode &&
              x.schemeDetailId === details.schemeDetailId
            );
          })
          .map(item => {
            return {
              employeeCode: this.focSelectedRso,
              // inventoryId: item.inventoryId,
              itemCode: item.itemCode,
              lotNumber: item.lotNumber,
              totalQuantity: item.quantity,
              actualQuantity: item.availableQuantity,
              totalWeight: Number(item.actualWeight),
              unitWeight: Number(item.unitWeight)
            };
          });
        if (itemDetails.length > 0) {
          focDetailPayload.push({
            focItemDetails: itemDetails,
            focScheme: {
              eligibleFocItemDetails: { focItems: details.focItems },
              purchaseItemDetails: {
                purchaseItems: details.purchaseItems
              },
              schemeDetailIds: [details.schemeDetailId],
              schemeId: details.schemeId,
              schemeName: details.schemeName,
              schemeCategory: details.schemeCategory
            }
          });
        }
        this.selectedFocItems = this.selectedFocItems.filter(x => {
          return !(
            x.itemCode === v.itemCode &&
            x.schemeDetailId === details.schemeDetailId
          );
        });
      });
    }
    const payload: AddFocToCMPayload = {
      id: this.cashMemoId,
      txnType: this.transactionType,
      subTxnType: this.subTransactionType,
      focDetails: focDetailPayload
    };

    return payload;
  }
  keepFocPending(): KeepFocPendingPayload {
    const focDetailPayload: KeepFocPending[] = [];

    for (const details of this.focSchemesAndItems) {
      focDetailPayload.push({
        eligibleFocItemDetails: { focItems: details.focItems },
        purchaseItemDetails: {
          purchaseItems: details.purchaseItems
        },
        schemeDetailIds: [details.schemeDetailId],
        schemeId: details.schemeId,
        schemeName: details.schemeName,
        schemeCategory: details.schemeCategory
      });
    }
    const payload: KeepFocPendingPayload = {
      id: this.cashMemoId,
      txnType: this.transactionType,
      subTxnType: this.subTransactionType,
      focSchemes: focDetailPayload
    };

    return payload;
  }
  loadFocItemDetails() {
    const eligibleFocItemsList = [];
    for (const scheme of this.focSchemesAndItems) {
      for (const item of scheme.focItems) {
        eligibleFocItemsList.push(item.itemCode);
      }
    }
    this.focFacade.loadFocItemDetails({ itemsCodes: eligibleFocItemsList });
  }

  loadManualFocItemDetails() {
    this.manualFocSelectedRso = null;
    const eligibleManualFocItemsList = [];
    for (const focItems of this.manualFocSchemesAndItems) {
      for (const item of focItems.focItems) {
        eligibleManualFocItemsList.push(item.itemCode);
      }
    }
    this.focFacade.loadManualFocItemDetails({
      itemsCodes: eligibleManualFocItemsList
    });
  }
  loadFocPopupData() {
    if (
      this.focSchemesAndItems.length === 1 &&
      this.focItemDetails.length === 1
    ) {
      const payload = this.autoSelectFOCItems();
      if (payload.focDetails.length) {
        this.focFacade.addFocToCm(payload);
      } else {
        this.focFacade.keepFocPending(this.keepFocPending());
      }
    } else {
      this.focPopupData = [];
      for (let i = 0; i < this.focSchemesAndItems.length; i++) {
        let details = this.focItemDetails;
        let inventoryDetails = [];
        let focDetails = null;
        this.focSchemesAndItems[i].focItems.forEach(v => {
          focDetails = v;
          inventoryDetails = details
            .filter(x => {
              return x.itemCode === v.itemCode;
            })
            .concat(...inventoryDetails);
          details = details.filter(x => x.itemCode !== v.itemCode);
        });

        if (inventoryDetails.length > 0) {
          this.totalFocWeightItems = 0;
          for (const inventory of inventoryDetails) {
            const totalWtOfItem =
              inventory.availableQuantity * inventory.unitWeight;
            this.totalFocWeightItems = this.totalFocWeightItems + totalWtOfItem;
          }

          if (this.totalFocWeightItems > focDetails.weight) {
            this.keepFOCPending = false;
          } else {
            this.keepFOCPending = true;
          }
        } else {
          this.keepFOCPending = true;
        }

        this.focPopupData.push({
          inventoryFocItemList: inventoryDetails ? inventoryDetails : null,
          otherFocDetails: focDetails,
          purchaseItems: this.focSchemesAndItems[i].purchaseItems,
          schemeDetailId: this.focSchemesAndItems[i].schemeDetailId,
          schemeId: this.focSchemesAndItems[i].schemeId,
          schemeName: this.focSchemesAndItems[i].schemeName,
          salesTxnId: null,
          isStockAvailable: inventoryDetails.length > 0 ? true : false
        });
      }
      this.focPopupData$.next(this.focPopupData);
    }
  }
  loadManualFocPopupData() {
    this.manualFocPopUpData = [];
    for (let i = 0; i < this.manualFocSchemesAndItems.length; i++) {
      let details = this.manualFocItemDetails;
      let inventoryDetails = [];
      let manualFocDetails = null;
      this.manualFocSchemesAndItems[i].focItems.forEach(v => {
        manualFocDetails = v;

        inventoryDetails = this.manualFocItemDetails
          .filter(x => {
            return x.itemCode === v.itemCode;
          })
          .concat(...inventoryDetails);

        if (v.quantity !== null && v.quantity !== undefined) {
          inventoryDetails = inventoryDetails.map(x => {
            if (x.itemCode === v.itemCode) {
              return (x = { ...x, availbleQty: v.quantity });
            }
          });
        }

        details = details.filter(x => x.itemCode !== v.itemCode);
      });
      const configDetails = JSON.parse(
        this.manualFocSchemesAndItems[i].configDetails
      );

      this.manualFocPopUpData.push({
        inventoryManualFocItemList: inventoryDetails ? inventoryDetails : null,
        otherFocDetails: manualFocDetails,
        schemeId: this.manualFocSchemesAndItems[i].schemeId,
        schemeName: this.manualFocSchemesAndItems[i].schemeName,
        manualFOCStartDate: this.manualFocSchemesAndItems[i].manualFOCStartDate,
        manualFOCEndDate: this.manualFocSchemesAndItems[i].manualFOCEndDate,
        salesTxnId: null,
        currentFiscalYear: this.currentFiscalYear,
        currentLocationCode: this.locationCode,
        isStockAvailable: inventoryDetails.length > 0 ? true : false,
        isCMMandatory: configDetails.data.isCMNumber
      });
    }
    this.manualFocPopupData$.next(this.manualFocPopUpData);
  }

  sendFocProductToGrid(items: AddFocToCmResponsePayload[]) {
    this.productType = ProductTypesEnum.FOC;
    const productDataToGrid: ProductDetailsInGrid[] = [];
    for (const item of items) {
      productDataToGrid.push({
        itemCode: item.itemCode,
        binCode: item.binCode,
        description: '(FOC)',
        selectedLotNumber: item.lotNumber,
        availableLotNumbers: [],
        unitWeight: item.unitWeight,
        actualWeight: item.totalWeight,
        selectedRso: item.employeeCode === null ? selectRSO : item.employeeCode,
        availableRso: this.rsoDetails,
        pricePerUnit: 0,
        discount: 0,
        finalPrice: 0,
        priceBreakUp: null,
        productDetails: {
          binCode: item.binCode,
          inventoryId: item.inventoryId,
          lotNumber: item.lotNumber,
          karatage: 0,
          quantity: item.totalQuantity,
          actualWeight: item.totalWeight,
          unitWeight: item.unitWeight,
          productCategoryCode: null,
          productCategoryDescription: null,
          productGroupCode: null,
          productGroupDescription: null,
          inventoryWeightDetails: null,
          itemCode: item.itemCode,
          imageUrl: null,
          itemDescription: null,
          binGroupCode: null
        },
        inventoryId: item.inventoryId,
        itemId: item.id,
        productType: ProductTypesEnum.FOC,
        isAdd: true,
        remarks: null,
        availableReasons: [],
        selectedReason: null,
        priceDetails: null,
        quantity: item.totalQuantity,
        taxDetails: null,
        stdWeight: null,
        karatage: null,
        productCatergory: null,
        productGroup: null,
        status: null,
        totalQuantity: null,
        subTxnType: null,
        hmQuantity: 0,
        isFOCForHallmarkingCharges: false,
        isHallmarked: false,
        rowId: this.rowId + item.rowId,
        isManualFOC: item.isManualFOC,
        focSchemeDetails: item.schemeDetails,
        productGroupList: item.productGroupList
      });
    }
    this.product = productDataToGrid;
    this.addStopTracking('pw.instrumentationMessges.addFocFromPopupMsg');
  }
  deleteFocItems() {
    this.focFacade.deleteFoc({
      id: this.cashMemoId,
      txnType: this.transactionType,
      subTxnType: this.subTransactionType
    });
  }

  deleteManualFocItems() {
    this.focFacade.deleteManualFoc({
      id: this.cashMemoId,
      txnType: this.transactionType,
      subTxnType: this.subTransactionType
    });
  }
  showPendingFocSuccessMessageNotification() {
    const pendingFocSuccessMsgKey = 'pw.regularCashMemo.pendingFocSuccessMsg';
    this.translate
      .get(pendingFocSuccessMsgKey)
      .pipe(take(1))
      .subscribe((translatedMsg: any) => {
        this.overlayNotification.show({
          type: OverlayNotificationType.SUCCESS,
          hasClose: true,
          message: translatedMsg
        });
      });
  }
  showNoFocForSelectedItemNotification() {
    const pendingFocSuccessMsgKey = 'pw.regularCashMemo.pendingFocSuccessMsg';
    this.translate
      .get(pendingFocSuccessMsgKey)
      .pipe(take(1))
      .subscribe((translatedMsg: any) => {
        this.overlayNotification.show({
          type: OverlayNotificationType.SIMPLE,
          hasClose: true,
          message: 'No FOC schemes available for selected Products'
        });
      });
  }

  showNoManualFocForSelectedItemNotification() {
    const pendingFocSuccessMsgKey = 'pw.regularCashMemo.pendingFocSuccessMsg';
    this.translate
      .get(pendingFocSuccessMsgKey)
      .pipe(take(1))
      .subscribe((translatedMsg: any) => {
        this.overlayNotification.show({
          type: OverlayNotificationType.SIMPLE,
          hasClose: true,
          message: 'No Manual FOC Available for Selected Customer'
        });
      });
  }
  showNoFocItemsSelectedNotification() {
    const pendingFocSuccessMsgKey = 'pw.regularCashMemo.pendingFocSuccessMsg';
    this.translate
      .get(pendingFocSuccessMsgKey)
      .pipe(take(1))
      .subscribe((translatedMsg: any) => {
        this.overlayNotification.show({
          type: OverlayNotificationType.SIMPLE,
          hasClose: true,
          message: 'No FOC Items Selected'
        });
      });
  }
  showFocPopup(data: any) {
    let isOutOfStock = false;
    if (data && data.length === 0) {
      this.showNoFocForSelectedItemNotification();
    } else if (data && data.length > 0) {
      const array = this.focPopupData.every(e => {
        if (e.inventoryFocItemList.length === 0) {
          isOutOfStock = true;
          return false;
        }
        return true;
      });
      if (isOutOfStock) {
        this.dialog
          .open(FocOutOfStockComponent, {
            width: '420px',
            data: { isManualFoc: false }
          })
          .afterClosed()
          .pipe(takeUntil(this.destroy$))
          .subscribe(res => {
            if (res) {
              this.focFacade.keepFocPending(this.keepFocPending());
            }
          });
      } else {
        this.openFocPopup();
      }
    }
  }

  showManualFocPopup(data: any) {
    let isOutOfStock = false;
    if (data && data.length === 0) {
      this.showNoManualFocForSelectedItemNotification();
    } else if (data && data.length > 0) {
      const array = this.manualFocPopUpData.every(e => {
        if (e.inventoryManualFocItemList.length === 0) {
          isOutOfStock = true;
          return false;
        }
        return true;
      });
      if (isOutOfStock) {
        this.dialog
          .open(FocOutOfStockComponent, {
            width: '420px',
            data: { isManualFoc: true }
          })
          .afterClosed()
          .pipe(takeUntil(this.destroy$))
          .subscribe(res => {
            if (res) {
            }
          });
      } else {
        this.openManualFocPopup();
      }
    }
  }
  loadAssignedFOC() {
    if (this.activatedRoute.snapshot.params['_id'] !== 'new') {
      if (this.transactionType === TransactionTypeEnum.CM && this.cashMemoId) {
        this.focFacade.getFocAssignedToCM({
          id: this.cashMemoId,
          txnType: this.transactionType,
          subTxnType: this.subTransactionType
        });
      }
    }
  }

  loadAssignedManualFOC() {
    if (this.activatedRoute.snapshot.params['_id'] !== 'new') {
      if (this.transactionType === TransactionTypeEnum.CM && this.cashMemoId) {
        this.focFacade.getManualFocAssignedToCM({
          id: this.cashMemoId,
          txnType: this.transactionType,
          subTxnType: this.subTransactionType
        });
      }
    }
  }
  openFocPopup() {
    this.dialog
      .open(AddFocPopupComponent, {
        width: '835px',
        maxWidth: '90vw',
        data: {
          focData: this.focPopupData,
          isPendingRequired: this.keepFOCPending,
          rsoNames: this.rsoDetails.filter(e => e.code !== selectRSO),
          selectedRso: this.focSelectedRso
        },
        disableClose: true
      })
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (res) {
          if (res.type === 'pendingFOC') {
            this.focFacade.keepFocPending(this.keepFocPending());
          } else if (res.type === 'addFoc') {
            this.focSelectedRso = res.data.value.rsoName;
            this.focParentForm = res.data.value.parentForm;

            for (const itemForm of this.focParentForm) {
              for (const item of itemForm.inventoryFocItemList) {
                if (item.isSelected && item.quantity > 0) {
                  this.selectedFocItems.push(item);
                }
              }
            }
            const payload = this.addFocToCM();
            if (payload.focDetails.length) {
              this.focFacade.addFocToCm(payload);
            } else {
              this.showNoFocItemsSelectedNotification();
            }
          } else if (res.type === 'showAlert') {
            this.focPopupData = res.data.parentForm;
            this.focSelectedRso = res.data.rsoName;
            this.dialog
              .open(AddFocAlertPopupComponent, {
                width: '420px'
              })
              .afterClosed()
              .pipe(takeUntil(this.destroy$))
              .subscribe(response => {
                this.openFocPopup();
              });
          }
        }
      });
  }

  // select FOC Items automatically if only one item is there for selection
  autoSelectFOCItems() {
    this.selectedRSONames = [];
    this.selectedItemsDetails.forEach(element => {
      if (element.itemDetails.employeeCode !== null)
        this.selectedRSONames.push(element.itemDetails.employeeCode);
    });

    const focDetailPayload: AddFocPayload[] = [];
    let addFocToCMpayload: AddFocToCMPayload;
    let totalEligibleFOCWeight = 0;
    let totalQtyOfItemNeeded = 0;
    const unitWeightOfItem = this.focItemDetails[0].unitWeight;
    if (this.focSchemesAndItems[0].focItems[0].weight) {
      totalEligibleFOCWeight = this.focSchemesAndItems[0].focItems[0].weight;
      totalQtyOfItemNeeded = Number(
        Math.round(totalEligibleFOCWeight / unitWeightOfItem)
      );
    } else if (this.focSchemesAndItems[0].focItems[0].quantity) {
      totalQtyOfItemNeeded = this.focSchemesAndItems[0].focItems[0].quantity;
      totalEligibleFOCWeight = this.weightRoundOff(
        unitWeightOfItem * totalQtyOfItemNeeded
      );
    }

    const totalAvailableQtyOfItem = this.focItemDetails[0].availableQuantity;
    const selectedRSOName = this.getMaximumSelectedRSO(this.selectedRSONames);

    totalQtyOfItemNeeded = Number(
      Math.round(totalEligibleFOCWeight / unitWeightOfItem)
    );

    if (totalAvailableQtyOfItem >= totalQtyOfItemNeeded) {
      for (const details of this.focSchemesAndItems) {
        let itemDetails: AddFocPopupPayload[] = [];
        itemDetails = [
          {
            employeeCode: selectedRSOName,
            // inventoryId: this.focItemDetails[0].inventoryId,
            itemCode: this.focItemDetails[0].itemCode,
            lotNumber: this.focItemDetails[0].lotNumber,
            totalQuantity: totalQtyOfItemNeeded,
            actualQuantity: this.focItemDetails[0].availableQuantity,
            totalWeight: Number(totalEligibleFOCWeight),
            unitWeight: Number(unitWeightOfItem)
          }
        ];
        if (itemDetails.length > 0) {
          focDetailPayload.push({
            focItemDetails: itemDetails,
            focScheme: {
              eligibleFocItemDetails: { focItems: details.focItems },
              purchaseItemDetails: {
                purchaseItems: details.purchaseItems
              },
              schemeDetailIds: [details.schemeDetailId],
              schemeId: details.schemeId,
              schemeName: details.schemeName,
              schemeCategory: details.schemeCategory
            }
          });
        }
      }
      addFocToCMpayload = {
        id: this.cashMemoId,
        txnType: this.transactionType,
        subTxnType: this.subTransactionType,
        focDetails: focDetailPayload
      };
    } else {
      // keep foc pending
      addFocToCMpayload = {
        id: this.cashMemoId,
        txnType: this.transactionType,
        subTxnType: this.subTransactionType,
        focDetails: []
      };
    }

    return addFocToCMpayload;
  }

  // if FOC Items are auto selected, then pick the maximum selected RSO from grid or
  getMaximumSelectedRSO(selectedRSOArray) {
    return selectedRSOArray
      .sort(
        (a, b) =>
          selectedRSOArray.filter(v => v === a).length -
          selectedRSOArray.filter(v => v === b).length
      )
      .pop();
  }

  resetLotNumber() {
    this.resetLotNumber$.next(this.editedItemEvent);
  }

  discountPopupOpened() {
    this.isAddItem = false;
    this.isUpdateItem = false;
    this.isAddAllItem = false;
    this.isUpdateSingleAutoDiscount = false;
  }

  calculateDiscountValuesAfterUpdate(responseData) {
    if (responseData.discountDetails.length) {
      const clubbedDiscountId =
        responseData.discountDetails[0]?.clubbedDiscountId;
      const discountId = responseData.discountDetails[0]?.discountId;
      let appliedRivaahGhsDiscForCalculate = null;
      responseData.discountDetails.forEach(element => {
        if (
          element.discountType === DiscountTypeEnum.RIVAAH_ASHIRWAAD_DISCOUNT
        ) {
          appliedRivaahGhsDiscForCalculate =
            element?.txnLevelDiscountValueDetails?.data;
        }
      });

      this.discountFacade.loadItemLevelDiscountsDetails({
        requestBody: {
          businessDate: this.bussinessDay,
          itemDetails: {
            itemCode: responseData.itemDetails.itemCode,
            lotNumber: responseData.itemDetails.lotNumber,
            productCategoryCode: responseData.itemDetails.productCategoryCode,
            productGroupCode: responseData.itemDetails.productGroupCode,
            priceDetails: responseData.itemDetails.priceDetails,
            totalQuantity: responseData.itemDetails.totalQuantity,
            totalValue: responseData.itemDetails.totalValue,
            totalWeight: responseData.itemDetails.totalWeight,
            netWeight: responseData.itemDetails.priceDetails.netWeight,
            totalTax: responseData.itemDetails.totalTax
          },
          customerDetails: {
            enrollmentDate: this.enrolmentDate,
            ulpId: this.ulpID
          },
          transactionDetails: {
            transactionType: responseData.txnType,
            subTransactionType: responseData.subTxnType,
            isFrozenRate: this.frozenAB
          },
          eligibleRivaahGhsDetails: appliedRivaahGhsDiscForCalculate
            ? appliedRivaahGhsDiscForCalculate
            : null
        },
        discountId: clubbedDiscountId === null ? discountId : null,
        discountClubId: clubbedDiscountId,
        existingDiscounts: responseData.discountDetails,
        data: responseData
      });
    } else {
      this.isUpdateItem = false;
    }
  }

  encircleAlert(addedEncircle) {
    if (addedEncircle) {
      if (this.isABInvokedFirstTime && this.showEncircleAlert) {
        this.alertPopupService
          .open({
            type: AlertPopupTypeEnum.CONFIRM,
            message: this.isABDiscountsSelected
              ? 'pw.productGrid.encircleEligibleMsg'
              : 'pw.productGrid.encircleEligibleMsg1',
            extraMessage: this.isABDiscountsSelected
              ? 'pw.productGrid.encircleEligibleMsg2'
              : null,
            extraMessage1: this.isABDiscountsSelected
              ? 'pw.productGrid.encircleEligibleMsg3'
              : null
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe((res: boolean) => {
            this.showEncircleAlert = false;
            if (res === true) {
              this.isAddAllItem = true;
              this.tempRowNumber = -1;
              this.itemDetails.forEach(data => {
                this.getAutoDiscounts(data);
              });
            }
          });
      } else {
        this.isAddAllItem = true;
        this.tempRowNumber = -1;
        this.itemDetails.forEach(data => {
          this.getAutoDiscounts(data);
        });
      }
    }
  }

  updateEncircleOrNot(discounts) {
    if (this.addedEncircle !== null && this.addedEncircle !== undefined) {
      for (const element of discounts) {
        if (
          element.discountType === DiscountTypeEnum.ULP_ANNIVERSARY ||
          element.discountType === DiscountTypeEnum.ULP_BIRTHDAY ||
          element.discountType === DiscountTypeEnum.ULP_SPOUSE_BIRTHDAY
        ) {
          return true;
        }
      }
      return false;
    }
    return true;
  }

  totalItemsInProductGrid(event) {
    this.totalNoOfItemsInProductGrid = event;
  }

  // AB FOC
  addABFocScheme(loadDetails: boolean) {
    this.focFacade.clearABFocSchemes();
    this.focSelectedRso = null;
    if (this.isRsoSelected === false && loadDetails === true) {
      this.showNotifications('pw.productGrid.rsoNotSelectedMsg');
    } else {
      this.selectedFocItems = [];
      const result = this.selectedItemsDetails.reduce(
        (acc, obj) => {
          if (acc.map.hasOwnProperty(obj.itemDetails.productGroupCode)) {
            acc.map[obj.itemDetails.productGroupCode].totalDiscount += Number(
              obj.totalDiscount
            );
            acc.map[obj.itemDetails.productGroupCode].totalTax += Number(
              obj.itemDetails.totalTax
            );
            acc.map[obj.itemDetails.productGroupCode].totalValue += Number(
              obj.itemDetails.totalValue
            );
            acc.map[
              obj.itemDetails.productGroupCode
            ].totalMaterialWeight += Number(
              obj.itemDetails.inventoryWeightDetails?.data?.materialWeight *
                obj.itemDetails.totalQuantity
            );
            acc.map[
              obj.itemDetails.productGroupCode
            ].totalMetalWeight += Number(
              (obj.itemDetails.inventoryWeightDetails?.data?.goldWeight +
                obj.itemDetails.inventoryWeightDetails?.data?.silverWeight +
                obj.itemDetails.inventoryWeightDetails?.data?.platinumWeight) *
                obj.itemDetails.totalQuantity
            );
            acc.map[
              obj.itemDetails.productGroupCode
            ].totalStoneWeight += Number(
              (obj.itemDetails.inventoryWeightDetails?.data?.diamondWeight +
                obj.itemDetails.inventoryWeightDetails?.data?.stoneWeight) *
                obj.itemDetails.totalQuantity
            );
            acc.map[obj.itemDetails.productGroupCode].focItemDetails.push({
              itemCode: obj.itemDetails.itemCode,
              lotNumber: obj.itemDetails.lotNumber
            });
          } else {
            const newObj = Object.assign(
              {},
              {
                productGroupCode: obj.itemDetails.productGroupCode,
                totalDiscount: Number(obj.itemDetails.totalDiscount),
                totalTax: Number(obj.itemDetails.totalTax),
                totalValue: Number(obj.itemDetails.totalValue),
                totalMaterialWeight: Number(
                  obj.itemDetails.inventoryWeightDetails?.data?.materialWeight *
                    obj.itemDetails.totalQuantity
                ),
                totalMetalWeight: Number(
                  (obj.itemDetails.inventoryWeightDetails?.data?.goldWeight +
                    obj.itemDetails.inventoryWeightDetails?.data?.silverWeight +
                    obj.itemDetails.inventoryWeightDetails?.data
                      ?.platinumWeight) *
                    obj.itemDetails.totalQuantity
                ),
                totalStoneWeight: Number(
                  (obj.itemDetails?.inventoryWeightDetails?.data
                    ?.diamondWeight +
                    obj.itemDetails?.inventoryWeightDetails?.data
                      ?.stoneWeight) *
                    obj.itemDetails.totalQuantity
                ),
                focItemDetails: [
                  {
                    itemCode: obj.itemDetails.itemCode,
                    lotNumber: obj.itemDetails.lotNumber
                  }
                ]
              }
            );
            acc.map[obj.itemDetails.productGroupCode] = newObj;
            acc.data.push(newObj);
          }
          return acc;
        },
        { data: [], map: {} }
      ).data;

      if (loadDetails) {
        this.focFacade.loadABFocSchemes({
          payload: {
            businessDate: this.bussinessDay,
            isFrozen: this.frozenAB,
            purchaseItems: result
          }
        });
        this.focFacade.loadSelectedABFocSchemes({
          id: this.transactionId,
          txnType: this.transactionType,
          subTxnType: this.subTransactionType
        });
      } else {
        this.focFacade.loadABFocSchemesForItems({
          payload: {
            businessDate: this.bussinessDay,
            isFrozen: this.frozenAB,
            purchaseItems: result
          }
        });
        this.focFacade.loadSelectedABFocSchemesCount({
          id: this.transactionId,
          txnType: this.transactionType,
          subTxnType: this.subTransactionType
        });
      }
    }
  }

  ABFOCPopup(
    focData: FocSchemeDetailsDto[],
    selectedFOCData: ABFocSchemeDetailsDto[]
  ) {
    this.dialog.closeAll();
    const dialogRef = this.dialog.open(AbFocPopupComponent, {
      width: '835px',
      maxWidth: '90vw',
      data: {
        allAbFoc: focData,
        selectedAbFoc: selectedFOCData,
        headerLabel: 'pw.productGrid.addFOCSchemeHeaderLabel',
        searchLabel: 'pw.productGrid.searchbyFOCWeightLabel',
        schemeNameLabel: 'pw.productGrid.schemeNameLabel',
        eligibleWeightLabel: 'pw.productGrid.eligibleWeightLabel',
        emptySchemeNameMessage: 'pw.productGrid.emptySchemeNameMessage'
      },
      disableClose: true
    });

    dialogRef.componentInstance.onAdd.subscribe(data => {
      this.saveABFOCData(data);
    });
  }

  saveABFOCData(data) {
    let focScheme = [];
    if (data.addedAbFocs.length) {
      data.addedAbFocs.forEach(element => {
        focScheme.push({
          purchaseItemDetails: {
            purchaseItems: element.purchaseItems
          },
          schemeCategory: element.schemeCategory,
          schemeDetailIds: element.schemeDetailId,
          schemeId: element.schemeId,
          schemeName: element.schemeName,
          weight: element.weight
        });
      });

      this.focFacade.saveABFocSchemes({
        id: this.transactionId,
        txnType: this.transactionType,
        subTxnType: this.subTransactionType,
        requestPayload: { focScheme: focScheme }
      });
    }

    if (data.removeAbFocs.length) {
      const removeIds: string[] = data.removeAbFocs.map(data => data.id);
      this.focFacade.deleteABFocSchemes({
        id: this.transactionId,
        txnType: this.transactionType,
        subTxnType: this.subTransactionType,
        focSchemeId: removeIds
      });
    }
  }

  showTimerNotifications(key) {
    this.translate
      .get(key)
      .pipe(take(1))
      .subscribe((translatedMsg: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.TIMER,
            message: translatedMsg,
            hasClose: false,
            hasBackdrop: true
          })
          .events.pipe(take(1))
          .subscribe();
      });
  }
  //Manual FOC
  loadManualFoc() {
    if (this.customerMobileNumber) {
      this.focFacade.loadManualFocItems(this.customerMobileNumber);
    } else {
      this.focFacade.loadManualFocItems(null);
    }
  }

  openManualFocPopup() {
    const ref = this.dialog.open(AddManualFocPopupComponent, {
      width: '835px',
      maxWidth: '90vw',
      data: {
        manualFocData: this.manualFocPopUpData,
        manualFocValidationDetails$: this.manualFocValidationDetails$,
        rsoNames: this.rsoDetails.filter(e => e.code !== selectRSO),
        selectedRso: this.manualFocSelectedRso,
        unitWeight: weightCode
      },
      disableClose: true
    });
    ref.componentInstance.validateManualFoc
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: ValidateManualFocPayload) => {
        if (data) {
          data.mobileNumber = this.customerMobileNumber;
          this.focFacade.validateManualFoc(data);
        }
      });

    ref
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        this.focFacade.clearValidatedManualFoc();
        if (res) {
          if (res.type === 'addManualFoc') {
            this.manualFocSelectedRso = res.data.value.rsoName;
            this.manualFocParentForm = res.data.value.parentForm;
            for (const itemForm of this.manualFocParentForm) {
              for (const item of itemForm.inventoryManualFocItemList) {
                if (item.isSelected && item.quantity > 0) {
                  this.selectedManualFocItems.push(item);
                }
              }
            }
            const payload = this.addManualFocToCM(res.data.approvedBy);
            if (payload.focDetails.length) {
              this.focFacade.addManualFocToCm(payload);
            } else {
              this.showNoFocItemsSelectedNotification();
            }
          } else if (res.type === 'showAlert') {
            this.focPopupData = res.data.parentForm;
            this.manualFocSelectedRso = res.data.rsoName;
            this.dialog
              .open(AddFocAlertPopupComponent, {
                width: '420px'
              })
              .afterClosed()
              .pipe(takeUntil(this.destroy$))
              .subscribe(response => {
                this.openFocPopup();
              });
          }
        }
      });
  }

  addManualFocToCM(approvedBy) {
    const manualFocDetailPayload: AddManualFocPayload[] = [];

    for (const details of this.manualFocSchemesAndItems) {
      let itemDetails: AddFocPopupPayload[] = [];
      details.focItems.forEach(v => {
        itemDetails = this.selectedManualFocItems
          .filter(x => {
            return x.itemCode === v.itemCode;
          })
          .map(item => {
            return {
              employeeCode: this.manualFocSelectedRso,
              // inventoryId: item.inventoryId,
              itemCode: item.itemCode,
              lotNumber: item.lotNumber,
              totalQuantity: item.quantity,
              actualQuantity: item.availableQuantity,
              totalWeight: Number(item.actualWeight),
              unitWeight: Number(item.unitWeight)
            };
          });
        if (itemDetails.length > 0) {
          manualFocDetailPayload.push({
            focItemDetails: itemDetails,
            focScheme: {
              eligibleFocItemDetails: { focItems: details.focItems },

              schemeId: details.schemeId,
              schemeName: details.schemeName
            }
          });
        }
        this.selectedManualFocItems = this.selectedManualFocItems.filter(x => {
          return !(x.itemCode === v.itemCode);
        });
      });
    }
    const payload: AddManualFocToCMPayload = {
      id: this.cashMemoId,
      txnType: this.transactionType,
      subTxnType: this.subTransactionType,
      focDetails: manualFocDetailPayload,
      approvedBy: approvedBy,
      manualFocStartDate: this.manualFocSchemesAndItems[0].manualFOCStartDate,
      manualFocEndDate: this.manualFocSchemesAndItems[0].manualFOCEndDate
    };

    return payload;
  }

  openAddCNPopup() {
    if (
      this.subTransactionType === SubTransactionTypeEnum.NEW_AB &&
      this.frozenAB === false
    ) {
      this.alertPopupService.open({
        type: AlertPopupTypeEnum.INFO,
        message: this.grfCNErrorMsg1
      });
    } else {
      const dialogRef = this.dialog.open(AddCnPopupComponent, {
        width: '60vw',
        disableClose: true,
        data: {
          isGRFAllowedCM: this.isGRFAllowedCM,
          isGRNAllowedCM: this.isGRNAllowedCM,
          isGrnAllowedInAdvanceBooking: this.isGrnAllowedInAdvanceBooking,
          isGRFAllowedAB: this.isGRFAllowedAB,
          subTransactionType: this.subTransactionType
        }
      });
      dialogRef.componentInstance.cnTypeChange
        .pipe(takeUntil(this.destroy$))
        .subscribe(data => {
          const payload: CNDetailsRequestPayload = {
            customerId: this.customerId,
            cnType: data,
            isFrozenRateCnRequired: true,
            isPageable: false
          };
          this.productFacade.loadCreditNoteDetailsByCNType(payload);
          this.productFacade
            .getCNDetailsByCNType()
            .pipe(takeUntil(this.destroy$))
            .subscribe(cnTypeData => {
              if (dialogRef.componentInstance) {
                dialogRef.componentInstance.cnDetailsList = cnTypeData;
                let cnNumberList = [];
                cnTypeData?.forEach(info => {
                  if (info.status === 'OPEN') {
                    cnNumberList.push({
                      value: info.docNo,
                      description: info.docNo
                    });
                  }
                });
                dialogRef.componentInstance.cnNumbersList = cnNumberList;
              }
            });
        });
      dialogRef.componentInstance.cnUpdate
        .pipe(takeUntil(this.destroy$))
        .subscribe(selectedCnDetails => {
          selectedCnDetails.minAmount = this.getminiUtilization(
            selectedCnDetails.amount,
            selectedCnDetails.creditNoteType
          );
          // if (selectedCnDetails.creditNoteType === CreditNoteType.ADV) {
          if (selectedCnDetails.productType === ProductTypesEnum.PLAIN) {
            selectedCnDetails.weightTolerance = this.mapWeightTolerance(
              selectedCnDetails.goldWeight,
              selectedCnDetails.creditNoteType
            );
          } else if (
            selectedCnDetails.productType === ProductTypesEnum.STUDDED
          ) {
            selectedCnDetails.valueTolerance = this.mapValueTolerance(
              selectedCnDetails.amount,
              selectedCnDetails.creditNoteType
            );
          }
          // }
          dialogRef.componentInstance.selectedCnDetails = selectedCnDetails;
        });
      dialogRef.componentInstance.cnAdd
        .pipe(takeUntil(this.destroy$))
        .subscribe(res => {
          const payload = new CreditNotePayment(
            this.getPaymetGroup(PaymentModeEnum.CREDIT_NOTE),
            res
          );
          this.paymentFacade.loadSelectedCreditNotePaymentToBeAdded(payload);
          this.paymentFacade.addCreditNotePayment({
            transactionType: this.transactionType,
            subTransactionType: this.subTransactionType,
            transactionId: this.transactionId,
            paymentDetails: payload
          });
        });
    }
  }

  removeCN() {
    this.paymentFacade.deletePayment(
      {
        transactionType: this.transactionType,
        subTransactionType: this.subTransactionType,
        paymentId: this.cnPaymentDetails.id
      },
      this.cnPaymentDetails
    );
  }

  viewCNDetails() {
    this.dialog.open(ViewCnPopupComponent, {
      width: '60vw',
      data: this.mapCnData(),
      disableClose: true
    });
  }

  mapCnData() {
    return {
      creditNoteType: this.cnPaymentDetails.instrumentType,
      docNo: Number(this.cnPaymentDetails.instrumentNo),
      amount: this.cnPaymentDetails.amount,
      goldWeight: this.cnPaymentDetails.otherDetails.data?.frozenRateDetails
        ?.weight,
      goldRateAmount: this.cnPaymentDetails.otherDetails.data?.frozenRateDetails
        ?.ratePerUnit,
      minAmount: this.getminiUtilization(
        this.cnPaymentDetails.amount,
        this.cnPaymentDetails.instrumentType
      ),
      weightTolerance: this.mapWeightTolerance(
        this.cnPaymentDetails.otherDetails.data?.frozenRateDetails?.weight,
        this.cnPaymentDetails.instrumentType
      ),
      valueTolerance: this.mapValueTolerance(
        this.cnPaymentDetails.amount,
        this.cnPaymentDetails.instrumentType
      ),
      productType: this.cnPaymentDetails.otherDetails.data.allowedCategory
    };
  }

  getminiUtilization(data, cnType) {
    if (cnType === CreditNoteType.ADV) {
      return (data * this.minimumGRFUtilization) / 100;
    } else if (cnType === CreditNoteType.GRN) {
      return (data * this.minimumGRNUtilization) / 100;
    }
  }

  mapWeightTolerance(weight, cnType) {
    let tolerance;

    if (
      cnType === CreditNoteType.ADV &&
      this.grfToleranceDetails &&
      this.grfToleranceDetails.weightBased
    ) {
      tolerance = this.grfToleranceDetails.weightBased.find(
        x => weight >= x.fromRange && weight <= x.toRange
      );
    } else if (
      cnType === CreditNoteType.GRN &&
      this.grnToleranceDetails &&
      this.grnToleranceDetails.weightBased
    ) {
      tolerance = this.grnToleranceDetails.weightBased.find(
        x => weight >= x.fromRange && weight <= x.toRange
      );
    }

    if (tolerance) {
      return tolerance.toleranceValue;
    } else {
      return 0;
    }
  }

  mapValueTolerance(value, cnType) {
    let tolerance;
    if (cnType === CreditNoteType.ADV) {
      tolerance = this.grfToleranceDetails.valueBased.find(
        x => value >= x.fromRange && value <= x.toRange
      );
    } else if (cnType === CreditNoteType.GRN) {
      tolerance = this.grnToleranceDetails.valueBased.find(
        x => value >= x.fromRange && value <= x.toRange
      );
    }

    if (tolerance) {
      return (value * tolerance.tolerancePercent) / 100;
    } else {
      return 0;
    }
  }

  getPaymetGroup(paymentMode: PaymentModeEnum) {
    return this.allowedPayments.get(paymentMode);
  }

  // popup to select lot number to add item to grid
  openLotNumberSelection(productDetails, availableLotNumbers) {
    this.dialog.closeAll();
    const dialogRef = this.dialog.open(LotNumberSelectionPopupComponent, {
      width: '500px',
      height: 'auto',
      data: {
        availableLotNumbers: availableLotNumbers,
        productDetails: productDetails
      },
      disableClose: true
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result.data) {
          let productDetail = result.data[0];
          this.addStopTracking('pw.instrumentationMessges.loadItemDetailsMsg');
          if (productDetail.productGroupCode === this.coinCode) {
            this.productFacade.loadValidateProductAndPriceDetails({
              inventoryId: productDetail.inventoryId,
              orderPriceRequest: {
                checkInventory: true,
                itemCode: productDetail.itemCode,
                lotNumber: productDetail.lotNumber,
                inventoryId: productDetail.inventoryId,
                standardPrice: this.standardPrice,
                // measuredQuantity: productDetail.totalQuantity,
                // measuredWeight:
                //   productDetail.unitWeight * productDetail.totalQuantity
                measuredQuantity: 1,
                measuredWeight: productDetail.unitWeight
              },
              productDetails: productDetail,
              availableLotNumbers: availableLotNumbers,
              txnDetails: {
                id: this.cashMemoId,
                txnType: this.transactionType,
                subTxnType: this.subTransactionType
              },
              isABInvoked: this.isABInvoked
            });
          } else {
            this.addStartTracking(
              'pw.instrumentationMessges.loadPriceDetailsMsg'
            );
            this.productFacade.loadValidateProductAndPriceDetails({
              inventoryId: productDetail.inventoryId,
              orderPriceRequest: {
                checkInventory: true,
                itemCode: productDetail.itemCode,
                lotNumber: productDetail.lotNumber,
                inventoryId: productDetail.inventoryId,
                standardPrice: this.standardPrice
              },
              productDetails: productDetail,
              availableLotNumbers: availableLotNumbers,
              txnDetails: {
                id: this.cashMemoId,
                txnType: this.transactionType,
                subTxnType: this.subTransactionType
              },
              isABInvoked: this.isABInvoked
            });
          }
          this.addStartTracking('pw.instrumentationMessges.loadTaxDetailsMsg');
          if (productDetail && this.taxTransactionType) {
            this.productFacade.loadTaxDetails({
              customerId: this.customerId,
              isIGST: this.isIGST,
              itemCode: productDetail.itemCode,
              txnType: this.taxTransactionType
            });
          }
        }
      });
  }

  // Instrumentation
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

  getBadgeNumber(subTxnType) {
    if (subTxnType === SubTransactionTypeEnum.NEW_CM) return 2;
    else if (subTxnType === SubTransactionTypeEnum.MANUAL_CM) return 3;
  }

  resetTcs() {
    this.commonFacade.setTcsTcsAmountNeedToReset(true);
  }

  deleteTcsAmountPopup() {
    this.alertPopupService.open({
      type: AlertPopupTypeEnum.INFO,
      message: 'pw.payment.deleteTcsPaymentLabel'
    });
  }

  discountUpdatePopup() {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.INFO,
        message: 'pw.productGrid.discountRemovedMsg'
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.discountFacade.loadReloadDiscountsGrid(true);
      });
  }
  setSelectedRSOName(event) {
    if (this.customerDetails) {
      this.selectedEventRso = event.value;
      this.productFacade.partialUpdateCashMemo({
        id: this.cashMemoId,
        requestDetails: {
          employeeCode: this.selectedEventRso
        },
        txnType: this.subTransactionType === 'NEW_CM' ? 'CM' : 'AB',
        subTxnType: this.subTransactionType
      });
      //this.discountFacade.loadReloadDiscountsGrid(true);
    } else {
      this.showNotificationMeg('pw.IGST.addCustomerMsg');
    }
  }

  onGSTCheckboxClicked(event) {
    this.igstFormGroup.get('isIGST').patchValue(!event.checked);
    if (event.checked) {
      if (this.customerDetails) {
        if (
          this.customerDetails.customerDetails.data.state !== null &&
          this.customerDetails.customerDetails.data.state !== undefined
        ) {
          if (
            this.userProfile.address.state !==
            this.customerDetails.customerDetails.data.state
          ) {
            if (
              this.customerDetails.customerType ===
                CUSTOMER_TYPE_ENUM.REGULAR ||
              this.customerDetails.customerType === CUSTOMER_TYPE_ENUM.ONE_TIME
            ) {
              this.alertPopupService
                .open({
                  type: AlertPopupTypeEnum.CONFIRM,
                  message: 'pw.productGrid.IGSTCheckedMsg'
                })
                .pipe(takeUntil(this.destroy$))
                .subscribe((res: boolean) => {
                  if (res === true) {
                    this.setIsIGST(event.checked);
                  }
                });
            }
          } else {
            this.showNotificationMeg('pw.IGST.IGSTSameStoreMsg');
          }
        } else {
          this.showNotificationMeg('pw.IGST.addCustomerStateMsg');
        }
      } else {
        this.showNotificationMeg('pw.IGST.addCustomerMsg');
      }
    } else {
      this.setIsIGST(event.checked);
    }
  }

  setIsIGST(isIGST: boolean) {
    this.isIGST = isIGST;
    this.igstFormGroup.get('isIGST').patchValue(this.isIGST);
    this.commonFacade.setIsIGSTFlag(this.isIGST);
  }

  showNotificationMeg(key: string) {
    this.translate
      .get(key)
      .pipe(take(1))
      .subscribe((translatedMsg: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SIMPLE,
            message: translatedMsg,
            hasClose: true
          })
          .events.pipe(take(1))
          .subscribe((event: OverlayNotificationEventRef) => {});
      });
  }

  ngOnDestroy(): void {
    this.overlayNotification.close();
    this.destroy$.next();
    this.destroy$.complete();
    this.focFacade.clearABFocSchemes();
    this.focFacade.clearABFocSchemesCount();
  }
}
