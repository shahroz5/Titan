import { Injectable } from '@angular/core';
import {
  ApiService,
  getMetalPriceDetailsUrl,
  getMarketDetailsBasedOnMaterialUrl,
  getComputeMaterialPriceUrl,
  getSavePriceUrl,
  getSavedBasePriceUrl,
  getSearchMarketCodeUrl,
  getsearchComputedPriceByLocationCodeUrl,
  getSearchSavedLocationPriceByLocationCodeUrl,
  getresetAmountToZeroUrl
} from '@poss-web/shared/util-api-service';
import { MarketMaterialPriceAdaptor } from '@poss-web/shared/util-adaptors';
import {
  MaterialPricePayload,
  ViewLocationPayload,
  SavePricePayload,
  LoadSavedBasePrice,
  SearchMarketCodePayload,
  LoadMarketBasedOnMaterial
} from '@poss-web/shared/models';

import { map } from 'rxjs/operators';
@Injectable()
export class MaterialPriceService {
  constructor(private apiService: ApiService) {}

  getMaterialPriceDetails(materialPricePayload: MaterialPricePayload) {
    let url;
    if (materialPricePayload.configId) {
      url = getMetalPriceDetailsUrl(
        materialPricePayload.materialCode,
        materialPricePayload.pageIndex,
        materialPricePayload.pageSize,
        materialPricePayload.configId
      );
    } else {
      url = getMetalPriceDetailsUrl(
        materialPricePayload.materialCode,
        materialPricePayload.pageIndex,
        materialPricePayload.pageSize
      );
    }

    return this.apiService
      .post(
        url.path,
        { applicableDate: materialPricePayload.applicableDate },
        url.params
      )
      .pipe(
        map(data => MarketMaterialPriceAdaptor.getMetalPriceDetailsData(data))
      );
  }

  getMarketDetailsBasedOnMaterial(
    loadMarketBasedOnMaterial: LoadMarketBasedOnMaterial
  ) {
    const url = getMarketDetailsBasedOnMaterialUrl(
      loadMarketBasedOnMaterial.data.materialCode,
      loadMarketBasedOnMaterial.data.pageIndex,
      loadMarketBasedOnMaterial.data.pageSize
    );

    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map(data =>
          MarketMaterialPriceAdaptor.getMarketDetailsBasedOnMarketCode(
            data,
            loadMarketBasedOnMaterial.selectedStock,
            loadMarketBasedOnMaterial.isAllSelected,
            loadMarketBasedOnMaterial.basePrice
          )
        )
      );
  }

  getComputedLocationPrice(viewLocationPrice: ViewLocationPayload) {
    const url = getComputeMaterialPriceUrl(
      viewLocationPrice.materialCode,
      viewLocationPrice.pageIndex,
      viewLocationPrice.pageSize
    );
    return this.apiService
      .post(url.path, viewLocationPrice.data, url.params)
      .pipe(map(data => MarketMaterialPriceAdaptor.getSavedBasePrice(data)));
  }

  loadSavedBasePrice(loadSavedBasePrice: LoadSavedBasePrice) {
    const url = getSavedBasePriceUrl(
      loadSavedBasePrice.materialCode,
      loadSavedBasePrice.id,
      loadSavedBasePrice.pageIndex,
      loadSavedBasePrice.pageSize
    );

    return this.apiService
      .get(url.path, url.params)
      .pipe(map(data => MarketMaterialPriceAdaptor.getSavedBasePrice(data)));
  }

  savePrice(savePricePayload: SavePricePayload) {
    const url = getSavePriceUrl(savePricePayload.materialCode);

    return this.apiService.put(url, savePricePayload.data);
  }
  getSearchResult(searchMarketCodePayload: SearchMarketCodePayload) {
    const url = getSearchMarketCodeUrl(
      searchMarketCodePayload.data.materialCode,
      searchMarketCodePayload.data.marketCode
    );

    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map(data =>
          MarketMaterialPriceAdaptor.getMarketDetailsBasedOnMarketCode(
            data,
            searchMarketCodePayload.selectedStock,
            searchMarketCodePayload.isAllSelected,
            searchMarketCodePayload.basePrice
          )
        )
      );
  }

  searchComputedPriceByLocationCode(
    locationCode: string,
    materialCode: string,
    data: any
  ) {
    const url = getsearchComputedPriceByLocationCodeUrl(
      locationCode,
      materialCode
    );
    return this.apiService
      .post(url.path, data, url.params)
      .pipe(
        map(computedPrice =>
          MarketMaterialPriceAdaptor.getSavedBasePrice(computedPrice)
        )
      );
  }
  searchSavedLocationPriceByLocationCode(
    id: string,
    marketCode: string,
    materialCode: string
  ) {
    const url = getSearchSavedLocationPriceByLocationCodeUrl(
      id,
      marketCode,
      materialCode
    );

    return this.apiService
      .get(url.path, url.params)
      .pipe(map(data => MarketMaterialPriceAdaptor.getSavedBasePrice(data)));
  }

  resetAmountToZero() {
    const url = getresetAmountToZeroUrl();

    return this.apiService.patch(url.path).pipe(map(res => true));
  }
}
