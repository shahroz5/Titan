import { InitiateAdvanceResponse, UpdateAdvanceTransactionResponse } from '@poss-web/shared/models';

export class CtAcceptAdvanceAdaptor {
    static getInitiateAdvanceResponse(data: InitiateAdvanceResponse): InitiateAdvanceResponse {
        if (!data) {
            return null;
        }
        return {
            docNo: data.docNo,
            id: data.id,
            status: data.status,
            subTxnType: data.subTxnType,
            txnType: data.txnType
        }
    }

    static getUpdateAdvanceTransactionResponse(data: UpdateAdvanceTransactionResponse): UpdateAdvanceTransactionResponse {
        if (!data) {
            return null;
        }
        return {
            cndocNos: data.cndocNos,
            docNo: data.docNo,
            id: data.id
        }
    }
}