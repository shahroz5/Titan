import {
  BrandSummary,
  CustomErrors,
  DiscountConfigList,
  DiscountLocationList,
  DiscountProductCategoryList,
  DiscountProductGroupList,
  DiscountRequestListPayload,
  DiscountSlabDetails,
  EmpowerConfigItem,
  ExcludeItemList,
  FaqFileUploadResponse,
  Lov,
  MappedDetails,
  NewDiscountApplicableConfig,
  ProductGroupMappingOption,
  TSSSResponsePayload,
  WeightRange
} from '@poss-web/shared/models';

export interface DiscountConfigState {
  isLoading: boolean;
  error: CustomErrors;
  totalCount: number;
  discountConfigList: DiscountConfigList[];
  discountDetails: NewDiscountApplicableConfig;
  hasSaved: boolean;
  hasUpdated: boolean;
  discountLocations: DiscountLocationList[];
  discountProductCategories: DiscountProductCategoryList[];
  discountProductGroups: DiscountProductGroupList[];
  discountExcludeItems: ExcludeItemList[];
  excludeItemCodes: ExcludeItemList[];
  locationCount: number;
  productCategoryCount: number;
  productGroupCount: number;
  excludeConfigCount: number;
  excludeItemCount: number;
  bestDealDiscountCount: number;
  selectedBestDealDiscountCount: number;
  saveLocations: boolean;
  saveProductCategories: boolean;
  saveProductGroups: boolean;
  saveLotAge: boolean;
  saveMaxPercentage: boolean;
  isExcludeThemeSaved: boolean;
  isExcludeTypeSaved: boolean;
  isExcludeSchemeSaved: boolean;
  selectedLocations: MappedDetails[];
  selectedProductGroups: MappedDetails[];
  selectedProductCategories: MappedDetails[];
  bestDealDiscountList: DiscountConfigList[];
  selectedBestDealDiscount: MappedDetails[];
  saveBestDealDiscounts: boolean;
  discountTypes: Lov[];
  clubbingDiscountTypes: Lov[];
  approvers: Lov[];
  isPublished: boolean;
  slabDetails: DiscountSlabDetails;
  isDiscDetailsSaved: boolean;
  discDetails: DiscountSlabDetails[];
  discountComponentProductGroups: ProductGroupMappingOption[];
  discountComponentPGConfig: DiscountSlabDetails[];
  isDiscountComponentPGConfigSaved: boolean;
  discountComponentPGConfigCount: number;
  brands: BrandSummary[];
  subBrands: BrandSummary[];
  applicableLevels: Lov[];
  rangeTepDuration: WeightRange[];
  isTsssComputed: boolean;
  discountRequestList: DiscountRequestListPayload[];
  discountRequestCount: number;
  tsssConfigCouponResponse: TSSSResponsePayload;
  empowermentUpdatedDiscount: EmpowerConfigItem;
  isDiscountSentForApproval: boolean;
  isDiscountApproved: string;
  empowermentDiscounts: EmpowerConfigItem[];
  faqFileUploadResponse: FaqFileUploadResponse;
  faqFileDownloadResponse: any;
  isEmailResent: string;
}
