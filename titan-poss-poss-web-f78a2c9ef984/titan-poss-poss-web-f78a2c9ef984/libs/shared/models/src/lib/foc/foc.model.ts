import { Moment } from 'moment';
import {
  SubTransactionTypeEnum,
  TransactionTypeEnum
} from '../cash-memo/cash-memo.enum';
import {
  PriceBreakup,
  ProductDetails,
  PriceDetails,
  AvailableLotNumber
} from '../cash-memo/cash-memo.model';

export interface LoadPendingCMPayload {
  subTxnType: string;
  txnType: string;
  fiscalYear?: string;
  docNo?: number;
  transactionId?: string;
  customerId?: string;
  status?: string;
}

export interface PendingCMResponsePayload {
  customerId: number;
  docDate: Moment;
  docNo: number;
  finalValue: number;
  fiscalYear: number;
  id: string;
}

export interface LoadPendingFocSchemesPayload {
  id: string;
  subTxnType: string;
  txnType: string;
}

export interface LoadFocItemDetailsPayload {
  itemsCodes: string[];
}

export interface FocItemDetailsResponsePayload {
  binCode: string;
  // imageUrl: string;
  // inventoryId: string;
  itemCode: string;
  // karatage: number;
  lotNumber: string;
  // productCategoryCode: string;
  // productCategoryDescription: string;
  // productGroupCode: string;
  // productGroupDescription: string;
  availableQuantity: number;
  totalQuantity?:number;
  stdWeight: number;
  unitWeight: number;
  weightDetials: {};
  availbleQty?: number;
}

export interface FocInventoryItemsPayload {
  binCode: string;
  employeeCode: string;
  focSchemeId: string;
  id: string;
  inventoryId: string;
  itemCode: string;
  lotNumber: string;
  rowId: number;
  salesTxnId: string;
  status: string;
  totalQuantity: number;
  totalWeight: number;
  unitWeight: number;
}

export interface IssuePendingFocConfirmationPayload {
  docNo: number;
  fiscalYear: number;
  focItems: FocInventoryItemsPayload[];
  id: string;
  refTxnId: string;
  status: string;
  subTxnType: string;
  txnType: string;
}

export interface IssuepPendingFocPayload {
  refTxnId: string;
  subTxnType: string;
  txnType: string;
  payload: any;
}
export interface FocDetails {
  focDetails: {
    focItems: IssueFocItemDto[];
    focSchemeId: string;
  }[];
}
export interface IssueFocItemDto {
  employeeCode: string;
  inventoryId: string;
  itemCode: string;
  lotNumber: string;
  totalQuantity: number;
  totalWeight: number;
  unitWeight: number;
}

export class FocProductDetailsInGrid {
  itemCode: string;
  description: string;
  binCode: string;
  selectedLotNumber: string;
  availableLotNumbers: AvailableLotNumber[];
  unitWeight: number;
  actualWeight: number;
  reason?: string;
  remarks?: string;
  selectedRso: string;
  availableRso: string[];
  pricePerUnit: number;
  discount: any;
  finalPrice: number;
  priceBreakUp: PriceBreakup;
  productDetails?: ProductDetails;
  inventoryId: string;
  itemId: string;
  productType: string;
  isAdd: boolean;
  priceDetails: PriceDetails;
  imageUrl: string;
  quantity: number;
  focSchemeId: string;
}
export class AvailableSchemesPayload {
  description: string;
  id: string;
  isActive: boolean;
  name: string;
}

/////////
export class FocSchemeRequestDto {
  payload: {
    businessDate: number;
    isFrozen?: boolean;
    purchaseItems: PurchaseItemsRequestPayloadDto[];
  };
  cashMemoId?: string;
  abItemIdList?: string[];
}

export class PurchaseItemsRequestPayloadDto {
  itemCodes: string[];
  productGroupCode: string;
  totalDiscount: number;
  totalMaterialWeight: number;
  totalMetalWeight: number;
  totalStoneWeight: number;
  totalTax: number;
  totalValue: number;
}
export class FocSchemeDetailsDto {
  focItems: FocItemsDto[];
  purchaseItems: FocPurchaseItemsDto[];
  schemeDetailId: string;
  schemeId: string;
  schemeName: string;
  schemeCategory: string;
  weight?: number;
  isSelected?: boolean;
}

export class ManualFocDetailsDto {
  focItems: FocItemsDto[];
  schemeId: string;
  schemeName: string;
  manualFOCStartDate: Moment;
  manualFOCEndDate: Moment;
  configDetails: any;
}

export class FocItemsDto {
  itemCode: string;
  quantity: number;
  weight: number;
}
export class FocPurchaseItemsDto {
  itemCodeList: string[];
  productGroupCode: string;
}
export class AddFocPopupPayload {
  employeeCode?: string;
  // inventoryId: string;
  itemCode: string;
  lotNumber: string;
  totalQuantity: number;
  totalWeight: number;
  unitWeight: number;
  actualQuantity:number;
}

export class AddFocPayload {
  focItemDetails?: AddFocPopupPayload[];
  focScheme: {
    eligibleFocItemDetails: { focItems: FocItemsDto[] };
    purchaseItemDetails: { purchaseItems: FocPurchaseItemsDto[] };
    schemeDetailIds: string[];
    schemeId: string;
    schemeName: string;
    schemeCategory: string;
  };
}

export class AddManualFocPayload {
  focItemDetails?: AddFocPopupPayload[];
  focScheme: {
    eligibleFocItemDetails: { focItems: FocItemsDto[] };
    schemeId: string;
    schemeName: string;
  };
}

export class AddManualFocToCMPayload {
  id: string;
  subTxnType: string;
  txnType: string;
  focDetails: AddManualFocPayload[];
  manualFocEndDate?: Moment;
  manualFocStartDate?: Moment;
  approvedBy?: string;
}
export class AddFocToCMPayload {
  id: string;
  subTxnType: string;
  txnType: string;
  focDetails: AddFocPayload[];
}
export class AddFocToCmResponsePayload {
  binCode: string;
  employeeCode: string;
  focSchemeId: string;
  id: string;
  inventoryId: string;
  itemCode: string;
  lotNumber: string;
  rowId: number;
  salesTxnId: string;
  status: string;
  totalQuantity: number;
  totalWeight: number;
  unitWeight: number;
  manualFocSchemeDetails?: any;
  isManualFOC: boolean;
  schemeDetails?: {};
  productGroupList?: string[];
  actualQuantity?:number;
}
export class CmFocPayload {
  id: string;
  subTxnType: string;
  txnType: string;
}
export class PendingFocSchemesPayload {
  eligibleFocItemDetails: { focItems: FocItemsDto[] };
  eligibleWeight: number;
  eligibleQuantity: number;
  id: string;
  purchaseItemDetails: { purchaseItems: FocPurchaseItemsDto[] };
  schemeName: string;
  salesTxnId: string;
  status: string;
}
export class PendingFocSchemesResponsePayload {
  focSchemes: PendingFocSchemesPayload[];
}
export class KeepFocPending {
  eligibleFocItemDetails: { focItems: FocItemsDto[] };
  purchaseItemDetails: { purchaseItems: FocPurchaseItemsDto[] };
  schemeId: string;
  schemeName: string;
  schemeDetailIds: string[];
  schemeCategory: string;
}
export class KeepFocPendingPayload {
  focSchemes: KeepFocPending[];
  id: string;
  subTxnType: string;
  txnType: string;
}

export interface OrderDetailsForFOC {
  id?: string;
  txnType: TransactionTypeEnum;
  subTxnType: SubTransactionTypeEnum;
  requestPayload?: any;
  focSchemeId?: string[];
}

export interface ABFocSchemeDetailsDto {
  schemeDetailId: string;
  schemeId: string;
  schemeName: string;
  schemeCategory: string;
  weight: number;
  id: string;
  isSelected?: boolean;
  purchaseItems?: FocPurchaseItemsDto[];
}

export interface ABFocConfigData {
  allAbFoc: ABFocSchemeDetailsDto[];
  selectedAbFoc: ABFocSchemeDetailsDto[];
  headerLabel: string;
  searchLabel: string;
  schemeNameLabel: string;
  eligibleWeightLabel: string;
  emptySchemeNameMessage: string;
  isViewMode: boolean;
}

export interface FocNotAddedPopupConfig {
  headerLabel: string;
  infoLabel: string;
}
export class ValidateManualFocPayload {
  locationCode?: string;
  fiscalYear?: string;
  approvedBy?: string;
  CMNumber?: string;
  mobileNumber?: string;
}

export class VerifyManualFocPayload {
  customerID: string;
  manualFocEndDate: number;
  manualFocStartDate: number;
}
