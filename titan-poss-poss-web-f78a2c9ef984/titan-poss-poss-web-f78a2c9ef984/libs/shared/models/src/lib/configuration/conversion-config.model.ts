
export interface ConversionConfigListPayload {
  pageIndex: number;
  pageSize: number;
  length: number;
}
export interface ConversionConfigList {
  conversionConfigList: ConversionConfig[];
  totalElements: number;
}
export interface ConversionConfig {
  configId?: number;
  configType?: string;
  description: string;
  isActive?: boolean;
}
export interface ConversionConfigSavePayload {
  configId?: number;
  createConfig: {
    description?: string;
    isActive: boolean;
  };
  checkBoxResponse: any;
}
export interface ConversionConfigUpdatePayload {
  configId: number;
  createConfig: {
    isActive: boolean;
  };
  configValues: any;
}
export interface ConversionConfigByIdPayload {
  createConfig: CreateConfig;
  productGroups: ProductGroups[];
}
export interface ProductGroups {
  id: string;
  productGroupCode: string;
  productCategoryCode: string;
  productGroupDescription?: string;
  productCategoryDescription?: string;
  allowedLimitWeight: string;
  allowedLimitValue: string;
  autoApprovalLimitWeight: string;
  autoApprovalLimitValue: string;
}

export interface SaveConversionConfigValues {
  productCategoryCode: string;
  productGroupCode: string;
  ruleDetails: any;
}
export interface SaveConversionConfigValuesPayload {
  configId?: number;
  createConfig: {
    description?: string;
    isActive: boolean;
    ruleDetails?: any;
  };
  configValues: any;
}

export interface CreateConfig {
  ruleId: number;
  ruleType: string;
  description: string;
  isActive: boolean;
}

export interface ConversionConfigCheckBoResponse {
  addedProducts: ProductGroups[];
  removedProducts: string[];
}
export interface UpdateToggleButtonPayload {
  id: number;
  toggleButton: {
    isActive: boolean;
    ruleDetails: {};
  };
}
