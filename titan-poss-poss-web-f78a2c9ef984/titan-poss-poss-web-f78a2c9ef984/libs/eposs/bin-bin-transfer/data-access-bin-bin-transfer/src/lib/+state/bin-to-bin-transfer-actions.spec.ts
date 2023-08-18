import {
  LoadSourceBins,
  BinToBinTransferActionTypes,
  LoadSourceBinsSuccess,
  LoadSourceBinsFailure,
  LoadProductsGroups,
  LoadProductsGroupsSuccess,
  LoadProductsGroupsFailure,
  LoadProductsCategory,
  LoadProductsCategorySuccess,
  LoadProductsCategoryFailure,
  SearchItemGroups,
  SearchItemGroupsSuccess,
  SearchItemGroupsFailure,
  LoadItemGroupSuccess,
  LoadItemGroupFailure,
  LoadItemGroup,
  LoadItemsSuccess,
  LoadItems,
  SearchItemsFailure,
  SearchItemsSuccess,
  SearchItems,
  LoadItemsFailure,
  ConfirmTransferAllItems,
  ConfirmTransferAllItemsFailure,
  ConfirmTransferAllItemsSuccess,
  ConfirmTransferItems,
  ConfirmTransferItemsSuccess,
  ConfirmTransferItemsFailure,
  ClearConfirmTransferResponse,
  ClearSearchedItems,
  ClearItems,
  ClearItemsGroups,
  ClearSelectedItemGroup,
  AddToItemList,
  UpdateItemList,
  DeleteFromItemList,
  ChangeSelectionOfAllItems,
  UpdateDestinationBinForSelectedItems,
  DeleteSelectedItems,
  LoadBins,
  LoadBinsSuccess,
  LoadBinsFailure,
  LoadProductGroupOptionsFailure,
  LoadProductGroupOptionsSuccess,
  LoadProductGroupOptions,
  LoadProductCategoryOptions,
  LoadProductCategoryOptionsSuccess,
  LoadProductCategoryOptionsFailure,
  LoadSourceBinOptions,
  LoadSourceBinOptionsFailure,
  LoadSourceBinOptionsSuccess,
  LoadStuddedProductGroups,
  LoadStuddedProductGroupsFailure,
  LoadStuddedProductGroupsSuccess,
  LoadHistoryItemsFailure,
  LoadHistoryItemsSuccess,
  LoadHistoryItems,
  LoadBinToBinHistorySuccess,
  LoadBinToBinHistory,
  LoadBinToBinHistoryFailure,
  LoadSelectedHistoryFailure,
  LoadSelectedHistory,
  LoadSelectedHistorySuccess,
  LoadHistoryFilterData,
  ResetHstoryFilter,
  ResetLoadedHistory
} from './bin-to-bin-transfer-actions';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import * as moment from 'moment';
import {
  BinToBinTransferItemListGroup,
  BinToBinTransferItem,
  BinToBinTransferLoadItemGroupsPayload,
  BinToBinTransferLoadItemListGroupResponse,
  CustomErrors,
  BinToBinTransferLoadItemsPayload,
  BinToBinTransferLoadItemsResponse,
  BinToBinTransferConfirmTransferAllItemsRequest,
  BinToBinTransferConfirmTransferResponse,
  BinToBinTransferConfirmTransferItemsRequest,
  BinToBinTransferChangeSelectionPayload,
  BinToBinTransferUpdateDestinationBinPayload,
  StoreBin,
  ProductGroup,
  ProductCategory,
  BinToBinTransferLoadHistoryItemsPayload,
  LoadBinToBinTransferHistoryPayload,
  BinToBinTransferLoadHistoryItemsResponse,
  LoadSelectedBinToBinHeaderInfoPayload,
  BinToBinTransferHistoryItemHeader,
  AdvancedFilterData
} from '@poss-web/shared/models';

const dummyItemGroup: BinToBinTransferItemListGroup[] = [
  {
    id: '11',
    name: '71',
    products: 16,
    totalValue: 826133.1,
    totalWeight: 269.728,
    currencyCode: 'INR',
    weightUnit: 'gms',
    description: 'Gold Plain'
  },
  {
    id: '11',
    name: '75',
    products: 2,
    totalValue: 417059.68,
    totalWeight: 145.667,
    currencyCode: 'INR',
    weightUnit: 'gms',
    description: 'Plain Jewellery with Stones'
  }
];

const dummyItems: BinToBinTransferItem[] = [
  {
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
  }
];

const dummyHistoryHeader = {
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

describe('Bin to Bin Transfer Action Testing Suite', () => {
  describe('LoadSourceBins Action Test Cases', () => {
    it('should check correct type is used for  LoadSourceBins action ', () => {
      const payload: BinToBinTransferLoadItemGroupsPayload = {
        type: 'TEST',
        pageIndex: 1,
        pageSize: 2,
        value: 'TEST'
      };
      const action = new LoadSourceBins(payload);

      expect(action.type).toEqual(BinToBinTransferActionTypes.LOAD_SOURCE_BINS);
      expect(action.payload).toEqual(payload);
    });

    it('should check correct type is used for  LoadSourceBinsSuccess action ', () => {
      const payload: BinToBinTransferLoadItemListGroupResponse = {
        count: 12,
        itemListGroups: []
      };
      const action = new LoadSourceBinsSuccess(payload);

      expect(action.type).toEqual(
        BinToBinTransferActionTypes.LOAD_SOURCE_BINS_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });

    it('should check correct type is used for  LoadSourceBinsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadSourceBinsFailure(payload);

      expect(action.type).toEqual(
        BinToBinTransferActionTypes.LOAD_SOURCE_BINS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('LoadProductsGroups Action Test Cases', () => {
    it('should check correct type is used for  LoadProductsGroups action ', () => {
      const payload: BinToBinTransferLoadItemGroupsPayload = {
        type: 'TEST',
        pageIndex: 1,
        pageSize: 2,
        value: 'TEST'
      };
      const action = new LoadProductsGroups(payload);

      expect(action.type).toEqual(
        BinToBinTransferActionTypes.LOAD_PRODUCT_GROUPS
      );
      expect(action.payload).toEqual(payload);
    });

    it('should check correct type is used for  LoadProductsGroupsSuccess action ', () => {
      const payload: BinToBinTransferLoadItemListGroupResponse = {
        count: 12,
        itemListGroups: []
      };
      const action = new LoadProductsGroupsSuccess(payload);

      expect(action.type).toEqual(
        BinToBinTransferActionTypes.LOAD_PRODUCT_GROUPS_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });

    it('should check correct type is used for  LoadProductsGroupsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadProductsGroupsFailure(payload);

      expect(action.type).toEqual(
        BinToBinTransferActionTypes.LOAD_PRODUCT_GROUPS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('LoadProductsCategory Action Test Cases', () => {
    it('should check correct type is used for  LoadProductsCategory action ', () => {
      const payload: BinToBinTransferLoadItemGroupsPayload = {
        type: 'TEST',
        pageIndex: 1,
        pageSize: 2,
        value: 'TEST'
      };
      const action = new LoadProductsCategory(payload);

      expect(action.type).toEqual(
        BinToBinTransferActionTypes.LOAD_PRODUCT_CATEGORY
      );
      expect(action.payload).toEqual(payload);
    });

    it('should check correct type is used for  LoadProductsCategorySuccess action ', () => {
      const payload: BinToBinTransferLoadItemListGroupResponse = {
        count: 12,
        itemListGroups: []
      };
      const action = new LoadProductsCategorySuccess(payload);

      expect(action.type).toEqual(
        BinToBinTransferActionTypes.LOAD_PRODUCT_CATEGORY_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });

    it('should check correct type is used for  LoadProductsCategoryFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadProductsCategoryFailure(payload);

      expect(action.type).toEqual(
        BinToBinTransferActionTypes.LOAD_PRODUCT_CATEGORY_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('SearchItemGroups Action Test Cases', () => {
    it('should check correct type is used for  SearchItemGroups action ', () => {
      const payload: BinToBinTransferLoadItemGroupsPayload = {
        type: 'TEST',
        pageIndex: 1,
        pageSize: 2,
        value: 'TEST'
      };
      const action = new SearchItemGroups(payload);

      expect(action.type).toEqual(
        BinToBinTransferActionTypes.SEARCH_ITEM_GROUPS
      );
      expect(action.payload).toEqual(payload);
    });

    it('should check correct type is used for  SearchItemGroupsSuccess action ', () => {
      const payload: BinToBinTransferLoadItemListGroupResponse = {
        count: 12,
        itemListGroups: []
      };
      const action = new SearchItemGroupsSuccess(payload);

      expect(action.type).toEqual(
        BinToBinTransferActionTypes.SEARCH_ITEM_GROUPS_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });

    it('should check correct type is used for  SearchItemGroupsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SearchItemGroupsFailure(payload);

      expect(action.type).toEqual(
        BinToBinTransferActionTypes.SERACH_ITEM_GROUPS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('LoadItemGroup Action Test Cases', () => {
    it('should check correct type is used for  LoadItemGroup action ', () => {
      const payload: BinToBinTransferLoadItemGroupsPayload = {
        type: 'TEST',
        pageIndex: 1,
        pageSize: 2,
        value: 'TEST'
      };
      const action = new LoadItemGroup(payload);

      expect(action.type).toEqual(BinToBinTransferActionTypes.LOAD_ITEM_GROUP);
      expect(action.payload).toEqual(payload);
    });

    it('should check correct type is used for  LoadItemGroupSuccess action ', () => {
      const payload: BinToBinTransferItemListGroup = dummyItemGroup[0];
      const action = new LoadItemGroupSuccess(payload);

      expect(action.type).toEqual(
        BinToBinTransferActionTypes.LOAD_ITEM_GROUP_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });

    it('should check correct type is used for  LoadItemGroupFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadItemGroupFailure(payload);

      expect(action.type).toEqual(
        BinToBinTransferActionTypes.LOAD_ITEM_GROUP_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('LoadItems Action Test Cases', () => {
    it('should check correct type is used for  LoadItems action ', () => {
      const payload: BinToBinTransferLoadItemsPayload = {
        type: 'TEST',
        value: 'BIN1',
        pageIndex: 1,
        pageSize: 2
      };
      const action = new LoadItems(payload);

      expect(action.type).toEqual(BinToBinTransferActionTypes.LOAD_ITEMS);
      expect(action.payload).toEqual(payload);
    });

    it('should check correct type is used for  LoadItemsSuccess action ', () => {
      const payload: BinToBinTransferLoadItemsResponse = {
        count: 12,
        items: []
      };
      const action = new LoadItemsSuccess(payload);

      expect(action.type).toEqual(
        BinToBinTransferActionTypes.LOAD_ITEMS_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });

    it('should check correct type is used for  LoadItemsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadItemsFailure(payload);

      expect(action.type).toEqual(
        BinToBinTransferActionTypes.LOAD_ITEMS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('SearchItems Action Test Cases', () => {
    it('should check correct type is used for  SearchItems action ', () => {
      const payload: BinToBinTransferLoadItemsPayload = {
        type: 'TEST',
        value: 'BIN1',
        pageIndex: 1,
        pageSize: 2
      };
      const action = new SearchItems(payload);

      expect(action.type).toEqual(BinToBinTransferActionTypes.SEARCH_ITEMS);
      expect(action.payload).toEqual(payload);
    });

    it('should check correct type is used for  SearchItemsSuccess action ', () => {
      const payload: BinToBinTransferLoadItemsResponse = {
        count: 12,
        items: []
      };
      const action = new SearchItemsSuccess(payload);

      expect(action.type).toEqual(
        BinToBinTransferActionTypes.SEARCH_ITEMS_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });

    it('should check correct type is used for  SearchItemsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SearchItemsFailure(payload);

      expect(action.type).toEqual(
        BinToBinTransferActionTypes.SEARCH_ITEMS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('ConfirmTransferAllItems  Action Test Cases', () => {
    it('should check correct type is used for  ConfirmTransferAllItems  action ', () => {
      const payload: BinToBinTransferConfirmTransferAllItemsRequest = {
        type: 'TEST',
        value: 'VALUE',
        destinationBinCode: 'NEW_BIN',
        destinationBinGroupCode: 'NEW_BIN'
      };
      const action = new ConfirmTransferAllItems(payload);

      expect(action.type).toEqual(
        BinToBinTransferActionTypes.CONFIRM_TRANSFER_ALL_ITEMS
      );
      expect(action.payload).toEqual(payload);
    });

    it('should check correct type is used for  ConfirmTransferAllItemsSuccess action ', () => {
      const payload: BinToBinTransferConfirmTransferResponse = {
        transferId: 123
      };
      const action = new ConfirmTransferAllItemsSuccess(payload);

      expect(action.type).toEqual(
        BinToBinTransferActionTypes.CONFIRM_TRANSFER_ALL_ITEMS_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });

    it('should check correct type is used for  ConfirmTransferAllItemsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new ConfirmTransferAllItemsFailure(payload);

      expect(action.type).toEqual(
        BinToBinTransferActionTypes.CONFIRM_TRANSFER_ALL_ITEMS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('ConfirmTransferItems  Action Test Cases', () => {
    it('should check correct type is used for  ConfirmTransferItems  action ', () => {
      const payload: BinToBinTransferConfirmTransferItemsRequest = {
        request: { binItems: [] },
        remove: true
      };
      const action = new ConfirmTransferItems(payload);

      expect(action.type).toEqual(
        BinToBinTransferActionTypes.CONFIRM_TRANSFER_ITEMS
      );
      expect(action.payload).toEqual(payload);
    });

    it('should check correct type is used for  ConfirmTransferItemsSuccess action ', () => {
      const payload = {
        confirmTransferResponse: { transferId: 123 },
        itemId: [],
        remove: false
      };
      const action = new ConfirmTransferItemsSuccess(payload);

      expect(action.type).toEqual(
        BinToBinTransferActionTypes.CONFIRM_TRANSFER_ITEMS_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });

    it('should check correct type is used for  ConfirmTransferItemsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new ConfirmTransferItemsFailure(payload);

      expect(action.type).toEqual(
        BinToBinTransferActionTypes.CONFIRM_TRANSFER_ITEMS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('Clear  Action Test Cases', () => {
    it('should check correct type is used for  ClearConfirmTransferResponse  action ', () => {
      const action = new ClearConfirmTransferResponse();

      expect(action.type).toEqual(
        BinToBinTransferActionTypes.CLEAR_CONFIRM_TRANSFER_RESPONSE
      );
    });

    it('should check correct type is used for  ClearSearchedItems  action ', () => {
      const action = new ClearSearchedItems();

      expect(action.type).toEqual(
        BinToBinTransferActionTypes.CLEAR_SEARCHED_ITEMS
      );
    });

    it('should check correct type is used for  ClearItems  action ', () => {
      const action = new ClearItems();

      expect(action.type).toEqual(BinToBinTransferActionTypes.CLEAR_ITEMS);
    });

    it('should check correct type is used for  ClearItemsGroups  action ', () => {
      const action = new ClearItemsGroups();

      expect(action.type).toEqual(
        BinToBinTransferActionTypes.CLEAR_ITEMS_GROUPS
      );
    });

    it('should check correct type is used for  ClearSelectedItemGroup  action ', () => {
      const action = new ClearSelectedItemGroup();

      expect(action.type).toEqual(
        BinToBinTransferActionTypes.CLEAR_SELECTED_ITEM_GROUP
      );
    });
  });
  describe('Cart Action Test Cases', () => {
    it('should check correct type is used for  AddToItemList  action ', () => {
      const payload: BinToBinTransferItem[] = dummyItems;
      const action = new AddToItemList(payload);

      expect(action.type).toEqual(BinToBinTransferActionTypes.ADD_TO_ITEM_LIST);
    });

    it('should check correct type is used for  UpdateItemList  action ', () => {
      const payload: BinToBinTransferItem = dummyItems[0];
      const action = new UpdateItemList(payload);

      expect(action.type).toEqual(BinToBinTransferActionTypes.UPDATE_LIST_ITEM);
    });
    it('should check correct type is used for  DeleteFromItemList  action ', () => {
      const payload = 'ITEMID';
      const action = new DeleteFromItemList(payload);

      expect(action.type).toEqual(
        BinToBinTransferActionTypes.DELETE_FROM_ITEM_LIST
      );
    });
    it('should check correct type is used for  ChangeSelectionOfAllItems  action ', () => {
      const payload: BinToBinTransferChangeSelectionPayload = {
        select: true,
        disable: false,
        idList: [],
        resetBin: true
      };
      const action = new ChangeSelectionOfAllItems(payload);

      expect(action.type).toEqual(
        BinToBinTransferActionTypes.CHANGE_SELECTION_OF_ALL_ITEMS
      );
    });

    it('should check correct type is used for  UpdateDestinationBinForSelectedItems  action ', () => {
      const payload: BinToBinTransferUpdateDestinationBinPayload = {
        destinationBinGroupCode: 'Bin_Group_Code',
        destinationBinCode: 'Bin_Code',
        idList: []
      };
      const action = new UpdateDestinationBinForSelectedItems(payload);

      expect(action.type).toEqual(
        BinToBinTransferActionTypes.UPDATE_DESTINATION_BIN_FOR_SELECTED_ITEMS
      );
    });
    it('should check correct type is used for  DeleteSelectedItems  action ', () => {
      const payload: string[] = ['ITEMCODE1', 'ITEMCODE2'];
      const action = new DeleteSelectedItems(payload);

      expect(action.type).toEqual(
        BinToBinTransferActionTypes.DELETE_SELECTED_ITEMS
      );
    });
  });

  describe('LoadBins Action Test Cases', () => {
    it('should check correct type is used for  LoadBins action ', () => {
      const action = new LoadBins();

      expect(action.type).toEqual(BinToBinTransferActionTypes.LOAD_BINS);
    });

    it('should check correct type is used for  LoadBinsSuccess action ', () => {
      const payload: StoreBin[] = [{ binCode: 'TEST', binGroupCode: 'TEST' }];
      const action = new LoadBinsSuccess(payload);

      expect(action.type).toEqual(
        BinToBinTransferActionTypes.LOAD_BINS_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });

    it('should check correct type is used for  LoadBinsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadBinsFailure(payload);

      expect(action.type).toEqual(
        BinToBinTransferActionTypes.LOAD_BINS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('LoadProductGroupOptions Action Test Cases', () => {
    it('should check correct type is used for  LoadProductGroupOptions action ', () => {
      const action = new LoadProductGroupOptions();

      expect(action.type).toEqual(
        BinToBinTransferActionTypes.LOAD_PRODUCT_GROUP_OPTIONS
      );
    });

    it('should check correct type is used for  LoadProductGroupOptionsSuccess action ', () => {
      const payload: ProductGroup[] = [
        { description: 'TEST', productGroupCode: 'TEST' }
      ];
      const action = new LoadProductGroupOptionsSuccess(payload);

      expect(action.type).toEqual(
        BinToBinTransferActionTypes.LOAD_PRODUCT_GROUP_OPTIONS_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });

    it('should check correct type is used for  LoadProductGroupOptionsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadProductGroupOptionsFailure(payload);

      expect(action.type).toEqual(
        BinToBinTransferActionTypes.LOAD_PRODUCT_GROUP_OPTIONS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('LoadProductCategoryOptions Action Test Cases', () => {
    it('should check correct type is used for  LoadProductCategoryOptions action ', () => {
      const action = new LoadProductCategoryOptions();

      expect(action.type).toEqual(
        BinToBinTransferActionTypes.LOAD_PRODUCT_CATEGORY_OPTIONS
      );
    });

    it('should check correct type is used for  LoadProductCategoryOptionsSuccess action ', () => {
      const payload: ProductCategory[] = [
        { description: 'TEST', productCategoryCode: 'TEST' }
      ];
      const action = new LoadProductCategoryOptionsSuccess(payload);

      expect(action.type).toEqual(
        BinToBinTransferActionTypes.LOAD_PRODUCT_CATEGORY_OPTIONS_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });

    it('should check correct type is used for  LoadProductCategoryOptionsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadProductCategoryOptionsFailure(payload);

      expect(action.type).toEqual(
        BinToBinTransferActionTypes.LOAD_PRODUCT_CATEGORY_OPTIONS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('LoadSourceBinOptions Action Test Cases', () => {
    it('should check correct type is used for  LoadSourceBinOptions action ', () => {
      const action = new LoadSourceBinOptions();

      expect(action.type).toEqual(
        BinToBinTransferActionTypes.LOAD_SOURCE_BIN_OPTIONS
      );
    });

    it('should check correct type is used for  LoadSourceBinOptionsSuccess action ', () => {
      const payload: string[] = ['TEST_1', 'TEST_2'];
      const action = new LoadSourceBinOptionsSuccess(payload);

      expect(action.type).toEqual(
        BinToBinTransferActionTypes.LOAD_SOURCE_BIN_OPTIONS_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });

    it('should check correct type is used for  LoadSourceBinOptionsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadSourceBinOptionsFailure(payload);

      expect(action.type).toEqual(
        BinToBinTransferActionTypes.LOAD_SOURCE_BIN_OPTIONS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('LoadStuddedProductGroups Action Test Cases', () => {
    it('should check correct type is used for  LoadStuddedProductGroups action ', () => {
      const action = new LoadStuddedProductGroups();

      expect(action.type).toEqual(
        BinToBinTransferActionTypes.LOAD_STUDDED_PRODUCT_GROUPS
      );
    });

    it('should check correct type is used for  LoadStuddedProductGroupsSuccess action ', () => {
      const payload: string[] = ['TEST_1', 'TEST_2'];
      const action = new LoadStuddedProductGroupsSuccess(payload);

      expect(action.type).toEqual(
        BinToBinTransferActionTypes.LOAD_STUDDED_PRODUCT_GROUPS_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });

    it('should check correct type is used for  LoadStuddedProductGroupsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadStuddedProductGroupsFailure(payload);

      expect(action.type).toEqual(
        BinToBinTransferActionTypes.LOAD_STUDDED_PRODUCT_GROUPS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('LoadHistoryItems Action Test Cases', () => {
    it('should check correct type is used for  LoadHistoryItems action ', () => {
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

      expect(action.type).toEqual(
        BinToBinTransferActionTypes.LOAD_HISTORY_ITEMS
      );
      expect(action.payload).toEqual(payload);
    });

    it('should check correct type is used for  LoadHistoryItemsSuccess action ', () => {
      const payload: BinToBinTransferLoadItemsResponse = {
        count: 12,
        items: []
      };
      const action = new LoadHistoryItemsSuccess(payload);

      expect(action.type).toEqual(
        BinToBinTransferActionTypes.LOAD_HISTORY_ITEMS_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });

    it('should check correct type is used for  LoadHistoryItemsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadHistoryItemsFailure(payload);

      expect(action.type).toEqual(
        BinToBinTransferActionTypes.LOAD_HISTORY_ITEMS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('LoadBinToBinHistory Action Test Cases', () => {
    it('should check correct type is used for  LoadBinToBinHistory action ', () => {
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

      expect(action.type).toEqual(
        BinToBinTransferActionTypes.LOAD_BIN_TO_BIN_HISTORY
      );
      expect(action.payload).toEqual(payload);
    });

    it('should check correct type is used for  LoadBinToBinHistorySuccess action ', () => {
      const payload: BinToBinTransferLoadHistoryItemsResponse = {
        count: 123,
        items: []
      };
      const action = new LoadBinToBinHistorySuccess(payload);

      expect(action.type).toEqual(
        BinToBinTransferActionTypes.LOAD_BIN_TO_BIN_HISTORY_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });

    it('should check correct type is used for  LoadBinToBinHistoryFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadBinToBinHistoryFailure(payload);

      expect(action.type).toEqual(
        BinToBinTransferActionTypes.LOAD_BIN_TO_BIN_HISTORY_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });
  describe('LoadSelectedHistory Action Test Cases', () => {
    it('should check correct type is used for  LoadSelectedHistory action ', () => {
      const payload: LoadSelectedBinToBinHeaderInfoPayload = {
        id: 123
      };
      const action = new LoadSelectedHistory(payload);

      expect(action.type).toEqual(
        BinToBinTransferActionTypes.LOAD_SELECTED_HISTORY
      );
      expect(action.payload).toEqual(payload);
    });

    it('should check correct type is used for  LoadSelectedHistorySuccess action ', () => {
      const payload: BinToBinTransferHistoryItemHeader = dummyHistoryHeader;
      const action = new LoadSelectedHistorySuccess(payload);

      expect(action.type).toEqual(
        BinToBinTransferActionTypes.LOAD_SELECTED_HISTORY_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });

    it('should check correct type is used for  LoadSelectedHistoryFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadSelectedHistoryFailure(payload);

      expect(action.type).toEqual(
        BinToBinTransferActionTypes.LOAD_SELECTED_HISTORY_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('History Filter Action Test Cases', () => {
    it('should check correct type is used for  LoadHistoryFilterData action ', () => {
      const payload: AdvancedFilterData = {
        startDate: '12-AUG-2020',
        endDate: '12-SEP-2020',
        fiscalYear: 2020
      };
      const action = new LoadHistoryFilterData(payload);

      expect(action.type).toEqual(
        BinToBinTransferActionTypes.LOAD_HISTORY_FILTER_DATA
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  ResetHstoryFilter action ', () => {
      const payload = 1;
      const action = new ResetHstoryFilter(payload);

      expect(action.type).toEqual(
        BinToBinTransferActionTypes.RESET_HISTORY_FILTER_DATA
      );
    });
  });
  describe('ResetLoadedHistory   Action Test Cases', () => {
    it('should check correct type is used for  ResetLoadedHistory  action ', () => {
      const action = new ResetLoadedHistory();

      expect(action.type).toEqual(
        BinToBinTransferActionTypes.RESET_LOADED_HISTORY
      );
    });
  });
});
