import { TaxClassDetails, TransactionTypeMasterDetails, LoadTransactionTypeMasterListingSuccessPayload } from '@poss-web/shared/models';


export class TransactionTypeMasterAdaptor {

    static getTransactionTypeMasterListing(data: any): LoadTransactionTypeMasterListingSuccessPayload {
        const list: TransactionTypeMasterDetails[] = [];
        for (const listItem of data) {
            list.push({
                code: listItem.transactionType,
                value: listItem.description,
                isActive: true
            });
        }

        const listing: LoadTransactionTypeMasterListingSuccessPayload = {
            transactionTypeMasterListing: list,
            totalElements: data.totalElements
        }

        return listing;
    }
    static getTransactionTypeMasterDetails(data: any): TransactionTypeMasterDetails {
        const details: TransactionTypeMasterDetails = {
            code: data.values[0].code,
            value: data.values[0].value,
            isActive: data.values[0].isActive
        }


        return details;
    }
    static getSavedTransactionTypeMasterDetails(data: any): TransactionTypeMasterDetails {
        const details: TransactionTypeMasterDetails = {
            code: data.code,
            value: data.value,
            isActive: data.isActive
        }


        return details;
    }
}
