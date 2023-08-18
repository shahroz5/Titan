import {
  ProductDetailsEntity,
  ItemDetailsEntity,
  COItemDetailsEntity
} from './product.entity';
import {
  CustomErrors,
  SearchProductList,
  CashMemoTaxDetails,
  ProductPriceDetails,
  CashMemoItemDetailsResponse,
  CoinDetails,
  CashMemoDetailsResponse,
  ProductDetailsInGrid,
  RsoDetailsPayload,
  CNDetailsResponsePayload,
  COItemDetailsResponse
} from '@poss-web/shared/models';

export class ProductState {
  hasError?: CustomErrors;
  isLoading?: boolean;
  isPriceLoading?: boolean;
  isTaxLoading?: boolean;
  isItemLoading?: boolean;
  isCoinLoading?: boolean;

  //product grid
  searchProductList: SearchProductList[];
  searchProductListCount: number;
  productDetails: ProductDetailsEntity;
  allProductDetails: ProductDetailsEntity;
  productDetailsCount: number;
  RSODetails: RsoDetailsPayload[];
  validateProductAndPriceDetails: ProductPriceDetails;
  taxDetails: CashMemoTaxDetails;
  deleteItemFromCashMemoResponse: {
    responseData: CashMemoItemDetailsResponse;
    itemDetails: ProductDetailsInGrid;
  };
  validateWeight: any;
  itemDetails: ItemDetailsEntity;
  selectedLotNumber: string;
  coinDetails: { itemCode: string; coinDetails: CoinDetails[] };
  priceDetails: ProductPriceDetails;
  itemIDList: { item: any; isUpdate: boolean };
  clearProductGrid: boolean;
  gridSearchEnable: boolean;
  standardPrice: {};
  metalRate: {};
  createOrder: boolean;
  reasons: string[];
  abItemDetails: ItemDetailsEntity;
  selectedItemId: string;
  discountSelected: boolean;
  isABInvokedFirstTime: boolean;
  specificItemDetails: {
    id: string;
    isAdd: boolean;
    loadAutoDiscounts: boolean;
    hasError?: boolean;
  };
  validCoinDetails: { itemCode: string; coinDetails: CoinDetails[] };
  cnDetailsList?: CNDetailsResponsePayload[];
  itemDetailsOperation: string;
  partialUpdateCashMemoResponse?: CashMemoDetailsResponse;

  // CO
  coItemDetails: COItemDetailsEntity;
  deleteItemFromCORes: {
    responseData: COItemDetailsResponse;
    coItemDetails: any;
  };
  specificCOItemDetails: {
    id: string;
    isAdd: boolean;
  };
  clearCOProductGrid: boolean;
}
