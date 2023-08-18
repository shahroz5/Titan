import { Injectable } from '@angular/core';
import {
  ApplyDiscountRequest,
  ConfirmTransactionLevelDiscountPayload,
  DiscountsRequestPayload,
  DiscountTransactionLevelRequest,
  DiscountVoucherDetailsRequestPayload,
  GepPurityConfigIdEligibleItemsRequestPayload,
  GepPurityConfigIdEligibleItemsResponse,
  ItemLevelDiscountsDetailsRequestPayload,
  ItemLevelDiscountsRequestPayload,
  KaratOrCoinOfferEligibleItemsRequestPayload,
  LoadAppliedTransactionDiscountsRequest,
  RemoveAllAppliedTransactionLevelDiscountsPayload,
  RemoveAppliedTransactionLevelDiscountByIDPayload,
  UpdateTransactionLevelDiscountByIDPayload
} from '@poss-web/shared/models';
import {
  DiscountAdaptor,
  DiscountHelper
} from '@poss-web/shared/util-adaptors';
import {
  ApiService,
  getAppliedTransactionLevelDiscountsEndPointUrl,
  getApplyTransactionLevelEndPointUrl,
  getAutoDiscounts,
  getCheckABCOEligibility,
  getConfirmTransactionLevelDiscountByIdEndPointUrl,
  getConfirmTransactionLevelDiscountEndPointUrl,
  getDiscountVocherDetailsUrld,
  getEligibleItemsForGepPurityConfigId,
  getEligibleItemsForParticularDiscountUrl,
  getItemLevelDiscountsEndPointUrl,
  getLoadABCOConfigDetails,
  getLoadABCODiscountDetails,
  getLoadABCODiscounts,
  getLoadItemLevelDiscountsDetailsEndPointUrl,
  getLoadItemLevelDiscountsEndPointUrl,
  getRemoveAllTransactionLevelDiscountsEndPointUrl,
  getRemoveSelectedTransactionLevelDiscountEndPointUrl,
  getSlabExcludeDiscountsEndPointUrl,
  getTransactionLevelDiscountsEndPointUrl,
  getUpdateTransactionLevelDiscountEndPointUrl
} from '@poss-web/shared/util-api-service';
import { forkJoin, Observable, of } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';

@Injectable()
export class DiscountService {
  constructor(private apiService: ApiService) {}

  loadAvailableTransactionLevelDiscounts(
    payload: DiscountTransactionLevelRequest
  ) {
    const url = getTransactionLevelDiscountsEndPointUrl();
    return this.apiService
      .post(url.path, payload, url.params)
      .pipe(
        map((data: any) =>
          DiscountHelper.getBillLevelDiscounts(data.discountDetails)
        )
      );
  }

  applyTransactionLevelDiscount(payload: ApplyDiscountRequest) {
    const url = getApplyTransactionLevelEndPointUrl(
      payload.discountType,
      payload.txnType,
      payload.subTxnType,
      payload.transactionId
    );
    if (payload.hasDiscounts) {
      const deleteAllUrl = getRemoveAllTransactionLevelDiscountsEndPointUrl(
        payload.discountType,
        payload.txnType,
        payload.subTxnType,
        payload.transactionId
      );
      return this.apiService
        .delete(deleteAllUrl.path, deleteAllUrl.params)
        .pipe(map(details => details))
        .pipe(
          concatMap(configs => {
            if (payload.requestBody.discountDetails.length > 0) {
              return this.apiService
                .post(url.path, payload.requestBody, url.params)
                .pipe(map(data => true));
            } else return of(true);
          })
        );
    } else {
      if (payload.requestBody.discountDetails.length > 0) {
        return this.apiService
          .post(url.path, payload.requestBody, url.params)
          .pipe(map(data => true));
      } else {
        return of(false);
      }
    }
  }

  applyKaratOrCoinOfferTransactionLevelDiscount(payload: ApplyDiscountRequest) {
    const url = getApplyTransactionLevelEndPointUrl(
      payload.discountType,
      payload.txnType,
      payload.subTxnType,
      payload.transactionId
    );
    if (payload.hasDiscounts) {
      const deleteAllUrl = getRemoveAllTransactionLevelDiscountsEndPointUrl(
        payload.discountType,
        payload.txnType,
        payload.subTxnType,
        payload.transactionId
      );
      return this.apiService
        .delete(deleteAllUrl.path, deleteAllUrl.params)
        .pipe(map(details => details))
        .pipe(
          concatMap(configs => {
            if (payload.requestBody.discountDetails.length) {
              return this.apiService
                .post(url.path, payload.requestBody, url.params)
                .pipe(map(data => true));
            } else return of(true);
          })
        );
    } else {
      return this.apiService
        .post(url.path, payload.requestBody, url.params)
        .pipe(map(data => data));
    }
  }

  loadAppliedTransactionLevelDiscount(
    payload: LoadAppliedTransactionDiscountsRequest
  ) {
    const url = getAppliedTransactionLevelDiscountsEndPointUrl(
      payload.discountType,
      payload.txnType,
      payload.subTxnType,
      payload.transactionId,
      payload.applicableLevel,
      payload.status
    );
    return this.apiService
      .get(url.path, url.params)
      .pipe(map((data: any) => DiscountHelper.getDiscountsResponses(data)));
  }
  removeAllTransactionLevelDiscounts(
    payload: RemoveAllAppliedTransactionLevelDiscountsPayload
  ) {
    const url = getRemoveAllTransactionLevelDiscountsEndPointUrl(
      payload.discountType,
      payload.txnType,
      payload.subTxnType,
      payload.transactionId
    );
    return this.apiService.delete(url.path, url.params).pipe(map(data => true));
  }
  removeSelectedTransactionLevelDiscount(
    payload: RemoveAppliedTransactionLevelDiscountByIDPayload
  ) {
    const url = getRemoveSelectedTransactionLevelDiscountEndPointUrl(
      payload.discountId,
      payload.discountType,
      payload.txnType,
      payload.subTxnType,
      payload.transactionId
    );
    return this.apiService.delete(url.path, url.params).pipe(
      map(data => {
        return true;
      })
    );
  }
  updateTransactionLevelDiscount(
    payload: UpdateTransactionLevelDiscountByIDPayload
  ) {
    const url = getUpdateTransactionLevelDiscountEndPointUrl(
      payload.discountType,
      payload.txnType,
      payload.subTxnType,
      payload.transactionId,
      payload.isPriceUpdate
    );
    return this.apiService.patch(url.path, url.params).pipe(map(data => true));
  }
  confirmTransactionLevelDiscount(
    payload: ConfirmTransactionLevelDiscountPayload
  ) {
    if (!payload?.discountTxnId || payload?.discountTxnId?.length === 0) {
      const url = getConfirmTransactionLevelDiscountEndPointUrl(
        payload.discountType,
        payload.txnType,
        payload.subTxnType,
        payload.transactionId
      );
      return this.apiService
        .put(url.path, null, url.params)
        .pipe(map(data => [true]));
    } else {
      const result = [];
      for (const txnId of payload?.discountTxnId) {
        const url = getConfirmTransactionLevelDiscountByIdEndPointUrl(
          payload.discountType,
          payload.txnType,
          payload.subTxnType,
          payload.transactionId,
          txnId
        );
        result.push(
          this.apiService
            .put(url.path, null, url.params)
            .pipe(map(data => true))
        );
      }
      return forkJoin(...result);
    }
  }

  loadItemLevelDiscounts(payload: ItemLevelDiscountsRequestPayload) {
    const url = getLoadItemLevelDiscountsEndPointUrl();
    return this.apiService
      .post(url.path, payload, url.params)
      .pipe(map(data => DiscountAdaptor.getDiscountHeader(data)));
  }

  loadItemLevelDiscountsDetails(
    payload: ItemLevelDiscountsDetailsRequestPayload
  ) {
    const url = getLoadItemLevelDiscountsDetailsEndPointUrl(
      payload.discountId,
      payload.discountClubId
    );
    return this.apiService
      .post(url.path, payload.requestBody, url.params)
      .pipe(
        map(data =>
          data
            ? DiscountHelper.getDiscountConfigDetailsResponses(
                data.discountDetailsResponseDto,
                data.clubbingId,
                payload
              )
            : null
        )
      );
  }

  getItemLevelDiscountsDetails(payload: DiscountsRequestPayload) {
    const url = getItemLevelDiscountsEndPointUrl(
      payload.txnType,
      payload.subTxnType,
      payload.transactionId,
      payload.itemId
    );
    return this.apiService
      .get(url.path, url.params)
      .pipe(map(data => DiscountHelper.getDiscountsResponses(data)));
  }

  saveItemLevelDiscountsDetails(payload: DiscountsRequestPayload) {
    const url = getItemLevelDiscountsEndPointUrl(
      payload.txnType,
      payload.subTxnType,
      payload.transactionId,
      payload.itemId
    );
    return this.apiService
      .post(url.path, { discountDetails: payload.requestBody }, url.params)
      .pipe(map(data => DiscountHelper.getDiscountsResponses(data)));
  }

  saveSlabExclueItemDetails(payload: DiscountsRequestPayload) {
    const url = getSlabExcludeDiscountsEndPointUrl(
      payload.txnType,
      payload.subTxnType,
      payload.transactionId,
      payload.itemId
    );
    return this.apiService
      .post(url.path, {}, url.params)
      .pipe(map(data => data));
  }

  updateItemLevelDiscountsDetails(payload: DiscountsRequestPayload) {
    const url = getItemLevelDiscountsEndPointUrl(
      payload.txnType,
      payload.subTxnType,
      payload.transactionId,
      payload.itemId,
      payload.discountTxnId
    );
    return this.apiService
      .patch(url.path, payload.requestBody, url.params)
      .pipe(map(data => DiscountAdaptor.getDiscountsResponse(data)));
  }

  deleteItemLevelDiscountsDetails(payload: DiscountsRequestPayload) {
    const url = getItemLevelDiscountsEndPointUrl(
      payload.txnType,
      payload.subTxnType,
      payload.transactionId,
      payload.itemId,
      payload.discountTxnId
    );
    return this.apiService.delete(url.path, url.params).pipe(map(data => data));
  }

  getEligibleItemsForDiscountIds(
    discountType: string,
    payload: KaratOrCoinOfferEligibleItemsRequestPayload
  ) {
    const url = getEligibleItemsForParticularDiscountUrl(discountType);
    return this.apiService
      .post(url.path, payload, url.params)
      .pipe(map(data => data));
  }

  loadEligibleItemsForGepPurityDiscountConfigId(
    payload: GepPurityConfigIdEligibleItemsRequestPayload
  ): Observable<GepPurityConfigIdEligibleItemsResponse> {
    const url = getEligibleItemsForGepPurityConfigId();
    return this.apiService.post(url, payload).pipe(map(data => data));
  }

  loadDiscountVocherDetails(payload: DiscountVoucherDetailsRequestPayload) {
    const url = getDiscountVocherDetailsUrld(payload);
    return this.apiService
      .get(url.path, url.params)
      .pipe(map(data => DiscountAdaptor.getDiscountVoucherDetails(data)));
  }

  checkABCOEligibility(payload: {
    data: any;
    existingDiscounts: any;
    id: any;
  }) {
    const url = getCheckABCOEligibility();
    return this.apiService
      .post(url.path, payload.data, url.params)
      .pipe(
        map(data =>
          data
            ? DiscountHelper.getDiscountConfigDetailsResponses(
                data.discountDetailsResponseDto,
                data.clubbingId,
                payload
              )
            : null
        )
      );
  }

  loadABCODiscounts(payload: DiscountsRequestPayload) {
    const url = getLoadABCODiscounts(payload);
    return this.apiService
      .get(url.path, url.params)
      .pipe(map(data => DiscountAdaptor.getDiscountHeader(data)));
  }

  loadNewABCODiscounts(payload: DiscountsRequestPayload) {
    const url = getLoadABCODiscounts(payload);
    return this.apiService
      .get(url.path, url.params)
      .pipe(map(data => DiscountAdaptor.getDiscountHeader(data)));
  }

  loadABCODiscountDetails(payload: {
    data: any;
    existingDiscounts: any;
    id: any;
  }) {
    const url = getLoadABCODiscountDetails();

    return this.apiService
      .post(url.path, payload.data, url.params)
      .pipe(
        map(data =>
          data
            ? DiscountHelper.getDiscountConfigDetailsResponses(
                data.discountDetailsResponseDto,
                data.clubbingId,
                payload
              )
            : null
        )
      );
  }

  loadABCODConfigDetails(payload: any) {
    const url = getLoadABCOConfigDetails(payload);
    return this.apiService
      .get(url.path, url.params)
      .pipe(map(data => DiscountAdaptor.getDiscountHeaderDetails(data)));
  }

  loadAutoDiscounts(payload: any) {
    const url = getAutoDiscounts();
    return this.apiService
      .post(url.path, payload, url.params)
      .pipe(
        map(data =>
          data
            ? DiscountHelper.getDiscountConfigDetailsResponses(
                data.discountDetailsResponseDto,
                data.clubbingId,
                null,
                data.cummulativeDiscountWithExcludeDetails
              )
            : null
        )
      );
  }

  loadRivaahGHSDiscounts(payload: DiscountTransactionLevelRequest) {
    const url = getTransactionLevelDiscountsEndPointUrl();
    return this.apiService
      .post(url.path, payload, url.params)
      .pipe(map((data: any) => DiscountAdaptor.getRivaahGHSDiscounts(data)));
  }

  saveRivaahGHSDiscounts(payload: ApplyDiscountRequest) {
    const url = getApplyTransactionLevelEndPointUrl(
      payload.discountType,
      payload.txnType,
      payload.subTxnType,
      payload.transactionId
    );
    return this.apiService
      .post(url.path, payload.requestBody, url.params)
      .pipe(map((data: any) => data.discountTxnIdList));
  }
}
