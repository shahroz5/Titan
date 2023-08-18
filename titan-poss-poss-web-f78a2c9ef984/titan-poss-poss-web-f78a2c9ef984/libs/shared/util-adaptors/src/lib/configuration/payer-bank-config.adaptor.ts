import {
  PayerBankConfigListingSuccessPaylod,
  PayerBankConfiguration,
  PayerBankConfigDetails,
  PaymentModeResponse,
  PayerBankMaster,
  SelectedPayerBankLocations,
  ActivePayerConfigurations,
  SelectedBanks,
  PayerBanksResponse
} from '@poss-web/shared/models';

export class PayerBankConfigurationAdaptor {
  static getPayerBankListing(data: any): PayerBankConfigListingSuccessPaylod {
    const payerBankConfigs: PayerBankConfiguration[] = [];
    let payerBanksListing: PayerBankConfigListingSuccessPaylod;
    for (const listItem of data.results) {
      payerBankConfigs.push({
        id: listItem.id,
        description: listItem.description,
        paymentCode: listItem.paymentCode,
        isActive: listItem.isActive
      });
    }
    payerBanksListing = {
      payerBankListing: payerBankConfigs,
      totalElements: data.totalElements
    };
    return payerBanksListing;
  }
  static getPayerBankConfigSearch(data: any): PayerBankConfiguration[] {
    const payerBankConfigs: PayerBankConfiguration[] = [];
    for (const listItem of data.results) {
      payerBankConfigs.push({
        id: listItem.id,
        description: listItem.description,
        paymentCode: listItem.paymentCode,
        isActive: listItem.isActive
      });
    }
    return payerBankConfigs;
  }
  // static getPaymentModes(data: any): PaymentModeResponse[] {
  //   const paymentModes: PaymentModeResponse[] = [];
  //   for (const paymentMode of data.results) {
  //     paymentModes.push({
  //       paymentMode: paymentMode.paymentMode,
  //       description: paymentMode.description
  //     });
  //   }
  //   return paymentModes;
  // }
  static getPayerBankConfigs(data: any, banks: any): PayerBankConfigDetails {
    console.log('data', data, banks);
    let payerBankConfigDetails: PayerBankConfigDetails;
    const addedBanks: SelectedBanks[] = [];
    const payerconfigs = {
      description: data.description,
      id: data.id,
      isActive: data.isActive,
      paymentCode: data.paymentCode,
      paymentDetails: data.paymentDetails
    };
    for (const bank of banks.results) {
      addedBanks.push({
        bankName: bank.bankName,
        id: bank.id,
        configId: bank.configId
      });
    }
    payerBankConfigDetails = {
      configDetails: payerconfigs,
      selectedBanks: addedBanks
    };
    return payerBankConfigDetails;
  }
  static getPayerBanks(data: any): PayerBanksResponse {
    let payerBanksResponse: PayerBanksResponse;
    const payerBanks: PayerBankMaster[] = [];
    for (const payerBank of data.results) {
      payerBanks.push({
        bankName: payerBank.bankName,
        isActive: payerBank.isActive
      });
    }
    payerBanksResponse = {
      payerBanks: payerBanks,
      totalElements: data.totalElements
    };
    return payerBanksResponse;
  }
  static getSearchResult(data: any): PayerBankMaster[] {
    const payerBanksList: PayerBankMaster[] = [];
    for (const listItem of data.results) {
      payerBanksList.push({
        bankName: listItem.bankName,
        isActive: listItem.isActive
      });
    }

    return payerBanksList;
  }
  static selectedConfigLocations(data): SelectedPayerBankLocations[] {
    const selectedLocations: SelectedPayerBankLocations[] = [];
    for (const locations of data.results) {
      selectedLocations.push({
        id: locations.locationCode,
        description: locations.locationCode
      });
    }
    return selectedLocations;
  }
  static getActiveConfigs(data: any): ActivePayerConfigurations[] {
    console.log(data);
    const activeConfigs: ActivePayerConfigurations[] = [];
    for (const activeConfig of data.error.errorCause) {
      activeConfigs.push({
        configId: activeConfig.configId,
        locationCode: activeConfig.locationCode
      });
    }
    return activeConfigs;
  }
}
