import {
  DiscountTransactionLevelResponse,
  DiscountItemDetails,
  DiscountsResponse,
  DiscountValueDetails,
  DiscountHeaders,
  Discounts,
  ClubDiscounts,
  DiscountConfigDetailsResponse,
  DiscountConfigDetails,
  LocationOfferDetailsForDiscount,
  GrnConfigDetails,
  DiscountAttributes,
  ClubbingDetails,
  BasicCriteriaDetails,
  OrderConfigDetails,
  TepConfigDetails,
  TepDetails,
  DiscountVoucherDetailsResponePayload,
  SlabConfigDetails,
  ApplicableThemeDetails,
  ApplicableThemeConfig,
  AppliedDiscountMaster,
  DiscountsDetails,
  ClubDiscountsDetails,
  DiscountHeadersDetails,
  RivaahGHSDiscounts
} from '@poss-web/shared/models';
import * as moment from 'moment';

export class DiscountAdaptor {
  static getBillLevelDiscount(data: any): DiscountTransactionLevelResponse {
    if (!data) {
      return null;
    }
    return {
      discountCode: data.discountCode,
      discountId: data.discountId,
      discountType: data.discountType,
      basicCriteriaDetails: {
        isBillValue: data?.basicCriteriaDetails?.isBillValue
          ? data.basicCriteriaDetails.isBillValue
          : null,
        isEditable: data?.basicCriteriaDetails?.isEditable
          ? data.basicCriteriaDetails.isEditable
          : null,
        maxDiscount: data?.basicCriteriaDetails?.maxDiscount
          ? data.basicCriteriaDetails.maxDiscount
          : null,
        maxNoOfTimes: data?.basicCriteriaDetails?.maxNoOfTimes
          ? data.basicCriteriaDetails.maxNoOfTimes
          : null,
        ucpValue: data?.basicCriteriaDetails?.ucpValue
          ? data.basicCriteriaDetails.ucpValue
          : null
      },
      clubbingDetails: data.clubbingDetails,
      itemDetails: this.getItemDetails(data.itemDetails),
      discountValue: data.discountValue ? data.discountValue : 0
    };
  }
  static getItemDetails(data: any): DiscountItemDetails[] {
    if (!data) {
      return null;
    }
    const itemDetails = [];
    for (const item of data) {
      itemDetails.push(this.itemDetails(item));
    }

    return itemDetails;
  }
  static itemDetails(data: any): DiscountItemDetails {
    if (!data) {
      return null;
    }
    return {
      itemCode: data.itemCode,
      itemId: data.itemId,
      lotNumber: data.lotNumber,
      mfgDate: data.mfgDate,
      productCategoryCode: data.productCategoryCode,
      productGroupCode: data.productGroupCode,
      stockInwardDate: data.stockInwardDate
    };
  }

  static getDiscountsResponse(data: any): DiscountsResponse {
    if (!data) {
      return null;
    }

    return {
      discountCode: data?.discountCode,
      discountId: data?.discountId,
      discountTxnId: data?.discountTxnId,
      discountType: data?.discountType,
      discountValue: data?.discountValue,
      discountSubType: data?.discountSubType,
      /* discountValueDetails: {
        data:
          data.discountValueDetails &&
          data.discountValueDetails.data &&
          data.discountValueDetails.data.discountValueDetails
            ? this.getDiscountValueDetails(
                data.discountValueDetails.data.discountValueDetails
                  ?.gepPurityDiscount
                  ? data.discountValueDetails.data.discountValueDetails
                      ?.gepPurityDiscount
                  : data.discountValueDetails.data.discountValueDetails
              )
            : null,
        type:
          data.discountValueDetails && data.discountValueDetails.type
            ? data?.discountValueDetails?.type
            : null
      }, */
      discountValueDetails: data?.discountValueDetails,
      isEdited: data?.isEdited,
      itemId: data?.itemId,
      referenceId: data?.referenceId,
      status: data.status,
      referenceType: data?.referenceType,
      discountAttributes: this.getDiscountAttributes(
        data?.discountAttributes?.data
      ),
      isNarationMandatory:
        data?.basicCriteriaDetails?.data?.isNarationMandatory,
      occasion: data?.discountAttributes?.data?.occasion,
      clubbedDiscountId: data?.clubbedDiscountId,
      txnLevelDiscountValueDetails: data?.txnLevelDiscountValueDetails
        ? data?.txnLevelDiscountValueDetails
        : null,
      cummulativeDiscountWithExcludeDetails: data?.cummulativeDiscountWithExcludeDetails
        ? data?.cummulativeDiscountWithExcludeDetails
        : null,
      basicCriteriaDetails: {
        isBillValue: data?.basicCriteriaDetails?.data?.isBillValue
          ? data.basicCriteriaDetails.data.isBillValue
          : null,
        isEditable: data?.basicCriteriaDetails?.data?.isEditable
          ? data.basicCriteriaDetails.data.isEditable
          : null,
        maxDiscount: data?.basicCriteriaDetails?.data?.maxDiscount
          ? data.basicCriteriaDetails.data.maxDiscount
          : null,
        maxNoOfTimes: data?.basicCriteriaDetails?.data?.maxNoOfTimes
          ? data.basicCriteriaDetails.data.maxNoOfTimes
          : null,
        ucpValue: data?.basicCriteriaDetails?.data?.ucpValue
          ? data.basicCriteriaDetails.data.ucpValue
          : null
      },
      rivaahGhsDetails: data?.rivaahGhsDiscountDetails
    };
  }

  static getDiscountValueDetails(data: any): DiscountValueDetails[] {
    if (!data) {
      return null;
    }
    const discountValueDetails = [];
    // let arrayData = data;
    for (const discount of data) {
      discountValueDetails.push({
        component: discount.component,
        discountPercent: discount.discountPercent,
        discountValue: discount.discountValue,
        isDiscountPercentage: discount.isDiscountPercentage,
        maxValue: discount.isDiscountPercentage
          ? discount.discountPercent
          : discount.discountValue
      });
    }
    if (discountValueDetails.length > 0) {
      return discountValueDetails;
    } else {
      return null;
    }
  }

  static getDiscountHeader(data: any): DiscountHeaders {
    if (!data) {
      return null;
    }
    return {
      discounts: this.getDiscounts(data.discounts),
      clubDiscounts: this.getClubDiscounts(data.clubDiscounts),
      cummulativeDiscountWithExcludeDetails:
        data.cummulativeDiscountWithExcludeDetails
    };
  }

  static getDiscounts(data: any): Discounts[] {
    if (!data) {
      return null;
    }

    const discounts: Discounts[] = [];
    for (const item of data) {
      discounts.push({
        discountType: item.discountConfigDetails.discountType,
        discountId: item.discountConfigDetails.discountId,
        discountCode: item.discountConfigDetails.discountCode,
        discountAttributes: item.discountConfigDetails.discountAttributes,
        refDiscountTxnId: item.discountConfigDetails.refDiscountTxnId,
        orderConfigDetails: this.getOrderConfigDetails(
          item.discountConfigDetails.orderConfigDetails
        ),
        rivaahGhsDetails: item.rivaahGhsDetails
      });
    }

    return discounts;
  }

  static getDiscountsDetails(data: any): DiscountsDetails[] {
    if (!data) {
      return null;
    }

    const discounts: DiscountsDetails[] = [];
    for (const item of data) {
      discounts.push({
        discountType: item.discountConfigDetails.discountType,
        discountId: item.discountConfigDetails.discountId,
        discountCode: item.discountConfigDetails.discountCode,
        discountAttributes: item.discountConfigDetails.discountAttributes,
        refDiscountTxnId: item.discountConfigDetails.refDiscountTxnId,
        basicCriteriaDetails: this.getBasicCriteriaDetails(
          item.discountConfigDetails.basicCriteriaDetails
        ),
        clubbingDetails: this.getClubbingDetails(
          item.discountConfigDetails.clubbingDetails
        ),
        grnConfigDetails: this.getGrnConfigDetails(
          item.discountConfigDetails.grnConfigDetails
        ),
        tepConfigDetails: this.getTepConfigDetails(
          item.discountConfigDetails.tepConfigDetails
        ),
        locationOfferDetails: this.getLocationOfferDetails(
          item.discountConfigDetails.locationOfferDetails
        ),
        orderConfigDetails: this.getOrderConfigDetails(
          item.discountConfigDetails.orderConfigDetails
        ),
        linkDiscountDetails: item.discountConfigDetails.linkDiscountDetails,
        slabConfigDetails: this.getSlabConfigDetails(
          item.discountConfigDetails.slabConfigDetails
        ),
        applicableThemeDetails: this.getApplicableThemeDetails(
          item.discountConfigDetails.applicableThemeDetails
        ),
        appliedDiscountComponent:
          item.discountConfigDetails.appliedDiscountComponent,
        regularDiscountComponent:
          item.discountConfigDetails.regularDiscountComponent,
        slabDiscountComponents:
          item.discountConfigDetails.slabDiscountComponents,
        appliedDiscountComponentType:
          item.discountConfigDetails.appliedDiscountComponentType,
        appliedDiscountMaster: this.getAppliedDiscountMaster(
          item.discountConfigDetails.appliedDiscountMaster
        ),
        productGroups: item.discountConfigDetails.productGroups,
        productCategory: item.discountConfigDetails.productCategory,
        excludeConfig: item.discountConfigDetails.excludeConfigDto,
        rivaahGhsDetails: item.rivaahGhsDetails
      });
    }

    return discounts;
  }

  static getClubDiscounts(data: any): ClubDiscounts[] {
    if (!data) {
      return null;
    }

    const cluDiscounts = [];
    for (const item of data) {
      cluDiscounts.push({
        clubDiscountId: item.clubbingId,
        discounts: this.getDiscounts(item.discounts)
      });
    }

    return cluDiscounts;
  }

  static getClubDiscountsDetails(data: any): ClubDiscountsDetails[] {
    if (!data) {
      return null;
    }

    const cluDiscounts = [];
    for (const item of data) {
      cluDiscounts.push({
        clubDiscountId: item.clubbingId,
        discounts: this.getDiscountsDetails(item.discounts)
      });
    }

    return cluDiscounts;
  }

  static getDiscountHeaderDetails(data: any): DiscountHeadersDetails {
    if (!data) {
      return null;
    }
    return {
      discounts: this.getDiscountsDetails(data.discounts),
      clubDiscounts: this.getClubDiscountsDetails(data.clubDiscounts)
    };
  }

  static getDiscountConfigDetailsResponse(
    data: any,
    existingDisc?: any,
    refDiscountTxnId?: any
  ): DiscountConfigDetailsResponse {
    if (!data) {
      return null;
    }
    console.log('getDiscountConfigDetailsResponse data', data);
    console.log('getDiscountConfigDetailsResponse existingDisc', existingDisc);
    const discountDetails = this.getDiscountValueDetails(
      data.discountValueDetails
    );

    if (!existingDisc) {
      const res = {
        discountConfigDetails: this.getDiscountConfigDetails(
          data.discountConfigDetails ? data.discountConfigDetails : data,
          refDiscountTxnId
        ),
        discountValue: data.discountValue,
        discountValueDetails: discountDetails,
        existingDiscounts: existingDisc ? existingDisc : null,
        rivaahGhsDetails: data.rivaahGhsDetails
      };

      // console.log('getDiscountConfigDetailsResponse res with out edit', res);
      return res;
    } else {
      const configMap = new Map();
      discountDetails.forEach(d => configMap.set(d.component, d.maxValue));
      // console.log('getDiscountConfigDetailsResponse Dv', configMap);
      const res = {
        discountConfigDetails: this.getDiscountConfigDetails(
          data.discountConfigDetails ? data.discountConfigDetails : data,
          refDiscountTxnId
        ),
        discountValue: data.discountValue,
        discountValueDetails: discountDetails,
        existingDiscounts: {
          ...existingDisc,
          discountValueDetails: {
            type: existingDisc?.discountValueDetails.type,
            data: (existingDisc?.discountValueDetails?.data
              ?.discountValueDetails
              ? existingDisc?.discountValueDetails?.data?.discountValueDetails
              : existingDisc.discountValueDetails?.data
            ).map(d => ({
              ...d,
              maxValue: configMap.get(d.component)
            }))
          }
        },
        rivaahGhsDetails: data.rivaahGhsDetails
      };

      // console.log('getDiscountConfigDetailsResponse res with edit', res);
      return res;
    }
  }

  static getDiscountConfigDetails(
    data: any,
    refDiscountTxnId: any
  ): DiscountConfigDetails {
    if (!data) {
      return null;
    }

    return {
      basicCriteriaDetails: this.getBasicCriteriaDetails(
        data.basicCriteriaDetails
      ),
      clubbingDetails: this.getClubbingDetails(data.clubbingDetails),
      discountAttributes: this.getDiscountAttributes(data.discountAttributes),
      discountCode: data.discountCode,
      discountId: data.discountId,
      discountType: data.discountType,
      refDiscountTxnId: refDiscountTxnId,
      grnConfigDetails: this.getGrnConfigDetails(data.grnConfigDetails),
      locationOfferDetails: this.getLocationOfferDetails(
        data.locationOfferDetails
      ),
      orderConfigDetails: this.getOrderConfigDetails(data.orderConfigDetails),
      tepConfigDetails: this.getTepConfigDetails(data.tepConfigDetails)
    };
  }

  static getBasicCriteriaDetails(data: any): BasicCriteriaDetails {
    const basicCriteria = {
      coinPurchaseEndDate: null,
      coinPurchaseStartDate: null,
      isBillValue: false,
      isEditable: false,
      isFullValueTepRecovery: false,
      isMultipleTrnsctnAllowedOnSameDay: false,
      isNameMandatory: false,
      isNarationMandatory: false,
      isTepRecovery: false,
      isUploadMandatory: false,
      maxDiscount: 0,
      maxNoOfTimes: 0,
      tepPeriodEndDate: null,
      tepPeriodStartDate: null,
      startingSerialNoEmpDiscountType: 0,
      startingSerialNoTataEmpDiscountType: 0,
      tepCNUtilizationPercent: 0,
      ucpValue: 0
    };

    if (!data) {
      return basicCriteria;
    }

    return {
      coinPurchaseEndDate: data.coinPurchaseEndDate,
      coinPurchaseStartDate: data.coinPurchaseEndDate,
      isBillValue: data.isBillValue,
      isEditable: data.isEditable,
      isFullValueTepRecovery: data.isFullValueTepRecovery,
      isMultipleTrnsctnAllowedOnSameDay: data.isMultipleTrnsctnAllowedOnSameDay,
      isNameMandatory: data.isNameMandatory,
      isNarationMandatory: data.isNarationMandatory,
      isTepRecovery: data.isTepRecovery,
      isUploadMandatory: data.isUploadMandatory,
      maxDiscount: !!data.maxDiscount ? data.maxDiscount : 0,
      maxNoOfTimes: data.maxNoOfTimes,
      tepPeriodEndDate: data.tepPeriodEndDate,
      tepPeriodStartDate: data.tepPeriodStartDate,
      startingSerialNoEmpDiscountType: data.startingSerialNoEmpDiscountType,
      startingSerialNoTataEmpDiscountType:
        data.startingSerialNoTataEmpDiscountType,
      tepCNUtilizationPercent: data.tepCNUtilizationPercent,
      ucpValue: data.ucpValue,
      isFullValueTepDiscountRecovery: data.isFullValueTepDiscountRecovery,
      startingSerialNo: data.startingSerialNo,
      makingChargePercent: data.makingChargePercent,
      maxCount: data.maxCount,
      isApplicableForAutomatedDiscount: data.isApplicableForAutomatedDiscount
    };
  }

  static getClubbingDetails(data: any): ClubbingDetails {
    const clubbingDetails = {
      isBillLevelDiscount: false,
      isCBOOffer: false,
      isCoin: false,
      isDV: false,
      isEmpowerment: false,
      isExchangeOffer: false,
      isFOCOffer: false,
      isGHS: false,
      isOtherBillLevelDiscount: false,
      isRiva: false
    };
    if (!data) {
      return clubbingDetails;
    }

    return {
      isBillLevelDiscount: data.isBillLevelDiscount,
      isCBOOffer: data.isCBOOffer,
      isCoin: data.isCoin,
      isDV: data.isDV,
      isEmpowerment: data.isEmpowerment,
      isExchangeOffer: data.isExchangeOffer,
      isFOCOffer: data.isFOCOffer,
      isGHS: data.isGHS,
      isOtherBillLevelDiscount: data.isOtherBillLevelDiscount,
      isRiva: data.isRiva
    };
  }

  static getDiscountAttributes(data: any): DiscountAttributes {
    const discountAttributes = {
      clubbingDiscountType: null,
      isAccrualUlpPoints: false,
      isRiva: false,
      occasion: null
    };
    if (!data) {
      return discountAttributes;
    }

    return {
      clubbingDiscountType: data.clubbingDiscountType,
      isAccrualUlpPoints: data.isAccrualUlpPoints,
      isRiva: data.isRiva,
      occasion: data.occasion
    };
  }

  static getGrnConfigDetails(data: any): GrnConfigDetails {
    const grnConfigDetails = {
      isAllowedBeforeOffer: false,
      isSameCfaEligible: false,
      noOfDaysAllowedAfterOfferPeriod: 0,
      noOfDaysAllowedBeforeOfferPeriod: 0,
      utilizationPercent: 0
    };
    if (!data) {
      return grnConfigDetails;
    }

    return {
      isAllowedBeforeOffer: data.isAllowedBeforeOffer,
      isSameCfaEligible: data.isSameCfaEligible,
      noOfDaysAllowedAfterOfferPeriod: data.noOfDaysAllowedAfterOfferPeriod,
      noOfDaysAllowedBeforeOfferPeriod: data.noOfDaysAllowedBeforeOfferPeriod,
      utilizationPercent: data.utilizationPercent
    };
  }

  static getLocationOfferDetails(data: any): LocationOfferDetailsForDiscount {
    const locationOfferDetails = { offerEndDate: null, offerStartDate: null };
    if (!data) {
      return locationOfferDetails;
    }

    return {
      offerEndDate: data.offerEndDate,
      offerStartDate: data.offerStartDate,
      configDetails: data.configDetails,
      empowermentQuarterMaxDiscountValue:
        data.empowermentQuarterMaxDiscountValue,
      previewOfferStartDate: data.previewOfferStartDate,
      previewOfferEndDate: data.previewOfferEndDate
    };
  }

  static getOrderConfigDetails(data: any): OrderConfigDetails {
    const orderConfigDetails = {
      abPercent: 0,
      coPercent: 0,
      isAllowedToChangeAB: false,
      isAllowedToChangeCO: false,
      isDisplayOnAB: false,
      isDisplayOnCO: false,
      isGoldRateFrozenForAB: false,
      isGoldRateFrozenForCO: false,
      offerPeriodForAB: 0,
      offerPeriodForCO: 0
    };
    if (!data) {
      return orderConfigDetails;
    }

    return {
      abPercent: data.abPercent,
      coPercent: data.coPercent,
      isAllowedToChangeAB: data.isAllowedToChangeAB,
      isAllowedToChangeCO: data.isAllowedToChangeCO,
      isDisplayOnAB: data.isDisplayOnAB,
      isDisplayOnCO: data.isDisplayOnCO,
      isGoldRateFrozenForAB: data.isGoldRateFrozenForAB,
      isGoldRateFrozenForCO: data.isGoldRateFrozenForCO,
      offerPeriodForAB: data.offerPeriodForAB,
      offerPeriodForCO: data.offerPeriodForCO
    };
  }

  static getTepConfigDetails(data: any): TepConfigDetails {
    const tepConfigDetails = {
      enabled: false,
      tepDetails: [
        {
          durationInDays: null,
          recoveryPercent: 0
        }
      ]
    };
    if (!data) {
      return tepConfigDetails;
    }

    return {
      enabled: data.enabled,
      tepDetails: this.getTepDetails(data.tepDetails)
    };
  }

  static getTepDetails(data: any): TepDetails[] {
    if (!data) {
      return null;
    }

    const tepDetails = [];
    for (const item of data) {
      tepDetails.push({
        durationInDays: item.durationInDays,
        recoveryPercent: item.recoveryPercent
      });
    }

    return tepDetails;
  }

  static getDiscountVoucherDetails(
    data: any
  ): DiscountVoucherDetailsResponePayload {
    if (!data) {
      return null;
    }
    return {
      accountCustomerId: data.accountCustomerId,
      accountNo: data.accountNo,
      customerId: data.customerId,
      customerName: data.customerName,
      discountAmount: data.discountAmount,
      ghScheme: data.ghScheme,
      id: data.id,
      installmentAmount: data.installmentAmount,
      isGoldCoinAllowed: data.isGoldCoinAllowed,
      issueDate: moment(data.issueDate),
      mobileNo: data.mobileNNo,
      noOfInstallmentsPaid: data.noOfInstallmentsPaid,
      redeemptionDate: moment(data.redeemptionDate),
      status: data.status,
      validFrom: moment(data.validFrom),
      validTill: moment(data.validTill),
      voucherNo: data.voucherNo
    };
  }

  static getSlabConfigDetails(data: any): SlabConfigDetails {
    if (!data) {
      return null;
    }
    return {
      discountCategory: data.discountCategory,
      eligibilityDetails: data.eligibilityDetails,
      isSingle: data.isSingle
    };
  }

  static getApplicableThemeDetails(data: any): ApplicableThemeDetails {
    if (!data) {
      return null;
    }
    return {
      type: data.type,
      data: this.getApplicableThemes(data.data)
    };
  }

  static getApplicableThemes(data: any): ApplicableThemeConfig {
    if (!data) {
      return null;
    }
    return {
      digit1: data.digit1,
      digit2: data.digit2,
      digit3: data.digit3,
      digit4: data.digit4,
      digit5: data.digit5,
      digit6: data.digit6,
      digit8: data.digit8,
      digit9: data.digit9,
      digit10: data.digit10,
      digit11: data.digit11,
      digit12: data.digit12,
      digit13: data.digit13,
      digit14: data.digit14
    };
  }

  static getAppliedDiscountMaster(data: any): AppliedDiscountMaster {
    if (!data) {
      return null;
    }
    return {
      createdBy: data.createdBy ? data.createdBy : null,
      createdDate: data.createdDate ? data.createdDate : null,
      lastModifiedBy: data.lastModifiedBy ? data.lastModifiedBy : null,
      lastModifiedDate: data.lastModifiedDate ? data.lastModifiedDate : null,
      isActive: data.isActive ? data.isActive : null,
      srcSyncId: data.srcSyncId ? data.srcSyncId : null,
      destSyncId: data.destSyncId ? data.destSyncId : null,
      discountCode: data.discountCode ? data.discountCode : null,
      description: data.description ? data.description : null,
      approvedBy: data.approvedBy ? data.approvedBy : null,
      discountType: data.discountType ? data.discountType : null,
      occasion: data.occasion ? data.occasion : null,
      subBrandCode: data.subBrandCode ? data.subBrandCode : null,
      brandCode: data.brandCode ? data.brandCode : null,
      isPreviewApplicable: data.isPreviewApplicable
        ? data.isPreviewApplicable
        : null,
      isAbOfferApplicable: data.isAbOfferApplicable
        ? data.isAbOfferApplicable
        : null,
      isCoOfferApplicable: data.isAbOfferApplicable
        ? data.isAbOfferApplicable
        : null,
      isRiva: data.isRiva ? data.isRiva : null,
      isAccrualUlp: data.isAccrualUlp ? data.isAccrualUlp : null,
      ulpCreateDate: data.ulpCreateDate ? data.ulpCreateDate : null,
      cumulativeDetails: data.cumulativeDetails ? data.cumulativeDetails : null,
      grnDetails: data.grnDetails ? data.grnDetails : null,
      orderDetails: data.orderDetails ? data.orderDetails : null,
      tepDetails: data.tepDetails ? data.tepDetails : null,
      applicableLevels: data.applicableLevels ? data.applicableLevels : null,
      remarks: data.remarks ? data.remarks : null,
      basicCriteria: data.basicCriteria ? data.basicCriteria : null,
      clubOtherOffersConfig: data.clubOtherOffersConfig
        ? data.clubOtherOffersConfig
        : null,
      clubDiscountType: data.clubDiscountType ? data.clubDiscountType : null,
      abCoData: data.abCoData ? data.abCoData : null,
      configDetails: data.configDetails ? data.configDetails : null,
      itemGroupConfig: data.itemGroupConfig ? data.itemGroupConfig : null,
      applicableThemes: data.applicableThemes ? data.applicableThemes : null,
      clubbingDiscountType: data.clubbingDiscountType
        ? data.clubbingDiscountType
        : null,
      isPublishPending: data.isPublishPending ? data.isPublishPending : null,
      publishTime: data.publishTime ? data.publishTime : null,
      id: data.id ? data.id : null
    };
  }

  static getRivaahGHSDiscounts(data: any): RivaahGHSDiscounts {
    if (!data) {
      return null;
    }
    return {
      clubDiscountDetails: data.clubDiscountDetails.length
        ? this.getBillLevelDiscounts(data.clubDiscountDetails)
        : [],
      discountDetails: data.discountDetails.length
        ? this.getBillLevelDiscounts(data.discountDetails)
        : []
    };
  }

  static getBillLevelDiscounts(data: any): DiscountTransactionLevelResponse[] {
    if (!data) {
      return null;
    }
    const discountDetails = [];
    for (const details of data) {
      discountDetails.push(DiscountAdaptor.getBillLevelDiscount(details));
    }
    return discountDetails;
  }
}
