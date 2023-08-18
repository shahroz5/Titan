import {
  CustomErrors,
  DiscountHeaders,
  DiscountsResponse,
  DiscountTransactionLevelResponse,
  Lov
} from '@poss-web/shared/models';
import {} from 'module';
import { initialState } from './discount.reducer';
import { DiscountState } from './discount.state';
import * as selectors from './discount.selectors';
import * as moment from 'moment';

describe('DiscountState selector Testing Suite', () => {
  const error: CustomErrors = {
    error: null,
    code: '',
    message: '',
    traceId: '',
    timeStamp: ''
  };

  describe('Testing DiscountState related Selectors', () => {
    it('selectTransactionLevelDiscounts Should return list', () => {
      const payload: DiscountTransactionLevelResponse[] = [
        {
          discountCode: 'e-GHS Spl Discount',
          discountId: 'FBDFDD73-BB49-4B9D-926F-E6F502950277',
          discountType: 'BILL_LEVEL_DISCOUNT',
          discountValue: null,
          discountValueDetails: null,
          isEdited: null,
          itemDetails: null,
          basicCriteriaDetails: null
        }
      ];

      const state: DiscountState = {
        ...initialState,
        transactionLevelDiscounts: payload
      };
      expect(
        selectors.DiscountSelectors.selectTransactionLevelDiscounts.projector(
          state
        )
      ).toEqual(payload);
    });

    it('selectSystemDvDiscounts Should return list', () => {
      const payload: DiscountTransactionLevelResponse[] = [
        {
          discountCode: 'e-GHS Spl Discount',
          discountId: 'FBDFDD73-BB49-4B9D-926F-E6F502950277',
          discountType: 'BILL_LEVEL_DISCOUNT',
          discountValue: null,
          discountValueDetails: null,
          isEdited: null,
          itemDetails: null,
          basicCriteriaDetails: null
        }
      ];

      const state: DiscountState = {
        ...initialState,
        availableSystemDvDiscounts: payload
      };
      expect(
        selectors.DiscountSelectors.selectSystemDvDiscounts.projector(state)
      ).toEqual(payload);
    });
    it('selectAvailableEmployeeDiscounts Should return list', () => {
      const payload: DiscountTransactionLevelResponse[] = [
        {
          discountCode: 'e-GHS Spl Discount',
          discountId: 'FBDFDD73-BB49-4B9D-926F-E6F502950277',
          discountType: 'EMPLOYEE_DISCOUNT',
          discountValue: null,
          discountValueDetails: null,
          isEdited: null,
          itemDetails: null,
          basicCriteriaDetails: null
        }
      ];

      const state: DiscountState = {
        ...initialState,
        availableEmployeeDiscounts: payload
      };
      expect(
        selectors.DiscountSelectors.selectAvailableEmployeeDiscounts.projector(
          state
        )
      ).toEqual(payload);
    });
    it('selectAvailableTsssDiscounts Should list', () => {
      const payload: DiscountTransactionLevelResponse[] = [
        {
          discountCode: 'e-GHS Spl Discount',
          discountId: 'FBDFDD73-BB49-4B9D-926F-E6F502950277',
          discountType: 'BILL_LEVEL_DISCOUNT',
          discountValue: null,
          discountValueDetails: null,
          isEdited: null,
          itemDetails: null,
          basicCriteriaDetails: null
        }
      ];

      const state: DiscountState = {
        ...initialState,
        availableTsssDiscounts: payload
      };
      expect(
        selectors.DiscountSelectors.selectAvailableTsssDiscounts.projector(
          state
        )
      ).toEqual(payload);
    });
    it('selectAvailableTataEmployeeDiscounts Should list', () => {
      const payload: DiscountTransactionLevelResponse[] = [
        {
          discountCode: 'e-GHS Spl Discount',
          discountId: 'FBDFDD73-BB49-4B9D-926F-E6F502950277',
          discountType: 'BILL_LEVEL_DISCOUNT',
          discountValue: null,
          discountValueDetails: null,
          isEdited: null,
          itemDetails: null,
          basicCriteriaDetails: null
        }
      ];

      const state: DiscountState = {
        ...initialState,
        availableTataEmployeeDiscounts: payload
      };
      expect(
        selectors.DiscountSelectors.selectAvailableTataEmployeeDiscounts.projector(
          state
        )
      ).toEqual(payload);
    });
    it('selectAvailableEmpowermentDiscounts Should list', () => {
      const payload: DiscountTransactionLevelResponse[] = [
        {
          discountCode: 'e-GHS Spl Discount',
          discountId: 'FBDFDD73-BB49-4B9D-926F-E6F502950277',
          discountType: 'BILL_LEVEL_DISCOUNT',
          discountValue: null,
          discountValueDetails: null,
          isEdited: null,
          itemDetails: null,
          basicCriteriaDetails: null
        }
      ];

      const state: DiscountState = {
        ...initialState,
        availableEmpowermentDiscounts: payload
      };
      expect(
        selectors.DiscountSelectors.selectAvailableEmpowermentDiscounts.projector(
          state
        )
      ).toEqual(payload);
    });
    it('selectIsLoadingAvailableDiscounts Should list', () => {
      const state: DiscountState = {
        ...initialState,
        isLoadingAvailableDiscounts: true
      };
      expect(
        selectors.DiscountSelectors.selectIsLoadingAvailableDiscounts.projector(
          state
        )
      ).toEqual(true);
    });
    it('selectIsTransactionLevelDiscountsApplied Should list', () => {
      const state: DiscountState = {
        ...initialState,
        isTransactionLevelDiscountApplied: true
      };
      expect(
        selectors.DiscountSelectors.selectIsTransactionLevelDiscountsApplied.projector(
          state
        )
      ).toEqual(true);
    });
    it('selectAppliedTransactionLevelDiscounts Should list', () => {
      const state: DiscountState = {
        ...initialState,
        appliedTransactionLevelDiscounts: []
      };
      expect(
        selectors.DiscountSelectors.selectAppliedTransactionLevelDiscounts.projector(
          state
        )
      ).toEqual([]);
    });
    it('selectAppliedBillLevelTransactionLevelDiscounts Should list', () => {
      const payload: DiscountsResponse[] = [
        {
          discountCode: 'e-GHS Spl Discount',
          discountId: 'FBDFDD73-BB49-4B9D-926F-E6F502950277',
          discountTxnId: null,
          discountType: 'BILL_LEVEL_DISCOUNT',
          discountValue: null,
          discountValueDetails: null,
          status: '',
          clubbedDiscountId: '',
          isEdited: false,
          itemId: '1111111111111',
          refDiscountId: '2222222222222',
          refType: null,
          discountAttributes: null,
          isNarationMandatory: false,
          occasion: null
        }
      ];
      const state: DiscountState = {
        ...initialState,
        appliedTransactionLevelDiscounts: payload
      };
      expect(
        selectors.DiscountSelectors.selectAppliedBillLevelTransactionLevelDiscounts
          .projector(state)
          .filter(data => data.discountType === 'BILL_LEVEL_DISCOUNT')
      ).toEqual(
        payload.filter(data => data.discountType === 'BILL_LEVEL_DISCOUNT')
      );
    });
    it('selectAppliedEmployeeDiscounts Should list', () => {
      const payload: DiscountsResponse[] = [
        {
          discountCode: 'e-GHS Spl Discount',
          discountId: 'FBDFDD73-BB49-4B9D-926F-E6F502950277',
          discountTxnId: null,
          discountType: 'BILL_LEVEL_DISCOUNT',
          discountValue: null,
          discountValueDetails: null,
          status: '',
          clubbedDiscountId: '',
          isEdited: false,
          itemId: '1111111111111',
          refDiscountId: '2222222222222',
          refType: null,
          discountAttributes: null,
          isNarationMandatory: false,
          occasion: null
        }
      ];
      const state: DiscountState = {
        ...initialState,
        appliedTransactionLevelDiscounts: payload
      };
      expect(
        selectors.DiscountSelectors.selectAppliedEmployeeDiscounts
          .projector(state)
          .filter(data => data.discountType === 'EMPLOYEE_DISCOUNT')
      ).toEqual(
        payload.filter(data => data.discountType === 'EMPLOYEE_DISCOUNT')
      );
    });
    it('selectAppliedTsssDiscounts Should list', () => {
      const payload: DiscountsResponse[] = [
        {
          discountCode: 'e-GHS Spl Discount',
          discountId: 'FBDFDD73-BB49-4B9D-926F-E6F502950277',
          discountTxnId: null,
          discountType: 'BILL_LEVEL_DISCOUNT',
          discountValue: null,
          discountValueDetails: null,
          status: '',
          clubbedDiscountId: '',
          isEdited: false,
          itemId: '1111111111111',
          refDiscountId: '2222222222222',
          refType: null,
          discountAttributes: null,
          isNarationMandatory: false,
          occasion: null
        }
      ];
      const state: DiscountState = {
        ...initialState,
        appliedTransactionLevelDiscounts: payload
      };
      expect(
        selectors.DiscountSelectors.selectAppliedTsssDiscounts
          .projector(state)
          .filter(data => data.discountType === 'TSSS_DISCOUNT')
      ).toEqual(payload.filter(data => data.discountType === 'TSSS_DISCOUNT'));
    });
    it('selectAppliedTataEmployeeDiscounts Should list', () => {
      const payload: DiscountsResponse[] = [
        {
          discountCode: 'e-GHS Spl Discount',
          discountId: 'FBDFDD73-BB49-4B9D-926F-E6F502950277',
          discountTxnId: null,
          discountType: 'BILL_LEVEL_DISCOUNT',
          discountValue: null,
          discountValueDetails: null,
          status: '',
          clubbedDiscountId: '',
          isEdited: false,
          itemId: '1111111111111',
          refDiscountId: '2222222222222',
          refType: null,
          discountAttributes: null,
          isNarationMandatory: false,
          occasion: null
        }
      ];
      const state: DiscountState = {
        ...initialState,
        appliedTransactionLevelDiscounts: payload
      };
      expect(
        selectors.DiscountSelectors.selectAppliedTataEmployeeDiscounts
          .projector(state)
          .filter(data => data.discountType === 'TATA_EMPLOYEE_DISCOUNT')
      ).toEqual(
        payload.filter(data => data.discountType === 'TATA_EMPLOYEE_DISCOUNT')
      );
    });
    it('selectAppliedSystemDvDiscounts Should list', () => {
      const payload: DiscountsResponse[] = [
        {
          discountCode: 'e-GHS Spl Discount',
          discountId: 'FBDFDD73-BB49-4B9D-926F-E6F502950277',
          discountTxnId: null,
          discountType: 'BILL_LEVEL_DISCOUNT',
          discountValue: null,
          discountValueDetails: null,
          status: '',
          clubbedDiscountId: '',
          isEdited: false,
          itemId: '1111111111111',
          refDiscountId: '2222222222222',
          refType: null,
          discountAttributes: null,
          isNarationMandatory: false,
          occasion: null
        }
      ];
      const state: DiscountState = {
        ...initialState,
        appliedTransactionLevelDiscounts: payload
      };
      expect(
        selectors.DiscountSelectors.selectAppliedSystemDvDiscounts
          .projector(state)
          .filter(data => data.discountType === 'SYSTEM_DISCOUNT_DV')
      ).toEqual(
        payload.filter(data => data.discountType === 'SYSTEM_DISCOUNT_DV')
      );
    });
    it('selectAppliedSystemGhsBonusDiscounts Should list', () => {
      const payload: DiscountsResponse[] = [
        {
          discountCode: 'e-GHS Spl Discount',
          discountId: 'FBDFDD73-BB49-4B9D-926F-E6F502950277',
          discountTxnId: null,
          discountType: 'BILL_LEVEL_DISCOUNT',
          discountValue: null,
          discountValueDetails: null,
          status: '',
          clubbedDiscountId: '',
          isEdited: false,
          itemId: '1111111111111',
          refDiscountId: '2222222222222',
          refType: null,
          discountAttributes: null,
          isNarationMandatory: false,
          occasion: null
        }
      ];
      const state: DiscountState = {
        ...initialState,
        appliedTransactionLevelDiscounts: payload
      };
      expect(
        selectors.DiscountSelectors.selectAppliedSystemGhsBonusDiscounts
          .projector(state)
          .filter(data => data.discountType === 'SYSTEM_DISCOUNT_GHS_BONUS')
      ).toEqual(
        payload.filter(
          data => data.discountType === 'SYSTEM_DISCOUNT_GHS_BONUS'
        )
      );
    });
    it('selectAppliedEmpowermentDiscounts Should list', () => {
      const payload: DiscountsResponse[] = [
        {
          discountCode: 'e-GHS Spl Discount',
          discountId: 'FBDFDD73-BB49-4B9D-926F-E6F502950277',
          discountTxnId: null,
          discountType: 'BILL_LEVEL_DISCOUNT',
          discountValue: null,
          discountValueDetails: null,
          status: '',
          clubbedDiscountId: '',
          isEdited: false,
          itemId: '1111111111111',
          refDiscountId: '2222222222222',
          refType: null,
          discountAttributes: null,
          isNarationMandatory: false,
          occasion: null
        }
      ];
      const state: DiscountState = {
        ...initialState,
        appliedTransactionLevelDiscounts: payload
      };
      expect(
        selectors.DiscountSelectors.selectAppliedEmpowermentDiscounts
          .projector(state)
          .filter(data => data.discountType === 'EMPOWERMENT_DISCOUNT')
      ).toEqual(
        payload.filter(data => data.discountType === 'EMPOWERMENT_DISCOUNT')
      );
    });
    it('selectIsAllAppliedTransactionLevelDiscountsRemoved Should list', () => {
      const payload = {
        isDeleted: false,
        discountType: 'BILL_LEVEL_DISCOUNT'
      };
      const state: DiscountState = {
        ...initialState,
        isAllAppliedTransactionLevelDiscountDeleted: payload
      };
      expect(
        selectors.DiscountSelectors.selectIsAllAppliedTransactionLevelDiscountsRemoved.projector(
          state
        )
      ).toEqual(payload);
    });
    it('selectIsAllAppliedTransactionLevelDiscountsRemoved Should list', () => {
      const payload = true;
      const state: DiscountState = {
        ...initialState,
        isSelectedTransactionLevelDiscountDeleted: payload
      };
      expect(
        selectors.DiscountSelectors.selectIsSelectedTransactionLevelDiscountRemoved.projector(
          state
        )
      ).toEqual(payload);
    });
    it('selectIsTransactionLevelDiscountUpdated Should list', () => {
      const payload = true;
      const state: DiscountState = {
        ...initialState,
        isTransactionLevelDiscountUpdated: payload
      };
      expect(
        selectors.DiscountSelectors.selectIsTransactionLevelDiscountUpdated.projector(
          state
        )
      ).toEqual(payload);
    });
    it('selectIsRsoSelected Should list', () => {
      const payload = true;
      const state: DiscountState = {
        ...initialState,
        isRsoSelected: payload
      };
      expect(
        selectors.DiscountSelectors.selectIsRsoSelected.projector(state)
      ).toEqual(payload);
    });
    it('selectIsTransactionLevelDiscountConfirmed Should list', () => {
      const payload = true;
      const state: DiscountState = {
        ...initialState,
        isTransactionLevelDiscountConfirmed: payload
      };
      expect(
        selectors.DiscountSelectors.selectIsTransactionLevelDiscountConfirmed.projector(
          state
        )
      ).toEqual(payload);
    });
    it('selectTataCompanyList Should list', () => {
      const payload: Lov[] = [{ code: 'TCS', isActive: true, value: 'TCS' }];

      const state: DiscountState = {
        ...initialState,
        tataCompanyList: payload
      };
      expect(
        selectors.DiscountSelectors.selectTataCompanyList.projector(state)
      ).toEqual(payload);
    });
    it('selectRefreshDiscountsAndOffersPanel Should list', () => {
      const payload = true;
      const state: DiscountState = {
        ...initialState,
        refreshOffersAndDiscountsPanel: payload
      };
      expect(
        selectors.DiscountSelectors.selectRefreshDiscountsAndOffersPanel.projector(
          state
        )
      ).toEqual(payload);
    });
    // Item Level Discounts
    it('selectIsLoading  Should list', () => {
      const payload = true;
      const state: DiscountState = {
        ...initialState,
        isLoading: payload
      };
      expect(
        selectors.DiscountSelectors.selectIsLoading.projector(state)
      ).toEqual(payload);
    });
    it('selectError   Should list', () => {
      const payload = error;
      const state: DiscountState = {
        ...initialState,
        error: payload
      };
      expect(selectors.DiscountSelectors.selectError.projector(state)).toEqual(
        payload
      );
    });
    it('selectIsAlreadyAddedDiscountsLoading   Should list', () => {
      const payload = true;
      const state: DiscountState = {
        ...initialState,
        isAlreadyAddedDiscountsLoading: payload
      };
      expect(
        selectors.DiscountSelectors.selectIsAlreadyAddedDiscountsLoading.projector(
          state
        )
      ).toEqual(payload);
    });
    it('selectIsDiscountDetailsLoading    Should list', () => {
      const payload = true;
      const state: DiscountState = {
        ...initialState,
        isDiscountDetailsLoading: payload
      };
      expect(
        selectors.DiscountSelectors.selectIsDiscountDetailsLoading.projector(
          state
        )
      ).toEqual(payload);
    });
    it('selectIsDropdownLoading Should list', () => {
      const payload = true;
      const state: DiscountState = {
        ...initialState,
        isDropdownLoading: payload
      };
      expect(
        selectors.DiscountSelectors.selectIsDropdownLoading.projector(state)
      ).toEqual(payload);
    });
    it('selectIsABDropdownLoading Should list', () => {
      const payload = true;
      const state: DiscountState = {
        ...initialState,
        isABDropdownLoading: payload
      };
      expect(
        selectors.DiscountSelectors.selectIsABDropdownLoading.projector(state)
      ).toEqual(payload);
    });
    it('selectIsAutoDiscLoading  Should list', () => {
      const payload = true;
      const state: DiscountState = {
        ...initialState,
        isAutoDiscLoading: payload
      };
      expect(
        selectors.DiscountSelectors.selectIsAutoDiscLoading.projector(state)
      ).toEqual(payload);
    });
    it('selectItemLevelDiscounts  Should list', () => {
      const payload: DiscountHeaders = {
        discounts: [
          {
            discountType: 'CATEGORY_DISCOUNT',
            discountId: '898642B7-28FC-4149-B64E-9AC79DD53323',
            discountCode: 'catapr22',
            refDiscountTxnId: null,
            discountAttributes: {
              isRiva: true,
              isAccrualUlpPoints: false,
              clubbingDiscountType: 'TYPE1',
              occasion: 'catapr22'
            },
            rivaahGhsDetails: null
          }
        ],
        clubDiscounts: []
      };
      const state: DiscountState = {
        ...initialState,
        itemLevelDiscounts: payload
      };
      expect(
        selectors.DiscountSelectors.selectItemLevelDiscounts.projector(state)
      ).toEqual(payload);
    });
    it('selectItemLevelDiscountsDetails   Should list', () => {
      const payload = {
        discountConfigDetails: [
          {
            discountValue: 34802.46,
            discountValueDetails: [
              {
                component: 'UCP',
                discountValue: 0,
                discountPercent: null,
                isDiscountPercentage: null
              },
              {
                component: 'MAKING_CHARGE',
                discountValue: 0,
                discountPercent: null,
                isDiscountPercentage: null
              },
              {
                component: 'METAL_CHARGE',
                discountValue: 34802.46,
                discountPercent: 12,
                isDiscountPercentage: true
              },
              {
                component: 'STONE_CHARGE',
                discountValue: 0,
                discountPercent: null,
                isDiscountPercentage: null
              },
              {
                component: 'UNIT_WEIGHT',
                discountValue: 0,
                discountPercent: null,
                isDiscountPercentage: null
              }
            ],
            discountConfigDetails: {
              discountType: 'CATEGORY_DISCOUNT',
              discountId: '898642B7-28FC-4149-B64E-9AC79DD53323',
              discountCode: 'catapr22',
              refDiscountTxnId: null,
              basicCriteriaDetails: {
                isNarationMandatory: false,
                maxDiscount: 0,
                isEditable: false,
                isTepRecovery: true,
                isBillValue: false,
                ucpValue: 0,
                isFullValueTepDiscountRecovery: false,
                coinPurchaseStartDate: moment(),
                coinPurchaseEndDate: moment(),
                tepPeriodStartDate: moment(),
                tepPeriodEndDate: moment(),
                tepCNUtilizationPercent: 1,
                startingSerialNo: 1,
                isUploadMandatory: false,
                isNameMandatory: false,
                startingSerialNoEmpDiscountType: 0,
                startingSerialNoTataEmpDiscountType: 0,
                isMultipleTrnsctnAllowedOnSameDay: false,
                maxNoOfTimes: 1,
                maxCount: 1,
                isApplicableForAutomatedDiscount: true,
                isFullValueTepRecovery: false
              },
              discountAttributes: {
                isRiva: true,
                isAccrualUlpPoints: false,
                clubbingDiscountType: 'TYPE1',
                occasion: 'catapr22'
              },
              clubbingDetails: {
                isExchangeOffer: true,
                isGHS: true,
                isRiva: false,
                isEmpowerment: false,
                isDV: true,
                isFOCOffer: true,
                isCBOOffer: false,
                isBillLevelDiscount: true,
                isOtherBillLevelDiscount: false,
                isCoin: true
              },
              grnConfigDetails: {
                noOfDaysAllowedBeforeOfferPeriod: 0,
                noOfDaysAllowedAfterOfferPeriod: 0,
                utilizationPercent: 0,
                isAllowedBeforeOffer: false,
                isSameCfaEligible: false
              },
              tepConfigDetails: {
                tepDetails: [{ durationInDays: '10-20', recoveryPercent: 95 }],
                enabled: false
              },
              orderConfigDetails: {
                isGoldRateFrozenForCO: false,
                isGoldRateFrozenForAB: false,
                isDisplayOnAB: false,
                isAllowedToChangeCO: false,
                isAllowedToChangeAB: false,
                isDisplayOnCO: false,
                offerPeriodForCO: 0,
                offerPeriodForAB: 0,
                coPercent: 0,
                abPercent: 0
              },
              locationOfferDetails: {
                offerStartDate: moment(1648751400000),
                offerEndDate: moment(1672425000000),
                configDetails: null,
                empowermentQuarterMaxDiscountValue: 0,
                previewOfferStartDate: moment(1648751400000),
                previewOfferEndDate: moment(1672425000000)
              }
            },
            rivaahGhsDetails: null
          }
        ],
        clubbingId: '',
        data: null
      };
      const state: DiscountState = {
        ...initialState,
        itemLevelDiscountsDetails: payload
      };
      expect(
        selectors.DiscountSelectors.selectItemLevelDiscountsDetails.projector(
          state
        )
      ).toEqual(payload);
    });
    it('selectGetItemLevelDiscountsRes  Should list', () => {
      const payload: DiscountsResponse[] = [
        {
          discountCode: 'catapr22',
          discountType: 'CATEGORY_DISCOUNT',
          discountId: '898642B7-28FC-4149-B64E-9AC79DD53323',
          discountValue: 34802.46,
          discountValueDetails: {
            type: 'DISCOUNT_VALUE_DETAILS',
            data: [
              {
                component: 'UCP',
                discountValue: 0,
                discountPercent: null,
                isDiscountPercentage: null
              },
              {
                component: 'MAKING_CHARGE',
                discountValue: 0,
                discountPercent: null,
                isDiscountPercentage: null
              },
              {
                component: 'METAL_CHARGE',
                discountValue: 34802.46,
                discountPercent: 12,
                isDiscountPercentage: true
              },
              {
                component: 'STONE_CHARGE',
                discountValue: 0,
                discountPercent: null,
                isDiscountPercentage: null
              },
              {
                component: 'UNIT_WEIGHT',
                discountValue: 0,
                discountPercent: null,
                isDiscountPercentage: null
              }
            ]
          },
          referenceId: null,
          referenceType: null,
          isEdited: false,
          clubbedDiscountId: null,
          discountSubType: null,
          discountTxnId: '9BC4129C-0571-4EB2-A02E-F1959E97EBC1',
          itemId: 'C5FF8C3F-2B72-48BD-9BA5-3225BE5B1354',
          discountAttributes: {
            isRiva: true,
            isAccrualUlpPoints: false,
            clubbingDiscountType: 'TYPE1',
            occasion: 'catapr22'
          },
          status: 'CONFIRMED',
          txnLevelDiscountValueDetails: null,
          isNarationMandatory: false,
          occasion: ''
        }
      ];
      const state: DiscountState = {
        ...initialState,
        getItemLevelDiscountsRes: payload
      };
      expect(
        selectors.DiscountSelectors.selectGetItemLevelDiscountsRes.projector(
          state
        )
      ).toEqual(payload);
    });
    it('selectSaveItemLevelDiscountsRes  Should list', () => {
      const payload: DiscountsResponse[] = [
        {
          discountCode: 'catapr22',
          discountType: 'CATEGORY_DISCOUNT',
          discountId: '898642B7-28FC-4149-B64E-9AC79DD53323',
          discountValue: 34802.46,
          discountValueDetails: {
            type: 'DISCOUNT_VALUE_DETAILS',
            data: [
              {
                component: 'UCP',
                discountValue: 0,
                discountPercent: null,
                isDiscountPercentage: null
              },
              {
                component: 'MAKING_CHARGE',
                discountValue: 0,
                discountPercent: null,
                isDiscountPercentage: null
              },
              {
                component: 'METAL_CHARGE',
                discountValue: 34802.46,
                discountPercent: 12,
                isDiscountPercentage: true
              },
              {
                component: 'STONE_CHARGE',
                discountValue: 0,
                discountPercent: null,
                isDiscountPercentage: null
              },
              {
                component: 'UNIT_WEIGHT',
                discountValue: 0,
                discountPercent: null,
                isDiscountPercentage: null
              }
            ]
          },
          referenceId: null,
          referenceType: null,
          isEdited: false,
          clubbedDiscountId: null,
          discountSubType: null,
          discountTxnId: '9BC4129C-0571-4EB2-A02E-F1959E97EBC1',
          itemId: 'C5FF8C3F-2B72-48BD-9BA5-3225BE5B1354',
          discountAttributes: {
            isRiva: true,
            isAccrualUlpPoints: false,
            clubbingDiscountType: 'TYPE1',
            occasion: 'catapr22'
          },
          status: 'CONFIRMED',
          txnLevelDiscountValueDetails: null,
          isNarationMandatory: false,
          occasion: ''
        }
      ];
      const resPayload = {
        response: payload,
        data: null
      };
      const state: DiscountState = {
        ...initialState,
        saveItemLevelDiscountsRes: resPayload
      };
      expect(
        selectors.DiscountSelectors.selectSaveItemLevelDiscountsRes.projector(
          state
        )
      ).toEqual(resPayload);
    });
    it('selectSaveItemLevelDiscountsRes  Should list', () => {
      const payload: DiscountsResponse[] = [
        {
          discountCode: 'catapr22',
          discountType: 'CATEGORY_DISCOUNT',
          discountId: '898642B7-28FC-4149-B64E-9AC79DD53323',
          discountValue: 34802.46,
          discountValueDetails: {
            type: 'DISCOUNT_VALUE_DETAILS',
            data: [
              {
                component: 'UCP',
                discountValue: 0,
                discountPercent: null,
                isDiscountPercentage: null
              },
              {
                component: 'MAKING_CHARGE',
                discountValue: 0,
                discountPercent: null,
                isDiscountPercentage: null
              },
              {
                component: 'METAL_CHARGE',
                discountValue: 34802.46,
                discountPercent: 12,
                isDiscountPercentage: true
              },
              {
                component: 'STONE_CHARGE',
                discountValue: 0,
                discountPercent: null,
                isDiscountPercentage: null
              },
              {
                component: 'UNIT_WEIGHT',
                discountValue: 0,
                discountPercent: null,
                isDiscountPercentage: null
              }
            ]
          },
          referenceId: null,
          referenceType: null,
          isEdited: false,
          clubbedDiscountId: null,
          discountSubType: null,
          discountTxnId: '9BC4129C-0571-4EB2-A02E-F1959E97EBC1',
          itemId: 'C5FF8C3F-2B72-48BD-9BA5-3225BE5B1354',
          discountAttributes: {
            isRiva: true,
            isAccrualUlpPoints: false,
            clubbingDiscountType: 'TYPE1',
            occasion: 'catapr22'
          },
          status: 'CONFIRMED',
          txnLevelDiscountValueDetails: null,
          isNarationMandatory: false,
          occasion: ''
        }
      ];
      const resPayload = {
        response: payload,
        data: null
      };
      const state: DiscountState = {
        ...initialState,
        saveItemLevelDiscountsRes: resPayload
      };
      expect(
        selectors.DiscountSelectors.selectSaveItemLevelDiscountsRes.projector(
          state
        )
      ).toEqual(resPayload);
    });
    it('selectUpdateItemLevelDiscountsRes   Should list', () => {
      const payload: DiscountsResponse[] = [
        {
          discountCode: 'catapr22',
          discountType: 'CATEGORY_DISCOUNT',
          discountId: '898642B7-28FC-4149-B64E-9AC79DD53323',
          discountValue: 34802.46,
          discountValueDetails: {
            type: 'DISCOUNT_VALUE_DETAILS',
            data: [
              {
                component: 'UCP',
                discountValue: 0,
                discountPercent: null,
                isDiscountPercentage: null
              },
              {
                component: 'MAKING_CHARGE',
                discountValue: 0,
                discountPercent: null,
                isDiscountPercentage: null
              },
              {
                component: 'METAL_CHARGE',
                discountValue: 34802.46,
                discountPercent: 12,
                isDiscountPercentage: true
              },
              {
                component: 'STONE_CHARGE',
                discountValue: 0,
                discountPercent: null,
                isDiscountPercentage: null
              },
              {
                component: 'UNIT_WEIGHT',
                discountValue: 0,
                discountPercent: null,
                isDiscountPercentage: null
              }
            ]
          },
          referenceId: null,
          referenceType: null,
          isEdited: false,
          clubbedDiscountId: null,
          discountSubType: null,
          discountTxnId: '9BC4129C-0571-4EB2-A02E-F1959E97EBC1',
          itemId: 'C5FF8C3F-2B72-48BD-9BA5-3225BE5B1354',
          discountAttributes: {
            isRiva: true,
            isAccrualUlpPoints: false,
            clubbingDiscountType: 'TYPE1',
            occasion: 'catapr22'
          },
          status: 'CONFIRMED',
          txnLevelDiscountValueDetails: null,
          isNarationMandatory: false,
          occasion: ''
        }
      ];
      const state: DiscountState = {
        ...initialState,
        updateItemLevelDiscountsRes: payload
      };
      expect(
        selectors.DiscountSelectors.selectUpdateItemLevelDiscountsRes.projector(
          state
        )
      ).toEqual(payload);
    });
    it('selectDeleteItemLevelDiscountsRes    Should list', () => {
      const payload = {
        response: true,
        data: null
      };
      const state: DiscountState = {
        ...initialState,
        deleteItemLevelDiscountsRes: payload
      };
      expect(
        selectors.DiscountSelectors.selectDeleteItemLevelDiscountsRes.projector(
          state
        )
      ).toEqual(payload);
    });
    it('selectPcDesc Should list', () => {
      const payload = {};
      const state: DiscountState = {
        ...initialState,
        productCategoryDesc: payload
      };
      expect(selectors.DiscountSelectors.selectPcDesc.projector(state)).toEqual(
        payload
      );
    });
    it('selectPgDesc Should list', () => {
      const payload = {};
      const state: DiscountState = {
        ...initialState,
        productGroupDesc: payload
      };
      expect(selectors.DiscountSelectors.selectPgDesc.projector(state)).toEqual(
        payload
      );
    });
    it('selectDiscountTypes  Should list', () => {
      const payload: Lov[] = [
        {
          code: 'CATEGORY_DISCOUNT',
          isActive: true,
          value: 'CATEGORY_DISCOUNT'
        }
      ];
      const state: DiscountState = {
        ...initialState,
        discountTypes: payload
      };
      expect(
        selectors.DiscountSelectors.selectDiscountTypes.projector(state)
      ).toEqual(payload);
    });
    it('selectCurrentdiscountState Should list', () => {
      const payload = '';
      const state: DiscountState = {
        ...initialState,
        discountState: payload
      };
      expect(
        selectors.DiscountSelectors.selectCurrentdiscountState.projector(state)
      ).toEqual(payload);
    });
    it('selectIsEncircleDiscDetails  Should list', () => {
      const payload = '';
      const state: DiscountState = {
        ...initialState,
        isEncircleDiscDetails: payload
      };
      expect(
        selectors.DiscountSelectors.selectIsEncircleDiscDetails.projector(state)
      ).toEqual(payload);
    });
    it('selectCheckABCOEligibilityRes  Should list', () => {
      const payload = 'no-response';
      const state: DiscountState = {
        ...initialState,
        ABCOEligibilityRes: payload
      };
      expect(
        selectors.DiscountSelectors.selectCheckABCOEligibilityRes.projector(
          state
        )
      ).toEqual(payload);
    });
    it('selectLoadABCODiscountsRes Should list', () => {
      const payload: DiscountHeaders = {
        discounts: [
          {
            discountType: 'CATEGORY_DISCOUNT',
            discountId: '898642B7-28FC-4149-B64E-9AC79DD53323',
            discountCode: 'catapr22',
            refDiscountTxnId: null,
            discountAttributes: {
              isRiva: true,
              isAccrualUlpPoints: false,
              clubbingDiscountType: 'TYPE1',
              occasion: 'catapr22'
            },
            rivaahGhsDetails: null
          }
        ],
        clubDiscounts: []
      };
      const state: DiscountState = {
        ...initialState,
        ABCODiscountsRes: payload
      };
      expect(
        selectors.DiscountSelectors.selectLoadABCODiscountsRes.projector(state)
      ).toEqual(payload);
    });
    it('selectLoadNewABCODiscountsRes  Should list', () => {
      const payload: DiscountHeaders = {
        discounts: [
          {
            discountType: 'CATEGORY_DISCOUNT',
            discountId: '898642B7-28FC-4149-B64E-9AC79DD53323',
            discountCode: 'catapr22',
            refDiscountTxnId: null,
            discountAttributes: {
              isRiva: true,
              isAccrualUlpPoints: false,
              clubbingDiscountType: 'TYPE1',
              occasion: 'catapr22'
            },
            rivaahGhsDetails: null
          }
        ],
        clubDiscounts: []
      };
      const state: DiscountState = {
        ...initialState,
        newABCODiscountsRes: payload
      };
      expect(
        selectors.DiscountSelectors.selectLoadNewABCODiscountsRes.projector(
          state
        )
      ).toEqual(payload);
    });
    it('selectLoadABCOConfigDetailsRes  Should list', () => {
      const payload = {
        discounts: [
          {
            discountType: 'CATEGORY_DISCOUNT',
            discountId: '898642B7-28FC-4149-B64E-9AC79DD53323',
            discountCode: 'catapr22',
            refDiscountTxnId: null,
            discountAttributes: {
              isRiva: true,
              isAccrualUlpPoints: false,
              clubbingDiscountType: 'TYPE1',
              occasion: 'catapr22'
            },
            rivaahGhsDetails: null
          }
        ],
        clubDiscounts: []
      };
      const state: DiscountState = {
        ...initialState,
        ABCOConfigDetailsRes: payload
      };
      expect(
        selectors.DiscountSelectors.selectLoadABCOConfigDetailsRes.projector(
          state
        )
      ).toEqual(payload);
    });
    it('selectLoadABCODiscountDetailsRes Should list', () => {
      const payload = {
        discountConfigDetails: [
          {
            discountValue: 34802.46,
            discountValueDetails: [
              {
                component: 'UCP',
                discountValue: 0,
                discountPercent: null,
                isDiscountPercentage: null
              },
              {
                component: 'MAKING_CHARGE',
                discountValue: 0,
                discountPercent: null,
                isDiscountPercentage: null
              },
              {
                component: 'METAL_CHARGE',
                discountValue: 34802.46,
                discountPercent: 12,
                isDiscountPercentage: true
              },
              {
                component: 'STONE_CHARGE',
                discountValue: 0,
                discountPercent: null,
                isDiscountPercentage: null
              },
              {
                component: 'UNIT_WEIGHT',
                discountValue: 0,
                discountPercent: null,
                isDiscountPercentage: null
              }
            ],
            discountConfigDetails: {
              discountType: 'CATEGORY_DISCOUNT',
              discountId: '898642B7-28FC-4149-B64E-9AC79DD53323',
              discountCode: 'catapr22',
              refDiscountTxnId: null,
              basicCriteriaDetails: {
                isNarationMandatory: false,
                maxDiscount: 0,
                isEditable: false,
                isTepRecovery: true,
                isBillValue: false,
                ucpValue: 0,
                isFullValueTepDiscountRecovery: false,
                coinPurchaseStartDate: moment(),
                coinPurchaseEndDate: moment(),
                tepPeriodStartDate: moment(),
                tepPeriodEndDate: moment(),
                tepCNUtilizationPercent: 1,
                startingSerialNo: 1,
                isUploadMandatory: false,
                isNameMandatory: false,
                startingSerialNoEmpDiscountType: 0,
                startingSerialNoTataEmpDiscountType: 0,
                isMultipleTrnsctnAllowedOnSameDay: false,
                maxNoOfTimes: 1,
                maxCount: 1,
                isApplicableForAutomatedDiscount: true,
                isFullValueTepRecovery: false
              },
              discountAttributes: {
                isRiva: true,
                isAccrualUlpPoints: false,
                clubbingDiscountType: 'TYPE1',
                occasion: 'catapr22'
              },
              clubbingDetails: {
                isExchangeOffer: true,
                isGHS: true,
                isRiva: false,
                isEmpowerment: false,
                isDV: true,
                isFOCOffer: true,
                isCBOOffer: false,
                isBillLevelDiscount: true,
                isOtherBillLevelDiscount: false,
                isCoin: true
              },
              grnConfigDetails: {
                noOfDaysAllowedBeforeOfferPeriod: 0,
                noOfDaysAllowedAfterOfferPeriod: 0,
                utilizationPercent: 0,
                isAllowedBeforeOffer: false,
                isSameCfaEligible: false
              },
              tepConfigDetails: {
                tepDetails: [{ durationInDays: '10-20', recoveryPercent: 95 }],
                enabled: false
              },
              orderConfigDetails: {
                isGoldRateFrozenForCO: false,
                isGoldRateFrozenForAB: false,
                isDisplayOnAB: false,
                isAllowedToChangeCO: false,
                isAllowedToChangeAB: false,
                isDisplayOnCO: false,
                offerPeriodForCO: 0,
                offerPeriodForAB: 0,
                coPercent: 0,
                abPercent: 0
              },
              locationOfferDetails: {
                offerStartDate: moment(1648751400000),
                offerEndDate: moment(1672425000000),
                configDetails: null,
                empowermentQuarterMaxDiscountValue: 0,
                previewOfferStartDate: moment(1648751400000),
                previewOfferEndDate: moment(1672425000000)
              }
            },
            rivaahGhsDetails: null
          }
        ],
        clubbingId: ''
      };
      const state: DiscountState = {
        ...initialState,
        ABCODiscountDetailsRes: payload
      };
      expect(
        selectors.DiscountSelectors.selectLoadABCODiscountDetailsRes.projector(
          state
        )
      ).toEqual(payload);
    });
    it('selectLoadAutoDiscountsRes  Should list', () => {
      const payload = {
        response: {
          discountConfigDetails: [
            {
              discountValue: 34802.46,
              discountValueDetails: [
                {
                  component: 'UCP',
                  discountValue: 0,
                  discountPercent: null,
                  isDiscountPercentage: null
                },
                {
                  component: 'MAKING_CHARGE',
                  discountValue: 0,
                  discountPercent: null,
                  isDiscountPercentage: null
                },
                {
                  component: 'METAL_CHARGE',
                  discountValue: 34802.46,
                  discountPercent: 12,
                  isDiscountPercentage: true
                },
                {
                  component: 'STONE_CHARGE',
                  discountValue: 0,
                  discountPercent: null,
                  isDiscountPercentage: null
                },
                {
                  component: 'UNIT_WEIGHT',
                  discountValue: 0,
                  discountPercent: null,
                  isDiscountPercentage: null
                }
              ],
              discountConfigDetails: {
                discountType: 'CATEGORY_DISCOUNT',
                discountId: '898642B7-28FC-4149-B64E-9AC79DD53323',
                discountCode: 'catapr22',
                refDiscountTxnId: null,
                basicCriteriaDetails: {
                  isNarationMandatory: false,
                  maxDiscount: 0,
                  isEditable: false,
                  isTepRecovery: true,
                  isBillValue: false,
                  ucpValue: 0,
                  isFullValueTepDiscountRecovery: false,
                  coinPurchaseStartDate: moment(),
                  coinPurchaseEndDate: moment(),
                  tepPeriodStartDate: moment(),
                  tepPeriodEndDate: moment(),
                  tepCNUtilizationPercent: 1,
                  startingSerialNo: 1,
                  isUploadMandatory: false,
                  isNameMandatory: false,
                  startingSerialNoEmpDiscountType: 0,
                  startingSerialNoTataEmpDiscountType: 0,
                  isMultipleTrnsctnAllowedOnSameDay: false,
                  maxNoOfTimes: 1,
                  maxCount: 1,
                  isApplicableForAutomatedDiscount: true,
                  isFullValueTepRecovery: false
                },
                discountAttributes: {
                  isRiva: true,
                  isAccrualUlpPoints: false,
                  clubbingDiscountType: 'TYPE1',
                  occasion: 'catapr22'
                },
                clubbingDetails: {
                  isExchangeOffer: true,
                  isGHS: true,
                  isRiva: false,
                  isEmpowerment: false,
                  isDV: true,
                  isFOCOffer: true,
                  isCBOOffer: false,
                  isBillLevelDiscount: true,
                  isOtherBillLevelDiscount: false,
                  isCoin: true
                },
                grnConfigDetails: {
                  noOfDaysAllowedBeforeOfferPeriod: 0,
                  noOfDaysAllowedAfterOfferPeriod: 0,
                  utilizationPercent: 0,
                  isAllowedBeforeOffer: false,
                  isSameCfaEligible: false
                },
                tepConfigDetails: {
                  tepDetails: [
                    { durationInDays: '10-20', recoveryPercent: 95 }
                  ],
                  enabled: false
                },
                orderConfigDetails: {
                  isGoldRateFrozenForCO: false,
                  isGoldRateFrozenForAB: false,
                  isDisplayOnAB: false,
                  isAllowedToChangeCO: false,
                  isAllowedToChangeAB: false,
                  isDisplayOnCO: false,
                  offerPeriodForCO: 0,
                  offerPeriodForAB: 0,
                  coPercent: 0,
                  abPercent: 0
                },
                locationOfferDetails: {
                  offerStartDate: moment(1648751400000),
                  offerEndDate: moment(1672425000000),
                  configDetails: null,
                  empowermentQuarterMaxDiscountValue: 0,
                  previewOfferStartDate: moment(1648751400000),
                  previewOfferEndDate: moment(1672425000000)
                }
              },
              rivaahGhsDetails: null
            }
          ],
          clubbingId: ''
        },
        data: null
      };
      const state: DiscountState = {
        ...initialState,
        autoDiscountsRes: payload
      };
      expect(
        selectors.DiscountSelectors.selectLoadAutoDiscountsRes.projector(state)
      ).toEqual(payload);
    });
    it('selectClearEncircleRes  Should list', () => {
      const payload = true;
      const state: DiscountState = {
        ...initialState,
        isClearEncircle: payload
      };
      expect(
        selectors.DiscountSelectors.selectClearEncircleRes.projector(state)
      ).toEqual(payload);
    });
    it('selectReloadDiscountGrid  Should list', () => {
      const payload = true;
      const state: DiscountState = {
        ...initialState,
        reloadDiscounts: payload
      };
      expect(
        selectors.DiscountSelectors.selectReloadDiscountGrid.projector(state)
      ).toEqual(payload);
    });
    it('selectOrderDiscDetails  Should list', () => {
      const payload = null;
      const state: DiscountState = {
        ...initialState,
        orderDiscountDetails: payload
      };
      expect(
        selectors.DiscountSelectors.selectOrderDiscDetails.projector(state)
      ).toEqual(payload);
    });
    it('selectRivaahGHSDiscounts  Should list', () => {
      const payload: DiscountTransactionLevelResponse[] = [
        {
          discountCode: 'e-GHS Spl Discount',
          discountId: 'FBDFDD73-BB49-4B9D-926F-E6F502950277',
          discountType: 'RIVAAH_ASHIRWAAD_DISCOUNT',
          discountValue: null,
          discountValueDetails: null,
          isEdited: null,
          itemDetails: null,
          basicCriteriaDetails: null
        }
      ];
      const resPayload = {
        clubDiscountDetails: [],
        discountDetails: payload
      };
      const state: DiscountState = {
        ...initialState,
        rivaahGHSDiscounts: resPayload
      };
      expect(
        selectors.DiscountSelectors.selectRivaahGHSDiscounts.projector(state)
      ).toEqual(resPayload);
    });
    it('selectSaveRivaahGHSDiscountsResponse  Should list', () => {
      const payload: string[] = ['RIVAAH_ASHIRWAAD_DISCOUNT'];
      const state: DiscountState = {
        ...initialState,
        saveRivaahGHSDiscountsResponse: payload
      };
      expect(
        selectors.DiscountSelectors.selectSaveRivaahGHSDiscountsResponse.projector(
          state
        )
      ).toEqual(payload);
    });
    it('selectEnableCalculateRivaahGHSDiscounts  Should list', () => {
      const payload = true;
      const state: DiscountState = {
        ...initialState,
        enableCalculateRivaahGHSDiscounts: payload
      };
      expect(
        selectors.DiscountSelectors.selectEnableCalculateRivaahGHSDiscounts.projector(
          state
        )
      ).toEqual(payload);
    });
    it('selectReasonForChangingDiscounts   Should list', () => {
      const payload: Lov[] = [
        {
          code: 'GOT_HIGH_VALUE',
          isActive: true,
          value: 'GOT_HIGH_VALUE'
        }
      ];
      const state: DiscountState = {
        ...initialState,
        reasonForChangingDiscounts: payload
      };
      expect(
        selectors.DiscountSelectors.selectReasonForChangingDiscounts.projector(
          state
        )
      ).toEqual(payload);
    });
    it('selectReasonForNotGivingDiscounts    Should list', () => {
      const payload: Lov[] = [
        {
          code: 'NOT_INTERESTED',
          isActive: true,
          value: 'NOT_INTERESTED'
        }
      ];
      const state: DiscountState = {
        ...initialState,
        reasonForNotGivingDiscounts: payload
      };
      expect(
        selectors.DiscountSelectors.selectReasonForNotGivingDiscounts.projector(
          state
        )
      ).toEqual(payload);
    });
  });
});
