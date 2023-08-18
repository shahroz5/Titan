import {
  DiscountApplicableEnum,
  DiscountConfigList,
  DiscountConfigSuccessList,
  DiscountExcludeItemSuccessList,
  DiscountLocationList,
  DiscountLocationSuccessList,
  DiscountProductCategoryList,
  DiscountProductCategorySuccessList,
  DiscountProductGroupList,
  DiscountProductGroupSuccessList,
  ExcludeItemList,
  MappedDetails,
  NewDiscountApplicableConfig,
  DiscountTypeEnum,
  DiscountSlabDetails,
  ValuePercentageConfigData,
  ProductGroupMappingOption,
  DiscountCompEnum,
  SubBrands,
  WeightRange,
  TSSSResponsePayload,
  EmpowerConfigItem,
  DiscountLOVTypes,
  BrandSummary,
  MappedBestDealDiscountSuccessList,
  DiscountRequestListPayload,
  RequestLists
} from '@poss-web/shared/models';
import * as moment from 'moment';

export class DiscountConfigAdaptor {
  static getDiscountConfigList(data: any): DiscountConfigSuccessList {
    const discountConfigList: DiscountConfigList[] = [];
    for (const listItem of data.results) {
      discountConfigList.push({
        id: listItem.id ? listItem.id : '',
        discountCode: listItem.discountCode ? listItem.discountCode : '',
        description: listItem.description ? listItem.description : '',
        discountType: listItem.discountType ? listItem.discountType : '',
        occasion: listItem.occasion ? listItem.occasion : '',
        isActive: listItem.isActive,
        isCreatedByWorkflow: listItem?.isCreatedByWorkflow,
        status: listItem.status,
        createdDate: moment(listItem.createdDate),
        lastModifiedDate: moment(listItem.lastModifiedDate),
        isPublishPending: listItem.isPublishPending,
        publishTime: moment(listItem.publishTime),
        lastModifiedBy: listItem.lastModifiedBy ? listItem.lastModifiedBy : ''
      });
    }
    return {
      discountConfigList: discountConfigList,
      count: data.totalElements
    };
  }

  static getNewDiscountDetails(): NewDiscountApplicableConfig {
    const newDiscountDetails: NewDiscountApplicableConfig = {
      // id: 'new',
      // discountCode: '',
      // description: '',
      // discountType: '',
      // occasion: '',
      // approvedBy: '',
      // subBrandCode: '',
      // applicableLevels: '',
      // remarks: '',
      // isAccrualUlpPoints: false,
      // isActive: true,
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
          // maxDiscount: null,
          isTepRecovery: true,
          isEditable: false,
          isMultipleTransactionPerDayAllowed: false,
          maxTransactionPerDay: 0,
          ucp: {
            isValue: true,
            value: 0
            // percentage: 0
          },
          startingSerialNo: null,

          tataEmployeeConfig: {
            maxCount: 0
            // uploadMandatory: false,
            // employeeNameMandatory: false
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
          isApplicableForAutomatedDiscount: false,
          minKarateEligibleForGEP: null
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

    return newDiscountDetails;
  }
  static getDiscountDetailsById(data): any {
    const discountDetailsById: any = {
      id: data.id,
      discountCode: data.discountCode ? data.discountCode : '',
      description: data.description ? data.description : null,
      discountType: data.discountType ? data.discountType : '',
      occasion: data.occasion ? data.occasion : '',
      approvedBy: data.approvedBy ? data.approvedBy : '',
      brandCode: data.brandCode ? data.brandCode : '',
      subBrandCode: data.subBrandCode ? data.subBrandCode : '',
      applicableLevels: data.applicableLevels ? data.applicableLevels : null,
      remarks: data.remarks ? data.remarks : null,
      isAccrualUlpPoints: data.isAccrualUlp,
      isCoOfferApplicable: data.isCoOfferApplicable,
      isPreviewApplicable: data.isPreviewApplicable,
      isAbOfferApplicable: data.isAbOfferApplicable,
      ulpCreateDate: data.ulpCreateDate,
      publishTime: data.publishTime ? data.publishTime : null,
      isActive: data.isActive,
      isRiva: data.isRiva,
      workflowFileUploadDetails: data.workflowFileUploadDetails
        ? data.workflowFileUploadDetails
        : null,
      clubbingDiscountType: data.clubbingDiscountType,
      workflowProcessId: data.workflowProcessId ? data.workflowProcessId : null,
      ...DiscountConfigAdaptor.getOrderConfigDetails(data.orderDetails),
      ...DiscountConfigAdaptor.getAbCoDetails(data.abCoData),
      ...DiscountConfigAdaptor.getTepDetails(data.tepDetails),
      ...DiscountConfigAdaptor.getGrnDetails(data.grnDetails),

      ...DiscountConfigAdaptor.getBasicCriteriaDetails(
        data.basicCriteria,
        data.discountType
      ),
      ...DiscountConfigAdaptor.getClubOtherOffersConfig(
        data.clubOtherOffersConfig
      ),
      ...DiscountConfigAdaptor.getClubDiscountType(data.clubDiscountType),
      ...DiscountConfigAdaptor.getCumulativeDetails(data.cumulativeDetails),
      ...DiscountConfigAdaptor.getConfigDetails(data.configDetails),

      // ...DiscountConfigAdaptor.getitemGroupConfigDetails(data.itemGroupConfig),

      ...DiscountConfigAdaptor.getItemGroupLevelDetaisl(
        data.itemGroupConfig,
        data.discountType
      ),
      ...DiscountConfigAdaptor.getRivaaItemGroupLevelDetaisl(
        data.rivaahItemGroupConfig,
        data.discountType
      ),
      ...DiscountConfigAdaptor.getApplicableThemeDetails(data.applicableThemes)
    };
    console.log({
      ...DiscountConfigAdaptor.getRivaaItemGroupLevelDetaisl(
        data.rivaahItemGroupConfig,
        data.discountType
      )
    });
    console.log(discountDetailsById);
    return discountDetailsById;
  }

  static getRivaaItemGroupLevelDetaisl(data, type?) {
    console.log(data);
    const rivaItemGroupConfig = {
      rivaahItemGroupConfig: {
        type:
          type === DiscountTypeEnum.ITEM_GROUP_LEVEL_DISCOUNT
            ? DiscountTypeEnum.ITEM_GROUP_LEVEL_DISCOUNT
            : DiscountApplicableEnum.BEST_DEAL_TYPE,
        data: {
          additionalMaxMetalChargePercentage: null,
          additionalMaxMetalChargeValue: null,
          additionalMaxStoneChargePercentage: null,
          additionalMaxStoneChargeValue: null,
          additionalMaxUcpPercentage: null,
          additionalMaxUCPValue: null,
          additionalMaxMCPercentage: null,
          additionalMaxMCValue: null,
          additionalMaxPsPerGramVaule: null
        }
      }
    };
    if (!data || !data.data) return rivaItemGroupConfig;
    else {
      return {
        rivaahItemGroupConfig: {
          type:
            type === DiscountTypeEnum.ITEM_GROUP_LEVEL_DISCOUNT
              ? DiscountTypeEnum.ITEM_GROUP_LEVEL_DISCOUNT
              : DiscountTypeEnum.BEST_DEAL_DISCOUNT,
          data: {
            additionalMaxMetalChargePercentage:
              data?.data?.additionalMaxMetalCharge?.percent !== ''
                ? data?.data?.additionalMaxMetalCharge?.percent
                : null,
            additionalMaxMetalChargeValue:
              data?.data?.additionalMaxMetalCharge?.value !== ''
                ? data?.data?.additionalMaxMetalCharge?.value
                : null,
            additionalMaxStoneChargePercentage:
              data?.data?.additionalMaxStoneCharges?.percent !== ''
                ? data?.data?.additionalMaxStoneCharges?.percent
                : null,
            additionalMaxStoneChargeValue:
              data?.data?.additionalMaxStoneCharges?.value !== ''
                ? data?.data?.additionalMaxStoneCharges?.value
                : null,
            additionalMaxUcpPercentage:
              data?.data?.additionalMaxUCP?.percent !== ''
                ? data?.data?.additionalMaxUCP?.percent
                : null,
            additionalMaxUCPValue:
              data?.data?.additionalMaxUCP?.value !== ''
                ? data?.data?.additionalMaxUCP?.value
                : null,

            additionalMaxMCPercentage:
              data?.data?.additionalMaxMC?.percent !== ''
                ? data?.data?.additionalMaxMC?.percent
                : null,
            additionalMaxMCValue:
              data?.data?.additionalMaxMC?.value !== ''
                ? data?.data?.additionalMaxMC?.value
                : null,
            additionalMaxPsPerGramVaule:
              data?.data?.additionalMaxPsPerGram?.weight !== ''
                ? data?.data?.additionalMaxPsPerGram?.weight
                : null
          }
        }
      };
    }
  }
  static getItemGroupLevelDetaisl(data, type?) {
    const itemGroupConfig = {
      itemGroupConfig: {
        type:
          type === DiscountTypeEnum.ITEM_GROUP_LEVEL_DISCOUNT
            ? DiscountTypeEnum.ITEM_GROUP_LEVEL_DISCOUNT
            : DiscountApplicableEnum.BEST_DEAL_TYPE,
        data: {
          maxMetalChargePercentage: null,
          maxMetalChargeValue: null,
          maxScPercentage: null,
          maxScValue: null,
          maxUcpPercentage: null,
          maxUcpValue: null,
          maxWcPercentage: null,
          maxWcValue: null,
          maxMcPercentage: null,
          maxMcValue: null,
          maxPerGramVaule: null
        }
      }
    };
    if (!data || !data.data) return itemGroupConfig;
    else {
      return {
        itemGroupConfig: {
          type:
            type === DiscountTypeEnum.ITEM_GROUP_LEVEL_DISCOUNT
              ? DiscountTypeEnum.ITEM_GROUP_LEVEL_DISCOUNT
              : DiscountTypeEnum.BEST_DEAL_DISCOUNT,
          data: {
            maxMetalChargePercentage:
              data?.data?.maxMetalCharge?.percent !== ''
                ? data?.data?.maxMetalCharge?.percent
                : null,
            maxMetalChargeValue:
              data?.data?.maxMetalCharge?.value !== ''
                ? data?.data?.maxMetalCharge?.value
                : null,
            maxScPercentage:
              data?.data?.maxStoneCharges?.percent !== ''
                ? data?.data?.maxStoneCharges?.percent
                : null,
            maxScValue:
              data?.data?.maxStoneCharges?.value !== ''
                ? data?.data?.maxStoneCharges?.value
                : null,
            maxUcpPercentage:
              data?.data?.maxUCP?.percent !== ''
                ? data?.data?.maxUCP?.percent
                : null,
            maxUcpValue:
              data?.data?.maxUCP?.value !== ''
                ? data?.data?.maxUCP?.value
                : null,
            maxWcPercentage:
              data?.data?.maxWastage?.percent !== ''
                ? data?.data?.maxWastage?.percent
                : null,
            maxWcValue:
              data?.data?.maxWastage?.value !== ''
                ? data?.data?.maxWastage?.value
                : null,
            maxMcPercentage:
              data?.data?.maxMC?.percent !== ''
                ? data?.data?.maxMC?.percent
                : null,
            maxMcValue:
              data?.data?.maxMC?.value !== '' ? data?.data?.maxMC?.value : null,
            maxPerGramVaule:
              data?.data?.maxPsPerGram?.weight !== ''
                ? data?.data?.maxPsPerGram?.weight
                : null
          }
        }
      };
    }
  }

  static getOrderConfigDetails(data) {
    const orderConfigData = {
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
          isDisplayOnAB: false,
          isSizingOnCO: false,
          coCreation: false,
          invokeCO: false
        }
      }
    };
    if (!data || !data.data) return orderConfigData;
    else {
      return {
        orderDetails: {
          type: DiscountApplicableEnum.AB_CO_TYPE,
          data: {
            isGoldRateFrozenForCO: data.data.isGoldRateFrozenForCO,
            isGoldRateFrozenForAB: data.data.isGoldRateFrozenForAB,
            offerPeriodForCO: data.data.offerPeriodForCO
              ? data.data.offerPeriodForCO
              : 0,
            offerPeriodForAB: data.data.offerPeriodForAB
              ? data.data.offerPeriodForAB
              : 0,
            coPercent: data.data.coPercent ? data.data.coPercent : 0,
            abPercent: data.data.abPercent ? data.data.abPercent : 0,
            isAllowedToChangeCO: data.data.isAllowedToChangeCO,
            isDisplayOnCO: data.data.isDisplayOnCO,
            isAllowedToChangeAB: data.data.isAllowedToChangeAB,
            isDisplayOnAB: data.data.isDisplayOnAB,
            isSizingOnCO: data.data.isSizingOnCO,
            coCreation: data.data.coCreation,
            invokeCO: data.data.invokeCO
          }
        }
      };
    }
  }
  static getTepDetails(data) {
    const tepDetails = {
      tepDetails: {
        type: DiscountApplicableEnum.TEP_TYPE,
        data: {
          isEnabled: true,
          tepDetails: []
        }
      }
    };
    if (!data || !data.data) return tepDetails;
    else {
      return {
        tepDetails: {
          type: DiscountApplicableEnum.TEP_TYPE,
          data: {
            isEnabled: data.data.isEnabled,
            tepDetails: data.data.tepDetails
          }
        }
      };
    }
  }
  static getGrnDetails(data) {
    const grnDetails = {
      grnDetails: {
        type: DiscountApplicableEnum.GRN_TYPE,
        data: {
          noOfDaysAfterOfferPeriod: 0,
          utilizationPercent: 0,
          isAllowedBeforeOffer: false,
          isSameCfaEligible: false,
          isGrnApplicable: false
        }
      }
    };
    if (!data || !data.data) return grnDetails;
    else {
      return {
        grnDetails: {
          type: DiscountApplicableEnum.GRN_TYPE,
          data: {
            noOfDaysAfterOfferPeriod: data.data.noOfDaysAfterOfferPeriod
              ? data.data.noOfDaysAfterOfferPeriod
              : 0,
            utilizationPercent: data.data.utilizationPercent
              ? data.data.utilizationPercent
              : 0,
            isAllowedBeforeOffer: data.data.isAllowedBeforeOffer,
            isSameCfaEligible: data.data.isSameCfaEligible,
            isGrnApplicable: data.data.isGrnApplicable
          }
        }
      };
    }
  }
  static getApplicableThemeDetails(data) {
    const applicableThme = {
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
      }
    };
    if (!data || !data.data) return applicableThme;
    else {
      return {
        applicableThemes: {
          type: DiscountTypeEnum.HIGH_VALUE_DISCOUNT,

          data: {
            digit1: data.data.digit1,
            digit2: data.data.digit2,
            digit3: data.data.digit3,
            digit4: data.data.digit4,
            digit5: data.data.digit5,
            digit6: data.data.digit6,
            digit8: data.data.digit8,
            digit9: data.data.digit9,
            digit10: data.data.digit10,
            digit11: data.data.digit11,
            digit12: data.data.digit12,
            digit13: data.data.digit13,
            digit14: data.data.digit14
          }
        }
      };
    }
  }

  static getBasicCriteriaDetails(data, type) {
    const basicCriteria = {
      basicCriteria: {
        type: data?.type
          ? data?.type
          : DiscountApplicableEnum.BASIC_CRITERIA_TYPE,
        data: {
          isNarationMandatory: false,
          // maxDiscount: null,
          isTepRecovery: true,
          isEditable:
            type === DiscountTypeEnum.EMPOWERMENT_DISCOUNT &&
            data?.data?.isEditable === true
              ? true
              : false,
          isMultipleTransactionPerDayAllowed: false,
          maxTransactionPerDay: 0,
          ucp: {
            isValue: true,
            value: 0
            // percentage: 0
          },
          startingSerialNo: null,

          tataEmployeeConfig: {
            maxCount: 0
            // uploadMandatory: false,
            // employeeNameMandatory: false
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
          isApplicableForAutomatedDiscount: false,
          minKarateEligibleForGEP: null
        }
      }
    };
    if (!data || !data.data) return basicCriteria;
    else {
      return {
        basicCriteria: {
          type: data?.type
            ? data?.type
            : DiscountApplicableEnum.BASIC_CRITERIA_TYPE,
          data: {
            isNarationMandatory: data.data.isNarationMandatory,
            // maxDiscount: data.data.maxDiscount ? data.data.maxDiscount : null,
            isTepRecovery: data.data.isTepRecovery,
            isEditable: data.data.isEditable,
            isMultipleTransactionPerDayAllowed:
              data.data.isMultipleTransactionPerDayAllowed,
            maxTransactionPerDay: data.data.maxTransactionPerDay
              ? data.data.maxTransactionPerDay
              : 0,
            ucp: {
              isValue: data.data.isBillValue,
              value: data.data.ucpValue
              // percentage: data.data.ucp?.percentage
            },
            startingSerialNo: data.data.startingSerialNo
              ? data.data.startingSerialNo
              : null,

            tataEmployeeConfig: {
              maxCount: data.data.maxCount ? data.data.maxCount : 0
              // uploadMandatory: data.data?.isUploadMandatory
              //   ? data.data?.isUploadMandatory
              //   : null,
              // employeeNameMandatory: data.data?.isNameMandatory
            },
            // TODO : Map coin offer config fields
            coinConfig: {
              tepCNPercentage: data?.data?.tepCNUtilizationPercent
                ? data.data.tepCNUtilizationPercent
                : 0,
              coinPurchasePeriod: {
                from: data?.data?.coinPurchaseStartDate
                  ? data.data.coinPurchaseStartDate
                  : null,
                to: data?.data?.coinPurchaseEndDate
                  ? data.data.coinPurchaseEndDate
                  : null
              },
              tepPeriod: {
                from: data?.data?.tepPeriodStartDate
                  ? data.data.tepPeriodStartDate
                  : null,
                to: data?.data?.tepPeriodEndDate
                  ? data.data.tepPeriodEndDate
                  : null
              },
              makingChargePercentage: data?.data?.mCPercent
                ? data.data.mCPercent
                : 0
            },
            isFullValueTepDiscountRecovery:
              data.data.isFullValueTepDiscountRecovery,
            isApplicableForAutomatedDiscount: data.data
              ?.isApplicableForAutomatedDiscount
              ? data.data.isApplicableForAutomatedDiscount
              : null,
            minKarateEligibleForGEP: data.data?.minKarateEligibleForGEP
              ? data.data?.minKarateEligibleForGEP
              : null
          }
        }
      };
    }
  }
  static getClubOtherOffersConfig(data) {
    const clubOtherOffersConfig = {
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
      }
    };
    if (!data || !data.data) return clubOtherOffersConfig;
    else {
      return {
        clubOtherOffersConfig: {
          type: DiscountApplicableEnum.CLUB_OTHER_OFFERS,
          data: {
            isExchangeOffer: data.data.isExchangeOffer,
            isFOCOffer: data.data.isFOCOffer,
            isGHS: data.data.isGHS,
            isRiva: data.data.isRiva,
            // isEmpowerment: data.data.isEmpowerment,
            isDV: data.data.isDV,
            isCoin: data.data.isCoin,
            isBillLevelDiscount: data.data.isBillLevelDiscount
          }
        }
      };
    }
  }

  static getClubDiscountType(data) {
    const clubDiscountType = {
      clubDiscountType: {
        type: DiscountApplicableEnum.CLUB_DISCOUNT_TYPE,
        data: {
          isClubbedOtherDiscounts: false,
          isClubbedOtherBillLevelDiscounts: false,
          discountType: null
        }
      }
    };
    if (!data || !data.data) return clubDiscountType;
    else {
      return {
        clubDiscountType: {
          type: DiscountApplicableEnum.CLUB_DISCOUNT_TYPE,
          data: {
            isClubbedOtherDiscounts: data.data.isClubbedOtherDiscounts,
            isClubbedOtherBillLevelDiscounts:
              data.data.isClubbedOtherBillLevelDiscounts,
            discountType: data.data.discountType ? data.data.discountType : ''
          }
        }
      };
    }
  }
  static getCumulativeDetails(data) {
    const cumulativeDetails = {
      cumulativeDetails: {
        type: DiscountApplicableEnum.CUMULATIVE_TYPE,
        data: { isSameStore: false, isOtherStore: false, isFamilyTree: false }
      }
    };
    if (!data || !data.data) {
      return cumulativeDetails;
    } else {
      return {
        cumulativeDetails: {
          type: DiscountApplicableEnum.CUMULATIVE_TYPE,
          data: {
            isSameStore: data.data.isSameStore,
            isOtherStore: data.data.isOtherStore,
            isFamilyTree: data.data.isFamilyTree
          }
        }
      };
    }
  }
  static getConfigDetails(data) {
    if (data && data.type === DiscountTypeEnum.TSSS_DISCOUNT) {
      const configDetails = {
        configDetails: {
          type: DiscountTypeEnum.TSSS_DISCOUNT,
          data: {
            noOfCoupons: null,
            noOfDigits: null,
            startingDigits: null
          }
        }
      };
      if (!data || !data.data) {
        return configDetails;
      } else {
        return {
          configDetails: {
            type: DiscountTypeEnum.TSSS_DISCOUNT,
            data: {
              noOfCoupons: data.data.noOfCoupons,
              noOfDigits: data.data.noOfDigits ? data.data.noOfDigits : null,
              startingDigits: data.data.startingDigits
            }
          }
        };
      }
    } else if (data && data.type === DiscountTypeEnum.BEST_DEAL_DISCOUNT) {
      const configDetails = {
        configDetails: {
          type: DiscountTypeEnum.BEST_DEAL_DISCOUNT,
          data: {
            isSameDiscountApplicable: false,
            binAge: {
              fromValue: null,
              toValue: null
            },
            lotAge: {
              fromValue: null,
              toValue: null
            }
          }
        }
      };
      if (!data || !data.data) {
        return configDetails;
      } else {
        return {
          configDetails: {
            type: DiscountTypeEnum.BEST_DEAL_DISCOUNT,
            data: {
              isSameDiscountApplicable: data.data.isApplicableForNewItem
                ? data.data.isApplicableForNewItem
                : false,
              binAge: {
                fromValue: data?.data?.binAge?.fromValue,
                toValue: data?.data?.binAge?.toValue
              },
              lotAge: {
                fromValue: data?.data?.lotAge?.fromValue,
                toValue: data?.data?.lotAge?.toValue
              }
            }
          }
        };
      }
    } else {
      const configDetails = {
        configDetails: {
          type: DiscountApplicableEnum.EXCHANGE_OFFER_CONFIG,
          data: {
            applicableCN: {
              isTep: false,
              isGep: false
            },
            minCNUtilizationPercent: null,
            minKarateEligibleForGEP: null,
            isResidualFund: false
          }
        }
      };
      if (!data || !data.data) {
        return configDetails;
      } else {
        return {
          configDetails: {
            type: DiscountApplicableEnum.EXCHANGE_OFFER_CONFIG,
            data: {
              applicableCN: data.data.applicableCN,
              minCNUtilizationPercent: data.data.minCNUtilizationPercent
                ? data.data.minCNUtilizationPercent
                : null,
              minKarateEligibleForGEP: data.data.minKarateEligibleForGEP
                ? data.data.minKarateEligibleForGEP
                : null,
              isResidualFund: data.data.isResidualFund
            }
          }
        };
      }
    }
  }

  static getitemGroupConfigDetails(data) {
    const configDetails = {
      itemGroupConfig: {
        type: DiscountApplicableEnum.BEST_DEAL_TYPE,
        data: {
          maxMetalCharge: {
            percent: 0,
            value: 0.0
          },
          maxStoneCharges: {
            percent: 0,
            value: 0.0
          },
          maxUCP: {
            percent: 0,
            value: 0.0
          },
          maxWastage: {
            percent: 0,
            value: 0.0
          },
          maxMC: {
            percent: 0,
            value: 0.0
          },
          maxPsPerGram: {
            percent: 0,
            weight: 0.0
          }
        }
      }
    };
    if (!data || !data.data) {
      return configDetails;
    } else {
      // return null;
      // return {
      //   itemGroupConfig: {
      //     type: DiscountApplicableEnum.BEST_DEAL_TYPE,
      //     data: {
      //       maxMetalCharge: {
      //         percent: data.data.maxMetalCharge.percent,
      //         value: data.data.maxMetalCharge.value
      //       },
      //       maxStoneCharges: {
      //         percent: data.data.maxStoneCharges.percent,
      //         value: data.data.maxStoneCharges.value
      //       },
      //       maxUCP: {
      //         percent: data.data.maxUCP.percent,
      //         value: data.data.maxUCP.value
      //       },
      //       maxWastage: {
      //         percent: data.data.maxWastage.percent,
      //         value: data.data.maxWastage.value
      //       },
      //       maxMC: {
      //         percent: data.data.maxMC.percent,
      //         value: data.data.maxMC.value
      //       },
      //       maxPsPerGram: {
      //         percent: data.data.maxPsPerGram.percent,
      //         weight: data.data.maxPsPerGram.weight
      //       }
      //     }
      //   }
      // };
    }
  }

  static getDiscountLocations(data: any): DiscountLocationSuccessList {
    const locationList: DiscountLocationList[] = [];
    for (const listItem of data.results) {
      locationList.push({
        description: listItem.description ? listItem.description : '',
        configDetails: listItem.configDetails.data
          ? listItem.configDetails.data
          : '',
        id: listItem.id ? listItem.id : '',
        locationCode: listItem.locationCode ? listItem.locationCode : '',
        offerEndDate: moment(listItem.offerEndDate),
        offerStartDate: moment(listItem.offerStartDate),
        previewEndDate: moment(listItem.previewEndDate),
        previewStartDate: moment(listItem.previewStartDate),
        isActive: listItem.status ? listItem.status : false,
        subBrandCode: listItem.subBrandCode ? listItem.subBrandCode : ''
      });
    }
    return {
      discountLocationList: locationList,
      count: data.totalElements
    };
  }
  static getDiscountProductCategories(
    data: any
  ): DiscountProductCategorySuccessList {
    const productCategory: DiscountProductCategoryList[] = [];
    for (const listItem of data.results) {
      productCategory.push({
        discountId: listItem.discountId ? listItem.discountId : '',
        id: listItem.id ? listItem.id : '',
        productCategoryCode: listItem.productCategoryCode
          ? listItem.productCategoryCode
          : '',

        isActive: listItem.isActive ? listItem.isActive : false,
        description: listItem.description ? listItem.description : ''
      });
    }

    return {
      discountProductCategoryList: productCategory,
      count: data.totalElements
    };
  }
  static getDiscountProductGroups(data: any): DiscountProductGroupSuccessList {
    const productGroupList: DiscountProductGroupList[] = [];
    for (const listItem of data.results) {
      productGroupList.push({
        description: listItem.description ? listItem.description : '',
        id: listItem.id ? listItem.id : '',
        discountDetailsId: listItem.discountDetailsId
          ? listItem.discountDetailsId
          : '',
        discountId: listItem.discountId ? listItem.discountId : '',
        eligibleKarat: listItem.eligibleKarat ? listItem.eligibleKarat : '',
        karatType: listItem.karatType ? listItem.karatType : '',
        productGroupCode: listItem.productGroupCode
          ? listItem.productGroupCode
          : '',
        isActive: listItem.isActive ? listItem.isActive : false,
        isDeletable: listItem.isActive ? listItem.isActive : false
      });
    }
    return {
      discountProductGroupList: productGroupList,
      count: data.totalElements
    };
  }
  static getDiscountExcludeItems(data: any): DiscountExcludeItemSuccessList {
    const excludeItem: ExcludeItemList[] = [];
    for (const listItem of data.results) {
      excludeItem.push({
        id: listItem.id ? listItem.id : '',
        discountId: listItem.discountId ? listItem.discountId : '',
        itemCode: listItem.itemCode ? listItem.itemCode : '',
        themeCode: listItem.themeCode ? listItem.themeCode : '',
        schemeCode: listItem.schemeCode ? listItem.schemeCode : '',
        fromValue: listItem.fromValue ? listItem.fromValue : '',
        toValue: listItem.toValue ? listItem.toValue : '',
        isExcluded: listItem.isExcluded ? listItem.isExcluded : false,
        excludeType: listItem.excludeType ? listItem.excludeType : '',
        isActive: listItem.isActive ? listItem.isActive : false
      });
    }

    return {
      discountExcludeItemList: excludeItem,
      count: data.totalElements
    };
  }

  static getMappedLocationList(data: any): MappedDetails[] {
    const locations: MappedDetails[] = [];
    for (const detail of data.results) {
      locations.push({
        uuid: detail.id,
        id: detail.locationCode,
        description: detail.description,
        isActive: detail.isActive
      });
    }

    return locations;
  }

  static getRequestList(res: any): RequestLists {
    const requestLists: DiscountRequestListPayload[] = [];
    for (const data of res.results) {
      requestLists.push({
        processId: data.processId,
        workflowType: data.workflowType,
        discountCode: data.headerData.data?.discountCode,
        discountId: data.headerData.data?.id,
        occasion: data.headerData.data?.occasion,
        createdBy: data.headerData.data?.createdBy,
        discountType: data.headerData.data?.discountType,
        requestRemarks: data.headerData.data?.requestRemarks,
        typeOfRequest: data.headerData.data?.typeOfRequest,
        approvalStatus: data.approvalStatus,
        approvalLevel: data.approvalLevel,
        requestorRemarks: data.requestorRemarks,
        requestedBy: data.requestedBy,
        requestedDate: data.requestedDate,
        approvedBy: data.approvedBy,
        approvedDate: data.approvedDate,
        approverRemarks: data.approverRemarks,
        requestorCode: data.requestorCode,
        approverCode: data.approverCode
      });
    }

    return { requestList: requestLists, totalElements: res.totalElements };
  }
  static getMappedProductGroupList(data: any): MappedDetails[] {
    const productGroups: MappedDetails[] = [];
    for (const detail of data.results) {
      productGroups.push({
        uuid: detail.id,
        id: detail.productGroupCode,
        description: detail.description
      });
    }

    return productGroups;
  }
  static getMappedProductCategoryList(data: any): MappedDetails[] {
    const productCategories: MappedDetails[] = [];
    for (const detail of data.results) {
      productCategories.push({
        uuid: detail.id,
        id: detail.productCategoryCode,
        description: detail.description
      });
    }

    return productCategories;
  }

  static getMappedBestDealDsicountList(
    data: any
  ): MappedBestDealDiscountSuccessList {
    const bestDealDiscounts: MappedDetails[] = [];
    for (const detail of data.results) {
      bestDealDiscounts.push({
        id: detail.id,
        description: detail.destDiscountCode,
        isActive: detail.isActive
      });
    }

    return {
      mappedDetails: bestDealDiscounts,
      count: data.totalElements
    };
    // return bestDealDiscounts;
  }
  static getLOVTypes(data: any): DiscountLOVTypes[] {
    const discountTypes: DiscountLOVTypes[] = [];
    for (const detail of data.results) {
      discountTypes.push({
        value: detail.code,
        description: detail.value
      });
    }
    return discountTypes;
  }

  static getDiscountSlabDetails(data: any): DiscountSlabDetails[] {
    if (!data) return null;

    let discountSlabDetails: DiscountSlabDetails[] = [];

    if (data && data.length !== 0) {
      for (const discDetail of data) {
        discountSlabDetails.push({
          discountCategory: discDetail.discountCategory,
          discountComponents: this.getDiscountComponents(
            discDetail.discountComponents
          ),
          discountId: discDetail.discountId,
          eligibility: discDetail.eligibility,
          id: discDetail.id,
          isActive: discDetail.isActive,
          isSingle: discDetail.isSingle,
          maxValue: discDetail.maxValue,
          minValue: discDetail.minValue,
          rowId: discDetail.rowId,
          slabName: discDetail.slabName,
          productGroupCount: discDetail.productGroupCount,
          valuePerWeightType:
            discDetail.discountComponents.length !== 0
              ? discDetail.discountComponents[0]?.data?.rsPerGram?.isGrossWeight
                ? 'GrossWt'
                : 'NetWt'
              : 'GrossWt'
        });
      }
    }

    discountSlabDetails = discountSlabDetails.sort((a, b) =>
      a.rowId < b.rowId ? -1 : 1
    );
    return discountSlabDetails;
  }

  static getDiscountEmpowermentDetails(data: any): EmpowerConfigItem[] {
    if (!data) return null;

    let discountEmpowermentDetails: EmpowerConfigItem[] = [];

    if (data && data.length !== 0) {
      for (const discDetail of data) {
        discountEmpowermentDetails.push({
          discountPercent: discDetail?.discountPercent,
          is_metal_charges:
            discDetail?.configDetails[0]?.data?.is_metal_charges,
          is_stone_charges:
            discDetail?.configDetails[0]?.data?.is_stone_charges,
          is_making_charges:
            discDetail?.configDetails[0]?.data?.is_making_charges,
          is_ucp_charges: discDetail?.configDetails[0]?.data?.is_ucp_charges,
          discountId: discDetail?.discountId,
          id: discDetail?.id,
          isActive: discDetail?.isActive,
          maxValue: discDetail?.maxValue,
          minValue: discDetail?.minValue,
          rowId: discDetail?.rowId,
          isEditable:
            discDetail?.isEditable !== null ? discDetail?.isEditable : true
        });
      }
    }

    discountEmpowermentDetails = discountEmpowermentDetails.sort((a, b) =>
      a.rowId < b.rowId ? -1 : 1
    );
    return discountEmpowermentDetails;
  }

  static getMappedProductGroup(data: any) {
    const selectedProductGroups: ProductGroupMappingOption[] = [];

    for (const p of data.results) {
      selectedProductGroups.push({
        uuid: p.id,
        id: p.productGroupCode,
        isActive: p.isActive,
        description: p.description,
        isDeletable: p.isDeletable
      });
    }

    return selectedProductGroups;
  }

  static getDiscountComponents(data: any): ValuePercentageConfigData {
    const discountComponents: ValuePercentageConfigData = {
      regular: {
        ucp: {
          isPercent: true,
          value: 0
        },
        mcCharges: {
          isPercent: true,
          value: 0
        },
        // wcCharges: {
        //   isPercent: true,
        //   value: 0
        // },
        goldCharges: {
          isPercent: true,
          value: 0
        },
        stoneCharges: {
          isPercent: true,
          value: 0
        },
        rsPerGram: {
          isPercent: false,
          value: 0
        }
      },
      preview: {
        ucp: {
          isPercent: true,
          value: 0
        },
        mcCharges: {
          isPercent: true,
          value: 0
        },
        // wcCharges: {
        //   isPercent: true,
        //   value: 0
        // },
        goldCharges: {
          isPercent: true,
          value: 0
        },
        stoneCharges: {
          isPercent: true,
          value: 0
        },
        rsPerGram: {
          isPercent: false,
          value: 0
        }
      },
      ab: {
        ucp: {
          isPercent: true,
          value: 0
        },
        mcCharges: {
          isPercent: true,
          value: 0
        },
        // wcCharges: {
        //   isPercent: true,
        //   value: 0
        // },
        goldCharges: {
          isPercent: true,
          value: 0
        },
        stoneCharges: {
          isPercent: true,
          value: 0
        },
        rsPerGram: {
          isPercent: false,
          value: 0
        }
      },
      co: {
        ucp: {
          isPercent: true,
          value: 0
        },
        mcCharges: {
          isPercent: true,
          value: 0
        },
        // wcCharges: {
        //   isPercent: true,
        //   value: 0
        // },
        goldCharges: {
          isPercent: true,
          value: 0
        },
        stoneCharges: {
          isPercent: true,
          value: 0
        },
        rsPerGram: {
          isPercent: false,
          value: 0
        }
      },
      riva: {
        ucp: {
          isPercent: true,
          value: 0
        },
        mcCharges: {
          isPercent: true,
          value: 0
        },
        // wcCharges: {
        //   isPercent: true,
        //   value: 0
        // },
        goldCharges: {
          isPercent: true,
          value: 0
        },
        stoneCharges: {
          isPercent: true,
          value: 0
        },
        rsPerGram: {
          isPercent: false,
          value: 0
        }
      }
    };

    if (data && data.length !== 0) {
      for (const element of data) {
        const discData = {
          ucp: {
            isPercent: element.data.isUCP?.isPercent
              ? element.data.isUCP?.isPercent
              : false,
            value: element.data.isUCP?.value ? element.data.isUCP?.value : 0
          },
          mcCharges: {
            isPercent: element.data.mcCharges.isPercent
              ? element.data.mcCharges.isPercent
              : false,
            value: element.data.mcCharges.value
              ? element.data.mcCharges.value
              : 0
          },
          // wcCharges: {
          //   isPercent: element.data.wcCharges.isPercent
          //     ? element.data.wcCharges.isPercent
          //     : false,
          //   value: element.data.wcCharges.value
          //     ? element.data.wcCharges.value
          //     : 0
          // },
          goldCharges: {
            isPercent: element.data.goldCharges.isPercent
              ? element.data.goldCharges.isPercent
              : false,
            value: element.data.goldCharges.value
              ? element.data.goldCharges.value
              : 0
          },
          stoneCharges: {
            isPercent: element.data.stoneCharges.isPercent
              ? element.data.stoneCharges.isPercent
              : false,
            value: element.data.stoneCharges.value
              ? element.data.stoneCharges.value
              : 0
          },
          rsPerGram: {
            isPercent: false,
            value: element.data.rsPerGram.weight
              ? element.data.rsPerGram.weight
              : 0
          }
        };
        if (element.type === DiscountCompEnum.REGULAR) {
          discountComponents.regular = discData;
        }
        if (element.type === DiscountCompEnum.PREVIEW) {
          discountComponents.preview = discData;
        }
        if (element.type === DiscountCompEnum.AB) {
          discountComponents.ab = discData;
        }
        if (element.type === DiscountCompEnum.CO) {
          discountComponents.co = discData;
        }
        if (element.type === 'RIVAAH') {
          discountComponents.riva = discData;
        }
      }
    }

    return discountComponents;
  }

  static getAbCoDetails(data: any) {
    const abCoData = {
      abCoData: {
        type: DiscountApplicableEnum.AB_CO_DATA,
        data: {
          abDiscount: {
            preview: false,
            regular: false,
            ab: false,
            postAB: false,
            postRegular: false
          },
          coDiscount: {
            preview: false,
            regular: false,
            co: false,
            postCO: false,
            postRegular: false
          }
        }
      }
    };
    if (!data || !data.data) return abCoData;
    else {
      return {
        abCoData: {
          type: DiscountApplicableEnum.AB_CO_DATA,
          data: {
            abDiscount: {
              preview: data.data.abDiscount?.preview,
              regular: data.data.abDiscount?.regular,
              ab: data.data.abDiscount?.ab,
              postAB: data.data.abDiscount?.postAB,
              postRegular: data.data.abDiscount?.postRegular
            },
            coDiscount: {
              preview: data.data.coDiscount?.preview,
              regular: data.data.coDiscount?.regular,
              co: data.data.coDiscount?.co,
              postCO: data.data.coDiscount?.postCO,
              postRegular: data.data.coDiscount?.postRegular
            }
          }
        }
      };
    }
  }
  static getSubBrandsList(data: any): SubBrands[] {
    const productGroups: SubBrands[] = [];
    for (const detail of data.results) {
      productGroups.push({
        value: detail.brandCode,
        description: detail.description
      });
    }

    return productGroups;
  }

  static getRangeTepDuration(data: any): WeightRange[] {
    const tepDurationRange: WeightRange[] = [];
    for (const tepDurationRangeData of data.results) {
      tepDurationRange.push({
        range:
          tepDurationRangeData.fromRange + '-' + tepDurationRangeData.toRange,
        id: tepDurationRangeData.id,
        rowId: tepDurationRangeData.rowId
      });
    }

    return tepDurationRange;
  }

  static getTSSSConfigCouponUrl(data: any, fileName): TSSSResponsePayload {
    const tsssConfigUrlResponse: TSSSResponsePayload = {
      filename: fileName,
      url: data
    };
    return tsssConfigUrlResponse;
  }
  // static brandSummary(data: any): BrandSummary[] {
  //   const brandData: BrandSummary[] = [];
  //   for (const brand of data.results) {
  //     brandData.push({
  //       brandCode: brand.brandCode,
  //       description: brand.description
  //     });
  //   }
  //   return brandData;
  // }
}
