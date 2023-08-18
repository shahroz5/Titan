import { CnMasterDetail, CnMasterListResponse } from '@poss-web/shared/models';

export class CnMasterAdaptor {
  static getCnMasterList(data: any): CnMasterListResponse {
    let cnMasterListResponse: CnMasterListResponse = null;
    const cnMasterList: CnMasterDetail[] = [];
    if (data && data.results) {
      for (const cnMaster of data.results) {
        cnMasterList.push({
          isActive: cnMaster.isActive ? cnMaster.isActive : false,
          creditNoteType: cnMaster.creditNoteType
            ? cnMaster.creditNoteType
            : null,
          description: cnMaster.description ? cnMaster.description : null,
          IsAllowedForGHSGrammageAccount: cnMaster.configDetails.data
            ? cnMaster.configDetails.data.IsAllowedForGHSGrammageAccount
            : false,
          IsAllowedforEghs: cnMaster.configDetails.data
            ? cnMaster.configDetails.data.IsAllowedforEghs
            : false
        });
      }

      cnMasterListResponse = {
        cnMasterList: cnMasterList,
        totalElements: data.totalElements
      };
    }
    return cnMasterListResponse;
  }

  static getCnMasterDetail(data: any): CnMasterDetail {
    let cnMasterDetail: CnMasterDetail = null;
    return (cnMasterDetail = {
      isActive: data.isActive ? data.isActive : false,
      creditNoteType: data.creditNoteType ? data.creditNoteType : null,
      description: data.description ? data.description : null,
      IsAllowedForGHSGrammageAccount: data.configDetails.data
        ? data.configDetails.data.IsAllowedForGHSGrammageAccount
        : false,
      IsAllowedforEghs: data.configDetails.data
        ? data.configDetails.data.IsAllowedforEghs
        : false
    });
  }
}
