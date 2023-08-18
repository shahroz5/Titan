export interface PayerBankConfiguration {
  id: string;
  description: string;
  paymentCode: string;
  isActive: true;
}

export interface PayerBankConfigListingSuccessPaylod {
  payerBankListing: PayerBankConfiguration[];
  totalElements: number;
}
export interface PayerBankConfigListingPayload {
  pageIndex: number;
  pageSize: number;
}
export interface SavePayerBankConfigDetails {
  configName: string;
  paymentMode: string;
  ccPayment: any;
  addedBanks: string[];
  removedBanks: string[];
}
export interface ToggleButtonPayload {
  isActive: boolean;
  id: string;
}
export interface PaymentModeResponse {
  value: string;
  description: string;
}
export interface PayerBankConfigSavePayload {
  description?: string;
  paymentCode: string;
  paymentDetails?: any;
  isActive: boolean;
}
export interface PayerBankSavePayload {
  addBankName: string[];
  removeBankName?: string[];
}
export interface PayerBankConfigDetails {
  configDetails: PayerBankConfigSavePayload;
  selectedBanks: SelectedBanks[];
}
export interface SelectedBanks {
  id: string;
  configId?: string;
  bankName?: string;
}
export interface SelectedPayerBankLocations {
  id: string;
  description: string;
}
export interface ActivePayerConfigurations {
  configId: string;
  locationCode: string;
}

export interface SavePayerBankConfigDetailsPayload {
  configPayload: PayerBankConfigSavePayload;
  banksPayload: PayerBankSavePayload;
}
export interface UpdatePayerBankConfigPayload {
  id: string;
  configPayload: PayerBankConfigSavePayload;
  banksPayload: PayerBankSavePayload;
}
export interface PayerBankMaster {
  bankName: string;
  isActive: boolean;
}
export interface PayerBanksResponse {
  payerBanks: PayerBankMaster[];
  totalElements: number;
}
export interface PayerBankLocationMapping {
  configId: string;
  locationMapping: {
    addLocations: string[];
    removeLocations: string[];
    overwriteMapping?: boolean;
    paymentCode: string;
  };
}
