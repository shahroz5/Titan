import { Injectable } from '@angular/core';
import {
  ApiService,
  CreateConversionConfigByIdUrl,
  ConversionConfigValuesByIdUrl,
  CreateconversionConfigUrl,
  ProductGroupsUrl,
  ProductCategoryUrl,
  filterUrl,
  getConfigurationListUrl
} from '@poss-web/shared/util-api-service';
import { map, concatMap } from 'rxjs/operators';
import { ConversionConfigAdaptor } from '@poss-web/shared/util-adaptors';
import {
  SaveConversionConfigValuesPayload,
  UpdateToggleButtonPayload
} from '@poss-web/shared/models';

@Injectable({
  providedIn: 'root'
})
export class ConversionConfigService {
  constructor(private apiService: ApiService) {}
  getConversionConfiguratonList(pageIndex: number, pageSize: number) {
    const url = getConfigurationListUrl(pageIndex, pageSize);
    return this.apiService
      .post(url.path, { ruleType: 'CONVERSIONS' }, url.params)
      .pipe(map(data => ConversionConfigAdaptor.ConversionConfigList(data)));
  }

  getConversionConfigDetaildById(configId: number) {
    const url = CreateConversionConfigByIdUrl(configId);
    return this.apiService
      .get(url)
      .pipe(map((data: any) => data))
      .pipe(
        concatMap(data =>
          this.apiService
            .get(ConversionConfigValuesByIdUrl(data.ruleId))
            .pipe(
              map((productGroups: any) =>
                ConversionConfigAdaptor.ConversionConfigDetailsById(
                  data,
                  productGroups
                )
              )
            )
        )
      );
  }
  search(configName: string) {
    const url = filterUrl();
    return this.apiService
      .post(url, { description: configName, ruleType: 'CONVERSIONS' })
      .pipe(map(data => ConversionConfigAdaptor.ConversionConfigList(data)));
  }
  saveConversionConfigValues(savePayload: SaveConversionConfigValuesPayload) {
    const url = CreateconversionConfigUrl();
    return this.apiService
      .post(url, savePayload.createConfig)
      .pipe(map((data: any) => data))
      .pipe(
        concatMap(data =>
          this.apiService
            .patch(
              ConversionConfigValuesByIdUrl(data.ruleId),
              savePayload.configValues
            )
            .pipe(
              map(successPayload =>
                ConversionConfigAdaptor.ConversionConfigSuccessPayload(
                  data,
                  successPayload
                )
              )
            )
        )
      );
  }
  updateConversionConfigDetails(
    updatePayload: SaveConversionConfigValuesPayload
  ) {
    const url = CreateConversionConfigByIdUrl(updatePayload.configId);
    return this.apiService
      .patch(url, updatePayload.createConfig)
      .pipe(map((data: any) => data.ruleId))
      .pipe(
        concatMap(ruleId =>
          this.apiService.patch(
            ConversionConfigValuesByIdUrl(ruleId),
            updatePayload.configValues
          )
        )
      );
  }

  updateToggleButton(updatePayload: UpdateToggleButtonPayload) {
    const url = CreateConversionConfigByIdUrl(updatePayload.id);
    return this.apiService.patch(url, updatePayload.toggleButton);
  }
  loadProductGroups() {
    const url = ProductGroupsUrl();
    return this.apiService
      .get(url.path, url.params)
      .pipe(map(data => ConversionConfigAdaptor.getProductGroups(data)));
  }
  loadProductCategories() {
    const url = ProductCategoryUrl();
    return this.apiService
      .get(url.path, url.params)
      .pipe(map(data => ConversionConfigAdaptor.getProductCategories(data)));
  }
}
