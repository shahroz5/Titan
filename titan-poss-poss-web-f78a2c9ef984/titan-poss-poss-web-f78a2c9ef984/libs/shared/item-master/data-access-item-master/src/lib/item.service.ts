import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  ApiService,
  getItemStonesUrl,
  getFilterItemDetailsListingUrl
} from '@poss-web/shared/util-api-service';

import {
  LoadItemListingSuccessPayload,
  ItemStones,
  ItemFilter,
  ItemDetails
} from '@poss-web/shared/models';
import { ItemAdaptor } from '@poss-web/shared/util-adaptors';
@Injectable()
export class ItemListingService {
  constructor(
    private apiService: ApiService // private lovService: LovDataService
  ) {}

  getItemByItemCode(itemCode: string): Observable<ItemDetails> {
    const payload = {
      itemCode: encodeURIComponent(itemCode)
    };

    const url = getFilterItemDetailsListingUrl();
    return this.apiService
      .post(url.path, payload, url.params)
      .pipe(map(data => ItemAdaptor.getItemDetailsByItemCode(data)));
  }

  getItemStones(itemCode): Observable<ItemStones[]> {
    const url = getItemStonesUrl(itemCode);
    return this.apiService
      .get(url)
      .pipe(map(data => ItemAdaptor.getItemStones(data)));
  }
  getFilterItemDetails(
    payload: ItemFilter
  ): Observable<LoadItemListingSuccessPayload> {
    const url = getFilterItemDetailsListingUrl(
      payload.paginate.pageIndex,
      payload.paginate.pageSize
    );
    return this.apiService
      .post(url.path, payload.filterPayload, url.params)
      .pipe(map(data => ItemAdaptor.getItemDetailsListing(data)));
  }
  // getCFAproductCode(): Observable<ProductGroup[]> {
  //   const url = getCFAProductCodeLiteDataUrl();
  //   return this.apiService
  //     .get(url.path, url.params)
  //     .pipe(map(data => ItemAdaptor.getCFAProductCode(data)));
  // }
}
