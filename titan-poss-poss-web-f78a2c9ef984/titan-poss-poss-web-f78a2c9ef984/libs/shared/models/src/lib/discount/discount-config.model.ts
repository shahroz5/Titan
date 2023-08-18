import { Moment } from 'moment';
import { WorkflowFileUploadDetails } from '../configuration/discount-config.model';
import {
  DiscountApplicableEnum,
  DiscountChargeTypeEnum,
  DiscountTypeEnum
} from './discount.enum';
export interface BasicDiscountCategoryConfig {
  // maxDiscount: number;
  isNarationMandatory: boolean;
  isEditable: boolean;
  isTepRecovery: boolean;
  isMultipleTransactionPerDayAllowed: boolean;
  maxTransactionPerDay: number;

  ucp: {
    isValue: boolean;
    value: number;
    // percentage: number;
  };

  startingSerialNo: string;

  tataEmployeeConfig: {
    maxCount: number;
  };

  coinConfig: {
    tepCNPercentage: number;
    coinPurchasePeriod: {
      from: Moment;
      to: Moment;
    };
    tepPeriod: {
      from: Moment;
      to: Moment;
    };
    makingChargePercentage: number;
  };

  isFullValueTepDiscountRecovery: boolean;
  isApplicableForAutomatedDiscount: boolean;
  minKarateEligibleForGEP?: number;
}

export interface ClubbingDiscountsConfig {
  discountType: string;
  isClubbedOtherDiscounts: boolean;
  isClubbedOtherBillLevelDiscounts?: boolean;
}

export interface ClubbingOffersConfig {
  isExchangeOffer: boolean;
  isFOCOffer: boolean;
  isGHS: boolean;
  isRiva: boolean;
  isDV: boolean;
  isCoin: boolean;
  isBillLevelDiscount: boolean;
}

export interface CumulativeDiscountConfig {
  isSameStore: boolean;
  isOtherStore: boolean;
  isFamilyTree: boolean;
}

export interface ExchangeOfferConfig {
  applicableCN: {
    isTep: boolean;
    isGep: boolean;
  };
  minCNUtilizationPercent: number;
  isResidualFund: boolean;
}

export interface GRNConfig {
  // daysBeforeGRN?: number;
  // grnUtilization?: number;
  // daysAfterGRN?: number;
  daysAfterInvoice?: number;
  // isAllowedForGRNBeforeOfferPeriod?: boolean;
  // isSameCFAEligible?: boolean;

  //my changes
  noOfDaysAfterOfferPeriod?: number;
  utilizationPercent?: number;
  isAllowedBeforeOffer?: boolean;
  isSameCfaEligible?: boolean;
  isGrnApplicable?: boolean;
}

export interface AbCoConfig {
  isGoldRateFrozenForCO?: boolean;
  isGoldRateFrozenForAB?: boolean;
  offerPeriodForCO?: number;
  offerPeriodForAB?: number;
  coPercent?: number;
  abPercent?: number;
  isAllowedToChangeCO?: boolean;
  isDisplayOnCO?: boolean;
  isAllowedToChangeAB?: boolean;
  isDisplayOnAB?: boolean;
  isSizingOnCO?: boolean;
  coCreation?: boolean;
  invokeCO?: boolean;

  //
  // coConfig?: {
  //   daysAfterCo: number;
  //   coUtilization: number;
  //   isGrfCO: boolean;
  //   isAllowedToChangeCO: boolean;
  //   isDisplayOnCO: boolean;
  // };
  // abConfig?: {
  //   daysAfterAB: number;
  //   abUtilization: number;
  //   isGrfAB: boolean;
  //   isAllowedToChangeAB: boolean;
  //   isDisplayOnAB: boolean;
  // };
}

export interface DiscountApplicableConfig {
  basicDiscountCategoryConfig: BasicDiscountCategoryConfig;
  clubbingDiscountsConfig: ClubbingDiscountsConfig;
  clubbingOffersConfig: ClubbingOffersConfig;
  cumulativeDiscountConfig: CumulativeDiscountConfig;
  grnConfig: GRNConfig;
  abCoConfig: AbCoConfig;
  tepRecoveryConfig: DiscountTEPDetails;
}

export interface NewDiscountApplicableConfig {
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
  orderDetails?: {
    type: DiscountApplicableEnum.AB_CO_TYPE;
    data: AbCoConfig;
  };
  abCoData?: {
    type: DiscountApplicableEnum;
    data: AbCoData;
  };
  tepDetails?: {
    type: DiscountApplicableEnum.TEP_TYPE;
    data: DiscountTEPDetails;
  };
  grnDetails?: {
    type: DiscountApplicableEnum.GRN_TYPE;
    data: GRNConfig;
  };
  cumulativeDetails?: {
    type: DiscountApplicableEnum.CUMULATIVE_TYPE;
    data: CumulativeDiscountConfig;
  };
  itemGroupConfig?: {
    type:
      | DiscountTypeEnum.ITEM_GROUP_LEVEL_DISCOUNT
      | DiscountTypeEnum.BEST_DEAL_DISCOUNT;
    data: any;
  };
  configDetails?: {
    type:
      | DiscountApplicableEnum.EXCHANGE_OFFER_CONFIG
      | DiscountApplicableEnum.BEST_DEAL_TYPE
      | DiscountTypeEnum.TSSS_DISCOUNT;
    data: ExchangeOfferConfig | any | TsssConfig;
  };
  applicableThemes?: {
    type: DiscountTypeEnum.HIGH_VALUE_DISCOUNT;
    data: ApplicableThemeConfig;
  };
  id?: string;
  discountCode?: string;
  description?: string;
  discountType?: string;
  occasion?: string;
  approvedBy?: string;
  brandCode?: string;
  subBrandCode?: string;
  applicableLevels?: string;
  remarks?: string;
  isAccrualUlpPoints?: boolean;
  isActive?: boolean;
  isRiva?: boolean;
  referOtherDiscounts?: string;
  clubbingDiscountType?: string;
  isAbOfferApplicable?: boolean;
  isCoOfferApplicable?: boolean;
  isPreviewApplicable?: boolean;
  publishTime?: number;
  ulpCreateDate?;
  workflowFileUploadDetails?: WorkflowFileUploadDetails;
  workflowProcessId?: string;
}

export interface NewDiscountApplicableTheme {
  applicableThemes: {
    type: DiscountTypeEnum.HIGH_VALUE_DISCOUNT;
    data: ApplicableThemeConfig;
  };
  id?: string;
  discountCode?: string;
  description?: string;
  discountType?: string;
  occasion?: string;
  approvedBy?: string;
  subBrandCode?: string;
  applicableLevels?: string;
  remarks?: string;
  isAccrualUlpPoints?: boolean;
  isActive?: boolean;
}

export interface ApplicableThemeConfig {
  digit1: boolean;
  digit2: boolean;
  digit3: boolean;
  digit4: boolean;
  digit5: boolean;
  digit6: boolean;
  digit8: boolean;
  digit9: boolean;
  digit10: boolean;
  digit11: boolean;
  digit12: boolean;
  digit13: boolean;
  digit14: boolean;
}

export interface TsssConfig {
  noOfCoupons: number;
  noOfDigits: number;
  startingDigits: number;
}
export interface DiscountType {
  id: string;
  description: string;
}

export interface DiscountExcludeThemeCode {
  id: string;
  themeCode: string;
  isActive: boolean;
}

export interface DiscountExcludeSchemeCode {
  id: string;
  schemeCode: string;
  isActive: boolean;
}
export interface DiscountExcludeItemCodes {
  id: string;
  isActive: boolean;
  itemCode: string;
}

export interface DiscountExcludeConfig {
  id: string;
  fromValue: string;
  toValue: string;
  isActive: boolean;
}

export interface SaveDiscountExcludeConfig {
  addValues: {
    fromValue: string;
    toValue: string;
  }[];
  removeValues: string[];
  updateValue: DiscountExcludeConfig[];
}

export interface DiscountTEPConfig {
  id: string;
  durationInDays: number;
  recoveryPercent: number;
}

export interface DiscountTEPDetails {
  isEnabled: boolean;
  tepDetails: DiscountTEPConfig[];
}

export interface SaveDiscountTEPConfig {
  addValues: {
    durationInDays: string;
    recoveryPercent: string;
  }[];
  removeValues: string[];
  updateValue: DiscountTEPConfig[];
}

export interface MaxValueOrPercentage {
  maxMetalChargePercentage: number;
  maxMetalChargeValue: number;
  maxScPercentage: number;
  maxScValue: number;
  maxUcpPercentage: number;
  maxUcpValue: number;
  maxWcPercentage: number;
  maxWcValue: number;
  maxMcPercentage: number;
  maxMcValue: number;
  maxPerGramVaule: number;
}

export interface AdditionalMaxValueOrPercentage {
  additionalMaxMetalChargePercentage: number;
  additionalMaxMetalChargeValue: number;
  additionalMaxStoneChargePercentage: number;
  additionalMaxStoneChargeValue: number;
  additionalMaxUcpPercentage: number;
  additionalMaxUCPValue: number;
  additionalMaxMCPercentage: number;
  additionalMaxMCValue: number;
  additionalMaxPsPerGramVaule: number;
}

export interface CategoryDiscountPGConfig {
  valuePerWeightType: string;
}

export interface DiscountAbCoData {
  abPreview: string;
  coPreview: string;
  abPostPreview: string;
  coPostPreview: string;
}

export interface SlabConfig {
  isSingle: boolean;
  valuePerWeightType: string;
  discountBasedOn: string;
  discountBasedOnType: string;
  isNew?: boolean;
}

export interface ValuePercentageConfig {
  ucp: {
    isPercent: boolean;
    value: number;
  };
  mcCharges: {
    isPercent: boolean;
    value: number;
  };
  // wcCharges: {
  //   isPercent: boolean;
  //   value: number;
  // };
  goldCharges: {
    isPercent: boolean;
    value: number;
  };
  stoneCharges: {
    isPercent: boolean;
    value: number;
  };
  rsPerGram: {
    isPercent: boolean;
    value: number;
  };
}
export interface SlabConfigItem {
  regular: ValuePercentageConfig;
  preview: ValuePercentageConfig;
  ab: ValuePercentageConfig;
  co: ValuePercentageConfig;
  riva: ValuePercentageConfig;
  slabName: string;
  min: number;
  max: number;
  id: string;
  rowId: number;
  discountBasedOn: string;
  isSingle: boolean;
  discountBasedOnType: string;
  valuePerWeightType?: string;
  isActive: boolean;
}

export interface CategoryDiscountPGConfigItem {
  regular: ValuePercentageConfig;
  preview: ValuePercentageConfig;
  ab: ValuePercentageConfig;
  co: ValuePercentageConfig;
  riva: ValuePercentageConfig;
  id: string;
  rowId: number;
  isActive: boolean;
  productGroupCount: number;
}

export interface ValuePercentagePopupData {
  regular: ValuePercentageConfig;
  preview: ValuePercentageConfig;
  ab: ValuePercentageConfig;
  co: ValuePercentageConfig;
  riva: ValuePercentageConfig;
  configName?: string;
  id: string;
  rowId: number;
}

export interface ValuePercentageConfigData {
  regular: ValuePercentageConfig;
  preview: ValuePercentageConfig;
  ab: ValuePercentageConfig;
  co: ValuePercentageConfig;
  riva: ValuePercentageConfig;
}
export interface ValuePercentageData {
  charge: String;
  type: DiscountChargeTypeEnum;
  id: string;
  regular: {
    value: String;
    isPercent: boolean;
    isValid?: boolean;
    oldValue?: String;
    oldIsPercent?: boolean;
  };
  preview: {
    value: String;
    isPercent: boolean;
    isValid?: boolean;
    oldValue?: String;
    oldIsPercent?: boolean;
  };
  ab: {
    value: String;
    isPercent: boolean;
    isValid?: boolean;
    oldValue?: String;
    oldIsPercent?: boolean;
  };
  co: {
    value: String;
    isPercent: boolean;
    isValid?: boolean;
    oldValue?: String;
    oldIsPercent?: boolean;
  };
  riva: {
    value: String;
    isPercent: boolean;
    isValid?: boolean;
    oldValue?: String;
    oldIsPercent?: boolean;
  };
  hasPercent: boolean;
}

export interface DiscountSlabDetails {
  discountCategory: string;
  discountComponents: ValuePercentageConfigData;
  discountId: string;
  eligibility: string;
  id: string;
  isActive: boolean;
  isSingle: boolean;
  maxValue: number;
  minValue: number;
  rowId: number;
  slabName: string;
  valuePerWeightType: string;
  productGroupCount: number;
}

export interface DiscountComponents {
  type: string;
  data: ValuePercentageConfig;
}

export interface AbCoData {
  coDiscount?: {
    preview?: boolean;
    regular?: boolean;
    co?: boolean;
    postCO?: boolean;
    postRegular?: boolean;
  };
  abDiscount?: {
    preview?: boolean;
    regular?: boolean;
    ab?: boolean;
    postAB?: boolean;
    postRegular?: boolean;
  };
  //
  // coConfig?: {
  //   daysAfterCo: number;
  //   coUtilization: number;
  //   isGrfCO: boolean;
  //   isAllowedToChangeCO: boolean;
  //   isDisplayOnCO: boolean;
  // };
  // abConfig?: {
  //   daysAfterAB: number;
  //   abUtilization: number;
  //   isGrfAB: boolean;
  //   isAllowedToChangeAB: boolean;
  //   isDisplayOnAB: boolean;
  // };
}
