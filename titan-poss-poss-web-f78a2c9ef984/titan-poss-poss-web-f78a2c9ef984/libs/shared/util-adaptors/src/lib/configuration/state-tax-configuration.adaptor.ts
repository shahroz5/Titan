import {
    StateTaxConfigurationListingResult,
    StateTaxConfigurationListingData,
    StateTaxConfigurationStateDetails,
    CessData,
    TaxDataConfig,
    TaxDetailsConfig,
    TaxsList
} from '@poss-web/shared/models';


export class StateTaxConfigurationAdaptor {

    static getStateTaxConfigurationListing(data: any): StateTaxConfigurationListingResult {
        const stateTaxConfigurationListing: StateTaxConfigurationListingData[] = [];
        for (const listItem of data.results) {
            stateTaxConfigurationListing.push({
                id: listItem.id,
                stateId: listItem.stateId,
                stateCode: listItem.stateCode,
                stateName: listItem.stateName,
                isActive: listItem.isActive
            });
        }

        const stateTaxConfigurationListingResult: StateTaxConfigurationListingResult = {
            stateTaxConfigurationListing: stateTaxConfigurationListing,
            pageNumber: data.pageNumber,
            pageSize: data.pageSize,
            totalPages: data.totalPages,
            totalElements: data.totalElements
        }

        return stateTaxConfigurationListingResult;
    }


    static getStateTaxConfigurationStateDetails(data: any): StateTaxConfigurationStateDetails {
        const cessData: CessData[] = [];
        const TaxData: TaxDataConfig[] = [];

        if (data.taxComponent) {
            if (data.taxComponent?.cess) {
                for (const listItem of data.taxComponent.cess) {
                    cessData.push({
                        cessCode: listItem.cessCode,
                        cessOnTax: listItem.cessOnTax
                    });
                }
            }

            if (data.taxComponent?.tax) {
                for (const listItem of data.taxComponent.tax) {
                    TaxData.push({
                        taxCode: listItem.taxCode
                    });
                }
            }
        }

        const stateTaxConfigurationStateDetails: StateTaxConfigurationStateDetails = {
            id: data.id,
            stateId: data.stateId,
            stateName: data.stateName,
            stateCode: data.stateCode,
            stateTaxCode: data.stateTaxCode,
            taxComponent: {
                taxSystem: data.taxComponent.taxSystem,
                tax: TaxData,
                cess: cessData
            },
            isActive: data.isActive
        };

        return stateTaxConfigurationStateDetails;
    }

    static getStateTaxConfigurationTaxDetails(data: any): TaxDetailsConfig[] {
        const TaxData: TaxDetailsConfig[] = [];

        for (const listItem of data.results) {
            TaxData.push({
                id: listItem.id,
                taxClassCode: listItem.taxClassCode,
                taxDetails: listItem.taxDetails,
                isSelected: false
            });
        }

        return TaxData;
    }

    static getTaxClassDetails(data: any): string[] {
        const TaxClassData: string[] = [];

        for (const listItem of data.results) {
            TaxClassData.push(
                listItem.taxClassCode
            );
        }

        return TaxClassData;
    }

    static getTaxsList(data: any): TaxsList[] {
        const taxList: TaxsList[] = [];

        for (const listItem of data.results) {
            taxList.push(
                {
                    taxCode: listItem.taxCode,
                    description: listItem.description,
                    taxSystem: listItem.taxSystem,
                    isActive: listItem.isActive
                }
            );
        }

        return taxList;
    }
}
