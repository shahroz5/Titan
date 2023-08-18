export interface ItemDetails {
  isEditable: boolean;
  itemCode: string;
  description: string;
  isActive: boolean;
  stoneWeight: string;
  indentType: string;
  isConsignable: boolean;
  maxWeightDeviation: string;
  stdWeight: string;
  productCode: string;
  brandCode: string;
  productType: string;
  materialCode: string;
  supplyChainCode: string;
  itemNature: string;
  stdPrice: string;
  stoneCharges: string;
  leadTime: string;
  hsnSacCode: string;
  purity: string;
  inventoryType: string;
  CFAproductCode: string;
  complexityCode: string;
  pricingType: string;
  taxClass: string;
  findingCode: string;
  size: string;
  finishing: string;
  pricingGroupType: string;
  priceFactor: string;
  karatage: string;
  diamondKaratage: string;
  diamondClarity: string;
  diamondColour: string;
  perGram: boolean;
  saleable: boolean;
  returnable: boolean;
  indentable: boolean;
  // interBrandAcceptable: boolean;
}

export interface ListingPageData {
  itemCode: string;
  description: string;
}

export interface ItemStones {
  id: string;
  isActive: true;
  itemCode: string;
  noOfStones: number;
  stoneCode: string;
}
export interface ItemFilterPayload {
  fromStdValue: number;
  fromStdWeight: number;
  fromStoneCharges: number;
  itemCode: string;
  pricingType: string;
  productCategoryCode: string;
  productGroupCode: string;
  toStdValue: number;
  toStdWeight: number;
  toStoneCharges: number;
}
export interface ItemFilter {
  filterPayload: ItemFilterPayload;
  paginate?: LoadItemListingPayload;
}
export interface LoadItemListingPayload {
  pageIndex: number;
  pageSize: number;
}

export interface LoadItemListingSuccessPayload {
  itemListing: ListingPageData[];
  totalElements: number;
}
