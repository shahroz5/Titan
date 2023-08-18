import {
  CustomerTransactionConfigListResponse,
  CustomerTransactionConfig,
  CheckBoxHeader,
  CustomerConfigDetails,
  CheckBoxSelectedOption
} from '@poss-web/shared/models';

export class CustomerTransactionConfigAdaptor {
  static customerTransactionConfigList(
    data: any
  ): CustomerTransactionConfigListResponse {
    let customerTransactionConfigList: CustomerTransactionConfigListResponse;
    const customerTransactionConfig: CustomerTransactionConfig[] = [];
    for (const customerConfigs of data.results) {
      customerTransactionConfig.push({
        configId: customerConfigs.configId,
        description: customerConfigs.description,
        isActive: customerConfigs.isActive
      });
    }
    customerTransactionConfigList = {
      configList: customerTransactionConfig,
      totalElements: data.totalElements
    };
    return customerTransactionConfigList;
  }
  static searchByConfigName(data: any): CustomerTransactionConfig[] {
    const customerTransactionConfig: CustomerTransactionConfig[] = [];
    for (const customerConfigs of data.results) {
      customerTransactionConfig.push({
        configId: customerConfigs.configId,
        description: customerConfigs.description,
        isActive: customerConfigs.isActive
      });
    }

    return customerTransactionConfig;
  }
  static getTransactionTypes(data: any): CheckBoxHeader[] {
    const transactionTypes: CheckBoxHeader[] = [];
    for (const transactions of data.results) {
      transactionTypes.push({
        title: transactions.description,
        key: transactions.transactionType
      });
    }
    return transactionTypes;
  }
  static getCustomers(data: any): CheckBoxHeader[] {
    const customers: CheckBoxHeader[] = [];
    for (const transactions of data.results) {
      customers.push({
        title: transactions.value,
        key: transactions.code
      });
    }
    return customers;
  }
  static getCustomerTranCOnfigValues(
    createConfig: any,
    selectedConfigs: any
  ): CustomerConfigDetails {
    let customerConfigDetails: CustomerConfigDetails;
    const configValues: CheckBoxSelectedOption[] = [];
    for (const configs of selectedConfigs.configs) {
      configValues.push({
        id: configs.id,
        rowHeaderKey: configs.customerType,
        columnHeaderKey: configs.transactionType
      });
    }
    return (customerConfigDetails = {
      createConfig: createConfig,
      configDetails: configValues
    });
  }
}
