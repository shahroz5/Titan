import {
  ApiService,
  getDayWiseRevenueUrl,
  getGHSRevenueUrl,
  getServiceRevenueUrl,
  getTodayGHSRevenueUrl,
  getTodayRevenueUrl,
  getTodayServiceRevenueUrl
} from '@poss-web/shared/util-api-service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RevenueHelper } from '@poss-web/shared/util-adaptors';
import {
  GHSRevenuePayload,
  PaginatePayload,
  RevenueResponse,
  ServiceRevenuePayload,
  TodayRevenueResponse
} from '@poss-web/shared/models';

@Injectable()
export class RevenueService {
  constructor(private apiService: ApiService) {}

  loadDayWiseRevenue(
    payload: PaginatePayload,
    requestData
  ): Observable<RevenueResponse> {
    const url = getDayWiseRevenueUrl(payload.pageIndex, payload.pageSize);
    return this.apiService
      .post(url.path, requestData, url.params)
      .pipe(map(data => RevenueHelper.getDaywiseRevenue(data)));
  }

  getTodayRevenue(locationCode: string): Observable<TodayRevenueResponse> {
    const url = getTodayRevenueUrl(locationCode);
    return this.apiService
      .get(url.path, url.params)
      .pipe(map(data => RevenueHelper.getTodayRevenue(data)));
  }

  getGhsRevenue(payload: GHSRevenuePayload): Observable<TodayRevenueResponse> {
    if(
        payload.businessDate && 
        payload.businessDate !== null &&
        payload.businessDate !== ''
    ){
      const ghsUrl = getGHSRevenueUrl('GHS');
      return this.apiService
        .post(
          ghsUrl.path,
          {
            businessDate: payload.businessDate
          },
          ghsUrl.params
        )
        .pipe(map(data => RevenueHelper.getTodayRevenue(data)));
    }
    if(
        payload.locationCode && 
        payload.locationCode !== '' &&
        payload.locationCode !== null
      ){
      const url = getTodayGHSRevenueUrl(payload.locationCode);
      return this.apiService
        .get(url.path, url.params)
        .pipe(map(data => RevenueHelper.getTodayRevenue(data)));
    }
  }

  getServiceRevenue(payload: ServiceRevenuePayload): Observable<TodayRevenueResponse> {
    if(
        payload.businessDate && 
        payload.businessDate !== null &&
        payload.businessDate !== ''
    ){
      const serviceUrl = getServiceRevenueUrl();
      return this.apiService
        .post(
          serviceUrl.path,
          {
            businessDate: payload.businessDate
          },
          serviceUrl.params
        )
        .pipe(map(data => RevenueHelper.getTodayRevenue(data)));
    }
    if(
        payload.locationCode && 
        payload.locationCode !== '' &&
        payload.locationCode !== null
      ){
      const url = getTodayServiceRevenueUrl(payload.locationCode);
      return this.apiService
        .get(url.path, url.params)
        .pipe(map(data => RevenueHelper.getTodayRevenue(data)));
    }
  }
}
