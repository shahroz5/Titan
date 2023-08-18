export interface ImageUrlData{
    itemCode: string,
    imageUrl: any
}

export interface ImageReqPayload {
    id: string;
    imageUrl: string;
    imageCatalogueDetails: any;
    itemCode?: string;
    isSearchedItem?: boolean;
    isChildItems?: boolean;
    isHistoryItems?: boolean;
    isCancelItems?: boolean;
    isAdjustmentItems?: boolean;
    isPSVItems?: boolean;
    isVerifiedItems?: boolean
  }
  
  export interface ImageResponse {
    id: string;
    imageUrl?: any;
    thumbnailImageUrl?: any;
    itemCode?: string;
    isSearchedItem?: boolean;
    isChildItems?: boolean;
    isHistoryItems?: boolean;
    isCancelItems?: boolean;
    isAdjustmentItems?: boolean;
    isPSVItems?: boolean;
    isVerifiedItems?: boolean
  }
  
  export interface ImageEvent {
    id: string;
    imageUrl: string;
    itemCode?: string;
  }