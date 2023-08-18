import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BinToBinFileUploadItemsBulkTransferRequest,
  BinToBinTransferConfirmTransferAllItemsRequest,
  BinToBinTransferConfirmTransferItemsRequest,
  BinToBinTransferConfirmTransferResponse,
  BinToBinTransferLoadFileUploadItemsRequest,
  BinToBinTransferLoadItemListGroupResponse,
  BinToBinTransferLoadItemsResponse,
  BinToBinTransferTypeEnum
} from '@poss-web/shared/models';
import {
  BinToBinTransferHistoryAdaptor,
  BinToBinTransferHistoryItemHelper,
  BinToBinTransferItemHelper,
  BinToBinTransferItemListGroupHelper
} from '@poss-web/shared/util-adaptors';
import {
  ApiService,
  getBinToBinFileUploadItemsBulkTransferUrl,
  getBinToBinHistoryByPaginationEndpointUrl,
  getBinToBinHistoryItemsByPaginationEndpointUrl,
  getBinToBinSelectedHistoryUrl,
  getBinToBinTransferConfirmTransferAllItemsUrl,
  getBinToBinTransferConfirmTransferItemsUrl,
  getBinToBinTransferGetItemListGroupsUrl,
  getBinToBinTransferGetItemsUrl,
  getBinToBinTransferLoadFileUploadItemsUrl,
  getBinToBinTransferLoadItemsByFileIdUrl,
  getBinToBinTransferSearchItemsUrl
} from '@poss-web/shared/util-api-service';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class BinToBinTransferService {
  binType = 'BIN_BIN';

  constructor(private apiService: ApiService) {}

  getItemListGroups(
    type: string,
    pageIndex: number,
    pageSize: number,
    value?: string
  ): Observable<BinToBinTransferLoadItemListGroupResponse> {
    let transferBy: string;
    switch (type) {
      case BinToBinTransferTypeEnum.BIN_CODE: {
        transferBy = 'bins';
        break;
      }
      case BinToBinTransferTypeEnum.PRODUCT_GROUP: {
        transferBy = 'product-group';
        break;
      }
      case BinToBinTransferTypeEnum.PRODUCT_CATEGORY: {
        transferBy = 'product-category';
        break;
      }
    }

    const url = getBinToBinTransferGetItemListGroupsUrl(
      transferBy,
      pageIndex,
      pageSize,
      type,
      value,
      this.binType
    );
    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map((data: any) => BinToBinTransferItemListGroupHelper.getInfo(data))
      );
  }

  searchItems(
    itemCode: string,
    lotNumber: string,
    studdedProductGroups: string[] = []
  ): Observable<BinToBinTransferLoadItemsResponse> {
    const url = getBinToBinTransferSearchItemsUrl(
      itemCode,
      lotNumber,
      this.binType
    );

    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map((data: any) =>
          BinToBinTransferItemHelper.getItems(data, studdedProductGroups)
        )
      );
  }

  loadFileUploadId(
    payload: FormData,
    studdedProductGroups: string[] = []
  ): Observable<number> {
    const url = getBinToBinTransferLoadFileUploadItemsUrl();

    return this.apiService
      .postFile(url, payload)
      .pipe(
        map((data: any) =>
        data.fileId
        )
      );

  }

  loadFileUploadItems(
    payload: BinToBinTransferLoadFileUploadItemsRequest,
  ): Observable<BinToBinTransferLoadItemsResponse> {
    const url = getBinToBinTransferLoadItemsByFileIdUrl(payload);

    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map((data: any) =>
          BinToBinTransferItemHelper.getUploadedItems(data)
        )
      );

  }

  getItems(
    itemCode: string,
    lotNumber: string,
    type: string,
    value: string,
    pageIndex: number,
    pageSize: number,
    sortBy: string,
    sortOrder: string,
    filter: { key: string; value: any[] }[],
    studdedProductGroups: string[] = []
  ): Observable<BinToBinTransferLoadItemsResponse> {
    let url;
    url = getBinToBinTransferGetItemsUrl(
      itemCode,
      lotNumber,
      type,
      value,
      pageIndex,
      pageSize,
      sortBy,
      sortOrder,
      filter,
      this.binType
    );
    console.log(url);
    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map((data: any) =>
          BinToBinTransferItemHelper.getItems(data, studdedProductGroups)
        )
      );
  }

  confirmTransferItems(
    confirmTransferItemsRequest: BinToBinTransferConfirmTransferItemsRequest
  ): Observable<BinToBinTransferConfirmTransferResponse> {
    {
      const url = getBinToBinTransferConfirmTransferItemsUrl();
      let params = new HttpParams();
      if (confirmTransferItemsRequest.fileId) {
        params = params.set('id', `${confirmTransferItemsRequest.fileId}`)
      }
      return this.apiService
        .patch(url, confirmTransferItemsRequest.request, params)
        .pipe(map((data: any) => ({ transferId: data['docNo'] })));
    }
  }

  confirmFileUploadItemsBulkTransfer(
    payload: BinToBinFileUploadItemsBulkTransferRequest
  ): Observable<BinToBinTransferConfirmTransferResponse> {
    {
      const url = getBinToBinFileUploadItemsBulkTransferUrl(payload);
      return this.apiService
        .patch(url.path, {}, url.params)
        .pipe(map((data: any) => ({ transferId: data['docNo'] })));
    }
  }

  confirmTransferAllItems(
    request: BinToBinTransferConfirmTransferAllItemsRequest
  ): Observable<BinToBinTransferConfirmTransferResponse> {
    let typeUrl: string;
    let typeParam: string;
    {
      switch (request.type) {
        case BinToBinTransferTypeEnum.BIN_CODE: {
          typeUrl = 'bin';
          typeParam = 'srcBincode';
          break;
        }
        case BinToBinTransferTypeEnum.PRODUCT_GROUP: {
          typeUrl = 'product-group';
          typeParam = 'productGroup';
          break;
        }
        case BinToBinTransferTypeEnum.PRODUCT_CATEGORY: {
          typeUrl = 'product-category';
          typeParam = 'productCategory';
          break;
        }
      }

      const url = getBinToBinTransferConfirmTransferAllItemsUrl(
        typeUrl,
        typeParam,
        request.value,
        request.destinationBinCode,
        request.destinationBinGroupCode
      );
      return this.apiService
        .patch(url.path, null, url.params)
        .pipe(map((data: any) => ({ transferId: data['docNo'] })));
    }
  }

  getHistory(
    historyPayload: any,
    page: number,
    size: number,
    transactionType: string
  ): Observable<any> {
    const url = getBinToBinHistoryByPaginationEndpointUrl(
      page,
      size,
      transactionType
    );
    return this.apiService
      .post(url.path, historyPayload, url.params)
      .pipe(
        map((data: any) => BinToBinTransferHistoryItemHelper.getItems(data))
      );
  }

  getSelectedHistory(id: number) {
    const url = getBinToBinSelectedHistoryUrl(id);
    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map((data: any) =>
          BinToBinTransferHistoryAdaptor.historyItemFromJson(data)
        )
      );
  }
  getHistoryItems(
    historyItemsPayload: any,
    pageIndex: number,
    pageSize: number,
    sortBy: string,
    sortOrder: string,
    value: string,
    studdedProductGroups: string[] = []
  ): Observable<BinToBinTransferLoadItemsResponse> {
    const url = getBinToBinHistoryItemsByPaginationEndpointUrl(
      pageIndex,
      pageSize,
      sortBy,
      sortOrder,
      value
    );
    return this.apiService
      .post(url.path, historyItemsPayload, url.params)
      .pipe(
        map((data: any) =>
          BinToBinTransferItemHelper.getHistoryItems(data, studdedProductGroups)
        )
      );
  }
}
