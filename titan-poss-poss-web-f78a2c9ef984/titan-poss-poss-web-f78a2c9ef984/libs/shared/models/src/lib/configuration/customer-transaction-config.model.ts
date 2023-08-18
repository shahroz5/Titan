import { CheckBoxSelectedOption } from '../checkbox-grid.model';

export interface CustomerTransactionConfigListPayload {
  pageIndex: number;
  pageSize: number;
  length: number;
}
export interface CustomerTransactionConfig {
  configId: string;
  description: string;
  isActive: boolean;
}

export interface CustomerTransactionConfigListResponse {
  configList: CustomerTransactionConfig[];
  totalElements: number;
}
export interface UpdateStatus {
  configId: string;
  isActive: boolean;
  configType: string;
}
export interface AddConfigs {
  customerType: string;
  transactionType: string;
}
export interface SaveCustomerTranConfigDetails {
  configId?: string;
  createConfig: {
    description: string;
    isActive: boolean;
    configType: string;
  };
  configDetails: {
    addConfigs: AddConfigs[];
    removeConfigs: string[];
  };
}
export interface CustomerConfigDetails {
  createConfig: CustomerTransactionConfig;
  configDetails: CheckBoxSelectedOption[];
}
