import { Injectable } from '@angular/core';
import {
  LoadProductGroupsPayload,
  MappedLocDetails,
  RivaahConfiguration, RivaahConfigurationResponse, RivaahEligibilityConfigRequest, RivaahLocationListPayload, RivaahLocationSuccessList, SaveProductGroups
} from '@poss-web/shared/models';
import { RivaahConfigurationAdaptor } from '@poss-web/shared/util-adaptors';
import {
  ApiService, getProductGroupMappingRulesUrl,
  getProductGroupsByProductIdUpdateUrl,
  getProductGroupsByProductIdUrl,
  getRivaahAllLocationsUrl,
  getRivaahEligibilityRulesUrl, getRivaahMappedLocationsUrl, getUpdateConfigurationUrl, saveRivaahLocationsUrl
} from '@poss-web/shared/util-api-service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RivaahConfigurationService {
  constructor(private apiService: ApiService) {}

  getCouponConfiguration(configId: string, ruleType: string) {
    const url = getUpdateConfigurationUrl(configId, ruleType);
    return this.apiService
      .get(url)
      .pipe(
        map(data => RivaahConfigurationAdaptor.getCouponConfiguration(data))
      );
  }

  updateCouponConfiguration(payload: RivaahConfigurationResponse) {
    const url = getUpdateConfigurationUrl(
      payload.ruleId.toString(),
      payload.ruleDetails.type
    );
    return this.apiService
      .patch(url, payload)
      .pipe(
        map(data => RivaahConfigurationAdaptor.updateCouponConfiguration(data))
      );
  }

  getRivaahEligibilityConfiguration(
    configId: string,
    ruleType: string,
    productCategoryCode?: string,
    productGroupCode?: string,
    pageIndex?: number,
    pageSize?: number
  ) {
    const url = getRivaahEligibilityRulesUrl(
      configId,
      ruleType,
      true,
      productCategoryCode,
      productGroupCode,
      pageIndex,
      pageSize
    );
    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map(data =>
          RivaahConfigurationAdaptor.getRivaahEligibilityConfiguration(data)
        )
      );
  }

  updateRivaahEligibilityConfiguration(
    payload: RivaahEligibilityConfigRequest
  ) {
    const url = getProductGroupMappingRulesUrl(
      payload.ruleId.toString(),
      RivaahConfiguration.RIVAAH_CARD_ELIGIBILITY
    );
    return this.apiService.patch(url, payload);
  }

  loadMappedProductGroups(payload: LoadProductGroupsPayload) {
    const url = getProductGroupsByProductIdUrl(
      payload.productId,
      payload.ruleId,
      payload.ruleType,
    );
    console.log(url);
    return this.apiService
      .get(url.path, url.params)
      .pipe(map(data => RivaahConfigurationAdaptor.getMappedProductGroup(data)));
  }

  getMappedProductCategories(
    ruleId: string,
    ruleType: string,
  ) {
    const url = getRivaahEligibilityRulesUrl(
      ruleId,
      ruleType,
      false
    );
    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map(data =>
          RivaahConfigurationAdaptor.getMappedProductCategory(data)
        )
      );
  }

  updateProductGroups(payload: SaveProductGroups) {
    const url = getProductGroupsByProductIdUpdateUrl(
      payload.productId,
      payload.ruleId,
      payload.ruleType
    );
    return this.apiService
      .patch(
        url.path,
        {
          addProducts: payload.addProducts,
          removeProducts: payload.removeProducts
        },
        url.params
      )
      .pipe(map(data => RivaahConfigurationAdaptor.getMappedProductGroup(data)));
  }

  getRivaahMappedLocationsList(
    payload: RivaahLocationListPayload
  ): Observable<RivaahLocationSuccessList> {
    const url = getRivaahMappedLocationsUrl(
      payload.ruleId.toString(),
      RivaahConfiguration.RIVAAH_CARD_ELIGIBILITY,
      true,
      payload.pageIndex,
      payload.pageSize,
    );
    const requestPayload: any = {};
    if (payload.offerStartDate && payload.offerEndDate) {
      requestPayload.offerStartDate = payload.offerStartDate;
      requestPayload.offerEndDate = payload.offerEndDate;
    }
    if (payload.locationCode.length !== 0) {
      requestPayload.locationCode = payload.locationCode;
    }

    return this.apiService
      .post(url.path, requestPayload, url.params)
      .pipe(map(data => RivaahConfigurationAdaptor.getRivaahLocations(data)));
  }

  saveRivaahLocations(locations) {
    const url = saveRivaahLocationsUrl(
      locations.ruleId.toString(),
      RivaahConfiguration.RIVAAH_CARD_ELIGIBILITY
    );
    return this.apiService.patch(url, locations.payload);
  }

  getSelectedLocations(
    payload: RivaahLocationListPayload
  ): Observable<MappedLocDetails[]> {
    const url = getRivaahAllLocationsUrl(
      payload.ruleId, 
      RivaahConfiguration.RIVAAH_CARD_ELIGIBILITY
    );

    return this.apiService
      .get(url.path, url.params)
      .pipe(map(data => RivaahConfigurationAdaptor.getRivaahAllLocationList(data)));
  }
}
