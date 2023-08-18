import { Injectable } from '@angular/core';
import { ProductCategoryMapping } from '@poss-web/shared/models';
import {
  CutPieceConfigAdaptor
} from '@poss-web/shared/util-adaptors';
import {
  ApiService,
  getCutPieceConfigListUrl,
  getProductCategoriesMappingListUrl,
  getProductCategoriesMappingUrl,
  getProductCategorySearchUrl
} from '@poss-web/shared/util-api-service';
import { map } from 'rxjs/operators';

@Injectable()
export class CutPieceConfigService {
  constructor(private apiService: ApiService) {}
  loadCutPieceConfig() {
    const url = getCutPieceConfigListUrl();
    return this.apiService
      .get(url.path, url.params)
      .pipe(map(data => CutPieceConfigAdaptor.getConfigId(data)));
  }
  searchProductCategoryCode(searchPayload: {
    productCategoryCode: string;
    configId: string;
  }) {
    const url = getProductCategorySearchUrl(
      searchPayload.configId,
      searchPayload.productCategoryCode
    );
    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map(data => CutPieceConfigAdaptor.getProductCategorySearchResult(data))
      );
  }
  saveCutPieceConfig(productCategoryMapping: ProductCategoryMapping) {
    const url = getProductCategoriesMappingUrl(productCategoryMapping.configId);
    return this.apiService.patch(
      url.path,
      productCategoryMapping.payload,
      url.params
    );
  }
  loadProductCategoryMapping(listPayload: {
    configId: string;
    pageIndex: number;
    pageSize: number;
  }) {
    const url = getProductCategoriesMappingListUrl(
      listPayload.configId,
      listPayload.pageIndex,
      listPayload.pageSize
    );
    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map(data => CutPieceConfigAdaptor.getProductCategoryMappingList(data))
      );
  }
}
