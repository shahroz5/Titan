import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  getBinRequestApprovalsUrl,
  getLocationsUrl,
  getIbtsCancellationApprovalsUrl,
  getAllBinRequestApprovalsCountUrl,
  getLocationCountUrl,
  updateBinRequestApprovalsCountUrl,
  getIbtsApprovalsUrl,
  getAllIBTRequestApprovalsCountUrl,
  getRequestByIdEndpointUrl,
  getIbtRequestApprovalsUrl,
  getAllIBTItemsRequestApprovalsCountUrl,
  updateIbtRequestApprovalsCountUrl,
  updateIbtApprovalsCountUrl,
  getAdjustmentApprovalsCountUrl,
  getLossApprovalsCountUrl,
  getLoanApprovalsCountUrl,
  getFocApprovalsCountUrl,
  getPsvApprovalsCountUrl,
  getExhibitionApprovalsCountUrl,
  getCancelRequestByIdEndpointUrl,
  getIbtCancelApprovalsUrl,
  updateIbtCancelUrl,
  getIBTCancelRequestApprovalsCountUrl,
  ApiService
} from '@poss-web/shared/util-api-service';
import { map, mergeMap } from 'rxjs/operators';
import {
  BinRequestApprovalsItemHelper,
  IbtApprovalsItemsHelper
} from '@poss-web/shared/util-adaptors';

import { HttpClient } from '@angular/common/http';
import * as BinRequestApprovalsActions from './+state/request-approvals.actions';
import { IbtRequestApprovalsItemHelper,RequestApprovalsItemsAdaptor } from '@poss-web/shared/util-adaptors';
import {
  RequestApprovals,
  LoadRequestResponseItems,
  LoadBinRequestResponse,
  LoadRequestTotalCountSuccessPayload
} from '@poss-web/shared/models';
import { SelectedStockPayload } from './+state/request-approvals.actions';

@Injectable()
export class RequestApprovalsService {
  getBinRequestApprovalsItems(
    locationCode: string,
    reqDocNo: number,
    pageIndex: number,
    pageSize: number
  ): Observable<LoadBinRequestResponse> {
    const url = getBinRequestApprovalsUrl(
      locationCode,
      reqDocNo,
      pageIndex,
      pageSize
    );
    return this.apiService
      .get(url.path, url.params)
      .pipe(map((data: any) => BinRequestApprovalsItemHelper.getItems(data)));
  }

  getIbtRequestApprovalsItems(
    id: number,
    itemCode: string,
    requestType: string,
    pageIndex: number,
    sortBy: string,
    sortOrder: string,
    filter: { key: string; value: any[] }[],
    pageSize: number,
    isSelectedData: string[],
    studdedProductGroups: string[] = []
  ): Observable<LoadRequestResponseItems> {
    const url = getIbtRequestApprovalsUrl(
      id,
      itemCode,
      requestType,
      pageIndex,
      sortBy,
      sortOrder,
      filter,
      pageSize
    );
    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map((data: any) =>
          IbtApprovalsItemsHelper.getItems(
            data,
            isSelectedData,
            studdedProductGroups
          )
        )
      );
  }

  getIbtCancelRequestApprovalsItems(
    id: number,
    requestType: string,
    pageIndex: number,
    pageSize: number,
    isSelectedData: string[],
    studdedProductGroups: string[] = []
  ) {
    const url = getIbtCancelApprovalsUrl(id, requestType, pageIndex, pageSize);
    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map((data: any) =>
          IbtApprovalsItemsHelper.getItems(
            data,
            isSelectedData,
            studdedProductGroups
          )
        )
      );
  }

  getLocation(pageIndex: number, pageSize: number): Observable<Location[]> {
    const url = getLocationsUrl(pageIndex, pageSize);
    return this.apiService
      .get(url.path, url.params)
      .pipe(map((data: any) => data.results));
  }

  getBinRequestApprovalsCount(): Observable<any> {
    const url = getAllBinRequestApprovalsCountUrl();

    return this.apiService
      .get(url)
      .pipe(map((data: any) => data.totalElements));
  }

  getIbtRequestApprovalsCount(): Observable<any> {
    const url = getAllIBTRequestApprovalsCountUrl();

    return this.apiService
      .get(url.path, url.params)
      .pipe(map((data: any) => data.totalElements));
  }

  getIbtCancelRequestApprovalsCount(): Observable<any> {
    const url = getIBTCancelRequestApprovalsCountUrl();

    return this.apiService
      .get(url.path, url.params)
      .pipe(map((data: any) => data.totalElements));
  }

  getIbtItemsRequestApprovalsCount(
    payload: BinRequestApprovalsActions.CountPayload
  ): Observable<any> {
    const url = getAllIBTItemsRequestApprovalsCountUrl(payload);

    return this.apiService
      .get(url.path, url.params)
      .pipe(map((data: any) => data.totalElements));
  }

  getLocationCount(): Observable<any> {
    const url = getLocationCountUrl();

    return this.apiService
      .get(url)
      .pipe(map((data: any) => data.totalElements));
  }

  updateBinApprovalStatus(
    binRequestApprovalDto: BinRequestApprovalsActions.BinApprovalspayload
  ) {
    const url = updateBinRequestApprovalsCountUrl(binRequestApprovalDto.id);
    return this.apiService
      .patch(url, binRequestApprovalDto.binRequestUpdateDto)
      .pipe(map(data => data));
  }

  updateIbtApprovalStatus(
    ibtRequestApprovalDto: BinRequestApprovalsActions.IbtApprovalspayload
  ) {
    const url = updateIbtRequestApprovalsCountUrl(
      ibtRequestApprovalDto.id,

      ibtRequestApprovalDto.itemId
    );
    return this.apiService
      .patch(url.path, ibtRequestApprovalDto.itemUpdateDto, url.params)
      .pipe(map(data => data));
  }

  updateIbtApprovals(
    ibtRequestApprovalDto: BinRequestApprovalsActions.Ibtpayload
  ) {
    const url = updateIbtApprovalsCountUrl(
      ibtRequestApprovalDto.id,
      ibtRequestApprovalDto.requestType
    );
    return this.apiService
      .patch(url.path, ibtRequestApprovalDto.requestUpdateDto, url.params)
      .pipe(map(data => data));
  }

  updateIbtCancelApprovals(
    ibtCancelDto: BinRequestApprovalsActions.IbtCancelPayload
  ) {
    const url = updateIbtCancelUrl(ibtCancelDto.id, ibtCancelDto.transferType);

    return this.apiService
      .patch(url.path, ibtCancelDto.stUpdateDto, url.params)
      .pipe(map(data => data));
  }

  getIbtsApprovals(locationCode, reqDocNo, type, pageIndex, pageSize) {
    const url = getIbtsApprovalsUrl(
      locationCode,
      reqDocNo,
      type,
      pageIndex,
      pageSize
    );

    return this.apiService
      .get(url.path, url.params)
      .pipe(map((data: any) => IbtRequestApprovalsItemHelper.getItems(data)));
  }

  getIbtsCancellationApprovals(
    locationCode,
    reqDocNo,
    type,
    pageIndex,
    pageSize,
    sort,
    status
  ) {
    const url = getIbtsCancellationApprovalsUrl(
      locationCode,
      reqDocNo,
      type,
      sort,
      pageIndex,
      pageSize,
      status
    );

    return this.apiService
      .get(url.path, url.params)
      .pipe(map((data: any) => IbtRequestApprovalsItemHelper.getItems(data)));
  }

  getRequest(payload: SelectedStockPayload): Observable<RequestApprovals> {
    const url = getRequestByIdEndpointUrl(payload.id, payload.requestType);
    return this.apiService
      .get(url.path, url.params)
      .pipe(map((data: any) => RequestApprovalsItemsAdaptor.fromJson(data)));
  }

  getCancelRequest(
    payload: SelectedStockPayload
  ): Observable<RequestApprovals> {
    const url = getCancelRequestByIdEndpointUrl(
      payload.id,
      payload.requestType
    );
    return this.apiService
      .get(url.path, url.params)
      .pipe(map((data: any) => RequestApprovalsItemsAdaptor.fromJson(data)));
  }

  getRequestsCount(): Observable<LoadRequestTotalCountSuccessPayload> {
    const adjCountUrl = getAdjustmentApprovalsCountUrl();
    const lossCountUrl = getLossApprovalsCountUrl();
    const loanCountUrl = getLoanApprovalsCountUrl();
    const focCountUrl = getFocApprovalsCountUrl();
    const exhCountUrl = getExhibitionApprovalsCountUrl();
    const psvCountUrl = getPsvApprovalsCountUrl();

    return this.apiService
      .get(adjCountUrl.path, adjCountUrl.params)
      .pipe(map((data: any) => data.totalElements))
      .pipe(
        mergeMap(adjRequestCount =>
          this.apiService
            .get(lossCountUrl.path, lossCountUrl.params)
            .pipe(map((data: any) => data.totalElements))
            .pipe(
              mergeMap(lossRequestCount =>
                this.apiService
                  .get(loanCountUrl.path, loanCountUrl.params)
                  .pipe(map((data: any) => data.totalElements))
                  .pipe(
                    mergeMap(loanRequestCount =>
                      this.apiService
                        .get(focCountUrl.path, focCountUrl.params)
                        .pipe(map((data: any) => data.totalElements))
                        .pipe(
                          mergeMap(focRequestCount =>
                            this.apiService
                              .get(exhCountUrl.path, exhCountUrl.params)
                              .pipe(map((data: any) => data.totalElements))
                              .pipe(
                                mergeMap(exhRequestCount =>
                                  this.apiService
                                    .get(psvCountUrl.path, psvCountUrl.params)
                                    .pipe(
                                      map((data: any) => ({
                                        adjRequestCount: adjRequestCount,
                                        lossRequestCount: lossRequestCount,
                                        loanRequestCount: loanRequestCount,
                                        focRequestCount: focRequestCount,
                                        exhRequestCount: exhRequestCount,
                                        psvRequestCount: data.totalElements
                                      }))
                                    )
                                )
                              )
                          )
                        )
                    )
                  )
              )
            )
        )
      );
  }

  constructor(private apiService: ApiService, private http: HttpClient) {}
}
