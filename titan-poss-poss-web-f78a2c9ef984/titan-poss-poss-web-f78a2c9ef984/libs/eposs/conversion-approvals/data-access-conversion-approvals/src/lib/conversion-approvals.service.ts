import { Injectable } from '@angular/core';
import {
  ApiService,
  getConversionApprovalRequestsEndpointUrl,
  getRequestByIdEndpointUrl,
  getRequestItemsByIdEndpointUrl,
  getUpdateApprovalRequestStatusEndpointUrl
} from '@poss-web/shared/util-api-service';
import { Observable } from 'rxjs';
import {
  ConversionApprovalListingResponsePayload,
  ConversionApprovalRequestsListingPayload,
  SelectedRequestDataResponse,
  SelectedRequestDetailsResponse,
  SelectedRequestPayload,
  UpdateApprovalRequestStatusPayload
} from '@poss-web/shared/models';
import { map } from 'rxjs/operators';
import { ConversionAdaptor } from '@poss-web/shared/util-adaptors';

@Injectable({
  providedIn: 'root'
})
export class ConversionApprovalsService {
  constructor(private apiService: ApiService) {}

  loadApprovalRequestsList(
    requestPayload: ConversionApprovalRequestsListingPayload
  ): Observable<ConversionApprovalListingResponsePayload> {
    const url = getConversionApprovalRequestsEndpointUrl(requestPayload);

    return this.apiService
      .get(url.path, url.params)
      .pipe(map(data => ConversionAdaptor.getApprovalRequestsList(data)));
  }

  getSelectedRequestDetails(
    payload: SelectedRequestPayload
  ): Observable<SelectedRequestDetailsResponse> {
    const url = getRequestByIdEndpointUrl(payload.id, payload.requestType);
    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map((data: any) =>
          ConversionAdaptor.getSelectedRequestItemDetails(data)
        )
      );
  }
  getSelectedRequestItems(
    payload: SelectedRequestPayload,
    studdedproductGroups: string[] = []
  ): Observable<SelectedRequestDataResponse> {
    const url = getRequestItemsByIdEndpointUrl(payload.id, payload.requestType);
    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map((data: any) =>
          ConversionAdaptor.SelectedRequestData(
            data.results,
            studdedproductGroups
          )
        )
      );
  }

  updateStatus(
    payload: UpdateApprovalRequestStatusPayload
  ): Observable<SelectedRequestDetailsResponse> {
    const url = getUpdateApprovalRequestStatusEndpointUrl(
      payload.id,
      payload.requestType
    );

    return this.apiService
      .patch(url.path, payload.requestUpdateDto, url.params)
      .pipe(
        map((data: any) =>
          ConversionAdaptor.getSelectedRequestItemDetails(data)
        )
      );
  }
}
