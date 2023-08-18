import * as actions from './item.actions';
import { ItemListingState } from './item.state';
import { initialState, ItemReducer } from './item.reducer';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  LoadItemListingPayload,
  ItemFilter,
  LoadItemListingSuccessPayload,
  ItemStones,
  ProductGroup,
  Lov
} from '@poss-web/shared/models';
describe('Stone Type reducer Testing Suite', () => {
  describe('Testing Load stone type details list', () => {
    beforeEach(() => {});
    it('  Load Item Filter should return list of stone types', () => {
      const filterPayLoad = {
        fromStdValue: 10,
        fromStdWeight: 10,
        fromStoneCharges: 10,
        itemCode: 'ABC',
        pricingType: 'ABC',
        productCategoryCode: 'ABC',
        productGroupCode: 'ABC',
        toStdValue: 100,
        toStdWeight: 100,
        toStoneCharges: 100
      };
      const paginage: LoadItemListingPayload = {
        pageIndex: 0,
        pageSize: 100
      };
      const payload: ItemFilter = {
        filterPayload: filterPayLoad,
        paginate: paginage
      };
      const action = new actions.LoadFilterItemDetails(payload);
      const result: ItemListingState = ItemReducer(initialState, action);
      expect(result.isLoading).toBe(true);
      expect(result.itemFilter).toBe(payload);
    });

    it('LoadStoneTypeDetailsSuccess should return list of stone types', () => {
      const payload: LoadItemListingSuccessPayload = {
        itemListing: [
          {
            itemCode: 'itemCode',
            description: 'itemCode'
          }
        ],
        totalElements: 1
      };
      const action = new actions.LoadFilterItemDetailsSuccess(payload);
      const result: ItemListingState = ItemReducer(initialState, action);
      expect(result.isLoading).toBe(false);
      expect(result.itemListing).toBe(payload.itemListing);
      expect(result.totalItemDetails).toBe(payload.itemListing.length);
    });

    it('LoadFilterItemDetailsFailure should return list of stone types', () => {
      const action = new actions.LoadFilterItemDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: ItemListingState = ItemReducer(initialState, action);
      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing Load Item by item code list', () => {
    beforeEach(() => {});
    it('LoadItemByItemCode should return list of stone types', () => {
      const payload = 'AZ';
      const action = new actions.LoadItemByItemCode(payload);
      const result: ItemListingState = ItemReducer(initialState, action);
      expect(result.isLoading).toBe(true);
    });

    it('LoadItemByItemCodeSuccess should return list of stone types', () => {
      const payload = {
        isEditable: true,
        itemCode: 'ABC',
        description: 'ABC',
        isActive: true,
        stoneWeight: 'ABC',
        indentType: 'ABC',
        isConsignable: true,
        maxWeightDeviation: 'ABC',
        stdWeight: 'ABC',
        productCode: 'ABC',
        brandCode: 'ABC',
        productType: 'ABC',
        materialCode: 'ABC',
        supplyChainCode: 'ABC',
        itemNature: 'ABC',
        stdPrice: 'ABC',
        stoneCharges: 'ABC',
        leadTime: 'ABC',
        hsnSacCode: 'ABC',
        purity: 'ABC',
        inventoryType: 'ABC',
        CFAproductCode: 'ABC',
        complexityCode: 'ABC',
        pricingType: 'ABC',
        taxClass: 'ABC',
        findingCode: 'ABC',
        size: 'ABC',
        finishing: 'ABC',
        pricingGroupType: 'ABC',
        priceFactor: 'ABC',
        karatage: 'ABC',
        diamondKaratage: 'ABC',
        diamondClarity: 'ABC',
        diamondColour: 'ABC',
        perGram: true,
        saleable: true,
        returnable: true,
        indentable: true
      };
      const action = new actions.LoadItemByItemCodeSuccess(payload);
      const result: ItemListingState = ItemReducer(initialState, action);
      expect(result.isLoading).toBe(false);
      expect(result.itemDetails).toBe(payload);
    });

    it('LoadStoneTypeByStoneTypeCodeFailure should return list of stonetypecode', () => {
      const action = new actions.LoadItemByItemCodeFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: ItemListingState = ItemReducer(initialState, action);
      expect(result.error.message).toEqual('some error');
    });
  });

  // describe('Testing SearchItem  by Item code list', () => {
  //   beforeEach(() => {});
  //   it('SearchItem should return list of stone types', () => {
  //     const payload = 'ABC';
  //     const action = new actions.SearchItem(payload);
  //     const result: ItemListingState = ItemReducer(initialState, action);
  //     expect(result.isLoading).toBe(true);
  //   });

  //   it('SearchItemSuccess should return list of item data', () => {
  //     const payload = [
  //       {
  //         itemCode: 'itemCode',
  //         description: 'itemCode'
  //       }
  //     ];
  //     const action = new actions.SearchItemSuccess(payload);
  //     const result: ItemListingState = ItemReducer(initialState, action);
  //     expect(result.isLoading).toBe(false);
  //     expect(result.itemListing).toBe(payload);
  //     expect(result.totalItemDetails).toBe(payload.length);
  //   });

  //   it('SearchItemFailure should return list of stonetypecode', () => {
  //     const action = new actions.SearchItemFailure(
  //       CustomErrorAdaptor.fromJson(Error('some error'))
  //     );
  //     const result: ItemListingState = ItemReducer(initialState, action);
  //     expect(result.error.message).toEqual('some error');
  //   });
  // });

  describe('Testing LoadStones  by Item code ', () => {
    beforeEach(() => {});
    it('LoadStones should return list of stone details', () => {
      const payload = 'stonetypecode';
      const action = new actions.LoadStones(payload);
      const result: ItemListingState = ItemReducer(initialState, action);
      expect(result.isLoading).toBe(true);
    });

    it('LoadStonesSuccess should return list of item data', () => {
      const payload: ItemStones[] = [
        {
          id: 'ABC',
          isActive: true,
          itemCode: 'ABC',
          noOfStones: 2,
          stoneCode: 'ABC'
        }
      ];
      const action = new actions.LoadStonesSuccess(payload);
      const result: ItemListingState = ItemReducer(initialState, action);
      expect(result.isLoading).toBe(false);
      expect(result.itemStones).toBe(payload);
    });

    it('LoadStonesFailure should return some error', () => {
      const action = new actions.LoadStonesFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: ItemListingState = ItemReducer(initialState, action);
      expect(result.error.message).toEqual('some error');
    });
  });
  describe('Testing LoadCFAProductCode  ', () => {
    beforeEach(() => {});
    it('LoadCFAProductCode should return list of Product Groups', () => {
      const action = new actions.LoadCFAProductCode();
      const result: ItemListingState = ItemReducer(initialState, action);
      expect(result.isLoading).toBe(true);
    });

    it('LoadCFAProductCodeSuccess should return list of item data', () => {
      const payload: ProductGroup[] = [
        { productGroupCode: '71', description: 'abc' }
      ];
      const action = new actions.LoadCFAProductCodeSuccess(payload);
      const result: ItemListingState = ItemReducer(initialState, action);
      expect(result.isLoading).toBe(false);
      expect(result.CFAproductCode).toBe(payload);
    });

    it('LoadCFAProductCodeFailure should return some error', () => {
      const action = new actions.LoadCFAProductCodeFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: ItemListingState = ItemReducer(initialState, action);
      expect(result.error.message).toEqual('some error');
    });
  });
  describe('Testing LoadPricingType ', () => {
    beforeEach(() => {});
    it('LoadPricingType should return list of stone details', () => {
      const payload = 'PRICING TYPE';
      const action = new actions.LoadPricingType(payload);
      const result: ItemListingState = ItemReducer(initialState, action);
      expect(result.isLoading).toBe(true);
    });

    it('LoadPricingTypeSuccess should return list of item data', () => {
      const payload: Lov[] = [{ code: '', value: 'abc', isActive: true }];
      const action = new actions.LoadPricingTypeSuccess(payload);
      const result: ItemListingState = ItemReducer(initialState, action);
      expect(result.isLoading).toBe(false);
      expect(result.pricingType).toBe(payload);
    });

    it('LoadPricingTypeFailure should return some error', () => {
      const action = new actions.LoadPricingTypeFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: ItemListingState = ItemReducer(initialState, action);
      expect(result.error.message).toEqual('some error');
    });
  });
  describe('Testing StoreFilter ', () => {
    beforeEach(() => {});
    it('ResetFilter should reset the store', () => {
      const payload = {
        fromStdValue: 10,
        fromStdWeight: 10,
        fromStoneCharges: 10,
        itemCode: 'ABC',
        pricingType: 'ABC',
        productCategoryCode: 'ABC',
        productGroupCode: 'ABC',
        toStdValue: 100,
        toStdWeight: 100,
        toStoneCharges: 100
      };
      const action = new actions.StoreFilter(payload);

      const result: ItemListingState = ItemReducer(initialState, action);
      expect(result.filterPayload).toEqual(payload);
    });
  });
  describe('Testing ResetItemByItemCode ', () => {
    beforeEach(() => {});
    it('ResetItemByItemCode should reset the store', () => {
      const action = new actions.ResetItemByItemCode();

      const result: ItemListingState = ItemReducer(initialState, action);

      expect(result).toEqual(initialState);
    });
  });
  describe('Testing ResetFilter ', () => {
    beforeEach(() => {});
    it('ResetFilter should reset the store', () => {
      const action = new actions.ResetFilter();

      const result: ItemListingState = ItemReducer(initialState, action);

      expect(result).toEqual(initialState);
    });
  });
});
