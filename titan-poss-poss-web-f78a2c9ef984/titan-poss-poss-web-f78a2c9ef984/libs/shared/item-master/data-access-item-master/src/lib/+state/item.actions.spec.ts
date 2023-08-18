import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  CustomErrors,
  ListingPageData,
  ItemStones,
  ItemFilter,
  ItemFilterPayload,
  LoadItemListingPayload,
  LoadItemListingSuccessPayload,
  ItemDetails,
  ProductGroup,
  Lov
} from '@poss-web/shared/models';
import {
  ItemActionTypes,
  LoadItemByItemCode,
  LoadItemByItemCodeSuccess,
  LoadItemByItemCodeFailure,
  ResetItemByItemCode,
  // SearchItem,
  // SearchItemSuccess,
  // SearchItemFailure,
  LoadStones,
  LoadStonesSuccess,
  LoadStonesFailure,
  LoadFilterItemDetails,
  LoadFilterItemDetailsSuccess,
  LoadFilterItemDetailsFailure,
  StoreFilter,
  ResetFilter,
  LoadCFAProductCode,
  LoadCFAProductCodeSuccess,
  LoadCFAProductCodeFailure,
  LoadPricingType,
  LoadPricingTypeSuccess,
  LoadPricingTypeFailure
} from './item.actions';
describe('Item Action Testing Suite', () => {
  describe('LoadFilterItemDetails Action Test Cases', () => {
    it('should check correct type is used for  LoadFilterItemDetails action ', () => {
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
      const action = new LoadFilterItemDetails(payload);
      expect({ ...action }).toEqual({
        type: ItemActionTypes.LOAD_ITEM_FILTER,
        payload
      });
    });
    it('should check correct type is used for  LoadFilterItemDetailsSuccess action ', () => {
      const payload: LoadItemListingSuccessPayload = {
        itemListing: [],
        totalElements: 0
      };
      const action = new LoadFilterItemDetailsSuccess(payload);

      expect({ ...action }).toEqual({
        type: ItemActionTypes.LOAD_ITEM_FILTER_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadFilterItemDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadFilterItemDetailsFailure(payload);

      expect({ ...action }).toEqual({
        type: ItemActionTypes.LOAD_ITEM_FILTER_FAILURE,
        payload
      });
    });
  });

  describe('LoadItemByItemCode Action Test Cases', () => {
    it('should check correct type is used for  LoadItemByItemCode action ', () => {
      const payload = 'abc';
      const action = new LoadItemByItemCode(payload);
      expect({ ...action }).toEqual({
        type: ItemActionTypes.LOAD_ITEM_DETAILS_BY_ITEM_CODE,
        payload
      });
    });
    it('should check correct type is used for LoadItemByItemCodeSuccess action ', () => {
      const payload: ItemDetails = {
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

      const action = new LoadItemByItemCodeSuccess(payload);

      expect({ ...action }).toEqual({
        type: ItemActionTypes.LOAD_ITEM_DETAILS_BY_ITEM_CODE_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for   LoadItemByItemCodeFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadItemByItemCodeFailure(payload);

      expect({ ...action }).toEqual({
        type: ItemActionTypes.LOAD_ITEM_DETAILS_BY_ITEM_CODE_FAILURE,
        payload
      });
    });
  });
  // describe('SearchItemCode Action Test Cases', () => {
  //   it('should check correct type is used for  SearchItemCode action ', () => {
  //     const payload = 'ABC';
  //     const action = new SearchItem(payload);
  //     expect({ ...action }).toEqual({
  //       type: ItemActionTypes.SEARCH_ITEM,
  //       payload
  //     });
  //   });
  //   it('should check correct type is used for SearchItemCodeSuccess action ', () => {
  //     const payload: ListingPageData[] = [
  //       {
  //         itemCode: 'ABC',
  //         description: 'ABC'
  //       }
  //     ];
  //     const action = new SearchItemSuccess(payload);

  //     expect({ ...action }).toEqual({
  //       type: ItemActionTypes.SEARCH_ITEM_SUCCESS,
  //       payload
  //     });
  //   });
  //   it('should check correct type is used for SearchItemCodeFailure action ', () => {
  //     const payload: CustomErrors = CustomErrorAdaptor.fromJson(
  //       Error('Some Error')
  //     );
  //     const action = new SearchItemFailure(payload);

  //     expect({ ...action }).toEqual({
  //       type: ItemActionTypes.SEARCH_ITEM_FAILURE,
  //       payload
  //     });
  //   });
  // });

  describe('LoadStones Action Test Cases', () => {
    it('should check correct type is used for  LoadStones action ', () => {
      const payload = 'ABC';
      const action = new LoadStones(payload);
      expect({ ...action }).toEqual({
        type: ItemActionTypes.LOAD_STONES,
        payload
      });
    });
    it('should check correct type is used for LoadStonesSuccess action ', () => {
      const payload: ItemStones[] = [
        {
          id: 'ABC',
          isActive: true,
          itemCode: 'ABC',
          noOfStones: 2,
          stoneCode: 'ABC'
        }
      ];
      const action = new LoadStonesSuccess(payload);

      expect({ ...action }).toEqual({
        type: ItemActionTypes.LOAD_STONES_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadStonesFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadStonesFailure(payload);

      expect({ ...action }).toEqual({
        type: ItemActionTypes.LOAD_STONES_FAILURE,
        payload
      });
    });
  });

  describe('StoreFilter Action Test Cases', () => {
    it('should check correct type is used for  StoreFilter action ', () => {
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
      const action = new StoreFilter(payload);
      expect({ ...action }).toEqual({
        type: ItemActionTypes.STORE_FILTER_DATA,
        payload
      });
    });
  });
  describe('LoadCFAProductCode Action Test Cases', () => {
    it('should check correct type is used for  LoadCFAProductCode action ', () => {
      const action = new LoadCFAProductCode();
      expect({ ...action }).toEqual({
        type: ItemActionTypes.LOAD_CFAPRODUCT_CODE
      });
    });
    it('should check correct type is used for LoadCFAProductCodeSuccess action ', () => {
      const payload: ProductGroup[] = [
        { productGroupCode: '71', description: 'abc' }
      ];

      const action = new LoadCFAProductCodeSuccess(payload);

      expect({ ...action }).toEqual({
        type: ItemActionTypes.LOAD_CFAPRODUCT_CODE_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadCFAProductCodeFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadCFAProductCodeFailure(payload);

      expect({ ...action }).toEqual({
        type: ItemActionTypes.LOAD_CFAPRODUCT_CODE_FAILURE,
        payload
      });
    });
  });

  describe('LoadPricingType Action Test Cases', () => {
    it('should check correct type is used for  LoadPricingType action ', () => {
      const payload = 'PRICINGTYPE';
      const action = new LoadPricingType(payload);
      expect({ ...action }).toEqual({
        type: ItemActionTypes.LOAD_PRICING_TYPES,
        payload
      });
    });
    it('should check correct type is used for LoadPricingTypeSuccess action ', () => {
      const payload: Lov[] = [{ code: 'abc', isActive: true, value: 'abc' }];

      const action = new LoadPricingTypeSuccess(payload);

      expect({ ...action }).toEqual({
        type: ItemActionTypes.LOAD_PRICING_TYPES_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadPricingTypeFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadPricingTypeFailure(payload);

      expect({ ...action }).toEqual({
        type: ItemActionTypes.LOAD_PRICING_TYPES_FAILURE,
        payload
      });
    });
  });
  describe('ResetItemByItemCode Action Test Cases', () => {
    it('should check correct type is used for  ResetItemByItemCode action ', () => {
      const action = new ResetItemByItemCode();
      expect({ ...action }).toEqual({
        type: ItemActionTypes.RESET_ITEM_DETAILS_BY_ITEM_CODE
      });
    });
  });
  describe('ResetFilter Action Test Cases', () => {
    it('should check correct type is used for  ResetFilter action ', () => {
      const action = new ResetFilter();
      expect({ ...action }).toEqual({
        type: ItemActionTypes.RESET_FILTER_DATA
      });
    });
  });
});
