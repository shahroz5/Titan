import { ItemEntity, StockEntity } from './stock-receive.entity';
import {
  CustomErrors,
  Lov,
  BinCode,
  ProductGroup,
  ProductCategory,
  StockReceiveStock,
  AdvanceFilterPayload
} from '@poss-web/shared/models';

/**
 * The interface for Stock Receive State
 */

export const stockReceiveFeatureKey = 'stockReceive';

export interface StockReceiveState {
  pendingFactorySTN: StockEntity;
  isLoadingPendingFactorySTN: boolean;
  pendingBoutiqueSTN: StockEntity;
  isLoadingPendingBoutiqueSTN: boolean;
  pendingMerchandiseSTN: StockEntity;
  isLoadingPendingMerchandiseSTN: boolean;
  pendingCFAInvoice: StockEntity;
  isLoadingPendingCFAInvoice: boolean;
  searchStockResults: StockEntity;
  isSearchingStocks: boolean;
  hasSearchStockResults: boolean;
  searchInvoiceResults: StockEntity;
  isSearchingInvoices: boolean;
  hasSearchInvoiceResults: boolean;
  selectedStock: StockReceiveStock;
  selectedInvoice: StockReceiveStock;
  isLoadingSelectedStock: boolean;
  isTotalMeasuredWeightLoading: boolean;
  isItemsTotalCountLoading: boolean;
  isItemsTotalCountLoaded: boolean;
  items: ItemEntity;
  isItemsLoading: boolean;
  isItemsLoaded: boolean;
  itemsCount: number;
  totalCounts: {
    nonVerifiedItemsTotalCount: number;
    verifiedItemsTotalCount: number;
    isLoaded: boolean;
  };
  binCodes: BinCode[];
  isLoadingBinGroups: boolean;
  remarks: Lov[];
  isLoadingRemarks: boolean;
  verifyItemSuccess: boolean;
  updateItemSuccess: boolean;
  isVerifyingAllItem: boolean;
  isVerifyingAllItemSuccess: boolean;
  isAssigningBinToAllItems: boolean;
  isAssigningBinToAllItemsSuccess: boolean;
  confirmedStock: any;
  isConfirmStockReceiveSuccess: boolean;
  isConfirmingStockReceive: boolean;
  productGroups: ProductGroup[];
  isLoadingProductGroups: boolean;
  productCategories: ProductCategory[];
  isLoadingProductCategories: boolean;
  studdedProductGroups: string[];
  searchReset: {
    reset: boolean;
  };
  error: CustomErrors;
  stockReceiveHistory: StockEntity;
  isLoadingHistory: boolean;
  totalElements: number;
  historyType: string;
  advancedFilter: AdvanceFilterPayload;

  oracleFetchInfo: {
    hasFecthed: boolean;
  };
  totalMeasuredWeight: number;
  isLoadingImage: boolean;
}
