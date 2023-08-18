import {
  CustomErrors,
  DiscountApplicableEnum,
  DiscountConfigList,
  DiscountSlabDetails,
  DiscountTypeEnum,
  NewDiscountApplicableConfig
} from '@poss-web/shared/models';
import * as moment from 'moment';
import { initialState } from './discount-config.reducer';
import * as selectors from './discount-config.selectors';
import { DiscountConfigState } from './discount-config.state';

describe('Currency selector Testing Suite', () => {
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
  const error: CustomErrors = {
    error: null,
    code: '',
    message: '',
    traceId: '',
    timeStamp: ''
  };
  const discountSlabDetails: DiscountSlabDetails = {
    discountCategory: '',
    discountComponents: null,
    discountId: '123',
    eligibility: '',
    id: '456',
    isActive: true,
    isSingle: true,
    maxValue: 10000,
    minValue: 1,
    rowId: 1,
    slabName: 'slab1',
    valuePerWeightType: '',
    productGroupCount: 0
  };
  describe('Testing Discount Config related Selectors', () => {
    it('Should return the list of Discounts ', () => {
      const listing: DiscountConfigList[] = [
        {
          id: 'AAA',
          discountCode: 'AAA',
          description: 'AAA',
          discountType: 'AAA',
          occasion: 'AAA',
          isActive: true,
          status: 'AAA',
          createdDate: moment(),
          lastModifiedDate: moment(),
          isPublishPending: false,
          publishTime: moment()
        }
      ];
      const state: DiscountConfigState = {
        ...initialState,
        discountConfigList: listing
      };

      expect(
        selectors.DiscountConfigSelectors.selectDscountConfigList.projector(
          state
        )
      ).toEqual(listing);
    });
    it('Should return the true or false', () => {
      const state: DiscountConfigState = {
        ...initialState,
        isLoading: true
      };
      expect(
        selectors.DiscountConfigSelectors.selectIsloading.projector(state)
      ).toEqual(true);
    });
    it('Should return the count', () => {
      const state: DiscountConfigState = {
        ...initialState,
        totalCount: 0
      };
      expect(
        selectors.DiscountConfigSelectors.selectTotalDiscountConfigs.projector(
          state
        )
      ).toEqual(0);
    });
    it('Should return the error object', () => {
      const state: DiscountConfigState = {
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
        selectors.DiscountConfigSelectors.selectError.projector(state)
      ).toEqual(error);
    });
    it('Should return the true or false', () => {
      const state: DiscountConfigState = {
        ...initialState,
        hasSaved: true
      };
      expect(
        selectors.DiscountConfigSelectors.selectIsSaved.projector(state)
      ).toEqual(true);
    });
    it('Should return the true or false', () => {
      const state: DiscountConfigState = {
        ...initialState,
        hasUpdated: true
      };
      expect(
        selectors.DiscountConfigSelectors.selectIsEdited.projector(state)
      ).toEqual(true);
    });
    it('Should return the true or false', () => {
      const state: DiscountConfigState = {
        ...initialState,
        isDiscDetailsSaved: true
      };
      expect(
        selectors.DiscountConfigSelectors.selectIsDiscDetailsSaved.projector(
          state
        )
      ).toEqual(true);
    });
    it('Should return the true or false', () => {
      const state: DiscountConfigState = {
        ...initialState,
        isExcludeThemeSaved: true
      };
      expect(
        selectors.DiscountConfigSelectors.selectIsExcludeThemeSaved.projector(
          state
        )
      ).toEqual(true);
    });
    it('Should return the true or false', () => {
      const state: DiscountConfigState = {
        ...initialState,
        isExcludeTypeSaved: true
      };
      expect(
        selectors.DiscountConfigSelectors.selectIsExcludeTypeSaved.projector(
          state
        )
      ).toEqual(true);
    });
    it('Should return the Discount Details object', () => {
      const discountDetails = discountConfig;
      const state: DiscountConfigState = {
        ...initialState,
        discountDetails: discountDetails
      };

      expect(
        selectors.DiscountConfigSelectors.selectDiscountDetails.projector(state)
      ).toEqual(discountDetails);
    });

    it('Should return the best deal discount list', () => {
      const discountDetails = null;
      const state: DiscountConfigState = {
        ...initialState,
        bestDealDiscountList: discountDetails
      };

      expect(
        selectors.DiscountConfigSelectors.selectBestDealDiscountList.projector(
          state
        )
      ).toEqual(discountDetails);
    });

    it('Should return the best deal discount count', () => {
      const discountDetails = null;
      const state: DiscountConfigState = {
        ...initialState,
        bestDealDiscountCount: discountDetails
      };

      expect(
        selectors.DiscountConfigSelectors.selectBestDealDiscountCount.projector(
          state
        )
      ).toEqual(discountDetails);
    });

    it('Should return the selected best deal discount count', () => {
      const discountDetails = null;
      const state: DiscountConfigState = {
        ...initialState,
        selectedBestDealDiscountCount: discountDetails
      };

      expect(
        selectors.DiscountConfigSelectors.selectSelectedBestDealDiscountCount.projector(
          state
        )
      ).toEqual(discountDetails);
    });

    it('Should return the saved best deal discount object', () => {
      const discountDetails = null;
      const state: DiscountConfigState = {
        ...initialState,
        saveBestDealDiscounts: discountDetails
      };

      expect(
        selectors.DiscountConfigSelectors.selectSaveBestDealDiscount.projector(
          state
        )
      ).toEqual(discountDetails);
    });

    it('Should return the mapped best deal discount object', () => {
      const discountDetails = null;
      const state: DiscountConfigState = {
        ...initialState,
        selectedBestDealDiscount: discountDetails
      };

      expect(
        selectors.DiscountConfigSelectors.selectMappedBestDealDiscount.projector(
          state
        )
      ).toEqual(discountDetails);
    });

    it('Should return true or false', () => {
      const discountDetails = null;
      const state: DiscountConfigState = {
        ...initialState,
        isPublished: discountDetails
      };

      expect(
        selectors.DiscountConfigSelectors.selectIsPublishedDiscountConfig.projector(
          state
        )
      ).toEqual(discountDetails);
    });

    it('Should return empowerment discount object', () => {
      const discountDetails = null;
      const state: DiscountConfigState = {
        ...initialState,
        empowermentDiscounts: discountDetails
      };

      expect(
        selectors.DiscountConfigSelectors.selectEmpowermentDiscounts.projector(
          state
        )
      ).toEqual(discountDetails);
    });

    it('Should return pudated empowerment discount object', () => {
      const discountDetails = null;
      const state: DiscountConfigState = {
        ...initialState,
        empowermentUpdatedDiscount: discountDetails
      };

      expect(
        selectors.DiscountConfigSelectors.selectEmpowermentUpdatedDiscount.projector(
          state
        )
      ).toEqual(discountDetails);
    });

    it('Should return true or false', () => {
      const discountDetails = null;
      const state: DiscountConfigState = {
        ...initialState,
        isTsssComputed: discountDetails
      };

      expect(
        selectors.DiscountConfigSelectors.selectIsTsssComputed.projector(state)
      ).toEqual(discountDetails);
    });

    it('Should return url for download', () => {
      const discountDetails = null;
      const state: DiscountConfigState = {
        ...initialState,
        tsssConfigCouponResponse: discountDetails
      };

      expect(
        selectors.DiscountConfigSelectors.selectDownloadTsssConfigUrl.projector(
          state
        )
      ).toEqual(discountDetails);
    });

    it('Should return selectTotalDiscountRequests ', () => {
      const state: DiscountConfigState = {
        ...initialState,
        discountRequestCount: 10
      };

      expect(
        selectors.DiscountConfigSelectors.selectTotalDiscountRequests.projector(
          state
        )
      ).toEqual(10);
    });

    it('Should return selectIsLotAge   ', () => {
      const state: DiscountConfigState = {
        ...initialState,
        saveLotAge: true
      };

      expect(
        selectors.DiscountConfigSelectors.selectIsLotAge.projector(state)
      ).toBe(true);
    });

    it('Should return selectIsMaxPercentage    ', () => {
      const state: DiscountConfigState = {
        ...initialState,
        saveMaxPercentage: true
      };

      expect(
        selectors.DiscountConfigSelectors.selectIsMaxPercentage.projector(state)
      ).toBe(true);
    });

    it('Should return selectDiscountLocations     ', () => {
      const state: DiscountConfigState = {
        ...initialState,
        discountLocations: []
      };

      expect(
        selectors.DiscountConfigSelectors.selectDiscountLocations.projector(
          state
        )
      ).toEqual([]);
    });

    it('Should return selectLocationCount      ', () => {
      const state: DiscountConfigState = {
        ...initialState,
        locationCount: 10
      };

      expect(
        selectors.DiscountConfigSelectors.selectLocationCount.projector(state)
      ).toEqual(10);
    });

    it('Should return selectDiscountProductCategories       ', () => {
      const state: DiscountConfigState = {
        ...initialState,
        discountProductCategories: []
      };

      expect(
        selectors.DiscountConfigSelectors.selectDiscountProductCategories.projector(
          state
        )
      ).toEqual([]);
    });

    it('Should return selectProductCategoryCount        ', () => {
      const state: DiscountConfigState = {
        ...initialState,
        productCategoryCount: 10
      };

      expect(
        selectors.DiscountConfigSelectors.selectProductCategoryCount.projector(
          state
        )
      ).toEqual(10);
    });

    it('Should return selectDiscountProductGroups         ', () => {
      const state: DiscountConfigState = {
        ...initialState,
        discountProductGroups: []
      };

      expect(
        selectors.DiscountConfigSelectors.selectDiscountProductGroups.projector(
          state
        )
      ).toEqual([]);
    });

    it('Should return selecttProductGroupCount          ', () => {
      const state: DiscountConfigState = {
        ...initialState,
        productGroupCount: 10
      };

      expect(
        selectors.DiscountConfigSelectors.selecttProductGroupCount.projector(
          state
        )
      ).toEqual(10);
    });
    it('Should return selectDiscountExcludeTypes           ', () => {
      const state: DiscountConfigState = {
        ...initialState,
        discountExcludeItems: []
      };

      expect(
        selectors.DiscountConfigSelectors.selectDiscountExcludeTypes.projector(
          state
        )
      ).toEqual([]);
    });

    it('Should return selectDiscountExcludeItemCodes            ', () => {
      const state: DiscountConfigState = {
        ...initialState,
        excludeItemCodes: []
      };

      expect(
        selectors.DiscountConfigSelectors.selectDiscountExcludeItemCodes.projector(
          state
        )
      ).toEqual([]);
    });

    it('Should return selectRangeTEPDuration             ', () => {
      const state: DiscountConfigState = {
        ...initialState,
        rangeTepDuration: []
      };

      expect(
        selectors.DiscountConfigSelectors.selectRangeTEPDuration.projector(
          state
        )
      ).toEqual([]);
    });

    it('Should return selectBrands              ', () => {
      const state: DiscountConfigState = {
        ...initialState,
        brands: []
      };

      expect(
        selectors.DiscountConfigSelectors.selectBrands.projector(state)
      ).toEqual([]);
    });

    it('Should return selectSubBrands               ', () => {
      const state: DiscountConfigState = {
        ...initialState,
        subBrands: []
      };

      expect(
        selectors.DiscountConfigSelectors.selectSubBrands.projector(state)
      ).toEqual([]);
    });

    it('Should return selectApplicableLevels                ', () => {
      const state: DiscountConfigState = {
        ...initialState,
        applicableLevels: []
      };

      expect(
        selectors.DiscountConfigSelectors.selectApplicableLevels.projector(
          state
        )
      ).toEqual([]);
    });
    it('Should return selectIsDiscountComponentPGConfigSaved                  ', () => {
      const state: DiscountConfigState = {
        ...initialState,
        isDiscountComponentPGConfigSaved: true
      };

      expect(
        selectors.DiscountConfigSelectors.selectIsDiscountComponentPGConfigSaved.projector(
          state
        )
      ).toBe(true);
    });

    it('Should return selectDiscountComponentProductGroups  ', () => {
      const state: DiscountConfigState = {
        ...initialState,
        discountComponentProductGroups: []
      };

      expect(
        selectors.DiscountConfigSelectors.selectDiscountComponentProductGroups.projector(
          state
        )
      ).toEqual([]);
    });
    it('Should return selectApprovers   ', () => {
      const state: DiscountConfigState = {
        ...initialState,
        approvers: []
      };

      expect(
        selectors.DiscountConfigSelectors.selectApprovers.projector(state)
      ).toEqual([]);
    });

    it('Should return selectClubbingDiscountTypes    ', () => {
      const state: DiscountConfigState = {
        ...initialState,
        clubbingDiscountTypes: []
      };

      expect(
        selectors.DiscountConfigSelectors.selectClubbingDiscountTypes.projector(
          state
        )
      ).toEqual([]);
    });

    it('Should return selectDiscountTypes     ', () => {
      const state: DiscountConfigState = {
        ...initialState,
        discountTypes: []
      };

      expect(
        selectors.DiscountConfigSelectors.selectDiscountTypes.projector(state)
      ).toEqual([]);
    });

    it('Should return selectIsDiscountApproved      ', () => {
      const state: DiscountConfigState = {
        ...initialState,
        isDiscountApproved: 'true'
      };

      expect(
        selectors.DiscountConfigSelectors.selectIsDiscountApproved.projector(
          state
        )
      ).toEqual('true');
    });

    it('Should return selectExcludeTypeCount       ', () => {
      const state: DiscountConfigState = {
        ...initialState,
        excludeConfigCount: 0
      };

      expect(
        selectors.DiscountConfigSelectors.selectExcludeTypeCount.projector(
          state
        )
      ).toEqual(0);
    });

    it('Should return selectExcludeItemCodesCount        ', () => {
      const state: DiscountConfigState = {
        ...initialState,
        excludeItemCount: 0
      };

      expect(
        selectors.DiscountConfigSelectors.selectExcludeItemCodesCount.projector(
          state
        )
      ).toEqual(0);
    });

    it('Should return selectSaveLocations         ', () => {
      const state: DiscountConfigState = {
        ...initialState,
        saveLocations: true
      };

      expect(
        selectors.DiscountConfigSelectors.selectSaveLocations.projector(state)
      ).toBeTruthy();
    });

    it('Should return selectSaveProductCategories          ', () => {
      const state: DiscountConfigState = {
        ...initialState,
        saveProductCategories: true
      };

      expect(
        selectors.DiscountConfigSelectors.selectSaveProductCategories.projector(
          state
        )
      ).toBeTruthy();
    });

    it('Should return selectSaveProductGroups           ', () => {
      const state: DiscountConfigState = {
        ...initialState,
        saveProductGroups: true
      };

      expect(
        selectors.DiscountConfigSelectors.selectSaveProductGroups.projector(
          state
        )
      ).toBeTruthy();
    });

    it('Should return selectIsExcludeSchemeSaved            ', () => {
      const state: DiscountConfigState = {
        ...initialState,
        isExcludeSchemeSaved: true
      };

      expect(
        selectors.DiscountConfigSelectors.selectIsExcludeSchemeSaved.projector(
          state
        )
      ).toBeTruthy();
    });

    it('Should return selectMappedLocations             ', () => {
      const state: DiscountConfigState = {
        ...initialState,
        selectedLocations: []
      };

      expect(
        selectors.DiscountConfigSelectors.selectMappedLocations.projector(state)
      ).toEqual([]);
    });

    it('Should return selectMappedProductGroups             ', () => {
      const state: DiscountConfigState = {
        ...initialState,
        selectedProductGroups: []
      };

      expect(
        selectors.DiscountConfigSelectors.selectMappedProductGroups.projector(
          state
        )
      ).toEqual([]);
    });
    it('Should return selectMappedProductCategories              ', () => {
      const state: DiscountConfigState = {
        ...initialState,
        selectedProductCategories: []
      };

      expect(
        selectors.DiscountConfigSelectors.selectMappedProductCategories.projector(
          state
        )
      ).toEqual([]);
    });

    it('Should return selectMappedProductCategories              ', () => {
      const state: DiscountConfigState = {
        ...initialState,
        selectedProductCategories: []
      };

      expect(
        selectors.DiscountConfigSelectors.selectMappedProductCategories.projector(
          state
        )
      ).toEqual([]);
    });

    it('Should return selectDiscDetails', () => {
      const state: DiscountConfigState = {
        ...initialState,
        discDetails: [discountSlabDetails]
      };

      expect(
        selectors.DiscountConfigSelectors.selectDiscDetails.projector(state)
      ).toEqual([discountSlabDetails]);
    });

    it('Should return selectSlabDetails', () => {
      const state: DiscountConfigState = {
        ...initialState,
        slabDetails: discountSlabDetails
      };

      expect(
        selectors.DiscountConfigSelectors.selectSlabDetails.projector(state)
      ).toEqual(discountSlabDetails);
    });
  });
});
