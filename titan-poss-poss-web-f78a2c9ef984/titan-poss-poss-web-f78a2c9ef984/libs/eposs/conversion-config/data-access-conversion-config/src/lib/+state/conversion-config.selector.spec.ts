import {
  CheckBoxHeader,
  ConversionConfigByIdPayload,
  ConversionConfigList,
  CustomErrors
} from '@poss-web/shared/models';
import { initialState } from './conversion-config.reducer';
import { ConversionConfigSelectors } from './conversion-config.selectors';
import { ConversionConfigState } from './conversion-config.state';

describe('ConversionConfig Selector TestCases', () => {
  const listResponse: ConversionConfigList = {
    conversionConfigList: [
      {
        description: 'Configuration',
        isActive: true
      }
    ],
    totalElements: 1
  };
  const conversionConfigDetails: ConversionConfigByIdPayload = {
    createConfig: {
      description: 'Configuration',
      isActive: true,
      ruleId: 123,
      ruleType: 'Config'
    },
    productGroups: [
      {
        id: '123',
        productGroupCode: '71',
        productCategoryCode: '72',
        productGroupDescription: 'ProductGroup',
        productCategoryDescription: 'ProductCategory',
        allowedLimitWeight: '10',
        allowedLimitValue: '11',
        autoApprovalLimitWeight: '12',
        autoApprovalLimitValue: '13'
      }
    ]
  };
  it('Should return the totalElements ', () => {
    const state: ConversionConfigState = {
      ...initialState,
      totalElements: listResponse.totalElements
    };
    expect(
      ConversionConfigSelectors.selectTotalElements.projector(state)
    ).toEqual(listResponse.totalElements);
  });
  it('Should return the error ', () => {
    const error: CustomErrors = {
      code: 'ERR_1',
      message: 'Error',
      traceId: 'TraceID',
      timeStamp: '122131',
      error: null
    };
    const state: ConversionConfigState = {
      ...initialState,
      error: error
    };
    expect(ConversionConfigSelectors.selectError.projector(state)).toEqual(
      error
    );
  });
  it('Should return the isLoading ', () => {
    const state: ConversionConfigState = {
      ...initialState,
      isLoading: true
    };
    expect(ConversionConfigSelectors.selectIsLoading.projector(state)).toEqual(
      true
    );
  });
  it('Should return the hasSaved ', () => {
    const state: ConversionConfigState = {
      ...initialState,
      hasSaved: true
    };
    expect(ConversionConfigSelectors.selectHasSaved.projector(state)).toEqual(
      true
    );
  });
  it('Should return the hasUpdated ', () => {
    const state: ConversionConfigState = {
      ...initialState,
      hasUpdated: true
    };
    expect(ConversionConfigSelectors.selectHasUpdated.projector(state)).toEqual(
      true
    );
  });
  it('Should return the conversionConfigList ', () => {
    const state: ConversionConfigState = {
      ...initialState,
      conversionConfigList: listResponse.conversionConfigList
    };
    expect(
      ConversionConfigSelectors.selectConversionConfigList.projector(state)
    ).toEqual(listResponse.conversionConfigList);
  });
  it('Should return the conversionConfigList ', () => {
    const state: ConversionConfigState = {
      ...initialState,
      conversionConfigList: listResponse.conversionConfigList
    };
    expect(
      ConversionConfigSelectors.selectConversionConfigList.projector(state)
    ).toEqual(listResponse.conversionConfigList);
  });
  it('Should return the configDetailsById ', () => {
    const state: ConversionConfigState = {
      ...initialState,
      configDetailsById: conversionConfigDetails
    };
    expect(
      ConversionConfigSelectors.selectConversionConfigDetailsById.projector(
        state
      )
    ).toEqual(conversionConfigDetails);
  });
  it('Should return the saveSuccessPayload ', () => {
    const state: ConversionConfigState = {
      ...initialState,
      saveSuccessPayload: conversionConfigDetails
    };
    expect(
      ConversionConfigSelectors.selectSaveSuccessPayload.projector(state)
    ).toEqual(conversionConfigDetails);
  });
  it('Should return the productGroups ', () => {
    const productGroups: CheckBoxHeader[] = [
      {
        title: 'pro',
        key: 'p'
      }
    ];
    const state: ConversionConfigState = {
      ...initialState,
      productGroups: productGroups
    };
    expect(
      ConversionConfigSelectors.selectProductGroups.projector(state)
    ).toEqual(productGroups);
  });
  it('Should return the productCategories ', () => {
    const productCategories: CheckBoxHeader[] = [
      {
        title: 'proCategory',
        key: 'p'
      }
    ];
    const state: ConversionConfigState = {
      ...initialState,
      productCategories: productCategories
    };
    expect(
      ConversionConfigSelectors.selectProductCategories.projector(state)
    ).toEqual(productCategories);
  });
  it('Should return the hasSearched ', () => {
    const state: ConversionConfigState = {
      ...initialState,
      hasSearched: true
    };
    expect(
      ConversionConfigSelectors.selectHasSearched.projector(state)
    ).toEqual(true);
  });
});
