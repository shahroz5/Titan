import {
  CustomErrors,
  LoadCFAProductCodeListingPayload,
  LoadCFAProductCodeListingSuccessPayload,
  CFAProducts,
  UpdateCFAProductsPayload,
  ProductType,
  ItemTypesResponse,
  ProductGroupDetails
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  CFAProductCodeActionTypes,
  LoadCFAProducts,
  LoadCFAProductsBasedOnProductGroupCode,
  LoadCFAProductsBasedOnProductGroupCodeFailure,
  LoadCFAProductsBasedOnProductGroupCodeSuccess,
  LoadCFAProductsFailure,
  LoadCFAProductsSuccess,
  LoadItemTypes,
  LoadItemTypesFailure,
  LoadItemTypesSuccess,
  LoadProductTypes,
  LoadProductTypesFailure,
  LoadProductTypesSuccess,
  ResetCFAProducts,
  SaveCFAProducts,
  SaveCFAProductsFailure,
  SaveCFAProductsSuccess,
  SearchCFAproduct,
  SearchCFAProductFailure,
  SearchCFAProductSuccess,
  UpdateCFAProducts,
  UpdateCFAProductsFailure,
  UpdateCFAProductsSuccess
} from './cfa-product-code.actions';
const dummyCFAProductCodeListing: LoadCFAProductCodeListingSuccessPayload = {
  CFAProductCodeListing: [
    {
      productGroupCode: 'ProductGroupCode1',
      description: 'ProductGroupCode is ProductGroupCode1',
      isActive: true
    },
    {
      productGroupCode: 'ProductGroupCode2',
      description: 'ProductGroupCode is ProductGroupCode2',
      isActive: true
    }
  ],
  totalElements: 2
};
const dummyCFAProductCode: ProductGroupDetails = {
  productGroupCode: 'CFA',
  description: 'CFA',
  itemTypeCode: 'MIA',
  orgCode: 'ORG',
  isEligibleForLoyaltyPoints: true,
  printGuranteeCard: true,
  isGRNEnabled: true,
  isConversionEnabled: true,
  isBestGoldRateEnabled: true,
  isGoldPriceMandatory: true,
  isMakingChargeMandatory: true,
  isPlatinumPriceMandatory: true,
  isSilverPriceMandatory: true,
  isStonePriceMandatory: true,
  isActive: true,
  isMia: true,
  plainStudded: 'Plian',
  plainStuddedTep: 'Studded',
  plainStuddedGrn: 'Grn',
  plainStuddedGrf: 'Grf',
  pricingType: 'Price',
  isAllowedForDigiGoldMandatory: true
};
const saveCFAProdcuts = {
  productGroupCode: 'CFA',
  productType: 'MIA',
  description: 'MIA',
  itemTypeCode: 'Plain',
  orgCode: 'ORG',
  isActive: true,
  configDetails: {}
};
describe('CFA Product Code Testing Suite', () => {
  describe('LoadCFAProducts Action Test Cases', () => {
    it('should check correct type is used for  LoadCFAProducts action ', () => {
      const payload: LoadCFAProductCodeListingPayload = {
        pageIndex: 0,
        pageSize: 100
      };
      const action = new LoadCFAProducts(payload);

      expect(action.type).toEqual(CFAProductCodeActionTypes.LOAD_CFA_PRODUCTS);
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  LoadCFAProductsSuccess action ', () => {
      const payload: LoadCFAProductCodeListingSuccessPayload = dummyCFAProductCodeListing;
      const action = new LoadCFAProductsSuccess(payload);

      expect(action.type).toEqual(
        CFAProductCodeActionTypes.LOAD_CFA_PRODUCTS_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  LoadCFAProductsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadCFAProductsFailure(payload);

      expect(action.type).toEqual(
        CFAProductCodeActionTypes.LOAD_CFA_PRODUCTS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });
  describe('LoadCFAProductsBasedOnProductGroupCode Action Test Cases', () => {
    it('should check correct type is used for  LoadCFAProductsBasedOnProductGroupCode action ', () => {
      const action = new LoadCFAProductsBasedOnProductGroupCode('Product123');
      expect(action.type).toEqual(
        CFAProductCodeActionTypes.LOAD_CFA_PRODUCTS_BASED_ON_PRODUCTGROUPCODE
      );
      expect(action.payload).toEqual('Product123');
    });
    it('should check correct type is used for  LoadCFAProductsBasedOnProductGroupCode action ', () => {
      const action = new LoadCFAProductsBasedOnProductGroupCodeSuccess(
        dummyCFAProductCode
      );
      expect(action.type).toEqual(
        CFAProductCodeActionTypes.LOAD_CFA_PRODUCTS_BASED_ON_PRODUCTGROUPCODE_SUCCESS
      );
      expect(action.payload).toEqual(dummyCFAProductCode);
    });
    it('should check correct type is used for  LoadCFAProductsBasedOnProductGroupCodeFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadCFAProductsBasedOnProductGroupCodeFailure(payload);

      expect(action.type).toEqual(
        CFAProductCodeActionTypes.LOAD_CFA_PRODUCTS_BASED_ON_PRODUCTGROUPCODE_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });
  describe('SearchCFAproduct Action Test Cases', () => {
    it('should check correct type is used for  SearchCFAproduct action ', () => {
      const action = new SearchCFAproduct('Product123');
      expect(action.type).toEqual(CFAProductCodeActionTypes.SEARCH_CFA_PRODUCT);
      expect(action.payload).toEqual('Product123');
    });
    it('should check correct type is used for  SearchCFAProductSuccess action ', () => {
      const payload: CFAProducts[] = [
        {
          productGroupCode: 'ProductGroupCode1',
          productType: 'ProductType1',
          description: 'ProductGroupCode is ProductGroupCode1',
          itemTypeCode: 'materialTypeCode1',
          orgCode: '12',
          isActive: true,
          configDetails: {}
        }
      ];
      const action = new SearchCFAProductSuccess(payload);
      expect(action.type).toEqual(
        CFAProductCodeActionTypes.SEARCH_CFA_PRODUCT_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  SearchCFAProductFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SearchCFAProductFailure(payload);

      expect(action.type).toEqual(
        CFAProductCodeActionTypes.SEARCH_CFA_PRODUCT_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });
  describe('SaveCFAProducts Action Test Cases', () => {
    it('should check correct type is used for  SaveCFAProducts action ', () => {
      const action = new SaveCFAProducts(saveCFAProdcuts);
      expect(action.type).toEqual(CFAProductCodeActionTypes.SAVE_CFA_PRODUCTS);
    });
    it('should check correct type is used for  SaveCFAProductsSuccess action ', () => {
      const action = new SaveCFAProductsSuccess();
      expect(action.type).toEqual(
        CFAProductCodeActionTypes.SAVE_CFA_PRODUCTS_SUCCESS
      );
      //expect(action.payload).toEqual('');
    });
    it('should check correct type is used for  SaveCFAProductsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SaveCFAProductsFailure(payload);

      expect(action.type).toEqual(
        CFAProductCodeActionTypes.SAVE_CFA_PRODUCTS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });
  describe('ResetCFAProducts Action Test Cases', () => {
    it('should check correct type is used for  SearchCFAproduct action ', () => {
      const action = new ResetCFAProducts();
      expect(action.type).toEqual(CFAProductCodeActionTypes.RESET_CFA_PRODUCTS);
      //expect(action.payload).toEqual('Product123');
    });
  });
  describe('UpdateCFAProducts Action Test Cases', () => {
    it('should check correct type is used for  UpdateCFAProducts action ', () => {
      const uploadPayload: UpdateCFAProductsPayload = {
        productGroupCode: 'Pro123',
        data: {
          productGroupCode: 'ProductGroupCode1',
          productType: 'ProductType1',
          description: 'ProductGroupCode is ProductGroupCode1',
          materialTypeCode: 'materialTypeCode1',
          orgCode: '12',
          isActive: true,
          configDetails: {}
        }
      };
      const action = new UpdateCFAProducts(uploadPayload);
      expect(action.type).toEqual(
        CFAProductCodeActionTypes.UPDATE_CFA_PRODUCTS
      );
      expect(action.payload).toEqual(uploadPayload);
    });
    it('should check correct type is used for  UpdateCFAProductsSuccess action ', () => {
      const action = new UpdateCFAProductsSuccess(saveCFAProdcuts);
      expect(action.type).toEqual(
        CFAProductCodeActionTypes.UPDATE_CFA_PRODUCTS_SUCCESS
      );
      //expect(action.payload).toEqual(uploadPayload);
    });
    it('should check correct type is used for  UpdateCFAProductsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new UpdateCFAProductsFailure(payload);

      expect(action.type).toEqual(
        CFAProductCodeActionTypes.UPDATE_CFA_PRODUCTS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });
  describe('LoadProductTypes Action Test Cases', () => {
    it('should check correct type is used for  LoadProductTypes action ', () => {
      const action = new LoadProductTypes();
      expect(action.type).toEqual(CFAProductCodeActionTypes.LOAD_PRODUCT_TYPES);
      //expect(action.payload).toEqual(uploadPayload);
    });

    it('should check correct type is used for  LoadProductTypesSuccess action ', () => {
      const payload: ProductType[] = [
        {
          id: 'ProductType',
          name: 'ProductType123',
          isActive: true
        }
      ];
      const action = new LoadProductTypesSuccess(payload);
      expect(action.type).toEqual(
        CFAProductCodeActionTypes.LOAD_PRODUCT_TYPES_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  LoadProductTypesFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadProductTypesFailure(payload);

      expect(action.type).toEqual(
        CFAProductCodeActionTypes.LOAD_PRODUCT_TYPES_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });
  describe('LoadMaterialTypes Action Test Cases', () => {
    it('should check correct type is used for LoadMaterialTypes  Load action ', () => {
      const action = new LoadItemTypes();
      expect(action.type).toEqual(CFAProductCodeActionTypes.LOAD_ITEM_TYPES);
      //expect(action.payload).toEqual(uploadPayload);
    });
    it('should check correct type is used for  LoadMaterialTypesSuccess action ', () => {
      const payload: ItemTypesResponse[] = [
        {
          id: 'Material',
          name: 'Metal'
        }
      ];
      const action = new LoadItemTypesSuccess(payload);
      expect(action.type).toEqual(
        CFAProductCodeActionTypes.LOAD_ITEM_TYPES_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });

    it('should check correct type is used for  LoadMaterialTypesFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadItemTypesFailure(payload);

      expect(action.type).toEqual(
        CFAProductCodeActionTypes.LOAD_ITEM_TYPES_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });
});
