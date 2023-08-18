import {
  CFAProduct,
  CFAProducts,
  CFAProductsResponse,
  ItemTypesResponse,
  LoadCFAProductCodeListingPayload,
  LoadCFAProductCodeListingSuccessPayload,
  ProductGroupDetails,
  ProductType
} from '@poss-web/shared/models';
import {
  CFAProductCodeReducer,
  initialState
} from './cfa-product-code.reducer';
import { CFAProductCodeState } from './cfa-product-code.state';
import * as actions from './cfa-product-code.actions';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
describe('CFAProductCode Reducer Testing Suite', () => {
  const productGroup: CFAProducts = {
    productGroupCode: 'N',
    productType: 'Neckale',
    description: 'Pro123',
    itemTypeCode: 'M',
    orgCode: null,
    isActive: true,
    configDetails: {}
  };
  const listingOfCFAProductCode = (
    productGroupCode: string,
    description: string,
    isActive: boolean
  ): CFAProductsResponse => {
    return {
      productGroupCode,
      description,
      isActive
    };
  };
  const cfaProductCode1 = listingOfCFAProductCode(
    'productGroupCode',
    'productGroupCode',
    true
  );
  const cfaProductCode2 = listingOfCFAProductCode(
    'productGroupCode1',
    'productGroupCode1',
    true
  );
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
  describe('Testing Load CFAProductCodeListing ', () => {
    beforeEach(() => {});
    it('LoadCFAProductCode should return isLoading=true,error=null', () => {
      const payload: LoadCFAProductCodeListingPayload = {
        pageIndex: 0,
        pageSize: 100
      };

      const action = new actions.LoadCFAProducts(payload);

      const result: CFAProductCodeState = CFAProductCodeReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
    });
    it('LoadCFAProductCodeSuccess should return success response', () => {
      const cfaProductCodeArray = [cfaProductCode1, cfaProductCode2];
      const response: LoadCFAProductCodeListingSuccessPayload = {
        CFAProductCodeListing: cfaProductCodeArray,
        totalElements: 2
      };

      const action = new actions.LoadCFAProductsSuccess(response);

      const result: CFAProductCodeState = CFAProductCodeReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.CFAProductCodeListing).toBe(response.CFAProductCodeListing);
      expect(result.totalElements).toBe(response.totalElements);
    });

    it('LoadCFAProductCodeFailure should return error', () => {
      const action = new actions.LoadCFAProductsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: CFAProductCodeState = CFAProductCodeReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
    });
  });
  describe('Testing SearchCFAProduct ', () => {
    beforeEach(() => {});
    it('SearchCFAproduct should return isLoading=true,error=null', () => {
      const action = new actions.SearchCFAproduct('Pro123');

      const result: CFAProductCodeState = CFAProductCodeReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
    });
    it('SearchCFAproductSuccess should return successResponse', () => {
      const cfaProductCodeArray = [cfaProductCode1, cfaProductCode2];
      const response: CFAProducts[] = [
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

      const action = new actions.SearchCFAProductSuccess(response);

      const result: CFAProductCodeState = CFAProductCodeReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.CFAProductCodeListing).toBe(response);
    });

    it('SearchCFAproductFailure should return error', () => {
      const action = new actions.SearchCFAProductFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: CFAProductCodeState = CFAProductCodeReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
      expect(result.CFAProductCodeListing).toEqual(null);
      expect(result.totalElements).toEqual(null);
      expect(result.isLoading).toEqual(false);
    });
  });
  describe('Testing LoadMaterialTypes ', () => {
    beforeEach(() => {});
    it('LoadMaterialTypes should return isLoading=true,error=null', () => {
      const action = new actions.LoadItemTypes();

      const result: CFAProductCodeState = CFAProductCodeReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
    });
    it('LoadMaterialTypesSuccess should return successResponse', () => {
      const materialTypes: ItemTypesResponse[] = [
        {
          id: '123',
          name: 'Neckale'
        }
      ];

      const action = new actions.LoadItemTypesSuccess(materialTypes);

      const result: CFAProductCodeState = CFAProductCodeReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.itemTypes).toBe(materialTypes);
    });

    it('LoadMaterialTypesFailure should return error', () => {
      const action = new actions.LoadItemTypesFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: CFAProductCodeState = CFAProductCodeReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
    });
  });
  describe('Testing LoadProductTypes ', () => {
    beforeEach(() => {});
    it('LoadProductTypes should return isLoading=true,error=null', () => {
      const action = new actions.LoadProductTypes();

      const result: CFAProductCodeState = CFAProductCodeReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
    });
    it('LoadProductTypesSuccess should return successResponse', () => {
      const productTypes: ProductType[] = [
        { id: '1', name: 'ProductType', isActive: true },
        { id: '2', name: 'ProductType2', isActive: true }
      ];

      const action = new actions.LoadProductTypesSuccess(productTypes);

      const result: CFAProductCodeState = CFAProductCodeReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.productType).toBe(productTypes);
    });

    it('LoadProductTypesFailure should return error', () => {
      const action = new actions.LoadProductTypesFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: CFAProductCodeState = CFAProductCodeReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
    });
  });
  describe('Testing LoadCFAProductsBasedOnProductGroupCode ', () => {
    beforeEach(() => {});
    it('LoadCFAProductsBasedOnProductGroupCode should return isLoading=true,error=null', () => {
      const action = new actions.LoadCFAProductsBasedOnProductGroupCode(
        'Pro123'
      );

      const result: CFAProductCodeState = CFAProductCodeReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
    });
    it('LoadCFAProductsBasedOnProductGroupCodeSuccess should return successResponse', () => {
      const action = new actions.LoadCFAProductsBasedOnProductGroupCodeSuccess(
        dummyCFAProductCode
      );

      const result: CFAProductCodeState = CFAProductCodeReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.CFAProduct).toBe(dummyCFAProductCode);
    });

    it('LoadCFAProductsBasedOnProductGroupCodeFailure should return error', () => {
      const action = new actions.LoadCFAProductsBasedOnProductGroupCodeFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: CFAProductCodeState = CFAProductCodeReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
    });
  });
  describe('Testing SaveCFAProducts ', () => {
    beforeEach(() => {});
    it('SaveCFAProducts should return isLoading=true,error=null', () => {
      const action = new actions.SaveCFAProducts(productGroup);

      const result: CFAProductCodeState = CFAProductCodeReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(true);
      expect(result.hasSaved).toBe(false);
    });
    it('SaveCFAProductsSuccess should return successResponse', () => {
      const action = new actions.SaveCFAProductsSuccess();

      const result: CFAProductCodeState = CFAProductCodeReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.hasSaved).toBe(true);
    });

    it('SaveCFAProductsFailure should return error', () => {
      const action = new actions.SaveCFAProductsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: CFAProductCodeState = CFAProductCodeReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
      expect(result.hasSaved).toEqual(false);
    });
  });
  describe('Testing UpdateCFAProducts ', () => {
    beforeEach(() => {});
    it('UpdateCFAProducts should return isLoading=true,error=null', () => {
      const action = new actions.UpdateCFAProducts({
        productGroupCode: 'Pro123',
        data: productGroup
      });

      const result: CFAProductCodeState = CFAProductCodeReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(true);
      expect(result.hasUpdated).toBe(false);
      expect(result.error).toBe(null);
    });
    it('UpdateCFAProductsSuccess should return successResponse', () => {
      const action = new actions.UpdateCFAProductsSuccess(productGroup);

      const result: CFAProductCodeState = CFAProductCodeReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.hasUpdated).toBe(true);
      // expect(result.CFAProduct).toBe(productGroup);
    });

    it('UpdateCFAProductsFailure should return error', () => {
      const action = new actions.UpdateCFAProductsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: CFAProductCodeState = CFAProductCodeReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
      expect(result.hasUpdated).toEqual(false);
    });
  });
  describe('ResetCFAProducts', () => {
    it('ResetCFAProducts should update state', () => {
      const action = new actions.ResetCFAProducts();

      const result: CFAProductCodeState = CFAProductCodeReducer(
        initialState,
        action
      );

      expect(result.CFAProduct).toBe(null);
      expect(result.error).toBe(null);
      expect(result.hasSaved).toBe(null);
      expect(result.hasUpdated).toBe(null);
    });
  });
});
