import {
  CustomErrors,
  EncircleProductGroupMappingSavePayload,
  ProductGroup,
  ProductGroupMappingOption
} from '@poss-web/shared/models';
import { initialState } from './encircle-product-group-mapping.reducer';
import { EncircleProductGroupMappingSelectors } from './encircle-product-group-mapping.selector';
import { EncircleProductGroupMappingState } from './encircle-product-group-mapping.state';

describe('EncircleProductGroupMapping Selector Testing Suite', () => {
  const payload = {
    paymentMode: 'Encircle',
    pageIndex: 0,
    pageSize: 10
  };
  const savePayload: EncircleProductGroupMappingSavePayload = {
    savePayload: {
      addProductGroupCode: ['71', '72'],
      removeProductMappingIds: []
    },
    paymentCategoryName: 'Encircle'
  };
  const selectedProductGroups: ProductGroupMappingOption[] = [
    {
      id: '123',
      uuid: '123',
      description: 'Metal'
    }
  ];
  it('Should return the selectedEncircleProductGroups', () => {
    const state: EncircleProductGroupMappingState = {
      ...initialState,
      selectedProductGroups: selectedProductGroups
    };
    expect(
      EncircleProductGroupMappingSelectors.selectSelectedProductGroups.projector(
        state
      )
    ).toEqual(selectedProductGroups);
  });
  it('Should return the allselectedproduct groups', () => {
    const state: EncircleProductGroupMappingState = {
      ...initialState,
      allSelectedGroups: selectedProductGroups
    };
    expect(
      EncircleProductGroupMappingSelectors.selectAllSelectedProductGroups.projector(
        state
      )
    ).toEqual(selectedProductGroups);
  });
  it('Should return the totalElements', () => {
    const state: EncircleProductGroupMappingState = {
      ...initialState,
      totalElements: 1
    };
    expect(
      EncircleProductGroupMappingSelectors.selectTotalElements.projector(state)
    ).toEqual(1);
  });
  it('Should return hassaved', () => {
    const state: EncircleProductGroupMappingState = {
      ...initialState,
      hasSaved: true
    };
    expect(
      EncircleProductGroupMappingSelectors.selectHasSaved.projector(state)
    ).toEqual(true);
  });
  it('Should return hasremoved', () => {
    const state: EncircleProductGroupMappingState = {
      ...initialState,
      hasRemoved: true
    };
    expect(
      EncircleProductGroupMappingSelectors.selectHasRemoved.projector(state)
    ).toEqual(true);
  });
  it('Should return productgroups', () => {
    const productGroups: ProductGroup[] = [
      {
        description: 'Metal',
        productGroupCode: '71'
      }
    ];
    const state: EncircleProductGroupMappingState = {
      ...initialState,
      productGroups: productGroups
    };
    expect(
      EncircleProductGroupMappingSelectors.selectProductGroups.projector(state)
    ).toEqual(productGroups);
  });
  it('Should return isloading', () => {
    const state: EncircleProductGroupMappingState = {
      ...initialState,
      isLoading: true
    };
    expect(
      EncircleProductGroupMappingSelectors.selectIsLoading.projector(state)
    ).toEqual(true);
  });
  it('Should return error', () => {
    const error: CustomErrors = {
      code: 'ERR_1',
      message: 'Error',
      traceId: 'TraceID',
      timeStamp: '122131',
      error: null
    };
    const state: EncircleProductGroupMappingState = {
      ...initialState,
      error: error
    };
    expect(
      EncircleProductGroupMappingSelectors.selectError.projector(state)
    ).toEqual(error);
  });
});
