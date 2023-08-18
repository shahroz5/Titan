//you should simply assert that you get the right state given the provided inputs.

import * as actions from './foc-config-actions';

import {
  FocConfigurationListPayload,
  FocConfigurationList,
  SchemeDetails,
  LoadProductGroupPayload,
  ProductGroupMappingOption,
  SaveProductGroup,
  SaveVariantDetailsPayload,
  VariantDetails,
  LoadVariantDetailsPayload,
  FocLocationListPayload,
  LocationListSuccessPayload,
  SaveLocationPayload,
  FOCItemCodesPayload,
  FOCItemCodes,
  FocItemsResponse,
  FocItemsPayload,
  FocItemsSavePayload
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { focConfigurationReducer, initialState } from './foc-config-reducer';

describe('focConfigurationReducer reducer Testing Suite', () => {
  const testState = initialState;
  const variantDetails: VariantDetails = {
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
  describe('Testing LoadFocConfigurationList ', () => {
    beforeEach(() => {});
    it('Load LoadFocConfigurationList should set the isLoading to true', () => {
      const payload: FocConfigurationListPayload = {
        pageIndex: 0,
        pageSize: 10,
        length: 10
      };

      const action = new actions.LoadFocConfigurationList(payload);

      const result = focConfigurationReducer(testState, action);

      expect(result.isLoading).toBe(true);
    });
    it('LoadFocConfigurationListSuccess should return list of Scheme configs', () => {
      const payload: FocConfigurationList = {
        focConfigList: [
          {
            name: 'scheme one',
            description: 'scheme one'
          }
        ],
        totalElements: '1'
      };

      const action = new actions.LoadFocConfigurationListSuccess(payload);

      const result = focConfigurationReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.focConfigList.length).toBe(1);
    });
    it('LoadFocConfigurationListFailure should return error', () => {
      const action = new actions.LoadFocConfigurationListFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result = focConfigurationReducer(testState, action);

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing UpdateFocSchemeConfiguration Functionality ', () => {
    beforeEach(() => {});
    it('UpdateFocSchemeConfiguration ', () => {
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
      const action = new actions.UpdateFocSchemeConfiguration(payload);

      const result = focConfigurationReducer(testState, action);

      expect(result.isLoading).toBe(true);
    });
    it('UpdateFocSchemeConfigurationSuccess should update the Scheme Details', () => {
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

      const action = new actions.UpdateFocSchemeConfigurationSuccess(payload);

      const result = focConfigurationReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.schemeDetails).toBe(payload);
    });
    it('UpdateFocSchemeConfigurationFailure should return error', () => {
      const action = new actions.UpdateFocSchemeConfigurationFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result = focConfigurationReducer(testState, action);

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing SaveFocSchemeConfiguration ', () => {
    beforeEach(() => {});
    it('SaveFocSchemeConfiguration should set isLoading property to true ', () => {
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
      const action = new actions.SaveFocSchemeConfiguration(payload);

      const result = focConfigurationReducer(initialState, action);

      expect(result.isLoading).toBe(true);
    });
    it('SaveFocSchemeConfigurationSuccess should s return the saved scheme details', () => {
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
      const action = new actions.SaveFocSchemeConfigurationSuccess(payload);

      const result = focConfigurationReducer(initialState, action);

      expect(result.hasSaved).toBe(true);

      expect(result.isLoading).toBe(false);
    });
    it('SaveFocSchemeConfigurationFailure should return error', () => {
      const action = new actions.SaveFocSchemeConfigurationFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result = focConfigurationReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing SearchConfigBySchemeName ', () => {
    beforeEach(() => {});
    it('SearchConfigBySchemeName should set the isloading true', () => {
      const payload = 'Scheme One';

      const action = new actions.SearchConfigBySchemeName(payload);

      const result = focConfigurationReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(true);
    });
    it('SearchConfigBySchemeNameSuccess should return the searched scheme ', () => {
      const payload: FocConfigurationList = {
        focConfigList: [
          {
            name: 'Scheme One',
            description: 'Scheme Name'
          }
        ],
        totalElements: '1'
      };
      const action = new actions.SearchConfigBySchemeNameSuccess(payload);

      const result = focConfigurationReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.focConfigList.length).toEqual(1);
    });
    it('SearchConfigBySchemeNameFailure should return error', () => {
      const action = new actions.SearchConfigBySchemeNameFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result = focConfigurationReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadFocSchemeConfigurationByConfigId Functionality ', () => {
    beforeEach(() => {});
    it('LoadFocSchemeConfigurationByConfigId should return scheme details', () => {
      const payload = '1';
      const action = new actions.LoadFocSchemeConfigurationByConfigId(payload);

      const result = focConfigurationReducer(initialState, action);

      expect(result.isLoading).toBe(true);
    });
    it('LoadFocSchemeConfigurationByConfigIdSuccess should return  scheme details', () => {
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

      const action = new actions.LoadFocSchemeConfigurationByConfigIdSuccess(
        payload
      );

      const result = focConfigurationReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.schemeDetailsById).toEqual(payload);
    });
    it('LoadFocSchemeConfigurationByConfigIdFailure should return error', () => {
      const action = new actions.LoadFocSchemeConfigurationByConfigIdFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result = focConfigurationReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadMappedProductGroupsByConfigId Functionality ', () => {
    beforeEach(() => {});
    it('LoadMappedProductGroupsByConfigId should return product groups', () => {
      const payload: LoadProductGroupPayload = {
        masterId: '11',
        category: 'GOLD_COIN',
        schemeDetailsId: '22'
      };
      const action = new actions.LoadMappedProductGroupsByConfigId(payload);

      const result = focConfigurationReducer(initialState, action);

      expect(result.isLoading).toBe(true);
    });

    it('LoadMappedProductGroupsByConfigIdSuccess should return product groups', () => {
      const payload: ProductGroupMappingOption[] = [
        { id: '76', uuid: '1', description: 'GOLD' }
      ];

      const action = new actions.LoadMappedProductGroupsByConfigIdSuccess(
        payload
      );

      const result = focConfigurationReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.productGroups.length).toBe(1);
    });
    it('LoadMappedProductGroupsByConfigIdFailure should return error', () => {
      const action = new actions.LoadMappedProductGroupsByConfigIdFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result = focConfigurationReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing UpdateProductGroupByConfigId Functionality ', () => {
    beforeEach(() => {});
    it('UpdateProductGroupByConfigId should return updated product groups', () => {
      const payload: SaveProductGroup = {
        masterId: '11',
        schemeDetailsId: '22',
        category: 'GOLD_COIN',
        addProducts: ['76'],
        removeProducts: []
      };
      const action = new actions.UpdateProductGroupByConfigId(payload);

      const result = focConfigurationReducer(initialState, action);

      expect(result.isLoading).toBe(true);
    });
    it('UpdateProductGroupByConfigIdSuccess should set hasProductsUpdated to true ', () => {
      const payload: ProductGroupMappingOption[] = [
        { id: '76', uuid: '1', description: 'GOLD' }
      ];
      const action = new actions.UpdateProductGroupByConfigIdSuccess(payload);

      const result = focConfigurationReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.hasProductsUpdated).toBe(true);
    });
    it('UpdateProductGroupByConfigIdFailure should return error', () => {
      const action = new actions.UpdateProductGroupByConfigIdFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result = focConfigurationReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing SaveVariantDetails Functionality ', () => {
    beforeEach(() => {});
    it('SaveVariantDetails should set isLoading true', () => {
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
      const action = new actions.SaveVariantDetails(payload);

      const result = focConfigurationReducer(initialState, action);

      expect(result.isLoading).toBe(true);
    });
    it('SaveVariantDetailsSuccess should return Variant details', () => {
      const action = new actions.SaveVariantDetailsSuccess(variantDetails);

      const result = focConfigurationReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.valueBasedVariantDetails).toEqual(
        variantDetails.valueBasedVariantDetails
      );
      expect(result.weightBasedVariantDetails).toEqual(
        variantDetails.weightBasedVariantDetails
      );
    });
    it('SaveVariantDetailsFailure should return error', () => {
      const action = new actions.SaveVariantDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result = focConfigurationReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadVariantDetailsById Functionality ', () => {
    beforeEach(() => {});
    it('LoadVariantDetailsById should set isLoading true', () => {
      const payload: LoadVariantDetailsPayload = {
        id: '1'
      };
      const action = new actions.LoadVariantDetailsById(payload);

      const result = focConfigurationReducer(initialState, action);

      expect(result.isLoading).toBe(true);
    });
    it('LoadVariantDetailsByIdSuccess should return Variant details', () => {
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

      const action = new actions.LoadVariantDetailsByIdSuccess(payload);

      const result = focConfigurationReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.valueBasedVariantDetails).toEqual(
        payload.valueBasedVariantDetails
      );
      expect(result.weightBasedVariantDetails).toEqual(
        payload.weightBasedVariantDetails
      );
    });
    it('LoadVariantDetailsByIdFailure should return error', () => {
      const action = new actions.LoadVariantDetailsByIdFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result = focConfigurationReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadRangeWeight Functionality ', () => {
    beforeEach(() => {});
    it('LoadRangeWeight should set isLoading true', () => {
      const action = new actions.LoadRangeWeight();

      const result = focConfigurationReducer(initialState, action);

      expect(result.isLoading).toBe(true);
    });
    it('LoadRangeWeightSuccesss should return Weight range', () => {
      const payload = ['100-200'];

      const action = new actions.LoadRangeWeightSuccesss(payload);

      const result = focConfigurationReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.rangeWeight).toEqual(payload);
    });
    it('LoadRangeWeightFailure should return error', () => {
      const action = new actions.LoadRangeWeightFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result = focConfigurationReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadLocationById Functionality ', () => {
    beforeEach(() => {});
    it('LoadLocationById should set isLoading true', () => {
      const payload: FocLocationListPayload = {
        pageSize: 10,
        pageIndex: 1,
        length: 100,
        id: '1'
      };
      const action = new actions.LoadLocationById(payload);

      const result = focConfigurationReducer(initialState, action);

      expect(result.isLoading).toBe(true);
    });
    it('LoadLocationByIdSuccess should return Location', () => {
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

      const action = new actions.LoadLocationByIdSuccess(payload);

      const result = focConfigurationReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.locationList).toEqual(payload.locationList);
      expect(result.totalLocation).toEqual(payload.totalLocations);
    });
    it('LoadLocationByIdFailure should return error', () => {
      const action = new actions.LoadLocationByIdFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result = focConfigurationReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing UpdateLocationById Functionality ', () => {
    beforeEach(() => {});
    it('UpdateLocationById should set isLoading true', () => {
      const payload: SaveLocationPayload = {
        id: '1',
        saveLocationPayload: {
          addLocations: ['URB']
        }
      };
      const action = new actions.UpdateLocationById(payload);

      const result = focConfigurationReducer(initialState, action);

      expect(result.isLoading).toBe(true);
    });
    it('UpdateLocationByIdSuccess should set isLocationUpdated to true ', () => {
      const action = new actions.UpdateLocationByIdSuccess();

      const result = focConfigurationReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.isLocationUpdated).toEqual(true);
    });
    it('UpdateLocationByIdFailure should return error', () => {
      const action = new actions.UpdateLocationByIdFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result = focConfigurationReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadFocItemCodes Functionality ', () => {
    beforeEach(() => {});
    it('LoadFocItemCodes should set isLoading true', () => {
      const payload: FOCItemCodesPayload = {
        excludeProductCategories: [],
        excludeProductGroups: [],
        includeProductCategories: [],
        includeProductGroups: ['74'],
        isFocItem: true
      };
      const action = new actions.LoadFocItemCodes(payload);

      const result = focConfigurationReducer(initialState, action);

      expect(result.isLoading).toBe(true);
    });
    it('LoadFocItemCodesSuccess should return foc item codes', () => {
      const payload: FOCItemCodes[] = [
        {
          itemCode: '53FCDS2222AE0',
          stdWeight: 32,
          karat: 22
        }
      ];
      const action = new actions.LoadFocItemCodesSuccess(payload);

      const result = focConfigurationReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.itemCodes).toEqual(payload);
    });
    it('LoadFocItemCodesFailure should return error', () => {
      const action = new actions.LoadFocItemCodesFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result = focConfigurationReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadMappedFocItemsById Functionality ', () => {
    beforeEach(() => {});
    it('LoadMappedFocItemsById should set isLoading true', () => {
      const payload: FocItemsPayload = {
        id: '1',
        pageIndex: 1,
        pageSize: 10
      };
      const action = new actions.LoadMappedFocItemsById(payload);

      const result = focConfigurationReducer(initialState, action);

      expect(result.isLoading).toBe(true);
    });
    it('LoadMappedFocItemsByIdSuccess should return mapped foc item codes', () => {
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
      const action = new actions.LoadMappedFocItemsByIdSuccess(payload);

      const result = focConfigurationReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.mappedFocItems).toEqual(payload.items);
      expect(result.totalFocItems).toEqual(payload.totalElements);
    });
    it('LoadMappedFocItemsByIdFailure should return error', () => {
      const action = new actions.LoadMappedFocItemsByIdFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result = focConfigurationReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing SaveFocItems Functionality ', () => {
    beforeEach(() => {});
    it('SaveFocItems should set isLoading true', () => {
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
      const action = new actions.SaveFocItems(payload);

      const result = focConfigurationReducer(initialState, action);

      expect(result.isLoading).toBe(true);
    });
    it('SaveFocItemsSuccess should set hasSavedFocItems to true', () => {
      const action = new actions.SaveFocItemsSuccess();

      const result = focConfigurationReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.hasSavedFocItems).toEqual(true);
    });
    it('SaveFocItemsFailure should return error', () => {
      const action = new actions.SaveFocItemsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result = focConfigurationReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing SearchFocItem Functionality ', () => {
    beforeEach(() => {});
    it('SearchFocItem should set isLoading true', () => {
      const payload: { configId: string; itemCode: string } = {
        configId: '1',
        itemCode: '5FSCDDCD000'
      };

      const action = new actions.SearchFocItem(payload);

      const result = focConfigurationReducer(initialState, action);

      expect(result.isLoading).toBe(true);
    });
    it('SearchFocItemSuccess should return searched foc item codes', () => {
      const payload: FOCItemCodes[] = [
        {
          itemCode: '53FCDS2222AE0',
          stdWeight: 32,
          karat: 22
        }
      ];
      const action = new actions.SearchFocItemSuccess(payload);

      const result = focConfigurationReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.mappedFocItems).toEqual(payload);
    });
    it('SearchFocItemFailure should return error', () => {
      const action = new actions.SearchFocItemFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result = focConfigurationReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing SearchLocationCode Functionality ', () => {
    beforeEach(() => {});
    it('SearchLocationCode should set isLoading true', () => {
      const payload: { configId: string; locationCode: string } = {
        configId: '1',
        locationCode: '5FSCDDCD000'
      };
      const action = new actions.SearchLocationCode(payload);

      const result = focConfigurationReducer(initialState, action);

      expect(result.isLoading).toBe(true);
    });
    it('SearchLocationCodeSuccess should return Searched Location', () => {
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

      const action = new actions.SearchLocationCodeSuccess(payload);

      const result = focConfigurationReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.locationList).toEqual(payload.locationList);
      expect(result.totalLocation).toEqual(payload.totalLocations);
    });
    it('SearchLocationCodeFailure should return error', () => {
      const action = new actions.SearchLocationCodeFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result = focConfigurationReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing PublishFocScheme Functionality ', () => {
    beforeEach(() => {});
    it('PublishFocScheme should set isLoading true', () => {
      const payload = '1';
      const action = new actions.PublishFocScheme(payload);

      const result = focConfigurationReducer(initialState, action);

      expect(result.isLoading).toBe(true);
    });
    it('PublishFocSchemeSuccesss should set isPublished true', () => {
      const action = new actions.PublishFocSchemeSuccesss();

      const result = focConfigurationReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.isPublished).toBe(true);
    });
    it('PublishFocSchemeFailure should return error', () => {
      const action = new actions.PublishFocSchemeFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result = focConfigurationReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadVariantDetailsValueGoldStandardById Functionality ', () => {
    beforeEach(() => {});
    it('LoadVariantDetailsValueGoldStandardById should set isLoading true', () => {
      const payload = '1';
      const action = new actions.LoadVariantDetailsValueGoldStandardById(
        payload
      );

      const result = focConfigurationReducer(initialState, action);

      expect(result.isLoading).toBe(true);
    });
    it('LoadVariantDetailsValueGoldStandardByIdSuccess should set valueBasedVariantDetailsGoldStandard  value', () => {
      const action = new actions.LoadVariantDetailsValueGoldStandardByIdSuccess(
        variantDetails
      );

      const result = focConfigurationReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.valueBasedVariantDetailsGoldStandard).toEqual(
        variantDetails.valueBasedVariantDetails
      );
    });
    it('LoadVariantDetailsValueGoldStandardByIdFailure should return error', () => {
      const action = new actions.LoadVariantDetailsValueGoldStandardByIdFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result = focConfigurationReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadVariantDetailsValueGoldSlabById Functionality ', () => {
    beforeEach(() => {});
    it('LoadVariantDetailsValueGoldSlabById should set isLoading true', () => {
      const payload = '1';
      const action = new actions.LoadVariantDetailsValueGoldSlabById(payload);

      const result = focConfigurationReducer(initialState, action);

      expect(result.isLoading).toBe(true);
    });
    it('LoadVariantDetailsValueGoldSlabByIdSuccess should set valueBasedVariantDetailsGoldSlab value', () => {
      const action = new actions.LoadVariantDetailsValueGoldSlabByIdSuccess(
        variantDetails
      );

      const result = focConfigurationReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.valueBasedVariantDetailsGoldSlab).toEqual(
        variantDetails.valueBasedVariantDetails
      );
    });
    it('LoadVariantDetailsValueGoldSlabByIdFailure should return error', () => {
      const action = new actions.LoadVariantDetailsValueGoldSlabByIdFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result = focConfigurationReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadVariantDetailsValueOthersStandardById Functionality ', () => {
    beforeEach(() => {});
    it('LoadVariantDetailsValueOthersStandardById should set isLoading true', () => {
      const payload = '1';
      const action = new actions.LoadVariantDetailsValueOthersStandardById(
        payload
      );

      const result = focConfigurationReducer(initialState, action);

      expect(result.isLoading).toBe(true);
    });
    it('LoadVariantDetailsValueOthersStandardById should set valueBasedVariantDetailsOthersStandard value', () => {
      const action = new actions.LoadVariantDetailsValueOthersStandardByIdSuccess(
        variantDetails
      );

      const result = focConfigurationReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.valueBasedVariantDetailsOthersStandard).toEqual(
        variantDetails.valueBasedVariantDetails
      );
    });
    // it('LoadVariantDetailsValueOthersStandardByIdFailure should return error', () => {
    //   const action = new actions.LoadVariantDetailsValueOthersStandardByIdFailure(
    //     CustomErrorAdaptor.fromJson(Error('some error'))
    //   );

    //   const result = focConfigurationReducer(initialState, action);

    //   expect(result.error.message).toEqual('some error');
    // });
  });

  describe('Testing LoadVariantDetailsValueOthersSlabById Functionality ', () => {
    beforeEach(() => {});
    it('LoadVariantDetailsValueOthersSlabById should set isLoading true', () => {
      const payload = '1';
      const action = new actions.LoadVariantDetailsValueOthersSlabById(payload);

      const result = focConfigurationReducer(initialState, action);

      expect(result.isLoading).toBe(true);
    });
    it('LoadVariantDetailsValueOthersSlabByIdSuccess should set valueBasedVariantDetailsOthersSlab value', () => {
      const action = new actions.LoadVariantDetailsValueOthersSlabByIdSuccess(
        variantDetails
      );

      const result = focConfigurationReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.valueBasedVariantDetailsOthersSlab).toEqual(
        variantDetails.valueBasedVariantDetails
      );
    });
    // it('LoadVariantDetailsValueOthersSlabByIdFailure should return error', () => {
    //   const action = new actions.LoadVariantDetailsValueOthersSlabByIdFailure(
    //     CustomErrorAdaptor.fromJson(Error('some error'))
    //   );

    //   const result = focConfigurationReducer(initialState, action);

    //   expect(result.error.message).toEqual('some error');
    // });
  });

  describe('Testing LoadVariantDetailsWeightGoldStandardById Functionality ', () => {
    beforeEach(() => {});
    it('LoadVariantDetailsWeightGoldStandardById should set isLoading true', () => {
      const payload = '1';
      const action = new actions.LoadVariantDetailsWeightGoldStandardById(
        payload
      );

      const result = focConfigurationReducer(initialState, action);

      expect(result.isLoading).toBe(true);
    });
    it('LoadVariantDetailsWeightGoldStandardByIdSuccess should set weightBasedVariantDetailsGoldStandard value', () => {
      const action = new actions.LoadVariantDetailsWeightGoldStandardByIdSuccess(
        variantDetails
      );

      const result = focConfigurationReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.weightBasedVariantDetailsGoldStandard).toEqual(
        variantDetails.weightBasedVariantDetails
      );
    });
    it('LoadVariantDetailsWeightGoldStandardByIdFailure should return error', () => {
      const action = new actions.LoadVariantDetailsWeightGoldStandardByIdFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result = focConfigurationReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadVariantDetailsWeightGoldSlabById Functionality ', () => {
    beforeEach(() => {});
    it('LoadVariantDetailsWeightGoldSlabById should set isLoading true', () => {
      const payload = '1';
      const action = new actions.LoadVariantDetailsWeightGoldSlabById(payload);

      const result = focConfigurationReducer(initialState, action);

      expect(result.isLoading).toBe(true);
    });
    it('LoadVariantDetailsWeightGoldSlabByIdSuccess should set weightBasedVariantDetailsGoldStandard value', () => {
      const action = new actions.LoadVariantDetailsWeightGoldSlabByIdSuccess(
        variantDetails
      );

      const result = focConfigurationReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.weightBasedVariantDetailsGoldSlab).toEqual(
        variantDetails.weightBasedVariantDetails
      );
    });
    it('LoadVariantDetailsWeightGoldSlabByIdFailure should return error', () => {
      const action = new actions.LoadVariantDetailsWeightGoldSlabByIdFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result = focConfigurationReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadVariantDetailsWeightOthersStandardById Functionality ', () => {
    beforeEach(() => {});
    it('LoadVariantDetailsWeightOthersStandardById should set isLoading true', () => {
      const payload = '1';
      const action = new actions.LoadVariantDetailsWeightOthersStandardById(
        payload
      );

      const result = focConfigurationReducer(initialState, action);

      expect(result.isLoading).toBe(true);
    });
    it('LoadVariantDetailsWeightOthersStandardByIdSuccess should set weightBasedVariantDetailsOthersStandard value', () => {
      const action = new actions.LoadVariantDetailsWeightOthersStandardByIdSuccess(
        variantDetails
      );

      const result = focConfigurationReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.weightBasedVariantDetailsOthersStandard).toEqual(
        variantDetails.weightBasedVariantDetails
      );
    });
    // it('LoadVariantDetailsWeightOthersStandardByIdFailure should return error', () => {
    //   const action = new actions.LoadVariantDetailsWeightOthersStandardByIdFailure(
    //     CustomErrorAdaptor.fromJson(Error('some error'))
    //   );

    //   const result = focConfigurationReducer(initialState, action);

    //   expect(result.error.message).toEqual('some error');
    // });
  });

  describe('Testing LoadVariantDetailsWeightOthersSlabById Functionality ', () => {
    beforeEach(() => {});
    it('LoadVariantDetailsWeightOthersSlabById should set isLoading true', () => {
      const payload = '1';
      const action = new actions.LoadVariantDetailsWeightOthersSlabById(
        payload
      );

      const result = focConfigurationReducer(initialState, action);

      expect(result.isLoading).toBe(true);
    });
    it('LoadVariantDetailsWeightOthersSlabByIdSuccess should set weightBasedVariantDetailsOthersSlab value', () => {
      const action = new actions.LoadVariantDetailsWeightOthersSlabByIdSuccess(
        variantDetails
      );

      const result = focConfigurationReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.weightBasedVariantDetailsOthersSlab).toEqual(
        variantDetails.weightBasedVariantDetails
      );
    });
    // it('LoadVariantDetailsWeightOthersSlabByIdFailure should return error', () => {
    //   const action = new actions.LoadVariantDetailsWeightOthersSlabByIdFailure(
    //     CustomErrorAdaptor.fromJson(Error('some error'))
    //   );

    //   const result = focConfigurationReducer(initialState, action);

    //   expect(result.error.message).toEqual('some error');
    // });
  });
  describe('Testing LoadReset Functionality ', () => {
    beforeEach(() => {});
    it('LoadReset should reset the state', () => {
      const action = new actions.LoadReset();

      const result = focConfigurationReducer(initialState, action);

      expect(result).toEqual(initialState);
    });
  });
});
