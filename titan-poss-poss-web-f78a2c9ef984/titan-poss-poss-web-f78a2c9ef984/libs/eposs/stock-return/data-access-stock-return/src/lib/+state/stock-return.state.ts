import {
  CFAddress,
  CustomErrors,
  StockReturnItem,
  ProductCategory,
  ProductGroup,
  StoreUser,
  HistoryAdvancedFilterPayload
} from '@poss-web/shared/models';

import { ItemEntity, RequestInvoiceEntity } from './stock-return.entity';

export interface StockReturnState {
  newRequestId: number;
  invoiceNumber: number;
  hasSearchedItem: boolean;
  isLoading: boolean;
  searchedItems: ItemEntity;
  loadedItems: ItemEntity;
  items:ItemEntity;
  sortedItems: ItemEntity;
  CFAddress: CFAddress;
  totalItemCount: number;
  hasIssued: boolean;
  hasSearched: boolean;
  hasLoaded: boolean;
  error: CustomErrors;
  hasUpdated: boolean;
  hasRemovedMultipleItems: boolean;
  hasSelectedProductsSearch: boolean;
  selectedProductsSearchCount: number;
  searchCount: number;
  courierDetails: string[];
  headerLevelDetails: StockReturnItem;
  productCategories: ProductCategory[];
  productGroups: ProductGroup[];
  employeeCodes: string[];
  employeeDetails: StoreUser[];
  invoiceHistory: RequestInvoiceEntity;
  totalHistoryInvoiceItems: number;
  isLoadingHistory: boolean;
  historyType: string;
  advancedFilter: HistoryAdvancedFilterPayload;
  studdedProductGroups: string[];
  isLoadingImage: boolean;
}
