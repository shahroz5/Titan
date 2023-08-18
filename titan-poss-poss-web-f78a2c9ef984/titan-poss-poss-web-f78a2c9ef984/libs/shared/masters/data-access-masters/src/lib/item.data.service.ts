import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  Item,
  ItemSummary,
  ItemSummaryConversion,
  ItemStoneDetails,
  ImageUrlDetails
} from '@poss-web/shared/models';
import { concatMap, map } from 'rxjs/operators';
import {
  ItemDataAdaptor,
  StoneDetailsHelper
} from '@poss-web/shared/util-adaptors';
import {
  getMasterItemStoneDetailsUrl,
  getMasterItemByCodeUrl,
  getMasterItemSummaryByCodeUrl,
  getMasterItemSummaryConversionCodeUrl,
  getMasterItemUrlByCodeUrl,
  getvendorsCodeUrl,
  ApiService,
  getMasterItemWithoutLotStoneDetailsUrl
} from '@poss-web/shared/util-api-service';
import { CacheableApiService } from '@poss-web/shared/util-cacheable-api-service';
@Injectable({
  providedIn: 'root'
})
export class ItemDataService {
  constructor(
    private apiService: CacheableApiService,
    private apiSer: ApiService
  ) {}

  getItemByCode(itemCode: string): Observable<Item> {
    const url = getMasterItemByCodeUrl(itemCode);
    return this.apiService
      .get(url)
      .pipe(map((data: any) => ItemDataAdaptor.ItemFromJson(data)));
  }

  getItemSummaryByCode(
    itemCode: string,
    studded?: string[]
  ): Observable<ItemSummary> {
    const url = getMasterItemSummaryByCodeUrl(itemCode);
    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map((data: any) =>
          ItemDataAdaptor.ItemSummaryFromJson(data.results[0], studded)
        )
      );
  }

  getCoversionItemSummaryByItemCode(
    itemCode: string,
    lotNumber?: string
  ): Observable<ItemSummaryConversion> {
    const url = getMasterItemSummaryConversionCodeUrl(itemCode, lotNumber);
    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map((data: any) => ItemDataAdaptor.ItemSummaryConversionFromJson(data))
      );
  }

  getItemStoneDetails(
    itemCode: string,
    lotNumber: string | number,
    locationCode?: string
  ): Observable<ItemStoneDetails[]> {
    const url = getMasterItemStoneDetailsUrl(itemCode, lotNumber, locationCode);
    return this.apiSer
      .get(url.path, url.params)
      .pipe(map((data: any) => StoneDetailsHelper.getStoneDetails(data)));
  }

  getItemWithoutLotStoneDetails(
    itemCode: string
  ): Observable<ItemStoneDetails[]> {
    const url = getMasterItemWithoutLotStoneDetailsUrl(itemCode);
    return this.apiSer
      .get(url.path)
      .pipe(map((data: any) => StoneDetailsHelper.getStoneDetails(data)));
  }

  getItemUrlByCode(itemCode: string): Observable<any> {
    let imageBaseUrl;
    let imageUrlHeaders;
    const url = getMasterItemUrlByCodeUrl();
    return this.apiService
      .post(url, { itemCode: itemCode })
      .pipe(map(data => (imageBaseUrl = data.results[0])))

      .pipe(
        concatMap(data =>
          this.apiService
            .get(getvendorsCodeUrl('CATALOGUE'))
            .pipe(map(data => (imageUrlHeaders = data)))
        )
      )
      .pipe(
        concatMap(imageUrlHeaders => {
          imageBaseUrl.imageUrl = imageBaseUrl.imageUrl.replace(
            'ImageParameter=2',
            'ImageParameter=1'
          );
          //let imageUrl = imageBaseUrl.imageUrl
          let imageUrl = imageUrlHeaders.baseurl + imageBaseUrl.imageUrl;
          return of(imageUrl);
          let apiKey = imageUrlHeaders.vendorDetails.data.apikey;
          let userToken = imageUrlHeaders.vendorDetails.data.usertoken;
          // return this.apiSer
          //   .getImageSrcUrl(imageUrl, apiKey, userToken)
          //   .pipe(map(data => data));
        })
      );
  }
}
