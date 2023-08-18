import {
  ItemEntity,
  ItemListGroupEntity,
  BinToBinTransferEntity
} from './bin-to-bin-transfer.entity';
import {
  BinToBinTransferConfirmTransferResponse,
  BinToBinTransferItemListGroup,
  CustomErrors,
  StoreBin,
  ProductGroup,
  ProductCategory,
  BinToBinTransferHistoryItemHeader,
  AdvancedFilterData,
  Lov
} from '@poss-web/shared/models';

export const binToBinTransferFeatureKey = 'binToBinTransfer';

export interface BinToBinTransferState {
  confirmTransferResponse: BinToBinTransferConfirmTransferResponse;
  searchedItemList: ItemEntity;
  isSearchingItems: boolean;
  hasSearchedItems: boolean;
  itemList: ItemEntity;
  isLoadingItems: boolean;
  isLoadingItemsSuccess: boolean;
  itemsTotalCount: number;
  sourceBins: ItemListGroupEntity;
  sourceBinsTotalCount: number;
  productGroups: ItemListGroupEntity;
  productGroupsTotalCount: number;
  productCategory: ItemListGroupEntity;
  productCategoryTotalCount: number;
  searchedItemListGroups: ItemListGroupEntity;
  searchedItemListGroupsTotalCount: number;
  selectedItemListGroup: BinToBinTransferItemListGroup;
  isLoadingSelectedItemListGroupSuccess: boolean;
  isLoadingItemListGroup: boolean;
  bins: StoreBin[];
  isLoadingBins: boolean;
  error: CustomErrors;

  productGroupOptions: ProductGroup[];
  isLoadingProductGroupOptions: boolean;

  productCategoryOptions: ProductCategory[];
  isLoadingProductCategoryOptions: boolean;

  soruceBinOptions: string[];
  isLoadingSoruceBinOptionsOptions: boolean;

  binToBinHistory: BinToBinTransferEntity;
  isLoadingHistory: boolean;
  binToBinHistoryCount: number;
  isLoadingSelectedHistory: boolean;
  hasSelectedHistory: boolean;
  selectedHistory: BinToBinTransferHistoryItemHeader;
  items: BinToBinTransferEntity;
  advancedFilter: AdvancedFilterData;
  studdedProductGroups: string[];
  itemsTotalValue: number;
  itemsTotalQuantity: number;
  isLoadingImage: boolean;
  binToBinAllowedtotalValue?: number,
  binToBinAllowedtotalQuantity?: number,
  binToBinAllowedtotalItems?: number,
  invalidItems?: string[],
  notInStock?: string[],
  defectTypeList?: Lov[],
  defectCodeList?: Lov[],
  fileId?: number
}
