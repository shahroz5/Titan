import { Inject, Injectable } from '@angular/core';
import {
  BankDepositRequestPayload,
  BodBusinessDayResponse,
  BodBusinessDayResponseFormat,
  BodEodEnum,
  EghsBodGeneratedPassword,
  EghsBodPasswordsListingResponse,
  GhsFileUploadResponse,
  LatestBodResponse,
  MetalRatesAndGoldAvailabilityResponse,
  MetalRatesRequestFormat,
  OfflineGhsEodRevenueCollection,
  UsersActiveSessionsResults,
  WalkInDetailsResponse,
  ServiceFileUploadResponse
} from '@poss-web/shared/models';
import { BodEodAdaptor } from '@poss-web/shared/util-adaptors';
import {
  ApiService,
  getActiveUserSessionsEndpointUrl,
  getAvailableMetalRatesEndpointUrl,
  getBodBusinessDayEndpointUrl,
  getEodActivityEndpointUrl,
  getEodBusinessDayEndpointUrl,
  getEodOfflineGhsRevenueCollectionEndpointUrl,
  getgeneratePasswordForEghsBodEndpointUrl,
  getGhsBankDepositUploadEndpointUrl,
  getGhsBodBusinessDayEndpointUrl,
  getGhsEodActivityEndpointUrl,
  getGhsRevenueCollectionEndpointUrl,
  getgOfflineEghsBodListingEndpointUrlWithQueryParams,
  getLatestBodEndpointUrl,
  getPreviousDayBankDepositEndpointUrl,
  getRevenueCollectionEndpointUrl,
  getServiceRevenueCollectionEndpointUrl,
  getWalkInDetailsEndpointUrl
} from '@poss-web/shared/util-api-service';
import { POSS_WEB_DATE_FORMAT } from '@poss-web/shared/util-config';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BodEodService {
  constructor(
    private apiService: ApiService,
    @Inject(POSS_WEB_DATE_FORMAT) private dateFormat
  ) {}

  getPreviousDayEodStatus(): Observable<BodBusinessDayResponseFormat> {
    const apiPath = getBodBusinessDayEndpointUrl();

    return this.apiService.get(apiPath);
  }

  startBodProcess(): Observable<number> {
    const apiPath = getBodBusinessDayEndpointUrl();
    return this.apiService
      .put(apiPath)
      .pipe(
        map((data: BodBusinessDayResponse) =>
          BodEodAdaptor.getBusinessDate(data)
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

  getMetalRatesAndGoldRateAvailabity(
    payload: MetalRatesRequestFormat
  ): Observable<MetalRatesAndGoldAvailabilityResponse> {
    const apiPath = getAvailableMetalRatesEndpointUrl();
    const requestPayload = {
      businessDate: payload.businessDate,
      isRetryAttempted: payload.isRetryAttempted
    };

    return this.apiService
      .post(apiPath, requestPayload)
      .pipe(
        map((data: any) =>
          BodEodAdaptor.getMetalRatesAndGoldRateAvailabity(data)
        )
      );
  }

  getBoutiquePossBodCompletionStatus(
    businessDay: number
  ): Observable<BodBusinessDayResponse> {
    const apiPath = getBodBusinessDayEndpointUrl();
    const requestPayload = {
      businessDate: businessDay
    };

    return this.apiService.post(apiPath, requestPayload);
  }

  getGhsBodCompletionStatus(
    businessDay: number
  ): Observable<BodBusinessDayResponse> {
    const apiPath = getGhsBodBusinessDayEndpointUrl();
    const requestPayload = {
      businessDate: businessDay
    };

    return this.apiService.post(apiPath, requestPayload);
  }

  generatePasswordForEghsOffline(
    requestPayload
  ): Observable<EghsBodGeneratedPassword> {
    const apiPath = getgeneratePasswordForEghsBodEndpointUrl();

    return this.apiService.post(apiPath, requestPayload);
  }

  loadGhsOfflineBodPasswords(): Observable<EghsBodPasswordsListingResponse> {
    const params = {
      contextType: BodEodEnum.GHS_OFFLINE_BOD,
      pageIndex: 0,
      pageSize: 10,
      sortBy: 'passwordDate,desc'
    };
    const apiPath = getgOfflineEghsBodListingEndpointUrlWithQueryParams(params);
    return this.apiService
      .get(apiPath.path, apiPath.params)
      .pipe(
        map((data: any) =>
          BodEodAdaptor.getOfflineEghsBodStatusData(data, this.dateFormat)
        )
      );
  }

  /*Eod Related*/
  getCurrentDayBodStatus(): Observable<number> {
    const apiPath = getEodBusinessDayEndpointUrl();

    return this.apiService
      .get(apiPath)
      .pipe(
        map((data: BodBusinessDayResponse) =>
          BodEodAdaptor.getBusinessDate(data)
        )
      );
  }

  getClosedBod(): Observable<number> {
    const apiPath = getLatestBodEndpointUrl();
    return this.apiService
      .get(apiPath)
      .pipe(
        map((data: LatestBodResponse) =>
          BodEodAdaptor.getClosedBusinessDateForOpenInProgressStatus(data)
        )
      );
  }

  startEodProcess() {
    const apiPath = getEodBusinessDayEndpointUrl();
    return this.apiService
      .put(apiPath)
      .pipe(
        map((data: BodBusinessDayResponse) =>
          BodEodAdaptor.getBusinessDate(data)
        )
      );
  }

  getWalkinDetailsStatus(
    businessDay: number
  ): Observable<WalkInDetailsResponse> {
    const apiPath = getWalkInDetailsEndpointUrl();

    return this.apiService.get(apiPath);
  }

  getGhsBankDepositUploadStatus(
    businessDay: number
  ): Observable<GhsFileUploadResponse> {
    const apiPath = getGhsBankDepositUploadEndpointUrl();
    const requestPayload = {
      businessDate: businessDay
    };

    return this.apiService.post(apiPath, requestPayload);
  }

  getPreviousDayBankDepositStatus(
    inputData: BankDepositRequestPayload
  ): Observable<GhsFileUploadResponse> {
    const apiPath = getPreviousDayBankDepositEndpointUrl();
    const requestPayload = {
      businessDate: inputData.businessDate,
      remarks: inputData.remarks,
      skipBanking: inputData.skipBanking
    };

    return this.apiService.post(apiPath, requestPayload);
  }

  performRevenueCollection(
    businessDay: number
  ): Observable<GhsFileUploadResponse> {
    const apiPath = getRevenueCollectionEndpointUrl();
    const requestPayload = {
      businessDate: businessDay
    };

    return this.apiService.post(apiPath, requestPayload);
  }

  performGhsRevenueCollection(
    businessDay: number
  ): Observable<GhsFileUploadResponse> {
    const apiPath = getGhsRevenueCollectionEndpointUrl();
    const requestPayload = {
      businessDate: businessDay
    };

    return this.apiService.post(apiPath, requestPayload);
  }

  performServiceRevenueCollection(
    businessDay: number
  ): Observable<ServiceFileUploadResponse> {
    const apiPath = getServiceRevenueCollectionEndpointUrl();
    const requestPayload = {
      businessDate: businessDay
    };

    return this.apiService.post(apiPath, requestPayload);
  }

  performEodOfflineGhsRevenueCollection(
    eghsOfflineEodData: OfflineGhsEodRevenueCollection
  ): Observable<any> {
    const apiPath = getEodOfflineGhsRevenueCollectionEndpointUrl();

    return this.apiService.post(apiPath, eghsOfflineEodData);
  }

  performGhsEodActivity(
    businessDay: number
  ): Observable<BodBusinessDayResponse> {
    const apiPath = getGhsEodActivityEndpointUrl();
    const requestPayload = {
      businessDate: businessDay
    };

    return this.apiService.post(apiPath, requestPayload);
  }

  performEodActivity(businessDay: number): Observable<number> {
    const apiPath = getEodActivityEndpointUrl();
    const requestPayload = {
      businessDate: businessDay
    };

    return this.apiService
      .post(apiPath, requestPayload)
      .pipe(
        map((data: BodBusinessDayResponse) =>
          BodEodAdaptor.getBusinessDate(data)
        )
      );
  }

  loadActiveUserSessions(): Observable<UsersActiveSessionsResults[]> {
    const apiPath = getActiveUserSessionsEndpointUrl();

    return this.apiService
      .get(apiPath)
      .pipe(map((data: any) => BodEodAdaptor.getUsersActiveSessions(data)));
  }
}
