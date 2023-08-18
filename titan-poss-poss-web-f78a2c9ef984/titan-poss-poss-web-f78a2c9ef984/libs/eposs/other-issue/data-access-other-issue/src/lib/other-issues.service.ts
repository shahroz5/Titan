import { Injectable } from '@angular/core';
import {
  ExternalApiService,
  ApiService,
  getOtherStockIssueBySrcDocNoEndpointUrl,
  getOtherStockIssueByPaginationEndpointUrl,
  getOtherIssueSTNCountEndpointUrl,
  getOtherIssueItemsByPaginationEndpointUrl,
  searchOtherIssueDetailsItemsByPaginationEndpointUrl,
  getcreateOtherIssuesStockRequestEndpointUrl,
  getOtherIssueCreateItemsByPaginationEndpointUrl,
  searchOtherIssueCreateItemsByPaginationEndpointUrl,
  getCreateOtherIssueStockRequestItemsUrl,
  getupdateStockRequestCreateItemUrl,
  getupdateStockRequestUrl,
  getCreateOtherStockIssueItemsUrl,
  getConfirmOtherIssueUrl,
  getSearchAdjustmentEndpointUrl,
  getcreateOtherIssuesAdjustmentRequestEndpointUrl,
  getCancelStockRequestUrl,
  getPrintOtherIssuesEndpointUrl,
  getOtherReceiptIssueHistoryByPaginationEndpointUrl,
  getOtherIssueRequestsHistoryByPaginationEndpointUrl,
  getOtherIssueSelectedHistoryEndpointUrl,
  getOtherIssueRequestSelectedHistoryEndpointUrl,
  getOtherReceiptIssueHistoryItemsByPaginationEndpointUrl,
  getOtherIssueRequestsHistoryItemsByPaginationEndpointUrl
} from '@poss-web/shared/util-api-service';
import { Observable } from 'rxjs';
import {
  OtherIssuedataModel,
  OtherIssueModel,
  RequestOtherIssueStockTransferNote,
  OtherIssuesItem,
  OtherIssuesCreateStockResponse,
  OtherReceiptsIssuesEnum,
  responseTypeEnum,
  LoadOtherIssuesSTNCountPayload,
  AdjustmentSearchItemPayloadSuccess,
  LoadOtherIssueCreateItemsTotalCountSuccessPayload,
  HistoryItemSuccessPayload,
  OtherIssueHistoryItemsPayload,
  OtherIssueHistoryPayload,
  ProductGroup,
  OtherIssueRequestHistoryPayload
} from '@poss-web/shared/models';
import { map, mergeMap } from 'rxjs/operators';

import {
  OtherIssuesAdaptor,
  OtherIssuesDataHelper
} from '@poss-web/shared/util-adaptors';

@Injectable()
export class OtherIssueService {
  constructor(
    private apiService: ApiService,
    private externalApiService: ExternalApiService
  ) {}

  getOtherIssuesSTNCount(): Observable<LoadOtherIssuesSTNCountPayload> {
    const stnCountUrl = getOtherIssueSTNCountEndpointUrl();
    return this.apiService
      .get(stnCountUrl)
      .pipe(
        map((data: any) => OtherIssuesAdaptor.issuesSTNCountFromJson(data))
      );
  }

  getIssueList(
    type: string,
    pageIndex: number,
    pageSize: number
  ): Observable<OtherIssuedataModel> {
    const url = getOtherStockIssueByPaginationEndpointUrl(
      type,
      pageIndex,
      pageSize
    );
    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map((data: any) => OtherIssuesDataHelper.getOtherisssuesData(data))
      );
  }
  searchIssueStocks(
    reqDocNo: number,
    type: string
  ): Observable<OtherIssueModel[]> {
    const url = getOtherStockIssueBySrcDocNoEndpointUrl(reqDocNo, type);
    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map((data: any) =>
          OtherIssuesDataHelper.getOtherisssuesSearchData(data.results)
        )
      );
  }

  getOtherStockIssue(
    reqDocNo: number,
    requestType: string
  ): Observable<RequestOtherIssueStockTransferNote> {
    const url = getOtherStockIssueBySrcDocNoEndpointUrl(reqDocNo, requestType);
    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map((data: any) =>
          OtherIssuesAdaptor.requestStockTransferNoteFromJson(data)
        )
      );
  }

  getOtherIssuesItems(
    id: number,
    status: string,
    pageIndex: number,
    pageSize: number,
    type: string,
    itemCode?: string,
    lotNumber?: string,
    sort?: Map<string, string>,
    filter?: { key: string; value: any[] }[],
    studdedProductGroups?: string[]
  ): Observable<OtherIssuesItem[]> {
    const url = getOtherIssueItemsByPaginationEndpointUrl(
      id,
      status,
      pageIndex,
      pageSize,
      type,
      itemCode,
      lotNumber,
      sort,
      filter
    );
    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map((data: any) =>
          OtherIssuesAdaptor.OtherIssueItemfromJson(data, studdedProductGroups)
        )
      );
  }

  searchOtherIssueDetailsItems(
    id: number,
    itemCode: string,
    status: string,
    transferType: string,
    lotNumber: string,
    studdedProductGroups: string[]
  ): Observable<OtherIssuesItem[]> {
    const url = searchOtherIssueDetailsItemsByPaginationEndpointUrl(
      id,
      status,
      0,
      1,
      transferType,
      itemCode,
      lotNumber
    );
    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map((data: any) =>
          OtherIssuesAdaptor.OtherIssueItemfromJson(data, studdedProductGroups)
        )
      );
  }

  createOtherIssuesStockRequest(
    reqtype: string
  ): Observable<OtherIssuesCreateStockResponse> {
    const url = getcreateOtherIssuesStockRequestEndpointUrl(reqtype);
    return this.apiService
      .post(url.path, {}, url.params)
      .pipe(
        map((data: any) =>
          OtherIssuesAdaptor.createOtherIssueStockRequestFromJson(data)
        )
      );
  }

  getOtherIssueCreateItems(
    id: number,
    status: string,
    pageIndex: number,
    pageSize: number,
    reqtype: string,
    itemCode?: string,
    lotNumber?: string,
    sort?: Map<string, string>,
    filter?: { key: string; value: any[] }[],
    studdedProductGroups?: string[]
  ): Observable<OtherIssuesItem[]> {
    const url = getOtherIssueCreateItemsByPaginationEndpointUrl(
      id,
      status,
      pageIndex,
      pageSize,
      reqtype,
      itemCode,
      lotNumber,
      sort,
      filter
    );
    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map((data: any) =>
          OtherIssuesAdaptor.OtherIssueItemfromJson(data, studdedProductGroups)
        )
      );
  }

  getOtherIssuesCreateItemsCount(
    type: string,
    id: number
  ): Observable<LoadOtherIssueCreateItemsTotalCountSuccessPayload> {
    const allOtherIssuesCreateCountUrl = getOtherIssueCreateItemsByPaginationEndpointUrl(
      id,
      OtherReceiptsIssuesEnum.OPEN,
      0,
      1,
      type
    );
    const selectedOtherIssuesCreateCountUrl = getOtherIssueCreateItemsByPaginationEndpointUrl(
      id,
      OtherReceiptsIssuesEnum.SELECTED,
      0,
      1,
      type
    );

    return this.apiService
      .get(
        allOtherIssuesCreateCountUrl.path,
        allOtherIssuesCreateCountUrl.params
      )
      .pipe(map((data: any) => data.totalElements))
      .pipe(
        mergeMap(nonVerifiedItemsTotalCount =>
          this.apiService
            .get(
              selectedOtherIssuesCreateCountUrl.path,
              selectedOtherIssuesCreateCountUrl.params
            )
            .pipe(
              map((data: any) => ({
                allOtherIssueCreateItemsTotalCount: nonVerifiedItemsTotalCount,
                selectedOtherIssueCreateItemsTotalCount: data.totalElements
              }))
            )
        )
      );
  }
  searchOtherIssueCreateItems(
    id: number,
    itemCode: string,
    status: string,
    reqtype: string,
    lotNumber: string,
    studdedProductGroups: string[]
  ): Observable<OtherIssuesItem[]> {
    const url = searchOtherIssueCreateItemsByPaginationEndpointUrl(
      id,
      status,
      0,
      1,
      reqtype,
      itemCode,
      lotNumber
    );
    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map((data: any) =>
          OtherIssuesAdaptor.OtherIssueItemfromJson(data, studdedProductGroups)
        )
      );
  }

  createOtherIssueStockRequestItems(
    id: number,
    issueItems: any,
    requestType: string
  ) {
    const createOtherIssueStockRequestItemsUrl = getCreateOtherIssueStockRequestItemsUrl(
      id,
      requestType
    );
    return this.apiService
      .post(
        createOtherIssueStockRequestItemsUrl.path,
        {
          stockItems: issueItems
        },
        createOtherIssueStockRequestItemsUrl.params
      )
      .pipe(map(data => data));
  }
  removeOtherIssueStockRequestItems(
    id: number,
    itemIds: any,
    requestType: string
  ) {
    const removeOtherIssueStockRequestItemsUrl = getCreateOtherIssueStockRequestItemsUrl(
      id,
      requestType
    );
    return this.apiService
      .put(
        removeOtherIssueStockRequestItemsUrl.path,
        {
          itemIds: itemIds
        },
        removeOtherIssueStockRequestItemsUrl.params
      )
      .pipe(map(data => data));
  }
  updateStockRequestCreateItem(
    id: number,
    itemid: number,
    reqType: string,
    value: any
  ) {
    const updateStockRequestCreateItemUrl = getupdateStockRequestCreateItemUrl(
      id,
      itemid,
      reqType
    );
    return this.apiService
      .patch(
        updateStockRequestCreateItemUrl.path,
        value,
        updateStockRequestCreateItemUrl.params
      )
      .pipe(map(data => data));
  }

  updateStockRequest(
    id: number,
    reqType: string,
    carrierDetails: any,
    approvalDetails: any,
    remarks: string,
    status: string
  ) {
    const updateIssueUrl = getupdateStockRequestUrl(id, reqType);
    return this.apiService
      .patch(
        updateIssueUrl.path,
        {
          carrierDetails,
          approvalDetails,
          remarks,
          status
        },
        updateIssueUrl.params
      )
      .pipe(
        map((data: any) => OtherIssuesAdaptor.OtherIssueDatafromJson(data))
      );
  }
  createOtherStockIssueItems(id: number, issueItems: any, requestType: string) {
    const createOtherStockIssueItemsUrl = getCreateOtherStockIssueItemsUrl(
      id,
      requestType
    );
    return this.apiService
      .patch(
        createOtherStockIssueItemsUrl.path,
        {
          itemIds: issueItems,
          status: OtherReceiptsIssuesEnum.SELECTED
        },
        createOtherStockIssueItemsUrl.params
      )
      .pipe(map(data => data));
  }

  confirmOtherStockIssue(
    id: number,
    requestType: string,
    carrierDetails: any,
    remarks: string,
    destinationLocationCode: string
  ) {
    const confirmOtherStockIssueUrl = getConfirmOtherIssueUrl(id, requestType);
    return this.apiService
      .patch(
        confirmOtherStockIssueUrl.path,
        {
          carrierDetails,
          remarks,
          destinationLocationCode
        },
        confirmOtherStockIssueUrl.params
      )
      .pipe(
        map((data: any) =>
          OtherIssuesAdaptor.confirmOtherStockIssueResponseFromJson(data)
        )
      );
  }
  searchAdjustmentItem(
    variantCode: string,
    lotNumber: string,
    binType:string,
    //productGroups: ProductGroup[],
    studdedProductGroups: string[]
  ): Observable<AdjustmentSearchItemPayloadSuccess> {
    const url = getSearchAdjustmentEndpointUrl(
      variantCode,
      lotNumber,
      binType,
      //productGroups
    );
    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map((data: any) =>
          OtherIssuesAdaptor.searchedAdjustmentItems(data, studdedProductGroups)
        )
      );
  }

  createStockRequestAdjustment(
    reqType: string,
    approvalDetails: any,
    items: any,
    remarks: string
  ) {
    const updateIssueUrl = getcreateOtherIssuesAdjustmentRequestEndpointUrl(
      reqType
    );
    return this.apiService
      .post(
        updateIssueUrl.path,
        {
          approvalDetails,
          items,
          remarks
        },
        updateIssueUrl.params
      )
      .pipe(
        map((data: any) => OtherIssuesAdaptor.OtherIssueDatafromJson(data))
      );
  }
  cancelStockRequest(id: number, requestType: string) {
    const cancelRequestURL = getCancelStockRequestUrl(id, requestType);

    return this.apiService
      .patch(cancelRequestURL.path,{}, cancelRequestURL.params)
      .pipe(map(data => data));
  }

  printOtherIssue(id: number, requestType: string) {
    const printOtherissueURL = getPrintOtherIssuesEndpointUrl(id, requestType);
    this.apiService.ResponseContentType = responseTypeEnum.Text;
    return this.apiService
      .get(printOtherissueURL.path, printOtherissueURL.params)
      .pipe(
        map(data => {
          return data;
        })
      );
  }
  getHistory(
    type: any,
    page: number,
    size: number,
    sort: string,
    payload: OtherIssueHistoryPayload | OtherIssueRequestHistoryPayload,
    transactionType: string
  ): Observable<any> {
    let url: any;
    if (type === OtherReceiptsIssuesEnum.OTHER_ISSUES_REQUESTS) {
      url = getOtherIssueRequestsHistoryByPaginationEndpointUrl(
        page,
        size,
        sort,
        transactionType
      );
    } else {
      url = getOtherReceiptIssueHistoryByPaginationEndpointUrl(
        page,
        size,
        sort,
        transactionType
      );
    }
    return this.apiService
      .post(url.path, payload, url.params)
      .pipe(
        map((data: any) => OtherIssuesDataHelper.getOtherisssuesData(data))
      );
  }
  getSelectedHistory(
    type: any,
    actionType: string,
    id: number,
    transactionType: string
  ): Observable<OtherIssueModel> {
    let url: any;
    if (type === OtherReceiptsIssuesEnum.OTHER_ISSUES_REQUESTS) {
      url = getOtherIssueRequestSelectedHistoryEndpointUrl(
        actionType,
        id,
        transactionType
      );
    } else {
      url = getOtherIssueSelectedHistoryEndpointUrl(id, transactionType);
    }

    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map((data: any) => OtherIssuesAdaptor.OtherIssueDatafromJson(data))
      );
  }
  getHistoryItems(
    type: any,
    actionType: string,
    id: number,
    page: number,
    size: number,
    sort: string[],
    payload: OtherIssueHistoryItemsPayload,
    transactionType: string,
    studdedProductGroups: string[] = []
  ): Observable<HistoryItemSuccessPayload> {
    let url: any;
    if (type === OtherReceiptsIssuesEnum.OTHER_ISSUES_REQUESTS) {
      url = getOtherIssueRequestsHistoryItemsByPaginationEndpointUrl(
        actionType,
        id,
        page,
        size,
        sort,
        transactionType
      );
    } else {
      url = getOtherReceiptIssueHistoryItemsByPaginationEndpointUrl(
        id,
        page,
        size,
        sort,
        transactionType
      );
    }

    return this.apiService
      .post(url.path, payload, url.params)
      .pipe(
        map((data: any) =>
          OtherIssuesDataHelper.getItems(data, studdedProductGroups)
        )
      );
  }

  getHistoryItemsTotalCount(
    actionType: string,
    type: string,
    id: number,
    page: number,
    size: number,
    sort: string[],
    payload: OtherIssueHistoryItemsPayload,
    transactionType
  ): Observable<number> {
    let url: any;
    if (type === OtherReceiptsIssuesEnum.OTHER_ISSUES_REQUESTS) {
      url = getOtherIssueRequestsHistoryItemsByPaginationEndpointUrl(
        actionType,
        id,
        page,
        size,
        sort,
        transactionType
      );
    } else {
      url = getOtherReceiptIssueHistoryItemsByPaginationEndpointUrl(
        id,
        page,
        size,
        sort,
        transactionType
      );
    }

    return this.apiService
      .post(url.path, payload, url.params)
      .pipe(map((data: any) => data.totalElements));
  }
}
