import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  ApiService,
  getGlLocationPaymentListingUrl,
  getSaveGlLocationPaymentUrl,
  getPaymentMasterUrl,
  getLocationDetailsUrl
} from '@poss-web/shared/util-api-service';
import {
  SaveGlLocationPayments,
  GLLocationPaymentSuccessList
} from '@poss-web/shared/models';
import { GlLocationPaymentAdaptor } from '@poss-web/shared/util-adaptors';
import { HttpParams } from '@angular/common/http';
@Injectable()
export class GlLocationPaymentService {
  constructor(private apiService: ApiService) {}
  getGlLocationPaymentList(
    pageIndex?: number,
    pageSize?: number,
    locationCode?: string
  ): Observable<GLLocationPaymentSuccessList> {
    let url: { url: string; params: HttpParams };
    const payload = {
      locationCode: locationCode
    };
    url = getGlLocationPaymentListingUrl(pageIndex, pageSize);
    return this.apiService
      .post(url.url, payload, url.params)
      .pipe(
        map(data => GlLocationPaymentAdaptor.getGlBoutiqueLocationListing(data))
      );
  }

  saveGlLocationPayment(saveData: SaveGlLocationPayments) {
    const url = getSaveGlLocationPaymentUrl();
    return this.apiService.patch(url, saveData);
  }

  getPaymentCodes() {
    const url = getPaymentMasterUrl(0, 10000);
    return this.apiService
      .get(url.path, url.params)
      .pipe(map(data => GlLocationPaymentAdaptor.getPaymentCodes(data)));
  }

  getLocationCodes() {
    const url = getLocationDetailsUrl(0, 10000);
    return this.apiService
      .get(url.path, url.params)
      .pipe(map(data => GlLocationPaymentAdaptor.getLocationDetails(data)));
  }
}
