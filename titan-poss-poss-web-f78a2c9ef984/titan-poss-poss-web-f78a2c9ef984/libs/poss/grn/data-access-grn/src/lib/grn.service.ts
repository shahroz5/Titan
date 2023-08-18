import { Injectable } from '@angular/core';
import {
  ApiService,
  getSearchGrnWorkFlowProcessUrl,
  getGrnDetailsByIdUrl,
  getWorkFlowProcessByIdUrl,
  getGrnConfirmUrl,
  getWorkFlowProcessAllReqUrl,
  getSearchAllGrnWorkFlowProcessUrl,
  getInitiateGrnEndPointUrl,
  getconfirmWithoutApprovalUrl,
  getsendForApprovalUrl,
  getGrnApproversUrl,
  getGrnHistoryDetailsUrl,
  getGrnWorkFlowProcessUrl,
  getGrnItemPriceDetailsEndPointUrl,
  getCashMemoEndPointUrl,
  getLoadItemEndPointUrl
} from '@poss-web/shared/util-api-service';
import { map, concatMap } from 'rxjs/operators';
import { GrnAdaptor } from '@poss-web/shared/util-adaptors';
import {
  GrnApproversPayload,
  GrnApproverSuccessList,
  GrnEnums,
  GrnInitPayload,
  GrnInitResponse,
  GrnPriceDetailsPayload,
  GrnPriceDetailsSuccess,
  GrnProductDetails,
  ItemDetailsPayload,
  TransactionTypeEnum
} from '@poss-web/shared/models';
import { Observable, of } from 'rxjs';
@Injectable()
export class GrnService {
  constructor(private apiService: ApiService) {}

  getGrnHistoryDetails(
    size,
    page,
    data,
    subTxnType,
    txnType,
    cmLocation?,
    searchField?,
    searchType?
  ) {
    const url = getGrnHistoryDetailsUrl(
      size,
      page,
      subTxnType,
      txnType,
      cmLocation,
      searchField,
      searchType
    );
    const reqPayload = {
      docNo: data.docNo,
      refDocNo: data.refDocNo,
      fromDocDate: data.fromDocDate,
      toDocDate: data.toDocDate,
      fiscalYear: data.fiscalYear
    };
    return this.apiService
      .post(url.path, reqPayload, url.params)
      .pipe(map(res => GrnAdaptor.getGrnHistoryDetails(res)));
  }
  getGrnReqStatusList(
    page: number,
    size: number,
    workFlowType: string,
    approvalStatus: string,
    filterOptions: any
  ) {
    const reqBody = filterOptions;
    let requestParams;
    let url;

    if (approvalStatus === GrnEnums.ALL) {
      requestParams = {
        workflowType: workFlowType,
        page: page,
        size: size
      };
      url = getWorkFlowProcessAllReqUrl(requestParams);
    } else {
      requestParams = {
        workflowType: workFlowType,
        approvalStatus: approvalStatus,
        page: page,
        size: size
      };
      url = getGrnWorkFlowProcessUrl(requestParams);
    }

    return this.apiService
      .post(url.path, reqBody, url.params)
      .pipe(map(data => GrnAdaptor.getGrnReqStatusData(data)));
  }

  searchGrn(workFlowType: string, approvalStatus: string, filterOptions: any) {
    const reqBody = filterOptions;
    let requestParams;
    let url;
    console.log(approvalStatus);
    if (approvalStatus === GrnEnums.ALL) {
      requestParams = {
        workflowType: workFlowType
      };
      url = getSearchAllGrnWorkFlowProcessUrl(requestParams);
      console.log(url);
    } else {
      requestParams = {
        workflowType: workFlowType,
        approvalStatus: approvalStatus
      };
      url = getSearchGrnWorkFlowProcessUrl(requestParams);
      console.log(url);
    }

    return this.apiService
      .post(url.path, reqBody, url.params)
      .pipe(map(data => GrnAdaptor.getGrnReqStatusData(data)));
  }

  loadGrnDetailsById(grnId: string, creditNoteType?: string) {
    let grnDetails;
    const grnDetailsUrl = getGrnDetailsByIdUrl(
      grnId,
      creditNoteType,
      GrnEnums.TXN_TYPE,
      GrnEnums.SUB_TXN_TYPE
    );

    return this.apiService
      .get(grnDetailsUrl.path, grnDetailsUrl.params)
      .pipe(map(data => (grnDetails = data)))
      
      .pipe(
        concatMap(data =>{
          console.log("workflowdata", data);
          if(grnDetails.processId !== null){
            return this.apiService.get(
              getWorkFlowProcessByIdUrl(
                grnDetails.processId,
                GrnEnums.GOODS_RETURN
              ).path,
              getWorkFlowProcessByIdUrl(
                grnDetails.processId,
                GrnEnums.GOODS_RETURN
              ).params
            )
            .pipe(map(data => GrnAdaptor.getGrnDetails(grnDetails, data)));
          } else {
            return of(GrnAdaptor.getGrnDetails(grnDetails));
          }
        })
      )
  }

  getTcsAmount(id: string) {
    const tcsAmountUrl = getCashMemoEndPointUrl(
      TransactionTypeEnum.CM,
      TransactionTypeEnum.NEW_CM,
      id
    );
    return this.apiService
      .get(tcsAmountUrl.path, tcsAmountUrl.params)
      .pipe(map((data: any) => GrnAdaptor.getTcsCollectedAmount(data)));
  }

  confirmGrn(grnId: string, txnType: string, subTxnType: string, data: any) {
    const url = getGrnConfirmUrl(grnId, txnType, subTxnType);

    return this.apiService.put(url.path, data, url.params);
  }

  sendForApproval(subTxnType: string, txnType: string, data: any) {
    const url = getsendForApprovalUrl(subTxnType, txnType);
    return this.apiService.post(url.path, data, url.params);
  }
  confirmWithoutApproval(subTxnType: string, txnType: string, data: any) {
    const url = getconfirmWithoutApprovalUrl(subTxnType, txnType);

    return this.apiService.post(url.path, data, url.params);
  }
  initiateGrn(payload: GrnInitPayload): Observable<GrnInitResponse> {
    const url = getInitiateGrnEndPointUrl(
      payload.refDocNo,
      payload.fiscalYear,
      payload.locationCode,
      GrnEnums.TXN_TYPE,
      GrnEnums.SUB_TXN_TYPE
    );
    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map((data: GrnInitResponse) => GrnAdaptor.getInitiateGrnResponse(data))
      );
  }

  loadItem(payload: ItemDetailsPayload): Observable<GrnProductDetails> {
    const url = getLoadItemEndPointUrl(
      payload.refTxnId
    );
    return this.apiService
      .post(url.path, payload.data, url.params)
      .pipe(
        map((data: GrnProductDetails) => GrnAdaptor.getItemDetails(data, payload.selected))
      );
  }

  getGrnApprovers(
    payload: GrnApproversPayload
  ): Observable<GrnApproverSuccessList[]> {
    const url = getGrnApproversUrl(payload.ruleType);
    return this.apiService
      .post(url.path, payload.data, url.params)
      .pipe(map(data => GrnAdaptor.getGrnApprovers(data)));
  }
  getGrnFinalPriceDetails(
    payload: GrnPriceDetailsPayload
  ): Observable<GrnPriceDetailsSuccess> {
    const url = getGrnItemPriceDetailsEndPointUrl(
      GrnEnums.TXN_TYPE,
      GrnEnums.SUB_TXN_TYPE
    );
    return this.apiService
      .post(url.path, payload.data, url.params)
      .pipe(map(data => GrnAdaptor.getGrnFinalPriceDetails(data)));
  }
}
