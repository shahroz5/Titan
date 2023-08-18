import {
  ExcludeItemCodes, ExcludeThemeCodes, FileResponse, GepDetails, GEPPurityConfig, GEPPurityConfigResponse, ItemType, Lov, MetalTypes, ProductGroupsDeduction, PurityDetailsResponse, Ranges
} from '@poss-web/shared/models';

export class GEPPurityConfigurationAdaptor {
  static getGepPurityConfigList(data: any): GEPPurityConfigResponse {
    const gepPurityConfigList: GEPPurityConfig[] = [];
    let gepPurityConfigListing: GEPPurityConfigResponse;
    for (const listItem of data.results) {
      gepPurityConfigList.push({
        description: listItem.description,
        isActive: listItem.isActive,
        configId: listItem.configId,
        createdDate: listItem.createdDate
      });
    }
    gepPurityConfigListing = {
      gepPurityConfigList: gepPurityConfigList,
      totalElements: data.totalElements
    };
    return gepPurityConfigListing;
  }
  static getGepPurityConfigSearch(data: any): GEPPurityConfig[] {
    const gepPurityConfigSearch: GEPPurityConfig[] = [];
    for (const listItem of data.results) {
      gepPurityConfigSearch.push({
        isActive: listItem.isActive,
        description: listItem.description,
        configId: listItem.configId,
        createdDate: listItem.createdDate
      });
    }
    return gepPurityConfigSearch;
  }
  static getItemTypes(data: any): ItemType[] {
    const itemTypes: ItemType[] = [];
    for (const itemType of data.values) {
      itemTypes.push({
        itemCode: itemType.code,
        description: itemType.value
      });
    }
    return itemTypes;
  }
  static getMetalTypes(data: any): MetalTypes[] {
    const metalTypes: MetalTypes[] = [];
    for (const metal of data.results) {
      metalTypes.push({
        materialTypeCode: metal.itemTypeCode,
        description: metal.description
      });
    }
    return metalTypes;
  }
  static getRanges(data: any): Ranges[] {
    const ranges: Ranges[] = [];
    for (const range of data.results) {
      ranges.push({
        fromRange: range.fromRange,
        toRange: range.toRange,
        range: range.fromRange + '-' + range.toRange,
        id: range.id
      });
    }
    return ranges;
  }
  static excludeThemeCodes(data: any): ExcludeThemeCodes[] {
    const excludeThemeCodes: ExcludeThemeCodes[] = [];
    for (const themeCodes of data.results) {
      excludeThemeCodes.push({
        configId: themeCodes.configId,
        id: themeCodes.id,
        isActive: themeCodes.isExcludes,
        themeCode: themeCodes.themeCode
      });
    }
    return excludeThemeCodes;
  }
  static excludeItemCodes(
    data: any
  ): { itemCodes: ExcludeItemCodes[]; totalElements: number } {
    const excludeItemCode: ExcludeItemCodes[] = [];
    for (const itemCodes of data.results) {
      excludeItemCode.push({
        configId: itemCodes.configId,
        id: itemCodes.id,
        isActive: itemCodes.isExcluded,
        itemCode: itemCodes.itemCode
      });
    }
    return { itemCodes: excludeItemCode, totalElements: data.totalElements };
  }
  static searchExcludeItemCode(data: any): ExcludeItemCodes[] {
    const excludeItemCode: ExcludeItemCodes[] = [];
    for (const itemCodes of data.results) {
      excludeItemCode.push({
        configId: itemCodes.configId,
        id: itemCodes.id,
        isActive: itemCodes.isExcluded,
        itemCode: itemCodes.itemCode
      });
    }
    return excludeItemCode;
  }
  static gepItemTypes(data: any): Lov[] {
    const itemTypes: Lov[] = [];
    for (const itemType of data.results) {
      itemTypes.push({
        code: itemType.code,
        value: itemType.value,
        isActive: itemType.isActive
      });
    }
    return itemTypes;
  }

  static getGepDetails(data: any): GepDetails {
    const gepDetails: GepDetails = {
      description: data.description,
      isActive: data.isActive,
      offerDetails: {
        gepCNUtilizationPercentage: data.offerDetails.data
          ?.gepCNUtilizationPercentage
          ? data.offerDetails.data.gepCNUtilizationPercentage
          : '',
        gepDiscountStartDate: data.offerDetails.data?.gepDiscountStartDate
          ? data.offerDetails.data.gepDiscountStartDate
          : '',
        gepDiscountEndDate: data.offerDetails.data?.gepDiscountEndDate
          ? data.offerDetails.data.gepDiscountEndDate
          : '',
        daysForGEPCNAfterOffer: data.offerDetails.data?.daysForGEPCNAfterOffer
          ? data.offerDetails.data.daysForGEPCNAfterOffer
          : '',
        daysForGRNAndRebillingAfterOffer: data.offerDetails.data
          ?.daysForGRNAndRebillingAfterOffer
          ? data.offerDetails.data.daysForGRNAndRebillingAfterOffer
          : '',
        grnCNUtilizationPercentage: data.offerDetails.data
          ?.grnCNUtilizationPercentage
          ? data.offerDetails.data.grnCNUtilizationPercentage
          : '',
        isRivaah: data.offerDetails.data
          ?.isRivaah
          ? data.offerDetails.data.isRivaah
          : '',
      },
      configDetails: {
        gepDaysAfterCOOffer: data.configDetails.data?.gepDaysAfterCOOffer
          ? data.configDetails.data.gepDaysAfterCOOffer
          : '',
        gepDaysAfterABOffer: data.configDetails.data?.gepDaysAfterABOffer
          ? data.configDetails.data.gepDaysAfterABOffer
          : '',
        minKaratAccepted: data.configDetails.data?.minKaratAccepted
          ? data.configDetails.data.minKaratAccepted
          : '',
        gepDiscountDeductionAmt: data.configDetails.data
          ?.gepDiscountDeductionAmt
          ? data.configDetails.data.gepDiscountDeductionAmt
          : '',
        gepAsPayment: data.configDetails.data?.gepAsPayment
          ? data.configDetails.data.gepAsPayment
          : '',
        baseKaratForPurity: data.configDetails.data?.baseKaratForPurity
          ? data.configDetails.data.baseKaratForPurity
          : '',
        holdTime: data.configDetails.data?.holdTime
          ? data.configDetails.data.holdTime
          : '',
        isPreMeltingDetailsMandatory: data.configDetails.data
          ?.isPreMeltingDetailsMandatory
          ? data.configDetails.data.isPreMeltingDetailsMandatory
          : ''
      },
      isOfferEnabled: data.isOfferEnabled,
      configId: data.configId
    };

    return gepDetails;
  }
  static getPurityDetails(data: any): PurityDetailsResponse[] {
    console.log('data', data);
    const purityDetails: PurityDetailsResponse[] = [];
    if (data.results.length > 0) {
      for (const details of data.results) {
        purityDetails.push({
          rangeId: details.rangeId,
          deductionPercent: details.deductionPercent,
          schemePercent: details.schemePercent,
          startDate: details.startDate,
          endDate: details.endDate,
          metalType: details.metalType,
          itemType: details.itemType,
          id: details.id,
          configId: details.configId
        });
      }
    }
    console.log('purityDetials', purityDetails);
    return purityDetails;
  }
  static getDeductionRanges(
    data: any
  ): { productGroupsDeduction: ProductGroupsDeduction[]; count: number } {
    const groupsDeduction: ProductGroupsDeduction[] = [];
    for (const deduction of data.results) {
      groupsDeduction.push({
        id: deduction.id,
        productGroupCode: deduction.productGroupCode,
        rangeId: deduction.rangeId,
        percentValue: deduction.percentValue,
        configId: deduction.configId,
        rivaahAdditionalDiscount: deduction?.configDetails?.data?.rivaahAdditionalDiscount
      });
    }
    return {
      productGroupsDeduction: groupsDeduction,
      count: data.totalElements
    };
  }
  static searchProductGroups(data: any): ProductGroupsDeduction[] {
    const groupsDeduction: ProductGroupsDeduction[] = [];
    for (const deduction of data.results) {
      groupsDeduction.push({
        id: deduction.id,
        productGroupCode: deduction.productGroupCode,
        rangeId: deduction.rangeId,
        percentValue: deduction.percentValue,
        configId: deduction.configId,
        rivaahAdditionalDiscount: deduction?.configDetails?.data?.rivaahAdditionalDiscount
      });
    }
    return groupsDeduction;
  }
  static getUploadFileResponse(
    data: any,
    configId?: string
  ): { fileResponse: FileResponse; configId: string } {
    const fileResponse: FileResponse = {
      totalCount: data.records?.totalCount,
      successCount: data.records?.successCount,
      failureCount: data.records?.failureCount,
      errorLogId: data.fileId,
      hasError: data.fileValidationError,
      message: data.message,
      records: data.records,
      uploadType: data.uploadType
    };

    return { fileResponse: fileResponse, configId: configId };
  }
}
