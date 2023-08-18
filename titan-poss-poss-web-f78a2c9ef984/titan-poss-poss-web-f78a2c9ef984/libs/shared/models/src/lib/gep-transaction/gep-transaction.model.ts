import { Moment } from 'moment';

export interface GEPProductDetails {
  id: string;
  itemType: string;
  metalDetail: any;
  itemDetail: any;
  metalType: string;
  rate: number;
  weight: number;
  purity: number;
  karatage: any;
  melted: any;
  totalValue: number;
  netValue: number;
  totaltax: number;
  deductions: number;
  preMeltingDetails: {
    weight: number;
    purity: number;
    karatage: number;
  };
  totalBreakUp: any;
  taxDetails?: any;
  isSave: boolean;
}

export interface GepInitResponse {
  docNo: number;
  id: string;
  status: string;
  subTxnType: string;
  txnType: string;
}

export interface GepResponse {
  itemDetails: {
    deductionValue: number;

    itemId: string;
    itemType: string;
    karatage: number;

    measuredPurity: number;
    measuredWeight: number;
    metalRate: number;
    metalType: string;
    preMeltingDetails: {
      karatage: number;
      purity: number;
      weight: number;
    };

    priceDetails: totalBreakUp;

    value: number;
  };

  totalQuantity: number;
  totalTax: number;
  totalValue: number;
  totalWeight: number;
}

export interface totalBreakUp {
  deductionPercentage: number;
  deductionValue: number;
  finalValue: number;
  karat: number;
  measuredWeight: number;
  netValue: number;
  purity: number;
  rateForPurity: number;
  ratePerUnit: number;
  schemePercentage: number;
  schemeValue: number;
  weightUnit: string;
}
export interface CancelGep {
  totalElements: number;
  results: CancelGepItem[];
}

export interface CancelGepItem {
  customerName: string;
  refDocDate: Moment;
  refDocNo: number;
  refTxnId: string;
  refTxnTime: Moment;
  subTxnType: string;
  totalValue: number;
  date: any;
}
export interface ItemTypes {
  code: string;
  value: string;
  isActive: boolean;
}

export interface MetalTypes {
  materialTypeCode: string;
  description: string;
}

export interface GEPSearchResponse {
  totalElements: number;
  GEPList: GEPList[];
}

export interface GEPList {
  docNo: number;
  fiscalYear: number;
  cnDocNo: number;
  docDate: any;
  customerName: string;
  netAmount: number;
  status: string;
  createdBy: string;
  createdDate: any;
  txnId: string;
  txnType: string;
  subTxnType: string;
}

export interface GEPDetailResponse {
  id: string;
  status: string;
  docNo: number;
  fiscalYear: number;
  docDate: any;
  customerId: number;
  totalValue: number;
  totalQuantity: number;
  cnDocNo: number;
  createdBy: string;
  approvedBy: string;
  createdDate: any;
  itemIdList: [];
  employeeCode: string;
  remarks: string;
  //customerName: string;
}

export interface GEPProductItem {
  id: number;
  metalType: string;
  itemType: string;
  measuredWeight: number;
  measuredPurity: number;
  preMeltingDetails: {
    weight: number;
    purity: number;
    karatage: number;
  };
  karat: number;
  priceDetails: {
    purity: number;
    karat: number;
    measuredWeight: number;
    ratePerUnit: number;
    rateForPurity: number;
    deductionValue: number;
    finalValue: number;
  };
  taxDetails: any;
  totalWeight: number;
  quantity: number;
  totalValue: number;
  discountDetails: any;
  itemDetails: any;
}
