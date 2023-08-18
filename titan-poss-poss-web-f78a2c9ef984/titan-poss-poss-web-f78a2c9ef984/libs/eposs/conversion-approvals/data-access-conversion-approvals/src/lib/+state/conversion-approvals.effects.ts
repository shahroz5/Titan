import { Injectable } from '@angular/core';
import { Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/angular';
import { map } from 'rxjs/operators';
import { ConversionApprovalsState } from './conversion-approvals.state';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { ConversionApprovalsActionTypes } from './conversion-approvals.actions';
import * as ConversionApprovalsActions from './conversion-approvals.actions';
import { ConversionApprovalsService } from '../conversion-approvals.service';
import { HttpErrorResponse } from '@angular/common/http';
import {
  ConversionApprovalListingResponsePayload,
  CustomErrors,
  ImageResponse,
  SelectedRequestDataResponse,
  SelectedRequestDetailsResponse
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { LoggerService } from '@poss-web/shared/util-logger';
import { CommonService } from '@poss-web/shared/common/data-access-common'; 

@Injectable()
export class ConversionApprovalsEffects {
  constructor(
    private dataPersistence: DataPersistence<ConversionApprovalsState>,
    private conversionApprovalsService: ConversionApprovalsService,
    private loggerService: LoggerService,
    private commonService: CommonService
  ) {}

  @Effect() loadApprovalRequestsList$: Observable<
    Action
  > = this.dataPersistence.fetch(
    ConversionApprovalsActionTypes.LOAD_APPROVAL_REQUESTS_LIST,
    {
      run: (action: ConversionApprovalsActions.LoadApprovalRequestsList) => {
        return this.conversionApprovalsService
          .loadApprovalRequestsList(action.payload)
          .pipe(
            map(
              (data: ConversionApprovalListingResponsePayload) =>
                new ConversionApprovalsActions.LoadApprovalRequestsListSuccess(
                  data
                )
            )
          );
      },
      onError: (
        action: ConversionApprovalsActions.LoadApprovalRequestsList,
        error: HttpErrorResponse
      ) => {
        return new ConversionApprovalsActions.LoadApprovalRequestsListFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() loadMoreApprovalRequestsList$: Observable<
    Action
  > = this.dataPersistence.fetch(
    ConversionApprovalsActionTypes.LOAD_MORE_APPROVAL_REQUESTS_LIST,
    {
      run: (
        action: ConversionApprovalsActions.LoadMoreApprovalRequestsList
      ) => {
        return this.conversionApprovalsService
          .loadApprovalRequestsList(action.payload)
          .pipe(
            map(
              (data: ConversionApprovalListingResponsePayload) =>
                new ConversionApprovalsActions.LoadMoreApprovalRequestsListSuccess(
                  data
                )
            )
          );
      },
      onError: (
        action: ConversionApprovalsActions.LoadMoreApprovalRequestsList,
        error: HttpErrorResponse
      ) => {
        return new ConversionApprovalsActions.LoadMoreApprovalRequestsListFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() loadSeletedRequest$ = this.dataPersistence.fetch(
    ConversionApprovalsActionTypes.LOAD_SELECTED_REQUEST,
    {
      run: (action: ConversionApprovalsActions.LoadSelectedRequest) => {
        return this.conversionApprovalsService
          .getSelectedRequestDetails(action.payload)
          .pipe(
            map(
              (data: SelectedRequestDetailsResponse) =>
                new ConversionApprovalsActions.LoadSelectedRequestSuccess(data)
            )
          );
      },

      onError: (
        action: ConversionApprovalsActions.LoadSelectedRequest,
        error: HttpErrorResponse
      ) => {
        return new ConversionApprovalsActions.LoadSelectedRequestFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  loadSelectedRequestItems$ = this.dataPersistence.fetch(
    ConversionApprovalsActionTypes.LOAD_SELECTED_REQUEST_DATA,
    {
      run: (
        action: ConversionApprovalsActions.LoadSelectedRequestData,
        state
      ) => {
        return this.conversionApprovalsService
          .getSelectedRequestItems(action.payload)
          .pipe(
            map(
              (conversionRequestItemData: SelectedRequestDataResponse) =>
                new ConversionApprovalsActions.LoadSelectedRequestDataSuccess(
                  conversionRequestItemData
                )
            )
          );
      },
      onError: (
        action: ConversionApprovalsActions.LoadSelectedRequestData,
        error: HttpErrorResponse
      ) => {
        return new ConversionApprovalsActions.LoadSelectedRequestDataFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  updateApprovalRequestStatus$ = this.dataPersistence.fetch(
    ConversionApprovalsActionTypes.UPDATE_APPROVAL_REQUEST_STATUS,
    {
      run: (
        action: ConversionApprovalsActions.UpdateApprovalRequestStatus,
        state
      ) => {
        return this.conversionApprovalsService
          .updateStatus(action.payload)
          .pipe(
            map(
              (data: SelectedRequestDetailsResponse) =>
                new ConversionApprovalsActions.UpdateApprovalRequestStatusSuccess(
                  data
                )
            )
          );
      },
      onError: (
        action: ConversionApprovalsActions.UpdateApprovalRequestStatus,
        error: HttpErrorResponse
      ) => {
        return new ConversionApprovalsActions.UpdateApprovalRequestStatusFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  // Image

  @Effect() loadThumbnailImageUrl$ = this.dataPersistence.fetch(
    ConversionApprovalsActionTypes.LOAD_THUMBNAIL_IMAGE_URL,
    {
      run: (action: ConversionApprovalsActions.LoadThumbnailImageUrl, state) => {
        return this.commonService
          .getThumbnailImageUrl(action.payload)
          .pipe(
            map(
              (loadImageResponse: ImageResponse) =>
                new ConversionApprovalsActions.LoadThumbnailImageUrlSuccess(
                  loadImageResponse
                )
            )
          );
      },

      onError: (
        action: ConversionApprovalsActions.LoadThumbnailImageUrl,
        error: HttpErrorResponse
      ) => {
        return new ConversionApprovalsActions.LoadThumbnailImageUrlFailure({
          id: action.payload.id,
          isChildItems: action.payload?.isChildItems
        });
      }
    }
  );

  @Effect() loadImageUrl$ = this.dataPersistence.fetch(
    ConversionApprovalsActionTypes.LOAD_IMAGE_URL,
    {
      run: (action: ConversionApprovalsActions.LoadImageUrl, state) => {
        return this.commonService
          .getImageUrl(action.payload)
          .pipe(
            map(
              (loadImageResponse: ImageResponse) =>
                new ConversionApprovalsActions.LoadImageUrlSuccess(
                  loadImageResponse
                )
            )
          );
      },

      onError: (
        action: ConversionApprovalsActions.LoadImageUrl,
        error: HttpErrorResponse
      ) => {
        return new ConversionApprovalsActions.LoadImageUrlFailure({
          id: action.payload.id,
          imageUrl: action.payload.imageUrl,
          isChildItems: action.payload?.isChildItems
        });
      }
    }
  );

  errorHandler(error: HttpErrorResponse): CustomErrors {
    const customError: CustomErrors = CustomErrorAdaptor.fromJson(error);
    this.loggerService.error(customError);
    return customError;
  }
}
