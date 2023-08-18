import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

import {
  ApiService,
  getRequestListByPaginationEndpointUrl,
  getBoutiqueListByPaginationEndpointUrl,
  getCreateRequestListEndpointUrl,
  getRequestEndpointUrl,
  getItemListEndpointUrl,
  updateItemListEndpointUrl,
  updateItemListStatusEndpointUrl,
  getIBTHistoryByPaginationEndpointUrl,
  getIBTSelectedHistoryUrl,
  getIBTHistoryItemsByPaginationEndpointUrl,
} from '@poss-web/shared/util-api-service';
import {
  RequestList,
  RequestItem,
  BoutiqueList,
  ItemList,
  InterBoutiqueTransferRequestTypesEnum
} from '@poss-web/shared/models';
import {
  InterBoutiqueTransferHelper,
  InterBoutiqueTransferAdaptor
} from '@poss-web/shared/util-adaptors';

@Injectable()
export class InterBoutiqueTransferService {
  constructor(
    private apiService: ApiService,
  ) {}
  getRequestList(
    type: string,
    searchValue: number,
    pageIndex: number,
    pageSize: number
  ): Observable<RequestList[]> {
    const requestListUrl = getRequestListByPaginationEndpointUrl(
      type,
      searchValue,
      pageIndex,
      pageSize
    );
    return this.apiService
      .get(requestListUrl.path, requestListUrl.params)
      .pipe(
        map((data: any) => InterBoutiqueTransferHelper.getRequestList(data))
      );
  }

  getRequestCount(type: string, searchValue: number): Observable<number> {
    const requestCountUrl = getRequestListByPaginationEndpointUrl(
      type,
      searchValue,
      0,
      1
    );
    return this.apiService
      .get(requestCountUrl.path, requestCountUrl.params)
      .pipe(map((data: any) => data.totalElements));
  }

  getBoutiqueList(
    items: Array<RequestItem>,
    regionType: string,
    pageIndex: number,
    pageSize: number
  ): Observable<BoutiqueList[]> {
    const boutiqueListUrl = getBoutiqueListByPaginationEndpointUrl(
      regionType,
      pageIndex,
      pageSize
    );
    return this.apiService
      .post(boutiqueListUrl.path, { reqItems: items }, boutiqueListUrl.params)
      .pipe(
        map((data: any) => InterBoutiqueTransferHelper.getBoutiqueList(data))
      );
  }

  getBoutiqueCount(
    items: Array<RequestItem>,
    regionType: string
  ): Observable<number> {
    const boutiqueCountUrl = getBoutiqueListByPaginationEndpointUrl(
      regionType,
      0,
      1
    );
    return this.apiService
      .post(boutiqueCountUrl.path, { reqItems: items }, boutiqueCountUrl.params)
      .pipe(map((data: any) => data.totalElements));
  }

  createRequest(
    items: Array<RequestItem>,
    remarks: string,
    srcLocationCode: string
  ): Observable<RequestList> {
    const createRequestUrl = getCreateRequestListEndpointUrl();
    return this.apiService
      .post(
        createRequestUrl.path,
        { items, remarks, srcLocationCode },
        createRequestUrl.params
      )
      .pipe(
        map((data: any) => InterBoutiqueTransferAdaptor.requestFromJson(data))
      );
  }

  getRequest(id: number, requestGroup: string): Observable<RequestList> {
    const selectedRequestDetailsUrl = getRequestEndpointUrl(id, requestGroup);
    return this.apiService
      .get(selectedRequestDetailsUrl.path, selectedRequestDetailsUrl.params)
      .pipe(
        map((data: any) => InterBoutiqueTransferAdaptor.requestFromJson(data))
      );
  }

  getItemList(
    id: number,
    requestGroup: string,
    studdedProductGroups: string[] = []
  ): Observable<ItemList[]> {
    const selectedRequestProductListUrl = getItemListEndpointUrl(
      id,
      requestGroup
    );

    return this.apiService
      .get(
        selectedRequestProductListUrl.path,
        selectedRequestProductListUrl.params
      )
      .pipe(
        map((data: any) =>
          InterBoutiqueTransferHelper.getItemList(data, studdedProductGroups)
        )
      );
  }

  updateItemList(
    id: number,
    itemId: string,
    requestGroup: string,
    itemDetail: any,
    studdedProductGroups: string[] = []
  ): Observable<ItemList> {
    const updateSelectedRequestProductListUrl = updateItemListEndpointUrl(
      id,
      itemId,
      requestGroup
    );
    return this.apiService
      .patch(
        updateSelectedRequestProductListUrl.path,
        itemDetail,
        updateSelectedRequestProductListUrl.params
      )
      .pipe(
        map((data: any) =>
          InterBoutiqueTransferAdaptor.itemFromJson(data, studdedProductGroups)
        )
      );
  }

  updateItemListStatus(
    status: string,
    id: number,
    itemIds: Array<string>,
    requestGroup: string,
    remarks: string
  ): Observable<RequestList> {
    const updateSelectedRequestProductListStatusUrl = updateItemListStatusEndpointUrl(
      id,
      requestGroup
    );

    return this.apiService
      .patch(
        updateSelectedRequestProductListStatusUrl.path,
        {
          itemIds,
          requestGroup,
          remarks,
          status
        },
        updateSelectedRequestProductListStatusUrl.params
      )
      .pipe(
        map((data: any) => InterBoutiqueTransferAdaptor.requestFromJson(data))
      );
  }

  getHistory(
    historyPayload: any,
    page: number,
    size: number,
    requestType: string
  ): Observable<any> {
    const url = getIBTHistoryByPaginationEndpointUrl(page, size, requestType);
    console.log('....url', url);

    return this.apiService
      .post(url.path, historyPayload, url.params)
      .pipe(
        map((data: any) => InterBoutiqueTransferHelper.getHistoryItemList(data))
      );
  }

  getSelectedHistory(id: number, actionType: string) {
    const url = getIBTSelectedHistoryUrl(id, actionType);
    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map((data: any) => InterBoutiqueTransferAdaptor.historyFromJson(data))
      );
  }
  getHistoryItems(
    historyItemsPayload: any,
    requestType: string,
    pageIndex: number,
    pageSize: number,
    value: number,
    actionType: string,
    studdedProductGroups: string[] = []
  ): Observable<ItemList[]> {
    console.log(
      historyItemsPayload,
      requestType,
      pageIndex,
      pageSize,
      value,
      actionType,
      studdedProductGroups
    );

    if (
      requestType &&
      requestType === InterBoutiqueTransferRequestTypesEnum.HISTORY &&
      actionType
    ) {
      const url = getIBTHistoryItemsByPaginationEndpointUrl(
        pageIndex,
        pageSize,
        value,
        actionType
      );
      return this.apiService
        .post(url.path, historyItemsPayload, url.params)
        .pipe(
          map((data: any) =>
            InterBoutiqueTransferHelper.getItemList(data, studdedProductGroups)
          )
        );
    }
  }
}
