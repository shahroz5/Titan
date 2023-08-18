import { inject, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import {
  DiscountApplicableEnum,
  DiscountTypeEnum,
  DisountConfigListPayload,
  NewDiscountApplicableConfig,
  NewDiscountDetails,
  SaveBestDealDiscountPayload
} from '@poss-web/shared/models';
import * as moment from 'moment';
import {
  ComputeTsssConfig,
  EditDiscountConfigList,
  LoadApplicableLevels,
  LoadApprovers,
  LoadBestDealDiscountList,
  LoadBrands,
  LoadClubbingDiscountTypes,
  LoadDiscountConfigDetails,
  LoadDiscountConfigList,
  LoadDiscountDetails,
  LoadDiscountExcludeItemCodes,
  LoadDiscountExcludeTypeList,
  LoadDiscountMappedLocationList,
  LoadDiscountMappedProductCategoryList,
  LoadDiscountMappedProductGroupList,
  LoadDiscountTypes,
  LoadEmpowermentDiscountDetails,
  LoadSelectedBestDealDiscounts,
  LoadSelectedLocations,
  LoadSelectedProductCategories,
  LoadSelectedProductGroups,
  LoadSubBrands,
  LoadTepDurationDaysRange,
  LoadTsssConfigDownloadUrl,
  PublishDiscountConfig,
  ResetDiscounts,
  SaveBestDealDiscounts,
  SaveDiscountConfigList,
  SaveDiscountDetails,
  SaveDiscountExcludeSchemes,
  SaveDiscountExcludeThemes,
  SaveDiscountExcludeTypes,
  SaveDiscountLocations,
  SaveDiscountProductCategory,
  SaveDiscountProductGroups,
  SaveEmpowermentDetails,
  SaveSlabDetails,
  SendForApprovalDiscountConfig,
  UpdateEmpowermentDetails
} from './discount-config.actions';
import { DiscountConfigFacade } from './discount-config.facade';
import { DiscountConfigState } from './discount-config.state';
describe('Stone Type facade Testing Suite', () => {
  const initialState: DiscountConfigState = {
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

  let discountConfigFacade: DiscountConfigFacade;
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

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), DiscountConfigFacade]
    });

    discountConfigFacade = TestBed.inject<any>(DiscountConfigFacade);
  });

  describe('Access Selector action', () => {
    it('should access  getError() selector action', () => {
      expect(discountConfigFacade.getError()).toEqual(
        discountConfigFacade['error$']
      );
    });
    it('should access  getIsloading() selector action', () => {
      expect(discountConfigFacade.getIsloading()).toEqual(
        discountConfigFacade['isLoading$']
      );
    });
    it('should access  getTotalDiscountConfigList() selector action', () => {
      expect(discountConfigFacade.getTotalDiscountConfigList()).toEqual(
        discountConfigFacade['totalDiscountConfigList$']
      );
    });
    it('should access  getDiscountDetails() selector action', () => {
      expect(discountConfigFacade.getDiscountDetails()).toEqual(
        discountConfigFacade['totalDiscountDetails$']
      );
    });

    it('should access  getIsDiscDetailsSaved() selector action', () => {
      expect(discountConfigFacade.getIsDiscDetailsSaved()).toEqual(
        discountConfigFacade['discountDetailsSaved$']
      );
    });
    it('should access  getHasSaved() selector action', () => {
      expect(discountConfigFacade.getHasSaved()).toEqual(
        discountConfigFacade['hasSaved$']
      );
    });
    it('should access  getHasUpdated() selector action', () => {
      expect(discountConfigFacade.getHasUpdated()).toEqual(
        discountConfigFacade['hasUpdated$']
      );
    });
    it('should access  getIsExcludeTypeSaved() selector action', () => {
      expect(discountConfigFacade.getIsExcludeTypeSaved()).toEqual(
        discountConfigFacade['isExcludeTypeSaved$']
      );
    });
    it('should access  getIsThemeCodeSaved() selector action', () => {
      expect(discountConfigFacade.getIsThemeCodeSaved()).toEqual(
        discountConfigFacade['isExcludeThemeSaved$']
      );
    });
    it('should access  getIsLocationSaved() selector action', () => {
      expect(discountConfigFacade.getIsLocationSaved()).toEqual(
        discountConfigFacade['isLocationsSaved$']
      );
    });
    it('should access  getIsProductCategoriesSaved() selector action', () => {
      expect(discountConfigFacade.getIsProductCategoriesSaved()).toEqual(
        discountConfigFacade['isProductCategoriesSaved$']
      );
    });
    it('should access  getIsProductGroupsSaved() selector action', () => {
      expect(discountConfigFacade.getIsProductGroupsSaved()).toEqual(
        discountConfigFacade['isProductGroupsSaved$']
      );
    });

    it('should access  getBestDealDiscountList() selector action', () => {
      expect(discountConfigFacade.getBestDealDiscountList()).toEqual(
        discountConfigFacade['bestDealDiscountList$']
      );
    });

    it('should access  getBestDealDiscountCount() selector action', () => {
      expect(discountConfigFacade.getBestDealDiscountCount()).toEqual(
        discountConfigFacade['bestDealDiscountCount$']
      );
    });

    it('should access  getSelectedBestDealDiscountCount() selector action', () => {
      expect(discountConfigFacade.getSelectedBestDealDiscountCount()).toEqual(
        discountConfigFacade['selectedBestDealDiscountCount$']
      );
    });

    it('should access  getIsPublished() selector action', () => {
      expect(discountConfigFacade.getIsPublished()).toEqual(
        discountConfigFacade['isPublished$']
      );
    });

    it('should access  getSelectedBestDealDiscount() selector action', () => {
      expect(discountConfigFacade.getSelectedBestDealDiscount()).toEqual(
        discountConfigFacade['mappedBestDealDiscounts$']
      );
    });

    it('should access  getIsBestDealDiscountSaved() selector action', () => {
      expect(discountConfigFacade.getIsBestDealDiscountSaved()).toEqual(
        discountConfigFacade['saveBestDealDiscount$']
      );
    });

    it('should access  getIsTsssComputed() selector action', () => {
      expect(discountConfigFacade.getIsTsssComputed()).toEqual(
        discountConfigFacade['isTsssComputed$']
      );
    });

    it('should access  getTsssConfigDownloadUrl() selector action', () => {
      expect(discountConfigFacade.getTsssConfigDownloadUrl()).toEqual(
        discountConfigFacade['tsssConfigDownloadUrl$']
      );
    });

    it('should access  getEmpowermentUpdatedDiscount() selector action', () => {
      expect(discountConfigFacade.getEmpowermentUpdatedDiscount()).toEqual(
        discountConfigFacade['empowermentUpdatedDiscount$']
      );
    });

    it('should access  getEmpowermentDiscounts() selector action', () => {
      expect(discountConfigFacade.getEmpowermentDiscounts()).toEqual(
        discountConfigFacade['empowermentDiscounts$']
      );
    });

    it('should access  getEmpowermentDiscounts() selector action', () => {
      expect(discountConfigFacade.getEmpowermentDiscounts()).toEqual(
        discountConfigFacade['empowermentDiscounts$']
      );
    });

    it('should access  getLotAge() selector action', () => {
      expect(discountConfigFacade.getLotAge()).toEqual(
        discountConfigFacade['saveLotAge$']
      );
    });
    it('should access  getMaxPercent() selector action', () => {
      expect(discountConfigFacade.getMaxPercent()).toEqual(
        discountConfigFacade['saveMaxPercentage$']
      );
    });
    it('should access  getDiscountRequestCount() selector action', () => {
      expect(discountConfigFacade.getDiscountRequestCount()).toEqual(
        discountConfigFacade['discountRequestCount$']
      );
    });
    it('should access  getDiscountRequestList() selector action', () => {
      expect(discountConfigFacade.getDiscountRequestList()).toEqual(
        discountConfigFacade['discountRequestList$']
      );
    });

    it('should access  getIsExcludeSchemeSaved() selector action', () => {
      expect(discountConfigFacade.getIsExcludeSchemeSaved()).toEqual(
        discountConfigFacade['isExcludeSchemeSaved$']
      );
    });

    it('should access  getDiscountConfigList() selector action', () => {
      expect(discountConfigFacade.getDiscountConfigList()).toEqual(
        discountConfigFacade['discountConfigList$']
      );
    });

    it('should access  getTotalDiscountLocations() selector action', () => {
      expect(discountConfigFacade.getTotalDiscountLocations()).toEqual(
        discountConfigFacade['totalDiscountLocations$']
      );
    });

    it('should access  getDiscountLocationDetails() selector action', () => {
      expect(discountConfigFacade.getDiscountLocationDetails()).toEqual(
        discountConfigFacade['discountLocationList$']
      );
    });

    it('should access  getTotalDiscountProductCategories() selector action', () => {
      expect(discountConfigFacade.getTotalDiscountProductCategories()).toEqual(
        discountConfigFacade['totalDiscountProductCategories$']
      );
    });

    it('should access  getDiscountProductCategoryDetails() selector action', () => {
      expect(discountConfigFacade.getDiscountProductCategoryDetails()).toEqual(
        discountConfigFacade['discountProductCategoryList$']
      );
    });

    it('should access  getTotalDiscountProductGroups() selector action', () => {
      expect(discountConfigFacade.getTotalDiscountProductGroups()).toEqual(
        discountConfigFacade['totalDiscountProductGroups$']
      );
    });

    it('should access  getDiscountProductGroupDetails() selector action', () => {
      expect(discountConfigFacade.getDiscountProductGroupDetails()).toEqual(
        discountConfigFacade['discountProductGroupList$']
      );
    });

    it('should access  getTotalDiscountExcludeTypes() selector action', () => {
      expect(discountConfigFacade.getTotalDiscountExcludeTypes()).toEqual(
        discountConfigFacade['totalDiscountExcludeTypes$']
      );
    });

    it('should access  getTotalDiscountExcludeItemCodes() selector action', () => {
      expect(discountConfigFacade.getTotalDiscountExcludeItemCodes()).toEqual(
        discountConfigFacade['totalDiscountExcludeItemCodes$']
      );
    });

    it('should access  getDiscountExcludeTypeDetails() selector action', () => {
      expect(discountConfigFacade.getDiscountExcludeTypeDetails()).toEqual(
        discountConfigFacade['discountExcludeTypeList$']
      );
    });

    it('should access  getDiscountExcludeItemCodes() selector action', () => {
      expect(discountConfigFacade.getDiscountExcludeItemCodes()).toEqual(
        discountConfigFacade['discountExcludeItemCodes$']
      );
    });

    it('should access  getDiscountComponentPGConfigCount() selector action', () => {
      expect(discountConfigFacade.getDiscountComponentPGConfigCount()).toEqual(
        discountConfigFacade['discountComponentPGConfigCount$']
      );
    });

    it('should access  getDiscountComponentPGConfig() selector action', () => {
      expect(discountConfigFacade.getDiscountComponentPGConfig()).toEqual(
        discountConfigFacade['discountComponentPGConfig$']
      );
    });

    it('should access  getIsDiscountComponentPGConfigSaved() selector action', () => {
      expect(
        discountConfigFacade.getIsDiscountComponentPGConfigSaved()
      ).toEqual(discountConfigFacade['isDiscountComponentPGConfigSaved$']);
    });

    it('should access  getDiscountComponentProductGroups() selector action', () => {
      expect(discountConfigFacade.getDiscountComponentProductGroups()).toEqual(
        discountConfigFacade['discountComponentProductGroups$']
      );
    });

    it('should access  getSlabDetails() selector action', () => {
      expect(discountConfigFacade.getSlabDetails()).toEqual(
        discountConfigFacade['slabDetails$']
      );
    });

    it('should access  getDiscDetails() selector action', () => {
      expect(discountConfigFacade.getDiscDetails()).toEqual(
        discountConfigFacade['discountDetails$']
      );
    });

    it('should access  getDiscountTypes() selector action', () => {
      expect(discountConfigFacade.getDiscountTypes()).toEqual(
        discountConfigFacade['discountTypes$']
      );
    });

    it('should access  getClubbingDiscountTypes() selector action', () => {
      expect(discountConfigFacade.getClubbingDiscountTypes()).toEqual(
        discountConfigFacade['clubbingDiscountTypes$']
      );
    });

    it('should access  getSubBrands() selector action', () => {
      expect(discountConfigFacade.getSubBrands()).toEqual(
        discountConfigFacade['subBrands$']
      );
    });
    it('should access  getBrands() selector action', () => {
      expect(discountConfigFacade.getBrands()).toEqual(
        discountConfigFacade['brands$']
      );
    });
    it('should access  getTEPDurationRange() selector action', () => {
      expect(discountConfigFacade.getTEPDurationRange()).toEqual(
        discountConfigFacade['selectRangeTEPDuration$']
      );
    });
    it('should access  getApplicableLevels() selector action', () => {
      expect(discountConfigFacade.getApplicableLevels()).toEqual(
        discountConfigFacade['applicableLevels$']
      );
    });
  });

  describe(' loadDiscountConfigList ', () => {
    it('should dispatch LoadDiscountConfigList  action', inject(
      [Store],
      store => {
        const parameters: DisountConfigListPayload = {
          pageIndex: 0,
          pageSize: 100
        };
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new LoadDiscountConfigList(parameters);
        discountConfigFacade.loadDiscountConfigList(parameters);
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });

  describe(' LoadDiscountConfigDetails ', () => {
    it('should dispatch LoadDiscountConfigDetails  action', inject(
      [Store],
      store => {
        const parameters = 'ABC';
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new LoadDiscountConfigDetails(parameters);
        discountConfigFacade.loadDiscountDetails(parameters);
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });
  describe(' EditDiscountConfigList ', () => {
    it('should dispatch EditDiscountConfigList  action', inject(
      [Store],
      store => {
        const id = 'discountId';
        const parameters = discountConfig;
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new EditDiscountConfigList(id, parameters);
        discountConfigFacade.editDiscountDetails(id, parameters);
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });
  describe(' SaveDiscountConfigList ', () => {
    it('should dispatch SaveDiscountConfigList  action', inject(
      [Store],
      store => {
        const parameters = discountHeaderDetails;
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new SaveDiscountConfigList(parameters);
        discountConfigFacade.saveDiscountDetails(parameters);
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });
  describe(' ResetStoneTypeDialog ', () => {
    it('should dispatch ResetStoneTypeDialog  action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new ResetDiscounts();
        discountConfigFacade.resetDiscounts();
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });

  describe('LoadBestDealDiscountList ', () => {
    it('should dispatch LoadBestDealDiscountList action', inject(
      [Store],
      store => {
        const parameters: DisountConfigListPayload = {
          pageSize: 10,
          pageIndex: 0,
          discountCode: 'SFSFGGG1235'
        };
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new LoadBestDealDiscountList(parameters);
        discountConfigFacade.loadBestDealDiscountList(parameters);
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });

  describe('PublishDiscountConfig ', () => {
    it('should dispatch PublishDiscountConfig action', inject(
      [Store],
      store => {
        const parameters = 'SFSFGGG1235';

        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new PublishDiscountConfig(parameters);
        discountConfigFacade.loadIsPublishedConfig(parameters);
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });

  describe('SaveBestDealDiscounts', () => {
    it('should dispatch SaveBestDealDiscounts action', inject(
      [Store],
      store => {
        const parameters: SaveBestDealDiscountPayload = null;

        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new SaveBestDealDiscounts(parameters);
        discountConfigFacade.saveBestDealDiscount(parameters);
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });

  describe('LoadSelectedBestDealDiscounts', () => {
    it('should dispatch LoadSelectedBestDealDiscounts action', inject(
      [Store],
      store => {
        const parameters = null;

        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new LoadSelectedBestDealDiscounts(parameters);
        discountConfigFacade.loadSelectedBestDealDiscount(parameters);
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });

  describe('ComputeTsssConfig', () => {
    it('should dispatch ComputeTsssConfig action', inject([Store], store => {
      const parameters = null;

      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new ComputeTsssConfig(parameters);
      discountConfigFacade.loadTsssConfigCompute(parameters);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('LoadTsssConfigDownloadUrl', () => {
    it('should dispatch LoadTsssConfigDownloadUrl action', inject(
      [Store],
      store => {
        const parameters = null;

        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new LoadTsssConfigDownloadUrl(parameters);
        discountConfigFacade.loadTsssConfigDownloadUrl(parameters);
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });

  describe('SaveEmpowermentDetails', () => {
    it('should dispatch SaveEmpowermentDetails action', inject(
      [Store],
      store => {
        const parameters = null;

        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new SaveEmpowermentDetails(parameters);
        discountConfigFacade.saveEmpowermentDetails(parameters);
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });

  describe('UpdateEmpowermentDetails', () => {
    it('should dispatch UpdateEmpowermentDetails action', inject(
      [Store],
      store => {
        const parameters = null;

        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new UpdateEmpowermentDetails(parameters);
        discountConfigFacade.updateEmpowermentDetails(parameters);
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });

  describe('LoadEmpowermentDiscountDetails', () => {
    it('should dispatch LoadEmpowermentDiscountDetails action', inject(
      [Store],
      store => {
        const parameters = null;

        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new LoadEmpowermentDiscountDetails(parameters);
        discountConfigFacade.loadEmpowermentDiscDetails(parameters);
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });

  describe('loadDiscountTypes', () => {
    it('should dispatch loadDiscountTypes action', inject([Store], store => {
      const parameters = null;

      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadDiscountTypes(parameters);
      discountConfigFacade.loadDiscountTypes(parameters);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('loadClubbingDiscountTypes', () => {
    it('should dispatch loadClubbingDiscountTypes action', inject(
      [Store],
      store => {
        const parameters = null;

        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new LoadClubbingDiscountTypes(parameters);
        discountConfigFacade.loadClubbingDiscountTypes(parameters);
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });

  describe('loadApprovers', () => {
    it('should dispatch LoadApprovers action', inject([Store], store => {
      const parameters = null;

      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadApprovers(parameters);
      discountConfigFacade.loadApprovers(parameters);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('LoadDiscountMappedLocationList', () => {
    it('should dispatch LoadDiscountMappedLocationList action', inject(
      [Store],
      store => {
        const parameters = null;

        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new LoadDiscountMappedLocationList(parameters);
        discountConfigFacade.loadDiscountLocationList(parameters);
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });

  describe('LoadDiscountMappedProductCategoryList', () => {
    it('should dispatch LoadDiscountMappedProductCategoryList action', inject(
      [Store],
      store => {
        const parameters = null;

        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new LoadDiscountMappedProductCategoryList(
          parameters
        );
        discountConfigFacade.loadDiscountProductCategoryList(parameters);
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });

  describe('LoadDiscountMappedProductGroupList', () => {
    it('should dispatch LoadDiscountMappedProductGroupList action', inject(
      [Store],
      store => {
        const parameters = null;

        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new LoadDiscountMappedProductGroupList(
          parameters
        );
        discountConfigFacade.loadDiscountProductGroupList(parameters);
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });

  describe('LoadDiscountExcludeTypeList', () => {
    it('should dispatch LoadDiscountExcludeTypeList action', inject(
      [Store],
      store => {
        const parameters = null;

        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new LoadDiscountExcludeTypeList(parameters);
        discountConfigFacade.loadExcludeTypeList(parameters);
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });

  describe('LoadDiscountExcludeItemCodes', () => {
    it('should dispatch LoadDiscountExcludeItemCodes action', inject(
      [Store],
      store => {
        const parameters = null;

        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new LoadDiscountExcludeItemCodes(parameters);
        discountConfigFacade.loadExcludeItemCodes(parameters);
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });

  describe('SaveDiscountLocations', () => {
    it('should dispatch SaveDiscountLocations action', inject(
      [Store],
      store => {
        const parameters = null;

        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new SaveDiscountLocations(parameters);
        discountConfigFacade.saveDiscountLocations(parameters);
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });
  describe('SaveDiscountProductCategory', () => {
    it('should dispatch SaveDiscountProductCategory action', inject(
      [Store],
      store => {
        const parameters = null;

        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new SaveDiscountProductCategory(parameters);
        discountConfigFacade.saveDiscountProductCategories(parameters);
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });

  describe('SaveDiscountProductGroups', () => {
    it('should dispatch SaveDiscountProductGroups action', inject(
      [Store],
      store => {
        const parameters = null;

        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new SaveDiscountProductGroups(parameters);
        discountConfigFacade.saveDiscountProductGroups(parameters);
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });

  describe('SaveDiscountExcludeThemes', () => {
    it('should dispatch SaveDiscountExcludeThemes action', inject(
      [Store],
      store => {
        const parameters = null;

        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new SaveDiscountExcludeThemes(parameters);
        discountConfigFacade.saveDiscountExcludeThemes(parameters);
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });

  describe('SaveDiscountExcludeTypes', () => {
    it('should dispatch SaveDiscountExcludeTypes action', inject(
      [Store],
      store => {
        const parameters = null;

        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new SaveDiscountExcludeTypes(parameters);
        discountConfigFacade.saveDiscountExcludeTypes(parameters);
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });

  describe('SendForApprovalDiscountConfig', () => {
    it('should dispatch SendForApprovalDiscountConfig action', inject(
      [Store],
      store => {
        const parameters = null;

        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new SendForApprovalDiscountConfig(parameters);
        discountConfigFacade.sendDiscountForApproval(parameters);
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });

  describe('SaveDiscountExcludeSchemes', () => {
    it('should dispatch SaveDiscountExcludeSchemes action', inject(
      [Store],
      store => {
        const parameters = null;

        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new SaveDiscountExcludeSchemes(parameters);
        discountConfigFacade.saveDiscountExcludeSchemes(parameters);
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });

  describe('LoadSelectedLocations', () => {
    it('should dispatch LoadSelectedLocations action', inject(
      [Store],
      store => {
        const parameters = null;

        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new LoadSelectedLocations(parameters);
        discountConfigFacade.loadSelectedLocations(parameters);
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });

  describe('LoadSelectedProductGroups', () => {
    it('should dispatch LoadSelectedProductGroups action', inject(
      [Store],
      store => {
        const parameters = null;

        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new LoadSelectedProductGroups(parameters);
        discountConfigFacade.loadSelectedProductGroups(parameters);
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });

  describe('LoadSelectedProductCategories', () => {
    it('should dispatch LoadSelectedProductCategories action', inject(
      [Store],
      store => {
        const parameters = null;

        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new LoadSelectedProductCategories(parameters);
        discountConfigFacade.loadSelectedProductCategories(parameters);
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });

  describe('LoadSubBrands', () => {
    it('should dispatch LoadSubBrands action', inject([Store], store => {
      const parameters = null;

      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadSubBrands(parameters);
      discountConfigFacade.loadSubBrands(parameters);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('LoadBrands', () => {
    it('should dispatch LoadBrands action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadBrands();
      discountConfigFacade.loadBrands();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('LoadApplicableLevels', () => {
    it('should dispatch LoadApplicableLevels action', inject([Store], store => {
      const parameters = null;

      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadApplicableLevels(parameters);
      discountConfigFacade.loadApplicableLevels(parameters);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('LoadTepDurationDaysRange', () => {
    it('should dispatch LoadTepDurationDaysRange action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new LoadTepDurationDaysRange();
        discountConfigFacade.loadTEPDurationRange();
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });

  describe('saveSlabDetails', () => {
    const payload = 'ADNNSIJ13';
    it('should dispatch saveSlabDetails action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new SaveSlabDetails(payload);
      discountConfigFacade.saveSlabDetails(payload);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('saveDiscDetails', () => {
    const payload = 'ADNNSIJ13';
    it('should dispatch saveDiscDetails action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new SaveDiscountDetails(payload);
      discountConfigFacade.saveDiscDetails(payload);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('loadDiscDetails', () => {
    const payload = 'ADNNSIJ13';
    it('should dispatch loadDiscDetails action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadDiscountDetails(payload);
      discountConfigFacade.loadDiscDetails(payload);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });
});
