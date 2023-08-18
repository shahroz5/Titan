import { initialState, DiscountConfigReducer } from './discount-config.reducer';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import * as actions from './discount-config.actions';
import { DiscountConfigState } from './discount-config.state';
import {
  CustomErrors,
  DiscountApplicableEnum,
  DiscountConfigList,
  DiscountConfigSuccessList,
  DiscountTypeEnum,
  DisountConfigListPayload,
  MappedBestDealDiscountSuccessList,
  NewDiscountApplicableConfig,
  NewDiscountDetails,
  SaveBestDealDiscountPayload,
  TSSSRequestPayload,
  DiscountLocationSuccessList,
  DiscountProductCategorySuccessList,
  DiscountProductGroupSuccessList,
  DiscountExcludeItemSuccessList,
  ProductGroupMappingOption
} from '@poss-web/shared/models';
import { Moment } from 'moment';
import { Actions } from '@ngrx/effects';
let testState: DiscountConfigState = {
  isLoading: null,
  error: null,
  saveLotAge: false,
  saveMaxPercentage: false,
  discountConfigList: [],
  discountDetails: null,
  totalCount: 0,
  hasSaved: false,
  hasUpdated: false,
  discountLocations: [],
  discountProductCategories: [],
  discountProductGroups: [],
  discountExcludeItems: [],
  excludeItemCodes: [],
  excludeConfigCount: 0,
  excludeItemCount: 0,
  locationCount: 0,
  productCategoryCount: 0,
  productGroupCount: 0,
  saveLocations: null,
  saveProductCategories: null,
  saveProductGroups: null,
  isExcludeThemeSaved: false,
  isExcludeTypeSaved: false,
  selectedLocations: null,
  selectedProductGroups: null,
  selectedProductCategories: null,
  bestDealDiscountCount: 0,
  bestDealDiscountList: null,
  isPublished: false,
  selectedBestDealDiscount: null,
  saveBestDealDiscounts: null,
  discountTypes: [],
  clubbingDiscountTypes: [],
  approvers: [],
  slabDetails: null,
  discDetails: [],
  isDiscDetailsSaved: false,
  // saveDiscountDetails: null,
  // editDiscountDetails: null,
  discountComponentProductGroups: [],
  discountComponentPGConfig: [],
  isDiscountComponentPGConfigSaved: false,
  discountComponentPGConfigCount: 0,
  brands: null,
  subBrands: null,
  applicableLevels: null,
  rangeTepDuration: null,
  isTsssComputed: false,
  tsssConfigCouponResponse: null,
  empowermentUpdatedDiscount: null,
  empowermentDiscounts: [],
  selectedBestDealDiscountCount: 0,
  isExcludeSchemeSaved: null,
  discountRequestCount: null,
  discountRequestList: [],
  isDiscountApproved: null,
  isDiscountSentForApproval: null,
  faqFileDownloadResponse: null,
  faqFileUploadResponse: null,
  isEmailResent: null
};
describe('Discount Config reducer Testing Suite', () => {
  const createDiscount = (
    id: string,
    discountCode: string,
    description: string,
    discountType: string,
    occasion: string,
    isActive: boolean,
    status: string,
    createdDate: Moment,
    lastModifiedDate: Moment,
    isPublishPending: boolean,
    publishTime: Moment
  ): DiscountConfigList => {
    return {
      id,
      discountCode,
      description,
      discountType,
      occasion,
      isActive,
      status,
      createdDate,
      lastModifiedDate,
      isPublishPending,
      publishTime
    };
  };

  it('should return the initial state', () => {
    const action: any = {};
    const state = DiscountConfigReducer(null, action);

    expect(initialState).toBe(initialState);
  })

  describe('Testing Load Discount type details list', () => {
    // beforeEach(() => {});
    it('LoadDiscountConfigList should return list of Discounts', () => {
      const payload: DisountConfigListPayload = {
        pageIndex: 0,
        pageSize: 100
      };
      const action = new actions.LoadDiscountConfigList(payload);
      const result = DiscountConfigReducer(initialState, action);
      expect(result.isLoading).toBe(true);
    });
    it('LoadDiscountConfigListSuccess should return list of Discounts', () => {
      const payload: DiscountConfigSuccessList = {
        discountConfigList: [],
        count: 0
      };
      const action = new actions.LoadDiscountConfigListSuccess(payload);
      const result = DiscountConfigReducer(initialState, action);
      expect(result.isLoading).toBe(false);
      expect(result.discountConfigList).toEqual([]);
    });
    it('LoadDiscountConfigListFailure should return list of Discounts', () => {
      const action = new actions.LoadDiscountConfigListFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result = DiscountConfigReducer(initialState, action);
      expect(result.isLoading).toBe(false);
    });
  });
});

describe('Actions should update state properly', () => {
  // it('should return the initial state', () => {
  //   const action: any = {};
  //   const state :DiscountConfigState = DiscountConfigReducer(undefined, action);

  //   expect(state).toBe(testState);
  // });

  it('LOAD_BEST_DEAL_DISCOUNT_LIST action', () => {
    testState = {
      ...testState,
      isLoading: false,
      hasUpdated: true,
      hasSaved: true,
      saveLocations: true,
      saveProductCategories: true,
      saveProductGroups: true,
      isExcludeThemeSaved: true,
      isExcludeTypeSaved: true,
      saveBestDealDiscounts: true,
      error: null
    };
    const payload: DisountConfigListPayload = {
      pageIndex: 0,
      pageSize: 10,
      discountCode: 'ADSFG12344'
    };

    const action = new actions.LoadBestDealDiscountList(payload);

    const result = DiscountConfigReducer(testState, action);

    expect(result.isLoading).toBeTruthy();
  });

  it('LOAD_BEST_DEAL_DISCOUNT_LIST_SUCCESS action', () => {
    testState = {
      ...testState,
      isLoading: true,
      hasSaved: true,
      bestDealDiscountList: [],
      bestDealDiscountCount: null,
      error: null
    };

    const payload: DiscountConfigSuccessList = {
      discountConfigList: [],
      count: 0
    };

    const action = new actions.LoadBestDealDiscountListSuccess(payload);

    const result = DiscountConfigReducer(testState, action);

    expect(result.isLoading).toBeFalsy();
    expect(result.bestDealDiscountList).toBe(payload.discountConfigList);
  });

  it('LOAD_BEST_DEAL_DISCOUNT_LIST_FAILURE action', () => {
    testState = {
      ...testState,
      isLoading: true,
      error: CustomErrorAdaptor.fromJson(new Error('Some Old Error')),
      hasSaved: true,
      hasUpdated: true,
      isPublished: true
    };

    const payload: CustomErrors = CustomErrorAdaptor.fromJson(
      Error('Some Error')
    );

    const action = new actions.LoadBestDealDiscountListFailure(payload);

    const result = DiscountConfigReducer(testState, action);

    expect(result.isLoading).toBeFalsy();
    expect(result.error).toBe(payload);
  });

  it('MAP_BEST_DEAL_DISCOUNTS action', () => {
    testState = {
      ...testState,
      isLoading: false,
      hasUpdated: true,
      hasSaved: true,
      saveLocations: true,
      saveProductCategories: true,
      saveProductGroups: true,
      isExcludeThemeSaved: true,
      isExcludeTypeSaved: true,
      saveBestDealDiscounts: true,
      error: null
    };
    const payload: SaveBestDealDiscountPayload = {
      id: 'ADSFG12344',
      addLinks: [],
      removeLinks: []
    };

    const action = new actions.SaveBestDealDiscounts(payload);

    const result = DiscountConfigReducer(testState, action);

    expect(result.hasSaved).toBeFalsy();
  });

  it('MAP_BEST_DEAL_DISCOUNTS_SUCCESS action', () => {
    testState = {
      ...testState,
      isLoading: true,
      saveBestDealDiscounts: false
    };

    const action = new actions.SaveBestDealDiscountsSuccess();

    const result = DiscountConfigReducer(testState, action);

    expect(result.isLoading).toBeFalsy();
  });

  it('MAP_BEST_DEAL_DISCOUNTS_FAILURE action', () => {
    testState = {
      ...testState,
      isLoading: true,
      error: CustomErrorAdaptor.fromJson(new Error('Some Old Error')),
      hasSaved: true,
      hasUpdated: true,
      isPublished: true,
      discDetails: []
    };

    const payload: CustomErrors = CustomErrorAdaptor.fromJson(
      Error('Some Error')
    );

    const action = new actions.SaveBestDealDiscountsFailure(payload);

    const result = DiscountConfigReducer(testState, action);

    expect(result.isLoading).toBeFalsy();
    expect(result.error).toBe(payload);
  });

  it('LOAD_TSSS_CONFIG_DOWNLOAD_URL action', () => {
    testState = {
      ...testState,
      isLoading: false
    };
    const payload = 'ADSFG12344';

    const action = new actions.LoadTsssConfigDownloadUrl(payload);

    const result = DiscountConfigReducer(testState, action);

    expect(result.isLoading).toBeTruthy();
  });

  it('LOAD_TSSS_CONFIG_DOWNLOAD_URL_SUCCESS action', () => {
    testState = {
      ...testState,
      isLoading: true,
      tsssConfigCouponResponse: null
    };

    const payload = null;
    const action = new actions.LoadTsssConfigDownloadUrlSuccess(payload);

    const result = DiscountConfigReducer(testState, action);

    expect(result.isLoading).toBeFalsy();
    expect(result.tsssConfigCouponResponse).toBeNull();
  });

  it('LOAD_TSSS_CONFIG_DOWNLOAD_URL_FAILURE action', () => {
    testState = {
      ...testState,
      isLoading: true,
      error: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
    };

    const payload: CustomErrors = CustomErrorAdaptor.fromJson(
      Error('Some Error')
    );

    const action = new actions.LoadTsssConfigDownloadUrlFailure(payload);

    const result = DiscountConfigReducer(testState, action);

    expect(result.isLoading).toBeFalsy();
    expect(result.error).toBe(payload);
  });

  it('PUBLISH_DISCOUNT_CONFIG action', () => {
    testState = {
      ...testState,
      isLoading: false,
      isPublished: true
    };
    const payload = 'ADSFG12344';

    const action = new actions.PublishDiscountConfig(payload);

    const result = DiscountConfigReducer(testState, action);

    expect(result.isLoading).toBeTruthy();
    expect(result.isPublished).toBeFalsy();
  });

  it('PUBLISH_DISCOUNT_CONFIG_SUCCESS action', () => {
    testState = {
      ...testState,
      isLoading: true,
      isPublished: false
    };

    const action = new actions.PublishDiscountConfigSuccess();

    const result = DiscountConfigReducer(testState, action);

    expect(result.isLoading).toBeFalsy();
    expect(result.isPublished).toBeTruthy();
  });

  it('PUBLISH_DISCOUNT_CONFIG_FAILURE action', () => {
    testState = {
      ...testState,
      isLoading: true,
      error: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
    };

    const payload: CustomErrors = CustomErrorAdaptor.fromJson(
      Error('Some Error')
    );

    const action = new actions.PublishDiscountConfigFailure(payload);

    const result = DiscountConfigReducer(testState, action);

    expect(result.isLoading).toBeFalsy();
    expect(result.error).toBe(payload);
  });

  it('COMPUTE_TSSS_CONFIG action', () => {
    testState = {
      ...testState,
      isLoading: false,
      isTsssComputed: true
    };
    const payload: TSSSRequestPayload = {
      discountId: 'ASSFF1234',
      couponRequest: null
    };

    const action = new actions.ComputeTsssConfig(payload);

    const result = DiscountConfigReducer(testState, action);

    expect(result.isLoading).toBeTruthy();
    expect(result.isTsssComputed).toBeFalsy();
  });

  it('COMPUTE_TSSS_CONFIG_SUCCESS action', () => {
    testState = {
      ...testState,
      isLoading: true,
      isTsssComputed: false
    };

    const payload = null;
    const action = new actions.ComputeTsssConfigSuccess(payload);

    const result = DiscountConfigReducer(testState, action);

    expect(result.isLoading).toBeFalsy();
    expect(result.isTsssComputed).toBeTruthy();
  });

  it('COMPUTE_TSSS_CONFIG_FAILURE action', () => {
    testState = {
      ...testState,
      isLoading: true,
      error: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
    };

    const payload: CustomErrors = CustomErrorAdaptor.fromJson(
      Error('Some Error')
    );

    const action = new actions.ComputeTsssConfigFailure(payload);

    const result = DiscountConfigReducer(testState, action);

    expect(result.isLoading).toBeFalsy();
    expect(result.error).toBe(payload);
  });

  it('GET_MAPPED_BEST_DEAL_DISCOUNTS_SUCCESS action', () => {
    testState = {
      ...testState,
      isLoading: true,
      selectedBestDealDiscount: null,
      selectedBestDealDiscountCount: null
    };

    const payload: MappedBestDealDiscountSuccessList = {
      mappedDetails: [],
      count: 10
    };
    const action = new actions.LoadSelectedBestDealDiscountSuccess(payload);

    const result = DiscountConfigReducer(testState, action);

    expect(result.isLoading).toBeFalsy();
  });

  it('GET_MAPPED_BEST_DEAL_DISCOUNTS_FAILURE action', () => {
    testState = {
      ...testState,
      isLoading: true,
      error: CustomErrorAdaptor.fromJson(new Error('Some Old Error')),
      hasSaved: true,
      hasUpdated: true,
      isPublished: true
    };

    const payload: CustomErrors = CustomErrorAdaptor.fromJson(
      Error('Some Error')
    );

    const action = new actions.LoadSelectedBestDealDiscountFailure(payload);

    const result = DiscountConfigReducer(testState, action);

    expect(result.isLoading).toBeFalsy();
    expect(result.error).toBe(payload);
  });

  it('SAVE_EMPOWERMENT_DETAILS action', () => {
    testState = {
      ...testState,
      isLoading: false,
      isDiscDetailsSaved: true,
      error: null
    };
    const payload = null;

    const action = new actions.SaveEmpowermentDetails(payload);

    const result = DiscountConfigReducer(testState, action);

    expect(result.isLoading).toBeTruthy();
    expect(result.isDiscDetailsSaved).toBeFalsy();
  });

  it('SAVE_EMPOWERMENT_DETAILS_SUCCESS action', () => {
    testState = {
      ...testState,
      isLoading: true,
      empowermentUpdatedDiscount: null,
      isDiscDetailsSaved: false
    };

    const payload = null;
    const action = new actions.SaveEmpowermentDetailsSuccess(payload);

    const result = DiscountConfigReducer(testState, action);

    expect(result.isLoading).toBeFalsy();
    expect(result.isDiscDetailsSaved).toBeTruthy();
  });

  it('SAVE_EMPOWERMENT_DETAILS_FAILURE action', () => {
    testState = {
      ...testState,
      isLoading: true,
      error: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
    };

    const payload: CustomErrors = CustomErrorAdaptor.fromJson(
      Error('Some Error')
    );

    const action = new actions.SaveEmpowermentDetailsFailure(payload);

    const result = DiscountConfigReducer(testState, action);

    expect(result.isLoading).toBeFalsy();
    expect(result.error).toBe(payload);
  });

  it('UPDATE_EMPOWERMENT_DETAILS action', () => {
    testState = {
      ...testState,
      isLoading: false,
      error: null,
      isDiscDetailsSaved: true
    };
    const payload = null;

    const action = new actions.UpdateEmpowermentDetails(payload);

    const result = DiscountConfigReducer(testState, action);

    expect(result.isLoading).toBeTruthy();
    expect(result.isDiscDetailsSaved).toBeFalsy();
  });

  it('UPDATE_EMPOWERMENT_DETAILS_SUCCESS action', () => {
    testState = {
      ...testState,
      isLoading: true,
      empowermentUpdatedDiscount: null,
      isDiscDetailsSaved: false
    };

    const payload = null;
    const action = new actions.UpdateEmpowermentDetailsSuccess(payload);

    const result = DiscountConfigReducer(testState, action);

    expect(result.isLoading).toBeFalsy();
    expect(result.isDiscDetailsSaved).toBeTruthy();
  });

  it('UPDATE_EMPOWERMENT_DETAILS_FAILURE action', () => {
    testState = {
      ...testState,
      isLoading: true,
      error: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
    };

    const payload: CustomErrors = CustomErrorAdaptor.fromJson(
      Error('Some Error')
    );

    const action = new actions.UpdateEmpowermentDetailsFailure(payload);

    const result = DiscountConfigReducer(testState, action);

    expect(result.isLoading).toBeFalsy();
    expect(result.error).toBe(payload);
  });

  it('LOAD_DISCOUNT_MAPPED_LOCATION_LIST action', () => {
    testState = {
      ...testState,
      isLoading: false,
      error: null,
      isDiscDetailsSaved: true
    };
    const payload = null;

    const action = new actions.LoadDiscountMappedLocationList(payload);

    const result = DiscountConfigReducer(testState, action);

    expect(result.isLoading).toBeTruthy();
  });

  it('LOAD_DISCOUNT_CONFIG_DETAILS action', () => {
    testState = {
      ...testState,
      isLoading: false,
      error: null,
      isDiscDetailsSaved: true
    };
    const payload = null;

    const action = new actions.LoadDiscountConfigDetails(payload);

    const result = DiscountConfigReducer(testState, action);

    expect(result.isLoading).toBeTruthy();
  });

  it('LOAD_DISCOUNT_MAPPED_PRODUCT_CATEGORY_LIST action', () => {
    testState = {
      ...testState,
      isLoading: false,
      error: null,
      isDiscDetailsSaved: true
    };
    const payload = null;

    const action = new actions.LoadDiscountMappedProductCategoryList(payload);

    const result = DiscountConfigReducer(testState, action);

    expect(result.isLoading).toBeTruthy();
  });

  it('LOAD_DISCOUNT_MAPPED_PRODUCT_GROUP_LIST action', () => {
    testState = {
      ...testState,
      isLoading: false,
      error: null,
      isDiscDetailsSaved: true
    };
    const payload = null;

    const action = new actions.LoadDiscountMappedProductGroupList(payload);

    const result = DiscountConfigReducer(testState, action);

    expect(result.isLoading).toBeTruthy();
  });

  it('LOAD_EXCLUDE_TYPE_LIST action', () => {
    testState = {
      ...testState,
      isLoading: false,
      error: null,
      isDiscDetailsSaved: true
    };
    const payload = null;

    const action = new actions.LoadDiscountExcludeTypeList(payload);

    const result = DiscountConfigReducer(testState, action);

    expect(result.isLoading).toBeTruthy();
  });

  it('LOAD_EXCLUDE_ITEM_CODES action', () => {
    testState = {
      ...testState,
      isLoading: false,
      error: null,
      isDiscDetailsSaved: true
    };
    const payload = null;

    const action = new actions.LoadDiscountExcludeItemCodes(payload);

    const result = DiscountConfigReducer(testState, action);

    expect(result.isLoading).toBeTruthy();
  });

  it('MAP_EXCLUDE_THEME_CODES action', () => {
    testState = {
      ...testState,
      isLoading: false,
      error: null,
      isDiscDetailsSaved: true
    };
    const payload = null;

    const action = new actions.SaveDiscountExcludeThemes(payload);

    const result = DiscountConfigReducer(testState, action);

    expect(result.isLoading).toBeTruthy();
  });

  it('MAP_EXCLUDE_TYPE action', () => {
    testState = {
      ...testState,
      isLoading: false,
      error: null,
      isDiscDetailsSaved: true
    };
    const payload = null;

    const action = new actions.SaveDiscountExcludeTypes(payload);

    const result = DiscountConfigReducer(testState, action);

    expect(result.isLoading).toBeTruthy();
  });

  it('MAP_EXCLUDE_SCHEME_CODES action', () => {
    testState = {
      ...testState,
      isLoading: false,
      error: null,
      isDiscDetailsSaved: true
    };
    const payload = null;

    const action = new actions.SaveDiscountExcludeSchemes(payload);

    const result = DiscountConfigReducer(testState, action);

    expect(result.isLoading).toBeTruthy();
  });

  it('LOAD_DISCOUNT_TYPES action', () => {
    testState = {
      ...testState,
      isLoading: false,
      error: null,
      isDiscDetailsSaved: true
    };
    const payload = null;

    const action = new actions.LoadDiscountTypes(payload);

    const result = DiscountConfigReducer(testState, action);

    expect(result.isLoading).toBeTruthy();
  });

  it('LOAD_CLUBBING_DISCOUNT_TYPES action', () => {
    testState = {
      ...testState,
      isLoading: false,
      error: null,
      isDiscDetailsSaved: true
    };
    const payload = null;

    const action = new actions.LoadClubbingDiscountTypes(payload);

    const result = DiscountConfigReducer(testState, action);

    expect(result.isLoading).toBeTruthy();
  });

  it('LOAD_APPROVERS action', () => {
    testState = {
      ...testState,
      isLoading: false,
      error: null,
      isDiscDetailsSaved: true
    };
    const payload = null;

    const action = new actions.LoadApprovers(payload);

    const result = DiscountConfigReducer(testState, action);

    expect(result.isLoading).toBeTruthy();
  });
  it('LOAD_EMPOWERMENT_DISCOUNT_DETAILS action', () => {
    testState = {
      ...testState,
      isLoading: false,
      error: null
    };
    const payload = null;

    const action = new actions.LoadEmpowermentDiscountDetails(payload);

    const result = DiscountConfigReducer(testState, action);

    expect(result.isLoading).toBeTruthy();
  });

  it('LOAD_EMPOWERMENT_DISCOUNT_DETAILS_SUCCESS action', () => {
    testState = {
      ...testState,
      isLoading: true,
      empowermentDiscounts: null
    };

    const payload = null;
    const action = new actions.LoadEmpowermentDiscountDetailsSuccess(payload);

    const result = DiscountConfigReducer(testState, action);

    expect(result.isLoading).toBeFalsy();
  });

  it('LOAD_EMPOWERMENT_DISCOUNT_DETAILS_FAILURE action', () => {
    testState = {
      ...testState,
      isLoading: true,
      error: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
    };

    const payload: CustomErrors = CustomErrorAdaptor.fromJson(
      Error('Some Error')
    );

    const action = new actions.LoadEmpowermentDiscountDetailsFailure(payload);

    const result = DiscountConfigReducer(testState, action);

    expect(result.isLoading).toBeFalsy();
    expect(result.error).toBe(payload);
  });

  it('SAVE_DISCOUNT_CONFIG_DETAILS_FAILURE action', () => {
    testState = {
      ...testState,
      isLoading: true,
      error: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
    };

    const payload: CustomErrors = CustomErrorAdaptor.fromJson(
      Error('Some Error')
    );

    const action = new actions.SaveDiscountConfigListFailure(payload);

    const result = DiscountConfigReducer(testState, action);

    expect(result.isLoading).toBeFalsy();
    expect(result.error).toBe(payload);
  });

  it('LOAD_DISCOUNT_CONFIG_DETAILS_FAILURE action', () => {
    testState = {
      ...testState,
      isLoading: true,
      error: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
    };

    const payload: CustomErrors = CustomErrorAdaptor.fromJson(
      Error('Some Error')
    );

    const action = new actions.LoadDiscountConfigDetailsFailure(payload);

    const result = DiscountConfigReducer(testState, action);

    expect(result.isLoading).toBeFalsy();
    expect(result.error).toBe(payload);
  });

  it('EDIT_DISCOUNT_CONFIG_DETAILS_FAILURE action', () => {
    testState = {
      ...testState,
      isLoading: true,
      error: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
    };

    const payload: CustomErrors = CustomErrorAdaptor.fromJson(
      Error('Some Error')
    );

    const action = new actions.EditDiscountConfigListFailure(payload);

    const result = DiscountConfigReducer(testState, action);

    expect(result.isLoading).toBeFalsy();
    expect(result.error).toBe(payload);
  });

  it('LOAD_DISCOUNT_MAPPED_LOCATION_LIST_FAILURE action', () => {
    testState = {
      ...testState,
      isLoading: true,
      error: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
    };

    const payload: CustomErrors = CustomErrorAdaptor.fromJson(
      Error('Some Error')
    );

    const action = new actions.LoadDiscountMappedLocationListFailure(payload);

    const result = DiscountConfigReducer(testState, action);

    expect(result.isLoading).toBeFalsy();
    expect(result.error).toBe(payload);
  });

  it('LOAD_DISCOUNT_MAPPED_PRODUCT_GROUP_LIST_FAILURE action', () => {
    testState = {
      ...testState,
      isLoading: true,
      error: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
    };

    const payload: CustomErrors = CustomErrorAdaptor.fromJson(
      Error('Some Error')
    );

    const action = new actions.LoadDiscountMappedProductGroupListFailure(
      payload
    );

    const result = DiscountConfigReducer(testState, action);

    expect(result.isLoading).toBeFalsy();
    expect(result.error).toBe(payload);
  });

  it('LOAD_DISCOUNT_MAPPED_PRODUCT_CATEGORY_LIST_FAILURE action', () => {
    testState = {
      ...testState,
      isLoading: true,
      error: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
    };

    const payload: CustomErrors = CustomErrorAdaptor.fromJson(
      Error('Some Error')
    );

    const action = new actions.LoadDiscountMappedProductCategoryListFailure(
      payload
    );

    const result = DiscountConfigReducer(testState, action);

    expect(result.isLoading).toBeFalsy();
    expect(result.error).toBe(payload);
  });

  it('LOAD_EXCLUDE_TYPE_LIST_FAILURE action', () => {
    testState = {
      ...testState,
      isLoading: true,
      error: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
    };

    const payload: CustomErrors = CustomErrorAdaptor.fromJson(
      Error('Some Error')
    );

    const action = new actions.LoadDiscountExcludeTypeListFailure(payload);

    const result = DiscountConfigReducer(testState, action);

    expect(result.isLoading).toBeFalsy();
    expect(result.error).toBe(payload);
  });

  it('LOAD_EXCLUDE_ITEM_CODES_FAILURE action', () => {
    testState = {
      ...testState,
      isLoading: true,
      error: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
    };

    const payload: CustomErrors = CustomErrorAdaptor.fromJson(
      Error('Some Error')
    );

    const action = new actions.LoadDiscountExcludeItemCodesFailure(payload);

    const result = DiscountConfigReducer(testState, action);

    expect(result.isLoading).toBeFalsy();
    expect(result.error).toBe(payload);
  });

  it('GET_MAPPED_PRODUCT_GROUPS_FAILURE action', () => {
    testState = {
      ...testState,
      isLoading: true,
      error: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
    };

    const payload: CustomErrors = CustomErrorAdaptor.fromJson(
      Error('Some Error')
    );

    const action = new actions.LoadSelectedProductGroupsFailure(payload);

    const result = DiscountConfigReducer(testState, action);

    expect(result.isLoading).toBeFalsy();
    expect(result.error).toBe(payload);
  });

  it('GET_MAPPED_LOCATIONS_FAILURE action', () => {
    testState = {
      ...testState,
      isLoading: true,
      error: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
    };

    const payload: CustomErrors = CustomErrorAdaptor.fromJson(
      Error('Some Error')
    );

    const action = new actions.LoadSelectedLocationsFailure(payload);

    const result = DiscountConfigReducer(testState, action);

    expect(result.isLoading).toBeFalsy();
    expect(result.error).toBe(payload);
  });

  it('GET_MAPPED_PRODUCT_CATEGORIES_FAILURE action', () => {
    testState = {
      ...testState,
      isLoading: true,
      error: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
    };

    const payload: CustomErrors = CustomErrorAdaptor.fromJson(
      Error('Some Error')
    );

    const action = new actions.LoadSelectedProductCategoriesFailure(payload);

    const result = DiscountConfigReducer(testState, action);

    expect(result.isLoading).toBeFalsy();
    expect(result.error).toBe(payload);
  });

  it('PUBLISH_DISCOUNT_CONFIG_FAILURE action', () => {
    testState = {
      ...testState,
      isLoading: true,
      error: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
    };

    const payload: CustomErrors = CustomErrorAdaptor.fromJson(
      Error('Some Error')
    );

    const action = new actions.PublishDiscountConfigFailure(payload);

    const result = DiscountConfigReducer(testState, action);

    expect(result.isLoading).toBeFalsy();
    expect(result.error).toBe(payload);
  });

  it('GET_MAPPED_BEST_DEAL_DISCOUNTS_FAILURE action', () => {
    testState = {
      ...testState,
      isLoading: true,
      error: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
    };

    const payload: CustomErrors = CustomErrorAdaptor.fromJson(
      Error('Some Error')
    );

    const action = new actions.LoadSelectedBestDealDiscountFailure(payload);

    const result = DiscountConfigReducer(testState, action);

    expect(result.isLoading).toBeFalsy();
    expect(result.error).toBe(payload);
  });

  it('LOAD_DISCOUNT_TYPES_FAILURE action', () => {
    testState = {
      ...testState,
      isLoading: true,
      error: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
    };

    const payload: CustomErrors = CustomErrorAdaptor.fromJson(
      Error('Some Error')
    );

    const action = new actions.LoadDiscountTypesFailure(payload);

    const result = DiscountConfigReducer(testState, action);

    expect(result.isLoading).toBeFalsy();
    expect(result.error).toBe(payload);
  });

  it('LOAD_CLUBBING_DISCOUNT_TYPES_FAILURE action', () => {
    testState = {
      ...testState,
      isLoading: true,
      error: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
    };

    const payload: CustomErrors = CustomErrorAdaptor.fromJson(
      Error('Some Error')
    );

    const action = new actions.LoadClubbingDiscountTypesFailure(payload);

    const result = DiscountConfigReducer(testState, action);

    expect(result.isLoading).toBeFalsy();
    expect(result.error).toBe(payload);
  });

  it('LOAD_APPROVERS_FAILURE action', () => {
    testState = {
      ...testState,
      isLoading: true,
      error: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
    };

    const payload: CustomErrors = CustomErrorAdaptor.fromJson(
      Error('Some Error')
    );

    const action = new actions.LoadApproversFailure(payload);

    const result = DiscountConfigReducer(testState, action);

    expect(result.isLoading).toBeFalsy();
    expect(result.error).toBe(payload);
  });

  it('LOAD_SUB_BRANDS_FAILURE action', () => {
    testState = {
      ...testState,
      isLoading: true,
      error: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
    };

    const payload: CustomErrors = CustomErrorAdaptor.fromJson(
      Error('Some Error')
    );

    const action = new actions.LoadSubBrandsFailure(payload);

    const result = DiscountConfigReducer(testState, action);

    expect(result.isLoading).toBeFalsy();
    expect(result.error).toBe(payload);
  });

  it('LOAD_BRANDS_FAILURE action', () => {
    testState = {
      ...testState,
      isLoading: true,
      error: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
    };

    const payload: CustomErrors = CustomErrorAdaptor.fromJson(
      Error('Some Error')
    );

    const action = new actions.LoadBrandsFailure(payload);

    const result = DiscountConfigReducer(testState, action);

    expect(result.isLoading).toBeFalsy();
    expect(result.error).toBe(payload);
  });

  it('LOAD_APPLICABLE_LEVELS_FAILURE action', () => {
    testState = {
      ...testState,
      isLoading: true,
      error: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
    };

    const payload: CustomErrors = CustomErrorAdaptor.fromJson(
      Error('Some Error')
    );

    const action = new actions.LoadApplicableLevelsFailure(payload);

    const result = DiscountConfigReducer(testState, action);

    expect(result.isLoading).toBeFalsy();
    expect(result.error).toBe(payload);
  });

  it('LOAD_TEP_DURATION_RANGE_FAILURE action', () => {
    testState = {
      ...testState,
      isLoading: true,
      error: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
    };

    const payload: CustomErrors = CustomErrorAdaptor.fromJson(
      Error('Some Error')
    );

    const action = new actions.LoadTepDurationDaysRangeFailure(payload);

    const result = DiscountConfigReducer(testState, action);

    expect(result.isLoading).toBeFalsy();
    expect(result.error).toBe(payload);
  });

  it('MAP_LOCATIONS_FAILURE action', () => {
    testState = {
      ...testState,
      isLoading: true,
      error: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
    };

    const payload: CustomErrors = CustomErrorAdaptor.fromJson(
      Error('Some Error')
    );

    const action = new actions.SaveDiscountLocationsFailure(payload);

    const result = DiscountConfigReducer(testState, action);

    expect(result.isLoading).toBeFalsy();
    expect(result.error).toBe(payload);
  });

  it('MAP_PRODUCT_CATEGORIES_FAILURE action', () => {
    testState = {
      ...testState,
      isLoading: true,
      error: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
    };

    const payload: CustomErrors = CustomErrorAdaptor.fromJson(
      Error('Some Error')
    );

    const action = new actions.SaveDiscountProductCategoryFailure(payload);

    const result = DiscountConfigReducer(testState, action);

    expect(result.isLoading).toBeFalsy();
    expect(result.error).toBe(payload);
  });

  it('MAP_PRODUCT_GROUPS_FAILURE action', () => {
    testState = {
      ...testState,
      isLoading: true,
      error: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
    };

    const payload: CustomErrors = CustomErrorAdaptor.fromJson(
      Error('Some Error')
    );

    const action = new actions.SaveDiscountProductGroupsFailure(payload);

    const result = DiscountConfigReducer(testState, action);

    expect(result.isLoading).toBeFalsy();
    expect(result.error).toBe(payload);
  });

  it('MAP_EXCLUDE_THEME_CODES_FAILURE action', () => {
    testState = {
      ...testState,
      isLoading: true,
      error: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
    };

    const payload: CustomErrors = CustomErrorAdaptor.fromJson(
      Error('Some Error')
    );

    const action = new actions.SaveDiscountExcludeThemesFailure(payload);

    const result = DiscountConfigReducer(testState, action);

    expect(result.isLoading).toBeFalsy();
    expect(result.error).toBe(payload);
  });

  it('MAP_EXCLUDE_TYPE_FAILURE action', () => {
    testState = {
      ...testState,
      isLoading: true,
      error: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
    };

    const payload: CustomErrors = CustomErrorAdaptor.fromJson(
      Error('Some Error')
    );

    const action = new actions.SaveDiscountExcludeTypesFailure(payload);

    const result = DiscountConfigReducer(testState, action);

    expect(result.isLoading).toBeFalsy();
    expect(result.error).toBe(payload);
  });

  it('MAP_EXCLUDE_SCHEME_CODES_FAILURE action', () => {
    testState = {
      ...testState,
      isLoading: true,
      error: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
    };

    const payload: CustomErrors = CustomErrorAdaptor.fromJson(
      Error('Some Error')
    );

    const action = new actions.SaveDiscountExcludeSchemesFailure(payload);

    const result = DiscountConfigReducer(testState, action);

    expect(result.isLoading).toBeFalsy();
    expect(result.error).toBe(payload);
  });
  it('SAVE_DISCOUNT_DETAILS_FAILURE action', () => {
    testState = {
      ...testState,
      isLoading: true,
      error: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
    };

    const payload: CustomErrors = CustomErrorAdaptor.fromJson(
      Error('Some Error')
    );

    const action = new actions.SaveDiscountDetailsFailure(payload);

    const result = DiscountConfigReducer(testState, action);

    expect(result.isLoading).toBeFalsy();
    expect(result.error).toBe(payload);
  });

  it('LOAD_DISCOUNT_DETAILS_FAILURE action', () => {
    testState = {
      ...testState,
      isLoading: true,
      error: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
    };

    const payload: CustomErrors = CustomErrorAdaptor.fromJson(
      Error('Some Error')
    );

    const action = new actions.LoadDiscountDetailsFailure(payload);

    const result = DiscountConfigReducer(testState, action);

    expect(result.isLoading).toBeFalsy();
    expect(result.error).toBe(payload);
  });

  it('LOAD_MAPPED_PRODUCT_GROUPS_BY_CONFIG_ID_FAILURE action', () => {
    testState = {
      ...testState,
      isLoading: true,
      error: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
    };

    const payload: CustomErrors = CustomErrorAdaptor.fromJson(
      Error('Some Error')
    );

    const action = new actions.LoadMappedProductGroupsByConfigIdFailure(
      payload
    );

    const result = DiscountConfigReducer(testState, action);

    expect(result.isLoading).toBeFalsy();
    expect(result.error).toBe(payload);
  });

  it('UPDATE_PRODUCT_GROUPS_BY_CONFIG_ID_FAILURE action', () => {
    testState = {
      ...testState,
      isLoading: true,
      error: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
    };

    const payload: CustomErrors = CustomErrorAdaptor.fromJson(
      Error('Some Error')
    );

    const action = new actions.UpdateMappedProductGroupByConfigIdFailure(
      payload
    );

    const result = DiscountConfigReducer(testState, action);

    expect(result.isLoading).toBeFalsy();
    expect(result.error).toBe(payload);
  });

  it('LOAD_DISCOUNT_COMPONENT_PG_CONFIG_FAILURE action', () => {
    testState = {
      ...testState,
      isLoading: true,
      error: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
    };

    const payload: CustomErrors = CustomErrorAdaptor.fromJson(
      Error('Some Error')
    );

    const action = new actions.LoadDiscountComponentPGConfigFailure(payload);

    const result = DiscountConfigReducer(testState, action);

    expect(result.isLoading).toBeFalsy();
    expect(result.error).toBe(payload);
  });

  it('UPDATE_DISCOUNT_COMPONENT_PG_CONFIG_FAILURE action', () => {
    testState = {
      ...testState,
      isLoading: true,
      error: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
    };

    const payload: CustomErrors = CustomErrorAdaptor.fromJson(
      Error('Some Error')
    );

    const action = new actions.UpdateDiscountComponentPGConfigFailure(payload);

    const result = DiscountConfigReducer(testState, action);

    expect(result.isLoading).toBeFalsy();
    expect(result.error).toBe(payload);
  });

  it('SAVE_DISCOUNT_CONFIG_DETAILS action', () => {
    testState = {
      ...testState,
      isLoading: false,
      error: null,
      isDiscDetailsSaved: true
    };
    const payload = null;

    const action = new actions.SaveDiscountConfigList(payload);

    const result = DiscountConfigReducer(testState, action);

    expect(result.isLoading).toBeTruthy();
  });

  it('EDIT_DISCOUNT_CONFIG_DETAILS action', () => {
    testState = {
      ...testState,
      isLoading: false,
      error: null,
      isDiscDetailsSaved: true
    };
    const payload = null;

    const action = new actions.EditDiscountConfigList('', payload);

    const result = DiscountConfigReducer(testState, action);

    expect(result.isLoading).toBeTruthy();
  });

  it('LOAD_DISCOUNT_CONFIG_DETAILS_SUCCESS action', () => {
    testState = {
      ...testState,
      isLoading: false,
      error: null,
      isDiscDetailsSaved: true
    };
    const payload = null;

    const action = new actions.LoadDiscountConfigDetailsSuccess(payload);

    const result = DiscountConfigReducer(testState, action);

    expect(result.isLoading).toBeFalsy();
  });

  it('LOAD_DISCOUNT_TYPES_SUCCESS action', () => {
    testState = {
      ...testState,
      isLoading: false,
      error: null,
      isDiscDetailsSaved: true
    };
    const payload = null;

    const action = new actions.LoadDiscountTypesSuccess(payload);

    const result = DiscountConfigReducer(testState, action);

    expect(result.isLoading).toBeFalsy();
  });

  it('LOAD_CLUBBING_DISCOUNT_TYPES_SUCCESS action', () => {
    testState = {
      ...testState,
      isLoading: false,
      error: null,
      isDiscDetailsSaved: true
    };
    const payload = null;

    const action = new actions.LoadClubbingDiscountTypesSuccess(payload);

    const result = DiscountConfigReducer(testState, action);

    expect(result.isLoading).toBeFalsy();
  });

  it('SAVE_DISCOUNT_CONFIG_DETAILS_SUCCESS action', () => {
    testState = {
      ...testState,
      isLoading: false,
      error: null,
      isDiscDetailsSaved: true
    };
    const payload = null;

    const action = new actions.SaveDiscountConfigListSuccess(payload);

    const result = DiscountConfigReducer(testState, action);

    expect(result.isLoading).toBeFalsy();
  });

  it('EDIT_DISCOUNT_CONFIG_DETAILS_SUCCESS action', () => {
    testState = {
      ...testState,
      isLoading: false,
      error: null,
      isDiscDetailsSaved: true
    };

    const action = new actions.EditDiscountConfigListSuccess();

    const result = DiscountConfigReducer(testState, action);

    expect(result.isLoading).toBeFalsy();
  });

  it('LOAD_DISCOUNT_MAPPED_LOCATION_LIST_SUCCESS action', () => {
    testState = {
      ...testState,
      isLoading: false,
      error: null,
      isDiscDetailsSaved: true
    };
    const payload: DiscountLocationSuccessList = {
      discountLocationList: [],
      count: 0
    };
    const action = new actions.LoadDiscountMappedLocationListSuccess(payload);

    const result = DiscountConfigReducer(testState, action);

    expect(result.isLoading).toBeFalsy();
  });
  it('LOAD_DISCOUNT_MAPPED_PRODUCT_CATEGORY_LIST_SUCCESS action', () => {
    testState = {
      ...testState,
      isLoading: false,
      error: null,
      isDiscDetailsSaved: true
    };
    const payload: DiscountProductCategorySuccessList = {
      discountProductCategoryList: [],
      count: 0
    };
    const action = new actions.LoadDiscountMappedProductCategoryListSuccess(
      payload
    );

    const result = DiscountConfigReducer(testState, action);

    expect(result.isLoading).toBeFalsy();
  });

  it('LOAD_DISCOUNT_MAPPED_PRODUCT_GROUP_LIST_SUCCESS action', () => {
    testState = {
      ...testState,
      isLoading: false,
      error: null,
      isDiscDetailsSaved: true
    };
    const payload: DiscountProductGroupSuccessList = {
      discountProductGroupList: [],
      count: 0
    };
    const action = new actions.LoadDiscountMappedProductGroupListSuccess(
      payload
    );

    const result = DiscountConfigReducer(testState, action);

    expect(result.isLoading).toBeFalsy();
  });

  it('LOAD_EXCLUDE_TYPE_LIST_SUCCESS action', () => {
    testState = {
      ...testState,
      isLoading: false,
      error: null,
      isDiscDetailsSaved: true
    };
    const payload: DiscountExcludeItemSuccessList = {
      discountExcludeItemList: [],
      count: 0
    };
    const action = new actions.LoadDiscountExcludeTypeListSuccess(payload);

    const result = DiscountConfigReducer(testState, action);

    expect(result.isLoading).toBeFalsy();
  });

  it('LOAD_EXCLUDE_ITEM_CODES_SUCCESS action', () => {
    testState = {
      ...testState,
      isLoading: false,
      error: null,
      isDiscDetailsSaved: true
    };
    const payload: DiscountExcludeItemSuccessList = {
      discountExcludeItemList: [],
      count: 0
    };
    const action = new actions.LoadDiscountExcludeItemCodesSuccess(payload);

    const result = DiscountConfigReducer(testState, action);

    expect(result.isLoading).toBeFalsy();
  });

  it('MAP_LOCATIONS_SUCCESS action', () => {
    testState = {
      ...testState,
      isLoading: false,
      error: null,
      isDiscDetailsSaved: true
    };
    const payload = null;
    const action = new actions.SaveDiscountLocationsSuccess();

    const result = DiscountConfigReducer(testState, action);

    expect(result.isLoading).toBeFalsy();
  });
  it('MAP_PRODUCT_CATEGORIES_SUCCESS action', () => {
    testState = {
      ...testState,
      isLoading: false,
      error: null,
      isDiscDetailsSaved: true
    };
    const payload = null;
    const action = new actions.SaveDiscountProductCategorySuccess();

    const result = DiscountConfigReducer(testState, action);

    expect(result.isLoading).toBeFalsy();
  });

  it('MAP_PRODUCT_GROUPS_SUCCESS action', () => {
    testState = {
      ...testState,
      isLoading: false,
      error: null,
      isDiscDetailsSaved: true
    };
    const payload = null;
    const action = new actions.SaveDiscountProductGroupsSuccess();

    const result = DiscountConfigReducer(testState, action);

    expect(result.isLoading).toBeFalsy();
  });

  it('MAP_EXCLUDE_THEME_CODES_SUCCESS action', () => {
    testState = {
      ...testState,
      isLoading: false,
      error: null,
      isDiscDetailsSaved: true
    };
    const payload = null;
    const action = new actions.SaveDiscountExcludeThemesSuccess();

    const result = DiscountConfigReducer(testState, action);

    expect(result.isLoading).toBeFalsy();
  });

  it('MAP_EXCLUDE_TYPE_SUCCESS action', () => {
    testState = {
      ...testState,
      isLoading: false,
      error: null,
      isDiscDetailsSaved: true
    };
    const payload = null;
    const action = new actions.SaveDiscountExcludeTypesSuccess();

    const result = DiscountConfigReducer(testState, action);

    expect(result.isLoading).toBeFalsy();
  });

  it('MAP_EXCLUDE_SCHEME_CODES_SUCCESS action', () => {
    testState = {
      ...testState,
      isLoading: false,
      error: null,
      isDiscDetailsSaved: true
    };
    const payload = null;
    const action = new actions.SaveDiscountExcludeSchemesSuccess();

    const result = DiscountConfigReducer(testState, action);

    expect(result.isLoading).toBeFalsy();
  });

  it('GET_MAPPED_LOCATIONS_SUCCESS action', () => {
    testState = {
      ...testState,
      isLoading: false,
      error: null,
      isDiscDetailsSaved: true
    };
    const payload = null;
    const action = new actions.LoadSelectedLocationsSuccess(payload);

    const result = DiscountConfigReducer(testState, action);

    expect(result.isLoading).toBeFalsy();
  });

  it('GET_MAPPED_PRODUCT_CATEGORIES_SUCCESS action', () => {
    testState = {
      ...testState,
      isLoading: false,
      error: null,
      isDiscDetailsSaved: true
    };
    const payload = null;
    const action = new actions.LoadSelectedProductCategoriesSuccess(payload);

    const result = DiscountConfigReducer(testState, action);

    expect(result.isLoading).toBeFalsy();
  });

  it('GET_MAPPED_PRODUCT_GROUPS_SUCCESS action', () => {
    testState = {
      ...testState,
      isLoading: false,
      error: null,
      isDiscDetailsSaved: true
    };
    const payload = null;
    const action = new actions.LoadSelectedProductGroupsSuccess(payload);

    const result = DiscountConfigReducer(testState, action);

    expect(result.isLoading).toBeFalsy();
  });

  it('LOAD_APPLICABLE_LEVELS action', () => {
    testState = {
      ...testState,
      isLoading: false,
      error: null,
      isDiscDetailsSaved: true
    };
    const payload = null;
    const action = new actions.LoadApplicableLevels(payload);

    const result = DiscountConfigReducer(testState, action);

    expect(result.isLoading).toBeFalsy();
  });

  it('LOAD_SUB_BRANDS action', () => {
    testState = {
      ...testState,
      isLoading: false,
      error: null,
      isDiscDetailsSaved: true
    };
    const payload = null;
    const action = new actions.LoadSubBrands(payload);

    const result = DiscountConfigReducer(testState, action);

    expect(result.isLoading).toBeFalsy();
  });

  it('LOAD_BRANDS action', () => {
    testState = {
      ...testState,
      isLoading: false,
      error: null,
      isDiscDetailsSaved: true
    };
    const payload = null;
    const action = new actions.LoadBrands();

    const result = DiscountConfigReducer(testState, action);

    expect(result.isLoading).toBeFalsy();
  });

  it('LOAD_TEP_DURATION_RANGE action', () => {
    testState = {
      ...testState,
      isLoading: false,
      error: null,
      isDiscDetailsSaved: true
    };
    const payload = null;
    const action = new actions.LoadTepDurationDaysRange();

    const result = DiscountConfigReducer(testState, action);

    expect(result.isLoading).toBeFalsy();
  });

  it('LOAD_APPLICABLE_LEVELS_SUCCESS action', () => {
    testState = {
      ...testState,
      isLoading: false,
      error: null,
      isDiscDetailsSaved: true
    };
    const payload = null;
    const action = new actions.LoadApplicableLevelsSuccess(payload);

    const result = DiscountConfigReducer(testState, action);

    expect(result.isLoading).toBeFalsy();
  });

  it('LOAD_SUB_BRANDS_SUCCESS action', () => {
    testState = {
      ...testState,
      isLoading: false,
      error: null,
      isDiscDetailsSaved: true
    };
    const payload = null;
    const action = new actions.LoadSubBrandsSuccess(payload);

    const result = DiscountConfigReducer(testState, action);

    expect(result.isLoading).toBeFalsy();
  });

  it('LOAD_BRANDS_SUCCESS action', () => {
    testState = {
      ...testState,
      isLoading: false,
      error: null,
      isDiscDetailsSaved: true
    };
    const payload = null;
    const action = new actions.LoadBrandsSuccess(payload);

    const result = DiscountConfigReducer(testState, action);

    expect(result.isLoading).toBeFalsy();
  });

  it('LOAD_TEP_DURATION_RANGE_SUCCESS action', () => {
    testState = {
      ...testState,
      isLoading: false,
      error: null,
      isDiscDetailsSaved: true
    };
    const payload = null;
    const action = new actions.LoadTepDurationDaysRangeSuccess(payload);

    const result = DiscountConfigReducer(testState, action);

    expect(result.isLoading).toBeFalsy();
  });

  it('SAVE_DISCOUNT_DETAILS action', () => {
    testState = {
      ...testState,
      isLoading: false,
      error: null,
      isDiscDetailsSaved: false
    };
    const payload = null;
    const action = new actions.SaveDiscountDetails(payload);

    const result = DiscountConfigReducer(testState, action);

    expect(result.isLoading).toBeTruthy();
    expect(result.isDiscDetailsSaved).toBeFalsy();
  });

  it('LOAD_DISCOUNT_DETAILS action', () => {
    testState = {
      ...testState,
      isLoading: false,
      error: null,
      isDiscDetailsSaved: true
    };
    const payload = null;
    const action = new actions.LoadDiscountDetails(payload);

    const result = DiscountConfigReducer(testState, action);

    expect(result.isLoading).toBeTruthy();
  });

  it('SAVE_DISCOUNT_DETAILS_SUCCESS action', () => {
    testState = {
      ...testState,
      isLoading: false,
      error: null,
      isDiscDetailsSaved: true
    };
    const payload = null;
    const action = new actions.SaveDiscountDetailsSuccess(payload);

    const result = DiscountConfigReducer(testState, action);

    expect(result.isLoading).toBeFalsy();
  });

  it('LOAD_DISCOUNT_DETAILS_SUCCESS action', () => {
    testState = {
      ...testState,
      isLoading: false,
      error: null,
      isDiscDetailsSaved: true
    };
    const payload = null;
    const action = new actions.LoadDiscountDetailsSuccess(payload);

    const result = DiscountConfigReducer(testState, action);

    expect(result.isLoading).toBeFalsy();
  });

  it('LOAD_MAPPED_PRODUCT_GROUPS_BY_CONFIG_ID action', () => {
    testState = {
      ...testState,
      isLoading: false,
      error: null,
      isDiscDetailsSaved: true
    };
    const payload = null;
    const action = new actions.LoadMappedProductGroupsByConfigId(payload);

    const result = DiscountConfigReducer(testState, action);

    expect(result.isLoading).toBeTruthy();
  });

  it('LOAD_MAPPED_PRODUCT_GROUPS_BY_CONFIG_ID_SUCCESS action', () => {
    testState = {
      ...testState,
      isLoading: false,
      error: null,
      isDiscDetailsSaved: true
    };
    const payload = null;
    const action = new actions.LoadMappedProductGroupsByConfigIdSuccess(
      payload
    );

    const result = DiscountConfigReducer(testState, action);

    expect(result.isLoading).toBeFalsy();
  });

  it('UPDATE_PRODUCT_GROUPS_BY_CONFIG_ID action', () => {
    testState = {
      ...testState,
      isLoading: false,
      error: null,
      isDiscDetailsSaved: true
    };
    const payload = {
      discountId: '1',
      discountDetailsId: '2',
      data: {
        addProducts: [],
        removeProducts: [],
        updateProducts: []
      },
      loadData: null
    };

    const action = new actions.UpdateMappedProductGroupByConfigId(payload);

    const result = DiscountConfigReducer(testState, action);

    expect(result.isLoading).toBeTruthy();
  });

  it('UPDATE_PRODUCT_GROUPS_BY_CONFIG_ID_SUCCESS action', () => {
    testState = {
      ...testState,
      isLoading: false,
      error: null,
      isDiscDetailsSaved: true
    };
    const payload: ProductGroupMappingOption[] = [
      {
        id: '1',
        description: '71'
      }
    ];

    const action = new actions.UpdateMappedProductGroupByConfigIdSuccess(
      payload
    );

    const result = DiscountConfigReducer(testState, action);

    expect(result.isLoading).toBeFalsy();
  });

  it('UPDATE_PRODUCT_GROUPS_BY_CONFIG_ID_SUCCESS action', () => {
    testState = {
      ...testState,
      isLoading: false,
      error: null,
      isDiscDetailsSaved: true
    };
    const payload: ProductGroupMappingOption[] = [
      {
        id: '1',
        description: '71'
      }
    ];

    const action = new actions.UpdateMappedProductGroupByConfigIdSuccess(
      payload
    );

    const result = DiscountConfigReducer(testState, action);

    expect(result.isLoading).toBeFalsy();
  });

  it('SAVE_SLAB_DETAILS action', () => {
    testState = {
      ...testState,
      isLoading: false,
      isDiscDetailsSaved: true,
      error: null
    };
    const payload = null;

    const action = new actions.SaveSlabDetails(payload);

    const result = DiscountConfigReducer(testState, action);

    expect(result.isLoading).toBeTruthy();
    expect(result.isDiscDetailsSaved).toBeFalsy();
  });

  it('SAVE_SLAB_DETAILS_SUCCESS action', () => {
    testState = {
      ...testState,
      isLoading: true,
      slabDetails: null
    };

    const payload = null;
    const action = new actions.SaveSlabDetailsSuccess(payload);

    const result = DiscountConfigReducer(testState, action);

    expect(result.isLoading).toBeFalsy();
    expect(result.slabDetails).toBe(payload);
  });

  it('SAVE_SLAB_DETAILS_FAILURE action', () => {
    testState = {
      ...testState,
      isLoading: true,
      error: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
    };

    const payload: CustomErrors = CustomErrorAdaptor.fromJson(
      Error('Some Error')
    );

    const action = new actions.SaveSlabDetailsFailure(payload);

    const result = DiscountConfigReducer(testState, action);

    expect(result.isLoading).toBeFalsy();
    expect(result.error).toBe(payload);
  });

  it('SEND_FOR_APPROVAL_DISCOUNT_CONFIG action', () => {
    testState = {
      ...testState,
      isLoading: true,
      isDiscountSentForApproval: false
    };
    const payload = null;

    const action = new actions.SendForApprovalDiscountConfig(payload);

    const result = DiscountConfigReducer(testState, action);

    expect(result.isLoading).toBeTruthy();
    expect(result.isDiscountSentForApproval).toBeFalsy();
  })

  it('SEND_FOR_APPROVAL_DISCOUNT_CONFIG_SUCCESS action', () => {
    testState = {
      ...testState,
      isLoading: true,
      isDiscountSentForApproval: true
    };
    const payload = null;

    const action = new actions.SendForApprovalDiscountConfigSuccess();

    const result = DiscountConfigReducer(testState, action);

    expect(result.isLoading).toBeTruthy();
  });

  it('APPROVE_DISCOUNT_CONFIG action', () => {
    testState = {
      ...testState,
      isLoading: true,
      isDiscountApproved: null
    };
    const payload = null;

    const action = new actions.ApproveDiscountConfig(payload);

    const result = DiscountConfigReducer(testState, action);

    expect(result.isLoading).toBeTruthy();
    expect(result.isDiscountApproved).toBeFalsy();
  })
});
