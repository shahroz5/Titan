import { CustomErrors, InvglobalConfiguration, InvglobalConfigurationFiledValue } from '@poss-web/shared/models';

export interface InvGlobalConfigurationState {
    invglobalConfigurationList: InvglobalConfiguration[]
    invglobalConfigurationFiledValue: InvglobalConfigurationFiledValue,
    error: CustomErrors
    isLoading: boolean;
    hasUpdated: boolean

}