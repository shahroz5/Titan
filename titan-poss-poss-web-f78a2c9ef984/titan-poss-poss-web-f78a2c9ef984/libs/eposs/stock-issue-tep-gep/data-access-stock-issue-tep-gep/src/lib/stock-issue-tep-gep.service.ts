import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import {
  ApiService,
  getCreateStockIssueUrl,
  getStockIssueItemsUrl,
  getCreateStockIssueItemsUrl,
  updateStockIssueUrl,
  getStockIssueItemsCountUrl,
  getLocationCodeTypeUrl,
  getSelectedStockIssueUrl
} from '@poss-web/shared/util-api-service';
import {
  StockIssueTEPGEPAdaptor,
  StockIssueTEPGEPHelper
} from '@poss-web/shared/util-adaptors';
import {
  CreateStockIssueResponse,
  StockIssueItem,
  StoreTypes
} from '@poss-web/shared/models';

@Injectable()
export class StockIssueTepGepService {
  /**
   * Issue TEP/GEP APIS
   */
  constructor(private apiService: ApiService) {}

  isL1L2Store = (storeType: string): boolean => {
    return (
      storeType === StoreTypes.LargeFormatStoreType ||
      storeType === StoreTypes.MediumFormatStoreType
    );
  };

  isL3Store = (storeType: string): boolean => {
    return storeType === StoreTypes.SmallFormatStoreType;
  };

  createStockIssue(
    transferType: string,
    storeType: string
  ): Observable<CreateStockIssueResponse> {
    const createStockIssueUrl = getCreateStockIssueUrl(transferType, storeType);
    return this.apiService
      .post(createStockIssueUrl.path, null, createStockIssueUrl.params)
      .pipe(
        map((data: any) =>
          StockIssueTEPGEPAdaptor.createStockIssueResponseFromJson(data)
        )
      );
  }

  updateStockIssue(
    id: number,
    transferType: string,
    storeType: string,
    remarks: string,
    carrierDetails: any,
    locationCode?: string
  ): Observable<CreateStockIssueResponse> {
    const updateIssueUrl = updateStockIssueUrl(id, transferType, storeType);
    if (this.isL1L2Store(storeType)) {
      return this.apiService
        .post(
          updateIssueUrl.path,
          {
            carrierDetails,
            destinationLocationCode: locationCode,
            remarks
          },
          updateIssueUrl.params
        )
        .pipe(
          map((data: any) =>
            StockIssueTEPGEPAdaptor.createStockIssueResponseFromJson(data)
          )
        );
    } else if (this.isL3Store(storeType)) {
      return this.apiService
        .patch(
          updateIssueUrl.path,
          {
            carrierDetails,
            cfaLocationCode: locationCode,
            remarks
          },
          updateIssueUrl.params
        )
        .pipe(
          map((data: any) =>
            StockIssueTEPGEPAdaptor.createStockIssueResponseFromJson(data)
          )
        );
    }
  }

  createStockIssueItems(
    id: number,
    transferType: string,
    storeType: string,
    issueItems: any[]
  ): Observable<any> {
    const createStockIssueItemsUrl = getCreateStockIssueItemsUrl(
      id,
      transferType,
      storeType
    );
    if (this.isL1L2Store(storeType)) {
      return this.apiService
        .post(
          createStockIssueItemsUrl.path,
          {
            stockItems: issueItems
          },
          createStockIssueItemsUrl.params
        )
        .pipe(map((data: any) => data));
    } else if (this.isL3Store(storeType)) {
      return this.apiService
        .post(
          createStockIssueItemsUrl.path,
          {
            invoiceItems: issueItems
          },
          createStockIssueItemsUrl.params
        )
        .pipe(map((data: any) => data));
    }
  }

  loadStockIssueItems(
    id: number,
    itemCode: string,
    lotNumber: string,
    transferType: string,
    storeType: string,
    status: string,
    pageIndex: number,
    pageSize: number,
    sort: Map<string, string>,
    filter: Map<string, string>,
    studdedProductGroups: string[] = [],
    cfaLocationCode?: string
  ): Observable<StockIssueItem[]> {
    const getIssueItemsUrl = getStockIssueItemsUrl(
      id,
      itemCode,
      lotNumber,
      transferType,
      storeType,
      status,
      pageIndex,
      pageSize,
      sort,
      filter,
      cfaLocationCode
    );
    return this.apiService
      .get(getIssueItemsUrl)
      .pipe(
        map((data: any) =>
          StockIssueTEPGEPHelper.getStockIssueItems(data, studdedProductGroups)
        )
      );
  }

  updateAllStockIssueItems(
    id: number,
    transferType: string,
    storeType: string,
    itemIds: any[]
  ): Observable<any> {
    const updateAllIssueItemsUrl = getCreateStockIssueItemsUrl(
      id,
      transferType,
      storeType
    );
    return this.apiService
      .put(
        updateAllIssueItemsUrl.path,
        { itemIds },
        updateAllIssueItemsUrl.params
      )
      .pipe(map((data: any) => data));
  }

  loadTotalCount(
    id: number,
    transferType: string,
    storeType: string,
    status: string,
    cfaLocationCode?: string
  ): Observable<number> {
    const loadTotalCountUrl = getStockIssueItemsCountUrl(
      id,
      transferType,
      storeType,
      status,
      cfaLocationCode
    );
    return this.apiService
      .get(loadTotalCountUrl.path, loadTotalCountUrl.params)
      .pipe(map((data: any) => data.totalElements));
  }

  getLocationCode(): Observable<string[]> {
    const url = getLocationCodeTypeUrl();

    return this.apiService
      .get(url)
      .pipe(map((data: any) => StockIssueTEPGEPHelper.getLocationCodes(data)));
  }

  getSelectedStockIssue(
    transferType: string,
    storeType: string,
    id: number
  ): Observable<CreateStockIssueResponse> {
    const selectedStockIssueUrl = getSelectedStockIssueUrl(
      transferType,
      storeType,
      id
    );
    return this.apiService
      .get(selectedStockIssueUrl.path, selectedStockIssueUrl.params)
      .pipe(
        map((data: any) =>
          StockIssueTEPGEPAdaptor.createStockIssueResponseFromJson(data)
        )
      );
  }
}
