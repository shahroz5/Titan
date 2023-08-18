import { Moment } from 'moment';
import { AdvanceBookingDetailsResponse } from '../advance-booking/advance.booking.model';
import { DiscountsResponse } from '../discount/discount.model';
import {
  StatusTypesEnum,
  SubTransactionTypeEnum,
  TaxTypesEnum,
  TransactionTypeEnum
} from './cash-memo.enum';
import { PaymentDetails } from './payment.model';

export interface SearchProductPayload {
  transactionType?: string;
  searchValue: string;
}

export interface SearchProductList {
  itemCode: string;
  totalQuantity: number;
  productGroupCode: string;
}

export interface ProductDetailsPayload {
  itemCode: string;
  lotNumber?: string;
}

export interface ProductDetails {
  binCode: string;
  inventoryId: string;
  lotNumber: string;
  karatage: number;
  totalQuantity: number;
  stdWeight: number;
  unitWeight: number;
  productCategoryCode: string;
  productCategoryDescription: string;
  productGroupCode: string;
  productGroupDescription: string;
  totalWeightDetails: InventoryWeightDetails;
  itemCode: string;
  imageUrl: string;
  binGroupCode: string;
  itemDescription: string;
  stdValue: number;
}

export interface ValidateProductAndPriceDetailsPayload {
  inventoryId: string;
  orderPriceRequest: OrderPriceRequest;
  productDetails?: any;
  availableLotNumbers?: AvailableLotNumber[];
  txnDetails?: {
    id: string;
    txnType: string;
    subTxnType: string;
  };
  isABInvoked: boolean;
}

export interface OrderPriceRequest {
  checkInventory: true;
  itemCode: string;
  lotNumber: string;
  inventoryId: string;
  measuredQuantity?: number;
  measuredWeight?: number;
  standardPrice: any;
  stdWeight?: number;
}

export interface AvailableLotNumber {
  lotNumber: string;
  inventoryId: string;
  totalQuantity?: number;
}

export interface TransactionDetails {
  customerId: number;
  customerName: string;
  docNo: number;
  fiscalYear: number;
  id: string;
  locationCode: string;
  status: StatusTypesEnum;
  totalElements: number;
  docDate: Moment;
  firstHoldTime: Moment;
  lastHoldTime: Moment;
  paymentType: string;
  txnType: string;
  subTxnType: string;
}

export interface TransactionCount {
  count: number;
  txnType: string;
  subTxnType: string;
}

export interface CreateCashMemoResponse {
  id: string;
  status: StatusTypesEnum;
  docNo: number;
  txnType: string;
  subTxnType: string;
  manualBillDetails?: ManualBillDetails;
}

export interface CashMemoDetailsRequestPayload {
  txnType: string;
  subTxnType: string;
  id?: string;
  status?: StatusTypesEnum;
  requestDetails?: any;
  oldData?: CashMemoDetailsResponse;
}

export interface CashMemoDetailsRequest {
  customerId: number;
  metalRateList?: any;
  finalValue: number;
  occasion?: string;
  otherCharges?: any;
  paidValue: number;
  remarks: string;
  totalDiscount?: number;
  totalQuantity?: number;
  totalTax?: number;
  totalValue?: number;
  totalWeight?: number;
  minValue?: number;
  weightAgreed?: number;
  hallmarkCharges: number;
  hallmarkDiscount: number;
  tcsToBeCollected?: number;
  tcsCollected?: number;
  manualFoc?: boolean;
}

export interface TcsDataResponse {
  tcsToBeCollected?: number;
  tcsCollected?: number;
  tcsEligibleAmount?: number;
}

export interface CashMemoDetailsResponse {
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
  cnDocNoList?: any;
  customerDocDetails: string;
  tcsToBeCollected?: number;
  tcsCollectedAmount?: number;
  hallmarkCharges: number;
  hallmarkDiscount: number;
  refDocNo: number;
  refFiscalYear: number;
  cancelRemarks: string;
  isIGST?: boolean;
  hasError?: boolean;
  txnSource?: string;
  panCardNumber?: string;
  oldPanCardNumber?: string;
}

export interface CashMemoItemDetailsRequestPayload {
  txnType: string;
  subTxnType: string;
  id: string;
  employeeCode?: any;
  itemId?: string;
  itemDetails?: any;
  availableLotNumbers?: AvailableLotNumber[];
  productDetails?: any;
  headerData?: CashMemoDetailsResponse | AdvanceBookingDetailsResponse;
  oldData?: CashMemoItemDetailsResponse;
  removeFromOrder?: any;
  cashMemoId?: string;
  loadHeaderInfo?: boolean;
  isAddItem?: boolean;
  loadAutoDiscounts?: boolean;
  isIGST?: boolean;
}

export interface CashMemoItemDetails {
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
  discountDetails: any;
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
}

export interface CashMemoItemDetailsRequest {
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

export interface CashMemoItemDetailsResponse {
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
  itemDetails?: CashMemoItemDetails;
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
  discountTxnDetails?: DiscountsResponse[];
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
}

export class ProductDetailsInGrid {
  itemCode: string;
  description: string;
  binCode: string;
  selectedLotNumber: any;
  availableLotNumbers: AvailableLotNumber[];
  unitWeight: number;
  actualWeight: number;
  availableReasons: string[];
  selectedReason: string;
  remarks?: string;
  selectedRso: string;
  availableRso: { code: string; name: string }[];
  pricePerUnit: number;
  discount: any;
  finalPrice: number;
  priceBreakUp: PriceBreakup;
  productDetails: any;
  inventoryId: string;
  itemId: string;
  productType: string;
  isAdd: boolean;
  priceDetails: PriceDetails;
  quantity: number;
  taxDetails: CashMemoTaxDetails;
  stdWeight: number;
  karatage: number;
  productCatergory: string;
  productGroup: string;
  status: string;
  totalQuantity: number;
  subTxnType: string;
  refSubTxnType?: string;
  responseData?: CashMemoItemDetailsResponse;
  selectedDiscounts?: any;
  hmQuantity?: number;
  isFOCForHallmarkingCharges?: boolean;
  isHallmarked?: boolean;
  rowId: number;
  isManualFOC?: boolean;
  focSchemeDetails?: {};
  productGroupList?: string[];
  age?: number;
}

export interface ProductPriceDetails {
  itemCode: string;
  lotNumber: string;
  productGroupDesc: string;
  binCode: string;
  inventoryId: string;
  productDesc: string;
  itemQuantity: number;
  priceGroup: string;
  complexityCode: string;
  currencyCode: string;
  productCategoryCode: string;
  productGroupCode: string;
  stdWeight: number;
  finalValue: number;
  priceDetails: PriceDetails;
  isUcp: boolean;
  ignoreUcpRecalculate: boolean;
  productDetails?: ProductDetails;
  availableLotNumbers?: AvailableLotNumber[];
}

export interface PriceDetails {
  isUcp: boolean;
  printGuranteeCard?: boolean;
  makingChargeDetails: MakingChargeDetails;
  metalPriceDetails: MetalPriceDetails;
  stonePriceDetails: StonePriceDetails;
  itemHallmarkDetails: ItemHallmarkDetails;
  materialDetails?: MaterialDetails;
  netWeight: number;
}

export interface MaterialDetails {
  materialWeight?: number;
}

export interface MakingChargeDetails {
  isDynamicPricing: boolean;
  makingChargePercentage: number;
  preDiscountValue: number;
  makingChargePct: number;
  makingChargePgram: number;
  makingChargePunit: number;
  wastagePct: number;
}

export interface MetalPriceDetails {
  metalPrices: MetalPrices[];
  preDiscountValue: number;
}

export interface StonePriceDetails {
  numberOfStones: number;
  stoneWeight: number;
  weightUnit: string;
  preDiscountValue: number;
  stoneWeightForView: number;
  weightUnitForView: string;
}

export interface MetalPrices {
  karat: number;
  metalTypeCode: string;
  metalValue: number;
  netWeight: number;
  purity: number;
  ratePerUnit: number;
  type: string;
  weightUnit: string;
}

export interface CashMemoTaxDetails {
  cess: CessTax;
  data: CashMemoTaxData;
  taxClass: string;
  taxType: string;
}

export interface CessTax {
  cessCode: string;
  cessOnTax: boolean;
  cessPercentage: number;
  cessValue: number;
}

export interface CashMemoTaxData {
  taxCode: string;
  taxPercentage: number;
  taxValue: number;
}

export interface WeightDetails {
  goldWeight: number;
  materialWeight: number;
  platinumWeight: number;
  silverWeight: number;
  stoneWeight: number;
  diamondWeight: number;
}
export interface InventoryWeightDetails {
  type: string;
  data: WeightDetails;
}

export class TaxData {
  taxCode: string;
  taxPercentage: number;
}

export class MakingChargesDetails {
  makingChargePerGram: number;
  wastagePct: number;
  makingChargePct: number;
  makingChargePercentage: number;
  makingChargePunit: number;
}

export class PriceBreakup {
  totalDiscount = 0;

  metalPrices: {
    metalType: string;
    weight: number;
    amount: number;
  }[] = [];

  totalMetalWeight = 0;

  totalMetalPrice: {
    weight: number;
    amount: number;
  };

  stonePrice: {
    weightUnit: string;
    weight: number;
    amount: number;
  };

  materialDetails: {
    materialWeight: number;
  };

  hasStone = false;

  makingCharges: {
    isDynamicPricing: boolean;
    amount: number;
    value: number;
    isPercentage: boolean;
    makingChargesDetails: MakingChargesDetails;
  };

  hasMakingCharge = false;

  itemHallmarkDetails: {
    hallmarkGstPct: number;
    hallmarkingCharges: number;
    hmQuantity: number;
    isFOCForHallmarkingCharges: boolean;
    isHallmarked: boolean;
  };

  hasItemHallmarkDetails = false;

  tax: {
    taxType: string;
    percentage: number;
    taxAmount: number;
  }[] = [];

  basePrice = 0;

  totalAfterDiscount = 0;

  totalTax = 0;

  totalAfterTax = 0;

  ucpPrice: {
    amount: number;
    weightUnit: string;
    weight: number;
  };

  hasUcp = false;

  addMetalPrice(metalType: string, weight: number, amount: number) {
    this.metalPrices.push({
      metalType,
      weight,
      amount
    });
  }

  setStonePrice(weight: number, amount: number, weightUnit: string) {
    this.stonePrice = {
      weightUnit,
      weight,
      amount
    };
    this.hasStone = true;
  }

  setMakingCharge(
    value: number,
    isPercentage: boolean,
    amount: number,
    isDynamicPricing: boolean,
    makingChargesDetails: MakingChargesDetails
  ) {
    this.makingCharges = {
      value,
      isPercentage,
      amount,
      isDynamicPricing,
      makingChargesDetails
    };
    this.hasMakingCharge = true;
  }

  setItemHallmarkDetails(
    hallmarkGstPct: number,
    hallmarkingCharges: number,
    hmQuantity: number,
    isFOCForHallmarkingCharges: boolean,
    isHallmarked: boolean
  ) {
    this.itemHallmarkDetails = {
      hallmarkGstPct,
      hallmarkingCharges,
      hmQuantity,
      isFOCForHallmarkingCharges,
      isHallmarked
    };
    this.hasItemHallmarkDetails = true;
  }

  addTax(taxType: string, percentage: number) {
    this.tax.push({
      taxType,
      percentage,
      taxAmount: 0
    });
  }

  setTotalDiscount(discount: number) {
    this.totalDiscount = discount;
  }

  setUcpPrice(amount: number, weightUnit: string, weight: number) {
    this.ucpPrice = {
      amount,
      weightUnit,
      weight
    };
    this.hasUcp = true;
  }

  calculate() {
    this.calculateTotalMetalPrice();
    this.calculateTotalMetalWeight();
    this.calculateBasePrice();
    this.calculateTotalAfterDiscount();
    this.calculateTaxes();
    this.calculateTotalTax();
    this.calculateTotalAfterTax();
  }

  private calculateTotalMetalPrice() {
    this.totalMetalPrice = this.metalPrices.reduce(
      (mp1, mp2) => ({
        weight: mp1.weight + mp2.weight,
        amount: mp1.amount + mp2.amount
      }),
      {
        weight: 0,
        amount: 0
      }
    );
  }

  private calculateTotalMetalWeight() {
    this.totalMetalWeight = this.metalPrices
      .map(mp => mp.weight)
      .reduce((weight1, weight2) => weight1 + weight2, 0);
  }

  private calculateBasePrice() {
    let price = this.totalMetalPrice.amount;

    if (this.hasStone) {
      price = price + this.stonePrice.amount;
    }

    if (this.hasMakingCharge) {
      price = price + this.makingCharges.amount;
    }

    if (this.hasUcp) {
      price = price + this.ucpPrice.amount;
    }

    this.basePrice = price;
  }

  private calculateTotalAfterDiscount() {
    this.totalAfterDiscount = this.basePrice - this.totalDiscount;
  }

  private calculateTaxes() {
    this.tax.forEach(tax => {
      if (tax.taxType === TaxTypesEnum.HALLMARK_GST) {
        tax.taxAmount = this.calculatePercentageValue(
          this.itemHallmarkDetails.hallmarkingCharges,
          tax.percentage
        );
      } else {
        tax.taxAmount = this.calculatePercentageValue(
          this.totalAfterDiscount,
          tax.percentage
        );
      }
    });
  }

  private calculateTotalTax() {
    this.totalTax = this.tax
      .map(t => t.taxAmount)
      .reduce((t1, t2) => t1 + t2, 0);
  }

  private calculateTotalAfterTax() {
    const hallmarkingCharges = this.itemHallmarkDetails?.hallmarkingCharges
      ? this.itemHallmarkDetails?.hallmarkingCharges
      : 0;
    const hallmarkingDiscount = this.itemHallmarkDetails
      ?.isFOCForHallmarkingCharges
      ? this.itemHallmarkDetails?.hallmarkingCharges
      : 0;
    this.totalAfterTax =
      this.totalAfterDiscount +
      this.totalTax +
      hallmarkingCharges -
      hallmarkingDiscount;
  }

  private calculatePercentageValue(value: number, percentage: number): number {
    return Number(((value * percentage) / 100).toFixed(2));
  }
}

export interface UpdateOrderDetails {
  cashMemoId: string;
  transactionType: TransactionTypeEnum;
  subTransactionType: SubTransactionTypeEnum;
  status: StatusTypesEnum;
  orderDetails: CashMemoDetailsRequest;
  actionType?: string;
  isNarrationMandatory?: boolean;
  isABinvoked?: boolean;
  originalPaidValue?: number;
}

export interface OrderServiceDetails {
  cashMemoPayload: UpdateOrderDetails;
  paymentDetails: PaymentDetails[];
}
export interface CashMemoItemValidate {
  itemId: string;
  productGroupCode: string;
  availableWeight: number;
  measuredWeight: number;
  measuredQuantity: number;
  availableQuantity: number;
}
export interface TaxDetailsPayload {
  customerId: number;
  itemCode: string;
  txnType: string;
  isIGST?: boolean;
}

export interface OtherChargesList {
  otherCharges: OtherCharges[];
}

export interface OtherCharges {
  data: OtherChargesData;
  type: string;
}

export interface OtherChargesData {
  value: string;
  remarks: string;
  reasonId: string;
}

export interface OtherChargesDto {
  remarks: string;
  taxValue: number;
  value: number;
}

export interface MetalRates {
  metalTypeCode: string;
  priceType: string;
  ratePerUnit: number;
}

export interface MetalRatesPayload {
  applicableDate: number;
  locationCode: string;
  materialType?: string;
}

export interface SetTotalProductValuesPayload {
  productQty: number;
  productWeight: number;
  productDisc: number;
  productAmt: number;
  taxAmt: number;
  totalAmt: number;
  coinQty: number;
  coinWeight: number;
  coinDisc: number;
  coinAmt: number;
  totalAmtInUi?: number;
  finalAmt: number;
  roundOff?: number;
  hallmarkCharges: number;
  hallmarkDiscount: number;
}

export interface SetOrderValuesPayload {
  taxAmt: number;
  totalAmt: number;
  totalAmtInUi?: number;
  finalAmt: number;
  roundOff?: number;
  hallmarkCharges: number;
  hallmarkDiscount: number;
}

export interface SearchEmitEvent {
  searchValue: string;
  lotNumber: string;
  isValid: boolean;
}

export interface ManualBillRequest {
  manualBillDetails: ManualBillDetails;
}

export interface ManualBillDetails {
  approvedBy: string;
  manualBillDate: number;
  manualBillNo: string;
  manualBillValue: number;
  metalRates: any;
  password?: string;
  remarks: string;
  validationType: string;
  requestNo: number;
  frozenRateDate: number;
  isFrozenRate: boolean;
  performedBy: string;
  processId: string;
  requestStatus: string;
  isBimetal: boolean;
}

export interface EditedWeightData {
  actualWeight: number;
  reason: string;
  remarks: string;
}

export interface CoinDetails {
  itemDescription: string;
  itemCode: string;
  karatage: number;
  stdWeight: number;
  totalQuantity: number;
  unit: string;
  unitWeight: number;
  productGroupCode: string;
  productCategoryCode: string;
  stdValue: number;
  totalWeightDetails: InventoryWeightDetails;
}

export interface ProductGridProperties {
  checkBox: {
    isMultipleCheckBox: boolean;
  };
  selectedLotNumber: {
    isLotNumber?: boolean;
    isLotNumberWithInventoryId?: boolean;
    isQuantity?: boolean;
    isLotNumberAndQuantity?: boolean;
    isEditable: boolean;
  };
  actualWeight: {
    isEditable: boolean;
  };
  selectedRso: {
    isEditable: boolean;
  };
  discount: {
    isDiscountValue?: boolean;
    isDiscountSummary?: boolean;
  };
  finalPrice: {
    isAnchor: boolean;
  };
  isRedraw?: boolean;
  delete: boolean;
}

export interface TolerancePayload {
  ruleType: string;
  ruleRequestList: {
    inputValue?: number;
    metalType?: string;
    rangeType?: string;
    locationCode?: string;
  };
}
export interface FileUploadDownloadPayload {
  file?: FormData;
  txnType: TransactionTypeEnum;
  id: string;
  customerId?: number;
  locationCode?: string;
  uploadType?: string;
}

export interface CashMemoHistoryRequestPayload {
  filterOptions: {
    docNo?: number;
    fiscalYear?: number;
    fromDocDate?: any;
    toDocDate?: any;
    searchType?: string;
    searchField?: string;
    fromNetAmount?: string;
    toNetAmount?: string;
  };
  sort: string;
  page?: number;
  size?: number;
  txnType?: string;
  subTxnType?: string;
}

export interface CashMemoHistoryDetails {
  customerName: string;
  createdDate: any;
  createdBy: any;
  docNo: number;
  docDate: any;
  fiscalYear: number;
  netAmount: number;
  id: string;
  status: string;
}

export interface CashMemoHistoryResponse {
  cashMemoHistoryDetails: CashMemoHistoryDetails[];
  totalElements: number;
}

export interface FileUploadLists {
  id: string;
  name: string;
}

export interface CashMemoHistoryProductGrid {
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
  itemId?: string;
  stdWeight?: number;
  itemInStock?: boolean;
  reason: string;
  itemDetails?: any;
  orderItemId?: string;
  focSchemeId: string;
  id: string;
  rowId: number;
  salesTxnId: string;
  status: string;
}

export interface RsoDetailsPayload {
  code: string;
  name: string;
}

export interface ItemHallmarkDetails {
  hallmarkGstPct: number;
  hallmarkingCharges: number;
  hmQuantity: number;
  isFOCForHallmarkingCharges: boolean;
  isHallmarked: boolean;
}

export interface CNDetailsResponsePayload {
  amount: number;
  creditNoteType: string;
  customerName: string;
  fiscalYear: string;
  id: string;
  mobileNumber: string;
  status: string;
  goldRateAmount: number;
  goldWeight: number;
  locationCode: string;
  linkedTxnType: string;
  linkedTxnId: string;
  docNo: number;
  priority?: number;
  docDate?: Moment;
  isAdded?: boolean;
  totalDiscount?: any;
  eghsDetails?: any;
  cashCollected?: number;
  productType?: string;
  minAmount?: number;
  weightTolerance?: number;
  valueTolerance?: number;
}
export interface CNDetailsRequestPayload {
  customerId: number;
  cnType: string;
  isFrozenRateCnRequired?: boolean;
  isPageable?: boolean;
}

export interface ValidateMetalRatePayload {
  id: string;
  status: StatusTypesEnum;
  txnType: string;
  subTxnType: string;
  metalRates: any;
}
