import { Moment } from 'moment';

export interface Item {
  brandCode: string;
  complexityCode: string;
  configDetails: {};
  description: string;
  indentTypeCode: string;
  isActive: boolean;
  itemCode: string;
  itemDetails: {};
  isEditable: boolean;
  leadTime: number;
  materialCode: string;
  orgCode: string;
  parentItemCode: string;
  pricingGroupType: string;
  productCategoryCode: string;
  productGroupCode: string;
  stdValue: number;
  stdWeight: number;
}
export interface ItemSummary {
  itemCode: string;
  id?: string;
  imageURL?: string;
  thumbnailImageURL?: string;
  productCategoryCode: string;
  productGroupCode: string;
  stdValue: number;
  productCategoryDesc: string;
  productGroupDesc: string;
  isStudded?: boolean;
  taxDetails: any;
  isLoadingImage?: boolean;
  isLoadingThumbnailImage?: boolean;
  isHallmarked:boolean;
}

export interface ItemSearchPayload {
  fromStdValue?: number;
  fromStdWeight?: number;
  fromStoneCharges?: number;
  itemCode: string;
  pricingType?: string;
  productCategoryCode?: string;
  productGroupCode?: string;
  toStdValue?: number;
  toStdWeight?: number;
  toStoneCharges?: number;
}

export interface ItemSummaryConversion {
  childItems: any[];
  complexityCode: string;
  description: string;
  itemCode: string;
  lotNumber: string;
  mfgDate: Moment;
  parentItemCode: string;
  productCategory: string;
  productGroupCode: string;
  productType: string;
  productGroupDescription: string;
  stdValue: number;
  stdWeight: number;
  stoneDetails: {};
}
