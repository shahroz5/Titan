import {
    CustomErrors,
    StateTaxConfigurationStateDetails,
    StateData,
    TaxsList,
    TaxDetailsSubmit
} from '@poss-web/shared/models';

import { StateTaxConfigurationEntity } from './state-tax-configuration.entity'

export interface StateTaxConfigurationState {
    stateTaxConfigurationListing: StateTaxConfigurationEntity;
    taxDetailsStateDetails: StateTaxConfigurationStateDetails;
    taxDetailsStateDetailsSaveResponse: StateTaxConfigurationStateDetails;
    taxDetailsStateDetailsEditResponse: StateTaxConfigurationStateDetails;
    taxDetailsSaveResponse: TaxDetailsSubmit;
    taxComponentDetails: string[];
    taxDetailsListing: StateTaxConfigurationEntity;

    error: CustomErrors;
    allStateList: StateData[];
    allTaxSystemList: string[];
    allTaxClassList: string[];
    allTaxsList: TaxsList[];
    totalStateTaxConfiguration: number;
    isLoading: boolean;
}
