import { Injectable } from '@angular/core';
import {
  ExcludeItemCodesPayload, GEPDetailsPayload, GepPurityConfigEnums, GEPPurityConfigListPayload, ProductGroupDeduction, PurityDetailsPayload, RemoveProductGroupDeduction, RemoveThemeCodesPayload, SaveThemeCodesPayload, SearchProdcutGroup
} from '@poss-web/shared/models';
import {
  EncircleProductGroupMappingAdaptor,
  GEPPurityConfigurationAdaptor
} from '@poss-web/shared/util-adaptors';
import {
  ApiService, gepProductGroupsDeductionUrl, getExcludeItemCodeSearchUrl, getExcludeItemCodesUrl, getExcludeThemeCodesUrl,
  getGEPConfigUrl, getGepDetailsUrl, getGepItemTypesUrl, getGepPurityConfigListUrl, getGepPurityConfigSearchUrl, getMetalTypesUrl, getProductGroupsDeductionUrl, getPurityDetailsUrl, getRangesUrl, getSaveGEPPurityDetailsUrl, getSaveThemeCodeUrl, getSearchProductGroupUrl, getUploadFileUrl
} from '@poss-web/shared/util-api-service';
import { concatMap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GEPPurityConfigService {
  constructor(private apiService: ApiService) {}
  getGEPPurityConfigList(gepPurityConfigPayload: GEPPurityConfigListPayload) {
    const url = getGepPurityConfigListUrl(
      gepPurityConfigPayload.pageIndex,
      gepPurityConfigPayload.pageSize,
      gepPurityConfigPayload.type,
      gepPurityConfigPayload.description
    );
    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map(data => GEPPurityConfigurationAdaptor.getGepPurityConfigList(data))
      );
  }
  searchConfigName(searchPayload: { configName: string; type: string }) {
    const url = getGepPurityConfigSearchUrl(
      searchPayload.configName,
      searchPayload.type
    );
    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map(data =>
          GEPPurityConfigurationAdaptor.getGepPurityConfigSearch(data)
        )
      );
  }
  updateToggleButton(payload: { configId: string; isActive: boolean }) {
    const url = getSaveGEPPurityDetailsUrl(payload.configId, 'GEP_ITEM');
    return this.apiService.patch(
      url.path,
      { isActive: payload.isActive },
      url.params
    );
  }
  saveGEPDetails(savePayload: GEPDetailsPayload) {
    const url = getGEPConfigUrl(savePayload.gepConfiguration.type);
    if (savePayload.configId === 'new') {
      return this.apiService
        .post(url.path, savePayload.gepConfiguration, url.params)
        .pipe(map((data: any) => data.configId))
        .pipe(
          concatMap(configId =>
            this.apiService.patch(
              getSaveGEPPurityDetailsUrl(
                configId,
                savePayload.gepConfiguration.type
              ).path,
              savePayload.gepDetails,
              getSaveGEPPurityDetailsUrl(
                configId,
                savePayload.gepConfiguration.type
              ).params
            )
          )
        )
        .pipe(map(data => GEPPurityConfigurationAdaptor.getGepDetails(data)));
    } else {
      const path = getSaveGEPPurityDetailsUrl(
        savePayload.configId,
        savePayload.gepConfiguration.type
      );
      return this.apiService
        .patch(path.path, savePayload.gepDetails, path.params)
        .pipe(map(data => GEPPurityConfigurationAdaptor.getGepDetails(data)));
    }
  }

  loadMetalTypes() {
    const url = getMetalTypesUrl();
    return this.apiService
      .get(url.path, url.params)
      .pipe(map(data => GEPPurityConfigurationAdaptor.getMetalTypes(data)));
  }
  loadRanges(rangeType: string) {
    const url = getRangesUrl(rangeType);
    return this.apiService
      .get(url.path, url.params)
      .pipe(map(data => GEPPurityConfigurationAdaptor.getRanges(data)));
  }
  savePurityDetails(savePayload: PurityDetailsPayload) {
    const url = getGEPConfigUrl(savePayload.configuration.type);
    if (savePayload.configId === 'new') {
      return this.apiService
        .post(url.path, savePayload.configuration, url.params)
        .pipe(map((data: any) => data.configId))
        .pipe(
          concatMap(configId =>
            this.apiService.patch(
              getPurityDetailsUrl(configId, savePayload.configuration.type)
                .path,
              savePayload.purityDetails,
              getPurityDetailsUrl(configId, savePayload.configuration.type)
                .params
            )
          )
        )
        .pipe(
          map(data => GEPPurityConfigurationAdaptor.getPurityDetails(data))
        );
    } else {
      const path = getPurityDetailsUrl(
        savePayload.configId,
        savePayload.configuration.type
      );
      const url1 = getSaveGEPPurityDetailsUrl(savePayload.configId, 'GEP_ITEM');
      return this.apiService
        .patch(
          url1.path,
          { isActive: savePayload.configuration.isActive },
          url1.params
        )
        .pipe(map(data => data))
        .pipe(
          concatMap(data =>
            this.apiService.patch(
              path.path,
              savePayload.purityDetails,
              path.params
            )
          )
        )
        .pipe(
          map(data => GEPPurityConfigurationAdaptor.getPurityDetails(data))
        );
    }
  }
  uploadFile(payload: ExcludeItemCodesPayload) {
    const url = getGEPConfigUrl(payload.gepConfiguration.type);
    if (payload.uploadPayload.configId === 'new') {
      return this.apiService
        .post(url.path, payload.gepConfiguration, url.params)
        .pipe(map((data: any) => data.configId))
        .pipe(
          concatMap(configId =>
            this.apiService
              .postFile(
                getUploadFileUrl(payload.uploadPayload.type, configId).path,
                payload.uploadPayload.formData,
                getUploadFileUrl(payload.uploadPayload.type, configId).params
              )
              .pipe(
                map((data: any) =>
                  GEPPurityConfigurationAdaptor.getUploadFileResponse(
                    data,
                    configId
                  )
                )
              )
          )
        );
    } else {
      const path = getUploadFileUrl(
        payload.uploadPayload.type,
        payload.uploadPayload.configId
      );
      return this.apiService
        .postFile(path.path, payload.uploadPayload.formData, path.params)
        .pipe(
          map((data: any) =>
            GEPPurityConfigurationAdaptor.getUploadFileResponse(data, null)
          )
        );
    }
  }
  getExcludeThemeCodes(configId: string) {
    const url = getExcludeThemeCodesUrl(
      configId,
      GepPurityConfigEnums.GEP_ITEM
    );
    return this.apiService
      .get(url.path, url.params)
      .pipe(map(data => GEPPurityConfigurationAdaptor.excludeThemeCodes(data)));
  }
  getExcludeItemCodes(itemPayload: {
    configId: string;
    pageIndex: number;
    pageSize: number;
  }) {
    const url = getExcludeItemCodesUrl(
      itemPayload.configId,
      itemPayload.pageIndex,
      itemPayload.pageSize,
      GepPurityConfigEnums.GEP_ITEM
    );
    return this.apiService
      .get(url.path, url.params)
      .pipe(map(data => GEPPurityConfigurationAdaptor.excludeItemCodes(data)));
  }

  searchProductGroup(searchPayload: SearchProdcutGroup) {
    const url = getSearchProductGroupUrl(
      searchPayload.configId,
      searchPayload.searchValue,
      GepPurityConfigEnums.GEP_ITEM
    );
    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map(data => GEPPurityConfigurationAdaptor.searchProductGroups(data))
      );
  }
  productsGroupsDeduction(payload: ProductGroupDeduction) {
    const url = getGEPConfigUrl(payload.config.type);
    if (payload.configId === 'new') {
      return this.apiService
        .post(url.path, payload.config, url.params)
        .pipe(map((data: any) => data.configId))
        .pipe(
          concatMap(configId =>
            this.apiService.patch(
              getProductGroupsDeductionUrl(
                configId,
                GepPurityConfigEnums.GEP_ITEM
              ).path,
              payload.productGroups,
              getProductGroupsDeductionUrl(
                configId,
                GepPurityConfigEnums.GEP_ITEM
              ).params
            )
          )
        )
        .pipe(map(data => data.results[0].configId));
    } else {
      const path = getProductGroupsDeductionUrl(
        payload.configId,
        GepPurityConfigEnums.GEP_ITEM
      );
      return this.apiService
        .patch(path.path, payload.productGroups, path.params)
        .pipe(map(data => data.results[0].configId));
    }
  }
  removeProductGroup(removePayload: RemoveProductGroupDeduction) {
    const url = getProductGroupsDeductionUrl(
      removePayload.configId,
      GepPurityConfigEnums.GEP_ITEM
    );
    return this.apiService.patch(
      url.path,
      removePayload.deleteProductGroup,
      url.params
    );
  }
  getGepPurityDetails(configId: string) {
    const url = getPurityDetailsUrl(configId, GepPurityConfigEnums.GEP_ITEM);
    return this.apiService
      .get(url.path, url.params)
      .pipe(map(data => GEPPurityConfigurationAdaptor.getPurityDetails(data)));
  }
  getGepDetails(configId: string) {
    const url = getGepDetailsUrl(configId, GepPurityConfigEnums.GEP_ITEM);
    return this.apiService
      .get(url.path, url.params)
      .pipe(map(data => GEPPurityConfigurationAdaptor.getGepDetails(data)));
  }
  saveThemeCodes(savePayload: SaveThemeCodesPayload) {
    const url = getGEPConfigUrl(savePayload.config.type);
    if (savePayload.configId === 'new') {
      return this.apiService
        .post(url.path, savePayload.config, url.params)
        .pipe(map((data: any) => data.configId))
        .pipe(
          concatMap(configId =>
            this.apiService.patch(
              getSaveThemeCodeUrl(configId, savePayload.config.type).path,
              savePayload.saveThemeCodes,
              getSaveThemeCodeUrl(configId, savePayload.config.type).params
            )
          )
        )
        .pipe(map(data => data.results[0].configId));
    } else {
      const path = getSaveThemeCodeUrl(
        savePayload.configId,
        savePayload.config.type
      );
      return this.apiService
        .patch(path.path, savePayload.saveThemeCodes, path.params)
        .pipe(map(data => data.results[0].configId));
    }
  }
  deleteThemeCode(deletePayload: RemoveThemeCodesPayload) {
    const url = getSaveThemeCodeUrl(
      deletePayload.configId,
      GepPurityConfigEnums.GEP_ITEM
    );
    return this.apiService.patch(
      url.path,
      deletePayload.deleteThemeCode,
      url.params
    );
  }

  loadProductGroupsDeduction(payload: {
    configId: string;
    pageIndex: number;
    pageSize: number;
  }) {
    const url = gepProductGroupsDeductionUrl(
      payload.configId,
      payload.pageIndex,
      payload.pageSize,
      GepPurityConfigEnums.GEP_ITEM
    );
    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map(data => GEPPurityConfigurationAdaptor.getDeductionRanges(data))
      );
  }

  searchItemCode(searchPayload: { configId: string; itemCode: string }) {
    const url = getExcludeItemCodeSearchUrl(
      searchPayload.configId,
      searchPayload.itemCode,
      GepPurityConfigEnums.GEP_ITEM
    );
    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map(data => GEPPurityConfigurationAdaptor.searchExcludeItemCode(data))
      );
  }
  loadGepItemTypes(itemType: string) {
    const url = getGepItemTypesUrl(itemType);
    return this.apiService
      .get(url)
      .pipe(map(data => GEPPurityConfigurationAdaptor.gepItemTypes(data)));
  }
  loadAllSelectedPgs(payload: {
    configId: string;
    pageIndex: number;
    pageSize: number;
  }) {
    const url = gepProductGroupsDeductionUrl(
      payload.configId,
      payload.pageIndex,
      payload.pageSize,
      GepPurityConfigEnums.GEP_ITEM
    );
    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map(data =>
          EncircleProductGroupMappingAdaptor.getSelectedProductGroups(data)
        )
      );
  }
}
