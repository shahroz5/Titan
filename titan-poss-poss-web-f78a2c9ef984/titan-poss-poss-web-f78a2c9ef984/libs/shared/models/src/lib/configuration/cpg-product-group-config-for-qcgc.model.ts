export interface LoadCPGProductGroupConfigForQCGCListingPayload {
  pageIndex: number;
  pageSize: number;
  searchData: string;
}

export interface CPGProductGroupConfigForQCGCListingResult {
  results: CPGProductGroupConfigForQCGCDetails[];
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
}

export interface CPGProductGroupConfigForQCGCDetails {
  id?: string;
  paymentCategoryName: string;
  description?: string;
  paymentCode?: PaymentCode;
  instrumentNumberDetails?: {
    data: InstrumentNumberArray[];
    type: string;
  };
  redemptionType?: RedemptionType;
  isActive: boolean;
  instrumentType?: InstrumentType;
  minimumAmount?: number;
}

interface InstrumentNumberArray {
  instrumentNo: string;
  isGhsVoucherEnabled: boolean;
}

export enum InstrumentType {
  InstrumentTypeEVoucherCard = 'EVOUCHER_CARD',
  PhysicalCard = 'PHYSICAL_CARD'
}

export enum PaymentCode {
  Qcgc = 'QCGC'
}

export enum RedemptionType {
  Full = 'FULL',
  Partial = 'PARTIAL'
}

export enum CPGProductGroupConfigForQCGCConstants {
  NEW = 'NEW'
}

export interface CPGProductGroupConfigForQCGCMapping {
  addProductGroupCode: string[];
  removeProductMappingIds: string[];
}
