import {
  SubTransactionTypeEnum,
  TransactionTypeEnum
} from '../cash-memo/cash-memo.enum';
import { ItemDetailsPopupHeaderData } from '../item-details-popup/item-details.model';
import { Moment } from 'moment';
import { Observable } from 'rxjs';
import {
  CashMemoItemDetailsResponse,
  PriceDetails
} from '../cash-memo/cash-memo.model';
import {
  DiscountApplicableEnum,
  DiscountPopupEnum,
  DiscountTypeEnum
} from './discount.enum';
import {
  AbCoConfig,
  AbCoData,
  ApplicableThemeConfig,
  BasicDiscountCategoryConfig,
  ClubbingDiscountsConfig,
  ClubbingOffersConfig,
  DiscountTEPDetails,
  ExchangeOfferConfig,
  GRNConfig,
  TsssConfig,
  ValuePercentageConfig
} from './discount-config.model';

export interface DiscountHeaders {
  discounts: Discounts[];
  clubDiscounts: ClubDiscounts[];
  cummulativeDiscountWithExcludeDetails?: any;
}

export interface DiscountHeadersDetails {
  discounts: DiscountsDetails[];
  clubDiscounts: ClubDiscountsDetails[];
}

export interface DiscountPopupPayload {
  headerDetails: ItemDetailsPopupHeaderData;
  currencyCode: string;
  weightUnit: string;
  itemDetails: {
    itemCode: string;
    lotNumber: string;
  };
  transactionDetails: {
    transactionType: TransactionTypeEnum;
  };
  itemData: any;
}
export interface ItemLevelDiscountDetails {
  discountDescription: string;
  discountType: string;
  isEdited: boolean;
  discountValueDetails: DiscountValueDetails[];
  discountTxnId?: string;
  discountCode: string;
  discountId: string;
  clubbingDiscountType: string;
  discountValue: number;
  refDiscountTxnId?: string;
  basicCriteriaDetails: {
    maxDiscount: number;
    isEditable: boolean;
  };
  rivaahGhsDetails: RivaahGhs;
}

// goldCharges: {
//   isPercent: boolean;
//   discount: number;
//   value: number;
//   maxValue: number;
// };
// stoneCharges: {
//   isPercent: boolean;
//   discount: number;
//   value: number;
//   maxValue: number;
// };
// valuePerGram: {
//   isPercent: boolean;
//   discount: number;
//   value: number;
//   maxValue: number;
// };
export interface DiscountComponentRow {
  isPercent: boolean;
  percentage: number;
  value: number;
  maxValue: number;
}

export interface ItemLevelDiscountRowData {
  discountDescription: string;
  clubbingDiscountType: string;
  discountCode: string;
  discountId: string;
  discountType: string;
  discountValue: number;
  discountTxnId: string;
  refDiscountTxnId: string;
  editable: boolean;
  maxDiscount: number;
  isEdited: boolean;
  components: string[];
  isBlank: boolean;
  isAdded: boolean;
  ucp: DiscountComponentRow;
  makingCharge: DiscountComponentRow;
  metalCharge: DiscountComponentRow;
  stoneCharge: DiscountComponentRow;
  valuePerGram: DiscountComponentRow;
  isValid: boolean;
  rivaahGhsDetails?: RivaahGhs;
}

export abstract class DiscountDetailsPopupServiceAbstraction {
  public abstract open(
    payload: DiscountPopupAbstractionPayload
  ): Observable<any>;
}

export interface DiscountPopupAbstractionPayload {
  itemData: any;
  readOnly: boolean;
}
export interface CouponDetails {
  couponCode: string;
  redeemStatus?: string;
  redeemTxnId?: string;
}

export interface TataEmployeeDetails {
  companyName: string;
  discountAvailedCount?: number;
  employeeId: string;
  employeeName: string;
  isIdProofUploaded?: boolean;
}
export interface GhsDiscountDetils {
  accountNo: string;
  discountTxnId: string;
  isSameCustomer: boolean;
  redeemStatus: string;
  voucherNo: string;
}

export interface DiscountItemDetails {
  itemCode: string;
  itemId?: string;
  lotNumber: string;
  mfgDate?: Moment;
  productCategoryCode?: string;
  productGroupCode?: string;
  stockInwardDate?: Moment;
  priceDetails?: PriceDetails;
  totalQuantity?: number;
  totalValue?: number;
  totalWeight?: number;
  netWeight?: number;
  totalTax?: number;
  complexityPercent?: number;
  makingChargePerGram?: number;
}

export interface DiscountTransactionLevelRequest {
  businessDate: any;
  discountType: string;
  employeeDetails?: {
    couponDetails: CouponDetails[];
  };
  itemDetails?: DiscountItemDetails[];
  tataEmployeeDetails?: TataEmployeeDetails;
  tsssDetails?: {
    couponDetails: CouponDetails[];
  };
  empowermentDetails?: {
    applyEmpowermentDiscount: boolean;
  };
}

export interface DiscountTransactionLevelResponse {
  discountCode: string;
  discountId: string;
  discountType: string;
  discountValue?: number;
  discountValueDetails?: {
    data?: any;
    type?: string;
    discountValueDetails?: DiscountValueDetails[];
  };
  isEdited?: boolean;
  itemDetails?: DiscountItemDetails[];
  basicCriteriaDetails?: {
    isBillValue: boolean;
    isEditable: boolean;
    maxDiscount: number;
    maxNoOfTimes: number;
    ucpValue: number;
  };
  clubbingDetails?: any;
  refPaymentId?: string;
}

export interface ApplyDiscountRequest {
  discountType: string;
  txnType: string;
  subTxnType: string;
  transactionId: string;
  hasDiscounts?: any;
  requestBody: {
    discountDetails?: DiscountTransactionLevelResponse[];
    employeeDetails?: {
      couponDetails: CouponDetails[];
    };
    ghsDiscountDetails?: GhsDiscountDetils;
    tataEmployeeDetails?: TataEmployeeDetails;
    tsssDetails?: {
      couponDetails: CouponDetails[];
    };
    rivaahCardDetails?: {
      couponCode: string;
    };
    empowermentDetails?: {
      applyEmpowermentDiscount: boolean;
    };
    rivaahGhsDetails?: RivaahGhs;
  };
}

export interface LoadAppliedTransactionDiscountsRequest {
  discountType?: string;
  subTxnType: string;
  transactionId: string;
  txnType: string;
  applicableLevel?: string;
  status?: string;
}
export interface DiscountsResponse {
  discountCode: string;
  discountId: string;
  discountTxnId: string;
  discountType: string;
  discountValue: number;

  discountValueDetails: {
    data: DiscountValueDetails[];
    type: string;
  };
  isEdited: boolean;
  itemId: string;
  referenceId?: string;
  refDiscountId?: string;
  refType?: string;
  referenceType?: string;
  discountAttributes?: DiscountAttributes;
  discountSubType?: string;
  status: string;
  isNarationMandatory: boolean;
  occasion: string;
  clubbedDiscountId: string;
  txnLevelDiscountValueDetails?: {
    data: RivaahGhs;
    type: DiscountPopupEnum;
  };
  cummulativeDiscountWithExcludeDetails?: {
    data: RivaahGhs;
    type: DiscountPopupEnum;
  };
  basicCriteriaDetails?: {
    isBillValue: boolean;
    isEditable: boolean;
    maxDiscount: number;
    maxNoOfTimes: number;
    ucpValue: number;
  };
  rivaahGhsDetails?: any;
}
export interface RemoveAllAppliedTransactionLevelDiscountsPayload {
  discountType: string;
  subTxnType: string;
  transactionId: string;
  txnType: string;
}
export interface RemoveAppliedTransactionLevelDiscountByIDPayload {
  discountId: string;
  discountType: string;
  subTxnType: string;
  transactionId: string;
  txnType: string;
  referenceId?: string;
}

export interface UpdateTransactionLevelDiscountByIDPayload {
  discountType: string;
  subTxnType: string;
  transactionId: string;
  txnType: string;
  isPriceUpdate: boolean;
}

export interface ConfirmTransactionLevelDiscountPayload {
  discountTxnId?: string[];
  discountType: string;
  subTxnType: string;
  transactionId: string;
  txnType: string;
}

export interface ItemLevelDiscountsRequestPayload {
  businessDate: number;
  itemDetails: DiscountItemDetails;
  transactionDetails: TransactionDetailsRequest;
  encircleDiscount?: any;
  employeeDetails?: any;
  tsssDetails?: any;
  tataEmployeeDetails?: any;
  empowermentDetails?: any;
  rivaahGhsDetails?: any;
}

export interface ItemLevelCustomerDetails {
  ulpId: string;
  enrollmentDate: Moment;
}

export interface ItemLevelDiscountsDetailsRequestPayload {
  requestBody?: {
    businessDate: number;
    itemDetails: DiscountItemDetails;
    transactionDetails: TransactionDetailsRequest;
    customerDetails: ItemLevelCustomerDetails;
    eligibleRivaahGhsDetails: RivaahGhs;
    cummulativeDiscountWithExcludeDetails?: any;
  };
  discountId: string;
  existingDiscounts?: any;
  discountClubId: string;
  data?: CashMemoItemDetailsResponse;
}

export interface TransactionDetailsRequest {
  transactionType: string;
  subTransactionType?: string;
  isFrozenRate?: boolean;
}

export interface DiscountConfigDetailsResponse {
  discountConfigDetails: DiscountConfigDetails;
  discountValue: number;
  discountValueDetails: DiscountValueDetails[];
  existingDiscounts?: any;
  rivaahGhsDetails: RivaahGhs;
}

export interface DiscountConfigDetails {
  basicCriteriaDetails: BasicCriteriaDetails;
  clubbingDetails: ClubbingDetails;
  discountAttributes: DiscountAttributes;
  discountCode: string;
  discountId: string;
  discountType: string;
  refDiscountTxnId: string;
  grnConfigDetails: GrnConfigDetails;
  locationOfferDetails: LocationOfferDetailsForDiscount;
  orderConfigDetails: OrderConfigDetails;
  tepConfigDetails: TepConfigDetails;
}
export interface BasicCriteriaDetails {
  coinPurchaseEndDate: Moment;
  coinPurchaseStartDate: Moment;
  isBillValue: boolean;
  isEditable: boolean;
  isFullValueTepRecovery: boolean;
  isMultipleTrnsctnAllowedOnSameDay: boolean;
  isNameMandatory: boolean;
  isNarationMandatory: boolean;
  isTepRecovery: boolean;
  isUploadMandatory: boolean;
  maxDiscount: number;
  maxNoOfTimes: number;
  tepPeriodEndDate: Moment;
  tepPeriodStartDate: Moment;
  startingSerialNoEmpDiscountType: number;
  startingSerialNoTataEmpDiscountType: number;
  tepCNUtilizationPercent: number;
  ucpValue: number;
  isFullValueTepDiscountRecovery?: boolean;
  startingSerialNo?: number;
  makingChargePercent?: number;
  maxCount?: number;
  isApplicableForAutomatedDiscount?: boolean;
}

export interface ClubbingDetails {
  isBillLevelDiscount: boolean;
  isCBOOffer: boolean;
  isCoin: boolean;
  isDV: boolean;
  isEmpowerment: boolean;
  isExchangeOffer: boolean;
  isFOCOffer: boolean;
  isGHS: boolean;
  isOtherBillLevelDiscount: boolean;
  isRiva: boolean;
}

export interface DiscountAttributes {
  clubbingDiscountType: string;
  isAccrualUlpPoints: boolean;
  isRiva: boolean;
  occasion: string;
}

export interface GrnConfigDetails {
  isAllowedBeforeOffer: boolean;
  isSameCfaEligible: boolean;
  noOfDaysAllowedAfterOfferPeriod: number;
  noOfDaysAllowedBeforeOfferPeriod: number;
  utilizationPercent: number;
}

export interface LocationOfferDetailsForDiscount {
  offerEndDate: Moment;
  offerStartDate: Moment;
  configDetails?: any;
  empowermentQuarterMaxDiscountValue?: number;
  previewOfferStartDate?: Moment;
  previewOfferEndDate?: Moment;
}

export interface OrderConfigDetails {
  abPercent: number;
  coPercent: number;
  isAllowedToChangeAB: boolean;
  isAllowedToChangeCO: boolean;
  isDisplayOnAB: boolean;
  isDisplayOnCO: boolean;
  isGoldRateFrozenForAB: boolean;
  isGoldRateFrozenForCO: boolean;
  offerPeriodForAB: number;
  offerPeriodForCO: number;
}

export interface TepConfigDetails {
  enabled: boolean;
  tepDetails: TepDetails[];
}

export interface DiscountValueDetails {
  component: string;
  discountPercent: number;
  discountValue: number;
  isDiscountPercentage: boolean;
  maxValue?: number;
}

export interface DiscountsRequestPayload {
  txnType: TransactionTypeEnum;
  subTxnType: SubTransactionTypeEnum;
  transactionId: string;
  itemId?: string;
  requestBody?: DiscountsRequest | DiscountsRequest[];
  discountTxnId?: string;
  clubbedDiscountId?: string;
  itemProductGroupCode?: string;
}

export interface DiscountsRequest {
  discountCode: string;
  discountId: string;
  discountType: string;
  discountValue: number;
  discountValueDetails: {
    data: { discountValueDetails: DiscountValueDetails[] };
    type: string;
  };
  isEdited: boolean;
  referenceId: string;
  referenceType: string;
  rivaahGhsDiscountDetails: RivaahGhs;
  refPaymentId?: string;
}

export interface Discounts {
  discountType: string;
  discountId: string;
  discountCode: string;
  discountAttributes: DiscountAttributes;
  orderConfigDetails?: OrderConfigDetails;
  refDiscountTxnId?: string;
  rivaahGhsDetails?: RivaahGhs;
}

export interface DiscountsDetails {
  discountType: string;
  discountId: string;
  discountCode: string;
  discountAttributes: DiscountAttributes;
  refDiscountTxnId?: string;
  basicCriteriaDetails?: BasicCriteriaDetails;
  clubbingDetails?: ClubbingDetails;
  grnConfigDetails?: GrnConfigDetails;
  tepConfigDetails?: TepConfigDetails;
  locationOfferDetails?: LocationOfferDetailsForDiscount;
  orderConfigDetails?: OrderConfigDetails;
  linkDiscountDetails?: any;
  slabConfigDetails?: SlabConfigDetails;
  applicableThemeDetails?: ApplicableThemeDetails;
  appliedDiscountComponent?: ValuePercentageConfig;
  regularDiscountComponent?: ValuePercentageConfig;
  slabDiscountComponents?: { slabConfigs: any };
  appliedDiscountComponentType?: string;
  appliedDiscountMaster?: AppliedDiscountMaster;
  productGroups?: { productGroups: string[] };
  productCategory?: { productCategory: string[] };
  excludeConfig?: ExcludeConfig;
  rivaahGhsDetails?: RivaahGhs;
}

export interface ClubDiscounts {
  clubDiscountId: string;
  discounts: Discounts[];
}

export interface ClubDiscountsDetails {
  clubDiscountId: string;
  discounts: DiscountsDetails[];
}

export interface TepDetails {
  durationInDays: string;
  recoveryPercent: number;
}

export interface DiscountCalculationItemDetails {
  isUcp: boolean;
  ucpValue: number;
  makingCharge: number;
  stoneCharge: number;
  goldCharge: number;
  weight: number;
}

export interface EmpowerConfigItem {
  discountPercent: number;
  minValue: number;
  maxValue: number;
  id: string;
  rowId: number;
  is_metal_charges: boolean;
  is_stone_charges: boolean;
  is_making_charges: boolean;
  is_ucp_charges: boolean;
  discountId?: string;
  isActive?: boolean;
  isEditable?: boolean;
}

export interface FaqFileUploadResponse {
  fileId: string;
  fileName: string;
}

export interface EmpowerUpdateDate {
  is_metal_charges: boolean;
  is_stone_charges: boolean;
  is_making_charges: boolean;
  is_ucp_charges: boolean;
}

export interface EmpowerDetailsPopup {
  empowermentDetailsList: EmpowerConfigItem;
  mode: boolean;
  minValue?: number;
  maxValue?: number;
  compareRow?: any;
  totalNoOfRows?: number;
  rowId?: number;
  toUpBelow?: string;
}

export interface EmpowerUpdateRequestPayload {
  type: string;
  data: EmpowerUpdateDate;
}

export interface KaratOrCoinOfferEligibleItemsRequestPayload {
  businessDate: number;
  discountIds: string[];
  itemDetails: {}[];
}

export interface GepPurityConfigIdEligibleItemsRequestPayload {
  businessDate: number;
  gepConfigId?: string;
  gepConfigDetailsId?: string;
  gepPurity?: number;
  itemDetails?: {
    applicableKaratageType?: string;
    itemCode: string;
    itemId: string;
    lotNumber: string;
    productCategoryCode: string;
    productGroupCode: string;
    mfgDate?: string;
    stockInwardDate?: string;
  }[];
  txnType?: string;
}

export interface GepPurityConfigIdEligibleItemsResponse {
  eligibleItemDetails: {
    gepConfigDetails: {
      gepConfigCode: string;
      gepConfigDetails: {
        data: any;
        type: string;
      };
      gepConfigId: string;
      gepConfigType: string;
      gepOfferDetails: {
        data: any;
        type: string;
      };
      isOfferEnabled: true;
      itemDetails: {
        applicablePct: number;
        itemCode: string;
        itemId: string;
        lotNumber: string;
        productGroupCode: string;
      }[];
    }[];
  }[];
}

export interface ApplyKaratOrCoinOfferRequestPayload {
  discountDetails: DiscountDetail[];
}

export interface DiscountDetail {
  discountCode: string;
  discountId: string;
  discountType: string;
  discountValue?: number;
  refPaymentId: string;
  discountValueDetails?: {
    type: string;
    data: {
      discountValueDetails: {
        component: 'KARATAGE_DISCOUNT_1KT' | 'KARATAGE_DISCOUNT_2KT';
        discountPercent: string;
        discountValue: string;
        isDiscountPercentage: boolean;
      }[];
    };
  };
  isEdited?: boolean;
  itemDetails?: {
    applicableKaratageType?: string;
    itemCode: string;
    itemId: string;
    lotNumber: string;
    productCategoryCode: string;
    productGroupCode: string;
    mfgDate?: string;
    stockInwardDate?: string;
  }[];
}
export interface DiscountVoucherDetailsRequestPayload {
  accountNo: number;
  vendorCode: string;
  voucherCode: number;
}
export interface DiscountVoucherDetailsResponePayload {
  accountCustomerId: number;
  accountNo: number;
  customerId: number;
  customerName: string;
  discountAmount: number;
  ghScheme: string;
  id: string;
  installmentAmount: number;
  isGoldCoinAllowed: boolean;
  issueDate: Moment;
  mobileNo: string;
  noOfInstallmentsPaid: number;
  redeemptionDate: Moment;
  status: string;
  validFrom: Moment;
  validTill: Moment;
  voucherNo: number;
}

export interface SlabConfigDetails {
  discountCategory: any;
  eligibilityDetails: any;
  isSingle: boolean;
}

export interface ApplicableThemeDetails {
  type: DiscountTypeEnum;
  data: ApplicableThemeConfig;
}

export interface AppliedDiscountMaster {
  createdBy: string;
  createdDate: Moment;
  lastModifiedBy: string;
  lastModifiedDate: Moment;
  isActive: boolean;
  srcSyncId: number;
  destSyncId: number;
  discountCode: string;
  description: string;
  approvedBy: string;
  discountType: string;
  occasion: string;
  subBrandCode: string;
  brandCode: string;
  isPreviewApplicable: boolean;
  isAbOfferApplicable: boolean;
  isCoOfferApplicable: boolean;
  isRiva: boolean;
  isAccrualUlp: boolean;
  ulpCreateDate: Moment;
  cumulativeDetails: any;
  grnDetails?: {
    type: DiscountApplicableEnum.GRN_TYPE;
    data: GRNConfig;
  };
  orderDetails?: {
    type: DiscountApplicableEnum.AB_CO_TYPE;
    data: AbCoConfig;
  };
  tepDetails?: {
    type: DiscountApplicableEnum.TEP_TYPE;
    data: DiscountTEPDetails;
  };
  applicableLevels: string;
  remarks: string;
  basicCriteria?: {
    type: DiscountApplicableEnum.BASIC_CRITERIA_TYPE;
    data: BasicDiscountCategoryConfig;
  };
  clubOtherOffersConfig?: {
    type: DiscountApplicableEnum.CLUB_OTHER_OFFERS;
    data: ClubbingOffersConfig;
  };
  clubDiscountType?: {
    type: DiscountApplicableEnum.CLUB_DISCOUNT_TYPE;
    data: ClubbingDiscountsConfig;
  };
  abCoData?: {
    type: DiscountApplicableEnum;
    data: AbCoData;
  };
  configDetails?: {
    type:
      | DiscountApplicableEnum.EXCHANGE_OFFER_CONFIG
      | DiscountApplicableEnum.BEST_DEAL_TYPE
      | DiscountTypeEnum.TSSS_DISCOUNT;
    data: ExchangeOfferConfig | any | TsssConfig;
  };
  itemGroupConfig?: {
    type:
      | DiscountTypeEnum.ITEM_GROUP_LEVEL_DISCOUNT
      | DiscountTypeEnum.BEST_DEAL_DISCOUNT;
    data: any;
  };
  applicableThemes?: {
    type: DiscountTypeEnum.HIGH_VALUE_DISCOUNT;
    data: ApplicableThemeConfig;
  };
  clubbingDiscountType: string;
  isPublishPending: boolean;
  publishTime: Moment;
  id: string;
}

export interface ExcludeConfig {
  itemCodes: any;
  themeCodes: any;
  complexityPercent: any;
  makingChargePerGram: number;
}

export interface RivaahGhs {
  accountNo: string;
  excludeProductGroup: string[];
  makingChargeDiscountPercent: number;
  schemeCode: string;
  ucpDiscountPercent: number;
  refPaymentId: string;
  isMcDiscountUsed: boolean;
  isUcpdiscountUsed: boolean;
}

export interface AutoDiscRequest {
  request: {
    customerDetails: ItemLevelCustomerDetails;
    itemDetails: DiscountItemDetails;
    discountRequestDto: ItemLevelDiscountsRequestPayload;
    itemDetailsForCummulativeCal?: any;
  };
  data?: CashMemoItemDetailsResponse;
}

export interface RivaahGHSDiscounts {
  clubDiscountDetails: DiscountTransactionLevelResponse[];
  discountDetails: DiscountTransactionLevelResponse[];
}

export type SelectedDiscountTypeAndIdMap = Map<string, string>;
