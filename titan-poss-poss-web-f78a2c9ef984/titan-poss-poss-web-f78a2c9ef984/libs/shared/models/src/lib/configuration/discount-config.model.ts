import { Moment } from 'moment';
export interface DisountConfigListPayload {
  pageIndex?: number;
  pageSize?: number;
  clubbingDiscountType?: string;
  discountCode?: string;
  discountType?: string;
  status?: string;
  publishStatus?: string;
  occasion?: string;
  isPageable?: boolean;
  isActive?: boolean;
}

export interface DiscountConfigList {
  id: string;
  discountCode: string;
  description: string;
  discountType: string;
  occasion: string;
  isActive: boolean;
  status: string;
  createdDate: Moment;
  lastModifiedDate: Moment;
  isPublishPending: boolean;
  publishTime: Moment;
  lastModifiedBy?: string;
  isCreatedByWorkflow?: string;
}
export interface NewDiscountDetails {
  id?: string;
  discountCode: string;
  description: string;
  discountType: string;
  occasion: string;
  approvedBy: string;
  brandCode: string;
  subBrandCode: string;
  applicableLevels: string;
  remarks: string;
  isAccrualUlpPoints: boolean;
  isActive: boolean;
  isRiva?: boolean;
  configDetails?: any;
  itemGroupConfi?: any;
  isCoOfferApplicable: boolean;
  isPreviewApplicable: boolean;
  isCreatedByWorkflow?: boolean;
  isAbOfferApplicable: boolean;
  ulpCreateDate: Moment;
  workflowFileUploadDetails?: WorkflowFileUploadDetails;
}

export interface WorkflowFileUploadDetails {
  type: string;
  data: {
    fileId: string;
    fileName: string;
  };
}

export interface discountWorkflowpayload {
  id: string;
  typeOfDiscount?: string;
  approvalStatus?: string;
  remarks: {
    remarks: any;
    fileDetils?: {
      fileId: string;
      fileName: string;
    };
  };
}

export interface FaqRequestPaylaod {
  docType: string;
  file: any;
  fileType: string;
}

export interface DiscountConfigSuccessList {
  discountConfigList: DiscountConfigList[];
  count: number;
}

export interface PaginationPayload {
  pageIndex: number;
  pageSize: number;
}
export interface DiscountLocationListPayload {
  id?: string;
  pageIndex?: number;
  pageSize?: number;
  locationCode?: any;
  offerEndDate?: Moment;
  offerStartDate?: Moment;
  previewEndDate?: Moment;
  previewStartDate?: Moment;
  configDetails?: any;
}

export interface TSSSRequestPayload {
  discountId: string;
  couponRequest: CouponRequestPayload;
}

export interface CouponRequestPayload {
  noOfCoupons: number;
  noOfDigits: number;
  startingDigits: number;
}
export interface DiscountBestDealListPayload {
  id?: string;
  pageIndex?: number;
  pageSize?: number;
}
export interface DiscountProductCategoryListPayload {
  id?: string;
  pagination?: PaginationPayload;
  productCategoryCode?: string;
}
export interface DiscountProductGroupListPayload {
  id?: string;
  pagination?: PaginationPayload;
  productGroupCodeList?: string[];
  karatType?: string;
  productType?: string;
}
export interface DiscounExcludeItemListPayload {
  id?: string;
  isPageable?: boolean;
  pagination?: PaginationPayload;
  itemCode?: string;
  excludeType?: string;
  sort?: boolean;
}
export interface DiscountLocationList {
  description: string;
  configDetails: any;
  id: string;
  locationCode: string;
  offerEndDate: Moment;
  offerStartDate: Moment;
  previewEndDate: Moment;
  previewStartDate: Moment;
  isActive: boolean;
  subBrandCode: string;
}
export interface DiscountProductCategoryList {
  discountId: string;
  id: string;
  isActive: true;
  productCategoryCode: string;
  description: string;
}

export interface DiscountProductGroupList {
  description: string;
  discountDetailsId: string;
  discountId: string;
  eligibleKarat: number;
  id: string;
  isActive?: boolean;
  isDeletable: boolean;
  karatType: string;
  productGroupCode: string;
}
export interface ExcludeItemList {
  discountId: string;
  fromValue: string;
  id: string;
  isExcluded: boolean;
  itemCode: string;
  themeCode: string;
  schemeCode: string;
  toValue: string;
  excludeType: string;
  isActive?: boolean;
}
export interface DiscountLocationSuccessList {
  discountLocationList: DiscountLocationList[];
  count: number;
}
export interface DiscountProductCategorySuccessList {
  discountProductCategoryList: DiscountProductCategoryList[];
  count: number;
}
export interface DiscountProductGroupSuccessList {
  discountProductGroupList: DiscountProductGroupList[];
  count: number;
}
export interface DiscountExcludeItemSuccessList {
  discountExcludeItemList: ExcludeItemList[];
  count: number;
}
export interface SaveDiscountLocationsPayload {
  id?: string;
  payload: {
    addLocations?: string[];
    configDetails?: {
      data: {};
      type: string;
    };
    removeLocations?: string[];
    status?: true;
    updateLocations?: string[];
    validity?: {
      offerEndDate: number;
      offerStartDate: number;
      previewEndDate?: number;
      previewStartDate?: number;
    };
  };
}

export interface SaveDiscountProductCategoryPayload {
  id?: string;
  addProductCategories?: string[];
  isActive?: true;
  removeProductCategories?: string[];
  updateProductCategories?: string[];
}

export interface SaveDiscountProductGroupPayload {
  id?: string;
  isActive?: boolean;
  karatType?: string;
  addProducts?: string[];
  eligibleKarat?: number;
  removeProducts?: string[];
  updateProducts?: string[];
  productType?: string;
}

export interface SaveDiscountThemesPayload {
  id?: string;
  isActive?: boolean;
  excludeType: string;
  addThemes: string[];
  removeThemes: string[];
  updateThemes: string[];
}

export interface SaveDiscountSchemesPayload {
  id?: string;
  isActive?: boolean;
  excludeType: string;
  addSchemes: string[];
  removeSchemes: string[];
  updateSchemes: string[];
}
export interface SaveExcludeTypePayload {
  id?: string;
  excludeType: string;
  payload: {
    isActive?: boolean;
    addValues: {
      fromValue: number;
      toValue: number;
    }[];
    removeValues: string[];
    updateValue: {
      fromValue?: number;
      id: string;
      toValue?: number;
    }[];
  };
}

export interface SaveBestDealDiscountPayload {
  id?: string;
  isActive?: boolean;
  addLinks: string[];
  removeLinks: string[];
  updateLinks?: string[];
}

export interface MappedDetails {
  id: string;
  uuid?: string;
  description?: string;
  isActive?: boolean;
}

export interface MappedBestDealDiscountSuccessList {
  mappedDetails: MappedDetails[];
  count: number;
}
export interface DiscountLOVTypes {
  description: string;
  value: string;
  isActive?: false;
}
export interface SubBrands {
  value: string;
  description: string;
}

export interface TSSSResponsePayload {
  filename: string;
  url: any;
}

export interface DiscountRequestListPayload {
  processId: string;
  workflowType: string;
  discountCode: string;
  occasion: string;
  discountId: string;
  createdBy: string;
  discountType: string;
  requestRemarks: string;
  typeOfRequest: string;
  approvalStatus: string;
  approvalLevel: string;
  requestorRemarks: string;
  requestedBy: string;
  requestedDate: Moment;
  approvedBy: any;
  approvedDate: Moment;
  approverRemarks: any;
  requestorCode: string;
  approverCode: any;
}

export interface RequestLists {
  requestList: DiscountRequestListPayload[];
  totalElements: number;
}
