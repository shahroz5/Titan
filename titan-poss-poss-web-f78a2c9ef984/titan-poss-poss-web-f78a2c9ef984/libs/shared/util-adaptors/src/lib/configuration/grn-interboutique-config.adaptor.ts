import { GrnInterboutiqueConfig } from '@poss-web/shared/models';

export class GrnInterboutiqueConfigAdaptor {

    static getGrnInterboutiqueConfigDetails(data: any): GrnInterboutiqueConfig {

        const grnInterboutiqueConfigData: GrnInterboutiqueConfig = {
            ruleId: data.ruleId,
            ruleType: data.ruleType,
            description: data.description,
            ruleDetails: {
                type: data.ruleDetails.type,
                data: {
                    type: data.ruleDetails.data.type,
                    config: data.ruleDetails.data.config
                }
            },
            isActive: data.isActive
        };



        return grnInterboutiqueConfigData;
    }

    static getNewGrnInterboutiqueConfigDetails(): GrnInterboutiqueConfig {

        const grnInterboutiqueConfigData: GrnInterboutiqueConfig = {
            ruleId: 0,
            ruleType: 'GRN_INTER_OWNER_TYPE',
            description: 'global inter owner type setting for GRN',
            ruleDetails: {
                type: null,
                data: {
                    type: 'GRN_INTER_OWNER_TYPE',
                    config: {
                        L1: [],
                        L2: [],
                        L3: []
                    }
                }
            },
            isActive: true
        };

        return grnInterboutiqueConfigData;
    }

}