import { Observable } from 'rxjs';
import { ItemDetailsPopupTabType } from './item-details.enum';
import { Moment } from 'moment';
import { PriceBreakup } from '../cash-memo/cash-memo.model';

export interface ItemStoneDetails {
  color: string;
  description: string;
  noOfStones: number;
  price: number;
  quality: string;
  ratePerCarat: number;
  stoneCode: string;
  stoneWeight: number;
  currencyCode: string;
  weightUnit: string;
}

export interface ItemDetailsPopupData {
  title?: string;
  tabs: ItemDetailsPopupTabType[];
  headerDetails: ItemDetailsPopupHeaderData;
  priceBreakup?: PriceBreakup;
  currencyCode: string;
  weightUnit: string;
}

export interface ItemDetailsPopupHeaderData {
  showTitle: boolean;
  itemCode: string;
  lotNumber: string | number;
  productGroup: string;
  productCategory: string;
  grossWeight: number;
  goldRate?: {
    karat: string;
    price: number;
  };
  netWeight?: number;
  calculateNetWight?: boolean;
  getDescription?: boolean;
  platinumRate?: {
    purity: string;
    price: number;
  };
  locationCode?: string;
  selectedAutoDiscounts?: any;
  silverRate?: {
    purity: string;
    price: number;
  };
  isCOMOrder?: boolean;
  materialWeight?:number;
}

export interface ItemData {
  itemCode: string;
  lotNumber: string;
  productGroup: string;
  productCategory: string;
  stdValue: number;
  stdWeight: number;
  currencyCode: string;
  weightUnit: string;
  imageURL: string;
  thumbnailURL: string;
  mfgDate: Moment;
  orderType?: string;
  isStudded?: boolean;
  hideImage?: boolean;
  isHallmarked?: boolean;
  taxDetails?: any;
  sold?: string;
  finalValue?: number;
  karat?: number;
  isLoadingImage?: boolean;
  isLoadingThumbnailImage?: boolean;
  itemDetails?: any;
}

export interface ImageUrlDetails {
  baseurl: string;
  vendorDetails: {
    data: {
      apikey: string;
      usertoken: string;
    };
  };
}
export abstract class ItemDetailPopupserviceAbstraction {
  public abstract open(itemData: ItemDetailsPopupData): Observable<any>;
}

export abstract class ItemPreviewPopupserviceAbstraction {
  public abstract open(itemData: string): Observable<any>;
}
