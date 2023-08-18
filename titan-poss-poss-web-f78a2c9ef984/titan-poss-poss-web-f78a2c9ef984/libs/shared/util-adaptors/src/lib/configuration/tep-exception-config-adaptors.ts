import {
  TEPExceptiononfigListing,
  TEPExceptionConfig,
  TEPGlobalConfigListing
} from '@poss-web/shared/models';

export class TepExceptionConfigAdaptors {
  static getTepGlobalConfig(data: any): number {
    const maxFlatTepExchangeValue =
      data.results[0]?.configDetails?.data?.maxFlatTepExchangeValue;

    return maxFlatTepExchangeValue ? maxFlatTepExchangeValue : 0;
  }
  static getTepExceptionConfigList(data: any): TEPExceptiononfigListing {
    const tepExceptionConfigList: TEPExceptionConfig[] = [];
    let tepExceptiononfigListing: TEPExceptiononfigListing;
    for (const tepExceptionConfiglistdata of data.results) {
      tepExceptionConfigList.push({
        configId: tepExceptionConfiglistdata?.configId,
        itemCode: tepExceptionConfiglistdata?.itemCode,
        configDetails: tepExceptionConfiglistdata?.configDetails,
        configType: tepExceptionConfiglistdata?.configType,
        description: tepExceptionConfiglistdata?.description,
        customerMobileNos: tepExceptionConfiglistdata?.customerMobileNos,
        offerDetails: tepExceptionConfiglistdata?.offerDetails,
        startDate: tepExceptionConfiglistdata?.startDate,
        endDate: tepExceptionConfiglistdata?.endDate,
        isOfferEnabled: tepExceptionConfiglistdata?.isOfferEnabled,
        isActive: tepExceptionConfiglistdata?.isActive,
        createdDate: tepExceptionConfiglistdata?.createdDate
      });
    }
    tepExceptiononfigListing = {
      results: tepExceptionConfigList,
      totalElements: data.totalElements
    };

    return tepExceptiononfigListing;
  }

  static getTepExceptionConfigDetails(data: any): TEPExceptionConfig {
    const tepExceptionConfig: TEPExceptionConfig = {
      configId: data.configId,
      description: data.description,
      itemCode: data.itemCode,
      configType: data.configType,
      createdDate: data.createdDate,
      customerMobileNos: data.customerMobileNos,
      startDate: data.startDate,
      endDate: data.endDate,
      isActive: data.isActive,
      offerDetails: data.offerDetails,
      isOfferEnabled: data.isOfferEnabled,
      configDetails: data.configDetails
    };

    return tepExceptionConfig;
  }

  static getTepExceptionConfigDetailsNew(): TEPExceptionConfig {
    const tepExceptionConfig: TEPExceptionConfig = {
      configId: null,
      description: '',
      itemCode: '',
      configType: '',
      customerMobileNos: [],
      startDate: null,
      endDate: null,
      isActive: true,
      offerDetails: {
        data: {
          approvedBy: '',
          deductionPercent: 0,
          flatTepExchangeValue: 0,
          isWeightToleranceAllowed: false,
          reasonForException: ''
        },
        type: 'TEP_EXCEPTION_CONFIG'
      },
      isOfferEnabled: null,
      configDetails: {
        data: null,
        type: null
      }
    };

    return tepExceptionConfig;
  }
}
