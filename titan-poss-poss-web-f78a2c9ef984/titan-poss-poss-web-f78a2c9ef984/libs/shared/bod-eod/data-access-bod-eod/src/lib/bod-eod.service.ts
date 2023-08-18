import { Injectable } from '@angular/core';
import {
  ClosedBodResponse,
  LatestBodResponse,
  MetalRatesAndGoldAvailabilityResponse
} from '@poss-web/shared/models';
import { BodEodAdaptor } from '@poss-web/shared/util-adaptors';
import {
  ApiService,
  getAvailableMetalRatesEndpointUrl,
  getEodBusinessDayEndpointUrl,
  getLatestBodEndpointUrl,
  getOpenBusinessDayUrl
} from '@poss-web/shared/util-api-service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BodEodService {
  constructor(private apiService: ApiService) {}

  getOpenBusinessDate(): Observable<number> {
    const apiPath = getOpenBusinessDayUrl();
    return this.apiService
      .get(apiPath)
      .pipe(map((data: any) => BodEodAdaptor.getBusinessDate(data)));
  }

  getEodBusinessDate() {
    const apiPath = getEodBusinessDayEndpointUrl();
    return this.apiService
      .get(apiPath)
      .pipe(map((data: any) => BodEodAdaptor.getBusinessDate(data)));
  }

  getLatestBusinessDay(): Observable<ClosedBodResponse> {
    const apiPath = getLatestBodEndpointUrl();
    return this.apiService
      .get(apiPath)
      .pipe(
        map((data: LatestBodResponse) =>
          BodEodAdaptor.getClosedBusinessDayResponse(data)
        )
      );
  }

  getMetalRatesAndGoldRateAvailabityForBusinessDay(
    businessDay: number
  ): Observable<MetalRatesAndGoldAvailabilityResponse> {
    const apiPath = getAvailableMetalRatesEndpointUrl();
    const requestPayload = {
      businessDate: businessDay,
      isRetryAttempted: false
    };
    return this.apiService
      .post(apiPath, requestPayload)
      .pipe(
        map((data: any) =>
          BodEodAdaptor.getMetalRatesAndGoldRateAvailabity(data)
        )
      );
  }
}
