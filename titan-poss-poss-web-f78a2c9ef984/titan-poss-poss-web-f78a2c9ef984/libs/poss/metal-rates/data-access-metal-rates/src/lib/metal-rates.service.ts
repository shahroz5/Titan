import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  ApiService,
  getAvailableMetalRatesEndpointUrl,
  getBodBusinessDayEndpointUrl,
  getEodBusinessDayEndpointUrl,
  getLocationMetalRatesEndpointUrl
} from '@poss-web/shared/util-api-service';
import {
  AvailableMetalRatesResponse,
  BodBusinessDayResponse,
  MetalRateUpdateRequestPayload
} from '@poss-web/shared/models';
import { map } from 'rxjs/operators';
import { BodEodAdaptor } from '@poss-web/shared/util-adaptors';

@Injectable({
  providedIn: 'root'
})
export class MetalRatesService {
  constructor(private apiService: ApiService) {}

  getBodBusinessDay(): Observable<number> {
    const apiPath = getBodBusinessDayEndpointUrl();
    return this.apiService
      .get(apiPath)
      .pipe(
        map((data: BodBusinessDayResponse) =>
          BodEodAdaptor.getBusinessDate(data)
        )
      );
  }
  getEodBusinessDay(): Observable<number> {
    const apiPath = getEodBusinessDayEndpointUrl();
    return this.apiService
      .get(apiPath)
      .pipe(
        map((data: BodBusinessDayResponse) =>
          BodEodAdaptor.getBusinessDate(data)
        )
      );
  }

  getGoldRateAvailabilityStatus(businessDay: number): Observable<boolean> {
    const apiPath = getAvailableMetalRatesEndpointUrl();
    const requestPayload = {
      businessDate: businessDay,
      isRetryAttempted: false
    };
    return this.apiService
      .post(apiPath, requestPayload)
      .pipe(map((data: any) => BodEodAdaptor.checkIfGoldRateAvailable(data)));
  }

  getAvailableMetalRatesForBusinessDay(
    businessDay: number
  ): Observable<AvailableMetalRatesResponse> {
    const apiPath = getAvailableMetalRatesEndpointUrl();
    const requestPayload = {
      businessDate: businessDay,
      isRetryAttempted: false
    };
    return this.apiService
      .post(apiPath, requestPayload)
      .pipe(map((data: any) => BodEodAdaptor.getAvailableMetalRates(data)));
  }

  saveMetalRates(
    requestPayload: MetalRateUpdateRequestPayload
  ): Observable<any> {
    const apiPath = getLocationMetalRatesEndpointUrl();
    return this.apiService.post(apiPath, requestPayload);
  }
}
