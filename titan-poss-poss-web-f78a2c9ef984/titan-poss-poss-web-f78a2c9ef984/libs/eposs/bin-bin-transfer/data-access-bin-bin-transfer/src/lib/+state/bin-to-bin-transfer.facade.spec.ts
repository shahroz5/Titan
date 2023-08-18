import { initialState } from './bin-to-bin-transfer.reducer';

import { Store } from '@ngrx/store';
import { TestBed } from '@angular/core/testing';
import { BinToBinTransferFacade } from './bin-to-bin-transfer.facade';
import { provideMockStore } from '@ngrx/store/testing';
import * as moment from 'moment';
import {
  LoadBins,
  AddToItemList,
  UpdateItemList,
  DeleteFromItemList,
  DeleteSelectedItems,
  LoadHistoryFilterData,
  ChangeSelectionOfAllItems,
  UpdateDestinationBinForSelectedItems,
  LoadSourceBins,
  LoadStuddedProductGroups,
  LoadProductsCategory,
  LoadProductsGroups,
  ClearItemsGroups,
  LoadItemGroup,
  ClearSelectedItemGroup,
  LoadProductGroupOptions,
  LoadProductCategoryOptions,
  ClearConfirmTransferResponse,
  ClearSearchedItems,
  ClearItems,
  ResetLoadedHistory,
  ResetHstoryFilter,
  LoadSourceBinOptions,
  SearchItemGroups,
  LoadItems,
  SearchItems,
  ConfirmTransferAllItems,
  ConfirmTransferItems,
  LoadBinToBinHistory,
  LoadSelectedHistory,
  LoadHistoryItems
} from './bin-to-bin-transfer-actions';
import { BinToBinTransferState } from './bin-to-bin-transfer.state';
import {
  BinToBinTransferItem,
  AdvancedFilterData,
  BinToBinTransferChangeSelectionPayload,
  BinToBinTransferUpdateDestinationBinPayload,
  BinToBinTransferLoadItemGroupsPayload,
  BinToBinTransferLoadItemsPayload,
  BinToBinTransferConfirmTransferAllItemsRequest,
  BinToBinTransferConfirmTransferItemsRequest,
  LoadBinToBinTransferHistoryPayload,
  LoadSelectedBinToBinHeaderInfoPayload,
  BinToBinTransferLoadHistoryItemsPayload
} from '@poss-web/shared/models';

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

describe('Bin To Bin Transfer facade Testing Suite action', () => {
  let binToBinTransferFacade: BinToBinTransferFacade;

  let store: Store<BinToBinTransferState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), BinToBinTransferFacade]
    });

    binToBinTransferFacade = TestBed.inject(BinToBinTransferFacade);
    store = TestBed.inject(Store);
    spyOn(store, 'dispatch').and.returnValue({});
  });

  describe('Dispatch Actions', () => {
    it('should call LoadBins action', () => {
      const action = new LoadBins();
      binToBinTransferFacade.loadBins();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call AddToItemList action', () => {
      const items = [itemData1, itemData2];
      const action = new AddToItemList(items);
      binToBinTransferFacade.addToItemList(items);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call UpdateItemList action', () => {
      const item = itemData1;
      const action = new UpdateItemList(item);
      binToBinTransferFacade.updateItemList(item);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call DeleteFromItemList action', () => {
      const itemId = 'Item ID';
      const action = new DeleteFromItemList(itemId);
      binToBinTransferFacade.deleteFromItemList(itemId);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call DeleteSelectedItems action', () => {
      const itemId = ['Item ID1', 'Item ID2'];
      const action = new DeleteSelectedItems(itemId);
      binToBinTransferFacade.deleteSelectedItems(itemId);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LoadHistoryFilterData action', () => {
      const payload: AdvancedFilterData = {
        startDate: '20-12-2020',
        endDate: '20-10-2020',
        fiscalYear: 2012
      };
      const action = new LoadHistoryFilterData(payload);
      binToBinTransferFacade.loadHistoryFilterData(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call ChangeSelectionOfAllItems action', () => {
      const payload: BinToBinTransferChangeSelectionPayload = {
        select: true,
        disable: false,
        idList: ['ID1', 'ID2'],
        resetBin: false
      };
      const action = new ChangeSelectionOfAllItems(payload);
      binToBinTransferFacade.changeSelectionOfAllItems(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call UpdateDestinationBinForSelectedItems action', () => {
      const payload: BinToBinTransferUpdateDestinationBinPayload = {
        destinationBinGroupCode: 'BINCODE1',
        destinationBinCode: 'BINCODE2',
        idList: ['ID1', 'ID2']
      };
      const action = new UpdateDestinationBinForSelectedItems(payload);
      binToBinTransferFacade.updateDestinationBinForSelectedItems(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LoadSourceBins action', () => {
      const payload: BinToBinTransferLoadItemGroupsPayload = {
        type: 'Type',
        pageIndex: 12,
        pageSize: 10,
        value: 'Value'
      };
      const action = new LoadSourceBins(payload);
      binToBinTransferFacade.loadSourceBins(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LoadStuddedProductGroups action', () => {
      const action = new LoadStuddedProductGroups();
      binToBinTransferFacade.loadStuddedProductGroups();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LoadProductsCategory action', () => {
      const payload: BinToBinTransferLoadItemGroupsPayload = {
        type: 'Type',
        pageIndex: 12,
        pageSize: 10,
        value: 'Value'
      };
      const action = new LoadProductsCategory(payload);
      binToBinTransferFacade.loadProductsCategory(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LoadProductsGroups action', () => {
      const payload: BinToBinTransferLoadItemGroupsPayload = {
        type: 'Type',
        pageIndex: 12,
        pageSize: 10,
        value: 'Value'
      };
      const action = new LoadProductsGroups(payload);
      binToBinTransferFacade.loadProductsGroups(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call ClearItemsGroups action', () => {
      const action = new ClearItemsGroups();
      binToBinTransferFacade.clearItemsGroups();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LoadItemGroup action', () => {
      const payload: BinToBinTransferLoadItemGroupsPayload = {
        type: 'Type',
        pageIndex: 12,
        pageSize: 10,
        value: 'Value'
      };
      const action = new LoadItemGroup(payload);
      binToBinTransferFacade.loadItemGroup(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call ClearSelectedItemGroup action', () => {
      const action = new ClearSelectedItemGroup();
      binToBinTransferFacade.clearSelectedItemGroup();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LoadProductGroupOptions action', () => {
      const action = new LoadProductGroupOptions();
      binToBinTransferFacade.loadProductGroupOptions();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LoadProductCategoryOptions action', () => {
      const action = new LoadProductCategoryOptions();
      binToBinTransferFacade.loadProductCategoryOptions();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LoadSourceBinOptions action', () => {
      const action = new LoadSourceBinOptions();
      binToBinTransferFacade.loadSourceBinOptions();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call ClearConfirmTransferResponse action', () => {
      const action = new ClearConfirmTransferResponse();
      binToBinTransferFacade.clearConfirmTransferResponse();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call ClearSearchedItems action', () => {
      const action = new ClearSearchedItems();
      binToBinTransferFacade.clearSearchedItems();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call ClearItems action', () => {
      const action = new ClearItems();
      binToBinTransferFacade.clearItems();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call ResetLoadedHistory action', () => {
      const action = new ResetLoadedHistory();
      binToBinTransferFacade.resetLoadedHistory();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call ResetHstoryFilter action', () => {
      const payload = 1;
      const action = new ResetHstoryFilter(payload);
      binToBinTransferFacade.resetAdvanceFilter(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call SearchItemGroups action', () => {
      const payload: BinToBinTransferLoadItemGroupsPayload = {
        type: 'Type',
        pageIndex: 12,
        pageSize: 10,
        value: 'Value'
      };
      const action = new SearchItemGroups(payload);
      binToBinTransferFacade.searchItemGroups(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LoadItems action', () => {
      const payload: BinToBinTransferLoadItemsPayload = {
        type: 'Type',
        pageIndex: 12,
        pageSize: 10,
        value: 'Value'
      };
      const action = new LoadItems(payload);
      binToBinTransferFacade.loadItems(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call SearchItems action', () => {
      const payload: BinToBinTransferLoadItemsPayload = {
        type: 'Type',
        pageIndex: 12,
        pageSize: 10,
        value: 'Value'
      };
      const action = new SearchItems(payload);
      binToBinTransferFacade.searchItems(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call ConfirmTransferAllItems action', () => {
      const payload: BinToBinTransferConfirmTransferAllItemsRequest = {
        type: 'TEST',
        value: 'VALUE',
        destinationBinCode: 'NEW_BIN',
        destinationBinGroupCode: 'NEW_BIN'
      };
      const action = new ConfirmTransferAllItems(payload);
      binToBinTransferFacade.confirmTransferAllItems(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call ConfirmTransferItems action', () => {
      const payload: BinToBinTransferConfirmTransferItemsRequest = {
        request: { binItems: [] },
        remove: true
      };
      const action = new ConfirmTransferItems(payload);
      binToBinTransferFacade.confirmTransferItems(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LoadBinToBinHistory action', () => {
      const payload: LoadBinToBinTransferHistoryPayload = {
        historyData: {
          actionType: 'TEST',
          dateRangeType: 'TODAY',
          statuses: []
        },
        page: 12,
        size: 11,
        transactionType: 'TEST'
      };
      const action = new LoadBinToBinHistory(payload);
      binToBinTransferFacade.loadBinToBinHistory(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LoadSelectedHistory action', () => {
      const payload: LoadSelectedBinToBinHeaderInfoPayload = {
        id: 123
      };
      const action = new LoadSelectedHistory(payload);
      binToBinTransferFacade.loadSelectedHistory(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call LoadHistoryItems action', () => {
      const payload: BinToBinTransferLoadHistoryItemsPayload = {
        historyItemsData: {
          binCodes: [],
          binGroupCode: 'TEST',
          itemCode: 'ITEMCODE',
          lotNumber: 'LOTNUMBER',
          productCategories: [],
          productGroups: []
        },
        value: 'TEST',
        pageIndex: 8,
        pageSize: 13,
        sortBy: 'weight',
        sortOrder: 'ASC',
        id: 'ID'
      };
      const action = new LoadHistoryItems(payload);
      binToBinTransferFacade.loadHistoryItems(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
  });

  describe('Access Selector', () => {
    it('should access bins selector', () => {
      expect(binToBinTransferFacade.getBins()).toEqual(
        binToBinTransferFacade['bins$']
      );
    });

    it('should access error selector', () => {
      expect(binToBinTransferFacade.getError()).toEqual(
        binToBinTransferFacade['error$']
      );
    });

    it('should access soruce bins selector', () => {
      expect(binToBinTransferFacade.getSourceBins()).toEqual(
        binToBinTransferFacade['sourceBins$']
      );
    });

    it('should access soruce bins total count selector', () => {
      expect(binToBinTransferFacade.getSourceBinsTotalCount()).toEqual(
        binToBinTransferFacade['sourceBinsTotalCount$']
      );
    });

    it('should access product category selector', () => {
      expect(binToBinTransferFacade.getProductCategory()).toEqual(
        binToBinTransferFacade['productCategory$']
      );
    });

    it('should access product category total count selector', () => {
      expect(binToBinTransferFacade.getProductCategoryTotalCount()).toEqual(
        binToBinTransferFacade['productCategoryTotalCount$']
      );
    });

    it('should access product group selector', () => {
      expect(binToBinTransferFacade.getProductGroups()).toEqual(
        binToBinTransferFacade['productGroups$']
      );
    });

    it('should access product group total count selector', () => {
      expect(binToBinTransferFacade.getProductGroupsTotalCount()).toEqual(
        binToBinTransferFacade['productGroupsTotalCount$']
      );
    });

    it('should access selected item list group selector', () => {
      expect(binToBinTransferFacade.getSelectedItemListGroup()).toEqual(
        binToBinTransferFacade['selectedItemListGroup$']
      );
    });

    it('should access status of loading bins selector', () => {
      expect(binToBinTransferFacade.getIsLoadingBins()).toEqual(
        binToBinTransferFacade['isLoadingBins$']
      );
    });

    it('should access status of loading item groups selector', () => {
      expect(
        binToBinTransferFacade.getIsLoadingSelectedItemListGroupSuccess()
      ).toEqual(
        binToBinTransferFacade['isLoadingSelectedItemListGroupSuccess$']
      );
    });

    it('should access searched item groups selector', () => {
      expect(binToBinTransferFacade.getSearchedItemListGroups()).toEqual(
        binToBinTransferFacade['searchedItemListGroups$']
      );
    });

    it('should access searched item groups total count selector', () => {
      expect(
        binToBinTransferFacade.getSearchedItemListGroupsTotalCount()
      ).toEqual(binToBinTransferFacade['searchedItemListGroupsTotalCount$']);
    });

    it('should access status of loading item groups selector', () => {
      expect(binToBinTransferFacade.getIsLoadingItemListGroup()).toEqual(
        binToBinTransferFacade['isLoadingItemListGroup$']
      );
    });

    it('should access item list selector', () => {
      expect(binToBinTransferFacade.getItemList()).toEqual(
        binToBinTransferFacade['itemList$']
      );
    });

    it('should access status of loading items selector', () => {
      expect(binToBinTransferFacade.getIsLoadingItemsSuccess()).toEqual(
        binToBinTransferFacade['isLoadingItemsSuccess$']
      );
    });

    it('should access searched item list selector', () => {
      expect(binToBinTransferFacade.getSearchedItemList()).toEqual(
        binToBinTransferFacade['searchedItemList$']
      );
    });

    it('should access status of loading searched item list selector', () => {
      expect(binToBinTransferFacade.getHasSearchedItems()).toEqual(
        binToBinTransferFacade['hasSearchedItems$']
      );

      expect(binToBinTransferFacade.getIsLoadingItems()).toEqual(
        binToBinTransferFacade['isLoadingItems$']
      );

      expect(binToBinTransferFacade.getIsSearchingItems()).toEqual(
        binToBinTransferFacade['isSearchingItems$']
      );
    });

    it('should access itemd total count selector', () => {
      expect(binToBinTransferFacade.getItemsTotalCount()).toEqual(
        binToBinTransferFacade['itemsTotalCount$']
      );
    });

    it('should access confirm response selector', () => {
      expect(binToBinTransferFacade.getConfirmTransferResponse()).toEqual(
        binToBinTransferFacade['confirmTransferResponse$']
      );
    });

    it('should access product group options selector', () => {
      expect(binToBinTransferFacade.getProductGroupOptions()).toEqual(
        binToBinTransferFacade['productGroupOptions$']
      );
    });

    it('should access status of loading product group options selector', () => {
      expect(binToBinTransferFacade.getIsLoadingProductGroupOptions()).toEqual(
        binToBinTransferFacade['isLoadingProductGroupOptions$']
      );
    });

    it('should access product category options selector', () => {
      expect(binToBinTransferFacade.getProductCategoryOptions()).toEqual(
        binToBinTransferFacade['productCategoryOptions$']
      );
    });

    it('should access status of loading product category options selector', () => {
      expect(
        binToBinTransferFacade.getIsLoadingProductCategoryOptions()
      ).toEqual(binToBinTransferFacade['isLoadingProductCategoryOptions$']);
    });

    it('should access source bin options selector', () => {
      expect(binToBinTransferFacade.getSoruceBinOptions()).toEqual(
        binToBinTransferFacade['soruceBinOptions$']
      );
    });

    it('should access status of loading source bin options selector', () => {
      expect(
        binToBinTransferFacade.getIsLoadingSoruceBinOptionsOptions()
      ).toEqual(binToBinTransferFacade['isLoadingSoruceBinOptionsOptions$']);
    });

    it('should access history selector', () => {
      expect(binToBinTransferFacade.getBinToBinHistory()).toEqual(
        binToBinTransferFacade['binToBinHistory$']
      );
    });

    it('should access loading status of  history selector', () => {
      expect(binToBinTransferFacade.getIsBinToBinHistoryLoading()).toEqual(
        binToBinTransferFacade['isLoadingHistory$']
      );
    });

    it('should access selected history selector', () => {
      expect(binToBinTransferFacade.getSelectedHistory()).toEqual(
        binToBinTransferFacade['selectedHistory$']
      );
    });

    it('should access loading status of selected history count selector', () => {
      expect(binToBinTransferFacade.getIsLoadingSelectedHistory()).toEqual(
        binToBinTransferFacade['isLoadingSelectedHistory$']
      );

      expect(binToBinTransferFacade.getHasSelectedHistory()).toEqual(
        binToBinTransferFacade['hasSelectedHistory$']
      );
    });

    it('should access history filter data selector', () => {
      expect(binToBinTransferFacade.getHistoryFilterData()).toEqual(
        binToBinTransferFacade['historyFilterData$']
      );
    });
  });
});
