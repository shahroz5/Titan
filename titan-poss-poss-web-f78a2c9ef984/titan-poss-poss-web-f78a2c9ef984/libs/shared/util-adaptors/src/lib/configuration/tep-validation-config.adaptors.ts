import {
  TEPValidationConfigListing,
  TEPValidationConfigResult
} from '@poss-web/shared/models';

export class TepValidationConfigAdaptors {
  static getTepValidationConfigList(data: any): TEPValidationConfigListing {
    const tepValidationConfigList: TEPValidationConfigResult[] = [];
    let tepValidationfigListing: TEPValidationConfigListing;
    for (const tepConfiglistdata of data.results) {
      tepValidationConfigList.push({
        configId: tepConfiglistdata.configId,
        itemCode: tepConfiglistdata.itemCode,
        configDetails: tepConfiglistdata.configDetails,
        configType: tepConfiglistdata.configType,
        description: tepConfiglistdata.description,
        offerDetails: tepConfiglistdata.offerDetails,
        startDate: tepConfiglistdata.startDate,
        endDate: tepConfiglistdata.endDate,
        isOfferEnabled: tepConfiglistdata.isOfferEnabled,
        isActive: tepConfiglistdata.isActive
      });
    }
    tepValidationfigListing = {
      results: tepValidationConfigList,
      totalElements: data.totalElements
    };

    return tepValidationfigListing;
  }

  static getTepValidationConfigDetails(data: any): TEPValidationConfigResult {
    const tepValidationConfig: TEPValidationConfigResult = {
      configId: data.configId,
      description: data.description,
      itemCode: data.itemCode,
      configType: data.configType,
      startDate: data.startDate,
      endDate: data.endDate,
      isActive: data.isActive,
      offerDetails: data.offerDetails,
      isOfferEnabled: data.isOfferEnabled,
      configDetails: data.configDetails
    };

    return tepValidationConfig;
  }

  static getTepValidationDetailsNew(): TEPValidationConfigResult {
    const tepValidationConfig: TEPValidationConfigResult = {
      configId: null,
      description: '',
      itemCode: '',
      configType: '',
      startDate: null,
      endDate: null,
      isActive: true,
      isOfferEnabled: null,
      configDetails: {
        data: {
          fvtCNCancellationDeductionPercent: null,
          isAnnexurePrintingAllowed: false,
          isFVTCNCancellationAllowed: false,
          isInterBrandCashRefundAllowed: false,
          tepCancellationDays: null
        },
        type: 'TEP_VALIDATION_CONFIG'
      },
      offerDetails: null
    };

    return tepValidationConfig;
  }
}
