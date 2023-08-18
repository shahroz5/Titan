import {
  BrandSummary,
  CustomErrors,
  DiscounExcludeItemListPayload,
  DiscountApplicableEnum,
  DiscountBestDealListPayload,
  DiscountConfigSuccessList,
  DiscountExcludeItemSuccessList,
  DiscountLocationListPayload,
  DiscountLocationSuccessList,
  DiscountProductCategoryListPayload,
  DiscountProductCategorySuccessList,
  DiscountProductGroupListPayload,
  DiscountProductGroupSuccessList,
  DiscountTypeEnum,
  DisountConfigListPayload,
  Lov,
  MappedBestDealDiscountSuccessList,
  MappedDetails,
  NewDiscountApplicableConfig,
  NewDiscountDetails,
  SaveBestDealDiscountPayload,
  SaveDiscountLocationsPayload,
  SaveDiscountProductCategoryPayload,
  SaveDiscountProductGroupPayload,
  SaveDiscountSchemesPayload,
  SaveDiscountThemesPayload,
  SaveExcludeTypePayload,
  TSSSRequestPayload
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import * as moment from 'moment';
import {
  ComputeTsssConfig,
  ComputeTsssConfigFailure,
  ComputeTsssConfigSuccess,
  DiscountConfigActionTypes,
  EditDiscountConfigList,
  EditDiscountConfigListFailure,
  EditDiscountConfigListSuccess,
  LoadApplicableLevels,
  LoadApplicableLevelsFailure,
  LoadApplicableLevelsSuccess,
  LoadBestDealDiscountList,
  LoadBestDealDiscountListFailure,
  LoadBestDealDiscountListSuccess,
  LoadBrands,
  LoadBrandsFailure,
  LoadBrandsSuccess,
  LoadDiscountConfigDetails,
  LoadDiscountConfigDetailsFailure,
  LoadDiscountConfigDetailsSuccess,
  LoadDiscountConfigList,
  LoadDiscountConfigListFailure,
  LoadDiscountConfigListSuccess,
  LoadDiscountDetails,
  LoadDiscountDetailsFailure,
  LoadDiscountDetailsSuccess,
  LoadDiscountExcludeItemCodes,
  LoadDiscountExcludeItemCodesFailure,
  LoadDiscountExcludeItemCodesSuccess,
  LoadDiscountExcludeTypeList,
  LoadDiscountExcludeTypeListFailure,
  LoadDiscountExcludeTypeListSuccess,
  LoadDiscountMappedLocationList,
  LoadDiscountMappedLocationListFailure,
  LoadDiscountMappedLocationListSuccess,
  LoadDiscountMappedProductCategoryList,
  LoadDiscountMappedProductCategoryListFailure,
  LoadDiscountMappedProductCategoryListSuccess,
  LoadDiscountMappedProductGroupList,
  LoadDiscountMappedProductGroupListFailure,
  LoadDiscountMappedProductGroupListSuccess,
  LoadEmpowermentDiscountDetails,
  LoadEmpowermentDiscountDetailsFailure,
  LoadEmpowermentDiscountDetailsSuccess,
  LoadSelectedBestDealDiscountFailure,
  LoadSelectedBestDealDiscounts,
  LoadSelectedBestDealDiscountSuccess,
  LoadSelectedLocations,
  LoadSelectedLocationsFailure,
  LoadSelectedLocationsSuccess,
  LoadSelectedProductCategories,
  LoadSelectedProductCategoriesFailure,
  LoadSelectedProductCategoriesSuccess,
  LoadSelectedProductGroups,
  LoadSelectedProductGroupsFailure,
  LoadSelectedProductGroupsSuccess,
  LoadSubBrands,
  LoadSubBrandsFailure,
  LoadSubBrandsSuccess,
  LoadTepDurationDaysRange,
  LoadTepDurationDaysRangeFailure,
  LoadTepDurationDaysRangeSuccess,
  LoadTsssConfigDownloadUrl,
  LoadTsssConfigDownloadUrlFailure,
  LoadTsssConfigDownloadUrlSuccess,
  PublishDiscountConfig,
  PublishDiscountConfigFailure,
  PublishDiscountConfigSuccess,
  ResetDiscounts,
  SaveBestDealDiscounts,
  SaveBestDealDiscountsFailure,
  SaveBestDealDiscountsSuccess,
  SaveDiscountConfigList,
  SaveDiscountConfigListFailure,
  SaveDiscountConfigListSuccess,
  SaveDiscountDetails,
  SaveDiscountDetailsFailure,
  SaveDiscountDetailsSuccess,
  SaveDiscountExcludeSchemes,
  SaveDiscountExcludeSchemesFailure,
  SaveDiscountExcludeSchemesSuccess,
  SaveDiscountExcludeThemes,
  SaveDiscountExcludeThemesFailure,
  SaveDiscountExcludeThemesSuccess,
  SaveDiscountExcludeTypes,
  SaveDiscountExcludeTypesFailure,
  SaveDiscountExcludeTypesSuccess,
  SaveDiscountLocations,
  SaveDiscountLocationsFailure,
  SaveDiscountLocationsSuccess,
  SaveDiscountProductCategory,
  SaveDiscountProductCategoryFailure,
  SaveDiscountProductCategorySuccess,
  SaveDiscountProductGroups,
  SaveDiscountProductGroupsFailure,
  SaveDiscountProductGroupsSuccess,
  SaveEmpowermentDetails,
  SaveEmpowermentDetailsFailure,
  SaveEmpowermentDetailsSuccess,
  SaveSlabDetails,
  SaveSlabDetailsFailure,
  SaveSlabDetailsSuccess,
  UpdateEmpowermentDetails,
  UpdateEmpowermentDetailsFailure,
  UpdateEmpowermentDetailsSuccess
} from './discount-config.actions';

describe('Discount Config Action Testing Suite', () => {
  const discountConfig: NewDiscountApplicableConfig = {
    abCoData: {
      type: DiscountApplicableEnum.AB_CO_DATA,
      data: {
        coDiscount: {
          preview: false,
          regular: false,
          co: false,
          postCO: false,
          postRegular: false
        },
        abDiscount: {
          preview: false,
          regular: false,
          ab: false,
          postAB: false,
          postRegular: false
        }
      }
    },
    orderDetails: {
      type: DiscountApplicableEnum.AB_CO_TYPE,
      data: {
        isGoldRateFrozenForCO: false,
        isGoldRateFrozenForAB: false,
        offerPeriodForCO: 0,
        offerPeriodForAB: 0,
        coPercent: 0,
        abPercent: 0,
        isAllowedToChangeCO: false,
        isDisplayOnCO: false,
        isAllowedToChangeAB: false,
        isDisplayOnAB: false
      }
    },
    tepDetails: {
      type: DiscountApplicableEnum.TEP_TYPE,
      data: {
        isEnabled: true,
        tepDetails: []
      }
    },
    grnDetails: {
      type: DiscountApplicableEnum.GRN_TYPE,
      data: {
        noOfDaysAfterOfferPeriod: 0,
        utilizationPercent: 0,
        isAllowedBeforeOffer: false,
        isSameCfaEligible: false
      }
    },
    basicCriteria: {
      type: DiscountApplicableEnum.BASIC_CRITERIA_TYPE,
      data: {
        isNarationMandatory: false,
        isTepRecovery: true,
        isEditable: true,
        isMultipleTransactionPerDayAllowed: false,
        maxTransactionPerDay: 0,
        ucp: {
          isValue: true,
          value: 0
        },
        startingSerialNo: null,

        tataEmployeeConfig: {
          maxCount: 0
        },
        coinConfig: {
          tepCNPercentage: 0,
          coinPurchasePeriod: {
            from: null,
            to: null
          },
          tepPeriod: {
            from: null,
            to: null
          },
          makingChargePercentage: 0
        },
        isFullValueTepDiscountRecovery: false,
        isApplicableForAutomatedDiscount: false
      }
    },
    clubOtherOffersConfig: {
      type: DiscountApplicableEnum.CLUB_OTHER_OFFERS,
      data: {
        isExchangeOffer: null,
        isFOCOffer: null,
        isGHS: null,
        isRiva: null,
        isDV: null,
        isCoin: null,
        isBillLevelDiscount: null
      }
    },
    clubDiscountType: {
      type: DiscountApplicableEnum.CLUB_DISCOUNT_TYPE,
      data: {
        isClubbedOtherDiscounts: false,
        isClubbedOtherBillLevelDiscounts: false,
        discountType: null
      }
    },
    cumulativeDetails: {
      type: DiscountApplicableEnum.CUMULATIVE_TYPE,
      data: { isSameStore: false, isOtherStore: false, isFamilyTree: false }
    },
    applicableThemes: {
      type: DiscountTypeEnum.HIGH_VALUE_DISCOUNT,
      data: {
        digit1: false,
        digit2: false,
        digit3: false,
        digit4: false,
        digit5: false,
        digit6: false,
        digit8: false,
        digit9: false,
        digit10: false,
        digit11: false,
        digit12: false,
        digit13: false,
        digit14: false
      }
    },
    configDetails: {
      type: DiscountApplicableEnum.EXCHANGE_OFFER_CONFIG,
      data: {
        applicableCN: {
          isTep: false,
          isGep: false
        },
        minCNUtilizationPercent: null,
        isResidualFund: false
      }
    }
  };
  const discountHeaderDetails: NewDiscountDetails = {
    id: 'AAA',
    discountCode: 'AAA',
    description: 'AAA',
    discountType: 'AAA',
    occasion: 'AAA',
    approvedBy: 'AAA',
    brandCode: 'AAA',
    subBrandCode: 'AAA',
    applicableLevels: 'AAA',
    remarks: 'AAA',
    isAccrualUlpPoints: false,
    isActive: false,
    isRiva: false,
    // configDetails?: any,
    // itemGroupConfi?: any;
    isCoOfferApplicable: false,
    isPreviewApplicable: false,
    isAbOfferApplicable: false,
    ulpCreateDate: moment()
  };
  //discount config List

  describe('LoadDiscountConfigList Action Test Cases', () => {
    it('should check correct type is used for  LoadDiscountConfigList action ', () => {
      const payload: DisountConfigListPayload = {
        pageIndex: 0,
        pageSize: 100
      };
      const action = new LoadDiscountConfigList(payload);
      expect({ ...action }).toEqual({
        type: DiscountConfigActionTypes.LOAD_DISCOUNT_CONFIG_LIST,
        payload
      });
    });
    it('should check correct type is used for  LoadDiscountConfigListSuccess action ', () => {
      const payload: DiscountConfigSuccessList = {
        discountConfigList: [],
        count: 0
      };
      const action = new LoadDiscountConfigListSuccess(payload);

      expect({ ...action }).toEqual({
        type: DiscountConfigActionTypes.LOAD_DISCOUNT_CONFIG_LIST_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadDiscountConfigListFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadDiscountConfigListFailure(payload);

      expect({ ...action }).toEqual({
        type: DiscountConfigActionTypes.LOAD_DISCOUNT_CONFIG_LIST_FAILURE,
        payload
      });
    });
  });

  // Discount Config Details

  describe('LoadDiscountConfigDetails Action Test Cases', () => {
    it('should check correct type is used for  LoadDiscountConfigDetails action ', () => {
      const payload = '5323C09C-5C84-43A0-98D5-A7A709BCCD08';
      const action = new LoadDiscountConfigDetails(payload);
      expect({ ...action }).toEqual({
        type: DiscountConfigActionTypes.LOAD_DISCOUNT_CONFIG_DETAILS,
        payload
      });
    });
    it('should check correct type is used for LoadDiscountConfigDetailsSuccess action ', () => {
      const action = new LoadDiscountConfigDetailsSuccess(discountConfig);

      expect({ ...action }).toEqual({
        type: DiscountConfigActionTypes.LOAD_DISCOUNT_CONFIG_DETAILS_SUCCESS,
        payload: discountConfig
      });
    });
    it('should check correct type is used for  LoadDiscountConfigDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadDiscountConfigDetailsFailure(payload);

      expect({ ...action }).toEqual({
        type: DiscountConfigActionTypes.LOAD_DISCOUNT_CONFIG_DETAILS_FAILURE,
        payload
      });
    });
  });

  // Save Discount Headers

  describe('SaveDiscountConfigList Action Test Cases', () => {
    it('should check correct type is used for  SaveDiscountConfigList action ', () => {
      const payload = discountHeaderDetails;
      const action = new SaveDiscountConfigList(payload);
      expect({ ...action }).toEqual({
        type: DiscountConfigActionTypes.SAVE_DISCOUNT_CONFIG_DETAILS,
        payload
      });
    });
    it('should check correct type is used for SaveDiscountConfigListSuccess action ', () => {
      const payload = discountHeaderDetails;
      const action = new SaveDiscountConfigListSuccess(payload);

      expect({ ...action }).toEqual({
        type: DiscountConfigActionTypes.SAVE_DISCOUNT_CONFIG_DETAILS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  SaveDiscountConfigListFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SaveDiscountConfigListFailure(payload);

      expect({ ...action }).toEqual({
        type: DiscountConfigActionTypes.SAVE_DISCOUNT_CONFIG_DETAILS_FAILURE,
        payload
      });
    });
  });

  // Edit Discount Config

  describe('EditDiscountConfigList Action Test Cases', () => {
    it('should check correct type is used for  EditDiscountConfigList action ', () => {
      const id = 'AAA';
      const payload = discountConfig;
      const action = new EditDiscountConfigList(id, payload);
      expect({ ...action }).toEqual({
        type: DiscountConfigActionTypes.EDIT_DISCOUNT_CONFIG_DETAILS,
        id,
        payload
      });
    });
    it('should check correct type is used for EditDiscountConfigListSuccess action ', () => {
      const action = new EditDiscountConfigListSuccess();

      expect({ ...action }).toEqual({
        type: DiscountConfigActionTypes.EDIT_DISCOUNT_CONFIG_DETAILS_SUCCESS
      });
    });
    it('should check correct type is used for  EditDiscountConfigListFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new EditDiscountConfigListFailure(payload);

      expect({ ...action }).toEqual({
        type: DiscountConfigActionTypes.EDIT_DISCOUNT_CONFIG_DETAILS_FAILURE,
        payload
      });
    });
  });

  // Load Discount Locations List

  describe('LoadDiscountMappedLocationList Action Test Cases', () => {
    it('should check correct type is used for  LoadDiscountMappedLocationList action ', () => {
      const payload: DiscountLocationListPayload = {
        id: 'AAA-TEST-BBBB-CCCC',
        pageIndex: 0,
        pageSize: 100,
        locationCode: 'CPD',
        offerEndDate: moment(),
        offerStartDate: moment(),
        previewEndDate: moment(),
        previewStartDate: moment(),
        configDetails: {}
      };
      const action = new LoadDiscountMappedLocationList(payload);
      expect({ ...action }).toEqual({
        type: DiscountConfigActionTypes.LOAD_DISCOUNT_MAPPED_LOCATION_LIST,
        payload
      });
    });
    it('should check correct type is used for  LoadDiscountMappedLocationListSuccess action ', () => {
      const payload: DiscountLocationSuccessList = {
        discountLocationList: [],
        count: 0
      };
      const action = new LoadDiscountMappedLocationListSuccess(payload);

      expect({ ...action }).toEqual({
        type:
          DiscountConfigActionTypes.LOAD_DISCOUNT_MAPPED_LOCATION_LIST_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadDiscountMappedLocationListFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadDiscountMappedLocationListFailure(payload);

      expect({ ...action }).toEqual({
        type:
          DiscountConfigActionTypes.LOAD_DISCOUNT_MAPPED_LOCATION_LIST_FAILURE,
        payload
      });
    });
  });

  //Load Discount Product Groups List

  describe('LoadDiscountMappedProductGroupList Action Test Cases', () => {
    it('should check correct type is used for  LoadDiscountMappedProductGroupList action ', () => {
      const payload: DiscountProductGroupListPayload = {
        id: 'AAA-TEST-BBBB-CCCC',
        pagination: { pageIndex: 0, pageSize: 100 },
        productGroupCodeList: [],
        karatType: 'TEP'
      };
      const action = new LoadDiscountMappedProductGroupList(payload);
      expect({ ...action }).toEqual({
        type: DiscountConfigActionTypes.LOAD_DISCOUNT_MAPPED_PRODUCT_GROUP_LIST,
        payload
      });
    });
    it('should check correct type is used for  LoadDiscountMappedProductGroupListSuccess action ', () => {
      const payload: DiscountProductGroupSuccessList = {
        discountProductGroupList: [],
        count: 0
      };
      const action = new LoadDiscountMappedProductGroupListSuccess(payload);

      expect({ ...action }).toEqual({
        type:
          DiscountConfigActionTypes.LOAD_DISCOUNT_MAPPED_PRODUCT_GROUP_LIST_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadDiscountMappedProductGroupListFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadDiscountMappedProductGroupListFailure(payload);

      expect({ ...action }).toEqual({
        type:
          DiscountConfigActionTypes.LOAD_DISCOUNT_MAPPED_PRODUCT_GROUP_LIST_FAILURE,
        payload
      });
    });
  });

  //Load Discount Product Categories List

  describe('LoadDiscountMappedProductCategoryList Action Test Cases', () => {
    it('should check correct type is used for  LoadDiscountMappedProductCategoryList action ', () => {
      const payload: DiscountProductCategoryListPayload = {
        id: 'AAA-TEST-BBBB-CCCC',
        pagination: { pageIndex: 0, pageSize: 100 },
        productCategoryCode: 'A'
      };
      const action = new LoadDiscountMappedProductCategoryList(payload);
      expect({ ...action }).toEqual({
        type:
          DiscountConfigActionTypes.LOAD_DISCOUNT_MAPPED_PRODUCT_CATEGORY_LIST,
        payload
      });
    });
    it('should check correct type is used for  LoadDiscountMappedProductCategoryListSuccess action ', () => {
      const payload: DiscountProductCategorySuccessList = {
        discountProductCategoryList: [],
        count: 0
      };
      const action = new LoadDiscountMappedProductCategoryListSuccess(payload);

      expect({ ...action }).toEqual({
        type:
          DiscountConfigActionTypes.LOAD_DISCOUNT_MAPPED_PRODUCT_CATEGORY_LIST_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadDiscountMappedProductCategoryListFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadDiscountMappedProductCategoryListFailure(payload);

      expect({ ...action }).toEqual({
        type:
          DiscountConfigActionTypes.LOAD_DISCOUNT_MAPPED_PRODUCT_CATEGORY_LIST_FAILURE,
        payload
      });
    });
  });

  // Load Discount Exclude Types List

  describe('LoadDiscountExcludeTypeList Action Test Cases', () => {
    it('should check correct type is used for  LoadDiscountExcludeTypeList action ', () => {
      const payload: DiscounExcludeItemListPayload = {
        id: 'AAA-TEST-BBBB-CCCC',
        pagination: { pageIndex: 0, pageSize: 100 },
        isPageable: false,
        itemCode: 'AAA',
        excludeType: 'THEME_CODE',
        sort: true
      };
      const action = new LoadDiscountExcludeTypeList(payload);
      expect({ ...action }).toEqual({
        type: DiscountConfigActionTypes.LOAD_EXCLUDE_TYPE_LIST,
        payload
      });
    });
    it('should check correct type is used for  LoadDiscountExcludeTypeListSuccess action ', () => {
      const payload: DiscountExcludeItemSuccessList = {
        discountExcludeItemList: [],
        count: 0
      };
      const action = new LoadDiscountExcludeTypeListSuccess(payload);

      expect({ ...action }).toEqual({
        type: DiscountConfigActionTypes.LOAD_EXCLUDE_TYPE_LIST_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadDiscountExcludeTypeListFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadDiscountExcludeTypeListFailure(payload);

      expect({ ...action }).toEqual({
        type: DiscountConfigActionTypes.LOAD_EXCLUDE_TYPE_LIST_FAILURE,
        payload
      });
    });
  });

  //  Load Exclude Item Codes List

  describe('LoadDiscountExcludeItemCodes Action Test Cases', () => {
    it('should check correct type is used for  LoadDiscountExcludeItemCodes action ', () => {
      const payload: DiscounExcludeItemListPayload = {
        id: 'AAA-TEST-BBBB-CCCC',
        pagination: { pageIndex: 0, pageSize: 100 },
        isPageable: false,
        itemCode: 'AAA',
        excludeType: 'ITEM_CODE',
        sort: true
      };
      const action = new LoadDiscountExcludeItemCodes(payload);
      expect({ ...action }).toEqual({
        type: DiscountConfigActionTypes.LOAD_EXCLUDE_ITEM_CODES,
        payload
      });
    });
    it('should check correct type is used for  LoadDiscountExcludeItemCodesSuccess action ', () => {
      const payload: DiscountExcludeItemSuccessList = {
        discountExcludeItemList: [],
        count: 0
      };
      const action = new LoadDiscountExcludeItemCodesSuccess(payload);

      expect({ ...action }).toEqual({
        type: DiscountConfigActionTypes.LOAD_EXCLUDE_ITEM_CODES_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadDiscountExcludeItemCodesFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadDiscountExcludeItemCodesFailure(payload);

      expect({ ...action }).toEqual({
        type: DiscountConfigActionTypes.LOAD_EXCLUDE_ITEM_CODES_FAILURE,
        payload
      });
    });
  });

  //  Save Discount Locations
  describe('SaveDiscountLocations Action Test Cases', () => {
    it('should check correct type is used for  SaveDiscountLocations action ', () => {
      const payload: SaveDiscountLocationsPayload = {
        id: 'AAA',
        payload: {
          addLocations: [],
          configDetails: {
            data: {},
            type: 'AAA'
          },
          removeLocations: [],
          status: true,
          updateLocations: [],
          validity: {
            offerEndDate: 1111,
            offerStartDate: 1111,
            previewEndDate: 1111,
            previewStartDate: 1111
          }
        }
      };
      const action = new SaveDiscountLocations(payload);
      expect({ ...action }).toEqual({
        type: DiscountConfigActionTypes.MAP_LOCATIONS,
        payload
      });
    });
    it('should check correct type is used for SaveDiscountLocationsSuccess action ', () => {
      const action = new SaveDiscountLocationsSuccess();

      expect({ ...action }).toEqual({
        type: DiscountConfigActionTypes.MAP_LOCATIONS_SUCCESS
      });
    });
    it('should check correct type is used for  SaveDiscountLocationsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SaveDiscountLocationsFailure(payload);

      expect({ ...action }).toEqual({
        type: DiscountConfigActionTypes.MAP_LOCATIONS_FAILURE,
        payload
      });
    });
  });

  //  Save Discount Product Groups
  describe('SaveDiscountProductGroups Action Test Cases', () => {
    it('should check correct type is used for  SaveDiscountProductGroups action ', () => {
      const payload: SaveDiscountProductGroupPayload = {
        id: '',
        karatType: 'TEP',
        addProducts: [],
        eligibleKarat: 5,
        removeProducts: [],
        updateProducts: []
      };
      const action = new SaveDiscountProductGroups(payload);
      expect({ ...action }).toEqual({
        type: DiscountConfigActionTypes.MAP_PRODUCT_GROUPS,
        payload
      });
    });
    it('should check correct type is used for SaveDiscountProductGroupsSuccess action ', () => {
      const action = new SaveDiscountProductGroupsSuccess();

      expect({ ...action }).toEqual({
        type: DiscountConfigActionTypes.MAP_PRODUCT_GROUPS_SUCCESS
      });
    });
    it('should check correct type is used for  SaveDiscountProductGroupsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SaveDiscountProductGroupsFailure(payload);

      expect({ ...action }).toEqual({
        type: DiscountConfigActionTypes.MAP_PRODUCT_GROUPS_FAILURE,
        payload
      });
    });
  });

  //  Save Discount Product Categories
  describe('SaveDiscountProductCategory Action Test Cases', () => {
    it('should check correct type is used for  SaveDiscountProductCategory action ', () => {
      const payload: SaveDiscountProductCategoryPayload = {
        id: '',
        addProductCategories: [],
        isActive: true,
        removeProductCategories: [],
        updateProductCategories: []
      };
      const action = new SaveDiscountProductCategory(payload);
      expect({ ...action }).toEqual({
        type: DiscountConfigActionTypes.MAP_PRODUCT_CATEGORIES,
        payload
      });
    });
    it('should check correct type is used for SaveDiscountProductCategorySuccess action ', () => {
      const action = new SaveDiscountProductCategorySuccess();

      expect({ ...action }).toEqual({
        type: DiscountConfigActionTypes.MAP_PRODUCT_CATEGORIES_SUCCESS
      });
    });
    it('should check correct type is used for  SaveDiscountProductCategoryFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SaveDiscountProductCategoryFailure(payload);

      expect({ ...action }).toEqual({
        type: DiscountConfigActionTypes.MAP_PRODUCT_CATEGORIES_FAILURE,
        payload
      });
    });
  });

  //  Save Discount Exclude Themes
  describe('SaveDiscountExcludeThemes Action Test Cases', () => {
    it('should check correct type is used for  SaveDiscountExcludeThemes action ', () => {
      const payload: SaveDiscountThemesPayload = {
        id: '',
        excludeType: 'THEME_CODE',
        addThemes: [],
        removeThemes: [],
        updateThemes: []
      };
      const action = new SaveDiscountExcludeThemes(payload);
      expect({ ...action }).toEqual({
        type: DiscountConfigActionTypes.MAP_EXCLUDE_THEME_CODES,
        payload
      });
    });
    it('should check correct type is used for SaveDiscountExcludeThemesSuccess action ', () => {
      const action = new SaveDiscountExcludeThemesSuccess();

      expect({ ...action }).toEqual({
        type: DiscountConfigActionTypes.MAP_EXCLUDE_THEME_CODES_SUCCESS
      });
    });
    it('should check correct type is used for  SaveDiscountExcludeThemesFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SaveDiscountExcludeThemesFailure(payload);

      expect({ ...action }).toEqual({
        type: DiscountConfigActionTypes.MAP_EXCLUDE_THEME_CODES_FAILURE,
        payload
      });
    });
  });

  //  Save Discount Exclude Types

  describe('SaveDiscountExcludeTypes Action Test Cases', () => {
    it('should check correct type is used for  SaveDiscountExcludeTypes action ', () => {
      const payload: SaveExcludeTypePayload = {
        id: '',
        excludeType: 'COMPLEXITY_PERCENT',
        payload: {
          addValues: [
            {
              fromValue: 1,
              toValue: 2
            }
          ],
          removeValues: [],
          updateValue: [
            {
              fromValue: 2,
              id: 'AAA',
              toValue: 3
            }
          ]
        }
      };
      const action = new SaveDiscountExcludeTypes(payload);
      expect({ ...action }).toEqual({
        type: DiscountConfigActionTypes.MAP_EXCLUDE_TYPE,
        payload
      });
    });
    it('should check correct type is used for SaveDiscountExcludeTypesSuccess action ', () => {
      const action = new SaveDiscountExcludeTypesSuccess();

      expect({ ...action }).toEqual({
        type: DiscountConfigActionTypes.MAP_EXCLUDE_TYPE_SUCCESS
      });
    });
    it('should check correct type is used for  SaveDiscountExcludeTypesFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SaveDiscountExcludeTypesFailure(payload);

      expect({ ...action }).toEqual({
        type: DiscountConfigActionTypes.MAP_EXCLUDE_TYPE_FAILURE,
        payload
      });
    });
  });

  //  Load Best Deal Discount List

  describe('LoadBestDealDiscountList Action Test Cases', () => {
    it('should check correct type is used for  LoadBestDealDiscountList action ', () => {
      const payload: DisountConfigListPayload = {
        pageIndex: 0,
        pageSize: 10,
        clubbingDiscountType: 'ADFF',
        discountCode: 'ADFFR4395SKAD',
        discountType: 'HIGH-VALUE_DISCOUNT',
        status: 'RUNNING'
      };
      const action = new LoadBestDealDiscountList(payload);
      expect({ ...action }).toEqual({
        type: DiscountConfigActionTypes.LOAD_BEST_DEAL_DISCOUNT_LIST,
        payload
      });
    });
    it('should check correct type is used for  LoadBestDealDiscountListSuccess action ', () => {
      const payload: DiscountConfigSuccessList = {
        discountConfigList: [],
        count: 0
      };
      const action = new LoadBestDealDiscountListSuccess(payload);

      expect({ ...action }).toEqual({
        type: DiscountConfigActionTypes.LOAD_BEST_DEAL_DISCOUNT_LIST_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadBestDealDiscountListFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadBestDealDiscountListFailure(payload);

      expect({ ...action }).toEqual({
        type: DiscountConfigActionTypes.LOAD_BEST_DEAL_DISCOUNT_LIST_FAILURE,
        payload
      });
    });
  });

  //  Load Selected Best Deal Discount List

  describe(' LoadSelectedBestDealDiscounts Action Test Cases', () => {
    it('should check correct type is used for   LoadSelectedBestDealDiscounts action', () => {
      const payload: DiscountBestDealListPayload = {
        pageIndex: 0,
        pageSize: 10,
        id: 'ANFKNWI9857934'
      };
      const action = new LoadSelectedBestDealDiscounts(payload);
      expect({ ...action }).toEqual({
        type: DiscountConfigActionTypes.GET_MAPPED_BEST_DEAL_DISCOUNTS,
        payload
      });
    });
    it('should check correct type is used for  LoadSelectedBestDealDiscountSuccess action ', () => {
      const payload: MappedBestDealDiscountSuccessList = {
        mappedDetails: [],
        count: 0
      };
      const action = new LoadSelectedBestDealDiscountSuccess(payload);

      expect({ ...action }).toEqual({
        type: DiscountConfigActionTypes.GET_MAPPED_BEST_DEAL_DISCOUNTS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadSelectedBestDealDiscountFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadSelectedBestDealDiscountFailure(payload);

      expect({ ...action }).toEqual({
        type: DiscountConfigActionTypes.GET_MAPPED_BEST_DEAL_DISCOUNTS_FAILURE,
        payload
      });
    });
  });

  //  Save Best Deal Discount

  describe(' SaveBestDealDiscounts Action Test Cases', () => {
    it('should check correct type is used for   SaveBestDealDiscounts action', () => {
      const payload: SaveBestDealDiscountPayload = {
        id: 'ANFKNWI9857934',
        addLinks: [],
        removeLinks: []
      };
      const action = new SaveBestDealDiscounts(payload);
      expect({ ...action }).toEqual({
        type: DiscountConfigActionTypes.MAP_BEST_DEAL_DISCOUNTS,
        payload
      });
    });
    it('should check correct type is used for  SaveBestDealDiscountsSuccess action ', () => {
      const action = new SaveBestDealDiscountsSuccess();

      expect({ ...action }).toEqual({
        type: DiscountConfigActionTypes.MAP_BEST_DEAL_DISCOUNTS_SUCCESS
      });
    });
    it('should check correct type is used for  LoadSelectedBestDealDiscountFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SaveBestDealDiscountsFailure(payload);

      expect({ ...action }).toEqual({
        type: DiscountConfigActionTypes.MAP_BEST_DEAL_DISCOUNTS_FAILURE,
        payload
      });
    });
  });

  //  Compute TSSS config

  describe(' ComputeTsssConfig Action Test Cases', () => {
    it('should check correct type is used for   ComputeTsssConfig action', () => {
      const payload: TSSSRequestPayload = {
        discountId: 'ADNNSIJ13',
        couponRequest: null
      };
      const action = new ComputeTsssConfig(payload);
      expect({ ...action }).toEqual({
        type: DiscountConfigActionTypes.COMPUTE_TSSS_CONFIG,
        payload
      });
    });
    it('should check correct type is used for  ComputeTsssConfigSuccess action ', () => {
      const payload = null;
      const action = new ComputeTsssConfigSuccess(payload);

      expect({ ...action }).toEqual({
        type: DiscountConfigActionTypes.COMPUTE_TSSS_CONFIG_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  ComputeTsssConfigFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new ComputeTsssConfigFailure(payload);

      expect({ ...action }).toEqual({
        type: DiscountConfigActionTypes.COMPUTE_TSSS_CONFIG_FAILURE,
        payload
      });
    });
  });

  //  Load TSSS config download Url

  describe(' LoadTsssConfigDownloadUrl Action Test Cases', () => {
    it('should check correct type is used for   LoadTsssConfigDownloadUrl action', () => {
      const payload = 'ADNNSIJ13';
      const action = new LoadTsssConfigDownloadUrl(payload);
      expect({ ...action }).toEqual({
        type: DiscountConfigActionTypes.LOAD_TSSS_CONFIG_DOWNLOAD_URL,
        payload
      });
    });
    it('should check correct type is used for  LoadTsssConfigDownloadUrlSuccess action ', () => {
      const payload = null;
      const action = new LoadTsssConfigDownloadUrlSuccess(payload);

      expect({ ...action }).toEqual({
        type: DiscountConfigActionTypes.LOAD_TSSS_CONFIG_DOWNLOAD_URL_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadTsssConfigDownloadUrlFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadTsssConfigDownloadUrlFailure(payload);

      expect({ ...action }).toEqual({
        type: DiscountConfigActionTypes.LOAD_TSSS_CONFIG_DOWNLOAD_URL_FAILURE,
        payload
      });
    });
  });

  //  Save empowerment details

  describe('SaveEmpowermentDetails Action Test Cases', () => {
    it('should check correct type is used for  SaveEmpowermentDetails action', () => {
      const payload = 'ADNNSIJ13';
      const action = new SaveEmpowermentDetails(payload);
      expect({ ...action }).toEqual({
        type: DiscountConfigActionTypes.SAVE_EMPOWERMENT_DETAILS,
        payload
      });
    });
    it('should check correct type is used for  SaveEmpowermentDetailsSuccess action ', () => {
      const payload = null;
      const action = new SaveEmpowermentDetailsSuccess(payload);

      expect({ ...action }).toEqual({
        type: DiscountConfigActionTypes.SAVE_EMPOWERMENT_DETAILS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  SaveEmpowermentDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SaveEmpowermentDetailsFailure(payload);

      expect({ ...action }).toEqual({
        type: DiscountConfigActionTypes.SAVE_EMPOWERMENT_DETAILS_FAILURE,
        payload
      });
    });
  });

  //  Update empowerment details

  describe('UpdateEmpowermentDetails Action Test Cases', () => {
    it('should check correct type is used for  UpdateEmpowermentDetails action', () => {
      const payload = 'ADNNSIJ13';
      const action = new UpdateEmpowermentDetails(payload);
      expect({ ...action }).toEqual({
        type: DiscountConfigActionTypes.UPDATE_EMPOWERMENT_DETAILS,
        payload
      });
    });
    it('should check correct type is used for  UpdateEmpowermentDetailsSuccess action ', () => {
      const payload = null;
      const action = new UpdateEmpowermentDetailsSuccess(payload);

      expect({ ...action }).toEqual({
        type: DiscountConfigActionTypes.UPDATE_EMPOWERMENT_DETAILS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  UpdateEmpowermentDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new UpdateEmpowermentDetailsFailure(payload);

      expect({ ...action }).toEqual({
        type: DiscountConfigActionTypes.UPDATE_EMPOWERMENT_DETAILS_FAILURE,
        payload
      });
    });
  });

  //  Load empowerment dicount details

  describe('LoadEmpowermentDiscountDetails Action Test Cases', () => {
    it('should check correct type is used for  LoadEmpowermentDiscountDetails action', () => {
      const payload = 'ADNNSIJ13';
      const action = new LoadEmpowermentDiscountDetails(payload);
      expect({ ...action }).toEqual({
        type: DiscountConfigActionTypes.LOAD_EMPOWERMENT_DISCOUNT_DETAILS,
        payload
      });
    });
    it('should check correct type is used for  LoadEmpowermentDiscountDetailsSuccess action ', () => {
      const payload = null;
      const action = new LoadEmpowermentDiscountDetailsSuccess(payload);

      expect({ ...action }).toEqual({
        type:
          DiscountConfigActionTypes.LOAD_EMPOWERMENT_DISCOUNT_DETAILS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadEmpowermentDiscountDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadEmpowermentDiscountDetailsFailure(payload);

      expect({ ...action }).toEqual({
        type:
          DiscountConfigActionTypes.LOAD_EMPOWERMENT_DISCOUNT_DETAILS_FAILURE,
        payload
      });
    });
  });

  //  Publish discount config

  describe('PublishDiscountConfig Action Test Cases', () => {
    it('should check correct type is used for  PublishDiscountConfig action', () => {
      const payload = 'ADNNSIJ13';
      const action = new PublishDiscountConfig(payload);
      expect({ ...action }).toEqual({
        type: DiscountConfigActionTypes.PUBLISH_DISCOUNT_CONFIG,
        payload
      });
    });
    it('should check correct type is used for  PublishDiscountConfigSuccess action ', () => {
      const action = new PublishDiscountConfigSuccess();

      expect({ ...action }).toEqual({
        type: DiscountConfigActionTypes.PUBLISH_DISCOUNT_CONFIG_SUCCESS
      });
    });
    it('should check correct type is used for  PublishDiscountConfigFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new PublishDiscountConfigFailure(payload);

      expect({ ...action }).toEqual({
        type: DiscountConfigActionTypes.PUBLISH_DISCOUNT_CONFIG_FAILURE,
        payload
      });
    });
  });

  // Reset Discounts

  describe('SaveDiscountExcludeSchemes Action Test Cases', () => {
    it('should check correct type is used for  SaveDiscountExcludeSchemes action', () => {
      const payload: SaveDiscountSchemesPayload = {
        id: '1',
        isActive: true,
        excludeType: 'SCHME_CODE',
        addSchemes: [],
        removeSchemes: [],
        updateSchemes: []
      };
      const action = new SaveDiscountExcludeSchemes(payload);
      expect({ ...action }).toEqual({
        type: DiscountConfigActionTypes.MAP_EXCLUDE_SCHEME_CODES,
        payload
      });
    });
    it('should check correct type is used for  SaveDiscountExcludeSchemesSuccess action ', () => {
      const action = new SaveDiscountExcludeSchemesSuccess();

      expect({ ...action }).toEqual({
        type: DiscountConfigActionTypes.MAP_EXCLUDE_SCHEME_CODES_SUCCESS
      });
    });
    it('should check correct type is used for  SaveDiscountExcludeSchemesFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SaveDiscountExcludeSchemesFailure(payload);

      expect({ ...action }).toEqual({
        type: DiscountConfigActionTypes.MAP_EXCLUDE_SCHEME_CODES_FAILURE,
        payload
      });
    });
  });

  describe('LoadSelectedLocations Action Test Cases', () => {
    it('should check correct type is used for  LoadSelectedLocations action', () => {
      const payload: DiscountLocationListPayload = {
        id: 'AAA-TEST-BBBB-CCCC',
        pageIndex: 0,
        pageSize: 100,
        locationCode: 'CPD',
        offerEndDate: moment(),
        offerStartDate: moment(),
        previewEndDate: moment(),
        previewStartDate: moment(),
        configDetails: {}
      };
      const action = new LoadSelectedLocations(payload);
      expect({ ...action }).toEqual({
        type: DiscountConfigActionTypes.GET_MAPPED_LOCATIONS,
        payload
      });
    });
    it('should check correct type is used for  LoadSelectedLocationsSuccess action ', () => {
      const payload: MappedDetails[] = [
        {
          id: '',
          uuid: '2',
          description: 'URB',
          isActive: true
        }
      ];
      const action = new LoadSelectedLocationsSuccess(payload);

      expect({ ...action }).toEqual({
        type: DiscountConfigActionTypes.GET_MAPPED_LOCATIONS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadSelectedLocationsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadSelectedLocationsFailure(payload);

      expect({ ...action }).toEqual({
        type: DiscountConfigActionTypes.GET_MAPPED_LOCATIONS_FAILURE,
        payload
      });
    });
  });

  describe('LoadSelectedProductGroups Action Test Cases', () => {
    it('should check correct type is used for  LoadSelectedProductGroups action', () => {
      const payload: DiscountProductGroupListPayload = {
        id: 'AAA-TEST-BBBB-CCCC',
        pagination: { pageIndex: 0, pageSize: 100 },
        productGroupCodeList: [],
        karatType: 'TEP'
      };
      const action = new LoadSelectedProductGroups(payload);
      expect({ ...action }).toEqual({
        type: DiscountConfigActionTypes.GET_MAPPED_PRODUCT_GROUPS,
        payload
      });
    });
    it('should check correct type is used for  LoadSelectedProductGroupsSuccess action ', () => {
      const payload: MappedDetails[] = [
        {
          id: '71',
          uuid: '2',
          description: 'Gold Coins',
          isActive: true
        }
      ];
      const action = new LoadSelectedProductGroupsSuccess(payload);

      expect({ ...action }).toEqual({
        type: DiscountConfigActionTypes.GET_MAPPED_PRODUCT_GROUPS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadSelectedProductGroupsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadSelectedProductGroupsFailure(payload);

      expect({ ...action }).toEqual({
        type: DiscountConfigActionTypes.GET_MAPPED_PRODUCT_GROUPS_FAILURE,
        payload
      });
    });
  });

  describe('LoadSelectedProductCategories Action Test Cases', () => {
    it('should check correct type is used for  LoadSelectedProductCategories action', () => {
      const payload: DiscountProductCategoryListPayload = {
        id: 'AAA-TEST-BBBB-CCCC',
        pagination: { pageIndex: 0, pageSize: 100 },
        productCategoryCode: 'A'
      };
      const action = new LoadSelectedProductCategories(payload);
      expect({ ...action }).toEqual({
        type: DiscountConfigActionTypes.GET_MAPPED_PRODUCT_CATEGORIES,
        payload
      });
    });
    it('should check correct type is used for  LoadSelectedProductCategoriesSuccess action ', () => {
      const payload: MappedDetails[] = [
        {
          id: '71',
          uuid: '2',
          description: 'Gold Coins',
          isActive: true
        }
      ];
      const action = new LoadSelectedProductCategoriesSuccess(payload);

      expect({ ...action }).toEqual({
        type: DiscountConfigActionTypes.GET_MAPPED_PRODUCT_CATEGORIES_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadSelectedProductGroupsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadSelectedProductCategoriesFailure(payload);

      expect({ ...action }).toEqual({
        type: DiscountConfigActionTypes.GET_MAPPED_PRODUCT_CATEGORIES_FAILURE,
        payload
      });
    });
  });

  describe('LoadApplicableLevels Action Test Cases', () => {
    it('should check correct type is used for  LoadSelectedLoadApplicableLevels ProductCategories action', () => {
      const payload = 'L1';
      const action = new LoadApplicableLevels(payload);
      expect({ ...action }).toEqual({
        type: DiscountConfigActionTypes.LOAD_APPLICABLE_LEVELS,
        payload
      });
    });
    it('should check correct type is used for  LoadApplicableLevelsSuccess action ', () => {
      const payload: Lov[] = [
        {
          code: 'L1',
          value: 'L1',
          isActive: true
        }
      ];
      const action = new LoadApplicableLevelsSuccess(payload);

      expect({ ...action }).toEqual({
        type: DiscountConfigActionTypes.LOAD_APPLICABLE_LEVELS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadApplicableLevelsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadApplicableLevelsFailure(payload);

      expect({ ...action }).toEqual({
        type: DiscountConfigActionTypes.LOAD_APPLICABLE_LEVELS_FAILURE,
        payload
      });
    });
  });

  describe('LoadBrands Action Test Cases', () => {
    it('should check correct type is used for  LoadBrands action ', () => {
      const action = new LoadBrands();
      expect({ ...action }).toEqual({
        type: DiscountConfigActionTypes.LOAD_BRANDS
      });
    });
    it('should check correct type is used for LoadBrandsSuccess action ', () => {
      const payload: BrandSummary[] = [
        {
          brandCode: 'Tanishq',
          description: 'Tanishq'
        }
      ];
      const action = new LoadBrandsSuccess(payload);

      expect({ ...action }).toEqual({
        type: DiscountConfigActionTypes.LOAD_BRANDS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadBrandsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadBrandsFailure(payload);

      expect({ ...action }).toEqual({
        type: DiscountConfigActionTypes.LOAD_BRANDS_FAILURE,
        payload
      });
    });
  });

  describe('LoadSubBrands Action Test Cases', () => {
    it('should check correct type is used for  LoadSubBrands action ', () => {
      const payload = 'Tanishq';
      const action = new LoadSubBrands(payload);
      expect({ ...action }).toEqual({
        type: DiscountConfigActionTypes.LOAD_SUB_BRANDS,
        payload
      });
    });
    it('should check correct type is used for LoadSubBrandsSuccess action ', () => {
      const payload: BrandSummary[] = [
        {
          brandCode: 'Tanishq',
          description: 'Tanishq'
        }
      ];
      const action = new LoadSubBrandsSuccess(payload);

      expect({ ...action }).toEqual({
        type: DiscountConfigActionTypes.LOAD_SUB_BRANDS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadSubBrandsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadSubBrandsFailure(payload);

      expect({ ...action }).toEqual({
        type: DiscountConfigActionTypes.LOAD_SUB_BRANDS_FAILURE,
        payload
      });
    });
  });

  describe('LoadTepDurationDaysRange Action Test Cases', () => {
    it('should check correct type is used for  LoadTepDurationDaysRange action ', () => {
      const action = new LoadTepDurationDaysRange();
      expect({ ...action }).toEqual({
        type: DiscountConfigActionTypes.LOAD_TEP_DURATION_RANGE
      });
    });
    it('should check correct type is used for LoadTepDurationDaysRangeSuccess action ', () => {
      const payload: BrandSummary[] = [
        {
          brandCode: 'Tanishq',
          description: 'Tanishq'
        }
      ];
      const action = new LoadTepDurationDaysRangeSuccess(payload);

      expect({ ...action }).toEqual({
        type: DiscountConfigActionTypes.LOAD_TEP_DURATION_RANGE_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadTepDurationDaysRangeFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadTepDurationDaysRangeFailure(payload);

      expect({ ...action }).toEqual({
        type: DiscountConfigActionTypes.LOAD_TEP_DURATION_RANGE_FAILURE,
        payload
      });
    });
  });

  //  Save Slab details

  describe('SaveSlabDetails Action Test Cases', () => {
    it('should check correct type is used for  SaveEmpowermentDetails action', () => {
      const payload = 'ADNNSIJ13';
      const action = new SaveSlabDetails(payload);
      expect({ ...action }).toEqual({
        type: DiscountConfigActionTypes.SAVE_SLAB_DETAILS,
        payload
      });
    });
    it('should check correct type is used for  SaveSlabDetailsSuccess action ', () => {
      const payload = null;
      const action = new SaveSlabDetailsSuccess(payload);

      expect({ ...action }).toEqual({
        type: DiscountConfigActionTypes.SAVE_SLAB_DETAILS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  SaveSlabDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SaveSlabDetailsFailure(payload);

      expect({ ...action }).toEqual({
        type: DiscountConfigActionTypes.SAVE_SLAB_DETAILS_FAILURE,
        payload
      });
    });
  });

  //  save discount details

  describe('SaveDiscountDetails Action Test Cases', () => {
    it('should check correct type is used for  SaveDiscountDetails action', () => {
      const payload = 'ADNNSIJ13';
      const action = new SaveDiscountDetails(payload);
      expect({ ...action }).toEqual({
        type: DiscountConfigActionTypes.SAVE_DISCOUNT_DETAILS,
        payload
      });
    });
    it('should check correct type is used for  SaveDiscountDetailsSuccess action ', () => {
      const payload = null;
      const action = new SaveDiscountDetailsSuccess(payload);

      expect({ ...action }).toEqual({
        type: DiscountConfigActionTypes.SAVE_DISCOUNT_DETAILS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  SaveDiscountDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SaveDiscountDetailsFailure(payload);

      expect({ ...action }).toEqual({
        type: DiscountConfigActionTypes.SAVE_DISCOUNT_DETAILS_FAILURE,
        payload
      });
    });
  });

  //  Load dicount details

  describe('LoadDiscountDetails Action Test Cases', () => {
    it('should check correct type is used for  LoadDiscountDetails action', () => {
      const payload = 'ADNNSIJ13';
      const action = new LoadDiscountDetails(payload);
      expect({ ...action }).toEqual({
        type: DiscountConfigActionTypes.LOAD_DISCOUNT_DETAILS,
        payload
      });
    });
    it('should check correct type is used for  LoadDiscountDetailsSuccess action ', () => {
      const payload = null;
      const action = new LoadDiscountDetailsSuccess(payload);

      expect({ ...action }).toEqual({
        type: DiscountConfigActionTypes.LOAD_DISCOUNT_DETAILS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadDiscountDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadDiscountDetailsFailure(payload);

      expect({ ...action }).toEqual({
        type: DiscountConfigActionTypes.LOAD_DISCOUNT_DETAILS_FAILURE,
        payload
      });
    });
  });

  describe('ResetDiscounts Action Test Cases', () => {
    it('should check correct type is used for  ResetDiscounts action ', () => {
      const action = new ResetDiscounts();
      expect({ ...action }).toEqual({
        type: DiscountConfigActionTypes.RESET_DISCOUNTS
      });
    });
  });
});
