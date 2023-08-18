import {
  CFAProducts,
  CustomErrors,
  ItemTypesResponse,
  ProductGroupDetails,
  ProductType
} from '@poss-web/shared/models';
import { CFAProductCodeSelectors } from './cfa-product-code.selectors';
import { CFAProductCodeState } from './cfa-product-code.state';
import { initialState } from './cfa-product-code.reducer';
describe('CFAProductCode Selector Testing Suite', () => {
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
  it('Should return the CFAProductCodeListing ', () => {
    const cfaProductCodesListing: CFAProducts[] = [
      {
        productGroupCode: 'ProductGroupCode2',
        productType: 'ProductType2',
        description: 'ProductGroupCode is ProductGroupCode2',
        itemTypeCode: 'materialTypeCode2',
        orgCode: '13',
        isActive: true,
        configDetails: {}
      }
    ];
    const state: CFAProductCodeState = {
      ...initialState,
      CFAProductCodeListing: cfaProductCodesListing
    };
    expect(
      CFAProductCodeSelectors.selectCFAProductCodeListing.projector(state)
    ).toEqual(cfaProductCodesListing);
  });
  it('Should return the error ', () => {
    const error: CustomErrors = {
      code: 'ERR_1',
      message: 'Error',
      traceId: 'TraceID',
      timeStamp: '122131',
      error: null
    };
    const state: CFAProductCodeState = {
      ...initialState,
      error: error
    };
    expect(CFAProductCodeSelectors.selectHasError.projector(state)).toEqual(
      error
    );
  });
  it('Should return the error ', () => {
    const totalElements = 10;
    const state: CFAProductCodeState = {
      ...initialState,
      totalElements: totalElements
    };
    expect(
      CFAProductCodeSelectors.selectTotalElements.projector(state)
    ).toEqual(totalElements);
  });
  it('Should return the CFAProductCode ', () => {
    const cfaProductCode: CFAProducts = {
      productGroupCode: 'ProductGroupCode1',
      productType: 'ProductType1',
      description: 'ProductGroupCode is ProductGroupCode1',
      itemTypeCode: 'materialTypeCode1',
      orgCode: '12',
      isActive: true,
      configDetails: {}
    };
    const state: CFAProductCodeState = {
      ...initialState,
      CFAProduct: dummyCFAProductCode
    };
    expect(
      CFAProductCodeSelectors.selectCFAProductCode.projector(state)
    ).toEqual(dummyCFAProductCode);
  });
  it('Should return the isLoading ', () => {
    const isLoading = true;
    const state: CFAProductCodeState = {
      ...initialState,
      isLoading: isLoading
    };
    expect(CFAProductCodeSelectors.selectIsLoading.projector(state)).toEqual(
      isLoading
    );
  });
  it('Should return the CFAProductCode ', () => {
    const cfaProductCode: CFAProducts = {
      productGroupCode: 'ProductGroupCode2',
      productType: 'ProductType2',
      description: 'ProductGroupCode is ProductGroupCode2',
      itemTypeCode: 'materialTypeCode2',
      orgCode: '13',
      isActive: true,
      configDetails: {}
    };
    const state: CFAProductCodeState = {
      ...initialState,
      CFAProduct: dummyCFAProductCode
    };
    expect(
      CFAProductCodeSelectors.selectCFAProductCode.projector(state)
    ).toEqual(dummyCFAProductCode);
  });
  it('Should return the hasSaved ', () => {
    const hasSaved = true;
    const state: CFAProductCodeState = {
      ...initialState,
      hasSaved: hasSaved
    };
    expect(CFAProductCodeSelectors.selectHasSaved.projector(state)).toEqual(
      hasSaved
    );
  });
  it('Should return the hasUpdated ', () => {
    const hasUpdated = true;
    const state: CFAProductCodeState = {
      ...initialState,
      hasUpdated: hasUpdated
    };
    expect(CFAProductCodeSelectors.selectHasUpdated.projector(state)).toEqual(
      hasUpdated
    );
  });
  it('Should return the productTypes ', () => {
    const productType: ProductType[] = [
      {
        id: '1',
        name: 'ProductType',
        isActive: true
      }
    ];
    const state: CFAProductCodeState = {
      ...initialState,
      productType: productType
    };
    expect(CFAProductCodeSelectors.selectProductTypes.projector(state)).toEqual(
      productType
    );
  });
  it('Should return the materialTypes ', () => {
    const itemTypes: ItemTypesResponse[] = [
      {
        id: '1',
        name: 'Neckle'
      }
    ];
    const state: CFAProductCodeState = {
      ...initialState,
      itemTypes: itemTypes
    };
    expect(CFAProductCodeSelectors.selectItemTypes.projector(state)).toEqual(
      itemTypes
    );
  });
});
