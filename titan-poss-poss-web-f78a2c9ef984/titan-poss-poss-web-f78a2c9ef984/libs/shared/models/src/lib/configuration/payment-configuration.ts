
export interface PaymentConfiguration {
  paymentName: string;
  isActive: boolean;
  configId: string;
}

export interface MappedCount {
  paymentName: string;
  count: number;
}

export interface SelectedResponse {
  id: string;
  rowHeaderKey: string;
  columnHeaderKey: string;
  configDetails: any;
}

export interface SelectedOptionsData {
  selectedResponse: SelectedResponse[];
  selectedMap: Map<string, string[]>;
  count: number;
  id: string;
}
export interface SavePaymentConfigurationPayload {
  paymentConfiguration: any;
  saveData: any;
}

export interface LoadSelectedConfigById {
  configId: string;
  paymentName?: string;
  newCount?: number;
}
export interface UpdatePaymentConfigurationDetailsPayload {
  configId: string;
  data: any;
}
export interface PaymentModesConfig {
  title: string;
  totalCount?: number;
  selectedCount?: number;
  description?: string;
}
export interface PaymentConfigurationList {
  paymentConfigurationList: PaymentConfiguration[];
  totalElements: number;
}
export interface PaymentConfigurationListPayLoad {
  pageIndex: number;
  pageSize: number;
  description?: string;
}

export interface UpdatePaymentConfigurationPayload {
  configId: string;
  data: any;
}
export interface UpdateLocationByConfigIdPayload {
  configId: string;
  locations: { addLocations: any[]; removeLocations: any[] };
}

export interface SelectedLocation {
  id: string;
  description: string;
}
export interface ActiveConfigs {
  configId: string;
  locationCode: string;
}
export enum CNCancelation {
  cn = 'CN',
  creditNote = 'Credit Note',
  cnCancelation = 'CN Cancelation'
}

export enum paymentConiguration {
  paymentConfig = 'PAYMENT_CONFIG'
}
