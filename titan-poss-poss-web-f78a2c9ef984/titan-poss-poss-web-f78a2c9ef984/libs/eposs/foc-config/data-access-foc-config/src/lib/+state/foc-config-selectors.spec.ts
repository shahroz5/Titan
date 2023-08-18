// you will need to assert that the store is calling the right selector function.

import {
  CustomErrors,
  SchemeDetails,
  ValueBasedVariantDetails,
  WeightBasedVariantDetails,
  ProductGroupMappingOption,
  FocLocationList,
  FOCItemCodes
} from '@poss-web/shared/models';

import { initialState } from './foc-config-reducer';
import * as selectors from './foc-config-selectors';

import { FocConfigurationState } from './foc-config-state';

describe('FocConfigurationState selector Testing Suite', () => {
  const error: CustomErrors = {
    error: null,
    code: '',
    message: '',
    traceId: '',
    timeStamp: ''
  };
  const valueBasedVariantDetails: ValueBasedVariantDetails[] = [
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
  ];

  const weightBasedVariantDetails: WeightBasedVariantDetails[] = [
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
  ];

  const locationList: FocLocationList[] = [
    {
      locationCode: 'URB',
      description: 'URB',
      subBrandCode: 'Mia',
      startDate: '10',
      endDate: '12',
      isActive: 'isActive',
      id: '1'
    }
  ];
  const focItemCodes: FOCItemCodes[] = [
    {
      itemCode: '53FCDS2222AE0',
      stdWeight: 32,
      karat: 22
    }
  ];
  describe('Testing FocConfigurationState related Selectors', () => {
    it('selectFocConfigList Should return the list of foc config', () => {
      const focConfigurationList: SchemeDetails[] = [
        {
          name: 'scheme one',
          description: 'scheme one'
        }
      ];

      const state: FocConfigurationState = {
        ...initialState,
        focConfigList: focConfigurationList
      };
      expect(
        selectors.focConfigurationSelectors.selectFocConfigList.projector(state)
      ).toEqual(focConfigurationList);
    });

    it('selectIsloading Should return the true or false', () => {
      const state: FocConfigurationState = {
        ...initialState,
        isLoading: true
      };
      expect(
        selectors.focConfigurationSelectors.selectIsLoading.projector(state)
      ).toEqual(true);
    });
    it('selectError Should return the error object', () => {
      const state: FocConfigurationState = {
        ...initialState,
        error: {
          error: null,
          timeStamp: '',
          traceId: '',
          code: '',
          message: ''
        }
      };
      expect(
        selectors.focConfigurationSelectors.selectError.projector(state)
      ).toEqual(error);
    });

    it('selectHassaved Should return the true or false', () => {
      const state: FocConfigurationState = {
        ...initialState,
        hasSaved: true
      };
      expect(
        selectors.focConfigurationSelectors.selectHassaved.projector(state)
      ).toEqual(true);
    });

    it('selectTotalElement  Should return total elements', () => {
      const state: FocConfigurationState = {
        ...initialState,
        totalElements: 10
      };
      expect(
        selectors.focConfigurationSelectors.selectTotalElement.projector(state)
      ).toEqual(10);
    });
    it('selectSchemeDetails should return scheme details ', () => {
      const schemeDetails: SchemeDetails = {
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
      const state: FocConfigurationState = {
        ...initialState,
        schemeDetails: schemeDetails
      };
      expect(
        selectors.focConfigurationSelectors.selectSchemeDetails.projector(state)
      ).toEqual(schemeDetails);
    });

    it('selectRangeWeight  Should return range weight', () => {
      const rangeWeight = ['100-200'];
      const state: FocConfigurationState = {
        ...initialState,
        rangeWeight: rangeWeight
      };
      expect(
        selectors.focConfigurationSelectors.selectRangeWeight.projector(state)
      ).toEqual(rangeWeight);
    });

    it('selectValueBasedVariantDetails  Should return value based variant deatials', () => {
      const state: FocConfigurationState = {
        ...initialState,
        valueBasedVariantDetails: valueBasedVariantDetails
      };
      expect(
        selectors.focConfigurationSelectors.selectValueBasedVariantDetails.projector(
          state
        )
      ).toEqual(valueBasedVariantDetails);
    });

    it('selectWeightBasedVariantDetails should return weight based deatils  ', () => {
      const state: FocConfigurationState = {
        ...initialState,
        weightBasedVariantDetails: weightBasedVariantDetails
      };
      expect(
        selectors.focConfigurationSelectors.selectWeightBasedVariantDetails.projector(
          state
        )
      ).toEqual(weightBasedVariantDetails);
    });

    it('selectProductGroups should return product groups  ', () => {
      const productGroupMappingOption: ProductGroupMappingOption[] = [
        { id: '76', uuid: '1', description: 'GOLD' }
      ];

      const state: FocConfigurationState = {
        ...initialState,
        productGroups: productGroupMappingOption
      };
      expect(
        selectors.focConfigurationSelectors.selectProductGroups.projector(state)
      ).toEqual(productGroupMappingOption);
    });

    it('selectLocationList should return location list  ', () => {
      const state: FocConfigurationState = {
        ...initialState,
        locationList: locationList
      };
      expect(
        selectors.focConfigurationSelectors.selectLocationList.projector(state)
      ).toEqual(locationList);
    });

    it('selectIsLocationUpdated should return true or false ', () => {
      const state: FocConfigurationState = {
        ...initialState,
        isLocationUpdated: true
      };
      expect(
        selectors.focConfigurationSelectors.selectIsLocationUpdated.projector(
          state
        )
      ).toEqual(true);
    });

    it('selectItemCodes should return all foc item codes ', () => {
      const state: FocConfigurationState = {
        ...initialState,
        itemCodes: focItemCodes
      };
      expect(
        selectors.focConfigurationSelectors.selectItemCodes.projector(state)
      ).toEqual(focItemCodes);
    });

    it('selectHasFocItemsSaved should return true or false ', () => {
      const state: FocConfigurationState = {
        ...initialState,
        hasSavedFocItems: true
      };
      expect(
        selectors.focConfigurationSelectors.selectHasFocItemsSaved.projector(
          state
        )
      ).toEqual(true);
    });

    it('selectMappedFocItems should return mapped item codes ', () => {
      const state: FocConfigurationState = {
        ...initialState,
        mappedFocItems: focItemCodes
      };
      expect(
        selectors.focConfigurationSelectors.selectMappedFocItems.projector(
          state
        )
      ).toEqual(focItemCodes);
    });

    it('selectTotalFocItems should return total foc items ', () => {
      const state: FocConfigurationState = {
        ...initialState,
        totalFocItems: 10
      };
      expect(
        selectors.focConfigurationSelectors.selectTotalFocItems.projector(state)
      ).toEqual(10);
    });

    it('selectSchemeDetailsById should return scheme id ', () => {
      const schemeDetails: SchemeDetails = {
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

      const state: FocConfigurationState = {
        ...initialState,
        schemeDetailsById: schemeDetails
      };
      expect(
        selectors.focConfigurationSelectors.selectSchemeDetailsById.projector(
          state
        )
      ).toEqual(schemeDetails);
    });

    it('selectHasProductsUpdated should return true or false ', () => {
      const state: FocConfigurationState = {
        ...initialState,
        hasProductsUpdated: true
      };
      expect(
        selectors.focConfigurationSelectors.selectHasProductsUpdated.projector(
          state
        )
      ).toEqual(true);
    });

    it('selectLocationCount should return location count ', () => {
      const state: FocConfigurationState = {
        ...initialState,
        totalLocation: 10
      };
      expect(
        selectors.focConfigurationSelectors.selectLocationCount.projector(state)
      ).toEqual(10);
    });

    it('selectIsPublished should return location count ', () => {
      const state: FocConfigurationState = {
        ...initialState,
        isPublished: true
      };
      expect(
        selectors.focConfigurationSelectors.selectIsPublished.projector(state)
      ).toBe(true);
    });

    it('selectHasUpdated should return location count ', () => {
      const state: FocConfigurationState = {
        ...initialState,
        hasUpdated: true
      };
      expect(
        selectors.focConfigurationSelectors.selectHasUpdated.projector(state)
      ).toBe(true);
    });

    it('selectValueBasedVariantDetailsGoldStandard should return valueBasedVariantDetails ', () => {
      const state: FocConfigurationState = {
        ...initialState,
        valueBasedVariantDetailsGoldStandard: valueBasedVariantDetails
      };
      expect(
        selectors.focConfigurationSelectors.selectValueBasedVariantDetailsGoldStandard.projector(
          state
        )
      ).toEqual(valueBasedVariantDetails);
    });

    it('selectValueBasedVariantDetailsGoldSlab should return valueBasedVariantDetails ', () => {
      const state: FocConfigurationState = {
        ...initialState,
        valueBasedVariantDetailsGoldSlab: valueBasedVariantDetails
      };
      expect(
        selectors.focConfigurationSelectors.selectValueBasedVariantDetailsGoldSlab.projector(
          state
        )
      ).toEqual(valueBasedVariantDetails);
    });

    it('selectWeightBasedVariantDetailsGoldStandard should return weightBasedVariantDetailsGoldStandard ', () => {
      const state: FocConfigurationState = {
        ...initialState,
        weightBasedVariantDetailsGoldStandard: weightBasedVariantDetails
      };
      expect(
        selectors.focConfigurationSelectors.selectWeightBasedVariantDetailsGoldStandard.projector(
          state
        )
      ).toEqual(weightBasedVariantDetails);
    });

    it('selectWeightBasedVariantDetailsGoldSlab should return weightBasedVariantDetailsGoldStandard ', () => {
      const state: FocConfigurationState = {
        ...initialState,
        weightBasedVariantDetailsGoldSlab: weightBasedVariantDetails
      };
      expect(
        selectors.focConfigurationSelectors.selectWeightBasedVariantDetailsGoldSlab.projector(
          state
        )
      ).toEqual(weightBasedVariantDetails);
    });

    it('selectValueBasedVariantDetailsOthersStandard should return valueBasedVariantDetails ', () => {
      const state: FocConfigurationState = {
        ...initialState,
        valueBasedVariantDetailsOthersStandard: valueBasedVariantDetails
      };
      expect(
        selectors.focConfigurationSelectors.selectValueBasedVariantDetailsOthersStandard.projector(
          state
        )
      ).toEqual(valueBasedVariantDetails);
    });

    it('selectValueBasedVariantDetailsOthersSlab should return valueBasedVariantDetails ', () => {
      const state: FocConfigurationState = {
        ...initialState,
        valueBasedVariantDetailsOthersSlab: valueBasedVariantDetails
      };
      expect(
        selectors.focConfigurationSelectors.selectValueBasedVariantDetailsOthersSlab.projector(
          state
        )
      ).toEqual(valueBasedVariantDetails);
    });

    it('selectWeightBasedVariantDetailsOthersStandard should return weightBasedVariantDetailsGoldStandard ', () => {
      const state: FocConfigurationState = {
        ...initialState,
        weightBasedVariantDetailsOthersStandard: weightBasedVariantDetails
      };
      expect(
        selectors.focConfigurationSelectors.selectWeightBasedVariantDetailsOthersStandard.projector(
          state
        )
      ).toEqual(weightBasedVariantDetails);
    });

    it('selectWeightBasedVariantDetailsOthersSlab should return weightBasedVariantDetailsGoldStandard ', () => {
      const state: FocConfigurationState = {
        ...initialState,
        weightBasedVariantDetailsOthersSlab: weightBasedVariantDetails
      };
      expect(
        selectors.focConfigurationSelectors.selectWeightBasedVariantDetailsOthersSlab.projector(
          state
        )
      ).toEqual(weightBasedVariantDetails);
    });

    it('selectAllFocItemCodes should return weightBasedVariantDetailsGoldStandard ', () => {
      const state: FocConfigurationState = {
        ...initialState,
        allSelectedItemCodes: focItemCodes
      };
      expect(
        selectors.focConfigurationSelectors.selectAllFocItemCodes.projector(
          state
        )
      ).toEqual(focItemCodes);
    });

    it('selectAllSelectedLocationCodes should return weightBasedVariantDetailsGoldStandard ', () => {
      const state: FocConfigurationState = {
        ...initialState,
        allSelectedLocationCodes: locationList
      };
      expect(
        selectors.focConfigurationSelectors.selectAllSelectedLocationCodes.projector(
          state
        )
      ).toEqual(locationList);
    });
  });
});
