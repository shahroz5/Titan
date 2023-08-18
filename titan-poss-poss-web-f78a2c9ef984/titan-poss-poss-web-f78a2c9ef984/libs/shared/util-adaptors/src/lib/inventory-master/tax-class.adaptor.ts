import { LoadTaxClassListingSuccessPayload, TaxClassDetails } from '@poss-web/shared/models';


export class TaxClassAdaptor {

    static getTaxClassDetailsListing(data: any): LoadTaxClassListingSuccessPayload {
        const taxClassDetails: TaxClassDetails[] = [];
        for (const listItem of data.results) {
            taxClassDetails.push({
                taxClassCode: listItem.taxClassCode,
                description: listItem.description,
                isActive: listItem.isActive
            });
        }

        const taxMasterListing: LoadTaxClassListingSuccessPayload = {
            taxClassListing: taxClassDetails,
            totalElements: data.totalElements
        }

        return taxMasterListing;
    }
    static getTaxClassDetails(data: any): TaxClassDetails {
        const taxClassDetails: TaxClassDetails = {
            taxClassCode: data.taxClassCode,
            description: data.description,
            isActive: data.isActive
        }


        return taxClassDetails;
    }
}
