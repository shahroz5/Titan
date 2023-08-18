import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Lov, LovMasterEnum } from '@poss-web/shared/models';
import {
  ApiService,
  getMasterUserLovsEndpointUrl,
  getMasterInventoryLovsEndpointUrl,
  getMasterLocationLovsEndpointUrl,
  getMasterProductLovsEndpointUrl,
  getMasterPaymentLovsEndpointUrl,
  getEngineSalesLovsEndpointUrl,
  getEngineproductLovsEndpointUrl,
  getEngineLocationLovsEndpointUrl,
  getConfigLovsEndpointUrl,
  getEnginePaymentLovsEndpointUrl,
  getEngineConfigLovsEndpointUrl,
  getReportLovsEndpointUrl
} from '@poss-web/shared/util-api-service';
import { LovHelper } from '@poss-web/shared/util-adaptors';
import { CacheableApiService } from '@poss-web/shared/util-cacheable-api-service';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LovDataService {
  constructor(private apiService: CacheableApiService) {}

  // To be used in EPoss

  getInventoryLovs(lovType: string, isActive?: boolean): Observable<Lov[]> {
    const url = getMasterInventoryLovsEndpointUrl(lovType, isActive);
    return this.apiService
      .get(url.path, url.param)
      .pipe(map((data: any) => LovHelper.getLovs(data.results)));
  }

  getLocationLovs(lovType: string): Observable<Lov[]> {
    const url = getMasterLocationLovsEndpointUrl(lovType);

    return this.apiService
      .get(url.path)
      .pipe(map((data: any) => LovHelper.getLovs(data.results)));
  }

  getProductLovs(lovType: string): Observable<Lov[]> {
    const url = getMasterProductLovsEndpointUrl(lovType);
    return this.apiService
      .get(url.path)
      .pipe(map((data: any) => LovHelper.getLovs(data.results)));
  }

  getUserLovs(lovType: string): Observable<Lov[]> {
    const url = getMasterUserLovsEndpointUrl(lovType, true);
    return this.apiService
      .get(url.path, url.params)
      .pipe(map((data: any) => LovHelper.getLovs(data.results)));
  }
  getSalesLovs(lovType: string): Observable<Lov[]> {
    const url = getEngineSalesLovsEndpointUrl(lovType);

    return this.apiService
      .get(url.path)
      .pipe(map((data: any) => LovHelper.getLovs(data.results)));
  }

  getPaymentLovs(lovType: string): Observable<Lov[]> {
    const url = getMasterPaymentLovsEndpointUrl(lovType);
    return this.apiService
      .get(url.path)
      .pipe(map((data: any) => LovHelper.getLovs(data.results)));
  }

  getConfigLovs(lovType: string): Observable<Lov[]> {
    const url = getConfigLovsEndpointUrl(lovType);
    return this.apiService
      .get(url)
      .pipe(map((data: any) => LovHelper.getLovs(data.results)));
  }

  // To be used in Poss
  getEngineProductLovs(lovType: string): Observable<Lov[]> {
    const url = getEngineproductLovsEndpointUrl(lovType);
    return this.apiService
      .get(url.path)
      .pipe(map((data: any) => LovHelper.getLovs(data.results)));
  }
  getEnginePaymentLovs(lovType: string): Observable<Lov[]> {
    const url = getEnginePaymentLovsEndpointUrl(lovType);
    return this.apiService
      .get(url.path)
      .pipe(map((data: any) => LovHelper.getLovs(data.results)));
  }
  getEngineLocationLovs(lovType: string): Observable<Lov[]> {
    const url = getEngineLocationLovsEndpointUrl(lovType);

    return this.apiService
      .get(url)
      .pipe(map((data: any) => LovHelper.getLovs(data.results)));
  }
  getEngineConfigLovs(lovType: string): Observable<Lov[]> {
    const url = getEngineConfigLovsEndpointUrl(lovType).path;
    return this.apiService
      .get(url)
      .pipe(map((data: any) => LovHelper.getLovs(data.results)));
  }

  //consolidated lov

  getLov(
    lovType: string,
    isPageable?: boolean,
    sorting?: boolean
  ): Observable<Lov[]> {
    let url: { path: string; params: HttpParams } = { path: '', params: null };
    switch (lovType) {
      case LovMasterEnum.REASONTYPE:
      case LovMasterEnum.PRODUCTTYPE:
      case LovMasterEnum.INDENTTYPE:
      case LovMasterEnum.SUPPLYCHAIN:
      case LovMasterEnum.PRICINGGROUPTYPE:
      case LovMasterEnum.PRICINGTYPE:
      case LovMasterEnum.FINDING:
      case LovMasterEnum.MATERIALTYPE:
      case LovMasterEnum.GEPITEMTYPE:
      case LovMasterEnum.PLAINSTUDDEDTYPE:
      case LovMasterEnum.WEIGHT_EDIT_REASON_TYPE:
        url.path = getEngineproductLovsEndpointUrl(lovType).path;
        break;
      case LovMasterEnum.LOCATIONTYPE:
      case LovMasterEnum.OWNERTYPE:
      case LovMasterEnum.LOCATIONFORMAT:
      case LovMasterEnum.MATERIALPRICETYPE:
      case LovMasterEnum.PRICETYPE:
      case LovMasterEnum.TAXSYSTEM:
      case LovMasterEnum.DATEFORMAT:
      case LovMasterEnum.TIMEFORMAT:
      case LovMasterEnum.TAXTRANSACTIONTYPE:
      case LovMasterEnum.PRINT_DOC_TYPE:
        url.path = getEngineLocationLovsEndpointUrl(lovType);
        break;
      case LovMasterEnum.DEFECTTYPE:
        url.path = getMasterInventoryLovsEndpointUrl(lovType, true).path;
        break;
      case LovMasterEnum.TRANSACTION_TYPE:
      case LovMasterEnum.PAYMENT_GROUP:
      case LovMasterEnum.CUSTOMER_TYPE:
      case LovMasterEnum.OCCASION_TYPE:
      case LovMasterEnum.OTHER_CHARGES_REASONS:
      case LovMasterEnum.SALUTATION:
      case LovMasterEnum.GIFT_CARD_TYPE:
      case LovMasterEnum.ID_PROOF:
      case LovMasterEnum.GRN_REASON_TYPE:
      case LovMasterEnum.TATA_COMPANY:
      case LovMasterEnum.REFUND_PAYMENT_MODE:
      case LovMasterEnum.INVOICE_TYPE:
      case LovMasterEnum.RELATIONSHIP_TYPE:
        url.path = getEnginePaymentLovsEndpointUrl(lovType).path;
        break;
      case LovMasterEnum.DISCOUNT_TYPE:
      case LovMasterEnum.RANGE_TYPE:
      case LovMasterEnum.CLUBBING_DISCOUNT_TYPE:
      case LovMasterEnum.APPROVAL_ROLES:
      case LovMasterEnum.RIVAAH_CARD:
        url = getEngineConfigLovsEndpointUrl(lovType, isPageable, sorting);
        break;
      case LovMasterEnum.USER_TYPE:
      case LovMasterEnum.ROLE_TYPE:
        url = getMasterUserLovsEndpointUrl(lovType, true);
        break;
      case LovMasterEnum.STOCK_ISSUE_REPORT_HEADER:
        url.path = getReportLovsEndpointUrl(lovType).path;
        break;
    }
    return this.apiService
      .get(url.path, url.params)
      .pipe(map((data: any) => LovHelper.getLovs(data.results)));
  }
}
