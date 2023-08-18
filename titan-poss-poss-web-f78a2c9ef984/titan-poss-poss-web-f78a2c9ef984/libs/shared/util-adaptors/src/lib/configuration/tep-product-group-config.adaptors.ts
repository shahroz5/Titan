import {
  TEPExceptionConfig,
  TEPProductGroupConfigListing,
  TEPProductGroupConfigDetails,
  TEPProductGroupMappingListing,
  TEPProductGroupMappingDetails
} from '@poss-web/shared/models';

export class TepProductGroupConfigAdaptors {
  static getTepProductGroupConfigList(data: any): TEPProductGroupConfigListing {
    const tepExceptionConfigList: TEPProductGroupConfigDetails[] = [];
    let tepExceptiononfigListing: TEPProductGroupConfigListing;
    for (const tepExceptionConfiglistdata of data.results) {
      tepExceptionConfigList.push({
        configId: tepExceptionConfiglistdata.configId,
        itemCode: tepExceptionConfiglistdata.itemCode,
        configDetails: tepExceptionConfiglistdata.configDetails,
        configType: tepExceptionConfiglistdata.configType,
        description: tepExceptionConfiglistdata.description,
        customerMobileNos: tepExceptionConfiglistdata.customerMobileNos,
        offerDetails: tepExceptionConfiglistdata.offerDetails,
        startDate: tepExceptionConfiglistdata.startDate,
        endDate: tepExceptionConfiglistdata.endDate,
        isOfferEnabled: tepExceptionConfiglistdata.isOfferEnabled,
        isActive: tepExceptionConfiglistdata.isActive,
        createdDate: tepExceptionConfiglistdata.createdDate
      });
    }
    tepExceptiononfigListing = {
      results: tepExceptionConfigList,
      totalElements: data.totalElements
    };

    return tepExceptiononfigListing;
  }

  static getTepProductGroupConfigDetails(
    data: any
  ): TEPProductGroupConfigDetails {
    const tepProductGroupConfig: TEPProductGroupConfigDetails = {
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

    return tepProductGroupConfig;
  }

  static getTepExceptionConfigDetailsNew(): TEPProductGroupConfigDetails {
    const tepProductGroupConfig: TEPProductGroupConfigDetails = {
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
        type: 'TEP_ITEM'
      },
      isOfferEnabled: null,
      configDetails: {
        data: null,
        type: null
      }
    };

    return tepProductGroupConfig;
  }

  static getTepProductGroupMappingList(
    data: any
  ): TEPProductGroupMappingListing {
    const tepProductGroupMappingDetails: TEPProductGroupMappingDetails[] = [];
    let tepProductGroupMappingListing: TEPProductGroupMappingListing;
    for (const tepExceptionConfiglistdata of data.results) {
      tepProductGroupMappingDetails.push({
        id: tepExceptionConfiglistdata.id,
        configId: tepExceptionConfiglistdata.configId,
        productGroupCode: tepExceptionConfiglistdata.productGroupCode,
        configDetails: tepExceptionConfiglistdata.configDetails
      });
    }
    tepProductGroupMappingListing = {
      results: tepProductGroupMappingDetails,
      totalElements: data.totalElements
    };

    return tepProductGroupMappingListing;
  }
}
