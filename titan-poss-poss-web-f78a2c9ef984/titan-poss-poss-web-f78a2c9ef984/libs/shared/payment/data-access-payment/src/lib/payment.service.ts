import {
  CNListResponsePayload,
  PaymentModeEnum,
  TransactionTypeEnum,
  PaymentDetails,
  PaymentType,
  QCGCCardDetails,
  QCGCGetBalancePayload,
  AllowedPaymentsResponse,
  CashPaymentPayload,
  PaymentGroupEnum,
  PaymentStatusEnum,
  PaymentConfig,
  SubTransactionTypeEnum,
  ROManualPayment,
  IntegratedPaymentRequestPayload,
  PaymentRequest,
  ROPaymentRequestStatus,
  GHSeVoucherDetails,
  CNListRequestPayload,
  CNListResponse,
  ConfigTypeEnum,
  InvokeCNRequestPayload,
  GVStatusListingPayload,
  GVStatusUpdateList,
  ThirdPartyCNRequestPayload,
  GHSAccountDetails,
  GHSAttachments,
  GHSAttachmentsPayload,
  GenerateOtpPayload,
  CreditNoteDetail,
  GenerateOtpDigiGoldPayload,
  DigiGetBalancePayload,
  CashLimitDetails,
  MaxCashAmountDetails,
  EmployeeLoanConfigList,
  LoadEmployeeDetailsPayload,
  AirpayPayment,
  RazorPayPayment,
  AirpayManualPayment,
  PayeeBankPaymentCodeEnums,
  RazorPayManualPayment,
  ValidateCashBackPayload,
  UpdatePaymentDetailsForVoidUnipayPayload
} from '@poss-web/shared/models';
import { Inject, Injectable } from '@angular/core';
import {
  ApiService,
  getPaymentModesEndpointUrl,
  getAddPaymentEndpointUrl,
  getPaymentEndpointUrl,
  getLoadPaymentDetailsEndpointUrl,
  getPayeeBanksEndpointUrl,
  getQCGCPaymentEndpointURl,
  getMaxCashLimitEndpointUrl,
  getEditPaymentEndpointUrl,
  getQCGCProductGroupEndpointURl,
  getPayerBanksEndpointUrl,
  getBankPrioritiesEndpointUrl,
  validatePaymentEndpointUrl,
  getConfirmPaymentEndpointUrl,
  getPaymentRequestUrl,
  getPaymentRequestStatusURL,
  getROPaymentRequestStatusURLByID,
  getCustomerUrl,
  getCmRequestDetailsUrl,
  getQCGCPaymentCustomerEndpointURl,
  getLoadCreditNoteDetailsEndpointUrl,
  getCnRequestListUrl,
  getCnPriorityUrl,
  getInvokeCNUrl,
  getGVBalanceUrl,
  getThirdPartyCnRequestListUrl,
  generateOTPForCnUrl,
  getConfirmlinkedCNPaymentEndpointUrl,
  getCashLimitCapUrl,
  getGHSAccountDetailsEndpointURl,
  getGHSAttachmentsEndpointURl,
  getCreditNoteDetailByIdUrl,
  getDigiBalanceEndpointURl,
  getDigiPriceEndpointURl,
  validateDigiOtpEndpointURl,
  generateDigiOtpEndpointURl,
  getEmpLoanDetailsUrl,
  getCahbacOfferkBankDetailUrl,
  getCashBackConfigDetailsUrl,
  validateCashbackCardUrl,
  getActiveAccessTokenEndpointUrl,
  updatePaymentStatusForVoidUnipayUrl,
  updateCNStatusForVoidUnipayUrl
} from '@poss-web/shared/util-api-service';
import { Observable, of, forkJoin } from 'rxjs';
import { concatMap, map, mergeMap } from 'rxjs/operators';
import {
  PaymentHelper,
  PaymentAdaptor,
  EmployeeLoanConfigurationAdaptor
} from '@poss-web/shared/util-adaptors';
import { CryptoService } from '@poss-web/shared/auth/data-access-auth';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  constructor(
    private apiService: ApiService,
    @Inject('env') private env,
    private cryptoService: CryptoService
  ) {}

  getAllowedPayments(
    type: TransactionTypeEnum
  ): Observable<AllowedPaymentsResponse> {
    const api = getPaymentModesEndpointUrl(type);
    return this.apiService
      .get(api.path, api.params)
      .pipe(map((data: any) => PaymentHelper.getAllowedPayments(data)));
  }

  getROPaymentRequestStatus(customerID: string): Observable<PaymentRequest> {
    const requestListUrl = getPaymentRequestStatusURL(
      PaymentModeEnum.RO_PAYMENT
    );
    const request = {
      customerId: customerID,
      isWorkFlowApproval: true,
      status: [
        ROPaymentRequestStatus.APPROVED,
        ROPaymentRequestStatus.REJECTED,
        ROPaymentRequestStatus.PENDING
      ]
    };

    return this.apiService
      .post(requestListUrl.path, request, requestListUrl.params)
      .pipe(
        map((data: any) => PaymentHelper.getROPaymentRequests(data)),
        mergeMap(requests => {
          if (requests?.length > 0) {
            const reuestByIDUrl = getROPaymentRequestStatusURLByID(
              requests[0].id
            );
            return this.apiService
              .get(reuestByIDUrl)
              .pipe(
                map((data: any) => PaymentAdaptor.getROPaymentRequest(data))
              );
          } else {
            return of(null);
          }
        })
      );
  }

  getPaymentRequestStatus(
    customerID: string,
    paymentMode: PaymentModeEnum
  ): Observable<PaymentRequest[]> {
    const requestListUrl = getPaymentRequestStatusURL(paymentMode);
    const request = {
      customerId: customerID,
      isWorkFlowApproval: true,
      status:
        paymentMode === PaymentModeEnum.RO_PAYMENT
          ? [
              ROPaymentRequestStatus.APPROVED,
              ROPaymentRequestStatus.REJECTED,
              ROPaymentRequestStatus.PENDING
            ]
          : [
              ROPaymentRequestStatus.OPEN,
              ROPaymentRequestStatus.IN_PROGRESS,
              ROPaymentRequestStatus.COMPLETED,
              ROPaymentRequestStatus.FAILED
            ]
    };

    return this.apiService
      .post(requestListUrl.path, request, requestListUrl.params)
      .pipe(map((data: any) => PaymentHelper.getROPaymentRequests(data)));
  }

  addPayment(
    transactionType: TransactionTypeEnum,
    subTransactionType: SubTransactionTypeEnum,
    transactionId: string,
    paymentDetails: PaymentType,
    isTcsPayment?: boolean
  ): Observable<PaymentDetails> {
    let paymentCode = paymentDetails.mode.toString();
    if (paymentDetails.mode === PaymentModeEnum.WALLET) {
      paymentCode = paymentDetails.payload.instrumentNo;
    }
    if (paymentDetails.mode === PaymentModeEnum.BANK_LOAN) {
      paymentCode = paymentDetails.payload.instrumentType;
    }
    const api = getAddPaymentEndpointUrl(
      transactionType,
      subTransactionType,
      transactionId,
      paymentCode,
      paymentDetails.group,
      isTcsPayment
    );
    if (paymentDetails.mode === PaymentModeEnum.CASH_BACK) {
      return this.apiService
        .get(getActiveAccessTokenEndpointUrl(this.env))
        .pipe(
          concatMap(key => {
            const instrumentNo = this.cryptoService.encryptPassword(
              key.publicKey,
              paymentDetails.payload.instrumentNo
            );

            const paymentData = {
              amount: paymentDetails.payload.amount,
              reference1: paymentDetails.payload.reference1,
              reference2: paymentDetails.payload.reference2,
              bankName: paymentDetails.payload.bankName,

              instrumentNo: instrumentNo
            };
            return this.apiService
              .post(api.path, paymentData, api.params)
              .pipe(map((data: any) => PaymentHelper.getPaymentDetails(data)));
          })
        );
    } else {
      return this.apiService
        .post(api.path, paymentDetails.payload, api.params)
        .pipe(map((data: any) => PaymentHelper.getPaymentDetails(data)));
    }
  }

  addManualPayment(
    transactionType: TransactionTypeEnum,
    subTransactionType: SubTransactionTypeEnum,
    transactionId: string,
    paymentDetails: PaymentType,
    isTcsPayment?: boolean
  ): Observable<PaymentDetails> {
    const requestUrl = getPaymentRequestUrl();

    return this.apiService.post(requestUrl, paymentDetails.payload).pipe(
      map((data: any) => PaymentAdaptor.getROPaymentRequest(data)),
      mergeMap(request => {
        const api = getAddPaymentEndpointUrl(
          transactionType,
          subTransactionType,
          transactionId,
          paymentDetails.mode,
          paymentDetails.group,
          isTcsPayment
        );

        let paymentData;
        if (paymentDetails.mode === PaymentModeEnum.AIRPAY) {
          paymentDetails = paymentDetails as AirpayManualPayment;

          paymentData = {
            amount: paymentDetails.payload.amount,
            reference1: paymentDetails.payload.reference1,
            reference2: paymentDetails.payload.reference2,
            reference3: paymentDetails.payload.reference3,

            instrumentDate: paymentDetails.payload.instrumentDate,
            otherDetails: {
              data: {
                paymentRequestId: request.id
              },
              type: PaymentModeEnum.AIRPAY
            }
          };
        } else if (paymentDetails.mode === PaymentModeEnum.RAZOR_PAY) {
          paymentDetails = paymentDetails as RazorPayManualPayment;
          paymentData = {
            amount: paymentDetails.payload.amount,
            reference1: paymentDetails.payload.reference1,
            reference2: paymentDetails.payload.reference2,
            reference3: paymentDetails.payload.reference3,

            instrumentDate: paymentDetails.payload.instrumentDate,
            otherDetails: {
              data: {
                paymentRequestId: request.id
              },
              type: PaymentModeEnum.RAZOR_PAY
            }
          };
        } else {
          paymentDetails = paymentDetails as ROManualPayment;
          paymentData = {
            amount: paymentDetails.payload.amount,
            instrumentDate: paymentDetails.payload.instrumentDate,
            bankName: paymentDetails.payload.approvedBy,
            reference1: request.referenceId,
            reference2: request.id,
            remarks: paymentDetails.payload.requestedReason
          };
        }

        return this.apiService
          .post(api.path, paymentData, api.params)
          .pipe(map((data: any) => PaymentHelper.getPaymentDetails(data)));
      })
    );
  }

  sendROPaymentRquest(
    request: IntegratedPaymentRequestPayload
  ): Observable<PaymentRequest> {
    const requestUrl = getPaymentRequestUrl();

    return this.apiService
      .post(requestUrl, request)
      .pipe(map((data: any) => PaymentAdaptor.getROPaymentRequest(data)));
  }

  editPayment(
    transactionType: TransactionTypeEnum,
    subTransactionType: SubTransactionTypeEnum,
    paymentId: string,
    details: CashPaymentPayload
  ): Observable<PaymentDetails> {
    const api = getEditPaymentEndpointUrl(
      transactionType,
      subTransactionType,
      paymentId,
      PaymentStatusEnum.COMPLETED
    );

    return this.apiService
      .patch(api.path, details, api.params)
      .pipe(map((data: any) => PaymentHelper.getPaymentDetails(data)));
  }

  deletePayment(
    transactionType: TransactionTypeEnum,
    subTransactionType: SubTransactionTypeEnum,
    paymentId: string
  ): Observable<PaymentDetails> {
    const api = getPaymentEndpointUrl(
      transactionType,
      subTransactionType,
      paymentId
    );
    return this.apiService
      .delete(api.path, api.params)
      .pipe(map((data: any) => PaymentHelper.getPaymentDetails(data)));
  }

  loadPaymentDetails(
    transactionID: string,
    transactionType: TransactionTypeEnum,
    subTransactionType: SubTransactionTypeEnum
  ): Observable<PaymentDetails[]> {
    const api = getLoadPaymentDetailsEndpointUrl(
      transactionID,
      transactionType,
      subTransactionType
    );
    return this.apiService
      .get(api.path, api.params)
      .pipe(map((data: any) => PaymentHelper.getPaymentList(data)));
  }

  loadCreditNoteDetails(
    transactionID: string,
    type: string
  ): Observable<CNListResponsePayload[]> {
    const api = getLoadCreditNoteDetailsEndpointUrl(transactionID, type);
    return this.apiService
      .get(api.path, api.params)
      .pipe(map((data: any) => data.results));
  }

  loadPayeeBanks(): Observable<string[]> {
    const bankPrioritiesApi = getBankPrioritiesEndpointUrl();
    const payeeBankApi = getPayeeBanksEndpointUrl(PaymentModeEnum.CARD);

    return this.apiService
      .get(bankPrioritiesApi)
      .pipe(map((data: any) => PaymentHelper.getPayeeBanks(data)))
      .pipe(
        mergeMap(bankPriorities =>
          this.apiService
            .get(payeeBankApi.path, payeeBankApi.params)
            .pipe(
              map((data: any) =>
                PaymentHelper.createPayeeBankList(bankPriorities, data.results)
              )
            )
        )
      );
  }

  loadPayerBanks(paymentMode: PaymentModeEnum): Observable<PaymentConfig> {
    const api = getPayerBanksEndpointUrl(paymentMode);
    return this.apiService
      .get(api.path, api.params)
      .pipe(map((data: any) => PaymentHelper.getPayerBanks(data)));
  }

  loadEncirclePoints(customerId: string): Observable<number> {
    const api = getCustomerUrl(customerId);
    return this.apiService
      .get(api)
      .pipe(map((data: any) => (data?.pointBalance ? data.pointBalance : 0)));
  }

  getMaxCashLimit(
    transactionType: TransactionTypeEnum,
    subTransactionType: SubTransactionTypeEnum,
    customerId: string,
    paymentCode: PaymentModeEnum,
    paymentGroup: PaymentGroupEnum,
    transactionId: string
  ): Observable<CashLimitDetails> {
    const api = getMaxCashLimitEndpointUrl(
      transactionType,
      subTransactionType,
      customerId,
      paymentCode,
      paymentGroup,
      transactionId
    );
    return this.apiService
      .get(api.path, api.params)
      .pipe(map((data: any) => PaymentAdaptor.getCashLimtCheckDetails(data)));
  }

  getCashLimitCap(): Observable<MaxCashAmountDetails> {
    const api = getCashLimitCapUrl('CASH_CONFIGURATION');
    return this.apiService
      .post(api.path, api.params)
      .pipe(map((data: any) => PaymentAdaptor.getMaxCashAmountDetails(data)));
  }

  getGVBalance(
    payload: GVStatusListingPayload
  ): Observable<GVStatusUpdateList> {
    const url = getGVBalanceUrl(payload);
    return this.apiService
      .get(url.path, url.params)
      .pipe(map((data: any) => PaymentAdaptor.GVBalanceDetails(data)));
  }

  getQCGCBalance(request: QCGCGetBalancePayload): Observable<QCGCCardDetails> {
    const firstApiUrl = getQCGCPaymentEndpointURl(request);
    const secondApiUrl = getQCGCProductGroupEndpointURl(request);

    const firstapi$ = this.apiService.get(firstApiUrl.path, firstApiUrl.params);
    const secondapi$ = this.apiService.get(
      secondApiUrl.path,
      secondApiUrl.params
    );

    return forkJoin([firstapi$, secondapi$]).pipe(
      map((data: any) => PaymentAdaptor.getQCGCCardBalanceDetails(data))
    );
  }
  getGHSeVoucherCustomerBalance(
    request: QCGCGetBalancePayload
  ): Observable<GHSeVoucherDetails> {
    const firstApiUrl = getQCGCPaymentCustomerEndpointURl(request);
    const secondApiUrl = getQCGCProductGroupEndpointURl(request);

    const firstapi$ = this.apiService.get(firstApiUrl.path, firstApiUrl.params);
    const secondapi$ = this.apiService.get(
      secondApiUrl.path,
      secondApiUrl.params
    );

    return forkJoin([firstapi$, secondapi$]).pipe(
      map((data: any) => PaymentAdaptor.getGHSeVoucherBalanceDetails(data))
    );
  }

  resendPaymentLink(paymentRequestId: string): Observable<PaymentRequest> {
    // const api = getEditPaymentEndpointUrl(
    //   transactionType,
    //   subTransactionType,
    //   paymentId,
    //   status
    // );
    // return this.apiService
    //   .patch(api.path, details, api.params)
    //   .pipe(map((data: any) => PaymentHelper.getPaymentDetails(data)));

    const requestUrl = getROPaymentRequestStatusURLByID(paymentRequestId);

    return this.apiService
      .put(requestUrl)
      .pipe(map((data: any) => PaymentAdaptor.getROPaymentRequest(data)));
  }

  validatePayment(
    transactionType: TransactionTypeEnum,
    subTransactionType: SubTransactionTypeEnum,
    paymentID: string,
    inputValue?: string
  ) {
    const api = validatePaymentEndpointUrl(
      transactionType,
      subTransactionType,
      paymentID,
      inputValue
    );
    return this.apiService
      .get(api.path, api.params)
      .pipe(map((data: any) => PaymentHelper.getPaymentDetails(data)));
  }

  validateIntegratedPayment(
    paymentRequestId: string
  ): Observable<PaymentRequest> {
    const requestUrl = getROPaymentRequestStatusURLByID(paymentRequestId);

    return this.apiService
      .get(requestUrl)
      .pipe(map((data: any) => PaymentAdaptor.getROPaymentRequest(data)));
  }

  getDigiBalance(request: DigiGetBalancePayload) {
    const api = getDigiBalanceEndpointURl(request);
    return this.apiService
      .get(api.path, api.params)
      .pipe(map((data: any) => PaymentAdaptor.getDigiBalanceResponse(data)));
  }

  getDigiPrice(request: DigiGetBalancePayload) {
    const api = getDigiPriceEndpointURl(request);
    return this.apiService
      .get(api.path, api.params)
      .pipe(map((data: any) => PaymentAdaptor.getDigiPriceResponse(data)));
  }

  generateDigiOtp(request: GenerateOtpDigiGoldPayload) {
    const api = generateDigiOtpEndpointURl(request);
    return this.apiService
      .get(api.path, api.params)
      .pipe(map((data: any) => data));
  }

  ValidateDigiOtp(request: GenerateOtpDigiGoldPayload) {
    const api = validateDigiOtpEndpointURl(request);
    return this.apiService
      .get(api.path, api.params)
      .pipe(map((data: any) => data));
  }

  confirmPayment(
    transactionType: TransactionTypeEnum,
    subTransactionType: SubTransactionTypeEnum,
    paymentId: string,
    details: CashPaymentPayload,
    PaymentMode: PaymentModeEnum
  ): Observable<PaymentDetails> {
    if (PaymentMode === PaymentModeEnum.LINKED_CN) {
      const api = getConfirmlinkedCNPaymentEndpointUrl(
        transactionType,
        subTransactionType,
        paymentId
      );

      return this.apiService.put(api.path, {}, api.params).pipe(
        map((data: any) => {
          return PaymentAdaptor.getLinkedCNPaymentDetails(data);
        })
      );
    } else {
      const api = getConfirmPaymentEndpointUrl(
        transactionType,
        subTransactionType,
        paymentId,
        PaymentStatusEnum.COMPLETED
      );

      return this.apiService.put(api.path, {}, api.params).pipe(
        map((data: any) => {
          return PaymentHelper.getPaymentDetails(data);
        })
      );
    }
  }

  loadCMRequestPaymentDetails(
    processId: string,
    taskId: string,
    taskName: string,
    workflowType: string
  ): Observable<PaymentDetails[]> {
    const url = getCmRequestDetailsUrl(
      processId,
      taskId,
      taskName,
      workflowType
    );

    return this.apiService.get(url.path, url.params).pipe(
      map((data: any) =>
        PaymentHelper.getPaymentList({
          results: data?.approvedData?.data?.paymentList
        })
      )
    );
  }

  loadCreditNoteList(
    cnListRequestPaylaod: CNListRequestPayload
  ): Observable<CNListResponse> {
    const ruleType = ConfigTypeEnum.CN_PRIORITY_CONFIG;

    const cnPriorityUrl = getCnPriorityUrl(ruleType);
    const cnListUrl = getCnRequestListUrl(
      cnListRequestPaylaod.customerId,
      cnListRequestPaylaod.isPageable,
      cnListRequestPaylaod.isFrozenRateCnRequired,
      cnListRequestPaylaod?.status
    );

    return this.apiService
      .post(cnPriorityUrl, {
        locationCode: cnListRequestPaylaod.locationCode
      })
      .pipe(map(data => data.priorityDetails))
      .pipe(
        mergeMap(cnPriorities =>
          this.apiService
            .get(cnListUrl.path, cnListUrl.params)
            .pipe(
              map((data: any) =>
                PaymentHelper.getCNListResponse(cnPriorities, data)
              )
            )
        )
      );
  }

  invokeCN(
    invokeCNRequestPayload: InvokeCNRequestPayload
  ): Observable<CNListResponse> {
    const ruleType = ConfigTypeEnum.CN_PRIORITY_CONFIG;

    const cnPriorityUrl = getCnPriorityUrl(ruleType);
    const cnListUrl = getInvokeCNUrl(
      invokeCNRequestPayload.cnNumber,
      invokeCNRequestPayload.fiscalYear
    );

    return this.apiService
      .post(cnPriorityUrl, {
        locationCode: invokeCNRequestPayload.locationCode
      })
      .pipe(map(data => data.priorityDetails))
      .pipe(
        mergeMap(cnPriorities =>
          this.apiService
            .get(cnListUrl.path, cnListUrl.params)
            .pipe(
              map((data: any) =>
                PaymentHelper.getCNListResponse(cnPriorities, data)
              )
            )
        )
      );
  }

  getThirdPartyCnList(
    cnListRequestPaylaod: ThirdPartyCNRequestPayload
  ): Observable<CNListResponse> {
    const ruleType = ConfigTypeEnum.CN_PRIORITY_CONFIG;

    const cnPriorityUrl = getCnPriorityUrl(ruleType);
    const cnListUrl = getThirdPartyCnRequestListUrl(
      cnListRequestPaylaod.customerIds,
      cnListRequestPaylaod.isPageable
    );

    return this.apiService
      .post(cnPriorityUrl, {
        locationCode: cnListRequestPaylaod.locationCode
      })
      .pipe(map(data => data.priorityDetails))
      .pipe(
        mergeMap(cnPriorities =>
          this.apiService
            .get(cnListUrl.path, cnListUrl.params)
            .pipe(
              map((data: any) =>
                PaymentHelper.getCNListResponse(cnPriorities, data)
              )
            )
        )
      );
  }

  generateOTPForCN(payload: GenerateOtpPayload) {
    const api = generateOTPForCnUrl(payload.id, payload.otpType);
    return this.apiService.post(api.path, {}, api.params);
  }
  getGHSAccountDetails(accNo: string): Observable<GHSAccountDetails> {
    const url = getGHSAccountDetailsEndpointURl(accNo, 'GHS');
    return this.apiService
      .get(url.path, url.params)
      .pipe(map((data: any) => PaymentAdaptor.getGHSAccountDetails(data)));
  }
  getGHSAttachments(
    payload: GHSAttachmentsPayload
  ): Observable<GHSAttachments[]> {
    const url = getGHSAttachmentsEndpointURl(
      payload.accountNumber,
      payload.customerId,
      'GHS'
    );
    return this.apiService
      .get(url.path, url.params)
      .pipe(map((data: any) => PaymentAdaptor.getGHSAttachments(data)));
  }

  getCreditNoteDetailById(id: string): Observable<CreditNoteDetail> {
    const url = getCreditNoteDetailByIdUrl(id);
    return this.apiService.get(url).pipe(map(data => data));
  }

  getDiscountIdsInCreditNote(id: string): Observable<string[]> {
    const url = getCreditNoteDetailByIdUrl(id);
    return this.apiService.get(url).pipe(
      map((data: CreditNoteDetail) => {
        let discountIds = [];
        if (data && data.discountDetails && data.discountDetails.data) {
          if (data.discountDetails.data.karatageExchangeDiscount) {
            data.discountDetails.data.karatageExchangeDiscount.forEach(
              discount => {
                discountIds.push(discount.discountId);
              }
            );
          }
          if (data.discountDetails.data.coinOfferDiscount) {
            data.discountDetails.data.coinOfferDiscount.forEach(discount => {
              discountIds.push(discount.discountId);
            });
          }
          if (data.discountDetails.data?.ghsAccountDiscount) {
            discountIds.push(
              data.discountDetails.data.ghsAccountDiscount.discountId
            );
          }
          if (data.discountDetails.data?.systemDiscountDv) {
            discountIds.push(
              data.discountDetails.data.systemDiscountDv.discountId
            );
          }
          if (data.discountDetails.data?.grnMultipleDiscount) {
            discountIds.push(
              data.discountDetails.data.grnMultipleDiscount.discountId
            );
          }
          if (data.discountDetails.data.gepPurityDiscount) {
            data.discountDetails.data.gepPurityDiscount.forEach(discount => {
              discountIds.push(discount.discountId);
            });
          } else if (discountIds.length === 0) {
            discountIds = ['NA'];
          }
        } else {
          discountIds = ['NA'];
        }
        return discountIds;
      })
    );
  }

  getEmpLoanDetails(
    payload: LoadEmployeeDetailsPayload
  ): Observable<EmployeeLoanConfigList> {
    const url = getEmpLoanDetailsUrl(payload.empId, payload.customerId);

    return this.apiService
      .post(url.path, {}, url.params)
      .pipe(
        map((data: any) =>
          EmployeeLoanConfigurationAdaptor.employeeLoanDetails(data)
        )
      );
  }

  getCahbacOfferkBankDetail() {
    const url = getCahbacOfferkBankDetailUrl();

    return this.apiService
      .get(url)
      .pipe(map((data: any) => PaymentAdaptor.getCashbackBankDetailJson(data)));
  }

  getCashBackConfigDetails(offerId) {
    const url = getCashBackConfigDetailsUrl(offerId);

    return this.apiService
      .get(url)
      .pipe(map((data: any) => PaymentAdaptor.cashBackConfigDetailJson(data)));
  }

  validateCashbackCard(requestPayload: ValidateCashBackPayload) {
    const url = validateCashbackCardUrl(requestPayload.offerId);
    return this.apiService.get(getActiveAccessTokenEndpointUrl(this.env)).pipe(
      concatMap(key => {
        const instrumentNo = this.cryptoService.encryptPassword(
          key.publicKey,
          requestPayload.cardNumber
        );

        requestPayload = {
          ...requestPayload,
          cardNumber: instrumentNo
        };
        return this.apiService
          .post(url, requestPayload)
          .pipe(map((data: any) => data));
      })
    );
  }

  updatePaymentStatusForVoidUnipay(
    payload: UpdatePaymentDetailsForVoidUnipayPayload
  ) {
    const url = updatePaymentStatusForVoidUnipayUrl(
      payload.txnType,
      payload.subTxnType,
      payload.txnId,
      payload.paymentIds
    );

    return this.apiService
      .put(url.path, {}, url.params)
      .pipe(map((data: any) => data));
  }

  updateCNStatusForVoidUnipay(payload: string) {
    const url = updateCNStatusForVoidUnipayUrl(payload);

    return this.apiService
      .get(url.path, url.params)
      .pipe(map((data: any) => data));
  }
}
