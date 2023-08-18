import { Injectable } from '@angular/core';
import { map } from 'rxjs/Operators';

import {
  getFocSchemeBasedListUrl,
  ApiService,
  getFocSchemeBasedSearchUrl,
  getFocSchemeBasedUpdateUrl,
  getFocSchemeBasedSaveUrl,
  getFocSchemeBasedConfigByIdGetUrl,
  getProductGroupsByIdUrl,
  getFocSchemeBasedVariantDetailsByIdUrl,
  getLocationByIdUrl,
  getFocItemCodesUrl,
  getSaveFocItemsUrl,
  getLoadMappedFocItemsUrl,
  getFocSearchUrl,
  getFocSchemeBasedVariantDetailsPatchUrl,
  searchLocationCodeUrl,
  getUpdateLocationByIdUrl,
  getFocPublishUrl,
  getProductGroupsByIdUpdateUrl,
  getTepDurationUrl
} from '@poss-web/shared/util-api-service';

import { FocConfigurationAdaptor } from '@poss-web/shared/util-adaptors';
import {
  SchemeDetails,
  SaveVariantDetailsPayload,
  LoadVariantDetailsPayload,
  LoadProductGroupPayload,
  SaveProductGroup,
  FOCItemCodesPayload,
  FocItemsSavePayload,
  FocItemsPayload,
  FocLocationListPayload
} from '@poss-web/shared/models';

@Injectable()
export class FocConfigService {
  constructor(private apiService: ApiService) {}
  getFocConfiguratonList(
    pageIndex: number,
    pageSize: number,
    searchValue?: string
  ) {
    const url = getFocSchemeBasedListUrl(pageIndex, pageSize, searchValue);
    return this.apiService
      .get(url.path, url.params)
      .pipe(map(data => FocConfigurationAdaptor.getFocConfigurationList(data)));
  }

  saveFocConfiguration(saveSchemeConfiguration: SchemeDetails) {
    const saveUrl = getFocSchemeBasedSaveUrl();
    return this.apiService
      .post(saveUrl, saveSchemeConfiguration)
      .pipe(
        map(data => FocConfigurationAdaptor.getFocSchemeConfiguration(data))
      );
  }

  updateFocConfiguration(focConfiguration: SchemeDetails) {
    const url = getFocSchemeBasedUpdateUrl(focConfiguration.id);
    return this.apiService
      .patch(url, focConfiguration)
      .pipe(
        map(data => FocConfigurationAdaptor.getFocSchemeConfiguration(data))
      );
  }
  searchConfigBySchemeName(schemeName: string) {
    const url = getFocSchemeBasedSearchUrl(schemeName);
    return this.apiService
      .get(url.path, url.params)
      .pipe(map(data => FocConfigurationAdaptor.getFocConfigurationList(data)));
  }

  getFocSchemeConfiguration(configId: string) {
    const url = getFocSchemeBasedConfigByIdGetUrl(configId);
    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map(data => FocConfigurationAdaptor.getFocSchemeConfiguration(data))
      );
  }
  loadRangeWeight() {
    const url = getTepDurationUrl();

    return this.apiService
      .get(url.path, url.params)
      .pipe(map(data => FocConfigurationAdaptor.getRangeWeight(data)));
  }

  saveVariantDetails(saveVariantDetails: SaveVariantDetailsPayload) {
    const url = getFocSchemeBasedVariantDetailsPatchUrl(
      saveVariantDetails.masterId
    );
    return this.apiService
      .patch(url, saveVariantDetails)
      .pipe(map(data => FocConfigurationAdaptor.getVariantDetails(data)));
  }

  loadVariantDetails(payload: LoadVariantDetailsPayload) {
    const url = getFocSchemeBasedVariantDetailsByIdUrl(
      payload.id,
      payload.category,
      payload.itemType,
      payload.offerType
    );

    return this.apiService
      .get(url.path, url.params)
      .pipe(map(data => FocConfigurationAdaptor.getVariantDetails(data)));
  }

  loadMappedProductGroups(payload: LoadProductGroupPayload) {
    const url = getProductGroupsByIdUrl(
      payload.itemType,
      payload.category,
      payload.masterId,
      payload.schemeDetailsId
    );
    console.log(url);
    return this.apiService
      .get(url.path, url.params)
      .pipe(map(data => FocConfigurationAdaptor.getMappedProductGroup(data)));
  }

  updateProductGroups(payload: SaveProductGroup) {
    const url = getProductGroupsByIdUpdateUrl(
      payload.masterId,
      payload.schemeDetailsId
    );
    return this.apiService
      .patch(
        url.path,
        {
          addProducts: payload.addProducts,
          category: payload.category,
          itemType: payload.itemType,
          removeProducts: payload.removeProducts
        },
        url.params
      )
      .pipe(map(data => FocConfigurationAdaptor.getMappedProductGroup(data)));
  }
  loadMappedLocations(focLocationListPayload: FocLocationListPayload) {
    const url = getLocationByIdUrl(
      focLocationListPayload.id,
      focLocationListPayload.pageIndex,
      focLocationListPayload.pageSize
    );

    return this.apiService
      .get(url.path, url.params)
      .pipe(map(data => FocConfigurationAdaptor.getLocationList(data)));
  }
  updateLocationById(id: string, saveLocationPayload: any) {
    const url = getUpdateLocationByIdUrl(id);
    return this.apiService.patch(url, saveLocationPayload);
  }

  loadFOCItemCodes(payload: FOCItemCodesPayload) {
    const url = getFocItemCodesUrl();
    return this.apiService
      .post(url, payload)
      .pipe(map(data => FocConfigurationAdaptor.getFocItemCodes(data)));
  }
  saveFocItems(savePayload: FocItemsSavePayload) {
    const url = getSaveFocItemsUrl(savePayload.id);
    return this.apiService.patch(url, savePayload.savePayload);
  }
  loadMappedFocItems(payload: FocItemsPayload) {
    const url = getLoadMappedFocItemsUrl(
      payload.id,
      payload.pageIndex,
      payload.pageSize
    );
    return this.apiService
      .get(url.path, url.params)
      .pipe(map(data => FocConfigurationAdaptor.getFocMappedItems(data)));
  }
  searchFocItems(searchPayload: { configId: string; itemCode: string }) {
    const url = getFocSearchUrl(searchPayload.configId, searchPayload.itemCode);
    return this.apiService
      .get(url.path, url.params)
      .pipe(map(data => FocConfigurationAdaptor.getFocItemCodes(data)));
  }
  publishFocScheme(id: string) {
    const url = getFocPublishUrl(id);
    return this.apiService.post(url);
  }
  searchLocationCode(locationCodeSearch: {
    configId: string;
    locationCode: string;
  }) {
    const url = searchLocationCodeUrl(
      locationCodeSearch.configId,
      locationCodeSearch.locationCode
    );
    return this.apiService
      .get(url.path, url.params)
      .pipe(map(data => FocConfigurationAdaptor.getLocationList(data)));
  }
}
