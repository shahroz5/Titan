//you should simply assert that you get the right state given the provided inputs.

import * as actions from './bin-to-bin-transfer-actions';
import * as moment from 'moment';
import {
  BinToBinTransferItemListGroup,
  BinToBinTransferItem,
  BinToBinTransferLoadItemGroupsPayload,
  CustomErrors,
  BinToBinTransferLoadItemListGroupResponse,
  BinToBinTransferChangeSelectionPayload
} from '@poss-web/shared/models';
import { BinToBinTransferState } from './bin-to-bin-transfer.state';
import {
  BinToBinTransferReducer,
  initialState
} from './bin-to-bin-transfer.reducer';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  itemListGroupAdapter,
  itemAdapter,
  binToBinTransferHistoryAdaptor
} from './bin-to-bin-transfer.entity';

describe('Bin T oBin Transfer Reducer Testing Suite', () => {
  let testState = initialState;

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

  describe('Actions should update state properly', () => {
    it('LOAD_SOURCE_BINS action', () => {
      testState = {
        ...testState,
        isLoadingItemListGroup: false,
        error: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
      };
      const payload: BinToBinTransferLoadItemGroupsPayload = {
        type: 'Type',
        pageIndex: 12,
        pageSize: 10,
        value: 'Value'
      };

      const action = new actions.LoadSourceBins(payload);

      const result: BinToBinTransferState = BinToBinTransferReducer(
        testState,
        action
      );

      expect(result.isLoadingItemListGroup).toBeTruthy();
      expect(result.error).toBeNull();
    });

    it('LOAD_PRODUCT_GROUPS action', () => {
      testState = {
        ...testState,
        isLoadingItemListGroup: false,
        error: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
      };

      const payload: BinToBinTransferLoadItemGroupsPayload = {
        type: 'Type',
        pageIndex: 12,
        pageSize: 10,
        value: 'Value'
      };

      const action = new actions.LoadProductsGroups(payload);

      const result: BinToBinTransferState = BinToBinTransferReducer(
        testState,
        action
      );

      expect(result.isLoadingItemListGroup).toBeTruthy();
      expect(result.error).toBeNull();
    });

    it('LOAD_PRODUCT_CATEGORY action', () => {
      testState = {
        ...testState,
        isLoadingItemListGroup: false,
        error: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
      };

      const payload: BinToBinTransferLoadItemGroupsPayload = {
        type: 'Type',
        pageIndex: 12,
        pageSize: 10,
        value: 'Value'
      };

      const action = new actions.LoadProductsCategory(payload);

      const result: BinToBinTransferState = BinToBinTransferReducer(
        testState,
        action
      );

      expect(result.isLoadingItemListGroup).toBeTruthy();
      expect(result.error).toBeNull();
    });

    it('LOAD_SOURCE_BINS_FAILURE action', () => {
      testState = {
        ...testState,
        isLoadingItemListGroup: true,
        error: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.LoadSourceBinsFailure(payload);

      const result: BinToBinTransferState = BinToBinTransferReducer(
        testState,
        action
      );

      expect(result.isLoadingItemListGroup).toBeFalsy();
      expect(result.error).toBe(payload);
    });

    it('LOAD_PRODUCT_GROUPS_FAILURE action', () => {
      testState = {
        ...testState,
        isLoadingItemListGroup: true,
        error: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.LoadProductsGroupsFailure(payload);

      const result: BinToBinTransferState = BinToBinTransferReducer(
        testState,
        action
      );

      expect(result.isLoadingItemListGroup).toBeFalsy();
      expect(result.error).toBe(payload);
    });

    it('LOAD_PRODUCT_CATEGORY_FAILURE action', () => {
      testState = {
        ...testState,
        isLoadingItemListGroup: true,
        error: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.LoadProductsCategoryFailure(payload);

      const result: BinToBinTransferState = BinToBinTransferReducer(
        testState,
        action
      );

      expect(result.isLoadingItemListGroup).toBeFalsy();
      expect(result.error).toBe(payload);
    });

    it('LOAD_ITEM_GROUP_FAILURE action', () => {
      testState = {
        ...testState,
        isLoadingItemListGroup: true,
        error: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.LoadItemGroupFailure(payload);

      const result: BinToBinTransferState = BinToBinTransferReducer(
        testState,
        action
      );

      expect(result.isLoadingItemListGroup).toBeFalsy();
      expect(result.error).toBe(payload);
    });

    it('SERACH_ITEM_GROUPS_FAILURE action', () => {
      testState = {
        ...testState,
        isLoadingItemListGroup: true,
        error: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.SearchItemGroupsFailure(payload);

      const result: BinToBinTransferState = BinToBinTransferReducer(
        testState,
        action
      );

      expect(result.isLoadingItemListGroup).toBeFalsy();
      expect(result.error).toBe(payload);
    });

    it('LOAD_SOURCE_BINS_SUCCESS action', () => {
      testState = {
        ...testState,
        sourceBinsTotalCount: 10,
        isLoadingItemListGroup: true,
        sourceBins: itemListGroupAdapter.getInitialState()
      };

      const payload: BinToBinTransferLoadItemListGroupResponse = {
        itemListGroups: [itemGroupData1, itemGroupData2],
        count: 2
      };

      const action = new actions.LoadSourceBinsSuccess(payload);

      const result: BinToBinTransferState = BinToBinTransferReducer(
        testState,
        action
      );

      expect(result.isLoadingItemListGroup).toBeFalsy();
      expect(result.sourceBinsTotalCount).toBe(payload.count);
      expect(result.sourceBins.ids.length).toBe(payload.itemListGroups.length);
      expect(result.sourceBins.entities[itemGroupData1.id]).toBe(
        itemGroupData1
      );
      expect(result.sourceBins.entities[itemGroupData2.id]).toBe(
        itemGroupData2
      );
    });

    it('LOAD_PRODUCT_GROUPS_SUCCESS action', () => {
      testState = {
        ...testState,
        sourceBinsTotalCount: 10,
        isLoadingItemListGroup: true,
        sourceBins: itemListGroupAdapter.getInitialState()
      };

      const payload: BinToBinTransferLoadItemListGroupResponse = {
        itemListGroups: [itemGroupData1, itemGroupData2],
        count: 2
      };

      const action = new actions.LoadProductsGroupsSuccess(payload);

      const result: BinToBinTransferState = BinToBinTransferReducer(
        testState,
        action
      );

      expect(result.isLoadingItemListGroup).toBeFalsy();
      expect(result.productGroupsTotalCount).toBe(payload.count);
      expect(result.productGroups.ids.length).toBe(
        payload.itemListGroups.length
      );
      expect(result.productGroups.entities[itemGroupData1.id]).toBe(
        itemGroupData1
      );
      expect(result.productGroups.entities[itemGroupData2.id]).toBe(
        itemGroupData2
      );
    });

    it('LOAD_PRODUCT_CATEGORY_SUCCESS action', () => {
      testState = {
        ...testState,
        sourceBinsTotalCount: 10,
        isLoadingItemListGroup: true,
        sourceBins: itemListGroupAdapter.getInitialState()
      };

      const payload: BinToBinTransferLoadItemListGroupResponse = {
        itemListGroups: [itemGroupData1, itemGroupData2],
        count: 2
      };

      const action = new actions.LoadProductsCategorySuccess(payload);

      const result: BinToBinTransferState = BinToBinTransferReducer(
        testState,
        action
      );

      expect(result.isLoadingItemListGroup).toBeFalsy();
      expect(result.productCategoryTotalCount).toBe(payload.count);
      expect(result.productCategory.ids.length).toBe(
        payload.itemListGroups.length
      );
      expect(result.productCategory.entities[itemGroupData1.id]).toBe(
        itemGroupData1
      );
      expect(result.productCategory.entities[itemGroupData2.id]).toBe(
        itemGroupData2
      );
    });

    it('LOAD_ITEM_GROUP action', () => {
      testState = {
        ...testState,
        isLoadingItemListGroup: false,
        error: CustomErrorAdaptor.fromJson(new Error('Some Old Error')),
        selectedItemListGroup: itemGroupData1,
        isLoadingSelectedItemListGroupSuccess: true
      };

      const payload: BinToBinTransferLoadItemGroupsPayload = {
        type: 'Type',
        pageIndex: 12,
        pageSize: 10,
        value: 'Value'
      };
      const action = new actions.LoadItemGroup(payload);

      const result: BinToBinTransferState = BinToBinTransferReducer(
        testState,
        action
      );

      expect(result.isLoadingItemListGroup).toBeTruthy();
      expect(result.error).toBeNull();
      expect(result.selectedItemListGroup).toBeNull();
      expect(result.isLoadingSelectedItemListGroupSuccess).toBeNull();
    });

    it('LOAD_ITEM_GROUP_SUCCESS action', () => {
      testState = {
        ...testState,
        isLoadingItemListGroup: true,
        selectedItemListGroup: null,
        isLoadingSelectedItemListGroupSuccess: true
      };

      const payload = itemGroupData1;

      const action1 = new actions.LoadItemGroupSuccess(payload);

      const result1: BinToBinTransferState = BinToBinTransferReducer(
        testState,
        action1
      );

      expect(result1.isLoadingItemListGroup).toBeFalsy();
      expect(result1.selectedItemListGroup).toBe(payload);
      expect(result1.isLoadingSelectedItemListGroupSuccess).toBeTruthy();

      const action2 = new actions.LoadItemGroupSuccess(null);

      const result2: BinToBinTransferState = BinToBinTransferReducer(
        testState,
        action2
      );
      expect(result2.isLoadingSelectedItemListGroupSuccess).toBeFalsy();
    });

    it('SEARCH_ITEM_GROUPS action', () => {
      testState = {
        ...testState,
        isLoadingItemListGroup: false,
        error: CustomErrorAdaptor.fromJson(new Error('Some Old Error')),
        searchedItemListGroups: itemListGroupAdapter.setAll(
          [itemGroupData1],
          testState.searchedItemListGroups
        ),
        searchedItemListGroupsTotalCount: 10
      };

      const action = new actions.SearchItemGroups(null);

      const result: BinToBinTransferState = BinToBinTransferReducer(
        testState,
        action
      );

      expect(result.isLoadingItemListGroup).toBeTruthy();
      expect(result.error).toBeNull();
      expect(result.searchedItemListGroupsTotalCount).toBe(0);
      expect(result.searchedItemListGroups.ids.length).toBe(0);
    });

    it('SEARCH_ITEM_GROUPS_SUCCESS action', () => {
      testState = {
        ...testState,
        isLoadingItemListGroup: true,
        searchedItemListGroups: itemListGroupAdapter.removeAll(
          testState.searchedItemListGroups
        ),
        searchedItemListGroupsTotalCount: 0
      };
      const payload = { count: 10, itemListGroups: [itemGroupData1] };

      const action = new actions.SearchItemGroupsSuccess(payload);

      const result: BinToBinTransferState = BinToBinTransferReducer(
        testState,
        action
      );

      expect(result.searchedItemListGroupsTotalCount).toBe(payload.count);
      expect(result.isLoadingItemListGroup).toBeFalsy();
      expect(result.searchedItemListGroups.ids.length).toBe(
        payload.itemListGroups.length
      );

      expect(result.searchedItemListGroups.entities[itemGroupData1.id]).toBe(
        itemGroupData1
      );
    });

    it('SEARCH_ITEMS action', () => {
      testState = {
        ...testState,
        hasSearchedItems: false,
        error: CustomErrorAdaptor.fromJson(new Error('Some Old Error')),
        searchedItemList: itemAdapter.setAll(
          [itemData1],
          testState.searchedItemList
        ),
        isSearchingItems: false
      };

      const action = new actions.SearchItems(null);

      const result: BinToBinTransferState = BinToBinTransferReducer(
        testState,
        action
      );

      expect(result.isSearchingItems).toBeTruthy();
      expect(result.hasSearchedItems).toBeNull();
      expect(result.error).toBeNull();
      expect(result.searchedItemListGroups.ids.length).toBe(0);
    });

    it('SEARCH_ITEMS_SUCCESS action', () => {
      testState = {
        ...testState,
        hasSearchedItems: false,
        searchedItemList: itemAdapter.removeAll(testState.searchedItemList),
        isSearchingItems: true
      };

      const payload = {
        count: 10,
        items: [itemData1, itemData2]
      };

      const action = new actions.SearchItemsSuccess(payload);

      const result: BinToBinTransferState = BinToBinTransferReducer(
        testState,
        action
      );

      expect(result.isSearchingItems).toBeFalsy();
      expect(result.hasSearchedItems).toBeTruthy();
      expect(result.searchedItemList.ids.length).toBe(payload.items.length);

      expect(result.searchedItemList.entities[itemData1.id]).toBe(itemData1);
      expect(result.searchedItemList.entities[itemData1.id]).toBe(itemData1);
    });

    it('SEARCH_ITEMS_FAILURE action', () => {
      testState = {
        ...testState,
        hasSearchedItems: true,
        error: CustomErrorAdaptor.fromJson(Error('Some Old Error')),
        isSearchingItems: true
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.SearchItemsFailure(payload);

      const result: BinToBinTransferState = BinToBinTransferReducer(
        testState,
        action
      );

      expect(result.error).toBe(payload);
      expect(result.hasSearchedItems).toBeFalsy();
      expect(result.isSearchingItems).toBeFalsy();
    });

    it('LOAD_ITEMS action', () => {
      testState = {
        ...testState,
        isLoadingItems: false,
        isLoadingItemsSuccess: true,
        itemList: itemAdapter.setAll([itemData1], testState.itemList),
        error: CustomErrorAdaptor.fromJson(Error('Some Old Error'))
      };

      const action = new actions.LoadItems(null);

      const result: BinToBinTransferState = BinToBinTransferReducer(
        testState,
        action
      );

      expect(result.error).toBeNull();
      expect(result.isLoadingItems).toBeTruthy();
      expect(result.isLoadingItemsSuccess).toBeNull();
      expect(result.itemList.ids.length).toBe(0);
    });

    it('LOAD_HISTORY_ITEMS action', () => {
      testState = {
        ...testState,
        isLoadingItems: false,
        isLoadingItemsSuccess: true,
        itemList: itemAdapter.setAll([itemData1], testState.itemList),
        error: CustomErrorAdaptor.fromJson(Error('Some Old Error'))
      };

      const action = new actions.LoadHistoryItems(null);

      const result: BinToBinTransferState = BinToBinTransferReducer(
        testState,
        action
      );

      expect(result.error).toBeNull();
      expect(result.isLoadingItems).toBeTruthy();
      expect(result.isLoadingItemsSuccess).toBeNull();
      expect(result.itemList.ids.length).toBe(0);
    });

    it('LOAD_ITEMS_SUCCESS action', () => {
      testState = {
        ...testState,
        isLoadingItems: true,
        isLoadingItemsSuccess: false,
        itemList: itemAdapter.removeAll(testState.itemList),
        itemsTotalCount: 12
      };

      const payload = {
        count: 10,
        items: [itemData1, itemData2]
      };

      const action = new actions.LoadItemsSuccess(payload);

      const result: BinToBinTransferState = BinToBinTransferReducer(
        testState,
        action
      );

      expect(result.itemsTotalCount).toBe(payload.count);
      expect(result.isLoadingItems).toBeFalsy();
      expect(result.isLoadingItemsSuccess).toBeTruthy();
      expect(result.itemList.ids.length).toBe(payload.items.length);
      expect(result.itemList.entities[itemData1.id]).toBe(itemData1);
      expect(result.itemList.entities[itemData2.id]).toBe(itemData2);
    });

    it('LOAD_HISTORY_ITEMS_SUCCESS action', () => {
      testState = {
        ...testState,
        isLoadingItems: true,
        isLoadingItemsSuccess: false,
        itemList: itemAdapter.removeAll(testState.itemList),
        itemsTotalCount: 12
      };

      const payload = {
        count: 10,
        items: [itemData1, itemData2]
      };

      const action = new actions.LoadHistoryItemsSuccess(payload);

      const result: BinToBinTransferState = BinToBinTransferReducer(
        testState,
        action
      );

      expect(result.itemsTotalCount).toBe(payload.count);
      expect(result.isLoadingItems).toBeFalsy();
      expect(result.isLoadingItemsSuccess).toBeTruthy();
      expect(result.itemList.ids.length).toBe(payload.items.length);
      expect(result.itemList.entities[itemData1.id]).toBe(itemData1);
      expect(result.itemList.entities[itemData2.id]).toBe(itemData2);
    });

    it('LOAD_ITEMS_FAILURE action', () => {
      testState = {
        ...testState,
        isLoadingItems: true,
        isLoadingItemsSuccess: true,
        error: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
      };

      const payload = CustomErrorAdaptor.fromJson(new Error('Some Error'));

      const action = new actions.LoadItemsFailure(payload);

      const result: BinToBinTransferState = BinToBinTransferReducer(
        testState,
        action
      );

      expect(result.isLoadingItems).toBeFalsy();
      expect(result.isLoadingItemsSuccess).toBeFalsy();
      expect(result.error).toBe(payload);
    });

    it('LOAD_HISTORY_ITEMS_FAILURE action', () => {
      testState = {
        ...testState,
        isLoadingItems: true,
        isLoadingItemsSuccess: true,
        error: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
      };

      const payload = CustomErrorAdaptor.fromJson(new Error('Some Error'));

      const action = new actions.LoadHistoryItemsFailure(payload);

      const result: BinToBinTransferState = BinToBinTransferReducer(
        testState,
        action
      );

      expect(result.isLoadingItems).toBeFalsy();
      expect(result.isLoadingItemsSuccess).toBeFalsy();
      expect(result.error).toBe(payload);
    });

    it('ADD_TO_ITEM_LIST action', () => {
      testState = {
        ...testState,
        itemList: itemAdapter.removeAll(testState.itemList)
      };

      const payload = [itemData1, itemData2];

      const action = new actions.AddToItemList(payload);

      const result: BinToBinTransferState = BinToBinTransferReducer(
        testState,
        action
      );

      expect(result.itemList.ids.length).toBe(payload.length);
      expect(result.itemList.entities[itemData1.id]).toBe(itemData1);
      expect(result.itemList.entities[itemData2.id]).toBe(itemData2);
    });

    it('DELETE_FROM_ITEM_LIST action', () => {
      testState = {
        ...testState,
        itemList: itemAdapter.setAll([itemData1], testState.itemList)
      };

      const payload = itemData1.id;

      const action = new actions.DeleteFromItemList(payload);

      const result: BinToBinTransferState = BinToBinTransferReducer(
        testState,
        action
      );

      expect(result.itemList.ids.length).toBe(0);
      expect(result.itemList.entities[itemData1.id]).toBeUndefined();
    });

    it('CHANGE_SELECTION_OF_ALL_ITEMS action', () => {
      testState = {
        ...testState,
        itemList: itemAdapter.setAll(
          [
            {
              ...itemData1,
              isDisabled: true,
              isSelected: false,
              destinationBinCode: 'BINCODE',
              destinationBinGroupCode: 'BINGROUPCODE'
            }
          ],
          testState.itemList
        )
      };

      const payload1: BinToBinTransferChangeSelectionPayload = {
        select: true,
        disable: false,
        idList: [itemData1.id],
        resetBin: true
      };

      const action1 = new actions.ChangeSelectionOfAllItems(payload1);

      const result1: BinToBinTransferState = BinToBinTransferReducer(
        testState,
        action1
      );

      const updatedItem1 = result1.itemList.entities[itemData1.id];
      expect(updatedItem1.isDisabled).toBeFalsy();
      expect(updatedItem1.isSelected).toBeTruthy();
      expect(updatedItem1.destinationBinCode).toBeNull();
      expect(updatedItem1.destinationBinGroupCode).toBeNull();

      const payload2: BinToBinTransferChangeSelectionPayload = {
        select: true,
        disable: false,
        idList: [itemData1.id],
        resetBin: false
      };

      const action2 = new actions.ChangeSelectionOfAllItems(payload2);

      const result2: BinToBinTransferState = BinToBinTransferReducer(
        testState,
        action2
      );

      const updatedItem2 = result2.itemList.entities[itemData1.id];

      expect(updatedItem2.destinationBinCode).not.toBeNull();
      expect(updatedItem2.destinationBinGroupCode).not.toBeNull();
    });

    it('UPDATE_LIST_ITEM action', () => {
      testState = {
        ...testState,
        itemList: itemAdapter.setAll(
          [
            {
              ...itemData1,
              isSelected: false,
              destinationBinCode: 'TEST',
              destinationBinGroupCode: 'TEST'
            }
          ],
          testState.itemList
        )
      };

      const payload1 = {
        ...itemData1,
        isSelected: true,
        destinationBinCode: 'BINCODE',
        destinationBinGroupCode: 'BINGROUPCODE'
      };

      const action = new actions.UpdateItemList(payload1);

      const result: BinToBinTransferState = BinToBinTransferReducer(
        testState,
        action
      );

      const updatedItem = result.itemList.entities[itemData1.id];
      expect(updatedItem.isSelected).toBeTruthy();
      expect(updatedItem.destinationBinCode).toBe(payload1.destinationBinCode);
      expect(updatedItem.destinationBinGroupCode).toBe(
        payload1.destinationBinGroupCode
      );
    });

    it('UPDATE_DESTINATION_BIN_FOR_SELECTED_ITEMS action', () => {
      testState = {
        ...testState,
        itemList: itemAdapter.setAll(
          [
            {
              ...itemData1,
              isSelected: false,
              destinationBinCode: 'TEST',
              destinationBinGroupCode: 'TEST'
            }
          ],
          testState.itemList
        )
      };

      const payload1 = {
        destinationBinCode: 'BINCODE',
        destinationBinGroupCode: 'BINGROUPCODE',
        idList: [itemData1.id]
      };

      const action = new actions.UpdateDestinationBinForSelectedItems(payload1);

      const result: BinToBinTransferState = BinToBinTransferReducer(
        testState,
        action
      );

      const updatedItem = result.itemList.entities[itemData1.id];
      expect(updatedItem.destinationBinCode).toBe(payload1.destinationBinCode);
      expect(updatedItem.destinationBinGroupCode).toBe(
        payload1.destinationBinGroupCode
      );
    });

    it('DELETE_SELECTED_ITEMS action', () => {
      testState = {
        ...testState,
        itemList: itemAdapter.setAll([itemData1], testState.itemList)
      };

      const payload = [itemData1.id];

      const action = new actions.DeleteSelectedItems(payload);

      const result: BinToBinTransferState = BinToBinTransferReducer(
        testState,
        action
      );

      expect(result.itemList.ids.length).toBe(0);
      expect(result.itemList.entities[itemData1.id]).toBeUndefined();
    });

    it('CONFIRM_TRANSFER_ITEMS action', () => {
      testState = {
        ...testState,
        confirmTransferResponse: { transferId: 122 },
        error: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
      };

      const action = new actions.ConfirmTransferItems(null);

      const result: BinToBinTransferState = BinToBinTransferReducer(
        testState,
        action
      );

      expect(result.error).toBeNull();
      expect(result.confirmTransferResponse).toBeNull();
    });

    it('CONFIRM_TRANSFER_ALL_ITEMS action', () => {
      testState = {
        ...testState,
        confirmTransferResponse: { transferId: 122 },
        error: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
      };

      const action = new actions.ConfirmTransferAllItems(null);

      const result: BinToBinTransferState = BinToBinTransferReducer(
        testState,
        action
      );

      expect(result.error).toBeNull();
      expect(result.confirmTransferResponse).toBeNull();
    });

    it('CONFIRM_TRANSFER_ITEMS_FAILURE action', () => {
      testState = {
        ...testState,
        error: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.ConfirmTransferItemsFailure(payload);

      const result: BinToBinTransferState = BinToBinTransferReducer(
        testState,
        action
      );

      expect(result.error).toBe(payload);
    });

    it('CONFIRM_TRANSFER_ALL_ITEMS_FAILURE action', () => {
      testState = {
        ...testState,
        error: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.ConfirmTransferAllItemsFailure(payload);

      const result: BinToBinTransferState = BinToBinTransferReducer(
        testState,
        action
      );

      expect(result.error).toBe(payload);
    });

    it('LOAD_STUDDED_PRODUCT_GROUPS_FAILURE action', () => {
      testState = {
        ...testState,
        error: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.LoadStuddedProductGroupsFailure(payload);

      const result: BinToBinTransferState = BinToBinTransferReducer(
        testState,
        action
      );

      expect(result.error).toBe(payload);
    });

    it('CONFIRM_TRANSFER_ALL_ITEMS_SUCCESS action', () => {
      testState = {
        ...testState,
        confirmTransferResponse: { transferId: 11 }
      };

      const payload = { transferId: 122 };

      const action = new actions.ConfirmTransferAllItemsSuccess(payload);

      const result: BinToBinTransferState = BinToBinTransferReducer(
        testState,
        action
      );

      expect(result.confirmTransferResponse).toBe(payload);
    });

    it('CLEAR_CONFIRM_TRANSFER_RESPONSE action', () => {
      testState = {
        ...testState,
        confirmTransferResponse: { transferId: 11 }
      };

      const action = new actions.ClearConfirmTransferResponse();

      const result: BinToBinTransferState = BinToBinTransferReducer(
        testState,
        action
      );

      expect(result.confirmTransferResponse).toBeNull();
    });

    it('CLEAR_SEARCHED_ITEMS action', () => {
      testState = {
        ...testState,
        hasSearchedItems: true,
        searchedItemList: itemAdapter.setAll(
          [itemData1],
          testState.searchedItemList
        )
      };

      const action = new actions.ClearSearchedItems();

      const result: BinToBinTransferState = BinToBinTransferReducer(
        testState,
        action
      );
      expect(result.hasSearchedItems).toBeFalsy();
      expect(result.searchedItemList.ids.length).toBe(0);
    });

    it('CLEAR_ITEMS action', () => {
      testState = {
        ...testState,
        hasSearchedItems: true,
        itemList: itemAdapter.setAll([itemData1], testState.itemList)
      };

      const action = new actions.ClearItems();

      const result: BinToBinTransferState = BinToBinTransferReducer(
        testState,
        action
      );
      expect(result.itemList.ids.length).toBe(0);
    });

    it('CLEAR_SELECTED_ITEM_GROUP action', () => {
      testState = {
        ...testState,
        selectedItemListGroup: itemGroupData1
      };

      const action = new actions.ClearSelectedItemGroup();

      const result: BinToBinTransferState = BinToBinTransferReducer(
        testState,
        action
      );
      expect(result.selectedItemListGroup).toBeNull();
    });

    it('CLEAR_ITEMS_GROUPS action', () => {
      testState = {
        ...testState,
        productGroups: itemListGroupAdapter.setAll(
          [itemGroupData1],
          testState.productGroups
        ),
        sourceBins: itemListGroupAdapter.setAll(
          [itemGroupData1],
          testState.sourceBins
        ),
        productCategory: itemListGroupAdapter.setAll(
          [itemGroupData1],
          testState.productCategory
        ),
        searchedItemListGroups: itemListGroupAdapter.setAll(
          [itemGroupData1],
          testState.searchedItemListGroups
        )
      };

      const action = new actions.ClearItemsGroups();

      const result: BinToBinTransferState = BinToBinTransferReducer(
        testState,
        action
      );
      expect(result.productGroups.ids.length).toBe(0);
      expect(result.sourceBins.ids.length).toBe(0);
      expect(result.productCategory.ids.length).toBe(0);
      expect(result.searchedItemListGroups.ids.length).toBe(0);
    });

    it('CONFIRM_TRANSFER_ITEMS_SUCCESS action', () => {
      testState = {
        ...testState,
        confirmTransferResponse: {
          transferId: 11
        },
        itemList: itemAdapter.setAll([itemData1], testState.itemList)
      };

      const payload1 = {
        confirmTransferResponse: {
          transferId: 123
        },
        itemId: [itemData1.id],
        remove: true
      };

      const action1 = new actions.ConfirmTransferItemsSuccess(payload1);

      const result1: BinToBinTransferState = BinToBinTransferReducer(
        testState,
        action1
      );
      expect(result1.confirmTransferResponse).toBe(
        payload1.confirmTransferResponse
      );

      expect(result1.itemList.ids.length).toBe(0);

      const payload2 = {
        confirmTransferResponse: {
          transferId: 123
        },
        itemId: [itemData1.id],
        remove: false
      };

      const action2 = new actions.ConfirmTransferItemsSuccess(payload2);

      const result2: BinToBinTransferState = BinToBinTransferReducer(
        testState,
        action2
      );
      expect(result2.confirmTransferResponse).toBe(
        payload2.confirmTransferResponse
      );

      expect(result2.itemList.ids.length).toBe(1);
    });

    it('LOAD_BINS action', () => {
      testState = {
        ...testState,
        isLoadingBins: false,
        bins: [
          {
            binCode: 'TEST',
            binGroupCode: 'Test'
          }
        ],
        error: CustomErrorAdaptor.fromJson(Error('Some old Error'))
      };

      const action = new actions.LoadBins();

      const result: BinToBinTransferState = BinToBinTransferReducer(
        testState,
        action
      );
      expect(result.isLoadingBins).toBeTruthy();
      expect(result.bins.length).toBe(0);
      expect(result.error).toBeNull();
    });

    it('LOAD_BINS_SUCCESS action', () => {
      testState = {
        ...testState,
        isLoadingBins: true,
        bins: []
      };

      const payload = [
        {
          binCode: 'TEST',
          binGroupCode: 'Test'
        }
      ];
      const action = new actions.LoadBinsSuccess(payload);

      const result: BinToBinTransferState = BinToBinTransferReducer(
        testState,
        action
      );
      expect(result.isLoadingBins).toBeFalsy();
      expect(result.bins.length).toBe(1);
      expect(result.bins).toBe(payload);
    });

    it('LOAD_BINS_FAILURE action', () => {
      testState = {
        ...testState,
        isLoadingBins: true,

        error: CustomErrorAdaptor.fromJson(Error('Some old Error'))
      };

      const payload = CustomErrorAdaptor.fromJson(Error('Some new Error'));

      const action = new actions.LoadBinsFailure(payload);

      const result: BinToBinTransferState = BinToBinTransferReducer(
        testState,
        action
      );
      expect(result.isLoadingBins).toBeFalsy();
      expect(result.error).toBe(payload);
    });

    it('LOAD_PRODUCT_GROUP_OPTIONS action', () => {
      testState = {
        ...testState,
        isLoadingProductGroupOptions: false,
        error: CustomErrorAdaptor.fromJson(Error('Some old Error'))
      };

      const action = new actions.LoadProductGroupOptions();

      const result: BinToBinTransferState = BinToBinTransferReducer(
        testState,
        action
      );
      expect(result.isLoadingProductGroupOptions).toBeTruthy();
      expect(result.error).toBeNull();
    });

    it('LOAD_PRODUCT_GROUP_OPTIONS_SUCCESS action', () => {
      testState = {
        ...testState,
        isLoadingProductGroupOptions: true,
        productGroupOptions: []
      };

      const payload = [
        {
          productGroupCode: 'Test',
          description: 'Test'
        }
      ];
      const action = new actions.LoadProductGroupOptionsSuccess(payload);

      const result: BinToBinTransferState = BinToBinTransferReducer(
        testState,
        action
      );
      expect(result.isLoadingProductGroupOptions).toBeFalsy();
      expect(result.productGroupOptions.length).toBe(1);
      expect(result.productGroupOptions).toBe(payload);
    });

    it('LOAD_PRODUCT_GROUP_OPTIONS_FAILURE action', () => {
      testState = {
        ...testState,
        isLoadingProductGroupOptions: true,

        error: CustomErrorAdaptor.fromJson(Error('Some old Error'))
      };

      const payload = CustomErrorAdaptor.fromJson(Error('Some new Error'));

      const action = new actions.LoadProductGroupOptionsFailure(payload);

      const result: BinToBinTransferState = BinToBinTransferReducer(
        testState,
        action
      );
      expect(result.isLoadingProductGroupOptions).toBeFalsy();
      expect(result.error).toBe(payload);
    });

    it('LOAD_PRODUCT_CATEGORY_OPTIONS action', () => {
      testState = {
        ...testState,
        isLoadingProductCategoryOptions: false,
        error: CustomErrorAdaptor.fromJson(Error('Some old Error'))
      };

      const action = new actions.LoadProductCategoryOptions();

      const result: BinToBinTransferState = BinToBinTransferReducer(
        testState,
        action
      );
      expect(result.isLoadingProductCategoryOptions).toBeTruthy();
      expect(result.error).toBeNull();
    });

    it('LOAD_PRODUCT_CATEGORY_OPTIONS_SUCCESS action', () => {
      testState = {
        ...testState,
        isLoadingProductCategoryOptions: true,
        productCategoryOptions: []
      };

      const payload = [
        {
          productCategoryCode: 'Test',
          description: 'Test'
        }
      ];
      const action = new actions.LoadProductCategoryOptionsSuccess(payload);

      const result: BinToBinTransferState = BinToBinTransferReducer(
        testState,
        action
      );
      expect(result.isLoadingProductCategoryOptions).toBeFalsy();
      expect(result.productCategoryOptions.length).toBe(1);
      expect(result.productCategoryOptions).toBe(payload);
    });

    it('LOAD_PRODUCT_CATEGORY_OPTIONS_FAILURE action', () => {
      testState = {
        ...testState,
        isLoadingProductCategoryOptions: true,
        error: CustomErrorAdaptor.fromJson(Error('Some old Error'))
      };

      const payload = CustomErrorAdaptor.fromJson(Error('Some new Error'));

      const action = new actions.LoadProductCategoryOptionsFailure(payload);

      const result: BinToBinTransferState = BinToBinTransferReducer(
        testState,
        action
      );
      expect(result.isLoadingProductCategoryOptions).toBeFalsy();
      expect(result.error).toBe(payload);
    });

    it('LOAD_SOURCE_BIN_OPTIONS action', () => {
      testState = {
        ...testState,
        isLoadingSoruceBinOptionsOptions: false,
        error: CustomErrorAdaptor.fromJson(Error('Some old Error'))
      };

      const action = new actions.LoadSourceBinOptions();

      const result: BinToBinTransferState = BinToBinTransferReducer(
        testState,
        action
      );
      expect(result.isLoadingSoruceBinOptionsOptions).toBeTruthy();
      expect(result.error).toBeNull();
    });

    it('LOAD_SOURCE_BIN_OPTIONS_SUCCESS action', () => {
      testState = {
        ...testState,
        isLoadingSoruceBinOptionsOptions: true,
        soruceBinOptions: []
      };

      const payload = ['Test1', 'Test2'];
      const action = new actions.LoadSourceBinOptionsSuccess(payload);

      const result: BinToBinTransferState = BinToBinTransferReducer(
        testState,
        action
      );
      expect(result.isLoadingSoruceBinOptionsOptions).toBeFalsy();
      expect(result.soruceBinOptions.length).toBe(2);
      expect(result.soruceBinOptions).toBe(payload);
    });

    it('LOAD_SOURCE_BIN_OPTIONS_FAILURE action', () => {
      testState = {
        ...testState,
        isLoadingSoruceBinOptionsOptions: true,
        error: CustomErrorAdaptor.fromJson(Error('Some old Error'))
      };

      const payload = CustomErrorAdaptor.fromJson(Error('Some new Error'));

      const action = new actions.LoadSourceBinOptionsFailure(payload);

      const result: BinToBinTransferState = BinToBinTransferReducer(
        testState,
        action
      );
      expect(result.isLoadingSoruceBinOptionsOptions).toBeFalsy();
      expect(result.error).toBe(payload);
    });

    it('LOAD_STUDDED_PRODUCT_GROUPS_SUCCESS action', () => {
      testState = {
        ...testState,
        studdedProductGroups: []
      };

      const payload = ['Test1', 'Test2'];
      const action = new actions.LoadStuddedProductGroupsSuccess(payload);

      const result: BinToBinTransferState = BinToBinTransferReducer(
        testState,
        action
      );
      expect(result.studdedProductGroups.length).toBe(2);
      expect(result.studdedProductGroups).toBe(payload);
    });

    it('LOAD_BIN_TO_BIN_HISTORY action', () => {
      testState = {
        ...testState,
        isLoadingHistory: false,
        error: CustomErrorAdaptor.fromJson(Error('Some old Error'))
      };

      const action = new actions.LoadBinToBinHistory(null);

      const result: BinToBinTransferState = BinToBinTransferReducer(
        testState,
        action
      );
      expect(result.isLoadingHistory).toBeTruthy();
      expect(result.error).toBeNull();
    });

    it('LOAD_BIN_TO_BIN_HISTORY_SUCCESS action', () => {
      testState = {
        ...testState,
        binToBinHistory: binToBinTransferHistoryAdaptor.removeAll(
          testState.binToBinHistory
        ),
        isLoadingHistory: true,
        binToBinHistoryCount: 12
      };

      const payload = {
        count: 123,
        items: [history1]
      };
      const action = new actions.LoadBinToBinHistorySuccess(payload);

      const result: BinToBinTransferState = BinToBinTransferReducer(
        testState,
        action
      );
      expect(result.isLoadingHistory).toBeFalsy();
      expect(result.binToBinHistoryCount).toBe(payload.count);
      expect(result.binToBinHistory.ids.length).toBe(payload.items.length);
      expect(result.binToBinHistory.entities[history1.id]).toBe(history1);
    });

    it('LOAD_BIN_TO_BIN_HISTORY_FAILURE action', () => {
      testState = {
        ...testState,
        isLoadingHistory: true,
        error: CustomErrorAdaptor.fromJson(Error('Some old Error'))
      };

      const payload = CustomErrorAdaptor.fromJson(Error('Some new Error'));

      const action = new actions.LoadBinToBinHistoryFailure(payload);

      const result: BinToBinTransferState = BinToBinTransferReducer(
        testState,
        action
      );
      expect(result.isLoadingHistory).toBeFalsy();
      expect(result.error).toBe(payload);
    });

    it('RESET_HISTORY_FILTER_DATA action', () => {
      testState = {
        ...testState,
        advancedFilter: {
          startDate: moment().startOf('day').valueOf(),
          endDate: moment().endOf('day').valueOf(),
          fiscalYear: 2020
        }
      };

      const expected = {
        startDate: moment().startOf('day').valueOf(),
        endDate: moment().endOf('day').valueOf(),
        fiscalYear: null
      };
      const payload = 1641839400000;

      const action = new actions.ResetHstoryFilter(payload);

      const result: BinToBinTransferState = BinToBinTransferReducer(
        testState,
        action
      );
      expect(result.advancedFilter.fiscalYear).toBeDefined();
      expect(result.advancedFilter.startDate).toBeDefined();
      expect(result.advancedFilter.endDate).toBeDefined();
    });

    it('LOAD_HISTORY_FILTER_DATA action', () => {
      testState = {
        ...testState,
        advancedFilter: {
          startDate: '20-10-2020',
          endDate: '23-10-2020',
          fiscalYear: 2020
        }
      };

      const payload = {
        startDate: '23-10-2020',
        endDate: '27-10-2020',
        fiscalYear: 2020
      };

      const action = new actions.LoadHistoryFilterData(payload);

      const result: BinToBinTransferState = BinToBinTransferReducer(
        testState,
        action
      );
      expect(result.advancedFilter.fiscalYear).toBe(payload.fiscalYear);
      expect(result.advancedFilter.startDate).toBe(payload.startDate);
      expect(result.advancedFilter.endDate).toBe(payload.endDate);
    });

    it('LOAD_SELECTED_HISTORY_FAILURE action', () => {
      testState = {
        ...testState,
        isLoadingSelectedHistory: true,
        hasSelectedHistory: true,
        error: CustomErrorAdaptor.fromJson(Error('Some old Error'))
      };

      const payload = CustomErrorAdaptor.fromJson(Error('Some new Error'));

      const action = new actions.LoadSelectedHistoryFailure(payload);

      const result: BinToBinTransferState = BinToBinTransferReducer(
        testState,
        action
      );
      expect(result.isLoadingSelectedHistory).toBeFalsy();
      expect(result.hasSelectedHistory).toBeFalsy();
      expect(result.error).toBe(payload);
    });

    it('LOAD_SELECTED_HISTORY action', () => {
      testState = {
        ...testState,
        isLoadingSelectedHistory: false,
        items: binToBinTransferHistoryAdaptor.setAll(
          [history1],
          testState.items
        ),
        itemsTotalCount: 12,
        isLoadingItems: true,
        isLoadingItemsSuccess: true,
        selectedHistory: history1,
        hasSelectedHistory: true,
        error: CustomErrorAdaptor.fromJson(Error('Some old Error'))
      };

      const payload = CustomErrorAdaptor.fromJson(Error('Some new Error'));

      const action = new actions.LoadSelectedHistory(null);

      const result: BinToBinTransferState = BinToBinTransferReducer(
        testState,
        action
      );
      expect(result.isLoadingSelectedHistory).toBeTruthy();
      expect(result.hasSelectedHistory).toBeFalsy();
      expect(result.selectedHistory).toBeNull();
      expect(result.isLoadingItemsSuccess).toBeNull();
      expect(result.isLoadingItems).toBeFalsy();
      expect(result.itemsTotalCount).toBe(0);
      expect(result.items.ids.length).toBe(0);

      expect(result.error).toBeNull();
    });

    it('RESET_LOADED_HISTORY action', () => {
      testState = {
        ...testState,
        binToBinHistoryCount: 123,
        binToBinHistory: binToBinTransferHistoryAdaptor.setAll(
          [history1],
          testState.binToBinHistory
        )
      };

      const payload = CustomErrorAdaptor.fromJson(Error('Some new Error'));

      const action = new actions.ResetLoadedHistory();

      const result: BinToBinTransferState = BinToBinTransferReducer(
        testState,
        action
      );

      expect(result.binToBinHistoryCount).toBe(0);
      expect(result.binToBinHistory.ids.length).toBe(0);
    });

    it('LOAD_SELECTED_HISTORY_SUCCESS action', () => {
      testState = {
        ...testState,
        isLoadingSelectedHistory: true,
        hasSelectedHistory: false,
        selectedHistory: null
      };

      const payload = history1;

      const action = new actions.LoadSelectedHistorySuccess(payload);

      const result: BinToBinTransferState = BinToBinTransferReducer(
        testState,
        action
      );

      expect(result.isLoadingSelectedHistory).toBeFalsy();
      expect(result.hasSelectedHistory).toBeTruthy();
    });
  });
});
