import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  CustomErrors,
  FocConfigurationListPayload,
  FocConfigurationList,
  SchemeDetails,
  LoadProductGroupPayload,
  ProductGroupMappingOption,
  SaveProductGroup,
  SaveVariantDetailsPayload,
  VariantDetails,
  FocLocationListPayload,
  LocationListSuccessPayload,
  SaveLocationPayload,
  FOCItemCodesPayload,
  FOCItemCodes,
  FocItemsSavePayload,
  LoadVariantDetailsPayload,
  FocItemsPayload,
  FocItemsResponse
} from '@poss-web/shared/models';
import {
  LoadFocConfigurationList,
  LoadFocConfigurationListSuccess,
  LoadFocConfigurationListFailure,
  FocConfigurationActionTypes,
  UpdateFocSchemeConfiguration,
  UpdateFocSchemeConfigurationSuccess,
  UpdateFocSchemeConfigurationFailure,
  SaveFocSchemeConfiguration,
  SaveFocSchemeConfigurationSuccess,
  SaveFocSchemeConfigurationFailure,
  SearchConfigBySchemeName,
  SearchConfigBySchemeNameSuccess,
  SearchConfigBySchemeNameFailure,
  LoadFocSchemeConfigurationByConfigId,
  LoadFocSchemeConfigurationByConfigIdFailure,
  LoadFocSchemeConfigurationByConfigIdSuccess,
  LoadMappedProductGroupsByConfigId,
  LoadMappedProductGroupsByConfigIdSuccess,
  LoadMappedProductGroupsByConfigIdFailure,
  UpdateProductGroupByConfigId,
  UpdateProductGroupByConfigIdSuccess,
  UpdateProductGroupByConfigIdFailure,
  SaveVariantDetails,
  SaveVariantDetailsSuccess,
  SaveVariantDetailsFailure,
  LoadVariantDetailsById,
  LoadVariantDetailsByIdSuccess,
  LoadVariantDetailsByIdFailure,
  LoadRangeWeight,
  LoadRangeWeightSuccesss,
  LoadRangeWeightFailure,
  LoadLocationById,
  LoadLocationByIdSuccess,
  LoadLocationByIdFailure,
  UpdateLocationById,
  UpdateLocationByIdFailure,
  UpdateLocationByIdSuccess,
  LoadFocItemCodesSuccess,
  LoadFocItemCodes,
  LoadFocItemCodesFailure,
  SaveFocItemsFailure,
  SaveFocItemsSuccess,
  SaveFocItems,
  SearchFocItemSuccess,
  SearchFocItemFailure,
  SearchFocItem,
  SearchLocationCode,
  SearchLocationCodeSuccess,
  SearchLocationCodeFailure,
  LoadReset,
  LoadMappedFocItemsByIdSuccess,
  LoadMappedFocItemsByIdFailure,
  LoadMappedFocItemsById,
  PublishFocScheme,
  PublishFocSchemeFailure,
  PublishFocSchemeSuccesss,
  LoadVariantDetailsValueGoldStandardByIdSuccess,
  LoadVariantDetailsValueGoldStandardByIdFailure,
  LoadVariantDetailsValueGoldStandardById,
  LoadVariantDetailsValueGoldSlabById,
  LoadVariantDetailsValueGoldSlabByIdSuccess,
  LoadVariantDetailsValueGoldSlabByIdFailure,
  LoadVariantDetailsValueOthersStandardById,
  LoadVariantDetailsValueOthersStandardByIdSuccess,
  LoadVariantDetailsValueOthersSlabById,
  LoadVariantDetailsValueOthersSlabByIdSuccess,
  LoadVariantDetailsValueOthersSlabByIdFailure,
  LoadVariantDetailsWeightGoldStandardByIdSuccess,
  LoadVariantDetailsWeightGoldStandardById,
  LoadVariantDetailsWeightGoldStandardByIdFailure,
  LoadVariantDetailsWeightGoldSlabById,
  LoadVariantDetailsWeightGoldSlabByIdSuccess,
  LoadVariantDetailsWeightGoldSlabByIdFailure,
  LoadVariantDetailsWeightOthersStandardById,
  LoadVariantDetailsWeightOthersStandardByIdSuccess,
  LoadVariantDetailsWeightOthersStandardByIdFailure,
  LoadVariantDetailsWeightOthersSlabById,
  LoadVariantDetailsWeightOthersSlabByIdSuccess,
  LoadVariantDetailsWeightOthersSlabByIdFailure,
  LoadAllSelectedItemCodes,
  LoadAllSelectedItemCodesSuccess,
  LoadAllSelectedItemCodesFailure,
  LoadAllSelectedLocationCodes,
  LoadAllSelectedLocationCodesSuccess,
  LoadAllSelectedLocationCodesFailure
} from './foc-config-actions';

describe('FocConfigurationActions  Action Testing Suite', () => {
  describe('LoadFocConfigurationList Action Test Cases', () => {
    it('should check correct type is used for  LoadFocConfigurationList action ', () => {
      const payload: FocConfigurationListPayload = {
        pageIndex: 0,
        pageSize: 10,
        length: 10
      };
      const searchValue = '';
      const action = new LoadFocConfigurationList(payload, searchValue);
      expect({ ...action }).toEqual({
        type: FocConfigurationActionTypes.LOAD_FOC_CONFIGURATION_LIST,
        payload,
        searchValue
      });
    });
    it('should check correct type is used for  LoadFocConfigurationListSuccess action ', () => {
      const payload: FocConfigurationList = {
        focConfigList: [
          {
            name: 'scheme one',
            description: 'scheme one'
          }
        ],
        totalElements: '1'
      };

      const action = new LoadFocConfigurationListSuccess(payload);

      expect({ ...action }).toEqual({
        type: FocConfigurationActionTypes.LOAD_FOC_CONFIGURATION_LIST_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadFocConfigurationListFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadFocConfigurationListFailure(payload);

      expect({ ...action }).toEqual({
        type: FocConfigurationActionTypes.LOAD_FOC_CONFIGURATION_LIST_FAILURE,
        payload
      });
    });
  });

  describe('UpdateFocSchemeConfiguration Action Test Cases', () => {
    it('should check correct type is used for  UpdateFocSchemeConfiguration action ', () => {
      const payload: SchemeDetails = {
        id: '1',
        clubbingConfigData: {
          data: {
            isExchangeOffer: true,
            isCBO: true,
            isGHS: true,
            isRiva: true,
            isEmpowerment: true,
            isDV: true
          },
          type: 'CLUBBING OFFER'
        },
        description: 'Scheme One',
        grnConfigData: {
          data: {
            noOfDaysBeforeOfferPeriod: '1',
            noOfDaysAfterOfferPeriod: '2',
            utilizationPercent: '3'
          },
          type: 'GRN_CONFIG'
        },
        isActive: true,
        name: 'Scheme One',
        orderConfigData: {
          data: {
            isGoldRateFrozenForCO: true,
            isGoldRateFrozenForAB: true,
            offerPeriodForCO: '1',
            offerPeriodForAB: '2',
            coPercent: '3',
            abPercent: '22'
          },
          type: 'ORDER_CONFIG'
        },
        tepConfigData: {
          data: {
            isEnabled: true,
            tepDetails: [
              {
                durationInDays: '1',
                recoveryPercent: '10'
              }
            ]
          },
          type: 'TEP_CONFIG'
        }
      };
      const action = new UpdateFocSchemeConfiguration(payload);
      expect({ ...action }).toEqual({
        type: FocConfigurationActionTypes.UPDATE_FOC_SCHEME_CONFIGURATION,
        payload
      });
    });
    it('should check correct type is used for UpdateFocSchemeConfigurationSuccess action ', () => {
      const payload: SchemeDetails = {
        id: '1',
        clubbingConfigData: {
          data: {
            isExchangeOffer: true,
            isCBO: true,
            isGHS: true,
            isRiva: true,
            isEmpowerment: true,
            isDV: true
          },
          type: 'CLUBBING OFFER'
        },
        description: 'Scheme One',
        grnConfigData: {
          data: {
            noOfDaysBeforeOfferPeriod: '1',
            noOfDaysAfterOfferPeriod: '2',
            utilizationPercent: '3'
          },
          type: 'GRN_CONFIG'
        },
        isActive: true,
        name: 'Scheme One',
        orderConfigData: {
          data: {
            isGoldRateFrozenForCO: true,
            isGoldRateFrozenForAB: true,
            offerPeriodForCO: '1',
            offerPeriodForAB: '2',
            coPercent: '3',
            abPercent: '22'
          },
          type: 'ORDER_CONFIG'
        },
        tepConfigData: {
          data: {
            isEnabled: true,
            tepDetails: [
              {
                durationInDays: '1',
                recoveryPercent: '10'
              }
            ]
          },
          type: 'TEP_CONFIG'
        }
      };

      const action = new UpdateFocSchemeConfigurationSuccess(payload);

      expect({ ...action }).toEqual({
        type:
          FocConfigurationActionTypes.UPDATE_FOC_SCHEME_CONFIGURATION_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  UpdateFocSchemeConfigurationFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new UpdateFocSchemeConfigurationFailure(payload);

      expect({ ...action }).toEqual({
        type:
          FocConfigurationActionTypes.UPDATE_FOC_SCHEME_CONFIGURATION_FAILURE,
        payload
      });
    });
  });

  describe('SaveFocSchemeConfiguration Action Test Cases', () => {
    it('should check correct type is used for  SaveFocSchemeConfiguration action ', () => {
      const payload: SchemeDetails = {
        id: '1',
        clubbingConfigData: {
          data: {
            isExchangeOffer: true,
            isCBO: true,
            isGHS: true,
            isRiva: true,
            isEmpowerment: true,
            isDV: true
          },
          type: 'CLUBBING OFFER'
        },
        description: 'Scheme One',
        grnConfigData: {
          data: {
            noOfDaysBeforeOfferPeriod: '1',
            noOfDaysAfterOfferPeriod: '2',
            utilizationPercent: '3'
          },
          type: 'GRN_CONFIG'
        },
        isActive: true,
        name: 'Scheme One',
        orderConfigData: {
          data: {
            isGoldRateFrozenForCO: true,
            isGoldRateFrozenForAB: true,
            offerPeriodForCO: '1',
            offerPeriodForAB: '2',
            coPercent: '3',
            abPercent: '22'
          },
          type: 'ORDER_CONFIG'
        },
        tepConfigData: {
          data: {
            isEnabled: true,
            tepDetails: [
              {
                durationInDays: '1',
                recoveryPercent: '10'
              }
            ]
          },
          type: 'TEP_CONFIG'
        }
      };
      const action = new SaveFocSchemeConfiguration(payload);
      expect({ ...action }).toEqual({
        type: FocConfigurationActionTypes.SAVE_FOC_SCHEME_CONFIGURATION,
        payload
      });
    });
    it('should check correct type is used for SaveFocSchemeConfigurationSuccess action ', () => {
      const payload: SchemeDetails = {
        id: '1',
        clubbingConfigData: {
          data: {
            isExchangeOffer: true,
            isCBO: true,
            isGHS: true,
            isRiva: true,
            isEmpowerment: true,
            isDV: true
          },
          type: 'CLUBBING OFFER'
        },
        description: 'Scheme One',
        grnConfigData: {
          data: {
            noOfDaysBeforeOfferPeriod: '1',
            noOfDaysAfterOfferPeriod: '2',
            utilizationPercent: '3'
          },
          type: 'GRN_CONFIG'
        },
        isActive: true,
        name: 'Scheme One',
        orderConfigData: {
          data: {
            isGoldRateFrozenForCO: true,
            isGoldRateFrozenForAB: true,
            offerPeriodForCO: '1',
            offerPeriodForAB: '2',
            coPercent: '3',
            abPercent: '22'
          },
          type: 'ORDER_CONFIG'
        },
        tepConfigData: {
          data: {
            isEnabled: true,
            tepDetails: [
              {
                durationInDays: '1',
                recoveryPercent: '10'
              }
            ]
          },
          type: 'TEP_CONFIG'
        }
      };
      const action = new SaveFocSchemeConfigurationSuccess(payload);

      expect({ ...action }).toEqual({
        type: FocConfigurationActionTypes.SAVE_FOC_SCHEME_CONFIGURATION_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  SaveFocSchemeConfigurationFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SaveFocSchemeConfigurationFailure(payload);

      expect({ ...action }).toEqual({
        type: FocConfigurationActionTypes.SAVE_FOC_SCHEME_CONFIGURATION_FAILURE,
        payload
      });
    });
  });

  describe('SearchConfigBySchemeName Action Test Cases', () => {
    it('should check correct type is used for  SearchConfigBySchemeName action ', () => {
      const payload = 'Scheme One';
      const action = new SearchConfigBySchemeName(payload);
      expect({ ...action }).toEqual({
        type: FocConfigurationActionTypes.SEARCH_CONFIG_BY_SCHEME_NAME,
        payload
      });
    });
    it('should check correct type is used for SaveFocSchemeConfigurationSuccess action ', () => {
      const payload: FocConfigurationList = {
        focConfigList: [
          {
            name: 'Scheme One',
            description: 'Scheme Name'
          }
        ],
        totalElements: '1'
      };
      const action = new SearchConfigBySchemeNameSuccess(payload);

      expect({ ...action }).toEqual({
        type: FocConfigurationActionTypes.SEARCH_CONFIG_BY_SCHEME_NAME_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  SearchConfigBySchemeNameFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SearchConfigBySchemeNameFailure(payload);

      expect({ ...action }).toEqual({
        type: FocConfigurationActionTypes.SEARCH_CONFIG_BY_SCHEME_NAME_FAILURE,
        payload
      });
    });
  });

  describe('LoadFocSchemeConfigurationByConfigId Action Test Cases', () => {
    it('should check correct type is used for  LoadFocSchemeConfigurationByConfigId action ', () => {
      const payload = '1';
      const action = new LoadFocSchemeConfigurationByConfigId(payload);
      expect({ ...action }).toEqual({
        type:
          FocConfigurationActionTypes.LOAD_FOC_SCHEME_CONFIGURATION_BY_CONFIG_ID,
        payload
      });
    });
    it('should check correct type is used for LoadFocSchemeConfigurationByConfigIdSuccess action ', () => {
      const payload: SchemeDetails = {
        id: '1',
        clubbingConfigData: {
          data: {
            isExchangeOffer: true,
            isCBO: true,
            isGHS: true,
            isRiva: true,
            isEmpowerment: true,
            isDV: true
          },
          type: 'CLUBBING OFFER'
        },
        description: 'Scheme One',
        grnConfigData: {
          data: {
            noOfDaysBeforeOfferPeriod: '1',
            noOfDaysAfterOfferPeriod: '2',
            utilizationPercent: '3'
          },
          type: 'GRN_CONFIG'
        },
        isActive: true,
        name: 'Scheme One',
        orderConfigData: {
          data: {
            isGoldRateFrozenForCO: true,
            isGoldRateFrozenForAB: true,
            offerPeriodForCO: '1',
            offerPeriodForAB: '2',
            coPercent: '3',
            abPercent: '22'
          },
          type: 'ORDER_CONFIG'
        },
        tepConfigData: {
          data: {
            isEnabled: true,
            tepDetails: [
              {
                durationInDays: '1',
                recoveryPercent: '10'
              }
            ]
          },
          type: 'TEP_CONFIG'
        }
      };
      const action = new LoadFocSchemeConfigurationByConfigIdSuccess(payload);

      expect({ ...action }).toEqual({
        type:
          FocConfigurationActionTypes.LOAD_FOC_SCHEME_CONFIGURATION_BY_CONFIG_ID_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadFocSchemeConfigurationByConfigIdFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadFocSchemeConfigurationByConfigIdFailure(payload);

      expect({ ...action }).toEqual({
        type:
          FocConfigurationActionTypes.LOAD_FOC_SCHEME_CONFIGURATION_BY_CONFIG_ID_FAILURE,
        payload
      });
    });
  });

  describe('LoadMappedProductGroupsByConfigId Action Test Cases', () => {
    it('should check correct type is used for  LoadMappedProductGroupsByConfigId action ', () => {
      const payload: LoadProductGroupPayload = {
        masterId: '11',
        schemeDetailsId: '22',
        category: 'GOLD_COIN'
      };
      const action = new LoadMappedProductGroupsByConfigId(payload);
      expect({ ...action }).toEqual({
        type:
          FocConfigurationActionTypes.LOAD_MAPPED_PRODUCT_GROUPS_BY_CONFIG_ID,
        payload
      });
    });
    it('should check correct type is used for LoadMappedProductGroupsByConfigIdSuccess action ', () => {
      const payload: ProductGroupMappingOption[] = [
        { id: '76', uuid: '1', description: 'GOLD' }
      ];

      const action = new LoadMappedProductGroupsByConfigIdSuccess(payload);

      expect({ ...action }).toEqual({
        type:
          FocConfigurationActionTypes.LOAD_MAPPED_PRODUCT_GROUPS_BY_CONFIG_ID_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadMappedProductGroupsByConfigIdFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadMappedProductGroupsByConfigIdFailure(payload);

      expect({ ...action }).toEqual({
        type:
          FocConfigurationActionTypes.LOAD_MAPPED_PRODUCT_GROUPS_BY_CONFIG_ID_FAILURE,
        payload
      });
    });
  });

  describe('UpdateProductGroupByConfigId Action Test Cases', () => {
    it('should check correct type is used for  UpdateProductGroupByConfigId action ', () => {
      const payload: SaveProductGroup = {
        masterId: '11',
        schemeDetailsId: '22',
        addProducts: ['76'],
        removeProducts: [],
        category: 'GOLD_COIN'
      };
      const action = new UpdateProductGroupByConfigId(payload);
      expect({ ...action }).toEqual({
        type: FocConfigurationActionTypes.UPDATE_PRODUCT_GROUPS_BY_CONFIG_ID,
        payload
      });
    });
    it('should check correct type is used for UpdateProductGroupByConfigIdSuccess action ', () => {
      const payload: ProductGroupMappingOption[] = [
        { id: '76', uuid: '1', description: 'GOLD' }
      ];

      const action = new UpdateProductGroupByConfigIdSuccess(payload);

      expect({ ...action }).toEqual({
        type:
          FocConfigurationActionTypes.UPDATE_PRODUCT_GROUPS_BY_CONFIG_ID_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  UpdateProductGroupByConfigIdFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new UpdateProductGroupByConfigIdFailure(payload);

      expect({ ...action }).toEqual({
        type:
          FocConfigurationActionTypes.UPDATE_PRODUCT_GROUPS_BY_CONFIG_ID_FAILURE,
        payload
      });
    });
  });

  describe('SaveVariantDetails Action Test Cases', () => {
    it('should check correct type is used for  SaveVariantDetails action ', () => {
      const payload: SaveVariantDetailsPayload = {
        masterId: '1',
        discountType: 'STANDARD',
        addSchemeDetails: [
          {
            category: 'VALUE_BASED',
            focEligibility: 'PRE_DISCOUNT_TAX',
            fromSaleValue: '100',
            isActive: true,
            isMultiple: true,
            isSingle: true,
            itemCode: '',
            itemType: 'GOLD',
            karat: '22',
            offerType: 'STANDARD',
            quantity: '1',
            rowId: '0',
            stdSaleValue: '1000',
            toSaleValue: '200',
            weight: '1'
          }
        ],
        updateSchemeDetails: [],
        deleteSchemeDetails: []
      };
      const action = new SaveVariantDetails(payload);
      expect({ ...action }).toEqual({
        type: FocConfigurationActionTypes.SAVE_VARIANT_DETAILS,
        payload
      });
    });
    it('should check correct type is used for SaveVariantDetailsSuccess action ', () => {
      const payload: VariantDetails = {
        weightBasedVariantDetails: [
          {
            focEligibility: 'PRE_DISCOUNT_TAX',
            id: '1',
            isActive: true,
            isMultiple: true,
            isSingle: true,
            itemCode: '',
            quantity: '1',
            rowId: '0',
            productGroupCount: 10,
            totalFocWt: '11',
            karatage: '22',
            multiplyingValue: '100',
            stdValue: '1',
            slabFrom: '100',
            slabTo: '200'
          }
        ],
        valueBasedVariantDetails: [
          {
            focEligibility: 'PRE_DISCOUNT_TAX',
            id: '1',
            isActive: true,
            isMultiple: true,
            isSingle: true,
            itemCode: '',
            quantity: '1',
            rowId: '0',
            productGroupCount: 10,
            totalFocWt: '11',
            karatage: '22',
            multiplyingValue: '100',
            stdValue: '1',
            slabFrom: '100',
            slabTo: '200'
          }
        ]
      };

      const action = new SaveVariantDetailsSuccess(payload);

      expect({ ...action }).toEqual({
        type: FocConfigurationActionTypes.SAVE_VARIANT_DETAILS_SUCCESS,

        payload
      });
    });
    it('should check correct type is used for  SaveVariantDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SaveVariantDetailsFailure(payload);

      expect({ ...action }).toEqual({
        type: FocConfigurationActionTypes.SAVE_VARIANT_DETAILS_FAILURE,
        payload
      });
    });
  });
  describe('LoadVariantDetailsById Action Test Cases', () => {
    it('should check correct type is used for  LoadVariantDetailsById action ', () => {
      const payload: LoadVariantDetailsPayload = {
        id: '1'
      };
      const action = new LoadVariantDetailsById(payload);
      expect({ ...action }).toEqual({
        type: FocConfigurationActionTypes.LOAD_VARIANT_DEATAILS_BY_ID,
        payload
      });
    });
    it('should check correct type is used for LoadVariantDetailsByIdSuccess action ', () => {
      const payload: VariantDetails = {
        weightBasedVariantDetails: [
          {
            focEligibility: 'PRE_DISCOUNT_TAX',
            id: '1',
            isActive: true,
            isMultiple: true,
            isSingle: true,
            itemCode: '',
            quantity: '1',
            rowId: '0',
            productGroupCount: 10,
            totalFocWt: '11',
            karatage: '22',
            multiplyingValue: '100',
            stdValue: '1',
            slabFrom: '100',
            slabTo: '200'
          }
        ],
        valueBasedVariantDetails: [
          {
            focEligibility: 'PRE_DISCOUNT_TAX',
            id: '1',
            isActive: true,
            isMultiple: true,
            isSingle: true,
            itemCode: '',
            quantity: '1',
            rowId: '0',
            productGroupCount: 10,
            totalFocWt: '11',
            karatage: '22',
            multiplyingValue: '100',
            stdValue: '1',
            slabFrom: '100',
            slabTo: '200'
          }
        ]
      };

      const action = new LoadVariantDetailsByIdSuccess(payload);

      expect({ ...action }).toEqual({
        type: FocConfigurationActionTypes.LOAD_VARIANT_DEATAILS_BY_ID_SUCCESS,

        payload
      });
    });
    it('should check correct type is used for  LoadVariantDetailsByIdFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadVariantDetailsByIdFailure(payload);

      expect({ ...action }).toEqual({
        type: FocConfigurationActionTypes.LOAD_VARIANT_DEATAILS_BY_ID_FAILURE,
        payload
      });
    });
  });

  describe('LoadRangeWeight Action Test Cases', () => {
    it('should check correct type is used for  LoadRangeWeight action ', () => {
      const action = new LoadRangeWeight();
      expect({ ...action }).toEqual({
        type: FocConfigurationActionTypes.LOAD_RANGE_WEIGHT
      });
    });
    it('should check correct type is used for LoadRangeWeightSuccesss action ', () => {
      const payload = ['100-200'];

      const action = new LoadRangeWeightSuccesss(payload);

      expect({ ...action }).toEqual({
        type: FocConfigurationActionTypes.LOAD_RANGE_WEIGHT_SUCCESS,

        payload
      });
    });
    it('should check correct type is used for  LoadRangeWeightFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadRangeWeightFailure(payload);

      expect({ ...action }).toEqual({
        type: FocConfigurationActionTypes.LOAD_RANGE_WEIGHT_FAILURE,
        payload
      });
    });
  });

  describe('LoadLocationById Action Test Cases', () => {
    it('should check correct type is used for  LoadLocationById action ', () => {
      const payload: FocLocationListPayload = {
        pageSize: 10,
        pageIndex: 1,
        length: 100,
        id: '1'
      };
      const action = new LoadLocationById(payload);
      expect({ ...action }).toEqual({
        type: FocConfigurationActionTypes.LOAD_MAPPED_LOCATIONS_BY_ID,
        payload
      });
    });
    it('should check correct type is used for LoadLocationByIdSuccess action ', () => {
      const payload: LocationListSuccessPayload = {
        totalLocations: 100,
        locationList: [
          {
            locationCode: 'URB',
            description: 'URB',
            subBrandCode: 'Mia',
            startDate: '10',
            endDate: '12',
            isActive: 'isActive',
            id: '1'
          }
        ]
      };

      const action = new LoadLocationByIdSuccess(payload);

      expect({ ...action }).toEqual({
        type: FocConfigurationActionTypes.LOAD_MAPPED_LOCATIONS_BY_ID_SUCCESS,

        payload
      });
    });
    it('should check correct type is used for  LoadLocationByIdFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadLocationByIdFailure(payload);

      expect({ ...action }).toEqual({
        type: FocConfigurationActionTypes.LOAD_MAPPED_LOCATIONS_BY_ID_FAILURE,
        payload
      });
    });
  });

  describe('UpdateLocationById Action Test Cases', () => {
    it('should check correct type is used for  UpdateLocationById action ', () => {
      const payload: SaveLocationPayload = {
        id: '1',
        saveLocationPayload: {
          addLocations: ['URB']
        }
      };
      const action = new UpdateLocationById(payload);
      expect({ ...action }).toEqual({
        type: FocConfigurationActionTypes.UPDATE_LOCATIONS_BY_ID,
        payload
      });
    });
    it('should check correct type is used for UpdateLocationByIdSuccess action ', () => {
      const action = new UpdateLocationByIdSuccess();

      expect({ ...action }).toEqual({
        type: FocConfigurationActionTypes.UPDATE_LOCATIONS_BY_ID_SUCCESS
      });
    });
    it('should check correct type is used for  UpdateLocationByIdFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new UpdateLocationByIdFailure(payload);

      expect({ ...action }).toEqual({
        type: FocConfigurationActionTypes.UPDATE_LOCATIONS_BY_ID_FAILURE,
        payload
      });
    });
  });

  describe('LoadFocItemCodes Action Test Cases', () => {
    it('should check correct type is used for  LoadFocItemCodes action ', () => {
      const payload: FOCItemCodesPayload = {
        excludeProductCategories: [],
        excludeProductGroups: [],
        includeProductCategories: [],
        includeProductGroups: ['74'],
        isFocItem: true
      };
      const action = new LoadFocItemCodes(payload);
      expect({ ...action }).toEqual({
        type: FocConfigurationActionTypes.LOAD_FOC_ITEM_CODES,
        payload
      });
    });
    it('should check correct type is used for LoadFocItemCodesSuccess action ', () => {
      const payload: FOCItemCodes[] = [
        {
          itemCode: '53FCDS2222AE0',
          stdWeight: 32,
          karat: 22
        }
      ];
      const action = new LoadFocItemCodesSuccess(payload);

      expect({ ...action }).toEqual({
        type: FocConfigurationActionTypes.LOAD_FOC_ITEM_CODES_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadFocItemCodesFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadFocItemCodesFailure(payload);

      expect({ ...action }).toEqual({
        type: FocConfigurationActionTypes.LOAD_FOC_ITEM_CODES_FAILURE,
        payload
      });
    });
  });

  describe('LoadMappedFocItemsById Action Test Cases', () => {
    it('should check correct type is used for  LoadMappedFocItemsById action ', () => {
      const payload: FocItemsPayload = {
        id: '1',
        pageIndex: 1,
        pageSize: 10
      };
      const action = new LoadMappedFocItemsById(payload);
      expect({ ...action }).toEqual({
        type: FocConfigurationActionTypes.LOAD_MAPPED_FOC_ITEMS_BY_ID,
        payload
      });
    });
    it('should check correct type is used for LoadMappedFocItemsByIdSuccess action ', () => {
      const payload: FocItemsResponse = {
        items: [
          {
            itemCode: '53FCDS2222AE0',
            stdWeight: 32,
            karat: 22
          }
        ],
        totalElements: 1
      };
      const action = new LoadMappedFocItemsByIdSuccess(payload);

      expect({ ...action }).toEqual({
        type: FocConfigurationActionTypes.LOAD_MAPPED_FOC_ITEMS_BY_ID_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadMappedFocItemsByIdFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadMappedFocItemsByIdFailure(payload);

      expect({ ...action }).toEqual({
        type: FocConfigurationActionTypes.LOAD_MAPPED_FOC_ITEMS_BY_ID_FAILURE,
        payload
      });
    });
  });
  describe('SaveFocItems Action Test Cases', () => {
    it('should check correct type is used for  SaveFocItems action ', () => {
      const payload: FocItemsSavePayload = {
        id: '1',
        savePayload: {
          addItems: [
            {
              itemCode: '53FCDS2222AE0',
              stdWeight: 32,
              karat: 22
            }
          ],
          removeItems: []
        }
      };
      const action = new SaveFocItems(payload);
      expect({ ...action }).toEqual({
        type: FocConfigurationActionTypes.SAVE_FOC_ITEMS,
        payload
      });
    });
    it('should check correct type is used for SaveFocItemsSuccess action ', () => {
      const action = new SaveFocItemsSuccess();

      expect({ ...action }).toEqual({
        type: FocConfigurationActionTypes.SAVE_FOC_ITEMS_SUCCESS
      });
    });
    it('should check correct type is used for  SaveFocItemsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SaveFocItemsFailure(payload);

      expect({ ...action }).toEqual({
        type: FocConfigurationActionTypes.SAVE_FOC_ITEMS_FAILURE,
        payload
      });
    });
  });

  describe('SearchFocItem Action Test Cases', () => {
    it('should check correct type is used for  SearchFocItem action ', () => {
      const payload: { configId: string; itemCode: string } = {
        configId: '1',
        itemCode: '5FSCDDCD000'
      };
      const action = new SearchFocItem(payload);
      expect({ ...action }).toEqual({
        type: FocConfigurationActionTypes.SEARCH_FOC_ITEM,
        payload
      });
    });
    it('should check correct type is used for SearchFocItemSuccess action ', () => {
      const payload: FOCItemCodes[] = [
        {
          itemCode: '53FCDS2222AE0',
          stdWeight: 32,
          karat: 22
        }
      ];
      const action = new SearchFocItemSuccess(payload);

      expect({ ...action }).toEqual({
        type: FocConfigurationActionTypes.SEARCH_FOC_ITEM_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  SearchFocItemFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SearchFocItemFailure(payload);

      expect({ ...action }).toEqual({
        type: FocConfigurationActionTypes.SEARCH_FOC_ITEM_FAILURE,
        payload
      });
    });
  });

  describe('SearchLocationCode Action Test Cases', () => {
    it('should check correct type is used for  SearchLocationCode action ', () => {
      const payload: { configId: string; locationCode: string } = {
        configId: '1',
        locationCode: '5FSCDDCD000'
      };
      const action = new SearchLocationCode(payload);
      expect({ ...action }).toEqual({
        type: FocConfigurationActionTypes.SEARCH_LOCATION_CODE,
        payload
      });
    });
    it('should check correct type is used for SearchLocationCodeSuccess action ', () => {
      const payload: LocationListSuccessPayload = {
        totalLocations: 1,
        locationList: [
          {
            locationCode: 'URB',
            description: 'URB',
            subBrandCode: 'Mia',
            startDate: '10',
            endDate: '12',
            isActive: 'isActive',
            id: '1'
          }
        ]
      };
      const action = new SearchLocationCodeSuccess(payload);

      expect({ ...action }).toEqual({
        type: FocConfigurationActionTypes.SEARCH_LOCATION_CODE_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  SearchLocationCodeFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SearchLocationCodeFailure(payload);

      expect({ ...action }).toEqual({
        type: FocConfigurationActionTypes.SEARCH_LOCATION_CODE_FAILURE,
        payload
      });
    });
  });

  describe('PublishFocScheme Action Test Cases', () => {
    it('should check correct type is used for  PublishFocScheme action ', () => {
      const payload = '1';
      const action = new PublishFocScheme(payload);
      expect({ ...action }).toEqual({
        type: FocConfigurationActionTypes.PUBLISH_FOC_SCHEME,
        payload
      });
    });
    it('should check correct type is used for PublishFocSchemeSuccesss action ', () => {
      const action = new PublishFocSchemeSuccesss();

      expect({ ...action }).toEqual({
        type: FocConfigurationActionTypes.PUBLISH_FOC_SCHEME_SUCCESS
      });
    });
    it('should check correct type is used for  PublishFocSchemeFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new PublishFocSchemeFailure(payload);

      expect({ ...action }).toEqual({
        type: FocConfigurationActionTypes.PUBLISH_FOC_SCHEME_FAILURE,
        payload
      });
    });
  });

  describe('LoadVariantDetailsValueGoldStandardById Action Test Cases', () => {
    it('should check correct type is used for  LoadVariantDetailsValueGoldStandardById action ', () => {
      const payload = '1';
      const action = new LoadVariantDetailsValueGoldStandardById(payload);
      expect({ ...action }).toEqual({
        type:
          FocConfigurationActionTypes.LOAD_VARIANT_DEATAILS_VALUE_GOLD_STANDARD_BY_ID,
        payload
      });
    });
    it('should check correct type is used for LoadVariantDetailsValueGoldStandardByIdSuccess action ', () => {
      const payload: VariantDetails = {
        weightBasedVariantDetails: [
          {
            focEligibility: 'PRE_DISCOUNT_TAX',
            id: '1',
            isActive: true,
            isMultiple: true,
            isSingle: true,
            itemCode: '',
            quantity: '1',
            rowId: '0',
            productGroupCount: 10,
            totalFocWt: '11',
            karatage: '22',
            multiplyingValue: '100',
            stdValue: '1',
            slabFrom: '100',
            slabTo: '200'
          }
        ],
        valueBasedVariantDetails: [
          {
            focEligibility: 'PRE_DISCOUNT_TAX',
            id: '1',
            isActive: true,
            isMultiple: true,
            isSingle: true,
            itemCode: '',
            quantity: '1',
            rowId: '0',
            productGroupCount: 10,
            totalFocWt: '11',
            karatage: '22',
            multiplyingValue: '100',
            stdValue: '1',
            slabFrom: '100',
            slabTo: '200'
          }
        ]
      };
      const action = new LoadVariantDetailsValueGoldStandardByIdSuccess(
        payload
      );

      expect({ ...action }).toEqual({
        type:
          FocConfigurationActionTypes.LOAD_VARIANT_DEATAILS_VALUE_GOLD_STANDARD_BY_ID_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadVariantDetailsValueGoldStandardByIdFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadVariantDetailsValueGoldStandardByIdFailure(
        payload
      );

      expect({ ...action }).toEqual({
        type:
          FocConfigurationActionTypes.LOAD_VARIANT_DEATAILS_VALUE_GOLD_STANDARD_BY_ID_FAILURE,
        payload
      });
    });
  });

  describe('LoadVariantDetailsValueGoldSlabById Action Test Cases', () => {
    it('should check correct type is used for  LoadVariantDetailsValueGoldSlabById action ', () => {
      const payload = '1';
      const action = new LoadVariantDetailsValueGoldSlabById(payload);
      expect({ ...action }).toEqual({
        type:
          FocConfigurationActionTypes.LOAD_VARIANT_DEATAILS_VALUE_GOLD_SLAB_BY_ID,
        payload
      });
    });
    it('should check correct type is used for LoadVariantDetailsValueGoldSlabByIdSuccess action ', () => {
      const payload: VariantDetails = {
        weightBasedVariantDetails: [
          {
            focEligibility: 'PRE_DISCOUNT_TAX',
            id: '1',
            isActive: true,
            isMultiple: true,
            isSingle: true,
            itemCode: '',
            quantity: '1',
            rowId: '0',
            productGroupCount: 10,
            totalFocWt: '11',
            karatage: '22',
            multiplyingValue: '100',
            stdValue: '1',
            slabFrom: '100',
            slabTo: '200'
          }
        ],
        valueBasedVariantDetails: [
          {
            focEligibility: 'PRE_DISCOUNT_TAX',
            id: '1',
            isActive: true,
            isMultiple: true,
            isSingle: true,
            itemCode: '',
            quantity: '1',
            rowId: '0',
            productGroupCount: 10,
            totalFocWt: '11',
            karatage: '22',
            multiplyingValue: '100',
            stdValue: '1',
            slabFrom: '100',
            slabTo: '200'
          }
        ]
      };
      const action = new LoadVariantDetailsValueGoldSlabByIdSuccess(payload);

      expect({ ...action }).toEqual({
        type:
          FocConfigurationActionTypes.LOAD_VARIANT_DEATAILS_VALUE_GOLD_SLAB_BY_ID_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadVariantDetailsValueGoldSlabByIdFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadVariantDetailsValueGoldSlabByIdFailure(payload);

      expect({ ...action }).toEqual({
        type:
          FocConfigurationActionTypes.LOAD_VARIANT_DEATAILS_VALUE_GOLD_SLAB_BY_ID_FAILURE,
        payload
      });
    });
  });

  describe('LoadVariantDetailsValueOthersStandardById Action Test Cases', () => {
    it('should check correct type is used for  LoadVariantDetailsValueOthersStandardById action ', () => {
      const payload = '1';
      const action = new LoadVariantDetailsValueOthersStandardById(payload);
      expect({ ...action }).toEqual({
        type:
          FocConfigurationActionTypes.LOAD_VARIANT_DEATAILS_VALUE_OTHERS_STANDARD_BY_ID,
        payload
      });
    });
    it('should check correct type is used for LoadVariantDetailsValueOthersStandardByIdSuccess action ', () => {
      const payload: VariantDetails = {
        weightBasedVariantDetails: [
          {
            focEligibility: 'PRE_DISCOUNT_TAX',
            id: '1',
            isActive: true,
            isMultiple: true,
            isSingle: true,
            itemCode: '',
            quantity: '1',
            rowId: '0',
            productGroupCount: 10,
            totalFocWt: '11',
            karatage: '22',
            multiplyingValue: '100',
            stdValue: '1',
            slabFrom: '100',
            slabTo: '200'
          }
        ],
        valueBasedVariantDetails: [
          {
            focEligibility: 'PRE_DISCOUNT_TAX',
            id: '1',
            isActive: true,
            isMultiple: true,
            isSingle: true,
            itemCode: '',
            quantity: '1',
            rowId: '0',
            productGroupCount: 10,
            totalFocWt: '11',
            karatage: '22',
            multiplyingValue: '100',
            stdValue: '1',
            slabFrom: '100',
            slabTo: '200'
          }
        ]
      };
      const action = new LoadVariantDetailsValueOthersStandardByIdSuccess(
        payload
      );

      expect({ ...action }).toEqual({
        type:
          FocConfigurationActionTypes.LOAD_VARIANT_DEATAILS_VALUE_OTHERS_STANDARD_BY_ID_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadVariantDetailsValueGoldSlabByIdFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadVariantDetailsValueGoldSlabByIdFailure(payload);

      expect({ ...action }).toEqual({
        type:
          FocConfigurationActionTypes.LOAD_VARIANT_DEATAILS_VALUE_GOLD_SLAB_BY_ID_FAILURE,
        payload
      });
    });
  });

  describe('LoadVariantDetailsValueOthersSlabById Action Test Cases', () => {
    it('should check correct type is used for  LoadVariantDetailsValueOthersSlabById action ', () => {
      const payload = '1';
      const action = new LoadVariantDetailsValueOthersSlabById(payload);
      expect({ ...action }).toEqual({
        type:
          FocConfigurationActionTypes.LOAD_VARIANT_DEATAILS_VALUE_OTHERS_SLAB_BY_ID,
        payload
      });
    });
    it('should check correct type is used for LoadVariantDetailsValueOthersSlabByIdSuccess action ', () => {
      const payload: VariantDetails = {
        weightBasedVariantDetails: [
          {
            focEligibility: 'PRE_DISCOUNT_TAX',
            id: '1',
            isActive: true,
            isMultiple: true,
            isSingle: true,
            itemCode: '',
            quantity: '1',
            rowId: '0',
            productGroupCount: 10,
            totalFocWt: '11',
            karatage: '22',
            multiplyingValue: '100',
            stdValue: '1',
            slabFrom: '100',
            slabTo: '200'
          }
        ],
        valueBasedVariantDetails: [
          {
            focEligibility: 'PRE_DISCOUNT_TAX',
            id: '1',
            isActive: true,
            isMultiple: true,
            isSingle: true,
            itemCode: '',
            quantity: '1',
            rowId: '0',
            productGroupCount: 10,
            totalFocWt: '11',
            karatage: '22',
            multiplyingValue: '100',
            stdValue: '1',
            slabFrom: '100',
            slabTo: '200'
          }
        ]
      };
      const action = new LoadVariantDetailsValueOthersSlabByIdSuccess(payload);

      expect({ ...action }).toEqual({
        type:
          FocConfigurationActionTypes.LOAD_VARIANT_DEATAILS_VALUE_OTHERS_SLAB_BY_ID_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadVariantDetailsValueOthersSlabByIdFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadVariantDetailsValueOthersSlabByIdFailure(payload);

      expect({ ...action }).toEqual({
        type:
          FocConfigurationActionTypes.LOAD_VARIANT_DEATAILS_VALUE_OTHERS_SLAB_BY_ID_FAILURE,
        payload
      });
    });
  });

  describe('LoadVariantDetailsWeightGoldStandardById Action Test Cases', () => {
    it('should check correct type is used for  LoadVariantDetailsWeightGoldStandardById action ', () => {
      const payload = '1';
      const action = new LoadVariantDetailsWeightGoldStandardById(payload);
      expect({ ...action }).toEqual({
        type:
          FocConfigurationActionTypes.LOAD_VARIANT_DEATAILS_WEIGHT_GOLD_STANDARD_BY_ID,
        payload
      });
    });
    it('should check correct type is used for LoadVariantDetailsWeightGoldStandardByIdSuccess action ', () => {
      const payload: VariantDetails = {
        weightBasedVariantDetails: [
          {
            focEligibility: 'PRE_DISCOUNT_TAX',
            id: '1',
            isActive: true,
            isMultiple: true,
            isSingle: true,
            itemCode: '',
            quantity: '1',
            rowId: '0',
            productGroupCount: 10,
            totalFocWt: '11',
            karatage: '22',
            multiplyingValue: '100',
            stdValue: '1',
            slabFrom: '100',
            slabTo: '200'
          }
        ],
        valueBasedVariantDetails: [
          {
            focEligibility: 'PRE_DISCOUNT_TAX',
            id: '1',
            isActive: true,
            isMultiple: true,
            isSingle: true,
            itemCode: '',
            quantity: '1',
            rowId: '0',
            productGroupCount: 10,
            totalFocWt: '11',
            karatage: '22',
            multiplyingValue: '100',
            stdValue: '1',
            slabFrom: '100',
            slabTo: '200'
          }
        ]
      };
      const action = new LoadVariantDetailsWeightGoldStandardByIdSuccess(
        payload
      );

      expect({ ...action }).toEqual({
        type:
          FocConfigurationActionTypes.LOAD_VARIANT_DEATAILS_WEIGHT_GOLD_STANDARD_BY_ID_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadVariantDetailsWeightGoldStandardByIdFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadVariantDetailsWeightGoldStandardByIdFailure(
        payload
      );

      expect({ ...action }).toEqual({
        type:
          FocConfigurationActionTypes.LOAD_VARIANT_DEATAILS_WEIGHT_GOLD_STANDARD_BY_ID_FAILURE,
        payload
      });
    });
  });

  describe('LoadVariantDetailsWeightGoldSlabById Action Test Cases', () => {
    it('should check correct type is used for  LoadVariantDetailsWeightGoldSlabById action ', () => {
      const payload = '1';
      const action = new LoadVariantDetailsWeightGoldSlabById(payload);
      expect({ ...action }).toEqual({
        type:
          FocConfigurationActionTypes.LOAD_VARIANT_DEATAILS_WEIGHT_GOLD_SLAB_BY_ID,
        payload
      });
    });
    it('should check correct type is used for LoadVariantDetailsWeightGoldSlabByIdSuccess action ', () => {
      const payload: VariantDetails = {
        weightBasedVariantDetails: [
          {
            focEligibility: 'PRE_DISCOUNT_TAX',
            id: '1',
            isActive: true,
            isMultiple: true,
            isSingle: true,
            itemCode: '',
            quantity: '1',
            rowId: '0',
            productGroupCount: 10,
            totalFocWt: '11',
            karatage: '22',
            multiplyingValue: '100',
            stdValue: '1',
            slabFrom: '100',
            slabTo: '200'
          }
        ],
        valueBasedVariantDetails: [
          {
            focEligibility: 'PRE_DISCOUNT_TAX',
            id: '1',
            isActive: true,
            isMultiple: true,
            isSingle: true,
            itemCode: '',
            quantity: '1',
            rowId: '0',
            productGroupCount: 10,
            totalFocWt: '11',
            karatage: '22',
            multiplyingValue: '100',
            stdValue: '1',
            slabFrom: '100',
            slabTo: '200'
          }
        ]
      };
      const action = new LoadVariantDetailsWeightGoldSlabByIdSuccess(payload);

      expect({ ...action }).toEqual({
        type:
          FocConfigurationActionTypes.LOAD_VARIANT_DEATAILS_WEIGHT_GOLD_SLAB_BY_ID_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadVariantDetailsWeightGoldSlabByIdFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadVariantDetailsWeightGoldSlabByIdFailure(payload);

      expect({ ...action }).toEqual({
        type:
          FocConfigurationActionTypes.LOAD_VARIANT_DEATAILS_WEIGHT_GOLD_SLAB_BY_ID_FAILURE,
        payload
      });
    });
  });

  describe('LoadVariantDetailsWeightOthersStandardById Action Test Cases', () => {
    it('should check correct type is used for  LoadVariantDetailsWeightOthersStandardById action ', () => {
      const payload = '1';
      const action = new LoadVariantDetailsWeightOthersStandardById(payload);
      expect({ ...action }).toEqual({
        type:
          FocConfigurationActionTypes.LOAD_VARIANT_DEATAILS_WEIGHT_OTHERS_STANDARD_BY_ID,
        payload
      });
    });
    it('should check correct type is used for LoadVariantDetailsWeightOthersStandardByIdSuccess action ', () => {
      const payload: VariantDetails = {
        weightBasedVariantDetails: [
          {
            focEligibility: 'PRE_DISCOUNT_TAX',
            id: '1',
            isActive: true,
            isMultiple: true,
            isSingle: true,
            itemCode: '',
            quantity: '1',
            rowId: '0',
            productGroupCount: 10,
            totalFocWt: '11',
            karatage: '22',
            multiplyingValue: '100',
            stdValue: '1',
            slabFrom: '100',
            slabTo: '200'
          }
        ],
        valueBasedVariantDetails: [
          {
            focEligibility: 'PRE_DISCOUNT_TAX',
            id: '1',
            isActive: true,
            isMultiple: true,
            isSingle: true,
            itemCode: '',
            quantity: '1',
            rowId: '0',
            productGroupCount: 10,
            totalFocWt: '11',
            karatage: '22',
            multiplyingValue: '100',
            stdValue: '1',
            slabFrom: '100',
            slabTo: '200'
          }
        ]
      };
      const action = new LoadVariantDetailsWeightOthersStandardByIdSuccess(
        payload
      );

      expect({ ...action }).toEqual({
        type:
          FocConfigurationActionTypes.LOAD_VARIANT_DEATAILS_WEIGHT_OTHERS_STANDARD_BY_ID_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadVariantDetailsWeightOthersStandardByIdFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadVariantDetailsWeightOthersStandardByIdFailure(
        payload
      );

      expect({ ...action }).toEqual({
        type:
          FocConfigurationActionTypes.LOAD_VARIANT_DEATAILS_WEIGHT_OTHERS_STANDARD_BY_ID_FAILURE,
        payload
      });
    });
  });

  describe('LoadVariantDetailsWeightOthersSlabById Action Test Cases', () => {
    it('should check correct type is used for  LoadVariantDetailsWeightOthersSlabById action ', () => {
      const payload = '1';
      const action = new LoadVariantDetailsWeightOthersSlabById(payload);
      expect({ ...action }).toEqual({
        type:
          FocConfigurationActionTypes.LOAD_VARIANT_DEATAILS_WEIGHT_OTHERS_SLAB_BY_ID,
        payload
      });
    });
    it('should check correct type is used for LoadVariantDetailsWeightOthersSlabByIdSuccess action ', () => {
      const payload: VariantDetails = {
        weightBasedVariantDetails: [
          {
            focEligibility: 'PRE_DISCOUNT_TAX',
            id: '1',
            isActive: true,
            isMultiple: true,
            isSingle: true,
            itemCode: '',
            quantity: '1',
            rowId: '0',
            productGroupCount: 10,
            totalFocWt: '11',
            karatage: '22',
            multiplyingValue: '100',
            stdValue: '1',
            slabFrom: '100',
            slabTo: '200'
          }
        ],
        valueBasedVariantDetails: [
          {
            focEligibility: 'PRE_DISCOUNT_TAX',
            id: '1',
            isActive: true,
            isMultiple: true,
            isSingle: true,
            itemCode: '',
            quantity: '1',
            rowId: '0',
            productGroupCount: 10,
            totalFocWt: '11',
            karatage: '22',
            multiplyingValue: '100',
            stdValue: '1',
            slabFrom: '100',
            slabTo: '200'
          }
        ]
      };
      const action = new LoadVariantDetailsWeightOthersSlabByIdSuccess(payload);

      expect({ ...action }).toEqual({
        type:
          FocConfigurationActionTypes.LOAD_VARIANT_DEATAILS_WEIGHT_OTHERS_SLAB_BY_ID_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadVariantDetailsWeightOthersSlabByIdFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadVariantDetailsWeightOthersSlabByIdFailure(payload);

      expect({ ...action }).toEqual({
        type:
          FocConfigurationActionTypes.LOAD_VARIANT_DEATAILS_WEIGHT_OTHERS_SLAB_BY_ID_FAILURE,
        payload
      });
    });
  });

  describe('LoadAllSelectedItemCodes Action Test Cases', () => {
    it('should check correct type is used for  LoadAllSelectedItemCodes action ', () => {
      const payload: FocItemsPayload = {
        id: '1',
        pageIndex: 1,
        pageSize: 10
      };
      const action = new LoadAllSelectedItemCodes(payload);
      expect({ ...action }).toEqual({
        type: FocConfigurationActionTypes.LOAD_ALL_SELECTED_ITEM_CODES,
        payload
      });
    });
    it('should check correct type is used for LoadAllSelectedItemCodesSuccess action ', () => {
      const payload: FOCItemCodes[] = [
        {
          itemCode: '53FCDS2222AE0',
          stdWeight: 32,
          karat: 22
        }
      ];
      const action = new LoadAllSelectedItemCodesSuccess(payload);

      expect({ ...action }).toEqual({
        type: FocConfigurationActionTypes.LOAD_ALL_SELECTED_ITEM_CODES_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadAllSelectedItemCodesFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadAllSelectedItemCodesFailure(payload);

      expect({ ...action }).toEqual({
        type: FocConfigurationActionTypes.LOAD_ALL_SELECTED_ITEM_CODES_FAILURE,
        payload
      });
    });
  });

  describe('LoadAllSelectedLocationCodes Action Test Cases', () => {
    it('should check correct type is used for  LoadAllSelectedLocationCodes action ', () => {
      const payload: FocLocationListPayload = {
        pageSize: 10,
        pageIndex: 1,
        length: 100,
        id: '1'
      };
      const action = new LoadAllSelectedLocationCodes(payload);
      expect({ ...action }).toEqual({
        type: FocConfigurationActionTypes.LOAD_ALL_SELECTED_LOCATION_CODES,
        payload
      });
    });
    it('should check correct type is used for LoadAllSelectedLocationCodesSuccess action ', () => {
      const payload: LocationListSuccessPayload = {
        totalLocations: 100,
        locationList: [
          {
            locationCode: 'URB',
            description: 'URB',
            subBrandCode: 'Mia',
            startDate: '10',
            endDate: '12',
            isActive: 'isActive',
            id: '1'
          }
        ]
      };
      const action = new LoadAllSelectedLocationCodesSuccess(payload);

      expect({ ...action }).toEqual({
        type:
          FocConfigurationActionTypes.LOAD_ALL_SELECTED_LOCATION_CODES_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadAllSelectedLocationCodesFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadAllSelectedLocationCodesFailure(payload);

      expect({ ...action }).toEqual({
        type:
          FocConfigurationActionTypes.LOAD_ALL_SELECTED_LOCATION_CODES_FAILURE,
        payload
      });
    });
  });
  describe('LoadReset Action Test Cases', () => {
    it('should check correct type is used for  LoadReset action ', () => {
      const action = new LoadReset();
      expect({ ...action }).toEqual({
        type: FocConfigurationActionTypes.LOAD_RESET
      });
    });
  });
});
