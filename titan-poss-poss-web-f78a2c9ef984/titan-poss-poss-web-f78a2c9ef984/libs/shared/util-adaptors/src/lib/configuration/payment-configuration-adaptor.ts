import {
  PaymentConfigurationList,
  PaymentConfiguration,
  SelectedLocation,
  ActiveConfigs,
  ActiveConfig,
  SelectedOptionsData,
  PaymentModesConfig,
  MappedCount,
  SelectedResponse
} from '@poss-web/shared/models';

export class PaymentConfigurationAdaptor {
  static getPaymentConfigurationListData(data: any): PaymentConfigurationList {
    let paymentConfigurationList: PaymentConfigurationList;
    const paymentConfiguration: PaymentConfiguration[] = [];
    if (data && data.results) {
      for (const listData of data.results) {
        paymentConfiguration.push({
          paymentName: listData.description,
          isActive: listData.isActive,
          configId: listData.configId
        });
      }
    }
    paymentConfigurationList = {
      paymentConfigurationList: paymentConfiguration,
      totalElements: data.totalElements
    };
    return paymentConfigurationList;
  }

  static getTcsPaymentMode(data: any): any {
    console.log(data);
    let tcsPaymentModes = [];
    if (data && data.configs) {
      for (const listData of data.configs) {
        console.log(listData);
        if (listData.transactionType === 'CM') {
          tcsPaymentModes.push({
            code: listData.paymentCode,
            checked: listData?.configDetails?.data?.isTCSPaymentEnabled
              ? listData?.configDetails?.data?.isTCSPaymentEnabled
              : false,
            id: listData.id
          });
        }
      }

      tcsPaymentModes = tcsPaymentModes.sort((paymentMode1, paymentMode2) =>
        paymentMode1.code.toLocaleLowerCase() >
        paymentMode2.code.toLocaleLowerCase()
          ? 1
          : -1
      );
    }

    return tcsPaymentModes;
  }
  static getSearchResult(data: any): PaymentConfigurationList {
    let paymentConfigurationList: PaymentConfigurationList = null;
    const paymentConfiguration: PaymentConfiguration[] = [];
    for (const listData of data.results) {
      paymentConfiguration.push({
        paymentName: listData.description,
        isActive: listData.isActive,
        configId: listData.configId
      });
    }
    paymentConfigurationList = {
      paymentConfigurationList: paymentConfiguration,
      totalElements: 1
    };
    return paymentConfigurationList;
  }

  static getPaymentModesandTransactionTypes(
    transactionTypes: any,
    paymentCodes: any
  ): any {
    const paymentModes: PaymentModesConfig[] = [];
    const transactionCodes: any[] = [];

    for (const t of transactionTypes.results) {
      transactionCodes.push({
        rowKey: t.transactionType,
        description: t.description
      });
    }

    for (const p of paymentCodes.results) {
      paymentModes.push({
        title: p.paymentCode,
        totalCount: transactionCodes.length,
        selectedCount: 0,
        description: p.description
      });
    }

    return {
      paymentMode: paymentModes,
      transactioncode: transactionCodes
    };
  }

  static getPaymentConfigurationByConfigIdData(data: any) {
    let paymentConfiguration: PaymentConfiguration;
    paymentConfiguration = {
      paymentName: data.description,
      isActive: data.isActive,
      configId: data.configId
    };
    return paymentConfiguration;
  }
  static getMappedCountData(data: any): MappedCount[] {
    const mappedCount: MappedCount[] = [];
    console.log(data);
    for (const d of data?.results) {
      mappedCount.push({
        paymentName: d.paymentCode,
        count: d.transactionTypeCount
      });
    }

    return mappedCount;
  }
  static getSelectedPaymentConfigurationDetailsByConfigIdData(
    data: any,
    newCount: number,
    paymentName: string
  ): SelectedOptionsData {
    const selectedOptionMap: Map<string, any[]> = new Map<string, any[]>();
    let getArray: string[];
    let count = 0;

    let selectedOptionsData: SelectedOptionsData = null;
    const selectedResponse: SelectedResponse[] = [];
    if (data && data.configs) {
      for (const selectedOption of data.configs) {
        selectedResponse.push({
          id: selectedOption.id,
          rowHeaderKey: selectedOption.transactionType,
          columnHeaderKey: selectedOption.paymentCode,
          configDetails: selectedOption.configDetails
        });
        if (selectedOptionMap.has(selectedOption.paymentCode)) {
          getArray = selectedOptionMap.get(selectedOption.paymentCode);
          const newArry = getArray.concat(selectedOption.transactionType);
          selectedOptionMap.set(selectedOption.paymentCode, newArry);
        } else {
          const newArray = [];
          newArray.push(selectedOption.transactionType);
          selectedOptionMap.set(selectedOption.paymentCode, newArray);
        }
      }
    }

    if (!!newCount) {
      count = newCount;
    }
    selectedOptionsData = {
      selectedResponse: selectedResponse,
      id: paymentName,
      count: selectedOptionMap.get(paymentName)
        ? selectedOptionMap.get(paymentName).length + count
        : count,
      selectedMap: selectedOptionMap
    };
    return selectedOptionsData;
  }

  static getMappedLocation(data: any) {
    const selectedLocation: SelectedLocation[] = [];
    for (const location of data.results) {
      selectedLocation.push({
        id: location.locationCode,
        description: location.locationCode
      });
    }
    return selectedLocation;
  }
  static getActiveConfigs(data: any): ActiveConfigs[] {
    const activeConfigs: ActiveConfig[] = [];
    for (const activeConfig of data.error.errorCause) {
      activeConfigs.push({
        configId: activeConfig.configId,
        locationCode: activeConfig.locationCode,
        configName: activeConfig.configName
      });
    }
    return activeConfigs;
  }
}
