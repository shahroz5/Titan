import { initialState } from './bin-to-bin-transfer.reducer';
// you will need to assert that the store is calling the right selector function.
import * as selectors from './bin-to-bin-transfer.selectors';
import {
  itemAdapter,
  itemListGroupAdapter,
  binToBinTransferHistoryAdaptor
} from './bin-to-bin-transfer.entity';
import { BinToBinTransferState } from './bin-to-bin-transfer.state';
import {
  CustomErrors,
  BinToBinTransferItemListGroup,
  BinToBinTransferItem,
  ProductGroup,
  ProductCategory,
  StoreBin,
  AdvancedFilterData
} from '@poss-web/shared/models';
import * as moment from 'moment';

describe('Testing Bin to Bin Transfer related Selectors', () => {
  const itemGroupData1: BinToBinTransferItemListGroup = {
    id: '11',
    name: '71',
    products: 16,
    totalValue: 826133.1,
    totalWeight: 269.728,
    currencyCode: 'INR',
    weightUnit: 'gms',
    description: 'Gold Plain'
  };

  const itemGroupData2: BinToBinTransferItemListGroup = {
    id: '12',
    name: '71',
    products: 16,
    totalValue: 826133.1,
    totalWeight: 269.728,
    currencyCode: 'INR',
    weightUnit: 'gms',
    description: 'Gold Plain'
  };

  const itemData1: BinToBinTransferItem = {
    id: 'B948E97B-BBB8-4C77-9383-1712B570F711',
    itemCode: '511178VHIU1A00',
    lotNumber: '2EA001188',
    mfgDate: moment(),
    productCategory: 'V',
    productGroup: '71',
    productCategoryDesc: 'BANGLES',
    productGroupDesc: 'Gold Plain',
    binCode: 'CHAIN',
    binGroupCode: 'STN',
    stdValue: 88213.86,
    stdWeight: 28.75,
    currencyCode: 'INR',
    weightUnit: 'gms',
    imageURL: '/productcatalogue/ProductImages/1178VHI.jpg',
    itemDetails: {},
    availableWeight: 28.75,
    availableValue: 88213.86,
    availableQuantity: 1,
    isSelected: false,
    isDisabled: false,
    destinationBinGroupCode: null,
    destinationBinCode: null,
    isStudded: true,
    thumbnailImageURL: 'abc',
    isLoadingThumbnailImage: false,
    isLoadingImage: false
  };

  const itemData2: BinToBinTransferItem = {
    id: 'B948E97B-BBB8-4C77-9383-1712B570F713',
    itemCode: '511178VHIU1A00',
    lotNumber: '2EA001188',
    mfgDate: moment(),
    productCategory: 'V',
    productGroup: '71',
    productCategoryDesc: 'BANGLES',
    productGroupDesc: 'Gold Plain',
    binCode: 'CHAIN',
    binGroupCode: 'STN',
    stdValue: 88213.86,
    stdWeight: 28.75,
    currencyCode: 'INR',
    weightUnit: 'gms',
    imageURL: '/productcatalogue/ProductImages/1178VHI.jpg',
    itemDetails: {},
    availableWeight: 28.75,
    availableValue: 88213.86,
    availableQuantity: 1,
    isSelected: false,
    isDisabled: false,
    destinationBinGroupCode: null,
    destinationBinCode: null,
    isStudded: true,
    thumbnailImageURL: 'abc',
    isLoadingThumbnailImage: false,
    isLoadingImage: false
  };

  const history1 = {
    id: '111',
    transactionType: 'BIN_BIN',
    locationCode: 'URB',
    srcDocNo: 123,
    srcFiscalYear: 2019,
    srcDocDate: moment(),
    destDocNo: 1223,
    destDocDate: '11-MAR-2020',
    totalAvailableQuantity: 10,
    totalMeasuredQuantity: 10,
    locationCodeDescription: 'Desc',
    totalAvailableValue: 1000,
    totalMeasuredValue: 1000,
    totalAvailableWeight: 1000,
    totalMeasuredWeight: 1000,
    carrierDetails: {},
    weightUnit: 'gms',
    currencyCode: 'INR',
    status: 'OPEN',
    destFiscalYear: 2019,
    remarks: 'Remarks',
    otherDetails: {}
  };

  const history2 = {
    id: '112',
    transactionType: 'BIN_BIN',
    locationCode: 'URB',
    srcDocNo: 123,
    srcFiscalYear: 2019,
    srcDocDate: moment(),
    destDocNo: 1223,
    destDocDate: '11-MAR-2020',
    totalAvailableQuantity: 10,
    totalMeasuredQuantity: 10,
    locationCodeDescription: 'Desc',
    totalAvailableValue: 1000,
    totalMeasuredValue: 1000,
    totalAvailableWeight: 1000,
    totalMeasuredWeight: 1000,
    carrierDetails: {},
    weightUnit: 'gms',
    currencyCode: 'INR',
    status: 'OPEN',
    destFiscalYear: 2019,
    remarks: 'Remarks',
    otherDetails: {}
  };
  describe('Item Group Selectors', () => {
    const itemGroupArray = [itemGroupData1, itemGroupData2];
    const itemGroupArrayEntity = itemListGroupAdapter.setAll(itemGroupArray, {
      ...itemListGroupAdapter.getInitialState()
    });

    it('Should return source bin Entity', () => {
      const state: BinToBinTransferState = {
        ...initialState,
        sourceBins: itemGroupArrayEntity
      };
      expect(selectors.sourceBins.projector(state)).toEqual(
        itemGroupArrayEntity
      );
    });

    it('Should return source bins ', () => {
      expect(
        selectors.selectSourceBins.projector(itemGroupArrayEntity)
      ).toEqual(itemGroupArray);
    });

    it('Should return product category Entity', () => {
      const state: BinToBinTransferState = {
        ...initialState,
        productCategory: itemGroupArrayEntity
      };
      expect(selectors.productCategory.projector(state)).toEqual(
        itemGroupArrayEntity
      );
    });

    it('Should return product categories ', () => {
      expect(
        selectors.selectProductCategory.projector(itemGroupArrayEntity)
      ).toEqual(itemGroupArray);
    });

    it('Should return product group Entity', () => {
      const state: BinToBinTransferState = {
        ...initialState,
        productGroups: itemGroupArrayEntity
      };
      expect(selectors.productGroups.projector(state)).toEqual(
        itemGroupArrayEntity
      );
    });

    it('Should return product groups ', () => {
      expect(
        selectors.selectProductGroups.projector(itemGroupArrayEntity)
      ).toEqual(itemGroupArray);
    });

    it('Should return searched Item groups Entity', () => {
      const state: BinToBinTransferState = {
        ...initialState,
        searchedItemListGroups: itemGroupArrayEntity
      };
      expect(selectors.searchedItemListGroups.projector(state)).toEqual(
        itemGroupArrayEntity
      );
    });

    it('Should return searched Item groups ', () => {
      expect(
        selectors.selectSearchedItemListGroups.projector(itemGroupArrayEntity)
      ).toEqual(itemGroupArray);
    });

    it('Should return selected Item groups ', () => {
      const state: BinToBinTransferState = {
        ...initialState,
        selectedItemListGroup: itemGroupData1
      };
      expect(selectors.selectSelectedItemListGroup.projector(state)).toEqual(
        itemGroupData1
      );
    });

    it('Should return total count of source bins', () => {
      const count = 11;
      const state: BinToBinTransferState = {
        ...initialState,
        sourceBinsTotalCount: count
      };
      expect(selectors.selectSourceBinsTotalCount.projector(state)).toEqual(
        count
      );
    });

    it('Should return total count of product groups', () => {
      const count = 11;
      const state: BinToBinTransferState = {
        ...initialState,
        productGroupsTotalCount: count
      };
      expect(selectors.selectProductGroupsTotalCount.projector(state)).toEqual(
        count
      );
    });

    it('Should return total count of product categroy', () => {
      const count = 11;
      const state: BinToBinTransferState = {
        ...initialState,
        productCategoryTotalCount: count
      };
      expect(
        selectors.selectProductCategoryTotalCount.projector(state)
      ).toEqual(count);
    });

    it('Should return total count of searched item group', () => {
      const count = 11;
      const state: BinToBinTransferState = {
        ...initialState,
        searchedItemListGroupsTotalCount: count
      };
      expect(
        selectors.selectSearchedItemListGroupsTotalCount.projector(state)
      ).toEqual(count);
    });

    it('Should return loading status of item group', () => {
      const isloading = true;
      const state: BinToBinTransferState = {
        ...initialState,
        isLoadingItemListGroup: isloading
      };
      expect(selectors.selectIsLoadingItemListGroup.projector(state)).toEqual(
        isloading
      );
    });

    it('Should return loading status of selected item group', () => {
      const isloading = true;
      const state: BinToBinTransferState = {
        ...initialState,
        isLoadingSelectedItemListGroupSuccess: isloading
      };
      expect(
        selectors.selectIsLoadingSelectedItemListGroupSuccess.projector(state)
      ).toEqual(isloading);
    });
  });

  describe('Filter option Selectors', () => {
    it('Should return  product group options ', () => {
      const productGroupOptions: ProductGroup[] = [
        {
          description: 'Test1',
          productGroupCode: 'Test1'
        },
        {
          description: 'Test1',
          productGroupCode: 'Test1'
        }
      ];
      const state: BinToBinTransferState = {
        ...initialState,
        productGroupOptions: productGroupOptions
      };
      expect(selectors.selectProductGroupOptions.projector(state)).toEqual(
        productGroupOptions
      );
    });

    it('Should return  product category options ', () => {
      const productCategoryOptions: ProductCategory[] = [
        {
          description: 'Test1',
          productCategoryCode: 'Test1'
        },
        {
          description: 'Test1',
          productCategoryCode: 'Test1'
        }
      ];
      const state: BinToBinTransferState = {
        ...initialState,
        productCategoryOptions: productCategoryOptions
      };
      expect(selectors.selectProductCategoryOptions.projector(state)).toEqual(
        productCategoryOptions
      );
    });
    it('Should return  soruce bin options ', () => {
      const soruceBinOptions: string[] = ['Test1', 'Test2'];

      const state: BinToBinTransferState = {
        ...initialState,
        soruceBinOptions: soruceBinOptions
      };
      expect(selectors.selectSoruceBinOptions.projector(state)).toEqual(
        soruceBinOptions
      );
    });

    it('Should return loading status of soruce bin options ', () => {
      const isloading = true;

      const state: BinToBinTransferState = {
        ...initialState,
        isLoadingSoruceBinOptionsOptions: isloading
      };
      expect(
        selectors.selectIsLoadingSoruceBinOptionsOptions.projector(state)
      ).toEqual(isloading);
    });

    it('Should return loading status of product group options ', () => {
      const isloading = true;

      const state: BinToBinTransferState = {
        ...initialState,
        isLoadingProductGroupOptions: isloading
      };
      expect(
        selectors.selectIsLoadingProductGroupOptions.projector(state)
      ).toEqual(isloading);
    });

    it('Should return loading status of product category options ', () => {
      const isloading = true;

      const state: BinToBinTransferState = {
        ...initialState,
        isLoadingProductCategoryOptions: isloading
      };
      expect(
        selectors.selectIsLoadingProductCategoryOptions.projector(state)
      ).toEqual(isloading);
    });
  });

  describe('Item related Selectors', () => {
    const itemArray = [itemData1, itemData2];
    const itemArrayEntity = itemAdapter.setAll(itemArray, {
      ...itemAdapter.getInitialState()
    });

    it('Should return item Entity', () => {
      const state: BinToBinTransferState = {
        ...initialState,
        itemList: itemArrayEntity
      };
      expect(selectors.itemList.projector(state)).toEqual(itemArrayEntity);
    });

    it('Should return items', () => {
      expect(selectors.selectItemList.projector(itemArrayEntity)).toEqual(
        itemArray
      );
    });

    it('Should return searched item Entity', () => {
      const state: BinToBinTransferState = {
        ...initialState,
        searchedItemList: itemArrayEntity
      };
      expect(selectors.searchedItemList.projector(state)).toEqual(
        itemArrayEntity
      );
    });

    it('Should return searched items', () => {
      expect(
        selectors.selectSearchedItemList.projector(itemArrayEntity)
      ).toEqual(itemArray);
    });

    it('Should return total count of items', () => {
      const count = 11;
      const state: BinToBinTransferState = {
        ...initialState,
        itemsTotalCount: count
      };
      expect(selectors.selectItemsTotalCount.projector(state)).toEqual(count);
    });

    it('Should return loading status of items', () => {
      const isloading = true;
      const state: BinToBinTransferState = {
        ...initialState,
        isLoadingItems: isloading
      };
      expect(selectors.selectIsLoadingItems.projector(state)).toEqual(
        isloading
      );
    });

    it('Should return loading status of items', () => {
      const isloaded = true;
      const state: BinToBinTransferState = {
        ...initialState,
        isLoadingItemsSuccess: isloaded
      };
      expect(selectors.selectIsLoadingItemsSuccess.projector(state)).toEqual(
        isloaded
      );
    });

    it('Should return loading status of searched items', () => {
      const isloading = true;
      const state: BinToBinTransferState = {
        ...initialState,
        isSearchingItems: isloading
      };
      expect(selectors.selectIsSearchingItems.projector(state)).toEqual(
        isloading
      );
    });

    it('Should return loading status of searched items', () => {
      const isloaded = true;
      const state: BinToBinTransferState = {
        ...initialState,
        hasSearchedItems: isloaded
      };
      expect(selectors.selectHasSearchedItems.projector(state)).toEqual(
        isloaded
      );
    });
  });

  describe('Destination bins Selectors', () => {
    it('Should return  Destination bin options ', () => {
      const bins: StoreBin[] = [
        {
          binCode: 'Test1',
          binGroupCode: 'Test1'
        },
        { binCode: 'Test2', binGroupCode: 'Test2' }
      ];

      const state: BinToBinTransferState = {
        ...initialState,
        bins: bins
      };
      expect(selectors.selectBins.projector(state)).toEqual(bins);
    });

    it('Should return loading status of Destination bin options ', () => {
      const isloading = true;

      const state: BinToBinTransferState = {
        ...initialState,
        isLoadingBins: isloading
      };
      expect(selectors.selectIsLoadingBins.projector(state)).toEqual(isloading);
    });
  });

  describe('History Selectors', () => {
    const historyArray = [history1, history2];
    const historyArrayEntity = binToBinTransferHistoryAdaptor.setAll(
      historyArray,
      {
        ...binToBinTransferHistoryAdaptor.getInitialState()
      }
    );

    it('Should return history Entity', () => {
      const state: BinToBinTransferState = {
        ...initialState,
        binToBinHistory: historyArrayEntity
      };
      expect(selectors.binToBinHistory.projector(state)).toEqual(
        historyArrayEntity
      );
    });

    it('Should return histories ', () => {
      expect(
        selectors.selectbinToBinHistory.projector(historyArrayEntity)
      ).toEqual(historyArray);
    });

    it('Should return total count of history', () => {
      const count = 11;
      const state: BinToBinTransferState = {
        ...initialState,
        binToBinHistoryCount: count
      };
      expect(selectors.selectBinToBinHistoryCount.projector(state)).toEqual(
        count
      );
    });

    it('Should return loading status of history', () => {
      const isloading = true;
      const state: BinToBinTransferState = {
        ...initialState,
        isLoadingHistory: isloading
      };
      expect(selectors.selectIsLoadingBinToBinHistory.projector(state)).toEqual(
        isloading
      );
    });

    it('Should return loading status of selected history', () => {
      const isloading = true;
      const state: BinToBinTransferState = {
        ...initialState,
        isLoadingSelectedHistory: isloading
      };
      expect(selectors.selectIsLoadingSelectedHistory.projector(state)).toEqual(
        isloading
      );
    });

    it('Should return loading status of selected history', () => {
      const isloaded = true;
      const state: BinToBinTransferState = {
        ...initialState,
        hasSelectedHistory: isloaded
      };
      expect(selectors.selectHasSelectedHistory.projector(state)).toEqual(
        isloaded
      );
    });

    it('Should return  selected history', () => {
      const selectedHistory = history1;
      const state: BinToBinTransferState = {
        ...initialState,
        selectedHistory: selectedHistory
      };
      expect(selectors.selectSelectedHistory.projector(state)).toEqual(
        selectedHistory
      );
    });

    it('Should return  selected Advance filter ', () => {
      const advancedFilter: AdvancedFilterData = {
        startDate: '12-02-2020',
        endDate: '15-02-2020',
        fiscalYear: 2020
      };
      const state: BinToBinTransferState = {
        ...initialState,
        advancedFilter: advancedFilter
      };
      expect(selectors.selectHistoryFilterData.projector(state)).toEqual(
        advancedFilter
      );
    });
  });

  it('Should return the error', () => {
    const error: CustomErrors = {
      code: 'ERR_1',
      message: 'Error',
      traceId: 'TraceID',
      timeStamp: '122131',
      error: null
    };
    const state: BinToBinTransferState = {
      ...initialState,
      error: error
    };
    expect(selectors.selectError.projector(state)).toEqual(error);
  });

  it('Should return confirmation response', () => {
    const confirmTransferResponse = { transferId: 123 };
    const state: BinToBinTransferState = {
      ...initialState,
      confirmTransferResponse: confirmTransferResponse
    };
    expect(selectors.selectConfirmTransferResponse.projector(state)).toEqual(
      confirmTransferResponse
    );
  });
});
