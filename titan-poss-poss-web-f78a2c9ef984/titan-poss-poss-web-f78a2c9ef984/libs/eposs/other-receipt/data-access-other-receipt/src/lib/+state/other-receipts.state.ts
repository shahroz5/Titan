import {
  OtherReceiptEntity,
  AdjustmentEntity,
  ItemEntity
} from './other-receipts.entity';
import {
  BinCode,
  Lov,
  OtherReceiptsModel,
  Errors,
  CustomErrors,
  ItemSummary,
  AdjustmentItem,
  ProductCategory,
  ProductGroup,
  Filter,
  Column,
  OtherReceiptTransferType
} from '@poss-web/shared/models';

export interface OtherReceiptState {
  pendingOtherReceiptsSTNCount: number;

  hasError?: string;
  isLoading: boolean;

  isSearchingStocks: boolean;
  hasSearchStockResults: boolean;
  searchStockResults: OtherReceiptEntity;
  otherReceiptList: OtherReceiptEntity;

  otherReceiptLoanList: OtherReceiptEntity;

  isLoadingOtherReceiptList: boolean;
  isLoadingOtherReceiptLoanList: boolean;

  nonVerifiedItems: ItemEntity;
  isNonVerifiedItemsLoading: boolean;
  nonVerifiedItemsTotalCount: number;
  itemsCountNonVerified: number;
  printDataResponse: any;
  itemsCountVerified: number;
  isNonVerifiedItemsLoaded: boolean;
  isVerifiedItemsLoaded: boolean;
  isVerifyingAllItem: boolean;
  verifiedItems: ItemEntity;
  isVerifiedItemsLoading: boolean;
  verifiedItemsTotalCount: number;

  isItemsTotalCountLoaded: boolean;
  isItemsTotalCountLoading: boolean;

  isSearchingItems: boolean;
  hasSearchedItems: boolean;

  binCodes: BinCode[];
  remarks: Lov[];

  selectedStock: OtherReceiptsModel;

  isVerifyingAllItemSuccess: boolean;
  confirmedStock: any;

  confirmStockReceiveErrors: Errors;
  selectedStockLoadError: Errors;
  isAssigningBinToAllItemsSuccess: boolean;
  isAssigningBinToAllItems: boolean;

  isConfirmStockReceiveSuccess: boolean;
  isConfirmingStockReceive: boolean;
  verifyItemSuccess: boolean;
  otherReceiptsDropdownValues: OtherReceiptTransferType[];

  error: CustomErrors;
  selectedDropDownForReceipts: string;
  isItemIssued: boolean;
  totalElementsOtherReceipts: number;
  isLoadingBinGroups: boolean;
  isLoadingRemarks: boolean;
  isLoadingSelectedStock: boolean;
  updateItemSuccess: boolean;

  isSearchingAdjustmentItems?: boolean;
  adjustmentSearchedItems: ItemSummary;
  hasSearchedAdjustmentItems?: boolean;
  isLoadingAdjustment: boolean;
  itemsInCarts: AdjustmentEntity;
  adjustmentSearchedItemsCount: number;
  confirmAdjustementItemResponse: AdjustmentItem;

  adjustmentItemsInCartsSearch: AdjustmentEntity;
  hasSearchItemInCartSearchAdjustment: boolean;
  otherReceiptADJList: OtherReceiptEntity;
  isLoadingOtherReceiptADJList: boolean;
  studdedProductGroups: string[];
  isSearchingPSVItems?: boolean;
  hasSearchedItemPSV?: boolean;
  psvSearchedItems: ItemSummary;
  itemsInCartsPSV: AdjustmentEntity;
  psvSearchedItemsCount: number;
  confirmPSVItemResponse: AdjustmentItem;
  IsLoadingPSV: boolean;
  psvItemsInCartsSearch: AdjustmentEntity;
  hasSearchItemInCartSearchPSV: boolean;

  productCategories: ProductCategory[];
  productGroups: ProductGroup[];

  filterDataNonVerifiedProducts: { [key: string]: Filter[] };
  filterDataVerifiedProducts: { [key: string]: Filter[] };

  sortDataNonVerifiedProducts: Column[];
  sortDataVerifiedProducts: Column[];
  // HISTORY
  otherReceiptsHistory: OtherReceiptEntity;
  isLoadingHistory: boolean;
  otherReceiptsHistoryCount: number;

  isLoadingSelectedHistory: boolean;
  hasSelectedHistory: boolean;
  selectedHistory: OtherReceiptsModel;
  historyItemsCount: number;
  historyItems: ItemEntity;
  isLoadingHistoryItems: boolean;
  isHistoryItemsLoaded: boolean;

  historyItemsTotalCount: number;
  isLoadingHistoryItemsTotalCount: boolean;
  isHistoryItemsTotalCountLoaded: boolean;
  isLoadingImage: boolean;
}
