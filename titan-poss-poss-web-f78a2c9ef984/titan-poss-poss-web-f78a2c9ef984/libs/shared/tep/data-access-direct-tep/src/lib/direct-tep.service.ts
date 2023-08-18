import { Injectable } from '@angular/core';
import {
  addCutPieceTepItemInStockManagementPayload,
  addOrPatchCutPieceTepItemInStockManagementResponse,
  AddOrUpdateTepItemResponse,
  AddTepItemRequestPayload,
  BillCancelPayload,
  CancelResponse,
  CancelTEPResponse,
  CashMemoTaxDetails,
  confirmCutPieceTepItemInStockManagementPayload,
  ConfirmOrHoldTepRequestPayload,
  ConfirmRequestTepRequestPayload,
  ConfirmTepItemResponse,
  createOpenOrPatchCutPieceTepStockManagementResponse,
  CreateOpenTepTransactionResponse,
  CreateTepTypesEnum,
  DeleteTepItemResponse,
  DiscountListPayload,
  DiscountsList,
  FileUploadDownloadPayload,
  GetTepCashMemoResponse,
  GetTepItemConfiguratonResponse,
  GetTepPriceDetailsRequestPayload,
  GetTepPriceDetailsResponse,
  patchCutPieceTepItemInStockManagementPayload,
  patchCutPieceTepStockManagementPayload,
  PatchTepRequestPayload,
  RefundCashLimit,
  TepTxnTypesEnum,
  UpdateTepItemRequestPayload,
  workflowPayload
} from '@poss-web/shared/models';
import {
  BillCancellationRequestsAdaptor,
  CashMemoAdaptor
} from '@poss-web/shared/util-adaptors';
import {
  addCutPieceTepItemInStockManagementUrl,
  addTepItemToGridEndPointUrl,
  ApiService,
  confirmCutPieceTepItemInStockManagementUrl,
  confirmOrHoldTepEndPointUrl,
  confirmRequestTepEndPointUrl,
  createCutPieceTepStockManagementUrl,
  deletCutPieceTepItemEndPointUrl,
  deleteTepItemEndPointUrl,
  directCancelTEPUrl,
  getAvailableDiscountsEndPointUrl,
  getCutPieceTepTransactionUrl,
  getInititateTepEndpointUrl,
  getLocationStoresUrl,
  getProductGroupDetailsUrl,
  getReasonsEndPointUrl,
  getRefundCashLimitUrl,
  getTaxDetailsEndPointUrl,
  getTepCashMemoDetailsUrl,
  getTepItemCodeEndPointUrl,
  getTepItemConfigUrl,
  getTepItemEndPointUrl,
  getTepPriceDetailsEndPointUrl,
  getTepTransactionUrl,
  getWorkFlowProcessByIdUrl,
  getWorkFlowProcessDetailsUrl,
  patchCutPieceTepItemInStockManagementUrl,
  patchCutPieceTepStockManagementUrl,
  tepDownloadUrl,
  tepUploadUrl,
  updateOpenTepTransactionEndPointUrl,
  updateTepItemInGridEndPointUrl,
  updateTepTransactionPriceDetailsEndPointUrl
} from '@poss-web/shared/util-api-service';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TepService {
  private txnType = TepTxnTypesEnum.TEP;

  constructor(private apiService: ApiService) {}

  initiateTepOpenTransaction(
    subTransactionType: string,
    requestBody: any
  ): Observable<CreateOpenTepTransactionResponse> {
    const urlObject = getInititateTepEndpointUrl(
      this.txnType,
      subTransactionType
    );
    const initiateTepTransactionUrl = urlObject.path;
    const params = urlObject.params;
    return this.apiService.post(initiateTepTransactionUrl, requestBody, params);
  }

  loadWorkflowDeatils(data: workflowPayload): Observable<any> {
    const workflowUrl = getWorkFlowProcessDetailsUrl(data);
    return this.apiService
      .get(workflowUrl.path, workflowUrl.params)
      .pipe(map(data => data));
  }

  updateTepOpenTransaction(
    id: string,
    subTransactionType: string,
    patchTepRequestPayload: PatchTepRequestPayload
  ): Observable<CreateOpenTepTransactionResponse> {
    const urlObject = updateOpenTepTransactionEndPointUrl(
      id,
      subTransactionType,
      this.txnType
    );
    const updateTepOpenTransactionUrl = urlObject.path;
    const params = urlObject.params;
    return this.apiService.patch(
      updateTepOpenTransactionUrl,
      patchTepRequestPayload,
      params
    );
  }

  getTepItemConfiguration(
    itemCode: string,
    tepType: string,
    isDummy?: boolean,
    customerMobileNo?: string
  ): Observable<GetTepItemConfiguratonResponse> {
    const getTepItemConfigurationUrl = getTepItemConfigUrl(
      itemCode,
      tepType,
      isDummy,
      customerMobileNo
    );
    return this.apiService.get(
      getTepItemConfigurationUrl.path,
      getTepItemConfigurationUrl.params
    );
  }

  getTepCashMemoItemsList(
    locationCode: string,
    refDocNo: string,
    refFiscalYear: string,
    subTransactionType: string,
    mobileNumber: string
  ): Observable<any> {
    const tepCashMemoItemsListUrl = getTepCashMemoDetailsUrl(
      locationCode,
      refDocNo,
      refFiscalYear,
      subTransactionType,
      this.txnType
    );
    return this.apiService
      .get(tepCashMemoItemsListUrl.path, tepCashMemoItemsListUrl.params)
      .pipe(
        map((cashMemoList: GetTepCashMemoResponse) => {
          return { results: cashMemoList.results };
        })
      );
  }

  addTepItem(
    id: string,
    subTransactionType: string,
    requestpayload: AddTepItemRequestPayload
  ): Observable<AddOrUpdateTepItemResponse> {
    const addTepItemUrlObj = addTepItemToGridEndPointUrl(
      id,
      subTransactionType,
      this.txnType
    );
    return this.apiService.post(
      addTepItemUrlObj.path,
      requestpayload,
      addTepItemUrlObj.params
    );
  }

  getTepItemPriceDetails(
    requestPayload: GetTepPriceDetailsRequestPayload,
    locationCode?: string,
    customerId?: number,
    isFullValueTep?: boolean
  ): Observable<GetTepPriceDetailsResponse> {
    const tepItemPriceDetailsUrl = getTepPriceDetailsEndPointUrl();
    return this.apiService.post(tepItemPriceDetailsUrl, requestPayload).pipe(
      switchMap((priceResponse: GetTepPriceDetailsResponse) => {
        return this.getTaxDetails(
          customerId,
          priceResponse.itemCode,
          'TEP_GEP_TANISHQ_EXCHANGE',
          locationCode,
          isFullValueTep
        ).pipe(
          map((cashMemoTaxDetails: any) => {
            return { ...priceResponse, taxDetails: cashMemoTaxDetails };
          })
        );
      })
    );
  }

  updateTepItemInGrid(
    id: string,
    itemId: string,
    subTransactionType: string,
    requestPayload: UpdateTepItemRequestPayload
  ): Observable<AddOrUpdateTepItemResponse> {
    const updateTepItemUrlObj = updateTepItemInGridEndPointUrl(
      id,
      itemId,
      subTransactionType,
      this.txnType
    );
    return this.apiService.put(
      updateTepItemUrlObj.path,
      requestPayload,
      updateTepItemUrlObj.params
    );
  }

  confirmOrHoldTep(
    id: string,
    status: string,
    subTransactionType: string,
    requestPayload: ConfirmOrHoldTepRequestPayload
  ): Observable<ConfirmTepItemResponse> {
    const confirmOrHoldTepUrlObj = confirmOrHoldTepEndPointUrl(
      id,
      status,
      subTransactionType,
      this.txnType
    );
    return this.apiService.put(
      confirmOrHoldTepUrlObj.path,
      requestPayload,
      confirmOrHoldTepUrlObj.params
    );
  }

  confirmRequestTep(
    id: string,
    status: string,
    subTransactionType: string,
    workflowType: string,
    requestPayload: ConfirmRequestTepRequestPayload
  ): Observable<ConfirmTepItemResponse> {
    const confirmOrHoldTepUrlObj = confirmRequestTepEndPointUrl(
      id,
      status,
      subTransactionType,
      this.txnType,
      workflowType
    );
    return this.apiService.put(
      confirmOrHoldTepUrlObj.path,
      requestPayload,
      confirmOrHoldTepUrlObj.params
    );
  }

  cancel(
    processID: string,
    workflowType: string
  ): Observable<CancelTEPResponse> {
    const url = getWorkFlowProcessByIdUrl(processID, workflowType);
    return this.apiService
      .post(url.path, {}, url.params)
      .pipe(map(data => data));
  }

  cancelTEP(cancelPayload: BillCancelPayload): Observable<CancelResponse> {
    const url = directCancelTEPUrl();
    return this.apiService
      .post(url.path, cancelPayload, url.params)
      .pipe(
        map(data => BillCancellationRequestsAdaptor.getCancelResFromJson(data))
      );
  }

  deleteTepItem(
    id: string,
    itemId: string,
    subTransactionType: string
  ): Observable<DeleteTepItemResponse> {
    const deleteTepItemUrlObj =
      subTransactionType === CreateTepTypesEnum.CUT_PIECE_TEP
        ? deletCutPieceTepItemEndPointUrl(
            id,
            itemId,
            subTransactionType,
            this.txnType
          )
        : deleteTepItemEndPointUrl(
            id,
            itemId,
            subTransactionType,
            this.txnType
          );
    return this.apiService.delete(
      deleteTepItemUrlObj.path,
      deleteTepItemUrlObj.params
    );
  }

  getTepItemCodeDetails(itemCode: string): Observable<any> {
    const tepItemCodeDetailsUrl = getTepItemCodeEndPointUrl();
    return this.apiService
      .post(tepItemCodeDetailsUrl, {
        itemCode
      })
      .pipe(
        map(response =>
          response && response.results && response.results[0].productGroupCode
            ? response.results[0].productGroupCode
            : ''
        )
      );
  }

  getTepTransactionDetails(
    id: string,
    subTransactionType: string,
    recalculate?: boolean,
    isTepException?: boolean
  ): Observable<any> {
    const urlObject =
      subTransactionType === CreateTepTypesEnum.CUT_PIECE_TEP
        ? getCutPieceTepTransactionUrl(id, subTransactionType, this.txnType)
        : getTepTransactionUrl(
            id,
            subTransactionType,
            this.txnType,
            recalculate,
            isTepException
          );
    return this.apiService
      .get(urlObject.path, urlObject.params)
      .pipe(map(data => data));
  }

  deleteTepTransactionDetails(
    id: string,
    subTransactionType: string
  ): Observable<any> {
    const urlObject = getTepTransactionUrl(
      id,
      subTransactionType,
      this.txnType
    );
    return this.apiService
      .delete(urlObject.path, urlObject.params)
      .pipe(map(data => data));
  }

  getTepItemDetails(
    id: string,
    itemId: string,
    subTransactionType: string,
    tepType: string,
    customerMobileNo: string
  ): Observable<any> {
    const urlObject = getTepItemEndPointUrl(
      id,
      itemId,
      subTransactionType,
      this.txnType
    );

    if (tepType !== CreateTepTypesEnum.CUT_PIECE_TEP) {
      return this.apiService
        .get(urlObject.path, urlObject.params)
        .pipe(
          switchMap(data => {
            return this.getTepItemConfiguration(
              data.itemCode,
              tepType,
              false,
              customerMobileNo
            ).pipe(
              map(innerData => {
                const responseData = { ...data, ...innerData };
                //responseData = { ...responseData, data };
                //responseData = { ...responseData, innerData };
                return responseData;
              })
            );
          })
        )
        .pipe(
          map(finalData => {
            console.log('DATA IN SERVICE :', finalData);
            return finalData;
          })
        );
    } else {
      return this.apiService
        .get(urlObject.path, urlObject.params)
        .pipe(map(data => data));
    }
  }

  getGoldPlusLocationDetails(payload?: boolean) {
    const urlObject = getLocationStoresUrl(false);
    const requestPayload = {
      brandCodes: ['GoldPlus'],
      isLocationFromTep: payload
    };
    return this.apiService
      .post(urlObject.path, requestPayload, urlObject.params)
      .pipe(
        map(data =>
          data.results && data.results.length > 0 ? data.results : []
        )
      );
  }

  uploadFile(fileDetails: FileUploadDownloadPayload): Observable<any> {
    const url = tepUploadUrl(fileDetails);
    return this.apiService
      .postImage(url, fileDetails.file, 'text')
      .pipe(map((data: any) => data));
  }

  downloadFile(fileDetails: FileUploadDownloadPayload): Observable<any> {
    const url = tepDownloadUrl(fileDetails);
    return this.apiService.get(url).pipe(map((data: any) => data.url));
  }

  getFullValueTepReasons(): Observable<string[]> {
    const url = getReasonsEndPointUrl('FULL_VALUE_TEP_REASON');
    return this.apiService.get(url).pipe(
      map(data => {
        return data && data.results && data.results.length > 0
          ? data.results.map(result => result.value)
          : [];
      })
    );
  }

  updateTepTransactionPriceDetails(
    id: string,
    subTxnType: string
  ): Observable<any> {
    const urlObj = updateTepTransactionPriceDetailsEndPointUrl(
      id,
      subTxnType,
      this.txnType
    );
    return this.apiService
      .patch(urlObj.path, null, urlObj.params)
      .pipe(map(data => data));
  }

  createOpenCutPieceTepTransaction(): Observable<
    createOpenOrPatchCutPieceTepStockManagementResponse
  > {
    const urlObj = createCutPieceTepStockManagementUrl();
    return this.apiService
      .post(urlObj.path, {}, urlObj.params)
      .pipe(map(data => data));
  }

  patchCutPieceTepTransaction(
    id: string,
    requestPayload: patchCutPieceTepStockManagementPayload
  ): Observable<createOpenOrPatchCutPieceTepStockManagementResponse> {
    const urlObj = patchCutPieceTepStockManagementUrl(id);
    return this.apiService
      .patch(urlObj.path, requestPayload, urlObj.params)
      .pipe(map(data => data));
  }

  addCutPieceTepTransactionItem(
    id: string,
    requestPayload: addCutPieceTepItemInStockManagementPayload
  ): Observable<addOrPatchCutPieceTepItemInStockManagementResponse> {
    const urlObj = addCutPieceTepItemInStockManagementUrl(id);
    return this.apiService
      .post(urlObj.path, requestPayload, urlObj.params)
      .pipe(map(data => data));
  }

  patchCutPieceTepTransactionItem(
    id: string,
    itemId: string,
    requestPayload: patchCutPieceTepItemInStockManagementPayload
  ): Observable<addOrPatchCutPieceTepItemInStockManagementResponse> {
    const urlObj = patchCutPieceTepItemInStockManagementUrl(id, itemId);
    return this.apiService
      .patch(urlObj.path, requestPayload, urlObj.params)
      .pipe(map(data => data));
  }

  confirmCutPieceTepTransactionItem(
    id: string,
    requestPayload: confirmCutPieceTepItemInStockManagementPayload
  ): Observable<addOrPatchCutPieceTepItemInStockManagementResponse> {
    const urlObj = confirmCutPieceTepItemInStockManagementUrl(id);
    return this.apiService
      .put(urlObj.path, requestPayload, urlObj.params)
      .pipe(map(data => data));
  }

  getTaxDetails(
    customerId: number,
    itemCode: string,
    txnType: string,
    locationCode?: string,
    isFullValueTep?: boolean
  ): Observable<CashMemoTaxDetails> {
    const getTaxDetailsUrl = getTaxDetailsEndPointUrl(
      customerId,
      itemCode,
      txnType,
      locationCode,
      isFullValueTep
    );
    return this.apiService
      .get(getTaxDetailsUrl.path, getTaxDetailsUrl.params)
      .pipe(map((data: any) => CashMemoAdaptor.taxDetails(data)));
  }

  getAvailableDiscounts(
    payload: DiscountListPayload
  ): Observable<DiscountsList[]> {
    const urlObj = getAvailableDiscountsEndPointUrl(payload);
    return this.apiService.get(urlObj.path, urlObj.params).pipe(
      map((data: { results: DiscountsList[] }) => {
        return data?.results && data?.results?.length > 0 ? data?.results : [];
      })
    );
  }

  loadProductGroupCodes(
    productType: string,
    transactionType: string
  ): Observable<string[]> {
    const urlObj = getProductGroupDetailsUrl(productType, transactionType);
    return this.apiService.get(urlObj.path, urlObj.params).pipe(
      map(response => {
        return response ? Object.keys(response) : [];
      })
    );
  }

  getRefundCashLimit(
    customerId?: number,
    refundAmt?: number,
    txnType?: string
  ): Observable<RefundCashLimit> {
    const getRefundCashLimit = getRefundCashLimitUrl(
      customerId,
      refundAmt,
      txnType
    );
    return this.apiService.get(
      getRefundCashLimit.path,
      getRefundCashLimit.params
    );
  }
}
