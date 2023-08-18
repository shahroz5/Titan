import { Moment } from 'moment';
import { StatusTypesEnum } from '../cash-memo/cash-memo.enum';
import {
  AvailableLotNumber,
  CashMemoTaxDetails,
  InventoryWeightDetails,
  ManualBillDetails,
  PriceBreakup,
  PriceDetails,
  ProductDetails
} from '../cash-memo/cash-memo.model';
import { DiscountsResponse } from '../discount/discount.model';

export interface COMOrders {
  autostn: boolean;
  cfaCode: string;
  coStatus: string;
  comOrderDateTime: Moment;
  comOrderNumber: string;
  customerName: string;
  dateOfOccasion: Moment;
  deliveryDateTime: Moment;
  ecelesteFlag: boolean;
  goldCharges: number;
  goldRate: number;
  grossWeight: number;
  isDummyCode: boolean;
  isItemCodeAvailable: boolean;
  isOccassion: boolean;
  isSizing: boolean;
  itemCode: string;
  lotNumber: string;
  makingCharges: number;
  mobileNumber: string;
  netWeight: number;
  orderValue: number;
  quantity: number;
  requestBtq: string;
  requestBy: string;
  requestType: string;
  rsoName: string;
  specialOccasion: string;
  status: string;
  stoneCharges: number;
  stoneWt: number;
  subType: string;
  wtPerUnit: number;
}

export interface CODetailsRequestPayload {
  txnType?: string;
  subTxnType?: string;
  id?: string;
  status?: StatusTypesEnum;
  requestDetails?: any;
  locationCode?: string;
}

export interface CODetailsRequest {
  customerId: number;
  finalValue: number;
  focRemarks: string;
  hallmarkCharges: number;
  hallmarkDiscount: number;
  metalRateList: any;
  paidValue: number;
  remarks: string;
  totalDiscount: number;
  totalQuantity: number;
  totalTax: number;
  totalValue: number;
  totalWeight: number;
}

export interface CreateCOResponse {
  id: string;
  status: StatusTypesEnum;
  docNo: number;
  txnType: string;
  subTxnType: string;
  manualBillDetails?: ManualBillDetails;
}

export interface CODetailsResponse {
  customerId: number;
  cancelTxnId: number;
  metalRateList: any;
  finalValue: number;
  occasion: string;
  otherChargesList: any;
  paidValue: number;
  discountDetails: any;
  focDetails: any;
  refTxnId: string;
  refTxnType: string;
  refSubTxnType: string;
  remarks: string;
  taxDetails: CashMemoTaxDetails;
  totalDiscount: number;
  totalQuantity: number;
  totalTax: number;
  totalValue: number;
  totalWeight: number;
  docNo: number;
  firstHoldTime: Moment;
  fiscalYear: number;
  id: string;
  lastHoldTime: Moment;
  roundingVariance: number;
  status: StatusTypesEnum;
  itemIdList?: string[];
  txnType: string;
  orderWeightDetails?: {
    type: string;
    data: {};
  };
  subTxnType: string;
  manualBillDetails?: ManualBillDetails;
  docDate: Moment;
  employeeCode: string;
  txnTime: Moment;
  cndocNos?: Object;
  customerDocDetails: string;
  tcsToBeCollected?: number;
  tcsCollectedAmount?: number;
  hallmarkCharges: number;
  hallmarkDiscount: number;
  refDocNo: number;
  refFiscalYear: number;
  cancelRemarks: string;
  activationDetails: any;
  cancellationDetails: any;
  confirmedTime: Moment;
  isFrozenRate: boolean;
  isFrozenAmount: number;
  isBestRate: boolean;
  minValue: number;
  customerName?: string;
  locationCode?: string;
  creditNotes?: number[];
  deliveredWeightDetails?: {
    type: string;
    data: {};
  };
  totalDeliveredWeight?: number;
  updateWeight?: boolean;
  minPaymentDetails: {};
  bestRateConfigDetails: {
    data: {};
    type: string;
  };
  currencyCode: string;
  discountTxnDetails: {
    data: {};
    type: string;
  };
  invokeCount: number;
  invokeTime: Moment;
  lastInvokeTime: Moment;
  manualBillId: string;
  minDiscountPayment: number;
  minOrderPayment: number;
  previousStatus: string;
  rateFrozenDate: boolean;
  requestType: string;
  requestedDate: Moment;
  weightUnit: string;
  nomineeDetails: {
    data: {};
    type: string;
  };
  totalGrossWeight: number;
  totalOrderValue: number;
  collectedBy: string;
}

export interface COItemDetailsRequestPayload {
  txnType: string;
  subTxnType: string;
  id: string;
  itemId?: string;
  itemDetails?: any;
  headerData?: CODetailsResponse;
  oldData?: COItemDetailsResponse;
  loadHeaderInfo?: boolean;
  isAddItem?: boolean;
}

export interface COItemDetailsRequest {
  itemCode: string;
  lotNumber?: string;
  inventoryId?: string;
  finalValue: number;
  remarks: string;
  totalDiscount: number;
  totalQuantity: number;
  totalTax: number;
  totalValue: number;
  totalWeight: number;
  unitValue: number;
  inventoryWeight: number;
  employeeCode: string;
  reason: string;
  itemId?: string;
  hallmarkCharges: number;
  hallmarkDiscount: number;
}

export interface COItemDetailsResponse {
  customerId: number;
  metalRateList: any;
  finalValue: number;
  occasion: string;
  otherChargesList: any;
  paidValue: number;
  refTxnId: string;
  refTxnType: string;
  refSubTxnType: string;
  remarks: string;
  taxDetails: CashMemoTaxDetails;
  totalDiscount: number;
  totalQuantity: number;
  totalTax: number;
  totalValue: number;
  totalWeight: number;
  docNo: number;
  firstHoldTime: Moment;
  fiscalYear: number;
  id: string;
  lastHoldTime: Moment;
  roundingVariance: number;
  status: StatusTypesEnum;
  itemDetails?: COItemDetails;
  itemId?: string;
  availableLotNumbers?: AvailableLotNumber[];
  orderWeightDetails?: {
    type: string;
    data: {};
  };
  isFrozenRate?: boolean;
  isFrozenAmount?: number;
  productDetails?: any;
  product?: ProductDetails[];
  minValue?: number;
  txnType: string;
  subTxnType: string;
  manualBillDetails: ManualBillDetails;
  discountDetails: DiscountsResponse[];
  docDate: Moment;
  employeeCode: string;
  focdetails: {};
  txnTime: Moment;
  minPaymentDetails?: {
    data: {
      bestRateMinPayment: number;
      frozenMinPayment: number;
      nonFrozenMinPayment: number;
    };
    type: string;
  };
  minOrderPayment?: number;
  minDiscountPayment?: number;
  hallmarkCharges: number;
  hallmarkDiscount: number;
  totalGrossWeight: number;
  totalOrderValue: number;
}

export interface COItemDetails {
  itemCode: string;
  lotNumber: string;
  binCode: string;
  inventoryId: string;
  finalValue: number;
  remarks: string;
  totalDiscount: number;
  totalQuantity: number;
  totalTax: number;
  totalValue: number;
  totalWeight: number;
  unitValue: number;
  unitWeight: number;
  employeeCode: string;
  discountDetails: {};
  focDetails: {};
  taxDetails: CashMemoTaxDetails;
  priceDetails: PriceDetails;
  inventoryWeightDetails: InventoryWeightDetails;
  isFoc: boolean;
  measuredWeightDetails: InventoryWeightDetails;
  productCategoryCode: string;
  productGroupCode: string;
  refTxnId: string;
  refTxnType: string;
  refSubTxnType: string;
  hallmarkCharges: number;
  hallmarkDiscount: number;
  rowId: number;
  itemId?: string;
  stdWeight?: number;
  itemInStock?: boolean;
  reason: string;
  itemDetails?: any;
  orderItemId?: string;

  // CO
  comOrderNumber: string;
  deliveryDate: Moment;
  isAutoStn: boolean;
  grossWeight: number;
  orderDate: Moment;
  requestBtq: string;
  requestType: string;
  requestedBy: string;
  isCOMOrder: boolean;
  priceBreakUp: PriceBreakup;
  isAdd: boolean;
  subType: string;
  wtPerUnit: number;
  specialOccasion: string;
  ecelesteFlag: boolean;
  isOccassion: boolean;
  isSizing: boolean;
  dateOfOccasion: Moment;
}

export interface NomineeDetails {
  nomineeName: string;
  address: string;
  mobileNumber: string;
  relationship: string;
}

export interface SetCOTotalProductValuesPayload {
  productQty: number;
  productWeight: number;
  productDisc: number;
  productAmt: number;
  taxAmt: number;
  finalAmt: number;
  roundOff?: number;
  totalGrossWeight: number;
  totalOrderValue: number;
  totalQuantity?: number;
  coinQty?: number;
  totalDiscount?: number;
  coinDisc?: number;
  totalAmt?: number;
  hallmarkCharges?: number;
  hallmarkDiscount?: number;
}
