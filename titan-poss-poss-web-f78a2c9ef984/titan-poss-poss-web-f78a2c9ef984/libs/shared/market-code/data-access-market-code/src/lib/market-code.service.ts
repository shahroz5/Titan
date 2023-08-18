import { Injectable } from '@angular/core';
import { map, mergeMap } from 'rxjs/operators';
import {
  ApiService,
  getMarketCodeListingUrl,
  getMarketCodeDetailsBasedOnMarketCodeUrl,
  getSaveMarketCodeUrl,
  getUpdateMarketCodeUrl,
  getSaveMarketMaterialFacatorsUrl,
  getUpdateMarketMaterialFacatorsUrl,
  getLoadMaterialFacatorsBasedOnMarketCodeUrl
} from '@poss-web/shared/util-api-service';
import {
  LoadMarketCodesListingPayload,
  SaveMarketCodeDetailsPayload,
  UpdateMarketCodeDetailsPayload,
  SaveMarketMaterialFactorsPayload
} from '@poss-web/shared/models';
import { MarketCodeAdaptor } from '@poss-web/shared/util-adaptors';
import { of } from 'rxjs';
@Injectable()
export class MarketCodeService {
  constructor(private apiService: ApiService) {}
  getMarketDetails(loadMarketCodes: LoadMarketCodesListingPayload) {
    const url = getMarketCodeListingUrl(
      loadMarketCodes.pageIndex,
      loadMarketCodes.pageSize
    );

    return this.apiService
      .get(url.path, url.params)
      .pipe(map(data => MarketCodeAdaptor.getMarketCodeListing(data)));
  }

  saveMarketCodeDetails(saveMarketCodeDetails: SaveMarketCodeDetailsPayload) {
    const url = getSaveMarketCodeUrl();
    return this.apiService.post(url, saveMarketCodeDetails);
  }
  updateMarketCodeDetails(
    updateMarketCodeDetails: UpdateMarketCodeDetailsPayload
  ) {
    const url = getUpdateMarketCodeUrl(updateMarketCodeDetails.marketCode);
    return this.apiService.patch(
      url,
      updateMarketCodeDetails.updateMarketDetails
    );
  }
  saveMarketMaterialFacators(
    saveMarketMaterialFacators: SaveMarketMaterialFactorsPayload
  ) {
    const url = getSaveMarketMaterialFacatorsUrl(
      saveMarketMaterialFacators.marketCode
    );
    return this.apiService.post(url, {
      marketMarkupFactors: saveMarketMaterialFacators.marketMarkupFactors
    });
  }
  updateMarketMaterialFacators(
    updateMarketMaterialFacators: SaveMarketMaterialFactorsPayload
  ) {
    const url = getUpdateMarketMaterialFacatorsUrl(
      updateMarketMaterialFacators.marketCode
    );
    return this.apiService.put(url, {
      marketMarkupFactors: updateMarketMaterialFacators.marketMarkupFactors
    });
  }

  loadMaterialFacatorsBasedOnMarketCode(marketCode: string) {
    const url = getLoadMaterialFacatorsBasedOnMarketCodeUrl(marketCode);
    return this.apiService
      .get(url)
      .pipe(map(data => MarketCodeAdaptor.getMarketMaterialFacators(data)));
  }
  getSearchResult(marketCode: string) {
    const marketDetailsUrl = getMarketCodeDetailsBasedOnMarketCodeUrl(
      marketCode
    );
    return this.apiService
      .get(marketDetailsUrl)
      .pipe(map(data => MarketCodeAdaptor.getMarketCodeSearchResult(data)));
  }
  getMarketDetailsBasedOnMarketCode(marketCode: string) {
    if (marketCode === 'new') {
      return of(
        MarketCodeAdaptor.getMarketCodeDetailsBasedOnMarketCode(marketCode)
      );
    } else {
      const marketDetailsUrl = getMarketCodeDetailsBasedOnMarketCodeUrl(
        marketCode
      );
      const marketMaterialFacatosUrl = getLoadMaterialFacatorsBasedOnMarketCodeUrl(
        marketCode
      );
      return this.apiService
        .get(marketDetailsUrl)
        .pipe(map(data => MarketCodeAdaptor.getMarketCodeDetails(data)))
        .pipe(
          mergeMap(marketDetails =>
            this.apiService.get(marketMaterialFacatosUrl).pipe(
              map((data: any) => ({
                ...marketDetails,
                marketMaterialFacators: MarketCodeAdaptor.getMarketMaterialFacators(
                  data
                )
              }))
            )
          )
        );
    }
  }
}
