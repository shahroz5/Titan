import { Injectable } from '@angular/core';
import {
  getCreateRequestEndpointUrl,
  getConfirmReturnInvoiceCfaEndpointUrl,
  getSearchReturnInvoiceItemCfaEndpointUrl,
  getCreateIssueItemsEndPointUrl,
  getRemoveSelectedItemsUrl,
  getItemsToCFAUrl,
  getLoadHeaderLevelUrl,
  getStockIssueInvoiceHistoryEndpointUrl,
  getStockIssueItemsUrl,
  getCreateRequestDirectIssueEndpointUrl,
  getItemsToDirectIssueUrl,
  getSearchDirectIssueEndpointUrl,
  getCreateDirectIssueItemsEndPointUrl,
  getRemoveDirectIssueSelectedItemsUrl,
  getConfirmDirectIssueEndpointUrl,
  getDirectIssueLoadHeaderLevelUrl
} from '@poss-web/shared/util-api-service';
import { map, takeUntil } from 'rxjs/operators';
import { ApiService } from '@poss-web/shared/util-api-service';
import { combineLatest, Observable, Subject } from 'rxjs';
import {
  SearchItemPayloadSuccess,
  LoadStockReturnItemsPayload,
  ConfirmCFAItems,
  InvoiceItems,
  LoadStockIssueInvoiceHistory,
  LoadItemsSuccessPayload,
} from '@poss-web/shared/models';
import { StockReturnAdaptor } from '@poss-web/shared/util-adaptors';
import { HttpParams } from '@angular/common/http';
import { ProfileDataFacade } from '@poss-web/shared/profile/data-access-profile';
@Injectable({
  providedIn: 'root'
})
export class StockReturnService {
  private destroy$ = new Subject<null>();
  isL1L2Store: boolean;
  isL3Store: boolean;
  storeType: string;
  constructor(private apiService: ApiService,
    private profiledatafacade: ProfileDataFacade) {
    combineLatest([
      this.profiledatafacade.getBoutiqueType(),
      this.profiledatafacade.isL1Boutique(),
      this.profiledatafacade.isL2Boutique(),
      this.profiledatafacade.isL3Boutique()
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([val, val1, val2, val3]) => {
        this.storeType = val;
        this.isL1L2Store = val1 || val2;
        this.isL3Store = val3;
      });
  }
  createReturnRequestToCfa() {
    if(this.isL3Store){
    const url = getCreateRequestEndpointUrl();
    return this.apiService
      .post(url.path, {}, url.params)
      .pipe(map((data: any) => StockReturnAdaptor.invoiceIdFromJson(data)));
    }
    else if(this.isL1L2Store){
      const url = getCreateRequestDirectIssueEndpointUrl();
      return this.apiService
        .post(url.path, {}, url.params)
        .pipe(map((data: any) => StockReturnAdaptor.invoiceIdFromJson(data)));
    }
  }
  confirmIssueCfa(
    id: number,
    confirmIssue: ConfirmCFAItems
  ): Observable<number> {
    if(this.isL3Store){
      const url = getConfirmReturnInvoiceCfaEndpointUrl(id);
      return this.apiService
      .patch(url.path, confirmIssue, url.params)
      .pipe(
        map((data: any) => StockReturnAdaptor.confirmedIssueInvoiceTocfa(data))
      );
    }
    else if(this.isL1L2Store){
      const url = getConfirmDirectIssueEndpointUrl(id);
      return this.apiService
      .post(url.path, confirmIssue, url.params)
      .pipe(
        map((data: any) => StockReturnAdaptor.confirmedIssueInvoiceTocfa(data))
      );
    }
  }
  searchItem(
    id: number,
    variantCode: string,
    lotNumber: string,
    studdedProductGroups: string[] = []
  ): Observable<SearchItemPayloadSuccess> {
    if(this.isL3Store){
    const url = getSearchReturnInvoiceItemCfaEndpointUrl(
      id,
      variantCode,
      lotNumber
    );
    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map((data: any) =>
          StockReturnAdaptor.searchedItems(data, studdedProductGroups)
        )
      );
    }
    else if(this.isL1L2Store){
      const url = getSearchDirectIssueEndpointUrl(
        id,
        variantCode,
        lotNumber
      );
      return this.apiService
        .get(url.path, url.params)
        .pipe(
          map((data: any) =>
            StockReturnAdaptor.searchedItems(data, studdedProductGroups)
          )
        );
      }
  }
  createIssueItems(id: number, invoiceItems: InvoiceItems[], stockItems:InvoiceItems[]): Observable<any> {
    if(this.isL3Store){
    const url = getCreateIssueItemsEndPointUrl(id);
    return this.apiService.post(
      url.path,
      {
        invoiceItems: invoiceItems
      },
      url.params
      );
    }
    else if(this.isL1L2Store){
      const url = getCreateDirectIssueItemsEndPointUrl(id);
      return this.apiService.post(
        url.path,
        {
          stockItems: stockItems
        },
        url.params
        );
      }
  }

  getItemsCFA(
    loadItem: LoadStockReturnItemsPayload,
    studdedProductGroups: string[] = []
  ) {
    if(this.isL3Store){
    let url: { path: string; params: HttpParams };
    url = getItemsToCFAUrl(
      loadItem.id,
      loadItem.pageIndex,
      loadItem.pageSize,
      loadItem.sortBy,
      loadItem.sortOrder,
      loadItem.itemId,
      loadItem.lotNumber,
      loadItem.filter
    );
    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map((data: any) =>
          StockReturnAdaptor.getItemsFromJson(data, studdedProductGroups)
        )
      );
    }
    if(this.isL1L2Store){
      let url: { path: string; params: HttpParams };
      url = getItemsToDirectIssueUrl(
        loadItem.id,
        loadItem.pageIndex,
        loadItem.pageSize,
        loadItem.sortBy,
        loadItem.sortOrder,
        loadItem.itemId,
        loadItem.lotNumber,
        loadItem.filter
      );
      return this.apiService
        .get(url.path, url.params)
        .pipe(
          map((data: any) =>
            StockReturnAdaptor.getItemsFromJson(data, studdedProductGroups)
          )
        );
      }
  }

  removeSelectedItems(id: number, items: number[]) {
    if(this.isL3Store){
      const url = getRemoveSelectedItemsUrl(id);
      return this.apiService.put(url.path, { itemIds: items }, url.params);
    }
    else if(this.isL1L2Store){
      const url = getRemoveDirectIssueSelectedItemsUrl(id);
      return this.apiService.put(url.path, { itemIds: items }, url.params);
    }
  }

  loadHeaderLevelDetails(requestId: number) {
    if(this.isL3Store){
      const url = getLoadHeaderLevelUrl(requestId);
      return this.apiService
        .get(url.path, url.params)
        .pipe(map((data: any) => StockReturnAdaptor.getHeaderLevelDetails(data)));
    }
    if(this.isL1L2Store){
      const url = getDirectIssueLoadHeaderLevelUrl(requestId);
      return this.apiService
        .get(url.path, url.params)
        .pipe(map((data: any) => StockReturnAdaptor.getHeaderLevelDetails(data)));
    }
  }
  getInvoiceHistory(
    stockIssueinvoiceHistory: LoadStockIssueInvoiceHistory,
    pageIndex: number,
    pageSize: number,
    invoiceType: string
  ) {
    const url = getStockIssueInvoiceHistoryEndpointUrl(
      pageIndex,
      pageSize,
      invoiceType
    );
    return this.apiService
      .post(url.path, stockIssueinvoiceHistory, url.params)
      .pipe(map((data: any) => StockReturnAdaptor.StockInvoiceHistory(data)));
  }


  // loadStockIssueItems(
  //   loadItem: LoadStockReturnItemsPayloadCfa,
  //   studdedProductGroups: string[] = []
  // ) {
  //   let url: { path: string; params: HttpParams };
  //    url = getStockIssueItemsUrl(
  //     loadItem.id,
  //     loadItem.itemCode,
  //     loadItem.lotNumber,
  //     loadItem.transferType,
  //     loadItem.storeType,
  //     loadItem.status,
  //     loadItem.pageIndex,
  //     loadItem.pageSize,
  //     loadItem.sort,
  //     loadItem.filter,
  //   );
  //   return this.apiService
  //     .get(url.path, url.params)
  //     .pipe(
  //       map((data: any) =>
  //         StockReturnAdaptor.getItemsFromJson(data, studdedProductGroups)
  //       )
  //     );
  // }

  loadStockIssueItems(
    id: number,
    itemCode: string,
    lotNumber: string,
    transferType: string,
    storeType: string,
    status: string,
    pageIndex: number,
    pageSize: number,
    sortBy: Map<string, string>,
    filter: Map<string, string>,
    studdedProductGroups: string[] = []
  ): Observable<LoadItemsSuccessPayload> {
    const getIssueItemsUrl = getStockIssueItemsUrl(
      id,
      itemCode,
      lotNumber,
      transferType,
      storeType,
      status,
      pageIndex,
      pageSize,
      sortBy,
      filter
    );
    return this.apiService
      .get(getIssueItemsUrl)
      .pipe(
        map((data: any) =>
          StockReturnAdaptor.getItemsFromJson(data, studdedProductGroups)
        )
      );
  }

}
