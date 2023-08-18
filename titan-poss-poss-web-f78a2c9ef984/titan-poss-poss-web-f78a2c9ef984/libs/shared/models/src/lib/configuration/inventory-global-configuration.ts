export interface InvglobalConfiguration {
  configId?: string;
  description?: string;
  configType?: string;
  isActive?: boolean;
  ruleDetails?: {
    data: {};
    type: string;
  };
}
export interface UpdateFieldValuePayload {
  configId?: string;
  ruleDetails: {
    data: {};
    type: string;
  };
}

export interface InvglobalConfigurationFiledValue {
  maxTimeToMoveTranscToHistory: string;
}
export enum invglobalConfigurationsEnum {
  HISTORY_TIME_CONFIGURATION = 'HISTORY_TIME_CONFIGURATION',
  AMENDMENT_CONFIGURATION='AMENDMENT_CONFIGURATION'
}
