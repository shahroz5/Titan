import { ProductState } from './product.state';
import { ProductActions, ProductActionTypes } from './product.actions';
import {
  productDetailsAdapter,
  itemDetailsAdapter,
  COItemDetailsAdapter
} from './product.entity';

export const productFeatureKey = 'product';

export const initialState: ProductState = {
  hasError: null,
  isLoading: false,
  isPriceLoading: false,
  isTaxLoading: false,
  isItemLoading: false,
  isCoinLoading: false,
  searchProductList: [],
  searchProductListCount: -1,
  productDetails: productDetailsAdapter.getInitialState(),
  allProductDetails: productDetailsAdapter.getInitialState(),
  productDetailsCount: -1,
  RSODetails: [],
  reasons: [],
  validateProductAndPriceDetails: null,
  taxDetails: null,
  deleteItemFromCashMemoResponse: {
    responseData: null,
    itemDetails: null
  },
  validateWeight: null,
  itemDetails: itemDetailsAdapter.getInitialState(),
  selectedLotNumber: null,
  coinDetails: { itemCode: null, coinDetails: [] },
  priceDetails: null,
  itemIDList: { item: null, isUpdate: false },
  clearProductGrid: false,
  gridSearchEnable: true,
  standardPrice: null,
  metalRate: null,
  createOrder: false,
  abItemDetails: itemDetailsAdapter.getInitialState(),
  selectedItemId: null,
  discountSelected: false,
  isABInvokedFirstTime: false,
  specificItemDetails: {
    id: null,
    isAdd: null,
    loadAutoDiscounts: false
  },
  validCoinDetails: { itemCode: null, coinDetails: [] },
  cnDetailsList: [],
  itemDetailsOperation: null,
  partialUpdateCashMemoResponse: null,
  coItemDetails: COItemDetailsAdapter.getInitialState(),
  deleteItemFromCORes: {
    responseData: null,
    coItemDetails: null
  },
  specificCOItemDetails: {
    id: null,
    isAdd: null
  },
  clearCOProductGrid: false
};

export function productReducer(
  state: ProductState = initialState,
  action: ProductActions
): ProductState {
  switch (action.type) {
    case ProductActionTypes.SEARCH_PRODUCT:
    case ProductActionTypes.LOAD_RSO_DETAILS:
    case ProductActionTypes.LOAD_REASONS:
    case ProductActionTypes.GET_ITEM_FROM_CASH_MEMO:
    case ProductActionTypes.PARTIAL_UPDATE_ITEM_IN_CASH_MEMO:
    case ProductActionTypes.UPDATE_ITEM_IN_CASH_MEMO:
    case ProductActionTypes.DELETE_ITEM_FROM_CASH_MEMO:
    case ProductActionTypes.VALIDATE_ITEM:
    case ProductActionTypes.GET_ITEM_DETAILS:
    case ProductActionTypes.PARTIAL_UPDATE_CASH_MEMO:
    case ProductActionTypes.DELETE_ITEM_DETAILS:
    case ProductActionTypes.LOAD_CREDIT_NOTE_DETAILS:
    case ProductActionTypes.ADD_ITEM_TO_CO:
    case ProductActionTypes.GET_ITEM_FROM_CO:
    case ProductActionTypes.PARTIAL_UPDATE_ITEM_IN_CO:
    case ProductActionTypes.UPDATE_ITEM_IN_CO:
    case ProductActionTypes.DELETE_ITEM_FROM_CO:
      return {
        ...state,
        isLoading: true,
        hasError: null
      };

    case ProductActionTypes.LOAD_COIN_DETAILS:
      return {
        ...state,
        isCoinLoading: true,
        hasError: null,
        coinDetails: { itemCode: null, coinDetails: [] }
      };

    case ProductActionTypes.LOAD_PRODUCT_DETAILS:
      return {
        ...state,
        isLoading: true,
        hasError: null,
        productDetails: productDetailsAdapter.removeAll(state.productDetails)
      };

    case ProductActionTypes.VALIDATE_PRODUCT_AND_PRICE_DETAILS:
    case ProductActionTypes.LOAD_PRICE_DETAILS:
      return {
        ...state,
        isPriceLoading: true,
        hasError: null,
        priceDetails: null,
        validateProductAndPriceDetails: null
      };

    case ProductActionTypes.LOAD_TAX_DETAILS:
      return { ...state, isTaxLoading: true, hasError: null, taxDetails: null };

    case ProductActionTypes.ADD_ITEM_TO_CASH_MEMO:
      return { ...state, isItemLoading: true, hasError: null };

    case ProductActionTypes.SEARCH_PRODUCT_FAILURE:
    case ProductActionTypes.LOAD_PRODUCT_DETAILS_FAILURE:
    case ProductActionTypes.LOAD_RSO_DETAILS_FAILURE:
    case ProductActionTypes.LOAD_REASONS_FAILURE:
    case ProductActionTypes.GET_ITEM_FROM_CASH_MEMO_FAILURE:
    case ProductActionTypes.DELETE_ITEM_FROM_CASH_MEMO_FAILURE:
    case ProductActionTypes.GET_ITEM_DETAILS_FAILURE:
    case ProductActionTypes.PARTIAL_UPDATE_CASH_MEMO_FAILURE:
    case ProductActionTypes.DELETE_ITEM_DETAILS_FAILURE:
    case ProductActionTypes.LOAD_CREDIT_NOTE_DETAILS_FAILURE:
    case ProductActionTypes.ADD_ITEM_TO_CO_FAILURE:
    case ProductActionTypes.GET_ITEM_FROM_CO_FAILURE:
    case ProductActionTypes.DELETE_ITEM_FROM_CO_FAILURE:
      return {
        ...state,
        hasError: action.payload,
        isLoading: false
      };

    case ProductActionTypes.LOAD_COIN_DETAILS_FAILURE:
    case ProductActionTypes.LOAD_VALID_COIN_DETAILS_FAILURE:
      return {
        ...state,
        hasError: action.payload,
        isCoinLoading: false
      };

    case ProductActionTypes.VALIDATE_PRODUCT_AND_PRICE_DETAILS_FAILURE:
    case ProductActionTypes.LOAD_PRICE_DETAILS_FAILURE:
      return {
        ...state,
        hasError: action.payload,
        isPriceLoading: false
      };
    case ProductActionTypes.LOAD_TAX_DETAILS_FAILURE:
      return {
        ...state,
        hasError: action.payload,
        isTaxLoading: false
      };
    case ProductActionTypes.ADD_ITEM_TO_CASH_MEMO_FAILURE:
      return {
        ...state,
        hasError: action.payload,
        isItemLoading: false
      };

    case ProductActionTypes.SEARCH_PRODUCT_SUCCESS:
      return {
        ...state,
        searchProductList: action.payload,
        searchProductListCount: action.payload.length,
        hasError: null,
        isLoading: false
      };

    case ProductActionTypes.LOAD_PRODUCT_DETAILS_SUCCESS:
      return {
        ...state,
        productDetails: productDetailsAdapter.addMany(
          action.payload,
          state.productDetails
        ),
        allProductDetails: productDetailsAdapter.addMany(
          action.payload,
          state.allProductDetails
        ),
        productDetailsCount: action.payload.length,
        hasError: null,
        isLoading: false
      };

    case ProductActionTypes.LOAD_RSO_DETAILS_SUCCESS:
      return {
        ...state,
        RSODetails: action.payload,
        hasError: null,
        isLoading: false
      };

    case ProductActionTypes.LOAD_REASONS_SUCCESS:
      return {
        ...state,
        reasons: action.payload,
        hasError: null,
        isLoading: false
      };

    case ProductActionTypes.VALIDATE_PRODUCT_AND_PRICE_DETAILS_SUCCESS:
      return {
        ...state,
        validateProductAndPriceDetails: action.payload,
        hasError: null,
        isPriceLoading: false
      };

    case ProductActionTypes.LOAD_TAX_DETAILS_SUCCESS:
      return {
        ...state,
        taxDetails: action.payload,
        hasError: null,
        isTaxLoading: false
      };

    case ProductActionTypes.ADD_ITEM_TO_CASH_MEMO_SUCCESS:
      return {
        ...state,
        isItemLoading: false,
        itemDetails: itemDetailsAdapter.addMany(
          action.payload,
          state.itemDetails
        ),
        specificItemDetails: {
          id: action.payload[0].itemDetails.itemId,
          isAdd: true,
          loadAutoDiscounts: false
        }
        // specificItemId: action.payload[0].itemDetails.itemId
      };

    case ProductActionTypes.GET_ITEM_FROM_CASH_MEMO_SUCCESS:
      const getItemId = (action.payload[0].itemDetails
        .itemId as string).toUpperCase();
      const entityIDs: string[] = [];
      state.itemDetails.ids.forEach(idData => {
        entityIDs.push((idData as string).toUpperCase());
      });
      if (entityIDs.includes(getItemId)) {
        return {
          ...state,
          isLoading: false,
          itemDetails: itemDetailsAdapter.updateOne(
            {
              id: getItemId,
              changes: {
                ...action.payload[0],
                itemId: getItemId
              }
            },
            state.itemDetails
          ),
          specificItemDetails: {
            id: action.payload[0].itemDetails.itemId,
            isAdd: action.isAddFlag,
            loadAutoDiscounts: action.loadAutoDiscounts
          }
          // specificItemId: action.payload[0].itemDetails.itemId
        };
      } else {
        return {
          ...state,
          isLoading: false,
          itemDetails: itemDetailsAdapter.addMany(
            action.payload,
            state.itemDetails
          ),
          // specificItemId: action.payload[0].itemDetails.itemId,
          specificItemDetails: {
            id: action.payload[0].itemDetails.itemId,
            isAdd: action.isAddFlag,
            loadAutoDiscounts: action.loadAutoDiscounts
          },
          allProductDetails: productDetailsAdapter.addMany(
            action.payload[0].product,
            state.allProductDetails
          )
        };
      }

    case ProductActionTypes.GET_ITEM_DETAILS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        abItemDetails: itemDetailsAdapter.addMany(
          action.payload,
          state.abItemDetails
        )
      };

    case ProductActionTypes.PARTIAL_UPDATE_CASH_MEMO_SUCCESS:
      return {
        ...state,
        isLoading: false,
        partialUpdateCashMemoResponse: action.payload
      };

    case ProductActionTypes.PARTIAL_UPDATE_ITEM_IN_CASH_MEMO_SUCCESS:
    case ProductActionTypes.UPDATE_ITEM_IN_CASH_MEMO_SUCCESS:
      const id = (action.payload[0].itemDetails.itemId as string).toUpperCase();
      return {
        ...state,
        isLoading: false,
        itemDetails: itemDetailsAdapter.updateOne(
          {
            id: id,
            changes: {
              ...action.payload[0],
              itemId: id
            }
          },
          state.itemDetails
        ),
        // specificItemId: action.payload[0].itemDetails.itemId
        specificItemDetails: {
          id: action.payload[0].itemDetails.itemId,
          isAdd: false,
          loadAutoDiscounts: false
        }
      };

    case ProductActionTypes.PARTIAL_UPDATE_ITEM_IN_CASH_MEMO_FAILURE:
    case ProductActionTypes.UPDATE_ITEM_IN_CASH_MEMO_FAILURE:
      const itemId = (action.payload.oldData.itemDetails
        .itemId as string).toUpperCase();
      return {
        ...state,
        isLoading: false,
        itemDetails: itemDetailsAdapter.updateOne(
          {
            id: itemId,
            changes: {
              ...action.payload.oldData,
              itemId: itemId
            }
          },
          state.itemDetails
        ),
        specificItemDetails: {
          id: action.payload.oldData.itemDetails.itemId,
          isAdd: false,
          loadAutoDiscounts: false,
          hasError: true
        },
        hasError: action.payload.error
      };

    case ProductActionTypes.DELETE_ITEM_FROM_CASH_MEMO_SUCCESS:
      return {
        ...state,
        isLoading: false,
        itemDetails: itemDetailsAdapter.removeOne(
          (action.payload.itemId as string).toUpperCase(),
          state.itemDetails
        ),
        deleteItemFromCashMemoResponse: {
          responseData: action.payload.data,
          itemDetails: action.payload.itemDetails
        }
      };

    case ProductActionTypes.DELETE_ITEM_DETAILS_SUCCESS:
      return {
        ...state,
        isLoading: false
      };

    case ProductActionTypes.VALIDATE_ITEM_SUCCESS:
      return {
        ...state,
        isLoading: false,
        validateWeight: {
          isSuccess: action.payload.isSuccess,
          toleranceLimit: action.payload.toleranceLimit
        }
      };

    case ProductActionTypes.VALIDATE_ITEM_FAILURE:
      return {
        ...state,
        validateWeight: 'error',
        hasError: action.payload.error,
        isLoading: false
      };

    case ProductActionTypes.LOAD_SELECTED_LOTNUMBER_DETAILS:
      return {
        ...state,
        selectedLotNumber: action.payload
      };

    case ProductActionTypes.LOAD_SELECTED_ITEM_DETAILS:
      return {
        ...state,
        selectedItemId: action.payload
      };

    case ProductActionTypes.RESET_VALUES:
      return {
        ...state,
        hasError: null,
        isLoading: false,
        isPriceLoading: false,
        isTaxLoading: false,
        isItemLoading: false,
        searchProductList: [],
        searchProductListCount: -1,
        productDetails: productDetailsAdapter.removeAll(state.productDetails),
        allProductDetails: productDetailsAdapter.removeAll(
          state.allProductDetails
        ),
        productDetailsCount: -1,
        RSODetails: [],
        reasons: [],
        validateProductAndPriceDetails: null,
        taxDetails: null,
        deleteItemFromCashMemoResponse: {
          responseData: null,
          itemDetails: null
        },
        validateWeight: null,
        itemDetails: itemDetailsAdapter.removeAll(state.itemDetails),
        selectedLotNumber: null,
        coinDetails: { itemCode: null, coinDetails: [] },
        priceDetails: null,
        itemIDList: { item: null, isUpdate: false },
        clearProductGrid: false,
        standardPrice: null,
        metalRate: null,
        createOrder: false,
        gridSearchEnable: true,
        abItemDetails: itemDetailsAdapter.removeAll(state.abItemDetails),
        selectedItemId: null,
        discountSelected: false,
        isCoinLoading: false,
        isABInvokedFirstTime: false,
        specificItemDetails: {
          id: null,
          isAdd: false,
          loadAutoDiscounts: false
        },
        validCoinDetails: { itemCode: null, coinDetails: [] }
        // specificItemId: null
      };

    case ProductActionTypes.RESET_LOTNUMBER_VALUES:
      return {
        ...state,
        selectedLotNumber: null
      };

    case ProductActionTypes.RESET_ITEMID_VALUES:
      return {
        ...state,
        selectedItemId: null
      };

    case ProductActionTypes.RESET_PRODUCT_VALUES:
      return {
        ...state,
        hasError: null,
        isLoading: false,
        isPriceLoading: false,
        isTaxLoading: false,
        isItemLoading: false,
        searchProductList: [],
        searchProductListCount: -1,
        productDetails: productDetailsAdapter.removeAll(state.productDetails),
        productDetailsCount: -1,
        validateProductAndPriceDetails: null,
        taxDetails: null,
        deleteItemFromCashMemoResponse: {
          responseData: null,
          itemDetails: null
        },
        validateWeight: null,
        itemDetails: itemDetailsAdapter.removeAll(state.itemDetails),
        selectedLotNumber: null,
        coinDetails: { itemCode: null, coinDetails: [] },
        priceDetails: null,
        itemIDList: { item: null, isUpdate: false },
        clearProductGrid: false,
        standardPrice: null,
        metalRate: null,
        createOrder: false,
        gridSearchEnable: true,
        selectedItemId: null,
        isCoinLoading: false,
        // specificItemId: null
        specificItemDetails: {
          id: null,
          isAdd: false,
          loadAutoDiscounts: false
        },
        validCoinDetails: { itemCode: null, coinDetails: [] }
      };

    case ProductActionTypes.RESET_COIN_VALUES:
      return {
        ...state,
        priceDetails: null,
        taxDetails: null,
        isPriceLoading: false,
        isTaxLoading: false,
        isItemLoading: false,
        validCoinDetails: null
      };

    case ProductActionTypes.CLEAR_SEARCH_PRODUCT_LIST:
      return {
        ...state,
        searchProductList: [],
        searchProductListCount: 0,
        isLoading: false,
        isPriceLoading: false,
        isTaxLoading: false,
        isItemLoading: false
      };

    case ProductActionTypes.CLEAR_PRODUCT_LIST:
      return {
        ...state,
        productDetails: productDetailsAdapter.removeAll(state.productDetails),
        productDetailsCount: 0,
        isLoading: false,
        isPriceLoading: false,
        isTaxLoading: false,
        isItemLoading: false
      };

    case ProductActionTypes.CLEAR_PRODUCT_RELATED_DETAILS:
      return {
        ...state,
        hasError: null,
        isLoading: false,
        isPriceLoading: false,
        isTaxLoading: false,
        isItemLoading: false,
        searchProductList: [],
        searchProductListCount: -1,
        productDetails: productDetailsAdapter.removeAll(state.productDetails),
        productDetailsCount: -1,
        validateProductAndPriceDetails: null,
        taxDetails: null,
        deleteItemFromCashMemoResponse: {
          responseData: null,
          itemDetails: null
        },
        validateWeight: null,
        selectedLotNumber: null,
        priceDetails: null,
        selectedItemId: null
      };

    case ProductActionTypes.CLEAR_VALIDATE_ITEM:
      return {
        ...state,
        validateWeight: null,
        hasError: null,
        isLoading: false
      };

    case ProductActionTypes.LOAD_COIN_DETAILS_SUCCESS:
      return {
        ...state,
        coinDetails: action.payload,
        hasError: null,
        isCoinLoading: false
      };

    case ProductActionTypes.LOAD_PRICE_DETAILS_SUCCESS:
      return {
        ...state,
        priceDetails: action.payload,
        hasError: null,
        isPriceLoading: false
      };

    case ProductActionTypes.SET_ITEMID_LIST:
      return {
        ...state,
        itemIDList: action.payload,
        hasError: null,
        isLoading: false
      };

    case ProductActionTypes.RESET_ITEMID_LIST:
      return {
        ...state,
        hasError: null,
        isLoading: false,
        itemDetails: itemDetailsAdapter.removeAll(state.itemDetails)
      };

    case ProductActionTypes.CLEAR_PRODUCT_GRID:
      return {
        ...state,
        clearProductGrid: true,
        hasError: null,
        isLoading: false
      };

    case ProductActionTypes.SET_STANDARD_PRICE:
      return {
        ...state,
        standardPrice: action.payload,
        hasError: null,
        isLoading: false
      };

    case ProductActionTypes.SET_GRID_SEARCH_ENABLE:
      return {
        ...state,
        hasError: null,
        isLoading: false,
        gridSearchEnable: action.payload
      };

    case ProductActionTypes.SET_METAL_RATE:
      return {
        ...state,
        metalRate: action.payload,
        hasError: null,
        isLoading: false
      };

    case ProductActionTypes.SET_CREATE_ORDER:
      return {
        ...state,
        createOrder: action.payload,
        hasError: null,
        isLoading: false
      };

    case ProductActionTypes.SET_DISCOUNT_SELECTED:
      return {
        ...state,
        discountSelected: action.payload,
        hasError: null,
        isLoading: false
      };

    case ProductActionTypes.SET_AB_INVOKED_FIRST_TIME:
      return {
        ...state,
        isABInvokedFirstTime: action.payload
      };
    case ProductActionTypes.SET_ITEM_DETAILS_OPERATION:
      return {
        ...state,
        itemDetailsOperation: action.payload,
        hasError: null,
        isLoading: false
      };

    case ProductActionTypes.LOAD_VALID_COIN_DETAILS:
      return {
        ...state,
        isCoinLoading: true,
        hasError: null,
        validCoinDetails: { itemCode: null, coinDetails: [] }
      };

    case ProductActionTypes.LOAD_VALID_COIN_DETAILS_SUCCESS:
      return {
        ...state,
        validCoinDetails: action.payload,
        hasError: null,
        isCoinLoading: false
      };

    case ProductActionTypes.LOAD_CREDIT_NOTE_DETAILS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        cnDetailsList: action.payload
      };

    // CO

    case ProductActionTypes.ADD_ITEM_TO_CO_SUCCESS:
      return {
        ...state,
        isLoading: false,
        coItemDetails: COItemDetailsAdapter.addMany(
          action.payload,
          state.coItemDetails
        ),
        specificCOItemDetails: {
          id: action.payload[0].itemDetails.itemId,
          isAdd: true
        }
      };

    case ProductActionTypes.GET_ITEM_FROM_CO_SUCCESS:
      console.log('get item for co payload', action.payload);
      const getCOItemId = (action.payload[0].itemDetails
        .itemId as string).toUpperCase();
      const entityCOIDs: string[] = [];
      state.coItemDetails.ids.forEach(idData => {
        entityCOIDs.push((idData as string).toUpperCase());
      });
      if (entityCOIDs.includes(getCOItemId)) {
        return {
          ...state,
          isLoading: false,
          coItemDetails: COItemDetailsAdapter.updateOne(
            {
              id: getCOItemId,
              changes: {
                ...action.payload[0],
                itemId: getCOItemId
              }
            },
            state.coItemDetails
          ),
          specificCOItemDetails: {
            id: action.payload[0].itemDetails.itemId,
            isAdd: action.isAddFlag
          }
        };
      } else {
        return {
          ...state,
          isLoading: false,
          coItemDetails: COItemDetailsAdapter.addMany(
            action.payload,
            state.coItemDetails
          ),
          specificCOItemDetails: {
            id: action.payload[0].itemDetails.itemId,
            isAdd: action.isAddFlag
          }
        };
      }

    case ProductActionTypes.PARTIAL_UPDATE_ITEM_IN_CO_SUCCESS:
    case ProductActionTypes.UPDATE_ITEM_IN_CO_SUCCESS:
      const coId = (action.payload[0].itemDetails
        .itemId as string).toUpperCase();
      return {
        ...state,
        isLoading: false,
        coItemDetails: COItemDetailsAdapter.updateOne(
          {
            id: coId,
            changes: {
              ...action.payload[0],
              itemId: coId
            }
          },
          state.coItemDetails
        ),
        specificCOItemDetails: {
          id: action.payload[0].itemDetails.itemId,
          isAdd: false
        }
      };

    case ProductActionTypes.PARTIAL_UPDATE_ITEM_IN_CO_FAILURE:
    case ProductActionTypes.UPDATE_ITEM_IN_CO_FAILURE:
      const coItemId = (action.payload.oldData.itemDetails
        .itemId as string).toUpperCase();
      return {
        ...state,
        isLoading: false,
        coItemDetails: COItemDetailsAdapter.updateOne(
          {
            id: coItemId,
            changes: {
              ...action.payload.oldData,
              itemId: coItemId
            }
          },
          state.coItemDetails
        ),
        hasError: action.payload.error
      };

    case ProductActionTypes.DELETE_ITEM_FROM_CO_SUCCESS:
      return {
        ...state,
        isLoading: false,
        coItemDetails: COItemDetailsAdapter.removeOne(
          (action.payload.itemId as string).toUpperCase(),
          state.coItemDetails
        ),
        deleteItemFromCORes: {
          responseData: action.payload.data,
          coItemDetails: action.payload.itemDetails
        }
      };

    case ProductActionTypes.CLEAR_CO_PRODUCT_GRID:
      return {
        ...state,
        clearCOProductGrid: action.payload,
        hasError: null,
        isLoading: false
      };

    case ProductActionTypes.RESET_CO_VALUES:
      return {
        ...state,
        hasError: null,
        isLoading: false,
        deleteItemFromCORes: {
          responseData: null,
          coItemDetails: null
        },
        coItemDetails: COItemDetailsAdapter.removeAll(state.coItemDetails),
        specificCOItemDetails: {
          id: null,
          isAdd: null
        },
        clearCOProductGrid: false,
        itemIDList: { item: null, isUpdate: false }
      };
    default:
      return state;
  }
}
