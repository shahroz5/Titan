import { CnList, CnListRes } from '@poss-web/shared/models';

export class CnDirectAdaptor {
  static getCnList(data: any): CnListRes {
    let cnListRes: CnListRes;

    const cnList: CnList[] = [];
    for (const cnListItem of data.results) {
      cnList.push({
        cnNo: cnListItem.docNo,
        fiscalYear: cnListItem.fiscalYear,
        customerName: cnListItem.customerName,
        locationCode: cnListItem.locationCode,
        cnType: cnListItem.creditNoteType,
        cnDate: cnListItem.docDate,
        amount: cnListItem.amount,
        cnStatus: cnListItem.status,
        linkedWith: cnListItem.linkedTxnType,
        id: cnListItem.id,
        frozenRateDetails: cnListItem.frozenRateDetails,
        workflowStatus: cnListItem.workflowStatus
      });
    }

    cnListRes = {
      cnList: cnList,
      totalElements: data.totalElements
    };
    return cnListRes;
  }
}
