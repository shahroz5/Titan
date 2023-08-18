import { LoadTaxMasterListingSuccessPayload, TaxMasterDetails } from '@poss-web/shared/models';


export class TaxMasterAdaptor {

    static getTaxMasterDetailsListing(data: any): LoadTaxMasterListingSuccessPayload {
        const taxMasterDetails: TaxMasterDetails[] = [];
        for (const listItem of data.results) {
            taxMasterDetails.push({
                taxCode: listItem.taxCode,
                description: listItem.description,
                isActive: listItem.isActive,
                taxSystem: listItem.taxSystem
            });
        }

        const taxMasterListing: LoadTaxMasterListingSuccessPayload = {
            taxMasterListing: taxMasterDetails,
            totalElements: data.totalElements
        }

        return taxMasterListing;
    }
    static getTaxMasterDetails(data: any): TaxMasterDetails {
        const taxMasterDetails: TaxMasterDetails = {
            taxCode: data.taxCode,
            description: data.description,
            isActive: data.isActive,
            taxSystem: data.taxSystem
        }


        return taxMasterDetails;
    }


    // static getProductCategoryDetailsSearch(
    //     data: any
    // ): ProductCategoryDetails[] {
    //     const productCategoryDetails: ProductCategoryDetails[] = [];
    //     productCategoryDetails.push({
    //         configDetails: data.configDetails,
    //         description: data.description,
    //         orgCode: data.orgCode,
    //         productCategoryCode: data.productCategoryCode
    //     });


    //     return productCategoryDetails;
    // }

}
