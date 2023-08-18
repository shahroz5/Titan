export interface GrnInterboutiqueConfig {
    ruleId: number;
    ruleType: string;
    description: string;
    ruleDetails: GrnInterboutiqueConfigRuleDetails;
    isActive: boolean;
}

export interface GrnInterboutiqueConfigRuleDetails {
    type?: any;
    data: GrnInterboutiqueConfigData;
}

export interface GrnInterboutiqueConfigData {
    type: string;
    config: GrnInterboutiqueConfigConfig;
}

export interface GrnInterboutiqueConfigConfig {
    L1: string[];
    L2: string[];
    L3: string[];
}