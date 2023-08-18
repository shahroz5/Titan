import {
  BrandListing,
  BrandMaster,
  BrandMasterListing,
  BrandMasterDetails,
  CMSMSConfiguration,
  Currency,
  PancardConfiguration,
  ResidualAmount,
  BrandConfigDetails,
  BrandCMDetails,
  BrandCustomerDetails,
  BrandTaxDetails,
  BrandPanCardDetails,
  BrandTCSDetails
} from '@poss-web/shared/models';

export class BrandMasterAdaptors {
  static getBrandMasterList(data: any): BrandMasterListing {
    const brandList: BrandMasterDetails[] = [];
    let brandListData: BrandMasterListing;
    for (const brandlistdata of data.results) {
      brandList.push({
        brandCode: brandlistdata.brandCode ? brandlistdata.brandCode : '',
        description: brandlistdata.description ? brandlistdata.description : '',
        parentBrandCode: brandlistdata.parentBrandCode
          ? brandlistdata.parentBrandCode
          : '',
        orgCode: brandlistdata.orgCode ? brandlistdata.orgCode : '',
        isActive: brandlistdata.isActive,
        configDetails: brandlistdata.configDetails
          ? brandlistdata.configDetails
          : ''
      });
    }
    brandListData = {
      results: brandList,
      totalElements: data.totalElements
    };

    return brandListData;
  }

  static getBrandMasterListOld(data: any): BrandListing {
    const brandList: BrandMaster[] = [];
    let brandListData: BrandListing;
    for (const brandlistdata of data.results) {
      brandList.push({
        brandCode: brandlistdata.brandCode ? brandlistdata.brandCode : '',
        description: brandlistdata.description ? brandlistdata.description : '',
        parentBrandCode: brandlistdata.parentBrandCode
          ? brandlistdata.parentBrandCode
          : '',
        orgCode: brandlistdata.orgCode ? brandlistdata.orgCode : '',
        isActive: brandlistdata.isActive,
        configDetails: brandlistdata.configDetails
          ? brandlistdata.configDetails
          : ''
      });
    }
    brandListData = {
      results: brandList,
      totalElements: data.totalElements
    };

    return brandListData;
  }

  static getParentBrandMasterList(data: any): any {
    const parentBrandList: any = [];

    for (const brandlistdata of data.results) {
      parentBrandList.push({
        brandCode: brandlistdata.brandCode ? brandlistdata.brandCode : '',
        parentBrandCode: brandlistdata.parentBrandCode
          ? brandlistdata.parentBrandCode
          : ''
      });
    }

    return parentBrandList;
  }

  static getsearchBrandByBrandCodeData(data: any): BrandMasterListing {
    const brandMasterData: BrandMasterDetails[] = [];
    let brandList: BrandMasterListing;
    brandMasterData.push({
      brandCode: data.brandCode ? data.brandCode : '',
      description: data.description ? data.description : '',
      parentBrandCode: data.parentBrandCode ? data.parentBrandCode : '',
      configDetails: data.configDetails ? data.configDetails : '',
      orgCode: data.orgCode ? data.orgCode : '',
      isActive: data.isActive ? data.isActive : false
    });
    let totalElements;
    if (data) {
      totalElements = 1;
    } else {
      totalElements = 0;
    }
    brandList = {
      results: brandMasterData,
      totalElements: totalElements
    };
    return brandList;
  }

  static getAllBrandDetailsByBrandCode(data: any): BrandMasterDetails {
    let brandMasterData: BrandMasterDetails;

    if (data) {
      const configDetails: BrandConfigDetails = data.configDetails?.data
        ? {
            type: data.configDetails?.type,
            data: {
              numberOfPrintsAllowed:
                data.configDetails?.data?.numberOfPrintsAllowed,
              // dummyMobNo: data.configDetails?.data?.dummyMobNo,
              minUtilizationPercentageforGRF:
                data.configDetails?.data?.minUtilizationPercentageforGRF,
              referCashPaymentConfig:
                data.configDetails?.data?.referCashPaymentConfig,
              isInterbrandTEPAllowed:
                data.configDetails?.data?.isInterbrandTEPAllowed,
              minUtilizationPercentageforGRN:
                data.configDetails?.data?.minUtilizationPercentageforGRN,
              passwordConfigForCashDeposit:
                data.configDetails?.data?.passwordConfigForCashDeposit,
              airpayPaymentExpiry:
                data.configDetails?.data?.airpayPaymentExpiry,
              razorpayPaymentExpiry:
                data.configDetails?.data?.razorpayPaymentExpiry,
              isCustomerMandatoryForDigiGold:
                data.configDetails?.data?.isCustomerMandatoryForDigiGold
            }
          }
        : null;

      const cmDetails: BrandCMDetails = data.cmDetails?.data
        ? {
            type: data.cmDetails?.type,
            data: {
              residualAmountForeGHSTransfer:
                data.cmDetails?.data?.residualAmountForeGHSTransfer,
              smsUserName: data.cmDetails?.data?.smsUserName,
              smsPassword: data.cmDetails?.data?.smsPassword
            }
          }
        : null;

      const panCardDetails: BrandPanCardDetails = data.panCardDetails?.data
        ? {
            type: data.panCardDetails?.type,
            data: {
              configurationAmountForAdvance:
                data.panCardDetails?.data?.configurationAmountForAdvance,
              configurationAmountForCashMemo:
                data.panCardDetails?.data?.configurationAmountForCashMemo,
              configurationAmountForGHS:
                data.panCardDetails?.data?.configurationAmountForGHS,
              configurationAmountForGEP:
                data.panCardDetails?.data?.configurationAmountForGEP,
              configurationAmountForCO:
                data.panCardDetails?.data?.configurationAmountForCO,
              configurationAmountForTEP:
                data.panCardDetails?.data?.configurationAmountForTEP,
              configurationAmountForAcceptAdvance:
                data.panCardDetails?.data?.configurationAmountForAcceptAdvance,
              configurationAmountForGiftCard:
                data.panCardDetails?.data?.configurationAmountForGiftCard,
              configurationAmountForGRF:
                data.panCardDetails?.data?.configurationAmountForGRF,
              editPanDetailsNumber:
                data.panCardDetails?.data?.editPanDetailsNumber,
              isPanCardMandatoryforAdvance:
                data.panCardDetails?.data?.isPanCardMandatoryforAdvance,
              isPanCardMandatoryforCashMemo:
                data.panCardDetails?.data?.isPanCardMandatoryforCashMemo,
              isPanCardMandatoryforGHS:
                data.panCardDetails?.data?.isPanCardMandatoryforGHS,
              isPanCardMandatoryforGEP:
                data.panCardDetails?.data?.isPanCardMandatoryforGEP,
              isPanCardMandatoryforTEP:
                data.panCardDetails?.data?.isPanCardMandatoryforTEP,
              isPanCardMandatoryforCO:
                data.panCardDetails?.data?.isPanCardMandatoryforCO,
              isPanCardMandatoryforGiftCard:
                data.panCardDetails?.data?.isPanCardMandatoryforGiftCard,
              isPanCardMandatoryforAcceptAdvance:
                data.panCardDetails?.data?.isPanCardMandatoryforAcceptAdvance,
              isPanCardMandatoryforGRF:
                data.panCardDetails?.data?.isPanCardMandatoryforGRF,
              isPanCardOnSingleInvoice:
                data.panCardDetails?.data?.isPanCardOnSingleInvoice,
              isPanCardOnCumulativeInvoice:
                data.panCardDetails?.data?.isPanCardOnCumulativeInvoice,
            }
          }
        : null;

      const customerDetails: BrandCustomerDetails = data.customerDetails?.data
        ? {
            type: data.customerDetails?.type,
            data: {
              institutionalMobileNoStartsWith:
                data.customerDetails?.data?.institutionalMobileNoStartsWith,
              internationalMobileNoStartsWith:
                data.customerDetails?.data?.internationalMobileNoStartsWith,
              oneTimeMobileNoStartsWith:
                data.customerDetails?.data?.oneTimeMobileNoStartsWith,
              regularMobileNoStartsWith:
                data.customerDetails?.data?.regularMobileNoStartsWith
            }
          }
        : null;

      const taxDetails: BrandTaxDetails = data.taxDetails?.data
        ? {
            type: data.taxDetails?.type,
            data: {
              isAdvancedCNAllowed: data.taxDetails?.data?.isAdvancedCNAllowed,
              isGhsAllowed: data.taxDetails?.data?.isGhsAllowed,
              isOnSingleInvoice: data.taxDetails?.data?.isOnSingleInvoice,
              bullion: {
                cashAmount: data.taxDetails?.data?.bullion?.cashAmount,
                netInvoiceAmount:
                  data.taxDetails?.data?.bullion?.netInvoiceAmount,
                unitWeight: data.taxDetails?.data?.bullion?.unitWeight
              },
              form60: {
                indianCustomerPercent:
                  data.taxDetails?.data?.form60?.indianCustomerPercent,
                isNetInvoice: data.taxDetails?.data?.form60?.isNetInvoice,
                nonIndianCustomerPercent:
                  data.taxDetails?.data?.form60?.nonIndianCustomerPercent
              },
              jewellery: {
                cashAmount: data.taxDetails?.data?.jewellery?.cashAmount,
                netInvoiceAmount:
                  data.taxDetails?.data?.jewellery?.netInvoiceAmount,
                panCardPercent: data.taxDetails?.data?.jewellery?.panCardPercent
              },
              silverPlatinumConfig: {
                isPlatinumAllowed:
                  data.taxDetails?.data?.silverPlatinumConfig
                    ?.isPlatinumAllowed,
                isSilverAllowed:
                  data.taxDetails?.data?.silverPlatinumConfig?.isSilverAllowed
              }
            }
          }
        : null;

      const brandTcsDetails: BrandTCSDetails = data.brandTcsDetails?.data
        ? {
            type: data.brandTcsDetails?.type,
            data: data.brandTcsDetails?.data ?? null
            // {
            //   b2c: {
            //     tcsApplicableAmount: data.taxDetails?.data?.b2c
            //       .tcsApplicableAmount
            //       ? data.taxDetails?.data?.b2c.tcsApplicableAmount
            //       : '',
            //     tcsBasedOnMobileNumber: data.taxDetails?.data?.b2c
            //       .tcsBasedOnMobileNumber
            //       ? data.taxDetails?.data?.b2c.tcsBasedOnMobileNumber
            //       : false,
            //     tcsBasedOnUlpNumber: data.taxDetails?.data?.b2c
            //       .tcsBasedOnUlpNumber
            //       ? data.taxDetails?.data?.b2c.tcsBasedOnUlpNumber
            //       : false,
            //     tcsApplicableRates: data.taxDetails?.data?.b2c
            //       .tcsApplicableRates
            //       ? data.taxDetails?.data?.b2c.tcsApplicableRates
            //       : [],
            //     grnConfig: {
            //       tcsReverseInCaseOfGRN: data.taxDetails?.data?.b2c.grnConfig
            //         .tcsReverseInCaseOfGRN
            //         ? data.taxDetails?.data?.b2c.grnConfig.tcsReverseInCaseOfGRN
            //         : false,
            //       tcsReverseForInterboutiqueGRN: data.taxDetails?.data?.b2c
            //         .grnConfig.tcsReverseForInterboutiqueGRN
            //         ? data.taxDetails?.data?.b2c.grnConfig
            //             .tcsReverseForInterboutiqueGRN
            //         : false,
            //       tcsReverseForGRnDate: {
            //         afterCalanderMonth: data.taxDetails?.data?.b2c.grnConfig
            //           .tcsReverseForGRnDate.afterCalanderMonth
            //           ? data.taxDetails?.data?.b2c.grnConfig
            //               .tcsReverseForGRnDate.afterCalanderMonth
            //           : false,
            //         sameMonth: data.taxDetails?.data?.b2c.grnConfig
            //           .tcsReverseForGRnDate.sameMonth
            //           ? data.taxDetails?.data?.b2c.grnConfig
            //               .tcsReverseForGRnDate.sameMonth
            //           : false
            //       }
            //     }
            //   },
            //   b2b: null
            // }
          }
        : null;

      brandMasterData = {
        brandCode: data.brandCode,
        description: data.description,
        isActive: data.isActive,
        orgCode: data.orgCode,
        parentBrandCode: data.parentBrandCode,
        configDetails,
        cmDetails,
        customerDetails,
        panCardDetails,
        taxDetails,
        brandTcsDetails
      };
    } else {

      brandMasterData = {
        brandCode: '',
        description: '',
        isActive: false,
        orgCode: '',
        parentBrandCode: '',
        cmDetails: null,
        configDetails: null,
        customerDetails: null,
        taxDetails: null,
        brandTcsDetails: null
      };
    }
    return brandMasterData;
  }

  static getOnlyBrandDetails(data: any): BrandMaster {
    if (data !== null) {
      let brandDetails: BrandMaster;
      brandDetails = {
        brandCode: data.brandCode ? data.brandCode : '',
        parentBrandCode: data.parentBrandCode ? data.parentBrandCode : '',
        orgCode: data.orgCode ? data.orgCode : '',
        description: data.description ? data.description : '',
        isActive: data.isActive,
        configDetails: {
          subBrandConfig: {
            isActive: data.configDetails
              ? data.configDetails.subBrandDetails
                ? data.configDetails.subBrandDetails
                : ''
              : ''
          },
          brandConfigDetails: {
            brandName: data.configDetails
              ? data.configDetails.brandConfigDetails
                ? data.configDetails.brandConfigDetails.brandName
                : ''
              : '',
            brandShortName: data.configDetails
              ? data.configDetails.brandConfigDetails
                ? data.configDetails.brandConfigDetails.brandShortName
                : ''
              : '',
            cashRefundLimit: data.configDetails
              ? data.configDetails.brandConfigDetails
                ? data.configDetails.brandConfigDetails.cashRefundLimit
                : ''
              : '',
            ULPServiceURL: data.configDetails
              ? data.configDetails.brandConfigDetails
                ? data.configDetails.brandConfigDetails.ULPServiceURL
                : ''
              : '',
            // dummyMobNo: data.configDetails
            //   ? data.configDetails.brandConfigDetails
            //     ? data.configDetails.brandConfigDetails.dummyMobNo
            //     : ''
            //   : '',
            brandDetailsCheckBox: data.configDetails
              ? data.configDetails.brandConfigDetails
                ? data.configDetails.brandConfigDetails.brandDetailsCheckBox
                : ''
              : '',

            minUtilizationPercentageforGRN: data.configDetails
              ? data.configDetails.brandConfigDetails
                ? data.configDetails.brandConfigDetails
                    .minUtilizationPercentageforGRN
                  ? data.configDetails.brandConfigDetails
                      .minUtilizationPercentageforGRN
                  : ''
                : ''
              : '',
            passwordConfigForCashDeposit: data.configDetails
              ? data.configDetails.brandConfigDetails
                ? data.configDetails.brandConfigDetails
                    .passwordConfigForCashDeposit
                  ? data.configDetails.brandConfigDetails
                      .passwordConfigForCashDeposit
                  : ''
                : ''
              : ''
          }
        }
      };
      return brandDetails;
    }
  }

  static getOnlyCMSMSConfigurationDetails(data: any): CMSMSConfiguration {
    let cMSMSConfiguration: CMSMSConfiguration;
    if (data) {
      cMSMSConfiguration = {
        SMSUserName: data.configDetails
          ? data.configDetails.CMMSConfiguration
            ? data.configDetails.CMMSConfiguration.SMSUserName
            : ''
          : '',
        SMSPassword: data.configDetails
          ? data.configDetails.CMMSConfiguration
            ? data.configDetails.CMMSConfiguration.SMSPassword
            : ''
          : '',
        centralS3BucketName: data.configDetails
          ? data.configDetails.CMMSConfiguration
            ? data.configDetails.CMMSConfiguration.centralS3BucketName
            : ''
          : '',
        centralS3AccessKey: data.configDetails
          ? data.configDetails.CMMSConfiguration
            ? data.configDetails.CMMSConfiguration.centralS3AccessKey
            : ''
          : '',
        centralS3SecretKey: data.configDetails
          ? data.configDetails.CMMSConfiguration
            ? data.configDetails.CMMSConfiguration.centralS3SecretKey
            : ''
          : '',
        centralS3RegionEndPoint: data.configDetails
          ? data.configDetails.CMMSConfiguration
            ? data.configDetails.CMMSConfiguration.centralS3RegionEndPoint
            : ''
          : '',
        centralWebAPIURL: data.configDetails
          ? data.configDetails.CMMSConfiguration
            ? data.configDetails.CMMSConfiguration.centralWebAPIURL
            : ''
          : '',
        EPOSSServiceURL: data.configDetails
          ? data.configDetails.CMMSConfiguration
            ? data.configDetails.CMMSConfiguration.EPOSSServiceURL
            : ''
          : ''
      };

      return cMSMSConfiguration;
    }
  }

  static getOnlyCurrencyDetails(data: any): Currency {
    let currency: Currency;
    if (data) {
      currency = {
        currencyCheckbox: data.configDetails
          ? data.configDetails.currency
            ? data.configDetails.currency.currencyCheckbox
            : ''
          : '',
        inventoryCurrency: data.configDetails
          ? data.configDetails.currency
            ? data.configDetails.currency.inventoryCurrency
            : ''
          : '',
        STNCurrency: data.configDetails
          ? data.configDetails.currency
            ? data.configDetails.currency.STNCurrency
            : ''
          : '',
        masterCurrency: data.configDetails
          ? data.configDetails.currency
            ? data.configDetails.currency.masterCurrency
            : ''
          : ''
      };
      return currency;
    }
  }

  static getOnlyPanCardDetails(data: any): PancardConfiguration {
    let panCardConfiguration: PancardConfiguration;
    if (data) {
      panCardConfiguration = {
        configurationAmountForCashMemo: data.configDetails
          ? data.configDetails.pancardConfiguration
            ? data.configDetails.pancardConfiguration
                .configurationAmountForCashMemo
            : ''
          : '',
        configurationAmountForAdvance: data.configDetails
          ? data.configDetails.pancardConfiguration
            ? data.configDetails.pancardConfiguration
                .configurationAmountForAdvance
            : ''
          : '',
        pancardCheckkbox: data.configDetails
          ? data.configDetails.pancardConfiguration
            ? data.configDetails.pancardConfiguration.pancardCheckkbox
            : ''
          : ''
      };
      return panCardConfiguration;
    }
  }

  static getOnlyResidualAmount(data: any): ResidualAmount {
    if (data) {
      let residualAmount: ResidualAmount;
      residualAmount = {
        residualAmountForeGHSTransfer: data.configDetails
          ? data.configDetails.residualAmount
            ? data.configDetails.residualAmount.residualAmountForeGHSTransfer
            : ''
          : ''
      };
      return residualAmount;
    }
  }

  static getCurrencyData(data: any): { id: string; name: string }[] {
    const currency: { id: string; name: string }[] = [];
    for (const currencyData of data.results) {
      currency.push({
        id: currencyData.currencyCode,
        name: currencyData.description
      });
    }
    return currency;
  }
}
