import {
  BinCode,
  ConversionHistory,
  ConversionHistoryAdvancedFilterPayload,
  ConversionHistoryItems,
  ConversionInventoryItem,
  ConversionItem,
  ConversionRequestItems,
  ConversionRequestResponse,
  ConversionRequests,
  ConversionResponse,
  CustomErrors,
  ProductPriceDetails
} from '@poss-web/shared/models';
import {
  ConverionRequestEntity,
  ConverionRequestHistoryEntity,
  ItemEntity
} from './conversion.entity';

export interface ConversionState {
  searchedItemsList: ConversionInventoryItem[];
  isSearchingItems: boolean;
  hasSearchedItems: boolean;

  selectedVarient: ItemEntity;
  hasselectedVarient: boolean;

  conversionItems: ConversionItem;
  isLoadingConversionItems: boolean;
  hasConversionItems: boolean;

  ItemSplitResponse: ConversionResponse;
  isSplitting: boolean;
  isSplitted: boolean;

  conversionRequestResponse: ConversionRequestResponse;
  isSendingRequest: boolean;
  hasRequestResponse: boolean;

  conversionRequests: ConverionRequestEntity;
  isLoadingRequests: boolean;
  conversionRequestsCount: number;
  isLoadingCount: boolean;

  searchedConversionRequests: ConverionRequestEntity;
  isSearchingRequests: boolean;
  hasSearchedConversionRequests: boolean;

  selectedRequest: ConversionRequests;
  isLoadingSelectedRequest: boolean;

  selectedRequestData: ConversionRequestItems[];
  isLoadingSelectedRequestData: boolean;

  rsoDetails: string[];
  isLoadingRsoDetails: boolean;
  hasRsoDetails: boolean;

  binCodes: BinCode[];
  isLoading: boolean;
  hasBinCodes: boolean;

  studdedProductGroups: string[];

  error: CustomErrors;
  isLoadingRequestSentHistory: boolean;

  conversionHistory: ConverionRequestHistoryEntity;

  totalElements: number;

  isLoadingHistory: boolean;
  selectedRequestHistory: ConversionHistory;
  conversionHistoryItems: ConversionHistoryItems[];
  historyItemsCount: number;
  requestType: string;
  advancedFilter: ConversionHistoryAdvancedFilterPayload;
  isLoadingImage: boolean;
  standardMetalPriceDetails: any,
  priceDetails: ProductPriceDetails[]
}
